import type { Env } from '../types';
import type { 
  BrandWorkspace, 
  Guideline, 
  ApprovedFact, 
  TerminologyRule, 
  ApprovedClaim, 
  BrandAsset, 
  ContentItem, 
  ContentVersion, 
  ComplianceFinding, 
  AnalysisReport, 
  ReviewComment, 
  ApprovalDecision, 
  AuditLog, 
  GovernanceMetrics 
} from '@brandvault/shared';

// Initial in-memory state seeded from enterprise Nexus Brand
const defaultBrand: BrandWorkspace = {
  id: 'brand_nexus',
  organizationId: 'org_acme',
  name: 'Nexus Enterprise AI',
  description: 'Flagship enterprise cloud intelligence and brand automation suite.',
  primaryColor: '#4F46E5',
  secondaryColor: '#06B6D4',
  accentColor: '#10B981',
  logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
  toneKeywords: ['authoritative', 'transparent', 'empowering', 'precise', 'forward-looking'],
  restrictedTopics: ['unsubstantiated claims', 'competitor disparagement', 'cryptocurrency hype'],
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-02-15T00:00:00Z',
};

const defaultGuidelines: Guideline[] = [
  {
    id: 'gl_tone_01',
    brandId: 'brand_nexus',
    title: 'Brand Voice & Tone Standards',
    category: 'tone',
    description: 'Nexus communicates with authoritative clarity and professional empathy.',
    rules: [
      'Never use clickbait or fear-inducing messaging',
      'Maintain an approachable, technically credible voice',
      'Avoid excessive buzzwords (e.g., revolutionizing, magic)',
      'Write in active voice with clear value statements'
    ],
    version: 1,
    status: 'active',
    effectiveDate: '2026-01-01',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'gl_claims_01',
    brandId: 'brand_nexus',
    title: 'Promotional Claims Substantiation Policy',
    category: 'claims',
    description: 'Every performance or market ranking claim must cite documented benchmark evidence.',
    rules: [
      'Never claim #1 rank without third-party audit attribution',
      'Do not promise absolute 100% guarantees or unvalidated metrics',
      'All ROI claims must specify baseline methodology',
      'Comparative statements must reference verified public data'
    ],
    version: 1,
    status: 'active',
    effectiveDate: '2026-01-01',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'gl_visual_01',
    brandId: 'brand_nexus',
    title: 'Visual Identity & Palette Compliance',
    category: 'visual',
    description: 'Visual assets must adhere strictly to approved color codes, minimum padding, and typography.',
    rules: [
      'Primary brand color is #4F46E5 (Indigo) and secondary is #06B6D4 (Cyan)',
      'Minimum 24px clear space around primary logo',
      'Text contrast against background must achieve WCAG AA (4.5:1 ratio)',
      'Headers must use Plus Jakarta Sans; body must use Inter'
    ],
    version: 1,
    status: 'active',
    effectiveDate: '2026-01-01',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'gl_a11y_01',
    brandId: 'brand_nexus',
    title: 'Digital Accessibility & Inclusivity',
    category: 'accessibility',
    description: 'All public collateral must meet WCAG 2.1 AA standards.',
    rules: [
      'All images must include descriptive, non-redundant alt text',
      'Ensure text is readable on mobile viewports without horizontal scrolling',
      'Avoid flashing elements or low-contrast text overlays'
    ],
    version: 1,
    status: 'active',
    effectiveDate: '2026-01-01',
    updatedAt: '2026-01-01T00:00:00Z',
  }
];

