#!/usr/bin/env python3
"""
Database migration management script for CareBow backend.
"""
import subprocess
import sys
import os
from pathlib import Path


def run_command(cmd: list, description: str) -> bool:
    """Run a command and return success status."""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(cmd, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        if result.stdout:
            print(result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed:")
        print(f"Error: {e.stderr}")
        return False


def check_alembic_setup():
    """Check if Alembic is properly set up."""
    alembic_dir = Path("alembic")
    alembic_ini = Path("alembic.ini")
    
    if not alembic_dir.exists() or not alembic_ini.exists():
        print("❌ Alembic not initialized. Run 'alembic init alembic' first.")
        return False
    
    print("✅ Alembic is properly set up")
    return True


def create_migration(message: str = None):
    """Create a new migration."""
    if not message:
        message = input("Enter migration message: ").strip()
        if not message:
            message = "Auto-generated migration"
    
    cmd = ["alembic", "revision", "--autogenerate", "-m", message]
    return run_command(cmd, f"Creating migration: {message}")


def upgrade_database(revision: str = "head"):
    """Upgrade database to specified revision."""
    cmd = ["alembic", "upgrade", revision]
    return run_command(cmd, f"Upgrading database to {revision}")


def downgrade_database(revision: str):
    """Downgrade database to specified revision."""
    cmd = ["alembic", "downgrade", revision]
    return run_command(cmd, f"Downgrading database to {revision}")


def show_history():
    """Show migration history."""
    cmd = ["alembic", "history", "--verbose"]
    return run_command(cmd, "Showing migration history")


def show_current():
    """Show current database revision."""
    cmd = ["alembic", "current", "--verbose"]
    return run_command(cmd, "Showing current database revision")


def main():
    """Main CLI interface."""
    if len(sys.argv) < 2:
        print("""
🏥 CareBow Database Migration Manager

Usage:
    python migrate.py <command> [options]

Commands:
    init                    - Initialize Alembic (first time setup)
    create [message]        - Create a new migration
    upgrade [revision]      - Upgrade database (default: head)
    downgrade <revision>    - Downgrade database to revision
    history                 - Show migration history
    current                 - Show current database revision
    reset                   - Reset database (WARNING: destroys data)

Examples:
    python migrate.py create "Add user preferences table"
    python migrate.py upgrade
    python migrate.py downgrade -1
    python migrate.py history
        """)
        return

    command = sys.argv[1].lower()
    
    if command == "init":
        print("🔄 Initializing Alembic...")
        if run_command(["alembic", "init", "alembic"], "Alembic initialization"):
            print("✅ Alembic initialized. Please configure alembic/env.py and alembic.ini")
    
    elif command == "create":
        if not check_alembic_setup():
            return
        message = " ".join(sys.argv[2:]) if len(sys.argv) > 2 else None
        create_migration(message)
    
    elif command == "upgrade":
        if not check_alembic_setup():
            return
        revision = sys.argv[2] if len(sys.argv) > 2 else "head"
        upgrade_database(revision)
    
    elif command == "downgrade":
        if not check_alembic_setup():
            return
        if len(sys.argv) < 3:
            print("❌ Please specify revision to downgrade to")
            return
        revision = sys.argv[2]
        downgrade_database(revision)
    
    elif command == "history":
        if not check_alembic_setup():
            return
        show_history()
    
    elif command == "current":
        if not check_alembic_setup():
            return
        show_current()
    
    elif command == "reset":
        print("⚠️  WARNING: This will destroy all data in the database!")
        confirm = input("Type 'yes' to confirm: ").strip().lower()
        if confirm == "yes":
            # Remove database file (for SQLite)
            db_file = Path("carebow.db")
            if db_file.exists():
                db_file.unlink()
                print("🗑️  Database file removed")
            
            # Upgrade to head to recreate tables
            upgrade_database("head")
        else:
            print("❌ Reset cancelled")
    
    else:
        print(f"❌ Unknown command: {command}")
        print("Run 'python migrate.py' for help")


if __name__ == "__main__":
    main()