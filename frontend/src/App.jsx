import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Navbar from './components/Navbar';
import AAIStatsCards from './components/AAIStatsCards';
import BlockGanttMatrix from './components/BlockGanttMatrix';
import CorridorVisualizer from './components/CorridorVisualizer';
import WhatIfSimulator from './components/WhatIfSimulator';
import DemandPortal from './components/DemandPortal';
import EmergencyModal from './components/EmergencyModal';
import DecisionExplainability from './components/DecisionExplainability';
import { api } from './services/api';
import { Sparkles, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('matrix');
  const [corridor, setCorridor] = useState(null);
  const [timetable, setTimetable] = useState([]);
  const [demands, setDemands] = useState([]);
  const [scheduledBlocks, setScheduledBlocks] = useState([]);
  const [aaiData, setAaiData] = useState(null);
  const [liveStatus, setLiveStatus] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [corrData, timeData, demData, aaiRes, liveRes] = await Promise.all([
        api.getCorridor(),
        api.getTimetable(),
        api.getBlockDemands(),
        api.getAssetAvailabilityIndex(),
        api.getLiveStatus()
      ]);

      setCorridor(corrData);
      setTimetable(timeData);
      setDemands(demData);
      setAaiData(aaiRes);
      setLiveStatus(liveRes);

      const schedRes = await api.getScheduledBlocks();
      setScheduledBlocks(schedRes);
    } catch (err) {
      console.error('Failed to load initial data:', err);
    }
  };

  const showToast = (msg, type = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 4500);
  };

  const handleRunOptimization = async () => {
    setIsOptimizing(true);
    try {
      const result = await api.runOptimization();
      setScheduledBlocks(result.scheduled_blocks);
      const updatedAai = await api.getAssetAvailabilityIndex();
      setAaiData(updatedAai);
      showToast(
        `CP-SAT Optimizer Complete: ${result.clubbed_blocks_count} clubbed windows created. AAI improved to ${result.asset_availability_index_after}% (+${result.delay_minutes_saved} min saved).`,
        'success'
      );
    } catch (err) {
      console.error('Optimization error:', err);
      showToast('Optimization failed to converge.', 'error');
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleEmergencyExecuted = async (res) => {
    await loadAllData();
    showToast(`Emergency Block Injected: Real-time dynamic rescheduling executed.`, 'warning');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-orange-500 selection:text-white">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 z-50 p-4 rounded-2xl shadow-2xl border flex items-center gap-3 animate-slideUp text-xs font-semibold max-w-md ${
          toastMessage.type === 'success'
            ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/60 shadow-emerald-500/20'
            : toastMessage.type === 'warning'
            ? 'bg-amber-950/90 text-amber-200 border-amber-500/60 shadow-amber-500/20'
            : 'bg-red-950/90 text-red-200 border-red-500/60 shadow-red-500/20'
        }`}>
          <Sparkles className="w-5 h-5 flex-shrink-0 text-amber-300" />
          <span>{toastMessage.msg}</span>
        </div>
      )}

      {/* Main Header */}
      <Header
        onTriggerEmergency={() => setIsEmergencyModalOpen(true)}
        onRunOptimization={handleRunOptimization}
        isOptimizing={isOptimizing}
        aaiScore={aaiData?.overall_aai_score}
      />

      {/* Navigation Tabs */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingDemandsCount={demands.length}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6">
        
        {/* KPI Dashboard Cards */}
        <AAIStatsCards aaiData={aaiData} onRefresh={loadAllData} />

        {/* Tab 1: Interactive Block Matrix & Gantt View */}
        {activeTab === 'matrix' && (
          <BlockGanttMatrix
            corridor={corridor}
            timetable={timetable}
            scheduledBlocks={scheduledBlocks}
            onBlockSelect={(block) => setSelectedBlock(block)}
            selectedBlock={selectedBlock}
          />
        )}

        {/* Tab 2: Corridor GIS & Network Visualizer */}
        {activeTab === 'corridor' && (
          <CorridorVisualizer
            corridor={corridor}
            liveStatus={liveStatus}
            scheduledBlocks={scheduledBlocks}
          />
        )}

        {/* Tab 3: What-If Simulation Sandbox */}
        {activeTab === 'whatif' && (
          <WhatIfSimulator corridor={corridor} />
        )}

        {/* Tab 4: Multi-Dept Demand Register & Joint Sign-off */}
        {activeTab === 'demands' && (
          <DemandPortal
            demands={demands}
            corridor={corridor}
            onDemandAdded={loadAllData}
          />
        )}

        {/* Tab 5: AI Explainability & Audit Log */}
        {activeTab === 'explain' && (
          <DecisionExplainability scheduledBlocks={scheduledBlocks} />
        )}

      </main>

      {/* Emergency Modal */}
      <EmergencyModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        onEmergencyExecuted={handleEmergencyExecuted}
        corridor={corridor}
      />

      {/* Footer */}
      <footer className="bg-slate-900/60 border-t border-slate-800/80 px-6 py-4 text-center text-xs text-slate-500">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
          <span>
            Smart India Hackathon (SIH26027) • <strong>AI-Powered Automatic Block Planning to Maximize Asset Availability</strong>
          </span>
          <span className="font-mono text-slate-400">
            Ministry of Railways • Google OR-Tools CP-SAT + SimPy Engine
          </span>
        </div>
      </footer>

    </div>
  );
}
