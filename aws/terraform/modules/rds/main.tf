# RDS Module for CareBow AWS-Native Architecture
# Creates HIPAA-compliant PostgreSQL with pgvector for embeddings

terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# Random password for master user
resource "random_password" "master_password" {
  length  = 32
  special = true
}

# Store master password in Secrets Manager
resource "aws_secretsmanager_secret" "rds_credentials" {
  name                    = "${var.project_name}/rds/credentials"
  description             = "RDS master credentials for CareBow"
  recovery_window_in_days = 30

  tags = {
    Name        = "${var.project_name}-rds-credentials-${var.environment}"
    Environment = var.environment
    Purpose     = "Database credentials"
    HIPAA       = "true"
  }
}

resource "aws_secretsmanager_secret_version" "rds_credentials" {
  secret_id = aws_secretsmanager_secret.rds_credentials.id
  secret_string = jsonencode({
    username = var.master_username
    password = random_password.master_password.result
  })
}

# DB Subnet Group
resource "aws_db_subnet_group" "main" {
  name       = "${var.project_name}-db-subnet-group-${var.environment}"
  subnet_ids = var.database_subnet_ids

  tags = {
    Name        = "${var.project_name}-db-subnet-group-${var.environment}"
    Environment = var.environment
    Purpose     = "Database subnet group"
  }
}

# Security Group for RDS
resource "aws_security_group" "rds" {
  name        = "${var.project_name}-rds-sg-${var.environment}"
  description = "Security group for RDS PostgreSQL"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = var.allowed_cidr_blocks
    description = "PostgreSQL access from allowed CIDR blocks"
  }

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = var.allowed_security_group_ids
    description     = "PostgreSQL access from allowed security groups"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "${var.project_name}-rds-sg-${var.environment}"
    Environment = var.environment
    Purpose     = "Database security"
  }
}

# KMS Key for RDS encryption
resource "aws_kms_key" "rds" {
  description             = "KMS key for RDS encryption"
  deletion_window_in_days = 30
  enable_key_rotation     = true

  tags = {
    Name        = "${var.project_name}-rds-kms-${var.environment}"
    Environment = var.environment
    Purpose     = "RDS encryption"
    HIPAA       = "true"
  }
}

resource "aws_kms_alias" "rds" {
  name          = "alias/${var.project_name}-rds-${var.environment}"
  target_key_id = aws_kms_key.rds.key_id
}

# Parameter Group for pgvector
resource "aws_db_parameter_group" "main" {
  family = "postgres15"
  name   = "${var.project_name}-db-params-${var.environment}"

  # Enable pgvector extension
  parameter {
    name  = "shared_preload_libraries"
    value = "vector"
  }

  # Performance tuning
  parameter {
    name  = "max_connections"
    value = var.max_connections
  }

  parameter {
    name  = "shared_buffers"
    value = var.shared_buffers
  }

  parameter {
    name  = "effective_cache_size"
    value = var.effective_cache_size
  }

  parameter {
    name  = "maintenance_work_mem"
    value = var.maintenance_work_mem
  }

  parameter {
    name  = "checkpoint_completion_target"
    value = "0.9"
  }

  parameter {
    name  = "wal_buffers"
    value = var.wal_buffers
  }

  parameter {
    name  = "default_statistics_target"
    value = "100"
  }

  parameter {
    name  = "random_page_cost"
    value = "1.1"
  }

  parameter {
    name  = "effective_io_concurrency"
    value = "200"
  }

  parameter {
    name  = "work_mem"
    value = var.work_mem
  }

  parameter {
    name  = "min_wal_size"
    value = "1GB"
  }

  parameter {
    name  = "max_wal_size"
    value = "4GB"
  }

  tags = {
    Name        = "${var.project_name}-db-params-${var.environment}"
    Environment = var.environment
    Purpose     = "Database parameters"
  }
}

# Option Group for PostgreSQL extensions
resource "aws_db_option_group" "main" {
  name                     = "${var.project_name}-db-options-${var.environment}"
  option_group_description = "Option group for CareBow PostgreSQL"
  engine_name              = "postgres"
  major_engine_version     = "15"

  tags = {
    Name        = "${var.project_name}-db-options-${var.environment}"
    Environment = var.environment
    Purpose     = "Database options"
  }
}

