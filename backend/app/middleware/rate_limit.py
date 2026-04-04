from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

# Initialize the limiter
# We use 'get_remote_address' to track users by their IP
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="memory://", # In production, use "redis://localhost:6379"
)

def init_rate_limiting(app):
    """Link the limiter to the Flask application instance."""
    limiter.init_app(app)

# Specific Limiters for high-security routes
auth_limit = "5 per minute"    # Prevent brute-force login
submit_limit = "1 per minute"  # Prevent double-submission of quiz/code

