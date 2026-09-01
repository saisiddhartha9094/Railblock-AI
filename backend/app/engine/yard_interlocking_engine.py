from typing import Dict, Any, List


class YardInterlockingEngine:
    """Models Route-Relay & Electronic Interlocking (EI) at major junction yards:

    - Prayagraj Junction (10 Platforms, 6 Goods Looping Roads, 4 Diamond Crossovers)
    - Pt. Deen Dayal Upadhyaya Yard (8 Platforms, 12 Marshalling Loops, East/West Flyovers)
    """

    def __init__(self):
        self.yards = [
            {
                "yard_code": "PRYJ",
                "name": "Prayagraj Junction Central Yard",
                "total_platforms": 10,
                "loop_lines": 6,
                "crossovers": [
                    {"crossover_id": "X_PRYJ_101", "name": "West Diamond Scissors (PF 1/2 to UP Main)", "status": "CLEAR", "is_critical": True},
                    {"crossover_id": "X_PRYJ_204", "name": "East Gaipura Crossover (DOWN Main to PF 4/5)", "status": "MICRO_BLOCK_ACTIVE", "is_critical": False},
                    {"crossover_id": "X_PRYJ_308", "name": "Flyover Link Crossover to SFG Goods Yard", "status": "CLEAR", "is_critical": True}
                ],
                "platforms": [
                    {"platform_no": 1, "length_m": 650, "dedicated_to": "Vande Bharat / Rajdhani Express", "occupancy": "VACANT"},
                    {"platform_no": 2, "length_m": 620, "dedicated_to": "Superfast Mail/Express", "occupancy": "OCCUPIED_TRAIN_12424"},
                    {"platform_no": 3, "length_m": 580, "dedicated_to": "Express / Passenger", "occupancy": "VACANT"},
                    {"platform_no": 4, "length_m": 600, "dedicated_to": "Passenger / MEMU", "occupancy": "MAINTENANCE_APRON_WASH"},
                    {"platform_no": 5, "length_m": 550, "dedicated_to": "Passenger / Reversing Raikes", "occupancy": "VACANT"}
                ]
            },
            {
                "yard_code": "DDU",
                "name": "Pt. Deen Dayal Upadhyaya Major Yard",
                "total_platforms": 8,
                "loop_lines": 12,
                "crossovers": [
                    {"crossover_id": "X_DDU_501", "name": "Gaya End Flyover Junction Crossover", "status": "CLEAR", "is_critical": True},
                    {"crossover_id": "X_DDU_602", "name": "Marshalling Yard Coal Siding Throat", "status": "CLEAR", "is_critical": True}
                ],
                "platforms": [
                    {"platform_no": 1, "length_m": 720, "dedicated_to": "Vande Bharat / Premium Rajdhani", "occupancy": "VACANT"},
                    {"platform_no": 2, "length_m": 700, "dedicated_to": "Eastern Trunk Mail/Express", "occupancy": "OCCUPIED_TRAIN_12302"},
                    {"platform_no": 3, "length_m": 650, "dedicated_to": "ECR / NER Intercity", "occupancy": "VACANT"}
                ]
            }
        ]

    def get_yard_interlocking_overview(self) -> List[Dict[str, Any]]:
        return self.yards

    def simulate_micro_block_route_isolation(self, yard_code: str, target_platform: int) -> Dict[str, Any]:
        """Demonstrates that closing a single platform line or crossover preserves main line through traffic."""
        yard = next((y for y in self.yards if y["yard_code"] == yard_code), self.yards[0])

        return {
            "yard_code": yard_code,
            "isolated_platform": target_platform,
            "through_main_line_status": "UNBLOCKED_AT_130_KMH",
            "available_alternate_platforms": [p["platform_no"] for p in yard["platforms"] if p["platform_no"] != target_platform and p["occupancy"] == "VACANT"],
            "interlocking_safety_protection": "Track Circuit Signal Shunts Applied via Electronic Interlocking (EI)",
            "traffic_delay_impact": "0 Minutes (Passenger rakes diverted to alternate platform roads without main line throttle)"
        }


yard_engine = YardInterlockingEngine()
