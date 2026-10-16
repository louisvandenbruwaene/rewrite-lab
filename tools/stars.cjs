// Star-tier and solution-quality analysis per level, over shapes up to isomorphism.
//   tiers  exact b..b+4: is there a solution of exactly best, best+1 .. best+4 moves (3, 2 and 1 star)
//   routes optimal routes (sequences of shapes); precision = routes / all move sequences of that length,
//          the chance that random play hits the target in best moves (lower = more thinking)
//   rules  how many of the level's rules appear on some optimal route
//   stuck  share of shapes within best moves of the start from which the target can no longer be reached
// Usage: node tools/stars.cjs [from] [to]
const {LEVELS,RULES,moves,hash,iso,capOf}=require('./sim.cjs');
function analyze(L,limit=80000){const cap=capOf(L),th=hash(L.target);
  const cls=new Map(),succ=new Map(),add=g=>{const k=hash(g);if(!cls.has(k))cls.set(k,g);return k;};
  const next=k=>{let out=succ.get(k);if(out)return out;const g=cls.get(k);out=[];const seen=new Set();
    for(const r of L.rules)for(const p of moves(g,r)){const h=RULES[r].apply(g,p);if(h.V.length>cap)continue;const v=add({next:h.next,V:h.V,E:h.E});out.push([v,r]);}
    succ.set(k,out);return out;};
  const s0=add(L.start),tOk=cls.has(th)?null:undefined;
  // explore everything reachable (finite under the cap), shortest distances + route counts
  const dist=new Map([[s0,0]]),cnt=new Map([[s0,1]]);let layer=[s0],B=-1,full=true;
  for(let d=1;layer.length;d++){const nl=[];
    for(const u of layer)for(const [v] of next(u)){if(!dist.has(v)){dist.set(v,d);cnt.set(v,0);nl.push(v);}if(dist.get(v)===d)cnt.set(v,cnt.get(v)+cnt.get(u));}
    layer=nl;if(B<0&&dist.get(th)===d&&iso(cls.get(th),L.target))B=d;if(dist.size>limit){full=false;break;}if(!full)break;}
  if(B<0)return {B:-1};
  // walks of exact length: counts (float) per class, layer by layer
  let W=new Map([[s0,1]]);const exact=[];let walksB=0;
  for(let k=1;k<=B+4;k++){const N=new Map();for(const [u,c] of W)for(const [v] of next(u))N.set(v,(N.get(v)||0)+c);W=N;
    if(k===B){for(const c of W.values())walksB+=c;}if(k>=B)exact.push(W.has(th));}
  // reverse reachability to the target over the explored graph
  const rev=new Map();for(const [u,out] of succ)for(const [v] of out){if(!rev.has(v))rev.set(v,[]);rev.get(v).push(u);}
  const good=new Set([th]),q=[th];while(q.length){const v=q.pop();for(const u of rev.get(v)||[])if(!good.has(u)){good.add(u);q.push(u);}}
  const inner=[...dist].filter(([k,d])=>d<=B&&succ.has(k)).map(([k])=>k),stuck=inner.filter(k=>!good.has(k)).length/inner.length;
  // rules on optimal routes
  const onOpt=new Set([th]),rules=new Set();
  for(let d=B;d>0;d--)for(const [u,du] of dist)if(du===d-1&&succ.has(u))for(const [v,r] of succ.get(u))if(dist.get(v)===d&&onOpt.has(v)){onOpt.add(u);rules.add(r);}
  const routes=cnt.get(th);
  return {B,exact,routes,precision:routes/walksB,rules:[...rules],unused:L.rules.filter(r=>!rules.has(r)),stuck,states:dist.size,full,
    tiers:exact[0]&&(exact[1]||exact[2])&&(exact[3]||exact[4])};}
module.exports={analyze};
if(require.main===module){const a=+(process.argv[2]||1),b=+(process.argv[3]||LEVELS.length);
  for(let i=a-1;i<b;i++){const L=LEVELS[i],r=analyze(L);
    console.log(`${String(i+1).padStart(3)} ${L.name.slice(0,28).padEnd(28)} best ${String(r.B).padStart(2)}${L.best!==undefined&&L.best!==r.B?' (stored '+L.best+'!)':''}  tiers ${r.exact.map(x=>x?'Y':'-').join('')}${r.tiers?'   ':' ! '} precision ${r.precision.toExponential(1)}  rules ${r.rules.length}/${L.rules.length}${r.unused.length?' unused:'+r.unused:''}  stuck ${Math.round(r.stuck*100)}%`);}}
