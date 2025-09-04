from sqlalchemy.orm import Session
import subprocess
import os

from app.db.session import SessionLocal
from app.db.base import Base
from app.db.session import engine
from app.models.user import User
from app.models.health import HealthProfile, Consultation, HealthMetric


def init_db() -> None:
    """Initialize database using Alembic migrations."""
    try:
        # Run Alembic upgrade to create/update tables
        result = subprocess.run(
            ["alembic", "upgrade", "head"],
            cwd=os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
            capture_output=True,
            text=True
        )
        if result.returncode != 0:
            print(f"Alembic upgrade failed: {result.stderr}")
            # Fallback to direct table creation for development
            Base.metadata.create_all(bind=engine)
        else:
            print("Database initialized successfully with Alembic")
    except Exception as e:
        print(f"Error running Alembic: {e}")
        # Fallback to direct table creation
        Base.metadata.create_all(bind=engine)