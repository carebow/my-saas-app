from typing import Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel


class HealthProfileBase(BaseModel):
    height: Optional[str] = None
    weight: Optional[str] = None
    blood_type: Optional[str] = None
    allergies: Optional[str] = None
    medications: Optional[str] = None
    medical_conditions: Optional[str] = None
    dosha_primary: Optional[str] = None
    dosha_secondary: Optional[str] = None
    constitution_analysis: Optional[Dict[str, Any]] = None
    diet_preferences: Optional[Dict[str, Any]] = None
    exercise_routine: Optional[str] = None
    sleep_pattern: Optional[str] = None
    stress_level: Optional[str] = None


class HealthProfileCreate(HealthProfileBase):
    pass


class HealthProfileResponse(HealthProfileBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class HealthMetricBase(BaseModel):
    metric_type: str
    value: str
    unit: Optional[str] = None
    notes: Optional[str] = None


class HealthMetricCreate(HealthMetricBase):
    pass


class HealthMetricResponse(HealthMetricBase):
    id: int
    recorded_at: datetime

    class Config:
        from_attributes = True