import fs from 'node:fs';
import vm from 'node:vm';

const root=new URL('../',import.meta.url);
const context=vm.createContext({window:{},console});

function run(rel){
  const code=fs.readFileSync(new URL(rel,root),'utf8');
  vm.runInContext(code,context,{filename:rel});
}

run('data/lessons.js');
run('data/textbook-map.js');
for(let i=1;i<=12;i++) run('data/enrichment/u'+String(i).padStart(2,'0')+'.js');
run('data/enrichment/core.js');

const lessons=context.window.NES_LESSONS||[];
const bookMap=context.window.NES_TEXTBOOK_MAP||{};
context.window.NES_ENRICH.apply(lessons);

const fail=[];
if(lessons.length!==70) fail.push('Expected 70 lessons, found '+lessons.length);
if(Object.keys(bookMap).length!==70) fail.push('Expected 70 textbook mappings, found '+Object.keys(bookMap).length);

for(const L of lessons){
  const label='Lesson '+L.lesson+' '+L.code;
  if(!bookMap[String(L.lesson)]?.stage7?.printedPage || !bookMap[String(L.lesson)]?.stage8?.printedPage) fail.push(label+': missing Stage 7/8 textbook page map');
  if((L.starter||[]).length!==4) fail.push(label+': starter count');
  if((L.examples||[]).length!==3) fail.push(label+': example count');
  if((L.practice||[]).length!==24) fail.push(label+': expected 24 practice questions, found '+(L.practice||[]).length);
  if((L.homework||[]).length!==14) fail.push(label+': expected 14 homework questions, found '+(L.homework||[]).length);
  if((L.solutions?.practice||[]).length!==(L.practice||[]).length) fail.push(label+': practice answers misaligned');
  if((L.solutions?.homework||[]).length!==(L.homework||[]).length) fail.push(label+': homework answers misaligned');
  if((L.practiceSources||[]).length<(L.practice||[]).length) fail.push(label+': practice source tags misaligned');
  if(!String(L.context||'').trim()) fail.push(label+': missing contextual learning note');
  const qs=[...(L.practice||[]),...(L.homework||[])].map(x=>String(x).trim());
  const seen=new Map();
  qs.forEach((q,i)=>{ if(seen.has(q)) fail.push(label+': duplicate question "'+q+'" at positions '+(seen.get(q)+1)+' and '+(i+1)); else seen.set(q,i); });
  const ans=[...(L.solutions?.starter||[]),...(L.solutions?.practice||[]),...(L.solutions?.homework||[])];
  if(ans.some(x=>x===undefined||x===null||String(x).trim()==='')) fail.push(label+': empty answer');
}
if(fail.length){
  console.error(fail.join('\n'));
  process.exit(1);
}
console.log('PASS: 70 lessons; 70 Stage 7/8 textbook mappings; 24 practice + 14 homework questions each; aligned sources, answers and contexts.');
