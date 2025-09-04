from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ConversationCreate(BaseModel):
    profile_id: str
    channel: Optional[str] = "web"

class ConversationResponse(BaseModel):
    id: str
    user_id: str
    profile_id: str
    channel: str
    started_at: datetime
    ended_at: Optional[datetime] = None
    risk_level: Optional[str] = None
    summary_text: Optional[str] = None

    class Config:
        from_attributes = True

class MessageCreate(BaseModel):
    role: str  # 'user', 'assistant', 'system', 'clinician'
    modality: str  # 'text', 'audio', 'image', 'file'
    content_text: Optional[str] = None
    content_uri: Optional[str] = None

class MessageResponse(BaseModel):
    id: str
    conversation_id: str
    role: str
    modality: str
    content_text: Optional[str] = None
    content_uri: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True