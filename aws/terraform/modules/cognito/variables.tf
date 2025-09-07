# Cognito Module Variables

variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
}

variable "callback_urls" {
  description = "List of callback URLs for OAuth"
  type        = list(string)
  default     = ["http://localhost:3000", "https://localhost:3000"]
}

variable "logout_urls" {
  description = "List of logout URLs for OAuth"
  type        = list(string)
  default     = ["http://localhost:3000", "https://localhost:3000"]
}

variable "pre_sign_up_lambda_arn" {
  description = "ARN of the pre-sign-up Lambda function"
  type        = string
  default     = null
}

variable "post_confirmation_lambda_arn" {
  description = "ARN of the post-confirmation Lambda function"
  type        = string
  default     = null
}

variable "pre_authentication_lambda_arn" {
  description = "ARN of the pre-authentication Lambda function"
  type        = string
  default     = null
}

variable "post_authentication_lambda_arn" {
  description = "ARN of the post-authentication Lambda function"
  type        = string
  default     = null
}

variable "tags" {
  description = "Additional tags to apply to resources"
  type        = map(string)
  default     = {}
}
