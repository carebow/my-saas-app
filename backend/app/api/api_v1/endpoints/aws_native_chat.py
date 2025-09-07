# AWS-Native Chat Endpoints for CareBow
# Enhanced endpoints that integrate with AWS services for HIPAA-compliant chat functionality

from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
import json
import boto3
import uuid
from datetime import datetime, timedelta
import logging

from app.core.database import get_db
from app.core.config import settings
from app.models.enhanced_chat import (
    ChatSession, ChatMessage, PersonalizedRemedy, HealthMemory, 
    UserPreferences, DataExport, DataDeletion, ConversationMemory
)
from app.schemas.enhanced_chat import (
    ChatSessionCreate, ChatSessionResponse, ChatMessageCreate, ChatMessageResponse,
    PersonalizedRemedyResponse, HealthMemoryCreate, HealthMemoryResponse,
    UserPreferencesCreate, UserPreferencesResponse, DataExportResponse,
    DataDeletionResponse, ConversationMemoryResponse
)
from app.services.enhanced_ai_service import EnhancedAIService
from app.core.aws_client import get_aws_client

router = APIRouter()
security = HTTPBearer()
logger = logging.getLogger(__name__)

# AWS Clients
s3_client = boto3.client('s3')
sqs_client = boto3.client('sqs')
sns_client = boto3.client('sns')
stepfunctions_client = boto3.client('stepfunctions')
opensearch_client = boto3.client('opensearchserverless')

# Dependency to get current user from Cognito JWT
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Extract user information from Cognito JWT token"""
    try:
        # In production, validate JWT with Cognito
        # For now, extract from token claims
        token = credentials.credentials
        # TODO: Implement JWT validation with Cognito
        # This would typically involve:
        # 1. Decode JWT
        # 2. Validate signature with Cognito public keys
        # 3. Check expiration
        # 4. Extract user_id from 'sub' claim
        
        # Mock implementation for development
        user_id = "mock-user-id"  # Replace with actual JWT validation
        return {"user_id": user_id, "email": "user@example.com"}
    except Exception as e:
        logger.error(f"Error validating JWT token: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )

@router.post("/sessions", response_model=ChatSessionResponse)
async def create_chat_session(
    session_data: ChatSessionCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new chat session with AWS-native features"""
    try:
        # Create chat session
        db_session = ChatSession(
            user_id=current_user["user_id"],
            title=session_data.title,
            is_continuous=session_data.is_continuous,
            memory_enabled=session_data.memory_enabled,
            empathy_level=session_data.empathy_level,
            comfort_mode=session_data.comfort_mode,
            data_retention_policy=session_data.data_retention_policy
        )
        
        db.add(db_session)
        db.commit()
        db.refresh(db_session)
        
        # Store session metadata in S3 for audit
        session_metadata = {
            "session_id": str(db_session.id),
            "user_id": current_user["user_id"],
            "created_at": db_session.created_at.isoformat(),
            "title": db_session.title,
            "is_continuous": db_session.is_continuous,
            "memory_enabled": db_session.memory_enabled
        }
        
        s3_client.put_object(
            Bucket=settings.S3_CHAT_DATA_BUCKET,
            Key=f"sessions/{current_user['user_id']}/{db_session.id}/metadata.json",
            Body=json.dumps(session_metadata),
            ContentType="application/json",
            ServerSideEncryption="AES256"
        )
        
        return ChatSessionResponse.from_orm(db_session)
        
    except Exception as e:
        logger.error(f"Error creating chat session: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create chat session"
        )

