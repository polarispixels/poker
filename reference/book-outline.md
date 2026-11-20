# The Poker University Book: Outline, Draft 2

Nov 20, 2026 · Draft for iteration

**What changed in draft 2.** Ryan settled the council's open questions. The book is about No-Limit Texas Hold'em, played live. Omaha and other games get one short chapter and a single encyclopedia volume. Online play is out of scope for now. Math stays in the main text, and every chapter ends with a "Table Math" box: one shortcut you can do in your head at a live table. Two new chapters teach mental math directly, and a new appendix collects the numbers worth memorizing.

This document has four parts: the council debate (a thought experiment), the book outline, the encyclopedia volumes, and a table math cheat sheet.

## Part 1: The Council Debates the Book

**A note on framing.** This is an imagined conversation, written to test the outline from several angles. None of the lines below are real quotes. Each voice is built from the ideas the player is publicly known for, as summarized in the Oval Table doc.

**At the table:** David Sklansky, Phil Galfond, Daniel Negreanu, Dan Harrington, Phil Ivey, Doyle Brunson, Fedor Holz, Vanessa Selbst.

### Round 1: Where does the book start?

**Sklansky:** It starts with expected value. Before a reader knows what a flush draw is worth, they need to know that a decision is good or bad regardless of how the hand turns out. Chapter one is "results don't matter, decisions do." Everything else is an application of that.

**Galfond:** I agree on the destination, but not as chapter one. A true beginner who opens to an EV formula closes the book. Start with the rules, the flow of a hand, and why position matters. Get them playing. Then, a few chapters in, show them that the choices they've been making intuitively have a number attached.

**Brunson:** Teach them to be aggressive from the first page. The worst habit a new player builds is calling. If the first lessons are about raising or folding, they'll never have to unlearn it.

**Negreanu:** And teach them to watch the other players from the first hand, not after they've "mastered the math." Reading people isn't an advanced topic. A beginner can learn that the guy who hasn't played a hand in an hour has aces when he raises.

**Decision:** The book opens with the game itself (rules, hand flow, position), then moves fast into EV and aggression as the two founding ideas. Observation of opponents appears in Part I, not deferred to the advanced section.

### Round 2: Theory first or people first?

**Sklansky:** The Fundamental Theorem settles it. You gain when an opponent plays differently than they would if they could see your cards. That's a theory statement and a people statement at the same time.

**Galfond:** The modern version is: learn the balanced baseline, then learn to deviate. GTO isn't the goal, it's the map. Exploitation is the trip. A student who only knows exploits gets lost when the opponent is good. A student who only knows GTO leaves money on the table against everyone else.

**Negreanu:** I lived both sides of this. I played by feel for twenty years, fell behind, and rebuilt with solvers. The book should say plainly that you need both, and teach them side by side so neither becomes "the real stuff" and the other "the extra."

**Ivey:** Theory tells you what's possible. The table tells you what's happening. Put the reads chapter right next to the range chapter. Same hand, two lenses.

**Decision:** Theory and exploitation chapters are paired. The book states one thesis: GTO is the baseline, exploitation is how you win.

### Round 3: How much tournament material?

**Harrington:** Most new players play tournaments, and tournaments change the math. Stack depth decides strategy before your cards do. ICM can make a correct cash-game call a disaster. If the book treats tournaments as an appendix, it fails a lot of its readers.

**Ivey:** Then don't let it become a tournament book either. Cash games teach the deep-stack decisions that tournaments rarely reach.

**Brunson:** Cash is where you learn the game. Tournaments are where you learn to survive it.

**Decision:** The core strategy chapters are format-neutral and assume deep stacks. Part IV splits into live cash and live tournament tracks.

### Round 4: Does the mental game belong in a strategy book?

**Holz:** It isn't optional. I've seen more money lost to tilt, fatigue, and bad routines than to bad river decisions. If a reader learns perfect strategy but can't execute it in hour nine, the strategy is worth nothing.

