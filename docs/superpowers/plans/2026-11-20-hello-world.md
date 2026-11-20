# Poker Hello World Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up `polarispixels/poker` with Return Of's process and a live style sampler at https://polarispixels.github.io/poker/.

**Architecture:** Static HTML and CSS, with styles scoped by `data-style` token blocks in `css/themes.css`. A small script switches the page's `data-style`. `tools/check.js` (Node, no dependencies) gates the deploy, and GitHub Actions publishes to Pages.

**Tech Stack:** HTML, CSS, vanilla JS, Node 22 (check only), GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-11-20-hello-world-design.md`

## Global Constraints

- No dependencies. Plain HTML, CSS, and script tags.
- `css/site.css` reads theme tokens only. Colors and fonts live in `css/themes.css`.
- No em dashes in anything a person reads (the check enforces it).
- Version in one place: `POKER_VERSION` in `js/version.js`, starting at `0.1.0`, shown in every page via `[data-version]`.
- Council voices: a real quote sits in quote marks with a source link. An imagined voice is paraphrase, never in quote marks, and labeled as our reading.
- Style values come from `~/code/polaris-pixels/laboratory/data/styles/{dark-academia,art-deco}.json`.

## Review Focus

1. Phone width (360px): the switch and the sample spread must not scroll sideways. Checked by eye on the live page.
2. Art Deco's gold on cream fails contrast. The blend uses gold only for ornament and rules, never for text.
3. JS off: the page still renders in the default style (the blend) and stays readable.
4. `localStorage` blocked: the switch still works. Wrap reads and writes in try/catch.
5. A sampler quote without a source link must fail the check (Task 2's test).

---

### Task 1: Project skeleton and deploy gate

**Files:**
- Create: `tools/check.js`, `js/version.js`, `CHANGELOG.md`, `README.md`, `BACKLOG.md`, `CLAUDE.md`, `.github/workflows/deploy.yml`, `.gitignore`

**Interfaces:**
- Produces: `POKER_VERSION` global; check failures listed one per line, exit 1.

- [ ] **Step 1: Write `tools/check.js`** with Return Of's checks 1 to 4 (version has a changelog entry, local links resolve, every `data-style` used is defined in `css/themes.css`, every page has a viewport meta tag and `data-version`), plus check 5: no U+2014 in any `.html` or `.md` file outside `docs/superpowers/`.
- [ ] **Step 2: Run `node tools/check.js`.** Expected: FAIL (no `js/version.js`).
- [ ] **Step 3: Add `js/version.js`** (`var POKER_VERSION = '0.1.0';`, and stamping as in Return Of) and `CHANGELOG.md` with `## [0.1.0] - 2026-11-20`. Add `README.md`, `BACKLOG.md`, `CLAUDE.md` (a "where authority lives" table, rules including the council voice rule, commands, release, known traps), and `deploy.yml` (a copy of Return Of's).
- [ ] **Step 4: Run the check.** Expected: PASS, with no pages yet.
- [ ] **Step 5: Commit** `Set up project skeleton and deploy gate`.

### Task 2: Themes and the style sampler

**Files:**
- Create: `css/themes.css`, `css/site.css`, `js/switch.js`, `index.html`
- Modify: `tools/check.js`

**Interfaces:**
- Consumes: `POKER_VERSION`.
- Produces: the style names `academia`, `deco`, and `blend`; the classes `.voice-quote` (real) and `.voice-imagined`.

- [ ] **Step 1: Add check 6 to `tools/check.js`.** `index.html` has `<html ... data-style="blend">`. `css/themes.css` defines `academia`, `deco`, and `blend`. Every `.voice-quote` block contains an `<a href="http...">`. No `.voice-imagined` block contains `“`, `”`, `&ldquo;`, or `<q>`, and each one contains the text "our reading".
- [ ] **Step 2: Run the check.** Expected: FAIL (no `index.html`).
- [ ] **Step 3: Write the themes and the page.** The token set matches Return Of's (`--bg`, `--fg`, `--accent`, `--accent-2`, `--muted`, `--rule`, `--rule-weight`, `--radius`, `--font-display`, `--font-body`, the weights and tracking, `--measure`), plus `--ornament`. The page has a masthead, a title, a short passage on starting hands from `reference/starting-hands.md`, an Ace and King of spades drawn as HTML/CSS cards, one real Sklansky Fundamental Theorem quote linked to a source the builder verifies, one imagined Brunson voice, and a three-button switch (`aria-pressed`). `js/switch.js` sets `document.documentElement.dataset.style` and stores the choice in try/catch.
- [ ] **Step 4: Run the check.** Expected: PASS. Then preview at 360px and 1280px in all three styles.
- [ ] **Step 5: Commit** `Add the style sampler: Dark Academia, Art Deco, and a blend`.

### Task 3: Docs page

**Files:**
- Create: `docs/index.html`

- [ ] **Step 1: Write the docs page** with Return Of's sections, cut down to fit: layout, styles, the council voice rule, versioning, deploy, backlog, and decisions (dated November 20, 2026).
- [ ] **Step 2: Run the check.** Expected: PASS (links resolve, version shown).
- [ ] **Step 3: Commit** `Add the docs page`.

### Task 4: Publish and verify

- [ ] **Step 1:** Run `gh repo create polarispixels/poker --public --source . --push`.
- [ ] **Step 2:** Set Pages to build from Actions: `gh api -X POST repos/polarispixels/poker/pages -f build_type=workflow`.
- [ ] **Step 3:** Watch the run with `gh run watch`. Expected: check and deploy both succeed.
- [ ] **Step 4:** Fetch https://polarispixels.github.io/poker/ and confirm `version.js` serves `0.1.0`. Then `git tag v0.1.0 && git push --tags`.
