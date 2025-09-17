"""
Symptom session management endpoints for CareBow.
"""
from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
import uuid
from datetime import datetime, timedelta

from app.api import deps
from app.models.user import User
from app.models.symptom_sessions import (
    SymptomSession, SymptomAnswer, TriageResult, 
    SessionStatus, ChannelType, RiskLevel
)
from app.schemas.symptom_sessions import (
    SymptomSessionCreate, SymptomSessionResponse,
    SymptomAnswerCreate, SymptomAnswerResponse,
    TriageResultResponse, NextQuestionResponse,
    TriageRequest, TriageJobResponse
)
from app.services.enhanced_ai_service import EnhancedAIService
from app.services.triage_service import TriageService

router = APIRouter()
enhanced_ai_service = EnhancedAIService()
triage_service = TriageService()


@router.post("/sessions", response_model=SymptomSessionResponse, status_code=status.HTTP_201_CREATED)
def create_symptom_session(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
    session_data: SymptomSessionCreate
) -> Any:
    """Create a new symptom analysis session."""
    try:
        # Generate unique session UUID
        session_uuid = str(uuid.uuid4())
        
        # Create session
        db_session = SymptomSession(
            user_id=current_user.id,
            session_uuid=session_uuid,
            channel=ChannelType(session_data.channel),
            primary_complaint=session_data.primary_complaint,
            severity=session_data.severity,
            duration_text=session_data.duration_text,
            status=SessionStatus.OPEN
        )
        
        db.add(db_session)
        db.commit()
        db.refresh(db_session)
        
        return db_session
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create symptom session: {str(e)}"
        )


@router.get("/sessions/{session_uuid}", response_model=SymptomSessionResponse)
def get_symptom_session(
    session_uuid: str,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    """Get a specific symptom session."""
    session = db.query(SymptomSession).filter(
        SymptomSession.session_uuid == session_uuid,
        SymptomSession.user_id == current_user.id
    ).first()
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Symptom session not found"
        )
    
    return session


@router.get("/sessions", response_model=List[SymptomSessionResponse])
def list_symptom_sessions(
    skip: int = 0,
    limit: int = 100,
    status: Optional[SessionStatus] = None,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    """List user's symptom sessions."""
    query = db.query(SymptomSession).filter(SymptomSession.user_id == current_user.id)
    
    if status:
        query = query.filter(SymptomSession.status == status)
    
    sessions = query.offset(skip).limit(limit).all()
    return sessions


@router.post("/sessions/{session_uuid}/answers", response_model=SymptomAnswerResponse, status_code=status.HTTP_201_CREATED)
def submit_symptom_answer(
    session_uuid: str,
    answer_data: SymptomAnswerCreate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    """Submit an answer to a symptom session question."""
    # Get session
    session = db.query(SymptomSession).filter(
        SymptomSession.session_uuid == session_uuid,
        SymptomSession.user_id == current_user.id
    ).first()
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Symptom session not found"
        )
    
    if session.status not in [SessionStatus.OPEN, SessionStatus.IN_PROGRESS]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Session is not active"
        )
    
    try:
        # Create answer
        answer = SymptomAnswer(
            session_id=session.id,
            question_id=answer_data.question_id,
            question_text=answer_data.question_text,
            question_type=answer_data.question_type,
            answer_text=answer_data.answer_text,
            structured_payload=answer_data.structured_payload
        )
        
        db.add(answer)
        
        # Update session status and last activity
        session.status = SessionStatus.IN_PROGRESS
        session.last_activity = datetime.utcnow()
        
        db.commit()
        db.refresh(answer)
        
        return answer
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to submit answer: {str(e)}"
        )


