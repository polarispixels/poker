#!/usr/bin/env node
// Publishes one reviewed chapter draft. Run:
//
//   node tools/publish.js <id> "<one-sentence changelog summary>"
//
// <id> is a chapter number (5) or appendix letter (A). The draft must be at drafts/<file>.
// Under a lock, so several writers can finish at once, this script:
//   moves the draft into content/chapters/, bumps the minor version, adds a changelog entry,
//   builds, runs the deploy check, commits, pushes main, and tags the release.
// If the check fails, everything is put back and nothing is published.
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const at = (f) => path.join(root, f);
const run = (cmd) => execSync(cmd, { cwd: root, stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8' });

const [id, summary] = process.argv.slice(2);
if (!id || !summary) { console.error('Usage: node tools/publish.js <id> "<changelog summary>"'); process.exit(1); }
if (summary.includes(String.fromCharCode(8212))) { console.error('publish: no em dashes in the summary'); process.exit(1); }

const lock = at('.publish.lock');
const sleep = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
let held = false;
for (let i = 0; i < 300 && !held; i++) {
  try { fs.mkdirSync(lock); held = true; } catch (e) { sleep(2000); }
}
if (!held) { console.error('publish: another publish has held the lock for 10 minutes. Remove .publish.lock if it is stale.'); process.exit(1); }

let code = 0;
try {
  const { chapters } = require('./build.js');
  const ch = chapters().list.find((c) => c.id === String(id).toUpperCase());
  if (!ch) throw new Error('No chapter or appendix "' + id + '"');
  const draft = at('drafts/' + ch.file), dest = at('content/chapters/' + ch.file);
  if (!fs.existsSync(draft)) throw new Error('No draft at drafts/' + ch.file);
  const dirty = run('git status --porcelain').trim();
  if (dirty) throw new Error('The working tree has uncommitted changes:\n' + dirty);

  const isNew = !fs.existsSync(dest);
  try {
    fs.copyFileSync(draft, dest);
    const vfile = at('js/version.js'), vsrc = fs.readFileSync(vfile, 'utf8');
    const m = vsrc.match(/POKER_VERSION = '(\d+)\.(\d+)\.(\d+)'/);
    const version = m[1] + '.' + (Number(m[2]) + 1) + '.0';
    fs.writeFileSync(vfile, vsrc.replace(m[0], "POKER_VERSION = '" + version + "'"));
    const today = new Date().toISOString().slice(0, 10);
    const entry = `## [${version}] - ${today}\n\n### ${isNew ? 'Added' : 'Changed'}\n\n- ${ch.kind}, ${ch.title}: ${summary.trim().replace(/\.?$/, '.')}\n\n`;
    const cfile = at('CHANGELOG.md'), csrc = fs.readFileSync(cfile, 'utf8');
    fs.writeFileSync(cfile, csrc.replace('## [Unreleased]\n\n', '## [Unreleased]\n\n' + entry));
    run('node tools/build.js');
    run('node tools/check.js');
    run('git add -A');
    const msg = `${isNew ? 'Add' : 'Revise'} ${ch.kind}, ${ch.title} (v${version})\n\n${summary.trim()}\n\nCo-Authored-By: Claude Fable 5.2 <noreply@anthropic.com>\nClaude-Session: https://claude.ai/code/session_012fRRLnZznhj23BtJxEp22J\n`;
    fs.writeFileSync(at('.publish.lock/msg'), msg);
    run('git commit -q -F .publish.lock/msg');
    run('git push -q origin main');
    run(`git tag v${version} && git push -q origin v${version}`);
    fs.unlinkSync(draft);
    console.log(`Published ${ch.kind} as v${version}: https://polarispixels.github.io/poker/chapters/${ch.file}`);
  } catch (e) {
    // Put everything back: tracked files to HEAD, and remove a chapter file that was new.
    try { run('git reset -q && git checkout -- .'); if (isNew && fs.existsSync(dest)) fs.unlinkSync(dest); run('git clean -fdq chapters content'); } catch (e2) { /* report the first error */ }
    throw new Error('Not published. ' + (e.stdout || '') + (e.stderr || e.message));
  }
} catch (e) {
  console.error('publish: ' + e.message);
  code = 1;
} finally {
  fs.rmSync(lock, { recursive: true, force: true });
}
process.exit(code);
