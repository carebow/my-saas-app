# AWS Client Configuration for CareBow
# Centralized AWS service clients with proper configuration and error handling

import boto3
from botocore.config import Config
from botocore.exceptions import ClientError, NoCredentialsError
import logging
from typing import Optional, Dict, Any
import json
from datetime import datetime

logger = logging.getLogger(__name__)

class AWSClientManager:
    """Centralized AWS client manager with proper configuration"""
    
    def __init__(self, region: str = "us-east-1"):
        self.region = region
        self.config = Config(
            region_name=region,
            retries={
                'max_attempts': 3,
                'mode': 'adaptive'
            },
            max_pool_connections=50
        )
        
        # Initialize clients
        self._s3_client = None
        self._sqs_client = None
        self._sns_client = None
        self._stepfunctions_client = None
        self._opensearch_client = None
        self._cognito_client = None
        self._secretsmanager_client = None
        self._kms_client = None
        self._rds_client = None
        self._cloudwatch_client = None
    
    @property
    def s3_client(self):
        """S3 client for file storage"""
        if self._s3_client is None:
            self._s3_client = boto3.client('s3', config=self.config)
        return self._s3_client
    
    @property
    def sqs_client(self):
        """SQS client for message queuing"""
        if self._sqs_client is None:
            self._sqs_client = boto3.client('sqs', config=self.config)
        return self._sqs_client
    
    @property
    def sns_client(self):
        """SNS client for notifications"""
        if self._sns_client is None:
            self._sns_client = boto3.client('sns', config=self.config)
        return self._sns_client
    
    @property
    def stepfunctions_client(self):
        """Step Functions client for workflow orchestration"""
        if self._stepfunctions_client is None:
            self._stepfunctions_client = boto3.client('stepfunctions', config=self.config)
        return self._stepfunctions_client
    
    @property
    def opensearch_client(self):
        """OpenSearch client for search and analytics"""
        if self._opensearch_client is None:
            self._opensearch_client = boto3.client('opensearchserverless', config=self.config)
        return self._opensearch_client
    
    @property
    def cognito_client(self):
        """Cognito client for user management"""
        if self._cognito_client is None:
            self._cognito_client = boto3.client('cognito-idp', config=self.config)
        return self._cognito_client
    
    @property
    def secretsmanager_client(self):
        """Secrets Manager client for secure credential storage"""
        if self._secretsmanager_client is None:
            self._secretsmanager_client = boto3.client('secretsmanager', config=self.config)
        return self._secretsmanager_client
    
    @property
    def kms_client(self):
        """KMS client for encryption"""
        if self._kms_client is None:
            self._kms_client = boto3.client('kms', config=self.config)
        return self._kms_client
    
    @property
    def rds_client(self):
        """RDS client for database management"""
        if self._rds_client is None:
            self._rds_client = boto3.client('rds', config=self.config)
        return self._rds_client
    
    @property
    def cloudwatch_client(self):
        """CloudWatch client for monitoring"""
        if self._cloudwatch_client is None:
            self._cloudwatch_client = boto3.client('cloudwatch', config=self.config)
        return self._cloudwatch_client

# Global AWS client manager instance
aws_client_manager = AWSClientManager()

def get_aws_client(service: str):
    """Get AWS client for specified service"""
    try:
        if service == 's3':
            return aws_client_manager.s3_client
        elif service == 'sqs':
            return aws_client_manager.sqs_client
        elif service == 'sns':
            return aws_client_manager.sns_client
        elif service == 'stepfunctions':
            return aws_client_manager.stepfunctions_client
        elif service == 'opensearch':
            return aws_client_manager.opensearch_client
        elif service == 'cognito':
            return aws_client_manager.cognito_client
        elif service == 'secretsmanager':
            return aws_client_manager.secretsmanager_client
        elif service == 'kms':
            return aws_client_manager.kms_client
        elif service == 'rds':
            return aws_client_manager.rds_client
        elif service == 'cloudwatch':
            return aws_client_manager.cloudwatch_client
        else:
            raise ValueError(f"Unsupported AWS service: {service}")
    except NoCredentialsError:
        logger.error("AWS credentials not found")
        raise
    except Exception as e:
        logger.error(f"Error initializing AWS client for {service}: {e}")
        raise

class S3Service:
    """S3 service wrapper with common operations"""
    
    def __init__(self, client=None):
        self.client = client or get_aws_client('s3')
    
    def put_object(self, bucket: str, key: str, body: str, content_type: str = "application/json", 
                   encryption: str = "AES256", metadata: Optional[Dict[str, str]] = None) -> bool:
        """Put object in S3 with encryption and metadata"""
        try:
            put_params = {
                'Bucket': bucket,
                'Key': key,
                'Body': body,
                'ContentType': content_type,
                'ServerSideEncryption': encryption
            }
            
            if metadata:
                put_params['Metadata'] = metadata
            
            self.client.put_object(**put_params)
            logger.info(f"Successfully uploaded {key} to {bucket}")
            return True
            
        except ClientError as e:
            logger.error(f"Error uploading {key} to {bucket}: {e}")
            return False
    
    def get_object(self, bucket: str, key: str) -> Optional[str]:
        """Get object from S3"""
        try:
            response = self.client.get_object(Bucket=bucket, Key=key)
            return response['Body'].read().decode('utf-8')
        except ClientError as e:
            logger.error(f"Error retrieving {key} from {bucket}: {e}")
            return None
    
    def delete_object(self, bucket: str, key: str) -> bool:
        """Delete object from S3"""
        try:
            self.client.delete_object(Bucket=bucket, Key=key)
            logger.info(f"Successfully deleted {key} from {bucket}")
            return True
        except ClientError as e:
            logger.error(f"Error deleting {key} from {bucket}: {e}")
            return False
    
    def list_objects(self, bucket: str, prefix: str = "", max_keys: int = 1000) -> list:
        """List objects in S3 bucket"""
        try:
            response = self.client.list_objects_v2(
                Bucket=bucket,
                Prefix=prefix,
                MaxKeys=max_keys
            )
            return response.get('Contents', [])
        except ClientError as e:
            logger.error(f"Error listing objects in {bucket}: {e}")
            return []
    
    def generate_presigned_url(self, bucket: str, key: str, expiration: int = 3600) -> Optional[str]:
        """Generate presigned URL for S3 object"""
        try:
            url = self.client.generate_presigned_url(
                'get_object',
                Params={'Bucket': bucket, 'Key': key},
                ExpiresIn=expiration
            )
            return url
        except ClientError as e:
            logger.error(f"Error generating presigned URL for {key}: {e}")
            return None

