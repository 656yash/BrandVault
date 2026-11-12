import React from 'react';
import { Shield, Sparkles, CheckCircle2, Lock, Cpu, Server, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AIDisclosureModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-slate-200">
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              BrandVault AI Transparency & Responsible Governance
            </h2>
            <p className="text-xs text-slate-400">SOC 2 Type II Compliant • Enterprise Disclosure Standard</p>
          </div>
        </div>

        <div className="space-y-4 text-sm">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs tracking-wider uppercase">
              <Cpu className="w-4 h-4" /> Inference Engine & Models
            </div>
            <p className="text-slate-300">
              BrandVault executes sub-second reasoning through the <strong>Groq API</strong> using deep reasoning models (<code className="text-indigo-300 font-mono text-xs">openai/gpt-oss-120b</code> and <code className="text-indigo-300 font-mono text-xs">qwen/qwen3.8-27b</code>).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800 flex items-start gap-3">
              <Lock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-white text-xs">Zero-Retention Policy</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Customer brand assets, guidelines, and confidential drafts are processed strictly in volatile memory and never used for model training.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800 flex items-start gap-3">
              <Server className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-white text-xs">Cloudflare Edge Architecture</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Backend API routes and data isolation are served on Cloudflare Workers, with D1 relational stores and encrypted R2 buckets.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-900/40">
            <h4 className="font-semibold text-indigo-300 text-xs flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4" /> Core Guardrails & Human Oversight
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <strong>Deterministic Grounding:</strong> AI never guesses policy; all findings map to verified guidelines and facts.
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <strong>Human-in-the-Loop Authority:</strong> AI flags and explains; only authorized humans (Alice Vance, Bob Chen) can grant publication approvals.
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <strong>Cryptographic Audit Seals:</strong> Approved assets receive a SHA-256 validation seal recording reviewer identity and guideline version.
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
