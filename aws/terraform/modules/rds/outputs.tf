# RDS Module Outputs

output "db_instance_id" {
  description = "ID of the RDS instance"
  value       = aws_db_instance.main.id
}

output "db_instance_arn" {
  description = "ARN of the RDS instance"
  value       = aws_db_instance.main.arn
}

output "db_instance_endpoint" {
  description = "Endpoint of the RDS instance"
  value       = aws_db_instance.main.endpoint
}

output "db_instance_port" {
  description = "Port of the RDS instance"
  value       = aws_db_instance.main.port
}

output "db_instance_name" {
  description = "Name of the RDS instance"
  value       = aws_db_instance.main.db_name
}

output "db_instance_username" {
  description = "Username of the RDS instance"
  value       = aws_db_instance.main.username
}

output "db_instance_password" {
  description = "Password of the RDS instance"
  value       = random_password.master_password.result
  sensitive   = true
}

output "db_security_group_id" {
  description = "ID of the RDS security group"
  value       = aws_security_group.rds.id
}

output "db_subnet_group_name" {
  description = "Name of the DB subnet group"
  value       = aws_db_subnet_group.main.name
}

output "kms_key_id" {
  description = "ID of the KMS key used for encryption"
  value       = aws_kms_key.rds.key_id
}

output "kms_key_arn" {
  description = "ARN of the KMS key used for encryption"
  value       = aws_kms_key.rds.arn
}

output "secrets_manager_secret_arn" {
  description = "ARN of the Secrets Manager secret"
  value       = aws_secretsmanager_secret.rds_credentials.arn
}

output "read_replica_endpoint" {
  description = "Endpoint of the read replica (if created)"
  value       = var.create_read_replica ? aws_db_instance.read_replica[0].endpoint : null
}

output "read_replica_id" {
  description = "ID of the read replica (if created)"
  value       = var.create_read_replica ? aws_db_instance.read_replica[0].id : null
}

output "connection_info" {
  description = "Database connection information"
  value = {
    host     = aws_db_instance.main.endpoint
    port     = aws_db_instance.main.port
    database = aws_db_instance.main.db_name
    username = aws_db_instance.main.username
    ssl_mode = "require"
  }
  sensitive = true
}
