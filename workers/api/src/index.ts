import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { Env } from './types';
import { globalStore } from './services/store';
import { runBrandVaultInspection } from './ai/engine';
import { 
  createContentSchema, 
  scanContentSchema, 
  resolveFindingSchema, 
  approvalDecisionSchema 
} from '@brandvault/shared';

const app = new Hono<{ Bindings: Env }>();

// Enable CORS for frontend Vite development and production
app.use('*', cors({
  origin: '*',
  allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
}));

// Root & Health Check
app.get('/', (c) => {
  return c.json({
    platform: 'BrandVault',
    tagline: 'Intelligent Enterprise Brand Governance & Compliance Platform',
    status: 'healthy',
    version: '1.0.0',
    documentation: '/docs',
    endpoints: '/api/v1',
  });
});

app.get('/api/v1/health', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    aiEngine: 'Groq (openai/gpt-oss-120b & qwen/qwen3.8-27b)',
    environment: c.env?.ENVIRONMENT || 'development',
  });
});

// Brand & Workspaces
app.get('/api/v1/brands', (c) => {
  return c.json({ data: [globalStore.getBrand()] });
});

app.patch('/api/v1/brands/:id', async (c) => {
  const body = await c.req.json();
  const updated = globalStore.updateBrand(body);
  return c.json({ data: updated });
});

// Guidelines
app.get('/api/v1/guidelines', (c) => {
  return c.json({ data: globalStore.getGuidelines() });
});

app.post('/api/v1/guidelines', async (c) => {
  const body = await c.req.json();
  const created = globalStore.addGuideline(body);
  globalStore.logAction('usr_alice', 'Alice Vance', 'GUIDELINE_CREATED', { id: created.id, title: created.title });
  return c.json({ data: created }, 201);
});

// Facts
app.get('/api/v1/facts', (c) => {
  return c.json({ data: globalStore.getFacts() });
});

app.post('/api/v1/facts', async (c) => {
  const body = await c.req.json();
  const created = globalStore.addFact(body);
  return c.json({ data: created }, 201);
});

// Terminology
app.get('/api/v1/terminology', (c) => {
  return c.json({ data: globalStore.getTerminology() });
});

app.post('/api/v1/terminology', async (c) => {
  const body = await c.req.json();
  const created = globalStore.addTerminology(body);
  return c.json({ data: created }, 201);
});

// Claims
app.get('/api/v1/claims', (c) => {
  return c.json({ data: globalStore.getClaims() });
});

app.post('/api/v1/claims', async (c) => {
  const body = await c.req.json();
  const created = globalStore.addClaim(body);
  return c.json({ data: created }, 201);
});

// Brand Assets
app.get('/api/v1/assets', (c) => {
  return c.json({ data: globalStore.getAssets() });
});

app.post('/api/v1/assets', async (c) => {
  const body = await c.req.json();
  const created = globalStore.addAsset(body);
  return c.json({ data: created }, 201);
});

// Content Items
app.get('/api/v1/content', (c) => {
  return c.json({ data: globalStore.getContentItems() });
});

app.get('/api/v1/content/:id', (c) => {
  const item = globalStore.getContentItem(c.req.param('id'));
  if (!item) return c.json({ error: 'Content not found' }, 404);
  const findings = globalStore.getFindings(item.id);
  const comments = globalStore.getComments(item.id);
  return c.json({ data: { ...item, findings, comments } });
});

app.post('/api/v1/content', async (c) => {
  const body = await c.req.json();
  const parsed = createContentSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: 'Validation failed', details: parsed.error.issues }, 400);
  }

  const created = globalStore.createContentItem({
    brandId: parsed.data.brandId,
    authorId: 'usr_clara',
    authorName: 'Clara Oswald',
    title: parsed.data.title,
    contentType: parsed.data.contentType,
    rawContent: parsed.data.rawContent,
    mediaUrl: parsed.data.mediaUrl,
    targetAudience: parsed.data.targetAudience,
    targetChannel: parsed.data.targetChannel,
  });

  return c.json({ data: created }, 201);
});

app.patch('/api/v1/content/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  const updated = globalStore.updateContent(id, body);
  if (!updated) return c.json({ error: 'Content not found' }, 404);
  return c.json({ data: updated });
});

