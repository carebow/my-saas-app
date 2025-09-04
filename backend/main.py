from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import logging
import os
from dotenv import load_dotenv
from starlette.exceptions import HTTPException as StarletteHTTPException

# Load environment variables - prioritize test env when running tests
env_file = os.getenv("ENV_FILE", ".env.test" if "pytest" in os.environ.get("_", "") else ".env")
load_dotenv(env_file)

from app.core.config import settings
from app.core.sentry import init_sentry, capture_exception_with_context, set_user_context
from app.api.api_v1.api import api_router
from app.db.init_db import init_db

# Initialize Sentry before creating the FastAPI app
init_sentry()

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting CareBow API...")
    init_db()
    logger.info("CareBow API startup complete")
    yield
    # Shutdown
    logger.info("CareBow API shutting down...")


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="CareBow AI Health Assistant API",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)


# HTTP Exception handler for consistent JSON responses
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler that captures errors to Sentry."""
    
    # Extract user context if available
    user_id = None
    try:
        # Try to get user from request state (set by auth middleware)
        if hasattr(request.state, "user"):
            user_id = request.state.user.id
            set_user_context(user_id)
    except:
        pass
    
    # Only capture to Sentry if not in test mode
    if not os.getenv("TEST_MODE") == "true":
        # Capture exception with context
        capture_exception_with_context(
            exc,
            user_id=user_id,
            extra_context={
                "url": str(request.url),
                "method": request.method,
                "headers": dict(request.headers),
                "client": request.client.host if request.client else None,
            }
        )
    
    # Log the error
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    
    # Return appropriate response
    if isinstance(exc, HTTPException):
        return JSONResponse(
            status_code=exc.status_code,
            content={"detail": exc.detail}
        )
    
    # For production, don't expose internal errors
    if settings.ENVIRONMENT == "production":
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error"}
        )
    else:
        return JSONResponse(
            status_code=500,
            content={"detail": str(exc)}
        )

# Sentry request tracking middleware
@app.middleware("http")
async def sentry_middleware(request: Request, call_next):
    """Middleware to add request context to Sentry."""
    import sentry_sdk
    
    with sentry_sdk.start_transaction(
        op="http.server",
        name=f"{request.method} {request.url.path}"
    ):
        # Add request context
        sentry_sdk.set_context("request", {
            "url": str(request.url),
            "method": request.method,
            "headers": dict(request.headers),
            "query_params": dict(request.query_params),
        })
        
        response = await call_next(request)
        
        # Add response context
        sentry_sdk.set_context("response", {
            "status_code": response.status_code,
        })
        
        return response


# Set all CORS enabled origins
ALLOWED_ORIGINS = [
    "http://localhost:8080", 
    "http://localhost:5173", 
    "http://localhost:3000",
    "https://d2usoqe1zof3pe.cloudfront.net",  # Production CloudFront
    "https://dcqajf07bdpek.cloudfront.net"    # Staging CloudFront
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(TrustedHostMiddleware, allowed_hosts=settings.ALLOWED_HOSTS)

app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/")
async def root():
    return {"message": "CareBow API is running"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


@app.get("/healthz")
async def detailed_health_check():
    """
    Comprehensive health check including database and Redis connectivity.
    """
    from app.db.session import SessionLocal
    import redis
    import os
    
    health_status = {
        "status": "healthy",
        "timestamp": "2025-09-03T17:00:00Z",
        "services": {}
    }
    
    # Check database connectivity
    try:
        db = SessionLocal()
        db.execute("SELECT 1")
        db.close()
        health_status["services"]["database"] = {
            "status": "healthy",
            "message": "Database connection successful"
        }
    except Exception as e:
        health_status["services"]["database"] = {
            "status": "unhealthy",
            "message": f"Database connection failed: {str(e)}"
        }
        health_status["status"] = "unhealthy"
    
    # Check Redis connectivity
    try:
        redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")
        r = redis.from_url(redis_url)
        r.ping()
        health_status["services"]["redis"] = {
            "status": "healthy",
            "message": "Redis connection successful"
        }
    except Exception as e:
        health_status["services"]["redis"] = {
            "status": "unhealthy", 
            "message": f"Redis connection failed: {str(e)}"
        }
        health_status["status"] = "unhealthy"
    
    # Check environment variables
    required_env_vars = ["DATABASE_URL", "REDIS_URL", "SECRET_KEY", "OPENAI_API_KEY", "STRIPE_SECRET_KEY"]
    missing_vars = []
    for var in required_env_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        health_status["services"]["environment"] = {
            "status": "unhealthy",
            "message": f"Missing environment variables: {', '.join(missing_vars)}"
        }
        health_status["status"] = "unhealthy"
    else:
        health_status["services"]["environment"] = {
            "status": "healthy",
            "message": "All required environment variables present"
        }
    
    return health_status