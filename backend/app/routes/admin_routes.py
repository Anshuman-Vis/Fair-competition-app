"""
Admin Routes
Handles admin-only quiz and assignment management.
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
from app.database import db
from app.models.user_model import User
from app.models.quiz_model import Quiz
from app.models.quiz_assignment_model import QuizAssignment

admin_bp = Blueprint('admin', __name__)


def _admin_required():
    return get_jwt().get('role') == 'admin'


def _admin_guard():
    if not _admin_required():
        return jsonify({'error': 'Admin access required'}), 403


def _format_assignment(assignment):
    return {
        'id': assignment.id,
        'user': assignment.user.to_dict() if assignment.user else None,
        'quiz': assignment.quiz.to_dict() if assignment.quiz else None,
        'assigned_by': assignment.assigned_by_user.to_dict() if assignment.assigned_by_user else None,
        'assigned_at': assignment.assigned_at.isoformat() if assignment.assigned_at else None,
        'is_active': assignment.is_active
    }


@admin_bp.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    guard = _admin_guard()
    if guard:
        return guard

    role = request.args.get('role')
    query = User.query
    if role:
        query = query.filter_by(role=role)

    users = query.order_by(User.created_at.desc()).all()
    return jsonify({'users': [user.to_dict() for user in users]}), 200


@admin_bp.route('/quizzes', methods=['GET'])
@jwt_required()
def get_quizzes():
    guard = _admin_guard()
    if guard:
        return guard

    quizzes = Quiz.query.order_by(Quiz.created_at.desc()).all()
    return jsonify({'quizzes': [quiz.to_dict() for quiz in quizzes]}), 200


@admin_bp.route('/assignments', methods=['GET'])
@jwt_required()
def get_assignments():
    guard = _admin_guard()
    if guard:
        return guard

    query = QuizAssignment.query
    user_id = request.args.get('user_id')
    quiz_id = request.args.get('quiz_id')

    if user_id:
        query = query.filter_by(user_id=user_id)
    if quiz_id:
        query = query.filter_by(quiz_id=quiz_id)

    assignments = query.order_by(QuizAssignment.assigned_at.desc()).all()
    return jsonify({'assignments': [_format_assignment(a) for a in assignments]}), 200


@admin_bp.route('/assignments', methods=['POST'])
@jwt_required()
def assign_quiz():
    guard = _admin_guard()
    if guard:
        return guard

    data = request.get_json() or {}
    quiz_id = data.get('quiz_id')
    user_id = data.get('user_id')
    email = data.get('email')
    roll_number = data.get('roll_number')

    if not quiz_id:
        return jsonify({'error': 'quiz_id is required'}), 400

    if not user_id and not email and not roll_number:
        return jsonify({'error': 'user_id, email, or roll_number is required'}), 400

    quiz = Quiz.query.get(quiz_id)
    if not quiz:
        return jsonify({'error': 'Quiz not found'}), 404

    user_query = User.query
    if user_id:
        user_query = user_query.filter_by(id=user_id)
    elif email:
        user_query = user_query.filter_by(email=email)
    else:
        user_query = user_query.filter_by(roll_number=roll_number)

    user = user_query.first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    existing = QuizAssignment.query.filter_by(
        user_id=user.id,
        quiz_id=quiz.id
    ).first()

    if existing and existing.is_active:
        return jsonify({'error': 'Quiz already assigned to this user'}), 400

    if existing and not existing.is_active:
        existing.is_active = True
        existing.assigned_by = get_jwt_identity()
        db.session.commit()
        return jsonify({'message': 'Quiz assignment reactivated', 'assignment': _format_assignment(existing)}), 200

    assignment = QuizAssignment(
        user_id=user.id,
        quiz_id=quiz.id,
        assigned_by=get_jwt_identity(),
        is_active=True
    )

    db.session.add(assignment)
    db.session.commit()

    return jsonify({'message': 'Quiz assigned successfully', 'assignment': _format_assignment(assignment)}), 201


@admin_bp.route('/assignments/<int:assignment_id>', methods=['DELETE'])
@jwt_required()
def remove_assignment(assignment_id):
    guard = _admin_guard()
    if guard:
        return guard

    assignment = QuizAssignment.query.get(assignment_id)
    if not assignment:
        return jsonify({'error': 'Assignment not found'}), 404

    assignment.is_active = False
    db.session.commit()

    return jsonify({'message': 'Assignment deactivated', 'assignment': _format_assignment(assignment)}), 200
