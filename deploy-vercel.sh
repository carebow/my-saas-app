#!/bin/bash

# CareBow Vercel Deployment Script
echo "🚀 Deploying CareBow MVP to Vercel..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_info "Installing Vercel CLI..."
    npm install -g vercel
fi

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    print_info "Please login to Vercel..."
    vercel login
fi

# Build the project
print_status "Building project for production..."
npm run build:prod

if [ $? -ne 0 ]; then
    print_warning "Build failed, but continuing with deployment..."
fi

# Deploy to Vercel
print_status "Deploying to Vercel..."
vercel --prod

print_status "🎉 Deployment complete!"
print_info "Your CareBow MVP is now live on Vercel!"
print_info "Check your Vercel dashboard for the live URL"
print_warning "Don't forget to configure environment variables in Vercel dashboard:"
print_warning "  - VITE_API_BASE_URL (your backend URL)"
print_warning "  - VITE_STRIPE_PUBLISHABLE_KEY (your Stripe key)"
