from app.database.db import db
from app.models.user_model import User
from datetime import datetime

class ProctoringService:
    # Thresholds for a "Hackathon-Winning" Auto-Ban system
    MAX_VIOLATIONS = 5
    CRITICAL_VIOLATIONS = ["FULLSCREEN_EXIT", "MULTI_MONITOR_DETECTED"]

    @classmethod
    def report_violation(cls, user_id, violation_type, details=None):
        """
        Processes a violation signal and updates the user's integrity status.
        """
        user = User.query.get(user_id)
        if not user:
            return None, "User not found"

        # 1. Update violation count
        user.total_violations += 1
        
        # 2. Logic for Auto-Disqualification
        should_disqualify = False
        reason = ""

        if violation_type in cls.CRITICAL_VIOLATIONS:
            should_disqualify = True
            reason = f"Critical Security Breach: {violation_type}"
        
        elif user.total_violations >= cls.MAX_VIOLATIONS:
            should_disqualify = True
            reason = "Exceeded maximum allowed minor violations (Tab switching/Blur)."

        if should_disqualify:
            user.is_disqualified = True
            user.disqualification_reason = reason
        
        db.session.commit()

        return {
            "username": user.username,
            "current_violations": user.total_violations,
            "is_disqualified": user.is_disqualified,
            "reason": user.disqualification_reason
        }, None

    @staticmethod
    def get_user_integrity_report(user_id):
        """Fetches a summary for the Admin Dashboard."""
        user = User.query.get(user_id)
        if not user:
            return None
        
        return {
            "status": "DISQUALIFIED" if user.is_disqualified else "ACTIVE",
            "violation_count": user.total_violations,
            "history": user.disqualification_reason
        }