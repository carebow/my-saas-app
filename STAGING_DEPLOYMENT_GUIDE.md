# 🚀 CareBow Staging Deployment Guide

Complete guide to deploy your CareBow application to AWS staging environment using Terraform.

## 📋 Overview

This guide walks you through setting up a staging environment that mirrors your production setup but with cost-optimized resources:

- **ECS Fargate**: Single task (vs 2 in production)
- **RDS**: Smaller instance with shorter backup retention
- **ElastiCache**: Single node (vs multi-AZ in production)
- **CloudFront**: Shorter cache times for faster testing

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   CloudFront    │────│   S3 (Frontend)  │    │   Users/Clients │
│   (Staging CDN) │    │   (React App)    │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                                               │
         │              ┌──────────────────┐            │
         └──────────────│  Application     │────────────┘
                        │  Load Balancer   │
                        └──────────────────┘
                                 │
                        ┌──────────────────┐
                        │   ECS Fargate    │
                        │   (1 Task)       │
                        └──────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
           ┌──────────────────┐    ┌──────────────────┐
           │   RDS PostgreSQL │    │  ElastiCache     │
           │   (Staging DB)   │    │  (Single Node)   │
           └──────────────────┘    └──────────────────┘
```

## 🛠️ Prerequisites

### Required Tools
```bash
# Install AWS CLI
curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
sudo installer -pkg AWSCLIV2.pkg -target /

# Install Terraform
brew install terraform

# Install Docker
brew install docker

# Verify installations
aws --version
terraform --version
docker --version
```

### AWS Permissions
Your AWS user needs these policies:
- `AmazonEC2FullAccess`
- `AmazonECSFullAccess`
- `AmazonRDSFullAccess`
- `AmazonS3FullAccess`
- `CloudFrontFullAccess`
- `AmazonVPCFullAccess`
- `IAMFullAccess`
- `AmazonElastiCacheFullAccess`
- `SecretsManagerReadWrite`

## 🚀 Quick Start

### 1. Configure AWS Credentials
```bash
aws configure
# AWS Access Key ID: [Your Access Key]
# AWS Secret Access Key: [Your Secret Key]
# Default region name: us-east-1
# Default output format: json
```

### 2. Configure Staging Variables
```bash
# Copy the staging variables template
cp aws/terraform.staging.tfvars.example aws/terraform.staging.tfvars

# Edit with your values
nano aws/terraform.staging.tfvars
```

**Required Configuration:**
```hcl
# aws/terraform.staging.tfvars
aws_region = "us-east-1"
environment = "staging"
project_name = "carebow"

# Enable staging environment
staging_enabled = true
staging_domain_prefix = "staging"

# API Keys - Use test keys for staging
openai_api_key = "sk-..."  # Your OpenAI API key
stripe_secret_key = "sk_test_..."  # Stripe TEST secret key
stripe_publishable_key = "pk_test_..."  # Stripe TEST publishable key
stripe_webhook_secret = "whsec_..."  # Stripe TEST webhook secret

# Email Configuration
smtp_host = "smtp.gmail.com"
smtp_port = "587"
smtp_user = "your-email@gmail.com"
smtp_password = "your-app-password"
emails_from_email = "noreply@carebow.com"
```

### 3. Deploy Staging Environment
```bash
# Option 1: Use the automated script (recommended)
./aws/deploy/deploy-staging.sh

# Option 2: Manual deployment
cd aws/infrastructure
terraform init
terraform plan -var-file="../terraform.staging.tfvars"
terraform apply -var-file="../terraform.staging.tfvars"
```

## 📁 New Files Added

### Infrastructure Files
- `aws/infrastructure/staging.tf` - Staging-specific resources
- `aws/terraform.staging.tfvars` - Staging configuration
- `aws/deploy/deploy-staging.sh` - Staging deployment script

### CI/CD Files
- `.github/workflows/deploy-staging.yml` - GitHub Actions workflow

### Documentation
- `STAGING_DEPLOYMENT_GUIDE.md` - This guide

## 🔧 Terraform Resources Added

### Staging-Specific Resources

#### ECS Resources
```hcl
# Staging ECS Cluster
resource "aws_ecs_cluster" "staging" {
  name = "${var.project_name}-staging-cluster"
  # Container insights enabled
}

