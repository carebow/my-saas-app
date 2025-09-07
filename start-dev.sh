#!/bin/bash

echo "🚀 Starting CareBow Development Server..."
echo "=========================================="

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the development server
echo "🌐 Starting Vite development server on http://localhost:8080"
echo "📱 The revamped CareBow frontend is now running!"
echo ""
echo "✨ Features available:"
echo "   • Hero section with CareBow branding"
echo "   • How CareBow Works (3-column layout)"
echo "   • Trusted by Families Nationwide"
echo "   • Medical Advisory Board section"
echo "   • Comprehensive Healthcare Services (3x3 grid)"
echo "   • Daily Life Transformation (2x3 grid)"
echo "   • CareBow vs Other Platforms comparison"
echo "   • Trusted by Thousands statistics"
echo "   • FAQ accordion section"
echo "   • Early Access form"
echo ""
echo "🎨 Purple theme with modern design"
echo "📱 Fully responsive for all devices"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev
