/**
 * SiliconTrack - Semiconductor Quality, Production Intelligence & Traceability Platform
 * Main Application Component
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { Navigation, TabType } from './components/Navigation';
import { CommandCenterView } from './components/views/CommandCenterView';
import { Genealogy360View } from './components/views/Genealogy360View';
import { OperatorWorkQueueView } from './components/views/OperatorWorkQueueView';
import { InspectionWorkspaceView } from './components/views/InspectionWorkspaceView';
import { WaferMapView } from './components/views/WaferMapView';
import { SpcYieldView } from './components/views/SpcYieldView';
import { NcrMrbCapaView } from './components/views/NcrMrbCapaView';
import { IngestionMonitorView } from './components/views/IngestionMonitorView';
import { AuditAdminView } from './components/views/AuditAdminView';
import { AiAssistantView } from './components/views/AiAssistantView';

import {
  INITIAL_USERS,
  INITIAL_LOTS,
  INITIAL_HOLDS,
  INITIAL_NCRS,
  INITIAL_CAPAS,
  INITIAL_SPC_SIGNALS,
  INITIAL_SPC_POINTS,
  INITIAL_INTEGRATION_MESSAGES,
  INITIAL_AUDIT_LOGS,
  INITIAL_KPIS,
  INITIAL_EQUIPMENT,
  INITIAL_SPECIFICATIONS,
} from './data/seedData';
import { User, Lot, HoldRecord, NonconformanceRecord } from './types';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]); // Dr. Elena Vance (QA Manager)
  const [selectedSite, setSelectedSite] = useState<string>('Fab 1 - Dresden');
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const [lots, setLots] = useState<Lot[]>(INITIAL_LOTS);
  const [holds, setHolds] = useState<HoldRecord[]>(INITIAL_HOLDS);
  const [ncrs, setNcrs] = useState<NonconformanceRecord[]>(INITIAL_NCRS);
  const [capas, setCapas] = useState(INITIAL_CAPAS);
  const [selectedLotCode, setSelectedLotCode] = useState<string>('LOT-2026-8804');
  const [globalSearch, setGlobalSearch] = useState<string>('');

  // Handle Hold Release with Rationale & Electronic Signature
  const handleReleaseHold = (holdId: string, rationale: string, approverName: string) => {
    setHolds((prev) =>
      prev.map((h) =>
        h.holdCode === holdId || h.id === holdId
          ? {
              ...h,
              status: 'Released',
              releasedBy: approverName,
              releasedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
              releaseRationale: rationale,
            }
          : h
      )
    );

    // Also update associated lot status if all holds cleared
    setLots((prev) =>
      prev.map((l) =>
        l.activeHoldIds.includes(holdId)
          ? { ...l, status: 'processing', activeHoldIds: l.activeHoldIds.filter((id) => id !== holdId) }
          : l
      )
    );
  };

  // Handle MRB Quorum Approval Vote
  const handleApproveMRB = (
    ncrId: string,
    role: string,
    approverName: string,
    decision: 'Approved' | 'Rejected'
  ) => {
    setNcrs((prev) =>
      prev.map((ncr) =>
        ncr.id === ncrId
          ? {
              ...ncr,
              mrbApprovals: ncr.mrbApprovals.map((app) =>
                app.role === role
                  ? {
                      ...app,
                      approverName,
                      decision,
                      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
                      signatureHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
                    }
                  : app
              ),
              status: 'Dispositioned',
            }
          : ncr
      )
    );
  };

  const activeHoldsCount = holds.filter((h) => h.status === 'Active' || h.status === 'Under Investigation').length;
  const activeSignalsCount = INITIAL_SPC_SIGNALS.filter((s) => s.status === 'Active').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col antialiased selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Application Header */}
      <Header
        currentUser={currentUser}
        allUsers={INITIAL_USERS}
        onSelectUser={setCurrentUser}
        selectedSite={selectedSite}
        onSelectSite={setSelectedSite}
        activeHoldsCount={activeHoldsCount}
        activeSignalsCount={activeSignalsCount}
        searchQuery={globalSearch}
        onSearch={(query) => {
          setGlobalSearch(query);
          if (query.trim()) {
            setActiveTab('genealogy');
          }
        }}
      />

      {/* Main Tab Navigation */}
      <Navigation
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        activeHoldsCount={activeHoldsCount}
        openNCRsCount={ncrs.filter((n) => n.status !== 'Closed').length}
      />

      {/* Primary Workspace View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'overview' && (
          <CommandCenterView
            kpis={INITIAL_KPIS}
            lots={lots}
            holds={holds}
            signals={INITIAL_SPC_SIGNALS}
            onNavigateTab={setActiveTab}
            onSelectLot={(code) => {
              setSelectedLotCode(code);
              setActiveTab('genealogy');
            }}
          />
        )}

        {activeTab === 'genealogy' && (
          <Genealogy360View
            lots={lots}
            selectedLotCode={selectedLotCode}
            onSelectLot={setSelectedLotCode}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'operator' && (
          <OperatorWorkQueueView
            currentUser={currentUser}
            lots={lots}
            equipmentList={INITIAL_EQUIPMENT}
            onSelectLot={setSelectedLotCode}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'inspection' && (
          <InspectionWorkspaceView currentUser={currentUser} onNavigateTab={setActiveTab} />
        )}

        {activeTab === 'wafermap' && <WaferMapView onNavigateTab={setActiveTab} />}

        {activeTab === 'spc' && (
          <SpcYieldView
            signals={INITIAL_SPC_SIGNALS}
            points={INITIAL_SPC_POINTS}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'ncr_mrb' && (
          <NcrMrbCapaView
            currentUser={currentUser}
            holds={holds}
            ncrs={ncrs}
            capas={capas}
            onReleaseHold={handleReleaseHold}
            onApproveMRB={handleApproveMRB}
          />
        )}

        {activeTab === 'ingestion' && <IngestionMonitorView messages={INITIAL_INTEGRATION_MESSAGES} />}

        {activeTab === 'audit' && (
          <AuditAdminView logs={INITIAL_AUDIT_LOGS} specifications={INITIAL_SPECIFICATIONS} />
        )}

        {activeTab === 'ai_assistant' && <AiAssistantView onNavigateTab={setActiveTab} />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-4 text-xs">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 font-mono">
          <div>
            SILICONTRACK v2.0 - Semiconductor QA, Production Intelligence & End-to-End Traceability Platform
          </div>
          <div className="text-[11px] text-slate-500">
            CONFIDENTIAL - Internal Semiconductor Manufacturing Use | Built with React & Node
          </div>
        </div>
      </footer>
    </div>
  );
}
