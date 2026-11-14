import React from 'react';
import { 
  LayoutDashboard, 
  FileCheck2, 
  Layers, 
  BookOpen, 
  BarChart3, 
  ShieldAlert
} from 'lucide-react';
import { ChromePaperPlane, ChromeShield } from './ChromeIcons';

export type NavTab = 'dashboard' | 'studio' | 'reviews' | 'knowledge' | 'analytics' | 'audit';

interface Props {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  pendingReviewsCount: number;
}

export const Sidebar: React.FC<Props> = ({ currentTab, onTabChange, pendingReviewsCount }) => {
  const items = [
    {
      id: 'dashboard' as NavTab,
      label: 'Overview & Health',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'studio' as NavTab,
      label: 'Content Inspection',
      icon: FileCheck2,
      badge: 'BrandVault AI',
      badgeColor: 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
    },
    {
      id: 'reviews' as NavTab,
      label: 'Review & Approvals',
      icon: Layers,
      badge: pendingReviewsCount > 0 ? `${pendingReviewsCount}` : null,
      badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/40',
    },
    {
      id: 'knowledge' as NavTab,
      label: 'Brand Knowledge Base',
      icon: BookOpen,
      badge: null,
    },
    {
      id: 'analytics' as NavTab,
      label: 'Governance Analytics',
      icon: BarChart3,
      badge: null,
    },
    {
      id: 'audit' as NavTab,
      label: 'Audit & AI Disclosure',
      icon: ShieldAlert,
      badge: null,
    },
  ];

  return (
    <aside className="w-64 border-r border-white/[0.06] bg-[#09090c]/90 flex flex-col justify-between p-4 shrink-0 backdrop-blur-md">
      <div className="space-y-1.5">
        <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">
          Workspace Navigation
        </div>

        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#181822] text-white border border-white/15 shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-bold ${item.badgeColor || 'bg-slate-800 text-slate-300'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Cloudflare & Groq Architecture Banner */}
      <div className="p-4 rounded-3xl bg-[#0e0e14] border border-white/[0.06] text-[11px] space-y-2 shadow-inner">
        <div className="flex items-center gap-2 text-amber-400 font-bold font-mono text-xs">
          <ChromePaperPlane className="w-4 h-4" />
          <span>Active Pipeline</span>
        </div>
        <p className="text-slate-400 leading-relaxed text-[10px]">
          Multi-agent inspection powered by <strong>Groq API</strong> (<code className="text-amber-300 font-mono">openai/gpt-oss-120b</code>) with Cloudflare edge persistence.
        </p>
        <div className="pt-2 flex items-center justify-between text-[10px] text-slate-500 font-mono border-t border-white/5">
          <span>Latency: ~340ms</span>
          <span className="text-emerald-400 flex items-center gap-1 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Live
          </span>
        </div>
      </div>
    </aside>
  );
};
