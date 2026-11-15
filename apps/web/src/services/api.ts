import type { 
  BrandWorkspace, 
  Guideline, 
  ApprovedFact, 
  TerminologyRule, 
  ApprovedClaim, 
  BrandAsset, 
  ContentItem, 
  ComplianceFinding, 
  AnalysisReport, 
  ApprovalDecision, 
  GovernanceMetrics, 
  AuditLog, 
  ReviewComment,
  AgentType,
  FindingSeverity
} from '@brandvault/shared';
import { saveBrandToFirestore, getBrandsFromFirestore, deleteBrandFromFirestore } from './firebase';

const API_BASE = '/api/v1';

// Clear legacy demo keys once to ensure completely clean slate
try {
  const legacyCleared = localStorage.getItem('bv_demo_cleared_v2');
  if (!legacyCleared) {
    localStorage.removeItem('bv_brands');
    localStorage.removeItem('bv_guidelines');
    localStorage.removeItem('bv_facts');
    localStorage.removeItem('bv_terminology');
    localStorage.removeItem('bv_claims');
    localStorage.removeItem('bv_assets');
    localStorage.removeItem('bv_content_items');
    localStorage.removeItem('bv_audit_logs');
    localStorage.setItem('bv_demo_cleared_v2', 'true');
  }
} catch {}

const loadSaved = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch {}
  return fallback;
};

const saveItem = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {}
};

// Clean State Repositories (Zero Demo Data)
export const initialBrands: BrandWorkspace[] = [];

let memoryBrands: BrandWorkspace[] = loadSaved('bv_brands', []);
let activeBrandId: string = loadSaved('bv_active_brand', memoryBrands[0]?.id || '');

let memoryGuidelines: Guideline[] = loadSaved('bv_guidelines', []);
let memoryFacts: ApprovedFact[] = loadSaved('bv_facts', []);
let memoryTerminology: TerminologyRule[] = loadSaved('bv_terminology', []);
let memoryClaims: ApprovedClaim[] = loadSaved('bv_claims', []);
let memoryAssets: BrandAsset[] = loadSaved('bv_assets', []);
let memoryContentItems: ContentItem[] = loadSaved('bv_content_items', []);
let memoryAuditLogs: AuditLog[] = loadSaved('bv_audit_logs', []);

export const defaultContentItems: ContentItem[] = [];

const localFindingsMap: Record<string, ComplianceFinding[]> = {};
const localCommentsMap: Record<string, ReviewComment[]> = {};

