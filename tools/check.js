#!/usr/bin/env node
// Deploy gate. Run: node tools/check.js
//   node tools/check.js --draft drafts/05-odds-and-outs.html   check one unpublished chapter draft
// No dependencies, no network. Exits 1 on the first set of failures.
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = (f) => fs.readFileSync(path.join(root, f), 'utf8');
const exists = (f) => fs.existsSync(path.join(root, f));
const failures = [];
const fail = (msg) => failures.push(msg);
const fig = require('../js/figures.js');
const builder = require('./build.js');

// ---------- The council voice rule ----------
// A real quote sits in a .voice-quote block with quote marks and a source link.
// An imagined voice sits in a .voice-imagined block, uses no quote marks, and says it is "our reading".
// Blocks are matched by their outer tag; a voice block must not nest the same tag inside itself.
const voiceBlocks = (html, cls) =>
  [...html.matchAll(new RegExp(`<(figure|aside|blockquote|div)[^>]*class="[^"]*\\b${cls}\\b[^"]*"[^>]*>([\\s\\S]*?)</\\1>`, 'g'))];
const named = { ldquo: '“', rdquo: '”', lsquo: '‘', laquo: '«', raquo: '»', quot: '"', mdash: '—' };
const plain = (html) => html
  .replace(/<[^>]+>/g, ' ')
  .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
  .replace(/&([a-z]+);/g, (m, n) => named[n] || m);
