"""
Enhanced AI Service for CareBow
Implements dynamic symptom dialogue and urgency classification
"""

from typing import Dict, List, Optional, Tuple
from enum import Enum
from dataclasses import dataclass
import json
import logging

logger = logging.getLogger(__name__)

class UrgencyLevel(Enum):
    GREEN = "self_care"      # Self-care at home
    YELLOW = "see_doctor"    # See doctor in 2-3 days
    RED = "emergency"        # Seek help now

@dataclass
class SymptomContext:
    primary_symptom: str
    duration: Optional[str] = None
    severity: Optional[int] = None
    associated_symptoms: List[str] = None

@dataclass
class AIAnalysis:
    possible_causes: List[str]
    urgency_level: UrgencyLevel
    urgency_reason: str
    immediate_actions: List[str]
    ayurvedic_insights: Dict[str, any]
    modern_medicine_advice: List[str]
    when_to_seek_help: str
    confidence_score: float
    disclaimer: str

class EnhancedAIService:
    def __init__(self, openai_client=None):
        self.openai_client = openai_client
        self.urgency_keywords = {
            UrgencyLevel.RED: ["chest pain", "difficulty breathing", "severe headache", "fainting", "seizure"],
            UrgencyLevel.YELLOW: ["fever", "persistent pain", "worsening symptoms", "moderate pain"],
            UrgencyLevel.GREEN: ["mild", "slight", "minor", "manageable"]
        }
    
    def assess_urgency(self, context: SymptomContext) -> Tuple[UrgencyLevel, str]:
        """Assess urgency level based on symptom context"""
        symptom_text = f"{context.primary_symptom} {context.associated_symptoms or []}"
        symptom_lower = symptom_text.lower()
        
        # Check for emergency keywords
        for keyword in self.urgency_keywords[UrgencyLevel.RED]:
            if keyword in symptom_lower:
                return UrgencyLevel.RED, f"Emergency symptoms detected: {keyword}"
        
        # Check for moderate urgency
        for keyword in self.urgency_keywords[UrgencyLevel.YELLOW]:
            if keyword in symptom_lower:
                return UrgencyLevel.YELLOW, f"Moderate concern: {keyword}"
        
        # Check severity scale
        if context.severity and context.severity >= 8:
            return UrgencyLevel.RED, "High severity rating (8-10)"
        elif context.severity and context.severity >= 5:
            return UrgencyLevel.YELLOW, "Moderate severity rating (5-7)"
        
        return UrgencyLevel.GREEN, "Mild symptoms, self-care recommended"
    
    def analyze_symptoms(self, context: SymptomContext) -> AIAnalysis:
        """Comprehensive symptom analysis with AI reasoning"""
        urgency_level, urgency_reason = self.assess_urgency(context)
        
        if self.openai_client:
            try:
                analysis_prompt = self._create_analysis_prompt(context, urgency_level)
                response = self.openai_client.chat.completions.create(
                    model="gpt-4",
                    messages=[
                        {"role": "system", "content": analysis_prompt},
                        {"role": "user", "content": f"Symptoms: {context.primary_symptom}"}
                    ],
                    max_tokens=1000,
                    temperature=0.3
                )
                ai_response = response.choices[0].message.content
                return self._parse_ai_response(ai_response, urgency_level, urgency_reason)
            except Exception as e:
                logger.error(f"OpenAI API error: {e}")
                return self._generate_fallback_analysis(context, urgency_level, urgency_reason)
        else:
            return self._generate_fallback_analysis(context, urgency_level, urgency_reason)
    
    def _create_analysis_prompt(self, context: SymptomContext, urgency_level: UrgencyLevel) -> str:
        return f"""
You are CareBow, an advanced medical AI assistant specializing in integrative medicine.

Analyze the following symptoms and provide a comprehensive health assessment:

PRIMARY SYMPTOM: {context.primary_symptom}
DURATION: {context.duration or 'Not specified'}
SEVERITY: {context.severity or 'Not specified'}/10
ASSOCIATED SYMPTOMS: {context.associated_symptoms or 'None reported'}

URGENCY LEVEL: {urgency_level.value.upper()}

Provide your analysis in this EXACT JSON format:
{{
    "possible_causes": ["cause1", "cause2", "cause3"],
    "immediate_actions": ["action1", "action2", "action3"],
    "ayurvedic_insights": {{
        "dosha_imbalance": "Vata/Pitta/Kapha",
        "natural_remedies": ["remedy1", "remedy2"],
        "lifestyle_advice": ["advice1", "advice2"]
    }},
    "modern_medicine_advice": ["advice1", "advice2", "advice3"],
    "when_to_seek_help": "Specific guidance on when to see a doctor",
    "confidence_score": 0.85,
    "disclaimer": "This is not a medical diagnosis. Please consult a healthcare professional for serious concerns."
}}

Guidelines:
1. Be empathetic and reassuring
2. Provide both modern medical and Ayurvedic perspectives
3. Focus on practical, actionable advice
4. Always emphasize consulting healthcare professionals for serious concerns
"""
    
    def _parse_ai_response(self, ai_response: str, urgency_level: UrgencyLevel, urgency_reason: str) -> AIAnalysis:
        try:
            import re
            json_match = re.search(r'\{.*\}', ai_response, re.DOTALL)
            if json_match:
                data = json.loads(json_match.group())
            else:
                raise ValueError("No JSON found in response")
        except Exception as e:
            logger.error(f"Error parsing AI response: {e}")
            data = {
                "possible_causes": ["Health concern requiring attention"],
                "immediate_actions": ["Monitor symptoms", "Rest", "Stay hydrated"],
                "ayurvedic_insights": {"dosha_imbalance": "Unknown", "natural_remedies": [], "lifestyle_advice": []},
                "modern_medicine_advice": ["Consult healthcare provider"],
                "when_to_seek_help": "If symptoms persist or worsen",
                "confidence_score": 0.5,
                "disclaimer": "Please consult a healthcare professional for proper medical advice."
            }
        
        return AIAnalysis(
            possible_causes=data.get("possible_causes", []),
            urgency_level=urgency_level,
            urgency_reason=urgency_reason,
            immediate_actions=data.get("immediate_actions", []),
            ayurvedic_insights=data.get("ayurvedic_insights", {}),
            modern_medicine_advice=data.get("modern_medicine_advice", []),
            when_to_seek_help=data.get("when_to_seek_help", ""),
            confidence_score=data.get("confidence_score", 0.5),
            disclaimer=data.get("disclaimer", "")
        )
    
    def _generate_fallback_analysis(self, context: SymptomContext, urgency_level: UrgencyLevel, urgency_reason: str) -> AIAnalysis:
        return AIAnalysis(
            possible_causes=["General health concern", "Please consult healthcare provider"],
            urgency_level=urgency_level,
            urgency_reason=urgency_reason,
            immediate_actions=["Rest and monitor symptoms", "Stay hydrated", "Seek medical advice if symptoms worsen"],
            ayurvedic_insights={
                "dosha_imbalance": "Consult Ayurvedic practitioner for assessment",
                "natural_remedies": ["Warm water", "Gentle breathing exercises", "Adequate rest"],
                "lifestyle_advice": ["Maintain regular routine", "Eat nourishing foods", "Practice stress management"]
            },
            modern_medicine_advice=["Monitor symptoms closely", "Maintain good hygiene", "Get adequate rest"],
            when_to_seek_help="If symptoms persist, worsen, or cause concern, please consult a healthcare professional",
            confidence_score=0.6,
            disclaimer="This is general guidance. Please consult a healthcare professional for proper medical advice."
        )
    
    def get_urgency_emoji(self, urgency_level: UrgencyLevel) -> str:
        emoji_map = {
            UrgencyLevel.GREEN: "🟢",
            UrgencyLevel.YELLOW: "🟡", 
            UrgencyLevel.RED: "🔴"
        }
        return emoji_map.get(urgency_level, "⚪")
    
    def get_urgency_description(self, urgency_level: UrgencyLevel) -> str:
        descriptions = {
            UrgencyLevel.GREEN: "Self-care at home",
            UrgencyLevel.YELLOW: "See a doctor in 2-3 days",
            UrgencyLevel.RED: "Emergency - seek help now"
        }
        return descriptions.get(urgency_level, "Unknown urgency")
