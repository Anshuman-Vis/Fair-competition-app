import re
import secrets
import string
from werkzeug.security import generate_password_hash, check_password_hash

class SecurityUtils:
    
    @staticmethod
    def hash_password(password: str) -> str:
        """Securely hashes a password using PBKDF2."""
        return generate_password_hash(password)

    @staticmethod
    def verify_password(password: str, hashed: str) -> bool:
        """Verifies a plain-text password against a hash."""
        return check_password_hash(hashed, password)

    @staticmethod
    def sanitize_input(text: str) -> str:
        """Basic XSS prevention by removing high-risk characters."""
        if not text:
            return ""
        # Remove script tags and basic HTML entities
        clean = re.sub(r'<[^>]*?>', '', text)
        return clean.strip()

    @staticmethod
    def generate_exam_code(length=8) -> str:
        """Generates a cryptographically secure alphanumeric string."""
        alphabet = string.ascii_uppercase + string.digits
        return ''.join(secrets.choice(alphabet) for _ in range(length))

    @staticmethod
    def validate_password_strength(password: str) -> bool:
        """
        Ensures password meets minimum competition security standards:
        - 8+ characters
        - 1 uppercase, 1 number
        """
        if len(password) < 8:
            return False
        if not any(char.isdigit() for char in password):
            return False
        if not any(char.isupper() for char in password):
            return False
        return True