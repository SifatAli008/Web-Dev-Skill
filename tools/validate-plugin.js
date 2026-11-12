#!/usr/bin/env node

/**
 * Universal WebDev Skills Antigravity Plugin Validator
 * Validates plugin.json manifest fields, rules/AGENTS.md size/frontmatter rules,
 * logo asset path, and all bundled SKILL.md metadata against Antigravity plugin specs.
 */

const fs = require('node:fs');
const path = require('node:path');

const REPO_ROOT = path.resolve(__dirname, '..');
const PLUGIN_JSON_PATH = path.join(REPO_ROOT, 'plugin.json');
const PACKAGE_JSON_PATH = path.join(REPO_ROOT, 'package.json');
const RULES_AGENTS_PATH = path.join(REPO_ROOT, 'rules', 'AGENTS.md');
const SKILLS_DIR = path.join(REPO_ROOT, 'skills');

const ALLOWED_MANIFEST_KEYS = new Set([
  '$schema',
  'name',
  'displayName',
  'description',
  'version',
  'author',
  'homepage',
  'repository',
  'logo',
  'suggestedPrompts',
  'skills',
  'license',
  'keywords',
  'disabled'
]);

const KEBAB_CASE_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ALLOWED_LOGO_EXTS = new Set(['.png', '.svg', '.jpg', '.jpeg', '.webp']);
const MAX_RULE_BYTES = 24000;

let errors = 0;

function fail(msg) {
  console.error(`[FAIL] ${msg}`);
  errors++;
}

function pass(msg) {
  console.log(`[PASS] ${msg}`);
}

function validateManifest() {
  if (!fs.existsSync(PLUGIN_JSON_PATH)) {
    fail('plugin.json missing at repository root.');
    return null;
  }

  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(PLUGIN_JSON_PATH, 'utf8'));
  } catch (err) {
    fail(`plugin.json is invalid JSON: ${err.message}`);
    return null;
  }

  if (!manifest || typeof manifest !== 'object' || Array.isArray(manifest)) {
    fail('plugin.json must be a JSON object.');
    return null;
  }

  for (const key of Object.keys(manifest)) {
    if (!ALLOWED_MANIFEST_KEYS.has(key)) {
      fail(`plugin.json contains unsupported top-level key "${key}" (silently ignored by Antigravity loader).`);
    }
  }

  if (typeof manifest.name !== 'string' || !KEBAB_CASE_RE.test(manifest.name)) {
    fail('plugin.json "name" must be a lowercase kebab-case string.');
  }

  if (typeof manifest.description !== 'string' || manifest.description.trim().length < 10 || manifest.description.trim().length > 160) {
    fail(`plugin.json "description" must be 10–160 chars for Marketplace cards (got ${manifest.description ? manifest.description.trim().length : 0}).`);
  }

  if (fs.existsSync(PACKAGE_JSON_PATH) && manifest.version !== undefined) {
    const pkg = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, 'utf8'));
    if (manifest.version !== pkg.version) {
      fail(`Version mismatch: plugin.json ("${manifest.version}") !== package.json ("${pkg.version}").`);
    }
  }

  if (manifest.logo !== undefined) {
    if (typeof manifest.logo !== 'string' || manifest.logo.startsWith('/') || /^[a-zA-Z]:/.test(manifest.logo) || /^https?:\/\//i.test(manifest.logo)) {
      fail(`plugin.json "logo" must be a relative path inside the plugin directory (got "${manifest.logo}").`);
    } else {
      const ext = path.extname(manifest.logo).toLowerCase();
      if (!ALLOWED_LOGO_EXTS.has(ext)) {
        fail(`plugin.json "logo" extension "${ext}" not in .png/.svg/.jpg/.jpeg/.webp.`);
      }
      const resolvedLogo = path.resolve(REPO_ROOT, manifest.logo);
      if (!resolvedLogo.startsWith(REPO_ROOT) || !fs.existsSync(resolvedLogo)) {
        fail(`plugin.json "logo" file does not exist on disk: ${manifest.logo}`);
      } else if (ext === '.png') {
        const buf = fs.readFileSync(resolvedLogo);
        if (buf.length >= 24 && buf.toString('ascii', 12, 16) === 'IHDR') {
          const width = buf.readUInt32BE(16);
          const height = buf.readUInt32BE(20);
          if (width < 128 || height < 128 || width !== height) {
            fail(`plugin.json "logo" PNG must be square >= 128x128 (got ${width}x${height}).`);
          }
        }
      }
    }
  }

  for (const requiredDoc of ['README.md', 'LICENSE']) {
    if (!fs.existsSync(path.join(REPO_ROOT, requiredDoc))) {
      fail(`${requiredDoc} missing at repository root (required for plugin distribution).`);
    }
  }

  if (manifest.suggestedPrompts !== undefined) {
    if (!Array.isArray(manifest.suggestedPrompts) || manifest.suggestedPrompts.length === 0 || manifest.suggestedPrompts.length > 3) {
      fail('plugin.json "suggestedPrompts" must contain 1 to 3 strings.');
    } else if (manifest.suggestedPrompts.some(p => typeof p !== 'string' || !p.trim())) {
      fail('plugin.json "suggestedPrompts" entries must be non-empty strings.');
    }
  }

  if (manifest.homepage !== undefined && (typeof manifest.homepage !== 'string' || !manifest.homepage.startsWith('https://'))) {
    fail('plugin.json "homepage" must be an https:// URL.');
  }

  if (manifest.repository !== undefined) {
    const repoUrl = typeof manifest.repository === 'string' ? manifest.repository : manifest.repository?.url;
    if (typeof repoUrl !== 'string' || !repoUrl.startsWith('https://')) {
      fail('plugin.json "repository" URL must start with https://.');
    }
  }

  if (manifest.author !== undefined && typeof manifest.author === 'object') {
    if (!manifest.author?.name || (manifest.author.url && !manifest.author.url.startsWith('https://'))) {
      fail('plugin.json "author" object requires "name" and optional https:// "url".');
    }
  }

  if (errors === 0) {
    pass(`plugin.json validated (${manifest.name}@${manifest.version || 'unversioned'}).`);
  }
  return manifest;
}

