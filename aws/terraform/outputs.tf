# CareBow AWS-Native Architecture - Outputs

# VPC Outputs
output "vpc_id" {
  description = "ID of the VPC"
  value       = module.vpc.vpc_id
}

output "vpc_cidr_block" {
  description = "CIDR block of the VPC"
  value       = module.vpc.vpc_cidr_block
}

output "public_subnet_ids" {
  description = "IDs of the public subnets"
  value       = module.vpc.public_subnet_ids
}

output "private_subnet_ids" {
  description = "IDs of the private subnets"
  value       = module.vpc.private_subnet_ids
}

output "database_subnet_ids" {
  description = "IDs of the database subnets"
  value       = module.vpc.database_subnet_ids
}

# Cognito Outputs
output "cognito_user_pool_id" {
  description = "ID of the Cognito User Pool"
  value       = module.cognito.user_pool_id
}

output "cognito_user_pool_arn" {
  description = "ARN of the Cognito User Pool"
  value       = module.cognito.user_pool_arn
}

output "cognito_user_pool_domain" {
  description = "Domain of the Cognito User Pool"
  value       = module.cognito.user_pool_domain
}

output "cognito_web_client_id" {
  description = "ID of the web client"
  value       = module.cognito.web_client_id
}

output "cognito_api_client_id" {
  description = "ID of the API client"
  value       = module.cognito.api_client_id
}

output "cognito_mobile_client_id" {
  description = "ID of the mobile client"
  value       = module.cognito.mobile_client_id
}

output "cognito_identity_pool_id" {
  description = "ID of the Cognito Identity Pool"
  value       = module.cognito.identity_pool_id
}

output "cognito_config" {
  description = "Cognito configuration for frontend"
  value       = module.cognito.cognito_config
}

# RDS Outputs
output "rds_endpoint" {
  description = "Endpoint of the RDS instance"
  value       = module.rds.db_instance_endpoint
}

output "rds_port" {
  description = "Port of the RDS instance"
  value       = module.rds.db_instance_port
}

output "rds_database_name" {
  description = "Name of the RDS database"
  value       = module.rds.db_instance_name
}

output "rds_username" {
  description = "Username of the RDS instance"
  value       = module.rds.db_instance_username
}

output "rds_connection_info" {
  description = "Database connection information"
  value       = module.rds.connection_info
  sensitive   = true
}

output "rds_read_replica_endpoint" {
  description = "Endpoint of the read replica (if created)"
  value       = module.rds.read_replica_endpoint
}

# S3 Outputs
output "chat_data_bucket_name" {
  description = "Name of the chat data S3 bucket"
  value       = module.s3.chat_data_bucket_name
}

output "exports_bucket_name" {
  description = "Name of the exports S3 bucket"
  value       = module.s3.exports_bucket_name
}

output "static_website_bucket_name" {
  description = "Name of the static website S3 bucket"
  value       = module.s3.static_website_bucket_name
}

output "static_website_url" {
  description = "URL of the static website"
  value       = module.s3.static_website_url
}

# OpenSearch Outputs
output "opensearch_domain_endpoint" {
  description = "Endpoint of the OpenSearch domain"
  value       = module.opensearch.domain_endpoint
}

output "opensearch_dashboard_url" {
  description = "URL of the OpenSearch dashboard"
  value       = module.opensearch.dashboard_url
}

# ECS Outputs
output "ecs_cluster_name" {
  description = "Name of the ECS cluster"
  value       = module.ecs.cluster_name
}

output "ecs_cluster_arn" {
  description = "ARN of the ECS cluster"
  value       = module.ecs.cluster_arn
}

output "ecs_service_name" {
  description = "Name of the ECS service"
  value       = module.ecs.service_name
}

output "ecs_service_arn" {
  description = "ARN of the ECS service"
  value       = module.ecs.service_arn
}

output "ecs_task_definition_arn" {
  description = "ARN of the ECS task definition"
  value       = module.ecs.task_definition_arn
}

