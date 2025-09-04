# Phase 7: Minimal Known-Good Image (Rollback Anchor)

## Overview
When production is unstable, deploy a minimal FastAPI service to isolate whether issues are infrastructure-related or application-related.

## Files Created
- `Dockerfile.minimal` - Minimal FastAPI container with health endpoint
- `scripts/deploy-minimal-api.sh` - Deployment script for minimal service
- `scripts/test-minimal-api.sh` - Testing script to validate minimal service

## Quick Start

### 1. Configure Deployment Script
Edit `scripts/deploy-minimal-api.sh` and update:
```bash
ECR_REPO="your-ecr-repo-url"
ECS_SERVICE="your-ecs-service"
ECS_CLUSTER="your-ecs-cluster"
```

### 2. Deploy Minimal Service
```bash
./scripts/deploy-minimal-api.sh
```

### 3. Test the Deployment
Edit `scripts/test-minimal-api.sh` and update:
```bash
LOAD_BALANCER_URL="your-load-balancer-url"
```

Then run:
```bash
./scripts/test-minimal-api.sh
```

## What This Tests
The minimal API provides:
- `/healthz` - Health check endpoint returning `{"ok": true}`
- `/` - Root endpoint with status message
- Minimal FastAPI application with no external dependencies
- Same container runtime environment as your main application

## Interpreting Results

### ✅ Minimal Service Stays Healthy
**Root cause: Application code**
- Your infrastructure (ECS, networking, load balancer) is working correctly
- The issue is in your application code, dependencies, or configuration
- Focus debugging on:
  - Application startup errors
  - Database connection issues
  - Environment variable problems
  - Memory/CPU resource limits
  - Third-party service integrations

### ❌ Minimal Service Also Fails
**Root cause: Infrastructure**
- Infrastructure components need investigation
- Check these areas:
  - ECS service configuration
  - Task definition settings
  - VPC/subnet networking
  - Security group rules
  - Load balancer configuration
  - Target group health checks
  - CloudWatch logs for ECS agent errors

## Monitoring Commands

### Check ECS Service Status
```bash
aws ecs describe-services \
    --cluster your-ecs-cluster \
    --services your-ecs-service
```

### View Recent Logs
```bash
aws logs tail /ecs/your-service --follow
```

### Check Task Health
```bash
aws ecs list-tasks \
    --cluster your-ecs-cluster \
    --service-name your-ecs-service
```

## Rollback Strategy
If the minimal service works but your main application doesn't:

1. Keep minimal service running as a baseline
2. Deploy your application changes incrementally
3. Test each change against the working minimal baseline
4. Use the minimal service as a quick rollback option

## Image Tagging Convention
Images are tagged as: `prod-smoke-YYYYMMDD-HHMMSS`

This allows you to:
- Easily identify test deployments
- Track when each test was performed
- Maintain multiple test images for comparison

## Next Steps After Testing
1. **If minimal works**: Focus on application debugging
2. **If minimal fails**: Investigate infrastructure components
3. **Document findings**: Update your incident response playbook
4. **Automate**: Consider adding this as a standard troubleshooting step