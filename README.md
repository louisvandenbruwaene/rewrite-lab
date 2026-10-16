# Rewrite Lab

Rewrite Lab: rewrite a graph into the target shape. One self-contained HTML file, no build step: open [`index.html`](index.html).

## Play on this Mac

```
./app/install_app.sh   # puts Rewrite Lab in /Applications
./app/make_icon.sh     # only needed after editing app/icon.html
```

The app opens the game in its own Brave window. The folder path is baked in, so re-run `install_app.sh` if this folder moves.

## Levels

30 levels, 12 rules. Levels 16-30 store their fewest-moves count (`best`). After editing a level, check every one against the solver:

```
node tools/check.cjs          # all levels
node tools/check.cjs 16 30    # a range
```
