import React from 'react';
import { Shield, CheckCircle2, Lock, Cpu, Server, X } from 'lucide-react';
import { ChromeShield, ChromePaperPlane } from './ChromeIcons';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AIDisclosureModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#09090d]/95 backdrop-blur-2xl border border-white/15 rounded-3xl p-7 shadow-2xl text-slate-200 space-y-6">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-zinc-400 hover:text-white transition-colors p-1 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <ChromeShield className="w-10 h-10 filter drop-shadow-[0_4px_12px_rgba(255,255,255,0.15)]" />
          <div>
            <div className="text-xs uppercase font-mono tracking-widest text-zinc-400 font-semibold">
              SOC 2 Type II Certified
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              BrandVault AI Transparency &amp; Responsible Governance
            </h2>
          </div>
        </div>

        <div className="space-y-4 text-sm">
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-zinc-200 font-semibold text-xs tracking-wider uppercase font-mono">
              <Cpu className="w-4 h-4 text-zinc-300" /> Inference Engine &amp; Models
            </div>
            <p className="text-zinc-300 text-xs leading-relaxed">
              BrandVault executes sub-second reasoning through the <strong>Groq API</strong> using deep reasoning models (<code className="text-zinc-100 font-mono text-xs bg-white/10 px-1.5 py-0.5 rounded">openai/gpt-oss-120b</code> and <code className="text-zinc-100 font-mono text-xs bg-white/10 px-1.5 py-0.5 rounded">qwen/qwen3.8-27b</code>).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
              <Lock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-white text-xs">Zero-Retention Policy</h4>
                <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                  Customer brand assets, guidelines, and confidential drafts are processed strictly in volatile memory and never used for model training.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
              <Server className="w-5 h-5 text-zinc-300 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-white text-xs">Cloudflare Edge Architecture</h4>
                <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                  Backend API routes and tenant boundaries are served on Cloudflare Workers, with D1 relational stores and encrypted R2 buckets.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
            <h4 className="font-semibold text-zinc-200 text-xs flex items-center gap-2 mb-2 font-mono">
              <ChromePaperPlane className="w-4 h-4 text-zinc-300" /> Core Guardrails &amp; Human Oversight
            </h4>
            <ul className="space-y-2 text-xs text-zinc-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-zinc-300 shrink-0" />
                <span><strong>Deterministic Grounding:</strong> AI never guesses policy; all findings map to verified guidelines and corporate facts.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-zinc-300 shrink-0" />
                <span><strong>Human-in-the-Loop Authority:</strong> AI flags and explains; only authorized humans (Alice Vance, Bob Chen) can grant publication approvals.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-zinc-300 shrink-0" />
                <span><strong>Cryptographic Audit Seals:</strong> Approved assets receive a SHA-256 validation seal recording reviewer identity and guideline version.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-xs font-bold rounded-full bg-white text-black hover:bg-zinc-200 transition-all cursor-pointer shadow-lg"
          >
            Acknowledge &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
};
