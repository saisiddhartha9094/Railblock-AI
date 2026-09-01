import React, { useState } from 'react';
import { Layers, ShieldCheck, AlertTriangle, Sparkles, Filter, ChevronRight, Info, Train, Clock, CheckCircle } from 'lucide-react';

export default function BlockGanttMatrix({ scheduledBlocks = [], timetable = [], corridor, onBlockSelect, selectedBlock }) {
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('ALL');
  const [selectedLineFilter, setSelectedLineFilter] = useState('ALL');
  const [showTrainPaths, setShowTrainPaths] = useState(true);

  const sections = corridor?.sections || [
    { id: 'SEC_SFG_PRYJ', name: 'Subedarganj (SFG) - Prayagraj (PRYJ)', length_km: 4.2 },
    { id: 'SEC_PRYJ_NYN', name: 'Prayagraj (PRYJ) - Naini (NYN)', length_km: 7.8 },
    { id: 'SEC_NYN_MZP', name: 'Naini (NYN) - Mirzapur (MZP)', length_km: 78.4 },
    { id: 'SEC_MZP_CAR', name: 'Mirzapur (MZP) - Chunar (CAR)', length_km: 31.6 },
    { id: 'SEC_CAR_DDU', name: 'Chunar (CAR) - Pt. DDU Jn (DDU)', length_km: 31.2 }
  ];

  // 24 Hour timeline hours (0 to 23)
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Filter blocks
  const filteredBlocks = (scheduledBlocks || []).filter(b => {
    if (!b) return false;
    if (selectedDeptFilter !== 'ALL' && b.department !== selectedDeptFilter) return false;
    const lineStr = String(b.line_id || '');
    if (selectedLineFilter !== 'ALL' && !lineStr.includes(selectedLineFilter)) return false;
    return true;
  });

  const getDeptColor = (dept, isClubbed) => {
    if (isClubbed) return 'bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 border-amber-300 text-amber-100 shadow-lg shadow-amber-500/20';
    switch (dept) {
      case 'ENGINEERING':
        return 'bg-orange-600/90 border-orange-400 text-orange-100 hover:bg-orange-500';
      case 'ELECTRICAL_OHE':
        return 'bg-amber-500/90 border-amber-300 text-amber-950 font-bold hover:bg-amber-400';
      case 'SIGNAL_TELECOM':
        return 'bg-blue-600/90 border-blue-400 text-blue-100 hover:bg-blue-500';
      case 'TRAFFIC_OPERATING':
        return 'bg-emerald-600/90 border-emerald-400 text-emerald-100 hover:bg-emerald-500';
      default:
        return 'bg-purple-600/90 border-purple-400 text-purple-100';
    }
  };

  const getDeptBadge = (dept) => {
    switch (dept) {
      case 'ENGINEERING': return 'ENGG';
      case 'ELECTRICAL_OHE': return 'OHE';
      case 'SIGNAL_TELECOM': return 'S&T';
      case 'TRAFFIC_OPERATING': return 'TRAFFIC';
      default: return dept || 'BLOCK';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl mb-6">
      
      {/* Top Bar: Controls & Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-orange-400" />
            24-Hour Corridor Block Matrix & Multi-Department Possessions
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Prayagraj - Pt. Deen Dayal Upadhyaya Junction (153.2 km) • Automatic Conflict Resolution Active
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Dept Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs">
            <span className="text-slate-500 text-[11px] font-medium">Dept:</span>
            <select
              value={selectedDeptFilter}
              onChange={(e) => setSelectedDeptFilter(e.target.value)}
              className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900 text-slate-200">All Departments</option>
              <option value="ENGINEERING" className="bg-slate-900 text-orange-400">Civil Engineering</option>
              <option value="ELECTRICAL_OHE" className="bg-slate-900 text-amber-400">Electrical OHE</option>
              <option value="SIGNAL_TELECOM" className="bg-slate-900 text-blue-400">Signal & Telecom</option>
              <option value="TRAFFIC_OPERATING" className="bg-slate-900 text-emerald-400">Traffic / Yard</option>
            </select>
          </div>

          {/* Line Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs">
            <span className="text-slate-500 text-[11px] font-medium">Track:</span>
            <select
              value={selectedLineFilter}
              onChange={(e) => setSelectedLineFilter(e.target.value)}
              className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900 text-slate-200">All Tracks</option>
              <option value="UP" className="bg-slate-900 text-slate-200">UP Main (Delhi Dir)</option>
              <option value="DOWN" className="bg-slate-900 text-slate-200">DOWN Main (HWH Dir)</option>
              <option value="THIRD" className="bg-slate-900 text-slate-200">3rd Line / Reversible</option>
            </select>
          </div>

          {/* Train Trajectory Toggle */}
          <button
            onClick={() => setShowTrainPaths(!showTrainPaths)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
              showTrainPaths
                ? 'bg-orange-500/15 border-orange-500/40 text-orange-300'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Train className="w-3.5 h-3.5" />
            <span>{showTrainPaths ? 'Hide Train Paths' : 'Show Train Paths'}</span>
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs mb-4 px-2 py-1.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
        <span className="text-slate-400 font-bold text-[11px]">LEGEND:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-orange-600 border border-orange-400"></span>
          <span className="text-slate-300 font-medium">Civil Engineering (Track/BCM/CSM)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-amber-500 border border-amber-300"></span>
          <span className="text-slate-300 font-medium">Electrical OHE (25kV Power Block)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-blue-600 border border-blue-400"></span>
          <span className="text-slate-300 font-medium">Signal & Telecom (EI/Point/Axle)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-emerald-600 border border-emerald-400"></span>
          <span className="text-slate-300 font-medium">Traffic / Platform Yard</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded bg-gradient-to-r from-amber-500 to-orange-500 border-2 border-amber-200 shadow-sm"></span>
          <span className="text-amber-300 font-bold flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-300" />
            Joint Clubbed Possession
          </span>
        </div>
      </div>

      {/* Gantt Timeline Container */}
      <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950/90 shadow-inner">
        <div className="min-w-[1100px]">
          
          {/* Header Time Axis (00:00 to 23:00) */}
          <div
            className="border-b border-slate-800 bg-slate-900/90 sticky top-0 z-20"
            style={{ display: 'grid', gridTemplateColumns: '220px 1fr' }}
          >
            <div className="p-2.5 text-[11px] font-bold uppercase text-slate-400 border-r border-slate-800 bg-slate-900">
              Corridor Section (Block)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(24, minmax(0, 1fr))' }}>
              {hours.map(h => (
                <div
                  key={h}
                  className={`p-2 text-center text-[10px] font-mono font-semibold border-r border-slate-800/60 ${
                    (1 <= h && h <= 5) ? 'bg-indigo-950/40 text-indigo-300 font-bold' : 'text-slate-400'
                  }`}
                >
                  {h.toString().padStart(2, '0')}:00
                </div>
              ))}
            </div>
          </div>

          {/* Section Rows */}
          {sections.map((sec, idx) => {
            const secBlocks = filteredBlocks.filter(b => b && b.section_id === sec.id);

            return (
              <div
                key={sec.id}
                className={`border-b border-slate-800/80 hover:bg-slate-900/30 transition-colors ${
                  idx % 2 === 0 ? 'bg-slate-950/40' : 'bg-slate-900/20'
                }`}
                style={{ display: 'grid', gridTemplateColumns: '220px 1fr' }}
              >
                {/* Section Info Header */}
                <div className="p-3.5 border-r border-slate-800 flex flex-col justify-center bg-slate-900/40">
                  <div className="text-xs font-bold text-slate-200 tracking-tight leading-tight">
                    {sec.name}
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] text-orange-400 font-mono font-semibold">
                      {sec.length_km ? `${sec.length_km} km` : 'High Density'}
                    </span>
                    <span className="text-[10px] bg-slate-800/90 text-slate-300 px-1.5 py-0.2 rounded font-mono">
                      3 Lines
                    </span>
                  </div>
                </div>

                {/* 24-Hour Timeline Grid Cell */}
                <div className="relative min-h-[90px] p-1.5 overflow-hidden">
                  
                  {/* Night Shadow Corridor Background (01:00 to 05:00) */}
                  <div
                    className="absolute top-0 bottom-0 bg-blue-500/5 border-x border-blue-500/10 pointer-events-none z-0"
                    style={{ left: `${(60 / 1440) * 100}%`, width: `${(240 / 1440) * 100}%` }}
                  >
                    <span className="absolute top-1 left-2 text-[9px] font-mono font-bold text-blue-400/40 uppercase">
                      Night Shadow Window (01:00 - 05:00)
                    </span>
                  </div>

                  {/* Vertical Hour Grid Lines (24 Columns) */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(24, minmax(0, 1fr))' }}
                  >
                    {hours.map(h => (
                      <div key={h} className="border-r border-slate-800/30 h-full"></div>
                    ))}
                  </div>

                  {/* Train Trajectory Ghost Paths */}
                  {showTrainPaths && (timetable || []).map((t) => {
                    if (t && t.section_traversal_times && sec.id in t.section_traversal_times) {
                      const tr = t.section_traversal_times[sec.id];
                      if (!tr) return null;
                      const leftPct = (tr.entry_min / 1440) * 100;
                      const widthPct = Math.max(0.8, ((tr.exit_min - tr.entry_min) / 1440) * 100);
                      const isPremium = t.category === 'VANDE_BHARAT' || t.category === 'RAJDHANI';
                      const isFreight = String(t.category || '').includes('FREIGHT');

                      return (
                        <div
                          key={`${t.train_number}-${sec.id}`}
                          className={`absolute top-2 h-2 rounded-full pointer-events-none opacity-40 z-5 ${
                            isPremium ? 'bg-amber-400' : (isFreight ? 'bg-emerald-400' : 'bg-blue-400')
                          }`}
                          style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                          title={`Train ${t.train_number} (${t.train_name})`}
                        ></div>
                      );
                    }
                    return null;
                  })}

                  {/* Scheduled Possession Blocks */}
                  {secBlocks.map(block => {
                    const leftPct = ((block.scheduled_start_min || 0) / 1440) * 100;
                    const widthPct = Math.max(3.5, ((block.duration_min || 60) / 1440) * 100);
                    const isSelected = selectedBlock?.demand_id === block.demand_id;
                    const lineLabel = String(block.line_id || '').replace(/_/g, ' ');

                    return (
                      <div
                        key={block.demand_id}
                        onClick={() => onBlockSelect && onBlockSelect(block)}
                        style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                        className={`absolute top-6 bottom-2 rounded-xl p-2 cursor-pointer transition-all duration-200 border z-10 flex flex-col justify-between overflow-hidden group hover:scale-[1.02] hover:z-30 ${getDeptColor(
                          block.department,
                          block.is_clubbed
                        )} ${isSelected ? 'ring-2 ring-white scale-[1.02] shadow-2xl z-30' : ''}`}
                      >
                        <div className="flex items-center justify-between gap-1 leading-none">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded bg-black/40 text-white font-mono flex items-center gap-1">
                            {block.is_clubbed && <Sparkles className="w-2.5 h-2.5 text-amber-300 animate-pulse" />}
                            {getDeptBadge(block.department)}
                          </span>
                          <span className="text-[9px] font-mono font-bold text-white/90">
                            {block.duration_min}m
                          </span>
                        </div>

                        <div className="text-[10px] font-semibold text-white/95 truncate leading-tight mt-1">
                          {block.work_description}
                        </div>

                        <div className="flex items-center justify-between text-[9px] text-white/80 font-mono mt-0.5">
                          <span>{lineLabel}</span>
                          {block.is_clubbed ? (
                            <span className="font-bold text-amber-200 bg-black/30 px-1 rounded">JOINT</span>
                          ) : (
                            <span className="text-emerald-200 font-semibold">RDSO OK</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Block Quick Inspector Card */}
      {selectedBlock && (
        <div className="mt-5 p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-slideUp">
          <div className="flex items-start gap-3">
            <div className={`p-2.5 rounded-lg text-white ${getDeptColor(selectedBlock.department, selectedBlock.is_clubbed)}`}>
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-slate-400">{selectedBlock.demand_id}</span>
                <span className="font-bold text-white text-sm">{selectedBlock.work_description}</span>
                {selectedBlock.is_clubbed && (
                  <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold px-2 py-0.5 rounded font-mono">
                    JOINT POSSESSION
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {selectedBlock.justification || 'Standard corridor maintenance window allocated by CP-SAT optimizer.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="text-right">
              <span className="text-slate-500 block text-[10px]">TIME WINDOW</span>
              <span className="font-bold text-white">
                {Math.floor(selectedBlock.scheduled_start_min / 60).toString().padStart(2, '0')}:
                {(selectedBlock.scheduled_start_min % 60).toString().padStart(2, '0')} →{' '}
                {Math.floor(selectedBlock.scheduled_end_min / 60).toString().padStart(2, '0')}:
                {(selectedBlock.scheduled_end_min % 60).toString().padStart(2, '0')}
              </span>
            </div>
            <div className="text-right">
              <span className="text-slate-500 block text-[10px]">SECTION</span>
              <span className="font-bold text-orange-400">{selectedBlock.section_id}</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
