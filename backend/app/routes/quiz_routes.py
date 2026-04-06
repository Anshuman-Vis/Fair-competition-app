"""
Quiz Routes
Handles quiz management, questions, and quiz taking functionality.
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt, jwt_required, get_jwt_identity
from app.database import db
from app.models.quiz_model import Quiz
from app.models.question_model import Question
from app.models.submission_model import Submission
from app.models.quiz_assignment_model import QuizAssignment

quiz_bp = Blueprint('quiz', __name__)


def _is_admin():
    claims = get_jwt()
    return claims.get('role') == 'admin'


def _user_is_assigned_to_quiz(user_id, quiz_id):
    return QuizAssignment.query.filter_by(
        user_id=user_id,
        quiz_id=quiz_id,
        is_active=True
    ).first() is not None


@quiz_bp.route('/all', methods=['GET'])
@jwt_required()
def get_all_quizzes():
    """
    Get all available quizzes for the current user.

    Returns only active quizzes that are currently available.
    """
    try:
        user_id = get_jwt_identity()

        if _is_admin():
            quizzes = Quiz.query.filter_by(is_active=True).all()
        else:
            quizzes = Quiz.query.join(QuizAssignment).filter(
                Quiz.is_active == True,
                QuizAssignment.user_id == user_id,
                QuizAssignment.is_active == True
            ).all()

        # Filter to only available quizzes
        available_quizzes = [quiz for quiz in quizzes if quiz.is_available()]

        return jsonify({
            'quizzes': [quiz.to_dict() for quiz in available_quizzes]
        }), 200

    except Exception as e:
        return jsonify({'error': 'Failed to fetch quizzes', 'details': str(e)}), 500

@quiz_bp.route('/<int:quiz_id>', methods=['GET'])
@jwt_required()
def get_quiz(quiz_id):
    """
    Get a specific quiz with its questions.

    Args:
        quiz_id: The ID of the quiz to retrieve
    """
    try:
        quiz = Quiz.query.get(quiz_id)

        if not quiz:
            return jsonify({'error': 'Quiz not found'}), 404

        if not quiz.is_available():
            return jsonify({'error': 'Quiz is not currently available'}), 403

        user_id = get_jwt_identity()
        if not _is_admin() and not _user_is_assigned_to_quiz(user_id, quiz_id):
            return jsonify({'error': 'You are not assigned to this quiz'}), 403

        # Get questions ordered by their order field
        questions = Question.query.filter_by(quiz_id=quiz_id).order_by(Question.order).all()

        # Remove correct_answer from questions for security
        questions_data = []
        for q in questions:
            q_dict = q.to_dict()
            del q_dict['correct_answer']  # Don't send correct answers to client
            del q_dict['explanation']     # Don't send explanations during quiz
            questions_data.append(q_dict)

        return jsonify({
            'quiz': quiz.to_dict(),
            'questions': questions_data
        }), 200

    except Exception as e:
        return jsonify({'error': 'Failed to fetch quiz', 'details': str(e)}), 500

@quiz_bp.route('/<int:quiz_id>/start', methods=['POST'])
@jwt_required()
def start_quiz(quiz_id):
    """
    Start a quiz attempt for the current user.

    Creates a new submission record and returns quiz data.
    """
    try:
        user_id = get_jwt_identity()

        # Check if quiz exists and is available
        quiz = Quiz.query.get(quiz_id)
        if not quiz:
            return jsonify({'error': 'Quiz not found'}), 404

        if not quiz.is_available():
            return jsonify({'error': 'Quiz is not currently available'}), 403

        if not _is_admin() and not _user_is_assigned_to_quiz(user_id, quiz_id):
            return jsonify({'error': 'You are not assigned to this quiz'}), 403

        # Check if user already has a completed submission
        existing_submission = Submission.query.filter_by(
            user_id=user_id,
            quiz_id=quiz_id,
            is_completed=True
        ).first()

        if existing_submission:
            return jsonify({'error': 'You have already completed this quiz'}), 400

        # Check for existing incomplete submission or create new one
        submission = Submission.query.filter_by(
            user_id=user_id,
            quiz_id=quiz_id,
            is_completed=False
        ).first()

        if not submission:
            submission = Submission(
                user_id=user_id,
                quiz_id=quiz_id,
                answers={}
            )
            db.session.add(submission)
            db.session.commit()

        # Get questions
        questions = Question.query.filter_by(quiz_id=quiz_id).order_by(Question.order).all()

        # Remove sensitive data
        questions_data = []
        for q in questions:
            q_dict = q.to_dict()
            del q_dict['correct_answer']
            del q_dict['explanation']
            questions_data.append(q_dict)

        return jsonify({
            'quiz': quiz.to_dict(),
            'questions': questions_data,
            'submission': submission.to_dict()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to start quiz', 'details': str(e)}), 500

@quiz_bp.route('/<int:quiz_id>/submit', methods=['POST'])
@jwt_required()
def submit_quiz(quiz_id):
    """
    Submit quiz answers and calculate results.

    Args:
        quiz_id: The ID of the quiz being submitted
    """
    try:
        user_id = get_jwt_identity()
        data = request.get_json()

        if not data or 'answers' not in data:
            return jsonify({'error': 'Answers are required'}), 400

        # Get submission
        submission = Submission.query.filter_by(
            user_id=user_id,
            quiz_id=quiz_id,
            is_completed=False
        ).first()

        if not submission:
            return jsonify({'error': 'No active submission found'}), 404

        # Update submission
        submission.answers = data['answers']
        submission.submitted_at = db.func.now()
        submission.time_taken = data.get('time_taken', 0)
        submission.is_completed = True

        # Calculate score
        score_data = submission.calculate_score()

        # Create result record
        from app.models.result_model import Result
        result = Result(
            user_id=user_id,
            quiz_id=quiz_id,
            submission_id=submission.id,
            score=score_data['score'],
            percentage=score_data['percentage'],
            correct_answers=score_data['correct_answers'],
            total_questions=score_data['total_questions'],
            time_taken=submission.time_taken,
            passed=score_data['percentage'] >= 40  # Assuming 40% passing grade
        )

        db.session.add(result)
        db.session.commit()

        return jsonify({
            'message': 'Quiz submitted successfully',
            'result': result.to_dict(),
            'score_data': score_data
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to submit quiz', 'details': str(e)}), 500