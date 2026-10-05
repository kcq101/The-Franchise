/* The escape: Frank sprints down the hospital hallway, jumping and sliding past obstacles, then crashes out through the window at the end. The hallway is drawn in code; Frank uses the gown sprite sheet. */
var HALL_LEN=2900,HALL_GY=180,HALL_CEIL=34,HALL_FLOOR=150;
var HL={ph:'',t0:0,x:0,sp:0,jy:0,vy:0,slide:0,stun:0,p:1,obs:[],dodged:0,hits:0,white:0,shake:0,flash:0,say:'',sayT:0,step:0,style:false,shards:[]};
var HALL_KINDS={gurney:{w:48,h:27},chair:{w:26,h:28},cart:{w:30,h:29},sign:{w:16,h:19},lamp:{w:38,high:1},bar:{w:42,high:1}};
function hlphase(n){HL.ph=n;HL.t0=S.clock}
function startHall(){S.mode='hall';S.v=0;S.last=null;HL.x=0;HL.sp=0;HL.jy=0;HL.vy=0;HL.slide=0;HL.stun=0;HL.p=1;HL.dodged=0;HL.hits=0;HL.white=1;HL.shake=0;HL.flash=0;HL.say='';HL.step=0;HL.style=false;HL.shards=[];
  var r=rng(4242),x=420,low=['gurney','chair','cart','sign','gurney'],high=['lamp','bar'],n=0;HL.obs=[];
  while(x<HALL_LEN-330){var k=(n%3===2||r()<.22)?high[(r()*2)|0]:low[(r()*low.length)|0],d=HALL_KINDS[k];HL.obs.push({k:k,x:x,w:d.w,h:d.h||0,high:!!d.high,done:false,hit:0});n++;x+=Math.max(150,215-n*6)+r()*55}
  cv.style.filter='';hint.textContent='R = JUMP     L = SLIDE\nGET TO THE WINDOW';hint.hidden=false;padsOn(true);
  lvl.innerHTML='RUSHVILLE GENERAL<br>LEVEL 1-4';barlab.textContent='BALANCE';track.style.width='0%';hlphase('run')}
function hallTap(side){if(HL.ph!=='run')return;hint.hidden=true;
  if(HL.x>HALL_LEN-190&&side==='R')HL.style=true;
  if(HL.jy>0||HL.stun>.25)return;
  if(side==='R'){if(HL.slide>.2)return;HL.slide=0;HL.vy=258;HL.jy=.01;if(audio())tone(ac.currentTime,300,.14,'square',.035,1800,sfxG,620)}
  else if(HL.slide<=0){HL.slide=.62;scuff('L')}}
function glassSmash(){if(!audio())return;try{var t=ac.currentTime,i;noise(t,.9,.3,'highpass',3000,.7);noise(t,.25,.3,'bandpass',900,.8);tone(t,150,.3,'sine',.3,0,sfxG,45);
  for(i=0;i<14;i++)tone(t+.02+Math.random()*.7,1800+Math.random()*3200,.08+Math.random()*.12,'triangle',.03+Math.random()*.03)}catch(e){}}
