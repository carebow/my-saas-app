"""
Symptom tracking and triage models for CareBow.
"""
from sqlalchemy import Column, Integer, String, DateTime, Text, JSON, ForeignKey, Boolean, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum

from app.db.base_class import Base
from app.models.user import EncryptedString


class SessionStatus(str, enum.Enum):
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class ChannelType(str, enum.Enum):
    WEB = "web"
    VOICE = "voice"
    MOBILE = "mobile"


class RiskLevel(str, enum.Enum):
    GREEN = "green"      # Self-care
    YELLOW = "yellow"    # See doctor in 2-3 days
    RED = "red"          # Emergency - seek help now


class SymptomSession(Base):
    """Track symptom analysis sessions."""
    __tablename__ = "symptom_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Session details
    session_uuid = Column(String(36), unique=True, index=True, nullable=False)
    channel = Column(Enum(ChannelType), default=ChannelType.WEB)
    status = Column(Enum(SessionStatus), default=SessionStatus.OPEN)
    
    # Primary complaint (encrypted for HIPAA)
    primary_complaint = Column(EncryptedString(1000))
    severity = Column(Integer, default=1)  # 1-10 scale
    duration_text = Column(String(255))  # e.g., "2 days", "1 week"
    
    # Timestamps
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    closed_at = Column(DateTime(timezone=True))
    last_activity = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="symptom_sessions")
    answers = relationship("SymptomAnswer", back_populates="session", cascade="all, delete-orphan")
    triage_result = relationship("TriageResult", back_populates="session", uselist=False)


class SymptomAnswer(Base):
    """Store individual Q&A responses in symptom sessions."""
    __tablename__ = "symptom_answers"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("symptom_sessions.id"), nullable=False)
    
    # Question details
    question_id = Column(String(100))  # Optional question identifier
    question_text = Column(Text, nullable=False)
    question_type = Column(String(50), default="text")  # text, single_select, multi_select
    
    # Answer details (encrypted for HIPAA)
    answer_text = Column(EncryptedString(2000))
    structured_payload = Column(JSON)  # For structured responses
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    session = relationship("SymptomSession", back_populates="answers")


class TriageResult(Base):
    """Store AI triage analysis results."""
    __tablename__ = "triage_results"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("symptom_sessions.id"), nullable=False)
    
    # Triage analysis
    risk_level = Column(Enum(RiskLevel), nullable=False)
    confidence_score = Column(Integer, default=0)  # 0-100
    
    # Possible conditions (encrypted for HIPAA)
    possible_conditions = Column(EncryptedString(2000))  # JSON string
    modern_recommendations = Column(EncryptedString(2000))  # JSON string
    ayurvedic_recommendations = Column(EncryptedString(2000))  # JSON string
    
    # Next steps
    next_steps = Column(Text)
    when_to_seek_help = Column(Text)
    
    # Report generation
    report_generated = Column(Boolean, default=False)
    report_url = Column(String(500))  # Signed URL to PDF report
    report_expires_at = Column(DateTime(timezone=True))
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    session = relationship("SymptomSession", back_populates="triage_result")


