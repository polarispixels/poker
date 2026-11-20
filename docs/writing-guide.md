# Writing guide

How a chapter of The Long Game is written. Read this, the outline in `reference/book-outline.md`, and the figure gallery in `docs/figures.html` (its `<pre>` blocks are copy-ready source) before writing.

## The book

- A personal study book on **live No-Limit Texas Hold'em** for one reader, Ryan. He plays live, likes math he can do at the table, and learns best from pictures: charts, tables, diagrams, and worked hands.
- Default game: a live $2/$5 cash game, nine-handed, $500 stacks (100 big blinds), unless a chapter says otherwise. Say stakes and stacks whenever they matter.
- Seat names, in order: UTG, UTG+1, MP, LJ (lojack), HJ (hijack), CO (cutoff), BTN (button), SB, BB.
- The book's thesis: GTO is the baseline, exploitation is how you win. Read people and respect the numbers.

## Voice

- Plain words, short sentences, active voice. Second person ("you"). No filler, no hype.
- **No em dashes anywhere.** Use a comma, colon, parentheses, or a period. En dashes in number ranges are fine.
- Define a term the first time it appears, in one clause.
- Teach, do not recite: every idea gets an example with real numbers.
- Never promise results. This is a study book, not advice. Do not invent statistics, win rates, or "studies show". A claim about how live players tend to play is a judgment: say so ("in most low-stakes live games").

## Numbers

- **Every number is computed, not remembered.** Use `node tools/poker.js` (commands: `equity`, `vsrange`, `draw`, `combos`, `odds`) or show the arithmetic. Exact first, then the rounded figure a player would use.
- Each figure's note says where its numbers come from: "Exact, from tools/poker.js", "Arithmetic: ...", or "An example hand, not a real hand history".
- Example hands are invented teaching examples. Never present one as a real or famous hand. Do not describe real hands from poker history unless you have opened a source and link it.
- Money examples must add up: track the pot street by street.

## Structure of a chapter

A chapter is one HTML fragment: body content only, no `<html>`, `<head>`, `<h1>`, `<style>`, or `style=""`.

1. `<p class="lead">`: one or two sentences on what the chapter gives the reader.
2. Four to seven `<h2>` sections. **Every section has at least one figure**, placed where it helps, working with the text: sometimes a summary, sometimes a step further.
3. At least one council voice (see below), placed where a real disagreement or a sharp idea lives.
4. Drills where practice helps (`<details class="drill">`), especially in math chapters.
5. One Table Math box, last: `<aside class="tablemath">`, on the topic the outline assigns the chapter. One shortcut, a worked example, and where the shortcut bends.

Aim for 1,500 to 2,500 words of prose and 6 to 10 figures. Figures are first-class: vary the types, and reach for the unusual one (a table diagram, a range grid, a tree, 100 dots, a hand log) before another bar chart. Do not repeat the same figure type more than three times in a chapter.

## Figures

- Copy the patterns in `docs/figures.html`. Kit types: `bars`, `columns`, `line`, `split`, `dots`, `range`, `table`, `scatter`, `heat`. HTML components: plain tables, hand logs, flows, trees, stats, compares, timelines, key ideas, formulas, drills, and inline SVG with `class="art"`.
- Every figure: `<figure class="figure">`, a `figure-head` with `<span class="figure-number">Fig.</span>` (or `Table`) and an `<h3 class="figure-title">`, the content, and a `<p class="figure-note">`. Write only "Fig." or "Table": the build adds the numbers.
- Every kit figure's JSON needs a `label`: a full sentence describing what it shows.
- Tones carry meaning: `ink` the main line or the hero, `accent` risk, loss, a bluff, or the villain, `accent2` value or the alternative, `gold` a highlight, `muted` and `paper` structure. A good outcome is never `accent`.
- Never write a color value. No images, video, or iframes yet.
- Cards: `[[As Kh]]`. Cross-references: `{{ch:7}}` (or `{{ch:A}}` for an appendix). Do not write "Chapter 7" by hand when you mean a link.
- Keep labels short so figures read at phone width (360px).
- A `line` figure's `refs` draw dashed guide lines: `{"y": 25, "label": "..."}` is horizontal, `{"x": 0.5, "label": "..."}` is vertical.
- Always write cards with the `[[...]]` shorthand, including inside tables and hand logs. Never write the expanded card markup by hand.
- The Table Math box may hold a figure, but does not need one.
- Name a book by its title. Give a year or edition only if you have verified it.

## Council voices

The council is in `reference/oval-table-masterminds.md`. Others may join when a chapter needs them.

- **Imagined voice** (the default): `<aside class="voice voice-imagined">`. A paraphrase of what that player would say, grounded in what they are publicly known for. **No quote marks of any kind inside it**, and the note must contain the words "our reading". Name the published work or known approach it draws on.
- **Real quote**: only when you have opened a source, read the exact words there, and link it. `<figure class="voice voice-quote">` with quote marks and the link. If you cannot verify one, use an imagined voice instead. Never guess at wording.
- Do not put words in a real person's mouth anywhere else: no "As Doyle said, ..." followed by invented speech.
- Use two to four voices per chapter. Let them disagree with each other when the topic is contested.

## Checking your work

```bash
node tools/check.js --draft drafts/NN-slug.html
```

It fails on: em dashes, styles, colors, a section with no figure, a missing Table Math box, a missing voice, a malformed figure spec, a bad card or chapter reference, and any break of the voice rule. Fix every failure before you finish.
