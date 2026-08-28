import React from 'react';
import { LayoutGrid, Map, FlaskConical, ClipboardCheck, BrainCircuit, FileText } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, pendingDemandsCount = 0 }) {
  const tabs = [
    { id: 'matrix', label: 'Interactive Block Matrix & Gantt', icon: LayoutGrid },
    { id: 'corridor', label: 'Corridor GIS & Track Status', icon: Map },
    { id: 'whatif', label: 'What-If Simulation Sandbox', icon: FlaskConical },
    { id: 'demands', label: 'Multi-Dept Demand & Joint Sign-Off', icon: ClipboardCheck, badge: pendingDemandsCount },
    { id: 'explain', label: 'AI Explainability & Shift Handover', icon: BrainCircuit }
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
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-orange-500/15 text-orange-400 border border-orange-500/40 shadow-sm shadow-orange-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-orange-400' : 'text-slate-400'}`} />
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
