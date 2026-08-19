import React from 'react';
import {
  LayoutDashboard,
  GitFork,
  ClipboardList,
  CheckSquare,
  Disc,
  LineChart,
  ShieldAlert,
  Radio,
  FileText,
  Sparkles,
} from 'lucide-react';

export type TabType =
  | 'overview'
  | 'genealogy'
  | 'operator'
  | 'inspection'
  | 'wafermap'
  | 'spc'
  | 'ncr_mrb'
  | 'ingestion'
  | 'audit'
  | 'ai_assistant';

interface NavigationProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  activeHoldsCount: number;
  openNCRsCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  activeHoldsCount,
  openNCRsCount,
}) => {
  const tabs: { id: TabType; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'overview', label: 'Command Center', icon: LayoutDashboard },
    { id: 'genealogy', label: 'Lot/Wafer 360 & Genealogy', icon: GitFork },
    { id: 'operator', label: 'Operator Work Queue', icon: ClipboardList },
    { id: 'inspection', label: 'Inspection Workspace', icon: CheckSquare },
    { id: 'wafermap', label: 'Wafer & Defect Maps', icon: Disc },
    { id: 'spc', label: 'SPC & Yield Explorer', icon: LineChart },
    { id: 'ncr_mrb', label: 'Holds, MRB & CAPA', icon: ShieldAlert, badge: activeHoldsCount + openNCRsCount },
    { id: 'ingestion', label: 'Edge & Ingestion', icon: Radio },
    { id: 'audit', label: 'Audit & Admin', icon: FileText },
    { id: 'ai_assistant', label: 'AI Quality Assistant', icon: Sparkles },
  ];

  return (
    <nav className="bg-slate-900 border-b border-slate-800 text-slate-300 px-4">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-x-1 gap-y-2 py-2">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onSelectTab(t.id)}
              className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/80 shadow-sm font-semibold'
                  : 'hover:bg-slate-800/60 hover:text-slate-100 text-slate-400'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span>{t.label}</span>
              {t.badge !== undefined && t.badge > 0 && (
                <span className="ml-1 bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {t.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
