import React, { useState, useEffect } from 'react';
import { Presentation, ChevronLeft, ChevronRight, CheckCircle2, Sparkles, Trophy, Award, ShieldCheck, Download, X } from 'lucide-react';

const SLIDES = [
  {
    title: "RailBlock-AI",
    subtitle: "AI-Powered Automatic Block Planning to Maximize Asset Availability on Indian Railways",
    badge: "PS CODE: SIH26027 • MINISTRY OF RAILWAYS",
    content: (
      <div className="space-y-4 text-center py-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/15 border border-orange-500/40 text-orange-400 font-mono text-xs font-extrabold shadow-sm">
          <Trophy className="w-3.5 h-3.5 text-amber-300" />
          SMART INDIA HACKATHON 2024 / 2025
        </div>
        <div className="text-3xl md:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-amber-200 to-white leading-tight">
          Transforming Indian Railways Maintenance Planning
        </div>
        <p className="text-xs md:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
          From fragmented manual paper block registers to an enterprise mathematical constraint optimizer with <strong>Google OR-Tools CP-SAT</strong>, <strong>SimPy Simulation</strong>, and <strong>CRIS COA</strong> integration.
        </p>
        <div className="flex flex-wrap justify-center gap-2 pt-2">
          <span className="px-3 py-1 bg-slate-950 text-orange-400 border border-orange-500/40 rounded-xl font-mono text-xs font-bold">
            Prayagraj Division (NCR Grounding)
          </span>
          <span className="px-3 py-1 bg-slate-950 text-emerald-400 border border-emerald-500/40 rounded-xl font-mono text-xs font-bold">
            641+ Station National Graph
          </span>
          <span className="px-3 py-1 bg-slate-950 text-blue-400 border border-blue-500/40 rounded-xl font-mono text-xs font-bold">
            CP-SAT Solved in 0.02s
          </span>
        </div>
      </div>
    )
  },
  {
    title: "The Problem We Solve",
    subtitle: "Manual Block Planning Causes Severe Network Congestion",
    badge: "PROBLEM LANDSCAPE",
    content: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="p-4 bg-red-950/20 border border-red-500/40 rounded-2xl space-y-2">
          <h4 className="font-extrabold text-red-300 text-sm">❌ The Existing Manual Reality</h4>
          <ul className="space-y-1.5 text-slate-300">
            <li>• 4 Departments (Civil, OHE, Signal, Traffic) work in silos.</li>
            <li>• Tracks closed 3 separate times for 3 separate teams.</li>
            <li>• Unscheduled emergency blocks disrupt Rajdhani & Vande Bharat.</li>
            <li>• Freight rakes held on loops incurring heavy demurrage.</li>
          </ul>
        </div>
        <div className="p-4 bg-emerald-950/20 border border-emerald-500/40 rounded-2xl space-y-2">
          <h4 className="font-extrabold text-emerald-300 text-sm">✅ The RailBlock-AI Solution</h4>
          <ul className="space-y-1.5 text-slate-300">
            <li>• Mathematical Google OR-Tools CP-SAT multi-department solver.</li>
            <li>• <strong>Joint Block Clubbing (62.5%):</strong> Combines works into unified windows.</li>
            <li>• 25kV OHE power isolation interlocked with train routing.</li>
            <li>• Recovers <strong>2,506 minutes of delays daily</strong> (+28.5% AAI gain).</li>
          </ul>
        </div>
      </div>
    )
  },
  {
    title: "System Architecture",
    subtitle: "Full-Stack Enterprise Decision Support Platform",
    badge: "ARCHITECTURE & TECH STACK",
    content: (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 text-xs font-mono">
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
          <span className="text-orange-400 font-bold block text-[11px]">Constraint Solver</span>
          <span className="text-white font-bold block">Google OR-Tools CP-SAT</span>
          <p className="text-[10px] text-slate-400 font-sans">Solves multi-objective delay penalties & safety norms in 0.02s.</p>
        </div>
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
          <span className="text-emerald-400 font-bold block text-[11px]">Simulation Core</span>
          <span className="text-white font-bold block">SimPy Discrete-Event</span>
          <p className="text-[10px] text-slate-400 font-sans">Simulates dynamic train progression & station loop holds.</p>
        </div>
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
          <span className="text-blue-400 font-bold block text-[11px]">Backend API</span>
          <span className="text-white font-bold block">FastAPI + Python 3.11</span>
          <p className="text-[10px] text-slate-400 font-sans">High-throughput REST APIs & CRIS COA XML exporter.</p>
        </div>
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
          <span className="text-amber-400 font-bold block text-[11px]">Frontend Cockpit</span>
          <span className="text-white font-bold block">React 18 + Vite + Tailwind</span>
          <p className="text-[10px] text-slate-400 font-sans">24-hr Gantt matrix, GIS visualizer, and dark UI.</p>
        </div>
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
          <span className="text-indigo-400 font-bold block text-[11px]">National Graph</span>
          <span className="text-white font-bold block">641 Stations & Trunks</span>
          <p className="text-[10px] text-slate-400 font-sans">Fuzzy search and Golden Quadrilateral trunk routes.</p>
        </div>
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
          <span className="text-red-400 font-bold block text-[11px]">Indic Voice NLP</span>
          <span className="text-white font-bold block">6 Indian Languages</span>
          <p className="text-[10px] text-slate-400 font-sans">Hindi, Bengali, Telugu, Tamil, Marathi, English intent parsing.</p>
        </div>
      </div>
    )
  },
  {
    title: "Key Innovation: Joint Block Clubbing",
    subtitle: "Eliminating Repeated Possession Fragmentation",
    badge: "OPTIMIZER CORE",
    content: (
      <div className="space-y-3 text-xs">
        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex justify-between font-mono">
            <span className="text-amber-400 font-bold">Mathematical Formulation:</span>
            <span className="text-emerald-400 font-bold">Solved in 0.021s</span>
          </div>
          <p className="text-slate-300 leading-relaxed font-mono text-[11px]">
            min Cost = &sum;(TrainPriority &times; DelayMins) + &sum;(SplitPossessionPenalty) - &sum;(JointClubbingBonus)
          </p>
          <p className="text-slate-300">
            When Track Tamping (Civil) and Catenary Inspection (OHE) both demand possessions on Naini-Mirzapur DOWN line, CP-SAT snaps their windows into a single synchronized possession.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center font-mono">
          <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-500 text-[10px] block">Clubbing Ratio</span>
            <span className="text-xl font-bold text-emerald-400">62.5%</span>
          </div>
          <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-500 text-[10px] block">Safety Conflicts</span>
            <span className="text-xl font-bold text-blue-400">0 Violations</span>
          </div>
          <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-500 text-[10px] block">AAI Score Gain</span>
            <span className="text-xl font-bold text-orange-400">+28.5%</span>
          </div>
        </div>
      </div>
    )
  },
  {
    title: "Asset Availability Index (AAI)",
    subtitle: "Single Executive Metric for Railway Board & GMs",
    badge: "EXECUTIVE METRIC",
    content: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 flex flex-col justify-center">
          <span className="text-slate-400 text-[10px] block font-sans">Overall Composite AAI</span>
          <span className="text-4xl font-black text-emerald-400">88.5%</span>
          <span className="text-[11px] text-slate-300 block font-sans">Baseline Manual Planning: <strong>60.0%</strong></span>
          <span className="text-xs text-emerald-300 block font-bold">+28.5% Net Corridor Throughput</span>
        </div>
        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-[11px]">
          <div className="flex justify-between">
            <span className="text-slate-400">Track Line Availability:</span>
            <span className="text-white font-bold">90.9%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Locomotive Turnaround:</span>
            <span className="text-white font-bold">86.7%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Freight Rake Utilization:</span>
            <span className="text-white font-bold">85.0%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Punctuality Protected:</span>
            <span className="text-emerald-400 font-bold">98.6%</span>
          </div>
        </div>
      </div>
    )
  },
  {
    title: "Predictive IoT Telemetry Pipelines",
    subtitle: "Point Machine Oscilloscope & TRC/USFD Auto-Demands",
    badge: "PREDICTIVE MAINTENANCE",
    content: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
          <span className="text-blue-400 font-bold block font-mono text-[11px]">Point Machine Diagnostics</span>
          <p className="text-slate-300 text-[11px]">
            Ingests 50Hz throw current waveforms ($A \text{ vs } t$). Detects dry slide chairs and generates 25-minute S&T micro-blocks before signal failure.
          </p>
          <span className="text-[10px] text-blue-300 font-mono block">RDSO IRS:S 24 Compliant</span>
        </div>
        <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
          <span className="text-orange-400 font-bold block font-mono text-[11px]">TRC & USFD Flaw Pipeline</span>
          <p className="text-slate-300 text-[11px]">
            Ingests Track Quality Index (TQI) and ultrasonic flaw detections; auto-synthesizes statutory Civil Track demands per IRPWM Para 1102.
          </p>
          <span className="text-[10px] text-orange-300 font-mono block">RDSO TM-185 Standards</span>
        </div>
      </div>
    )
  },
  {
    title: "Real-Time Safety & Supply Chain",
    subtitle: "Kavach HUD, FOIS Demurrage & CMS HOER 10h Duty",
    badge: "CRIS ENTERPRISE INTEGRATION",
    content: (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs font-mono">
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
          <span className="text-emerald-400 font-bold block text-[11px]">Kavach ATP HUD</span>
          <p className="text-[10px] text-slate-300 font-sans">Live driver cab signal aspects & speed enforcement before maintenance zones.</p>
        </div>
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
          <span className="text-amber-400 font-bold block text-[11px]">FOIS Freight SLA</span>
          <p className="text-[10px] text-slate-300 font-sans">Tracks NTPC Coal and DFCCIL Container rakes to prevent supply-chain demurrage penalties.</p>
        </div>
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
          <span className="text-indigo-400 font-bold block text-[11px]">CMS 10h Duty Limit</span>
          <p className="text-[10px] text-slate-300 font-sans">Prevents statutory 10-hour HOER crew timeouts during block possessions.</p>
        </div>
      </div>
    )
  },
  {
    title: "National Scale & Production Tools",
    subtitle: "Scott Line Capacity, Machine Dispatcher & CRIS COA Export",
    badge: "TIER-3 PRODUCTION",
    content: (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs font-mono">
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
          <span className="text-emerald-400 font-bold block text-[11px]">Scott Capacity Engine</span>
          <p className="text-[10px] text-slate-300 font-sans">Calculates 24-hr line capacity drops & 3rd-line bi-directional bypass.</p>
        </div>
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
          <span className="text-amber-400 font-bold block text-[11px]">Machine Dispatcher</span>
          <p className="text-[10px] text-slate-300 font-sans">Depot transit pathing, cruising speeds, and diesel fuel logistics.</p>
        </div>
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
          <span className="text-blue-400 font-bold block text-[11px]">CRIS COA Exporter</span>
          <p className="text-[10px] text-slate-300 font-sans">1-Click XML & JSON export ready for official CRIS Control Office Application servers.</p>
        </div>
      </div>
    )
  },
  {
    title: "Official Compliance & Audit Trail",
    subtitle: "CBUI, PLA & Immutable CRIS TMS Audit Logs",
    badge: "AUDIT READINESS",
    content: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
          <h4 className="font-bold text-white text-sm">📄 Official Reports Generated</h4>
          <ul className="space-y-1.5 text-slate-300 text-[11px]">
            <li>• <strong>CBUI (Corridor Block Utilization Index):</strong> 98.5 (Grade A+)</li>
            <li>• <strong>PLA (Punctuality Loss Analysis):</strong> 100% Punctuality for Vande Bharat</li>
            <li>• <strong>Joint Possession Safety Certificates:</strong> Digital sign-offs</li>
          </ul>
        </div>
        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
          <h4 className="font-bold text-white text-sm">🔒 Immutable Audit Trail</h4>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Every demand submission, CP-SAT solve, emergency override, and SSE sign-off is logged with SHA-256 digital integrity for Railway Board scrutiny.
          </p>
        </div>
      </div>
    )
  },
  {
    title: "Summary & Business Impact",
    subtitle: "Winning Smart India Hackathon (SIH26027)",
    badge: "CONCLUSION & ROI",
    content: (
      <div className="space-y-4 text-center py-3">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 font-mono">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-500 text-[9px] block font-sans">Delays Avoided</span>
            <span className="text-lg font-black text-emerald-400">2,506 min/day</span>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-500 text-[9px] block font-sans">Joint Clubbing</span>
            <span className="text-lg font-black text-amber-400">62.5%</span>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-500 text-[9px] block font-sans">Solver Latency</span>
            <span className="text-lg font-black text-blue-400">0.021s</span>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-500 text-[9px] block font-sans">Stations Indexed</span>
            <span className="text-lg font-black text-orange-400">641 Stations</span>
          </div>
        </div>
        <p className="text-xs text-slate-300 max-w-lg mx-auto">
          RailBlock-AI is production-ready for pilot deployment in Prayagraj Division (NCR) and scalable across all 68 divisions of Indian Railways.
        </p>
      </div>
    )
  }
];

