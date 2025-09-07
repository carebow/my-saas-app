import json
import boto3
import psycopg2
import os
from datetime import datetime
from typing import Dict, List, Any
import logging

# Configure logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Initialize AWS clients
s3_client = boto3.client('s3')
secrets_client = boto3.client('secretsmanager')

def lambda_handler(event, context):
    """
    Lambda function to delete user data for GDPR compliance.
    Permanently deletes all user data including conversations, memories, and files.
    """
    try:
        # Extract user ID from event
        user_id = event.get('user_id')
        deletion_type = event.get('deletion_type', 'full_account')
        
        if not user_id:
            raise ValueError("User ID is required")
        
        logger.info(f"Starting data deletion for user {user_id}, type: {deletion_type}")
        
        # Get database connection
        db_connection = get_db_connection()
        
        # Delete user data based on type
        if deletion_type == 'full_account':
            delete_full_account(db_connection, user_id)
        elif deletion_type == 'conversations_only':
            delete_conversations_only(db_connection, user_id)
        elif deletion_type == 'specific_data':
            delete_specific_data(db_connection, user_id, event.get('specific_data_types', []))
        else:
            raise ValueError(f"Invalid deletion type: {deletion_type}")
        
        # Delete S3 objects
        delete_s3_objects(user_id)
        
        # Update deletion status in database
        update_deletion_status(db_connection, user_id, 'completed')
        
        logger.info(f"Data deletion completed for user {user_id}")
        
        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'Data deletion completed successfully',
                'deletion_id': event.get('deletion_id'),
                'deletion_type': deletion_type
            })
        }
        
    except Exception as e:
        logger.error(f"Error in data deletion: {str(e)}")
        
        # Update deletion status to failed
        try:
            db_connection = get_db_connection()
            update_deletion_status(db_connection, user_id, 'failed')
        except:
            pass
        
        return {
            'statusCode': 500,
            'body': json.dumps({
                'error': 'Data deletion failed',
                'message': str(e)
            })
        }

def get_db_connection():
    """Get database connection using secrets manager."""
    try:
        # Get database credentials from Secrets Manager
        secret_name = os.environ.get('RDS_SECRET_NAME', 'carebow/rds/credentials')
        secret_response = secrets_client.get_secret_value(SecretId=secret_name)
        secret = json.loads(secret_response['SecretString'])
        
        # Connect to database
        connection = psycopg2.connect(
            host=os.environ['RDS_ENDPOINT'],
            database=os.environ['RDS_DATABASE'],
            user=secret['username'],
            password=secret['password'],
            port=5432
        )
        
        return connection
        
    except Exception as e:
        logger.error(f"Database connection failed: {str(e)}")
        raise

def delete_full_account(db_connection, user_id: str):
    """Delete all user data and account."""
    cursor = db_connection.cursor()
    
    try:
        # Start transaction
        cursor.execute("BEGIN")
        
        # Get all session IDs for this user
        cursor.execute("SELECT id FROM chat_sessions WHERE user_id = %s", (user_id,))
        session_ids = [row[0] for row in cursor.fetchall()]
        
        # Delete in order to respect foreign key constraints
        
        # 1. Delete personalized remedies
        cursor.execute("DELETE FROM personalized_remedies WHERE user_id = %s", (user_id,))
        logger.info(f"Deleted personalized remedies for user {user_id}")
        
        # 2. Delete chat messages
        if session_ids:
            placeholders = ','.join(['%s'] * len(session_ids))
            cursor.execute(f"DELETE FROM chat_messages WHERE session_id IN ({placeholders})", session_ids)
            logger.info(f"Deleted chat messages for user {user_id}")
        
        # 3. Delete chat sessions
        cursor.execute("DELETE FROM chat_sessions WHERE user_id = %s", (user_id,))
        logger.info(f"Deleted chat sessions for user {user_id}")
        
        # 4. Delete health memories
        cursor.execute("DELETE FROM health_memory WHERE user_id = %s", (user_id,))
        logger.info(f"Deleted health memories for user {user_id}")
        
        # 5. Delete conversation memories
        cursor.execute("DELETE FROM conversation_memory WHERE user_id = %s", (user_id,))
        logger.info(f"Deleted conversation memories for user {user_id}")
        
        # 6. Delete conversation insights
        cursor.execute("DELETE FROM conversation_insights WHERE user_id = %s", (user_id,))
        logger.info(f"Deleted conversation insights for user {user_id}")
        
        # 7. Delete user preferences
        cursor.execute("DELETE FROM user_preferences WHERE user_id = %s", (user_id,))
        logger.info(f"Deleted user preferences for user {user_id}")
        
        # 8. Delete data exports
        cursor.execute("DELETE FROM data_exports WHERE user_id = %s", (user_id,))
        logger.info(f"Deleted data exports for user {user_id}")
        
        # 9. Delete data deletions
        cursor.execute("DELETE FROM data_deletions WHERE user_id = %s", (user_id,))
        logger.info(f"Deleted data deletion records for user {user_id}")
        
        # 10. Delete health profile
        cursor.execute("DELETE FROM health_profiles WHERE user_id = %s", (user_id,))
        logger.info(f"Deleted health profile for user {user_id}")
        
        # 11. Finally, delete user account
        cursor.execute("DELETE FROM users WHERE id = %s", (user_id,))
        logger.info(f"Deleted user account {user_id}")
        
        # Commit transaction
        cursor.execute("COMMIT")
        logger.info(f"Successfully deleted all data for user {user_id}")
        
    except Exception as e:
        # Rollback on error
        cursor.execute("ROLLBACK")
        logger.error(f"Error deleting user data: {str(e)}")
        raise
    finally:
        cursor.close()

