from app.database.database import SessionLocal, engine, Base
from app.database.models import Faculty


# Create database tables
Base.metadata.create_all(bind=engine)


faculty_data = [
    {
        "faculty_id": "FAC001",
        "name": "Dr. Arjun Sharma",
        "department": "Computer Science"
    },
    {
        "faculty_id": "FAC002",
        "name": "Dr. Priya Mehta",
        "department": "Electronics"
    },
    {
        "faculty_id": "FAC003",
        "name": "Dr. Rahul Verma",
        "department": "Mechanical Engineering"
    },
    {
        "faculty_id": "FAC004",
        "name": "Dr. Sneha Kapoor",
        "department": "Information Technology"
    },
    {
        "faculty_id": "FAC005",
        "name": "Dr. Aditya Singh",
        "department": "Civil Engineering"
    },
    {
        "faculty_id": "TEST001",
        "name": "Test Faculty",
        "department": "Testing"
    },
    {
        "faculty_id": "TEST002",
        "name": "Test Faculty",
        "department": "Testing"
    },
    {
        "faculty_id": "TEST003",
        "name": "Test Faculty",
        "department": "Testing"
    },
    {
        "faculty_id": "shusmitha",
        "name": "Shusmitha",
        "department": "Testing"
    },
    {
        "faculty_id": "Bhasmita",
        "name": "Bhasmita",
        "department": "Testing"
    },
    {
        "faculty_id": "Mohith",
        "name": "Mohith",
        "department": "Testing"
    },
    {
        "faculty_id": "Faizan",
        "name": "Faizan",
        "department": "Testing"
    }
]


def seed_faculty():
    db = SessionLocal()

    try:
        for data in faculty_data:

            faculty = (
                db.query(Faculty)
                .filter(
                    Faculty.faculty_id == data["faculty_id"]
                )
                .first()
            )

            if faculty:
                # Update name and department
                faculty.name = data["name"]
                faculty.department = data["department"]

                print(
                    f"Updated faculty: {data['faculty_id']}"
                )

            else:
                # Add new faculty
                faculty = Faculty(
                    faculty_id=data["faculty_id"],
                    name=data["name"],
                    department=data["department"],
                    has_signed=False
                )

                db.add(faculty)

                print(
                    f"Added faculty: {data['faculty_id']}"
                )

        db.commit()

        print("Faculty data synchronized successfully!")

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()