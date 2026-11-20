# The Poker University Book: Outline, Draft 1

Nov 20, 2026 · Draft for iteration

This document has three parts. First, a thought experiment: eight members of the Oval Table council argue over what the book must cover. Second, the outline that came out of that argument, a single comprehensive book from first principles to expert play. Third, the major volumes of a larger encyclopedia.

## Part 1: The Council Debates the Book

**A note on framing.** This is an imagined conversation, written to test the outline from several angles. None of the lines below are real quotes. Each voice is built from the ideas the player is publicly known for, as summarized in the Oval Table doc.

**At the table:** David Sklansky, Phil Galfond, Daniel Negreanu, Dan Harrington, Phil Ivey, Doyle Brunson, Fedor Holz, Vanessa Selbst.

### Round 1: Where does the book start?

**Sklansky:** It starts with expected value. Before a reader knows what a flush draw is worth, they need to know that a decision is good or bad regardless of how the hand turns out. Chapter one is "results don't matter, decisions do." Everything else is an application of that.

**Galfond:** I agree on the destination, but not as chapter one. A true beginner who opens to an EV formula closes the book. Start with the rules, the flow of a hand, and why position matters. Get them playing. Then, in chapter four or five, show them that the choices they've been making intuitively have a number attached.

**Brunson:** Teach them to be aggressive from the first page. The worst habit a new player builds is calling. If the first lessons are about raising or folding, they'll never have to unlearn it.

**Negreanu:** And teach them to watch the other players from the first hand, not after they've "mastered the math." Reading people isn't an advanced topic. A beginner can learn that the guy who hasn't played a hand in an hour has aces when he raises.

**Decision:** The book opens with the game itself (rules, hand flow, position), then moves fast into EV and aggression as the two founding ideas. Observation of opponents appears in Part I, not deferred to the advanced section.

### Round 2: Theory first or people first?

**Sklansky:** The Fundamental Theorem settles it. You gain when an opponent plays differently than they would if they could see your cards. That's a theory statement and a people statement at the same time.

**Galfond:** The modern version is: learn the balanced baseline, then learn to deviate. GTO isn't the goal, it's the map. Exploitation is the trip. A student who only knows exploits gets lost when the opponent is good. A student who only knows GTO leaves money on the table against everyone else.

**Negreanu:** I lived both sides of this. I played by feel for twenty years, fell behind, and rebuilt with solvers. The book should say plainly that you need both, and it should teach them in alternating chapters so neither becomes "the real stuff" and the other "the extra."

**Ivey:** Theory tells you what's possible. The table tells you what's happening. Put the reads chapter right next to the range chapter. Same hand, two lenses.

**Decision:** Part II (intermediate) pairs theory and exploitation chapters. Ranges and balance sit next to hand reading and population tendencies. The book states one thesis: GTO is the baseline, exploitation is how you win.

### Round 3: How much tournament material?

**Harrington:** Most new players play tournaments, and tournaments change the math. Stack depth decides strategy before your cards do. ICM can make a correct cash-game call a disaster. If the book treats tournaments as an appendix, it fails most of its readers.

**Ivey:** Then don't let it become a tournament book either. Cash games teach the deep-stack decisions that tournaments rarely reach. And a complete player knows more than No-Limit Hold'em.

**Brunson:** Cash is where you learn the game. Tournaments are where you learn to survive it.

**Decision:** The core strategy chapters are format-neutral and assume deep stacks. Part IV splits into cash and tournament tracks, each with its own chapters. Other variants get one survey chapter in the book and a full volume in the encyclopedia.

### Round 4: Does the mental game belong in a strategy book?

**Holz:** It isn't optional. I've seen more money lost to tilt, fatigue, and bad routines than to bad river decisions. If a reader learns perfect strategy but can't execute it in hour nine, the strategy is worth nothing.

**Sklansky:** Fine, but tie it to EV. Tilt is a measurable leak. Quitting when you're tired is a +EV decision. Don't make it a self-help chapter.

**Selbst:** And make it practical. Bankroll, variance, game selection, record keeping. These decide whether a winning player stays in the game long enough to show it.

