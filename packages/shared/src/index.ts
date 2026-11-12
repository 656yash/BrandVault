import { z } from 'zod';

export type UserRole = 'admin' | 'compliance_officer' | 'manager' | 'creator';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  organizationId: string;
  createdAt: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: 'starter' | 'enterprise';
  createdAt: string;
}

export interface BrandWorkspace {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logoUrl?: string;
  toneKeywords: string[];
  restrictedTopics: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Guideline {
  id: string;
  brandId: string;
  title: string;
  category: 'tone' | 'terminology' | 'claims' | 'visual' | 'accessibility' | 'legal';
  description: string;
  rules: string[];
  version: number;
  status: 'active' | 'archived';
  effectiveDate: string;
  updatedAt: string;
}

export interface ApprovedFact {
  id: string;
  brandId: string;
  factKey: string;
  statement: string;
  category: 'corporate' | 'financial' | 'product' | 'customer' | 'milestone';
  verifiedSource: string;
  verifiedDate: string;
  expirationDate?: string;
}

export interface TerminologyRule {
  id: string;
  brandId: string;
  prohibitedTerm: string;
  preferredTerm: string;
  reason: string;
  category: 'brand_voice' | 'legal_risk' | 'inclusion' | 'competitor';
  severity: 'critical' | 'warning' | 'suggestion';
}

export interface ApprovedClaim {
  id: string;
  brandId: string;
  claimText: string;
  substantiationEvidence: string;
  authorizedChannels: string[];
  expiresAt: string;
  approvedBy: string;
}

export interface BrandAsset {
  id: string;
  brandId: string;
  name: string;
  type: 'logo' | 'color_palette' | 'font' | 'template' | 'guideline_document';
  fileUrl: string;
  metadata?: {
    primaryHex?: string;
    secondaryHex?: string;
    fontFamily?: string;
    minimumClearSpacePx?: number;
    fileSizeKb?: number;
    mimeType?: string;
  };
  createdAt: string;
}

export type ContentStatus = 
  | 'draft' 
  | 'scanning' 
  | 'changes_requested' 
  | 'ready_for_review' 
  | 'approved' 
  | 'rejected';

export interface ContentItem {
  id: string;
  brandId: string;
  authorId: string;
  authorName: string;
  title: string;
  contentType: 'text' | 'marketing_copy' | 'social_ad' | 'press_release' | 'creative_image' | 'newsletter';
  targetAudience?: string;
  targetChannel?: string;
  status: ContentStatus;
  currentVersion: number;
  rawContent: string;
  mediaUrl?: string;
  complianceScore?: number;
  assignedReviewerId?: string;
  assignedReviewerName?: string;
  findings?: ComplianceFinding[];
  comments?: ReviewComment[];
  createdAt: string;
  updatedAt: string;
}

export interface ContentVersion {
  id: string;
  contentItemId: string;
  versionNumber: number;
  rawContent: string;
  mediaUrl?: string;
  changeNotes?: string;
  authorId: string;
  complianceScore?: number;
  createdAt: string;
}

export type AgentType = 
  | 'tone' 
  | 'terminology' 
  | 'fact' 
  | 'claim' 
  | 'visual' 
  | 'accessibility' 
  | 'governance';

export type FindingSeverity = 'critical' | 'warning' | 'suggestion';

export interface ComplianceFinding {
  id: string;
  contentItemId: string;
  versionNumber: number;
  agentType: AgentType;
  issue: string;
  category: string;
  severity: FindingSeverity;
  contentExcerpt: string;
  position?: { start: number; end: number };
  guidelineReference: string;
  guidelineId?: string;
  evidence: string;
  confidence: number; // 0.0 to 1.0
  suggestedCorrection: string;
  status: 'open' | 'accepted' | 'rejected' | 'resolved';
  humanResolutionNote?: string;
  requiresHumanReview: boolean;
}

export interface AnalysisReport {
  id: string;
  contentItemId: string;
  versionNumber: number;
  overallScore: number; // 0 to 100
  toneScore: number;
  terminologyScore: number;
  factualAccuracyScore: number;
  claimsLegalityScore: number;
  visualA11yScore: number;
  summary: string;
  findings: ComplianceFinding[];
  aiModelUsed: string;
  executionDurationMs: number;
  aiDisclosure: {
    provider: 'BrandVault AI via Groq' | 'BrandVault Local Engine';
    model: string;
    zeroRetentionCompliant: boolean;
    dataLogged: boolean;
  };
  createdAt: string;
}

export interface ReviewComment {
  id: string;
  contentItemId: string;
  findingId?: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  text: string;
  resolved: boolean;
  createdAt: string;
}

export interface ApprovalDecision {
  id: string;
  contentItemId: string;
  versionNumber: number;
  reviewerId: string;
  reviewerName: string;
  decision: 'approved' | 'changes_requested' | 'rejected';
  feedback?: string;
  cryptographicSeal: string;
  timestamp: string;
}

export interface AuditLog {
  id: string;
  organizationId: string;
  brandId: string;
  actorId: string;
  actorName: string;
  action: string;
  details: Record<string, any>;
  timestamp: string;
}

export interface GovernanceMetrics {
  overallComplianceHealth: number;
  totalScanned: number;
  approvedCount: number;
  changesRequestedCount: number;
  avgResolutionTimeHours: number;
  topViolations: Array<{ category: string; count: number; guideline: string }>;
  frequentTerminologyMisses: Array<{ prohibited: string; preferred: string; count: number }>;
  guidelineAmbiguityList: Array<{ guidelineTitle: string; disputeRate: number; feedback: string }>;
  departmentScores: Array<{ department: string; score: number; contentVolume: number }>;
}

// Zod Schemas for API Validation
export const createContentSchema = z.object({
  brandId: z.string().min(1),
  title: z.string().min(1).max(200),
  contentType: z.enum(['text', 'marketing_copy', 'social_ad', 'press_release', 'creative_image', 'newsletter']),
  rawContent: z.string(),
  mediaUrl: z.string().optional(),
  targetAudience: z.string().optional(),
  targetChannel: z.string().optional(),
});

export const scanContentSchema = z.object({
  contentItemId: z.string().min(1),
  versionNumber: z.number().optional(),
  contentOverride: z.string().optional(),
  mediaUrl: z.string().optional(),
});

export const resolveFindingSchema = z.object({
  findingId: z.string().min(1),
  decision: z.enum(['accepted', 'rejected', 'resolved']),
  resolutionNote: z.string().optional(),
});

export const approvalDecisionSchema = z.object({
  contentItemId: z.string().min(1),
  versionNumber: z.number(),
  decision: z.enum(['approved', 'changes_requested', 'rejected']),
  feedback: z.string().optional(),
});
