"""
Result Model
Stores final quiz results and performance metrics.
"""
from datetime import datetime
from app.database import db

class Result(db.Model):
    """
    Result model for storing final quiz results and analytics.

    Attributes:
        id (int): Primary key
        user_id (int): Foreign key to User
        quiz_id (int): Foreign key to Quiz
        submission_id (int): Foreign key to Submission
        score (int): Total score achieved
        percentage (float): Percentage score
        correct_answers (int): Number of correct answers
        total_questions (int): Total questions in quiz
        time_taken (int): Time taken in seconds
        passed (bool): Whether the user passed
        created_at (datetime): Result creation timestamp
    """
    __tablename__ = 'results'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    quiz_id = db.Column(db.Integer, db.ForeignKey('quizzes.id'), nullable=False)
    submission_id = db.Column(db.Integer, db.ForeignKey('submissions.id'), nullable=False)
    score = db.Column(db.Integer, nullable=False)
    percentage = db.Column(db.Float, nullable=False)
    correct_answers = db.Column(db.Integer, nullable=False)
    total_questions = db.Column(db.Integer, nullable=False)
    time_taken = db.Column(db.Integer, nullable=False)
    passed = db.Column(db.Boolean, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        """Convert result object to dictionary."""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'quiz_id': self.quiz_id,
            'submission_id': self.submission_id,
            'score': self.score,
            'percentage': round(self.percentage, 2),
            'correct_answers': self.correct_answers,
            'total_questions': self.total_questions,
            'time_taken': self.time_taken,
            'passed': self.passed,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

    def get_grade(self):
        """Get letter grade based on percentage."""
        if self.percentage >= 90:
            return 'A+'
        elif self.percentage >= 80:
            return 'A'
        elif self.percentage >= 70:
            return 'B+'
        elif self.percentage >= 60:
            return 'B'
        elif self.percentage >= 50:
            return 'C'
        elif self.percentage >= 40:
            return 'D'
        else:
            return 'F'

    def __repr__(self):
        return f'<Result User {self.user_id} Quiz {self.quiz_id} Score {self.score}%>'