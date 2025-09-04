#!/bin/bash

# Test script for the minimal API deployment
# Use this to validate the minimal service is working correctly

set -e

# Configuration - update these with your actual endpoints
LOAD_BALANCER_URL="your-load-balancer-url"  # Update with your ALB URL
API_ENDPOINT="${LOAD_BALANCER_URL}"

echo "🧪 Testing minimal API deployment..."

# Test health endpoint
echo "Testing /healthz endpoint..."
HEALTH_RESPONSE=$(curl -s -w "%{http_code}" -o /tmp/health_response "${API_ENDPOINT}/healthz")
HTTP_CODE="${HEALTH_RESPONSE: -3}"

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Health check passed (HTTP $HTTP_CODE)"
    cat /tmp/health_response
    echo ""
else
    echo "❌ Health check failed (HTTP $HTTP_CODE)"
    cat /tmp/health_response
    echo ""
    exit 1
fi

# Test root endpoint
echo "Testing / endpoint..."
ROOT_RESPONSE=$(curl -s -w "%{http_code}" -o /tmp/root_response "${API_ENDPOINT}/")
HTTP_CODE="${ROOT_RESPONSE: -3}"

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Root endpoint passed (HTTP $HTTP_CODE)"
    cat /tmp/root_response
    echo ""
else
    echo "❌ Root endpoint failed (HTTP $HTTP_CODE)"
    cat /tmp/root_response
    echo ""
    exit 1
fi

# Test response time
echo "Testing response time..."
RESPONSE_TIME=$(curl -s -w "%{time_total}" -o /dev/null "${API_ENDPOINT}/healthz")
echo "⏱️  Response time: ${RESPONSE_TIME}s"

# Continuous monitoring test (optional)
read -p "Run continuous monitoring for 60 seconds? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🔄 Running continuous health checks for 60 seconds..."
    END_TIME=$((SECONDS + 60))
    SUCCESS_COUNT=0
    TOTAL_COUNT=0
    
    while [ $SECONDS -lt $END_TIME ]; do
        TOTAL_COUNT=$((TOTAL_COUNT + 1))
        if curl -s -f "${API_ENDPOINT}/healthz" > /dev/null; then
            SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
            echo -n "✅"
        else
            echo -n "❌"
        fi
        sleep 2
    done
    
    echo ""
    echo "📊 Results: $SUCCESS_COUNT/$TOTAL_COUNT successful requests"
    SUCCESS_RATE=$((SUCCESS_COUNT * 100 / TOTAL_COUNT))
    echo "📈 Success rate: ${SUCCESS_RATE}%"
    
    if [ $SUCCESS_RATE -ge 95 ]; then
        echo "🎉 Infrastructure appears stable with minimal service"
        echo "   → Issue is likely in your application code"
    else
        echo "⚠️  Infrastructure issues detected even with minimal service"
        echo "   → Investigate ECS, networking, or load balancer configuration"
    fi
fi

echo ""
echo "🔍 Next steps:"
echo "   1. If minimal service is stable → investigate your application code"
echo "   2. If minimal service fails → check infrastructure components"
echo "   3. Monitor ECS service metrics and CloudWatch logs"