**Sklansky:** Fine, but tie it to EV. Tilt is a measurable leak. Quitting when you're tired is a +EV decision. Don't make it a self-help chapter.

**Selbst:** And make it practical. Bankroll, variance, game selection, record keeping. These decide whether a winning player stays in the game long enough to show it.

**Brunson:** I played sixty years. Bankroll management is why. Put it in the beginner section, not the end.

**Decision:** Bankroll basics and variance appear in Part I. Part V covers the mental game and the business of poker, framed in EV terms.

### Round 5: What makes the expert section expert?

**Galfond:** Solver work, node locking, building your own strategies, and understanding why the solver does what it does, not just memorizing outputs.

**Ivey:** Adapting in real time against strong opponents. Knowing when your opponent knows that you know.

**Negreanu:** Self-study. The expert is the person who can find their own leaks without a coach.

**Holz:** And longevity. Staying good as the game changes, which means a study system and a life outside poker.

**Decision:** Part VI covers advanced theory, elite adaptation, and the study system that keeps a player improving.

### Round 6: The reader has spoken (live Hold'em, math in the main text)

The founder told the council what he plays: almost all live No-Limit Hold'em, and he wants the math up front, especially math he can do at the table.

**Sklansky:** Good. Then the math can't live in an appendix. Every chapter should end with one calculation the reader can do in ten seconds with chips in front of them. Pot odds, bluff break-even, combo counts. Small, fast, repeatable.

**Harrington:** Make it approximate on purpose. Nobody at a live table computes 19.6 percent. They compute "about one in five." Teach the shortcut first and the exact number second, and show how wrong the shortcut can be.

**Brunson:** Live poker is a different animal from what the kids play on screens. Straddles, limpers, five-way pots, players who never fold a pair. The book should be written for that room.

**Negreanu:** Live is where reads pay the most. You get physical tells, table talk, and hours of history on the same nine people. Give live reads real chapters, not a footnote.

**Ivey:** Keep a door open to Omaha. A Hold'em player who understands why big pairs shrink in Omaha understands equity better in Hold'em too. One chapter, not a part.

**Galfond:** And make the solver chapters honest about live play. Live games are rarely balanced, so the baseline matters less than the exploit. Teach GTO as the reference point, then show the live adjustments.

**Decision:** Hold'em is the subject. Live play is the default setting. Math is taught in the main text, with a Table Math box closing every chapter and two dedicated mental math chapters. Omaha gets one survey chapter. Online-specific material is dropped for now.

## Part 2: The Book Outline

Working title: **The Complete Game: Live No-Limit Hold'em from First Hand to Expert Play**

Six parts, 38 chapters. Each part ends with a review chapter of worked live hands. Every chapter closes with a **Table Math** box: one mental shortcut tied to that chapter's topic.

### Part I: Foundations (the first-time player)

1. **What Poker Really Is.** A game of incomplete information and decisions under uncertainty. Skill vs. luck over the short and long run.
   *Table Math:* thinking in percentages and "times out of 100."
2. **Rules, Hands, and the Flow of a Live Hand.** Hand rankings, the button, blinds, straddles, betting rounds, showdown, and live procedure (string bets, verbal declarations, one-chip calls, protecting your hand).
   *Table Math:* counting the pot as it grows, street by street.
3. **Position.** Why acting last is an advantage. Seat names and how position changes every decision.
   *Table Math:* how many players are left to act, and what that does to your hand's odds of being best.
4. **Starting Hands.** Hand categories, opening by position, and why folding most hands is correct. (Builds on the existing starting-hands guide.)
   *Table Math:* 1,326 starting hands, 169 hand types, and how often you're dealt a pair (about 1 in 17).
5. **Odds and Outs.** Counting outs, discounting tainted outs, pot odds, and the call-or-fold decision.
   *Table Math:* the rule of 2 and 4, and when it overstates your chances.
6. **Mental Math at the Table I: The Core Shortcuts.** The handful of calculations that decide most live hands: converting odds to percentages, pot odds for common bet sizes, the rule of 2 and 4 with corrections, and quick preflop matchup equities. Drills for doing each one in under ten seconds.
   *Table Math:* the bet-size table (half pot needs 25%, pot needs 33%).
