# CareBow AWS-Native Architecture - Main Configuration
# This is the production-grade Terraform configuration for the complete CareBow platform

terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }

  backend "s3" {
    # Configure your S3 backend here
    # bucket = "your-terraform-state-bucket"
    # key    = "carebow/terraform.tfstate"
    # region = "us-east-1"
  }
}

# Data sources
data "aws_region" "current" {}
data "aws_caller_identity" "current" {}
data "aws_availability_zones" "available" {
  state = "available"
}

# Local values
locals {
  project_name = "carebow"
  environment  = var.environment
  common_tags = {
    Project     = local.project_name
    Environment = local.environment
    ManagedBy   = "Terraform"
    HIPAA       = "true"
  }
}

# VPC Module
module "vpc" {
  source = "./modules/vpc"

  project_name = local.project_name
  environment  = local.environment

  vpc_cidr = var.vpc_cidr
  availability_zones = slice(data.aws_availability_zones.available.names, 0, 2)

  public_subnet_cidrs  = var.public_subnet_cidrs
  private_subnet_cidrs = var.private_subnet_cidrs
  database_subnet_cidrs = var.database_subnet_cidrs

  enable_nat_gateway = true
  enable_vpn_gateway = false

  tags = local.common_tags
}

# Cognito Module
module "cognito" {
  source = "./modules/cognito"

  project_name = local.project_name
  environment  = local.environment

  callback_urls = var.callback_urls
  logout_urls   = var.logout_urls

  # Lambda triggers (optional)
  pre_sign_up_lambda_arn           = var.pre_sign_up_lambda_arn
  post_confirmation_lambda_arn     = var.post_confirmation_lambda_arn
  pre_authentication_lambda_arn    = var.pre_authentication_lambda_arn
  post_authentication_lambda_arn   = var.post_authentication_lambda_arn

  tags = local.common_tags
}

# RDS Module
module "rds" {
  source = "./modules/rds"

  project_name = local.project_name
  environment  = local.environment

  vpc_id              = module.vpc.vpc_id
  database_subnet_ids = module.vpc.database_subnet_ids

  allowed_cidr_blocks = [module.vpc.vpc_cidr_block]
  allowed_security_group_ids = [
    module.ecs.security_group_id,
    module.lambda.security_group_id
  ]

  # Database configuration
  database_name = var.database_name
  master_username = var.master_username
  engine_version = var.engine_version
  instance_class = var.instance_class

  # Storage configuration
  allocated_storage     = var.allocated_storage
  max_allocated_storage = var.max_allocated_storage

  # High availability
  multi_az = var.multi_az
  create_read_replica = var.create_read_replica

  # Backup configuration
  backup_retention_period = var.backup_retention_period
  backup_window          = var.backup_window
  maintenance_window     = var.maintenance_window

  # Security
  deletion_protection = var.deletion_protection
  skip_final_snapshot = var.skip_final_snapshot

  # Monitoring
  monitoring_interval = var.monitoring_interval
  performance_insights_enabled = var.performance_insights_enabled
  performance_insights_retention_period = var.performance_insights_retention_period

  # Performance tuning
  max_connections = var.max_connections
  shared_buffers = var.shared_buffers
  effective_cache_size = var.effective_cache_size
  work_mem = var.work_mem

  tags = local.common_tags
}

# S3 Module
module "s3" {
  source = "./modules/s3"

  project_name = local.project_name
  environment  = local.environment

  # Bucket configurations
  chat_data_bucket_name = var.chat_data_bucket_name
  exports_bucket_name   = var.exports_bucket_name
  static_website_bucket_name = var.static_website_bucket_name

  # Encryption
  kms_key_id = module.kms.s3_key_id

  # Versioning and lifecycle
  enable_versioning = var.enable_s3_versioning
  enable_lifecycle = var.enable_s3_lifecycle

  # Access logging
  enable_access_logging = var.enable_s3_access_logging
  access_logging_bucket = var.access_logging_bucket

  tags = local.common_tags
}

# KMS Module
module "kms" {
  source = "./modules/kms"

  project_name = local.project_name
  environment  = local.environment

  tags = local.common_tags
}

# OpenSearch Module
module "opensearch" {
  source = "./modules/opensearch"

  project_name = local.project_name
  environment  = local.environment

  vpc_id              = module.vpc.vpc_id
  private_subnet_ids  = module.vpc.private_subnet_ids

  # Security
  allowed_cidr_blocks = [module.vpc.vpc_cidr_block]
  allowed_security_group_ids = [
    module.ecs.security_group_id,
    module.lambda.security_group_id
  ]

  # Encryption
  kms_key_id = module.kms.opensearch_key_id

  # Configuration
  instance_type = var.opensearch_instance_type
  instance_count = var.opensearch_instance_count
  volume_size = var.opensearch_volume_size

  # Access
  master_user_arn = module.cognito.authenticated_role_arn

  tags = local.common_tags
}

# ECS Module
module "ecs" {
  source = "./modules/ecs"

  project_name = local.project_name
  environment  = local.environment

  vpc_id              = module.vpc.vpc_id
  private_subnet_ids  = module.vpc.private_subnet_ids
  public_subnet_ids   = module.vpc.public_subnet_ids

  # Security
  allowed_cidr_blocks = [module.vpc.vpc_cidr_block]

