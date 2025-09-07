# Enhanced Chat Deployment Guide

This guide covers the deployment of the enhanced Ask CareBow chat system with ChatGPT-like functionality, personalized remedies, and lifetime data storage.

## 🚀 Overview

The enhanced chat system provides:
- **ChatGPT-like Experience**: Continuous conversations with memory across sessions
- **Personalized Remedies**: AI-generated remedies tailored to user's health profile
- **Empathetic AI**: Comfort and reassurance built into every interaction
- **Lifetime Data Storage**: All conversations and memories stored until user deletion
- **Privacy Controls**: Full GDPR compliance with data export and deletion
- **Voice Support**: Speech-to-text and text-to-speech capabilities

## 📋 Prerequisites

- AWS Account with appropriate permissions
- Terraform installed (v1.0+)
- Docker installed
- Python 3.9+
- Node.js 18+
- PostgreSQL database
- OpenAI API key
- ElevenLabs API key (for voice features)

## 🏗️ Architecture

### Backend Components
- **FastAPI Application**: Enhanced chat API with memory and personalization
- **PostgreSQL Database**: Stores conversations, memories, and user data
- **OpenSearch**: Vector search for conversation memory
- **S3 Buckets**: Store voice recordings, exports, and chat data
- **Lambda Functions**: Handle data export and deletion workflows
- **Step Functions**: Orchestrate complex data processing workflows

### Frontend Components
- **React Application**: ChatGPT-like chat interface
- **Voice Integration**: ElevenLabs for speech-to-text and TTS
- **Memory Management**: Search and manage conversation memories
- **Privacy Controls**: Data export and deletion interfaces

## 🗄️ Database Setup

### 1. Run Database Migrations

```bash
cd backend
alembic upgrade head
```

### 2. Verify Enhanced Chat Tables

The following tables will be created:
- `chat_sessions` - Chat sessions with ChatGPT-like features
- `chat_messages` - Messages with memory and empathy data
- `personalized_remedies` - AI-generated personalized remedies
- `conversation_memory` - Long-term conversation memory
- `data_exports` - Track data export requests
- `data_deletions` - Track data deletion requests
- `user_preferences` - Enhanced user preferences

## 🚀 AWS Infrastructure Deployment

### 1. Configure Terraform Variables

Create `terraform.tfvars`:

```hcl
project_name = "carebow"
environment = "production"
vpc_id = "vpc-xxxxxxxxx"
vpc_cidr = "10.0.0.0/16"
private_subnet_ids = ["subnet-xxxxxxxxx", "subnet-yyyyyyyyy"]
api_gateway_arn = "arn:aws:execute-api:region:account:api-id/stage"
rds_endpoint = "your-rds-endpoint.amazonaws.com"
rds_database = "carebow"
rds_username = "carebow_user"
```

### 2. Deploy Infrastructure

```bash
cd aws/infrastructure
terraform init
terraform plan
terraform apply
```

### 3. Configure Secrets Manager

Store sensitive configuration in AWS Secrets Manager:

```bash
# RDS Credentials
aws secretsmanager create-secret \
  --name "carebow/rds/credentials" \
  --secret-string '{"username":"carebow_user","password":"your-secure-password"}'

# OpenAI API Key
aws secretsmanager create-secret \
  --name "carebow/openai/api-key" \
  --secret-string "your-openai-api-key"

# ElevenLabs API Key
aws secretsmanager create-secret \
  --name "carebow/elevenlabs/api-key" \
  --secret-string "your-elevenlabs-api-key"
```

## 🔧 Backend Deployment

### 1. Environment Configuration

Create `.env` file:

```env
# Database
DATABASE_URL=postgresql://user:password@your-rds-endpoint:5432/carebow

# OpenAI
OPENAI_API_KEY=your-openai-api-key

# ElevenLabs
ELEVENLABS_API_KEY=your-elevenlabs-api-key

# AWS
AWS_REGION=us-east-1
S3_CHAT_BUCKET=carebow-chat-data-xxxxxxxx
S3_VOICE_BUCKET=carebow-voice-data-xxxxxxxx
OPENSEARCH_ENDPOINT=https://your-opensearch-domain.us-east-1.es.amazonaws.com

# Encryption
ENCRYPTION_KEY=your-32-character-encryption-key

# JWT
SECRET_KEY=your-jwt-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### 2. Deploy Backend

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Run migrations
alembic upgrade head

# Start the application
uvicorn main:app --host 0.0.0.0 --port 8000
```

### 3. Docker Deployment (Recommended)

```bash
# Build Docker image
docker build -t carebow-enhanced-chat .

# Run with environment variables
docker run -d \
  --name carebow-chat \
  -p 8000:8000 \
  --env-file .env \
  carebow-enhanced-chat
```

