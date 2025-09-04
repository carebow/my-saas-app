#!/bin/bash

# Simple Database Migration Script
# Uses existing conda environment

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PROJECT_NAME="carebow"
AWS_REGION="us-east-1"

echo -e "${BLUE}🗄️  Running Simple Database Migrations${NC}"
echo "======================================"

# Kill any existing tunnels
echo -e "${YELLOW}🧹 Cleaning up existing tunnels...${NC}"
lsof -ti:5433 | xargs kill -9 2>/dev/null || true
sleep 2

# Get SSM instance ID
SSM_INSTANCE_ID=$(aws ec2 describe-instances \
    --filters "Name=tag:Name,Values=${PROJECT_NAME}-session-manager" "Name=instance-state-name,Values=running" \
    --query 'Reservations[0].Instances[0].InstanceId' \
    --output text \
    --region $AWS_REGION)

# Get RDS endpoint
RDS_ENDPOINT=$(aws rds describe-db-instances --db-instance-identifier "${PROJECT_NAME}-db" --query 'DBInstances[0].Endpoint.Address' --output text --region $AWS_REGION)

# Get database password
DB_PASSWORD=$(aws secretsmanager get-secret-value \
    --secret-id "${PROJECT_NAME}-db-password" \
    --query SecretString \
    --output text \
    --region $AWS_REGION)

# Start tunnel in background
echo -e "${YELLOW}🔗 Starting SSM tunnel...${NC}"
aws ssm start-session \
    --target $SSM_INSTANCE_ID \
    --document-name AWS-StartPortForwardingSessionToRemoteHost \
    --parameters "{\"host\":[\"$RDS_ENDPOINT\"],\"portNumber\":[\"5432\"],\"localPortNumber\":[\"5433\"]}" \
    --region $AWS_REGION &

TUNNEL_PID=$!

# Cleanup function
cleanup() {
    echo -e "${YELLOW}🧹 Cleaning up tunnel...${NC}"
    kill $TUNNEL_PID 2>/dev/null || true
    lsof -ti:5433 | xargs kill -9 2>/dev/null || true
    sleep 2
}

# Set trap to cleanup on exit
trap cleanup EXIT

# Wait for tunnel to be ready
echo -e "${YELLOW}⏳ Waiting for tunnel to be ready...${NC}"
for i in {1..30}; do
    if nc -z localhost 5433 2>/dev/null; then
        echo -e "${GREEN}✅ Tunnel is ready${NC}"
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "${RED}❌ Tunnel failed to start${NC}"
        exit 1
    fi
    sleep 2
done

# Set up environment for migrations
export DATABASE_URL="postgresql://appuser:${DB_PASSWORD}@localhost:5433/carebow"

echo -e "${YELLOW}📁 Changing to backend directory...${NC}"
cd backend

# Run migrations using conda environment
echo -e "${YELLOW}🚀 Running migrations...${NC}"
alembic upgrade head

echo -e "${GREEN}✅ Migrations completed successfully${NC}"

# Test database connection
echo -e "${YELLOW}🧪 Testing database connection...${NC}"
python << EOF
import psycopg2
import os

try:
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cursor = conn.cursor()
    
    # Test basic functionality
    cursor.execute("SELECT version();")
    version = cursor.fetchone()[0]
    print(f"✅ Database version: {version}")
    
    # List tables
    cursor.execute("SELECT tablename FROM pg_tables WHERE schemaname = 'public';")
    tables = cursor.fetchall()
    print(f"✅ Tables: {[table[0] for table in tables]}")
    
    cursor.close()
    conn.close()
    print("✅ Database connection test successful")
    
except Exception as e:
    print(f"❌ Database connection test failed: {e}")
    exit(1)
EOF

echo ""
echo -e "${BLUE}🎉 Simple Migration Complete!${NC}"
echo "============================="