import pytest
import os
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
from unittest.mock import Mock

# Load test environment
load_dotenv(".env.test")

# Force test environment variables
os.environ["DATABASE_URL"] = "sqlite:///./test_carebow.db"
os.environ["ENVIRONMENT"] = "test"
os.environ["HIPAA_ENCRYPTION_KEY"] = "TEST_HIPAA_KEY_32_CHARS_FOR_TESTING_ONLY_123456789"

from main import app
from app.db.base import Base
from app.db.session import get_db

# Create test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_carebow.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture
def client():
    return TestClient(app)

@pytest.fixture
def db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

@pytest.fixture
def db_session():
    """Alias for db fixture to match test expectations."""
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        # Clean up the database after each test
        db.rollback()
        db.close()

@pytest.fixture(autouse=True, scope="function")
def setup_test_db():
    """Set up and clean up database for each test."""
    # Drop and recreate all tables before each test
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    yield  # Run the test
    
    # Clean up after the test
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def test_user_data():
    """Test user data for authentication tests."""
    import uuid
    import time
    import random
    unique_id = f"{int(time.time())}{random.randint(1000, 9999)}{uuid.uuid4().hex[:4]}"
    return {
        "email": f"testuser+{unique_id}@carebow.com",
        "password": "testpassword123",
        "full_name": "Test User"
    }

@pytest.fixture
def test_user(client, test_user_data):
    """Create a test user and return user data."""
    # Register the user
    response = client.post("/api/v1/auth/register", json=test_user_data)
    if response.status_code != 200:
        print(f"Registration failed: {response.status_code} - {response.text}")
    assert response.status_code == 200
    return response.json()

@pytest.fixture
def auth_headers(client, test_user_data):
    """Create a test user and return authentication headers."""
    # Register the user
    register_response = client.post("/api/v1/auth/register", json=test_user_data)
    assert register_response.status_code == 200
    
    # Login to get token
    login_data = {
        "username": test_user_data["email"],
        "password": test_user_data["password"]
    }
    login_response = client.post("/api/v1/auth/login", data=login_data)
    assert login_response.status_code == 200
    
    token = login_response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture
def premium_user(client, db_session):
    """Create a premium user for testing."""
    from app.models.user import User, SubscriptionTier
    from app.core.security import get_password_hash
    
    user = User(
        email="premium@carebow.com",
        hashed_password=get_password_hash("premiumpass123"),
        full_name="Premium User",
        is_active=True,
        subscription_tier=SubscriptionTier.PREMIUM,
        consultations_used=5,
        consultations_limit=100
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user

@pytest.fixture
def sample_chat_data():
    """Sample chat data for testing."""
    return {
        "message": "I have a headache and feel tired",
        "personality": "caring_nurse"
    }

@pytest.fixture
def mock_openai():
    """Mock OpenAI API calls."""
    from unittest.mock import patch, Mock
    
    mock_response = Mock()
    mock_response.choices = [Mock()]
    mock_response.choices[0].message.content = "This is a test AI response for your health concern."
    
    mock_client = Mock()
    mock_client.chat.completions.create.return_value = mock_response
    
    with patch('app.api.api_v1.endpoints.ai.client', mock_client):
        yield mock_client

@pytest.fixture
def mock_stripe():
    """Mock Stripe API calls using unittest.mock."""
    import stripe
    from unittest.mock import patch, Mock
    
    # Create mock objects with attributes
    mock_customer = Mock()
    mock_customer.id = "cus_test123"
    mock_customer.email = "test@example.com"
    
    # Create mock subscription with nested payment intent
    mock_payment_intent = Mock()
    mock_payment_intent.client_secret = "pi_test_secret"
    
    mock_invoice = Mock()
    mock_invoice.payment_intent = mock_payment_intent
    
    mock_subscription = Mock()
    mock_subscription.id = "sub_test_123"
    mock_subscription.status = "active"
    mock_subscription.current_period_end = 1234567890
    mock_subscription.latest_invoice = mock_invoice
    
    # Patch Stripe modules
    with patch("stripe.Customer") as mock_stripe_customer, \
         patch("stripe.Subscription") as mock_stripe_subscription, \
         patch("stripe.Webhook") as mock_webhook:
        
        # Configure mocks
        mock_stripe_customer.create.return_value = mock_customer
        mock_stripe_customer.retrieve.return_value = mock_customer
        mock_stripe_subscription.create.return_value = mock_subscription
        mock_webhook.construct_event = Mock()
        
        yield {
            "customer": mock_stripe_customer,
            "subscription": mock_stripe_subscription,
            "webhook": mock_webhook,
            "Webhook": mock_webhook  # Support both casings
        }

# Debug hook to log response bodies when tests fail
@pytest.hookimpl(hookwrapper=True)
def pytest_runtest_makereport(item, call):
    outcome = yield
    rep = outcome.get_result()
    if rep.when == "call" and rep.failed:
        # Look for response in test function arguments
        if hasattr(item, 'funcargs'):
            for arg_name, arg_value in item.funcargs.items():
                if hasattr(arg_value, 'status_code') and hasattr(arg_value, 'text'):
                    print(f"\n--- DEBUG RESPONSE ({arg_name}) ---")
                    print("Status:", getattr(arg_value, "status_code", "n/a"))
                    print("Headers:", dict(getattr(arg_value, "headers", {})))
                    try:
                        print("JSON:", arg_value.json())
                    except Exception as e:
                        print("JSON Error:", str(e))
                        print("Text:", getattr(arg_value, "text", "n/a"))
                    break
