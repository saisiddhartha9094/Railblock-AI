import React, { useState, useEffect } from 'react';
import { GitFork, Split, ShieldCheck, CheckCircle2, RefreshCw, Layers } from 'lucide-react';
import { api } from '../services/api';

export default function YardInterlockingMatrix() {
  const [yards, setYards] = useState([]);
  const [selectedYard, setSelectedYard] = useState('PRYJ');

  useEffect(() => {
    loadYards();
  }, []);

  const loadYards = async () => {
    try {
      const data = await api.getYardInterlockingOverview();
      setYards(data);
    } catch (err) {
      console.error('Error loading yards:', err);
    }
  };

  const activeYard = yards.find(y => y.yard_code === selectedYard) || yards[0];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl mb-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <Split className="w-5 h-5 text-blue-400" />
              Station Yard Platform & Diamond Crossover Interlocking Matrix
            </h2>
            <span className="bg-blue-500/10 text-blue-400 border border-blue-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
              EI ROUTE-RELAY LOGIC
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Demonstrates micro-block isolation: closing a single platform apron line or crossover switch while main line through-traffic runs unhindered at 130 km/h.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {yards.map(y => (
            <button
              key={y.yard_code}
              onClick={() => setSelectedYard(y.yard_code)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                selectedYard === y.yard_code
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/50'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {y.name}
            </button>
          ))}
        </div>
      </div>

      {activeYard && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Platform Roads Status (7 Cols) */}
          <div className="lg:col-span-7 bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Platform Line Allocations & Possession Isolation
            </span>

            {activeYard.platforms.map(p => {
              const isMaintenance = p.occupancy.includes('MAINTENANCE');
              const isOccupied = p.occupancy.includes('OCCUPIED');
              return (
                <div
                  key={p.platform_no}
                  className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                    isMaintenance
                      ? 'bg-orange-950/20 border-orange-500/50'
                      : isOccupied
                      ? 'bg-blue-950/20 border-blue-500/40'
                      : 'bg-slate-900/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center font-mono font-bold text-xs text-white">
                      PF {p.platform_no}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">{p.dedicated_to}</span>
                      <span className="text-[10px] text-slate-500 font-mono">Length: {p.length_m} meters</span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded font-mono ${
                    isMaintenance
                      ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40 animate-pulse'
                      : isOccupied
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}>
                    {p.occupancy.replace(/_/g, ' ')}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Right: Scissors Crossovers Status (5 Cols) */}
          <div className="lg:col-span-5 bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Diamond Scissors Crossovers & Yard Throats
            </span>

            {activeYard.crossovers.map(x => (
              <div
                key={x.crossover_id}
                className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-white">{x.crossover_id}</span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    x.status === 'CLEAR'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}>
                    {x.status}
                  </span>
                </div>
                <div className="text-xs text-slate-300 font-medium leading-snug">{x.name}</div>
              </div>
            ))}

            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-xs text-slate-400">
              <strong className="text-emerald-400">Through Traffic Protected:</strong> Electronic Interlocking automatically locks diamond crossovers to shunt incoming trains away from active maintenance lines.
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
