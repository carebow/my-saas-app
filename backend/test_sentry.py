#!/usr/bin/env python3
"""
Test script to verify Sentry integration in the backend.
Run this after setting up your SENTRY_DSN.
"""
import sys
import os

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.sentry import init_sentry, capture_exception_with_context, capture_message_with_context

def test_sentry_integration():
    """Test Sentry integration by sending test events."""
    
    print("Initializing Sentry...")
    init_sentry()
    
    print("Sending test message...")
    capture_message_with_context(
        "Sentry integration test - message",
        level="info",
        extra_context={"test": True, "component": "backend"}
    )
    
    print("Sending test exception...")
    try:
        raise Exception("Sentry integration test - exception")
    except Exception as e:
        capture_exception_with_context(
            e,
            extra_context={"test": True, "component": "backend"}
        )
    
    print("Test events sent! Check your Sentry dashboard.")

if __name__ == "__main__":
    test_sentry_integration()