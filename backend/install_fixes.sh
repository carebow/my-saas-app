#!/bin/bash

echo "Installing fixed dependencies..."

# Install specific bcrypt and passlib versions to fix the warning
pip install "bcrypt==4.1.2" "passlib[bcrypt]==1.7.4"

# Install other test dependencies if needed
pip install pytest pytest-asyncio httpx

echo "Dependencies installed successfully!"

# Verify the installation worked
echo "Testing bcrypt import..."
python -c "import bcrypt; print('✓ bcrypt imported successfully')"

echo "Testing passlib import..."
python -c "from passlib.context import CryptContext; print('✓ passlib imported successfully')"

echo "✅ All fixes installed!"