function validateRules() {
  if (!fs.existsSync(RULES_AGENTS_PATH)) {
    pass('No rules/AGENTS.md configured (skills-only mode).');
    return;
  }

  const content = fs.readFileSync(RULES_AGENTS_PATH, 'utf8');
  const bytes = Buffer.byteLength(content, 'utf8');

  if (content.trimStart().startsWith('---')) {
    fail('rules/AGENTS.md must be plain markdown without YAML frontmatter.');
  }

  if (bytes > MAX_RULE_BYTES) {
    fail(`rules/AGENTS.md exceeds Antigravity 24,000-byte limit (${bytes} bytes).`);
  } else {
    pass(`rules/AGENTS.md validated (${bytes} bytes / ${MAX_RULE_BYTES} max).`);
  }
}

function validateOptionalJsonConfigs() {
  for (const fileName of ['hooks.json', 'mcp_config.json']) {
    const target = path.join(REPO_ROOT, fileName);
    if (fs.existsSync(target)) {
      try {
        JSON.parse(fs.readFileSync(target, 'utf8'));
        pass(`${fileName} is valid JSON.`);
      } catch (err) {
        fail(`${fileName} is invalid JSON: ${err.message}`);
      }
    }
  }
}

function validateSkillsFrontmatter() {
  if (!fs.existsSync(SKILLS_DIR)) {
    fail('skills/ directory missing.');
    return;
  }

  const folders = fs.readdirSync(SKILLS_DIR).filter(f => fs.statSync(path.join(SKILLS_DIR, f)).isDirectory());
  let count = 0;

  for (const folder of folders) {
    const skillPath = path.join(SKILLS_DIR, folder, 'SKILL.md');
    if (!fs.existsSync(skillPath)) {
      fail(`skills/${folder}/SKILL.md is missing.`);
      continue;
    }

    const raw = fs.readFileSync(skillPath, 'utf8');
    const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!match) {
      fail(`skills/${folder}/SKILL.md is missing valid YAML frontmatter.`);
      continue;
    }

    const fm = match[1];
    const nameMatch = fm.match(/^name:\s*(.+)$/m);
    const descMatch = fm.match(/^description:\s*(.+)$/m);
    const skillName = nameMatch ? nameMatch[1].trim().replace(/^["']|["']$/g, '') : '';

    if (!nameMatch || !KEBAB_CASE_RE.test(skillName)) {
      fail(`skills/${folder}/SKILL.md frontmatter "name" must be lowercase kebab-case.`);
    } else if (skillName !== folder) {
      fail(`skills/${folder}/SKILL.md frontmatter name ("${skillName}") must match directory name ("${folder}").`);
    }
    if (!descMatch || descMatch[1].trim().length < 10) {
      fail(`skills/${folder}/SKILL.md frontmatter "description" is missing or too short.`);
    } else {
      const rawDesc = descMatch[1].trim();
      const isQuoted = (rawDesc.startsWith('"') && rawDesc.endsWith('"')) || (rawDesc.startsWith("'") && rawDesc.endsWith("'"));
      const cleanDesc = rawDesc.replace(/^["']|["']$/g, '');
      if (!isQuoted && /:\s/.test(rawDesc)) {
        fail(`skills/${folder}/SKILL.md frontmatter "description" contains unquoted ": " (quote the string in YAML).`);
      }
      if (cleanDesc.length > 1024) {
        fail(`skills/${folder}/SKILL.md frontmatter "description" exceeds 1024 chars (${cleanDesc.length}).`);
      }
    }
    count++;
  }

  pass(`Validated Antigravity frontmatter for ${count} plugin skills.`);
}

function main() {
  console.log('=== Validating Antigravity Plugin Bundle ===\n');
  validateManifest();
  validateRules();
  validateOptionalJsonConfigs();
  validateSkillsFrontmatter();

  if (errors > 0) {
    console.error(`\nPlugin Validation FAILED: ${errors} error(s) found.`);
    process.exit(1);
  }
  console.log('\nAntigravity Plugin Validation: SUCCESS\n');
}

main();
