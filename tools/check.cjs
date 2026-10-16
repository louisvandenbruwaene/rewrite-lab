// Verifies every level: the target is reachable and the stored `best` equals the solver's fewest moves.
// Usage: node tools/check.cjs            (all levels)
//        node tools/check.cjs 16 20      (levels 16..20, 1-based)
const {LEVELS,solve,capOf}=require('./sim.cjs');
const a=+(process.argv[2]||1),b=+(process.argv[3]||LEVELS.length);let bad=0;
for(let i=a-1;i<b;i++){const L=LEVELS[i],t0=Date.now(),opt=solve(L.start,L.target,L.rules,L.best?L.best+1:9,capOf(L)),ms=Date.now()-t0;
  const ok=opt>0&&(L.best===undefined||L.best===opt);if(!ok)bad++;
  console.log(`${ok?'ok ':'BAD'} ${String(i+1).padStart(2)} ${L.name.padEnd(18)} best ${String(opt).padStart(2)} stored ${L.best??'-'}  ${ms}ms`);}
process.exit(bad?1:0);
