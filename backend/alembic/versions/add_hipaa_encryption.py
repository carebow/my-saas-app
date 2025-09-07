"""Add HIPAA encryption to health data fields

Revision ID: hipaa_encrypt_001
Revises: a93b70c83c26
Create Date: 2025-09-06 13:15:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import sqlite

# revision identifiers, used by Alembic.
revision = 'hipaa_encrypt_001'
down_revision = 'a93b70c83c26'
branch_labels = None
depends_on = None


def upgrade() -> None:
    """
    Add audit_logs table and prepare for HIPAA encryption.
    Note: This migration doesn't encrypt existing data - that requires a data migration.
    """
    
    # Create audit_logs table for HIPAA compliance
    op.create_table('audit_logs',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('action', sa.String(length=100), nullable=False),
        sa.Column('resource_type', sa.String(length=50), nullable=False),
        sa.Column('resource_id', sa.Integer(), nullable=True),
        sa.Column('ip_address', sa.String(length=45), nullable=True),
        sa.Column('user_agent', sa.String(length=500), nullable=True),
        sa.Column('endpoint', sa.String(length=200), nullable=True),
        sa.Column('details', sa.JSON(), nullable=True),
        sa.Column('timestamp', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_audit_logs_id'), 'audit_logs', ['id'], unique=False)
    
    # Note: Existing health data fields will be encrypted at runtime by the EncryptedString type
    # New data will be automatically encrypted when inserted
    # To encrypt existing data, run a separate data migration script


def downgrade() -> None:
    """Remove audit logging table"""
    op.drop_index(op.f('ix_audit_logs_id'), table_name='audit_logs')
    op.drop_table('audit_logs')