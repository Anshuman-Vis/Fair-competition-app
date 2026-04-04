from app.database.db import db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    
    role = db.Column(db.String(20), default='student')
    
    is_disqualified = db.Column(db.Boolean, default=False)
    disqualification_reason = db.Column(db.String(255), nullable=True)
    total_violations = db.Column(db.Integer, default=0)
    last_login_ip = db.Column(db.String(45), nullable=True)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # REMOVED: submissions = db.relationship(...) line 
    # (The Submission model will handle this via backref)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "role": self.role,
            "is_disqualified": self.is_disqualified,
            "total_violations": self.total_violations
        }