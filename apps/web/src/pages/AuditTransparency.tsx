import React from 'react';
import { 
  ShieldAlert, 
  Lock, 
  Server, 
  Cpu
} from 'lucide-react';
import type { AuditLog } from '@brandvault/shared';
import { ChromeShield, ChromePaperPlane } from '../components/ChromeIcons';

interface Props {
  auditLogs: AuditLog[];
}

export const AuditTransparency: React.FC<Props> = ({ auditLogs }) => {
  return (
    <div className="relative space-y-8 pb-16">
      {/* Decorative dot matrix in background */}
      <div className="absolute top-0 right-0 w-80 h-72 dot-pattern opacity-30 pointer-events-none rounded-3xl" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-2">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <ChromeShield className="w-8 h-8 filter drop-shadow-md" />
            <div>
              <div className="text-xs uppercase font-mono tracking-widest text-slate-500 font-semibold">
                Responsible AI &amp; Trust
              </div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight font-sans">
                Audit Trail &amp; AI Disclosure
              </h1>
            </div>
          </div>
          <p className="text-xs text-slate-400 max-w-xl">
            Immutable tracking of every guideline update, scan execution, human review decision, and data protection boundary.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#121217] px-4 py-2 rounded-full border border-white/10 text-xs font-mono shadow-sm">
          <Lock className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-slate-300">SOC 2 Type II Certified Log</span>
        </div>
      </div>

      {/* Enterprise Security & Disclosure Cards with Gold Bars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-6 rounded-3xl bg-[#0e0e13] border border-white/[0.07] space-y-3 shadow-xl">
          <div className="gold-bar">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Groq Inference Engine</h3>
            <span className="text-[10px] text-amber-400 font-mono">Ultra-Low Latency</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed pt-1">
            Sub-second neural evaluation using <code className="text-amber-300 font-mono text-[11px]">openai/gpt-oss-120b</code> and <code className="text-amber-300 font-mono text-[11px]">qwen/qwen3.8-27b</code> with strict JSON constraints.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[#0e0e13] border border-white/[0.07] space-y-3 shadow-xl">
          <div className="gold-bar">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Zero-Data Retention</h3>
            <span className="text-[10px] text-emerald-400 font-mono">Confidentiality Guarantee</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed pt-1">
            Submitted marketing copy, unreleased ads, and guidelines are held in volatile memory only and never stored or used to train external models.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[#0e0e13] border border-white/[0.07] space-y-3 shadow-xl">
          <div className="gold-bar">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Cloudflare Edge Isolation</h3>
            <span className="text-[10px] text-cyan-400 font-mono">Multi-Tenant Boundary</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed pt-1">
            Multi-tenant brand workspaces and D1 relational databases are encrypted at rest with tenant boundary enforcement.
          </p>
        </div>
      </div>

      {/* Immutable Audit Log Table */}
      <div className="p-6 rounded-3xl bg-[#0e0e13] border border-white/[0.07] space-y-5 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <div className="gold-bar">
            <h3 className="text-sm font-bold text-white">System &amp; User Action Logs</h3>
            <p className="text-xs text-slate-400">Chronological history of compliance actions and approvals</p>
          </div>
          <span className="text-xs font-mono text-slate-400">{auditLogs.length} events recorded</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#121217] text-slate-400 text-[10px] uppercase font-mono border-b border-white/5">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Action Event</th>
                <th className="py-3 px-4">Event Payload / Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-white whitespace-nowrap">
                    {log.actorName}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-[10px] px-2.5 py-0.5 rounded-full bg-[#181822] text-amber-300 border border-amber-500/20">
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
