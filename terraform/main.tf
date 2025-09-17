terraform {
  required_version = ">= 1.6.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = ">= 3.6"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# --- Networking ---
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"

  name = "carebow-vpc"
  cidr = var.vpc_cidr

  azs             = var.azs
  private_subnets = var.private_subnets
  public_subnets  = var.public_subnets

  enable_nat_gateway = true
  single_nat_gateway = true
  enable_dns_hostnames = true
  enable_dns_support   = true
}

# --- KMS for PHI/PII envelope encryption ---
resource "aws_kms_key" "data" {
  description             = "CareBow data key"
  deletion_window_in_days = 7
  enable_key_rotation     = true
}

resource "aws_kms_alias" "data" {
  name          = "alias/carebow-data"
  target_key_id = aws_kms_key.data.id
}

# --- S3 for reports (presigned URLs only) ---
resource "aws_s3_bucket" "reports" {
  bucket        = var.reports_bucket
  force_destroy = false
}

resource "aws_s3_bucket_server_side_encryption_configuration" "reports" {
  bucket = aws_s3_bucket.reports.id
  rule {
    apply_server_side_encryption_by_default {
      kms_master_key_id = aws_kms_key.data.arn
      sse_algorithm     = "aws:kms"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "reports" {
  bucket                  = aws_s3_bucket.reports.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# --- RDS Postgres ---
module "db" {
  source  = "terraform-aws-modules/rds/aws"
  version = "~> 6.5"

  identifier = "carebow-db"
  engine            = "postgres"
  engine_version    = var.db_engine_version
  instance_class    = var.db_instance_class
  allocated_storage = 50
  storage_encrypted = true
  kms_key_id        = aws_kms_key.data.arn

  username = var.db_username
  password = var.db_password
  port     = 5432

  family               = var.db_parameter_family
  major_engine_version = var.db_major_engine_version

  multi_az               = true
  publicly_accessible    = false
  create_db_subnet_group = true
  subnet_ids             = module.vpc.private_subnets
  vpc_security_group_ids = [aws_security_group.db.id]

  maintenance_window = "Sun:05:00-Sun:06:00"
  backup_window      = "03:00-04:00"
  backup_retention_period = 7
}

resource "aws_security_group" "db" {
  name        = "carebow-db-sg"
  description = "DB access from ECS"
  vpc_id      = module.vpc.vpc_id
}

# Allow ECS tasks to reach DB
resource "aws_security_group_rule" "db_from_ecs" {
  type                     = "ingress"
  security_group_id        = aws_security_group.db.id
  from_port                = 5432
  to_port                  = 5432
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.ecs_tasks.id
}

# --- ECS Cluster ---
resource "aws_ecs_cluster" "this" {
  name = "carebow-cluster"
}

resource "aws_security_group" "ecs_tasks" {
  name        = "carebow-ecs-tasks"
  description = "Allow outbound to DB/Internet"
  vpc_id      = module.vpc.vpc_id
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# --- Load Balancer ---
module "alb" {
  source  = "terraform-aws-modules/alb/aws"
  version = "~> 9.0"

  name = "carebow-alb"
  load_balancer_type = "application"
  vpc_id             = module.vpc.vpc_id
  subnets            = module.vpc.public_subnets
  security_groups    = [aws_security_group.alb.id]

  http_tcp_listeners = [{ port = 80, protocol = "HTTP" }]
}

resource "aws_security_group" "alb" {
  name        = "carebow-alb-sg"
  description = "Allow HTTP/HTTPS"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# --- ECS Fargate Service (API) ---
resource "aws_ecs_task_definition" "api" {
  family                   = "carebow-api"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 512
  memory                   = 1024
  network_mode             = "awsvpc"
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_role.arn

  container_definitions = jsonencode([
    {
      name      = "api"
      image     = var.api_image
      essential = true
      portMappings = [{ containerPort = 8080, hostPort = 8080 }]
      environment = [
        { name = "DB_HOST", value = module.db.db_instance_address },
        { name = "DB_PORT", value = "5432" },
        { name = "DB_NAME", value = module.db.db_instance_name },
        { name = "DB_USER", value = var.db_username },
        { name = "DB_PASSWORD", value = var.db_password },
        { name = "KMS_KEY_ID", value = aws_kms_key.data.key_id },
        { name = "REPORTS_BUCKET", value = aws_s3_bucket.reports.bucket },
        { name = "ENV", value = var.env }
      ],
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = "/ecs/carebow-api"
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = "ecs"
        }
      }
    }
  ])
}

resource "aws_cloudwatch_log_group" "api" {
  name              = "/ecs/carebow-api"
  retention_in_days = 30
}

resource "aws_lb_target_group" "api" {
  name     = "carebow-api-tg"
  port     = 8080
  protocol = "HTTP"
  vpc_id   = module.vpc.vpc_id
  target_type = "ip"
  health_check {
    path                = "/healthz"
    interval            = 30
    healthy_threshold   = 2
    unhealthy_threshold = 3
    timeout             = 5
    matcher             = "200"
  }
}

resource "aws_lb_listener_rule" "api" {
  listener_arn = module.alb.http_tcp_listeners[0].listener_arn

  priority = 10
  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.api.arn
  }
  condition {
    path_pattern { values = ["/*"] }
  }
}

resource "aws_ecs_service" "api" {
  name            = "carebow-api"
  cluster         = aws_ecs_cluster.this.id
  task_definition = aws_ecs_task_definition.api.arn
  desired_count   = 2
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = module.vpc.private_subnets
    security_groups = [aws_security_group.ecs_tasks.id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.api.arn
    container_name   = "api"
    container_port   = 8080
  }

  lifecycle {
    ignore_changes = [task_definition]
  }
}
