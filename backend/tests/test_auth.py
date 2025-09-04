"""
Authentication endpoint tests for CareBow backend.
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.models.user import User, SubscriptionTier


class TestUserRegistration:
    """Test user registration functionality."""
    
    @pytest.mark.unit
    @pytest.mark.auth
    def test_register_new_user(self, client: TestClient, db_session: Session):
        """Test successful user registration."""
        user_data = {
            "email": "newuser@carebow.com",
            "password": "securepassword123",
            "full_name": "New User"
        }
        
        response = client.post("/api/v1/auth/register", json=user_data)
        
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == user_data["email"]
        assert data["full_name"] == user_data["full_name"]
        assert data["is_active"] is True
        assert data["subscription_tier"] == "free"
        assert data["consultations_used"] == 0
        assert data["consultations_limit"] == 3
        assert "id" in data
        
        # Verify user was created in database
        user = db_session.query(User).filter(User.email == user_data["email"]).first()
        assert user is not None
        assert user.email == user_data["email"]
        assert user.full_name == user_data["full_name"]
    
    @pytest.mark.unit
    @pytest.mark.auth
    def test_register_duplicate_email(self, client: TestClient, test_user):
        """Test registration with existing email fails."""
        user_data = {
            "email": test_user["email"],
            "password": "anotherpassword123",
            "full_name": "Another User"
        }
        
        response = client.post("/api/v1/auth/register", json=user_data)
        
        assert response.status_code == 400
        assert "already exists" in response.json()["detail"]
    
    @pytest.mark.unit
    @pytest.mark.auth
    def test_register_invalid_email(self, client: TestClient):
        """Test registration with invalid email format."""
        user_data = {
            "email": "invalid-email",
            "password": "securepassword123",
            "full_name": "Test User"
        }
        
        response = client.post("/api/v1/auth/register", json=user_data)
        
        assert response.status_code == 422  # Validation error
    
    @pytest.mark.unit
    @pytest.mark.auth
    def test_register_missing_required_fields(self, client: TestClient):
        """Test registration with missing required fields."""
        user_data = {
            "email": "test@carebow.com"
            # Missing password
        }
        
        response = client.post("/api/v1/auth/register", json=user_data)
        
        assert response.status_code == 422


class TestUserLogin:
    """Test user login functionality."""
    
    @pytest.mark.unit
    @pytest.mark.auth
    def test_login_valid_credentials(self, client: TestClient, test_user, test_user_data):
        """Test successful login with valid credentials."""
        login_data = {
            "username": test_user_data["email"],
            "password": test_user_data["password"]
        }
        
        response = client.post("/api/v1/auth/login", data=login_data)
        
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
        assert "user" in data
        assert data["user"]["email"] == test_user_data["email"]
        assert data["user"]["id"] == test_user["id"]
    
    @pytest.mark.unit
    @pytest.mark.auth
    def test_login_invalid_email(self, client: TestClient):
        """Test login with non-existent email."""
        login_data = {
            "username": "nonexistent@carebow.com",
            "password": "somepassword"
        }
        
        response = client.post("/api/v1/auth/login", data=login_data)
        
        assert response.status_code == 401
        assert "Incorrect email or password" in response.json()["detail"]
    
    @pytest.mark.unit
    @pytest.mark.auth
    def test_login_invalid_password(self, client: TestClient, test_user_data):
        """Test login with wrong password."""
        login_data = {
            "username": test_user_data["email"],
            "password": "wrongpassword"
        }
        
        response = client.post("/api/v1/auth/login", data=login_data)
        
        assert response.status_code == 401
        assert "Incorrect email or password" in response.json()["detail"]
    
    @pytest.mark.unit
    @pytest.mark.auth
    def test_login_inactive_user(self, client: TestClient, db_session: Session, test_user_data):
        """Test login with inactive user account."""
        from app.core.security import get_password_hash
        
        # Create inactive user
        inactive_user = User(
            email="inactive@carebow.com",
            hashed_password=get_password_hash("password"),
            full_name="Inactive User",
            is_active=False
        )
        db_session.add(inactive_user)
        db_session.commit()
        
        login_data = {
            "username": "inactive@carebow.com",
            "password": "password"
        }
        
        response = client.post("/api/v1/auth/login", data=login_data)
        
        assert response.status_code == 401
        assert "Inactive user" in response.json()["detail"]


class TestTokenValidation:
    """Test JWT token validation."""
    
    @pytest.mark.unit
    @pytest.mark.auth
    def test_valid_token_access(self, client: TestClient, auth_headers):
        """Test accessing protected endpoint with valid token."""
        response = client.post("/api/v1/auth/test-token", headers=auth_headers)
        
        assert response.status_code == 200
        data = response.json()
        assert "email" in data
        assert "id" in data
        assert data["is_active"] is True
    
    @pytest.mark.unit
    @pytest.mark.auth
    def test_invalid_token_access(self, client: TestClient):
        """Test accessing protected endpoint with invalid token."""
        headers = {"Authorization": "Bearer invalid_token"}
        
        response = client.post("/api/v1/auth/test-token", headers=headers)
        
        assert response.status_code == 401
    
    @pytest.mark.unit
    @pytest.mark.auth
    def test_missing_token_access(self, client: TestClient):
        """Test accessing protected endpoint without token."""
        response = client.post("/api/v1/auth/test-token")
        
        assert response.status_code == 401
    
    @pytest.mark.unit
    @pytest.mark.auth
    def test_malformed_token_header(self, client: TestClient):
        """Test accessing protected endpoint with malformed auth header."""
        headers = {"Authorization": "InvalidFormat token"}
        
        response = client.post("/api/v1/auth/test-token", headers=headers)
        
        assert response.status_code == 401


class TestAuthenticationIntegration:
    """Integration tests for authentication flow."""
    
    @pytest.mark.integration
    @pytest.mark.auth
    def test_full_auth_flow(self, client: TestClient, db_session: Session):
        """Test complete authentication flow: register → login → access protected resource."""
        # Step 1: Register new user
        user_data = {
            "email": "flowtest@carebow.com",
            "password": "flowpassword123",
            "full_name": "Flow Test User"
        }
        
        register_response = client.post("/api/v1/auth/register", json=user_data)
        assert register_response.status_code == 200
        user_id = register_response.json()["id"]
        
        # Step 2: Login with new user
        login_data = {
            "username": user_data["email"],
            "password": user_data["password"]
        }
        
        login_response = client.post("/api/v1/auth/login", data=login_data)
        assert login_response.status_code == 200
        token = login_response.json()["access_token"]
        
        # Step 3: Access protected resource
        headers = {"Authorization": f"Bearer {token}"}
        protected_response = client.post("/api/v1/auth/test-token", headers=headers)
        
        assert protected_response.status_code == 200
        protected_data = protected_response.json()
        assert protected_data["id"] == user_id
        assert protected_data["email"] == user_data["email"]
    
    @pytest.mark.integration
    @pytest.mark.auth
    def test_subscription_tier_in_auth_response(self, client: TestClient, premium_user):
        """Test that subscription information is included in auth responses."""
        login_data = {
            "username": premium_user.email,
            "password": "premiumpass123"
        }
        
        response = client.post("/api/v1/auth/login", data=login_data)
        
        assert response.status_code == 200
        data = response.json()
        assert data["user"]["subscription_tier"] == "premium"
        assert data["user"]["consultations_limit"] == 100
        assert data["user"]["consultations_used"] == 5