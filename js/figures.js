// The figure kit. A chapter asks for a figure with a type and a JSON spec:
//
//   <div data-fig="bars"><script type="application/json">{ ... }</script></div>
//
// Types: bars, columns, line, split, dots, range, table, scatter, heat.
// The gallery at docs/figures.html shows every type with its spec.
//
// This file also runs in Node (tools/check.js, tools/poker.js), so everything that
// touches document or window stays below the "typeof document" guard.
(function (root) {
  'use strict';

  // ---------- Pure helpers: ranges and arithmetic ----------

  var RANKS = 'AKQJT98765432';
  function ri(r) { var i = RANKS.indexOf(r); if (i < 0) throw new Error('Bad rank "' + r + '"'); return i; }
  function handType(a, b, suf) { return a === b ? RANKS[a] + RANKS[a] : RANKS[Math.min(a, b)] + RANKS[Math.max(a, b)] + suf; }

  // "TT+", "22-66", "AKs", "AK", "ATs+", "A2s-A5s"  ->  ["TT", "JJ", ...]
  function expandToken(tok) {
    var t = tok.trim(), m, out = [], i, hi, lo, a, b, sufs;
    if (!t) return out;
    if ((m = t.match(/^([AKQJT2-9])\1(\+)?$/))) {
      a = ri(m[1]);
      for (i = a; i >= (m[2] ? 0 : a); i--) out.push(handType(i, i));
      return out;
    }
    if ((m = t.match(/^([AKQJT2-9])\1-([AKQJT2-9])\2$/))) {
      a = ri(m[1]); b = ri(m[2]);
      for (i = Math.min(a, b); i <= Math.max(a, b); i++) out.push(handType(i, i));
      return out;
    }
    if ((m = t.match(/^([AKQJT2-9])([AKQJT2-9])([so])?(\+)?$/))) {
      hi = Math.min(ri(m[1]), ri(m[2])); lo = Math.max(ri(m[1]), ri(m[2]));
      if (hi === lo) throw new Error('Cannot read range token "' + tok + '"');
      sufs = m[3] ? [m[3]] : ['s', 'o'];
      for (i = lo; i >= (m[4] ? hi + 1 : lo); i--) sufs.forEach(function (s) { out.push(handType(hi, i, s)); });
      return out;
    }
    if ((m = t.match(/^([AKQJT2-9])([AKQJT2-9])([so])?-\1([AKQJT2-9])([so])?$/)) && (m[3] || '') === (m[5] || '')) {
      hi = ri(m[1]); a = ri(m[2]); b = ri(m[4]);
      sufs = m[3] ? [m[3]] : ['s', 'o'];
      for (i = Math.min(a, b); i <= Math.max(a, b); i++) sufs.forEach(function (s) { out.push(handType(hi, i, s)); });
      return out;
    }
    throw new Error('Cannot read range token "' + tok + '"');
  }
  function expandRange(str) {
    var seen = {}, out = [];
    String(str || '').split(',').forEach(function (tok) {
      expandToken(tok).forEach(function (h) { if (!seen[h]) { seen[h] = 1; out.push(h); } });
    });
    return out;
  }
  function typeCombos(h) { return h.length === 2 ? 6 : h[2] === 's' ? 4 : 12; }
  function rangeCount(str) { return expandRange(str).reduce(function (n, h) { return n + typeCombos(h); }, 0); }

  // Pot and bet in the same units, pot counted before the bet.
  function betMath(pot, bet) {
    return { call: bet / (pot + 2 * bet), bluff: bet / (pot + bet), mdf: pot / (pot + bet) };
  }
  // Odds of hitting at least one of `outs` cards, from 47 unseen on the flop or 46 on the turn.
  function drawOdds(outs) {
    return {
      flopToRiver: 1 - ((47 - outs) * (46 - outs)) / (47 * 46),
      flopToTurn: outs / 47,
      turnToRiver: outs / 46,
      rule4: outs * 4,
      rule2: outs * 2
    };
  }

  // ---------- Spec validation (used by the deploy check) ----------

  var TONE_NAMES = ['ink', 'accent', 'accent2', 'gold', 'muted', 'ink-soft', 'accent-soft', 'accent2-soft', 'gold-soft', 'paper'];
  function isNum(v) { return typeof v === 'number' && isFinite(v); }
  function validate(type, spec) {
    var errs = [];
    function need(cond, msg) { if (!cond) errs.push(msg); }
    function tone(t, where) { if (t !== undefined && TONE_NAMES.indexOf(t) < 0) errs.push(where + ': unknown tone "' + t + '"'); }
    if (!spec || typeof spec !== 'object') return ['spec must be a JSON object'];
    need(typeof spec.label === 'string' && spec.label.length > 10, 'label: a sentence describing the figure for screen readers is required');
    if (type === 'bars') {
      need(Array.isArray(spec.items) && spec.items.length, 'items: a list is required');
      (spec.items || []).forEach(function (it, i) { need(it && typeof it.label === 'string' && isNum(it.value), 'items[' + i + ']: needs label and numeric value'); tone(it && it.tone, 'items[' + i + ']'); });
    } else if (type === 'columns' || type === 'line') {
      need(Array.isArray(spec.series) && spec.series.length, 'series: a list is required');
      (spec.series || []).forEach(function (s, i) {
        tone(s && s.tone, 'series[' + i + ']');
        need(s && typeof s.name === 'string', 'series[' + i + ']: needs a name');
        if (spec.categories) need(s && Array.isArray(s.values) && s.values.length === spec.categories.length && s.values.every(isNum), 'series[' + i + ']: values must be numbers, one per category');
        else need(type === 'line' && s && Array.isArray(s.points) && s.points.every(function (p) { return Array.isArray(p) && isNum(p[0]) && isNum(p[1]); }), 'series[' + i + ']: needs points as [x, y] pairs, or give categories and values');
      });
      if (type === 'columns') need(Array.isArray(spec.categories), 'categories: a list is required');
    } else if (type === 'split') {
      need(Array.isArray(spec.rows) && spec.rows.length, 'rows: a list is required');
      (spec.rows || []).forEach(function (r, i) {
        need(r && Array.isArray(r.parts) && r.parts.length, 'rows[' + i + ']: needs parts');
        ((r && r.parts) || []).forEach(function (p, j) { need(p && typeof p.label === 'string' && isNum(p.value) && p.value >= 0, 'rows[' + i + '].parts[' + j + ']: needs label and value'); tone(p && p.tone, 'rows[' + i + '].parts[' + j + ']'); });
      });
    } else if (type === 'dots') {
      need(Array.isArray(spec.parts) && spec.parts.length, 'parts: a list is required');
      var sum = 0;
      (spec.parts || []).forEach(function (p, i) { need(p && typeof p.label === 'string' && isNum(p.value) && p.value === Math.round(p.value), 'parts[' + i + ']: needs label and a whole-number value'); tone(p && p.tone, 'parts[' + i + ']'); sum += (p && p.value) || 0; });
      need(sum === 100, 'parts: values must add to 100 (they add to ' + sum + ')');
    } else if (type === 'range') {
      need(Array.isArray(spec.groups) && spec.groups.length, 'groups: a list is required');
      var seen = {};
      (spec.groups || []).forEach(function (g, i) {
        tone(g && g.tone, 'groups[' + i + ']');
        need(g && typeof g.name === 'string', 'groups[' + i + ']: needs a name');
        try { expandRange(g && g.hands).forEach(function (h) { if (seen[h]) errs.push('groups[' + i + ']: ' + h + ' is already in an earlier group'); seen[h] = 1; }); }
        catch (e) { errs.push('groups[' + i + ']: ' + e.message); }
      });
    } else if (type === 'table') {
      need(Array.isArray(spec.seats) && spec.seats.length >= 2 && spec.seats.length <= 10, 'seats: 2 to 10 seats are required');
      (spec.seats || []).forEach(function (s, i) { need(s && typeof s.pos === 'string', 'seats[' + i + ']: needs pos'); need(!s || !s.state || ['hero', 'fold', 'active', 'villain'].indexOf(s.state) >= 0, 'seats[' + i + ']: state must be hero, villain, active, or fold'); });
    } else if (type === 'scatter') {
      need(Array.isArray(spec.points) && spec.points.length, 'points: a list is required');
      (spec.points || []).forEach(function (p, i) { need(p && typeof p.label === 'string' && isNum(p.x) && isNum(p.y), 'points[' + i + ']: needs label, x, y'); tone(p && p.tone, 'points[' + i + ']'); });
      need(spec.x && typeof spec.x.label === 'string' && spec.y && typeof spec.y.label === 'string', 'x.label and y.label are required');
    } else if (type === 'heat') {
      need(Array.isArray(spec.rows) && Array.isArray(spec.cols) && Array.isArray(spec.values), 'rows, cols, and values are required');
      need((spec.values || []).length === (spec.rows || []).length && (spec.values || []).every(function (r) { return Array.isArray(r) && r.length === (spec.cols || []).length && r.every(isNum); }), 'values: one row of numbers per row label, one number per column');
      tone(spec.tone, 'tone');
    } else {
      errs.push('unknown figure type "' + type + '"');
    }
    return errs;
  }

  var api = {
    types: ['bars', 'columns', 'line', 'split', 'dots', 'range', 'table', 'scatter', 'heat'],
    tones: TONE_NAMES,
    expandRange: expandRange, rangeCount: rangeCount, typeCombos: typeCombos,
    betMath: betMath, drawOdds: drawOdds, validate: validate
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof document === 'undefined') return;
  root.PokerFigures = api;

  // ---------- Drawing ----------

  var NS = 'http://www.w3.org/2000/svg';
  function mix(v, p) { return 'color-mix(in srgb, var(' + v + ') ' + p + '%, var(--bg))'; }
  var TONES = {
    ink: 'var(--fg)', accent: 'var(--accent)', accent2: 'var(--accent-2)', gold: 'var(--ornament)', muted: 'var(--muted)',
    'ink-soft': mix('--fg', 22), 'accent-soft': mix('--accent', 30), 'accent2-soft': mix('--accent-2', 30), 'gold-soft': mix('--ornament', 38),
    paper: 'var(--surface)'
  };
  var DARK = { ink: 1, accent: 1, accent2: 1, muted: 1 };
  var CYCLE = ['ink', 'accent', 'accent2', 'gold', 'muted', 'accent-soft', 'accent2-soft'];
  function color(t, i) { return TONES[t] || TONES[CYCLE[(i || 0) % CYCLE.length]]; }
  function toneOf(t, i) { return TONES[t] ? t : CYCLE[(i || 0) % CYCLE.length]; }
  function onColor(t) { return DARK[t] ? 'var(--bg)' : 'var(--fg)'; }

  function el(name, attrs, parent) {
    var n = document.createElementNS(NS, name), k;
    for (k in attrs) if (attrs[k] !== undefined && attrs[k] !== null) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  function makeSvg(host, w, h, label) {
    return el('svg', { width: w, height: h, viewBox: '0 0 ' + w + ' ' + h, role: 'img', 'aria-label': label }, host);
  }
  // o: size, anchor, fill, weight, italic, label (use the label font)
  function text(svg, x, y, str, o) {
    o = o || {};
    var t = el('text', {
      x: x, y: y, 'text-anchor': o.anchor || 'start',
      style: 'font-family:var(' + (o.label ? '--font-label' : '--font-body') + ');font-size:' + (o.size || 15) + 'px;fill:' + (o.fill || 'var(--fg)') +
        ';font-weight:' + (o.weight || 400) + (o.italic ? ';font-style:italic' : '') + (o.label ? ';letter-spacing:0.06em' : '')
    }, svg);
    t.textContent = str;
    return t;
  }
  function tw(str, size, label) { return String(str).length * (size || 15) * (label ? 0.62 : 0.5); }
  function fmt(v, unit) {
    var s = Math.abs(v) >= 1000 ? Math.round(v).toLocaleString('en-US') : String(Math.round(v * 10) / 10);
    if (unit === '$') return (v < 0 ? '-$' : '$') + s.replace('-', '');
    return s + (unit || '');
  }
  function ticks(min, max, n) {
    var span = max - min || 1, step = Math.pow(10, Math.floor(Math.log10(span / n))), err = span / n / step;
    step *= err >= 7.5 ? 10 : err >= 3.5 ? 5 : err >= 1.5 ? 2 : 1;
    var out = [], v = Math.ceil(min / step - 1e-9) * step;
    for (; v <= max + step * 1e-6; v += step) out.push(Math.round(v * 1e6) / 1e6);
    return out;
  }
  // A wrapping legend. Returns the height it used.
  function legend(svg, items, x, y, w) {
    var cx = x, cy = y, size = 14;
    items.forEach(function (it) {
      var iw = 22 + tw(it.label, size) + 18;
      if (cx > x && cx + iw > x + w) { cx = x; cy += 22; }
      el('rect', { x: cx, y: cy - 11, width: 14, height: 14, style: 'fill:' + it.color + ';stroke:var(--fg);stroke-width:0.5' }, svg);
      text(svg, cx + 20, cy + 1, it.label, { size: size });
      cx += iw;
    });
    return cy - y + 24;
  }

  var draw = {};

  draw.bars = function (host, spec, W) {
    var items = spec.items, unit = spec.unit || '', rowH = 48;
    var max = spec.max || Math.max.apply(null, items.map(function (i) { return i.value; })) || 1;
    var valW = Math.max.apply(null, items.map(function (i) { return tw(fmt(i.value, unit), 15); })) + 12;
    var barW = W - valW;
    var svg = makeSvg(host, W, items.length * rowH + 4, spec.label);
    items.forEach(function (it, i) {
      var y = i * rowH, t = toneOf(it.tone || spec.tone || 'ink', 0), w = Math.max(2, (it.value / max) * barW);
      text(svg, 0, y + 16, it.label, { size: 15, weight: 600 });
      if (it.note && tw(it.label, 15) + tw(it.note, 13) + 16 < W) text(svg, W, y + 16, it.note, { size: 13, anchor: 'end', fill: 'var(--muted)', italic: true });
      el('rect', { x: 0, y: y + 24, width: barW, height: 14, style: 'fill:var(--surface)' }, svg);
      el('rect', { x: 0, y: y + 24, width: w, height: 14, style: 'fill:' + color(t) }, svg);
      text(svg, Math.min(w + 8, barW + 8), y + 36, fmt(it.value, unit), { size: 15, weight: 600 });
    });
  };

  function axes(svg, W, H, m, yT, yUnit, yMin, yMax) {
    var y = function (v) { return m.t + (H - m.t - m.b) * (1 - (v - yMin) / (yMax - yMin)); };
    yT.forEach(function (v) {
      el('line', { x1: m.l, x2: W - m.r, y1: y(v), y2: y(v), style: 'stroke:var(--muted);stroke-width:' + (v === 0 ? 1.2 : 0.4) + ';opacity:' + (v === 0 ? 0.9 : 0.6) }, svg);
      text(svg, m.l - 6, y(v) + 4, fmt(v, yUnit), { size: 12, anchor: 'end', fill: 'var(--muted)' });
    });
    return y;
  }

  draw.columns = function (host, spec, W) {
    var cats = spec.categories, series = spec.series, unit = spec.unit || '';
    var all = []; series.forEach(function (s) { all = all.concat(s.values); });
    var yMin = Math.min(0, spec.min !== undefined ? spec.min : Math.min.apply(null, all));
    var yMax = spec.max !== undefined ? spec.max : Math.max.apply(null, all);
    var yT = ticks(yMin, yMax, 4); yMax = Math.max(yMax, yT[yT.length - 1]); yMin = Math.min(yMin, yT[0]);
    var H = Math.round(Math.min(360, Math.max(240, W * 0.5)));
    var svg = makeSvg(host, W, H, spec.label);
    var top = series.length > 1 ? legend(svg, series.map(function (s, i) { return { label: s.name, color: color(s.tone, i) }; }), 0, 14, W) + 8 : 16;
    var m = { l: 44, r: 6, t: top + 14, b: spec.xLabel ? 50 : 30 };
    var y = axes(svg, W, H, m, yT, unit, yMin, yMax);
    var gw = (W - m.l - m.r) / cats.length, bw = Math.min(46, (gw * 0.76) / series.length);
    var small = gw < 54;
    cats.forEach(function (c, ci) {
      var gx = m.l + gw * ci + (gw - bw * series.length) / 2;
      series.forEach(function (s, si) {
        var v = s.values[ci], y0 = y(0), y1 = y(v);
        el('rect', { x: gx + si * bw + 1, y: Math.min(y0, y1), width: bw - 2, height: Math.max(1, Math.abs(y1 - y0)), style: 'fill:' + color(s.tone, si) }, svg);
        if (bw >= 26 && spec.values !== false) text(svg, gx + si * bw + bw / 2, Math.min(y0, y1) - 5, fmt(v, unit), { size: 12, anchor: 'middle', weight: 600 });
      });
      text(svg, m.l + gw * ci + gw / 2, H - m.b + 18, c, { size: small ? 11 : 13, anchor: 'middle' });
    });
    if (spec.xLabel) text(svg, m.l + (W - m.l - m.r) / 2, H - 8, spec.xLabel, { size: 13, anchor: 'middle', fill: 'var(--muted)', italic: true });
    if (spec.yLabel) text(svg, 0, m.t - 12, spec.yLabel, { size: 13, fill: 'var(--muted)', italic: true });
  };

  draw.line = function (host, spec, W) {
    var series = spec.series, cats = spec.categories, yUnit = spec.yUnit || '', xUnit = spec.xUnit || '';
    var pts = series.map(function (s) { return cats ? s.values.map(function (v, i) { return [i, v]; }) : s.points; });
    var xs = [], ys = [];
    pts.forEach(function (p) { p.forEach(function (q) { xs.push(q[0]); ys.push(q[1]); }); });
    (spec.refs || []).forEach(function (r) { if (r.y !== undefined) ys.push(r.y); });
    var xMin = spec.xMin !== undefined ? spec.xMin : Math.min.apply(null, xs), xMax = spec.xMax !== undefined ? spec.xMax : Math.max.apply(null, xs);
    var yMin = spec.yMin !== undefined ? spec.yMin : Math.min.apply(null, ys), yMax = spec.yMax !== undefined ? spec.yMax : Math.max.apply(null, ys);
    if (spec.yMin === undefined && yMin > 0 && yMin < (yMax - yMin)) yMin = 0;
    var yT = ticks(yMin, yMax, 4); yMin = Math.min(yMin, yT[0]); yMax = Math.max(yMax, yT[yT.length - 1]);
    var H = Math.round(Math.min(380, Math.max(250, W * 0.52)));
    var svg = makeSvg(host, W, H, spec.label);
    var top = legend(svg, series.map(function (s, i) { return { label: s.name, color: color(s.tone, i) }; }), 0, 14, W) + 8;
    var m = { l: 46, r: 14, t: top + 14, b: spec.xLabel ? 50 : 30 };
    var y = axes(svg, W, H, m, yT, yUnit, yMin, yMax);
    var x = function (v) { return m.l + (W - m.l - m.r) * ((v - xMin) / ((xMax - xMin) || 1)); };
    var xT = cats ? cats.map(function (c, i) { return i; }) : ticks(xMin, xMax, W < 420 ? 4 : 7);
    var skip = cats && cats.length * 44 > W ? Math.ceil((cats.length * 44) / W) : 1;
    xT.forEach(function (v, i) {
      if (i % skip) return;
      el('line', { x1: x(v), x2: x(v), y1: H - m.b, y2: H - m.b + 4, style: 'stroke:var(--muted)' }, svg);
      text(svg, x(v), H - m.b + 18, cats ? cats[v] : fmt(v, xUnit), { size: 12, anchor: 'middle', fill: 'var(--muted)' });
    });
    (spec.refs || []).forEach(function (r) {
      if (r.x !== undefined) {
        el('line', { x1: x(r.x), x2: x(r.x), y1: m.t, y2: H - m.b, style: 'stroke:var(--fg);stroke-width:1;stroke-dasharray:4 4' }, svg);
        if (r.label) text(svg, x(r.x) + (x(r.x) < W * 0.6 ? 5 : -5), m.t + 12, r.label, { size: 12, anchor: x(r.x) < W * 0.6 ? 'start' : 'end', italic: true });
        return;
      }
      el('line', { x1: m.l, x2: W - m.r, y1: y(r.y), y2: y(r.y), style: 'stroke:var(--fg);stroke-width:1;stroke-dasharray:4 4' }, svg);
      if (r.label) text(svg, W - m.r, y(r.y) - 5, r.label, { size: 12, anchor: 'end', italic: true });
    });
    pts.forEach(function (p, i) {
      var c = color(series[i].tone, i);
      el('polyline', { points: p.map(function (q) { return x(q[0]) + ',' + y(q[1]); }).join(' '), style: 'fill:none;stroke:' + c + ';stroke-width:2.5;stroke-linejoin:round' + (series[i].dashed ? ';stroke-dasharray:6 4' : '') }, svg);
      if (p.length <= 14) p.forEach(function (q) { el('circle', { cx: x(q[0]), cy: y(q[1]), r: 3, style: 'fill:' + c }, svg); });
    });
    (spec.marks || []).forEach(function (k) {
      el('circle', { cx: x(k.x), cy: y(k.y), r: 5, style: 'fill:var(--bg);stroke:var(--fg);stroke-width:2' }, svg);
      var right = x(k.x) < W * 0.6;
      text(svg, x(k.x) + (right ? 9 : -9), y(k.y) - 8, k.label, { size: 13, anchor: right ? 'start' : 'end', weight: 600 });
    });
    if (spec.xLabel) text(svg, m.l + (W - m.l - m.r) / 2, H - 8, spec.xLabel, { size: 13, anchor: 'middle', fill: 'var(--muted)', italic: true });
    if (spec.yLabel) text(svg, 0, m.t - 12, spec.yLabel, { size: 13, fill: 'var(--muted)', italic: true });
  };

  draw.split = function (host, spec, W) {
    var unit = spec.unit === undefined ? '%' : spec.unit, rowH = 62, leg = [], seen = {};
    spec.rows.forEach(function (r) { r.parts.forEach(function (p, j) { var t = toneOf(p.tone, j); if (!seen[p.label]) { seen[p.label] = 1; leg.push({ label: p.label, color: color(t) }); } }); });
    var svg = makeSvg(host, W, 10, spec.label);
    spec.rows.forEach(function (r, i) {
      var y = i * rowH, total = r.parts.reduce(function (a, p) { return a + p.value; }, 0) || 1, x = 0;
      if (r.label) text(svg, 0, y + 16, r.label, { size: 15, weight: 600 });
      if (r.note && tw(r.label || '', 15) + tw(r.note, 13) + 16 < W) text(svg, W, y + 16, r.note, { size: 13, anchor: 'end', fill: 'var(--muted)', italic: true });
      r.parts.forEach(function (p, j) {
        var t = toneOf(p.tone, j), w = (p.value / total) * W, lab = fmt(p.value, unit);
        el('rect', { x: x, y: y + 24, width: Math.max(0, w - 1), height: 26, style: 'fill:' + color(t) }, svg);
        if (w > tw(lab, 14) + 10) text(svg, x + w / 2, y + 42, lab, { size: 14, anchor: 'middle', fill: onColor(t), weight: 600 });
        x += w;
      });
    });
    var lh = legend(svg, leg, 0, spec.rows.length * rowH + 14, W);
    var H = spec.rows.length * rowH + lh + 6;
    svg.setAttribute('height', H); svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
  };

  draw.dots = function (host, spec, W) {
    var side = Math.min(W, 340), cell = side / 10, tones = [];
    spec.parts.forEach(function (p, i) { for (var k = 0; k < p.value; k++) tones.push(toneOf(p.tone, i)); });
    var wide = W >= 560, svg = makeSvg(host, W, 10, spec.label);
    for (var n = 0; n < 100; n++) {
      el('circle', { cx: (n % 10) * cell + cell / 2, cy: Math.floor(n / 10) * cell + cell / 2, r: cell * 0.36, style: 'fill:' + color(tones[n]) + ';stroke:var(--fg);stroke-width:0.5' }, svg);
    }
    var lx = wide ? side + 28 : 0, ly = wide ? 24 : side + 22;
    spec.parts.forEach(function (p, i) {
      el('circle', { cx: lx + 8, cy: ly - 5, r: 8, style: 'fill:' + color(toneOf(p.tone, i)) + ';stroke:var(--fg);stroke-width:0.5' }, svg);
      text(svg, lx + 24, ly, p.value + ' in 100', { size: 15, weight: 600 });
      text(svg, lx + 24, ly + 18, p.label, { size: 14, fill: 'var(--muted)' });
      ly += 46;
    });
    var H = wide ? Math.max(side, ly) : ly;
    svg.setAttribute('height', H); svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
  };

  draw.range = function (host, spec, W) {
    var side = Math.min(W, 546), cell = side / 13, map = {}, leg = [], total = 0;
    spec.groups.forEach(function (g, gi) {
      var t = toneOf(g.tone, gi), hands = expandRange(g.hands), n = hands.reduce(function (a, h) { return a + typeCombos(h); }, 0);
      hands.forEach(function (h) { map[h] = t; });
      total += n;
      leg.push({ label: g.name + ': ' + n + ' combos, ' + fmt((n / 1326) * 100) + '%', color: color(t) });
    });
    var svg = makeSvg(host, W, 10, spec.label), fs = Math.max(7.5, cell * 0.33);
    for (var i = 0; i < 13; i++) for (var j = 0; j < 13; j++) {
      var name = i === j ? RANKS[i] + RANKS[i] : i < j ? RANKS[i] + RANKS[j] + 's' : RANKS[j] + RANKS[i] + 'o', t = map[name];
      el('rect', { x: j * cell, y: i * cell, width: cell, height: cell, style: 'fill:' + (t ? color(t) : 'var(--card-face)') + ';stroke:var(--muted);stroke-width:0.5' }, svg);
      text(svg, j * cell + cell / 2, i * cell + cell / 2 + fs * 0.35, name, { size: fs, anchor: 'middle', fill: t ? onColor(t) : 'var(--muted)', weight: t ? 600 : 400 });
    }
    var y = side + 22;
    y += legend(svg, leg, 0, y, W);
    if (spec.groups.length > 1 && spec.total !== false) { text(svg, 0, y + 4, 'All shaded hands: ' + total + ' of 1,326 combos, ' + fmt((total / 1326) * 100) + '%', { size: 14, italic: true, fill: 'var(--muted)' }); y += 22; }
    svg.setAttribute('height', y); svg.setAttribute('viewBox', '0 0 ' + W + ' ' + y);
  };

  var SUITS = { s: '♠', h: '♥', d: '♦', c: '♣' };
  function miniCards(svg, cx, y, str, size) {
    var cards = String(str).trim().split(/\s+/), w = size * 1.5, gap = 3, x = cx - (cards.length * (w + gap) - gap) / 2;
    cards.forEach(function (c) {
      var back = c === '??', red = /[hd]$/i.test(c);
      el('rect', { x: x, y: y, width: w, height: size * 1.9, rx: 2, style: 'fill:' + (back ? 'var(--accent)' : 'var(--card-face)') + ';stroke:var(--fg);stroke-width:0.75' }, svg);
      if (!back) text(svg, x + w / 2, y + size * 1.35, c[0].toUpperCase() + (SUITS[c[1].toLowerCase()] || ''), { size: size, anchor: 'middle', weight: 600, fill: red ? 'var(--card-red)' : 'var(--card-ink)' });
      x += w + gap;
    });
  }

  draw.table = function (host, spec, W) {
    var seats = spec.seats, n = seats.length, narrow = W < 500;
    var H = Math.round(narrow ? W * 1.02 : Math.min(430, W * 0.6));
    var pw = narrow ? 62 : 84, ph = 40, cx = W / 2, cy = H / 2;
    var rx = W / 2 - pw / 2 - 4, ry = H / 2 - ph / 2 - 4;
    var svg = makeSvg(host, W, H, spec.label);
    el('ellipse', { cx: cx, cy: cy, rx: rx - pw * 0.72, ry: ry - ph * 0.95, style: 'fill:' + mix('--accent-2', 34) + ';stroke:var(--fg);stroke-width:1.5' }, svg);
    el('ellipse', { cx: cx, cy: cy, rx: rx - pw * 0.72 - 7, ry: ry - ph * 0.95 - 7, style: 'fill:none;stroke:var(--ornament);stroke-width:1' }, svg);
    var hero = 0;
    seats.forEach(function (s, i) { if (s.state === 'hero') hero = i; });
    seats.forEach(function (s, i) {
      var a = Math.PI / 2 + (2 * Math.PI * ((i - hero + n) % n)) / n, co = Math.cos(a), si = Math.sin(a);
      var px = cx + rx * co, py = cy + ry * si, st = s.state || 'active';
      var fill = st === 'hero' ? 'var(--fg)' : st === 'villain' ? 'var(--accent)' : st === 'fold' ? 'var(--bg)' : 'var(--card-face)';
      var ink = st === 'hero' || st === 'villain' ? 'var(--bg)' : st === 'fold' ? 'var(--muted)' : 'var(--fg)';
      el('rect', { x: px - pw / 2, y: py - ph / 2, width: pw, height: ph, rx: 4, style: 'fill:' + fill + ';stroke:' + (st === 'fold' ? 'var(--muted)' : 'var(--fg)') + ';stroke-width:1' + (st === 'fold' ? ';stroke-dasharray:3 3' : '') }, svg);
      var sub = s.stack !== undefined ? String(s.stack) : s.note || (st === 'fold' ? 'folds' : '');
      text(svg, px, py + (sub ? -2 : 5), s.pos, { size: narrow ? 12 : 13, anchor: 'middle', fill: ink, weight: 700, label: true });
      if (sub) text(svg, px, py + 14, sub, { size: 12, anchor: 'middle', fill: ink });
      // Cards, then the bet, step inward from the seat toward the middle. The button sits beside them.
      var dx = cx - px, dy = cy - py, len = Math.sqrt(dx * dx + dy * dy) || 1, ux = dx / len, uy = dy / len;
      var edge = Math.sqrt(Math.pow(ux * (pw / 2 + 6), 2) + Math.pow(uy * (ph / 2 + 6), 2)), cs = narrow ? 11 : 12, d = edge;
      if (s.cards) { miniCards(svg, px + ux * (edge + 15), py + uy * (edge + 15) - cs * 0.95, s.cards, cs); d = edge + 32; }
      if (s.bet !== undefined) {
        var bx = px + ux * (d + 16), by = py + uy * (d + 16), bwid = tw(String(s.bet), 13);
        el('circle', { cx: bx - bwid / 2 - 4, cy: by - 4, r: 6, style: 'fill:var(--ornament);stroke:var(--fg);stroke-width:1' }, svg);
        text(svg, bx + 8, by, String(s.bet), { size: 13, anchor: 'middle', weight: 600 });
      }
      if (spec.button === i) {
        var off = (narrow ? 22 : 30) + (s.cards ? 22 : 0), tx = px + ux * (edge + 8) - uy * off, ty = py + uy * (edge + 8) + ux * off;
        el('circle', { cx: tx, cy: ty, r: 9, style: 'fill:var(--bg);stroke:var(--fg);stroke-width:1.5' }, svg);
        text(svg, tx, ty + 4, 'D', { size: 11, anchor: 'middle', weight: 700, label: true });
      }
    });
    if (spec.board) miniCards(svg, cx, cy - (spec.pot !== undefined ? 24 : 14), spec.board, narrow ? 13 : 15);
    if (spec.pot !== undefined) text(svg, cx, cy + (spec.board ? 26 : 5), 'Pot ' + spec.pot, { size: 15, anchor: 'middle', weight: 600 });
    if (spec.center) text(svg, cx, cy + (spec.board || spec.pot !== undefined ? 46 : 5), spec.center, { size: 13, anchor: 'middle', italic: true });
  };

  draw.scatter = function (host, spec, W) {
    var side = Math.min(W, 540), m = 34, svg = makeSvg(host, W, side + 8, spec.label), plot = side - 2 * m;
    var xr = [spec.x.min || 0, spec.x.max || 100], yr = [spec.y.min || 0, spec.y.max || 100];
    var X = function (v) { return m + plot * ((v - xr[0]) / (xr[1] - xr[0])); }, Y = function (v) { return m + plot * (1 - (v - yr[0]) / (yr[1] - yr[0])); };
    el('rect', { x: m, y: m, width: plot, height: plot, style: 'fill:var(--card-face);stroke:var(--fg);stroke-width:1' }, svg);
    el('line', { x1: m + plot / 2, x2: m + plot / 2, y1: m, y2: m + plot, style: 'stroke:var(--muted);stroke-dasharray:4 4' }, svg);
    el('line', { x1: m, x2: m + plot, y1: m + plot / 2, y2: m + plot / 2, style: 'stroke:var(--muted);stroke-dasharray:4 4' }, svg);
    var q = spec.quadrants || [];
    [[m + 8, m + 18, 'start'], [m + plot - 8, m + 18, 'end'], [m + 8, m + plot - 8, 'start'], [m + plot - 8, m + plot - 8, 'end']].forEach(function (p, i) {
      if (q[i]) text(svg, p[0], p[1], q[i], { size: 12, anchor: p[2], fill: 'var(--muted)', label: true });
    });
    text(svg, m, side - 10, spec.x.low || '', { size: 13, fill: 'var(--muted)', italic: true });
    text(svg, m + plot, side - 10, spec.x.high || '', { size: 13, anchor: 'end', fill: 'var(--muted)', italic: true });
    text(svg, m + plot / 2, side - 10, spec.x.label, { size: 13, anchor: 'middle', weight: 600 });
    text(svg, m, m - 10, (spec.y.high ? spec.y.high + ' ↑  ' : '') + spec.y.label, { size: 13, weight: 600 });
    spec.points.forEach(function (p, i) {
      var t = toneOf(p.tone, 0), px = X(p.x), py = Y(p.y), right = px < m + plot * 0.62;
      el('circle', { cx: px, cy: py, r: p.r || 7, style: 'fill:' + color(t) + ';stroke:var(--fg);stroke-width:1' }, svg);
      text(svg, px + (right ? 11 : -11), py + 5, p.label, { size: 14, anchor: right ? 'start' : 'end', weight: 600 });
    });
  };

  draw.heat = function (host, spec) {
    var unit = spec.unit || '', flat = [].concat.apply([], spec.values);
    var min = spec.min !== undefined ? spec.min : Math.min.apply(null, flat), max = spec.max !== undefined ? spec.max : Math.max.apply(null, flat);
    var v = { ink: '--fg', accent: '--accent', accent2: '--accent-2', gold: '--ornament' }[spec.tone || 'accent2'] || '--accent-2';
    var wrap = document.createElement('div'); wrap.className = 'table-scroll';
    var html = '<table class="heat" aria-label="' + String(spec.label).replace(/"/g, '&quot;') + '"><thead><tr><th>' + (spec.corner || '') + '</th>' +
      spec.cols.map(function (c) { return '<th scope="col">' + c + '</th>'; }).join('') + '</tr></thead><tbody>';
    spec.rows.forEach(function (r, i) {
      html += '<tr><th scope="row">' + r + '</th>' + spec.values[i].map(function (val, j) {
        var p = Math.round(6 + ((val - min) / ((max - min) || 1)) * 74);
        var shown = spec.cells ? spec.cells[i][j] : fmt(val, unit);
        return '<td style="background:color-mix(in srgb, var(' + v + ') ' + p + '%, var(--bg));color:' + (p > 52 && v !== '--ornament' ? 'var(--bg)' : 'var(--fg)') + '">' + shown + '</td>';
      }).join('') + '</tr>';
    });
    wrap.innerHTML = html + '</tbody></table>';
    host.appendChild(wrap);
  };

  function render(node) {
    var type = node.getAttribute('data-fig'), src = node.querySelector('script[type="application/json"]');
    var host = node.querySelector('.fig-canvas');
    if (!host) { host = document.createElement('div'); host.className = 'fig-canvas'; node.appendChild(host); }
    var W = Math.floor(node.clientWidth);
    if (!W || (node._w === W && host.firstChild)) return;
    node._w = W;
    host.textContent = '';
    try {
      var spec = JSON.parse(src.textContent), errs = validate(type, spec);
      if (errs.length) throw new Error(errs.join('; '));
      draw[type](host, spec, W);
    } catch (e) {
      host.textContent = 'This figure could not be drawn: ' + e.message;
    }
  }
  function renderAll() { var nodes = document.querySelectorAll('[data-fig]'); for (var i = 0; i < nodes.length; i++) render(nodes[i]); }
  var timer;
  window.addEventListener('resize', function () { clearTimeout(timer); timer = setTimeout(renderAll, 120); });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', renderAll); else renderAll();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { var n = document.querySelectorAll('[data-fig]'); for (var i = 0; i < n.length; i++) n[i]._w = 0; renderAll(); });
})(typeof self !== 'undefined' ? self : this);
