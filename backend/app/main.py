from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.database import Base, engine
from app.database import models
from app.database.seed import seed_faculty

from app.routes import faculty
from app.routes import signature


# Create database tables
Base.metadata.create_all(bind=engine)

# Synchronize faculty data
seed_faculty()

app = FastAPI(
    title="ASTRA 2K26 Faculty Signature API",
    description="Faculty check-in and digital signature backend",
    version="1.0.0"
)


# Allow React frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Register API routes
app.include_router(faculty.router)
app.include_router(signature.router)


@app.get("/")
def root():
    return {
        "message": "ASTRA 2K26 Faculty Signature API is running."
    }
    