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
  Package,
  AlertTriangle,
  AlertOctagon,
  ArrowRight,
  Send,
  FileCheck2,
  BookOpen,
  BarChart3,
  Plus
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import type { ContentItem, GovernanceMetrics, BrandWorkspace } from '@brandvault/shared';
import { 
  ChromeShield, 
  ChromePaperPlane, 
  ChromeAvatar, 
  CircularToolBadge 
} from '../components/ChromeIcons';
import type { NavTab } from '../components/Navbar';

interface Props {
  brand?: BrandWorkspace | null;
  contentItems: ContentItem[];
  metrics: GovernanceMetrics;
  onOpenContent: (contentId: string) => void;
  onNewScan: () => void;
  onDeleteContent?: (contentId: string) => void;
  onOpenCreateBrandModal?: () => void;
  onNavigateTab?: (tab: NavTab) => void;
}

const trendData = [
  { month: 'Oct', score: 78, reviews: 14 },
  { month: 'Nov', score: 83, reviews: 26 },
  { month: 'Dec', score: 87, reviews: 38 },
  { month: 'Jan', score: 91, reviews: 45 },
  { month: 'Feb', score: 94, reviews: 52 },
];

export const Dashboard: React.FC<Props> = ({ 
  brand,
  contentItems, 
  metrics, 
  onOpenContent, 
  onNewScan,
  onDeleteContent,
  onOpenCreateBrandModal,
  onNavigateTab
}) => {
  const pendingItems = contentItems.filter(c => c.status === 'ready_for_review' || c.status === 'changes_requested');
  const criticalIssuesCount = contentItems.reduce(
    (acc, item) => acc + (item.findings?.filter(f => f.severity === 'critical' && f.status === 'open').length || 0), 
    0
  );

  return (
    <div className="relative space-y-8 pb-16">
      {/* If No Brand Workspace Created Yet */}
      {!brand && (
        <div className="glass-panel p-6 bg-gradient-to-r from-pink-soft/30 via-white/50 to-blue-sky/30 border border-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg animate-in fade-in duration-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/80 flex items-center justify-center text-pink-600 shadow-sm shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-800 tracking-tight">No Brand Workspace Active</h3>
              <p className="text-xs text-slate-600 font-medium">
                Create a brand workspace to begin registering custom voice guidelines, terminology dictionaries, and inspecting assets.
              </p>
            </div>
          </div>
          {onOpenCreateBrandModal && (
            <button
              onClick={onOpenCreateBrandModal}
              className="glass-button px-5 py-2.5 rounded-full text-xs font-bold text-slate-900 shadow-md hover:scale-105 transition-all whitespace-nowrap cursor-pointer"
            >
              + Create First Brand Workspace
            </button>
          )}
        </div>
      )}

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
                Automated brand governance and compliance pre-flight intelligence for <strong className="text-slate-800">{brand?.name || 'Workspace'}</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Real-time Status and Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="glass-panel px-4 py-2 flex items-center gap-3 bg-blue-sky/25 border-blue-soft/40 shadow-sm">
            <div className="relative">
              <Activity className="w-4 h-4 text-blue-600" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
            </div>
            <div>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Total Scanned</p>
              <p className="text-base font-black text-slate-800">{metrics.totalScanned}</p>
            </div>
          </div>

          <div className="glass-panel-alt px-4 py-2 flex items-center gap-3 bg-pink-soft/25 border-pink-rose/40 shadow-sm">
            <Eye className="w-4 h-4 text-pink-600" />
            <div>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Approved Collateral</p>
              <p className="text-base font-black text-slate-800">{metrics.approvedCount}</p>
            </div>
          </div>

          <button
            onClick={onNewScan}
            className="glass-button flex items-center gap-2 px-5 py-2.5 rounded-full text-slate-900 font-bold text-xs shadow-lg hover:scale-105 transition-all cursor-pointer"
          >
            <ChromePaperPlane className="w-4 h-4 text-slate-900" />
            <span>Inspect New Content</span>
          </button>
        </div>
      </div>

      {/* 6 KPI Cards (Section 6 Requirement) */}
      <div>
        <h2 className="text-sm font-bold text-slate-800 mb-3 ml-1 tracking-tight uppercase font-mono text-[11px]">
          Governance &amp; Health Metrics
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { 
              label: 'Total Reviewed', 
              value: `${metrics.totalScanned}`, 
              sub: 'Assets inspected', 
              icon: TrendingUp, 
              color: 'text-blue-600', 
              bg: 'bg-blue-100' 
            },
            { 
              label: 'Compliance Score', 
              value: `${metrics.overallComplianceHealth || 100} / 100`, 
              sub: 'Brand safety index', 
              icon: ShieldCheck, 
              color: 'text-pink-600', 
              bg: 'bg-pink-100' 
            },
            { 
              label: 'Pending Reviews', 
              value: `${pendingItems.length}`, 
              sub: 'Awaiting sign-off', 
              icon: Layers, 
              color: 'text-amber-600', 
              bg: 'bg-amber-100' 
            },
            { 
              label: 'Critical Issues', 
              value: `${criticalIssuesCount}`, 
              sub: 'Blocking release', 
              icon: AlertOctagon, 
              color: 'text-rose-600', 
              bg: 'bg-rose-100' 
            },
            { 
              label: 'Approved Content', 
              value: `${metrics.approvedCount}`, 
              sub: 'Cryptographically sealed', 
              icon: CheckCircle2, 
              color: 'text-purple-600', 
              bg: 'bg-purple-100' 
            },
            { 
              label: 'Avg Review Time', 
              value: `${metrics.avgResolutionTimeHours || (metrics.totalScanned > 0 ? 1.5 : 0)} hrs`, 
              sub: 'Turnaround speed', 
              icon: Clock, 
              color: 'text-indigo-600', 
              bg: 'bg-indigo-100' 
            },
          ].map((kpi, i) => (
            <div 
              key={i} 
              className={`${i % 2 === 0 ? 'glass-panel' : 'glass-panel-alt'} p-4 hover:scale-[1.02] transition-transform duration-300 shadow-sm border border-white flex flex-col justify-between`}
            >
              <div className="flex items-center gap-2.5 mb-2">
                <div className={`p-2 rounded-xl ${kpi.bg} shadow-xs`}>
                  <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
                </div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider truncate">
                  {kpi.label}
                </div>
              </div>
              <div>
                <div className="text-lg font-black text-slate-900 tracking-tight font-mono">
                  {kpi.value}
                </div>
                <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
                  {kpi.sub}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions Bar (Section 6 Requirement) */}
      <div className="glass-panel p-4 flex flex-wrap items-center justify-between gap-4 border border-white shadow-sm">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-pink-600" />
          <span className="text-xs font-bold text-slate-800">Quick Governance Actions:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onNewScan}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/75 hover:bg-white text-slate-800 font-bold text-xs border border-white shadow-xs transition-all hover:scale-105 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-pink-600" />
            <span>Create New Content</span>
          </button>

          <button
            onClick={() => onNavigateTab && onNavigateTab('knowledge')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/75 hover:bg-white text-slate-800 font-bold text-xs border border-white shadow-xs transition-all hover:scale-105 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-purple-600" />
            <span>Upload Brand Guidelines</span>
          </button>

          <button
            onClick={() => onNavigateTab && onNavigateTab('reviews')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/75 hover:bg-white text-slate-800 font-bold text-xs border border-white shadow-xs transition-all hover:scale-105 cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-amber-600" />
            <span>Review Pending ({pendingItems.length})</span>
          </button>

          <button
            onClick={() => onNavigateTab && onNavigateTab('analytics')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/75 hover:bg-white text-slate-800 font-bold text-xs border border-white shadow-xs transition-all hover:scale-105 cursor-pointer"
          >
            <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
            <span>View Analytics</span>
          </button>
        </div>
      </div>

      {/* Compliance Overview Chart & Pending Reviews Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Compliance Overview Chart (7 cols) */}
        <div className="lg:col-span-7 glass-panel p-6 space-y-4 shadow-lg border border-white">
          <div className="flex items-center justify-between pb-2 border-b border-white/40">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Compliance Overview Progression
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Monthly compliance score average (0-100) across {brand?.name || 'Workspace'}
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-purple-700 bg-purple-100 px-3 py-1 rounded-full border border-purple-200">
              +{metrics.overallComplianceHealth || 94}% Current
            </span>
          </div>

          <div className="h-56 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="dashGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFAFCC" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#BDE0FE" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.4)" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis domain={[60, 100]} stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255,255,255,0.92)', 
                    backdropFilter: 'blur(10px)', 
                    borderRadius: '16px', 
                    border: '1px solid white', 
                    fontSize: '12px', 
                    color: '#1e293b', 
                    fontWeight: 'bold' 
                  }} 
                />
                <Area type="monotone" dataKey="score" stroke="#FFAFCC" strokeWidth={3} fillOpacity={1} fill="url(#dashGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pending Reviews Widget (5 cols) */}
        <div className="lg:col-span-5 glass-panel-alt p-6 space-y-4 shadow-lg border border-white flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-white/40">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Pending Reviews Queue
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">Awaiting compliance officer sign-off</p>
            </div>
            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
              {pendingItems.length} Pending
            </span>
          </div>

          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {pendingItems.length === 0 ? (
              <div className="p-6 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <div className="text-xs font-bold text-slate-800">Queue Clear</div>
                <p className="text-[11px] text-slate-500 font-medium">
                  Zero items currently awaiting approval. Submit content from Studio to queue for review.
                </p>
              </div>
            ) : (
              pendingItems.map(item => (
                <div 
                  key={item.id}
                  onClick={() => onNavigateTab && onNavigateTab('reviews')}
                  className="p-3 rounded-2xl bg-white/70 border border-white hover:bg-white transition-all cursor-pointer shadow-xs flex items-center justify-between group"
                >
                  <div className="space-y-0.5 max-w-[200px]">
                    <div className="text-xs font-bold text-slate-900 group-hover:text-pink-600 transition-colors truncate">
                      {item.title}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      <span className="capitalize">{item.contentType.replace('_', ' ')}</span> • {item.authorName}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {item.complianceScore ?? 95}/100
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-800 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              ))
            )}
          </div>

          <button
            onClick={() => onNavigateTab && onNavigateTab('reviews')}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-white/80 hover:bg-white text-xs font-bold text-slate-800 border border-white shadow-xs transition-all cursor-pointer"
          >
            <span>Open Review Management</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-pink-600" />
          </button>
        </div>
      </div>

      {/* Common Brand Violations & Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Common Brand Violations (6 cols) */}
        <div className="lg:col-span-6 glass-panel p-6 space-y-4 shadow-lg border border-white">
          <div className="flex items-center justify-between pb-2 border-b border-white/40">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Common Brand Violations
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">Frequently flagged compliance categories</p>
            </div>
            <AlertTriangle className="w-4 h-4 text-purple-600" />
          </div>

          <div className="space-y-2.5">
            {[
              {
                category: 'Incorrect Terminology',
                desc: 'Use of discouraged words ("cheap" instead of "cost-effective")',
                freq: '18 incidents',
                sev: 'Warning'
              },
              {
                category: 'Tone Inconsistencies',
                desc: 'Hyperbolic marketing puffery ("revolutionary magic", condescension)',
                freq: '12 incidents',
                sev: 'Warning'
              },
              {
                category: 'Unsupported Claims',
                desc: 'Superlatives ("No. 1 in India") lacking audited third-party citations',
                freq: '9 incidents',
                sev: 'Critical'
              },
              {
                category: 'Outdated / Ungrounded Facts',
                desc: 'Unverified uptime percentages without SLA audit backing',
                freq: '5 incidents',
                sev: 'Critical'
              },
              {
                category: 'Visual Guideline Violations',
                desc: 'Logo clear space violation (&lt; 24px) or low WCAG contrast ratio',
                freq: '3 incidents',
                sev: 'Suggestion'
              },
            ].map((v, i) => (
              <div key={i} className="p-3 rounded-2xl bg-white/60 border border-white flex items-center justify-between text-xs shadow-xs">
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-800">{v.category}</div>
                  <div className="text-[10px] text-slate-500">{v.desc}</div>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-bold border border-purple-200">
                    {v.freq}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Feed (6 cols) */}
        <div className="lg:col-span-6 glass-panel-alt p-6 space-y-4 shadow-lg border border-white">
          <div className="flex items-center justify-between pb-2 border-b border-white/40">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Recent Governance Activity
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">Real-time log of content scans, approvals and updates</p>
            </div>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>

          <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
            {contentItems.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 font-medium">
                No recent activity yet. Actions will be logged here in real-time.
              </div>
            ) : (
              contentItems.slice(0, 4).map(item => (
                <div key={item.id} className="p-3 rounded-2xl bg-white/60 border border-white flex items-center justify-between text-xs shadow-xs">
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-900">{item.title}</div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      Status: <span className="capitalize font-semibold text-slate-700">{item.status.replace('_', ' ')}</span> • Score: {item.complianceScore ?? 100}/100
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    {new Date(item.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Featured Projects Bento Showcase */}
      <div className="glass-panel-alt p-6 space-y-5 shadow-lg border border-white">
        <div className="flex items-center justify-between border-b border-white/40 pb-3">
          <div>
            <div className="text-[11px] text-slate-500 uppercase tracking-widest font-bold font-mono">
              Verified Creative Collateral
            </div>
            <h2 className="text-lg font-bold text-slate-800 tracking-tight mt-0.5">
              Multimodal Brand Assets &amp; Campaigns
            </h2>
          </div>
          <span className="text-xs text-slate-600 font-mono font-semibold">
            Active Workspace: {brand?.name || 'Workspace Brand'}
          </span>
        </div>

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
                <strong className="text-slate-800">{brand?.name || 'Workspace Brand'}</strong>
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
                {contentItems.length === 0 ? (
                  <div className="p-4 rounded-2xl bg-white/50 border border-white text-center text-xs text-slate-500 font-medium">
                    No content collaterals yet. Click below to inspect your first asset.
                  </div>
                ) : (
                  contentItems.slice(0, 3).map((item) => (
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
                  ))
                )}
              </div>
            </div>

            <button
              onClick={() => onOpenContent(contentItems[0]?.id || '')}
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
