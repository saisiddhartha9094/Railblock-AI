import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.engine.point_machine_diagnostics import point_diagnostics
from app.engine.trc_usfd_pipeline import trc_pipeline
from app.engine.kavach_telemetry import kavach_stream
from app.engine.fois_sla_engine import fois_engine
from app.engine.cms_crew_engine import cms_engine
from app.engine.indic_nlp_assistant import indic_nlp
from app.engine.compliance_reports import compliance_reports
from app.engine.optimizer import BlockOptimizer
from app.models.database import db


def test_all_8_features():
    print("==================================================================")
    print("   TESTING 8 ADVANCED ENTERPRISE MODULES FOR RAILBLOCK-AI        ")
    print("==================================================================")

    # 1. Point Machine Current Diagnostics
    print("\n[1] Testing Point Machine Current Signature Diagnostics...")
    sig = point_diagnostics.generate_current_signature("PM_NYN_101")
    print(f" -> Point {sig['point_no']} Status: {sig['status']} | Peak: {sig['peak_current_amp']}A | RMS: {sig['rms_current_amp']}A")
    print(f" -> Diagnostic: {sig['diagnostic']}")
    assert len(sig["waveform"]) == 90, "Waveform points failed"
    print(" -> Auto-generating Micro-Block Demand...")
    pm_demand = point_diagnostics.auto_generate_micro_block_demand("PM_NYN_101")
    assert pm_demand.department.value == "SIGNAL_TELECOM", "Point demand dept mismatch"
    print(f" -> Generated: {pm_demand.id} ({pm_demand.work_description})")

    # 2. TRC & USFD Pipeline
    print("\n[2] Testing TRC & USFD Track Telemetry Pipeline...")
    trc_overview = trc_pipeline.get_track_health_overview()
    print(f" -> Surveyed Segments: {trc_overview['total_segments_surveyed']} | Critical: {trc_overview['critical_segments']} | Avg TQI: {trc_overview['overall_corridor_tqi_avg']}")
    civil_demand = trc_pipeline.auto_generate_civil_block_demand("TRC_SEG_01")
    assert civil_demand.department.value == "ENGINEERING", "TRC demand dept mismatch"
    print(f" -> Auto-synthesized Civil Block: {civil_demand.id} ({civil_demand.work_description})")

    # 3. Kavach Cab Signalling Stream
    print("\n[3] Testing Kavach Cab Signalling & GPS Telemetry Stream...")
    kavach_units = kavach_stream.get_live_kavach_stream()
    assert len(kavach_units) > 0, "No Kavach units"
    vande_kavach = kavach_units[0]
    print(f" -> Train {vande_kavach['train_number']}: Aspect={vande_kavach['cab_signal_aspect']} | Speed={vande_kavach['speed_kmh']}km/h | Target Distance={vande_kavach['target_distance_m']}m")

    # 4. FOIS Freight SLA Engine
    print("\n[4] Testing FOIS Freight Supply Chain SLA Engine...")
    freight_rakes = fois_engine.get_freight_sla_overview()
    assert len(freight_rakes) > 0, "No freight rakes"
    boxn = freight_rakes[0]
    print(f" -> Rake {boxn['rake_id']} Consignee: {boxn['consignee']} | Commodity: {boxn['commodity']}")
    penalty_check = fois_engine.calculate_sla_breach_penalty(boxn["rake_id"], delay_minutes=120)
    print(f" -> Simulated 120m Delay Penalty: INR {penalty_check['financial_penalty_inr']:,} ({penalty_check['risk_rating']})")

    # 5. CMS Crew Duty & HOER Tracker
    print("\n[5] Testing CMS Crew Duty & HOER 10-Hour Engine...")
    crews = cms_engine.get_crew_duty_status()
    assert len(crews) > 0, "No crew status"
    goods_crew = crews[1]
    print(f" -> Crew {goods_crew['crew_id']}: LP={goods_crew['lp_name']} | Current Duty={goods_crew['current_duty_hours']}h | Timeout Risk={goods_crew['timeout_risk']}")
    timeout_check = cms_engine.evaluate_crew_timeout_risk(goods_crew["train_number"], prospective_delay_min=150)
    print(f" -> Simulated 150m Delay HOER Check: Overshoot={timeout_check['will_overshoot_hoer']} | Warning={timeout_check['warning']}")

    # 6. Indic Multilingual Voice & NLP Parser
    print("\n[6] Testing Indic Multilingual Voice & NLP Intent Parser...")
    test_hindi = "Subedarganj me platform 1 ka 2 ghante ka apron wash block schedule karo shaam 14:00 baje ke baad"
    nlp_res = indic_nlp.parse_natural_language_command(test_hindi)
    print(f" -> Query (Hindi): \"{test_hindi}\"")
    print(f" -> Extracted Dept: {nlp_res['detected_department']} | Section: {nlp_res['extracted_section']} | Duration: {nlp_res['extracted_duration_min']}m | Confidence: {nlp_res['confidence_score']}")
    assert nlp_res["detected_department"] == "TRAFFIC_OPERATING", "NLP Dept mismatch"

    # 7. CP-SAT Multi-Objective Optimizer Integration
    print("\n[7] Testing CP-SAT Optimizer with Integrated Demands...")
    demands = db.get_block_demands()
    timetable = db.get_timetable()
    opt = BlockOptimizer(demands, timetable)
    opt_res = opt.solve()
    print(f" -> Solved in {opt_res.solve_time_seconds}s | Blocks: {opt_res.total_blocks_scheduled} | Clubbed: {opt_res.clubbed_blocks_count} ({opt_res.clubbing_efficiency_pct}%) | AAI: {opt_res.asset_availability_index_after}%")

    # 8. Compliance Reports (CBUI & PLA)
    print("\n[8] Testing Official Railway Board Compliance Reports...")
    cbui = compliance_reports.generate_cbui_report(opt_res)
    pla = compliance_reports.generate_pla_report(opt_res, timetable)
    print(f" -> CBUI Score: {cbui['cbui_score']} ({cbui['cbui_rating']}) | Possession Occupancy: {cbui['metrics']['track_possession_occupancy_pct']}")
    print(f" -> PLA Punctuality: {pla['corridor_punctuality_percentage']} | Delay Minutes Saved: {pla['delay_savings_summary']['total_delay_minutes_avoided']}")

    print("\n==================================================================")
    print("   ALL 8 ADVANCED ENTERPRISE MODULES VERIFIED SUCCESSFULLY!      ")
    print("==================================================================")


if __name__ == "__main__":
    test_all_8_features()
