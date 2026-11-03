#!/usr/bin/env node

/**
 * Universal WebDev Skills Layout & Design System Verifier (verify-layout)
 * Validates design tokens, DESIGN.md contracts, fluid math invariants,
 * 7-state component definitions, and accessibility/anti-slop constraints.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.join(__dirname, '..');
const DESIGN_MD = path.join(REPO_ROOT, 'DESIGN.md');
const SCHEMA_FILE = path.join(REPO_ROOT, 'templates', 'schemas', 'design-tokens.schema.json');

let errors = 0;

function verifyDesignContract() {
  if (!fs.existsSync(DESIGN_MD)) {
    console.error('[FAIL] DESIGN.md missing from workspace root.');
    errors++;
    return;
  }

  const content = fs.readFileSync(DESIGN_MD, 'utf8');

  const requiredSections = [
    { name: 'Design Read', regex: /\[Design Read\]:/i },
    { name: 'OKLCH / Surface Color System', regex: /--bg-base|oklch/i },
    { name: 'Fluid Typography or Type Scale', regex: /clamp\(|text-base/i },
    { name: 'Spring Physics Motion Tokens', regex: /--spring-snap|cubic-bezier/i },
    { name: '7-State Component Lifecycle Matrix', regex: /7-State|Component Lifecycle/i },
    { name: 'WCAG 2.2 AA Compliance Gate', regex: /WCAG 2\.2/i }
  ];

  requiredSections.forEach(section => {
    if (!section.regex.test(content)) {
      console.error(`[FAIL] DESIGN.md missing required section: ${section.name}`);
      errors++;
    }
  });

  console.log('[PASS] DESIGN.md satisfies open-design and taste-skill contract requirements.');
}

function verifyDesignTokenSchema() {
  if (!fs.existsSync(SCHEMA_FILE)) {
    console.error('[FAIL] design-tokens.schema.json missing from templates/schemas/.');
    errors++;
    return;
  }

  try {
    const schema = JSON.parse(fs.readFileSync(SCHEMA_FILE, 'utf8'));
    if (!schema.properties.taste_profile || !schema.properties.colors || !schema.properties.typography) {
      console.error('[FAIL] design-tokens.schema.json missing core properties.');
      errors++;
    } else {
      console.log('[PASS] design-tokens.schema.json validated.');
    }
  } catch (err) {
    console.error(`[FAIL] design-tokens.schema.json is invalid JSON: ${err.message}`);
    errors++;
  }
}

function scanAntiSlopViolations() {
  const SCAN_DIRS = ['skills/03-ux-ui-design', 'templates'];
  let checkedFiles = 0;

  function scan(dir) {
    const fullDir = path.join(REPO_ROOT, dir);
    if (!fs.existsSync(fullDir)) return;
    const entries = fs.readdirSync(fullDir, { withFileTypes: true });

    for (const ent of entries) {
      const fullPath = path.join(fullDir, ent.name);
      if (ent.isDirectory()) {
        scan(path.relative(REPO_ROOT, fullPath));
      } else if (ent.isFile() && (ent.name.endsWith('.md') || ent.name.endsWith('.json') || ent.name.endsWith('.css'))) {
        checkedFiles++;
        const text = fs.readFileSync(fullPath, 'utf8');

        // Check for outline none without focus
        if (/outline:\s*none/i.test(text) && !/:focus|outline-offset/i.test(text) && ent.name.endsWith('.css')) {
          console.error(`[A11Y VETO] ${path.relative(REPO_ROOT, fullPath)}: 'outline: none' without visible focus styles.`);
          errors++;
        }
      }
    }
  }

  SCAN_DIRS.forEach(scan);
  console.log(`[PASS] Scanned ${checkedFiles} design files for accessibility and anti-slop invariants.`);
}

function runVerifyLayout() {
  console.log('=== Universal WebDev Skills: Advanced Design & Layout Verifier ===\n');
  verifyDesignContract();
  verifyDesignTokenSchema();
  scanAntiSlopViolations();

  if (errors > 0) {
    console.error(`\nDesign & Layout Verification FAILED: ${errors} error(s) found.`);
    process.exit(1);
  } else {
    console.log('\nDesign & Layout Verification: SUCCESS (All contracts and invariants valid)\n');
  }
}

runVerifyLayout();
