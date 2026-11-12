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
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <BarChart3 className="w-4 h-4" />
            Brand Governance &amp; Compliance Intelligence
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight mt-1">
            Violation Analytics &amp; Guideline Ambiguity Insights
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Identify recurring mistakes, department compliance health, and brand guidelines that require editorial clarification.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-xs">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-300 font-medium">Compliance Trajectory:</span>
          <span className="text-emerald-400 font-bold font-mono">+17 pts over 4 months</span>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compliance Progress Trend */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Overall Brand Health Progression
              </h3>
              <p className="text-[11px] text-slate-400">Monthly compliance score average (0-100)</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400">88% Current</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis domain={[50, 100]} stroke="#64748b" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#scoreGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Violations Bar Chart */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Top Flagged Violation Categories
              </h3>
              <p className="text-[11px] text-slate-400">Total infractions detected across creative copy</p>
            </div>
            <span className="text-xs font-mono font-bold text-amber-400">51 Total Flags</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.topViolations} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#64748b" fontSize={11} />
                <YAxis dataKey="category" type="category" stroke="#94a3b8" fontSize={10} width={130} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '11px' }}
                />
                <Bar dataKey="count" fill="#4F46E5" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Department Breakdown & Frequent Terminology Misses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Compliance */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wider">
              <Users className="w-4 h-4 text-cyan-400" />
              Departmental Compliance Breakdown
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">Internal Benchmarking</span>
          </div>

          <div className="space-y-3">
            {metrics.departmentScores.map((dept, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">{dept.department}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-500 font-mono">{dept.contentVolume} assets</span>
                    <span className={`font-mono font-bold ${
                      dept.score >= 90 ? 'text-emerald-400' : 'text-indigo-400'
                    }`}>
                      {dept.score}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${dept.score >= 90 ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                    style={{ width: `${dept.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recurring Terminology Slip-Ups */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Recurring Terminology Misses
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">Training Opportunity</span>
          </div>

          <div className="space-y-2.5">
            {metrics.frequentTerminologyMisses.map((item, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-rose-400 font-bold">&quot;{item.prohibited}&quot;</span>
                    <ArrowRight className="w-3 h-3 text-slate-600" />
                    <span className="text-emerald-400 font-bold">&quot;{item.preferred}&quot;</span>
                  </div>
                  <div className="text-[10px] text-slate-500">Repeated across copy drafts</div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-mono font-bold border border-amber-500/20">
                  {item.count} misses
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Guideline Ambiguity Reports */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-amber-400" />
            Guideline Ambiguity &amp; Dispute Report
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Brand policies where creators frequently contest findings, signalling unclear wording or unrealistic standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metrics.guidelineAmbiguityList.map((item, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-950/70 border border-amber-900/30 space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-xs font-bold text-slate-200">{item.guidelineTitle}</h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                  {item.disputeRate}% Dispute Rate
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed italic">
                &quot;{item.feedback}&quot;
              </p>
              <div className="pt-1 flex items-center justify-between text-[11px]">
                <span className="text-indigo-400 font-semibold">Recommendation: Clarify Threshold</span>
                <button className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors">
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
