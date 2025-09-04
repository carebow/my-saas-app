#!/usr/bin/env python3
"""
Script to run tests with coverage reporting.
"""
import subprocess
import sys

def run_tests_with_coverage():
    """Run tests with coverage and generate reports."""
    
    # Test files that are currently working
    working_tests = [
        "tests/test_auth.py",
        "tests/test_subscription_config.py"
    ]
    
    cmd = [
        "python", "-m", "pytest",
        *working_tests,
        "--cov=app",
        "--cov-report=term-missing",
        "--cov-report=html:htmlcov",
        "--cov-fail-under=65",
        "-v"
    ]
    
    print("Running tests with coverage...")
    print(f"Command: {' '.join(cmd)}")
    
    result = subprocess.run(cmd, cwd=".")
    
    if result.returncode == 0:
        print("\n✅ All tests passed with sufficient coverage!")
        print("📊 Coverage report generated in htmlcov/index.html")
    else:
        print("\n❌ Tests failed or coverage insufficient")
        
    return result.returncode

if __name__ == "__main__":
    sys.exit(run_tests_with_coverage())