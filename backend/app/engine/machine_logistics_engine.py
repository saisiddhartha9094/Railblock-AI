from typing import Dict, Any, List


class MachineLogisticsEngine:
    """Dispatches and tracks heavy Indian Railways maintenance machinery from divisional base depots:

    - Plasser & Theurer CSM 09-32 Continuous Action Tamping Machine
    - Plasser BCM 800 High-Output Ballast Cleaning Machine
    - Plasser Dynamic Track Stabilizer (DTS)
    - Harsco Rail Grinding Machine (RGM 72)
    - TRD 25kV OHE 8-Wheeler Tower Wagon
    """

    def __init__(self):
        self.fleet = [
            {
                "machine_id": "MCH_CSM_09_104",
                "name": "Plasser CSM 09-32 Continuous Tamper",
                "type": "TAMPING",
                "base_depot": "Subedarganj Machine Siding (SFG Yard)",
                "depot_km": 0.0,
                "transit_speed_kmh": 40.0,
                "fuel_capacity_litres": 2200,
                "current_fuel_pct": 88,
                "crew_assigned": "Track Machine Gang 4 (SSE/TM/PRYJ)",
                "status": "READY_FOR_DISPATCH"
            },
            {
                "machine_id": "MCH_BCM_800_202",
                "name": "High-Output Ballast Cleaner (BCM-800)",
                "type": "DEEP_SCREENING",
                "base_depot": "Pt. Deen Dayal Upadhyaya Machine Yard (DDU)",
                "depot_km": 153.2,
                "transit_speed_kmh": 35.0,
                "fuel_capacity_litres": 3800,
                "current_fuel_pct": 75,
                "crew_assigned": "Special Heavy Gang 1 (DDU Base)",
                "status": "DEPLOYED_IN_SHADOW"
            },
            {
                "machine_id": "MCH_DTS_62_301",
                "name": "Dynamic Track Stabilizer (DTS)",
                "type": "STABILIZATION",
                "base_depot": "Subedarganj Machine Siding (SFG Yard)",
                "depot_km": 0.0,
                "transit_speed_kmh": 40.0,
                "fuel_capacity_litres": 1600,
                "current_fuel_pct": 92,
                "crew_assigned": "Joint CSM-DTS Team (PRYJ)",
                "status": "READY_FOR_DISPATCH"
            },
            {
                "machine_id": "MCH_TW_OHE_809",
                "name": "8-Wheeler High-Speed OHE Tower Wagon",
                "type": "OHE_ELECTRICAL",
                "base_depot": "Mirzapur TRD Siding (MZP)",
                "depot_km": 88.5,
                "transit_speed_kmh": 65.0,
                "fuel_capacity_litres": 1200,
                "current_fuel_pct": 95,
                "crew_assigned": "OHE Breakdown Gang (SSE/TRD/MZP)",
                "status": "READY_FOR_DISPATCH"
            }
        ]

    def get_fleet_status(self) -> List[Dict[str, Any]]:
        return self.fleet

    def calculate_transit_route(self, machine_id: str, destination_km: float, block_start_min: int) -> Dict[str, Any]:
        """Computes transit time from depot to site, fuel consumption, and departure schedule."""
        mch = next((m for m in self.fleet if m["machine_id"] == machine_id), self.fleet[0])
        distance_km = abs(destination_km - mch["depot_km"])
        speed_kmh = mch["transit_speed_kmh"]
        transit_time_min = int((distance_km / speed_kmh) * 60.0)

        # Machine must depart depot early enough to reach site before block start
        required_depot_departure_min = block_start_min - transit_time_min - 15  # 15 min buffer for yard shunting

        return {
            "machine_id": mch["machine_id"],
            "machine_name": mch["name"],
            "base_depot": mch["base_depot"],
            "work_site_km": destination_km,
            "transit_distance_km": round(distance_km, 1),
            "transit_speed_kmh": speed_kmh,
            "transit_time_minutes": transit_time_min,
            "scheduled_block_start_min": block_start_min,
            "mandated_depot_departure_min": max(0, required_depot_departure_min),
            "estimated_fuel_burn_litres": round(distance_km * 4.2, 1),
            "escort_loco_pilot": "Designated Special Machine Driver (P-Way)",
            "safety_clearance": "Self-Propelled Heavy Machinery On-Track Clearance Granted"
        }


machine_logistics_engine = MachineLogisticsEngine()
