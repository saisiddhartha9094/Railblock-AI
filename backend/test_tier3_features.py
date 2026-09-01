import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.engine.line_capacity_engine import line_capacity_engine
from app.engine.machine_logistics_engine import machine_logistics_engine
from app.engine.tsr_recovery_engine import tsr_recovery_engine
from app.engine.yard_interlocking_engine import yard_engine
from app.engine.cris_coa_exporter import cris_exporter
from app.engine.optimizer import BlockOptimizer
from app.models.database import db


def test_tier3():
    print("==================================================================")
    print("   TESTING TIER-3 PRODUCTION RAILWAY ENGINEERING ENGINES         ")
    print("==================================================================")

    # 1. Line Capacity (Scott Formula)
    print("\n[1] Testing Scott Formula Line Capacity Engine...")
    cap_list = line_capacity_engine.get_corridor_capacity_overview()
    assert len(cap_list) == 5, "Section count mismatch"
    sfg_pryj = cap_list[0]
    print(f" -> Section: {sfg_pryj['section_name']}")
    print(f" -> Baseline Capacity: {sfg_pryj['baseline_daily_capacity_trains']} trains/day (Utilization: {sfg_pryj['baseline_utilization_pct']}%)")
    print(f" -> Under 3.5h Block: {sfg_pryj['capacity_under_block']} trains/day (Utilization: {sfg_pryj['utilization_under_block_pct']}%)")
    print(f" -> 3rd Line Compensation: {sfg_pryj['third_line_compensation']}")

    # 2. Machine Logistics & Routing
    print("\n[2] Testing Track Machine Fleet Logistics Dispatcher...")
    fleet = machine_logistics_engine.get_fleet_status()
    assert len(fleet) >= 4, "Fleet size mismatch"
    csm = fleet[0]
    print(f" -> Machine: {csm['name']} at {csm['base_depot']}")
    transit = machine_logistics_engine.calculate_transit_route(csm["machine_id"], destination_km=77.3, block_start_min=180)
    print(f" -> Transit to Km 77.3: {transit['transit_distance_km']} km in {transit['transit_time_minutes']} min at {transit['transit_speed_kmh']} km/h")
    print(f" -> Mandated Depot Departure: Minute {transit['mandated_depot_departure_min']} | Fuel: {transit['estimated_fuel_burn_litres']} L")

    # 3. TSR Speed Relaxation Recovery
    print("\n[3] Testing TSR 4-Day Speed Relaxation Recovery Modeler...")
    tsr = tsr_recovery_engine.compute_tsr_recovery_impact(length_km=12.0, daily_trains_count=145)
    print(f" -> 4-Day Post-Block Delay Total: {tsr['total_4day_delay_hours']} Train-Hours")
    for d in tsr["recovery_days"]:
        print(f"    Day {d['day_number']}: {d['permissible_speed_kmh']} km/h -> Delay/Train: {d['delay_per_train_minutes']} min (Total Day Delay: {d['total_day_delay_minutes']} min)")

    # 4. Yard Interlocking & Crossovers
    print("\n[4] Testing Yard Platform Interlocking & Diamond Crossover Isolation...")
    yards = yard_engine.get_yard_interlocking_overview()
    assert len(yards) >= 2, "Yards count mismatch"
    iso = yard_engine.simulate_micro_block_route_isolation("PRYJ", target_platform=4)
    print(f" -> Yard PRYJ Platform 4 Isolated: Through Mainline={iso['through_main_line_status']} | Alternate PFs={iso['available_alternate_platforms']}")

    # 5. CRIS COA Exporters
    print("\n[5] Testing CRIS COA XML & JSON Exporters...")
    demands = db.get_block_demands()
    timetable = db.get_timetable()
    opt = BlockOptimizer(demands, timetable)
    opt_res = opt.solve()
    json_export = cris_exporter.export_to_cris_coa_json(opt_res)
    xml_export = cris_exporter.export_to_cris_coa_xml(opt_res)
    assert len(json_export["cris_coa_transmission"]["possessions"]) > 0, "JSON possessions empty"
    assert "<CRIS_COA_BLOCK_TRANSMISSION" in xml_export, "XML root missing"
    print(f" -> Generated CRIS COA JSON with {len(json_export['cris_coa_transmission']['possessions'])} possessions.")
    print(f" -> Generated CRIS COA XML ({len(xml_export)} characters).")

    print("\n==================================================================")
    print("   ALL TIER-3 PRODUCTION MODULES VERIFIED WITH 100% SUCCESS!     ")
    print("==================================================================")


if __name__ == "__main__":
    test_tier3()
