# Changelog

All notable changes to this project are recorded here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [0.16.0] - 2026-11-21

### Added

- Chapter 24, Exploitative Play: Chapter 24 teaches baseline-then-deviate play: finding a leak by counting, the alpha math of bluffing an over-folder, what a wrong read costs, and how reads go stale.

## [0.15.0] - 2026-11-21

### Added

- Chapter 4, Starting Hands: Chapter 4 sorts the 1,326 starting hands into the Sklansky-Malmuth groups, builds a judgment baseline for opening by seat, and covers domination, set mining, and how often you are dealt a pair.

## [0.14.0] - 2026-11-21

### Added

- Chapter 14, Combinatorics: Chapter 14 teaches combo counting, card removal by your hand and the board, and blockers, with an exact AK versus QQ+ and AK equity.

## [0.13.0] - 2026-11-21

### Added

- Chapter 13, Thinking in Ranges: Chapter 13 teaches ranges through one UTG example: building and counting a range, card removal, equity against strong, medium, and air piles, and narrowing by a flop bet.

## [0.12.0] - 2026-11-21

### Added

- Chapter 25, Live Player Types and Population Tendencies: Chapter 25 profiles regulars, recreational players, and nits with range counts and equities, gives default adjustments by stake, and shows how to build a frequency profile with its margin of error.

## [0.11.0] - 2026-11-21

### Added

- Chapter 22, Game Theory Basics: Chapter 22 builds Nash equilibrium from rock, paper, scissors and a nuts-or-air river game, then derives MDF and alpha with a $2/$5 example.

## [0.10.0] - 2026-11-21

### Added

- Chapter 3, Position: Chapter 3, Position: why acting last pays, the nine seats, how position widens opening ranges, and counting players left to act.

## [0.9.0] - 2026-11-21

### Added

- Chapter 8, Aggression: Chapter 8 explains fold equity as the second way to win a pot, with a worked flush-draw semi-bluff and bluff break-even math.

## [0.8.0] - 2026-11-21

### Added

- Chapter 10, Bankroll and Variance Basics: Chapter 10 sizes live swings with a labeled 4 BB/hour, 50 BB/hour SD model, derives risk of ruin and buy-in judgments, and ends with Table Math on BB/hour and a losing month.

## [0.7.0] - 2026-11-21

### Added

- Chapter 2, Rules, Hands, and the Flow of a Live Hand: Chapter 2 covers hand rankings with exact counts, the button, blinds and straddle, four betting rounds with a tracked pot, showdown, live procedure, and counting the pot street by street.

## [0.6.0] - 2026-11-21

### Added

- Chapter 16, Continuation Betting: Chapter 16 teaches when to c-bet, how much, when to check, and why fold equity shrinks with each extra player.

## [0.5.0] - 2026-11-21

### Added

- Chapter 7, Expected Value: Chapter 7 teaches expected value: decisions versus results, two-branch EV trees, Sklansky's Fundamental Theorem, long-run variance, and a two-outcome EV shortcut.

## [0.4.0] - 2026-11-21

### Added

- Chapter 5, Odds and Outs: Chapter 5 teaches counting outs, discounting tainted outs, pot odds, and the call-or-fold decision, with a worked flush draw hand and the rule of 2 and 4.

## [0.3.0] - 2026-11-21

### Added

- Chapter 1, What Poker Really Is: Chapter 1 explains poker as a game of hidden information, teaches thinking in times out of 100, and separates short-run luck from long-run skill.

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
