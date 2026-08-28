import React, { useState } from 'react';
import { ClipboardCheck, Plus, CheckCircle2, AlertCircle, ShieldAlert, Sparkles, UserCheck, Clock, FileCheck } from 'lucide-react';
import { api } from '../services/api';

export default function DemandPortal({ demands = [], onDemandAdded, corridor }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDept, setSelectedDept] = useState('ENGINEERING');
  const [sectionId, setSectionId] = useState('SEC_NYN_MZP');
  const [lineId, setLineId] = useState('DOWN_MAIN');
  const [description, setDescription] = useState('');
  const [durationMin, setDurationMin] = useState(150);
  const [urgency, setUrgency] = useState('STATUTORY_RDSO');
  const [equipmentType, setEquipmentType] = useState('CSM (Continuous Tamping Machine)');
  const [isPowerBlock, setIsPowerBlock] = useState(false);
  const [submitter, setSubmitter] = useState('SSE/P-Way/PRYJ');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [signingDemandId, setSigningDemandId] = useState(null);

  const sections = corridor?.sections || [];

  const handleSignOff = async (demandId, signer, role) => {
    setSigningDemandId(demandId);
    try {
      await api.signOffBlock(demandId, signer, role);
      if (onDemandAdded) onDemandAdded();
    } catch (err) {
      console.error('Sign-off error:', err);
    } finally {
      setSigningDemandId(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const payload = {
        id: `DEM_${selectedDept.slice(0, 3)}_${Math.floor(100 + Math.random() * 900)}`,
        department: selectedDept,
        section_id: sectionId,
        line_id: lineId,
        work_description: description || `${selectedDept} Maintenance at ${sectionId}`,
        equipment_needed: [{ equipment_type: equipmentType, quantity: 1, speed_kmh_to_site: 40 }],
        requested_duration_min: parseInt(durationMin),
        min_continuous_duration_min: Math.max(60, parseInt(durationMin) - 30),
        urgency: urgency,
        is_power_block_required: isPowerBlock,
        is_traffic_block_required: true,
        safety_code_reference: selectedDept === 'ENGINEERING' ? 'IRPWM Para 1102' : 'ACTM Vol II / SEM Rule 19',
        submitted_by: submitter
      };

      await api.submitBlockDemand(payload);
      setShowAddModal(false);
      setDescription('');
      if (onDemandAdded) onDemandAdded();
    } catch (err) {
      setErrorMsg(err.response?.data?.detail?.message || 'Error submitting block demand');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl mb-6">
      
      {/* Header & Submit Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-orange-400" />
            Multi-Department Block Demands & Joint Working Register
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Inter-departmental coordination portal (Civil Engg, S&T, Electrical OHE, Traffic) with RDSO rule verification
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-orange-500/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Submit Block Request</span>
        </button>
      </div>

      {/* Demands Table */}
      <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900/90 text-slate-400 text-[10px] uppercase font-extrabold border-b border-slate-800 sticky top-0">
            <tr>
              <th className="p-3">Demand ID & Dept</th>
              <th className="p-3">Section & Line</th>
              <th className="p-3">Work Scope & Machinery</th>
              <th className="p-3">Duration</th>
              <th className="p-3">Urgency & Safety Standard</th>
              <th className="p-3">Joint Department Sign-off</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {demands.map(d => (
              <tr key={d.id} className="hover:bg-slate-900/40 transition-colors">
                
                {/* ID & Dept */}
                <td className="p-3">
                  <span className="font-mono font-bold text-white text-xs block">{d.id}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-1 ${
                    d.department === 'ENGINEERING'
                      ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                      : d.department === 'ELECTRICAL_OHE'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : d.department === 'SIGNAL_TELECOM'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}>
                    {d.department.replace('_', ' ')}
                  </span>
                </td>

                {/* Section & Line */}
                <td className="p-3">
                  <span className="font-bold text-slate-200 block">{d.section_id}</span>
                  <span className="text-[11px] font-mono text-slate-400">{d.line_id}</span>
                  {d.is_power_block_required && (
                    <span className="block text-[10px] text-amber-400 font-semibold mt-0.5">
                      ⚡ 25kV Power Cut
                    </span>
                  )}
                </td>

                {/* Description */}
                <td className="p-3 max-w-xs">
                  <span className="font-semibold text-slate-200 block leading-tight">{d.work_description}</span>
                  <div className="text-[10px] text-slate-400 font-mono mt-1">
                    Equip: {d.equipment_needed?.map(e => e.equipment_type).join(', ') || 'Manual Gang'}
                  </div>
                </td>

                {/* Duration */}
                <td className="p-3">
                  <span className="font-mono font-extrabold text-white text-sm block">
                    {d.requested_duration_min}m
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Min {d.min_continuous_duration_min}m
                  </span>
                </td>

                {/* Urgency & Rule */}
                <td className="p-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    d.urgency === 'STATUTORY_RDSO'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                      : d.urgency === 'EMERGENCY'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse'
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {d.urgency}
                  </span>
                  <span className="block text-[10px] text-slate-400 font-mono mt-1">
                    {d.safety_code_reference}
                  </span>
                </td>

                {/* Sign-off Stamps */}
                <td className="p-3">
                  <button
                    onClick={() => handleSignOff(d.id, 'SSE/P-Way/PRYJ', 'Senior Section Engineer')}
                    disabled={signingDemandId === d.id}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 hover:bg-emerald-950/60 text-slate-300 hover:text-emerald-300 border border-slate-700 hover:border-emerald-600 rounded-lg text-[11px] font-semibold transition-all active:scale-95"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{signingDemandId === d.id ? 'Signing...' : 'Concur Joint Window'}</span>
                  </button>
                  <span className="text-[9px] text-slate-500 block mt-1">By: {d.submitted_by}</span>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal: Submit Block Request */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-scaleUp">
            
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-orange-400" />
                Submit New Maintenance Block Demand
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕ Close
              </button>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/40 rounded-xl text-xs text-red-300">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Department:</label>
                  <select
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 font-semibold text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="ENGINEERING">Civil Engineering (P-Way)</option>
                    <option value="ELECTRICAL_OHE">Electrical OHE (TRD)</option>
                    <option value="SIGNAL_TELECOM">Signal & Telecom (S&T)</option>
                    <option value="TRAFFIC_OPERATING">Traffic / Platform Yard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Urgency:</label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 font-semibold text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="STATUTORY_RDSO">Statutory RDSO Norm</option>
                    <option value="ROUTINE">Routine Maintenance</option>
                    <option value="EMERGENCY">Emergency Restoration</option>
                    <option value="DEFERRABLE">Deferrable Enhancement</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Section:</label>
                  <select
                    value={sectionId}
                    onChange={(e) => setSectionId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 font-semibold text-white focus:outline-none focus:border-orange-500"
                  >
                    {sections.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Track Line:</label>
                  <select
                    value={lineId}
                    onChange={(e) => setLineId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 font-semibold text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="UP_MAIN">UP Main (To Delhi)</option>
                    <option value="DOWN_MAIN">DOWN Main (To HWH)</option>
                    <option value="THIRD_LINE">3rd Reversible Track</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Work Description:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Continuous Track Tamping (CSM) Km 45.2 to 50.1"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 font-medium text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Duration (Minutes):</label>
                  <input
                    type="number"
                    min="30"
                    max="480"
                    step="15"
                    value={durationMin}
                    onChange={(e) => setDurationMin(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 font-mono text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Key Machinery:</label>
                  <input
                    type="text"
                    value={equipmentType}
                    onChange={(e) => setEquipmentType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 font-medium text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-slate-950 rounded-xl border border-slate-800">
                <input
                  type="checkbox"
                  id="modalPowerBlock"
                  checked={isPowerBlock}
                  onChange={(e) => setIsPowerBlock(e.target.checked)}
                  className="rounded text-orange-500"
                />
                <label htmlFor="modalPowerBlock" className="text-slate-300 font-semibold cursor-pointer">
                  Requires 25kV OHE Power Isolation (Power Block)
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold rounded-xl shadow-lg active:scale-95"
                >
                  {isSubmitting ? 'Validating RDSO Norms...' : 'Submit to Optimizer'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
