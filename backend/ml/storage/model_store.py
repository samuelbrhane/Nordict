# ml/storage/model_store.py

"""
Model storage abstraction - supports local and S3.
"""

import os
import pickle
import tempfile
from django.conf import settings


def get_storage_config():
    """Get storage configuration from settings."""
    return getattr(settings, 'ML_STORAGE', {
        'TYPE': 'local',
        'LOCAL_PATH': 'ml/models',
        'S3_BUCKET': '',
        'S3_PREFIX': 'models',
    })


def get_model_path(filename: str) -> str:
    """Get full path for model file based on storage type."""
    config = get_storage_config()
    storage_type = config.get('TYPE', 'local')
    
    if storage_type == 's3':
        bucket = config['S3_BUCKET']
        prefix = config['S3_PREFIX']
        return f"s3://{bucket}/{prefix}/{filename}"
    else:
        local_path = config['LOCAL_PATH']
        return os.path.join(local_path, filename)


def save_model(model_data: dict, filename: str) -> str:
    """
    Save model to storage (local or S3).
    
    Returns:
        Full path where model was saved
    """
    config = get_storage_config()
    storage_type = config.get('TYPE', 'local')
    
    if storage_type == 's3':
        import boto3
        
        bucket = config['S3_BUCKET']
        prefix = config['S3_PREFIX']
        key = f"{prefix}/{filename}"
        
        # Save to temp file first
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pkl') as tmp:
            pickle.dump(model_data, tmp)
            tmp_path = tmp.name
        
        # Upload to S3
        s3 = boto3.client('s3')
        s3.upload_file(tmp_path, bucket, key)
        
        # Cleanup temp file
        os.unlink(tmp_path)
        
        return f"s3://{bucket}/{key}"
    else:
        local_path = config['LOCAL_PATH']
        os.makedirs(local_path, exist_ok=True)
        
        full_path = os.path.join(local_path, filename)
        
        with open(full_path, 'wb') as f:
            pickle.dump(model_data, f)
        
        return full_path


def load_model(path: str) -> dict:
    """
    Load model from storage (local or S3).
    
    Args:
        path: Full path (local or s3://)
    
    Returns:
        Model data dict
    """
    if path.startswith('s3://'):
        import boto3
        
        # Parse S3 path
        parts = path.replace('s3://', '').split('/')
        bucket = parts[0]
        key = '/'.join(parts[1:])
        
        # Download to temp file
        s3 = boto3.client('s3')
        
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pkl') as tmp:
            s3.download_file(bucket, key, tmp.name)
            tmp_path = tmp.name
        
        # Load model
        with open(tmp_path, 'rb') as f:
            model_data = pickle.load(f)
        
        # Cleanup
        os.unlink(tmp_path)
        
        return model_data
    else:
        # Local file
        with open(path, 'rb') as f:
            model_data = pickle.load(f)
        
        return model_data