class Provider(Base):
    """Healthcare providers for appointments."""
    __tablename__ = "providers"

    id = Column(Integer, primary_key=True, index=True)
    
    # Provider details
    name = Column(String(255), nullable=False)
    specialty = Column(String(100), nullable=False)
    license_number = Column(String(100), unique=True, nullable=False)
    
    # Contact info (encrypted for HIPAA)
    email = Column(EncryptedString(255))
    phone = Column(EncryptedString(50))
    
    # Location (encrypted for HIPAA)
    address = Column(EncryptedString(500))
    city = Column(String(100))
    state = Column(String(50))
    zip_code = Column(String(20))
    country = Column(String(50), default="US")
    
    # Availability
    availability_schedule = Column(JSON)  # Weekly schedule
    timezone = Column(String(50), default="UTC")
    
    # Ratings and status
    rating = Column(Integer, default=0)  # 1-5 stars
    review_count = Column(Integer, default=0)
    active = Column(Boolean, default=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class Caregiver(Base):
    """Caregivers for home care services."""
    __tablename__ = "caregivers"

    id = Column(Integer, primary_key=True, index=True)
    
    # Caregiver details
    name = Column(String(255), nullable=False)
    skills = Column(JSON)  # Array of skills
    certifications = Column(JSON)  # Array of certifications
    
    # Coverage area
    coverage_zips = Column(JSON)  # Array of ZIP codes
    coverage_radius = Column(Integer, default=25)  # miles
    
    # Contact info (encrypted for HIPAA)
    email = Column(EncryptedString(255))
    phone = Column(EncryptedString(50))
    
    # Location (encrypted for HIPAA)
    address = Column(EncryptedString(500))
    city = Column(String(100))
    state = Column(String(50))
    zip_code = Column(String(20))
    
    # Availability
    availability_schedule = Column(JSON)  # Weekly schedule
    timezone = Column(String(50), default="UTC")
    
    # Ratings and status
    rating = Column(Integer, default=0)  # 1-5 stars
    review_count = Column(Integer, default=0)
    active = Column(Boolean, default=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class Appointment(Base):
    """Appointments with providers or caregivers."""
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Appointment details
    appointment_uuid = Column(String(36), unique=True, index=True, nullable=False)
    type = Column(String(50), nullable=False)  # "telehealth" or "caregiver"
    
    # Provider/Caregiver
    provider_id = Column(Integer, ForeignKey("providers.id"))
    caregiver_id = Column(Integer, ForeignKey("caregivers.id"))
    
    # Scheduling
    start_at = Column(DateTime(timezone=True), nullable=False)
    end_at = Column(DateTime(timezone=True), nullable=False)
    timezone = Column(String(50), default="UTC")
    
    # Video/Meeting details
    video_room_id = Column(String(100))
    meeting_url = Column(String(500))
    
    # Status
    status = Column(String(50), default="scheduled")  # scheduled, confirmed, in_progress, completed, cancelled
    
    # Notes (encrypted for HIPAA)
    notes = Column(EncryptedString(2000))
    symptoms = Column(EncryptedString(1000))
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User")
    provider = relationship("Provider")
    caregiver = relationship("Caregiver")


class Match(Base):
    """Matches between users and providers/caregivers."""
    __tablename__ = "matches"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Match details
    candidate_id = Column(Integer, nullable=False)  # Provider or Caregiver ID
    candidate_type = Column(String(50), nullable=False)  # "provider" or "caregiver"
    match_score = Column(Integer, default=0)  # 0-100
    
    # Match reasons
    reasons = Column(JSON)  # Array of match reasons
    
    # Status
    status = Column(String(50), default="pending")  # pending, accepted, rejected, expired
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    expires_at = Column(DateTime(timezone=True))
    
    # Relationships
    user = relationship("User")


class Consent(Base):
    """User consent management for HIPAA compliance."""
    __tablename__ = "consents"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Consent details
    consent_type = Column(String(50), nullable=False)  # privacy, telehealth, marketing, data_sharing
    version = Column(String(20), nullable=False)  # e.g., "1.0", "2.1"
    
    # Consent data
    consent_text = Column(Text, nullable=False)
    accepted_at = Column(DateTime(timezone=True), server_default=func.now())
    ip_address = Column(String(45))  # IPv4 or IPv6
    user_agent = Column(String(500))
    
    # Withdrawal
    withdrawn_at = Column(DateTime(timezone=True))
    withdrawal_reason = Column(String(255))
    
    # Relationships
    user = relationship("User")


class AuditLog(Base):
    """Comprehensive audit logging for HIPAA compliance."""
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))  # Nullable for system actions
    
    # Action details
    action = Column(String(100), nullable=False)  # login, logout, create, read, update, delete
    resource = Column(String(100), nullable=False)  # user, consultation, health_profile
    resource_id = Column(String(100))  # ID of the affected resource
    
    # Request details
    ip_address = Column(String(45))
    user_agent = Column(String(500))
    request_id = Column(String(100))  # Correlation ID
    
    # Additional metadata
    metadata = Column(JSON)  # Additional context
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User")


class Notification(Base):
    """Notification system for users."""
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Notification details
    channel = Column(String(50), nullable=False)  # email, sms, push, in_app
    template_id = Column(String(100))  # Email/SMS template identifier
    
    # Content (encrypted for HIPAA if contains PHI)
    subject = Column(String(255))
    content = Column(EncryptedString(2000))
    
    # Payload for templating
    payload = Column(JSON)
    
    # Status
    status = Column(String(50), default="pending")  # pending, sent, delivered, failed, bounced
    
    # Delivery details
    sent_at = Column(DateTime(timezone=True))
    delivered_at = Column(DateTime(timezone=True))
    failure_reason = Column(String(500))
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User")
