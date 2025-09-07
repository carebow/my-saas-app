from typing import List, Union, Optional
from pydantic import field_validator, validator, model_validator
from pydantic_settings import BaseSettings
import secrets
import os


class Settings(BaseSettings):
    PROJECT_NAME: str = "CareBow API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Environment
    ENVIRONMENT: str = "development"  # development, staging, production
    
    # Database
    DATABASE_URL: str = "sqlite:///./carebow.db"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # JWT - Generate secure key if not provided
    SECRET_KEY: str = ""
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    @validator('SECRET_KEY', pre=True)
    def validate_secret_key(cls, v: str) -> str:
        if not v or v == "your-secret-key-change-this-in-production":
            # Generate a secure random key if not provided
            return secrets.token_urlsafe(32)
        return v
    
    # CORS
    BACKEND_CORS_ORIGINS: Union[str, List[str]] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:8080",
        "https://d2usoqe1zof3pe.cloudfront.net",
        "https://dcqajf07bdpek.cloudfront.net"
    ]
    
    ALLOWED_HOSTS: str = "localhost,127.0.0.1,testserver,carebow-alb-86695331.us-east-1.elb.amazonaws.com,*"
    
    @property
    def allowed_hosts_list(self) -> List[str]:
        """Convert ALLOWED_HOSTS string to list."""
        return [host.strip() for host in self.ALLOWED_HOSTS.split(",") if host.strip()]
    
    # OpenAI Configuration
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4"
    OPENAI_MAX_TOKENS: int = 1000
    
    # Stripe Configuration - No defaults for security
    STRIPE_SECRET_KEY: str = ""
    STRIPE_PUBLISHABLE_KEY: str = ""
    STRIPE_WEBHOOK_SECRET: str = ""
    
    # Email Configuration
    SMTP_TLS: bool = True
    SMTP_PORT: int = 587
    SMTP_HOST: str = ""
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    EMAILS_FROM_EMAIL: str = "noreply@carebow.com"
    EMAILS_FROM_NAME: str = "CareBow Health Assistant"
    
    # Sentry Configuration
    SENTRY_DSN: str = ""
    SENTRY_SAMPLE_RATE: float = 0.1
    
    # AWS Configuration
    AWS_REGION: str = "us-east-1"
    AWS_ACCESS_KEY_ID: str = ""
    AWS_SECRET_ACCESS_KEY: str = ""
    AWS_S3_BUCKET: str = "carebow-documents"
    
    # Healthcare Compliance
    HIPAA_ENCRYPTION_KEY: str = ""
    AUDIT_LOG_RETENTION_DAYS: int = 2555  # 7 years for HIPAA compliance
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 100
    RATE_LIMIT_PER_HOUR: int = 1000
    
    # Feature Flags
    ENABLE_EMAIL_VERIFICATION: bool = True
    ENABLE_DOCTOR_NETWORK: bool = False
    ENABLE_TELEMEDICINE: bool = False
    ENABLE_PRESCRIPTION_MANAGEMENT: bool = False
    
    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            if v.startswith("[") and v.endswith("]"):
                try:
                    import ast
                    return ast.literal_eval(v)
                except (ValueError, SyntaxError):
                    v = v.strip("[]").replace("'", "").replace('"', "")
                    return [i.strip() for i in v.split(",") if i.strip()]
            else:
                return [i.strip() for i in v.split(",") if i.strip()]
        elif isinstance(v, list):
            return v
        if not v:
            return ["http://localhost:3000", "http://localhost:5173", "http://localhost:8080"]
        raise ValueError(f"Invalid BACKEND_CORS_ORIGINS format: {v}")

    class Config:
        env_file = ".env"
        extra = "ignore"  # Allow extra fields from environment
        
    @model_validator(mode="after")
    def validate_encryption_key(self):
        """Ensure HIPAA encryption key is properly set."""
        if not self.HIPAA_ENCRYPTION_KEY:
            from app.core.encryption import generate_encryption_key
            self.HIPAA_ENCRYPTION_KEY = generate_encryption_key()
        return self


settings = Settings()
