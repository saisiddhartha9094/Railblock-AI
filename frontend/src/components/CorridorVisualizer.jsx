import React, { useState, useEffect } from 'react';
import { Map, Train, AlertCircle, ShieldCheck, Zap, Activity, Navigation, Radio } from 'lucide-react';

export default function CorridorVisualizer({ corridor, liveStatus, scheduledBlocks = [] }) {
  const [activeTrainPositions, setActiveTrainPositions] = useState([]);

  useEffect(() => {
    if (liveStatus?.active_trains) {
      setActiveTrainPositions(liveStatus.active_trains);
    }
  }, [liveStatus]);

  const stations = corridor?.stations || [
    { code: 'SFG', name: 'Subedarganj', km: 0.0, platforms: 4 },
    { code: 'PRYJ', name: 'Prayagraj Jn', km: 3.8, platforms: 10 },
    { code: 'NYN', name: 'Naini Jn', km: 11.2, platforms: 4 },
    { code: 'MZP', name: 'Mirzapur', km: 88.5, platforms: 3 },
    { code: 'CAR', name: 'Chunar Jn', km: 119.8, platforms: 5 },
    { code: 'DDU', name: 'Pt. DDU Jn', km: 153.2, platforms: 8 }
  ];

  const sections = corridor?.sections || [];

  // Determine section maintenance status
  const getSectionStatus = (secId) => {
    // Current time ~630 min (10:30 AM)
    const activeBlock = scheduledBlocks.find(b => b.section_id === secId && b.scheduled_start_min <= 645 && b.scheduled_end_min >= 615);
    if (activeBlock) {
      return {
        status: 'BLOCK_ACTIVE',
        label: `Active Block: ${activeBlock.department.replace('_', ' ')}`,
        speed: '0 km/h (BLOCKED)',
        color: 'border-amber-500 bg-amber-950/40 text-amber-300'
      };
    }
    return {
      status: 'CLEAR',
      label: 'Line Clear (ABS Armed)',
      speed: '130 km/h Permissible',
      color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300'
    };
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl mb-6">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <Map className="w-5 h-5 text-orange-400" />
            Live Corridor GIS & Track Schematic (DDU - PRYJ Golden Quadrilateral)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time multi-track representation (UP Main, DOWN Main, 3rd Line) • ABS Signal Blocks & Kavach Active
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-slate-300 font-medium">Auto-Tracking: </span>
            <span className="font-mono text-emerald-400 font-bold">{liveStatus?.total_active_trains || 6} Rakes En Route</span>
          </div>
        </div>
      </div>

      {/* Corridor Visual Track Diagram */}
      <div className="relative overflow-x-auto p-6 bg-slate-950 rounded-2xl border border-slate-800/90 shadow-inner">
        <div className="min-w-[950px] relative pb-6">

          {/* Station Markers Line */}
          <div className="flex justify-between items-center relative z-20 mb-8 px-8">
            {stations.map((stn, idx) => (
              <div key={stn.code} className="flex flex-col items-center group cursor-pointer">
                <div className="w-9 h-9 rounded-xl bg-slate-900 border-2 border-orange-500/80 group-hover:border-orange-400 flex items-center justify-center shadow-lg shadow-orange-500/20 transition-transform group-hover:scale-110">
                  <span className="text-[11px] font-black text-orange-400 font-mono">{stn.code}</span>
                </div>
                <span className="text-xs font-bold text-white mt-2 group-hover:text-orange-300 transition-colors">
                  {stn.name}
                </span>
                <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                  Km {stn.km} • {stn.platforms || 4} Pl
                </span>
              </div>
            ))}
          </div>

          {/* Triple Track Infrastructure Visualizer */}
          <div className="space-y-6 relative z-10 px-8">
            
            {/* 1. UP MAIN LINE (Towards Delhi / Subedarganj) */}
            <div className="relative">
              <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1.5">
                <span className="flex items-center gap-1 text-orange-400 font-bold">
                  <Navigation className="w-3 h-3 rotate-180" /> UP MAIN TRACK (To Delhi)
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold">Max 130 km/h • MACLS Block</span>
              </div>
              <div className="h-3 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 rounded-full relative overflow-hidden border border-slate-700">
                {/* Moving Train Simulation on UP Line */}
                <div
                  className="absolute top-0 bottom-0 w-24 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full shadow-lg shadow-orange-500/50 flex items-center justify-center text-[8px] font-extrabold text-black font-mono animate-pulse"
                  style={{ left: '42%' }}
                  title="22435 Vande Bharat Express (BSB -> NDLS) Speed: 128 km/h"
                >
                  VB 22435 (128km/h)
                </div>
                <div
                  className="absolute top-0 bottom-0 w-28 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full shadow-lg shadow-emerald-500/50 flex items-center justify-center text-[8px] font-extrabold text-black font-mono"
                  style={{ left: '78%' }}
                  title="FR_BOXN_101 Heavy Coal Rake (DDU -> Dadri Power)"
                >
                  BOXN-101 (72km/h)
                </div>
              </div>
            </div>

            {/* 2. DOWN MAIN LINE (Towards Howrah / Pt. DDU) */}
            <div className="relative">
              <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1.5">
                <span className="flex items-center gap-1 text-blue-400 font-bold">
                  <Navigation className="w-3 h-3" /> DOWN MAIN TRACK (To Howrah)
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold">Max 130 km/h • 25kV OHE</span>
              </div>
              <div className="h-3 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 rounded-full relative overflow-hidden border border-slate-700">
                {/* Moving Train on DOWN Line */}
                <div
                  className="absolute top-0 bottom-0 w-24 bg-gradient-to-r from-amber-400 to-red-500 rounded-full shadow-lg shadow-red-500/50 flex items-center justify-center text-[8px] font-extrabold text-white font-mono animate-pulse"
                  style={{ left: '18%' }}
                  title="12302 Howrah Rajdhani Express (NDLS -> HWH) Speed: 130 km/h"
                >
                  RAJ 12302 (130km/h)
                </div>
                <div
                  className="absolute top-0 bottom-0 w-24 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full shadow-lg shadow-blue-500/50 flex items-center justify-center text-[8px] font-extrabold text-white font-mono"
                  style={{ left: '60%' }}
                  title="FR_CONT_202 Double Stack Container (JNPT -> TKD)"
                >
                  CONCOR-202 (95km/h)
                </div>
              </div>
            </div>

            {/* 3. THIRD REVERSIBLE FREIGHT / PASSENGER CORRIDOR */}
            <div className="relative">
              <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1.5">
                <span className="flex items-center gap-1 text-purple-400 font-bold">
                  <Radio className="w-3 h-3" /> 3RD REVERSIBLE DIVERSIION LINE
                </span>
                <span className="text-[10px] text-purple-300 font-semibold">Bi-Directional Auto Block</span>
              </div>
              <div className="h-2.5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-full relative overflow-hidden border border-slate-800">
                <div
                  className="absolute top-0 bottom-0 w-20 bg-purple-500/80 rounded-full shadow-md shadow-purple-500/50 flex items-center justify-center text-[8px] font-extrabold text-white font-mono"
                  style={{ left: '82%' }}
                >
                  CLEAR
                </div>
              </div>
            </div>

          </div>

          {/* Section Inter-Station Status Badges */}
          <div className="grid grid-cols-5 gap-3 mt-8 px-2 text-xs">
            {sections.map(sec => {
              const secInfo = getSectionStatus(sec.id);
              return (
                <div
                  key={sec.id}
                  className={`p-3 rounded-xl border ${secInfo.color} transition-all hover:scale-[1.02] flex flex-col justify-between`}
                >
                  <div>
                    <span className="font-bold block text-slate-200 truncate">{sec.name}</span>
                    <span className="text-[10px] font-mono opacity-80 block mt-0.5">{sec.length_km} km</span>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[10px] font-semibold">{secInfo.label}</span>
                    <span className="text-[9px] font-mono bg-black/40 px-1 rounded">{secInfo.speed}</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>

    </div>
  );
}
