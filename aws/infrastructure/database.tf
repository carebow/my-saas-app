# CareBow Database Infrastructure

# Random password for database
resource "random_password" "db_password" {
  length           = 32
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

# RDS Subnet Group
resource "aws_db_subnet_group" "main" {
  name       = "${var.project_name}-db-subnet-group"
  subnet_ids = aws_subnet.private[*].id

  tags = {
    Name        = "${var.project_name}-db-subnet-group"
    Environment = var.environment
  }
}

# RDS Parameter Group
resource "aws_db_parameter_group" "main" {
  family = "postgres15"
  name   = "${var.project_name}-db-params"

  parameter {
    name  = "log_statement"
    value = "all"
  }

  parameter {
    name  = "log_min_duration_statement"
    value = "1000"
  }

  parameter {
    name  = "shared_preload_libraries"
    value = "pg_stat_statements"
  }

  tags = {
    Name        = "${var.project_name}-db-params"
    Environment = var.environment
  }
}

# RDS Instance
resource "aws_db_instance" "main" {
  identifier = "${var.project_name}-db"

  # Engine
  engine         = "postgres"
  engine_version = "15.8"
  instance_class = "db.t3.micro"

  # Storage
  allocated_storage     = 20
  max_allocated_storage = 100
  storage_type          = "gp2"
  storage_encrypted     = true

  # Database
  db_name  = "carebow"
  username = "carebow_admin"
  password = random_password.db_password.result

  # Network
  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]
  port                   = 5432
  publicly_accessible    = false

  # Backup
  backup_retention_period = 7
  backup_window           = "03:00-04:00"
  maintenance_window      = "sun:04:00-sun:05:00"

  # Monitoring
  monitoring_interval = 60
  monitoring_role_arn = aws_iam_role.rds_monitoring.arn

  # Parameters
  parameter_group_name = aws_db_parameter_group.main.name

  # Deletion protection
  deletion_protection = false
  skip_final_snapshot = true

  tags = {
    Name        = "${var.project_name}-db"
    Environment = var.environment
  }
}

# Store database password in AWS Secrets Manager
resource "aws_secretsmanager_secret" "db_password" {
  name = "${var.project_name}-db-password"

  tags = {
    Name        = "${var.project_name}-db-password"
    Environment = var.environment
  }
}

resource "aws_secretsmanager_secret_version" "db_password" {
  secret_id = aws_secretsmanager_secret.db_password.id

  secret_string = jsonencode({
    username     = aws_db_instance.main.username
    password     = random_password.db_password.result
    engine       = "postgres"
    host         = aws_db_instance.main.endpoint
    port         = aws_db_instance.main.port
    dbname       = aws_db_instance.main.db_name
    database_url = "postgresql://${aws_db_instance.main.username}:${random_password.db_password.result}@${aws_db_instance.main.endpoint}/${aws_db_instance.main.db_name}"
  })
}

# IAM Role for RDS Monitoring
resource "aws_iam_role" "rds_monitoring" {
  name = "${var.project_name}-rds-monitoring-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "monitoring.rds.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name        = "${var.project_name}-rds-monitoring-role"
    Environment = var.environment
  }
}

resource "aws_iam_role_policy_attachment" "rds_monitoring" {
  role       = aws_iam_role.rds_monitoring.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonRDSEnhancedMonitoringRole"
}

# ElastiCache Subnet Group
resource "aws_elasticache_subnet_group" "main" {
  name       = "${var.project_name}-cache-subnet-group"
  subnet_ids = aws_subnet.private[*].id

  tags = {
    Name        = "${var.project_name}-cache-subnet-group"
    Environment = var.environment
  }
}

# ElastiCache Security Group
resource "aws_security_group" "elasticache" {
  name_prefix = "${var.project_name}-cache-"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port       = 6379
    to_port         = 6379
    protocol        = "tcp"
    security_groups = [aws_security_group.ecs.id]
  }

  tags = {
    Name        = "${var.project_name}-cache-sg"
    Environment = var.environment
  }
}

