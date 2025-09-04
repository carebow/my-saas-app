#!/bin/bash
echo "🔗 Starting SSM port forward to RDS..."
echo "This will forward local port 5433 to RDS port 5432"
echo "Keep this terminal open while using the database connection"
echo ""
aws ssm start-session \
    --target i-0f384a29c10309e76 \
    --document-name AWS-StartPortForwardingSessionToRemoteHost \
    --parameters '{"host":["carebow-db.ccjcseo46asa.us-east-1.rds.amazonaws.com"],"portNumber":["5432"],"localPortNumber":["5433"]}' \
    --region us-east-1
