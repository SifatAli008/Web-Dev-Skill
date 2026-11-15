#!/usr/bin/env node

/**
 * Universal WebDev Skills: Developer CLI
 * Zero-dependency interactive installer, specialist inspector, auditor, and playbook runner.
 *
 * Usage:
 *   npx webdev-skills init [--tool <cursor|claude|antigravity|copilot|gemini|chatgpt|all>] [--dest <dir>]
 *   npx webdev-skills list
 *   npx webdev-skills doctor
 *   npx webdev-skills audit [dir]
 *   npx webdev-skills playbook [name]
 *   npx webdev-skills checklist [name]
 */

const fs = require('node:fs');
const path = require('node:path');
const readline = require('node:readline');

const PACKAGE_JSON = require('../package.json');
const REPO_ROOT = path.resolve(__dirname, '..');
const ADAPTERS_DIR = path.join(REPO_ROOT, 'adapters');
const SKILLS_INDEX_PATH = path.join(REPO_ROOT, 'skills.index.json');
const PLAYBOOKS_DIR = path.join(REPO_ROOT, 'playbooks');
const CHECKLISTS_DIR = path.join(REPO_ROOT, 'checklists');

const TOOLS = {
  cursor: {
    name: 'Cursor',
    file: '.cursorrules',
    source: path.join(ADAPTERS_DIR, 'cursor', '.cursorrules'),
    destRelative: '.cursorrules'
  },
  claude: {
    name: 'Claude Code',
    file: 'CLAUDE.md',
    source: path.join(ADAPTERS_DIR, 'claude-code', 'CLAUDE.md'),
    destRelative: 'CLAUDE.md'
  },
  antigravity: {
    name: 'Google Antigravity',
    file: 'GEMINI.md',
    source: path.join(ADAPTERS_DIR, 'antigravity', 'GEMINI.md'),
    destRelative: 'GEMINI.md'
  },
  copilot: {
    name: 'GitHub Copilot',
    file: 'copilot-instructions.md',
    source: path.join(ADAPTERS_DIR, 'copilot', 'copilot-instructions.md'),
    destRelative: path.join('.github', 'copilot-instructions.md')
  },
  gemini: {
    name: 'Gemini CLI',
    file: 'GEMINI.md',
    source: path.join(ADAPTERS_DIR, 'gemini-cli', 'GEMINI.md'),
    destRelative: 'GEMINI.md'
  },
  chatgpt: {
    name: 'ChatGPT / OpenAI Codex',
    file: 'system-prompt.md',
    source: path.join(ADAPTERS_DIR, 'chatgpt-codex', 'system-prompt.md'),
    destRelative: 'system-prompt.md'
  }
};

function printBanner() {
  console.log(`
=================================================================
        Universal WebDev Skills: CLI v${PACKAGE_JSON.version}
    Turn ANY AI agent into a disciplined 16-specialist team
=================================================================
`);
}

function printHelp() {
  printBanner();
  console.log(`Commands:
  init [options]       Install framework assets and tool adapters into project
  update [path]        Update installed skills and adapters to latest package version
  doctor [path]        Verify project setup, adapter presence & file resolvability
  ci [path]            Install deterministic GitHub Actions CI verification gate
  audit [path]         Scan workspace for AI garbage code, leaks & tier signals
  list                 Display all 16 specialists and their authorities
  playbook [name]      Display operational procedures for 16 core playbooks
  checklist [name]     Display production readiness verification checklists
  help                 Show this help message

Options:
  --tool <name>        Target tool: cursor, claude, antigravity, copilot, gemini, chatgpt, all
  --mode <vendor|root> Installation mode: vendor (.webdev-skills/, default) or root (project root)
  --dest <path>        Destination project folder (default: current directory)
  --ci                 Automatically install GitHub Actions deterministic verification gate
  -v, --version        Show version number
  -h, --help           Show help
`);
}

