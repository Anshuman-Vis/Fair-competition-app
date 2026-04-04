from flask import request, jsonify
from functools import wraps
from app.utils.jwt_helper import JWTHelper
from app.models.user_model import User


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):

        # 1. Extract token
        auth_header = request.headers.get("Authorization")
        token = JWTHelper.get_token_from_header(auth_header)

        if not token:
            return jsonify({
                "message": "Token is missing",
                "status": "error"
            }), 401

        # 2. Decode token
        payload, error = JWTHelper.decode_token(token)

        if error:
            return jsonify({
                "message": error,
                "status": "error"
            }), 401

        current_user_id = payload.get("sub")

        # 3. Validate user exists
        user = User.query.get(current_user_id)

        if not user:
            return jsonify({
                "message": "User not found",
                "status": "error"
            }), 404

        # 4. Anti-Cheating Logic (Hackathon Winning Feature)
        if user.is_disqualified:
            return jsonify({
                "message": "Access Denied",
                "reason": user.disqualification_reason 
                          or "Violation of competition rules"
            }), 403

        # 5. Pass user to route
        return f(current_user_id, *args, **kwargs)

    return decorated

