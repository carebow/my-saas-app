from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from openai import OpenAI

from app.api import deps
from app.core.config import settings
from app.models.user import User
from app.models.health import Consultation
from app.schemas.ai import ChatRequest, ChatResponse, ConsultationCreate, ConsultationResponse

router = APIRouter()

# Initialize OpenAI client
client = OpenAI(api_key=settings.OPENAI_API_KEY) if settings.OPENAI_API_KEY else None


@router.post("/chat", response_model=ChatResponse)
def chat_with_ai(
    *,
    db: Session = Depends(deps.get_db),
    chat_request: ChatRequest,
) -> Any:
    """
    Chat with CareBow AI Assistant.
    """
    try:
        # Enhanced system prompt with personality and Ayurvedic knowledge
        personality_prompts = {
            "caring_nurse": "You are a caring, nurturing AI health assistant with a warm, empathetic tone. You speak like a compassionate nurse who genuinely cares about the patient's wellbeing.",
            "wise_healer": "You are a wise, experienced healer who combines ancient wisdom with modern knowledge. You speak with authority but remain humble and approachable.",
            "professional_doctor": "You are a professional, knowledgeable medical AI assistant. You provide clear, evidence-based information while maintaining a professional yet friendly demeanor.",
            "ayurvedic_practitioner": "You are an Ayurvedic practitioner with deep knowledge of traditional Indian medicine. You focus on holistic healing and natural remedies."
        }
        
        personality = getattr(chat_request, 'personality', 'caring_nurse')
        base_personality = personality_prompts.get(personality, personality_prompts['caring_nurse'])
        
        system_prompt = f"""{base_personality}

You are CareBow, an AI health assistant specializing in integrative medicine that combines:
- Modern evidence-based medicine
- Traditional Ayurvedic wisdom
- Holistic wellness approaches
- Natural remedies and lifestyle modifications

Key Guidelines:
1. Always be empathetic and understanding
2. Provide both modern medical insights and Ayurvedic perspectives when relevant
3. Include practical, actionable advice
4. Always recommend consulting healthcare professionals for serious concerns
5. Focus on root causes, not just symptoms
6. Suggest natural remedies alongside conventional approaches
7. Consider the whole person - mind, body, and spirit

Format your responses with:
- Clear, caring language
- Practical recommendations
- Both immediate relief and long-term solutions
- Appropriate medical disclaimers
- Encouragement and support

Remember: You're not just providing information, you're offering compassionate guidance for someone's health journey."""

        user_message = chat_request.message
        
        # Add context if available
        context_info = ""
        if hasattr(chat_request, 'profileData') and chat_request.profileData:
            context_info = f"\nUser context: {chat_request.profileData}"
        
        full_message = user_message + context_info
        
        if not client:
            # Provide a helpful fallback response
            ai_response = generate_fallback_response(user_message, personality)
        else:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": full_message}
                ],
                max_tokens=800,
                temperature=0.7
            )
            
            ai_response = response.choices[0].message.content
        
        return ChatResponse(
            message=ai_response,
            consultation_id=None,
            consultations_remaining=10  # Demo value
        )
        
    except Exception as e:
        # Provide fallback response even on error
        fallback_response = generate_fallback_response(chat_request.message, getattr(chat_request, 'personality', 'caring_nurse'))
        return ChatResponse(
            message=fallback_response,
            consultation_id=None,
            consultations_remaining=10
        )


