"""
Fair Competition Backend Application
"""
from flask_sqlalchemy import SQLAlchemy

# Initialize SQLAlchemy
db = SQLAlchemy()

__all__ = ['db']
