#!/usr/bin/env node

/**
 * Universal WebDev Skills Link & Tool Reference Checker
 * Validates that:
 * 1. All internal markdown file links resolve to real files on disk.
 * 2. All backticked relative file references exist.
 * 3. All CLI tool invocations (`node tools/<script>.js`) reference existing tool files.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.join(__dirname, '..');
const DIRS_TO_SCAN = ['skills', 'playbooks', 'templates', 'checklists', 'adapters', 'evals'];
let brokenLinkCount = 0;
let totalLinksChecked = 0;

function checkLinksInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const fileDir = path.dirname(filePath);

  // 1. Match markdown links: [text](path)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;

  while ((match = linkRegex.exec(content)) !== null) {
    const rawLink = match[2].trim();
    if (rawLink.startsWith('http://') || rawLink.startsWith('https://') || rawLink.startsWith('#') || rawLink.startsWith('mailto:')) {
      continue;
    }

    let cleanLink = rawLink.replace(/^file:\/\/\/?([a-zA-Z]:)?/, '').split('#')[0];
    cleanLink = decodeURIComponent(cleanLink);
    if (!cleanLink) continue;

    totalLinksChecked++;
    // First try resolving relative to the file's directory
    let resolvedPath = path.resolve(fileDir, cleanLink);
    // If not found, try resolving relative to repository root
    if (!fs.existsSync(resolvedPath)) {
      resolvedPath = path.resolve(REPO_ROOT, cleanLink.replace(/^[/\\]+/, ''));
    }

    if (!fs.existsSync(resolvedPath)) {
      console.error(`[BROKEN LINK] In ${path.relative(REPO_ROOT, filePath)}: "${rawLink}" does not exist at ${resolvedPath}`);
      brokenLinkCount++;
    }
  }

  // 2. Match backticked relative file references (e.g. `templates/schemas/prd.schema.json`)
  const backtickRegex = /`((?:skills|templates|checklists|playbooks|tools)\/[a-zA-Z0-9_\-\./]+\.(?:md|json|js))`/g;
  while ((match = backtickRegex.exec(content)) !== null) {
    const relFile = match[1];
    totalLinksChecked++;
    const resolvedPath = path.join(REPO_ROOT, relFile);
    if (!fs.existsSync(resolvedPath)) {
      console.error(`[BROKEN REFERENCE] In ${path.relative(REPO_ROOT, filePath)}: \`${relFile}\` not found on disk.`);
      brokenLinkCount++;
    }
  }

  // 3. Match CLI tool invocations (e.g. `node tools/<script>.js`)
  const nodeToolRegex = /(?:node|bash|sh)\s+tools\/([a-zA-Z0-9_\-\.]+\.js)/g;
  while ((match = nodeToolRegex.exec(content)) !== null) {
    const toolRel = path.join('tools', match[1]);
    totalLinksChecked++;
    const resolvedPath = path.join(REPO_ROOT, toolRel);
    if (!fs.existsSync(resolvedPath)) {
      console.error(`[BROKEN TOOL COMMAND] In ${path.relative(REPO_ROOT, filePath)}: "node ${toolRel}" does not exist on disk.`);
      brokenLinkCount++;
    }
  }
}

function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDir(fullPath);
    } else if (entry.isFile() && (entry.name.endsWith('.md') || entry.name.endsWith('.mdc'))) {
      checkLinksInFile(fullPath);
    }
  }
}

function runCheckLinks() {
  console.log('=== Checking Internal File References & Links ===\n');

  DIRS_TO_SCAN.forEach(dir => {
    const fullPath = path.join(REPO_ROOT, dir);
    if (fs.existsSync(fullPath)) {
      scanDir(fullPath);
    }
  });

  fs.readdirSync(REPO_ROOT).forEach(file => {
    if (file.endsWith('.md')) {
      checkLinksInFile(path.join(REPO_ROOT, file));
    }
  });

  // Also check generator scripts that produce CLI commands for docs
  const docGenFile = path.join(REPO_ROOT, 'tools', 'generate-docs-skills.js');
  if (fs.existsSync(docGenFile)) {
    checkLinksInFile(docGenFile);
  }

  console.log(`Checked ${totalLinksChecked} internal file references and CLI commands.`);
  if (brokenLinkCount > 0) {
    console.error(`\nLink Check FAILED: ${brokenLinkCount} broken links/references found.`);
    process.exit(1);
  } else {
    console.log('Link Check Passed: All references and tool commands resolve cleanly. PASS\n');
  }
}

runCheckLinks();
