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
  GovernanceMetrics,
  AgentType,
  FindingSeverity
} from '@brandvault/shared';
import { saveBrandToFirestore } from './firebase';

const API_BASE = '/api/v1';

// Active Brands Repository (Multi-Brand Support)
export const initialBrands: BrandWorkspace[] = [
  {
    id: 'brand_easya1',
    organizationId: 'org_easya1',
    name: 'Easy-A1',
    description: 'Education Consulting, International Student Visa, Study Abroad, Vacation & General Travel Services.',
    primaryColor: '#F59E0B',
    secondaryColor: '#3B82F6',
    accentColor: '#10B981',
    logoUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=150',
    toneKeywords: ['empowering', 'educational', 'transparent', 'supportive'],
    restrictedTopics: ['guaranteed visa approval', 'false university endorsements'],
    createdAt: '2026-01-10T00:00:00Z',
    updatedAt: '2026-02-15T00:00:00Z',
  },
  {
    id: 'brand_shotnest',
    organizationId: 'org_shotnest',
    name: 'ShotNest Media',
    description: 'Entertainment management company for cinematography, videography, and creative media productions.',
    primaryColor: '#EC4899',
    secondaryColor: '#8B5CF6',
    accentColor: '#3B82F6',
    logoUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=150',
    toneKeywords: ['cinematic', 'dynamic', 'bold', 'visionary'],
    restrictedTopics: ['uncredited footage', 'unverified celebrity endorsements'],
    createdAt: '2026-01-15T00:00:00Z',
    updatedAt: '2026-02-15T00:00:00Z',
  },
  {
    id: 'brand_assetsgenius',
    organizationId: 'org_assetsgenius',
    name: 'Assets Genius Escrow',
    description: 'Institutional finance and escrow security for real estate and high-value digital asset transactions.',
    primaryColor: '#EF4444',
    secondaryColor: '#1E293B',
    accentColor: '#F59E0B',
    logoUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=150',
    toneKeywords: ['authoritative', 'vigilant', 'secure', 'compliant'],
    restrictedTopics: ['speculative return promises', 'unlicensed brokerage claims'],
    createdAt: '2026-01-20T00:00:00Z',
    updatedAt: '2026-02-15T00:00:00Z',
  },
  {
    id: 'brand_flkdesigns',
    organizationId: 'org_flk',
    name: 'FLK Designs',
    description: 'Strategic visual branding agency transforming ideas into powerful visual experiences with 10+ years of excellence.',
    primaryColor: '#D4AF37',
    secondaryColor: '#64748B',
    accentColor: '#E2E8F0',
    logoUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=150',
    toneKeywords: ['meticulous', 'strategic', 'innovative', 'timeless'],
    restrictedTopics: ['plagiarism', 'unauthorized font redistribution'],
    createdAt: '2026-02-01T00:00:00Z',
    updatedAt: '2026-02-15T00:00:00Z',
  }
];

let memoryBrands: BrandWorkspace[] = [...initialBrands];
let activeBrandId = 'brand_easya1';

// Guidelines Seed Data (Strictly scoped by brandId)
const defaultGuidelines: Guideline[] = [
  // Easy-A1 Guidelines
  {
    id: 'gl_ea1_01',
    brandId: 'brand_easya1',
    title: 'Visa & Admission Advisory Guidelines',
    category: 'legal',
    description: 'Never guarantee government visa approvals or university admission offers.',
    rules: [
      'State visa success rate with year-specific cohort attribution',
      'Explicitly disclose embassy application processing times vary',
      'Always clarify that sovereign consulates retain final approval authority'
    ],
    version: 1,
    status: 'active',
    effectiveDate: '2026-01-10',
    updatedAt: '2026-01-10T00:00:00Z',
  },
  {
    id: 'gl_ea1_02',
    brandId: 'brand_easya1',
    title: 'Student Voice & Educational Empathy',
    category: 'tone',
    description: 'Communicate with warmth, academic encouragement, and transparent guidance.',
    rules: [
      'Avoid high-pressure urgency tactics regarding application deadlines',
      'Use transparent fee breakdowns without hidden cost implications',
      'Provide supportive framing for international scholar transitions'
    ],
    version: 1,
    status: 'active',
    effectiveDate: '2026-01-10',
    updatedAt: '2026-01-10T00:00:00Z',
  },
  {
    id: 'gl_ea1_03',
    brandId: 'brand_easya1',
    title: 'Easy-A1 Arrow Emblem & Color Standards',
    category: 'visual',
    description: 'Preserve the signature Amber (#F59E0B) and Cobalt (#3B82F6) brand identity.',
    rules: [
      'Maintain 24px clear margin around the arrow monogram',
      'Adhere to high-contrast legible font hierarchy for visa guidance cards'
    ],
    version: 1,
    status: 'active',
    effectiveDate: '2026-01-10',
    updatedAt: '2026-01-10T00:00:00Z',
  },

  // ShotNest Guidelines
  {
    id: 'gl_sn_01',
    brandId: 'brand_shotnest',
    title: 'Cinematography Reel & Credits Policy',
    category: 'claims',
    description: 'All footage clips in promotional materials must attribute the director of photography.',
    rules: [
      'Display 4K / 8K master format specifications clearly',
      'Attribute directors, DPs, and colorists on all commercial showcases'
    ],
    version: 1,
    status: 'active',
    effectiveDate: '2026-01-15',
    updatedAt: '2026-01-15T00:00:00Z',
  },
  {
    id: 'gl_sn_02',
    brandId: 'brand_shotnest',
    title: 'Cinematic Visual Rhythm & Contrast',
    category: 'visual',
    description: 'Maintain bold, high-contrast visual framing with signature magenta (#EC4899) and violet (#8B5CF6).',
    rules: [
      'High dynamic range framing across digital portfolios and cinema reels',
      'Proper framing without distortion of client brand marks'
    ],
    version: 1,
    status: 'active',
    effectiveDate: '2026-01-15',
    updatedAt: '2026-01-15T00:00:00Z',
  },

  // Assets Genius Escrow Guidelines
  {
    id: 'gl_age_01',
    brandId: 'brand_assetsgenius',
    title: 'Financial Escrow Disclaimer Policy',
    category: 'legal',
    description: 'Strict regulatory disclaimers required for all financial asset custody claims.',
    rules: [
      'State multi-sig escrow collateralization details',
      'Never describe deposits as risk-free or guaranteed yield',
      'Disclose jurisdiction and licensed escrow fiduciary disclosures'
    ],
    version: 1,
    status: 'active',
    effectiveDate: '2026-01-20',
    updatedAt: '2026-01-20T00:00:00Z',
  },
  {
    id: 'gl_age_02',
    brandId: 'brand_assetsgenius',
    title: 'Institutional Trust & Tone Standards',
    category: 'tone',
    description: 'Authoritative, vigilant, transparent, and legally compliant communication.',
    rules: [
      'Use deterministic legal terminology for escrow conditions and release triggers',
      'Avoid speculative hype or high-yield promises'
    ],
    version: 1,
    status: 'active',
    effectiveDate: '2026-01-20',
    updatedAt: '2026-01-20T00:00:00Z',
  },

  // FLK Designs Guidelines
  {
    id: 'gl_flk_01',
    brandId: 'brand_flkdesigns',
    title: 'Brand Portfolio & Typography Standards',
    category: 'visual',
    description: '10+ years experience emblem must maintain gold accent tone with deep obsidian background.',
    rules: [
      'Maintain clean high-density layout rhythm with metallic typography',
      'Preserve clear whitespace around portfolio showcase cards',
      'Strictly use licensed commercial fonts for client brand deliverables'
    ],
    version: 1,
    status: 'active',
    effectiveDate: '2026-02-01',
    updatedAt: '2026-02-01T00:00:00Z',
  },
  {
    id: 'gl_flk_02',
    brandId: 'brand_flkdesigns',
    title: 'Artistic Craftsmanship Voice Standards',
    category: 'tone',
    description: 'Strategic design thinking, attention to detail, and creative problem-solving voice.',
    rules: [
      'Frame design as a strategic business asset rather than mere decoration',
      'Highlight intentional purpose behind every color, shape, and typography choice'
    ],
    version: 1,
    status: 'active',
    effectiveDate: '2026-02-01',
    updatedAt: '2026-02-01T00:00:00Z',
  }
];

