import React, { useState } from 'react';
import {
  Radio,
  Activity,
  RotateCcw,
  CheckCircle,
  AlertOctagon,
  Clock,
  Server,
  Zap,
} from 'lucide-react';
import { IntegrationMessage } from '../../types';

interface IngestionMonitorViewProps {
  messages: IntegrationMessage[];
}

export const IngestionMonitorView: React.FC<IngestionMonitorViewProps> = ({ messages }) => {
  const [msgList, setMessages] = useState<IntegrationMessage[]>(messages);

  const handleReplay = (id: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, status: 'Replayed', errorMessage: undefined } : m
      )
    );
    alert(`Quarantined Message ${id} successfully replayed into SiliconTrack event pipeline!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
            Plant Edge & IoT Data Ingestion Monitor
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            BRD Section 8.4: SECS/GEM, OPC-UA, LIMS Ingestion Health, Edge Buffering & Quarantine Replay Controls
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg text-slate-300">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span>Ingestion Rate: <strong className="text-white">1,420 events/sec</strong></span>
        </div>
      </div>

      {/* Edge Gateway Status Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between">
            <span>SECS/GEM Gateway</span>
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-lg font-bold text-white font-mono">3 Active Tool Connections</div>
          <div className="text-[10px] text-slate-500 font-mono">ASML Scanner, TEL Prober, AMAT CMP</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between">
            <span>OPC-UA Telemetry</span>
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-lg font-bold text-white font-mono">Lam Etch Chamber Sensors</div>
          <div className="text-[10px] text-slate-500 font-mono">Buffer Lag: 2.1 ms</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between">
            <span>Quarantine Queue</span>
            <AlertOctagon className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-lg font-bold text-amber-400 font-mono">
            {msgList.filter((m) => m.status === 'Quarantined').length} Message Pending
          </div>
          <div className="text-[10px] text-slate-500 font-mono font-medium">Replay Available</div>
        </div>
      </div>

      {/* Real-time Integration Message Log Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Server className="w-4 h-4 text-cyan-400" />
          Real-time Event Envelope Log & Quarantine Handling
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="p-3 rounded-l-lg">Event ID</th>
                <th className="p-3">Source</th>
                <th className="p-3">Event Type</th>
                <th className="p-3">Received At</th>
                <th className="p-3">Status</th>
                <th className="p-3">Payload / Error Details</th>
                <th className="p-3 text-right rounded-r-lg">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {msgList.map((m) => (
                <tr key={m.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3 text-cyan-300 font-bold">{m.eventId}</td>
                  <td className="p-3 font-semibold text-slate-300">{m.sourceSystem}</td>
                  <td className="p-3 text-slate-400 text-[11px]">{m.eventType}</td>
                  <td className="p-3 text-slate-400">{m.receivedAt}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        m.status === 'Processed' || m.status === 'Replayed'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {m.status}
                    </span>
                  </td>
                  <td className="p-3 max-w-xs truncate text-[11px] text-slate-300">
                    {m.errorMessage ? (
                      <span className="text-rose-400 font-bold">{m.errorMessage}</span>
                    ) : (
                      m.payloadSnippet
                    )}
                  </td>
                  <td className="p-3 text-right">
                    {m.status === 'Quarantined' ? (
                      <button
                        onClick={() => handleReplay(m.id)}
                        className="bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-bold px-2.5 py-1 rounded transition flex items-center gap-1 ml-auto"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Replay Event</span>
                      </button>
                    ) : (
                      <span className="text-emerald-400 text-[11px] font-semibold">✓ Ingested</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
