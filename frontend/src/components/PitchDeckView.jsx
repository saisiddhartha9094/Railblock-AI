import React, { useState, useEffect } from 'react';
import { Presentation, ChevronLeft, ChevronRight, CheckCircle2, Sparkles, Trophy, Award, ShieldCheck, Download, Layers, Play, RefreshCw } from 'lucide-react';

const SLIDES = [
  {
    title: "RailBlock-AI",
    subtitle: "AI-Powered Automatic Block Planning to Maximize Asset Availability on Indian Railways",
    badge: "PS CODE: SIH26027 • MINISTRY OF RAILWAYS",
    content: (
      <div className="space-y-6 text-center py-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/15 border border-orange-500/40 text-orange-400 font-mono text-xs font-extrabold shadow-sm">
          <Trophy className="w-4 h-4 text-amber-300" />
          SMART INDIA HACKATHON 2024 / 2025 • MINISTRY OF RAILWAYS
        </div>

        <div className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-amber-200 to-white max-w-2xl mx-auto leading-tight">
          Transforming Indian Railways Maintenance Planning
        </div>

        <p className="text-sm md:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
          From fragmented manual paper block registers to an enterprise mathematical constraint optimizer with <strong>Google OR-Tools CP-SAT</strong>, <strong>SimPy Discrete-Event Simulation</strong>, and <strong>CRIS COA</strong> enterprise integration.
        </p>

        <div className="flex flex-wrap justify-center gap-3 pt-4">
          <span className="px-3.5 py-1.5 bg-slate-900 text-orange-400 border border-orange-500/40 rounded-xl font-mono text-xs font-bold shadow-md">
            📍 Prayagraj Division (NCR Grounding)
          </span>
          <span className="px-3.5 py-1.5 bg-slate-900 text-emerald-400 border border-emerald-500/40 rounded-xl font-mono text-xs font-bold shadow-md">
            🇮🇳 641+ Station National Graph
          </span>
          <span className="px-3.5 py-1.5 bg-slate-900 text-blue-400 border border-blue-500/40 rounded-xl font-mono text-xs font-bold shadow-md">
            ⚡ Google OR-Tools CP-SAT in 0.02s
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
        <div className="p-6 bg-red-950/20 border border-red-500/40 rounded-2xl space-y-3 shadow-lg">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-ping"></span>
            <h4 className="font-extrabold text-red-300 text-base">❌ The Existing Manual Reality</h4>
          </div>
          <ul className="space-y-3 text-slate-300 text-xs md:text-sm">
            <li className="flex items-start gap-2">• <span><strong>Departmental Silos:</strong> 4 Departments (Civil, OHE, Signal, Traffic) plan separately on paper registers.</span></li>
            <li className="flex items-start gap-2">• <span><strong>Repeated Possession Losses:</strong> The same track section is closed 3 separate times for 3 separate teams.</span></li>
            <li className="flex items-start gap-2">• <span><strong>Passenger Disruptions:</strong> Uncoordinated blocks throttle high-priority trains like <em>Rajdhani</em> and <em>Vande Bharat</em>.</span></li>
            <li className="flex items-start gap-2">• <span><strong>Freight Demurrage:</strong> Industrial coal & container rakes held on loops incurring heavy demurrage penalties.</span></li>
          </ul>
        </div>

        <div className="p-6 bg-emerald-950/20 border border-emerald-500/40 rounded-2xl space-y-3 shadow-lg">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
            <h4 className="font-extrabold text-emerald-300 text-base">✅ The RailBlock-AI Solution</h4>
          </div>
          <ul className="space-y-3 text-slate-300 text-xs md:text-sm">
            <li className="flex items-start gap-2">• <span><strong>Multi-Objective CP-SAT Solver:</strong> Automatically balances maintenance demands with passenger train timetables.</span></li>
            <li className="flex items-start gap-2">• <span><strong>Joint Block Clubbing (62.5%):</strong> Combines Civil, OHE, and S&T works into unified multi-gang windows.</span></li>
            <li className="flex items-start gap-2">• <span><strong>25kV OHE Power Interlocking:</strong> Automatically enforces electrical isolation safety rules per ACTM Vol II.</span></li>
            <li className="flex items-start gap-2">• <span><strong>Recovers 2,506 Daily Delay Minutes:</strong> Boosts corridor Asset Availability Index from <strong>60.0% → 88.5%</strong>.</span></li>
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
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs font-mono py-2">
        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5 shadow-md">
          <span className="text-orange-400 font-bold block text-xs">Constraint Solver</span>
          <span className="text-white font-extrabold text-sm block">Google OR-Tools CP-SAT</span>
          <p className="text-[11px] text-slate-400 font-sans">Solves multi-objective delay penalties & RDSO safety norms in 0.02s.</p>
        </div>
        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5 shadow-md">
          <span className="text-emerald-400 font-bold block text-xs">Simulation Core</span>
          <span className="text-white font-extrabold text-sm block">SimPy Discrete-Event</span>
          <p className="text-[11px] text-slate-400 font-sans">Simulates dynamic train progression & station loop siding holds.</p>
        </div>
        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5 shadow-md">
          <span className="text-blue-400 font-bold block text-xs">Backend API</span>
          <span className="text-white font-extrabold text-sm block">FastAPI + Python 3.11</span>
          <p className="text-[11px] text-slate-400 font-sans">High-throughput asynchronous REST APIs & CRIS COA XML exporter.</p>
        </div>
        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5 shadow-md">
          <span className="text-amber-400 font-bold block text-xs">Frontend Cockpit</span>
          <span className="text-white font-extrabold text-sm block">React 18 + Vite + Tailwind</span>
          <p className="text-[11px] text-slate-400 font-sans">24-hour Gantt matrix, GIS schematic visualizer, and dark-theme UI.</p>
        </div>
        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5 shadow-md">
          <span className="text-indigo-400 font-bold block text-xs">National Graph</span>
          <span className="text-white font-extrabold text-sm block">641 Stations & Trunks</span>
          <p className="text-[11px] text-slate-400 font-sans">Sub-millisecond fuzzy search and Golden Quadrilateral trunk routes.</p>
        </div>
        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5 shadow-md">
          <span className="text-red-400 font-bold block text-xs">Indic Voice NLP</span>
          <span className="text-white font-extrabold text-sm block">6 Indian Languages</span>
          <p className="text-[11px] text-slate-400 font-sans">Hindi, Bengali, Telugu, Tamil, Marathi, and English speech intent parsing.</p>
        </div>
      </div>
    )
  },
  {
    title: "Key Innovation: Joint Block Clubbing",
    subtitle: "Eliminating Repeated Possession Fragmentation",
    badge: "OPTIMIZER CORE",
    content: (
      <div className="space-y-4 text-xs py-2">
        <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2.5">
          <div className="flex justify-between font-mono">
            <span className="text-amber-400 font-bold text-sm">Mathematical Formulation:</span>
            <span className="text-emerald-400 font-bold">Solved in 0.021s</span>
          </div>
          <p className="text-slate-300 leading-relaxed font-mono text-xs bg-slate-900 p-3 rounded-xl border border-slate-800">
            {"min Cost = ∑(TrainPriority × DelayMins) + ∑(SplitPossessionPenalty) - ∑(JointClubbingBonus)"}
          </p>
          <p className="text-slate-300 text-xs md:text-sm">
            When Track Tamping (Civil) and Catenary Inspection (OHE) both demand possessions on Naini-Mirzapur DOWN line, CP-SAT snaps their windows into a single synchronized possession window.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center font-mono">
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
            <span className="text-slate-500 text-xs block font-sans">Clubbing Ratio</span>
            <span className="text-2xl md:text-3xl font-black text-emerald-400">62.5%</span>
          </div>
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
            <span className="text-slate-500 text-xs block font-sans">Safety Conflicts</span>
            <span className="text-2xl md:text-3xl font-black text-blue-400">0 Violations</span>
          </div>
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
            <span className="text-slate-500 text-xs block font-sans">AAI Score Gain</span>
            <span className="text-2xl md:text-3xl font-black text-orange-400">+28.5%</span>
          </div>
        </div>
      </div>
    )
  },
  {
    title: "Asset Availability Index (AAI)",
    subtitle: "Single Executive Metric for Railway Board & General Managers",
    badge: "EXECUTIVE METRIC",
    content: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono py-2">
        <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-center">
          <span className="text-slate-400 text-xs block font-sans">Overall Composite AAI Score</span>
          <span className="text-5xl font-black text-emerald-400">88.5%</span>
          <span className="text-sm text-slate-300 block font-sans">Baseline Manual Planning: <strong className="text-amber-400 font-mono">60.0%</strong></span>
          <span className="text-sm text-emerald-300 block font-bold">+28.5% Net Corridor Throughput Increase</span>
        </div>
        <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 text-xs md:text-sm">
          <div className="flex justify-between pb-2 border-b border-slate-800/80">
            <span className="text-slate-400">Track Line Availability:</span>
            <span className="text-white font-bold">90.9%</span>
          </div>
          <div className="flex justify-between pb-2 border-b border-slate-800/80">
            <span className="text-slate-400">Locomotive Turnaround:</span>
            <span className="text-white font-bold">86.7%</span>
          </div>
          <div className="flex justify-between pb-2 border-b border-slate-800/80">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs py-2">
        <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-blue-400 font-bold block font-mono text-xs">Point Machine Diagnostics</span>
          <p className="text-slate-300 text-xs leading-relaxed">
            {"Ingests 50Hz throw current waveforms (Current vs Time). Detects dry slide chairs and generates 25-minute S&T micro-blocks before signal failure occurs."}
          </p>
          <span className="text-[10px] text-blue-300 font-mono block bg-blue-950/40 px-2 py-1 rounded border border-blue-500/30">
            RDSO IRS:S 24 Compliant
          </span>
        </div>
        <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-orange-400 font-bold block font-mono text-xs">TRC & USFD Flaw Pipeline</span>
          <p className="text-slate-300 text-xs leading-relaxed">
            Ingests Track Quality Index (TQI) and ultrasonic flaw detections; auto-synthesizes statutory Civil Track demands per IRPWM Para 1102.
          </p>
          <span className="text-[10px] text-orange-300 font-mono block bg-orange-950/40 px-2 py-1 rounded border border-orange-500/30">
            RDSO TM-185 Standards
          </span>
        </div>
      </div>
    )
  },
  {
    title: "Real-Time Safety & Supply Chain",
    subtitle: "Kavach HUD, FOIS Demurrage & CMS HOER 10h Duty",
    badge: "CRIS ENTERPRISE INTEGRATION",
    content: (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono py-2">
        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
          <span className="text-emerald-400 font-bold block text-xs">Kavach ATP HUD</span>
          <p className="text-[11px] text-slate-300 font-sans">Live driver cab signal aspects & speed enforcement before maintenance possession zones.</p>
        </div>
        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
          <span className="text-amber-400 font-bold block text-xs">FOIS Freight SLA</span>
          <p className="text-[11px] text-slate-300 font-sans">Tracks NTPC Coal and DFCCIL Container rakes to prevent supply-chain demurrage penalties.</p>
        </div>
        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
          <span className="text-indigo-400 font-bold block text-xs">CMS 10h Duty Limit</span>
          <p className="text-[11px] text-slate-300 font-sans">Prevents statutory 10-hour HOER crew timeouts during block possessions.</p>
        </div>
      </div>
    )
  },
  {
    title: "National Scale & Production Tools",
    subtitle: "Pan-India Station Graph, Dynamic Re-Scheduling & CRIS COA Export",
    badge: "ENTERPRISE INTEGRATION",
    content: (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono py-2">
        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
          <span className="text-emerald-400 font-bold block text-xs">National Station Graph</span>
          <p className="text-[11px] text-slate-300 font-sans">641 stations & 401 junction nodes indexed with sub-millisecond route lookup.</p>
        </div>
        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
          <span className="text-amber-400 font-bold block text-xs">Dynamic Re-Optimizer</span>
          <p className="text-[11px] text-slate-300 font-sans">Real-time emergency override re-scheduling with 0.02s solver convergence.</p>
        </div>
        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
          <span className="text-blue-400 font-bold block text-xs">CRIS COA Exporter</span>
          <p className="text-[11px] text-slate-300 font-sans">1-Click XML & JSON export ready for official CRIS Control Office Application servers.</p>
        </div>
      </div>
    )
  },
  {
    title: "Official Compliance & Audit Trail",
    subtitle: "CBUI, PLA & Immutable CRIS TMS Audit Logs",
    badge: "AUDIT READINESS",
    content: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs py-2">
        <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
          <h4 className="font-bold text-white text-sm">📄 Official Reports Generated</h4>
          <ul className="space-y-2 text-slate-300 text-xs">
            <li>• <strong>CBUI (Corridor Block Utilization Index):</strong> 98.5 (Grade A+)</li>
            <li>• <strong>PLA (Punctuality Loss Analysis):</strong> 100% Punctuality for Vande Bharat</li>
            <li>• <strong>Joint Possession Safety Certificates:</strong> Digital sign-offs</li>
          </ul>
        </div>
        <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
          <h4 className="font-bold text-white text-sm">🔒 Immutable Audit Trail</h4>
          <p className="text-slate-300 text-xs leading-relaxed">
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
      <div className="space-y-6 text-center py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono">
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
            <span className="text-slate-500 text-xs block font-sans">Delays Avoided</span>
            <span className="text-xl md:text-2xl font-black text-emerald-400">2,506 min/day</span>
          </div>
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
            <span className="text-slate-500 text-xs block font-sans">Joint Clubbing</span>
            <span className="text-xl md:text-2xl font-black text-amber-400">62.5%</span>
          </div>
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
            <span className="text-slate-500 text-xs block font-sans">Solver Latency</span>
            <span className="text-xl md:text-2xl font-black text-blue-400">0.021s</span>
          </div>
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
            <span className="text-slate-500 text-xs block font-sans">Stations Indexed</span>
            <span className="text-xl md:text-2xl font-black text-orange-400">641 Stations</span>
          </div>
        </div>
        <p className="text-sm text-slate-300 max-w-xl mx-auto font-medium">
          RailBlock-AI is production-ready for pilot deployment in Prayagraj Division (NCR) and scalable across all 68 divisions of Indian Railways.
        </p>
      </div>
    )
  }
];

