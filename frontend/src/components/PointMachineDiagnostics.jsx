import React, { useState, useEffect } from 'react';
import { Activity, Sparkles, CheckCircle2, AlertTriangle, ShieldAlert, Cpu, Wrench, RefreshCw } from 'lucide-react';
import { api } from '../services/api';

export default function PointMachineDiagnostics({ onDemandGenerated }) {
  const [pointMachines, setPointMachines] = useState([]);
  const [selectedPointId, setSelectedPointId] = useState('PM_NYN_101');
  const [currentSignature, setCurrentSignature] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    loadPointMachines();
  }, []);

  useEffect(() => {
    if (selectedPointId) {
      loadSignature(selectedPointId);
    }
  }, [selectedPointId]);

  const loadPointMachines = async () => {
    setIsLoading(true);
    try {
      const list = await api.getPointMachinesList();
      setPointMachines(list);
    } catch (err) {
      console.error('Error loading point machines:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSignature = async (pointId) => {
    try {
      const sig = await api.getPointSignature(pointId);
      setCurrentSignature(sig);
    } catch (err) {
      console.error('Error loading point signature:', err);
    }
  };

  const handleAutoGenerateBlock = async () => {
    if (!selectedPointId) return;
    setIsGenerating(true);
    setSuccessMsg('');
    try {
      const res = await api.autoGeneratePointMicroBlock(selectedPointId);
      setSuccessMsg(`Auto-Generated S&T Micro-Block: ${res.demand.id} (${res.demand.requested_duration_min} min window)`);
      if (onDemandGenerated) onDemandGenerated();
    } catch (err) {
      console.error('Error auto-generating point micro-block:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl mb-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-400" />
              Point Machine Current Signature Diagnostics & Predictive S&T Engine
            </h2>
            <span className="bg-blue-500/10 text-blue-400 border border-blue-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
              RDSO IRS:S 24
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time electric throw current waveform analysis (Ampere vs Time) to detect switch motor degradation and prevent signal failures.
          </p>
        </div>

        <button
          onClick={loadPointMachines}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Telemetry</span>
        </button>
      </div>

      {successMsg && (
        <div className="mb-4 p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Grid: Machine Selector & Oscilloscope Waveform */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Point Machine Selector (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Monitored Point Machines (S&T Division)
          </span>

          {pointMachines.map(pm => {
            const isSelected = selectedPointId === pm.point_id;
            return (
              <div
                key={pm.point_id}
                onClick={() => setSelectedPointId(pm.point_id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-slate-950 border-blue-500/80 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500'
                    : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-white">Point {pm.point_no}</span>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded font-mono ${
                    pm.status === 'HEALTHY'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : pm.status === 'DEGRADING_FRICTION'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse'
                  }`}>
                    {pm.status}
                  </span>
                </div>

                <div className="text-[11px] text-slate-300 font-medium mt-1">{pm.location}</div>
                <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-2 pt-1.5 border-t border-slate-800/80">
                  <span>{pm.motor_type}</span>
                  <span className="text-slate-200 font-bold">{pm.peak_current_amp}A Peak</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Interactive Oscilloscope & Diagnostics (8 Cols) */}
        <div className="lg:col-span-8 bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
          {currentSignature && (
            <>
              {/* Top Banner Details */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <span className="text-xs font-bold text-slate-400">Selected Switch Unit:</span>
                  <div className="text-sm font-extrabold font-mono text-white flex items-center gap-2">
                    <span>Point {currentSignature.point_no} ({currentSignature.location})</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block font-mono">RMS Current</span>
                    <span className="text-xs font-mono font-bold text-blue-400">{currentSignature.rms_current_amp} A</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block font-mono">Throw Duration</span>
                    <span className="text-xs font-mono font-bold text-amber-400">{currentSignature.throw_duration_sec} s</span>
                  </div>
                </div>
              </div>

              {/* Oscilloscope Waveform Canvas Visualizer */}
              <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800">
                <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-2">
                  <span className="text-blue-400 font-bold flex items-center gap-1">
                    <Cpu className="w-3.5 h-3.5" /> Motor Throw Current Waveform (A vs t)
                  </span>
                  <span>Clutch Trip Threshold: 5.5A</span>
                </div>

                {/* SVG Oscilloscope Waveform */}
                <div className="h-44 w-full bg-black/80 rounded-lg p-2 relative overflow-hidden border border-slate-800">
                  {/* Grid Lines */}
                  <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 opacity-15 pointer-events-none">
                    {Array.from({ length: 24 }).map((_, i) => (
                      <div key={i} className="border-r border-b border-cyan-400"></div>
                    ))}
                  </div>

                  {/* SVG Waveform Polyline */}
                  <svg className="w-full h-full" viewBox="0 0 450 150" preserveAspectRatio="none">
                    {/* Normal Baseline Reference (Dashed) */}
                    <path
                      d="M 0 140 L 20 40 L 40 100 L 320 100 L 360 145 L 450 145"
                      fill="none"
                      stroke="#334155"
                      strokeWidth="2"
                      strokeDasharray="4"
                    />

                    {/* Live Waveform Path */}
                    {currentSignature.waveform && (
                      <path
                        d={currentSignature.waveform.reduce((acc, pt, idx) => {
                          const x = (pt.time_sec / 4.5) * 450;
                          const y = 145 - (pt.current_amp / 6.0) * 135;
                          return `${acc} ${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                        }, '')}
                        fill="none"
                        stroke={
                          currentSignature.status === 'HEALTHY'
                            ? '#10b981'
                            : currentSignature.status === 'DEGRADING_FRICTION'
                            ? '#f59e0b'
                            : '#ef4444'
                        }
                        strokeWidth="2.5"
                      />
                    )}
                  </svg>

                  {/* Waveform Labels */}
                  <div className="absolute bottom-1 right-2 text-[9px] font-mono text-slate-500">
                    Time Horizon: 0.0s to 4.5s
                  </div>
                  <div className="absolute top-1 left-2 text-[9px] font-mono text-cyan-400">
                    Scale: 0.0A - 6.0A DC
                  </div>
                </div>
              </div>

              {/* Diagnostic Explanation & Action Box */}
              <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 text-xs space-y-2">
                <div>
                  <span className="font-bold text-slate-300 block mb-0.5">Automated S&T Diagnostic:</span>
                  <p className="text-slate-200 leading-snug">{currentSignature.diagnostic}</p>
                </div>
                <div>
                  <span className="font-bold text-amber-300 block mb-0.5">Recommended Action:</span>
                  <p className="text-amber-200/90 leading-snug">{currentSignature.recommendation}</p>
                </div>
              </div>

              {/* 1-Click Auto-Generate Micro-Block Demand Button */}
              {currentSignature.requires_micro_block && (
                <button
                  onClick={handleAutoGenerateBlock}
                  disabled={isGenerating}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-98"
                >
                  <Wrench className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                  <span>
                    {isGenerating ? 'Synthesizing S&T Micro-Block...' : 'Auto-Generate Predictive S&T Micro-Block (30 min)'}
                  </span>
                </button>
              )}
            </>
          )}
        </div>

      </div>

    </div>
  );
}
