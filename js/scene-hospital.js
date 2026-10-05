/* The hospital scene: Frank wakes up in close-up, finds he is cuffed to the bed, and breaks free. Uses the art when it has loaded, with a code-drawn fallback. */
var HOSP_TAP=.034,HOSP_DECAY=.1;
function hphase(n){HS.ph=n;HS.t0=S.clock}
function startHosp(){HS.out=false;S.mode='hosp';S.v=0;S.last=null;HS.p=0;HS.pullL=0;HS.pullR=0;HS.brokeL=false;HS.brokeR=false;HS.k=0;HS.white=1;HS.beat=0;HS.shake=0;HS.time=0;HS.say='';HS.clank=0;
  startHospMusic();hint.hidden=true;padsOn(false);lvl.innerHTML='RUSHVILLE GENERAL<br>LEVEL 1-3';barlab.textContent='CUFFS';track.style.width='0%';hphase('wake')}
function beep(){if(!audio())return;try{tone(ac.currentTime,990,.09,'sine',.05)}catch(e){}}
function clank(v){if(!audio())return;try{var t=ac.currentTime,r=.9+Math.random()*.25;noise(t,.05,v,'highpass',3200,.7);tone(t,1750*r,.09,'triangle',v*.7);tone(t+.02,2600*r,.06,'triangle',v*.4)}catch(e){}}
function snap(){if(!audio())return;try{var t=ac.currentTime;noise(t,.12,.3,'highpass',2400,.7);tone(t,2100,.25,'triangle',.2,0,sfxG,700);tone(t,160,.2,'sine',.3,0,sfxG,50)}catch(e){}}
function hospTap(side){if(HS.ph!=='break')return;hint.hidden=true;var pe=side==='L'?padL:padR;
  if(S.last===side){pe.classList.add('miss');setTimeout(function(){pe.classList.remove('miss')},120);return}
  S.last=side;padL.classList.toggle('next',side==='R');padR.classList.toggle('next',side==='L');
  if(side==='L')HS.pullL=1;else HS.pullR=1;HS.p=Math.min(1,HS.p+HOSP_TAP);HS.shake=Math.max(HS.shake,.35);clank(.1);S.score+=20;scoreEl.textContent=pad6(S.score);
  if(!HS.brokeL&&HS.p>=.5){HS.brokeL=true;snap();HS.shake=1;HS.flash=1;HS.say='SNAP!';HS.sayT=S.clock}
  if(!HS.brokeR&&HS.p>=1){HS.brokeR=true;snap();HS.shake=1;HS.flash=1;HS.say='SNAP!';HS.sayT=S.clock;hphase('free');padsOn(false);
    var bonus=Math.max(0,Math.round((30-HS.time)*100));S.score+=bonus;scoreEl.textContent=pad6(S.score);S.stat+='<br>BROKE FREE IN '+HS.time.toFixed(1)+'s'}}
