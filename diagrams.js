(() => {
  const ink = '#15171a', muted = '#777b80', accent = '#00a7d4', warm = '#d7c9ae', paper = '#fffefa';
  const svg = (body, view='0 0 420 250') => `<svg viewBox="${view}" role="img" aria-label="Mathematics diagram" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="${paper}"/>${body}</svg>`;
  const line=(x1,y1,x2,y2,extra='')=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${ink}" stroke-width="2" ${extra}/>`;
  const txt=(x,y,t,size=15,anchor='middle',fill=ink)=>`<text x="${x}" y="${y}" font-family="Inter,Arial,sans-serif" font-size="${size}" text-anchor="${anchor}" fill="${fill}">${t}</text>`;
  const dot=(x,y,r=4,fill=accent)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;
  const grid=(x0,y0,w,h,step=25)=>{let s='';for(let x=x0;x<=x0+w;x+=step)s+=`<line x1="${x}" y1="${y0}" x2="${x}" y2="${y0+h}" stroke="#ece8df" stroke-width="1"/>`;for(let y=y0;y<=y0+h;y+=step)s+=`<line x1="${x0}" y1="${y}" x2="${x0+w}" y2="${y}" stroke="#ece8df" stroke-width="1"/>`;return s;};
  const arc=(cx,cy,r,a1,a2,color=accent,w=2)=>{const p=(a)=>[cx+r*Math.cos(a*Math.PI/180),cy+r*Math.sin(a*Math.PI/180)];const [x1,y1]=p(a1),[x2,y2]=p(a2);const large=Math.abs(a2-a1)>180?1:0;return `<path d="M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}" fill="none" stroke="${color}" stroke-width="${w}"/>`;};
  const axes=(xmin=-5,xmax=5,ymin=-4,ymax=4)=>{
    const x0=210,y0=125,sx=28,sy=25; let s=grid(70,25,280,200,25);
    s+=line(70,y0,350,y0,'stroke-width="1.7"')+line(x0,25,x0,225,'stroke-width="1.7"');
    s+=`<path d="M350 125 l-8 -5 v10 z" fill="${ink}"/><path d="M210 25 l-5 8 h10 z" fill="${ink}"/>`;
    for(let i=-5;i<=5;i++){ if(i){const x=x0+i*sx;s+=line(x,y0-4,x,y0+4,'stroke-width="1"')+txt(x,y0+18,i,9);} }
    for(let j=-4;j<=4;j++){ if(j){const y=y0-j*sy;s+=line(x0-4,y,x0+4,y,'stroke-width="1"')+txt(x0-10,y+3,j,9,'end');} }
    return {s,x0,y0,sx,sy};
  };

  function render(type, variant=0){
    let b='';
    switch(type){
      case 'number-line':
        b+=line(45,130,375,130); b+=`<path d="M45 130 l9 -5 v10 zM375 130 l-9 -5 v10 z" fill="${ink}"/>`;
        for(let n=-6;n<=6;n++){const x=210+n*25;b+=line(x,123,x,137,'stroke-width="1"')+txt(x,157,n,10);}
        b+=arc(210,130,62,205,335,accent,3)+txt(247,78,'+3',13); b+=arc(210,130,88,25,155,warm,3)+txt(161,64,'−4',13);
        b+=txt(210,215,'right = greater • left = smaller',11,'middle',muted); return svg(b);
      case 'rounding':
        b+=line(45,132,375,132); [3.4,3.5,3.6].forEach((v,i)=>{const x=90+i*120;b+=line(x,120,x,144)+txt(x,165,v,12);});
        b+=dot(210,132,7)+txt(210,92,'3.50',18); b+=txt(90,205,'3.4',14)+txt(330,205,'3.6',14); b+=`<path d="M115 188 Q210 155 305 188" fill="none" stroke="${accent}" stroke-width="3"/>`; return svg(b);
      case 'significant':
        b+=txt(210,48,'0 . 0 0 4 8 2',28); b+=line(202,60,202,98,'stroke-dasharray="4 4"')+txt(202,118,'1st significant digit',12); b+=line(244,60,244,98,'stroke-dasharray="4 4"')+txt(244,140,'next digit decides rounding',11); b+=txt(210,205,'Leading zeros are place-holders, not significant.',13,'middle',muted); return svg(b);
      case 'algebra-parts':
        b+=txt(210,55,'5x² − 3x + 7',30); b+=line(120,70,120,115,'stroke-dasharray="4 4"')+txt(120,136,'coefficient',12); b+=line(210,70,210,115,'stroke-dasharray="4 4"')+txt(210,136,'variable term',12); b+=line(304,70,304,115,'stroke-dasharray="4 4"')+txt(304,136,'constant',12); b+=txt(210,205,'Expression = terms joined by operations',13,'middle',muted); return svg(b);
      case 'algebra-notation':
        b+=txt(120,70,'3 × a',22)+txt(300,70,'3a',26); b+=`<path d="M165 65 H255" stroke="${accent}" stroke-width="2"/><path d="M250 59 l10 6 -10 6 z" fill="${accent}"/>`;
        b+=txt(120,145,'a × a × a',20)+txt(300,145,'a³',26); b+=`<path d="M175 140 H255" stroke="${accent}" stroke-width="2"/><path d="M250 134 l10 6 -10 6 z" fill="${accent}"/>`;
        b+=txt(210,210,'Write compactly, but preserve meaning.',12,'middle',muted); return svg(b);
      case 'like-terms':
        b+=`<rect x="45" y="48" width="140" height="56" rx="8" fill="#eef9fc" stroke="${accent}"/>`+txt(115,82,'4x²  +  5x²',19);
        b+=`<rect x="235" y="48" width="140" height="56" rx="8" fill="#f7f2e8" stroke="${warm}"/>`+txt(305,82,'3x  −  8x',19);
        b+=txt(115,145,'same variable part',11,'middle',muted)+txt(305,145,'same variable part',11,'middle',muted);
        b+=txt(210,205,'x and x² are not like terms.',14); return svg(b);
      case 'distributive':
        b+=txt(80,62,'3(x + 4)',24,'start'); b+=line(130,72,90,130,'stroke-width="1.6"')+line(130,72,218,130,'stroke-width="1.6"'); b+=txt(82,154,'3x',23)+txt(220,154,'12',23); b+=txt(210,208,'Every term inside the bracket is multiplied.',12,'middle',muted); return svg(b);
      case 'expression-machine':
      case 'formula-machine':
      case 'substitution':
        b+=`<rect x="54" y="95" width="92" height="56" rx="10" fill="#fff" stroke="${ink}"/>`+txt(100,128,type==='substitution'?'x = −3':'input',15);
        b+=`<path d="M146 123 H194" stroke="${accent}" stroke-width="2"/><path d="M188 117 l10 6 -10 6 z" fill="${accent}"/>`;
        b+=`<rect x="198" y="78" width="114" height="90" rx="10" fill="#eef9fc" stroke="${accent}"/>`+txt(255,115,type==='formula-machine'?'A = lw':'2x + 5',18)+txt(255,140,type==='substitution'?'replace x':'rule',11,'middle',muted);
        b+=`<path d="M312 123 H354" stroke="${accent}" stroke-width="2"/><path d="M348 117 l10 6 -10 6 z" fill="${accent}"/>`+txt(375,128,'output',13); return svg(b);
      case 'balance':
        b+=line(210,70,210,185,'stroke-width="3"')+line(115,105,305,105,'stroke-width="3"'); b+=line(140,105,120,160)+line(280,105,300,160);
        b+=`<rect x="75" y="160" width="90" height="22" fill="#eef9fc" stroke="${accent}"/>`+txt(120,176,'x + 4',14);
        b+=`<rect x="255" y="160" width="90" height="22" fill="#f7f2e8" stroke="${warm}"/>`+txt(300,176,'11',14);
        b+=txt(210,220,'Do the same operation to both sides.',12,'middle',muted); return svg(b);
      case 'fraction-equivalence':
        b+=`<rect x="45" y="58" width="165" height="36" fill="#dff5fb"/><rect x="45" y="58" width="330" height="36" fill="none" stroke="${ink}"/>`; for(let i=1;i<4;i++)b+=line(45+i*82.5,58,45+i*82.5,94,'stroke-width="1"');
        b+=txt(210,120,'2/4 = 1/2',22); b+=txt(210,190,'Multiply or divide top and bottom by the same non-zero number.',11,'middle',muted); return svg(b);
      case 'fraction-bar':
      case 'fraction-amount':
        for(let i=0;i<8;i++) b+=`<rect x="50" y="88" width="40" height="54" fill="${i<3?'#dff5fb':'#fff'}" stroke="${ink}"/>`.replace('x="50"',`x="${50+i*40}"`);
        b+=txt(210,170,type==='fraction-amount'?'3/8 of the whole':'part ÷ whole',21); return svg(b);
      case 'mixed-fraction':
        b+=`<circle cx="110" cy="110" r="44" fill="#dff5fb" stroke="${ink}"/><circle cx="220" cy="110" r="44" fill="#dff5fb" stroke="${ink}"/><circle cx="330" cy="110" r="44" fill="#fff" stroke="${ink}"/>`;
        b+=`<path d="M330 110 L330 66 A44 44 0 0 1 368 88 Z" fill="#dff5fb" stroke="${ink}"/>`; b+=txt(210,190,'2 1/4 = 9/4',23); return svg(b);
      case 'fraction-add':
        b+=txt(210,55,'1/3  +  1/4',25); b+=txt(210,100,'↓ common denominator 12 ↓',12,'middle',muted); b+=txt(210,150,'4/12  +  3/12  =  7/12',24); return svg(b);
      case 'fraction-multiply':
        b+=`<rect x="88" y="58" width="244" height="140" fill="#fff" stroke="${ink}"/>`; for(let i=1;i<4;i++)b+=line(88+i*61,58,88+i*61,198,'stroke-width="1"'); for(let j=1;j<3;j++)b+=line(88,58+j*46.67,332,58+j*46.67,'stroke-width="1"');
        b+=`<rect x="88" y="58" width="122" height="140" fill="rgba(0,167,212,.20)"/><rect x="88" y="58" width="244" height="93" fill="rgba(215,201,174,.32)"/>`; b+=txt(210,224,'Area model: 1/2 × 2/3 = 1/3',12); return svg(b);
      case 'decimal-placevalue':
      case 'powers-ten':
        ['100','10','1','0.1','0.01','0.001'].forEach((v,i)=>{b+=`<rect x="34" y="80" width="58" height="52" fill="${i===2?'#eef9fc':'#fff'}" stroke="${i===2?accent:'#cfc9be'}"/>`.replace('x="34"',`x="${34+i*58}"`)+txt(63+i*58,111,v,12)});
        b+=`<path d="M100 165 H320" stroke="${accent}" stroke-width="2"/><path d="M314 159 l10 6 -10 6 z" fill="${accent}"/>`+txt(210,190,type==='powers-ten'?'×10 shifts place value one column left':'align decimal points',13); return svg(b);
      case 'decimal-area':
        b+=`<rect x="80" y="65" width="260" height="125" fill="#eef9fc" stroke="${ink}"/>`+txt(210,55,'3.2',14)+txt(60,130,'1.5',14); for(let x=132;x<340;x+=52)b+=line(x,65,x,190,'stroke="#d0d5d8" stroke-width="1"'); for(let y=107;y<190;y+=42)b+=line(80,y,340,y,'stroke="#d0d5d8" stroke-width="1"'); b+=txt(210,220,'Area model supports decimal multiplication.',11,'middle',muted); return svg(b);
      case 'percent-grid':
      case 'percent-change':
      case 'percent-compare':
        for(let r=0;r<10;r++)for(let c=0;c<10;c++){const k=r*10+c;b+=`<rect x="72" y="32" width="24" height="18" fill="${k<37?'#dff5fb':'#fff'}" stroke="#d8d3ca" stroke-width=".7"/>`.replace('x="72"',`x="${72+c*24}"`).replace('y="32"',`y="${32+r*18}"`)}
        b+=txt(210,230,type==='percent-change'?'new amount = original × multiplier':'37% = 37/100 = 0.37',12); return svg(b);
      case 'fdp':
        b+=`<path d="M210 45 L80 200 H340 Z" fill="none" stroke="${ink}" stroke-width="2"/>`+txt(210,85,'fraction',16)+txt(125,185,'decimal',16)+txt(295,185,'percentage',16)+txt(210,226,'Convert through ÷, ×100, or equivalent fractions.',11,'middle',muted); return svg(b);
      case 'fdp-order':
        b+=line(48,135,370,135); [0,0.25,0.5,0.75,1].forEach((v,i)=>{const x=48+i*80.5;b+=line(x,128,x,142)+txt(x,160,v,10)}); b+=dot(145,135)+txt(145,105,'3/10',12)+dot(257,135,warm)+txt(257,105,'65%',12)+dot(306,135,4,'#5a5d61')+txt(306,185,'0.8',12); return svg(b);
      case 'shapes':
        b+=`<polygon points="50,180 115,70 180,180" fill="#eef9fc" stroke="${ink}" stroke-width="2"/>`+txt(115,210,'triangle',11);
        b+=`<rect x="205" y="82" width="86" height="86" fill="#fff" stroke="${ink}" stroke-width="2"/>`+txt(248,210,'square',11);
        b+=`<polygon points="320,95 378,95 400,168 298,168" fill="#f7f2e8" stroke="${ink}" stroke-width="2"/>`+txt(350,210,'trapezium',11); return svg(b);
      case 'line-symmetry':
        b+=`<path d="M210 48 C145 70 125 130 150 190 C175 170 192 140 210 110 C228 140 245 170 270 190 C295 130 275 70 210 48 Z" fill="#eef9fc" stroke="${ink}" stroke-width="2"/>`; b+=line(210,34,210,210,'stroke-dasharray="6 5" stroke="#00a7d4"'); b+=txt(210,230,'mirror line',11,'middle',muted); return svg(b);
      case 'rotational-symmetry':
        b+=`<polygon points="210,48 242,102 305,98 260,143 276,204 210,170 144,204 160,143 115,98 178,102" fill="#eef9fc" stroke="${ink}" stroke-width="2"/>`; b+=`<path d="M315 125 A105 105 0 0 1 210 230" fill="none" stroke="${accent}" stroke-width="3"/><path d="M210 230 l10 -8 -2 13 z" fill="${accent}"/>`; return svg(b);
      case 'angle-types':
        [[70,150,0,35,'acute'],[210,150,0,90,'right'],[350,150,0,130,'obtuse']].forEach(([cx,cy,a1,a2,label])=>{b+=line(cx,cy,cx+62,cy)+line(cx,cy,cx+62*Math.cos(-a2*Math.PI/180),cy+62*Math.sin(-a2*Math.PI/180))+arc(cx,cy,28,360-a2,360,accent,2)+txt(cx,215,label,11)}); return svg(b);
      case 'protractor':
        b+=`<path d="M70 180 A140 140 0 0 1 350 180" fill="none" stroke="${ink}" stroke-width="2"/>`+line(70,180,350,180); for(let a=0;a<=180;a+=10){const r1=140,r2=a%30===0?128:134;const rad=(180+a)*Math.PI/180;const x1=210+r1*Math.cos(rad),y1=180+r1*Math.sin(rad),x2=210+r2*Math.cos(rad),y2=180+r2*Math.sin(rad);b+=line(x1,y1,x2,y2,'stroke-width="1"');} b+=line(210,180,309,81,'stroke="#00a7d4" stroke-width="3"')+dot(210,180,4,ink)+txt(285,128,'45°',14); return svg(b);
      case 'line-point-angles':
        b+=line(50,160,370,160); b+=line(210,160,310,65); b+=arc(210,160,42,316,360,accent,3)+arc(210,160,42,180,316,warm,3); b+=txt(264,143,'x',16)+txt(168,123,'180°−x',13); b+=txt(210,215,'Angles on a straight line total 180°.',11,'middle',muted); return svg(b);
      case 'triangle-angles':
        b+=`<polygon points="80,195 210,55 350,195" fill="#fff" stroke="${ink}" stroke-width="2"/>`; b+=arc(80,195,28,310,360,accent,2)+arc(350,195,28,180,230,accent,2)+arc(210,55,31,53,127,warm,2); b+=txt(210,226,'a + b + c = 180°',16); return svg(b);
      case 'quadrilateral-angles':
        b+=`<polygon points="75,175 130,58 310,72 350,190" fill="#fff" stroke="${ink}" stroke-width="2"/>`; b+=txt(210,226,'Interior angles total 360°',15); ['a','b','c','d'].forEach((t,i)=>{const pts=[[95,157],[145,87],[292,100],[328,171]];b+=txt(pts[i][0],pts[i][1],t,15)}); return svg(b);
      case 'parallel-lines':
        b+=line(55,75,365,75,'stroke-width="3"')+line(55,185,365,185,'stroke-width="3"')+line(115,225,300,35,'stroke-width="3"');
        b+=`<path d="M325 68 l10 7 -10 7" fill="none" stroke="${accent}" stroke-width="2"/><path d="M325 178 l10 7 -10 7" fill="none" stroke="${accent}" stroke-width="2"/>`;
        b+=arc(261,75,27,180,225,accent,3)+arc(154,185,27,0,45,accent,3)+txt(244,57,'x',14)+txt(171,213,'x',14); b+=txt(210,238,'Alternate angles are equal when lines are parallel.',11,'middle',muted); return svg(b);
      case 'sequence':
        [60,135,210,285,360].forEach((x,i)=>{b+=`<circle cx="${x}" cy="125" r="25" fill="${i%2?'#fff':'#eef9fc'}" stroke="${ink}"/>`+txt(x,131,3+4*i,15); if(i<4)b+=txt(x+37,100,'+4',11,'middle',accent)}); return svg(b);
      case 'nth-term':
        b+=txt(70,75,'n',15)+txt(155,75,'1',15)+txt(225,75,'2',15)+txt(295,75,'3',15)+txt(365,75,'4',15); b+=line(55,92,380,92); b+=txt(70,130,'term',13)+txt(155,130,'5',15)+txt(225,130,'8',15)+txt(295,130,'11',15)+txt(365,130,'14',15); b+=txt(210,190,'3n + 2',26)+txt(210,220,'constant difference → linear nth term',11,'middle',muted); return svg(b);
      case 'metric':
        ['km','m','cm','mm'].forEach((u,i)=>{const x=55+i*100;b+=`<rect x="${x}" y="85" width="70" height="52" rx="8" fill="${i===1?'#eef9fc':'#fff'}" stroke="${ink}"/>`+txt(x+35,116,u,16); if(i<3)b+=txt(x+85,112,i===0?'×1000':'×100',10,'middle',accent)}); b+=txt(210,192,'Convert by place value, not by guessing zeroes.',11,'middle',muted); return svg(b);
      case 'area-units':
        b+=`<rect x="90" y="58" width="95" height="95" fill="#eef9fc" stroke="${ink}"/><rect x="240" y="58" width="95" height="95" fill="#fff" stroke="${ink}"/>`+txt(137,177,'1 m × 1 m',11)+txt(287,177,'100 cm × 100 cm',11)+txt(210,220,'1 m² = 10,000 cm²',18); return svg(b);
      case 'area-shapes':
        b+=`<rect x="45" y="80" width="90" height="90" fill="#eef9fc" stroke="${ink}"/>`+txt(90,195,'A = lw',12);
        b+=`<polygon points="165,170 225,70 285,170" fill="#fff" stroke="${ink}"/>`+txt(225,195,'A = ½bh',12);
        b+=`<polygon points="315,80 380,80 400,170 290,170" fill="#f7f2e8" stroke="${ink}"/>`+txt(345,195,'A = ½(a+b)h',11); return svg(b);
      case 'compound-shape':
        b+=`<path d="M70 60 H330 V115 H240 V195 H70 Z" fill="#eef9fc" stroke="${ink}" stroke-width="2"/>`; b+=line(240,115,240,195,'stroke-dasharray="5 4"')+line(70,115,330,115,'stroke-dasharray="5 4"'); b+=txt(210,224,'Split into familiar shapes, then add/subtract areas.',11,'middle',muted); return svg(b);
      case 'solids':
        b+=`<ellipse cx="105" cy="80" rx="45" ry="18" fill="#eef9fc" stroke="${ink}"/><path d="M60 80 V170 M150 80 V170" stroke="${ink}" stroke-width="2"/><ellipse cx="105" cy="170" rx="45" ry="18" fill="#fff" stroke="${ink}"/>`+txt(105,215,'cylinder',11);
        b+=`<polygon points="245,70 330,70 370,110 285,110" fill="#fff" stroke="${ink}"/><polygon points="245,70 285,110 285,190 245,150" fill="#eef9fc" stroke="${ink}"/><polygon points="285,110 370,110 370,190 285,190" fill="#f7f2e8" stroke="${ink}"/>`+txt(310,215,'cuboid',11); return svg(b);
      case 'cuboid':
        b+=`<polygon points="95,90 275,90 335,125 155,125" fill="#fff" stroke="${ink}"/><polygon points="95,90 155,125 155,200 95,165" fill="#eef9fc" stroke="${ink}"/><polygon points="155,125 335,125 335,200 155,200" fill="#f7f2e8" stroke="${ink}"/>`; b+=txt(245,220,'V = lwh',18)+txt(215,78,'length',10,'middle',muted); return svg(b);
      case 'cuboid-net':
        [[150,65],[150,105],[150,145],[150,185],[110,105],[190,105]].forEach(([x,y],i)=>b+=`<rect x="${x}" y="${y}" width="40" height="40" fill="${i%2?'#fff':'#eef9fc'}" stroke="${ink}"/>`); b+=txt(300,125,'surface area',18)+txt(300,150,'= sum of 6 faces',12,'middle',muted); return svg(b);
      case 'ratio-bar':
      case 'ratio-share':
        [0,1,2,3,4].forEach(i=>b+=`<rect x="${65+i*58}" y="92" width="58" height="48" fill="${i<2?'#dff5fb':'#f7f2e8'}" stroke="${ink}"/>`); b+=txt(123,72,'2 parts',12)+txt(268,72,'3 parts',12)+txt(210,185,type==='ratio-share'?'Find one part, then allocate.':'2 : 3',19); return svg(b);
      case 'unitary':
      case 'direct-proportion':
        b+=`<rect x="55" y="60" width="120" height="50" fill="#fff" stroke="${ink}"/>`+txt(115,90,'4 notebooks',15); b+=`<rect x="245" y="60" width="120" height="50" fill="#eef9fc" stroke="${accent}"/>`+txt(305,90,'£10',15); b+=txt(210,140,'÷4',12,'middle',accent); b+=line(115,118,115,168)+line(305,118,305,168); b+=`<rect x="55" y="170" width="120" height="42" fill="#fff" stroke="${ink}"/>`+txt(115,196,'1 notebook',14); b+=`<rect x="245" y="170" width="120" height="42" fill="#fff" stroke="${ink}"/>`+txt(305,196,'£2.50',14); return svg(b);
      case 'data-types':
        b+=txt(210,45,'DATA',18); b+=line(210,55,125,105)+line(210,55,295,105); b+=txt(125,125,'categorical',15)+txt(295,125,'numerical',15); b+=line(295,135,255,180)+line(295,135,340,180)+txt(255,202,'discrete',13)+txt(340,202,'continuous',13); return svg(b);
      case 'sampling':
        for(let i=0;i<30;i++){const x=45+(i%10)*34,y=55+Math.floor(i/10)*44;b+=dot(x,y,5,i%4===0?accent:'#c6c2b9')}; b+=`<rect x="42" y="49" width="116" height="98" fill="none" stroke="${accent}" stroke-width="2" stroke-dasharray="5 4"/>`; b+=txt(210,212,'A sample should represent the population.',12,'middle',muted); return svg(b);
      case 'charts':
        b+=line(45,180,175,180)+line(45,65,45,180); [60,90,120,150].forEach((h,i)=>b+=`<rect x="${62+i*26}" y="${180-h}" width="16" height="${h}" fill="${i%2?warm:accent}" opacity=".7"/>`); b+=txt(108,215,'bar chart',11);
        b+=`<circle cx="305" cy="125" r="60" fill="#fff" stroke="${ink}"/><path d="M305 125 L305 65 A60 60 0 0 1 357 155 Z" fill="#dff5fb" stroke="${ink}"/>`+txt(305,215,'pie chart',11); return svg(b);
      case 'averages':
        b+=txt(210,54,'4, 7, 7, 9, 13',23); b+=txt(80,115,'mean',12,'middle',muted)+txt(80,145,'8',22); b+=txt(180,115,'median',12,'middle',muted)+txt(180,145,'7',22); b+=txt(280,115,'mode',12,'middle',muted)+txt(280,145,'7',22); b+=txt(360,115,'range',12,'middle',muted)+txt(360,145,'9',22); return svg(b);
      case 'frequency-table':
        b+=`<rect x="85" y="48" width="250" height="154" fill="#fff" stroke="${ink}"/>`; [0,1,2,3,4].forEach(i=>b+=line(85,48+i*30.8,335,48+i*30.8,'stroke-width="1"')); b+=line(210,48,210,202,'stroke-width="1"'); b+=txt(147,70,'value',12)+txt(272,70,'frequency',12); [[1,2],[2,4],[3,7],[4,3]].forEach((r,i)=>{b+=txt(147,100+i*31,r[0],13)+txt(272,100+i*31,r[1],13)}); return svg(b);
      case 'probability-scale':
        b+=line(55,130,365,130,'stroke-width="3"'); [0,.25,.5,.75,1].forEach((v,i)=>{const x=55+i*77.5;b+=line(x,120,x,140)+txt(x,160,v,11)}); b+=txt(55,92,'impossible',11)+txt(210,92,'even chance',11)+txt(365,92,'certain',11); return svg(b);
      case 'spinner':
        b+=`<circle cx="210" cy="125" r="82" fill="#fff" stroke="${ink}" stroke-width="2"/>`; for(let a=0;a<360;a+=60)b+=line(210,125,210+82*Math.cos(a*Math.PI/180),125+82*Math.sin(a*Math.PI/180),'stroke-width="1"'); b+=`<path d="M210 125 L210 43 A82 82 0 0 1 281 84 Z" fill="#dff5fb"/>`; b+=txt(210,228,'6 equally likely sectors',12,'middle',muted); return svg(b);
      case 'mutually-exclusive':
        b+=`<circle cx="150" cy="125" r="62" fill="#eef9fc" stroke="${accent}"/><circle cx="285" cy="125" r="62" fill="#f7f2e8" stroke="${warm}"/>`; b+=txt(150,130,'A',24)+txt(285,130,'B',24)+txt(210,220,'Mutually exclusive → no overlap.',12,'middle',muted); return svg(b);
      case 'relative-frequency':
        b+=line(55,190,365,190)+line(55,45,55,190); const pts=[[55,70],[95,135],[135,105],[175,120],[215,110],[255,115],[295,112],[335,114],[365,113]]; b+=`<polyline points="${pts.map(p=>p.join(',')).join(' ')}" fill="none" stroke="${accent}" stroke-width="3"/>`; pts.forEach(p=>b+=dot(p[0],p[1],3,accent)); b+=txt(210,224,'More trials → experimental probability often stabilises.',11,'middle',muted); return svg(b);
      case 'coordinate-plane':{
        const a=axes();b+=a.s; [[-3,2],[2,3],[4,-2],[-2,-3]].forEach(([x,y],i)=>{const px=a.x0+x*a.sx,py=a.y0-y*a.sy;b+=dot(px,py)+txt(px+10,py-8,String.fromCharCode(65+i),11,'start')}); return svg(b);}
      case 'coordinate-shape':{
        const a=axes();b+=a.s; const pts=[[-3,-2],[2,-2],[2,2],[-3,2]]; b+=`<polygon points="${pts.map(([x,y])=>`${a.x0+x*a.sx},${a.y0-y*a.sy}`).join(' ')}" fill="rgba(0,167,212,.10)" stroke="${accent}" stroke-width="2"/>`; pts.forEach(([x,y],i)=>{const px=a.x0+x*a.sx,py=a.y0-y*a.sy;b+=dot(px,py,3,ink)+txt(px+8,py-7,String.fromCharCode(65+i),10,'start')}); return svg(b);}
      case 'axis-lines':{
        const a=axes();b+=a.s; b+=line(a.x0+2*a.sx,35,a.x0+2*a.sx,215,'stroke="#00a7d4" stroke-width="3"')+txt(a.x0+2*a.sx+8,50,'x = 2',11,'start',accent); b+=line(80,a.y0-2*a.sy,340,a.y0-2*a.sy,'stroke="#d0b37d" stroke-width="3"')+txt(330,a.y0-2*a.sy-7,'y = 2',11,'end','#9a7d47');return svg(b);}
      case 'straight-line':{
        const a=axes();b+=a.s; const p1=[a.x0-2.5*a.sx,a.y0-(-4)*a.sy],p2=[a.x0+1.5*a.sx,a.y0-4*a.sy]; b+=line(p1[0],p1[1],p2[0],p2[1],'stroke="#00a7d4" stroke-width="3"'); b+=txt(300,55,'y = 2x + 1',13,'start',accent); return svg(b);}
      case 'real-life-graph':
        b+=line(55,195,365,195)+line(55,195,55,40); b+=txt(212,225,'time',11)+txt(24,118,'distance',11,'middle',muted); b+=`<polyline points="55,195 135,120 205,120 310,58 350,58" fill="none" stroke="${accent}" stroke-width="3"/>`; b+=txt(172,108,'stopped',10,'middle',muted)+txt(330,49,'stopped',10,'middle',muted); return svg(b);
      case 'inequality':
        b+=line(50,130,370,130); for(let n=-4;n<=4;n++){const x=210+n*35;b+=line(x,123,x,137)+txt(x,158,n,9)} b+=`<circle cx="245" cy="130" r="7" fill="${paper}" stroke="${accent}" stroke-width="3"/><path d="M245 130 H350" stroke="${accent}" stroke-width="4"/><path d="M350 130 l-12 -7 v14 z" fill="${accent}"/>`; b+=txt(210,205,'x > 1',21); return svg(b);
      case 'compass':
        b+=`<path d="M180 52 L120 190 M180 52 L285 190" stroke="${ink}" stroke-width="3"/>`+dot(120,190,4,ink)+`<path d="M180 52 q20 50 0 100" fill="none" stroke="${accent}" stroke-width="2"/>`+txt(210,224,'Straightedge + compass = exact construction',11,'middle',muted); return svg(b);
      case 'parallel-perp':
        b+=line(55,82,365,82,'stroke-width="3"')+line(55,172,365,172,'stroke-width="3"')+line(210,40,210,215,'stroke-width="3"'); b+=`<rect x="210" y="82" width="18" height="18" fill="none" stroke="${accent}" stroke-width="2"/>`+txt(345,64,'parallel',11)+txt(235,210,'perpendicular',11); return svg(b);
      case 'perpendicular-bisector':{
        const ax=90,bx=330,y=145,m=210,r=150; const h=Math.sqrt(r*r-120*120); const iy1=y-h,iy2=y+h;
        b+=line(ax,y,bx,y,'stroke-width="3"')+txt(ax,y+24,'A',12)+txt(bx,y+24,'B',12)+dot(m,y,4,accent)+txt(m,y+24,'M',12);
        b+=`<circle cx="${ax}" cy="${y}" r="${r}" fill="none" stroke="#c8c4bb" stroke-width="1.4" stroke-dasharray="6 5"/><circle cx="${bx}" cy="${y}" r="${r}" fill="none" stroke="#c8c4bb" stroke-width="1.4" stroke-dasharray="6 5"/>`;
        b+=line(m,18,m,232,'stroke="#00a7d4" stroke-width="2.6"')+dot(m,iy1,4,accent)+dot(m,iy2,4,accent); b+=`<rect x="210" y="127" width="18" height="18" fill="none" stroke="${accent}"/>`; return svg(b);}
      case 'angle-bisector':{
        const ox=90,oy=190; b+=line(ox,oy,350,190,'stroke-width="3"')+line(ox,oy,280,55,'stroke-width="3"'); const r=105; const a=-35.4; b+=arc(ox,oy,r,324.6,360,accent,2); const p1=[ox+r,oy],p2=[ox+r*Math.cos(a*Math.PI/180),oy+r*Math.sin(a*Math.PI/180)]; b+=dot(p1[0],p1[1],4,ink)+dot(p2[0],p2[1],4,ink); const bis=-17.7;b+=line(ox,oy,ox+250*Math.cos(bis*Math.PI/180),oy+250*Math.sin(bis*Math.PI/180),'stroke="#00a7d4" stroke-width="2.6" stroke-dasharray="6 4"'); b+=txt(245,150,'equal angles',12,'middle',muted); return svg(b);}
      default:
        b+=`<circle cx="210" cy="125" r="74" fill="#eef9fc" stroke="${accent}"/><circle cx="210" cy="125" r="50" fill="${paper}" stroke="${ink}"/>`+txt(210,121,'NES',24)+txt(210,145,'MATHEMATICS',9,'middle',muted); return svg(b);
    }
  }
  window.NES_DIAGRAMS={render};
})();
