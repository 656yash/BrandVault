import React, { useState, useRef } from 'react';
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
  Trash2, 
  Sparkles, 
  RotateCcw, 
  ShieldCheck,
  Upload,
  FileText,
  Share2,
  Package,
  ArrowLeft,
  Eye,
  ExternalLink,
  Layers,
  Save,
  Globe,
  Sliders
} from 'lucide-react';
import type { 
  ContentItem, 
  ComplianceFinding, 
  AnalysisReport, 
  UserRole,
  BrandWorkspace
} from '@brandvault/shared';
import { 
  ChromePaperPlane, 
  ChromeShield,
  TiltedSticker
} from '../components/ChromeIcons';

interface Props {
  brand?: BrandWorkspace | null;
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

type StudioCategory = 'social_media' | 'brand_catalogue' | 'documents_to_publish';

export const ContentStudio: React.FC<Props> = ({
  brand,
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
  // Navigation within Studio: Landing Overview vs Active Editor Workspace
  const [viewMode, setViewMode] = useState<'landing' | 'editor'>(
    contentItems.length > 0 ? 'editor' : 'landing'
  );

  const currentItem = contentItems.find(c => c.id === selectedContentId) || contentItems[0];
  const [editorText, setEditorText] = useState(currentItem?.rawContent || '');
  const [activeFilter, setActiveFilter] = useState<'all' | 'critical' | 'warning' | 'suggestion'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [activeGuidelineModal, setActiveGuidelineModal] = useState<string | null>(null);

  // New Content Form Fields (Tailored to Wireframe)
  const [selectedCategory, setSelectedCategory] = useState<StudioCategory>('social_media');
  const [newTitle, setNewTitle] = useState('');
  const [newPlatform, setNewPlatform] = useState('LinkedIn');
  const [newCampaign, setNewCampaign] = useState('');
  const [newAudience, setNewAudience] = useState('');
  const [newObjective, setNewObjective] = useState('');
  const [newProductSpecs, setNewProductSpecs] = useState('');
  const [newDocumentPurpose, setNewDocumentPurpose] = useState('');
  const [newContent, setNewContent] = useState('');

  const [lastScannedAt, setLastScannedAt] = useState<string | null>(null);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);

  const docInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Synchronize editor text when current item changes
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

  const handleDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      setEditorText(content);
      let targetId = currentItem?.id;
      if (!targetId) {
        const created = await onCreateContent({
          title: file.name.replace(/\.[^/.]+$/, ""),
          contentType: 'text',
          targetAudience: 'General Audience',
          targetChannel: 'Digital Media',
          rawContent: content,
        });
        targetId = created.id;
        setViewMode('editor');
      }
      await onScanContent(targetId, content);
      setLastScannedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setUploadedImagePreview(url);
  };

  const handleScan = async () => {
    let targetId = currentItem?.id;
    if (!targetId) {
      if (!editorText.trim()) return;
      const created = await onCreateContent({
        title: `${brand?.name || 'Brand'} Marketing Collateral`,
        contentType: selectedCategory === 'social_media' ? 'social_ad' : selectedCategory === 'brand_catalogue' ? 'marketing_copy' : 'press_release',
        targetAudience: newAudience || 'General Audience',
        targetChannel: newPlatform || 'Digital Media',
        rawContent: editorText,
      });
      targetId = created.id;
    }
    await onScanContent(targetId, editorText);
    setLastScannedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  };

  const handleInjectTestViolations = async () => {
    const violationCopy = `${brand?.name || 'Our platform'} is officially India's No. 1 platform with 100% guarantee! Competitor X is obsolete and our cheap package works like revolutionary magic with 99.999% uptime.`;
    setEditorText(violationCopy);
    let targetId = currentItem?.id;
    if (!targetId) {
      const created = await onCreateContent({
        title: `${brand?.name || 'Brand'} Compliance Test Collateral`,
        contentType: 'social_ad',
        targetAudience: 'Enterprise IT Leaders',
        targetChannel: 'LinkedIn & Digital Media',
        rawContent: violationCopy,
      });
      targetId = created.id;
      setViewMode('editor');
    }
    await onScanContent(targetId, violationCopy);
    setLastScannedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  };

