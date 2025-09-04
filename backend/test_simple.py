#!/usr/bin/env python3
"""
Simple test to verify the backend setup works.
"""
import sys
import os

# Add the backend directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def test_imports():
    """Test that all required modules can be imported."""
    try:
        from main import app
        print("✅ FastAPI app imported successfully")
        
        from app.models.user import User
        print("✅ User model imported successfully")
        
        from app.api.api_v1.endpoints.auth import router
        print("✅ Auth endpoints imported successfully")
        
        from app.core.security import get_password_hash
        print("✅ Security functions imported successfully")
        
        return True
    except Exception as e:
        print(f"❌ Import failed: {e}")
        return False

def test_basic_functionality():
    """Test basic functionality without database."""
    try:
        from app.core.security import get_password_hash, verify_password
        
        # Test password hashing
        password = "testpassword123"
        hashed = get_password_hash(password)
        
        assert hashed != password, "Password should be hashed"
        assert verify_password(password, hashed), "Password verification should work"
        
        print("✅ Password hashing works correctly")
        
        return True
    except Exception as e:
        print(f"❌ Basic functionality test failed: {e}")
        return False

def main():
    """Run simple tests."""
    print("🧪 Running Simple Backend Tests")
    print("=" * 40)
    
    success = True
    
    # Test imports
    if not test_imports():
        success = False
    
    # Test basic functionality
    if not test_basic_functionality():
        success = False
    
    print("=" * 40)
    if success:
        print("🎉 All simple tests passed!")
        return 0
    else:
        print("❌ Some tests failed!")
        return 1

if __name__ == "__main__":
    sys.exit(main())