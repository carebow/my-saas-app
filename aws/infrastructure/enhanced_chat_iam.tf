# IAM Roles and Policies for Enhanced Chat System

# Lambda execution role for data export
resource "aws_iam_role" "lambda_export_role" {
  name = "${var.project_name}-lambda-export-role-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name        = "CareBow Lambda Export Role"
    Environment = var.environment
  }
}

# Lambda execution role for data deletion
resource "aws_iam_role" "lambda_deletion_role" {
  name = "${var.project_name}-lambda-deletion-role-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name        = "CareBow Lambda Deletion Role"
    Environment = var.environment
  }
}

# Step Functions execution role
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
    Name        = "CareBow Step Functions Role"
    Environment = var.environment
  }
}

# ECS Task execution role for chat service
resource "aws_iam_role" "ecs_chat_task_role" {
  name = "${var.project_name}-ecs-chat-task-role-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name        = "CareBow ECS Chat Task Role"
    Environment = var.environment
  }
}

# ECS Task execution role
resource "aws_iam_role" "ecs_chat_execution_role" {
  name = "${var.project_name}-ecs-chat-execution-role-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name        = "CareBow ECS Chat Execution Role"
    Environment = var.environment
  }
}

# Policy for data export Lambda
resource "aws_iam_policy" "lambda_export_policy" {
  name = "${var.project_name}-lambda-export-policy-${var.environment}"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:*:*:*"
      },
      {
        Effect = "Allow"
        Action = [
          "rds:DescribeDBInstances",
          "rds:DescribeDBClusters"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:ListBucket"
        ]
        Resource = [
          aws_s3_bucket.data_exports.arn,
          "${aws_s3_bucket.data_exports.arn}/*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "es:ESHttpGet",
          "es:ESHttpPost",
          "es:ESHttpPut",
          "es:ESHttpDelete"
        ]
        Resource = "${aws_opensearch_domain.chat_memory.arn}/*"
      },
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue"
        ]
        Resource = [
          "arn:aws:secretsmanager:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:secret:${var.project_name}/rds/*"
        ]
      }
    ]
  })

  tags = {
    Name        = "CareBow Lambda Export Policy"
    Environment = var.environment
  }
}

# Policy for data deletion Lambda
resource "aws_iam_policy" "lambda_deletion_policy" {
  name = "${var.project_name}-lambda-deletion-policy-${var.environment}"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:*:*:*"
      },
      {
        Effect = "Allow"
        Action = [
          "rds:DescribeDBInstances",
          "rds:DescribeDBClusters"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:ListBucket"
        ]
        Resource = [
          aws_s3_bucket.chat_data.arn,
          "${aws_s3_bucket.chat_data.arn}/*",
          aws_s3_bucket.voice_data.arn,
          "${aws_s3_bucket.voice_data.arn}/*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "es:ESHttpGet",
          "es:ESHttpPost",
          "es:ESHttpPut",
          "es:ESHttpDelete"
        ]
        Resource = "${aws_opensearch_domain.chat_memory.arn}/*"
      },
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue"
        ]
        Resource = [
          "arn:aws:secretsmanager:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:secret:${var.project_name}/rds/*"
        ]
      }
    ]
  })

  tags = {
    Name        = "CareBow Lambda Deletion Policy"
    Environment = var.environment
  }
}

# Policy for Step Functions
resource "aws_iam_policy" "step_functions_policy" {
  name = "${var.project_name}-step-functions-policy-${var.environment}"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "lambda:InvokeFunction"
        ]
        Resource = [
          aws_lambda_function.data_export.arn,
          aws_lambda_function.data_deletion.arn
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "sns:Publish"
        ]
        Resource = [
          aws_sns_topic.data_export_notifications.arn,
          aws_sns_topic.data_deletion_notifications.arn
        ]
      }
    ]
  })

  tags = {
    Name        = "CareBow Step Functions Policy"
    Environment = var.environment
  }
}

# Policy for ECS Chat Task
resource "aws_iam_policy" "ecs_chat_task_policy" {
  name = "${var.project_name}-ecs-chat-task-policy-${var.environment}"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:ListBucket"
        ]
        Resource = [
          aws_s3_bucket.chat_data.arn,
          "${aws_s3_bucket.chat_data.arn}/*",
          aws_s3_bucket.voice_data.arn,
          "${aws_s3_bucket.voice_data.arn}/*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "es:ESHttpGet",
          "es:ESHttpPost",
          "es:ESHttpPut",
          "es:ESHttpDelete"
        ]
        Resource = "${aws_opensearch_domain.chat_memory.arn}/*"
      },
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue"
        ]
        Resource = [
          "arn:aws:secretsmanager:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:secret:${var.project_name}/rds/*",
          "arn:aws:secretsmanager:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:secret:${var.project_name}/openai/*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "states:StartExecution"
        ]
        Resource = [
          aws_sfn_state_machine.data_export_workflow.arn,
          aws_sfn_state_machine.data_deletion_workflow.arn
        ]
      }
    ]
  })

  tags = {
    Name        = "CareBow ECS Chat Task Policy"
    Environment = var.environment
  }
}

# Policy for ECS Chat Execution
resource "aws_iam_policy" "ecs_chat_execution_policy" {
  name = "${var.project_name}-ecs-chat-execution-policy-${var.environment}"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:*:*:*"
      },
      {
        Effect = "Allow"
        Action = [
          "ecr:GetAuthorizationToken",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage"
        ]
        Resource = "*"
      }
    ]
  })

  tags = {
    Name        = "CareBow ECS Chat Execution Policy"
    Environment = var.environment
  }
}

# Attach policies to roles
resource "aws_iam_role_policy_attachment" "lambda_export_policy_attachment" {
  role       = aws_iam_role.lambda_export_role.name
  policy_arn = aws_iam_policy.lambda_export_policy.arn
}

resource "aws_iam_role_policy_attachment" "lambda_deletion_policy_attachment" {
  role       = aws_iam_role.lambda_deletion_role.name
  policy_arn = aws_iam_policy.lambda_deletion_policy.arn
}

resource "aws_iam_role_policy_attachment" "step_functions_policy_attachment" {
  role       = aws_iam_role.step_functions_role.name
  policy_arn = aws_iam_policy.step_functions_policy.arn
}

resource "aws_iam_role_policy_attachment" "ecs_chat_task_policy_attachment" {
  role       = aws_iam_role.ecs_chat_task_role.name
  policy_arn = aws_iam_policy.ecs_chat_task_policy.arn
}

resource "aws_iam_role_policy_attachment" "ecs_chat_execution_policy_attachment" {
  role       = aws_iam_role.ecs_chat_execution_role.name
  policy_arn = aws_iam_policy.ecs_chat_execution_policy.arn
}

# Attach AWS managed policies
resource "aws_iam_role_policy_attachment" "lambda_export_basic_execution" {
  role       = aws_iam_role.lambda_export_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}

resource "aws_iam_role_policy_attachment" "lambda_deletion_basic_execution" {
  role       = aws_iam_role.lambda_deletion_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}

resource "aws_iam_role_policy_attachment" "ecs_chat_execution_basic" {
  role       = aws_iam_role.ecs_chat_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# Data sources
data "aws_region" "current" {}
data "aws_caller_identity" "current" {}
