/* The Driveway Kumite (level 2-3): the argument in Moose's garage, played as an 80s tournament fighting game inside Frank's head.
   L throws an excuse, R blocks. Moose blocks most excuses with a fact, and every block costs Frank some of his EXCUSES bar.
   Round 1, then a training flashback (mash L and R to hold the splits), then the final round: Frank oils his own eyes, so the screen is dark, slow and the pads are swapped.
   It cannot be won. When the excuses run out Frank throws THE FUMBLE, Moose stops it with one hand, and the garage is just a garage again. */
var fightBg=load('fight_bg.webp'),fightF=load('fight_frank.png'),fightM=load('fight_moose.png'),fightFace=load('fight_faces.png');
/* frames in each sheet: x, y, width, height, and where the body's middle is. Both sheets: 0 stance, 1 jab, 2 overhand, 3 kick, 4 jump kick, 5 hit, then
   Frank: 6 splits, 7 scream, 8 arms over face, 9 eyes shut listening, 10 knocked out, 11 kneeling. Moose: 6 crouch, 7 roar, 8 block, 9 palm out, 10 knocked out, 11 kneeling */
var FSPR=[[0,0,136,182,72],[138,0,190,179,80],[330,0,157,188,80],[489,0,177,180,72],[668,0,188,129,95],[858,0,136,175,74],[0,190,237,122,119],[239,190,150,169,72],[391,190,121,161,58],[514,190,111,164,53],[627,190,237,66,118],[866,190,134,121,71]];
var MSPR=[[0,0,133,193,66],[135,0,209,184,77],[346,0,153,202,76],[501,0,204,197,80],[707,0,204,155,90],[913,0,136,177,66],[0,204,201,125,101],[203,204,169,165,91],[374,204,139,155,69],[515,204,196,160,73],[713,204,231,65,115],[946,204,140,124,75]];
var FT_EX=['THE REFS!','THE WIND!','THE TURF!','MY AGENT!','THE SUN!','THE PLAYBOOK!','THE SNAP COUNT!','MY CLEATS!','THE CROWD!','THE LINE!'];
var FT_FACT={'THE REFS!':'NO FLAG, FRANK.','THE WIND!':'IT WAS A DOME.','THE TURF!':'IT WAS A DOME.','MY AGENT!':'YOU FIRED HIM.','THE SUN!':'NIGHT GAME.','THE PLAYBOOK!':'YOU WROTE IT.','THE SNAP COUNT!':'YOU CALLED IT.','MY CLEATS!':'YOU PICKED THEM.','THE CROWD!':'HOME GAME.','THE LINE!':'I WAS THE LINE.'};
var FT_BILL=['MY CAR, FRANK.','THE MAILBOX.','THE HOSE.','THE HOAGIES.','THE FRUIT STAND.','MY INSURANCE.'];
var FT={on:false,ph:'',t0:0,clk:0,ts:1,F:{},M:{},words:[],shake:0,flash:0,mash:0,last:'',ex:0,bill:0,mNext:0,say:null,ko:0,done:false,fin:0};

/* the kumite track */
var fightMus=new Audio('assets/audio/kumite.mp3'),fightWanted=false;fightMus.loop=true;fightMus.preload='auto';fightMus.volume=.5;
function primeFightMusic(){if(fightWanted)return;try{fightMus.muted=true;var p=fightMus.play();if(p&&p.then)p.then(function(){fightMus.muted=false;if(fightWanted)return;fightMus.pause();fightMus.currentTime=0},function(){fightMus.muted=false})}catch(e){}}
function startFightMusic(){fightWanted=true;try{gameMus.pause();fightMus.muted=false;fightMus.currentTime=0;if(!muted){var p=fightMus.play();if(p&&p.catch)p.catch(function(){})}}catch(e){}}
function stopFightMusic(){if(!fightWanted)return;fightWanted=false;try{fightMus.pause();if(!muted&&S.mode!=='title'){var p=gameMus.play();if(p&&p.catch)p.catch(function(){})}}catch(e){}}

