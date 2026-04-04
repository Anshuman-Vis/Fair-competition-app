"""
Question Model
Defines the Question entity for quiz questions and answers.
"""
from app.database import db

class Question(db.Model):
    """
    Question model for quiz questions with multiple choice answers.

    Attributes:
        id (int): Primary key
        quiz_id (int): Foreign key to Quiz
        text (str): Question text
        options (JSON): List of answer options
        correct_answer (int): Index of correct answer (0-3)
        marks (int): Marks for this question
        explanation (str): Explanation for the correct answer
        order (int): Question order in quiz
    """
    __tablename__ = 'questions'

    id = db.Column(db.Integer, primary_key=True)
    quiz_id = db.Column(db.Integer, db.ForeignKey('quizzes.id'), nullable=False)
    text = db.Column(db.Text, nullable=False)
    options = db.Column(db.JSON, nullable=False)  # List of 4 options
    correct_answer = db.Column(db.Integer, nullable=False)  # Index 0-3
    marks = db.Column(db.Integer, default=1)
    explanation = db.Column(db.Text)
    order = db.Column(db.Integer, default=0)

    def to_dict(self):
        """Convert question object to dictionary for API responses."""
        return {
            'id': self.id,
            'quiz_id': self.quiz_id,
            'text': self.text,
            'options': self.options,
            'marks': self.marks,
            'explanation': self.explanation,
            'order': self.order
        }

    def check_answer(self, answer_index):
        """Check if the provided answer is correct."""
        return self.correct_answer == answer_index

    def __repr__(self):
        return f'<Question {self.id} for Quiz {self.quiz_id}>'