#!/usr/bin/env node

/**
 * Universal WebDev Skills AI Hygiene & Artifact Control Linter
 * Scans the codebase for:
 * 1. AI Garbage Code: Placeholder comments, half-baked implementations, trivial wrappers.
 * 2. AI Unnecessary Folders: Empty directories and deeply nested folder sprawl.
 * 3. Artifact Littering: Stray temporary files or unauthorized markdown dumps outside approved schemas.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.join(__dirname, '..');
const IGNORED_DIRS = new Set(['.git', 'node_modules', '.gemini']);

const ALLOWED_ROOT_MD = new Set([
  'README.md',
  'AGENTS.md',
  'CONTRIBUTING.md',
  'CODE_OF_CONDUCT.md',
  'SECURITY.md',
  'CHANGELOG.md',
  'PROGRESS.md',
  'DECISIONS.md',
  'SOURCES.md',
  'GLOSSARY.md',
  'AI-FAILURE-MODES.md',
  'chat-paste-in.md'
]);

const GARBAGE_CODE_PATTERNS = [
  { name: 'Placeholder TODO comment', regex: /\/\/\s*(TODO:?\s*implement|Implement\s+(logic|here|method)|fixme\s*later|placeholder)/i },
  { name: 'HTML placeholder comment', regex: /<!--\s*(TODO|Add\s+content\s+here|placeholder)\s*-->/i }
];

const TEMPORARY_FILE_PATTERNS = [
  /\.(tmp|bak|swp|orig)$/i,
  /^(temp|scratch|test-dump|notes)\.(js|ts|json|md|txt)$/i
];

let violations = 0;

function checkFileHygiene(filePath) {
  const relPath = path.relative(REPO_ROOT, filePath);
  const baseName = path.basename(filePath);

  // 1. Check for temporary or scratch files
  for (const pat of TEMPORARY_FILE_PATTERNS) {
    if (pat.test(baseName)) {
      console.error(`[ARTIFACT LITTER] ${relPath}: Unauthorized temporary/scratch file detected.`);
      violations++;
    }
  }

  // 2. Check root markdown whitelist
  if (path.dirname(filePath) === REPO_ROOT && baseName.endsWith('.md')) {
    if (!ALLOWED_ROOT_MD.has(baseName)) {
      console.error(`[ARTIFACT SPRAWL] Stray root document "${baseName}" detected. Move to appropriate directory or remove.`);
      violations++;
    }
  }

  // 3. Check for AI Garbage Code in source files (exclude tests/eval tasks)
  if (filePath.endsWith('.js') || filePath.endsWith('.ts') || filePath.endsWith('.html')) {
    // Skip this linter itself and failure modes doc
    if (relPath.includes('lint-ai-hygiene.js') || relPath.includes('AI-FAILURE-MODES.md')) {
      return;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    for (const pat of GARBAGE_CODE_PATTERNS) {
      if (pat.regex.test(content)) {
        console.error(`[AI GARBAGE CODE] ${relPath}: Detected "${pat.name}"`);
        violations++;
      }
    }
  }
}

function traverseDirectory(dirPath, depth = 0) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  // Check for empty directories
  if (entries.length === 0 && depth > 0) {
    const relDir = path.relative(REPO_ROOT, dirPath);
    console.error(`[UNNECESSARY FOLDER] Empty directory detected: ${relDir}`);
    violations++;
    return;
  }

  // Check for excessive directory nesting (> 5 levels deep)
  if (depth > 5) {
    const relDir = path.relative(REPO_ROOT, dirPath);
    console.error(`[FOLDER SPRAWL] Deeply nested directory hierarchy (> 5 levels): ${relDir}`);
    violations++;
  }

  for (const entry of entries) {
    if (IGNORED_DIRS.has(entry.name)) continue;

    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      traverseDirectory(fullPath, depth + 1);
    } else if (entry.isFile()) {
      checkFileHygiene(fullPath);
    }
  }
}

function runAiHygieneAudit() {
  console.log('=== Universal WebDev Skills AI Hygiene & Artifact Control Linter ===\n');

  traverseDirectory(REPO_ROOT, 0);

  if (violations > 0) {
    console.error(`\nAI Hygiene Linter FAILED: ${violations} violation(s) detected.`);
    process.exit(1);
  } else {
    console.log('AI Hygiene & Artifact Control: 0 violations found. Codebase is clean: PASS\n');
  }
}

runAiHygieneAudit();

