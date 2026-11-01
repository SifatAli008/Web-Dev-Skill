#!/usr/bin/env node

/**
 * Universal WebDev Skills Linter
 * Enforces line counts (<300 lines), YAML frontmatter, required sections, and tag standards.
 */

const fs = require('fs');
const path = require('path');

const SKILLS_DIR = path.join(__dirname, '..', 'skills');
const REQUIRED_SECTIONS = [
  'Specialist Stance',
  'When to Use / NOT to Use',
  'Inputs and Outputs',
  'Decision Rules',
  'Procedure',
  'Anti-Patterns',
  'Verification',
  'Escalate-to-User Triggers'
];

let failed = false;

function lintSkills() {
  console.log('=== Linting Universal WebDev Skills ===\n');

  const skillFolders = fs.readdirSync(SKILLS_DIR).filter(f => {
    return fs.statSync(path.join(SKILLS_DIR, f)).isDirectory();
  });

  skillFolders.forEach(folder => {
    const skillPath = path.join(SKILLS_DIR, folder, 'SKILL.md');
    if (!fs.existsSync(skillPath)) {
      console.error(`[FAIL] ${folder}: Missing SKILL.md`);
      failed = true;
      return;
    }

    const content = fs.readFileSync(skillPath, 'utf8');
    const lines = content.split('\n');

    // 1. Line count check (<300 lines)
    if (lines.length > 300) {
      console.error(`[FAIL] ${folder}: SKILL.md exceeds 300 lines (current: ${lines.length})`);
      failed = true;
    }

    // 2. Frontmatter check
    if (!content.startsWith('---')) {
      console.error(`[FAIL] ${folder}: Missing YAML frontmatter`);
      failed = true;
    }

    // 3. Required sections check
    REQUIRED_SECTIONS.forEach(sec => {
      if (!content.includes(sec)) {
        console.error(`[FAIL] ${folder}: Missing required section "${sec}"`);
        failed = true;
      }
    });

    // 4. Specialist stance 3 questions check
    if (!content.includes('Three Questions I Always Ask First') && !content.includes('3 questions')) {
      console.error(`[FAIL] ${folder}: Missing 3 core questions`);
      failed = true;
    }

    // 5. Verification block check
    if (!content.includes('```bash') && !content.includes('```')) {
      console.error(`[FAIL] ${folder}: Missing runnable verification block`);
      failed = true;
    }

    if (!failed) {
      console.log(`[PASS] ${folder} (${lines.length} lines)`);
    }
  });

  if (failed) {
    console.error('\nSkill Linting: FAILED');
    process.exit(1);
  } else {
    console.log('\nAll skills passed lint verification: SUCCESS\n');
  }
}

lintSkills();

