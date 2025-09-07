#!/bin/bash

# CareBow AWS-Native Deployment Script
# This script deploys the complete CareBow platform to AWS with HIPAA compliance

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="carebow"
ENVIRONMENT=${1:-"dev"}
AWS_REGION=${2:-"us-east-1"}
TERRAFORM_DIR="terraform"
BACKEND_DIR="backend"
FRONTEND_DIR=".."

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check if AWS CLI is installed
    if ! command -v aws &> /dev/null; then
        log_error "AWS CLI is not installed. Please install it first."
        exit 1
    fi
    
    # Check if Terraform is installed
    if ! command -v terraform &> /dev/null; then
        log_error "Terraform is not installed. Please install it first."
        exit 1
    fi
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install it first."
        exit 1
    fi
    
    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed. Please install it first."
        exit 1
    fi
    
    # Check if Python is installed
    if ! command -v python3 &> /dev/null; then
        log_error "Python 3 is not installed. Please install it first."
        exit 1
    fi
    
    log_success "All prerequisites are installed"
}

check_aws_credentials() {
    log_info "Checking AWS credentials..."
    
    if ! aws sts get-caller-identity &> /dev/null; then
        log_error "AWS credentials not configured. Please run 'aws configure' first."
        exit 1
    fi
    
    log_success "AWS credentials are configured"
}

create_terraform_backend() {
    log_info "Creating Terraform backend..."
    
    # Create S3 bucket for Terraform state
    BUCKET_NAME="${PROJECT_NAME}-terraform-state-${ENVIRONMENT}"
    
    if ! aws s3 ls "s3://${BUCKET_NAME}" 2>&1 | grep -q 'NoSuchBucket'; then
        log_info "Terraform state bucket already exists"
    else
        aws s3 mb "s3://${BUCKET_NAME}" --region "${AWS_REGION}"
        aws s3api put-bucket-versioning --bucket "${BUCKET_NAME}" --versioning-configuration Status=Enabled
        aws s3api put-bucket-encryption --bucket "${BUCKET_NAME}" --server-side-encryption-configuration '{
            "Rules": [{
                "ApplyServerSideEncryptionByDefault": {
                    "SSEAlgorithm": "AES256"
                }
            }]
        }'
        log_success "Terraform state bucket created"
    fi
}

deploy_infrastructure() {
    log_info "Deploying AWS infrastructure..."
    
    cd "${TERRAFORM_DIR}"
    
    # Initialize Terraform
    terraform init -backend-config="bucket=${PROJECT_NAME}-terraform-state-${ENVIRONMENT}" \
                   -backend-config="key=carebow/terraform.tfstate" \
                   -backend-config="region=${AWS_REGION}"
    
    # Plan deployment
    terraform plan -var="environment=${ENVIRONMENT}" \
                   -var="aws_region=${AWS_REGION}" \
                   -out="terraform.tfplan"
    
    # Apply deployment
    terraform apply "terraform.tfplan"
    
    # Get outputs
    terraform output -json > "../terraform-outputs.json"
    
    cd ..
    
    log_success "Infrastructure deployed successfully"
}

build_backend() {
    log_info "Building backend application..."
    
    cd "${BACKEND_DIR}"
    
    # Create virtual environment
    python3 -m venv venv
    source venv/bin/activate
    
    # Install dependencies
    pip install -r requirements.txt
    
    # Run database migrations
    python migrate.py
    
    # Build Docker image
    docker build -t "${PROJECT_NAME}-backend:${ENVIRONMENT}" .
    
    cd ..
    
    log_success "Backend built successfully"
}

build_frontend() {
    log_info "Building frontend application..."
    
    cd "${FRONTEND_DIR}"
    
    # Install dependencies
    npm install
    
    # Build application
    npm run build
    
    cd "${BACKEND_DIR}/.."
    
    log_success "Frontend built successfully"
}