const defaultFacts: ApprovedFact[] = [
  {
    id: 'fact_founding',
    brandId: 'brand_nexus',
    factKey: 'founding_year',
    statement: 'Nexus Enterprise AI was established in 2021 by enterprise infrastructure veterans.',
    category: 'corporate',
    verifiedSource: 'Articles of Incorporation 2021',
    verifiedDate: '2026-01-01',
  },
  {
    id: 'fact_regions',
    brandId: 'brand_nexus',
    factKey: 'global_presence',
    statement: 'Nexus infrastructure operates across 4 primary cloud regions: Mumbai, Singapore, Frankfurt, and San Jose.',
    category: 'product',
    verifiedSource: 'Global Datacenter Operations Report Q4 2025',
    verifiedDate: '2026-01-15',
  },
  {
    id: 'fact_security',
    brandId: 'brand_nexus',
    factKey: 'security_certifications',
    statement: 'Nexus Enterprise AI holds SOC 2 Type II certification and ISO/IEC 27001:2022 validation.',
    category: 'corporate',
    verifiedSource: 'BSI Audit Certificate #ISO-99214',
    verifiedDate: '2026-02-01',
  },
  {
    id: 'fact_customers',
    brandId: 'brand_nexus',
    factKey: 'customer_count',
    statement: 'Over 450 enterprise organizations rely on Nexus for automated workflow intelligence.',
    category: 'customer',
    verifiedSource: 'Customer Operations Directory Feb 2026',
    verifiedDate: '2026-02-10',
  }
];

const defaultTerminology: TerminologyRule[] = [
  {
    id: 'term_01',
    brandId: 'brand_nexus',
    prohibitedTerm: 'cheap',
    preferredTerm: 'cost-effective',
    reason: 'Devalues premium enterprise positioning; use cost-effective or accessible instead.',
    category: 'brand_voice',
    severity: 'warning',
  },
  {
    id: 'term_02',
    brandId: 'brand_nexus',
    prohibitedTerm: "India's No. 1",
    preferredTerm: 'A premier industry platform',
    reason: 'Unsubstantiated superlative that violates regulatory marketing guidelines without independent audit citation.',
    category: 'legal_risk',
    severity: 'critical',
  },
  {
    id: 'term_03',
    brandId: 'brand_nexus',
    prohibitedTerm: 'guarantees 100% uptime',
    preferredTerm: 'engineered for 99.99% high availability',
    reason: 'Absolute guarantee incurs legal warranty liability; cite standard SLA of 99.99%.',
    category: 'legal_risk',
    severity: 'critical',
  },
  {
    id: 'term_04',
    brandId: 'brand_nexus',
    prohibitedTerm: 'end-user',
    preferredTerm: 'customer or client',
    reason: 'Cold technical jargon; use customer, client, or team member for empathy.',
    category: 'brand_voice',
    severity: 'suggestion',
  },
  {
    id: 'term_05',
    brandId: 'brand_nexus',
    prohibitedTerm: 'revolutionary magic',
    preferredTerm: 'architectural breakthrough',
    reason: 'Hyperbolic puffery damages technical credibility with enterprise CTO buyers.',
    category: 'brand_voice',
    severity: 'warning',
  },
  {
    id: 'term_06',
    brandId: 'brand_nexus',
    prohibitedTerm: 'competitor X is obsolete',
    preferredTerm: 'modern cloud-native approach',
    reason: 'Disparaging competitor claims violate antitrust and advertising ethics.',
    category: 'competitor',
    severity: 'critical',
  }
];

const defaultClaims: ApprovedClaim[] = [
  {
    id: 'claim_01',
    brandId: 'brand_nexus',
    claimText: 'Accelerates content compliance review cycles by up to 65%',
    substantiationEvidence: 'Verified via Acme Enterprise Benchmark Study Q3 2025 across 12,000 document workflows.',
    authorizedChannels: ['All digital & print'],
    expiresAt: '2026-12-31',
    approvedBy: 'Alice Vance (Compliance Director)',
  },
  {
    id: 'claim_02',
    brandId: 'brand_nexus',
    claimText: 'Zero-data retention model protects proprietary organizational brand data',
    substantiationEvidence: 'Security whitepaper V4.2 and SOC 2 Type II privacy verification.',
    authorizedChannels: ['Product datasheets', 'Website'],
    expiresAt: '2027-01-01',
    approvedBy: 'Security Board',
  }
];

