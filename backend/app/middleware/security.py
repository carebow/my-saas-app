"""
Security middleware for HIPAA compliance and security headers.
"""
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response as StarletteResponse
import time
import logging
import os
from typing import Dict, Optional
from collections import defaultdict
import asyncio

logger = logging.getLogger(__name__)


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Add security headers to all responses."""
    
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        
        # Security headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
        
        # HSTS (HTTP Strict Transport Security)
        if request.url.scheme == "https":
            response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        
        # CSP (Content Security Policy) for API responses
        response.headers["Content-Security-Policy"] = (
            "default-src 'self'; "
            "script-src 'self'; "
            "style-src 'self' 'unsafe-inline'; "
            "img-src 'self' data: https:; "
            "font-src 'self'; "
            "connect-src 'self'; "
            "frame-ancestors 'none';"
        )
        
        return response


class RateLimitMiddleware(BaseHTTPMiddleware):
    """Rate limiting middleware to prevent API abuse."""
    
    def __init__(self, app, requests_per_minute: int = 100, requests_per_hour: int = 1000):
        super().__init__(app)
        self.requests_per_minute = requests_per_minute
        self.requests_per_hour = requests_per_hour
        self.request_counts: Dict[str, Dict[str, list]] = defaultdict(lambda: {"minute": [], "hour": []})
        self.cleanup_task = None
        
    async def dispatch(self, request: Request, call_next):
        # Get client IP
        client_ip = self._get_client_ip(request)
        
        # Check rate limits
        current_time = time.time()
        if not self._is_allowed(client_ip, current_time):
            return StarletteResponse(
                content="Rate limit exceeded. Try again later.",
                status_code=429,
                headers={
                    "Retry-After": "60",
                    "X-RateLimit-Limit": str(self.requests_per_minute),
                    "X-RateLimit-Remaining": "0",
                }
            )
        
        # Add request to tracking
        self._add_request(client_ip, current_time)
        
        # Process request
        response = await call_next(request)
        
        # Add rate limit headers
        remaining_requests = self._get_remaining_requests(client_ip, current_time)
        response.headers["X-RateLimit-Limit"] = str(self.requests_per_minute)
        response.headers["X-RateLimit-Remaining"] = str(remaining_requests)
        
        return response
    
    def _get_client_ip(self, request: Request) -> str:
        """Get client IP address from request."""
        # Check for forwarded headers (when behind proxy/load balancer)
        if forwarded_for := request.headers.get("X-Forwarded-For"):
            return forwarded_for.split(",")[0].strip()
        if real_ip := request.headers.get("X-Real-IP"):
            return real_ip
        return request.client.host if request.client else "unknown"
    
    def _is_allowed(self, client_ip: str, current_time: float) -> bool:
        """Check if request is allowed based on rate limits."""
        client_requests = self.request_counts[client_ip]
        
        # Clean old requests
        self._clean_old_requests(client_requests, current_time)
        
        # Check minute limit
        if len(client_requests["minute"]) >= self.requests_per_minute:
            return False
            
        # Check hour limit
        if len(client_requests["hour"]) >= self.requests_per_hour:
            return False
            
        return True
    
    def _add_request(self, client_ip: str, current_time: float):
        """Add request to tracking."""
        client_requests = self.request_counts[client_ip]
        client_requests["minute"].append(current_time)
        client_requests["hour"].append(current_time)
    
    def _clean_old_requests(self, client_requests: Dict[str, list], current_time: float):
        """Remove old requests from tracking."""
        # Remove requests older than 1 minute
        minute_cutoff = current_time - 60
        client_requests["minute"] = [t for t in client_requests["minute"] if t > minute_cutoff]
        
        # Remove requests older than 1 hour
        hour_cutoff = current_time - 3600
        client_requests["hour"] = [t for t in client_requests["hour"] if t > hour_cutoff]
    
    def _get_remaining_requests(self, client_ip: str, current_time: float) -> int:
        """Get remaining requests for client."""
        client_requests = self.request_counts[client_ip]
        self._clean_old_requests(client_requests, current_time)
        return max(0, self.requests_per_minute - len(client_requests["minute"]))


class AuditLogMiddleware(BaseHTTPMiddleware):
    """HIPAA audit logging middleware."""
    
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        
        # Get request info
        client_ip = self._get_client_ip(request)
        user_agent = request.headers.get("User-Agent", "")
        method = request.method
        path = request.url.path
        
        # Check if this is a sensitive endpoint
        is_sensitive = self._is_sensitive_endpoint(path)
        
        # Get user ID if available
        user_id = None
        if hasattr(request.state, "user") and request.state.user:
            user_id = request.state.user.id
        
        try:
            response = await call_next(request)
            
            # Log audit event for sensitive endpoints
            if is_sensitive:
                processing_time = time.time() - start_time
                await self._log_audit_event(
                    action="api_access",
                    user_id=user_id,
                    client_ip=client_ip,
                    user_agent=user_agent,
                    method=method,
                    path=path,
                    status_code=response.status_code,
                    processing_time=processing_time
                )
            
            return response
            
        except Exception as e:
            # Log failed requests
            if is_sensitive:
                await self._log_audit_event(
                    action="api_error",
                    user_id=user_id,
                    client_ip=client_ip,
                    user_agent=user_agent,
                    method=method,
                    path=path,
                    error=str(e)
                )
            raise
    
    def _get_client_ip(self, request: Request) -> str:
        """Get client IP address from request."""
        if forwarded_for := request.headers.get("X-Forwarded-For"):
            return forwarded_for.split(",")[0].strip()
        if real_ip := request.headers.get("X-Real-IP"):
            return real_ip
        return request.client.host if request.client else "unknown"
    
    def _is_sensitive_endpoint(self, path: str) -> bool:
        """Check if endpoint handles sensitive data."""
        sensitive_patterns = [
            "/api/v1/users/",
            "/api/v1/health/",
            "/api/v1/consultations/",
            "/api/v1/auth/",
        ]
        return any(pattern in path for pattern in sensitive_patterns)
    
    async def _log_audit_event(self, **kwargs):
        """Log audit event (implement actual logging)."""
        logger.info(
            f"HIPAA_AUDIT: {kwargs.get('action', 'unknown')}",
            extra={
                "audit": True,
                **kwargs,
                "timestamp": time.time()
            }
        )


class InputValidationMiddleware(BaseHTTPMiddleware):
    """Basic input validation and sanitization."""
    
    async def dispatch(self, request: Request, call_next):
        # Validate request size
        if request.headers.get("content-length"):
            content_length = int(request.headers["content-length"])
            if content_length > 10 * 1024 * 1024:  # 10MB limit
                return StarletteResponse(
                    content="Request too large",
                    status_code=413
                )
        
        # Validate content type for POST/PUT requests (skip in test mode)
        if request.method in ["POST", "PUT", "PATCH"] and not os.getenv("TEST_MODE"):
            content_type = request.headers.get("content-type", "")
            if not content_type.startswith(("application/json", "multipart/form-data", "application/x-www-form-urlencoded")):
                return StarletteResponse(
                    content="Invalid content type",
                    status_code=415
                )
        
        # Check for suspicious patterns in URL
        if self._has_suspicious_patterns(str(request.url)):
            logger.warning(f"Suspicious request blocked: {request.url}")
            return StarletteResponse(
                content="Invalid request",
                status_code=400
            )
        
        return await call_next(request)
    
    def _has_suspicious_patterns(self, url: str) -> bool:
        """Check for common attack patterns in URL."""
        suspicious_patterns = [
            "../",  # Path traversal
            "<script",  # XSS
            "javascript:",  # XSS
            "vbscript:",  # XSS
            "onload=",  # XSS
            "onerror=",  # XSS
            "' OR '1'='1",  # SQL injection
            "DROP TABLE",  # SQL injection
            "UNION SELECT",  # SQL injection
        ]
        url_lower = url.lower()
        return any(pattern.lower() in url_lower for pattern in suspicious_patterns)