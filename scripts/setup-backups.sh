#!/bin/bash

# Backup and Maintenance Setup Script
# Configures RDS backups, snapshots, and maintenance windows

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PROJECT_NAME="carebow"
AWS_REGION="us-east-1"

echo -e "${BLUE}💾 Setting up Backups and Maintenance${NC}"
echo "===================================="

# Get RDS instance details
echo -e "${YELLOW}📡 Getting RDS instance details...${NC}"
RDS_DETAILS=$(aws rds describe-db-instances \
    --db-instance-identifier "${PROJECT_NAME}-db" \
    --region $AWS_REGION)

CURRENT_BACKUP_RETENTION=$(echo "$RDS_DETAILS" | jq -r '.DBInstances[0].BackupRetentionPeriod')
CURRENT_MAINTENANCE_WINDOW=$(echo "$RDS_DETAILS" | jq -r '.DBInstances[0].PreferredMaintenanceWindow')
CURRENT_BACKUP_WINDOW=$(echo "$RDS_DETAILS" | jq -r '.DBInstances[0].PreferredBackupWindow')

echo -e "${GREEN}✅ Current backup retention: $CURRENT_BACKUP_RETENTION days${NC}"
echo -e "${GREEN}✅ Current maintenance window: $CURRENT_MAINTENANCE_WINDOW${NC}"
echo -e "${GREEN}✅ Current backup window: $CURRENT_BACKUP_WINDOW${NC}"

# Create manual snapshot as baseline
echo -e "${YELLOW}📸 Creating baseline manual snapshot...${NC}"
SNAPSHOT_ID="${PROJECT_NAME}-baseline-$(date +%Y%m%d-%H%M%S)"

aws rds create-db-snapshot \
    --db-instance-identifier "${PROJECT_NAME}-db" \
    --db-snapshot-identifier "$SNAPSHOT_ID" \
    --region $AWS_REGION

echo -e "${GREEN}✅ Manual snapshot created: $SNAPSHOT_ID${NC}"

# Wait for snapshot to complete (optional)
echo -e "${YELLOW}⏳ Waiting for snapshot to complete (this may take a few minutes)...${NC}"
aws rds wait db-snapshot-completed \
    --db-snapshot-identifier "$SNAPSHOT_ID" \
    --region $AWS_REGION

echo -e "${GREEN}✅ Baseline snapshot completed${NC}"

# Configure backup settings if needed
if [ "$CURRENT_BACKUP_RETENTION" -lt 7 ]; then
    echo -e "${YELLOW}📝 Updating backup retention to 7 days...${NC}"
    aws rds modify-db-instance \
        --db-instance-identifier "${PROJECT_NAME}-db" \
        --backup-retention-period 7 \
        --apply-immediately \
        --region $AWS_REGION
    echo -e "${GREEN}✅ Backup retention updated to 7 days${NC}"
fi

# Enable Performance Insights if not already enabled
echo -e "${YELLOW}📈 Checking Performance Insights status...${NC}"
PERF_INSIGHTS=$(echo "$RDS_DETAILS" | jq -r '.DBInstances[0].PerformanceInsightsEnabled')

if [ "$PERF_INSIGHTS" = "false" ]; then
    echo -e "${YELLOW}📈 Enabling Performance Insights...${NC}"
    aws rds modify-db-instance \
        --db-instance-identifier "${PROJECT_NAME}-db" \
        --enable-performance-insights \
        --performance-insights-retention-period 7 \
        --apply-immediately \
        --region $AWS_REGION
    echo -e "${GREEN}✅ Performance Insights enabled${NC}"
else
    echo -e "${GREEN}✅ Performance Insights already enabled${NC}"
fi

# Create backup monitoring Lambda function
echo -e "${YELLOW}🔧 Creating backup monitoring function...${NC}"

# Create Lambda function code
cat > /tmp/backup-monitor.py << 'EOF'
import json
import boto3
import datetime
from botocore.exceptions import ClientError