7. **Expected Value.** Decisions vs. results, the Fundamental Theorem of Poker, thinking in long-run averages.
   *Table Math:* a two-outcome EV estimate in your head.
8. **Aggression.** Why betting and raising beat calling. Fold equity. The two ways to win a pot.
   *Table Math:* how often a bluff must work to break even.
9. **Watching the Table.** First-level observation: who plays many hands, who plays few, who bets big, who never bluffs. Keeping mental notes on nine people.
   *Table Math:* estimating a player's hand frequency from how many hands they've played in an orbit.
10. **Bankroll and Variance Basics.** Why good players lose sessions, how many buy-ins to carry for live cash and tournaments, and how not to go broke.
    *Table Math:* win rate in big blinds per hour and what a losing month really means.
11. **Part I Review.** Twenty annotated live beginner hands.

### Part II: The Core Game (the developing player)

12. **Preflop Strategy for Live Games.** Open ranges, isolating limpers, 3-betting and 4-betting, defending the blinds, playing against and with the straddle.
    *Table Math:* sizing opens with limpers in the pot.
13. **Thinking in Ranges.** Moving from "what hand does he have" to "what hands could he have." Range construction and range narrowing.
    *Table Math:* what share of a range is strong, medium, and air.
14. **Combinatorics.** Counting hand combinations, how board cards and your own cards remove combos, and blockers.
    *Table Math:* 6 combos for a pair, 16 for an unpaired hand, 3 for a pair once one card shows on the board.
15. **Board Texture.** Dry vs. wet boards, range advantage, nut advantage, and how the flop changes who is ahead.
    *Table Math:* how often a suited hand flops a flush draw (about 11%) or a made flush (under 1%).
16. **Continuation Betting.** When to c-bet, how much, and when to check, especially into several players.
    *Table Math:* how fold equity shrinks with each extra player in the pot.
17. **Playing the Turn and River.** Barreling, pot control, thin value, and the river decision as the most expensive one.
    *Table Math:* stack-to-pot ratio (SPR) and when you're committed.
18. **Bluffing and Semi-Bluffing.** Bluff selection, blockers, and the right ratio of value bets to bluffs.
    *Table Math:* semi-bluff EV with fold equity plus draw equity.
19. **Hand Reading.** Putting opponents on ranges street by street using bet sizes, timing, and history.
    *Table Math:* counting value combos vs. bluff combos on the river.
20. **Bet Sizing.** Why size matters, polarized vs. merged ranges, and sizing for value vs. sizing for fold equity. Live players react to size more than to theory, so exploit it.
    *Table Math:* what each sizing asks the caller to have.
21. **Part II Review.** Full live hands walked through with range-by-range analysis.

### Part III: Theory and Exploitation (the intermediate player)

22. **Game Theory Basics.** Nash equilibrium in plain language, indifference, minimum defense frequency (MDF), and alpha.
    *Table Math:* MDF and alpha as two sides of one fraction.
23. **Balance and Unexploitability.** Why balance protects you, where it costs you, and why it matters less in most live games.
    *Table Math:* checking whether your own river range has enough bluffs.
24. **Exploitative Play.** Identifying deviations and attacking them. The baseline-then-deviate method.
    *Table Math:* how much an opponent must over-fold before a bluff becomes automatic.
25. **Live Player Types and Population Tendencies.** Profiling the regulars, recreational players, and nits of a live room. Default adjustments at low, middle, and high stakes.
    *Table Math:* building a quick frequency profile from a session of observation.
26. **Tells, Table Talk, and Table Presence.** Physical tells, timing, chip handling, verbal tells, reliability, and controlling your own image.
    *Table Math:* weighting a tell as evidence, not proof.
27. **Multiway Pots.** The everyday reality of live poker: how ranges, bluffing, and hand values change with three or more players.
    *Table Math:* how many players need to miss for a bluff to work.
