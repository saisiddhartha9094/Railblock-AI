import React, { useState, useEffect } from 'react';
import { FileText, Printer, ShieldCheck, CheckCircle2, TrendingUp, Download, RefreshCw } from 'lucide-react';
import { api } from '../services/api';

export default function ComplianceReportViewer() {
  const [cbuiReport, setCbuiReport] = useState(null);
  const [plaReport, setPlaReport] = useState(null);
  const [activeReportTab, setActiveReportTab] = useState('cbui');

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const [cbui, pla] = await Promise.all([
        api.getCbuiReport(),
        api.getPlaReport()
      ]);
      setCbuiReport(cbui);
      setPlaReport(pla);
    } catch (err) {
      console.error('Error loading reports:', err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl mb-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-orange-400" />
              Automated Railway Board Compliance Reports (CBUI & PLA)
            </h2>
            <span className="bg-orange-500/10 text-orange-400 border border-orange-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
              BOARD AUDIT READY
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated generation of Corridor Block Utilization Index (CBUI) and Punctuality Loss Analysis (PLA) official certificates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveReportTab('cbui')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeReportTab === 'cbui'
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              CBUI Audit Report
            </button>
            <button
              onClick={() => setActiveReportTab('pla')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeReportTab === 'pla'
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              PLA Punctuality Report
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print PDF</span>
          </button>
        </div>
      </div>

      {/* CBUI Report View */}
      {activeReportTab === 'cbui' && cbuiReport && (
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-6">
          <div className="flex justify-between items-start pb-4 border-b border-slate-800">
            <div>
              <span className="text-[10px] uppercase font-bold text-orange-400 font-mono tracking-wider">
                {cbuiReport.circular_reference}
              </span>
              <h3 className="text-base font-extrabold text-white mt-1">{cbuiReport.report_title}</h3>
              <p className="text-xs text-slate-400">{cbuiReport.division} • {cbuiReport.corridor}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 block font-mono">Official CBUI Rating</span>
              <span className="text-xs font-black font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                {cbuiReport.cbui_rating}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Composite CBUI Score</span>
              <span className="text-3xl font-extrabold text-emerald-400">{cbuiReport.cbui_score}</span>
              <span className="text-[10px] text-slate-500 block mt-1">Scale 0 - 100</span>
            </div>

            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Shadow Clubbing Ratio</span>
              <span className="text-3xl font-extrabold text-orange-400">{cbuiReport.metrics.shadow_clubbing_ratio_pct}</span>
              <span className="text-[10px] text-slate-500 block mt-1">Unified Multi-Dept Windows</span>
            </div>

            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Track Possession Time</span>
              <span className="text-3xl font-extrabold text-blue-400">{cbuiReport.metrics.total_possession_hours}h</span>
              <span className="text-[10px] text-slate-500 block mt-1">Total Corridor Execution</span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-300">
            <span className="font-bold text-slate-200 block mb-1">Board Submission Status:</span>
            Certified compliant with Railway Board Safety & Asset Directorate Standards. High multi-department shadow ratio verified.
          </div>
        </div>
      )}

      {/* PLA Report View */}
      {activeReportTab === 'pla' && plaReport && (
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-6">
          <div className="flex justify-between items-start pb-4 border-b border-slate-800">
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-400 font-mono tracking-wider">
                {plaReport.circular_reference}
              </span>
              <h3 className="text-base font-extrabold text-white mt-1">{plaReport.report_title}</h3>
              <p className="text-xs text-slate-400">{plaReport.division} • Audit Date: {plaReport.date}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 block font-mono">Punctuality Score</span>
              <span className="text-xl font-extrabold font-mono text-emerald-400">
                {plaReport.corridor_punctuality_percentage}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Total Delays Avoided</span>
              <span className="text-3xl font-extrabold text-emerald-400">
                {plaReport.delay_savings_summary.total_delay_minutes_avoided}m
              </span>
            </div>

            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Vande Bharat Express</span>
              <span className="text-xl font-bold text-white mt-1 block">
                {plaReport.delay_savings_summary.vande_bharat_delay_loss}
              </span>
            </div>

            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Freight Savings</span>
              <span className="text-3xl font-extrabold text-blue-400">
                {plaReport.delay_savings_summary.freight_holding_savings_min}m
              </span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-300">
            <span className="font-bold text-slate-200 block mb-1">Operating Controller Verdict:</span>
            {plaReport.traffic_controller_remarks}
          </div>
        </div>
      )}

    </div>
  );
}
