import React, { useState } from 'react';
import { X, Building2, Sparkles, Plus, Palette, Shield } from 'lucide-react';
import type { BrandWorkspace } from '@brandvault/shared';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreateBrand: (brand: Partial<BrandWorkspace>) => Promise<BrandWorkspace>;
}

export const CreateBrandModal: React.FC<Props> = ({ isOpen, onClose, onCreateBrand }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#4F46E5');
  const [accentColor, setAccentColor] = useState('#FFAFCC');
  const [toneInput, setToneInput] = useState('authoritative, innovative, transparent');
  const [restrictionsInput, setRestrictionsInput] = useState('unsubstantiated claims, competitor disparagement');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      const toneKeywords = toneInput.split(',').map(s => s.trim()).filter(Boolean);
      const restrictedTopics = restrictionsInput.split(',').map(s => s.trim()).filter(Boolean);

      await onCreateBrand({
        name,
        description: description || `${name} Brand Governance Workspace`,
        primaryColor,
        secondaryColor: '#BDE0FE',
        accentColor,
        toneKeywords,
        restrictedTopics,
      });

      setName('');
      setDescription('');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-lg p-6 md:p-8 space-y-6 shadow-2xl border border-white">
        <div className="flex items-center justify-between border-b border-white/50 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FFC8DD] to-[#BDE0FE] flex items-center justify-center shadow-sm">
              <Building2 className="w-5 h-5 text-slate-800" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
                Create Brand Workspace
              </h2>
              <p className="text-xs text-slate-600 font-medium">
                Add an isolated corporate brand with custom guidelines &amp; rules.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/60 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 font-mono">
              Brand Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Easy-A1, ShotNest Media, My Company"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/80 border border-white rounded-2xl px-4 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-soft shadow-inner font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 font-mono">
              Industry &amp; Overview
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Education Consulting, International Student Visas &amp; Study Abroad"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white/80 border border-white rounded-2xl px-4 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-soft shadow-inner font-sans resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 font-mono">
                Primary Brand Color
              </label>
              <div className="flex items-center gap-2 bg-white/80 border border-white rounded-2xl px-3 py-1.5 shadow-inner">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-7 h-7 rounded-lg border-0 cursor-pointer bg-transparent"
                />
                <span className="text-xs font-mono font-bold text-slate-700">{primaryColor}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 font-mono">
                Accent Color
              </label>
              <div className="flex items-center gap-2 bg-white/80 border border-white rounded-2xl px-3 py-1.5 shadow-inner">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-7 h-7 rounded-lg border-0 cursor-pointer bg-transparent"
                />
                <span className="text-xs font-mono font-bold text-slate-700">{accentColor}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 font-mono">
              Tone Keywords (Comma-separated)
            </label>
            <input
              type="text"
              placeholder="authoritative, empowering, approachable, precise"
              value={toneInput}
              onChange={(e) => setToneInput(e.target.value)}
              className="w-full bg-white/80 border border-white rounded-2xl px-4 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-soft shadow-inner font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 font-mono">
              Restricted Topics / Disallowed Claims
            </label>
            <input
              type="text"
              placeholder="unsubstantiated claims, competitor disparagement"
              value={restrictionsInput}
              onChange={(e) => setRestrictionsInput(e.target.value)}
              className="w-full bg-white/80 border border-white rounded-2xl px-4 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-soft shadow-inner font-sans"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-white/50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-bold text-slate-600 hover:bg-white/60 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="glass-button px-6 py-2.5 rounded-full text-xs font-bold shadow-md hover:scale-105 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Creating Brand...' : 'Create Brand Workspace'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
