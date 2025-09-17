#!/bin/bash

# CareBow Production Deployment Script
echo "🚀 Deploying CareBow MVP to Production..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

print_status "Starting production deployment..."

# Step 1: Build Frontend for Production
print_status "Building frontend for production..."
npm run build:prod
if [ $? -ne 0 ]; then
    print_error "Frontend build failed"
    exit 1
fi

# Step 2: Create Production Environment Files
print_status "Creating production environment files..."

# Backend production config
cat > backend/.env.production << 'EOF'
# CareBow Production Environment
ENVIRONMENT=production
SECRET_KEY=carebow-production-secret-key-2024-change-this-in-production
DATABASE_URL=postgresql://user:pass@host:port/dbname
HIPAA_ENCRYPTION_KEY=carebow-hipaa-encryption-key-32chars-2024

# API Keys (REPLACE WITH YOUR ACTUAL KEYS)
OPENAI_API_KEY=sk-your-openai-api-key-here
STRIPE_SECRET_KEY=sk_live_your-stripe-secret-key-here
STRIPE_PUBLISHABLE_KEY=pk_live_your-stripe-publishable-key-here

# Email Configuration
SMTP_TLS=true
SMTP_PORT=587
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAILS_FROM_EMAIL=noreply@carebow.com
EMAILS_FROM_NAME=CareBow Health Assistant

# CORS Configuration (UPDATE WITH YOUR DOMAINS)
BACKEND_CORS_ORIGINS=https://your-app.vercel.app,https://carebow.com
ALLOWED_HOSTS=your-app.vercel.app,carebow.com

# Redis Configuration
REDIS_URL=redis://localhost:6379

# Sentry Configuration (Optional)
SENTRY_DSN=
EOF

# Frontend production config
cat > .env.production << 'EOF'
# Frontend Production Environment
VITE_API_BASE_URL=https://your-backend.railway.app
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your-stripe-publishable-key-here
VITE_ENVIRONMENT=production
VITE_APP_VERSION=1.0.0
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEBUG=false
EOF

# Step 3: Create Railway Configuration
print_status "Creating Railway configuration..."
cat > backend/railway.json << 'EOF'
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "python run.py",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
EOF

# Step 4: Create Vercel Configuration
print_status "Creating Vercel configuration..."
cat > vercel.json << 'EOF'
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "VITE_API_BASE_URL": "@vite_api_base_url",
    "VITE_STRIPE_PUBLISHABLE_KEY": "@vite_stripe_publishable_key"
  }
}
EOF

# Step 5: Create Deployment Instructions
print_status "Creating deployment instructions..."
cat > DEPLOYMENT_INSTRUCTIONS.md << 'EOF'
# 🚀 CareBow Production Deployment Instructions

## Your MVP is Ready for Production!

### 🎯 Quick Deploy Options:

#### Option 1: Railway + Vercel (Recommended - 10 minutes)
1. **Deploy Backend to Railway:**
   - Go to https://railway.app
   - Sign up with GitHub
   - Create new project from GitHub repo
   - Railway will auto-detect FastAPI
   - Add environment variables from backend/.env.production

2. **Deploy Frontend to Vercel:**
   - Go to https://vercel.com
   - Sign up with GitHub
   - Import your repository
   - Framework: Vite
   - Build Command: npm run build:prod
   - Output Directory: dist
   - Add environment variables from .env.production

#### Option 2: Railway Full-Stack (Easiest - 5 minutes)
1. **Deploy Everything to Railway:**
   - Go to https://railway.app
   - Create new project
   - Add both frontend and backend services
   - Railway handles everything automatically

### 🔧 Required API Keys:

#### OpenAI API Key (for AI responses):
1. Get from: https://platform.openai.com/api-keys
2. Add to Railway environment variables
3. Cost: ~$0.01-0.10 per consultation

#### Stripe API Keys (for payments):
1. Get from: https://dashboard.stripe.com/apikeys
2. Add both secret and publishable keys
3. Cost: 2.9% + $0.30 per transaction

### 📊 Production URLs:
- **Frontend**: https://your-app.vercel.app
- **Backend**: https://your-backend.railway.app
- **API Docs**: https://your-backend.railway.app/docs

### 💰 Monthly Costs:
- **Railway**: $5/month (unlimited usage)
- **Vercel**: Free tier available
- **Total**: $5-25/month

### 🧪 Testing Your Live App:
1. Visit your frontend URL
2. Register a new account
3. Login and try AI chat
4. Test complete user flow

### 🎉 You're Live!
Your CareBow AI health assistant is now helping real users!

EOF

# Step 6: Create Quick Deploy Commands
print_status "Creating quick deploy commands..."
cat > quick-deploy.sh << 'EOF'
#!/bin/bash
echo "🚀 Quick Deploy to Railway + Vercel"

# Install CLI tools
echo "Installing CLI tools..."
npm install -g @railway/cli vercel

# Deploy to Railway
echo "Deploying backend to Railway..."
cd backend
railway login
railway up

# Deploy to Vercel
echo "Deploying frontend to Vercel..."
cd ..
vercel login
vercel --prod

echo "🎉 Deployment complete!"
echo "Check your Railway and Vercel dashboards for URLs"
EOF

chmod +x quick-deploy.sh

print_status "Production deployment preparation complete!"
print_warning "IMPORTANT: Update API keys in the environment files before deploying"
print_warning "Files created:"
print_warning "  - backend/.env.production (backend config)"
print_warning "  - .env.production (frontend config)"
print_warning "  - railway.json (Railway config)"
print_warning "  - vercel.json (Vercel config)"
print_warning "  - DEPLOYMENT_INSTRUCTIONS.md (deployment guide)"
print_warning "  - quick-deploy.sh (automated deployment)"

echo ""
print_info "🎯 Next Steps:"
print_info "1. Update API keys in the .env files"
print_info "2. Run: ./quick-deploy.sh"
print_info "3. Or follow DEPLOYMENT_INSTRUCTIONS.md"
print_info "4. Test your live app!"

echo ""
print_status "🎉 Your CareBow MVP is ready for production deployment!"
print_status "Go help some real users with their health questions! 🚀"
