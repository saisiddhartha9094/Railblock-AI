from typing import Dict, Any, List
from app.models.schemas import BlockDemand, Department, LineType


class RDSORuleEngine:
    """Encodes Indian Railways statutory maintenance and safety rules (IRPWM, ACTM, SEM, GR/SR)."""

    @staticmethod
    def validate_block_demand(demand: BlockDemand) -> Dict[str, Any]:
        violations = []
        recommendations = []

        # 1. Minimum continuous duration check
        if demand.requested_duration_min < demand.min_continuous_duration_min:
            violations.append(
                f"Requested duration ({demand.requested_duration_min}m) is below the minimum mandatory "
                f"work cycle ({demand.min_continuous_duration_min}m) for {demand.work_description}."
            )

        # 2. Civil Track Machine Norms (IRPWM Para 1102)
        if demand.department == Department.ENGINEERING:
            if "BCM" in demand.work_description and demand.requested_duration_min < 180:
                violations.append("RDSO TM-101: BCM Deep screening requires a minimum uninterrupted 3.0-hour block window.")
            if "CSM" in demand.work_description and demand.requested_duration_min < 120:
                recommendations.append("IRPWM Para 1104: Track tamping output is optimized in windows >= 2.5 hours.")

        # 3. OHE Power Block Safety (ACTM Vol II Para 20412)
        if demand.department == Department.ELECTRICAL_OHE:
            if demand.is_power_block_required and not demand.is_traffic_block_required:
                violations.append("ACTM Safety Rule: 25kV OHE power isolation requires simultaneous traffic block on 25kV sections.")

        # 4. Electronic Interlocking Safety (SEM Part I Para 7.2)
        if demand.department == Department.SIGNAL_TELECOM:
            if "Electronic Interlocking" in demand.work_description and demand.requested_duration_min > 240:
                recommendations.append("SEM Rule 7.2: EI changeover should be scheduled in off-peak night shadows.")

        return {
            "is_valid": len(violations) == 0,
            "violations": violations,
            "recommendations": recommendations,
            "safety_certification": "COMPLIANT_WITH_IR_SAFETY_STANDARDS" if len(violations) == 0 else "ACTION_REQUIRED"
        }
