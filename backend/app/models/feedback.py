from sqlalchemy import Column, String, DateTime, Text, ForeignKey, Integer, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime

from app.db.base_class import Base

class ConversationFeedback(Base):
    __tablename__ = "conversation_feedback"

    id = Column(String, primary_key=True, index=True)
    conversation_id = Column(String, ForeignKey("conversations.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    rating = Column(String, nullable=False)  # 'positive' or 'negative' (👍 or 👎)
    comment = Column(Text, nullable=True)  # Optional feedback comment
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    conversation = relationship("Conversation")
    user = relationship("User")