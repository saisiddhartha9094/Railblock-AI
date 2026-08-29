from typing import List, Dict, Any


class KavachTelemetryStream:
    """Simulates real-time Kavach (Indian Railways Indigenous Automatic Train Protection - ATP)

    Cab Signalling telemetry and locomotive GPS positioning along the corridor.
    """

    def __init__(self):
        self.kavach_units = [
            {
                "train_number": "22436",
                "train_name": "Vande Bharat Express (NDLS -> BSB)",
                "loco_kavach_id": "KV_LOCO_WAP7_30452",
                "current_km": 54.2,
                "current_section": "SEC_NYN_MZP",
                "line_occupied": "DOWN_MAIN",
                "speed_kmh": 128,
                "target_distance_m": 1420,
                "cab_signal_aspect": "DOUBLE_YELLOW",  # GREEN, DOUBLE_YELLOW, YELLOW, RED
                "permissible_speed_kmh": 130,
                "target_speed_kmh": 90,
                "brake_status": "NORMAL_COASTING",
                "rfid_tag_last_passed": "RFID_TAG_MZP_54K2",
                "movement_authority_m": 4200,
                "kavach_system_health": "100% HEALTHY (SIL-4 Certified)"
            },
            {
                "train_number": "12302",
                "train_name": "Howrah Rajdhani Express (NDLS -> HWH)",
                "loco_kavach_id": "KV_LOCO_WAP7_30219",
                "current_km": 14.8,
                "current_section": "SEC_PRYJ_NYN",
                "line_occupied": "DOWN_MAIN",
                "speed_kmh": 98,
                "target_distance_m": 2800,
                "cab_signal_aspect": "GREEN",
                "permissible_speed_kmh": 100,
                "target_speed_kmh": 100,
                "brake_status": "NORMAL_TRACTION",
                "rfid_tag_last_passed": "RFID_TAG_NYN_14K8",
                "movement_authority_m": 6000,
                "kavach_system_health": "100% HEALTHY (SIL-4 Certified)"
            },
            {
                "train_number": "FR_BOXN_101",
                "train_name": "BOXN Heavy Coal Rake (DDU -> Dadri)",
                "loco_kavach_id": "KV_LOCO_WAG9_31804",
                "current_km": 112.4,
                "current_section": "SEC_MZP_CAR",
                "line_occupied": "UP_MAIN",
                "speed_kmh": 72,
                "target_distance_m": 850,
                "cab_signal_aspect": "YELLOW",
                "permissible_speed_kmh": 75,
                "target_speed_kmh": 45,
                "brake_status": "SERVICE_BRAKING_ACTIVE",
                "rfid_tag_last_passed": "RFID_TAG_CAR_112K4",
                "movement_authority_m": 1200,
                "kavach_system_health": "100% HEALTHY (SIL-4 Certified)"
            }
        ]

    def get_live_kavach_stream(self) -> List[Dict[str, Any]]:
        return self.kavach_units

    def get_kavach_unit_for_train(self, train_number: str) -> Dict[str, Any]:
        return next((u for u in self.kavach_units if u["train_number"] == train_number), self.kavach_units[0])


kavach_stream = KavachTelemetryStream()
