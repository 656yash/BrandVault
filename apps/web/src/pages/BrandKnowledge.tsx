import React, { useState, useRef } from 'react';
import { 
  BookOpen, 
  FileCheck, 
  SpellCheck, 
  Plus, 
  Check, 
  CheckCircle2,
  Palette, 
  ShieldCheck, 
  Trash2, 
  AlertOctagon, 
  AlertTriangle, 
  Info, 
  X, 
  Upload, 
  Download, 
  Sparkles,
  Mic,
  MessageSquare,
  Compass,
  Volume2
} from 'lucide-react';
import type { 
  BrandWorkspace, 
  Guideline, 
  ApprovedFact, 
  TerminologyRule, 
  ApprovedClaim, 
  BrandAsset 
} from '@brandvault/shared';
import { ChromeShield, ChromePaperPlane } from '../components/ChromeIcons';

interface Props {
  brand?: BrandWorkspace | null;
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

export type KnowledgeTab = 'guidelines' | 'voice' | 'facts' | 'claims' | 'terminology' | 'assets';

export const BrandKnowledge: React.FC<Props> = ({
  brand,
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
  const [activeTab, setActiveTabState] = useState<KnowledgeTab>(() => {
    try {
      const saved = localStorage.getItem('bv_knowledge_tab') as KnowledgeTab;
      const valid: KnowledgeTab[] = ['guidelines', 'voice', 'facts', 'claims', 'terminology', 'assets'];
      if (saved && valid.includes(saved)) return saved;
    } catch {}
    return 'guidelines';
  });

  const setActiveTab = (tab: KnowledgeTab) => {
    setActiveTabState(tab);
    try {
      localStorage.setItem('bv_knowledge_tab', tab);
    } catch {}
  };

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
      brandId: brand?.id || 'brand_easya1',
      title: newTitle,
      category: newCategory,
      description: newDescription,
      rules: newRules.split('\n').filter(r => r.trim().length > 0),
      version: 1,
      status: 'active',
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
      brandId: brand?.id || 'brand_easya1',
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
      brandId: brand?.id || 'brand_easya1',
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
      brandId: brand?.id || 'brand_easya1',
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

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportStarterPack = async () => {
    const brandName = brand?.name || 'BrandVault';
    
    // 1. Guidelines
    await onAddGuideline({
      title: `${brandName} Tone of Voice & Technical Empathy`,
      category: 'tone',
      description: `Defines the enterprise voice for ${brandName}. Direct, empowering, transparent, and grounded in verifiable engineering reality.`,
      rules: [
        'Avoid unsubstantiated marketing puffery or exaggerated superlatives ("revolutionary", "miracle", "magic").',
        'State technical specifications accurately with verified metrics.',
        'Use inclusive, empowering second-person phrasing ("you can inspect", "empowers teams").'
      ],
      version: 1,
      status: 'active',
      effectiveDate: new Date().toISOString().split('T')[0]
    });

    await onAddGuideline({
      title: `${brandName} Commercial Claims Substantiation Policy`,
      category: 'claims',
      description: 'Requires all comparative rankings, performance multipliers, and customer success figures to cite accredited audit filings.',
      rules: [
        'Do not claim "#1" or "World\'s Best" without documented third-party benchmark citations.',
        'Always qualify percentage improvements with methodology or sample size footnotes.',
        'Uptime claims must reference real-time SLA metrics.'
      ],
      version: 1,
      status: 'active',
      effectiveDate: new Date().toISOString().split('T')[0]
    });

    // 2. Terminology
    await onAddTerminology({
      prohibitedTerm: 'revolutionary AI breakthrough',
      preferredTerm: 'validated multi-agent compliance architecture',
      reason: 'Marketing puffery degrades technical credibility and customer trust.',
      category: 'brand_voice',
      severity: 'warning'
    });

    await onAddTerminology({
      prohibitedTerm: 'competitor X is obsolete',
      preferredTerm: 'traditional legacy architectures face scalability limitations',
      reason: 'Direct disparagement of competitors is prohibited under fair advertising ethics.',
      category: 'legal_risk',
      severity: 'critical'
    });

    // 3. Facts
    await onAddFact({
      statement: `${brandName} infrastructure guarantees 99.9% uptime SLA backed by SOC 2 Type II compliance.`,
      category: 'infrastructure',
      verifiedSource: 'Annual Infrastructure Audit Report 2026',
      verifiedDate: new Date().toISOString().split('T')[0]
    });

    await onAddFact({
      statement: `Customer and brand assets are protected with AES-256 encryption at rest and zero external AI retention.`,
      category: 'security',
      verifiedSource: 'SOC 2 Type II & ISO 27001 Security Framework',
      verifiedDate: new Date().toISOString().split('T')[0]
    });

    // 4. Claims
    await onAddClaim({
      claimText: `Reduces brand compliance turnaround time by up to 65% with sub-second multi-agent diagnostics.`,
      substantiationEvidence: 'Benchmarked workflow acceleration studies across enterprise review cohorts, Q3 2026.',
      authorizedChannels: ['Digital Ads', 'Social Media', 'Press Releases', 'Website'],
      expiresAt: '2027-12-31',
      approvedBy: 'Director of Brand Governance'
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (Array.isArray(data.guidelines)) {
          for (const g of data.guidelines) await onAddGuideline(g);
        }
        if (Array.isArray(data.terminology)) {
          for (const t of data.terminology) await onAddTerminology(t);
        }
        if (Array.isArray(data.facts)) {
          for (const f of data.facts) await onAddFact(f);
        }
        if (Array.isArray(data.claims)) {
          for (const c of data.claims) await onAddClaim(c);
        }
        alert('Rules successfully imported from JSON file!');
      } catch (err) {
        alert('Invalid JSON file format. Please ensure valid guideline/rule schema.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="relative space-y-8 pb-16">
      {/* Hidden file input for JSON rule import */}
      <input
        type="file"
        ref={fileInputRef}
        accept=".json"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <ChromeShield className="w-8 h-8 filter drop-shadow-[0_4px_10px_rgba(205,180,219,0.5)]" />
            <div>
              <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight font-sans">
                Brand Knowledge Centre
              </h1>
              <p className="text-xs text-slate-600 font-medium">
                Guidelines, brand voice pillars, substantiated claims, terminology dictionaries, and verified facts for <span className="font-bold text-slate-800">{brand?.name || 'Brand Workspace'}</span>.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleImportStarterPack}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white/70 hover:bg-white text-slate-800 font-bold text-xs border border-white shadow-sm transition-all hover:scale-105 cursor-pointer"
            title="Import ready-to-use enterprise brand guidelines, terminology rules, and facts"
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-600" />
            <span>Import Starter Pack</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white/70 hover:bg-white text-slate-800 font-bold text-xs border border-white shadow-sm transition-all hover:scale-105 cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-slate-700" />
            <span>Upload JSON</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="glass-button flex items-center gap-2 px-5 py-2.5 rounded-full text-slate-900 font-bold text-xs shadow-lg hover:scale-105 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>
              {activeTab === 'guidelines' ? 'Add Guideline' :
               activeTab === 'voice' ? 'Add Voice Principle' :
               activeTab === 'terminology' ? 'Add Term Rule' :
               activeTab === 'facts' ? 'Add Verified Fact' :
               activeTab === 'claims' ? 'Add Approved Claim' : 'Add Brand Item'}
            </span>
          </button>
        </div>
      </div>

      {/* Adwise Capsule Tabs (6 Full Tabs from Section 9) */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-full glass-capsule w-fit overflow-x-auto max-w-full">
        <button
          onClick={() => setActiveTab('guidelines')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'guidelines'
              ? 'sidebar-active text-slate-900'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/30'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Brand Guidelines ({guidelines.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('voice')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'voice'
              ? 'sidebar-active text-slate-900'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/30'
          }`}
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>Brand Voice &amp; Tone</span>
        </button>

        <button
          onClick={() => setActiveTab('facts')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'facts'
              ? 'sidebar-active text-slate-900'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/30'
          }`}
        >
          <FileCheck className="w-3.5 h-3.5" />
          <span>Approved Facts ({facts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('claims')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'claims'
              ? 'sidebar-active text-slate-900'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/30'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Approved Claims ({claims.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('terminology')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'terminology'
              ? 'sidebar-active text-slate-900'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/30'
          }`}
        >
          <SpellCheck className="w-3.5 h-3.5" />
          <span>Terminology ({terminology.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('assets')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'assets'
              ? 'sidebar-active text-slate-900'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/30'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Brand Assets ({assets.length})</span>
        </button>
      </div>

      {/* Tab 1: Guidelines List in Adwise Glass Panels */}
      {activeTab === 'guidelines' && (
        guidelines.length === 0 ? (
          <div className="glass-panel p-12 text-center space-y-4 shadow-lg">
            <div className="w-14 h-14 mx-auto rounded-3xl bg-pink-soft/30 border border-white flex items-center justify-center text-pink-600 shadow-sm">
              <BookOpen className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">No Brand Guidelines Configured</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto mt-1">
                Add your brand voice, tone, positioning, and visual guidelines using the "+ Add Guideline" button above or import the starter pack.
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="glass-button px-6 py-2.5 rounded-full text-xs font-bold shadow-md hover:scale-105 transition-all cursor-pointer"
            >
              + Add First Guideline
            </button>
          </div>
        ) : (
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
        )
      )}

      {/* Tab 2: Brand Voice & Tone (Section 9 dedicated tab) */}
      {activeTab === 'voice' && (
        <div className="space-y-6">
          {/* Brand Voice Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="glass-panel p-5 space-y-2 border border-white">
              <span className="text-[10px] font-mono uppercase tracking-wider text-purple-700 font-bold">Voice Pillar 01</span>
              <h4 className="text-sm font-bold text-slate-900">Empowering &amp; Clear</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Prioritize straightforward language. Avoid convoluted jargon and empower users to make educated, confident decisions.
              </p>
            </div>

            <div className="glass-panel p-5 space-y-2 border border-white">
              <span className="text-[10px] font-mono uppercase tracking-wider text-purple-700 font-bold">Voice Pillar 02</span>
              <h4 className="text-sm font-bold text-slate-900">Verifiable &amp; Grounded</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Anchor all performance statements in documented fact. Never rely on marketing hype or exaggerated claims.
              </p>
            </div>

            <div className="glass-panel p-5 space-y-2 border border-white">
              <span className="text-[10px] font-mono uppercase tracking-wider text-purple-700 font-bold">Voice Pillar 03</span>
              <h4 className="text-sm font-bold text-slate-900">Empathic &amp; Supportive</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Acknowledge user challenges with understanding. Maintain a warm, encouraging, human-centric cadence.
              </p>
            </div>

            <div className="glass-panel p-5 space-y-2 border border-white">
              <span className="text-[10px] font-mono uppercase tracking-wider text-purple-700 font-bold">Voice Pillar 04</span>
              <h4 className="text-sm font-bold text-slate-900">Forward-Looking</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Demonstrate thoughtful innovation and modern rigor without using hyperbolic buzzwords like "magic".
              </p>
            </div>
          </div>

          {/* Do's and Don'ts Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-6 space-y-4 border border-white shadow-md">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider font-mono">
                <CheckCircle2 className="w-4 h-4" />
                <span>Brand Voice Do's</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span>Use active voice: "BrandVault protects your assets" instead of "Your assets are protected".</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span>State verifiable capabilities with precise performance numbers and source attribution.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span>Highlight user agency: our platform equips human reviewers rather than replacing them.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span>Keep sentence length disciplined (15-20 words average) for optimal cross-device readability.</span>
                </li>
              </ul>
            </div>

            <div className="glass-panel-alt p-6 space-y-4 border border-white shadow-md">
              <div className="flex items-center gap-2 text-rose-700 font-bold text-xs uppercase tracking-wider font-mono">
                <AlertTriangle className="w-4 h-4" />
                <span>Brand Voice Don'ts</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                  <span>Never use unbacked superlative rankings like "India's No. 1" or "World's Best".</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                  <span>Do not disparage or mention competitor products directly in promotional copy.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                  <span>Avoid speculative guarantees like "100% guarantee", "foolproof", or "zero risk".</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                  <span>Never use condescending or overly opaque technical terminology that confuses non-engineers.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Tone Spectrum Dial for Active Workspace */}
          <div className="glass-panel p-6 space-y-4 border border-white">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
              Audience Tone Calibration Matrix for {brand?.name || 'Workspace'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-white/70 border border-white space-y-1">
                <span className="font-bold text-slate-800">Executive &amp; Regulatory</span>
                <p className="text-slate-600 text-[11px]">80% Formal • 20% Conversational. Focus on governance, audit trails, and risk reduction.</p>
              </div>
              <div className="p-4 rounded-xl bg-white/70 border border-white space-y-1">
                <span className="font-bold text-slate-800">Social Media &amp; Community</span>
                <p className="text-slate-600 text-[11px]">40% Formal • 60% Conversational. Energetic, punchy, value-driven with clear calls-to-action.</p>
              </div>
              <div className="p-4 rounded-xl bg-white/70 border border-white space-y-1">
                <span className="font-bold text-slate-800">Documentation &amp; Policy</span>
                <p className="text-slate-600 text-[11px]">90% Technical &amp; Precise. Direct, unambiguous instructions with structured checklists.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Approved Facts */}
      {activeTab === 'facts' && (
        facts.length === 0 ? (
          <div className="glass-panel p-12 text-center space-y-4 shadow-lg">
            <div className="w-14 h-14 mx-auto rounded-3xl bg-pink-soft/30 border border-white flex items-center justify-center text-pink-600 shadow-sm">
              <FileCheck className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">No Verified Corporate Facts</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto mt-1">
                Add audited corporate metrics, certifications, and operational milestones to automatically fact-check content.
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="glass-button px-6 py-2.5 rounded-full text-xs font-bold shadow-md hover:scale-105 transition-all cursor-pointer"
            >
              + Register Verified Fact
            </button>
          </div>
        ) : (
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
                  <span className="text-emerald-700 font-bold">Audited Fact</span>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Tab 4: Approved Claims */}
      {activeTab === 'claims' && (
        claims.length === 0 ? (
          <div className="glass-panel p-12 text-center space-y-4 shadow-lg">
            <div className="w-14 h-14 mx-auto rounded-3xl bg-pink-soft/30 border border-white flex items-center justify-center text-pink-600 shadow-sm">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">No Approved Claims Registered</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto mt-1">
                Register substantiated legal marketing claims with authorized documentation to protect your brand from advertising liability.
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="glass-button px-6 py-2.5 rounded-full text-xs font-bold shadow-md hover:scale-105 transition-all cursor-pointer"
            >
              + Register Approved Claim
            </button>
          </div>
        ) : (
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
        )
      )}

      {/* Tab 5: Terminology Rules Table */}
      {activeTab === 'terminology' && (
        <div className="glass-panel p-6 space-y-5 shadow-lg border border-white">
          <div className="flex items-center justify-between pb-3 border-b border-white/40">
            <div>
              <h3 className="text-base font-bold text-slate-800">Active Terminology Dictionary</h3>
              <p className="text-xs text-slate-600">Deterministic dictionary rules and semantic pattern matching for prohibited words.</p>
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
                {terminology.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500 font-medium">
                      No prohibited terminology rules added yet. Click "+ Add Rule" to enforce approved brand vocabulary.
                    </td>
                  </tr>
                ) : (
                  terminology.map((t) => (
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 6: Brand Assets */}
      {activeTab === 'assets' && (
        assets.length === 0 ? (
          <div className="glass-panel p-12 text-center space-y-4 shadow-lg border border-white">
            <div className="w-14 h-14 mx-auto rounded-3xl bg-pink-soft/30 border border-white flex items-center justify-center text-pink-600 shadow-sm">
              <Palette className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">No Design Assets Uploaded</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto mt-1">
                Store approved vector logos, clear-space specifications, and brand marks for automated visual compliance checks.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {assets.map((a) => (
              <div
                key={a.id}
                className="glass-panel p-6 space-y-4 shadow-md border border-white"
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
        )
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
                {activeTab === 'guidelines' || activeTab === 'voice' ? 'Register New Brand Guideline' :
                 activeTab === 'terminology' ? 'Add Prohibited Term & Suggestion' :
                 activeTab === 'facts' ? 'Register Verified Corporate Fact' : 'Register Approved Claim'}
              </h2>
            </div>

            {/* Guideline Form */}
            {(activeTab === 'guidelines' || activeTab === 'voice') && (
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
                      <option value="tone">Brand Tone &amp; Voice</option>
                      <option value="claims">Promotional Claims</option>
                      <option value="visual">Visual &amp; Design</option>
                      <option value="accessibility">Accessibility (WCAG)</option>
                      <option value="legal">Legal &amp; Liability</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Policy Description</label>
                  <textarea
                    rows={2}
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Defines brand standards across marketing and communications..."
                    className="w-full bg-white/80 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-soft resize-none font-medium shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Enforceable Rules (One per line)</label>
                  <textarea
                    rows={3}
                    value={newRules}
                    onChange={(e) => setNewRules(e.target.value)}
                    placeholder="Avoid superlatives&#10;Include verifiable metrics&#10;Follow tone pillars"
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
                    Save Guideline
                  </button>
                </div>
              </form>
            )}

            {/* Terminology Form */}
            {activeTab === 'terminology' && (
              <form onSubmit={handleCreateTerminology} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 mb-1 font-bold">Prohibited Term or Phrase</label>
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
                    placeholder={`e.g. ${brand?.name || 'Company'} corporate milestone, credential, or verified organizational statement.`}
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
