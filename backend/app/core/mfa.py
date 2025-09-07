"""
Multi-Factor Authentication system for enhanced security.
Implements TOTP (Time-based One-Time Password) and backup codes.
"""
import pyotp
import qrcode
import io
import base64
import secrets
import hashlib
from typing import List, Optional, Tuple
from datetime import datetime, timedelta
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.encryption import get_encryption


class MFAManager:
    """Manages multi-factor authentication for users."""
    
    def __init__(self):
        self.encryption = get_encryption()
        self.issuer_name = "CareBow Health Assistant"
    
    def generate_secret(self) -> str:
        """Generate a new TOTP secret for a user."""
        return pyotp.random_base32()
    
    def generate_qr_code(self, user_email: str, secret: str) -> str:
        """Generate QR code for TOTP setup."""
        totp = pyotp.TOTP(secret)
        provisioning_uri = totp.provisioning_uri(
            user_email,
            issuer_name=self.issuer_name
        )
        
        qr = qrcode.QRCode(version=1, box_size=10, border=5)
        qr.add_data(provisioning_uri)
        qr.make(fit=True)
        
        img = qr.make_image(fill_color="black", back_color="white")
        buffer = io.BytesIO()
        img.save(buffer, format='PNG')
        buffer.seek(0)
        
        return base64.b64encode(buffer.getvalue()).decode()
    
    def verify_totp(self, secret: str, token: str, window: int = 1) -> bool:
        """
        Verify TOTP token.
        Window allows for clock drift (1 = 30 seconds before/after).
        """
        totp = pyotp.TOTP(secret)
        return totp.verify(token, valid_window=window)
    
    def generate_backup_codes(self, count: int = 8) -> List[str]:
        """Generate backup codes for account recovery."""
        codes = []
        for _ in range(count):
            code = secrets.token_hex(4).upper()  # 8-character hex codes
            codes.append(code)
        return codes
    
    def hash_backup_code(self, code: str) -> str:
        """Hash backup code for secure storage."""
        return hashlib.pbkdf2_hex(
            code.encode(), 
            settings.SECRET_KEY.encode(), 
            100000, 
            dklen=32
        )
    
    def verify_backup_code(self, code: str, hashed_code: str) -> bool:
        """Verify a backup code against its hash."""
        return self.hash_backup_code(code) == hashed_code


class MFASession:
    """Manages MFA session state."""
    
    def __init__(self):
        self.sessions = {}  # In production, use Redis
    
    def create_mfa_session(self, user_id: int, expires_minutes: int = 10) -> str:
        """Create temporary MFA session."""
        session_token = secrets.token_urlsafe(32)
        expires_at = datetime.utcnow() + timedelta(minutes=expires_minutes)
        
        self.sessions[session_token] = {
            "user_id": user_id,
            "expires_at": expires_at,
            "verified": False
        }
        
        return session_token
    
    def verify_mfa_session(self, session_token: str) -> Optional[int]:
        """Verify and return user_id if session is valid."""
        session = self.sessions.get(session_token)
        if not session:
            return None
        
        if datetime.utcnow() > session["expires_at"]:
            del self.sessions[session_token]
            return None
        
        return session["user_id"] if session["verified"] else None
    
    def mark_session_verified(self, session_token: str):
        """Mark MFA session as verified."""
        if session_token in self.sessions:
            self.sessions[session_token]["verified"] = True
    
    def cleanup_expired_sessions(self):
        """Remove expired sessions."""
        now = datetime.utcnow()
        expired_tokens = [
            token for token, session in self.sessions.items()
            if now > session["expires_at"]
        ]
        for token in expired_tokens:
            del self.sessions[token]


# Global instances
mfa_manager = MFAManager()
mfa_session = MFASession()


def generate_mfa_setup(user_email: str) -> Tuple[str, str, List[str]]:
    """
    Generate MFA setup data for a user.
    Returns: (secret, qr_code_base64, backup_codes)
    """
    secret = mfa_manager.generate_secret()
    qr_code = mfa_manager.generate_qr_code(user_email, secret)
    backup_codes = mfa_manager.generate_backup_codes()
    
    return secret, qr_code, backup_codes


def verify_mfa_token(secret: str, token: str) -> bool:
    """Verify MFA token."""
    return mfa_manager.verify_totp(secret, token)


def verify_mfa_backup_code(code: str, stored_hashes: List[str]) -> bool:
    """Verify backup code against stored hashes."""
    for stored_hash in stored_hashes:
        if mfa_manager.verify_backup_code(code, stored_hash):
            return True
    return False