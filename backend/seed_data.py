from app import create_app
from app.database.db import db
from app.models.user_model import User
from app.models.quiz_model import Quiz
from app.models.question_model import Question
from werkzeug.security import generate_password_hash

app = create_app()

def seed_database():
    with app.app_context():
        # 1. Create tables
        print("Creating database tables...")
        db.create_all()

        # 2. Check if Admin already exists
        if User.query.filter_by(email="admin@faircomp.com").first():
            print("Database already seeded. Skipping...")
            return

        # 3. Add Admin User
        print("Adding Admin user...")
        admin = User(
            username="admin",
            email="admin@faircomp.com",
            password_hash=generate_password_hash("admin123"),
            role="admin"
        )
        db.session.add(admin)

        # 4. Add a Sample Quiz
        print("Adding sample quiz...")
        sample_quiz = Quiz(
            title="General Programming & Logic",
            is_active=True
        )
        db.session.add(sample_quiz)
        db.session.flush() # Gets the quiz ID for the questions

        # 5. Add a Sample MCQ Question
        q1 = Question(
            quiz_id=sample_quiz.id,
            type="mcq",
            statement="What is the output of 2 + '2' in JavaScript?",
            points=10,
            options={"A": "4", "B": "22", "C": "TypeError", "D": "undefined"},
            correct_option="B"
        )

        # 6. Add a Sample Coding Question
        q2 = Question(
            quiz_id=sample_quiz.id,
            type="coding",
            statement="Write a function that returns the square of a number.",
            points=20,
            template_code="def solution(n):\n    # Write code here\n    pass",
            test_cases=[
                {"input": "2", "output": "4"},
                {"input": "5", "output": "25"}
            ]
        )

        db.session.add_all([q1, q2])
        db.session.commit()
        print("Successfully seeded the database! 🚀")

if __name__ == "__main__":
    seed_database()