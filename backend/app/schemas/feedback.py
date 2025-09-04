from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class FeedbackCreate(BaseModel):
    conversation_id: str
    rating: str  # 'positive' or 'negative'
    comment: Optional[str] = None

class FeedbackResponse(BaseModel):
    id: str
    conversation_id: str
    user_id: int
    rating: str
    comment: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True