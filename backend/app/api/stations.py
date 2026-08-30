from fastapi import APIRouter, HTTPException, Query
from typing import Dict, Any, Optional
from app.engine.station_network import national_network

router = APIRouter(prefix="/stations", tags=["Pan-India Station Master & Network"])


@router.get("")
def list_stations(
    limit: int = Query(50, ge=1, le=500),
    offset: int = Query(0, ge=0),
    zone: Optional[str] = None
) -> Dict[str, Any]:
    return national_network.list_stations(limit=limit, offset=offset, zone=zone)


@router.get("/search")
def search_stations(
    q: str = Query(..., min_length=1, description="Station code or name query (e.g. NDLS, Mumbai, Howrah, Chennai, Bangalore)"),
    limit: int = Query(50, ge=1, le=200)
) -> Dict[str, Any]:
    return national_network.search_stations(query=q, limit=limit)


@router.get("/stats")
def get_station_network_stats() -> Dict[str, Any]:
    return national_network.get_network_stats()


@router.get("/{code}")
def get_station_by_code(code: str) -> Dict[str, Any]:
    station = national_network.get_station(code)
    if not station:
        raise HTTPException(status_code=404, detail=f"Station code '{code}' not found in Pan-India registry")
    return station
