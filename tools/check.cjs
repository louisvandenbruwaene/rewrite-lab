// Verifies every level: the stored `best` equals the solver's fewest moves, and a Hint from anywhere stays fast.
// "hint" is the worst case: a full search to the level's depth limit that never finds the target.
// Usage: node tools/check.cjs            (all levels)
//        node tools/check.cjs 16 20      (levels 16..20, 1-based)
const {LEVELS,solve,capOf,depthOf,G}=require('./sim.cjs');
const a=+(process.argv[2]||1),b=+(process.argv[3]||LEVELS.length),NONE=G(1,[]);let bad=0;
for(let i=a-1;i<b;i++){const L=LEVELS[i];let t0=Date.now();const opt=solve(L.start,L.target,L.rules,depthOf(L),capOf(L)),ms=Date.now()-t0;
  t0=Date.now();solve(L.start,NONE,L.rules,depthOf(L),capOf(L));const worst=Date.now()-t0;
  const ok=opt>0&&(L.best===undefined||L.best===opt)&&worst<2500;if(!ok)bad++;
  console.log(`${ok?'ok ':'BAD'} ${String(i+1).padStart(3)} ${L.name.padEnd(32)} best ${String(opt).padStart(2)} stored ${String(L.best??'-').padStart(2)}  solve ${ms}ms  worst hint ${worst}ms`);}
process.exit(bad?1:0);
