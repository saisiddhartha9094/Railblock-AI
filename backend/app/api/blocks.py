from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from app.models.database import db
from app.models.schemas import (
    BlockDemand, ScheduledBlock, OptimizationResponse, BlockStatus
)
from app.engine.optimizer import BlockOptimizer
from app.engine.rules import RDSORuleEngine

router = APIRouter(prefix="/blocks", tags=["Block Planning & Optimization"])


@router.get("/demands", response_model=List[BlockDemand])
def get_block_demands():
    return db.get_block_demands()


@router.post("/demands", response_model=Dict[str, Any])
def submit_block_demand(demand: BlockDemand):
    # 1. Validate against RDSO rules
    validation = RDSORuleEngine.validate_block_demand(demand)
    if not validation["is_valid"]:
        raise HTTPException(status_code=400, detail={
            "message": "Block demand violates statutory RDSO safety rules",
            "violations": validation["violations"]
        })

    saved = db.add_block_demand(demand)
    return {
        "status": "SUCCESS",
        "demand": saved,
        "validation": validation
    }


@router.post("/optimize", response_model=OptimizationResponse)
def run_block_optimization():
    demands = db.get_block_demands()
    timetable = db.get_timetable()

    if not demands:
        raise HTTPException(status_code=400, detail="No block demands available to optimize")

    optimizer = BlockOptimizer(demands, timetable)
    result = optimizer.solve()

    # Save scheduled blocks into database
    db.set_scheduled_blocks(result.scheduled_blocks)

    db.add_audit_entry(
        action="SCHEDULE_OPTIMIZED",
        actor="CP_SAT_SOLVER",
        details=f"Optimized {result.total_blocks_scheduled} blocks with {result.clubbed_blocks_count} clubbed pairs. AAI improved to {result.asset_availability_index_after}%."
    )

    return result


@router.get("/scheduled", response_model=List[ScheduledBlock])
def get_scheduled_blocks():
    # If no scheduled blocks exist yet, trigger initial optimization automatically
    blocks = db.get_scheduled_blocks()
    if not blocks:
        demands = db.get_block_demands()
        timetable = db.get_timetable()
        optimizer = BlockOptimizer(demands, timetable)
        result = optimizer.solve()
        db.set_scheduled_blocks(result.scheduled_blocks)
        return result.scheduled_blocks
    return blocks


@router.post("/sign-off/{demand_id}")
def sign_off_block(demand_id: str, department_signer: str, role: str):
    blocks = db.get_scheduled_blocks()
    found = False
    for b in blocks:
        if b.demand_id == demand_id:
            b.status = BlockStatus.CONCURRED
            found = True
            break

    if not found:
        raise HTTPException(status_code=404, detail="Scheduled block not found")

    db.add_audit_entry(
        action="BLOCK_SIGN_OFF",
        actor=f"{department_signer} ({role})",
        details=f"Concurrence granted for block {demand_id} on {b.section_id}."
    )

    return {
        "status": "SUCCESS",
        "demand_id": demand_id,
        "new_status": BlockStatus.CONCURRED,
        "signed_by": department_signer
    }
