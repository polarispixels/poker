# Poker: hello world and style sampler

Approved by Ryan on November 20, 2026. A short design for a small change.

## Intent

Ryan's personal poker study book, a sibling to Return Of (`~/code/return-of`). A multimedia website of chapter pages for his own study. Each chapter asks "what would so-and-so say?" and draws on a council of players: the Oval Table to start, others later.

This first release stands up the project and a single page at https://polarispixels.github.io/poker/ that lets Ryan choose the look by seeing it.

## Goals

- The repo, hosting, and development process match Return Of: plain HTML and CSS with no dependencies, `docs/index.html` (the docs page), SemVer with the version on every page, a Keep a Changelog `CHANGELOG.md`, `tools/check.js` as the deploy gate, GitHub Pages through Actions, `vX.Y.Z` tags, `BACKLOG.md`, and a short `CLAUDE.md`.
- A hello-world page that shows one sample spread three ways: Dark Academia, Art Deco, and a blend. A switch on the page changes the style.

## Non-goals

- Chapters, a book outline, a build script, and charts. Those come once the look is chosen.

## Anti-goals

- An invented quote passed off as something a real person said.

## The council voice rule (Ryan's, November 20, 2026)

This reverses Return Of's "no quotes from real people" rule.

- **Real quote:** shown in quote marks with a link to its source. No source, no quote.
- **Imagined voice** ("what Sklansky would say"): paraphrase, never in quote marks, and labeled as our reading of that player's published ideas.

The two look different on the page. The sampler shows one of each.

## Approaches considered

1. **A live sampler with a style switch (chosen).** Ryan picks by looking at it on the real URL, and a blend is easy to tune because styles are token blocks in `css/themes.css`.
2. Build one style and redo it if it misses. This is cheaper up front but likely to be built twice.
3. Static mockup images. These are quick but don't test real fonts, phone widths, or contrast.

## Decided

- Repo `polarispixels/poker`, public (free Pages needs that), with branch `main`.
- Styles are scoped by `data-style`, as in Return Of. Values come from `~/code/polaris-pixels/laboratory/data/styles/` (`dark-academia.json`, `art-deco.json`).
- Reference material lives in `reference/`: `starting-hands.md` and `oval-table-masterminds.md` (an export of Ryan's Claude Doc).

## Left to the builder

- The fonts for each style, and the exact blend.
- The sample content, a short passage on the starting hands drawn from `reference/starting-hands.md`.
- Persisting the switch choice in `localStorage` (a per-viewer convenience).
