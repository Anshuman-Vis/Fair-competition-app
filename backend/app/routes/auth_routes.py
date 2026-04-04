"""
Authentication Routes
Handles user registration, login, and profile management.
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.services.auth_service import AuthService
from app.database import db
from app.models.user_model import User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    """
    User registration endpoint.

    Expected JSON payload:
    {
        "email": "user@example.com",
        "password": "securepassword",
        "full_name": "John Doe",
        "roll_number": "12345"
    }
    """
    try:
        data = request.get_json()

        # Validate required fields
        required_fields = ['email', 'password', 'full_name', 'roll_number']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400

        # Register user
        user, error = AuthService.register_user(
            username=data['roll_number'],  # Use roll number as username
            email=data['email'],
            password=data['password'],
            full_name=data['full_name'],
            roll_number=data['roll_number'],
            role='student'
        )

        if error:
            return jsonify({'error': error}), 400

        token = create_access_token(identity=user.id)

        return jsonify({
            'message': 'User registered successfully',
            'token': token,
            'user': user.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Registration failed', 'details': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """
    User login endpoint.

    Expected JSON payload:
    {
        "email": "user@example.com",
        "password": "securepassword"
    }
    """
    try:
        data = request.get_json()

        if not data or not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password are required'}), 400

        # Authenticate user
        user, error = AuthService.authenticate_user(
            data['email'],
            data['password']
        )

        if error:
            return jsonify({'error': error}), 401

        # Create JWT token
        token = create_access_token(identity=user.id)

        return jsonify({
            'message': 'Login successful',
            'token': token,
            'user': user.to_dict()
        }), 200

    except Exception as e:
        return jsonify({'error': 'Login failed', 'details': str(e)}), 500

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """
    Get current user profile.

    Requires JWT token in Authorization header.
    """
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if not user:
            return jsonify({'error': 'User not found'}), 404

        return jsonify({'user': user.to_dict()}), 200

    except Exception as e:
        return jsonify({'error': 'Failed to get user profile', 'details': str(e)}), 500

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    """
    User logout endpoint.

    Note: JWT tokens are stateless, so this mainly serves as a confirmation.
    Client should remove the token from localStorage.
    """
    try:
        # In a stateless JWT system, logout is handled client-side
        # This endpoint can be used for logging or cleanup if needed
        return jsonify({'message': 'Logged out successfully'}), 200

    except Exception as e:
        return jsonify({'error': 'Logout failed', 'details': str(e)}), 500