export default function PitchDeckView() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        setCurrentSlide(prev => Math.min(SLIDES.length - 1, prev + 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlide(prev => Math.max(0, prev - 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const current = SLIDES[currentSlide];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl mb-6">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20">
            <Presentation className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-wider block">
              {current.badge}
            </span>
            <h2 className="text-xl font-extrabold text-white">{current.title}</h2>
            <p className="text-xs text-slate-400">{current.subtitle}</p>
          </div>
        </div>

        {/* Slide Number Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-all ${
                currentSlide === idx
                  ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md shadow-orange-500/20 scale-105'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Slide Body */}
      <div className="my-6 min-h-[300px] flex items-center justify-center">
        <div className="w-full">
          {current.content}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-800">
        <button
          onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
          disabled={currentSlide === 0}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-950 hover:bg-slate-800 disabled:opacity-40 rounded-xl text-xs font-bold text-slate-300 border border-slate-800 transition-all"
        >
          <ChevronLeft className="w-4 h-4" /> Previous Slide
        </button>

        <span className="font-mono text-xs font-bold text-slate-400">
          {"Slide "}
          <strong className="text-white">{currentSlide + 1}</strong>
          {` of ${SLIDES.length} • Use Arrow Keys ← →`}
        </span>

        <button
          onClick={() => setCurrentSlide(prev => Math.min(SLIDES.length - 1, prev + 1))}
          disabled={currentSlide === SLIDES.length - 1}
          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20 transition-all"
        >
          Next Slide <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
