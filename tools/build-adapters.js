#!/usr/bin/env node

/**
 * Universal WebDev Skills Adapter Builder
 * Generates thin, tool-specific adapter configurations pointing to the core skills.
 * NEVER edit files in adapters/ by hand; re-run this script instead.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.join(__dirname, '..');
const ADAPTERS_DIR = path.join(REPO_ROOT, 'adapters');

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function buildAdapters() {
  console.log('=== Building Tool Adapters from Core Skills ===\n');

  ensureDir(ADAPTERS_DIR);

  // 1. Claude Code Adapter (CLAUDE.md)
  const claudeDir = path.join(ADAPTERS_DIR, 'claude-code');
  ensureDir(claudeDir);
  const claudeContent = `# Claude Code Universal WebDev Team Instructions

This project is governed by the Universal WebDev Skills engineering framework.

1. Protocol: Read \`AGENTS.md\` for team protocols, tier classification (MVP, PROD, SCALE), and behavior rules.
2. Routing: Read \`skills.index.json\` at the repository root. When given a task, select the 2–5 relevant specialists and load only their \`skills/<id>/SKILL.md\` file. Never load the entire repository.
3. Handoffs: Use schema-defined artifacts in \`templates/schemas/\`.
4. Status Format: End every substantial response with Done, Verified (with evidence), NOT verified, Risks, and Next step.
`;
  fs.writeFileSync(path.join(claudeDir, 'CLAUDE.md'), claudeContent);
  console.log('[BUILT] adapters/claude-code/CLAUDE.md');

  // 2. Cursor Adapter (.cursorrules)
  const cursorDir = path.join(ADAPTERS_DIR, 'cursor');
  ensureDir(cursorDir);
  const cursorContent = `# Cursor Universal WebDev Team Rules

You are an elite 15-specialist web engineering team.

- Protocol: Follow AGENTS.md at the workspace root.
- Tier First: Determine whether task is MVP, PROD, or SCALE based on signals.
- Router: Consult skills.index.json to route tasks to 2-5 specialists. Load only their SKILL.md.
- Verification: Evidence over assertion. Never claim code is verified without running checks.
- End responses with: Done / Verified (with evidence) / NOT verified / Risks / Next step.
`;
  fs.writeFileSync(path.join(cursorDir, '.cursorrules'), cursorContent);
  console.log('[BUILT] adapters/cursor/.cursorrules');

  // 3. Antigravity Adapter (GEMINI.md)
  const agyDir = path.join(ADAPTERS_DIR, 'antigravity');
  ensureDir(agyDir);
  const agyContent = `# Antigravity Workspace Protocol

Governed by Universal WebDev Skills:
- Read AGENTS.md for protocol and conflict resolution (Security/Privacy > Architecture > Performance > Speed).
- Route tasks via skills.index.json. Load only the 2–5 relevant skills/<id>/SKILL.md files.
- Produce artifacts conforming to templates/schemas/.
- Mandatory status closing format: Done / Verified (with evidence) / NOT verified / Risks / Next step.
`;
  fs.writeFileSync(path.join(agyDir, 'GEMINI.md'), agyContent);
  console.log('[BUILT] adapters/antigravity/GEMINI.md');

  // 4. Copilot Adapter (.github/copilot-instructions.md)
  const copilotDir = path.join(ADAPTERS_DIR, 'copilot', '.github');
  ensureDir(copilotDir);
  const copilotContent = `# GitHub Copilot Team Instructions

- Follow AGENTS.md team protocol and behavior rules.
- Identify rigor tier (MVP / PROD / SCALE) before writing code.
- Consult skills.index.json to route to appropriate specialist skills in skills/<id>/SKILL.md.
- Run automated verification before declaring code done.
`;
  fs.writeFileSync(path.join(copilotDir, 'copilot-instructions.md'), copilotContent);
  console.log('[BUILT] adapters/copilot/.github/copilot-instructions.md');

  // 5. OpenAI ChatGPT / Codex (system-prompt.md)
  const openaiDir = path.join(ADAPTERS_DIR, 'codex-chatgpt');
  ensureDir(openaiDir);
  const openaiContent = `# ChatGPT / Codex System Prompt Pointer

Copy and paste the contents of chat-paste-in.md to activate the Universal WebDev 15-specialist engineering team in chat environments.
`;
  fs.writeFileSync(path.join(openaiDir, 'system-prompt.md'), openaiContent);
  console.log('[BUILT] adapters/codex-chatgpt/system-prompt.md');

  // 6. Gemini CLI (GEMINI.md)
  const geminiDir = path.join(ADAPTERS_DIR, 'gemini-cli');
  ensureDir(geminiDir);
  const geminiContent = `# Gemini CLI Universal WebDev Configuration

Follow AGENTS.md for protocol and behavior rules.
Route tasks via skills.index.json to the appropriate skills/<id>/SKILL.md files.
Always verify code changes with terminal execution evidence.
`;
  fs.writeFileSync(path.join(geminiDir, 'GEMINI.md'), geminiContent);
  console.log('[BUILT] adapters/gemini-cli/GEMINI.md');

  console.log('\nAll 6 adapters successfully built: SUCCESS\n');
}

buildAdapters();
