# RDS Module Variables

variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID where RDS will be created"
  type        = string
}

variable "database_subnet_ids" {
  description = "List of database subnet IDs"
  type        = list(string)
}

variable "allowed_cidr_blocks" {
  description = "List of CIDR blocks allowed to access RDS"
  type        = list(string)
  default     = []
}

variable "allowed_security_group_ids" {
  description = "List of security group IDs allowed to access RDS"
  type        = list(string)
  default     = []
}

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

variable "multi_az" {
  description = "Enable Multi-AZ deployment"
  type        = bool
  default     = false
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

variable "monitoring_role_arn" {
  description = "ARN of the monitoring role"
  type        = string
  default     = null
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

variable "log_retention_days" {
  description = "CloudWatch log retention in days"
  type        = number
  default     = 30
}

variable "alarm_actions" {
  description = "List of ARNs to notify when alarms trigger"
  type        = list(string)
  default     = []
}

# Performance tuning variables
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

variable "maintenance_work_mem" {
  description = "Maintenance work memory"
  type        = string
  default     = "64MB"
}

variable "wal_buffers" {
  description = "WAL buffers"
  type        = string
  default     = "16MB"
}

variable "work_mem" {
  description = "Work memory"
  type        = string
  default     = "4MB"
}

# Read replica variables
variable "create_read_replica" {
  description = "Create a read replica"
  type        = bool
  default     = false
}

variable "read_replica_instance_class" {
  description = "Read replica instance class"
  type        = string
  default     = "db.t3.micro"
}

variable "tags" {
  description = "Additional tags to apply to resources"
  type        = map(string)
  default     = {}
}