# RDS Instance
resource "aws_db_instance" "main" {
  identifier = "${var.project_name}-postgres-${var.environment}"

  # Engine configuration
  engine         = "postgres"
  engine_version = var.engine_version
  instance_class = var.instance_class

  # Storage configuration
  allocated_storage     = var.allocated_storage
  max_allocated_storage = var.max_allocated_storage
  storage_type          = "gp3"
  storage_encrypted     = true
  kms_key_id           = aws_kms_key.rds.arn

  # Database configuration
  db_name  = var.database_name
  username = var.master_username
  password = random_password.master_password.result

  # Network configuration
  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]
  publicly_accessible    = false

  # Parameter and option groups
  parameter_group_name = aws_db_parameter_group.main.name
  option_group_name    = aws_db_option_group.main.name

  # Backup configuration
  backup_retention_period = var.backup_retention_period
  backup_window          = var.backup_window
  maintenance_window     = var.maintenance_window
  delete_automated_backups = false

  # Monitoring
  monitoring_interval = var.monitoring_interval
  monitoring_role_arn = var.monitoring_role_arn

  # Performance Insights
  performance_insights_enabled = var.performance_insights_enabled
  performance_insights_retention_period = var.performance_insights_retention_period

  # Multi-AZ for high availability
  multi_az = var.multi_az

  # Deletion protection
  deletion_protection = var.deletion_protection
  skip_final_snapshot = var.skip_final_snapshot
  final_snapshot_identifier = var.skip_final_snapshot ? null : "${var.project_name}-final-snapshot-${var.environment}-${formatdate("YYYY-MM-DD-hhmm", timestamp())}"

  # Logging
  enabled_cloudwatch_logs_exports = ["postgresql", "upgrade"]

  tags = {
    Name        = "${var.project_name}-postgres-${var.environment}"
    Environment = var.environment
    Purpose     = "Primary database"
    HIPAA       = "true"
  }

  depends_on = [
    aws_secretsmanager_secret_version.rds_credentials
  ]
}

# Read Replica (optional)
resource "aws_db_instance" "read_replica" {
  count = var.create_read_replica ? 1 : 0

  identifier = "${var.project_name}-postgres-read-${var.environment}"

  # Replica configuration
  replicate_source_db = aws_db_instance.main.identifier
  instance_class      = var.read_replica_instance_class

  # Storage configuration
  storage_encrypted = true
  kms_key_id       = aws_kms_key.rds.arn

  # Network configuration
  vpc_security_group_ids = [aws_security_group.rds.id]
  publicly_accessible    = false

  # Monitoring
  monitoring_interval = var.monitoring_interval
  monitoring_role_arn = var.monitoring_role_arn

  # Performance Insights
  performance_insights_enabled = var.performance_insights_enabled
  performance_insights_retention_period = var.performance_insights_retention_period

  # Deletion protection
  deletion_protection = var.deletion_protection
  skip_final_snapshot = true

  tags = {
    Name        = "${var.project_name}-postgres-read-${var.environment}"
    Environment = var.environment
    Purpose     = "Read replica"
    HIPAA       = "true"
  }
}

# CloudWatch Log Group for RDS logs
resource "aws_cloudwatch_log_group" "postgresql" {
  name              = "/aws/rds/instance/${aws_db_instance.main.identifier}/postgresql"
  retention_in_days = var.log_retention_days

  tags = {
    Name        = "${var.project_name}-rds-logs-${var.environment}"
    Environment = var.environment
    Purpose     = "Database logs"
  }
}

# CloudWatch Alarms
resource "aws_cloudwatch_metric_alarm" "cpu_high" {
  alarm_name          = "${var.project_name}-rds-cpu-high-${var.environment}"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/RDS"
  period              = "300"
  statistic           = "Average"
  threshold           = "80"
  alarm_description   = "This metric monitors RDS CPU utilization"
  alarm_actions       = var.alarm_actions

  dimensions = {
    DBInstanceIdentifier = aws_db_instance.main.id
  }

  tags = {
    Name        = "${var.project_name}-rds-cpu-high-${var.environment}"
    Environment = var.environment
  }
}

resource "aws_cloudwatch_metric_alarm" "free_storage_low" {
  alarm_name          = "${var.project_name}-rds-storage-low-${var.environment}"
  comparison_operator = "LessThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "FreeStorageSpace"
  namespace           = "AWS/RDS"
  period              = "300"
  statistic           = "Average"
  threshold           = "2000000000" # 2GB in bytes
  alarm_description   = "This metric monitors RDS free storage space"
  alarm_actions       = var.alarm_actions

  dimensions = {
    DBInstanceIdentifier = aws_db_instance.main.id
  }

  tags = {
    Name        = "${var.project_name}-rds-storage-low-${var.environment}"
    Environment = var.environment
  }
}

resource "aws_cloudwatch_metric_alarm" "connections_high" {
  alarm_name          = "${var.project_name}-rds-connections-high-${var.environment}"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "DatabaseConnections"
  namespace           = "AWS/RDS"
  period              = "300"
  statistic           = "Average"
  threshold           = "80"
  alarm_description   = "This metric monitors RDS database connections"
  alarm_actions       = var.alarm_actions

  dimensions = {
    DBInstanceIdentifier = aws_db_instance.main.id
  }

  tags = {
    Name        = "${var.project_name}-rds-connections-high-${var.environment}"
    Environment = var.environment
  }
}
