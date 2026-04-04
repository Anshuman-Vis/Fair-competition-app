from flask_migrate import Migrate
from app.database.db import db

def init_migrate(app):
    """
    Initializes Flask-Migrate with the app and the database.
    This allows you to run:
    1. flask db init (First time only)
    2. flask db migrate -m "Description" (To generate a migration script)
    3. flask db upgrade (To apply changes to the database)
    """
    migrate = Migrate(app, db)
    return migrate