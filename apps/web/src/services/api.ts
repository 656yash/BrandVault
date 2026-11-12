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
  ReviewComment, 
  ApprovalDecision, 
  AuditLog, 
  GovernanceMetrics 
} from '@brandvault/shared';

const API_BASE = '/api/v1';

// Seed Fallback data in case backend Worker is in isolated standalone test
const mockBrand: BrandWorkspace = {
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

export const api = {
  async getBrand(): Promise<BrandWorkspace> {
    try {
      const res = await fetch(`${API_BASE}/brands`);
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      return data.data?.[0] || mockBrand;
    } catch {
      return mockBrand;
    }
  },

  async getGuidelines(): Promise<Guideline[]> {
    try {
      const res = await fetch(`${API_BASE}/guidelines`);
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      return data.data || [];
    } catch {
      return [
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
            'All ROI claims must specify baseline methodology'
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
          description: 'Visual assets must adhere strictly to approved color codes and minimum clear space.',
          rules: [
            'Primary brand color is #4F46E5 (Indigo) and secondary is #06B6D4 (Cyan)',
            'Minimum 24px clear space around primary logo',
            'Text contrast against background must achieve WCAG AA (4.5:1 ratio)'
          ],
          version: 1,
          status: 'active',
          effectiveDate: '2026-01-01',
          updatedAt: '2026-01-01T00:00:00Z',
        }
      ];
    }
  },

  async addGuideline(g: any): Promise<Guideline> {
    const res = await fetch(`${API_BASE}/guidelines`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(g),
    });
    const data = await res.json();
    return data.data;
  },

  async getFacts(): Promise<ApprovedFact[]> {
    try {
      const res = await fetch(`${API_BASE}/facts`);
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      return data.data || [];
    } catch {
      return [
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
        }
      ];
    }
  },

  async addFact(f: any): Promise<ApprovedFact> {
    const res = await fetch(`${API_BASE}/facts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(f),
    });
    const data = await res.json();
    return data.data;
  },

  async getTerminology(): Promise<TerminologyRule[]> {
    try {
      const res = await fetch(`${API_BASE}/terminology`);
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      return data.data || [];
    } catch {
      return [
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
        }
      ];
    }
  },

  async addTerminology(t: any): Promise<TerminologyRule> {
    const res = await fetch(`${API_BASE}/terminology`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(t),
    });
    const data = await res.json();
    return data.data;
  },

  async getClaims(): Promise<ApprovedClaim[]> {
    try {
      const res = await fetch(`${API_BASE}/claims`);
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      return data.data || [];
    } catch {
      return [
        {
          id: 'claim_01',
          brandId: 'brand_nexus',
          claimText: 'Accelerates content compliance review cycles by up to 65%',
          substantiationEvidence: 'Verified via Acme Enterprise Benchmark Study Q3 2025 across 12,000 document workflows.',
          authorizedChannels: ['All digital & print'],
          expiresAt: '2026-12-31',
          approvedBy: 'Alice Vance (Compliance Director)',
        }
      ];
    }
  },

  async getAssets(): Promise<BrandAsset[]> {
    try {
      const res = await fetch(`${API_BASE}/assets`);
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      return data.data || [];
    } catch {
      return [
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
        }
      ];
    }
  },

  async getContentItems(): Promise<ContentItem[]> {
    try {
      const res = await fetch(`${API_BASE}/content`);
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      return data.data || [];
    } catch {
      return [
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
    }
  },

  async getContentItem(id: string): Promise<any> {
    const res = await fetch(`${API_BASE}/content/${id}`);
    const data = await res.json();
    return data.data;
  },

  async createContentItem(params: any): Promise<ContentItem> {
    const res = await fetch(`${API_BASE}/content`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const data = await res.json();
    return data.data;
  },

  async updateContent(id: string, updates: Partial<ContentItem>): Promise<ContentItem> {
    const res = await fetch(`${API_BASE}/content/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    return data.data;
  },

  async scanContent(params: {
    contentItemId: string;
    versionNumber?: number;
    contentOverride?: string;
    mediaUrl?: string;
  }): Promise<AnalysisReport> {
    const res = await fetch(`${API_BASE}/content/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      throw new Error('Failed to run BrandVault AI inspection');
    }
    const data = await res.json();
    return data.data;
  },

  async resolveFinding(findingId: string, decision: 'accepted' | 'rejected' | 'resolved', note?: string): Promise<any> {
    const res = await fetch(`${API_BASE}/findings/${findingId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ findingId, decision, resolutionNote: note }),
    });
    const data = await res.json();
    return data.data;
  },

  async getComments(contentId: string): Promise<ReviewComment[]> {
    try {
      const res = await fetch(`${API_BASE}/content/${contentId}/comments`);
      const data = await res.json();
      return data.data || [];
    } catch {
      return [];
    }
  },

  async addComment(contentId: string, comment: any): Promise<ReviewComment> {
    const res = await fetch(`${API_BASE}/content/${contentId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(comment),
    });
    const data = await res.json();
    return data.data;
  },

  async submitApproval(params: {
    contentItemId: string;
    versionNumber: number;
    decision: 'approved' | 'changes_requested' | 'rejected';
    feedback?: string;
  }): Promise<ApprovalDecision> {
    const res = await fetch(`${API_BASE}/reviews/decision`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const data = await res.json();
    return data.data;
  },

  async getAnalytics(): Promise<GovernanceMetrics> {
    try {
      const res = await fetch(`${API_BASE}/analytics/overview`);
      const data = await res.json();
      return data.data;
    } catch {
      return {
        overallComplianceHealth: 88,
        totalScanned: 148,
        approvedCount: 114,
        changesRequestedCount: 34,
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
  },

  async getAuditLogs(): Promise<AuditLog[]> {
    try {
      const res = await fetch(`${API_BASE}/audit-logs`);
      const data = await res.json();
      return data.data || [];
    } catch {
      return [];
    }
  },

  async getAIDisclosure(): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/ai-disclosure`);
      const data = await res.json();
      return data.data;
    } catch {
      return {
        platform: 'BrandVault AI',
        primaryModel: 'Groq openai/gpt-oss-120b',
        fallbackModel: 'Groq qwen/qwen3.8-27b',
        architecture: 'Zero-Retention Inference Pipeline',
        securityCommitments: [
          'Confidential brand assets and marketing materials are processed in-memory and never used for model training.',
          'Human reviewers maintain exclusive authority to approve or reject content.',
          'Deterministic brand safety rules run alongside neural model evaluations for verifiable grounding.'
        ],
        cloudProvider: 'Cloudflare Workers & D1 (Edge Infrastructure)',
      };
    }
  }
};
