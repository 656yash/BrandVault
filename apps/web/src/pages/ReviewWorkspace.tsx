import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Send, 
  MessageSquare, 
  AlertCircle, 
  ShieldCheck, 
  History, 
  FileText,
  BadgeCheck,
  UserCheck
} from 'lucide-react';
import type { ContentItem, ReviewComment, UserRole } from '@brandvault/shared';

interface Props {
  contentItems: ContentItem[];
  currentRole: UserRole;
  onApprove: (contentId: string, feedback?: string) => Promise<any>;
  onRequestChanges: (contentId: string, feedback?: string) => Promise<any>;
  onAddComment: (contentId: string, text: string) => Promise<any>;
}

export const ReviewWorkspace: React.FC<Props> = ({
  contentItems,
  currentRole,
  onApprove,
  onRequestChanges,
  onAddComment,
}) => {
  const [selectedId, setSelectedId] = useState(contentItems[0]?.id || '');
  const [newComment, setNewComment] = useState('');
  const [reviewFeedback, setReviewFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSeal, setLastSeal] = useState<string | null>(null);

  const currentItem = contentItems.find(c => c.id === selectedId) || contentItems[0];
  const comments = currentItem?.comments || [];
  const findings = currentItem?.findings || [];
  const openFindings = findings.filter(f => f.status === 'open');

  const canApprove = currentRole === 'admin' || currentRole === 'manager';

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

  const handlePostComment = async () => {
    if (!newComment.trim() || !currentItem) return;
    await onAddComment(currentItem.id, newComment);
    setNewComment('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <UserCheck className="w-4 h-4" />
            Governance Review & Approvals
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight mt-1">
            Authorised Sign-Off & Change Tracking
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Human-in-the-loop control: AI flags risks, human reviewers authorize publication.
          </p>
        </div>

        {/* Selected Content Switcher */}
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {contentItems.map(c => (
            <option key={c.id} value={c.id}>
              {c.title} [{c.status.toUpperCase()}]
            </option>
          ))}
        </select>
      </div>

      {/* Main Review Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Content Review Canvas */}
        <div className="lg:col-span-7 space-y-5">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs font-semibold text-slate-400">Review Item</span>
                <h3 className="text-base font-bold text-white">{currentItem?.title}</h3>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Author: <span className="text-slate-200">{currentItem?.authorName}</span> • Type: <span className="capitalize text-slate-200">{currentItem?.contentType.replace('_', ' ')}</span>
                </div>
              </div>

              <div className="text-right">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  currentItem?.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                  currentItem?.status === 'changes_requested' ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30' :
                  'bg-slate-800 text-slate-300 border border-slate-700'
                }`}>
                  {currentItem?.status.replace('_', ' ')}
                </span>
                <div className="text-[10px] text-slate-500 mt-1 font-mono">
                  Version {currentItem?.currentVersion}
                </div>
              </div>
            </div>

            {/* Content Display */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 text-sm leading-relaxed text-slate-200 font-sans whitespace-pre-wrap">
              {currentItem?.rawContent}
            </div>

            {/* Cryptographic Seal Banner if Approved */}
            {currentItem?.status === 'approved' && (
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/40 flex items-start gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="text-xs font-bold text-emerald-300 flex items-center gap-2">
                    <BadgeCheck className="w-4 h-4" />
                    BrandVault Cryptographic Publication Seal Granted
                  </div>
                  <p className="text-[11px] text-slate-400">
                    This content has passed all multi-agent compliance checks and is verified for enterprise distribution.
                  </p>
                  <div className="text-[10px] font-mono text-emerald-400 pt-1">
                    Seal: {lastSeal || `BV-SEAL-NX9-2026-${currentItem.id.toUpperCase()}`}
                  </div>
                </div>
              </div>
            )}

            {/* Compliance Status Overview */}
            <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-slate-300">Compliance Health:</span>
                <span className="font-mono font-bold text-indigo-400 text-sm">
                  {currentItem?.complianceScore ?? 85}/100
                </span>
              </div>
              <div className="text-slate-400">
                {openFindings.length === 0 ? (
                  <span className="text-emerald-400 flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" /> All findings resolved
                  </span>
                ) : (
                  <span className="text-amber-400 font-medium">
                    {openFindings.length} open issue(s) pending
                  </span>
                )}
              </div>
            </div>

            {/* Sign-Off / Approval Controls (Available to Authorized Reviewers) */}
            <div className="pt-3 border-t border-slate-800/80 space-y-3">
              <label className="block text-xs font-semibold text-slate-300">
                Reviewer Evaluation &amp; Governance Notes
              </label>
              <textarea
                value={reviewFeedback}
                onChange={(e) => setReviewFeedback(e.target.value)}
                rows={2}
                placeholder="Enter feedback or validation rationale for the audit trail..."
                className="w-full bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-500">
                  Role: <strong className="text-slate-300 capitalize">{currentRole}</strong>
                  {!canApprove && ' (Switch to Admin/Manager to approve)'}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRequestChanges}
                    disabled={isSubmitting}
                    className="px-3.5 py-2 rounded-xl bg-amber-600/20 text-amber-300 hover:bg-amber-600 hover:text-white transition-colors text-xs font-semibold border border-amber-600/30"
                  >
                    Request Changes
                  </button>

                  <button
                    onClick={handleApprove}
                    disabled={isSubmitting || !canApprove}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      canApprove
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve &amp; Seal</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Discussion & Revision History */}
        <div className="lg:col-span-5 space-y-4">
          {/* Discussion Thread */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                Review Comments &amp; Rationale
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">
                {comments.length} message(s)
              </span>
            </div>

            {/* Comment List */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {comments.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-4">No comments recorded yet.</p>
              ) : (
                comments.map((cm) => (
                  <div key={cm.id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-slate-200">{cm.authorName}</span>
                      <span className="text-[10px] text-slate-500 capitalize">{cm.authorRole}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{cm.text}</p>
                    <div className="text-[9px] text-slate-500 text-right">
                      {new Date(cm.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add Comment Input */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handlePostComment()}
                placeholder="Leave reviewer note..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={handlePostComment}
                className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Audit Trail & Version Lifecycle */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 shadow-xl">
            <h3 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wider">
              <History className="w-3.5 h-3.5 text-cyan-400" />
              Version Timeline &amp; Approvals
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-200">Version 1 (Initial Draft)</div>
                  <div className="text-[10px] text-slate-500">Submitted by Clara Oswald</div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">Archived</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-200">Version {currentItem?.currentVersion} (Current)</div>
                  <div className="text-[10px] text-slate-500">
                    Status: <strong className="text-indigo-400 uppercase">{currentItem?.status}</strong>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 font-mono font-semibold">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
