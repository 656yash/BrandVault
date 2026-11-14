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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl glass-panel bg-white/95 p-7 shadow-2xl text-slate-800 space-y-6 border border-white">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-800 transition-colors p-1 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <ChromeShield className="w-10 h-10 filter drop-shadow-[0_4px_10px_rgba(205,180,219,0.5)]" />
          <div>
            <div className="text-xs uppercase font-mono tracking-widest text-pink-600 font-bold">
              SOC 2 Type II Certified
            </div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
              BrandVault AI Transparency &amp; Responsible Governance
            </h2>
          </div>
        </div>

        <div className="space-y-4 text-sm">
          <div className="p-4 rounded-2xl bg-white/80 border border-slate-200 space-y-2 shadow-sm">
            <div className="flex items-center gap-2 text-purple-700 font-bold text-xs tracking-wider uppercase font-mono">
              <Cpu className="w-4 h-4 text-purple-600" /> Inference Engine &amp; Models
            </div>
            <p className="text-slate-700 text-xs leading-relaxed font-medium">
              BrandVault executes sub-second reasoning through the <strong>Groq API</strong> using deep reasoning models (<code className="text-purple-800 bg-purple-50 px-1.5 py-0.5 rounded font-mono text-xs font-bold border border-purple-200">openai/gpt-oss-120b</code> and <code className="text-purple-800 bg-purple-50 px-1.5 py-0.5 rounded font-mono text-xs font-bold border border-purple-200">qwen/qwen3.8-27b</code>).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-white/80 border border-slate-200 flex items-start gap-3 shadow-sm">
              <Lock className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-slate-800 text-xs">Zero-Retention Policy</h4>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed font-medium">
                  Customer brand assets, guidelines, and confidential drafts are processed strictly in volatile memory and never used for model training.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 border border-slate-200 flex items-start gap-3 shadow-sm">
              <Server className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-slate-800 text-xs">Cloudflare Edge Architecture</h4>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed font-medium">
                  Backend API routes and tenant boundaries are served on Cloudflare Workers, with D1 relational stores and encrypted R2 buckets.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/80 border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 text-xs flex items-center gap-2 mb-2 font-mono">
              <ChromePaperPlane className="w-4 h-4 text-pink-600" /> Core Guardrails &amp; Human Oversight
            </h4>
            <ul className="space-y-2 text-xs text-slate-700 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-pink-600 shrink-0" />
                <span><strong>Deterministic Grounding:</strong> AI never guesses policy; all findings map to verified guidelines and corporate facts.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-pink-600 shrink-0" />
                <span><strong>Human-in-the-Loop Authority:</strong> AI flags and explains; only authorized human directors and compliance managers can grant publication approvals.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-pink-600 shrink-0" />
                <span><strong>Cryptographic Audit Seals:</strong> Approved assets receive a SHA-256 validation seal recording reviewer identity and guideline version.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="glass-button px-7 py-2.5 text-xs font-bold rounded-full text-slate-900 hover:scale-105 transition-all cursor-pointer shadow-lg"
          >
            Acknowledge &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
};
