import base64
import os
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


SIGNATURE_FOLDER = "signatures"

os.makedirs(SIGNATURE_FOLDER, exist_ok=True)


@router.post("/")
def save_signature(
    data: SignatureCreate,
    db: Session = Depends(get_db)
):
    # Find faculty
    faculty = (
        db.query(Faculty)
        .filter(Faculty.faculty_id == data.faculty_id)
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

    # Check that signature data exists
    if not data.signature:
        raise HTTPException(
            status_code=400,
            detail="Signature is required."
        )

    try:
        # Remove the data URL prefix
        signature_data = data.signature

        if "," in signature_data:
            signature_data = signature_data.split(",", 1)[1]

        # Convert Base64 → image bytes
        image_data = base64.b64decode(signature_data)

        # Create unique filename
        filename = f"{faculty.faculty_id}.png"

        filepath = os.path.join(
            SIGNATURE_FOLDER,
            filename
        )

        # Save signature image
        with open(filepath, "wb") as image_file:
            image_file.write(image_data)

        # Update database
        faculty.has_signed = True
        faculty.signature_path = filepath
        faculty.signed_at = datetime.utcnow()

        db.commit()
        db.refresh(faculty)

        return {
            "message": "Signature saved successfully.",
            "faculty_id": faculty.faculty_id,
            "signed_at": faculty.signed_at
        }

    except Exception:
        db.rollback()

        raise HTTPException(
            status_code=500,
            detail="Unable to save signature."
        )