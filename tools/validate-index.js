#!/usr/bin/env node

/**
 * Universal WebDev Skills Router Index Validator
 * Verifies that skills.index.json is valid, synchronized with all 15 SKILL.md frontmatters,
 * and that no orphaned or unindexed skills exist.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.join(__dirname, '..');
const INDEX_FILE = path.join(REPO_ROOT, 'skills.index.json');
const SKILLS_DIR = path.join(REPO_ROOT, 'skills');

function parseYamlFrontmatter(content) {
  if (!content.startsWith('---')) return null;
  const parts = content.split('---');
  if (parts.length < 3) return null;
  const yamlLines = parts[1].trim().split('\n');
  const result = {};

  yamlLines.forEach(line => {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) return;
    const key = line.slice(0, colonIdx).trim();
    let val = line.slice(colonIdx + 1).trim();

    // Parse array if bracketed
    if (val.startsWith('[') && val.endsWith(']')) {
      result[key] = val.slice(1, -1).split(',').map(s => s.trim().replace(/^["']|["']$/g, ''));
    } else {
      result[key] = val.replace(/^["']|["']$/g, '');
    }
  });

  return result;
}

function runIndexValidation() {
  console.log('=== Validating Router Index (skills.index.json) & Frontmatter Synchronization ===\n');

  if (!fs.existsSync(INDEX_FILE)) {
    console.error('FAIL: skills.index.json not found');
    process.exit(1);
  }

  const indexData = JSON.parse(fs.readFileSync(INDEX_FILE, 'utf8'));
  let errors = 0;

  // 1. Validate top-level metadata
  if (!indexData.version || !indexData.tiers || !Array.isArray(indexData.skills)) {
    console.error('FAIL: Invalid top-level index structure');
    errors++;
  }

  // 2. Check all physical folders are indexed
  const physicalFolders = fs.readdirSync(SKILLS_DIR).filter(f => {
    return fs.statSync(path.join(SKILLS_DIR, f)).isDirectory();
  });

  const indexedFolders = new Set(indexData.skills.map(s => path.basename(path.dirname(s.path))));

  physicalFolders.forEach(folder => {
    if (!indexedFolders.has(folder)) {
      console.error(`[ORPHAN SKILL] Directory skills/${folder} is not registered in skills.index.json`);
      errors++;
    }
  });

  // 3. Check each indexed skill matches its SKILL.md
  indexData.skills.forEach(skill => {
    const skillFilePath = path.join(REPO_ROOT, skill.path);
    if (!fs.existsSync(skillFilePath)) {
      console.error(`[BROKEN PATH] Skill ${skill.id}: Target path ${skill.path} does not exist`);
      errors++;
      return;
    }

    const content = fs.readFileSync(skillFilePath, 'utf8');
    const fm = parseYamlFrontmatter(content);
    if (!fm) {
      console.error(`[INVALID FRONTMATTER] Skill ${skill.id}: Missing or malformed YAML frontmatter`);
      errors++;
      return;
    }

    if (fm.name !== skill.name) {
      console.error(`[NAME MISMATCH] Skill ${skill.id}: Index name "${skill.name}" !== SKILL.md name "${fm.name}"`);
      errors++;
    }

    console.log(`[PASS] ${skill.id}: Synced with ${skill.path}`);
  });

  console.log(`\nVerified ${indexData.skills.length} indexed skills.`);
  if (errors > 0) {
    console.error(`Index Validation FAILED: ${errors} error(s) found.`);
    process.exit(1);
  } else {
    console.log('Router Index Integrity: SUCCESS (All skills synced)\n');
  }
}

runIndexValidation();

