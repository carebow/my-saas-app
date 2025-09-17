"""
Triage service for CareBow symptom analysis.
"""
import json
import logging
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
from sqlalchemy.orm import Session

from app.models.symptom_sessions import SymptomSession, SymptomAnswer, TriageResult, RiskLevel
from app.services.enhanced_ai_service import EnhancedAIService
from app.core.config import settings

logger = logging.getLogger(__name__)


class TriageService:
    """Service for processing symptom triage analysis."""
    
    def __init__(self):
        self.enhanced_ai_service = EnhancedAIService()
    
    async def process_triage_analysis(self, session_id: int, db: Session) -> TriageResult:
        """Process triage analysis for a symptom session."""
        try:
            # Get session and answers
            session = db.query(SymptomSession).filter(SymptomSession.id == session_id).first()
            if not session:
                raise ValueError(f"Session {session_id} not found")
            
            answers = db.query(SymptomAnswer).filter(
                SymptomAnswer.session_id == session_id
            ).order_by(SymptomAnswer.created_at).all()
            
            # Build conversation history
            conversation_history = []
            for answer in answers:
                conversation_history.append({
                    "question": answer.question_text,
                    "answer": answer.answer_text,
                    "timestamp": answer.created_at.isoformat()
                })
            
            # Get user profile for context
            user_profile = {
                "age": getattr(session.user, 'age', None),
                "gender": getattr(session.user, 'gender', None),
                "medical_history": getattr(session.user, 'medical_conditions', None),
                "allergies": getattr(session.user, 'allergies', None),
                "medications": getattr(session.user, 'medications', None)
            }
            
            # Analyze symptoms with AI
            analysis = self.enhanced_ai_service.analyze_symptoms(
                symptoms=session.primary_complaint,
                user_profile=user_profile
            )
            
            # Get urgency level
            urgency = self.enhanced_ai_service.get_urgency_level(
                symptoms=session.primary_complaint,
                user_profile=user_profile
            )
            
            # Determine risk level
            risk_level = self._determine_risk_level(urgency, analysis)
            
            # Create triage result
            triage_result = TriageResult(
                session_id=session_id,
                risk_level=risk_level,
                confidence_score=int(analysis.get('confidence_score', 75)),
                possible_conditions=json.dumps(analysis.get('possible_conditions', [])),
                modern_recommendations=json.dumps(analysis.get('recommendations', [])),
                ayurvedic_recommendations=json.dumps(analysis.get('ayurvedic_insights', {})),
                next_steps=self._generate_next_steps(risk_level, analysis),
                when_to_seek_help=self._generate_help_guidance(risk_level, urgency)
            )
            
            db.add(triage_result)
            db.commit()
            db.refresh(triage_result)
            
            # Update session status
            session.status = "completed"
            session.closed_at = datetime.utcnow()
            db.commit()
            
            logger.info(f"Triage analysis completed for session {session_id}")
            return triage_result
            
        except Exception as e:
            logger.error(f"Error processing triage analysis for session {session_id}: {str(e)}")
            db.rollback()
            raise
    
    def _determine_risk_level(self, urgency: Dict[str, str], analysis: Dict[str, Any]) -> RiskLevel:
        """Determine risk level based on urgency and analysis."""
        urgency_level = urgency.get('level', 'SELF_CARE')
        
        if 'EMERGENCY' in urgency_level or 'URGENT' in urgency_level:
            return RiskLevel.RED
        elif 'SEE_DOCTOR' in urgency_level or 'MODERATE' in urgency_level:
            return RiskLevel.YELLOW
        else:
            return RiskLevel.GREEN
    
    def _generate_next_steps(self, risk_level: RiskLevel, analysis: Dict[str, Any]) -> str:
        """Generate next steps based on risk level."""
        if risk_level == RiskLevel.RED:
            return "Seek immediate medical attention. Call 911 or go to the nearest emergency room."
        elif risk_level == RiskLevel.YELLOW:
            return "Schedule an appointment with a healthcare provider within 2-3 days. Monitor symptoms closely."
        else:
            return "Continue self-care at home. Monitor symptoms and seek medical attention if they worsen."
    
    def _generate_help_guidance(self, risk_level: RiskLevel, urgency: Dict[str, str]) -> str:
        """Generate guidance on when to seek help."""
        if risk_level == RiskLevel.RED:
            return "Seek immediate emergency care for: severe pain, difficulty breathing, chest pain, severe bleeding, or loss of consciousness."
        elif risk_level == RiskLevel.YELLOW:
            return "See a doctor if symptoms persist for more than 3 days, worsen, or if you develop new concerning symptoms."
        else:
            return "Contact a healthcare provider if symptoms worsen, persist beyond 1 week, or if you have any concerns."
    
    def generate_report_url(self, session_uuid: str) -> str:
        """Generate a signed URL for the symptom report."""
        # This would integrate with S3 or similar storage service
        # For now, return a placeholder URL
        base_url = getattr(settings, 'REPORT_BASE_URL', 'https://reports.carebow.com')
        return f"{base_url}/reports/{session_uuid}.pdf"
    
    def get_triage_guidelines(self) -> Dict[str, Any]:
        """Get triage guidelines and decision tree."""
        return {
            "red_flags": [
                "Severe chest pain",
                "Difficulty breathing",
                "Severe bleeding",
                "Loss of consciousness",
                "Severe headache with neck stiffness",
                "Signs of stroke",
                "Severe abdominal pain"
            ],
            "yellow_flags": [
                "Fever over 101°F for more than 3 days",
                "Persistent pain",
                "Unexplained weight loss",
                "Changes in vision or hearing",
                "Persistent nausea or vomiting"
            ],
            "green_indicators": [
                "Mild symptoms",
                "No red or yellow flags",
                "Symptoms improving",
                "No fever or severe pain"
            ]
        }
    
    def validate_triage_result(self, result: TriageResult) -> bool:
        """Validate triage result for completeness and accuracy."""
        try:
            # Check required fields
            if not result.risk_level:
                return False
            
            if not result.possible_conditions:
                return False
            
            # Validate JSON fields
            json.loads(result.possible_conditions)
            json.loads(result.modern_recommendations)
            json.loads(result.ayurvedic_recommendations)
            
            # Check confidence score
            if not (0 <= result.confidence_score <= 100):
                return False
            
            return True
            
        except (json.JSONDecodeError, ValueError):
            return False
    
    def get_risk_level_explanation(self, risk_level: RiskLevel) -> Dict[str, str]:
        """Get explanation for risk levels."""
        explanations = {
            RiskLevel.GREEN: {
                "level": "Self-Care",
                "description": "Mild symptoms that can be managed at home",
                "emoji": "🟢",
                "action": "Continue self-care and monitor symptoms"
            },
            RiskLevel.YELLOW: {
                "level": "See Doctor",
                "description": "Moderate symptoms that should be evaluated by a healthcare provider",
                "emoji": "🟡",
                "action": "Schedule an appointment within 2-3 days"
            },
            RiskLevel.RED: {
                "level": "Emergency",
                "description": "Severe symptoms requiring immediate medical attention",
                "emoji": "🔴",
                "action": "Seek emergency care immediately"
            }
        }
        
        return explanations.get(risk_level, explanations[RiskLevel.GREEN])