def generate_fallback_response(message: str, personality: str = 'caring_nurse') -> str:
    """Generate a helpful fallback response when AI service is unavailable."""
    lower_message = message.lower()
    
    personality_intros = {
        'caring_nurse': "I'm here to help you with your health concerns. ",
        'wise_healer': "Let me share some wisdom about your health concern. ",
        'professional_doctor': "Based on your symptoms, here's what I can tell you. ",
        'ayurvedic_practitioner': "From an Ayurvedic perspective, let me guide you. "
    }
    
    intro = personality_intros.get(personality, personality_intros['caring_nurse'])
    
    if 'headache' in lower_message or 'head' in lower_message:
        return f"""{intro}Headaches can have many causes, from stress and dehydration to tension and dietary factors.

🌿 **Natural Relief Approaches:**
• Apply a cool compress to your forehead and temples
• Try gentle head and neck massage with sesame oil
• Drink warm ginger tea to reduce inflammation
• Practice deep breathing exercises

💡 **Immediate Steps:**
• Rest in a quiet, dark room
• Stay well-hydrated with warm water
• Avoid screens and bright lights
• Try gentle neck stretches

🧘 **Ayurvedic Wisdom:**
• Headaches often indicate excess Pitta (heat) in the body
• Cool, calming practices can help restore balance
• Consider your recent diet - spicy or acidic foods may contribute

⚠️ **When to Seek Help:** If headaches are severe, frequent, or accompanied by fever, vision changes, or neck stiffness, please consult a healthcare provider immediately.

How long have you been experiencing these headaches? Any specific triggers you've noticed?"""
    
    elif 'tired' in lower_message or 'fatigue' in lower_message or 'energy' in lower_message:
        return f"""{intro}Fatigue can significantly impact your quality of life, and there are many natural ways to restore your energy.

🌿 **Ayurvedic Energy Boosters:**
• Start your day with warm water and fresh lemon
• Include iron-rich foods like spinach, dates, and almonds
• Try Ashwagandha - a powerful adaptogen for sustained energy
• Practice Pranayama (breathing exercises) to oxygenate your body

💪 **Lifestyle Enhancements:**
• Ensure 7-8 hours of quality sleep nightly
• Take short walks in fresh air and sunlight
• Eat smaller, more frequent meals to maintain blood sugar
• Avoid heavy, processed foods that drain energy

🧘 **Mind-Body Connection:**
• Fatigue often reflects imbalanced Vata (air element)
• Regular routines help ground and stabilize energy
• Consider meditation to reduce mental fatigue

🔍 **Root Cause Exploration:**
• Are you getting enough B vitamins and iron?
• How's your stress level lately?
• Any changes in sleep patterns?

If fatigue persists for more than 2-3 weeks, it's wise to consult with a healthcare provider to rule out underlying conditions like thyroid issues or anemia.

What time of day do you feel most tired? Have you noticed any patterns?"""
    
    elif 'stress' in lower_message or 'anxiety' in lower_message or 'worried' in lower_message:
        return f"""{intro}I understand you're feeling stressed. This is incredibly common, and there are many effective, natural ways to find relief and build resilience.

🧘 **Immediate Calming Techniques:**
• Try the 4-7-8 breathing: Inhale for 4, hold for 7, exhale for 8
• Practice progressive muscle relaxation
• Listen to calming music or nature sounds
• Step outside for fresh air and gentle movement

🌿 **Ayurvedic Stress Support:**
• Brahmi tea for mental clarity and calm
• Jatamansi for anxiety relief
• Warm oil massage (Abhyanga) before bed
• Avoid stimulating foods like caffeine and sugar

💚 **Daily Stress-Busters:**
• Even 5 minutes of meditation can help
• Gentle yoga or stretching
• Maintain consistent sleep and meal times
• Connect with supportive friends or family

🌱 **Long-term Resilience:**
• Stress often indicates excess Vata (air element)
• Grounding practices like walking barefoot help
• Regular routines create stability and calm

Remember, it's completely normal to feel overwhelmed sometimes. You're taking a positive step by seeking support. If stress becomes overwhelming or affects your daily functioning, please consider speaking with a mental health professional.

What's been your biggest source of stress lately? Sometimes talking about it can help."""
    
    # Default caring response
    return f"""{intro}Thank you for reaching out about your health concern. As your AI health companion, I'm here to provide guidance that combines modern medical knowledge with traditional Ayurvedic wisdom.

🌿 **Holistic Health Approach:**
Every health concern is unique, and I believe in addressing both symptoms and root causes through gentle, natural methods when appropriate.

💡 **General Wellness Foundation:**
• Stay hydrated with warm water throughout the day
• Maintain regular, nourishing meal times
• Include fresh, seasonal fruits and vegetables
• Practice deep breathing exercises daily
• Prioritize quality sleep and rest

🤝 **Important Reminder:** While I can provide general guidance and natural remedies, please consult with qualified healthcare providers for persistent symptoms, serious concerns, or before making significant changes to your health routine.

I'm here to support your health journey. Could you tell me more about what specific health concern you'd like guidance on today?"""


