# Security Groups for Enhanced Chat System

# Security group for Lambda functions
resource "aws_security_group" "lambda_export_sg" {
  name        = "${var.project_name}-lambda-export-sg-${var.environment}"
  description = "Security group for data export Lambda function"
  vpc_id      = var.vpc_id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "CareBow Lambda Export SG"
    Environment = var.environment
  }
}

resource "aws_security_group" "lambda_deletion_sg" {
  name        = "${var.project_name}-lambda-deletion-sg-${var.environment}"
  description = "Security group for data deletion Lambda function"
  vpc_id      = var.vpc_id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "CareBow Lambda Deletion SG"
    Environment = var.environment
  }
}

# Security group for ECS Chat service
resource "aws_security_group" "ecs_chat_sg" {
  name        = "${var.project_name}-ecs-chat-sg-${var.environment}"
  description = "Security group for ECS Chat service"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = 8000
    to_port     = 8000
    protocol    = "tcp"
    cidr_blocks = [var.vpc_cidr]
    description = "Chat API port"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "CareBow ECS Chat SG"
    Environment = var.environment
  }
}

# Security group for OpenSearch
resource "aws_security_group" "opensearch_sg" {
  name        = "${var.project_name}-opensearch-sg-${var.environment}"
  description = "Security group for OpenSearch domain"
  vpc_id      = var.vpc_id

  ingress {
    from_port       = 443
    to_port         = 443
    protocol        = "tcp"
    security_groups = [aws_security_group.ecs_chat_sg.id]
    description     = "HTTPS from ECS Chat service"
  }

  ingress {
    from_port       = 443
    to_port         = 443
    protocol        = "tcp"
    security_groups = [aws_security_group.lambda_export_sg.id]
    description     = "HTTPS from Lambda export function"
  }

  ingress {
    from_port       = 443
    to_port         = 443
    protocol        = "tcp"
    security_groups = [aws_security_group.lambda_deletion_sg.id]
    description     = "HTTPS from Lambda deletion function"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "CareBow OpenSearch SG"
    Environment = var.environment
  }
}

# Security group for RDS (if not already exists)
resource "aws_security_group" "rds_chat_sg" {
  name        = "${var.project_name}-rds-chat-sg-${var.environment}"
  description = "Security group for RDS database for chat system"
  vpc_id      = var.vpc_id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.ecs_chat_sg.id]
    description     = "PostgreSQL from ECS Chat service"
  }

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.lambda_export_sg.id]
    description     = "PostgreSQL from Lambda export function"
  }

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.lambda_deletion_sg.id]
    description     = "PostgreSQL from Lambda deletion function"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "CareBow RDS Chat SG"
    Environment = var.environment
  }
}

# WAF Web ACL for API Gateway
resource "aws_wafv2_web_acl" "chat_api_waf" {
  name  = "${var.project_name}-chat-api-waf-${var.environment}"
  scope = "REGIONAL"

  default_action {
    allow {}
  }

  rule {
    name     = "RateLimitRule"
    priority = 1

    override_action {
      none {}
    }

    statement {
      rate_based_statement {
        limit              = 2000
        aggregate_key_type = "IP"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "RateLimitRule"
      sampled_requests_enabled   = true
    }
  }

  rule {
    name     = "AWSManagedRulesCommonRuleSet"
    priority = 2

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesCommonRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "CommonRuleSetMetric"
      sampled_requests_enabled   = true
    }
  }

  rule {
    name     = "AWSManagedRulesKnownBadInputsRuleSet"
    priority = 3

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesKnownBadInputsRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "KnownBadInputsRuleSetMetric"
      sampled_requests_enabled   = true
    }
  }

  rule {
    name     = "AWSManagedRulesSQLiRuleSet"
    priority = 4

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesSQLiRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "SQLiRuleSetMetric"
      sampled_requests_enabled   = true
    }
  }

  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "ChatAPIWAF"
    sampled_requests_enabled   = true
  }

  tags = {
    Name        = "CareBow Chat API WAF"
    Environment = var.environment
  }
}

# Associate WAF with API Gateway
resource "aws_wafv2_web_acl_association" "chat_api_waf_association" {
  resource_arn = var.api_gateway_arn
  web_acl_arn  = aws_wafv2_web_acl.chat_api_waf.arn
}

# CloudWatch Alarms for monitoring
resource "aws_cloudwatch_metric_alarm" "opensearch_cpu_high" {
  alarm_name          = "${var.project_name}-opensearch-cpu-high-${var.environment}"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/ES"
  period              = "300"
  statistic           = "Average"
  threshold           = "80"
  alarm_description   = "This metric monitors OpenSearch CPU utilization"
  alarm_actions       = [aws_sns_topic.chat_alerts.arn]

  dimensions = {
    DomainName = aws_opensearch_domain.chat_memory.domain_name
    ClientId   = data.aws_caller_identity.current.account_id
  }

  tags = {
    Name        = "CareBow OpenSearch CPU High"
    Environment = var.environment
  }
}

resource "aws_cloudwatch_metric_alarm" "opensearch_storage_high" {
  alarm_name          = "${var.project_name}-opensearch-storage-high-${var.environment}"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "StorageUtilization"
  namespace           = "AWS/ES"
  period              = "300"
  statistic           = "Average"
  threshold           = "85"
  alarm_description   = "This metric monitors OpenSearch storage utilization"
  alarm_actions       = [aws_sns_topic.chat_alerts.arn]

  dimensions = {
    DomainName = aws_opensearch_domain.chat_memory.domain_name
    ClientId   = data.aws_caller_identity.current.account_id
  }

  tags = {
    Name        = "CareBow OpenSearch Storage High"
    Environment = var.environment
  }
}

resource "aws_cloudwatch_metric_alarm" "lambda_export_errors" {
  alarm_name          = "${var.project_name}-lambda-export-errors-${var.environment}"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "Errors"
  namespace           = "AWS/Lambda"
  period              = "300"
  statistic           = "Sum"
  threshold           = "0"
  alarm_description   = "This metric monitors Lambda export function errors"
  alarm_actions       = [aws_sns_topic.chat_alerts.arn]

  dimensions = {
    FunctionName = aws_lambda_function.data_export.function_name
  }

  tags = {
    Name        = "CareBow Lambda Export Errors"
    Environment = var.environment
  }
}

resource "aws_cloudwatch_metric_alarm" "lambda_deletion_errors" {
  alarm_name          = "${var.project_name}-lambda-deletion-errors-${var.environment}"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "Errors"
  namespace           = "AWS/Lambda"
  period              = "300"
  statistic           = "Sum"
  threshold           = "0"
  alarm_description   = "This metric monitors Lambda deletion function errors"
  alarm_actions       = [aws_sns_topic.chat_alerts.arn]

  dimensions = {
    FunctionName = aws_lambda_function.data_deletion.function_name
  }

  tags = {
    Name        = "CareBow Lambda Deletion Errors"
    Environment = var.environment
  }
}

# SNS Topic for alerts
resource "aws_sns_topic" "chat_alerts" {
  name = "${var.project_name}-chat-alerts-${var.environment}"

  tags = {
    Name        = "CareBow Chat Alerts"
    Environment = var.environment
  }
}

# SNS Topic Policy
resource "aws_sns_topic_policy" "chat_alerts_policy" {
  arn = aws_sns_topic.chat_alerts.arn

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "cloudwatch.amazonaws.com"
        }
        Action = "sns:Publish"
        Resource = aws_sns_topic.chat_alerts.arn
      }
    ]
  })
}

# Data sources
data "aws_region" "current" {}
data "aws_caller_identity" "current" {}
