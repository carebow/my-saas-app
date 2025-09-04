# 🔍 Stripe Integration Audit & Testing Checklist

## 📊 **Current Subscription Configuration**

### **Subscription Tiers & Entitlements**
| Tier | Price | Consultations | Backend Enum | Frontend Display |
|------|-------|---------------|--------------|------------------|
| **Free** | $0 | 3 | `SubscriptionTier.FREE` | Default new users |
| **Basic** | $9.99/month | 50 | `SubscriptionTier.BASIC` | "Basic Monthly" |
| **Premium** | $19.99/month | 100* | `SubscriptionTier.PREMIUM` | "Premium Monthly" |
| **Premium Annual** | $199.99/year | 100* | `SubscriptionTier.PREMIUM` | "Premium Annual" |

*Note: Frontend shows "Unlimited" but backend enforces 100 limit

### **Price ID Mapping (Test Mode)**
```typescript
// Current test price IDs used in tests:
const PRICE_IDS = {
  basic_monthly: "price_test_basic_monthly",
  premium_monthly: "price_test_premium_monthly", 
  premium_annual: "price_test_premium_annual" // Inferred
};
```

## 🚨 **Critical Issues Identified**

### **1. Hardcoded Webhook Logic**
**Location**: `backend/app/api/api_v1/endpoints/payments.py:81`
```python
# PROBLEM: Hardcoded to BASIC tier
user.subscription_tier = SubscriptionTier.BASIC  # or determine from price_id
user.consultations_limit = 50  # Update based on plan
```

**Impact**: All successful payments result in Basic tier regardless of actual plan purchased.

### **2. Missing Price-to-Tier Mapping**
**Problem**: No centralized mapping from Stripe price IDs to subscription tiers.

**Solution Needed**: Create price mapping configuration.

### **3. Inconsistent Premium Limits**
**Frontend**: Shows "Unlimited AI health consultations"
**Backend**: Sets `consultations_limit = 100`
**AI Endpoint**: Checks `current_user.consultations_used >= current_user.consultations_limit`

**Decision Required**: Should Premium be truly unlimited or capped at 100?

### **4. Environment-Specific Price IDs**
**Problem**: No configuration for different price IDs across environments (test/prod).

## 🔧 **Required Fixes**

### **Fix 1: Implement Price-to-Tier Mapping**

Create configuration file:
```python
# backend/app/core/subscription_config.py
SUBSCRIPTION_PLANS = {
    # Test Environment
    "price_test_basic_monthly": {
        "tier": SubscriptionTier.BASIC,
        "consultations_limit": 50,
        "name": "Basic Monthly"
    },
    "price_test_premium_monthly": {
        "tier": SubscriptionTier.PREMIUM, 
        "consultations_limit": -1,  # -1 = unlimited
        "name": "Premium Monthly"
    },
    "price_test_premium_annual": {
        "tier": SubscriptionTier.PREMIUM,
        "consultations_limit": -1,
        "name": "Premium Annual"
    },
    # Production Environment  
    "price_live_basic_monthly": {
        "tier": SubscriptionTier.BASIC,
        "consultations_limit": 50,
        "name": "Basic Monthly"
    },
    # ... production price IDs
}
```

### **Fix 2: Update Webhook Logic**
```python
# In payments.py webhook handler
def handle_successful_payment(subscription_data):
    price_id = subscription_data["items"]["data"][0]["price"]["id"]
    plan_config = SUBSCRIPTION_PLANS.get(price_id)
    
    if plan_config:
        user.subscription_tier = plan_config["tier"]
        user.consultations_limit = plan_config["consultations_limit"]
    else:
        # Log error and default to basic
        logger.error(f"Unknown price_id: {price_id}")
        user.subscription_tier = SubscriptionTier.BASIC
        user.consultations_limit = 50
```

### **Fix 3: Update AI Consultation Logic**
```python
# In ai.py consultation endpoint
def check_consultation_limits(user):
    if user.consultations_limit == -1:  # Unlimited
        return True
    return user.consultations_used < user.consultations_limit
```

## ✅ **Comprehensive Testing Checklist**

### **🔧 Pre-Testing Setup**
- [ ] **Environment Variables**
  - [ ] `STRIPE_SECRET_KEY` configured
  - [ ] `STRIPE_PUBLISHABLE_KEY` configured  
  - [ ] `STRIPE_WEBHOOK_SECRET` configured
- [ ] **Webhook Endpoint**
  - [ ] Accessible at `/api/v1/payments/webhook`
  - [ ] Stripe CLI forwarding: `stripe listen --forward-to localhost:8000/api/v1/payments/webhook`
