from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import Any, Dict, List
from datetime import datetime, timedelta

from app.api import deps
from app.models.user import User, SubscriptionTier
from app.models.health import Consultation, HealthMetric
from app.models.conversations import Conversation

router = APIRouter()


@router.get("/dashboard-stats")
def get_dashboard_stats(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    """
    Get admin dashboard statistics.
    Note: In production, add proper admin role checking.
    """
    
    # Total users
    total_users = db.query(User).count()
    
    # Active users (logged in within last 30 days)
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    active_users = db.query(User).filter(
        User.updated_at >= thirty_days_ago
    ).count()
    
    # Total consultations
    total_consultations = db.query(Consultation).count()
    
    # Total conversations
    total_conversations = db.query(Conversation).count()
    
    # Total health metrics
    total_health_metrics = db.query(HealthMetric).count()
    
    # Subscription breakdown
    subscription_breakdown = {}
    for tier in SubscriptionTier:
        count = db.query(User).filter(User.subscription_tier == tier).count()
        subscription_breakdown[tier.value.upper()] = count
    
    # Recent activity (last 10 activities)
    recent_activity = []
    
    # Recent users
    recent_users = db.query(User).order_by(desc(User.created_at)).limit(5).all()
    for user in recent_users:
        recent_activity.append({
            "type": "New User",
            "description": f"User registered: {user.email}",
            "timestamp": user.created_at.isoformat()
        })
    
    # Recent consultations
    recent_consultations = db.query(Consultation).order_by(desc(Consultation.created_at)).limit(5).all()
    for consultation in recent_consultations:
        recent_activity.append({
            "type": "Consultation",
            "description": f"AI consultation completed",
            "timestamp": consultation.created_at.isoformat()
        })
    
    # Recent health metrics
    recent_metrics = db.query(HealthMetric).order_by(desc(HealthMetric.recorded_at)).limit(5).all()
    for metric in recent_metrics:
        recent_activity.append({
            "type": "Health Metric",
            "description": f"{metric.metric_type}: {metric.value} {metric.unit or ''}",
            "timestamp": metric.recorded_at.isoformat()
        })
    
    # Sort recent activity by timestamp
    recent_activity.sort(key=lambda x: x["timestamp"], reverse=True)
    recent_activity = recent_activity[:10]  # Keep only top 10
    
    return {
        "totalUsers": total_users,
        "activeUsers": active_users,
        "totalConsultations": total_consultations,
        "totalConversations": total_conversations,
        "totalHealthMetrics": total_health_metrics,
        "subscriptionBreakdown": subscription_breakdown,
        "recentActivity": recent_activity
    }


@router.get("/user-analytics")
def get_user_analytics(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    """
    Get detailed user analytics.
    """
    
    # User registration over time (last 30 days)
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    
    daily_registrations = []
    for i in range(30):
        date = thirty_days_ago + timedelta(days=i)
        next_date = date + timedelta(days=1)
        
        count = db.query(User).filter(
            User.created_at >= date,
            User.created_at < next_date
        ).count()
        
        daily_registrations.append({
            "date": date.strftime("%Y-%m-%d"),
            "registrations": count
        })
    
    # Consultation usage by subscription tier
    consultation_by_tier = {}
    for tier in SubscriptionTier:
        users_in_tier = db.query(User).filter(User.subscription_tier == tier).all()
        user_ids = [u.id for u in users_in_tier]
        
        if user_ids:
            consultations = db.query(Consultation).filter(
                Consultation.user_id.in_(user_ids)
            ).count()
        else:
            consultations = 0
            
        consultation_by_tier[tier.value] = consultations
    
    return {
        "dailyRegistrations": daily_registrations,
        "consultationsByTier": consultation_by_tier
    }


@router.get("/system-health")
def get_system_health(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    """
    Get system health metrics.
    """
    
    try:
        # Test database connection
        db.execute("SELECT 1")
        db_status = "healthy"
    except Exception:
        db_status = "error"
    
    # Check recent error rates (this would integrate with your logging system)
    # For now, we'll simulate this
    error_rate = 0.1  # 0.1% error rate
    
    # Response time metrics (would come from monitoring)
    avg_response_time = 150  # ms
    
    return {
        "database": {
            "status": db_status,
            "connections": "normal"
        },
        "api": {
            "errorRate": error_rate,
            "avgResponseTime": avg_response_time,
            "status": "healthy" if error_rate < 1.0 else "warning"
        },
        "monitoring": {
            "sentry": "active",
            "analytics": "active"
        }
    }