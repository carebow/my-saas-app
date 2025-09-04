#!/bin/bash

# Database SSM Tunnel Setup Script
# Creates an SSM tunnel to your RDS instance for secure access

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PROJECT_NAME="carebow"
AWS_REGION="us-east-1"

echo -e "${BLUE}🔗 Setting up Database SSM Tunnel${NC}"
echo "================================="

# Get RDS endpoint
echo -e "${YELLOW}📡 Getting RDS endpoint...${NC}"
RDS_ENDPOINT=$(aws rds describe-db-instances --db-instance-identifier "${PROJECT_NAME}-db" --query 'DBInstances[0].Endpoint.Address' --output text --region $AWS_REGION)

if [ "$RDS_ENDPOINT" = "None" ] || [ -z "$RDS_ENDPOINT" ]; then
    echo -e "${RED}❌ Could not find RDS instance ${PROJECT_NAME}-db${NC}"
    exit 1
fi

echo -e "${GREEN}✅ RDS Endpoint: $RDS_ENDPOINT${NC}"

# Get SSM instance ID
echo -e "${YELLOW}🖥️  Getting SSM instance ID...${NC}"
SSM_INSTANCE_ID=$(aws ec2 describe-instances \
    --filters "Name=tag:Name,Values=${PROJECT_NAME}-session-manager" "Name=instance-state-name,Values=running" \
    --query 'Reservations[0].Instances[0].InstanceId' \
    --output text \
    --region $AWS_REGION)

if [ "$SSM_INSTANCE_ID" = "None" ] || [ -z "$SSM_INSTANCE_ID" ]; then
    echo -e "${RED}❌ Could not find running SSM instance${NC}"
    echo -e "${YELLOW}💡 Make sure your SSM instance is running${NC}"
    exit 1
fi

echo -e "${GREEN}✅ SSM Instance ID: $SSM_INSTANCE_ID${NC}"

# Get database password
echo -e "${YELLOW}🔐 Getting database password...${NC}"
DB_PASSWORD=$(aws secretsmanager get-secret-value \
    --secret-id "${PROJECT_NAME}-db-password" \
    --query SecretString \
    --output text \
    --region $AWS_REGION)

echo -e "${GREEN}✅ Database password retrieved${NC}"

# Create .pgpass file for convenience
echo -e "${YELLOW}📝 Creating .pgpass file...${NC}"
PGPASS_FILE="$HOME/.pgpass"
PGPASS_ENTRY="localhost:5433:carebow:appuser:$DB_PASSWORD"

# Backup existing .pgpass if it exists
if [ -f "$PGPASS_FILE" ]; then
    cp "$PGPASS_FILE" "${PGPASS_FILE}.backup.$(date +%s)"
fi

# Add or update the entry
if grep -q "localhost:5433:carebow:appuser:" "$PGPASS_FILE" 2>/dev/null; then
    # Update existing entry
    sed -i.bak "s|localhost:5433:carebow:appuser:.*|$PGPASS_ENTRY|" "$PGPASS_FILE"
else
    # Add new entry
    echo "$PGPASS_ENTRY" >> "$PGPASS_FILE"
fi

chmod 600 "$PGPASS_FILE"
echo -e "${GREEN}✅ .pgpass file updated${NC}"

# Create connection script
echo -e "${YELLOW}📜 Creating connection scripts...${NC}"

# Port forward script
cat > scripts/start-db-tunnel.sh << EOF
#!/bin/bash
echo "🔗 Starting SSM port forward to RDS..."
echo "This will forward local port 5433 to RDS port 5432"
echo "Keep this terminal open while using the database connection"
echo ""
aws ssm start-session \\
    --target $SSM_INSTANCE_ID \\
    --document-name AWS-StartPortForwardingSessionToRemoteHost \\
    --parameters '{"host":["$RDS_ENDPOINT"],"portNumber":["5432"],"localPortNumber":["5433"]}' \\
    --region $AWS_REGION
EOF

# Database connection script
cat > scripts/connect-to-db.sh << EOF
#!/bin/bash
echo "🐘 Connecting to CareBow database via SSM tunnel..."
echo "Make sure the tunnel is running (scripts/start-db-tunnel.sh)"
echo ""
psql -h localhost -p 5433 -U appuser -d carebow
EOF

# Make scripts executable
chmod +x scripts/start-db-tunnel.sh
chmod +x scripts/connect-to-db.sh

echo -e "${GREEN}✅ Connection scripts created${NC}"

echo ""
echo -e "${BLUE}🎉 Setup Complete!${NC}"
echo "=================="
echo ""
echo -e "${YELLOW}To connect to your database:${NC}"
echo ""
echo -e "${CYAN}1. Start the tunnel (in one terminal):${NC}"
echo "   ./scripts/start-db-tunnel.sh"
echo ""
echo -e "${CYAN}2. Connect to database (in another terminal):${NC}"
echo "   ./scripts/connect-to-db.sh"
echo ""
echo -e "${CYAN}3. Or connect manually:${NC}"
echo "   psql -h localhost -p 5433 -U appuser -d carebow"
echo ""
echo -e "${YELLOW}Database connection details:${NC}"
echo "Host: localhost (via tunnel)"
echo "Port: 5433"
echo "Database: carebow"
echo "Username: appuser"
echo "Password: (stored in .pgpass)"
echo ""
echo -e "${YELLOW}Quick sanity checks to run in psql:${NC}"
echo "SELECT version();"
echo "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"
echo "CREATE EXTENSION IF NOT EXISTS pgcrypto;"
echo "\\dt  -- List tables"