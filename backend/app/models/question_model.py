from app.database.db import db
from datetime import datetime

class Question(db.Model):
    __tablename__ = 'questions'

    id = db.Column(db.Integer, primary_key=True)
    quiz_id = db.Column(db.Integer, db.ForeignKey('quizzes.id'), nullable=False)
    
    # Common Fields
    type = db.Column(db.String(20), nullable=False) # 'mcq' or 'coding'
    statement = db.Column(db.Text, nullable=False)
    points = db.Column(db.Integer, default=10)
    difficulty = db.Column(db.String(20), default='medium') # easy, medium, hard

    # MCQ Specific Fields (Stored as JSON)
    options = db.Column(db.JSON, nullable=True)
    correct_option = db.Column(db.String(10), nullable=True) # e.g., 'A'

    # Coding Specific Fields
    template_code = db.Column(db.Text, nullable=True)
    test_cases = db.Column(db.JSON, nullable=True) # [{"input": "...", "output": "..."}]

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        """Utility for sending data to React frontend."""
        data = {
            "id": self.id,
            "quiz_id": self.quiz_id,
            "type": self.type,
            "statement": self.statement,
            "points": self.points,
            "difficulty": self.difficulty,
        }
        
        # Only include relevant fields based on type to keep the payload clean
        if self.type == 'mcq':
            data["options"] = self.options
        elif self.type == 'coding':
            data["template_code"] = self.template_code
            data["test_cases"] = self.test_cases

        return data