  # Database
  database_endpoint = module.rds.db_instance_endpoint
  database_name     = module.rds.db_instance_name
  database_username = module.rds.db_instance_username
  database_password = module.rds.db_instance_password

  # Secrets
  secrets_manager_arn = module.kms.secrets_manager_key_id

  # S3
  chat_data_bucket = module.s3.chat_data_bucket_name
  exports_bucket   = module.s3.exports_bucket_name

  # OpenSearch
  opensearch_endpoint = module.opensearch.domain_endpoint

  # Cognito
  cognito_user_pool_id = module.cognito.user_pool_id
  cognito_client_id    = module.cognito.api_client_id

  # Application
  app_port = var.app_port
  cpu      = var.ecs_cpu
  memory   = var.ecs_memory

  # Auto scaling
  min_capacity = var.ecs_min_capacity
  max_capacity = var.ecs_max_capacity

  tags = local.common_tags
}

# Lambda Module
module "lambda" {
  source = "./modules/lambda"

  project_name = local.project_name
  environment  = local.environment

  vpc_id              = module.vpc.vpc_id
  private_subnet_ids  = module.vpc.private_subnet_ids

  # Security
  allowed_cidr_blocks = [module.vpc.vpc_cidr_block]

  # Database
  database_endpoint = module.rds.db_instance_endpoint
  database_name     = module.rds.db_instance_name
  database_username = module.rds.db_instance_username
  database_password = module.rds.db_instance_password

  # S3
  chat_data_bucket = module.s3.chat_data_bucket_name
  exports_bucket   = module.s3.exports_bucket_name

  # OpenSearch
  opensearch_endpoint = module.opensearch.domain_endpoint

  # Cognito
  cognito_user_pool_id = module.cognito.user_pool_id

  # SNS
  notification_topic_arn = module.sns.notification_topic_arn

  tags = local.common_tags
}

# SNS Module
module "sns" {
  source = "./modules/sns"

  project_name = local.project_name
  environment  = local.environment

  # Email configuration
  admin_email = var.admin_email
  support_email = var.support_email

  tags = local.common_tags
}

# SQS Module
module "sqs" {
  source = "./modules/sqs"

  project_name = local.project_name
  environment  = local.environment

  # Dead letter queues
  enable_dlq = var.enable_sqs_dlq
  max_receive_count = var.sqs_max_receive_count

  tags = local.common_tags
}

# Step Functions Module
module "step_functions" {
  source = "./modules/step-functions"

  project_name = local.project_name
  environment  = local.environment

  # Lambda functions
  data_export_lambda_arn   = module.lambda.data_export_function_arn
  data_deletion_lambda_arn = module.lambda.data_deletion_function_arn
  notification_lambda_arn  = module.lambda.notification_function_arn

  # Queues
  export_queue_arn   = module.sqs.export_queue_arn
  deletion_queue_arn = module.sqs.deletion_queue_arn

  # Topics
  notification_topic_arn = module.sns.notification_topic_arn

  # Grace period
  grace_period_seconds = var.grace_period_seconds

  tags = local.common_tags
}

# CloudFront Module
module "cloudfront" {
  source = "./modules/cloudfront"

  project_name = local.project_name
  environment  = local.environment

  # S3 buckets
  static_website_bucket_domain = module.s3.static_website_bucket_domain_name
  chat_data_bucket_domain     = module.s3.chat_data_bucket_domain_name

  # API Gateway
  api_gateway_domain = module.api_gateway.api_gateway_domain

  # Cognito
  cognito_user_pool_domain = module.cognito.user_pool_domain

  # WAF
  waf_web_acl_arn = module.waf.web_acl_arn

  # SSL Certificate
  certificate_arn = var.certificate_arn

  tags = local.common_tags
}

# API Gateway Module
module "api_gateway" {
  source = "./modules/api-gateway"

  project_name = local.project_name
  environment  = local.environment

  # ECS
  ecs_cluster_name = module.ecs.cluster_name
  ecs_service_name = module.ecs.service_name
  ecs_target_group_arn = module.ecs.target_group_arn

  # Lambda
  lambda_function_arns = [
    module.lambda.data_export_function_arn,
    module.lambda.data_deletion_function_arn,
    module.lambda.notification_function_arn
  ]

  # Cognito
  cognito_user_pool_id = module.cognito.user_pool_id
  cognito_user_pool_arn = module.cognito.user_pool_arn

  # WAF
  waf_web_acl_arn = module.waf.web_acl_arn

  tags = local.common_tags
}

# WAF Module
module "waf" {
  source = "./modules/waf"

  project_name = local.project_name
  environment  = local.environment

  # CloudFront
  cloudfront_distribution_id = module.cloudfront.distribution_id

  # API Gateway
  api_gateway_stage_arn = module.api_gateway.stage_arn

  tags = local.common_tags
}

# CloudWatch Module
module "cloudwatch" {
  source = "./modules/cloudwatch"

  project_name = local.project_name
  environment  = local.environment

  # SNS topic for alarms
  alarm_topic_arn = module.sns.alarm_topic_arn

  # Resources to monitor
  rds_instance_id = module.rds.db_instance_id
  ecs_cluster_name = module.ecs.cluster_name
  ecs_service_name = module.ecs.service_name

  tags = local.common_tags
}
