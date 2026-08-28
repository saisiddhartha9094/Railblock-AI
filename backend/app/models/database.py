import json
import os
from typing import List, Dict, Optional, Any
from app.models.schemas import (
    Corridor, TrainSchedule, BlockDemand, ScheduledBlock,
    BlockStatus, Department, LineType, UrgencyLevel
)


DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")


class DataStore:
    def __init__(self):
        self.corridor: Optional[Corridor] = None
        self.timetable: List[TrainSchedule] = []
        self.block_demands: List[BlockDemand] = []
        self.scheduled_blocks: List[ScheduledBlock] = []
        self.audit_log: List[Dict[str, Any]] = []
        self.load_seed_data()

    def load_seed_data(self):
        # 1. Load Corridor
        corridor_path = os.path.join(DATA_DIR, "seed_corridor.json")
        if os.path.exists(corridor_path):
            with open(corridor_path, "r", encoding="utf-8") as f:
                corridor_data = json.load(f)
                self.corridor = Corridor(**corridor_data)

        # 2. Load Timetable
        timetable_path = os.path.join(DATA_DIR, "seed_timetable.json")
        if os.path.exists(timetable_path):
            with open(timetable_path, "r", encoding="utf-8") as f:
                trains_data = json.load(f)
                self.timetable = [TrainSchedule(**t) for t in trains_data]

        # 3. Load Block Demands
        demands_path = os.path.join(DATA_DIR, "seed_block_demands.json")
        if os.path.exists(demands_path):
            with open(demands_path, "r", encoding="utf-8") as f:
                demands_data = json.load(f)
                self.block_demands = [BlockDemand(**d) for d in demands_data]

        self.audit_log.append({
            "timestamp": "2026-08-28T10:00:00Z",
            "action": "SYSTEM_INIT",
            "actor": "CRIS_TMS_INGEST",
            "details": f"Loaded corridor {self.corridor.name if self.corridor else 'Unknown'}, {len(self.timetable)} train schedules, {len(self.block_demands)} departmental demands."
        })

    def get_corridor(self) -> Optional[Corridor]:
        return self.corridor

    def get_timetable(self) -> List[TrainSchedule]:
        return self.timetable

    def get_block_demands(self) -> List[BlockDemand]:
        return self.block_demands

    def add_block_demand(self, demand: BlockDemand) -> BlockDemand:
        self.block_demands.append(demand)
        self.audit_log.append({
            "timestamp": "2026-08-28T10:15:00Z",
            "action": "DEMAND_SUBMITTED",
            "actor": demand.submitted_by,
            "details": f"Submitted {demand.department} block request on {demand.section_id} ({demand.line_id}) for {demand.requested_duration_min} min."
        })
        return demand

    def get_scheduled_blocks(self) -> List[ScheduledBlock]:
        return self.scheduled_blocks

    def set_scheduled_blocks(self, blocks: List[ScheduledBlock]):
        self.scheduled_blocks = blocks

    def get_audit_log(self) -> List[Dict[str, Any]]:
        return list(reversed(self.audit_log))

    def add_audit_entry(self, action: str, actor: str, details: str):
        import datetime
        self.audit_log.append({
            "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
            "action": action,
            "actor": actor,
            "details": details
        })


db = DataStore()
