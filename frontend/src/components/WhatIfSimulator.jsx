import React, { useState } from 'react';
import { FlaskConical, Play, Sparkles, AlertTriangle, ShieldCheck, Clock, Train, ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';
import { api } from '../services/api';

export default function WhatIfSimulator({ corridor }) {
  const [sectionId, setSectionId] = useState('SEC_NYN_MZP');
  const [lineId, setLineId] = useState('DOWN_MAIN');
  const [department, setDepartment] = useState('ENGINEERING');
  const [startMin, setStartMin] = useState(720); // 12:00 PM
  const [durationMin, setDurationMin] = useState(180); // 3 Hours
  const [isPowerBlock, setIsPowerBlock] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simResult, setSimResult] = useState(null);

  const sections = corridor?.sections || [
    { id: 'SEC_SFG_PRYJ', name: 'Subedarganj (SFG) - Prayagraj (PRYJ)' },
    { id: 'SEC_PRYJ_NYN', name: 'Prayagraj (PRYJ) - Naini (NYN)' },
    { id: 'SEC_NYN_MZP', name: 'Naini (NYN) - Mirzapur (MZP)' },
    { id: 'SEC_MZP_CAR', name: 'Mirzapur (MZP) - Chunar (CAR)' },
    { id: 'SEC_CAR_DDU', name: 'Chunar (CAR) - Pt. DDU Jn (DDU)' }
  ];

  const handleRunSimulation = async () => {
    setIsSimulating(true);
    try {
      const payload = {
        section_id: sectionId,
        line_id: lineId,
        proposed_start_min: parseInt(startMin),
        proposed_duration_min: parseInt(durationMin),
        department: department,
        is_power_block: isPowerBlock
      };
      const data = await api.simulateWhatIf(payload);
      setSimResult(data);
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setIsSimulating(false);
    }
  };

  const formatTimeStr = (min) => {
    const h = Math.floor(min / 60) % 24;
    const m = min % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} IST`;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl mb-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-orange-400" />
            Discrete-Event What-If Simulation Sandbox (SimPy Engine)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Test custom maintenance block proposals before committing. Predicts cascading delay propagation and asset availability impact.
          </p>
        </div>
      </div>

      {/* Scenario Builder Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Input Parameters (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-orange-400" /> Scenario Parameters
          </h3>

          {/* Section Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Target Section:</label>
            <select
              value={sectionId}
              onChange={(e) => setSectionId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-orange-500"
            >
              {sections.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          {/* Track Line & Department */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Track Line:</label>
              <select
                value={lineId}
                onChange={(e) => setLineId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-orange-500"
              >
                <option value="UP_MAIN">UP Main (To Delhi)</option>
                <option value="DOWN_MAIN">DOWN Main (To HWH)</option>
                <option value="THIRD_LINE">3rd Reversible Track</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Department:</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-orange-500"
              >
                <option value="ENGINEERING">Civil Engineering</option>
                <option value="ELECTRICAL_OHE">Electrical OHE</option>
                <option value="SIGNAL_TELECOM">Signal & Telecom</option>
                <option value="TRAFFIC_OPERATING">Traffic Operating</option>
              </select>
            </div>
          </div>

          {/* Start Time Slider */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-400">Proposed Start Time:</span>
              <span className="font-mono text-orange-400 font-bold">{formatTimeStr(startMin)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1410"
              step="30"
              value={startMin}
              onChange={(e) => setStartMin(e.target.value)}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>00:00</span>
              <span>06:00</span>
              <span>12:00</span>
              <span>18:00</span>
              <span>24:00</span>
            </div>
          </div>

          {/* Duration Slider */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-400">Proposed Duration:</span>
              <span className="font-mono text-orange-400 font-bold">{Math.floor(durationMin / 60)}h {durationMin % 60}m ({durationMin} min)</span>
            </div>
            <input
              type="range"
              min="60"
              max="360"
              step="30"
              value={durationMin}
              onChange={(e) => setDurationMin(e.target.value)}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>1.0h</span>
              <span>2.5h</span>
              <span>4.0h</span>
              <span>6.0h</span>
            </div>
          </div>

          {/* Power Block Toggle */}
          <div className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-800">
            <div>
              <span className="text-xs font-bold text-white block">25kV OHE Power Cut Required</span>
              <span className="text-[10px] text-slate-400">De-energizes catenary for tower wagon work</span>
            </div>
            <input
              type="checkbox"
              checked={isPowerBlock}
              onChange={(e) => setIsPowerBlock(e.target.checked)}
              className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500 focus:ring-offset-slate-900"
            />
          </div>

          {/* Execute Simulation Button */}
          <button
            onClick={handleRunSimulation}
            disabled={isSimulating}
            className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-orange-500/20 transition-all active:scale-98"
          >
            <Play className={`w-4 h-4 fill-white ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? 'Running Discrete-Event Simulation...' : 'Run What-If Simulation'}</span>
          </button>
        </div>

        {/* Right: Simulation Results (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-950 p-5 rounded-2xl border border-slate-800">
          {!simResult ? (
            <div className="h-full min-h-[350px] flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-800 rounded-xl">
              <FlaskConical className="w-10 h-10 text-slate-600 mb-3" />
              <h4 className="text-sm font-bold text-slate-300">Ready for What-If Analysis</h4>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Configure your proposed maintenance window on the left and click "Run What-If Simulation" to evaluate timetable conflict & delay propagation.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              
              {/* Top Banner KPI */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-900 rounded-xl border border-slate-800">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Evaluated Window</span>
                  <div className="text-sm font-extrabold font-mono text-white">
                    {simResult.block_window_str}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-medium">Risk Level:</span>
                    <span className={`block text-xs font-black px-2 py-0.5 rounded-md font-mono ${
                      simResult.risk_level === 'LOW'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : simResult.risk_level === 'MODERATE'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : 'bg-red-500/20 text-red-400 border border-red-500/40'
                    }`}>
                      {simResult.risk_level} DISRUPTION
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-medium">AAI Impact:</span>
                    <span className="block text-xs font-extrabold text-red-400 font-mono">
                      {simResult.asset_availability_score_impact}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Advisory Box */}
              <div className="p-3.5 bg-orange-500/10 border border-orange-500/30 rounded-xl text-xs text-orange-200">
                <span className="font-extrabold text-orange-300 block mb-1">AI Operational Advisory:</span>
                <p className="leading-snug">{simResult.recommendation}</p>
              </div>

              {/* Delay Metric Tiles */}
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[11px] block">Affected Trains</span>
                  <span className="text-xl font-extrabold font-mono text-white">
                    {simResult.total_affected_trains}
                  </span>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[11px] block">Premium Passenger Delay</span>
                  <span className="text-xl font-extrabold font-mono text-amber-400">
                    {simResult.premium_train_delays_min}m
                  </span>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[11px] block">Freight Holding Delay</span>
                  <span className="text-xl font-extrabold font-mono text-blue-400">
                    {simResult.freight_train_delays_min}m
                  </span>
                </div>
              </div>

              {/* Recommended Alternative Low-Disruption Slots */}
              {simResult.alternative_slots && simResult.alternative_slots.length > 0 && (
                <div>
                  <span className="text-xs font-bold text-slate-300 block mb-2">
                    AI-Recommended Alternative Green Windows:
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {simResult.alternative_slots.map((alt, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setStartMin(alt.start_min);
                          handleRunSimulation();
                        }}
                        className="p-2.5 bg-slate-900 hover:bg-slate-800/80 border border-slate-700/80 rounded-xl text-left transition-all hover:border-orange-500/60"
                      >
                        <span className="text-[11px] font-bold font-mono text-emerald-400 block">
                          {alt.window_str}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Risk: <span className="font-semibold text-white">{alt.risk_rating} ({alt.disruption_score})</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Affected Trains Table */}
              {simResult.affected_trains && simResult.affected_trains.length > 0 && (
                <div>
                  <span className="text-xs font-bold text-slate-300 block mb-2">
                    Affected Trains & Precedence Actions:
                  </span>
                  <div className="max-h-48 overflow-y-auto border border-slate-800 rounded-xl bg-slate-900 text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-slate-950 text-slate-400 text-[10px] uppercase font-bold sticky top-0">
                        <tr>
                          <th className="p-2">Train</th>
                          <th className="p-2">Category</th>
                          <th className="p-2">Delay</th>
                          <th className="p-2">Action / Regulation</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {simResult.affected_trains.map(t => (
                          <tr key={t.train_number} className="hover:bg-slate-800/40">
                            <td className="p-2 font-mono font-bold text-white">
                              {t.train_number} <span className="font-sans font-normal text-slate-400 text-[11px]">{t.train_name}</span>
                            </td>
                            <td className="p-2">
                              <span className="bg-slate-800 text-slate-300 text-[10px] px-1.5 py-0.5 rounded font-mono">
                                {t.category}
                              </span>
                            </td>
                            <td className="p-2 font-mono font-bold text-amber-400">
                              +{t.delay_minutes}m
                            </td>
                            <td className="p-2 text-slate-300 text-[11px]">
                              {t.action_taken}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

      </div>

    </div>
  );
}
