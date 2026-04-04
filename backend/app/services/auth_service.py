import jwt
import datetime
import os
from app.database import db
from app.models.user_model import User


class AuthService:

    SECRET_KEY = os.getenv("SECRET_KEY", "hackathon_super_secret_123")

    # ------------------------
    # Register User
    # ------------------------
    @staticmethod
    def register_user(username, email, password, full_name, roll_number, role="student"):
        """Business logic for creating a new user"""

        existing_user = User.query.filter(
            (User.email == email) | (User.username == username) | (User.roll_number == roll_number)
        ).first()

        if existing_user:
            return None, "User already exists"

        new_user = User(
            username=username,
            email=email,
            full_name=full_name,
            roll_number=roll_number,
            role=role
        )

        new_user.set_password(password)

        db.session.add(new_user)
        db.session.commit()

        return new_user, None

    # ------------------------
    # Login User
    # ------------------------
    @staticmethod
    def authenticate_user(email, password):
        """Validate credentials"""

        user = User.query.filter_by(email=email).first()

        if not user or not user.check_password(password):
            return None, "Invalid credentials"

        # Anti cheating / ban system
        if user.is_disqualified:
            return None, f"Disqualified: {user.disqualification_reason}"

        return user, None

    # ------------------------
    # Generate JWT Token
    # ------------------------
    @classmethod
    def generate_token(cls, user):

        payload = {
            "sub": user.id,
            "role": user.role,
            "iat": datetime.datetime.utcnow(),
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }

        token = jwt.encode(payload, cls.SECRET_KEY, algorithm="HS256")

        return token

    # ------------------------
    # Decode Token
    # ------------------------
    @classmethod
    def decode_token(cls, token):

        try:
            payload = jwt.decode(
                token,
                cls.SECRET_KEY,
                algorithms=["HS256"]
            )

            return payload, None

        except jwt.ExpiredSignatureError:
            return None, "Token expired"

        except jwt.InvalidTokenError:
            return None, "Invalid token"