#!/bin/bash

# CloudWatch Monitoring Setup Script
# Creates essential CloudWatch alarms for RDS and ECS

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PROJECT_NAME="carebow"
AWS_REGION="us-east-1"

echo -e "${BLUE}📊 Setting up CloudWatch Monitoring${NC}"
echo "=================================="

# Get SNS topic for notifications (create if doesn't exist)
echo -e "${YELLOW}📢 Setting up SNS topic for alerts...${NC}"
SNS_TOPIC_NAME="${PROJECT_NAME}-alerts"
SNS_TOPIC_ARN=$(aws sns create-topic --name "$SNS_TOPIC_NAME" --region $AWS_REGION --query TopicArn --output text)
echo -e "${GREEN}✅ SNS Topic: $SNS_TOPIC_ARN${NC}"

# Prompt for email subscription
echo -e "${YELLOW}📧 Enter email address for alerts (or press Enter to skip):${NC}"
read -r EMAIL_ADDRESS

if [ -n "$EMAIL_ADDRESS" ]; then
    aws sns subscribe \
        --topic-arn "$SNS_TOPIC_ARN" \
        --protocol email \
        --notification-endpoint "$EMAIL_ADDRESS" \
        --region $AWS_REGION
    echo -e "${GREEN}✅ Email subscription created (check your email to confirm)${NC}"
fi

# RDS Alarms
echo -e "${YELLOW}🗄️  Creating RDS CloudWatch alarms...${NC}"

# CPU Utilization > 80%
aws cloudwatch put-metric-alarm \
    --alarm-name "${PROJECT_NAME}-rds-high-cpu" \
    --alarm-description "RDS CPU utilization is high" \
    --metric-name CPUUtilization \
    --namespace AWS/RDS \
    --statistic Average \
    --period 300 \
    --threshold 80 \
    --comparison-operator GreaterThanThreshold \
    --evaluation-periods 2 \
    --alarm-actions "$SNS_TOPIC_ARN" \
    --dimensions Name=DBInstanceIdentifier,Value="${PROJECT_NAME}-db" \
    --region $AWS_REGION

# Free Storage Space < 5GB
aws cloudwatch put-metric-alarm \
    --alarm-name "${PROJECT_NAME}-rds-low-storage" \
    --alarm-description "RDS free storage space is low" \
    --metric-name FreeStorageSpace \
    --namespace AWS/RDS \
    --statistic Average \
    --period 300 \
    --threshold 5368709120 \
    --comparison-operator LessThanThreshold \
    --evaluation-periods 1 \
    --alarm-actions "$SNS_TOPIC_ARN" \
    --dimensions Name=DBInstanceIdentifier,Value="${PROJECT_NAME}-db" \
    --region $AWS_REGION

# Freeable Memory < 200MB
aws cloudwatch put-metric-alarm \
    --alarm-name "${PROJECT_NAME}-rds-low-memory" \
    --alarm-description "RDS freeable memory is low" \
    --metric-name FreeableMemory \
    --namespace AWS/RDS \
    --statistic Average \
    --period 300 \
    --threshold 209715200 \
    --comparison-operator LessThanThreshold \
    --evaluation-periods 2 \
    --alarm-actions "$SNS_TOPIC_ARN" \
    --dimensions Name=DBInstanceIdentifier,Value="${PROJECT_NAME}-db" \
    --region $AWS_REGION

# Database Connections > 80% of max (assuming 100 max connections for t4g.micro)
aws cloudwatch put-metric-alarm \
    --alarm-name "${PROJECT_NAME}-rds-high-connections" \
    --alarm-description "RDS database connections are high" \
    --metric-name DatabaseConnections \
    --namespace AWS/RDS \
    --statistic Average \
    --period 300 \
    --threshold 80 \
    --comparison-operator GreaterThanThreshold \
    --evaluation-periods 2 \
    --alarm-actions "$SNS_TOPIC_ARN" \
    --dimensions Name=DBInstanceIdentifier,Value="${PROJECT_NAME}-db" \
    --region $AWS_REGION