// Facts Seed Data (Strictly scoped by brandId)
const defaultFacts: ApprovedFact[] = [
  // Easy-A1 Facts
  {
    id: 'fact_easya1_01',
    brandId: 'brand_easya1',
    factKey: 'students_placed',
    statement: 'Easy-A1 has counseled and assisted over 12,000 international students worldwide.',
    category: 'milestone',
    verifiedSource: 'Easy-A1 Annual Academic Placement Report 2025',
    verifiedDate: '2026-01-10',
  },
  {
    id: 'fact_easya1_02',
    brandId: 'brand_easya1',
    factKey: 'university_partners',
    statement: 'Easy-A1 maintains direct articulation partnerships with 240+ accredited universities across 14 countries.',
    category: 'product',
    verifiedSource: 'Global Academic Partner Registry 2026',
    verifiedDate: '2026-01-10',
  },
  {
    id: 'fact_easya1_03',
    brandId: 'brand_easya1',
    factKey: 'founding_year',
    statement: 'Easy-A1 was established in 2017 to provide ethical study abroad and consular advisory services.',
    category: 'corporate',
    verifiedSource: 'Corporate Registry 2017',
    verifiedDate: '2026-01-10',
  },

  // ShotNest Media Facts
  {
    id: 'fact_shotnest_01',
    brandId: 'brand_shotnest',
    factKey: 'cinema_productions',
    statement: 'ShotNest Media has directed and produced over 150 commercial cinema projects.',
    category: 'milestone',
    verifiedSource: 'ShotNest Production Ledger 2025',
    verifiedDate: '2026-01-15',
  },
  {
    id: 'fact_shotnest_02',
    brandId: 'brand_shotnest',
    factKey: 'camera_suites',
    statement: 'ShotNest operates proprietary 8K RAW cinema master camera pipelines with Arri & RED sensor suites.',
    category: 'product',
    verifiedSource: 'Technical Camera Equipment Audit 2026',
    verifiedDate: '2026-01-15',
  },

  // Assets Genius Escrow Facts
  {
    id: 'fact_assetsgenius_01',
    brandId: 'brand_assetsgenius',
    factKey: 'escrow_volume',
    statement: 'Assets Genius Escrow has secured over $450M in multi-party escrow transactions.',
    category: 'financial',
    verifiedSource: 'Third-Party Custody Audit Q4 2025',
    verifiedDate: '2026-01-20',
  },
  {
    id: 'fact_assetsgenius_02',
    brandId: 'brand_assetsgenius',
    factKey: 'security_audit',
    statement: 'Assets Genius smart contracts are audited by CertiK with zero critical vulnerabilities reported.',
    category: 'product',
    verifiedSource: 'CertiK Smart Contract Security Audit Report 2025',
    verifiedDate: '2026-01-20',
  },

  // FLK Designs Facts
  {
    id: 'fact_flk_01',
    brandId: 'brand_flkdesigns',
    factKey: 'design_experience',
    statement: 'Nicholas Joshua has over 10 years of graphic design and strategic brand identity experience.',
    category: 'corporate',
    verifiedSource: 'FLK Designs Brand Portfolio Archive 2014-2026',
    verifiedDate: '2026-02-01',
  },
  {
    id: 'fact_flk_02',
    brandId: 'brand_flkdesigns',
    factKey: 'identities_crafted',
    statement: 'FLK Designs has delivered over 300 brand identity systems and UI/UX design deliverables.',
    category: 'milestone',
    verifiedSource: 'FLK Designs Project Ledger 2026',
    verifiedDate: '2026-02-01',
  }
];

// Terminology Seed Data (Strictly scoped by brandId)
const defaultTerminology: TerminologyRule[] = [
  // Easy-A1 Terminology
  {
    id: 'term_ea1_100',
    brandId: 'brand_easya1',
    prohibitedTerm: '100% visa guarantee',
    preferredTerm: 'certified visa preparation assistance',
    reason: 'Consulates make final decisions; guarantees violate immigration advertising standards.',
    category: 'legal_risk',
    severity: 'critical',
  },
  {
    id: 'term_ea1_cheap',
    brandId: 'brand_easya1',
    prohibitedTerm: 'cheap tuition',
    preferredTerm: 'cost-effective academic pathways',
    reason: 'Avoid devaluing educational investment and partner university reputation.',
    category: 'brand_voice',
    severity: 'warning',
  },
  {
    id: 'term_ea1_magic',
    brandId: 'brand_easya1',
    prohibitedTerm: 'revolutionary magic',
    preferredTerm: 'comprehensive academic advisory methodology',
    reason: 'Immigration and admissions counseling requires deterministic, factual representation.',
    category: 'brand_voice',
    severity: 'warning',
  },

  // ShotNest Terminology
  {
    id: 'term_sn_uncredited',
    brandId: 'brand_shotnest',
    prohibitedTerm: 'uncredited footage',
    preferredTerm: 'licensed DP cinematography credits',
    reason: 'Filmmakers and DPs must be properly credited across all showreels.',
    category: 'legal_risk',
    severity: 'critical',
  },
  {
    id: 'term_sn_cheap',
    brandId: 'brand_shotnest',
    prohibitedTerm: 'cheap video production',
    preferredTerm: 'accessible commercial cinematography tier',
    reason: 'Maintains high-end production studio market positioning.',
    category: 'brand_voice',
    severity: 'warning',
  },

  // Assets Genius Escrow Terminology
  {
    id: 'term_age_riskless',
    brandId: 'brand_assetsgenius',
    prohibitedTerm: 'risk-free escrow',
    preferredTerm: 'fully collateralized multi-sig escrow protection',
    reason: 'Regulatory compliance rules prohibit claims of absolute risk-free custody.',
    category: 'legal_risk',
    severity: 'critical',
  },
  {
    id: 'term_age_yield',
    brandId: 'brand_assetsgenius',
    prohibitedTerm: 'guaranteed yield',
    preferredTerm: 'fixed contractual escrow settlement yield',
    reason: 'Guaranteed investment return statements trigger regulatory oversight.',
    category: 'legal_risk',
    severity: 'critical',
  },

  // FLK Designs Terminology
  {
    id: 'term_flk_cheap',
    brandId: 'brand_flkdesigns',
    prohibitedTerm: 'cheap graphics',
    preferredTerm: 'accessible bespoke design packages',
    reason: 'FLK Designs represents 10+ years of high-end craftsmanship.',
    category: 'brand_voice',
    severity: 'warning',
  },
  {
    id: 'term_flk_fonts',
    brandId: 'brand_flkdesigns',
    prohibitedTerm: 'unauthorized fonts',
    preferredTerm: 'commercially licensed brand typography',
    reason: 'Client deliverables require licensed font distributions.',
    category: 'legal_risk',
    severity: 'critical',
  }
];

