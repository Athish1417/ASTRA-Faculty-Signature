from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database.models import Faculty

router = APIRouter(
    prefix="/faculty",
    tags=["Faculty"]
)


@router.get("/")
def get_faculty(db: Session = Depends(get_db)):
    faculty = db.query(Faculty).all()

    return faculty


@router.get("/{faculty_id}")
def get_faculty_by_id(
    faculty_id: str,
    db: Session = Depends(get_db)
):
    faculty = (
        db.query(Faculty)
        .filter(Faculty.faculty_id == faculty_id)
        .first()
    )

    if not faculty:
        raise HTTPException(
            status_code=404,
            detail="Faculty member not found"
        )

    return faculty