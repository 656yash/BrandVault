import React from 'react';
import { 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowUpRight, 
  Clock, 
  Sparkles,
  TrendingUp,
  Cpu
} from 'lucide-react';
import type { ContentItem, GovernanceMetrics } from '@brandvault/shared';

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
    <div className="space-y-6">
      {/* Hero Welcome & Quick Action */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-6 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              Automated Brand Compliance Officer
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Enterprise Governance & Asset Pre-Flight
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              BrandVault safeguards brand credibility by intercepting unverified claims, banned terminology, tone drift, and visual inconsistencies before publication.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onNewScan}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
            >
              <FileText className="w-4 h-4" />
              <span>Inspect New Content</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Health Score */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Brand Health Score</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {metrics.overallComplianceHealth}
            </span>
            <span className="text-xs text-slate-400">/ 100</span>
            <span className="text-[11px] font-semibold text-emerald-400 flex items-center ml-auto">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +4.2%
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-indigo-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${metrics.overallComplianceHealth}%` }}
            />
          </div>
        </div>

        {/* Total Assets Scanned */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Pre-Flight Scans</span>
            <FileText className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {metrics.totalScanned}
            </span>
            <span className="text-xs text-slate-400">assets</span>
            <span className="text-[10px] text-indigo-400 font-mono ml-auto">Multi-agent</span>
          </div>
          <p className="text-[11px] text-slate-500">Text, Social Creatives, Documents</p>
        </div>

        {/* Certified Compliant */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Approved & Sealed</span>
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {metrics.approvedCount}
            </span>
            <span className="text-xs text-slate-400">approved</span>
            <span className="text-[11px] font-semibold text-cyan-400 ml-auto">Cryptographic Seal</span>
          </div>
          <p className="text-[11px] text-slate-500">Zero brand risk publication readiness</p>
        </div>

        {/* Revisions & Feedback */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Corrections Applied</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {metrics.changesRequestedCount}
            </span>
            <span className="text-xs text-slate-400">revisions</span>
            <span className="text-[11px] font-semibold text-amber-400 ml-auto">1.8h avg</span>
          </div>
          <p className="text-[11px] text-slate-500">Fast contextual human-in-the-loop fixes</p>
        </div>
      </div>

      {/* Multi-Agent Inspection Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-indigo-400" />
                Multi-Agent Compliance Pillars
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Real-time breakdown of brand safety dimensions</p>
            </div>
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-mono">
              Groq openai/gpt-oss-120b
            </span>
          </div>

          <div className="space-y-3.5">
            {[
              { name: 'Tone & Brand Voice Agent', score: 92, desc: 'Authoritative, precise, empathetic tone adherence' },
              { name: 'Terminology & Dictionary Agent', score: 85, desc: 'Detects banned, competitor, and devaluing words' },
              { name: 'Fact Verification Agent', score: 96, desc: 'Cross-references company facts against verified sources' },
              { name: 'Claims Substantiation Agent', score: 79, desc: 'Requires audit proof for superlatives and SLA guarantees' },
              { name: 'Visual & Accessibility Agent', score: 91, desc: 'Color palette contrast, logo padding, WCAG 2.1 AA' },
            ].map((agent, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">{agent.name}</span>
                  <span className="font-mono font-bold text-slate-300">{agent.score}%</span>
                </div>
                <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      agent.score >= 90 ? 'bg-emerald-500' : agent.score >= 80 ? 'bg-indigo-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${agent.score}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-500">{agent.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Top Violations Box */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Frequent Violation Patterns
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Most common mistakes flagged across teams</p>
          </div>

          <div className="space-y-3">
            {metrics.topViolations.map((v, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200">{v.category}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono font-bold">
                    {v.count} flags
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 truncate">{v.guideline}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Content Review Pipeline */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white">Recent Content Pipeline</h2>
            <p className="text-xs text-slate-400 mt-0.5">Latest copy, press releases, and campaign assets</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/50 text-slate-400 text-[10px] uppercase font-mono border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Title & Format</th>
                <th className="py-3 px-4">Author</th>
                <th className="py-3 px-4">Compliance Score</th>
                <th className="py-3 px-4">Review Status</th>
                <th className="py-3 px-4">Reviewer</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {contentItems.map((item) => {
                const isApproved = item.status === 'approved';
                const isChanges = item.status === 'changes_requested';
                return (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{item.title}</div>
                      <div className="text-[10px] text-slate-500 capitalize">{item.contentType.replace('_', ' ')} • V{item.currentVersion}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {item.authorName}
                    </td>
                    <td className="py-3.5 px-4">
                      {item.complianceScore !== undefined ? (
                        <div className="flex items-center gap-2">
                          <span className={`font-mono font-bold ${
                            item.complianceScore >= 90 ? 'text-emerald-400' :
                            item.complianceScore >= 70 ? 'text-indigo-400' : 'text-amber-400'
                          }`}>
                            {item.complianceScore}/100
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-500">Unscanned</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold capitalize ${
                        isApproved ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                        isChanges ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30' :
                        'bg-slate-800 text-slate-300'
                      }`}>
                        {isApproved ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {item.assignedReviewerName || 'Unassigned'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onOpenContent(item.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white transition-colors font-medium text-[11px]"
                      >
                        <span>Inspect</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
