"""
database.py
------------
Sets up the SQLite database connection and session for ASTRA 2K26.
Also seeds the faculty table with initial records the first time it runs.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# SQLite file lives next to this script as astra.db
SQLALCHEMY_DATABASE_URL = "sqlite:///./astra.db"

# check_same_thread=False is required for SQLite when used with FastAPI's
# threaded request handling.
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """FastAPI dependency that yields a database session and closes it after use."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Example faculty used to seed the database on first run. Add more entries
# here any time — they will only be inserted if the table is empty.
SEED_FACULTY = [
    {"name": "Athish G", "department": "Artificial Intelligence", "email": "athish.g@astra2k26.edu"},
    {"name": "Mohan Kumar", "department": "Computer Science", "email": "mohan.kumar@astra2k26.edu"},
    {"name": "Priya Sharma", "department": "Electronics", "email": "priya.sharma@astra2k26.edu"},
    {"name": "Ravi Teja", "department": "Information Technology", "email": "ravi.teja@astra2k26.edu"},
    {"name": "Anitha Rao", "department": "Computer Science", "email": "anitha.rao@astra2k26.edu"},
]


def seed_database():
    """Insert the example faculty records if the table is currently empty."""
    from models import Faculty  # local import avoids circular import at module load

    db = SessionLocal()
    try:
        if db.query(Faculty).count() == 0:
            for entry in SEED_FACULTY:
                db.add(Faculty(**entry))
            db.commit()
    finally:
        db.close()
