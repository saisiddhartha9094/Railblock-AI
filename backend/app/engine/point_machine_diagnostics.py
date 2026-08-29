import numpy as np
from typing import List, Dict, Any
from app.models.schemas import BlockDemand, Department, LineType, UrgencyLevel, EquipmentRequirement


class PointMachineDiagnostics:
    """Simulates and analyzes electric point machine throw current signatures (Ampere vs Time)

    to detect motor degradation, dry slide chairs, or mechanical obstructions.
    """

    def __init__(self):
        self.point_machines = [
            {"id": "PM_NYN_101", "station": "NYN", "point_no": "101A/B", "location": "Naini Jn Gaipura End", "status": "DEGRADING_FRICTION", "motor_type": "Siemens 110V DC", "last_inspected": "2026-08-20"},
            {"id": "PM_PRYJ_204", "station": "PRYJ", "point_no": "204A/B", "location": "Prayagraj West Yard", "status": "HEALTHY", "motor_type": "Alstom GRS 110V DC", "last_inspected": "2026-08-25"},
            {"id": "PM_MZP_108", "station": "MZP", "point_no": "108B", "location": "Mirzapur Loop Entry", "status": "OBSTRUCTION_RISK", "motor_type": "Siemens 110V DC", "last_inspected": "2026-08-15"},
            {"id": "PM_CAR_302", "station": "CAR", "point_no": "302A", "location": "Chunar Jn East Crossover", "status": "HEALTHY", "motor_type": "Siemens 110V DC", "last_inspected": "2026-08-27"},
        ]

    def generate_current_signature(self, point_id: str) -> Dict[str, Any]:
        """Generates realistic current signature waveform (time 0 to 4.5s sampled at 50Hz)."""
        pm = next((p for p in self.point_machines if p["id"] == point_id), self.point_machines[0])
        status = pm["status"]

        t = np.linspace(0, 4.5, 90)
        current = np.zeros_like(t)

        # Stage 1: Inrush Peak (0 to 0.4s) -> ~5.2A
        inrush_mask = t <= 0.4
        current[inrush_mask] = 5.2 * (t[inrush_mask] / 0.4) * np.exp(-2.0 * t[inrush_mask]) + 1.8

        # Stage 2: Normal Running Throw Current (0.4 to 3.2s)
        throw_mask = (t > 0.4) & (t <= 3.2)
        if status == "HEALTHY":
            base_current = 2.1 + 0.15 * np.sin(4 * np.pi * t[throw_mask]) + np.random.normal(0, 0.05, len(t[throw_mask]))
        elif status == "DEGRADING_FRICTION":
            # Higher running current with dry slide chair spikes
            base_current = 3.8 + 0.6 * np.sin(2 * np.pi * t[throw_mask]) + np.random.normal(0, 0.12, len(t[throw_mask]))
        else: # OBSTRUCTION_RISK
            # Severe friction spike approaching clutch trip limit
            base_current = 4.6 + 0.9 * (t[throw_mask] - 0.4) + np.random.normal(0, 0.18, len(t[throw_mask]))

        current[throw_mask] = base_current

        # Stage 3: Locking & Clutch Trip (3.2 to 3.8s) -> drops to 0A
        lock_mask = (t > 3.2) & (t <= 3.8)
        current[lock_mask] = np.maximum(0, current[throw_mask][-1] * (1 - (t[lock_mask] - 3.2) / 0.6))

        # Peak & RMS metrics
        peak_amp = round(float(np.max(current)), 2)
        rms_amp = round(float(np.sqrt(np.mean(current**2))), 2)
        throw_duration_sec = 3.6 if status != "HEALTHY" else 3.1

        waveform_points = [{"time_sec": round(float(ti), 2), "current_amp": round(float(ci), 2)} for ti, ci in zip(t, current)]

        # Anomaly Diagnostics
        if status == "HEALTHY":
            diagnostic = "Normal running profile. Current stable at 2.1A. Clutch cutoff normal."
            recommendation = "No intervention needed. Next routine test in 15 days."
            requires_micro_block = False
        elif status == "DEGRADING_FRICTION":
            diagnostic = "High steady current (3.8A vs 2.1A baseline). Indicates slide chair dry friction & graphite grease depletion."
            recommendation = "Schedule 25-minute S&T Micro-Block for slide chair lubrication and switch detection contact cleaning."
            requires_micro_block = True
        else:
            diagnostic = "Critical current surge (4.8A). High risk of point detection failure / out-of-correspondence tripping."
            recommendation = "Immediate 30-minute S&T Micro-Block required to adjust locking stretcher bar and clutch clearance."
            requires_micro_block = True

        return {
            "point_id": pm["id"],
            "station": pm["station"],
            "point_no": pm["point_no"],
            "location": pm["location"],
            "motor_type": pm["motor_type"],
            "status": status,
            "peak_current_amp": peak_amp,
            "rms_current_amp": rms_amp,
            "throw_duration_sec": throw_duration_sec,
            "diagnostic": diagnostic,
            "recommendation": recommendation,
            "requires_micro_block": requires_micro_block,
            "waveform": waveform_points
        }

    def auto_generate_micro_block_demand(self, point_id: str) -> BlockDemand:
        """Auto-synthesizes an S&T micro-block demand from current signature diagnostics."""
        diag = self.generate_current_signature(point_id)
        sec_map = {"NYN": "SEC_PRYJ_NYN", "PRYJ": "SEC_SFG_PRYJ", "MZP": "SEC_NYN_MZP", "CAR": "SEC_MZP_CAR"}
        sec_id = sec_map.get(diag["station"], "SEC_NYN_MZP")

        return BlockDemand(
            id=f"DEM_ST_AUTO_{diag['station']}_{diag['point_no'].replace('/', '_')}",
            department=Department.SIGNAL_TELECOM,
            section_id=sec_id,
            line_id=LineType.DOWN_MAIN,
            work_description=f"Predictive S&T Micro-Block: Point {diag['point_no']} ({diag['diagnostic'][:60]}...)",
            equipment_needed=[EquipmentRequirement(equipment_type="S&T Point Measurement Kit & Lubricator", quantity=1, speed_kmh_to_site=25)],
            requested_duration_min=30,
            min_continuous_duration_min=20,
            urgency=UrgencyLevel.STATUTORY_RDSO,
            is_power_block_required=False,
            is_traffic_block_required=True,
            safety_code_reference="Signal Engineering Manual (SEM) Part II Para 19.3 & RDSO Spec IRS:S 24",
            submitted_by="CRIS-AI Point Signature Analyzer"
        )


point_diagnostics = PointMachineDiagnostics()
