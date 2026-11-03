# Claude Code Universal WebDev Team Instructions

This project is governed by the Universal WebDev Skills engineering framework.

1. Protocol: Read `AGENTS.md` for team protocols, tier classification (MVP, PROD, SCALE), and behavior rules.
2. Routing: Read `skills.index.json` at the repository root. When given a task, select the 2–5 relevant specialists and load only their `skills/<id>/SKILL.md` file. Never load the entire repository.
3. Design System & Anti-Slop: Read `DESIGN.md` at workspace root for visual tokens, Taste Profiles (minimalist, industrial-brutalist, editorial, soft-consumer), and anti-slop directives.
4. Anthropic Agent Skills Standard: All 16 skills in `skills/` strictly comply with the open Agent Skills specification (agentskills.io / AAIF) with standardized YAML frontmatter, 3-level progressive disclosure, and runnable terminal verification suites.
5. Handoffs: Use schema-defined artifacts in `templates/schemas/`.
6. AI Hygiene: Zero placeholder comments (// TODO), no folder sprawl, and strict artifact control.
7. Status Format: End every substantial response with Done, Verified (with evidence), NOT verified, Risks, and Next step.
