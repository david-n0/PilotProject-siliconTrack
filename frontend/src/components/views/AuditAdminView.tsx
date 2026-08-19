import React, { useState } from 'react';
import {
  FileText,
  Search,
  Shield,
  Layers,
  History,
  Lock,
  UserCheck,
  Sliders,
} from 'lucide-react';
import { AuditLog, SpecificationLimit } from '../../types';

interface AuditAdminViewProps {
  logs: AuditLog[];
  specifications: SpecificationLimit[];
}

export const AuditAdminView: React.FC<AuditAdminViewProps> = ({ logs, specifications }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'audit' | 'specs' | 'rbac'>('audit');

  const filteredLogs = logs.filter(
    (l) =>
      l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.entityId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            Audit Trail, Specification Versioning & System Administration
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            BRD Section 8.12 & 17.3: Immutable Governance Log, Spec Revision Auditing & RBAC Permission Matrix
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700">
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
              activeTab === 'audit' ? 'bg-cyan-600 text-white shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            Audit Trail
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
              activeTab === 'specs' ? 'bg-cyan-600 text-white shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            Spec Versioning
          </button>
          <button
            onClick={() => setActiveTab('rbac')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
              activeTab === 'rbac' ? 'bg-cyan-600 text-white shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            RBAC Matrix
          </button>
        </div>
      </div>

      {/* AUDIT TAB */}
      {activeTab === 'audit' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <History className="w-4 h-4 text-cyan-400" />
              Immutable Audit Search Log
            </h2>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter logs by user, entity or action..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="p-3 rounded-l-lg">Timestamp</th>
                  <th className="p-3">User & Role</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Target Entity</th>
                  <th className="p-3">State Change / Rationale</th>
                  <th className="p-3 text-right rounded-r-lg">IP / Site</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3 text-slate-400">{log.timestamp}</td>
                    <td className="p-3">
                      <div className="font-bold text-white">{log.userName}</div>
                      <div className="text-[10px] text-cyan-400">{log.userRole}</div>
                    </td>
                    <td className="p-3 font-semibold text-cyan-300">{log.action}</td>
                    <td className="p-3 text-slate-300 font-bold">{log.entityId}</td>
                    <td className="p-3 max-w-xs truncate text-[11px] text-slate-300" title={log.reason}>
                      {log.previousState && `${log.previousState} ➔ `}
                      {log.newState}
                      {log.reason && ` (${log.reason})`}
                    </td>
                    <td className="p-3 text-right text-slate-400 text-[10px]">
                      {log.ipAddress} | {log.site}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SPECS TAB */}
      {activeTab === 'specs' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            Approved Specification & Limit Revisions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {specifications.map((spec) => (
              <div key={spec.id} className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-white text-sm">{spec.parameterName}</span>
                  <span className="bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded font-bold text-[10px]">
                    REV {spec.version}
                  </span>
                </div>
                <div className="text-slate-400">
                  Operation: <span className="text-cyan-300">{spec.operationCode}</span> | Product: {spec.productCode}
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div className="bg-slate-900 p-2 rounded border border-slate-800">
                    <span className="text-slate-500 block">TARGET</span>
                    <span className="font-bold text-white">{spec.target} {spec.unit}</span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded border border-slate-800">
                    <span className="text-slate-500 block">SPEC RANGE [LSL - USL]</span>
                    <span className="font-bold text-rose-400">{spec.lsl} - {spec.usl} {spec.unit}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RBAC MATRIX TAB */}
      {activeTab === 'rbac' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 text-xs font-mono">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            Role-Based Access Control (RBAC) Permission Matrix
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-slate-300">
              <thead className="bg-slate-800 text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="p-2.5">Role</th>
                  <th className="p-2.5">View Work Queue</th>
                  <th className="p-2.5">Enter Inspection</th>
                  <th className="p-2.5">Place Hold</th>
                  <th className="p-2.5">Release Hold</th>
                  <th className="p-2.5">MRB Signoff</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                <tr>
                  <td className="p-2.5 font-bold text-white">Operator</td>
                  <td className="p-2.5 text-emerald-400">✓ Allowed</td>
                  <td className="p-2.5 text-emerald-400">✓ Permitted</td>
                  <td className="p-2.5 text-rose-400">✗ Denied</td>
                  <td className="p-2.5 text-rose-400">✗ Denied</td>
                  <td className="p-2.5 text-rose-400">✗ Denied</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-white">QA Inspector</td>
                  <td className="p-2.5 text-emerald-400">✓ Allowed</td>
                  <td className="p-2.5 text-emerald-400">✓ Permitted</td>
                  <td className="p-2.5 text-emerald-400">✓ Request NCR</td>
                  <td className="p-2.5 text-rose-400">✗ Denied</td>
                  <td className="p-2.5 text-rose-400">✗ Denied</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-white">QA Manager</td>
                  <td className="p-2.5 text-emerald-400">✓ Allowed</td>
                  <td className="p-2.5 text-emerald-400">✓ Permitted</td>
                  <td className="p-2.5 text-emerald-400">✓ Full Hold</td>
                  <td className="p-2.5 text-emerald-400">✓ Sign Release</td>
                  <td className="p-2.5 text-emerald-400">✓ Quorum Vote</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
