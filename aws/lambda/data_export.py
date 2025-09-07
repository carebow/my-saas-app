import json
import boto3
import psycopg2
import os
import zipfile
import io
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
    Lambda function to export user data for GDPR compliance.
    Exports all user data including conversations, memories, and preferences.
    """
    try:
        # Extract user ID from event
        user_id = event.get('user_id')
        export_type = event.get('export_type', 'full')
        
        if not user_id:
            raise ValueError("User ID is required")
        
        logger.info(f"Starting data export for user {user_id}, type: {export_type}")
        
        # Get database connection
        db_connection = get_db_connection()
        
        # Export user data based on type
        if export_type == 'full':
            export_data = export_full_user_data(db_connection, user_id)
        elif export_type == 'conversations_only':
            export_data = export_conversations_only(db_connection, user_id)
        elif export_type == 'health_data_only':
            export_data = export_health_data_only(db_connection, user_id)
        else:
            raise ValueError(f"Invalid export type: {export_type}")
        
        # Create export package
        export_package = create_export_package(export_data, user_id, export_type)
        
        # Upload to S3
        s3_key = f"exports/{user_id}/{datetime.now().isoformat()}/user_data_export.zip"
        upload_to_s3(export_package, s3_key)
        
        # Update export status in database
        update_export_status(db_connection, user_id, 'completed', s3_key, len(export_package))
        
        logger.info(f"Data export completed for user {user_id}")
        
        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'Data export completed successfully',
                'export_id': event.get('export_id'),
                's3_key': s3_key,
                'file_size': len(export_package)
            })
        }
        
    except Exception as e:
        logger.error(f"Error in data export: {str(e)}")
        
        # Update export status to failed
        try:
            db_connection = get_db_connection()
            update_export_status(db_connection, user_id, 'failed')
        except:
            pass
        
        return {
            'statusCode': 500,
            'body': json.dumps({
                'error': 'Data export failed',
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

def export_full_user_data(connection, user_id: str) -> Dict[str, Any]:
    """Export all user data."""
    cursor = connection.cursor()
    
    try:
        # Get user basic info
        cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
        user_data = cursor.fetchone()
        
        # Get chat sessions
        cursor.execute("SELECT * FROM chat_sessions WHERE user_id = %s", (user_id,))
        sessions = cursor.fetchall()
        
        # Get chat messages
        cursor.execute("SELECT * FROM chat_messages WHERE session_id IN (SELECT id FROM chat_sessions WHERE user_id = %s)", (user_id,))
        messages = cursor.fetchall()
        
        # Get personalized remedies
        cursor.execute("SELECT * FROM personalized_remedies WHERE user_id = %s", (user_id,))
        remedies = cursor.fetchall()
        
        # Get health memories
        cursor.execute("SELECT * FROM health_memory WHERE user_id = %s", (user_id,))
        health_memories = cursor.fetchall()
        
        # Get conversation memories
        cursor.execute("SELECT * FROM conversation_memory WHERE user_id = %s", (user_id,))
        conversation_memories = cursor.fetchall()
        
        # Get user preferences
        cursor.execute("SELECT * FROM user_preferences WHERE user_id = %s", (user_id,))
        preferences = cursor.fetchall()
        
        # Get data exports
        cursor.execute("SELECT * FROM data_exports WHERE user_id = %s", (user_id,))
        exports = cursor.fetchall()
        
        # Get data deletions
        cursor.execute("SELECT * FROM data_deletions WHERE user_id = %s", (user_id,))
        deletions = cursor.fetchall()
        
        return {
            'user_data': user_data,
            'sessions': sessions,
            'messages': messages,
            'remedies': remedies,
            'health_memories': health_memories,
            'conversation_memories': conversation_memories,
            'preferences': preferences,
            'exports': exports,
            'deletions': deletions,
            'export_timestamp': datetime.now().isoformat(),
            'export_type': 'full'
        }
        
    finally:
        cursor.close()

def export_conversations_only(connection, user_id: str) -> Dict[str, Any]:
    """Export only conversation data."""
    cursor = connection.cursor()
    
    try:
        # Get chat sessions
        cursor.execute("SELECT * FROM chat_sessions WHERE user_id = %s", (user_id,))
        sessions = cursor.fetchall()
        
        # Get chat messages
        cursor.execute("SELECT * FROM chat_messages WHERE session_id IN (SELECT id FROM chat_sessions WHERE user_id = %s)", (user_id,))
        messages = cursor.fetchall()
        
        # Get conversation memories
        cursor.execute("SELECT * FROM conversation_memory WHERE user_id = %s", (user_id,))
        conversation_memories = cursor.fetchall()
        
        return {
            'sessions': sessions,
            'messages': messages,
            'conversation_memories': conversation_memories,
            'export_timestamp': datetime.now().isoformat(),
            'export_type': 'conversations_only'
        }
        
    finally:
        cursor.close()

def export_health_data_only(connection, user_id: str) -> Dict[str, Any]:
    """Export only health-related data."""
    cursor = connection.cursor()
    
    try:
        # Get health memories
        cursor.execute("SELECT * FROM health_memory WHERE user_id = %s", (user_id,))
        health_memories = cursor.fetchall()
        
        # Get personalized remedies
        cursor.execute("SELECT * FROM personalized_remedies WHERE user_id = %s", (user_id,))
        remedies = cursor.fetchall()
        
        # Get user preferences (health-related)
        cursor.execute("SELECT * FROM user_preferences WHERE user_id = %s", (user_id,))
        preferences = cursor.fetchall()
        
        return {
            'health_memories': health_memories,
            'remedies': remedies,
            'preferences': preferences,
            'export_timestamp': datetime.now().isoformat(),
            'export_type': 'health_data_only'
        }
        
    finally:
        cursor.close()

def create_export_package(export_data: Dict[str, Any], user_id: str, export_type: str) -> bytes:
    """Create a ZIP package with the exported data."""
    zip_buffer = io.BytesIO()
    
    with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
        # Add JSON data
        zip_file.writestr('user_data.json', json.dumps(export_data, indent=2, default=str))
        
        # Add CSV files for each data type
        for data_type, data in export_data.items():
            if data_type not in ['export_timestamp', 'export_type'] and data:
                csv_content = convert_to_csv(data, data_type)
                zip_file.writestr(f'{data_type}.csv', csv_content)
        
        # Add README file
        readme_content = f"""
