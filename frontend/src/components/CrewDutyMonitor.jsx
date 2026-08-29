import React, { useState, useEffect } from 'react';
import { UserCheck, Clock, ShieldAlert, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import { api } from '../services/api';

export default function CrewDutyMonitor() {
  const [crews, setCrews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadCrewData();
  }, []);

  const loadCrewData = async () => {
    setIsLoading(true);
    try {
      const data = await api.getCmsCrewDuty();
      setCrews(data);
    } catch (err) {
      console.error('Error loading CMS data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatMinToStr = (min) => {
    const h = Math.floor(min / 60) % 24;
    const m = min % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} IST`;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl mb-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-indigo-400" />
              Crew Management System (CMS) & HOER 10-Hour Duty Tracker
            </h2>
            <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
              STATUTORY HOER COMPLIANCE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitors Loco Pilot (LP) and Assistant Loco Pilot (ALP) continuous running duty to prevent statutory 10-hour duty limit breaches during block regulations.
          </p>
        </div>

        <button
          onClick={loadCrewData}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Crew Status</span>
        </button>
      </div>

      {/* Crew Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {crews.map(crw => {
          const dutyPct = (crw.current_duty_hours / crw.max_hoer_limit_hours) * 100;
          const isCritical = crw.timeout_risk === 'CRITICAL_HOER_WARNING';

          return (
            <div
              key={crw.crew_id}
              className={`p-4 rounded-2xl border transition-all ${
                isCritical
                  ? 'bg-red-950/30 border-red-500/60 shadow-lg shadow-red-500/10'
                  : 'bg-slate-950 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono font-bold text-xs text-white">Train {crw.train_number}</span>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded font-mono ${
                  isCritical
                    ? 'bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}>
                  {crw.timeout_risk}
                </span>
              </div>

              <div className="text-xs font-bold text-slate-200">{crw.train_name}</div>
              <div className="text-[11px] text-slate-400 mt-1">LP: <strong className="text-slate-300">{crw.lp_name}</strong></div>
              <div className="text-[11px] text-slate-400">ALP: <span className="text-slate-300">{crw.alp_name}</span></div>

              {/* Duty Progress Bar */}
              <div className="my-3">
                <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                  <span>Duty: {crw.current_duty_hours}h / {crw.max_hoer_limit_hours}h</span>
                  <span className={isCritical ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                    {crw.remaining_duty_hours}h Left
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      dutyPct > 80 ? 'bg-red-500' : (dutyPct > 50 ? 'bg-amber-400' : 'bg-emerald-400')
                    }`}
                    style={{ width: `${Math.min(100, dutyPct)}%` }}
                  ></div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex justify-between items-center text-[10px] text-slate-400 font-mono">
                <span>Sign-off: {crw.sign_off_station}</span>
                <span>Cutoff: {formatMinToStr(crw.duty_timeout_min)}</span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
