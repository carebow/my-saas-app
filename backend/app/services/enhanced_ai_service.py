import json
import uuid
from typing import Dict, List, Optional, Any, Tuple
from datetime import datetime
from sqlalchemy.orm import Session
from openai import OpenAI

from app.core.config import settings
from app.models.enhanced_chat import ChatSession, ChatMessage, PersonalizedRemedy, HealthMemory, UserPreferences
from app.models.user import User
from app.models.health import HealthProfile
from app.core.encryption import get_encryption


class EnhancedAIService:
    """Enhanced AI service with personalization, memory, and ChatGPT-like capabilities."""
    
    def __init__(self):
        self.client = OpenAI(api_key=settings.OPENAI_API_KEY) if settings.OPENAI_API_KEY else None
        self.encryption = get_encryption()
    
    async def process_message(
        self,
        db: Session,
        user: User,
        session_id: str,
        message_content: str,
        message_type: str = "text",
        audio_uri: Optional[str] = None,
        image_uris: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """Process a user message and generate a personalized response."""
        
        # Get or create chat session
        session = await self._get_or_create_session(db, user, session_id)
        
        # Get user context and preferences
        user_context = await self._get_user_context(db, user)
        user_preferences = await self._get_user_preferences(db, user)
        
        # Get conversation history
        conversation_history = await self._get_conversation_history(db, session_id)
        
        # Get relevant health memories
        health_memories = await self._get_relevant_memories(db, user.id, message_content)
        
        # Get conversation memories for ChatGPT-like continuity
        conversation_memories = await self.get_conversation_memory(db, user.id, message_content)
        
        # Analyze the message
        message_analysis = await self._analyze_message(message_content, user_context, health_memories)
        
        # Create user message record
        user_message = await self._create_message(
            db, session_id, "user", message_content, message_type, 
            audio_uri, image_uris, message_analysis
        )
        
        # Generate AI response with personalization and memory
        ai_response = await self._generate_personalized_response(
            message_content, user_context, user_preferences, 
            conversation_history, health_memories, conversation_memories, message_analysis
        )
        
        # Create AI message record
        ai_message = await self._create_message(
            db, session_id, "assistant", ai_response["content"], "text",
            None, None, ai_response.get("analysis", {})
        )
        
        # Generate personalized remedies if applicable
        remedies = []
        if ai_response.get("remedies"):
            remedies = await self._generate_personalized_remedies(
                db, session_id, user_message.id, user.id, 
                ai_response["remedies"], user_context, message_analysis
            )
        
        # Update health memories
        await self._update_health_memories(db, user.id, message_content, ai_response, user_context)
        
        # Create conversation memories for ChatGPT-like continuity
        await self._create_conversation_memories(db, user.id, message_content, ai_response, user_context)
        
        # Update session
        await self._update_session(db, session_id, ai_response)
        
        return {
            "message": ai_response["content"],
            "message_id": ai_message.id,
            "remedies": remedies,
            "analysis": ai_response.get("analysis", {}),
            "session_updated": True
        }
    
    async def _get_or_create_session(self, db: Session, user: User, session_id: str) -> ChatSession:
        """Get existing session or create a new one."""
        session = db.query(ChatSession).filter(
            ChatSession.id == session_id,
            ChatSession.user_id == user.id
        ).first()
        
        if not session:
            session = ChatSession(
                id=session_id,
                user_id=user.id,
                title="New Health Conversation",
                status="active"
            )
            db.add(session)
            db.commit()
            db.refresh(session)
        
        return session
    
    async def _get_user_context(self, db: Session, user: User) -> Dict[str, Any]:
        """Get comprehensive user context for personalization."""
        # Get health profile
        health_profile = db.query(HealthProfile).filter(
            HealthProfile.user_id == user.id
        ).first()
        
        # Get recent health memories
        recent_memories = db.query(HealthMemory).filter(
            HealthMemory.user_id == user.id
        ).order_by(HealthMemory.created_at.desc()).limit(10).all()
        
        context = {
            "user_id": user.id,
            "age": self._calculate_age(user.date_of_birth) if user.date_of_birth else None,
            "gender": self.encryption.decrypt(user.gender) if user.gender else None,
            "subscription_tier": user.subscription_tier,
            "health_profile": self._extract_health_profile(health_profile) if health_profile else {},
            "recent_memories": [self._extract_memory(memory) for memory in recent_memories],
            "consultation_count": user.consultations_used
        }
        
        return context
    
    async def _get_user_preferences(self, db: Session, user: User) -> Dict[str, Any]:
        """Get user preferences for personalization."""
        preferences = db.query(UserPreferences).filter(
            UserPreferences.user_id == user.id
        ).first()
        
        if not preferences:
            # Create default preferences
            preferences = UserPreferences(
                id=str(uuid.uuid4()),
                user_id=user.id
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
            "voice_preferences": preferences.voice_preferences or {}
        }
    
    async def _get_conversation_history(self, db: Session, session_id: str, limit: int = 20) -> List[Dict]:
        """Get recent conversation history."""
        messages = db.query(ChatMessage).filter(
            ChatMessage.session_id == session_id
        ).order_by(ChatMessage.created_at.desc()).limit(limit).all()
        
        history = []
        for msg in reversed(messages):  # Reverse to get chronological order
            history.append({
                "role": msg.role,
                "content": self.encryption.decrypt(msg.content) if msg.content else "",
                "timestamp": msg.created_at.isoformat(),
                "modality": msg.modality
            })
        
        return history
    
    async def _get_relevant_memories(self, db: Session, user_id: int, message_content: str) -> List[Dict]:
        """Get relevant health memories based on message content."""
        # This is a simplified version - in production, you'd use vector similarity search
        memories = db.query(HealthMemory).filter(
            HealthMemory.user_id == user_id
        ).order_by(HealthMemory.importance_score.desc()).limit(5).all()
        
        return [self._extract_memory(memory) for memory in memories]
    
    async def _analyze_message(self, content: str, user_context: Dict, memories: List[Dict]) -> Dict[str, Any]:
        """Analyze the user message for sentiment, urgency, and health topics."""
        if not self.client:
            return {"sentiment": "neutral", "urgency": "low", "topics": []}
        
        analysis_prompt = f"""
        Analyze this health-related message for:
        1. Sentiment (positive, negative, neutral, concerned, anxious)
        2. Urgency level (low, medium, high, emergency)
        3. Health topics mentioned
        4. Emotional state indicators
        
        Message: "{content}"
        User context: {json.dumps(user_context, default=str)}
        
        Respond in JSON format:
        {{
            "sentiment": "concerned",
            "urgency": "medium", 
            "topics": ["headache", "fatigue"],
            "emotional_indicators": ["worried", "tired"],
            "needs_comfort": true,
            "requires_follow_up": true
        }}
        """
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-4o",
                messages=[{"role": "user", "content": analysis_prompt}],
                temperature=0.3,
                max_tokens=500
            )
            
            analysis = json.loads(response.choices[0].message.content)
            return analysis
        except Exception as e:
            print(f"Error analyzing message: {e}")
            return {"sentiment": "neutral", "urgency": "low", "topics": []}
    
    async def _generate_personalized_response(
        self, 
        message: str, 
        user_context: Dict, 
        preferences: Dict, 
        history: List[Dict],
        memories: List[Dict],
        conversation_memories: List[Dict],
        analysis: Dict
    ) -> Dict[str, Any]:
        """Generate a personalized, empathetic AI response."""
        
        if not self.client:
            return {
                "content": "I'm here to help with your health concerns. Please describe what you're experiencing.",
                "analysis": analysis
            }
        
        # Build comprehensive system prompt with conversation memories
        system_prompt = self._build_system_prompt(user_context, preferences, memories)
        
        # Add conversation memory context for ChatGPT-like continuity
        memory_context = await self.generate_continuation_prompt(user_context, conversation_memories)
        if memory_context:
            system_prompt += f"\n\n{memory_context}"
        
        # Build conversation context
        conversation_messages = [{"role": "system", "content": system_prompt}]
        
        # Add recent history
        for msg in history[-10:]:  # Last 10 messages for context
            conversation_messages.append({
                "role": msg["role"],
                "content": msg["content"]
            })
        
        # Add current message
        conversation_messages.append({"role": "user", "content": message})
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-4o",
                messages=conversation_messages,
                temperature=0.7,
                max_tokens=1500
            )
            
            ai_content = response.choices[0].message.content
            
            # Generate remedies if appropriate
            remedies = await self._generate_remedy_suggestions(
                message, user_context, preferences, analysis
            )
            
            return {
                "content": ai_content,
                "analysis": analysis,
                "remedies": remedies,
                "needs_follow_up": analysis.get("requires_follow_up", False)
            }
            
        except Exception as e:
            print(f"Error generating response: {e}")
            return {
                "content": "I apologize, but I'm having trouble processing your message right now. Please try again.",
                "analysis": analysis,
                "remedies": []
            }
    
    def _build_system_prompt(self, user_context: Dict, preferences: Dict, memories: List[Dict]) -> str:
        """Build a comprehensive system prompt for personalized responses."""
        
        personality = preferences.get("ai_personality", "caring_nurse")
        communication_style = preferences.get("communication_style", "empathetic")
        empathy_level = preferences.get("empathy_level", "high")
        comfort_mode = preferences.get("comfort_mode", True)
        
        personality_prompts = {
            "caring_nurse": "You are a warm, nurturing AI health companion who speaks like a caring nurse. You're empathetic, patient, and always prioritize the user's comfort and wellbeing. You remember past conversations and build a trusting relationship over time.",
            "wise_healer": "You are a wise, experienced healer who combines ancient wisdom with modern knowledge. You speak with gentle authority and focus on holistic healing. You have deep understanding of the user's health journey and provide guidance that grows with them.",
            "professional_doctor": "You are a professional, knowledgeable medical AI assistant. You provide clear, evidence-based information while maintaining a caring, professional demeanor. You build rapport through consistent, reliable guidance and remember the user's health patterns.",
            "ayurvedic_practitioner": "You are an Ayurvedic practitioner with deep knowledge of traditional Indian medicine. You focus on holistic healing, natural remedies, and balancing the body's energies. You understand the user's dosha and provide personalized guidance that evolves with their health journey."
        }
        
        base_personality = personality_prompts.get(personality, personality_prompts["caring_nurse"])
        
        # Build user context string
        context_parts = []
        if user_context.get("age"):
            context_parts.append(f"Age: {user_context['age']}")
        if user_context.get("gender"):
            context_parts.append(f"Gender: {user_context['gender']}")
        if user_context.get("health_profile", {}).get("medical_conditions"):
            context_parts.append(f"Medical conditions: {', '.join(user_context['health_profile']['medical_conditions'])}")
        if user_context.get("health_profile", {}).get("allergies"):
            context_parts.append(f"Allergies: {', '.join(user_context['health_profile']['allergies'])}")
        if user_context.get("health_profile", {}).get("medications"):
            context_parts.append(f"Current medications: {', '.join(user_context['health_profile']['medications'])}")
        
        context_string = "\n".join(context_parts) if context_parts else "No specific health information available"
        
        # Build memory context
        memory_context = ""
        if memories:
            memory_strings = [f"- {mem['title']}: {mem['content']}" for mem in memories[:5]]
            memory_context = f"\nRelevant health history and patterns:\n" + "\n".join(memory_strings)
        
        # Empathy level instructions
        empathy_instructions = {
            "high": "Use warm, comforting language. Acknowledge emotions first. Use phrases like 'I understand how you feel' and 'You're not alone in this'. Be very supportive and reassuring.",
            "medium": "Be caring but balanced. Acknowledge their concerns while providing practical guidance. Use phrases like 'I can see this is concerning' and 'Let's work through this together'.",
            "low": "Be professional and supportive. Focus on clear guidance while maintaining a caring tone. Use phrases like 'I understand your concern' and 'Here's what we can do'."
        }
        
        empathy_guidance = empathy_instructions.get(empathy_level, empathy_instructions["high"])
        
        # Comfort mode instructions
        comfort_guidance = ""
        if comfort_mode:
            comfort_guidance = """
Comfort Mode Guidelines:
- Always start with emotional acknowledgment: "I can hear the concern in your voice" or "I understand this must be worrying"
- Use reassuring phrases: "You're doing the right thing by reaching out", "I'm here to help you through this"
- End with encouragement: "You're taking great care of yourself", "I believe in your ability to heal"
- If they seem anxious, add extra reassurance: "It's completely normal to feel this way", "You're not overreacting"
"""
        
        system_prompt = f"""{base_personality}

Your mission is to provide compassionate, personalized health guidance that makes users feel heard, understood, and comforted. You are like ChatGPT but specialized for health - you remember everything, build relationships, and provide continuous support.

Key Guidelines:
1. **Always lead with empathy** - Acknowledge their feelings before providing information
2. **Be personalized** - Use their health context to tailor your advice specifically to them
3. **Provide comfort** - Make them feel safe, supported, and understood
4. **Be conversational** - Like ChatGPT, maintain natural flow and remember past conversations
5. **Offer hope** - Always include encouraging, supportive language
6. **Safety first** - Escalate urgent concerns appropriately
7. **Build relationship** - Reference past conversations, remember their preferences, show you care about them as a person

User Context:
{context_string}
{memory_context}

Communication Style: {communication_style}
Response Length: {preferences.get('response_length', 'detailed')}
Empathy Level: {empathy_level}
{empathy_guidance}
{comfort_guidance}

ChatGPT-like Features:
- Remember past conversations and reference them naturally
- Build on previous discussions: "I remember you mentioned..." or "Building on what we discussed last time..."
- Show continuity: "How has that been working for you?" or "I've been thinking about your situation"
- Be conversational and natural, not robotic
- Ask follow-up questions that show you're listening
- Adapt your responses based on what works for them

Personalization Rules:
- Always consider their age, gender, medical history, and allergies
- Reference their cultural preferences and remedy preferences
- Use their name when appropriate (from context)
- Tailor language complexity to their communication style
- Suggest remedies that fit their lifestyle and preferences

Remember:
- You're not just analyzing symptoms - you're providing comfort to someone who may be scared about their health
- You're building a long-term relationship, not just answering questions
- Every interaction should feel like talking to someone who knows and cares about them
- Balance medical accuracy with emotional support
- Suggest personalized remedies based on their profile and preferences
- Always end responses with warmth and encouragement

Respond naturally, as if you're a caring health companion who knows them well and has been supporting them for a long time."""

        return system_prompt
    
    async def _generate_remedy_suggestions(
        self, 
        message: str, 
        user_context: Dict, 
        preferences: Dict,
        analysis: Dict
    ) -> List[Dict[str, Any]]:
        """Generate personalized remedy suggestions with empathy and comfort."""
        
        if not self.client:
            return []
        
        remedy_preferences = preferences.get("remedy_preferences", {})
        cultural_considerations = preferences.get("cultural_considerations", {})
        empathy_level = preferences.get("empathy_level", "high")
        
        # Build personalized context for remedies
        personalization_context = []
        if user_context.get("age"):
            personalization_context.append(f"Age: {user_context['age']} years old")
        if user_context.get("gender"):
            personalization_context.append(f"Gender: {user_context['gender']}")
        if user_context.get("health_profile", {}).get("medical_conditions"):
            personalization_context.append(f"Medical conditions: {', '.join(user_context['health_profile']['medical_conditions'])}")
        if user_context.get("health_profile", {}).get("allergies"):
            personalization_context.append(f"Allergies: {', '.join(user_context['health_profile']['allergies'])}")
        if user_context.get("health_profile", {}).get("medications"):
            personalization_context.append(f"Current medications: {', '.join(user_context['health_profile']['medications'])}")
        
        context_string = "; ".join(personalization_context) if personalization_context else "No specific health information"
        
        # Empathy-based remedy presentation
        empathy_style = {
            "high": "Present remedies with warmth and reassurance. Use comforting language and emphasize safety and support.",
            "medium": "Present remedies in a caring but practical way. Balance comfort with clear instructions.",
            "low": "Present remedies professionally with clear, supportive guidance."
        }
        
        remedy_prompt = f"""
        Based on this health concern, suggest 2-3 personalized remedies that are tailored specifically to this person and presented with empathy and comfort.
        
        Health Concern: "{message}"
        User Context: {context_string}
        Cultural Preferences: {json.dumps(cultural_considerations, default=str)}
        Remedy Preferences: {json.dumps(remedy_preferences, default=str)}
        Emotional State: {analysis.get('sentiment', 'neutral')}
        Urgency Level: {analysis.get('urgency', 'low')}
        Empathy Style: {empathy_style.get(empathy_level, empathy_style['high'])}
        
        Requirements:
        1. **Personalize everything** - Consider their age, gender, medical history, allergies, and current medications
        2. **Safety first** - Check for contraindications with their medical conditions and medications
        3. **Cultural sensitivity** - Respect their cultural preferences and beliefs
        4. **Comfort and empathy** - Present remedies in a way that makes them feel supported and cared for
        5. **Practical and achievable** - Make sure remedies fit their lifestyle and capabilities
        
        For each remedy, consider:
        - Is it safe for their age and medical conditions?
        - Does it conflict with their current medications?
        - Does it respect their cultural preferences?
        - Is it something they can realistically do?
        - Will it make them feel better emotionally as well as physically?
        
        Respond in JSON format:
        {{
            "remedies": [
                {{
                    "type": "modern_medicine|ayurvedic|home_remedy|lifestyle|comfort_measure",
                    "title": "Warm, reassuring remedy title",
                    "description": "Comforting description of what this remedy does and why it's good for them specifically",
                    "instructions": "Step-by-step instructions with encouraging language",
                    "safety_level": "safe|caution|requires_consultation",
                    "personalization_factors": ["age", "allergies", "medical_history", "cultural_preferences"],
                    "confidence_score": 0.85,
                    "comfort_level": "high|medium|low",
                    "empathy_phrases": ["I understand this is concerning", "You're doing great by taking care of yourself"],
                    "safety_notes": "Any specific safety considerations for this person"
                }}
            ],
            "comfort_message": "A warm, reassuring message to accompany the remedies"
        }}
        """
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-4o",
                messages=[{"role": "user", "content": remedy_prompt}],
                temperature=0.6,
                max_tokens=1200
            )
            
            result = json.loads(response.choices[0].message.content)
            remedies = result.get("remedies", [])
            
            # Add comfort message to each remedy
            comfort_message = result.get("comfort_message", "")
            for remedy in remedies:
                remedy["comfort_message"] = comfort_message
            
            return remedies
            
        except Exception as e:
            print(f"Error generating remedies: {e}")
            return []
    
    async def _generate_personalized_remedies(
        self,
        db: Session,
        session_id: str,
        message_id: str,
        user_id: int,
        remedy_suggestions: List[Dict],
        user_context: Dict,
        analysis: Dict
    ) -> List[Dict[str, Any]]:
        """Create personalized remedy records in the database."""
        
        remedies = []
        for suggestion in remedy_suggestions:
            remedy = PersonalizedRemedy(
                id=str(uuid.uuid4()),
                session_id=session_id,
                message_id=message_id,
                user_id=user_id,
                remedy_type=suggestion.get("type", "general"),
                title=self.encryption.encrypt(suggestion.get("title", "")),
                description=self.encryption.encrypt(suggestion.get("description", "")),
                instructions=self.encryption.encrypt(suggestion.get("instructions", "")),
                personalization_factors=suggestion.get("personalization_factors", []),
                safety_level=suggestion.get("safety_level", "safe"),
                confidence_score=suggestion.get("confidence_score", 0.5),
                medical_disclaimer="This is not medical advice. Consult a healthcare professional for serious concerns."
            )
            
            db.add(remedy)
            remedies.append({
                "id": remedy.id,
                "type": remedy.remedy_type,
                "title": suggestion.get("title", ""),
                "description": suggestion.get("description", ""),
                "instructions": suggestion.get("instructions", ""),
                "safety_level": remedy.safety_level,
                "confidence_score": remedy.confidence_score
            })
        
        db.commit()
        return remedies
    
    async def _create_message(
        self,
        db: Session,
        session_id: str,
        role: str,
        content: str,
        content_type: str,
        audio_uri: Optional[str],
        image_uris: Optional[List[str]],
        analysis: Dict
    ) -> ChatMessage:
        """Create a message record in the database."""
        
        message = ChatMessage(
            id=str(uuid.uuid4()),
            session_id=session_id,
            role=role,
            content=self.encryption.encrypt(content),
            content_type=content_type,
            modality="text" if content_type == "text" else "voice",
            audio_uri=audio_uri,
            image_uris=image_uris or [],
            ai_analysis=analysis,
            sentiment=analysis.get("sentiment", "neutral"),
            urgency_detected=analysis.get("urgency", "low"),
            health_topics=analysis.get("topics", []),
            personalized_for=analysis.get("personalization_factors", {})
        )
        
        db.add(message)
        db.commit()
        db.refresh(message)
        
        return message
    
    async def _update_health_memories(
        self,
        db: Session,
        user_id: int,
        message_content: str,
        ai_response: Dict,
        user_context: Dict
    ):
        """Update health memories based on the conversation."""
        
        # This is a simplified version - in production, you'd use more sophisticated memory management
        if ai_response.get("analysis", {}).get("topics"):
            for topic in ai_response["analysis"]["topics"]:
                # Check if memory already exists
                existing = db.query(HealthMemory).filter(
                    HealthMemory.user_id == user_id,
                    HealthMemory.memory_type == "symptom_pattern"
                ).first()
                
                if not existing:
                    memory = HealthMemory(
                        id=str(uuid.uuid4()),
                        user_id=user_id,
                        memory_type="symptom_pattern",
                        title=self.encryption.encrypt(f"Health concern: {topic}"),
                        content=self.encryption.encrypt(f"User mentioned {topic} in conversation"),
                        importance_score=0.7,
                        context={"triggered_by": message_content[:100]},
                        tags=[topic]
                    )
                    db.add(memory)
        
        db.commit()
    
    async def _update_session(self, db: Session, session_id: str, ai_response: Dict):
        """Update session with new information."""
        session = db.query(ChatSession).filter(ChatSession.id == session_id).first()
        if session:
            session.last_activity = datetime.utcnow()
            if ai_response.get("analysis", {}).get("urgency") == "emergency":
                session.status = "urgent"
            db.commit()
    
    def _calculate_age(self, date_of_birth) -> Optional[int]:
        """Calculate age from date of birth."""
        if not date_of_birth:
            return None
        today = datetime.now().date()
        return today.year - date_of_birth.year - ((today.month, today.day) < (date_of_birth.month, date_of_birth.day))
    
    def _extract_health_profile(self, profile) -> Dict[str, Any]:
        """Extract health profile information."""
        if not profile:
            return {}
        
        return {
            "medical_conditions": self.encryption.decrypt(profile.medical_conditions).split(",") if profile.medical_conditions else [],
            "allergies": self.encryption.decrypt(profile.allergies).split(",") if profile.allergies else [],
            "medications": self.encryption.decrypt(profile.medications).split(",") if profile.medications else [],
            "blood_type": self.encryption.decrypt(profile.blood_type) if profile.blood_type else None,
            "dosha_primary": profile.dosha_primary,
            "diet_preferences": profile.diet_preferences or {}
        }
    
    def _extract_memory(self, memory) -> Dict[str, Any]:
        """Extract memory information."""
        return {
            "id": memory.id,
            "type": memory.memory_type,
            "title": self.encryption.decrypt(memory.title) if memory.title else "",
            "content": self.encryption.decrypt(memory.content) if memory.content else "",
            "importance": memory.importance_score,
            "tags": memory.tags or []
        }
    
    async def get_conversation_memory(self, db: Session, user_id: int, query: str = None) -> List[Dict]:
        """Get relevant conversation memories for ChatGPT-like continuity."""
        from app.models.enhanced_chat import ConversationMemory
        
        # Get recent memories
        memories = db.query(ConversationMemory).filter(
            ConversationMemory.user_id == user_id
        ).order_by(ConversationMemory.importance_score.desc()).limit(10).all()
        
        result = []
        for memory in memories:
            result.append({
                "id": memory.id,
                "type": memory.memory_type,
                "title": self.encryption.decrypt(memory.title) if memory.title else "",
                "content": self.encryption.decrypt(memory.content) if memory.content else "",
                "importance": memory.importance_score,
                "confidence": memory.confidence_score,
                "tags": memory.tags or [],
                "last_accessed": memory.last_accessed.isoformat() if memory.last_accessed else None,
                "access_count": memory.access_count,
                "effectiveness": memory.effectiveness_score
            })
        
        return result
    
    async def create_conversation_memory(
        self, 
        db: Session, 
        user_id: int, 
        memory_type: str, 
        title: str, 
        content: str,
        importance_score: float = 0.5,
        tags: List[str] = None,
        context: Dict = None
    ) -> str:
        """Create a new conversation memory."""
        from app.models.enhanced_chat import ConversationMemory
        
        memory = ConversationMemory(
            id=str(uuid.uuid4()),
            user_id=user_id,
            memory_type=memory_type,
            title=self.encryption.encrypt(title),
            content=self.encryption.encrypt(content),
            importance_score=importance_score,
            confidence_score=0.8,  # Default confidence
            context=context or {},
            tags=tags or [],
            effectiveness_score=0.5  # Will be updated based on usage
        )
        
        db.add(memory)
        db.commit()
        db.refresh(memory)
        
        return memory.id
    
    async def update_memory_usage(self, db: Session, memory_id: str):
        """Update memory usage statistics."""
        from app.models.enhanced_chat import ConversationMemory
        
        memory = db.query(ConversationMemory).filter(
            ConversationMemory.id == memory_id
        ).first()
        
        if memory:
            memory.access_count += 1
            memory.last_accessed = datetime.utcnow()
            db.commit()
    
    async def search_memories(self, db: Session, user_id: int, query: str, limit: int = 5) -> List[Dict]:
        """Search memories by content (simplified version - in production use vector search)."""
        from app.models.enhanced_chat import ConversationMemory
        
        # Simple text search - in production, use vector similarity
        memories = db.query(ConversationMemory).filter(
            ConversationMemory.user_id == user_id
        ).all()
        
        # Filter by query (simplified)
        relevant_memories = []
        query_lower = query.lower()
        
        for memory in memories:
            title = self.encryption.decrypt(memory.title) if memory.title else ""
            content = self.encryption.decrypt(memory.content) if memory.content else ""
            
            if query_lower in title.lower() or query_lower in content.lower():
                relevant_memories.append({
                    "id": memory.id,
                    "type": memory.memory_type,
                    "title": title,
                    "content": content,
                    "importance": memory.importance_score,
                    "confidence": memory.confidence_score,
                    "tags": memory.tags or []
                })
        
        # Sort by importance and return top results
        relevant_memories.sort(key=lambda x: x["importance"], reverse=True)
        return relevant_memories[:limit]
    
    async def generate_continuation_prompt(self, user_context: Dict, recent_memories: List[Dict]) -> str:
        """Generate a prompt that helps continue conversations naturally like ChatGPT."""
        
        if not recent_memories:
            return ""
        
        # Build memory context for continuation
        memory_contexts = []
        for memory in recent_memories[:3]:  # Top 3 most relevant memories
            memory_contexts.append(f"- {memory['title']}: {memory['content']}")
        
        if memory_contexts:
            return f"""
Recent conversation context and memories:
{chr(10).join(memory_contexts)}

Use this context to:
1. Reference past conversations naturally: "I remember you mentioned..." or "Building on our last discussion..."
2. Show continuity: "How has that been working for you?" or "I've been thinking about your situation"
3. Ask follow-up questions that show you're listening and care
4. Adapt your responses based on what has worked for them before
5. Make them feel like you remember and care about their ongoing health journey

Be conversational and natural, not robotic. Show that you're building a relationship with them over time.
"""
        
        return ""
    
    async def _create_conversation_memories(
        self,
        db: Session,
        user_id: int,
        message_content: str,
        ai_response: Dict,
        user_context: Dict
    ):
        """Create conversation memories for ChatGPT-like continuity."""
        
        # Extract key information from the conversation
        topics = ai_response.get("analysis", {}).get("topics", [])
        sentiment = ai_response.get("analysis", {}).get("sentiment", "neutral")
        urgency = ai_response.get("analysis", {}).get("urgency", "low")
        
        # Create memory for health concerns mentioned
        if topics:
            for topic in topics[:2]:  # Limit to top 2 topics
                await self.create_conversation_memory(
                    db=db,
                    user_id=user_id,
                    memory_type="health_concern",
                    title=f"Health concern: {topic}",
                    content=f"User mentioned {topic} in conversation. Context: {message_content[:100]}...",
                    importance_score=0.7 if urgency in ["high", "emergency"] else 0.5,
                    tags=[topic, sentiment, urgency],
                    context={
                        "original_message": message_content[:200],
                        "ai_response": ai_response["content"][:200],
                        "sentiment": sentiment,
                        "urgency": urgency
                    }
                )
        
        # Create memory for remedy preferences if remedies were suggested
        if ai_response.get("remedies"):
            remedy_types = [r.get("type", "unknown") for r in ai_response["remedies"]]
            await self.create_conversation_memory(
                db=db,
                user_id=user_id,
                memory_type="remedy_preference",
                title=f"Remedy preferences: {', '.join(set(remedy_types))}",
                content=f"User responded well to remedies of types: {', '.join(set(remedy_types))}. Context: {message_content[:100]}...",
                importance_score=0.6,
                tags=remedy_types + ["preference"],
                context={
                    "remedy_types": remedy_types,
                    "original_concern": message_content[:200]
                }
            )
        
        # Create memory for emotional patterns
        if sentiment in ["concerned", "anxious", "worried"]:
            await self.create_conversation_memory(
                db=db,
                user_id=user_id,
                memory_type="emotional_pattern",
                title=f"Emotional state: {sentiment}",
                content=f"User expressed {sentiment} feelings. May need extra comfort and reassurance in future conversations.",
                importance_score=0.8,
                tags=[sentiment, "emotional_support"],
                context={
                    "emotional_state": sentiment,
                    "comfort_needed": True,
                    "original_message": message_content[:200]
                }
            )
        
        # Create memory for user preferences and communication style
        if user_context.get("age") or user_context.get("gender"):
            await self.create_conversation_memory(
                db=db,
                user_id=user_id,
                memory_type="user_profile",
                title="User profile information",
                content=f"User profile: {user_context.get('age', 'unknown')} years old, {user_context.get('gender', 'not specified')}. Medical conditions: {', '.join(user_context.get('health_profile', {}).get('medical_conditions', []))}",
                importance_score=0.9,
                tags=["profile", "demographics"],
                context=user_context
            )

