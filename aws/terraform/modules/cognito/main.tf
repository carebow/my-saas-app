# Cognito Module for CareBow AWS-Native Architecture
# Creates HIPAA-compliant user pools with fine-grained app client scopes

terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# Cognito User Pool
resource "aws_cognito_user_pool" "main" {
  name = "${var.project_name}-user-pool-${var.environment}"

  # Password policy for HIPAA compliance
  password_policy {
    minimum_length    = 12
    require_lowercase = true
    require_numbers   = true
    require_symbols   = true
    require_uppercase = true
    temporary_password_validity_days = 7
  }

  # MFA configuration
  mfa_configuration = "OPTIONAL"

  software_token_mfa_configuration {
    enabled = true
  }

  # Advanced security mode
  user_pool_add_ons {
    advanced_security_mode = "ENFORCED"
  }

  # Account recovery
  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
    recovery_mechanism {
      name     = "verified_phone_number"
      priority = 2
    }
  }

  # User attributes
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

  schema {
    name                = "phone_number"
    attribute_data_type = "String"
    required            = false
    mutable             = true
  }

  # Custom attributes for health data
  schema {
    name                = "date_of_birth"
    attribute_data_type = "String"
    required            = false
    mutable             = true
  }

  schema {
    name                = "gender"
    attribute_data_type = "String"
    required            = false
    mutable             = true
  }

  # Verification settings
  email_verification_message = "Your verification code is {####}"
  email_verification_subject = "CareBow Account Verification"
  
  sms_verification_message = "Your CareBow verification code is {####}"

  # Admin create user config
  admin_create_user_config {
    allow_admin_create_user_only = false
    invite_message_template {
      email_message = "Your CareBow account has been created. Your username is {username} and temporary password is {####}"
      email_subject = "Welcome to CareBow"
      sms_message   = "Your CareBow username is {username} and temporary password is {####}"
    }
  }

  # Device configuration
  device_configuration {
    challenge_required_on_new_device      = true
    device_only_remembered_on_user_prompt = false
  }

  # Email configuration
  email_configuration {
    email_sending_account = "COGNITO_DEFAULT"
  }

  # Lambda triggers for custom logic
  lambda_config {
    pre_sign_up = var.pre_sign_up_lambda_arn
    post_confirmation = var.post_confirmation_lambda_arn
    pre_authentication = var.pre_authentication_lambda_arn
    post_authentication = var.post_authentication_lambda_arn
  }

  # User pool tags
  tags = {
    Name        = "${var.project_name}-user-pool-${var.environment}"
    Environment = var.environment
    Purpose     = "CareBow user authentication"
    HIPAA       = "true"
  }
}

# User Pool Domain
resource "aws_cognito_user_pool_domain" "main" {
  domain       = "${var.project_name}-${var.environment}-${random_string.domain_suffix.result}"
  user_pool_id = aws_cognito_user_pool.main.id
}

# User Pool Client for API
resource "aws_cognito_user_pool_client" "api_client" {
  name         = "${var.project_name}-api-client-${var.environment}"
  user_pool_id = aws_cognito_user_pool.main.id

  generate_secret                      = true
  prevent_user_existence_errors        = "ENABLED"
  enable_token_revocation             = true
  enable_propagate_additional_user_context_data = true

  # Token validity
  token_validity_units {
    access_token  = "hours"
    id_token      = "hours"
    refresh_token = "days"
  }

  access_token_validity  = 1
  id_token_validity      = 1
  refresh_token_validity = 30

  # Explicit auth flows
  explicit_auth_flows = [
    "ALLOW_USER_SRP_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_ADMIN_USER_PASSWORD_AUTH"
  ]

  # Supported identity providers
  supported_identity_providers = ["COGNITO"]

  # Read and write attributes
  read_attributes = [
    "email",
    "email_verified",
    "given_name",
    "family_name",
    "phone_number",
    "phone_number_verified",
    "custom:date_of_birth",
    "custom:gender"
  ]

  write_attributes = [
    "email",
    "given_name",
    "family_name",
    "phone_number",
    "custom:date_of_birth",
    "custom:gender"
  ]

  # Callback URLs
  callback_urls = var.callback_urls
  logout_urls   = var.logout_urls

  # OAuth configuration
  allowed_oauth_flows = ["code", "implicit"]
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_scopes = [
    "email",
    "openid",
    "profile",
    "aws.cognito.signin.user.admin"
  ]

  # Prevent user existence errors
  prevent_user_existence_errors = "ENABLED"

  tags = {
    Name        = "${var.project_name}-api-client-${var.environment}"
    Environment = var.environment
    Purpose     = "API authentication"
  }
}

