import React, { useState } from 'react';
import { 
  BookOpen, 
  FileCheck, 
  SpellCheck, 
  Plus, 
  Check, 
  Palette, 
  ShieldCheck,
  Trash2,
  AlertOctagon,
  AlertTriangle,
  Info,
  X
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
  onDeleteGuideline: (id: string) => Promise<any>;
  onAddFact: (f: any) => Promise<any>;
  onDeleteFact: (id: string) => Promise<any>;
  onAddTerminology: (t: any) => Promise<any>;
  onDeleteTerminology: (id: string) => Promise<any>;
  onAddClaim: (c: any) => Promise<any>;
  onDeleteClaim: (id: string) => Promise<any>;
}

export const BrandKnowledge: React.FC<Props> = ({
  guidelines,
  facts,
  terminology,
  claims,
  assets,
  onAddGuideline,
  onDeleteGuideline,
  onAddFact,
  onDeleteFact,
  onAddTerminology,
  onDeleteTerminology,
  onAddClaim,
  onDeleteClaim,
}) => {
  const [activeTab, setActiveTab] = useState<'guidelines' | 'terminology' | 'facts' | 'claims' | 'assets'>('guidelines');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);

  // Guideline Form
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'tone' | 'claims' | 'visual' | 'accessibility' | 'legal'>('tone');
  const [newDescription, setNewDescription] = useState('');
  const [newRules, setNewRules] = useState('');

  // Terminology Form
  const [newProhibited, setNewProhibited] = useState('');
  const [newPreferred, setNewPreferred] = useState('');
  const [newReason, setNewReason] = useState('');
  const [newSeverity, setNewSeverity] = useState<'critical' | 'warning' | 'suggestion'>('warning');

  // Fact Form
  const [newFactKey, setNewFactKey] = useState('');
  const [newFactStatement, setNewFactStatement] = useState('');
  const [newFactCategory, setNewFactCategory] = useState<'corporate' | 'product' | 'financial' | 'legal'>('corporate');
  const [newFactSource, setNewFactSource] = useState('');

  // Claim Form
  const [newClaimText, setNewClaimText] = useState('');
  const [newClaimEvidence, setNewClaimEvidence] = useState('');
  const [newClaimChannels, setNewClaimChannels] = useState('');

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

  const handleCreateFact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFactStatement.trim()) return;
    await onAddFact({
      brandId: 'brand_nexus',
      factKey: newFactKey || `fact_${Date.now()}`,
      statement: newFactStatement,
      category: newFactCategory,
      verifiedSource: newFactSource || 'Corporate Legal Filing',
      verifiedDate: new Date().toISOString().split('T')[0],
    });
    setNewFactKey('');
    setNewFactStatement('');
    setNewFactSource('');
    setShowAddModal(false);
  };

  const handleCreateClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClaimText.trim()) return;
    await onAddClaim({
      claimText: newClaimText,
      substantiationEvidence: newClaimEvidence,
      authorizedChannels: newClaimChannels ? newClaimChannels.split(',').map(s => s.trim()) : ['All channels'],
      expiresAt: '2027-12-31',
    });
    setNewClaimText('');
    setNewClaimEvidence('');
    setNewClaimChannels('');
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
            <ChromeShield className="w-8 h-8 filter drop-shadow-[0_4px_12px_rgba(255,255,255,0.15)]" />
            <div>
              <div className="text-xs uppercase font-mono tracking-widest text-zinc-400 font-semibold">
                Single Source of Truth
              </div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight font-sans">
                Brand Knowledge Base
              </h1>
            </div>
          </div>
          <p className="text-xs text-zinc-400 max-w-xl">
            Authoritative guidelines, substantiated claims, terminology dictionaries, and verified corporate facts that calibrate all BrandVault AI inspections.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black font-bold text-xs hover:bg-zinc-200 transition-all cursor-pointer shadow-lg shadow-white/5"
        >
          <Plus className="w-4 h-4" />
          <span>
            {activeTab === 'guidelines' ? 'Add Guideline' :
             activeTab === 'terminology' ? 'Add Term Rule' :
             activeTab === 'facts' ? 'Add Verified Fact' :
             activeTab === 'claims' ? 'Add Approved Claim' : 'Add Brand Item'}
          </span>
        </button>
      </div>

      {/* Glassmorphic Tabs Capsule */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl w-fit">
        <button
          onClick={() => setActiveTab('guidelines')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'guidelines'
              ? 'bg-white/15 text-white border border-white/20 shadow-sm'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Brand Guidelines ({guidelines.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('terminology')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'terminology'
              ? 'bg-white/15 text-white border border-white/20 shadow-sm'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <SpellCheck className="w-3.5 h-3.5" />
          <span>Terminology Rules ({terminology.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('facts')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'facts'
              ? 'bg-white/15 text-white border border-white/20 shadow-sm'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <FileCheck className="w-3.5 h-3.5" />
          <span>Corporate Facts ({facts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('claims')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'claims'
              ? 'bg-white/15 text-white border border-white/20 shadow-sm'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Approved Claims ({claims.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('assets')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'assets'
              ? 'bg-white/15 text-white border border-white/20 shadow-sm'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Design Assets ({assets.length})</span>
        </button>
      </div>

      {/* Tab 1: Guidelines List */}
      {activeTab === 'guidelines' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {guidelines.map((g) => (
            <div
              key={g.id}
              className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl flex flex-col justify-between space-y-4 hover:border-white/20 transition-all shadow-xl group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-white/10 text-zinc-300 border border-white/15">
                    {g.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-zinc-500">V{g.version}</span>
                    <button
                      onClick={() => onDeleteGuideline(g.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-white/5 transition-all cursor-pointer"
                      title="Delete Guideline"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white tracking-tight">{g.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{g.description}</p>

                <div className="pt-2 border-t border-white/[0.06] space-y-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-semibold">Rules:</span>
                  <ul className="space-y-1">
                    {g.rules.map((rule, idx) => (
                      <li key={idx} className="text-[11px] text-zinc-300 flex items-start gap-2">
                        <span className="text-white/40 mt-1">•</span>
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                <span>Effective: {g.effectiveDate}</span>
                <span className="text-emerald-400 uppercase font-bold tracking-wider">{g.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Terminology Rules */}
      {activeTab === 'terminology' && (
        <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-5 shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <div>
              <h3 className="text-base font-bold text-white">Active Terminology Dictionary</h3>
              <p className="text-xs text-zinc-400">Deterministic string and semantic pattern matching for prohibited words.</p>
            </div>
            <span className="text-xs font-mono text-zinc-400">{terminology.length} rules loaded</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-white/[0.02] text-zinc-400 text-[10px] uppercase font-mono border-b border-white/10">
                <tr>
                  <th className="py-3 px-4">Prohibited Phrase</th>
                  <th className="py-3 px-4">Preferred Alternative</th>
                  <th className="py-3 px-4">Severity</th>
                  <th className="py-3 px-4">Policy Rationale</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {terminology.map((t) => (
                  <tr key={t.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="py-3.5 px-4 font-mono font-bold text-rose-300">
                      "{t.prohibitedTerm}"
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-emerald-300">
                      "{t.preferredTerm}"
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold ${
                        t.severity === 'critical' ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30' :
                        t.severity === 'warning' ? 'bg-zinc-700 text-zinc-200 border border-zinc-600' :
                        'bg-white/10 text-zinc-300 border border-white/15'
                      }`}>
                        {t.severity}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-zinc-400 text-xs max-w-md">
                      {t.reason}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onDeleteTerminology(t.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-white/5 transition-all cursor-pointer"
                        title="Delete Rule"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Corporate Facts */}
      {activeTab === 'facts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {facts.map((f) => (
            <div
              key={f.id}
              className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl flex flex-col justify-between space-y-4 shadow-xl hover:border-white/20 transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-white/10 text-zinc-300 border border-white/15">
                    {f.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-zinc-500">{f.factKey}</span>
                    <button
                      onClick={() => onDeleteFact(f.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-white/5 transition-all cursor-pointer"
                      title="Delete Fact"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-sm font-semibold text-white leading-relaxed">
                  "{f.statement}"
                </p>

                <div className="pt-2 border-t border-white/[0.06] space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Verified Source:</span>
                  <div className="text-xs text-zinc-300 font-mono bg-white/[0.03] p-2 rounded-xl border border-white/5">
                    {f.verifiedSource}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                <span>Verified: {f.verifiedDate}</span>
                <span className="text-emerald-400 font-bold">SOC 2 Grounded</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Approved Claims */}
      {activeTab === 'claims' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {claims.map((c) => (
            <div
              key={c.id}
              className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl flex flex-col justify-between space-y-4 shadow-xl hover:border-white/20 transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-white/10 text-zinc-300 border border-white/15">
                    Substantiated Claim
                  </span>
                  <button
                    onClick={() => onDeleteClaim(c.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-white/5 transition-all cursor-pointer"
                    title="Delete Claim"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-base font-bold text-white leading-relaxed">
                  "{c.claimText}"
                </p>

                <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Documented Evidence:</span>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {c.substantiationEvidence}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                <span>Approved By: {c.approvedBy}</span>
                <span>Expires: {c.expiresAt}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 5: Brand Assets */}
      {activeTab === 'assets' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {assets.map((a) => (
            <div
              key={a.id}
              className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-4 shadow-xl"
            >
              <div className="h-40 rounded-2xl bg-[#09090d] border border-white/10 flex items-center justify-center p-4">
                <ChromeShield className="w-20 h-20 filter drop-shadow-[0_4px_16px_rgba(255,255,255,0.2)]" />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-mono uppercase tracking-wider text-zinc-400">{a.type}</div>
                <h3 className="text-sm font-bold text-white">{a.name}</h3>
              </div>
              <div className="pt-2 border-t border-white/[0.06] text-[11px] text-zinc-400 space-y-1 font-mono">
                <div>Clear space requirement: <span className="text-white">{a.metadata?.minimumClearSpacePx}px</span></div>
                <div>Format: <span className="text-white">{a.metadata?.mimeType}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-[#09090d]/95 backdrop-blur-2xl border border-white/15 rounded-3xl p-7 shadow-2xl text-slate-200 space-y-5">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-6 right-6 text-zinc-400 hover:text-white transition-colors p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="text-xs uppercase font-mono tracking-widest text-zinc-400 font-semibold">
                Governance Rule Registry
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight mt-1">
                {activeTab === 'guidelines' ? 'Register New Brand Guideline' :
                 activeTab === 'terminology' ? 'Add Prohibited Term & Suggestion' :
                 activeTab === 'facts' ? 'Register Verified Corporate Fact' : 'Register Approved Claim'}
              </h2>
            </div>

            {/* Guideline Form */}
            {activeTab === 'guidelines' && (
              <form onSubmit={handleCreateGuideline} className="space-y-4 text-xs">
                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">Guideline Title</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Tone of Voice & Technical Empathy"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-white/40"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-400 mb-1 font-semibold">Compliance Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full bg-[#121218] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-white/40"
                    >
                      <option value="tone">Brand Tone & Voice</option>
                      <option value="claims">Promotional Claims</option>
                      <option value="visual">Visual & Design</option>
                      <option value="accessibility">Accessibility (WCAG)</option>
                      <option value="legal">Legal & Liability</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">Policy Description</label>
                  <textarea
                    rows={2}
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Explain the brand context and governing principle..."
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-1 focus:ring-white/40 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">Actionable Rules (One per line)</label>
                  <textarea
                    rows={3}
                    value={newRules}
                    onChange={(e) => setNewRules(e.target.value)}
                    placeholder="Always write in active voice&#10;Never use unsubstantiated superlative claims"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-1 focus:ring-white/40 resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-full border border-white/10 text-zinc-300 hover:bg-white/5 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-white text-black font-bold hover:bg-zinc-200 transition-all cursor-pointer shadow-lg"
                  >
                    Register Guideline
                  </button>
                </div>
              </form>
            )}

            {/* Terminology Form */}
            {activeTab === 'terminology' && (
              <form onSubmit={handleCreateTerminology} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-400 mb-1 font-semibold">Prohibited Term / Phrase</label>
                    <input
                      type="text"
                      required
                      value={newProhibited}
                      onChange={(e) => setNewProhibited(e.target.value)}
                      placeholder="e.g. cheap, 100% uptime"
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-white/40"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1 font-semibold">Preferred Alternative</label>
                    <input
                      type="text"
                      required
                      value={newPreferred}
                      onChange={(e) => setNewPreferred(e.target.value)}
                      placeholder="e.g. cost-effective, 99.99% availability"
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-white/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">Severity</label>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value as any)}
                    className="w-full bg-[#121218] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-white/40"
                  >
                    <option value="critical">Critical (Blocks Publication)</option>
                    <option value="warning">Warning (Review Recommended)</option>
                    <option value="suggestion">Suggestion (Tone Enhancement)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">Why is this prohibited?</label>
                  <textarea
                    rows={2}
                    value={newReason}
                    onChange={(e) => setNewReason(e.target.value)}
                    placeholder="Devalues enterprise premium positioning..."
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-1 focus:ring-white/40 resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-full border border-white/10 text-zinc-300 hover:bg-white/5 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-white text-black font-bold hover:bg-zinc-200 transition-all cursor-pointer shadow-lg"
                  >
                    Add Term Rule
                  </button>
                </div>
              </form>
            )}

            {/* Fact Form */}
            {activeTab === 'facts' && (
              <form onSubmit={handleCreateFact} className="space-y-4 text-xs">
                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">Verified Corporate Statement</label>
                  <textarea
                    rows={2}
                    required
                    value={newFactStatement}
                    onChange={(e) => setNewFactStatement(e.target.value)}
                    placeholder="e.g. Nexus infrastructure operates across 4 primary cloud regions: Mumbai, Singapore, Frankfurt, and San Jose."
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-1 focus:ring-white/40 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-400 mb-1 font-semibold">Fact Category</label>
                    <select
                      value={newFactCategory}
                      onChange={(e) => setNewFactCategory(e.target.value as any)}
                      className="w-full bg-[#121218] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-white/40"
                    >
                      <option value="corporate">Corporate &amp; Leadership</option>
                      <option value="product">Product &amp; Technical</option>
                      <option value="financial">Financial &amp; Metrics</option>
                      <option value="legal">Legal &amp; Compliance</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1 font-semibold">Fact Reference Key</label>
                    <input
                      type="text"
                      value={newFactKey}
                      onChange={(e) => setNewFactKey(e.target.value)}
                      placeholder="e.g. cloud_regions"
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-white/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">Verification Source Document</label>
                  <input
                    type="text"
                    value={newFactSource}
                    onChange={(e) => setNewFactSource(e.target.value)}
                    placeholder="e.g. Global Datacenter Operations Report Q4 2025"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:ring-1 focus:ring-white/40"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-full border border-white/10 text-zinc-300 hover:bg-white/5 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-white text-black font-bold hover:bg-zinc-200 transition-all cursor-pointer shadow-lg"
                  >
                    Save Verified Fact
                  </button>
                </div>
              </form>
            )}

            {/* Claim Form */}
            {activeTab === 'claims' && (
              <form onSubmit={handleCreateClaim} className="space-y-4 text-xs">
                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">Claim Text</label>
                  <input
                    type="text"
                    required
                    value={newClaimText}
                    onChange={(e) => setNewClaimText(e.target.value)}
                    placeholder="e.g. Accelerates content review cycles by up to 65%"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-white/40"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">Substantiation Evidence</label>
                  <textarea
                    rows={2}
                    value={newClaimEvidence}
                    onChange={(e) => setNewClaimEvidence(e.target.value)}
                    placeholder="Verified study details or third-party audit attribution..."
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-1 focus:ring-white/40 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">Authorized Channels (comma separated)</label>
                  <input
                    type="text"
                    value={newClaimChannels}
                    onChange={(e) => setNewClaimChannels(e.target.value)}
                    placeholder="LinkedIn, Press Releases, Website"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:ring-1 focus:ring-white/40"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-full border border-white/10 text-zinc-300 hover:bg-white/5 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-white text-black font-bold hover:bg-zinc-200 transition-all cursor-pointer shadow-lg"
                  >
                    Register Approved Claim
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
