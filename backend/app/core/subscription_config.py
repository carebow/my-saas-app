"""
Subscription configuration and price mapping for Stripe integration.
"""
from typing import Dict, Optional
from app.models.user import SubscriptionTier

# Subscription plan configuration
# Maps Stripe price IDs to subscription tiers and entitlements
SUBSCRIPTION_PLANS: Dict[str, Dict] = {
    # Test Environment Price IDs
    "price_test_basic_monthly": {
        "tier": SubscriptionTier.BASIC,
        "consultations_limit": 50,
        "name": "Basic Monthly",
        "price_cents": 999,
        "billing_period": "month"
    },
    "price_test_premium_monthly": {
        "tier": SubscriptionTier.PREMIUM,
        "consultations_limit": -1,  # -1 = unlimited
        "name": "Premium Monthly", 
        "price_cents": 1999,
        "billing_period": "month"
    },
    "price_test_premium_annual": {
        "tier": SubscriptionTier.PREMIUM,
        "consultations_limit": -1,  # -1 = unlimited
        "name": "Premium Annual",
        "price_cents": 19999,
        "billing_period": "year"
    },
    
    # Production Environment Price IDs (to be updated with actual Stripe price IDs)
    "price_live_basic_monthly": {
        "tier": SubscriptionTier.BASIC,
        "consultations_limit": 50,
        "name": "Basic Monthly",
        "price_cents": 999,
        "billing_period": "month"
    },
    "price_live_premium_monthly": {
        "tier": SubscriptionTier.PREMIUM,
        "consultations_limit": -1,
        "name": "Premium Monthly",
        "price_cents": 1999,
        "billing_period": "month"
    },
    "price_live_premium_annual": {
        "tier": SubscriptionTier.PREMIUM,
        "consultations_limit": -1,
        "name": "Premium Annual",
        "price_cents": 19999,
        "billing_period": "year"
    }
}

# Default limits for each tier
DEFAULT_CONSULTATION_LIMITS = {
    SubscriptionTier.FREE: 3,
    SubscriptionTier.BASIC: 50,
    SubscriptionTier.PREMIUM: -1,  # -1 = unlimited
    SubscriptionTier.ENTERPRISE: -1
}


def get_plan_config(price_id: str) -> Optional[Dict]:
    """
    Get subscription plan configuration by Stripe price ID.
    
    Args:
        price_id: Stripe price ID
        
    Returns:
        Plan configuration dict or None if not found
    """
    return SUBSCRIPTION_PLANS.get(price_id)


def get_tier_from_price_id(price_id: str) -> SubscriptionTier:
    """
    Get subscription tier from Stripe price ID.
    
    Args:
        price_id: Stripe price ID
        
    Returns:
        SubscriptionTier enum value, defaults to BASIC if not found
    """
    plan_config = get_plan_config(price_id)
    if plan_config:
        return plan_config["tier"]
    
    # Default to BASIC if price_id not found (with logging)
    import logging
    logger = logging.getLogger(__name__)
    logger.error(f"Unknown price_id: {price_id}, defaulting to BASIC tier")
    return SubscriptionTier.BASIC


def get_consultation_limit(price_id: str) -> int:
    """
    Get consultation limit from Stripe price ID.
    
    Args:
        price_id: Stripe price ID
        
    Returns:
        Consultation limit (-1 for unlimited, positive number for limit)
    """
    plan_config = get_plan_config(price_id)
    if plan_config:
        return plan_config["consultations_limit"]
    
    # Default to BASIC limit if price_id not found
    return DEFAULT_CONSULTATION_LIMITS[SubscriptionTier.BASIC]


def is_unlimited_consultations(consultations_limit: int) -> bool:
    """
    Check if consultation limit represents unlimited consultations.
    
    Args:
        consultations_limit: The consultation limit value
        
    Returns:
        True if unlimited, False if limited
    """
    return consultations_limit == -1


def get_remaining_consultations(consultations_used: int, consultations_limit: int) -> int:
    """
    Calculate remaining consultations for a user.
    
    Args:
        consultations_used: Number of consultations used
        consultations_limit: Consultation limit (-1 for unlimited)
        
    Returns:
        Remaining consultations (-1 for unlimited, 0+ for actual remaining)
    """
    if is_unlimited_consultations(consultations_limit):
        return -1  # Unlimited
    
    return max(0, consultations_limit - consultations_used)


def can_create_consultation(consultations_used: int, consultations_limit: int) -> bool:
    """
    Check if user can create a new consultation.
    
    Args:
        consultations_used: Number of consultations used
        consultations_limit: Consultation limit (-1 for unlimited)
        
    Returns:
        True if user can create consultation, False otherwise
    """
    if is_unlimited_consultations(consultations_limit):
        return True
    
    return consultations_used < consultations_limit


def get_tier_display_name(tier: SubscriptionTier) -> str:
    """
    Get display name for subscription tier.
    
    Args:
        tier: SubscriptionTier enum value
        
    Returns:
        Human-readable tier name
    """
    display_names = {
        SubscriptionTier.FREE: "Free",
        SubscriptionTier.BASIC: "Basic",
        SubscriptionTier.PREMIUM: "Premium",
        SubscriptionTier.ENTERPRISE: "Enterprise"
    }
    return display_names.get(tier, tier.value.title())