function hospUpdate(dt){var tt=S.clock-HS.t0;
  if(!HS.out)HS.white=Math.max(0,HS.white-dt*.45);HS.shake=Math.max(0,HS.shake-dt*4);HS.flash=Math.max(0,(HS.flash||0)-dt*4);HS.pullL=Math.max(0,HS.pullL-dt*6);HS.pullR=Math.max(0,HS.pullR-dt*6);
  var hr=HS.ph==='wake'?58:HS.ph==='free'?150:72+HS.p*70+(HS.ph==='cuff'?25:0);HS.hr=hr;HS.beat+=dt*hr/60;if(HS.beat>=1){HS.beat-=1;beep()}
  if(HS.ph==='wake'){if(tt>6.2)hphase('look')}
  else if(HS.ph==='look'){if(tt>2.8)hphase('cuff')}
  else if(HS.ph==='cuff'){HS.k=Math.min(1,HS.k+dt*1.1);
    if(tt>1.1&&HS.clank<1){HS.clank=1;HS.pullL=1;HS.pullR=1;clank(.2);HS.shake=.5}
    if(tt>1.9&&HS.clank<2){HS.clank=2;HS.pullL=1;HS.pullR=1;clank(.25);HS.shake=.7;HS.say='!';HS.sayT=S.clock}
    if(tt>3.6){hphase('break');padsOn(true);S.last=null;hint.textContent='MASH L, R AS FAST AS YOU CAN!\nBREAK THE CUFFS';hint.hidden=false}}
  else if(HS.ph==='break'){HS.time+=dt;var floor=HS.brokeL?.5:0;HS.p=Math.max(floor,HS.p-HOSP_DECAY*dt);track.style.width=(HS.p*100).toFixed(1)+'%'}
  else if(HS.ph==='free'){track.style.width='100%';if(tt>2.6){HS.out=true;HS.white=Math.min(1,HS.white+dt*1.1);if(HS.white>=1){HS.ph='';startHall()}}}
  /* waking up: the picture starts blown-out and blurred and clears as he comes round */
  var blur=0,bright=1;if(HS.ph==='wake'){var u=Math.max(0,Math.min(1,(tt-2.4)/3.4));blur=12*(1-u*u*(3-2*u));bright=1+1.3*(1-Math.min(1,tt/5))}
  var f=blur>.3||bright>1.02?'blur('+blur.toFixed(1)+'px) brightness('+bright.toFixed(2)+')':'';if(cv.style.filter!==f)cv.style.filter=f;
  var on=Math.ceil(HS.p*6-.001);for(var i=0;i<6;i++)segs[i].className=i<on?'on':''}

var hfImg=load('hosp_faces.webp'),hwImg=load('hosp_wide.webp'),HFW=421,HFH=720,HWW=656,HWH=728,HWY0=120,HWY1=524;
/* The art version: five close-up face panels (asleep, groggy, confused, alarmed, straining)
   and three wide shots of the bed (both wrists cuffed, left free, both free). */
