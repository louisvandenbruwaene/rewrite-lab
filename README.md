# Rewrite Lab

Rewrite Lab: rewrite a graph into the target shape. One self-contained HTML file, no build step: open [`index.html`](index.html).

## Play on this Mac

```
./app/install_app.sh   # puts Rewrite Lab in /Applications
./app/make_icon.sh     # only needed after editing app/icon.html
```

The app opens the game in its own Brave window. The folder path is baked in, so re-run `install_app.sh` if this folder moves.

## Levels

100 levels in 8 chapters, 12 rules. Stars: 3 for the fewest moves, 2 for at most two more, 1 for any solve.

Levels 1-11, 13 and 15 are the originals. The rest come from a solver search: from each start, every reachable shape is a candidate target, kept when it is far away yet only a few move orders (at most three) reach it. Each must also have real star tiers (solutions at best, best+1 or +2, and longer), need every rule it offers, and stay under 75% dead ends. Difficulty is -log10(precision) + 0.3 x best, where precision is the chance that random play hits the target in best moves. The curve climbs steadily from level 15 (60% of the top) with a wave on top, an easier opener and a harder closer per chapter.

## How it plays

- A worker maps each level when it opens: every shape that can still reach the target and how far it is. Hints read the next move straight off that map, and a move into a dead end is flagged at once.
- Everything sits on one screen: the board scales to the window, rules, hint, counts and buttons share one dock row.
- Clicking is forgiving: a move that can only finish one way happens on the first click (a Star often needs one click, not three), a click with no rule chosen uses the only rule that fits there, nodes show their link count as a digit, and hit areas are generous.
- Each chapter opens with a short, easy level for its new rule, then a gentle practice level, before the curve climbs again.
- **The Lab** mixes fresh puzzles on the spot (Easy, Medium, Hard) from the rules the player has met, under the same quality rules as the campaign.

## Tools

```
node tools/check.cjs          # fewest moves and map build time, all levels
node tools/stars.cjs 16 30    # tiers, routes, difficulty, unused rules, dead ends, for a range
```
