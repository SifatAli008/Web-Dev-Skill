#!/usr/bin/env node

/**
 * Universal WebDev Skills Reference Project Test Runner
 * Cross-platform script that executes the test suites for all 3 golden reference projects.
 */

const { execSync } = require('child_process');
const path = require('path');

const REPO_ROOT = path.join(__dirname, '..');
const PROJECTS = [
  '01-saas-starter-mvp',
  '02-ecommerce-api-prod',
  '03-content-platform-scale'
];

let failed = false;

console.log('=== Running All Golden Reference Project Test Suites ===\n');

for (const proj of PROJECTS) {
  const testFile = path.join(REPO_ROOT, 'reference-projects', proj, 'test.js');
  console.log(`>>> Testing ${proj}...`);
  try {
    const output = execSync(`node "${testFile}"`, { encoding: 'utf8', stdio: 'inherit' });
  } catch (err) {
    console.error(`[FAIL] ${proj} tests failed!`);
    failed = true;
  }
}

if (failed) {
  console.error('\nReference Project Test Run: FAILED\n');
  process.exit(1);
} else {
  console.log('\nAll 3 Reference Projects PASSED with 0 critical findings: SUCCESS\n');
}

