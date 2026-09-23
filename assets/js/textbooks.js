(() => {
'use strict';

const DB_NAME='nes-maths-textbooks-v1';
const STORE='books';
const pdfCache=new Map();

function openDb(){
  return new Promise((resolve,reject)=>{
    const req=indexedDB.open(DB_NAME,1);
    req.onupgradeneeded=()=>{const db=req.result;if(!db.objectStoreNames.contains(STORE))db.createObjectStore(STORE,{keyPath:'stage'});};
    req.onsuccess=()=>resolve(req.result);
    req.onerror=()=>reject(req.error);
  });
}
async function putBook(stage,file){
  const data=await file.arrayBuffer();
  const db=await openDb();
  await new Promise((resolve,reject)=>{
    const tx=db.transaction(STORE,'readwrite');
    tx.objectStore(STORE).put({stage:Number(stage),name:file.name,data,updatedAt:Date.now()});
    tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);
  });
  pdfCache.delete(Number(stage));
  return {stage:Number(stage),name:file.name};
}
async function getRecord(stage){
  try{
    const db=await openDb();
    return await new Promise((resolve,reject)=>{
      const tx=db.transaction(STORE,'readonly');
      const req=tx.objectStore(STORE).get(Number(stage));
      req.onsuccess=()=>resolve(req.result||null);
      req.onerror=()=>reject(req.error);
    });
  }catch(e){return null}
}
async function removeBook(stage){
  const db=await openDb();
  await new Promise((resolve,reject)=>{
    const tx=db.transaction(STORE,'readwrite');
    tx.objectStore(STORE).delete(Number(stage));
    tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);
  });
  pdfCache.delete(Number(stage));
}
async function getPdf(stage){
  stage=Number(stage);
  if(pdfCache.has(stage)) return pdfCache.get(stage);
  const rec=await getRecord(stage);
  if(!rec?.data || !window.pdfjsLib) return null;
  if(window.pdfjsLib.GlobalWorkerOptions && !window.pdfjsLib.GlobalWorkerOptions.workerSrc) window.pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  const bytes=rec.data.slice ? rec.data.slice(0) : rec.data;
  const doc=await window.pdfjsLib.getDocument({data:bytes}).promise;
  pdfCache.set(stage,doc);
  return doc;
}
function paintMessage(canvas,title,sub=''){
  const box=canvas.getBoundingClientRect();
  const dpr=Math.max(1,window.devicePixelRatio||1);
  canvas.width=Math.max(700,Math.round((box.width||700)*dpr));
  canvas.height=Math.max(360,Math.round((box.height||360)*dpr));
  const c=canvas.getContext('2d');
  c.setTransform(dpr,0,0,dpr,0,0);
  const w=canvas.width/dpr,h=canvas.height/dpr;
  c.fillStyle='#fff';c.fillRect(0,0,w,h);
  c.strokeStyle='#dedbd3';c.lineWidth=1;c.strokeRect(.5,.5,w-1,h-1);
  c.fillStyle='#111214';c.font='500 22px Inter, Arial';c.textAlign='center';
  c.fillText(title,w/2,h/2-8);
  c.fillStyle='#73767a';c.font='14px Inter, Arial';
  if(sub)c.fillText(sub,w/2,h/2+22);
}
function detectWorkedRegion(full){
  const ctx=full.getContext('2d',{willReadFrequently:true});
  const w=full.width,h=full.height;
  let img;
  try{img=ctx.getImageData(0,0,w,h).data}catch(e){return {x:0,y:Math.round(.18*h),w,h:Math.round(.48*h)}}
  const step=6;
  const scores=new Float32Array(Math.ceil(h/step));
  for(let y=0,ry=0;y<h;y+=step,ry++){
    let count=0;
    for(let x=0;x<w;x+=step){
      const i=(y*w+x)*4,r=img[i],g=img[i+1],b=img[i+2];
      const aqua=(g>150 && b>160 && r<235 && (g-r)>-5 && (b-r)>8);
      const blue=(b>120 && b>r*1.12 && g>90 && r<180);
      if(aqua||blue)count++;
    }
    scores[ry]=count;
  }
  const rows=scores.length;
  const win=Math.max(8,Math.round(rows*.28));
  let best=-1,bestStart=Math.round(rows*.12);
  for(let s=Math.round(rows*.08);s<=Math.round(rows*.72)-win;s++){
    let sum=0;for(let j=0;j<win;j++)sum+=scores[s+j];
    if(sum>best){best=sum;bestStart=s}
  }
  const cropH=Math.round(h*.45);
  let y=Math.round((bestStart+win/2)*step-cropH/2);
  if(best<20)y=Math.round(h*.16);
  y=Math.max(0,Math.min(h-cropH,y));
  return {x:0,y,w,h:cropH};
}
function fitDraw(src,rect,target){
  const box=target.getBoundingClientRect();
  const dpr=Math.max(1,window.devicePixelRatio||1);
  const cssW=Math.max(680,box.width||900),cssH=Math.max(330,box.height||430);
  target.width=Math.round(cssW*dpr);target.height=Math.round(cssH*dpr);
  const c=target.getContext('2d');
  c.setTransform(dpr,0,0,dpr,0,0);
  c.fillStyle='#fff';c.fillRect(0,0,cssW,cssH);
  const scale=Math.min(cssW/rect.w,cssH/rect.h);
  const dw=rect.w*scale,dh=rect.h*scale,dx=(cssW-dw)/2,dy=(cssH-dh)/2;
  c.drawImage(src,rect.x,rect.y,rect.w,rect.h,dx,dy,dw,dh);
}
async function renderPageCanvas(stage,pdfPage,scale=1.55){
  const pdf=await getPdf(stage);if(!pdf)return null;
  const safe=Math.max(1,Math.min(pdf.numPages,Number(pdfPage)||1));
  const page=await pdf.getPage(safe);
  const vp=page.getViewport({scale});
  const c=document.createElement('canvas');
  c.width=Math.round(vp.width);c.height=Math.round(vp.height);
  await page.render({canvasContext:c.getContext('2d'),viewport:vp}).promise;
  return c;
}
async function renderCrop(canvas){
  if(canvas.dataset.rendering==='1')return;
  canvas.dataset.rendering='1';
  const stage=Number(canvas.dataset.stage),pdfPage=Number(canvas.dataset.pdfPage);
  const rec=await getRecord(stage);
  if(!rec){
    paintMessage(canvas,`Load Stage ${stage} textbook`,'Use the Textbooks button once; the PDF stays on this device.');
    canvas.dataset.rendering='0';return;
  }
  try{
    paintMessage(canvas,'Rendering textbook example…',rec.name);
    const full=await renderPageCanvas(stage,pdfPage);
    if(!full)throw new Error('PDF unavailable');
    fitDraw(full,detectWorkedRegion(full),canvas);
    canvas.dataset.ready='1';
  }catch(e){
    paintMessage(canvas,'Could not render this page','Open Textbooks and reload the PDF.');
  }
  canvas.dataset.rendering='0';
}
async function openFull(stage,pdfPage,printedPage){
  const layer=document.createElement('div');layer.className='textbook-page-layer';
  layer.innerHTML=`<div class="textbook-page-panel"><div class="textbook-page-head"><div><b>Stage ${stage} textbook</b><span>Printed page ${printedPage}</span></div><button type="button" data-close>Close</button></div><div class="textbook-full-wrap"><canvas></canvas></div></div>`;
  document.body.appendChild(layer);
  const canvas=layer.querySelector('canvas');
  paintMessage(canvas,'Rendering full textbook page…');
  try{
    const full=await renderPageCanvas(stage,pdfPage,1.75);
    if(full){
      canvas.width=full.width;canvas.height=full.height;
      canvas.getContext('2d').drawImage(full,0,0);
    }
  }catch(e){paintMessage(canvas,'Unable to render page')}
  layer.querySelector('[data-close]').onclick=()=>layer.remove();
  layer.addEventListener('click',e=>{if(e.target===layer)layer.remove()});
}
async function refreshStatuses(root=document){
  const states={};
  for(const stage of [7,8])states[stage]=await getRecord(stage);
  root.querySelectorAll('[data-book-status]').forEach(el=>{
    const st=Number(el.dataset.bookStatus),rec=states[st];
    el.textContent=rec?`Loaded: ${rec.name}`:'Not loaded';
    el.classList.toggle('loaded',!!rec);
  });
}
async function openManager(){
  const old=document.querySelector('.textbook-manager-layer');if(old)old.remove();
  const layer=document.createElement('div');layer.className='textbook-manager-layer';
  layer.innerHTML=`
    <div class="textbook-manager">
      <div class="textbook-manager-head"><div><span class="eyebrow">Local source library</span><h2>Textbooks</h2><p>Select the two PDFs from the supplied pack. They are stored locally in this browser, not uploaded to the website.</p></div><button type="button" data-close>Close</button></div>
      <div class="book-manager-grid">
        ${[7,8].map(stage=>`<section class="book-manager-card"><div class="book-stage">Stage ${stage}</div><h3>Cambridge Checkpoint Mathematics</h3><p data-book-status="${stage}">Checking…</p><label class="book-file-btn">Choose Stage ${stage} PDF<input type="file" accept="application/pdf" data-book-file="${stage}"></label><button class="book-remove" data-book-remove="${stage}" type="button">Remove stored copy</button></section>`).join('')}
      </div>
      <p class="privacy-note">The lesson site only reads the book pages on your device so it can show the exact SOW-aligned textbook example. This avoids publishing the full textbooks on the public GitHub Pages site.</p>
    </div>`;
  document.body.appendChild(layer);
  await refreshStatuses(layer);
  layer.querySelector('[data-close]').onclick=()=>layer.remove();
  layer.addEventListener('click',e=>{if(e.target===layer)layer.remove()});
  layer.querySelectorAll('[data-book-file]').forEach(input=>input.addEventListener('change',async e=>{
    const file=e.target.files?.[0];if(!file)return;
    const stage=Number(input.dataset.bookFile);
    const label=input.closest('.book-manager-card')?.querySelector('[data-book-status]');
    if(label)label.textContent='Loading…';
    await putBook(stage,file);
    await refreshStatuses(layer);
    await hydrate(document);
  }));
  layer.querySelectorAll('[data-book-remove]').forEach(btn=>btn.onclick=async()=>{
    await removeBook(Number(btn.dataset.bookRemove));await refreshStatuses(layer);await hydrate(document);
  });
}
async function hydrate(root=document){
  root.querySelectorAll('[data-book-manager]').forEach(b=>{if(!b.dataset.bound){b.dataset.bound='1';b.addEventListener('click',openManager)}});
  root.querySelectorAll('.slide.active .book-crop-canvas, .book-crop-canvas.active-source').forEach(c=>renderCrop(c));
  root.querySelectorAll('[data-book-full]').forEach(b=>{if(!b.dataset.bound){b.dataset.bound='1';b.addEventListener('click',()=>openFull(Number(b.dataset.stage),Number(b.dataset.pdfPage),Number(b.dataset.printedPage))) }});
  await refreshStatuses(root);
}
window.NES_TEXTBOOKS={openManager,hydrate,putBook,getRecord,getPdf};
})();