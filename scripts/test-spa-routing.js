#!/usr/bin/env node

/**
 * Tests SPA routing after build to ensure deep links work
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('🧪 Testing SPA routing configuration...');

const distDir = path.join(process.cwd(), 'dist');
const indexPath = path.join(distDir, 'index.html');
const redirectsPath = path.join(distDir, '_redirects');

// Check if build output exists
if (!fs.existsSync(distDir)) {
  console.error('❌ Build output directory not found. Run `npm run build` first.');
  process.exit(1);
}

// Check if index.html exists
if (!fs.existsSync(indexPath)) {
  console.error('❌ index.html not found in build output.');
  process.exit(1);
}

console.log('✅ index.html found');

// Check if _redirects file exists (for Netlify)
if (fs.existsSync(redirectsPath)) {
  console.log('✅ _redirects file found for Netlify deployment');
  
  const redirectsContent = fs.readFileSync(redirectsPath, 'utf8');
  if (redirectsContent.includes('/*    /index.html   200')) {
    console.log('✅ SPA fallback rule found in _redirects');
  } else {
    console.error('❌ SPA fallback rule missing in _redirects');
    process.exit(1);
  }
} else {
  console.log('⚠️  _redirects file not found (OK for S3/CloudFront deployment)');
}

// Check if CloudFront error pages config exists
const cloudFrontConfigPath = path.join(process.cwd(), 'aws', 'cloudfront-error-pages.json');
if (fs.existsSync(cloudFrontConfigPath)) {
  console.log('✅ CloudFront error pages configuration found');
  
  const config = JSON.parse(fs.readFileSync(cloudFrontConfigPath, 'utf8'));
  const has404Rule = config.CustomErrorResponses.some(
    response => response.ErrorCode === 404 && response.ResponsePagePath === '/index.html'
  );
  const has403Rule = config.CustomErrorResponses.some(
    response => response.ErrorCode === 403 && response.ResponsePagePath === '/index.html'
  );
  
  if (has404Rule && has403Rule) {
    console.log('✅ CloudFront SPA routing rules configured correctly');
  } else {
    console.error('❌ CloudFront SPA routing rules incomplete');
    process.exit(1);
  }
}

// Check if index.html contains proper base tag and meta tags
const indexContent = fs.readFileSync(indexPath, 'utf8');

if (indexContent.includes('<base href="/"') || !indexContent.includes('<base href=')) {
  console.log('✅ Base href configuration OK');
} else {
  console.error('❌ Incorrect base href in index.html');
  process.exit(1);
}

// Check for React Router setup in built files
const assetsDir = path.join(distDir, 'assets');
if (fs.existsSync(assetsDir)) {
  const jsFiles = fs.readdirSync(assetsDir).filter(file => file.endsWith('.js'));
  let hasRouterCode = false;
  
  for (const jsFile of jsFiles) {
    const jsContent = fs.readFileSync(path.join(assetsDir, jsFile), 'utf8');
    if (jsContent.includes('BrowserRouter') || jsContent.includes('react-router')) {
      hasRouterCode = true;
      break;
    }
  }
  
  if (hasRouterCode) {
    console.log('✅ React Router code found in build');
  } else {
    console.log('⚠️  React Router code not detected (may be minified)');
  }
}

console.log('\n✅ SPA routing configuration test passed!');
console.log('\n📋 Deployment checklist:');
console.log('   • For S3 + CloudFront: Apply error pages configuration');
console.log('   • For Netlify: _redirects file will be deployed automatically');
console.log('   • Test deep links after deployment: /dashboard, /services, etc.');
console.log('   • Verify 404 pages redirect to app and show custom 404 component');