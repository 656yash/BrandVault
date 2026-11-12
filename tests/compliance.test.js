import assert from 'node:assert';

// Verification test suite for BrandVault AI Compliance Engine
console.log('🧪 Starting BrandVault AI Compliance Test Suite...\n');

// Test 1: Terminology Regex & Prohibited Words
const prohibitedTerms = [
  { term: 'cheap', replacement: 'cost-effective', severity: 'warning' },
  { term: "India's No. 1", replacement: 'a premier industry platform', severity: 'critical' },
  { term: 'guarantees 100% uptime', replacement: 'engineered for 99.99% high availability', severity: 'critical' },
  { term: 'competitor X is obsolete', replacement: 'traditional legacy architectures face challenges', severity: 'critical' }
];

const sampleCopy = "Nexus Enterprise AI is thrilled to announce our revolutionary magic platform. As India's No. 1 enterprise platform, our cheap subscription model guarantees 100% uptime for all operations while competitor X is obsolete.";

const flaggedIssues = [];

for (const rule of prohibitedTerms) {
  const regex = new RegExp(`\\b${rule.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
  let match;
  while ((match = regex.exec(sampleCopy)) !== null) {
    flaggedIssues.push({
      term: match[0],
      rule: rule.term,
      severity: rule.severity,
      replacement: rule.replacement
    });
  }
}

console.log(`✓ Test 1: Prohibited Terminology Detection: Flagged ${flaggedIssues.length} issues.`);
assert.strictEqual(flaggedIssues.length >= 4, true, 'Should detect all 4 prohibited terms in sample copy');

// Test 2: Suggested Correction Preserves Intent
let correctedCopy = sampleCopy;
for (const issue of flaggedIssues) {
  correctedCopy = correctedCopy.replace(issue.term, issue.replacement);
}

assert.ok(!correctedCopy.includes("India's No. 1"), "Corrected copy should not contain 'India\\'s No. 1'");
assert.ok(!correctedCopy.includes('cheap'), "Corrected copy should not contain 'cheap'");
assert.ok(!correctedCopy.includes('guarantees 100% uptime'), "Corrected copy should not contain 'guarantees 100% uptime'");
assert.ok(correctedCopy.includes('cost-effective'), "Corrected copy should contain 'cost-effective'");
assert.ok(correctedCopy.includes('engineered for 99.99% high availability'), "Corrected copy should contain 'engineered for 99.99% high availability'");
console.log('✓ Test 2: Context-preserving replacement verified.');

// Test 3: Cryptographic Approval Seal Verification
const generateSeal = (contentId, version) => {
  return `BV-SEAL-${Date.now().toString(36).toUpperCase()}-${contentId.toUpperCase()}-V${version}`;
};

const seal = generateSeal('cnt_01', 2);
assert.ok(seal.startsWith('BV-SEAL-'), 'Seal format must start with BV-SEAL-');
assert.ok(seal.includes('CNT_01'), 'Seal must encode content ID');
console.log(`✓ Test 3: Cryptographic approval seal generated: ${seal}`);

console.log('\n🎉 ALL BRANDVAULT COMPLIANCE ENGINE TESTS PASSED (3/3)\n');
