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
  Trash2
} from 'lucide-react';
import type { ContentItem, GovernanceMetrics } from '@brandvault/shared';
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
  contentItems: ContentItem[];
  metrics: GovernanceMetrics;
  onOpenContent: (contentId: string) => void;
  onNewScan: () => void;
  onDeleteContent?: (contentId: string) => void;
}

export const Dashboard: React.FC<Props> = ({ 
  contentItems, 
  metrics, 
  onOpenContent, 
  onNewScan,
  onDeleteContent
}) => {
  return (
    <div className="relative space-y-10 pb-16">
      {/* Decorative dot matrix pattern in upper corners */}
      <div className="absolute top-0 right-0 w-80 h-64 dot-pattern opacity-30 pointer-events-none rounded-2xl" />
      <div className="absolute top-40 left-0 w-64 h-64 dot-pattern opacity-20 pointer-events-none rounded-2xl" />

      {/* Hero Header */}
      <div className="relative pt-2">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <ChromeShield className="w-10 h-10 filter drop-shadow-[0_4px_16px_rgba(255,255,255,0.2)]" />
              <div>
                <div className="text-xs font-mono uppercase tracking-widest text-zinc-400 font-semibold">
                  Pre-Flight Intelligence
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight font-sans">
                  Brand Governance OS
                </h1>
              </div>
            </div>
            <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
              Automated Brand Compliance Officer inspecting marketing copy, press releases, social ads, and visual creatives before publication. Powered by sub-second Groq AI inference and Cloudflare edge persistence.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <TiltedSticker text="100% Brand Safe" subtext="SOC 2 Type II Verified" />
            <button
              onClick={onNewScan}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black font-bold text-xs shadow-xl hover:bg-zinc-200 hover:scale-105 transition-all cursor-pointer"
            >
              <ChromePaperPlane className="w-4 h-4 text-black" />
              <span>Inspect New Content</span>
            </button>
          </div>
        </div>
      </div>

      {/* Multi-Agent Compliance Pillars with Circular Progress Rings */}
      <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
          <div className="flex items-center gap-2.5">
            <ChromePaperPlane className="w-6 h-6" />
            <div>
              <div className="text-sm font-bold text-white tracking-tight">Active Compliance Agents</div>
              <div className="text-[11px] text-zinc-400">Sub-second multi-agent inspection powered by Groq (openai/gpt-oss-120b)</div>
            </div>
          </div>
          <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-white/[0.04] text-zinc-300 border border-white/15 font-semibold">
            Latency ~340ms • Zero-Retention
          </span>
        </div>

        {/* 5 Circular Tool Badges with Silver/Chrome Rings */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 pt-2">
          <CircularToolBadge
            title="Tone & Voice"
            label="Persona Adherence"
            percentage={92}
            iconBgColor="#101016"
            iconContent={<span className="text-xs font-mono font-bold text-white">92%</span>}
          />
          <CircularToolBadge
            title="Terminology"
            label="Dictionary Purity"
            percentage={85}
            iconBgColor="#101016"
            iconContent={<span className="text-xs font-mono font-bold text-zinc-200">85%</span>}
          />
          <CircularToolBadge
            title="Fact Verification"
            label="Corporate Source"
            percentage={96}
            iconBgColor="#101016"
            iconContent={<span className="text-xs font-mono font-bold text-emerald-400">96%</span>}
          />
          <CircularToolBadge
            title="Claims Legality"
            label="Audit Proof"
            percentage={79}
            iconBgColor="#101016"
            iconContent={<span className="text-xs font-mono font-bold text-zinc-300">79%</span>}
          />
          <CircularToolBadge
            title="Visual & A11y"
            label="WCAG 2.1 AA"
            percentage={91}
            iconBgColor="#101016"
            iconContent={<span className="text-xs font-mono font-bold text-zinc-200">91%</span>}
          />
        </div>
      </div>

      {/* KPI Section with Vertical Silver Bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-2 shadow-lg">
          <div className="silver-bar">
            <div className="text-sm font-bold text-zinc-300">Overall Brand Health</div>
            <div className="text-2xl font-black text-white mt-1 font-mono">
              {metrics.overallComplianceHealth} <span className="text-xs text-zinc-500 font-sans font-normal">/ 100</span>
            </div>
          </div>
          <p className="text-[11px] text-zinc-400 leading-relaxed pt-1">
            Aggregated cross-departmental compliance score reflecting zero critical unverified claims.
          </p>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-2 shadow-lg">
          <div className="silver-bar">
            <div className="text-sm font-bold text-zinc-300">Pre-Flight Scans</div>
            <div className="text-2xl font-black text-white mt-1 font-mono">
              {metrics.totalScanned} <span className="text-xs text-zinc-500 font-sans font-normal">assets</span>
            </div>
          </div>
          <p className="text-[11px] text-zinc-400 leading-relaxed pt-1">
            Marketing copy, social ad creatives, and press releases evaluated prior to public release.
          </p>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-2 shadow-lg">
          <div className="silver-bar">
            <div className="text-sm font-bold text-zinc-300">Approved &amp; Sealed</div>
            <div className="text-2xl font-black text-white mt-1 font-mono">
              {metrics.approvedCount} <span className="text-xs text-zinc-500 font-sans font-normal">assets</span>
            </div>
          </div>
          <p className="text-[11px] text-zinc-400 leading-relaxed pt-1">
            Collateral stamped with cryptographic publication seals authorized by human reviewers.
          </p>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-2 shadow-lg">
          <div className="silver-bar">
            <div className="text-sm font-bold text-zinc-300">Average Turnaround</div>
            <div className="text-2xl font-black text-white mt-1 font-mono">
              {metrics.avgResolutionTimeHours} <span className="text-xs text-zinc-500 font-sans font-normal">hours</span>
            </div>
          </div>
          <p className="text-[11px] text-zinc-400 leading-relaxed pt-1">
            65% reduction in compliance turnaround through one-click context-preserving corrections.
          </p>
        </div>
      </div>

      {/* Featured Projects Bento Showcase */}
      <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
          <div>
            <div className="text-xs text-zinc-400 uppercase tracking-widest font-mono">Verified Creative Collateral</div>
            <h2 className="text-lg font-bold text-white tracking-tight mt-0.5">
              Multimodal Brand Assets &amp; Campaigns
            </h2>
          </div>
          <span className="text-xs text-zinc-400 font-mono">
            Active Workspace: Nexus Enterprise AI
          </span>
        </div>

        {/* Bento Collage Card Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Main Visual Showcase (8 cols) */}
          <div className="lg:col-span-8 p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col justify-between">
            <div className="grid grid-cols-3 gap-3">
              {/* Asset 1: Digital Ad */}
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                <div className="h-28 rounded-lg bg-gradient-to-tr from-[#3b3b4f] to-[#1e1e28] flex flex-col justify-end p-2.5 text-white">
                  <span className="text-[9px] uppercase font-mono tracking-wider opacity-70">Campaign Ad</span>
                  <span className="text-xs font-bold leading-tight">Modern Governance Moat</span>
                </div>
                <div className="text-[10px] text-zinc-400 flex items-center justify-between">
                  <span>LinkedIn Single Ad</span>
                  <span className="text-emerald-400 font-mono font-bold">96/100</span>
                </div>
              </div>

              {/* Asset 2: Brand Identity Card */}
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                <div className="h-28 rounded-lg bg-[#09090d] border border-white/10 flex flex-col items-center justify-center p-2 text-center">
                  <ChromeShield className="w-8 h-8 mb-1" />
                  <span className="text-[11px] font-bold text-white">Nexus Cloud</span>
                  <span className="text-[8px] text-zinc-400 font-mono">24px Clear-Space</span>
                </div>
                <div className="text-[10px] text-zinc-400 flex items-center justify-between">
                  <span>Logo Mark</span>
                  <span className="text-emerald-400 font-mono font-bold">100/100</span>
                </div>
              </div>

              {/* Asset 3: Swatch Palettes */}
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                <div className="h-28 rounded-lg bg-[#0e0e14] p-2 flex flex-col justify-between">
                  <div className="h-5 rounded bg-[#4F46E5] text-[9px] text-white flex items-center px-2 font-mono font-bold">#4F46E5</div>
                  <div className="h-5 rounded bg-[#06B6D4] text-[9px] text-slate-950 flex items-center px-2 font-mono font-bold">#06B6D4</div>
                  <div className="h-5 rounded bg-[#10B981] text-[9px] text-white flex items-center px-2 font-mono font-bold">#10B981</div>
                </div>
                <div className="text-[10px] text-zinc-400 flex items-center justify-between">
                  <span>Color Tokens</span>
                  <span className="text-emerald-400 font-mono font-bold">Verified</span>
                </div>
              </div>
            </div>

            {/* Metadata Footer */}
            <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center justify-between text-xs">
              <div>
                <span className="text-zinc-500">Company Name: </span>
                <strong className="text-white">Nexus Enterprise AI</strong>
              </div>
              <div>
                <span className="text-zinc-500">Industry: </span>
                <strong className="text-white">Enterprise Cloud Intelligence &amp; Brand Automation</strong>
              </div>
            </div>
          </div>

          {/* Right Summary Column: Recent Pre-Flight Status (4 cols) */}
          <div className="lg:col-span-4 p-5 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col justify-between space-y-4">
            <div>
              <div className="text-xs font-bold text-white tracking-tight mb-3">Recent Content Items</div>
              <div className="space-y-2.5">
                {contentItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/25 transition-all cursor-pointer group space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span 
                        onClick={() => onOpenContent(item.id)}
                        className="text-xs font-semibold text-white group-hover:text-zinc-200 transition-colors truncate max-w-[170px]"
                      >
                        {item.title}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-mono font-bold ${
                          (item.complianceScore || 0) >= 90 ? 'text-emerald-400' : 'text-zinc-300'
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
                            className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-rose-400 rounded transition-opacity"
                            title="Delete Item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                    <div 
                      onClick={() => onOpenContent(item.id)}
                      className="flex items-center justify-between text-[10px] text-zinc-500"
                    >
                      <span className="capitalize">{item.contentType.replace('_', ' ')} • V{item.currentVersion}</span>
                      <span className="capitalize text-zinc-400">{item.status.replace('_', ' ')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => onOpenContent(contentItems[0]?.id || 'cnt_01')}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-bold text-white border border-white/10 transition-colors cursor-pointer"
            >
              <span>Open Studio Workbench</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-zinc-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Decorative Line-Art Design Icons at the Bottom */}
      <div className="pt-6 border-t border-white/[0.05] flex items-center justify-between opacity-30 px-4">
        <OutlinePenTool />
        <OutlineBezierNodes />
        <OutlineEyedropper />
        <OutlineMagicWand />
      </div>
    </div>
  );
};
