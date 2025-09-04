from pydantic import BaseModel
from typing import Optional

class SubscriptionCreate(BaseModel):
    price_id: str

class SubscriptionResponse(BaseModel):
    subscription_id: str
    client_secret: str
    status: str

class SubscriptionStatusResponse(BaseModel):
    subscription_tier: str
    subscription_tier_display: str
    subscription_active: bool
    consultations_used: int
    consultations_limit: int
    consultations_remaining: int
    is_unlimited: bool
    can_create_consultation: bool
    stripe_customer_id: Optional[str] = None