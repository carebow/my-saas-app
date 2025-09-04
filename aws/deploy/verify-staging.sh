#!/bin/bash

# Carebow Staging Environment Validation Script
# Run this after deployment to verify everything is working

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
REGION="us-east-1"
CLUSTER_NAME="carebow-staging-cluster"
SERVICE_NAME="carebow-staging-service"
LOG_GROUP="/ecs/carebow-staging"
SECRET_NAME="carebow-staging-app-secrets"

# Results tracking
PASSED=0
FAILED=0

print_header() {
    echo -e "\n${YELLOW}=== $1 ===${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
    ((PASSED++))
}

print_failure() {
    echo -e "${RED}❌ $1${NC}"
    ((FAILED++))
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Check if required tools are installed
check_prerequisites() {
    print_header "Prerequisites Check"
    
    for cmd in aws terraform jq curl; do
        if command -v $cmd &> /dev/null; then
            print_success "$cmd is installed"
        else
            print_failure "$cmd is not installed"
            exit 1
        fi
    done
}

# 1. ECS Service & Task Health
check_ecs_health() {
    print_header "ECS Service & Task Health"
    
    # Check service status
    SERVICE_INFO=$(aws ecs describe-services \
        --cluster $CLUSTER_NAME \
        --services $SERVICE_NAME \
        --query 'services[0].{status:status,desired:desiredCount,running:runningCount}' \
        --region $REGION 2>/dev/null || echo "null")
    
    if [ "$SERVICE_INFO" = "null" ]; then
        print_failure "Could not retrieve service information"
        return
    fi
    
    STATUS=$(echo $SERVICE_INFO | jq -r '.status')
    DESIRED=$(echo $SERVICE_INFO | jq -r '.desired')
    RUNNING=$(echo $SERVICE_INFO | jq -r '.running')
    
    if [ "$STATUS" = "ACTIVE" ]; then
        print_success "Service status: $STATUS"
    else
        print_failure "Service status: $STATUS (expected ACTIVE)"
    fi
    
    if [ "$DESIRED" = "$RUNNING" ] && [ "$RUNNING" -gt 0 ]; then
        print_success "Task count: $RUNNING/$DESIRED running"
    else
        print_failure "Task count: $RUNNING/$DESIRED running (mismatch or zero)"
    fi
    
    # Check for recent task failures
    TASKS=$(aws ecs list-tasks --cluster $CLUSTER_NAME --service-name $SERVICE_NAME --region $REGION --query 'taskArns[0]' --output text 2>/dev/null || echo "None")
    
    if [ "$TASKS" != "None" ] && [ "$TASKS" != "null" ]; then
        TASK_STATUS=$(aws ecs describe-tasks --cluster $CLUSTER_NAME --tasks $TASKS --region $REGION --query 'tasks[0].lastStatus' --output text 2>/dev/null || echo "UNKNOWN")
        if [ "$TASK_STATUS" = "RUNNING" ]; then
            print_success "Latest task status: $TASK_STATUS"
        else
            print_failure "Latest task status: $TASK_STATUS"
        fi
    else
        print_failure "No tasks found for service"
    fi
}

# 2. Application Logs
check_logs() {
    print_header "Application Logs"
    
    # Get latest log stream
    LATEST_STREAM=$(aws logs describe-log-streams \
        --log-group-name $LOG_GROUP \
        --order-by LastEventTime --descending \
        --max-items 1 --region $REGION \
        --query 'logStreams[0].logStreamName' --output text 2>/dev/null || echo "None")
    
    if [ "$LATEST_STREAM" = "None" ] || [ "$LATEST_STREAM" = "null" ]; then
        print_failure "No log streams found"
        return
    fi
    
    print_success "Found log stream: $LATEST_STREAM"
    
    # Check recent logs for success indicators
    RECENT_LOGS=$(aws logs get-log-events \
        --log-group-name $LOG_GROUP \
        --log-stream-name $LATEST_STREAM \
        --limit 20 --region $REGION \
        --query 'events[].message' --output text 2>/dev/null || echo "")
    
    if echo "$RECENT_LOGS" | grep -q "Uvicorn running"; then
        print_success "FastAPI/Uvicorn started successfully"
    else
        print_warning "Could not find Uvicorn startup message in recent logs"
    fi
    
    if echo "$RECENT_LOGS" | grep -q -E "(ERROR|CRITICAL|Exception)"; then
        print_warning "Found error messages in recent logs"
    else
        print_success "No obvious errors in recent logs"
    fi
}

# 3. Application Reachability
check_application_reachability() {
    print_header "Application Reachability"
    
    # Get ALB DNS name from Terraform
    ALB_DNS=$(terraform output -raw alb_dns_name 2>/dev/null || echo "")
    
    if [ -z "$ALB_DNS" ]; then
        print_failure "Could not get ALB DNS name from Terraform"
        return
    fi
    
    print_success "ALB DNS: $ALB_DNS"
    
    # Test health endpoint
    if curl -s -f "http://$ALB_DNS/health" > /dev/null; then
        print_success "Health endpoint responding"
    else
        print_failure "Health endpoint not responding"
    fi
    
    # Test docs endpoint
    if curl -s -f "http://$ALB_DNS/docs" > /dev/null; then
        print_success "Docs endpoint responding"
    else
        print_failure "Docs endpoint not responding"
    fi
}

# 4. Database Connectivity
check_database() {
    print_header "Database Connectivity"
    
    # Get database URL from secrets
    SECRET_VALUE=$(aws secretsmanager get-secret-value \
        --secret-id $SECRET_NAME \
        --query 'SecretString' --output text --region $REGION 2>/dev/null || echo "{}")
    
    if [ "$SECRET_VALUE" = "{}" ]; then
        print_failure "Could not retrieve secrets"
        return
    fi
    
    DATABASE_URL=$(echo $SECRET_VALUE | jq -r '.database_url // empty')
    
    if [ -z "$DATABASE_URL" ]; then
        print_failure "Database URL not found in secrets"
        return
    fi
    
    print_success "Database URL found in secrets"
    
    # Test connection (requires psql)
    if command -v psql &> /dev/null; then
        if psql "$DATABASE_URL" -c "SELECT 1;" &> /dev/null; then
            print_success "Database connection successful"
        else
            print_failure "Database connection failed"
        fi
    else
        print_warning "psql not available - skipping connection test"
    fi
}

# 5. Redis Connectivity
check_redis() {
    print_header "Redis Connectivity"
    
    # Get Redis URL from Terraform or secrets
    REDIS_HOST=$(terraform output -raw redis_endpoint 2>/dev/null || echo "")
    
    if [ -z "$REDIS_HOST" ]; then
        print_failure "Could not get Redis endpoint from Terraform"
        return
    fi
    
    print_success "Redis endpoint: $REDIS_HOST"
    
    # Test connection (requires redis-cli)
    if command -v redis-cli &> /dev/null; then
        if redis-cli -h $REDIS_HOST -p 6379 ping | grep -q "PONG"; then
            print_success "Redis connection successful"
        else
            print_failure "Redis connection failed"
        fi
    else
        print_warning "redis-cli not available - skipping connection test"
    fi
}

# 6. CloudWatch Alarms
check_alarms() {
    print_header "CloudWatch Alarms"
    
    ALARM_STATES=$(aws cloudwatch describe-alarms \
        --alarm-name-prefix "carebow-staging" \
        --region $REGION \
        --query 'MetricAlarms[].{Name:AlarmName,State:StateValue}' 2>/dev/null || echo "[]")
    
    if [ "$ALARM_STATES" = "[]" ]; then
        print_warning "No alarms found with carebow-staging prefix"
        return
    fi
    
    ALARM_COUNT=$(echo $ALARM_STATES | jq length)
    OK_COUNT=$(echo $ALARM_STATES | jq '[.[] | select(.State == "OK")] | length')
    INSUFFICIENT_COUNT=$(echo $ALARM_STATES | jq '[.[] | select(.State == "INSUFFICIENT_DATA")] | length')
    ALARM_FIRING=$(echo $ALARM_STATES | jq '[.[] | select(.State == "ALARM")] | length')
    
    print_success "Found $ALARM_COUNT alarms"
    
    if [ "$ALARM_FIRING" -eq 0 ]; then
        print_success "No alarms currently firing"
    else
        print_failure "$ALARM_FIRING alarms currently firing"
    fi
    
    if [ "$OK_COUNT" -gt 0 ]; then
        print_success "$OK_COUNT alarms in OK state"
    fi
    
    if [ "$INSUFFICIENT_COUNT" -gt 0 ]; then
        print_warning "$INSUFFICIENT_COUNT alarms have insufficient data (normal for new services)"
    fi
}

# 7. IAM Permissions
check_permissions() {
    print_header "IAM Permissions"
    
    # This is a basic check - in practice you'd want to test specific permissions
    TASK_ROLE_ARN=$(aws ecs describe-task-definition \
        --task-definition carebow-staging \
        --region $REGION \
        --query 'taskDefinition.taskRoleArn' --output text 2>/dev/null || echo "")
    
    if [ -n "$TASK_ROLE_ARN" ] && [ "$TASK_ROLE_ARN" != "null" ]; then
        print_success "Task role found: $(basename $TASK_ROLE_ARN)"
    else
        print_failure "Could not find task role"
    fi
}

# Main execution
main() {
    echo -e "${YELLOW}"
    echo "🚀 Carebow Staging Environment Validation"
    echo "=========================================="
    echo -e "${NC}"
    
    # Change to terraform directory if it exists
    if [ -d "aws/infrastructure" ]; then
        cd aws/infrastructure
        echo "📁 Working from: $(pwd)"
    fi
    
    check_prerequisites
    check_ecs_health
    check_logs
    check_application_reachability
    check_database
    check_redis
    check_alarms
    check_permissions
    
    # Summary
    echo -e "\n${YELLOW}=== SUMMARY ===${NC}"
    echo -e "${GREEN}✅ Passed: $PASSED${NC}"
    echo -e "${RED}❌ Failed: $FAILED${NC}"
    
    if [ $FAILED -eq 0 ]; then
        echo -e "\n${GREEN}🎉 All checks passed! Staging environment is healthy.${NC}"
        exit 0
    else
        echo -e "\n${RED}⚠️  Some checks failed. Please review the output above.${NC}"
        exit 1
    fi
}

# Run main function
main "$@"