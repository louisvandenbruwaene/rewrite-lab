// How each level plays (the game's own analyze()): star tiers, optimal routes, precision, rules used, dead ends.
//   tiers  is there a solution of exactly best, best+1 .. best+4 moves (3, 2 and 1 star)
//   D      difficulty, -log10(precision) + 0.3 x best; precision = chance that random play hits the target in best moves
// Usage: node tools/stars.cjs [from] [to]
const {LEVELS,analyze}=require('./sim.cjs');
const a=+(process.argv[2]||1),b=+(process.argv[3]||LEVELS.length);
for(let i=a-1;i<b;i++){const L=LEVELS[i],r=analyze(L);
  if(!r){console.log(`${String(i+1).padStart(3)} ${L.name} TARGET UNREACHABLE`);continue;}
  const flag=r.tiers?'   ':' ! ';
  console.log(`${String(i+1).padStart(3)} ${L.name.slice(0,26).padEnd(26)} best ${String(r.B).padStart(2)}${L.best!==undefined&&L.best!==r.B?' (stored '+L.best+'!)':''}  D ${r.D.toFixed(2).padStart(5)}  tiers ${r.exact.map(x=>x?'Y':'-').join('')}${flag}routes ${String(r.routes).padStart(4)}  rules ${L.rules.length-r.unused.length}/${L.rules.length}${r.unused.length?' unused:'+r.unused:''}  stuck ${Math.round(r.stuck*100)}%`);}
