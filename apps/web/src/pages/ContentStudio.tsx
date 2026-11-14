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
  Image as ImageIcon
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
  currentRole,
  isScanning,
}) => {
  const currentItem = contentItems.find(c => c.id === selectedContentId) || contentItems[0];
  const [editorText, setEditorText] = useState(currentItem?.rawContent || '');
  const [activeFilter, setActiveFilter] = useState<'all' | 'critical' | 'warning' | 'suggestion'>('all');

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

  return (
    <div className="relative space-y-8 pb-16">
      {/* Decorative dot matrix in background */}
      <div className="absolute top-0 right-0 w-72 h-72 dot-pattern opacity-30 pointer-events-none rounded-3xl" />

      {/* Studio Header Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-2">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <ChromePaperPlane className="w-8 h-8 filter drop-shadow-md" />
            <div>
              <div className="text-xs uppercase font-mono tracking-widest text-slate-500 font-semibold">
                Pre-Flight Inspection
              </div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight font-sans">
                Content Inspection Studio
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-1">
            <select
              value={currentItem?.id}
              onChange={(e) => onSelectContent(e.target.value)}
              className="bg-[#121217] border border-white/10 rounded-xl px-3 py-1.5 text-xs font-semibold text-white focus:outline-none focus:ring-1 focus:ring-amber-500 shadow-sm"
            >
              {contentItems.map(c => (
                <option key={c.id} value={c.id}>
                  {c.title} ({c.contentType.replace('_', ' ')})
                </option>
              ))}
            </select>
            <span className="text-[11px] px-2.5 py-1 rounded-lg bg-[#181822] text-amber-400 font-mono border border-amber-500/20 font-bold">
              V{currentItem?.currentVersion || 1}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleScan}
            disabled={isScanning}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs transition-all shadow-xl cursor-pointer ${
              isScanning
                ? 'bg-[#1e1e27] text-amber-400 cursor-not-allowed border border-amber-500/30'
                : 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-slate-950 shadow-amber-500/20 hover:scale-105'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Multi-Agent Inspection...' : 'Inspect with BrandVault AI'}</span>
          </button>

          <button
            onClick={() => onSubmitForReview(currentItem.id)}
            disabled={criticalCount > 0}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all ${
              criticalCount > 0
                ? 'bg-[#14141c] text-slate-500 cursor-not-allowed border border-white/5'
                : 'bg-[#1a1a24] hover:bg-[#222230] text-white border border-white/15 shadow-sm'
            }`}
            title={criticalCount > 0 ? 'Resolve critical violations before submitting' : 'Submit for review'}
          >
            <Send className="w-3.5 h-3.5 text-amber-400" />
            <span>Submit for Review</span>
          </button>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Content Editor & Visual Spec */}
        <div className="lg:col-span-7 space-y-5">
          <div className="p-6 rounded-3xl bg-[#0e0e13] border border-white/[0.07] space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div className="gold-bar">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Collateral Copy</span>
                <div className="text-[10px] text-slate-500 font-mono">
                  Target: {currentItem?.targetAudience || 'Enterprise'} • {currentItem?.targetChannel || 'Multi-channel'}
                </div>
              </div>
              <div className="text-[11px] text-slate-400 font-mono bg-[#14141c] px-3 py-1 rounded-full border border-white/5">
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
                className="w-full bg-[#121217] border border-white/10 rounded-2xl p-4 text-sm text-slate-100 leading-relaxed focus:outline-none focus:ring-1 focus:ring-amber-500/60 resize-y font-sans selection:bg-amber-500 selection:text-black placeholder:text-slate-600"
              />
            </div>

            {/* Multimodal Visual Creative Spec (if applicable) */}
            {currentItem?.contentType === 'social_ad' && (
              <div className="p-4 rounded-2xl bg-[#14141c] border border-white/[0.06] space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-amber-400" />
                    <span>Multimodal Visual Creative Pre-Flight</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold">WCAG 2.1 AA Compliant</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <div className="w-20 h-16 rounded-xl bg-[#1e1e28] border border-white/10 flex flex-col items-center justify-center font-mono text-[10px] text-slate-300">
                    <span>1200x628</span>
                    <span className="text-[8px] text-amber-400">LinkedIn Ad</span>
                  </div>
                  <div className="space-y-1 text-[11px]">
                    <div className="text-white font-medium">Palette Match: <span className="text-amber-400 font-mono">#4F46E5 &amp; #06B6D4</span></div>
                    <div className="text-slate-400">Logo Clear Space: <span className="text-emerald-400 font-semibold">28px (&gt; 24px requirement)</span></div>
                  </div>
                </div>
              </div>
            )}

            {/* Editor Action Bar */}
            <div className="flex items-center justify-between pt-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-[11px]">Grounding: 4 Guidelines • 6 Prohibited Rules • 4 Verified Facts</span>
              </div>
              <button
                onClick={() => setEditorText(currentItem?.rawContent || '')}
                className="hover:text-amber-300 transition-colors text-[11px] underline"
              >
                Reset to Original
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Explainable Findings Drawer */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl bg-[#0e0e13] border border-white/[0.07] space-y-4 shadow-2xl">
            {/* Compliance Score Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div className="gold-bar">
                <div className="text-xs text-slate-500 font-medium">Compliance Pre-Flight</div>
                <div className="text-sm font-bold text-white">Brand Safety Score</div>
              </div>
              <div className="flex items-center gap-2">
                <div className={`px-4 py-1.5 rounded-2xl text-xl font-mono font-black border ${
                  (currentItem?.complianceScore || 0) >= 90
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : (currentItem?.complianceScore || 0) >= 70
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                }`}>
                  {currentItem?.complianceScore ?? '--'}/100
                </div>
              </div>
            </div>

            {/* Filter Pills matching navbar style */}
            <div className="flex items-center gap-1 p-1 bg-[#121217] rounded-full border border-white/10 text-[11px]">
              {(['all', 'critical', 'warning', 'suggestion'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`flex-1 py-1 rounded-full capitalize font-medium transition-all ${
                    activeFilter === filter
                      ? 'bg-[#1e1e27] text-white border border-white/15 font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Findings List */}
            {filteredFindings.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-[#121217]/50 border border-dashed border-white/10 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-semibold text-white">No Issues Detected</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Content complies with all active brand voice, fact verification, and promotional claim policies.
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[540px] overflow-y-auto pr-1">
                {filteredFindings.map((finding) => {
                  const isCritical = finding.severity === 'critical';
                  const isWarning = finding.severity === 'warning';
                  const isResolved = finding.status !== 'open';

                  return (
                    <div
                      key={finding.id}
                      className={`p-4 rounded-2xl border transition-all space-y-3 ${
                        isResolved
                          ? 'bg-[#121217]/40 border-white/5 opacity-60'
                          : isCritical
                          ? 'bg-[#161215] border-rose-900/40 hover:border-rose-700/60'
                          : isWarning
                          ? 'bg-[#171512] border-amber-900/40 hover:border-amber-700/60'
                          : 'bg-[#12141a] border-indigo-900/40 hover:border-indigo-700/60'
                      }`}
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {isCritical ? (
                            <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0" />
                          ) : isWarning ? (
                            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                          ) : (
                            <Info className="w-4 h-4 text-cyan-400 shrink-0" />
                          )}
                          <span className="text-xs font-bold text-white">{finding.issue}</span>
                        </div>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full uppercase font-mono font-bold ${
                          isCritical ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30' :
                          isWarning ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' : 
                          'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                        }`}>
                          {finding.agentType}
                        </span>
                      </div>

                      {/* Excerpt */}
                      <div className="p-2.5 rounded-xl bg-[#0c0c10] border border-white/5 text-xs font-mono text-rose-300">
                        &quot;{finding.contentExcerpt}&quot;
                      </div>

                      {/* Evidence & Citation */}
                      <div className="space-y-1 text-xs">
                        <div className="text-[11px] text-amber-400 font-semibold flex items-center gap-1 font-mono">
                          <BookOpen className="w-3 h-3 text-amber-400" />
                          <span>{finding.guidelineReference}</span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          {finding.evidence}
                        </p>
                      </div>

                      {/* Suggested Context-Preserving Correction */}
                      <div className="p-3.5 rounded-xl bg-[#0c0c10] border border-emerald-900/40 space-y-2">
                        <div className="flex items-center justify-between text-[10px] font-semibold text-emerald-400 uppercase tracking-wider font-mono">
                          <span>Suggested Correction</span>
                          <span>Confidence: {Math.round(finding.confidence * 100)}%</span>
                        </div>
                        <div className="text-xs text-emerald-200 font-medium">
                          &quot;{finding.suggestedCorrection}&quot;
                        </div>

                        {!isResolved && (
                          <div className="flex items-center gap-2 pt-1">
                            <button
                              onClick={() => handleAcceptCorrection(finding)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px] transition-colors shadow-sm cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Accept &amp; Replace</span>
                            </button>
                            <button
                              onClick={() => onResolveFinding(finding.id, 'rejected')}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#181822] hover:bg-[#20202e] text-slate-300 text-[11px] transition-colors cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                              <span>Dismiss</span>
                            </button>
                          </div>
                        )}

                        {isResolved && (
                          <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 pt-1">
                            <Check className="w-3.5 h-3.5" />
                            <span>Correction Applied</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
