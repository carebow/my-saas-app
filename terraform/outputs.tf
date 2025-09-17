output "alb_dns_name" {
  value = module.alb.lb_dns_name
}

output "db_endpoint" {
  value = module.db.db_instance_address
}

output "reports_bucket" {
  value = aws_s3_bucket.reports.bucket
}
