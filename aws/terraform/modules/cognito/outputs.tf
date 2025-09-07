# Cognito Module Outputs

output "user_pool_id" {
  description = "ID of the Cognito User Pool"
  value       = aws_cognito_user_pool.main.id
}

output "user_pool_arn" {
  description = "ARN of the Cognito User Pool"
  value       = aws_cognito_user_pool.main.arn
}

output "user_pool_domain" {
  description = "Domain of the Cognito User Pool"
  value       = aws_cognito_user_pool_domain.main.domain
}

output "user_pool_endpoint" {
  description = "Endpoint of the Cognito User Pool"
  value       = aws_cognito_user_pool.main.endpoint
}

output "api_client_id" {
  description = "ID of the API client"
  value       = aws_cognito_user_pool_client.api_client.id
}

output "api_client_secret" {
  description = "Secret of the API client"
  value       = aws_cognito_user_pool_client.api_client.client_secret
  sensitive   = true
}

output "web_client_id" {
  description = "ID of the web client"
  value       = aws_cognito_user_pool_client.web_client.id
}

output "mobile_client_id" {
  description = "ID of the mobile client"
  value       = aws_cognito_user_pool_client.mobile_client.id
}

output "identity_pool_id" {
  description = "ID of the Cognito Identity Pool"
  value       = aws_cognito_identity_pool.main.id
}

output "identity_pool_arn" {
  description = "ARN of the Cognito Identity Pool"
  value       = aws_cognito_identity_pool.main.arn
}

output "authenticated_role_arn" {
  description = "ARN of the authenticated role"
  value       = aws_iam_role.authenticated.arn
}

output "unauthenticated_role_arn" {
  description = "ARN of the unauthenticated role"
  value       = aws_iam_role.unauthenticated.arn
}

output "cognito_config" {
  description = "Cognito configuration for frontend"
  value = {
    region          = data.aws_region.current.name
    userPoolId      = aws_cognito_user_pool.main.id
    userPoolWebClientId = aws_cognito_user_pool_client.web_client.id
    identityPoolId  = aws_cognito_identity_pool.main.id
    domain          = aws_cognito_user_pool_domain.main.domain
  }
}
