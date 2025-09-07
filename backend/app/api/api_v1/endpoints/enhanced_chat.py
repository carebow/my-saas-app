from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from pydantic import BaseModel
import uuid

from app.api import deps
from app.models.user import User
from app.models.enhanced_chat import ChatSession, ChatMessage, PersonalizedRemedy, HealthMemory, UserPreferences
from app.services.enhanced_ai_service import EnhancedAIService
from app.core.encryption import get_encryption

router = APIRouter()
ai_service = EnhancedAIService()
encryption = get_encryption()


# Pydantic models for API
class ChatMessageRequest(BaseModel):
    content: str
    message_type: str = "text"
    audio_uri: Optional[str] = None
    image_uris: Optional[List[str]] = None
    session_id: Optional[str] = None


class ChatMessageResponse(BaseModel):
    message_id: str
    content: str
    role: str
    timestamp: str
    remedies: List[dict] = []
    analysis: dict = {}


class ChatSessionResponse(BaseModel):
    id: str
    title: str
    status: str
    created_at: str
    last_activity: str
    message_count: int


class PersonalizedRemedyResponse(BaseModel):
    id: str
    type: str
    title: str
    description: str
    instructions: str
    safety_level: str
    confidence_score: float
    personalization_factors: List[str]


class HealthMemoryResponse(BaseModel):
    id: str
    type: str
    title: str
    content: str
    importance_score: float
    tags: List[str]
    created_at: str


class UserPreferencesRequest(BaseModel):
    communication_style: Optional[str] = None
    ai_personality: Optional[str] = None
    response_length: Optional[str] = None
    remedy_preferences: Optional[dict] = None
    cultural_considerations: Optional[dict] = None
    voice_preferences: Optional[dict] = None


