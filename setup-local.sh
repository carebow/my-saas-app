#!/bin/bash

# CareBow Local Development Setup Script
# This script automates the setup process for running CareBow locally

set -e  # Exit on any error

echo "🚀 CareBow Local Development Setup"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
print_status "Checking prerequisites..."

# Check Node.js
if command_exists node; then
    NODE_VERSION=$(node --version)
    print_success "Node.js found: $NODE_VERSION"
else
    print_error "Node.js not found. Please install Node.js v18+ from https://nodejs.org/"
    exit 1
fi

# Check Python
if command_exists python3; then
    PYTHON_VERSION=$(python3 --version)
    print_success "Python found: $PYTHON_VERSION"
    PYTHON_CMD="python3"
elif command_exists python; then
    PYTHON_VERSION=$(python --version)
    print_success "Python found: $PYTHON_VERSION"
    PYTHON_CMD="python"
else
    print_error "Python not found. Please install Python 3.9+ from https://python.org/"
    exit 1
fi

# Check PostgreSQL
if command_exists psql; then
    POSTGRES_VERSION=$(psql --version)
    print_success "PostgreSQL found: $POSTGRES_VERSION"
else
    print_error "PostgreSQL not found. Please install PostgreSQL from https://postgresql.org/"
    exit 1
fi

# Check Redis
if command_exists redis-cli; then
    print_success "Redis CLI found"
else
    print_warning "Redis CLI not found. Please install Redis from https://redis.io/"
    print_status "Continuing setup - you can install Redis later..."
fi

# Step 1: Environment Configuration
print_status "Setting up environment configuration..."

if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        cp .env.example .env
        print_success "Created .env file from .env.example"
        
        # Generate a random secret key
        SECRET_KEY=$(openssl rand -base64 32 2>/dev/null || $PYTHON_CMD -c "import secrets; print(secrets.token_urlsafe(32))")
        
        # Update .env with local development settings
        sed -i.bak "s|your-super-secret-jwt-key-change-this-in-production-min-32-chars|$SECRET_KEY|g" .env
        sed -i.bak "s|postgresql://carebow_user:your_password@localhost:5432/carebow_db|postgresql://carebow_user:carebow_pass@localhost:5432/carebow_db|g" .env
        
        print_success "Updated .env with local development settings"
        rm .env.bak 2>/dev/null || true
    else
        print_error ".env.example file not found!"
        exit 1
    fi
else
    print_warning ".env file already exists, skipping creation"
fi

# Step 2: Database Setup
print_status "Setting up PostgreSQL database..."

# Check if PostgreSQL is running
if pg_isready -h localhost -p 5432 >/dev/null 2>&1; then
    print_success "PostgreSQL is running"
    
    # Create database and user
    print_status "Creating database and user..."
    
    # Check if database exists
    if psql -U postgres -lqt | cut -d \| -f 1 | grep -qw carebow_db; then
        print_warning "Database 'carebow_db' already exists"
    else
        psql -U postgres -c "CREATE USER carebow_user WITH PASSWORD 'carebow_pass';" 2>/dev/null || print_warning "User 'carebow_user' may already exist"
        psql -U postgres -c "CREATE DATABASE carebow_db OWNER carebow_user;" 2>/dev/null || print_warning "Database 'carebow_db' may already exist"
        psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE carebow_db TO carebow_user;" >/dev/null 2>&1
        print_success "Database setup completed"
    fi
else
    print_error "PostgreSQL is not running. Please start PostgreSQL service:"
    print_status "  macOS: brew services start postgresql"
    print_status "  Linux: sudo systemctl start postgresql"
    print_status "  Windows: Start PostgreSQL from Services"
    exit 1
fi

# Step 3: Redis Setup (optional)
print_status "Checking Redis setup..."

if command_exists redis-cli; then
    if redis-cli ping >/dev/null 2>&1; then
        print_success "Redis is running"
    else
        print_warning "Redis is not running. Please start Redis service:"
        print_status "  macOS: brew services start redis"
        print_status "  Linux: sudo systemctl start redis-server"
        print_status "  Windows: Start Redis manually"
    fi
fi

# Step 4: Backend Setup
print_status "Setting up Python backend..."

cd backend

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    print_status "Creating Python virtual environment..."
    $PYTHON_CMD -m venv venv
    print_success "Virtual environment created"
else
    print_warning "Virtual environment already exists"
fi

# Activate virtual environment
print_status "Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
print_status "Upgrading pip..."
pip install --upgrade pip >/dev/null 2>&1

# Install dependencies
print_status "Installing Python dependencies..."
pip install -r requirements.txt

print_success "Python dependencies installed"

# Run database migrations
print_status "Running database migrations..."
if alembic upgrade head; then
    print_success "Database migrations completed"
else
    print_warning "Database migrations failed - this might be normal for first setup"
fi

# Go back to project root
cd ..

# Step 5: Frontend Setup
print_status "Setting up Node.js frontend..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    print_status "Installing Node.js dependencies..."
    npm install
    print_success "Node.js dependencies installed"
else
    print_warning "node_modules already exists, skipping npm install"
    print_status "Run 'npm install' manually if you need to update dependencies"
fi

# Step 6: Create startup scripts
print_status "Creating startup scripts..."

# Backend startup script
cat > start-backend.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting CareBow Backend..."
cd backend
source venv/bin/activate
python run.py
EOF

# Frontend startup script
cat > start-frontend.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting CareBow Frontend..."
npm run dev
EOF

# Make scripts executable
chmod +x start-backend.sh start-frontend.sh

print_success "Startup scripts created"

# Final instructions
echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
print_success "CareBow is now ready for local development!"
echo ""
echo "📋 Next Steps:"
echo "1. Start the backend server:"
echo "   ${BLUE}./start-backend.sh${NC}"
echo ""
echo "2. In a new terminal, start the frontend:"
echo "   ${BLUE}./start-frontend.sh${NC}"
echo ""
echo "3. Open your browser to:"
echo "   ${BLUE}http://localhost:5173${NC} (Frontend)"
echo "   ${BLUE}http://localhost:8000/docs${NC} (API Documentation)"
echo ""
echo "🔧 Development URLs:"
echo "   Frontend: http://localhost:5173"
echo "   Backend API: http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"
echo ""
echo "📚 Documentation:"
echo "   - LOCAL_SETUP_GUIDE.md - Detailed setup instructions"
echo "   - COMPREHENSIVE_PROJECT_ANALYSIS.md - Technical analysis"
echo "   - PRODUCTION_READINESS_GAP_ANALYSIS.md - Production roadmap"
echo ""
print_warning "Note: Some features require API keys (OpenAI, Stripe) in your .env file"
echo ""
print_success "Happy coding! 🚀"
