import React, { useState } from 'react';
import {
  Disc,
  Filter,
  Eye,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Info,
  Sliders,
  Columns,
} from 'lucide-react';
import { generateWaferMap } from '../../data/seedData';
import { DieData, WaferMap } from '../../types';

interface WaferMapViewProps {
  onNavigateTab: (tab: any) => void;
}

export const WaferMapView: React.FC<WaferMapViewProps> = ({ onNavigateTab }) => {
  const [selectedWaferSerial, setSelectedWaferSerial] = useState('WAF-8804-01');
  const [signatureType, setSignatureType] = useState<
    'edge_ring' | 'center_cluster' | 'scratch' | 'repeating_pattern' | 'none'
  >('edge_ring');

  const [compareMode, setCompareMode] = useState(false);
  const [selectedDie, setSelectedDie] = useState<DieData | null>(null);

  const activeMap = generateWaferMap(selectedWaferSerial, 'LOT-2026-8804', signatureType);
  const compareMap = generateWaferMap('WAF-8801-01', 'LOT-2026-8801', 'none');

  const binsLegend = [
    { code: 1, label: 'Pass (Bin 1)', color: '#10B981' },
    { code: 2, label: 'Parametric Fail (Bin 2)', color: '#F59E0B' },
    { code: 3, label: 'Die Edge Defect (Bin 3)', color: '#EF4444' },
    { code: 4, label: 'Particle Scratch (Bin 4)', color: '#8B5CF6' },
    { code: 5, label: 'Gross Short (Bin 5)', color: '#EC4899' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Disc className="w-5 h-5 text-cyan-400" />
            Circular Silicon Wafer Map & Defect Explorer
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            BRD Section 8.6 & 13.3: 300mm Circular Substrate Grid, Die Coordinates, Spatial Signatures & Multi-Layer Comparison
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCompareMode(!compareMode)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              compareMode
                ? 'bg-cyan-600 text-white shadow'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            <Columns className="w-4 h-4" />
            <span>{compareMode ? 'Exit Comparison' : 'Side-by-Side Comparison'}</span>
          </button>
        </div>
      </div>

      {/* Wafer Map Controls & Spatial Signatures */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-300 font-mono">Select Wafer:</span>
          <select
            value={selectedWaferSerial}
            onChange={(e) => setSelectedWaferSerial(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-xs font-mono text-cyan-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          >
            <option value="WAF-8804-01">WAF-8804-01 (Lot 8804 - Etch Chamber B Excursion)</option>
            <option value="WAF-8802-12">WAF-8802-12 (Lot 8802 - CP1 Threshold Shift)</option>
            <option value="WAF-8801-01">WAF-8801-01 (Lot 8801 - Pass Baseline)</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-300 font-mono">Spatial Signature Filter:</span>
          {(['edge_ring', 'center_cluster', 'scratch', 'repeating_pattern', 'none'] as const).map((sig) => (
            <button
              key={sig}
              onClick={() => setSignatureType(sig)}
              className={`px-2.5 py-1 rounded text-xs font-mono capitalize transition ${
                signatureType === sig
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-700 font-bold'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
              }`}
            >
              {sig.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Main Wafer Display Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Wafer Canvas Render (Left 2 cols) */}
        <div className={`bg-slate-900 border border-slate-800 rounded-xl p-6 ${compareMode ? 'lg:col-span-3' : 'lg:col-span-2'}`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm font-bold text-white font-mono flex items-center gap-2">
                {activeMap.waferSerial} Map ({activeMap.lotCode})
                <span className="text-xs bg-slate-800 text-cyan-400 px-2 py-0.5 rounded border border-slate-700">
                  Yield: {activeMap.yieldPercent}%
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Total Dies: {activeMap.passCount + activeMap.failCount} | Passed: {activeMap.passCount} | Failed: {activeMap.failCount}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {binsLegend.map((bin) => (
                <div key={bin.code} className="flex items-center gap-1 text-[10px] text-slate-300 font-mono">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: bin.color }}></span>
                  <span className="hidden sm:inline">{bin.label.split(' ')[0]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={`grid gap-6 ${compareMode ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
            {/* Active Wafer Circular Silicon Canvas */}
            <div className="flex flex-col items-center justify-center bg-slate-950 p-6 rounded-xl border border-slate-800 relative">
              <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-2">
                300mm Silicon Substrate Surface
              </div>

              {/* Silicon Wafer Circle Frame */}
              <div className="w-[320px] h-[320px] sm:w-[360px] sm:h-[360px] rounded-full border-4 border-slate-700 bg-slate-900/90 relative p-6 flex items-center justify-center shadow-2xl">
                {/* Die Grid Layout */}
                <div className="grid grid-cols-20 gap-[1px] w-full h-full p-2 items-center justify-center">
                  {activeMap.dieGrid.map((die) => (
                    <button
                      key={`die-${die.x}-${die.y}`}
                      onClick={() => setSelectedDie(die)}
                      style={{ backgroundColor: die.binColor }}
                      className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-[1px] transition-transform hover:scale-150 hover:z-20 ${
                        selectedDie?.x === die.x && selectedDie?.y === die.y
                          ? 'ring-2 ring-white scale-125 z-10'
                          : 'opacity-90'
                      }`}
                      title={`Die (${die.x}, ${die.y}) - ${die.binName}`}
                    />
                  ))}
                </div>

                {/* Wafer Notch Position at Bottom */}
                <div
                  className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-6 h-3 bg-slate-900 border-2 border-slate-600 rounded-b-full"
                  title="300mm Wafer Orientation Notch (Bottom)"
                />
              </div>

              <div className="mt-4 text-[11px] text-slate-400 font-mono text-center">
                Notch Position: <span className="text-cyan-300 font-bold">Bottom</span> | Spatial Signature: <span className="text-amber-400 font-bold capitalize">{signatureType.replace('_', ' ')}</span>
              </div>
            </div>

            {/* Comparison Wafer Circular Silicon Canvas (if compareMode) */}
            {compareMode && (
              <div className="flex flex-col items-center justify-center bg-slate-950 p-6 rounded-xl border border-slate-800 relative">
                <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-2">
                  Baseline Comparison Wafer: {compareMap.waferSerial}
                </div>

                <div className="w-[320px] h-[320px] sm:w-[360px] sm:h-[360px] rounded-full border-4 border-emerald-800/80 bg-slate-900/90 relative p-6 flex items-center justify-center shadow-2xl">
                  <div className="grid grid-cols-20 gap-[1px] w-full h-full p-2 items-center justify-center">
                    {compareMap.dieGrid.map((die) => (
                      <div
                        key={`comp-die-${die.x}-${die.y}`}
                        style={{ backgroundColor: die.binColor }}
                        className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-[1px]"
                      />
                    ))}
                  </div>

                  <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-6 h-3 bg-slate-900 border-2 border-slate-600 rounded-b-full" />
                </div>

                <div className="mt-4 text-[11px] text-slate-400 font-mono text-center">
                  Baseline Yield: <span className="text-emerald-400 font-bold">{compareMap.yieldPercent}%</span> | No Defect Cluster
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Die Inspector & Spatial Signature Details (Right Col) */}
        {!compareMode && (
          <div className="space-y-4">
            {/* Selected Die Detail Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <h2 className="text-xs font-bold text-slate-200 uppercase font-mono flex items-center gap-2">
                <Info className="w-4 h-4 text-cyan-400" />
                Die Inspector Coordinates & Result
              </h2>

              {selectedDie ? (
                <div className="space-y-3 bg-slate-950 p-4 rounded-lg border border-slate-800 text-xs">
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-slate-400">Coordinates (X, Y):</span>
                    <span className="font-bold text-cyan-300">
                      ({selectedDie.x}, {selectedDie.y})
                    </span>
                  </div>
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-slate-400">Bin Classification:</span>
                    <span className="font-bold" style={{ color: selectedDie.binColor }}>
                      {selectedDie.binName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-slate-400">Defect Category:</span>
                    <span className="text-slate-200 font-semibold">{selectedDie.defectClass || 'None'}</span>
                  </div>
                  {selectedDie.measurementValue && (
                    <div className="flex items-center justify-between font-mono">
                      <span className="text-slate-400">CD Measurement:</span>
                      <span className="font-bold text-white">{selectedDie.measurementValue} nm</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-6 bg-slate-950 rounded-lg border border-slate-800 text-center text-xs text-slate-500 font-mono">
                  Click any die square on the silicon wafer map to inspect detailed coordinates & defect class.
                </div>
              )}
            </div>

            {/* Spatial Pattern Analysis Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <h2 className="text-xs font-bold text-slate-200 uppercase font-mono flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-400" />
                Spatial Pattern Classification
              </h2>

              <div className="space-y-2 text-xs">
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono">
                  <div className="text-amber-300 font-bold">Detected Pattern: {signatureType.toUpperCase()}</div>
                  <p className="text-slate-400 mt-1 text-[11px]">
                    Algorithm Confidence: <span className="text-emerald-400 font-bold">96.8%</span>
                  </p>
                  <p className="text-slate-300 mt-2 text-[11px]">
                    Root-cause correlation links this pattern to Etch Chamber B gas distribution ring wear during ETCH-RIE-30.
                  </p>
                </div>

                <button
                  onClick={() => onNavigateTab('spc')}
                  className="w-full bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 font-medium text-xs py-2 rounded-lg transition"
                >
                  View SPC Control Chart Correlation
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
