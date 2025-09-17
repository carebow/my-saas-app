variable "aws_region" { type = string default = "us-east-1" }
variable "env" { type = string default = "staging" }

variable "vpc_cidr" { type = string default = "10.0.0.0/16" }
variable "azs" { type = list(string) default = ["us-east-1a", "us-east-1b", "us-east-1c"] }
variable "public_subnets" { type = list(string) default = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"] }
variable "private_subnets" { type = list(string) default = ["10.0.11.0/24", "10.0.12.0/24", "10.0.13.0/24"] }

variable "reports_bucket" { type = string default = "carebow-reports-example" }

variable "db_engine_version" { type = string default = "16.3" }
variable "db_parameter_family" { type = string default = "postgres16" }
variable "db_major_engine_version" { type = string default = "16" }
variable "db_instance_class" { type = string default = "db.t4g.medium" }
variable "db_username" { type = string default = "carebow" }
variable "db_password" { type = string sensitive = true }

# IAM roles are now created in iam.tf

variable "api_image" { type = string description = "ECR image like <acct>.dkr.ecr.us-east-1.amazonaws.com/carebow-api:tag" }
