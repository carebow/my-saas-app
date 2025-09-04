"""AWS configuration and utilities for CareBow backend."""

import json
import boto3
from botocore.exceptions import ClientError
from typing import Dict, Any, Optional
from functools import lru_cache
import logging

logger = logging.getLogger(__name__)


class AWSConfig:
    """AWS configuration manager."""
    
    def __init__(self):
        self.session = boto3.Session()
        self.secrets_client = self.session.client('secretsmanager')
        self.s3_client = self.session.client('s3')
        self.ses_client = self.session.client('ses')
        
    @lru_cache(maxsize=10)
    def get_secret(self, secret_name: str) -> Dict[str, Any]:
        """
        Retrieve secret from AWS Secrets Manager.
        
        Args:
            secret_name: Name of the secret in AWS Secrets Manager
            
        Returns:
            Dictionary containing secret values
            
        Raises:
            ClientError: If secret cannot be retrieved
        """
        try:
            response = self.secrets_client.get_secret_value(SecretId=secret_name)
            return json.loads(response['SecretString'])
        except ClientError as e:
            logger.error(f"Error retrieving secret {secret_name}: {e}")
            raise
    
    def get_database_url(self) -> str:
        """Get database URL from secrets."""
        try:
            secrets = self.get_secret('carebow-db-password')
            return f"postgresql://{secrets['username']}:{secrets['password']}@{secrets['host']}:{secrets['port']}/{secrets['dbname']}"
        except (KeyError, ClientError) as e:
            logger.error(f"Error getting database URL: {e}")
            # Fallback to environment variable
            import os
            return os.getenv('DATABASE_URL', 'sqlite:///./carebow.db')
    
    def get_redis_url(self) -> str:
        """Get Redis URL from secrets."""
        try:
            secrets = self.get_secret('carebow-app-secrets')
            return secrets.get('redis_url', 'redis://localhost:6379')
        except ClientError as e:
            logger.error(f"Error getting Redis URL: {e}")
            import os
            return os.getenv('REDIS_URL', 'redis://localhost:6379')
    
    def get_openai_api_key(self) -> str:
        """Get OpenAI API key from secrets."""
        try:
            secrets = self.get_secret('carebow-app-secrets')
            return secrets.get('openai_api_key', '')
        except ClientError as e:
            logger.error(f"Error getting OpenAI API key: {e}")
            import os
            return os.getenv('OPENAI_API_KEY', '')
    
    def get_stripe_keys(self) -> Dict[str, str]:
        """Get Stripe keys from secrets."""
        try:
            secrets = self.get_secret('carebow-app-secrets')
            return {
                'secret_key': secrets.get('stripe_secret_key', ''),
                'publishable_key': secrets.get('stripe_publishable_key', ''),
                'webhook_secret': secrets.get('stripe_webhook_secret', '')
            }
        except ClientError as e:
            logger.error(f"Error getting Stripe keys: {e}")
            import os
            return {
                'secret_key': os.getenv('STRIPE_SECRET_KEY', ''),
                'publishable_key': os.getenv('STRIPE_PUBLISHABLE_KEY', ''),
                'webhook_secret': os.getenv('STRIPE_WEBHOOK_SECRET', '')
            }
    
    def get_email_config(self) -> Dict[str, str]:
        """Get email configuration from secrets."""
        try:
            secrets = self.get_secret('carebow-app-secrets')
            return {
                'smtp_host': secrets.get('smtp_host', 'smtp.gmail.com'),
                'smtp_port': secrets.get('smtp_port', '587'),
                'smtp_user': secrets.get('smtp_user', ''),
                'smtp_password': secrets.get('smtp_password', ''),
                'from_email': secrets.get('emails_from_email', 'noreply@carebow.com')
            }
        except ClientError as e:
            logger.error(f"Error getting email config: {e}")
            import os
            return {
                'smtp_host': os.getenv('SMTP_HOST', 'smtp.gmail.com'),
                'smtp_port': os.getenv('SMTP_PORT', '587'),
                'smtp_user': os.getenv('SMTP_USER', ''),
                'smtp_password': os.getenv('SMTP_PASSWORD', ''),
                'from_email': os.getenv('EMAILS_FROM_EMAIL', 'noreply@carebow.com')
            }
    
    def upload_to_s3(self, file_content: bytes, bucket: str, key: str, 
                     content_type: Optional[str] = None) -> str:
        """
        Upload file to S3 bucket.
        
        Args:
            file_content: File content as bytes
            bucket: S3 bucket name
            key: S3 object key
            content_type: MIME type of the file
            
        Returns:
            S3 object URL
        """
        try:
            extra_args = {}
            if content_type:
                extra_args['ContentType'] = content_type
                
            self.s3_client.put_object(
                Bucket=bucket,
                Key=key,
                Body=file_content,
                **extra_args
            )
            
            return f"https://{bucket}.s3.amazonaws.com/{key}"
        except ClientError as e:
            logger.error(f"Error uploading to S3: {e}")
            raise
    
    def send_email_ses(self, to_email: str, subject: str, body: str, 
                       from_email: Optional[str] = None) -> bool:
        """
        Send email using AWS SES.
        
        Args:
            to_email: Recipient email address
            subject: Email subject
            body: Email body (HTML or text)
            from_email: Sender email address
            
        Returns:
            True if email sent successfully, False otherwise
        """
        try:
            email_config = self.get_email_config()
            from_email = from_email or email_config['from_email']
            
            response = self.ses_client.send_email(
                Source=from_email,
                Destination={'ToAddresses': [to_email]},
                Message={
                    'Subject': {'Data': subject},
                    'Body': {'Html': {'Data': body}}
                }
            )
            
            logger.info(f"Email sent successfully. MessageId: {response['MessageId']}")
            return True
        except ClientError as e:
            logger.error(f"Error sending email via SES: {e}")
            return False


# Global AWS config instance
aws_config = AWSConfig()


def get_aws_config() -> AWSConfig:
    """Get the global AWS configuration instance."""
    return aws_config