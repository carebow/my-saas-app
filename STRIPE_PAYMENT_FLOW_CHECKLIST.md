# Stripe Payment Flow Testing Checklist

## 🔍 Pre-Testing Setup

### Environment Configuration
- [ ] Verify Stripe test keys are configured in `.env`
- [ ] Confirm webhook endpoint is accessible
- [ ] Test Stripe CLI webhook forwarding: `stripe listen --forward-to localhost:8000/api/v1/payments/webhook`
- [ ] Validate Supabase environment variables for Stripe

### Database State
- [ ] Verify `users` table has correct subscription columns
- [ ] Check `subscribers` table exists in Supabase
- [ ] Confirm subscription tier enum values match code

## 💳 Subscription Creation Flow

### Free to Basic Upgrade
- [ ] **Setup**: Create user account (should default to Free tier)
- [ ] **Verify Initial State**: 
  - `subscription_tier` = "free"
  - `consultations_limit` = 3
  - `subscription_active` = false
  - `stripe_customer_id` = null
- [ ] **Trigger**: Click "Subscribe Now" on Basic plan ($9.99/month)
- [ ] **Expected**: Stripe checkout opens with correct price (999 cents)
- [ ] **Payment**: Complete test payment with card `4242424242424242`
- [ ] **Webhook Processing**: Verify `invoice.payment_succeeded` webhook received
- [ ] **Post-Payment State**:
  - `subscription_tier` = "basic" 
  - `consultations_limit` = 50
  - `subscription_active` = true
  - `stripe_customer_id` populated
- [ ] **Frontend Update**: Subscription status reflects in UI

### Free to Premium Upgrade  
- [ ] **Setup**: Fresh user account (Free tier)
- [ ] **Trigger**: Click "Subscribe Now" on Premium plan ($19.99/month)
- [ ] **Expected**: Stripe checkout with 1999 cents
- [ ] **Payment**: Complete test payment
- [ ] **Webhook**: Verify correct tier assignment
- [ ] **Post-Payment State**:
  - `subscription_tier` = "premium"
  - `consultations_limit` = 100 (or unlimited)
  - `subscription_active` = true

### Free to Annual Premium
- [ ] **Setup**: Fresh user account (Free tier)  
- [ ] **Trigger**: Click "Subscribe Now" on Annual plan ($199.99/year)
- [ ] **Expected**: Stripe checkout with 19999 cents
- [ ] **Payment**: Complete test payment
- [ ] **Post-Payment State**:
  - `subscription_tier` = "Premium Annual"
  - `consultations_limit` = 100 (or unlimited)
  - Annual billing cycle confirmed

## 🔄 Subscription Management

### Existing Customer Scenarios
- [ ] **Existing Stripe Customer**: User with `stripe_customer_id` creates new subscription
- [ ] **Verify**: No duplicate customer creation
- [ ] **Confirm**: Subscription links to existing customer

### Subscription Changes
- [ ] **Upgrade**: Basic to Premium mid-cycle
- [ ] **Downgrade**: Premium to Basic (if supported)
- [ ] **Cancel**: Subscription cancellation flow
- [ ] **Reactivate**: Cancelled subscription reactivation

## 🚨 Error Handling & Edge Cases

### Payment Failures
- [ ] **Declined Card**: Use test card `4000000000000002`
- [ ] **Expected**: Graceful error handling, user remains on current tier
- [ ] **Insufficient Funds**: Use test card `4000000000009995`
- [ ] **Webhook Failure**: Simulate webhook delivery failure
- [ ] **Recovery**: Manual subscription status sync

### Authentication Issues
- [ ] **Unauthenticated**: Attempt subscription without login
- [ ] **Invalid Token**: Expired/invalid auth token during checkout
- [ ] **Missing User**: Webhook for non-existent user

### Stripe Integration Issues
- [ ] **Invalid Price ID**: Test with non-existent price
- [ ] **API Key Issues**: Invalid/expired Stripe keys
- [ ] **Webhook Signature**: Invalid webhook signature verification

## 📊 Usage Limits & Entitlements

### Consultation Limits
- [ ] **Free User**: Verify 3 consultation limit enforced
- [ ] **Basic User**: Verify 50 consultation limit
- [ ] **Premium User**: Verify 100 limit (or unlimited)
- [ ] **Limit Exceeded**: Proper error message and upgrade prompt
- [ ] **Limit Reset**: Monthly/billing cycle reset behavior

### Feature Access
- [ ] **Free Features**: Basic functionality only
- [ ] **Basic Features**: Enhanced features unlocked
- [ ] **Premium Features**: All features accessible
- [ ] **Feature Gating**: Proper restrictions based on tier

