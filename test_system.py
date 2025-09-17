#!/usr/bin/env python3
"""
CareBow System Test Script
Tests the complete user flow from registration to AI chat
"""

import requests
import json
import time
import sys

# Configuration
BACKEND_URL = "http://localhost:8000"
FRONTEND_URL = "http://localhost:5173"

def test_health():
    """Test if backend is running"""
    try:
        response = requests.get(f"{BACKEND_URL}/health")
        if response.status_code == 200:
            print("✅ Backend health check passed")
            return True
        else:
            print(f"❌ Backend health check failed: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Backend is not running. Start it with: cd backend && python run.py")
        return False

def test_user_registration():
    """Test user registration"""
    print("\n👤 Testing User Registration...")
    
    # Generate unique email
    timestamp = int(time.time())
    user_data = {
        "email": f"testuser{timestamp}@carebow.com",
        "password": "testpass123",
        "full_name": "Test User"
    }
    
    try:
        response = requests.post(f"{BACKEND_URL}/api/v1/auth/register", json=user_data)
        if response.status_code == 200:
            print("✅ User registration successful")
            return response.json()
        else:
            print(f"❌ User registration failed: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"❌ Registration error: {e}")
        return None

def test_user_login(email, password):
    """Test user login"""
    print("\n🔐 Testing User Login...")
    
    login_data = {
        "username": email,
        "password": password
    }
    
    try:
        response = requests.post(f"{BACKEND_URL}/api/v1/auth/login", data=login_data)
        if response.status_code == 200:
            print("✅ User login successful")
            return response.json()
        else:
            print(f"❌ User login failed: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"❌ Login error: {e}")
        return None

def test_ai_chat(token):
    """Test AI chat functionality"""
    print("\n🤖 Testing AI Chat...")
    
    headers = {"Authorization": f"Bearer {token}"}
    chat_data = {
        "message": "I have a headache and feel tired. Can you help me?",
        "personality": "caring_nurse"
    }
    
    try:
        response = requests.post(f"{BACKEND_URL}/api/v1/ai/chat", json=chat_data, headers=headers)
        if response.status_code == 200:
            print("✅ AI chat successful")
            chat_response = response.json()
            print(f"   AI Response: {chat_response['message'][:100]}...")
            return True
        else:
            print(f"❌ AI chat failed: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"❌ AI chat error: {e}")
        return False

def test_subscription_status(token):
    """Test subscription status"""
    print("\n💳 Testing Subscription Status...")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(f"{BACKEND_URL}/api/v1/payments/subscription-status", headers=headers)
        if response.status_code == 200:
            print("✅ Subscription status check successful")
            status = response.json()
            print(f"   Tier: {status['subscription_tier']}")
            print(f"   Consultations Used: {status['consultations_used']}/{status['consultations_limit']}")
            return True
        else:
            print(f"❌ Subscription status failed: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"❌ Subscription status error: {e}")
        return False

def test_frontend():
    """Test if frontend is accessible"""
    print("\n🌐 Testing Frontend...")
    
    try:
        response = requests.get(FRONTEND_URL)
        if response.status_code == 200:
            print("✅ Frontend is accessible")
            return True
        else:
            print(f"❌ Frontend check failed: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Frontend is not running. Start it with: npm run dev")
        return False

def main():
    """Run complete system test"""
    print("🚀 CareBow System Test")
    print("=" * 50)
    
    # Test backend health
    if not test_health():
        print("\n❌ Backend is not running. Please start it first.")
        print("   Command: cd backend && source venv/bin/activate && python run.py")
        sys.exit(1)
    
    # Test frontend
    frontend_ok = test_frontend()
    if not frontend_ok:
        print("\n⚠️  Frontend is not running. Start it with: npm run dev")
    
    # Test user registration
    user = test_user_registration()
    if not user:
        print("\n❌ User registration failed. Check backend logs.")
        sys.exit(1)
    
    # Test user login
    login_result = test_user_login(user["email"], "testpass123")
    if not login_result:
        print("\n❌ User login failed. Check backend logs.")
        sys.exit(1)
    
    token = login_result["access_token"]
    
    # Test AI chat
    ai_ok = test_ai_chat(token)
    
    # Test subscription status
    sub_ok = test_subscription_status(token)
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 Test Results Summary:")
    print(f"   Backend Health: ✅")
    print(f"   User Registration: ✅")
    print(f"   User Login: ✅")
    print(f"   AI Chat: {'✅' if ai_ok else '❌'}")
    print(f"   Subscription Status: {'✅' if sub_ok else '❌'}")
    print(f"   Frontend: {'✅' if frontend_ok else '❌'}")
    
    if ai_ok and sub_ok:
        print("\n🎉 All core features are working!")
        print("   Your CareBow system is ready for users!")
        print("\n🌐 Access your app:")
        print(f"   Frontend: {FRONTEND_URL}")
        print(f"   Backend API: {BACKEND_URL}/docs")
    else:
        print("\n⚠️  Some features need attention, but core system is working.")
        print("   Check the API_SETUP_GUIDE.md for configuration help.")

if __name__ == "__main__":
    main()