const defaultAssets: BrandAsset[] = [
  {
    id: 'asset_logo_primary',
    brandId: 'brand_nexus',
    name: 'Primary Brand Logo (Dark / Light)',
    type: 'logo',
    fileUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300',
    metadata: {
      minimumClearSpacePx: 24,
      fileSizeKb: 142,
      mimeType: 'image/svg+xml',
    },
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'asset_palette',
    brandId: 'brand_nexus',
    name: 'Core Brand Palette Specification',
    type: 'color_palette',
    fileUrl: '',
    metadata: {
      primaryHex: '#4F46E5',
      secondaryHex: '#06B6D4',
      fontFamily: 'Plus Jakarta Sans, Inter',
    },
    createdAt: '2026-01-01T00:00:00Z',
  }
];

const defaultContentItems: ContentItem[] = [
  {
    id: 'cnt_01',
    brandId: 'brand_nexus',
    authorId: 'usr_clara',
    authorName: 'Clara Oswald',
    title: 'Q1 Global Product Launch Press Release',
    contentType: 'press_release',
    targetAudience: 'Enterprise CIOs & Marketing Directors',
    targetChannel: 'PR Newswire & Blog',
    status: 'changes_requested',
    currentVersion: 1,
    rawContent: "Nexus Enterprise AI is thrilled to announce our revolutionary magic platform. As India's No. 1 enterprise platform, our cheap subscription model guarantees 100% uptime for all operations while competitor X is obsolete. Contact us today to witness the magic for every end-user.",
    complianceScore: 42,
    assignedReviewerId: 'usr_bob',
    assignedReviewerName: 'Bob Chen',
    createdAt: '2026-02-14T09:30:00Z',
    updatedAt: '2026-02-14T10:15:00Z',
  },
  {
    id: 'cnt_02',
    brandId: 'brand_nexus',
    authorId: 'usr_clara',
    authorName: 'Clara Oswald',
    title: 'LinkedIn Campaign: Modern Brand Governance',
    contentType: 'social_ad',
    targetAudience: 'Content Leads & Brand Strategists',
    targetChannel: 'LinkedIn & X (Twitter)',
    status: 'approved',
    currentVersion: 2,
    rawContent: 'In a multi-agent era, consistent brand voice is your strongest competitive moat. Nexus Enterprise AI accelerates content compliance review cycles by up to 65%, empowering creative teams to move fast while protecting brand integrity across every customer touchpoint.',
    complianceScore: 96,
    assignedReviewerId: 'usr_alice',
    assignedReviewerName: 'Alice Vance',
    createdAt: '2026-02-12T14:00:00Z',
    updatedAt: '2026-02-13T11:20:00Z',
  }
];

