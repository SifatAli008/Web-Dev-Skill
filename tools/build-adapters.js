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
4. AI Hygiene: Zero placeholder comments (// TODO), no folder sprawl, and strict artifact control.
5. Status Format: End every substantial response with Done, Verified (with evidence), NOT verified, Risks, and Next step.
`;
  fs.writeFileSync(path.join(claudeDir, 'CLAUDE.md'), claudeContent);
  console.log('[BUILT] adapters/claude-code/CLAUDE.md');

  // 2. Cursor Adapter (.cursorrules and modern .cursor/rules/*.mdc)
  const cursorDir = path.join(ADAPTERS_DIR, 'cursor');
  ensureDir(cursorDir);
  const cursorContent = `# Cursor Universal WebDev Team Rules

You are an elite 15-specialist web engineering team.

- Protocol: Follow AGENTS.md at the workspace root.
- Tier First: Determine whether task is MVP, PROD, or SCALE based on signals.
- Router: Consult skills.index.json to route tasks to 2-5 specialists. Load only their SKILL.md.
- Verification: Evidence over assertion. Never claim code is verified without running checks.
- AI Hygiene: Zero placeholder comments (// TODO), flat folder structure, no unauthorized markdown litter.
- End responses with: Done / Verified (with evidence) / NOT verified / Risks / Next step.
`;
  fs.writeFileSync(path.join(cursorDir, '.cursorrules'), cursorContent);
  console.log('[BUILT] adapters/cursor/.cursorrules');

  // Modern Cursor Modular Rules (.cursor/rules/*.mdc)
  const cursorRulesDir = path.join(cursorDir, '.cursor', 'rules');
  ensureDir(cursorRulesDir);

  const mdcRules = [
    {
      file: '00-core-protocol.mdc',
      desc: 'Universal WebDev team protocol, tier classification (MVP, PROD, SCALE), and behavior rules',
      alwaysApply: true,
      content: `Follow AGENTS.md protocol. Classify task into MVP, PROD, or SCALE tier based on signals.
Never build PROD/SCALE signal at MVP rigor. Check skills.index.json and load only relevant specialist SKILL.md files.
AI Hygiene: Zero placeholder comments (// TODO), no folder sprawl, zero AI vibe-code templates.`
    },
    {
      file: '03-ux-ui-design.mdc',
      desc: 'WCAG 2.2 AA accessibility, contrast >= 4.5:1, touch targets >= 44px, and anti-vibe design',
      globs: '**/*.{tsx,jsx,vue,svelte,html,css,scss}',
      alwaysApply: false,
      content: `Enforce WCAG 2.2 Level AA accessibility: contrast >= 4.5:1, visible focus rings (:focus-visible), and 44x44px touch targets.
Anti-Vibe-Code: Never emit generic AI rainbow gradients, fake macOS window chrome, or hollow cards.`
    },
    {
      file: '04-frontend.mdc',
      desc: 'Frontend architecture, zero-CLS layout stability, and state partitioning',
      globs: '**/*.{tsx,jsx,vue,svelte,ts,js}',
      alwaysApply: false,
      content: `Keep components Server Components by default; only use 'use client' at interactive leaf nodes.
Reserve dimensions on dynamic elements and images to guarantee absolute zero Cumulative Layout Shift (CLS = 0).`
    },
    {
      file: '05-backend-data.mdc',
      desc: 'ACID transactions, connection pooling, and zero-downtime expand-and-contract migrations',
      globs: '**/*.{sql,prisma,go,rs,py,ts,js}',
      alwaysApply: false,
      content: `Always wrap concurrent balance/stock updates in ACID transactions.
Use expand-and-contract dual-write migrations; never drop or rename columns in a single step.`
    },
    {
      file: '06-security.mdc',
      desc: 'HARD VETO: OWASP Top 10, parameterized SQL, scrypt hashing, and secret protection',
      globs: '**/*.{env*,auth*,login*,crypto*,security*,ts,js,py,go}',
      alwaysApply: false,
      content: `HARD VETO active: Never concatenate raw SQL strings (mandate driver parameterization).
Never hardcode secrets. Passwords must use scrypt/argon2 with unique salts. Validate all inputs against strict schemas.`
    },
    {
      file: '08-testing-qa.mdc',
      desc: 'SQAT quality gates: No evidence, no ship. Automated assertions and mutation tests',
      globs: '**/*.{test,spec}.*,**/__tests__/**',
      alwaysApply: false,
      content: `No evidence, no ship. Every test must show terminal command output and exit code 0.
Assert both happy paths and edge/error cases (invalid inputs, injection strings, negative stock).`
    },
    {
      file: '09-devops-infra.mdc',
      desc: 'No rollback, no ship. Container liveness/readiness probes and automated rollback scripts',
      globs: '**/{Dockerfile,docker-compose*,*.yml,*.yaml,nginx*,k8s*}',
      alwaysApply: false,
      content: `No rollback, no ship. Expose independent /api/health/liveness and /api/health/readiness probes.
Provide tested rollback procedures before declaring deployment readiness.`
    }
  ];

  for (const r of mdcRules) {
    const frontmatter = [
      '---',
      `description: ${r.desc}`,
      r.globs ? `globs: ${r.globs}` : '',
      `alwaysApply: ${r.alwaysApply}`,
      '---',
      '',
      r.content,
      ''
    ].filter(Boolean).join('\n');

    fs.writeFileSync(path.join(cursorRulesDir, r.file), frontmatter);
    console.log(`[BUILT] adapters/cursor/.cursor/rules/${r.file}`);
  }

  // 3. Antigravity Adapter (GEMINI.md)
  const agyDir = path.join(ADAPTERS_DIR, 'antigravity');
  ensureDir(agyDir);
  const agyContent = `# Antigravity Workspace Protocol

Governed by Universal WebDev Skills:
- Read AGENTS.md for protocol and conflict resolution (Security/Privacy > Architecture > Performance > Speed).
- Route tasks via skills.index.json. Load only the 2–5 relevant skills/<id>/SKILL.md files.
- Produce artifacts conforming to templates/schemas/.
- AI Hygiene: Zero placeholder comments, flat directory hierarchies, strict artifact lifecycle control.
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
- AI Hygiene: Never output placeholder comments or unnecessary boilerplate folders.
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
Enforce AI hygiene: zero placeholder comments and strict artifact controls.
Always verify code changes with terminal execution evidence.
`;
  fs.writeFileSync(path.join(geminiDir, 'GEMINI.md'), geminiContent);
  console.log('[BUILT] adapters/gemini-cli/GEMINI.md');

  console.log('\nAll 6 adapters successfully built: SUCCESS\n');
}

buildAdapters();
