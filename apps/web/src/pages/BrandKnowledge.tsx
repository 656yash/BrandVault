import React, { useState } from 'react';
import { 
  BookOpen, 
  FileCheck, 
  SpellCheck, 
  Plus, 
  Check, 
  Palette, 
  ShieldCheck
} from 'lucide-react';
import type { 
  Guideline, 
  ApprovedFact, 
  TerminologyRule, 
  ApprovedClaim, 
  BrandAsset 
} from '@brandvault/shared';
import { ChromeShield, ChromePaperPlane } from '../components/ChromeIcons';

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
                Single Source of Truth
              </div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight font-sans">
                Brand Knowledge Base
              </h1>
            </div>
          </div>
          <p className="text-xs text-slate-400 max-w-xl">
            Central repository of approved corporate facts, terminology dictionaries, and visual guidelines grounding BrandVault AI.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-slate-950 font-bold text-xs shadow-xl shadow-amber-500/20 hover:scale-105 transition-all cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4 text-slate-950" />
          <span>Add Grounding Rule</span>
        </button>
      </div>

      {/* Tabs styled as sleek capsule container */}
      <div className="flex items-center gap-1.5 p-1.5 bg-[#121217] rounded-full border border-white/10 w-fit overflow-x-auto">
        {[
          { id: 'guidelines', label: `Guidelines (${guidelines.length})`, icon: BookOpen },
          { id: 'terminology', label: `Terminology (${terminology.length})`, icon: SpellCheck },
          { id: 'facts', label: `Corporate Facts (${facts.length})`, icon: ShieldCheck },
          { id: 'claims', label: `Approved Claims (${claims.length})`, icon: FileCheck },
          { id: 'assets', label: `Visual Identity`, icon: Palette },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[#1e1e27] text-white border border-white/20 shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {guidelines.map((g) => (
            <div key={g.id} className="p-6 rounded-3xl bg-[#0e0e13] border border-white/[0.07] space-y-4 shadow-xl">
              <div className="flex items-start justify-between gap-2">
                <div className="gold-bar">
                  <span className="text-[10px] px-2 py-0.5 rounded-full uppercase font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    {g.category}
                  </span>
                  <h3 className="text-base font-bold text-white mt-1.5">{g.title}</h3>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">V{g.version} • {g.status}</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{g.description}</p>

              <div className="space-y-2 pt-3 border-t border-white/[0.06]">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Governing Rules</span>
                <ul className="space-y-1.5">
                  {g.rules.map((rule, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
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
        <div className="p-6 rounded-3xl bg-[#0e0e13] border border-white/[0.07] space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <div className="gold-bar">
              <h3 className="text-sm font-bold text-white">Brand Terminology Dictionary</h3>
              <p className="text-xs text-slate-400">Strictly prohibited vs approved replacements</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#121217] text-slate-400 text-[10px] uppercase font-mono border-b border-white/5">
                <tr>
                  <th className="py-3 px-4">Prohibited Phrase</th>
                  <th className="py-3 px-4">Preferred Replacement</th>
                  <th className="py-3 px-4">Severity</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Governance Rationale</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {terminology.map((t) => (
                  <tr key={t.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-rose-400 bg-rose-950/40 border border-rose-900/40 px-2.5 py-1 rounded-lg">
                        &quot;{t.prohibitedTerm}&quot;
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-900/40 px-2.5 py-1 rounded-lg">
                        &quot;{t.preferredTerm}&quot;
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] font-bold uppercase font-mono px-2 py-0.5 rounded-full ${
                        t.severity === 'critical' ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30' :
                        t.severity === 'warning' ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' :
                        'bg-[#1a1a24] text-slate-300'
                      }`}>
                        {t.severity}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 capitalize font-mono text-[11px]">
                      {t.category.replace('_', ' ')}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 text-[11px] max-w-sm">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {facts.map((f) => (
            <div key={f.id} className="p-6 rounded-3xl bg-[#0e0e13] border border-white/[0.07] space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#181822] text-amber-400 border border-amber-500/20 uppercase font-bold">
                  {f.category}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Key: {f.factKey}</span>
              </div>
              <p className="text-sm font-semibold text-white leading-relaxed">{f.statement}</p>
              <div className="pt-3 text-[11px] text-slate-400 flex items-center justify-between border-t border-white/[0.06]">
                <span>Verified Source: <strong className="text-slate-200">{f.verifiedSource}</strong></span>
                <span className="font-mono text-[10px] text-amber-400">{f.verifiedDate}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Approved Claims */}
      {activeTab === 'claims' && (
        <div className="space-y-5">
          {claims.map((c) => (
            <div key={c.id} className="p-6 rounded-3xl bg-[#0e0e13] border border-white/[0.07] space-y-4 shadow-xl">
              <div className="flex items-start justify-between">
                <div className="gold-bar space-y-1">
                  <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold">
                    Substantiated Claim
                  </span>
                  <h3 className="text-base font-bold text-white mt-1">&quot;{c.claimText}&quot;</h3>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">Expires: {c.expiresAt}</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#14141c] border border-white/5 space-y-1 text-xs">
                <div className="text-[10px] font-bold text-amber-400 uppercase tracking-widest font-mono">Substantiation Evidence</div>
                <p className="text-slate-300 leading-relaxed">{c.substantiationEvidence}</p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 font-mono">
                <span>Authorized: <strong className="text-slate-300">{c.authorizedChannels.join(', ')}</strong></span>
                <span>Approved By: <strong className="text-amber-400">{c.approvedBy}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 5: Assets & Visual Identity (as seen in Image 4, 5, 6) */}
      {activeTab === 'assets' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-[#0e0e13] border border-white/[0.07] space-y-5 shadow-xl">
            <div className="gold-bar">
              <h3 className="text-sm font-bold text-white">Verified Brand Color Tokens</h3>
              <p className="text-xs text-slate-400">Strictly enforced across digital marketing copy</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2 text-center">
                <div className="h-20 rounded-2xl bg-[#4F46E5] shadow-lg flex items-center justify-center font-mono text-white text-xs font-bold border border-white/10">
                  #4F46E5
                </div>
                <div className="text-xs font-semibold text-white">Primary Indigo</div>
                <div className="text-[10px] text-slate-500">Headers &amp; UI</div>
              </div>

              <div className="space-y-2 text-center">
                <div className="h-20 rounded-2xl bg-[#06B6D4] shadow-lg flex items-center justify-center font-mono text-slate-950 text-xs font-bold border border-white/10">
                  #06B6D4
                </div>
                <div className="text-xs font-semibold text-white">Secondary Cyan</div>
                <div className="text-[10px] text-slate-500">Badges &amp; Metrics</div>
              </div>

              <div className="space-y-2 text-center">
                <div className="h-20 rounded-2xl bg-[#10B981] shadow-lg flex items-center justify-center font-mono text-white text-xs font-bold border border-white/10">
                  #10B981
                </div>
                <div className="text-xs font-semibold text-white">Accent Emerald</div>
                <div className="text-[10px] text-slate-500">Approval Seals</div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#0e0e13] border border-white/[0.07] space-y-5 shadow-xl">
            <div className="gold-bar">
              <h3 className="text-sm font-bold text-white">Typography &amp; Layout Constraints</h3>
              <p className="text-xs text-slate-400">WCAG 2.1 AA legibility requirements</p>
            </div>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3.5 rounded-2xl bg-[#14141c] border border-white/5">
                <div className="font-semibold text-white">Header Typography: Outfit / Plus Jakarta Sans</div>
                <div className="text-[11px] text-slate-400">Strictly 600 or 700 weight for executive clarity.</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#14141c] border border-white/5">
                <div className="font-semibold text-white">Body Typography: Inter / Plus Jakarta Sans</div>
                <div className="text-[11px] text-slate-400">Minimum 14px size for WCAG 2.1 AA legibility.</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#14141c] border border-white/5">
                <div className="font-semibold text-white">Logo Clear-Space: 24px Perimeter Padding</div>
                <div className="text-[11px] text-slate-400">No background text or graphics encroaching inside perimeter.</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg bg-[#0e0e13] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <h3 className="text-base font-bold text-white">Add Brand Grounding Source</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
            </div>

            <div className="flex gap-2 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('guidelines')}
                className="px-3.5 py-1.5 rounded-full bg-amber-500 text-slate-950 font-bold"
              >
                Add Guideline
              </button>
              <button
                onClick={() => setActiveTab('terminology')}
                className="px-3.5 py-1.5 rounded-full bg-[#181824] text-slate-300 border border-white/10"
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
                    className="w-full bg-[#14141c] border border-white/10 rounded-xl p-3 text-slate-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-[#14141c] border border-white/10 rounded-xl p-3 text-slate-200"
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
                    className="w-full bg-[#14141c] border border-white/10 rounded-xl p-3 text-slate-200 resize-none"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Rules (one per line)</label>
                  <textarea
                    value={newRules}
                    onChange={(e) => setNewRules(e.target.value)}
                    placeholder="Rule 1: Always cite sources&#10;Rule 2: Never promise 100% guarantees"
                    className="w-full bg-[#14141c] border border-white/10 rounded-xl p-3 text-slate-200 resize-none"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-full bg-[#181824] text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
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
                    className="w-full bg-[#14141c] border border-white/10 rounded-xl p-3 text-slate-200"
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
                    className="w-full bg-[#14141c] border border-white/10 rounded-xl p-3 text-slate-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Severity</label>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value as any)}
                    className="w-full bg-[#14141c] border border-white/10 rounded-xl p-3 text-slate-200"
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
                    className="w-full bg-[#14141c] border border-white/10 rounded-xl p-3 text-slate-200 resize-none"
                    rows={2}
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-full bg-[#181824] text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
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
