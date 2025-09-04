"""
Sentry integration for CareBow backend error monitoring.
"""
import logging
from typing import Optional
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration
from sentry_sdk.integrations.sqlalchemy import SqlalchemyIntegration
from sentry_sdk.integrations.redis import RedisIntegration
from sentry_sdk.integrations.logging import LoggingIntegration
from sentry_sdk.integrations.httpx import HttpxIntegration

from app.core.config import settings

logger = logging.getLogger(__name__)


def init_sentry() -> None:
    """Initialize Sentry for error monitoring and performance tracking."""
    
    if not settings.SENTRY_DSN:
        logger.info("Sentry DSN not configured, skipping Sentry initialization")
        return
    
    # Configure logging integration
    sentry_logging = LoggingIntegration(
        level=logging.INFO,        # Capture info and above as breadcrumbs
        event_level=logging.ERROR  # Send errors as events
    )
    
    # Initialize Sentry with comprehensive integrations
    sentry_sdk.init(
        dsn=settings.SENTRY_DSN,
        environment=settings.ENVIRONMENT,
        release=settings.VERSION,
        
        # Integrations for different services
        integrations=[
            FastApiIntegration(auto_enabling_integrations=False),
            SqlalchemyIntegration(),
            RedisIntegration(),
            HttpxIntegration(),
            sentry_logging,
        ],
        
        # Performance monitoring
        traces_sample_rate=1.0 if settings.ENVIRONMENT == "development" else 0.1,
        
        # Error sampling
        sample_rate=1.0,
        
        # Additional configuration
        attach_stacktrace=True,
        send_default_pii=False,  # Don't send personally identifiable information
        
        # Custom tags
        before_send=before_send_filter,
        
        # Set user context
        before_send_transaction=before_send_transaction_filter,
    )
    
    # Set global tags
    sentry_sdk.set_tag("service", "carebow-backend")
    sentry_sdk.set_tag("version", settings.VERSION)
    
    logger.info(f"Sentry initialized for environment: {settings.ENVIRONMENT}")


def before_send_filter(event, hint):
    """Filter and modify events before sending to Sentry."""
    
    # Don't send certain types of errors in development
    if settings.ENVIRONMENT == "development":
        # Skip database connection errors in development
        if "database" in str(event.get("exception", {}).get("values", [{}])[0].get("type", "")).lower():
            return None
    
    # Add custom context
    event.setdefault("tags", {})
    event["tags"]["component"] = "backend"
    
    # Add user context if available (without PII)
    if "user" in event.get("contexts", {}):
        user_context = event["contexts"]["user"]
        # Remove sensitive information
        user_context.pop("email", None)
        user_context.pop("ip_address", None)
    
    return event


def before_send_transaction_filter(event, hint):
    """Filter performance transactions before sending to Sentry."""
    
    # Don't track health check endpoints in production
    if settings.ENVIRONMENT == "production":
        transaction_name = event.get("transaction", "")
        if transaction_name in ["/health", "/", "/api/v1/health"]:
            return None
    
    return event


def capture_exception_with_context(
    exception: Exception,
    user_id: Optional[int] = None,
    extra_context: Optional[dict] = None
) -> None:
    """Capture exception with additional context."""
    
    with sentry_sdk.push_scope() as scope:
        # Add user context
        if user_id:
            scope.set_user({"id": user_id})
        
        # Add extra context
        if extra_context:
            for key, value in extra_context.items():
                scope.set_extra(key, value)
        
        # Capture the exception
        sentry_sdk.capture_exception(exception)


def capture_message_with_context(
    message: str,
    level: str = "info",
    user_id: Optional[int] = None,
    extra_context: Optional[dict] = None
) -> None:
    """Capture a message with additional context."""
    
    with sentry_sdk.push_scope() as scope:
        # Add user context
        if user_id:
            scope.set_user({"id": user_id})
        
        # Add extra context
        if extra_context:
            for key, value in extra_context.items():
                scope.set_extra(key, value)
        
        # Capture the message
        sentry_sdk.capture_message(message, level=level)


def set_user_context(user_id: int, email: Optional[str] = None) -> None:
    """Set user context for current scope."""
    user_data = {"id": user_id}
    if email and settings.ENVIRONMENT == "development":
        # Only include email in development
        user_data["email"] = email
    
    sentry_sdk.set_user(user_data)


def add_breadcrumb(message: str, category: str = "custom", level: str = "info", data: Optional[dict] = None) -> None:
    """Add a breadcrumb for debugging context."""
    sentry_sdk.add_breadcrumb(
        message=message,
        category=category,
        level=level,
        data=data or {}
    )


# Decorator for automatic error capture
def sentry_trace(operation_name: str):
    """Decorator to automatically trace operations and capture errors."""
    def decorator(func):
        def wrapper(*args, **kwargs):
            with sentry_sdk.start_transaction(op="function", name=operation_name):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    capture_exception_with_context(
                        e,
                        extra_context={
                            "function": func.__name__,
                            "operation": operation_name,
                            "args": str(args)[:200],  # Limit size
                            "kwargs": str(kwargs)[:200]
                        }
                    )
                    raise
        return wrapper
    return decorator