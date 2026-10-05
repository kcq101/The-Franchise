/* The dream football level: run, collision, loose ball, touchdown, and all of its drawing. */
var RUNLEN=1500;
function startDream(){D.fading=false;S.mode='dream';S.v=0;D.p=1;D.fx=-90;D.lx=9999;D.wall=false;D.dist=0;D.sp=0;D.ln=1;D.lyf=1;D.bonkLn=1;D.obs=[];D.next=140;D.stun=0;D.jukes=0;D.hits=0;D.tips=0;D.dgo=false;D.dx=999;D.td=false;D.lane=0;D.say='';
  hint.hidden=true;lvl.innerHTML='THE DREAM<br>LEVEL 1-2';barlab.textContent='BALANCE';track.style.width='0%';dphase('intro')}
function dreamTap(side){var pe=side==='L'?padL:padR;
  if(D.ph==='run'){hint.hidden=true;var n=Math.max(0,Math.min(2,D.ln+(side==='L'?-1:1)));if(n!==D.ln){D.ln=n;foot(side)}return}
  if(D.ph!=='loose')return;hint.hidden=true;
  if(S.last===side){pe.classList.add('miss');setTimeout(function(){pe.classList.remove('miss')},120);blip(70,.08,.045);return}
  S.last=side;padL.classList.toggle('next',side==='R');padR.classList.toggle('next',side==='L');S.v=1;D.fx+=6;scuff(side)}
