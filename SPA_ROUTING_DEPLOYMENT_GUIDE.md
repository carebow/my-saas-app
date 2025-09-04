# SPA Routing Deployment Guide

This guide ensures your React SPA works correctly with deep links and refreshes on any hosting platform.

## 🎯 Phase 5 Requirements Completed

✅ **SPA Routing (React Router)** - Configured with BrowserRouter  
✅ **404 Handling** - Enhanced NotFound component with navigation  
✅ **Build-time Environment Validation** - VITE_API_BASE verified  
✅ **CloudFront Error Mapping** - 404/403 → /index.html configuration  

## 🔧 Configuration Files Created

### 1. Public Assets
- `public/_redirects` - Netlify SPA routing rules
- `aws/cloudfront-error-pages.json` - CloudFront error page configuration

### 2. Build Scripts
- `scripts/validate-env.js` - Validates required environment variables
- `scripts/test-spa-routing.js` - Tests SPA configuration after build

### 3. Environment Variables
```bash
# Required for production builds
VITE_API_BASE=https://d2usoqe1zof3pe.cloudfront.net/api
VITE_SUPABASE_URL=https://gydnxsdlbokgnaugrbhp.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_key_here
```

## 🚀 Deployment Instructions

### For AWS S3 + CloudFront

1. **Build the application:**
   ```bash
   npm run build:prod
   ```

2. **Upload to S3:**
   ```bash
   aws s3 sync dist/ s3://your-bucket-name --delete
   ```

3. **Configure CloudFront Error Pages:**
   ```bash
   # Apply the configuration from aws/cloudfront-error-pages.json
   aws cloudfront update-distribution \
     --id YOUR_DISTRIBUTION_ID \
     --distribution-config file://aws/cloudfront-error-pages.json
   ```

4. **Invalidate CloudFront cache:**
   ```bash
   aws cloudfront create-invalidation \
     --distribution-id YOUR_DISTRIBUTION_ID \
     --paths "/*"
   ```

### For Netlify

1. **Build and deploy:**
   ```bash
   npm run build:prod
   # The _redirects file will be automatically deployed
   ```

2. **Or connect your Git repository** - Netlify will automatically use the `_redirects` file.

### For Vercel

1. **Create `vercel.json`:**
   ```json
   {
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```

2. **Deploy:**
   ```bash
   npm run build:prod
   vercel --prod
   ```

## 🧪 Testing Deep Links

After deployment, test these URLs by:
1. **Direct navigation** - Enter URL in browser
2. **Page refresh** - Navigate to page, then refresh
3. **Share links** - Copy/paste URLs

### Test URLs:
- `https://yourdomain.com/` ✅ Home page
- `https://yourdomain.com/dashboard` ✅ Should load app, show dashboard
- `https://yourdomain.com/services` ✅ Should load app, show services
- `https://yourdomain.com/nonexistent` ✅ Should load app, show 404 page
- `https://yourdomain.com/admin` ✅ Should load app, show admin or redirect

## 🔍 Troubleshooting

### Problem: 404 errors on refresh
**Solution:** Ensure your hosting platform redirects all routes to `/index.html`

### Problem: Blank page on deep links
**Solution:** Check browser console for JavaScript errors and verify base href

### Problem: API calls failing
**Solution:** Verify `VITE_API_BASE` environment variable is set correctly

### Problem: Assets not loading
**Solution:** Check that asset paths are relative and base href is correct

## 📋 Pre-deployment Checklist

- [ ] Environment variables validated (`npm run validate-env`)
- [ ] Build completes successfully (`npm run build:prod`)
- [ ] SPA routing test passes (`npm run test-spa-routing`)
- [ ] Deep link test URLs prepared
- [ ] CloudFront/hosting error pages configured
- [ ] Cache invalidation plan ready

## 🔗 Environment Variable Reference

| Variable | Required | Purpose | Example |
|----------|----------|---------|---------|
| `VITE_API_BASE` | ✅ | Production API endpoint | `https://d2usoqe1zof3pe.cloudfront.net/api` |
| `VITE_SUPABASE_URL` | ✅ | Supabase project URL | `https://project.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | ✅ | Supabase anon key | `eyJ...` |
| `VITE_SENTRY_DSN` | ❌ | Error tracking | `https://...@sentry.io/...` |
| `VITE_ENVIRONMENT` | ❌ | Environment name | `production` |

## 🎉 Success Criteria

Your SPA routing is working correctly when:

1. ✅ Direct navigation to any route loads the app
2. ✅ Page refresh on any route maintains the current page
3. ✅ Invalid routes show your custom 404 page (not server 404)
4. ✅ Browser back/forward buttons work correctly
5. ✅ Shared deep links work for other users
6. ✅ API calls use the correct production endpoint

---

**Next Steps:** After successful deployment, monitor your application logs and user analytics to ensure the routing is working as expected in production.