@router.post("/sessions", response_model=ChatSessionResponse)
def create_chat_session(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    """Create a new chat session."""
    session_id = str(uuid.uuid4())
    
    session = ChatSession(
        id=session_id,
        user_id=current_user.id,
        title="New Health Conversation",
        status="active"
    )
    
    db.add(session)
    db.commit()
    db.refresh(session)
    
    return ChatSessionResponse(
        id=session.id,
        title=session.title,
        status=session.status,
        created_at=session.created_at.isoformat(),
        last_activity=session.last_activity.isoformat(),
        message_count=0
    )


@router.get("/sessions", response_model=List[ChatSessionResponse])
def get_chat_sessions(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
    limit: int = 20,
    offset: int = 0
) -> Any:
    """Get user's chat sessions."""
    sessions = db.query(ChatSession).filter(
        ChatSession.user_id == current_user.id
    ).order_by(ChatSession.last_activity.desc()).offset(offset).limit(limit).all()
    
    result = []
    for session in sessions:
        message_count = db.query(ChatMessage).filter(
            ChatMessage.session_id == session.id
        ).count()
        
        result.append(ChatSessionResponse(
            id=session.id,
            title=session.title,
            status=session.status,
            created_at=session.created_at.isoformat(),
            last_activity=session.last_activity.isoformat(),
            message_count=message_count
        ))
    
    return result


@router.get("/sessions/{session_id}", response_model=dict)
def get_chat_session(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
    session_id: str
) -> Any:
    """Get a specific chat session with messages."""
    session = db.query(ChatSession).filter(
        ChatSession.id == session_id,
        ChatSession.user_id == current_user.id
    ).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Get messages
    messages = db.query(ChatMessage).filter(
        ChatMessage.session_id == session_id
    ).order_by(ChatMessage.created_at.asc()).all()
    
    # Get remedies
    remedies = db.query(PersonalizedRemedy).filter(
        PersonalizedRemedy.session_id == session_id
    ).all()
    
    # Format messages
    formatted_messages = []
    for msg in messages:
        formatted_messages.append({
            "id": msg.id,
            "role": msg.role,
            "content": encryption.decrypt(msg.content) if msg.content else "",
            "content_type": msg.content_type,
            "modality": msg.modality,
            "timestamp": msg.created_at.isoformat(),
            "sentiment": msg.sentiment,
            "urgency_detected": msg.urgency_detected,
            "health_topics": msg.health_topics or []
        })
    
    # Format remedies
    formatted_remedies = []
    for remedy in remedies:
        formatted_remedies.append({
            "id": remedy.id,
            "type": remedy.remedy_type,
            "title": encryption.decrypt(remedy.title) if remedy.title else "",
            "description": encryption.decrypt(remedy.description) if remedy.description else "",
            "instructions": encryption.decrypt(remedy.instructions) if remedy.instructions else "",
            "safety_level": remedy.safety_level,
            "confidence_score": remedy.confidence_score,
            "personalization_factors": remedy.personalization_factors or [],
            "user_rating": remedy.user_rating,
            "followed": remedy.followed,
            "created_at": remedy.created_at.isoformat()
        })
    
    return {
        "session": {
            "id": session.id,
            "title": session.title,
            "status": session.status,
            "created_at": session.created_at.isoformat(),
            "last_activity": session.last_activity.isoformat(),
            "conversation_summary": session.conversation_summary,
            "key_insights": session.key_insights or {}
        },
        "messages": formatted_messages,
        "remedies": formatted_remedies
    }


@router.post("/sessions/{session_id}/messages", response_model=ChatMessageResponse)
async def send_message(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
    session_id: str,
    message_request: ChatMessageRequest,
    background_tasks: BackgroundTasks
) -> Any:
    """Send a message to the AI and get a personalized response."""
    
    # Verify session belongs to user
    session = db.query(ChatSession).filter(
        ChatSession.id == session_id,
        ChatSession.user_id == current_user.id
    ).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    try:
        # Process message with AI service
        result = await ai_service.process_message(
            db=db,
            user=current_user,
            session_id=session_id,
            message_content=message_request.content,
            message_type=message_request.message_type,
            audio_uri=message_request.audio_uri,
            image_uris=message_request.image_uris
        )
        
        # Get the AI message from database
        ai_message = db.query(ChatMessage).filter(
            ChatMessage.id == result["message_id"]
        ).first()
        
        if not ai_message:
            raise HTTPException(status_code=500, detail="Failed to retrieve AI response")
        
        # Format remedies
        formatted_remedies = []
        for remedy in result.get("remedies", []):
            formatted_remedies.append({
                "id": remedy["id"],
                "type": remedy["type"],
                "title": remedy["title"],
                "description": remedy["description"],
                "instructions": remedy["instructions"],
                "safety_level": remedy["safety_level"],
                "confidence_score": remedy["confidence_score"],
                "personalization_factors": remedy.get("personalization_factors", [])
            })
        
        return ChatMessageResponse(
            message_id=ai_message.id,
            content=encryption.decrypt(ai_message.content) if ai_message.content else "",
            role=ai_message.role,
            timestamp=ai_message.created_at.isoformat(),
            remedies=formatted_remedies,
            analysis=result.get("analysis", {})
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process message: {str(e)}")


@router.get("/sessions/{session_id}/remedies", response_model=List[PersonalizedRemedyResponse])
def get_session_remedies(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
    session_id: str
) -> Any:
    """Get personalized remedies for a session."""
    
    # Verify session belongs to user
    session = db.query(ChatSession).filter(
        ChatSession.id == session_id,
        ChatSession.user_id == current_user.id
    ).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    remedies = db.query(PersonalizedRemedy).filter(
        PersonalizedRemedy.session_id == session_id
    ).order_by(PersonalizedRemedy.created_at.desc()).all()
    
    result = []
    for remedy in remedies:
        result.append(PersonalizedRemedyResponse(
            id=remedy.id,
            type=remedy.remedy_type,
            title=encryption.decrypt(remedy.title) if remedy.title else "",
            description=encryption.decrypt(remedy.description) if remedy.description else "",
            instructions=encryption.decrypt(remedy.instructions) if remedy.instructions else "",
            safety_level=remedy.safety_level,
            confidence_score=remedy.confidence_score,
            personalization_factors=remedy.personalization_factors or []
        ))
    
    return result


@router.post("/remedies/{remedy_id}/feedback")
def submit_remedy_feedback(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
    remedy_id: str,
    rating: int,
    effectiveness_notes: Optional[str] = None,
    followed: bool = False
) -> Any:
    """Submit feedback for a personalized remedy."""
    
    remedy = db.query(PersonalizedRemedy).filter(
        PersonalizedRemedy.id == remedy_id,
        PersonalizedRemedy.user_id == current_user.id
    ).first()
    
    if not remedy:
        raise HTTPException(status_code=404, detail="Remedy not found")
    
    remedy.user_rating = rating
    remedy.followed = followed
    if effectiveness_notes:
        remedy.effectiveness_notes = encryption.encrypt(effectiveness_notes)
    
    db.commit()
    
    return {"message": "Feedback submitted successfully"}


@router.get("/memories", response_model=List[HealthMemoryResponse])
def get_health_memories(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
    memory_type: Optional[str] = None,
    limit: int = 20
) -> Any:
    """Get user's health memories."""
    
    query = db.query(HealthMemory).filter(HealthMemory.user_id == current_user.id)
    
    if memory_type:
        query = query.filter(HealthMemory.memory_type == memory_type)
    
    memories = query.order_by(HealthMemory.importance_score.desc()).limit(limit).all()
    
    result = []
    for memory in memories:
        result.append(HealthMemoryResponse(
            id=memory.id,
            type=memory.memory_type,
            title=encryption.decrypt(memory.title) if memory.title else "",
            content=encryption.decrypt(memory.content) if memory.content else "",
            importance_score=memory.importance_score,
            tags=memory.tags or [],
            created_at=memory.created_at.isoformat()
        ))
    
    return result


@router.get("/preferences")
def get_user_preferences(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    """Get user preferences for personalization."""
    
    preferences = db.query(UserPreferences).filter(
        UserPreferences.user_id == current_user.id
    ).first()
    
    if not preferences:
        # Create default preferences
        preferences = UserPreferences(
            id=str(uuid.uuid4()),
            user_id=current_user.id
        )
        db.add(preferences)
        db.commit()
        db.refresh(preferences)
    
    return {
        "communication_style": preferences.communication_style,
        "ai_personality": preferences.ai_personality,
        "response_length": preferences.response_length,
        "remedy_preferences": preferences.remedy_preferences or {},
        "cultural_considerations": preferences.cultural_considerations or {},
        "voice_preferences": preferences.voice_preferences or {},
        "privacy_level": preferences.privacy_level,
        "follow_up_frequency": preferences.follow_up_frequency
    }


@router.put("/preferences")
def update_user_preferences(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
    preferences_request: UserPreferencesRequest
) -> Any:
    """Update user preferences for personalization."""
    
    preferences = db.query(UserPreferences).filter(
        UserPreferences.user_id == current_user.id
    ).first()
    
    if not preferences:
        preferences = UserPreferences(
            id=str(uuid.uuid4()),
            user_id=current_user.id
        )
        db.add(preferences)
    
    # Update preferences
    if preferences_request.communication_style is not None:
        preferences.communication_style = preferences_request.communication_style
    if preferences_request.ai_personality is not None:
        preferences.ai_personality = preferences_request.ai_personality
    if preferences_request.response_length is not None:
        preferences.response_length = preferences_request.response_length
    if preferences_request.remedy_preferences is not None:
        preferences.remedy_preferences = preferences_request.remedy_preferences
    if preferences_request.cultural_considerations is not None:
        preferences.cultural_considerations = preferences_request.cultural_considerations
    if preferences_request.voice_preferences is not None:
        preferences.voice_preferences = preferences_request.voice_preferences
    
    db.commit()
    db.refresh(preferences)
    
    return {"message": "Preferences updated successfully"}


@router.delete("/sessions/{session_id}")
def delete_chat_session(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
    session_id: str
) -> Any:
    """Delete a chat session and all associated data."""
    
    session = db.query(ChatSession).filter(
        ChatSession.id == session_id,
        ChatSession.user_id == current_user.id
    ).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Delete associated messages and remedies (cascade should handle this)
    db.delete(session)
    db.commit()
    
    return {"message": "Session deleted successfully"}


@router.post("/export-data")
def export_user_data(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
    background_tasks: BackgroundTasks
) -> Any:
    """Export all user data (GDPR compliance)."""
    
    # This would typically be handled by a background task
    # For now, return a placeholder response
    background_tasks.add_task(export_user_data_task, current_user.id)
    
    return {"message": "Data export initiated. You will receive an email when ready."}


def export_user_data_task(user_id: int):
    """Background task to export user data."""
    # Implementation would create a comprehensive data export
    # including all conversations, memories, preferences, etc.
    pass
