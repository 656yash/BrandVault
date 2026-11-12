-- BrandVault Cloudflare D1 Database Schema
-- Multi-tenant Brand Governance & Compliance Platform

CREATE TABLE IF NOT EXISTS organizations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    plan TEXT DEFAULT 'enterprise',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('admin', 'compliance_officer', 'manager', 'creator')),
    avatar_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(organization_id) REFERENCES organizations(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS brand_workspaces (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    primary_color TEXT DEFAULT '#4F46E5',
    secondary_color TEXT DEFAULT '#06B6D4',
    accent_color TEXT DEFAULT '#10B981',
    logo_url TEXT,
    tone_keywords TEXT, -- comma-separated or JSON
    restricted_topics TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(organization_id) REFERENCES organizations(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS guidelines (
    id TEXT PRIMARY KEY,
    brand_id TEXT NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK(category IN ('tone', 'terminology', 'claims', 'visual', 'accessibility', 'legal')),
    description TEXT,
    rules_json TEXT,
    version INTEGER DEFAULT 1,
    status TEXT DEFAULT 'active' CHECK(status IN ('active', 'archived')),
    effective_date TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(brand_id) REFERENCES brand_workspaces(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS approved_facts (
    id TEXT PRIMARY KEY,
    brand_id TEXT NOT NULL,
    fact_key TEXT NOT NULL,
    statement TEXT NOT NULL,
    category TEXT NOT NULL,
    verified_source TEXT,
    verified_date TEXT,
    expiration_date TEXT,
    FOREIGN KEY(brand_id) REFERENCES brand_workspaces(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS terminology_rules (
    id TEXT PRIMARY KEY,
    brand_id TEXT NOT NULL,
    prohibited_term TEXT NOT NULL,
    preferred_term TEXT NOT NULL,
    reason TEXT NOT NULL,
    category TEXT NOT NULL,
    severity TEXT NOT NULL CHECK(severity IN ('critical', 'warning', 'suggestion')),
    FOREIGN KEY(brand_id) REFERENCES brand_workspaces(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS approved_claims (
    id TEXT PRIMARY KEY,
    brand_id TEXT NOT NULL,
    claim_text TEXT NOT NULL,
    substantiation_evidence TEXT NOT NULL,
    authorized_channels TEXT,
    expires_at TEXT,
    approved_by TEXT,
    FOREIGN KEY(brand_id) REFERENCES brand_workspaces(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS brand_assets (
    id TEXT PRIMARY KEY,
    brand_id TEXT NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('logo', 'color_palette', 'font', 'template', 'guideline_document')),
    file_url TEXT NOT NULL,
    metadata_json TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(brand_id) REFERENCES brand_workspaces(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS content_items (
    id TEXT PRIMARY KEY,
    brand_id TEXT NOT NULL,
    author_id TEXT NOT NULL,
    author_name TEXT NOT NULL,
    title TEXT NOT NULL,
    content_type TEXT NOT NULL,
    target_audience TEXT,
    target_channel TEXT,
    status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'scanning', 'changes_requested', 'ready_for_review', 'approved', 'rejected')),
    current_version INTEGER DEFAULT 1,
    raw_content TEXT NOT NULL,
    media_url TEXT,
    compliance_score INTEGER,
    assigned_reviewer_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(brand_id) REFERENCES brand_workspaces(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS content_versions (
    id TEXT PRIMARY KEY,
    content_item_id TEXT NOT NULL,
    version_number INTEGER NOT NULL,
    raw_content TEXT NOT NULL,
    media_url TEXT,
    change_notes TEXT,
    author_id TEXT NOT NULL,
    compliance_score INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(content_item_id) REFERENCES content_items(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS compliance_findings (
    id TEXT PRIMARY KEY,
    content_item_id TEXT NOT NULL,
    version_number INTEGER NOT NULL,
    agent_type TEXT NOT NULL,
    issue TEXT NOT NULL,
    category TEXT NOT NULL,
    severity TEXT NOT NULL CHECK(severity IN ('critical', 'warning', 'suggestion')),
    content_excerpt TEXT NOT NULL,
    position_json TEXT,
    guideline_reference TEXT NOT NULL,
    guideline_id TEXT,
    evidence TEXT NOT NULL,
    confidence REAL NOT NULL,
    suggested_correction TEXT NOT NULL,
    status TEXT DEFAULT 'open' CHECK(status IN ('open', 'accepted', 'rejected', 'resolved')),
    human_resolution_note TEXT,
    requires_human_review BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(content_item_id) REFERENCES content_items(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS analysis_reports (
    id TEXT PRIMARY KEY,
    content_item_id TEXT NOT NULL,
    version_number INTEGER NOT NULL,
    overall_score INTEGER NOT NULL,
    tone_score INTEGER NOT NULL,
    terminology_score INTEGER NOT NULL,
    factual_accuracy_score INTEGER NOT NULL,
    claims_legality_score INTEGER NOT NULL,
    visual_a11y_score INTEGER NOT NULL,
    summary TEXT NOT NULL,
    findings_json TEXT NOT NULL,
    ai_model_used TEXT NOT NULL,
    execution_duration_ms INTEGER NOT NULL,
    ai_disclosure_json TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(content_item_id) REFERENCES content_items(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS review_comments (
    id TEXT PRIMARY KEY,
    content_item_id TEXT NOT NULL,
    finding_id TEXT,
    author_id TEXT NOT NULL,
    author_name TEXT NOT NULL,
    author_role TEXT NOT NULL,
    text TEXT NOT NULL,
    resolved BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(content_item_id) REFERENCES content_items(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS approvals (
    id TEXT PRIMARY KEY,
    content_item_id TEXT NOT NULL,
    version_number INTEGER NOT NULL,
    reviewer_id TEXT NOT NULL,
    reviewer_name TEXT NOT NULL,
    decision TEXT NOT NULL CHECK(decision IN ('approved', 'changes_requested', 'rejected')),
    feedback TEXT,
    cryptographic_seal TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(content_item_id) REFERENCES content_items(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL,
    brand_id TEXT NOT NULL,
    actor_id TEXT NOT NULL,
    actor_name TEXT NOT NULL,
    action TEXT NOT NULL,
    details_json TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