  const handleResetCleanCopy = () => {
    const cleanSample = `Planning your transformation? ${brand?.name || 'BrandVault'} provides an accredited, cost-effective governance framework backed by verified SOC 2 Type II compliance and 99.9% uptime SLA commitments.`;
    setEditorText(cleanSample);
    if (currentItem) {
      onScanContent(currentItem.id, cleanSample).then(() => {
        setLastScannedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      });
    }
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

    let mappedType: 'social_ad' | 'marketing_copy' | 'press_release' = 'social_ad';
    if (selectedCategory === 'brand_catalogue') mappedType = 'marketing_copy';
    if (selectedCategory === 'documents_to_publish') mappedType = 'press_release';

    const created = await onCreateContent({
      title: newTitle,
      contentType: mappedType,
      targetAudience: newAudience || 'Target Audience',
      targetChannel: selectedCategory === 'social_media' ? newPlatform : selectedCategory === 'brand_catalogue' ? 'Brand Catalogue' : 'Publications',
      rawContent: newContent || `Draft copy for ${newTitle} ready for compliance pre-flight inspection.`,
    });

    setNewTitle('');
    setNewAudience('');
    setNewCampaign('');
    setNewObjective('');
    setNewContent('');
    setShowCreateModal(false);
    onSelectContent(created.id);
    setViewMode('editor');
  };

  const handleDeleteItem = async () => {
    if (!currentItem) return;
    const confirmed = window.confirm(`Are you sure you want to remove "${currentItem.title}"?`);
    if (confirmed) {
      await onDeleteContent(currentItem.id);
    }
  };

