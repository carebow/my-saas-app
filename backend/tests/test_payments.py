"""
Payment endpoint tests for CareBow backend.
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from unittest.mock import Mock, patch
import stripe

from app.models.user import User, SubscriptionTier


class TestSubscriptionCreation:
    """Test subscription creation functionality."""
    
    @pytest.mark.unit
    @pytest.mark.payments
    def test_create_subscription_new_customer(self, client: TestClient, auth_headers, test_user, mock_stripe):
        """Test creating subscription for user without Stripe customer ID."""
        subscription_data = {
            "price_id": "price_test_basic_monthly"
        }
        
        response = client.post(
            "/api/v1/payments/create-subscription",
            json=subscription_data,
            headers=auth_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["subscription_id"] == "sub_test_123"
        assert data["client_secret"] == "pi_test_secret"
        assert data["status"] == "active"
        
        # Verify Stripe customer was created
        mock_stripe["customer"].create.assert_called_once()
        mock_stripe["subscription"].create.assert_called_once()
    
    @pytest.mark.unit
    @pytest.mark.payments
    def test_create_subscription_existing_customer(self, client: TestClient, db_session: Session, premium_user, mock_stripe):
        """Test creating subscription for user with existing Stripe customer ID."""
        # Login as premium user
        login_data = {
            "username": premium_user.email,
            "password": "premiumpass123"
        }
        login_response = client.post("/api/v1/auth/login", data=login_data)
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        subscription_data = {
            "price_id": "price_test_premium_monthly"
        }
        
        response = client.post(
            "/api/v1/payments/create-subscription",
            json=subscription_data,
            headers=headers
        )
        
        assert response.status_code == 200
        
        # Verify no new customer was created
        mock_stripe["customer"].create.assert_not_called()
        mock_stripe["subscription"].create.assert_called_once()
    
    @pytest.mark.unit
    @pytest.mark.payments
    def test_create_subscription_unauthenticated(self, client: TestClient):
        """Test creating subscription without authentication."""
        subscription_data = {
            "price_id": "price_test_basic_monthly"
        }
        
        response = client.post(
            "/api/v1/payments/create-subscription",
            json=subscription_data
        )
        
        assert response.status_code == 401
    
    @pytest.mark.unit
    @pytest.mark.payments
    def test_create_subscription_stripe_error(self, client: TestClient, auth_headers, mock_stripe):
        """Test handling Stripe API errors during subscription creation."""
        # Mock Stripe error
        mock_stripe["subscription"].create.side_effect = stripe.error.CardError(
            "Your card was declined.",
            "card_declined",
            "card_declined"
        )
        
        subscription_data = {
            "price_id": "price_test_basic_monthly"
        }
        
        response = client.post(
            "/api/v1/payments/create-subscription",
            json=subscription_data,
            headers=auth_headers
        )
        
        assert response.status_code == 400
        assert "card was declined" in response.json()["detail"]


class TestWebhookHandling:
    """Test Stripe webhook handling."""
    
    @pytest.mark.unit
    @pytest.mark.payments
    def test_webhook_payment_succeeded(self, client: TestClient, db_session: Session, premium_user, mock_stripe):
        """Test handling successful payment webhook."""
        # Mock webhook event
        mock_stripe["webhook"].construct_event.return_value = {
            "type": "invoice.payment_succeeded",
            "data": {
                "object": {
                    "customer": premium_user.stripe_customer_id
                }
            }
        }
        
        webhook_payload = b'{"type": "invoice.payment_succeeded"}'
        headers = {"stripe-signature": "test_signature"}
        
        response = client.post(
            "/api/v1/payments/webhook",
            content=webhook_payload,
            headers=headers
        )
        
        assert response.status_code == 200
        assert response.json()["status"] == "success"
        
        # Verify user subscription was updated
        db_session.refresh(premium_user)
        assert premium_user.subscription_active is True
    
    @pytest.mark.unit
    @pytest.mark.payments
    def test_webhook_payment_failed(self, client: TestClient, db_session: Session, premium_user, mock_stripe):
        """Test handling failed payment webhook."""
        # Set user as active initially
        premium_user.subscription_active = True
        db_session.commit()
        
        # Mock webhook event
        mock_stripe["webhook"].construct_event.return_value = {
            "type": "invoice.payment_failed",
            "data": {
                "object": {
                    "customer": premium_user.stripe_customer_id
                }
            }
        }
        
        webhook_payload = b'{"type": "invoice.payment_failed"}'
        headers = {"stripe-signature": "test_signature"}
        
        response = client.post(
            "/api/v1/payments/webhook",
            content=webhook_payload,
            headers=headers
        )
        
        assert response.status_code == 200
        
        # Verify user subscription was deactivated
        db_session.refresh(premium_user)
        assert premium_user.subscription_active is False
    
    @pytest.mark.unit
    @pytest.mark.payments
    def test_webhook_invalid_signature(self, client: TestClient, mock_stripe):
        """Test webhook with invalid signature."""
        # Mock signature verification error
        mock_stripe["webhook"].construct_event.side_effect = stripe.error.SignatureVerificationError(
            "Invalid signature",
            "test_signature"
        )
        
        webhook_payload = b'{"type": "invoice.payment_succeeded"}'
        headers = {"stripe-signature": "invalid_signature"}
        
        response = client.post(
            "/api/v1/payments/webhook",
            content=webhook_payload,
            headers=headers
        )
        
        assert response.status_code == 400
        assert "Invalid signature" in response.json()["detail"]
    
    @pytest.mark.unit
    @pytest.mark.payments
    def test_webhook_invalid_payload(self, client: TestClient, mock_stripe):
        """Test webhook with invalid payload."""
        # Mock payload error
        mock_stripe["webhook"].construct_event.side_effect = ValueError("Invalid payload")
        
        webhook_payload = b'invalid json'
        headers = {"stripe-signature": "test_signature"}
        
        response = client.post(
            "/api/v1/payments/webhook",
            content=webhook_payload,
            headers=headers
        )
        
        assert response.status_code == 400
        assert "Invalid payload" in response.json()["detail"]
    
    @pytest.mark.unit
    @pytest.mark.payments
    def test_webhook_unknown_event_type(self, client: TestClient, mock_stripe):
        """Test webhook with unknown event type."""
        # Mock unknown event
        mock_stripe["webhook"].construct_event.return_value = {
            "type": "unknown.event.type",
            "data": {"object": {}}
        }
        
        webhook_payload = b'{"type": "unknown.event.type"}'
        headers = {"stripe-signature": "test_signature"}
        
        response = client.post(
            "/api/v1/payments/webhook",
            content=webhook_payload,
            headers=headers
        )
        
        assert response.status_code == 200
        assert response.json()["status"] == "success"


class TestSubscriptionStatus:
    """Test subscription status endpoint."""
    
    @pytest.mark.unit
    @pytest.mark.payments
    def test_get_subscription_status_free_user(self, client: TestClient, auth_headers, test_user):
        """Test getting subscription status for free tier user."""
        response = client.get(
            "/api/v1/payments/subscription-status",
            headers=auth_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["subscription_tier"] == "free"
        assert data["subscription_active"] is False
        assert data["consultations_used"] == 0
        assert data["consultations_limit"] == 3
    
    @pytest.mark.unit
    @pytest.mark.payments
    def test_get_subscription_status_premium_user(self, client: TestClient, premium_user):
        """Test getting subscription status for premium user."""
        # Login as premium user
        login_data = {
            "username": premium_user.email,
            "password": "premiumpass123"
        }
        login_response = client.post("/api/v1/auth/login", data=login_data)
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        response = client.get(
            "/api/v1/payments/subscription-status",
            headers=headers
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["subscription_tier"] == "premium"
        assert data["subscription_active"] is True
        assert data["consultations_used"] == 5
        assert data["consultations_limit"] == 100
    
    @pytest.mark.unit
    @pytest.mark.payments
    def test_get_subscription_status_unauthenticated(self, client: TestClient):
        """Test getting subscription status without authentication."""
        response = client.get("/api/v1/payments/subscription-status")
        
        assert response.status_code == 401


class TestPaymentIntegration:
    """Integration tests for payment flow."""
    
    @pytest.mark.integration
    @pytest.mark.payments
    def test_full_subscription_flow(self, client: TestClient, db_session: Session, test_user, auth_headers, mock_stripe):
        """Test complete subscription flow: create → webhook → status check."""
        # Step 1: Create subscription
        subscription_data = {
            "price_id": "price_test_basic_monthly"
        }
        
        create_response = client.post(
            "/api/v1/payments/create-subscription",
            json=subscription_data,
            headers=auth_headers
        )
        
        assert create_response.status_code == 200
        
        # Step 2: Simulate successful payment webhook
        db_session.refresh(test_user)
        mock_stripe["webhook"].construct_event.return_value = {
            "type": "invoice.payment_succeeded",
            "data": {
                "object": {
                    "customer": test_user.stripe_customer_id
                }
            }
        }
        
        webhook_payload = b'{"type": "invoice.payment_succeeded"}'
        headers_webhook = {"stripe-signature": "test_signature"}
        
        webhook_response = client.post(
            "/api/v1/payments/webhook",
            content=webhook_payload,
            headers=headers_webhook
        )
        
        assert webhook_response.status_code == 200
        
        # Step 3: Check subscription status
        status_response = client.get(
            "/api/v1/payments/subscription-status",
            headers=auth_headers
        )
        
        assert status_response.status_code == 200
        status_data = status_response.json()
        assert status_data["subscription_active"] is True
        assert status_data["subscription_tier"] == "basic"
        assert status_data["consultations_limit"] == 50
    
    @pytest.mark.integration
    @pytest.mark.payments
    def test_subscription_upgrade_flow(self, client: TestClient, db_session: Session, mock_stripe):
        """Test upgrading from free to premium subscription."""
        # Create and login user
        user_data = {
            "email": "upgrade@carebow.com",
            "password": "upgradepass123",
            "full_name": "Upgrade User"
        }
        
        client.post("/api/v1/auth/register", json=user_data)
        
        login_data = {
            "username": user_data["email"],
            "password": user_data["password"]
        }
        login_response = client.post("/api/v1/auth/login", data=login_data)
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # Check initial status (free tier)
        initial_status = client.get("/api/v1/payments/subscription-status", headers=headers)
        assert initial_status.json()["subscription_tier"] == "free"
        
        # Create premium subscription
        subscription_data = {
            "price_id": "price_test_premium_monthly"
        }
        
        create_response = client.post(
            "/api/v1/payments/create-subscription",
            json=subscription_data,
            headers=headers
        )
        
        assert create_response.status_code == 200
        
        # Simulate successful payment
        user = db_session.query(User).filter(User.email == user_data["email"]).first()
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
        
        # Verify upgrade
        final_status = client.get("/api/v1/payments/subscription-status", headers=headers)
        final_data = final_status.json()
        assert final_data["subscription_active"] is True
        assert final_data["subscription_tier"] == "basic"  # Updated by webhook
        assert final_data["consultations_limit"] == 50