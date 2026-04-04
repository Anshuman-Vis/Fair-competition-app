"""
Health Routes
Provides health check endpoints for monitoring and load balancer checks.
"""
from flask import Blueprint, jsonify
from app.database import db

health_bp = Blueprint('health', __name__)

@health_bp.route('/', methods=['GET'])
def health_check():
    """
    Basic health check endpoint.

    Returns the service status and basic information.
    Used by load balancers and monitoring systems.
    """
    return jsonify({
        'status': 'healthy',
        'service': 'Fair Competition API',
        'version': '1.0.0',
        'timestamp': '2026-04-04T22:04:07+05:30'
    }), 200

@health_bp.route('/detailed', methods=['GET'])
def detailed_health_check():
    """
    Detailed health check with database connectivity test.

    Tests database connection and returns comprehensive health information.
    """
    try:
        # Test database connection
        db.session.execute(db.text('SELECT 1'))
        db_status = 'healthy'

        return jsonify({
            'status': 'healthy',
            'service': 'Fair Competition API',
            'version': '1.0.0',
            'database': db_status,
            'timestamp': '2026-04-04T22:04:07+05:30',
            'checks': {
                'database': 'passed'
            }
        }), 200

    except Exception as e:
        return jsonify({
            'status': 'unhealthy',
            'service': 'Fair Competition API',
            'database': 'unhealthy',
            'error': str(e),
            'timestamp': '2026-04-04T22:04:07+05:30',
            'checks': {
                'database': 'failed'
            }
        }), 503

@health_bp.route('/ping', methods=['GET'])
def ping():
    """
    Simple ping endpoint for quick connectivity checks.

    Returns minimal response for load balancer health checks.
    """
    return jsonify({'status': 'pong'}), 200