const defaultFindings: Record<string, ComplianceFinding[]> = {
  cnt_01: [
    {
      id: 'fnd_01',
      contentItemId: 'cnt_01',
      versionNumber: 1,
      agentType: 'claim',
      issue: 'Unsupported Superlative Claim',
      category: 'claims',
      severity: 'critical',
      contentExcerpt: "India's No. 1 enterprise platform",
      position: { start: 98, end: 130 },
      guidelineReference: 'Promotional Claims Substantiation Policy, Section 1',
      evidence: 'No independent third-party market ranking audit cited. Brand policy strictly prohibits unverified #1 claims.',
      confidence: 0.98,
      suggestedCorrection: 'a leading enterprise platform',
      status: 'open',
      requiresHumanReview: true,
    },
    {
      id: 'fnd_02',
      contentItemId: 'cnt_01',
      versionNumber: 1,
      agentType: 'fact',
      issue: 'Unwarranted SLA Guarantee',
      category: 'legal',
      severity: 'critical',
      contentExcerpt: 'guarantees 100% uptime',
      position: { start: 161, end: 183 },
      guidelineReference: 'Corporate SLA & Liability Policy, Section 3.2',
      evidence: 'Nexus SLA commitment is engineered for 99.99% high availability. Absolute 100% uptime promise creates direct legal breach risk.',
      confidence: 0.99,
      suggestedCorrection: 'engineered for 99.99% high availability',
      status: 'open',
      requiresHumanReview: true,
    },
    {
      id: 'fnd_03',
      contentItemId: 'cnt_01',
      versionNumber: 1,
      agentType: 'terminology',
      issue: 'Disparaging Competitor Reference',
      category: 'legal_risk',
      severity: 'critical',
      contentExcerpt: 'competitor X is obsolete',
      position: { start: 209, end: 233 },
      guidelineReference: 'Terminology Standards: Fair Advertising Guidelines',
      evidence: 'Direct disparagement of named competitors is prohibited by brand legal guidelines.',
      confidence: 0.95,
      suggestedCorrection: 'traditional legacy architectures face challenges',
      status: 'open',
      requiresHumanReview: true,
    },
    {
      id: 'fnd_04',
      contentItemId: 'cnt_01',
      versionNumber: 1,
      agentType: 'tone',
      issue: 'Devaluing Brand Positioning Term',
      category: 'brand_voice',
      severity: 'warning',
      contentExcerpt: 'cheap subscription model',
      position: { start: 136, end: 160 },
      guidelineReference: 'Brand Voice Standards: Value Terminology',
      evidence: 'The word "cheap" devalues enterprise premium positioning. Preferred term is "cost-effective" or "accessible".',
      confidence: 0.92,
      suggestedCorrection: 'cost-effective enterprise tier',
      status: 'open',
      requiresHumanReview: false,
    },
    {
      id: 'fnd_05',
      contentItemId: 'cnt_01',
      versionNumber: 1,
      agentType: 'tone',
      issue: 'Hyperbolic Buzzword',
      category: 'brand_voice',
      severity: 'warning',
      contentExcerpt: 'revolutionary magic',
      position: { start: 52, end: 71 },
      guidelineReference: 'Brand Voice Standards: Style Guide',
      evidence: 'Exaggerated buzzwords undermine technical authority with enterprise buyers.',
      confidence: 0.89,
      suggestedCorrection: 'architectural breakthrough',
      status: 'open',
      requiresHumanReview: false,
    }
  ]
};

const defaultComments: Record<string, ReviewComment[]> = {
  cnt_01: [
    {
      id: 'cm_01',
      contentItemId: 'cnt_01',
      findingId: 'fnd_01',
      authorId: 'usr_bob',
      authorName: 'Bob Chen',
      authorRole: 'manager',
      text: 'Clara, we cannot claim #1 in India without an audited analyst report. Please adopt the suggested correction before we submit to Alice.',
      resolved: false,
      createdAt: '2026-02-14T10:05:00Z',
    }
  ]
};

const defaultAuditLogs: AuditLog[] = [
  {
    id: 'log_01',
    organizationId: 'org_acme',
    brandId: 'brand_nexus',
    actorId: 'usr_alice',
    actorName: 'Alice Vance',
    action: 'POLICY_UPDATE',
    details: { guidelineId: 'gl_claims_01', title: 'Promotional Claims Substantiation Policy' },
    timestamp: '2026-02-10T08:00:00Z',
  },
  {
    id: 'log_02',
    organizationId: 'org_acme',
    brandId: 'brand_nexus',
    actorId: 'usr_clara',
    actorName: 'Clara Oswald',
    action: 'CONTENT_SUBMITTED',
    details: { contentId: 'cnt_01', title: 'Q1 Global Product Launch Press Release' },
    timestamp: '2026-02-14T09:30:00Z',
  },
  {
    id: 'log_03',
    organizationId: 'org_acme',
    brandId: 'brand_nexus',
    actorId: 'system_ai',
    actorName: 'BrandVault AI Engine (Groq)',
    action: 'COMPLIANCE_SCAN_COMPLETED',
    details: { contentId: 'cnt_01', score: 42, findingsCount: 5, model: 'openai/gpt-oss-120b' },
    timestamp: '2026-02-14T09:31:00Z',
  },
  {
    id: 'log_04',
    organizationId: 'org_acme',
    brandId: 'brand_nexus',
    actorId: 'usr_bob',
    actorName: 'Bob Chen',
    action: 'CHANGES_REQUESTED',
    details: { contentId: 'cnt_01', commentsCount: 1 },
    timestamp: '2026-02-14T10:15:00Z',
  }
];