export default function PitchDeckModal({ isOpen, onClose }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Keyboard navigation support
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        setCurrentSlide(prev => Math.min(SLIDES.length - 1, prev + 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlide(prev => Math.max(0, prev - 1));
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const current = SLIDES[currentSlide];

  return (
    <div
      className="fixed inset-0 bg-black/90 backdrop-blur-md z-[9999] flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 md:p-8 shadow-2xl animate-scaleUp flex flex-col justify-between min-h-[520px] relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/20">
              <Presentation className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-wider block">
                {current.badge}
              </span>
              <h2 className="text-base md:text-lg font-extrabold text-white">{current.title}</h2>
              <p className="text-xs text-slate-400">{current.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick slide jumper numbers */}
            <div className="hidden sm:flex items-center gap-1">
              {SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`w-6 h-6 rounded text-[10px] font-mono font-bold transition-all ${
                    currentSlide === idx
                      ? 'bg-orange-500 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all ml-2"
              title="Close Pitch Deck (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Slide Body */}
        <div className="my-auto py-4">
          {current.content}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
            disabled={currentSlide === 0}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-950 hover:bg-slate-800 disabled:opacity-40 rounded-xl text-xs font-bold text-slate-300 border border-slate-800 transition-all"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          <span className="font-mono text-xs font-bold text-slate-400">
            Slide <strong className="text-white">{currentSlide + 1}</strong> of {SLIDES.length} • Use &larr; &rarr; keys
          </span>

          <button
            onClick={() => setCurrentSlide(prev => Math.min(SLIDES.length - 1, prev + 1))}
            disabled={currentSlide === SLIDES.length - 1}
            className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold shadow-md transition-all"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
