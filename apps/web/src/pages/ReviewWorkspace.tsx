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
import type { ContentItem, ReviewComment, UserRole, BrandWorkspace } from '@brandvault/shared';
import { ChromeAvatar, ChromeShield, TiltedSticker } from '../components/ChromeIcons';

interface Props {
  brand?: BrandWorkspace | null;
  contentItems: ContentItem[];
  currentRole: UserRole;
  onApprove: (contentId: string, feedback?: string) => Promise<any>;
  onRequestChanges: (contentId: string, feedback?: string) => Promise<any>;
  onAddComment: (contentId: string, text: string) => Promise<any>;
  onDeleteComment?: (contentId: string, commentId: string) => Promise<any>;
}

export const ReviewWorkspace: React.FC<Props> = ({
  brand,
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

  // Sync selectedId when brand or contentItems change
  React.useEffect(() => {
    if (contentItems.length > 0) {
      const exists = contentItems.some(c => c.id === selectedId);
      if (!exists) {
        setSelectedId(contentItems[0].id);
      }
    }
  }, [contentItems, selectedId]);

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
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <ChromeAvatar className="w-8 h-8 filter drop-shadow-[0_4px_10px_rgba(205,180,219,0.5)]" />
            <div>
              <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight font-sans">
                Authorised Sign-Off &amp; Approvals
              </h1>
              <p className="text-xs text-slate-600 font-medium">
                Human-in-the-loop control for <span className="font-bold text-slate-800">{brand?.name || 'Brand Workspace'}</span>: BrandVault AI flags issues, but authorized directors retain approval authority.
              </p>
            </div>
          </div>
        </div>

        {/* Selected Content Switcher */}
        <div className="flex items-center gap-3">
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="bg-white/70 border border-white rounded-2xl px-4 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-soft shadow-sm"
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
          <div className="glass-panel p-6 space-y-5 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-white/40">
              <div className="adwise-bar">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Review Collateral</span>
                <h3 className="text-base font-bold text-slate-800">{currentItem?.title}</h3>
                <div className="text-[11px] text-slate-600 mt-0.5 font-mono">
                  Author: <span className="text-purple-700 font-bold">{currentItem?.authorName}</span> • Type: <span className="capitalize text-slate-800 font-medium">{currentItem?.contentType.replace('_', ' ')}</span>
                </div>
              </div>

              <div className="text-right">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  currentItem?.status === 'approved' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                  currentItem?.status === 'changes_requested' ? 'bg-pink-100 text-pink-700 border border-pink-300' :
                  'bg-white/80 text-slate-700 border border-white'
                }`}>
                  {currentItem?.status.replace('_', ' ')}
                </span>
                <div className="text-[10px] text-slate-500 mt-1 font-mono font-bold">
                  Version {currentItem?.currentVersion}
                </div>
              </div>
            </div>

            {/* Content Display */}
            <div className="p-4 rounded-2xl bg-white/70 border border-white text-sm leading-relaxed text-slate-800 font-sans whitespace-pre-wrap shadow-inner">
              {currentItem?.rawContent}
            </div>

            {/* Cryptographic Seal Banner if Approved */}
            {currentItem?.status === 'approved' && (
              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-start gap-3 shadow-sm">
                <ChromeShield className="w-8 h-8 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="text-xs font-bold text-emerald-800 flex items-center gap-2 font-mono">
                    <BadgeCheck className="w-4 h-4 text-emerald-600" />
                    BrandVault Cryptographic Publication Seal Granted
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                    This content has passed all multi-agent compliance checks and is verified for enterprise distribution.
                  </p>
                  <div className="text-[10px] font-mono text-emerald-700 pt-1 font-bold">
                    Seal: {lastSeal || `BV-SEAL-${brand?.name?.substring(0, 3)?.toUpperCase() || 'BV'}-2026-${currentItem.id.toUpperCase()}`}
                  </div>
                </div>
              </div>
            )}

            {/* Compliance Status Overview */}
            <div className="p-4 rounded-2xl bg-white/50 border border-white/70 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="font-bold text-slate-700">Compliance Health:</span>
                <span className="font-mono font-black text-slate-800 text-base">
                  {currentItem?.complianceScore ?? 85}/100
                </span>
              </div>
              <div>
                {openFindings.length === 0 ? (
                  <span className="text-emerald-700 flex items-center gap-1 font-bold">
                    <CheckCircle2 className="w-4 h-4" /> All findings resolved
                  </span>
                ) : (
                  <span className="text-pink-600 font-bold font-mono">
                    {openFindings.length} open issue(s) pending
                  </span>
                )}
              </div>
            </div>

            {/* Sign-Off / Approval Controls */}
            <div className="pt-3 border-t border-white/40 space-y-3">
              <label className="block text-xs font-bold text-slate-700">
                Reviewer Evaluation &amp; Governance Notes
              </label>
              <textarea
                value={reviewFeedback}
                onChange={(e) => setReviewFeedback(e.target.value)}
                rows={2}
                placeholder="Enter validation rationale or change instructions for the audit trail..."
                className="w-full bg-white/80 border border-slate-200 rounded-2xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-soft resize-none placeholder:text-slate-400 font-medium shadow-sm"
              />

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-500 font-mono font-semibold">
                  Reviewer: <strong className="text-slate-800 capitalize">{currentRole}</strong>
                </span>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleRequestChanges}
                    disabled={isSubmitting || !canApprove}
                    className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      canApprove
                        ? 'bg-white/80 hover:bg-white text-slate-700 border border-white shadow-sm'
                        : 'bg-white/30 text-slate-400 cursor-not-allowed border border-white/30'
                    }`}
                  >
                    Request Changes
                  </button>

                  <button
                    onClick={handleApprove}
                    disabled={isSubmitting || !canApprove}
                    className={`glass-button px-6 py-2.5 rounded-full text-xs font-bold transition-all shadow-lg cursor-pointer ${
                      canApprove
                        ? 'hover:scale-105 text-slate-900'
                        : 'opacity-50 cursor-not-allowed'
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
          <div className="glass-panel-alt p-6 space-y-4 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-white/40">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-purple-600" />
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Review Thread ({comments.length})
                </h3>
              </div>
              <span className="text-[10px] font-mono font-semibold text-slate-500">Collaboration Stream</span>
            </div>

            {/* Comments List */}
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {comments.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 font-medium">
                  No comments yet. Start the review conversation below.
                </div>
              ) : (
                comments.map((cm) => (
                  <div key={cm.id} className="p-3.5 rounded-2xl bg-white/70 border border-white space-y-1.5 group shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800">{cm.authorName}</span>
                        <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 font-bold">
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
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-sans font-medium">{cm.text}</p>
                  </div>
                ))
              )}
            </div>

            {/* Add Comment Input */}
            <div className="pt-3 border-t border-white/40 flex items-center gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handlePostComment()}
                placeholder="Post a review comment or guideline note..."
                className="flex-1 bg-white/80 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-soft placeholder:text-slate-400 font-medium shadow-sm"
              />
              <button
                onClick={handlePostComment}
                className="glass-button p-2.5 rounded-xl text-slate-900 shadow-sm hover:scale-105 transition-all cursor-pointer"
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
