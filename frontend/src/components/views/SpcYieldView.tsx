import React, { useState } from 'react';
import {
  LineChart as LineChartIcon,
  AlertTriangle,
  TrendingUp,
  CheckCircle,
  Sliders,
  Filter,
  BarChart2,
  Info,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { SPCSignal, SPCPoint } from '../../types';

interface SpcYieldViewProps {
  signals: SPCSignal[];
  points: SPCPoint[];
  onNavigateTab: (tab: any) => void;
}

export const SpcYieldView: React.FC<SpcYieldViewProps> = ({
  signals,
  points,
  onNavigateTab,
}) => {
  const [selectedChart, setSelectedChart] = useState('CD Linewidth');

  // Compute Process Capability Cp & Cpk
  const mean = 14.12;
  const sigma = 0.28;
  const usl = 15.0;
  const lsl = 13.0;
  const cp = (usl - lsl) / (6 * sigma);
  const cpkUpper = (usl - mean) / (3 * sigma);
  const cpkLower = (mean - lsl) / (3 * sigma);
  const cpk = Math.min(cpkUpper, cpkLower);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <LineChartIcon className="w-5 h-5 text-cyan-400" />
            SPC Explorer & Yield Intelligence
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            BRD Section 8.7 & 8.8: X-bar/R Control Charts, Western Electric / Nelson Run Rules, Process Capability (Cpk) & Yield Analytics
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedChart}
            onChange={(e) => setSelectedChart(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-cyan-300 font-mono text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          >
            <option value="CD Linewidth">CD Linewidth (LITHO-DUV-20)</option>
            <option value="Oxide Thickness">Oxide Thickness (CMP-POLISH-40)</option>
            <option value="Sheet Resistance">Sheet Resistance Rs (SORT-CP1-60)</option>
          </select>
        </div>
      </div>

      {/* Process Capability Indices Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="text-[11px] text-slate-400 font-mono">Process Capability Cp</div>
          <div className="text-2xl font-extrabold text-cyan-300 font-mono">{cp.toFixed(2)}</div>
          <p className="text-[10px] text-slate-500 font-mono">Potential Spread Capacity</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="text-[11px] text-slate-400 font-mono">Process Index Cpk</div>
          <div
            className={`text-2xl font-extrabold font-mono ${
              cpk >= 1.33 ? 'text-emerald-400' : cpk >= 1.0 ? 'text-amber-400' : 'text-rose-400'
            }`}
          >
            {cpk.toFixed(2)}
          </div>
          <p className="text-[10px] text-slate-500 font-mono">
            {cpk < 1.0 ? '⚠️ Incapable (Drifted)' : 'Capable (Target >= 1.33)'}
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="text-[11px] text-slate-400 font-mono">Process Mean ($\mu$)</div>
          <div className="text-2xl font-extrabold text-white font-mono">{mean} nm</div>
          <p className="text-[10px] text-slate-500 font-mono">Target Nominal: 14.00 nm</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="text-[11px] text-slate-400 font-mono">Est. Standard Dev ($\sigma$)</div>
          <div className="text-2xl font-extrabold text-slate-200 font-mono">{sigma} nm</div>
          <p className="text-[10px] text-slate-500 font-mono">Sample Size: n=5</p>
        </div>
      </div>

      {/* Main SPC Control Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              X-Bar Individuals Control Chart - {selectedChart}
            </h2>
            <p className="text-xs text-slate-400">
              BRD Requirement SP-002: Separate Engineering Spec Limits (USL/LSL) & Control Limits (UCL/LCL)
            </p>
          </div>

          {/* Legend Badges */}
          <div className="flex items-center gap-3 text-[10px] font-mono">
            <span className="flex items-center gap-1 text-rose-400 font-semibold">
              <span className="w-3 h-0.5 bg-rose-500"></span> USL / LSL (Spec)
            </span>
            <span className="flex items-center gap-1 text-amber-400 font-semibold">
              <span className="w-3 h-0.5 bg-amber-500"></span> UCL / LCL (3σ)
            </span>
            <span className="flex items-center gap-1 text-cyan-400 font-semibold">
              <span className="w-3 h-0.5 bg-cyan-400"></span> Mean Line
            </span>
          </div>
        </div>

        {/* Recharts SPC Chart */}
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={points} margin={{ top: 15, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="timestamp" stroke="#94A3B8" tick={{ fontSize: 10 }} />
              <YAxis domain={[12.5, 15.5]} stroke="#94A3B8" tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
              />

              {/* Spec Limits Lines */}
              <ReferenceLine y={15.0} stroke="#EF4444" strokeWidth={1.5} label={{ value: 'USL 15.0nm', fill: '#EF4444', fontSize: 10 }} />
              <ReferenceLine y={13.0} stroke="#EF4444" strokeWidth={1.5} label={{ value: 'LSL 13.0nm', fill: '#EF4444', fontSize: 10 }} />

              {/* Control Limits Lines */}
              <ReferenceLine y={14.7} stroke="#F59E0B" strokeDasharray="4 4" label={{ value: 'UCL 14.7nm', fill: '#F59E0B', fontSize: 10 }} />
              <ReferenceLine y={13.3} stroke="#F59E0B" strokeDasharray="4 4" label={{ value: 'LCL 13.3nm', fill: '#F59E0B', fontSize: 10 }} />

              {/* Nominal Mean Line */}
              <ReferenceLine y={14.0} stroke="#38BDF8" strokeWidth={1} label={{ value: 'Mean 14.0nm', fill: '#38BDF8', fontSize: 10 }} />

              <Line
                type="monotone"
                dataKey="value"
                stroke="#38BDF8"
                strokeWidth={2.5}
                dot={(props: any) => {
                  const { cx, cy, payload } = props;
                  const hasViolation = payload.violatedRules && payload.violatedRules.length > 0;
                  return (
                    <circle
                      key={`dot-${payload.id}`}
                      cx={cx}
                      cy={cy}
                      r={hasViolation ? 6 : 4}
                      fill={hasViolation ? '#EF4444' : '#38BDF8'}
                      stroke={hasViolation ? '#FFFFFF' : '#0F172A'}
                      strokeWidth={1.5}
                    />
                  );
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Active Nelson Run Rule Violations & Signals List */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            Detected Western Electric / Nelson Run Rule Signals
          </h2>
          <span className="text-xs text-slate-400 font-mono">BRD Requirement SP-003</span>
        </div>

        <div className="space-y-3">
          {signals.map((sig) => (
            <div
              key={sig.id}
              className="p-4 bg-slate-950 border border-slate-800 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-xs font-mono">{sig.chartName}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      sig.severity.includes('S1')
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}
                  >
                    {sig.severity}
                  </span>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                    Lot: {sig.lotCode}
                  </span>
                </div>
                <p className="text-xs text-rose-300 font-mono font-medium">{sig.ruleViolated}</p>
                <div className="text-[11px] text-slate-400 font-mono">
                  Tool: {sig.equipmentCode} | Cpk: <span className="text-rose-400 font-bold">{sig.cpk}</span> | Time: {sig.timestamp}
                </div>
              </div>

              <button
                onClick={() => onNavigateTab('ncr_mrb')}
                className="bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs px-3.5 py-1.5 rounded-lg transition shrink-0"
              >
                Trigger Hold & NCR
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
