#!/usr/bin/env node

/**
 * Universal WebDev Skills Security Scanner (scan-skills)
 * Scans all skills, playbooks, templates, checklists, adapters, reference-projects,
 * and root documentation for prompt injection vectors, dangerous shell execution
 * patterns (e.g. curl | bash), remote exfiltration, or disabled security controls.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.join(__dirname, '..');
const SCAN_DIRS = ['skills', 'playbooks', 'templates', 'checklists', 'adapters', 'reference-projects'];

// Dangerous execution and injection regex patterns
const RISKY_PATTERNS = [
  { name: 'Remote code piped to shell', regex: /curl\s+[^|\n]+\|\s*(sh|bash|zsh)/i },
  { name: 'Wget piped to shell', regex: /wget\s+[^|\n]+\|\s*(sh|bash|zsh)/i },
  { name: 'Disabled TLS verification', regex: /NODE_TLS_REJECT_UNAUTHORIZED\s*=\s*['"]?0['"]?/i },
  { name: 'Insecure curl flag', regex: /curl\s+-[a-zA-Z]*k/i },
  { name: 'Prompt injection override', regex: /(ignore\s+all\s+previous\s+instructions|disregard\s+system\s+prompt|bypass\s+safety\s+filters)/i },
  { name: 'Remote payload download into eval', regex: /eval\s*\(\s*await\s+fetch/i }
];

let violationCount = 0;

function scanDirectory(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      scanDirectory(fullPath);
    } else if (entry.isFile() && (entry.name.endsWith('.md') || entry.name.endsWith('.js') || entry.name.endsWith('.json'))) {
      scanFile(fullPath);
    }
  }
}

function scanFile(filePath) {
  const relativePath = path.relative(REPO_ROOT, filePath);
  // Skip this scanner itself and AI failure modes catalogue (which discusses anti-patterns)
  if (relativePath.includes('scan-skills.js') || relativePath.includes('AI-FAILURE-MODES.md')) {
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');

  RISKY_PATTERNS.forEach(pattern => {
    if (pattern.regex.test(content)) {
      console.error(`[SECURITY VIOLATION] ${relativePath}: Detected "${pattern.name}"`);
      violationCount++;
    }
  });
}

function runScanner() {
  console.log('=== Scanning Skills, Playbooks, Checklists, Adapters & Projects for Security Invariants ===\n');

  SCAN_DIRS.forEach(dir => {
    const targetDir = path.join(REPO_ROOT, dir);
    if (fs.existsSync(targetDir)) {
      scanDirectory(targetDir);
    }
  });

  // Scan root markdown and js files
  fs.readdirSync(REPO_ROOT).forEach(file => {
    if (file.endsWith('.md') || (file.endsWith('.js') && file !== 'scan-skills.js')) {
      scanFile(path.join(REPO_ROOT, file));
    }
  });

  if (violationCount > 0) {
    console.error(`\nSecurity Scan FAILED: ${violationCount} unsafe pattern(s) detected.`);
    process.exit(1);
  } else {
    console.log('Security Invariants Scan: 0 violations found. Repository is clean: PASS\n');
  }
}

runScanner();
