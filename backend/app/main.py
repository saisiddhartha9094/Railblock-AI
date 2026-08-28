from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.corridor import router as corridor_router
from app.api.blocks import router as blocks_router
from app.api.simulation import router as simulation_router
from app.api.emergency import router as emergency_router
from app.api.analytics import router as analytics_router

app = FastAPI(
    title="Indian Railways AI Block Planning & Asset Availability Maximizer (SIH26027)",
    description="Enterprise Decision Support & Constraint Optimizer for Multi-Department Rail Maintenance Possessions",
    version="1.0.0"
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


@app.get("/")
def root():
    return {
        "system": "RailBlock-AI Core Engine",
        "problem_statement": "SIH26027 - AI-Powered Automatic Block Planning to Maximize Asset Availability",
        "ministry": "Ministry of Railways (Indian Railways)",
        "division": "Prayagraj Division (NCR)",
        "status": "OPERATIONAL",
        "docs_url": "/docs"
    }
