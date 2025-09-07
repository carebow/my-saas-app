#!/usr/bin/env python3
"""
Test script to verify configuration fixes work correctly.
"""
import sys
import os

# Add backend directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__)))

try:
    from app.core.config import settings
    print("✅ Configuration loads successfully")
    print(f"   ALLOWED_HOSTS: {settings.ALLOWED_HOSTS}")
    print(f"   HIPAA_ENCRYPTION_KEY: {'*' * 20} (hidden for security)")
    print(f"   SECRET_KEY: {'*' * 20} (hidden for security)")
    
    # Test encryption
    from app.core.encryption import get_encryption
    encryption = get_encryption()
    test_data = "This is sensitive health data"
    encrypted = encryption.encrypt(test_data)
    decrypted = encryption.decrypt(encrypted)
    
    if decrypted == test_data:
        print("✅ HIPAA encryption works correctly")
    else:
        print("❌ HIPAA encryption failed")
        sys.exit(1)
        
    print("\n🎉 All configuration and encryption tests passed!")
    
except Exception as e:
    print(f"❌ Configuration test failed: {e}")
    sys.exit(1)