from fastapi import APIRouter
from app.models.database import db
from app.models.schemas import WhatIfScenarioRequest, WhatIfScenarioResult
from app.engine.simulator import CorridorSimulator

router = APIRouter(prefix="/simulation", tags=["What-If Simulation Sandbox"])


@router.post("/what-if", response_model=WhatIfScenarioResult)
def simulate_what_if_scenario(scenario: WhatIfScenarioRequest):
    timetable = db.get_timetable()
    simulator = CorridorSimulator(timetable)
    result = simulator.run_what_if_simulation(scenario)
    return result
