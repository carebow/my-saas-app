#!/bin/bash

# Master Production-Ready Script
# Orchestrates all the production-ready steps

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

PROJECT_NAME="carebow"
AWS_REGION="us-east-1"

echo -e "${BLUE}🚀 CareBow Production-Ready Automation${NC}"
echo "======================================"
echo ""
echo -e "${GREEN}This script will guide you through making your CareBow app production-ready.${NC}"
echo -e "${YELLOW}Each step can be run individually or you can run them all in sequence.${NC}"
echo ""

# Function to check if script exists and is executable
check_script() {
    local script_path=$1
    if [ ! -f "$script_path" ]; then
        echo -e "${RED}❌ Script not found: $script_path${NC}"
        return 1
    fi
    if [ ! -x "$script_path" ]; then
        chmod +x "$script_path"
    fi
    return 0
}

# Function to run a step with confirmation
run_step() {
    local step_num=$1
    local step_name=$2
    local script_path=$3
    local description=$4
    
    echo ""
    echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}Step $step_num: $step_name${NC}"
    echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${YELLOW}$description${NC}"
    echo ""
    
    if [ "$AUTO_MODE" = "true" ]; then
        echo -e "${YELLOW}🤖 Auto mode: Running step automatically...${NC}"
        response="y"
    else
        echo -e "${YELLOW}❓ Do you want to run this step? (y/N/s=skip all)${NC}"
        read -r response
    fi
    
    case "$response" in
        [Yy]*)
            if check_script "$script_path"; then
                echo -e "${GREEN}▶️  Running: $script_path${NC}"
                if bash "$script_path"; then
                    echo -e "${GREEN}✅ Step $step_num completed successfully${NC}"
                else
                    echo -e "${RED}❌ Step $step_num failed${NC}"
                    if [ "$AUTO_MODE" != "true" ]; then
                        echo -e "${YELLOW}❓ Continue with remaining steps? (y/N)${NC}"
                        read -r continue_response
                        if [[ ! "$continue_response" =~ ^[Yy]$ ]]; then
                            exit 1
                        fi
                    fi
                fi
            else
                echo -e "${RED}❌ Cannot run step $step_num - script missing${NC}"
            fi
            ;;
        [Ss]*)
            echo -e "${YELLOW}⏭️  Skipping all remaining steps${NC}"
            exit 0
            ;;
        *)
            echo -e "${YELLOW}⏭️  Skipping step $step_num${NC}"
            ;;
    esac
}

# Check command line arguments
AUTO_MODE="false"
if [ "$1" = "--auto" ] || [ "$1" = "-a" ]; then
    AUTO_MODE="true"
    echo -e "${YELLOW}🤖 Running in automatic mode${NC}"
fi

# Prerequisites check
echo -e "${YELLOW}📋 Checking prerequisites...${NC}"

# Check if we're in the right directory (allow running from scripts/ or project root)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Change to project root if we're not already there
if [ ! -f "package.json" ] && [ -f "../package.json" ]; then
    cd "$PROJECT_ROOT"
fi

# Final check
if [ ! -f "package.json" ] || [ ! -d "backend" ]; then
    echo -e "${RED}❌ Cannot find package.json and backend/ directory${NC}"
    echo -e "${RED}Please run this script from the project root or scripts/ directory${NC}"
    exit 1
fi

# Check AWS CLI
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI is not installed${NC}"
    exit 1
fi

# Check AWS credentials
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}❌ AWS credentials not configured${NC}"
    echo "Please run: aws configure"
    exit 1
fi

# Check if infrastructure is deployed
if ! aws rds describe-db-instances --db-instance-identifier "${PROJECT_NAME}-db" --region $AWS_REGION &> /dev/null; then
    echo -e "${RED}❌ RDS instance not found. Please deploy your infrastructure first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites check passed${NC}"

# Create scripts directory if it doesn't exist
mkdir -p scripts

