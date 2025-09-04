# CareBow Production-Ready Scripts

This directory contains scripts to help you transition from "it works" to "production-ready" for your CareBow application.

## Quick Start

Run the master script to go through all steps:

```bash
./scripts/production-ready.sh
```

Or run in automatic mode (no prompts):

```bash
./scripts/production-ready.sh --auto
```

## Individual Scripts

### 1. Database Access Setup
```bash
./scripts/setup-database-tunnel.sh
```
- Sets up SSM tunnel for secure RDS access
- Creates `.pgpass` file for passwordless connections
- Generates helper scripts for database connections

### 2. Database Migration
```bash
./scripts/run-migrations.sh
```
- Runs Alembic migrations against RDS via SSM tunnel
- Tests database connection and extensions
- Creates health check table

### 3. Secrets Manager Integration
```bash
./scripts/setup-secrets-manager.sh
```
- Configures DATABASE_URL in AWS Secrets Manager
- Sets up ECS task role permissions
- Prepares secrets for ECS task definition

### 4. Security Lockdown
```bash
./scripts/lockdown-security.sh
```
- Removes public access from RDS security groups
- Ensures proper security group configurations
- Creates security audit report

### 5. Backup & Maintenance Setup
```bash
./scripts/setup-backups.sh
```
- Creates baseline RDS snapshot
- Sets up automated backup monitoring
- Enables Performance Insights
- Creates backup management tools

### 6. CloudWatch Monitoring
```bash
./scripts/setup-monitoring.sh
```
- Creates CloudWatch alarms for RDS, ECS, and Redis
- Sets up SNS notifications
- Creates monitoring dashboard

### 7. Analytics User Creation
```bash
./scripts/create-analytics-user.sh
```
- Creates read-only database user
- Stores credentials in Secrets Manager
- Sets up connection scripts for BI tools

## Helper Scripts (Generated)

After running the setup scripts, you'll have these helper scripts:

### Database Access
```bash
# Start SSM tunnel (keep running in one terminal)
./scripts/start-db-tunnel.sh

# Connect to database (in another terminal)
./scripts/connect-to-db.sh
```

### Analytics Access
```bash
# Connect as read-only analytics user
./scripts/connect-analytics.sh
```

### Backup Management
```bash
# List all snapshots
./scripts/manage-backups.sh list

# Create manual snapshot
./scripts/manage-backups.sh create

# Restore from snapshot
./scripts/manage-backups.sh restore <snapshot-id>

# Clean up old snapshots
./scripts/manage-backups.sh cleanup
```

## Prerequisites

Before running these scripts, ensure:

1. **AWS CLI configured**: `aws configure`
2. **Infrastructure deployed**: RDS instance `carebow-db` must exist
3. **Proper permissions**: Your AWS user needs RDS, EC2, Secrets Manager, and IAM permissions
4. **Project structure**: Run from project root directory

## What Gets Created

### AWS Resources
- **Secrets Manager**: `carebow-app-secrets`, `carebow-analytics-credentials`
- **CloudWatch Alarms**: CPU, memory, storage, and latency monitoring
- **CloudWatch Dashboard**: `carebow-production`
- **SNS Topic**: `carebow-alerts` for notifications
- **Lambda Function**: `carebow-backup-monitor` for daily backup checks
- **EventBridge Rule**: Daily backup monitoring schedule

### Database Objects
- **Extensions**: `uuid-ossp`, `pgcrypto`
- **User**: `analytics` (read-only)
- **Table**: `healthchecks` (for testing)

### Local Files
- **`.pgpass`**: Passwordless database connections
- **`security-audit-report.txt`**: Security configuration audit
- **Connection scripts**: Database and analytics access helpers

## Security Features

- ✅ RDS in private subnets only
- ✅ Security groups restricted to ECS and SSM access
- ✅ No public database access
- ✅ Secrets stored in AWS Secrets Manager
- ✅ Read-only analytics user with minimal permissions
- ✅ Automated security auditing

## Monitoring Features

- ✅ CloudWatch alarms for all critical metrics
- ✅ SNS notifications for alerts
- ✅ Performance Insights enabled
- ✅ Daily backup monitoring
- ✅ Centralized dashboard

## Cost Optimization

- ✅ SSM instance can be stopped when not needed (~$8/month savings)
- ✅ gp3 storage for better cost/performance
- ✅ Automated cleanup of old manual snapshots
- ✅ 7-day backup retention (configurable)

## Troubleshooting

### Common Issues

1. **"RDS instance not found"**
   - Ensure your Terraform infrastructure is deployed
   - Check the instance identifier matches `carebow-db`

2. **"SSM tunnel connection failed"**
   - Ensure SSM instance is running
   - Check security group allows SSM access
   - Verify Session Manager plugin is installed

3. **"Permission denied"**
   - Check AWS credentials: `aws sts get-caller-identity`
   - Ensure your user has necessary IAM permissions

4. **"Migration failed"**
   - Verify database connection via tunnel
   - Check Alembic configuration in `backend/alembic.ini`
   - Ensure DATABASE_URL is correctly formatted

### Getting Help

1. Check the security audit report: `security-audit-report.txt`
2. View CloudWatch logs for Lambda functions
3. Test database connectivity: `./scripts/connect-to-db.sh`
4. Review AWS CloudTrail for API call logs

## Best Practices

1. **Regular Backups**: Run `./scripts/manage-backups.sh create` before major changes
2. **Security Audits**: Review `security-audit-report.txt` monthly
3. **Monitoring**: Set up email notifications for CloudWatch alarms
4. **Testing**: Test backup restoration in non-production environment
5. **Documentation**: Keep operational runbooks updated

## Next Steps After Setup

1. Update ECS task definition to use Secrets Manager
2. Deploy application with new configuration
3. Test all endpoints and database connectivity
4. Set up CI/CD pipeline integration
5. Configure email notifications for alerts
6. Plan disaster recovery procedures
7. Schedule regular security and backup audits