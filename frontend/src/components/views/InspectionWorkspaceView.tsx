import React, { useState } from 'react';
import {
  CheckSquare,
  Upload,
  UserCheck,
  AlertCircle,
  CheckCircle,
  FileText,
  Paperclip,
  Send,
  ShieldCheck,
} from 'lucide-react';
import { User } from '../../types';

interface InspectionWorkspaceViewProps {
  currentUser: User;
  onNavigateTab: (tab: any) => void;
}

export const InspectionWorkspaceView: React.FC<InspectionWorkspaceViewProps> = ({
  currentUser,
  onNavigateTab,
}) => {
  const [selectedLotCode, setSelectedLotCode] = useState('LOT-2026-8801');
  const [sampleWafer, setSampleWafer] = useState('WAF-8801-01');
  const [parameterName, setParameterName] = useState('Critical Dimension (CD)');

  const [measuredValue, setMeasuredValue] = useState('14.05');
  const [verifierName, setVerifierName] = useState('Dr. Elena Vance');
  const [inspectionNotes, setInspectionNotes] = useState('5-point optical CD measurement verified using KLA 2935.');
  const [attachedFileName, setAttachedFileName] = useState<string | null>('KLA_2935_Spectrum_Trace.png');
  const [submitted, setSubmitted] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      alert(`Inspection Record for ${sampleWafer} on ${selectedLotCode} saved & verified by ${verifierName}!`);
    }, 1200);
  };

  const valNum = Number(measuredValue);
  const isOutOfSpec = valNum < 13.0 || valNum > 15.0;
  const isWarning = valNum < 13.3 || valNum > 14.7;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-cyan-400" />
            Inspection & Metrology Workspace
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            BRD Section 8.5: Guided Numeric/Categorical Result Capture, Second-Person Verification & Evidence Upload
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>QT-005 Second-Person Verifier Enabled</span>
        </div>
      </div>

      {/* Main Inspection Form Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Context Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-950 p-4 rounded-lg border border-slate-800">
            <div className="space-y-1">
              <label className="text-xs text-slate-400 block font-mono">Select Inspection Lot</label>
              <select
                value={selectedLotCode}
                onChange={(e) => setSelectedLotCode(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-xs font-mono text-cyan-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              >
                <option value="LOT-2026-8801">LOT-2026-8801 (Helios-7nm)</option>
                <option value="LOT-2026-8802">LOT-2026-8802 (Helios-7nm)</option>
                <option value="LOT-2026-8804">LOT-2026-8804 (Helios-7nm - Hold)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-400 block font-mono">Sample Wafer Serial</label>
              <select
                value={sampleWafer}
                onChange={(e) => setSampleWafer(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-xs font-mono text-white rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              >
                <option value="WAF-8801-01">WAF-8801-01 (Slot 1)</option>
                <option value="WAF-8801-05">WAF-8801-05 (Slot 5)</option>
                <option value="WAF-8801-12">WAF-8801-12 (Slot 12)</option>
                <option value="WAF-8804-01">WAF-8804-01 (Slot 1 - Edge Ring)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-400 block font-mono">Metrology Parameter</label>
              <select
                value={parameterName}
                onChange={(e) => setParameterName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-xs font-mono text-white rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              >
                <option value="Critical Dimension (CD)">Critical Dimension (CD) [nm]</option>
                <option value="Oxide Thickness">Oxide Thickness [Å]</option>
                <option value="Overlay Registration">Overlay Registration [nm]</option>
              </select>
            </div>
          </div>

          {/* Measured Value & Limit Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input Side */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-200 uppercase font-mono">Measurement Value Input</h3>

              <div className="space-y-1">
                <label className="text-xs text-slate-400 block font-mono">Numeric Measurement Result (nm)</label>
                <input
                  type="number"
                  step="0.01"
                  value={measuredValue}
                  onChange={(e) => setMeasuredValue(e.target.value)}
                  className={`w-full bg-slate-800 border rounded-lg p-3 text-sm font-mono text-white focus:outline-none ${
                    isOutOfSpec
                      ? 'border-rose-500 bg-rose-950/40 text-rose-300'
                      : isWarning
                      ? 'border-amber-500 bg-amber-950/40 text-amber-300'
                      : 'border-slate-700 focus:border-cyan-500'
                  }`}
                />
              </div>

              {/* Second Person Verification Requirement */}
              <div className="space-y-1 bg-slate-950 p-3 rounded-lg border border-slate-800">
                <label className="text-xs text-cyan-300 font-bold block font-mono flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                  Second-Person Verification Required (QT-005)
                </label>
                <select
                  value={verifierName}
                  onChange={(e) => setVerifierName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded p-1.5 font-mono"
                >
                  <option value="Dr. Elena Vance">Dr. Elena Vance (QA Manager)</option>
                  <option value="Kenji Sato">Kenji Sato (QA Engineer)</option>
                  <option value="Sarah Miller">Sarah Miller (Production Manager)</option>
                </select>
                <p className="text-[10px] text-slate-400 mt-1">
                  Verifier identity is cryptographically recorded in immutable audit log.
                </p>
              </div>
            </div>

            {/* Limits Evaluation Side */}
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-slate-200 uppercase font-mono">
                Specification & Control Limits Evaluation
              </h3>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 bg-slate-900 rounded border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">USL (SPEC HIGH)</span>
                  <span className="font-bold text-rose-400">15.00 nm</span>
                </div>
                <div className="p-2 bg-slate-900 rounded border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">LSL (SPEC LOW)</span>
                  <span className="font-bold text-rose-400">13.00 nm</span>
                </div>
                <div className="p-2 bg-slate-900 rounded border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">UCL (CONTROL HIGH)</span>
                  <span className="font-bold text-amber-400">14.70 nm</span>
                </div>
                <div className="p-2 bg-slate-900 rounded border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">LCL (CONTROL LOW)</span>
                  <span className="font-bold text-amber-400">13.30 nm</span>
                </div>
              </div>

              {/* Status Indicator */}
              <div
                className={`p-3 rounded-lg border text-xs flex items-center gap-2 font-mono ${
                  isOutOfSpec
                    ? 'bg-rose-950 border-rose-800 text-rose-300'
                    : isWarning
                    ? 'bg-amber-950 border-amber-800 text-amber-300'
                    : 'bg-emerald-950 border-emerald-800 text-emerald-300'
                }`}
              >
                {isOutOfSpec ? (
                  <>
                    <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    <div>
                      <div className="font-bold">OUT OF SPECIFICATION (FAIL)</div>
                      <p className="text-[10px] mt-0.5">Automated Hold will be initiated upon submit.</p>
                    </div>
                  </>
                ) : isWarning ? (
                  <>
                    <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
                    <div>
                      <div className="font-bold">CONTROL LIMIT WARNING</div>
                      <p className="text-[10px] mt-0.5">Value exceeds Control Limit UCL (14.70nm).</p>
                    </div>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <div className="font-bold">PASS - WITHIN CONTROL LIMITS</div>
                      <p className="text-[10px] mt-0.5">Target 14.00nm nominal center line.</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Notes & Evidence Attachment */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div className="space-y-1">
              <label className="text-xs text-slate-400 block font-mono">Inspector Remarks & Observations</label>
              <textarea
                rows={2}
                value={inspectionNotes}
                onChange={(e) => setInspectionNotes(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-xs font-mono text-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* File Attachment Upload */}
              <div className="flex items-center gap-2">
                <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition">
                  <Paperclip className="w-4 h-4 text-cyan-400" />
                  <span>Attach SEM/Spectrum Image</span>
                  <input type="file" onChange={handleFileUpload} className="hidden" />
                </label>
                {attachedFileName && (
                  <span className="text-xs text-cyan-400 font-mono bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
                    {attachedFileName}
                  </span>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitted}
                className={`px-5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition ${
                  submitted ? 'bg-emerald-600 text-white' : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow'
                }`}
              >
                {submitted ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Verified & Ingested!</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Save & Authorize Result</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