function ftPhase(n){FT.ph=n;FT.t0=FT.clk;FT.q=0}
function ftOnce(n){if((FT.q||0)<n){FT.q=n;return true}return false}
function fightOff(){FT.on=false;FT.ph='';cv.style.filter='';stopFightMusic()}
function ftSet(o,st,d){o.st=st;o.t0=FT.clk;o.d=d||0}
function gong(){if(!audio())return;try{var t=ac.currentTime;tone(t,98,2.6,'sine',.3);tone(t,147,2.2,'triangle',.12);tone(t,196.5,1.8,'sine',.08);noise(t,.5,.12,'bandpass',900,2)}catch(e){}}
function whoosh(){if(!audio())return;try{noise(ac.currentTime,.14,.08,'bandpass',1400,1.2)}catch(e){}}
function startFight(){if(typeof stopOff==='function')stopOff();if(typeof drvStop==='function')drvStop();S.mode='fight';FT.on=true;FT.clk=0;FT.ts=1;FT.F={hp:100,st:'idle',t0:0,d:0,atk:0};FT.M={hp:100,st:'idle',t0:0,d:0,atk:0};FT.words=[];FT.shake=0;FT.flash=0;FT.mash=0;FT.last='';FT.ex=0;FT.bill=0;FT.mNext=3;FT.say=null;FT.ko=0;FT.done=false;FT.endR=false;FT.blocks=0;FT.hits=0;
  cv.style.filter='';endBox.hidden=true;tug.hidden=true;hint.hidden=true;padsOn(true);padL.classList.remove('next');padR.classList.remove('next');lvl.innerHTML="MOOSE'S GARAGE<br>LEVEL 2-3";barlab.textContent='EXCUSES';track.style.width='0%';ftMeter();ftPhase('talk');startFightMusic()}
function ftMeter(){var on=Math.ceil(Math.max(0,FT.F.hp)/100*6-.001);for(var i=0;i<6;i++)segs[i].className=i<on?'on':''}
function ftWord(txt,x,y,vx,col,size){FT.words.push({t:txt,x:x,y:y,vx:vx,col:col,s:size||8,t0:FT.clk})}
function ftSay(who,txt,d){FT.say={who:who,t:txt,t0:FT.clk,d:d||1.4}}

/* Frank throws an excuse */
function ftAttack(){var F=FT.F,M=FT.M,r2=FT.ph==='r2';if(F.st!=='idle')return;F.atk=(F.atk+1)%3;ftSet(F,'atk',.34);F.land=false;whoosh();
  F.word=r2&&Math.random()<.5?'THE... UH...':FT_EX[FT.ex++%FT_EX.length]}
function ftBlock(){var F=FT.F;if(F.st!=='idle')return;ftSet(F,'block',.55)}
function fightTap(side){var ph=FT.ph;
  if(ph==='talk'||ph==='vs'||ph==='oil'||ph==='after'){var k=FT.clk-FT.t0;if(k>.6)FT.t0-=1.2;return}
  if(ph==='flash'){if(FT.clk-FT.t0<1.5)return;if(side!==FT.last){FT.last=side;FT.mash=Math.min(1,FT.mash+.075);blip(300+FT.mash*500,.04,.03)}return}
  if(ph!=='r1'&&ph!=='r2')return;if(FT.clk-FT.t0<1.8||FT.endR)return;hint.hidden=true;
  var atk=ph==='r2'?side==='R':side==='L';if(atk)ftAttack();else ftBlock()}

