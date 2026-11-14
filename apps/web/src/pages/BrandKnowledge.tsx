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
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <ChromeShield className="w-8 h-8 filter drop-shadow-[0_4px_10px_rgba(205,180,219,0.5)]" />
            <div>
              <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight font-sans">
                Brand Knowledge Base
              </h1>
              <p className="text-xs text-slate-600 font-medium">
                Guidelines, substantiated claims, terminology dictionaries, and verified corporate facts.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="glass-button flex items-center gap-2 px-6 py-3 rounded-full text-slate-900 font-bold text-xs shadow-lg hover:scale-105 transition-all cursor-pointer"
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

      {/* Adwise Capsule Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-full glass-capsule w-fit overflow-x-auto max-w-full">
        <button
          onClick={() => setActiveTab('guidelines')}
          className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'guidelines'
              ? 'sidebar-active text-slate-900'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/30'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Brand Guidelines ({guidelines.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('terminology')}
          className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'terminology'
              ? 'sidebar-active text-slate-900'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/30'
          }`}
        >
          <SpellCheck className="w-3.5 h-3.5" />
          <span>Terminology Rules ({terminology.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('facts')}
          className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'facts'
              ? 'sidebar-active text-slate-900'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/30'
          }`}
        >
          <FileCheck className="w-3.5 h-3.5" />
          <span>Corporate Facts ({facts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('claims')}
          className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'claims'
              ? 'sidebar-active text-slate-900'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/30'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Approved Claims ({claims.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('assets')}
          className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'assets'
              ? 'sidebar-active text-slate-900'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/30'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Design Assets ({assets.length})</span>
        </button>
      </div>

      {/* Tab 1: Guidelines List in Adwise Glass Panels */}
      {activeTab === 'guidelines' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guidelines.map((g, idx) => (
            <div
              key={g.id}
              className={`${idx % 2 === 0 ? 'glass-panel' : 'glass-panel-alt'} p-6 flex flex-col justify-between space-y-4 hover:scale-[1.01] transition-transform duration-300 shadow-md group`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-purple-100 text-purple-700 font-bold border border-purple-200">
                    {g.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-500 font-bold">V{g.version}</span>
                    <button
                      onClick={() => onDeleteGuideline(g.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-white/60 transition-all cursor-pointer"
                      title="Delete Guideline"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-800 tracking-tight">{g.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">{g.description}</p>

                <div className="pt-2 border-t border-white/50 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">Rules:</span>
                  <ul className="space-y-1">
                    {g.rules.map((rule, rIdx) => (
                      <li key={rIdx} className="text-[11px] text-slate-700 flex items-start gap-2 font-medium">
                        <span className="text-pink-500 mt-1 font-bold">•</span>
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-3 border-t border-white/50 flex items-center justify-between text-[10px] text-slate-500 font-mono font-semibold">
                <span>Effective: {g.effectiveDate}</span>
                <span className="text-emerald-700 uppercase font-bold tracking-wider">{g.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Terminology Rules Table (Adwise Table style) */}
      {activeTab === 'terminology' && (
        <div className="glass-panel p-6 space-y-5 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-white/40">
            <div>
              <h3 className="text-base font-bold text-slate-800">Active Terminology Dictionary</h3>
              <p className="text-xs text-slate-600">Deterministic string and semantic pattern matching for prohibited words.</p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-600">{terminology.length} rules loaded</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/40 text-slate-500 uppercase text-[10px] font-mono font-bold tracking-wider">
                  <th className="p-4 font-bold">Prohibited Phrase</th>
                  <th className="p-4 font-bold">Preferred Alternative</th>
                  <th className="p-4 font-bold">Severity</th>
                  <th className="p-4 font-bold">Policy Rationale</th>
                  <th className="p-4 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {terminology.map((t) => (
                  <tr key={t.id} className="border-b border-white/20 hover:bg-white/40 transition-colors group">
                    <td className="p-4 font-mono font-bold text-rose-700">
                      "{t.prohibitedTerm}"
                    </td>
                    <td className="p-4 font-semibold text-emerald-800">
                      "{t.preferredTerm}"
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold ${
                        t.severity === 'critical' ? 'bg-rose-100 text-rose-700 border border-rose-300' :
                        t.severity === 'warning' ? 'bg-purple-100 text-purple-700 border border-purple-300' :
                        'bg-blue-100 text-blue-700 border border-blue-300'
                      }`}>
                        {t.severity}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600 text-xs max-w-md font-medium">
                      {t.reason}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => onDeleteTerminology(t.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-white/60 transition-all cursor-pointer"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facts.map((f, idx) => (
            <div
              key={f.id}
              className={`${idx % 2 === 0 ? 'glass-panel' : 'glass-panel-alt'} p-6 flex flex-col justify-between space-y-4 shadow-md hover:scale-[1.01] transition-transform duration-300 group`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-blue-100 text-blue-700 font-bold border border-blue-200">
                    {f.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-500 font-bold">{f.factKey}</span>
                    <button
                      onClick={() => onDeleteFact(f.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-white/60 transition-all cursor-pointer"
                      title="Delete Fact"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-sm font-bold text-slate-800 leading-relaxed">
                  "{f.statement}"
                </p>

                <div className="pt-2 border-t border-white/50 space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">Verified Source:</span>
                  <div className="text-xs text-slate-700 font-mono bg-white/60 p-2.5 rounded-xl border border-white font-medium">
                    {f.verifiedSource}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/50 flex items-center justify-between text-[10px] text-slate-500 font-mono font-semibold">
                <span>Verified: {f.verifiedDate}</span>
                <span className="text-emerald-700 font-bold">SOC 2 Grounded</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Approved Claims */}
      {activeTab === 'claims' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {claims.map((c, idx) => (
            <div
              key={c.id}
              className={`${idx % 2 === 0 ? 'glass-panel' : 'glass-panel-alt'} p-6 flex flex-col justify-between space-y-4 shadow-md hover:scale-[1.01] transition-transform duration-300 group`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-pink-100 text-pink-700 font-bold border border-pink-200">
                    Substantiated Claim
                  </span>
                  <button
                    onClick={() => onDeleteClaim(c.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-white/60 transition-all cursor-pointer"
                    title="Delete Claim"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-base font-bold text-slate-800 leading-relaxed">
                  "{c.claimText}"
                </p>

                <div className="p-3.5 rounded-2xl bg-white/60 border border-white space-y-1.5 shadow-sm">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">Documented Evidence:</span>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {c.substantiationEvidence}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-white/50 flex items-center justify-between text-[10px] text-slate-500 font-mono font-semibold">
                <span>Approved By: {c.approvedBy}</span>
                <span>Expires: {c.expiresAt}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 5: Brand Assets */}
      {activeTab === 'assets' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {assets.map((a) => (
            <div
              key={a.id}
              className="glass-panel p-6 space-y-4 shadow-md"
            >
              <div className="h-40 rounded-2xl bg-white/70 border border-white flex items-center justify-center p-4 shadow-inner">
                <ChromeShield className="w-20 h-20 filter drop-shadow-[0_4px_12px_rgba(205,180,219,0.5)]" />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-mono uppercase tracking-wider text-purple-700 font-bold">{a.type}</div>
                <h3 className="text-sm font-bold text-slate-800">{a.name}</h3>
              </div>
              <div className="pt-2 border-t border-white/50 text-[11px] text-slate-600 space-y-1 font-mono font-semibold">
                <div>Clear space requirement: <span className="text-slate-800">{a.metadata?.minimumClearSpacePx}px</span></div>
                <div>Format: <span className="text-slate-800">{a.metadata?.mimeType}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl glass-panel bg-white/95 p-7 shadow-2xl text-slate-800 space-y-5 border border-white">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-800 transition-colors p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="text-xs uppercase font-mono tracking-widest text-pink-600 font-bold">
                Governance Rule Registry
              </div>
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight mt-1">
                {activeTab === 'guidelines' ? 'Register New Brand Guideline' :
                 activeTab === 'terminology' ? 'Add Prohibited Term & Suggestion' :
                 activeTab === 'facts' ? 'Register Verified Corporate Fact' : 'Register Approved Claim'}
              </h2>
            </div>

            {/* Guideline Form */}
            {activeTab === 'guidelines' && (
              <form onSubmit={handleCreateGuideline} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Guideline Title</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Tone of Voice & Technical Empathy"
                    className="w-full bg-white/80 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-soft font-medium shadow-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 mb-1 font-bold">Compliance Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full bg-white/80 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-soft font-medium shadow-sm"
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
                  <label className="block text-slate-700 mb-1 font-bold">Policy Description</label>
                  <textarea
                    rows={2}
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Explain the brand context and governing principle..."
                    className="w-full bg-white/80 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-soft resize-none font-medium shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Actionable Rules (One per line)</label>
                  <textarea
                    rows={3}
                    value={newRules}
                    onChange={(e) => setNewRules(e.target.value)}
                    placeholder="Always write in active voice&#10;Never use unsubstantiated superlative claims"
                    className="w-full bg-white/80 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-soft resize-none font-medium shadow-sm"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-5 py-2.5 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="glass-button px-6 py-2.5 rounded-full text-slate-900 font-bold shadow-lg hover:scale-105 transition-all cursor-pointer"
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
                    <label className="block text-slate-700 mb-1 font-bold">Prohibited Term / Phrase</label>
                    <input
                      type="text"
                      required
                      value={newProhibited}
                      onChange={(e) => setNewProhibited(e.target.value)}
                      placeholder="e.g. cheap, 100% uptime"
                      className="w-full bg-white/80 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-soft font-medium shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1 font-bold">Preferred Alternative</label>
                    <input
                      type="text"
                      required
                      value={newPreferred}
                      onChange={(e) => setNewPreferred(e.target.value)}
                      placeholder="e.g. cost-effective, 99.99% availability"
                      className="w-full bg-white/80 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-soft font-medium shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Severity</label>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value as any)}
                    className="w-full bg-white/80 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-soft font-medium shadow-sm"
                  >
                    <option value="critical">Critical (Blocks Publication)</option>
                    <option value="warning">Warning (Review Recommended)</option>
                    <option value="suggestion">Suggestion (Tone Enhancement)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Why is this prohibited?</label>
                  <textarea
                    rows={2}
                    value={newReason}
                    onChange={(e) => setNewReason(e.target.value)}
                    placeholder="Devalues enterprise premium positioning..."
                    className="w-full bg-white/80 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-soft resize-none font-medium shadow-sm"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-5 py-2.5 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="glass-button px-6 py-2.5 rounded-full text-slate-900 font-bold shadow-lg hover:scale-105 transition-all cursor-pointer"
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
                  <label className="block text-slate-700 mb-1 font-bold">Verified Corporate Statement</label>
                  <textarea
                    rows={2}
                    required
                    value={newFactStatement}
                    onChange={(e) => setNewFactStatement(e.target.value)}
                    placeholder="e.g. Nexus infrastructure operates across 4 primary cloud regions: Mumbai, Singapore, Frankfurt, and San Jose."
                    className="w-full bg-white/80 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-soft resize-none font-medium shadow-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 mb-1 font-bold">Fact Category</label>
                    <select
                      value={newFactCategory}
                      onChange={(e) => setNewFactCategory(e.target.value as any)}
                      className="w-full bg-white/80 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-soft font-medium shadow-sm"
                    >
                      <option value="corporate">Corporate &amp; Leadership</option>
                      <option value="product">Product &amp; Technical</option>
                      <option value="financial">Financial &amp; Metrics</option>
                      <option value="legal">Legal &amp; Compliance</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1 font-bold">Fact Reference Key</label>
                    <input
                      type="text"
                      value={newFactKey}
                      onChange={(e) => setNewFactKey(e.target.value)}
                      placeholder="e.g. cloud_regions"
                      className="w-full bg-white/80 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-soft font-medium shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Verification Source Document</label>
                  <input
                    type="text"
                    value={newFactSource}
                    onChange={(e) => setNewFactSource(e.target.value)}
                    placeholder="e.g. Global Datacenter Operations Report Q4 2025"
                    className="w-full bg-white/80 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-soft font-medium shadow-sm"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-5 py-2.5 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="glass-button px-6 py-2.5 rounded-full text-slate-900 font-bold shadow-lg hover:scale-105 transition-all cursor-pointer"
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
                  <label className="block text-slate-700 mb-1 font-bold">Claim Text</label>
                  <input
                    type="text"
                    required
                    value={newClaimText}
                    onChange={(e) => setNewClaimText(e.target.value)}
                    placeholder="e.g. Accelerates content review cycles by up to 65%"
                    className="w-full bg-white/80 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-soft font-medium shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Substantiation Evidence</label>
                  <textarea
                    rows={2}
                    value={newClaimEvidence}
                    onChange={(e) => setNewClaimEvidence(e.target.value)}
                    placeholder="Verified study details or third-party audit attribution..."
                    className="w-full bg-white/80 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-soft resize-none font-medium shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Authorized Channels (comma separated)</label>
                  <input
                    type="text"
                    value={newClaimChannels}
                    onChange={(e) => setNewClaimChannels(e.target.value)}
                    placeholder="LinkedIn, Press Releases, Website"
                    className="w-full bg-white/80 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-soft font-medium shadow-sm"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-5 py-2.5 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="glass-button px-6 py-2.5 rounded-full text-slate-900 font-bold shadow-lg hover:scale-105 transition-all cursor-pointer"
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
