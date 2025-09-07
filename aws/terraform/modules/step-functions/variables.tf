# Step Functions Module Variables

variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
}

variable "data_export_lambda_arn" {
  description = "ARN of the data export Lambda function"
  type        = string
}

variable "data_deletion_lambda_arn" {
  description = "ARN of the data deletion Lambda function"
  type        = string
}

variable "notification_lambda_arn" {
  description = "ARN of the notification Lambda function"
  type        = string
}

variable "export_queue_arn" {
  description = "ARN of the export SQS queue"
  type        = string
}

variable "deletion_queue_arn" {
  description = "ARN of the deletion SQS queue"
  type        = string
}

variable "notification_topic_arn" {
  description = "ARN of the notification SNS topic"
  type        = string
}

variable "grace_period_seconds" {
  description = "Grace period in seconds before deletion"
  type        = number
  default     = 604800 # 7 days
}

variable "log_retention_days" {
  description = "CloudWatch log retention in days"
  type        = number
  default     = 30
}

variable "tags" {
  description = "Additional tags to apply to resources"
  type        = map(string)
  default     = {}
}
