import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

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

# Static frontend distribution directory
FRONTEND_DIST = Path(__file__).parent.parent.parent / "frontend" / "dist"

if FRONTEND_DIST.exists():
    app.mount("/assets", StaticFiles(directory=str(FRONTEND_DIST / "assets")), name="assets")

    @app.get("/")
    def serve_frontend_root():
        return FileResponse(str(FRONTEND_DIST / "index.html"))

    @app.get("/app")
    def serve_frontend_app():
        return FileResponse(str(FRONTEND_DIST / "index.html"))

    @app.get("/api/info")
    def api_info():
        return {
            "system": "RailBlock-AI Enterprise Edition v3.0",
            "status": "OPERATIONAL",
            "docs_url": "/docs"
        }
else:
    @app.get("/")
    def root():
        return {
            "system": "RailBlock-AI Enterprise Edition v3.0",
            "status": "OPERATIONAL",
            "docs_url": "/docs"
        }
