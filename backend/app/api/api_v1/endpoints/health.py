from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api import deps
from app.models.user import User
from app.models.health import HealthProfile, HealthMetric
from app.schemas.health import (
    HealthProfileCreate, 
    HealthProfileResponse, 
    HealthMetricCreate, 
    HealthMetricResponse
)

router = APIRouter()


@router.post("/profile", response_model=HealthProfileResponse)
def create_health_profile(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
    profile_in: HealthProfileCreate,
) -> Any:
    """
    Create or update health profile.
    """
    # Check if profile exists
    existing_profile = db.query(HealthProfile).filter(
        HealthProfile.user_id == current_user.id
    ).first()
    
    if existing_profile:
        # Update existing profile
        for field, value in profile_in.dict(exclude_unset=True).items():
            setattr(existing_profile, field, value)
        db.commit()
        db.refresh(existing_profile)
        profile = existing_profile
    else:
        # Create new profile
        profile = HealthProfile(
            user_id=current_user.id,
            **profile_in.dict()
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)
    
    return HealthProfileResponse(
        id=profile.id,
        height=profile.height,
        weight=profile.weight,
        blood_type=profile.blood_type,
        allergies=profile.allergies,
        medications=profile.medications,
        medical_conditions=profile.medical_conditions,
        dosha_primary=profile.dosha_primary,
        dosha_secondary=profile.dosha_secondary,
        constitution_analysis=profile.constitution_analysis,
        diet_preferences=profile.diet_preferences,
        exercise_routine=profile.exercise_routine,
        sleep_pattern=profile.sleep_pattern,
        stress_level=profile.stress_level,
        created_at=profile.created_at,
        updated_at=profile.updated_at,
    )


@router.get("/profile", response_model=HealthProfileResponse)
def get_health_profile(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get user's health profile.
    """
    profile = db.query(HealthProfile).filter(
        HealthProfile.user_id == current_user.id
    ).first()
    
    if not profile:
        raise HTTPException(status_code=404, detail="Health profile not found")
    
    return HealthProfileResponse(
        id=profile.id,
        height=profile.height,
        weight=profile.weight,
        blood_type=profile.blood_type,
        allergies=profile.allergies,
        medications=profile.medications,
        medical_conditions=profile.medical_conditions,
        dosha_primary=profile.dosha_primary,
        dosha_secondary=profile.dosha_secondary,
        constitution_analysis=profile.constitution_analysis,
        diet_preferences=profile.diet_preferences,
        exercise_routine=profile.exercise_routine,
        sleep_pattern=profile.sleep_pattern,
        stress_level=profile.stress_level,
        created_at=profile.created_at,
        updated_at=profile.updated_at,
    )


@router.post("/metrics", response_model=HealthMetricResponse)
def add_health_metric(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
    metric_in: HealthMetricCreate,
) -> Any:
    """
    Add a health metric.
    """
    metric = HealthMetric(
        user_id=current_user.id,
        **metric_in.dict()
    )
    db.add(metric)
    db.commit()
    db.refresh(metric)
    
    return HealthMetricResponse(
        id=metric.id,
        metric_type=metric.metric_type,
        value=metric.value,
        unit=metric.unit,
        notes=metric.notes,
        recorded_at=metric.recorded_at,
    )


@router.get("/metrics", response_model=List[HealthMetricResponse])
def get_health_metrics(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
    metric_type: str = None,
    skip: int = 0,
    limit: int = 50,
) -> Any:
    """
    Get user's health metrics.
    """
    query = db.query(HealthMetric).filter(HealthMetric.user_id == current_user.id)
    
    if metric_type:
        query = query.filter(HealthMetric.metric_type == metric_type)
    
    metrics = query.offset(skip).limit(limit).all()
    
    return [
        HealthMetricResponse(
            id=m.id,
            metric_type=m.metric_type,
            value=m.value,
            unit=m.unit,
            notes=m.notes,
            recorded_at=m.recorded_at,
        )
        for m in metrics
    ]