#!/bin/bash

# Database Migration Script
# Runs Alembic migrations against RDS via SSM tunnel

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PROJECT_NAME="carebow"
AWS_REGION="us-east-1"

echo -e "${BLUE}🗄️  Running Database Migrations${NC}"
echo "==============================="

# Check if we're in the right directory
if [ ! -f "backend/alembic.ini" ]; then
    echo -e "${RED}❌ Please run this script from the project root directory${NC}"
    exit 1
fi

# Check if tunnel is running, start it if needed
echo -e "${YELLOW}🔍 Checking if SSM tunnel is active...${NC}"
if ! nc -z localhost 5433 2>/dev/null; then
    echo -e "${YELLOW}🔌 Starting SSM tunnel on port 5433...${NC}"
    
    # Get SSM instance ID
    INSTANCE_ID=$(aws ec2 describe-instances \
        --filters "Name=tag:Name,Values=${PROJECT_NAME}-session-manager" "Name=instance-state-name,Values=running" \
        --query "Reservations[0].Instances[0].InstanceId" --output text --region $AWS_REGION)
    
    if [ -z "$INSTANCE_ID" ] || [ "$INSTANCE_ID" = "None" ]; then
        echo -e "${RED}❌ No running '${PROJECT_NAME}-session-manager' instance found${NC}"
        echo -e "${YELLOW}💡 Please start the tunnel manually:${NC}"
        echo "   ./scripts/start-db-tunnel.sh"
        exit 1
    fi
    
    # Start the tunnel in background
    nohup aws ssm start-session \
        --target "$INSTANCE_ID" \
        --document-name AWS-StartPortForwardingSessionToRemoteHost \
        --parameters "{\"host\":[\"carebow-db.ccjcseo46asa.us-east-1.rds.amazonaws.com\"],\"portNumber\":[\"5432\"],\"localPortNumber\":[\"5433\"]}" \
        --region $AWS_REGION > /dev/null 2>&1 &
    
    # Wait for tunnel to be ready (timeout 30s)
    echo -e "${YELLOW}⏳ Waiting for tunnel to establish...${NC}"
    for i in {1..30}; do
        if nc -z localhost 5433 2>/dev/null; then
            echo -e "${GREEN}✅ SSM tunnel is now active${NC}"
            break
        fi
        sleep 1
    done
    
    if ! nc -z localhost 5433 2>/dev/null; then
        echo -e "${RED}❌ Could not establish SSM tunnel${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ SSM tunnel is active${NC}"
fi

# Get database password
echo -e "${YELLOW}🔐 Getting database password...${NC}"
DB_PASSWORD=$(aws secretsmanager get-secret-value \
    --secret-id "${PROJECT_NAME}-db-password" \
    --query SecretString \
    --output text \
    --region $AWS_REGION | jq -r '.password')

# Get database username
DB_USERNAME=$(aws secretsmanager get-secret-value \
    --secret-id "${PROJECT_NAME}-db-password" \
    --query SecretString \
    --output text \
    --region $AWS_REGION | jq -r '.username')

# Set up environment for migrations
export DATABASE_URL="postgresql://${DB_USERNAME}:${DB_PASSWORD}@localhost:5433/carebow"

echo -e "${YELLOW}📁 Changing to backend directory...${NC}"
cd backend

# Check current migration status
echo -e "${YELLOW}📋 Checking current migration status...${NC}"
alembic current

# Show pending migrations
echo -e "${YELLOW}📋 Showing migration history...${NC}"
alembic history

# Ask for confirmation
echo -e "${YELLOW}❓ Do you want to run migrations to head? (y/N)${NC}"
read -r response
if [[ ! "$response" =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}⏸️  Migration cancelled${NC}"
    exit 0
fi

# Run migrations
echo -e "${YELLOW}🚀 Running migrations...${NC}"
alembic upgrade head

echo -e "${GREEN}✅ Migrations completed successfully${NC}"

# Test database connection with psql
echo -e "${YELLOW}🧪 Testing database connection...${NC}"
if psql "$DATABASE_URL" -c "SELECT version();" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Database connection test successful${NC}"
else
    echo -e "${YELLOW}⚠️  Database connection test skipped (psql not available)${NC}"
fi

# Create a health check entry
echo -e "${YELLOW}🏥 Creating health check entry...${NC}"
if command -v psql > /dev/null 2>&1; then
    psql "$DATABASE_URL" -c "
        CREATE TABLE IF NOT EXISTS healthchecks (
            id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
            created_at timestamptz DEFAULT now(),
            message text
        );
        INSERT INTO healthchecks (message) VALUES ('Migration completed successfully at $(date)');
        SELECT COUNT(*) as health_check_records FROM healthchecks;
    " > /dev/null 2>&1 && echo -e "${GREEN}✅ Health check entry created${NC}" || echo -e "${YELLOW}⚠️  Health check skipped${NC}"
else
    echo -e "${YELLOW}⚠️  Health check skipped (psql not available)${NC}"
fi

echo ""
echo -e "${BLUE}🎉 Migration Complete!${NC}"
echo "====================="
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Update your ECS task definition to use the DATABASE_URL from Secrets Manager"
echo "2. Deploy your application with the new configuration"
echo "3. Test your application endpoints"
echo ""
echo -e "${CYAN}Useful commands:${NC}"
echo "# Connect to database:"
echo "./scripts/connect-to-db.sh"
echo ""
echo "# Check migration status:"
echo "cd backend && alembic current"
echo ""
echo "# Create new migration:"
echo "cd backend && alembic revision --autogenerate -m 'description'"