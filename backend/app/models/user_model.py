"""
User Model
Defines the User entity with authentication and profile information.
"""
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from app.database import db

class User(db.Model):
    """
    User model for authentication and profile management.

    Attributes:
        id (int): Primary key
        username (str): Unique username
        email (str): Unique email address
        full_name (str): User's full name
        roll_number (str): Student roll number
        role (str): User role (student/admin)
        password_hash (str): Hashed password
        created_at (datetime): Account creation timestamp
        updated_at (datetime): Last update timestamp
        is_active (bool): Account status
    """
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    full_name = db.Column(db.String(200), nullable=False)
    roll_number = db.Column(db.String(50), unique=True, nullable=False)
    role = db.Column(db.String(20), default='student', nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    is_disqualified = db.Column(db.Boolean, default=False, nullable=False)
    disqualification_reason = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)

    # Relationships
    submissions = db.relationship('Submission', backref='user', lazy=True)
    results = db.relationship('Result', backref='user', lazy=True)
    violations = db.relationship('Violation', backref='user', lazy=True)
    assignments = db.relationship(
        'QuizAssignment',
        back_populates='user',
        lazy=True,
        cascade='all, delete-orphan',
        foreign_keys='QuizAssignment.user_id'
    )

    def set_password(self, password):
        """Hash and set the user's password."""
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        """Verify the provided password against the stored hash."""
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        """Convert user object to dictionary for API responses."""
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'full_name': self.full_name,
            'roll_number': self.roll_number,
            'role': self.role,
            'is_disqualified': self.is_disqualified,
            'disqualification_reason': self.disqualification_reason,
            'created_at': self.created_at.isoformat(),
            'is_active': self.is_active
        }

    def __repr__(self):
        return f'<User {self.username}>'
