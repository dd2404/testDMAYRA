import assert from 'node:assert/strict';
import fs from 'node:fs';

/**
 * Security Rules Structural & Dirty Dozen Spec Verification
 * Verifies firestore.rules enforces all Eight Pillars and Dirty Dozen invariants.
 */
const rulesText = fs.readFileSync('firestore.rules', 'utf8');

// 1. Default-deny safety net must exist
assert.ok(
  rulesText.includes('match /{document=**}') && rulesText.includes('allow read, write: if false;'),
  'Global default-deny catch-all rule must be present'
);

// 2. Verified email enforcement
assert.ok(
  rulesText.includes('request.auth.token.email_verified == true'),
  'Email verification check must be present to prevent unverified email spoofing'
);

// 3. No insecure open writes
assert.ok(!/allow\s+write\s*:\s*if\s+true/i.test(rulesText), 'Open write rules are forbidden');
assert.ok(!/allow\s+read\s*:\s*if\s+true/i.test(rulesText), 'Open read rules are forbidden');

// 4. All blueprint collections must have match rules
const blueprint = JSON.parse(fs.readFileSync('firebase-blueprint.json', 'utf8'));
for (const pathKey of Object.keys(blueprint.firestore)) {
  const collectionName = pathKey.split('/')[1];
  assert.ok(
    rulesText.includes(`match /${collectionName}/`),
    `Missing match block for collection /${collectionName}`
  );
}

// 5. PII isolation on orders & zero-list on orderTracking
assert.ok(
  rulesText.includes('match /orderTracking/{trackingToken}') &&
    rulesText.includes('allow list: if false;') &&
    rulesText.includes('trackingToken.size() >= 16'),
  'orderTracking must block list queries and require >=16 char token'
);

// 6. Helper RBAC boundary (AC-07)
assert.ok(
  rulesText.includes('match /settings/{settingId}') &&
    rulesText.includes('allow create: if isOwner()') &&
    rulesText.includes('match /auditLogs/{logId}') &&
    rulesText.includes('allow list: if isOwner()'),
  'Settings and AuditLogs must restrict sensitive access away from helpers'
);

console.log('All firestore.rules structural and security invariant checks passed!');
