#!/usr/bin/env python3
"""
Environment Variable Validation Script for CareBow
Ensures all required environment variables are properly configured for production deployment.
"""

import os
import sys
from typing import Dict, List, Tuple
from urllib.parse import urlparse
import re


class EnvironmentValidator:
    def __init__(self):
        self.errors: List[str] = []
        self.warnings: List[str] = []
        self.env_vars: Dict[str, str] = dict(os.environ)
        
    def validate_required_var(self, var_name: str, description: str = "") -> bool:
        """Validate that a required environment variable exists and is not empty."""
        value = self.env_vars.get(var_name, "").strip()
        if not value:
            self.errors.append(f"❌ {var_name}: Required variable is missing or empty. {description}")
            return False
        return True
    
    def validate_url(self, var_name: str, description: str = "") -> bool:
        """Validate URL format."""
        value = self.env_vars.get(var_name, "").strip()
        if not value:
            return False
        
        try:
            parsed = urlparse(value)
            if not parsed.scheme or not parsed.netloc:
                self.errors.append(f"❌ {var_name}: Invalid URL format. {description}")
                return False
        except Exception:
            self.errors.append(f"❌ {var_name}: Invalid URL format. {description}")
            return False
        
        return True
    
    def validate_email(self, var_name: str) -> bool:
        """Validate email format."""
        value = self.env_vars.get(var_name, "").strip()
        if not value:
            return False
        
        email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_regex, value):
            self.errors.append(f"❌ {var_name}: Invalid email format")
            return False
        
        return True
    
    def validate_key_length(self, var_name: str, min_length: int, description: str = "") -> bool:
        """Validate key minimum length."""
        value = self.env_vars.get(var_name, "").strip()
        if not value:
            return False
        
        if len(value) < min_length:
            self.errors.append(f"❌ {var_name}: Key too short (minimum {min_length} characters). {description}")
            return False
        
        return True
    
    def validate_api_key_format(self, var_name: str, prefix: str) -> bool:
        """Validate API key format."""
        value = self.env_vars.get(var_name, "").strip()
        if not value:
            return False
        
        if not value.startswith(prefix):
            self.errors.append(f"❌ {var_name}: Invalid API key format (should start with '{prefix}')")
            return False
        
        return True
    
    def validate_environment(self):
        """Main validation method."""
        print("🔍 Validating CareBow Environment Configuration...")
        print("=" * 60)
        
        # Environment Type
        environment = self.env_vars.get("ENVIRONMENT", "development")
        if environment not in ["development", "staging", "production"]:
            self.warnings.append(f"⚠️  ENVIRONMENT: Unknown environment '{environment}', should be development/staging/production")
        
        # Critical Configuration
        print("\n📊 Critical Configuration:")
        self.validate_required_var("SECRET_KEY", "JWT secret key for authentication")
        self.validate_key_length("SECRET_KEY", 32, "Should be at least 32 characters for security")
        
        # Database
        print("\n🗄️  Database Configuration:")
        if self.validate_required_var("DATABASE_URL", "Database connection string"):
            self.validate_url("DATABASE_URL", "Should be valid database URL")
        
        # Redis
        print("\n🔄 Redis Configuration:")
        if self.validate_required_var("REDIS_URL", "Redis connection string"):
            self.validate_url("REDIS_URL", "Should be valid Redis URL")
        
        # OpenAI
        print("\n🤖 OpenAI Configuration:")
        if self.validate_required_var("OPENAI_API_KEY", "OpenAI API key for AI consultations"):
            self.validate_api_key_format("OPENAI_API_KEY", "sk-")
        
        # Stripe (Critical for payments)
        print("\n💳 Stripe Configuration:")
        stripe_required = environment in ["staging", "production"]
        if stripe_required:
            self.validate_required_var("STRIPE_SECRET_KEY", "Stripe secret key for payment processing")
            self.validate_required_var("STRIPE_PUBLISHABLE_KEY", "Stripe publishable key")
            self.validate_required_var("STRIPE_WEBHOOK_SECRET", "Stripe webhook secret")
            
            if self.env_vars.get("STRIPE_SECRET_KEY"):
                prefix = "sk_live_" if environment == "production" else "sk_test_"
                self.validate_api_key_format("STRIPE_SECRET_KEY", prefix)
        
        # Email Configuration
        print("\n📧 Email Configuration:")
        email_required = self.env_vars.get("ENABLE_EMAIL_VERIFICATION", "true").lower() == "true"
        if email_required or environment in ["staging", "production"]:
            self.validate_required_var("SMTP_HOST", "SMTP server host")
            self.validate_required_var("SMTP_USER", "SMTP username")
            self.validate_required_var("SMTP_PASSWORD", "SMTP password")
            if self.env_vars.get("EMAILS_FROM_EMAIL"):
                self.validate_email("EMAILS_FROM_EMAIL")
        
        # Sentry (Recommended for production)
        print("\n📊 Monitoring Configuration:")
        if environment in ["staging", "production"]:
            if not self.env_vars.get("SENTRY_DSN"):
                self.warnings.append("⚠️  SENTRY_DSN: Recommended for production error monitoring")
            elif self.env_vars.get("SENTRY_DSN"):
                self.validate_url("SENTRY_DSN", "Should be valid Sentry DSN URL")
        
        # AWS Configuration (for production deployment)
        print("\n☁️  AWS Configuration:")
        if environment in ["staging", "production"]:
            self.validate_required_var("AWS_ACCESS_KEY_ID", "AWS access key for deployment")
            self.validate_required_var("AWS_SECRET_ACCESS_KEY", "AWS secret key")
            self.validate_required_var("AWS_S3_BUCKET", "S3 bucket for document storage")
        
        # Healthcare Compliance
        print("\n🏥 Healthcare Compliance:")
        if environment in ["staging", "production"]:
            if self.validate_required_var("HIPAA_ENCRYPTION_KEY", "HIPAA encryption key for healthcare data"):
                self.validate_key_length("HIPAA_ENCRYPTION_KEY", 32, "Must be 32+ characters for AES encryption")
        
        # Security Validation
        print("\n🔐 Security Validation:")
        self._validate_security_settings()
        
        # Summary
        self._print_summary()
        
        # Return validation status
        return len(self.errors) == 0
    
    def _validate_security_settings(self):
        """Validate security-related settings."""
        environment = self.env_vars.get("ENVIRONMENT", "development")
        
        # Check for default/weak secrets
        secret_key = self.env_vars.get("SECRET_KEY", "")
        if secret_key in ["your-secret-key-change-this-in-production", "secret", "password", "123456"]:
            self.errors.append("❌ SECRET_KEY: Using default/weak secret key")
        
        # Production security checks
        if environment == "production":
            if "localhost" in str(self.env_vars.get("BACKEND_CORS_ORIGINS", "")):
                self.warnings.append("⚠️  BACKEND_CORS_ORIGINS: Contains localhost in production")
            
            if "*" in str(self.env_vars.get("ALLOWED_HOSTS", "")):
                self.warnings.append("⚠️  ALLOWED_HOSTS: Wildcard (*) allowed in production - security risk")
    
    def _print_summary(self):
        """Print validation summary."""
        print("\n" + "=" * 60)
        print("📋 VALIDATION SUMMARY")
        print("=" * 60)
        
        if self.errors:
            print(f"\n❌ ERRORS ({len(self.errors)}):")
            for error in self.errors:
                print(f"   {error}")
        
        if self.warnings:
            print(f"\n⚠️  WARNINGS ({len(self.warnings)}):")
            for warning in self.warnings:
                print(f"   {warning}")
        
        if not self.errors and not self.warnings:
            print("✅ All environment variables are properly configured!")
        elif not self.errors:
            print("✅ No critical errors found. Warnings should be addressed.")
        else:
            print("❌ Critical errors found. Please fix before deploying.")
            
        print("\n" + "=" * 60)


def main():
    """Main entry point."""
    validator = EnvironmentValidator()
    
    # Load .env file if it exists
    env_file = os.getenv("ENV_FILE", ".env")
    if os.path.exists(env_file):
        print(f"📄 Loading environment from: {env_file}")
        try:
            from dotenv import load_dotenv
            load_dotenv(env_file)
            # Reload environment variables
            validator.env_vars = dict(os.environ)
        except ImportError:
            print("⚠️  python-dotenv not available, using system environment variables only")
    
    success = validator.validate_environment()
    
    # Exit with appropriate code
    if not success:
        print("\n🚨 Environment validation failed!")
        print("Please fix the errors above before proceeding.")
        sys.exit(1)
    else:
        print("\n✅ Environment validation passed!")
        sys.exit(0)


if __name__ == "__main__":
    main()