deploy_backend() {
    log_info "Deploying backend to ECS..."
    
    # Get ECR repository URL from Terraform outputs
    ECR_REPO_URL=$(jq -r '.ecr_repository_url.value' terraform-outputs.json)
    
    # Login to ECR
    aws ecr get-login-password --region "${AWS_REGION}" | docker login --username AWS --password-stdin "${ECR_REPO_URL}"
    
    # Tag and push image
    docker tag "${PROJECT_NAME}-backend:${ENVIRONMENT}" "${ECR_REPO_URL}:${ENVIRONMENT}"
    docker push "${ECR_REPO_URL}:${ENVIRONMENT}"
    
    # Update ECS service
    ECS_CLUSTER=$(jq -r '.ecs_cluster_name.value' terraform-outputs.json)
    ECS_SERVICE=$(jq -r '.ecs_service_name.value' terraform-outputs.json)
    
    aws ecs update-service --cluster "${ECS_CLUSTER}" --service "${ECS_SERVICE}" --force-new-deployment
    
    log_success "Backend deployed successfully"
}

deploy_frontend() {
    log_info "Deploying frontend to S3..."
    
    # Get S3 bucket name from Terraform outputs
    S3_BUCKET=$(jq -r '.static_website_bucket_name.value' terraform-outputs.json)
    
    # Sync files to S3
    aws s3 sync "${FRONTEND_DIR}/dist/" "s3://${S3_BUCKET}/" --delete
    
    # Invalidate CloudFront cache
    CLOUDFRONT_DISTRIBUTION_ID=$(jq -r '.cloudfront_distribution_id.value' terraform-outputs.json)
    aws cloudfront create-invalidation --distribution-id "${CLOUDFRONT_DISTRIBUTION_ID}" --paths "/*"
    
    log_success "Frontend deployed successfully"
}

run_tests() {
    log_info "Running tests..."
    
    cd "${BACKEND_DIR}"
    
    # Activate virtual environment
    source venv/bin/activate
    
    # Run tests
    python -m pytest tests/ -v --cov=app --cov-report=html
    
    cd ..
    
    log_success "Tests completed successfully"
}

setup_monitoring() {
    log_info "Setting up monitoring and alerting..."
    
    # Get SNS topic ARN from Terraform outputs
    ALARM_TOPIC_ARN=$(jq -r '.alarm_topic_arn.value' terraform-outputs.json)
    
    # Create CloudWatch alarms
    aws cloudwatch put-metric-alarm \
        --alarm-name "${PROJECT_NAME}-high-cpu-${ENVIRONMENT}" \
        --alarm-description "High CPU utilization" \
        --metric-name CPUUtilization \
        --namespace AWS/ECS \
        --statistic Average \
        --period 300 \
        --threshold 80 \
        --comparison-operator GreaterThanThreshold \
        --evaluation-periods 2 \
        --alarm-actions "${ALARM_TOPIC_ARN}"
    
    log_success "Monitoring setup completed"
}

verify_deployment() {
    log_info "Verifying deployment..."
    
    # Get application URL from Terraform outputs
    APP_URL=$(jq -r '.application_url.value' terraform-outputs.json)
    API_URL=$(jq -r '.api_url.value' terraform-outputs.json)
    
    # Test API health endpoint
    if curl -f "${API_URL}/health" > /dev/null 2>&1; then
        log_success "API health check passed"
    else
        log_error "API health check failed"
        exit 1
    fi
    
    # Test frontend
    if curl -f "${APP_URL}" > /dev/null 2>&1; then
        log_success "Frontend health check passed"
    else
        log_error "Frontend health check failed"
        exit 1
    fi
    
    log_success "Deployment verification completed"
}

cleanup() {
    log_info "Cleaning up temporary files..."
    
    rm -f terraform-outputs.json
    rm -f "${TERRAFORM_DIR}/terraform.tfplan"
    
    log_success "Cleanup completed"
}

main() {
    log_info "Starting CareBow AWS-Native deployment..."
    log_info "Environment: ${ENVIRONMENT}"
    log_info "AWS Region: ${AWS_REGION}"
    
    check_prerequisites
    check_aws_credentials
    create_terraform_backend
    deploy_infrastructure
    build_backend
    build_frontend
    run_tests
    deploy_backend
    deploy_frontend
    setup_monitoring
    verify_deployment
    cleanup
    
    log_success "CareBow AWS-Native deployment completed successfully!"
    log_info "Application URL: $(jq -r '.application_url.value' terraform-outputs.json)"
    log_info "API URL: $(jq -r '.api_url.value' terraform-outputs.json)"
}

# Run main function
main "$@"
