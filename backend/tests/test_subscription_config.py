"""
Tests for subscription configuration and price mapping.
"""
import pytest
from app.core.subscription_config import (
    get_plan_config,
    get_tier_from_price_id,
    get_consultation_limit,
    is_unlimited_consultations,
    get_remaining_consultations,
    can_create_consultation,
    get_tier_display_name
)
from app.models.user import SubscriptionTier


class TestSubscriptionConfig:
    """Test subscription configuration functions."""
    
    def test_get_plan_config_basic(self):
        """Test getting plan config for basic tier."""
        config = get_plan_config("price_test_basic_monthly")
        
        assert config is not None
        assert config["tier"] == SubscriptionTier.BASIC
        assert config["consultations_limit"] == 50
        assert config["name"] == "Basic Monthly"
        assert config["price_cents"] == 999
    
    def test_get_plan_config_premium(self):
        """Test getting plan config for premium tier."""
        config = get_plan_config("price_test_premium_monthly")
        
        assert config is not None
        assert config["tier"] == SubscriptionTier.PREMIUM
        assert config["consultations_limit"] == -1  # Unlimited
        assert config["name"] == "Premium Monthly"
        assert config["price_cents"] == 1999
    
    def test_get_plan_config_premium_annual(self):
        """Test getting plan config for premium annual tier."""
        config = get_plan_config("price_test_premium_annual")
        
        assert config is not None
        assert config["tier"] == SubscriptionTier.PREMIUM
        assert config["consultations_limit"] == -1  # Unlimited
        assert config["name"] == "Premium Annual"
        assert config["price_cents"] == 19999
    
    def test_get_plan_config_unknown(self):
        """Test getting plan config for unknown price ID."""
        config = get_plan_config("price_unknown_invalid")
        assert config is None
    
    def test_get_tier_from_price_id_basic(self):
        """Test getting tier from basic price ID."""
        tier = get_tier_from_price_id("price_test_basic_monthly")
        assert tier == SubscriptionTier.BASIC
    
    def test_get_tier_from_price_id_premium(self):
        """Test getting tier from premium price ID."""
        tier = get_tier_from_price_id("price_test_premium_monthly")
        assert tier == SubscriptionTier.PREMIUM
    
    def test_get_tier_from_price_id_unknown(self):
        """Test getting tier from unknown price ID defaults to basic."""
        tier = get_tier_from_price_id("price_unknown_invalid")
        assert tier == SubscriptionTier.BASIC
    
    def test_get_consultation_limit_basic(self):
        """Test getting consultation limit for basic tier."""
        limit = get_consultation_limit("price_test_basic_monthly")
        assert limit == 50
    
    def test_get_consultation_limit_premium(self):
        """Test getting consultation limit for premium tier."""
        limit = get_consultation_limit("price_test_premium_monthly")
        assert limit == -1  # Unlimited
    
    def test_get_consultation_limit_unknown(self):
        """Test getting consultation limit for unknown price ID."""
        limit = get_consultation_limit("price_unknown_invalid")
        assert limit == 50  # Default to basic
    
    def test_is_unlimited_consultations(self):
        """Test unlimited consultation detection."""
        assert is_unlimited_consultations(-1) is True
        assert is_unlimited_consultations(0) is False
        assert is_unlimited_consultations(50) is False
        assert is_unlimited_consultations(100) is False
    
    def test_get_remaining_consultations_limited(self):
        """Test remaining consultations for limited tier."""
        # Basic tier with 50 limit
        assert get_remaining_consultations(0, 50) == 50
        assert get_remaining_consultations(25, 50) == 25
        assert get_remaining_consultations(50, 50) == 0
        assert get_remaining_consultations(60, 50) == 0  # Over limit
    
    def test_get_remaining_consultations_unlimited(self):
        """Test remaining consultations for unlimited tier."""
        assert get_remaining_consultations(0, -1) == -1
        assert get_remaining_consultations(100, -1) == -1
        assert get_remaining_consultations(1000, -1) == -1
    
    def test_can_create_consultation_limited(self):
        """Test consultation creation check for limited tier."""
        # Basic tier with 50 limit
        assert can_create_consultation(0, 50) is True
        assert can_create_consultation(25, 50) is True
        assert can_create_consultation(49, 50) is True
        assert can_create_consultation(50, 50) is False
        assert can_create_consultation(60, 50) is False
    
    def test_can_create_consultation_unlimited(self):
        """Test consultation creation check for unlimited tier."""
        assert can_create_consultation(0, -1) is True
        assert can_create_consultation(100, -1) is True
        assert can_create_consultation(1000, -1) is True
    
    def test_get_tier_display_name(self):
        """Test getting display names for tiers."""
        assert get_tier_display_name(SubscriptionTier.FREE) == "Free"
        assert get_tier_display_name(SubscriptionTier.BASIC) == "Basic"
        assert get_tier_display_name(SubscriptionTier.PREMIUM) == "Premium"
        assert get_tier_display_name(SubscriptionTier.ENTERPRISE) == "Enterprise"


class TestSubscriptionLimits:
    """Test subscription limit scenarios."""
    
    @pytest.mark.parametrize("used,limit,expected_remaining,can_create", [
        # Free tier scenarios
        (0, 3, 3, True),
        (1, 3, 2, True),
        (2, 3, 1, True),
        (3, 3, 0, False),
        (4, 3, 0, False),
        
        # Basic tier scenarios
        (0, 50, 50, True),
        (25, 50, 25, True),
        (49, 50, 1, True),
        (50, 50, 0, False),
        (51, 50, 0, False),
        
        # Premium tier scenarios (unlimited)
        (0, -1, -1, True),
        (100, -1, -1, True),
        (1000, -1, -1, True),
    ])
    def test_consultation_limits(self, used, limit, expected_remaining, can_create):
        """Test various consultation limit scenarios."""
        remaining = get_remaining_consultations(used, limit)
        can_create_actual = can_create_consultation(used, limit)
        
        assert remaining == expected_remaining
        assert can_create_actual == can_create