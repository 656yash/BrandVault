# BrandVault — Intelligent Brand Governance & Compliance Platform

> **BrandVault** acts as an automated enterprise Brand Compliance Officer that inspects marketing copy, press releases, social ads, and visual creatives before publication. Powered by **BrandVault AI**, it checks every piece of content against approved brand guidelines, verified corporate facts, terminology dictionaries, and design systems.

[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
[![Cloudflare D1](https://img.shields.io/badge/Cloudflare-D1_Database-F38020?logo=cloudflare&logoColor=white)](https://developers.cloudflare.com/d1/)
[![Groq API](https://img.shields.io/badge/Groq_Inference-GPT--OSS_120B-F55036)](https://groq.com/)
[![React 18](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🎯 Problem Statement
Growing organisations publish content across multiple employees, external marketing agencies, and generative AI tools. This decentralization makes it exceptionally difficult to maintain a consistent, trustworthy, and legally compliant brand identity.
- **Incorrect claims & unverified superlatives** ("#1 in India", "guarantees 100% uptime") trigger legal and regulatory liability.
- **Outdated corporate facts** and cold technical jargon degrade trust with enterprise buyers.
- **Inconsistent visual identity** and non-accessible creative assets breach accessibility standards (WCAG 2.1 AA).
- **Existing tools** (like generic grammar checkers) simply reject text without explaining *why* or how to fix it while preserving the creator's original intent.

---

## 🚀 The Solution: BrandVault AI

BrandVault intercepts content *before* publication. Instead of arbitrary rejections, it provides **explainable findings**, maps infractions to exact corporate guidelines, and offers **one-click context-preserving corrections**.

### The Three Signature Improvements (Hackathon Commitment)
1. **Evidence-Backed Multi-Agent Findings**: Every violation cites the exact active brand policy, corporate fact source, or legal regulation.
2. **Human-Controlled Correction & Sign-Off Workflow**: Creators can accept AI suggestions with one click; authorized managers issue cryptographic approval seals (`BV-SEAL-XXXX`).
3. **Multimodal Brand & Visual Inspection**: Evaluates both written copy and uploaded creative images (color palettes, logo clear space, WCAG contrast).

---

## 🏛️ Multi-Agent Compliance Engine

BrandVault orchestrates six specialized compliance agents:

| Agent | Responsibility | Example Flagged Issue |
|---|---|---|
| **Tone & Voice Agent** | Brand persona, empathy, technical credibility | Flags "revolutionary magic" (hyperbole) |
| **Terminology Agent** | Prohibited words & dictionary enforcement | Flags "cheap" &rarr; suggests "cost-effective" |
| **Fact Verification Agent** | Cross-references against verified facts | Flags incorrect founding year or region counts |
| **Claim Substantiation Agent** | Detects unverified superlatives & absolute SLAs | Flags "India's No. 1" without audit proof |
| **Visual & Accessibility Agent** | Palette adherence, logo padding, WCAG 2.1 AA | Flags contrast failures and missing alt text |
| **Governance & Risk Agent** | Aggregates violation scores into Brand Health Score | Computes 0–100 score and gating status |

---

## ⚡ Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide React, Recharts.
- **Backend / API**: Cloudflare Workers, Hono, TypeScript, Zod.
- **Database & Storage**: Cloudflare D1 (Relational SQLite), Cloudflare R2 (Asset storage), Cloudflare Vectorize.
- **AI Inference**: Groq API (`openai/gpt-oss-120b` for deep reasoning, `qwen/qwen3.8-27b` for fast fallback).
- **Security & Privacy**: Zero-Data Retention model, Tenant Isolation, Immutable Audit Trails.

---

## 📦 Project Structure

```
BrandVault/
├── apps/
│   └── web/                   # React + Vite frontend application
│       ├── src/
│       │   ├── components/    # Navbar, Sidebar, AIDisclosureModal
│       │   ├── pages/         # Dashboard, ContentStudio, ReviewWorkspace,
│       │   │                  # BrandKnowledge, GovernanceAnalytics, AuditTransparency
│       │   ├── services/      # API client & local fallback
│       │   └── App.tsx        # Application orchestrator
├── workers/
│   └── api/                   # Cloudflare Worker API
│       ├── src/
│       │   ├── ai/            # Groq client & Multi-Agent Inspection Engine
│       │   ├── services/      # In-memory store & D1 integration
│       │   └── index.ts       # Hono API routes
│       └── wrangler.jsonc     # Cloudflare Workers configuration
├── packages/
│   └── shared/                # Shared TypeScript types & Zod schemas
├── database/
│   ├── schema.sql             # Cloudflare D1 database schema
│   └── seed.sql               # Enterprise seed data
├── docs/                      # Architectural & hackathon documentation
├── tests/
│   └── compliance.test.js     # Verification test suite
└── package.json               # Monorepo workspace configuration
```

---

## 🛠️ Quickstart & Local Development

### Prerequisites
- Node.js 20+ LTS
- npm 10+
- (Optional) Cloudflare Wrangler CLI

### 1. Installation
```bash
git clone https://github.com/656yash/BrandVault.git
cd BrandVault
npm install
```

### 2. Run Test Suite
```bash
npm test
```

### 3. Build Entire Monorepo
```bash
npm run build
```

### 4. Start Local Development
```bash
# Start frontend (React + Vite on http://localhost:5173)
npm run dev

# (Optional) Start Cloudflare Worker API on http://localhost:8787
npm run dev:worker
```

---

## 🔒 Responsible AI & Zero-Retention Security

1. **Confidentiality**: Customer brand collateral and draft marketing materials are processed in-memory and are never stored or used to train third-party models.
2. **Human Control**: The AI engine assists and flags, but cannot auto-publish content. Approval authority is strictly reserved for human reviewers.
3. **Auditability**: Every guideline update, scan execution, and reviewer approval generates an immutable audit record with cryptographic seal hashing.

---

## 🏆 Hackathon Evaluation Summary

- **Round 1 (The Plan)**: Defined in detail in [`docs/hackathon_rounds.md`](file:///d:/Loom/docs/hackathon_rounds.md) (Problem evidence, multi-agent architecture, user personas).
- **Round 2 (The Build)**: Complete end-to-end working system with Groq AI integration, explainable findings drawer, one-click replacement, and approval workflow.
- **Round 3 (The Finish)**: Production-ready codebase, automated tests, zero-data retention disclosures, and enterprise governance dashboard.
