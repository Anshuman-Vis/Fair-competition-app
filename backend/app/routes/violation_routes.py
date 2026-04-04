"""
Violation Routes
Handles security violation reporting and monitoring.
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.database import db
from app.models.violation_model import Violation

violation_bp = Blueprint('violations', __name__)

@violation_bp.route('/', methods=['POST'])
@jwt_required()
def report_violation():
    """
    Report a security violation.

    Expected JSON payload:
    {
        "violation_type": "WINDOW_BLUR",
        "description": "User minimized window during quiz",
        "severity": "MEDIUM",
        "quiz_id": 1,
        "metadata": {"additional": "data"}
    }
    """
    try:
        user_id = get_jwt_identity()
        data = request.get_json()

        if not data or not data.get('violation_type'):
            return jsonify({'error': 'Violation type is required'}), 400

        # Create violation record
        violation = Violation(
            user_id=user_id,
            quiz_id=data.get('quiz_id'),
            violation_type=data['violation_type'],
            description=data.get('description'),
            severity=data.get('severity', 'MEDIUM'),
            ip_address=request.remote_addr,
            user_agent=request.headers.get('User-Agent'),
            metadata=data.get('metadata', {})
        )

        db.session.add(violation)
        db.session.commit()

        return jsonify({
            'message': 'Violation reported successfully',
            'violation': violation.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to report violation', 'details': str(e)}), 500

@violation_bp.route('/', methods=['GET'])
@jwt_required()
def get_user_violations():
    """
    Get all violations for the current user.
    """
    try:
        user_id = get_jwt_identity()

        violations = Violation.query.filter_by(user_id=user_id).order_by(Violation.timestamp.desc()).all()

        return jsonify({
            'violations': [violation.to_dict() for violation in violations]
        }), 200

    except Exception as e:
        return jsonify({'error': 'Failed to fetch violations', 'details': str(e)}), 500

@violation_bp.route('/quiz/<int:quiz_id>', methods=['GET'])
@jwt_required()
def get_quiz_violations(quiz_id):
    """
    Get violations for a specific quiz.

    Args:
        quiz_id: The ID of the quiz
    """
    try:
        user_id = get_jwt_identity()

        violations = Violation.query.filter_by(
            user_id=user_id,
            quiz_id=quiz_id
        ).order_by(Violation.timestamp.desc()).all()

        return jsonify({
            'violations': [violation.to_dict() for violation in violations]
        }), 200

    except Exception as e:
        return jsonify({'error': 'Failed to fetch quiz violations', 'details': str(e)}), 500

@violation_bp.route('/<int:violation_id>', methods=['GET'])
@jwt_required()
def get_violation(violation_id):
    """
    Get a specific violation.

    Args:
        violation_id: The ID of the violation to retrieve
    """
    try:
        user_id = get_jwt_identity()

        violation = Violation.query.filter_by(id=violation_id, user_id=user_id).first()

        if not violation:
            return jsonify({'error': 'Violation not found'}), 404

        return jsonify({
            'violation': violation.to_dict()
        }), 200

    except Exception as e:
        return jsonify({'error': 'Failed to fetch violation', 'details': str(e)}), 500