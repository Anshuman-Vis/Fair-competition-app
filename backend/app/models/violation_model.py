"""
Violation Model
Tracks security violations and cheating attempts during quizzes.
"""
from datetime import datetime
from app.database import db

class Violation(db.Model):
    """
    Violation model for tracking security incidents and cheating attempts.

    Attributes:
        id (int): Primary key
        user_id (int): Foreign key to User
        quiz_id (int): Foreign key to Quiz (nullable for general violations)
        violation_type (str): Type of violation (WINDOW_BLUR, PRINT_ATTEMPT, etc.)
        description (str): Detailed description of the violation
        severity (str): Severity level (LOW, MEDIUM, HIGH, CRITICAL)
        timestamp (datetime): When the violation occurred
        ip_address (str): User's IP address
        user_agent (str): Browser user agent
        violation_data (JSON): Additional violation data
    """
    __tablename__ = 'violations'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    quiz_id = db.Column(db.Integer, db.ForeignKey('quizzes.id'))
    violation_type = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text)
    severity = db.Column(db.String(20), default='MEDIUM')  # LOW, MEDIUM, HIGH, CRITICAL
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    ip_address = db.Column(db.String(45))  # IPv6 compatible
    user_agent = db.Column(db.Text)
    violation_data = db.Column(db.JSON, default=dict)

    def to_dict(self):
        """Convert violation object to dictionary."""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'quiz_id': self.quiz_id,
            'violation_type': self.violation_type,
            'description': self.description,
            'severity': self.severity,
            'timestamp': self.timestamp.isoformat() if self.timestamp else None,
            'ip_address': self.ip_address,
            'user_agent': self.user_agent,
            'violation_data': self.violation_data
        }

    def is_critical(self):
        """Check if this is a critical violation."""
        return self.severity in ['HIGH', 'CRITICAL']

    def __repr__(self):
        return f'<Violation {self.violation_type} User {self.user_id}>'