# Step Functions Module for CareBow AWS-Native Architecture
# Creates state machines for data export and hard deletion workflows

terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# IAM Role for Step Functions
resource "aws_iam_role" "step_functions_role" {
  name = "${var.project_name}-step-functions-role-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "states.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name        = "${var.project_name}-step-functions-role-${var.environment}"
    Environment = var.environment
    Purpose     = "Step Functions execution"
  }
}

# IAM Policy for Step Functions
resource "aws_iam_role_policy" "step_functions_policy" {
  name = "${var.project_name}-step-functions-policy-${var.environment}"
  role = aws_iam_role.step_functions_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "lambda:InvokeFunction",
          "lambda:InvokeAsync"
        ]
        Resource = [
          var.data_export_lambda_arn,
          var.data_deletion_lambda_arn,
          var.notification_lambda_arn
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "sqs:SendMessage",
          "sqs:GetQueueAttributes"
        ]
        Resource = [
          var.export_queue_arn,
          var.deletion_queue_arn
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "sns:Publish"
        ]
        Resource = [
          var.notification_topic_arn
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:*"
      }
    ]
  })
}

# CloudWatch Log Group for Step Functions
resource "aws_cloudwatch_log_group" "step_functions" {
  name              = "/aws/stepfunctions/${var.project_name}-${var.environment}"
  retention_in_days = var.log_retention_days

  tags = {
    Name        = "${var.project_name}-step-functions-logs-${var.environment}"
    Environment = var.environment
    Purpose     = "Step Functions execution logs"
  }
}

# Data Export State Machine
resource "aws_sfn_state_machine" "data_export" {
  name     = "${var.project_name}-data-export-${var.environment}"
  role_arn = aws_iam_role.step_functions_role.arn

  definition = jsonencode({
    Comment = "Data Export Workflow for CareBow"
    StartAt = "ValidateRequest"
    States = {
      ValidateRequest = {
        Type = "Task"
        Resource = "arn:aws:states:::lambda:invoke"
        Parameters = {
          FunctionName = var.data_export_lambda_arn
          Payload = {
            "action" = "validate_request"
            "input.$" = "$"
          }
        }
        Next = "CheckValidation"
        Retry = [
          {
            ErrorEquals = ["Lambda.ServiceException", "Lambda.AWSLambdaException", "Lambda.SdkClientException"]
            IntervalSeconds = 2
            MaxAttempts = 6
            BackoffRate = 2
          }
        ]
        Catch = [
          {
            ErrorEquals = ["States.ALL"]
            Next = "ExportFailed"
            ResultPath = "$.error"
          }
        ]
      }
      CheckValidation = {
        Type = "Choice"
        Choices = [
          {
            Variable = "$.valid"
            BooleanEquals = true
            Next = "PrepareExport"
          }
        ]
        Default = "ExportFailed"
      }
      PrepareExport = {
        Type = "Task"
        Resource = "arn:aws:states:::lambda:invoke"
        Parameters = {
          FunctionName = var.data_export_lambda_arn
          Payload = {
            "action" = "prepare_export"
            "input.$" = "$"
          }
        }
        Next = "GenerateExport"
        Retry = [
          {
            ErrorEquals = ["Lambda.ServiceException", "Lambda.AWSLambdaException", "Lambda.SdkClientException"]
            IntervalSeconds = 2
            MaxAttempts = 3
            BackoffRate = 2
          }
        ]
        Catch = [
          {
            ErrorEquals = ["States.ALL"]
            Next = "ExportFailed"
            ResultPath = "$.error"
          }
        ]
      }
      GenerateExport = {
        Type = "Task"
        Resource = "arn:aws:states:::lambda:invoke"
        Parameters = {
          FunctionName = var.data_export_lambda_arn
          Payload = {
            "action" = "generate_export"
            "input.$" = "$"
          }
        }
        Next = "UploadToS3"
        Retry = [
          {
            ErrorEquals = ["Lambda.ServiceException", "Lambda.AWSLambdaException", "Lambda.SdkClientException"]
            IntervalSeconds = 5
            MaxAttempts = 3
            BackoffRate = 2
          }
        ]
        Catch = [
          {
            ErrorEquals = ["States.ALL"]
            Next = "ExportFailed"
            ResultPath = "$.error"
          }
        ]
      }
      UploadToS3 = {
        Type = "Task"
        Resource = "arn:aws:states:::lambda:invoke"
        Parameters = {
          FunctionName = var.data_export_lambda_arn
          Payload = {
            "action" = "upload_to_s3"
            "input.$" = "$"
          }
        }
        Next = "SendNotification"
        Retry = [
          {
            ErrorEquals = ["Lambda.ServiceException", "Lambda.AWSLambdaException", "Lambda.SdkClientException"]
            IntervalSeconds = 2
            MaxAttempts = 3
            BackoffRate = 2
          }
        ]
        Catch = [
          {
            ErrorEquals = ["States.ALL"]
            Next = "ExportFailed"
            ResultPath = "$.error"
          }
        ]
      }
      SendNotification = {
        Type = "Task"
        Resource = "arn:aws:states:::lambda:invoke"
        Parameters = {
          FunctionName = var.notification_lambda_arn
          Payload = {
            "action" = "send_export_notification"
            "input.$" = "$"
          }
        }
        Next = "ExportCompleted"
        Retry = [
          {
            ErrorEquals = ["Lambda.ServiceException", "Lambda.AWSLambdaException", "Lambda.SdkClientException"]
            IntervalSeconds = 2
            MaxAttempts = 3
            BackoffRate = 2
          }
        ]
        Catch = [
          {
            ErrorEquals = ["States.ALL"]
            Next = "ExportCompleted"
            ResultPath = "$.notification_error"
          }
        ]
      }
      ExportCompleted = {
        Type = "Succeed"
        OutputPath = "$"
      }
      ExportFailed = {
        Type = "Fail"
        Cause = "Data export failed"
        Error = "ExportFailed"
      }
    }
  })

  logging_configuration {
    log_destination        = "${aws_cloudwatch_log_group.step_functions.arn}:*"
    include_execution_data = true
    level                  = "ERROR"
  }

  tags = {
    Name        = "${var.project_name}-data-export-${var.environment}"
    Environment = var.environment
    Purpose     = "Data export workflow"
  }
}