# User Pool Client for Web App
resource "aws_cognito_user_pool_client" "web_client" {
  name         = "${var.project_name}-web-client-${var.environment}"
  user_pool_id = aws_cognito_user_pool.main.id

  generate_secret                      = false
  prevent_user_existence_errors        = "ENABLED"
  enable_token_revocation             = true
  enable_propagate_additional_user_context_data = true

  # Token validity
  token_validity_units {
    access_token  = "hours"
    id_token      = "hours"
    refresh_token = "days"
  }

  access_token_validity  = 1
  id_token_validity      = 1
  refresh_token_validity = 30

  # Explicit auth flows
  explicit_auth_flows = [
    "ALLOW_USER_SRP_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH"
  ]

  # Supported identity providers
  supported_identity_providers = ["COGNITO"]

  # Read and write attributes
  read_attributes = [
    "email",
    "email_verified",
    "given_name",
    "family_name",
    "phone_number",
    "phone_number_verified",
    "custom:date_of_birth",
    "custom:gender"
  ]

  write_attributes = [
    "email",
    "given_name",
    "family_name",
    "phone_number",
    "custom:date_of_birth",
    "custom:gender"
  ]

  # Callback URLs
  callback_urls = var.callback_urls
  logout_urls   = var.logout_urls

  # OAuth configuration
  allowed_oauth_flows = ["code", "implicit"]
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_scopes = [
    "email",
    "openid",
    "profile",
    "aws.cognito.signin.user.admin"
  ]

  tags = {
    Name        = "${var.project_name}-web-client-${var.environment}"
    Environment = var.environment
    Purpose     = "Web application authentication"
  }
}

# User Pool Client for Mobile App
resource "aws_cognito_user_pool_client" "mobile_client" {
  name         = "${var.project_name}-mobile-client-${var.environment}"
  user_pool_id = aws_cognito_user_pool.main.id

  generate_secret                      = false
  prevent_user_existence_errors        = "ENABLED"
  enable_token_revocation             = true
  enable_propagate_additional_user_context_data = true

  # Token validity
  token_validity_units {
    access_token  = "hours"
    id_token      = "hours"
    refresh_token = "days"
  }

  access_token_validity  = 24
  id_token_validity      = 24
  refresh_token_validity = 30

  # Explicit auth flows
  explicit_auth_flows = [
    "ALLOW_USER_SRP_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_PASSWORD_AUTH"
  ]

  # Supported identity providers
  supported_identity_providers = ["COGNITO"]

  # Read and write attributes
  read_attributes = [
    "email",
    "email_verified",
    "given_name",
    "family_name",
    "phone_number",
    "phone_number_verified",
    "custom:date_of_birth",
    "custom:gender"
  ]

  write_attributes = [
    "email",
    "given_name",
    "family_name",
    "phone_number",
    "custom:date_of_birth",
    "custom:gender"
  ]

  # OAuth configuration
  allowed_oauth_flows = ["code"]
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_scopes = [
    "email",
    "openid",
    "profile",
    "aws.cognito.signin.user.admin"
  ]

  tags = {
    Name        = "${var.project_name}-mobile-client-${var.environment}"
    Environment = var.environment
    Purpose     = "Mobile application authentication"
  }
}

# Identity Pool for AWS resource access
resource "aws_cognito_identity_pool" "main" {
  identity_pool_name               = "${var.project_name}-identity-pool-${var.environment}"
  allow_unauthenticated_identities = false

  cognito_identity_providers {
    client_id               = aws_cognito_user_pool_client.api_client.id
    provider_name           = aws_cognito_user_pool.main.endpoint
    server_side_token_check = true
  }

  cognito_identity_providers {
    client_id               = aws_cognito_user_pool_client.web_client.id
    provider_name           = aws_cognito_user_pool.main.endpoint
    server_side_token_check = true
  }

  cognito_identity_providers {
    client_id               = aws_cognito_user_pool_client.mobile_client.id
    provider_name           = aws_cognito_user_pool.main.endpoint
    server_side_token_check = true
  }

  tags = {
    Name        = "${var.project_name}-identity-pool-${var.environment}"
    Environment = var.environment
    Purpose     = "AWS resource access"
  }
}

# IAM Role for authenticated users
resource "aws_iam_role" "authenticated" {
  name = "${var.project_name}-cognito-authenticated-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = "cognito-identity.amazonaws.com"
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "cognito-identity.amazonaws.com:aud" = aws_cognito_identity_pool.main.id
          }
          "ForAnyValue:StringLike" = {
            "cognito-identity.amazonaws.com:amr" = "authenticated"
          }
        }
      }
    ]
  })

  tags = {
    Name        = "${var.project_name}-cognito-authenticated-${var.environment}"
    Environment = var.environment
  }
}

# IAM Role for unauthenticated users
resource "aws_iam_role" "unauthenticated" {
  name = "${var.project_name}-cognito-unauthenticated-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = "cognito-identity.amazonaws.com"
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "cognito-identity.amazonaws.com:aud" = aws_cognito_identity_pool.main.id
          }
          "ForAnyValue:StringLike" = {
            "cognito-identity.amazonaws.com:amr" = "unauthenticated"
          }
        }
      }
    ]
  })

  tags = {
    Name        = "${var.project_name}-cognito-unauthenticated-${var.environment}"
    Environment = var.environment
  }
}

# Identity Pool Role Attachment
resource "aws_cognito_identity_pool_roles_attachment" "main" {
  identity_pool_id = aws_cognito_identity_pool.main.id

  roles = {
    authenticated   = aws_iam_role.authenticated.arn
    unauthenticated = aws_iam_role.unauthenticated.arn
  }
}

# Random string for domain suffix
resource "random_string" "domain_suffix" {
  length  = 8
  special = false
  upper   = false
}
