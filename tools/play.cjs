// Player model: how someone who reads colour counts fares on each level.
//   greedy   always the move that best matches the target's colour counts, node and link count (high = too easy)
//   careful  softmax on that match, never repeats a shape, backtracks when boxed in, 120 actions (low = near hopeless)
//   uphill   fewest moves on a best route that do not improve the match
// Usage: node tools/play.cjs [from] [to]
const P='./sim.cjs';
const {LEVELS,explore,toTarget,hash,nbrs,capOf}=require(P);
const a=+(process.argv[2]||1),b=+(process.argv[3]||LEVELS.length);
let seed=1;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
const feat=g=>{const N=nbrs(g),h=new Map();for(const v of g.V){const d=N.get(v).size;h.set(d,(h.get(d)||0)+1);}return {n:g.V.length,m:g.E.size,h};};
const dist=(f,t)=>{let s=0;const ks=new Set([...f.h.keys(),...t.h.keys()]);for(const k of ks)s+=Math.abs((f.h.get(k)||0)-(t.h.get(k)||0));return s/2+Math.abs(f.n-t.n)+Math.abs(f.m-t.m);};
for(let i=a-1;i<b;i++){const L=LEVELS[i],M=explore(L.start,L.rules,capOf(L)),th=hash(L.target),D=toTarget(M,th),B=D.get(M.s0),tf=feat(L.target);
  const H=new Map();const h=k=>{if(!H.has(k))H.set(k,dist(feat(M.S.get(k).g),tf));return H.get(k);};
  const out=k=>(M.S.get(k).out||[]).map(x=>x[0]);
  // uphill: fewest moves on an optimal route that do not lower the colour-count distance
  const up=new Map([[th,0]]);const order=[...D.entries()].filter(([k,d])=>d<=B).sort((x,y)=>x[1]-y[1]);
  for(const [k,d] of order){if(k===th)continue;let best=Infinity;for(const v of out(k))if(D.get(v)===d-1&&up.has(v))best=Math.min(best,up.get(v)+(h(v)<h(k)?0:1));up.set(k,best);}
  // greedy player: always a move that lowers the distance most (random ties), no undo
  let g3=0,gAny=0;const T=300;
  for(let t=0;t<T;t++){let k=M.s0,n=0;while(k!==th&&n<B+4){const o=out(k);if(!o.length)break;const m=Math.min(...o.map(h));const c=o.filter(v=>h(v)===m);k=c[Math.floor(rnd()*c.length)];n++;}
    if(k===th){gAny++;if(n===B)g3++;}}
  // careful player: softmax on distance, never revisits a shape this attempt, backtracks when boxed in; budget of actions
  let solved=0,acts=[];const T2=200,BUD=120;
  for(let t=0;t<T2;t++){let path=[M.s0],seen=new Set([M.s0]),n=0;
    while(n<BUD){const k=path[path.length-1];if(k===th)break;const o=out(k).filter(v=>!seen.has(v));
      if(!o.length||path.length>B+6){path.pop();n++;if(!path.length)break;continue;}
      const w=o.map(v=>Math.exp(-1.6*h(v)));let s=w.reduce((x,y)=>x+y),r=rnd()*s,j=0;while(r>w[j]){r-=w[j];j++;}
      seen.add(o[j]);path.push(o[j]);n++;}
    if(path[path.length-1]===th){solved++;acts.push(n);}}
  acts.sort((x,y)=>x-y);
  const br=out(M.s0).length;
  console.log([String(i+1).padStart(3),L.name.slice(0,14).padEnd(14),'B',String(B).padStart(2),'branch',String(br).padStart(3),'uphill',up.get(M.s0),'greedy3★',String(Math.round(100*g3/T)).padStart(3)+'%','greedyAny',String(Math.round(100*gAny/T)).padStart(3)+'%','careful',String(Math.round(100*solved/T2)).padStart(3)+'%','medActs',acts.length?acts[acts.length>>1]:'-'].join(' '));}