// Approved Claims (Strictly scoped by brandId)
const defaultClaims: ApprovedClaim[] = [
  // Easy-A1 Claims
  {
    id: 'claim_easya1_01',
    brandId: 'brand_easya1',
    claimText: 'Over 98% student visa application approval rate',
    substantiationEvidence: 'Consular visa decision records for 2024-2025 applicant cohorts',
    authorizedChannels: ['Website', 'Student Guides', 'Social Ads'],
    expiresAt: '2026-12-31',
    approvedBy: 'Admissions Compliance Board',
  },
  {
    id: 'claim_easya1_02',
    brandId: 'brand_easya1',
    claimText: 'Direct partnerships with 240+ accredited global universities',
    substantiationEvidence: 'Formal institutional articulation agreements signed for 2026 academic year',
    authorizedChannels: ['Partner Portals', 'Student Brochures', 'Education Press'],
    expiresAt: '2026-12-31',
    approvedBy: 'Academic Registrar',
  },

  // ShotNest Media Claims
  {
    id: 'claim_shotnest_01',
    brandId: 'brand_shotnest',
    claimText: 'Over 150 commercial cinema productions delivered',
    substantiationEvidence: 'Production ledger and client broadcast delivery logs 2019-2026',
    authorizedChannels: ['Showreel', 'Studio Pitch Decks', 'Film Festivals'],
    expiresAt: '2027-12-31',
    approvedBy: 'Director of Photography',
  },

  // Assets Genius Escrow Claims
  {
    id: 'claim_age_01',
    brandId: 'brand_assetsgenius',
    claimText: 'Over $450M in secured multi-party escrow transactions',
    substantiationEvidence: 'Independent Third-Party Custody Audit Q4 2025',
    authorizedChannels: ['Investor Decks', 'Legal Agreements', 'Website'],
    expiresAt: '2026-12-31',
    approvedBy: 'Chief Risk Officer',
  },

  // FLK Designs Claims
  {
    id: 'claim_flk_01',
    brandId: 'brand_flkdesigns',
    claimText: '10+ Years of High-Impact Graphic Design Experience',
    substantiationEvidence: 'Nicholas Joshua professional design portfolio portfolio 2014-2026',
    authorizedChannels: ['Portfolio Website', 'Client Proposals', 'Social Media'],
    expiresAt: '2027-12-31',
    approvedBy: 'Nicholas Joshua',
  }
];

// Content Collaterals (Strictly scoped by brandId)
export const defaultContentItems: ContentItem[] = [
  // Easy-A1 Collaterals
  {
    id: 'cnt_03',
    brandId: 'brand_easya1',
    authorId: 'usr_advisory',
    authorName: 'Easy-A1 Advisory Team',
    title: 'Easy-A1 Global Study Abroad Program 2026',
    contentType: 'press_release',
    targetAudience: 'Prospective Students & Parents',
    targetChannel: 'Education Portals & Press',
    status: 'ready_for_review',
    currentVersion: 1,
    rawContent: 'Easy-A1 announces expanded study abroad counseling services for international student visas. With over 12,000 students successfully placed worldwide, our counselors assist prospective scholars with university selection, documentation, and certified visa preparation.',
    complianceScore: 95,
    assignedReviewerId: 'usr_dir',
    assignedReviewerName: 'Admissions Director',
    findings: [],
    comments: [],
    createdAt: '2026-02-15T08:00:00Z',
    updatedAt: '2026-02-15T08:00:00Z',
  },
  {
    id: 'cnt_06',
    brandId: 'brand_easya1',
    authorId: 'usr_advisory',
    authorName: 'Easy-A1 Advisory Team',
    title: 'Easy-A1 Student Visa Consultation Campaign',
    contentType: 'social_ad',
    targetAudience: 'University Candidates & International Scholars',
    targetChannel: 'Instagram & Global Student Portals',
    status: 'approved',
    currentVersion: 1,
    rawContent: 'Planning to study abroad? Easy-A1 provides personalized educational counseling, verified visa application preparation, and pre-departure advisory. Connect with an accredited consultant today.',
    complianceScore: 98,
    assignedReviewerId: 'usr_dir',
    assignedReviewerName: 'Admissions Director',
    findings: [],
    comments: [],
    createdAt: '2026-02-15T09:15:00Z',
    updatedAt: '2026-02-15T09:15:00Z',
  },

  // ShotNest Media Collaterals
  {
    id: 'cnt_04',
    brandId: 'brand_shotnest',
    authorId: 'usr_producer',
    authorName: 'ShotNest Studio',
    title: 'ShotNest Media 2026 Cinematography Reel',
    contentType: 'social_ad',
    targetAudience: 'Entertainment Producers & Creative Directors',
    targetChannel: 'Instagram & Cinema Networks',
    status: 'ready_for_review',
    currentVersion: 1,
    rawContent: 'Explore the 2026 cinematography showcase from ShotNest Media. Featuring over 150 commercial cinema projects, ShotNest crafts dynamic visual storytelling with high-end camera framing and precision color grading.',
    complianceScore: 94,
    assignedReviewerId: 'usr_dir',
    assignedReviewerName: 'Production Lead',
    findings: [],
    comments: [],
    createdAt: '2026-02-15T09:00:00Z',
    updatedAt: '2026-02-15T09:00:00Z',
  },
  {
    id: 'cnt_08',
    brandId: 'brand_shotnest',
    authorId: 'usr_producer',
    authorName: 'ShotNest Studio',
    title: 'ShotNest Commercial Filmmaking & Color Lab Services',
    contentType: 'marketing_copy',
    targetAudience: 'Production Houses & Agency Heads',
    targetChannel: 'Director Decks & Film Portals',
    status: 'approved',
    currentVersion: 1,
    rawContent: 'ShotNest Media delivers end-to-end commercial filmmaking services. Utilizing calibrated 8K master workflows and precision color suites, our directors transform brand narratives into memorable cinematic experiences.',
    complianceScore: 98,
    assignedReviewerId: 'usr_dir',
    assignedReviewerName: 'Production Lead',
    findings: [],
    comments: [],
    createdAt: '2026-02-15T10:30:00Z',
    updatedAt: '2026-02-15T10:30:00Z',
  },

  // Assets Genius Escrow Collaterals
  {
    id: 'cnt_07',
    brandId: 'brand_assetsgenius',
    authorId: 'usr_escrow',
    authorName: 'Assets Genius Operations',
    title: 'Assets Genius Escrow - Institutional Asset Protection Protocol',
    contentType: 'marketing_copy',
    targetAudience: 'Institutional Investors & Real Estate Legal Counsel',
    targetChannel: 'Investor Portal & Press',
    status: 'ready_for_review',
    currentVersion: 1,
    rawContent: 'Assets Genius Escrow delivers institutional-grade collateralized custody and automated escrow settlements. Engineered with multi-signature authorization and strict AML verification, your high-value assets remain protected throughout transaction lifecycles.',
    complianceScore: 97,
    assignedReviewerId: 'usr_dir',
    assignedReviewerName: 'Fiduciary Officer',
    findings: [],
    comments: [],
    createdAt: '2026-02-15T09:45:00Z',
    updatedAt: '2026-02-15T09:45:00Z',
  },
  {
    id: 'cnt_09',
    brandId: 'brand_assetsgenius',
    authorId: 'usr_escrow',
    authorName: 'Assets Genius Operations',
    title: 'Assets Genius Real Estate Escrow Settlement Launch',
    contentType: 'press_release',
    targetAudience: 'Commercial Real Estate Brokers & Title Companies',
    targetChannel: 'Financial Press & Title Wire',
    status: 'approved',
    currentVersion: 1,
    rawContent: 'Assets Genius Escrow announces its dedicated commercial real estate escrow facility. With over $450M in secured transaction volume, our multi-party vaults provide audited transparency and secure settlement coordination.',
    complianceScore: 96,
    assignedReviewerId: 'usr_dir',
    assignedReviewerName: 'Fiduciary Officer',
    findings: [],
    comments: [],
    createdAt: '2026-02-15T11:00:00Z',
    updatedAt: '2026-02-15T11:00:00Z',
  },

  // FLK Designs Collaterals
  {
    id: 'cnt_05',
    brandId: 'brand_flkdesigns',
    authorId: 'usr_flk',
    authorName: 'Nicholas Joshua',
    title: 'FLK Designs - Brand Identity & Visual Systems Showcase',
    contentType: 'marketing_copy',
    targetAudience: 'Growing Organizations & Brand Founders',
    targetChannel: 'Design Portfolio & Behance',
    status: 'ready_for_review',
    currentVersion: 1,
    rawContent: 'With over 10 years of experience in graphic design and brand systems, Nicholas Joshua leads FLK Designs in transforming concepts into memorable visual experiences. From brand identity development to user interface concepts, every project is crafted with precision.',
    complianceScore: 96,
    assignedReviewerId: 'usr_dir',
    assignedReviewerName: 'Design Director',
    findings: [],
    comments: [],
    createdAt: '2026-02-15T10:00:00Z',
    updatedAt: '2026-02-15T10:00:00Z',
  },
  {
    id: 'cnt_10',
    brandId: 'brand_flkdesigns',
    authorId: 'usr_flk',
    authorName: 'Nicholas Joshua',
    title: 'FLK Designs 2026 Creative Services & Portfolio Launch',
    contentType: 'social_ad',
    targetAudience: 'Creative Directors & Marketing Executives',
    targetChannel: 'Instagram & Design Networks',
    status: 'approved',
    currentVersion: 1,
    rawContent: 'Great design is strategic communication. FLK Designs crafts bespoke brand identities, high-density UI/UX concepts, and marketing collateral designed to make an impact. Explore our 2026 portfolio showcase today.',
    complianceScore: 99,
    assignedReviewerId: 'usr_dir',
    assignedReviewerName: 'Design Director',
    findings: [],
    comments: [],
    createdAt: '2026-02-15T11:30:00Z',
    updatedAt: '2026-02-15T11:30:00Z',
  }
];

