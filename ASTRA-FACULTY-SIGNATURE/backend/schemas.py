"""
schemas.py
----------
Pydantic models that define the shape of API requests and responses.
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, field_validator


class FacultyOut(BaseModel):
    """Faculty record returned to the frontend (never includes the raw signature
    on list views to keep payloads small)."""

    id: int
    name: str
    department: str
    email: Optional[str] = None
    has_signed: bool

    class Config:
        from_attributes = True


class FacultyStatus(BaseModel):
    id: int
    name: str
    has_signed: bool
    signed_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class SignaturePayload(BaseModel):
    """What the frontend sends when submitting a signature."""

    signature: str  # base64 PNG data URL, e.g. "data:image/png;base64,...."

    @field_validator("signature")
    @classmethod
    def signature_must_be_present(cls, value: str) -> str:
        if not value or not value.strip():
            raise ValueError("Signature data is empty.")
        if not value.startswith("data:image"):
            raise ValueError("Signature must be a base64 image data URL.")
        # A blank canvas still produces a small but non-trivial PNG; a
        # meaningful signature drawing is reliably larger than this floor.
        if len(value) < 100:
            raise ValueError("Signature appears to be empty.")
        return value


class SignatureResponse(BaseModel):
    success: bool
    message: str
    faculty: str
    signed_at: datetime