@router.post("/consultation", response_model=ConsultationResponse)
def create_consultation(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
    consultation_in: ConsultationCreate,
) -> Any:
    """
    Create a detailed health consultation.
    """
    # Check consultation limits using proper unlimited logic
    from app.core.subscription_config import can_create_consultation
    
    if not can_create_consultation(current_user.consultations_used, current_user.consultations_limit):
        from app.core.subscription_config import get_tier_display_name, get_remaining_consultations
        
        remaining = get_remaining_consultations(current_user.consultations_used, current_user.consultations_limit)
        tier_name = get_tier_display_name(current_user.subscription_tier)
        
        raise HTTPException(
            status_code=403,
            detail=f"Consultation limit reached for {tier_name} tier ({current_user.consultations_used}/{current_user.consultations_limit} used). Please upgrade your subscription to continue."
        )
    
    try:
        # Generate AI analysis
        system_prompt = """You are a medical AI assistant. Analyze the symptoms and provide:
        1. Possible conditions (with disclaimers)
        2. Ayurvedic perspective
        3. Lifestyle recommendations
        4. When to seek medical care
        Always emphasize consulting healthcare professionals."""
        
        if not client:
            ai_analysis = "AI analysis is not available. Please configure OpenAI API key."
        else:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"Symptoms: {consultation_in.symptoms}"}
                ],
                max_tokens=800,
                temperature=0.6
            )
            
            ai_analysis = response.choices[0].message.content
        
        # Create consultation record
        consultation = Consultation(
            user_id=current_user.id,
            symptoms=consultation_in.symptoms,
            ai_analysis=ai_analysis,
            consultation_type=consultation_in.consultation_type or "general_health",
            recommendations={"ai_generated": True},
            ayurvedic_insights={"dosha_analysis": "Generated based on symptoms"}
        )
        
        db.add(consultation)
        current_user.consultations_used += 1
        db.commit()
        db.refresh(consultation)
        
        from app.core.subscription_config import get_remaining_consultations
        
        remaining = get_remaining_consultations(current_user.consultations_used, current_user.consultations_limit)
        
        return ConsultationResponse(
            id=consultation.id,
            symptoms=consultation.symptoms,
            ai_analysis=consultation.ai_analysis,
            recommendations=consultation.recommendations,
            ayurvedic_insights=consultation.ayurvedic_insights,
            consultation_type=consultation.consultation_type,
            created_at=consultation.created_at,
            consultations_remaining=remaining
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Consultation service error: {str(e)}")


@router.get("/consultations", response_model=List[ConsultationResponse])
def get_user_consultations(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
    skip: int = 0,
    limit: int = 10,
) -> Any:
    """
    Get user's consultation history.
    """
    consultations = (
        db.query(Consultation)
        .filter(Consultation.user_id == current_user.id)
        .offset(skip)
        .limit(limit)
        .all()
    )
    
    return [
        ConsultationResponse(
            id=c.id,
            symptoms=c.symptoms,
            ai_analysis=c.ai_analysis,
            recommendations=c.recommendations,
            ayurvedic_insights=c.ayurvedic_insights,
            consultation_type=c.consultation_type,
            created_at=c.created_at,
            consultations_remaining=current_user.consultations_limit - current_user.consultations_used
        )
        for c in consultations
    ]