function hallUpdate(dt){var tt=S.clock-HL.t0,t=S.clock,i,o;
  HL.white=Math.max(0,HL.white-dt*.9);HL.shake=Math.max(0,HL.shake-dt*4);HL.flash=Math.max(0,HL.flash-dt*3);
  if(HL.ph==='run'){
    HL.stun=Math.max(0,HL.stun-dt);HL.slide=Math.max(0,HL.slide-dt);
    var target=HL.stun>0?70:150+Math.min(45,HL.x*.018);HL.sp+=(target-HL.sp)*Math.min(1,dt*4);HL.x+=HL.sp*dt;
    if(HL.jy>0||HL.vy>0){HL.jy+=HL.vy*dt;HL.vy-=720*dt;if(HL.jy<=0){HL.jy=0;HL.vy=0;foot('R')}}
    else{HL.step+=HL.sp*dt;if(HL.step>34&&HL.slide<=0){HL.step=0;foot(((HL.x/34)|0)%2?'L':'R')}}
    S.score+=HL.sp*dt*.5;scoreEl.textContent=pad6(S.score);track.style.width=Math.min(100,HL.x/HALL_LEN*100).toFixed(1)+'%';
    for(i=0;i<HL.obs.length;i++){o=HL.obs[i];if(o.hit)o.hit+=dt;if(o.done)continue;var dx=o.x-HL.x;
      var bump=o.high?(Math.abs(dx)<o.w/2+3&&HL.slide<=0):(Math.abs(dx)<o.w/2+5&&HL.jy<o.h-5);
      if(bump){o.done=true;o.hit=.001;HL.hits++;HL.p=Math.max(0,HL.p-1/3);HL.stun=.55;HL.vy=0;HL.jy=0;HL.slide=0;HL.shake=.7;HL.flash=.4;thump(.3,true);HL.say='OOF!';HL.sayT=t}
      else if(dx<-o.w/2-8){o.done=true;HL.dodged++;S.score+=150;HL.say=o.high?'SLICK!':'CLEAR!';HL.sayT=t;blip(880,.06,.03)}}
    if(HL.x>HALL_LEN-190&&HL.x<HALL_LEN-100&&!HL.style){hint.textContent='R! JUMP FOR IT!';hint.hidden=false}
    if(HL.x>=HALL_LEN-100){hlphase('leap');HL.x0=HL.x;padsOn(false);hint.hidden=true;HL.slide=0;if(HL.style){S.score+=500;HL.say='+500 STYLE';HL.sayT=t}
      if(audio())tone(ac.currentTime,260,.4,'square',.04,1800,sfxG,900)}}
  else if(HL.ph==='leap'){var u=Math.min(1,tt/.5);HL.x=HL.x0+(HALL_LEN+6-HL.x0)*u;HL.jy=8+34*Math.sin(u*Math.PI*.62);
    if(u>=1){hlphase('smash');HL.flash=1;HL.shake=1;glassSmash();HL.shards=[];
      for(i=0;i<46;i++)HL.shards.push({x:0,y:0,vx:(Math.random()-.25)*190,vy:-60-Math.random()*150,r:Math.random()*6,vr:(Math.random()-.5)*14,s:2+Math.random()*5})}}
  else if(HL.ph==='smash'||HL.ph==='out'){var slow=HL.ph==='out'?.42:1;
    for(i=0;i<HL.shards.length;i++){var s=HL.shards[i];s.vy+=330*dt*slow;s.x+=s.vx*dt*slow;s.y+=s.vy*dt*slow;s.r+=s.vr*dt*slow}
    if(HL.ph==='smash'&&tt>.45){hlphase('out');HL.flash=.8;HL.say='CRASH!';HL.sayT=t;
      for(i=0;i<HL.shards.length;i++){s=HL.shards[i];s.x=0;s.y=0;s.vx=30+Math.random()*190;s.vy=-110+Math.random()*150}}
    else if(HL.ph==='out'&&tt>3){hlphase('end');S.mode='over';S.stat+='<br>ESCAPE: '+HL.dodged+' CLEARED  '+HL.hits+' HITS';
      endText.textContent='Frank crashes through the window and out into the Rushville night.';stat.innerHTML=(S.stat+'<br>TO BE CONTINUED').replace(/^<br>/,'');endBox.hidden=false}}
  var on=Math.ceil(HL.p*6-.001);for(i=0;i<6;i++)segs[i].className=i<on?'on':''}

