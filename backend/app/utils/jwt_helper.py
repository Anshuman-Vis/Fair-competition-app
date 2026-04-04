import jwt
import datetime
import os
from flask import current_app

class JWTHelper:
    # Use an environment variable with a hardcoded fallback for development
    SECRET_KEY = os.getenv("SECRET_KEY", "hackathon_dev_key_2026")
    ALGORITHM = "HS256"

    @classmethod
    def encode_token(cls, user_id, role, expiry_hours=24):
        """
        Generates a secure JWT.
        :param user_id: The unique ID of the user (sub)
        :param role: The user's permissions (admin/student)
        :param expiry_hours: Lifespan of the token
        """
        try:
            payload = {
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=expiry_hours),
                'iat': datetime.datetime.utcnow(),
                'sub': user_id,
                'role': role
            }
            return jwt.encode(
                payload,
                cls.SECRET_KEY,
                algorithm=cls.ALGORITHM
            )
        except Exception as e:
            return str(e)

    @classmethod
    def decode_token(cls, token):
        """
        Decodes the JWT and validates the signature and expiration.
        """
        try:
            payload = jwt.decode(
                token, 
                cls.SECRET_KEY, 
                algorithms=[cls.ALGORITHM]
            )
            return payload, None
        except jwt.ExpiredSignatureError:
            return None, "Token has expired. Please log in again."
        except jwt.InvalidTokenError:
            return None, "Invalid token. Authorization denied."
        except Exception as e:
            return None, f"An error occurred: {str(e)}"

    @staticmethod
    def get_token_from_header(header):
        """
        Helper to extract 'Bearer <token>' from the Authorization header.
        """
        if header and header.startswith("Bearer "):
            return header.split(" ")[1]
        return None