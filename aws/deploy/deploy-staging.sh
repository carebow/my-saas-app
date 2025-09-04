#!/bin/bash

# CareBow Staging Deployment Script
# This script deploys the CareBow application to AWS staging environment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="carebow"
AWS_REGION="us-east-1"
ENVIRONMENT="staging"

echo -e "${BLUE}🚀 Starting CareBow Staging Deployment${NC}"
echo "=================================="

# Check prerequisites
echo -e "${YELLOW}📋 Checking prerequisites...${NC}"

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI is not installed${NC}"
    exit 1
fi

# Check if Terraform is installed
if ! command -v terraform &> /dev/null; then
    echo -e "${RED}❌ Terraform is not installed${NC}"
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed${NC}"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ All prerequisites met${NC}"

# Check AWS credentials
echo -e "${YELLOW}🔐 Checking AWS credentials...${NC}"
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}❌ AWS credentials not configured${NC}"
    echo "Please run: aws configure"
    exit 1
fi
echo -e "${GREEN}✅ AWS credentials configured${NC}"

# Navigate to infrastructure directory
cd "$(dirname "$0")/../infrastructure"

# Check if terraform.staging.tfvars exists
if [ ! -f "../terraform.staging.tfvars" ]; then
    echo -e "${RED}❌ terraform.staging.tfvars not found${NC}"
    echo "Please copy and configure terraform.staging.tfvars from terraform.staging.tfvars"
    exit 1
fi

# Initialize Terraform
echo -e "${YELLOW}🏗️  Initializing Terraform...${NC}"
terraform init

# Plan infrastructure changes
echo -e "${YELLOW}📋 Planning infrastructure changes...${NC}"
terraform plan -var-file="../terraform.staging.tfvars" -out=staging.tfplan

# Ask for confirmation
echo -e "${YELLOW}❓ Do you want to apply these changes? (y/N)${NC}"
read -r response
if [[ ! "$response" =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}⏸️  Deployment cancelled${NC}"
    exit 0
fi

# Apply infrastructure changes
echo -e "${YELLOW}🚀 Applying infrastructure changes...${NC}"
terraform apply staging.tfplan

# Get infrastructure outputs
echo -e "${YELLOW}📤 Getting infrastructure outputs...${NC}"
ECR_BACKEND_URI=$(terraform output -raw backend_repository_url)
STAGING_S3_BUCKET=$(terraform output -raw staging_s3_bucket_name)
STAGING_CLOUDFRONT_ID=$(terraform output -raw staging_cloudfront_distribution_id)
STAGING_ECS_CLUSTER=$(terraform output -raw staging_ecs_cluster_name)
STAGING_ECS_SERVICE=$(terraform output -raw staging_ecs_service_name)

echo -e "${GREEN}✅ Infrastructure deployed successfully${NC}"
echo "ECR Backend URI: $ECR_BACKEND_URI"
echo "S3 Bucket: $STAGING_S3_BUCKET"
echo "CloudFront Distribution ID: $STAGING_CLOUDFRONT_ID"

# Navigate back to project root
cd "../../.."

# Build and deploy backend
echo -e "${YELLOW}🐳 Building and deploying backend...${NC}"

# Login to ECR
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_BACKEND_URI

# Build backend image
echo -e "${YELLOW}🔨 Building backend Docker image...${NC}"
docker build -f aws/deploy/backend.Dockerfile -t $PROJECT_NAME-staging-backend .

# Tag and push to ECR
docker tag $PROJECT_NAME-staging-backend:latest $ECR_BACKEND_URI:staging
docker push $ECR_BACKEND_URI:staging

echo -e "${GREEN}✅ Backend image pushed to ECR${NC}"

# Update ECS service
echo -e "${YELLOW}🔄 Updating ECS service...${NC}"
aws ecs update-service \
    --cluster $STAGING_ECS_CLUSTER \
    --service $STAGING_ECS_SERVICE \
    --force-new-deployment \
    --region $AWS_REGION

echo -e "${GREEN}✅ ECS service updated${NC}"

# Build and deploy frontend
echo -e "${YELLOW}🌐 Building and deploying frontend...${NC}"

# Install dependencies
echo -e "${YELLOW}📦 Installing frontend dependencies...${NC}"
npm install

# Build frontend for staging
echo -e "${YELLOW}🔨 Building frontend...${NC}"
VITE_API_URL="https://$(terraform -chdir=aws/infrastructure output -raw staging_cloudfront_domain_name)/api" \
VITE_ENVIRONMENT="staging" \
npm run build

# Deploy to S3
echo -e "${YELLOW}☁️  Deploying frontend to S3...${NC}"
aws s3 sync dist/ s3://$STAGING_S3_BUCKET --delete --region $AWS_REGION

echo -e "${GREEN}✅ Frontend deployed to S3${NC}"

# Invalidate CloudFront cache
echo -e "${YELLOW}🔄 Invalidating CloudFront cache...${NC}"
aws cloudfront create-invalidation \
    --distribution-id $STAGING_CLOUDFRONT_ID \
    --paths "/*" \
    --region $AWS_REGION

echo -e "${GREEN}✅ CloudFront cache invalidated${NC}"

# Wait for ECS service to stabilize
echo -e "${YELLOW}⏳ Waiting for ECS service to stabilize...${NC}"
aws ecs wait services-stable \
    --cluster $STAGING_ECS_CLUSTER \
    --services $STAGING_ECS_SERVICE \
    --region $AWS_REGION

echo -e "${GREEN}✅ ECS service is stable${NC}"

# Get final URLs
STAGING_FRONTEND_URL="https://$(terraform -chdir=aws/infrastructure output -raw staging_cloudfront_domain_name)"
STAGING_API_URL="$STAGING_FRONTEND_URL/api"

echo ""
echo -e "${GREEN}🎉 Staging Deployment Complete!${NC}"
echo "=================================="
echo -e "${BLUE}Frontend URL:${NC} $STAGING_FRONTEND_URL"
echo -e "${BLUE}API URL:${NC} $STAGING_API_URL"
echo -e "${BLUE}Health Check:${NC} $STAGING_API_URL/health"
echo ""
echo -e "${YELLOW}📋 Next Steps:${NC}"
echo "1. Test the staging environment"
echo "2. Update your staging secrets in AWS Secrets Manager if needed"
echo "3. Configure your CI/CD pipeline to use this staging environment"
echo ""
echo -e "${BLUE}💡 Useful Commands:${NC}"
echo "# View ECS logs:"
echo "aws logs tail /ecs/$PROJECT_NAME-staging --follow"
echo ""
echo "# Update secrets:"
echo "aws secretsmanager update-secret --secret-id $PROJECT_NAME-staging-app-secrets --secret-string '{\"key\":\"value\"}'"
echo ""
echo "# Redeploy backend:"
echo "./aws/deploy/deploy-staging.sh"