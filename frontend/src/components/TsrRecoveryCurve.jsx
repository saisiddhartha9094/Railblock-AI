import React, { useState, useEffect } from 'react';
import { TrendingUp, Clock, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { api } from '../services/api';

export default function TsrRecoveryCurve() {
  const [tsrData, setTsrData] = useState(null);

  useEffect(() => {
    loadTsrData();
  }, []);

  const loadTsrData = async () => {
    try {
      const data = await api.getTsrRecoveryImpact(12.0, 145);
      setTsrData(data);
    } catch (err) {
      console.error('Error loading TSR impact:', err);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl mb-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-400" />
              TSR (Temporary Speed Restriction) 4-Day Recovery Modeler
            </h2>
            <span className="bg-orange-500/10 text-orange-400 border border-orange-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
              IRPWM PARA 1104
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {"Models post-possession track settlement and speed relaxation stages: 30 km/h (Day 1) → 60 km/h (Day 2) → 100 km/h (Day 3) → 130 km/h (Day 4)."}
          </p>
        </div>

        {tsrData && (
          <div className="text-right font-mono">
            <span className="text-[10px] text-slate-500 block font-sans">Cumulative Delay Incurred</span>
            <span className="text-xl font-extrabold text-amber-400">{tsrData.total_4day_delay_hours} Train-Hours</span>
          </div>
        )}
      </div>

      {/* 4-Day Speed Step Ramp Visualizer */}
      {tsrData && tsrData.recovery_days && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {tsrData.recovery_days.map(d => (
            <div
              key={d.day_number}
              className="p-4 rounded-2xl bg-slate-950 border border-slate-800 relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono font-bold text-xs text-white">Day {d.day_number} (0-24h)</span>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded font-mono ${
                  d.permissible_speed_kmh === 130
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : d.permissible_speed_kmh >= 60
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-red-500/20 text-red-300 border border-red-500/40'
                }`}>
                  {d.permissible_speed_kmh} km/h
                </span>
              </div>

              <div className="text-xs font-semibold text-slate-300 mb-3 truncate">
                {String(d.settlement_status || '').replace(/_/g, ' ')}
              </div>

              {/* Step Progress Bar */}
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-3">
                <div
                  className={`h-full rounded-full ${
                    d.permissible_speed_kmh === 130 ? 'bg-emerald-400' : (d.permissible_speed_kmh >= 60 ? 'bg-amber-400' : 'bg-red-500')
                  }`}
                  style={{ width: `${(d.permissible_speed_kmh / 130) * 100}%` }}
                ></div>
              </div>

              <div className="space-y-1 font-mono text-[11px]">
                <div className="flex justify-between text-slate-400">
                  <span>Delay / Train:</span>
                  <span className="text-white font-bold">+{d.delay_per_train_minutes} min</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Daily Section Loss:</span>
                  <span className="text-amber-400 font-bold">{d.total_day_delay_minutes} min</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
