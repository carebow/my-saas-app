from fastapi import APIRouter

from app.api.api_v1.endpoints import auth, users, health, ai, payments, conversations, feedback, admin

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(ai.router, prefix="/ai", tags=["ai"])
api_router.include_router(payments.router, prefix="/payments", tags=["payments"])
api_router.include_router(conversations.router, prefix="/conversations", tags=["conversations"])
api_router.include_router(feedback.router, prefix="/feedback", tags=["feedback"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])