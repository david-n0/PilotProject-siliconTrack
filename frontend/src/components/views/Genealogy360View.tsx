import React, { useState } from 'react';
import {
  GitFork,
  Search,
  Box,
  Layers,
  ArrowRight,
  ShieldAlert,
  CheckCircle,
  FileCheck,
  Calculator,
  Database,
  Calendar,
  User,
  ExternalLink,
} from 'lucide-react';
import { Lot, Product, Route } from '../../types';

interface Genealogy360ViewProps {
  lots: Lot[];
  selectedLotCode?: string;
  onSelectLot: (lotCode: string) => void;
  onNavigateTab: (tab: any) => void;
}

export const Genealogy360View: React.FC<Genealogy360ViewProps> = ({
  lots,
  selectedLotCode = 'LOT-2026-8801',
  onSelectLot,
  onNavigateTab,
}) => {
  const [searchInput, setSearchInput] = useState(selectedLotCode);
  const [activeLotCode, setActiveLotCode] = useState(selectedLotCode);
  const [calcRiskExcursion, setCalcRiskExcursion] = useState(false);

  const currentLot = lots.find((l) => l.lotCode === activeLotCode) || lots[0];

  // Find parent and children lots
  const parentLot = lots.find((l) => l.id === currentLot.parentLotId);
  const childLots = lots.filter((l) => l.parentLotId === currentLot.id);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    const found = lots.find((l) => l.lotCode.toLowerCase().includes(searchInput.toLowerCase()));
    if (found) {
      setActiveLotCode(found.lotCode);
      onSelectLot(found.lotCode);
    } else {
      alert(`Lot "${searchInput}" not found. Try LOT-2026-8801 or LOT-2026-8804.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <GitFork className="w-5 h-5 text-cyan-400" />
            Lot & Wafer 360 Genealogy Explorer
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            BRD Section 6.2: Backward & Forward Lineage Trace, Split/Merge/Rework Tree, and Material Population Calculation
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Lot Code (e.g. LOT-2026-8801)..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>
          <button
            type="submit"
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs px-3.5 py-1.5 rounded-lg transition"
          >
            Trace Lot
          </button>
        </form>
      </div>

      {/* Lot Quick Overview Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-xl font-extrabold font-mono text-cyan-300">{currentLot.lotCode}</span>
              <span
                className={`px-2.5 py-0.5 rounded text-xs font-bold font-mono ${
                  currentLot.status === 'completed'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : currentLot.status === 'hold'
                    ? 'bg-rose-950 text-rose-300 border border-rose-800'
                    : currentLot.status === 'rework'
                    ? 'bg-purple-950 text-purple-300 border border-purple-800'
                    : 'bg-amber-950 text-amber-300 border border-amber-800'
                }`}
              >
                {currentLot.status.toUpperCase()}
              </span>
              <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono border border-slate-700">
                Priority: {currentLot.priority}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Product: <span className="font-semibold text-white">{currentLot.productName} ({currentLot.productCode})</span> | Site: {currentLot.site}
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="bg-slate-800/80 px-3 py-1.5 rounded border border-slate-700 text-slate-300">
              <span className="text-slate-400 block text-[10px]">WAFERS QTY</span>
              <span className="text-sm font-bold text-white">{currentLot.quantityWafers} Wafers</span>
            </div>
            <div className="bg-slate-800/80 px-3 py-1.5 rounded border border-slate-700 text-slate-300">
              <span className="text-slate-400 block text-[10px]">CURRENT YIELD</span>
              <span className="text-sm font-bold text-emerald-400">{currentLot.yieldPercent}%</span>
            </div>
            <div className="bg-slate-800/80 px-3 py-1.5 rounded border border-slate-700 text-slate-300">
              <span className="text-slate-400 block text-[10px]">FOUP CARRIER</span>
              <span className="text-sm font-bold text-cyan-400">{currentLot.carrierId}</span>
            </div>
          </div>
        </div>

        {/* Visual Lineage Tree Section */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-400 mb-3">
            Genealogy Tree & Split/Merge/Rework Graph
          </h3>
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col md:flex-row items-center justify-center gap-6 overflow-x-auto">
            {/* Parent Node */}
            <div className="text-center">
              <span className="text-[10px] font-mono text-slate-400 block mb-1">BACKWARD PARENT</span>
              {parentLot ? (
                <button
                  onClick={() => setActiveLotCode(parentLot.lotCode)}
                  className="bg-slate-900 border border-cyan-800 hover:border-cyan-500 p-3 rounded-lg text-left shadow transition group"
                >
                  <div className="font-mono font-bold text-cyan-300 text-xs flex items-center gap-1 group-hover:underline">
                    <Box className="w-3.5 h-3.5 text-cyan-400" />
                    {parentLot.lotCode}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">{parentLot.quantityWafers} Wafers | Parent</div>
                </button>
              ) : (
                <div className="bg-slate-900/50 border border-slate-800 p-3 rounded-lg text-xs text-slate-500 font-mono">
                  Root Parent Lot (Raw Material)
                </div>
              )}
            </div>

            <ArrowRight className="w-5 h-5 text-slate-600 hidden md:block" />

            {/* Current Active Lot Node */}
            <div className="text-center">
              <span className="text-[10px] font-mono text-cyan-400 font-bold block mb-1">SELECTED LOT</span>
              <div className="bg-cyan-950/80 border-2 border-cyan-500 p-3.5 rounded-lg text-left shadow-lg">
                <div className="font-mono font-extrabold text-white text-sm flex items-center gap-2">
                  <Box className="w-4 h-4 text-cyan-400" />
                  {currentLot.lotCode}
                </div>
                <div className="text-[11px] text-cyan-200 mt-1 font-mono">
                  {currentLot.quantityWafers} Wafers | {currentLot.currentOperationCode}
                </div>
                <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
                  Yield: {currentLot.yieldPercent}%
                </div>
              </div>
            </div>

            <ArrowRight className="w-5 h-5 text-slate-600 hidden md:block" />

            {/* Child Split / Rework Nodes */}
            <div className="text-center">
              <span className="text-[10px] font-mono text-slate-400 block mb-1">FORWARD CHILDREN</span>
              {childLots.length > 0 ? (
                <div className="space-y-2">
                  {childLots.map((child) => (
                    <button
                      key={child.id}
                      onClick={() => setActiveLotCode(child.lotCode)}
                      className="bg-slate-900 border border-slate-700 hover:border-cyan-500 p-2.5 rounded-lg text-left block transition group"
                    >
                      <div className="font-mono font-bold text-slate-200 text-xs flex items-center gap-1 group-hover:text-cyan-300">
                        <GitFork className="w-3.5 h-3.5 text-purple-400" />
                        {child.lotCode}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {child.splitReason || 'Split Sub-Lot'} ({child.quantityWafers} Wafers)
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="bg-slate-900/50 border border-slate-800 p-3 rounded-lg text-xs text-slate-500 font-mono">
                  No Downstream Splits
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Operation Execution Route Timeline */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          Operation Execution Route Timeline & Parameters
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { step: '100', code: 'MAT-INSP-10', name: 'Raw Silicon QC', equip: 'eq-mat-01', status: 'Passed', val: 'Resistivity 14.2 Ω·cm' },
            { step: '200', code: 'LITHO-DUV-20', name: 'DUV Lithography', equip: 'LITHO-ASML-01', status: 'Passed', val: 'CD 14.02nm' },
            { step: '300', code: 'ETCH-RIE-30', name: 'Plasma RIE Etch', equip: 'ETCH-LAM-01', status: currentLot.lotCode === 'LOT-2026-8804' ? 'Excursion Hold' : 'Passed', val: 'Depth 85.1nm' },
            { step: '400', code: 'CMP-POLISH-40', name: 'CMP Planarize', equip: 'CMP-AMAT-01', status: 'Passed', val: 'Thickness 452Å' },
            { step: '500', code: 'METRO-CD-50', name: 'KLA CD Check', equip: 'METRO-KLA-01', status: 'Passed', val: 'Overlay 0.4nm' },
            { step: '600', code: 'SORT-CP1-60', name: 'CP1 Probe Sort', equip: 'SORT-TEL-01', status: 'Passed', val: 'Yield 94.2%' },
          ].map((op) => (
            <div
              key={op.step}
              className={`p-3 rounded-lg border text-xs space-y-1 ${
                op.status === 'Excursion Hold'
                  ? 'bg-rose-950/60 border-rose-800 text-rose-200'
                  : 'bg-slate-800/60 border-slate-700/80 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>STEP {op.step}</span>
                {op.status === 'Passed' ? (
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                )}
              </div>
              <div className="font-bold text-white text-xs">{op.name}</div>
              <div className="font-mono text-[10px] text-cyan-400">{op.code}</div>
              <div className="text-[10px] text-slate-400 font-mono truncate">{op.equip}</div>
              <div className="text-[10px] bg-slate-900/80 px-1.5 py-0.5 rounded border border-slate-700 font-mono mt-1 text-slate-300">
                {op.val}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Consumed Materials & Affected Population Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Consumed Material Trace */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400" />
            Consumed Materials & Supplier Lots
          </h2>
          <div className="space-y-2 text-xs">
            <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/80 flex items-center justify-between">
              <div>
                <div className="font-semibold text-white">300mm Prime Silicon Substrate</div>
                <div className="text-[10px] text-slate-400 font-mono">Supplier: GlobalWafers Co. | Batch: {currentLot.supplierLotCode}</div>
              </div>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded font-mono">
                Cert OK
              </span>
            </div>
            <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/80 flex items-center justify-between">
              <div>
                <div className="font-semibold text-white">DUV ArF Photoresist 193nm</div>
                <div className="text-[10px] text-slate-400 font-mono">Supplier: JSR Micro | Batch: LOT-RESIST-9921</div>
              </div>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded font-mono">
                Cert OK
              </span>
            </div>
          </div>
        </div>

        {/* Affected Population Calculator */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Calculator className="w-4 h-4 text-amber-400" />
              Affected Population Calculator
            </h2>
            <button
              onClick={() => setCalcRiskExcursion(!calcRiskExcursion)}
              className="bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-800 text-xs px-2.5 py-1 rounded font-medium transition"
            >
              {calcRiskExcursion ? 'Recalculate' : 'Run Population Calculation'}
            </button>
          </div>
          <p className="text-xs text-slate-400">
            BRD Section 8.2: Compute all downstream lots sharing equipment ETCH-LAM-01 Chamber B between 08/02 & 08/03.
          </p>

          {calcRiskExcursion ? (
            <div className="bg-amber-950/40 border border-amber-800/80 p-3.5 rounded-lg space-y-2 text-xs">
              <div className="font-bold text-amber-300">Containment Scope Calculation Result:</div>
              <ul className="list-disc list-inside text-slate-300 space-y-1 font-mono text-[11px]">
                <li>Total Affected Production Lots: <span className="font-bold text-white">3 Lots</span> (LOT-2026-8804, LOT-2026-8805, LOT-2026-8807)</li>
                <li>Total Blocked Wafers: <span className="font-bold text-rose-400">75 Wafers</span></li>
                <li>Shipped Exposure Risk: <span className="font-bold text-emerald-400">0 Wafers (100% Contained)</span></li>
              </ul>
              <button
                onClick={() => onNavigateTab('ncr_mrb')}
                className="mt-2 bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs px-3 py-1 rounded transition"
              >
                Apply Automated Hold to Population
              </button>
            </div>
          ) : (
            <div className="bg-slate-800/40 border border-slate-800 p-3 rounded-lg text-xs text-slate-400 font-mono">
              Click &quot;Run Population Calculation&quot; to perform backward/forward risk graph analysis.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