function padsOn(on){padL.disabled=padR.disabled=!on;padL.classList.toggle('next',on);padR.classList.toggle('next',on)}
function dreamUpdate(dt){var tt=S.clock-D.t0,t=S.clock,i,o;if(!D.fading)D.white=Math.max(0,D.white-dt*.55);S.v*=Math.exp(-3*dt);
  if(D.ph==='intro'){if(tt>3){dphase('set');blip(2300,.1,.05);setTimeout(function(){blip(2500,.3,.05)},130)}}
  else if(D.ph==='set'){if(tt>.7){dphase('run');padsOn(true);hint.textContent='L = CUT UP    R = CUT DOWN\nDODGE THE ADMIRALS';hint.hidden=false}}
  else if(D.ph==='run'){
    D.stun=Math.max(0,D.stun-dt);var target=D.stun>0?55:135+Math.min(45,D.dist*.03);D.sp+=(target-D.sp)*Math.min(1,dt*4);D.dist+=D.sp*dt;
    D.lyf+=(D.ln-D.lyf)*Math.min(1,dt*14);S.score+=D.sp*dt*.5;scoreEl.textContent=pad6(S.score);track.style.width=Math.min(100,D.dist/RUNLEN*100).toFixed(1)+'%';
    if(!D.wall&&D.dist>=D.next){var a=Math.random()<.75?D.ln:(Math.random()*3)|0,lanes=[a];
      if(D.dist>420&&Math.random()<.6){var b=(a+1+((Math.random()*2)|0))%3;lanes.push(b)}
      lanes.forEach(function(l,k){D.obs.push({x:W/2+50+k*30,ln:l,v:40+Math.random()*40,hit:false,pass:false,fall:0})});
      D.next=D.dist+Math.max(92,165-D.dist*.05)}
    for(i=D.obs.length-1;i>=0;i--){o=D.obs[i];
      if(o.hit){o.fall+=dt;o.x-=D.sp*dt*.4}else o.x-=(D.sp+o.v)*dt;
      if(!o.hit&&!o.pass){
        if(Math.abs(o.x-D.fx)<16&&Math.abs(D.lyf-o.ln)<.5){o.hit=true;D.p-=.34;D.stun=.55;D.hits++;C.flash=.45;D.shake=.6;thump(.3,true);D.say='OOF!';D.sayT=t}
        else if(o.x<D.fx-20){o.pass=true;D.jukes++;S.score+=150;D.say='JUKE!';D.sayT=t;blip(880,.06,.035);setTimeout(function(){blip(1320,.08,.03)},60)}}
      if(o.x<-W/2-90||o.fall>.8)D.obs.splice(i,1)}
    if(!D.wall&&(D.dist>RUNLEN||D.p<=0)){D.wall=true;D.lx=W/2+120;D.p=Math.max(0,D.p)}
    if(D.wall){D.lx-=D.sp*dt;if(D.lx+[24,0,-24][D.ln]-24<=D.fx){dphase('bonk');padsOn(false);hint.hidden=true;D.bonkLn=D.ln;D.lyf=D.ln;D.sp=0;
      C.flash=1;D.shake=1;thump(.35,true);if(audio())tone(ac.currentTime,440,.4,'sine',.3,0,sfxG,90);
      D.bx=D.fx+16;D.by=-36;D.bvx=62;D.bvy=-170;D.brot=0;D.lane=0;D.say='BONK!';D.sayT=t}}}
  else if(D.ph==='bonk'){if(tt<.45)D.fx-=dt*34;ballPhys(dt);D.lane=Math.min(1,tt/.9);for(i=0;i<D.obs.length;i++)D.obs[i].x-=D.obs[i].v*dt;
    if(tt>1.7){dphase('loose');S.last=null;padsOn(true);hint.textContent='MASH L, R!\nGET THE BALL';hint.hidden=false;barlab.textContent='REACH'}}
  else if(D.ph==='loose'){ballPhys(dt);var d=D.bx-(D.fx+38);
    if(!D.dgo&&(tt>3.6||D.tips>=2)){D.dgo=true;D.dx=W/2+40}
    if(d<3&&D.by>-3){D.tips++;D.bvx=D.dgo?120:95;D.bvy=-90;D.say='SO CLOSE!';D.sayT=t;blip(520,.06,.04)}
    if(D.dgo){D.dx-=170*dt;if(D.dx<=D.bx+14){dphase('scoop');D.td=false;padsOn(false);hint.hidden=true;thump(.2);D.say='';
      if(audio()){noise(ac.currentTime,1.6,.07,'bandpass',480,.8);tone(ac.currentTime,230,1.5,'sawtooth',.035,500,sfxG,110)}}}}
  else if(D.ph==='scoop'){if(tt>.32)D.dx-=210*dt;
    if(!D.td&&tt>1.7){D.td=true;D.say='TOUCHDOWN ADMIRALS';D.sayT=t;blip(2300,.1,.05);setTimeout(function(){blip(2500,.4,.05)},130)}
    if(tt>3.4&&!D.fading){D.fading=true;S.stat+='<br>JUKES '+D.jukes+'  HITS '+D.hits}
    if(D.fading){D.white=Math.min(1,D.white+dt*.7);if(D.white>=1)startHosp()}}
  if(D.shake>0)D.shake=Math.max(0,D.shake-dt*4);C.flash=Math.max(0,C.flash-dt*4);
  var on=D.ph==='loose'||D.ph==='scoop'?Math.max(0,6-Math.round(Math.max(0,D.bx-D.fx-38)/9)):Math.ceil(D.p*6);for(i=0;i<6;i++)segs[i].className=i<on?'on':''}
function ballPhys(dt){D.bvy+=430*dt;D.bx+=D.bvx*dt;D.by+=D.bvy*dt;D.brot+=D.bvx*dt*.12;
  if(D.by>=0){D.by=0;if(D.bvy>60){D.bvy=-D.bvy*.45;D.bvx*=.72;blip(160,.05,.035)}else{D.bvy=0;D.bvx=Math.max(7,D.bvx*Math.exp(-1.4*dt))}}}



