from sqlalchemy import Boolean, Column, Integer, String, DateTime, Text, Enum, TypeDecorator
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum

from app.db.base_class import Base
from app.core.encryption import get_encryption


class EncryptedString(TypeDecorator):
    """Custom SQLAlchemy type for encrypted string fields."""
    impl = String
    cache_ok = True

    def __init__(self, *args, **kwargs):
        self.encryption = get_encryption()
        super().__init__(*args, **kwargs)

    def process_bind_param(self, value, dialect):
        if value is not None:
            return self.encryption.encrypt(value)
        return value

    def process_result_value(self, value, dialect):
        if value is not None:
            return self.encryption.decrypt(value)
        return value


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
    
    # Profile information (encrypted for HIPAA compliance)
    phone = Column(EncryptedString(255))
    date_of_birth = Column(DateTime)  # Keep as datetime for queries
    gender = Column(EncryptedString(50))
    emergency_contact = Column(EncryptedString(500))
    
    # Subscription
    subscription_tier = Column(Enum(SubscriptionTier), default=SubscriptionTier.FREE)
    subscription_active = Column(Boolean, default=False)
    stripe_customer_id = Column(String)
    
    # Usage tracking
    consultations_used = Column(Integer, default=0)
    consultations_limit = Column(Integer, default=3)  # Free tier limit
    
    # Multi-Factor Authentication
    mfa_enabled = Column(Boolean, default=False)
    mfa_secret = Column(EncryptedString(255))  # TOTP secret (encrypted)
    backup_codes = Column(EncryptedString(2000))  # JSON array of hashed backup codes (encrypted)
    last_mfa_used = Column(DateTime(timezone=True))
    
    # Security & Compliance
    failed_login_attempts = Column(Integer, default=0)
    account_locked_until = Column(DateTime(timezone=True))
    password_changed_at = Column(DateTime(timezone=True), server_default=func.now())
    last_login_at = Column(DateTime(timezone=True))
    last_login_ip = Column(String(45))  # IPv4/IPv6
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    health_profiles = relationship("HealthProfile", back_populates="user")
    consultations = relationship("Consultation", back_populates="user")
    conversations = relationship("Conversation", back_populates="user")
    blog_posts = relationship("BlogPost", back_populates="author")