**Brunson:** I played sixty years. Bankroll management is why. Put it in the beginner section, not the end.

**Decision:** Bankroll basics and variance appear in Part I. A full part (Part V) covers the mental game, bankroll at scale, and the business of poker, framed in EV terms.

### Round 5: What makes the expert section expert?

**Galfond:** Solver work, node locking, building your own strategies, and understanding why the solver does what it does, not just memorizing outputs.

**Ivey:** Adapting in real time against strong opponents. Leveling wars. Knowing when your opponent knows that you know.

**Negreanu:** Self-study. The expert is the person who can find their own leaks without a coach.

**Holz:** And longevity. Staying good as the game changes, which means a study system and a life outside poker.

**Decision:** Part VI covers advanced theory, elite exploitation, and the study system that keeps a player improving. The book closes on how to keep learning after the last page.

### Points the council left open

1. Should every chapter carry a "live vs. online" sidebar, or should those get separate chapters?
2. How deep should the math go in the main text vs. a math appendix?
3. Does Pot-Limit Omaha deserve its own part in the book, or only a volume in the encyclopedia?

## Part 2: The Book Outline

Working title: **The Complete Game: From First Hand to Expert Play**

Six parts, 36 chapters. Each part ends with a review chapter of worked hands. No-Limit Texas Hold'em is the default game unless stated.

### Part I: Foundations (the first-time player)

1. **What Poker Really Is.** A game of incomplete information and decisions under uncertainty. Skill vs. luck over the short and long run.
2. **Rules, Hands, and the Flow of Play.** Hand rankings, blinds and antes, betting rounds, showdown, common variants at a glance.
3. **Position.** Why acting last is an advantage. Seat names and how position changes every decision.
4. **Starting Hands.** Hand categories, opening by position, and why folding most hands is correct. (Links to the existing starting-hands guide.)
5. **Odds and Outs.** Counting outs, the rule of 2 and 4, pot odds, and the call-or-fold decision.
6. **Expected Value.** Decisions vs. results, the Fundamental Theorem of Poker, thinking in long-run averages.
7. **Aggression.** Why betting and raising beat calling. Fold equity. The two ways to win a pot.
8. **Watching the Table.** First-level observation: who plays many hands, who plays few, who bets big, who never bluffs.
9. **Bankroll and Variance Basics.** Why good players lose sessions, how much money to sit with, and how not to go broke.
10. **Part I Review.** Twenty annotated beginner hands.

### Part II: The Core Game (the developing player)

11. **Preflop Strategy.** Open ranges, 3-betting, 4-betting, defending the blinds, and limping (and why to avoid it).
12. **Thinking in Ranges.** Moving from "what hand does he have" to "what hands could he have." Range construction and range narrowing.
13. **Board Texture.** Dry vs. wet boards, range advantage, nut advantage, and how the flop changes who is ahead.
14. **Continuation Betting.** When to c-bet, how much, and when to check.
15. **Playing the Turn and River.** Barreling, pot control, value betting thin, and the river decision as the most expensive one.
16. **Bluffing and Semi-Bluffing.** Bluff selection, blockers, and the right ratio of value to bluffs.
17. **Hand Reading.** Putting opponents on ranges street by street using bet sizes, timing, and history.
18. **Bet Sizing.** Why size matters, polarized vs. merged ranges, and sizing for value vs. sizing for fold equity.
19. **Part II Review.** Full-hand walkthroughs with range-by-range analysis.

### Part III: Theory and Exploitation (the intermediate player)

20. **Game Theory Basics.** Nash equilibrium in plain language, indifference, minimum defense frequency, and alpha.
21. **Balance and Unexploitability.** Why balance protects you, and where it costs you.
22. **Exploitative Play.** Identifying deviations and attacking them. The baseline-then-deviate method.
23. **Player Types and Population Tendencies.** Profiling opponents, live vs. online pools, and default adjustments by stake.
24. **Tells and Table Presence.** Physical and timing tells, reliability, and controlling your own image.
25. **Multiway Pots and Short-Handed Play.** How strategy changes with more or fewer players.
26. **Part III Review.** The same hands played twice: once by theory, once by exploitation.

