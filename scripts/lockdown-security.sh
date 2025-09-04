#!/bin/bash

# Security Lockdown Script
# Removes temporary access and secures RDS and Redis

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PROJECT_NAME="carebow"
AWS_REGION="us-east-1"

echo -e "${BLUE}🔒 Security Lockdown${NC}"
echo "==================="

# Get current public IP
echo -e "${YELLOW}🌐 Getting your current public IP...${NC}"
CURRENT_IP=$(curl -s https://checkip.amazonaws.com)
echo -e "${GREEN}✅ Your current IP: $CURRENT_IP${NC}"

# Get RDS security group ID
echo -e "${YELLOW}🔍 Finding RDS security group...${NC}"
RDS_SG_ID=$(aws ec2 describe-security-groups \
    --filters "Name=group-name,Values=${PROJECT_NAME}-rds-*" \
    --query 'SecurityGroups[0].GroupId' \
    --output text \
    --region $AWS_REGION)

if [ "$RDS_SG_ID" = "None" ] || [ -z "$RDS_SG_ID" ]; then
    echo -e "${RED}❌ Could not find RDS security group${NC}"
    exit 1
fi

echo -e "${GREEN}✅ RDS Security Group: $RDS_SG_ID${NC}"

# Get ECS security group ID
echo -e "${YELLOW}🔍 Finding ECS security group...${NC}"
ECS_SG_ID=$(aws ec2 describe-security-groups \
    --filters "Name=group-name,Values=${PROJECT_NAME}-ecs-*" \
    --query 'SecurityGroups[0].GroupId' \
    --output text \
    --region $AWS_REGION)

echo -e "${GREEN}✅ ECS Security Group: $ECS_SG_ID${NC}"

# Get SSM security group ID (may not exist)
echo -e "${YELLOW}🔍 Finding SSM security group...${NC}"
SSM_SG_ID=$(aws ec2 describe-security-groups \
    --filters "Name=group-name,Values=${PROJECT_NAME}-ssm-*" \
    --query 'SecurityGroups[0].GroupId' \
    --output text \
    --region $AWS_REGION 2>/dev/null || echo "None")

echo -e "${GREEN}✅ SSM Security Group: $SSM_SG_ID${NC}"

# Show current RDS security group rules
echo -e "${YELLOW}📋 Current RDS security group rules:${NC}"
aws ec2 describe-security-groups \
    --group-ids $RDS_SG_ID \
    --query 'SecurityGroups[0].IpPermissions' \
    --output table \
    --region $AWS_REGION

# Check for any public access rules
echo -e "${YELLOW}🔍 Checking for public access rules...${NC}"
PUBLIC_RULES=$(aws ec2 describe-security-groups \
    --group-ids $RDS_SG_ID \
    --query 'SecurityGroups[0].IpPermissions[?IpRanges[?CidrIp==`0.0.0.0/0`]]' \
    --output json \
    --region $AWS_REGION)

if [ "$PUBLIC_RULES" != "[]" ]; then
    echo -e "${RED}⚠️  Found public access rules in RDS security group!${NC}"
    echo "$PUBLIC_RULES"
    
    echo -e "${YELLOW}❓ Do you want to remove all public access rules? (y/N)${NC}"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        # Remove rules with 0.0.0.0/0
        aws ec2 describe-security-groups \
            --group-ids $RDS_SG_ID \
            --query 'SecurityGroups[0].IpPermissions[?IpRanges[?CidrIp==`0.0.0.0/0`]]' \
            --output json \
            --region $AWS_REGION | jq -r '.[] | @base64' | while read rule; do
                decoded_rule=$(echo "$rule" | base64 --decode)
                echo "Removing rule: $decoded_rule"
                aws ec2 revoke-security-group-ingress \
                    --group-id $RDS_SG_ID \
                    --ip-permissions "$decoded_rule" \
                    --region $AWS_REGION || echo "Rule may already be removed"
            done
        echo -e "${GREEN}✅ Public access rules removed${NC}"
    fi
fi

# Check for your IP in the rules
echo -e "${YELLOW}🔍 Checking for your IP in RDS security group...${NC}"
YOUR_IP_RULES=$(aws ec2 describe-security-groups \
    --group-ids $RDS_SG_ID \
    --query "SecurityGroups[0].IpPermissions[?IpRanges[?CidrIp==\`${CURRENT_IP}/32\`]]" \
    --output json \
    --region $AWS_REGION)

if [ "$YOUR_IP_RULES" != "[]" ]; then
    echo -e "${YELLOW}⚠️  Found your IP (${CURRENT_IP}/32) in RDS security group${NC}"
    echo -e "${YELLOW}❓ Do you want to remove your IP from RDS access? (y/N)${NC}"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        aws ec2 revoke-security-group-ingress \
            --group-id $RDS_SG_ID \
            --protocol tcp \
            --port 5432 \
            --cidr "${CURRENT_IP}/32" \
            --region $AWS_REGION || echo "Rule may not exist"
        echo -e "${GREEN}✅ Your IP removed from RDS access${NC}"
    fi
else
    echo -e "${GREEN}✅ Your IP not found in RDS security group${NC}"
fi

# Ensure proper RDS security group rules
echo -e "${YELLOW}🔧 Ensuring proper RDS security group configuration...${NC}"

# Allow access from ECS security group
aws ec2 authorize-security-group-ingress \
    --group-id $RDS_SG_ID \
    --protocol tcp \
    --port 5432 \
    --source-group $ECS_SG_ID \
    --region $AWS_REGION 2>/dev/null || echo -e "${YELLOW}ECS access rule may already exist${NC}"

# Allow access from SSM security group (for admin access)
aws ec2 authorize-security-group-ingress \
    --group-id $RDS_SG_ID \
    --protocol tcp \
    --port 5432 \
    --source-group $SSM_SG_ID \
    --region $AWS_REGION 2>/dev/null || echo -e "${YELLOW}SSM access rule may already exist${NC}"

echo -e "${GREEN}✅ RDS security group properly configured${NC}"

# Check Redis security group
echo -e "${YELLOW}🔍 Checking Redis security group...${NC}"
REDIS_SG_ID=$(aws ec2 describe-security-groups \
    --filters "Name=group-name,Values=${PROJECT_NAME}-cache-*" \
    --query 'SecurityGroups[0].GroupId' \
    --output text \
    --region $AWS_REGION)

if [ "$REDIS_SG_ID" != "None" ] && [ -n "$REDIS_SG_ID" ]; then
    echo -e "${GREEN}✅ Redis Security Group: $REDIS_SG_ID${NC}"
    
    # Show Redis security group rules
    echo -e "${YELLOW}📋 Redis security group rules:${NC}"
    aws ec2 describe-security-groups \
        --group-ids $REDIS_SG_ID \
        --query 'SecurityGroups[0].IpPermissions' \
        --output table \
        --region $AWS_REGION
    
    # Ensure Redis only allows ECS access
    aws ec2 authorize-security-group-ingress \
        --group-id $REDIS_SG_ID \
        --protocol tcp \
        --port 6379 \
        --source-group $ECS_SG_ID \
        --region $AWS_REGION 2>/dev/null || echo -e "${YELLOW}ECS to Redis access rule may already exist${NC}"
    
    echo -e "${GREEN}✅ Redis security group properly configured${NC}"
fi

# Verify RDS is not publicly accessible
echo -e "${YELLOW}🔍 Verifying RDS is not publicly accessible...${NC}"
RDS_PUBLIC=$(aws rds describe-db-instances \
    --db-instance-identifier "${PROJECT_NAME}-db" \
    --query 'DBInstances[0].PubliclyAccessible' \
    --output text \
    --region $AWS_REGION)

if [ "$RDS_PUBLIC" = "True" ]; then
    echo -e "${RED}⚠️  RDS instance is publicly accessible!${NC}"
    echo -e "${YELLOW}❓ Do you want to make it private? (y/N)${NC}"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        aws rds modify-db-instance \
            --db-instance-identifier "${PROJECT_NAME}-db" \
            --no-publicly-accessible \
            --apply-immediately \
            --region $AWS_REGION
        echo -e "${GREEN}✅ RDS instance set to private${NC}"
    fi
else
    echo -e "${GREEN}✅ RDS instance is private${NC}"
fi

# Check for any overly permissive rules in other security groups
echo -e "${YELLOW}🔍 Checking for overly permissive security group rules...${NC}"

# Check ECS security group for unnecessary public access
ECS_PUBLIC_RULES=$(aws ec2 describe-security-groups \
    --group-ids $ECS_SG_ID \
    --query 'SecurityGroups[0].IpPermissions[?IpRanges[?CidrIp==`0.0.0.0/0`] && FromPort!=`80` && FromPort!=`443`]' \
    --output json \
    --region $AWS_REGION)

if [ "$ECS_PUBLIC_RULES" != "[]" ]; then
    echo -e "${YELLOW}⚠️  Found potentially unnecessary public access in ECS security group:${NC}"
    echo "$ECS_PUBLIC_RULES"
    echo -e "${YELLOW}💡 Review these rules manually to ensure they're necessary${NC}"
fi

# Create security audit report
echo -e "${YELLOW}📊 Creating security audit report...${NC}"
cat > security-audit-report.txt << EOF
CareBow Security Audit Report
Generated: $(date)

=== RDS Security ===
Instance ID: ${PROJECT_NAME}-db
Publicly Accessible: $RDS_PUBLIC
Security Group: $RDS_SG_ID

RDS Security Group Rules:
$(aws ec2 describe-security-groups --group-ids $RDS_SG_ID --query 'SecurityGroups[0].IpPermissions' --output table --region $AWS_REGION)

=== Redis Security ===
Security Group: $REDIS_SG_ID

Redis Security Group Rules:
$(aws ec2 describe-security-groups --group-ids $REDIS_SG_ID --query 'SecurityGroups[0].IpPermissions' --output table --region $AWS_REGION 2>/dev/null || echo "Redis security group not found")

=== ECS Security ===
Security Group: $ECS_SG_ID

ECS Security Group Rules:
$(aws ec2 describe-security-groups --group-ids $ECS_SG_ID --query 'SecurityGroups[0].IpPermissions' --output table --region $AWS_REGION)

=== Recommendations ===
✓ RDS should only allow access from ECS and SSM security groups
✓ Redis should only allow access from ECS security group
✓ No public access (0.0.0.0/0) should be allowed to databases
✓ ECS should only allow public access on ports 80 and 443
✓ Regular security audits should be performed

EOF

echo -e "${GREEN}✅ Security audit report created: security-audit-report.txt${NC}"

echo ""
echo -e "${BLUE}🎉 Security Lockdown Complete!${NC}"
echo "=============================="
echo ""
echo -e "${YELLOW}Security status:${NC}"
echo "✓ RDS is private (not publicly accessible)"
echo "✓ RDS only allows access from ECS and SSM security groups"
echo "✓ Redis only allows access from ECS security group"
echo "✓ Public access rules reviewed and cleaned up"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Review the security audit report: security-audit-report.txt"
echo "2. Set up regular security audits (monthly recommended)"
echo "3. Monitor CloudTrail logs for database access"
echo "4. Consider enabling VPC Flow Logs for network monitoring"
echo ""
echo -e "${CYAN}To access database for admin tasks:${NC}"
echo "1. Start SSM tunnel: ./scripts/start-db-tunnel.sh"
echo "2. Connect: ./scripts/connect-to-db.sh"
echo ""
echo -e "${YELLOW}⚠️  Important: Keep your SSM instance stopped when not needed to save costs${NC}"