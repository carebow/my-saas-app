# CareBow Backend API

FastAPI-based backend for the CareBow AI Health Assistant SaaS platform.

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Docker & Docker Compose
- PostgreSQL (or use Docker)
- Redis (or use Docker)

### Setup

1. **Clone and navigate to backend:**
```bash
cd backend
```

2. **Run setup script:**
```bash
./setup.sh
```

3. **Or manual setup:**
```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Start database and Redis
docker-compose up -d db redis

# Run the API
python run.py
```

### Environment Variables

Update `.env` with your API keys:

```env
# Required
OPENAI_API_KEY=your-openai-api-key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Optional
DATABASE_URL=postgresql://carebow_user:carebow_password@localhost:5432/carebow_db
SECRET_KEY=your-super-secret-jwt-key
```

## 📚 API Documentation

Once running, visit:
- **API Docs:** http://localhost:8000/docs
- **Health Check:** http://localhost:8000/health

## 🏗️ Architecture

```
backend/
├── app/
│   ├── api/           # API routes
│   ├── core/          # Core functionality (auth, config)
│   ├── db/            # Database setup
│   ├── models/        # SQLAlchemy models
│   └── schemas/       # Pydantic schemas
├── main.py            # FastAPI app
└── requirements.txt   # Dependencies
```

## 🔐 Authentication

- **JWT-based authentication**
- **Registration:** `POST /api/v1/auth/register`
- **Login:** `POST /api/v1/auth/login`
- **Protected routes** require `Authorization: Bearer <token>`

## 🤖 AI Features

- **Chat:** `POST /api/v1/ai/chat`
- **Consultations:** `POST /api/v1/ai/consultation`
- **History:** `GET /api/v1/ai/consultations`

## 💳 Subscription Management

- **Stripe integration** for payments
- **Tiered subscriptions:** Free, Basic, Premium
- **Usage limits** based on subscription tier

## 🏥 Health Data

- **Health profiles** with Ayurvedic analysis
- **Health metrics** tracking
- **Consultation history**

## 🚀 Deployment

### Docker
```bash
docker-compose up -d
```

### Production
```bash
# Set production environment variables
export DATABASE_URL=your-production-db-url
export SECRET_KEY=your-production-secret

# Run with Gunicorn
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```

## 🔧 Development

### Database Migrations
```bash
# Install Alembic
pip install alembic

# Initialize migrations
alembic init alembic

# Create migration
alembic revision --autogenerate -m "Initial migration"

# Apply migrations
alembic upgrade head
```

### Testing
```bash
pip install pytest pytest-asyncio httpx
pytest
```

## 📊 Monitoring

- **Health endpoint:** `/health`
- **Metrics:** Built-in FastAPI metrics
- **Logging:** Structured logging with uvicorn

## 🔒 Security

- **JWT tokens** with expiration
- **Password hashing** with bcrypt
- **CORS protection**
- **Input validation** with Pydantic
- **SQL injection protection** with SQLAlchemy

## 🤝 Integration with Frontend

Your React app should connect to:
```typescript
const API_BASE_URL = 'http://localhost:8000/api/v1';
```

See `src/services/api.ts` for the complete API client.