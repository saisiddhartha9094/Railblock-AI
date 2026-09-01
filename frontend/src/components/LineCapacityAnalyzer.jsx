import React, { useState, useEffect } from 'react';
import { Gauge, TrendingUp, AlertTriangle, CheckCircle2, RefreshCw, Cpu, Split } from 'lucide-react';
import { api } from '../services/api';

export default function LineCapacityAnalyzer() {
  const [capacities, setCapacities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadCapacities();
  }, []);

  const loadCapacities = async () => {
    setIsLoading(true);
    try {
      const data = await api.getLineCapacityOverview();
      setCapacities(data || []);
    } catch (err) {
      console.error('Error loading capacity overview:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl mb-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <Gauge className="w-5 h-5 text-emerald-400" />
              Line Capacity Analyzer (Indian Railways Scott Formula)
            </h2>
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
              {"C = (1440 / (T + t)) × E"}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Mathematical track throughput modeling comparing baseline capacity vs. maintenance possession degradation vs. 3rd-line bi-directional bypass.
          </p>
        </div>

        <button
          onClick={loadCapacities}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Recalculate Scott Index</span>
        </button>
      </div>

      {/* Sections Capacity Table */}
      <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900/90 text-slate-400 text-[10px] uppercase font-extrabold border-b border-slate-800">
            <tr>
              <th className="p-3">Corridor Section</th>
              <th className="p-3">Tracks</th>
              <th className="p-3">Formula Variables (T, t, E)</th>
              <th className="p-3">Baseline Capacity (Trains/Day)</th>
              <th className="p-3">Actual Daily Load</th>
              <th className="p-3">During 3.5h Block</th>
              <th className="p-3">3rd Line Compensation</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 font-mono">
            {capacities.map(c => (
              <tr key={c.section_id} className="hover:bg-slate-900/40 transition-colors">
                <td className="p-3">
                  <span className="font-bold text-white block">{c.section_name}</span>
                  <span className="text-[10px] text-slate-500 font-sans">{c.length_km} km</span>
                </td>

                <td className="p-3 font-bold text-blue-400">
                  {c.tracks_count} Lines
                </td>

                <td className="p-3 text-[11px] text-slate-300">
                  {`T=${c.formula_parameters?.running_time_T_min || 0}m • t=${c.formula_parameters?.block_operation_t_min || 0}m • E=${c.formula_parameters?.efficiency_factor_E || 0.75}`}
                </td>

                <td className="p-3 font-bold text-emerald-400">
                  {c.baseline_daily_capacity_trains} <span className="text-[10px] text-slate-500 font-normal">({c.baseline_utilization_pct}%)</span>
                </td>

                <td className="p-3 font-bold text-white">
                  {c.actual_daily_traffic} Trains
                </td>

                <td className="p-3 font-bold text-amber-400">
                  {c.capacity_under_block} <span className="text-[10px] text-slate-500 font-normal">({c.utilization_under_block_pct}%)</span>
                </td>

                <td className="p-3 text-xs text-emerald-300 font-bold">
                  {c.third_line_compensation}
                </td>

                <td className="p-3 font-sans">
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-extrabold px-2 py-0.5 rounded-full font-mono">
                    {c.capacity_status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
