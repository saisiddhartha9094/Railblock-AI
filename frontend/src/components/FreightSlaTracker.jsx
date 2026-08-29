import React, { useState, useEffect } from 'react';
import { PackageCheck, ShieldAlert, CheckCircle2, TrendingUp, Clock, AlertTriangle, RefreshCw } from 'lucide-react';
import { api } from '../services/api';

export default function FreightSlaTracker() {
  const [freightRakes, setFreightRakes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadFreightData();
  }, []);

  const loadFreightData = async () => {
    setIsLoading(true);
    try {
      const data = await api.getFoisFreightSla();
      setFreightRakes(data);
    } catch (err) {
      console.error('Error loading FOIS data:', err);
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
              <PackageCheck className="w-5 h-5 text-emerald-400" />
              FOIS / COIS Freight Supply Chain SLA & Demurrage Optimizer
            </h2>
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
              CRIS FOIS LIVE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time industrial delivery deadline tracking (NTPC Thermal Coal, CONCOR DFCCIL Export Containers, FCI Foodgrains) to protect supply chain SLAs.
          </p>
        </div>

        <button
          onClick={loadFreightData}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh FOIS Feeds</span>
        </button>
      </div>

      {/* Rakes Table */}
      <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900/90 text-slate-400 text-[10px] uppercase font-extrabold border-b border-slate-800">
            <tr>
              <th className="p-3">Rake ID & Name</th>
              <th className="p-3">Commodity & Consignee</th>
              <th className="p-3">Route (Origin &rarr; Dest)</th>
              <th className="p-3">Target SLA Arrival</th>
              <th className="p-3">Max Delay Buffer</th>
              <th className="p-3">Demurrage Risk (INR/Hr)</th>
              <th className="p-3">SLA Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {freightRakes.map(r => (
              <tr key={r.rake_id} className="hover:bg-slate-900/40 transition-colors">
                <td className="p-3 font-mono">
                  <span className="font-bold text-white block">{r.rake_id}</span>
                  <span className="text-[10px] text-slate-400 font-sans">{r.train_name}</span>
                </td>

                <td className="p-3">
                  <span className="font-semibold text-slate-200 block">{r.commodity}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{r.consignee}</span>
                </td>

                <td className="p-3 font-mono text-[11px] text-slate-300">
                  {r.origin} &rarr; {r.destination}
                </td>

                <td className="p-3 font-mono font-bold text-white">
                  {formatMinToStr(r.sla_target_arrival_min)}
                </td>

                <td className="p-3 font-mono text-emerald-400 font-semibold">
                  &le; {r.max_delay_tolerance_min} min
                </td>

                <td className="p-3 font-mono text-amber-400 font-bold">
                  &#8377;{r.penalty_per_hour_inr.toLocaleString()}/hr
                </td>

                <td className="p-3">
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-extrabold px-2 py-0.5 rounded-full font-mono flex items-center gap-1 w-max">
                    <CheckCircle2 className="w-3 h-3" />
                    {r.sla_status}
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
