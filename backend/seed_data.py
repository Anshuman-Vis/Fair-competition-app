"""
Database Seeding Script
Creates sample data for development and testing.
"""
from app import create_app
from app.database import db
from app.models.user_model import User
from app.models.quiz_model import Quiz
from app.models.question_model import Question
from werkzeug.security import generate_password_hash
from datetime import datetime, timedelta

app = create_app()

def seed_database():
    """
    Seeds the database with sample data for development.
    Creates admin user, sample quizzes, and questions.
    """
    with app.app_context():
        print("🌱 Seeding database...")

        # Create tables
        print("📋 Creating database tables...")
        db.create_all()

        # Check if data already exists
        if User.query.filter_by(email="admin@faircomp.com").first():
            print("✅ Database already seeded. Skipping...")
            return

        # Create Admin User
        print("👤 Creating admin user...")
        admin = User(
            username="admin",
            email="admin@faircomp.com",
            full_name="System Administrator",
            roll_number="ADMIN001",
            role="admin"
        )
        admin.set_password("admin123")
        db.session.add(admin)

        # Create Sample Student
        print("🎓 Creating sample student...")
        student = User(
            username="student001",
            email="student@faircomp.com",
            full_name="John Doe",
            roll_number="STU001",
            role="student"
        )
        student.set_password("student123")
        db.session.add(student)

        # Create Sample Quiz 1
        print("📝 Creating sample quiz 1...")
        quiz1 = Quiz(
            title="Python Programming Fundamentals",
            description="Test your knowledge of Python basics including data types, control structures, and functions.",
            duration=30,
            question_count=5,
            total_marks=50,
            passing_marks=25,
            is_active=True,
            start_time=datetime.utcnow(),
            end_time=datetime.utcnow() + timedelta(days=7)
        )
        db.session.add(quiz1)
        db.session.flush()

        # Questions for Quiz 1
        questions_quiz1 = [
            Question(
                quiz_id=quiz1.id,
                text="What is the output of print(2 + 3 * 4) in Python?",
                options=["14", "20", "24", "26"],
                correct_answer=1,  # Index 1 = "20"
                marks=10,
                explanation="According to operator precedence, multiplication (*) has higher precedence than addition (+), so 3 * 4 = 12, then 2 + 12 = 14.",
                order=1
            ),
            Question(
                quiz_id=quiz1.id,
                text="Which of the following is NOT a valid Python data type?",
                options=["int", "str", "float", "double"],
                correct_answer=3,  # Index 3 = "double"
                marks=10,
                explanation="Python does not have a 'double' data type. It uses 'float' for floating-point numbers.",
                order=2
            ),
            Question(
                quiz_id=quiz1.id,
                text="What does the 'len()' function return?",
                options=["Length of a string", "Length of a list", "Both A and B", "None of the above"],
                correct_answer=2,  # Index 2 = "Both A and B"
                marks=10,
                explanation="The len() function works with strings, lists, tuples, dictionaries, and other sequence types.",
                order=3
            ),
            Question(
                quiz_id=quiz1.id,
                text="Which keyword is used to define a function in Python?",
                options=["func", "def", "function", "define"],
                correct_answer=1,  # Index 1 = "def"
                marks=10,
                explanation="'def' is the keyword used to define functions in Python.",
                order=4
            ),
            Question(
                quiz_id=quiz1.id,
                text="What is the correct way to create a list in Python?",
                options=["list = (1, 2, 3)", "list = {1, 2, 3}", "list = [1, 2, 3]", "list = '1, 2, 3'"],
                correct_answer=2,  # Index 2 = "list = [1, 2, 3]"
                marks=10,
                explanation="Square brackets [] are used to create lists in Python.",
                order=5
            )
        ]

        for question in questions_quiz1:
            db.session.add(question)

        # Create Sample Quiz 2
        print("📝 Creating sample quiz 2...")
        quiz2 = Quiz(
            title="Data Structures & Algorithms",
            description="Challenge yourself with questions about common data structures and algorithmic concepts.",
            duration=45,
            question_count=4,
            total_marks=40,
            passing_marks=20,
            is_active=True,
            start_time=datetime.utcnow(),
            end_time=datetime.utcnow() + timedelta(days=7)
        )
        db.session.add(quiz2)
        db.session.flush()

        # Questions for Quiz 2
        questions_quiz2 = [
            Question(
                quiz_id=quiz2.id,
                text="What is the time complexity of accessing an element in an array by index?",
                options=["O(1)", "O(log n)", "O(n)", "O(n²)"],
                correct_answer=0,  # Index 0 = "O(1)"
                marks=10,
                explanation="Array access by index is O(1) because it uses direct memory addressing.",
                order=1
            ),
            Question(
                quiz_id=quiz2.id,
                text="Which data structure follows LIFO (Last In, First Out) principle?",
                options=["Queue", "Stack", "Array", "Linked List"],
                correct_answer=1,  # Index 1 = "Stack"
                marks=10,
                explanation="Stack follows LIFO principle - the last element added is the first one to be removed.",
                order=2
            ),
            Question(
                quiz_id=quiz2.id,
                text="What is the worst-case time complexity of QuickSort?",
                options=["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
                correct_answer=2,  # Index 2 = "O(n²)"
                marks=10,
                explanation="QuickSort has O(n²) worst-case time complexity when the pivot selection is poor.",
                order=3
            ),
            Question(
                quiz_id=quiz2.id,
                text="Which of the following is NOT a stable sorting algorithm?",
                options=["Bubble Sort", "Merge Sort", "Quick Sort", "Insertion Sort"],
                correct_answer=2,  # Index 2 = "Quick Sort"
                marks=10,
                explanation="Quick Sort is not a stable sorting algorithm, while Bubble Sort, Merge Sort, and Insertion Sort are stable.",
                order=4
            )
        ]

        for question in questions_quiz2:
            db.session.add(question)

        # Commit all changes
        db.session.commit()
        print("✅ Database seeded successfully!")
        print("📊 Created:")
        print("   • 1 Admin user (admin@faircomp.com / admin123)")
        print("   • 1 Sample student (student@faircomp.com / student123)")
        print("   • 2 Sample quizzes with questions")

if __name__ == "__main__":
    seed_database()