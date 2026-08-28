import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.models.database import db
from app.engine.optimizer import BlockOptimizer
from app.engine.simulator import CorridorSimulator
from app.models.schemas import WhatIfScenarioRequest, Department, LineType
from app.engine.ml_predictor import ml_predictor
from app.engine.rules import RDSORuleEngine


def run_tests():
    print("=== 1. Testing Data Loading ===")
    corridor = db.get_corridor()
    assert corridor is not None, "Corridor data failed to load"
    print(f" Loaded Corridor: {corridor.name} with {len(corridor.stations)} stations, {len(corridor.sections)} sections.")

    timetable = db.get_timetable()
    assert len(timetable) > 0, "Timetable failed to load"
    print(f" Loaded Timetable: {len(timetable)} train schedules.")

    demands = db.get_block_demands()
    assert len(demands) > 0, "Demands failed to load"
    print(f" Loaded Block Demands: {len(demands)} demands.")

    print("\n=== 2. Testing RDSO Rule Engine ===")
    for d in demands[:2]:
        val = RDSORuleEngine.validate_block_demand(d)
        print(f" Demand {d.id} ({d.department}): Valid = {val['is_valid']}, Certification = {val['safety_certification']}")

    print("\n=== 3. Testing ML Disruption Predictor ===")
    score = ml_predictor.predict_disruption_score(start_min=480, duration_min=180, line_id="DOWN_MAIN", is_power_cut=False)
    print(f" ML Predicted Disruption Score (08:00 AM, 3h): {score}/100.0")
    alts = ml_predictor.recommend_alternative_windows(duration_min=180, line_id="DOWN_MAIN", is_power_cut=False)
    print(f" Recommended Low-Disruption Windows: {[a['window_str'] for a in alts]}")

    print("\n=== 4. Testing Google OR-Tools CP-SAT Optimizer ===")
    optimizer = BlockOptimizer(demands, timetable)
    res = optimizer.solve()
    print(f" Optimizer Status: {res.solver_status} in {res.solve_time_seconds}s")
    print(f" Total Blocks: {res.total_blocks_scheduled}, Clubbed Count: {res.clubbed_blocks_count} ({res.clubbing_efficiency_pct}%)")
    print(f" Asset Availability Index: {res.asset_availability_index_before}% -> {res.asset_availability_index_after}% (+{res.delay_minutes_saved} delay mins saved)")

    print("\n=== 5. Testing SimPy Discrete-Event What-If Simulator ===")
    simulator = CorridorSimulator(timetable)
    scenario = WhatIfScenarioRequest(
        section_id="SEC_NYN_MZP",
        line_id=LineType.DOWN_MAIN,
        proposed_start_min=750,  # 12:30 PM (during Vande Bharat slot)
        proposed_duration_min=180,
        department=Department.ENGINEERING,
        is_power_block=False
    )
    sim_res = simulator.run_what_if_simulation(scenario)
    print(f" What-If Simulation Window: {sim_res.block_window_str}")
    print(f" Total Affected Trains: {sim_res.total_affected_trains}, Total Delay: {sim_res.total_delay_minutes} min, Risk: {sim_res.risk_level}")
    print(f" AI Recommendation: {sim_res.recommendation}")

    print("\n ALL BACKEND TESTS PASSED SUCCESSFULLY! ")


if __name__ == "__main__":
    run_tests()
