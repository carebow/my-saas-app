#!/usr/bin/env python3
"""
Test runner script for CareBow backend tests.
"""
import subprocess
import sys
import os
from pathlib import Path


def run_command(cmd: list, description: str) -> bool:
    """Run a command and return success status."""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(cmd, check=True)
        print(f"✅ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed with exit code {e.returncode}")
        return False


def install_test_dependencies():
    """Install test dependencies."""
    return run_command(
        ["pip", "install", "-r", "requirements-test.txt"],
        "Installing test dependencies"
    )


def run_tests(test_type: str = "all", verbose: bool = False, coverage: bool = True):
    """Run tests based on type."""
    
    # Base pytest command
    cmd = ["python", "-m", "pytest"]
    
    if verbose:
        cmd.append("-v")
    
    if coverage:
        cmd.extend(["--cov=app", "--cov-report=term-missing"])
    
    # Add test selection based on type
    if test_type == "unit":
        cmd.extend(["-m", "unit"])
        description = "Running unit tests"
    elif test_type == "integration":
        cmd.extend(["-m", "integration"])
        description = "Running integration tests"
    elif test_type == "e2e":
        cmd.extend(["-m", "e2e"])
        description = "Running end-to-end tests"
    elif test_type == "auth":
        cmd.extend(["-m", "auth"])
        description = "Running authentication tests"
    elif test_type == "payments":
        cmd.extend(["-m", "payments"])
        description = "Running payment tests"
    elif test_type == "ai":
        cmd.extend(["-m", "ai"])
        description = "Running AI/chat tests"
    elif test_type == "fast":
        cmd.extend(["-m", "not e2e"])
        description = "Running fast tests (excluding E2E)"
    else:
        description = "Running all tests"
    
    return run_command(cmd, description)


def main():
    """Main CLI interface."""
    if len(sys.argv) < 2:
        print("""
🧪 CareBow Test Runner

Usage:
    python run_tests.py <command> [options]

Commands:
    install                 - Install test dependencies
    unit                    - Run unit tests only
    integration            - Run integration tests only
    e2e                    - Run end-to-end tests only
    auth                   - Run authentication tests only
    payments               - Run payment tests only
    ai                     - Run AI/chat tests only
    fast                   - Run all tests except E2E
    all                    - Run all tests (default)
    coverage               - Run all tests with detailed coverage report

Examples:
    python run_tests.py install
    python run_tests.py unit
    python run_tests.py e2e
    python run_tests.py all
        """)
        return

    command = sys.argv[1].lower()
    
    # Ensure we're in the right directory
    if not Path("pytest.ini").exists():
        print("❌ Please run this script from the backend directory")
        return
    
    if command == "install":
        install_test_dependencies()
    
    elif command == "coverage":
        if install_test_dependencies():
            run_tests("all", verbose=True, coverage=True)
    
    elif command in ["unit", "integration", "e2e", "auth", "payments", "ai", "fast", "all"]:
        if install_test_dependencies():
            verbose = "--verbose" in sys.argv or "-v" in sys.argv
            run_tests(command, verbose=verbose)
    
    else:
        print(f"❌ Unknown command: {command}")
        print("Run 'python run_tests.py' for help")


if __name__ == "__main__":
    main()