import React, { useState, useEffect } from 'react';
import { Truck, Navigation, Fuel, Clock, CheckCircle2, RefreshCw, Wrench, ArrowRight } from 'lucide-react';
import { api } from '../services/api';

export default function MachineLogisticsPanel() {
  const [fleet, setFleet] = useState([]);
  const [selectedMachine, setSelectedMachine] = useState('MCH_CSM_09_104');
  const [transitData, setTransitData] = useState(null);
  const [destinationKm, setDestinationKm] = useState(77.3);
  const [blockStartMin, setBlockStartMin] = useState(180);

  useEffect(() => {
    loadFleet();
  }, []);

  useEffect(() => {
    if (selectedMachine) {
      calculateTransit(selectedMachine, destinationKm, blockStartMin);
    }
  }, [selectedMachine, destinationKm, blockStartMin]);

  const loadFleet = async () => {
    try {
      const data = await api.getMachineFleetStatus();
      setFleet(data);
    } catch (err) {
      console.error('Error loading machine fleet:', err);
    }
  };

  const calculateTransit = async (mId, km, startMin) => {
    try {
      const data = await api.calculateMachineTransit(mId, km, startMin);
      setTransitData(data);
    } catch (err) {
      console.error('Error calculating machine transit:', err);
    }
  };

  const activeMachine = fleet.find(m => m.machine_id === selectedMachine) || fleet[0];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl mb-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <Truck className="w-5 h-5 text-amber-400" />
              Heavy Track Machine Fleet Dispatcher & Depot Transit Logistics
            </h2>
            <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
              PLASSER & THEURER / HARSCO FLEET
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Depot stabling tracking, speed-restricted transit path calculations from base sidings to possession sites, and return fuel logistics.
          </p>
        </div>

        <button
          onClick={loadFleet}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Fleet Status</span>
        </button>
      </div>

      {/* Fleet Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
        {fleet.map(m => {
          const isSelected = selectedMachine === m.machine_id;
          return (
            <div
              key={m.machine_id}
              onClick={() => setSelectedMachine(m.machine_id)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-slate-950 border-amber-500 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono font-bold text-xs text-amber-400">{m.type}</span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/40 px-1.5 py-0.2 rounded border border-emerald-500/30">
                  {m.current_fuel_pct}% Fuel
                </span>
              </div>

              <div className="font-bold text-xs text-white truncate">{m.name}</div>
              <div className="text-[10px] text-slate-400 mt-1 truncate">{m.base_depot}</div>

              <div className="mt-2 pt-2 border-t border-slate-800/80 flex justify-between text-[10px] font-mono text-slate-500">
                <span>Cruising Speed:</span>
                <span className="text-slate-300 font-bold">{m.transit_speed_kmh} km/h</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Transit Route Calculator Results */}
      {transitData && activeMachine && (
        <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">Dispatched Heavy Machine Unit</span>
              <h3 className="text-sm font-extrabold text-white">{activeMachine.name}</h3>
              <p className="text-xs text-slate-400">Stationed at: <strong className="text-slate-200">{activeMachine.base_depot}</strong></p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block font-mono">Transit Distance</span>
                <span className="text-sm font-mono font-bold text-amber-400">{transitData.transit_distance_km} km</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block font-mono">Transit Time</span>
                <span className="text-sm font-mono font-bold text-emerald-400">{transitData.transit_time_minutes} min</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-slate-500 text-[10px] block font-sans">Mandated Depot Departure</span>
              <span className="text-xl font-bold text-white mt-0.5 block">Minute {transitData.mandated_depot_departure_min}</span>
              <span className="text-[10px] text-amber-400 block mt-1">Includes 15m Yard Shunting Buffer</span>
            </div>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-slate-500 text-[10px] block font-sans">Estimated Diesel Fuel Burn</span>
              <span className="text-xl font-bold text-emerald-400 mt-0.5 block">{transitData.estimated_fuel_burn_litres} Litres</span>
              <span className="text-[10px] text-slate-500 block mt-1">Direct from Onboard Tank</span>
            </div>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-slate-500 text-[10px] block font-sans">Escort Pilot Clearance</span>
              <span className="text-xs font-bold text-slate-200 mt-1 block">{transitData.escort_loco_pilot}</span>
              <span className="text-[9px] text-emerald-400 block mt-1">{transitData.safety_clearance}</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