class SQSService:
    """SQS service wrapper with common operations"""
    
    def __init__(self, client=None):
        self.client = client or get_aws_client('sqs')
    
    def send_message(self, queue_url: str, message_body: str, 
                    message_attributes: Optional[Dict[str, Any]] = None) -> bool:
        """Send message to SQS queue"""
        try:
            send_params = {
                'QueueUrl': queue_url,
                'MessageBody': message_body
            }
            
            if message_attributes:
                send_params['MessageAttributes'] = message_attributes
            
            response = self.client.send_message(**send_params)
            logger.info(f"Message sent to queue {queue_url}: {response['MessageId']}")
            return True
            
        except ClientError as e:
            logger.error(f"Error sending message to queue {queue_url}: {e}")
            return False
    
    def receive_messages(self, queue_url: str, max_messages: int = 10, 
                        wait_time_seconds: int = 20) -> list:
        """Receive messages from SQS queue"""
        try:
            response = self.client.receive_message(
                QueueUrl=queue_url,
                MaxNumberOfMessages=max_messages,
                WaitTimeSeconds=wait_time_seconds
            )
            return response.get('Messages', [])
        except ClientError as e:
            logger.error(f"Error receiving messages from queue {queue_url}: {e}")
            return []
    
    def delete_message(self, queue_url: str, receipt_handle: str) -> bool:
        """Delete message from SQS queue"""
        try:
            self.client.delete_message(
                QueueUrl=queue_url,
                ReceiptHandle=receipt_handle
            )
            logger.info("Message deleted from queue")
            return True
        except ClientError as e:
            logger.error(f"Error deleting message from queue: {e}")
            return False

class SNSService:
    """SNS service wrapper with common operations"""
    
    def __init__(self, client=None):
        self.client = client or get_aws_client('sns')
    
    def publish_message(self, topic_arn: str, message: str, 
                       subject: Optional[str] = None, 
                       message_attributes: Optional[Dict[str, Any]] = None) -> bool:
        """Publish message to SNS topic"""
        try:
            publish_params = {
                'TopicArn': topic_arn,
                'Message': message
            }
            
            if subject:
                publish_params['Subject'] = subject
            
            if message_attributes:
                publish_params['MessageAttributes'] = message_attributes
            
            response = self.client.publish(**publish_params)
            logger.info(f"Message published to topic {topic_arn}: {response['MessageId']}")
            return True
            
        except ClientError as e:
            logger.error(f"Error publishing message to topic {topic_arn}: {e}")
            return False
    
    def send_email(self, topic_arn: str, email: str, subject: str, 
                   message: str) -> bool:
        """Send email via SNS"""
        try:
            # Subscribe email to topic if not already subscribed
            self.client.subscribe(
                TopicArn=topic_arn,
                Protocol='email',
                Endpoint=email
            )
            
            # Publish message
            return self.publish_message(topic_arn, message, subject)
            
        except ClientError as e:
            logger.error(f"Error sending email to {email}: {e}")
            return False

class StepFunctionsService:
    """Step Functions service wrapper with common operations"""
    
    def __init__(self, client=None):
        self.client = client or get_aws_client('stepfunctions')
    
    def start_execution(self, state_machine_arn: str, name: str, 
                       input_data: Dict[str, Any]) -> Optional[str]:
        """Start Step Functions execution"""
        try:
            response = self.client.start_execution(
                StateMachineArn=state_machine_arn,
                Name=name,
                Input=json.dumps(input_data)
            )
            execution_arn = response['executionArn']
            logger.info(f"Step Functions execution started: {execution_arn}")
            return execution_arn
            
        except ClientError as e:
            logger.error(f"Error starting Step Functions execution: {e}")
            return None
    
    def describe_execution(self, execution_arn: str) -> Optional[Dict[str, Any]]:
        """Describe Step Functions execution"""
        try:
            response = self.client.describe_execution(executionArn=execution_arn)
            return response
        except ClientError as e:
            logger.error(f"Error describing execution {execution_arn}: {e}")
            return None
    
    def stop_execution(self, execution_arn: str, cause: str = "User requested stop") -> bool:
        """Stop Step Functions execution"""
        try:
            self.client.stop_execution(
                ExecutionArn=execution_arn,
                Cause=cause
            )
            logger.info(f"Step Functions execution stopped: {execution_arn}")
            return True
        except ClientError as e:
            logger.error(f"Error stopping execution {execution_arn}: {e}")
            return False

# Service instances
s3_service = S3Service()
sqs_service = SQSService()
sns_service = SNSService()
stepfunctions_service = StepFunctionsService()
