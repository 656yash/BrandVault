import React from 'react';
import { 
  LayoutDashboard, 
  FileCheck2, 
  Layers, 
  BookOpen, 
  BarChart3, 
  FileCode2, 
  ShieldAlert,
  Sparkles
} from 'lucide-react';

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
      badgeColor: 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30',
    },
    {
      id: 'reviews' as NavTab,
      label: 'Review & Approvals',
      icon: Layers,
      badge: pendingReviewsCount > 0 ? `${pendingReviewsCount}` : null,
      badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
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
      label: 'Audit & AI Transparency',
      icon: ShieldAlert,
      badge: null,
    },
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-900/50 flex flex-col justify-between p-4 shrink-0">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">
          Brand Governance OS
        </div>

        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold ${item.badgeColor || 'bg-slate-800 text-slate-300'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Cloudflare & Groq Architecture Banner */}
      <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-[11px] space-y-2">
        <div className="flex items-center gap-1.5 text-indigo-400 font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Active Pipeline</span>
        </div>
        <p className="text-slate-400 leading-relaxed text-[10px]">
          Multi-agent inspection powered by <strong>Groq API</strong> (<code className="text-indigo-300">openai/gpt-oss-120b</code>) with Cloudflare edge persistence.
        </p>
        <div className="pt-1 flex items-center justify-between text-[10px] text-slate-500 font-mono">
          <span>Latency: ~340ms</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> Live
          </span>
        </div>
      </div>
    </aside>
  );
};
