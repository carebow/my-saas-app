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
