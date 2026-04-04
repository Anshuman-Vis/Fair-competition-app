import os
from app import create_app
from app.database import db

# Initialize the Flask application using the factory pattern
app = create_app()

def setup_database():
    """
    Ensures that all defined models are converted into 
    database tables before the server starts.
    """
    with app.app_context():
        # This will create the .db file (if using SQLite) 
        # or the tables in Postgres/MySQL
        db.create_all()
        print("✅ Database tables initialized successfully.")

if __name__ == '__main__':
    # 1. Run database setup
    setup_database()

    # 2. Start the Flask server
    # In production, use a WSGI server like Gunicorn instead of app.run
    port = int(os.getenv("PORT", 5000))
    debug_mode = os.getenv("FLASK_DEBUG", "True") == "True"

    print(f"🚀 AI Proctoring Backend running on http://localhost:{port}")
    
    app.run(
        host='0.0.0.0', 
        port=port, 
        debug=debug_mode
    )