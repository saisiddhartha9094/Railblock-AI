from fastapi import APIRouter, HTTPException, Response
from typing import Dict, Any, List
from pydantic import BaseModel

from app.models.database import db
from app.engine.line_capacity_engine import line_capacity_engine
from app.engine.machine_logistics_engine import machine_logistics_engine
from app.engine.tsr_recovery_engine import tsr_recovery_engine
from app.engine.yard_interlocking_engine import yard_engine
from app.engine.cris_coa_exporter import cris_exporter
from app.engine.optimizer import BlockOptimizer

router = APIRouter(prefix="/tier3", tags=["Tier-3 Production Engineering Modules"])


class MachineTransitRequest(BaseModel):
    machine_id: str
    destination_km: float
    block_start_min: int


# 1. Line Capacity (Scott Formula)
@router.get("/capacity/overview")
def get_line_capacity_overview() -> List[Dict[str, Any]]:
    return line_capacity_engine.get_corridor_capacity_overview()


# 2. Track Machine Logistics
@router.get("/machines/fleet")
def get_machine_fleet_status() -> List[Dict[str, Any]]:
    return machine_logistics_engine.get_fleet_status()


@router.post("/machines/route-transit")
def calculate_machine_transit(req: MachineTransitRequest) -> Dict[str, Any]:
    return machine_logistics_engine.calculate_transit_route(
        machine_id=req.machine_id,
        destination_km=req.destination_km,
        block_start_min=req.block_start_min
    )


# 3. TSR 4-Day Recovery Impact
@router.get("/tsr/recovery-impact")
def get_tsr_recovery_impact(length_km: float = 12.0, daily_trains: int = 145) -> Dict[str, Any]:
    return tsr_recovery_engine.compute_tsr_recovery_impact(length_km=length_km, daily_trains_count=daily_trains)


# 4. Station Yard Interlocking & Crossovers
@router.get("/yards/interlocking")
def get_yard_interlocking_overview() -> List[Dict[str, Any]]:
    return yard_engine.get_yard_interlocking_overview()


# 5. CRIS COA Exporters
@router.get("/export/cris-coa-json")
def export_cris_coa_json() -> Dict[str, Any]:
    demands = db.get_block_demands()
    timetable = db.get_timetable()
    optimizer = BlockOptimizer(demands, timetable)
    opt_res = optimizer.solve()
    return cris_exporter.export_to_cris_coa_json(opt_res)


@router.get("/export/cris-coa-xml")
def export_cris_coa_xml():
    demands = db.get_block_demands()
    timetable = db.get_timetable()
    optimizer = BlockOptimizer(demands, timetable)
    opt_res = optimizer.solve()
    xml_str = cris_exporter.export_to_cris_coa_xml(opt_res)
    return Response(content=xml_str, media_type="application/xml")
