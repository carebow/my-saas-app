# Phase 6: CloudFront API Behavior Configuration

## Overview
Configured CloudFront behavior for `/api/*` routes to properly route to ALB origin with caching disabled and CORS support.

## Changes Made

### 1. Updated CloudFront Configuration (`aws/infrastructure/cloudfront.tf`)

**Before:**
- Used deprecated `forwarded_values` 
- Had some caching enabled (TTL = 0 but still cached GET/HEAD)
- Limited header forwarding

**After:**
- Uses modern AWS managed cache policies
- **Cache Policy**: `CachingDisabled` (ID: `4135ea2d-6df8-44a3-9df3-4b5a84be39ad`)
- **Origin Request Policy**: `CORS-S3Origin` (ID: `88a5eaf4-2fd4-4709-b370-b4c650ea3fcf`) - forwards all viewer headers, query strings, and cookies
- **Response Headers Policy**: `SimpleCORS` (ID: `67f7725c-6f97-4210-82d7-5512b31e9d03`) - adds CORS headers

### 2. Behavior Configuration
```hcl
ordered_cache_behavior {
  path_pattern     = "/api/*"
  allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
  cached_methods   = ["GET", "HEAD", "OPTIONS"]
  target_origin_id = "ALB-${var.project_name}-api"

  cache_policy_id            = "4135ea2d-6df8-44a3-9df3-4b5a84be39ad"  # CachingDisabled
  origin_request_policy_id   = "88a5eaf4-2fd4-4709-b370-b4c650ea3fcf"  # CORS-S3Origin
  response_headers_policy_id = "67f7725c-6f97-4210-82d7-5512b31e9d03"  # SimpleCORS

  viewer_protocol_policy = "redirect-to-https"
  compress               = true
}
```

## Deployment Steps

1. **Apply Terraform Changes:**
   ```bash
   cd aws/infrastructure
   terraform plan
   terraform apply
   ```

2. **Wait for CloudFront Distribution Update:**
   - CloudFront updates can take 15-20 minutes to propagate
   - Monitor the distribution status in AWS Console

## Testing

### Automated Test Script
Run the provided test script:
```bash
./test-api-cloudfront.sh
```

### Manual Smoke Test
```bash
curl -i https://d2usoqe1zof3pe.cloudfront.net/api/v1/health
```

**Expected Response:**
- Status: `200 OK`
- CORS headers present
- No caching headers (or `Cache-Control: no-cache`)

### Browser Test
1. Open browser developer tools
2. Navigate to your frontend application
3. Make API calls to `/api/*` endpoints
4. Check console for CORS errors (should be none)

## Available Health Endpoints

The backend provides several health check endpoints:

- `/health` - Simple health check
- `/healthz` - Detailed health check with database/Redis status
- `/api/v1/health` - API v1 health endpoint (if available)

## CORS Configuration

The backend already includes CORS middleware with your CloudFront domain:
```python
ALLOWED_ORIGINS = [
    "http://localhost:8080", 
    "http://localhost:5173", 
    "http://localhost:3000",
    "https://d2usoqe1zof3pe.cloudfront.net",  # Production CloudFront
    "https://dcqajf07bdpek.cloudfront.net"    # Staging CloudFront
]
```

## Verification Checklist

- [ ] Terraform changes applied successfully
- [ ] CloudFront distribution updated (check AWS Console)
- [ ] API health endpoint returns 200
- [ ] No CORS errors in browser console
- [ ] Cache headers show caching is disabled
- [ ] All HTTP methods work (GET, POST, PUT, DELETE, etc.)

## Troubleshooting

If you encounter issues:

1. **502/503 Errors**: Check ALB health checks and ECS service status
2. **CORS Errors**: Verify the response headers policy is applied
3. **Caching Issues**: Confirm the cache policy is set to CachingDisabled
4. **Slow Updates**: CloudFront changes take time to propagate globally

## Next Steps

After successful deployment and testing:
1. Update any frontend API base URLs to use CloudFront domain
2. Test all API endpoints through CloudFront
3. Monitor CloudFront metrics and logs
4. Consider setting up custom domain with SSL certificate