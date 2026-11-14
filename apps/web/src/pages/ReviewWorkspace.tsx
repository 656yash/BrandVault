import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Send, 
  MessageSquare, 
  ShieldCheck, 
  History, 
  BadgeCheck,
  UserCheck
} from 'lucide-react';
import type { ContentItem, ReviewComment, UserRole } from '@brandvault/shared';
import { ChromeAvatar, ChromeShield, TiltedSticker } from '../components/ChromeIcons';

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
    <div className="relative space-y-8 pb-16">
      {/* Decorative dot matrix in background */}
      <div className="absolute top-0 right-0 w-80 h-72 dot-pattern opacity-30 pointer-events-none rounded-3xl" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-2">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <ChromeAvatar className="w-8 h-8 filter drop-shadow-md" />
            <div>
              <div className="text-xs uppercase font-mono tracking-widest text-slate-500 font-semibold">
                Governance Review
              </div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight font-sans">
                Authorised Sign-Off &amp; Approvals
              </h1>
            </div>
          </div>
          <p className="text-xs text-slate-400 max-w-xl">
            Human-in-the-loop control: BrandVault AI flags issues, but authorized directors and managers retain exclusive authority to approve publication.
          </p>
        </div>

        {/* Selected Content Switcher */}
        <div className="flex items-center gap-3">
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="bg-[#121217] border border-white/10 rounded-xl px-3.5 py-2 text-xs font-semibold text-white focus:outline-none focus:ring-1 focus:ring-amber-500 shadow-sm"
          >
            {contentItems.map(c => (
              <option key={c.id} value={c.id}>
                {c.title} [{c.status.toUpperCase()}]
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Review Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Content Review Canvas */}
        <div className="lg:col-span-7 space-y-5">
          <div className="p-6 rounded-3xl bg-[#0e0e13] border border-white/[0.07] space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div className="gold-bar">
                <span className="text-xs font-semibold text-slate-400">Review Item</span>
                <h3 className="text-base font-bold text-white">{currentItem?.title}</h3>
                <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                  Author: <span className="text-amber-400">{currentItem?.authorName}</span> • Type: <span className="capitalize text-slate-200">{currentItem?.contentType.replace('_', ' ')}</span>
                </div>
              </div>

              <div className="text-right">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  currentItem?.status === 'approved' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' :
                  currentItem?.status === 'changes_requested' ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' :
                  'bg-[#1a1a24] text-slate-300 border border-white/10'
                }`}>
                  {currentItem?.status.replace('_', ' ')}
                </span>
                <div className="text-[10px] text-slate-500 mt-1 font-mono">
                  Version {currentItem?.currentVersion}
                </div>
              </div>
            </div>

            {/* Content Display */}
            <div className="p-4 rounded-2xl bg-[#121217] border border-white/5 text-sm leading-relaxed text-slate-200 font-sans whitespace-pre-wrap">
              {currentItem?.rawContent}
            </div>

            {/* Cryptographic Seal Banner if Approved */}
            {currentItem?.status === 'approved' && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#121915] to-[#0e1411] border border-emerald-600/40 flex items-start gap-3 shadow-lg">
                <ChromeShield className="w-8 h-8 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="text-xs font-bold text-emerald-300 flex items-center gap-2 font-mono">
                    <BadgeCheck className="w-4 h-4 text-emerald-400" />
                    BrandVault Cryptographic Publication Seal Granted
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    This content has passed all multi-agent compliance checks and is verified for enterprise distribution.
                  </p>
                  <div className="text-[10px] font-mono text-emerald-400 pt-1 font-bold">
                    Seal: {lastSeal || `BV-SEAL-NX9-2026-${currentItem.id.toUpperCase()}`}
                  </div>
                </div>
              </div>
            )}

            {/* Compliance Status Overview */}
            <div className="p-4 rounded-2xl bg-[#14141c] border border-white/5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-slate-300">Compliance Health:</span>
                <span className="font-mono font-bold text-amber-400 text-sm">
                  {currentItem?.complianceScore ?? 85}/100
                </span>
              </div>
              <div className="text-slate-400">
                {openFindings.length === 0 ? (
                  <span className="text-emerald-400 flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" /> All findings resolved
                  </span>
                ) : (
                  <span className="text-amber-400 font-medium font-mono">
                    {openFindings.length} open issue(s) pending
                  </span>
                )}
              </div>
            </div>

            {/* Sign-Off / Approval Controls */}
            <div className="pt-3 border-t border-white/[0.06] space-y-3">
              <label className="block text-xs font-bold text-slate-300">
                Reviewer Evaluation &amp; Governance Notes
              </label>
              <textarea
                value={reviewFeedback}
                onChange={(e) => setReviewFeedback(e.target.value)}
                rows={2}
                placeholder="Enter validation rationale or change instructions for the audit trail..."
                className="w-full bg-[#121217] border border-white/10 rounded-2xl p-3 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none placeholder:text-slate-600"
              />

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-500 font-mono">
                  Role: <strong className="text-amber-400 capitalize">{currentRole}</strong>
                  {!canApprove && ' (Switch to Admin/Manager to sign off)'}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRequestChanges}
                    disabled={isSubmitting}
                    className="px-4 py-2 rounded-full bg-[#1a1a24] text-amber-300 hover:bg-[#222230] text-xs font-bold border border-amber-500/30 transition-all cursor-pointer"
                  >
                    Request Changes
                  </button>

                  <button
                    onClick={handleApprove}
                    disabled={isSubmitting || !canApprove}
                    className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      canApprove
                        ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-slate-950 shadow-lg shadow-amber-500/20 hover:scale-105'
                        : 'bg-[#14141c] text-slate-600 cursor-not-allowed border border-white/5'
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
        <div className="lg:col-span-5 space-y-5">
          {/* Discussion Thread */}
          <div className="p-6 rounded-3xl bg-[#0e0e13] border border-white/[0.07] space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
              <div className="gold-bar">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Review Comments &amp; Rationale
                </h3>
              </div>
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
                  <div key={cm.id} className="p-3.5 rounded-2xl bg-[#14141c] border border-white/5 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-white">{cm.authorName}</span>
                      <span className="text-[10px] text-amber-400 font-mono capitalize">{cm.authorRole}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{cm.text}</p>
                    <div className="text-[9px] text-slate-500 text-right font-mono">
                      {new Date(cm.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add Comment Input */}
            <div className="flex items-center gap-2 pt-2 border-t border-white/[0.06]">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handlePostComment()}
                placeholder="Leave reviewer note..."
                className="flex-1 bg-[#121217] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 placeholder:text-slate-600"
              />
              <button
                onClick={handlePostComment}
                className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Audit Trail & Version Lifecycle */}
          <div className="p-6 rounded-3xl bg-[#0e0e13] border border-white/[0.07] space-y-3 shadow-2xl">
            <div className="gold-bar">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Version Timeline &amp; Approvals
              </h3>
            </div>

            <div className="space-y-2.5 text-xs pt-1">
              <div className="p-3.5 rounded-2xl bg-[#14141c] border border-white/5 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">Version 1 (Initial Draft)</div>
                  <div className="text-[10px] text-slate-500">Submitted by Clara Oswald</div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1e1e28] text-slate-400 font-mono">Archived</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#14141c] border border-amber-500/20 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">Version {currentItem?.currentVersion} (Current)</div>
                  <div className="text-[10px] text-slate-500">
                    Status: <strong className="text-amber-400 uppercase font-mono">{currentItem?.status}</strong>
                  </div>
                </div>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 font-mono font-bold border border-amber-500/30">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
