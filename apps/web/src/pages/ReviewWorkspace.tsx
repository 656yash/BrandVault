import React, { useState, useMemo } from 'react';
import { 
  CheckCircle2, 
  Send, 
  MessageSquare, 
  ShieldCheck, 
  History, 
  BadgeCheck,
  UserCheck,
  Trash2,
  Clock,
  Filter,
  Search,
  AlertTriangle,
  AlertOctagon,
  XCircle,
  FileText,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Eye
} from 'lucide-react';
import type { ContentItem, ReviewComment, UserRole, BrandWorkspace, FindingSeverity } from '@brandvault/shared';
import { ChromeAvatar, ChromeShield, TiltedSticker } from '../components/ChromeIcons';

interface Props {
  brand?: BrandWorkspace | null;
  contentItems: ContentItem[];
  currentRole: UserRole;
  onApprove: (contentId: string, feedback?: string) => Promise<any>;
  onRequestChanges: (contentId: string, feedback?: string) => Promise<any>;
  onReject?: (contentId: string, feedback?: string) => Promise<any>;
  onAddComment: (contentId: string, text: string) => Promise<any>;
  onDeleteComment?: (contentId: string, commentId: string) => Promise<any>;
}

type StatusFilter = 'all' | 'ready_for_review' | 'changes_requested' | 'approved' | 'rejected';

