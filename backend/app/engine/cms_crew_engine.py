from typing import List, Dict, Any


class CMSCrewEngine:
    """Crew Management System (CMS) & Hours of Employment Regulations (HOER):

    Tracks running duty hours of Loco Pilots (LP) and Assistant Loco Pilots (ALP)
    against the 10-hour statutory limit.
    """

    def __init__(self):
        self.active_crews = [
            {
                "crew_id": "CRW_PRYJ_9041",
                "train_number": "22436",
                "train_name": "Vande Bharat Express",
                "lp_name": "Rajesh Kumar Sharma (Sr. Loco Pilot)",
                "alp_name": "Amit Patel (ALP)",
                "sign_on_time_min": 600,  # 10:00 AM IST
                "current_duty_hours": 3.5,
                "max_hoer_limit_hours": 10.0,
                "remaining_duty_hours": 6.5,
                "duty_timeout_min": 1200,  # 20:00 IST
                "sign_off_station": "BSB (Varanasi Jn)",
                "timeout_risk": "SAFE"
            },
            {
                "crew_id": "CRW_DDU_4412",
                "train_number": "FR_BOXN_101",
                "train_name": "BOXN Heavy Coal Rake",
                "lp_name": "Virender Singh (Loco Pilot Goods)",
                "alp_name": "S. K. Verma (ALP)",
                "sign_on_time_min": 60,   # 01:00 AM IST
                "current_duty_hours": 8.2,
                "max_hoer_limit_hours": 10.0,
                "remaining_duty_hours": 1.8,
                "duty_timeout_min": 660,  # 11:00 AM IST
                "sign_off_station": "SFG (Subedarganj Yard)",
                "timeout_risk": "CRITICAL_HOER_WARNING"
            },
            {
                "crew_id": "CRW_CNB_7720",
                "train_number": "12302",
                "train_name": "Howrah Rajdhani Express",
                "lp_name": "M. K. Mukherjee (Sr. LP Mail)",
                "alp_name": "P. K. Ghosh (ALP)",
                "sign_on_time_min": 700,  # 11:40 AM IST
                "current_duty_hours": 1.8,
                "max_hoer_limit_hours": 10.0,
                "remaining_duty_hours": 8.2,
                "duty_timeout_min": 1300,
                "sign_off_station": "DDU (Pt. Deen Dayal Upadhyaya)",
                "timeout_risk": "SAFE"
            }
        ]

    def get_crew_duty_status(self) -> List[Dict[str, Any]]:
        return self.active_crews

    def evaluate_crew_timeout_risk(self, train_number: str, prospective_delay_min: int) -> Dict[str, Any]:
        """Evaluates whether holding or regulating a train during a block will cause a crew duty violation."""
        crew = next((c for c in self.active_crews if c["train_number"] == train_number), self.active_crews[0])
        remaining_min = crew["remaining_duty_hours"] * 60

        if prospective_delay_min > (remaining_min - 30):  # 30 min buffer for sign-off
            return {
                "crew_id": crew["crew_id"],
                "train_number": train_number,
                "will_overshoot_hoer": True,
                "overdue_by_minutes": int(prospective_delay_min - (remaining_min - 30)),
                "warning": f"HOER VIOLATION ALERT: Holding Train {train_number} for {prospective_delay_min}m will exceed statutory 10-hour duty limit for LP {crew['lp_name']}.",
                "recommended_action": "Arrange Crew Relief at Naini Jn or give direct block bypass precedence."
            }

        return {
            "crew_id": crew["crew_id"],
            "train_number": train_number,
            "will_overshoot_hoer": False,
            "overdue_by_minutes": 0,
            "warning": "Within statutory 10-hour HOER duty envelope.",
            "recommended_action": "Normal operation permitted."
        }


cms_engine = CMSCrewEngine()
