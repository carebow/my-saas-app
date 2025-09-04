# 🚀 CareBow AWS Deployment Guide

Complete guide to deploy your CareBow healthcare platform to AWS with enterprise-grade infrastructure.

## 📋 Prerequisites

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

### AWS Account Setup
1. **Create AWS Account** (if you don't have one)
2. **Create IAM User** with programmatic access
3. **Attach Policies**:
   - `AmazonEC2FullAccess`
   - `AmazonECSFullAccess`
   - `AmazonRDSFullAccess`
   - `AmazonS3FullAccess`
   - `CloudFrontFullAccess`
   - `AmazonVPCFullAccess`
   - `IAMFullAccess`
   - `AmazonElastiCacheFullAccess`
   - `SecretsManagerReadWrite`

## 🔧 Step-by-Step Deployment

### Step 1: Configure AWS Credentials

```bash
aws configure
# AWS Access Key ID: [Your Access Key]
# AWS Secret Access Key: [Your Secret Key]
# Default region name: us-east-1
# Default output format: json
```

### Step 2: Prepare Configuration

```bash
# Copy and edit Terraform variables
cp aws/terraform.tfvars.example aws/terraform.tfvars

# Edit with your values
nano aws/terraform.tfvars
```

**Required Variables:**
```hcl
# aws/terraform.tfvars
aws_region = "us-east-1"
environment = "production"
project_name = "carebow"

# API Keys (get these from respective services)
openai_api_key = "sk-..."
stripe_secret_key = "sk_live_..."
stripe_publishable_key = "pk_live_..."
stripe_webhook_secret = "whsec_..."

# Email Configuration
smtp_user = "your-email@gmail.com"
smtp_password = "your-app-password"
emails_from_email = "noreply@carebow.com"
```

### Step 3: Deploy Infrastructure

```bash
# Option 1: Automated deployment (recommended)
./aws/deploy/deploy.sh

# Option 2: Manual step-by-step
cd aws/infrastructure
terraform init
terraform plan -var-file="../terraform.tfvars"
terraform apply -var-file="../terraform.tfvars"
```

### Step 4: Update Secrets (After Infrastructure Deployment)

```bash
# Get the secret ARNs from Terraform output
cd aws/infrastructure
terraform output

# Update application secrets with your actual API keys
aws secretsmanager update-secret \
  --secret-id carebow-app-secrets \
  --secret-string '{
    "openai_api_key": "your-actual-openai-key",
    "stripe_secret_key": "your-actual-stripe-key",
    "stripe_publishable_key": "your-actual-stripe-public-key",
    "stripe_webhook_secret": "your-webhook-secret",
    "smtp_user": "your-email@gmail.com",
    "smtp_password": "your-app-password"
  }'
```

### Step 5: Deploy Application

```bash
# Build and push backend
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin [ECR_URI]
docker build -f aws/deploy/backend.Dockerfile -t carebow-backend .
docker tag carebow-backend:latest [ECR_BACKEND_URI]:latest
docker push [ECR_BACKEND_URI]:latest

# Build and deploy frontend
npm run build
aws s3 sync dist/ s3://[S3_BUCKET_NAME] --delete

# Update ECS service
aws ecs update-service --cluster carebow-cluster --service carebow-service --force-new-deployment
```

## 🏗️ Infrastructure Components

### Core Services
- **VPC**: Isolated network (10.0.0.0/16)
- **ECS Fargate**: Serverless containers (2 tasks, auto-scaling)
- **RDS PostgreSQL**: Managed database (t3.micro, encrypted)
- **ElastiCache Redis**: Caching layer (t3.micro, encrypted)
- **Application Load Balancer**: Traffic distribution

### Frontend
- **S3**: Static website hosting
- **CloudFront**: Global CDN with caching
- **Route 53**: DNS management (optional)

### Security
- **Secrets Manager**: Secure credential storage
- **IAM Roles**: Least privilege access
- **Security Groups**: Network-level security
- **VPC**: Network isolation

## 🔒 Security Best Practices

### Network Security
```bash
# Private subnets for database and cache
# Public subnets only for load balancer
# Security groups with minimal required access
```

### Data Security
```bash
# All data encrypted at rest and in transit
# Secrets stored in AWS Secrets Manager
# Regular automated backups
```

### Application Security
```bash
# Non-root container users
# HTTPS enforcement
# CORS properly configured
```

## 📊 Monitoring & Logging

### CloudWatch Setup
```bash
# View ECS logs
aws logs tail /ecs/carebow --follow

# View RDS performance
aws rds describe-db-instances --db-instance-identifier carebow-db

# CloudFront metrics
aws cloudwatch get-metric-statistics \
  --namespace AWS/CloudFront \
  --metric-name Requests \
  --dimensions Name=DistributionId,Value=[DISTRIBUTION_ID] \
  --start-time 2024-01-01T00:00:00Z \
  --end-time 2024-01-02T00:00:00Z \
  --period 3600 \
  --statistics Sum
```

### Health Checks
```bash
# Backend health
curl http://[ALB_DNS]/health

# Frontend health
curl https://[CLOUDFRONT_DOMAIN]

# Database connectivity
aws rds describe-db-instances --db-instance-identifier carebow-db
```

## 💰 Cost Optimization

### Current Estimated Costs (Monthly)
- **ECS Fargate**: $30-50 (2 tasks)
- **RDS t3.micro**: $15-20
- **ElastiCache t3.micro**: $15-20
- **ALB**: $20
- **CloudFront**: $1-5
- **S3**: $1-5
- **Secrets Manager**: $1-2
- **Total**: ~$80-120/month

### Cost Reduction Tips
```bash
# Use Reserved Instances for predictable workloads
# Enable RDS storage autoscaling
# Set up CloudWatch billing alerts
# Use S3 lifecycle policies
# Monitor and optimize ECS task sizing
```

## 🔄 CI/CD with GitHub Actions

### Setup GitHub Secrets
```bash
# Required secrets in GitHub repository:
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
```

### Automatic Deployment
- Push to `main` branch triggers deployment
- Runs tests before deployment
- Updates both frontend and backend
- Performs health checks

## 🛠️ Troubleshooting

### Common Issues

#### ECS Service Won't Start
```bash
# Check service events
aws ecs describe-services --cluster carebow-cluster --services carebow-service

# Check task definition
aws ecs describe-task-definition --task-definition carebow-app

# View logs
aws logs get-log-events --log-group-name /ecs/carebow --log-stream-name [STREAM_NAME]
```

#### Database Connection Issues
```bash
# Check security groups
aws ec2 describe-security-groups --group-ids [SG_ID]

# Test connectivity from ECS task
aws ecs execute-command --cluster carebow-cluster --task [TASK_ARN] --interactive --command "/bin/bash"
```

#### Frontend Not Loading
```bash
# Check S3 bucket contents
aws s3 ls s3://[BUCKET_NAME] --recursive

# Check CloudFront distribution
aws cloudfront get-distribution --id [DISTRIBUTION_ID]

# Invalidate cache
aws cloudfront create-invalidation --distribution-id [DISTRIBUTION_ID] --paths "/*"
```

### Useful Commands

```bash
# Restart ECS service
aws ecs update-service --cluster carebow-cluster --service carebow-service --force-new-deployment

# Scale ECS service
aws ecs update-service --cluster carebow-cluster --service carebow-service --desired-count 4

# View RDS logs
aws rds download-db-log-file-portion --db-instance-identifier carebow-db --log-file-name error/postgresql.log

# Update secrets
aws secretsmanager update-secret --secret-id carebow-app-secrets --secret-string '{"key":"value"}'
```

## 🔧 Maintenance

### Regular Tasks
- **Weekly**: Check CloudWatch metrics and logs
- **Monthly**: Update container images and dependencies
- **Quarterly**: Review and optimize costs
- **Annually**: Security audit and compliance review

### Backup Strategy
- **RDS**: Automated backups (7 days retention)
- **S3**: Versioning enabled
- **Secrets**: Stored in version control (encrypted)

### Scaling Guidelines
```bash
# Horizontal scaling (more tasks)
aws ecs update-service --cluster carebow-cluster --service carebow-service --desired-count 4

# Vertical scaling (more resources per task)
# Update task definition with higher CPU/memory values
```

## 🎯 Production Checklist

### Before Going Live
- [ ] All secrets properly configured
- [ ] SSL certificate set up (if using custom domain)
- [ ] Monitoring and alerting configured
- [ ] Backup strategy implemented
- [ ] Security groups reviewed
- [ ] Cost monitoring set up
- [ ] Health checks passing
- [ ] Load testing completed

### Post-Deployment
- [ ] Monitor application performance
- [ ] Set up CloudWatch alarms
- [ ] Configure log retention policies
- [ ] Document runbooks
- [ ] Train team on AWS console

## 📞 Support Resources

### AWS Documentation
- [ECS Best Practices](https://docs.aws.amazon.com/AmazonECS/latest/bestpracticesguide/)
- [RDS User Guide](https://docs.aws.amazon.com/rds/)
- [CloudFront Developer Guide](https://docs.aws.amazon.com/cloudfront/)

### Monitoring Tools
- AWS CloudWatch
- AWS X-Ray (for tracing)
- AWS Config (for compliance)

### Cost Management
- AWS Cost Explorer
- AWS Budgets
- AWS Trusted Advisor

## 🚀 Next Steps

After successful deployment:

1. **Custom Domain**: Set up Route 53 with your domain
2. **SSL Certificate**: Use AWS Certificate Manager
3. **Advanced Monitoring**: Set up detailed CloudWatch dashboards
4. **Auto Scaling**: Configure advanced scaling policies
5. **Multi-Region**: Consider multi-region deployment for HA
6. **CDN Optimization**: Fine-tune CloudFront caching rules

---

**🎉 Congratulations!** Your CareBow platform is now running on AWS with enterprise-grade infrastructure, security, and scalability!