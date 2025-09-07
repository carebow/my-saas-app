# 🏗️ CareBow AWS-Native Architecture

## Overview

CareBow is a HIPAA-compliant, AWS-native health AI platform that provides personalized health advice through ChatGPT-like conversations. The architecture is designed for scalability, security, and compliance with healthcare regulations.

## 🎯 Key Features

- **ChatGPT-like Experience**: Natural, empathetic conversations with memory
- **Personalized Remedies**: AI-generated health suggestions tailored to individual users
- **Lifetime Data Storage**: Persistent chat history until user deletion
- **HIPAA Compliance**: Full compliance with healthcare data regulations
- **AWS-Native**: Built entirely on AWS services for maximum reliability

## 🏛️ Architecture Components

### Frontend Layer
- **S3 Static Hosting**: React application served from S3
- **CloudFront CDN**: Global content delivery with TLS termination
- **WAF Protection**: Web Application Firewall for security

### Authentication & Authorization
- **Amazon Cognito**: User authentication and authorization
- **JWT Tokens**: Secure API access with role-based permissions
- **MFA Support**: Multi-factor authentication for enhanced security

### API Layer
- **API Gateway**: RESTful API management and throttling
- **ECS Fargate**: Containerized FastAPI backend
- **Application Load Balancer**: Traffic distribution and health checks

### Data Layer
- **RDS PostgreSQL**: Primary database with pgvector for embeddings
- **OpenSearch**: Full-text search and vector similarity search
- **S3**: Object storage for chat data, exports, and static assets

### AI & Processing
- **OpenAI GPT-4o**: Natural language processing and response generation
- **ElevenLabs**: Voice input/output processing
- **Lambda Functions**: Serverless processing for data export/deletion

### Security & Compliance
- **KMS**: Encryption key management
- **Secrets Manager**: Secure credential storage
- **CloudTrail**: Audit logging
- **GuardDuty**: Threat detection
- **WAF**: Web application firewall

## 🔧 Infrastructure as Code

### Terraform Modules

```
aws/terraform/
├── modules/
│   ├── vpc/                 # VPC and networking
│   ├── cognito/             # User authentication
│   ├── rds/                 # Database with pgvector
│   ├── s3/                  # Object storage
│   ├── opensearch/          # Search and analytics
│   ├── ecs/                 # Container orchestration
│   ├── lambda/              # Serverless functions
│   ├── step-functions/      # Workflow orchestration
│   ├── cloudfront/          # CDN and caching
│   ├── api-gateway/         # API management
│   ├── waf/                 # Web application firewall
│   └── cloudwatch/          # Monitoring and logging
├── main.tf                  # Main configuration
├── variables.tf             # Input variables
└── outputs.tf               # Output values
```

### Key Infrastructure Components

#### VPC Module
- Private and public subnets across multiple AZs
- NAT Gateway for outbound internet access
- VPC endpoints for AWS services
- Security groups with least privilege access

#### RDS Module
- PostgreSQL 15 with pgvector extension
- Multi-AZ deployment for high availability
- Automated backups and point-in-time recovery
- Encryption at rest and in transit

#### Cognito Module
- User pools with custom attributes
- App clients for web, mobile, and API
- Identity pools for AWS resource access
- MFA and advanced security features

## 🚀 Deployment

### Prerequisites

1. **AWS CLI** configured with appropriate permissions
2. **Terraform** >= 1.0
3. **Docker** for containerization
4. **Node.js** for frontend build
5. **Python 3.8+** for backend

### Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd my-saas-app