// Content Scan via BrandVault AI
app.post('/api/v1/content/scan', async (c) => {
  const body = await c.req.json();
  const parsed = scanContentSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: 'Validation failed', details: parsed.error.issues }, 400);
  }

  const content = globalStore.getContentItem(parsed.data.contentItemId);
  if (!content) return c.json({ error: 'Content not found' }, 404);

  const brand = globalStore.getBrand();
  const rawText = parsed.data.contentOverride !== undefined ? parsed.data.contentOverride : content.rawContent;

  const report = await runBrandVaultInspection(c.env, {
    contentItemId: content.id,
    versionNumber: content.currentVersion,
    rawContent: rawText,
    contentType: content.contentType,
    mediaUrl: parsed.data.mediaUrl || content.mediaUrl,
    targetAudience: content.targetAudience,
    targetChannel: content.targetChannel,
    brandName: brand.name,
    toneKeywords: brand.toneKeywords,
    restrictedTopics: brand.restrictedTopics,
    guidelines: globalStore.getGuidelines(),
    terminologyRules: globalStore.getTerminology(),
    approvedFacts: globalStore.getFacts(),
    approvedClaims: globalStore.getClaims(),
  });

  // Save findings and update content item score
  globalStore.setFindings(content.id, report.findings);
  globalStore.updateContent(content.id, {
    rawContent: rawText,
    complianceScore: report.overallScore,
    status: report.overallScore >= 90 ? 'ready_for_review' : 'changes_requested',
  });

  globalStore.logAction('system_ai', 'BrandVault AI', 'CONTENT_SCANNED', {
    contentId: content.id,
    score: report.overallScore,
    findingsCount: report.findings.length,
    model: report.aiModelUsed,
  });

  return c.json({ data: report });
});

// Findings
app.get('/api/v1/content/:id/findings', (c) => {
  const findings = globalStore.getFindings(c.req.param('id'));
  return c.json({ data: findings });
});

app.patch('/api/v1/findings/:id', async (c) => {
  const body = await c.req.json();
  const parsed = resolveFindingSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: 'Validation failed', details: parsed.error.issues }, 400);
  }

  const updated = globalStore.updateFindingStatus(
    parsed.data.findingId, 
    parsed.data.decision, 
    parsed.data.resolutionNote
  );
  if (!updated) return c.json({ error: 'Finding not found' }, 404);

  return c.json({ data: updated });
});

// Comments & Review
app.get('/api/v1/content/:id/comments', (c) => {
  return c.json({ data: globalStore.getComments(c.req.param('id')) });
});

app.post('/api/v1/content/:id/comments', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  if (!body.text) return c.json({ error: 'Comment text required' }, 400);

  const comment = globalStore.addComment(id, {
    contentItemId: id,
    findingId: body.findingId,
    authorId: body.authorId || 'usr_bob',
    authorName: body.authorName || 'Bob Chen',
    authorRole: body.authorRole || 'manager',
    text: body.text,
    resolved: false,
  });

  return c.json({ data: comment }, 201);
});

// Approval Decision with Cryptographic Seal
app.post('/api/v1/reviews/decision', async (c) => {
  const body = await c.req.json();
  const parsed = approvalDecisionSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: 'Validation failed', details: parsed.error.issues }, 400);
  }

  const seal = `BV-SEAL-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

  const decision = globalStore.recordApproval({
    id: `appr_${Date.now()}`,
    contentItemId: parsed.data.contentItemId,
    versionNumber: parsed.data.versionNumber,
    reviewerId: 'usr_alice',
    reviewerName: 'Alice Vance (Compliance Director)',
    decision: parsed.data.decision,
    feedback: parsed.data.feedback,
    cryptographicSeal: seal,
    timestamp: new Date().toISOString(),
  });

  return c.json({ data: decision });
});

// Governance Analytics
app.get('/api/v1/analytics/overview', (c) => {
  return c.json({ data: globalStore.getGovernanceMetrics() });
});

// Audit Logs
app.get('/api/v1/audit-logs', (c) => {
  return c.json({ data: globalStore.getAuditLogs() });
});

// AI Disclosure & Responsible Governance Notice
app.get('/api/v1/ai-disclosure', (c) => {
  return c.json({
    data: {
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
    }
  });
});

export default app;