/* ---------- drawing ---------- */
function hallObstacle(o,x,t){var G=HALL_GY,INK='#16151c',i;
  function box(a,b,c,d,col){R(a-1,b-1,c+2,d+2,INK);R(a,b,c,d,col)}
  function wheel(wx,r){g.fillStyle=INK;g.beginPath();g.arc(wx,G-r,r+1,0,TAU);g.fill();g.fillStyle='#5b6170';g.beginPath();g.arc(wx,G-r,r-1,0,TAU);g.fill();g.fillStyle='#c9ced8';g.fillRect(wx-1,G-r-1,2,2)}
  g.save();if(o.hit&&!o.high){var f=Math.min(1,o.hit*1.6);g.translate(x+f*70,G);g.rotate(f*.5);g.translate(-x,-G);g.globalAlpha=1-f*.7}
  R(x-o.w/2,G,o.w,2,'rgba(20,40,40,.35)');
  if(o.k==='gurney'){R(x-20,G-16,2,13,'#8d95a3');R(x+18,G-16,2,13,'#8d95a3');R(x-20,G-9,40,2,'#6f7785');wheel(x-19,3);wheel(x+19,3);
    box(x-24,G-22,48,6,'#f2f4f7');R(x-24,G-17,48,1,'#c3c9d3');box(x-8,G-25,30,4,'#7fb0cf');R(x-8,G-25,30,1,'#a9d0e6');box(x-23,G-27,12,5,'#ffffff');R(x+22,G-30,2,10,'#8d95a3')}
  else if(o.k==='chair'){wheel(x-3,10);wheel(x+10,3);box(x-8,G-16,16,4,'#2d5fa8');box(x-10,G-28,4,15,'#2d5fa8');R(x-12,G-30,6,2,INK);R(x+6,G-12,2,9,'#8d95a3');R(x+6,G-4,7,2,'#8d95a3')}
  else if(o.k==='cart'){wheel(x-10,3);wheel(x+10,3);box(x-14,G-29,28,23,'#3d9a8f');R(x-14,G-29,28,3,'#5cc0b3');for(i=0;i<3;i++){R(x-11,G-23+i*6,22,1,'#27665e');R(x-2,G-21+i*6,4,1,'#d7efe9')}
    box(x-9,G-34,6,5,'#f2f4f7');box(x+2,G-33,5,4,'#e8b04a')}
  else if(o.k==='sign'){g.fillStyle=INK;g.beginPath();g.moveTo(x,G-21);g.lineTo(x+9,G+1);g.lineTo(x-9,G+1);g.closePath();g.fill();g.fillStyle='#f4c531';g.beginPath();g.moveTo(x,G-19);g.lineTo(x+7,G);g.lineTo(x-7,G);g.closePath();g.fill();R(x-1,G-13,2,6,INK);R(x-1,G-5,2,2,INK)}
  else if(o.k==='lamp'){var sw=Math.sin(t*3+o.x)*3;R(x-12,HALL_CEIL,1,G-80-HALL_CEIL,'#3a3f4b');R(x+10+sw*.4,HALL_CEIL,1,G-70-HALL_CEIL,'#3a3f4b');
    g.save();g.translate(x+sw,G-56);g.rotate(.18+sw*.02);R(-20,-7,40,13,INK);R(-19,-6,38,11,'#dfe5ea');R(-17,-3,34,5,((t*9)|0)%3?'#fffbe0':'#9aa3ad');g.restore();
    if(((t*7+o.x)|0)%4===0){R(x+sw+14,G-46,2,2,'#fff7a8');R(x+sw+17,G-42,1,3,'#ffd27a');R(x+sw+11,G-41,1,2,'#fff7a8')}}
  else if(o.k==='bar'){box(x+16,G-50,5,50,'#5b6170');R(x+14,G-2,9,2,INK);box(x-22,G-50,40,8,'#f4c531');for(i=0;i<5;i++)R(x-20+i*8,G-50,4,8,INK);box(x-23,G-52,4,12,'#d8392c')}
  g.restore()}

