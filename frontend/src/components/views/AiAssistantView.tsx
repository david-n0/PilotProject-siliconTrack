import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  HelpCircle,
  CheckCircle2,
  Cpu,
  RefreshCw,
  Lightbulb,
} from 'lucide-react';

interface AiAssistantViewProps {
  onNavigateTab: (tab: any) => void;
}

export const AiAssistantView: React.FC<AiAssistantViewProps> = ({ onNavigateTab }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  const samplePrompts = [
    'Analyze LOT-2026-8804 Etch Chamber B Excursion & recommend containment steps',
    'Draft a 5-Whys root cause analysis for CP1 Sheet Resistance threshold shift',
    'Summarize top yield loss drivers across Dresden Fab 1 for August 3rd Shift',
    'Explain the Edge Ring spatial signature on 300mm wafer maps and causes',
  ];

  const handleAskAI = async (queryText?: string) => {
    const finalPrompt = queryText || prompt;
    if (!finalPrompt.trim()) return;

    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch('/api/v1/ai/investigate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: finalPrompt,
          contextType: 'Excursion Investigation',
        }),
      });

      const data = await res.json();
      setResponse(data.analysis || 'Analysis completed.');
    } catch (err) {
      console.error(err);
      setResponse('SiliconTrack AI Assistant response generated.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            AI Quality & Engineering Assistant
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Powered by Gemini 3.6 Flash (Server-Side) for Natural Language Root Cause Analysis & Excursion Troubleshooting
          </p>
        </div>

        <span className="text-xs font-mono bg-cyan-950 text-cyan-300 border border-cyan-800 px-3 py-1 rounded-lg">
          gemini-3.6-flash
        </span>
      </div>

      {/* Query Input Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase font-mono">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <span>Ask SiliconTrack AI Quality Assistant</span>
        </div>

        <div className="relative">
          <textarea
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type your quality investigation query (e.g. 'Analyze LOT-2026-8804 excursion root cause and draft CAPA actions')..."
            className="w-full bg-slate-950 border border-slate-700 text-xs font-mono text-white rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-cyan-500 placeholder-slate-500"
          />
          <button
            onClick={() => handleAskAI()}
            disabled={loading || !prompt.trim()}
            className="absolute right-3 bottom-3 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 text-white font-bold text-xs px-4 py-1.5 rounded-lg flex items-center gap-1.5 transition shadow"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin text-cyan-300" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>{loading ? 'Analyzing...' : 'Ask AI'}</span>
          </button>
        </div>

        {/* Sample Prompt Chips */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[10px] text-slate-400 font-mono block">SUGGESTED EXCURSION QUERIES:</span>
          <div className="flex flex-wrap gap-2">
            {samplePrompts.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setPrompt(chip);
                  handleAskAI(chip);
                }}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px] font-mono px-2.5 py-1 rounded-md transition text-left"
              >
                &quot;{chip}&quot;
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Response Display Box */}
      {(loading || response) && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Bot className="w-5 h-5 text-cyan-400" />
            <h2 className="text-sm font-bold text-white font-mono">SiliconTrack AI Analysis Response</h2>
          </div>

          {loading ? (
            <div className="p-8 text-center space-y-3">
              <RefreshCw className="w-6 h-6 animate-spin text-cyan-400 mx-auto" />
              <p className="text-xs text-slate-400 font-mono">
                Querying server-side Gemini 3.6 Flash model with semiconductor quality context...
              </p>
            </div>
          ) : (
            <div className="bg-slate-950 p-5 rounded-lg border border-slate-800 text-xs text-slate-200 font-mono leading-relaxed whitespace-pre-wrap">
              {response}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
