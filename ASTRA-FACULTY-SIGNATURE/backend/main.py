"""
main.py
-------
ASTRA 2K26 — Faculty Digital Signature & Attendance System
FastAPI backend.

Endpoints:
    GET  /faculty                  -> list all faculty (for the selection screen)
    GET  /faculty/{id}             -> details for one faculty member
    GET  /faculty/{id}/status      -> whether they have already signed
    POST /faculty/{id}/signature   -> submit a signature (blocked if already signed)
"""

from datetime import datetime, timezone

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import Base, engine, get_db, seed_database
from models import Faculty
from schemas import FacultyOut, FacultyStatus, SignaturePayload, SignatureResponse

# Create tables (if they don't already exist) and seed example faculty.
Base.metadata.create_all(bind=engine)
seed_database()

app = FastAPI(title="ASTRA 2K26 Faculty Signature API")

# CORS: allow the Vite dev server and any deployed frontend origin.
# In production, replace "*" with the real frontend URL for tighter security.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"status": "ok", "service": "ASTRA 2K26 Faculty Signature API"}

@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/faculty", response_model=list[FacultyOut])
def list_faculty(db: Session = Depends(get_db)):
    """Returns every faculty member, used to populate the name-selection screen."""
    return db.query(Faculty).order_by(Faculty.name.asc()).all()


@app.get("/faculty/{faculty_id}", response_model=FacultyOut)
def get_faculty(faculty_id: int, db: Session = Depends(get_db)):
    """Returns a single faculty member's details."""
    faculty = db.query(Faculty).filter(Faculty.id == faculty_id).first()
    if not faculty:
        raise HTTPException(status_code=404, detail="Faculty member not found.")
    return faculty


@app.get("/faculty/{faculty_id}/status", response_model=FacultyStatus)
def get_faculty_status(faculty_id: int, db: Session = Depends(get_db)):
    """Used before showing the signature screen, to catch already-signed faculty early."""
    faculty = db.query(Faculty).filter(Faculty.id == faculty_id).first()
    if not faculty:
        raise HTTPException(status_code=404, detail="Faculty member not found.")
    return faculty


@app.post("/faculty/{faculty_id}/signature", response_model=SignatureResponse)
def submit_signature(
    faculty_id: int, payload: SignaturePayload, db: Session = Depends(get_db)
):
    """
    Records a faculty member's digital signature.
    Rejects the request if the faculty member has already signed, preventing
    duplicate attendance records from the shared event QR code.
    """
    faculty = db.query(Faculty).filter(Faculty.id == faculty_id).first()
    if not faculty:
        raise HTTPException(status_code=404, detail="Faculty member not found.")

    if faculty.has_signed:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={
                "message": "Signature Already Recorded",
                "detail": "Your signature has already been recorded for ASTRA 2K26.",
                "signed_at": faculty.signed_at.isoformat() if faculty.signed_at else None,
            },
        )

    faculty.signature = payload.signature
    faculty.has_signed = True
    faculty.signed_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(faculty)

    return SignatureResponse(
        success=True,
        message="Signature recorded successfully",
        faculty=faculty.name,
        signed_at=faculty.signed_at,
    )
