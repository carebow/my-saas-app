from sqlalchemy import Column, Integer, String, DateTime, Text, JSON, ForeignKey, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class HealthProfile(Base):
    __tablename__ = "health_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Basic health info
    height = Column(String)  # e.g., "5'8\""
    weight = Column(String)  # e.g., "150 lbs"
    blood_type = Column(String)
    allergies = Column(Text)
    medications = Column(Text)
    medical_conditions = Column(Text)
    
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
    
    # Consultation details
    symptoms = Column(Text)
    ai_analysis = Column(Text)
    recommendations = Column(JSON)
    ayurvedic_insights = Column(JSON)
    
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
    
    # Metric details
    metric_type = Column(String)  # "blood_pressure", "weight", "glucose", etc.
    value = Column(String)
    unit = Column(String)
    notes = Column(Text)
    
    # Timestamps
    recorded_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User")