(() => {
  'use strict';
  const app = document.getElementById('app');
  let lessonsPrepared=false;
  function prepareLessons(){
    if(lessonsPrepared) return;
    const data=window.NES_LESSONS||[];
    data.forEach(L=>{
      L.watch=(L.watch||[]).map(x=>String(x||'')
        .replace(/[\u0000-\u001f]+/g,' ')
        .replace(/\s*BOOK-TO-BOOK PROGRESSION.*$/i,'')
        .replace(/\s*∑\s*x²\s*=\s*\?\s*/g,' ')
        .replace(/\s+same-sized parts\s*$/i,'')
        .replace(/\s+/g,' ').trim());
    });
    const L=data.find(x=>x.lesson===1);
    if(L){
      L.practice[14]='Work out (31,762 - 734×44) ÷ 44.';
      L.solutions.practice[14]='-12';
      L.practice[17]='Work out (69,169 - 679×34) ÷ 34. Give the quotient and remainder.';
      L.solutions.practice[17]='1355 remainder 13';
      L.homework[10]='Work out (44,625 - 890×25) ÷ 25.';
      L.solutions.homework[10]='895';
      L.solutions.examples[0].method='Align place values, add from right to left, and regroup when a column totals 10 or more. Estimate first to check the size of the answer.';
      L.solutions.examples[1].method='Multiply to find the total delivered, then subtract the items used. Check that the final answer is smaller than the delivery total.';
      L.solutions.examples[2].method='Use dividend = divisor × quotient + remainder. The remainder must be smaller than the divisor.';
    }
    lessonsPrepared=true;
  }
  const lessons = () => { prepareLessons(); return window.NES_LESSONS || []; };
  const state = { lesson:null, slide:0, showAnswers:false, overlay:null, board:null, unit:'All', query:'' };
  const icons={
    search:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>`,
    arrow:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`,
    left:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m15 18-6-6 6-6"/></svg>`,
    right:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m9 18 6-6-6-6"/></svg>`,
    grid:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>`,
    eye:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M2 12s3.7-6 10-6 10 6 10 6-3.7 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="2.7"/></svg>`,
    pen:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="m4 20 4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10L4 20Z"/><path d="m13.8 7.2 3 3"/></svg>`,
    home:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10"/></svg>`,
    print:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v7H6z"/></svg>`,
    close:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m6 6 12 12M18 6 6 18"/></svg>`
  };

  function esc(s=''){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[m]));}
  function mathHTML(text=''){
    let s=esc(text);
    // common simple fractions, including 3/4x -> stacked 3/4 followed by x
    s=s.replace(/(^|[^\w])(-?\d+|[A-Za-z])\/(\d+)(?=\s|[A-Za-z]|[.,;:)\]]|$)/g,(m,p,a,b)=>`${p}<span class="math-frac"><span class="top">${a}</span><span class="bottom">${b}</span></span>`);
    s=s.replace(/\b([A-Za-z])\/(\d+)\b/g,(m,a,b)=>`<span class="math-frac"><span class="top">${a}</span><span class="bottom">${b}</span></span>`);
    s=s.replace(/([A-Za-z0-9)]+)\^(−?-?\d+)/g,'$1<sup>$2</sup>');
    return s;
  }
  function unitShort(u=''){return u.replace(/^Unit \d+ - /,'').replace(/^Unit \d+ /,'').replace(/^U 12 /,'');}
  function sourceChip(label){return `<span class="question-source">${esc(label)}</span>`;}
  function logo(){return `<img class="slide-logo" src="assets/images/nes-logo.svg" alt="New English School logo"/>`;}
  function slideMeta(L,section){return `<div class="slide-meta"><div class="meta-left"><span>Year 7 Mathematics</span><span>${esc(L.code)}</span><span>${esc(section)}</span></div><span>New English School</span></div>`;}
  function footerKicker(L,section){return `<div class="slide-kicker">${esc(section)} · Lesson ${L.lesson}</div>`;}
  function diagram(L,variant=0){return L.diagram && window.NES_DIAGRAMS ? window.NES_DIAGRAMS.render(L.diagram,variant) : ''}

  function buildSlides(L){
    const s=[];
    s.push({label:'Cover',html:`<section class="slide cover-slide">${logo()}${footerKicker(L,'Year 7 / Mathematics')}<h1>${esc(L.title)}</h1><p class="objective">${esc(L.objective)}</p><div class="cover-mark">${esc(L.lesson.toString().padStart(2,'0'))}</div>${slideMeta(L,'Lesson')}</section>`});

    const starterCards=L.starter.map((q,i)=>`<div class="question-card"><span class="qno">${i+1}</span><div class="question-text">${mathHTML(q)}</div><div class="answer">${mathHTML(L.solutions.starter[i])}</div></div>`).join('');
    s.push({label:'Starter',html:`<section class="slide">${logo()}${footerKicker(L,'Retrieval starter')}<h2>Starter</h2><p class="slide-sub">Four prerequisite or previous-learning questions. Keep answers hidden until you are ready to check.</p><div class="question-grid four">${starterCards}</div>${slideMeta(L,'Starter')}</section>`});

    const learnItems=L.learning.slice(0,4).map((x,i)=>`<li data-n="${i+1}">${mathHTML(x)}</li>`).join('');
    s.push({label:'Learn · Core',html:`<section class="slide">${logo()}${footerKicker(L,'Learn')}<h2>Core ideas</h2><p class="slide-sub">The concepts students should have clear before the examples.</p><div class="two-col"><div class="panel"><h4>What you need to know</h4><ol class="list">${learnItems}</ol></div><div class="diagram-wrap">${diagram(L,0) || `<div class="panel dark"><h4>Focus</h4><p>${esc(L.objective)}</p></div>`}</div></div>${slideMeta(L,'Learning content I')}</section>`});

    const watch=L.watch.slice(0,4).map((x,i)=>`<div class="watch"><span class="watch-badge">${i+1}</span><p>${mathHTML(x)}</p></div>`).join('');
    s.push({label:'Learn · Notation',html:`<section class="slide">${logo()}${footerKicker(L,'Connect')}<h2>Notation, structure & pitfalls</h2><p class="slide-sub">Precision matters: read the structure before calculating.</p><div class="two-col equal"><div class="panel soft"><h4>Watch for</h4><div class="watch-list">${watch}</div></div><div class="panel"><h4>Check before moving on</h4><div class="watch-list"><div class="watch"><span class="watch-badge">A</span><p>Can you explain the rule in a complete sentence?</p></div><div class="watch"><span class="watch-badge">B</span><p>Can you identify the notation that changes the meaning?</p></div><div class="watch"><span class="watch-badge">C</span><p>Can you estimate or reason-check the result?</p></div></div></div></div>${slideMeta(L,'Learning content II')}</section>`});

    s.push({label:'Book blend',html:`<section class="slide">${logo()}${footerKicker(L,'Textbook blend')}<h2>Stage 7 → Stage 8</h2><p class="slide-sub">The lesson uses the Stage 7 book for secure foundations, then deliberately draws on Stage 8 for stretch, richer notation and less-routine reasoning.</p><div class="two-col equal"><div><div class="source-card"><span class="source-label">Cambridge Checkpoint · Stage 7</span><h3>Foundation</h3><p>${esc(L.stage7)}</p></div><div class="source-card"><span class="source-label">Scheme of work</span><h3>Alignment</h3><p>${esc(L.sow_refs || 'School scheme of work alignment')}</p></div></div><div><div class="source-card"><span class="source-label">Cambridge Checkpoint · Stage 8</span><h3>Stretch</h3><p>${esc(L.stage8)}</p></div><div class="source-card"><span class="source-label">Practice design</span><h3>Diversity</h3><p>Questions 1–7 emphasise Stage 7 fluency; 8–14 use Stage 8-style extension; 15–20 move into reasoning, reverse problems and unfamiliar applications.</p></div></div></div>${slideMeta(L,'Sources & progression')}</section>`});

    L.examples.forEach((ex,i)=>{
      const sol=L.solutions.examples[i]||{};
      const visual=diagram(L,i+1); const purpose=['Fluency & structure','Application & stretch','Reasoning & synthesis'][i]||'Worked example';
      s.push({label:`Example ${i+1}`,html:`<section class="slide">${logo()}${footerKicker(L,`Worked example ${i+1}`)}<h2>Example ${i+1}</h2><p class="slide-sub">${esc(ex.level)} · ${purpose}</p><div class="example-layout"><div class="example-main"><div class="example-q">${mathHTML(ex.question)}</div><div class="working-grid"></div></div><div class="example-side"><span class="source-pill">${esc(ex.level)}</span>${visual?`<div class="diagram-wrap">${visual}</div>`:`<div class="panel"><h4>Teaching lens</h4><p>${mathHTML(L.learning[Math.min(i,L.learning.length-1)]||L.objective)}</p></div>`}<div class="panel soft"><h4>Textbook source</h4><p>${esc(ex.source)}</p></div><div class="solution-box"><strong>Answer</strong><div class="solution-answer">${mathHTML(sol.answer||'')}</div><div class="solution-method">${esc(sol.method||'')}</div></div></div></div>${slideMeta(L,'Worked example')}</section>`});
    });

    for(let g=0;g<4;g++){
      const start=g*5;
      const cards=L.practice.slice(start,start+5).map((q,j)=>{const idx=start+j;return `<div class="question-card"><span class="qno">${idx+1}</span><div class="question-text">${mathHTML(q)}</div>${sourceChip(L.practiceSources[idx])}<div class="answer">${mathHTML(L.solutions.practice[idx])}</div></div>`}).join('');
      const subtitle=g===0?'Core fluency':g===1?'Mixed fluency and structure':g===2?'Stage 8 stretch':'Reasoning and challenge';
      s.push({label:`Practice ${g+1}`,html:`<section class="slide">${logo()}${footerKicker(L,'Independent practice')}<h2>${subtitle}</h2><p class="slide-sub">Questions ${start+1}–${start+5} of 20 · progressive and source-blended.</p><div class="question-grid">${cards}</div>${slideMeta(L,`Practice ${g+1}/4`)}</section>`});
    }

    for(let g=0;g<3;g++){
      const start=g*4;
      const cards=L.homework.slice(start,start+4).map((q,j)=>{const idx=start+j;return `<div class="question-card"><span class="qno">${idx+1}</span><div class="question-text">${mathHTML(q)}</div><div class="answer">${mathHTML(L.solutions.homework[idx])}</div></div>`}).join('');
      s.push({label:`Homework ${g+1}`,html:`<section class="slide">${logo()}${footerKicker(L,'Homework')}<h2>Homework</h2><p class="slide-sub">Questions ${start+1}–${start+4} of 12 · matched to the lesson but not simply copied from class practice.</p><div class="question-grid four">${cards}</div>${slideMeta(L,`Homework ${g+1}/3`)}</section>`});
    }

    const exRows=L.solutions.examples.map((e,i)=>`<div class="solution-row"><b>E${i+1}</b><span>${mathHTML(e.answer)}<br><small>${esc(e.method)}</small></span></div>`).join('');
    const stRows=L.solutions.starter.map((a,i)=>`<div class="solution-row"><b>S${i+1}</b><span>${mathHTML(a)}</span></div>`).join('');
    s.push({label:'Solutions · Start',html:`<section class="slide">${logo()}${footerKicker(L,'Solutions')}<h2>Starter & examples</h2><p class="slide-sub">Teacher-facing answer bank with concise methods.</p><div class="solutions-scroll">${stRows}${exRows}</div>${slideMeta(L,'Solutions I')}</section>`});
    const pRows=L.solutions.practice.map((a,i)=>`<div class="solution-row"><b>${i+1}</b><span>${mathHTML(a)}</span></div>`).join('');
    s.push({label:'Solutions · Practice',html:`<section class="slide">${logo()}${footerKicker(L,'Solutions')}<h2>Independent practice answers</h2><p class="slide-sub">All 20 answers. Use the in-slide reveal button during teaching if you prefer to check one slide at a time.</p><div class="solutions-scroll">${pRows}</div>${slideMeta(L,'Solutions II')}</section>`});
    const hRows=L.solutions.homework.map((a,i)=>`<div class="solution-row"><b>${i+1}</b><span>${mathHTML(a)}</span></div>`).join('');
    s.push({label:'Solutions · Homework',html:`<section class="slide">${logo()}${footerKicker(L,'Solutions')}<h2>Homework answers</h2><p class="slide-sub">Complete answer bank for the 12 homework questions.</p><div class="solutions-scroll">${hRows}</div>${slideMeta(L,'Solutions III')}</section>`});
    return s;
  }

  function renderHome(){
    state.lesson=null; state.slide=0; state.overlay=null; state.showAnswers=false;
    const all=lessons();
    const units=['All',...new Set(all.map(x=>x.unit))];
    const q=state.query.toLowerCase().trim();
    const filtered=all.filter(L=>(state.unit==='All'||L.unit===state.unit) && (!q || `${L.lesson} ${L.code} ${L.title} ${L.objective} ${L.unit}`.toLowerCase().includes(q)));
    app.innerHTML=`<div class="app-shell"><header class="topbar"><div class="brand"><img src="assets/images/nes-logo.svg" alt="NES logo"><div><div class="brand-title">NES Mathematics</div><span class="brand-sub">Year 7 · Interactive course</span></div></div><div class="topbar-spacer"></div><button class="text-btn" data-action="random">Random lesson</button></header><main class="home"><section class="hero"><div><div class="eyebrow">2026–27 Scheme of Work</div><h1>Year 7 Mathematics</h1><p>A complete interactive lesson library aligned to the school scheme of work and deliberately blended from Cambridge Checkpoint Stage 7 and Stage 8. Lessons move from explicit teaching to visual models, varied worked examples, progressive practice, homework and full solutions.</p></div><aside class="hero-aside"><div class="hero-metric"><strong>70</strong><span>scheme-aligned lessons</span></div><div class="hero-metric"><strong>2</strong><span>Cambridge books deliberately blended</span></div><div class="hero-metric"><strong>32+</strong><span>practice and homework questions per lesson</span></div></aside></section><div class="controls-row"><label class="search">${icons.search}<input id="searchInput" type="search" value="${esc(state.query)}" placeholder="Search a topic, code or skill…" autocomplete="off"></label><div class="chips">${units.map(u=>`<button class="chip ${state.unit===u?'active':''}" data-unit="${esc(u)}">${esc(u==='All'?'All units':unitShort(u))}</button>`).join('')}</div></div><div class="section-head"><h2>${state.unit==='All'?'Complete lesson library':unitShort(state.unit)}</h2><span>${filtered.length} lesson${filtered.length===1?'':'s'}</span></div>${filtered.length?`<div class="lesson-grid">${filtered.map(L=>`<article class="lesson-card" tabindex="0" role="button" data-lesson="${L.lesson}"><div class="lesson-top"><span class="lesson-no">Lesson ${String(L.lesson).padStart(2,'0')}</span><span class="lesson-code">${esc(L.code)}</span></div><h3>${esc(L.title)}</h3><p>${esc(L.objective)}</p><div class="card-foot">Open lesson ${icons.arrow}</div></article>`).join('')}</div>`:`<div class="empty-state">No lessons match that search.</div>`}</main></div>`;
    bindHome();
  }

  function bindHome(){
    document.querySelectorAll('[data-lesson]').forEach(el=>{
      const open=()=>openLesson(+el.dataset.lesson,0);
      el.addEventListener('click',open); el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' ')open()});
    });
    document.querySelectorAll('[data-unit]').forEach(b=>b.addEventListener('click',()=>{state.unit=b.dataset.unit;renderHome()}));
    const input=document.getElementById('searchInput'); if(input) input.addEventListener('input',e=>{state.query=e.target.value;renderHome();requestAnimationFrame(()=>{const n=document.getElementById('searchInput'); if(n){n.focus();n.setSelectionRange(n.value.length,n.value.length)}})});
    document.querySelector('[data-action="random"]')?.addEventListener('click',()=>{const a=lessons();openLesson(a[Math.floor(Math.random()*a.length)].lesson,0)});
  }

  function openLesson(id, slide=0, push=true){
    const L=lessons().find(x=>x.lesson===id); if(!L){renderHome();return}
    state.lesson=L; state.slide=Math.max(0,slide); state.overlay=null; state.showAnswers=false;
    if(push) history.pushState({},'',`#/lesson/${id}/${state.slide}`);
    renderPlayer();
  }

  function renderPlayer(){
    const L=state.lesson; if(!L){renderHome();return}
    const slides=buildSlides(L); state.slide=Math.min(state.slide,slides.length-1);
    app.innerHTML=`<main class="player ${state.showAnswers?'show-answers':''}"><header class="player-bar"><button class="icon-btn" data-action="home" title="Back to library">${icons.home}</button><div class="player-title"><strong>${esc(L.title)}</strong><span>Lesson ${L.lesson} · ${esc(L.code)}</span></div><div class="spacer"></div><button class="text-btn" data-action="answers">${icons.eye}<span>${state.showAnswers?'Hide answers':'Reveal answers'}</span></button><button class="icon-btn" data-action="board" title="Whiteboard">${icons.pen}</button><button class="icon-btn" data-action="overview" title="Slide overview">${icons.grid}</button><button class="icon-btn" data-action="print" title="Print / save PDF">${icons.print}</button></header><div class="progress-wrap"><div class="progress-bar" style="width:${((state.slide+1)/slides.length)*100}%"></div></div><div class="slide-stage"><div class="slide-frame">${slides.map((x,i)=>x.html.replace('class="slide','class="slide '+(i===state.slide?'active':i<state.slide?'prev':'next'))).join('')}</div></div><footer class="player-footer"><div class="count">${state.slide+1} / ${slides.length}</div><div class="hint">← → navigate · A answers · B board · O overview</div><div class="spacer"></div><button class="nav-btn" data-action="prev" aria-label="Previous slide">${icons.left}</button><button class="nav-btn" data-action="next" aria-label="Next slide">${icons.right}</button></footer></main>`;
    bindPlayer(slides);
    typeset();
  }

  function setSlide(n){
    const slides=buildSlides(state.lesson); const next=Math.max(0,Math.min(n,slides.length-1)); if(next===state.slide)return; state.slide=next; history.replaceState({},'',`#/lesson/${state.lesson.lesson}/${state.slide}`); renderPlayer();
  }
  function bindPlayer(slides){
    document.querySelector('[data-action="home"]')?.addEventListener('click',()=>{history.pushState({},'','#/');renderHome()});
    document.querySelector('[data-action="prev"]')?.addEventListener('click',()=>setSlide(state.slide-1));
    document.querySelector('[data-action="next"]')?.addEventListener('click',()=>setSlide(state.slide+1));
    document.querySelector('[data-action="answers"]')?.addEventListener('click',()=>{state.showAnswers=!state.showAnswers;renderPlayer()});
    document.querySelector('[data-action="overview"]')?.addEventListener('click',()=>showOverview(slides));
    document.querySelector('[data-action="board"]')?.addEventListener('click',openBoard);
    document.querySelector('[data-action="print"]')?.addEventListener('click',()=>window.print());
    let sx=null;
    const frame=document.querySelector('.slide-frame');
    frame?.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')sx=e.clientX});
    frame?.addEventListener('pointerup',e=>{if(sx==null)return; const dx=e.clientX-sx; sx=null; if(Math.abs(dx)>50)setSlide(state.slide+(dx<0?1:-1))});
  }

  function showOverview(slides){
    const ov=document.createElement('div');ov.className='overlay';ov.innerHTML=`<div class="overlay-panel"><div class="overlay-head"><h2>Lesson overview</h2><div class="spacer"></div><button class="icon-btn" data-close>${icons.close}</button></div><div class="overview-grid">${slides.map((x,i)=>`<button class="thumb ${i===state.slide?'active':''}" data-jump="${i}"><b>${String(i+1).padStart(2,'0')}</b><span>${esc(x.label)}</span></button>`).join('')}</div></div>`;document.body.appendChild(ov);
    ov.querySelector('[data-close]').onclick=()=>ov.remove();ov.addEventListener('click',e=>{if(e.target===ov)ov.remove()});ov.querySelectorAll('[data-jump]').forEach(b=>b.onclick=()=>{const i=+b.dataset.jump;ov.remove();setSlide(i)});
  }

  function openBoard(){
    if(document.querySelector('.board-layer'))return;
    const layer=document.createElement('div');layer.className='board-layer';layer.innerHTML=`<canvas class="board-canvas"></canvas><div class="board-tools"><button class="swatch" data-color="#111214" title="Black"></button><button class="swatch" data-color="#00a7d4" title="Blue"></button><button class="swatch" data-color="#c64e48" title="Red"></button><button data-clear>Clear</button><button data-close>Close</button></div>`;document.body.appendChild(layer);
    const c=layer.querySelector('canvas'),ctx=c.getContext('2d');let drawing=false,color='#111214',last=null;
    const resize=()=>{const dpr=window.devicePixelRatio||1;const rect=c.getBoundingClientRect();const old=document.createElement('canvas');old.width=c.width;old.height=c.height;old.getContext('2d').drawImage(c,0,0);c.width=rect.width*dpr;c.height=rect.height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.lineCap='round';ctx.lineJoin='round';ctx.lineWidth=3;ctx.drawImage(old,0,0,old.width/dpr,old.height/dpr)};resize();
    const pos=e=>{const r=c.getBoundingClientRect();return [e.clientX-r.left,e.clientY-r.top]};
    c.addEventListener('pointerdown',e=>{drawing=true;last=pos(e);c.setPointerCapture(e.pointerId)});c.addEventListener('pointermove',e=>{if(!drawing)return;const p=pos(e);ctx.strokeStyle=color;ctx.beginPath();ctx.moveTo(...last);ctx.lineTo(...p);ctx.stroke();last=p});c.addEventListener('pointerup',()=>{drawing=false;last=null});
    layer.querySelectorAll('[data-color]').forEach(b=>b.onclick=()=>color=b.dataset.color);layer.querySelector('[data-clear]').onclick=()=>ctx.clearRect(0,0,c.width,c.height);layer.querySelector('[data-close]').onclick=()=>layer.remove();
  }

  function typeset(){ if(window.MathJax?.typesetPromise){window.MathJax.typesetPromise().catch(()=>{})} }
  function route(){
    const h=location.hash||'#/'; const m=h.match(/^#\/lesson\/(\d+)(?:\/(\d+))?/); if(m){openLesson(+m[1],+(m[2]||0),false)} else renderHome();
  }
  window.addEventListener('popstate',route); window.addEventListener('hashchange',route);
  window.addEventListener('keydown',e=>{
    if(!state.lesson)return;
    if(document.querySelector('.board-layer')||document.querySelector('.overlay')){if(e.key==='Escape'){document.querySelector('.board-layer')?.remove();document.querySelector('.overlay')?.remove()}return}
    if(['ArrowRight','PageDown',' '].includes(e.key)){e.preventDefault();setSlide(state.slide+1)}
    if(['ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();setSlide(state.slide-1)}
    if(e.key.toLowerCase()==='a'){state.showAnswers=!state.showAnswers;renderPlayer()}
    if(e.key.toLowerCase()==='b')openBoard();
    if(e.key.toLowerCase()==='o')showOverview(buildSlides(state.lesson));
    if(e.key==='Home')setSlide(0);if(e.key==='End')setSlide(buildSlides(state.lesson).length-1);
    if(e.key==='Escape'){history.pushState({},'','#/');renderHome()}
  });
  if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}))}
  route();
})();
