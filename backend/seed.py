from app.database.database import SessionLocal, engine, Base
from app.database.models import Faculty


# Create database tables
Base.metadata.create_all(bind=engine)


demo_faculty = [
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


db = SessionLocal()


try:
    for faculty_data in demo_faculty:

        existing_faculty = (
            db.query(Faculty)
            .filter(
                Faculty.faculty_id == faculty_data["faculty_id"]
            )
            .first()
        )

        if existing_faculty:
            print(
                f"{faculty_data['faculty_id']} already exists. Skipping."
            )
            continue

        faculty = Faculty(
            faculty_id=faculty_data["faculty_id"],
            name=faculty_data["name"],
            department=faculty_data["department"]
        )

        db.add(faculty)

    db.commit()

    print("Demo faculty data added successfully!")


finally:
    db.close()