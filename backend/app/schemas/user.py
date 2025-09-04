from typing import Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr
from app.models.user import SubscriptionTier


class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    phone: Optional[str] = None


class UserCreate(UserBase):
    email: EmailStr
    password: str


class UserUpdate(UserBase):
    password: Optional[str] = None


class UserInDBBase(UserBase):
    id: Optional[int] = None
    is_active: Optional[bool] = True
    is_superuser: bool = False
    subscription_tier: SubscriptionTier = SubscriptionTier.FREE
    consultations_used: int = 0
    consultations_limit: int = 3
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class User(UserInDBBase):
    pass


class UserInDB(UserInDBBase):
    hashed_password: str