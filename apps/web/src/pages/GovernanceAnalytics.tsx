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
            <ChromePaperPlane className="w-8 h-8 filter drop-shadow-[0_4px_12px_rgba(255,255,255,0.15)]" />
            <div>
              <div className="text-xs uppercase font-mono tracking-widest text-zinc-400 font-semibold">
                Intelligence &amp; Trends
              </div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight font-sans">
                Governance Analytics &amp; Ambiguity
              </h1>
            </div>
          </div>
          <p className="text-xs text-zinc-400 max-w-xl">
            Identify recurring brand drift, departmental compliance health, and guidelines that creators frequently contest.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/[0.04] px-4 py-2 rounded-full border border-white/10 text-xs shadow-sm">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span className="text-zinc-400 font-medium">Trajectory:</span>
          <span className="text-emerald-400 font-bold font-mono">+17 pts (Q4-Q1)</span>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compliance Progress Trend */}
        <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-4 shadow-2xl">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
            <div className="silver-bar">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Overall Brand Health Progression
              </h3>
              <p className="text-[11px] text-zinc-400">Monthly compliance score average (0-100)</p>
            </div>
            <span className="text-xs font-mono font-bold text-white">88% Current</span>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="scoreSilver" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffffff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ffffff" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#22222d" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis domain={[50, 100]} stroke="#64748b" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090d', borderColor: '#333344', borderRadius: '1rem', fontSize: '11px', color: '#fff' }}
                />
                <Area type="monotone" dataKey="score" stroke="#ffffff" strokeWidth={2.5} fillOpacity={1} fill="url(#scoreSilver)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Compliance Scores */}
        <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-4 shadow-2xl">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
            <div className="silver-bar">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Departmental Compliance Velocity
              </h3>
              <p className="text-[11px] text-zinc-400">Compliance health across organizational teams</p>
            </div>
            <Users className="w-4 h-4 text-zinc-400" />
          </div>

          <div className="space-y-3 pt-2">
            {metrics.departmentScores.map((dept) => (
              <div key={dept.department} className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">{dept.department}</span>
                  <span className="font-mono font-bold text-zinc-200">{dept.score}/100</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/[0.05] overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-zinc-400 to-white transition-all duration-500" 
                    style={{ width: `${dept.score}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                  <span>{dept.contentVolume} assets produced</span>
                  <span className={dept.score >= 90 ? 'text-emerald-400' : 'text-zinc-300'}>
                    {dept.score >= 90 ? 'High Adherence' : 'Active Optimization'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Frequent Issues & Ambiguity Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Frequent Terminology Misses */}
        <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-4 shadow-2xl">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
            <div className="silver-bar">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Recurring Terminology Drift
              </h3>
              <p className="text-[11px] text-zinc-400">Words creators repeatedly draft before AI correction</p>
            </div>
            <AlertTriangle className="w-4 h-4 text-zinc-400" />
          </div>

          <div className="space-y-2.5">
            {metrics.frequentTerminologyMisses.map((miss, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-rose-300 font-mono font-bold">"{miss.prohibited}"</span>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
                  <span className="text-emerald-300 font-mono font-semibold">"{miss.preferred}"</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-zinc-300 font-bold">
                  {miss.count} occurrences
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Guideline Ambiguity List */}
        <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-4 shadow-2xl">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
            <div className="silver-bar">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Contested Guidelines &amp; Ambiguity
              </h3>
              <p className="text-[11px] text-zinc-400">Policies with high creator dispute rates requiring brand clarification</p>
            </div>
            <HelpCircle className="w-4 h-4 text-zinc-400" />
          </div>

          <div className="space-y-3">
            {metrics.guidelineAmbiguityList.map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{item.guidelineTitle}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-zinc-200 border border-white/10 font-bold">
                    {item.disputeRate}% Dispute Rate
                  </span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {item.feedback}
                </p>
                <div className="text-[10px] text-zinc-300 font-medium flex items-center gap-1.5 pt-1">
                  <FileEdit className="w-3.5 h-3.5" />
                  <span>Recommendation: Update policy wording with specific threshold examples.</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
