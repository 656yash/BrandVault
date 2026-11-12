# BrandVault — Project Instructions & AI Rules

## Product Overview
BrandVault (BrandVault AI) is an enterprise-grade, intelligent brand-governance and compliance platform. It acts as an automated Brand Compliance Officer that reviews content (text, documents, marketing copy, and visual creative assets) before publication. It verifies content against approved brand guidelines, verified company facts, terminology dictionaries, marketing claims, and design systems.

## Key Principles & Guardrails
1. **Explainable Findings**: Never simply flag or reject content without clear reasoning. Every finding must reference the exact violated guideline/source, provide confidence and severity levels, and suggest a context-preserving correction.
2. **Human Control Over Decisions**: BrandVault AI assists and flags, but never auto-publishes or silences human judgment. Reviewers and creators retain full authority over approvals, revisions, and overrides.
3. **Multi-Agent Compliance Engine**:
   - **Tone Agent**: Analyzes brand voice, tone, and communication style.
   - **Terminology Agent**: Detects banned, discouraged, or competitor terminology and recommends preferred replacements.
   - **Fact Agent**: Cross-references claims with approved corporate facts.
   - **Claim Agent**: Detects unsupported or exaggerated promotional claims requiring substantiation.
   - **Visual & Accessibility Agent**: Checks color palettes, logos, contrast, aspect ratios, and alt-text readability.
   - **Governance & Risk Agent**: Aggregates violation scores into a unified Brand Compliance Score (0-100).
4. **Tenant Isolation & Security**: Every organization and brand workspace operates in strict isolation. Files are stored securely and external AI usage is clearly disclosed.

## Technology Stack
- **Frontend**: React 18/19, TypeScript, Vite, Tailwind CSS, Lucide React, Recharts.
- **Backend / API**: Cloudflare Workers, Hono, TypeScript, Zod.
- **Database & Storage**: Cloudflare D1 (Relational SQLite), Cloudflare R2 (Object storage for assets & documents), Cloudflare Vectorize (Semantic guideline indexing).
- **AI Inference**: Groq API (`openai/gpt-oss-120b`, `qwen/qwen3.8-27b`) for sub-second, structured reasoning and visual inspection.
