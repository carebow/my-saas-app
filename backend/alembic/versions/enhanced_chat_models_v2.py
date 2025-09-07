"""Enhanced chat models with ChatGPT-like functionality

Revision ID: enhanced_chat_v2
Revises: enhanced_chat_models
Create Date: 2024-01-15 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'enhanced_chat_v2'
down_revision = 'enhanced_chat_models'
branch_labels = None
depends_on = None


def upgrade():
    # Add new columns to chat_sessions
    op.add_column('chat_sessions', sa.Column('is_continuous', sa.Boolean(), nullable=True, default=True))
    op.add_column('chat_sessions', sa.Column('memory_enabled', sa.Boolean(), nullable=True, default=True))
    op.add_column('chat_sessions', sa.Column('empathy_level', sa.String(20), nullable=True, default='high'))
    op.add_column('chat_sessions', sa.Column('comfort_mode', sa.Boolean(), nullable=True, default=True))
    op.add_column('chat_sessions', sa.Column('data_retention_policy', sa.String(20), nullable=True, default='lifetime'))
    op.add_column('chat_sessions', sa.Column('export_requested', sa.Boolean(), nullable=True, default=False))
    op.add_column('chat_sessions', sa.Column('deletion_requested', sa.Boolean(), nullable=True, default=False))

    # Add new columns to chat_messages
    op.add_column('chat_messages', sa.Column('message_sequence', sa.Integer(), nullable=True))
    op.add_column('chat_messages', sa.Column('parent_message_id', sa.String(), nullable=True))
    op.add_column('chat_messages', sa.Column('is_edited', sa.Boolean(), nullable=True, default=False))
    op.add_column('chat_messages', sa.Column('edit_history', sa.JSON(), nullable=True))
    op.add_column('chat_messages', sa.Column('user_feedback', sa.JSON(), nullable=True))
    op.add_column('chat_messages', sa.Column('empathy_indicators', sa.JSON(), nullable=True))
    op.add_column('chat_messages', sa.Column('context_used', sa.JSON(), nullable=True))
    op.add_column('chat_messages', sa.Column('follow_up_required', sa.Boolean(), nullable=True, default=False))
    op.add_column('chat_messages', sa.Column('follow_up_scheduled', sa.DateTime(timezone=True), nullable=True))
    op.add_column('chat_messages', sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True))

    # Add new columns to user_preferences
    op.add_column('user_preferences', sa.Column('memory_enabled', sa.Boolean(), nullable=True, default=True))
    op.add_column('user_preferences', sa.Column('continuous_mode', sa.Boolean(), nullable=True, default=True))
    op.add_column('user_preferences', sa.Column('comfort_mode', sa.Boolean(), nullable=True, default=True))
    op.add_column('user_preferences', sa.Column('empathy_level', sa.String(20), nullable=True, default='high'))
    op.add_column('user_preferences', sa.Column('data_retention', sa.String(20), nullable=True, default='lifetime'))
    op.add_column('user_preferences', sa.Column('export_frequency', sa.String(20), nullable=True, default='on_demand'))
    op.add_column('user_preferences', sa.Column('auto_follow_up', sa.Boolean(), nullable=True, default=True))

    # Create data_exports table
    op.create_table('data_exports',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('export_type', sa.String(50), nullable=True, default='full'),
        sa.Column('status', sa.String(20), nullable=True, default='pending'),
        sa.Column('file_path', sa.String(500), nullable=True),
        sa.Column('file_size', sa.Integer(), nullable=True),
        sa.Column('requested_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('completed_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('expires_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('download_token', sa.String(255), nullable=True),
        sa.Column('download_count', sa.Integer(), nullable=True, default=0),
        sa.Column('max_downloads', sa.Integer(), nullable=True, default=3),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_data_exports_id'), 'data_exports', ['id'], unique=False)

    # Create data_deletions table
    op.create_table('data_deletions',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('deletion_type', sa.String(50), nullable=True, default='full_account'),
        sa.Column('status', sa.String(20), nullable=True, default='pending'),
        sa.Column('reason', sa.Text(), nullable=True),
        sa.Column('requested_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('scheduled_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('completed_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('grace_period_days', sa.Integer(), nullable=True, default=7),
        sa.Column('grace_period_ends', sa.DateTime(timezone=True), nullable=True),
        sa.Column('can_cancel', sa.Boolean(), nullable=True, default=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_data_deletions_id'), 'data_deletions', ['id'], unique=False)

    # Create conversation_memory table
    op.create_table('conversation_memory',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('memory_type', sa.String(50), nullable=True),
        sa.Column('title', sa.String(255), nullable=True),  # Will be encrypted in app
        sa.Column('content', sa.String(2000), nullable=True),  # Will be encrypted in app
        sa.Column('importance_score', sa.Float(), nullable=True),
        sa.Column('confidence_score', sa.Float(), nullable=True),
        sa.Column('context', sa.JSON(), nullable=True),
        sa.Column('tags', sa.JSON(), nullable=True),
        sa.Column('last_accessed', sa.DateTime(timezone=True), nullable=True),
        sa.Column('access_count', sa.Integer(), nullable=True, default=0),
        sa.Column('effectiveness_score', sa.Float(), nullable=True),
        sa.Column('embedding_vector', sa.JSON(), nullable=True),
        sa.Column('related_memories', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_conversation_memory_id'), 'conversation_memory', ['id'], unique=False)


def downgrade():
    # Drop new tables
    op.drop_index(op.f('ix_conversation_memory_id'), table_name='conversation_memory')
    op.drop_table('conversation_memory')
    
    op.drop_index(op.f('ix_data_deletions_id'), table_name='data_deletions')
    op.drop_table('data_deletions')
    
    op.drop_index(op.f('ix_data_exports_id'), table_name='data_exports')
    op.drop_table('data_exports')

    # Remove new columns from user_preferences
    op.drop_column('user_preferences', 'auto_follow_up')
    op.drop_column('user_preferences', 'export_frequency')
    op.drop_column('user_preferences', 'data_retention')
    op.drop_column('user_preferences', 'empathy_level')
    op.drop_column('user_preferences', 'comfort_mode')
    op.drop_column('user_preferences', 'continuous_mode')
    op.drop_column('user_preferences', 'memory_enabled')

    # Remove new columns from chat_messages
    op.drop_column('chat_messages', 'updated_at')
    op.drop_column('chat_messages', 'follow_up_scheduled')
    op.drop_column('chat_messages', 'follow_up_required')
    op.drop_column('chat_messages', 'context_used')
    op.drop_column('chat_messages', 'empathy_indicators')
    op.drop_column('chat_messages', 'user_feedback')
    op.drop_column('chat_messages', 'edit_history')
    op.drop_column('chat_messages', 'is_edited')
    op.drop_column('chat_messages', 'parent_message_id')
    op.drop_column('chat_messages', 'message_sequence')

    # Remove new columns from chat_sessions
    op.drop_column('chat_sessions', 'deletion_requested')
    op.drop_column('chat_sessions', 'export_requested')
    op.drop_column('chat_sessions', 'data_retention_policy')
    op.drop_column('chat_sessions', 'comfort_mode')
    op.drop_column('chat_sessions', 'empathy_level')
    op.drop_column('chat_sessions', 'memory_enabled')
    op.drop_column('chat_sessions', 'is_continuous')