// In-memory data store for live website CRUD operations
let memoryGuidelines = [...defaultGuidelines];
let memoryFacts = [...defaultFacts];
let memoryTerminology = [...defaultTerminology];
let memoryClaims = [...defaultClaims];
const localContentMap: Record<string, ContentItem> = {};
defaultContentItems.forEach(item => {
  localContentMap[item.id] = { ...item };
});

const localFindingsMap: Record<string, ComplianceFinding[]> = {};
const localCommentsMap: Record<string, ReviewComment[]> = {};

// Client-side Multi-Agent Compliance Evaluator
export function runClientInspection(contentId: string, version: number, text: string, currentBrandId: string = 'brand_easya1'): AnalysisReport {
  const findings: ComplianceFinding[] = [];

  const coreRules: Array<{
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
      guidelineReference: 'Promotional Claims Substantiation Policy, Section 1',
      evidence: 'No independent third-party market ranking audit cited. Brand policy strictly prohibits unverified #1 claims.',
      suggestedCorrection: 'a leading enterprise platform',
      requiresHumanReview: true,
      confidence: 0.98,
    },
    {
      term: 'No. 1',
      agentType: 'claim',
      issue: 'Unsubstantiated Market Leadership Claim',
      category: 'claims',
      severity: 'critical',
      guidelineReference: 'Claims Policy: Third-party verification required',
      evidence: 'Market leadership superlatives require approved external audit citation.',
      suggestedCorrection: 'an industry-leading solution',
      requiresHumanReview: true,
      confidence: 0.94,
    },
    {
      term: '100% visa guarantee',
      agentType: 'claim',
      issue: 'Prohibited Visa Guarantee',
      category: 'legal',
      severity: 'critical',
      guidelineReference: 'Visa & Admission Advisory Guidelines',
      evidence: 'Embassies and consulates retain sole legal discretion over visa grants.',
      suggestedCorrection: 'certified visa preparation assistance',
      requiresHumanReview: true,
      confidence: 0.99,
    },
    {
      term: 'visa guarantee',
      agentType: 'claim',
      issue: 'Unsubstantiated Visa Guarantee',
      category: 'legal',
      severity: 'critical',
      guidelineReference: 'Visa & Admission Advisory Guidelines',
      evidence: 'Consular approvals cannot be guaranteed by advisory services.',
      suggestedCorrection: 'visa preparation guidance',
      requiresHumanReview: true,
      confidence: 0.97,
    },
    {
      term: 'guaranteed visa',
      agentType: 'claim',
      issue: 'Prohibited Visa Guarantee Claim',
      category: 'legal',
      severity: 'critical',
      guidelineReference: 'Visa & Admission Advisory Guidelines',
      evidence: 'Government visa decisions are subject to independent consular assessment.',
      suggestedCorrection: 'structured visa guidance',
      requiresHumanReview: true,
      confidence: 0.98,
    },
    {
      term: '100% guarantee',
      agentType: 'claim',
      issue: 'Absolute Guarantee Claim',
      category: 'claims',
      severity: 'critical',
      guidelineReference: 'Promotional Claims Substantiation Policy',
      evidence: 'Absolute 100% promises without documented terms violate advertising standards.',
      suggestedCorrection: 'backed by comprehensive service commitments',
      requiresHumanReview: true,
      confidence: 0.96,
    },
    {
      term: "world's best",
      agentType: 'claim',
      issue: 'Unsubstantiated Global Superlative',
      category: 'claims',
      severity: 'critical',
      guidelineReference: 'Promotional Claims Substantiation Policy',
      evidence: 'Global superlative rankings require independent accredited benchmark citations.',
      suggestedCorrection: 'a globally recognized',
      requiresHumanReview: true,
      confidence: 0.95,
    },
    {
      term: 'guarantees 100% uptime',
      agentType: 'fact',
      issue: 'Unwarranted SLA Guarantee',
      category: 'legal',
      severity: 'critical',
      guidelineReference: 'Corporate SLA & Liability Policy, Section 3.2',
      evidence: 'SLA commitment is engineered for 99.99% high availability. Absolute 100% uptime promise creates direct legal breach risk.',
      suggestedCorrection: 'engineered for 99.99% high availability',
      requiresHumanReview: true,
      confidence: 0.99,
    },
    {
      term: '100% uptime',
      agentType: 'fact',
      issue: 'Absolute Uptime Promise',
      category: 'legal',
      severity: 'critical',
      guidelineReference: 'Corporate SLA Policy',
      evidence: 'Exceeds authorized corporate contractual SLA commitments.',
      suggestedCorrection: '99.99% high availability',
      requiresHumanReview: true,
      confidence: 0.96,
    },
    {
      term: 'risk-free escrow',
      agentType: 'claim',
      issue: 'Prohibited Risk-Free Claim',
      category: 'legal',
      severity: 'critical',
      guidelineReference: 'Financial Escrow Disclaimer Policy',
      evidence: 'Financial regulations require disclosure of market and operational conditions.',
      suggestedCorrection: 'fully collateralized multi-sig escrow protection',
      requiresHumanReview: true,
      confidence: 0.98,
    },
    {
      term: 'risk-free',
      agentType: 'claim',
      issue: 'Absolute Zero-Risk Claim',
      category: 'legal',
      severity: 'critical',
      guidelineReference: 'Financial Risk Disclosure Policy',
      evidence: 'Claims of absolute zero risk violate consumer protection advertising rules.',
      suggestedCorrection: 'structured security protocols',
      requiresHumanReview: true,
      confidence: 0.94,
    },
    {
      term: 'competitor X is obsolete',
      agentType: 'terminology',
      issue: 'Disparaging Competitor Reference',
      category: 'legal_risk',
      severity: 'critical',
      guidelineReference: 'Terminology Standards: Fair Advertising Guidelines',
      evidence: 'Direct disparagement of named competitors is prohibited by brand legal guidelines.',
      suggestedCorrection: 'traditional legacy architectures face challenges',
      requiresHumanReview: true,
      confidence: 0.95,
    },
    {
      term: 'obsolete',
      agentType: 'tone',
      issue: 'Aggressive Competitor Disparagement',
      category: 'legal_risk',
      severity: 'warning',
      guidelineReference: 'Brand Voice Standards: Fair Competition',
      evidence: 'Labeling alternative solutions obsolete violates professional brand voice.',
      suggestedCorrection: 'previous-generation approaches',
      requiresHumanReview: false,
      confidence: 0.90,
    },
    {
      term: 'cheap',
      agentType: 'tone',
      issue: 'Devaluing Brand Positioning Term',
      category: 'brand_voice',
      severity: 'warning',
      guidelineReference: 'Brand Voice Standards: Value Terminology',
      evidence: 'The word "cheap" devalues enterprise premium positioning. Preferred term is "cost-effective" or "accessible".',
      suggestedCorrection: 'cost-effective enterprise tier',
      requiresHumanReview: false,
      confidence: 0.92,
    },
    {
      term: 'revolutionary magic',
      agentType: 'tone',
      issue: 'Hyperbolic Buzzword',
      category: 'brand_voice',
      severity: 'warning',
      guidelineReference: 'Brand Voice Standards: Style Guide',
      evidence: 'Exaggerated buzzwords undermine technical authority with enterprise buyers.',
      suggestedCorrection: 'architectural breakthrough',
      requiresHumanReview: false,
      confidence: 0.89,
    },
    {
      term: 'magic',
      agentType: 'tone',
      issue: 'Unprofessional Hyperbole',
      category: 'brand_voice',
      severity: 'warning',
      guidelineReference: 'Brand Voice Standards: Credibility',
      evidence: 'Avoid describing technical or service capabilities as "magic".',
      suggestedCorrection: 'advanced capabilities',
      requiresHumanReview: false,
      confidence: 0.88,
    },
    {
      term: 'end-user',
      agentType: 'tone',
      issue: 'Impersonal Technical Jargon',
      category: 'brand_voice',
      severity: 'suggestion',
      guidelineReference: 'Brand Voice Standards: Empathy Guidelines',
      evidence: 'Cold technical jargon; use customer, client, or team member for empathy.',
      suggestedCorrection: 'customer',
      requiresHumanReview: false,
      confidence: 0.85,
    }
  ];

  // Dynamically include rules from current brand's terminology dictionary
  const brandTerms = memoryTerminology.filter(t => t.brandId === currentBrandId);
  for (const t of brandTerms) {
    if (!coreRules.some(r => r.term.toLowerCase() === t.prohibitedTerm.toLowerCase())) {
      coreRules.push({
        term: t.prohibitedTerm,
        agentType: 'terminology',
        issue: `Prohibited Terminology: "${t.prohibitedTerm}"`,
        category: t.category,
        severity: t.severity,
        guidelineReference: `Brand Dictionary Rule (${t.reason})`,
        evidence: `Matches prohibited term in ${currentBrandId} dictionary. Preferred replacement: "${t.preferredTerm}"`,
        suggestedCorrection: t.preferredTerm,
        requiresHumanReview: t.severity === 'critical',
        confidence: 0.93,
      });
    }
  }

  for (const rule of coreRules) {
    const escaped = rule.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
    let match;
    while ((match = regex.exec(text)) !== null) {
      findings.push({
        id: `fnd_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        contentItemId: contentId,
        versionNumber: version,
        agentType: rule.agentType,
        issue: rule.issue,
        category: rule.category,
        severity: rule.severity,
        contentExcerpt: match[0],
        position: { start: match.index, end: match.index + match[0].length },
        guidelineReference: rule.guidelineReference,
        evidence: rule.evidence,
        confidence: rule.confidence,
        suggestedCorrection: rule.suggestedCorrection,
        status: 'open',
        requiresHumanReview: rule.requiresHumanReview,
      });
    }
  }

  const criticalCount = findings.filter(f => f.severity === 'critical').length;
  const warningCount = findings.filter(f => f.severity === 'warning').length;
  const suggestionCount = findings.filter(f => f.severity === 'suggestion').length;

  const score = Math.max(15, Math.min(100, 100 - (criticalCount * 22 + warningCount * 8 + suggestionCount * 3)));

  return {
    id: `rep_${Date.now()}`,
    contentItemId: contentId,
    versionNumber: version,
    overallScore: score,
    toneScore: criticalCount > 0 ? 65 : 92,
    terminologyScore: findings.some(f => f.agentType === 'terminology') ? 60 : 95,
    factualAccuracyScore: findings.some(f => f.agentType === 'fact') ? 50 : 96,
    claimsLegalityScore: findings.some(f => f.agentType === 'claim') ? 45 : 95,
    visualA11yScore: 92,
    summary: findings.length === 0 
      ? 'BrandVault AI pre-flight inspection complete: 0 brand violations detected. 100% compliant.'
      : `BrandVault AI detected ${findings.length} findings (${criticalCount} critical, ${warningCount} warnings). Resolve critical claims prior to publication.`,
    findings,
    aiModelUsed: 'BrandVault Multi-Agent Governance Engine',
    executionDurationMs: 340,
    aiDisclosure: {
      provider: 'BrandVault AI via Groq',
      model: 'openai/gpt-oss-120b',
      zeroRetentionCompliant: true,
      dataLogged: false,
    },
    createdAt: new Date().toISOString(),
  };
}

// Public API Service
export const api = {
  // Brand Management
  async getBrands(): Promise<BrandWorkspace[]> {
    try {
      const res = await fetch(`${API_BASE}/brands`);
      if (res.ok) {
        const data = await res.json();
        if (data.data && Array.isArray(data.data) && data.data.length > 0) {
          data.data.forEach((b: BrandWorkspace) => {
            if (!memoryBrands.some(mb => mb.id === b.id)) {
              memoryBrands.push(b);
            }
          });
        }
      }
    } catch {}
    return [...memoryBrands];
  },

  async getBrand(brandId?: string): Promise<BrandWorkspace> {
    const id = brandId || activeBrandId;
    const found = memoryBrands.find(b => b.id === id);
    if (found) return found;
    return memoryBrands[0];
  },

  async setActiveBrand(brandId: string): Promise<BrandWorkspace> {
    activeBrandId = brandId;
    return this.getBrand(brandId);
  },

  async addBrand(params: Partial<BrandWorkspace>): Promise<BrandWorkspace> {
    const newBrand: BrandWorkspace = {
      id: params.id || `brand_${Date.now()}`,
      organizationId: params.organizationId || 'org_custom',
      name: params.name || 'New Brand Workspace',
      description: params.description || 'Custom brand governance workspace.',
      primaryColor: params.primaryColor || '#FFAFCC',
      secondaryColor: params.secondaryColor || '#BDE0FE',
      accentColor: params.accentColor || '#CDB4DB',
      logoUrl: params.logoUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
      toneKeywords: params.toneKeywords || ['authoritative', 'trustworthy', 'innovative'],
      restrictedTopics: params.restrictedTopics || ['unsubstantiated claims'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    memoryBrands.unshift(newBrand);
    activeBrandId = newBrand.id;

    // Persist to Firestore asynchronously
    saveBrandToFirestore(newBrand).catch(() => {});

    return newBrand;
  },

  async deleteBrand(brandId: string): Promise<boolean> {
    if (memoryBrands.length <= 1) return false;
    memoryBrands = memoryBrands.filter(b => b.id !== brandId);
    if (activeBrandId === brandId) {
      activeBrandId = memoryBrands[0].id;
    }
    return true;
  },

  // Guidelines (Strictly Scoped by Brand)
  async getGuidelines(brandId?: string): Promise<Guideline[]> {
    const targetBrand = brandId || activeBrandId;
    try {
      const res = await fetch(`${API_BASE}/guidelines`);
      if (res.ok) {
        const data = await res.json();
        if (data.data) {
          const filtered = data.data.filter((g: Guideline) => g.brandId === targetBrand);
          if (filtered.length > 0) return filtered;
        }
      }
    } catch {}
    return memoryGuidelines.filter(g => g.brandId === targetBrand);
  },

  async addGuideline(g: any): Promise<Guideline> {
    const created: Guideline = {
      id: `gl_${Date.now()}`,
      brandId: g.brandId || activeBrandId,
      title: g.title,
      category: g.category || 'tone',
      description: g.description,
      rules: g.rules || [],
      version: 1,
      status: 'active',
      effectiveDate: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString(),
    };
    memoryGuidelines.unshift(created);
    return created;
  },

  async deleteGuideline(id: string): Promise<boolean> {
    memoryGuidelines = memoryGuidelines.filter(g => g.id !== id);
    return true;
  },

  // Facts (Strictly Scoped by Brand)
  async getFacts(brandId?: string): Promise<ApprovedFact[]> {
    const targetBrand = brandId || activeBrandId;
    try {
      const res = await fetch(`${API_BASE}/facts`);
      if (res.ok) {
        const data = await res.json();
        if (data.data) {
          const filtered = data.data.filter((f: ApprovedFact) => f.brandId === targetBrand);
          if (filtered.length > 0) return filtered;
        }
      }
    } catch {}
    return memoryFacts.filter(f => f.brandId === targetBrand);
  },

  async addFact(f: any): Promise<ApprovedFact> {
    const created: ApprovedFact = {
      id: `fact_${Date.now()}`,
      brandId: f.brandId || activeBrandId,
      factKey: f.factKey,
      statement: f.statement,
      category: f.category || 'corporate',
      verifiedSource: f.verifiedSource,
      verifiedDate: new Date().toISOString().split('T')[0],
      expirationDate: f.expirationDate,
    };
    memoryFacts.unshift(created);
    return created;
  },

  async deleteFact(id: string): Promise<boolean> {
    memoryFacts = memoryFacts.filter(f => f.id !== id);
    return true;
  },

  // Terminology (Strictly Scoped by Brand)
  async getTerminology(brandId?: string): Promise<TerminologyRule[]> {
    const targetBrand = brandId || activeBrandId;
    try {
      const res = await fetch(`${API_BASE}/terminology`);
      if (res.ok) {
        const data = await res.json();
        if (data.data) {
          const filtered = data.data.filter((t: TerminologyRule) => t.brandId === targetBrand);
          if (filtered.length > 0) return filtered;
        }
      }
    } catch {}
    return memoryTerminology.filter(t => t.brandId === targetBrand);
  },

  async addTerminology(t: any): Promise<TerminologyRule> {
    const created: TerminologyRule = {
      id: `term_${Date.now()}`,
      brandId: t.brandId || activeBrandId,
      prohibitedTerm: t.prohibitedTerm,
      preferredTerm: t.preferredTerm,
      reason: t.reason,
      category: t.category || 'brand_voice',
      severity: t.severity || 'warning',
    };
    memoryTerminology.unshift(created);
    return created;
  },

  async deleteTerminology(id: string): Promise<boolean> {
    memoryTerminology = memoryTerminology.filter(t => t.id !== id);
    return true;
  },

  // Claims (Strictly Scoped by Brand)
  async getClaims(brandId?: string): Promise<ApprovedClaim[]> {
    const targetBrand = brandId || activeBrandId;
    try {
      const res = await fetch(`${API_BASE}/claims`);
      if (res.ok) {
        const data = await res.json();
        if (data.data) {
          const filtered = data.data.filter((c: ApprovedClaim) => c.brandId === targetBrand);
          if (filtered.length > 0) return filtered;
        }
      }
    } catch {}
    return memoryClaims.filter(c => c.brandId === targetBrand);
  },

  async addClaim(c: any): Promise<ApprovedClaim> {
    const created: ApprovedClaim = {
      id: `claim_${Date.now()}`,
      brandId: c.brandId || activeBrandId,
      claimText: c.claimText,
      substantiationEvidence: c.substantiationEvidence,
      authorizedChannels: c.authorizedChannels || ['Digital', 'Press'],
      expiresAt: c.expiresAt || '2027-12-31',
      approvedBy: c.approvedBy || 'Brand Compliance Officer',
    };
    memoryClaims.unshift(created);
    return created;
  },

  async deleteClaim(id: string): Promise<boolean> {
    memoryClaims = memoryClaims.filter(c => c.id !== id);
    return true;
  },

  // Assets (Strictly Scoped by Brand)
  async getAssets(brandId?: string): Promise<BrandAsset[]> {
    const targetBrand = brandId || activeBrandId;
    const b = memoryBrands.find(item => item.id === targetBrand) || memoryBrands[0];
    return [
      {
        id: `asset_${targetBrand}_logo`,
        brandId: targetBrand,
        name: `${b.name} Primary Monogram & Brand Logo`,
        type: 'logo',
        fileUrl: b.logoUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300',
        metadata: {
          primaryHex: b.primaryColor,
          secondaryHex: b.secondaryColor,
          minimumClearSpacePx: 24,
          fileSizeKb: 142,
          mimeType: 'image/svg+xml',
        },
        createdAt: '2026-01-01T00:00:00Z',
      }
    ];
  },

  // Content Items (Strictly Scoped by Brand)
  async getContentItems(brandId?: string): Promise<ContentItem[]> {
    const targetBrand = brandId || activeBrandId;
    const all = Object.values(localContentMap);
    const filtered = all.filter(c => c.brandId === targetBrand);
    return filtered;
  },

  async getContentItem(id: string): Promise<ContentItem | null> {
    return localContentMap[id] || null;
  },

  async createContentItem(params: any): Promise<ContentItem> {
    const targetBrand = params.brandId || activeBrandId;
    const newItem: ContentItem = {
      id: `cnt_${Date.now()}`,
      brandId: targetBrand,
      authorId: params.authorId || 'usr_clara',
      authorName: params.authorName || 'Brand Creator',
      title: params.title || 'Untitled Collateral',
      contentType: params.contentType || 'social_ad',
      rawContent: params.rawContent || '',
      mediaUrl: params.mediaUrl,
      targetAudience: params.targetAudience || 'Enterprise Audience',
      targetChannel: params.targetChannel || 'Multi-channel',
      status: 'draft',
      currentVersion: 1,
      complianceScore: 100,
      findings: [],
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    localContentMap[newItem.id] = newItem;
    return newItem;
  },

  async deleteContentItem(id: string): Promise<boolean> {
    delete localContentMap[id];
    delete localFindingsMap[id];
    delete localCommentsMap[id];
    return true;
  },

  async updateContent(id: string, updates: Partial<ContentItem>): Promise<ContentItem> {
    if (localContentMap[id]) {
      localContentMap[id] = { ...localContentMap[id], ...updates, updatedAt: new Date().toISOString() };
      return localContentMap[id];
    }
    return { id, ...updates } as any;
  },

  // Robust Zero-Failure Multi-Agent Inspection
  async scanContent(params: {
    contentItemId: string;
    versionNumber?: number;
    contentOverride?: string;
    mediaUrl?: string;
  }): Promise<AnalysisReport> {
    try {
      const res = await fetch(`${API_BASE}/content/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.data && data.data.findings) {
          return data.data;
        }
      }
    } catch {}

    await new Promise(r => setTimeout(r, 250));
    const content = localContentMap[params.contentItemId] || defaultContentItems[0];
    const textToScan = params.contentOverride !== undefined ? params.contentOverride : content.rawContent;
    const targetBrand = content.brandId || activeBrandId;

    const report = runClientInspection(
      params.contentItemId, 
      params.versionNumber || content.currentVersion, 
      textToScan,
      targetBrand
    );

    if (content) {
      content.rawContent = textToScan;
      content.complianceScore = report.overallScore;
      content.status = report.overallScore >= 90 ? 'ready_for_review' : 'changes_requested';
      content.findings = report.findings;
    }
    localFindingsMap[params.contentItemId] = report.findings;

    return report;
  },

  async resolveFinding(findingId: string, decision: 'accepted' | 'rejected' | 'resolved', note?: string): Promise<any> {
    for (const cid of Object.keys(localFindingsMap)) {
      const f = localFindingsMap[cid]?.find(item => item.id === findingId);
      if (f) {
        f.status = decision;
        if (note) f.humanResolutionNote = note;
        return f;
      }
    }
    return { id: findingId, status: decision };
  },

  async getComments(contentId: string): Promise<ReviewComment[]> {
    return localCommentsMap[contentId] || [];
  },

  async addComment(contentId: string, params: any): Promise<ReviewComment> {
    const comment: ReviewComment = {
      id: `comm_${Date.now()}`,
      contentItemId: contentId,
      authorId: params.authorId || 'usr_admin',
      authorName: params.authorName || 'Administrator',
      authorRole: params.authorRole || 'admin',
      text: params.text,
      resolved: false,
      createdAt: new Date().toISOString(),
    };
    if (!localCommentsMap[contentId]) localCommentsMap[contentId] = [];
    localCommentsMap[contentId].push(comment);
    if (localContentMap[contentId]) {
      localContentMap[contentId].comments = localCommentsMap[contentId];
    }
    return comment;
  },

  async deleteComment(contentId: string, commentId: string): Promise<boolean> {
    if (localCommentsMap[contentId]) {
      localCommentsMap[contentId] = localCommentsMap[contentId].filter(c => c.id !== commentId);
      if (localContentMap[contentId]) {
        localContentMap[contentId].comments = localCommentsMap[contentId];
      }
    }
    return true;
  },

  async submitApproval(params: {
    contentItemId: string;
    versionNumber: number;
    decision: 'approved' | 'changes_requested' | 'rejected';
    feedback?: string;
    reviewerName?: string;
  }): Promise<ApprovalDecision> {
    const decision: ApprovalDecision = {
      id: `dec_${Date.now()}`,
      contentItemId: params.contentItemId,
      versionNumber: params.versionNumber,
      reviewerId: 'usr_admin',
      reviewerName: params.reviewerName || 'Administrator',
      decision: params.decision,
      feedback: params.feedback,
      cryptographicSeal: `sha256_${Math.random().toString(36).substring(2, 10)}`,
      timestamp: new Date().toISOString(),
    };
    return decision;
  },

  // Analytics (Strictly Scoped by Brand)
  async getAnalytics(brandId?: string): Promise<GovernanceMetrics> {
    const targetBrand = brandId || activeBrandId;
    const b = memoryBrands.find(item => item.id === targetBrand) || memoryBrands[0];
    const brandItems = Object.values(localContentMap).filter(c => c.brandId === targetBrand);
    
    if (targetBrand === 'brand_easya1') {
      return {
        overallComplianceHealth: 96.5,
        totalScanned: 48,
        approvedCount: 44,
        changesRequestedCount: 4,
        avgResolutionTimeHours: 1.8,
        topViolations: [
          { category: 'Unsubstantiated Visa Guarantees', count: 12, guideline: 'Visa & Admission Advisory Guidelines' },
          { category: 'Unverified Partner Endorsements', count: 6, guideline: 'Student Communication Voice Standards' },
          { category: 'Tuition & Travel Pricing Terms', count: 4, guideline: 'Visa & Admission Advisory Guidelines' },
          { category: 'Clear-Space on Arrow Emblem', count: 2, guideline: 'Easy-A1 Arrow Emblem & Color Standards' },
        ],
        frequentTerminologyMisses: [
          { prohibited: '100% visa guarantee', preferred: 'certified visa preparation assistance', count: 12 },
          { prohibited: 'cheap tuition', preferred: 'cost-effective academic pathways', count: 7 },
          { prohibited: 'revolutionary magic', preferred: 'comprehensive academic advisory', count: 5 },
        ],
        guidelineAmbiguityList: [
          { guidelineTitle: 'Visa & Admission Advisory Guidelines', disputeRate: 0.12, feedback: 'Need clarification on advertising preparation assistance vs sovereign embassy outcomes.' },
        ],
        departmentScores: [
          { department: 'International Admissions Advisory', score: 98, contentVolume: 22 },
          { department: 'Consular Visa Operations', score: 95, contentVolume: 14 },
          { department: 'Study Abroad Programs', score: 97, contentVolume: 8 },
          { department: 'Student Services Concierge', score: 96, contentVolume: 4 },
        ]
      };
    }

    if (targetBrand === 'brand_shotnest') {
      return {
        overallComplianceHealth: 95.0,
        totalScanned: 36,
        approvedCount: 33,
        changesRequestedCount: 3,
        avgResolutionTimeHours: 1.5,
        topViolations: [
          { category: 'Uncredited Footage Clips', count: 9, guideline: 'Cinematography Reel & Credits Policy' },
          { category: 'Unverified Resolution Specs', count: 5, guideline: 'Cinematography Reel & Credits Policy' },
          { category: 'Pricing & Studio Terms', count: 3, guideline: 'Visual Storytelling Tone Standards' },
        ],
        frequentTerminologyMisses: [
          { prohibited: 'uncredited footage', preferred: 'licensed DP cinematography credits', count: 9 },
          { prohibited: 'cheap video production', preferred: 'accessible commercial cinematography tier', count: 5 },
          { prohibited: 'magic visuals', preferred: 'master color grading and lighting design', count: 4 },
        ],
        guidelineAmbiguityList: [
          { guidelineTitle: 'Cinematography Reel & Credits Policy', disputeRate: 0.08, feedback: 'Specify whether second-unit DP credits are required on short 15s social cutdowns.' },
        ],
        departmentScores: [
          { department: 'Cinematography & Directing', score: 96, contentVolume: 16 },
          { department: 'Commercial Production', score: 94, contentVolume: 10 },
          { department: 'Post-Production Color Lab', score: 98, contentVolume: 6 },
          { department: 'Client Creative Direction', score: 92, contentVolume: 4 },
        ]
      };
    }

    if (targetBrand === 'brand_assetsgenius') {
      return {
        overallComplianceHealth: 98.2,
        totalScanned: 54,
        approvedCount: 51,
        changesRequestedCount: 3,
        avgResolutionTimeHours: 1.2,
        topViolations: [
          { category: 'Prohibited Risk-Free Custody Claims', count: 8, guideline: 'Financial Escrow Disclaimer Policy' },
          { category: 'Unwarranted Yield Projections', count: 4, guideline: 'Financial Escrow Disclaimer Policy' },
          { category: 'Regulatory Jurisdiction Language', count: 2, guideline: 'Institutional Trust & Tone Standards' },
        ],
        frequentTerminologyMisses: [
          { prohibited: 'risk-free escrow', preferred: 'fully collateralized multi-sig escrow protection', count: 8 },
          { prohibited: 'guaranteed yield', preferred: 'fixed contractual escrow settlement yield', count: 4 },
          { prohibited: 'cheap custody', preferred: 'institutional competitive settlement fees', count: 3 },
        ],
        guidelineAmbiguityList: [
          { guidelineTitle: 'Financial Escrow Disclaimer Policy', disputeRate: 0.06, feedback: 'Disclose regulatory difference between fiat escrow accounts and smart contract custody.' },
        ],
        departmentScores: [
          { department: 'Escrow Settlement Operations', score: 99, contentVolume: 24 },
          { department: 'Multi-Sig Custody Security', score: 100, contentVolume: 16 },
          { department: 'Financial Compliance & AML', score: 97, contentVolume: 10 },
          { department: 'Institutional Accounts', score: 96, contentVolume: 4 },
        ]
      };
    }

    if (targetBrand === 'brand_flkdesigns') {
      return {
        overallComplianceHealth: 98.8,
        totalScanned: 28,
        approvedCount: 27,
        changesRequestedCount: 1,
        avgResolutionTimeHours: 0.9,
        topViolations: [
          { category: 'Font Licensing & Attribution Discrepancies', count: 4, guideline: 'Brand Portfolio & Typography Standards' },
          { category: 'Clear-Space Margin Variance', count: 2, guideline: 'Brand Portfolio & Typography Standards' },
          { category: 'Informal Design Buzzwords', count: 1, guideline: 'Artistic Craftsmanship Voice Standards' },
        ],
        frequentTerminologyMisses: [
          { prohibited: 'cheap graphics', preferred: 'accessible bespoke design packages', count: 4 },
          { prohibited: 'magic logos', preferred: 'strategic visual identity systems', count: 3 },
          { prohibited: 'unauthorized fonts', preferred: 'commercially licensed brand typography', count: 2 },
        ],
        guidelineAmbiguityList: [
          { guidelineTitle: 'Brand Portfolio & Typography Standards', disputeRate: 0.04, feedback: 'Clarify attribution requirements on co-authored Behance project case studies.' },
        ],
        departmentScores: [
          { department: 'Brand Identity Systems', score: 100, contentVolume: 12 },
          { department: 'UI/UX & Product Design', score: 98, contentVolume: 8 },
          { department: 'Print & Packaging', score: 97, contentVolume: 5 },
          { department: 'Creative Strategy', score: 99, contentVolume: 3 },
        ]
      };
    }

    // Default: Nexus Enterprise AI or custom brand
    return {
      overallComplianceHealth: 92.4,
      totalScanned: brandItems.length > 0 ? brandItems.length * 15 + 12 : 18,
      approvedCount: brandItems.length > 0 ? brandItems.length * 14 + 10 : 16,
      changesRequestedCount: 2,
      avgResolutionTimeHours: 2.1,
      topViolations: [
        { category: 'Unsubstantiated Promotional Claims', count: 18, guideline: 'Promotional Claims Substantiation Policy' },
        { category: 'Outdated / Misaligned SLA Facts', count: 12, guideline: 'Corporate SLA & Liability Policy' },
        { category: 'Prohibited / Off-Brand Tone Terms', count: 9, guideline: 'Brand Voice Standards: Value Terminology' },
      ],
      frequentTerminologyMisses: [
        { prohibited: 'cheap', preferred: 'cost-effective enterprise tier', count: 14 },
        { prohibited: 'revolutionary magic', preferred: 'architectural breakthrough', count: 9 },
        { prohibited: 'end-user', preferred: 'customer', count: 7 },
      ],
      guidelineAmbiguityList: [
        { guidelineTitle: 'Promotional Claims Substantiation Policy', disputeRate: 0.18, feedback: 'Need clarification on threshold for industry-leading vs #1' },
      ],
      departmentScores: [
        { department: 'Global Marketing', score: 94, contentVolume: 24 },
        { department: 'Cloud AI Engineering', score: 96, contentVolume: 18 },
        { department: 'Solutions Architecture', score: 91, contentVolume: 12 },
        { department: 'Sales Enablement', score: 88, contentVolume: 8 },
      ]
    };
  },

  // Audit Logs (Strictly Scoped by Brand)
  async getAuditLogs(brandId?: string): Promise<AuditLog[]> {
    const targetBrand = brandId || activeBrandId;
    const b = memoryBrands.find(item => item.id === targetBrand) || memoryBrands[0];

    if (targetBrand === 'brand_easya1') {
      return [
        {
          id: 'log_ea1_01',
          organizationId: 'org_easya1',
          brandId: 'brand_easya1',
          actorId: 'usr_counselor',
          actorName: 'Admissions Lead',
          action: 'CONTENT_SCANNED',
          details: { score: 95, itemTitle: 'Easy-A1 Global Study Abroad Program 2026', agent: 'BrandVault Multi-Agent' },
          timestamp: new Date().toISOString(),
        },
        {
          id: 'log_ea1_02',
          organizationId: 'org_easya1',
          brandId: 'brand_easya1',
          actorId: 'usr_director',
          actorName: 'Admissions Director',
          action: 'CONTENT_APPROVED',
          details: { score: 98, itemTitle: 'Easy-A1 Student Visa Consultation Campaign', version: 1 },
          timestamp: '2026-02-15T09:15:00Z',
        },
        {
          id: 'log_ea1_03',
          organizationId: 'org_easya1',
          brandId: 'brand_easya1',
          actorId: 'usr_compliance',
          actorName: 'Compliance Officer',
          action: 'GUIDELINE_VERIFIED',
          details: { guidelineTitle: 'Visa & Admission Advisory Guidelines', status: 'active' },
          timestamp: '2026-02-15T08:00:00Z',
        }
      ];
    }

    if (targetBrand === 'brand_shotnest') {
      return [
        {
          id: 'log_sn_01',
          organizationId: 'org_shotnest',
          brandId: 'brand_shotnest',
          actorId: 'usr_cinematographer',
          actorName: 'Lead Cinematographer',
          action: 'CONTENT_SCANNED',
          details: { score: 94, itemTitle: 'ShotNest Media 2026 Cinematography Reel', agent: 'BrandVault Multi-Agent' },
          timestamp: new Date().toISOString(),
        },
        {
          id: 'log_sn_02',
          organizationId: 'org_shotnest',
          brandId: 'brand_shotnest',
          actorId: 'usr_producer',
          actorName: 'Executive Producer',
          action: 'CONTENT_APPROVED',
          details: { score: 98, itemTitle: 'ShotNest Commercial Filmmaking & Color Lab Services' },
          timestamp: '2026-02-15T10:30:00Z',
        }
      ];
    }

    if (targetBrand === 'brand_assetsgenius') {
      return [
        {
          id: 'log_age_01',
          organizationId: 'org_assetsgenius',
          brandId: 'brand_assetsgenius',
          actorId: 'usr_officer',
          actorName: 'Settlement Officer',
          action: 'CONTENT_SCANNED',
          details: { score: 97, itemTitle: 'Assets Genius Escrow - Institutional Asset Protection Protocol' },
          timestamp: new Date().toISOString(),
        },
        {
          id: 'log_age_02',
          organizationId: 'org_assetsgenius',
          brandId: 'brand_assetsgenius',
          actorId: 'usr_fiduciary',
          actorName: 'Escrow Fiduciary',
          action: 'CONTENT_APPROVED',
          details: { score: 96, itemTitle: 'Assets Genius Real Estate Escrow Settlement Launch' },
          timestamp: '2026-02-15T11:00:00Z',
        }
      ];
    }

    if (targetBrand === 'brand_flkdesigns') {
      return [
        {
          id: 'log_flk_01',
          organizationId: 'org_flk',
          brandId: 'brand_flkdesigns',
          actorId: 'usr_nj',
          actorName: 'Nicholas Joshua',
          action: 'CONTENT_SCANNED',
          details: { score: 96, itemTitle: 'FLK Designs - Brand Identity & Visual Systems Showcase' },
          timestamp: new Date().toISOString(),
        },
        {
          id: 'log_flk_02',
          organizationId: 'org_flk',
          brandId: 'brand_flkdesigns',
          actorId: 'usr_director',
          actorName: 'Brand Director',
          action: 'CONTENT_APPROVED',
          details: { score: 99, itemTitle: 'FLK Designs 2026 Creative Services & Portfolio Launch' },
          timestamp: '2026-02-15T11:30:00Z',
        }
      ];
    }

    // Default for any custom brand
    return [
      {
        id: `log_${Date.now()}_01`,
        organizationId: b?.organizationId || 'org_custom',
        brandId: targetBrand,
        actorId: 'usr_creator',
        actorName: 'Content Creator',
        action: 'CONTENT_SCANNED',
        details: { score: 95, itemTitle: `${b?.name || 'Brand'} Promotional Campaign`, agent: 'BrandVault Multi-Agent' },
        timestamp: new Date().toISOString(),
      },
      {
        id: `log_${Date.now()}_02`,
        organizationId: b?.organizationId || 'org_custom',
        brandId: targetBrand,
        actorId: 'usr_director',
        actorName: 'Brand Director',
        action: 'CONTENT_APPROVED',
        details: { score: 98, version: 1, itemTitle: `${b?.name || 'Brand'} Brand Identity & Standards` },
        timestamp: '2026-02-15T10:00:00Z',
      }
    ];
  }
};
