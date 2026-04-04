from app.database.db import db
from datetime import datetime

class Submission(db.Model):
    __tablename__ = 'submissions'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    quiz_id = db.Column(db.Integer, db.ForeignKey('quizzes.id'), nullable=False)
    
    # Renamed relationships to avoid mapping collisions
    # This creates User.submissions_list
    submitter = db.relationship('User', backref=db.backref('submissions_list', lazy=True))
    
    # This creates Quiz.submissions_list
    target_quiz = db.relationship('Quiz', backref=db.backref('submissions_list', lazy=True))

    submitted_content = db.Column(db.JSON, nullable=False)
    score = db.Column(db.Float, default=0.0)
    time_taken = db.Column(db.Integer) 
    is_flagged = db.Column(db.Boolean, default=False)
    violation_count = db.Column(db.Integer, default=0)
    ip_address = db.Column(db.String(45)) 
    submitted_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "username": self.submitter.username if self.submitter else "Unknown",
            "quiz_id": self.quiz_id,
            "quiz_title": self.target_quiz.title if self.target_quiz else "Deleted Quiz",
            "score": self.score,
            "time_taken": self.time_taken,
            "submitted_at": self.submitted_at.isoformat(),
            "is_flagged": self.is_flagged,
            "violation_count": self.violation_count
        }