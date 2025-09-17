"""
Pydantic schemas for symptom session management.
"""
from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field
from enum import Enum

from app.models.symptom_sessions import SessionStatus, ChannelType, RiskLevel


class SymptomSessionCreate(BaseModel):
    """Schema for creating a new symptom session."""
    primary_complaint: str = Field(..., description="Primary symptom or complaint")
    channel: str = Field(default="web", description="Session channel (web, voice, mobile)")
    severity: int = Field(default=1, ge=1, le=10, description="Symptom severity (1-10)")
    duration_text: Optional[str] = Field(None, description="Duration of symptoms (e.g., '2 days')")


class SymptomSessionResponse(BaseModel):
    """Schema for symptom session response."""
    id: int
    session_uuid: str
    user_id: int
    channel: str
    status: str
    primary_complaint: str
    severity: int
    duration_text: Optional[str]
    started_at: datetime
    closed_at: Optional[datetime]
    last_activity: datetime

    class Config:
        from_attributes = True


class SymptomAnswerCreate(BaseModel):
    """Schema for submitting a symptom answer."""
    question_id: Optional[str] = Field(None, description="Question identifier")
    question_text: str = Field(..., description="Question text")
    question_type: str = Field(default="text", description="Question type")
    answer_text: str = Field(..., description="Answer text")
    structured_payload: Optional[Dict[str, Any]] = Field(None, description="Structured answer data")


class SymptomAnswerResponse(BaseModel):
    """Schema for symptom answer response."""
    id: int
    session_id: int
    question_id: Optional[str]
    question_text: str
    question_type: str
    answer_text: str
    structured_payload: Optional[Dict[str, Any]]
    created_at: datetime

    class Config:
        from_attributes = True


class NextQuestionResponse(BaseModel):
    """Schema for next question response."""
    question_id: Optional[str]
    question_text: str
    question_type: str
    options: List[str] = Field(default_factory=list)
    session_complete: bool = Field(default=False)


class TriageRequest(BaseModel):
    """Schema for triage analysis request."""
    session_uuid: str = Field(..., description="Session UUID to analyze")


class TriageJobResponse(BaseModel):
    """Schema for triage job response."""
    job_id: str
    estimated_seconds: int
    status: str


class TriageResultResponse(BaseModel):
    """Schema for triage result response."""
    id: int
    session_id: int
    risk_level: str
    confidence_score: int
    possible_conditions: str  # JSON string
    modern_recommendations: str  # JSON string
    ayurvedic_recommendations: str  # JSON string
    next_steps: Optional[str]
    when_to_seek_help: Optional[str]
    report_generated: bool
    report_url: Optional[str]
    report_expires_at: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True


class ProviderBase(BaseModel):
    """Base schema for healthcare providers."""
    name: str
    specialty: str
    license_number: str
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None
    country: str = "US"
    availability_schedule: Optional[Dict[str, Any]] = None
    timezone: str = "UTC"


class ProviderCreate(ProviderBase):
    """Schema for creating a provider."""
    pass


class ProviderResponse(ProviderBase):
    """Schema for provider response."""
    id: int
    rating: int
    review_count: int
    active: bool
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


class CaregiverBase(BaseModel):
    """Base schema for caregivers."""
    name: str
    skills: List[str] = Field(default_factory=list)
    certifications: List[str] = Field(default_factory=list)
    coverage_zips: List[str] = Field(default_factory=list)
    coverage_radius: int = 25
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None
    availability_schedule: Optional[Dict[str, Any]] = None
    timezone: str = "UTC"


class CaregiverCreate(CaregiverBase):
    """Schema for creating a caregiver."""
    pass


class CaregiverResponse(CaregiverBase):
    """Schema for caregiver response."""
    id: int
    rating: int
    review_count: int
    active: bool
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


class AppointmentBase(BaseModel):
    """Base schema for appointments."""
    type: str = Field(..., description="Appointment type (telehealth, caregiver)")
    start_at: datetime
    end_at: datetime
    timezone: str = "UTC"
    notes: Optional[str] = None
    symptoms: Optional[str] = None


class AppointmentCreate(AppointmentBase):
    """Schema for creating an appointment."""
    provider_id: Optional[int] = None
    caregiver_id: Optional[int] = None


class AppointmentResponse(AppointmentBase):
    """Schema for appointment response."""
    id: int
    appointment_uuid: str
    user_id: int
    provider_id: Optional[int]
    caregiver_id: Optional[int]
    video_room_id: Optional[str]
    meeting_url: Optional[str]
    status: str
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


class MatchRequest(BaseModel):
    """Schema for caregiver/provider matching request."""
    type: str = Field(..., description="Match type (provider, caregiver)")
    specialty: Optional[str] = None
    location: Optional[str] = None
    urgency: Optional[str] = None


class MatchResponse(BaseModel):
    """Schema for match response."""
    id: int
    candidate_id: int
    candidate_type: str
    match_score: int
    reasons: List[str]
    status: str
    created_at: datetime
    expires_at: Optional[datetime]

    class Config:
        from_attributes = True


class ConsentCreate(BaseModel):
    """Schema for creating consent."""
    consent_type: str = Field(..., description="Type of consent")
    version: str = Field(..., description="Consent version")
    consent_text: str = Field(..., description="Consent text")
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None


class ConsentResponse(BaseModel):
    """Schema for consent response."""
    id: int
    user_id: int
    consent_type: str
    version: str
    consent_text: str
    accepted_at: datetime
    ip_address: Optional[str]
    user_agent: Optional[str]
    withdrawn_at: Optional[datetime]
    withdrawal_reason: Optional[str]

    class Config:
        from_attributes = True


class NotificationCreate(BaseModel):
    """Schema for creating notification."""
    channel: str = Field(..., description="Notification channel")
    template_id: Optional[str] = None
    subject: Optional[str] = None
    content: str = Field(..., description="Notification content")
    payload: Optional[Dict[str, Any]] = None


class NotificationResponse(BaseModel):
    """Schema for notification response."""
    id: int
    user_id: int
    channel: str
    template_id: Optional[str]
    subject: Optional[str]
    content: str
    payload: Optional[Dict[str, Any]]
    status: str
    sent_at: Optional[datetime]
    delivered_at: Optional[datetime]
    failure_reason: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
