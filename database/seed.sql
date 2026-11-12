-- BrandVault Seed Data
-- Demo Organization & Enterprise Brand Workspace

INSERT OR IGNORE INTO organizations (id, name, slug, plan)
VALUES ('org_acme', 'Acme Global Corporation', 'acme-global', 'enterprise');

INSERT OR IGNORE INTO users (id, organization_id, email, name, role, avatar_url)
VALUES 
('usr_alice', 'org_acme', 'alice.vance@acmeglobal.com', 'Alice Vance', 'admin', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120'),
('usr_bob', 'org_acme', 'bob.chen@acmeglobal.com', 'Bob Chen', 'manager', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120'),
('usr_clara', 'org_acme', 'clara.oswald@acmeglobal.com', 'Clara Oswald', 'creator', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120');

INSERT OR IGNORE INTO brand_workspaces (id, organization_id, name, description, primary_color, secondary_color, accent_color, tone_keywords, restricted_topics)
VALUES ('brand_nexus', 'org_acme', 'Nexus Enterprise AI', 'Flagship enterprise cloud intelligence and brand automation suite.', '#4F46E5', '#06B6D4', '#10B981', 'authoritative, transparent, empowering, precise, forward-looking', 'unsubstantiated claims, competitor disparagement, cryptocurrency hype');

-- Brand Guidelines
INSERT OR IGNORE INTO guidelines (id, brand_id, title, category, description, rules_json, version, status, effective_date)
VALUES 
('gl_tone_01', 'brand_nexus', 'Brand Voice & Tone Standards', 'tone', 'Nexus communicates with authoritative clarity and professional empathy.', '["Never use clickbait or fear-inducing messaging", "Maintain an approachable, technically credible voice", "Avoid excessive buzzwords (e.g., revolutionizing, magic)", "Write in active voice with clear value statements"]', 1, 'active', '2026-01-01'),
('gl_claims_01', 'brand_nexus', 'Promotional Claims Substantiation Policy', 'claims', 'Every performance or market ranking claim must cite documented benchmark evidence.', '["Never claim #1 rank without third-party audit attribution", "Do not promise absolute 100% guarantees or unvalidated metrics", "All ROI claims must specify baseline methodology", "Comparative statements must reference verified public data"]', 1, 'active', '2026-01-01'),
('gl_visual_01', 'brand_nexus', 'Visual Identity & Palette Compliance', 'visual', 'Visual assets must adhere strictly to approved color codes, minimum padding, and typography.', '["Primary brand color is #4F46E5 (Indigo) and secondary is #06B6D4 (Cyan)", "Minimum 24px clear space around primary logo", "Text contrast against background must achieve WCAG AA (4.5:1 ratio)", "Headers must use Plus Jakarta Sans; body must use Inter"]', 1, 'active', '2026-01-01'),
('gl_a11y_01', 'brand_nexus', 'Digital Accessibility & Inclusivity', 'accessibility', 'All public collateral must meet WCAG 2.1 AA standards.', '["All images must include descriptive, non-redundant alt text", "Ensure text is readable on mobile viewports without horizontal scrolling", "Avoid flashing elements or low-contrast text overlays"]', 1, 'active', '2026-01-01');

-- Approved Corporate Facts
INSERT OR IGNORE INTO approved_facts (id, brand_id, fact_key, statement, category, verified_source, verified_date)
VALUES 
('fact_founding', 'brand_nexus', 'founding_year', 'Nexus Enterprise AI was established in 2021 by enterprise infrastructure veterans.', 'corporate', 'Articles of Incorporation 2021', '2026-01-01'),
('fact_regions', 'brand_nexus', 'global_presence', 'Nexus infrastructure operates across 4 primary cloud regions: Mumbai, Singapore, Frankfurt, and San Jose.', 'product', 'Global Datacenter Operations Report Q4 2025', '2026-01-15'),
('fact_security', 'brand_nexus', 'security_certifications', 'Nexus Enterprise AI holds SOC 2 Type II certification and ISO/IEC 27001:2022 validation.', 'corporate', 'BSI Audit Certificate #ISO-99214', '2026-02-01'),
('fact_customers', 'brand_nexus', 'customer_count', 'Over 450 enterprise organizations rely on Nexus for automated workflow intelligence.', 'customer', 'Customer Operations Directory Feb 2026', '2026-02-10');

-- Terminology Rules (Dictionary)
INSERT OR IGNORE INTO terminology_rules (id, brand_id, prohibited_term, preferred_term, reason, category, severity)
VALUES 
('term_01', 'brand_nexus', 'cheap', 'cost-effective', 'Devalues premium enterprise positioning; use cost-effective or accessible instead.', 'brand_voice', 'warning'),
('term_02', 'brand_nexus', 'India''s No. 1', 'A premier industry platform', 'Unsubstantiated superlative that violates regulatory marketing guidelines without independent audit citation.', 'legal_risk', 'critical'),
('term_03', 'brand_nexus', 'guarantees 100% uptime', 'engineered for 99.99% high availability', 'Absolute guarantee incurs legal warranty liability; cite standard SLA of 99.99%.', 'legal_risk', 'critical'),
('term_04', 'brand_nexus', 'end-user', 'customer or client', 'Cold technical jargon; use customer, client, or team member for empathy.', 'brand_voice', 'suggestion'),
('term_05', 'brand_nexus', 'revolutionary magic', 'architectural breakthrough', 'Hyperbolic puffery damages technical credibility with enterprise CTO buyers.', 'brand_voice', 'warning'),
('term_06', 'brand_nexus', 'competitor X is obsolete', 'modern cloud-native approach', 'Disparaging competitor claims violate antitrust and advertising ethics.', 'competitor', 'critical');

-- Approved Claims
INSERT OR IGNORE INTO approved_claims (id, brand_id, claim_text, substantiation_evidence, authorized_channels, expires_at, approved_by)
VALUES 
('claim_01', 'brand_nexus', 'Accelerates content compliance review cycles by up to 65%', 'Verified via Acme Enterprise Benchmark Study Q3 2025 across 12,000 document workflows.', 'All digital & print', '2026-12-31', 'Alice Vance (Compliance Director)'),
('claim_02', 'brand_nexus', 'Zero-data retention model protects proprietary organizational brand data', 'Security whitepaper V4.2 and SOC 2 Type II privacy verification.', 'Product datasheets, Website', '2027-01-01', 'Security Board');

-- Sample Content Items
INSERT OR IGNORE INTO content_items (id, brand_id, author_id, author_name, title, content_type, target_audience, target_channel, status, current_version, raw_content, compliance_score, assigned_reviewer_id)
VALUES 
('cnt_01', 'brand_nexus', 'usr_clara', 'Clara Oswald', 'Q1 Global Product Launch Press Release', 'press_release', 'Enterprise CIOs & Marketing Directors', 'PR Newswire & Blog', 'changes_requested', 1, 
'Nexus Enterprise AI is thrilled to announce our revolutionary magic platform. As India''s No. 1 enterprise platform, our cheap subscription model guarantees 100% uptime for all operations while competitor X is obsolete. Contact us today to witness the magic for every end-user.', 
42, 'usr_bob'),

('cnt_02', 'brand_nexus', 'usr_clara', 'Clara Oswald', 'LinkedIn Campaign: Modern Brand Governance', 'social_ad', 'Content Leads & Brand Strategists', 'LinkedIn & X (Twitter)', 'approved', 2, 
'In a multi-agent era, consistent brand voice is your strongest competitive moat. Nexus Enterprise AI accelerates content compliance review cycles by up to 65%, empowering creative teams to move fast while protecting brand integrity across every customer touchpoint.', 
96, 'usr_alice');

-- Sample Findings for cnt_01
INSERT OR IGNORE INTO compliance_findings (id, content_item_id, version_number, agent_type, issue, category, severity, content_excerpt, guideline_reference, evidence, confidence, suggested_correction, status, requires_human_review)
VALUES 
('fnd_01', 'cnt_01', 1, 'claim', 'Unsupported Superlative Claim', 'claims', 'critical', 'India''s No. 1 enterprise platform', 'Promotional Claims Substantiation Policy, Section 1', 'No independent third-party market ranking audit cited. Brand policy strictly prohibits unverified #1 claims.', 0.98, 'a leading enterprise platform', 'open', 1),
('fnd_02', 'cnt_01', 1, 'fact', 'Unwarranted SLA Guarantee', 'legal', 'critical', 'guarantees 100% uptime', 'Corporate SLA & Liability Policy, Section 3.2', 'Nexus SLA commitment is engineered for 99.99% high availability. Absolute 100% uptime promise creates direct legal breach risk.', 0.99, 'engineered for 99.99% high availability', 'open', 1),
('fnd_03', 'cnt_01', 1, 'terminology', 'Disparaging Competitor Reference', 'legal_risk', 'critical', 'competitor X is obsolete', 'Terminology Standards: Fair Advertising Guidelines', 'Direct disparagement of named competitors is prohibited by brand legal guidelines.', 0.95, 'traditional legacy architectures face challenges', 'open', 1),
('fnd_04', 'cnt_01', 1, 'tone', 'Devaluing Brand Positioning Term', 'brand_voice', 'warning', 'cheap subscription model', 'Brand Voice Standards: Value Terminology', 'The word "cheap" devalues enterprise premium positioning. Preferred term is "cost-effective" or "accessible".', 0.92, 'cost-effective enterprise tier', 'open', 0),
('fnd_05', 'cnt_01', 1, 'tone', 'Hyperbolic Buzzword', 'brand_voice', 'warning', 'revolutionary magic', 'Brand Voice Standards: Style Guide', 'Exaggerated buzzwords undermine technical authority with enterprise buyers.', 0.89, 'architectural breakthrough', 'open', 0);
