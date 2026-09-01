from typing import Dict, Any, List


class TSRRecoveryEngine:
    """Models statutory 4-Day Temporary Speed Restriction (TSR) recovery ramps:

    Following track deep screening or heavy tamping, speed is relaxed gradually per IRPWM Para 1104:
      - Day 1 (0 to 24h):  30 km/h (Immediate post-possession speed order)
      - Day 2 (24 to 48h): 60 km/h (After initial dynamic stabilizer run)
      - Day 3 (48 to 72h): 100 km/h (After secondary track settlement)
      - Day 4 (72 to 96h): 130 km/h (Full line speed restored)
    """

    def __init__(self):
        pass

    def compute_tsr_recovery_impact(self, length_km: float = 12.0, daily_trains_count: int = 145) -> Dict[str, Any]:
        """Calculates residual delay imposed on passing trains across the 4-day speed recovery envelope."""
        max_speed = 130.0  # km/h
        normal_traversal_time_min = (length_km / max_speed) * 60.0

        days_data = [
            {"day": 1, "speed_kmh": 30.0, "status": "CAUTION_ORDER_HEAVY_SETTLING"},
            {"day": 2, "speed_kmh": 60.0, "status": "DTS_CONSOLIDATION_STAGE"},
            {"day": 3, "speed_kmh": 100.0, "status": "INTERMEDIATE_SPEED_RAMP"},
            {"day": 4, "speed_kmh": 130.0, "status": "FULL_SPEED_NORMALIZED"}
        ]

        total_corridor_delay_hours = 0.0
        details = []

        for d in days_data:
            speed = d["speed_kmh"]
            traversal_min = (length_km / speed) * 60.0
            delay_per_train_min = round(max(0, traversal_min - normal_traversal_time_min), 2)
            total_day_delay_min = round(delay_per_train_min * daily_trains_count, 1)
            total_corridor_delay_hours += total_day_delay_min / 60.0

            details.append({
                "day_number": d["day"],
                "permissible_speed_kmh": speed,
                "traversal_time_minutes": round(traversal_min, 1),
                "delay_per_train_minutes": delay_per_train_min,
                "daily_trains_affected": daily_trains_count,
                "total_day_delay_minutes": total_day_delay_min,
                "settlement_status": d["status"]
            })

        return {
            "track_zone_length_km": length_km,
            "normal_line_speed_kmh": max_speed,
            "normal_traversal_time_min": round(normal_traversal_time_min, 2),
            "total_4day_delay_hours": round(total_corridor_delay_hours, 1),
            "recovery_days": details,
            "rdso_norm_reference": "IRPWM Para 1104 & Track Relaying Speed Restriction Schedule"
        }


tsr_recovery_engine = TSRRecoveryEngine()
