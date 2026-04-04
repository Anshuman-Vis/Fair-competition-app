from app.database.db import db
from app.models.quiz_model import Quiz
from app.models.question_model import Question
from app.models.submission_model import Submission
from datetime import datetime

class QuizService:
    @staticmethod
    def get_ready_quiz(quiz_id):
        """
        Fetches a quiz and strips sensitive answer data before 
        sending it to the student's browser.
        """
        quiz = Quiz.query.get(quiz_id)
        if not quiz or not quiz.is_active:
            return None, "Quiz not found or inactive"

        # Construct safe question list
        questions = []
        for q in quiz.questions:
            q_data = q.to_dict()
            # Security: Remove the correct answer so it's not in the JSON
            q_data.pop('correct_option', None)
            q_data.pop('test_cases', None)
            questions.append(q_data)

        return {
            "quiz_info": quiz.to_dict(),
            "questions": questions
        }, None

    @staticmethod
    def process_submission(user_id, quiz_id, user_answers, time_taken, proctor_data):
        """
        Validates answers against the DB and saves the final result.
        'user_answers' should be a dict: { "question_id": "selected_option" }
        """
        quiz = Quiz.query.get(quiz_id)
        if not quiz:
            return None, "Invalid Quiz ID"

        total_score = 0.0
        points_per_q = quiz.total_points / len(quiz.questions) if quiz.questions else 0

        # Server-side scoring logic
        for q in quiz.questions:
            submitted_ans = user_answers.get(str(q.id))
            if submitted_ans == q.correct_option:
                total_score += q.points if q.points else points_per_q

        # Create the permanent record
        submission = Submission(
            user_id=user_id,
            quiz_id=quiz_id,
            submitted_content=user_answers,
            score=round(total_score, 2),
            time_taken=time_taken,
            is_flagged=proctor_data.get('is_flagged', False),
            violation_count=proctor_data.get('violation_count', 0),
            ip_address=proctor_data.get('ip_address')
        )

        db.session.add(submission)
        db.session.commit()

        return submission, None

    @staticmethod
    def get_leaderboard(quiz_id):
        """Fetches the top performers for a specific quiz."""
        return Submission.query.filter_by(quiz_id=quiz_id)\
            .order_by(Submission.score.desc(), Submission.time_taken.asc())\
            .limit(10).all()