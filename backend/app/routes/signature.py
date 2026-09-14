import base64
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database.models import Faculty
from app.schemas.schemas import SignatureCreate


router = APIRouter(
    prefix="/signature",
    tags=["Signature"]
)


@router.post("/")
def save_signature(
    data: SignatureCreate,
    db: Session = Depends(get_db)
):
    # Find faculty
    faculty = (
        db.query(Faculty)
        .filter(
            Faculty.faculty_id == data.faculty_id
        )
        .first()
    )

    if not faculty:
        raise HTTPException(
            status_code=404,
            detail="Faculty member not found"
        )

    # Prevent duplicate signatures
    if faculty.has_signed:
        raise HTTPException(
            status_code=409,
            detail="This faculty member has already signed."
        )

    # Check signature data
    if not data.signature:
        raise HTTPException(
            status_code=400,
            detail="Signature is required."
        )

    try:
        signature_data = data.signature

        # Make sure it is valid Base64
        if "," in signature_data:
            signature_data = signature_data.split(",", 1)[1]

        base64.b64decode(
            signature_data,
            validate=True
        )

        # Store the complete Base64 data in PostgreSQL
        faculty.signature_data = data.signature

        # Update faculty status
        faculty.has_signed = True
        faculty.signature_path = None
        faculty.signed_at = datetime.utcnow()

        db.commit()
        db.refresh(faculty)

        return {
            "message": "Signature saved successfully.",
            "faculty_id": faculty.faculty_id,
            "signed_at": faculty.signed_at
        }

    except HTTPException:
        raise

    except Exception:
        db.rollback()

        raise HTTPException(
            status_code=500,
            detail="Unable to save signature."
        )