- [ ] **Database State**
  - [ ] Users table has subscription columns
  - [ ] Subscription tier enum matches code
- [ ] **Price ID Configuration**
  - [ ] Test price IDs created in Stripe dashboard
  - [ ] Price mapping configuration implemented

### **💳 Subscription Creation Flows**

#### **Test 1: Free → Basic Upgrade**
- [ ] **Setup**: Create new user account
- [ ] **Verify Initial State**:
  ```json
  {
    "subscription_tier": "free",
    "consultations_limit": 3,
    "consultations_used": 0,
    "subscription_active": false,
    "stripe_customer_id": null
  }
  ```
- [ ] **Action**: Click "Subscribe Now" on Basic plan
- [ ] **Stripe Checkout**: 
  - [ ] Opens with $9.99 amount (999 cents)
  - [ ] Correct plan name displayed
- [ ] **Payment**: Complete with test card `4242424242424242`
- [ ] **Webhook Processing**:
  - [ ] `invoice.payment_succeeded` received
  - [ ] Correct price_id in webhook payload
- [ ] **Post-Payment State**:
  ```json
  {
    "subscription_tier": "basic",
    "consultations_limit": 50,
    "subscription_active": true,
    "stripe_customer_id": "cus_xxxxx"
  }
  ```
- [ ] **Frontend Update**: UI reflects Basic subscription

#### **Test 2: Free → Premium Upgrade**
- [ ] **Setup**: Fresh user account
- [ ] **Action**: Subscribe to Premium Monthly ($19.99)
- [ ] **Stripe Checkout**: 1999 cents displayed
- [ ] **Payment**: Complete successfully
- [ ] **Post-Payment State**:
  ```json
  {
    "subscription_tier": "premium", 
    "consultations_limit": -1,  // or 100 based on decision
    "subscription_active": true
  }
  ```

#### **Test 3: Free → Premium Annual**
- [ ] **Setup**: Fresh user account
- [ ] **Action**: Subscribe to Premium Annual ($199.99)
- [ ] **Stripe Checkout**: 19999 cents, annual billing
- [ ] **Payment**: Complete successfully
- [ ] **Post-Payment State**:
  ```json
  {
    "subscription_tier": "premium",
    "consultations_limit": -1,
    "subscription_active": true
  }
  ```

### **🔄 Consultation Limit Testing**

#### **Test 4: Free User Limits**
- [ ] **Setup**: Free user with 0 consultations used
- [ ] **Action**: Create 3 consultations successfully
- [ ] **Limit Test**: 4th consultation should fail
- [ ] **Error Message**: "Consultation limit reached" with upgrade prompt
- [ ] **Upgrade Flow**: Modal appears with subscription options

#### **Test 5: Basic User Limits**  
- [ ] **Setup**: Basic subscriber
- [ ] **Action**: Create 50 consultations
- [ ] **Limit Test**: 51st consultation should fail
- [ ] **Upgrade Prompt**: Suggest Premium upgrade

#### **Test 6: Premium User Limits**
- [ ] **Setup**: Premium subscriber
- [ ] **Test Unlimited**: Create 100+ consultations (if unlimited)
- [ ] **OR Test 100 Limit**: Verify 100 consultation cap (if limited)

### **🚨 Error Handling & Edge Cases**

#### **Test 7: Payment Failures**
- [ ] **Declined Card**: Use `4000000000000002`
  - [ ] User remains on current tier
  - [ ] Graceful error message
  - [ ] No partial subscription state
- [ ] **Insufficient Funds**: Use `4000000000009995`
- [ ] **Processing Error**: Use `4000000000000119`

#### **Test 8: Webhook Failures**
- [ ] **Missing Webhook**: Simulate webhook delivery failure
- [ ] **Invalid Signature**: Test with wrong webhook secret
- [ ] **Duplicate Webhooks**: Ensure idempotent processing
- [ ] **Unknown Price ID**: Test with non-configured price

#### **Test 9: Authentication Issues**
- [ ] **Unauthenticated**: Attempt subscription without login
- [ ] **Expired Token**: Invalid auth during checkout
- [ ] **Missing User**: Webhook for non-existent user

### **🔗 Integration Testing**

#### **Test 10: Frontend-Backend Sync**
- [ ] **Status Endpoint**: `/api/v1/payments/subscription-status`
  - [ ] Returns correct subscription data
  - [ ] Matches database state
- [ ] **Auth Response**: User object includes subscription info
- [ ] **Real-time Updates**: Changes reflect immediately in UI