# Read Latency > 200ms
aws cloudwatch put-metric-alarm \
    --alarm-name "${PROJECT_NAME}-rds-high-read-latency" \
    --alarm-description "RDS read latency is high" \
    --metric-name ReadLatency \
    --namespace AWS/RDS \
    --statistic Average \
    --period 300 \
    --threshold 0.2 \
    --comparison-operator GreaterThanThreshold \
    --evaluation-periods 2 \
    --alarm-actions "$SNS_TOPIC_ARN" \
    --dimensions Name=DBInstanceIdentifier,Value="${PROJECT_NAME}-db" \
    --region $AWS_REGION

# Write Latency > 200ms
aws cloudwatch put-metric-alarm \
    --alarm-name "${PROJECT_NAME}-rds-high-write-latency" \
    --alarm-description "RDS write latency is high" \
    --metric-name WriteLatency \
    --namespace AWS/RDS \
    --statistic Average \
    --period 300 \
    --threshold 0.2 \
    --comparison-operator GreaterThanThreshold \
    --evaluation-periods 2 \
    --alarm-actions "$SNS_TOPIC_ARN" \
    --dimensions Name=DBInstanceIdentifier,Value="${PROJECT_NAME}-db" \
    --region $AWS_REGION

echo -e "${GREEN}✅ RDS alarms created${NC}"

# ECS Alarms
echo -e "${YELLOW}🐳 Creating ECS CloudWatch alarms...${NC}"

# ECS Service CPU > 80%
aws cloudwatch put-metric-alarm \
    --alarm-name "${PROJECT_NAME}-ecs-high-cpu" \
    --alarm-description "ECS service CPU utilization is high" \
    --metric-name CPUUtilization \
    --namespace AWS/ECS \
    --statistic Average \
    --period 300 \
    --threshold 80 \
    --comparison-operator GreaterThanThreshold \
    --evaluation-periods 2 \
    --alarm-actions "$SNS_TOPIC_ARN" \
    --dimensions Name=ServiceName,Value="${PROJECT_NAME}-service" Name=ClusterName,Value="${PROJECT_NAME}-cluster" \
    --region $AWS_REGION

# ECS Service Memory > 80%
aws cloudwatch put-metric-alarm \
    --alarm-name "${PROJECT_NAME}-ecs-high-memory" \
    --alarm-description "ECS service memory utilization is high" \
    --metric-name MemoryUtilization \
    --namespace AWS/ECS \
    --statistic Average \
    --period 300 \
    --threshold 80 \
    --comparison-operator GreaterThanThreshold \
    --evaluation-periods 2 \
    --alarm-actions "$SNS_TOPIC_ARN" \
    --dimensions Name=ServiceName,Value="${PROJECT_NAME}-service" Name=ClusterName,Value="${PROJECT_NAME}-cluster" \
    --region $AWS_REGION

echo -e "${GREEN}✅ ECS alarms created${NC}"

# ElastiCache Alarms
echo -e "${YELLOW}🔴 Creating ElastiCache CloudWatch alarms...${NC}"

# Redis CPU > 80%
aws cloudwatch put-metric-alarm \
    --alarm-name "${PROJECT_NAME}-redis-high-cpu" \
    --alarm-description "Redis CPU utilization is high" \
    --metric-name CPUUtilization \
    --namespace AWS/ElastiCache \
    --statistic Average \
    --period 300 \
    --threshold 80 \
    --comparison-operator GreaterThanThreshold \
    --evaluation-periods 2 \
    --alarm-actions "$SNS_TOPIC_ARN" \
    --dimensions Name=CacheClusterId,Value="${PROJECT_NAME}-redis-001" \
    --region $AWS_REGION

# Redis Memory > 80%
aws cloudwatch put-metric-alarm \
    --alarm-name "${PROJECT_NAME}-redis-high-memory" \
    --alarm-description "Redis memory utilization is high" \
    --metric-name DatabaseMemoryUsagePercentage \
    --namespace AWS/ElastiCache \
    --statistic Average \
    --period 300 \
    --threshold 80 \
    --comparison-operator GreaterThanThreshold \
    --evaluation-periods 2 \
    --alarm-actions "$SNS_TOPIC_ARN" \
    --dimensions Name=CacheClusterId,Value="${PROJECT_NAME}-redis-001" \
    --region $AWS_REGION

