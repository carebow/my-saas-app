#!/usr/bin/env python3
"""
Simple test to debug configuration issues.
"""
import os
import sys

# Add backend directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__)))

print("Testing configuration parsing...")

# Set test environment
os.environ["ENV_FILE"] = ".env.test"
os.environ["ALLOWED_HOSTS"] = "localhost,127.0.0.1,testserver"
os.environ["HIPAA_ENCRYPTION_KEY"] = "TEST_KEY_32_CHARS_FOR_TESTING_ONLY_123"

try:
    print("Importing settings...")
    from app.core.config import Settings
    
    print("Creating settings instance...")
    settings = Settings()
    
    print(f"✅ ALLOWED_HOSTS: {settings.ALLOWED_HOSTS}")
    print(f"✅ HIPAA_ENCRYPTION_KEY set: {'Yes' if settings.HIPAA_ENCRYPTION_KEY else 'No'}")
    print(f"✅ Configuration loaded successfully!")
    
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)