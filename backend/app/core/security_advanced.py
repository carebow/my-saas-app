"""
Advanced security features for enterprise-grade protection.
"""
import hashlib
import hmac
import ipaddress
import re
import secrets
import time
import jwt
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Set
from collections import defaultdict, deque
import logging

from app.core.config import settings
from app.core.encryption import get_encryption

logger = logging.getLogger(__name__)


class ThreatDetection:
    """Advanced threat detection and prevention system."""
    
    def __init__(self):
        self.failed_attempts = defaultdict(deque)
        self.suspicious_ips = set()
        self.blocked_ips = set()
        self.encryption = get_encryption()
        
        # Threat detection thresholds
        self.max_failed_attempts = 5
        self.lockout_duration = 3600  # 1 hour
        self.suspicious_patterns = [
            r'(?i)(union|select|drop|insert|update|delete|exec|script)',  # SQL injection
            r'(?i)(<script|javascript:|vbscript:|onload=|onerror=)',      # XSS
            r'(?i)(\.\.\/|\.\.\\)',                                       # Path traversal
            r'(?i)(cmd|powershell|bash|sh|eval)',                        # Command injection
        ]
    
    def analyze_request(self, ip: str, user_agent: str, path: str, payload: str = "") -> Dict[str, any]:
        """Analyze incoming request for threats."""
        threats = []
        risk_score = 0
        
        # Check IP reputation
        if self.is_suspicious_ip(ip):
            threats.append("suspicious_ip")
            risk_score += 30
        
        if self.is_blocked_ip(ip):
            threats.append("blocked_ip")
            risk_score += 100
            
        # Check for malicious patterns
        full_content = f"{path} {payload} {user_agent}".lower()
        for pattern in self.suspicious_patterns:
            if re.search(pattern, full_content):
                threats.append("malicious_pattern")
                risk_score += 40
                break
        
        # Check request frequency (basic rate limiting)
        if self.is_high_frequency_ip(ip):
            threats.append("high_frequency")
            risk_score += 20
            
        # Geolocation anomaly detection (simplified)
        if self.is_geographic_anomaly(ip):
            threats.append("geo_anomaly")
            risk_score += 15
        
        return {
            "threats": threats,
            "risk_score": risk_score,
            "action": "block" if risk_score >= 70 else "monitor" if risk_score >= 30 else "allow"
        }
    
    def record_failed_login(self, ip: str, username: str):
        """Record failed login attempt."""
        current_time = time.time()
        
        # Clean old attempts
        cutoff_time = current_time - self.lockout_duration
        self.failed_attempts[ip] = deque(
            [t for t in self.failed_attempts[ip] if t > cutoff_time],
            maxlen=self.max_failed_attempts
        )
        
        self.failed_attempts[ip].append(current_time)
        
        # Mark as suspicious if too many attempts
        if len(self.failed_attempts[ip]) >= self.max_failed_attempts:
            self.suspicious_ips.add(ip)
            logger.warning(f"IP {ip} marked as suspicious due to failed login attempts")
    
    def is_suspicious_ip(self, ip: str) -> bool:
        """Check if IP is marked as suspicious."""
        return ip in self.suspicious_ips
    
    def is_blocked_ip(self, ip: str) -> bool:
        """Check if IP is blocked."""
        return ip in self.blocked_ips
    
    def is_high_frequency_ip(self, ip: str) -> bool:
        """Simplified high-frequency detection."""
        # In production, implement proper rate limiting with Redis
        return False
    
    def is_geographic_anomaly(self, ip: str) -> bool:
        """Simplified geographic anomaly detection."""
        # In production, use GeoIP service
        return False
    
    def block_ip(self, ip: str, reason: str):
        """Block an IP address."""
        self.blocked_ips.add(ip)
        logger.warning(f"IP {ip} blocked: {reason}")
    
    def unblock_ip(self, ip: str):
        """Unblock an IP address."""
        self.blocked_ips.discard(ip)
        self.suspicious_ips.discard(ip)


class KeyRotation:
    """Encryption key rotation system."""
    
    def __init__(self):
        self.current_key_version = 1
        self.key_rotation_interval = 30 * 24 * 3600  # 30 days
        self.last_rotation = time.time()
    
    def should_rotate_keys(self) -> bool:
        """Check if keys should be rotated."""
        return time.time() - self.last_rotation > self.key_rotation_interval
    
    def generate_new_key(self) -> str:
        """Generate a new encryption key."""
        return secrets.token_urlsafe(32)
    
    def rotate_encryption_key(self) -> str:
        """Rotate the main encryption key."""
        if not self.should_rotate_keys():
            return None
            
        new_key = self.generate_new_key()
        self.current_key_version += 1
        self.last_rotation = time.time()
        
        logger.info(f"Encryption key rotated to version {self.current_key_version}")
        return new_key
    
    def get_key_metadata(self) -> Dict[str, any]:
        """Get key rotation metadata."""
        return {
            "current_version": self.current_key_version,
            "last_rotation": datetime.fromtimestamp(self.last_rotation).isoformat(),
            "next_rotation": datetime.fromtimestamp(
                self.last_rotation + self.key_rotation_interval
            ).isoformat(),
            "days_until_rotation": int((self.last_rotation + self.key_rotation_interval - time.time()) / 86400)
        }


