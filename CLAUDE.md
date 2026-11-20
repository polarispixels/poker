# Poker

Ryan's personal study book on poker and poker strategy: a public static site of multimedia pages for his own reference, a sibling of Return Of (`~/code/return-of`). Each chapter asks what the council of players would say. MVP stage, favor speed.

## Where authority lives

| Concern | Authoritative source |
|---|---|
| How the site is built, styled, and shipped; decisions | `docs/index.html` (live at `/docs/`) |
| Committed work | [GitHub Issues](https://github.com/polarispixels/poker/issues) |
| Loose ideas | `BACKLOG.md` |
| What changed, when | `CHANGELOG.md` and `git log` |
| The version | `POKER_VERSION` in `js/version.js` |
| The council (who sits at the table) | Ryan's Claude Doc "The Oval Table", exported to `reference/oval-table-masterminds.md` |
| Starting hands baseline | `reference/starting-hands.md` |
| Style values | `css/themes.css`, sourced from `~/code/polaris-pixels/laboratory/data/styles/` |

- **Live:** https://polarispixels.github.io/poker/ (repo `polarispixels/poker`, GitHub Pages via Actions).

## Rules

1. **No dependencies.** Plain HTML, CSS, and script tags.
2. **Styles are scoped by `data-style`.** `css/site.css` reads theme tokens only: never hard-code a color or font outside `css/themes.css`.
3. **Council voices (Ryan, November 20, 2026).** A real quote sits in quote marks with a link to its source; no source, no quote. An imagined voice ("what Sklansky would say") is paraphrase, never in quote marks, and labeled as our reading of that player's published ideas. The check enforces both.
4. **Content and what it claims belong to Ryan.** Do not invent hand histories, results, or statistics. Odds and equity are arithmetic or cited.
5. **Verify before claiming done.** Run `node tools/check.js`. A deploy is done when the live page shows the new version.
6. **No em dashes** in anything a person reads (the check enforces it).

## Commands

```bash
node tools/check.js            # the deploy gate
python3 -m http.server 8000    # local preview
```

## Release

Bump `js/version.js`, add a `## [x.y.z]` entry to `CHANGELOG.md`, run the check, commit, push `main`, then `git tag vX.Y.Z && git push --tags`. Keep the docs page in sync with any change to how the site works.

## Known traps

- Header and footer exist in two places: `index.html` and `docs/index.html`.
- Art Deco gold (`#C9A227`) fails contrast on cream. In light styles it is for rules and ornament only, never text.