def lambda_handler(event, context):
    rds = boto3.client('rds')
    sns = boto3.client('sns')
    
    # Configuration
    db_instance_id = 'carebow-db'
    sns_topic_arn = 'arn:aws:sns:us-east-1:ACCOUNT_ID:carebow-alerts'
    
    try:
        # Check recent backups
        response = rds.describe_db_snapshots(
            DBInstanceIdentifier=db_instance_id,
            SnapshotType='automated',
            MaxRecords=5
        )
        
        snapshots = response['DBSnapshots']
        
        if not snapshots:
            message = f"No automated backups found for {db_instance_id}"
            sns.publish(TopicArn=sns_topic_arn, Message=message, Subject="RDS Backup Alert")
            return {'statusCode': 200, 'body': message}
        
        # Check if latest backup is recent (within 25 hours)
        latest_snapshot = max(snapshots, key=lambda x: x['SnapshotCreateTime'])
        snapshot_age = datetime.datetime.now(datetime.timezone.utc) - latest_snapshot['SnapshotCreateTime']
        
        if snapshot_age.total_seconds() > 25 * 3600:  # 25 hours
            message = f"Latest backup for {db_instance_id} is {snapshot_age.days} days old"
            sns.publish(TopicArn=sns_topic_arn, Message=message, Subject="RDS Backup Alert")
        
        return {
            'statusCode': 200,
            'body': json.dumps({
                'latest_backup': latest_snapshot['SnapshotCreateTime'].isoformat(),
                'backup_age_hours': snapshot_age.total_seconds() / 3600
            })
        }
        
    except ClientError as e:
        error_message = f"Error checking backups for {db_instance_id}: {str(e)}"
        sns.publish(TopicArn=sns_topic_arn, Message=error_message, Subject="RDS Backup Monitor Error")
        return {'statusCode': 500, 'body': error_message}
EOF

# Get account ID for SNS topic ARN
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
sed -i.bak "s/ACCOUNT_ID/$ACCOUNT_ID/g" /tmp/backup-monitor.py

# Create Lambda deployment package
cd /tmp
zip backup-monitor.zip backup-monitor.py

# Create IAM role for Lambda
LAMBDA_ROLE_NAME="${PROJECT_NAME}-backup-monitor-role"

# Check if role exists
if ! aws iam get-role --role-name "$LAMBDA_ROLE_NAME" >/dev/null 2>&1; then
    echo -e "${YELLOW}👤 Creating Lambda IAM role...${NC}"
    
    # Trust policy for Lambda
    cat > lambda-trust-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Service": "lambda.amazonaws.com"
            },
            "Action": "sts:AssumeRole"
        }
    ]
}
EOF

    aws iam create-role \
        --role-name "$LAMBDA_ROLE_NAME" \
        --assume-role-policy-document file://lambda-trust-policy.json

    # Attach basic Lambda execution policy
    aws iam attach-role-policy \
        --role-name "$LAMBDA_ROLE_NAME" \
        --policy-arn "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"

    # Create custom policy for RDS and SNS access
    cat > lambda-permissions-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "rds:DescribeDBSnapshots",
                "rds:DescribeDBInstances"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "sns:Publish"
            ],
            "Resource": "arn:aws:sns:${AWS_REGION}:${ACCOUNT_ID}:${PROJECT_NAME}-alerts"
        }
    ]
}
EOF

    aws iam create-policy \
        --policy-name "${PROJECT_NAME}-backup-monitor-policy" \
        --policy-document file://lambda-permissions-policy.json

    aws iam attach-role-policy \
        --role-name "$LAMBDA_ROLE_NAME" \
        --policy-arn "arn:aws:iam::${ACCOUNT_ID}:policy/${PROJECT_NAME}-backup-monitor-policy"

    echo -e "${GREEN}✅ Lambda IAM role created${NC}"
fi

# Create Lambda function
LAMBDA_ROLE_ARN="arn:aws:iam::${ACCOUNT_ID}:role/${LAMBDA_ROLE_NAME}"

