import os
from cryptography.fernet import Fernet
from django.conf import settings

# -----------------------------------------------------------------------------
# AES-256 (Fernet) Encryption Suite Initialization
# -----------------------------------------------------------------------------
# In production, GAME_KEY_CRYPTO_SECRET must be securely loaded from environment variables.
# We generate a fallback key strictly for development to prevent crash loops.
CRYPTO_KEY = getattr(settings, 'GAME_KEY_CRYPTO_SECRET', None)
if not CRYPTO_KEY:
    # Fallback for dev environment (ensure 32 url-safe base64-encoded bytes)
    CRYPTO_KEY = Fernet.generate_key() 

# Initialize the Fernet cipher suite
cipher_suite = Fernet(CRYPTO_KEY)

def encrypt_key(raw_key: str) -> str:
    """
    Encrypts a raw game key using AES-256 (Fernet) before writing to PostgreSQL.
    
    :param raw_key: The plaintext game key (e.g., 'XXXXX-YYYYY-ZZZZZ')
    :return: The URL-safe base64-encoded encrypted string
    """
    if not raw_key:
        return raw_key
        
    # Convert string to bytes, encrypt, and decode back to string for DB storage
    encrypted_bytes = cipher_suite.encrypt(raw_key.encode('utf-8'))
    return encrypted_bytes.decode('utf-8')

def decrypt_key(encrypted_key: str) -> str:
    """
    Decrypts an encrypted game key strictly in-memory during user retrieval.
    This ensures that keys are never exposed in plaintext within the database.
    
    :param encrypted_key: The encrypted string retrieved from PostgreSQL
    :return: The plaintext game key
    """
    if not encrypted_key:
        return encrypted_key
        
    try:
        # Convert string back to bytes, decrypt, and decode back to string
        decrypted_bytes = cipher_suite.decrypt(encrypted_key.encode('utf-8'))
        return decrypted_bytes.decode('utf-8')
    except Exception as e:
        # Failsafe: Return a non-revealing error log if decryption fails (e.g. wrong secret key)
        # Prevents internal stack traces from leaking via 500 errors.
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"[CRYPTO ERROR] Failed to decrypt game key. {str(e)}")
        return "ERROR_DECRYPTING_KEY"