function drawHospArt(){var t=S.clock,tt=t-HS.t0,ph=HS.ph,cx=W/2,sh=HS.shake,i;
  g.setTransform(2,0,0,2,sh?(Math.random()-.5)*8*sh:0,sh?(Math.random()-.5)*6*sh:0);R(-8,-8,W+16,H+16,'#141d36');
  /* a face panel: the middle band of the tall panel fills the screen height, and its pillow edges are stretched to fill the sides */
  function closeup(f,zoom,dx){var s=H*1.55*(zoom||1)/HFH,dw=HFW*s,dh=HFH*s,x=Math.round(cx-dw/2+(dx||0)),y=Math.round(H/2-dh*.47);
    g.drawImage(hfImg,f*HFW+4,0,5,HFH,-8,y,x+9,dh);g.drawImage(hfImg,f*HFW+HFW-9,0,5,HFH,x+dw-1,y,W-x-dw+9,dh);g.drawImage(hfImg,f*HFW,0,HFW,HFH,x,y,dw,dh)}
  /* a wide shot: the band from above his raised fists down to the cuffs, over a dimmed, stretched copy that fills the sides */
  var wsH=HWY1-HWY0,wz=1,ws=H/wsH;
  function wide(n,zoom){wz=zoom||1;var s=ws*wz,dw=HWW*s,dh=wsH*s,x=Math.round(cx-dw/2),y=Math.round(H/2-dh/2);
    if(dw<W){g.drawImage(hwImg,n*HWW,HWY0,HWW,wsH,-8,y,W+16,dh);R(-8,-8,W+16,H+16,'rgba(10,14,32,.62)')}
    g.drawImage(hwImg,n*HWW,HWY0,HWW,wsH,x,y,dw,dh);
    if(dw<W){var e=g.createLinearGradient(x,0,x+10,0);e.addColorStop(0,'rgba(10,14,32,.75)');e.addColorStop(1,'rgba(10,14,32,0)');g.fillStyle=e;g.fillRect(x,0,10,H);
      e=g.createLinearGradient(x+dw,0,x+dw-10,0);e.addColorStop(0,'rgba(10,14,32,.75)');e.addColorStop(1,'rgba(10,14,32,0)');g.fillStyle=e;g.fillRect(x+dw-10,0,10,H)}}
  function wpt(px,py){var s=ws*wz;return[cx+(px-HWW/2)*s,H/2+(py-HWY0-wsH/2)*s]}
  var shot=-1,pulse=1+.012*Math.max(HS.pullL,HS.pullR);
  if(ph==='wake')closeup(tt<1.6?0:tt<3.8?(Math.sin((tt-1.6)*5)>.2?1:0):1,1+.03*Math.sin(t*.8));
  else if(ph==='look')closeup(2,1,Math.sin(tt*2.6)*3);
  else if(ph==='cuff'){
    if(tt<1){var u=tt*tt*(3-2*tt);shot=0;wide(0,1+.4*(1-u));g.globalAlpha=1-u;closeup(2,1+.2*u);g.globalAlpha=1}
    else if(tt<2.3){shot=0;wide(0,pulse)}
    else closeup(3,1+.04*Math.min(1,(tt-2.3)*4))}
  else if(ph==='break'){shot=HS.brokeL?1:0;wide(shot,pulse)}
  else{shot=2;wide(2,1+.015*Math.sin(t*7))}
  /* sparks at whichever cuff is being yanked */
  if(shot===0||shot===1)[[-1,121,466],[1,496,470]].forEach(function(c){if(c[0]<0&&shot===1)return;var pull=c[0]<0?HS.pullL:HS.pullR,pt=wpt(c[1],c[2]);
    if(pull>.35)for(i=0;i<6;i++){var a=i*1.05+t*20,r=5+pull*10;R(pt[0]+Math.cos(a)*r,pt[1]+Math.sin(a)*r*.7,i%2?3:2,1,i%2?'#fff7c2':'#ffffff')}});
  if(HS.say&&t-HS.sayT<1){if(HS.say==='!')bubble(cx+40,18,'!',false);else burst(HS.say,cx+(HS.brokeR?70:-70),H*.3,12,'#ffd27a',HS.sayT)}
  if(ph==='look'&&tt>.8)bubble(cx+52,14,'?',false);
  g.setTransform(2,0,0,2,0,0);
  var cap=ph==='wake'?(tt>1?['beep...','beep...  beep...','beep...  beep...  beep...'][Math.min(2,((tt-1)/1.6)|0)]:''):ph==='look'?'WHERE AM I?':ph==='cuff'&&tt>2.3?'CUFFED TO THE BED!?':'';
  if(cap){R(0,H-34,W,22,'rgba(12,14,24,.72)');g.font='8px "Press Start 2P", monospace';g.textAlign='center';g.textBaseline='top';g.fillStyle='#ffffff';g.fillText(cap,W/2,H-27)}
  var vg=g.createRadialGradient(W/2,H/2,H*.45,W/2,H/2,W*.7);vg.addColorStop(0,'rgba(5,10,25,0)');vg.addColorStop(1,'rgba(5,10,25,.45)');g.fillStyle=vg;g.fillRect(0,0,W,H);
  if(HS.flash>0)R(0,0,W,H,'rgba(255,255,255,'+(HS.flash*.5).toFixed(2)+')');
  if(HS.white>0)R(0,0,W,H,'rgba(255,255,255,'+HS.white.toFixed(2)+')')}

