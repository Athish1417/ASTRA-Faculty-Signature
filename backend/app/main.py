from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.database import Base, engine
from app.database import models
from app.database.seed import seed_faculty

from app.routes import faculty
from app.routes import signature


# ============================================================
# DATABASE SETUP
# ============================================================

# Create database tables
Base.metadata.create_all(bind=engine)


# Synchronize faculty data
seed_faculty()


# ============================================================
# FASTAPI APPLICATION
# ============================================================

app = FastAPI(
    title="ASTRA 2K26 Faculty Signature API",
    description="Faculty check-in and digital signature backend",
    version="1.0.0"
)


# ============================================================
# CORS
# ============================================================

# Allow React frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# API ROUTES
# ============================================================

# Register faculty routes
app.include_router(faculty.router)

# Register signature routes
app.include_router(signature.router)


# ============================================================
# ROOT ENDPOINT
# ============================================================

@app.get("/")
def root():
    return {
        "message": "ASTRA 2K26 Faculty Signature API is running."
    }


# ============================================================
# HEALTH CHECK ENDPOINT
# ============================================================

# IMPORTANT:
# UptimeRobot Free uses HEAD requests by default.
# FastAPI's @app.get() alone was returning 405 for HEAD.
#
# This route now accepts BOTH:
# GET  /health
# HEAD /health

@app.api_route(
    "/health",
    methods=["GET", "HEAD"]
)
def health():
    return {
        "status": "ok"
    }