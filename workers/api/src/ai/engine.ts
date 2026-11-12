import type { Env } from '../types';
import type { 
  ComplianceFinding, 
  AnalysisReport, 
  Guideline, 
  TerminologyRule, 
  ApprovedFact, 
  ApprovedClaim 
} from '@brandvault/shared';
import { callGroqAI, type ChatMessage } from './groq';

export interface InspectionContext {
  contentItemId: string;
  versionNumber: number;
  rawContent: string;
  contentType: string;
  mediaUrl?: string;
  targetAudience?: string;
  targetChannel?: string;
  brandName: string;
  toneKeywords: string[];
  restrictedTopics: string[];
  guidelines: Guideline[];
  terminologyRules: TerminologyRule[];
  approvedFacts: ApprovedFact[];
  approvedClaims: ApprovedClaim[];
}

export async function runBrandVaultInspection(
  env: Env,
  ctx: InspectionContext
): Promise<AnalysisReport> {
  const startTime = Date.now();
  const findings: ComplianceFinding[] = [];

  // Step 1: Run Deterministic Fast-Pass Rule Engine (Terminology & Known Patterns)
  for (const termRule of ctx.terminologyRules) {
    const regex = new RegExp(`\\b${escapeRegExp(termRule.prohibitedTerm)}\\b`, 'gi');
    let match;
    while ((match = regex.exec(ctx.rawContent)) !== null) {
      findings.push({
        id: `fnd_term_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        contentItemId: ctx.contentItemId,
        versionNumber: ctx.versionNumber,
        agentType: 'terminology',
        issue: `Prohibited Terminology: "${termRule.prohibitedTerm}"`,
        category: termRule.category,
        severity: termRule.severity,
        contentExcerpt: match[0],
        position: { start: match.index, end: match.index + match[0].length },
        guidelineReference: `Brand Terminology Policy: ${termRule.category}`,
        evidence: termRule.reason,
        confidence: 0.99,
        suggestedCorrection: termRule.preferredTerm,
        status: 'open',
        requiresHumanReview: termRule.severity === 'critical',
      });
    }
  }

  // Step 2: Groq AI Deep Multi-Agent Inspection
  let aiModelUsed = 'openai/gpt-oss-120b';
  let groqExecutionDuration = 0;

  try {
    const promptContext = {
      brandName: ctx.brandName,
      toneKeywords: ctx.toneKeywords,
      restrictedTopics: ctx.restrictedTopics,
      guidelines: ctx.guidelines.map(g => ({ title: g.title, category: g.category, rules: g.rules })),
      approvedFacts: ctx.approvedFacts.map(f => ({ statement: f.statement, verifiedSource: f.verifiedSource })),
      approvedClaims: ctx.approvedClaims.map(c => ({ claim: c.claimText, evidence: c.substantiationEvidence })),
      contentToInspect: ctx.rawContent,
      contentType: ctx.contentType,
      targetChannel: ctx.targetChannel || 'Multi-channel',
    };

    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: `You are BrandVault AI, an elite enterprise Brand Compliance & Governance Intelligence Engine.
Your role is to rigorously inspect marketing content and detect brand risks before publication.

Inspect the content against:
1. Tone Agent: Is the voice aligned with approved tone (${ctx.toneKeywords.join(', ')})? Detect hyperbole, buzzwords, fear-inducing text, or lack of professionalism.
2. Fact Agent: Contradictions with approved facts or inaccurate company statements.
3. Claim Agent: Unsubstantiated promotional claims, unverified superlatives (e.g., "#1", "world's best"), or absolute guarantees without disclaimers.
4. Visual & Accessibility Agent: Inclusivity, reading clarity, missing alt-text or contrast warnings for published format.
5. Governance Agent: Overall brand safety score calculation.

CRITICAL INSTRUCTIONS:
- You must return valid JSON strictly following this schema:
{
  "overallScore": number (0-100),
  "toneScore": number (0-100),
  "terminologyScore": number (0-100),
  "factualAccuracyScore": number (0-100),
  "claimsLegalityScore": number (0-100),
  "visualA11yScore": number (0-100),
  "summary": "Clear executive summary of brand governance findings",
  "aiFindings": [
    {
      "agentType": "tone" | "terminology" | "fact" | "claim" | "visual" | "accessibility",
      "issue": "Short issue headline",
      "category": "Category name",
      "severity": "critical" | "warning" | "suggestion",
      "contentExcerpt": "Exact snippet of text that triggered this finding",
      "guidelineReference": "Specific guideline or policy violated",
      "evidence": "Factual explanation of why this was flagged and reference document",
      "confidence": number between 0.80 and 0.99,
      "suggestedCorrection": "Constructive correction preserving creator intent",
      "requiresHumanReview": boolean
    }
  ]
}
Preserve creator intent in corrections. Only flag genuine compliance issues.`
      },
      {
        role: 'user',
        content: JSON.stringify(promptContext)
      }
    ];

    const aiRes = await callGroqAI(env, messages);
    aiModelUsed = aiRes.modelUsed;
    groqExecutionDuration = aiRes.durationMs;

    const parsed = JSON.parse(aiRes.content);
    
    // Merge AI findings avoiding direct duplicates of terminology
    if (Array.isArray(parsed.aiFindings)) {
      for (const item of parsed.aiFindings) {
        const isDuplicate = findings.some(
          f => f.contentExcerpt.toLowerCase() === (item.contentExcerpt || '').toLowerCase()
        );
        if (!isDuplicate && item.contentExcerpt) {
          findings.push({
            id: `fnd_ai_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            contentItemId: ctx.contentItemId,
            versionNumber: ctx.versionNumber,
            agentType: item.agentType || 'governance',
            issue: item.issue || 'Brand Guideline Violation',
            category: item.category || 'General',
            severity: item.severity || 'warning',
            contentExcerpt: item.contentExcerpt,
            guidelineReference: item.guidelineReference || 'Brand Standards Policy',
            evidence: item.evidence || 'Deviation from approved brand guidelines.',
            confidence: typeof item.confidence === 'number' ? item.confidence : 0.92,
            suggestedCorrection: item.suggestedCorrection || 'Revise to align with brand voice.',
            status: 'open',
            requiresHumanReview: item.requiresHumanReview ?? (item.severity === 'critical'),
          });
        }
      }
    }

    // Calculate aggregated scores
    const criticalCount = findings.filter(f => f.severity === 'critical').length;
    const warningCount = findings.filter(f => f.severity === 'warning').length;
    const suggestionCount = findings.filter(f => f.severity === 'suggestion').length;

    const deduction = (criticalCount * 22) + (warningCount * 8) + (suggestionCount * 3);
    const overallScore = Math.max(10, Math.min(100, (parsed.overallScore ? Math.min(parsed.overallScore, 100 - deduction) : 100 - deduction)));

    return {
      id: `rep_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      contentItemId: ctx.contentItemId,
      versionNumber: ctx.versionNumber,
      overallScore: Math.round(overallScore),
      toneScore: parsed.toneScore || (criticalCount > 0 ? 60 : 90),
      terminologyScore: parsed.terminologyScore || (findings.some(f => f.agentType === 'terminology') ? 55 : 95),
      factualAccuracyScore: parsed.factualAccuracyScore || (findings.some(f => f.agentType === 'fact') ? 50 : 98),
      claimsLegalityScore: parsed.claimsLegalityScore || (findings.some(f => f.agentType === 'claim') ? 45 : 95),
      visualA11yScore: parsed.visualA11yScore || 90,
      summary: parsed.summary || `BrandVault AI completed multi-agent inspection: detected ${findings.length} findings (${criticalCount} critical, ${warningCount} warnings).`,
      findings,
      aiModelUsed,
      executionDurationMs: Date.now() - startTime,
      aiDisclosure: {
        provider: 'BrandVault AI via Groq',
        model: aiModelUsed,
        zeroRetentionCompliant: true,
        dataLogged: false,
      },
      createdAt: new Date().toISOString(),
    };

  } catch (error: any) {
    console.error('Groq AI inspection encountered error, falling back to heuristic engine:', error.message);

    // Deterministic fallback report
    const criticalCount = findings.filter(f => f.severity === 'critical').length;
    const warningCount = findings.filter(f => f.severity === 'warning').length;
    const overallScore = Math.max(25, 100 - (criticalCount * 25 + warningCount * 10));

    return {
      id: `rep_fb_${Date.now()}`,
      contentItemId: ctx.contentItemId,
      versionNumber: ctx.versionNumber,
      overallScore,
      toneScore: 80,
      terminologyScore: findings.some(f => f.agentType === 'terminology') ? 50 : 95,
      factualAccuracyScore: 90,
      claimsLegalityScore: 85,
      visualA11yScore: 90,
      summary: `BrandVault Heuristic Engine flagged ${findings.length} brand compliance items.`,
      findings,
      aiModelUsed: 'BrandVault Deterministic Heuristics (Fallback)',
      executionDurationMs: Date.now() - startTime,
      aiDisclosure: {
        provider: 'BrandVault Local Engine',
        model: 'Deterministic Rule Engine',
        zeroRetentionCompliant: true,
        dataLogged: false,
      },
      createdAt: new Date().toISOString(),
    };
  }
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
