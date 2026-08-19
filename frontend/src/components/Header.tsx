import React, { useState } from 'react';
import {
  Cpu,
  ShieldCheck,
  Search,
  Bell,
  Activity,
  User,
  ChevronDown,
  AlertTriangle,
  Building,
  CheckCircle,
} from 'lucide-react';
import { UserRole, User as UserType } from '../types';

interface HeaderProps {
  currentUser: UserType;
  allUsers: UserType[];
  onSelectUser: (user: UserType) => void;
  selectedSite: string;
  onSelectSite: (site: string) => void;
  activeHoldsCount: number;
  activeSignalsCount: number;
  onSearch: (query: string) => void;
  searchQuery: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  allUsers,
  onSelectUser,
  selectedSite,
  onSelectSite,
  activeHoldsCount,
  activeSignalsCount,
  onSearch,
  searchQuery,
}) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const sites = ['Fab 1 - Dresden', 'Fab 2 - Hsinchu', 'Fab 3 - Austin'];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-cyan-600 to-blue-600 p-2 rounded-lg shadow-sm border border-cyan-400/30">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-wider text-lg text-white font-mono">
                SILICONTRACK
              </span>
              <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800 px-1.5 py-0.5 rounded font-mono font-medium">
                v2.0 BRD
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Semiconductor QA & End-to-End Traceability
            </p>
          </div>
        </div>

        {/* Site Selector & Global Search */}
        <div className="flex items-center gap-3 flex-1 max-w-md mx-2">
          <div className="relative">
            <select
              value={selectedSite}
              onChange={(e) => onSelectSite(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-medium cursor-pointer"
            >
              {sites.map((site) => (
                <option key={site} value={site}>
                  {site}
                </option>
              ))}
            </select>
          </div>

          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Lot, Wafer, Equipment, Spec, NCR..."
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700/80 rounded-md pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 font-mono"
            />
          </div>
        </div>

        {/* Edge Gateway Status & Notifications & Role Switcher */}
        <div className="flex items-center gap-3">
          {/* Edge Heartbeat */}
          <div className="hidden lg:flex items-center gap-2 text-xs bg-slate-800/60 border border-slate-700/60 px-2.5 py-1 rounded-md text-slate-300">
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Edge Gateway:</span>
            <span className="text-emerald-400 font-medium">Synced (3ms)</span>
          </div>

          {/* Notifications button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-1.5 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md border border-slate-700 transition"
              title="System Alerts & Active Holds"
            >
              <Bell className="w-4 h-4" />
              {activeHoldsCount + activeSignalsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-bounce">
                  {activeHoldsCount + activeSignalsCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-lg shadow-xl p-3 z-50 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="font-semibold text-slate-200">Quality Alerts & Holds</span>
                  <span className="text-[10px] text-slate-400">BRD Severity Escalation</span>
                </div>
                <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
                  <div className="p-2 bg-rose-950/60 border border-rose-800/80 rounded flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-rose-300">S1 Critical Hold: HLD-2026-0941</div>
                      <p className="text-slate-300 mt-0.5">LOT-2026-8804 held due to Etch Chamber B pressure excursion.</p>
                      <span className="text-[10px] text-rose-400 block mt-1">Target Response: &lt; 15 mins</span>
                    </div>
                  </div>
                  <div className="p-2 bg-amber-950/60 border border-amber-800/80 rounded flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-amber-300">S2 High Signal: CP1 Threshold Shift</div>
                      <p className="text-slate-300 mt-0.5">LOT-2026-8802 sheet resistance Nelson Rule 2 violated.</p>
                      <span className="text-[10px] text-amber-400 block mt-1">Target Response: Same Shift</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md px-2.5 py-1 text-xs transition"
            >
              <div className="w-5 h-5 rounded-full bg-cyan-600 text-white font-bold flex items-center justify-center text-[10px]">
                {currentUser.name.charAt(0)}
              </div>
              <div className="text-left hidden sm:block">
                <div className="font-medium text-slate-200 leading-tight">{currentUser.name}</div>
                <div className="text-[10px] text-cyan-400 leading-tight font-mono">{currentUser.role}</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-lg shadow-xl p-2 z-50">
                <div className="px-2 py-1.5 border-b border-slate-800 text-[10px] uppercase font-mono text-slate-400 font-semibold">
                  Switch Active Role (BRD Personas)
                </div>
                <div className="mt-1 space-y-1 max-h-64 overflow-y-auto">
                  {allUsers.map((usr) => (
                    <button
                      key={usr.id}
                      onClick={() => {
                        onSelectUser(usr);
                        setShowRoleMenu(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded text-xs flex items-center justify-between transition ${
                        usr.id === currentUser.id
                          ? 'bg-cyan-950/80 text-cyan-300 font-medium border border-cyan-800/60'
                          : 'hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <div>
                        <div>{usr.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{usr.role}</div>
                      </div>
                      {usr.id === currentUser.id && <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />}
                    </button>
                  ))}
                  <div className="border-t border-slate-800 mt-1 pt-1">
                    <button
                      onClick={() => {
                        import('../../lib/firebase').then(m => m.logout());
                        setShowRoleMenu(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded text-xs text-rose-400 hover:bg-slate-800 transition flex items-center justify-between font-medium"
                    >
                      Sign Out (Google)
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
