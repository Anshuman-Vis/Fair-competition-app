"""
Submission Model
Tracks user quiz submissions and answers.
"""
from datetime import datetime
from app.database import db

class Submission(db.Model):
    """
    Submission model for tracking user quiz attempts and answers.

    Attributes:
        id (int): Primary key
        user_id (int): Foreign key to User
        quiz_id (int): Foreign key to Quiz
        answers (JSON): User's answers {question_id: answer_index}
        started_at (datetime): When the quiz was started
        submitted_at (datetime): When the quiz was submitted
        time_taken (int): Time taken in seconds
        is_completed (bool): Whether submission is complete
    """
    __tablename__ = 'submissions'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    quiz_id = db.Column(db.Integer, db.ForeignKey('quizzes.id'), nullable=False)
    answers = db.Column(db.JSON, default=dict)  # {question_id: answer_index}
    started_at = db.Column(db.DateTime, default=datetime.utcnow)
    submitted_at = db.Column(db.DateTime)
    time_taken = db.Column(db.Integer)  # Time in seconds
    is_completed = db.Column(db.Boolean, default=False)

    def to_dict(self):
        """Convert submission object to dictionary."""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'quiz_id': self.quiz_id,
            'answers': self.answers,
            'started_at': self.started_at.isoformat() if self.started_at else None,
            'submitted_at': self.submitted_at.isoformat() if self.submitted_at else None,
            'time_taken': self.time_taken,
            'is_completed': self.is_completed
        }

    def calculate_score(self):
        """Calculate the score based on correct answers."""
        from app.models.question_model import Question

        score = 0
        correct_answers = 0
        total_questions = 0

        questions = Question.query.filter_by(quiz_id=self.quiz_id).all()
        for question in questions:
            total_questions += 1
            if str(question.id) in self.answers:
                if question.check_answer(self.answers[str(question.id)]):
                    score += question.marks
                    correct_answers += 1

        return {
            'score': score,
            'correct_answers': correct_answers,
            'total_questions': total_questions,
            'percentage': (correct_answers / total_questions * 100) if total_questions > 0 else 0
        }

    def __repr__(self):
        return f'<Submission User {self.user_id} Quiz {self.quiz_id}>'