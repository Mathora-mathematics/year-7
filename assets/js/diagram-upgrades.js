(() => {
  'use strict';
  const base = window.NES_DIAGRAMS && window.NES_DIAGRAMS.render ? window.NES_DIAGRAMS.render.bind(window.NES_DIAGRAMS) : null;
  const W=520,H=300, ink='#17191c', muted='#697076', blue='#00a9dc', blue2='#dff6fc', warm='#d8c7a8', paper='#fff';
  const t=(x,y,s,fs=16,a='middle',c=ink,w=500)=>`<text x="${x}" y="${y}" text-anchor="${a}" font-family="Inter,Arial,sans-serif" font-size="${fs}" font-weight="${w}" fill="${c}">${s}</text>`;
  const l=(x1,y1,x2,y2,extra='')=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${ink}" stroke-width="2" ${extra}/>`;
  const circle=(x,y,r,fill=paper,stroke=ink)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`;
  const svg=b=>`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Mathematics diagram" xmlns="http://www.w3.org/2000/svg">${b}</svg>`;
  const arrow=(x1,y1,x2,y2,c=blue)=>`${l(x1,y1,x2,y2,`stroke="${c}" stroke-width="3"`)}<path d="M${x2} ${y2} l-10 -6 v12 z" fill="${c}"/>`;
  const grid=(x=70,y=35,w=360,h=220,step=30)=>{let b=`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#fff" stroke="#d7d9dc"/>`;for(let X=x;X<=x+w;X+=step)b+=l(X,y,X,y+h,'stroke="#eceef0" stroke-width="1"');for(let Y=y;Y<=y+h;Y+=step)b+=l(x,Y,x+w,Y,'stroke="#eceef0" stroke-width="1"');return b};
  function fracBar(parts,filled,x,y,w=220,h=34,color=blue2){let b='';for(let i=0;i<parts;i++)b+=`<rect x="${x+i*w/parts}" y="${y}" width="${w/parts}" height="${h}" fill="${i<filled?color:'#fff'}" stroke="${ink}" stroke-width="1.2"/>`;return b;}
  function axes(){const x0=260,y0=155,s=28;let b=grid(92,30,336,224,28)+l(92,y0,428,y0,'stroke-width="2.5"')+l(x0,30,x0,254,'stroke-width="2.5"');for(let i=-5;i<=5;i++){if(i){b+=l(x0+i*s,y0-4,x0+i*s,y0+4,'stroke-width="1.3"')+t(x0+i*s,y0+18,i,10);b+=l(x0-4,y0-i*s,x0+4,y0-i*s,'stroke-width="1.3"')+t(x0-12,y0-i*s+4,i,10,'end')}}return {b,x0,y0,s};}

  function render(type,variant=0){
    const v=((variant||0)%4+4)%4;
    let b='';
    if(type==='like-terms'){
      const rows=v===3?['3ab','−5ba','+7ab']:v===2?['4x²','+3x','+5x²','−8x']:['6a','+2b','−4a','+5b'];
      const colors=[blue, warm, blue, warm]; let x=70;
      rows.forEach((r,i)=>{b+=`<rect x="${x}" y="90" rx="10" width="82" height="52" fill="${i%2? '#f6efe3':blue2}" stroke="${colors[i]}"/>`+t(x+41,122,r,17);x+=96});
      b+=t(260,188,v===3?'ab and ba are like terms':'Group identical variable parts',13,'middle',muted,600);
      if(v!==3)b+=arrow(145,220,375,220)+t(260,250,'combine coefficients only',12,'middle',muted);
      return svg(b);
    }
    if(type==='distributive'){
      const A=v===2?4:3, left=v===3?'x':'2x', right=v===3?'−5':'4';
      b+=`<rect x="85" y="70" width="350" height="145" fill="#fff" stroke="${ink}" stroke-width="2"/>`;
      b+=l(300,70,300,215,'stroke-width="2"')+t(192,56,left,17)+t(368,56,right,17)+t(60,150,A,17);
      b+=t(192,145,`${A}×${left}`,18)+t(368,145,`${A}×${right}`,18)+t(260,250,'multiply every term inside the bracket',12,'middle',muted);
      return svg(b);
    }
    if(type==='balance'){
      b+=l(260,55,260,210,'stroke-width="4"')+l(135,210,385,210,'stroke-width="4"')+l(150,95,370,95,'stroke-width="4"');
      b+=l(175,95,145,160)+l(335,95,365,160)+`<path d="M110 160h70l-10 30h-50z" fill="${blue2}" stroke="${ink}"/><path d="M330 160h70l-10 30h-50z" fill="#f7f1e8" stroke="${ink}"/>`;
      b+=t(145,181,v===2?'3x + 4':'2x + 5',16)+t(365,181,v===2?'19':'17',16)+t(260,248,'keep the equation balanced: do the same to both sides',12,'middle',muted);
      return svg(b);
    }
    if(type==='fraction-add'){
      if(v===1){b+=fracBar(5,3,55,65,180,34)+t(145,55,'3/5',14)+t(260,83,'+',22)+fracBar(2,1,300,65,160,34)+t(380,55,'1/2',14);b+=t(260,150,'common denominator → tenths',13,'middle',muted)+fracBar(10,6,55,180,180,34)+t(260,198,'+',22)+fracBar(10,5,300,180,160,34);}
      else if(v===2){b+=l(55,150,465,150,'stroke-width="3"');for(let i=0;i<=12;i++){const x=55+i*34.16;b+=l(x,143,x,157,'stroke-width="1"');if(i%3===0)b+=t(x,177,`${i}/12`,10)}b+=circle(55+5*34.16,150,6,blue,blue)+circle(55+9*34.16,150,6,warm,warm)+t(260,75,'difference on a common number line',14);}
      else {b+=fracBar(12,8,85,72,350,38)+t(260,60,'2/3 = 8/12',15)+fracBar(12,3,85,152,350,38,'#f5ead7')+t(260,140,'1/4 = 3/12',15)+t(260,238,'same-sized parts make addition meaningful',12,'middle',muted);}
      return svg(b);
    }
    if(type==='fraction-multiply'){
      const cols=4,rows=3;for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const x=120+c*70,y=50+r*60;let fill='#fff';if(c<3)fill=blue2;if(r<2)fill=c<3?'#bfeaf5':'#f7f1e8';b+=`<rect x="${x}" y="${y}" width="70" height="60" fill="${fill}" stroke="${ink}" stroke-width="1"/>`;}
      b+=t(260,245,v===3?'intersection = product of the two fractions':'area model: 3/4 × 2/3',14,'middle',muted);return svg(b);
    }
    if(type==='percent-change'){
      const p=v===2?85:v===3?120:100; b+=`<rect x="70" y="95" width="360" height="54" fill="#fff" stroke="${ink}"/>`+`<rect x="70" y="95" width="${3.6*Math.min(p,100)}" height="54" fill="${blue2}" stroke="none"/>`; if(p>100)b+=`<rect x="430" y="95" width="72" height="54" fill="#f4ead8" stroke="${warm}"/>`; b+=t(250,130,'100%',17);b+=t(260,205,v===2?'15% decrease → ×0.85':v===3?'20% increase → ×1.20':'percentage multiplier',15,'middle',muted);return svg(b);
    }
    if(type==='parallel-lines'){
      b+=l(55,70,465,70,'stroke-width="4"')+l(55,220,465,220,'stroke-width="4"')+l(145,270,370,20,'stroke-width="4"');
      const p1={x:325,y:70},p2={x:190,y:220};
      if(v===1){b+=t(p1.x+20,p1.y-12,'x',18)+t(p2.x+22,p2.y-10,'x',18)+t(260,285,'corresponding angles are equal',12,'middle',muted);}
      else if(v===2){b+=t(p1.x-26,p1.y+35,'x',18)+t(p2.x+25,p2.y-18,'x',18)+t(260,285,'alternate angles are equal',12,'middle',muted);}
      else if(v===3){b+=t(p1.x-26,p1.y+35,'a',18)+t(p2.x-30,p2.y-18,'b',18)+t(260,285,'co-interior angles: a + b = 180°',12,'middle',muted);}
      else {b+=t(260,285,'parallel lines create linked angle families',12,'middle',muted);}
      return svg(b);
    }
    if(type==='triangle-angles'){
      if(v===2){b+=`<polygon points="120,230 260,52 400,230" fill="${blue2}" stroke="${ink}" stroke-width="2"/>`+t(260,98,'38°',16)+t(156,220,'71°',16)+t(364,220,'71°',16)+t(260,270,'isosceles: equal sides ↔ equal base angles',12,'middle',muted);}
      else if(v===3){b+=`<polygon points="100,220 330,220 230,70" fill="#fff" stroke="${ink}" stroke-width="2"/>`+l(330,220,465,220,'stroke-width="2"')+t(350,202,'x',17)+t(220,118,'a',17)+t(130,205,'b',17)+t(285,270,'exterior angle x = a + b',12,'middle',muted);}
      else {b+=`<polygon points="95,225 260,50 430,225" fill="#fff" stroke="${ink}" stroke-width="2"/>`+t(130,215,'a',17)+t(260,92,'b',17)+t(394,215,'c',17)+t(260,270,'a + b + c = 180°',14,'middle',muted);}
      return svg(b);
    }
    if(type==='quadrilateral-angles'){
      if(v===3){b+=`<polygon points="90,225 145,60 390,85 430,225" fill="#fff" stroke="${ink}" stroke-width="2"/>`+l(90,225,390,85,'stroke="'+blue+'" stroke-width="2" stroke-dasharray="6 5"')+t(260,270,'one diagonal → two triangles → 360°',12,'middle',muted);}
      else {b+=`<polygon points="95,220 155,65 385,80 430,220" fill="${v===2?blue2:'#fff'}" stroke="${ink}" stroke-width="2"/>`+t(260,270,v===2?'opposite angles match in a parallelogram':'interior angles total 360°',13,'middle',muted);}
      return svg(b);
    }
    if(type==='area-shapes'){
      if(v===1){b+=`<rect x="110" y="70" width="300" height="150" fill="${blue2}" stroke="${ink}" stroke-width="2"/>`+t(260,58,'12 cm',15)+t(90,150,'5 cm',15,'end')+t(260,265,'A = length × width',13,'middle',muted);}
      else if(v===2){b+=`<polygon points="110,220 260,55 420,220" fill="#fff" stroke="${ink}" stroke-width="2"/>`+l(260,55,260,220,'stroke="'+blue+'" stroke-dasharray="6 4"')+t(260,245,'base × perpendicular height ÷ 2',13,'middle',muted);}
      else {b+=`<polygon points="120,80 365,80 430,220 70,220" fill="#f7f1e8" stroke="${ink}" stroke-width="2"/>`+l(365,80,365,220,'stroke="'+blue+'" stroke-dasharray="6 4"')+t(260,260,'trapezium: ½(a+b)h',13,'middle',muted);}
      return svg(b);
    }
    if(type==='compound-shape'){
      b+=`<path d="M75 50 H425 V120 H305 V240 H75 Z" fill="${blue2}" stroke="${ink}" stroke-width="2"/>`;
      if(v===2){b+=l(305,120,305,240,'stroke="'+blue+'" stroke-dasharray="6 5"')+l(75,120,425,120,'stroke="'+blue+'" stroke-dasharray="6 5"')+t(260,275,'split and add rectangles',12,'middle',muted);}
      else {b+=`<rect x="305" y="120" width="120" height="120" fill="#fff" stroke="${warm}" stroke-width="2" stroke-dasharray="6 5"/>`+t(260,275,'large rectangle − missing rectangle',12,'middle',muted);}
      return svg(b);
    }
    if(type==='charts'){
      if(v===1){b+=l(65,235,250,235)+l(65,235,65,45);[80,130,95,165].forEach((h,i)=>b+=`<rect x="${90+i*38}" y="${235-h}" width="24" height="${h}" fill="${i%2?warm:blue}" opacity=".72"/>`);b+=t(160,270,'bar chart',13);}
      else if(v===2){b+=circle(260,145,92,'#fff',ink)+`<path d="M260 145 L260 53 A92 92 0 0 1 346 177 Z" fill="${blue2}" stroke="${ink}"/>`+`<path d="M260 145 L346 177 A92 92 0 0 1 184 204 Z" fill="#f4ead8" stroke="${ink}"/>`+t(260,270,'pie chart: angle ↔ proportion',13);}
      else {b+=l(70,235,450,235)+l(70,235,70,45);const pts=[[95,190],[160,145],[225,165],[290,100],[355,125],[420,75]];b+=`<polyline points="${pts.map(p=>p.join(',')).join(' ')}" fill="none" stroke="${blue}" stroke-width="3"/>`;pts.forEach(p=>b+=circle(p[0],p[1],5,blue,blue));b+=t(260,270,'frequency polygon / trend',13);}
      return svg(b);
    }
    if(type==='averages'){
      if(v===1){[2,4,4,5,8,10].forEach((n,i)=>b+=circle(70+n*34,210-i%2*16,7,blue,blue));b+=l(70,225,450,225);for(let n=0;n<=10;n+=2)b+=t(70+n*34,248,n,10);b+=t(260,55,'mode is the most frequent value',14);}
      else {const vals=[4,7,7,9,13];vals.forEach((n,i)=>b+=`<rect x="${75+i*80}" y="${210-n*8}" width="45" height="${n*8}" fill="${i===2?blue:warm}" opacity=".75"/>`);b+=t(260,260,v===2?'median: middle after ordering':'mean: total ÷ number of values',13,'middle',muted);}
      return svg(b);
    }
    if(type==='probability-scale'){
      b+=l(60,150,460,150,'stroke-width="4"');[0,.25,.5,.75,1].forEach((n,i)=>{const x=60+i*100;b+=l(x,138,x,162)+t(x,184,n,12)});const p=v===1?.2:v===2?.65:v===3?.9:.5;const x=60+p*400;b+=circle(x,150,9,blue,blue)+t(x,120,`${Math.round(p*100)}%`,14);b+=t(260,245,p<.5?'unlikely':p>.5?'likely':'even chance',14,'middle',muted);return svg(b);
    }
    if(type==='spinner'){
      const sectors=v===2?8:6; const cx=260,cy=145,r=92;for(let i=0;i<sectors;i++){const a1=-90+i*360/sectors,a2=-90+(i+1)*360/sectors;const x1=cx+r*Math.cos(a1*Math.PI/180),y1=cy+r*Math.sin(a1*Math.PI/180),x2=cx+r*Math.cos(a2*Math.PI/180),y2=cy+r*Math.sin(a2*Math.PI/180);const large=(360/sectors)>180?1:0;b+=`<path d="M${cx} ${cy} L${x1} ${y1} A${r} ${r} 0 ${large} 1 ${x2} ${y2} Z" fill="${i<(v===3?3:2)?blue2:'#fff'}" stroke="${ink}"/>`;}
      b+=circle(cx,cy,5,ink,ink)+t(260,275,`${sectors} equal sectors → count favourable outcomes`,12,'middle',muted);return svg(b);
    }
    if(type==='relative-frequency'){
      b+=l(65,235,455,235)+l(65,235,65,45);const pts=v===3?[[65,85],[120,170],[175,120],[230,145],[285,125],[340,132],[395,129],[450,130]]:[[65,70],[120,185],[175,105],[230,155],[285,118],[340,138],[395,127],[450,132]];b+=`<polyline points="${pts.map(p=>p.join(',')).join(' ')}" fill="none" stroke="${blue}" stroke-width="3"/>`;pts.forEach(p=>b+=circle(p[0],p[1],4,blue,blue));b+=t(260,270,'more trials → relative frequency often stabilises',12,'middle',muted);return svg(b);
    }
    if(type==='coordinate-plane'||type==='coordinate-shape'||type==='axis-lines'||type==='straight-line'){
      const a=axes();b+=a.b;
      if(type==='coordinate-plane'){const pts=v===2?[[-4,3],[2,4],[4,-1],[-2,-4]]:[[-3,2],[1,4],[4,-3],[-4,-1]];pts.forEach(([x,y],i)=>{const X=a.x0+x*a.s,Y=a.y0-y*a.s;b+=circle(X,Y,5,blue,blue)+t(X+10,Y-8,String.fromCharCode(65+i),11,'start')});}
      if(type==='coordinate-shape'){const pts=v===3?[[-4,-1],[0,-1],[0,3],[-4,3]]:[[-3,-2],[2,-2],[2,2],[-3,2]];b+=`<polygon points="${pts.map(([x,y])=>`${a.x0+x*a.s},${a.y0-y*a.s}`).join(' ')}" fill="${blue2}" stroke="${blue}" stroke-width="2"/>`;pts.forEach(([x,y],i)=>b+=t(a.x0+x*a.s+8,a.y0-y*a.s-8,String.fromCharCode(65+i),10,'start'));}
      if(type==='axis-lines'){const xv=v===2?-2:2,yv=v===3?-3:2;b+=l(a.x0+xv*a.s,35,a.x0+xv*a.s,250,'stroke="'+blue+'" stroke-width="3"')+l(95,a.y0-yv*a.s,425,a.y0-yv*a.s,'stroke="'+warm+'" stroke-width="3"')+t(a.x0+xv*a.s+8,48,`x=${xv}`,11,'start',blue)+t(410,a.y0-yv*a.s-8,`y=${yv}`,11,'end','#9b7e4f');}
      if(type==='straight-line'){const m=v===2?-1:v===3?3:2,c=v===2?2:v===3?-1:1;const x1=-5,x2=5,y1=m*x1+c,y2=m*x2+c;b+=l(a.x0+x1*a.s,a.y0-y1*a.s,a.x0+x2*a.s,a.y0-y2*a.s,'stroke="'+blue+'" stroke-width="3"')+t(385,58,`y=${m}x${c>=0?'+':''}${c}`,13,'start',blue);}
      return svg(b);
    }
    if(type==='real-life-graph'){
      b+=l(65,235,460,235)+l(65,235,65,45)+t(260,280,'time',11)+t(28,140,'distance',11,'middle',muted);
      const pts=v===2?[[65,235],[155,145],[245,145],[365,70],[440,70]]:v===3?[[65,235],[150,120],[220,120],[330,190],[440,80]]:[[65,235],[145,160],[220,160],[350,70],[440,70]];
      b+=`<polyline points="${pts.map(p=>p.join(',')).join(' ')}" fill="none" stroke="${blue}" stroke-width="3"/>`;pts.forEach(p=>b+=circle(p[0],p[1],4,blue,blue));b+=t(260,35,v===3?'away → stop → return → away':'moving → stopped → moving',13,'middle',muted);return svg(b);
    }
    if(type==='inequality'){
      b+=l(60,150,460,150,'stroke-width="3"');for(let n=-5;n<=5;n++){const x=260+n*36;b+=l(x,142,x,158)+t(x,180,n,10)}const bound=v===2?-2:v===3?3:1,open=v!==3,dir=v===1?'left':'right',x=260+bound*36;b+=circle(x,150,8,open?'#fff':blue,blue);if(dir==='right')b+=arrow(x+10,150,448,150);else b+=`<path d="M${x-10} 150 H72" stroke="${blue}" stroke-width="4"/><path d="M72 150 l12 -7 v14 z" fill="${blue}"/>`;b+=t(260,238,v===1?`x < ${bound}`:open?`x > ${bound}`:`x ≥ ${bound}`,20);return svg(b);
    }
    if(type==='perpendicular-bisector'){
      const ax=125,bx=395,y=165,m=260,r=v===2?180:165,h=Math.sqrt(Math.max(1,r*r-(bx-ax)*(bx-ax)/4));b+=l(ax,y,bx,y,'stroke-width="3"')+t(ax,y+28,'A',13)+t(bx,y+28,'B',13);b+=`<circle cx="${ax}" cy="${y}" r="${r}" fill="none" stroke="#c9cbd0" stroke-dasharray="6 5"/><circle cx="${bx}" cy="${y}" r="${r}" fill="none" stroke="#c9cbd0" stroke-dasharray="6 5"/>`+l(m,22,m,278,'stroke="'+blue+'" stroke-width="3"')+circle(m,y-h,5,blue,blue)+circle(m,y+h,5,blue,blue)+circle(m,y,5,warm,warm)+t(260,290,'equal-radius arcs locate the perpendicular bisector',11,'middle',muted);return svg(b);
    }
    if(type==='angle-bisector'){
      const ox=100,oy=230;b+=l(ox,oy,450,230,'stroke-width="3"')+l(ox,oy,360,55,'stroke-width="3"');const ang=-34;const half=ang/2;b+=l(ox,oy,ox+335*Math.cos(half*Math.PI/180),oy+335*Math.sin(half*Math.PI/180),'stroke="'+blue+'" stroke-width="3" stroke-dasharray="7 5"')+t(245,190,'½θ',16, 'middle', blue)+t(220,128,'½θ',16,'middle',blue)+t(260,280,'the bisector creates two equal angles',12,'middle',muted);return svg(b);
    }
    return base ? base(type,variant) : svg(t(260,150,'Mathematics visual',18));
  }
  window.NES_DIAGRAMS={render};
})();