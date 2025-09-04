"""
End-to-end test flow for CareBow: signup → pay → consult → logout
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.models.user import User, SubscriptionTier


class TestE2EUserJourney:
    """End-to-end test for complete user journey."""
    
    @pytest.mark.e2e
    def test_complete_user_journey(self, client: TestClient, db_session: Session, mock_stripe, mock_openai):
        """
        Test complete user journey:
        1. User signs up
        2. User upgrades to paid subscription
        3. User creates AI consultation
        4. User views consultation history
        5. User checks subscription status
        """
        
        # === STEP 1: USER SIGNUP ===
        print("🔐 Step 1: User Registration")
        
        user_data = {
            "email": "journey@carebow.com",
            "password": "journeypass123",
            "full_name": "Journey Test User"
        }
        
        signup_response = client.post("/api/v1/auth/register", json=user_data)
        
        assert signup_response.status_code == 200
        signup_data = signup_response.json()
        assert signup_data["email"] == user_data["email"]
        assert signup_data["subscription_tier"] == "free"
        assert signup_data["consultations_limit"] == 3
        
        user_id = signup_data["id"]
        print(f"✅ User registered successfully with ID: {user_id}")
        
        
        # === STEP 2: USER LOGIN ===
        print("🔑 Step 2: User Login")
        
        login_data = {
            "username": user_data["email"],
            "password": user_data["password"]
        }
        
        login_response = client.post("/api/v1/auth/login", data=login_data)
        
        assert login_response.status_code == 200
        login_result = login_response.json()
        assert "access_token" in login_result
        assert login_result["user"]["id"] == user_id
        
        # Extract auth headers for subsequent requests
        token = login_result["access_token"]
        auth_headers = {"Authorization": f"Bearer {token}"}
        print("✅ User logged in successfully")
        
        
        # === STEP 3: CHECK INITIAL SUBSCRIPTION STATUS ===
        print("💳 Step 3: Check Initial Subscription Status")
        
        initial_status_response = client.get(
            "/api/v1/payments/subscription-status",
            headers=auth_headers
        )
        
        assert initial_status_response.status_code == 200
        initial_status = initial_status_response.json()
        assert initial_status["subscription_tier"] == "free"
        assert initial_status["subscription_active"] is False
        assert initial_status["consultations_limit"] == 3
        print("✅ Initial subscription status confirmed (Free tier)")
        
        
        # === STEP 4: UPGRADE TO PAID SUBSCRIPTION ===
        print("💰 Step 4: Upgrade to Paid Subscription")
        
        subscription_data = {
            "price_id": "price_test_basic_monthly"
        }
        
        subscription_response = client.post(
            "/api/v1/payments/create-subscription",
            json=subscription_data,
            headers=auth_headers
        )
        
        assert subscription_response.status_code == 200
        subscription_result = subscription_response.json()
        assert "subscription_id" in subscription_result
        assert "client_secret" in subscription_result
        print(f"✅ Subscription created: {subscription_result['subscription_id']}")
        
        
        # === STEP 5: SIMULATE SUCCESSFUL PAYMENT WEBHOOK ===
        print("🔔 Step 5: Process Payment Webhook")
        
        # Get updated user to get stripe_customer_id
        user = db_session.query(User).filter(User.id == user_id).first()
        assert user.stripe_customer_id is not None
        
        # Mock successful payment webhook
        mock_stripe["webhook"].construct_event.return_value = {
            "type": "invoice.payment_succeeded",
            "data": {
                "object": {
                    "customer": user.stripe_customer_id
                }
            }
        }
        
        webhook_payload = b'{"type": "invoice.payment_succeeded"}'
        webhook_headers = {"stripe-signature": "test_signature"}
        
        webhook_response = client.post(
            "/api/v1/payments/webhook",
            content=webhook_payload,
            headers=webhook_headers
        )
        
        assert webhook_response.status_code == 200
        print("✅ Payment webhook processed successfully")
        
        
        # === STEP 6: VERIFY SUBSCRIPTION UPGRADE ===
        print("✅ Step 6: Verify Subscription Upgrade")
        
        updated_status_response = client.get(
            "/api/v1/payments/subscription-status",
            headers=auth_headers
        )
        
        assert updated_status_response.status_code == 200
        updated_status = updated_status_response.json()
        assert updated_status["subscription_active"] is True
        assert updated_status["subscription_tier"] == "basic"  # Updated by webhook
        assert updated_status["consultations_limit"] == 50
        print("✅ Subscription successfully upgraded to Basic tier")
        
        
        # === STEP 7: CREATE AI CONSULTATION ===
        print("🤖 Step 7: Create AI Consultation")
        
        consultation_data = {
            "symptoms": "I've been experiencing persistent headaches and fatigue for the past week. The headaches are worse in the morning and I feel tired even after sleeping 8 hours.",
            "consultation_type": "symptom_analysis"
        }
        
        consultation_response = client.post(
            "/api/v1/ai/consultation",
            json=consultation_data,
            headers=auth_headers
        )
        
        assert consultation_response.status_code == 200
        consultation_result = consultation_response.json()
        assert "id" in consultation_result
        assert consultation_result["symptoms"] == consultation_data["symptoms"]
        assert "ai_analysis" in consultation_result
        assert "recommendations" in consultation_result
        assert "ayurvedic_insights" in consultation_result
        assert consultation_result["consultations_remaining"] == 49  # 50 - 1 used
        
        consultation_id = consultation_result["id"]
        print(f"✅ AI consultation created successfully: {consultation_id}")
        
        
        # === STEP 8: TEST AI CHAT ===
        print("💬 Step 8: Test AI Chat")
        
        chat_data = {
            "message": "Can you give me some quick advice for managing stress naturally?",
            "context": {"consultation_id": consultation_id}
        }
        
        chat_response = client.post("/api/v1/ai/chat", json=chat_data)
        
        assert chat_response.status_code == 200
        chat_result = chat_response.json()
        assert "message" in chat_result
        assert len(chat_result["message"]) > 0
        print("✅ AI chat interaction successful")
        
        
        # === STEP 9: VIEW CONSULTATION HISTORY ===
        print("📋 Step 9: View Consultation History")
        
        history_response = client.get(
            "/api/v1/ai/consultations",
            headers=auth_headers
        )
        
        assert history_response.status_code == 200
        history_data = history_response.json()
        assert len(history_data) == 1
        assert history_data[0]["id"] == consultation_id
        assert history_data[0]["symptoms"] == consultation_data["symptoms"]
        print("✅ Consultation history retrieved successfully")
        
        
        # === STEP 10: CREATE ADDITIONAL CONSULTATION (TEST LIMITS) ===
        print("🔄 Step 10: Test Multiple Consultations")
        
        second_consultation_data = {
            "symptoms": "I have been having trouble sleeping and feel anxious during the day.",
            "consultation_type": "general_health"
        }
        
        second_consultation_response = client.post(
            "/api/v1/ai/consultation",
            json=second_consultation_data,
            headers=auth_headers
        )
        
        assert second_consultation_response.status_code == 200
        second_result = second_consultation_response.json()
        assert second_result["consultations_remaining"] == 48  # 50 - 2 used
        print("✅ Second consultation created successfully")
        
        
        # === STEP 11: VERIFY UPDATED HISTORY ===
        print("📚 Step 11: Verify Updated History")
        
        updated_history_response = client.get(
            "/api/v1/ai/consultations",
            headers=auth_headers
        )
        
        assert updated_history_response.status_code == 200
        updated_history = updated_history_response.json()
        assert len(updated_history) == 2
        
        # Verify both consultations are present
        consultation_symptoms = [c["symptoms"] for c in updated_history]
        assert consultation_data["symptoms"] in consultation_symptoms
        assert second_consultation_data["symptoms"] in consultation_symptoms
        print("✅ Updated consultation history verified")
        
        
        # === STEP 12: TEST TOKEN VALIDATION ===
        print("🔐 Step 12: Test Token Validation")
        
        token_test_response = client.post(
            "/api/v1/auth/test-token",
            headers=auth_headers
        )
        
        assert token_test_response.status_code == 200
        token_data = token_test_response.json()
        assert token_data["id"] == user_id
        assert token_data["email"] == user_data["email"]
        print("✅ Token validation successful")
        
        
        # === STEP 13: FINAL STATUS CHECK ===
        print("🏁 Step 13: Final Status Check")
        
        final_status_response = client.get(
            "/api/v1/payments/subscription-status",
            headers=auth_headers
        )
        
        assert final_status_response.status_code == 200
        final_status = final_status_response.json()
        assert final_status["subscription_active"] is True
        assert final_status["subscription_tier"] == "basic"
        assert final_status["consultations_used"] == 2
        assert final_status["consultations_limit"] == 50
        print("✅ Final status check completed")
        
        
        print("\n🎉 COMPLETE USER JOURNEY TEST PASSED! 🎉")
        print("=" * 50)
        print("✅ User Registration")
        print("✅ User Authentication") 
        print("✅ Subscription Creation")
        print("✅ Payment Processing")
        print("✅ AI Consultations (2)")
        print("✅ AI Chat Interaction")
        print("✅ Consultation History")
        print("✅ Usage Tracking")
        print("✅ Token Validation")
        print("=" * 50)
    
    
    @pytest.mark.e2e
    def test_free_user_consultation_limits(self, client: TestClient, db_session: Session, mock_openai):
        """Test that free users are properly limited in consultations."""
        
        print("🆓 Testing Free User Consultation Limits")
        
        # Register free user
        user_data = {
            "email": "freelimit@carebow.com",
            "password": "freelimitpass123",
            "full_name": "Free Limit User"
        }
        
        client.post("/api/v1/auth/register", json=user_data)
        
        # Login
        login_data = {
            "username": user_data["email"],
            "password": user_data["password"]
        }
        login_response = client.post("/api/v1/auth/login", data=login_data)
        token = login_response.json()["access_token"]
        auth_headers = {"Authorization": f"Bearer {token}"}
        
        consultation_data = {
            "symptoms": "Test symptoms for limit testing",
            "consultation_type": "general_health"
        }
        
        # Use all 3 free consultations
        for i in range(3):
            response = client.post(
                "/api/v1/ai/consultation",
                json=consultation_data,
                headers=auth_headers
            )
            assert response.status_code == 200
            result = response.json()
            assert result["consultations_remaining"] == 2 - i
            print(f"✅ Consultation {i+1}/3 created successfully")
        
        # 4th consultation should fail
        response = client.post(
            "/api/v1/ai/consultation",
            json=consultation_data,
            headers=auth_headers
        )
        
        assert response.status_code == 403
        assert "Consultation limit reached" in response.json()["detail"]
        print("✅ Free user consultation limit properly enforced")
    
    
    @pytest.mark.e2e
    def test_subscription_failure_flow(self, client: TestClient, db_session: Session, mock_stripe):
        """Test handling of failed subscription payments."""
        
        print("💳 Testing Subscription Failure Flow")
        
        # Register and login user
        user_data = {
            "email": "failpay@carebow.com",
            "password": "failpaypass123",
            "full_name": "Fail Pay User"
        }
        
        client.post("/api/v1/auth/register", json=user_data)
        
        login_data = {
            "username": user_data["email"],
            "password": user_data["password"]
        }
        login_response = client.post("/api/v1/auth/login", data=login_data)
        token = login_response.json()["access_token"]
        auth_headers = {"Authorization": f"Bearer {token}"}
        
        # Create subscription
        subscription_data = {
            "price_id": "price_test_basic_monthly"
        }
        
        subscription_response = client.post(
            "/api/v1/payments/create-subscription",
            json=subscription_data,
            headers=auth_headers
        )
        
        assert subscription_response.status_code == 200
        print("✅ Subscription created")
        
        # Get user for webhook simulation
        user = db_session.query(User).filter(User.email == user_data["email"]).first()
        
        # Simulate successful payment first
        mock_stripe["webhook"].construct_event.return_value = {
            "type": "invoice.payment_succeeded",
            "data": {
                "object": {
                    "customer": user.stripe_customer_id
                }
            }
        }
        
        webhook_payload = b'{"type": "invoice.payment_succeeded"}'
        webhook_headers = {"stripe-signature": "test_signature"}
        
        client.post(
            "/api/v1/payments/webhook",
            content=webhook_payload,
            headers=webhook_headers
        )
        
        # Verify subscription is active
        status_response = client.get(
            "/api/v1/payments/subscription-status",
            headers=auth_headers
        )
        assert status_response.json()["subscription_active"] is True
        print("✅ Subscription activated")
        
        # Simulate payment failure
        mock_stripe["webhook"].construct_event.return_value = {
            "type": "invoice.payment_failed",
            "data": {
                "object": {
                    "customer": user.stripe_customer_id
                }
            }
        }
        
        failed_webhook_payload = b'{"type": "invoice.payment_failed"}'
        
        client.post(
            "/api/v1/payments/webhook",
            content=failed_webhook_payload,
            headers=webhook_headers
        )
        
        # Verify subscription is deactivated
        final_status_response = client.get(
            "/api/v1/payments/subscription-status",
            headers=auth_headers
        )
        assert final_status_response.json()["subscription_active"] is False
        print("✅ Subscription properly deactivated after payment failure")
        
        print("✅ Subscription failure flow test completed successfully")


class TestE2EErrorHandling:
    """Test error handling in E2E scenarios."""
    
    @pytest.mark.e2e
    def test_invalid_auth_flow(self, client: TestClient):
        """Test various authentication error scenarios."""
        
        print("🚫 Testing Authentication Error Scenarios")
        
        # Test accessing protected endpoint without auth
        response = client.get("/api/v1/payments/subscription-status")
        assert response.status_code == 401
        print("✅ Unauthenticated access properly blocked")
        
        # Test with invalid token
        headers = {"Authorization": "Bearer invalid_token_here"}
        response = client.get("/api/v1/payments/subscription-status", headers=headers)
        assert response.status_code == 401
        print("✅ Invalid token properly rejected")
        
        # Test malformed auth header
        headers = {"Authorization": "NotBearer token"}
        response = client.get("/api/v1/payments/subscription-status", headers=headers)
        assert response.status_code == 401
        print("✅ Malformed auth header properly rejected")
    
    @pytest.mark.e2e
    def test_service_degradation_flow(self, client: TestClient, auth_headers):
        """Test system behavior when external services are unavailable."""
        
        print("⚠️ Testing Service Degradation Scenarios")
        
        # Test AI chat when OpenAI is unavailable
        with patch('app.api.api_v1.endpoints.ai.client', None):
            chat_data = {
                "message": "I have a headache, what should I do?",
                "context": {}
            }
            
            response = client.post("/api/v1/ai/chat", json=chat_data)
            
            assert response.status_code == 200
            data = response.json()
            assert len(data["message"]) > 0
            assert "headache" in data["message"].lower()
            print("✅ AI chat gracefully degrades to fallback responses")
        
        # Test consultation when OpenAI is unavailable
        with patch('app.api.api_v1.endpoints.ai.client', None):
            consultation_data = {
                "symptoms": "Test symptoms for degraded service",
                "consultation_type": "general_health"
            }
            
            response = client.post(
                "/api/v1/ai/consultation",
                json=consultation_data,
                headers=auth_headers
            )
            
            assert response.status_code == 200
            data = response.json()
            assert "AI analysis is not available" in data["ai_analysis"]
            print("✅ Consultation service gracefully handles OpenAI unavailability")
        
        print("✅ Service degradation handling test completed")