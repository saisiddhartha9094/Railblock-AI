import React, { useState, useEffect } from 'react';
import { Radio, ShieldCheck, Gauge, Train, Navigation, Activity, RefreshCw } from 'lucide-react';
import { api } from '../services/api';

export default function KavachTelemetryPanel() {
  const [kavachUnits, setKavachUnits] = useState([]);
  const [selectedTrain, setSelectedTrain] = useState('22436');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadKavachData();
  }, []);

  const loadKavachData = async () => {
    setIsLoading(true);
    try {
      const data = await api.getKavachTelemetry();
      setKavachUnits(data);
    } catch (err) {
      console.error('Error loading Kavach telemetry:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const activeUnit = kavachUnits.find(u => u.train_number === selectedTrain) || kavachUnits[0];

  const getAspectColor = (aspect) => {
    switch (aspect) {
      case 'GREEN': return 'bg-emerald-500 text-black shadow-emerald-500/50';
      case 'DOUBLE_YELLOW': return 'bg-amber-400 text-black shadow-amber-400/50';
      case 'YELLOW': return 'bg-amber-500 text-black shadow-amber-500/50';
      case 'RED': return 'bg-red-500 text-white shadow-red-500/50 animate-pulse';
      default: return 'bg-slate-700 text-white';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl mb-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
              Kavach Indigenous Automatic Train Protection (ATP) & Cab Signalling Feed
            </h2>
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
              SIL-4 CERTIFIED
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time cab signal aspect, continuous braking curves, movement authority, and RFID tag tracking across Prayagraj Division.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {kavachUnits.map(u => (
            <button
              key={u.train_number}
              onClick={() => setSelectedTrain(u.train_number)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                selectedTrain === u.train_number
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              Train {u.train_number}
            </button>
          ))}
        </div>
      </div>

      {activeUnit && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Driver Cab Signalling Display Panel (HUD) (5 Cols) */}
          <div className="lg:col-span-5 bg-black rounded-2xl p-6 border-2 border-slate-800 relative overflow-hidden shadow-inner flex flex-col justify-between">
            <div className="flex justify-between items-center text-xs font-mono text-slate-400 pb-3 border-b border-slate-800/80">
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> KAVACH CAB HUD
              </span>
              <span>{activeUnit.loco_kavach_id}</span>
            </div>

            {/* Cab Signal Aspect Light HUD */}
            <div className="flex items-center justify-center gap-6 my-6">
              <div className="flex flex-col items-center gap-3 p-4 bg-slate-900/90 rounded-2xl border border-slate-700">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center font-mono font-extrabold text-xs shadow-lg transition-all ${getAspectColor(activeUnit.cab_signal_aspect)}`}>
                  {activeUnit.cab_signal_aspect.replace('_', ' ')}
                </div>
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Cab Aspect</span>
              </div>

              {/* Speed Gauge Dial */}
              <div className="text-center p-4 bg-slate-900/90 rounded-2xl border border-slate-700 min-w-[140px]">
                <div className="text-3xl font-black font-mono text-white">
                  {activeUnit.speed_kmh} <span className="text-xs text-slate-400 font-normal">km/h</span>
                </div>
                <div className="text-[10px] font-mono text-slate-400 mt-1">
                  Permissible: <span className="text-emerald-400 font-bold">{activeUnit.permissible_speed_kmh} km/h</span>
                </div>
                <div className="text-[10px] font-mono text-slate-400">
                  Target Speed: <span className="text-amber-400 font-bold">{activeUnit.target_speed_kmh} km/h</span>
                </div>
              </div>
            </div>

            {/* Braking Status Strip */}
            <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 text-xs font-mono flex justify-between items-center">
              <span className="text-slate-400">Braking Regime:</span>
              <span className="text-emerald-300 font-bold">{activeUnit.brake_status}</span>
            </div>
          </div>

          {/* Right: Telemetry Parameters & Track Position (7 Cols) */}
          <div className="lg:col-span-7 bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs font-bold text-slate-400">Train Mission Profile</span>
                <h3 className="text-sm font-extrabold text-white">{activeUnit.train_name}</h3>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                {activeUnit.kavach_system_health}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[11px] block">Current Location:</span>
                <span className="font-mono font-bold text-white text-sm">Km {activeUnit.current_km}</span>
                <span className="text-[10px] text-slate-500 block font-mono">{activeUnit.current_section} ({activeUnit.line_occupied})</span>
              </div>

              <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[11px] block">Movement Authority (MA):</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">{activeUnit.movement_authority_m} Meters</span>
                <span className="text-[10px] text-slate-500 block font-mono">Ahead of next restrictive signal</span>
              </div>

              <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[11px] block">Target Stop Distance:</span>
                <span className="font-mono font-bold text-amber-400 text-sm">{activeUnit.target_distance_m} Meters</span>
                <span className="text-[10px] text-slate-500 block font-mono">Braking curve calculated</span>
              </div>

              <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[11px] block">RFID Tag Ingested:</span>
                <span className="font-mono font-bold text-blue-400 text-sm">{activeUnit.rfid_tag_last_passed}</span>
                <span className="text-[10px] text-slate-500 block font-mono">Trackside RFID transponder</span>
              </div>
            </div>

            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80 text-xs text-slate-300">
              <span className="font-bold text-slate-200 block mb-0.5">Automated Protection Logic:</span>
              Kavach continuously enforces automatic brake application (EB) if train speed exceeds permissible threshold during approach to maintenance block caution orders.
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
