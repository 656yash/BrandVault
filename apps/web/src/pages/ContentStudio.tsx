import React, { useState } from 'react';
import { 
  Sparkles, 
  AlertOctagon, 
  AlertTriangle, 
  Info, 
  Check, 
  X, 
  Send, 
  RefreshCw, 
  BookOpen, 
  CheckCircle2,
  Cpu,
  Layers,
  FileCheck2,
  Image as ImageIcon
} from 'lucide-react';
import type { 
  ContentItem, 
  ComplianceFinding, 
  AnalysisReport, 
  UserRole 
} from '@brandvault/shared';

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
  const [selectedFindingId, setSelectedFindingId] = useState<string | null>(null);

  // Sync editor text when currentItem changes
  React.useEffect(() => {
    if (currentItem) {
      setEditorText(currentItem.rawContent);
    }
  }, [currentItem?.id]);

  const findings = currentItem?.findings || [];
  const openFindings = findings.filter(f => f.status === 'open');

  const filteredFindings = findings.filter(f => {
    if (activeFilter === 'all') return true;
    return f.severity === activeFilter;
  });

  const criticalCount = findings.filter(f => f.severity === 'critical' && f.status === 'open').length;
  const warningCount = findings.filter(f => f.severity === 'warning' && f.status === 'open').length;

  const handleScan = async () => {
    if (!currentItem) return;
    await onScanContent(currentItem.id, editorText);
  };

  const handleAcceptCorrection = (finding: ComplianceFinding) => {
    // Replace snippet in editorText
    if (editorText.includes(finding.contentExcerpt)) {
      const updated = editorText.replace(finding.contentExcerpt, finding.suggestedCorrection);
      setEditorText(updated);
    }
    onApplyCorrection(finding);
    onResolveFinding(finding.id, 'accepted');
  };

  return (
    <div className="space-y-6">
      {/* Studio Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <FileCheck2 className="w-4 h-4" />
            Content Inspection Studio
          </div>
          <div className="flex items-center gap-3 mt-1">
            <select
              value={currentItem?.id}
              onChange={(e) => onSelectContent(e.target.value)}
              className="bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-1.5 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {contentItems.map(c => (
                <option key={c.id} value={c.id}>
                  {c.title} ({c.contentType.replace('_', ' ')})
                </option>
              ))}
            </select>
            <span className="text-xs px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 font-mono">
              V{currentItem?.currentVersion || 1}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleScan}
            disabled={isScanning}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs transition-all shadow-lg ${
              isScanning
                ? 'bg-indigo-900/60 text-indigo-300 cursor-not-allowed border border-indigo-700/50'
                : 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-indigo-600/30 hover:scale-[1.02]'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Multi-Agent Inspection Running...' : 'Inspect with BrandVault AI'}</span>
          </button>

          <button
            onClick={() => onSubmitForReview(currentItem.id)}
            disabled={criticalCount > 0}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              criticalCount > 0
                ? 'bg-slate-800/80 text-slate-500 cursor-not-allowed border border-slate-800'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30'
            }`}
            title={criticalCount > 0 ? 'Resolve all critical violations before submitting for approval' : 'Submit for review'}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit for Approval</span>
          </button>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Content Editor & Visual Canvas */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Collateral Copy</span>
                <span className="text-[10px] text-slate-500 font-mono">
                  Target: {currentItem?.targetAudience || 'Enterprise'} • {currentItem?.targetChannel || 'All channels'}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                {editorText.length} characters • {editorText.split(/\s+/).filter(Boolean).length} words
              </div>
            </div>

            {/* Text Editor Area */}
            <div className="relative">
              <textarea
                value={editorText}
                onChange={(e) => setEditorText(e.target.value)}
                rows={10}
                placeholder="Draft or paste marketing copy, press releases, or social advertisements here..."
                className="w-full bg-slate-950/70 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-y font-sans selection:bg-indigo-600"
              />
            </div>

            {/* Visual Asset Preview if applicable */}
            {currentItem?.contentType === 'social_ad' && (
              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <ImageIcon className="w-4 h-4 text-cyan-400" />
                  <span>Multimodal Visual Creative Pre-Flight</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <div className="w-16 h-16 rounded-lg bg-indigo-950/40 border border-indigo-800/60 flex items-center justify-center text-indigo-400 font-mono text-[10px]">
                    1200x628
                  </div>
                  <div className="space-y-1 text-[11px]">
                    <div className="text-slate-300 font-medium">LinkedIn Single Image Ad Spec</div>
                    <div className="text-slate-500">Color Palette Adherence: <span className="text-emerald-400 font-semibold">Verified (#4F46E5)</span></div>
                    <div className="text-slate-500">Logo Clear Space: <span className="text-emerald-400 font-semibold">28px (&gt; 24px requirement)</span></div>
                  </div>
                </div>
              </div>
            )}

            {/* Editor Action Bar */}
            <div className="flex items-center justify-between pt-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Grounding: 4 Guidelines • 6 Prohibited Rules • 4 Verified Facts</span>
              </div>
              <button
                onClick={() => setEditorText(currentItem?.rawContent || '')}
                className="hover:text-slate-200 underline text-[11px]"
              >
                Reset to Version Original
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Explainable Findings Drawer */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 space-y-4 shadow-xl">
            {/* Compliance Score Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <div className="text-xs text-slate-400 font-medium">Compliance Pre-Flight</div>
                <div className="text-sm font-bold text-white">Brand Safety Score</div>
              </div>
              <div className="flex items-center gap-2">
                <div className={`px-3 py-1 rounded-xl text-lg font-mono font-black border ${
                  (currentItem?.complianceScore || 0) >= 90
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : (currentItem?.complianceScore || 0) >= 70
                    ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                }`}>
                  {currentItem?.complianceScore ?? '--'}/100
                </div>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-950/60 rounded-xl border border-slate-800 text-[11px]">
              {(['all', 'critical', 'warning', 'suggestion'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`flex-1 py-1 rounded-lg capitalize font-medium transition-all ${
                    activeFilter === filter
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Findings List */}
            {filteredFindings.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-slate-950/40 border border-dashed border-slate-800 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-semibold text-white">No Issues Detected</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Content complies with all active brand voice, fact verification, and promotional claim policies.
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
                {filteredFindings.map((finding) => {
                  const isCritical = finding.severity === 'critical';
                  const isWarning = finding.severity === 'warning';
                  const isResolved = finding.status !== 'open';

                  return (
                    <div
                      key={finding.id}
                      className={`p-4 rounded-xl border transition-all space-y-3 ${
                        isResolved
                          ? 'bg-slate-950/30 border-slate-800/50 opacity-60'
                          : isCritical
                          ? 'bg-rose-950/20 border-rose-900/50 hover:border-rose-700/60'
                          : isWarning
                          ? 'bg-amber-950/20 border-amber-900/50 hover:border-amber-700/60'
                          : 'bg-indigo-950/20 border-indigo-900/50 hover:border-indigo-700/60'
                      }`}
                    >
                      {/* Finding Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {isCritical ? (
                            <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0" />
                          ) : isWarning ? (
                            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                          ) : (
                            <Info className="w-4 h-4 text-indigo-400 shrink-0" />
                          )}
                          <span className="text-xs font-bold text-white">{finding.issue}</span>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-mono font-bold ${
                          isCritical ? 'bg-rose-500/20 text-rose-300' :
                          isWarning ? 'bg-amber-500/20 text-amber-300' : 'bg-indigo-500/20 text-indigo-300'
                        }`}>
                          {finding.agentType} agent
                        </span>
                      </div>

                      {/* Flagged Text Excerpt */}
                      <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 text-xs font-mono text-rose-300">
                        &quot;{finding.contentExcerpt}&quot;
                      </div>

                      {/* Evidence & Policy Citation */}
                      <div className="space-y-1 text-xs">
                        <div className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                          <BookOpen className="w-3 h-3 text-indigo-400" />
                          <span>{finding.guidelineReference}</span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          {finding.evidence}
                        </p>
                      </div>

                      {/* Suggested Context-Preserving Correction */}
                      <div className="p-3 rounded-lg bg-slate-950/90 border border-emerald-900/40 space-y-2">
                        <div className="flex items-center justify-between text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">
                          <span>Suggested Correction</span>
                          <span className="font-mono">Confidence: {Math.round(finding.confidence * 100)}%</span>
                        </div>
                        <div className="text-xs text-emerald-200 font-medium">
                          &quot;{finding.suggestedCorrection}&quot;
                        </div>

                        {!isResolved && (
                          <div className="flex items-center gap-2 pt-1">
                            <button
                              onClick={() => handleAcceptCorrection(finding)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px] transition-colors shadow-sm"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Accept &amp; Replace</span>
                            </button>
                            <button
                              onClick={() => onResolveFinding(finding.id, 'rejected')}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition-colors"
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
