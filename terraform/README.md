# 🏥 CareBow Backend Infrastructure

This directory contains the complete AWS infrastructure setup for CareBow using Terraform.

## 🏗️ Architecture Overview

- **ECS Fargate**: Containerized API service
- **RDS PostgreSQL**: Encrypted database with KMS
- **S3**: Secure report storage with presigned URLs
- **KMS**: Field-level encryption for PHI/PII
- **ALB**: Application Load Balancer for traffic routing
- **VPC**: Isolated network with private/public subnets
- **Secrets Manager**: Secure credential storage

## 🚀 Quick Start

### 1. Prerequisites

```bash
# Install Terraform
brew install terraform

# Install AWS CLI
brew install awscli

# Configure AWS credentials
aws configure
```

### 2. Initialize Terraform

```bash
cd terraform
terraform init
```

### 3. Configure Variables

```bash
# Copy the example file
cp terraform.tfvars.example terraform.tfvars

# Edit with your values
nano terraform.tfvars
```

### 4. Deploy Infrastructure

```bash
# Plan the deployment
terraform plan

# Apply the changes
terraform apply
```

## 🔐 Security Features

### HIPAA Compliance
- **Field-level encryption** using AWS KMS
- **Encrypted RDS** with customer-managed keys
- **S3 encryption** with KMS
- **VPC isolation** with private subnets
- **Secrets Manager** for sensitive data

### Network Security
- **Private subnets** for database and ECS tasks
- **Security groups** with least privilege access
- **NAT Gateway** for outbound internet access
- **No public database access**

## 📊 Infrastructure Components

### Database (RDS PostgreSQL)
- **Engine**: PostgreSQL 16.3
- **Instance**: db.t4g.medium
- **Storage**: 50GB encrypted
- **Backup**: 7-day retention
- **Multi-AZ**: High availability

### Application (ECS Fargate)
- **CPU**: 512 units
- **Memory**: 1024 MB
- **Desired Count**: 2 instances
- **Auto Scaling**: Ready for configuration

### Storage (S3)
- **Encryption**: KMS-managed keys
- **Access**: Presigned URLs only
- **Public Access**: Blocked

## 🔧 Configuration

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `aws_region` | AWS region | `us-east-1` |
| `env` | Environment | `staging` |
| `db_password` | Database password | `secure-password` |
| `api_image` | ECR image URI | `123456789.dkr.ecr.us-east-1.amazonaws.com/carebow-api:latest` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `vpc_cidr` | VPC CIDR block | `10.0.0.0/16` |
| `db_instance_class` | RDS instance class | `db.t4g.medium` |
| `reports_bucket` | S3 bucket name | `carebow-reports-example` |

## 🚀 Deployment Steps

### 1. Create ECR Repository

```bash
# Create ECR repository
aws ecr create-repository --repository-name carebow-api

# Get login token
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789.dkr.ecr.us-east-1.amazonaws.com
```

### 2. Build and Push Docker Image

```bash
# Build the image
docker build -t carebow-api .

# Tag for ECR
docker tag carebow-api:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/carebow-api:latest

# Push to ECR
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/carebow-api:latest
```

### 3. Deploy Infrastructure

```bash
# Initialize Terraform
terraform init

# Plan deployment
terraform plan

# Apply changes
terraform apply
```

## 📋 Post-Deployment

### 1. Configure Secrets

```bash
# Set OpenAI API key
aws secretsmanager put-secret-value \
  --secret-id carebow/openai-api-key \
  --secret-string "your-openai-api-key"

# Set Stripe secret key
aws secretsmanager put-secret-value \
  --secret-id carebow/stripe-secret-key \
  --secret-string "your-stripe-secret-key"

# Set JWT secret
aws secretsmanager put-secret-value \
  --secret-id carebow/jwt-secret \
  --secret-string "your-jwt-secret"
```

### 2. Configure DNS

```bash
# Get ALB DNS name
terraform output alb_dns_name

# Point your domain to the ALB
# api.carebow.com -> ALB_DNS_NAME
```

### 3. Test Deployment

```bash
# Test health endpoint
curl https://api.carebow.com/healthz

# Test API endpoints
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" https://api.carebow.com/me
```

## 🔄 Updates and Maintenance

### Update API

```bash
# Build new image
docker build -t carebow-api .

# Tag and push
docker tag carebow-api:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/carebow-api:latest
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/carebow-api:latest

# Update ECS service
aws ecs update-service --cluster carebow-cluster --service carebow-api --force-new-deployment
```

### Scale Service

```bash
# Update desired count
aws ecs update-service --cluster carebow-cluster --service carebow-api --desired-count 5
```

## 🗑️ Cleanup

```bash
# Destroy infrastructure
terraform destroy

# Confirm destruction
yes
```

## 📚 Additional Resources

- [Terraform AWS Provider Documentation](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [ECS Fargate Documentation](https://docs.aws.amazon.com/ecs/latest/developerguide/AWS_Fargate.html)
- [RDS PostgreSQL Documentation](https://docs.aws.amazon.com/rds/latest/userguide/CHAP_PostgreSQL.html)
- [AWS KMS Documentation](https://docs.aws.amazon.com/kms/latest/developerguide/)

## 🆘 Troubleshooting

### Common Issues

1. **ECS Task Failing**: Check CloudWatch logs
2. **Database Connection Issues**: Verify security groups
3. **S3 Access Denied**: Check IAM policies
4. **KMS Decryption Errors**: Verify key permissions

### Useful Commands

```bash
# Check ECS service status
aws ecs describe-services --cluster carebow-cluster --services carebow-api

# View CloudWatch logs
aws logs tail /ecs/carebow-api --follow

# Check RDS status
aws rds describe-db-instances --db-instance-identifier carebow-db
```