@router.post("/sessions/{session_id}/messages", response_model=ChatMessageResponse)
async def send_message(
    session_id: str,
    message_data: ChatMessageCreate,
    background_tasks: BackgroundTasks,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Send a message and get AI response with AWS-native processing"""
    try:
        # Get chat session
        session = db.query(ChatSession).filter(
            ChatSession.id == session_id,
            ChatSession.user_id == current_user["user_id"]
        ).first()
        
        if not session:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Chat session not found"
            )
        
        # Create user message
        user_message = ChatMessage(
            session_id=session_id,
            user_id=current_user["user_id"],
            content=message_data.content,
            message_type="user",
            message_sequence=message_data.message_sequence,
            parent_message_id=message_data.parent_message_id,
            is_edited=message_data.is_edited,
            edit_history=message_data.edit_history,
            user_feedback=message_data.user_feedback,
            empathy_indicators=message_data.empathy_indicators,
            context_used=message_data.context_used,
            follow_up_required=message_data.follow_up_required,
            follow_up_scheduled=message_data.follow_up_scheduled
        )
        
        db.add(user_message)
        db.commit()
        db.refresh(user_message)
        
        # Store message in S3 for audit
        message_metadata = {
            "message_id": str(user_message.id),
            "session_id": session_id,
            "user_id": current_user["user_id"],
            "content": user_message.content,
            "message_type": user_message.message_type,
            "created_at": user_message.created_at.isoformat()
        }
        
        s3_client.put_object(
            Bucket=settings.S3_CHAT_DATA_BUCKET,
            Key=f"messages/{current_user['user_id']}/{session_id}/{user_message.id}/metadata.json",
            Body=json.dumps(message_metadata),
            ContentType="application/json",
            ServerSideEncryption="AES256"
        )
        
        # Process message with AI service
        ai_service = EnhancedAIService(db)
        
        # Get conversation memories
        conversation_memories = ai_service.get_conversation_memory(current_user["user_id"])
        
        # Generate AI response
        ai_response = await ai_service.process_message(
            user_id=current_user["user_id"],
            session_id=session_id,
            message_content=message_data.content,
            conversation_memories=conversation_memories
        )
        
        # Create AI message
        ai_message = ChatMessage(
            session_id=session_id,
            user_id=current_user["user_id"],
            content=ai_response["response"],
            message_type="assistant",
            message_sequence=user_message.message_sequence + 1,
            parent_message_id=user_message.id,
            empathy_indicators=ai_response.get("empathy_indicators", {}),
            context_used=ai_response.get("context_used", {}),
            follow_up_required=ai_response.get("follow_up_required", False),
            follow_up_scheduled=ai_response.get("follow_up_scheduled")
        )
        
        db.add(ai_message)
        db.commit()
        db.refresh(ai_message)
        
        # Store AI response in S3
        ai_message_metadata = {
            "message_id": str(ai_message.id),
            "session_id": session_id,
            "user_id": current_user["user_id"],
            "content": ai_message.content,
            "message_type": ai_message.message_type,
            "created_at": ai_message.created_at.isoformat(),
            "ai_metadata": ai_response.get("metadata", {})
        }
        
        s3_client.put_object(
            Bucket=settings.S3_CHAT_DATA_BUCKET,
            Key=f"messages/{current_user['user_id']}/{session_id}/{ai_message.id}/metadata.json",
            Body=json.dumps(ai_message_metadata),
            ContentType="application/json",
            ServerSideEncryption="AES256"
        )
        
        # Store conversation memory in OpenSearch
        if session.memory_enabled:
            memory_data = {
                "user_id": current_user["user_id"],
                "session_id": session_id,
                "message_id": str(ai_message.id),
                "content": ai_response["response"],
                "timestamp": ai_message.created_at.isoformat(),
                "metadata": ai_response.get("metadata", {})
            }
            
            # Index in OpenSearch for semantic search
            opensearch_client.index(
                index=f"carebow-memories-{current_user['user_id']}",
                body=memory_data
            )
        
        # Create personalized remedies if applicable
        remedies = []
        if ai_response.get("remedies"):
            for remedy_data in ai_response["remedies"]:
                remedy = PersonalizedRemedy(
                    session_id=session_id,
                    user_id=current_user["user_id"],
                    remedy_type=remedy_data["type"],
                    title=remedy_data["title"],
                    description=remedy_data["description"],
                    instructions=remedy_data["instructions"],
                    safety_notes=remedy_data.get("safety_notes", ""),
                    effectiveness_score=remedy_data.get("effectiveness_score", 0.0),
                    personalization_factors=remedy_data.get("personalization_factors", {}),
                    comfort_level=remedy_data.get("comfort_level", "medium"),
                    empathy_phrases=remedy_data.get("empathy_phrases", []),
                    comfort_message=remedy_data.get("comfort_message", "")
                )
                
                db.add(remedy)
                db.commit()
                db.refresh(remedy)
                remedies.append(remedy)
        
        # Schedule background tasks
        background_tasks.add_task(
            store_conversation_memory,
            current_user["user_id"],
            session_id,
            ai_response
        )
        
        background_tasks.add_task(
            update_user_analytics,
            current_user["user_id"],
            session_id,
            message_data.content
        )
        
        return ChatMessageResponse.from_orm(ai_message)
        
    except Exception as e:
        logger.error(f"Error processing message: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to process message"
        )

@router.post("/export-data", response_model=DataExportResponse)
async def request_data_export(
    export_type: str = "full",
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Request data export with AWS Step Functions orchestration"""
    try:
        # Create export request record
        export_request = DataExport(
            user_id=current_user["user_id"],
            export_type=export_type,
            status="pending",
            requested_at=datetime.utcnow(),
            expires_at=datetime.utcnow() + timedelta(days=7)
        )
        
        db.add(export_request)
        db.commit()
        db.refresh(export_request)
        
        # Start Step Functions execution
        execution_input = {
            "user_id": current_user["user_id"],
            "export_id": str(export_request.id),
            "export_type": export_type,
            "requested_at": export_request.requested_at.isoformat()
        }
        
        stepfunctions_client.start_execution(
            stateMachineArn=settings.DATA_EXPORT_STATE_MACHINE_ARN,
            name=f"export-{current_user['user_id']}-{export_request.id}",
            input=json.dumps(execution_input)
        )
        
        return DataExportResponse.from_orm(export_request)
        
    except Exception as e:
        logger.error(f"Error requesting data export: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to request data export"
        )

@router.post("/delete-account", response_model=DataDeletionResponse)
async def request_account_deletion(
    reason: str = "User requested account deletion",
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Request account deletion with grace period"""
    try:
        # Create deletion request record
        deletion_request = DataDeletion(
            user_id=current_user["user_id"],
            deletion_type="account",
            status="pending",
            reason=reason,
            requested_at=datetime.utcnow(),
            grace_period_days=7,
            grace_period_ends=datetime.utcnow() + timedelta(days=7),
            can_cancel=True
        )
        
        db.add(deletion_request)
        db.commit()
        db.refresh(deletion_request)
        
        # Start Step Functions execution
        execution_input = {
            "user_id": current_user["user_id"],
            "deletion_id": str(deletion_request.id),
            "deletion_type": "account",
            "reason": reason,
            "requested_at": deletion_request.requested_at.isoformat()
        }
        
        stepfunctions_client.start_execution(
            stateMachineArn=settings.DATA_DELETION_STATE_MACHINE_ARN,
            name=f"deletion-{current_user['user_id']}-{deletion_request.id}",
            input=json.dumps(execution_input)
        )
        
        return DataDeletionResponse.from_orm(deletion_request)
        
    except Exception as e:
        logger.error(f"Error requesting account deletion: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to request account deletion"
        )

@router.get("/memories/search")
async def search_memories(
    query: str,
    limit: int = 10,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Search conversation memories using OpenSearch"""
    try:
        # Search in OpenSearch
        search_response = opensearch_client.search(
            index=f"carebow-memories-{current_user['user_id']}",
            body={
                "query": {
                    "multi_match": {
                        "query": query,
                        "fields": ["content", "metadata.*"]
                    }
                },
                "size": limit,
                "sort": [{"timestamp": {"order": "desc"}}]
            }
        )
        
        memories = []
        for hit in search_response["hits"]["hits"]:
            memory_data = hit["_source"]
            memories.append({
                "id": hit["_id"],
                "content": memory_data["content"],
                "timestamp": memory_data["timestamp"],
                "metadata": memory_data.get("metadata", {}),
                "score": hit["_score"]
            })
        
        return {"memories": memories, "total": search_response["hits"]["total"]["value"]}
        
    except Exception as e:
        logger.error(f"Error searching memories: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to search memories"
        )

@router.get("/memories")
async def get_all_memories(
    limit: int = 50,
    offset: int = 0,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all conversation memories for the user"""
    try:
        memories = db.query(ConversationMemory).filter(
            ConversationMemory.user_id == current_user["user_id"]
        ).offset(offset).limit(limit).all()
        
        return [ConversationMemoryResponse.from_orm(memory) for memory in memories]
        
    except Exception as e:
        logger.error(f"Error getting memories: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get memories"
        )

# Background task functions
async def store_conversation_memory(user_id: str, session_id: str, ai_response: dict):
    """Store conversation memory in OpenSearch"""
    try:
        memory_data = {
            "user_id": user_id,
            "session_id": session_id,
            "content": ai_response["response"],
            "timestamp": datetime.utcnow().isoformat(),
            "metadata": ai_response.get("metadata", {})
        }
        
        opensearch_client.index(
            index=f"carebow-memories-{user_id}",
            body=memory_data
        )
        
    except Exception as e:
        logger.error(f"Error storing conversation memory: {e}")

async def update_user_analytics(user_id: str, session_id: str, message_content: str):
    """Update user analytics in S3"""
    try:
        analytics_data = {
            "user_id": user_id,
            "session_id": session_id,
            "message_length": len(message_content),
            "timestamp": datetime.utcnow().isoformat(),
            "message_type": "user_input"
        }
        
        s3_client.put_object(
            Bucket=settings.S3_CHAT_DATA_BUCKET,
            Key=f"analytics/{user_id}/{session_id}/{datetime.utcnow().strftime('%Y/%m/%d')}/analytics.json",
            Body=json.dumps(analytics_data),
            ContentType="application/json",
            ServerSideEncryption="AES256"
        )
        
    except Exception as e:
        logger.error(f"Error updating user analytics: {e}")