/* Frank in his hospital gown: frames 0-7 run, 8 tucked jump, 9 hurdle, 10 slide, 11 dive */
var gownImg=load('gown.png'),GW=186,GH=138,GAX=93;
function hallFrank(fx,t){var f,base=HALL_GY+1-HL.jy,i;
  R(fx-13+HL.jy*.1,HALL_GY,28-HL.jy*.25,2,'rgba(20,40,40,.4)');
  if(ok(gownImg)){var sliding=HL.slide>0&&HL.jy<=0;
    if(HL.ph==='leap')f=11;else if(sliding||HL.stun>.2)f=10;else if(HL.jy>0)f=HL.jy>26?8:9;else f=((HL.x/100*8)|0)%8;
    if(sliding)for(i=0;i<3;i++)R(fx-30-i*9-((t*90)|0)%7,base-3-i*2,6,1,'rgba(255,255,255,.55)');
    g.drawImage(gownImg,f*GW,0,GW,GH,Math.round(fx*2-GAX)/2+(f===10?4:0),base+.5-GH/2-(f===11?14:0),GW/2,GH/2);return}
  if(!ok(markImg)){R(fx-6,base-50,12,50,'#a3a6b0');return}
  if(HL.slide>0&&HL.jy<=0){g.save();g.translate(fx-4,base);g.rotate(-1.02);g.drawImage(markImg,13*CW,0,CW,CH,-AX/2+4,1.5-CH/2,CW/2,CH/2);g.restore();return}
  if(HL.stun>.2)f=13;else if(HL.jy>0)f=HL.vy>0?2:6;else f=((HL.x/104*8)|0)%8;
  g.drawImage(markImg,f*CW,0,CW,CH,Math.round(fx*2-AX)/2,base+.5-CH/2,CW/2,CH/2)}

