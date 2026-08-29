from typing import List, Dict, Any


class FOISSLAEngine:
    """Freight Operations Information System (FOIS) Integration:

    Tracks freight rakes, commodity payloads, industrial consignee SLA deadlines,
    and calculates financial/supply-chain penalty risks caused by maintenance block delays.
    """

    def __init__(self):
        self.freight_rakes = [
            {
                "rake_id": "FR_BOXN_101",
                "train_name": "BOXN Heavy Coal Rake (DDU -> Dadri Power)",
                "commodity": "Thermal Coal (3,800 Tonnes)",
                "consignee": "NTPC Dadri Super Thermal Power Plant",
                "origin": "DDU (Coal Siding)",
                "destination": "DER (Dadri)",
                "sla_target_arrival_min": 420,  # 07:00 AM IST
                "max_delay_tolerance_min": 60,
                "penalty_per_hour_inr": 85000,
                "criticality": "HIGH_POWER_GRID_SLA",
                "current_eta_min": 320,
                "sla_status": "ON_SCHEDULE"
            },
            {
                "rake_id": "FR_CONT_202",
                "train_name": "CONCOR Double Stack Container (JNPT -> TKD)",
                "commodity": "Export/Import Containers (90 TEU)",
                "consignee": "Container Corporation of India (CONCOR)",
                "origin": "TKD (Tughlakabad)",
                "destination": "HWH (Kolkata Port Link)",
                "sla_target_arrival_min": 840,  # 14:00 IST
                "max_delay_tolerance_min": 90,
                "penalty_per_hour_inr": 60000,
                "criticality": "PORT_VESSEL_CONNECTIVITY",
                "current_eta_min": 730,
                "sla_status": "ON_SCHEDULE"
            },
            {
                "rake_id": "FR_BCN_303",
                "train_name": "BCN Foodgrain Rake (FCI Punjab -> WB)",
                "commodity": "Wheat / Rice PDS Supply (2,600 Tonnes)",
                "consignee": "Food Corporation of India (FCI)",
                "origin": "LDH (Ludhiana)",
                "destination": "BWN (Barddhaman)",
                "sla_target_arrival_min": 1200,  # 20:00 IST
                "max_delay_tolerance_min": 150,
                "penalty_per_hour_inr": 35000,
                "criticality": "NATIONAL_FOOD_SECURITY_PDS",
                "current_eta_min": 1060,
                "sla_status": "ON_SCHEDULE"
            }
        ]

    def get_freight_sla_overview(self) -> List[Dict[str, Any]]:
        return self.freight_rakes

    def calculate_sla_breach_penalty(self, rake_id: str, delay_minutes: int) -> Dict[str, Any]:
        """Calculates FOIS financial penalty and supply-chain risk if a rake is delayed by a maintenance block."""
        rake = next((r for r in self.freight_rakes if r["rake_id"] == rake_id), self.freight_rakes[0])
        tolerance = rake["max_delay_tolerance_min"]

        if delay_minutes <= tolerance:
            return {
                "rake_id": rake_id,
                "sla_breached": False,
                "financial_penalty_inr": 0,
                "risk_rating": "ACCEPTABLE_BUFFER",
                "details": f"Delay of {delay_minutes}m is within buffer tolerance ({tolerance}m)."
            }

        excess_minutes = delay_minutes - tolerance
        penalty_inr = int((excess_minutes / 60.0) * rake["penalty_per_hour_inr"])
        return {
            "rake_id": rake_id,
            "sla_breached": True,
            "financial_penalty_inr": penalty_inr,
            "risk_rating": "CRITICAL_SLA_BREACH",
            "details": f"Delay of {delay_minutes}m exceeds buffer by {excess_minutes}m. Incurs ₹{penalty_inr:,} penalty for {rake['consignee']}."
        }


fois_engine = FOISSLAEngine()
