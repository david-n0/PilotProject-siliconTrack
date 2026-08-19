import React, { useState } from 'react';
import {
  ShieldAlert,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Lock,
  Unlock,
  GitCommit,
  Layers,
  Send,
  HelpCircle,
  FileText,
  Key,
} from 'lucide-react';
import { HoldRecord, NonconformanceRecord, CAPARecord, User } from '../../types';

interface NcrMrbCapaViewProps {
  currentUser: User;
  holds: HoldRecord[];
  ncrs: NonconformanceRecord[];
  capas: CAPARecord[];
  onReleaseHold: (holdId: string, rationale: string, approverName: string) => void;
  onApproveMRB: (ncrId: string, role: string, approverName: string, decision: 'Approved' | 'Rejected') => void;
}

export const NcrMrbCapaView: React.FC<NcrMrbCapaViewProps> = ({
  currentUser,
  holds,
  ncrs,
  capas,
  onReleaseHold,
  onApproveMRB,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'holds' | 'ncr' | 'capa'>('ncr');
  const [selectedNcr, setSelectedNcr] = useState<NonconformanceRecord>(ncrs[0] || ncrs[0]);

  // Release Hold Modal state
  const [releaseHoldId, setReleaseHoldId] = useState<string | null>(null);
  const [releaseRationale, setReleaseRationale] = useState('');

  // 5 Whys State for current NCR
  const [whySteps, setWhySteps] = useState<string[]>(
    selectedNcr?.whys || [
      '1. Why did yield drop by 34%? -> Wafers exhibited heavy die breakdown at outer 15mm perimeter.',
      '2. Why outer perimeter breakdown? -> Plasma etch rate was 28% higher at wafer edge.',
      '3. Why higher edge etch rate? -> Focus ring seal thermal regulation degraded during plasma run.',
      '4. Why degraded focus ring? -> Fluorocarbon O-ring chemically degraded beyond service hours.',
      '5. Root Cause: Preventative maintenance schedule failed to adjust for corrosive fluorine gas hours.',
    ]
  );

  const [newWhyInput, setNewWhyInput] = useState('');

  const handleAddWhy = () => {
    if (!newWhyInput.trim()) return;
    setWhySteps([...whySteps, `${whySteps.length + 1}. ${newWhyInput}`]);
    setNewWhyInput('');
  };

  const handleHoldReleaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!releaseHoldId || !releaseRationale.trim()) {
      alert('Please enter a valid release rationale.');
      return;
    }
    onReleaseHold(releaseHoldId, releaseRationale, currentUser.name);
    setReleaseHoldId(null);
    setReleaseRationale('');
    alert(`Hold ${releaseHoldId} RELEASED successfully by ${currentUser.name}!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-500" />
            Holds, NCR, MRB & CAPA Governance Workspace
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            BRD Section 8.9 & 9.3: Automated Containment, 5 Whys Root Cause Analysis, Multi-Role MRB Signoff & Electronic Signatures
          </p>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700">
          <button
            onClick={() => setActiveSubTab('holds')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
              activeSubTab === 'holds'
                ? 'bg-cyan-600 text-white shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Holds ({holds.filter((h) => h.status === 'Active' || h.status === 'Under Investigation').length})
          </button>
          <button
            onClick={() => setActiveSubTab('ncr')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
              activeSubTab === 'ncr'
                ? 'bg-cyan-600 text-white shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            NCR & MRB ({ncrs.length})
          </button>
          <button
            onClick={() => setActiveSubTab('capa')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
              activeSubTab === 'capa'
                ? 'bg-cyan-600 text-white shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            CAPA Actions ({capas.length})
          </button>
        </div>
      </div>

      {/* HOLDS SUBTAB */}
      {activeSubTab === 'holds' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-rose-400" />
              Active Material Holds & Containment Scope
            </h2>
            <span className="text-xs text-slate-400 font-mono">BRD Requirement NC-001</span>
          </div>

          <div className="space-y-4">
            {holds.map((hold) => (
              <div
                key={hold.id}
                className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-rose-400 text-sm">{hold.holdCode}</span>
                    <span className="font-mono text-cyan-300 text-xs font-bold">Lot: {hold.lotCode}</span>
                    <span className="text-[10px] bg-rose-950 text-rose-300 border border-rose-800 px-2 py-0.5 rounded font-bold">
                      {hold.severity}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-slate-400">
                    Initiated: <span className="text-slate-200">{hold.initiatedAt}</span> by {hold.initiatedBy}
                  </div>
                </div>

                <p className="text-xs text-slate-300">{hold.reason}</p>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                  <div className="text-xs font-mono text-slate-400">
                    Affected Wafers Scope: <span className="text-white font-bold">{hold.affectedPopulationCount} Wafers</span> ({hold.waferSerials.join(', ')})
                  </div>

                  {hold.status !== 'Released' ? (
                    <button
                      onClick={() => setReleaseHoldId(hold.holdCode)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition shadow"
                    >
                      <Unlock className="w-3.5 h-3.5" />
                      <span>Release Hold (Electronic Signature)</span>
                    </button>
                  ) : (
                    <span className="text-xs text-emerald-400 font-bold font-mono flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> RELEASED
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NCR & MRB SUBTAB */}
      {activeSubTab === 'ncr' && selectedNcr && (
        <div className="space-y-6">
          {/* NCR Overview Header Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-mono font-bold text-rose-400">{selectedNcr.ncrCode}</span>
                  <span className="text-xs bg-purple-950 text-purple-300 border border-purple-800 px-2.5 py-0.5 rounded font-bold font-mono">
                    Status: {selectedNcr.status}
                  </span>
                  <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono border border-slate-700">
                    Lot: {selectedNcr.lotCode}
                  </span>
                </div>
                <h2 className="text-xs text-slate-300 mt-1 font-medium">{selectedNcr.problemStatement}</h2>
              </div>

              <div className="text-right text-xs font-mono">
                <span className="text-slate-400 block text-[10px]">CURRENT DISPOSITION</span>
                <span className="text-sm font-bold text-cyan-300">{selectedNcr.disposition}</span>
              </div>
            </div>

            {/* 5 Whys Root Cause Analysis Interactive Tool */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-300 font-mono flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-cyan-400" />
                Structured 5 Whys Root Cause Analysis
              </h3>

              <div className="space-y-2 bg-slate-950 p-4 rounded-lg border border-slate-800">
                {whySteps.map((step, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-900 rounded border border-slate-800 text-xs font-mono text-slate-200">
                    {step}
                  </div>
                ))}

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="Add next why step..."
                    value={newWhyInput}
                    onChange={(e) => setNewWhyInput(e.target.value)}
                    className="flex-1 bg-slate-800 border border-slate-700 text-xs font-mono text-white rounded p-1.5 focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    onClick={handleAddWhy}
                    className="bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs px-3 py-1.5 rounded transition"
                  >
                    Add Why Step
                  </button>
                </div>
              </div>
            </div>

            {/* Fishbone Diagram Summary */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-slate-400" />
                Ishikawa / Fishbone Category Summary
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-cyan-400 font-bold block mb-1">1. MACHINE</span>
                  <ul className="text-slate-300 text-[11px] list-disc list-inside space-y-1">
                    {selectedNcr.fishbone?.machine.map((m, i) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-cyan-400 font-bold block mb-1">2. METHOD</span>
                  <ul className="text-slate-300 text-[11px] list-disc list-inside space-y-1">
                    {selectedNcr.fishbone?.method.map((m, i) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-cyan-400 font-bold block mb-1">3. MATERIAL</span>
                  <ul className="text-slate-300 text-[11px] list-disc list-inside space-y-1">
                    {selectedNcr.fishbone?.material.map((m, i) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* MRB Quorum Approval Workflow & Electronic Signatures */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                Material Review Board (MRB) Quorum Approvals & Electronic Signatures
              </h3>

              <div className="space-y-3">
                {selectedNcr.mrbApprovals.map((app, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-bold text-white font-mono flex items-center gap-2">
                        <span>{app.role}:</span>
                        <span className="text-cyan-300">{app.approverName}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.2 rounded font-mono ${
                            app.decision === 'Approved'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}
                        >
                          {app.decision}
                        </span>
                      </div>
                      <p className="text-slate-400 mt-1 text-[11px]">{app.rationale}</p>
                      {app.signatureHash && (
                        <div className="text-[10px] text-slate-500 font-mono mt-1 flex items-center gap-1">
                          <Key className="w-3 h-3 text-emerald-400" />
                          <span>SHA-256 Signature Hash: {app.signatureHash.substring(0, 32)}...</span>
                        </div>
                      )}
                    </div>

                    {app.decision !== 'Approved' && (
                      <button
                        onClick={() => onApproveMRB(selectedNcr.id, app.role, currentUser.name, 'Approved')}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-1.5 rounded transition shrink-0"
                      >
                        Sign & Approve ({currentUser.role})
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CAPA SUBTAB */}
      {activeSubTab === 'capa' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-cyan-400" />
              CAPA Corrective & Preventive Action Tracker
            </h2>
            <span className="text-xs text-slate-400 font-mono">BRD Requirement NC-009</span>
          </div>

          <div className="space-y-4">
            {capas.map((capa) => (
              <div key={capa.id} className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-3 text-xs font-mono">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-cyan-300 text-sm">{capa.capaCode}</span>
                    <span className="text-slate-400 text-xs">Origin NCR: {capa.ncrCode}</span>
                  </div>
                  <span className="bg-purple-950 text-purple-300 border border-purple-800 px-2 py-0.5 rounded font-bold text-[10px]">
                    STATUS: {capa.status}
                  </span>
                </div>

                <div className="font-semibold text-white">{capa.title}</div>
                <div className="text-slate-400">Owner: {capa.ownerName} | Target Verification: {capa.targetEffectivenessDate}</div>

                <div className="space-y-2 pt-1">
                  <div className="font-bold text-cyan-400 text-[11px]">Corrective Actions:</div>
                  {capa.correctiveActions.map((ca) => (
                    <div key={ca.id} className="p-2 bg-slate-900 rounded border border-slate-800 flex items-center justify-between text-[11px]">
                      <span>{ca.description} (Assignee: {ca.assignee})</span>
                      <span className="text-emerald-400 font-bold">{ca.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Release Hold Modal */}
      {releaseHoldId && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Unlock className="w-4 h-4 text-emerald-400" />
                Electronic Hold Release Signoff: {releaseHoldId}
              </h3>
              <button onClick={() => setReleaseHoldId(null)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleHoldReleaseSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-mono block">Release Rationale & Quality Justification</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Enter detailed rationale for releasing hold..."
                  value={releaseRationale}
                  onChange={(e) => setReleaseRationale(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-xs font-mono text-white rounded-lg p-2.5 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="p-3 bg-slate-950 rounded border border-slate-800 text-[10px] text-slate-400 font-mono">
                Signing as: <span className="text-cyan-300 font-bold">{currentUser.name} ({currentUser.role})</span>
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReleaseHoldId(null)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded transition"
                >
                  Confirm & Sign Release
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