# ElastiCache Redis Cluster
resource "aws_elasticache_replication_group" "main" {
  replication_group_id = "${var.project_name}-redis"
  description          = "Redis cluster for CareBow"

  node_type            = "cache.t3.micro"
  port                 = 6379
  parameter_group_name = "default.redis7"

  num_cache_clusters         = 2
  multi_az_enabled           = true
  automatic_failover_enabled = true

  subnet_group_name  = aws_elasticache_subnet_group.main.name
  security_group_ids = [aws_security_group.elasticache.id]

  at_rest_encryption_enabled = true
  transit_encryption_enabled = true

  tags = {
    Name        = "${var.project_name}-redis"
    Environment = var.environment
  }
}

# Staging Database Resources
# Random password for staging database
resource "random_password" "staging_db_password" {
  count            = var.staging_enabled ? 1 : 0
  length           = 32
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

# Staging RDS Instance
resource "aws_db_instance" "staging" {
  count      = var.staging_enabled ? 1 : 0
  identifier = "${var.project_name}-staging-db"

  # Engine
  engine         = "postgres"
  engine_version = "15.8"
  instance_class = "db.t3.micro"

  # Storage
  allocated_storage     = 20
  max_allocated_storage = 50
  storage_type          = "gp2"
  storage_encrypted     = true

  # Database
  db_name  = "carebow_staging"
  username = "carebow_staging_admin"
  password = random_password.staging_db_password[0].result

  # Network
  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]
  port                   = 5432
  publicly_accessible    = false

  # Backup (reduced for staging)
  backup_retention_period = 3
  backup_window           = "03:00-04:00"
  maintenance_window      = "sun:04:00-sun:05:00"

  # Parameters
  parameter_group_name = aws_db_parameter_group.main.name

  # Deletion protection
  deletion_protection = false
  skip_final_snapshot = true

  tags = {
    Name        = "${var.project_name}-staging-db"
    Environment = "staging"
  }
}

# Store staging database password in AWS Secrets Manager
resource "aws_secretsmanager_secret" "staging_db_password" {
  count = var.staging_enabled ? 1 : 0
  name  = "${var.project_name}-staging-db-password"

  tags = {
    Name        = "${var.project_name}-staging-db-password"
    Environment = "staging"
  }
}

resource "aws_secretsmanager_secret_version" "staging_db_password" {
  count     = var.staging_enabled ? 1 : 0
  secret_id = aws_secretsmanager_secret.staging_db_password[0].id

  secret_string = jsonencode({
    username     = aws_db_instance.staging[0].username
    password     = random_password.staging_db_password[0].result
    engine       = "postgres"
    host         = aws_db_instance.staging[0].endpoint
    port         = aws_db_instance.staging[0].port
    dbname       = aws_db_instance.staging[0].db_name
    database_url = "postgresql://${aws_db_instance.staging[0].username}:${random_password.staging_db_password[0].result}@${aws_db_instance.staging[0].endpoint}/${aws_db_instance.staging[0].db_name}"
  })
}

# Staging ElastiCache Redis Cluster (single node for cost savings)
resource "aws_elasticache_replication_group" "staging" {
  count                = var.staging_enabled ? 1 : 0
  replication_group_id = "${var.project_name}-staging-redis"
  description          = "Redis cluster for CareBow Staging"

  node_type            = "cache.t3.micro"
  port                 = 6379
  parameter_group_name = "default.redis7"

  num_cache_clusters = 1
  multi_az_enabled   = false

  subnet_group_name  = aws_elasticache_subnet_group.main.name
  security_group_ids = [aws_security_group.elasticache.id]

  at_rest_encryption_enabled = true
  transit_encryption_enabled = true

  tags = {
    Name        = "${var.project_name}-staging-redis"
    Environment = "staging"
  }
}

# Outputs
output "database_endpoint" {
  value = aws_db_instance.main.endpoint
}

output "database_port" {
  value = aws_db_instance.main.port
}

output "redis_endpoint" {
  value = aws_elasticache_replication_group.main.primary_endpoint_address
}

output "staging_database_endpoint" {
  value = var.staging_enabled ? aws_db_instance.staging[0].endpoint : null
}

output "staging_redis_endpoint" {
  value = var.staging_enabled ? aws_elasticache_replication_group.staging[0].primary_endpoint_address : null
}