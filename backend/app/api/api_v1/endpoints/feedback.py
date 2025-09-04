from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import uuid

from app.db.session import get_db
from app.schemas.feedback import FeedbackCreate, FeedbackResponse
from app.models.feedback import ConversationFeedback
from app.models.conversations import Conversation
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter()

@router.post("/", response_model=FeedbackResponse)
def submit_feedback(
    feedback: FeedbackCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Submit feedback for a conversation."""
    
    # Verify the conversation exists and belongs to the user
    conversation = db.query(Conversation).filter(
        Conversation.id == feedback.conversation_id,
        Conversation.user_id == current_user.id
    ).first()
    
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    # Check if feedback already exists for this conversation
    existing_feedback = db.query(ConversationFeedback).filter(
        ConversationFeedback.conversation_id == feedback.conversation_id,
        ConversationFeedback.user_id == current_user.id
    ).first()
    
    if existing_feedback:
        # Update existing feedback
        existing_feedback.rating = feedback.rating
        existing_feedback.comment = feedback.comment
        db.commit()
        db.refresh(existing_feedback)
        return existing_feedback
    
    # Create new feedback
    db_feedback = ConversationFeedback(
        id=str(uuid.uuid4()),
        conversation_id=feedback.conversation_id,
        user_id=current_user.id,
        rating=feedback.rating,
        comment=feedback.comment
    )
    
    db.add(db_feedback)
    db.commit()
    db.refresh(db_feedback)
    
    return db_feedback

@router.get("/{conversation_id}", response_model=FeedbackResponse)
def get_feedback(
    conversation_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get feedback for a specific conversation."""
    
    # Verify the conversation belongs to the user
    conversation = db.query(Conversation).filter(
        Conversation.id == conversation_id,
        Conversation.user_id == current_user.id
    ).first()
    
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    feedback = db.query(ConversationFeedback).filter(
        ConversationFeedback.conversation_id == conversation_id,
        ConversationFeedback.user_id == current_user.id
    ).first()
    
    if not feedback:
        raise HTTPException(status_code=404, detail="Feedback not found")
    
    return feedback