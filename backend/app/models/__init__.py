"""
Models Package
Import all database models to register them with SQLAlchemy.
"""
from .user_model import User
from .quiz_model import Quiz
from .question_model import Question
from .submission_model import Submission
from .result_model import Result
from .violation_model import Violation
from .quiz_assignment_model import QuizAssignment

__all__ = ['User', 'Quiz', 'Question', 'Submission', 'Result', 'Violation', 'QuizAssignment']