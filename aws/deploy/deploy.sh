#!/bin/bash

# CareBow AWS Deployment Script
set -e

# Configuration
PROJECT_NAME="carebow"
AWS_REGION="us-east-1"
ENVIRONMENT="production"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    if ! command -v aws &> /dev/null; then
        log_error "AWS CLI is not installed"
        exit 1
    fi
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed"
        exit 1
    fi
    
    if ! command -v terraform &> /dev/null; then
        log_error "Terraform is not installed"
        exit 1
    fi
    
    # Check AWS credentials
    if ! aws sts get-caller-identity &> /dev/null; then
        log_error "AWS credentials not configured"
        exit 1
    fi
    
    log_info "Prerequisites check passed"
}

# Deploy infrastructure
deploy_infrastructure() {
    log_info "Deploying infrastructure with Terraform..."
    
    cd aws/infrastructure
    
    # Initialize Terraform
    terraform init
    
    # Plan deployment
    terraform plan -var="environment=$ENVIRONMENT" -var="aws_region=$AWS_REGION"
    
    # Apply deployment
    terraform apply -var="environment=$ENVIRONMENT" -var="aws_region=$AWS_REGION" -auto-approve
    
    # Get outputs
    ECR_BACKEND_URI=$(terraform output -raw backend_repository_url)
    ECR_FRONTEND_URI=$(terraform output -raw frontend_repository_url)
    ALB_DNS=$(terraform output -raw alb_dns_name)
    CLOUDFRONT_DOMAIN=$(terraform output -raw cloudfront_domain_name)
    S3_BUCKET=$(terraform output -raw s3_bucket_name)
    
    cd ../..
    
    log_info "Infrastructure deployed successfully"
    log_info "Backend ECR: $ECR_BACKEND_URI"
    log_info "Frontend ECR: $ECR_FRONTEND_URI"
    log_info "ALB DNS: $ALB_DNS"
    log_info "CloudFront Domain: $CLOUDFRONT_DOMAIN"
}

# Build and push backend
build_push_backend() {
    log_info "Building and pushing backend image..."
    
    # Get ECR login token
    aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_BACKEND_URI
    
    # Build image
    docker build -f aws/deploy/backend.Dockerfile -t $PROJECT_NAME-backend .
    
    # Tag image
    docker tag $PROJECT_NAME-backend:latest $ECR_BACKEND_URI:latest
    docker tag $PROJECT_NAME-backend:latest $ECR_BACKEND_URI:$(git rev-parse --short HEAD)
    
    # Push image
    docker push $ECR_BACKEND_URI:latest
    docker push $ECR_BACKEND_URI:$(git rev-parse --short HEAD)
    
    log_info "Backend image pushed successfully"
}

# Build and deploy frontend
build_deploy_frontend() {
    log_info "Building and deploying frontend..."
    
    # Build frontend
    npm run build
    
    # Sync to S3
    aws s3 sync dist/ s3://$S3_BUCKET --delete --cache-control "max-age=31536000" --exclude "*.html"
    aws s3 sync dist/ s3://$S3_BUCKET --delete --cache-control "max-age=0" --include "*.html"
    
    # Invalidate CloudFront cache
    DISTRIBUTION_ID=$(aws cloudfront list-distributions --query "DistributionList.Items[?Comment=='CareBow Frontend Distribution'].Id" --output text)
    if [ ! -z "$DISTRIBUTION_ID" ]; then
        aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"
        log_info "CloudFront cache invalidated"
    fi
    
    log_info "Frontend deployed successfully"
}

# Update ECS service
update_ecs_service() {
    log_info "Updating ECS service..."
    
    # Force new deployment
    aws ecs update-service --cluster $PROJECT_NAME-cluster --service $PROJECT_NAME-service --force-new-deployment --region $AWS_REGION
    
    # Wait for deployment to complete
    aws ecs wait services-stable --cluster $PROJECT_NAME-cluster --services $PROJECT_NAME-service --region $AWS_REGION
    
    log_info "ECS service updated successfully"
}

# Health check
health_check() {
    log_info "Performing health check..."
    
    # Wait a bit for services to start
    sleep 30
    
    # Check backend health
    if curl -f "http://$ALB_DNS/health" &> /dev/null; then
        log_info "Backend health check passed"
    else
        log_warn "Backend health check failed"
    fi
    
    # Check frontend
    if curl -f "https://$CLOUDFRONT_DOMAIN" &> /dev/null; then
        log_info "Frontend health check passed"
    else
        log_warn "Frontend health check failed"
    fi
}

# Main deployment function
main() {
    log_info "Starting CareBow deployment to AWS..."
    
    check_prerequisites
    deploy_infrastructure
    build_push_backend
    build_deploy_frontend
    update_ecs_service
    health_check
    
    log_info "Deployment completed successfully!"
    log_info "Frontend URL: https://$CLOUDFRONT_DOMAIN"
    log_info "Backend URL: http://$ALB_DNS"
}

# Run main function
main "$@"