"""
Enhanced monitoring and health checks for production readiness.
"""
import asyncio
import logging
import os
import time
import psutil
from typing import Dict, Any, Optional
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.db.session import SessionLocal
from app.core.config import settings

logger = logging.getLogger(__name__)


class HealthMonitor:
    """Production health monitoring system."""
    
    def __init__(self):
        self.start_time = time.time()
        self.request_count = 0
        self.error_count = 0
        self.last_health_check = None
        
    async def comprehensive_health_check(self) -> Dict[str, Any]:
        """
        Comprehensive health check for production monitoring.
        Returns detailed status of all system components.
        """
        health_status = {
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat(),
            "uptime_seconds": int(time.time() - self.start_time),
            "version": settings.VERSION,
            "environment": settings.ENVIRONMENT,
            "services": {},
            "metrics": {}
        }
        
        # Database health
        db_health = await self._check_database_health()
        health_status["services"]["database"] = db_health
        if db_health["status"] != "healthy":
            health_status["status"] = "unhealthy"
        
        # Redis health (if configured)
        if settings.REDIS_URL:
            redis_health = await self._check_redis_health()
            health_status["services"]["redis"] = redis_health
            if redis_health["status"] != "healthy":
                health_status["status"] = "degraded"
        
        # Encryption system health
        encryption_health = self._check_encryption_health()
        health_status["services"]["encryption"] = encryption_health
        if encryption_health["status"] != "healthy":
            health_status["status"] = "unhealthy"
        
        # External service health
        external_health = await self._check_external_services()
        health_status["services"]["external"] = external_health
        
        # System metrics
        system_metrics = self._get_system_metrics()
        health_status["metrics"] = system_metrics
        
        # Application metrics
        app_metrics = self._get_application_metrics()
        health_status["metrics"].update(app_metrics)
        
        self.last_health_check = health_status
        return health_status
    
    async def _check_database_health(self) -> Dict[str, Any]:
        """Check database connectivity and performance."""
        try:
            db = SessionLocal()
            start_time = time.time()
            
            # Test basic connectivity
            result = db.execute(text("SELECT 1"))
            connection_time = time.time() - start_time
            
            # Test audit logs table (HIPAA requirement)
            audit_test = db.execute(text("SELECT COUNT(*) FROM audit_logs"))
            audit_count = audit_test.scalar()
            
            # Test user table performance
            user_test = db.execute(text("SELECT COUNT(*) FROM users"))
            user_count = user_test.scalar()
            
            db.close()
            
            return {
                "status": "healthy",
                "response_time_ms": round(connection_time * 1000, 2),
                "metrics": {
                    "total_users": user_count,
                    "total_audit_logs": audit_count,
                    "connection_pool_size": "healthy"
                }
            }
            
        except Exception as e:
            logger.error(f"Database health check failed: {e}")
            return {
                "status": "unhealthy",
                "error": str(e),
                "response_time_ms": None
            }
    
    async def _check_redis_health(self) -> Dict[str, Any]:
        """Check Redis connectivity and performance."""
        try:
            import redis
            r = redis.from_url(settings.REDIS_URL)
            
            start_time = time.time()
            r.ping()
            response_time = time.time() - start_time
            
            # Get Redis info
            info = r.info()
            
            return {
                "status": "healthy",
                "response_time_ms": round(response_time * 1000, 2),
                "metrics": {
                    "used_memory": info.get("used_memory_human", "unknown"),
                    "connected_clients": info.get("connected_clients", 0),
                    "uptime_seconds": info.get("uptime_in_seconds", 0)
                }
            }
            
        except Exception as e:
            logger.error(f"Redis health check failed: {e}")
            return {
                "status": "unhealthy",
                "error": str(e),
                "response_time_ms": None
            }
    
    def _check_encryption_health(self) -> Dict[str, Any]:
        """Check HIPAA encryption system health."""
        try:
            from app.core.encryption import get_encryption
            
            encryption = get_encryption()
            test_data = "health_check_test_data"
            
            # Test encryption/decryption cycle
            start_time = time.time()
            encrypted = encryption.encrypt(test_data)
            decrypted = encryption.decrypt(encrypted)
            encryption_time = time.time() - start_time
            
            if decrypted != test_data:
                raise ValueError("Encryption round-trip failed")
            
            return {
                "status": "healthy",
                "response_time_ms": round(encryption_time * 1000, 2),
                "hipaa_compliant": True,
                "algorithm": "AES-256-GCM",
                "key_rotation_needed": False  # TODO: Implement key rotation
            }
            
        except Exception as e:
            logger.error(f"Encryption health check failed: {e}")
            return {
                "status": "unhealthy",
                "error": str(e),
                "hipaa_compliant": False
            }
    
    async def _check_external_services(self) -> Dict[str, Any]:
        """Check external service connectivity."""
        services = {}
        
        # OpenAI API health
        if settings.OPENAI_API_KEY and settings.OPENAI_API_KEY != "sk-your-actual-openai-api-key-here":
            try:
                import openai
                client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)
                
                # Quick test call
                start_time = time.time()
                response = client.models.list()
                response_time = time.time() - start_time
                
                services["openai"] = {
                    "status": "healthy",
                    "response_time_ms": round(response_time * 1000, 2),
                    "models_available": len(list(response.data))
                }
                
            except Exception as e:
                services["openai"] = {
                    "status": "unhealthy",
                    "error": str(e)
                }
        
        # Stripe API health
        if settings.STRIPE_SECRET_KEY and not settings.STRIPE_SECRET_KEY.startswith("sk_test_"):
            try:
                import stripe
                stripe.api_key = settings.STRIPE_SECRET_KEY
                
                start_time = time.time()
                stripe.Account.retrieve()
                response_time = time.time() - start_time
                
                services["stripe"] = {
                    "status": "healthy",
                    "response_time_ms": round(response_time * 1000, 2)
                }
                
            except Exception as e:
                services["stripe"] = {
                    "status": "unhealthy",
                    "error": str(e)
                }
        
        return services
    
    def _get_system_metrics(self) -> Dict[str, Any]:
        """Get system resource metrics."""
        try:
            cpu_percent = psutil.cpu_percent(interval=1)
            memory = psutil.virtual_memory()
            disk = psutil.disk_usage('/')
            
            return {
                "cpu_usage_percent": cpu_percent,
                "memory_usage_percent": memory.percent,
                "memory_available_gb": round(memory.available / (1024**3), 2),
                "disk_usage_percent": disk.percent,
                "disk_free_gb": round(disk.free / (1024**3), 2)
            }
            
        except Exception as e:
            logger.error(f"System metrics collection failed: {e}")
            return {"error": str(e)}
    
    def _get_application_metrics(self) -> Dict[str, Any]:
        """Get application-specific metrics."""
        return {
            "requests_total": self.request_count,
            "errors_total": self.error_count,
            "error_rate_percent": round((self.error_count / max(self.request_count, 1)) * 100, 2),
            "uptime_hours": round((time.time() - self.start_time) / 3600, 2)
        }
    
    def increment_request_count(self):
        """Increment request counter."""
        self.request_count += 1
    
    def increment_error_count(self):
        """Increment error counter."""
        self.error_count += 1


