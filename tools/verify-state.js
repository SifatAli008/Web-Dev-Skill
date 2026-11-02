#!/usr/bin/env node

/**
 * Universal WebDev Skills State & ADR Integrity Verifier
 * Validates that PROGRESS.md and DECISIONS.md exist, follow standard schemas,
 * and track tier classifications, active gates, and ADRs.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.join(__dirname, '..');
const PROGRESS_FILE = path.join(REPO_ROOT, 'PROGRESS.md');
const DECISIONS_FILE = path.join(REPO_ROOT, 'DECISIONS.md');

let errors = 0;

function verifyProgress() {
  if (!fs.existsSync(PROGRESS_FILE)) {
    console.error('[FAIL] PROGRESS.md missing from repository root.');
    errors++;
    return;
  }

  const content = fs.readFileSync(PROGRESS_FILE, 'utf8');

  // Check required sections
  const requiredPatterns = [
    { name: 'Current Phase header', regex: /Current Phase:/i },
    { name: 'Status header', regex: /Status:/i },
    { name: 'Last Updated timestamp', regex: /Last Updated:/i },
    { name: 'State Integrity indicator', regex: /State Integrity:/i },
    { name: 'Roadmap & Phase Gates table', regex: /##\s+Overall Roadmap & Phase Gates/i }
  ];

  requiredPatterns.forEach(pattern => {
    if (!pattern.regex.test(content)) {
      console.error(`[FAIL] PROGRESS.md missing required pattern: ${pattern.name}`);
      errors++;
    }
  });

  console.log('[PASS] PROGRESS.md satisfies state tracking requirements.');
}

function verifyDecisions() {
  if (!fs.existsSync(DECISIONS_FILE)) {
    console.error('[FAIL] DECISIONS.md missing from repository root.');
    errors++;
    return;
  }

  const content = fs.readFileSync(DECISIONS_FILE, 'utf8');

  // Must have ADR records
  const adrRegex = /##\s+ADR-(\d+):\s+(.+)/g;
  let match;
  let adrCount = 0;

  while ((match = adrRegex.exec(content)) !== null) {
    adrCount++;
  }

  if (adrCount === 0) {
    console.error('[FAIL] DECISIONS.md contains zero ADR records.');
    errors++;
    return;
  }

  // Ensure every ADR has Status, Context, Decision, Consequences
  const adrBlocks = content.split(/##\s+ADR-\d+:/).slice(1);
  adrBlocks.forEach((block, idx) => {
    const num = String(idx + 1).padStart(3, '0');
    if (!/-\s+\*\*Status:\*\*/i.test(block)) {
      console.error(`[FAIL] ADR-${num} missing Status section.`);
      errors++;
    }
    if (!/-\s+\*\*Context:\*\*/i.test(block)) {
      console.error(`[FAIL] ADR-${num} missing Context section.`);
      errors++;
    }
    if (!/-\s+\*\*Decision:\*\*/i.test(block)) {
      console.error(`[FAIL] ADR-${num} missing Decision section.`);
      errors++;
    }
    if (!/-\s+\*\*Consequences:\*\*/i.test(block)) {
      console.error(`[FAIL] ADR-${num} missing Consequences section.`);
      errors++;
    }
  });

  console.log(`[PASS] DECISIONS.md satisfies ADR schema (${adrCount} valid ADRs audited).`);
}

function runVerifyState() {
  console.log('=== Universal WebDev Skills: Verifying Project State & ADR Records ===\n');
  verifyProgress();
  verifyDecisions();

  if (errors > 0) {
    console.error(`\nState Verification FAILED: ${errors} errors found.`);
    process.exit(1);
  } else {
    console.log('\nState & ADR Verification: SUCCESS (All records valid)\n');
  }
}

runVerifyState();