28. **Mental Math at the Table II: EV on the Fly.** Combining equity, fold equity, and pot size into one fast estimate. Implied odds and reverse implied odds in rough numbers. Working backward from a bet to the range that justifies it.
    *Table Math:* the "would I call a pot-size bet here" test.
29. **Part III Review.** The same live hands played twice: once by theory, once by exploitation.

### Part IV: Formats (choosing your arena)

30. **Live Cash Games.** Deep-stack play, rake and its real cost, game and table selection, seat selection, and reading a room before you sit.
    *Table Math:* what the rake and tips cost you per hour.
31. **Live Tournament Fundamentals.** Stack depth in big blinds, M and effective stacks, push-fold play, antes, and the stages of a tournament.
    *Table Math:* converting your stack to big blinds and M at a glance.
32. **ICM and Final Tables.** The Independent Chip Model, bubble play, pay jumps, and deal-making.
    *Table Math:* why chips you lose are worth more than chips you win.
33. **Heads-Up Play.** Ranges at their widest, pressure, and closing out a match.
    *Table Math:* how wide to defend when your opponent raises every hand.
34. **A Hold'em Player's Guide to Omaha.** Why big pairs shrink, why nut draws matter, and what Omaha teaches about equity. A survey of other games for the curious.
    *Table Math:* why a 13-out Omaha draw is routine and a 13-out Hold'em draw is a monster.

### Part V: The Player Behind the Cards (the serious player)

35. **The Mental Game.** Tilt types, emotional control, focus, and routines before, during, and after long live sessions.
    *Table Math:* tilt as a measurable leak in big blinds per hour.
36. **Bankroll, Business, and Longevity.** Bankroll at scale, moving up and down, staking and selling action, record keeping and taxes, travel, and health (sleep, fitness, stamina).
    *Table Math:* the stop-loss and move-up rules as numbers.

### Part VI: Expert Play (the advanced player)

37. **Solvers, Advanced Theory, and Elite Adaptation.** How solvers work, reading their output, node locking, simplifying for live play, and adapting against strong regulars and multi-level thinkers.
    *Table Math:* simplified strategies you can actually run in your head.
38. **The Lifelong Student.** Building a study system, reviewing live hands from notes, finding your own leaks, coaching and being coached, and adapting as the game changes.
    *Table Math:* how many hands it takes before your results mean anything.

### Appendices

- A. Table Math Cheat Sheet (see Part 4 below)
- B. Probability tables and odds charts
- C. Preflop range charts by position and stack depth, with live straddle adjustments
- D. Glossary
- E. Recommended reading and study path
- F. Live etiquette and house rules

## Part 3: The Poker Encyclopedia

Where the book is one path through the game, the encyclopedia is the full library. Each volume stands alone and goes deep. Twelve volumes, grouped by the six schools of the Oval Table. Hold'em and live play remain the default throughout.

### School of Foundations and Theory

**Volume 1: Rules, Procedure, and Etiquette.** Hold'em rules in full, live procedure and floor rulings, betting structures, and house rule variations.

**Volume 2: Mathematics of Poker.** Probability, combinatorics, EV, equity, variance, risk of ruin, and sample sizes, plus the complete mental math toolkit for live play. The natural first volume to draft.

**Volume 3: Game Theory.** Equilibrium, toy games, indifference, balance, MDF, solver theory, and how much of it matters in live games.

### School of Hold'em Strategy

**Volume 4: No-Limit Hold'em Strategy.** Preflop through river for every common spot, by position and stack depth, with live adjustments. The deepest single volume.

**Volume 5: Omaha and Other Games.** Pot-Limit Omaha and its variants, Stud, Razz, Draw games, and mixed-game rotations, written for a Hold'em player branching out.

### School of Reading People

**Volume 6: Hand Reading and Exploitation.** Range analysis, player profiling, live population tendencies, and exploitative adjustments.

**Volume 7: Tells, Psychology, and Table Dynamics.** Physical and timing tells, table talk, deception, image, and the psychology of live opponents.

