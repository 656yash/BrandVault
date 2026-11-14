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
            <ChromeShield className="w-8 h-8 filter drop-shadow-[0_4px_12px_rgba(255,255,255,0.15)]" />
            <div>
              <div className="text-xs uppercase font-mono tracking-widest text-zinc-400 font-semibold">
                Responsible AI &amp; Trust
              </div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight font-sans">
                Audit Trail &amp; AI Disclosure
              </h1>
            </div>
          </div>
          <p className="text-xs text-zinc-400 max-w-xl">
            Immutable tracking of every guideline update, scan execution, human review decision, and data protection boundary.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/[0.04] px-4 py-2 rounded-full border border-white/10 text-xs font-mono shadow-sm">
          <Lock className="w-3.5 h-3.5 text-zinc-300" />
          <span className="text-zinc-200">SOC 2 Type II Certified Log</span>
        </div>
      </div>

      {/* Enterprise Security & Disclosure Cards with Silver Bars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-3 shadow-xl">
          <div className="silver-bar">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Groq Inference Engine</h3>
            <span className="text-[10px] text-zinc-300 font-mono">Ultra-Low Latency</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed pt-1">
            Sub-second neural evaluation using <code className="text-white bg-white/10 px-1 py-0.5 rounded font-mono text-[11px]">openai/gpt-oss-120b</code> and <code className="text-white bg-white/10 px-1 py-0.5 rounded font-mono text-[11px]">qwen/qwen3.8-27b</code> with strict JSON constraints.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-3 shadow-xl">
          <div className="silver-bar">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Zero-Data Retention</h3>
            <span className="text-[10px] text-emerald-400 font-mono">Confidentiality Guarantee</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed pt-1">
            Submitted marketing copy, unreleased ads, and guidelines are held in volatile memory only and never stored or used to train external models.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-3 shadow-xl">
          <div className="silver-bar">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Cloudflare Edge Isolation</h3>
            <span className="text-[10px] text-zinc-300 font-mono">Multi-Tenant Boundary</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed pt-1">
            Multi-tenant brand workspaces and D1 relational databases are encrypted at rest with strict tenant boundary enforcement.
          </p>
        </div>
      </div>

      {/* Immutable Audit Log Table */}
      <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-5 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <div className="silver-bar">
            <h3 className="text-sm font-bold text-white">System &amp; User Action Logs</h3>
            <p className="text-xs text-zinc-400">Chronological history of compliance actions and approvals</p>
          </div>
          <span className="text-xs font-mono text-zinc-400">{auditLogs.length} events recorded</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-white/[0.02] text-zinc-400 text-[10px] uppercase font-mono border-b border-white/10">
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
                  <td className="py-3.5 px-4 font-mono text-zinc-400">
                    {new Date(log.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-white">
                    {log.actorName}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-white/10 text-zinc-300 border border-white/15 font-bold">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-zinc-400 max-w-md truncate">
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