@router.get("/sessions/{session_uuid}/next-question", response_model=NextQuestionResponse)
def get_next_question(
    session_uuid: str,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    """Get the next question for a symptom session."""
    # Get session
    session = db.query(SymptomSession).filter(
        SymptomSession.session_uuid == session_uuid,
        SymptomSession.user_id == current_user.id
    ).first()
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Symptom session not found"
        )
    
    if session.status not in [SessionStatus.OPEN, SessionStatus.IN_PROGRESS]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Session is not active"
        )
    
    try:
        # Get conversation history
        answers = db.query(SymptomAnswer).filter(
            SymptomAnswer.session_id == session.id
        ).order_by(SymptomAnswer.created_at).all()
        
        conversation_history = []
        for answer in answers:
            conversation_history.append({
                "question": answer.question_text,
                "answer": answer.answer_text,
                "timestamp": answer.created_at.isoformat()
            })
        
        # Get next question from AI service
        next_question = enhanced_ai_service.get_follow_up_questions(
            conversation_history=conversation_history,
            current_symptom=session.primary_complaint
        )
        
        if not next_question:
            # No more questions, session is complete
            session.status = SessionStatus.COMPLETED
            db.commit()
            
            return NextQuestionResponse(
                question_id=None,
                question_text="No more questions needed. You can now request triage analysis.",
                question_type="completion",
                options=[],
                session_complete=True
            )
        
        return NextQuestionResponse(
            question_id=f"q_{len(answers) + 1}",
            question_text=next_question[0] if next_question else "How are you feeling now?",
            question_type="single_select",
            options=["Much better", "Same", "Worse", "Much worse"],
            session_complete=False
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get next question: {str(e)}"
        )


@router.post("/sessions/{session_uuid}/triage", response_model=TriageJobResponse)
def request_triage_analysis(
    session_uuid: str,
    background_tasks: BackgroundTasks,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    """Request triage analysis for a symptom session."""
    # Get session
    session = db.query(SymptomSession).filter(
        SymptomSession.session_uuid == session_uuid,
        SymptomSession.user_id == current_user.id
    ).first()
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Symptom session not found"
        )
    
    if session.status != SessionStatus.IN_PROGRESS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Session must be in progress to request triage"
        )
    
    try:
        # Generate job ID
        job_id = str(uuid.uuid4())
        
        # Start background triage processing
        background_tasks.add_task(
            process_triage_analysis,
            session.id,
            job_id
        )
        
        return TriageJobResponse(
            job_id=job_id,
            estimated_seconds=5,
            status="processing"
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to start triage analysis: {str(e)}"
        )


@router.get("/sessions/{session_uuid}/triage-result", response_model=TriageResultResponse)
def get_triage_result(
    session_uuid: str,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    """Get triage analysis result for a symptom session."""
    # Get session
    session = db.query(SymptomSession).filter(
        SymptomSession.session_uuid == session_uuid,
        SymptomSession.user_id == current_user.id
    ).first()
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Symptom session not found"
        )
    
    # Get triage result
    triage_result = db.query(TriageResult).filter(
        TriageResult.session_id == session.id
    ).first()
    
    if not triage_result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Triage result not found. Analysis may still be in progress."
        )
    
    return triage_result


@router.post("/sessions/{session_uuid}/report", response_model=dict)
def generate_report(
    session_uuid: str,
    background_tasks: BackgroundTasks,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    """Generate a PDF report for a symptom session."""
    # Get session
    session = db.query(SymptomSession).filter(
        SymptomSession.session_uuid == session_uuid,
        SymptomSession.user_id == current_user.id
    ).first()
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Symptom session not found"
        )
    
    # Get triage result
    triage_result = db.query(TriageResult).filter(
        TriageResult.session_id == session.id
    ).first()
    
    if not triage_result:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Triage result not found. Complete analysis first."
        )
    
    try:
        # Generate signed URL for report
        report_url = triage_service.generate_report_url(session_uuid)
        
        # Update triage result with report info
        triage_result.report_generated = True
        triage_result.report_url = report_url
        triage_result.report_expires_at = datetime.utcnow() + timedelta(hours=24)
        
        db.commit()
        
        return {
            "report_url": report_url,
            "expires_at": triage_result.report_expires_at.isoformat(),
            "status": "generated"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate report: {str(e)}"
        )


async def process_triage_analysis(session_id: int, job_id: str):
    """Background task to process triage analysis."""
    # This would be implemented with Celery or similar async task queue
    # For now, we'll simulate the process
    pass
