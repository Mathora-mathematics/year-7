(() => {
'use strict';
function apply(data){
 const packs=window.NES_ENRICH_PACKS||[]; const extras={},contexts={};
 packs.forEach(p=>{Object.assign(extras,p.extras||{});Object.assign(contexts,p.contexts||{})});
 (data||[]).forEach(L=>{
  const ex=extras[String(L.lesson)]; if(!ex||L._enriched)return;
  L.context=contexts[String(L.lesson)]||'';
  ex.slice(0,4).forEach(x=>{L.practice.push(x.q);L.solutions.practice.push(x.a);L.practiceSources.push('Stage 7/8 book-pattern adaptation · '+x.kind)});
  ex.slice(4).forEach(x=>{L.homework.push(x.q);L.solutions.homework.push(x.a)});
  L._enriched=true;
 });
}
window.NES_ENRICH={apply};
})();