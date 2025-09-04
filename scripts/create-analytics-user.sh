#!/bin/bash

# Analytics User Setup Script
# Creates a read-only database user for dashboards and analytics

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PROJECT_NAME="carebow"
AWS_REGION="us-east-1"

echo -e "${BLUE}📊 Creating Analytics Database User${NC}"
echo "=================================="

# Check if tunnel is running
echo -e "${YELLOW}🔍 Checking if SSM tunnel is active...${NC}"
if ! nc -z localhost 5433 2>/dev/null; then
    echo -e "${RED}❌ SSM tunnel not detected on port 5433${NC}"
    echo -e "${YELLOW}💡 Please start the tunnel first:${NC}"
    echo "   ./scripts/start-db-tunnel.sh"
    exit 1
fi

echo -e "${GREEN}✅ SSM tunnel is active${NC}"

# Generate a strong password for analytics user
echo -e "${YELLOW}🔐 Generating analytics user password...${NC}"
ANALYTICS_PASSWORD=$(openssl rand -base64 32)

# Get admin database password
DB_PASSWORD=$(aws secretsmanager get-secret-value \
    --secret-id "${PROJECT_NAME}-db-password" \
    --query SecretString \
    --output text \
    --region $AWS_REGION)

# Create the analytics user
echo -e "${YELLOW}👤 Creating analytics user...${NC}"
PGPASSWORD="$DB_PASSWORD" psql -h localhost -p 5433 -U appuser -d carebow << EOF
-- Create analytics role
CREATE ROLE analytics LOGIN PASSWORD '$ANALYTICS_PASSWORD';

-- Grant connect permission
GRANT CONNECT ON DATABASE carebow TO analytics;

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO analytics;

-- Grant select on all existing tables
GRANT SELECT ON ALL TABLES IN SCHEMA public TO analytics;

-- Grant select on all future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO analytics;

-- Grant usage on sequences (for reading sequence values)
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO analytics;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE ON SEQUENCES TO analytics;

-- Verify the user was created
SELECT rolname, rolcanlogin, rolsuper FROM pg_roles WHERE rolname = 'analytics';

-- Show granted permissions
SELECT 
    schemaname,
    tablename,
    privilege_type
FROM information_schema.table_privileges 
WHERE grantee = 'analytics'
ORDER BY schemaname, tablename;
EOF

echo -e "${GREEN}✅ Analytics user created successfully${NC}"

# Store analytics credentials in Secrets Manager
echo -e "${YELLOW}🔐 Storing analytics credentials in Secrets Manager...${NC}"

ANALYTICS_SECRETS=$(jq -n \
    --arg username "analytics" \
    --arg password "$ANALYTICS_PASSWORD" \
    --arg host "localhost" \
    --arg port "5433" \
    --arg database "carebow" \
    '{
        username: $username,
        password: $password,
        host: $host,
        port: $port,
        database: $database,
        connection_string: "postgresql://\($username):\($password)@\($host):\($port)/\($database)"
    }')

# Create or update analytics secrets
if aws secretsmanager describe-secret --secret-id "${PROJECT_NAME}-analytics-credentials" --region $AWS_REGION >/dev/null 2>&1; then
    echo -e "${YELLOW}📝 Updating existing analytics credentials...${NC}"
    aws secretsmanager update-secret \
        --secret-id "${PROJECT_NAME}-analytics-credentials" \
        --secret-string "$ANALYTICS_SECRETS" \
        --region $AWS_REGION
else
    echo -e "${YELLOW}🆕 Creating analytics credentials secret...${NC}"
    aws secretsmanager create-secret \
        --name "${PROJECT_NAME}-analytics-credentials" \
        --description "Read-only database credentials for analytics and dashboards" \
        --secret-string "$ANALYTICS_SECRETS" \
        --region $AWS_REGION
fi

echo -e "${GREEN}✅ Analytics credentials stored in Secrets Manager${NC}"

# Test the analytics user connection
echo -e "${YELLOW}🧪 Testing analytics user connection...${NC}"
PGPASSWORD="$ANALYTICS_PASSWORD" psql -h localhost -p 5433 -U analytics -d carebow << EOF
-- Test basic read access
SELECT 'Analytics user connection successful' as status;

-- Show available tables
SELECT schemaname, tablename 
FROM information_schema.tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- Test a simple query (if tables exist)
SELECT COUNT(*) as total_tables 
FROM information_schema.tables 
WHERE schemaname = 'public';
EOF

echo -e "${GREEN}✅ Analytics user connection test successful${NC}"

# Create connection helper script
echo -e "${YELLOW}📜 Creating analytics connection script...${NC}"
cat > scripts/connect-analytics.sh << EOF
#!/bin/bash
echo "📊 Connecting to CareBow database as analytics user..."
echo "This is a READ-ONLY connection for analytics and reporting"
echo ""

# Get analytics password from Secrets Manager
ANALYTICS_PASSWORD=\$(aws secretsmanager get-secret-value \\
    --secret-id "${PROJECT_NAME}-analytics-credentials" \\
    --query 'SecretString' \\
    --output text \\
    --region $AWS_REGION | jq -r '.password')

PGPASSWORD="\$ANALYTICS_PASSWORD" psql -h localhost -p 5433 -U analytics -d carebow
EOF

chmod +x scripts/connect-analytics.sh

echo ""
echo -e "${BLUE}🎉 Analytics User Setup Complete!${NC}"
echo "================================="
echo ""
echo -e "${YELLOW}Analytics user details:${NC}"
echo "Username: analytics"
echo "Database: carebow"
echo "Permissions: READ-ONLY on all tables"
echo ""
echo -e "${YELLOW}Connection methods:${NC}"
echo ""
echo -e "${CYAN}1. Using helper script (recommended):${NC}"
echo "   ./scripts/connect-analytics.sh"
echo ""
echo -e "${CYAN}2. Manual connection:${NC}"
echo "   # Get password from Secrets Manager:"
echo "   aws secretsmanager get-secret-value --secret-id ${PROJECT_NAME}-analytics-credentials --query 'SecretString' --output text | jq -r '.password'"
echo "   # Then connect:"
echo "   PGPASSWORD='<password>' psql -h localhost -p 5433 -U analytics -d carebow"
echo ""
echo -e "${CYAN}3. Connection string for BI tools:${NC}"
echo "   postgresql://analytics:<password>@localhost:5433/carebow"
echo ""
echo -e "${YELLOW}Security notes:${NC}"
echo "✓ Analytics user has READ-ONLY access"
echo "✓ Cannot create, modify, or delete data"
echo "✓ Cannot create or drop tables"
echo "✓ Password stored securely in AWS Secrets Manager"
echo ""
echo -e "${YELLOW}Use cases:${NC}"
echo "• Business intelligence dashboards"
echo "• Data analysis and reporting"
echo "• Grafana/Metabase connections"
echo "• Data exports and backups"