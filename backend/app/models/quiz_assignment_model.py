"""
Quiz Assignment Model
Tracks which quizzes are assigned to which users by an admin.
"""
from datetime import datetime
from app.database import db

class QuizAssignment(db.Model):
    """Quiz assignment record linking students to quizzes."""

    __tablename__ = 'quiz_assignments'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    quiz_id = db.Column(db.Integer, db.ForeignKey('quizzes.id'), nullable=False)
    assigned_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    assigned_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True, nullable=False)

    # Relationships
    user = db.relationship('User', foreign_keys=[user_id], back_populates='assignments', lazy=True)
    quiz = db.relationship('Quiz', foreign_keys=[quiz_id], back_populates='assignments', lazy=True)
    assigned_by_user = db.relationship('User', foreign_keys=[assigned_by], lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'quiz_id': self.quiz_id,
            'assigned_by': self.assigned_by,
            'assigned_at': self.assigned_at.isoformat() if self.assigned_at else None,
            'is_active': self.is_active
        }

    def __repr__(self):
        return f'<QuizAssignment user={self.user_id} quiz={self.quiz_id}>'