function drawHall(){var t=S.clock,tt=t-HL.t0,ph=HL.ph,i,sh=HL.shake,G=HALL_GY,fx=Math.round(W*.28),cam=HL.x-fx;
  g.setTransform(2,0,0,2,sh?(Math.random()-.5)*8*sh:0,sh?(Math.random()-.5)*6*sh:0);
  if(ph==='out'||ph==='end'){drawHallOutside(t,ph==='end'?3:tt);return}
  var wx=function(x){return Math.round(x-cam)};
  /* walls, ceiling, floor */
  R(-8,-8,W+16,HALL_CEIL+8,'#aebdb9');R(-8,HALL_CEIL,W+16,HALL_FLOOR-HALL_CEIL,'#dbe7e1');R(-8,HALL_CEIL,W+16,3,'#93a39f');
  R(-8,104,W+16,HALL_FLOOR-104,'#bcd3cb');R(-8,102,W+16,3,'#5aa39a');R(-8,HALL_FLOOR-4,W+16,4,'#7e8f8b');
  R(-8,HALL_FLOOR,W+16,H-HALL_FLOOR+8,'#c9d2d6');
  var x0=-(((cam%48)+48)%48)-48,idx=Math.floor((cam+x0)/48);for(;x0<W+48;x0+=48,idx++){if(idx%2)R(x0,HALL_FLOOR,48,H-HALL_FLOOR+8,'#b8c2c7');R(x0,HALL_FLOOR,1,H-HALL_FLOOR+8,'rgba(90,105,112,.35)')}
  R(-8,HALL_FLOOR+22,W+16,1,'rgba(90,105,112,.3)');R(-8,HALL_FLOOR,W+16,2,'rgba(60,75,80,.35)');
  var gr=g.createLinearGradient(0,HALL_FLOOR,0,HALL_FLOOR+26);gr.addColorStop(0,'rgba(255,255,255,.35)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(-8,HALL_FLOOR+2,W+16,26);
  /* repeating wall furniture: lights, doors, notice boards, night windows */
  var seg=Math.floor(cam/120)-1,endSeg=Math.floor((cam+W)/120)+1;
  for(i=seg;i<=endSeg;i++){var bx=wx(i*120),far=i*120>HALL_LEN-150;
    if(i%2===0){R(bx+30,HALL_CEIL-5,56,6,'#eef3f2');R(bx+32,HALL_CEIL-1,52,3,'#fffdf0');g.save();g.globalCompositeOperation='lighter';var gl=g.createRadialGradient(bx+58,HALL_CEIL,2,bx+58,HALL_CEIL,80);gl.addColorStop(0,'rgba(255,252,225,.38)');gl.addColorStop(1,'rgba(255,252,225,0)');g.fillStyle=gl;g.fillRect(bx-22,HALL_CEIL,160,90);g.restore()}
    if(far||i<0)continue;var m=((i%4)+4)%4;
    if(m===0){R(bx+14,62,44,HALL_FLOOR-62,'#16151c');R(bx+16,64,40,HALL_FLOOR-64,'#8fb8b0');R(bx+16,64,40,3,'#a9d0c8');R(bx+22,72,12,20,'#1b2742');R(bx+23,73,10,18,'#33456e');R(bx+48,108,4,3,'#e6e9ee');
      R(bx+62,74,16,9,'#16151c');R(bx+63,75,14,7,'#f4f6f8');g.font='6px "Press Start 2P", monospace';g.textAlign='center';g.textBaseline='top';g.fillStyle='#16151c';g.fillText(String(100+((i*7)%60+60)%60),bx+70,76)}
    else if(m===1){R(bx+20,60,58,34,'#16151c');R(bx+22,62,54,30,'#b98a56');R(bx+26,66,14,10,'#f4f6f8');R(bx+44,65,12,14,'#f7e08a');R(bx+60,67,12,9,'#bfe0f2');R(bx+28,80,20,8,'#f6c0c0');R(bx+52,82,18,7,'#f4f6f8')}
    else if(m===2){R(bx+22,56,60,42,'#16151c');R(bx+24,58,56,38,'#101b3d');for(var k=0;k<9;k++)R(bx+27+((k*17)%50),74+((k*11)%20),3,3,k%3?'#f0bd4c':'#bfd8ff');R(bx+51,58,2,38,'#16151c');R(bx+24,76,56,2,'#16151c');R(bx+20,96,64,3,'#eef3f2')}
    else{R(bx+34,84,26,5,'#16151c');R(bx+35,85,24,3,'#5aa39a');R(bx+40,70,14,15,'#16151c');R(bx+41,71,12,13,'#f4f6f8');R(bx+46,73,2,9,'#d8392c');R(bx+43,76,8,2,'#d8392c')}}
  /* the window at the end of the hall */
  var ex=wx(HALL_LEN);if(ex<W+40){var broken=ph==='smash';
    R(ex+66,-8,W,H+16,'#7e8f8b');R(ex-14,46,90,HALL_FLOOR-46,'#16151c');R(ex-11,49,84,HALL_FLOOR-52,'#0d1634');
    if(ok(skyImg))g.drawImage(skyImg,300,170,336,140,ex-11,49,84,HALL_FLOOR-52);
    if(!broken){g.fillStyle='rgba(190,225,255,.2)';g.fillRect(ex-11,49,84,HALL_FLOOR-52);g.fillStyle='rgba(255,255,255,.35)';g.beginPath();g.moveTo(ex-4,52);g.lineTo(ex+14,52);g.lineTo(ex-6,110);g.lineTo(ex-11,110);g.closePath();g.fill();R(ex+30,49,2,HALL_FLOOR-52,'#16151c')}
    else{g.strokeStyle='#eaf6ff';g.lineWidth=1;g.beginPath();for(i=0;i<9;i++){var a=i*.7;g.moveTo(ex-11+(i%2?0:84),49+((i*23)%95));g.lineTo(ex+31+Math.cos(a)*24,98+Math.sin(a)*26)}g.stroke()}
    R(ex-16,HALL_FLOOR-4,94,5,'#eef3f2');
    g.font='6px "Press Start 2P", monospace';g.textAlign='center';g.textBaseline='top';R(ex+12,36,38,10,'#16151c');g.fillStyle='#4fe08a';g.fillText('EXIT',ex+31,38)}
  /* the room he came out of */
  var dx0=wx(-40);if(dx0>-80){R(dx0,60,46,HALL_FLOOR-60,'#16151c');R(dx0+2,62,42,HALL_FLOOR-62,'#1b2742');R(dx0+40,62,10,HALL_FLOOR-62,'#8fb8b0')}
  for(i=0;i<HL.obs.length;i++){var o=HL.obs[i],sx=wx(o.x);if(sx>-60&&sx<W+60&&!(o.hit>.7&&!o.high))hallObstacle(o,sx,t)}
  if(ph!=='smash')hallFrank(fx,t);
  if(ph==='smash')for(i=0;i<HL.shards.length;i++){var s=HL.shards[i];g.save();g.translate(ex+31+s.x*.5-20,98+s.y*.5);g.rotate(s.r);g.fillStyle=i%3?'#dff1ff':'#ffffff';g.beginPath();g.moveTo(0,-s.s);g.lineTo(s.s*.7,s.s*.6);g.lineTo(-s.s*.6,s.s*.4);g.closePath();g.fill();g.restore()}
  if(HL.say&&t-HL.sayT<.8)burst(HL.say,fx+6,G-92-HL.jy*.5,8,HL.say==='OOF!'?'#ff9a8a':'#ffd27a',HL.sayT);
  g.setTransform(2,0,0,2,0,0);
  if(HL.flash>0)R(0,0,W,H,'rgba(255,255,255,'+(HL.flash*.7).toFixed(2)+')');
  if(HL.white>0)R(0,0,W,H,'rgba(255,255,255,'+HL.white.toFixed(2)+')')}

/* the slow-motion shot from outside as he comes through the glass */
function drawHallOutside(t,tt){var i,u=Math.min(1,tt/3),bw=Math.round(W*.4),wy=58,wx0=bw-58;
  R(-8,-8,W+16,H+16,'#070b22');if(ok(skyImg))g.drawImage(skyImg,0,60,1240,260,-8,-8,W+16,H+16);
  R(-8,-8,bw+8,H+16,'#16151c');R(-8,-8,bw+5,H+16,'#39415a');R(bw-3,-8,3,H+16,'#565f7c');
  for(var r=0;r<5;r++)for(var c=0;c<4;c++){var x=bw-58-c*56,y=wy+(r-1)*62;if(r===1&&c===0)continue;R(x-2,y-2,46,48,'#16151c');R(x,y,42,44,(r*3+c*5)%4===0?'#e6b653':'#141c3c');R(x+20,y,2,44,'#16151c')}
  R(wx0-2,wy-2,46,48,'#16151c');R(wx0,wy,42,44,'#fff6d2');g.fillStyle='#39415a';g.beginPath();g.moveTo(wx0,wy);g.lineTo(wx0+14,wy);g.lineTo(wx0+6,wy+12);g.lineTo(wx0,wy+9);g.closePath();g.fill();g.beginPath();g.moveTo(wx0,wy+44);g.lineTo(wx0+18,wy+44);g.lineTo(wx0+8,wy+33);g.lineTo(wx0,wy+36);g.closePath();g.fill();
  var gl=g.createRadialGradient(wx0+30,wy+22,4,wx0+30,wy+22,110);gl.addColorStop(0,'rgba(255,240,190,.45)');gl.addColorStop(1,'rgba(255,240,190,0)');g.save();g.globalCompositeOperation='lighter';g.fillStyle=gl;g.fillRect(wx0-90,wy-90,240,240);g.restore();
  for(i=0;i<HL.shards.length;i++){var s=HL.shards[i];g.save();g.translate(wx0+34+s.x*.9,wy+22+s.y*.9);g.rotate(s.r);g.fillStyle=i%3?'#cfe9ff':'#ffffff';g.globalAlpha=.9;g.beginPath();g.moveTo(0,-s.s);g.lineTo(s.s*.7,s.s*.6);g.lineTo(-s.s*.6,s.s*.4);g.closePath();g.fill();g.restore()}
  var px=wx0+30+u*(W*.5),py=wy+26-34*Math.sin(u*2.1)+70*u*u;
  if(ok(gownImg)){g.save();g.translate(px,py);g.rotate(-.3+u*.75);g.drawImage(gownImg,11*GW,0,GW,GH,-GW/4,-GH/2+18,GW/2,GH/2);g.restore()}
  else if(ok(markImg)){g.save();g.translate(px,py);g.rotate(-.25+u*.95);g.drawImage(markImg,2*CW,0,CW,CH,-CW/4,-CH/4,CW/2,CH/2);g.restore()}
  if(HL.say==='CRASH!'&&t-HL.sayT<1.6)burst('CRASH!',wx0+70,wy-14,16,'#ffd27a',HL.sayT);
  g.setTransform(2,0,0,2,0,0);R(0,0,W,16,'#000');R(0,H-16,W,16,'#000');
  if(HL.flash>0)R(0,0,W,H,'rgba(255,255,255,'+(HL.flash*.8).toFixed(2)+')')}
