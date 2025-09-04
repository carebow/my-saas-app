# Staging Environment Configuration
# This file contains staging-specific resources and configurations

# Staging Environment Variables
variable "staging_enabled" {
  description = "Enable staging environment"
  type        = bool
  default     = true
}

variable "staging_domain_prefix" {
  description = "Domain prefix for staging environment"
  type        = string
  default     = "staging"
}

# Staging ECS Cluster
resource "aws_ecs_cluster" "staging" {
  count = var.staging_enabled ? 1 : 0
  name  = "${var.project_name}-staging-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = {
    Name        = "${var.project_name}-staging-cluster"
    Environment = "staging"
  }
}

# Staging ECS Task Definition
resource "aws_ecs_task_definition" "staging" {
  count                    = var.staging_enabled ? 1 : 0
  family                   = "${var.project_name}-staging-app"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 256 # Smaller for staging
  memory                   = 512 # Smaller for staging
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_role.arn

  container_definitions = jsonencode([
    {
      name  = "${var.project_name}-staging-backend"
      image = "${aws_ecr_repository.backend.repository_url}:staging"

      portMappings = [
        {
          containerPort = 8000
          protocol      = "tcp"
        }
      ]

      environment = [
        {
          name  = "ENVIRONMENT"
          value = "staging"
        },
        {
          name  = "DEBUG"
          value = "true"
        }
      ]

      secrets = [
        {
          name      = "DATABASE_URL"
          valueFrom = "${aws_secretsmanager_secret.staging_app_secrets[0].arn}:database_url::"
        },
        {
          name      = "REDIS_URL"
          valueFrom = "${aws_secretsmanager_secret.staging_app_secrets[0].arn}:redis_url::"
        },
        {
          name      = "SECRET_KEY"
          valueFrom = "${aws_secretsmanager_secret.staging_app_secrets[0].arn}:secret_key::"
        },
        {
          name      = "OPENAI_API_KEY"
          valueFrom = "${aws_secretsmanager_secret.staging_app_secrets[0].arn}:openai_api_key::"
        },
        {
          name      = "STRIPE_SECRET_KEY"
          valueFrom = "${aws_secretsmanager_secret.staging_app_secrets[0].arn}:stripe_secret_key::"
        }
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.staging[0].name
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = "ecs"
        }
      }

      healthCheck = {
        command     = ["CMD-SHELL", "curl -f http://localhost:8000/health || exit 1"]
        interval    = 30
        timeout     = 5
        retries     = 3
        startPeriod = 60
      }
    }
  ])

  tags = {
    Name        = "${var.project_name}-staging-task-definition"
    Environment = "staging"
  }
}

# Staging CloudWatch Log Group
resource "aws_cloudwatch_log_group" "staging" {
  count             = var.staging_enabled ? 1 : 0
  name              = "/ecs/${var.project_name}-staging"
  retention_in_days = 7 # Shorter retention for staging

  tags = {
    Name        = "${var.project_name}-staging-ecs-logs"
    Environment = "staging"
  }
}

# Staging ALB Target Group
resource "aws_lb_target_group" "staging" {
  count       = var.staging_enabled ? 1 : 0
  name        = "${var.project_name}-staging-tg"
  port        = 8000
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "ip"

  health_check {
    enabled             = true
    healthy_threshold   = 2
    interval            = 30
    matcher             = "200"
    path                = "/health"
    port                = "traffic-port"
    protocol            = "HTTP"
    timeout             = 5
    unhealthy_threshold = 2
  }

  tags = {
    Name        = "${var.project_name}-staging-tg"
    Environment = "staging"
  }
}

# Staging ALB Listener Rule
resource "aws_lb_listener_rule" "staging" {
  count        = var.staging_enabled ? 1 : 0
  listener_arn = aws_lb_listener.app.arn
  priority     = 100

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.staging[0].arn
  }

  condition {
    host_header {
      values = ["${var.staging_domain_prefix}.${aws_lb.main.dns_name}"]
    }
  }

  tags = {
    Name        = "${var.project_name}-staging-listener-rule"
    Environment = "staging"
  }
}

# Staging ECS Service
resource "aws_ecs_service" "staging" {
  count           = var.staging_enabled ? 1 : 0
  name            = "${var.project_name}-staging-service"
  cluster         = aws_ecs_cluster.staging[0].id
  task_definition = aws_ecs_task_definition.staging[0].arn
  desired_count   = 1 # Single instance for staging
  launch_type     = "FARGATE"

  network_configuration {
    security_groups  = [aws_security_group.ecs.id]
    subnets          = aws_subnet.private[*].id
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.staging[0].arn
    container_name   = "${var.project_name}-staging-backend"
    container_port   = 8000
  }

  depends_on = [aws_lb_listener.app]

  tags = {
    Name        = "${var.project_name}-staging-service"
    Environment = "staging"
  }
}

