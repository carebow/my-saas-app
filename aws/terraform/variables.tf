# CareBow AWS-Native Architecture - Variables

# Environment
variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "dev"
}

# VPC Configuration
variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for private subnets"
  type        = list(string)
  default     = ["10.0.10.0/24", "10.0.20.0/24"]
}

variable "database_subnet_cidrs" {
  description = "CIDR blocks for database subnets"
  type        = list(string)
  default     = ["10.0.100.0/24", "10.0.200.0/24"]
}

# Cognito Configuration
variable "callback_urls" {
  description = "List of callback URLs for OAuth"
  type        = list(string)
  default     = ["http://localhost:3000", "https://localhost:3000"]
}

variable "logout_urls" {
  description = "List of logout URLs for OAuth"
  type        = list(string)
  default     = ["http://localhost:3000", "https://localhost:3000"]
}

# Lambda Triggers (optional)
variable "pre_sign_up_lambda_arn" {
  description = "ARN of the pre-sign-up Lambda function"
  type        = string
  default     = null
}

variable "post_confirmation_lambda_arn" {
  description = "ARN of the post-confirmation Lambda function"
  type        = string
  default     = null
}

variable "pre_authentication_lambda_arn" {
  description = "ARN of the pre-authentication Lambda function"
  type        = string
  default     = null
}

variable "post_authentication_lambda_arn" {
  description = "ARN of the post-authentication Lambda function"
  type        = string
  default     = null
}

# RDS Configuration
variable "database_name" {
  description = "Name of the database to create"
  type        = string
  default     = "carebow"
}

variable "master_username" {
  description = "Master username for the database"
  type        = string
  default     = "postgres"
}

variable "engine_version" {
  description = "PostgreSQL engine version"
  type        = string
  default     = "15.4"
}

variable "instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.micro"
}

variable "allocated_storage" {
  description = "Initial allocated storage in GB"
  type        = number
  default     = 20
}

variable "max_allocated_storage" {
  description = "Maximum allocated storage in GB"
  type        = number
  default     = 100
}

variable "multi_az" {
  description = "Enable Multi-AZ deployment"
  type        = bool
  default     = false
}

variable "create_read_replica" {
  description = "Create a read replica"
  type        = bool
  default     = false
}

variable "backup_retention_period" {
  description = "Number of days to retain backups"
  type        = number
  default     = 7
}

variable "backup_window" {
  description = "Backup window"
  type        = string
  default     = "03:00-04:00"
}

variable "maintenance_window" {
  description = "Maintenance window"
  type        = string
  default     = "sun:04:00-sun:05:00"
}

variable "deletion_protection" {
  description = "Enable deletion protection"
  type        = bool
  default     = true
}

variable "skip_final_snapshot" {
  description = "Skip final snapshot when deleting"
  type        = bool
  default     = false
}

variable "monitoring_interval" {
  description = "Enhanced monitoring interval in seconds"
  type        = number
  default     = 0
}

variable "performance_insights_enabled" {
  description = "Enable Performance Insights"
  type        = bool
  default     = true
}

variable "performance_insights_retention_period" {
  description = "Performance Insights retention period in days"
  type        = number
  default     = 7
}

# Performance Tuning
variable "max_connections" {
  description = "Maximum number of connections"
  type        = string
  default     = "100"
}

variable "shared_buffers" {
  description = "Shared buffers setting"
  type        = string
  default     = "256MB"
}

variable "effective_cache_size" {
  description = "Effective cache size"
  type        = string
  default     = "1GB"
}

variable "work_mem" {
  description = "Work memory"
  type        = string
  default     = "4MB"
}

# S3 Configuration
variable "chat_data_bucket_name" {
  description = "Name of the chat data S3 bucket"
  type        = string
  default     = ""
}

variable "exports_bucket_name" {
  description = "Name of the exports S3 bucket"
  type        = string
  default     = ""
}

variable "static_website_bucket_name" {
  description = "Name of the static website S3 bucket"
  type        = string
  default     = ""
}

variable "enable_s3_versioning" {
  description = "Enable S3 versioning"
  type        = bool
  default     = true
}

variable "enable_s3_lifecycle" {
  description = "Enable S3 lifecycle policies"
  type        = bool
  default     = true
}

variable "enable_s3_access_logging" {
  description = "Enable S3 access logging"
  type        = bool
  default     = true
}

variable "access_logging_bucket" {
  description = "S3 bucket for access logs"
  type        = string
  default     = ""
}

# OpenSearch Configuration
variable "opensearch_instance_type" {
  description = "OpenSearch instance type"
  type        = string
  default     = "t3.small.search"
}

variable "opensearch_instance_count" {
  description = "Number of OpenSearch instances"
  type        = number
  default     = 1
}

variable "opensearch_volume_size" {
  description = "OpenSearch volume size in GB"
  type        = number
  default     = 10
}

# ECS Configuration
variable "app_port" {
  description = "Port exposed by the application"
  type        = number
  default     = 8000
}

variable "ecs_cpu" {
  description = "CPU units for ECS task"
  type        = number
  default     = 256
}

variable "ecs_memory" {
  description = "Memory for ECS task"
  type        = number
  default     = 512
}

variable "ecs_min_capacity" {
  description = "Minimum ECS service capacity"
  type        = number
  default     = 1
}

variable "ecs_max_capacity" {
  description = "Maximum ECS service capacity"
  type        = number
  default     = 10
}

# SQS Configuration
variable "enable_sqs_dlq" {
  description = "Enable dead letter queues for SQS"
  type        = bool
  default     = true
}

variable "sqs_max_receive_count" {
  description = "Maximum receive count before moving to DLQ"
  type        = number
  default     = 3
}

# Step Functions Configuration
variable "grace_period_seconds" {
  description = "Grace period in seconds before deletion"
  type        = number
  default     = 604800 # 7 days
}

# SSL Certificate
variable "certificate_arn" {
  description = "ARN of the SSL certificate for CloudFront"
  type        = string
  default     = ""
}

# Email Configuration
variable "admin_email" {
  description = "Admin email address for notifications"
  type        = string
  default     = ""
}

variable "support_email" {
  description = "Support email address for notifications"
  type        = string
  default     = ""
}

# Tags
variable "tags" {
  description = "Additional tags to apply to resources"
  type        = map(string)
  default     = {}
}
