import React, { useState, useEffect } from 'react';
import type { 
  UserRole, 
  BrandWorkspace, 
  Guideline, 
  ApprovedFact, 
  TerminologyRule, 
  ApprovedClaim, 
  BrandAsset, 
  ContentItem, 
  GovernanceMetrics, 
  AuditLog, 
  ComplianceFinding 
} from '@brandvault/shared';
import { api } from './services/api';
import { Navbar } from './components/Navbar';
import { Sidebar, type NavTab } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { ContentStudio } from './pages/ContentStudio';
import { ReviewWorkspace } from './pages/ReviewWorkspace';
import { BrandKnowledge } from './pages/BrandKnowledge';
import { GovernanceAnalytics } from './pages/GovernanceAnalytics';
import { AuditTransparency } from './pages/AuditTransparency';

export function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [currentRole, setCurrentRole] = useState<UserRole>('admin');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Core Data State
  const [brand, setBrand] = useState<BrandWorkspace | null>(null);
  const [guidelines, setGuidelines] = useState<Guideline[]>([]);
  const [facts, setFacts] = useState<ApprovedFact[]>([]);
  const [terminology, setTerminology] = useState<TerminologyRule[]>([]);
  const [claims, setClaims] = useState<ApprovedClaim[]>([]);
  const [assets, setAssets] = useState<BrandAsset[]>([]);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [metrics, setMetrics] = useState<GovernanceMetrics | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [selectedContentId, setSelectedContentId] = useState<string>('cnt_01');
  const [isScanning, setIsScanning] = useState<boolean>(false);

  // Initial Data Fetch
  useEffect(() => {
    async function initData() {
      try {
        const [b, g, f, t, c, a, items, m, logs] = await Promise.all([
          api.getBrand(),
          api.getGuidelines(),
          api.getFacts(),
          api.getTerminology(),
          api.getClaims(),
          api.getAssets(),
          api.getContentItems(),
          api.getAnalytics(),
          api.getAuditLogs(),
        ]);

        setBrand(b);
        setGuidelines(g);
        setFacts(f);
        setTerminology(t);
        setClaims(c);
        setAssets(a);
        setContentItems(items);
        setMetrics(m);
        setAuditLogs(logs);

        // Fetch detailed findings for the initial item
        if (items.length > 0) {
          const detailed = await api.getContentItem(items[0].id);
          if (detailed) {
            setContentItems(prev => prev.map(item => item.id === detailed.id ? detailed : item));
          }
        }
      } catch (err) {
        console.error('Failed to load initial data:', err);
      }
    }
    initData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Handlers
  const handleScanContent = async (id: string, text: string) => {
    setIsScanning(true);
    try {
      const report = await api.scanContent({ contentItemId: id, contentOverride: text });
      // Update local state
      setContentItems(prev => prev.map(item => {
        if (item.id === id) {
          return {
            ...item,
            rawContent: text,
            complianceScore: report.overallScore,
            status: report.overallScore >= 90 ? 'ready_for_review' : 'changes_requested',
            findings: report.findings,
          };
        }
        return item;
      }));

      // Refresh metrics & logs
      const [m, logs] = await Promise.all([api.getAnalytics(), api.getAuditLogs()]);
      setMetrics(m);
      setAuditLogs(logs);

      showToast(`BrandVault AI Scan Complete: Safety score ${report.overallScore}/100`);
      return report;
    } catch (err: any) {
      showToast('Error during AI inspection: ' + err.message);
      throw err;
    } finally {
      setIsScanning(false);
    }
  };

  const handleApplyCorrection = (finding: ComplianceFinding) => {
    setContentItems(prev => prev.map(item => {
      if (item.id === finding.contentItemId && item.rawContent.includes(finding.contentExcerpt)) {
        const updatedContent = item.rawContent.replace(finding.contentExcerpt, finding.suggestedCorrection);
        return { ...item, rawContent: updatedContent };
      }
      return item;
    }));
  };

  const handleResolveFinding = async (findingId: string, decision: 'accepted' | 'rejected') => {
    await api.resolveFinding(findingId, decision);
    setContentItems(prev => prev.map(item => {
      if (item.findings) {
        const updatedFindings = item.findings.map(f => f.id === findingId ? { ...f, status: decision } : f);
        return { ...item, findings: updatedFindings };
      }
      return item;
    }));
    showToast(`Finding marked as ${decision}`);
  };

  const handleSubmitForReview = async (id: string) => {
    const updated = await api.updateContent(id, { status: 'ready_for_review' });
    setContentItems(prev => prev.map(item => item.id === id ? { ...item, status: 'ready_for_review' } : item));
    showToast('Collateral submitted to review queue.');
    setCurrentTab('reviews');
  };

  const handleApprove = async (contentId: string, feedback?: string) => {
    const content = contentItems.find(c => c.id === contentId);
    const res = await api.submitApproval({
      contentItemId: contentId,
      versionNumber: content?.currentVersion || 1,
      decision: 'approved',
      feedback,
    });
    setContentItems(prev => prev.map(item => item.id === contentId ? { ...item, status: 'approved' } : item));
    const [m, logs] = await Promise.all([api.getAnalytics(), api.getAuditLogs()]);
    setMetrics(m);
    setAuditLogs(logs);
    showToast('Publication approval granted! Cryptographic seal generated.');
    return res;
  };

  const handleRequestChanges = async (contentId: string, feedback?: string) => {
    const content = contentItems.find(c => c.id === contentId);
    const res = await api.submitApproval({
      contentItemId: contentId,
      versionNumber: content?.currentVersion || 1,
      decision: 'changes_requested',
      feedback,
    });
    setContentItems(prev => prev.map(item => item.id === contentId ? { ...item, status: 'changes_requested' } : item));
    const logs = await api.getAuditLogs();
    setAuditLogs(logs);
    showToast('Changes requested. Sent back to creator queue.');
    return res;
  };

  const handleAddComment = async (contentId: string, text: string) => {
    const created = await api.addComment(contentId, {
      authorId: currentRole === 'admin' ? 'usr_alice' : currentRole === 'manager' ? 'usr_bob' : 'usr_clara',
      authorName: currentRole === 'admin' ? 'Alice Vance' : currentRole === 'manager' ? 'Bob Chen' : 'Clara Oswald',
      authorRole: currentRole,
      text,
    });
    setContentItems(prev => prev.map(item => {
      if (item.id === contentId) {
        const comments = item.comments || [];
        return { ...item, comments: [...comments, created] };
      }
      return item;
    }));
    return created;
  };

  const handleAddGuideline = async (g: any) => {
    const created = await api.addGuideline(g);
    setGuidelines(prev => [created, ...prev]);
    showToast('New brand guideline registered.');
    return created;
  };

  const handleAddFact = async (f: any) => {
    const created = await api.addFact(f);
    setFacts(prev => [created, ...prev]);
    showToast('Corporate fact verified & added.');
    return created;
  };

  const handleAddTerminology = async (t: any) => {
    const created = await api.addTerminology(t);
    setTerminology(prev => [created, ...prev]);
    showToast('Terminology rule added to dictionary.');
    return created;
  };

  const pendingReviewsCount = contentItems.filter(c => c.status === 'ready_for_review' || c.status === 'changes_requested').length;

  return (
    <div className="min-h-screen bg-[#08080a] flex flex-col font-sans text-slate-100 selection:bg-amber-500 selection:text-black">
      <Navbar
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        brandName={brand?.name || 'Nexus Enterprise AI'}
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        pendingReviewsCount={pendingReviewsCount}
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          pendingReviewsCount={pendingReviewsCount}
        />

        <main className="flex-1 overflow-y-auto px-6 py-8 max-w-7xl mx-auto w-full">
          {currentTab === 'dashboard' && metrics && (
            <Dashboard
              contentItems={contentItems}
              metrics={metrics}
              onOpenContent={(id) => {
                setSelectedContentId(id);
                setCurrentTab('studio');
              }}
              onNewScan={() => setCurrentTab('studio')}
            />
          )}

          {currentTab === 'studio' && (
            <ContentStudio
              contentItems={contentItems}
              selectedContentId={selectedContentId}
              onSelectContent={setSelectedContentId}
              onScanContent={handleScanContent}
              onApplyCorrection={handleApplyCorrection}
              onResolveFinding={handleResolveFinding}
              onSubmitForReview={handleSubmitForReview}
              currentRole={currentRole}
              isScanning={isScanning}
            />
          )}

          {currentTab === 'reviews' && (
            <ReviewWorkspace
              contentItems={contentItems}
              currentRole={currentRole}
              onApprove={handleApprove}
              onRequestChanges={handleRequestChanges}
              onAddComment={handleAddComment}
            />
          )}

          {currentTab === 'knowledge' && (
            <BrandKnowledge
              guidelines={guidelines}
              facts={facts}
              terminology={terminology}
              claims={claims}
              assets={assets}
              onAddGuideline={handleAddGuideline}
              onAddFact={handleAddFact}
              onAddTerminology={handleAddTerminology}
            />
          )}

          {currentTab === 'analytics' && metrics && (
            <GovernanceAnalytics metrics={metrics} />
          )}

          {currentTab === 'audit' && (
            <AuditTransparency auditLogs={auditLogs} />
          )}
        </main>
      </div>

      {/* Floating Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#121217] border border-amber-500/40 text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-semibold flex items-center gap-2.5 animate-in slide-in-from-bottom-3 duration-200">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default App;
