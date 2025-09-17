"""
Enhanced AI endpoints with dynamic symptom dialogue and urgency classification
"""

from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.api import deps
from app.core.config import settings
from app.models.user import User
from app.services.enhanced_ai_service import EnhancedAIService, SymptomContext, AIAnalysis, UrgencyLevel
from openai import OpenAI

router = APIRouter()

# Initialize OpenAI client
client = OpenAI(api_key=settings.OPENAI_API_KEY) if settings.OPENAI_API_KEY else None
ai_service = EnhancedAIService(client)

class SymptomAnalysisRequest(BaseModel):
    primary_symptom: str
    duration: str = None
    severity: int = None  # 1-10 scale
    associated_symptoms: List[str] = []
    medical_history: List[str] = []
    medications: List[str] = []
    allergies: List[str] = []

class SymptomAnalysisResponse(BaseModel):
    possible_causes: List[str]
    urgency_level: str
    urgency_emoji: str
    urgency_reason: str
    immediate_actions: List[str]
    ayurvedic_insights: dict
    modern_medicine_advice: List[str]
    when_to_seek_help: str
    confidence_score: float
    disclaimer: str

class FollowUpQuestionRequest(BaseModel):
    symptom: str
    current_context: dict = {}

class FollowUpQuestionResponse(BaseModel):
    questions: List[dict]
    next_steps: List[str]

@router.post("/analyze-symptoms", response_model=SymptomAnalysisResponse)
def analyze_symptoms(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
    request: SymptomAnalysisRequest,
) -> Any:
    """
    Enhanced symptom analysis with urgency classification and AI reasoning
    """
    try:
        # Create symptom context
        context = SymptomContext(
            primary_symptom=request.primary_symptom,
            duration=request.duration,
            severity=request.severity,
            associated_symptoms=request.associated_symptoms,
            medical_history=request.medical_history,
            medications=request.medications,
            allergies=request.allergies
        )
        
        # Get AI analysis
        analysis = ai_service.analyze_symptoms(context)
        
        return SymptomAnalysisResponse(
            possible_causes=analysis.possible_causes,
            urgency_level=analysis.urgency_level.value,
            urgency_emoji=ai_service.get_urgency_emoji(analysis.urgency_level),
            urgency_reason=analysis.urgency_reason,
            immediate_actions=analysis.immediate_actions,
            ayurvedic_insights=analysis.ayurvedic_insights,
            modern_medicine_advice=analysis.modern_medicine_advice,
            when_to_seek_help=analysis.when_to_seek_help,
            confidence_score=analysis.confidence_score,
            disclaimer=analysis.disclaimer
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Symptom analysis failed: {str(e)}"
        )

@router.post("/follow-up-questions", response_model=FollowUpQuestionResponse)
def get_follow_up_questions(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
    request: FollowUpQuestionRequest,
) -> Any:
    """
    Generate intelligent follow-up questions based on symptom context
    """
    try:
        # Create symptom context
        context = SymptomContext(
            primary_symptom=request.symptom,
            associated_symptoms=request.current_context.get("associated_symptoms", [])
        )
        
        # Generate follow-up questions based on symptom type
        questions = []
        
        # Severity question
        if not request.current_context.get("severity"):
            questions.append({
                "question": f"On a scale of 1-10, how would you rate the severity of {request.symptom}?",
                "type": "severity",
                "options": ["1-3 (Mild)", "4-6 (Moderate)", "7-10 (Severe)"],
                "required": True
            })
        
        # Duration question
        if not request.current_context.get("duration"):
            questions.append({
                "question": f"How long have you been experiencing {request.symptom}?",
                "type": "duration",
                "options": ["Less than 1 hour", "1-24 hours", "1-3 days", "More than 3 days"],
                "required": True
            })
        
        # Associated symptoms question
        if not request.current_context.get("associated_symptoms"):
            questions.append({
                "question": "Are you experiencing any other symptoms along with this?",
                "type": "associated",
                "options": ["Fever", "Nausea", "Dizziness", "Fatigue", "None of these"],
                "required": False
            })
        
        # Next steps based on symptom type
        next_steps = [
            "Continue answering questions for better analysis",
            "Monitor your symptoms closely",
            "Consider your medical history and current medications"
        ]
        
        return FollowUpQuestionResponse(
            questions=questions,
            next_steps=next_steps
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Follow-up questions generation failed: {str(e)}"
        )

@router.get("/urgency-levels")
def get_urgency_levels() -> Any:
    """
    Get available urgency levels and their descriptions
    """
    return {
        "urgency_levels": [
            {
                "level": "green",
                "emoji": "🟢",
                "description": "Self-care at home",
                "meaning": "Mild symptoms that can be managed at home"
            },
            {
                "level": "yellow", 
                "emoji": "🟡",
                "description": "See a doctor in 2-3 days",
                "meaning": "Moderate symptoms that should be evaluated by a healthcare provider"
            },
            {
                "level": "red",
                "emoji": "🔴", 
                "description": "Emergency - seek help now",
                "meaning": "Serious symptoms requiring immediate medical attention"
            }
        ]
    }

@router.post("/quick-assessment")
def quick_health_assessment(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
    symptoms: str,
) -> Any:
    """
    Quick health assessment for immediate triage
    """
    try:
        # Create basic context
        context = SymptomContext(primary_symptom=symptoms)
        
        # Get urgency assessment
        urgency_level, urgency_reason = ai_service.assess_urgency(context)
        
        return {
            "symptoms": symptoms,
            "urgency_level": urgency_level.value,
            "urgency_emoji": ai_service.get_urgency_emoji(urgency_level),
            "urgency_description": ai_service.get_urgency_description(urgency_level),
            "urgency_reason": urgency_reason,
            "immediate_action": "Monitor symptoms" if urgency_level == UrgencyLevel.GREEN else "Consider medical evaluation",
            "recommendation": ai_service.get_urgency_description(urgency_level)
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Quick assessment failed: {str(e)}"
        )
