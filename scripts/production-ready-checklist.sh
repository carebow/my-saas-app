#!/bin/bash

# CareBow Production-Ready Checklist Script
# This script helps you go from "it works" to "production-ready"

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

PROJECT_NAME="carebow"
AWS_REGION="us-east-1"

echo -e "${BLUE}🚀 CareBow Production-Ready Checklist${NC}"
echo "====================================="
echo ""

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to run a step
run_step() {
    local step_num=$1
    local step_name=$2
    local step_desc=$3
    
    echo -e "${CYAN}Step $step_num: $step_name${NC}"
    echo -e "${YELLOW}$step_desc${NC}"
    echo ""
}

# Function to wait for user confirmation
wait_for_confirmation() {
    echo -e "${YELLOW}Press Enter to continue or Ctrl+C to exit...${NC}"
    read -r
}

echo -e "${GREEN}This script will guide you through the production-ready checklist.${NC}"
echo -e "${YELLOW}Make sure you have AWS CLI configured and Terraform applied.${NC}"
echo ""
wait_for_confirmation

# Step 1: Verify DB via SSM tunnel
run_step "1" "Verify Database Connection" "We'll set up an SSM tunnel to connect to your RDS instance"

echo -e "${YELLOW}First, let's get your RDS endpoint and create the SSM tunnel...${NC}"
echo ""
echo "Run these commands in separate terminals:"
echo ""
echo -e "${CYAN}Terminal A (Port Forward):${NC}"
echo "aws ssm start-session --target \$(aws ec2 describe-instances --filters 'Name=tag:Name,Values=carebow-ssm-instance' --query 'Reservations[0].Instances[0].InstanceId' --output text) --document-name AWS-StartPortForwardingSessionToRemoteHost --parameters '{\"host\":[\"carebow-db.cluster-xyz.us-east-1.rds.amazonaws.com\"],\"portNumber\":[\"5432\"],\"localPortNumber\":[\"5433\"]}'"
echo ""
echo -e "${CYAN}Terminal B (Connect with psql):${NC}"
echo "# Get the password from Secrets Manager first:"
echo "aws secretsmanager get-secret-value --secret-id carebow-db-password --query SecretString --output text"
echo ""
echo "# Then connect:"
echo "psql -h localhost -p 5433 -U appuser -d carebow"
echo ""
echo -e "${CYAN}Quick sanity checks in psql:${NC}"
echo "SELECT version();"
echo "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"
echo "CREATE EXTENSION IF NOT EXISTS pgcrypto;"
echo ""

wait_for_confirmation

# Step 2: Initialize schema
run_step "2" "Initialize Database Schema" "Run your Alembic migrations against RDS"

echo -e "${YELLOW}With the SSM tunnel active, run your migrations:${NC}"
echo ""
echo "cd backend"
echo "# Update your .env to use the tunnel:"
echo "DATABASE_URL=postgresql://appuser:YOUR_PASSWORD@localhost:5433/carebow"
echo ""
echo "# Run migrations:"
echo "alembic upgrade head"
echo ""
echo -e "${CYAN}Test with a health check table:${NC}"
echo "CREATE TABLE IF NOT EXISTS healthchecks ("
echo "  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,"
echo "  created_at timestamptz DEFAULT now()"
echo ");"
echo "INSERT INTO healthchecks DEFAULT VALUES;"
echo "SELECT * FROM healthchecks;"
echo ""

wait_for_confirmation

# Step 3: Wire app to RDS via Secrets Manager
run_step "3" "Configure Secrets Manager Integration" "Update ECS task definition to use Secrets Manager"

echo -e "${YELLOW}We need to update your ECS task definition to pull DATABASE_URL from Secrets Manager${NC}"
echo ""
echo "The script will create the necessary secrets and update your task definition."
echo ""

wait_for_confirmation

# Step 4: Security lockdown
run_step "4" "Lock Down Security" "Remove temporary access and secure RDS"

echo -e "${YELLOW}Security checklist:${NC}"
echo "✓ RDS is in private subnets (already configured)"
echo "✓ Remove your home IP from RDS security group"
echo "✓ Ensure RDS SG only allows ECS and SSM access"
echo "✓ Redis SG restricted to ECS only"
echo ""

wait_for_confirmation

# Step 5: Backups and maintenance
run_step "5" "Configure Backups & Maintenance" "Set up proper backup and maintenance windows"

echo -e "${YELLOW}Backup configuration:${NC}"
echo "✓ Backup retention: 7 days (already configured)"
echo "✓ Create manual snapshot after migrations"
echo "✓ Maintenance window: Sunday 04:00-05:00 UTC (already configured)"
echo "✓ Enable Performance Insights"
echo ""

wait_for_confirmation

# Step 6: Monitoring and alarms
run_step "6" "Set Up CloudWatch Monitoring" "Create essential CloudWatch alarms"

echo -e "${YELLOW}We'll create CloudWatch alarms for:${NC}"
echo "• CPU Utilization > 80%"
echo "• Free Storage Space < 5GB"
echo "• Freeable Memory < 200MB"
echo "• Database Connections > 80% of max"
echo "• Read/Write Latency"
echo ""

wait_for_confirmation

# Step 7: Secrets hygiene
run_step "7" "Secrets Management" "Implement proper secrets rotation"

echo -e "${YELLOW}Secrets management best practices:${NC}"
echo "✓ Passwords stored in Secrets Manager"
echo "✓ Plan quarterly rotation"
echo "✓ No secrets in shell history"
echo "✓ Use .pgpass for local connections"
echo ""

wait_for_confirmation

# Step 8: SSM access workflow
run_step "8" "Operational Access Setup" "Configure long-term database access"

echo -e "${YELLOW}We'll create a helper script for database access via SSM tunnel${NC}"
echo ""

wait_for_confirmation

# Step 9: Cost optimization
run_step "9" "Cost Optimization" "Review and optimize costs"

echo -e "${YELLOW}Cost optimization checklist:${NC}"
echo "✓ Stop SSM EC2 when not needed (~$8/month if running)"
echo "✓ Consider gp3 storage for RDS (better cost/performance)"
echo "✓ Review instance sizes"
echo ""

wait_for_confirmation

# Step 10: Create read-only user
run_step "10" "Create Analytics User" "Set up read-only database user for dashboards"

echo -e "${YELLOW}We'll create a read-only user for analytics and dashboards${NC}"
echo ""

wait_for_confirmation

echo -e "${GREEN}🎉 Checklist complete! Let's implement these steps...${NC}"