"""
Submission Routes
Handles quiz submission management and progress tracking.
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.database import db
from app.models.submission_model import Submission

submission_bp = Blueprint('submissions', __name__)

@submission_bp.route('/', methods=['GET'])
@jwt_required()
def get_user_submissions():
    """
    Get all submissions for the current user.
    """
    try:
        user_id = get_jwt_identity()

        submissions = Submission.query.filter_by(user_id=user_id).order_by(Submission.started_at.desc()).all()

        return jsonify({
            'submissions': [submission.to_dict() for submission in submissions]
        }), 200

    except Exception as e:
        return jsonify({'error': 'Failed to fetch submissions', 'details': str(e)}), 500

@submission_bp.route('/<int:submission_id>', methods=['GET'])
@jwt_required()
def get_submission(submission_id):
    """
    Get a specific submission.

    Args:
        submission_id: The ID of the submission to retrieve
    """
    try:
        user_id = get_jwt_identity()

        submission = Submission.query.filter_by(id=submission_id, user_id=user_id).first()

        if not submission:
            return jsonify({'error': 'Submission not found'}), 404

        return jsonify({
            'submission': submission.to_dict()
        }), 200

    except Exception as e:
        return jsonify({'error': 'Failed to fetch submission', 'details': str(e)}), 500

@submission_bp.route('/quiz/<int:quiz_id>', methods=['GET'])
@jwt_required()
def get_quiz_submissions(quiz_id):
    """
    Get all submissions for a specific quiz.

    Args:
        quiz_id: The ID of the quiz
    """
    try:
        user_id = get_jwt_identity()

        submissions = Submission.query.filter_by(
            user_id=user_id,
            quiz_id=quiz_id
        ).order_by(Submission.started_at.desc()).all()

        return jsonify({
            'submissions': [submission.to_dict() for submission in submissions]
        }), 200

    except Exception as e:
        return jsonify({'error': 'Failed to fetch quiz submissions', 'details': str(e)}), 500

@submission_bp.route('/<int:submission_id>/progress', methods=['PUT'])
@jwt_required()
def update_progress(submission_id):
    """
    Update submission progress (save answers without completing).

    Args:
        submission_id: The ID of the submission to update
    """
    try:
        user_id = get_jwt_identity()
        data = request.get_json()

        submission = Submission.query.filter_by(id=submission_id, user_id=user_id).first()

        if not submission:
            return jsonify({'error': 'Submission not found'}), 404

        if submission.is_completed:
            return jsonify({'error': 'Cannot update completed submission'}), 400

        # Update answers
        if 'answers' in data:
            submission.answers = data['answers']

        db.session.commit()

        return jsonify({
            'message': 'Progress updated successfully',
            'submission': submission.to_dict()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to update progress', 'details': str(e)}), 500