function drawHosp(){if(ok(hfImg)&&ok(hwImg)){drawHospArt();return}
var t=S.clock,tt=t-HS.t0,ph=HS.ph,cx=W/2,i,k=HS.k*HS.k*(3-2*HS.k),z=1.75-.75*k,fy=92,ty=(108+(fy-108)*k)-fy*z,sh=HS.shake;
  var free=ph==='free'||ph==='end',brk=ph==='break';
  g.setTransform(2,0,0,2,0,0);R(0,0,W,H,'#b7cdc8');
  g.setTransform(2*z,0,0,2*z,2*(cx-cx*z)+(sh?(Math.random()-.5)*8*sh:0),2*ty+(sh?(Math.random()-.5)*6*sh:0));
  function P(c){g.fillStyle=c;g.fill()}
  function ell(x,y,rx,ry,c,rot){g.beginPath();g.ellipse(x,y,rx,ry,rot||0,0,TAU);P(c)}
  function rr(x,y,w,h,r,c){g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath();P(c)}
  function line(pts,w,c){g.strokeStyle=c;g.lineWidth=w;g.lineCap='round';g.lineJoin='round';g.beginPath();g.moveTo(pts[0],pts[1]);for(var q=2;q<pts.length;q+=2)g.lineTo(pts[q],pts[q+1]);g.stroke()}
  var INK='#1c1a22',SKIN='#b98d5c',SKIN_D='#9a7044',SKIN_L='#cfa675',HAIR='#17120f',GOWN='#a9cfe0',GOWN_D='#84b0c6',STEEL='#cfd5df',STEEL_D='#7d8696';
  /* room */
  R(cx-320,0,640,150,'#b7cdc8');R(cx-320,118,640,34,'#a2bbb5');R(cx-320,116,640,2,'#8fa9a3');
  var gl=g.createRadialGradient(cx,-10,10,cx,-10,190);gl.addColorStop(0,'rgba(255,255,255,.75)');gl.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gl;g.fillRect(cx-200,0,400,170);
  rr(cx-212,18,74,78,2,'#e9eef0');R(cx-208,22,66,70,'#0d1430');for(i=0;i<9;i++)R(cx-208,24+i*8,66,4,'#c7d2d6');R(cx-176,22,2,70,'#e9eef0');
  /* drip stand */
  R(cx-118,6,2,150,STEEL_D);R(cx-128,6,22,2,STEEL_D);rr(cx-131,10,14,26,3,'rgba(214,236,244,.9)');R(cx-129,22,10,12,'rgba(150,200,220,.9)');
  g.strokeStyle='rgba(230,240,245,.9)';g.lineWidth=1;g.beginPath();g.moveTo(cx-124,36);g.quadraticCurveTo(cx-126,110,cx-86,150);g.stroke();
  /* heart monitor */
  R(cx+150,70,3,86,STEEL_D);rr(cx+118,20,74,54,4,'#2a2f3a');R(cx+123,25,64,38,'#07140f');
  g.strokeStyle='#49f08a';g.lineWidth=1.2;g.beginPath();for(i=0;i<=64;i++){var ph2=((i/64)*2.2+HS.beat+ (t*0))%1,yy=44;if(ph2>.42&&ph2<.46)yy=47;else if(ph2>=.46&&ph2<.5)yy=30;else if(ph2>=.5&&ph2<.54)yy=52;else if(ph2>.66&&ph2<.76)yy=42;i?g.lineTo(cx+123+i,yy):g.moveTo(cx+123+i,yy)}g.stroke();
  g.font='6px "Press Start 2P", monospace';g.textAlign='left';g.textBaseline='top';g.fillStyle='#49f08a';g.fillText('HR '+Math.round(HS.hr||60),cx+126,66-10+11);
  R(cx+178,28,5,5,HS.beat<.15?'#ff4a3d':'#5a1c18');
  /* bed */
  rr(cx-134,54,268,110,10,'#7d8d99');rr(cx-128,60,256,100,8,'#93a3ae');
  rr(cx-100,60,200,84,16,'#cfd8de');rr(cx-98,58,196,82,16,'#f1f4f6');g.strokeStyle='rgba(150,165,178,.5)';g.lineWidth=1;g.beginPath();g.moveTo(cx-80,128);g.quadraticCurveTo(cx-40,118,cx-8,132);g.moveTo(cx+84,124);g.quadraticCurveTo(cx+50,116,cx+12,132);g.stroke();
  /* hair spread on the pillow */
  var hs=brk?Math.sin(t*40)*1.2:0;
  ell(cx+hs,90,39,38,HAIR);ell(cx-34+hs,112,14,26,HAIR,.25);ell(cx+34+hs,112,14,26,HAIR,-.25);ell(cx-40,134,10,12,HAIR,.5);ell(cx+40,134,10,12,HAIR,-.5);
  /* shoulders and gown */
  g.beginPath();g.moveTo(cx-66,170);g.quadraticCurveTo(cx-64,134,cx-22,128);g.lineTo(cx+22,128);g.quadraticCurveTo(cx+64,134,cx+66,170);g.closePath();P(INK);
  g.beginPath();g.moveTo(cx-64,170);g.quadraticCurveTo(cx-62,137,cx-22,130);g.lineTo(cx+22,130);g.quadraticCurveTo(cx+62,137,cx+64,170);g.closePath();P(GOWN);
  for(i=0;i<26;i++)R(cx-56+(i*23)%112,140+((i*13)%28),2,2,GOWN_D);
  rr(cx-12,112,24,26,6,INK);rr(cx-10.5,112,21,24,5,SKIN_D);g.beginPath();g.moveTo(cx-16,130);g.lineTo(cx,146);g.lineTo(cx+16,130);g.closePath();P(SKIN_D);line([cx-17,130,cx,147,cx+17,130],2,GOWN_D);
  /* face */
  var hx=cx+hs,strain=brk?1:0,wide=ph==='cuff'&&tt>1.9?1:0;
  ell(hx-25,95,5,8,INK);ell(hx+25,95,5,8,INK);ell(hx-25,95,3.6,6.6,SKIN_D);ell(hx+25,95,3.6,6.6,SKIN_D);
  ell(hx,94,25.5,30.5,INK);ell(hx,94,24,29,SKIN);
  g.save();g.beginPath();g.ellipse(hx,94,24,29,0,0,TAU);g.clip();ell(hx,124,26,16,SKIN_D);ell(hx-8,82,14,12,SKIN_L);ell(hx,60,30,14,HAIR);ell(hx-25,84,8,22,HAIR);ell(hx+25,84,8,22,HAIR);
  g.fillStyle='rgba(60,40,30,.22)';g.beginPath();g.ellipse(hx,113,17,10,0,0,Math.PI);g.fill();g.restore();
  line([hx-2,64,hx-12,72],3,HAIR);line([hx+3,64,hx+13,73],3,HAIR);
  /* eyes: closed, fluttering, then open */
  var e=1,lookX=0,lookY=0;
  if(ph==='wake'){e=tt<1.6?0:tt<3.6?.35*Math.abs(Math.sin((tt-1.6)*3.3)):Math.min(.75,.2+(tt-3.6)*.3)}
  else if(ph==='look'){e=1;lookX=Math.sin(tt*2.6)*2.6}
  else if(ph==='cuff'){e=wide?1.3:1;lookX=tt<1.1?-2.6:tt<1.9?2.6:0;lookY=tt<1.9?1.6:0}
  else if(brk){e=.7;lookX=(HS.pullL-HS.pullR)*-2}
  else if(free){e=1.1}
  if(Math.sin(t*.9)>.985&&e>.5&&!brk)e=.05;
  [-1,1].forEach(function(s){var ex=hx+s*10.5,ey=91;
    if(e<.12){line([ex-5,ey+1,ex+5,ey+1],1.6,INK)}
    else{ell(ex,ey,6.2,3.6*e+.8,INK);ell(ex,ey,5.2,3.2*e,'#f4f1ea');g.save();g.beginPath();g.ellipse(ex,ey,5.2,3.2*e,0,0,TAU);g.clip();ell(ex+lookX,ey+lookY,3,3,'#3a2414');ell(ex+lookX,ey+lookY,1.5,1.5,'#0b0806');ell(ex+lookX-1,ey+lookY-1,.8,.8,'#fff');g.restore();
      line([ex-6,ey-3.2*e,ex+6,ey-3.2*e-(strain?0:.5)],1.4,INK)}
    var bi=strain?3.5:0,bo=ph==='look'||wide?-3:0;line([ex-s*6.5,84+bo-(strain?1:0),ex+s*5.5,83.5+bo+bi],3.2,HAIR)});
  line([hx+1,93,hx-2.5,103,hx+2.5,104.5],1.5,SKIN_D);
  /* mouth */
  if(strain){rr(hx-9,107,18,7,2,INK);R(hx-7.5,108.5,15,4,'#f4f1ea');for(i=-5;i<=5;i+=3)R(hx+i,108.5,.8,4,'#b9b4a8');R(hx-7.5,110.2,15,.7,'#b9b4a8')}
  else if(free){ell(hx,110,8,5.5,INK);ell(hx,111,6.2,3.8,'#5a1c18');R(hx-5,106.5,10,2,'#f4f1ea')}
  else if(ph==='look'||wide){ell(hx,110,3.6,wide?4.4:3,INK);ell(hx,110,2.4,wide?3.2:1.9,'#5a1c18')}
  else line([hx-6,110,hx+6,110],1.6,'#6b3f2a');
  if(strain)for(i=0;i<3;i++){var sp=(t*1.4+i*.37)%1;g.globalAlpha=1-sp;ell(hx+(i-1)*17+(i===1?27:0),74+sp*16,1.4,2.2,'#bfe6ff');g.globalAlpha=1}
  /* blanket */
  g.beginPath();g.moveTo(cx-150,156);g.quadraticCurveTo(cx,146,cx+150,156);g.lineTo(cx+150,230);g.lineTo(cx-150,230);g.closePath();P('#8fb4c8');
  g.beginPath();g.moveTo(cx-150,160);g.quadraticCurveTo(cx,150,cx+150,160);g.lineTo(cx+150,230);g.lineTo(cx-150,230);g.closePath();P('#cfe2ec');
  g.strokeStyle='rgba(120,160,185,.55)';g.lineWidth=1;g.beginPath();g.moveTo(cx-90,172);g.quadraticCurveTo(cx-40,186,cx-30,216);g.moveTo(cx+96,170);g.quadraticCurveTo(cx+50,190,cx+44,216);g.moveTo(cx-6,166);g.lineTo(cx+4,216);g.stroke();
  /* arms, cuffs and bed rails */
  [-1,1].forEach(function(s){var L=s<0,broke=L?HS.brokeL:HS.brokeR,pull=L?HS.pullL:HS.pullR,bend=broke?1:Math.max(0,Math.min(1,L?HS.p*2:(HS.p-.5)*2));
    var sx=cx+s*50,sy=148,rx=cx+s*112,ry=162+bend*3,wx,wy;
    if(free){wx=cx+s*(58+Math.sin(t*9+s)*2);wy=74+Math.cos(t*9)*2}
    else if(broke){wx=cx+s*(70-pull*4);wy=128-pull*6}
    else{wx=cx+s*(100-pull*17);wy=168-pull*15}
    /* rail */
    var bx=rx-s*bend*9;
    line([cx+s*150,198,cx+s*150,160,bx,ry,cx+s*92,160+bend*2,cx+s*92,198],5.5,INK);line([cx+s*150,198,cx+s*150,160,bx,ry,cx+s*92,160+bend*2,cx+s*92,198],3.2,STEEL);
    line([cx+s*150,180,cx+s*92,180],4.5,INK);line([cx+s*150,180,cx+s*92,180],2.4,STEEL_D);
    /* arm */
    var ex=(sx+wx)/2+s*10,ey=(sy+wy)/2+(free?6:12);
    line([sx,sy,ex,ey,wx,wy],15,INK);line([sx,sy,ex,ey,wx,wy],12,SKIN);line([sx,sy,(sx+ex)/2,(sy+ey)/2],16,INK);line([sx,sy,(sx+ex)/2,(sy+ey)/2],13,GOWN);
    ell(wx,wy,9.5,8.5,INK);ell(wx,wy,8,7,SKIN);for(i=-1;i<=1;i++)line([wx+i*3.2,wy-4.5,wx+i*3.2,wy-1],1,SKIN_D);
    /* cuff on the wrist */
    var cwx=wx-s*7*(free?0:1)+ (free?0:0),cwy=wy+(free?10:3);
    g.strokeStyle=INK;g.lineWidth=5;g.beginPath();g.ellipse(cwx,cwy,7.5,5,0,0,TAU);g.stroke();g.strokeStyle=STEEL;g.lineWidth=2.6;g.beginPath();g.ellipse(cwx,cwy,7.5,5,0,0,TAU);g.stroke();
    function chain(x0,y0,x1,y1){var n=Math.max(2,Math.round(Math.hypot(x1-x0,y1-y0)/4));for(var q=0;q<=n;q++){var px=x0+(x1-x0)*q/n,py=y0+(y1-y0)*q/n;ell(px,py,2.3,2.3,INK);ell(px,py,1.3,1.3,q%2?STEEL:STEEL_D)}}
    var ringx=bx+s*2,ringy=ry+5;
    if(broke){chain(cwx,cwy+5,cwx+Math.sin(t*5+s)*2,cwy+16);chain(ringx,ringy+5,ringx+Math.sin(t*4)*1.5,ringy+15)}
    else chain(cwx+s*6,cwy,ringx-s*5,ringy);
    g.strokeStyle=INK;g.lineWidth=5;g.beginPath();g.ellipse(ringx,ringy,6,7,0,0,TAU);g.stroke();g.strokeStyle=STEEL;g.lineWidth=2.6;g.beginPath();g.ellipse(ringx,ringy,6,7,0,0,TAU);g.stroke();
    if(brk&&pull>.5&&!broke)for(i=0;i<3;i++)R(ringx-s*(8+i*4),ringy-6+i*5,3,1,'#fff7c2')});
  if(HS.say&&t-HS.sayT<1){if(HS.say==='!')bubble(cx+34,40,'!',false);else burst(HS.say,cx+(HS.brokeR?96:-96),132,12,'#ffd27a',HS.sayT)}
  if(ph==='look'&&tt>.8)bubble(cx+36,42,'?',false);
  /* captions and lighting, drawn unzoomed */
  g.setTransform(2,0,0,2,0,0);
  var cap=ph==='wake'?(tt>1?['beep...','beep...  beep...','beep...  beep...  beep...'][Math.min(2,((tt-1)/1.6)|0)]:''):ph==='look'?'WHERE AM I?':ph==='cuff'&&tt>2.1?'CUFFED TO THE BED!?':'';
  if(cap){R(0,H-34,W,22,'rgba(12,14,24,.72)');g.font='8px "Press Start 2P", monospace';g.textAlign='center';g.textBaseline='top';g.fillStyle='#ffffff';g.fillText(cap,W/2,H-27)}
  var vg=g.createRadialGradient(W/2,H/2,H*.45,W/2,H/2,W*.7);vg.addColorStop(0,'rgba(10,20,30,0)');vg.addColorStop(1,'rgba(10,20,30,.4)');g.fillStyle=vg;g.fillRect(0,0,W,H);
  if(HS.flash>0)R(0,0,W,H,'rgba(255,255,255,'+(HS.flash*.5).toFixed(2)+')');
  if(HS.white>0)R(0,0,W,H,'rgba(255,255,255,'+HS.white.toFixed(2)+')')}
