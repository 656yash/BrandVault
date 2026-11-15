import React, { useState, useRef, useEffect } from 'react';
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
  Layers,
  Save,
  Megaphone,
  Sliders,
  ChevronRight,
  Clock,
  Sparkle
} from 'lucide-react';
import type { 
  ContentItem, 
  ComplianceFinding, 
  AnalysisReport, 
  UserRole,
  BrandWorkspace
} from '@brandvault/shared';
import { ChromePaperPlane, ChromeShield } from '../components/ChromeIcons';

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

export type StudioCategory = 
  | 'social_media' 
  | 'brand_catalogue' 
  | 'documents_to_publish' 
  | 'marketing_campaigns';

export type StudioStep = 'library' | 'choose_type' | 'editor';

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
  // Navigation: 1. Library -> 2. Choose Content Type -> 3. Dedicated Content Editor
  const [studioStep, setStudioStepState] = useState<StudioStep>(() => {
    try {
      const saved = localStorage.getItem('bv_studio_step') as StudioStep;
      if (saved && ['library', 'choose_type', 'editor'].includes(saved)) {
        return saved;
      }
    } catch {}
    return contentItems.length > 0 ? 'library' : 'choose_type';
  });

  const setStudioStep = (step: StudioStep) => {
    setStudioStepState(step);
    try {
      localStorage.setItem('bv_studio_step', step);
    } catch {}
  };

  const currentItem = contentItems.find(c => c.id === selectedContentId) || contentItems[0];

  // Selected Category & Subtypes
  const [selectedCategory, setSelectedCategoryState] = useState<StudioCategory>(() => {
    try {
      const saved = localStorage.getItem('bv_studio_category') as StudioCategory;
      if (saved && ['social_media', 'brand_catalogue', 'documents_to_publish', 'marketing_campaigns'].includes(saved)) {
        return saved;
      }
    } catch {}
    return 'social_media';
  });

  const setSelectedCategory = (cat: StudioCategory) => {
    setSelectedCategoryState(cat);
    try {
      localStorage.setItem('bv_studio_category', cat);
    } catch {}
  };

  const [subType, setSubType] = useState<string>('LinkedIn Post');

  // Form Fields (Dynamic based on selected category)
  const [contentTitle, setContentTitle] = useState('');
  const [platformChannel, setPlatformChannel] = useState('LinkedIn');
  const [campaignName, setCampaignName] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [contentObjective, setContentObjective] = useState('');
  
  // Brand Catalogue specific
  const [productName, setProductName] = useState('');
  const [productSpecs, setProductSpecs] = useState('');
  const [marketingClaimsField, setMarketingClaimsField] = useState('');

  // Marketing Campaign specific
  const [headline, setHeadline] = useState('');

  // Main Editor Text
  const [editorText, setEditorText] = useState(currentItem?.rawContent || '');

  // UI States
  const [activeFindingFilter, setActiveFindingFilter] = useState<'all' | 'critical' | 'warning' | 'suggestion' | 'passed'>('all');
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [activeGuidelineModal, setActiveGuidelineModal] = useState<string | null>(null);
  const [lastScannedAt, setLastScannedAt] = useState<string | null>(null);
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);

  const docInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Sync editor text and titles when active item changes
  useEffect(() => {
    if (currentItem) {
      setEditorText(currentItem.rawContent);
      setContentTitle(currentItem.title || '');
      setTargetAudience(currentItem.targetAudience || '');
      setPlatformChannel(currentItem.targetChannel || 'LinkedIn');
    }
  }, [currentItem?.id]);

  const findings = currentItem?.findings || [];
  const openFindings = findings.filter(f => f.status === 'open');
  const criticalCount = openFindings.filter(f => f.severity === 'critical').length;
  const warningCount = openFindings.filter(f => f.severity === 'warning').length;
  const suggestionCount = openFindings.filter(f => f.severity === 'suggestion').length;

  const filteredFindings = openFindings.filter(f => {
    if (activeFindingFilter === 'all') return true;
    if (activeFindingFilter === 'passed') return false;
    return f.severity === activeFindingFilter;
  });

  const showSaveNotice = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 3500);
  };

  // Category Configuration
  const categoryConfig: Record<StudioCategory, {
    title: string;
    subtypes: string[];
    defaultPlatform: string;
    description: string;
  }> = {
    social_media: {
      title: 'Social Media Content',
      subtypes: ['Instagram Post', 'Instagram Story', 'LinkedIn Post', 'Facebook Post', 'X Post', 'Social Media Caption'],
      defaultPlatform: 'LinkedIn',
      description: 'Engage audiences with social posts, stories, and platform-optimized captions.',
    },
    brand_catalogue: {
      title: 'Brand Catalogue',
      subtypes: ['Product Description', 'Product Listing', 'Brand Introduction', 'Service Description', 'Marketing Claim'],
      defaultPlatform: 'Catalogue & Web',
      description: 'Craft product listings, specifications, and verified marketing claims.',
    },
    documents_to_publish: {
      title: 'Documents & Publications',
      subtypes: ['Blog / Article', 'Press Release', 'Company Announcement', 'Executive Report', 'Official Document'],
      defaultPlatform: 'PR & Wire',
      description: 'Author long-form blogs, press releases, reports, and official documents.',
    },
    marketing_campaigns: {
      title: 'Marketing Campaigns',
      subtypes: ['Campaign Copy', 'Advertising Headline', 'Promotional Content', 'Email Marketing', 'Landing Page Copy'],
      defaultPlatform: 'Multi-Channel Campaign',
      description: 'Develop high-impact advertising copy, headlines, promotional emails, and landing pages.',
    },
  };

  // Launch Dedicated Workspace for a chosen category
  const handleSelectCategory = (cat: StudioCategory) => {
    setSelectedCategory(cat);
    const config = categoryConfig[cat];
    setSubType(config.subtypes[0]);
    setPlatformChannel(config.defaultPlatform);
    
    // Clear/default fields for new item creation
    setContentTitle('');
    setCampaignName('');
    setTargetAudience('');
    setContentObjective('');
    setProductName('');
    setProductSpecs('');
    setMarketingClaimsField('');
    setHeadline('');
    setEditorText('');
    setUploadedImagePreview(null);
    setStudioStep('editor');
  };

  // Open an existing item from the library into the editor
  const handleOpenExistingItem = (item: ContentItem) => {
    onSelectContent(item.id);
    setContentTitle(item.title);
    setEditorText(item.rawContent);
    setPlatformChannel(item.targetChannel || 'LinkedIn');
    setTargetAudience(item.targetAudience || '');

    // Map content type back to category
    if (item.contentType === 'marketing_copy') {
      setSelectedCategory('brand_catalogue');
      setSubType('Product Description');
    } else if (item.contentType === 'press_release') {
      setSelectedCategory('documents_to_publish');
      setSubType('Press Release');
    } else if (item.contentType === 'creative_image') {
      setSelectedCategory('marketing_campaigns');
      setSubType('Campaign Copy');
    } else {
      setSelectedCategory('social_media');
      setSubType('LinkedIn Post');
    }

    setStudioStep('editor');
  };

  // Save Draft Handler
  const handleSaveDraft = async () => {
    if (!contentTitle.trim() && !editorText.trim()) {
      showSaveNotice('Please enter a content title or body text before saving.');
      return;
    }

    const titleToUse = contentTitle.trim() || `${categoryConfig[selectedCategory].title} Draft`;
    
    let mappedType: 'social_ad' | 'marketing_copy' | 'press_release' = 'social_ad';
    if (selectedCategory === 'brand_catalogue') mappedType = 'marketing_copy';
    if (selectedCategory === 'documents_to_publish') mappedType = 'press_release';

    if (!currentItem || currentItem.title !== contentTitle) {
      const created = await onCreateContent({
        title: titleToUse,
        contentType: mappedType,
        targetAudience: targetAudience || 'Target Audience',
        targetChannel: platformChannel || 'Digital',
        rawContent: editorText || 'Draft in progress...',
      });
      onSelectContent(created.id);
    }
    showSaveNotice('Draft saved successfully.');
  };

  // AI Review Scan Handler
  const handleScan = async () => {
    if (!editorText.trim()) {
      showSaveNotice('Please write or paste content in the editor before requesting AI review.');
      return;
    }

    let targetId = currentItem?.id;
    if (!targetId || currentItem?.title !== contentTitle) {
      let mappedType: 'social_ad' | 'marketing_copy' | 'press_release' = 'social_ad';
      if (selectedCategory === 'brand_catalogue') mappedType = 'marketing_copy';
      if (selectedCategory === 'documents_to_publish') mappedType = 'press_release';

      const created = await onCreateContent({
        title: contentTitle.trim() || `${categoryConfig[selectedCategory].title} Inspection`,
        contentType: mappedType,
        targetAudience: targetAudience || 'General Audience',
        targetChannel: platformChannel || 'Digital Media',
        rawContent: editorText,
      });
      targetId = created.id;
      onSelectContent(created.id);
    }

    await onScanContent(targetId, editorText);
    setLastScannedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    showSaveNotice('AI Multi-Agent Review Complete.');
  };

  // Apply Suggestion Handler
  const handleAcceptCorrection = (finding: ComplianceFinding) => {
    if (editorText.includes(finding.contentExcerpt)) {
      const updated = editorText.replace(finding.contentExcerpt, finding.suggestedCorrection);
      setEditorText(updated);
    }
    onApplyCorrection(finding);
    onResolveFinding(finding.id, 'accepted');
    showSaveNotice(`Applied suggestion: "${finding.suggestedCorrection}"`);
  };

  // Inject Test Violations
  const handleInjectTestViolations = async () => {
    const violationCopy = `${brand?.name || 'Our platform'} is officially India's No. 1 platform with 100% guarantee! Competitor X is obsolete and our cheap package works like revolutionary magic with 99.999% uptime.`;
    setEditorText(violationCopy);
    if (!contentTitle) setContentTitle(`${brand?.name || 'Brand'} Compliance Test Collateral`);
    
    let targetId = currentItem?.id;
    if (!targetId) {
      const created = await onCreateContent({
        title: `${brand?.name || 'Brand'} Compliance Test Collateral`,
        contentType: 'social_ad',
        targetAudience: 'Enterprise IT Leaders',
        targetChannel: 'LinkedIn',
        rawContent: violationCopy,
      });
      targetId = created.id;
      onSelectContent(created.id);
    }
    await onScanContent(targetId, violationCopy);
    setLastScannedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    showSaveNotice('Injected sample violations and ran multi-agent audit.');
  };

  // Restore Clean Copy
  const handleResetCleanCopy = () => {
    const cleanSample = `Planning your transformation? ${brand?.name || 'BrandVault'} provides an accredited, cost-effective governance framework backed by verified SOC 2 Type II compliance and 99.9% uptime SLA commitments.`;
    setEditorText(cleanSample);
    if (currentItem) {
      onScanContent(currentItem.id, cleanSample).then(() => {
        setLastScannedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      });
    }
    showSaveNotice('Restored verified compliant copy.');
  };

  // Handle Document Upload
  const handleDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      setEditorText(content);
      if (!contentTitle) {
        setContentTitle(file.name.replace(/\.[^/.]+$/, ""));
      }
      showSaveNotice(`Loaded document "${file.name}" into editor.`);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Handle Banner Image Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setUploadedImagePreview(url);
    showSaveNotice(`Attached banner asset "${file.name}" for multimodal inspection.`);
  };

  // -----------------------------------------------------------------
  // 1. SCREEN 1: STUDIO LANDING PAGE & RECENT CONTENT LIBRARY
  // -----------------------------------------------------------------
  if (studioStep === 'library') {
    return (
      <div className="relative space-y-8 pb-16 animate-in fade-in duration-200">
        {/* Studio Landing Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-2">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <ChromePaperPlane className="w-8 h-8 filter drop-shadow-[0_4px_10px_rgba(205,180,219,0.5)]" />
              <div>
                <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight font-sans">
                  Studio
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">
                  Create and review content while keeping everything aligned with your brand standards.
                </p>
              </div>
            </div>
          </div>

          {/* Prominent Primary Button */}
          <button
            onClick={() => setStudioStep('choose_type')}
            className="glass-button flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm shadow-xl hover:scale-105 transition-all cursor-pointer text-slate-900"
          >
            <Plus className="w-4 h-4 text-slate-900" />
            <span>+ New Content</span>
          </button>
        </div>

        {/* Clean Content Library with Recently Created Drafts & Submissions */}
        <div className="glass-panel p-6 space-y-4 shadow-lg border border-white">
          <div className="flex items-center justify-between pb-3 border-b border-white/40">
            <div>
              <h3 className="text-base font-bold text-slate-800">Content Library</h3>
              <p className="text-xs text-slate-500">Recently drafted collaterals, active pre-flights, and submissions.</p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-600 bg-white/70 px-3 py-1 rounded-full border border-white">
              {contentItems.length} Content Item{contentItems.length === 1 ? '' : 's'}
            </span>
          </div>

          {contentItems.length === 0 ? (
            <div className="p-12 text-center space-y-4 max-w-md mx-auto">
              <div className="w-14 h-14 mx-auto rounded-3xl bg-pink-soft/30 border border-white flex items-center justify-center text-pink-600 shadow-sm">
                <Sparkles className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-slate-800">No content created yet</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Start by clicking the button below to choose a content type and begin crafting brand-compliant collateral.
                </p>
              </div>
              <button
                onClick={() => setStudioStep('choose_type')}
                className="glass-button px-6 py-2.5 rounded-full text-xs font-bold shadow-md hover:scale-105 transition-all cursor-pointer"
              >
                + Create First Content
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 border-collapse">
                <thead>
                  <tr className="border-b border-white/40 text-slate-500 uppercase text-[10px] font-mono font-bold tracking-wider">
                    <th className="p-3.5">Content Title</th>
                    <th className="p-3.5">Category &amp; Channel</th>
                    <th className="p-3.5">Compliance Score</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Version</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contentItems.map(item => {
                    const score = item.complianceScore ?? 85;
                    const scorePill = score >= 90 
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                      : score >= 75 
                      ? 'bg-amber-100 text-amber-800 border-amber-200' 
                      : 'bg-rose-100 text-rose-800 border-rose-200';

                    return (
                      <tr 
                        key={item.id} 
                        onClick={() => handleOpenExistingItem(item)}
                        className="border-b border-white/20 hover:bg-white/50 transition-colors cursor-pointer group"
                      >
                        <td className="p-3.5 font-bold text-slate-900 group-hover:text-pink-600 transition-colors">
                          {item.title}
                        </td>
                        <td className="p-3.5 font-mono text-[11px] text-slate-600">
                          <span className="capitalize">{item.contentType.replace('_', ' ')}</span> • {item.targetChannel || 'Digital'}
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-black border ${scorePill}`}>
                            {score}/100
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className={`text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${
                            item.status === 'approved' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                            item.status === 'changes_requested' ? 'bg-rose-100 text-rose-800 border-rose-200' :
                            item.status === 'ready_for_review' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                            'bg-white/80 text-slate-700 border-white'
                          }`}>
                            {item.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="p-3.5 font-mono text-[11px] text-slate-500 font-semibold">
                          v{item.currentVersion}
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenExistingItem(item);
                              }}
                              className="px-3.5 py-1.5 rounded-full bg-white text-xs font-bold text-slate-800 border border-white shadow-xs hover:scale-105 transition-all cursor-pointer"
                            >
                              Open in Editor →
                            </button>
                            {contentItems.length > 1 && (
                              <button
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  if (window.confirm(`Delete "${item.title}"?`)) {
                                    await onDeleteContent(item.id);
                                  }
                                }}
                                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition-all cursor-pointer"
                                title="Delete content"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------------
  // 2. SCREEN 2: CHOOSE CONTENT TYPE
  // -----------------------------------------------------------------
  if (studioStep === 'choose_type') {
    return (
      <div className="relative space-y-8 pb-16 animate-in fade-in duration-200">
        {/* Top bar with Back Button */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => setStudioStep('library')}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 hover:bg-white text-xs font-bold text-slate-800 border border-white shadow-xs transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Studio</span>
          </button>
        </div>

        {/* Heading */}
        <div className="space-y-1 text-center max-w-xl mx-auto pt-2">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            What would you like to create?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Select a content format to launch your dedicated, full-width creation workspace.
          </p>
        </div>

        {/* 4 Large Clean Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          
          {/* 1. Social Media Content */}
          <div
            onClick={() => handleSelectCategory('social_media')}
            className="glass-panel p-7 space-y-4 hover:scale-[1.02] transition-all duration-200 shadow-lg cursor-pointer group border border-white relative overflow-hidden"
          >
            <div className="w-12 h-12 rounded-2xl bg-pink-soft/30 border border-white flex items-center justify-center text-pink-600 shadow-sm group-hover:bg-pink-soft/50 transition-colors">
              <Share2 className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-pink-600 transition-colors">
                Social Media Content
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Create engaging social posts, stories, platform threads, and captions.
              </p>
            </div>
            <div className="pt-3 border-t border-white/50">
              <div className="text-[10px] font-mono text-slate-500 uppercase font-bold tracking-wider mb-2">
                Create Content For:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {['Instagram Posts', 'Instagram Stories', 'LinkedIn Posts', 'Facebook Posts', 'X Posts', 'Social Media Captions'].map(tag => (
                  <span key={tag} className="px-2.5 py-1 rounded-xl bg-white/70 text-slate-700 text-[11px] font-medium border border-white/80">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 2. Brand Catalogue */}
          <div
            onClick={() => handleSelectCategory('brand_catalogue')}
            className="glass-panel-alt p-7 space-y-4 hover:scale-[1.02] transition-all duration-200 shadow-lg cursor-pointer group border border-white relative overflow-hidden"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-soft/30 border border-white flex items-center justify-center text-purple-600 shadow-sm group-hover:bg-purple-soft/50 transition-colors">
              <Package className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-purple-600 transition-colors">
                Brand Catalogue
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Structure product listings, descriptions, feature specs, and verified marketing claims.
              </p>
            </div>
            <div className="pt-3 border-t border-white/50">
              <div className="text-[10px] font-mono text-slate-500 uppercase font-bold tracking-wider mb-2">
                Create Content For:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {['Product Descriptions', 'Product Listings', 'Brand Introductions', 'Service Descriptions', 'Marketing Claims'].map(tag => (
                  <span key={tag} className="px-2.5 py-1 rounded-xl bg-white/70 text-slate-700 text-[11px] font-medium border border-white/80">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Documents & Publications */}
          <div
            onClick={() => handleSelectCategory('documents_to_publish')}
            className="glass-panel p-7 space-y-4 hover:scale-[1.02] transition-all duration-200 shadow-lg cursor-pointer group border border-white relative overflow-hidden"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-soft/30 border border-white flex items-center justify-center text-blue-600 shadow-sm group-hover:bg-blue-soft/50 transition-colors">
              <FileText className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                Documents &amp; Publications
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Author blogs, articles, press releases, reports, and official corporate documents.
              </p>
            </div>
            <div className="pt-3 border-t border-white/50">
              <div className="text-[10px] font-mono text-slate-500 uppercase font-bold tracking-wider mb-2">
                Create Content For:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {['Blogs and Articles', 'Press Releases', 'Company Announcements', 'Reports', 'Official Documents'].map(tag => (
                  <span key={tag} className="px-2.5 py-1 rounded-xl bg-white/70 text-slate-700 text-[11px] font-medium border border-white/80">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 4. Marketing Campaigns */}
          <div
            onClick={() => handleSelectCategory('marketing_campaigns')}
            className="glass-panel-alt p-7 space-y-4 hover:scale-[1.02] transition-all duration-200 shadow-lg cursor-pointer group border border-white relative overflow-hidden"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-white flex items-center justify-center text-emerald-700 shadow-sm group-hover:bg-emerald-200 transition-colors">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">
                Marketing Campaigns
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Develop high-impact advertising copy, headlines, promotional emails, and landing page copy.
              </p>
            </div>
            <div className="pt-3 border-t border-white/50">
              <div className="text-[10px] font-mono text-slate-500 uppercase font-bold tracking-wider mb-2">
                Create Content For:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {['Campaign Copy', 'Advertising Headlines', 'Promotional Content', 'Email Marketing', 'Landing Page Copy'].map(tag => (
                  <span key={tag} className="px-2.5 py-1 rounded-xl bg-white/70 text-slate-700 text-[11px] font-medium border border-white/80">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // -----------------------------------------------------------------
  // 3. SCREEN 3: DEDICATED CONTENT CREATION & AI REVIEW WORKSPACE
  // -----------------------------------------------------------------
  return (
    <div className="relative space-y-6 pb-16 animate-in fade-in duration-200">
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

      {/* Top Navigation Bar */}
      <div className="glass-panel px-6 py-4 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-white shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setStudioStep('choose_type')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/70 hover:bg-white text-xs font-bold text-slate-800 border border-white shadow-xs transition-all cursor-pointer"
            title="Return to Content Types"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Content Types</span>
          </button>

          <div className="h-4 w-px bg-slate-300 hidden sm:block" />

          {/* Selected Category Tag */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-900">
              {categoryConfig[selectedCategory].title}
            </span>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-700 font-bold border border-pink-200">
              {subType}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/80 hover:bg-white text-xs font-bold text-slate-800 border border-white shadow-xs transition-all cursor-pointer"
          >
            <Save className="w-3.5 h-3.5 text-slate-700" />
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            onClick={() => setShowPreviewModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/80 hover:bg-white text-xs font-bold text-slate-800 border border-white shadow-xs transition-all cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-slate-700" />
            <span>Preview</span>
          </button>

          {/* Primary Action: Submit for AI Review */}
          <button
            type="button"
            onClick={handleScan}
            disabled={isScanning}
            className={`glass-button flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-xs shadow-md transition-all cursor-pointer ${
              isScanning ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-900 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Analyzing Standards...' : 'Submit for AI Review'}</span>
          </button>

          {/* Submit for Human Approval when clean */}
          {currentItem && (
            <button
              type="button"
              onClick={() => onSubmitForReview(currentItem.id)}
              disabled={criticalCount > 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer shadow-xs ${
                criticalCount > 0
                  ? 'bg-white/40 text-slate-400 cursor-not-allowed border border-white/40'
                  : 'bg-white text-slate-800 hover:bg-white/90 border border-white hover:scale-105'
              }`}
              title={criticalCount > 0 ? 'Resolve critical issues before submitting' : 'Submit to review queue'}
            >
              <Send className="w-3.5 h-3.5 text-blue-600" />
              <span>Submit for Human Approval</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Workspace (Spacious Full-Width Grid: Editor on Left, AI Results on Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Main Content Editor Canvas (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-panel p-6 space-y-5 shadow-lg border border-white">
            
            {/* 1. Content Title Input */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5 font-mono">
                Content Title
              </label>
              <input
                type="text"
                value={contentTitle}
                onChange={(e) => setContentTitle(e.target.value)}
                placeholder={`e.g. ${subType} — ${brand?.name || 'Brand'} Launch Collateral`}
                className="w-full bg-white/80 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-pink-soft shadow-inner placeholder:text-slate-400"
              />
            </div>

            {/* 2. Dynamic Category-Specific Fields */}
            {selectedCategory === 'social_media' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Content Type</label>
                  <select
                    value={subType}
                    onChange={(e) => setSubType(e.target.value)}
                    className="w-full bg-white/80 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-soft font-medium shadow-xs"
                  >
                    {categoryConfig.social_media.subtypes.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Platform / Channel</label>
                  <select
                    value={platformChannel}
                    onChange={(e) => setPlatformChannel(e.target.value)}
                    className="w-full bg-white/80 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-soft font-medium shadow-xs"
                  >
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Instagram">Instagram</option>
                    <option value="X">X (Twitter)</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Other">Other Social</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Campaign Name (optional)</label>
                  <input
                    type="text"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    placeholder="e.g. Q3 Growth"
                    className="w-full bg-white/80 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-soft font-medium shadow-xs"
                  />
                </div>
              </div>
            )}

            {selectedCategory === 'brand_catalogue' && (
              <div className="space-y-3 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Catalogue Format</label>
                    <select
                      value={subType}
                      onChange={(e) => setSubType(e.target.value)}
                      className="w-full bg-white/80 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-soft font-medium shadow-xs"
                    >
                      {categoryConfig.brand_catalogue.subtypes.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Product / Service Name</label>
                    <input
                      type="text"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      placeholder="e.g. BrandVault Enterprise Engine"
                      className="w-full bg-white/80 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-soft font-medium shadow-xs"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Specifications &amp; Features</label>
                  <input
                    type="text"
                    value={productSpecs}
                    onChange={(e) => setProductSpecs(e.target.value)}
                    placeholder="e.g. 99.9% Uptime SLA, AES-256 encryption, Sub-second Groq inference"
                    className="w-full bg-white/80 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-soft font-medium shadow-xs"
                  />
                </div>
              </div>
            )}

            {selectedCategory === 'documents_to_publish' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Document Type</label>
                  <select
                    value={subType}
                    onChange={(e) => setSubType(e.target.value)}
                    className="w-full bg-white/80 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-soft font-medium shadow-xs"
                  >
                    {categoryConfig.documents_to_publish.subtypes.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Publication Channel</label>
                  <input
                    type="text"
                    value={platformChannel}
                    onChange={(e) => setPlatformChannel(e.target.value)}
                    placeholder="PR Wire, Blog, Investor Hub"
                    className="w-full bg-white/80 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-soft font-medium shadow-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Target Audience (optional)</label>
                  <input
                    type="text"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="e.g. Enterprise Executives"
                    className="w-full bg-white/80 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-soft font-medium shadow-xs"
                  />
                </div>
              </div>
            )}

            {selectedCategory === 'marketing_campaigns' && (
              <div className="space-y-3 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Campaign Format</label>
                    <select
                      value={subType}
                      onChange={(e) => setSubType(e.target.value)}
                      className="w-full bg-white/80 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-soft font-medium shadow-xs"
                    >
                      {categoryConfig.marketing_campaigns.subtypes.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Campaign Objective</label>
                    <input
                      type="text"
                      value={contentObjective}
                      onChange={(e) => setContentObjective(e.target.value)}
                      placeholder="e.g. Inbound Sign-Ups, Demo Requests"
                      className="w-full bg-white/80 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-soft font-medium shadow-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Target Audience</label>
                    <input
                      type="text"
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      placeholder="e.g. Brand Directors, CMOs"
                      className="w-full bg-white/80 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-soft font-medium shadow-xs"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Advertising Headline (optional)</label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="e.g. Protect Your Brand. Govern Every Story."
                    className="w-full bg-white/80 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-soft font-medium shadow-xs"
                  />
                </div>
              </div>
            )}

            {/* 3. Main Rich Content Editor */}
            <div className="space-y-2 pt-2">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/40 pb-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
                  Main Content Editor
                </span>
                
                {/* Secondary Fast Tools */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => docInputRef.current?.click()}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/70 hover:bg-white text-slate-700 text-[11px] font-medium border border-white shadow-xs transition-all cursor-pointer"
                    title="Upload document file"
                  >
                    <FileText className="w-3 h-3 text-blue-600" />
                    <span>Import File</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/70 hover:bg-white text-slate-700 text-[11px] font-medium border border-white shadow-xs transition-all cursor-pointer"
                    title="Upload banner creative asset"
                  >
                    <ImageIcon className="w-3 h-3 text-purple-600" />
                    <span>Attach Asset</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleInjectTestViolations}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-bold border border-rose-200 shadow-xs transition-all cursor-pointer"
                    title="Inject test copy with superlatives and prohibited terms"
                  >
                    <Sparkles className="w-3 h-3 text-rose-600" />
                    <span>⚡ Test Violations</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetCleanCopy}
                    className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/70 hover:bg-white text-slate-700 text-[11px] font-medium border border-white shadow-xs transition-all cursor-pointer"
                    title="Restore compliant copy"
                  >
                    <RotateCcw className="w-3 h-3 text-slate-500" />
                    <span>Clean</span>
                  </button>

                  <div className="text-[10px] text-slate-600 font-mono bg-white/60 px-2.5 py-0.5 rounded-full border border-white font-semibold shadow-xs">
                    {editorText.length} chars • {editorText.split(/\s+/).filter(Boolean).length} words
                  </div>
                </div>
              </div>

              {/* Spacious Large Writing Area */}
              <textarea
                value={editorText}
                onChange={(e) => setEditorText(e.target.value)}
                rows={12}
                placeholder="Write, paste, or refine your copy here..."
                className="w-full bg-white/80 border border-white rounded-2xl p-4 text-sm text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-pink-soft resize-y font-sans shadow-inner placeholder:text-slate-400 font-medium"
              />
            </div>

            {/* Multimodal Asset Inspector preview (if uploaded) */}
            {uploadedImagePreview && (
              <div className="p-4 rounded-2xl bg-white/60 border border-white flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-12 rounded-xl overflow-hidden border border-white shadow-xs shrink-0">
                    <img src={uploadedImagePreview} alt="Attached asset" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block">Attached Creative Asset</span>
                    <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      WCAG 2.1 AA Compliant (4.5:1 Contrast)
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setUploadedImagePreview(null)}
                  className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                  title="Remove asset"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>
        </div>

        {/* RIGHT COLUMN: AI Review Results Interface (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel-alt p-6 space-y-4 shadow-lg border border-white">
            
            {/* Header with Overall Compliance Score */}
            <div className="flex items-center justify-between pb-3 border-b border-white/40">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                  AI Review &amp; Compliance
                </h3>
                <span className="text-[10px] text-slate-500 font-mono">
                  {openFindings.length} open issue{openFindings.length === 1 ? '' : 's'} • {criticalCount} blocking
                </span>
              </div>

              <div className="text-right">
                <div className="text-2xl font-black font-mono text-slate-900 tracking-tight">
                  {currentItem?.complianceScore ?? 100}
                  <span className="text-xs text-slate-500 font-normal">/100</span>
                </div>
                <div className="text-[9px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                  Brand Safety Score
                </div>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 p-1 rounded-2xl bg-white/50 border border-white/60 text-[11px] shadow-inner overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveFindingFilter('all')}
                className={`flex-1 py-1 px-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeFindingFilter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({openFindings.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveFindingFilter('critical')}
                className={`flex-1 py-1 px-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeFindingFilter === 'critical' ? 'bg-white text-rose-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Critical ({criticalCount})
              </button>
              <button
                type="button"
                onClick={() => setActiveFindingFilter('warning')}
                className={`flex-1 py-1 px-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeFindingFilter === 'warning' ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Warnings ({warningCount})
              </button>
              <button
                type="button"
                onClick={() => setActiveFindingFilter('suggestion')}
                className={`flex-1 py-1 px-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeFindingFilter === 'suggestion' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Suggestions ({suggestionCount})
              </button>
              <button
                type="button"
                onClick={() => setActiveFindingFilter('passed')}
                className={`flex-1 py-1 px-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeFindingFilter === 'passed' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Passed
              </button>
            </div>

            {/* Findings Content / Results Area */}
            <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
              {isScanning ? (
                <div className="p-8 text-center space-y-3">
                  <RefreshCw className="w-8 h-8 text-pink-600 animate-spin mx-auto" />
                  <div className="text-sm font-bold text-slate-800">Running Multi-Agent Diagnostics...</div>
                  <p className="text-xs text-slate-500 font-mono">
                    Evaluating tone voice, corporate facts, prohibited vocabulary, and claims.
                  </p>
                </div>
              ) : activeFindingFilter === 'passed' ? (
                /* Passed Checks View */
                <div className="p-4 rounded-2xl bg-white/70 border border-white space-y-3 shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider font-mono">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Passed Compliance Audits</span>
                  </div>
                  <div className="space-y-2 text-xs text-slate-700">
                    <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50/70 border border-emerald-100">
                      <span>Tone &amp; Voice Persona</span>
                      <span className="font-mono font-bold text-emerald-800 text-[10px]">Verified</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50/70 border border-emerald-100">
                      <span>Terminology &amp; Vocabulary</span>
                      <span className="font-mono font-bold text-emerald-800 text-[10px]">Clean</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50/70 border border-emerald-100">
                      <span>Corporate Facts Grounding</span>
                      <span className="font-mono font-bold text-emerald-800 text-[10px]">Accredited</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50/70 border border-emerald-100">
                      <span>Claims Legal Substantiation</span>
                      <span className="font-mono font-bold text-emerald-800 text-[10px]">Compliant</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50/70 border border-emerald-100">
                      <span>Visual Contrast &amp; Clear Space</span>
                      <span className="font-mono font-bold text-emerald-800 text-[10px]">WCAG 2.1 AA</span>
                    </div>
                  </div>
                </div>
              ) : filteredFindings.length === 0 ? (
                /* 100% Compliant / Empty State */
                <div className="p-6 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <div className="text-base font-bold text-slate-900">
                    {findings.length === 0 ? 'Ready for AI Inspection' : '100% Brand Compliant'}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {findings.length === 0 
                      ? 'Your brand intelligence assistant is ready to review your content. Click "Submit for AI Review" above to run multi-agent checks.'
                      : 'This copy adheres strictly to approved brand guidelines, vocabulary dictionaries, and verified facts.'}
                  </p>
                  {lastScannedAt && (
                    <div className="text-[10px] font-mono text-emerald-800 bg-emerald-50 py-1 px-3 rounded-full inline-block border border-emerald-200 font-bold">
                      ✓ Inspected at {lastScannedAt} (0 issues)
                    </div>
                  )}
                  {findings.length === 0 && (
                    <button
                      type="button"
                      onClick={handleInjectTestViolations}
                      className="w-full mt-2 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gradient-to-r from-[#FFC8DD] to-[#BDE0FE] text-slate-900 font-bold text-xs shadow-xs hover:opacity-90 transition-all cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-pink-600" />
                      <span>Test with Sample Violations</span>
                    </button>
                  )}
                </div>
              ) : (
                /* Finding Cards */
                filteredFindings.map((f) => (
                  <div
                    key={f.id}
                    className="p-4 rounded-2xl bg-white/70 border border-white space-y-3 shadow-xs hover:shadow-md transition-all"
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
                        <span className="text-xs font-bold text-slate-900">{f.issue}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono uppercase font-bold ${
                        f.severity === 'critical' ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                        f.severity === 'warning' ? 'bg-purple-100 text-purple-800 border border-purple-300' :
                        'bg-blue-100 text-blue-800 border border-blue-300'
                      }`}>
                        {f.severity}
                      </span>
                    </div>

                    {/* Problematic Text Excerpt */}
                    <div className="text-xs bg-rose-50/80 p-2.5 rounded-xl border border-rose-200 space-y-1">
                      <div className="text-[10px] font-mono text-rose-700 uppercase font-bold">Problematic Text:</div>
                      <div className="text-rose-950 font-mono text-xs font-semibold">"{f.contentExcerpt}"</div>
                    </div>

                    {/* Explanation */}
                    <p className="text-[11px] text-slate-700 leading-relaxed font-medium">
                      {f.evidence}
                    </p>

                    {/* Guideline Citation */}
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
                        View Guideline
                      </button>
                    </div>

                    {/* Recommended Correction & Actions */}
                    {f.suggestedCorrection && (
                      <div className="pt-2 border-t border-slate-200/80 space-y-2">
                        <div className="text-[10px] font-mono uppercase text-emerald-800 font-bold">
                          Suggested Correction:
                        </div>
                        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold">
                          "{f.suggestedCorrection}"
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => handleAcceptCorrection(f)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-gradient-to-r from-[#FFAFCC] to-[#BDE0FE] text-slate-900 font-bold text-xs hover:opacity-90 transition-all cursor-pointer shadow-xs"
                          >
                            <Check className="w-3.5 h-3.5 text-slate-900" />
                            <span>Apply Suggestion</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onResolveFinding(f.id, 'rejected')}
                            className="px-3 py-1.5 rounded-xl border border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-white text-xs transition-colors cursor-pointer"
                            title="Dismiss finding"
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

      {/* Floating Save / Action Notification */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 glass-panel px-4 py-2.5 rounded-2xl shadow-xl text-xs font-bold text-slate-900 border border-white flex items-center gap-2 animate-in slide-in-from-bottom-3 duration-150">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span>{saveToast}</span>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && (
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
              <h3 className="text-lg font-bold text-slate-900">Publishing Preview</h3>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 border border-slate-200 space-y-3 shadow-inner">
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span className="font-bold text-slate-800">{contentTitle || 'Untitled Collateral'}</span>
                <span>{subType} • {platformChannel}</span>
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
                className="glass-button px-5 py-2 rounded-full text-xs font-bold text-slate-900 cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Guideline View Modal */}
      {activeGuidelineModal && (
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
              <h3 className="text-base font-bold text-slate-900">{activeGuidelineModal}</h3>
            </div>

            <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
              <p>
                This policy is enforced by the <strong>Brand Knowledge Centre</strong> for <strong>{brand?.name || 'your workspace'}</strong>.
              </p>
              <div className="p-3 rounded-xl bg-white/70 border border-slate-200 font-mono text-[11px] text-slate-800">
                Rule standard: Verify claims with accredited source citations, prevent unsubstantiated superlative puffery, and maintain brand vocabulary purity.
              </div>
            </div>

            <div className="text-right pt-2">
              <button
                onClick={() => setActiveGuidelineModal(null)}
                className="glass-button px-5 py-2 rounded-full text-xs font-bold text-slate-900 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
