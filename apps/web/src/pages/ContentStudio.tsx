import React, { useState } from 'react';
import { 
  AlertOctagon, 
  AlertTriangle, 
  Info, 
  Check, 
  X, 
  Send, 
  RefreshCw, 
  BookOpen, 
  CheckCircle2,
  FileCheck2,
  Image as ImageIcon,
  Plus,
  Trash2
} from 'lucide-react';
import type { 
  ContentItem, 
  ComplianceFinding, 
  AnalysisReport, 
  UserRole 
} from '@brandvault/shared';
import { 
  ChromePaperPlane, 
  ChromeShield,
  TiltedSticker,
  OutlinePenTool,
  OutlineEyedropper
} from '../components/ChromeIcons';

interface Props {
  contentItems: ContentItem[];
  selectedContentId: string;
  onSelectContent: (id: string) => void;
  onScanContent: (id: string, text: string) => Promise<AnalysisReport>;
  onApplyCorrection: (finding: ComplianceFinding) => void;
  onResolveFinding: (findingId: string, decision: 'accepted' | 'rejected') => void;
  onSubmitForReview: (id: string) => void;
  onCreateContent: (item: any) => Promise<ContentItem>;
  onDeleteContent: (id: string) => Promise<boolean>;
  currentRole: UserRole;
  isScanning: boolean;
}

