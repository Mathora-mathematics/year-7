(() => {
'use strict';

const ink='#111214', muted='#6b7075', blue='#00a7d4', blue2='#dff6fc', warm='#d7c9ae', warm2='#f3ecdf', grid='#e7e3da', paper='#fffefa';
const svg=(body,view='0 0 520 300',label='Mathematics diagram')=>`<svg viewBox="${view}" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="${paper}"/>${body}</svg>`;
const line=(x1,y1,x2,y2,opt='')=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${ink}" stroke-width="2" ${opt}/>`;
const text=(x,y,s,size=15,anchor='middle',fill=ink,weight=500)=>`<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Inter,Arial,sans-serif" font-size="${size}" font-weight="${weight}" fill="${fill}">${s}</text>`;
const rect=(x,y,w,h,fill='#fff',stroke=ink,rx=0)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="1.6"/>`;
const dot=(x,y,r=5,fill=blue)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;
const pill=(x,y,w,label,fill=blue2)=>rect(x,y,w,38,fill,'#b7dfe9',19)+text(x+w/2,y+24,label,12,'middle',ink,650);

function card(x,y,w,h,title,body,accent=blue){
  return rect(x,y,w,h,'#fff','#ddd8ce',12)+
    `<rect x="${x}" y="${y}" width="5" height="${h}" rx="3" fill="${accent}"/>`+
    text(x+18,y+28,title,13,'start',ink,750)+
    text(x+18,y+55,body,12,'start',muted,500);
}
function baseDiagram(L,v){
  try{return window.NES_DIAGRAMS?.render(L.diagram,v)||''}catch(e){return ''}
}
function genericVisualSlides(L){
  if(!L.diagram)return [];
  const d0=baseDiagram(L,0),d1=baseDiagram(L,1),d2=baseDiagram(L,2),d3=baseDiagram(L,3);
  const many=/Geometry|Mensuration|Probability|Graphs|Construction/.test(L.unit||'');
  const out=[{
    title:'See the structure',
    subtitle:'Use the visual before calculating. Say what you notice, what is fixed, and what changes.',
    html:`<div class="visual-pair"><figure><div class="visual-card">${d0}</div><figcaption>Core representation</figcaption></figure><figure><div class="visual-card">${d1}</div><figcaption>Same idea, different view</figcaption></figure></div>`
  }];
  if(many) out.push({
    title:'Connect the representations',
    subtitle:'The mathematics should still agree when the diagram changes orientation, scale or presentation.',
    html:`<div class="visual-pair"><figure><div class="visual-card">${d2}</div><figcaption>Variation</figcaption></figure><figure><div class="visual-card">${d3}</div><figcaption>Reasoning view</figcaption></figure></div>`
  });
  return out;
}

function typesData(){
  let b='';
  b+=card(28,36,220,96,'Categorical','eye colour • bus route • house',blue);
  b+=card(272,36,220,96,'Discrete numerical','siblings: 0, 1, 2, 3, …',warm);
  b+=card(28,158,220,96,'Continuous numerical','height • time • mass',blue);
  b+=card(272,158,220,96,'Source','primary = you collect it\nsecondary = already collected',warm);
  return svg(b,'0 0 520 290','Types of data');
}
function dataDecision(){
  let b=text(260,26,'What kind of data is it?',19,'middle',ink,700);
  b+=line(260,38,260,75)+line(100,75,420,75)+line(100,75,100,105)+line(420,75,420,105);
  b+=pill(42,106,116,'Categories')+pill(362,106,116,'Numbers',warm2);
  b+=line(420,144,420,175)+line(325,175,485,175)+line(325,175,325,202)+line(485,175,485,202);
  b+=pill(268,203,114,'Discrete')+pill(428,203,114,'Continuous',warm2);
  b+=text(100,170,'names / labels',11,'middle',muted);
  b+=text(325,270,'counts',11,'middle',muted)+text(485,270,'measurements',11,'middle',muted);
  return svg(b,'0 0 520 292','Data type decision tree');
}
function sampleVisual(){
  let b=text(260,25,'Population → representative sample',18,'middle',ink,700);
  for(let r=0;r<4;r++)for(let c=0;c<8;c++){
    const x=80+c*46,y=64+r*44; const chosen=(r===0&&c===1)||(r===1&&c===6)||(r===2&&c===3)||(r===3&&c===0)||(r===3&&c===7);
    b+=`<circle cx="${x}" cy="${y}" r="11" fill="${chosen?blue2:'#fff'}" stroke="${chosen?blue:'#aaa'}" stroke-width="${chosen?2.3:1.2}"/>`;
  }
  b+=line(250,242,270,242,'stroke="'+blue+'" stroke-width="3"')+text(260,272,'spread the sample across the population',12,'middle',muted);
  return svg(b,'0 0 520 292','Representative sample diagram');
}
function surveyVisual(){
  let b='';
  b+=card(25,38,225,104,'Leading question','“Don’t you agree lunch is too short?”','#b94a48');
  b+=card(270,38,225,104,'Neutral question','“How long should lunch be?”',blue);
  b+=card(25,166,225,88,'Overlapping groups','0–5, 5–10, 10–15','#b94a48');
  b+=card(270,166,225,88,'Clear groups','0–4, 5–9, 10–14',blue);
  return svg(b,'0 0 520 292','Questionnaire design');
}
function tallyTable(){
  const cats=['Walk','Bus','Car','Bike'],freq=[6,10,4,5];
  let b=text(260,25,'Journey to school',18,'middle',ink,700);
  b+=rect(74,48,372,196,'#fff','#cfc9bd',8);
  b+=line(74,88,446,88)+line(250,48,250,244)+line(350,48,350,244);
  b+=text(162,74,'Method',12)+text(300,74,'Tally',12)+text(398,74,'Frequency',12);
  cats.forEach((c,i)=>{const y=116+i*38;b+=i?line(74,y-19,446,y-19,'stroke="#e6e1d7" stroke-width="1"'):'';b+=text(92,y,c,12,'start');const f=freq[i];const groups=Math.floor(f/5),rem=f%5;let tally='';for(let g=0;g<groups;g++)tally+='||||/ ';tally+='|'.repeat(rem);b+=text(300,y,tally,13);b+=text(398,y,f,13);});
  return svg(b,'0 0 520 285','Tally and frequency table');
}
function pictogram(){
  const data=[['Football',8],['Swimming',6],['Tennis',4],['Running',2]];
  let b=text(260,25,'Favourite sport',18,'middle',ink,700)+text(260,49,'● = 2 students',11,'middle',muted);
  data.forEach((d,i)=>{const y=92+i*45;b+=text(90,y,d[0],12,'start');for(let j=0;j<d[1]/2;j++)b+=dot(225+j*34,y-5,8,j%2?warm:blue);});
  return svg(b,'0 0 520 285','Pictogram');
}
function barChart(){
  const vals=[4,9,6,11],labs=['Ali','Maya','Sara','Omar']; let b=text(260,22,'Books read this month',18,'middle',ink,700);
  const x0=68,y0=242,h=176; b+=line(x0,66,x0,y0)+line(x0,y0,470,y0);
  for(let k=0;k<=12;k+=2){const y=y0-k*(h/12);b+=line(x0-4,y,470,y,'stroke="#ece8df" stroke-width="1"')+text(x0-9,y+4,k,9,'end',muted);}
  vals.forEach((v,i)=>{const x=105+i*90;const bh=v*(h/12);b+=rect(x,y0-bh,48,bh,i===2?blue2:warm2,i===2?blue:'#b9aa8d',4)+text(x+24,266,labs[i],11)+text(x+24,y0-bh-8,v,11);});
  return svg(b,'0 0 520 285','Bar chart');
}
function dualBar(){
  const a=[8,5,10,7],bvals=[6,9,7,11],labs=['Mon','Tue','Wed','Thu'];let b=text(260,22,'Club attendance',18,'middle',ink,700);
  const x0=66,y0=242,h=174;b+=line(x0,68,x0,y0)+line(x0,y0,472,y0);
  for(let k=0;k<=12;k+=2){const y=y0-k*(h/12);b+=line(x0,y,472,y,'stroke="#ece8df" stroke-width="1"')+text(58,y+4,k,9,'end',muted);}
  labs.forEach((lab,i)=>{const x=100+i*92;const h1=a[i]*h/12,h2=bvals[i]*h/12;b+=rect(x,y0-h1,25,h1,blue2,blue,2)+rect(x+28,y0-h2,25,h2,warm2,'#a98c5e',2)+text(x+26,265,lab,10);});
  b+=rect(356,42,12,12,blue2,blue,2)+text(375,52,'Class A',9,'start')+rect(421,42,12,12,warm2,'#a98c5e',2)+text(440,52,'Class B',9,'start');
  return svg(b,'0 0 520 285','Dual bar chart');
}
function compoundBar(){
  const vals=[[5,3],[7,4],[4,6],[8,2]],labs=['A','B','C','D'];let b=text(260,22,'Travel: walk + bus',18,'middle',ink,700);
  const x0=70,y0=242,h=170;b+=line(x0,72,x0,y0)+line(x0,y0,470,y0);
  for(let k=0;k<=12;k+=2){const y=y0-k*h/12;b+=line(x0,y,470,y,'stroke="#ece8df" stroke-width="1"')+text(61,y+4,k,9,'end',muted);}
  vals.forEach((v,i)=>{const x=112+i*86;const h1=v[0]*h/12,h2=v[1]*h/12;b+=rect(x,y0-h1,45,h1,blue2,blue,2)+rect(x,y0-h1-h2,45,h2,warm2,'#a98c5e',2)+text(x+22,264,labs[i],10);});
  b+=text(260,53,'stacked bars compare totals and parts',11,'middle',muted);
  return svg(b,'0 0 520 285','Compound bar chart');
}
function pieChart(){
  const vals=[12,9,6,3], total=30, cols=[blue,'#6bc9e1',warm,'#eadfcb']; let b=text(260,24,'Favourite activity',18,'middle',ink,700);
  const cx=205,cy=154,r=92;let start=-90;
  vals.forEach((v,i)=>{const ang=v/total*360,end=start+ang;const p=a=>[cx+r*Math.cos(a*Math.PI/180),cy+r*Math.sin(a*Math.PI/180)];const [x1,y1]=p(start),[x2,y2]=p(end);const large=ang>180?1:0;b+=`<path d="M${cx} ${cy} L${x1} ${y1} A${r} ${r} 0 ${large} 1 ${x2} ${y2} Z" fill="${cols[i]}" stroke="#fff" stroke-width="2"/>`;start=end;});
  const labels=[['Games',12],['Reading',9],['Sport',6],['Music',3]];
  labels.forEach((d,i)=>{b+=rect(335,86+i*38,12,12,cols[i],cols[i],2)+text(355,97+i*38,`${d[0]}  ${d[1]}/30`,11,'start');});
  b+=text(205,270,'sector angle = frequency ÷ total × 360°',10,'middle',muted);
  return svg(b,'0 0 520 285','Pie chart');
}
function frequencyPolygon(){
  const xs=[1,2,3,4,5,6],ys=[2,5,9,7,4,1];let b=text(260,22,'Number of books read',18,'middle',ink,700);
  const x0=72,y0=242;b+=line(x0,60,x0,y0)+line(x0,y0,470,y0);
  for(let k=0;k<=10;k+=2){const y=y0-k*16;b+=line(x0,y,470,y,'stroke="#ece8df" stroke-width="1"')+text(62,y+4,k,9,'end',muted);}
  const pts=xs.map((x,i)=>[85+x*56,y0-ys[i]*16]);b+=`<polyline points="${pts.map(p=>p.join(',')).join(' ')}" fill="none" stroke="${blue}" stroke-width="3"/>`;pts.forEach((p,i)=>{b+=dot(p[0],p[1],5,blue)+text(p[0],260,xs[i],9);});
  return svg(b,'0 0 520 285','Frequency polygon');
}
function misleadingChart(){
  let b=text(260,20,'Same data — different axes',18,'middle',ink,700);
  function mini(x,y,w,h,min,max,label){
    let q=rect(x,y,w,h,'#fff','#d7d1c7',6)+text(x+w/2,y+20,label,11,'middle',muted,650);
    const base=y+h-28, top=y+38, scale=(base-top)/(max-min);
    q+=line(x+38,top,x+38,base)+line(x+38,base,x+w-18,base);
    [50,52].forEach((v,i)=>{const bh=(v-min)*scale; q+=rect(x+70+i*70,base-bh,38,bh,i?warm2:blue2,i?'#a98c5e':blue,2)+text(x+89+i*70,base-bh-7,v,10);});
    q+=text(x+89,base+18,'A',9)+text(x+159,base+18,'B',9);return q;
  }
  b+=mini(24,42,226,218,0,60,'Axis starts at 0');
  b+=mini(270,42,226,218,48,54,'Axis starts at 48');
  return svg(b,'0 0 520 285','Misleading bar chart comparison');
}
function twoWayTable(){
  let b=text(260,23,'After-school club choices',18,'middle',ink,700);
  const x=92,y=55,cw=85,rh=42; const rows=[['','Sport','Music','Total'],['Bus',8,5,13],['Car',6,7,13],['Walk',10,4,14],['Total',24,16,40]];
  b+=rect(x,y,cw*4,rh*5,'#fff','#ccc6ba',6);
  for(let i=1;i<4;i++)b+=line(x+i*cw,y,x+i*cw,y+rh*5,'stroke="#ddd8ce" stroke-width="1"');
  for(let j=1;j<5;j++)b+=line(x,y+j*rh,x+cw*4,y+j*rh,'stroke="#ddd8ce" stroke-width="1"');
  rows.forEach((r,j)=>r.forEach((v,i)=>text(x+i*cw+cw/2,y+j*rh+27,String(v),11,'middle',j===0||i===0?ink:muted,j===0||i===0?700:500)));
  return svg(b,'0 0 520 285','Two-way table');
}
function dotPlot(){
  const vals=[4,5,5,6,7,7,7,8,10];let b=text(260,22,'Scores',18,'middle',ink,700)+line(75,222,455,222);
  for(let n=3;n<=11;n++){const x=95+(n-3)*42;b+=line(x,216,x,228)+text(x,247,n,9);}
  const counts={};vals.forEach(v=>{counts[v]=(counts[v]||0)+1;const x=95+(v-3)*42,y=205-(counts[v]-1)*28;b+=dot(x,y,7,v===7?blue:warm);});
  b+=text(260,274,'median = 7 • mode = 7 • range = 6',11,'middle',muted);
  return svg(b,'0 0 520 285','Dot plot showing median mode and range');
}
function meanBalance(){
  const vals=[4,6,7,8,10];const mean=7;let b=text(260,22,'Mean as a balance point',18,'middle',ink,700)+line(72,210,455,210);
  for(let n=3;n<=11;n++){const x=92+(n-3)*43;b+=line(x,204,x,216)+text(x,238,n,9);}
  vals.forEach(v=>{const x=92+(v-3)*43;b+=dot(x,170,8,v===mean?blue:warm)+line(x,178,x,206,'stroke="#b8b1a5" stroke-width="1.3"');});
  const xm=92+(mean-3)*43;b+=line(xm,95,xm,210,'stroke="'+blue+'" stroke-width="2" stroke-dasharray="5 4"')+text(xm,80,'mean = 7',13,'middle',blue,700);
  b+=text(260,270,'total 35 ÷ 5 values = 7',11,'middle',muted);
  return svg(b,'0 0 520 285','Mean as balance point');
}
function outlierCompare(){
  const a=[4,5,5,6,7], bvals=[4,5,5,6,30];
  let b=text(260,22,'Effect of an outlier',18,'middle',ink,700);
  b+=card(28,58,220,160,'Set A','4, 5, 5, 6, 7\nmean = 5.4\nmedian = 5',blue);
  b+=card(272,58,220,160,'Set B','4, 5, 5, 6, 30\nmean = 10\nmedian = 5',warm);
  b+=text(260,254,'the mean moves much more than the median',12,'middle',muted);
  return svg(b,'0 0 520 285','Effect of an outlier on mean and median');
}
function freqTableXF(){
  const vals=[1,2,3,4],freq=[2,5,4,1],xf=vals.map((v,i)=>v*freq[i]);let b=text(260,22,'Mean from an ungrouped frequency table',17,'middle',ink,700);
  const x=78,y=52,cw=90,rh=40;const rows=[['x','f','x × f'],...vals.map((v,i)=>[v,freq[i],xf[i]]),['Total',12,28]];
  b+=rect(x,y,cw*3,rh*6,'#fff','#ccc6ba',6);
  for(let i=1;i<3;i++)b+=line(x+i*cw,y,x+i*cw,y+rh*6,'stroke="#ddd8ce" stroke-width="1"');
  for(let j=1;j<6;j++)b+=line(x,y+j*rh,x+cw*3,y+j*rh,'stroke="#ddd8ce" stroke-width="1"');
  rows.forEach((r,j)=>r.forEach((v,i)=>text(x+i*cw+cw/2,y+j*rh+26,String(v),11,'middle',j===0||j===5?ink:muted,j===0||j===5?700:500)));
  b+=text(398,128,'Σxf',13,'middle',blue,700)+text(398,154,'──── = 28/12',12)+text(398,178,'Σf',13,'middle',blue,700)+text(398,212,'mean ≈ 2.33',13,'middle',ink,700);
  return svg(b,'0 0 520 300','Mean from frequency table');
}
function freqBars(){
  const vals=[1,2,3,4,5],freq=[2,5,7,4,2];let b=text(260,22,'Frequency diagram',18,'middle',ink,700);const x0=72,y0=242,h=170;b+=line(x0,72,x0,y0)+line(x0,y0,470,y0);
  for(let k=0;k<=8;k+=2){const y=y0-k*h/8;b+=line(x0,y,470,y,'stroke="#ece8df" stroke-width="1"')+text(62,y+4,k,9,'end',muted);}
  vals.forEach((v,i)=>{const x=102+i*70,bh=freq[i]*h/8;b+=rect(x,y0-bh,42,bh,blue2,blue,2)+text(x+21,262,v,10)+text(x+21,y0-bh-7,freq[i],10);});
  b+=text(260,282,'value',10,'middle',muted);return svg(b,'0 0 520 292','Frequency diagram');
}

const custom={
  52:[
    {title:'Classify the data',subtitle:'Before collecting or drawing anything, decide what kind of variable you have.',html:`<div class="visual-pair"><figure><div class="visual-card">${typesData()}</div><figcaption>Categorical, discrete and continuous</figcaption></figure><figure><div class="visual-card">${dataDecision()}</div><figcaption>A quick decision tree</figcaption></figure></div>`}
  ],
  53:[
    {title:'Plan a fair collection',subtitle:'A good method matches the population, avoids bias and records answers consistently.',html:`<div class="visual-pair"><figure><div class="visual-card">${sampleVisual()}</div><figcaption>Representative sampling</figcaption></figure><figure><div class="visual-card">${surveyVisual()}</div><figcaption>Questionnaire design</figcaption></figure></div>`}
  ],
  54:[
    {title:'Tables and pictograms',subtitle:'Organise first. A clear table makes every later graph easier to construct and check.',html:`<div class="visual-pair"><figure><div class="visual-card">${tallyTable()}</div><figcaption>Tally → frequency table</figcaption></figure><figure><div class="visual-card">${pictogram()}</div><figcaption>Pictogram with a stated key</figcaption></figure></div>`},
    {title:'Bar charts for comparison',subtitle:'Separated bars show categorical or discrete groups. Dual and compound bars compare more than one set.',html:`<div class="visual-pair"><figure><div class="visual-card">${barChart()}</div><figcaption>Single bar chart</figcaption></figure><figure><div class="visual-card">${dualBar()}</div><figcaption>Dual bar chart</figcaption></figure></div>`},
    {title:'Compound bars and two-way tables',subtitle:'Use the display that makes the comparison easiest to see.',html:`<div class="visual-pair"><figure><div class="visual-card">${compoundBar()}</div><figcaption>Compound / stacked bar chart</figcaption></figure><figure><div class="visual-card">${twoWayTable()}</div><figcaption>Two-way table</figcaption></figure></div>`},
    {title:'Pie charts and frequency polygons',subtitle:'Pie charts show proportion; frequency polygons show the shape of a numerical distribution.',html:`<div class="visual-pair"><figure><div class="visual-card">${pieChart()}</div><figcaption>Sector angle = frequency ÷ total × 360°</figcaption></figure><figure><div class="visual-card">${frequencyPolygon()}</div><figcaption>Join plotted frequencies with straight segments</figcaption></figure></div>`},
    {title:'Spot a misleading graph',subtitle:'The numbers can be correct while the visual impression is unfair. Always inspect the axis.',html:`<div class="visual-single"><div class="visual-card">${misleadingChart()}</div></div>`}
  ],
  55:[
    {title:'Median, mode and range',subtitle:'Order matters for the median. Repetition matters for the mode. Extremes determine the range.',html:`<div class="visual-pair"><figure><div class="visual-card">${dotPlot()}</div><figcaption>Dot plot makes centre and spread visible</figcaption></figure><figure><div class="visual-card">${meanBalance()}</div><figcaption>The mean is a balance point</figcaption></figure></div>`},
    {title:'Choose the right average',subtitle:'Outliers can pull the mean strongly while leaving the median almost unchanged.',html:`<div class="visual-single"><div class="visual-card">${outlierCompare()}</div></div>`}
  ],
  56:[
    {title:'Frequency tables compress repeated data',subtitle:'Each row represents a value and how often it occurred.',html:`<div class="visual-pair"><figure><div class="visual-card">${freqBars()}</div><figcaption>Frequency diagram</figcaption></figure><figure><div class="visual-card">${freqTableXF()}</div><figcaption>Use x × f to calculate the mean</figcaption></figure></div>`},
    {title:'Mean from a frequency table',subtitle:'Multiply each value by its frequency, total those products, then divide by total frequency.',html:`<div class="visual-single"><div class="visual-card">${freqTableXF()}</div></div>`}
  ]
};

function slidesFor(L){
  if(custom[L.lesson]) return custom[L.lesson];
  return genericVisualSlides(L);
}
function exampleVisual(L,i){
  if(L.lesson===52) return i===0?typesData():i===1?dataDecision():sampleVisual();
  if(L.lesson===53) return i===0?sampleVisual():surveyVisual();
  if(L.lesson===54) return [barChart(),pieChart(),misleadingChart()][i]||barChart();
  if(L.lesson===55) return [dotPlot(),meanBalance(),outlierCompare()][i]||dotPlot();
  if(L.lesson===56) return [freqBars(),freqTableXF(),freqTableXF()][i]||freqTableXF();
  return baseDiagram(L,i+1);
}

window.NES_VISUALS={slidesFor,exampleVisual};
})();