"""
Environment-specific Stripe price ID configuration.
"""
import os
from typing import Dict

def get_stripe_price_ids() -> Dict[str, str]:
    """
    Get Stripe price IDs based on environment.
    
    Returns:
        Dictionary mapping plan types to Stripe price IDs
    """
    environment = os.getenv("ENVIRONMENT", "development").lower()
    
    if environment in ["production", "prod"]:
        # Production Stripe price IDs
        return {
            "basic_monthly": os.getenv("STRIPE_PRICE_BASIC_MONTHLY", "price_live_basic_monthly"),
            "premium_monthly": os.getenv("STRIPE_PRICE_PREMIUM_MONTHLY", "price_live_premium_monthly"),
            "premium_annual": os.getenv("STRIPE_PRICE_PREMIUM_ANNUAL", "price_live_premium_annual"),
        }
    else:
        # Test/Development Stripe price IDs
        return {
            "basic_monthly": os.getenv("STRIPE_PRICE_BASIC_MONTHLY", "price_test_basic_monthly"),
            "premium_monthly": os.getenv("STRIPE_PRICE_PREMIUM_MONTHLY", "price_test_premium_monthly"),
            "premium_annual": os.getenv("STRIPE_PRICE_PREMIUM_ANNUAL", "price_test_premium_annual"),
        }


def get_price_id_for_plan(plan_type: str) -> str:
    """
    Get Stripe price ID for a specific plan type.
    
    Args:
        plan_type: Plan type (basic_monthly, premium_monthly, premium_annual)
        
    Returns:
        Stripe price ID
        
    Raises:
        ValueError: If plan_type is not supported
    """
    price_ids = get_stripe_price_ids()
    
    if plan_type not in price_ids:
        raise ValueError(f"Unsupported plan type: {plan_type}. Supported types: {list(price_ids.keys())}")
    
    return price_ids[plan_type]


# Export current price IDs for easy access
CURRENT_PRICE_IDS = get_stripe_price_ids()