function fightUpdate(dt0){var dt=dt0*FT.ts;FT.clk+=dt;var t=FT.clk,tt=t-FT.t0,F=FT.F,M=FT.M,ph=FT.ph,i;
  FT.shake=Math.max(0,FT.shake-dt0*3.5);FT.flash=Math.max(0,FT.flash-dt0*2.5);
  for(i=FT.words.length-1;i>=0;i--){var w=FT.words[i];w.x+=w.vx*dt;w.y-=14*dt;if(t-w.t0>1.1)FT.words.splice(i,1)}
  if(ph==='talk'){if(tt>7.4){ftPhase('vs');gong();FT.flash=1}}
  else if(ph==='vs'){if(tt>3.4){ftPhase('r1');hint.textContent='L = EXCUSE     R = BLOCK';hint.hidden=false}}
  else if(ph==='r1'||ph==='r2'){var r2=ph==='r2',live=tt>1.8;
    if(tt>1&&ftOnce(1))gong();
    /* Frank's excuse reaches Moose: blocked with a fact, or it lands */
    if(F.st==='atk'&&!F.land&&t-F.t0>.13){F.land=true;var fx=W/2-10;
      if(r2&&Math.random()<.7){ftWord(F.word,fx-30,112,40,'#9aa0b0');ftWord('?',W/2+48,96,0,'#f6f3e8',10)}
      else if(M.st==='idle'&&Math.random()<(r2?1:.6)){ftSet(M,'block',.4);F.hp-=r2?4:3.5;FT.blocks++;ftWord(F.word,fx-30,112,40,'#ff6a5e');ftSay('M',FT_FACT[F.word]||'NO.',1.2);thump(.12)}
      else{var ww=M.st==='wind';ftSet(M,'hit',.34);M.hp=Math.max(8,M.hp-(ww?11:7));FT.hits++;FT.shake=.5;S.score+=300;ftWord(F.word,fx-30,112,40,'#ffd27a');ftWord('POW!',W/2+44,98,10,'#ffffff',10);thump(.3);if(ww)FT.mNext=t+1.4}}
    if(F.st!=='idle'&&F.st!=='ko'&&t-F.t0>F.d)ftSet(F,'idle');
    if((M.st==='block'||M.st==='hit')&&t-M.t0>M.d)ftSet(M,'idle');
    /* Moose: a roar to warn, then the bill, delivered by hand or by boot */
    if(live&&!FT.endR&&M.st==='idle'&&t>FT.mNext){ftSet(M,'wind',r2?.5:.62);if(audio())try{tone(ac.currentTime,90,.4,'sawtooth',.08,500,sfxG,60)}catch(e){}}
    if(M.st==='wind'&&t-M.t0>M.d){M.atk=(M.atk+1)%3;ftSet(M,'atk',.36);M.land=false;whoosh()}
    if(M.st==='atk'&&!M.land&&t-M.t0>.14){M.land=true;var line=FT_BILL[FT.bill++%FT_BILL.length];
      if(F.st==='block'){F.hp-=2;ftWord('BLOCKED',W/2-56,104,-8,'#9be37a');thump(.14);S.score+=150}
      else{F.hp-=r2?13:10;ftSet(F,'hit',.4);FT.shake=.9;FT.flash=.3;ftWord(line,W/2+20,116,-46,'#ff6a5e');thump(.35,true)}}
    if(M.st==='atk'&&t-M.t0>M.d){ftSet(M,'idle');FT.mNext=t+(r2?1.1:1.9)+Math.random()*1.1}
    F.hp=Math.max(0,F.hp);ftMeter();scoreEl.textContent=pad6(S.score);track.style.width=(r2?55+Math.min(45,tt*3):Math.min(50,tt*2))+'%';
    if(live&&(r2?(F.hp<=12||tt>13):(M.hp<=50||F.hp<=42||tt>26)))FT.endR=true;
    if(!r2&&FT.endR&&F.st==='idle'&&M.st==='idle'){FT.endR=false;ftPhase('flash');FT.mash=0;FT.last='';hint.hidden=true;FT.say=null}
    if(r2&&FT.endR&&F.st==='idle'&&M.st==='idle'){FT.endR=false;ftPhase('fin');FT.ts=.6;hint.hidden=true;FT.say=null;ftSet(F,'idle');ftSet(M,'idle')}}
  else if(ph==='flash'){if(tt>1.5&&tt<6.5)FT.mash=Math.max(0,FT.mash-dt*.22);
    if(tt>6.5&&ftOnce(1)){F.hp=Math.min(100,F.hp+(FT.mash>.7?35:22));ftMeter();if(typeof DR!=='undefined')DR.dmg=(DR.dmg||0)+60;blip(523,.1,.04);setTimeout(function(){blip(784,.14,.04)},100)}
    if(tt>8.4)ftPhase('oil')}
  else if(ph==='oil'){if(tt>.2&&ftOnce(1)){if(audio())try{noise(ac.currentTime,.5,.08,'bandpass',600,3)}catch(e){}}
    if(tt>6.6){ftPhase('r2');FT.ts=.62;cv.style.filter='blur(.7px) saturate(.6)';FT.mNext=FT.clk+2.6;hint.textContent="YOU CAN'T SEE.\nL AND R ARE SWAPPED.";hint.hidden=false}}
  else if(ph==='fin'){
    if(tt>1.5&&ftOnce(1)){whoosh();ftSet(F,'fly')}
    if(tt>2.3&&ftOnce(2)){thump(.3);FT.shake=.4;ftSet(M,'palm')}
    if(tt>5.9&&ftOnce(3)){FT.ko=t;FT.shake=1.4;FT.flash=1;thump(.45,true);gong();ftSet(F,'ko');F.hp=0;ftMeter()}
    if(tt>8.2){ftPhase('after');FT.ts=1;cv.style.filter='';padsOn(true);padL.classList.remove('next');padR.classList.remove('next')}}
  else if(ph==='after'){if(tt>11&&!FT.done){FT.done=true;ftPhase('end');S.mode='over';padsOn(false);
      S.stat+='<br>EXCUSES THROWN: '+FT.ex+'  LANDED: '+FT.hits+'  SHUT DOWN: '+FT.blocks;
      endText.textContent='Every excuse Frank has, Moose has heard. The refs, the wind, the turf, the line. "Frank. That was twenty years ago." Out of things to say, Frank does the one thing he has left. He runs.';
      stat.innerHTML=(S.stat+'<br>TO BE CONTINUED').replace(/^<br>/,'');endBox.hidden=false}}}

