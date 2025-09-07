#!/usr/bin/env node

/**
 * Validates environment variables at build time
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env file manually
const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const [key, ...valueParts] = trimmedLine.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').replace(/^["']|["']$/g, '');
        process.env[key] = value;
      }
    }
  });
}

const requiredEnvVars = [
  'VITE_API_BASE',
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_PUBLISHABLE_KEY'
];

const optionalEnvVars = [
  'VITE_SENTRY_DSN',
  'VITE_ENVIRONMENT',
  'VITE_APP_VERSION',
  'VITE_ENABLE_ANALYTICS',
  'VITE_ENABLE_DEBUG'
];

console.log('🔍 Validating environment variables...');

let hasErrors = false;

// Check required variables
requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (!value) {
    console.error(`❌ Missing required environment variable: ${varName}`);
    hasErrors = true;
  } else {
    console.log(`✅ ${varName}: ${value.substring(0, 20)}${value.length > 20 ? '...' : ''}`);
  }
});

// Check optional variables
optionalEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value}`);
  } else {
    console.log(`⚠️  Optional variable not set: ${varName}`);
  }
});

// Validate API_BASE format (only require HTTPS in production)
const apiBase = process.env.VITE_API_BASE;
const environment = process.env.VITE_ENVIRONMENT || 'development';
if (apiBase && environment === 'production' && !apiBase.startsWith('https://')) {
  console.error(`❌ VITE_API_BASE must start with https:// for production builds`);
  hasErrors = true;
} else if (apiBase && environment === 'development' && !apiBase.startsWith('http')) {
  console.error(`❌ VITE_API_BASE must be a valid URL`);
  hasErrors = true;
}

if (hasErrors) {
  console.error('\n❌ Environment validation failed. Please check your .env file.');
  process.exit(1);
}

console.log('\n✅ Environment validation passed!');