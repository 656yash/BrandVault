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
import type { GovernanceMetrics, BrandWorkspace } from '@brandvault/shared';
import { ChromePaperPlane, ChromeShield, TiltedSticker } from '../components/ChromeIcons';

interface Props {
  brand?: BrandWorkspace | null;
  metrics: GovernanceMetrics;
}

const trendData = [
  { month: 'Oct', score: 71, violations: 48 },
  { month: 'Nov', score: 76, violations: 39 },
  { month: 'Dec', score: 81, violations: 31 },
  { month: 'Jan', score: 84, violations: 24 },
  { month: 'Feb', score: 88, violations: 18 },
];

export const GovernanceAnalytics: React.FC<Props> = ({ brand, metrics }) => {
  return (
    <div className="relative space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <ChromePaperPlane className="w-8 h-8 filter drop-shadow-[0_4px_10px_rgba(205,180,219,0.5)]" />
            <div>
              <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight font-sans">
                Governance Analytics &amp; Ambiguity
              </h1>
              <p className="text-xs text-slate-600 font-medium">
                Identify recurring brand drift, departmental compliance health, and guidelines for <span className="font-bold text-slate-800">{brand?.name || 'Active Brand'}</span>.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 glass-panel px-5 py-2.5 rounded-full text-xs shadow-sm bg-white/50 border border-white">
          <TrendingUp className="w-4 h-4 text-emerald-600" />
          <span className="text-slate-600 font-medium">Trajectory:</span>
          <span className="text-emerald-700 font-bold font-mono">+17 pts (Q4-Q1)</span>
        </div>
      </div>

      {/* Visual Analytics Grid in Adwise Glass Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compliance Progress Trend */}
        <div className="glass-panel p-6 space-y-4 shadow-lg">
          <div className="flex items-center justify-between pb-2 border-b border-white/40">
            <div className="adwise-bar">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Overall Brand Health Progression
              </h3>
              <p className="text-[11px] text-slate-500">Monthly compliance score average (0-100)</p>
            </div>
            <span className="text-xs font-mono font-bold text-purple-700 bg-purple-100 px-3 py-1 rounded-full border border-purple-200">
              88% Current
            </span>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="adwiseAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFAFCC" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#BDE0FE" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.4)" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis domain={[50, 100]} stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', borderRadius: '16px', border: '1px solid white', fontSize: '12px', color: '#1e293b', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="score" stroke="#FFAFCC" strokeWidth={3} fillOpacity={1} fill="url(#adwiseAreaGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Compliance Scores */}
        <div className="glass-panel-alt p-6 space-y-4 shadow-lg">
          <div className="flex items-center justify-between pb-2 border-b border-white/40">
            <div className="adwise-bar">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Departmental Compliance Velocity
              </h3>
              <p className="text-[11px] text-slate-500">Compliance health across organizational teams</p>
            </div>
            <Users className="w-4 h-4 text-purple-600" />
          </div>

          <div className="space-y-3 pt-2">
            {metrics.departmentScores.map((dept) => (
              <div key={dept.department} className="p-3.5 rounded-2xl bg-white/60 border border-white space-y-1.5 shadow-sm">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{dept.department}</span>
                  <span className="font-mono font-black text-slate-800">{dept.score}/100</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/70 overflow-hidden shadow-inner">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-[#FFAFCC] to-[#A2D2FF] transition-all duration-500" 
                    style={{ width: `${dept.score}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono font-semibold">
                  <span>{dept.contentVolume} assets produced</span>
                  <span className={dept.score >= 90 ? 'text-emerald-700' : 'text-blue-700'}>
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
        <div className="glass-panel p-6 space-y-4 shadow-lg">
          <div className="flex items-center justify-between pb-2 border-b border-white/40">
            <div className="adwise-bar">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Recurring Terminology Drift
              </h3>
              <p className="text-[11px] text-slate-500">Words creators repeatedly draft before AI correction</p>
            </div>
            <AlertTriangle className="w-4 h-4 text-purple-600" />
          </div>

          <div className="space-y-2.5">
            {metrics.frequentTerminologyMisses.map((miss, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-white/60 border border-white flex items-center justify-between text-xs shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="text-rose-700 font-mono font-bold">"{miss.prohibited}"</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-emerald-800 font-mono font-bold">"{miss.preferred}"</span>
                </div>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 font-bold border border-purple-200">
                  {miss.count} occurrences
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Guideline Ambiguity List */}
        <div className="glass-panel-alt p-6 space-y-4 shadow-lg">
          <div className="flex items-center justify-between pb-2 border-b border-white/40">
            <div className="adwise-bar">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Contested Guidelines &amp; Ambiguity
              </h3>
              <p className="text-[11px] text-slate-500">Policies with high creator dispute rates requiring brand clarification</p>
            </div>
            <HelpCircle className="w-4 h-4 text-blue-600" />
          </div>

          <div className="space-y-3">
            {metrics.guidelineAmbiguityList.map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-white/60 border border-white space-y-2 shadow-sm">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{item.guidelineTitle}</span>
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-700 font-bold border border-pink-200">
                    {item.disputeRate}% Dispute Rate
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {item.feedback}
                </p>
                <div className="text-[10px] text-purple-700 font-bold flex items-center gap-1.5 pt-1">
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
