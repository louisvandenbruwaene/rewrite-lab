# Rewrite Lab

Rewrite Lab: rewrite a graph into the target shape. One self-contained HTML file, no build step: open [`index.html`](index.html).

## Play on this Mac

```
./app/install_app.sh   # puts Rewrite Lab in /Applications
./app/make_icon.sh     # only needed after editing app/icon.html
```

The app opens the game in its own Brave window. The folder path is baked in, so re-run `install_app.sh` if this folder moves.

## Levels

100 levels, 12 rules. Stars: 3 for the fewest moves, 2 for at most two more, 1 for any solve.

Levels 16-100 come from a solver search (every shape reachable from each start, kept when only a few move orders reach it) and must pass `tools/stars.cjs`: at most three optimal routes, so a 3-star solve is a specific plan rather than any order; solutions exist at best, at best+1 or +2 (2 stars) and longer (1 star), every rule the level offers is on some optimal route, and fewer than 75% of positions are dead ends. Difficulty is -log10(precision) + 0.3 x best, where precision is the chance that random play hits the target in best moves. Level 15 sits at 60% of the hardest level. Each level stores its fewest moves (`best`) and the node cap it was solved under (`cap`), which keeps every Hint under a second.

After editing a level:

```
node tools/check.cjs          # fewest moves + worst-case Hint time, all levels
node tools/stars.cjs 16 30    # star tiers, precision, unused rules, dead ends, for a range
```