var ROCK={top:'#c8322b',topD:'#8e1f1b',topL:'#ea6a5f',leg:'#c9ccd4',legD:'#8e929e',skin:'#b98d5c',skinD:'#946c42',hair:'#15110e',shoe:'#17171d',sole:'#05050a',helm:'#d5d8e0',helmL:'#f4f5f8',helmD:'#8e929e',stripe:'#c8322b'};
var ADM={top:'#1f8a8a',topD:'#136060',topL:'#52c4bb',leg:'#d9a93a',legD:'#a37a22',skin:'#d9a57a',skinD:'#b07f58',hair:'#2a1d14',shoe:'#eceef3',sole:'#9ea2ae',helm:'#d9a93a',helmL:'#f1cf78',helmD:'#a37a22',stripe:'#1f8a8a'};
function tint(P,skin,skinD){var o={};for(var k in P)o[k]=P[k];o.skin=skin;o.skinD=skinD;return o}
var ROCK2=tint(ROCK,'#7a5234','#5c3c24'),ROCK3=tint(ROCK,'#e0b088','#b98a62'),ADM2=tint(ADM,'#7a5234','#5c3c24');
function fb(x,fy,pal,o){o=o||{};g.save();g.translate(Math.round(x),fy);if(o.flip)g.scale(-1,1);g.scale(1.25,1.25);if(o.rot)g.rotate(o.rot);figure(0,0,{a:o.a||0,amp:o.amp||0,pal:pal,kind:'fb'});g.restore()}
function ball(x,y,rot){g.save();g.translate(x,y);g.rotate(rot||0);
  g.fillStyle=OUT;g.beginPath();g.ellipse(0,0,10.5,6.6,0,0,TAU);g.fill();
  var gr=g.createLinearGradient(0,-6,0,6);gr.addColorStop(0,'#b9703a');gr.addColorStop(.45,'#8d4b22');gr.addColorStop(1,'#5a2c12');g.fillStyle=gr;g.beginPath();g.ellipse(0,0,9,5.2,0,0,TAU);g.fill();
  g.fillStyle='rgba(255,220,170,.35)';g.beginPath();g.ellipse(-1,-2.6,5.5,1.3,0,0,TAU);g.fill();
  g.fillStyle='#f4f1e6';g.fillRect(-6.5,-3.6,1.2,7.2);g.fillRect(5.3,-3.6,1.2,7.2);g.fillRect(-3,-.5,6,1);for(var i=-2;i<=2;i+=2)g.fillRect(i-.4,-1.6,.9,3.2);
  g.restore()}
function burst(txt,x,y,size,col,t0){var k=S.clock-t0;g.save();g.translate(Math.round(x+Math.sin(S.clock*50)*1.5),Math.round(y-Math.min(10,k*30)));g.font=size+'px "Press Start 2P", monospace';g.textAlign='center';g.textBaseline='middle';g.lineJoin='round';g.lineWidth=4;g.strokeStyle='#14131b';g.strokeText(txt,0,0);g.fillStyle=col;g.fillText(txt,0,0);g.restore()}
var crowdC=(function(){var c=mk(256,72),x=c.getContext('2d'),r=rng(321),cols=['#a9adb8','#8f93a0','#c3c6cf','#7b7f8c','#b9a0a0','#9fb0b3','#d7d9df'];x.fillStyle='#868a97';x.fillRect(0,0,256,72);
  for(var y=2;y<72;y+=5)for(var xx=(y%10?0:3);xx<256;xx+=6){x.fillStyle=cols[(r()*cols.length)|0];x.fillRect(xx,y,3,3);x.fillStyle='rgba(40,42,52,.5)';x.fillRect(xx,y+3,3,2)}return c})();
