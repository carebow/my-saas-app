from sqlalchemy import Column, String, DateTime, Text, ForeignKey, Integer, JSON, Boolean, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from datetime import datetime

from app.db.base_class import Base
from app.models.user import EncryptedString


class ChatSession(Base):
    """Enhanced chat session with memory and personalization capabilities."""
    __tablename__ = "chat_sessions"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Session metadata
    title = Column(String(255))  # Auto-generated or user-defined title
    session_type = Column(String(50), default="general_health")  # general_health, symptom_check, emergency, etc.
    status = Column(String(20), default="active")  # active, paused, completed, archived
    
    # Personalization context
    user_context = Column(JSON)  # Stored user profile context for this session
    conversation_summary = Column(Text)  # AI-generated summary of the conversation
    key_insights = Column(JSON)  # Important health insights extracted from conversation
    
    # Voice settings
    voice_enabled = Column(Boolean, default=False)
    voice_settings = Column(JSON)  # Voice preferences, speed, etc.
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    last_activity = Column(DateTime(timezone=True), server_default=func.now())
    ended_at = Column(DateTime(timezone=True))
    
    # Relationships
    user = relationship("User")
    messages = relationship("ChatMessage", back_populates="session", cascade="all, delete-orphan")
    remedies = relationship("PersonalizedRemedy", back_populates="session")


class ChatMessage(Base):
    """Enhanced message model with rich metadata and personalization."""
    __tablename__ = "chat_messages"

    id = Column(String, primary_key=True, index=True)
    session_id = Column(String, ForeignKey("chat_sessions.id"), nullable=False)
    
    # Message content (encrypted for HIPAA compliance)
    role = Column(String(20), nullable=False)  # user, assistant, system
    content = Column(EncryptedString(10000))  # Main message content
    content_type = Column(String(20), default="text")  # text, audio, image, file
    
    # Rich metadata
    modality = Column(String(20), default="text")  # text, voice, mixed
    audio_uri = Column(String(500))  # S3 URI for voice messages
    image_uris = Column(JSON)  # Array of S3 URIs for images
    
    # AI processing metadata
    ai_analysis = Column(JSON)  # AI analysis of the message
    sentiment = Column(String(20))  # positive, negative, neutral, concerned
    urgency_detected = Column(String(20))  # low, medium, high, emergency
    health_topics = Column(JSON)  # Extracted health topics from the message
    
    # Personalization data
    personalized_for = Column(JSON)  # User-specific context used for this response
    remedy_suggestions = Column(JSON)  # Personalized remedy suggestions
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    session = relationship("ChatSession", back_populates="messages")


class PersonalizedRemedy(Base):
    """Personalized remedy recommendations based on user profile and conversation context."""
    __tablename__ = "personalized_remedies"

    id = Column(String, primary_key=True, index=True)
    session_id = Column(String, ForeignKey("chat_sessions.id"), nullable=False)
    message_id = Column(String, ForeignKey("chat_messages.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Remedy details (encrypted for HIPAA compliance)
    remedy_type = Column(String(50))  # modern_medicine, ayurvedic, home_remedy, lifestyle
    title = Column(EncryptedString(255))
    description = Column(EncryptedString(2000))
    instructions = Column(EncryptedString(3000))
    
    # Personalization factors
    personalization_factors = Column(JSON)  # Age, gender, medical history, allergies, etc.
    contraindications_checked = Column(JSON)  # Safety checks performed
    confidence_score = Column(Float)  # AI confidence in this recommendation (0-1)
    
    # Safety and compliance
    safety_level = Column(String(20))  # safe, caution, requires_consultation
    medical_disclaimer = Column(Text)
    
    # User interaction
    user_rating = Column(Integer)  # 1-5 star rating from user
    effectiveness_notes = Column(EncryptedString(1000))  # User feedback on effectiveness
    followed = Column(Boolean, default=False)  # Whether user followed the recommendation
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    session = relationship("ChatSession", back_populates="remedies")
    message = relationship("ChatMessage")
    user = relationship("User")


class HealthMemory(Base):
    """Long-term health memory for context-aware conversations."""
    __tablename__ = "health_memory"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Memory content (encrypted for HIPAA compliance)
    memory_type = Column(String(50))  # symptom_pattern, remedy_preference, health_goal, concern
    title = Column(EncryptedString(255))
    content = Column(EncryptedString(2000))
    
    # Context and metadata
    context = Column(JSON)  # When this memory was created, what triggered it
    importance_score = Column(Float)  # How important this memory is (0-1)
    last_accessed = Column(DateTime(timezone=True))
    access_count = Column(Integer, default=0)
    
    # AI processing
    embedding_vector = Column(JSON)  # Vector embedding for semantic search
    tags = Column(JSON)  # Categorized tags for easy retrieval
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User")


class ConversationInsight(Base):
    """AI-generated insights from conversations for better personalization."""
    __tablename__ = "conversation_insights"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    session_id = Column(String, ForeignKey("chat_sessions.id"), nullable=False)
    
    # Insight details (encrypted for HIPAA compliance)
    insight_type = Column(String(50))  # health_pattern, symptom_trend, remedy_effectiveness, concern_level
    title = Column(EncryptedString(255))
    description = Column(EncryptedString(2000))
    confidence = Column(Float)  # AI confidence in this insight (0-1)
    
    # Data and evidence
    supporting_evidence = Column(JSON)  # Messages, patterns that support this insight
    recommendations = Column(JSON)  # AI recommendations based on this insight
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User")
    session = relationship("ChatSession")


class UserPreferences(Base):
    """User preferences for personalization and comfort."""
    __tablename__ = "user_preferences"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Communication preferences
    communication_style = Column(String(50), default="empathetic")  # empathetic, professional, casual, formal
    preferred_language = Column(String(10), default="en")
    voice_preferences = Column(JSON)  # Voice speed, tone, gender preferences
    
    # Health preferences
    remedy_preferences = Column(JSON)  # Preference for modern vs traditional medicine
    cultural_considerations = Column(JSON)  # Cultural health practices and beliefs
    privacy_level = Column(String(20), default="standard")  # standard, high, maximum
    
    # AI interaction preferences
    ai_personality = Column(String(50), default="caring_nurse")  # caring_nurse, wise_healer, professional_doctor
    response_length = Column(String(20), default="detailed")  # brief, detailed, comprehensive
    follow_up_frequency = Column(String(20), default="moderate")  # low, moderate, high
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User")