# Lambda Outputs
output "data_export_function_arn" {
  description = "ARN of the data export Lambda function"
  value       = module.lambda.data_export_function_arn
}

output "data_deletion_function_arn" {
  description = "ARN of the data deletion Lambda function"
  value       = module.lambda.data_deletion_function_arn
}

output "notification_function_arn" {
  description = "ARN of the notification Lambda function"
  value       = module.lambda.notification_function_arn
}

# SNS Outputs
output "notification_topic_arn" {
  description = "ARN of the notification SNS topic"
  value       = module.sns.notification_topic_arn
}

output "alarm_topic_arn" {
  description = "ARN of the alarm SNS topic"
  value       = module.sns.alarm_topic_arn
}

# SQS Outputs
output "export_queue_arn" {
  description = "ARN of the export SQS queue"
  value       = module.sqs.export_queue_arn
}

output "deletion_queue_arn" {
  description = "ARN of the deletion SQS queue"
  value       = module.sqs.deletion_queue_arn
}

# Step Functions Outputs
output "data_export_state_machine_arn" {
  description = "ARN of the data export state machine"
  value       = module.step_functions.data_export_state_machine_arn
}

output "data_deletion_state_machine_arn" {
  description = "ARN of the data deletion state machine"
  value       = module.step_functions.data_deletion_state_machine_arn
}

# CloudFront Outputs
output "cloudfront_distribution_id" {
  description = "ID of the CloudFront distribution"
  value       = module.cloudfront.distribution_id
}

output "cloudfront_domain_name" {
  description = "Domain name of the CloudFront distribution"
  value       = module.cloudfront.domain_name
}

output "cloudfront_url" {
  description = "URL of the CloudFront distribution"
  value       = module.cloudfront.url
}

# API Gateway Outputs
output "api_gateway_rest_api_id" {
  description = "ID of the API Gateway REST API"
  value       = module.api_gateway.rest_api_id
}

output "api_gateway_stage_name" {
  description = "Name of the API Gateway stage"
  value       = module.api_gateway.stage_name
}

output "api_gateway_invoke_url" {
  description = "Invoke URL of the API Gateway"
  value       = module.api_gateway.invoke_url
}

# WAF Outputs
output "waf_web_acl_arn" {
  description = "ARN of the WAF Web ACL"
  value       = module.waf.web_acl_arn
}

output "waf_web_acl_id" {
  description = "ID of the WAF Web ACL"
  value       = module.waf.web_acl_id
}

# KMS Outputs
output "kms_key_arn" {
  description = "ARN of the KMS key"
  value       = module.kms.kms_key_arn
}

output "kms_key_id" {
  description = "ID of the KMS key"
  value       = module.kms.kms_key_id
}

# CloudWatch Outputs
output "cloudwatch_log_groups" {
  description = "CloudWatch log groups"
  value       = module.cloudwatch.log_groups
}

output "cloudwatch_alarms" {
  description = "CloudWatch alarms"
  value       = module.cloudwatch.alarms
}

# Application URLs
output "application_url" {
  description = "URL of the CareBow application"
  value       = module.cloudfront.url
}

output "api_url" {
  description = "URL of the CareBow API"
  value       = module.api_gateway.invoke_url
}

# Frontend Configuration
output "frontend_config" {
  description = "Frontend configuration"
  value = {
    cognito = module.cognito.cognito_config
    api_url = module.api_gateway.invoke_url
    app_url = module.cloudfront.url
  }
}

# Backend Configuration
output "backend_config" {
  description = "Backend configuration"
  value = {
    database = module.rds.connection_info
    opensearch = module.opensearch.domain_endpoint
    s3_buckets = {
      chat_data = module.s3.chat_data_bucket_name
      exports   = module.s3.exports_bucket_name
    }
    cognito = {
      user_pool_id = module.cognito.user_pool_id
      client_id    = module.cognito.api_client_id
    }
  }
  sensitive = true
}
