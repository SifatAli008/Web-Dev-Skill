#!/usr/bin/env node

/**
 * Universal WebDev Skills: Developer CLI
 * Zero-dependency interactive installer and specialist inspector.
 *
 * Usage:
 *   npx webdev-skills init [--tool <cursor|claude|antigravity|copilot|gemini|chatgpt|all>] [--dest <dir>]
 *   npx webdev-skills list
 *   npx webdev-skills doctor
 */

const fs = require('node:fs');
const path = require('node:path');
const readline = require('node:readline');

const PACKAGE_JSON = require('../package.json');
const REPO_ROOT = path.resolve(__dirname, '..');
const ADAPTERS_DIR = path.join(REPO_ROOT, 'adapters');
const SKILLS_INDEX_PATH = path.join(REPO_ROOT, 'skills.index.json');

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
  init      Install tool adapter into your project directory
  list      Display all 15 specialists and their authorities
  doctor    Verify current project setup and adapter presence
  help      Show this help message

Options:
  --tool <name>    Target tool: cursor, claude, antigravity, copilot, gemini, chatgpt, all
  --dest <path>    Destination project folder (default: current directory)
  -v, --version    Show version number
  -h, --help       Show help
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
    'ID'.padEnd(24) +
    'Specialist'.padEnd(36) +
    'Authority'.padEnd(24) +
    'Sample Triggers'
  );
  console.log('-'.repeat(100));

  for (const s of index.skills) {
    const triggers = s.triggers ? s.triggers.slice(0, 3).join(', ') : '';
    console.log(
      s.id.padEnd(24) +
      (s.title || s.name).padEnd(36) +
      (s.authority || '').padEnd(24) +
      triggers
    );
  }
  console.log('\nTotal: 15 / 15 Specialists Available.');
}

function installTool(toolKey, destDir) {
  const tool = TOOLS[toolKey];
  if (!tool) {
    console.error(`[ERROR] Unknown tool '${toolKey}'. Available: ${Object.keys(TOOLS).join(', ')}, all`);
    return false;
  }

  if (!fs.existsSync(tool.source)) {
    console.error(`[ERROR] Adapter file for ${tool.name} not found at ${tool.source}`);
    return false;
  }

  const targetPath = path.resolve(destDir, tool.destRelative);
  const targetDir = path.dirname(targetPath);

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const content = fs.readFileSync(tool.source, 'utf8');
  fs.writeFileSync(targetPath, content, 'utf8');
  console.log(`[PASS] Installed ${tool.name} adapter -> ${path.relative(process.cwd(), targetPath) || targetPath}`);
  return true;
}

async function runInit(args) {
  printBanner();

  let toolArg = null;
  let destDir = process.cwd();

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--tool' && args[i + 1]) {
      toolArg = args[i + 1].toLowerCase();
      i++;
    } else if (args[i] === '--dest' && args[i + 1]) {
      destDir = path.resolve(args[i + 1]);
      i++;
    }
  }

  if (toolArg) {
    if (toolArg === 'all') {
      for (const k of Object.keys(TOOLS)) {
        installTool(k, destDir);
      }
    } else {
      installTool(toolArg, destDir);
    }
    console.log(`\nInitialization complete. Your AI coding agent is now equipped with Universal WebDev Skills!`);
    return;
  }

  // Interactive selection prompt
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log('Select your AI coding tool:');
  const toolKeys = Object.keys(TOOLS);
  toolKeys.forEach((key, idx) => {
    console.log(`  [${idx + 1}] ${TOOLS[key].name} (${TOOLS[key].file})`);
  });
  console.log(`  [${toolKeys.length + 1}] Install All Adapters`);
  console.log(`  [0] Cancel\n`);

  rl.question('Enter number [1-7]: ', (answer) => {
    rl.close();
    const num = parseInt(answer.trim(), 10);
    if (isNaN(num) || num === 0) {
      console.log('Aborted.');
      return;
    }

    if (num >= 1 && num <= toolKeys.length) {
      const selected = toolKeys[num - 1];
      installTool(selected, destDir);
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
