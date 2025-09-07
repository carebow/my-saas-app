"""
HIPAA-compliant encryption utilities for healthcare data.
"""
import base64
import secrets
from typing import Optional, Union
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
import os
import logging

logger = logging.getLogger(__name__)


class HIPAAEncryption:
    """
    HIPAA-compliant encryption for sensitive healthcare data.
    Uses AES-256 encryption with secure key derivation.
    """
    
    def __init__(self, master_key: Optional[str] = None):
        """Initialize with master encryption key."""
        self._master_key = master_key or os.getenv("HIPAA_ENCRYPTION_KEY")
        if not self._master_key:
            raise ValueError("HIPAA_ENCRYPTION_KEY must be provided")
        
        if len(self._master_key) < 32:
            raise ValueError("HIPAA_ENCRYPTION_KEY must be at least 32 characters")
    
    def _derive_key(self, salt: bytes) -> bytes:
        """Derive encryption key from master key using PBKDF2."""
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=salt,
            iterations=100000,  # NIST recommended minimum
            backend=default_backend()
        )
        return kdf.derive(self._master_key.encode())
    
    def encrypt(self, data: Union[str, bytes]) -> str:
        """
        Encrypt sensitive data with AES-256-GCM.
        Returns base64-encoded encrypted data with salt and nonce.
        """
        if isinstance(data, str):
            data = data.encode('utf-8')
        
        # Generate random salt and nonce
        salt = secrets.token_bytes(16)
        nonce = secrets.token_bytes(12)  # GCM requires 96-bit nonce
        
        # Derive key
        key = self._derive_key(salt)
        
        # Encrypt with AES-256-GCM
        cipher = Cipher(
            algorithms.AES(key),
            modes.GCM(nonce),
            backend=default_backend()
        )
        encryptor = cipher.encryptor()
        ciphertext = encryptor.update(data) + encryptor.finalize()
        
        # Combine salt + nonce + tag + ciphertext
        encrypted_data = salt + nonce + encryptor.tag + ciphertext
        
        # Return base64 encoded
        return base64.b64encode(encrypted_data).decode('ascii')
    
    def decrypt(self, encrypted_data: str) -> str:
        """
        Decrypt data encrypted with encrypt().
        Returns the original string data.
        """
        try:
            # Decode base64
            data = base64.b64decode(encrypted_data.encode('ascii'))
            
            # Extract components
            salt = data[:16]
            nonce = data[16:28]
            tag = data[28:44]
            ciphertext = data[44:]
            
            # Derive key
            key = self._derive_key(salt)
            
            # Decrypt with AES-256-GCM
            cipher = Cipher(
                algorithms.AES(key),
                modes.GCM(nonce, tag),
                backend=default_backend()
            )
            decryptor = cipher.decryptor()
            plaintext = decryptor.update(ciphertext) + decryptor.finalize()
            
            return plaintext.decode('utf-8')
        
        except Exception as e:
            logger.error(f"Decryption failed: {e}")
            raise ValueError("Failed to decrypt data")
    
    def encrypt_field(self, field_value: Optional[str]) -> Optional[str]:
        """Encrypt a database field value, handling None values."""
        if field_value is None:
            return None
        return self.encrypt(field_value)
    
    def decrypt_field(self, encrypted_value: Optional[str]) -> Optional[str]:
        """Decrypt a database field value, handling None values."""
        if encrypted_value is None:
            return None
        return self.decrypt(encrypted_value)


# Global encryption instance
_encryption_instance = None

def get_encryption() -> HIPAAEncryption:
    """Get global encryption instance."""
    global _encryption_instance
    if _encryption_instance is None:
        _encryption_instance = HIPAAEncryption()
    return _encryption_instance


class EncryptedField:
    """
    SQLAlchemy custom type for encrypted fields.
    Automatically encrypts/decrypts data when storing/retrieving from database.
    """
    
    def __init__(self):
        self.encryption = get_encryption()
    
    def process_bind_param(self, value, dialect):
        """Encrypt value when storing in database."""
        if value is not None:
            return self.encryption.encrypt(value)
        return value
    
    def process_result_value(self, value, dialect):
        """Decrypt value when retrieving from database."""
        if value is not None:
            return self.encryption.decrypt(value)
        return value


def encrypt_pii(data: str) -> str:
    """Encrypt personally identifiable information."""
    return get_encryption().encrypt(data)


def decrypt_pii(encrypted_data: str) -> str:
    """Decrypt personally identifiable information."""
    return get_encryption().decrypt(encrypted_data)


def generate_encryption_key() -> str:
    """Generate a secure 256-bit encryption key for HIPAA compliance."""
    return base64.urlsafe_b64encode(secrets.token_bytes(32)).decode('ascii')


# Audit logging for encryption operations
def log_encryption_event(operation: str, user_id: Optional[int] = None, data_type: str = "PII"):
    """Log encryption/decryption events for HIPAA audit compliance."""
    logger.info(
        f"HIPAA_AUDIT: {operation} operation on {data_type}",
        extra={
            "user_id": user_id,
            "operation": operation,
            "data_type": data_type,
            "timestamp": "utcnow()",
        }
    )