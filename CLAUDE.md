# The Long Game (poker)

Ryan's personal study book on live No-Limit Hold'em: a public static site of multimedia pages for his own reference, a sibling of Return Of (`~/code/return-of`). Each chapter asks what the council of players would say. MVP stage, favor speed.

## Where authority lives

| Concern | Authoritative source |
|---|---|
| How the site is built, styled, and shipped; decisions | `docs/index.html` (live at `/docs/`) |
| Committed work | [GitHub Issues](https://github.com/polarispixels/poker/issues) |
| Loose ideas | `BACKLOG.md` |
| What changed, when | `CHANGELOG.md` and `git log` |
| The version | `POKER_VERSION` in `js/version.js` |
| The book outline (parts, chapters, order) | `content/chapters.json`, following `reference/book-outline.md` |
| Chapter content | `content/chapters/NN-slug.html` (fragments). `chapters/` is generated: never edit it by hand |
| How a chapter is written | `docs/writing-guide.md` and the figure gallery, `docs/figures.html` |
| Poker numbers | `node tools/poker.js` (exact equities) and `js/figures.js` (ranges, odds). Never from memory |
| The council (who sits at the table) | Ryan's Claude Doc "The Oval Table", exported to `reference/oval-table-masterminds.md` |
| Starting hands baseline | `reference/starting-hands.md` |
| Style values | `css/themes.css`, sourced from `~/code/polaris-pixels/laboratory/data/styles/` |

- **Live:** https://polarispixels.github.io/poker/ (repo `polarispixels/poker`, GitHub Pages via Actions).

## Rules

1. **No dependencies.** Plain HTML, CSS, and script tags. `node tools/build.js` wraps chapter fragments into pages; its output is committed.
2. **Styles are scoped by `data-style`.** `css/site.css` reads theme tokens only: never hard-code a color or font outside `css/themes.css`.
3. **Council voices (Ryan, November 20, 2026).** A real quote sits in quote marks with a link to its source; no source, no quote. An imagined voice ("what Sklansky would say") is paraphrase, never in quote marks, and labeled as our reading of that player's published ideas. The check enforces both.
4. **Content and what it claims belong to Ryan.** Do not invent results or statistics. Example hands are labeled as examples, never as real hand histories. Odds and equity are computed with `tools/poker.js` or shown as arithmetic.
7. **Figures are first-class.** Every chapter section has a figure, and every chapter ends with one Table Math box. The check enforces it.
8. **Chapters publish one at a time** with `node tools/publish.js <id> "summary"` (a minor version each), from a reviewed draft in `drafts/`.
5. **Verify before claiming done.** Run `node tools/check.js`. A deploy is done when the live page shows the new version.
6. **No em dashes** in anything a person reads (the check enforces it).

## Commands

```bash
node tools/build.js            # rebuild chapter pages and the contents list
node tools/check.js            # the deploy gate (fails if the build is stale)
node tools/check.js --draft drafts/NN-slug.html   # check one unpublished draft
node tools/publish.js 5 "summary"                 # release one chapter
python3 -m http.server 8000    # local preview
```

## Release

Bump `js/version.js`, add a `## [x.y.z]` entry to `CHANGELOG.md`, run the check, commit, push `main`, then `git tag vX.Y.Z && git push --tags`. Keep the docs page in sync with any change to how the site works.

## Known traps

- Header and footer exist in four places: `index.html`, `docs/index.html`, `docs/figures.html`, and the chapter template in `tools/build.js`.
- `js/figures.js` runs in the browser and in Node (the check and the calculator). Keep anything that touches `document` or `window` below the `typeof document` guard.
- Figures are drawn at the container's real pixel width and redraw on resize. Do not swap this for a scaled `viewBox`.
- `docs/figures.html` was generated once from snippets; its rendered examples and their `<pre>` source must be edited together.
- `tools/publish.js` refuses to run on a dirty working tree, and holds `.publish.lock` while it works.
- Art Deco gold (`#C9A227`) fails contrast on cream. In light styles it is for rules and ornament only, never text.
