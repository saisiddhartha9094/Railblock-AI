import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, Play, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

export default function EmergencyModal({ isOpen, onClose, onEmergencyExecuted, corridor }) {
  const [sectionId, setSectionId] = useState('SEC_PRYJ_NYN');
  const [lineId, setLineId] = useState('UP_MAIN');
  const [reason, setReason] = useState('Critical Rail Fracture detected near Yamuna Bridge (Km 8.4)');
  const [durationMin, setDurationMin] = useState(90);
  const [speedRestriction, setSpeedRestriction] = useState(20);
  const [isInjecting, setIsInjecting] = useState(false);
  const [responseMsg, setResponseMsg] = useState(null);

  if (!isOpen) return null;

  const sections = corridor?.sections || [];

  const handleInjectEmergency = async (e) => {
    e.preventDefault();
    setIsInjecting(true);
    try {
      const payload = {
        section_id: sectionId,
        line_id: lineId,
        reason: reason,
        start_time_min: 630, // Current time (10:30 AM)
        estimated_duration_min: parseInt(durationMin),
        speed_restriction_kmh: parseInt(speedRestriction),
        reported_by: 'Duty Station Master / Keyman PRYJ'
      };

      const res = await api.triggerEmergencyOverride(payload);
      setResponseMsg(res);
      if (onEmergencyExecuted) onEmergencyExecuted(res);
    } catch (err) {
      console.error('Emergency error:', err);
    } finally {
      setIsInjecting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border-2 border-red-500/80 rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-scaleUp">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-950/80 border border-red-500/60">
              <ShieldAlert className="w-6 h-6 text-red-400 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                Emergency Unscheduled Block Override
              </h3>
              <p className="text-[11px] text-red-300 font-mono">
                Immediate Interlocking Block Protection & Dynamic Reschedule
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xs font-bold">
            ✕ Close
          </button>
        </div>

        {responseMsg ? (
          <div className="space-y-4">
            <div className="p-4 bg-red-950/40 border border-red-500/50 rounded-xl text-xs space-y-2">
              <div className="flex items-center gap-2 text-red-400 font-extrabold text-sm">
                <CheckCircle2 className="w-5 h-5 text-red-400" />
                <span>{responseMsg.status} ({responseMsg.emergency_block_id})</span>
              </div>
              <p className="text-slate-200">{responseMsg.re_optimized_schedule_summary}</p>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
              <span className="text-slate-400 font-bold block mb-1.5 uppercase text-[10px]">
                Immediate Safety Regulations Dispatched:
              </span>
              <ul className="space-y-1 text-slate-300">
                {responseMsg.immediate_regulations?.map((reg, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                    <span>{reg}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl"
            >
              Acknowledge & Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleInjectEmergency} className="space-y-4 text-xs">
            <div className="p-3 bg-red-950/30 border border-red-500/30 rounded-xl text-red-200 text-[11px] leading-snug">
              ⚠️ Injects an immediate emergency block at current clock time (10:30 AM IST), locks out affected track, enforces caution orders, and executes real-time dynamic re-optimization of all downstream trains and planned blocks.
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Emergency Nature & Reason:</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 font-semibold text-white focus:outline-none focus:border-red-500"
              >
                <option value="Critical Rail Fracture detected near Yamuna Bridge (Km 8.4)">Critical Rail Fracture (Ultrasonic/Visual Detection)</option>
                <option value="25kV OHE Catenary Wire Snapped / Insulator Flashover">25kV OHE Catenary Snapped (Power Breakdown)</option>
                <option value="Point Machine Interlocking Failure at Gaipura Loop">Point Machine Electrical Interlocking Failure</option>
                <option value="Track Settlement / Washout under Monsoon Surge">Track Settlement / Ballast Washout</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Section:</label>
                <select
                  value={sectionId}
                  onChange={(e) => setSectionId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 font-semibold text-white focus:outline-none focus:border-red-500"
                >
                  {sections.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Track Line:</label>
                <select
                  value={lineId}
                  onChange={(e) => setLineId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 font-semibold text-white focus:outline-none focus:border-red-500"
                >
                  <option value="UP_MAIN">UP Main (To Delhi)</option>
                  <option value="DOWN_MAIN">DOWN Main (To HWH)</option>
                  <option value="THIRD_LINE">3rd Reversible Track</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Estimated Restoration (min):</label>
                <input
                  type="number"
                  min="30"
                  max="300"
                  value={durationMin}
                  onChange={(e) => setDurationMin(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 font-mono text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Speed Restriction (km/h):</label>
                <input
                  type="number"
                  min="10"
                  max="60"
                  value={speedRestriction}
                  onChange={(e) => setSpeedRestriction(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 font-mono text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isInjecting}
                className="px-5 py-2 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white font-extrabold rounded-xl shadow-lg shadow-red-500/30 transition-all active:scale-95"
              >
                {isInjecting ? 'Executing Dynamic Reschedule...' : 'Trigger Emergency Block'}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