export class BrandVaultStore {
  private brand: BrandWorkspace = defaultBrand;
  private guidelines: Guideline[] = [...defaultGuidelines];
  private facts: ApprovedFact[] = [...defaultFacts];
  private terminology: TerminologyRule[] = [...defaultTerminology];
  private claims: ApprovedClaim[] = [...defaultClaims];
  private assets: BrandAsset[] = [...defaultAssets];
  private contentItems: ContentItem[] = [...defaultContentItems];
  private findings: Record<string, ComplianceFinding[]> = { ...defaultFindings };
  private comments: Record<string, ReviewComment[]> = { ...defaultComments };
  private approvals: ApprovalDecision[] = [];
  private auditLogs: AuditLog[] = [...defaultAuditLogs];

  getBrand() { return this.brand; }
  updateBrand(updates: Partial<BrandWorkspace>) {
    this.brand = { ...this.brand, ...updates, updatedAt: new Date().toISOString() };
    return this.brand;
  }

  getGuidelines() { return this.guidelines; }
  addGuideline(g: Omit<Guideline, 'id' | 'version' | 'status' | 'updatedAt'>) {
    const newG: Guideline = {
      ...g,
      id: `gl_${Date.now()}`,
      version: 1,
      status: 'active',
      updatedAt: new Date().toISOString(),
    };
    this.guidelines.unshift(newG);
    return newG;
  }

  getFacts() { return this.facts; }
  addFact(f: Omit<ApprovedFact, 'id'>) {
    const newF: ApprovedFact = { ...f, id: `fact_${Date.now()}` };
    this.facts.unshift(newF);
    return newF;
  }

  getTerminology() { return this.terminology; }
  addTerminology(t: Omit<TerminologyRule, 'id'>) {
    const newT: TerminologyRule = { ...t, id: `term_${Date.now()}` };
    this.terminology.unshift(newT);
    return newT;
  }

  getClaims() { return this.claims; }
  addClaim(c: Omit<ApprovedClaim, 'id'>) {
    const newC: ApprovedClaim = { ...c, id: `claim_${Date.now()}` };
    this.claims.unshift(newC);
    return newC;
  }

  getAssets() { return this.assets; }
  addAsset(a: Omit<BrandAsset, 'id' | 'createdAt'>) {
    const newA: BrandAsset = { ...a, id: `asset_${Date.now()}`, createdAt: new Date().toISOString() };
    this.assets.unshift(newA);
    return newA;
  }

  getContentItems() { return this.contentItems; }
  getContentItem(id: string) { return this.contentItems.find(c => c.id === id); }
  
