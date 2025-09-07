# Step Functions Module Outputs

output "data_export_state_machine_arn" {
  description = "ARN of the data export state machine"
  value       = aws_sfn_state_machine.data_export.arn
}

output "data_export_state_machine_name" {
  description = "Name of the data export state machine"
  value       = aws_sfn_state_machine.data_export.name
}

output "data_deletion_state_machine_arn" {
  description = "ARN of the data deletion state machine"
  value       = aws_sfn_state_machine.data_deletion.arn
}

output "data_deletion_state_machine_name" {
  description = "Name of the data deletion state machine"
  value       = aws_sfn_state_machine.data_deletion.name
}

output "step_functions_role_arn" {
  description = "ARN of the Step Functions execution role"
  value       = aws_iam_role.step_functions_role.arn
}

output "cloudwatch_log_group_arn" {
  description = "ARN of the CloudWatch log group"
  value       = aws_cloudwatch_log_group.step_functions.arn
}
