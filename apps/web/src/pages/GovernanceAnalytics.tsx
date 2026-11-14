import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  Users, 
  HelpCircle, 
  FileEdit,
  ArrowRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  AreaChart,
  Area
} from 'recharts';
import type { GovernanceMetrics } from '@brandvault/shared';
import { ChromePaperPlane, ChromeShield, TiltedSticker } from '../components/ChromeIcons';

interface Props {
  metrics: GovernanceMetrics;
}

const trendData = [
  { month: 'Oct', score: 71, violations: 48 },
  { month: 'Nov', score: 76, violations: 39 },
  { month: 'Dec', score: 81, violations: 31 },
  { month: 'Jan', score: 84, violations: 24 },
  { month: 'Feb', score: 88, violations: 18 },
];

export const GovernanceAnalytics: React.FC<Props> = ({ metrics }) => {
  return (
    <div className="relative space-y-8 pb-16">
      {/* Decorative dot matrix in background */}
      <div className="absolute top-0 right-0 w-80 h-72 dot-pattern opacity-30 pointer-events-none rounded-3xl" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-2">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <ChromePaperPlane className="w-8 h-8 filter drop-shadow-md" />
            <div>
              <div className="text-xs uppercase font-mono tracking-widest text-slate-500 font-semibold">
                Intelligence &amp; Trends
              </div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight font-sans">
                Governance Analytics &amp; Ambiguity
              </h1>
            </div>
          </div>
          <p className="text-xs text-slate-400 max-w-xl">
            Identify recurring brand drift, departmental compliance health, and guidelines that creators frequently contest.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#121217] px-4 py-2 rounded-full border border-white/10 text-xs shadow-sm">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-400 font-medium">Trajectory:</span>
          <span className="text-emerald-400 font-bold font-mono">+17 pts (Q4-Q1)</span>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compliance Progress Trend */}
        <div className="p-6 rounded-3xl bg-[#0e0e13] border border-white/[0.07] space-y-4 shadow-2xl">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
            <div className="gold-bar">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Overall Brand Health Progression
              </h3>
              <p className="text-[11px] text-slate-500">Monthly compliance score average (0-100)</p>
            </div>
            <span className="text-xs font-mono font-bold text-amber-400">88% Current</span>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="scoreGold" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1c1c26" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis domain={[50, 100]} stroke="#64748b" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#121217', borderColor: '#2b2b38', borderRadius: '1rem', fontSize: '11px', color: '#fff' }}
                />
                <Area type="monotone" dataKey="score" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#scoreGold)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Violations Bar Chart */}
        <div className="p-6 rounded-3xl bg-[#0e0e13] border border-white/[0.07] space-y-4 shadow-2xl">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
            <div className="gold-bar">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Top Flagged Violation Categories
              </h3>
              <p className="text-[11px] text-slate-500">Total infractions detected across creative copy</p>
            </div>
            <span className="text-xs font-mono font-bold text-amber-400">51 Flags</span>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.topViolations} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1c1c26" />
                <XAxis type="number" stroke="#64748b" fontSize={11} />
                <YAxis dataKey="category" type="category" stroke="#94a3b8" fontSize={10} width={130} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#121217', borderColor: '#2b2b38', borderRadius: '1rem', fontSize: '11px', color: '#fff' }}
                />
                <Bar dataKey="count" fill="#f59e0b" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Department Breakdown & Frequent Terminology Misses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Compliance */}
        <div className="p-6 rounded-3xl bg-[#0e0e13] border border-white/[0.07] space-y-4 shadow-2xl">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
            <div className="gold-bar">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Departmental Compliance Breakdown
              </h3>
              <p className="text-[11px] text-slate-500">Internal benchmarking across teams</p>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            {metrics.departmentScores.map((dept, i) => (
              <div key={i} className="p-4 rounded-2xl bg-[#14141c] border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">{dept.department}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-500 font-mono">{dept.contentVolume} assets</span>
                    <span className={`font-mono font-bold text-sm ${
                      dept.score >= 90 ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {dept.score}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-[#1c1c28] h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${dept.score >= 90 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                    style={{ width: `${dept.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recurring Terminology Slip-Ups */}
        <div className="p-6 rounded-3xl bg-[#0e0e13] border border-white/[0.07] space-y-4 shadow-2xl">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
            <div className="gold-bar">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Recurring Terminology Misses
              </h3>
              <p className="text-[11px] text-slate-500">Training &amp; coaching opportunities</p>
            </div>
          </div>

          <div className="space-y-2.5 pt-1">
            {metrics.frequentTerminologyMisses.map((item, i) => (
              <div key={i} className="p-3.5 rounded-2xl bg-[#14141c] border border-white/5 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-rose-400 font-bold">&quot;{item.prohibited}&quot;</span>
                    <ArrowRight className="w-3 h-3 text-slate-600" />
                    <span className="text-emerald-400 font-bold">&quot;{item.preferred}&quot;</span>
                  </div>
                  <div className="text-[10px] text-slate-500">Repeated across multiple drafts</div>
                </div>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 font-mono font-bold border border-amber-500/30">
                  {item.count} misses
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Guideline Ambiguity Reports */}
      <div className="p-6 rounded-3xl bg-[#0e0e13] border border-white/[0.07] space-y-4 shadow-2xl">
        <div className="gold-bar">
          <h3 className="text-sm font-bold text-white">Guideline Ambiguity &amp; Creator Dispute Report</h3>
          <p className="text-xs text-slate-400">
            Policies where creators frequently contest findings, indicating ambiguous wording or unrealistic standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
          {metrics.guidelineAmbiguityList.map((item, i) => (
            <div key={i} className="p-5 rounded-2xl bg-[#14141c] border border-amber-500/20 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-xs font-bold text-white">{item.guidelineTitle}</h4>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30">
                  {item.disputeRate}% Dispute Rate
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                &quot;{item.feedback}&quot;
              </p>
              <div className="pt-2 flex items-center justify-between text-[11px] border-t border-white/5">
                <span className="text-amber-400 font-semibold font-mono">Action: Clarify Policy Threshold</span>
                <button className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer">
                  <FileEdit className="w-3 h-3" />
                  <span>Draft Revision</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
