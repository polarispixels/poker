#!/usr/bin/env node
// Deploy gate. Run: node tools/check.js
// No dependencies, no network. Exits 1 on the first set of failures.
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = (f) => fs.readFileSync(path.join(root, f), 'utf8');
const exists = (f) => fs.existsSync(path.join(root, f));
const failures = [];
const fail = (msg) => failures.push(msg);

function walk(dir, out = []) {
  for (const name of fs.readdirSync(path.join(root, dir))) {
    if (name.startsWith('.') || name === 'node_modules') continue;
    const rel = path.join(dir, name);
    if (fs.statSync(path.join(root, rel)).isDirectory()) walk(rel, out);
    else out.push(rel);
  }
  return out;
}
const files = walk('.');
const htmlFiles = files.filter((f) => f.endsWith('.html'));

// 1. The version in js/version.js has a changelog entry.
if (!exists('js/version.js')) fail('js/version.js: missing');
else {
  const m = read('js/version.js').match(/POKER_VERSION\s*=\s*'(\d+\.\d+\.\d+)'/);
  if (!m) fail("js/version.js: no POKER_VERSION = 'x.y.z' found");
  else if (!exists('CHANGELOG.md') || !read('CHANGELOG.md').includes(`## [${m[1]}]`)) {
    fail(`CHANGELOG.md: no "## [${m[1]}]" entry for the current version`);
  }
}

// 2. Every local link and asset in every page resolves to a real file.
for (const file of htmlFiles) {
  for (const m of read(file).matchAll(/(?:href|src)="([^"]+)"/g)) {
    const ref = m[1];
    if (/^(https?:|mailto:|#|data:)/.test(ref)) continue;
    let target = path.join(path.dirname(file), ref.split(/[?#]/)[0]);
    if (ref.endsWith('/') || (exists(target) && fs.statSync(path.join(root, target)).isDirectory())) {
      target = path.join(target, 'index.html');
    }
    if (!exists(target)) fail(`${file}: broken link "${ref}"`);
  }
}

// 3. Every style used in a page is defined in css/themes.css.
const themes = exists('css/themes.css') ? read('css/themes.css') : '';
const styleDefined = (name) => themes.includes(`[data-style="${name}"]`);
for (const file of htmlFiles) {
  for (const m of read(file).matchAll(/\sdata-style="([^"]+)"/g)) {
    if (!styleDefined(m[1])) fail(`${file}: style "${m[1]}" is not defined in css/themes.css`);
  }
}

// 4. Every page is mobile-ready and shows the version.
for (const file of htmlFiles) {
  const html = read(file);
  if (!html.includes('name="viewport"')) fail(`${file}: missing viewport meta tag`);
  if (!html.includes('data-version')) fail(`${file}: does not show the version`);
}

// 5. No em dashes in anything a person reads. Superpowers working notes are exempt.
for (const file of files.filter((f) => /\.(html|md|css|js|json)$/.test(f) && !f.startsWith(path.join('docs', 'superpowers')))) {
  if (file === path.join('tools', 'check.js')) continue;
  const text = read(file);
  if (text.includes('—') || text.includes('&mdash;')) fail(`${file}: contains an em dash`);
}

// 6. The sampler: three styles, opens in the blend, and council voices follow the rule.
//    A real quote links its source. An imagined voice has no quote marks and says it is "our reading".
if (!exists('index.html')) fail('index.html: missing');
else {
  const home = read('index.html');
  if (!/<html[^>]*\sdata-style="blend"/.test(home)) fail('index.html: must open in the "blend" style');
  for (const s of ['academia', 'deco', 'blend']) if (!styleDefined(s)) fail(`css/themes.css: style "${s}" is missing`);
  for (const s of ['academia', 'deco', 'blend']) if (!home.includes(`data-set-style="${s}"`)) fail(`index.html: no switch button for "${s}"`);
  if (!/class="[^"]*\bvoice-quote\b/.test(home)) fail('index.html: no real quote (.voice-quote) to sample');
  if (!/class="[^"]*\bvoice-imagined\b/.test(home)) fail('index.html: no imagined voice (.voice-imagined) to sample');
}

// 7. The council voice rule, on every page.
//    Blocks are matched by their outer tag; a voice block must not nest the same tag inside itself.
const voiceBlocks = (html, cls) =>
  [...html.matchAll(new RegExp(`<(figure|aside|blockquote|div)[^>]*class="[^"]*\\b${cls}\\b[^"]*"[^>]*>([\\s\\S]*?)</\\1>`, 'g'))];
// Text with tags removed and character references decoded, so &#8220; and &ldquo; look like the characters they are.
const named = { ldquo: '“', rdquo: '”', lsquo: '‘', laquo: '«', raquo: '»', quot: '"' };
const plain = (html) => html
  .replace(/<[^>]+>/g, ' ')
  .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
  .replace(/&([a-z]+);/g, (m, n) => named[n] || m);
// Opening and closing double quotes, an opening single quote, guillemets, and straight double quotes.
// The closing single quote is left out: it doubles as the apostrophe.
const QUOTE_MARKS = /[“”‘«»"]/;
for (const file of htmlFiles) {
  const html = read(file);
  const quotes = voiceBlocks(html, 'voice-quote');
  quotes.forEach((m, i) => {
    if (!/<a [^>]*href="https?:\/\//.test(m[2])) fail(`${file}: real quote ${i + 1} has no source link`);
  });
  voiceBlocks(html, 'voice-imagined').forEach((m, i) => {
    if (/<(q|blockquote)[\s>]/.test(m[2]) || QUOTE_MARKS.test(plain(m[2]))) fail(`${file}: imagined voice ${i + 1} must not use quote marks`);
    if (!/our reading/i.test(m[2])) fail(`${file}: imagined voice ${i + 1} must say it is "our reading"`);
  });
  // A <blockquote> or <q> anywhere else is a quote without the rule's frame and source.
  let rest = html;
  for (const m of quotes) rest = rest.replace(m[0], '');
  if (/<(blockquote|q)[\s>]/.test(rest)) fail(`${file}: a <blockquote> or <q> sits outside a .voice-quote block, so it has no source`);
}

if (failures.length) {
  console.error(`check: ${failures.length} problem(s)\n- ` + failures.join('\n- '));
  process.exit(1);
}
console.log(`check: ok (${htmlFiles.length} page(s))`);