  // -------------------------------------------------------------
  // VIEW 1: STUDIO LANDING SCREEN (WIREFRAME COMPLIANT)
  // -------------------------------------------------------------
  if (viewMode === 'landing') {
    return (
      <div className="relative space-y-10 pb-16 animate-in fade-in duration-300">
        {/* Studio Landing Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <ChromePaperPlane className="w-9 h-9 filter drop-shadow-[0_4px_10px_rgba(205,180,219,0.5)]" />
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight font-sans">
                  Studio
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">
                  Create, review and validate content against your brand standards for <strong className="text-slate-800">{brand?.name || 'Active Workspace'}</strong>.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setSelectedCategory('social_media');
              setShowCreateModal(true);
            }}
            className="glass-button flex items-center gap-2.5 px-7 py-3.5 rounded-full font-bold text-xs sm:text-sm shadow-xl hover:scale-105 transition-all cursor-pointer text-slate-900"
          >
            <Plus className="w-4 h-4" />
            <span>+ New Content</span>
          </button>
        </div>

        {/* 3 Content Categories (Wireframe Specified) */}
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-slate-500 font-bold mb-4 ml-1">
            Select Content Category to Create &amp; Inspect
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Category 1: Social Media */}
            <div 
              onClick={() => {
                setSelectedCategory('social_media');
                setShowCreateModal(true);
              }}
              className="glass-panel p-7 space-y-4 hover:scale-[1.02] transition-transform duration-300 shadow-lg cursor-pointer group border border-white"
            >
              <div className="w-12 h-12 rounded-2xl bg-pink-soft/30 border border-white flex items-center justify-center text-pink-600 shadow-sm group-hover:bg-pink-soft/50 transition-colors">
                <Share2 className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-pink-600 transition-colors">
                    Social Media
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 font-bold">
                    Multi-Platform
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Draft and inspect marketing copy for Instagram, LinkedIn, Facebook, X, and promotional threads.
                </p>
              </div>
              <div className="pt-3 border-t border-white/50 flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="font-mono text-[10px] text-slate-500">Instagram • LinkedIn • X • Facebook</span>
                <span className="text-pink-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  + Create Post
                </span>
              </div>
            </div>

            {/* Category 2: Brand Catalogue */}
            <div 
              onClick={() => {
                setSelectedCategory('brand_catalogue');
                setShowCreateModal(true);
              }}
              className="glass-panel-alt p-7 space-y-4 hover:scale-[1.02] transition-transform duration-300 shadow-lg cursor-pointer group border border-white"
            >
              <div className="w-12 h-12 rounded-2xl bg-purple-soft/30 border border-white flex items-center justify-center text-purple-600 shadow-sm group-hover:bg-purple-soft/50 transition-colors">
                <Package className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                    Brand Catalogue
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-bold">
                    Product &amp; Claims
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Validate product descriptions, technical specifications, value propositions, and official marketing claims.
                </p>
              </div>
              <div className="pt-3 border-t border-white/50 flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="font-mono text-[10px] text-slate-500">Specs • Descriptions • Claims</span>
                <span className="text-purple-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  + Add Product
                </span>
              </div>
            </div>

            {/* Category 3: Documents to Publish */}
            <div 
              onClick={() => {
                setSelectedCategory('documents_to_publish');
                setShowCreateModal(true);
              }}
              className="glass-panel p-7 space-y-4 hover:scale-[1.02] transition-transform duration-300 shadow-lg cursor-pointer group border border-white"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-soft/30 border border-white flex items-center justify-center text-blue-600 shadow-sm group-hover:bg-blue-soft/50 transition-colors">
                <FileText className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    Documents to Publish
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold">
                    Long-Form
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Review press releases, whitepapers, investor updates, newsletters, and policy memos before publication.
                </p>
              </div>
              <div className="pt-3 border-t border-white/50 flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="font-mono text-[10px] text-slate-500">Press Releases • Whitepapers • Docs</span>
                <span className="text-blue-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  + Create Document
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Existing Content Workbench Table */}
        <div className="glass-panel p-6 space-y-4 shadow-lg border border-white">
          <div className="flex items-center justify-between pb-3 border-b border-white/40">
            <div>
              <h3 className="text-base font-bold text-slate-800">Recent Content Workbench</h3>
              <p className="text-xs text-slate-500">Drafted and inspected collaterals awaiting final sign-off.</p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-600">
              {contentItems.length} items recorded
            </span>
          </div>