#### **Test 11: Supabase Integration**
- [ ] **Check Subscription Function**: Works correctly
- [ ] **Database Sync**: Supabase `subscribers` table matches backend
- [ ] **Cross-Platform Consistency**: Same subscription state everywhere

### **🎯 End-to-End User Journeys**

#### **Test 12: Complete New User Flow**
1. [ ] **Signup**: Account created → Free tier assigned
2. [ ] **Usage**: Use all 3 free consultations
3. [ ] **Limit Hit**: 4th consultation blocked with upgrade modal
4. [ ] **Subscription**: Complete Basic subscription purchase
5. [ ] **Immediate Access**: Can create consultation immediately
6. [ ] **Ongoing Usage**: Use Basic tier consultations normally

#### **Test 13: Subscription Lifecycle**
1. [ ] **Active Subscription**: All features accessible
2. [ ] **Renewal**: Automatic monthly/annual renewal
3. [ ] **Payment Success**: Continued access
4. [ ] **Payment Failure**: Grace period handling
5. [ ] **Final Failure**: Downgrade to Free tier

### **📊 Performance & Monitoring**

#### **Test 14: Performance Benchmarks**
- [ ] **Checkout Creation**: < 2 seconds
- [ ] **Webhook Processing**: < 5 seconds  
- [ ] **Status Checks**: < 1 second
- [ ] **Consultation Creation**: < 3 seconds

#### **Test 15: Error Monitoring**
- [ ] **Sentry Integration**: Payment errors tracked
- [ ] **Webhook Monitoring**: Failed webhooks logged
- [ ] **User-Friendly Errors**: Clear error messages

## 🧪 **Test Data & Tools**

### **Stripe Test Cards**
```
Success: 4242424242424242
Declined: 4000000000000002  
Insufficient Funds: 4000000000009995
Processing Error: 4000000000000119
Expired Card: 4000000000000069
```

### **Test Webhooks**
```bash
# Trigger successful payment
stripe trigger invoice.payment_succeeded

# Trigger failed payment
stripe trigger invoice.payment_failed
```

### **API Testing**
```bash
# Check subscription status
curl -H "Authorization: Bearer <token>" \\
  http://localhost:8000/api/v1/payments/subscription-status

# Create Basic subscription  
curl -X POST -H "Authorization: Bearer <token>" \\
  -H "Content-Type: application/json" \\
  -d '{"price_id": "price_test_basic_monthly"}' \\
  http://localhost:8000/api/v1/payments/create-subscription

# Create Premium subscription
curl -X POST -H "Authorization: Bearer <token>" \\
  -H "Content-Type: application/json" \\
  -d '{"price_id": "price_test_premium_monthly"}' \\
  http://localhost:8000/api/v1/payments/create-subscription
```

## 🎯 **Success Criteria**

### **Functional Requirements**
- [ ] ✅ All 3 subscription tiers work correctly
- [ ] ✅ Payment processing is reliable (>99% success rate)
- [ ] ✅ Usage limits properly enforced per tier
- [ ] ✅ Webhooks accurately update subscription status
- [ ] ✅ Frontend shows correct subscription state
- [ ] ✅ Price-to-tier mapping works for all plans

### **Non-Functional Requirements**
- [ ] ✅ Payment flow completes in <30 seconds
- [ ] ✅ 99.9% webhook delivery success rate
- [ ] ✅ Zero data inconsistencies between systems
- [ ] ✅ Graceful handling of all error scenarios
- [ ] ✅ Comprehensive error logging and monitoring

## 🚀 **Immediate Action Items**

### **Priority 1: Critical Fixes**
1. **Fix webhook price mapping** - Implement proper price_id → tier logic
2. **Clarify Premium limits** - Decide unlimited vs 100 consultation cap
3. **Add price ID configuration** - Environment-specific price management
4. **Update consultation limit logic** - Handle unlimited (-1) properly

### **Priority 2: Testing**
1. **Run comprehensive test suite** - All scenarios above
2. **Validate webhook processing** - Ensure correct tier assignment
3. **Test consultation limits** - Verify enforcement per tier
4. **End-to-end user journeys** - Complete flows work

### **Priority 3: Monitoring**
1. **Set up payment monitoring** - Track success/failure rates
2. **Webhook monitoring** - Alert on delivery failures
3. **Usage analytics** - Track subscription conversions
4. **Error alerting** - Real-time payment issue notifications

---

**Estimated Testing Time**: 6-8 hours for comprehensive validation
**Critical Path**: Fix webhook logic → Test all subscription flows → Validate limits
**Risk Level**: High - Core revenue functionality