export const ContentStudio: React.FC<Props> = ({
  contentItems,
  selectedContentId,
  onSelectContent,
  onScanContent,
  onApplyCorrection,
  onResolveFinding,
  onSubmitForReview,
  onCreateContent,
  onDeleteContent,
  currentRole,
  isScanning,
}) => {
  const currentItem = contentItems.find(c => c.id === selectedContentId) || contentItems[0];
  const [editorText, setEditorText] = useState(currentItem?.rawContent || '');
  const [activeFilter, setActiveFilter] = useState<'all' | 'critical' | 'warning' | 'suggestion'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Content Form
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<'social_ad' | 'press_release' | 'marketing_copy' | 'newsletter' | 'text' | 'creative_image'>('social_ad');
  const [newAudience, setNewAudience] = useState('');
  const [newChannel, setNewChannel] = useState('');
  const [newContent, setNewContent] = useState('');

  React.useEffect(() => {
    if (currentItem) {
      setEditorText(currentItem.rawContent);
    }
  }, [currentItem?.id]);

  const findings = currentItem?.findings || [];
  const filteredFindings = findings.filter(f => {
    if (activeFilter === 'all') return true;
    return f.severity === activeFilter;
  });

  const criticalCount = findings.filter(f => f.severity === 'critical' && f.status === 'open').length;

  const handleScan = async () => {
    if (!currentItem) return;
    await onScanContent(currentItem.id, editorText);
  };

  const handleAcceptCorrection = (finding: ComplianceFinding) => {
    if (editorText.includes(finding.contentExcerpt)) {
      const updated = editorText.replace(finding.contentExcerpt, finding.suggestedCorrection);
      setEditorText(updated);
    }
    onApplyCorrection(finding);
    onResolveFinding(finding.id, 'accepted');
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const created = await onCreateContent({
      title: newTitle,
      contentType: newType,
      targetAudience: newAudience || 'Enterprise Decision Makers',
      targetChannel: newChannel || 'Digital Channels',
      rawContent: newContent || 'Draft copy ready for compliance pre-flight inspection.',
    });
    setNewTitle('');
    setNewAudience('');
    setNewChannel('');
    setNewContent('');
    setShowCreateModal(false);
    onSelectContent(created.id);
  };

  const handleDeleteItem = async () => {
    if (!currentItem) return;
    const confirmed = window.confirm(`Are you sure you want to remove "${currentItem.title}"?`);
    if (confirmed) {
      await onDeleteContent(currentItem.id);
    }
  };

  return (
    <div className="relative space-y-8 pb-16">
      {/* Studio Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <ChromePaperPlane className="w-8 h-8 filter drop-shadow-[0_4px_10px_rgba(205,180,219,0.5)]" />
            <div>
              <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight font-sans">
                Content Inspection Studio
              </h1>
              <p className="text-xs text-slate-600 font-medium">
                Multi-agent pre-flight analysis across voice, terminology, facts, and legal claims.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <select
              value={currentItem?.id}
              onChange={(e) => onSelectContent(e.target.value)}
              className="bg-white/70 border border-white rounded-2xl px-4 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-soft shadow-sm"
            >
              {contentItems.map(c => (
                <option key={c.id} value={c.id}>
                  {c.title} ({c.contentType.replace('_', ' ')})
                </option>
              ))}
            </select>

            <span className="text-[11px] px-3 py-1.5 rounded-xl bg-white/70 text-slate-800 font-mono border border-white font-bold shadow-sm">
              V{currentItem?.currentVersion || 1}
            </span>

            {/* Add New Content Button */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white/70 hover:bg-white text-xs font-bold text-slate-800 border border-white shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-pink-600" />
              <span>New Collateral</span>
            </button>

            {/* Delete Content Button */}
            {contentItems.length > 1 && (
              <button
                onClick={handleDeleteItem}
                className="p-2 rounded-2xl text-slate-500 hover:text-rose-600 hover:bg-white/60 border border-transparent hover:border-white transition-all cursor-pointer"
                title="Delete this collateral"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleScan}
            disabled={isScanning}
            className={`glass-button flex items-center gap-2 px-6 py-3 rounded-full font-bold text-xs shadow-lg transition-all cursor-pointer ${
              isScanning ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Scanning Agents...' : 'Inspect with BrandVault AI'}</span>
          </button>

          <button
            onClick={() => onSubmitForReview(currentItem.id)}
            disabled={criticalCount > 0}
            className={`flex items-center gap-2 px-5 py-3 rounded-full text-xs font-bold transition-all cursor-pointer shadow-sm ${
              criticalCount > 0
                ? 'bg-white/40 text-slate-400 cursor-not-allowed border border-white/40'
                : 'bg-white text-slate-800 hover:bg-white/90 border border-white'
            }`}
            title={criticalCount > 0 ? 'Resolve critical violations before submitting' : 'Submit for review'}
          >
            <Send className="w-3.5 h-3.5 text-blue-600" />
            <span>Submit for Review</span>
          </button>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Content Editor & Visual Spec */}
        <div className="lg:col-span-7 space-y-5">
          <div className="glass-panel p-6 space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-white/40 pb-3">
              <div className="adwise-bar">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Collateral Copy</span>
                <div className="text-[10px] text-slate-500 font-mono">
                  Target: {currentItem?.targetAudience || 'Enterprise'} • {currentItem?.targetChannel || 'Multi-channel'}
                </div>
              </div>
              <div className="text-[11px] text-slate-600 font-mono bg-white/60 px-3 py-1 rounded-full border border-white/80 font-semibold shadow-sm">
                {editorText.length} chars • {editorText.split(/\s+/).filter(Boolean).length} words
              </div>
            </div>

            {/* Text Editor Area */}
            <div className="relative">
              <textarea
                value={editorText}
                onChange={(e) => setEditorText(e.target.value)}
                rows={11}
                placeholder="Draft or paste marketing copy, press releases, or social advertisements here..."
                className="w-full bg-white/75 border border-white rounded-2xl p-4 text-sm text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-pink-soft resize-y font-sans shadow-inner placeholder:text-slate-400"
              />
            </div>

            {/* Multimodal Visual Creative Spec */}
            {currentItem?.contentType === 'social_ad' && (
              <div className="p-4 rounded-2xl bg-white/50 border border-white/70 space-y-3 shadow-sm">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-pink-600" />
                    <span>Multimodal Visual Creative Pre-Flight</span>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-mono font-bold bg-emerald-100 px-2 py-0.5 rounded-full">WCAG 2.1 AA Compliant</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-600">
                  <div className="w-20 h-16 rounded-xl bg-white/80 border border-white flex flex-col items-center justify-center font-mono text-[10px] text-slate-700 shadow-sm font-bold">
                    <span>1200x628</span>
                    <span className="text-[8px] text-blue-600">LinkedIn Ad</span>
                  </div>
                  <div className="space-y-1 text-[11px]">
                    <div className="text-slate-800 font-semibold">Palette Match: <span className="text-purple-600 font-mono font-bold">#CDB4DB &amp; #A2D2FF</span></div>
                    <div className="text-slate-600">Logo Clear Space: <span className="text-emerald-700 font-bold">28px (&gt; 24px requirement)</span></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: AI Findings & Corrections Panel */}
        <div className="lg:col-span-5 space-y-5">
          <div className="glass-panel-alt p-6 space-y-4 shadow-lg">
            {/* Panel Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/40">
              <div>
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">Multi-Agent Diagnostics</div>
                <div className="text-[10px] text-slate-500 font-mono font-semibold">
                  {findings.length} findings • {criticalCount} blocking
                </div>
              </div>

              {/* Overall Score Badge */}
              <div className="text-right">
                <div className="text-2xl font-black font-mono text-slate-800 tracking-tight">
                  {currentItem?.complianceScore ?? 100}
                  <span className="text-xs text-slate-500 font-normal">/100</span>
                </div>
                <div className="text-[9px] font-mono uppercase tracking-wider text-slate-500 font-bold">Brand Safety Score</div>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/50 border border-white/60 text-[11px] shadow-inner">
              {(['all', 'critical', 'warning', 'suggestion'] as const).map(filter => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`flex-1 py-1.5 rounded-xl font-bold capitalize transition-all cursor-pointer ${
                    activeFilter === filter
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Findings List */}
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {filteredFindings.length === 0 ? (
                <div className="p-8 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <div className="text-sm font-bold text-slate-800">100% Brand Compliant</div>
                  <p className="text-xs text-slate-600">
                    This copy adheres strictly to approved guidelines and verified facts.
                  </p>
                </div>
              ) : (
                filteredFindings.map((f) => (
                  <div
                    key={f.id}
                    className="p-4 rounded-2xl bg-white/65 border border-white space-y-3 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {f.severity === 'critical' ? (
                          <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0" />
                        ) : f.severity === 'warning' ? (
                          <AlertTriangle className="w-4 h-4 text-purple-600 shrink-0" />
                        ) : (
                          <Info className="w-4 h-4 text-blue-600 shrink-0" />
                        )}
                        <span className="text-xs font-bold text-slate-800">{f.issue}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono uppercase font-bold ${
                        f.severity === 'critical' ? 'bg-rose-100 text-rose-700 border border-rose-300' :
                        f.severity === 'warning' ? 'bg-purple-100 text-purple-700 border border-purple-300' :
                        'bg-blue-100 text-blue-700 border border-blue-300'
                      }`}>
                        {f.severity}
                      </span>
                    </div>

                    {/* Excerpt */}
                    <div className="text-xs bg-rose-50/80 p-2.5 rounded-xl border border-rose-200 space-y-1">
                      <div className="text-[10px] font-mono text-rose-600 uppercase font-bold">Violating Excerpt:</div>
                      <div className="text-rose-900 font-mono text-xs font-semibold">"{f.contentExcerpt}"</div>
                    </div>

                    {/* Rationale & Source Reference */}
                    <div className="text-[11px] text-slate-600 leading-relaxed font-medium">
                      {f.evidence}
                    </div>

                    <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1.5 font-semibold">
                      <BookOpen className="w-3 h-3 text-slate-400" />
                      <span>Source: {f.guidelineReference}</span>
                    </div>

                    {/* Suggested Correction & Action */}
                    {f.suggestedCorrection && (
                      <div className="pt-2 border-t border-slate-200 space-y-2">
                        <div className="text-[10px] font-mono uppercase text-emerald-700 font-bold">Suggested Context-Preserving Correction:</div>
                        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                          "{f.suggestedCorrection}"
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => handleAcceptCorrection(f)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-gradient-to-r from-[#FFAFCC] to-[#BDE0FE] text-slate-900 font-bold text-xs hover:opacity-90 transition-all cursor-pointer shadow-sm"
                          >
                            <Check className="w-3.5 h-3.5 text-slate-900" />
                            <span>Apply Suggestion</span>
                          </button>
                          <button
                            onClick={() => onResolveFinding(f.id, 'rejected')}
                            className="px-3 py-1.5 rounded-xl border border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-white text-xs transition-colors cursor-pointer"
                            title="Dismiss finding"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* New Content Collateral Modal in Adwise Frosted Glass */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl glass-panel bg-white/90 p-7 shadow-2xl text-slate-800 space-y-5 border border-white">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-800 transition-colors p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="text-xs uppercase font-mono tracking-widest text-pink-600 font-bold">
                Draft Collateral
              </div>
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight mt-1">
                Create New Content Collateral
              </h2>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 mb-1 font-bold">Collateral Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Q2 Customer Case Study or Instagram Product Teaser"
                  className="w-full bg-white/80 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-soft font-medium shadow-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Content Format</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full bg-white/80 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-soft font-medium shadow-sm"
                  >
                    <option value="social_ad">Social Ad (LinkedIn / X)</option>
                    <option value="press_release">Press Release</option>
                    <option value="marketing_copy">Marketing Copy / Blog Post</option>
                    <option value="newsletter">Email Newsletter</option>
                    <option value="text">General Copy / Text</option>
                    <option value="creative_image">Creative Visual Asset</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Target Audience</label>
                  <input
                    type="text"
                    value={newAudience}
                    onChange={(e) => setNewAudience(e.target.value)}
                    placeholder="e.g. Enterprise IT Leaders"
                    className="w-full bg-white/80 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-soft font-medium shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Distribution Channel</label>
                <input
                  type="text"
                  value={newChannel}
                  onChange={(e) => setNewChannel(e.target.value)}
                  placeholder="e.g. PR Newswire, LinkedIn, Email"
                  className="w-full bg-white/80 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-soft font-medium shadow-sm"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Draft Copy / Text</label>
                <textarea
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Write or paste your draft marketing message here..."
                  className="w-full bg-white/80 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-soft resize-none font-sans shadow-sm"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-5 py-2.5 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="glass-button px-6 py-2.5 rounded-full text-slate-900 font-bold shadow-lg hover:scale-105 transition-all cursor-pointer"
                >
                  Create &amp; Inspect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
