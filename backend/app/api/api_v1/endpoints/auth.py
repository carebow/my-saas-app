from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
import logging

from app.api import deps
from app.core import security
from app.core.config import settings
from app.core.sentry import capture_exception_with_context, set_user_context, add_breadcrumb
from app.models.user import User
from app.schemas.auth import Token, UserCreate, UserResponse
from app.schemas.user import UserCreate as UserCreateSchema

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/register", response_model=UserResponse)
def register(
    *,
    db: Session = Depends(deps.get_db),
    user_in: UserCreate,
) -> Any:
    """
    Create new user account.
    """
    try:
        add_breadcrumb("Starting user registration", category="auth")
        
        # Check if user already exists
        user = db.query(User).filter(User.email == user_in.email).first()
        if user:
            add_breadcrumb("User registration failed - email exists", category="auth", level="warning")
            raise HTTPException(
                status_code=400,
                detail="The user with this email already exists in the system.",
            )
        
        # Create new user
        user = User(
            email=user_in.email,
            hashed_password=security.get_password_hash(user_in.password),
            full_name=user_in.full_name,
            is_active=True,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        
        # Set user context for Sentry
        set_user_context(user.id, user.email)
        add_breadcrumb("User registration successful", category="auth")
        
        logger.info(f"New user registered: {user.id}")
        
        return UserResponse(
            id=user.id,
            email=user.email,
            full_name=user.full_name,
            is_active=user.is_active,
            subscription_tier=user.subscription_tier,
            consultations_used=user.consultations_used,
            consultations_limit=user.consultations_limit,
        )
    
    except HTTPException:
        raise
    except Exception as e:
        capture_exception_with_context(
            e,
            extra_context={
                "operation": "user_registration",
                "email": user_in.email,
                "full_name": user_in.full_name
            }
        )
        logger.error(f"User registration failed: {e}")
        raise HTTPException(
            status_code=500,
            detail="Registration failed. Please try again."
        )


@router.post("/login", response_model=Token)
def login_for_access_token(
    db: Session = Depends(deps.get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests.
    """
    try:
        add_breadcrumb("Starting user login", category="auth")
        
        user = db.query(User).filter(User.email == form_data.username).first()
        if not user or not security.verify_password(form_data.password, user.hashed_password):
            add_breadcrumb("Login failed - invalid credentials", category="auth", level="warning")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        elif not user.is_active:
            add_breadcrumb("Login failed - inactive user", category="auth", level="warning")
            set_user_context(user.id, user.email)
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Inactive user")
        
        # Set user context for Sentry
        set_user_context(user.id, user.email)
        add_breadcrumb("User login successful", category="auth")
        
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = security.create_access_token(
            user.id, expires_delta=access_token_expires
        )
        
        logger.info(f"User logged in: {user.id}")
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": UserResponse(
                id=user.id,
                email=user.email,
                full_name=user.full_name,
                is_active=user.is_active,
                subscription_tier=user.subscription_tier,
                consultations_used=user.consultations_used,
                consultations_limit=user.consultations_limit,
            )
        }
    
    except HTTPException:
        raise
    except Exception as e:
        capture_exception_with_context(
            e,
            extra_context={
                "operation": "user_login",
                "username": form_data.username
            }
        )
        logger.error(f"User login failed: {e}")
        raise HTTPException(
            status_code=500,
            detail="Login failed. Please try again."
        )


@router.post("/test-token", response_model=UserResponse)
def test_token(current_user: User = Depends(deps.get_current_user)) -> Any:
    """
    Test access token.
    """
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        full_name=current_user.full_name,
        is_active=current_user.is_active,
        subscription_tier=current_user.subscription_tier,
        consultations_used=current_user.consultations_used,
        consultations_limit=current_user.consultations_limit,
    )