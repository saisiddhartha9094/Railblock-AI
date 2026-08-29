from typing import List, Dict, Any
from app.models.schemas import BlockDemand, Department, LineType, UrgencyLevel, EquipmentRequirement


class TRCUSFDPipeline:
    """Ingests Track Recording Car (TRC) Track Quality Index (TQI) and Ultrasonic Flaw Detection (USFD)

    flaw signals to automatically synthesize statutory Civil Track maintenance block demands.
    """

    def __init__(self):
        self.track_segments = [
            {
                "segment_id": "TRC_SEG_01",
                "section_id": "SEC_NYN_MZP",
                "km_start": 32.0,
                "km_end": 44.0,
                "line_id": "DOWN_MAIN",
                "tqi_score": 42.8,  # > 36 is Need Maintenance per RDSO
                "gauge_variation_mm": 4.8,
                "twist_mm_per_m": 3.2,
                "unevenness_index": 18.4,
                "usfd_flaws_count": 2,
                "flaw_details": "IMR (Immediate Rail Replacement) flaw at Km 38.4 weld joint (transverse crack 18mm)",
                "recommended_action": "Continuous Tamping (CSM) & Rail Piece Replacement",
                "status": "CRITICAL_ACTION_REQUIRED"
            },
            {
                "segment_id": "TRC_SEG_02",
                "section_id": "SEC_MZP_CAR",
                "km_start": 98.0,
                "km_end": 108.0,
                "line_id": "UP_MAIN",
                "tqi_score": 28.5,  # Good
                "gauge_variation_mm": 1.9,
                "twist_mm_per_m": 1.1,
                "unevenness_index": 9.2,
                "usfd_flaws_count": 0,
                "flaw_details": "Zero flaw indications. Weld integrity sound.",
                "recommended_action": "Maintain routine inspection cycle.",
                "status": "HEALTHY"
            },
            {
                "segment_id": "TRC_SEG_03",
                "section_id": "SEC_CAR_DDU",
                "km_start": 130.0,
                "km_end": 142.0,
                "line_id": "DOWN_MAIN",
                "tqi_score": 38.2,  # Maintenance required
                "gauge_variation_mm": 3.9,
                "twist_mm_per_m": 2.6,
                "unevenness_index": 14.1,
                "usfd_flaws_count": 1,
                "flaw_details": "OBS (Observed Defect) flaw at Switch Expansion Joint (SEJ) Km 134.2",
                "recommended_action": "SEJ packing and Dynamic Track Stabilizer (DTS) consolidation",
                "status": "ATTENTION_REQUIRED"
            }
        ]

    def get_track_health_overview(self) -> Dict[str, Any]:
        critical_count = len([s for s in self.track_segments if s["status"] == "CRITICAL_ACTION_REQUIRED"])
        attention_count = len([s for s in self.track_segments if s["status"] == "ATTENTION_REQUIRED"])
        return {
            "total_segments_surveyed": len(self.track_segments),
            "critical_segments": critical_count,
            "attention_segments": attention_count,
            "healthy_segments": len(self.track_segments) - critical_count - attention_count,
            "overall_corridor_tqi_avg": 36.5,
            "rdso_tqi_standard": "TQI <= 36.0 (Class A High Speed Trunk)",
            "segments": self.track_segments
        }

    def auto_generate_civil_block_demand(self, segment_id: str) -> BlockDemand:
        """Auto-generates a statutory Civil Track block demand from TRC/USFD telemetry."""
        seg = next((s for s in self.track_segments if s["segment_id"] == segment_id), self.track_segments[0])

        return BlockDemand(
            id=f"DEM_ENG_AUTO_TRC_{seg['km_start']:.0f}_{seg['km_end']:.0f}",
            department=Department.ENGINEERING,
            section_id=seg["section_id"],
            line_id=LineType(seg["line_id"]),
            work_description=f"Auto TRC/USFD Mandated: {seg['recommended_action']} (Km {seg['km_start']} to {seg['km_end']}) - TQI: {seg['tqi_score']}",
            equipment_needed=[
                EquipmentRequirement(equipment_type="CSM Tamping Machine", quantity=1, speed_kmh_to_site=40),
                EquipmentRequirement(equipment_type="Dynamic Track Stabilizer (DTS)", quantity=1, speed_kmh_to_site=40)
            ],
            requested_duration_min=180,
            min_continuous_duration_min=150,
            urgency=UrgencyLevel.STATUTORY_RDSO,
            is_power_block_required=False,
            is_traffic_block_required=True,
            speed_restriction_after_block_kmh=75,
            safety_code_reference="IRPWM Para 1102 & RDSO Track Standards Manual TM-185",
            submitted_by="RDSO TRC-USFD Automated Pipeline"
        )


trc_pipeline = TRCUSFDPipeline()
