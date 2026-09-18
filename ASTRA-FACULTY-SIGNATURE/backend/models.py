"""
models.py
---------
SQLAlchemy ORM model for the faculty table.
"""

from sqlalchemy import Column, Integer, String, Boolean, Text, DateTime
from database import Base


class Faculty(Base):
    __tablename__ = "faculty"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    department = Column(String, nullable=False)
    email = Column(String, nullable=True)

    has_signed = Column(Boolean, default=False, nullable=False)
    signature = Column(Text, nullable=True)  # Base64 PNG data URL
    signed_at = Column(DateTime, nullable=True)
