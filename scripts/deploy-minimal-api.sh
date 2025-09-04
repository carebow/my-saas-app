#!/bin/bash

# Phase 7 - Deploy Minimal Known-Good Image for Infrastructure Testing
# This script builds and deploys a minimal FastAPI service to validate infrastructure

set -e

# Configuration
DATE=$(date +%Y%m%d-%H%M%S)
IMAGE_TAG="prod-smoke-${DATE}"
ECR_REPO="your-ecr-repo-url"  # Update with your ECR repository URL
ECS_SERVICE="your-ecs-service"  # Update with your ECS service name
ECS_CLUSTER="your-ecs-cluster"  # Update with your ECS cluster name

echo "🚀 Phase 7: Deploying minimal known-good image for infrastructure validation"
echo "Image tag: ${IMAGE_TAG}"

# Build the minimal image
echo "📦 Building minimal Docker image..."
docker build -f Dockerfile.minimal -t minimal-api:${IMAGE_TAG} .

# Tag for ECR
echo "🏷️  Tagging image for ECR..."
docker tag minimal-api:${IMAGE_TAG} ${ECR_REPO}:${IMAGE_TAG}

# Push to ECR
echo "⬆️  Pushing to ECR..."
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin ${ECR_REPO}
docker push ${ECR_REPO}:${IMAGE_TAG}

# Update ECS service
echo "🔄 Updating ECS service with minimal image..."
aws ecs update-service \
    --cluster ${ECS_CLUSTER} \
    --service ${ECS_SERVICE} \
    --force-new-deployment \
    --task-definition $(aws ecs describe-services \
        --cluster ${ECS_CLUSTER} \
        --services ${ECS_SERVICE} \
        --query 'services[0].taskDefinition' \
        --output text | sed "s/:.*/:${IMAGE_TAG}/")

echo "✅ Deployment initiated. Monitor the service health:"
echo "   - ECS Console: Check service status and task health"
echo "   - CloudWatch: Monitor logs and metrics"
echo "   - Load Balancer: Test /healthz endpoint"
echo ""
echo "If this minimal service stays healthy, the issue is in your application code, not infrastructure."
echo "If it fails, investigate infrastructure components (networking, load balancer, ECS configuration)."