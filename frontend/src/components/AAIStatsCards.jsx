import React from 'react';
import { TrendingUp, Layers, Clock, ShieldCheck, Zap, TrainTrack } from 'lucide-react';

export default function AAIStatsCards({ aaiData, onRefresh }) {
  if (!aaiData) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-pulse">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-28 bg-slate-900/60 rounded-xl border border-slate-800"></div>
        ))}
      </div>
    );
  }

  const {
    overall_aai_score = 88.5,
    aai_score_baseline_manual = 60.0,
    aai_gain_pct = 28.5,
    total_delay_minutes_saved = 2506,
    clubbing_efficiency_pct = 62.5,
    sub_indices = {},
    corridor_punctuality_forecast_pct = 98.6
  } = aaiData;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      
      {/* 1. Primary KPI: Asset Availability Index (AAI) */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950 p-5 rounded-2xl border border-orange-500/30 shadow-xl group hover:border-orange-500/60 transition-all">
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <TrainTrack className="w-4 h-4 text-orange-400" />
            Asset Availability Index (AAI)
          </span>
          <span className="bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-[11px] font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            +{aai_gain_pct}%
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold font-mono text-white tracking-tight">
            {overall_aai_score}%
          </span>
          <span className="text-xs text-slate-500 line-through font-mono">
            {aai_score_baseline_manual}% Manual
          </span>
        </div>
        <div className="mt-3">
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-400 h-full rounded-full transition-all duration-1000"
              style={{ width: `${Math.min(100, overall_aai_score)}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 mt-1.5 font-medium">
            <span>Track + Rake + Loco Ready</span>
            <span className="text-emerald-400 font-semibold">Max Availability</span>
          </div>
        </div>
      </div>

      {/* 2. Cross-Department Clubbing Efficiency */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-blue-400" />
            Joint Block Clubbing
          </span>
          <span className="bg-blue-500/15 border border-blue-500/40 text-blue-300 text-[11px] font-bold px-2 py-0.5 rounded-md">
            Engg + S&T + OHE
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold font-mono text-blue-400 tracking-tight">
            {clubbing_efficiency_pct}%
          </span>
          <span className="text-xs text-slate-400">Co-scheduled</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-3 font-medium">
          Unified traffic shadows avoid repeat line closures across Prayagraj Division.
        </p>
      </div>

      {/* 3. Disruption Minutes Saved */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-emerald-400" />
            Corridor Delays Avoided
          </span>
          <span className="bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold px-2 py-0.5 rounded-md">
            Punctuality 98.6%
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold font-mono text-emerald-400 tracking-tight">
            {total_delay_minutes_saved.toLocaleString()}
          </span>
          <span className="text-xs text-slate-400">Min Saved / Day</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-3 font-medium">
          Zero delay penalty to Rajdhani, Vande Bharat & DFCCIL link freight rakes.
        </p>
      </div>

      {/* 4. Sub-Asset Availability Breakdown */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-400" />
            Asset Sub-Indices
          </span>
          <span className="text-[10px] text-slate-400 font-mono">RDSO Compliant</span>
        </div>
        <div className="space-y-2 mt-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">Track Line Availability:</span>
            <span className="font-mono font-bold text-white">{sub_indices.track_line_availability || 90.9}%</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">Locomotive Turnaround:</span>
            <span className="font-mono font-bold text-white">{sub_indices.loco_turnaround_rate || 86.7}%</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">Freight Rake Utilization:</span>
            <span className="font-mono font-bold text-white">{sub_indices.rolling_stock_utilization || 85.0}%</span>
          </div>
        </div>
      </div>

    </div>
  );
}