# Staging Task Definition
resource "aws_ecs_task_definition" "staging" {
  family = "${var.project_name}-staging-app"
  cpu    = 256   # Smaller than production
  memory = 512   # Smaller than production
  # Uses staging image tag
}

# Staging ECS Service
resource "aws_ecs_service" "staging" {
  desired_count = 1  # Single task for staging
  # Connected to staging target group
}
```

#### Database Resources
```hcl
# Staging RDS Instance
resource "aws_db_instance" "staging" {
  identifier = "${var.project_name}-staging-db"
  db_name    = "carebow_staging"
  
  # Cost optimizations
  backup_retention_period = 3  # vs 7 in production
  monitoring_interval = 0      # Disable enhanced monitoring
  deletion_protection = false  # Allow easy cleanup
}

# Staging Redis Cluster
resource "aws_elasticache_replication_group" "staging" {
  num_cache_clusters = 1          # Single node
  automatic_failover_enabled = false
  multi_az_enabled = false
}
```

#### Frontend Resources
```hcl
# Staging S3 Bucket
resource "aws_s3_bucket" "staging_frontend" {
  bucket = "${var.project_name}-staging-frontend-${random_id.hex}"
}

# Staging CloudFront Distribution
resource "aws_cloudfront_distribution" "staging_frontend" {
  # Shorter cache times for faster testing
  default_ttl = 0      # No caching for staging
  max_ttl     = 3600   # Short cache
}
```

#### Secrets Management
```hcl
# Staging Secrets
resource "aws_secretsmanager_secret" "staging_app_secrets" {
  name = "${var.project_name}-staging-app-secrets"
}

# Separate staging database secrets
resource "aws_secretsmanager_secret" "staging_db_password" {
  name = "${var.project_name}-staging-db-password"
}
```

## 🔄 CI/CD Integration

### GitHub Actions Setup

1. **Add GitHub Secrets:**
```bash
# Required secrets in your GitHub repository:
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
STAGING_OPENAI_API_KEY
STAGING_STRIPE_SECRET_KEY
STAGING_STRIPE_PUBLISHABLE_KEY
STAGING_STRIPE_WEBHOOK_SECRET
SMTP_USER
SMTP_PASSWORD
EMAILS_FROM_EMAIL
```

2. **Workflow Triggers:**
- Push to `develop` or `staging` branch
- Pull requests to `main` branch
- Manual workflow dispatch

3. **Deployment Process:**
- Run tests (backend + frontend)
- Deploy infrastructure with Terraform
- Build and push Docker image to ECR
- Update ECS service
- Build and deploy frontend to S3
- Invalidate CloudFront cache
- Run health checks

## 💰 Cost Comparison

### Staging vs Production (Monthly Estimates)

| Service | Production | Staging | Savings |
|---------|------------|---------|---------|
| ECS Fargate | $30-50 (2 tasks) | $15-25 (1 task) | ~50% |
| RDS | $15-20 | $15-20 | $0 |
| ElastiCache | $15-20 | $15-20 | $0 |
| ALB | $20 | $20 | $0 |
| CloudFront | $1-5 | $1-5 | $0 |
| S3 | $1-5 | $1-5 | $0 |
| **Total** | **$80-120** | **$65-95** | **~20%** |

## 🔧 Management Commands

### View Staging Resources
```bash
# List staging ECS services
aws ecs list-services --cluster carebow-staging-cluster

# View staging logs
aws logs tail /ecs/carebow-staging --follow

# Check staging database
aws rds describe-db-instances --db-instance-identifier carebow-staging-db

# List staging S3 contents
aws s3 ls s3://carebow-staging-frontend-xxxxx
```

### Update Staging Secrets
```bash
# Update staging application secrets
aws secretsmanager update-secret \
  --secret-id carebow-staging-app-secrets \
  --secret-string '{
    "openai_api_key": "your-new-key",
    "stripe_secret_key": "sk_test_new_key"
  }'
