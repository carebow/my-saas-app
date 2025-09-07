# 🚀 CareBow Local Development Setup Guide

This guide will help you run the CareBow application locally on your machine.

## 📋 Prerequisites

Before starting, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **Python** (v3.9 or higher) - [Download here](https://python.org/)
- **PostgreSQL** (v13 or higher) - [Download here](https://postgresql.org/)
- **Redis** (v6 or higher) - [Download here](https://redis.io/)
- **Git** - [Download here](https://git-scm.com/)

## 🔧 Quick Setup (Automated)

Run this command to set up everything automatically:

```bash
# Make the setup script executable and run it
chmod +x setup-local.sh
./setup-local.sh
```

## 📝 Manual Setup (Step by Step)

### Step 1: Environment Configuration

1. **Copy environment file:**
```bash
cp .env.example .env
```

2. **Edit the .env file with your local settings:**
```bash
# Minimal configuration for local development
ENVIRONMENT=development
DATABASE_URL=postgresql://carebow_user:carebow_pass@localhost:5432/carebow_db
REDIS_URL=redis://localhost:6379/0
SECRET_KEY=your-local-secret-key-min-32-characters-long
OPENAI_API_KEY=sk-your-openai-key-here  # Optional for basic testing
STRIPE_SECRET_KEY=sk_test_your-stripe-key  # Optional for payment testing
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

### Step 2: Database Setup

1. **Start PostgreSQL service:**
```bash
# macOS (with Homebrew)
brew services start postgresql

# Ubuntu/Debian
sudo systemctl start postgresql

# Windows
# Start PostgreSQL from Services or pgAdmin
```

2. **Create database and user:**
```bash
# Connect to PostgreSQL
psql -U postgres

# Create user and database
CREATE USER carebow_user WITH PASSWORD 'carebow_pass';
CREATE DATABASE carebow_db OWNER carebow_user;
GRANT ALL PRIVILEGES ON DATABASE carebow_db TO carebow_user;
\q
```

### Step 3: Redis Setup

1. **Start Redis service:**
```bash
# macOS (with Homebrew)
brew services start redis

# Ubuntu/Debian
sudo systemctl start redis-server

# Windows
# Download and run Redis from GitHub releases
```

2. **Verify Redis is running:**
```bash
redis-cli ping
# Should return: PONG
```

### Step 4: Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Create Python virtual environment:**
```bash
python -m venv venv

# Activate virtual environment
# macOS/Linux:
source venv/bin/activate
# Windows:
venv\Scripts\activate
```

3. **Install Python dependencies:**
```bash
pip install -r requirements.txt
```

4. **Run database migrations:**
```bash
alembic upgrade head
```

5. **Start the backend server:**
```bash
python run.py
```

The backend API will be available at: http://localhost:8000

### Step 5: Frontend Setup

1. **Open a new terminal and navigate to project root:**
```bash
cd /path/to/my-saas-app
```

2. **Install Node.js dependencies:**
```bash
npm install
```

3. **Start the frontend development server:**
```bash
npm run dev
```

The frontend will be available at: http://localhost:5173

## 🧪 Testing the Setup

### Backend API Test
```bash
# Test backend health
curl http://localhost:8000/health

# Expected response:
{"status":"healthy"}
```

### Frontend Test
1. Open your browser to http://localhost:5173
2. You should see the CareBow homepage
3. Try navigating to different pages

### Database Test
```bash
# Connect to the database
psql -U carebow_user -d carebow_db -h localhost

# List tables
\dt

# Exit
\q
```

## 🔍 Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Kill process on port 8000 (backend)
lsof -ti:8000 | xargs kill -9

# Kill process on port 5173 (frontend)
lsof -ti:5173 | xargs kill -9
```

#### 2. Database Connection Error
```bash
# Check if PostgreSQL is running
pg_isready -h localhost -p 5432

# Restart PostgreSQL
brew services restart postgresql  # macOS
sudo systemctl restart postgresql  # Linux
```

#### 3. Redis Connection Error
```bash
# Check if Redis is running
redis-cli ping

# Restart Redis
brew services restart redis  # macOS
sudo systemctl restart redis-server  # Linux
```

#### 4. Python Dependencies Error
```bash
# Upgrade pip and try again
pip install --upgrade pip
pip install -r requirements.txt
```

#### 5. Node Dependencies Error
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## 🚀 Development Workflow

### Starting Development Session
```bash
# Terminal 1: Backend
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python run.py

# Terminal 2: Frontend
npm run dev

# Terminal 3: Database (if needed)
psql -U carebow_user -d carebow_db -h localhost
```

### Running Tests
```bash
# Backend tests
cd backend
python run_tests.py all

# Frontend tests (if available)
npm test
```

### Code Quality Checks
```bash
# Frontend linting
npm run lint

# Backend formatting (if black is installed)
cd backend
black .
```

## 📊 Development URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs (Swagger UI)
- **Alternative API Docs**: http://localhost:8000/redoc

## 🔧 Optional Enhancements

### 1. Install Development Tools
```bash
# Backend code formatting
pip install black isort

# Frontend development tools
npm install -g @typescript-eslint/parser
```

### 2. Database GUI (Optional)
- **pgAdmin**: Web-based PostgreSQL administration
- **DBeaver**: Universal database tool
- **TablePlus**: Modern database management tool

### 3. Redis GUI (Optional)
- **RedisInsight**: Official Redis GUI
- **Redis Commander**: Web-based Redis management

## 🎯 Next Steps

Once you have the application running locally:

1. **Explore the codebase** - Familiarize yourself with the project structure
2. **Test core features** - Try user registration, login, and basic functionality
3. **Set up API keys** - Add real OpenAI and Stripe keys for full functionality
4. **Review documentation** - Check out the comprehensive analysis reports
5. **Start development** - Begin implementing missing features from the gap analysis

## 📞 Getting Help

If you encounter issues:

1. **Check the logs** - Both backend and frontend terminals show helpful error messages
2. **Review environment variables** - Ensure all required variables are set in `.env`
3. **Verify services** - Make sure PostgreSQL and Redis are running
4. **Check ports** - Ensure ports 8000, 5173, 5432, and 6379 are available

---

**🎉 You're now ready to develop CareBow locally!**

The application should be running with a modern React frontend connected to a FastAPI backend with PostgreSQL database and Redis caching.
