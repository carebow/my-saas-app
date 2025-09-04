#!/bin/bash

# Phase 6 CloudFront API Behavior Test Script
# Tests the /api/* behavior routing to ALB origin

CLOUDFRONT_URL="https://d2usoqe1zof3pe.cloudfront.net"

echo "🧪 Testing CloudFront API Behavior - Phase 6"
echo "============================================="
echo ""

# Test 1: Basic health check
echo "1️⃣  Testing basic health endpoint..."
echo "curl -i ${CLOUDFRONT_URL}/api/v1/health"
echo ""
curl -i "${CLOUDFRONT_URL}/api/v1/health"
echo ""
echo "---"
echo ""

# Test 2: Detailed health check
echo "2️⃣  Testing detailed health endpoint..."
echo "curl -i ${CLOUDFRONT_URL}/healthz"
echo ""
curl -i "${CLOUDFRONT_URL}/healthz"
echo ""
echo "---"
echo ""

# Test 3: Root API endpoint
echo "3️⃣  Testing root API endpoint..."
echo "curl -i ${CLOUDFRONT_URL}/api/v1/"
echo ""
curl -i "${CLOUDFRONT_URL}/api/v1/"
echo ""
echo "---"
echo ""

# Test 4: Check CORS headers with OPTIONS request
echo "4️⃣  Testing CORS headers with OPTIONS request..."
echo "curl -i -X OPTIONS ${CLOUDFRONT_URL}/api/v1/health -H 'Origin: https://example.com'"
echo ""
curl -i -X OPTIONS "${CLOUDFRONT_URL}/api/v1/health" -H "Origin: https://example.com"
echo ""
echo "---"
echo ""

# Test 5: Check cache headers (should show no caching)
echo "5️⃣  Checking cache behavior (should be disabled)..."
echo "Looking for Cache-Control headers indicating no caching..."
echo ""
curl -s -I "${CLOUDFRONT_URL}/api/v1/health" | grep -i cache
echo ""

echo "✅ Test complete!"
echo ""
echo "Expected results:"
echo "- Status 200 for health endpoints"
echo "- CORS headers present (Access-Control-Allow-Origin, etc.)"
echo "- No caching headers or Cache-Control: no-cache"
echo "- No CORS complaints in browser console when testing from frontend"