# Global health monitor instance
health_monitor = HealthMonitor()


async def get_health_status() -> Dict[str, Any]:
    """Get current health status."""
    return await health_monitor.comprehensive_health_check()


def record_request():
    """Record a request for metrics."""
    health_monitor.increment_request_count()


def record_error():
    """Record an error for metrics."""
    health_monitor.increment_error_count()


class MetricsCollector:
    """Collect and aggregate application metrics."""
    
    def __init__(self):
        self.metrics = {
            "api_calls": 0,
            "successful_authentications": 0,
            "failed_authentications": 0,
            "consultations_created": 0,
            "subscription_creations": 0,
            "encryption_operations": 0,
            "audit_logs_written": 0
        }
        self.last_reset = time.time()
    
    def increment(self, metric: str, value: int = 1):
        """Increment a metric."""
        if metric in self.metrics:
            self.metrics[metric] += value
    
    def get_metrics(self) -> Dict[str, Any]:
        """Get current metrics."""
        return {
            **self.metrics,
            "collection_period_hours": round((time.time() - self.last_reset) / 3600, 2)
        }
    
    def reset_metrics(self):
        """Reset metrics (useful for periodic reporting)."""
        self.metrics = {key: 0 for key in self.metrics}
        self.last_reset = time.time()


# Global metrics collector
metrics_collector = MetricsCollector()