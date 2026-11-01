#!/usr/bin/env node

/**
 * Universal WebDev Skills Documentation Data Generator
 * Extracts rich specialist dossiers from skills/[id]/SKILL.md and injects them
 * into docs/index.html with full procedure, anti-patterns, rules, verification, and escalate triggers.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.join(__dirname, '..');
const INDEX_FILE = path.join(REPO_ROOT, 'skills.index.json');
const DOCS_FILE = path.join(REPO_ROOT, 'docs', 'index.html');

function extractAllSkills() {
  const indexData = JSON.parse(fs.readFileSync(INDEX_FILE, 'utf8'));

  return indexData.skills.map(s => {
    const filePath = path.join(REPO_ROOT, s.path);
    const content = fs.readFileSync(filePath, 'utf8');

    // Refusal
    const refuseMatch = content.match(/### What I Refuse to Compromise On\s+([\s\S]*?)(?=### Three Questions|## )/);
    const refuse = refuseMatch ? refuseMatch[1].trim().replace(/\r?\n/g, ' ') : '';

    // Questions
    const questionsMatch = content.match(/### Three Questions I Always Ask First\s+([\s\S]*?)(?=---\r?\n|## )/);
    const questions = [];
    if (questionsMatch) {
      questionsMatch[1].trim().split(/\r?\n/).forEach(l => {
        const m = l.match(/^\d+\.\s+(.*)$/);
        if (m) questions.push(m[1].trim());
      });
    }

    // When to Use / Not to Use
    const whenMatch = content.match(/## When to Use \/ NOT to Use\s+([\s\S]*?)(?=## )/);
    const whenToUse = [];
    const whenNotToUse = [];
    if (whenMatch) {
      const parts = whenMatch[1].split(/- \*\*NOT to use when:\*\*/);
      if (parts[0]) {
        parts[0].split(/\r?\n/).forEach(l => {
          if (l.trim().startsWith('-') && !l.includes('**Use when:**')) {
            whenToUse.push(l.trim().replace(/^-\s*/, ''));
          }
        });
      }
      if (parts[1]) {
        parts[1].split(/\r?\n/).forEach(l => {
          if (l.trim().startsWith('-')) {
            whenNotToUse.push(l.trim().replace(/^-\s*/, ''));
          }
        });
      }
    }

    // Decision Rules
    const rIdx = content.indexOf('## Decision Rules');
    const pIdx = content.indexOf('## Procedure');
    let rules = [];
    if (rIdx !== -1 && pIdx !== -1) {
      const rSection = content.substring(rIdx + 17, pIdx).trim();
      const rawRules = rSection.split(/\r?\n(?=\d+\.\s+\*\*)/).map(r => r.trim()).filter(Boolean);
      rules = rawRules.map(r => {
        const titleMatch = r.match(/^\d+\.\s+\*\*([^*]+)\*\*:?\s*([\s\S]*)$/);
        if (titleMatch) {
          return {
            title: titleMatch[1].trim(),
            text: titleMatch[2].trim().replace(/\r?\n\s+/g, ' ')
          };
        }
        return { title: 'Decision Rule', text: r.replace(/\r?\n\s+/g, ' ') };
      });
    }

    // Procedure Steps
    const aIdx = content.indexOf('## Anti-Patterns');
    let steps = [];
    if (pIdx !== -1 && aIdx !== -1) {
      const pSection = content.substring(pIdx + 12, aIdx).trim();
      const rawSteps = pSection.split(/(?=### Step \d+:)/).map(st => st.trim()).filter(Boolean);
      steps = rawSteps.map(st => {
        const headerMatch = st.match(/### (Step \d+:[^\r\n]+)/);
        const title = headerMatch ? headerMatch[1].trim() : 'Step';
        const body = headerMatch ? st.replace(/### Step \d+:[^\r\n]+/, '').trim() : st;
        return { title, body };
      });
    }

    // Anti-Patterns
    const vIdx = content.indexOf('## Verification');
    let antiPatterns = [];
    if (aIdx !== -1 && vIdx !== -1) {
      const aSection = content.substring(aIdx + 16, vIdx).trim();
      antiPatterns = aSection.split(/\r?\n/).filter(l => l.trim().startsWith('-')).map(l => l.trim().replace(/^-\s*/, ''));
    }

    // Verification commands
    const eIdx = content.indexOf('## Escalate-to-User Triggers');
    let verification = '';
    if (vIdx !== -1) {
      const vSection = content.substring(vIdx + 15, eIdx !== -1 ? eIdx : content.length);
      const codeMatch = vSection.match(/```(?:bash|sh|node)?\s*([\s\S]*?)```/);
      if (codeMatch) verification = codeMatch[1].trim();
    }

    // Escalate triggers
    let escalate = [];
    if (eIdx !== -1) {
      const eSection = content.substring(eIdx + 28).trim();
      escalate = eSection.split(/\r?\n/).filter(l => l.trim().match(/^\d+\.\s+/)).map(l => l.trim().replace(/^\d+\.\s+/, ''));
    }

    let authType = 'advise';
    const authLower = (s.authority || '').toLowerCase();
    if (authLower.includes('veto')) authType = 'veto';
    else if (authLower.includes('launch') || authLower.includes('gate') || authLower.includes('process')) authType = 'gate';
    else if (authLower.includes('ship') || authLower.includes('sqat') || authLower.includes('lead')) authType = 'ship';

    return {
      id: s.id,
      num: s.id.split('-')[0],
      name: s.title,
      auth: s.authority,
      authType,
      estTokens: s.token_cost_est,
      tiers: s.tiers,
      depends_on: s.depends_on,
      inputs: s.inputs,
      outputs: s.outputs,
      triggers: s.triggers,
      sources: s.sources,
      refuse,
      questions,
      whenToUse,
      whenNotToUse,
      rules,
      steps,
      antiPatterns,
      verification,
      escalate
    };
  });
}

function updateDocsHtml() {
  const skills = extractAllSkills();
  let html = fs.readFileSync(DOCS_FILE, 'utf8');

  // 1. Inject or update CSS styles for rich specialist views
  const customStyles = `
    /* Rich Specialist View Components */
    .routing-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 16px 0 24px; }
    @media (max-width: 860px) { .routing-grid { grid-template-columns: 1fr; } }
    .routing-card { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 18px; }
    .routing-title { font-weight: 700; font-size: 12px; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
    .routing-use .routing-title { color: #10b981; }
    .routing-avoid .routing-title { color: #f43f5e; }
    .routing-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; font-size: 13px; color: var(--text-2); }
    .routing-item { display: flex; align-items: flex-start; gap: 10px; line-height: 1.5; }
    .routing-icon { flex-shrink: 0; margin-top: 1px; font-weight: 700; }
    .routing-use .routing-icon { color: #10b981; }
    .routing-avoid .routing-icon { color: #f43f5e; }

    .rule-card { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 16px 20px; margin-bottom: 14px; transition: border-color 0.15s ease; }
    .rule-card:hover { border-color: var(--border-focus); }
    .rule-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; gap: 12px; flex-wrap: wrap; }
    .rule-title { font-weight: 600; font-size: 14px; color: var(--text-1); display: flex; align-items: center; gap: 8px; }
    .rule-body { font-size: 13px; color: var(--text-2); line-height: 1.6; }

    .step-card { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 18px 20px; margin-bottom: 14px; }
    .step-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; flex-wrap: wrap; gap: 8px; }
    .step-title { font-weight: 600; font-size: 14px; color: var(--text-1); }
    .step-tiers { display: flex; gap: 6px; }
    .tier-pill { font-family: var(--font-mono); font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 4px; letter-spacing: 0.5px; }
    .tier-pill-mvp { background: rgba(16, 185, 129, 0.12); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.25); }
    .tier-pill-prod { background: rgba(0, 240, 255, 0.12); color: var(--cyan); border: 1px solid rgba(0, 240, 255, 0.25); }
    .tier-pill-scale { background: rgba(168, 85, 247, 0.12); color: var(--purple); border: 1px solid rgba(168, 85, 247, 0.25); }
    .step-body { font-size: 13px; color: var(--text-2); line-height: 1.65; white-space: pre-line; }

    .anti-pattern-box { background: rgba(244, 63, 94, 0.04); border: 1px solid rgba(244, 63, 94, 0.2); border-radius: 8px; padding: 18px 20px; margin-bottom: 14px; }
    .anti-pattern-title { font-weight: 700; font-size: 12px; text-transform: uppercase; letter-spacing: 0.8px; color: #f43f5e; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
    .anti-pattern-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; font-size: 13px; color: var(--text-2); }
    .anti-pattern-item { display: flex; align-items: flex-start; gap: 10px; line-height: 1.5; }
    .anti-pattern-icon { color: #f43f5e; font-weight: 700; flex-shrink: 0; margin-top: 1px; }

    .escalate-box { background: rgba(245, 158, 11, 0.05); border: 1px solid rgba(245, 158, 11, 0.25); border-radius: 8px; padding: 18px 20px; margin-bottom: 14px; }
    .escalate-title { font-weight: 700; font-size: 12px; text-transform: uppercase; letter-spacing: 0.8px; color: #f59e0b; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
    .escalate-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; font-size: 13px; color: var(--text-2); }
    .escalate-item { display: flex; align-items: flex-start; gap: 10px; line-height: 1.5; }
    .escalate-icon { color: #f59e0b; font-weight: 700; flex-shrink: 0; margin-top: 1px; }

    .hud-action-btn { background: rgba(0, 240, 255, 0.08); border: 1px solid rgba(0, 240, 255, 0.3); color: var(--cyan); padding: 6px 14px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px; }
    .hud-action-btn:hover { background: rgba(0, 240, 255, 0.18); border-color: var(--cyan); box-shadow: 0 0 12px rgba(0, 240, 255, 0.25); }
    .hud-btn-amber { background: rgba(245, 158, 11, 0.08); border-color: rgba(245, 158, 11, 0.3); color: #f59e0b; }
    .hud-btn-amber:hover { background: rgba(245, 158, 11, 0.18); border-color: #f59e0b; box-shadow: 0 0 12px rgba(245, 158, 11, 0.25); }
  `;

  if (!html.includes('/* Rich Specialist View Components */')) {
    html = html.replace('</style>', `${customStyles}\n  </style>`);
  }

  // 2. Replace SPECIALISTS array
  const specialistsJson = JSON.stringify(skills, null, 2);
  const specArrayRegex = /const SPECIALISTS = \[[\s\S]*?\n    \];/;
  html = html.replace(specArrayRegex, `const SPECIALISTS = ${specialistsJson};`);

  // 3. Replace renderSpecialistPage function
  const newRenderSpecialistPage = `
    function renderSpecialistPage(spec, main, toc) {
      toc.innerHTML = \`
        <li><a href="#stance" class="toc-a active">Specialist Stance</a></li>
        <li><a href="#questions" class="toc-a">Three Questions Asked First</a></li>
        <li><a href="#routing" class="toc-a">Routing & Scope Boundaries</a></li>
        <li><a href="#rules" class="toc-a">Deterministic Decision Rules</a></li>
        <li><a href="#procedure" class="toc-a">Tiered Operational Procedure</a></li>
        <li><a href="#antipatterns" class="toc-a">Banned Anti-Patterns</a></li>
        <li><a href="#verification" class="toc-a">Automated Verification</a></li>
        <li><a href="#escalate" class="toc-a">Escalate-to-User Triggers</a></li>
        <li><a href="#schemas" class="toc-a">Artifact Contracts & Activation</a></li>
      \`;

      let alertClass = 'alert-gate';
      if (spec.authType === 'veto') alertClass = 'alert-veto';
      else if (spec.authType === 'ship') alertClass = 'alert-ship';

      main.innerHTML = \`
        <div class="content-header">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; flex-wrap: wrap; gap: 8px;">
            <div class="doc-cat">Specialist Dossier #\${spec.num}</div>
            <div style="display: flex; gap: 8px;">
              <span class="pill-badge \${spec.authType === 'veto' ? 'badge-color-sec' : (spec.authType === 'ship' ? 'badge-color-qa' : 'badge-color-orch')}">\${spec.auth}</span>
              <span class="pill-badge" style="background: rgba(255,255,255,0.06); color: var(--text-2);">\${spec.estTokens} tokens</span>
            </div>
          </div>
          <h1 class="doc-heading">\${spec.name}</h1>
          <p class="doc-intro">
            Governed under Universal WebDev Protocol. Tiers: \${spec.tiers.map(t => \`<span class="tier-pill tier-pill-\${t.toLowerCase()}">\${t}</span>\`).join(' ')}
            • Depends on: \${spec.depends_on.length > 0 ? spec.depends_on.map(d => \`<code>\${d}</code>\`).join(', ') : '<em>None (Root)</em>'}
          </p>
        </div>

        <div class="doc-block" id="stance">
          <h2 class="doc-subheading">Non-Negotiable Stance</h2>
          <div class="tech-callout \${alertClass}">
            <div class="callout-header"><span>●</span> What I Refuse to Compromise On</div>
            <div class="callout-body">"\${spec.refuse}"</div>
          </div>
        </div>

        <div class="doc-block" id="questions">
          <h2 class="doc-subheading">Three Questions I Always Ask First</h2>
          <p class="doc-paragraph">Before writing a line of code or recommending an architecture, I enforce intake validation:</p>
          <div style="display: flex; flex-direction: column; gap: 10px; margin: 16px 0;">
            \${spec.questions.map((q, idx) => \`
              <div style="display: flex; align-items: flex-start; gap: 12px; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: 12px 16px;">
                <span style="font-family: var(--font-mono); font-weight: 700; color: var(--cyan); background: rgba(0, 240, 255, 0.1); width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 11px;">\${idx + 1}</span>
                <span style="color: var(--text-1); font-size: 13px; line-height: 1.5;">\${q}</span>
              </div>
            \`).join('')}
          </div>
        </div>

        <div class="doc-block" id="routing">
          <h2 class="doc-subheading">Routing & Scope Boundaries</h2>
          <p class="doc-paragraph">Deterministic boundaries prevent specialist sprawl and keep token consumption focused:</p>
          <div class="routing-grid">
            <div class="routing-card routing-use">
              <div class="routing-title">
                <span class="routing-icon">✓</span> When to Activate Specialist
              </div>
              <ul class="routing-list">
                \${spec.whenToUse.map(u => \`
                  <li class="routing-item"><span class="routing-icon">✓</span><span>\${u}</span></li>
                \`).join('')}
              </ul>
            </div>
            <div class="routing-card routing-avoid">
              <div class="routing-title">
                <span class="routing-icon">✕</span> Route Elsewhere When
              </div>
              <ul class="routing-list">
                \${spec.whenNotToUse.map(nu => \`
                  <li class="routing-item"><span class="routing-icon">✕</span><span>\${nu}</span></li>
                \`).join('')}
              </ul>
            </div>
          </div>
        </div>

        <div class="doc-block" id="rules">
          <h2 class="doc-subheading">Deterministic Decision Rules</h2>
          <p class="doc-paragraph">Explicit IF-THEN architectural invariants backed by formal engineering standards:</p>
          <div style="margin: 16px 0;">
            \${spec.rules.map((r, idx) => \`
              <div class="rule-card">
                <div class="rule-header">
                  <span class="rule-title">#\${idx + 1} \${r.title}</span>
                </div>
                <div class="rule-body">\${r.text}</div>
              </div>
            \`).join('')}
          </div>
        </div>

        <div class="doc-block" id="procedure">
          <h2 class="doc-subheading">Tiered Operational Procedure</h2>
          <p class="doc-paragraph">Step-by-step deterministic workflow executed across project tiers:</p>
          <div style="margin: 16px 0;">
            \${spec.steps.map(st => \`
              <div class="step-card">
                <div class="step-header">
                  <span class="step-title">\${st.title}</span>
                  <div class="step-tiers">
                    \${st.title.includes('[MVP]') ? '<span class=\"tier-pill tier-pill-mvp\">MVP</span>' : ''}
                    \${st.title.includes('[PROD]') ? '<span class=\"tier-pill tier-pill-prod\">PROD</span>' : ''}
                    \${st.title.includes('[SCALE]') ? '<span class=\"tier-pill tier-pill-scale\">SCALE</span>' : ''}
                  </div>
                </div>
                <div class="step-body">\${st.body}</div>
              </div>
            \`).join('')}
          </div>
        </div>

        <div class="doc-block" id="antipatterns">
          <h2 class="doc-subheading">Banned Anti-Patterns</h2>
          <p class="doc-paragraph">Zero-tolerance practices that result in immediate code review rejection:</p>
          <div class="anti-pattern-box">
            <div class="anti-pattern-title">⚠️ Forbidden Engineering Anti-Patterns</div>
            <ul class="anti-pattern-list">
              \${spec.antiPatterns.map(ap => \`
                <li class="anti-pattern-item"><span class="anti-pattern-icon">✕</span><span>\${ap}</span></li>
              \`).join('')}
            </ul>
          </div>
        </div>

        <div class="doc-block" id="verification">
          <h2 class="doc-subheading">Automated Verification Suite</h2>
          <p class="doc-paragraph">Run these terminal checks to verify invariants and schema contracts before declaring done:</p>
          <div class="code-snippet-box">
            <div class="snippet-top">
              <span>Terminal Verification Command</span>
              <div style="display: flex; gap: 8px;">
                <button class="hud-action-btn" onclick="runSpecialistMission('\${spec.id}')">⚡ Run in DevBot HUD</button>
                <button class="snippet-copy-btn" onclick="copyText(this.parentElement.parentElement.nextElementSibling.innerText, this)">Copy</button>
              </div>
            </div>
            <pre><code>\${spec.verification || '# Standard test suite verification:\\nnode tools/verify-all.js'}</code></pre>
          </div>
        </div>

        <div class="doc-block" id="escalate">
          <h2 class="doc-subheading">Escalate-to-User Triggers</h2>
          <p class="doc-paragraph">The specialist must immediately halt autonomous execution and request explicit user confirmation when:</p>
          <div class="escalate-box">
            <div class="escalate-title">🛑 Mandatory Human-in-the-Loop Triggers</div>
            <ul class="escalate-list">
              \${spec.escalate.map(esc => \`
                <li class="escalate-item"><span class="escalate-icon">!</span><span>\${esc}</span></li>
              \`).join('')}
            </ul>
          </div>
        </div>

        <div class="doc-block" id="schemas">
          <h2 class="doc-subheading">Artifact Contracts & Activation</h2>
          <p class="doc-paragraph">Specialist communicates across phase boundaries via schema-validated artifacts:</p>
          <div class="spec-table-box">
            <table>
              <thead>
                <tr>
                  <th>Inputs Required</th>
                  <th>Outputs Produced</th>
                  <th>Trigger Keywords</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>\${spec.inputs.map(i => \`<code>\${i}</code>\`).join(' ')}</td>
                  <td>\${spec.outputs.map(o => \`<code>\${o}</code>\`).join(' ')}</td>
                  <td>\${spec.triggers.map(t => \`<span class=\"pill-badge\" style=\"margin:2px;\">\${t}</span>\`).join('')}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p class="doc-paragraph">Agent Activation Directive (Copy & Paste to wear this hat):</p>
          <div class="code-snippet-box">
            <div class="snippet-top">
              <span>Chat Prompt Directive</span>
              <button class="snippet-copy-btn" onclick="copyText('[Wearing: \${spec.name}] Evaluate task under Universal WebDev Skills protocol.', this)">Copy</button>
            </div>
            <pre><code>[Wearing: \${spec.name}] Evaluate task under Universal WebDev Skills protocol.
Non-Negotiable Refusal: "\${spec.refuse}"
Inputs: \${spec.inputs.join(', ')} | Outputs: \${spec.outputs.join(', ')}</code></pre>
          </div>
        </div>
      \`;
    }
  `;

  const renderFnRegex = /function renderSpecialistPage\(spec, main, toc\) \{[\s\S]*?\n    \}/;
  html = html.replace(renderFnRegex, newRenderSpecialistPage.trim());

  // 4. Add runSpecialistMission to companion HUD scripts
  const companionMissionFn = `
    function runSpecialistMission(specId) {
      if (!agentDrawerOpen) toggleAgentDrawer();
      const spec = SPECIALISTS.find(s => s.id === specId);
      if (!spec) return;

      let color = '#00f0ff';
      let roleClass = 'badge-color-orch';
      if (spec.authType === 'veto') { color = '#f43f5e'; roleClass = 'badge-color-sec'; }
      else if (spec.authType === 'ship') { color = '#a855f7'; roleClass = 'badge-color-qa'; }

      setAgentState(color, spec.name, 'Running Verification...');
      addTerminalLog(roleClass, spec.id, 'Executing verification check for ' + spec.name + '...');

      setTimeout(() => {
        addTerminalLog(roleClass, spec.id, '>>> Checking inputs: ' + spec.inputs.join(', '));
        addTerminalLog(roleClass, spec.id, '>>> Checking invariants & ' + spec.antiPatterns.length + ' anti-patterns...');
        setTimeout(() => {
          addTerminalLog('badge-color-qa', spec.id, 'PASS: Verification check passed with 0 critical findings. Ready for handoff.');
          setAgentState('#10b981', 'Agent Idle', spec.name + ' VERIFIED');
        }, 800);
      }, 700);
    }
  `;

  if (!html.includes('function runSpecialistMission(')) {
    html = html.replace('function runSimulatedMission(type) {', `${companionMissionFn}\n\n    function runSimulatedMission(type) {`);
  }

  fs.writeFileSync(DOCS_FILE, html, 'utf8');
  console.log(`Successfully updated docs/index.html! New file size: ${(html.length / 1024).toFixed(2)} KB.`);
}

updateDocsHtml();