var qbImg=load('qb.png'),lineImg=load('lineman.png'),defImg=load('defender.png'),standsImg=load('stands.png');
var grassC=(function(){var c=mk(80,98),x=c.getContext('2d'),r=rng(88);for(var i=0;i<520;i++){x.fillStyle=r()<.5?'rgba(255,255,255,.07)':'rgba(0,40,10,.1)';x.fillRect((r()*80)|0,(r()*98)|0,r()<.4?2:1,1)}return c})();
function drawDream(){var t=S.clock,tt=t-D.t0,cx=W/2,GY=164,i,ph=D.ph,sh=D.shake||0,d=Math.floor(D.dist||0);
  g.setTransform(2,0,0,2,sh?(Math.random()-.5)*10*sh:0,sh?(Math.random()-.5)*8*sh:0);
  var sk=['#c9cdd8','#d3d6df','#dddfe6','#e6e8ed'];for(i=0;i<4;i++)R(0,i*9,W,10,sk[i]);
  if(ok(standsImg)){g.drawImage(standsImg,Math.round(cx-250),14,500,106);
    [cx-157,cx,cx+157].forEach(function(lx){g.save();g.globalCompositeOperation='lighter';var gl=g.createRadialGradient(lx,24,2,lx,24,80);gl.addColorStop(0,'rgba(255,255,255,.6)');gl.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gl;g.fillRect(lx-80,-56,160,160);g.restore()})}
  else{for(var sxx=-((t*2)%256)|0;sxx<W;sxx+=256)g.drawImage(crowdC,sxx,34);R(0,104,W,14,'#585c6b')}
  R(cx-64,0,128,22,'#14151d');R(cx-62,0,124,20,'#23252f');g.font='8px "Press Start 2P", monospace';g.textAlign='center';g.textBaseline='top';g.fillStyle='#ffd27a';g.fillText('RKT 17  ADM '+(D.td?'21':'14'),cx,3);g.fillStyle='#9aa0b4';g.font='6px "Press Start 2P", monospace';g.fillText('2ND QTR',cx,13);
  /* the field scrolls under Frank as he runs */
  var x0=-(d%40)-40,idx=Math.round((x0+d)/40);
  for(;x0<W;x0+=40,idx++){R(x0,118,40,H-118,idx%2?'#62a067':'#58935d');R(x0,118,1,H-118,'rgba(255,255,255,.7)');
    for(i=1;i<4;i++){R(x0+i*10,150,1,4,'rgba(255,255,255,.55)');R(x0+i*10,188,1,4,'rgba(255,255,255,.55)')}
    if(idx%2===0){var yd=((idx/2)|0)%10;yd=yd>5?10-yd:yd;if(yd){g.font='8px "Press Start 2P", monospace';g.textAlign='center';g.textBaseline='top';g.fillStyle='rgba(255,255,255,.5)';g.fillText(yd+'0',x0,126);g.fillText(yd+'0',x0,204)}}}
  for(x0=-(d%80)-80;x0<W;x0+=80)g.drawImage(grassC,x0,118);
  R(0,118,W,3,'rgba(255,255,255,.9)');R(0,121,W,1,'rgba(0,40,10,.25)');
  var art=ok(qbImg)&&ok(lineImg)&&ok(defImg),pre=ph==='intro'||ph==='set',lxd=cx+D.lx,items=[];
  function shadow(x,y,w){R(x-w/2,y-1,w,3,'rgba(20,50,30,.42)');R(x-w/2+3,y+2,w-6,1,'rgba(20,50,30,.42)')}
  function flipCell(img,f,cw,ch,ax,x,base){g.save();g.translate(Math.round(x),0);g.scale(-1,1);cell(img,f,cw,ch,ax,0,base);g.restore()}
  function add(y,fn){items.push({y:y,fn:fn})}
  /* the wall he cannot get past: his own line */
  if(D.wall&&lxd<W+120)[0,1,2].forEach(function(k){var y=GY+30*(k-1),x=lxd+[24,0,-24][k];add(y,function(){
    if(art){shadow(x+4,y,44);cell(lineImg,((t*7+k)|0)%3,144,127,54,x,y);var rx=x+76+Math.round(Math.sin(t*19+k*2));shadow(rx,y,44);cell(defImg,0,135,128,79,rx,y)}
    else{fb(x,y,[ROCK2,ROCK3,ROCK2][k],{rot:.5,a:t*9+k,amp:.3});fb(x+60,y,ADM,{flip:true,rot:.5,a:t*9,amp:.3})}})});
  (D.obs||[]).forEach(function(o){var y=GY+30*(o.ln-1),x=cx+o.x;add(y+.1,function(){
    if(o.hit){g.save();g.globalAlpha=Math.max(0,1-o.fall*1.3);g.translate(x+o.fall*40,y-o.fall*46);g.rotate(o.fall*5);if(art)cell(defImg,0,135,128,79,0,30);else fb(0,30,ADM,{flip:true});g.restore();return}
    shadow(x,y,40);if(art)flipCell(defImg,1+(((t*11+o.v)|0)%2),135,128,79,x,y);else fb(x,y,ADM2,{flip:true,a:t*20,amp:1})})});
  var held=!(ph==='bonk'||ph==='loose'||ph==='scoop'||ph==='end'),y0=GY+30*((held?D.lyf:D.bonkLn)-1),fy=held?y0:y0+(GY+33-y0)*D.lane,fx=cx+D.fx,ff;
  if(pre)ff=((t*2)|0)%2;else if(ph==='run')ff=D.stun>0?5:2+(((t*12)|0)%3);else if(ph==='bonk')ff=tt<.5?5:6;else ff=7;
  add(fy+.2,function(){if(art){shadow(fx,fy,ff>5?64:36);cell(qbImg,ff,156,142,82,fx,fy-(ph==='loose'&&S.v>.4?1:0))}else{fb(fx,fy,ROCK,{rot:held?0:1.5,a:t*14,amp:held?.8:0});if(held)ball(fx+13,fy-36,-.5)}});
  var carried=ph==='scoop'||ph==='end',dy=GY+33;
  if(D.dgo||carried)add(dy+.3,function(){var ddx=cx+D.dx;
    if(!art)fb(ddx,dy,ADM2,{flip:true,a:t*20,amp:1});
    else{shadow(ddx,dy,40);if(carried&&tt<.32)flipCell(defImg,3,135,128,79,ddx,dy);else{flipCell(defImg,1+(((t*10)|0)%2),135,128,79,ddx,dy);if(carried)ball(ddx-12,dy-36,.4)}}});
  if(!held&&!carried&&(ph!=='bonk'||tt>.12))add(fy+.25,function(){var bxs=cx+D.bx,sw=Math.max(6,16+D.by*.1);R(bxs-sw/2,fy,sw,2,'rgba(30,60,40,.4)');ball(bxs,fy+D.by-6,D.brot)});
  items.sort(function(a,b){return a.y-b.y});for(i=0;i<items.length;i++)items[i].fn();
  if(D.say&&t-D.sayT<(D.say==='JUKE!'||D.say==='OOF!'?.7:1.4)){var big=D.say==='BONK!',tdn=D.say==='TOUCHDOWN ADMIRALS',close=D.say==='SO CLOSE!';
    burst(D.say,tdn?cx:close?cx+D.bx:fx+(big?22:0),tdn?70:close?fy-26:fy-84,big?16:8,close?'#ffffff':D.say==='OOF!'?'#ff9a8a':'#ffd27a',D.sayT)}
  if(D.td&&t-D.sayT>=1.4)burst('TOUCHDOWN ADMIRALS',cx,70,8,'#ffd27a',t-9);
  g.setTransform(2,0,0,2,0,0);
  if(ph==='intro'){var al=Math.min(1,tt/.6)*Math.min(1,(3-tt)/.5);g.globalAlpha=Math.max(0,al);R(0,58,W,58,'rgba(20,21,29,.82)');g.textAlign='center';g.textBaseline='top';g.font='8px "Press Start 2P", monospace';
    g.fillStyle='#6fd08a';g.fillText('RUSHVILLE ROCKETS',cx,66);g.fillStyle='#ffffff';g.fillText('VS',cx,82);g.fillStyle='#7f9bff';g.fillText('HARBOR CITY ADMIRALS',cx,98);g.globalAlpha=1}
  R(0,0,W,H,'rgba(236,238,244,.1)');var vg=g.createRadialGradient(cx,H/2,H*.38,cx,H/2,W*.62);vg.addColorStop(0,'rgba(255,255,255,0)');vg.addColorStop(1,'rgba(255,255,255,'+(.55+.08*Math.sin(t*1.5)).toFixed(2)+')');g.fillStyle=vg;g.fillRect(0,0,W,H);
  if(C.flash>0)R(0,0,W,H,'rgba(255,255,255,'+(C.flash*.6).toFixed(2)+')');
  if(D.white>0)R(0,0,W,H,'rgba(255,255,255,'+D.white.toFixed(2)+')')}
