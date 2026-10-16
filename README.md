# Rewrite Lab

Rewrite Lab: rewrite a graph into the target shape. One self-contained HTML file, no build step: open [`index.html`](index.html).

## Play on this Mac

```
./app/install_app.sh   # puts Rewrite Lab in /Applications
./app/make_icon.sh     # only needed after editing app/icon.html
```

The app opens the game in its own Brave window. The folder path is baked in, so re-run `install_app.sh` if this folder moves.

## Levels

100 levels, 12 rules. Level 15 sits at about 60% of the hardest level's difficulty (fewest moves + graph size + rule count); levels 16-100 climb linearly from there. They were picked from a solver catalogue of every named shape reachable from each start, so each one stores its fewest moves (`best`) and the node cap it was solved under (`cap`), which keeps every Hint under a second.

After editing a level, check them all against the solver (fewest moves and worst-case Hint time):

```
node tools/check.cjs          # all levels
node tools/check.cjs 16 30    # a range
```
