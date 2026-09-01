import React from 'react';
import { LayoutGrid, Map, FlaskConical, ClipboardCheck, BrainCircuit, Activity, TrainTrack, Radio, PackageCheck, UserCheck, FileText, Globe2, Gauge, Truck, TrendingUp, Split } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, pendingDemandsCount = 0 }) {
  const tabs = [
    { id: 'matrix', label: 'Block Matrix & Gantt', icon: LayoutGrid },
    { id: 'corridor', label: 'Corridor GIS & Track', icon: Map },
    { id: 'stations', label: 'Pan-India Stations', icon: Globe2 },
    { id: 'capacity', label: 'Scott Line Capacity', icon: Gauge },
    { id: 'machines', label: 'Machine Dispatcher', icon: Truck },
    { id: 'tsr', label: 'TSR 4-Day Recovery', icon: TrendingUp },
    { id: 'yard', label: 'Yard Interlocking', icon: Split },
    { id: 'whatif', label: 'What-If Sandbox', icon: FlaskConical },
    { id: 'demands', label: 'Demand Register', icon: ClipboardCheck, badge: pendingDemandsCount },
    { id: 'pointmachine', label: 'Point Diagnostics', icon: Activity },
    { id: 'trc', label: 'TRC & USFD Health', icon: TrainTrack },
    { id: 'kavach', label: 'Kavach ATP HUD', icon: Radio },
    { id: 'fois', label: 'FOIS Freight SLA', icon: PackageCheck },
    { id: 'cms', label: 'CMS Crew Duty', icon: UserCheck },
    { id: 'reports', label: 'CBUI / PLA Reports', icon: FileText },
    { id: 'explain', label: 'AI Explain & Audit', icon: BrainCircuit }
  ];

  return (
    <div className="bg-slate-900/90 backdrop-blur border-b border-slate-800/80 px-6">
      <nav className="flex space-x-1 overflow-x-auto py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-orange-500/15 text-orange-400 border border-orange-500/40 shadow-sm shadow-orange-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-orange-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.badge > 0 && (
                <span className="bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