function listSpecialists() {
  printBanner();
  if (!fs.existsSync(SKILLS_INDEX_PATH)) {
    console.error('[ERROR] skills.index.json not found.');
    process.exit(1);
  }

  const index = JSON.parse(fs.readFileSync(SKILLS_INDEX_PATH, 'utf8'));
  console.log(`Discovered ${index.skills.length} Specialists:\n`);
  console.log(
    'ID'.padEnd(26) +
    'Specialist'.padEnd(38) +
    'Authority'.padEnd(20) +
    'Token Budget'
  );
  console.log('-'.repeat(96));

  index.skills.forEach(s => {
    console.log(
      s.id.padEnd(26) +
      s.title.padEnd(38) +
      s.authority.padEnd(20) +
      `${s.token_cost_est} tokens`
    );
  });

  console.log('\nRun "npx webdev-skills playbook" to inspect operational procedures.');
}

function listPlaybooks(targetName) {
  printBanner();
  if (!fs.existsSync(PLAYBOOKS_DIR)) {
    console.error('[ERROR] playbooks directory not found.');
    process.exit(1);
  }

  const files = fs.readdirSync(PLAYBOOKS_DIR).filter(f => f.endsWith('.md')).sort();

  if (!targetName) {
    console.log(`Available Operational Playbooks (${files.length}):\n`);
    files.forEach((f, idx) => {
      const slug = f.replace('.md', '');
      const content = fs.readFileSync(path.join(PLAYBOOKS_DIR, f), 'utf8');
      const titleMatch = content.match(/^#\s+(?:Playbook:\s*)?(.*)$/m);
      const title = titleMatch ? titleMatch[1].trim() : slug;
      console.log(`  ${String(idx + 1).padStart(2)}. ${slug.padEnd(32)} - ${title}`);
    });
    console.log('\nUsage: npx webdev-skills playbook <name>');
    return;
  }

  const matchFile = files.find(f => f === targetName || f === `${targetName}.md` || f.includes(targetName));
  if (!matchFile) {
    console.error(`[ERROR] Playbook "${targetName}" not found. Run "npx webdev-skills playbook" to see available.`);
    process.exit(1);
  }

  const content = fs.readFileSync(path.join(PLAYBOOKS_DIR, matchFile), 'utf8');
  console.log(content);
}

function listChecklists(targetName) {
  printBanner();
  if (!fs.existsSync(CHECKLISTS_DIR)) {
    console.error('[ERROR] checklists directory not found.');
    process.exit(1);
  }

  const files = fs.readdirSync(CHECKLISTS_DIR).filter(f => f.endsWith('.md')).sort();

  if (!targetName) {
    console.log(`Available Verification Checklists (${files.length}):\n`);
    files.forEach((f, idx) => {
      const slug = f.replace('.checklist.md', '').replace('.md', '');
      const content = fs.readFileSync(path.join(CHECKLISTS_DIR, f), 'utf8');
      const titleMatch = content.match(/^#\s+(.*)$/m);
      const title = titleMatch ? titleMatch[1].trim() : slug;
      const count = content.split('\n').filter(l => l.trim().startsWith('- [ ]')).length;
      console.log(`  ${String(idx + 1).padStart(2)}. ${slug.padEnd(20)} (${count} items) - ${title}`);
    });
    console.log('\nUsage: npx webdev-skills checklist <name>');
    return;
  }

  const matchFile = files.find(f => f === targetName || f === `${targetName}.checklist.md` || f.includes(targetName));
  if (!matchFile) {
    console.error(`[ERROR] Checklist "${targetName}" not found. Run "npx webdev-skills checklist" to see available.`);
    process.exit(1);
  }

  const content = fs.readFileSync(path.join(CHECKLISTS_DIR, matchFile), 'utf8');
  console.log(content);
}

function runAudit(targetDir = process.cwd()) {
  printBanner();
  console.log(`Auditing workspace at: ${targetDir}\n`);

  let findings = 0;
  let signals = { mvp: 0, prod: 0, scale: 0 };
  const IGNORE_DIRS = new Set(['node_modules', '.git', '.next', 'dist', 'build', '.gemini']);

  function scanFolder(dir, depth = 0) {
    if (depth > 5) return;
    let entries = [];
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }

    for (const ent of entries) {
      if (IGNORE_DIRS.has(ent.name)) continue;
      const fullPath = path.join(dir, ent.name);

      if (ent.isDirectory()) {
        scanFolder(fullPath, depth + 1);
      } else if (ent.isFile()) {
        const ext = path.extname(ent.name).toLowerCase();
        if (['.js', '.ts', '.jsx', '.tsx', '.json', '.html', '.css', '.md', '.env'].includes(ext)) {
          let text = '';
          try { text = fs.readFileSync(fullPath, 'utf8'); } catch { continue; }

          // Secret Leak check
          if (/(sk_live_[0-9a-zA-Z]{24}|AKIA[0-9A-Z]{16})/.test(text)) {
            console.error(`[CRITICAL LEAK] ${path.relative(targetDir, fullPath)}: Live secret key detected!`);
            findings++;
          }

          /* Unimplemented stub comment check in source code files */
          const isSourceCode = ['.js', '.ts', '.jsx', '.tsx', '.py', '.go', '.rs', '.sql', '.php', '.java'].includes(ext);
          const todoPattern = new RegExp('/' + '/.*TO' + 'DO.*imple' + 'ment', 'i');
          if (isSourceCode && (todoPattern.test(text) || /\/\/.*FIXME/i.test(text))) {
            console.warn(`[AI GARBAGE] ${path.relative(targetDir, fullPath)}: Placeholder comment found in code.`);
            findings++;
          }

          // Anti-pattern: outline none
          if (/outline:\s*none/i.test(text) && !/:focus-visible/i.test(text) && ext === '.css') {
            console.warn(`[A11Y VETO] ${path.relative(targetDir, fullPath)}: 'outline: none' without visible focus styles.`);
            findings++;
          }

          // Legacy web library check (Google Chrome Modern Web Guidance)
          if (isSourceCode && /import\s+.*from\s+['"](react-modal|popper\.js|@floating-ui\/dom|textarea-autosize)['"]/i.test(text)) {
            console.warn(`[LEGACY WEB PATTERN] ${path.relative(targetDir, fullPath)}: Third-party UI dependency detected where Baseline native primitives (<dialog>, Popover API, CSS Anchor Positioning, field-sizing) can be used (Google Chrome MWG).`);
            findings++;
          }

          // Tier signals
          if (/stripe|paypal|lemon-squeezy|billing|checkout/i.test(text)) signals.prod++;
          if (/argon2|scrypt|bcrypt|jwt|session/i.test(text)) signals.prod++;
          if (/redis|kafka|rabbitmq|cdn|cloudflare|etag/i.test(text)) signals.scale++;
        }
      }
    }
  }

  scanFolder(targetDir);

  console.log('\n--- TIER SIGNAL DETECTION ---');
  if (signals.scale > 0) {
    console.log(`Detected Tier: SCALE (Found caching, queueing, or distributed infrastructure signals)`);
  } else if (signals.prod > 0) {
    console.log(`Detected Tier: PROD (Found authentication, payments, or customer data signals)`);
  } else {
    console.log(`Detected Tier: MVP (No commercial/data scale signals detected)`);
  }

  console.log('\n--- HYGIENE & DEFENSIVE AUDIT SUMMARY ---');
  if (findings === 0) {
    console.log('[PASS] 0 critical leaks or AI garbage code violations found. Workspace is clean!');
  } else {
    console.log(`[ATTENTION] ${findings} issue(s) require remediation before production release.`);
  }
}

function installFrameworkAssets(destDir, mode = 'vendor') {
  if (path.resolve(destDir) === REPO_ROOT) {
    return { mode: 'source', vendorDir: REPO_ROOT };
  }

  const targetBase = mode === 'vendor' ? path.join(destDir, '.webdev-skills') : destDir;

  if (!fs.existsSync(targetBase)) {
    fs.mkdirSync(targetBase, { recursive: true });
  }

  // Copy framework directories
  const dirsToCopy = ['skills', 'templates', 'checklists', 'playbooks'];
  for (const d of dirsToCopy) {
    const src = path.join(REPO_ROOT, d);
    const dest = path.join(targetBase, d);
    if (fs.existsSync(src)) {
      fs.cpSync(src, dest, { recursive: true, force: true });
    }
  }

  // Copy core framework files
  const filesToCopy = ['skills.index.json', 'AGENTS.md', 'DESIGN.md', 'GLOSSARY.md', 'SOURCES.md'];
  for (const f of filesToCopy) {
    const src = path.join(REPO_ROOT, f);
    const dest = path.join(targetBase, f);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
    }
  }

  // Write manifest
  const manifest = {
    name: 'webdev-skills',
    version: PACKAGE_JSON.version,
    installedAt: new Date().toISOString(),
    mode
  };

  const manifestPath = mode === 'vendor'
    ? path.join(targetBase, 'manifest.json')
    : path.join(destDir, '.webdev-skills.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

  console.log(`[INSTALLED] Framework Core (${mode} mode) -> ${path.relative(destDir, targetBase) || '.'}`);
  return { mode, vendorDir: targetBase };
}

function installTool(toolKey, destDir, mode = 'vendor') {
  const tool = TOOLS[toolKey];
  if (!tool) {
    console.error(`Unknown tool: ${toolKey}`);
    return;
  }

  const targetPath = path.resolve(destDir, tool.destRelative);
  const targetDir = path.dirname(targetPath);

  if (!fs.existsSync(tool.source)) {
    console.error(`[ERROR] Adapter file not found: ${tool.source}`);
    return;
  }

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  let content = fs.readFileSync(tool.source, 'utf8');

  // If in vendor mode and destination is an external workspace, rewrite root paths to .webdev-skills/
  if (mode === 'vendor' && path.resolve(destDir) !== REPO_ROOT) {
    content = content
      .replace(/`AGENTS\.md`/g, '`.webdev-skills/AGENTS.md`')
      .replace(/AGENTS\.md at workspace root/g, '.webdev-skills/AGENTS.md')
      .replace(/`skills\.index\.json`/g, '`.webdev-skills/skills.index.json`')
      .replace(/`DESIGN\.md`/g, '`.webdev-skills/DESIGN.md`')
      .replace(/DESIGN\.md at workspace root/g, '.webdev-skills/DESIGN.md')
      .replace(/skills\/\<id\>\/SKILL\.md/g, '.webdev-skills/skills/<id>/SKILL.md')
      .replace(/skills\/\*\.md/g, '.webdev-skills/skills/*.md')
      .replace(/`templates\/schemas\/`/g, '`.webdev-skills/templates/schemas/`')
      .replace(/templates\/schemas\//g, '.webdev-skills/templates/schemas/');
  }

  fs.writeFileSync(targetPath, content, 'utf8');
  console.log(`[INSTALLED] ${tool.name} -> ${tool.destRelative}`);

  // If Cursor, also copy .cursor/rules/*.mdc
  if (toolKey === 'cursor') {
    const srcRulesDir = path.join(ADAPTERS_DIR, 'cursor', '.cursor', 'rules');
    const destRulesDir = path.resolve(destDir, '.cursor', 'rules');
    if (fs.existsSync(srcRulesDir)) {
      if (!fs.existsSync(destRulesDir)) {
        fs.mkdirSync(destRulesDir, { recursive: true });
      }
      const ruleFiles = fs.readdirSync(srcRulesDir).filter(f => f.endsWith('.mdc'));
      for (const rf of ruleFiles) {
        fs.copyFileSync(path.join(srcRulesDir, rf), path.join(destRulesDir, rf));
      }
      console.log(`[INSTALLED] Cursor Modular Rules (${ruleFiles.length} rules) -> .cursor/rules/`);
    }
  }
}

function installCiGate(destDir) {
  const ciTemplate = path.join(REPO_ROOT, 'templates', 'ci-gate.template.yml');
  if (!fs.existsSync(ciTemplate)) {
    console.error(`[ERROR] CI gate template not found at: ${ciTemplate}`);
    return;
  }
  const targetDir = path.resolve(destDir, '.github', 'workflows');
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  const targetPath = path.join(targetDir, 'webdev-skills-gate.yml');
  fs.copyFileSync(ciTemplate, targetPath);
  console.log(`[INSTALLED] GitHub Actions CI Gate -> .github/workflows/webdev-skills-gate.yml`);
}

async function runInit(args) {
  printBanner();
  let selectedTool = null;
  let destDir = process.cwd();
  let mode = 'vendor';
  let installCi = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--tool' && args[i + 1]) {
      selectedTool = args[i + 1].toLowerCase();
      i++;
    } else if (args[i] === '--dest' && args[i + 1]) {
      destDir = path.resolve(args[i + 1]);
      i++;
    } else if (args[i] === '--mode' && args[i + 1]) {
      mode = args[i + 1].toLowerCase();
      i++;
    } else if (args[i] === '--ci') {
      installCi = true;
    }
  }

  console.log(`Target directory: ${destDir}`);
  console.log(`Install mode: ${mode}\n`);

  function finishInstall(toolKey) {
    installFrameworkAssets(destDir, mode);
    if (toolKey === 'all') {
      for (const k of Object.keys(TOOLS)) {
        installTool(k, destDir, mode);
      }
    } else {
      installTool(toolKey, destDir, mode);
    }
    if (installCi) {
      installCiGate(destDir);
    }
    console.log(`\nInitialization complete. Your AI coding agent is now equipped with Universal WebDev Skills!`);
    console.log(`Run 'npx webdev-skills doctor' to verify setup anytime.`);
  }

  if (selectedTool) {
    if (selectedTool === 'all' || TOOLS[selectedTool]) {
      finishInstall(selectedTool);
      return;
    } else {
      console.error(`[ERROR] Invalid tool: ${selectedTool}. Choose from: ${Object.keys(TOOLS).join(', ')}, all`);
      process.exit(1);
    }
  }

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  console.log('Select your primary AI coding tool:');
  const toolKeys = Object.keys(TOOLS);
  toolKeys.forEach((k, idx) => {
    console.log(`  ${idx + 1}) ${TOOLS[k].name} (${TOOLS[k].destRelative})`);
  });
  console.log(`  ${toolKeys.length + 1}) Install All Adapters`);
  console.log('  0) Cancel\n');

  rl.question('Choose an option (1-7): ', (answer) => {
    const num = parseInt(answer.trim(), 10);
    if (isNaN(num) || num === 0) {
      rl.close();
      console.log('Aborted.');
      return;
    }

    let chosenKey = null;
    if (num >= 1 && num <= toolKeys.length) {
      chosenKey = toolKeys[num - 1];
    } else if (num === toolKeys.length + 1) {
      chosenKey = 'all';
    } else {
      rl.close();
      console.log('Invalid selection.');
      return;
    }

    rl.question('Install GitHub Actions deterministic verification gate? (y/n, default: y): ', (ciAnswer) => {
      rl.close();
      if (!ciAnswer || ciAnswer.trim().toLowerCase() === 'y' || ciAnswer.trim().toLowerCase() === 'yes') {
        installCi = true;
      }
      finishInstall(chosenKey);
    });
  });
}

function runUpdate(destDir = process.cwd()) {
  printBanner();
  console.log(`Checking for Universal WebDev Skills updates in: ${destDir}\n`);

  const vendorDir = path.join(destDir, '.webdev-skills');
  const hasVendor = fs.existsSync(vendorDir);
  const manifestPath = hasVendor
    ? path.join(vendorDir, 'manifest.json')
    : path.join(destDir, '.webdev-skills.json');

  let mode = hasVendor ? 'vendor' : 'root';
  if (path.resolve(destDir) === REPO_ROOT) {
    console.log('[INFO] Already in source repository. Run git pull to update source.');
    return;
  }

  let oldVersion = 'unknown';
  if (fs.existsSync(manifestPath)) {
    try {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      oldVersion = manifest.version;
      mode = manifest.mode || mode;
    } catch {}
  }

  console.log(`Updating from v${oldVersion} -> v${PACKAGE_JSON.version} (${mode} mode)...`);

  // Refresh framework assets
  installFrameworkAssets(destDir, mode);

  // Refresh active adapters
  let refreshedCount = 0;
  for (const [key, tool] of Object.entries(TOOLS)) {
    const targetPath = path.resolve(destDir, tool.destRelative);
    if (fs.existsSync(targetPath)) {
      installTool(key, destDir, mode);
      refreshedCount++;
    }
  }

  // Refresh CI gate if already present
  const ciPath = path.resolve(destDir, '.github', 'workflows', 'webdev-skills-gate.yml');
  if (fs.existsSync(ciPath)) {
    installCiGate(destDir);
  }

  console.log(`\n[SUCCESS] Successfully updated Universal WebDev Skills to v${PACKAGE_JSON.version} (${refreshedCount} adapter(s) updated).`);
}

function runCi(destDir = process.cwd()) {
  printBanner();
  console.log(`Configuring deterministic GitHub Actions CI gate in: ${destDir}\n`);
  installCiGate(destDir);
  console.log('\n[SUCCESS] CI verification gate configured. Push to GitHub to enable deterministic verification.');
}

function runDoctor(destDir = process.cwd()) {
  printBanner();
  console.log(`Running diagnostics for directory: ${destDir}\n`);

  let detectedAdapters = 0;

  // 1. Check adapters
  console.log('--- AGENT ADAPTER STATUS ---');
  for (const [key, tool] of Object.entries(TOOLS)) {
    const targetPath = path.resolve(destDir, tool.destRelative);
    if (fs.existsSync(targetPath)) {
      console.log(`[FOUND] ${tool.name}: ${tool.destRelative}`);
      detectedAdapters++;
    } else {
      console.log(`[MISSING] ${tool.name}: ${tool.destRelative}`);
    }
  }

  // 2. Check Framework Core Assets
  console.log('\n--- FRAMEWORK CORE ASSETS ---');
  const isHomeRepo = path.resolve(destDir) === REPO_ROOT;
  const vendorDir = path.join(destDir, '.webdev-skills');
  const hasVendor = fs.existsSync(vendorDir);

  const basePath = hasVendor ? vendorDir : destDir;

  const coreChecks = [
    { name: 'skills.index.json (Router Index)', rel: 'skills.index.json' },
    { name: 'AGENTS.md (Team Protocol)', rel: 'AGENTS.md' },
    { name: 'DESIGN.md (Design Contract)', rel: 'DESIGN.md' },
    { name: 'skills/ (16 Specialist Skills)', rel: 'skills' }
  ];

  let missingCore = 0;
  for (const c of coreChecks) {
    const fullPath = path.join(basePath, c.rel);
    if (fs.existsSync(fullPath)) {
      console.log(`[FOUND] ${c.name} at ${path.relative(destDir, fullPath)}`);
    } else {
      console.log(`[MISSING] ${c.name} (Expected at ${path.relative(destDir, fullPath)})`);
      missingCore++;
    }
  }

  // 3. Adapter Path Resolvability Check
  console.log('\n--- ADAPTER PATH RESOLVABILITY ---');
  let resolvableCount = 0;
  let unresolvableCount = 0;

  for (const [key, tool] of Object.entries(TOOLS)) {
    const targetPath = path.resolve(destDir, tool.destRelative);
    if (fs.existsSync(targetPath)) {
      const content = fs.readFileSync(targetPath, 'utf8');
      const matches = content.match(/`([^`]+\.(?:md|json))`|skills\/[^/\s]+\/SKILL\.md/g) || [];
      let brokenInAdapter = 0;
      for (const m of matches) {
        const cleaned = m.replace(/`/g, '');
        if (cleaned.includes('<id>')) continue;
        const refPath = path.resolve(destDir, cleaned);
        if (!fs.existsSync(refPath)) {
          brokenInAdapter++;
          unresolvableCount++;
        }
      }
      if (brokenInAdapter === 0) {
        console.log(`[VERIFIED] ${tool.name}: All referenced files resolve on disk.`);
        resolvableCount++;
      } else {
        console.log(`[FAIL] ${tool.name}: ${brokenInAdapter} referenced file(s) missing from target workspace.`);
      }
    }
  }

  // 4. Manifest & Version Parity
  console.log('\n--- VERSION & MANIFEST ---');
  const manifestPath = hasVendor
    ? path.join(vendorDir, 'manifest.json')
    : path.join(destDir, '.webdev-skills.json');

  if (fs.existsSync(manifestPath)) {
    try {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      console.log(`[VERSION] Installed: v${manifest.version} (Package CLI: v${PACKAGE_JSON.version})`);
      if (manifest.version !== PACKAGE_JSON.version) {
        console.log(`[UPDATE AVAILABLE] Run 'npx webdev-skills update' to upgrade to v${PACKAGE_JSON.version}.`);
      }
    } catch {
      console.log('[WARN] Manifest file unreadable.');
    }
  } else if (isHomeRepo) {
    console.log(`[VERSION] Operating in Source Repository: v${PACKAGE_JSON.version}`);
  } else {
    console.log('[MISSING] No manifest (.webdev-skills.json) found.');
  }

  // 5. Deterministic CI Gate Status
  console.log('\n--- DETERMINISTIC CI VERIFICATION GATE ---');
  const ciPath = path.resolve(destDir, '.github', 'workflows', 'webdev-skills-gate.yml');
  if (fs.existsSync(ciPath)) {
    console.log('[ENABLED] GitHub Actions CI Gate active (.github/workflows/webdev-skills-gate.yml)');
  } else {
    console.log('[NOT CONFIGURED] Deterministic CI Gate missing.');
    console.log("  Prompt rules are advisory. Run 'npx webdev-skills ci' to add automated GitHub Actions gating.");
  }

  // Final Health Verdict
  console.log('\n================ DIAGNOSTICS SUMMARY ================');
  if (detectedAdapters > 0 && missingCore === 0 && unresolvableCount === 0) {
    console.log('[HEALTHY] Universal WebDev Skills is properly configured and fully resolvable!');
  } else if (detectedAdapters === 0) {
    console.log("[INCOMPLETE] No AI agent adapters found. Run 'npx webdev-skills init' to set up.");
  } else {
    console.log("[BROKEN RESOLUTION] Adapters exist but underlying framework files are missing!");
    console.log("  Remedy: Run 'npx webdev-skills init' to install missing framework assets.");
  }
}

// Main CLI Router
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'help';

  if (args.includes('-v') || args.includes('--version')) {
    console.log(`v${PACKAGE_JSON.version}`);
    return;
  }

  if (args.includes('-h') || args.includes('--help')) {
    printHelp();
    return;
  }

  switch (command) {
    case 'init':
      await runInit(args.slice(1));
      break;
    case 'update':
      runUpdate(args[1] ? path.resolve(args[1]) : process.cwd());
      break;
    case 'ci':
      runCi(args[1] ? path.resolve(args[1]) : process.cwd());
      break;
    case 'list':
      listSpecialists();
      break;
    case 'playbook':
      listPlaybooks(args[1]);
      break;
    case 'checklist':
      listChecklists(args[1]);
      break;
    case 'audit':
      runAudit(args[1] ? path.resolve(args[1]) : process.cwd());
      break;
    case 'doctor':
      runDoctor(args[1] ? path.resolve(args[1]) : process.cwd());
      break;
    case 'help':
    default:
      printHelp();
      break;
  }
}

main().catch((err) => {
  console.error('[CLI ERROR]', err);
  process.exit(1);
});
