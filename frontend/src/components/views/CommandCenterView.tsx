import React from 'react';
import {
  TrendingUp,
  AlertOctagon,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Filter,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import { QualityKPIs, Lot, HoldRecord, SPCSignal } from '../../types';

interface CommandCenterViewProps {
  kpis: QualityKPIs;
  lots: Lot[];
  holds: HoldRecord[];
  signals: SPCSignal[];
  onNavigateTab: (tab: any) => void;
  onSelectLot: (lotCode: string) => void;
}

export const CommandCenterView: React.FC<CommandCenterViewProps> = ({
  kpis,
  lots,
  holds,
  signals,
  onNavigateTab,
  onSelectLot,
}) => {
  // Mock Yield Trend Data across last 7 shifts
  const yieldTrendData = [
    { shift: 'Shift 1 (08/01)', fpy: 93.2, target: 92.5, rty: 89.1 },
    { shift: 'Shift 2 (08/01)', fpy: 92.8, target: 92.5, rty: 88.5 },
    { shift: 'Shift 1 (08/02)', fpy: 93.5, target: 92.5, rty: 89.8 },
    { shift: 'Shift 2 (08/02)', fpy: 91.2, target: 92.5, rty: 87.0 },
    { shift: 'Shift 1 (08/03)', fpy: 88.4, target: 92.5, rty: 84.2 }, // Excursion drop
    { shift: 'Shift 2 (08/03)', fpy: 86.2, target: 92.5, rty: 82.1 }, // Excursion drop
    { shift: 'Shift 1 (08/04)', fpy: 91.8, target: 92.5, rty: 88.4 }, // Recovering
  ];

  // Defect Pareto Loss Waterfall
  const defectLossData = [
    { name: 'Edge Ring (Plasma Etch)', percentage: 38.5, color: '#EF4444' },
    { name: 'Parametric Shift (CP1 Test)', percentage: 24.2, color: '#F59E0B' },
    { name: 'CMP Oxide Non-Uniformity', percentage: 16.8, color: '#3B82F6' },
    { name: 'Particle Handling Scratch', percentage: 12.0, color: '#8B5CF6' },
    { name: 'Litho Overlay Registration', percentage: 8.5, color: '#10B981' },
  ];

  const activeHolds = holds.filter((h) => h.status === 'Active' || h.status === 'Under Investigation');

  return (
    <div className="space-y-6">
      {/* Page Title & Context Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            Quality Command Center
            <span className="text-xs font-mono bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded">
              Real-time Operations
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Executive Yield Intelligence, Active Holds Containment & Response Metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('ncr_mrb')}
            className="bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition shadow-sm"
          >
            <AlertOctagon className="w-4 h-4" />
            <span>Manage Holds ({activeHolds.length})</span>
          </button>
          <button
            onClick={() => onNavigateTab('spc')}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition"
          >
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span>SPC Explorer</span>
          </button>
        </div>
      </div>

      {/* KPI Highlights Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* First Pass Yield */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-1">
          <div className="text-[11px] font-medium text-slate-400 flex items-center justify-between">
            <span>First Pass Yield</span>
            <span className="text-emerald-400 flex items-center text-[10px]">
              <ArrowUpRight className="w-3 h-3" /> +0.6%
            </span>
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">{kpis.firstPassYield}%</div>
          <div className="text-[10px] text-slate-500">Target: 92.5% | Shift Avg</div>
        </div>

        {/* Final Yield */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-1">
          <div className="text-[11px] font-medium text-slate-400 flex items-center justify-between">
            <span>Final Yield</span>
            <span className="text-emerald-400 flex items-center text-[10px]">
              <ArrowUpRight className="w-3 h-3" /> +1.2%
            </span>
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">{kpis.finalYield}%</div>
          <div className="text-[10px] text-slate-500">Post-Rework Output</div>
        </div>

        {/* Scrap Rate */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-1">
          <div className="text-[11px] font-medium text-slate-400 flex items-center justify-between">
            <span>Scrap Rate</span>
            <span className="text-rose-400 flex items-center text-[10px]">
              <ArrowDownRight className="w-3 h-3" /> -0.1%
            </span>
          </div>
          <div className="text-2xl font-extrabold text-rose-400 font-mono">{kpis.scrapRate}%</div>
          <div className="text-[10px] text-slate-500">Irreversible Wafer Scrap</div>
        </div>

        {/* Mean Time To Contain */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-1">
          <div className="text-[11px] font-medium text-slate-400 flex items-center justify-between">
            <span>MTT Contain (MTTC)</span>
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-cyan-400 font-mono">
            {kpis.meanTimeToContainMinutes}m
          </div>
          <div className="text-[10px] text-slate-500">Signal to Auto-Hold</div>
        </div>

        {/* Active Holds */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-1">
          <div className="text-[11px] font-medium text-slate-400 flex items-center justify-between">
            <span>Active Holds</span>
            <AlertOctagon className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-amber-400 font-mono">{activeHolds.length} Lots</div>
          <div className="text-[10px] text-slate-500">37 Wafers Blocked</div>
        </div>

        {/* Data Completeness Score */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-1">
          <div className="text-[11px] font-medium text-slate-400 flex items-center justify-between">
            <span>Data Completeness</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono">
            {kpis.dataCompletenessScore}%
          </div>
          <div className="text-[10px] text-slate-500">Zero Unmapped Sources</div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Yield Trend Line Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                First Pass Yield (FPY) vs Target Trend
              </h2>
              <p className="text-xs text-slate-400">Shift-by-shift yield performance & excursion drop</p>
            </div>
            <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-700">
              Fab 1 - Dresden
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={yieldTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="shift" stroke="#94A3B8" tick={{ fontSize: 10 }} />
                <YAxis domain={[80, 100]} stroke="#94A3B8" tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="fpy" stroke="#38BDF8" strokeWidth={2.5} name="FPY %" dot={{ r: 4 }} />
                <Line type="monotone" dataKey="target" stroke="#F59E0B" strokeDasharray="5 5" name="Target (92.5%)" />
                <Line type="monotone" dataKey="rty" stroke="#10B981" strokeWidth={1.5} name="RTY %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Defect Pareto Loss Waterfall */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                Top Defect & Loss Contributors Pareto
              </h2>
              <p className="text-xs text-slate-400">Root-cause loss allocation by defect category</p>
            </div>
            <span className="text-[10px] font-mono bg-amber-950 text-amber-300 border border-amber-800 px-2 py-0.5 rounded">
              Current Excursion
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={defectLossData} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis type="number" stroke="#94A3B8" tick={{ fontSize: 10 }} unit="%" />
                <YAxis dataKey="name" type="category" stroke="#94A3B8" tick={{ fontSize: 10 }} width={120} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="percentage" radius={[0, 4, 4, 0]}>
                  {defectLossData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Active Holds & Quality Signals Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-rose-500" />
              Active Holds & Containment Status Queue
            </h2>
            <p className="text-xs text-slate-400">
              BRD Section 8.9: Automated and Manual Material Holds awaiting MRB Disposition
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('ncr_mrb')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
          >
            <span>View All NCRs</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 text-slate-400 uppercase font-mono text-[10px]">
              <tr>
                <th className="p-3 rounded-l-lg">Hold Code</th>
                <th className="p-3">Lot Code</th>
                <th className="p-3">Severity</th>
                <th className="p-3">Reason & Trigger</th>
                <th className="p-3">Initiated By</th>
                <th className="p-3">Wafers</th>
                <th className="p-3">MES Sync</th>
                <th className="p-3 text-right rounded-r-lg">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {holds.map((hold) => (
                <tr key={hold.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3 font-mono font-bold text-rose-400">{hold.holdCode}</td>
                  <td className="p-3 font-mono font-semibold text-cyan-300">
                    <button
                      onClick={() => onSelectLot(hold.lotCode)}
                      className="hover:underline flex items-center gap-1"
                    >
                      {hold.lotCode}
                    </button>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        hold.severity.includes('S1')
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {hold.severity}
                    </span>
                  </td>
                  <td className="p-3 max-w-xs truncate text-slate-300" title={hold.reason}>
                    {hold.reason}
                  </td>
                  <td className="p-3 text-slate-400 font-mono text-[11px]">{hold.initiatedBy}</td>
                  <td className="p-3 font-mono">{hold.affectedPopulationCount}</td>
                  <td className="p-3">
                    <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded font-mono">
                      {hold.synchronizationStatus}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => onNavigateTab('ncr_mrb')}
                      className="bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 font-medium text-[11px] px-2.5 py-1 rounded transition"
                    >
                      Investigate & MRB
                    </button>
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
