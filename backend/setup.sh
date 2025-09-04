#!/bin/bash

echo "🚀 Setting up CareBow Backend..."

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
if [ ! -f .env ]; then
    cp .env.example .env
    echo "📝 Created .env file. Please update with your API keys!"
fi

# Start services with Docker
echo "🐳 Starting database and Redis..."
docker-compose up -d db redis

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Run the application
echo "🎯 Starting CareBow API..."
python run.py