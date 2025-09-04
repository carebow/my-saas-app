# CareBow AWS Deployment

This directory contains all the necessary files to deploy CareBow to AWS using a modern, scalable architecture.

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   CloudFront    │────│   S3 (Frontend)  │    │   Users/Clients │
│   (CDN)         │    │   (React App)    │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                                               │
         │              ┌──────────────────┐            │
         └──────────────│  Application     │────────────┘
                        │  Load Balancer   │
                        └──────────────────┘
                                 │
                        ┌──────────────────┐
                        │   ECS Fargate    │
                        │   (Backend API)  │
                        └──────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
           ┌──────────────────┐    ┌──────────────────┐
           │   RDS PostgreSQL │    │  ElastiCache     │
           │   (Database)     │    │  (Redis Cache)   │
           └──────────────────┘    └──────────────────┘
```

## 🚀 Services Used

### Core Infrastructure
- **VPC**: Isolated network environment
- **ECS Fargate**: Serverless container hosting
- **Application Load Balancer**: Traffic distribution
- **RDS PostgreSQL**: Managed database
- **ElastiCache Redis**: Caching layer

### Frontend
- **S3**: Static website hosting
- **CloudFront**: Global CDN
- **ECR**: Container registry

### Security & Monitoring
- **Secrets Manager**: Secure credential storage
- **CloudWatch**: Logging and monitoring
- **IAM**: Access control

## 📋 Prerequisites

1. **AWS Account** with appropriate permissions
2. **AWS CLI** configured with credentials
3. **Terraform** >= 1.0
4. **Docker** for building images
5. **Node.js** >= 18 for frontend build

## 🛠️ Setup Instructions

### 1. Configure AWS Credentials

```bash
aws configure
# Enter your AWS Access Key ID, Secret Access Key, and region
```

### 2. Set Up Terraform Variables

```bash
cd aws
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your actual values
```

### 3. Deploy Infrastructure

```bash
# Option 1: Use the deployment script (recommended)
./aws/deploy/deploy.sh

# Option 2: Manual deployment
cd aws/infrastructure
terraform init
terraform plan
terraform apply
```

### 4. Set Up Secrets

After infrastructure deployment, update AWS Secrets Manager with your API keys:

```bash
# Update application secrets
aws secretsmanager update-secret \
  --secret-id carebow-app-secrets \
  --secret-string '{
    "openai_api_key": "your-openai-key",
    "stripe_secret_key": "your-stripe-key",
    "stripe_publishable_key": "your-stripe-public-key"
  }'
```

## 🔧 Configuration Files

### Infrastructure (`infrastructure/`)
- `main.tf`: Core VPC and networking
- `database.tf`: RDS and ElastiCache setup
- `ecs.tf`: Container orchestration
- `ecr.tf`: Container registry
- `cloudfront.tf`: CDN and S3 setup
- `secrets.tf`: Secrets management

### Deployment (`deploy/`)
- `backend.Dockerfile`: Backend container definition
- `frontend.Dockerfile`: Frontend container definition
- `deploy.sh`: Automated deployment script
- `nginx.conf`: Frontend web server configuration

## 🚀 Deployment Options

### 1. Automated Deployment (GitHub Actions)

Push to `main` branch triggers automatic deployment:

```yaml
# Required GitHub Secrets:
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
```

### 2. Manual Deployment

```bash
# Deploy everything
./aws/deploy/deploy.sh

# Deploy only infrastructure
cd aws/infrastructure && terraform apply

# Deploy only backend
docker build -f aws/deploy/backend.Dockerfile -t carebow-backend .
# Push to ECR and update ECS service

# Deploy only frontend
npm run build
aws s3 sync dist/ s3://your-bucket-name
```

## 📊 Monitoring & Logging

### CloudWatch Logs
- ECS logs: `/ecs/carebow`
- Application logs: Available in CloudWatch

### Health Checks
- Backend: `http://alb-dns/health`
- Frontend: `https://cloudfront-domain`

### Metrics
- ECS service metrics
- RDS performance insights
- CloudFront analytics

## 🔒 Security Features

### Network Security
- Private subnets for database and cache
- Security groups with minimal required access
- VPC isolation

### Data Security
- RDS encryption at rest
- ElastiCache encryption in transit
- S3 bucket encryption
- Secrets Manager for sensitive data

### Application Security
- Non-root container users
- IAM roles with least privilege
- HTTPS enforcement via CloudFront

## 💰 Cost Optimization

### Current Configuration (Estimated Monthly Cost)
- **ECS Fargate**: ~$30-50 (2 tasks, 0.5 vCPU, 1GB RAM)
- **RDS t3.micro**: ~$15-20
- **ElastiCache t3.micro**: ~$15-20
- **ALB**: ~$20
- **CloudFront**: ~$1-5 (depending on traffic)
- **S3**: ~$1-5
- **Total**: ~$80-120/month

### Cost Optimization Tips
1. Use Spot instances for non-critical workloads
2. Enable RDS storage autoscaling
3. Set up CloudWatch billing alerts
4. Use S3 lifecycle policies for old data

## 🔧 Troubleshooting

### Common Issues

1. **ECS Service Won't Start**
   ```bash
   aws ecs describe-services --cluster carebow-cluster --services carebow-service
   aws logs get-log-events --log-group-name /ecs/carebow --log-stream-name <stream-name>
   ```

2. **Database Connection Issues**
   ```bash
   # Check security groups and network ACLs
   aws ec2 describe-security-groups --group-ids <sg-id>
   ```

3. **Frontend Not Loading**
   ```bash
   # Check S3 bucket policy and CloudFront distribution
   aws s3 ls s3://your-bucket-name
   aws cloudfront get-distribution --id <distribution-id>
   ```

### Useful Commands

```bash
# Check ECS service status
aws ecs describe-services --cluster carebow-cluster --services carebow-service

# View logs
aws logs tail /ecs/carebow --follow

# Update ECS service
aws ecs update-service --cluster carebow-cluster --service carebow-service --force-new-deployment

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id <id> --paths "/*"
```

## 🔄 Updates & Maintenance

### Regular Updates
1. **Security patches**: Update base images monthly
2. **Dependencies**: Update npm and pip packages
3. **Terraform**: Keep infrastructure code updated

### Backup Strategy
- **RDS**: Automated backups (7 days retention)
- **S3**: Versioning enabled
- **Code**: Git repository

### Scaling
- **Horizontal**: Increase ECS desired count
- **Vertical**: Increase task CPU/memory
- **Database**: Upgrade RDS instance class

## 📞 Support

For deployment issues:
1. Check CloudWatch logs
2. Review Terraform state
3. Verify AWS service limits
4. Check security group rules

## 🎯 Next Steps

After successful deployment:
1. Set up custom domain with Route 53
2. Configure SSL certificate with ACM
3. Set up monitoring alerts
4. Implement backup strategies
5. Configure auto-scaling policies