// The closing single quote is left out: it doubles as the apostrophe.
const QUOTE_MARKS = /[“”‘«»"]/;
function checkVoices(html, file) {
  const quotes = voiceBlocks(html, 'voice-quote');
  quotes.forEach((m, i) => {
    if (!/<a [^>]*href="https?:\/\//.test(m[2])) fail(`${file}: real quote ${i + 1} has no source link`);
    if (!/[“”]/.test(plain(m[2]))) fail(`${file}: real quote ${i + 1} is not in quote marks`);
  });
  voiceBlocks(html, 'voice-imagined').forEach((m, i) => {
    if (/<(q|blockquote)[\s>]/.test(m[2]) || QUOTE_MARKS.test(plain(m[2]))) fail(`${file}: imagined voice ${i + 1} must not use quote marks`);
    if (!/our reading/i.test(m[2])) fail(`${file}: imagined voice ${i + 1} must say it is "our reading"`);
  });
  let rest = html;
  for (const m of quotes) rest = rest.replace(m[0], '');
  if (/<(blockquote|q)[\s>]/.test(rest)) fail(`${file}: a <blockquote> or <q> sits outside a .voice-quote block, so it has no source`);
}
const hasEmDash = (text) => plain(text).includes('—');

// ---------- One chapter fragment ----------
function checkFragment(html, file, opts) {
  opts = opts || {};
  if (hasEmDash(html)) fail(`${file}: contains an em dash`);
  if (/<style[\s>]|\sstyle="/i.test(html)) fail(`${file}: a fragment may not carry its own styles (no <style>, no style="")`);
  if (/<script(?![^>]*type="application\/json")/i.test(html)) fail(`${file}: the only script allowed is a figure's <script type="application/json">`);
  if (/<h1[\s>]/i.test(html)) fail(`${file}: no <h1>; the build adds the chapter title`);
  if (/#[0-9a-f]{3,8}\b(?![^<]*<\/script>)/i.test(html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/href="[^"]*"/g, ''))) fail(`${file}: no hard-coded colors; use the theme (tones in figures, classes in HTML)`);
  if (/<(img|iframe|video|audio)[\s>]/i.test(html)) fail(`${file}: no external media yet (img, iframe, video, audio)`);
  if (!/^\s*<p class="lead">/.test(html)) fail(`${file}: must open with <p class="lead">`);
  checkVoices(html, file);

  // Shorthands expand cleanly.
  try { builder.expandCards(html); } catch (e) { fail(`${file}: ${e.message}`); }
  for (const m of html.matchAll(/\{\{ch:([0-9A-Za-z]+)\}\}/g)) {
    if (!opts.ids || !opts.ids.includes(m[1].toUpperCase())) fail(`${file}: unknown chapter reference ${m[0]}`);
  }
  if (/\{\{|\}\}/.test(html.replace(/\{\{ch:[0-9A-Za-z]+\}\}/g, '').replace(/<script[\s\S]*?<\/script>/g, ''))) fail(`${file}: stray {{ or }}`);

  // Figures: numbered by the build, titled, noted, and every kit figure has a valid spec.
  const figures = [...html.matchAll(/<figure class="figure[^"]*"[^>]*>([\s\S]*?)<\/figure>/g)];
  figures.forEach((m, i) => {
    const n = i + 1;
    if (!/<span class="figure-number">\s*(Fig\.|Table)\s*<\/span>/.test(m[1])) fail(`${file}: figure ${n} needs <span class="figure-number">Fig.</span> or Table (the build numbers it)`);
    if (!/<h3 class="figure-title">[^<]{3,}/.test(m[1])) fail(`${file}: figure ${n} needs an <h3 class="figure-title">`);
    if (!/<p class="figure-note">/.test(m[1])) fail(`${file}: figure ${n} needs a <p class="figure-note"> saying where its numbers come from`);
  });
  const kit = [...html.matchAll(/<div data-fig="([^"]*)"[^>]*>\s*<script type="application\/json">([\s\S]*?)<\/script>\s*<\/div>/g)];
  if (kit.length !== (html.match(/data-fig=/g) || []).length) fail(`${file}: a data-fig element is malformed; it must be <div data-fig="type"><script type="application/json">{...}</script></div>`);
  kit.forEach((m, i) => {
    let spec;
    try { spec = JSON.parse(m[2]); } catch (e) { fail(`${file}: ${m[1]} figure ${i + 1}: the spec is not valid JSON (${e.message})`); return; }
    for (const err of fig.validate(m[1], spec)) fail(`${file}: ${m[1]} figure ${i + 1}: ${err}`);
    if (hasEmDash(m[2])) fail(`${file}: ${m[1]} figure ${i + 1}: contains an em dash`);
  });
  for (const m of html.matchAll(/<svg[^>]*>/g)) {
    if (!/role="img"/.test(m[0]) || !/aria-label="[^"]{10,}"/.test(m[0]) || !/viewBox="/.test(m[0])) fail(`${file}: an inline <svg> needs viewBox, role="img", and an aria-label`);
  }

  if (!opts.appendix) {
    // A figure for every section, a Table Math box, and at least one council voice.
    const sections = html.split(/<h2[\s>]/).slice(1);
    if (sections.length < 3) fail(`${file}: a chapter needs at least three <h2> sections`);
    sections.forEach((s, i) => {
      const title = (s.match(/^[^>]*>?([^<]*)/) || [])[1] || '';
      if (!/<figure class="figure/.test(s) && !/class="tablemath"/.test(s) && !/class="questions"/.test(s)) fail(`${file}: section ${i + 1} ("${title.trim()}") has no figure`);
    });
    if ((html.match(/<aside class="tablemath"/g) || []).length !== 1) fail(`${file}: needs exactly one <aside class="tablemath"> box`);
    if (!/voice-imagined|voice-quote/.test(html)) fail(`${file}: needs at least one council voice`);
    if (figures.length < 4) fail(`${file}: only ${figures.length} figures; a chapter needs at least four`);
  } else if (figures.length < 1) fail(`${file}: an appendix needs at least one figure or table`);
}

const draftAt = process.argv.indexOf('--draft');
const { list } = builder.chapters();
const ids = list.map((c) => c.id);

if (draftAt >= 0) {
  const file = process.argv[draftAt + 1];
  const ch = list.find((c) => c.file === path.basename(file));
  if (!ch) fail(`${file}: the file name must match a chapter in content/chapters.json (for example ${list[0].file})`);
  else checkFragment(fs.readFileSync(path.resolve(file), 'utf8'), file, { ids, appendix: ch.appendix });
} else {
  function walk(dir, out = []) {
    for (const name of fs.readdirSync(path.join(root, dir))) {
      if (name.startsWith('.') || name === 'node_modules' || name === 'drafts') continue;
      const rel = path.join(dir, name);
      if (fs.statSync(path.join(root, rel)).isDirectory()) walk(rel, out);
      else out.push(rel);
    }
    return out;
  }
  const files = walk('.');
  // Pages are full HTML documents. Files under content/ are fragments, checked separately.
  const htmlFiles = files.filter((f) => f.endsWith('.html') && !f.startsWith('content' + path.sep));

  // 1. The version in js/version.js has a changelog entry.
  const m = read('js/version.js').match(/POKER_VERSION\s*=\s*'(\d+\.\d+\.\d+)'/);
  if (!m) fail("js/version.js: no POKER_VERSION = 'x.y.z' found");
  else if (!read('CHANGELOG.md').includes(`## [${m[1]}]`)) fail(`CHANGELOG.md: no "## [${m[1]}]" entry for the current version`);

  // 2. Every local link and asset in every page resolves to a real file.
  for (const file of htmlFiles) {
    for (const lm of read(file).replace(/<pre>[\s\S]*?<\/pre>/g, '').matchAll(/(?:href|src)="([^"]+)"/g)) {
      const ref = lm[1];
      if (/^(https?:|mailto:|#|data:)/.test(ref)) continue;
      let target = path.join(path.dirname(file), ref.split(/[?#]/)[0]);
      if (ref.endsWith('/') || (exists(target) && fs.statSync(path.join(root, target)).isDirectory())) target = path.join(target, 'index.html');
      if (!exists(target)) fail(`${file}: broken link "${ref}"`);
    }
  }

  // 3. Every style used in a page is defined in css/themes.css.
  const themes = read('css/themes.css');
  for (const file of htmlFiles) {
    for (const sm of read(file).matchAll(/<[a-z][^>]*\sdata-style="([^"]+)"/g)) {
      if (!themes.includes(`[data-style="${sm[1]}"]`)) fail(`${file}: style "${sm[1]}" is not defined in css/themes.css`);
    }
  }

  // 4. Every page is mobile-ready and shows the version. The voice rule holds on every page.
  for (const file of htmlFiles) {
    const html = read(file);
    if (!html.includes('name="viewport"')) fail(`${file}: missing viewport meta tag`);
    if (!html.includes('data-version')) fail(`${file}: does not show the version`);
    if (!file.startsWith('chapters' + path.sep)) checkVoices(html.replace(/<pre>[\s\S]*?<\/pre>/g, ''), file);
  }

  // 5. No em dashes in anything a person reads. Superpowers working notes are exempt.
  for (const file of files.filter((f) => /\.(html|md|css|js|json)$/.test(f) && !f.startsWith(path.join('docs', 'superpowers')) && f !== path.join('tools', 'check.js'))) {
    if (hasEmDash(read(file))) fail(`${file}: contains an em dash`);
  }

  // 6. The welcome page opens in the blend and carries the contents markers.
  const home = read('index.html');
  if (!/<html[^>]*\sdata-style="blend"/.test(home)) fail('index.html: must use the "blend" style');

  // 7. Every written chapter passes the fragment rules, and the build is fresh.
  for (const ch of list) {
    const src = 'content/chapters/' + ch.file;
    if (ch.written) checkFragment(read(src), src, { ids, appendix: ch.appendix });
  }
  for (const f of fs.existsSync(path.join(root, 'content/chapters')) ? fs.readdirSync(path.join(root, 'content/chapters')) : []) {
    if (!list.some((c) => c.file === f)) fail(`content/chapters/${f}: no chapter in content/chapters.json has this file name`);
  }
  try {
    const { out } = builder.build();
    for (const [file, content] of Object.entries(out)) {
      if (!exists(file) || read(file) !== content) fail(`${file}: stale. Run node tools/build.js`);
    }
  } catch (e) { fail('build: ' + e.message); }

  // 8. The figure gallery's specs are valid, so the writer's reference is never wrong.
  if (exists('docs/figures.html')) {
    for (const g of read('docs/figures.html').matchAll(/<div data-fig="([^"]*)"[^>]*>\s*<script type="application\/json">([\s\S]*?)<\/script>/g)) {
      try { for (const err of fig.validate(g[1], JSON.parse(g[2]))) fail(`docs/figures.html: ${g[1]}: ${err}`); }
      catch (e) { fail(`docs/figures.html: ${g[1]}: invalid JSON`); }
    }
  }

  // 9. The arithmetic behind the figures and the calculator.
  const poker = require('./poker.js');
  const near = (a, b, tol) => Math.abs(a - b) < (tol || 1e-9);
  if (fig.rangeCount('AA') !== 6 || fig.rangeCount('AKs') !== 4 || fig.rangeCount('AKo') !== 12 || fig.rangeCount('AK') !== 16) fail('figures.rangeCount: a pair is 6 combos, suited 4, offsuit 12');
  if (fig.rangeCount('22+') !== 78 || fig.expandRange('ATs+').join() !== 'ATs,AJs,AQs,AKs' || fig.expandRange('A2s-A5s').length !== 4) fail('figures.expandRange: 22+ is 78 combos; ATs+ is ATs to AKs');
  if (fig.rangeCount('22+,A2+,K2+,Q2+,J2+,T2+,92+,82+,72+,62+,52+,42+,32') !== 1326) fail('figures.rangeCount: every hand together is 1,326 combos');
  const b = fig.betMath(100, 50);
  if (!near(b.call, 0.25) || !near(b.bluff, 1 / 3) || !near(b.mdf, 2 / 3)) fail('figures.betMath: a half-pot bet needs 25% to call, 33% bluff success, 67% defense');
  const d = fig.drawOdds(9);
  if (d.flopToRiver.toFixed(4) !== '0.3497' || d.turnToRiver.toFixed(4) !== '0.1957') fail('figures.drawOdds: nine outs are 34.97% by the river and 19.57% on the river');
  const e = poker.equity([poker.parse('AsKs'), poker.parse('QhQd')], poker.parse('Ts9s2d'));
  if (!near(e[0].equity + e[1].equity, 1, 1e-6) || e[0].equity.toFixed(4) !== '0.5354') fail('poker.equity: AsKs against QhQd on Ts 9s 2d is 53.54%');
  const ev = (s) => poker.evaluate(poker.parse(s));
  if (!(ev('AsKsQsJsTs2d3c') > ev('AsAdAhAc2d3c4h') && ev('AsAdAh2c2d3c4h') > ev('As9s7s5s2s3c4h') && ev('5s4d3h2cAd9c9h') > ev('AsAdAh7c2d3cKh') && ev('AsAd7c7d2h3cKh') > ev('AsAd7c8d2h3cKh'))) fail('poker.evaluate: hand ranks are out of order');
}

if (failures.length) {
  console.error(`check: ${failures.length} problem(s)\n- ` + failures.join('\n- '));
  process.exit(1);
}
console.log(draftAt >= 0 ? 'check: draft ok' : 'check: ok');
