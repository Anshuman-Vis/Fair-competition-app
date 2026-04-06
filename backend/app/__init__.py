"""
Fair Competition Backend Application
Factory pattern for Flask app creation with proper configuration management.
"""
import os
from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app(config_name=None):
    """
    Application Factory Pattern
    Creates and configures the Flask application with all necessary components.

    Args:
        config_name (str): Configuration environment name

    Returns:
        Flask: Configured Flask application instance
    """
    app = Flask(__name__)

    # Configuration
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'hackathon_dev_key_2026')
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', os.getenv('SECRET_KEY', 'hackathon_jwt_key_2026'))
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv(
        'DATABASE_URL',
        'sqlite:///fair_competition.db'
    )
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['CORS_HEADERS'] = 'Content-Type'

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    CORS(app)

    # Import models after db is initialized to avoid circular imports
    with app.app_context():
        import app.models as models  # This will register all models

    # Register blueprints
    from app.routes.auth_routes import auth_bp
    from app.routes.quiz_routes import quiz_bp
    from app.routes.result_routes import result_bp
    from app.routes.submission_routes import submission_bp
    from app.routes.violation_routes import violation_bp
    from app.routes.admin_routes import admin_bp
    from app.routes.health_routes import health_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(quiz_bp, url_prefix='/api/quiz')
    app.register_blueprint(result_bp, url_prefix='/api/results')
    app.register_blueprint(submission_bp, url_prefix='/api/submissions')
    app.register_blueprint(violation_bp, url_prefix='/api/violations')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(health_bp, url_prefix='/api/health')

    # Health check endpoint
    @app.route('/')
    def index():
        return {"message": "Fair Competition API is running", "status": "healthy"}

    return app

__all__ = ['db', 'create_app']
