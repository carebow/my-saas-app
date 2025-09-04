from sqlalchemy import Boolean, Column, Integer, String, DateTime, Text, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum

from app.db.base_class import Base


class SubscriptionTier(str, enum.Enum):
    FREE = "free"
    BASIC = "basic"
    PREMIUM = "premium"
    ENTERPRISE = "enterprise"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, index=True)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    is_verified = Column(Boolean, default=False)
    
    # Profile information
    phone = Column(String)
    date_of_birth = Column(DateTime)
    gender = Column(String)
    emergency_contact = Column(String)
    
    # Subscription
    subscription_tier = Column(Enum(SubscriptionTier), default=SubscriptionTier.FREE)
    subscription_active = Column(Boolean, default=False)
    stripe_customer_id = Column(String)
    
    # Usage tracking
    consultations_used = Column(Integer, default=0)
    consultations_limit = Column(Integer, default=3)  # Free tier limit
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    health_profiles = relationship("HealthProfile", back_populates="user")
    consultations = relationship("Consultation", back_populates="user")
    conversations = relationship("Conversation", back_populates="user")