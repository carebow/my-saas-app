from typing import Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel


class ChatRequest(BaseModel):
    message: str
    context: Optional[Dict[str, Any]] = None


class ChatResponse(BaseModel):
    message: str
    consultation_id: Optional[int] = None
    consultations_remaining: int


class ConsultationCreate(BaseModel):
    symptoms: str
    consultation_type: Optional[str] = "general_health"


class ConsultationResponse(BaseModel):
    id: int
    symptoms: str
    ai_analysis: str
    recommendations: Dict[str, Any]
    ayurvedic_insights: Dict[str, Any]
    consultation_type: str
    created_at: datetime
    consultations_remaining: int

    class Config:
        from_attributes = True