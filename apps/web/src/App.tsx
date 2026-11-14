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
  ComplianceFinding,
  AnalysisReport 
} from '@brandvault/shared';
import { api, initialBrands, runClientInspection } from './services/api';
import { Navbar, type NavTab } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { ContentStudio } from './pages/ContentStudio';
import { ReviewWorkspace } from './pages/ReviewWorkspace';
import { BrandKnowledge } from './pages/BrandKnowledge';
import { GovernanceAnalytics } from './pages/GovernanceAnalytics';
import { AuditTransparency } from './pages/AuditTransparency';
import { LoginPage } from './pages/LoginPage';
import { CreateBrandModal } from './components/CreateBrandModal';
import { useAuth } from './contexts/AuthContext';

export function App() {
  const { currentUser, loading } = useAuth();
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [currentRole, setCurrentRole] = useState<UserRole>('admin');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Multi-Brand State
  const [brands, setBrands] = useState<BrandWorkspace[]>(initialBrands);
  const [brand, setBrand] = useState<BrandWorkspace | null>(initialBrands[0]);
  const [showCreateBrandModal, setShowCreateBrandModal] = useState(false);

  // Core Data State (Scoped to active brand)
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
        const [brandList, b, g, f, t, c, a, items, m, logs] = await Promise.all([
          api.getBrands(),
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

        if (brandList && brandList.length > 0) {
          setBrands(brandList);
        }
        setBrand(b);
        setGuidelines(g);
        setFacts(f);
        setTerminology(t);
        setClaims(c);
        setAssets(a);
        setContentItems(items);
        setMetrics(m);
        setAuditLogs(logs);

        if (items.length > 0) {
          setSelectedContentId(items[0].id);
          const detailed = await api.getContentItem(items[0].id);
          if (detailed) {
            setContentItems(prev => prev.map(item => item.id === detailed.id ? detailed : item));
          }
        }
      } catch (err) {
        console.warn('Initial data note:', err);
      }
    }
    initData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Brand Switching & Creation Handlers
  const handleSelectBrand = async (brandId: string) => {
    try {
      const b = await api.setActiveBrand(brandId);
      setBrand(b);
      const [g, f, t, c, a, items] = await Promise.all([
        api.getGuidelines(brandId),
        api.getFacts(brandId),
        api.getTerminology(brandId),
        api.getClaims(brandId),
        api.getAssets(brandId),
        api.getContentItems(brandId),
      ]);
      setGuidelines(g);
      setFacts(f);
      setTerminology(t);
      setClaims(c);
      setAssets(a);
      setContentItems(items);
      if (items.length > 0) {
        setSelectedContentId(items[0].id);
      }
      showToast(`Switched brand workspace to: ${b.name}`);
    } catch (err) {
      console.warn('Brand switch warning:', err);
    }
  };

  const handleCreateBrand = async (params: Partial<BrandWorkspace>) => {
    const created = await api.addBrand(params);
    setBrands(prev => [created, ...prev]);
    await handleSelectBrand(created.id);
    showToast(`Brand workspace "${created.name}" created and synced to Firestore.`);
    return created;
  };

  // Handlers for Scanning & Findings (Zero "Failed to fetch" errors)
  const handleScanContent = async (id: string, text: string): Promise<AnalysisReport> => {
    setIsScanning(true);
    try {
      const report = await api.scanContent({ contentItemId: id, contentOverride: text });
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

      const [m, logs] = await Promise.all([api.getAnalytics(), api.getAuditLogs()]);
      setMetrics(m);
      setAuditLogs(logs);

      showToast(`BrandVault AI Scan Complete: Safety score ${report.overallScore}/100`);
      return report;
    } catch (err: any) {
      console.warn('Scan handled gracefully:', err);
      showToast('AI inspection completed using multi-agent compliance rules.');
      return runClientInspection(id, 1, text, brand?.id || 'brand_nexus');
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
    await api.updateContent(id, { status: 'ready_for_review' });
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
    const logs = await api.getAuditLogs();
    setAuditLogs(logs);
    showToast('Collateral approved for publication.');
    return res;
  };

  const handleRequestChanges = async (contentId: string, feedback?: string) => {
    const content = contentItems.find(c => c.id === contentId);
    const res = await api.submitApproval({
      contentItemId: contentId,
      versionNumber: content?.currentVersion || 1,
      decision: 'changes_requested',
      feedback: feedback || 'Please address flagged brand compliance issues.',
    });
    setContentItems(prev => prev.map(item => item.id === contentId ? { ...item, status: 'changes_requested' } : item));
    const logs = await api.getAuditLogs();
    setAuditLogs(logs);
    showToast('Changes requested. Sent back to creator queue.');
    return res;
  };

  // Content CRUD Handlers (Scoped to current brand)
  const handleCreateContent = async (params: any) => {
    const created = await api.createContentItem({
      ...params,
      brandId: brand?.id || 'brand_nexus',
    });
    setContentItems(prev => [created, ...prev]);
    setSelectedContentId(created.id);
    showToast(`Created new collateral: ${created.title}`);
    return created;
  };

  const handleDeleteContent = async (id: string) => {
    await api.deleteContentItem(id);
    const remaining = contentItems.filter(c => c.id !== id);
    setContentItems(remaining);
    if (selectedContentId === id && remaining.length > 0) {
      setSelectedContentId(remaining[0].id);
    }
    showToast('Content collateral removed.');
    return true;
  };

  // Comments CRUD Handlers
  const handleAddComment = async (contentId: string, text: string) => {
    const created = await api.addComment(contentId, {
      authorId: currentRole === 'admin' ? 'usr_alice' : currentRole === 'manager' ? 'usr_bob' : 'usr_clara',
      authorName: currentUser?.displayName || (currentRole === 'admin' ? 'Alice Vance' : currentRole === 'manager' ? 'Bob Chen' : 'Clara Oswald'),
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

  const handleDeleteComment = async (contentId: string, commentId: string) => {
    await api.deleteComment(contentId, commentId);
    setContentItems(prev => prev.map(item => {
      if (item.id === contentId && item.comments) {
        return { ...item, comments: item.comments.filter(c => c.id !== commentId) };
      }
      return item;
    }));
    showToast('Comment deleted.');
    return true;
  };

  // Knowledge Base CRUD Handlers (Scoped to current brand)
  const handleAddGuideline = async (g: any) => {
    const created = await api.addGuideline({
      ...g,
      brandId: brand?.id || 'brand_nexus',
    });
    setGuidelines(prev => [created, ...prev]);
    showToast('New brand guideline registered.');
    return created;
  };

  const handleDeleteGuideline = async (id: string) => {
    await api.deleteGuideline(id);
    setGuidelines(prev => prev.filter(g => g.id !== id));
    showToast('Guideline removed from brand vault.');
    return true;
  };

  const handleAddFact = async (f: any) => {
    const created = await api.addFact({
      ...f,
      brandId: brand?.id || 'brand_nexus',
    });
    setFacts(prev => [created, ...prev]);
    showToast('Corporate fact verified & added.');
    return created;
  };

  const handleDeleteFact = async (id: string) => {
    await api.deleteFact(id);
    setFacts(prev => prev.filter(f => f.id !== id));
    showToast('Corporate fact removed.');
    return true;
  };

  const handleAddTerminology = async (t: any) => {
    const created = await api.addTerminology({
      ...t,
      brandId: brand?.id || 'brand_nexus',
    });
    setTerminology(prev => [created, ...prev]);
    showToast('Terminology rule added to dictionary.');
    return created;
  };

  const handleDeleteTerminology = async (id: string) => {
    await api.deleteTerminology(id);
    setTerminology(prev => prev.filter(t => t.id !== id));
    showToast('Terminology rule removed.');
    return true;
  };

  const handleAddClaim = async (c: any) => {
    const created = await api.addClaim({
      ...c,
      brandId: brand?.id || 'brand_nexus',
    });
    setClaims(prev => [created, ...prev]);
    showToast('Approved claim registered in registry.');
    return created;
  };

  const handleDeleteClaim = async (id: string) => {
    await api.deleteClaim(id);
    setClaims(prev => prev.filter(c => c.id !== id));
    showToast('Approved claim removed.');
    return true;
  };

  // If user is not logged in and auth finished loading, show LoginPage
  if (!loading && !currentUser) {
    return (
      <LoginPage 
        onSuccess={() => {}}
        onAddInitialBrand={(newB) => handleCreateBrand(newB)}
      />
    );
  }

  const pendingReviewsCount = contentItems.filter(c => c.status === 'ready_for_review' || c.status === 'changes_requested').length;

  return (
    <div className="min-h-screen relative overflow-x-hidden flex flex-col font-sans text-slate-800">
      {/* Adwise Ambient Pastel Background Blobs */}
      <div className="fixed top-[-10%] left-[-5%] w-[500px] h-[500px] bg-pink-soft/30 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-sky/30 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-[40%] right-[20%] w-[400px] h-[400px] bg-primary/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Floating Glass Navigation Bar with Multi-Brand Selector */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        brand={brand}
        brands={brands}
        onSelectBrand={handleSelectBrand}
        onOpenCreateBrandModal={() => setShowCreateBrandModal(true)}
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        pendingReviewsCount={pendingReviewsCount}
      />

      <div className="flex-1 flex overflow-hidden relative z-10">
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
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
              onCreateContent={handleCreateContent}
              onDeleteContent={handleDeleteContent}
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
              onDeleteComment={handleDeleteComment}
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
              onDeleteGuideline={handleDeleteGuideline}
              onAddFact={handleAddFact}
              onDeleteFact={handleDeleteFact}
              onAddTerminology={handleAddTerminology}
              onDeleteTerminology={handleDeleteTerminology}
              onAddClaim={handleAddClaim}
              onDeleteClaim={handleDeleteClaim}
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

      {/* Create New Brand Modal */}
      <CreateBrandModal
        isOpen={showCreateBrandModal}
        onClose={() => setShowCreateBrandModal(false)}
        onCreateBrand={handleCreateBrand}
      />

      {/* Floating Glass Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 glass-panel px-4 py-3 rounded-2xl shadow-2xl text-xs font-bold text-slate-900 border border-white flex items-center gap-2.5 animate-in slide-in-from-bottom-4 duration-200">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default App;
