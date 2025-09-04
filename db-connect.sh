#!/bin/bash

echo "🚀 CareBow Database Connection via SSM Port Forwarding"
echo "=================================================="

# Set variables
INSTANCE_ID="i-043455c16d0d512ee"
DB_HOST="carebow-db.ccjcseo46asa.us-east-1.rds.amazonaws.com"

echo "📡 Starting port forwarding tunnel..."
echo "   Local: 127.0.0.1:5432 → Remote: $DB_HOST:5432"
echo ""

# Start port forwarding in background
aws ssm start-session \
  --target "$INSTANCE_ID" \
  --document-name AWS-StartPortForwardingSessionToRemoteHost \
  --parameters host="$DB_HOST",portNumber="5432",localPortNumber="5432" &

TUNNEL_PID=$!
echo "🔗 Tunnel started (PID: $TUNNEL_PID)"
echo "⏳ Waiting 5 seconds for tunnel to establish..."
sleep 5

echo ""
echo "🔐 Getting database password from AWS Secrets Manager..."
PGPASS=$(aws secretsmanager get-secret-value \
  --secret-id carebow-db-password \
  --query 'SecretString' \
  --output text | python3 -c 'import sys,json; print(json.load(sys.stdin)["password"])')

echo "✅ Password retrieved"
echo ""
echo "🗄️  Connecting to PostgreSQL database..."
echo "   Host: 127.0.0.1:5432"
echo "   Database: carebow"
echo "   User: carebow_admin"
echo ""

# Set up .pgpass for convenience
echo "127.0.0.1:5432:carebow:carebow_admin:$PGPASS" > ~/.pgpass
chmod 600 ~/.pgpass

echo "💡 Connection ready! You can now run:"
echo "   psql -h 127.0.0.1 -p 5432 -d carebow -U carebow_admin"
echo ""
echo "🧪 Quick test commands once connected:"
echo "   SELECT version();     -- Check PostgreSQL version"
echo "   \\l                    -- List databases"
echo "   \\dt                   -- List tables"
echo "   \\q                    -- Quit"
echo ""
echo "🛑 To stop: Press Ctrl+C to kill this script and close the tunnel"
echo ""

# Keep the script running to maintain the tunnel
echo "🔄 Tunnel is active. Press Ctrl+C to stop..."
wait $TUNNEL_PID