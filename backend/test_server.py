#!/usr/bin/env python3
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from main import app
import uvicorn

if __name__ == "__main__":
    print("🚀 Starting CareBow Backend API...")
    print("📍 API will be available at: http://localhost:8000")
    print("📚 API Documentation: http://localhost:8000/docs")
    print("❤️  Health Check: http://localhost:8000/health")
    print("\n" + "="*50)
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )