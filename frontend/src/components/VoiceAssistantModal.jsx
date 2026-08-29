import React, { useState } from 'react';
import { Mic, MicOff, Sparkles, CheckCircle2, Play, Volume2, Globe, ArrowRight } from 'lucide-react';
import { api } from '../services/api';

export default function VoiceAssistantModal({ isOpen, onClose, onCommandProcessed }) {
  const [queryText, setQueryText] = useState('Subedarganj me platform 1 ka 2 ghante ka apron wash block schedule karo shaam 14:00 baje ke baad');
  const [selectedLang, setSelectedLang] = useState('Hindi');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedResult, setParsedResult] = useState(null);

  if (!isOpen) return null;

  const sampleCommands = [
    { lang: 'Hindi', text: 'Subedarganj me platform 1 ka 2 ghante ka apron wash block schedule karo shaam 14:00 baje ke baad' },
    { lang: 'English', text: 'Schedule a 3 hour track tamping block on Naini to Mirzapur DOWN line urgently' },
    { lang: 'Bengali', text: 'Naini theke Mirzapur DOWN line-e 2 ghontar OHE power block dorkar' },
    { lang: 'Telugu', text: 'Chunar nundi DDU DOWN line lo 2 gantala track inspection block arrange cheyandi' },
    { lang: 'Tamil', text: 'Prayagraj sandhiyil platform 1il 2 mani neram pathai paramarippu thevai' },
    { lang: 'Marathi', text: 'Mirzapur te Chunar UP line var 3 taasacha tamping block schedule kara' }
  ];

  const handleExecuteVoice = async (textToRun = queryText) => {
    setIsProcessing(true);
    try {
      const res = await api.parseVoiceCommand(textToRun);
      setParsedResult(res.analysis);
      if (onCommandProcessed) onCommandProcessed();
    } catch (err) {
      console.error('Error parsing voice command:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSimulateMic = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      handleExecuteVoice();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl animate-scaleUp">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/25">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Indic Voice & Multilingual Scheduling Assistant</h3>
              <p className="text-xs text-slate-400">Natural language intent extraction in Indian languages (Hindi, Bengali, Telugu, etc.)</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xs font-bold">
            ✕ Close
          </button>
        </div>

        {/* Interactive Speech Visualizer / Mic Button */}
        <div className="flex flex-col items-center justify-center my-6">
          <button
            onClick={handleSimulateMic}
            className={`w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all active:scale-95 ${
              isListening
                ? 'bg-red-500 text-white animate-pulse ring-4 ring-red-500/40 shadow-red-500/40'
                : 'bg-gradient-to-tr from-orange-500 to-amber-500 text-white hover:scale-105 shadow-orange-500/30'
            }`}
          >
            {isListening ? <Mic className="w-8 h-8 animate-bounce" /> : <Mic className="w-8 h-8" />}
          </button>
          <span className="text-xs font-mono text-slate-400 mt-3">
            {isListening ? 'Listening in Indic Dialects (Speech-to-Intent)...' : 'Click Mic or choose a sample prompt below'}
          </span>
        </div>

        {/* Sample Multi-Language Prompts */}
        <div className="space-y-2 mb-4">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Sample Multi-Language Controller Queries:
          </span>
          <div className="grid grid-cols-2 gap-2">
            {sampleCommands.map(cmd => (
              <button
                key={cmd.lang}
                onClick={() => {
                  setSelectedLang(cmd.lang);
                  setQueryText(cmd.text);
                  handleExecuteVoice(cmd.text);
                }}
                className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-left text-xs transition-all hover:border-orange-500/60"
              >
                <span className="text-[10px] font-bold font-mono text-orange-400 block">{cmd.lang}:</span>
                <span className="text-slate-300 text-[11px] truncate block mt-0.5">{cmd.text}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Input Textarea */}
        <div className="space-y-2">
          <textarea
            rows="2"
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs font-medium text-white focus:outline-none focus:border-orange-500"
            placeholder="Type or speak a maintenance command..."
          ></textarea>

          <button
            onClick={() => handleExecuteVoice(queryText)}
            disabled={isProcessing}
            className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-extrabold text-xs rounded-xl shadow-lg active:scale-98 flex items-center justify-center gap-2"
          >
            <Sparkles className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
            <span>{isProcessing ? 'Parsing Intent & Scheduling...' : 'Parse Command & Auto-Schedule Block'}</span>
          </button>
        </div>

        {/* Parsed Result Box */}
        {parsedResult && (
          <div className="mt-4 p-4 bg-slate-950 border border-emerald-500/40 rounded-2xl text-xs space-y-2 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-emerald-400 font-extrabold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Intent Parsed & Scheduled!
              </span>
              <span className="text-[10px] font-mono text-slate-400">Confidence: {(parsedResult.confidence_score * 100).toFixed(0)}%</span>
            </div>
            
            <div className="grid grid-cols-3 gap-2 font-mono text-[11px] pt-1">
              <div>
                <span className="text-slate-500 block text-[9px]">Department</span>
                <span className="text-orange-400 font-bold">{parsedResult.detected_department}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[9px]">Section</span>
                <span className="text-slate-200 font-bold">{parsedResult.extracted_section}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[9px]">Duration</span>
                <span className="text-emerald-400 font-bold">{parsedResult.extracted_duration_min} min</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
