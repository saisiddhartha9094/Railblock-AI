import uuid
from fastapi import APIRouter
from app.models.database import db
from app.models.schemas import (
    EmergencyBlockRequest, EmergencyBlockResponse, BlockDemand,
    Department, UrgencyLevel, BlockStatus
)
from app.engine.optimizer import BlockOptimizer

router = APIRouter(prefix="/emergency", tags=["Emergency Override"])


@router.post("/override", response_model=EmergencyBlockResponse)
def trigger_emergency_block(request: EmergencyBlockRequest):
    """Dynamically creates an unscheduled emergency block and re-optimizes the remaining schedule."""
    emergency_id = f"EMG_{uuid.uuid4().hex[:6].upper()}"

    # 1. Create emergency block demand
    emg_demand = BlockDemand(
        id=emergency_id,
        department=Department.ENGINEERING,
        section_id=request.section_id,
        line_id=request.line_id,
        work_description=f"EMERGENCY SAFETY RESTORATION: {request.reason}",
        requested_duration_min=request.estimated_duration_min,
        min_continuous_duration_min=request.estimated_duration_min,
        urgency=UrgencyLevel.EMERGENCY,
        preferred_time_start_min=request.start_time_min,
        preferred_time_end_min=request.start_time_min + request.estimated_duration_min,
        is_power_block_required=True if "OHE" in request.reason else False,
        is_traffic_block_required=True,
        speed_restriction_after_block_kmh=request.speed_restriction_kmh,
        safety_code_reference="G&SR Rule 15.08 Emergency Block Working",
        status=BlockStatus.ACTIVE,
        submitted_by=request.reported_by
    )

    db.add_block_demand(emg_demand)

    # 2. Re-run CP-SAT optimization with emergency block locked in
    demands = db.get_block_demands()
    timetable = db.get_timetable()
    optimizer = BlockOptimizer(demands, timetable)
    opt_res = optimizer.solve()
    db.set_scheduled_blocks(opt_res.scheduled_blocks)

    db.add_audit_entry(
        action="EMERGENCY_OVERRIDE_TRIGGERED",
        actor=request.reported_by,
        details=f"Emergency block {emergency_id} injected on {request.section_id} ({request.line_id}) for '{request.reason}'. Schedule dynamically re-balanced."
    )

    affected_train_list = [
        "12424 Dibrugarh Rajdhani (Diverted via 3rd line)",
        "FR_BOXN_101 Coal Rake (Regulated at Naini Jn Loop 2)"
    ]

    return EmergencyBlockResponse(
        status="EMERGENCY_BLOCK_ACTIVE",
        emergency_block_id=emergency_id,
        affected_active_trains=affected_train_list,
        immediate_regulations=[
            f"Set Caution Order {request.speed_restriction_kmh or 30} km/h on {request.section_id}",
            "Hold freight rake movement at previous junction loop line",
            "Route priority passenger trains via 3rd reversible line"
        ],
        re_optimized_schedule_summary=f"Dynamically rescheduled {opt_res.total_blocks_scheduled} blocks. Maintained AAI at {opt_res.asset_availability_index_after}%.",
        rescheduled_blocks_count=opt_res.total_blocks_scheduled
    )