# CareBow Data Export

Export Type: {export_type}
User ID: {user_id}
Export Date: {datetime.now().isoformat()}

## Files Included:
- user_data.json: Complete data export in JSON format
- *.csv: Individual data tables in CSV format

## Data Privacy:
This export contains your personal health data. Please keep it secure and do not share it with unauthorized parties.

## Support:
If you have questions about this export, please contact CareBow support.
        """
        zip_file.writestr('README.txt', readme_content)
    
    zip_buffer.seek(0)
    return zip_buffer.getvalue()

def convert_to_csv(data: List[Any], data_type: str) -> str:
    """Convert database rows to CSV format."""
    if not data:
        return ""
    
    import csv
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Write header
    if data:
        writer.writerow([col.name for col in data[0].__class__.__table__.columns])
        
        # Write data rows
        for row in data:
            writer.writerow(row)
    
    return output.getvalue()

def upload_to_s3(data: bytes, s3_key: str):
    """Upload data to S3."""
    bucket_name = os.environ['S3_BUCKET']
    
    s3_client.put_object(
        Bucket=bucket_name,
        Key=s3_key,
        Body=data,
        ContentType='application/zip',
        ServerSideEncryption='AES256'
    )

def update_export_status(connection, user_id: str, status: str, s3_key: str = None, file_size: int = None):
    """Update export status in database."""
    cursor = connection.cursor()
    
    try:
        if status == 'completed':
            cursor.execute("""
                UPDATE data_exports 
                SET status = %s, completed_at = %s, file_path = %s, file_size = %s
                WHERE user_id = %s AND status = 'pending'
                ORDER BY requested_at DESC
                LIMIT 1
            """, (status, datetime.now(), s3_key, file_size, user_id))
        else:
            cursor.execute("""
                UPDATE data_exports 
                SET status = %s
                WHERE user_id = %s AND status = 'pending'
                ORDER BY requested_at DESC
                LIMIT 1
            """, (status, user_id))
        
        connection.commit()
        
    finally:
        cursor.close()
