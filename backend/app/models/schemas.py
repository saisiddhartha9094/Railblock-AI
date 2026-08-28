from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum


class Department(str, Enum):
    ENGINEERING = "ENGINEERING"   # Civil Track Maintenance (BCM, CSM, TRT, Rail Grinding)
    SIGNAL_TELECOM = "SIGNAL_TELECOM"  # S&T (Point machine, Electronic Interlocking, Axle Counter)
    ELECTRICAL_OHE = "ELECTRICAL_OHE"  # OHE / TRD (25kV Catenary, Power Block, Tower Wagon)
    TRAFFIC_OPERATING = "TRAFFIC_OPERATING"  # Platform, Yard, Shunting line blocks


class TrainCategory(str, Enum):
    VANDE_BHARAT = "VANDE_BHARAT"
    RAJDHANI = "RAJDHANI"
    SUPERFAST = "SUPERFAST"
    MAIL_EXPRESS = "MAIL_EXPRESS"
    PASSENGER_MEMU = "PASSENGER_MEMU"
    FREIGHT_CONTAINER = "FREIGHT_CONTAINER"
    FREIGHT_HEAVY_HAUL = "FREIGHT_HEAVY_HAUL"  # BOXN Coal, BCN Foodgrains
    FREIGHT_GENERAL = "FREIGHT_GENERAL"


class LineType(str, Enum):
    UP_MAIN = "UP_MAIN"      # Direction: Towards Delhi (Subedarganj)
    DOWN_MAIN = "DOWN_MAIN"  # Direction: Towards Howrah (DDU)
    THIRD_LINE = "THIRD_LINE"  # Reversible Freight / Passenger
    LOOP_LINE = "LOOP_LINE"
    PLATFORM_LINE = "PLATFORM_LINE"


class UrgencyLevel(str, Enum):
    EMERGENCY = "EMERGENCY"         # Immediate rail fracture, OHE breakdown
    STATUTORY_RDSO = "STATUTORY_RDSO" # Mandatory maintenance per RDSO norms
    ROUTINE = "ROUTINE"             # Regular periodic maintenance
    DEFERRABLE = "DEFERRABLE"       # Optional enhancement/cosmetic


class BlockStatus(str, Enum):
    DRAFT = "DRAFT"
    SUBMITTED = "SUBMITTED"
    OPTIMIZED = "OPTIMIZED"
    CONCURRED = "CONCURRED"         # Signed off by relevant departments
    APPROVED = "APPROVED"           # Approved by Divisional Operations Controller
    REJECTED = "REJECTED"
    ACTIVE = "ACTIVE"
    COMPLETED = "COMPLETED"


# ---------------------- Corridor & Infrastructure ----------------------
class Station(BaseModel):
    id: str
    code: str
    name: str
    km: float
    num_platforms: int
    loop_lines: int
    has_freight_siding: bool = False
    interlocking_type: str = "Electronic Interlocking (EI)"


class Section(BaseModel):
    id: str
    name: str
    from_station: str
    to_station: str
    length_km: float
    max_speed_kmh: int = 130
    tracks: List[str]  # UP_MAIN, DOWN_MAIN, etc.
    gradient: str = "1 in 150"
    ohe_substation_id: str
    daily_train_capacity: int = 120
    current_utilization_pct: float = 95.0


class Corridor(BaseModel):
    id: str
    name: str
    zone: str
    division: str
    stations: List[Station]
    sections: List[Section]


# ---------------------- Timetable & Trains ----------------------
class TimetableStop(BaseModel):
    station_code: str
    arrival_time_min: int   # Minutes from 00:00 (0 to 1440)
    departure_time_min: int # Minutes from 00:00 (0 to 1440)
    stop_duration_min: int
    platform_assigned: Optional[int] = 1


class TrainSchedule(BaseModel):
    train_number: str
    train_name: str
    category: TrainCategory
    priority_weight: int    # 10 for Rajdhani/Vande Bharat, 3 for freight
    direction: str          # "UP" or "DOWN"
    origin: str
    destination: str
    stops: List[TimetableStop]
    length_wagons_coaches: int
    loco_type: str          # e.g., WAP-7, WAG-9, WAG-12
    max_permissible_speed: int = 130
    section_traversal_times: Dict[str, Dict[str, int]] = Field(default_factory=dict) # section_id -> {entry_min, exit_min}


