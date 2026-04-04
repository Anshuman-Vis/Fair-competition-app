"""
Result Routes
Handles quiz results and performance analytics.
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.result_model import Result
from app.models.quiz_model import Quiz

result_bp = Blueprint('results', __name__)

@result_bp.route('/', methods=['GET'])
@jwt_required()
def get_user_results():
    """
    Get all results for the current user.
    """
    try:
        user_id = get_jwt_identity()

        results = Result.query.filter_by(user_id=user_id).order_by(Result.created_at.desc()).all()

        return jsonify({
            'results': [result.to_dict() for result in results]
        }), 200

    except Exception as e:
        return jsonify({'error': 'Failed to fetch results', 'details': str(e)}), 500

@result_bp.route('/<int:result_id>', methods=['GET'])
@jwt_required()
def get_result(result_id):
    """
    Get a specific result with detailed information.

    Args:
        result_id: The ID of the result to retrieve
    """
    try:
        user_id = get_jwt_identity()

        result = Result.query.filter_by(id=result_id, user_id=user_id).first()

        if not result:
            return jsonify({'error': 'Result not found'}), 404

        # Get quiz details
        quiz = Quiz.query.get(result.quiz_id)

        return jsonify({
            'result': result.to_dict(),
            'quiz': quiz.to_dict() if quiz else None
        }), 200

    except Exception as e:
        return jsonify({'error': 'Failed to fetch result', 'details': str(e)}), 500

@result_bp.route('/quiz/<int:quiz_id>', methods=['GET'])
@jwt_required()
def get_quiz_results(quiz_id):
    """
    Get results for a specific quiz.

    Args:
        quiz_id: The ID of the quiz
    """
    try:
        user_id = get_jwt_identity()

        results = Result.query.filter_by(
            user_id=user_id,
            quiz_id=quiz_id
        ).order_by(Result.created_at.desc()).all()

        return jsonify({
            'results': [result.to_dict() for result in results]
        }), 200

    except Exception as e:
        return jsonify({'error': 'Failed to fetch quiz results', 'details': str(e)}), 500

@result_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_user_stats():
    """
    Get user performance statistics.
    """
    try:
        user_id = get_jwt_identity()

        results = Result.query.filter_by(user_id=user_id).all()

        if not results:
            return jsonify({
                'stats': {
                    'total_quizzes': 0,
                    'average_score': 0,
                    'highest_score': 0,
                    'lowest_score': 0,
                    'pass_rate': 0,
                    'total_time': 0
                }
            }), 200

        total_quizzes = len(results)
        scores = [r.percentage for r in results]
        passed_quizzes = len([r for r in results if r.passed])
        total_time = sum(r.time_taken for r in results if r.time_taken)

        stats = {
            'total_quizzes': total_quizzes,
            'average_score': round(sum(scores) / len(scores), 2),
            'highest_score': max(scores),
            'lowest_score': min(scores),
            'pass_rate': round((passed_quizzes / total_quizzes) * 100, 2),
            'total_time': total_time
        }

        return jsonify({'stats': stats}), 200

    except Exception as e:
        return jsonify({'error': 'Failed to fetch statistics', 'details': str(e)}), 500