if aws lambda get-function --function-name "${PROJECT_NAME}-backup-monitor" --region $AWS_REGION >/dev/null 2>&1; then
    echo -e "${YELLOW}📝 Updating existing Lambda function...${NC}"
    aws lambda update-function-code \
        --function-name "${PROJECT_NAME}-backup-monitor" \
        --zip-file fileb://backup-monitor.zip \
        --region $AWS_REGION
else
    echo -e "${YELLOW}🆕 Creating Lambda function...${NC}"
    aws lambda create-function \
        --function-name "${PROJECT_NAME}-backup-monitor" \
        --runtime python3.9 \
        --role "$LAMBDA_ROLE_ARN" \
        --handler backup-monitor.lambda_handler \
        --zip-file fileb://backup-monitor.zip \
        --description "Monitors RDS backups for ${PROJECT_NAME}" \
        --timeout 60 \
        --region $AWS_REGION
fi

echo -e "${GREEN}✅ Backup monitor Lambda function created${NC}"

# Create EventBridge rule to run daily
echo -e "${YELLOW}⏰ Setting up daily backup check...${NC}"

# Create EventBridge rule
aws events put-rule \
    --name "${PROJECT_NAME}-daily-backup-check" \
    --schedule-expression "cron(0 8 * * ? *)" \
    --description "Daily backup check for ${PROJECT_NAME}" \
    --region $AWS_REGION

# Add Lambda as target
aws events put-targets \
    --rule "${PROJECT_NAME}-daily-backup-check" \
    --targets "Id"="1","Arn"="arn:aws:lambda:${AWS_REGION}:${ACCOUNT_ID}:function:${PROJECT_NAME}-backup-monitor" \
    --region $AWS_REGION

# Give EventBridge permission to invoke Lambda
aws lambda add-permission \
    --function-name "${PROJECT_NAME}-backup-monitor" \
    --statement-id "${PROJECT_NAME}-backup-check-permission" \
    --action lambda:InvokeFunction \
    --principal events.amazonaws.com \
    --source-arn "arn:aws:events:${AWS_REGION}:${ACCOUNT_ID}:rule/${PROJECT_NAME}-daily-backup-check" \
    --region $AWS_REGION 2>/dev/null || echo -e "${YELLOW}Permission may already exist${NC}"

echo -e "${GREEN}✅ Daily backup monitoring scheduled${NC}"

# Clean up temporary files
rm -f /tmp/backup-monitor.py /tmp/backup-monitor.zip /tmp/lambda-trust-policy.json /tmp/lambda-permissions-policy.json

# Create backup management script
echo -e "${YELLOW}📜 Creating backup management script...${NC}"
cat > scripts/manage-backups.sh << EOF
#!/bin/bash

# Backup Management Script
# Manage RDS snapshots and backups

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PROJECT_NAME="carebow"
AWS_REGION="us-east-1"

