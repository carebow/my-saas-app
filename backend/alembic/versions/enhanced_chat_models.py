"""Enhanced chat models for Ask CareBow

Revision ID: enhanced_chat_models
Revises: a93b70c83c26
Create Date: 2024-01-15 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'enhanced_chat_models'
down_revision = 'a93b70c83c26'
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Upgrade schema."""
    # Create chat_sessions table
    op.create_table('chat_sessions',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=True),
        sa.Column('session_type', sa.String(length=50), nullable=True),
        sa.Column('status', sa.String(length=20), nullable=True),
        sa.Column('user_context', sa.JSON(), nullable=True),
        sa.Column('conversation_summary', sa.Text(), nullable=True),
        sa.Column('key_insights', sa.JSON(), nullable=True),
        sa.Column('voice_enabled', sa.Boolean(), nullable=True),
        sa.Column('voice_settings', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('last_activity', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('ended_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_chat_sessions_id'), 'chat_sessions', ['id'], unique=False)
    op.create_index(op.f('ix_chat_sessions_user_id'), 'chat_sessions', ['user_id'], unique=False)

    # Create chat_messages table
    op.create_table('chat_messages',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('session_id', sa.String(), nullable=False),
        sa.Column('role', sa.String(length=20), nullable=False),
        sa.Column('content', sa.Text(), nullable=True),
        sa.Column('content_type', sa.String(length=20), nullable=True),
        sa.Column('modality', sa.String(length=20), nullable=True),
        sa.Column('audio_uri', sa.String(length=500), nullable=True),
        sa.Column('image_uris', sa.JSON(), nullable=True),
        sa.Column('ai_analysis', sa.JSON(), nullable=True),
        sa.Column('sentiment', sa.String(length=20), nullable=True),
        sa.Column('urgency_detected', sa.String(length=20), nullable=True),
        sa.Column('health_topics', sa.JSON(), nullable=True),
        sa.Column('personalized_for', sa.JSON(), nullable=True),
        sa.Column('remedy_suggestions', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['session_id'], ['chat_sessions.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_chat_messages_id'), 'chat_messages', ['id'], unique=False)
    op.create_index(op.f('ix_chat_messages_session_id'), 'chat_messages', ['session_id'], unique=False)

    # Create personalized_remedies table
    op.create_table('personalized_remedies',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('session_id', sa.String(), nullable=False),
        sa.Column('message_id', sa.String(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('remedy_type', sa.String(length=50), nullable=True),
        sa.Column('title', sa.Text(), nullable=True),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('instructions', sa.Text(), nullable=True),
        sa.Column('personalization_factors', sa.JSON(), nullable=True),
        sa.Column('contraindications_checked', sa.JSON(), nullable=True),
        sa.Column('confidence_score', sa.Float(), nullable=True),
        sa.Column('safety_level', sa.String(length=20), nullable=True),
        sa.Column('medical_disclaimer', sa.Text(), nullable=True),
        sa.Column('user_rating', sa.Integer(), nullable=True),
        sa.Column('effectiveness_notes', sa.Text(), nullable=True),
        sa.Column('followed', sa.Boolean(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['message_id'], ['chat_messages.id'], ),
        sa.ForeignKeyConstraint(['session_id'], ['chat_sessions.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_personalized_remedies_id'), 'personalized_remedies', ['id'], unique=False)
    op.create_index(op.f('ix_personalized_remedies_user_id'), 'personalized_remedies', ['user_id'], unique=False)

    # Create health_memory table
    op.create_table('health_memory',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('memory_type', sa.String(length=50), nullable=True),
        sa.Column('title', sa.Text(), nullable=True),
        sa.Column('content', sa.Text(), nullable=True),
        sa.Column('context', sa.JSON(), nullable=True),
        sa.Column('importance_score', sa.Float(), nullable=True),
        sa.Column('last_accessed', sa.DateTime(timezone=True), nullable=True),
        sa.Column('access_count', sa.Integer(), nullable=True),
        sa.Column('embedding_vector', sa.JSON(), nullable=True),
        sa.Column('tags', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_health_memory_id'), 'health_memory', ['id'], unique=False)
    op.create_index(op.f('ix_health_memory_user_id'), 'health_memory', ['user_id'], unique=False)

    # Create conversation_insights table
    op.create_table('conversation_insights',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('session_id', sa.String(), nullable=False),
        sa.Column('insight_type', sa.String(length=50), nullable=True),
        sa.Column('title', sa.Text(), nullable=True),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('confidence', sa.Float(), nullable=True),
        sa.Column('supporting_evidence', sa.JSON(), nullable=True),
        sa.Column('recommendations', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['session_id'], ['chat_sessions.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_conversation_insights_id'), 'conversation_insights', ['id'], unique=False)
    op.create_index(op.f('ix_conversation_insights_user_id'), 'conversation_insights', ['user_id'], unique=False)

    # Create user_preferences table
    op.create_table('user_preferences',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('communication_style', sa.String(length=50), nullable=True),
        sa.Column('preferred_language', sa.String(length=10), nullable=True),
        sa.Column('voice_preferences', sa.JSON(), nullable=True),
        sa.Column('remedy_preferences', sa.JSON(), nullable=True),
        sa.Column('cultural_considerations', sa.JSON(), nullable=True),
        sa.Column('privacy_level', sa.String(length=20), nullable=True),
        sa.Column('ai_personality', sa.String(length=50), nullable=True),
        sa.Column('response_length', sa.String(length=20), nullable=True),
        sa.Column('follow_up_frequency', sa.String(length=20), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_user_preferences_id'), 'user_preferences', ['id'], unique=False)
    op.create_index(op.f('ix_user_preferences_user_id'), 'user_preferences', ['user_id'], unique=False)

    # Add foreign key constraints
    op.create_foreign_key('fk_chat_sessions_user_id', 'chat_sessions', 'users', ['user_id'], ['id'])
    op.create_foreign_key('fk_chat_messages_session_id', 'chat_messages', 'chat_sessions', ['session_id'], ['id'])
    op.create_foreign_key('fk_personalized_remedies_session_id', 'personalized_remedies', 'chat_sessions', ['session_id'], ['id'])
    op.create_foreign_key('fk_personalized_remedies_message_id', 'personalized_remedies', 'chat_messages', ['message_id'], ['id'])
    op.create_foreign_key('fk_personalized_remedies_user_id', 'personalized_remedies', 'users', ['user_id'], ['id'])
    op.create_foreign_key('fk_health_memory_user_id', 'health_memory', 'users', ['user_id'], ['id'])
    op.create_foreign_key('fk_conversation_insights_user_id', 'conversation_insights', 'users', ['user_id'], ['id'])
    op.create_foreign_key('fk_conversation_insights_session_id', 'conversation_insights', 'chat_sessions', ['session_id'], ['id'])
    op.create_foreign_key('fk_user_preferences_user_id', 'user_preferences', 'users', ['user_id'], ['id'])


def downgrade() -> None:
    """Downgrade schema."""
    # Drop foreign key constraints
    op.drop_constraint('fk_user_preferences_user_id', 'user_preferences', type_='foreignkey')
    op.drop_constraint('fk_conversation_insights_session_id', 'conversation_insights', type_='foreignkey')
    op.drop_constraint('fk_conversation_insights_user_id', 'conversation_insights', type_='foreignkey')
    op.drop_constraint('fk_health_memory_user_id', 'health_memory', type_='foreignkey')
    op.drop_constraint('fk_personalized_remedies_user_id', 'personalized_remedies', type_='foreignkey')
    op.drop_constraint('fk_personalized_remedies_message_id', 'personalized_remedies', type_='foreignkey')
    op.drop_constraint('fk_personalized_remedies_session_id', 'personalized_remedies', type_='foreignkey')
    op.drop_constraint('fk_chat_messages_session_id', 'chat_messages', type_='foreignkey')
    op.drop_constraint('fk_chat_sessions_user_id', 'chat_sessions', type_='foreignkey')

    # Drop tables
    op.drop_table('user_preferences')
    op.drop_table('conversation_insights')
    op.drop_table('health_memory')
    op.drop_table('personalized_remedies')
    op.drop_table('chat_messages')
    op.drop_table('chat_sessions')

