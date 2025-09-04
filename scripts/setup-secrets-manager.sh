#!/bin/bash

# Secrets Manager Setup Script
# Configures DATABASE_URL in Secrets Manager and updates ECS task definition

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PROJECT_NAME="carebow"
AWS_REGION="us-east-1"

echo -e "${BLUE}🔐 Setting up Secrets Manager Integration${NC}"
echo "========================================"

# Get RDS endpoint
echo -e "${YELLOW}📡 Getting RDS endpoint...${NC}"
RDS_ENDPOINT=$(aws rds describe-db-instances --db-instance-identifier "${PROJECT_NAME}-db" --query 'DBInstances[0].Endpoint.Address' --output text --region $AWS_REGION)
echo -e "${GREEN}✅ RDS Endpoint: $RDS_ENDPOINT${NC}"

# Get database password
echo -e "${YELLOW}🔐 Getting database password...${NC}"
DB_PASSWORD=$(aws secretsmanager get-secret-value --secret-id "${PROJECT_NAME}-db-password" --query SecretString --output text --region $AWS_REGION)

# Create DATABASE_URL
DATABASE_URL="postgresql://appuser:${DB_PASSWORD}@${RDS_ENDPOINT}:5432/carebow"

# Check if app secrets exist
echo -e "${YELLOW}🔍 Checking for existing app secrets...${NC}"
if aws secretsmanager describe-secret --secret-id "${PROJECT_NAME}-app-secrets" --region $AWS_REGION >/dev/null 2>&1; then
    echo -e "${YELLOW}📝 Updating existing app secrets...${NC}"
    
    # Get existing secrets
    EXISTING_SECRETS=$(aws secretsmanager get-secret-value --secret-id "${PROJECT_NAME}-app-secrets" --query SecretString --output text --region $AWS_REGION)
    
    # Update with DATABASE_URL (using jq to merge)
    UPDATED_SECRETS=$(echo "$EXISTING_SECRETS" | jq --arg db_url "$DATABASE_URL" '. + {DATABASE_URL: $db_url}')
    
    aws secretsmanager update-secret \
        --secret-id "${PROJECT_NAME}-app-secrets" \
        --secret-string "$UPDATED_SECRETS" \
        --region $AWS_REGION
else
    echo -e "${YELLOW}🆕 Creating new app secrets...${NC}"
    
    # Create basic secrets structure
    SECRETS_JSON=$(jq -n \
        --arg db_url "$DATABASE_URL" \
        --arg redis_url "redis://carebow-redis.abc123.cache.amazonaws.com:6379" \
        --arg secret_key "$(openssl rand -base64 32)" \
        '{
            DATABASE_URL: $db_url,
            REDIS_URL: $redis_url,
            SECRET_KEY: $secret_key,
            ALGORITHM: "HS256",
            ACCESS_TOKEN_EXPIRE_MINUTES: "30",
            REFRESH_TOKEN_EXPIRE_DAYS: "7",
            ENVIRONMENT: "production"
        }')
    
    aws secretsmanager create-secret \
        --name "${PROJECT_NAME}-app-secrets" \
        --description "Application secrets for ${PROJECT_NAME}" \
        --secret-string "$SECRETS_JSON" \
        --region $AWS_REGION
fi

echo -e "${GREEN}✅ Secrets Manager configured${NC}"

# Check ECS task role permissions
echo -e "${YELLOW}🔍 Checking ECS task role permissions...${NC}"

# Get ECS task role ARN
TASK_ROLE_NAME="${PROJECT_NAME}-ecs-task-role"

# Create policy document for secrets access
cat > /tmp/secrets-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "secretsmanager:GetSecretValue"
            ],
            "Resource": [
                "arn:aws:secretsmanager:${AWS_REGION}:*:secret:${PROJECT_NAME}-app-secrets*",
                "arn:aws:secretsmanager:${AWS_REGION}:*:secret:${PROJECT_NAME}-db-password*"
            ]
        }
    ]
}
EOF

# Create or update the policy
POLICY_NAME="${PROJECT_NAME}-secrets-policy"
POLICY_ARN="arn:aws:iam::$(aws sts get-caller-identity --query Account --output text):policy/${POLICY_NAME}"

if aws iam get-policy --policy-arn "$POLICY_ARN" >/dev/null 2>&1; then
    echo -e "${YELLOW}📝 Updating existing secrets policy...${NC}"
    aws iam create-policy-version \
        --policy-arn "$POLICY_ARN" \
        --policy-document file:///tmp/secrets-policy.json \
        --set-as-default
else
    echo -e "${YELLOW}🆕 Creating secrets policy...${NC}"
    aws iam create-policy \
        --policy-name "$POLICY_NAME" \
        --policy-document file:///tmp/secrets-policy.json \
        --description "Allows access to ${PROJECT_NAME} secrets"
fi

# Attach policy to ECS task role
echo -e "${YELLOW}🔗 Attaching policy to ECS task role...${NC}"
aws iam attach-role-policy \
    --role-name "$TASK_ROLE_NAME" \
    --policy-arn "$POLICY_ARN" || echo -e "${YELLOW}Policy may already be attached${NC}"

echo -e "${GREEN}✅ ECS task role permissions configured${NC}"

# Clean up
rm -f /tmp/secrets-policy.json

echo ""
echo -e "${BLUE}🎉 Secrets Manager Setup Complete!${NC}"
echo "=================================="
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Update your ECS task definition to use secrets from Secrets Manager"
echo "2. Deploy your ECS service with the updated task definition"
echo "3. Test the database connection from your application"
echo ""
echo -e "${CYAN}Example task definition environment section:${NC}"
echo '"secrets": ['
echo '  {'
echo '    "name": "DATABASE_URL",'
echo '    "valueFrom": "arn:aws:secretsmanager:'$AWS_REGION':ACCOUNT:secret:'$PROJECT_NAME'-app-secrets:DATABASE_URL::"'
echo '  },'
echo '  {'
echo '    "name": "SECRET_KEY",'
echo '    "valueFrom": "arn:aws:secretsmanager:'$AWS_REGION':ACCOUNT:secret:'$PROJECT_NAME'-app-secrets:SECRET_KEY::"'
echo '  }'
echo ']'
echo ""
echo -e "${YELLOW}To view your secrets:${NC}"
echo "aws secretsmanager get-secret-value --secret-id ${PROJECT_NAME}-app-secrets --query SecretString --output text | jq"