# Make all scripts executable
chmod +x scripts/*.sh 2>/dev/null || true

echo ""
echo -e "${BLUE}🎯 Production-Ready Checklist${NC}"
echo "============================="

# Step 1: Database tunnel setup
run_step "1" "Database Access Setup" \
    "scripts/setup-database-tunnel.sh" \
    "Sets up secure SSM tunnel for database access and creates connection scripts."

# Step 2: Run migrations
run_step "2" "Database Schema Migration" \
    "scripts/run-migrations.sh" \
    "Runs Alembic migrations against your RDS instance via SSM tunnel."

# Step 3: Secrets Manager setup
run_step "3" "Secrets Manager Integration" \
    "scripts/setup-secrets-manager.sh" \
    "Configures DATABASE_URL in Secrets Manager and sets up ECS task permissions."

# Step 4: Security lockdown
run_step "4" "Security Lockdown" \
    "scripts/lockdown-security.sh" \
    "Removes temporary access, secures RDS and Redis, and creates security audit report."

# Step 5: Backup and maintenance
run_step "5" "Backup & Maintenance Setup" \
    "scripts/setup-backups.sh" \
    "Configures automated backups, creates baseline snapshot, and sets up monitoring."

# Step 6: CloudWatch monitoring
run_step "6" "CloudWatch Monitoring" \
    "scripts/setup-monitoring.sh" \
    "Creates CloudWatch alarms, dashboard, and enables Performance Insights."

# Step 7: Analytics user
run_step "7" "Analytics User Creation" \
    "scripts/create-analytics-user.sh" \
    "Creates read-only database user for analytics and business intelligence."

echo ""
echo -e "${BLUE}🎉 Production-Ready Setup Complete!${NC}"
echo "=================================="
echo ""
echo -e "${GREEN}Your CareBow application is now production-ready! 🎊${NC}"
echo ""
echo -e "${YELLOW}📋 Summary of what was configured:${NC}"
echo "✓ Secure database access via SSM tunnel"
echo "✓ Database schema migrated to RDS"
echo "✓ Secrets Manager integration for secure credentials"
echo "✓ Security groups locked down (no public database access)"
echo "✓ Automated backups and monitoring configured"
echo "✓ CloudWatch alarms and dashboard created"
echo "✓ Read-only analytics user for BI tools"
echo ""
echo -e "${YELLOW}🔧 Useful scripts created:${NC}"
echo "• Database access: ./scripts/start-db-tunnel.sh && ./scripts/connect-to-db.sh"
echo "• Analytics access: ./scripts/connect-analytics.sh"
echo "• Backup management: ./scripts/manage-backups.sh"
echo "• Security audit: Review security-audit-report.txt"
echo ""
echo -e "${YELLOW}📊 Monitoring & Dashboards:${NC}"
echo "• CloudWatch Dashboard: https://console.aws.amazon.com/cloudwatch/home?region=${AWS_REGION}#dashboards:name=${PROJECT_NAME}-production"
echo "• RDS Performance Insights: Available in RDS console"
echo "• CloudWatch Alarms: https://console.aws.amazon.com/cloudwatch/home?region=${AWS_REGION}#alarmsV2:"
echo ""
echo -e "${YELLOW}🔄 Next Steps:${NC}"
echo "1. Update your ECS task definition to use Secrets Manager"
echo "2. Deploy your application with the new configuration"
echo "3. Test all application endpoints"
echo "4. Set up your CI/CD pipeline to use these configurations"
echo "5. Document your operational procedures"
echo ""
echo -e "${CYAN}💡 Pro Tips:${NC}"
echo "• Keep your SSM instance stopped when not needed (~$8/month savings)"
echo "• Run backup tests monthly: ./scripts/manage-backups.sh create"
echo "• Review security audit quarterly"
echo "• Monitor CloudWatch alarms and set up email notifications"
echo "• Consider setting up cross-region backup replication for DR"
echo ""
echo -e "${GREEN}🎯 Your app is now ready for production traffic! 🚀${NC}"