// Verifies every level: the target is reachable, the stored `best` is the fewest moves, and the level's full map
// (what the game's worker builds for hints and dead-end warnings) stays quick to build.
// Usage: node tools/check.cjs            (all levels)
//        node tools/check.cjs 16 20      (levels 16..20, 1-based)
const {LEVELS,explore,hash,iso,capOf}=require('./sim.cjs');
const a=+(process.argv[2]||1),b=+(process.argv[3]||LEVELS.length);let bad=0;
for(let i=a-1;i<b;i++){const L=LEVELS[i],t0=Date.now(),M=explore(L.start,L.rules,capOf(L)),ms=Date.now()-t0,st=M.S.get(hash(L.target));
  const opt=st&&st.d!==Infinity&&iso(st.g,L.target)?st.d:-1,ok=opt>0&&(L.best===undefined||L.best===opt)&&M.full&&ms<2500;if(!ok)bad++;
  console.log(`${ok?'ok ':'BAD'} ${String(i+1).padStart(3)} ${L.name.padEnd(28)} best ${String(opt).padStart(2)} stored ${String(L.best??'-').padStart(2)}  map ${M.S.size} shapes${M.full?'':' (cut short)'} ${ms}ms`);}
process.exit(bad?1:0);
