from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.corridor import router as corridor_router
from app.api.blocks import router as blocks_router
from app.api.simulation import router as simulation_router
from app.api.emergency import router as emergency_router
from app.api.analytics import router as analytics_router
from app.api.advanced_features import router as advanced_router

app = FastAPI(
    title="Indian Railways AI Block Planning & Asset Availability Maximizer (SIH26027)",
    description="Enterprise Decision Support & Constraint Optimizer for Multi-Department Rail Maintenance Possessions",
    version="2.0.0"
)

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(corridor_router, prefix="/api")
app.include_router(blocks_router, prefix="/api")
app.include_router(simulation_router, prefix="/api")
app.include_router(emergency_router, prefix="/api")
app.include_router(analytics_router, prefix="/api")
app.include_router(advanced_router, prefix="/api")


@app.get("/")
def root():
    return {
        "system": "RailBlock-AI Core Engine v2.0",
        "problem_statement": "SIH26027 - AI-Powered Automatic Block Planning to Maximize Asset Availability",
        "ministry": "Ministry of Railways (Indian Railways)",
        "division": "Prayagraj Division (NCR)",
        "status": "OPERATIONAL",
        "enterprise_modules": [
            "Point Machine Current Signature Diagnostics",
            "TRC & USFD Flaw Ingestion Pipeline",
            "Kavach Cab Signalling & GPS Telemetry",
            "FOIS/COIS Freight Supply Chain SLA Engine",
            "CMS Crew Duty & HOER 10-Hour Tracker",
            "Indic Multilingual Voice Assistant (Hindi, Bengali, Telugu, Tamil, Marathi)",
            "Google OR-Tools CP-SAT Constraint Optimizer",
            "Automated CBUI & PLA Compliance Reports"
        ],
        "docs_url": "/docs"
    }