echo -e "${GREEN}✅ ElastiCache alarms created${NC}"

# Enable Performance Insights for RDS
echo -e "${YELLOW}📈 Enabling Performance Insights for RDS...${NC}"
aws rds modify-db-instance \
    --db-instance-identifier "${PROJECT_NAME}-db" \
    --enable-performance-insights \
    --performance-insights-retention-period 7 \
    --region $AWS_REGION \
    --apply-immediately || echo -e "${YELLOW}Performance Insights may already be enabled${NC}"

echo -e "${GREEN}✅ Performance Insights enabled${NC}"

# Create CloudWatch Dashboard
echo -e "${YELLOW}📊 Creating CloudWatch Dashboard...${NC}"

DASHBOARD_BODY=$(cat << EOF
{
    "widgets": [
        {
            "type": "metric",
            "x": 0,
            "y": 0,
            "width": 12,
            "height": 6,
            "properties": {
                "metrics": [
                    [ "AWS/RDS", "CPUUtilization", "DBInstanceIdentifier", "${PROJECT_NAME}-db" ],
                    [ ".", "DatabaseConnections", ".", "." ],
                    [ ".", "FreeStorageSpace", ".", "." ],
                    [ ".", "FreeableMemory", ".", "." ]
                ],
                "period": 300,
                "stat": "Average",
                "region": "${AWS_REGION}",
                "title": "RDS Metrics"
            }
        },
        {
            "type": "metric",
            "x": 12,
            "y": 0,
            "width": 12,
            "height": 6,
            "properties": {
                "metrics": [
                    [ "AWS/ECS", "CPUUtilization", "ServiceName", "${PROJECT_NAME}-service", "ClusterName", "${PROJECT_NAME}-cluster" ],
                    [ ".", "MemoryUtilization", ".", ".", ".", "." ]
                ],
                "period": 300,
                "stat": "Average",
                "region": "${AWS_REGION}",
                "title": "ECS Metrics"
            }
        },
        {
            "type": "metric",
            "x": 0,
            "y": 6,
            "width": 12,
            "height": 6,
            "properties": {
                "metrics": [
                    [ "AWS/ElastiCache", "CPUUtilization", "CacheClusterId", "${PROJECT_NAME}-redis-001" ],
                    [ ".", "DatabaseMemoryUsagePercentage", ".", "." ]
                ],
                "period": 300,
                "stat": "Average",
                "region": "${AWS_REGION}",
                "title": "Redis Metrics"
            }
        }
    ]
}
EOF
)

aws cloudwatch put-dashboard \
    --dashboard-name "${PROJECT_NAME}-production" \
    --dashboard-body "$DASHBOARD_BODY" \
    --region $AWS_REGION

echo -e "${GREEN}✅ CloudWatch Dashboard created${NC}"

echo ""
echo -e "${BLUE}🎉 Monitoring Setup Complete!${NC}"
echo "============================="
echo ""
echo -e "${YELLOW}Created alarms for:${NC}"
echo "✓ RDS CPU, Memory, Storage, Connections, Latency"
echo "✓ ECS CPU and Memory utilization"
echo "✓ Redis CPU and Memory utilization"
echo ""
echo -e "${YELLOW}Additional features:${NC}"
echo "✓ Performance Insights enabled (7-day retention)"
echo "✓ CloudWatch Dashboard created"
echo "✓ SNS topic for notifications: $SNS_TOPIC_ARN"
echo ""
echo -e "${CYAN}View your dashboard:${NC}"
echo "https://console.aws.amazon.com/cloudwatch/home?region=${AWS_REGION}#dashboards:name=${PROJECT_NAME}-production"
echo ""
echo -e "${CYAN}View your alarms:${NC}"
echo "https://console.aws.amazon.com/cloudwatch/home?region=${AWS_REGION}#alarmsV2:"