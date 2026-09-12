from sqlalchemy import Column, Integer, String, Boolean, DateTime
from datetime import datetime

from .database import Base


class Faculty(Base):
    __tablename__ = "faculty"

    id = Column(Integer, primary_key=True, index=True)

    faculty_id = Column(String, unique=True, index=True, nullable=False)

    name = Column(String, nullable=False)

    department = Column(String, nullable=True)

    has_signed = Column(Boolean, default=False, nullable=False)

    signature_path = Column(String, nullable=True)

    signed_at = Column(DateTime, nullable=True)