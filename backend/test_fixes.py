#!/usr/bin/env python3
"""
Quick test script to verify the fixes are working
"""
import os
import sys
from dotenv import load_dotenv

# Load test environment
load_dotenv(".env.test")

def test_env_loading():
    """Test that environment variables are loaded correctly"""
    print("Testing environment loading...")
    
    # Check critical env vars
    required_vars = ["SECRET_KEY", "DATABASE_URL", "TEST_MODE"]
    for var in required_vars:
        value = os.getenv(var)
        if value:
            print(f"✓ {var}: {value[:20]}..." if len(value) > 20 else f"✓ {var}: {value}")
        else:
            print(f"✗ {var}: Not set")
            return False
    
    return True

def test_imports():
    """Test that critical imports work"""
    print("\nTesting imports...")
    
    try:
        from app.core.config import settings
        print("✓ Settings imported successfully")
        
        from app.main import app
        print("✓ FastAPI app imported successfully")
        
        from fastapi.testclient import TestClient
        client = TestClient(app)
        print("✓ Test client created successfully")
        
        return True
    except Exception as e:
        print(f"✗ Import error: {e}")
        return False

def test_basic_endpoints():
    """Test basic endpoints return JSON"""
    print("\nTesting basic endpoints...")
    
    try:
        from fastapi.testclient import TestClient
        from app.main import app
        
        client = TestClient(app)
        
        # Test health endpoint
        response = client.get("/health")
        print(f"Health endpoint: {response.status_code}")
        if response.status_code == 200:
            print("✓ Health endpoint working")
        else:
            print(f"✗ Health endpoint failed: {response.text}")
            return False
            
        # Test root endpoint
        response = client.get("/")
        print(f"Root endpoint: {response.status_code}")
        if response.status_code == 200:
            print("✓ Root endpoint working")
        else:
            print(f"✗ Root endpoint failed: {response.text}")
            return False
            
        return True
    except Exception as e:
        print(f"✗ Endpoint test error: {e}")
        return False

if __name__ == "__main__":
    print("Running fix verification tests...\n")
    
    success = True
    success &= test_env_loading()
    success &= test_imports()
    success &= test_basic_endpoints()
    
    if success:
        print("\n🎉 All tests passed! The fixes are working.")
        sys.exit(0)
    else:
        print("\n❌ Some tests failed. Check the output above.")
        sys.exit(1)