# Deploy to AWS
cd aws
./deploy-aws-native.sh dev us-east-1
```

### Manual Deployment

1. **Deploy Infrastructure**
   ```bash
   cd aws/terraform
   terraform init
   terraform plan -var="environment=dev"
   terraform apply
   ```

2. **Build and Deploy Backend**
   ```bash
   cd backend
   docker build -t carebow-backend .
   # Push to ECR and update ECS service
   ```

3. **Build and Deploy Frontend**
   ```bash
   npm run build
   aws s3 sync dist/ s3://carebow-static-website/
   ```

## 🔐 Security & Compliance

### HIPAA Compliance

- **Encryption**: All data encrypted at rest and in transit
- **Access Controls**: IAM roles with least privilege
- **Audit Logging**: Comprehensive logging with CloudTrail
- **Data Residency**: Data stays within specified regions
- **Backup & Recovery**: Automated backups with retention policies

### Security Features

- **WAF Rules**: Protection against OWASP Top 10
- **Rate Limiting**: API throttling and DDoS protection
- **VPC Security**: Private subnets and security groups
- **Secrets Management**: Secure credential storage
- **Monitoring**: Real-time security monitoring

## 📊 Monitoring & Observability

### CloudWatch Metrics
- Application performance metrics
- Infrastructure health metrics
- Custom business metrics
- Cost and usage metrics

### Logging
- Application logs in CloudWatch
- Access logs in S3
- Audit logs in CloudTrail
- Security logs in GuardDuty

### Alerting
- SNS notifications for critical events
- CloudWatch alarms for thresholds
- Automated incident response
- Cost anomaly detection

## 💰 Cost Optimization

### Compute
- ECS Fargate for right-sized containers
- Lambda for event-driven processing
- Spot instances for non-critical workloads
- Auto-scaling based on demand

### Storage
- S3 Intelligent Tiering
- Lifecycle policies for old data
- Compression and deduplication
- Regular storage audits

### Database
- RDS auto-scaling
- Read replicas for read-heavy workloads
- Performance tuning
- Reserved instances for predictable workloads

## 🔄 Data Flow

### Chat Message Processing

1. **User Input**: Message sent via API Gateway
2. **Authentication**: Cognito JWT validation
3. **Processing**: ECS Fargate processes with AI service
4. **Memory Retrieval**: OpenSearch for conversation context
5. **AI Response**: OpenAI GPT-4o generates response
6. **Storage**: Message stored in RDS and S3
7. **Response**: AI response returned to user

### Data Export Process

1. **Request**: User requests data export
2. **Validation**: Lambda validates request
3. **Orchestration**: Step Functions coordinates export
4. **Data Collection**: Lambda collects user data
5. **Encryption**: Data encrypted and stored in S3
6. **Notification**: User notified via SNS
7. **Download**: Presigned URL provided for download

### Data Deletion Process

1. **Request**: User requests account deletion
2. **Grace Period**: 7-day grace period begins
3. **Orchestration**: Step Functions coordinates deletion
4. **Database Cleanup**: RDS data purged
5. **S3 Cleanup**: User objects deleted
6. **Search Cleanup**: OpenSearch indexes cleared
7. **Cognito Cleanup**: User account disabled
8. **Audit Log**: Deletion logged for compliance

## 🛠️ Development

### Local Development

```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py

# Frontend
npm install
npm run dev
```

### Testing

```bash
# Backend tests
cd backend
python -m pytest tests/ -v --cov=app

# Frontend tests
npm test
```

### Database Migrations

```bash
cd backend
python migrate.py
```

## 📈 Scaling

### Horizontal Scaling
- ECS auto-scaling based on CPU/memory
- RDS read replicas for read-heavy workloads
- CloudFront for global content delivery
- Lambda concurrency limits

### Vertical Scaling
- ECS task resource allocation
- RDS instance class upgrades
- OpenSearch instance scaling
- Lambda memory and timeout configuration

## 🔧 Maintenance

### Regular Tasks
- Security updates and patches
- Performance monitoring and optimization
- Cost analysis and optimization
- Compliance audits and reviews

### Backup Strategy
- RDS automated backups (7 days)
- S3 versioning and lifecycle policies
- OpenSearch snapshots
- Cross-region replication for critical data

## 📚 Documentation

- [API Documentation](docs/api.md)
- [Deployment Guide](docs/deployment.md)
- [Security Guide](docs/security.md)
- [Monitoring Guide](docs/monitoring.md)
- [Troubleshooting Guide](docs/troubleshooting.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ for better healthcare through AI**
