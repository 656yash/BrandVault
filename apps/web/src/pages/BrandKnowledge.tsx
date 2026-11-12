import React, { useState } from 'react';
import { 
  BookOpen, 
  FileCheck, 
  SpellCheck, 
  Sparkles, 
  Plus, 
  Check, 
  AlertTriangle, 
  Palette, 
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import type { 
  Guideline, 
  ApprovedFact, 
  TerminologyRule, 
  ApprovedClaim, 
  BrandAsset 
} from '@brandvault/shared';

interface Props {
  guidelines: Guideline[];
  facts: ApprovedFact[];
  terminology: TerminologyRule[];
  claims: ApprovedClaim[];
  assets: BrandAsset[];
  onAddGuideline: (g: any) => Promise<any>;
  onAddFact: (f: any) => Promise<any>;
  onAddTerminology: (t: any) => Promise<any>;
}

export const BrandKnowledge: React.FC<Props> = ({
  guidelines,
  facts,
  terminology,
  claims,
  assets,
  onAddGuideline,
  onAddFact,
  onAddTerminology,
}) => {
  const [activeTab, setActiveTab] = useState<'guidelines' | 'terminology' | 'facts' | 'claims' | 'assets'>('guidelines');

  // Form states
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'tone' | 'claims' | 'visual' | 'accessibility' | 'legal'>('tone');
  const [newDescription, setNewDescription] = useState('');
  const [newRules, setNewRules] = useState('');

  // Terminology modal state
  const [newProhibited, setNewProhibited] = useState('');
  const [newPreferred, setNewPreferred] = useState('');
  const [newReason, setNewReason] = useState('');
  const [newSeverity, setNewSeverity] = useState<'critical' | 'warning' | 'suggestion'>('warning');

  const handleCreateGuideline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    await onAddGuideline({
      brandId: 'brand_nexus',
      title: newTitle,
      category: newCategory,
      description: newDescription,
      rules: newRules.split('\n').filter(Boolean),
      effectiveDate: new Date().toISOString().split('T')[0],
    });
    setNewTitle('');
    setNewDescription('');
    setNewRules('');
    setShowAddModal(false);
  };

  const handleCreateTerminology = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProhibited.trim()) return;
    await onAddTerminology({
      brandId: 'brand_nexus',
      prohibitedTerm: newProhibited,
      preferredTerm: newPreferred,
      reason: newReason,
      category: 'brand_voice',
      severity: newSeverity,
    });
    setNewProhibited('');
    setNewPreferred('');
    setNewReason('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Knowledge Hub Header */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            Brand Knowledge Base &amp; Grounding Center
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight mt-1">
            Enterprise Guidelines, Facts, &amp; Terminology
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            The single source of truth that grounds BrandVault AI inspections and prevents hallucinations.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Source Grounding</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs font-semibold">
        {[
          { id: 'guidelines', label: `Brand Guidelines (${guidelines.length})`, icon: BookOpen },
          { id: 'terminology', label: `Terminology Dictionary (${terminology.length})`, icon: SpellCheck },
          { id: 'facts', label: `Approved Facts (${facts.length})`, icon: ShieldCheck },
          { id: 'claims', label: `Approved Claims (${claims.length})`, icon: FileCheck },
          { id: 'assets', label: `Design Assets & Palettes`, icon: Palette },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Guidelines */}
      {activeTab === 'guidelines' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {guidelines.map((g) => (
            <div key={g.id} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full uppercase font-mono font-bold bg-indigo-500/20 text-indigo-300">
                    {g.category}
                  </span>
                  <h3 className="text-sm font-bold text-white mt-1.5">{g.title}</h3>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">V{g.version} • {g.status}</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{g.description}</p>

              <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Governing Rules</span>
                <ul className="space-y-1">
                  {g.rules.map((rule, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Terminology Dictionary */}
      {activeTab === 'terminology' && (
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white">Brand Terminology Dictionary</h3>
              <p className="text-xs text-slate-400">Strictly prohibited vs approved replacements</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/60 text-slate-400 text-[10px] uppercase font-mono border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Prohibited Phrase</th>
                  <th className="py-3 px-4">Preferred Replacement</th>
                  <th className="py-3 px-4">Severity</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Brand Governance Rationale</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {terminology.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-rose-400 bg-rose-950/40 border border-rose-900/40 px-2 py-0.5 rounded">
                        &quot;{t.prohibitedTerm}&quot;
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-900/40 px-2 py-0.5 rounded">
                        &quot;{t.preferredTerm}&quot;
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-bold uppercase font-mono px-2 py-0.5 rounded-full ${
                        t.severity === 'critical' ? 'bg-rose-500/20 text-rose-300' :
                        t.severity === 'warning' ? 'bg-amber-500/20 text-amber-300' :
                        'bg-slate-800 text-slate-300'
                      }`}>
                        {t.severity}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400 capitalize">
                      {t.category.replace('_', ' ')}
                    </td>
                    <td className="py-3 px-4 text-slate-300 text-[11px] max-w-sm">
                      {t.reason}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Approved Corporate Facts */}
      {activeTab === 'facts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {facts.map((f) => (
            <div key={f.id} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase">
                  {f.category}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Key: {f.factKey}</span>
              </div>
              <p className="text-sm font-semibold text-white leading-relaxed">{f.statement}</p>
              <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/80">
                <span>Verified Source: <strong className="text-slate-200">{f.verifiedSource}</strong></span>
                <span className="font-mono text-[10px]">{f.verifiedDate}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Approved Marketing Claims */}
      {activeTab === 'claims' && (
        <div className="space-y-4">
          {claims.map((c) => (
            <div key={c.id} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                    Substantiated Claim
                  </span>
                  <h3 className="text-sm font-bold text-white mt-1">&quot;{c.claimText}&quot;</h3>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">Expires: {c.expiresAt}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1 text-xs">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Substantiation Evidence &amp; Study</div>
                <p className="text-slate-300">{c.substantiationEvidence}</p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>Authorized Channels: <strong className="text-slate-300">{c.authorizedChannels.join(', ')}</strong></span>
                <span>Approved By: <strong className="text-slate-300">{c.approvedBy}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 5: Assets & Visual Identity */}
      {activeTab === 'assets' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Palette className="w-4 h-4 text-indigo-400" />
              Verified Brand Color Tokens
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5 text-center">
                <div className="h-16 rounded-xl bg-[#4F46E5] shadow-lg shadow-indigo-600/30 flex items-center justify-center font-mono text-white text-xs font-bold">
                  #4F46E5
                </div>
                <div className="text-xs font-semibold text-white">Primary Indigo</div>
                <div className="text-[10px] text-slate-500">Core UI &amp; Headers</div>
              </div>

              <div className="space-y-1.5 text-center">
                <div className="h-16 rounded-xl bg-[#06B6D4] shadow-lg shadow-cyan-600/30 flex items-center justify-center font-mono text-white text-xs font-bold">
                  #06B6D4
                </div>
                <div className="text-xs font-semibold text-white">Secondary Cyan</div>
                <div className="text-[10px] text-slate-500">Highlights &amp; Badges</div>
              </div>

              <div className="space-y-1.5 text-center">
                <div className="h-16 rounded-xl bg-[#10B981] shadow-lg shadow-emerald-600/30 flex items-center justify-center font-mono text-white text-xs font-bold">
                  #10B981
                </div>
                <div className="text-xs font-semibold text-white">Accent Emerald</div>
                <div className="text-[10px] text-slate-500">Success &amp; Verification</div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              Typography &amp; Layout Constraints
            </h3>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="font-semibold text-white">Header Typography: Plus Jakarta Sans</div>
                <div className="text-[11px] text-slate-400">Strictly 600 or 700 weight for executive authority.</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="font-semibold text-white">Body Typography: Inter</div>
                <div className="text-[11px] text-slate-400">Minimum 14px size for WCAG 2.1 AA legibility.</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="font-semibold text-white">Logo Clear-Space: 24px Padding</div>
                <div className="text-[11px] text-slate-400">No text or background clutter within 24px perimeter.</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Add Brand Grounding Source</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="flex gap-2 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('guidelines')}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white"
              >
                Add Guideline
              </button>
              <button
                onClick={() => setActiveTab('terminology')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300"
              >
                Add Banned Term
              </button>
            </div>

            {activeTab === 'guidelines' ? (
              <form onSubmit={handleCreateGuideline} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Guideline Title</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Technical Whitepaper Voice Guidelines"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200"
                  >
                    <option value="tone">Tone &amp; Voice</option>
                    <option value="claims">Promotional Claims</option>
                    <option value="visual">Visual &amp; Design</option>
                    <option value="accessibility">Accessibility</option>
                    <option value="legal">Legal &amp; Regulatory</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Summary Description</label>
                  <textarea
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Clear description of the policy..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 resize-none"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Rules (one per line)</label>
                  <textarea
                    value={newRules}
                    onChange={(e) => setNewRules(e.target.value)}
                    placeholder="Rule 1: Always cite sources&#10;Rule 2: Never promise 100% guarantees"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 resize-none"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
                  >
                    Save Guideline
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleCreateTerminology} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Prohibited Word or Phrase</label>
                  <input
                    type="text"
                    value={newProhibited}
                    onChange={(e) => setNewProhibited(e.target.value)}
                    placeholder="e.g. cheap, 100% foolproof"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Preferred Replacement</label>
                  <input
                    type="text"
                    value={newPreferred}
                    onChange={(e) => setNewPreferred(e.target.value)}
                    placeholder="e.g. cost-effective, high-reliability"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Severity</label>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200"
                  >
                    <option value="critical">Critical (Blocks Publishing)</option>
                    <option value="warning">Warning</option>
                    <option value="suggestion">Suggestion</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Reason</label>
                  <textarea
                    value={newReason}
                    onChange={(e) => setNewReason(e.target.value)}
                    placeholder="Why this word devalues the brand or incurs risk..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 resize-none"
                    rows={2}
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
                  >
                    Save Terminology Rule
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
