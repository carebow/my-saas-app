from typing import Any
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
import stripe
import logging

from app.api import deps
from app.core.config import settings
from app.models.user import User, SubscriptionTier
from app.schemas.payments import SubscriptionCreate, SubscriptionResponse
from app.core.subscription_config import (
    get_tier_from_price_id,
    get_consultation_limit,
    get_plan_config
)

router = APIRouter()
logger = logging.getLogger(__name__)

# Initialize Stripe
stripe.api_key = settings.STRIPE_SECRET_KEY


def _get_attr(obj, name, default=None):
    """Safely get attribute from Stripe object or dict (for testing)."""
    return obj.get(name, default) if isinstance(obj, dict) else getattr(obj, name, default)


@router.post("/create-subscription", response_model=SubscriptionResponse)
def create_subscription(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
    subscription_in: SubscriptionCreate,
) -> Any:
    """
    Create a new subscription.
    """
    try:
        # Create or get Stripe customer
        if not current_user.stripe_customer_id:
            customer = stripe.Customer.create(
                email=current_user.email,
                name=current_user.full_name,
            )
            customer_id = _get_attr(customer, "id")
            if not customer_id:
                raise HTTPException(status_code=502, detail="Stripe customer id missing")
            
            current_user.stripe_customer_id = customer_id
            db.add(current_user)
            db.commit()
            db.refresh(current_user)
        
        # Create subscription
        subscription = stripe.Subscription.create(
            customer=current_user.stripe_customer_id,
            items=[{"price": subscription_in.price_id}],
            payment_behavior="default_incomplete",
            expand=["latest_invoice.payment_intent"],
        )
        
        # Extract data safely from Stripe response
        sub_id = _get_attr(subscription, "id")
        latest_invoice = (_get_attr(subscription, "latest_invoice") if isinstance(subscription, dict) 
                         else getattr(subscription, "latest_invoice", None))
        payment_intent = (_get_attr(latest_invoice, "payment_intent") if isinstance(latest_invoice, dict)
                         else getattr(latest_invoice, "payment_intent", None))
        client_secret = _get_attr(payment_intent, "client_secret")
        
        if not client_secret:
            raise HTTPException(status_code=502, detail="Stripe client secret missing")
        
        return SubscriptionResponse(
            subscription_id=sub_id,
            client_secret=client_secret,
            status=_get_attr(subscription, "status", "incomplete"),
        )
        
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/webhook")
async def stripe_webhook(request: Request, db: Session = Depends(deps.get_db)):
    """
    Handle Stripe webhooks with proper price-to-tier mapping.
    """
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
    except ValueError:
        logger.error("Invalid webhook payload received")
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError:
        logger.error("Invalid webhook signature")
        raise HTTPException(status_code=400, detail="Invalid signature")
    
    logger.info(f"Processing webhook event: {event['type']}")
    
    # Handle successful payment
    if event["type"] == "invoice.payment_succeeded":
        invoice = event["data"]["object"]
        customer_id = invoice["customer"]
        subscription_id = invoice["subscription"]
        
        # Get subscription details to extract price_id
        try:
            subscription = stripe.Subscription.retrieve(subscription_id)
            price_id = subscription["items"]["data"][0]["price"]["id"]
            
            logger.info(f"Processing successful payment for customer {customer_id}, price_id: {price_id}")
            
            # Get plan configuration from price_id
            plan_config = get_plan_config(price_id)
            if not plan_config:
                logger.error(f"Unknown price_id: {price_id}, using default Basic tier")
                tier = SubscriptionTier.BASIC
                consultations_limit = 50
            else:
                tier = plan_config["tier"]
                consultations_limit = plan_config["consultations_limit"]
                logger.info(f"Mapped price_id {price_id} to tier {tier.value}, limit {consultations_limit}")
            
            # Update user subscription status
            user = db.query(User).filter(User.stripe_customer_id == customer_id).first()
            if user:
                user.subscription_active = True
                user.subscription_tier = tier
                user.consultations_limit = consultations_limit
                db.commit()
                
                logger.info(f"Updated user {user.id} subscription: tier={tier.value}, limit={consultations_limit}")
            else:
                logger.error(f"User not found for Stripe customer {customer_id}")
                
        except Exception as e:
            logger.error(f"Error processing successful payment webhook: {str(e)}")
            # Don't raise exception to avoid webhook retry loops
    
    # Handle failed payment
    elif event["type"] == "invoice.payment_failed":
        invoice = event["data"]["object"]
        customer_id = invoice["customer"]
        
        logger.info(f"Processing failed payment for customer {customer_id}")
        
        # Handle failed payment - could implement grace period logic here
        user = db.query(User).filter(User.stripe_customer_id == customer_id).first()
        if user:
            # For now, immediately deactivate subscription
            # In production, you might want a grace period
            user.subscription_active = False
            # Optionally reset to free tier limits
            user.subscription_tier = SubscriptionTier.FREE
            user.consultations_limit = 3
            db.commit()
            
            logger.info(f"Deactivated subscription for user {user.id} due to payment failure")
        else:
            logger.error(f"User not found for failed payment, customer {customer_id}")
    
    # Handle subscription cancellation
    elif event["type"] == "customer.subscription.deleted":
        subscription = event["data"]["object"]
        customer_id = subscription["customer"]
        
        logger.info(f"Processing subscription cancellation for customer {customer_id}")
        
        user = db.query(User).filter(User.stripe_customer_id == customer_id).first()
        if user:
            user.subscription_active = False
            user.subscription_tier = SubscriptionTier.FREE
            user.consultations_limit = 3
            db.commit()
            
            logger.info(f"Cancelled subscription for user {user.id}")
        else:
            logger.error(f"User not found for subscription cancellation, customer {customer_id}")
    
    else:
        logger.info(f"Unhandled webhook event type: {event['type']}")
    
    return {"status": "success"}


@router.get("/subscription-status", response_model=dict)
def get_subscription_status(
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get current subscription status with enhanced information.
    """
    from app.core.subscription_config import (
        is_unlimited_consultations,
        get_remaining_consultations,
        get_tier_display_name
    )
    
    remaining = get_remaining_consultations(
        current_user.consultations_used,
        current_user.consultations_limit
    )
    
    return {
        "subscription_tier": current_user.subscription_tier.value,
        "subscription_tier_display": get_tier_display_name(current_user.subscription_tier),
        "subscription_active": current_user.subscription_active,
        "consultations_used": current_user.consultations_used,
        "consultations_limit": current_user.consultations_limit,
        "consultations_remaining": remaining,
        "is_unlimited": is_unlimited_consultations(current_user.consultations_limit),
        "can_create_consultation": remaining > 0 or is_unlimited_consultations(current_user.consultations_limit)
    }