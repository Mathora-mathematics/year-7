(() => {
  'use strict';
  const app = document.getElementById('app');
  let lessonsPrepared=false;
  function prepareLessons(){
    if(lessonsPrepared) return;
    const data=window.NES_LESSONS||[];
    window.NES_ENRICH?.apply(data);
    window.NES_V4?.apply(data);
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
  const state = { lesson:null, slide:0, showAnswers:false, overlay:null, board:null, unit:'All', query:'', workInk:{} };
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
    // Mixed numbers first so "3 1/2" stays visually grouped.
    s=s.replace(/(^|[^\w.])(-?\d+)\s+(\d+)\/(\d+)(?=\s|[A-Za-z]|[.,;:)\]]|$)/g,
      (m,p,w,a,b)=>`${p}<span class="mixed-number"><span class="whole">${w}</span><span class="math-frac"><span class="top">${a}</span><span class="bottom">${b}</span></span></span>`);
    // Common simple fractions, including 3/4x -> stacked 3/4 followed by x.
    s=s.replace(/(^|[^\w])(-?\d+|[A-Za-z])\/(\d+)(?=\s|[A-Za-z]|[.,;:)\]]|$)/g,
      (m,p,a,b)=>`${p}<span class="math-frac"><span class="top">${a}</span><span class="bottom">${b}</span></span>`);
    s=s.replace(/\b([A-Za-z])\/(\d+)\b/g,
      (m,a,b)=>`<span class="math-frac"><span class="top">${a}</span><span class="bottom">${b}</span></span>`);
    s=s.replace(/([A-Za-z0-9)\]])\^(−?-?\d+)/g,'$1<sup>$2</sup>');
    s=s.replace(/([A-Za-z0-9)\]])²/g,'$1<sup>2</sup>').replace(/([A-Za-z0-9)\]])³/g,'$1<sup>3</sup>');
    return s;
  }
  function unitShort(u=''){return u.replace(/^Unit \d+ - /,'').replace(/^Unit \d+ /,'').replace(/^U 12 /,'');}
  function sourceChip(label){return `<span class="question-source">${esc(label)}</span>`;}
  function logo(){return `<img class="slide-logo" src="assets/images/nes-logo.svg" alt="New English School logo"/>`;}
  function slideMeta(L,section){return `<div class="slide-meta"><div class="meta-left"><span>Year 7 Mathematics</span><span>${esc(L.code)}</span><span>${esc(section)}</span></div><span>New English School</span></div>`;}
  function footerKicker(L,section){return `<div class="slide-kicker">${esc(section)} · Lesson ${L.lesson}</div>`;}
  function diagram(L,variant=0){return L.diagram && window.NES_DIAGRAMS ? window.NES_DIAGRAMS.render(L.diagram,variant) : ''}

  function textbookRef(L,stage){
    const m=window.NES_TEXTBOOK_MAP?.[String(L.lesson)]?.['stage'+stage];
    return m||null;
  }
  function bookSourceSlide(L,stage){
    const ref=textbookRef(L,stage); if(!ref)return '';
    const label=stage===7?L.stage7:L.stage8;
    const role=stage===7?'Foundation source':'Stretch source';
    return `<section class="slide textbook-source-slide">${logo()}${footerKicker(L,`Stage ${stage} textbook`)}
      <h2>From the Stage ${stage} book</h2>
      <p class="slide-sub">Actual source page aligned to ${esc(L.code)}. The site renders the textbook locally and automatically crops the worked-example region.</p>
      <div class="textbook-layout">
        <div class="textbook-crop-shell"><canvas class="book-crop-canvas" data-stage="${stage}" data-pdf-page="${ref.pdfPage}" data-printed-page="${ref.printedPage}"></canvas></div>
        <aside class="textbook-side">
          <span class="source-pill">Cambridge Checkpoint · Stage ${stage}</span>
          <h3>${role}</h3>
          <p class="textbook-ref">${esc(label)}</p>
          <div class="source-card compact"><span class="source-label">Scheme alignment</span><p>${esc(L.objective)}</p></div>
          <div class="book-status-row"><span data-book-status="${stage}">Checking textbook…</span></div>
          <div class="book-actions"><button type="button" class="text-btn accent" data-book-manager>Load / replace PDF</button><button type="button" class="text-btn" data-book-full data-stage="${stage}" data-pdf-page="${ref.pdfPage}" data-printed-page="${ref.printedPage}">Open full page</button></div>
          <p class="book-page-note">Printed page ${ref.printedPage} · source stays on this device.</p>
        </aside>
      </div>${slideMeta(L,`Stage ${stage} source`)}</section>`;
  }

  function solutionSteps(L,ex,sol){
    const t=(L.title+' '+L.objective).toLowerCase();
    const method=sol?.method||'';
    let steps=[];
    if(/round|significant/.test(t))steps=['Identify the place value you are rounding to.','Look at the digit immediately to the right.','Use 0–4: keep; 5–9: round up.','Write the rounded value and check its size is sensible.'];
    else if(/negative|integer/.test(t))steps=['Represent the signs carefully before calculating.','Use the number line / sign rule to decide direction or sign.','Complete the arithmetic.','Check the result against an estimate or inverse operation.'];
    else if(/like terms/.test(t))steps=['Identify terms with exactly the same variable part.','Group only those like terms.','Add or subtract their coefficients.','Leave unlike terms separate and write the expression in standard form.'];
    else if(/bracket|distributive/.test(t))steps=['Multiply the term outside the bracket by every term inside.','Keep each sign attached to its term.','Write the expanded expression.','Collect like terms if any remain.'];
    else if(/substitution|formula/.test(t))steps=['Write the formula or expression first.','Replace each variable with its given value using brackets for negatives.','Follow the order of operations.','State the final value with units if the context has units.'];
    else if(/equation/.test(t))steps=['Form or copy the equation clearly.','Undo operations in reverse order, doing the same to both sides.','Continue until the unknown is isolated.','Substitute the answer back into the original equation to check.'];
    else if(/fraction/.test(t)&&/add|subtract/.test(t))steps=['Find a common denominator.','Rewrite each fraction as an equivalent fraction.','Add or subtract the numerators only.','Simplify the result; convert an improper fraction if appropriate.'];
    else if(/fraction/.test(t)&&/multiply|divide/.test(t))steps=['For multiplication, multiply numerators and denominators; cancel common factors when useful.','For division, multiply by the reciprocal of the second fraction.','Simplify common factors.','Give the final fraction in simplest form.'];
    else if(/fraction/.test(t))steps=['Identify the whole, numerator and denominator.','Use equivalent fractions or divide by the denominator as required.','Multiply by the numerator / compare common parts.','Simplify and check the fraction is reasonable.'];
    else if(/decimal/.test(t))steps=['Use place value carefully and align decimal points where needed.','Carry out the operation using a reliable written method.','Restore/check the decimal place using place value or estimation.','Check using an inverse operation or estimate.'];
    else if(/percent/.test(t))steps=['Write the percentage as a useful fraction or decimal.','Find the required percentage or multiplier.','Apply it to the original amount.','Check the answer against 10%, 50% or 100% as a sense check.'];
    else if(/angle|parallel/.test(t))steps=['Mark the angle fact you are using on the diagram.','Write the relationship as an equation if an unknown is involved.','Solve the arithmetic/algebra accurately.','Check against 90°, 180° or 360° and the shape/parallel-line facts.'];
    else if(/area|perimeter|volume|surface/.test(t))steps=['Sketch or identify the required dimensions.','Write the correct formula before substituting.','Convert units first if they are mixed.','Calculate and attach the correct linear, square or cubic unit.'];
    else if(/ratio|proportion|unitary/.test(t))steps=['Identify the ratio or corresponding quantities.','Find one part / one unit where useful.','Scale to the required quantity.','Check that all parts preserve the same multiplicative relationship.'];
    else if(/sequence|nth/.test(t))steps=['Identify the change between consecutive terms.','For an nth-term rule, use the common difference as the coefficient of n.','Adjust the constant so the rule gives the first term.','Test the rule on at least two terms.'];
    else if(/average|data|frequency|chart/.test(t))steps=['Read the data representation carefully and identify what each value means.','Use the correct statistic or representation.','Show totals / frequencies before dividing or comparing.','Interpret the result in the context of the data.'];
    else if(/probability/.test(t))steps=['List or identify the possible outcomes.','Count favourable outcomes and total equally likely outcomes, or use the observed frequency.','Write the probability as a fraction/decimal/percentage as appropriate.','Check the answer lies between 0 and 1.'];
    else if(/coordinate|graph|line/.test(t))steps=['Read x before y and check the scale on both axes.','Create or use the coordinate/table values carefully.','Plot or calculate using the stated rule.','Check the point/line against the equation or geometric condition.'];
    else if(/inequal/.test(t))steps=['Solve using the same inverse-operation logic as an equation.','Keep the inequality symbol throughout.','If multiplying or dividing by a negative, reverse the inequality sign.','Check with a value from the solution region.'];
    else if(/construct|bisector|perpendicular/.test(t))steps=['Keep construction arcs visible.','Use equal compass radii where the construction requires equal distances.','Join the correct intersection points with a straightedge.','Verify the final equal lengths/angles or right angle.'];
    else steps=['Identify the mathematical structure and relevant rule.','Carry out the calculation one justified step at a time.','Simplify the result.','Check the answer using estimation, inverse operation or the context.'];
    if(method)steps.splice(1,0,method);
    return steps.slice(0,5);
  }

  function interactiveGrid(key){
    return `<div class="working-grid interactive-grid" data-grid-key="${esc(key)}"><canvas class="work-canvas" data-work-canvas="${esc(key)}"></canvas><div class="grid-tools"><button type="button" data-grid-pen>Pen</button><button type="button" data-grid-color="#111214" class="ink-dot black" aria-label="Black pen"></button><button type="button" data-grid-color="#00a7d4" class="ink-dot blue" aria-label="Blue pen"></button><button type="button" data-grid-color="#c64e48" class="ink-dot red" aria-label="Red pen"></button><button type="button" data-grid-undo>Undo</button><button type="button" data-grid-clear>Clear</button></div></div>`;
  }

  function buildSlides(L){
    const s=[];
    s.push({label:'Cover',html:`<section class="slide cover-slide">${logo()}${footerKicker(L,'Year 7 / Mathematics')}<h1>${esc(L.title)}</h1><p class="objective">${esc(L.objective)}</p><div class="cover-mark">${esc(L.lesson.toString().padStart(2,'0'))}</div>${slideMeta(L,'Lesson')}</section>`});

    const starterCards=L.starter.map((q,i)=>`<div class="question-card"><span class="qno">${i+1}</span><div class="question-text">${mathHTML(q)}</div><button class="reveal-btn" data-reveal aria-expanded="false">Show solution</button><div class="answer">${mathHTML(L.solutions.starter[i])}</div></div>`).join('');
    s.push({label:'Starter',html:`<section class="slide">${logo()}${footerKicker(L,'Retrieval starter')}<h2>Starter</h2><p class="slide-sub">Four prerequisite or previous-learning questions. Keep answers hidden until you are ready to check.</p><div class="question-grid four">${starterCards}</div>${slideMeta(L,'Starter')}</section>`});

    const learnItems=L.learning.slice(0,4).map((x,i)=>`<li data-n="${i+1}">${mathHTML(x)}</li>`).join('');
    s.push({label:'Learn · Core',html:`<section class="slide">${logo()}${footerKicker(L,'Learn')}<h2>Core ideas</h2><p class="slide-sub">The concepts students should have clear before the examples.</p><div class="two-col"><div class="panel"><h4>What you need to know</h4><ol class="list">${learnItems}</ol></div><div class="diagram-wrap">${diagram(L,0) || `<div class="panel dark"><h4>Focus</h4><p>${esc(L.objective)}</p></div>`}</div></div>${slideMeta(L,'Learning content I')}</section>`});

    const watch=L.watch.slice(0,4).map((x,i)=>`<div class="watch"><span class="watch-badge">${i+1}</span><p>${mathHTML(x)}</p></div>`).join('');
    s.push({label:'Learn · Notation',html:`<section class="slide">${logo()}${footerKicker(L,'Connect')}<h2>Notation, structure & pitfalls</h2><p class="slide-sub">Precision matters: read the structure, connect it to meaning, then calculate.</p><div class="two-col equal"><div class="panel soft"><h4>Watch for</h4><div class="watch-list">${watch}</div></div><div class="panel"><h4>Why this matters</h4><p class="context-note">${esc(L.context||L.objective)}</p><div class="mini-checks"><span>Explain the rule</span><span>Read the notation</span><span>Reason-check the result</span></div></div></div>${slideMeta(L,'Learning content II')}</section>`});

    s.push({label:'Progression',html:`<section class="slide progression-slide">${logo()}${footerKicker(L,'Lesson progression')}<h2>How the lesson develops</h2><p class="slide-sub">The examples deliberately change representation and demand — not just the numbers.</p><div class="progression-road"><div class="progression-step"><b>1</b><h3>Fluency</h3><p>Secure the rule and notation.</p></div><div class="progression-arrow">→</div><div class="progression-step"><b>2</b><h3>Represent</h3><p>See the same idea visually or structurally.</p></div><div class="progression-arrow">→</div><div class="progression-step"><b>3</b><h3>Apply</h3><p>Use the mathematics in a new context.</p></div><div class="progression-arrow">→</div><div class="progression-step"><b>4</b><h3>Reason</h3><p>Reverse, justify, compare or spot an error.</p></div></div>${slideMeta(L,'Progression')}</section>`});
    const visualSlides=window.NES_VISUALS?.slidesFor(L)||[];
    visualSlides.forEach((v,i)=>s.push({label:`Visual ${i+1}`,html:`<section class="slide visual-slide">${logo()}${footerKicker(L,'Visualise')}<h2>${esc(v.title)}</h2><p class="slide-sub">${esc(v.subtitle||'')}</p><div class="visual-stage">${v.html}</div>${slideMeta(L,`Visual model ${i+1}/${visualSlides.length}`)}</section>`}));

    L.examples.forEach((ex,i)=>{
      const sol=L.solutions.examples[i]||{};
      const visual=window.NES_VISUALS?.exampleVisual(L,i)||diagram(L,i+1); const purpose=['Fluency & structure','Representation / application','Reasoning & synthesis'][i]||'Worked example';
      const steps=solutionSteps(L,ex,sol);
      s.push({label:`Example ${i+1}`,html:`<section class="slide">${logo()}${footerKicker(L,`Worked example ${i+1}`)}<h2>Example ${i+1}</h2><p class="slide-sub">${esc(ex.level)} · ${purpose}</p><div class="example-layout"><div class="example-main"><div class="example-q">${mathHTML(ex.question)}</div>${interactiveGrid(`L${L.lesson}-E${i+1}`)}</div><div class="example-side"><span class="source-pill">${esc(ex.level)}</span>${visual?`<div class="diagram-wrap">${visual}</div>`:`<div class="panel"><h4>Teaching lens</h4><p>${mathHTML(L.learning[Math.min(i,L.learning.length-1)]||L.objective)}</p></div>`}<div class="panel soft example-focus"><h4>Why this example?</h4><p>${i===0?'Secure the core method and notation.':i===1?'Change the representation or place the idea in context.':'Reverse the thinking, justify a claim or connect more than one fact.'}</p></div><button class="reveal-btn example-reveal" data-reveal aria-expanded="false">Show detailed solution</button><div class="solution-box"><strong>Answer</strong><div class="solution-answer">${mathHTML(sol.answer||'')}</div><ol class="worked-steps">${steps.map((st,k)=>`<li><b>Step ${k+1}</b><span>${mathHTML(st)}</span></li>`).join('')}</ol></div></div></div>${slideMeta(L,'Worked example')}</section>`});
    });

    const practiceGroupSize=3;
    const phase=(idx,total)=>{
      const r=idx/total;
      if(r<.25)return ['Fluency','Secure the method'];
      if(r<.5)return ['Represent & connect','Change form, diagram or structure'];
      if(r<.75)return ['Apply','Use the idea in context or more than one step'];
      return ['Reason & challenge','Reverse, justify, compare or diagnose an error'];
    };
    for(let start=0,g=0;start<L.practice.length;start+=practiceGroupSize,g++){
      const end=Math.min(start+practiceGroupSize,L.practice.length);
      const ph=phase(start,L.practice.length);
      const cards=L.practice.slice(start,end).map((q,j)=>{const idx=start+j;return `<div class="question-card"><span class="qno">${idx+1}</span><div class="question-text">${mathHTML(q)}</div><button class="reveal-btn" data-reveal aria-expanded="false">Show solution</button><div class="answer">${mathHTML(L.solutions.practice[idx])}</div></div>`}).join('');
      s.push({label:`Practice ${g+1}`,html:`<section class="slide practice-slide">${logo()}${footerKicker(L,'Independent practice')}<div class="phase-badge">${ph[0]}</div><h2>${ph[0]}</h2><p class="slide-sub">${ph[1]} · Questions ${start+1}–${end} of ${L.practice.length}</p><div class="question-grid practice-three">${cards}</div>${slideMeta(L,`Practice ${g+1}/${Math.ceil(L.practice.length/practiceGroupSize)}`)}</section>`});
    }

    const homeworkGroupSize=3;
    for(let start=0,g=0;start<L.homework.length;start+=homeworkGroupSize,g++){
      const end=Math.min(start+homeworkGroupSize,L.homework.length);
      const cards=L.homework.slice(start,end).map((q,j)=>{const idx=start+j;return `<div class="question-card"><span class="qno">${idx+1}</span><div class="question-text">${mathHTML(q)}</div><button class="reveal-btn" data-reveal aria-expanded="false">Show solution</button><div class="answer">${mathHTML(L.solutions.homework[idx])}</div></div>`}).join('');
      s.push({label:`Homework ${g+1}`,html:`<section class="slide">${logo()}${footerKicker(L,'Homework')}<h2>Homework</h2><p class="slide-sub">Questions ${start+1}–${end} of ${L.homework.length} · matched to the lesson, with fluency, application and reasoning.</p><div class="question-grid four">${cards}</div>${slideMeta(L,`Homework ${g+1}/${Math.ceil(L.homework.length/homeworkGroupSize)}`)}</section>`});
    }

    const exRows=L.solutions.examples.map((e,i)=>`<div class="solution-row"><b>E${i+1}</b><span>${mathHTML(e.answer)}<br><small>${esc(e.method)}</small></span></div>`).join('');
    const stRows=L.solutions.starter.map((a,i)=>`<div class="solution-row"><b>S${i+1}</b><span>${mathHTML(a)}</span></div>`).join('');
    s.push({label:'Solutions · Start',html:`<section class="slide">${logo()}${footerKicker(L,'Solutions')}<h2>Starter & examples</h2><p class="slide-sub">Teacher-facing answer bank with concise methods.</p><div class="solutions-scroll">${stRows}${exRows}</div>${slideMeta(L,'Solutions I')}</section>`});
    const practiceAnswerSize=6;
    for(let start=0,g=0;start<L.solutions.practice.length;start+=practiceAnswerSize,g++){
      const end=Math.min(start+practiceAnswerSize,L.solutions.practice.length);
      const pRows=L.solutions.practice.slice(start,end).map((a,j)=>`<div class="solution-row"><b>${start+j+1}</b><span>${mathHTML(a)}</span></div>`).join('');
      s.push({label:`Solutions · Practice ${g+1}`,html:`<section class="slide">${logo()}${footerKicker(L,'Solutions')}<h2>Independent practice answers</h2><p class="slide-sub">Questions ${start+1}–${end} of ${L.solutions.practice.length}. Individual solutions can also be revealed beside each question during teaching.</p><div class="solutions-scroll">${pRows}</div>${slideMeta(L,`Solutions II · ${g+1}/${Math.ceil(L.solutions.practice.length/practiceAnswerSize)}`)}</section>`});
    }
    const homeworkAnswerSize=7;
    for(let start=0,g=0;start<L.solutions.homework.length;start+=homeworkAnswerSize,g++){
      const end=Math.min(start+homeworkAnswerSize,L.solutions.homework.length);
      const hRows=L.solutions.homework.slice(start,end).map((a,j)=>`<div class="solution-row"><b>${start+j+1}</b><span>${mathHTML(a)}</span></div>`).join('');
      s.push({label:`Solutions · Homework ${g+1}`,html:`<section class="slide">${logo()}${footerKicker(L,'Solutions')}<h2>Homework answers</h2><p class="slide-sub">Questions ${start+1}–${end} of ${L.solutions.homework.length}.</p><div class="solutions-scroll">${hRows}</div>${slideMeta(L,`Solutions III · ${g+1}/${Math.ceil(L.solutions.homework.length/homeworkAnswerSize)}`)}</section>`});
    }
    return s;
  }

  function renderHome(){
    state.lesson=null; state.slide=0; state.overlay=null; state.showAnswers=false;
    const all=lessons();
    const units=['All',...new Set(all.map(x=>x.unit))];
    const q=state.query.toLowerCase().trim();
    const filtered=all.filter(L=>(state.unit==='All'||L.unit===state.unit) && (!q || `${L.lesson} ${L.code} ${L.title} ${L.objective} ${L.unit}`.toLowerCase().includes(q)));
    app.innerHTML=`<div class="app-shell"><header class="topbar"><div class="brand"><img src="assets/images/nes-logo.svg" alt="NES logo"><div><div class="brand-title">NES Mathematics</div><span class="brand-sub">Year 7 · Interactive course</span></div></div><div class="topbar-spacer"></div><button class="text-btn" data-action="random">Random lesson</button></header><main class="home"><section class="hero"><div><div class="eyebrow">2026–27 Scheme of Work</div><h1>Year 7 Mathematics</h1><p>A complete interactive lesson library aligned to the school scheme of work. Lessons move through explicit teaching, multiple visual representations, varied worked examples, progressive practice, reasoning, homework and full solutions.</p></div><aside class="hero-aside"><div class="hero-metric"><strong>70</strong><span>scheme-aligned lessons</span></div><div class="hero-metric"><strong>4</strong><span>clear stages: fluency → represent → apply → reason</span></div><div class="hero-metric"><strong>38</strong><span>practice + homework questions per lesson</span></div></aside></section><div class="controls-row"><label class="search">${icons.search}<input id="searchInput" type="search" value="${esc(state.query)}" placeholder="Search a topic, code or skill…" autocomplete="off"></label><div class="chips">${units.map(u=>`<button class="chip ${state.unit===u?'active':''}" data-unit="${esc(u)}">${esc(u==='All'?'All units':unitShort(u))}</button>`).join('')}</div></div><div class="section-head"><h2>${state.unit==='All'?'Complete lesson library':unitShort(state.unit)}</h2><span>${filtered.length} lesson${filtered.length===1?'':'s'}</span></div>${filtered.length?`<div class="lesson-grid">${filtered.map(L=>`<article class="lesson-card" tabindex="0" role="button" data-lesson="${L.lesson}"><div class="lesson-top"><span class="lesson-no">Lesson ${String(L.lesson).padStart(2,'0')}</span><span class="lesson-code">${esc(L.code)}</span></div><h3>${esc(L.title)}</h3><p>${esc(L.objective)}</p><div class="card-foot">Open lesson ${icons.arrow}</div></article>`).join('')}</div>`:`<div class="empty-state">No lessons match that search.</div>`}</main></div>`;
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
    app.innerHTML=`<main class="player ${state.showAnswers?'show-answers':''}"><header class="player-bar"><button class="icon-btn" data-action="home" title="Back to library">${icons.home}</button><div class="player-title"><strong>${esc(L.title)}</strong><span>Lesson ${L.lesson} · ${esc(L.code)}</span></div><div class="spacer"></div><button class="text-btn" data-action="answers">${icons.eye}<span>${state.showAnswers?'Hide all':'Reveal all'}</span></button><button class="icon-btn" data-action="board" title="Whiteboard">${icons.pen}</button><button class="icon-btn" data-action="overview" title="Slide overview">${icons.grid}</button><button class="icon-btn" data-action="print" title="Print / save PDF">${icons.print}</button></header><div class="progress-wrap"><div class="progress-bar" style="width:${((state.slide+1)/slides.length)*100}%"></div></div><div class="slide-stage"><div class="slide-frame">${slides.map((x,i)=>x.html.replace('class="slide','class="slide '+(i===state.slide?'active':i<state.slide?'prev':'next'))).join('')}</div></div><footer class="player-footer"><div class="count">${state.slide+1} / ${slides.length}</div><div class="hint">← → navigate · A answers · B board · O overview</div><div class="spacer"></div><button class="nav-btn" data-action="prev" aria-label="Previous slide">${icons.left}</button><button class="nav-btn" data-action="next" aria-label="Next slide">${icons.right}</button></footer></main>`;
    bindPlayer(slides);
    bindWorkCanvases();
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
    document.querySelectorAll('[data-reveal]').forEach(btn=>btn.addEventListener('click',e=>{
      e.stopPropagation();
      const box=btn.closest('.question-card,.example-side');
      if(!box)return;
      const on=box.classList.toggle('revealed');
      btn.textContent=on?'Hide solution':'Show solution';
      btn.setAttribute('aria-expanded',String(on));
      typeset();
    }));
    document.querySelector('[data-action="overview"]')?.addEventListener('click',()=>showOverview(slides));
    document.querySelector('[data-action="board"]')?.addEventListener('click',openBoard);
    document.querySelector('[data-action="print"]')?.addEventListener('click',()=>window.print());
    let sx=null;
    const frame=document.querySelector('.slide-frame');
    frame?.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')sx=e.clientX});
    frame?.addEventListener('pointerup',e=>{if(sx==null)return; const dx=e.clientX-sx; sx=null; if(Math.abs(dx)>50)setSlide(state.slide+(dx<0?1:-1))});
  }

  function bindWorkCanvases(){
    document.querySelectorAll('[data-work-canvas]').forEach(canvas=>{
      const key=canvas.dataset.workCanvas;if(canvas.dataset.bound)return;canvas.dataset.bound='1';
      const wrap=canvas.closest('.interactive-grid'); if(!wrap)return;
      const model=state.workInk[key]||(state.workInk[key]={active:false,color:'#111214',strokes:[]});
      const ctx=canvas.getContext('2d');
      function resize(){
        const r=canvas.getBoundingClientRect(),dpr=Math.max(1,window.devicePixelRatio||1);
        canvas.width=Math.max(1,Math.round(r.width*dpr));canvas.height=Math.max(1,Math.round(r.height*dpr));
        ctx.setTransform(dpr,0,0,dpr,0,0);ctx.lineCap='round';ctx.lineJoin='round';redraw();
      }
      function redraw(){
        const r=canvas.getBoundingClientRect();ctx.clearRect(0,0,r.width,r.height);
        for(const st of model.strokes){
          if(!st.pts?.length)continue;ctx.strokeStyle=st.color;ctx.lineWidth=3;ctx.beginPath();
          st.pts.forEach((p,i)=>{const x=p[0]*r.width,y=p[1]*r.height;i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.stroke();
        }
      }
      let current=null;
      const point=e=>{const r=canvas.getBoundingClientRect();return[(e.clientX-r.left)/r.width,(e.clientY-r.top)/r.height]};
      canvas.addEventListener('pointerdown',e=>{
        if(!(model.active||e.pointerType==='pen'))return;
        e.preventDefault();e.stopPropagation();canvas.setPointerCapture(e.pointerId);
        current={color:model.color,pts:[point(e)]};model.strokes.push(current);
      });
      canvas.addEventListener('pointermove',e=>{
        if(!current)return;e.preventDefault();e.stopPropagation();current.pts.push(point(e));redraw();
      });
      const stop=e=>{if(current){e?.preventDefault?.();e?.stopPropagation?.();current=null}};
      canvas.addEventListener('pointerup',stop);canvas.addEventListener('pointercancel',stop);
      wrap.querySelector('[data-grid-pen]')?.addEventListener('click',e=>{
        e.stopPropagation();model.active=!model.active;wrap.classList.toggle('pen-active',model.active);
        e.currentTarget.textContent=model.active?'Pen on':'Pen';canvas.style.touchAction=model.active?'none':'auto';
      });
      wrap.querySelectorAll('[data-grid-color]').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();model.color=b.dataset.gridColor;wrap.querySelectorAll('[data-grid-color]').forEach(x=>x.classList.toggle('selected',x===b));}));
      wrap.querySelector('[data-grid-undo]')?.addEventListener('click',e=>{e.stopPropagation();model.strokes.pop();redraw()});
      wrap.querySelector('[data-grid-clear]')?.addEventListener('click',e=>{e.stopPropagation();model.strokes=[];redraw()});
      new ResizeObserver(resize).observe(canvas);resize();
    });
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
    const modal=document.querySelector('.board-layer,.overlay');
    if(modal){if(e.key==='Escape')modal.remove();return}
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
