# Enhanced Chat Infrastructure for ChatGPT-like functionality
# This module sets up AWS infrastructure for the enhanced chat system with memory, personalization, and privacy controls

# S3 Buckets for chat data storage
resource "aws_s3_bucket" "chat_data" {
  bucket = "${var.project_name}-chat-data-${random_string.bucket_suffix.result}"
  
  tags = {
    Name        = "CareBow Chat Data"
    Environment = var.environment
    Purpose     = "Chat conversations, memories, and exports"
    HIPAA       = "true"
  }
}

resource "aws_s3_bucket" "voice_data" {
  bucket = "${var.project_name}-voice-data-${random_string.bucket_suffix.result}"
  
  tags = {
    Name        = "CareBow Voice Data"
    Environment = var.environment
    Purpose     = "Voice recordings and transcripts"
    HIPAA       = "true"
  }
}

resource "aws_s3_bucket" "data_exports" {
  bucket = "${var.project_name}-data-exports-${random_string.bucket_suffix.result}"
  
  tags = {
    Name        = "CareBow Data Exports"
    Environment = var.environment
    Purpose     = "User data exports and downloads"
    HIPAA       = "true"
  }
}

# S3 Bucket Versioning
resource "aws_s3_bucket_versioning" "chat_data_versioning" {
  bucket = aws_s3_bucket.chat_data.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_versioning" "voice_data_versioning" {
  bucket = aws_s3_bucket.voice_data.id
  versioning_configuration {
    status = "Enabled"
  }
}