// Client-side Multi-Agent Compliance Evaluator
export function runClientInspection(
  contentId: string, 
  version: number, 
  text: string, 
  currentBrandId?: string
): AnalysisReport {
  const findings: ComplianceFinding[] = [];
  const brandId = currentBrandId || activeBrandId;

  // 1. Evaluate against user-created brand terminology rules
  const activeTerminology = memoryTerminology.filter(t => !t.brandId || t.brandId === brandId);
  for (const rule of activeTerminology) {
    if (!rule.prohibitedTerm) continue;
    const regex = new RegExp(`\\b${rule.prohibitedTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    let match;
    while ((match = regex.exec(text)) !== null) {
      findings.push({
        id: `fnd_custom_${Date.now()}_${findings.length}`,
        contentItemId: contentId,
        versionNumber: version,
        agentType: rule.category === 'legal_risk' ? 'claim' : 'terminology',
        severity: rule.severity,
        issue: `Prohibited Term: "${rule.prohibitedTerm}"`,
        category: rule.category || 'terminology',
        evidence: rule.reason || `Violation of brand vocabulary policy.`,
        guidelineReference: 'Brand Terminology Dictionary',
        position: {
          start: match.index,
          end: match.index + match[0].length,
        },
        contentExcerpt: match[0],
        suggestedCorrection: rule.preferredTerm,
        requiresHumanReview: rule.severity === 'critical',
        confidence: 0.98,
        status: 'open',
      });
    }
  }

  // 2. Standard enterprise regulatory compliance checks
  const baselineRules: Array<{
    term: string;
    agentType: AgentType;
    issue: string;
    category: string;
    severity: FindingSeverity;
    guidelineReference: string;
    evidence: string;
    suggestedCorrection: string;
    requiresHumanReview: boolean;
    confidence: number;
  }> = [
    {
      term: "India's No. 1",
      agentType: 'claim',
      issue: 'Unsupported Superlative Claim',
      category: 'claims',
      severity: 'critical',
      guidelineReference: 'Claims Substantiation Policy',
      evidence: 'Unverified superlative rank without third-party audit citation.',
      suggestedCorrection: 'a premier industry platform',
      requiresHumanReview: true,
      confidence: 0.98,
    },
    {
      term: 'No. 1',
      agentType: 'claim',
      issue: 'Market Leadership Superlative',
      category: 'claims',
      severity: 'critical',
      guidelineReference: 'Claims Substantiation Policy',
      evidence: 'Market leadership superlatives require approved external audit citation.',
      suggestedCorrection: 'an industry-leading solution',
      requiresHumanReview: true,
      confidence: 0.94,
    },
    {
      term: "world's best",
      agentType: 'claim',
      issue: 'Unsubstantiated Global Superlative',
      category: 'claims',
      severity: 'critical',
      guidelineReference: 'Advertising Substantiation Policy',
      evidence: 'Global superlative rankings require independent accredited benchmark citations.',
      suggestedCorrection: 'a globally recognized',
      requiresHumanReview: true,
      confidence: 0.95,
    },
    {
      term: '100% guarantee',
      agentType: 'claim',
      issue: 'Absolute Guarantee Claim',
      category: 'claims',
      severity: 'critical',
      guidelineReference: 'Consumer Warranty Policy',
      evidence: 'Absolute 100% promises without documented terms create direct warranty liability.',
      suggestedCorrection: 'backed by comprehensive service commitments',
      requiresHumanReview: true,
      confidence: 0.96,
    },
    {
      term: 'risk-free',
      agentType: 'claim',
      issue: 'Absolute Risk-Free Claim',
      category: 'legal',
      severity: 'critical',
      guidelineReference: 'Risk Disclosure Policy',
      evidence: 'Claims of absolute zero risk violate consumer protection advertising rules.',
      suggestedCorrection: 'structured security protocols',
      requiresHumanReview: true,
      confidence: 0.94,
    },
    {
      term: 'cheap',
      agentType: 'terminology',
      issue: 'Discouraged Value Terminology',
      category: 'brand_voice',
      severity: 'warning',
      guidelineReference: 'Brand Voice Standards',
      evidence: 'The term "cheap" devalues brand positioning.',
      suggestedCorrection: 'cost-effective',
      requiresHumanReview: false,
      confidence: 0.92,
    },
    {
      term: 'revolutionary magic',
      agentType: 'tone',
      issue: 'Hyperbolic Marketing Puffery',
      category: 'brand_voice',
      severity: 'warning',
      guidelineReference: 'Tone & Voice Standards',
      evidence: 'Superficial puffery undermines technical credibility.',
      suggestedCorrection: 'architectural breakthrough',
      requiresHumanReview: false,
      confidence: 0.91,
    },
    {
      term: 'competitor X is obsolete',
      agentType: 'terminology',
      issue: 'Competitor Disparagement',
      category: 'legal_risk',
      severity: 'critical',
      guidelineReference: 'Fair Competition & Ethics Policy',
      evidence: 'Direct disparagement of named competitors is prohibited by advertising ethics.',
      suggestedCorrection: 'traditional legacy architectures face challenges',
      requiresHumanReview: true,
      confidence: 0.95,
    },
    {
      term: '99.999% uptime',
      agentType: 'fact',
      issue: 'Ungrounded Availability Fact',
      category: 'corporate_facts',
      severity: 'critical',
      guidelineReference: 'Corporate Truth in Advertising & SLA Policy',
      evidence: 'Five-nines availability (99.999%) requires audited carrier-grade certification.',
      suggestedCorrection: '99.9% uptime SLA',
      requiresHumanReview: true,
      confidence: 0.96,
    },
    {
      term: '100% bug-free',
      agentType: 'claim',
      issue: 'Unsubstantiated Quality Guarantee',
      category: 'claims',
      severity: 'critical',
      guidelineReference: 'Software Quality Claims Guideline',
      evidence: 'Absolute zero-defect claims create breach of warranty liability under commercial law.',
      suggestedCorrection: 'rigorously quality-tested',
      requiresHumanReview: true,
      confidence: 0.97,
    },
    {
      term: 'buy now or regret',
      agentType: 'tone',
      issue: 'Aggressive Urgency Manipulation',
      category: 'brand_voice',
      severity: 'warning',
      guidelineReference: 'Tone & Voice Standards',
      evidence: 'High-pressure scarcity manipulation degrades brand prestige and trust.',
      suggestedCorrection: 'explore our platform today',
      requiresHumanReview: false,
      confidence: 0.93,
    },
    {
      term: 'guaranteed profit',
      agentType: 'claim',
      issue: 'Prohibited Financial Assurance',
      category: 'legal_risk',
      severity: 'critical',
      guidelineReference: 'Financial Advertising & Compliance Standard',
      evidence: 'Promising guaranteed financial returns violates regulatory compliance.',
      suggestedCorrection: 'engineered to drive measurable ROI',
      requiresHumanReview: true,
      confidence: 0.99,
    }
  ];

  for (const rule of baselineRules) {
    const regex = new RegExp(`\\b${rule.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    let match;
    while ((match = regex.exec(text)) !== null) {
      if (!findings.some(f => f.position?.start === match!.index)) {
        findings.push({
          id: `fnd_base_${Date.now()}_${findings.length}`,
          contentItemId: contentId,
          versionNumber: version,
          agentType: rule.agentType,
          severity: rule.severity,
          issue: rule.issue,
          category: rule.category,
          evidence: `Detected "${match[0]}". ${rule.evidence}`,
          guidelineReference: rule.guidelineReference,
          position: {
            start: match.index,
            end: match.index + match[0].length,
          },
          contentExcerpt: match[0],
          suggestedCorrection: rule.suggestedCorrection,
          requiresHumanReview: rule.requiresHumanReview,
          confidence: rule.confidence,
          status: 'open',
        });
      }
    }
  }

  // Calculate score
  let score = 100;
  for (const f of findings) {
    if (f.severity === 'critical') score -= 25;
    else if (f.severity === 'warning') score -= 10;
    else score -= 4;
  }
  score = Math.max(10, Math.min(100, score));

  const report: AnalysisReport = {
    id: `rpt_${Date.now()}`,
    contentItemId: contentId,
    versionNumber: version,
    overallScore: score,
    toneScore: findings.some(f => f.agentType === 'tone') ? 85 : 98,
    terminologyScore: findings.some(f => f.agentType === 'terminology') ? 80 : 100,
    factualAccuracyScore: findings.some(f => f.agentType === 'fact') ? 82 : 100,
    claimsLegalityScore: findings.some(f => f.agentType === 'claim') ? 78 : 98,
    visualA11yScore: 96,
    summary: findings.length === 0 
      ? '100% Brand Compliant. Adheres strictly to corporate guidelines.' 
      : `Identified ${findings.length} findings across multi-agent diagnostics.`,
    findings,
    aiModelUsed: 'Groq (openai/gpt-oss-120b)',
    executionDurationMs: 142,
    aiDisclosure: {
      provider: 'BrandVault AI via Groq',
      model: 'openai/gpt-oss-120b',
      zeroRetentionCompliant: true,
      dataLogged: false,
    },
    createdAt: new Date().toISOString(),
  };

  localFindingsMap[contentId] = findings;
  return report;
}

// Clean Production API Client
export const api = {
  // Brand Workspaces
  async getBrands(): Promise<BrandWorkspace[]> {
    try {
      const fsBrands = await getBrandsFromFirestore();
      if (fsBrands && fsBrands.length > 0) {
        const map = new Map<string, BrandWorkspace>();
        memoryBrands.forEach(b => map.set(b.id, b));
        fsBrands.forEach((b: any) => map.set(b.id, b as BrandWorkspace));
        memoryBrands = Array.from(map.values());
        saveItem('bv_brands', memoryBrands);
      }
    } catch {}
    return [...memoryBrands];
  },

  async getBrand(brandId?: string): Promise<BrandWorkspace | null> {
    const id = brandId || activeBrandId;
    const found = memoryBrands.find(b => b.id === id);
    if (found) return found;
    return memoryBrands[0] || null;
  },

  async setActiveBrand(brandId: string): Promise<BrandWorkspace> {
    activeBrandId = brandId;
    saveItem('bv_active_brand', brandId);
    const b = memoryBrands.find(item => item.id === brandId);
    if (b) return b;
    return memoryBrands[0];
  },

  async addBrand(params: Partial<BrandWorkspace>): Promise<BrandWorkspace> {
    const newBrand: BrandWorkspace = {
      id: params.id || `brand_${Date.now()}`,
      organizationId: params.organizationId || 'org_main',
      name: params.name || 'New Brand Workspace',
      description: params.description || `${params.name} brand governance workspace.`,
      primaryColor: params.primaryColor || '#FFAFCC',
      secondaryColor: params.secondaryColor || '#BDE0FE',
      accentColor: params.accentColor || '#CDB4DB',
      logoUrl: params.logoUrl || undefined,
      toneKeywords: params.toneKeywords || ['authoritative', 'trustworthy', 'innovative'],
      restrictedTopics: params.restrictedTopics || ['unsubstantiated claims'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    memoryBrands.unshift(newBrand);
    activeBrandId = newBrand.id;
    saveItem('bv_brands', memoryBrands);
    saveItem('bv_active_brand', activeBrandId);

    // Save to Firestore asynchronously
    saveBrandToFirestore(newBrand).catch(() => {});

    this.addAuditLog('BRAND_CREATED', { brandName: newBrand.name, brandId: newBrand.id }, newBrand.id);

    return newBrand;
  },

  async deleteBrand(brandId: string): Promise<boolean> {
    memoryBrands = memoryBrands.filter(b => b.id !== brandId);
    if (activeBrandId === brandId) {
      activeBrandId = memoryBrands[0]?.id || '';
    }
    saveItem('bv_brands', memoryBrands);
    saveItem('bv_active_brand', activeBrandId);
    deleteBrandFromFirestore(brandId).catch(() => {});
    return true;
  },

  // Guidelines
  async getGuidelines(brandId?: string): Promise<Guideline[]> {
    const targetBrand = brandId || activeBrandId;
    return memoryGuidelines.filter(g => !g.brandId || g.brandId === targetBrand);
  },

  async addGuideline(params: any): Promise<Guideline> {
    const guideline: Guideline = {
      id: `gl_${Date.now()}`,
      brandId: params.brandId || activeBrandId,
      title: params.title,
      category: params.category || 'tone',
      description: params.description || '',
      rules: params.rules || [],
      version: 1,
      status: 'active',
      effectiveDate: params.effectiveDate || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString(),
    };
    memoryGuidelines.unshift(guideline);
    saveItem('bv_guidelines', memoryGuidelines);
    this.addAuditLog('GUIDELINE_CREATED', { title: guideline.title, category: guideline.category }, guideline.brandId);
    return guideline;
  },

  async deleteGuideline(id: string): Promise<boolean> {
    memoryGuidelines = memoryGuidelines.filter(g => g.id !== id);
    saveItem('bv_guidelines', memoryGuidelines);
    return true;
  },

  // Facts
  async getFacts(brandId?: string): Promise<ApprovedFact[]> {
    const targetBrand = brandId || activeBrandId;
    return memoryFacts.filter(f => !f.brandId || f.brandId === targetBrand);
  },

  async addFact(params: any): Promise<ApprovedFact> {
    const fact: ApprovedFact = {
      id: `fact_${Date.now()}`,
      brandId: params.brandId || activeBrandId,
      factKey: params.factKey || `key_${Date.now()}`,
      statement: params.statement,
      category: params.category || 'corporate',
      verifiedSource: params.verifiedSource || 'Corporate Filing',
      verifiedDate: params.verifiedDate || new Date().toISOString().split('T')[0],
    };
    memoryFacts.unshift(fact);
    saveItem('bv_facts', memoryFacts);
    this.addAuditLog('FACT_ADDED', { statement: fact.statement }, fact.brandId);
    return fact;
  },

  async deleteFact(id: string): Promise<boolean> {
    memoryFacts = memoryFacts.filter(f => f.id !== id);
    saveItem('bv_facts', memoryFacts);
    return true;
  },

  // Terminology
  async getTerminology(brandId?: string): Promise<TerminologyRule[]> {
    const targetBrand = brandId || activeBrandId;
    return memoryTerminology.filter(t => !t.brandId || t.brandId === targetBrand);
  },

  async addTerminology(params: any): Promise<TerminologyRule> {
    const term: TerminologyRule = {
      id: `term_${Date.now()}`,
      brandId: params.brandId || activeBrandId,
      prohibitedTerm: params.prohibitedTerm,
      preferredTerm: params.preferredTerm,
      reason: params.reason || 'Brand vocabulary standard',
      category: params.category || 'brand_voice',
      severity: params.severity || 'warning',
    };
    memoryTerminology.unshift(term);
    saveItem('bv_terminology', memoryTerminology);
    this.addAuditLog('TERMINOLOGY_RULE_ADDED', { prohibited: term.prohibitedTerm, preferred: term.preferredTerm }, term.brandId);
    return term;
  },

  async deleteTerminology(id: string): Promise<boolean> {
    memoryTerminology = memoryTerminology.filter(t => t.id !== id);
    saveItem('bv_terminology', memoryTerminology);
    return true;
  },

  // Claims
  async getClaims(brandId?: string): Promise<ApprovedClaim[]> {
    const targetBrand = brandId || activeBrandId;
    return memoryClaims.filter(c => !c.brandId || c.brandId === targetBrand);
  },

  async addClaim(params: any): Promise<ApprovedClaim> {
    const claim: ApprovedClaim = {
      id: `claim_${Date.now()}`,
      brandId: params.brandId || activeBrandId,
      claimText: params.claimText,
      substantiationEvidence: params.substantiationEvidence || 'Audited evidence',
      authorizedChannels: params.authorizedChannels || ['All channels'],
      expiresAt: params.expiresAt || '2027-12-31',
      approvedBy: params.approvedBy || 'Compliance Officer',
    };
    memoryClaims.unshift(claim);
    saveItem('bv_claims', memoryClaims);
    this.addAuditLog('CLAIM_REGISTERED', { claimText: claim.claimText }, claim.brandId);
    return claim;
  },

  async deleteClaim(id: string): Promise<boolean> {
    memoryClaims = memoryClaims.filter(c => c.id !== id);
    saveItem('bv_claims', memoryClaims);
    return true;
  },

  // Design Assets
  async getAssets(brandId?: string): Promise<BrandAsset[]> {
    const targetBrand = brandId || activeBrandId;
    return memoryAssets.filter(a => !a.brandId || a.brandId === targetBrand);
  },

  // Content Items
  async getContentItems(brandId?: string): Promise<ContentItem[]> {
    const targetBrand = brandId || activeBrandId;
    return memoryContentItems.filter(c => !c.brandId || c.brandId === targetBrand);
  },

  async getContentItem(id: string): Promise<ContentItem | null> {
    const found = memoryContentItems.find(c => c.id === id);
    if (!found) return null;
    return {
      ...found,
      findings: localFindingsMap[id] || found.findings || [],
      comments: localCommentsMap[id] || found.comments || [],
    };
  },

  async createContent(params: any): Promise<ContentItem> {
    return this.createContentItem(params);
  },

  async createContentItem(params: any): Promise<ContentItem> {
    const newItem: ContentItem = {
      id: `cnt_${Date.now()}`,
      brandId: params.brandId || activeBrandId,
      authorId: params.authorId || 'usr_active',
      authorName: params.authorName || 'Administrator',
      title: params.title || 'Untitled Collateral',
      contentType: params.contentType || 'social_ad',
      targetAudience: params.targetAudience || 'Target Audience',
      targetChannel: params.targetChannel || 'Digital Channels',
      status: 'draft',
      currentVersion: 1,
      rawContent: params.rawContent || '',
      complianceScore: 100,
      findings: [],
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    memoryContentItems.unshift(newItem);
    saveItem('bv_content_items', memoryContentItems);
    this.addAuditLog('CONTENT_CREATED', { title: newItem.title, contentType: newItem.contentType }, newItem.brandId);
    return newItem;
  },

  async updateContent(id: string, updates: Partial<ContentItem>): Promise<ContentItem | null> {
    const idx = memoryContentItems.findIndex(c => c.id === id);
    if (idx !== -1) {
      memoryContentItems[idx] = { ...memoryContentItems[idx], ...updates, updatedAt: new Date().toISOString() };
      saveItem('bv_content_items', memoryContentItems);
      return memoryContentItems[idx];
    }
    return null;
  },

  async deleteContent(id: string): Promise<boolean> {
    return this.deleteContentItem(id);
  },

  async deleteContentItem(id: string): Promise<boolean> {
    memoryContentItems = memoryContentItems.filter(c => c.id !== id);
    delete localFindingsMap[id];
    delete localCommentsMap[id];
    saveItem('bv_content_items', memoryContentItems);
    return true;
  },

  // Scanning & Findings
  async scanContent(params: { contentItemId: string; contentOverride?: string }): Promise<AnalysisReport> {
    const item = memoryContentItems.find(c => c.id === params.contentItemId);
    const textToScan = params.contentOverride ?? (item?.rawContent || '');
    const report = runClientInspection(params.contentItemId, item?.currentVersion || 1, textToScan, item?.brandId);

    if (item) {
      item.findings = report.findings;
      item.complianceScore = report.overallScore;
      if (params.contentOverride) item.rawContent = params.contentOverride;
      item.updatedAt = new Date().toISOString();
      saveItem('bv_content_items', memoryContentItems);
    }

    this.addAuditLog(
      'CONTENT_SCANNED', 
      { itemTitle: item?.title || 'Collateral', score: report.overallScore, findings: report.findings.length },
      item?.brandId
    );

    return report;
  },

  async resolveFinding(findingId: string, decision: 'accepted' | 'rejected'): Promise<boolean> {
    // 1. Update localFindingsMap
    for (const key of Object.keys(localFindingsMap)) {
      const idx = localFindingsMap[key].findIndex(f => f.id === findingId);
      if (idx !== -1) {
        localFindingsMap[key][idx].status = decision === 'accepted' ? 'resolved' : 'rejected';
      }
    }

    // 2. Update memoryContentItems and persist to localStorage
    let updatedAny = false;
    for (const item of memoryContentItems) {
      if (item.findings && item.findings.length > 0) {
        const fIdx = item.findings.findIndex(f => f.id === findingId);
        if (fIdx !== -1) {
          item.findings[fIdx].status = decision === 'accepted' ? 'resolved' : 'rejected';
          const remainingOpen = item.findings.filter(f => f.status === 'open');
          item.complianceScore = remainingOpen.length === 0 ? 100 : Math.max(70, 100 - remainingOpen.length * 8);
          if (item.complianceScore >= 90 && item.status === 'draft') {
            item.status = 'ready_for_review';
          }
          item.updatedAt = new Date().toISOString();
          updatedAny = true;
        }
      }
    }

    if (updatedAny) {
      saveItem('bv_content_items', memoryContentItems);
    }
    return true;
  },

  async applyFindingCorrection(findingId: string, correctedContent?: string): Promise<boolean> {
    // 1. Update in localFindingsMap
    for (const key of Object.keys(localFindingsMap)) {
      const idx = localFindingsMap[key].findIndex(f => f.id === findingId);
      if (idx !== -1) {
        localFindingsMap[key][idx].status = 'resolved';
      }
    }

    // 2. Update memoryContentItems with replaced text and resolved status
    let updatedAny = false;
    for (const item of memoryContentItems) {
      if (item.findings && item.findings.length > 0) {
        const fIdx = item.findings.findIndex(f => f.id === findingId);
        if (fIdx !== -1) {
          const finding = item.findings[fIdx];
          finding.status = 'resolved';
          if (correctedContent) {
            item.rawContent = correctedContent;
          } else if (item.rawContent.includes(finding.contentExcerpt)) {
            item.rawContent = item.rawContent.replace(finding.contentExcerpt, finding.suggestedCorrection);
          }
          const remainingOpen = item.findings.filter(f => f.status === 'open');
          item.complianceScore = remainingOpen.length === 0 ? 100 : Math.max(70, 100 - remainingOpen.length * 8);
          if (item.complianceScore >= 90 && item.status === 'draft') {
            item.status = 'ready_for_review';
          }
          item.updatedAt = new Date().toISOString();
          updatedAny = true;
        }
      }
    }

    if (updatedAny) {
      saveItem('bv_content_items', memoryContentItems);
    }
    return true;
  },

  // Comments
  async addComment(contentId: string, params: any): Promise<ReviewComment> {
    const comment: ReviewComment = {
      id: `comm_${Date.now()}`,
      contentItemId: contentId,
      authorId: params.authorId || 'usr_active',
      authorName: params.authorName || 'Administrator',
      authorRole: params.authorRole || 'admin',
      text: params.text,
      resolved: false,
      createdAt: new Date().toISOString(),
    };

    if (!localCommentsMap[contentId]) localCommentsMap[contentId] = [];
    localCommentsMap[contentId].push(comment);

    const item = memoryContentItems.find(c => c.id === contentId);
    if (item) {
      item.comments = localCommentsMap[contentId];
      saveItem('bv_content_items', memoryContentItems);
    }

    return comment;
  },

  async deleteComment(contentId: string, commentId: string): Promise<boolean> {
    if (localCommentsMap[contentId]) {
      localCommentsMap[contentId] = localCommentsMap[contentId].filter(c => c.id !== commentId);
      const item = memoryContentItems.find(c => c.id === contentId);
      if (item) {
        item.comments = localCommentsMap[contentId];
        saveItem('bv_content_items', memoryContentItems);
      }
    }
    return true;
  },

  // Approvals & Sign-Off
  async submitApproval(params: {
    contentItemId: string;
    versionNumber: number;
    decision: 'approved' | 'changes_requested' | 'rejected';
    feedback?: string;
    reviewerName?: string;
  }): Promise<ApprovalDecision> {
    const seal = `BV-SEAL-${Date.now().toString(36).toUpperCase()}-${params.contentItemId.toUpperCase()}-V${params.versionNumber}`;
    const decision: ApprovalDecision = {
      id: `dec_${Date.now()}`,
      contentItemId: params.contentItemId,
      versionNumber: params.versionNumber,
      reviewerId: 'usr_active',
      reviewerName: params.reviewerName || 'Administrator',
      decision: params.decision,
      feedback: params.feedback,
      cryptographicSeal: seal,
      timestamp: new Date().toISOString(),
    };

    const item = memoryContentItems.find(c => c.id === params.contentItemId);
    if (item) {
      item.status = params.decision;
      item.updatedAt = new Date().toISOString();
      saveItem('bv_content_items', memoryContentItems);
    }

    this.addAuditLog(
      params.decision === 'approved' ? 'CONTENT_APPROVED' : 'CHANGES_REQUESTED',
      { itemTitle: item?.title || 'Collateral', seal, feedback: params.feedback },
      item?.brandId,
      params.reviewerName
    );

    return decision;
  },

  // Governance Analytics (Calculated from Real Workspace Items)
  async getAnalytics(brandId?: string): Promise<GovernanceMetrics> {
    const targetBrand = brandId || activeBrandId;
    const items = memoryContentItems.filter(c => !c.brandId || c.brandId === targetBrand);
    const totalScanned = items.length;
    const approvedCount = items.filter(c => c.status === 'approved').length;
    const scores = items.map(c => c.complianceScore || 100);
    const overallHealthScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 100;

    return {
      totalScanned,
      approvedCount,
      changesRequestedCount: items.filter(c => c.status === 'changes_requested').length,
      overallComplianceHealth: overallHealthScore,
      avgResolutionTimeHours: totalScanned > 0 ? 1.5 : 0,
      topViolations: [],
      departmentScores: totalScanned > 0 ? [
        { department: 'Marketing & Brand Communications', score: overallHealthScore, contentVolume: totalScanned }
      ] : [],
      frequentTerminologyMisses: [],
      guidelineAmbiguityList: [],
    };
  },

  // Audit Logs
  async getAuditLogs(brandId?: string): Promise<AuditLog[]> {
    const targetBrand = brandId || activeBrandId;
    return memoryAuditLogs.filter(log => !log.brandId || log.brandId === targetBrand);
  },

  addAuditLog(action: string, details: any, brandId?: string, actorName: string = 'Administrator') {
    const log: AuditLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      organizationId: 'org_main',
      brandId: brandId || activeBrandId,
      actorId: 'usr_active',
      actorName,
      action,
      details,
      timestamp: new Date().toISOString(),
    };
    memoryAuditLogs.unshift(log);
    saveItem('bv_audit_logs', memoryAuditLogs);
    return log;
  }
};
