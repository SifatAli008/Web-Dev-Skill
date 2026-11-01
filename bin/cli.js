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
    Turn ANY AI agent into a disciplined 15-specialist team
=================================================================
`);
}

function printHelp() {
  printBanner();
  console.log(`Commands:
  init [options]       Install tool adapter into your project directory
  list                 Display all 15 specialists and their authorities
  doctor [path]        Verify current project setup and adapter presence
  audit [path]         Scan workspace for AI garbage code, leaks & tier signals
  playbook [name]      Display operational procedures for 16 core playbooks
  checklist [name]     Display production readiness verification checklists
  help                 Show this help message

Options:
  --tool <name>        Target tool: cursor, claude, antigravity, copilot, gemini, chatgpt, all
  --dest <path>        Destination project folder (default: current directory)
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

function installTool(toolKey, destDir) {
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

  const content = fs.readFileSync(tool.source, 'utf8');
  fs.writeFileSync(targetPath, content, 'utf8');
  console.log(`[INSTALLED] ${tool.name} -> ${tool.destRelative}`);
}

async function runInit(args) {
  printBanner();
  let selectedTool = null;
  let destDir = process.cwd();

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--tool' && args[i + 1]) {
      selectedTool = args[i + 1].toLowerCase();
      i++;
    } else if (args[i] === '--dest' && args[i + 1]) {
      destDir = path.resolve(args[i + 1]);
      i++;
    }
  }

  console.log(`Target directory: ${destDir}\n`);

  if (selectedTool) {
    if (selectedTool === 'all') {
      for (const k of Object.keys(TOOLS)) {
        installTool(k, destDir);
      }
    } else if (TOOLS[selectedTool]) {
      installTool(selectedTool, destDir);
    } else {
      console.error(`[ERROR] Invalid tool: ${selectedTool}. Choose from: ${Object.keys(TOOLS).join(', ')}, all`);
      process.exit(1);
    }
    console.log(`\nInitialization complete. Your AI coding agent is now equipped with Universal WebDev Skills!`);
    return;
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
    rl.close();
    const num = parseInt(answer.trim(), 10);
    if (isNaN(num) || num === 0) {
      console.log('Aborted.');
      return;
    }

    if (num >= 1 && num <= toolKeys.length) {
      installTool(toolKeys[num - 1], destDir);
    } else if (num === toolKeys.length + 1) {
      for (const k of toolKeys) {
        installTool(k, destDir);
      }
    } else {
      console.log('Invalid selection.');
      return;
    }
    console.log(`\nInitialization complete. Your AI coding agent is now equipped with Universal WebDev Skills!`);
  });
}

function runDoctor(destDir = process.cwd()) {
  printBanner();
  console.log(`Running diagnostics for directory: ${destDir}\n`);

  let detectedCount = 0;
  for (const [key, tool] of Object.entries(TOOLS)) {
    const targetPath = path.resolve(destDir, tool.destRelative);
    if (fs.existsSync(targetPath)) {
      console.log(`[FOUND] ${tool.name}: ${tool.destRelative}`);
      detectedCount++;
    } else {
      console.log(`[MISSING] ${tool.name}: ${tool.destRelative}`);
    }
  }

  console.log(`\nAdapters active in project: ${detectedCount} / ${Object.keys(TOOLS).length}`);
  if (detectedCount === 0) {
    console.log(`Run 'npx webdev-skills init' to configure your agent adapter.`);
  } else {
    console.log(`[HEALTHY] Universal WebDev Skills is properly configured in this directory.`);
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
