# 🚀 CareBow API Setup Guide

## Quick Start - Get Your Product Live in 30 Minutes

### Step 1: Get Your API Keys

#### 1.1 OpenAI API Key (Required for AI Consultations)
1. Go to https://platform.openai.com/api-keys
2. Sign up/Login to OpenAI
3. Click "Create new secret key"
4. Copy the key (starts with `sk-`)
5. **Cost**: ~$0.01-0.10 per consultation

#### 1.2 Stripe API Keys (Required for Payments)
1. Go to https://dashboard.stripe.com/apikeys
2. Sign up/Login to Stripe
3. Copy your **Test** keys:
   - Secret key (starts with `sk_test_`)
   - Publishable key (starts with `pk_test_`)
4. **Cost**: 2.9% + $0.30 per transaction

#### 1.3 Email Service (Optional - for notifications)
**Option A: Gmail (Free)**
1. Enable 2-factor authentication on Gmail
2. Generate App Password: Google Account → Security → App passwords
3. Use your Gmail address and app password

**Option B: SendGrid (Recommended for production)**
1. Sign up at https://sendgrid.com
2. Get API key from Settings → API Keys
3. **Cost**: Free tier: 100 emails/day, Paid: $20-100/month

### Step 2: Configure Your Environment

#### 2.1 Update Backend Environment
Edit `/backend/.env`:

```env
# OpenAI Configuration (REQUIRED)
OPENAI_API_KEY=sk-your-actual-openai-key-here

# Stripe Configuration (REQUIRED)
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key-here
STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key-here

# Email Configuration (OPTIONAL)
SMTP_TLS=true
SMTP_PORT=587
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAILS_FROM_EMAIL=noreply@carebow.com
EMAILS_FROM_NAME=CareBow Health Assistant

# Keep existing settings
SECRET_KEY=carebow-production-secret-key-change-this-in-production-2024
DATABASE_URL=sqlite:///./carebow.db
HIPAA_ENCRYPTION_KEY=carebow-hipaa-encryption-key-32chars-2024
```

#### 2.2 Update Frontend Environment
Edit `/src/lib/config.ts` or create `.env.local`:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key-here
```

### Step 3: Test Your Setup

#### 3.1 Start the Backend
```bash
cd backend
source venv/bin/activate
python run.py
```

#### 3.2 Start the Frontend
```bash
npm run dev
```

#### 3.3 Test the Complete Flow
1. Open http://localhost:5173
2. Register a new account
3. Login with your account
4. Try the AI chat feature
5. Test subscription creation (will use Stripe test mode)

### Step 4: Deploy to Production

#### 4.1 Backend Deployment (AWS ECS)
```bash
# Build and push Docker image
docker build -f aws/deploy/backend.Dockerfile -t carebow-backend .
docker tag carebow-backend:latest your-account.dkr.ecr.us-east-1.amazonaws.com/carebow-backend:latest
docker push your-account.dkr.ecr.us-east-1.amazonaws.com/carebow-backend:latest

# Deploy using Terraform
cd aws/terraform
terraform init
terraform plan
terraform apply
```

#### 4.2 Frontend Deployment (CloudFront)
```bash
# Build for production
npm run build:prod

# Deploy to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

## 🔧 Troubleshooting

### Common Issues

#### "OpenAI API key not configured"
- Check that `OPENAI_API_KEY` is set in `.env`
- Verify the key starts with `sk-`
- Test with: `curl -H "Authorization: Bearer YOUR_KEY" https://api.openai.com/v1/models`

#### "Stripe API key not configured"
- Check that both `STRIPE_SECRET_KEY` and `STRIPE_PUBLISHABLE_KEY` are set
- Verify secret key starts with `sk_test_` (for test mode)
- Verify publishable key starts with `pk_test_`

#### "Database connection failed"
- Check `DATABASE_URL` in `.env`
- For SQLite: ensure the file path is correct
- For PostgreSQL: verify connection string and credentials

#### "HIPAA encryption key missing"
- Check that `HIPAA_ENCRYPTION_KEY` is set
- Must be exactly 32 characters
- Use: `openssl rand -hex 16` to generate a secure key

### Testing Commands

```bash
# Test backend health
curl http://localhost:8000/health

# Test authentication
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass123","full_name":"Test User"}'

# Test AI chat
curl -X POST http://localhost:8000/api/v1/ai/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"message":"I have a headache"}'
```

## 📊 Monitoring & Maintenance

### Health Checks
- Backend: `http://your-domain.com/health`
- Frontend: `http://your-domain.com/`
- API Docs: `http://your-domain.com/docs`

### Logs
- Backend logs: Check ECS task logs in CloudWatch
- Frontend logs: Check browser console and CloudFront logs
- Database logs: Check RDS logs in CloudWatch

### Performance
- Monitor API response times in CloudWatch
- Check database performance in RDS metrics
- Monitor frontend loading times in browser dev tools

## 🚀 Next Steps After Setup

1. **Test with Real Users**: Invite friends/family to test the platform
2. **Monitor Usage**: Track API costs and user behavior
3. **Iterate**: Gather feedback and improve features
4. **Scale**: Add more AI models, payment methods, or integrations
5. **Compliance**: Implement HIPAA compliance measures for production

## 💡 Pro Tips

- Start with test keys and upgrade to live keys when ready
- Use Stripe's test cards for payment testing
- Monitor OpenAI usage to avoid unexpected costs
- Set up alerts for API failures and high costs
- Keep your API keys secure and never commit them to git

---

**Need Help?** Check the logs, test individual components, and verify your API keys are correct. Most issues are configuration-related and easy to fix!
