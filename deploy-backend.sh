#!/bin/bash

# CareBow Backend Deployment Script
set -e

echo "🚀 Deploying CareBow Backend to AWS..."

# Configuration
AWS_REGION="us-east-1"
ECR_REPOSITORY="carebow-api"
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

if [ -z "$ACCOUNT_ID" ]; then
    echo "❌ Error: AWS credentials not configured"
    exit 1
fi

ECR_URI="${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}"

echo "📦 Building Docker image..."

# Build the Docker image
docker build -t ${ECR_REPOSITORY}:latest .

echo "🔐 Logging into ECR..."

# Login to ECR
aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_URI}

echo "📤 Pushing image to ECR..."

# Tag and push the image
docker tag ${ECR_REPOSITORY}:latest ${ECR_URI}:latest
docker push ${ECR_URI}:latest

echo "🏗️ Deploying infrastructure with Terraform..."

# Navigate to terraform directory
cd terraform

# Initialize Terraform if needed
if [ ! -d ".terraform" ]; then
    echo "🔧 Initializing Terraform..."
    terraform init
fi

# Create terraform.tfvars if it doesn't exist
if [ ! -f "terraform.tfvars" ]; then
    echo "📝 Creating terraform.tfvars..."
    cp terraform.tfvars.example terraform.tfvars
    
    # Update the API image in terraform.tfvars
    sed -i.bak "s|YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/carebow-api:latest|${ECR_URI}:latest|g" terraform.tfvars
    
    # Generate a secure database password
    DB_PASSWORD=$(openssl rand -base64 32)
    sed -i.bak "s|your-secure-database-password-here|${DB_PASSWORD}|g" terraform.tfvars
    
    # Generate a unique S3 bucket name
    BUCKET_SUFFIX=$(openssl rand -hex 8)
    sed -i.bak "s|carebow-reports-YOUR_UNIQUE_SUFFIX|carebow-reports-${BUCKET_SUFFIX}|g" terraform.tfvars
    
    echo "✅ terraform.tfvars created with generated values"
    echo "🔑 Database password: ${DB_PASSWORD}"
    echo "🪣 S3 bucket: carebow-reports-${BUCKET_SUFFIX}"
fi

# Plan the deployment
echo "📋 Planning Terraform deployment..."
terraform plan -out=tfplan

# Apply the deployment
echo "🚀 Applying Terraform deployment..."
terraform apply tfplan

# Get outputs
echo "📊 Deployment outputs:"
echo "ALB DNS Name: $(terraform output -raw alb_dns_name)"
echo "Database Endpoint: $(terraform output -raw db_endpoint)"
echo "Reports Bucket: $(terraform output -raw reports_bucket)"

echo "✅ Backend deployment completed!"
echo "🌐 API URL: http://$(terraform output -raw alb_dns_name)"
echo "📝 Next steps:"
echo "   1. Configure DNS to point to the ALB"
echo "   2. Set up SSL certificate for HTTPS"
echo "   3. Configure secrets in AWS Secrets Manager"
echo "   4. Test the API endpoints"
