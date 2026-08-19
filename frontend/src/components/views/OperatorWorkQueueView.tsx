import React, { useState } from 'react';
import {
  ClipboardList,
  Scan,
  AlertTriangle,
  CheckCircle,
  Play,
  Lock,
  FileText,
  Sliders,
  Send,
} from 'lucide-react';
import { Lot, Equipment, User } from '../../types';

interface OperatorWorkQueueViewProps {
  currentUser: User;
  lots: Lot[];
  equipmentList: Equipment[];
  onSelectLot: (lotCode: string) => void;
  onNavigateTab: (tab: any) => void;
}

export const OperatorWorkQueueView: React.FC<OperatorWorkQueueViewProps> = ({
  currentUser,
  lots,
  equipmentList,
  onSelectLot,
  onNavigateTab,
}) => {
  const [selectedEquipmentId, setSelectedEquipmentId] = useState('eq-litho-01');
  const [scannedBarcode, setScannedBarcode] = useState('');
  const [activeCheckLot, setActiveCheckLot] = useState<Lot | null>(lots[0]);

  // Operational Parameter Inputs
  const [cdInput, setCdInput] = useState('14.05');
  const [doseInput, setDoseInput] = useState('24.5');
  const [checkSubmitted, setCheckSubmitted] = useState(false);

  const selectedEquipment = equipmentList.find((e) => e.id === selectedEquipmentId) || equipmentList[0];

  const handleScanBarcode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scannedBarcode.trim()) return;
    const match = lots.find((l) => l.lotCode.toLowerCase() === scannedBarcode.toLowerCase() || l.carrierId?.toLowerCase() === scannedBarcode.toLowerCase());
    if (match) {
      setActiveCheckLot(match);
      alert(`Barcode Scanned Successfully! Matched Lot ${match.lotCode} in Carrier ${match.carrierId}.`);
    } else {
      alert(`No matching lot found for scanned barcode "${scannedBarcode}". Try scanning LOT-2026-8801 or FOUP-A102.`);
    }
  };

  const handleCheckSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeCheckLot?.status === 'hold') {
      alert(`ERROR: Lot ${activeCheckLot.lotCode} is on active HOLD! Execution blocked per BRD Rule BR-001.`);
      return;
    }
    setCheckSubmitted(true);
    setTimeout(() => {
      setCheckSubmitted(false);
      alert(`Parameter Check for ${activeCheckLot?.lotCode} recorded successfully! Ingested into SiliconTrack database.`);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-cyan-400" />
            Operator Work Queue & Workstation
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            BRD Section 8.3: Work Queue by Equipment, Barcode Scanner Integration, Instruction Display & Parameter Capture
          </p>
        </div>

        {/* Equipment Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Assigned Tool:</span>
          <select
            value={selectedEquipmentId}
            onChange={(e) => setSelectedEquipmentId(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-cyan-300 font-mono text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          >
            {equipmentList.map((eq) => (
              <option key={eq.id} value={eq.id}>
                {eq.code} ({eq.type})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Barcode Scanner Simulator */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-cyan-950 p-2.5 rounded-lg border border-cyan-800">
            <Scan className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="font-bold text-white text-xs">Simulate Barcode / RFID Scanner</div>
            <p className="text-[11px] text-slate-400">Scan FOUP carrier or wafer lot label for fast workstation check-in</p>
          </div>
        </div>

        <form onSubmit={handleScanBarcode} className="flex items-center gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Scan FOUP-A102 or LOT-2026-8801..."
            value={scannedBarcode}
            onChange={(e) => setScannedBarcode(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 rounded-lg px-3 py-1.5 font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500 w-full md:w-64"
          />
          <button
            type="submit"
            className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium px-3.5 py-1.5 rounded-lg transition"
          >
            Simulate Scan
          </button>
        </form>
      </div>

      {/* Main Workstation Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Work Queue List */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
              Assigned Queue: {selectedEquipment.code}
            </h2>
            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
              {lots.length} Lots Queued
            </span>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {lots.map((lot) => {
              const isSelected = activeCheckLot?.id === lot.id;
              const isOnHold = lot.status === 'hold';

              return (
                <div
                  key={lot.id}
                  onClick={() => {
                    setActiveCheckLot(lot);
                    onSelectLot(lot.lotCode);
                  }}
                  className={`p-3 rounded-lg border text-xs cursor-pointer transition ${
                    isSelected
                      ? 'bg-cyan-950/80 border-cyan-500 text-white shadow'
                      : isOnHold
                      ? 'bg-rose-950/40 border-rose-800/80 text-rose-200'
                      : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono">
                    <span className="font-bold text-cyan-300">{lot.lotCode}</span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        isOnHold
                          ? 'bg-rose-900 text-rose-300'
                          : lot.priority === 'Hot Rush'
                          ? 'bg-amber-900 text-amber-300'
                          : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {isOnHold ? 'HOLD' : lot.priority}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300 mt-1">{lot.productName}</div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 font-mono">
                    <span>FOUP: {lot.carrierId}</span>
                    <span>{lot.quantityWafers} Wafers</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Columns: Active Workstation & Parameter Entry */}
        <div className="lg:col-span-2 space-y-4">
          {activeCheckLot ? (
            <>
              {/* Hold Warning Banner */}
              {activeCheckLot.status === 'hold' && (
                <div className="bg-rose-950 border-2 border-rose-600 p-4 rounded-xl text-rose-200 space-y-2 animate-pulse">
                  <div className="flex items-center gap-2 font-bold text-sm text-rose-300">
                    <AlertTriangle className="w-5 h-5 text-rose-400" />
                    <span>CRITICAL HOLD ACTIVE: EXECUTION BLOCKED (BRD Rule BR-001)</span>
                  </div>
                  <p className="text-xs text-rose-200">
                    Lot {activeCheckLot.lotCode} is under active S1 Critical Hold HLD-2026-0941. Processing through workstation is prohibited until MRB release approval is signed.
                  </p>
                  <button
                    onClick={() => onNavigateTab('ncr_mrb')}
                    className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold px-3 py-1 rounded transition mt-1"
                  >
                    Go to MRB Approval
                  </button>
                </div>
              )}

              {/* Workstation Details & Instructions */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h2 className="text-sm font-bold text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-cyan-400" />
                      Current Operational Instructions: {activeCheckLot.currentOperationName}
                    </h2>
                    <p className="text-xs text-slate-400">
                      Recipe: <span className="font-mono text-cyan-300">REC-LITHO-7NM-V3</span> | Effective Spec Rev 2.1
                    </p>
                  </div>
                  <span className="text-xs font-mono bg-slate-800 text-slate-300 px-2.5 py-1 rounded border border-slate-700">
                    {activeCheckLot.currentOperationCode}
                  </span>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 text-xs text-slate-300 space-y-2">
                  <div className="font-semibold text-cyan-300">Cleanroom Execution Steps:</div>
                  <ol className="list-decimal list-inside space-y-1 text-slate-300 text-[11px] font-mono">
                    <li>Verify FOUP docking seal and carrier load lock pressure (&lt; 10^-5 Torr).</li>
                    <li>Inspect reticle alignment mask calibration code REC-LITHO-7NM-V3.</li>
                    <li>Measure 5-point inline Critical Dimension linewidth (Target 14.00nm, LSL 13.0nm, USL 15.0nm).</li>
                    <li>Record exposure dose energy (mJ/cm²) into SiliconTrack below before releasing track run.</li>
                  </ol>
                </div>

                {/* Parameter Entry Form */}
                <form onSubmit={handleCheckSubmit} className="space-y-4 pt-2">
                  <h3 className="text-xs font-bold text-slate-200 uppercase font-mono flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                    Inline Parameter Check Entry
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs text-slate-400 block font-mono">
                        Critical Dimension CD (nm) <span className="text-slate-500">(Target: 14.0nm)</span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={cdInput}
                        onChange={(e) => setCdInput(e.target.value)}
                        className={`w-full bg-slate-800 border rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none ${
                          Number(cdInput) < 13.0 || Number(cdInput) > 15.0
                            ? 'border-rose-500 text-rose-300 bg-rose-950/40'
                            : 'border-slate-700 focus:border-cyan-500'
                        }`}
                      />
                      {Number(cdInput) < 13.0 || Number(cdInput) > 15.0 ? (
                        <span className="text-[10px] text-rose-400 font-mono block">
                          ⚠️ SPEC VIOLATION: Outside [13.0 - 15.0nm] Spec Limits
                        </span>
                      ) : (
                        <span className="text-[10px] text-emerald-400 font-mono block">
                          ✓ Within Specification Limits
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs text-slate-400 block font-mono">
                        Exposure Dose (mJ/cm²) <span className="text-slate-500">(Target: 24.5 mJ)</span>
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={doseInput}
                        onChange={(e) => setDoseInput(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="text-[11px] text-slate-400 font-mono">
                      Operator: <span className="text-slate-200">{currentUser.name} ({currentUser.role})</span>
                    </div>

                    <button
                      type="submit"
                      disabled={activeCheckLot.status === 'hold' || checkSubmitted}
                      className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition ${
                        activeCheckLot.status === 'hold'
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                          : checkSubmitted
                          ? 'bg-emerald-600 text-white'
                          : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow'
                      }`}
                    >
                      {checkSubmitted ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span>Submitted!</span>
                        </>
                      ) : activeCheckLot.status === 'hold' ? (
                        <>
                          <Lock className="w-4 h-4" />
                          <span>Hold Blocked</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Submit & Confirm Step</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400 text-xs">
              Select a lot from the work queue to begin workstation check-in.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
