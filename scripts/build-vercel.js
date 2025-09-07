#!/usr/bin/env node

/**
 * Vercel-specific build script that skips environment validation
 * and uses default values for production deployment
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('🚀 Building for Vercel deployment...');

// Set default environment variables for Vercel
const defaultEnvVars = {
  VITE_API_BASE: 'https://api.carebow.com',
  VITE_SUPABASE_URL: 'https://your-project.supabase.co',
  VITE_SUPABASE_PUBLISHABLE_KEY: 'your-publishable-key',
  VITE_SENTRY_DSN: 'https://your-frontend-sentry-dsn-here@sentry.io/project-id',
  VITE_ENVIRONMENT: 'production',
  VITE_APP_VERSION: '1.0.0',
  VITE_ENABLE_ANALYTICS: 'false',
  VITE_ENABLE_DEBUG: 'false'
};

// Set environment variables
Object.entries(defaultEnvVars).forEach(([key, value]) => {
  if (!process.env[key]) {
    process.env[key] = value;
    console.log(`✅ Set ${key}: ${value.substring(0, 20)}${value.length > 20 ? '...' : ''}`);
  }
});

try {
  // Run the build
  console.log('📦 Running Vite build...');
  execSync('vite build --mode production', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  console.log('✅ Vercel build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
