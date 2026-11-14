import React from 'react';
import { 
  FileText, 
  CheckCircle2, 
  ArrowUpRight, 
  Clock, 
  Sparkles,
  TrendingUp,
  Cpu,
  Layers,
  ShieldCheck,
  Check,
  Trash2,
  Activity,
  Eye,
  Package
} from 'lucide-react';
import type { ContentItem, GovernanceMetrics, BrandWorkspace } from '@brandvault/shared';
import { 
  ChromeShield, 
  ChromePaperPlane, 
  ChromeAvatar, 
  TiltedSticker, 
  CircularToolBadge,
  OutlinePenTool,
  OutlineBezierNodes,
  OutlineEyedropper,
  OutlineMagicWand
} from '../components/ChromeIcons';

interface Props {
  brand?: BrandWorkspace | null;
  contentItems: ContentItem[];
  metrics: GovernanceMetrics;
  onOpenContent: (contentId: string) => void;
  onNewScan: () => void;
  onDeleteContent?: (contentId: string) => void;
}

export const Dashboard: React.FC<Props> = ({ 
  brand,
  contentItems, 
  metrics, 
  onOpenContent, 
  onNewScan,
  onDeleteContent
}) => {
  return (
    <div className="relative space-y-8 pb-16">
      {/* Hero Header with Adwise Real-time Status Pills */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <ChromeShield className="w-10 h-10 filter drop-shadow-[0_4px_10px_rgba(205,180,219,0.5)]" />
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight font-sans">
                Dashboard Overview
              </h1>
              <p className="text-xs text-slate-600 font-medium">
                Automated brand governance and compliance pre-flight intelligence.
              </p>
            </div>
          </div>
        </div>

        {/* Real-time Cards (identical pattern to Adwise DashboardOverview.jsx) */}
        <div className="flex items-center gap-4">
          <div className="glass-panel px-5 py-2.5 flex items-center gap-3.5 bg-blue-sky/25 border-blue-soft/40 shadow-sm">
            <div className="relative">
              <Activity className="w-5 h-5 text-blue-600" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Scanned</p>
              <p className="text-lg font-black text-slate-800">{metrics.totalScanned}</p>
            </div>
          </div>

          <div className="glass-panel-alt px-5 py-2.5 flex items-center gap-3.5 bg-pink-soft/25 border-pink-rose/40 shadow-sm">
            <Eye className="w-5 h-5 text-pink-600" />
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Approved Collateral</p>
              <p className="text-lg font-black text-slate-800">{metrics.approvedCount}</p>
            </div>
          </div>

          <button
            onClick={onNewScan}
            className="glass-button flex items-center gap-2 px-6 py-3 rounded-full text-slate-900 font-bold text-xs shadow-lg hover:scale-105 transition-all cursor-pointer"
          >
            <ChromePaperPlane className="w-4 h-4 text-slate-900" />
            <span>Inspect New Content</span>
          </button>
        </div>
      </div>

      {/* KPI Section using Adwise asymmetric glass cards */}
      <div>
        <h2 className="text-base font-bold text-slate-800 mb-3 ml-1 tracking-tight">Compliance &amp; Health Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {[
            { label: 'Overall Brand Health', value: `${metrics.overallComplianceHealth} / 100`, sub: 'Cross-departmental safety score', icon: ShieldCheck, color: 'text-pink-600', bg: 'bg-pink-100' },
            { label: 'Pre-Flight Scans', value: `${metrics.totalScanned} assets`, sub: 'Evaluated before release', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-100' },
            { label: 'Approved & Sealed', value: `${metrics.approvedCount} items`, sub: 'Stamped with cryptographic seals', icon: CheckCircle2, color: 'text-purple-600', bg: 'bg-purple-100' },
            { label: 'Avg Turnaround', value: `${metrics.avgResolutionTimeHours} hours`, sub: '65% reduction via 1-click fixes', icon: Clock, color: 'text-indigo-600', bg: 'bg-indigo-100' },
          ].map((kpi, i) => (
            <div 
              key={i} 
              className={`${i % 2 === 0 ? 'glass-panel' : 'glass-panel-alt'} p-5 hover:scale-[1.02] transition-transform duration-300 shadow-sm`}
            >
              <div className="flex items-center gap-3.5 mb-3">
                <div className={`p-3 rounded-2xl ${kpi.bg} shadow-sm`}>
                  <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{kpi.label}</div>
                  <div className="text-xl font-black text-slate-800 tracking-tight font-mono">{kpi.value}</div>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                {kpi.sub}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Multi-Agent Compliance Badges in Adwise Glass Panel */}
      <div className="glass-panel p-6 space-y-5 shadow-lg">
        <div className="flex items-center justify-between border-b border-white/40 pb-3">
          <div className="flex items-center gap-2.5">
            <ChromePaperPlane className="w-5 h-5" />
            <div>
              <div className="text-sm font-bold text-slate-800 tracking-tight">Active Compliance Agents</div>
              <div className="text-[11px] text-slate-600">Sub-second multi-agent inspection powered by Groq (openai/gpt-oss-120b)</div>
            </div>
          </div>
          <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-white/70 text-slate-700 border border-white font-bold shadow-sm">
            Latency ~340ms • Zero-Retention
          </span>
        </div>

        {/* 5 Circular Tool Badges with Pastel Rings */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 pt-1">
          <CircularToolBadge
            title="Tone & Voice"
            label="Persona Adherence"
            percentage={92}
            iconBgColor="rgba(255, 255, 255, 0.7)"
            iconContent={<span className="text-xs font-mono font-bold text-pink-600">92%</span>}
          />
          <CircularToolBadge
            title="Terminology"
            label="Dictionary Purity"
            percentage={85}
            iconBgColor="rgba(255, 255, 255, 0.7)"
            iconContent={<span className="text-xs font-mono font-bold text-purple-600">85%</span>}
          />
          <CircularToolBadge
            title="Fact Verification"
            label="Corporate Source"
            percentage={96}
            iconBgColor="rgba(255, 255, 255, 0.7)"
            iconContent={<span className="text-xs font-mono font-bold text-blue-600">96%</span>}
          />
          <CircularToolBadge
            title="Claims Legality"
            label="Audit Proof"
            percentage={79}
            iconBgColor="rgba(255, 255, 255, 0.7)"
            iconContent={<span className="text-xs font-mono font-bold text-indigo-600">79%</span>}
          />
          <CircularToolBadge
            title="Visual & A11y"
            label="WCAG 2.1 AA"
            percentage={91}
            iconBgColor="rgba(255, 255, 255, 0.7)"
            iconContent={<span className="text-xs font-mono font-bold text-emerald-600">91%</span>}
          />
        </div>
      </div>

      {/* Featured Projects Bento Showcase in Adwise Glass */}
      <div className="glass-panel-alt p-6 space-y-5 shadow-lg">
        <div className="flex items-center justify-between border-b border-white/40 pb-3">
          <div>
            <div className="text-[11px] text-slate-500 uppercase tracking-widest font-bold">Verified Creative Collateral</div>
            <h2 className="text-lg font-bold text-slate-800 tracking-tight mt-0.5">
              Multimodal Brand Assets &amp; Campaigns
            </h2>
          </div>
          <span className="text-xs text-slate-600 font-mono font-semibold">
            Active Workspace: {brand?.name || 'Nexus Enterprise AI'}
          </span>
        </div>

        {/* Bento Collage Card Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Main Visual Showcase (8 cols) */}
          <div className="lg:col-span-8 p-4 rounded-3xl bg-white/40 border border-white/60 flex flex-col justify-between shadow-inner">
            <div className="grid grid-cols-3 gap-3">
              {/* Asset 1: Digital Ad */}
              <div className="p-3 rounded-2xl bg-white/60 border border-white/80 space-y-2 shadow-sm">
                <div 
                  className="h-28 rounded-xl flex flex-col justify-end p-2.5 text-slate-900 shadow-sm"
                  style={{
                    background: `linear-gradient(135deg, ${brand?.primaryColor || '#FFAFCC'} 0%, ${brand?.secondaryColor || '#BDE0FE'} 100%)`
                  }}
                >
                  <span className="text-[9px] uppercase font-mono tracking-wider font-bold opacity-80">Campaign Ad</span>
                  <span className="text-xs font-bold leading-tight line-clamp-2">
                    {contentItems[0]?.title || `${brand?.name || 'Brand'} Campaign`}
                  </span>
                </div>
                <div className="text-[10px] text-slate-600 flex items-center justify-between font-semibold">
                  <span className="capitalize">{contentItems[0]?.contentType?.replace('_', ' ') || 'Social Ad'}</span>
                  <span className="text-emerald-700 font-mono font-bold">{contentItems[0]?.complianceScore || 96}/100</span>
                </div>
              </div>

              {/* Asset 2: Brand Identity Card */}
              <div className="p-3 rounded-2xl bg-white/60 border border-white/80 space-y-2 shadow-sm">
                <div className="h-28 rounded-xl bg-white/80 border border-white/90 flex flex-col items-center justify-center p-2 text-center shadow-inner">
                  <div 
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm mb-1"
                    style={{ backgroundColor: brand?.primaryColor || '#4F46E5' }}
                  >
                    {brand?.name?.charAt(0) || 'B'}
                  </div>
                  <span className="text-[11px] font-bold text-slate-800 truncate max-w-full px-1">{brand?.name || 'Brand Identity'}</span>
                  <span className="text-[8px] text-slate-500 font-mono font-bold">24px Clear-Space</span>
                </div>
                <div className="text-[10px] text-slate-600 flex items-center justify-between font-semibold">
                  <span>Logo Mark</span>
                  <span className="text-emerald-700 font-mono font-bold">100/100</span>
                </div>
              </div>

              {/* Asset 3: Swatch Palettes */}
              <div className="p-3 rounded-2xl bg-white/60 border border-white/80 space-y-2 shadow-sm">
                <div className="h-28 rounded-xl bg-white/80 p-2 flex flex-col justify-between shadow-inner">
                  <div className="h-5 rounded text-[9px] text-slate-900 flex items-center px-2 font-mono font-bold shadow-xs truncate" style={{ backgroundColor: brand?.primaryColor || '#FFAFCC' }}>
                    {brand?.primaryColor || '#FFAFCC'}
                  </div>
                  <div className="h-5 rounded text-[9px] text-slate-900 flex items-center px-2 font-mono font-bold shadow-xs truncate" style={{ backgroundColor: brand?.secondaryColor || '#BDE0FE' }}>
                    {brand?.secondaryColor || '#BDE0FE'}
                  </div>
                  <div className="h-5 rounded text-[9px] text-slate-900 flex items-center px-2 font-mono font-bold shadow-xs truncate" style={{ backgroundColor: brand?.accentColor || '#CDB4DB' }}>
                    {brand?.accentColor || '#CDB4DB'}
                  </div>
                </div>
                <div className="text-[10px] text-slate-600 flex items-center justify-between font-semibold">
                  <span>Color Tokens</span>
                  <span className="text-blue-700 font-mono font-bold truncate max-w-[85px]">{brand?.name || 'Brand'}</span>
                </div>
              </div>
            </div>

            {/* Metadata Footer */}
            <div className="pt-4 mt-4 border-t border-white/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div>
                <span className="text-slate-500">Company Name: </span>
                <strong className="text-slate-800">{brand?.name || 'Nexus Enterprise AI'}</strong>
              </div>
              <div className="truncate max-w-md">
                <span className="text-slate-500">Industry: </span>
                <strong className="text-slate-800 truncate">{brand?.description || 'Enterprise Brand Governance'}</strong>
              </div>
            </div>
          </div>

          {/* Right Summary Column: Recent Pre-Flight Status (4 cols) */}
          <div className="lg:col-span-4 p-5 rounded-3xl bg-white/40 border border-white/60 flex flex-col justify-between space-y-4 shadow-inner">
            <div>
              <div className="text-xs font-bold text-slate-800 tracking-tight mb-3">Recent Content Items</div>
              <div className="space-y-2.5">
                {contentItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl bg-white/70 border border-white hover:bg-white/90 transition-all cursor-pointer group space-y-1 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span 
                        onClick={() => onOpenContent(item.id)}
                        className="text-xs font-bold text-slate-800 group-hover:text-pink-600 transition-colors truncate max-w-[170px]"
                      >
                        {item.title}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-mono font-bold ${
                          (item.complianceScore || 0) >= 90 ? 'text-emerald-700' : 'text-pink-600'
                        }`}>
                          {item.complianceScore ?? '--'}/100
                        </span>
                        {onDeleteContent && contentItems.length > 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm(`Delete "${item.title}"?`)) {
                                onDeleteContent(item.id);
                              }
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 rounded transition-opacity"
                            title="Delete Item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                    <div 
                      onClick={() => onOpenContent(item.id)}
                      className="flex items-center justify-between text-[10px] text-slate-500 font-medium"
                    >
                      <span className="capitalize">{item.contentType.replace('_', ' ')} • V{item.currentVersion}</span>
                      <span className="capitalize text-slate-700 font-semibold">{item.status.replace('_', ' ')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => onOpenContent(contentItems[0]?.id || 'cnt_01')}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full bg-white/80 hover:bg-white text-xs font-bold text-slate-800 border border-white shadow-sm transition-all cursor-pointer"
            >
              <span>Open Studio Workbench</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-pink-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