# ---------------------- Block Demands & Optimization ----------------------
class EquipmentRequirement(BaseModel):
    equipment_type: str   # e.g., BCM, CSM, Tower Wagon, USFD trolley
    quantity: int = 1
    speed_kmh_to_site: int = 40


class BlockDemand(BaseModel):
    id: str
    department: Department
    section_id: str
    line_id: LineType
    work_description: str
    equipment_needed: List[EquipmentRequirement] = Field(default_factory=list)
    requested_duration_min: int
    min_continuous_duration_min: int
    urgency: UrgencyLevel
    preferred_time_start_min: Optional[int] = None
    preferred_time_end_min: Optional[int] = None
    is_power_block_required: bool = False
    is_traffic_block_required: bool = True
    speed_restriction_after_block_kmh: Optional[int] = None
    safety_code_reference: str = "IRPWM Para 1102 / RDSO TM-202"
    status: BlockStatus = BlockStatus.SUBMITTED
    submitted_by: str = "SSE/P-Way/PRYJ"


class ScheduledBlock(BaseModel):
    demand_id: str
    department: Department
    section_id: str
    line_id: LineType
    work_description: str
    scheduled_start_min: int
    scheduled_end_min: int
    duration_min: int
    is_clubbed: bool = False
    clubbed_with_ids: List[str] = Field(default_factory=list)
    clubbed_departments: List[Department] = Field(default_factory=list)
    affected_trains_count: int = 0
    estimated_delay_cost_min: float = 0.0
    status: BlockStatus = BlockStatus.OPTIMIZED
    justification: str = ""
    safety_compliance_verified: bool = True


class OptimizationResponse(BaseModel):
    solver_status: str
    solve_time_seconds: float
    total_blocks_scheduled: int
    clubbed_blocks_count: int
    clubbing_efficiency_pct: float
    asset_availability_index_before: float
    asset_availability_index_after: float
    total_train_delay_minutes_before: float
    total_train_delay_minutes_after: float
    delay_minutes_saved: float
    scheduled_blocks: List[ScheduledBlock]
    conflict_free: bool
    explanation_summary: str


# ---------------------- Simulation (What-If) ----------------------
class WhatIfScenarioRequest(BaseModel):
    section_id: str
    line_id: LineType
    proposed_start_min: int
    proposed_duration_min: int
    department: Department
    is_power_block: bool = False
    speed_restriction_kmh: Optional[int] = None


class AffectedTrainDetail(BaseModel):
    train_number: str
    train_name: str
    category: TrainCategory
    scheduled_entry_min: int
    rescheduled_entry_min: int
    delay_minutes: int
    action_taken: str  # e.g., "Regulated at Naini Jn Loop 2", "Diverted to 3rd Line", "Held at DDU"


class WhatIfScenarioResult(BaseModel):
    section_id: str
    line_id: LineType
    block_window_str: str
    total_affected_trains: int
    total_delay_minutes: int
    premium_train_delays_min: int
    freight_train_delays_min: int
    asset_availability_score_impact: float
    risk_level: str  # "LOW", "MODERATE", "SEVERE"
    recommendation: str
    alternative_slots: List[Dict[str, Any]]
    affected_trains: List[AffectedTrainDetail]


# ---------------------- Emergency Override ----------------------
class EmergencyBlockRequest(BaseModel):
    section_id: str
    line_id: LineType
    reason: str  # "Rail Fracture detected", "OHE Catenary snapped", "Point Machine failure"
    start_time_min: int
    estimated_duration_min: int
    speed_restriction_kmh: Optional[int] = 20
    reported_by: str = "Duty Station Master / Trackman"


class EmergencyBlockResponse(BaseModel):
    status: str
    emergency_block_id: str
    affected_active_trains: List[str]
    immediate_regulations: List[str]
    re_optimized_schedule_summary: str
    rescheduled_blocks_count: int
