from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.corridor import router as corridor_router
from app.api.blocks import router as blocks_router
from app.api.simulation import router as simulation_router
from app.api.emergency import router as emergency_router
from app.api.analytics import router as analytics_router
from app.api.advanced_features import router as advanced_router
from app.api.stations import router as stations_router
from app.api.advanced_tier3 import router as tier3_router

app = FastAPI(
    title="Indian Railways AI Block Planning & Asset Availability Maximizer (SIH26027)",
    description="Enterprise Decision Support & Constraint Optimizer for Multi-Department Rail Maintenance Possessions",
    version="3.0.0"
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
app.include_router(stations_router, prefix="/api")
app.include_router(tier3_router, prefix="/api")


@app.get("/")
def root():
    return {
        "system": "RailBlock-AI Enterprise Edition v3.0",
        "problem_statement": "SIH26027 - AI-Powered Automatic Block Planning to Maximize Asset Availability",
        "ministry": "Ministry of Railways (Indian Railways)",
        "division": "Prayagraj Division (NCR)",
        "coverage": "Pan-India National Station Graph & High-Density Corridors",
        "status": "OPERATIONAL",
        "enterprise_capabilities": [
            "Google OR-Tools CP-SAT Multi-Objective Constraint Optimizer",
            "Indian Railways Scott Formula Line Capacity Engine",
            "Heavy Track Machine Fleet Dispatcher (BCM, CSM, DTS, RGM, Tower Wagons)",
            "TSR 4-Day Speed Relaxation Recovery Modeler",
            "Station Yard Diamond Crossover & Platform Interlocking Matrix",
            "CRIS COA XML & JSON Export Protocols",
            "Pan-India Station Graph (641 Stations, 401 Junctions)",
            "Point Machine Current Signature Oscilloscope",
            "TRC & USFD Automated Flaw Ingestion",
            "Kavach Cab Signalling & ATP Telemetry HUD",
            "FOIS/COIS Freight Supply Chain SLA Optimizer",
            "CMS Crew Duty & HOER 10-Hour Tracker",
            "Indic Multilingual Voice & NLP Scheduling Assistant",
            "CBUI & PLA Official Railway Board Compliance Reports"
        ],
        "docs_url": "/docs"
    }