```

### Redeploy Staging
```bash
# Redeploy everything
./aws/deploy/deploy-staging.sh

# Redeploy only backend
aws ecs update-service \
  --cluster carebow-staging-cluster \
  --service carebow-staging-service \
  --force-new-deployment

# Redeploy only frontend
npm run build
aws s3 sync dist/ s3://your-staging-bucket --delete
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

## 🧪 Testing Staging Environment

### Health Checks
```bash
# Backend health check
curl https://your-staging-domain.cloudfront.net/api/health

# Frontend check
curl https://your-staging-domain.cloudfront.net

# Database connectivity (from ECS task)
aws ecs execute-command \
  --cluster carebow-staging-cluster \
  --task TASK_ARN \
  --interactive \
  --command "/bin/bash"
```

### Load Testing
```bash
# Simple load test with curl
for i in {1..10}; do
  curl -w "%{time_total}\n" -o /dev/null -s \
    https://your-staging-domain.cloudfront.net/api/health
done
```

## 🔒 Security Considerations

### Staging-Specific Security
- Uses test API keys (Stripe, etc.)
- Separate database and secrets
- Same network security as production
- Shorter log retention (7 days vs 30)

### Access Control
- Same IAM roles and policies
- Separate secrets management
- Network isolation maintained

## 🚨 Troubleshooting

### Common Issues

#### ECS Service Won't Start
```bash
# Check service events
aws ecs describe-services \
  --cluster carebow-staging-cluster \
  --services carebow-staging-service

# Check task logs
aws logs get-log-events \
  --log-group-name /ecs/carebow-staging \
  --log-stream-name STREAM_NAME
```

#### Frontend Not Loading
```bash
# Check S3 bucket
aws s3 ls s3://your-staging-bucket --recursive

# Check CloudFront distribution
aws cloudfront get-distribution --id YOUR_DISTRIBUTION_ID

# Invalidate cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_ID \
  --paths "/*"
```

#### Database Connection Issues
```bash
# Check security groups
aws ec2 describe-security-groups --group-ids sg-xxxxx

# Test from ECS task
aws ecs execute-command \
  --cluster carebow-staging-cluster \
  --task TASK_ARN \
  --interactive \
  --command "psql $DATABASE_URL"
```

## 🧹 Cleanup

### Destroy Staging Environment
```bash
# Destroy all staging resources
cd aws/infrastructure
terraform destroy -var-file="../terraform.staging.tfvars"

# Or destroy specific resources
terraform destroy -target=aws_ecs_service.staging -var-file="../terraform.staging.tfvars"
```

### Cost Monitoring
```bash
# Set up billing alerts
aws budgets create-budget \
  --account-id YOUR_ACCOUNT_ID \
  --budget '{
    "BudgetName": "CareBow-Staging-Budget",
    "BudgetLimit": {
      "Amount": "50",
      "Unit": "USD"
    },
    "TimeUnit": "MONTHLY",
    "BudgetType": "COST"
  }'
```

## 🎯 Next Steps

After successful staging deployment:

1. **Configure Custom Domain** (optional)
   ```bash
   # Add Route 53 hosted zone
   # Configure SSL certificate with ACM
   # Update CloudFront distribution
   ```

2. **Set Up Monitoring**
   ```bash
   # CloudWatch dashboards
   # Custom metrics and alarms
   # Log aggregation
   ```

3. **Implement Testing Pipeline**
   ```bash
   # Automated testing against staging
   # Performance testing
   # Security scanning
   ```

4. **Database Migration Testing**
   ```bash
   # Test migrations on staging first
   # Backup and restore procedures
   # Data seeding for testing
   ```

## 📞 Support

### Useful Resources
- [AWS ECS Documentation](https://docs.aws.amazon.com/ecs/)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [CloudFront Documentation](https://docs.aws.amazon.com/cloudfront/)

### Getting Help
1. Check CloudWatch logs first
2. Review Terraform state and outputs
3. Verify AWS service limits
4. Check security group configurations

---

**🎉 Your staging environment is ready!** You now have a complete staging setup that mirrors production but optimized for cost and testing speed.