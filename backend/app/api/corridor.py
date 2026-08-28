from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from app.models.database import db
from app.models.schemas import Corridor, TrainSchedule

router = APIRouter(prefix="/corridor", tags=["Corridor & Timetable"])


@router.get("", response_model=Corridor)
def get_corridor_details():
    corridor = db.get_corridor()
    if not corridor:
        raise HTTPException(status_code=404, detail="Corridor data not found")
    return corridor


@router.get("/timetable", response_model=List[TrainSchedule])
def get_train_timetable():
    return db.get_timetable()


@router.get("/live-status")
def get_live_corridor_status() -> Dict[str, Any]:
    """Returns live train coordinates, section occupancy, and active speed restrictions."""
    corridor = db.get_corridor()
    timetable = db.get_timetable()
    scheduled_blocks = db.get_scheduled_blocks()

    # Active train locations (simulated at current clock time: e.g. 10:30 AM = 630 min)
    current_sim_time = 630  # 10:30 AM IST

    active_trains = []
    for t in timetable:
        for sec_id, bounds in t.section_traversal_times.items():
            if bounds["entry_min"] <= current_sim_time <= bounds["exit_min"]:
                progress_pct = round(((current_sim_time - bounds["entry_min"]) / max(1, bounds["exit_min"] - bounds["entry_min"])) * 100, 1)
                active_trains.append({
                    "train_number": t.train_number,
                    "train_name": t.train_name,
                    "category": t.category,
                    "direction": t.direction,
                    "current_section_id": sec_id,
                    "progress_pct": progress_pct,
                    "loco_type": t.loco_type,
                    "speed_kmh": t.max_permissible_speed - 10
                })

    return {
        "current_sim_time_min": current_sim_time,
        "current_sim_time_str": "10:30 IST",
        "active_trains": active_trains,
        "total_active_trains": len(active_trains),
        "active_blocks_count": len([b for b in scheduled_blocks if b.scheduled_start_min <= current_sim_time <= b.scheduled_end_min]),
        "corridor_health": "OPTIMAL",
        "electrification_status": "25kV ENERGIZED",
        "signalling_system": "AUTOMATIC BLOCK (ABS) / KAVACH ACTIVE"
    }
