#!/usr/bin/env node

/**
 * Phase 5 Testing Script - Frontend Build & Router
 * Tests all Phase 5 requirements
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('🧪 Phase 5 Testing - Frontend Build & Router');
console.log('='.repeat(50));

let allTestsPassed = true;

// Test 1: SPA Routing Configuration
console.log('\n1️⃣ Testing SPA Routing Configuration...');

const appTsxPath = path.join(process.cwd(), 'src', 'App.tsx');
if (fs.existsSync(appTsxPath)) {
  const appContent = fs.readFileSync(appTsxPath, 'utf8');
  
  if (appContent.includes('BrowserRouter')) {
    console.log('✅ BrowserRouter found in App.tsx');
  } else {
    console.log('❌ BrowserRouter not found in App.tsx');
    allTestsPassed = false;
  }
  
  if (appContent.includes('Routes') && appContent.includes('Route')) {
    console.log('✅ React Router Routes configuration found');
  } else {
    console.log('❌ React Router Routes configuration missing');
    allTestsPassed = false;
  }
  
  if (appContent.includes('/dashboard')) {
    console.log('✅ Dashboard route configured for deep link testing');
  } else {
    console.log('❌ Dashboard route missing for deep link testing');
    allTestsPassed = false;
  }
} else {
  console.log('❌ App.tsx not found');
  allTestsPassed = false;
}

// Test 2: 404 Handling
console.log('\n2️⃣ Testing 404 Handling...');

const notFoundPath = path.join(process.cwd(), 'src', 'pages', 'NotFound.tsx');
if (fs.existsSync(notFoundPath)) {
  const notFoundContent = fs.readFileSync(notFoundPath, 'utf8');
  
  if (notFoundContent.includes('404') && notFoundContent.includes('Page Not Found')) {
    console.log('✅ Enhanced 404 component found');
  } else {
    console.log('❌ 404 component not properly configured');
    allTestsPassed = false;
  }
  
  if (notFoundContent.includes('Link') && notFoundContent.includes('Button')) {
    console.log('✅ 404 page has navigation elements');
  } else {
    console.log('❌ 404 page missing navigation elements');
    allTestsPassed = false;
  }
} else {
  console.log('❌ NotFound.tsx component missing');
  allTestsPassed = false;
}

// Test 3: Environment Variables
console.log('\n3️⃣ Testing Environment Variables...');

// Load .env file
const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  if (envContent.includes('VITE_API_BASE=https://d2usoqe1zof3pe.cloudfront.net/api')) {
    console.log('✅ VITE_API_BASE configured correctly');
  } else {
    console.log('❌ VITE_API_BASE not configured or incorrect');
    allTestsPassed = false;
  }
  
  if (envContent.includes('VITE_SUPABASE_URL')) {
    console.log('✅ VITE_SUPABASE_URL found');
  } else {
    console.log('❌ VITE_SUPABASE_URL missing');
    allTestsPassed = false;
  }
} else {
  console.log('❌ .env file not found');
  allTestsPassed = false;
}

// Test 4: S3/CloudFront Routing Rules
console.log('\n4️⃣ Testing S3/CloudFront Routing Rules...');

const redirectsPath = path.join(process.cwd(), 'public', '_redirects');
if (fs.existsSync(redirectsPath)) {
  const redirectsContent = fs.readFileSync(redirectsPath, 'utf8');
  
  if (redirectsContent.includes('/*    /index.html   200')) {
    console.log('✅ Netlify SPA fallback rule configured');
  } else {
    console.log('❌ Netlify SPA fallback rule missing');
    allTestsPassed = false;
  }
} else {
  console.log('⚠️  _redirects file not found (OK for S3/CloudFront)');
}

const cloudFrontConfigPath = path.join(process.cwd(), 'aws', 'cloudfront-error-pages.json');
if (fs.existsSync(cloudFrontConfigPath)) {
  const configContent = fs.readFileSync(cloudFrontConfigPath, 'utf8');
  const config = JSON.parse(configContent);
  
  const has404Rule = config.CustomErrorResponses?.some(
    response => response.ErrorCode === 404 && response.ResponsePagePath === '/index.html'
  );
  const has403Rule = config.CustomErrorResponses?.some(
    response => response.ErrorCode === 403 && response.ResponsePagePath === '/index.html'
  );
  
  if (has404Rule && has403Rule) {
    console.log('✅ CloudFront error pages configured for SPA routing');
  } else {
    console.log('❌ CloudFront error pages not properly configured');
    allTestsPassed = false;
  }
} else {
  console.log('❌ CloudFront error pages configuration missing');
  allTestsPassed = false;
}

// Test 5: Build Scripts
console.log('\n5️⃣ Testing Build Scripts...');

const packageJsonPath = path.join(process.cwd(), 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageContent = fs.readFileSync(packageJsonPath, 'utf8');
  const packageJson = JSON.parse(packageContent);
  
  if (packageJson.scripts?.['validate-env']) {
    console.log('✅ Environment validation script configured');
  } else {
    console.log('❌ Environment validation script missing');
    allTestsPassed = false;
  }
  
  if (packageJson.scripts?.build?.includes('validate-env')) {
    console.log('✅ Build process includes environment validation');
  } else {
    console.log('❌ Build process missing environment validation');
    allTestsPassed = false;
  }
} else {
  console.log('❌ package.json not found');
  allTestsPassed = false;
}

// Test 6: Vite Configuration
console.log('\n6️⃣ Testing Vite Configuration...');

const viteConfigPath = path.join(process.cwd(), 'vite.config.ts');
if (fs.existsSync(viteConfigPath)) {
  const viteContent = fs.readFileSync(viteConfigPath, 'utf8');
  
  if (viteContent.includes('copyPublicDir: true')) {
    console.log('✅ Vite configured to copy public directory');
  } else {
    console.log('❌ Vite not configured to copy public directory');
    allTestsPassed = false;
  }
  
  if (viteContent.includes('BrowserRouter') || viteContent.includes('react-router')) {
    console.log('✅ Vite optimized for React Router');
  } else {
    console.log('⚠️  Vite optimization for React Router not detected');
  }
} else {
  console.log('❌ vite.config.ts not found');
  allTestsPassed = false;
}

// Final Results
console.log('\n' + '='.repeat(50));
if (allTestsPassed) {
  console.log('🎉 All Phase 5 tests PASSED!');
  console.log('\n✅ Phase 5 Requirements Completed:');
  console.log('   • SPA routing with React Router configured');
  console.log('   • Enhanced 404 page with navigation');
  console.log('   • Environment variables validated at build-time');
  console.log('   • S3/CloudFront error mapping configured');
  console.log('   • Deep link testing route (/dashboard) added');
  
  console.log('\n🚀 Ready for deployment testing:');
  console.log('   1. Build: npm run build:prod');
  console.log('   2. Deploy to S3/CloudFront');
  console.log('   3. Test: https://yourdomain.com/dashboard');
  console.log('   4. Refresh page - should still show dashboard');
  console.log('   5. Test invalid URL - should show 404 page');
} else {
  console.log('❌ Some Phase 5 tests FAILED!');
  console.log('Please review the failed tests above and fix the issues.');
  process.exit(1);
}

console.log('\n📋 Next Steps:');
console.log('   • Deploy to production environment');
console.log('   • Test deep links in production');
console.log('   • Monitor 404 errors in analytics');
console.log('   • Verify API calls use correct endpoint');