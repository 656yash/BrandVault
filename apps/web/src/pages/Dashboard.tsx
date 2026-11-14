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
  Check
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
}

export const Dashboard: React.FC<Props> = ({ 
  contentItems, 
  metrics, 
  onOpenContent, 
  onNewScan 
}) => {
  return (
    <div className="relative space-y-10 pb-16">
      {/* Decorative dot matrix pattern in upper corners */}
      <div className="absolute top-0 right-0 w-80 h-64 dot-pattern opacity-40 pointer-events-none rounded-2xl" />
      <div className="absolute top-40 left-0 w-64 h-64 dot-pattern opacity-25 pointer-events-none rounded-2xl" />

      {/* Hero Header matching the reference typography & chrome emblem */}
      <div className="relative pt-2">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <ChromeShield className="w-10 h-10 filter drop-shadow-xl" />
              <div>
                <div className="text-xs font-mono uppercase tracking-widest text-slate-500 font-semibold">
                  Pre-Flight Intelligence
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight font-sans">
                  Brand Governance OS
                </h1>
              </div>
            </div>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Automated Brand Compliance Officer inspecting marketing copy, press releases, social ads, and visual creatives before publication. Powered by sub-second Groq AI inference and Cloudflare edge persistence.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <TiltedSticker text="100% Brand Safe" subtext="SOC 2 Type II Verified" />
            <button
              onClick={onNewScan}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-slate-950 font-bold text-xs shadow-xl shadow-amber-500/20 hover:scale-105 transition-all cursor-pointer"
            >
              <ChromePaperPlane className="w-4 h-4 text-slate-950" />
              <span>Inspect New Content</span>
            </button>
          </div>
        </div>
      </div>

      {/* Multi-Agent Compliance Pillars with Circular Progress Rings (as seen in Image 2 "Design Tools") */}
      <div className="p-6 rounded-3xl bg-[#0e0e13] border border-white/[0.07] space-y-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
          <div className="flex items-center gap-2.5">
            <ChromePaperPlane className="w-6 h-6" />
            <div>
              <div className="text-sm font-bold text-white tracking-tight">Active Compliance Agents</div>
              <div className="text-[11px] text-slate-400">Sub-second multi-agent inspection powered by Groq (openai/gpt-oss-120b)</div>
            </div>
          </div>
          <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-[#181822] text-amber-400 border border-amber-500/30 font-semibold">
            Latency ~340ms • Zero-Retention
          </span>
        </div>

        {/* 5 Circular Tool Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 pt-2">
          <CircularToolBadge
            title="Tone & Voice"
            label="Persona Adherence"
            percentage={92}
            iconBgColor="#161622"
            iconContent={<span className="text-xs font-mono font-bold text-amber-400">92%</span>}
          />
          <CircularToolBadge
            title="Terminology"
            label="Dictionary Purity"
            percentage={85}
            iconBgColor="#161622"
            iconContent={<span className="text-xs font-mono font-bold text-amber-400">85%</span>}
          />
          <CircularToolBadge
            title="Fact Verification"
            label="Corporate Source"
            percentage={96}
            iconBgColor="#161622"
            iconContent={<span className="text-xs font-mono font-bold text-emerald-400">96%</span>}
          />
          <CircularToolBadge
            title="Claims Legality"
            label="Audit Proof"
            percentage={79}
            iconBgColor="#161622"
            iconContent={<span className="text-xs font-mono font-bold text-amber-400">79%</span>}
          />
          <CircularToolBadge
            title="Visual & A11y"
            label="WCAG 2.1 AA"
            percentage={91}
            iconBgColor="#161622"
            iconContent={<span className="text-xs font-mono font-bold text-cyan-400">91%</span>}
          />
        </div>
      </div>

      {/* KPI Section with Vertical Amber/Gold Bars (as seen in Image 3 "Why me") */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-5 rounded-2xl bg-[#0e0e13] border border-white/[0.07] space-y-2">
          <div className="gold-bar">
            <div className="text-sm font-bold text-amber-400">Overall Brand Health</div>
            <div className="text-2xl font-black text-white mt-1 font-mono">
              {metrics.overallComplianceHealth} <span className="text-xs text-slate-500 font-sans font-normal">/ 100</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
            Aggregated cross-departmental compliance score reflecting zero critical unverified claims.
          </p>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-2xl bg-[#0e0e13] border border-white/[0.07] space-y-2">
          <div className="gold-bar">
            <div className="text-sm font-bold text-amber-400">Pre-Flight Scans</div>
            <div className="text-2xl font-black text-white mt-1 font-mono">
              {metrics.totalScanned} <span className="text-xs text-slate-500 font-sans font-normal">assets</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
            Marketing copy, social ad creatives, and press releases evaluated prior to public release.
          </p>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-2xl bg-[#0e0e13] border border-white/[0.07] space-y-2">
          <div className="gold-bar">
            <div className="text-sm font-bold text-amber-400">Approved &amp; Sealed</div>
            <div className="text-2xl font-black text-white mt-1 font-mono">
              {metrics.approvedCount} <span className="text-xs text-slate-500 font-sans font-normal">assets</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
            Collateral stamped with cryptographic publication seals authorized by human reviewers.
          </p>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-2xl bg-[#0e0e13] border border-white/[0.07] space-y-2">
          <div className="gold-bar">
            <div className="text-sm font-bold text-amber-400">Average Turnaround</div>
            <div className="text-2xl font-black text-white mt-1 font-mono">
              {metrics.avgResolutionTimeHours} <span className="text-xs text-slate-500 font-sans font-normal">hours</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
            65% reduction in compliance turnaround through one-click context-preserving corrections.
          </p>
        </div>
      </div>

      {/* Featured Projects Bento Showcase (as seen in Image 4, 5, 6 "Brand Logo Design") */}
      <div className="p-6 rounded-3xl bg-[#0e0e13] border border-white/[0.07] space-y-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-widest font-mono">Verified Creative Collateral</div>
            <h2 className="text-lg font-bold text-white tracking-tight mt-0.5">
              Multimodal Brand Assets &amp; Campaigns
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Active Workspace: Nexus Enterprise AI
          </span>
        </div>

        {/* Bento Collage Card Layout (inspired by Image 4, 5, 6) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Main Visual Showcase (8 cols) */}
          <div className="lg:col-span-8 p-4 rounded-2xl bg-[#14141c] border border-white/[0.06] flex flex-col justify-between">
            <div className="grid grid-cols-3 gap-3">
              {/* Asset 1: Digital Ad */}
              <div className="p-3 rounded-xl bg-[#1a1a24] border border-white/5 space-y-2">
                <div className="h-28 rounded-lg bg-gradient-to-tr from-[#4F46E5] to-[#06B6D4] flex flex-col justify-end p-2.5 text-white">
                  <span className="text-[9px] uppercase font-mono tracking-wider opacity-80">Campaign Ad</span>
                  <span className="text-xs font-bold leading-tight">Modern Governance Moat</span>
                </div>
                <div className="text-[10px] text-slate-400 flex items-center justify-between">
                  <span>LinkedIn Single Ad</span>
                  <span className="text-emerald-400 font-mono font-bold">96/100</span>
                </div>
              </div>

              {/* Asset 2: Brand Identity Card */}
              <div className="p-3 rounded-xl bg-[#1a1a24] border border-white/5 space-y-2">
                <div className="h-28 rounded-lg bg-[#0e0e14] border border-amber-500/20 flex flex-col items-center justify-center p-2 text-center">
                  <ChromeShield className="w-8 h-8 mb-1" />
                  <span className="text-[11px] font-bold text-white">Nexus Cloud</span>
                  <span className="text-[8px] text-amber-400 font-mono">24px Clear-Space</span>
                </div>
                <div className="text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Logo Mark</span>
                  <span className="text-emerald-400 font-mono font-bold">100/100</span>
                </div>
              </div>

              {/* Asset 3: Swatch Palettes */}
              <div className="p-3 rounded-xl bg-[#1a1a24] border border-white/5 space-y-2">
                <div className="h-28 rounded-lg bg-[#14141c] p-2 flex flex-col justify-between">
                  <div className="h-5 rounded bg-[#4F46E5] text-[9px] text-white flex items-center px-2 font-mono font-bold">#4F46E5</div>
                  <div className="h-5 rounded bg-[#06B6D4] text-[9px] text-slate-950 flex items-center px-2 font-mono font-bold">#06B6D4</div>
                  <div className="h-5 rounded bg-[#10B981] text-[9px] text-white flex items-center px-2 font-mono font-bold">#10B981</div>
                </div>
                <div className="text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Color Tokens</span>
                  <span className="text-emerald-400 font-mono font-bold">Verified</span>
                </div>
              </div>
            </div>

            {/* Metadata Footer as seen in Image 4, 5, 6 */}
            <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500">Company Name: </span>
                <strong className="text-white">Nexus Enterprise AI</strong>
              </div>
              <div>
                <span className="text-slate-500">Industry: </span>
                <strong className="text-white">Enterprise Cloud Intelligence &amp; Brand Automation</strong>
              </div>
            </div>
          </div>

          {/* Right Summary Column: Recent Pre-Flight Status (4 cols) */}
          <div className="lg:col-span-4 p-5 rounded-2xl bg-[#14141c] border border-white/[0.06] flex flex-col justify-between space-y-4">
            <div>
              <div className="text-xs font-bold text-white tracking-tight mb-3">Recent Content Items</div>
              <div className="space-y-2.5">
                {contentItems.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onOpenContent(item.id)}
                    className="p-3 rounded-xl bg-[#1a1a24] border border-white/5 hover:border-amber-500/30 transition-all cursor-pointer group space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white group-hover:text-amber-300 transition-colors truncate max-w-[180px]">
                        {item.title}
                      </span>
                      <span className={`text-[10px] font-mono font-bold ${
                        (item.complianceScore || 0) >= 90 ? 'text-emerald-400' : 'text-amber-400'
                      }`}>
                        {item.complianceScore ?? '--'}/100
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span className="capitalize">{item.contentType.replace('_', ' ')} • V{item.currentVersion}</span>
                      <span className="capitalize text-slate-400">{item.status.replace('_', ' ')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => onOpenContent(contentItems[0]?.id || 'cnt_01')}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#1e1e27] hover:bg-[#252532] text-xs font-bold text-white border border-white/10 transition-colors"
            >
              <span>Open Studio Workbench</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Decorative Line-Art Design Icons at the Bottom (as seen in Image 2 & 7) */}
      <div className="pt-6 border-t border-white/[0.05] flex items-center justify-between opacity-35 px-4">
        <OutlinePenTool />
        <OutlineBezierNodes />
        <OutlineEyedropper />
        <OutlineMagicWand />
      </div>
    </div>
  );
};
