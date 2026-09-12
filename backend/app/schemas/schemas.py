from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class FacultyCreate(BaseModel):
    faculty_id: str
    name: str
    department: Optional[str] = None


class FacultyResponse(BaseModel):
    id: int
    faculty_id: str
    name: str
    department: Optional[str] = None
    has_signed: bool
    signed_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class SignatureCreate(BaseModel):
    faculty_id: str
    signature: str


class SignatureResponse(BaseModel):
    message: str
    faculty_id: str
    signed_at: datetime