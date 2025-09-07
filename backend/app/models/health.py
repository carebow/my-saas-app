from sqlalchemy import Column, Integer, String, DateTime, Text, JSON, ForeignKey, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.db.base_class import Base
from app.models.user import EncryptedString


class HealthProfile(Base):
    __tablename__ = "health_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Basic health info (encrypted for HIPAA compliance)
    height = Column(EncryptedString(100))  # e.g., "5'8\""
    weight = Column(EncryptedString(100))  # e.g., "150 lbs"
    blood_type = Column(EncryptedString(20))
    allergies = Column(EncryptedString(2000))
    medications = Column(EncryptedString(2000))
    medical_conditions = Column(EncryptedString(2000))
    
    # Ayurvedic profile
    dosha_primary = Column(String)  # Vata, Pitta, Kapha
    dosha_secondary = Column(String)
    constitution_analysis = Column(JSON)
    
    # Lifestyle
    diet_preferences = Column(JSON)
    exercise_routine = Column(Text)
    sleep_pattern = Column(String)
    stress_level = Column(String)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="health_profiles")


class Consultation(Base):
    __tablename__ = "consultations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Consultation details (encrypted for HIPAA compliance)
    symptoms = Column(EncryptedString(5000))
    ai_analysis = Column(EncryptedString(5000))
    recommendations = Column(Text)  # JSON stored as text, encrypted
    ayurvedic_insights = Column(Text)  # JSON stored as text, encrypted
    
    # Metadata
    consultation_type = Column(String)  # "symptom_analysis", "general_health", etc.
    duration_minutes = Column(Integer)
    satisfaction_rating = Column(Integer)  # 1-5 stars
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="consultations")


class HealthMetric(Base):
    __tablename__ = "health_metrics"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Metric details (encrypted for HIPAA compliance)
    metric_type = Column(String)  # "blood_pressure", "weight", "glucose", etc.
    value = Column(EncryptedString(100))
    unit = Column(String)
    notes = Column(EncryptedString(1000))
    
    # Timestamps
    recorded_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User")


class AuditLog(Base):
    """HIPAA-compliant audit logging for all data access."""
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    # Audit Information
    action = Column(String(100), nullable=False)  # "created", "read", "updated", "deleted"
    resource_type = Column(String(50), nullable=False)  # "health_profile", "consultation"
    resource_id = Column(Integer)  # ID of the affected resource
    
    # Request Context
    ip_address = Column(String(45))  # IPv4/IPv6 address
    user_agent = Column(String(500))  # Browser/app information
    endpoint = Column(String(200))  # API endpoint accessed
    
    # Metadata
    details = Column(JSON)  # Additional context
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User")