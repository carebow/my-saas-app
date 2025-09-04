#!/bin/bash
echo "🐘 Connecting to CareBow database via SSM tunnel..."
echo "Make sure the tunnel is running (scripts/start-db-tunnel.sh)"
echo ""
psql -h localhost -p 5433 -U appuser -d carebow
