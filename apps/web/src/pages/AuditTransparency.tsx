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
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <ChromeShield className="w-8 h-8 filter drop-shadow-[0_4px_10px_rgba(205,180,219,0.5)]" />
            <div>
              <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight font-sans">
                Audit Trail &amp; AI Disclosure
              </h1>
              <p className="text-xs text-slate-600 font-medium">
                Immutable tracking of every guideline update, scan execution, human review decision, and data protection boundary.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 glass-panel px-5 py-2.5 rounded-full text-xs font-mono shadow-sm bg-white/50 border border-white">
          <Lock className="w-3.5 h-3.5 text-purple-600" />
          <span className="text-slate-800 font-bold">SOC 2 Type II Certified Log</span>
        </div>
      </div>

      {/* Enterprise Security & Disclosure Cards in Adwise Glass Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 space-y-3 shadow-lg">
          <div className="adwise-bar">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Groq Inference Engine</h3>
            <span className="text-[10px] text-purple-700 font-mono font-bold">Ultra-Low Latency</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed pt-1 font-medium">
            Sub-second neural evaluation using <code className="text-purple-800 bg-purple-50 px-1.5 py-0.5 rounded font-mono text-[11px] font-bold border border-purple-200">openai/gpt-oss-120b</code> and <code className="text-purple-800 bg-purple-50 px-1.5 py-0.5 rounded font-mono text-[11px] font-bold border border-purple-200">qwen/qwen3.8-27b</code> with strict JSON constraints.
          </p>
        </div>

        <div className="glass-panel-alt p-6 space-y-3 shadow-lg">
          <div className="adwise-bar">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Zero-Data Retention</h3>
            <span className="text-[10px] text-emerald-700 font-mono font-bold">Confidentiality Guarantee</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed pt-1 font-medium">
            Submitted marketing copy, unreleased ads, and guidelines are held in volatile memory only and never stored or used to train external models.
          </p>
        </div>

        <div className="glass-panel p-6 space-y-3 shadow-lg">
          <div className="adwise-bar">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Cloudflare Edge Isolation</h3>
            <span className="text-[10px] text-blue-700 font-mono font-bold">Multi-Tenant Boundary</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed pt-1 font-medium">
            Multi-tenant brand workspaces and D1 relational databases are encrypted at rest with strict tenant boundary enforcement.
          </p>
        </div>
      </div>

      {/* Immutable Audit Log Table */}
      <div className="glass-panel-alt p-6 space-y-5 shadow-lg">
        <div className="flex items-center justify-between pb-3 border-b border-white/40">
          <div className="adwise-bar">
            <h3 className="text-sm font-bold text-slate-800">System &amp; User Action Logs</h3>
            <p className="text-xs text-slate-500">Chronological history of compliance actions and approvals</p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-600">{auditLogs.length} events recorded</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 border-collapse">
            <thead>
              <tr className="border-b border-white/40 text-slate-500 uppercase text-[10px] font-mono font-bold tracking-wider">
                <th className="p-4 font-bold">Timestamp</th>
                <th className="p-4 font-bold">Actor</th>
                <th className="p-4 font-bold">Action Event</th>
                <th className="p-4 font-bold">Event Payload / Details</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log) => (
                <tr key={log.id} className="border-b border-white/20 hover:bg-white/40 transition-colors">
                  <td className="p-4 font-mono font-medium text-slate-600">
                    {new Date(log.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                  </td>
                  <td className="p-4 font-bold text-slate-800">
                    {log.actorName}
                  </td>
                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-white/70 text-slate-800 border border-white font-bold shadow-sm">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-[11px] text-slate-600 max-w-md truncate font-medium">
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
