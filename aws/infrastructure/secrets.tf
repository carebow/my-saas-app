# Application Secrets
resource "aws_secretsmanager_secret" "app_secrets" {
  name = "${var.project_name}-app-secrets"

  tags = {
    Name        = "${var.project_name}-app-secrets"
    Environment = var.environment
  }
}

# Generate random secret key
resource "random_password" "secret_key" {
  length  = 64
  special = true
}

# Store application secrets
resource "aws_secretsmanager_secret_version" "app_secrets" {
  secret_id = aws_secretsmanager_secret.app_secrets.id
  secret_string = jsonencode({
    secret_key             = random_password.secret_key.result
    redis_url              = "redis://${aws_elasticache_replication_group.main.primary_endpoint_address}:6379"
    database_url           = "postgresql://${aws_db_instance.main.username}:${random_password.db_password.result}@${aws_db_instance.main.endpoint}/${aws_db_instance.main.db_name}"
    openai_api_key         = var.openai_api_key
    stripe_secret_key      = var.stripe_secret_key
    stripe_publishable_key = var.stripe_publishable_key
    stripe_webhook_secret  = var.stripe_webhook_secret
    smtp_host              = var.smtp_host
    smtp_port              = var.smtp_port
    smtp_user              = var.smtp_user
    smtp_password          = var.smtp_password
    emails_from_email      = var.emails_from_email
  })
}

# Variables for secrets (to be provided via terraform.tfvars or environment)
variable "openai_api_key" {
  description = "OpenAI API Key"
  type        = string
  sensitive   = true
  default     = ""
}

variable "stripe_secret_key" {
  description = "Stripe Secret Key"
  type        = string
  sensitive   = true
  default     = ""
}

variable "stripe_publishable_key" {
  description = "Stripe Publishable Key"
  type        = string
  sensitive   = true
  default     = ""
}

variable "stripe_webhook_secret" {
  description = "Stripe Webhook Secret"
  type        = string
  sensitive   = true
  default     = ""
}

variable "smtp_host" {
  description = "SMTP Host"
  type        = string
  default     = "smtp.gmail.com"
}

variable "smtp_port" {
  description = "SMTP Port"
  type        = string
  default     = "587"
}

variable "smtp_user" {
  description = "SMTP User"
  type        = string
  sensitive   = true
  default     = ""
}

variable "smtp_password" {
  description = "SMTP Password"
  type        = string
  sensitive   = true
  default     = ""
}

variable "emails_from_email" {
  description = "From Email Address"
  type        = string
  default     = "noreply@carebow.com"
}

# Staging Secrets
resource "aws_secretsmanager_secret" "staging_app_secrets" {
  count = var.staging_enabled ? 1 : 0
  name  = "${var.project_name}-staging-app-secrets"

  tags = {
    Name        = "${var.project_name}-staging-app-secrets"
    Environment = "staging"
  }
}

# Generate random secret key for staging
resource "random_password" "staging_secret_key" {
  count   = var.staging_enabled ? 1 : 0
  length  = 64
  special = true
}

# Store staging application secrets
resource "aws_secretsmanager_secret_version" "staging_app_secrets" {
  count     = var.staging_enabled ? 1 : 0
  secret_id = aws_secretsmanager_secret.staging_app_secrets[0].id
  secret_string = jsonencode({
    secret_key             = random_password.staging_secret_key[0].result
    redis_url              = "redis://${aws_elasticache_replication_group.staging[0].primary_endpoint_address}:6379"
    database_url           = "postgresql://${aws_db_instance.staging[0].username}:${random_password.staging_db_password[0].result}@${aws_db_instance.staging[0].endpoint}/${aws_db_instance.staging[0].db_name}"
    openai_api_key         = var.staging_openai_api_key != "" ? var.staging_openai_api_key : var.openai_api_key
    stripe_secret_key      = var.staging_stripe_secret_key != "" ? var.staging_stripe_secret_key : var.stripe_secret_key
    stripe_publishable_key = var.staging_stripe_publishable_key != "" ? var.staging_stripe_publishable_key : var.stripe_publishable_key
    stripe_webhook_secret  = var.staging_stripe_webhook_secret != "" ? var.staging_stripe_webhook_secret : var.stripe_webhook_secret
    smtp_host              = var.smtp_host
    smtp_port              = var.smtp_port
    smtp_user              = var.smtp_user
    smtp_password          = var.smtp_password
    emails_from_email      = var.emails_from_email
  })
}

# Staging-specific secret variables (optional - fallback to production values)
variable "staging_openai_api_key" {
  description = "OpenAI API Key for staging (optional - uses production key if not provided)"
  type        = string
  sensitive   = true
  default     = ""
}

variable "staging_stripe_secret_key" {
  description = "Stripe Secret Key for staging (optional - uses production key if not provided)"
  type        = string
  sensitive   = true
  default     = ""
}

variable "staging_stripe_publishable_key" {
  description = "Stripe Publishable Key for staging (optional - uses production key if not provided)"
  type        = string
  sensitive   = true
  default     = ""
}

variable "staging_stripe_webhook_secret" {
  description = "Stripe Webhook Secret for staging (optional - uses production key if not provided)"
  type        = string
  sensitive   = true
  default     = ""
}

# Outputs
output "app_secrets_arn" {
  value = aws_secretsmanager_secret.app_secrets.arn
}

output "staging_app_secrets_arn" {
  value = var.staging_enabled ? aws_secretsmanager_secret.staging_app_secrets[0].arn : null
}