export const ReviewWorkspace: React.FC<Props> = ({
  brand,
  contentItems,
  currentRole,
  onApprove,
  onRequestChanges,
  onReject,
  onAddComment,
  onDeleteComment,
}) => {
  const [statusFilter, setStatusFilterState] = useState<StatusFilter>(() => {
    try {
      const saved = localStorage.getItem('bv_review_filter') as StatusFilter;
      const valid: StatusFilter[] = ['all', 'ready_for_review', 'changes_requested', 'approved', 'rejected'];
      if (saved && valid.includes(saved)) return saved;
    } catch {}
    return 'all';
  });

  const setStatusFilter = (filter: StatusFilter) => {
    setStatusFilterState(filter);
    try {
      localStorage.setItem('bv_review_filter', filter);
    } catch {}
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedIdState] = useState<string>(() => {
    try {
      return localStorage.getItem('bv_review_selected_id') || contentItems[0]?.id || '';
    } catch {
      return contentItems[0]?.id || '';
    }
  });

  const setSelectedId = (id: string) => {
    setSelectedIdState(id);
    try {
      localStorage.setItem('bv_review_selected_id', id);
    } catch {}
  };
  const [newComment, setNewComment] = useState('');
  const [reviewFeedback, setReviewFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSeal, setLastSeal] = useState<string | null>(null);

  // Filter items by status & search query
  const filteredItems = useMemo(() => {
    return contentItems.filter(item => {
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchesSearch = !searchQuery.trim() || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.rawContent.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [contentItems, statusFilter, searchQuery]);

  // Keep selectedId valid
  React.useEffect(() => {
    if (filteredItems.length > 0) {
      const exists = filteredItems.some(c => c.id === selectedId);
      if (!exists) {
        setSelectedId(filteredItems[0].id);
      }
    }
  }, [filteredItems, selectedId]);

  const currentItem = contentItems.find(c => c.id === selectedId) || filteredItems[0];
  const comments = currentItem?.comments || [];
  const findings = currentItem?.findings || [];
  const openFindings = findings.filter(f => f.status === 'open');

  const canApprove = currentRole === 'admin' || currentRole === 'manager' || currentRole === 'compliance_officer';

  const handleApprove = async () => {
    if (!currentItem) return;
    setIsSubmitting(true);
    try {
      const res = await onApprove(currentItem.id, reviewFeedback);
      if (res?.cryptographicSeal) {
        setLastSeal(res.cryptographicSeal);
      }
      setReviewFeedback('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestChanges = async () => {
    if (!currentItem) return;
    setIsSubmitting(true);
    try {
      await onRequestChanges(currentItem.id, reviewFeedback);
      setReviewFeedback('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectAction = async () => {
    if (!currentItem) return;
    setIsSubmitting(true);
    try {
      if (onReject) {
        await onReject(currentItem.id, reviewFeedback);
      } else {
        await onRequestChanges(currentItem.id, reviewFeedback || 'Rejected by brand compliance officer.');
      }
      setReviewFeedback('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePostComment = async () => {
    if (!newComment.trim() || !currentItem) return;
    await onAddComment(currentItem.id, newComment);
    setNewComment('');
  };

  // Status counts
  const counts = useMemo(() => {
    return {
      all: contentItems.length,
      ready_for_review: contentItems.filter(c => c.status === 'ready_for_review').length,
      changes_requested: contentItems.filter(c => c.status === 'changes_requested').length,
      approved: contentItems.filter(c => c.status === 'approved').length,
      rejected: contentItems.filter(c => c.status === 'rejected').length,
    };
  }, [contentItems]);

  if (contentItems.length === 0) {
    return (
      <div className="relative space-y-8 pb-16">
        <div className="flex items-center gap-3 pt-2">
          <ChromeAvatar className="w-8 h-8 filter drop-shadow-[0_4px_10px_rgba(205,180,219,0.5)]" />
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight font-sans">
              Authorised Sign-Off &amp; Reviews
            </h1>
            <p className="text-xs text-slate-600 font-medium">
              Human-in-the-loop review queue for <strong className="text-slate-800">{brand?.name || 'Active Brand'}</strong>.
            </p>
          </div>
        </div>

        <div className="glass-panel p-12 text-center space-y-4 shadow-xl border border-white max-w-xl mx-auto mt-8">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">Review Queue Empty</h3>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            There are currently no marketing collaterals or creative assets awaiting approval for {brand?.name || 'this brand'}. Once collaterals are submitted from Content Studio, they will appear here for authorized sign-off.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <ChromeAvatar className="w-8 h-8 filter drop-shadow-[0_4px_10px_rgba(205,180,219,0.5)]" />
            <div>
              <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight font-sans">
                Authorised Sign-Off &amp; Reviews
              </h1>
              <p className="text-xs text-slate-600 font-medium">
                Human-in-the-loop brand governance for <span className="font-bold text-slate-800">{brand?.name || 'Brand Workspace'}</span>. AI assists with diagnostics; authorized directors retain ultimate decision authority.
              </p>
            </div>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search collaterals..."
            className="w-full bg-white/70 border border-white rounded-full pl-9 pr-4 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-soft placeholder:text-slate-400 font-medium shadow-xs"
          />
        </div>
      </div>

      {/* Status Filter Tabs (Wireframe Section 8) */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-full glass-capsule w-fit overflow-x-auto max-w-full">
        <button
          onClick={() => setStatusFilter('all')}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            statusFilter === 'all'
              ? 'sidebar-active text-slate-900'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/30'
          }`}
        >
          <span>All Submissions</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-white/60 text-slate-800">
            {counts.all}
          </span>
        </button>

        <button
          onClick={() => setStatusFilter('ready_for_review')}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            statusFilter === 'ready_for_review'
              ? 'sidebar-active text-slate-900'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/30'
          }`}
        >
          <Clock className="w-3 h-3 text-amber-600" />
          <span>Pending Review</span>
          {counts.ready_for_review > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-amber-200 text-amber-900 font-bold">
              {counts.ready_for_review}
            </span>
          )}
        </button>

        <button
          onClick={() => setStatusFilter('changes_requested')}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            statusFilter === 'changes_requested'
              ? 'sidebar-active text-slate-900'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/30'
          }`}
        >
          <AlertTriangle className="w-3 h-3 text-rose-500" />
          <span>Changes Requested</span>
          {counts.changes_requested > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-rose-200 text-rose-900 font-bold">
              {counts.changes_requested}
            </span>
          )}
        </button>

        <button
          onClick={() => setStatusFilter('approved')}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            statusFilter === 'approved'
              ? 'sidebar-active text-slate-900'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/30'
          }`}
        >
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          <span>Approved</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-100 text-emerald-900 font-bold">
            {counts.approved}
          </span>
        </button>

        <button
          onClick={() => setStatusFilter('rejected')}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            statusFilter === 'rejected'
              ? 'sidebar-active text-slate-900'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/30'
          }`}
        >
          <XCircle className="w-3 h-3 text-slate-500" />
          <span>Rejected</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-slate-200 text-slate-800">
            {counts.rejected}
          </span>
        </button>
      </div>

      {/* Main Review Workspace Layout: Queue List (Left) + Detailed Review Canvas (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (5 cols): Submissions Queue Cards */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider font-mono">
              Submission Queue ({filteredItems.length})
            </span>
            <span className="text-[11px] text-slate-500 font-medium">Select item to inspect</span>
          </div>

          <div className="space-y-2.5 max-h-[750px] overflow-y-auto pr-1">
            {filteredItems.length === 0 ? (
              <div className="glass-panel p-8 text-center text-xs text-slate-500 font-medium">
                No submissions match the selected filter.
              </div>
            ) : (
              filteredItems.map((item) => {
                const isSelected = item.id === (currentItem?.id || selectedId);
                const score = item.complianceScore ?? 85;
                const scoreColor = score >= 90 ? 'text-emerald-700 bg-emerald-100' : score >= 75 ? 'text-amber-800 bg-amber-100' : 'text-rose-700 bg-rose-100';

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedId(item.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'glass-panel border-white shadow-md ring-2 ring-pink-soft/80 scale-[1.01]'
                        : 'bg-white/60 hover:bg-white/80 border-white/60 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="min-w-0">
                        <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                          {item.contentType.replace('_', ' ')}
                        </span>
                        <h4 className="text-xs font-extrabold text-slate-900 truncate">
                          {item.title}
                        </h4>
                      </div>

                      {/* Compliance Score Pill */}
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-black shrink-0 ${scoreColor}`}>
                        {score}/100
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed mb-3">
                      {item.rawContent}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-[10px] text-slate-500">
                      <div className="flex items-center gap-1.5 font-medium truncate">
                        <UserCheck className="w-3 h-3 text-purple-600 shrink-0" />
                        <span className="truncate">{item.authorName}</span>
                      </div>

                      <div className="flex items-center gap-2 font-mono">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                          item.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                          item.status === 'changes_requested' ? 'bg-pink-100 text-pink-800' :
                          item.status === 'rejected' ? 'bg-rose-100 text-rose-800' :
                          'bg-amber-100 text-amber-900'
                        }`}>
                          {item.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column (7 cols): Selected Content Review Details */}
        <div className="lg:col-span-7 space-y-5">
          {currentItem ? (
            <div className="glass-panel p-6 space-y-5 shadow-lg border border-white">
              
              {/* Header of Selected Review */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/40">
                <div className="adwise-bar">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Governance Sign-Off
                  </span>
                  <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                    {currentItem.title}
                  </h3>
                  <div className="text-[11px] text-slate-600 mt-0.5 font-mono">
                    Author: <span className="text-purple-700 font-bold">{currentItem.authorName}</span> • Type: <span className="capitalize text-slate-800 font-medium">{currentItem.contentType.replace('_', ' ')}</span> • Version: <span className="font-bold">v{currentItem.currentVersion}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    currentItem.status === 'approved' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                    currentItem.status === 'changes_requested' ? 'bg-pink-100 text-pink-700 border border-pink-300' :
                    currentItem.status === 'rejected' ? 'bg-rose-100 text-rose-700 border border-rose-300' :
                    'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}>
                    {currentItem.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Submitted Content Raw Body */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Submitted Copy for Release</span>
                  <span className="text-[11px] font-mono text-slate-500">
                    {currentItem.rawContent.length} chars • {currentItem.rawContent.split(/\s+/).filter(Boolean).length} words
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-white/80 border border-white text-sm leading-relaxed text-slate-800 font-sans whitespace-pre-wrap shadow-inner font-medium">
                  {currentItem.rawContent}
                </div>
              </div>

              {/* Cryptographic Seal Banner if Approved */}
              {currentItem.status === 'approved' && (
                <div className="p-4 rounded-2xl bg-emerald-50/90 border border-emerald-200 flex items-start gap-3 shadow-sm animate-in fade-in duration-200">
                  <ChromeShield className="w-8 h-8 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-emerald-900 flex items-center gap-2 font-mono">
                      <BadgeCheck className="w-4 h-4 text-emerald-600" />
                      BrandVault Cryptographic Publication Seal Active
                    </div>
                    <p className="text-[11px] text-slate-700 leading-relaxed font-medium">
                      This content has cleared all multi-agent compliance checks and is officially certified for commercial distribution.
                    </p>
                    <div className="text-[10px] font-mono text-emerald-800 pt-1 font-bold">
                      Seal: {lastSeal || `BV-SEAL-${brand?.name?.substring(0, 3)?.toUpperCase() || 'BV'}-2026-${currentItem.id.toUpperCase()}`}
                    </div>
                  </div>
                </div>
              )}

              {/* Compliance Health Score & Findings Summary */}
              <div className="p-4 rounded-2xl bg-white/60 border border-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-700">AI Compliance Safety Score:</span>
                  <span className="font-mono font-black text-slate-900 text-lg">
                    {currentItem.complianceScore ?? 85}/100
                  </span>
                </div>
                <div>
                  {openFindings.length === 0 ? (
                    <span className="text-emerald-700 flex items-center gap-1 font-bold">
                      <CheckCircle2 className="w-4 h-4" /> All compliance findings resolved
                    </span>
                  ) : (
                    <span className="text-pink-600 font-bold font-mono">
                      {openFindings.length} open issue(s) require review
                    </span>
                  )}
                </div>
              </div>

              {/* AI Findings List if any open issues */}
              {openFindings.length > 0 && (
                <div className="space-y-2 pt-1">
                  <span className="text-xs font-bold text-slate-700 block uppercase tracking-wider font-mono">
                    Open Compliance Issues ({openFindings.length})
                  </span>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {openFindings.map((f) => (
                      <div key={f.id} className="p-3 rounded-xl bg-white/70 border border-white text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{f.issue}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase ${
                            f.severity === 'critical' ? 'bg-rose-100 text-rose-800' :
                            f.severity === 'warning' ? 'bg-amber-100 text-amber-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {f.severity}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600">{f.evidence}</p>
                        <div className="text-[10px] text-slate-500 font-mono">
                          Citation: {f.guidelineReference || 'Brand Standards Manual'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviewer Action Controls: Once done (approved or rejected), hide the approve/reject buttons */}
              {currentItem.status === 'approved' ? (
                <div className="pt-4 border-t border-white/50">
                  <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shadow-xs shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-emerald-950 font-mono flex items-center gap-1.5">
                          <span>Decision Finalized — Approved &amp; Sealed</span>
                        </div>
                        <p className="text-[11px] text-emerald-800 font-medium">
                          This collateral has cleared governance review and is sealed for release. Approval controls are now closed.
                        </p>
                      </div>
                    </div>

                    {canApprove && (
                      <button
                        onClick={handleRequestChanges}
                        disabled={isSubmitting}
                        className="text-[11px] font-bold text-slate-700 hover:text-slate-900 px-3.5 py-1.5 rounded-xl bg-white/80 hover:bg-white border border-white transition-all cursor-pointer whitespace-nowrap shadow-xs shrink-0"
                        title="Re-open review to request revisions"
                      >
                        Re-open Review
                      </button>
                    )}
                  </div>
                </div>
              ) : currentItem.status === 'rejected' ? (
                <div className="pt-4 border-t border-white/50">
                  <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-700 shadow-xs shrink-0">
                        <XCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-rose-950 font-mono">
                          Decision Finalized — Submission Rejected
                        </div>
                        <p className="text-[11px] text-rose-800 font-medium">
                          This collateral was rejected and marked non-compliant. Action controls are closed.
                        </p>
                      </div>
                    </div>

                    {canApprove && (
                      <button
                        onClick={handleRequestChanges}
                        disabled={isSubmitting}
                        className="text-[11px] font-bold text-slate-700 hover:text-slate-900 px-3.5 py-1.5 rounded-xl bg-white/80 hover:bg-white border border-white transition-all cursor-pointer whitespace-nowrap shadow-xs shrink-0"
                        title="Re-open review"
                      >
                        Re-open Review
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* Active Review Controls (Shown only while review is pending or in-progress) */
                <div className="pt-4 border-t border-white/50 space-y-3">
                  <label className="block text-xs font-bold text-slate-800">
                    Reviewer Rationale &amp; Audit Notes
                  </label>
                  <textarea
                    value={reviewFeedback}
                    onChange={(e) => setReviewFeedback(e.target.value)}
                    rows={2}
                    placeholder="Enter governance notes, required adjustments, or publication rationale..."
                    className="w-full bg-white/80 border border-slate-200 rounded-2xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-soft resize-none placeholder:text-slate-400 font-medium shadow-sm"
                  />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                    <span className="text-[11px] text-slate-500 font-mono font-semibold">
                      Reviewer Role: <strong className="text-slate-900 capitalize">{currentRole}</strong>
                    </span>

                    <div className="flex items-center gap-2">
                      {/* Reject Button */}
                      <button
                        onClick={handleRejectAction}
                        disabled={isSubmitting || !canApprove}
                        className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          canApprove
                            ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 shadow-xs'
                            : 'bg-white/30 text-slate-400 cursor-not-allowed border border-white/30'
                        }`}
                        title="Reject this submission"
                      >
                        Reject
                      </button>

                      {/* Request Changes */}
                      <button
                        onClick={handleRequestChanges}
                        disabled={isSubmitting || !canApprove}
                        className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          canApprove
                            ? 'bg-white/80 hover:bg-white text-slate-800 border border-white shadow-xs'
                            : 'bg-white/30 text-slate-400 cursor-not-allowed border border-white/30'
                        }`}
                      >
                        Request Changes
                      </button>

                      {/* Approve & Seal */}
                      <button
                        onClick={handleApprove}
                        disabled={isSubmitting || !canApprove}
                        className={`glass-button px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-md cursor-pointer ${
                          canApprove
                            ? 'hover:scale-105 text-slate-900'
                            : 'opacity-50 cursor-not-allowed'
                        }`}
                      >
                        Approve &amp; Seal
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Collaboration Thread / Comments Stream */}
              <div className="pt-4 border-t border-white/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-purple-600" />
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                      Review Collaboration Stream ({comments.length})
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">Live Comments</span>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {comments.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-500 font-medium">
                      No comments yet. Post feedback or questions for the content creator below.
                    </div>
                  ) : (
                    comments.map((cm) => (
                      <div key={cm.id} className="p-3 rounded-xl bg-white/70 border border-white space-y-1 group">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">{cm.authorName}</span>
                            <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 rounded bg-purple-100 text-purple-700 font-bold">
                              {cm.authorRole}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-500 font-mono">
                              {new Date(cm.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {onDeleteComment && (
                              <button
                                onClick={() => onDeleteComment(currentItem.id, cm.id)}
                                className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 transition-opacity"
                                title="Delete comment"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-slate-700 font-medium">{cm.text}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Comment Input */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handlePostComment()}
                    placeholder="Post a review comment or feedback..."
                    className="flex-1 bg-white/80 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-soft placeholder:text-slate-400 font-medium shadow-xs"
                  />
                  <button
                    onClick={handlePostComment}
                    className="glass-button p-2.5 rounded-xl text-slate-900 shadow-xs hover:scale-105 transition-all cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="glass-panel p-12 text-center text-slate-500 font-medium">
              Select a content item from the queue to start reviewing.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
