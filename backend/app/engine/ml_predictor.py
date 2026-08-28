import numpy as np
from sklearn.ensemble import RandomForestRegressor
from typing import Dict, List, Any


class DisruptionPredictor:
    def __init__(self):
        self.model = RandomForestRegressor(n_estimators=35, random_state=42)
        self.is_trained = False
        self._train_baseline_model()

    def _train_baseline_model(self):
        """Trains a model on synthetic historical corridor traffic patterns."""
        # Features: [start_hour, duration_hours, is_peak_passenger, is_down_line, num_junctions_affected, has_power_cut]
        # Target: Total Corridor Disruption Score (0.0 to 100.0)
        X = []
        y = []

        for h in range(24):
            for dur in [1.5, 2.0, 3.0, 4.0, 5.0]:
                is_peak = 1.0 if ((6 <= h <= 10) or (17 <= h <= 22)) else 0.0
                is_night = 1.0 if (1 <= h <= 5) else 0.0

                for is_down in [0.0, 1.0]:
                    for pwr in [0.0, 1.0]:
                        # Base disruption formula with stochastic variance
                        base = (dur * 12.0)
                        if is_peak:
                            base *= 2.4
                        elif is_night:
                            base *= 0.35
                        if pwr:
                            base += 15.0

                        score = min(100.0, max(5.0, base + np.random.normal(0, 3.0)))
                        X.append([h, dur, is_peak, is_down, 2.0, pwr])
                        y.append(score)

        self.model.fit(np.array(X), np.array(y))
        self.is_trained = True

    def predict_disruption_score(self, start_min: int, duration_min: int, line_id: str, is_power_cut: bool) -> float:
        """Predicts the disruption index (0-100) for a given proposed window."""
        h = (start_min // 60) % 24
        dur_h = duration_min / 60.0
        is_peak = 1.0 if ((6 <= h <= 10) or (17 <= h <= 22)) else 0.0
        is_down = 1.0 if "DOWN" in line_id else 0.0
        pwr = 1.0 if is_power_cut else 0.0

        features = np.array([[h, dur_h, is_peak, is_down, 2.0, pwr]])
        pred = self.model.predict(features)[0]
        return round(float(min(100.0, max(2.0, pred))), 1)

    def recommend_alternative_windows(self, duration_min: int, line_id: str, is_power_cut: bool) -> List[Dict[str, Any]]:
        """Scans the 24-hour horizon and returns top 3 lowest disruption windows."""
        candidates = []
        for start_m in range(0, 1440 - duration_min + 1, 30):
            score = self.predict_disruption_score(start_m, duration_min, line_id, is_power_cut)
            start_h = start_m // 60
            start_rem = start_m % 60
            end_m = start_m + duration_min
            end_h = end_m // 60
            end_rem = end_m % 60

            candidates.append({
                "start_min": start_m,
                "end_min": end_m,
                "window_str": f"{start_h:02d}:{start_rem:02d} - {end_h:02d}:{end_rem:02d} IST",
                "disruption_score": score,
                "risk_rating": "LOW" if score < 30 else ("MODERATE" if score < 60 else "HIGH")
            })

        candidates.sort(key=lambda x: x["disruption_score"])
        return candidates[:3]


ml_predictor = DisruptionPredictor()
