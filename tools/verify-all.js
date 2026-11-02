#!/usr/bin/env node

/**
 * Universal WebDev Skills Master Verification Runner
 * Runs the entire automated quality suite across linters, link checkers,
 * freshness monitors, security scanners, index validators, adapter builders,
 * benchmark evaluations, and reference project test suites.
 */

const { execSync } = require('child_process');
const path = require('path');

const REPO_ROOT = path.join(__dirname, '..');

const STEPS = [
  { name: 'Skill Linters (<300 lines & structure)', cmd: 'node tools/lint-skills.js' },
  { name: 'Internal Link & Reference Checker', cmd: 'node tools/check-links.js' },
  { name: 'Skill Freshness Audit (<=180 days)', cmd: 'node tools/check-freshness.js' },
  { name: 'Security Invariant & Injection Scanner', cmd: 'node tools/scan-skills.js' },
  { name: 'AI Garbage Code & Artifact Hygiene', cmd: 'node tools/lint-ai-hygiene.js' },
  { name: 'Repository State & ADR Integrity', cmd: 'node tools/verify-state.js' },
  { name: 'Router Index (skills.index.json) Sync', cmd: 'node tools/validate-index.js' },
  { name: 'Tool Adapters Generator', cmd: 'node tools/build-adapters.js' },
  { name: 'Documentation Portal Generator', cmd: 'node tools/generate-docs-skills.js' },
  { name: 'Benchmark Evaluation Suite', cmd: 'node evals/harness/run-eval.js' },
  { name: '3 Golden Reference Project Suites', cmd: 'node tools/run-reference-tests.js' }
];

console.log('=================================================================');
console.log('   UNIVERSAL WEBDEV SKILLS: FULL MASTER VERIFICATION SUITE       ');
console.log('=================================================================\n');

const startTime = Date.now();
const results = [];
let allPassed = true;

for (const step of STEPS) {
  process.stdout.write(`>>> Running: ${step.name}... `);
  const stepStart = Date.now();
  try {
    execSync(step.cmd, { cwd: REPO_ROOT, stdio: 'pipe' });
    const duration = ((Date.now() - stepStart) / 1000).toFixed(2);
    console.log(`[PASS] (${duration}s)`);
    results.push({ name: step.name, status: 'PASS', duration: `${duration}s` });
  } catch (err) {
    console.log(`[FAIL]`);
    console.error(err.stdout ? err.stdout.toString() : err.message);
    results.push({ name: step.name, status: 'FAIL' });
    allPassed = false;
    break;
  }
}

const totalDuration = ((Date.now() - startTime) / 1000).toFixed(2);

console.log('\n=================================================================');
console.log('                   VERIFICATION SUMMARY DASHBOARD                ');
console.log('=================================================================');
results.forEach(r => {
  const padName = r.name.padEnd(48, '.');
  console.log(`${padName} [${r.status}] ${r.duration || ''}`);
});
console.log('-----------------------------------------------------------------');
console.log(`Total Verification Execution Time: ${totalDuration}s`);
console.log(`Overall System Status: ${allPassed ? 'ALL CHECKS PASSED (100% READY)' : 'FAILED'}`);
console.log('=================================================================\n');

if (!allPassed) {
  process.exit(1);
}