### School of Tournament Strategy

**Volume 8: Tournament Poker.** Structures, stack depth play, ICM, bounties, satellites, final tables, and deal-making.

### School of Cash Games

**Volume 9: Live Cash Games and Game Selection.** Stakes progression, room and table selection, rake and tipping economics, straddle games, and high-stakes play.

### School of Mind and Body

**Volume 10: The Mental and Physical Game.** Tilt, focus, motivation, burnout, routines, sleep, fitness, and addiction awareness and prevention.

### School of the Business of Poker

**Volume 11: The Business of Poker.** Bankroll management, staking and backing, taxes and record keeping, travel, brand and media, coaching, and how poker skills transfer to business and life.

### Reference

**Volume 12: History, People, and Reference.** The history of the game, biographies of major players, famous hands, the World Series and major live tours, a full glossary, and an index across all volumes.

## Part 4: Table Math Cheat Sheet (Appendix A preview)

The numbers worth memorizing. Shortcuts first, exact figures in parentheses where they differ.

**Odds to percentages.** Odds of X to 1 means you win 1 time in X+1. 4 to 1 is 20%. 3 to 1 is 25%. 2 to 1 is 33%.

**The rule of 2 and 4.** On the flop with two cards to come, outs × 4. On the turn with one card to come, outs × 2. With more than 8 outs on the flop, subtract the outs above 8: 15 outs is 60 − 7 = 53% (exact: 54%).

**Common draws.**

| Draw | Outs | Flop to river | Turn to river |
| --- | --- | --- | --- |
| Flush draw | 9 | about 35% | about 20% |
| Open-ended straight draw | 8 | about 32% | about 17% |
| Gutshot | 4 | about 16% | about 9% |
| Flush draw + open-ender | 15 | about 54% | about 33% |
| Two overcards | 6 | about 24% | about 13% |

**Equity you need to call** (bet as a share of the pot before the bet).

| Bet size | Equity needed to call | Bluff must work | Minimum defense |
| --- | --- | --- | --- |
| 1/3 pot | 20% | 25% | 75% |
| 1/2 pot | 25% | 33% | 67% |
| 2/3 pot | 29% | 40% | 60% |
| Pot | 33% | 50% | 50% |
| 2× pot | 40% | 67% | 33% |

Formulas: to call, you need bet ÷ (pot + 2 × bet). A bluff breaks even when it works bet ÷ (pot + bet) of the time. Minimum defense is pot ÷ (pot + bet).

**Preflop matchups (all-in, rough).**

- Pair vs. two overcards (QQ vs. AK): about 55/45. The classic coin flip.
- Pair vs. smaller pair (KK vs. 88): about 80/20.
- Dominated hand (AK vs. AQ): about 70/30.
- Two overcards vs. two undercards (AK vs. 87): about 60/40.

**Combinations.**

- A specific pair: 6 combos. With one of those cards on the board or in your hand: 3. With two: 1.
- A specific unpaired hand: 16 combos (4 suited, 12 offsuit). With one card blocked: 12.
- 1,326 total starting hands. 169 distinct hand types.

**Frequencies.**

- Dealt a pocket pair: about 1 in 17 (6%). Dealt aces: 1 in 221.
- Pocket pair flops a set or better: about 1 in 8 (12%).
- Suited hand flops a flush draw: about 11%. Flops a made flush: under 1%.

**Stack depth.**

- Stack-to-pot ratio (SPR) = effective stack ÷ pot on the flop. Under 4, top pair is usually ready to get all in. Over 10, it usually isn't.
- Tournament M = stack ÷ (blinds + antes for one orbit). Under 10, push-fold thinking takes over.

## Next Iterations

- Turn each chapter title into a one-paragraph summary with learning goals.
- Assign a lead council voice to each chapter as its guiding perspective.
- Expand the Table Math Cheat Sheet into a printable one-page card.
- Draft the first encyclopedia volume. Volume 2 (Mathematics) fits Ryan's style best.
