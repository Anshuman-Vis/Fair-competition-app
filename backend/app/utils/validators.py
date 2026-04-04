import re

class Validators:
    
    @staticmethod
    def validate_registration(data):
        """Ensures all required fields for a new user are present and valid."""
        errors = []
        
        # Check presence
        required = ['username', 'email', 'password']
        for field in required:
            if not data.get(field):
                errors.append(f"Field '{field}' is required.")

        if errors:
            return False, errors

        # Validate Email
        email_regex = r'^\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        if not re.match(email_regex, data['email']):
            errors.append("Invalid email format.")

        # Validate Username (alphanumeric, 3-20 chars)
        if not re.match(r'^[a-zA-Z0-9_]{3,20}$', data['username']):
            errors.append("Username must be 3-20 characters and alphanumeric.")

        return (len(errors) == 0), errors

    @staticmethod
    def validate_quiz_submission(data):
        """Validates the structure of a quiz submission."""
        if 'answers' not in data or not isinstance(data['answers'], dict):
            return False, "Answers must be a dictionary of {question_id: choice}."
        
        if 'time_taken' not in data:
            return False, "Time taken is required for ranking."
            
        return True, None

    @staticmethod
    def validate_coding_submission(data):
        """Validates a code execution request."""
        required = ['source_code', 'language', 'question_id']
        for field in required:
            if not data.get(field):
                return False, f"Missing coding field: {field}"
        
        # Check supported languages
        supported = ['python', 'javascript', 'cpp', 'java']
        if data['language'].lower() not in supported:
            return False, f"Language '{data['language']}' is not supported."
            
        return True, None