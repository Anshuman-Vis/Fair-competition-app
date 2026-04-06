"""
Quiz Model
Defines the Quiz entity with quiz configuration and metadata.
"""
from datetime import datetime
from app.database import db

class Quiz(db.Model):
    """
    Quiz model for exam configuration and management.

    Attributes:
        id (int): Primary key
        title (str): Quiz title
        description (str): Quiz description
        duration (int): Duration in minutes
        question_count (int): Number of questions
        total_marks (int): Total marks for the quiz
        passing_marks (int): Minimum passing marks
        is_active (bool): Whether quiz is available
        created_at (datetime): Creation timestamp
        updated_at (datetime): Last update timestamp
        start_time (datetime): Quiz start time
        end_time (datetime): Quiz end time
    """
    __tablename__ = 'quizzes'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    duration = db.Column(db.Integer, default=60)  # Duration in minutes
    question_count = db.Column(db.Integer, default=10)
    total_marks = db.Column(db.Integer, default=100)
    passing_marks = db.Column(db.Integer, default=40)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    start_time = db.Column(db.DateTime)
    end_time = db.Column(db.DateTime)

    # Relationships
    questions = db.relationship('Question', backref='quiz', lazy=True, cascade='all, delete-orphan')
    submissions = db.relationship('Submission', backref='quiz', lazy=True)
    results = db.relationship('Result', backref='quiz', lazy=True)
    assignments = db.relationship('QuizAssignment', back_populates='quiz', lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        """Convert quiz object to dictionary for API responses."""
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'duration': self.duration,
            'question_count': self.question_count,
            'total_marks': self.total_marks,
            'passing_marks': self.passing_marks,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'start_time': self.start_time.isoformat() if self.start_time else None,
            'end_time': self.end_time.isoformat() if self.end_time else None
        }

    def is_available(self):
        """Check if the quiz is currently available for taking."""
        now = datetime.utcnow()
        if not self.is_active:
            return False
        if self.start_time and now < self.start_time:
            return False
        if self.end_time and now > self.end_time:
            return False
        return True

    def __repr__(self):
        return f'<Quiz {self.title}>'
    
    # REMOVED: submissions = db.relationship(...) 
    # This is now handled by Submission model backref='submissions_list'

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "category": self.category,
            "time_limit": self.time_limit,
            "is_active": self.is_active,
            "total_questions": len(self.questions) if self.questions else 0
        }