### Part IV: Formats (choosing your arena)

27. **Cash Game Strategy.** Deep-stack play, game selection, table selection, and rake.
28. **Tournament Fundamentals.** Stack depth in big blinds, M and effective stacks, push-fold play, and the stages of a tournament.
29. **ICM and Final Tables.** The Independent Chip Model, bubble play, pay jumps, and deal-making.
30. **Heads-Up Play.** Ranges at their widest, pressure, and closing out a match.
31. **Beyond Hold'em.** A survey of Pot-Limit Omaha, Stud, Razz, Draw games, and mixed-game rotations.

### Part V: The Player Behind the Cards (the serious player)

32. **The Mental Game.** Tilt types, emotional control, focus, and routines before, during, and after sessions.
33. **Bankroll, Business, and Longevity.** Bankroll at scale, moving up and down, staking and selling action, record keeping, and health (sleep, fitness, stamina).

### Part VI: Expert Play (the advanced player)

34. **Solvers and Advanced Theory.** How solvers work, reading solver output, node locking, simplification, and building your own strategy.
35. **Elite Adaptation.** Playing against strong regulars, multi-level thinking, dynamic adjustments, and exploiting the exploiters.
36. **The Lifelong Student.** Building a study system, hand review, finding your own leaks, coaching and being coached, and adapting as the game changes.

### Appendices

- A. Probability tables and odds charts
- B. Preflop range charts by position and stack depth
- C. Glossary
- D. Recommended reading and study path
- E. Etiquette and rules of conduct (live and online)

## Part 3: The Poker Encyclopedia

Where the book is one path through the game, the encyclopedia is the full library. Each volume stands alone and goes deep. Twelve volumes, grouped by the six schools of the Oval Table.

### School of Foundations and Theory

**Volume 1: Rules and Games.** Every major variant, its rules and structures, betting formats (limit, pot-limit, no-limit), and procedural rules for live and online play.

**Volume 2: Mathematics of Poker.** Probability, combinatorics, EV, equity, variance and standard deviation, risk of ruin, and sample sizes.

**Volume 3: Game Theory.** Equilibrium, toy games, indifference, balance, MDF, solver theory, and the history of game theory in poker.

### School of Hold'em and Core Strategy

**Volume 4: No-Limit Hold'em Strategy.** Preflop through river for every common spot, by position and stack depth. The deepest single volume.

**Volume 5: Limit and Mixed Games.** Pot-Limit Omaha (and its variants), Stud, Razz, Stud Hi-Lo, 2-7 Triple Draw, Badugi, and mixed-game rotations.

### School of Reading People

**Volume 6: Hand Reading and Exploitation.** Range analysis, player profiling, population data, and exploitative adjustments.

**Volume 7: Tells, Psychology, and Table Dynamics.** Physical and timing tells, deception, image, table talk, and the psychology of opponents.

### School of Tournament Strategy

**Volume 8: Tournament Poker.** Structures, stack depth play, ICM, bounties and progressive knockouts, satellites, final tables, and deal-making.

### School of Cash and Mixed Games

**Volume 9: Cash Games and Game Selection.** Stakes progression, table selection, rake economics, live vs. online cash, and high-stakes play.

### School of Mind and Body

**Volume 10: The Mental and Physical Game.** Tilt, focus, motivation, burnout, routines, sleep, fitness, and addiction awareness and prevention.

### School of the Business of Poker

**Volume 11: The Business of Poker.** Bankroll management, staking and backing, taxes and record keeping, brand and media, coaching, and how poker skills transfer to business and life.

### Reference

**Volume 12: History, People, and Reference.** The history of the game from riverboats to solvers, biographies of major players, famous hands, the World Series and major tours, a full glossary, and an index across all volumes.

## Next Iterations

- Settle the three open questions from the debate.
- Turn each chapter title into a one-paragraph chapter summary with learning goals.
- Assign a lead "council voice" to each chapter as its guiding perspective.
- Decide which encyclopedia volume gets drafted first (Volume 2 or Volume 4 are the natural starting points).