/* ---- drawing ---- */
function ftSpr(img,tab,i,x,fy,flip,sc,rot){if(!ok(img))return;var r=tab[i];sc=sc||1;g.save();g.translate(Math.round(x),Math.round(fy));if(rot)g.rotate(rot);g.scale(flip?-sc:sc,sc);g.drawImage(img,r[0],r[1],r[2],r[3],-r[4]/2,-r[3]/4,r[2]/2,r[3]/2);g.restore()}
function ftFace(i,x,y,w,flip){if(!ok(fightFace))return;var h=w*333/246;g.save();g.translate(x,y);if(flip)g.scale(-1,1);g.drawImage(fightFace,i*250+2,0,246,333,-w/2,0,w,h);g.restore()}
function ftBar(x,y,w,frac,col,left,name,sub){R(x-1,y-1,w+2,9,OUT);R(x,y,w,7,'#3a1512');var fw=Math.max(0,Math.round(w*frac));R(left?x+w-fw:x,y,fw,7,col);R(x,y,w,1,'rgba(255,255,255,.35)');
  drvText(name,left?x:x+w,y+14,6,'#f6f3e8',left?'left':'right');drvText(sub,left?x+w:x,y+14,5,'#ffd27a',left?'right':'left')}
function ftCard(lines,a){g.globalAlpha=a;R(0,0,W,H,'#05060f');lines.forEach(function(l){drvText(l[0],W/2,l[1],l[2],l[3])});g.globalAlpha=1}
function drawFight(){var t=FT.clk,tt=t-FT.t0,ph=FT.ph,F=FT.F,M=FT.M,sh=FT.shake,i,k=Math.max(1,W/432),ox=(W-432*k)/2,oy=H-216*k,G=H-32,fx=W/2-50,mx=W/2+50;
  g.setTransform(2,0,0,2,sh?(Math.random()-.5)*8*sh:0,sh?(Math.random()-.5)*6*sh:0);
  R(-8,-8,W+16,H+16,'#05060f');
  if(ph==='talk'){var L=[["MOOSE'S GARAGE. 11:48 PM.",40,7,'#ffd27a']],sc=[[1,'MOOSE','The car. The hose. The hoagies.'],[2.6,'MOOSE','This is on you, Frank.'],[4.2,'FRANK','YOU KNOW WHAT THIS IS REALLY ABOUT.'],[5.8,'FRANK','EVER SINCE THAT FUMBLE'+(tt>6.6?'...':'')]];
    sc.forEach(function(s,n){if(tt>s[0]){drvText(s[1],W/2-Math.min(150,W*.4),74+n*26,6,s[1]==='FRANK'?'#ff6a5e':'#9ec3ff','left');drvText(s[2],W/2-Math.min(150,W*.4),85+n*26,W<400?6:7,'#f6f3e8','left')}});
    L.forEach(function(l){drvText(l[0],W/2,l[1],l[2],l[3])});if(tt>6.9)R(0,0,W,H,'rgba(0,0,0,'+Math.min(1,(tt-6.9)/.5).toFixed(2)+')');return}
  var dark=ph==='r2'||ph==='fin';
  g.save();g.translate(ox,oy);g.scale(k,k);if(ok(fightBg))g.drawImage(fightBg,0,0,432,216);g.restore();
  if(ph==='after'||ph==='end'){/* the lanterns go out: it is a garage again */R(0,0,W,H,'rgba(190,200,215,.2)')}
  if(ph==='vs'){R(0,0,W,H,'rgba(5,6,15,.82)');var u=Math.min(1,tt/.35),e=1-Math.pow(1-u,3),pw=Math.min(150,W*.32);
    ftFace(0,W/2-(W/2+pw)*(1-e)-pw*.78,H-pw*1.2,pw,false);ftFace(1,W/2+(W/2+pw)*(1-e)+pw*.78,H-pw*1.2,pw,false);
    R(0,H-22,W,22,'#05060f');drvText('FRANK',W/2-pw*.78,H-11,8,'#ff6a5e');drvText('MOOSE',W/2+pw*.78,H-11,8,'#9ec3ff');
    if(tt>.4)burst('VS',W/2,H/2+34,22,'#ffd27a',FT.t0+.4);
    R(0,36,W,44,'rgba(5,6,15,.8)');drvText('LEVEL 2-3',W/2,44,7,'#ffd27a');drvText('THE DRIVEWAY KUMITE',W/2,58,W<400?9:12,'#f6f3e8');drvText('INSTINCT: BLAME',W/2,72,6,'#ff6a5e');
    if(FT.flash>0)R(0,0,W,H,'rgba(255,255,255,'+FT.flash.toFixed(2)+')');return}
  if(ph==='flash'){R(0,0,W,H,'rgba(120,80,30,.45)');
    if(tt<1.5){drvText('TRAINING FLASHBACK',W/2,H/2-8,W<400?10:14,'#ffd27a');drvText('(LAST TUESDAY)',W/2,H/2+12,7,'#f6f3e8');return}
    var cy=G-2,dip=Math.round((1-FT.mash)*8),wob=tt<6.5?Math.sin(t*30)*(1-FT.mash)*2:0;
    [-1,1].forEach(function(d){var cx2=W/2+d*52;R(cx2-11,cy-34,22,3,OUT);R(cx2-10,cy-33,20,2,'#c9cbd8');R(cx2-10,cy-33,2,33,'#8d8fa3');R(cx2+8,cy-33,2,33,'#8d8fa3');R(cx2-10,cy-56,2,24,'#8d8fa3');R(cx2-10,cy-56,20,3,'#3fa35a');R(cx2-10,cy-48,20,3,'#f6f3e8')});
    ftSpr(fightF,FSPR,6,W/2+wob,cy-36+dip,false,.92);
    if(tt<6.5){drvText('HOLD THE SPLITS',W/2,56,9,'#ffd27a');drvText('TAP L, R, L, R',W/2,70,6,'#f6f3e8');R(W/2-71,80,142,10,OUT);R(W/2-70,81,140,8,'#3a1512');R(W/2-70,81,Math.round(140*FT.mash),8,FT.mash>.7?'#9be37a':'#ffd27a');drvText(Math.max(0,Math.ceil(6.5-tt))+'',W/2,102,10,'#f6f3e8')}
    else{drvText(FT.mash>.7?'FLEXIBILITY: MAXIMUM':'CLOSE ENOUGH',W/2,60,W<400?8:10,'#9be37a');drvText('EXCUSES RESTORED',W/2,76,7,'#ffd27a');drvText('+ 2 LAWN CHAIRS  $60',W/2,92,6,'#ff6a5e')}
    return}
  if(ph==='oil'){R(0,0,W,H,'rgba(5,6,15,.86)');var pw2=Math.min(140,W*.34);ftFace(tt<3.4?0:3,W*.3,H-pw2*1.35,pw2,false);
    var ls=[[.4,'FRANK','HE CHEATED. HE BLINDED ME.','#ff6a5e'],[1.9,'MOOSE','Nobody touched you.','#9ec3ff'],[3.4,'FRANK','HOAGIE OIL. IN MY EYES.','#ff6a5e'],[4.4,'MOOSE','You did that. I watched you.','#9ec3ff'],[5.4,'FRANK','I FIGHT BETTER BLIND.','#ff6a5e']];
    var yy=50;ls.forEach(function(s){if(tt>s[0]){drvText(s[1],W*.52,yy,6,s[3],'left');yy+=10;stopWrap(s[2],W<400?16:24).forEach(function(l){drvText(l,W*.52,yy,W<400?6:7,'#f6f3e8','left');yy+=9});yy+=6}});return}
  /* the fighters */
  var fy=G+Math.round(Math.sin(t*6)*1),my=G+Math.round(Math.sin(t*5+1)*1),ff=0,mf=0,fdx=0,mdx=0,fk=0,frot=0,fsc=1;
  if(F.st==='atk'){ff=[1,2,3][F.atk];fdx=Math.sin(Math.min(1,(t-F.t0)/F.d)*Math.PI)*12}else if(F.st==='block')ff=8;else if(F.st==='hit'){ff=5;fdx=-6}
  else if(F.st==='idle')ff=dark?9:0;
  if(M.st==='atk'){mf=[1,2,3][M.atk];mdx=-Math.sin(Math.min(1,(t-M.t0)/M.d)*Math.PI)*14}else if(M.st==='block')mf=8;else if(M.st==='hit'){mf=5;mdx=6}else if(M.st==='wind')mf=7;else if(M.st==='palm')mf=9;
  if(ph==='r1'||ph==='r2'){R(fx-24,G-1,48,3,'rgba(0,0,0,.4)');R(mx-26,G-1,52,3,'rgba(0,0,0,.4)');ftSpr(fightM,MSPR,mf,mx+mdx,my-MSPR[mf][3]/4,true);ftSpr(fightF,FSPR,ff,fx+fdx,fy-FSPR[ff][3]/4,false);
    if(M.st==='wind')burst('!',mx-6,G-116,14,'#ff6a5e',M.t0)}
  else if(ph==='fin'){R(mx-26,G-1,52,3,'rgba(0,0,0,.4)');
    if(tt<1.5){ftSpr(fightM,MSPR,0,mx,my-MSPR[0][3]/4,true);R(fx-24,G-1,48,3,'rgba(0,0,0,.4)');ftSpr(fightF,FSPR,7,fx,fy-FSPR[7][3]/4,false)}
    else if(!FT.ko){var u2=Math.min(1,(tt-1.5)/.8),px=fx+(mx-58-fx)*u2,py=G-58-Math.sin(u2*Math.PI)*16;ftSpr(fightM,MSPR,tt>2.1?9:0,mx,my-MSPR[9][3]/4,true);ftSpr(fightF,FSPR,4,px,py,false,1,0)}
    else{var kq=t-FT.ko,bx2=Math.max(W*.16,fx-kq*150),land=kq>.5;ftSpr(fightM,MSPR,kq<.6?9:0,mx,my-MSPR[0][3]/4,true);
      if(!land)ftSpr(fightF,FSPR,5,mx-58-(mx-58-bx2)*(kq/.5),G-50-Math.sin(kq/.5*Math.PI)*22,false,1,-kq*3);else{R(W*.16+20-44,G-1,88,3,'rgba(0,0,0,.4)');ftSpr(fightF,FSPR,10,W*.16+20,G-FSPR[10][3]/4+2,false)}}}
  else if(ph==='after'||ph==='end'){var kn=tt>3.2||ph==='end';R(W*.16+20-34,G-1,68,3,'rgba(0,0,0,.4)');ftSpr(fightF,FSPR,kn?11:10,W*.16+20,G-FSPR[kn?11:10][3]/4+2,false)}
  g.setTransform(2,0,0,2,0,0);
  /* fighting blind: dark at the edges */
  if(dark){var vg=g.createRadialGradient(W/2,H*.6,H*.18,W/2,H*.6,W*.6);vg.addColorStop(0,'rgba(0,0,0,.25)');vg.addColorStop(1,'rgba(0,0,0,.93)');g.fillStyle=vg;g.fillRect(0,0,W,H)}
  for(i=0;i<FT.words.length;i++){var w=FT.words[i];g.globalAlpha=Math.max(0,1-(t-w.t0)/1.1);drvText(w.t,w.x,w.y,w.s,w.col);g.globalAlpha=1}
  if(FT.say&&t-FT.say.t0<FT.say.d&&(ph==='r1'||ph==='r2'))stopBubble(mx+4,G-104,FT.say.t,'#1a1a26',W<400?14:18);
  /* bars */
  if(ph==='r1'||ph==='r2'||ph==='fin'){var wide=W>=420,by=wide?8:60,x0=wide?108:8,bw=(W-x0*2-26)/2;
    ftBar(x0,by,bw,F.hp/100,'#ffd23a',true,'FRANK','EXCUSES');ftBar(W-x0-bw,by,bw,M.hp/100,'#4aa3ff',false,'MOOSE','PATIENCE');
    drvText(ph==='fin'?'--':String(Math.max(0,99-Math.floor(tt*3))),W/2,by+4,8,'#f6f3e8');
    if(ph!=='fin'&&tt<1)burst(ph==='r1'?'ROUND 1':'FINAL ROUND',W/2,H/2-10,W<400?14:18,'#ffd27a',FT.t0);else if(ph!=='fin'&&tt<1.8)burst(ph==='r1'?'ARGUE!':'ARGUE BLIND!',W/2,H/2-10,W<400?16:22,'#ff6a5e',FT.t0+1)}
  if(ph==='fin'){var pw3=Math.min(120,W*.3);
    if(tt<1.5){R(0,H/2-34,W,68,'rgba(5,6,15,.9)');ftFace(2,W*.24,H/2-34-pw3*.2,pw3*.78,false);drvText('EVER SINCE',W*.62,H/2-14,W<400?8:10,'#f6f3e8');burst('THAT FUMBLE!',W*.62,H/2+10,W<400?12:16,'#ff6a5e',FT.t0+.5)}
    else if(!FT.ko){if(tt>2.6&&tt<3.9)stopBubble(mx,G-110,'FRANK.','#1a1a26');else if(tt>=3.9)stopBubble(mx-6,G-110,'THAT WAS TWENTY YEARS AGO.','#1a1a26',W<400?13:18)}
    else if(t-FT.ko<2.2)burst('K.O.',W/2,H/2-6,W<400?30:40,'#ff3a2a',FT.ko)}
  if(ph==='after'){var pw4=Math.min(110,W*.28),ls2=[[1,'MOOSE','You done?','#9ec3ff'],[3.4,'FRANK','...THE WIND WAS','#ff6a5e'],[4.8,'MOOSE','Frank.','#9ec3ff'],[6.4,'FRANK','...','#ff6a5e'],[8,'MOOSE',"I'm getting a broom. Don't touch anything.",'#9ec3ff']];
    ftFace(1,W-pw4*.6,H-pw4*1.35,pw4,false);
    var cur=null;ls2.forEach(function(s){if(tt>s[0])cur=s});
    if(cur){var who=cur[1]==='MOOSE';stopBubble(who?W-pw4*.9:W*.16+24,who?H-pw4*1.35+10:G-70,cur[2],cur[3]==='#ff6a5e'?'#c2281f':'#1a1a26',W<400?14:20)}
    if(tt>10.2)R(0,0,W,H,'rgba(0,0,0,'+Math.min(.5,(tt-10.2)/.8*.5).toFixed(2)+')')}
  if(ph==='end')R(0,0,W,H,'rgba(0,0,0,.5)');
  if(FT.flash>0)R(0,0,W,H,'rgba(255,255,255,'+(FT.flash*.7).toFixed(2)+')')}
