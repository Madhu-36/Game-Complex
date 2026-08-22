from django.test import TestCase
from store.utils.crypto import encrypt_key, decrypt_key

class CryptoUtilsTest(TestCase):
    def test_encryption_decryption_lifecycle(self):
        """
        Test that a plaintext game key is securely encrypted into a base64 Fernet token,
        and that decrypting the token perfectly restores the original plaintext key.
        """
        raw_key = "XXXXX-YYYYY-ZZZZZ"
        
        # 1. Encrypt
        encrypted = encrypt_key(raw_key)
        self.assertNotEqual(encrypted, raw_key)
        self.assertTrue(encrypted.startswith("gAAAAA")) # Standard Fernet prefix
        
        # 2. Decrypt
        decrypted = decrypt_key(encrypted)
        self.assertEqual(decrypted, raw_key)
        
    def test_empty_string_handling(self):
        """
        Test that passing empty strings or None returns gracefully without throwing exceptions.
        """
        self.assertEqual(encrypt_key(""), "")
        self.assertEqual(decrypt_key(""), "")
        
    def test_invalid_decryption_payload(self):
        """
        Test that attempting to decrypt a malformed or invalid string returns the failsafe error message
        rather than exposing an internal server stack trace.
        """
        invalid_payload = "this-is-not-a-valid-fernet-token"
        result = decrypt_key(invalid_payload)
        self.assertEqual(result, "ERROR_DECRYPTING_KEY")
