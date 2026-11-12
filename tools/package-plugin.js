#!/usr/bin/env node

/**
 * Universal WebDev Skills Antigravity Plugin Packager
 * Stages a clean, self-contained Antigravity plugin directory and optionally
 * creates .tar.gz / .zip release archives plus SHA256SUMS.txt using zero external deps.
 *
 * Usage:
 *   node tools/package-plugin.js [--out <dir>] [--stage-only] [--verify-temp]
 */

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');

const REPO_ROOT = path.resolve(__dirname, '..');

const BUNDLE_FILES = [
  'plugin.json',
  'README.md',
  'LICENSE',
  'skills.index.json',
  'AGENTS.md',
  'DESIGN.md',
  'GLOSSARY.md',
  'SOURCES.md',
  'AI-FAILURE-MODES.md'
];

const OPTIONAL_FILES = ['hooks.json', 'mcp_config.json'];
const BUNDLE_DIRS = ['assets', 'rules', 'skills', 'playbooks', 'templates', 'checklists'];
const OPTIONAL_DIRS = ['agents'];

function parseArgs(argv) {
  const opts = { outDir: null, stageOnly: false, verifyTemp: false };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--out' && argv[i + 1]) {
      opts.outDir = path.resolve(argv[i + 1]);
      i++;
    } else if (argv[i] === '--stage-only') {
      opts.stageOnly = true;
    } else if (argv[i] === '--verify-temp') {
      opts.verifyTemp = true;
      opts.stageOnly = true;
    }
  }
  return opts;
}

function sha256File(filePath) {
  const hash = crypto.createHash('sha256');
  hash.update(fs.readFileSync(filePath));
  return hash.digest('hex');
}

function stageBundle(stageRoot, pluginName) {
  const bundleDir = path.join(stageRoot, pluginName);
  fs.rmSync(bundleDir, { recursive: true, force: true });
  fs.mkdirSync(bundleDir, { recursive: true });

  for (const file of BUNDLE_FILES) {
    const src = path.join(REPO_ROOT, file);
    if (!fs.existsSync(src)) {
      throw new Error(`Required bundle file missing: ${file}`);
    }
    fs.copyFileSync(src, path.join(bundleDir, file));
  }

  for (const file of OPTIONAL_FILES) {
    const src = path.join(REPO_ROOT, file);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(bundleDir, file));
    }
  }

  for (const dir of BUNDLE_DIRS) {
    const src = path.join(REPO_ROOT, dir);
    if (!fs.existsSync(src)) {
      throw new Error(`Required bundle directory missing: ${dir}`);
    }
    fs.cpSync(src, path.join(bundleDir, dir), { recursive: true });
  }

  for (const dir of OPTIONAL_DIRS) {
    const src = path.join(REPO_ROOT, dir);
    if (fs.existsSync(src)) {
      fs.cpSync(src, path.join(bundleDir, dir), { recursive: true });
    }
  }

  return bundleDir;
}

function createArchives(outDir, pluginName, version) {
  const baseName = `${pluginName}-v${version}`;
  const tarName = `${baseName}.tar.gz`;
  const zipName = `${baseName}.zip`;
  const tarPath = path.join(outDir, tarName);
  const zipPath = path.join(outDir, zipName);

  fs.rmSync(tarPath, { force: true });
  fs.rmSync(zipPath, { force: true });

  execFileSync('tar', ['-czf', tarPath, '-C', outDir, pluginName], { stdio: 'pipe' });

  if (process.platform === 'win32') {
    const srcGlob = path.join(outDir, pluginName);
    execFileSync(
      'powershell.exe',
      ['-NoProfile', '-Command', `Compress-Archive -Path '${srcGlob}' -DestinationPath '${zipPath}' -Force`],
      { stdio: 'pipe' }
    );
  } else {
    execFileSync('zip', ['-rq', zipPath, pluginName], { cwd: outDir, stdio: 'pipe' });
  }

  const checksums = [
    `${sha256File(tarPath)}  ${tarName}`,
    `${sha256File(zipPath)}  ${zipName}`
  ].join('\n') + '\n';

  const sumsPath = path.join(outDir, 'SHA256SUMS.txt');
  fs.writeFileSync(sumsPath, checksums, 'utf8');

  return { tarPath, zipPath, sumsPath };
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const manifest = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, 'plugin.json'), 'utf8'));
  const pluginName = manifest.name;
  const version = manifest.version || '0.1.0';

  const targetOut = opts.verifyTemp
    ? fs.mkdtempSync(path.join(os.tmpdir(), 'webdev-plugin-verify-'))
    : (opts.outDir || path.join(os.tmpdir(), 'webdev-plugin-dist'));

  fs.mkdirSync(targetOut, { recursive: true });

  try {
    console.log(`=== Packaging Antigravity Plugin: ${pluginName}@${version} ===\n`);
    const bundleDir = stageBundle(targetOut, pluginName);

    const skillCount = fs.readdirSync(path.join(bundleDir, 'skills')).filter(d =>
      fs.existsSync(path.join(bundleDir, 'skills', d, 'SKILL.md'))
    ).length;

    if (skillCount < 16) {
      throw new Error(`Expected at least 16 skills in staged bundle, found ${skillCount}.`);
    }

    console.log(`[PASS] Staged plugin bundle (${skillCount} skills) at: ${bundleDir}`);

    if (!opts.stageOnly) {
      const { tarPath, zipPath, sumsPath } = createArchives(targetOut, pluginName, version);
      console.log(`[PASS] Created archive: ${tarPath}`);
      console.log(`[PASS] Created archive: ${zipPath}`);
      console.log(`[PASS] Created checksums: ${sumsPath}`);
    }

    console.log('\nAntigravity Plugin Packaging: SUCCESS\n');
  } finally {
    if (opts.verifyTemp) {
      fs.rmSync(targetOut, { recursive: true, force: true });
    }
  }
}

main();
