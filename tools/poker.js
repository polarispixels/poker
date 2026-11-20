#!/usr/bin/env node
// Poker arithmetic for writers and reviewers. Exact where it can be. No dependencies.
//
//   node tools/poker.js equity "AsKs" "QhQd" [more hands] [--board "Ts 9s 2d"]
//   node tools/poker.js vsrange "AsKs" "TT+,AQs+,AKo" [--board "Ts 9s 2d"]
//   node tools/poker.js draw 9                 outs: exact odds and the rule of 2 and 4
//   node tools/poker.js combos "22+,ATs+,KQo"  count hands in a range
//   node tools/poker.js odds 100 50            pot 100, bet 50: equity to call, bluff break-even, MDF
//
// Every number that appears in a chapter should come from here or from shown arithmetic.
const path = require('path');
const fig = require(path.join(__dirname, '..', 'js', 'figures.js'));

const R = '23456789TJQKA', S = 'cdhs';
function card(s) {
  const r = R.indexOf(s[0].toUpperCase()), u = S.indexOf(s[1].toLowerCase());
  if (r < 0 || u < 0) throw new Error('Bad card "' + s + '"');
  return r * 4 + u;
}
const parse = (str) => ((str || '').match(/[2-9TJQKAtjqka][cdhsCDHS]/g) || []).map(card);
const show = (c) => R[c >> 2] + S[c & 3];

// Best five of up to seven cards, as one comparable number. Higher wins.
function evaluate(cs) {
  const rc = new Array(13).fill(0), sc = [0, 0, 0, 0], sm = [0, 0, 0, 0];
  let mask = 0;
  for (const c of cs) { const r = c >> 2, s = c & 3; rc[r]++; sc[s]++; sm[s] |= 1 << r; mask |= 1 << r; }
  const straight = (m) => {
    for (let h = 12; h >= 4; h--) if (((m >> (h - 4)) & 31) === 31) return h;
    return (m & 0x100F) === 0x100F ? 3 : -1; // the wheel: A2345
  };
  const pack = (arr) => arr.reduce((a, v) => a * 13 + v, 0);
  let fs = -1;
  for (let s = 0; s < 4; s++) if (sc[s] >= 5) fs = s;
  if (fs >= 0) { const sf = straight(sm[fs]); if (sf >= 0) return 8e10 + sf; }
  let quads = -1;
  const trips = [], pairs = [], singles = [];
  for (let r = 12; r >= 0; r--) {
    if (rc[r] === 4) quads = r; else if (rc[r] === 3) trips.push(r); else if (rc[r] === 2) pairs.push(r); else if (rc[r] === 1) singles.push(r);
  }
  if (quads >= 0) return 7e10 + pack([quads, Math.max(...trips, ...pairs, ...singles)]);
  if (trips.length >= 2 || (trips.length && pairs.length)) {
    return 6e10 + pack([trips[0], Math.max(trips.length > 1 ? trips[1] : -1, pairs.length ? pairs[0] : -1)]);
  }
  if (fs >= 0) { const top = []; for (let r = 12; r >= 0 && top.length < 5; r--) if ((sm[fs] >> r) & 1) top.push(r); return 5e10 + pack(top); }
  const st = straight(mask);
  if (st >= 0) return 4e10 + st;
  if (trips.length) return 3e10 + pack([trips[0], ...singles.slice(0, 2)]);
  if (pairs.length >= 2) return 2e10 + pack([pairs[0], pairs[1], Math.max(...pairs.slice(2), ...singles)]);
  if (pairs.length === 1) return 1e10 + pack([pairs[0], ...singles.slice(0, 3)]);
  return pack(singles.slice(0, 5));
}

function forEachCombo(deck, k, fn) {
  const pick = new Array(k);
  (function go(start, depth) {
    if (depth === k) { fn(pick); return; }
    for (let i = start; i <= deck.length - (k - depth); i++) { pick[depth] = deck[i]; go(i + 1, depth + 1); }
  })(0, 0);
}

// Exact all-in equity for known hands. Returns [{win, tie, equity}] as fractions.
function equity(hands, board) {
  board = board || [];
  const dead = new Set([...board, ...hands.flat()]);
  if (dead.size !== board.length + hands.length * 2) throw new Error('The same card appears twice');
  const deck = []; for (let c = 0; c < 52; c++) if (!dead.has(c)) deck.push(c);
  const res = hands.map(() => ({ win: 0, tie: 0, equity: 0 }));
  let n = 0;
  const seven = hands.map((h) => [h[0], h[1], ...board, ...new Array(5 - board.length).fill(0)]);
  forEachCombo(deck, 5 - board.length, (pick) => {
    let best = -1, count = 0; const vals = [];
    for (let i = 0; i < hands.length; i++) {
      for (let j = 0; j < pick.length; j++) seven[i][2 + board.length + j] = pick[j];
      const v = evaluate(seven[i]); vals.push(v);
      if (v > best) { best = v; count = 1; } else if (v === best) count++;
    }
    for (let i = 0; i < hands.length; i++) if (vals[i] === best) { if (count === 1) res[i].win++; else res[i].tie++; res[i].equity += 1 / count; }
    n++;
  });
  return res.map((r) => ({ win: r.win / n, tie: r.tie / n, equity: r.equity / n }));
}

