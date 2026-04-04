import requests
import os
import base64
from app.models.question_model import Question

class CodingService:
    # Use environment variables for production flexibility
    JUDGE0_URL = os.getenv("JUDGE0_URL", "http://localhost:2358")
    API_KEY = os.getenv("JUDGE0_API_KEY", "")
    
    # Judge0 language IDs
    LANG_MAP = {
        "python": 71,
        "javascript": 63,
        "cpp": 54,
        "java": 62
    }

    @classmethod
    def run_test_cases(cls, source_code, language, question_id):
        """
        Executes source code against all test cases for a specific question.
        """
        question = Question.query.get(question_id)
        if not question or not question.test_cases:
            return None, "Question or test cases not found"

        results = []
        total_passed = 0
        
        for test in question.test_cases:
            status, output = cls._execute_in_sandbox(
                source_code, 
                language, 
                test.get('input', ''), 
                test.get('output', '')
            )
            
            is_correct = (status == "Accepted")
            if is_correct:
                total_passed += 1
                
            results.append({
                "input": test.get('input'),
                "expected": test.get('output'),
                "actual": output,
                "status": status,
                "passed": is_correct
            })

        score = (total_passed / len(question.test_cases)) * question.points
        
        return {
            "score": round(score, 2),
            "passed": total_passed,
            "total": len(question.test_cases),
            "details": results
        }, None

    @classmethod
    def _execute_in_sandbox(cls, code, lang, stdin, expected):
        """
        Internal helper to communicate with Judge0.
        Uses Base64 encoding to prevent character corruption during transit.
        """
        endpoint = f"{cls.JUDGE0_URL}/submissions?wait=true&base64_encoded=true"
        
        headers = {
            "Content-Type": "application/json",
            "X-RapidAPI-Key": cls.API_KEY
        }

        # Encode inputs to Base64
        payload = {
            "source_code": base64.b64encode(code.encode()).decode(),
            "language_id": cls.LANG_MAP.get(lang.lower(), 71),
            "stdin": base64.b64encode(stdin.encode()).decode(),
            "expected_output": base64.b64encode(expected.encode()).decode()
        }

        try:
            response = requests.post(endpoint, json=payload, headers=headers, timeout=10)
            res_data = response.json()
            
            status = res_data.get('status', {}).get('description', 'Runtime Error')
            # Decode stdout if it exists, otherwise return the error message
            stdout_b64 = res_data.get('stdout') or res_data.get('compile_output') or ""
            stdout = base64.b64decode(stdout_b64).decode().strip() if stdout_b64 else ""
            
            return status, stdout
        except Exception as e:
            return "Server Error", str(e)