# Staging S3 Bucket for Frontend
resource "aws_s3_bucket" "staging_frontend" {
  count  = var.staging_enabled ? 1 : 0
  bucket = "${var.project_name}-staging-frontend-${random_id.staging_bucket_suffix[0].hex}"

  tags = {
    Name        = "${var.project_name}-staging-frontend"
    Environment = "staging"
  }
}

resource "random_id" "staging_bucket_suffix" {
  count       = var.staging_enabled ? 1 : 0
  byte_length = 4
}

# Staging S3 Bucket Configuration
resource "aws_s3_bucket_public_access_block" "staging_frontend" {
  count  = var.staging_enabled ? 1 : 0
  bucket = aws_s3_bucket.staging_frontend[0].id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_versioning" "staging_frontend" {
  count  = var.staging_enabled ? 1 : 0
  bucket = aws_s3_bucket.staging_frontend[0].id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "staging_frontend" {
  count  = var.staging_enabled ? 1 : 0
  bucket = aws_s3_bucket.staging_frontend[0].id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# Staging CloudFront Origin Access Control
resource "aws_cloudfront_origin_access_control" "staging_frontend" {
  count                             = var.staging_enabled ? 1 : 0
  name                              = "${var.project_name}-staging-frontend-oac"
  description                       = "OAC for CareBow staging frontend"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# Staging CloudFront Distribution
resource "aws_cloudfront_distribution" "staging_frontend" {
  count = var.staging_enabled ? 1 : 0

  origin {
    domain_name              = aws_s3_bucket.staging_frontend[0].bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.staging_frontend[0].id
    origin_id                = "S3-${aws_s3_bucket.staging_frontend[0].bucket}"
  }

  # Staging API Origin
  origin {
    domain_name = aws_lb.main.dns_name
    origin_id   = "ALB-${var.project_name}-staging-api"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }

    custom_header {
      name  = "X-Forwarded-Host"
      value = "${var.staging_domain_prefix}.${aws_lb.main.dns_name}"
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "CareBow Staging Frontend Distribution"
  default_root_object = "index.html"

  # Frontend behavior
  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${aws_s3_bucket.staging_frontend[0].bucket}"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 0    # No caching for staging
    max_ttl                = 3600 # Short cache for staging
    compress               = true
  }

  # Staging API behavior
  ordered_cache_behavior {
    path_pattern     = "/api/*"
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD", "OPTIONS"]
    target_origin_id = "ALB-${var.project_name}-staging-api"

    forwarded_values {
      query_string = true
      headers      = ["Authorization", "Content-Type", "Host"]
      cookies {
        forward = "all"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 0
    max_ttl                = 0
    compress               = true
  }

  price_class = "PriceClass_100"

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  # Custom error pages
  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
  }

  custom_error_response {
    error_code         = 403
    response_code      = 200
    response_page_path = "/index.html"
  }

  tags = {
    Name        = "${var.project_name}-staging-frontend-distribution"
    Environment = "staging"
  }
}

# Staging S3 Bucket Policy for CloudFront
resource "aws_s3_bucket_policy" "staging_frontend" {
  count  = var.staging_enabled ? 1 : 0
  bucket = aws_s3_bucket.staging_frontend[0].id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowCloudFrontServicePrincipal"
        Effect = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action   = "s3:GetObject"
        Resource = "${aws_s3_bucket.staging_frontend[0].arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.staging_frontend[0].arn
          }
        }
      }
    ]
  })
}

# Staging Outputs
output "staging_cloudfront_distribution_id" {
  value = var.staging_enabled ? aws_cloudfront_distribution.staging_frontend[0].id : null
}

output "staging_cloudfront_domain_name" {
  value = var.staging_enabled ? aws_cloudfront_distribution.staging_frontend[0].domain_name : null
}

output "staging_s3_bucket_name" {
  value = var.staging_enabled ? aws_s3_bucket.staging_frontend[0].bucket : null
}

output "staging_ecs_cluster_name" {
  value = var.staging_enabled ? aws_ecs_cluster.staging[0].name : null
}

output "staging_ecs_service_name" {
  value = var.staging_enabled ? aws_ecs_service.staging[0].name : null
}