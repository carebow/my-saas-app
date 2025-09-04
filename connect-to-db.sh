#!/bin/bash

# CareBow Database Connection Script via AWS Session Manager
# This script connects to your private RDS database securely

echo "🔐 Connecting to CareBow Database via AWS Session Manager..."
echo "📍 Instance: i-043455c16d0d512ee"
echo "🗄️  Database: carebow-db.ccjcseo46asa.us-east-1.rds.amazonaws.com"
echo ""

# Start session and connect to database
aws ssm start-session --target i-043455c16d0d512ee --document-name AWS-StartInteractiveCommand --parameters 'command=["bash -c \"export PGPASSWORD='\''!)8sjO&A:ZU*fPHHJG$oF%IptDKfZWB6'\'' && psql -h carebow-db.ccjcseo46asa.us-east-1.rds.amazonaws.com -p 5432 -d carebow -U carebow_admin\""]'