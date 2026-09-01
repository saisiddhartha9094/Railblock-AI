import React, { useState, useEffect } from 'react';
import { Train, ShieldAlert, Cpu, Sparkles, RefreshCw, Clock, Radio, Mic, Presentation, Download } from 'lucide-react';
import { api } from '../services/api';

export default function Header({ onTriggerEmergency, onTriggerVoice, onTriggerPitchDeck, onRunOptimization, isOptimizing, aaiScore }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleExportCOA = async () => {
    try {
      const data = await api.exportCrisCoaJson();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `CRIS_COA_TRANSMISSION_PRYJ_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
    } catch (err) {
      console.error('Error exporting CRIS COA data:', err);
    }
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 px-6 py-3.5 sticky top-0 z-50 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Left: Branding & Division */}
        <div className="flex items-center gap-4">
          <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-orange-500 via-amber-600 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/20 border border-orange-400/40">
            <Train className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-amber-200 to-white">
                RailBlock-AI
              </span>
              <span className="bg-orange-500/10 text-orange-400 border border-orange-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider">
                SIH26027
              </span>
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                CRIS TMS & FOIS LIVE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Ministry of Railways • <span className="text-slate-200 font-semibold">Prayagraj Division (NCR)</span> • DDU-PRYJ High Density Corridor
            </p>
          </div>
        </div>

        {/* Center: Realtime Telemetry Pills */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-lg px-3 py-1.5 flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <div className="text-[11px]">
              <span className="text-slate-400">Kavach ATP: </span>
              <span className="text-emerald-300 font-mono font-medium">SIL-4 ARMED</span>
            </div>
          </div>
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-lg px-3 py-1.5 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></div>
            <div className="text-[11px]">
              <span className="text-slate-400">25kV OHE Grid: </span>
              <span className="text-amber-300 font-mono font-medium">5/5 TSS HEALTHY</span>
            </div>
          </div>
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-lg px-3 py-1.5 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[11px] font-mono text-blue-300 font-semibold">
              {time.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
            </span>
          </div>
        </div>

        {/* Right: Primary Controls & Presentation Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onTriggerPitchDeck}
            className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg text-xs font-bold transition-all shadow-md active:scale-95"
            title="10-Slide Pitch Deck Presentation Mode"
          >
            <Presentation className="w-4 h-4 text-purple-200" />
            <span>Pitch Deck</span>
          </button>

          <button
            onClick={handleExportCOA}
            className="flex items-center gap-1.5 px-2.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition-all border border-slate-700"
            title="Export CRIS Control Office Application (COA) Payload"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>COA Export</span>
          </button>

          <button
            onClick={onTriggerVoice}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-semibold transition-all shadow-sm active:scale-95"
            title="Indic Voice & Multilingual Assistant"
          >
            <Mic className="w-4 h-4 text-amber-400" />
            <span>Voice</span>
          </button>

          <button
            onClick={onTriggerEmergency}
            className="flex items-center gap-1.5 px-3 py-2 bg-red-950/60 hover:bg-red-900/80 text-red-300 hover:text-white border border-red-700/60 rounded-lg text-xs font-semibold transition-all shadow-sm active:scale-95"
            title="Inject Rail Fracture / OHE Failure"
          >
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <span>Emergency</span>
          </button>

          <button
            onClick={onRunOptimization}
            disabled={isOptimizing}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all shadow-lg active:scale-95 ${
              isOptimizing
                ? 'bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed'
                : 'bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white shadow-orange-500/25 border border-orange-400/50'
            }`}
          >
            <Sparkles className={`w-4 h-4 ${isOptimizing ? 'animate-spin' : 'text-amber-200'}`} />
            <span>{isOptimizing ? 'Solving...' : 'AI Optimize'}</span>
          </button>
        </div>

      </div>
    </header>
  );
}