  createContentItem(data: {
    brandId: string;
    authorId: string;
    authorName: string;
    title: string;
    contentType: ContentItem['contentType'];
    rawContent: string;
    mediaUrl?: string;
    targetAudience?: string;
    targetChannel?: string;
  }) {
    const newItem: ContentItem = {
      id: `cnt_${Date.now()}`,
      brandId: data.brandId,
      authorId: data.authorId,
      authorName: data.authorName,
      title: data.title,
      contentType: data.contentType,
      rawContent: data.rawContent,
      mediaUrl: data.mediaUrl,
      targetAudience: data.targetAudience,
      targetChannel: data.targetChannel,
      status: 'draft',
      currentVersion: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.contentItems.unshift(newItem);
    this.logAction('usr_clara', 'Clara Oswald', 'CONTENT_CREATED', { contentId: newItem.id, title: newItem.title });
    return newItem;
  }

  updateContent(id: string, updates: Partial<ContentItem>) {
    const idx = this.contentItems.findIndex(c => c.id === id);
    if (idx === -1) return null;
    this.contentItems[idx] = { ...this.contentItems[idx], ...updates, updatedAt: new Date().toISOString() };
    return this.contentItems[idx];
  }

  getFindings(contentId: string) {
    return this.findings[contentId] || [];
  }

  setFindings(contentId: string, items: ComplianceFinding[]) {
    this.findings[contentId] = items;
  }

  updateFindingStatus(findingId: string, status: ComplianceFinding['status'], note?: string) {
    for (const cid of Object.keys(this.findings)) {
      const f = this.findings[cid].find(item => item.id === findingId);
      if (f) {
        f.status = status;
        if (note) f.humanResolutionNote = note;
        return f;
      }
    }
    return null;
  }

  getComments(contentId: string) {
    return this.comments[contentId] || [];
  }

  addComment(contentId: string, comment: Omit<ReviewComment, 'id' | 'createdAt'>) {
    const newComment: ReviewComment = {
      ...comment,
      id: `cm_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    if (!this.comments[contentId]) this.comments[contentId] = [];
    this.comments[contentId].push(newComment);
    return newComment;
  }

  recordApproval(decision: ApprovalDecision) {
    this.approvals.push(decision);
    const content = this.getContentItem(decision.contentItemId);
    if (content) {
      content.status = decision.decision === 'approved' ? 'approved' : 
                       decision.decision === 'changes_requested' ? 'changes_requested' : 'rejected';
      content.updatedAt = new Date().toISOString();
    }
    this.logAction(decision.reviewerId, decision.reviewerName, `REVIEW_${decision.decision.toUpperCase()}`, {
      contentItemId: decision.contentItemId,
      seal: decision.cryptographicSeal,
      feedback: decision.feedback
    });
    return decision;
  }

  getAuditLogs() {
    return this.auditLogs;
  }

  logAction(actorId: string, actorName: string, action: string, details: Record<string, any>) {
    const log: AuditLog = {
      id: `log_${Date.now()}`,
      organizationId: 'org_acme',
      brandId: 'brand_nexus',
      actorId,
      actorName,
      action,
      details,
      timestamp: new Date().toISOString(),
    };
    this.auditLogs.unshift(log);
    return log;
  }

  getGovernanceMetrics(): GovernanceMetrics {
    const totalScanned = this.contentItems.length;
    const approvedCount = this.contentItems.filter(c => c.status === 'approved').length;
    const changesRequestedCount = this.contentItems.filter(c => c.status === 'changes_requested').length;
    
    return {
      overallComplianceHealth: 88,
      totalScanned,
      approvedCount,
      changesRequestedCount,
      avgResolutionTimeHours: 1.8,
      topViolations: [
        { category: 'Unsubstantiated Claims', count: 18, guideline: 'Promotional Claims Substantiation Policy' },
        { category: 'Banned Terminology', count: 14, guideline: 'Brand Terminology Dictionary' },
        { category: 'SLA Overstatement', count: 9, guideline: 'Corporate SLA & Liability Policy' },
        { category: 'Visual / Color Deviation', count: 6, guideline: 'Visual Identity Standards' },
        { category: 'Accessibility / Alt-Text', count: 4, guideline: 'WCAG 2.1 AA Inclusivity' },
      ],
      frequentTerminologyMisses: [
        { prohibited: "India's No. 1", preferred: 'A premier industry platform', count: 7 },
        { prohibited: 'cheap', preferred: 'cost-effective', count: 6 },
        { prohibited: 'guarantees 100% uptime', preferred: 'engineered for 99.99% high availability', count: 5 },
        { prohibited: 'end-user', preferred: 'customer', count: 4 },
      ],
      guidelineAmbiguityList: [
        {
          guidelineTitle: 'Promotional Claims: Superlative Thresholds',
          disputeRate: 28,
          feedback: 'Creators frequently contest whether "industry-leading" requires specific third-party market share audits.',
        },
        {
          guidelineTitle: 'Brand Voice: Technical Depth vs Simplicity',
          disputeRate: 19,
          feedback: 'Engineering authors report tone agent flags architectural terms as overly complex jargon.',
        }
      ],
      departmentScores: [
        { department: 'Product Marketing', score: 92, contentVolume: 42 },
        { department: 'Demand Gen & Ads', score: 81, contentVolume: 68 },
        { department: 'Corporate PR', score: 95, contentVolume: 24 },
        { department: 'Sales Enablement', score: 84, contentVolume: 35 },
      ]
    };
  }
}

export const globalStore = new BrandVaultStore();
