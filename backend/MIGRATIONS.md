# 🗄️ CareBow Database Migrations Guide

This guide covers database migration management for the CareBow backend using Alembic.

## 🚀 Quick Start

### Prerequisites
```bash
# Ensure you're in the backend directory
cd backend

# Activate virtual environment (if using one)
source venv/bin/activate  # or your preferred method

# Install dependencies (Alembic is included)
pip install -r requirements.txt
```

### Initial Setup (Already Done)
The migration system is already configured for your project. Here's what was set up:

1. ✅ Alembic initialized with proper configuration
2. ✅ Database models imported correctly
3. ✅ Initial migration created for all existing tables
4. ✅ Migration management script (`migrate.py`) created

## 📋 Migration Commands

### Using the Migration Script (Recommended)
```bash
# Show help
python migrate.py

# Create a new migration
python migrate.py create "Add user preferences table"

# Apply migrations (upgrade to latest)
python migrate.py upgrade

# Show current database version
python migrate.py current

# Show migration history
python migrate.py history

# Downgrade to previous version
python migrate.py downgrade -1

# Reset database (WARNING: destroys all data)
python migrate.py reset
```

### Using Alembic Directly
```bash
# Create new migration
alembic revision --autogenerate -m "Your migration message"

# Apply migrations
alembic upgrade head

# Show current revision
alembic current

# Show history
alembic history

# Downgrade
alembic downgrade -1
```

## 🔄 Common Migration Workflows

### 1. Adding a New Model
```python
# 1. Create your new model in app/models/
class UserPreference(Base):
    __tablename__ = "user_preferences"
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    preference_key = Column(String, nullable=False)
    preference_value = Column(Text)

# 2. Import it in app/models/__init__.py
from app.models.preferences import UserPreference

# 3. Import it in app/db/base.py
from app.models.preferences import UserPreference  # noqa

# 4. Create migration
python migrate.py create "Add user preferences table"

# 5. Apply migration
python migrate.py upgrade
```

### 2. Modifying Existing Model
```python
# 1. Modify your model
class User(Base):
    # ... existing fields ...
    timezone = Column(String, default="UTC")  # New field

# 2. Create migration
python migrate.py create "Add timezone to users"

# 3. Review the generated migration file
# 4. Apply migration
python migrate.py upgrade
```

### 3. Data Migrations
```python
# For complex data transformations, edit the migration file manually
def upgrade():
    # Schema changes
    op.add_column('users', sa.Column('full_name_normalized', sa.String()))
    
    # Data migration
    connection = op.get_bind()
    connection.execute(
        "UPDATE users SET full_name_normalized = LOWER(full_name)"
    )

def downgrade():
    op.drop_column('users', 'full_name_normalized')
```

## 🏗️ Database Schema Overview

Your current database includes these tables:

### Core Tables
- **users** - User accounts and profiles
- **health_profiles** - Detailed health information
- **consultations** - AI consultation records
- **health_metrics** - Health tracking data
- **conversations** - Chat conversations
- **messages** - Individual chat messages

### Key Relationships
```
users (1) → (many) health_profiles
users (1) → (many) consultations  
users (1) → (many) health_metrics
users (1) → (many) conversations
conversations (1) → (many) messages
```

## 🔧 Configuration Details

### Alembic Configuration
- **Config file**: `alembic.ini`
- **Environment**: `alembic/env.py`
- **Migrations**: `alembic/versions/`

### Database Connection
Alembic uses your app's database configuration from `app.core.config.settings.DATABASE_URL`.

Current setup supports:
- ✅ SQLite (development)
- ✅ PostgreSQL (production)
- ✅ Auto-detection of database type

## 🚨 Important Notes

### Before Creating Migrations
1. **Always review** generated migration files
2. **Test migrations** on a copy of production data
3. **Backup database** before applying migrations in production
4. **Check for data loss** in downgrade operations

### Migration Best Practices
```bash
# ✅ Good migration messages
python migrate.py create "Add user email verification fields"
python migrate.py create "Create subscription plans table"
python migrate.py create "Add indexes for performance optimization"

# ❌ Avoid vague messages
python migrate.py create "Update stuff"
python migrate.py create "Fix"
```

### Production Deployment
```bash
# 1. Always backup first
pg_dump your_database > backup_$(date +%Y%m%d_%H%M%S).sql

# 2. Apply migrations
python migrate.py upgrade

# 3. Verify application works
# 4. Monitor for issues
```

## 🐛 Troubleshooting

### Common Issues

#### Migration Fails
```bash
# Check current state
python migrate.py current

# Check what's pending
alembic show head

# Force mark as current (if tables exist)
alembic stamp head
```

#### Database Out of Sync
```bash
# Reset development database
python migrate.py reset

# Or manually fix
alembic stamp head  # Mark current state
python migrate.py create "Fix database sync"
```

#### Rollback Failed Migration
```bash
# Downgrade to previous version
python migrate.py downgrade -1

# Or to specific revision
python migrate.py downgrade abc123
```

### Environment Issues
```bash
# Ensure you're in the right directory
pwd  # Should be in backend/

# Check Python path
python -c "import app.models.user; print('Models imported successfully')"

# Verify database connection
python -c "from app.core.config import settings; print(settings.DATABASE_URL)"
```

## 📊 Migration History

### Current Migrations
- `a93b70c83c26` - Initial migration - create all tables (2025-08-31)

### Future Migrations
As you develop new features, migrations will be added here automatically.

## 🔐 Production Considerations

### Security
- Never commit database URLs with credentials
- Use environment variables for sensitive data
- Backup before any production migration

### Performance
- Add indexes for frequently queried columns
- Consider migration impact on large tables
- Test migration time on production-sized data

### Monitoring
```bash
# Check migration status
python migrate.py current

# Verify table structure
# (Use your database client to inspect tables)
```

## 📚 Additional Resources

- [Alembic Documentation](https://alembic.sqlalchemy.org/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [FastAPI Database Guide](https://fastapi.tiangolo.com/tutorial/sql-databases/)

---

**🎉 Your migration system is now fully configured and ready to use!**

For any issues, check the troubleshooting section or create a new migration to fix schema problems.