// Every specific two-card combo in a range string, skipping dead cards.
function rangeCombos(range, dead) {
  dead = new Set(dead || []);
  const out = [];
  for (const t of fig.expandRange(range)) {
    const a = R.indexOf(t[0]), b = R.indexOf(t[1]);
    for (let s1 = 0; s1 < 4; s1++) for (let s2 = 0; s2 < 4; s2++) {
      if (a === b && s1 >= s2) continue;
      if (a !== b && ((t[2] === 's') !== (s1 === s2))) continue;
      const c1 = a * 4 + s1, c2 = b * 4 + s2;
      if (!dead.has(c1) && !dead.has(c2)) out.push([c1, c2]);
    }
  }
  return out;
}

// Hero against a range. Exact with a flop or later; seeded sampling before the flop.
function vsRange(hero, range, board, samples) {
  board = board || [];
  const combos = rangeCombos(range, [...hero, ...board]);
  if (!combos.length) throw new Error('No combos left in that range');
  if (board.length >= 3) {
    let eq = 0;
    for (const v of combos) eq += equity([hero, v], board)[0].equity;
    return { equity: eq / combos.length, combos: combos.length, exact: true };
  }
  let seed = 20261120;
  const rand = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  samples = samples || 400000;
  let eq = 0;
  for (let n = 0; n < samples; n++) {
    const v = combos[Math.floor(rand() * combos.length)];
    const used = new Set([...hero, ...v, ...board]);
    const full = board.slice();
    while (full.length < 5) { const c = Math.floor(rand() * 52); if (!used.has(c)) { used.add(c); full.push(c); } }
    const a = evaluate([...hero, ...full]), b = evaluate([...v, ...full]);
    eq += a > b ? 1 : a === b ? 0.5 : 0;
  }
  return { equity: eq / samples, combos: combos.length, exact: false, samples };
}

module.exports = { card, parse, show, evaluate, equity, rangeCombos, vsRange };

if (require.main === module) {
  const args = process.argv.slice(2);
  const bi = args.indexOf('--board');
  const board = bi >= 0 ? parse(args[bi + 1]) : [];
  const rest = bi >= 0 ? args.slice(0, bi).concat(args.slice(bi + 2)) : args;
  const pct = (x) => (x * 100).toFixed(2) + '%';
  const cmd = rest[0];
  try {
    if (cmd === 'equity') {
      const hands = rest.slice(1).map(parse);
      if (hands.length < 2 || hands.some((h) => h.length !== 2)) throw new Error('Give two or more hands like "AsKs" "QhQd"');
      equity(hands, board).forEach((r, i) => console.log(`${hands[i].map(show).join('')}  equity ${pct(r.equity)}  (wins ${pct(r.win)}, ties ${pct(r.tie)})`));
      console.log('Exact: every possible board counted.');
    } else if (cmd === 'vsrange') {
      const r = vsRange(parse(rest[1]), rest[2], board);
      console.log(`Hero equity ${pct(r.equity)} against ${r.combos} combos. ` + (r.exact ? 'Exact.' : `Sampled (${r.samples} deals, good to about 0.2 points).`));
    } else if (cmd === 'draw') {
      const d = fig.drawOdds(Number(rest[1]));
      console.log(`${rest[1]} outs. Flop to river: ${pct(d.flopToRiver)} (rule of 4 says ${d.rule4}%). Turn to river: ${pct(d.turnToRiver)} (rule of 2 says ${d.rule2}%). One card from the flop: ${pct(d.flopToTurn)}.`);
    } else if (cmd === 'combos') {
      const n = fig.rangeCount(rest[1]);
      console.log(`${n} combos of 1,326: ${pct(n / 1326)} of all starting hands. Hand types: ${fig.expandRange(rest[1]).join(' ')}`);
    } else if (cmd === 'odds') {
      const o = fig.betMath(Number(rest[1]), Number(rest[2]));
      console.log(`Pot ${rest[1]}, bet ${rest[2]}. Equity needed to call: ${pct(o.call)}. Bluff must work: ${pct(o.bluff)}. Minimum defense frequency: ${pct(o.mdf)}.`);
    } else {
      console.log('Commands: equity, vsrange, draw, combos, odds. See the top of tools/poker.js.');
    }
  } catch (e) { console.error('poker: ' + e.message); process.exit(1); }
}
