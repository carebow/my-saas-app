# AWS Configuration for CareBow
# Centralized configuration for AWS services and HIPAA compliance

from pydantic import BaseSettings
from typing import Optional, Dict, Any

class AWSSettings(BaseSettings):
    """AWS-specific configuration settings"""
    
    # AWS Region
    aws_region: str = "us-east-1"
    
    # S3 Configuration
    s3_chat_data_bucket: str = "carebow-chat-data"
    s3_exports_bucket: str = "carebow-exports"
    s3_static_website_bucket: str = "carebow-static-website"
    
    # RDS Configuration
    rds_instance_class: str = "db.t3.micro"
    rds_allocated_storage: int = 20
    rds_multi_az: bool = False
    rds_deletion_protection: bool = True
    
    # OpenSearch Configuration
    opensearch_domain_name: str = "carebow-search"
    opensearch_instance_type: str = "t3.small.search"
    
    # Cognito Configuration
    cognito_user_pool_id: Optional[str] = None
    cognito_client_id: Optional[str] = None
    
    # Step Functions Configuration
    data_export_state_machine_arn: Optional[str] = None
    data_deletion_state_machine_arn: Optional[str] = None
    
    # SQS Configuration
    export_queue_url: Optional[str] = None
    deletion_queue_url: Optional[str] = None
    
    # SNS Configuration
    notification_topic_arn: Optional[str] = None
    
    # HIPAA Compliance
    hipaa_enabled: bool = True
    hipaa_audit_logging: bool = True
    
    class Config:
        env_file = ".env"
        case_sensitive = False

# Global AWS settings instance
aws_settings = AWSSettings()