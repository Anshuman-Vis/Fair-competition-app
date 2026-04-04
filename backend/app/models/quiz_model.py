from app.database.db import db
from datetime import datetime

class Quiz(db.Model):
    __tablename__ = 'quizzes'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=True)
    
    category = db.Column(db.String(50), default='quiz') 
    time_limit = db.Column(db.Integer, nullable=False, default=30)
    
    is_active = db.Column(db.Boolean, default=True)
    start_time = db.Column(db.DateTime, nullable=True) 
    end_time = db.Column(db.DateTime, nullable=True)

    total_points = db.Column(db.Integer, default=100)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    # Changed backref to 'parent_quiz' to avoid 'quiz' name collisions
    questions = db.relationship('Question', backref='parent_quiz', lazy=True, cascade="all, delete-orphan")
    
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