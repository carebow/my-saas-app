"""
AI Chat endpoint tests for CareBow backend.
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from unittest.mock import Mock, patch

from app.models.health import Consultation
from app.models.user import SubscriptionTier


class TestChatEndpoint:
    """Test AI chat functionality."""
    
    @pytest.mark.unit
    @pytest.mark.ai
    def test_chat_with_openai_success(self, client: TestClient, sample_chat_data, mock_openai):
        """Test successful chat with OpenAI API."""
        response = client.post("/api/v1/ai/chat", json=sample_chat_data)
        
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert data["message"] == "This is a test AI response for your health concern."
        assert "consultations_remaining" in data
        assert data["consultation_id"] is None
        
        # Verify OpenAI was called
        mock_openai.chat.completions.create.assert_called_once()
    
    @pytest.mark.unit
    @pytest.mark.ai
    def test_chat_without_openai_fallback(self, client: TestClient, sample_chat_data):
        """Test chat fallback when OpenAI is not available."""
        with patch('app.api.api_v1.endpoints.ai.client', None):
            response = client.post("/api/v1/ai/chat", json=sample_chat_data)
            
            assert response.status_code == 200
            data = response.json()
            assert "message" in data
            assert len(data["message"]) > 0
            # Should contain fallback response about headaches
            assert "headache" in data["message"].lower() or "head" in data["message"].lower()
    
    @pytest.mark.unit
    @pytest.mark.ai
    def test_chat_headache_fallback(self, client: TestClient):
        """Test specific fallback response for headache symptoms."""
        chat_data = {
            "message": "I have a severe headache and it won't go away",
            "context": {}
        }
        
        with patch('app.api.api_v1.endpoints.ai.client', None):
            response = client.post("/api/v1/ai/chat", json=chat_data)
            
            assert response.status_code == 200
            data = response.json()
            message = data["message"].lower()
            
            # Should contain headache-specific advice
            assert "headache" in message
            assert "ginger" in message or "compress" in message
            assert "healthcare provider" in message
    
    @pytest.mark.unit
    @pytest.mark.ai
    def test_chat_fatigue_fallback(self, client: TestClient):
        """Test specific fallback response for fatigue symptoms."""
        chat_data = {
            "message": "I'm always tired and have no energy",
            "context": {}
        }
        
        with patch('app.api.api_v1.endpoints.ai.client', None):
            response = client.post("/api/v1/ai/chat", json=chat_data)
            
            assert response.status_code == 200
            data = response.json()
            message = data["message"].lower()
            
            # Should contain fatigue-specific advice
            assert "tired" in message or "fatigue" in message or "energy" in message
            assert "sleep" in message or "ashwagandha" in message
            assert "iron" in message or "b vitamin" in message
    
    @pytest.mark.unit
    @pytest.mark.ai
    def test_chat_stress_fallback(self, client: TestClient):
        """Test specific fallback response for stress/anxiety."""
        chat_data = {
            "message": "I'm feeling very stressed and anxious lately",
            "context": {}
        }
        
        with patch('app.api.api_v1.endpoints.ai.client', None):
            response = client.post("/api/v1/ai/chat", json=chat_data)
            
            assert response.status_code == 200
            data = response.json()
            message = data["message"].lower()
            
            # Should contain stress-specific advice
            assert "stress" in message or "anxiety" in message
            assert "breathing" in message or "meditation" in message
            assert "brahmi" in message or "calm" in message
    
    @pytest.mark.unit
    @pytest.mark.ai
    def test_chat_openai_error_fallback(self, client: TestClient, sample_chat_data, mock_openai):
        """Test fallback when OpenAI API throws an error."""
        # Mock OpenAI error
        mock_openai.chat.completions.create.side_effect = Exception("OpenAI API Error")
        
        response = client.post("/api/v1/ai/chat", json=sample_chat_data)
        
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert len(data["message"]) > 0
        # Should provide helpful fallback response
        assert "health" in data["message"].lower()
    
    @pytest.mark.unit
    @pytest.mark.ai
    def test_chat_with_personality(self, client: TestClient, mock_openai):
        """Test chat with different personality settings."""
        chat_data = {
            "message": "I have a headache",
            "personality": "ayurvedic_practitioner"
        }
        
        response = client.post("/api/v1/ai/chat", json=chat_data)
        
        assert response.status_code == 200
        
        # Verify the system prompt included personality
        call_args = mock_openai.chat.completions.create.call_args
        system_message = call_args[1]["messages"][0]["content"]
        assert "ayurvedic practitioner" in system_message.lower()
    
    @pytest.mark.unit
    @pytest.mark.ai
    def test_chat_invalid_input(self, client: TestClient):
        """Test chat with invalid input data."""
        invalid_data = {
            "invalid_field": "test"
            # Missing required 'message' field
        }
        
        response = client.post("/api/v1/ai/chat", json=invalid_data)
        
        assert response.status_code == 422  # Validation error


class TestConsultationEndpoint:
    """Test AI consultation functionality."""
    
    @pytest.mark.unit
    @pytest.mark.ai
    def test_create_consultation_success(self, client: TestClient, auth_headers, sample_consultation_data, mock_openai, db_session: Session):
        """Test successful consultation creation."""
        response = client.post(
            "/api/v1/ai/consultation",
            json=sample_consultation_data,
            headers=auth_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "id" in data
        assert data["symptoms"] == sample_consultation_data["symptoms"]
        assert data["consultation_type"] == sample_consultation_data["consultation_type"]
        assert "ai_analysis" in data
        assert "recommendations" in data
        assert "ayurvedic_insights" in data
        assert "consultations_remaining" in data
        
        # Verify consultation was saved to database
        consultation = db_session.query(Consultation).filter(Consultation.id == data["id"]).first()
        assert consultation is not None
        assert consultation.symptoms == sample_consultation_data["symptoms"]
        
        # Verify OpenAI was called
        mock_openai.chat.completions.create.assert_called_once()
    
    @pytest.mark.unit
    @pytest.mark.ai
    def test_create_consultation_without_openai(self, client: TestClient, auth_headers, sample_consultation_data, db_session: Session):
        """Test consultation creation when OpenAI is not available."""
        with patch('app.api.api_v1.endpoints.ai.client', None):
            response = client.post(
                "/api/v1/ai/consultation",
                json=sample_consultation_data,
                headers=auth_headers
            )
            
            assert response.status_code == 200
            data = response.json()
            assert "AI analysis is not available" in data["ai_analysis"]
    
    @pytest.mark.unit
    @pytest.mark.ai
    def test_create_consultation_limit_exceeded(self, client: TestClient, db_session: Session, test_user, sample_consultation_data):
        """Test consultation creation when user has exceeded their limit."""
        # Set user to have exceeded consultation limit
        test_user.consultations_used = 3
        test_user.consultations_limit = 3
        db_session.commit()
        
        # Login as test user
        login_data = {
            "username": test_user.email,
            "password": "testpassword123"
        }
        login_response = client.post("/api/v1/auth/login", data=login_data)
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        response = client.post(
            "/api/v1/ai/consultation",
            json=sample_consultation_data,
            headers=headers
        )
        
        assert response.status_code == 403
        assert "Consultation limit reached" in response.json()["detail"]
    
    @pytest.mark.unit
    @pytest.mark.ai
    def test_create_consultation_premium_user(self, client: TestClient, premium_user, sample_consultation_data, mock_openai, db_session: Session):
        """Test consultation creation for premium user with higher limits."""
        # Login as premium user
        login_data = {
            "username": premium_user.email,
            "password": "premiumpass123"
        }
        login_response = client.post("/api/v1/auth/login", data=login_data)
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        response = client.post(
            "/api/v1/ai/consultation",
            json=sample_consultation_data,
            headers=headers
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["consultations_remaining"] == 95  # 100 - 5 used
    
    @pytest.mark.unit
    @pytest.mark.ai
    def test_create_consultation_unauthenticated(self, client: TestClient, sample_consultation_data):
        """Test consultation creation without authentication."""
        response = client.post("/api/v1/ai/consultation", json=sample_consultation_data)
        
        assert response.status_code == 401
    
    @pytest.mark.unit
    @pytest.mark.ai
    def test_create_consultation_openai_error(self, client: TestClient, auth_headers, sample_consultation_data, mock_openai):
        """Test consultation creation when OpenAI API fails."""
        # Mock OpenAI error
        mock_openai.chat.completions.create.side_effect = Exception("OpenAI service unavailable")
        
        response = client.post(
            "/api/v1/ai/consultation",
            json=sample_consultation_data,
            headers=headers
        )
        
        assert response.status_code == 500
        assert "Consultation service error" in response.json()["detail"]


class TestConsultationHistory:
    """Test consultation history functionality."""
    
    @pytest.mark.unit
    @pytest.mark.ai
    def test_get_consultations_empty(self, client: TestClient, auth_headers):
        """Test getting consultations when user has none."""
        response = client.get("/api/v1/ai/consultations", headers=auth_headers)
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) == 0
    
    @pytest.mark.unit
    @pytest.mark.ai
    def test_get_consultations_with_data(self, client: TestClient, auth_headers, test_user, db_session: Session):
        """Test getting consultations when user has consultation history."""
        # Create test consultations
        consultation1 = Consultation(
            user_id=test_user.id,
            symptoms="Headache and nausea",
            ai_analysis="Possible tension headache",
            consultation_type="symptom_analysis",
            recommendations={"rest": True},
            ayurvedic_insights={"dosha": "pitta"}
        )
        consultation2 = Consultation(
            user_id=test_user.id,
            symptoms="Fatigue and low energy",
            ai_analysis="Possible iron deficiency",
            consultation_type="general_health",
            recommendations={"iron_supplement": True},
            ayurvedic_insights={"dosha": "vata"}
        )
        
        db_session.add_all([consultation1, consultation2])
        db_session.commit()
        
        response = client.get("/api/v1/ai/consultations", headers=auth_headers)
        
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2
        
        # Verify consultation data
        consultation_symptoms = [c["symptoms"] for c in data]
        assert "Headache and nausea" in consultation_symptoms
        assert "Fatigue and low energy" in consultation_symptoms
    
    @pytest.mark.unit
    @pytest.mark.ai
    def test_get_consultations_pagination(self, client: TestClient, auth_headers, test_user, db_session: Session):
        """Test consultation history pagination."""
        # Create multiple consultations
        for i in range(15):
            consultation = Consultation(
                user_id=test_user.id,
                symptoms=f"Test symptom {i}",
                ai_analysis=f"Test analysis {i}",
                consultation_type="general_health",
                recommendations={},
                ayurvedic_insights={}
            )
            db_session.add(consultation)
        db_session.commit()
        
        # Test pagination
        response = client.get("/api/v1/ai/consultations?skip=0&limit=5", headers=auth_headers)
        
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 5
        
        # Test second page
        response2 = client.get("/api/v1/ai/consultations?skip=5&limit=5", headers=auth_headers)
        
        assert response2.status_code == 200
        data2 = response2.json()
        assert len(data2) == 5
        
        # Ensure different consultations
        first_page_ids = [c["id"] for c in data]
        second_page_ids = [c["id"] for c in data2]
        assert not set(first_page_ids).intersection(set(second_page_ids))
    
    @pytest.mark.unit
    @pytest.mark.ai
    def test_get_consultations_unauthenticated(self, client: TestClient):
        """Test getting consultations without authentication."""
        response = client.get("/api/v1/ai/consultations")
        
        assert response.status_code == 401
    
    @pytest.mark.unit
    @pytest.mark.ai
    def test_get_consultations_other_user_isolation(self, client: TestClient, auth_headers, test_user, premium_user, db_session: Session):
        """Test that users can only see their own consultations."""
        # Create consultation for premium user
        other_consultation = Consultation(
            user_id=premium_user.id,
            symptoms="Other user's symptoms",
            ai_analysis="Other user's analysis",
            consultation_type="general_health",
            recommendations={},
            ayurvedic_insights={}
        )
        db_session.add(other_consultation)
        db_session.commit()
        
        # Request consultations as test_user
        response = client.get("/api/v1/ai/consultations", headers=auth_headers)
        
        assert response.status_code == 200
        data = response.json()
        
        # Should not see other user's consultation
        for consultation in data:
            assert "Other user's symptoms" not in consultation["symptoms"]


class TestAIIntegration:
    """Integration tests for AI functionality."""
    
    @pytest.mark.integration
    @pytest.mark.ai
    def test_full_ai_consultation_flow(self, client: TestClient, auth_headers, sample_consultation_data, mock_openai, db_session: Session):
        """Test complete AI consultation flow: create → retrieve history."""
        # Step 1: Create consultation
        create_response = client.post(
            "/api/v1/ai/consultation",
            json=sample_consultation_data,
            headers=auth_headers
        )
        
        assert create_response.status_code == 200
        consultation_data = create_response.json()
        consultation_id = consultation_data["id"]
        
        # Step 2: Verify consultation in history
        history_response = client.get("/api/v1/ai/consultations", headers=auth_headers)
        
        assert history_response.status_code == 200
        history_data = history_response.json()
        assert len(history_data) == 1
        assert history_data[0]["id"] == consultation_id
        assert history_data[0]["symptoms"] == sample_consultation_data["symptoms"]
    
    @pytest.mark.integration
    @pytest.mark.ai
    def test_consultation_usage_tracking(self, client: TestClient, test_user, sample_consultation_data, mock_openai, db_session: Session):
        """Test that consultation usage is properly tracked."""
        # Login as test user
        login_data = {
            "username": test_user.email,
            "password": "testpassword123"
        }
        login_response = client.post("/api/v1/auth/login", data=login_data)
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # Initial usage should be 0
        initial_used = test_user.consultations_used
        
        # Create consultation
        response = client.post(
            "/api/v1/ai/consultation",
            json=sample_consultation_data,
            headers=headers
        )
        
        assert response.status_code == 200
        data = response.json()
        
        # Verify usage was incremented
        db_session.refresh(test_user)
        assert test_user.consultations_used == initial_used + 1
        assert data["consultations_remaining"] == test_user.consultations_limit - test_user.consultations_used