## 🎨 Frontend Deployment

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Environment Configuration

Create `.env.local`:

```env
VITE_API_URL=http://localhost:8000
VITE_OPENAI_API_KEY=your-openai-api-key
VITE_ELEVENLABS_API_KEY=your-elevenlabs-api-key
```

### 3. Build and Deploy

```bash
# Development
npm run dev

# Production build
npm run build

# Deploy to S3/CloudFront
aws s3 sync dist/ s3://your-frontend-bucket --delete
```

## 🔐 Security Configuration

### 1. Enable WAF Rules

The WAF is automatically configured with:
- Rate limiting (2000 requests per IP per 5 minutes)
- Common rule set protection
- SQL injection protection
- Known bad inputs filtering

### 2. Configure CORS

Update your API Gateway CORS settings:

```json
{
  "allowedOrigins": ["https://your-domain.com"],
  "allowedMethods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  "allowedHeaders": ["Content-Type", "Authorization", "X-Requested-With"],
  "maxAge": 86400
}
```

### 3. Set Up Monitoring

CloudWatch alarms are configured for:
- OpenSearch CPU and storage utilization
- Lambda function errors
- API Gateway errors

## 🧪 Testing

### 1. Backend API Testing

```bash
cd backend
python -m pytest tests/ -v
```

### 2. Frontend Testing

```bash
cd frontend
npm test
```

### 3. End-to-End Testing

```bash
# Test chat functionality
curl -X POST http://localhost:8000/api/v1/enhanced-chat/sessions \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json"

# Test memory search
curl -X GET "http://localhost:8000/api/v1/enhanced-chat/memories/search?query=headache" \
  -H "Authorization: Bearer your-jwt-token"
```

## 📊 Monitoring and Logging

### 1. CloudWatch Dashboards

Create dashboards for:
- Chat session metrics
- Memory usage
- API response times
- Error rates

### 2. Log Aggregation

All logs are sent to CloudWatch Logs:
- `/aws/lambda/data-export`
- `/aws/lambda/data-deletion`
- `/aws/opensearch/domains/chat-memory`

### 3. Alerts

Configure SNS notifications for:
- High error rates
- Storage capacity warnings
- Security events

## 🔄 Data Management

### 1. Data Export

Users can export their data through:
- API endpoint: `POST /api/v1/enhanced-chat/export-data`
- Frontend interface: Privacy Controls dialog

### 2. Data Deletion

Users can request account deletion:
- API endpoint: `POST /api/v1/enhanced-chat/delete-account`
- 7-day grace period for cancellation

### 3. Backup Strategy

- RDS automated backups (7 days retention)
- S3 versioning enabled
- OpenSearch snapshots to S3

## 🚨 Troubleshooting

### Common Issues

1. **OpenSearch Connection Failed**
   - Check security group rules
   - Verify VPC configuration
   - Ensure proper IAM permissions

2. **Lambda Function Timeout**
   - Increase timeout in Terraform configuration
   - Optimize database queries
   - Use pagination for large datasets

3. **S3 Access Denied**
   - Check bucket policies
   - Verify IAM role permissions
   - Ensure proper CORS configuration

### Debug Commands

```bash
# Check Lambda logs
aws logs tail /aws/lambda/carebow-data-export-production --follow

# Test OpenSearch connection
curl -X GET "https://your-opensearch-domain.us-east-1.es.amazonaws.com/_cluster/health"

# Verify S3 bucket access
aws s3 ls s3://your-chat-data-bucket/
```

## 📈 Performance Optimization

### 1. Database Optimization

- Enable connection pooling
- Create appropriate indexes
- Use read replicas for queries

### 2. Caching Strategy

- Implement Redis for session caching
- Cache frequently accessed memories
- Use CloudFront for static assets

### 3. Scaling

- Auto-scaling for ECS tasks
- Lambda concurrency limits
- OpenSearch cluster scaling

## 🔒 Compliance

### HIPAA Compliance

- All data encrypted at rest and in transit
- Audit logging enabled
- Access controls implemented
- Business Associate Agreements (BAAs) signed

### GDPR Compliance

- Data export functionality
- Right to deletion
- Consent management
- Data processing transparency

## 📞 Support

For issues or questions:
- Check CloudWatch logs
- Review Terraform state
- Contact development team
- Submit GitHub issues

## 🎯 Next Steps

1. **Voice Features**: Implement ElevenLabs integration
2. **Mobile App**: React Native implementation
3. **Analytics**: User behavior tracking
4. **ML Pipeline**: Continuous model improvement
5. **Multi-language**: Internationalization support

---

**Note**: This deployment guide assumes you have the necessary AWS permissions and infrastructure already set up. Adjust the configuration based on your specific environment and requirements.