case "\$1" in
    "list")
        echo -e "\${BLUE}📋 Listing all snapshots for ${PROJECT_NAME}-db\${NC}"
        aws rds describe-db-snapshots \\
            --db-instance-identifier "${PROJECT_NAME}-db" \\
            --query 'DBSnapshots[*].[DBSnapshotIdentifier,SnapshotCreateTime,Status,SnapshotType]' \\
            --output table \\
            --region $AWS_REGION
        ;;
    "create")
        SNAPSHOT_ID="${PROJECT_NAME}-manual-\$(date +%Y%m%d-%H%M%S)"
        echo -e "\${YELLOW}📸 Creating manual snapshot: \$SNAPSHOT_ID\${NC}"
        aws rds create-db-snapshot \\
            --db-instance-identifier "${PROJECT_NAME}-db" \\
            --db-snapshot-identifier "\$SNAPSHOT_ID" \\
            --region $AWS_REGION
        echo -e "\${GREEN}✅ Snapshot creation initiated\${NC}"
        ;;
    "restore")
        if [ -z "\$2" ]; then
            echo -e "\${RED}❌ Please provide snapshot identifier\${NC}"
            echo "Usage: \$0 restore <snapshot-id>"
            exit 1
        fi
        echo -e "\${YELLOW}⚠️  This will create a new RDS instance from snapshot \$2\${NC}"
        echo -e "\${YELLOW}❓ Continue? (y/N)\${NC}"
        read -r response
        if [[ "\$response" =~ ^[Yy]\$ ]]; then
            NEW_DB_ID="${PROJECT_NAME}-restored-\$(date +%Y%m%d-%H%M%S)"
            aws rds restore-db-instance-from-db-snapshot \\
                --db-instance-identifier "\$NEW_DB_ID" \\
                --db-snapshot-identifier "\$2" \\
                --region $AWS_REGION
            echo -e "\${GREEN}✅ Restore initiated. New instance: \$NEW_DB_ID\${NC}"
        fi
        ;;
    "cleanup")
        echo -e "\${YELLOW}🧹 Cleaning up old manual snapshots (keeping last 5)\${NC}"
        aws rds describe-db-snapshots \\
            --db-instance-identifier "${PROJECT_NAME}-db" \\
            --snapshot-type manual \\
            --query 'DBSnapshots[?starts_with(DBSnapshotIdentifier, \`${PROJECT_NAME}-manual-\`)].DBSnapshotIdentifier' \\
            --output text \\
            --region $AWS_REGION | tr '\t' '\n' | sort -r | tail -n +6 | while read snapshot; do
                if [ -n "\$snapshot" ]; then
                    echo "Deleting old snapshot: \$snapshot"
                    aws rds delete-db-snapshot \\
                        --db-snapshot-identifier "\$snapshot" \\
                        --region $AWS_REGION
                fi
            done
        echo -e "\${GREEN}✅ Cleanup completed\${NC}"
        ;;
    *)
        echo -e "\${BLUE}💾 Backup Management Script\${NC}"
        echo "=========================="
        echo ""
        echo "Usage: \$0 <command>"
        echo ""
        echo "Commands:"
        echo "  list     - List all snapshots"
        echo "  create   - Create manual snapshot"
        echo "  restore  - Restore from snapshot"
        echo "  cleanup  - Clean up old manual snapshots"
        echo ""
        echo "Examples:"
        echo "  \$0 list"
        echo "  \$0 create"
        echo "  \$0 restore ${PROJECT_NAME}-baseline-20240101-120000"
        echo "  \$0 cleanup"
        ;;
esac
EOF

chmod +x scripts/manage-backups.sh

echo ""
echo -e "${BLUE}🎉 Backup and Maintenance Setup Complete!${NC}"
echo "========================================"
echo ""
echo -e "${YELLOW}Backup configuration:${NC}"
echo "✓ Backup retention: 7 days"
echo "✓ Baseline snapshot created: $SNAPSHOT_ID"
echo "✓ Performance Insights enabled (7-day retention)"
echo "✓ Daily backup monitoring scheduled"
echo "✓ Maintenance window: $CURRENT_MAINTENANCE_WINDOW"
echo ""
echo -e "${YELLOW}Backup management:${NC}"
echo "• List snapshots: ./scripts/manage-backups.sh list"
echo "• Create snapshot: ./scripts/manage-backups.sh create"
echo "• Restore from snapshot: ./scripts/manage-backups.sh restore <snapshot-id>"
echo "• Cleanup old snapshots: ./scripts/manage-backups.sh cleanup"
echo ""
echo -e "${YELLOW}Monitoring:${NC}"
echo "• Daily backup checks run at 8:00 AM UTC"
echo "• Alerts sent to SNS topic: ${PROJECT_NAME}-alerts"
echo "• Performance Insights available in RDS console"
echo ""
echo -e "${CYAN}Next steps:${NC}"
echo "1. Test backup restoration in a non-production environment"
echo "2. Document your backup and recovery procedures"
echo "3. Set up regular backup testing schedule"
echo "4. Consider cross-region backup replication for disaster recovery"