import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Send, 
  MessageSquare, 
  ShieldCheck, 
  History, 
  BadgeCheck,
  UserCheck,
  Trash2
} from 'lucide-react';
import type { ContentItem, ReviewComment, UserRole } from '@brandvault/shared';
import { ChromeAvatar, ChromeShield, TiltedSticker } from '../components/ChromeIcons';

interface Props {
  contentItems: ContentItem[];
  currentRole: UserRole;
  onApprove: (contentId: string, feedback?: string) => Promise<any>;
  onRequestChanges: (contentId: string, feedback?: string) => Promise<any>;
  onAddComment: (contentId: string, text: string) => Promise<any>;
  onDeleteComment?: (contentId: string, commentId: string) => Promise<any>;
}

export const ReviewWorkspace: React.FC<Props> = ({
  contentItems,
  currentRole,
  onApprove,
  onRequestChanges,
  onAddComment,
  onDeleteComment,
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
            <ChromeAvatar className="w-8 h-8 filter drop-shadow-[0_4px_12px_rgba(255,255,255,0.15)]" />
            <div>
              <div className="text-xs uppercase font-mono tracking-widest text-zinc-400 font-semibold">
                Governance Review
              </div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight font-sans">
                Authorised Sign-Off &amp; Approvals
              </h1>
            </div>
          </div>
          <p className="text-xs text-zinc-400 max-w-xl">
            Human-in-the-loop control: BrandVault AI flags issues, but authorized directors and managers retain exclusive authority to approve publication.
          </p>
        </div>

        {/* Selected Content Switcher */}
        <div className="flex items-center gap-3">
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="bg-[#0e0e14] border border-white/10 rounded-xl px-3.5 py-2 text-xs font-semibold text-white focus:outline-none focus:ring-1 focus:ring-white/40 shadow-sm"
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
          <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div className="silver-bar">
                <span className="text-xs font-semibold text-zinc-400">Review Item</span>
                <h3 className="text-base font-bold text-white">{currentItem?.title}</h3>
                <div className="text-[11px] text-zinc-400 mt-0.5 font-mono">
                  Author: <span className="text-zinc-200">{currentItem?.authorName}</span> • Type: <span className="capitalize text-zinc-300">{currentItem?.contentType.replace('_', ' ')}</span>
                </div>
              </div>

              <div className="text-right">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  currentItem?.status === 'approved' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' :
                  currentItem?.status === 'changes_requested' ? 'bg-zinc-700 text-zinc-200 border border-zinc-600' :
                  'bg-white/10 text-zinc-300 border border-white/10'
                }`}>
                  {currentItem?.status.replace('_', ' ')}
                </span>
                <div className="text-[10px] text-zinc-500 mt-1 font-mono">
                  Version {currentItem?.currentVersion}
                </div>
              </div>
            </div>

            {/* Content Display */}
            <div className="p-4 rounded-2xl bg-[#09090d] border border-white/5 text-sm leading-relaxed text-zinc-200 font-sans whitespace-pre-wrap">
              {currentItem?.rawContent}
            </div>

            {/* Cryptographic Seal Banner if Approved */}
            {currentItem?.status === 'approved' && (
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-emerald-500/30 flex items-start gap-3 shadow-lg">
                <ChromeShield className="w-8 h-8 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="text-xs font-bold text-emerald-300 flex items-center gap-2 font-mono">
                    <BadgeCheck className="w-4 h-4 text-emerald-400" />
                    BrandVault Cryptographic Publication Seal Granted
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    This content has passed all multi-agent compliance checks and is verified for enterprise distribution.
                  </p>
                  <div className="text-[10px] font-mono text-emerald-400 pt-1 font-bold">
                    Seal: {lastSeal || `BV-SEAL-NX9-2026-${currentItem.id.toUpperCase()}`}
                  </div>
                </div>
              </div>
            )}

            {/* Compliance Status Overview */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-zinc-300">Compliance Health:</span>
                <span className="font-mono font-bold text-white text-sm">
                  {currentItem?.complianceScore ?? 85}/100
                </span>
              </div>
              <div className="text-zinc-400">
                {openFindings.length === 0 ? (
                  <span className="text-emerald-400 flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" /> All findings resolved
                  </span>
                ) : (
                  <span className="text-zinc-300 font-medium font-mono">
                    {openFindings.length} open issue(s) pending
                  </span>
                )}
              </div>
            </div>

            {/* Sign-Off / Approval Controls */}
            <div className="pt-3 border-t border-white/[0.06] space-y-3">
              <label className="block text-xs font-bold text-zinc-300">
                Reviewer Evaluation &amp; Governance Notes
              </label>
              <textarea
                value={reviewFeedback}
                onChange={(e) => setReviewFeedback(e.target.value)}
                rows={2}
                placeholder="Enter validation rationale or change instructions for the audit trail..."
                className="w-full bg-[#0a0a0f] border border-white/10 rounded-2xl p-3 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-white/40 resize-none placeholder:text-zinc-600"
              />

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-zinc-500 font-mono">
                  Reviewer Persona: <strong className="text-white capitalize">{currentRole}</strong>
                </span>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleRequestChanges}
                    disabled={isSubmitting || !canApprove}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      canApprove
                        ? 'bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 border border-white/10'
                        : 'bg-white/[0.02] text-zinc-600 cursor-not-allowed border border-white/5'
                    }`}
                  >
                    Request Changes
                  </button>

                  <button
                    onClick={handleApprove}
                    disabled={isSubmitting || !canApprove}
                    className={`px-5 py-2 rounded-full text-xs font-bold transition-all shadow-lg cursor-pointer ${
                      canApprove
                        ? 'bg-white text-black hover:bg-zinc-200 shadow-white/5'
                        : 'bg-white/[0.02] text-zinc-600 cursor-not-allowed border border-white/5'
                    }`}
                  >
                    Grant Approval &amp; Seal
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Discussion & Revision Comments */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-zinc-300" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Review Thread ({comments.length})
                </h3>
              </div>
              <span className="text-[10px] font-mono text-zinc-400">Collaboration Stream</span>
            </div>

            {/* Comments List */}
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {comments.length === 0 ? (
                <div className="p-8 text-center text-xs text-zinc-500">
                  No comments yet. Start the review conversation below.
                </div>
              ) : (
                comments.map((cm) => (
                  <div key={cm.id} className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1.5 group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{cm.authorName}</span>
                        <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 rounded bg-white/10 text-zinc-400">
                          {cm.authorRole}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-zinc-500 font-mono">
                          {new Date(cm.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {onDeleteComment && (
                          <button
                            onClick={() => onDeleteComment(currentItem.id, cm.id)}
                            className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-rose-400 transition-opacity"
                            title="Delete comment"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed font-sans">{cm.text}</p>
                  </div>
                ))
              )}
            </div>

            {/* Add Comment Input */}
            <div className="pt-3 border-t border-white/[0.06] flex items-center gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handlePostComment()}
                placeholder="Post a review comment or guideline note..."
                className="flex-1 bg-[#09090d] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-white/40 placeholder:text-zinc-600"
              />
              <button
                onClick={handlePostComment}
                className="p-2 rounded-xl bg-white text-black hover:bg-zinc-200 transition-colors cursor-pointer shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
