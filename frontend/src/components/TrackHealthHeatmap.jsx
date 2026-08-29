import React, { useState, useEffect } from 'react';
import { Layers, ShieldCheck, AlertTriangle, Sparkles, RefreshCw, TrainTrack, Wrench, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

export default function TrackHealthHeatmap({ onDemandGenerated }) {
  const [trcData, setTrcData] = useState(null);
  const [selectedSegmentId, setSelectedSegmentId] = useState('TRC_SEG_01');
  const [isGenerating, setIsGenerating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    loadTrcData();
  }, []);

  const loadTrcData = async () => {
    try {
      const data = await api.getTrcUsfdOverview();
      setTrcData(data);
    } catch (err) {
      console.error('Error loading TRC overview:', err);
    }
  };

  const handleAutoGenerateBlock = async (segId) => {
    setIsGenerating(true);
    setSuccessMsg('');
    try {
      const res = await api.autoGenerateCivilBlock(segId);
      setSuccessMsg(`Auto-Generated Civil Block: ${res.demand.id} (${res.demand.requested_duration_min} min on ${res.demand.line_id})`);
      if (onDemandGenerated) onDemandGenerated();
    } catch (err) {
      console.error('Error auto-generating civil block:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const selectedSegment = trcData?.segments?.find(s => s.segment_id === selectedSegmentId) || trcData?.segments?.[0];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl mb-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <TrainTrack className="w-5 h-5 text-orange-400" />
              Track Recording Car (TRC) & Ultrasonic Flaw Detection (USFD) Ingestion
            </h2>
            <span className="bg-orange-500/10 text-orange-400 border border-orange-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
              RDSO TM-185
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated ingestion of Track Quality Index (TQI), Gauge/Twist variations, and Ultrasonic rail flaw signals with auto-demand generation.
          </p>
        </div>

        <button
          onClick={loadTrcData}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh TRC Feeds</span>
        </button>
      </div>

      {successMsg && (
        <div className="mb-4 p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Corridor TQI Top KPI Strip */}
      {trcData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Corridor Avg TQI</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold font-mono text-white">{trcData.overall_corridor_tqi_avg}</span>
              <span className="text-[10px] text-emerald-400 font-semibold font-mono">Norm: &le; 36.0</span>
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Critical Action Segments</span>
            <div className="text-2xl font-extrabold font-mono text-red-400">
              {trcData.critical_segments} Segment
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Attention Required</span>
            <div className="text-2xl font-extrabold font-mono text-amber-400">
              {trcData.attention_segments} Segment
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Healthy Track Integrity</span>
            <div className="text-2xl font-extrabold font-mono text-emerald-400">
              {trcData.healthy_segments} Segment
            </div>
          </div>
        </div>
      )}

      {/* Segments Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {trcData?.segments?.map(seg => {
          const isSelected = selectedSegmentId === seg.segment_id;
          return (
            <div
              key={seg.segment_id}
              onClick={() => setSelectedSegmentId(seg.segment_id)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-slate-950 border-orange-500 shadow-lg shadow-orange-500/10 ring-1 ring-orange-500'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono font-bold text-xs text-white">{seg.section_id}</span>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded font-mono ${
                  seg.status === 'HEALTHY'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : seg.status === 'ATTENTION_REQUIRED'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse'
                }`}>
                  {seg.status}
                </span>
              </div>

              <div className="text-xs font-semibold text-slate-200">
                Km {seg.km_start} to {seg.km_end} ({seg.line_id})
              </div>

              <div className="grid grid-cols-3 gap-2 my-3 p-2 bg-slate-900 rounded-lg text-center text-xs font-mono">
                <div>
                  <span className="text-[9px] text-slate-500 block">TQI</span>
                  <span className={`font-bold ${seg.tqi_score > 36 ? 'text-amber-400' : 'text-emerald-400'}`}>{seg.tqi_score}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 block">Gauge</span>
                  <span className="font-bold text-slate-300">+{seg.gauge_variation_mm}mm</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 block">USFD Flaws</span>
                  <span className={`font-bold ${seg.usfd_flaws_count > 0 ? 'text-red-400' : 'text-emerald-400'}`}>{seg.usfd_flaws_count}</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-300 leading-snug line-clamp-2">
                {seg.flaw_details}
              </p>

              {seg.status !== 'HEALTHY' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAutoGenerateBlock(seg.segment_id);
                  }}
                  disabled={isGenerating}
                  className="w-full mt-3 py-2 bg-orange-600/90 hover:bg-orange-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-1.5"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Auto-Generate Civil Block</span>
                </button>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