# Data Deletion State Machine
resource "aws_sfn_state_machine" "data_deletion" {
  name     = "${var.project_name}-data-deletion-${var.environment}"
  role_arn = aws_iam_role.step_functions_role.arn

  definition = jsonencode({
    Comment = "Data Deletion Workflow for CareBow"
    StartAt = "ValidateDeletionRequest"
    States = {
      ValidateDeletionRequest = {
        Type = "Task"
        Resource = "arn:aws:states:::lambda:invoke"
        Parameters = {
          FunctionName = var.data_deletion_lambda_arn
          Payload = {
            "action" = "validate_deletion_request"
            "input.$" = "$"
          }
        }
        Next = "CheckDeletionValidation"
        Retry = [
          {
            ErrorEquals = ["Lambda.ServiceException", "Lambda.AWSLambdaException", "Lambda.SdkClientException"]
            IntervalSeconds = 2
            MaxAttempts = 6
            BackoffRate = 2
          }
        ]
        Catch = [
          {
            ErrorEquals = ["States.ALL"]
            Next = "DeletionFailed"
            ResultPath = "$.error"
          }
        ]
      }
      CheckDeletionValidation = {
        Type = "Choice"
        Choices = [
          {
            Variable = "$.valid"
            BooleanEquals = true
            Next = "WaitForGracePeriod"
          }
        ]
        Default = "DeletionFailed"
      }
      WaitForGracePeriod = {
        Type = "Wait"
        Seconds = var.grace_period_seconds
        Next = "DeleteDatabaseRecords"
      }
      DeleteDatabaseRecords = {
        Type = "Task"
        Resource = "arn:aws:states:::lambda:invoke"
        Parameters = {
          FunctionName = var.data_deletion_lambda_arn
          Payload = {
            "action" = "delete_database_records"
            "input.$" = "$"
          }
        }
        Next = "DeleteS3Objects"
        Retry = [
          {
            ErrorEquals = ["Lambda.ServiceException", "Lambda.AWSLambdaException", "Lambda.SdkClientException"]
            IntervalSeconds = 5
            MaxAttempts = 3
            BackoffRate = 2
          }
        ]
        Catch = [
          {
            ErrorEquals = ["States.ALL"]
            Next = "DeletionFailed"
            ResultPath = "$.error"
          }
        ]
      }
      DeleteS3Objects = {
        Type = "Task"
        Resource = "arn:aws:states:::lambda:invoke"
        Parameters = {
          FunctionName = var.data_deletion_lambda_arn
          Payload = {
            "action" = "delete_s3_objects"
            "input.$" = "$"
          }
        }
        Next = "DeleteSearchIndexes"
        Retry = [
          {
            ErrorEquals = ["Lambda.ServiceException", "Lambda.AWSLambdaException", "Lambda.SdkClientException"]
            IntervalSeconds = 5
            MaxAttempts = 3
            BackoffRate = 2
          }
        ]
        Catch = [
          {
            ErrorEquals = ["States.ALL"]
            Next = "DeletionFailed"
            ResultPath = "$.error"
          }
        ]
      }
      DeleteSearchIndexes = {
        Type = "Task"
        Resource = "arn:aws:states:::lambda:invoke"
        Parameters = {
          FunctionName = var.data_deletion_lambda_arn
          Payload = {
            "action" = "delete_search_indexes"
            "input.$" = "$"
          }
        }
        Next = "RevokeCognitoUser"
        Retry = [
          {
            ErrorEquals = ["Lambda.ServiceException", "Lambda.AWSLambdaException", "Lambda.SdkClientException"]
            IntervalSeconds = 5
            MaxAttempts = 3
            BackoffRate = 2
          }
        ]
        Catch = [
          {
            ErrorEquals = ["States.ALL"]
            Next = "DeletionFailed"
            ResultPath = "$.error"
          }
        ]
      }
      RevokeCognitoUser = {
        Type = "Task"
        Resource = "arn:aws:states:::lambda:invoke"
        Parameters = {
          FunctionName = var.data_deletion_lambda_arn
          Payload = {
            "action" = "revoke_cognito_user"
            "input.$" = "$"
          }
        }
        Next = "CreateAuditLog"
        Retry = [
          {
            ErrorEquals = ["Lambda.ServiceException", "Lambda.AWSLambdaException", "Lambda.SdkClientException"]
            IntervalSeconds = 5
            MaxAttempts = 3
            BackoffRate = 2
          }
        ]
        Catch = [
          {
            ErrorEquals = ["States.ALL"]
            Next = "DeletionFailed"
            ResultPath = "$.error"
          }
        ]
      }
      CreateAuditLog = {
        Type = "Task"
        Resource = "arn:aws:states:::lambda:invoke"
        Parameters = {
          FunctionName = var.data_deletion_lambda_arn
          Payload = {
            "action" = "create_audit_log"
            "input.$" = "$"
          }
        }
        Next = "SendDeletionNotification"
        Retry = [
          {
            ErrorEquals = ["Lambda.ServiceException", "Lambda.AWSLambdaException", "Lambda.SdkClientException"]
            IntervalSeconds = 2
            MaxAttempts = 3
            BackoffRate = 2
          }
        ]
        Catch = [
          {
            ErrorEquals = ["States.ALL"]
            Next = "DeletionCompleted"
            ResultPath = "$.audit_error"
          }
        ]
      }
      SendDeletionNotification = {
        Type = "Task"
        Resource = "arn:aws:states:::lambda:invoke"
        Parameters = {
          FunctionName = var.notification_lambda_arn
          Payload = {
            "action" = "send_deletion_notification"
            "input.$" = "$"
          }
        }
        Next = "DeletionCompleted"
        Retry = [
          {
            ErrorEquals = ["Lambda.ServiceException", "Lambda.AWSLambdaException", "Lambda.SdkClientException"]
            IntervalSeconds = 2
            MaxAttempts = 3
            BackoffRate = 2
          }
        ]
        Catch = [
          {
            ErrorEquals = ["States.ALL"]
            Next = "DeletionCompleted"
            ResultPath = "$.notification_error"
          }
        ]
      }
      DeletionCompleted = {
        Type = "Succeed"
        OutputPath = "$"
      }
      DeletionFailed = {
        Type = "Fail"
        Cause = "Data deletion failed"
        Error = "DeletionFailed"
      }
    }
  })

  logging_configuration {
    log_destination        = "${aws_cloudwatch_log_group.step_functions.arn}:*"
    include_execution_data = true
    level                  = "ERROR"
  }

  tags = {
    Name        = "${var.project_name}-data-deletion-${var.environment}"
    Environment = var.environment
    Purpose     = "Data deletion workflow"
  }
}

# Data sources
data "aws_region" "current" {}
data "aws_caller_identity" "current" {}