## 🔗 Integration Points

### Frontend-Backend Sync
- [ ] **Status Check**: `/api/v1/payments/subscription-status` returns correct data
- [ ] **Real-time Updates**: Subscription changes reflect immediately
- [ ] **Auth Response**: User object includes subscription info
- [ ] **UI State**: Subscription modal shows correct current plan

### Supabase Integration
- [ ] **Check Subscription**: `check-subscription` function works correctly
- [ ] **Database Sync**: Supabase `subscribers` table stays in sync
- [ ] **Cross-Platform**: Backend and Supabase show same subscription state

## 🎯 End-to-End User Journeys

### Complete New User Flow
1. [ ] **Signup**: Create account → Free tier assigned
2. [ ] **Usage**: Use 3 free consultations → Hit limit
3. [ ] **Upgrade Prompt**: Modal appears with subscription options
4. [ ] **Payment**: Complete Basic subscription
5. [ ] **Immediate Access**: Can use consultations immediately
6. [ ] **Ongoing**: Monthly billing works correctly

### Subscription Lifecycle
1. [ ] **Active Subscription**: All features work
2. [ ] **Payment Due**: Automatic renewal attempt
3. [ ] **Payment Success**: Continued access
4. [ ] **Payment Failure**: Grace period handling
5. [ ] **Final Failure**: Downgrade to Free tier

## 🔧 Technical Validation

### Webhook Processing
- [ ] **Event Types**: `invoice.payment_succeeded`, `invoice.payment_failed`
- [ ] **Signature Verification**: Webhook authenticity confirmed
- [ ] **Idempotency**: Duplicate webhook handling
- [ ] **Error Logging**: Failed webhooks logged properly

### Price Mapping Logic
- [ ] **Amount Detection**: Correct tier assigned based on price amount
  - 999 cents → Basic
  - 1999 cents → Premium  
  - 19999 cents → Premium Annual
- [ ] **Edge Cases**: Handle unexpected amounts gracefully

### Database Consistency
- [ ] **Transaction Safety**: Subscription updates are atomic
- [ ] **Rollback**: Failed updates don't leave inconsistent state
- [ ] **Audit Trail**: Subscription changes are logged

## 🚀 Performance & Monitoring

### Response Times
- [ ] **Checkout Creation**: < 2 seconds
- [ ] **Webhook Processing**: < 5 seconds
- [ ] **Status Checks**: < 1 second

### Error Monitoring
- [ ] **Sentry Integration**: Errors properly tracked
- [ ] **Webhook Failures**: Monitoring and alerting setup
- [ ] **Payment Failures**: User-friendly error messages

## 📋 Manual Testing Scenarios

### Test Cards (Stripe Test Mode)
- **Success**: `4242424242424242`
- **Declined**: `4000000000000002`
- **Insufficient Funds**: `4000000000009995`
- **Processing Error**: `4000000000000119`
- **Expired Card**: `4000000000000069`

### Test Webhooks
```bash
# Test successful payment
stripe trigger invoice.payment_succeeded

# Test failed payment  
stripe trigger invoice.payment_failed
```

### API Testing
```bash
# Check subscription status
curl -H "Authorization: Bearer <token>" \
  http://localhost:8000/api/v1/payments/subscription-status

# Create subscription
curl -X POST -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"price_id": "price_test_basic_monthly"}' \
  http://localhost:8000/api/v1/payments/create-subscription
```

## ✅ Success Criteria

### Functional Requirements
- [ ] All subscription tiers work correctly
- [ ] Payment processing is reliable
- [ ] Usage limits are properly enforced
- [ ] Webhooks update subscription status accurately
- [ ] Frontend shows correct subscription state

### Non-Functional Requirements  
- [ ] Payment flow completes in < 30 seconds
- [ ] 99.9% webhook delivery success rate
- [ ] Zero data inconsistencies between systems
- [ ] Graceful handling of all error scenarios
- [ ] Comprehensive error logging and monitoring

## 🐛 Known Issues to Address

1. **Webhook Logic**: Currently hardcodes Basic tier instead of mapping from price
2. **Entitlement Mapping**: Need centralized price → tier → limits mapping
3. **Premium Limits**: Clarify if Premium should be unlimited or 100 consultations
4. **Price ID Management**: No environment-based price ID configuration
5. **Error Recovery**: Limited automatic retry/recovery mechanisms

---

**Testing Priority**: High → Critical business functionality
**Estimated Testing Time**: 4-6 hours for comprehensive testing
**Required Tools**: Stripe CLI, test cards, webhook testing tools