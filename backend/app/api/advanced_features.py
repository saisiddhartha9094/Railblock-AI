from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List
from pydantic import BaseModel

from app.models.database import db
from app.engine.point_machine_diagnostics import point_diagnostics
from app.engine.trc_usfd_pipeline import trc_pipeline
from app.engine.kavach_telemetry import kavach_stream
from app.engine.fois_sla_engine import fois_engine
from app.engine.cms_crew_engine import cms_engine
from app.engine.indic_nlp_assistant import indic_nlp
from app.engine.compliance_reports import compliance_reports
from app.engine.optimizer import BlockOptimizer

router = APIRouter(prefix="/advanced", tags=["Advanced Enterprise Railway Modules"])


class VoiceCommandRequest(BaseModel):
    query_text: str
    user_role: str = "Section Controller / PRYJ"


# ---------------- 1. Point Machine Current Diagnostics ----------------
@router.get("/point-machine/diagnostics")
def get_point_machines_list() -> List[Dict[str, Any]]:
    return [point_diagnostics.generate_current_signature(pm["id"]) for pm in point_diagnostics.point_machines]


@router.get("/point-machine/signature/{point_id}")
def get_point_signature(point_id: str) -> Dict[str, Any]:
    return point_diagnostics.generate_current_signature(point_id)


@router.post("/point-machine/auto-demand/{point_id}")
def auto_generate_point_micro_block(point_id: str):
    demand = point_diagnostics.auto_generate_micro_block_demand(point_id)
    db.add_block_demand(demand)
    return {
        "status": "MICRO_BLOCK_DEMAND_GENERATED",
        "demand": demand,
        "details": f"Auto-synthesized predictive S&T block for point {point_id} based on current signature degradation."
    }


# ---------------- 2. TRC & USFD Pipeline ----------------
@router.get("/trc-usfd/overview")
def get_trc_usfd_overview() -> Dict[str, Any]:
    return trc_pipeline.get_track_health_overview()


@router.post("/trc-usfd/auto-demand/{segment_id}")
def auto_generate_civil_track_block(segment_id: str):
    demand = trc_pipeline.auto_generate_civil_block_demand(segment_id)
    db.add_block_demand(demand)
    return {
        "status": "CIVIL_TRACK_BLOCK_GENERATED",
        "demand": demand,
        "details": f"Statutory block demand generated for segment {segment_id} per RDSO TQI standard."
    }


# ---------------- 3. Kavach Telemetry Stream ----------------
@router.get("/kavach/telemetry")
def get_kavach_telemetry() -> List[Dict[str, Any]]:
    return kavach_stream.get_live_kavach_stream()


# ---------------- 4. FOIS / COIS Freight SLA Tracker ----------------
@router.get("/fois/freight-sla")
def get_fois_freight_sla() -> List[Dict[str, Any]]:
    return fois_engine.get_freight_sla_overview()


# ---------------- 5. CMS Crew Duty & HOER Tracker ----------------
@router.get("/cms/crew-duty")
def get_cms_crew_duty() -> List[Dict[str, Any]]:
    return cms_engine.get_crew_duty_status()


# ---------------- 6. Indic Multilingual NLP Assistant ----------------
@router.post("/voice/parse-command")
def parse_voice_command(request: VoiceCommandRequest):
    result = indic_nlp.parse_natural_language_command(request.query_text, request.user_role)
    # Auto-add demand to database
    generated_demand = result["generated_block_demand"]
    db.add_block_demand(generated_demand)
    return {
        "status": "PARSED_AND_SUBMITTED",
        "analysis": result
    }


# ---------------- 7 & 8. Compliance Reports (CBUI & PLA) ----------------
@router.get("/reports/cbui")
def get_cbui_compliance_report() -> Dict[str, Any]:
    demands = db.get_block_demands()
    timetable = db.get_timetable()
    optimizer = BlockOptimizer(demands, timetable)
    opt_res = optimizer.solve()
    return compliance_reports.generate_cbui_report(opt_res)


@router.get("/reports/pla")
def get_pla_punctuality_report() -> Dict[str, Any]:
    demands = db.get_block_demands()
    timetable = db.get_timetable()
    optimizer = BlockOptimizer(demands, timetable)
    opt_res = optimizer.solve()
    return compliance_reports.generate_pla_report(opt_res, timetable)