class SessionSecurity:
    """Enhanced session security management."""
    
    def __init__(self):
        self.active_sessions = {}  # In production, use Redis
        self.session_timeout = 3600  # 1 hour
        self.max_sessions_per_user = 5
    
    def create_secure_session(self, user_id: int, ip: str, user_agent: str) -> str:
        """Create a secure session with metadata."""
        session_id = secrets.token_urlsafe(32)
        now = time.time()
        
        session_data = {
            "user_id": user_id,
            "created_at": now,
            "last_activity": now,
            "ip_address": ip,
            "user_agent": user_agent,
            "csrf_token": secrets.token_urlsafe(16)
        }
        
        # Limit sessions per user
        self.cleanup_user_sessions(user_id)
        
        self.active_sessions[session_id] = session_data
        return session_id
    
    def validate_session(self, session_id: str, ip: str) -> Optional[Dict]:
        """Validate session and check for anomalies."""
        session = self.active_sessions.get(session_id)
        if not session:
            return None
        
        now = time.time()
        
        # Check timeout
        if now - session["last_activity"] > self.session_timeout:
            del self.active_sessions[session_id]
            return None
        
        # Check IP consistency (basic session hijacking protection)
        if session["ip_address"] != ip:
            logger.warning(f"Session {session_id} IP mismatch: {session['ip_address']} vs {ip}")
            del self.active_sessions[session_id]
            return None
        
        # Update last activity
        session["last_activity"] = now
        return session
    
    def cleanup_user_sessions(self, user_id: int):
        """Cleanup old sessions for a user."""
        user_sessions = [
            (sid, session) for sid, session in self.active_sessions.items()
            if session["user_id"] == user_id
        ]
        
        # Sort by last activity and keep only the most recent sessions
        user_sessions.sort(key=lambda x: x[1]["last_activity"], reverse=True)
        
        # Remove excess sessions
        for sid, _ in user_sessions[self.max_sessions_per_user:]:
            del self.active_sessions[sid]
    
    def invalidate_session(self, session_id: str):
        """Invalidate a specific session."""
        self.active_sessions.pop(session_id, None)
    
    def invalidate_user_sessions(self, user_id: int):
        """Invalidate all sessions for a user."""
        to_remove = [
            sid for sid, session in self.active_sessions.items()
            if session["user_id"] == user_id
        ]
        for sid in to_remove:
            del self.active_sessions[sid]


class DataLossPrevention:
    """Data Loss Prevention system for sensitive data."""
    
    def __init__(self):
        self.sensitive_patterns = [
            (r'\b\d{3}-\d{2}-\d{4}\b', 'SSN'),                    # Social Security Number
            (r'\b\d{16}\b', 'CREDIT_CARD'),                       # Credit Card
            (r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', 'EMAIL'),  # Email
            (r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b', 'PHONE'),          # Phone number
        ]
    
    def scan_for_sensitive_data(self, content: str) -> Dict[str, List[str]]:
        """Scan content for sensitive data patterns."""
        findings = defaultdict(list)
        
        for pattern, data_type in self.sensitive_patterns:
            matches = re.findall(pattern, content, re.IGNORECASE)
            if matches:
                findings[data_type].extend(matches)
        
        return dict(findings)
    
    def should_block_response(self, response_data: str) -> bool:
        """Check if response should be blocked due to sensitive data."""
        findings = self.scan_for_sensitive_data(response_data)
        
        # Block if any sensitive data is found
        if findings:
            logger.warning(f"Sensitive data detected in response: {list(findings.keys())}")
            return True
        
        return False


# Global instances
threat_detector = ThreatDetection()
key_rotator = KeyRotation()
session_security = SessionSecurity()
dlp_scanner = DataLossPrevention()


def analyze_security_threat(ip: str, user_agent: str, path: str, payload: str = "") -> Dict[str, any]:
    """Analyze incoming request for security threats."""
    return threat_detector.analyze_request(ip, user_agent, path, payload)


def create_secure_session(user_id: int, ip: str, user_agent: str) -> str:
    """Create a secure session."""
    return session_security.create_secure_session(user_id, ip, user_agent)


def validate_session_security(session_id: str, ip: str) -> Optional[Dict]:
    """Validate session security."""
    return session_security.validate_session(session_id, ip)