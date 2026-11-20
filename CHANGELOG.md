# Changelog

All notable changes to this project are recorded here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [0.2.0] - 2026-11-20

The book's frame: its title, its contents, and the kit that every chapter is built from.

### Added

- The title page for The Long Game, with the full contents: 38 chapters in six parts and six appendices, each marked "To come" until it is written.
- A chapter build (`tools/build.js`) with shorthands for playing cards, chapter links, and figure numbers.
- A figure kit (`js/figures.js`): bars, columns, lines, split bars, 100-dot grids, the 13 by 13 hand grid, a poker table diagram, scatter plots, and heat tables, plus hand logs, flows, trees, drills, and Table Math boxes in plain HTML.
- A figure gallery (`docs/figures.html`) showing every type with its source, and a writing guide (`docs/writing-guide.md`).
- A poker calculator (`tools/poker.js`) for exact equities, draws, combos, and bet math, tested by the deploy check.
- One-command chapter releases (`tools/publish.js`).
- The book outline, draft 2, in `reference/`.

### Changed

- The look is settled: the blend. The style sampler and its switch are retired.
- The deploy check now covers chapters: a figure for every section, one Table Math box, a council voice, valid figure specs, and a fresh build.

## [0.1.1] - 2026-11-20

The council voice rule is now checked on every page, and keyboard focus is easier to see.

### Fixed

- The deploy check now applies the voice rule to every page, not just the welcome page, and fails any `<blockquote>` or `<q>` outside a sourced real-quote block.
- The check now catches quote marks in an imagined voice when they are written as numeric entities (`&#8220;`), single quotes, or guillemets.
- In the blend, the focus ring on the style switch was gold on cream (1.9:1). It is now oxblood (8.2:1).

## [0.1.0] - 2026-11-20

The book's first page: a style sampler for choosing its look.

### Added

- A welcome page that shows one sample spread in three styles, Dark Academia, Art Deco, and a blend of the two, with a switch between them. It opens in the blend.
- The council voice rule, sampled on the page: a real quote with its source, and an imagined voice labeled as our reading.
- A docs page on how the site is built, styled, versioned, and shipped.
- A deploy check, run by GitHub Actions before every publish to GitHub Pages.
- Reference material in `reference/`: the Sklansky-Malmuth starting hands guide and the Oval Table council.