          {contentItems.length === 0 ? (
            <div className="p-8 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-pink-soft/30 flex items-center justify-center text-pink-600">
                <Sparkles className="w-6 h-6" />
              </div>
              <p className="text-xs text-slate-600 font-medium">
                No content items drafted yet. Select a category above or click "+ New Content" to inspect your first piece.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 border-collapse">
                <thead>
                  <tr className="border-b border-white/40 text-slate-500 uppercase text-[10px] font-mono font-bold tracking-wider">
                    <th className="p-3.5">Collateral Title</th>
                    <th className="p-3.5">Category &amp; Channel</th>
                    <th className="p-3.5">Brand Score</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Version</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {contentItems.map(item => (
                    <tr 
                      key={item.id} 
                      onClick={() => {
                        onSelectContent(item.id);
                        setViewMode('editor');
                      }}
                      className="border-b border-white/20 hover:bg-white/50 transition-colors cursor-pointer group"
                    >
                      <td className="p-3.5 font-bold text-slate-900 group-hover:text-pink-600 transition-colors">
                        {item.title}
                      </td>
                      <td className="p-3.5 font-mono text-[11px] text-slate-600">
                        <span className="capitalize">{item.contentType.replace('_', ' ')}</span> • {item.targetChannel || 'Digital'}
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                          (item.complianceScore || 100) >= 90
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}>
                          {item.complianceScore ?? '--'}/100
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-700 font-bold bg-white/70 px-2 py-0.5 rounded-full border border-white">
                          {item.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono text-[11px] text-slate-500">
                        V{item.currentVersion}
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectContent(item.id);
                            setViewMode('editor');
                          }}
                          className="px-3 py-1 rounded-full bg-white text-xs font-bold text-slate-800 border border-white shadow-xs hover:scale-105 transition-all cursor-pointer"
                        >
                          Open in Studio →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal for Creating New Content */}
        {showCreateModal && renderCreateModal()}
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: NEW CONTENT WORKSPACE (WIREFRAME COMPLIANT)
  // -------------------------------------------------------------
  return (
    <div className="relative space-y-8 pb-16 animate-in fade-in duration-300">
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={docInputRef}
        accept=".txt,.md,.json,.doc,.docx"
        className="hidden"
        onChange={handleDocUpload}
      />
      <input
        type="file"
        ref={imageInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />

      {/* Studio Top Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode('landing')}
              className="p-2 rounded-2xl bg-white/60 hover:bg-white text-slate-700 hover:text-slate-900 border border-white shadow-xs transition-all cursor-pointer"
              title="Return to Studio Categories"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight font-sans">
                  {currentItem?.title || 'Content Inspection Workspace'}
                </h1>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-700 font-bold border border-pink-200 uppercase">
                  {currentItem?.contentType.replace('_', ' ') || 'Social Ad'}
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                Multi-agent pre-flight analysis across voice, terminology, corporate facts, and claims.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {contentItems.length > 0 ? (
              <select
                value={currentItem?.id}
                onChange={(e) => onSelectContent(e.target.value)}
                className="bg-white/70 border border-white rounded-2xl px-4 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-soft shadow-sm"
              >
                {contentItems.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.title} ({c.contentType.replace('_', ' ')})
                  </option>
                ))}
              </select>
            ) : (
              <span className="text-xs font-bold text-slate-700 bg-white/70 px-4 py-2 rounded-2xl border border-white shadow-sm font-mono">
                Drafting Workbench
              </span>
            )}

            <span className="text-[11px] px-3 py-1.5 rounded-xl bg-white/70 text-slate-800 font-mono border border-white font-bold shadow-sm">
              V{currentItem?.currentVersion || 1}
            </span>

            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white/70 hover:bg-white text-xs font-bold text-slate-800 border border-white shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-pink-600" />
              <span>New Collateral</span>
            </button>

            {contentItems.length > 1 && (
              <button
                onClick={handleDeleteItem}
                className="p-2 rounded-2xl text-slate-500 hover:text-rose-600 hover:bg-white/60 border border-transparent hover:border-white transition-all cursor-pointer"
                title="Delete this collateral"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleScan}
            disabled={isScanning}
            className={`glass-button flex items-center gap-2 px-6 py-3 rounded-full font-bold text-xs shadow-lg transition-all cursor-pointer ${
              isScanning ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Scanning Agents...' : 'Inspect with BrandVault AI'}</span>
          </button>

          <button
            onClick={() => currentItem && onSubmitForReview(currentItem.id)}
            disabled={!currentItem || criticalCount > 0}
            className={`flex items-center gap-2 px-5 py-3 rounded-full text-xs font-bold transition-all cursor-pointer shadow-sm ${
              !currentItem || criticalCount > 0
                ? 'bg-white/40 text-slate-400 cursor-not-allowed border border-white/40'
                : 'bg-white text-slate-800 hover:bg-white/90 border border-white hover:scale-105'
            }`}
            title={!currentItem ? 'Inspect collateral before submitting' : criticalCount > 0 ? 'Resolve critical violations before submitting' : 'Submit for review'}
          >
            <Send className="w-3.5 h-3.5 text-blue-600" />
            <span>Submit for Review</span>
          </button>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Content Editor & Brief Fields (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="glass-panel p-6 space-y-4 shadow-lg border border-white">
            {/* Editor Toolbar Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/40 pb-3">
              <div className="adwise-bar">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Collateral Copy</span>
                <div className="text-[10px] text-slate-500 font-mono">
                  Target: {currentItem?.targetAudience || 'Enterprise'} • {currentItem?.targetChannel || 'Multi-channel'}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => docInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 hover:bg-white text-slate-800 text-[11px] font-bold border border-white shadow-xs transition-all cursor-pointer"
                  title="Upload text or markdown document into editor"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  <span>Upload Doc</span>
                </button>

                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 hover:bg-white text-slate-800 text-[11px] font-bold border border-white shadow-xs transition-all cursor-pointer"
                  title="Upload creative image banner to inspect visual adherence"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-purple-600" />
                  <span>Upload Asset</span>
                </button>

                <button
                  type="button"
                  onClick={handleInjectTestViolations}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 hover:bg-rose-200 text-rose-800 text-[11px] font-bold border border-rose-300 shadow-xs transition-all cursor-pointer"
                  title="Inject test marketing superlatives and prohibited words"
                >
                  <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                  <span>⚡ Test Violations</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetCleanCopy}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/70 hover:bg-white text-slate-700 text-[11px] font-medium border border-white shadow-xs transition-all cursor-pointer"
                  title="Restore compliant copy"
                >
                  <RotateCcw className="w-3 h-3 text-slate-500" />
                  <span>Clean Copy</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowPreviewModal(true)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/70 hover:bg-white text-slate-700 text-[11px] font-medium border border-white shadow-xs transition-all cursor-pointer"
                  title="Preview post rendered"
                >
                  <Eye className="w-3 h-3 text-slate-500" />
                  <span>Preview</span>
                </button>

                <div className="text-[11px] text-slate-600 font-mono bg-white/60 px-3 py-1 rounded-full border border-white/80 font-semibold shadow-sm">
                  {editorText.length} chars • {editorText.split(/\s+/).filter(Boolean).length} words
                </div>
              </div>
            </div>

            {/* Main Text Writing Area */}
            <div className="relative">
              <textarea
                value={editorText}
                onChange={(e) => setEditorText(e.target.value)}
                rows={11}
                placeholder="Draft or paste marketing copy, product descriptions, or publishing drafts here..."
                className="w-full bg-white/75 border border-white rounded-2xl p-4 text-sm text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-pink-soft resize-y font-sans shadow-inner placeholder:text-slate-400"
              />
            </div>

            {/* Multimodal Visual Creative & Accessibility Spec */}
            <div className="p-4 rounded-2xl bg-white/50 border border-white/70 space-y-3 shadow-sm">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-pink-600" />
                  <span>Multimodal Visual Creative &amp; Accessibility Pre-Flight</span>
                </div>
                <span className="text-[10px] text-emerald-700 font-mono font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                  WCAG 2.1 AA Compliant (4.5:1 Contrast)
                </span>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-4 text-xs text-slate-600">
                {uploadedImagePreview ? (
                  <div className="relative w-28 h-20 rounded-xl overflow-hidden border border-white shadow-sm shrink-0">
                    <img src={uploadedImagePreview} alt="Uploaded Creative Asset" className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 right-1 bg-black/60 text-[8px] text-white font-mono px-1 rounded">Inspected</span>
                  </div>
                ) : (
                  <div className="w-24 h-18 rounded-xl bg-white/80 border border-white flex flex-col items-center justify-center font-mono text-[10px] text-slate-700 shadow-sm font-bold shrink-0">
                    <span>1200x628</span>
                    <span className="text-[8px] text-blue-600">Digital Ad</span>
                  </div>
                )}
                <div className="space-y-1.5 text-[11px] w-full">
                  <div className="text-slate-800 font-semibold flex items-center justify-between">
                    <span>Palette Adherence:</span>
                    <span className="text-purple-600 font-mono font-bold">{brand?.primaryColor || '#CDB4DB'} &amp; {brand?.secondaryColor || '#A2D2FF'}</span>
                  </div>
                  <div className="text-slate-600 flex items-center justify-between">
                    <span>Logo Clear Space Buffer:</span>
                    <span className="text-emerald-700 font-bold font-mono">28px (&gt; 24px requirement)</span>
                  </div>
                  <div className="text-slate-600 flex items-center justify-between">
                    <span>WCAG Readability Ratio:</span>
                    <span className="text-emerald-700 font-bold font-mono">5.8:1 (AAA High Legibility)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Suggestions Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="glass-panel-alt p-6 space-y-4 shadow-lg border border-white">
            {/* Panel Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/40">
              <div>
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">AI Suggestions &amp; Compliance</div>
                <div className="text-[10px] text-slate-500 font-mono font-semibold">
                  {findings.length} findings • {criticalCount} blocking
                </div>
              </div>

              {/* Overall Score Badge */}
              <div className="text-right">
                <div className="text-2xl font-black font-mono text-slate-800 tracking-tight">
                  {currentItem?.complianceScore ?? 100}
                  <span className="text-xs text-slate-500 font-normal">/100</span>
                </div>
                <div className="text-[9px] font-mono uppercase tracking-wider text-slate-500 font-bold">Brand Safety Score</div>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/50 border border-white/60 text-[11px] shadow-inner">
              {(['all', 'critical', 'warning', 'suggestion'] as const).map(filter => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`flex-1 py-1.5 rounded-xl font-bold capitalize transition-all cursor-pointer ${
                    activeFilter === filter
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Findings List & Suggestions */}
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {isScanning ? (
                <div className="p-8 text-center space-y-3">
                  <RefreshCw className="w-8 h-8 text-pink-600 animate-spin mx-auto" />
                  <div className="text-sm font-bold text-slate-800">Evaluating Multi-Agent Compliance...</div>
                  <p className="text-xs text-slate-500 font-mono">
                    Running sub-second pre-flight checks across voice, facts, terminology, and legal claims.
                  </p>
                </div>
              ) : filteredFindings.length === 0 ? (
                <div className="p-6 text-center space-y-3">
                  <CheckCircle2 className="w-9 h-9 text-emerald-600 mx-auto" />
                  <div className="text-sm font-bold text-slate-800">100% Brand Compliant</div>
                  <p className="text-xs text-slate-600">
                    This copy adheres strictly to approved brand guidelines, vocabulary dictionaries, and verified facts.
                  </p>
                  {lastScannedAt && (
                    <div className="text-[10px] font-mono text-emerald-700 bg-emerald-50 py-1 px-3 rounded-full inline-block border border-emerald-200">
                      ✓ Inspected at {lastScannedAt} (0 issues)
                    </div>
                  )}

                  {/* 6-Agent Verification Checklist */}
                  <div className="mt-3 p-3.5 rounded-2xl bg-white/60 border border-white/80 text-left space-y-2 shadow-xs">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                      Multi-Agent Audit Breakdown
                    </div>
                    <div className="space-y-1.5 text-xs text-slate-700">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Tone &amp; Voice Agent</span>
                        </span>
                        <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">Pass</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Terminology Agent</span>
                        </span>
                        <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">Clean</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Corporate Fact Agent</span>
                        </span>
                        <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">Verified</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Claim Substantiation Agent</span>
                        </span>
                        <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">Compliant</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Visual &amp; A11y Agent</span>
                        </span>
                        <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">WCAG 2.1 AA</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleInjectTestViolations}
                    className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-gradient-to-r from-[#FFC8DD] to-[#BDE0FE] hover:opacity-95 text-slate-900 font-bold text-xs shadow-sm transition-all cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-pink-600" />
                    <span>Test Violation Detection (Inject Test Copy)</span>
                  </button>
                </div>
              ) : (
                filteredFindings.map((f) => (
                  <div
                    key={f.id}
                    className="p-4 rounded-2xl bg-white/65 border border-white space-y-3 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {f.severity === 'critical' ? (
                          <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0" />
                        ) : f.severity === 'warning' ? (
                          <AlertTriangle className="w-4 h-4 text-purple-600 shrink-0" />
                        ) : (
                          <Info className="w-4 h-4 text-blue-600 shrink-0" />
                        )}
                        <span className="text-xs font-bold text-slate-800">{f.issue}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono uppercase font-bold ${
                        f.severity === 'critical' ? 'bg-rose-100 text-rose-700 border border-rose-300' :
                        f.severity === 'warning' ? 'bg-purple-100 text-purple-700 border border-purple-300' :
                        'bg-blue-100 text-blue-700 border border-blue-300'
                      }`}>
                        {f.severity}
                      </span>
                    </div>

                    {/* Excerpt */}
                    <div className="text-xs bg-rose-50/80 p-2.5 rounded-xl border border-rose-200 space-y-1">
                      <div className="text-[10px] font-mono text-rose-600 uppercase font-bold">Violating Excerpt:</div>
                      <div className="text-rose-900 font-mono text-xs font-semibold">"{f.contentExcerpt}"</div>
                    </div>

                    {/* Rationale & Source Reference */}
                    <div className="text-[11px] text-slate-600 leading-relaxed font-medium">
                      {f.evidence}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono font-semibold pt-1">
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="w-3 h-3 text-slate-400" />
                        <span>Source: {f.guidelineReference}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveGuidelineModal(f.guidelineReference)}
                        className="text-pink-600 hover:text-pink-700 font-bold underline cursor-pointer"
                      >
                        View Policy
                      </button>
                    </div>

                    {/* Suggested Correction & Action Buttons */}
                    {f.suggestedCorrection && (
                      <div className="pt-2 border-t border-slate-200 space-y-2">
                        <div className="text-[10px] font-mono uppercase text-emerald-700 font-bold">
                          Recommended Context-Preserving Correction:
                        </div>
                        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                          "{f.suggestedCorrection}"
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => handleAcceptCorrection(f)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-gradient-to-r from-[#FFAFCC] to-[#BDE0FE] text-slate-900 font-bold text-xs hover:opacity-90 transition-all cursor-pointer shadow-sm"
                          >
                            <Check className="w-3.5 h-3.5 text-slate-900" />
                            <span>Apply Suggestion</span>
                          </button>
                          <button
                            onClick={() => onResolveFinding(f.id, 'rejected')}
                            className="px-3 py-1.5 rounded-xl border border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-white text-xs transition-colors cursor-pointer"
                            title="Ignore finding"
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

      {/* Render Modals */}
      {showCreateModal && renderCreateModal()}
      {showPreviewModal && renderPreviewModal()}
      {activeGuidelineModal && renderGuidelineModal()}
    </div>
  );

  // Helper Modal: Create Content Modal
  function renderCreateModal() {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
        <div className="relative w-full max-w-xl glass-panel bg-white/95 p-7 shadow-2xl text-slate-800 space-y-5 border border-white">
          <button
            onClick={() => setShowCreateModal(false)}
            className="absolute top-6 right-6 text-slate-400 hover:text-slate-800 transition-colors p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div>
            <div className="text-xs uppercase font-mono tracking-widest text-pink-600 font-bold">
              {selectedCategory === 'social_media' ? 'Social Media Campaign' : selectedCategory === 'brand_catalogue' ? 'Brand Catalogue Asset' : 'Publishing Document'}
            </div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight mt-1">
              Create New Content
            </h2>
          </div>

          <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 mb-1 font-bold">Content Title</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Q3 Cloud Intelligence Launch or Instagram Teaser"
                className="w-full bg-white/80 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-soft font-medium shadow-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 mb-1 font-bold">Platform / Publication Channel</label>
                <select
                  value={newPlatform}
                  onChange={(e) => setNewPlatform(e.target.value)}
                  className="w-full bg-white/80 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-soft font-medium shadow-sm"
                >
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Instagram">Instagram</option>
                  <option value="X">X (Twitter)</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Press Wire">PR &amp; Press Wire</option>
                  <option value="Email Newsletter">Email Newsletter</option>
                  <option value="Website & Docs">Corporate Website</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Target Audience</label>
                <input
                  type="text"
                  value={newAudience}
                  onChange={(e) => setNewAudience(e.target.value)}
                  placeholder="e.g. Enterprise IT Decision Makers"
                  className="w-full bg-white/80 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-soft font-medium shadow-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 mb-1 font-bold">Campaign Name</label>
                <input
                  type="text"
                  value={newCampaign}
                  onChange={(e) => setNewCampaign(e.target.value)}
                  placeholder="e.g. Q3 Growth Accelerate"
                  className="w-full bg-white/80 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-soft font-medium shadow-sm"
                />
              </div>
              <div>
                <label className="block text-slate-700 mb-1 font-bold">Content Objective</label>
                <input
                  type="text"
                  value={newObjective}
                  onChange={(e) => setNewObjective(e.target.value)}
                  placeholder="e.g. Drive awareness & inbound trial"
                  className="w-full bg-white/80 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-soft font-medium shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 mb-1 font-bold">Initial Draft Copy</label>
              <textarea
                rows={4}
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Type or paste draft copy here..."
                className="w-full bg-white/80 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-soft resize-none font-sans shadow-sm"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-5 py-2.5 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="glass-button px-6 py-2.5 rounded-full text-slate-900 font-bold shadow-lg hover:scale-105 transition-all cursor-pointer"
              >
                Create in Studio
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Helper Modal: Preview Modal
  function renderPreviewModal() {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
        <div className="relative w-full max-w-lg glass-panel bg-white/95 p-7 shadow-2xl text-slate-800 space-y-4 border border-white">
          <button
            onClick={() => setShowPreviewModal(false)}
            className="absolute top-6 right-6 text-slate-400 hover:text-slate-800 transition-colors p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-bold text-slate-800">Publishing Render Preview</h3>
          </div>

          <div className="p-4 rounded-2xl bg-white/80 border border-slate-200 space-y-3 shadow-inner">
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span className="font-bold text-slate-800">{brand?.name || 'BrandVault'} • {currentItem?.targetChannel || 'Digital'}</span>
              <span>Preview V{currentItem?.currentVersion || 1}</span>
            </div>

            <p className="text-sm text-slate-800 leading-relaxed font-medium whitespace-pre-wrap">
              {editorText || 'No text written yet.'}
            </p>

            {uploadedImagePreview && (
              <div className="rounded-xl overflow-hidden border border-slate-200">
                <img src={uploadedImagePreview} alt="Creative Preview" className="w-full max-h-48 object-cover" />
              </div>
            )}
          </div>

          <div className="text-right pt-2">
            <button
              onClick={() => setShowPreviewModal(false)}
              className="glass-button px-5 py-2 rounded-full text-xs font-bold text-slate-900"
            >
              Close Preview
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Helper Modal: View Guideline Policy
  function renderGuidelineModal() {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
        <div className="relative w-full max-w-md glass-panel bg-white/95 p-6 shadow-2xl text-slate-800 space-y-3 border border-white">
          <button
            onClick={() => setActiveGuidelineModal(null)}
            className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 transition-colors p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-pink-600" />
            <h3 className="text-base font-bold text-slate-800">{activeGuidelineModal}</h3>
          </div>

          <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
            <p>
              This policy is registered in the <strong>Brand Knowledge Centre</strong> for <strong>{brand?.name || 'your workspace'}</strong>.
            </p>
            <div className="p-3 rounded-xl bg-white/70 border border-slate-200 font-mono text-[11px] text-slate-700">
              Rule standard: Maintain strict persona adherence, avoid ungrounded superlatives without certified citations, and preserve brand vocabulary integrity.
            </div>
          </div>

          <div className="text-right pt-2">
            <button
              onClick={() => setActiveGuidelineModal(null)}
              className="glass-button px-5 py-2 rounded-full text-xs font-bold text-slate-900"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }
};
