import React from 'react';
import { 
  ShieldAlert, 
  Lock, 
  CheckCircle2, 
  FileCode, 
  Clock, 
  Server, 
  Cpu, 
  KeyRound
} from 'lucide-react';
import type { AuditLog } from '@brandvault/shared';

interface Props {
  auditLogs: AuditLog[];
}

export const AuditTransparency: React.FC<Props> = ({ auditLogs }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" />
            Audit Logging &amp; Responsible Governance
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight mt-1">
            Immutable Audit Trail &amp; AI Disclosure
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Transparent tracking of every guideline update, scan execution, human review decision, and data policy.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-xs font-mono">
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-300">SOC 2 Type II Certified Log</span>
        </div>
      </div>

      {/* Enterprise Security & Disclosure Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-2">
            <Cpu className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Groq Inference Pipeline</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Sub-second neural evaluation using <code className="text-indigo-300 font-mono text-[11px]">openai/gpt-oss-120b</code> and <code className="text-indigo-300 font-mono text-[11px]">qwen/qwen3.8-27b</code>.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-2">
            <Lock className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Zero-Data Retention</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            All submitted content, unreleased ads, and guidelines are held in memory during the scan and never stored or used to train external models.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-2">
            <Server className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Cloudflare Edge Isolation</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Multi-tenant brand workspaces and D1 relational databases are encrypted at rest with tenant boundary enforcement.
          </p>
        </div>
      </div>

      {/* Immutable Audit Log Table */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white">System &amp; User Action Logs</h3>
            <p className="text-xs text-slate-400">Chronological history of compliance actions and approvals</p>
          </div>
          <span className="text-xs font-mono text-slate-400">{auditLogs.length} events recorded</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 text-slate-400 text-[10px] uppercase font-mono border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Action Event</th>
                <th className="py-3 px-4">Event Payload / Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-200 whitespace-nowrap">
                    {log.actorName}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-[10px] px-2 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 text-[11px] font-mono">
                    {JSON.stringify(log.details)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