def delete_conversations_only(db_connection, user_id: str):
    """Delete only conversation data."""
    cursor = db_connection.cursor()
    
    try:
        # Start transaction
        cursor.execute("BEGIN")
        
        # Get all session IDs for this user
        cursor.execute("SELECT id FROM chat_sessions WHERE user_id = %s", (user_id,))
        session_ids = [row[0] for row in cursor.fetchall()]
        
        # Delete conversation-related data
        
        # 1. Delete personalized remedies
        cursor.execute("DELETE FROM personalized_remedies WHERE user_id = %s", (user_id,))
        logger.info(f"Deleted personalized remedies for user {user_id}")
        
        # 2. Delete chat messages
        if session_ids:
            placeholders = ','.join(['%s'] * len(session_ids))
            cursor.execute(f"DELETE FROM chat_messages WHERE session_id IN ({placeholders})", session_ids)
            logger.info(f"Deleted chat messages for user {user_id}")
        
        # 3. Delete chat sessions
        cursor.execute("DELETE FROM chat_sessions WHERE user_id = %s", (user_id,))
        logger.info(f"Deleted chat sessions for user {user_id}")
        
        # 4. Delete conversation memories
        cursor.execute("DELETE FROM conversation_memory WHERE user_id = %s", (user_id,))
        logger.info(f"Deleted conversation memories for user {user_id}")
        
        # 5. Delete conversation insights
        cursor.execute("DELETE FROM conversation_insights WHERE user_id = %s", (user_id,))
        logger.info(f"Deleted conversation insights for user {user_id}")
        
        # Commit transaction
        cursor.execute("COMMIT")
        logger.info(f"Successfully deleted conversation data for user {user_id}")
        
    except Exception as e:
        # Rollback on error
        cursor.execute("ROLLBACK")
        logger.error(f"Error deleting conversation data: {str(e)}")
        raise
    finally:
        cursor.close()

def delete_specific_data(db_connection, user_id: str, data_types: List[str]):
    """Delete specific types of data."""
    cursor = db_connection.cursor()
    
    try:
        # Start transaction
        cursor.execute("BEGIN")
        
        for data_type in data_types:
            if data_type == 'conversations':
                # Delete conversations
                cursor.execute("SELECT id FROM chat_sessions WHERE user_id = %s", (user_id,))
                session_ids = [row[0] for row in cursor.fetchall()]
                
                if session_ids:
                    placeholders = ','.join(['%s'] * len(session_ids))
                    cursor.execute(f"DELETE FROM chat_messages WHERE session_id IN ({placeholders})", session_ids)
                    cursor.execute(f"DELETE FROM chat_sessions WHERE id IN ({placeholders})", session_ids)
                
            elif data_type == 'memories':
                # Delete memories
                cursor.execute("DELETE FROM health_memory WHERE user_id = %s", (user_id,))
                cursor.execute("DELETE FROM conversation_memory WHERE user_id = %s", (user_id,))
                
            elif data_type == 'remedies':
                # Delete remedies
                cursor.execute("DELETE FROM personalized_remedies WHERE user_id = %s", (user_id,))
                
            elif data_type == 'preferences':
                # Delete preferences
                cursor.execute("DELETE FROM user_preferences WHERE user_id = %s", (user_id,))
        
        # Commit transaction
        cursor.execute("COMMIT")
        logger.info(f"Successfully deleted specific data types {data_types} for user {user_id}")
        
    except Exception as e:
        # Rollback on error
        cursor.execute("ROLLBACK")
        logger.error(f"Error deleting specific data: {str(e)}")
        raise
    finally:
        cursor.close()

def delete_s3_objects(user_id: str):
    """Delete all S3 objects for the user."""
    try:
        # Delete from chat data bucket
        chat_bucket = os.environ['S3_BUCKET']
        voice_bucket = os.environ['VOICE_BUCKET']
        
        # List and delete objects with user prefix
        for bucket in [chat_bucket, voice_bucket]:
            try:
                # List objects with user prefix
                response = s3_client.list_objects_v2(
                    Bucket=bucket,
                    Prefix=f"users/{user_id}/"
                )
                
                if 'Contents' in response:
                    # Delete objects in batches
                    objects_to_delete = [{'Key': obj['Key']} for obj in response['Contents']]
                    
                    if objects_to_delete:
                        s3_client.delete_objects(
                            Bucket=bucket,
                            Delete={
                                'Objects': objects_to_delete
                            }
                        )
                        logger.info(f"Deleted {len(objects_to_delete)} objects from {bucket} for user {user_id}")
                
            except Exception as e:
                logger.warning(f"Error deleting objects from {bucket}: {str(e)}")
        
        logger.info(f"Successfully deleted S3 objects for user {user_id}")
        
    except Exception as e:
        logger.error(f"Error deleting S3 objects: {str(e)}")
        raise

def update_deletion_status(db_connection, user_id: str, status: str):
    """Update deletion status in database."""
    cursor = db_connection.cursor()
    
    try:
        cursor.execute("""
            UPDATE data_deletions 
            SET status = %s, completed_at = %s
            WHERE user_id = %s AND status = 'pending'
            ORDER BY requested_at DESC
            LIMIT 1
        """, (status, datetime.now(), user_id))
        
        db_connection.commit()
        
    finally:
        cursor.close()