# S3 Bucket Encryption
resource "aws_s3_bucket_server_side_encryption_configuration" "chat_data_encryption" {
  bucket = aws_s3_bucket.chat_data.id

  rule {
    apply_server_side_encryption_configuration {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "voice_data_encryption" {
  bucket = aws_s3_bucket.voice_data.id

  rule {
    apply_server_side_encryption_configuration {
      sse_algorithm = "AES256"
    }
  }
}

# S3 Bucket Lifecycle Configuration
resource "aws_s3_bucket_lifecycle_configuration" "chat_data_lifecycle" {
  bucket = aws_s3_bucket.chat_data.id

  rule {
    id     = "chat_data_lifecycle"
    status = "Enabled"

    # Transition to IA after 30 days
    transition {
      days          = 30
      storage_class = "STANDARD_IA"
    }

    # Transition to Glacier after 90 days
    transition {
      days          = 90
      storage_class = "GLACIER"
    }

    # Delete old versions after 1 year
    noncurrent_version_transition {
      noncurrent_days = 365
      storage_class   = "GLACIER"
    }

    noncurrent_version_expiration {
      noncurrent_days = 730
    }
  }
}

# OpenSearch Domain for vector search and memory
resource "aws_opensearch_domain" "chat_memory" {
  domain_name    = "${var.project_name}-chat-memory-${var.environment}"
  engine_version = "OpenSearch_2.3"

  cluster_config {
    instance_type            = "t3.small.search"
    instance_count           = 1
    dedicated_master_enabled = false
    zone_awareness_enabled   = false
  }

  ebs_options {
    ebs_enabled = true
    volume_type = "gp3"
    volume_size = 20
  }

  encrypt_at_rest {
    enabled = true
  }

  node_to_node_encryption {
    enabled = true
  }

  domain_endpoint_options {
    enforce_https       = true
    tls_security_policy = "Policy-Min-TLS-1-2-2019-07"
  }

  advanced_security_options {
    enabled                        = true
    internal_user_database_enabled = true
    master_user_options {
      master_user_name     = "admin"
      master_user_password = random_password.opensearch_password.result
    }
  }

  tags = {
    Name        = "CareBow Chat Memory"
    Environment = var.environment
    Purpose     = "Vector search for conversation memory"
    HIPAA       = "true"
  }
}

# Cognito User Pool for authentication
resource "aws_cognito_user_pool" "chat_users" {
  name = "${var.project_name}-chat-users-${var.environment}"

  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_numbers   = true
    require_symbols   = true
    require_uppercase = true
  }

  mfa_configuration = "OPTIONAL"

  software_token_mfa_configuration {
    enabled = true
  }

  user_pool_add_ons {
    advanced_security_mode = "ENFORCED"
  }

  schema {
    name                = "email"
    attribute_data_type = "String"
    required            = true
    mutable             = true
  }

  schema {
    name                = "given_name"
    attribute_data_type = "String"
    required            = true
    mutable             = true
  }

  schema {
    name                = "family_name"
    attribute_data_type = "String"
    required            = true
    mutable             = true
  }

  tags = {
    Name        = "CareBow Chat Users"
    Environment = var.environment
    Purpose     = "User authentication for chat system"
  }
}

# Cognito User Pool Client
resource "aws_cognito_user_pool_client" "chat_client" {
  name         = "${var.project_name}-chat-client-${var.environment}"
  user_pool_id = aws_cognito_user_pool.chat_users.id

  generate_secret                      = true
  prevent_user_existence_errors        = "ENABLED"
  enable_token_revocation             = true
  enable_propagate_additional_user_context_data = true

  token_validity_units {
    access_token  = "hours"
    id_token      = "hours"
    refresh_token = "days"
  }

  access_token_validity  = 1
  id_token_validity      = 1
  refresh_token_validity = 30

  explicit_auth_flows = [
    "ALLOW_USER_SRP_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_PASSWORD_AUTH"
  ]

  supported_identity_providers = ["COGNITO"]
}

# Lambda function for data export
resource "aws_lambda_function" "data_export" {
  filename         = "data_export.zip"
  function_name    = "${var.project_name}-data-export-${var.environment}"
  role            = aws_iam_role.lambda_export_role.arn
  handler         = "lambda_function.lambda_handler"
  source_code_hash = data.archive_file.data_export_zip.output_base64sha256
  runtime         = "python3.9"
  timeout         = 300

  environment {
    variables = {
      RDS_ENDPOINT     = var.rds_endpoint
      RDS_DATABASE     = var.rds_database
      RDS_USERNAME     = var.rds_username
      S3_BUCKET        = aws_s3_bucket.data_exports.bucket
      OPENSEARCH_ENDPOINT = aws_opensearch_domain.chat_memory.endpoint
    }
  }

  vpc_config {
    subnet_ids         = var.private_subnet_ids
    security_group_ids = [aws_security_group.lambda_export_sg.id]
  }

  tags = {
    Name        = "CareBow Data Export"
    Environment = var.environment
    Purpose     = "Export user data for GDPR compliance"
  }
}

# Lambda function for data deletion
resource "aws_lambda_function" "data_deletion" {
  filename         = "data_deletion.zip"
  function_name    = "${var.project_name}-data-deletion-${var.environment}"
  role            = aws_iam_role.lambda_deletion_role.arn
  handler         = "lambda_function.lambda_handler"
  source_code_hash = data.archive_file.data_deletion_zip.output_base64sha256
  runtime         = "python3.9"
  timeout         = 300

  environment {
    variables = {
      RDS_ENDPOINT     = var.rds_endpoint
      RDS_DATABASE     = var.rds_database
      RDS_USERNAME     = var.rds_username
      S3_BUCKET        = aws_s3_bucket.chat_data.bucket
      VOICE_BUCKET     = aws_s3_bucket.voice_data.bucket
      OPENSEARCH_ENDPOINT = aws_opensearch_domain.chat_memory.endpoint
    }
  }

  vpc_config {
    subnet_ids         = var.private_subnet_ids
    security_group_ids = [aws_security_group.lambda_deletion_sg.id]
  }

  tags = {
    Name        = "CareBow Data Deletion"
    Environment = var.environment
    Purpose     = "Delete user data for GDPR compliance"
  }
}

# Step Functions for data processing workflows
resource "aws_sfn_state_machine" "data_export_workflow" {
  name     = "${var.project_name}-data-export-workflow-${var.environment}"
  role_arn = aws_iam_role.step_functions_role.arn

  definition = jsonencode({
    Comment = "Data Export Workflow"
    StartAt = "ExportData"
    States = {
      ExportData = {
        Type     = "Task"
        Resource = aws_lambda_function.data_export.arn
        Next     = "NotifyUser"
      }
      NotifyUser = {
        Type     = "Task"
        Resource = "arn:aws:states:::sns:publish"
        Parameters = {
          TopicArn = aws_sns_topic.data_export_notifications.arn
          Message  = "Your data export is ready for download"
        }
        End = true
      }
    }
  })

  tags = {
    Name        = "CareBow Data Export Workflow"
    Environment = var.environment
  }
}

resource "aws_sfn_state_machine" "data_deletion_workflow" {
  name     = "${var.project_name}-data-deletion-workflow-${var.environment}"
  role_arn = aws_iam_role.step_functions_role.arn

  definition = jsonencode({
    Comment = "Data Deletion Workflow"
    StartAt = "WaitGracePeriod"
    States = {
      WaitGracePeriod = {
        Type     = "Wait"
        Seconds  = 604800  # 7 days
        Next     = "DeleteData"
      }
      DeleteData = {
        Type     = "Task"
        Resource = aws_lambda_function.data_deletion.arn
        Next     = "NotifyCompletion"
      }
      NotifyCompletion = {
        Type     = "Task"
        Resource = "arn:aws:states:::sns:publish"
        Parameters = {
          TopicArn = aws_sns_topic.data_deletion_notifications.arn
          Message  = "Your account and data have been permanently deleted"
        }
        End = true
      }
    }
  })

  tags = {
    Name        = "CareBow Data Deletion Workflow"
    Environment = var.environment
  }
}

# SNS Topics for notifications
resource "aws_sns_topic" "data_export_notifications" {
  name = "${var.project_name}-data-export-notifications-${var.environment}"

  tags = {
    Name        = "CareBow Data Export Notifications"
    Environment = var.environment
  }
}

resource "aws_sns_topic" "data_deletion_notifications" {
  name = "${var.project_name}-data-deletion-notifications-${var.environment}"

  tags = {
    Name        = "CareBow Data Deletion Notifications"
    Environment = var.environment
  }
}

# CloudWatch Log Groups
resource "aws_cloudwatch_log_group" "chat_memory_logs" {
  name              = "/aws/opensearch/domains/${aws_opensearch_domain.chat_memory.domain_name}"
  retention_in_days = 30

  tags = {
    Name        = "CareBow Chat Memory Logs"
    Environment = var.environment
  }
}

resource "aws_cloudwatch_log_group" "data_export_logs" {
  name              = "/aws/lambda/${aws_lambda_function.data_export.function_name}"
  retention_in_days = 14

  tags = {
    Name        = "CareBow Data Export Logs"
    Environment = var.environment
  }
}

resource "aws_cloudwatch_log_group" "data_deletion_logs" {
  name              = "/aws/lambda/${aws_lambda_function.data_deletion.function_name}"
  retention_in_days = 14

  tags = {
    Name        = "CareBow Data Deletion Logs"
    Environment = var.environment
  }
}

# Random password for OpenSearch
resource "random_password" "opensearch_password" {
  length  = 16
  special = true
}

# Random string for bucket suffix
resource "random_string" "bucket_suffix" {
  length  = 8
  special = false
  upper   = false
}

# Archive files for Lambda functions
data "archive_file" "data_export_zip" {
  type        = "zip"
  output_path = "data_export.zip"
  source {
    content = file("${path.module}/lambda/data_export.py")
    filename = "lambda_function.py"
  }
}

data "archive_file" "data_deletion_zip" {
  type        = "zip"
  output_path = "data_deletion.zip"
  source {
    content = file("${path.module}/lambda/data_deletion.py")
    filename = "lambda_function.py"
  }
}
