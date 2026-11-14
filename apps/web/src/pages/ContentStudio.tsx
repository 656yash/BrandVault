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
  const [newType, setNewType] = useState<'social_ad' | 'blog_post' | 'press_release' | 'email_newsletter' | 'landing_page'>('social_ad');
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
      {/* Decorative dot matrix in background */}
      <div className="absolute top-0 right-0 w-80 h-72 dot-pattern opacity-30 pointer-events-none rounded-3xl" />

      {/* Studio Header Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-2">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <ChromePaperPlane className="w-8 h-8 filter drop-shadow-[0_4px_12px_rgba(255,255,255,0.15)]" />
            <div>
              <div className="text-xs uppercase font-mono tracking-widest text-zinc-400 font-semibold">
                Pre-Flight Inspection
              </div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight font-sans">
                Content Inspection Studio
              </h1>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <select
              value={currentItem?.id}
              onChange={(e) => onSelectContent(e.target.value)}
              className="bg-[#0e0e14] border border-white/10 rounded-xl px-3 py-1.5 text-xs font-semibold text-white focus:outline-none focus:ring-1 focus:ring-white/40 shadow-sm"
            >
              {contentItems.map(c => (
                <option key={c.id} value={c.id}>
                  {c.title} ({c.contentType.replace('_', ' ')})
                </option>
              ))}
            </select>

            <span className="text-[11px] px-2.5 py-1 rounded-lg bg-white/[0.04] text-zinc-200 font-mono border border-white/10 font-bold">
              V{currentItem?.currentVersion || 1}
            </span>

            {/* Add New Content Button */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-zinc-200 border border-white/10 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Collateral</span>
            </button>

            {/* Delete Content Button */}
            {contentItems.length > 1 && (
              <button
                onClick={handleDeleteItem}
                className="p-1.5 rounded-xl text-zinc-500 hover:text-rose-400 hover:bg-white/[0.05] border border-transparent hover:border-white/10 transition-colors cursor-pointer"
                title="Delete this content item"
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
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs transition-all shadow-xl cursor-pointer ${
              isScanning
                ? 'bg-white/10 text-zinc-300 cursor-not-allowed border border-white/20'
                : 'bg-white text-black hover:bg-zinc-200 shadow-white/5 hover:scale-105'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Multi-Agent Inspection...' : 'Inspect with BrandVault AI'}</span>
          </button>

          <button
            onClick={() => onSubmitForReview(currentItem.id)}
            disabled={criticalCount > 0}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              criticalCount > 0
                ? 'bg-white/[0.03] text-zinc-600 cursor-not-allowed border border-white/5'
                : 'bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/15 shadow-sm'
            }`}
            title={criticalCount > 0 ? 'Resolve critical violations before submitting' : 'Submit for review'}
          >
            <Send className="w-3.5 h-3.5 text-zinc-300" />
            <span>Submit for Review</span>
          </button>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Content Editor & Visual Spec */}
        <div className="lg:col-span-7 space-y-5">
          <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div className="silver-bar">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Collateral Copy</span>
                <div className="text-[10px] text-zinc-400 font-mono">
                  Target: {currentItem?.targetAudience || 'Enterprise'} • {currentItem?.targetChannel || 'Multi-channel'}
                </div>
              </div>
              <div className="text-[11px] text-zinc-400 font-mono bg-white/[0.03] px-3 py-1 rounded-full border border-white/5">
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
                className="w-full bg-[#0a0a0f] border border-white/10 rounded-2xl p-4 text-sm text-slate-100 leading-relaxed focus:outline-none focus:ring-1 focus:ring-white/40 resize-y font-sans selection:bg-white selection:text-black placeholder:text-zinc-600"
              />
            </div>

            {/* Multimodal Visual Creative Spec (if applicable) */}
            {currentItem?.contentType === 'social_ad' && (
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-300">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-zinc-300" />
                    <span>Multimodal Visual Creative Pre-Flight</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold">WCAG 2.1 AA Compliant</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-zinc-400">
                  <div className="w-20 h-16 rounded-xl bg-white/[0.04] border border-white/10 flex flex-col items-center justify-center font-mono text-[10px] text-zinc-300">
                    <span>1200x628</span>
                    <span className="text-[8px] text-zinc-400">LinkedIn Ad</span>
                  </div>
                  <div className="space-y-1 text-[11px]">
                    <div className="text-white font-medium">Palette Match: <span className="text-zinc-300 font-mono">#4F46E5 &amp; #06B6D4</span></div>
                    <div className="text-zinc-400">Logo Clear Space: <span className="text-emerald-400 font-semibold">28px (&gt; 24px requirement)</span></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: AI Findings & Corrections Panel */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-4 shadow-2xl">
            {/* Panel Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div>
                <div className="text-xs font-bold text-white uppercase tracking-wider">Multi-Agent Diagnostics</div>
                <div className="text-[10px] text-zinc-400 font-mono">
                  {findings.length} findings • {criticalCount} blocking
                </div>
              </div>

              {/* Overall Score Badge */}
              <div className="text-right">
                <div className="text-2xl font-black font-mono text-white">
                  {currentItem?.complianceScore ?? 100}
                  <span className="text-xs text-zinc-500 font-normal">/100</span>
                </div>
                <div className="text-[9px] font-mono uppercase tracking-wider text-zinc-400">Brand Safety Score</div>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.02] border border-white/5 text-[11px]">
              {(['all', 'critical', 'warning', 'suggestion'] as const).map(filter => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`flex-1 py-1 rounded-lg font-medium capitalize transition-all cursor-pointer ${
                    activeFilter === filter
                      ? 'bg-white/15 text-white font-semibold'
                      : 'text-zinc-500 hover:text-zinc-300'
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
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto opacity-75" />
                  <div className="text-sm font-bold text-white">No Issues Found</div>
                  <p className="text-xs text-zinc-400">
                    This copy adheres strictly to approved guidelines and verified facts.
                  </p>
                </div>
              ) : (
                filteredFindings.map((f) => (
                  <div
                    key={f.id}
                    className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3 hover:border-white/15 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {f.severity === 'critical' ? (
                          <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0" />
                        ) : f.severity === 'warning' ? (
                          <AlertTriangle className="w-4 h-4 text-zinc-300 shrink-0" />
                        ) : (
                          <Info className="w-4 h-4 text-zinc-400 shrink-0" />
                        )}
                        <span className="text-xs font-bold text-white">{f.issue}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono uppercase font-bold ${
                        f.severity === 'critical' ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30' :
                        f.severity === 'warning' ? 'bg-zinc-700 text-zinc-200 border border-zinc-600' :
                        'bg-white/10 text-zinc-300 border border-white/15'
                      }`}>
                        {f.severity}
                      </span>
                    </div>

                    {/* Excerpt */}
                    <div className="text-xs bg-white/[0.03] p-2.5 rounded-xl border border-white/5 space-y-1">
                      <div className="text-[10px] font-mono text-zinc-400 uppercase">Violating Excerpt:</div>
                      <div className="text-rose-300 font-mono text-xs font-medium">"{f.contentExcerpt}"</div>
                    </div>

                    {/* Rationale & Source Reference */}
                    <div className="text-[11px] text-zinc-400 leading-relaxed">
                      {f.evidence}
                    </div>

                    <div className="text-[10px] text-zinc-500 font-mono flex items-center gap-1.5">
                      <BookOpen className="w-3 h-3" />
                      <span>Source: {f.guidelineReference}</span>
                    </div>

                    {/* Suggested Correction & Action */}
                    {f.suggestedCorrection && (
                      <div className="pt-2 border-t border-white/5 space-y-2">
                        <div className="text-[10px] font-mono uppercase text-zinc-400">Suggested Correction:</div>
                        <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium">
                          "{f.suggestedCorrection}"
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => handleAcceptCorrection(f)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-zinc-200 transition-all cursor-pointer shadow-sm"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Apply Suggestion</span>
                          </button>
                          <button
                            onClick={() => onResolveFinding(f.id, 'rejected')}
                            className="px-3 py-1.5 rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 text-xs transition-colors cursor-pointer"
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

      {/* New Content Collateral Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-[#09090d]/95 backdrop-blur-2xl border border-white/15 rounded-3xl p-7 shadow-2xl text-slate-200 space-y-5">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-6 right-6 text-zinc-400 hover:text-white transition-colors p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="text-xs uppercase font-mono tracking-widest text-zinc-400 font-semibold">
                Draft Collateral
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight mt-1">
                Create New Content Collateral
              </h2>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1 font-semibold">Collateral Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Q2 Customer Case Study or Instagram Product Teaser"
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-white/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">Content Format</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full bg-[#121218] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-white/40"
                  >
                    <option value="social_ad">Social Ad (LinkedIn / X)</option>
                    <option value="press_release">Press Release</option>
                    <option value="blog_post">Technical Blog Post</option>
                    <option value="email_newsletter">Email Newsletter</option>
                    <option value="landing_page">Landing Page Copy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">Target Audience</label>
                  <input
                    type="text"
                    value={newAudience}
                    onChange={(e) => setNewAudience(e.target.value)}
                    placeholder="e.g. Enterprise IT Leaders"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:ring-1 focus:ring-white/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-semibold">Distribution Channel</label>
                <input
                  type="text"
                  value={newChannel}
                  onChange={(e) => setNewChannel(e.target.value)}
                  placeholder="e.g. PR Newswire, LinkedIn, Email"
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:ring-1 focus:ring-white/40"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-semibold">Draft Copy / Text</label>
                <textarea
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Write or paste your draft marketing message here..."
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-1 focus:ring-white/40 resize-none font-sans"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-full border border-white/10 text-zinc-300 hover:bg-white/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-white text-black font-bold hover:bg-zinc-200 transition-all cursor-pointer shadow-lg"
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
