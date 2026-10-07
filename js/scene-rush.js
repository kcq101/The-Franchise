/* Hoagie Fest: the inside of the Jawn (level 2-2). Dot has seen the chase on TV; she will not call it in if Frank and Moose work the rush.
   A memory game: Dot calls a hoagie one ingredient at a time, then the player taps the same ingredients in the same order on the rail of bins along the bottom of the screen.
   A right hoagie goes to Moose, who wraps it and calls the ticket. A wrong one is binned and costs a strike; three strikes and Dot picks up the phone.
   Moose will repeat an order up to three times in the whole rush. Ten hoagies wins. The bins and hoagie are drawn in code until there is art for them. */
var RUSH_ING=[['OIL & VIN','#d8b23a'],['HAM','#e58a9a'],['SALAMI','#b4332c'],['TURKEY','#d9b48a'],['CHEESE','#f2cf4a'],['LETTUCE','#5fb04a'],['TOMATO','#e0452f'],['ONION','#b98ad0']];
var RUSH_NOTE=[262,294,330,349,392,440,494,523];
/* each hoagie: how many ingredients, how many bins are in play, how long each call is shown */
var RUSH_PLAN=[[3,5,.8],[3,5,.8],[4,6,.7],[4,6,.7],[5,6,.62],[5,8,.58],[6,8,.54],[6,8,.5],[7,8,.47],[7,8,.45]];
var RUSH_DEAL=[['TV','...RED SPORTS CAR. DRIVER IN A HOSPITAL GOWN.'],['W',"Hon. That's you."],['F','DIFFERENT GUY.'],['W',"It's Hoagie Fest. Forty tickets and nobody showed up for shift."],['W','Aprons on. You make hoagies, I forget what I saw.'],['M','We will take it.']];
var RUSH_BAD=["That's a salad, Frank.",'Who starts with onion?',"I'm not wrapping that.",'Dot said HAM.'],RUSH_KID=['MISTER, ARE YOU ON TV?','WHY ARE YOU IN A DRESS?','CAN I HAVE YOUR CHIPS?','MY DAD SAYS YOU FUMBLED.'];
var RU={st:'',t0:0,n:0,seq:[],pos:0,call:0,strikes:0,life:3,retry:false,lit:-1,litT:0,line:null,dl:0,kidT:0,kidA:0,kidL:'',made:0,perfect:0,lay:[],wrapT:0,msg:'',msgT:0};
var padsEl=document.querySelector('.pads');
function rushSt(s){RU.st=s;RU.t0=S.clock}
function rushPads(show){if(padsEl)padsEl.style.visibility=show?'':'hidden'}
function rushStart(){rushPads(false);RU.n=0;RU.strikes=0;RU.life=3;RU.made=0;RU.perfect=0;RU.line=null;RU.dl=0;RU.lit=-1;RU.kidT=0;RU.lay=[];RU.msg='';ST.won=false;ST.news=true;
  barlab.textContent='STRIKES LEFT';rushMeter();track.style.width='0%';hint.hidden=true;rushSt('deal')}
function rushMeter(){var on=6-RU.strikes*2;for(var i=0;i<6;i++)segs[i].className=i<on?'on':''}
function rushNew(){var p=RUSH_PLAN[RU.n],seq=[],last=-1;for(var i=0;i<p[0];i++){var k;do{k=(Math.random()*p[1])|0}while(k===last);seq.push(k);last=k}RU.seq=seq;RU.retry=false;RU.kidOn=0;rushCall()}
function rushCall(){RU.pos=0;RU.call=-1;RU.lay=[];RU.clean=true;rushPads(false);rushSt('call')}
function rushNote(i,bad){if(!audio())return;try{var t=ac.currentTime;if(bad){tone(t,110,.35,'sawtooth',.09,700);tone(t,104,.35,'square',.05,600)}else tone(t,RUSH_NOTE[i],.22,'square',.06,2400)}catch(e){}}
function rushPick(i){if(RU.st!=='play')return;var p=RUSH_PLAN[RU.n];if(i>=p[1])return;RU.lit=i;RU.litT=S.clock;
  if(i===RU.seq[RU.pos]){RU.lay.push(i);RU.pos++;rushNote(i);if(RU.pos>=RU.seq.length){RU.made++;if(RU.clean&&!RU.retry)RU.perfect++;S.score+=RU.seq.length*100+(RU.retry?0:200);scoreEl.textContent=pad6(S.score);rushSt('wrap');RU.msg='NUMBER '+(41+RU.n)+'!';RU.msgT=S.clock;setTimeout(function(){blip(660,.08,.04)},260);setTimeout(function(){blip(990,.12,.04)},340)}}
  else{rushNote(i,true);RU.strikes++;rushMeter();ST.shake=.6;RU.msg=RUSH_BAD[(RU.strikes+RU.n)%RUSH_BAD.length];RU.msgT=S.clock;rushSt('ruin')}}
function rushAsk(){if(RU.st!=='play'||RU.life<=0)return;RU.life--;RU.clean=false;RU.msg='Again. Listen this time.';RU.msgT=S.clock;rushCall()}
/* a tap on the screen: which bin, or the ask-Moose button */
function rushGeom(){var bw=(W-8)/8,y0=H-38;return{bw:bw,y0:y0,mx:W-86,my:y0-24,mw:82,mh:20}}
function rushPoint(x,y){var G=rushGeom();if(RU.st==='deal'){RU.dl=-9;return}
  if(y>=G.y0-2){rushPick(Math.max(0,Math.min(7,Math.floor((x-4)/G.bw))))}else if(x>=G.mx&&y>=G.my&&y<=G.my+G.mh)rushAsk()}
stage.addEventListener('pointerdown',function(e){if(S.mode!=='stop'||ST.ph!=='in')return;if(e.target&&e.target.tagName==='BUTTON')return;var r=cv.getBoundingClientRect();rushPoint((e.clientX-r.left)/r.width*W,(e.clientY-r.top)/r.height*H)});
window.addEventListener('keydown',function(e){if(S.mode!=='stop'||ST.ph!=='in'||e.repeat)return;if(RU.st==='deal'){RU.dl=-9;return}if(e.key>='1'&&e.key<='8')rushPick(+e.key-1);else if(e.key==='m'||e.key==='M')rushAsk()});
function rushTap(){if(RU.st==='deal')RU.dl=-9}
function rushUpdate(dt){var t=S.clock,tt=t-RU.t0,p=RUSH_PLAN[Math.min(9,RU.n)];
  if(RU.st==='deal'){if(!RU.line||RU.dl<0||t-RU.line.t0>2.3){if(RU.line&&RU.line.i>=RUSH_DEAL.length-1){RU.line=null;rushNew();return}var i=RU.line?RU.line.i+1:0;RU.line={i:i,t0:t};RU.dl=0;blip(RUSH_DEAL[i][0]==='W'?430:RUSH_DEAL[i][0]==='M'?150:300,.05,.03)}}
  else if(RU.st==='call'){var step=p[2]+.16,k=Math.floor((tt-.7)/step);if(tt>.7&&k!==RU.call&&k<RU.seq.length){RU.call=k;RU.lit=RU.seq[k];RU.litT=t;rushNote(RU.seq[k])}
    if(tt>.7+RU.seq.length*step+.25){rushSt('play');RU.lit=-1;RU.kidT=RU.n>=2&&Math.random()<.7?t+.6+Math.random()*1.2:0}}
  else if(RU.st==='play'){var lim=RU.seq.length*1.9+3;
    if(RU.kidT&&t>RU.kidT&&!RU.kidOn){RU.kidOn=t;RU.kidA=(Math.random()*(p[1]-2))|0;RU.kidL=RUSH_KID[(RU.n+RU.strikes)%RUSH_KID.length];blip(640,.06,.03)}
    if(RU.kidOn&&t-RU.kidOn>1.5){RU.kidOn=0;RU.kidT=0}
    if(tt>lim){rushNote(0,true);RU.strikes++;rushMeter();RU.msg='Too slow. Number '+(41+RU.n)+' walked.';RU.msgT=t;rushSt('ruin')}}
  else if(RU.st==='wrap'){RU.kidOn=0;if(tt>1.7){RU.n++;track.style.width=RU.n*10+'%';if(RU.n>=10){rushSt('done');RU.line={i:0,t0:t}}else rushNew()}}
  else if(RU.st==='ruin'){RU.kidOn=0;if(tt>1.6){if(RU.strikes>=3){rushSt('fired');RU.line={i:0,t0:t}}else if(!RU.retry){RU.retry=true;rushCall()}else{RU.n++;track.style.width=RU.n*10+'%';if(RU.n>=10){rushSt('done');RU.line={i:0,t0:t}}else rushNew()}}}
  else if(RU.st==='done'||RU.st==='fired'){if(tt>5.2){ST.won=RU.st==='done';rushPads(true);padsOn(false);stopPhase('out')}}}

/* ---- drawing ---- */
function rushIcon(i,cx,cy,dim){var c=RUSH_ING[i][1];g.globalAlpha=dim?.25:1;
  if(i===0){R(cx-9,cy-9,7,17,OUT);R(cx-8,cy-6,5,13,'#d8b23a');R(cx-7,cy-10,3,4,'#f6f3e8');R(cx+2,cy-9,7,17,OUT);R(cx+3,cy-6,5,13,'#7a2a1e');R(cx+4,cy-10,3,4,'#f6f3e8')}
  else if(i===1||i===3){R(cx-11,cy-6,22,13,OUT);R(cx-10,cy-5,20,11,c);R(cx-10,cy-5,20,2,'rgba(255,255,255,.35)');R(cx-6,cy,12,1,'rgba(0,0,0,.15)')}
  else if(i===2||i===6||i===7){g.fillStyle=OUT;g.beginPath();g.arc(cx,cy,10,0,TAU);g.fill();g.fillStyle=c;g.beginPath();g.arc(cx,cy,9,0,TAU);g.fill();
    if(i===2){[[-4,-3],[3,-2],[-1,4],[4,4],[-5,2]].forEach(function(d){R(cx+d[0],cy+d[1],2,2,'#f3d9d0')})}
    else if(i===6){g.fillStyle='#f6a08a';g.beginPath();g.arc(cx,cy,5,0,TAU);g.fill();[[-2,-2],[2,-1],[0,2]].forEach(function(d){R(cx+d[0],cy+d[1],1,2,'#f8e3a0')})}
    else{g.strokeStyle='#f1e2fa';g.lineWidth=1.5;[6,3].forEach(function(r){g.beginPath();g.arc(cx,cy,r,0,TAU);g.stroke()})}}
  else if(i===4){g.fillStyle=OUT;g.beginPath();g.moveTo(cx-12,cy+7);g.lineTo(cx+12,cy+7);g.lineTo(cx+12,cy-4);g.lineTo(cx-12,cy-9);g.closePath();g.fill();g.fillStyle=c;g.beginPath();g.moveTo(cx-11,cy+6);g.lineTo(cx+11,cy+6);g.lineTo(cx+11,cy-3);g.lineTo(cx-11,cy-7.5);g.closePath();g.fill();R(cx-6,cy-1,3,3,'#c9a22a');R(cx+3,cy+1,3,3,'#c9a22a')}
  else{for(var k=-2;k<=2;k++){g.fillStyle=OUT;g.beginPath();g.arc(cx+k*4.5,cy+(k%2?-2:1),6,0,TAU);g.fill()}for(k=-2;k<=2;k++){g.fillStyle=k%2?'#7fd060':c;g.beginPath();g.arc(cx+k*4.5,cy+(k%2?-2:1),5,0,TAU);g.fill()}}
  g.globalAlpha=1}
function rushHoagie(cx,by,lay,wrapped){var w=96,i;
  if(wrapped){R(cx-w/2-1,by-15,w+2,17,OUT);R(cx-w/2,by-14,w,15,'#f6f3e8');R(cx-w/2,by-14,w,3,'#ffffff');R(cx-8,by-14,3,15,'#d8d2c4');R(cx+14,by-10,10,7,'#c2281f');return}
  R(cx-w/2-1,by-7,w+2,9,OUT);R(cx-w/2,by-6,w,7,'#d9a35a');R(cx-w/2,by-6,w,2,'#eec07e');
  for(i=0;i<lay.length;i++){var y=by-9-i*4;R(cx-w/2+3,y-1,w-6,5,OUT);R(cx-w/2+4,y,w-8,3,RUSH_ING[lay[i]][1])}
  if(lay.length){var ty=by-10-lay.length*4;R(cx-w/2-1,ty-6,w+2,8,OUT);R(cx-w/2,ty-5,w,6,'#d9a35a');R(cx-w/2,ty-5,w,2,'#f2cc8c')}}
function drawRush(t){var k=Math.max(W/472,Math.min(1,W/380)),ox=Math.max(W-472*k,-8*k),oy=H-216*k-26,i,st=RU.st,tt=t-RU.t0,p=RUSH_PLAN[Math.min(9,RU.n)],G=rushGeom();
  R(-8,-8,W+16,H+16,'#2a1c14');
  g.save();g.translate(ox,oy);g.scale(k,k);g.translate(40,0);
  if(ok(stopBg)){g.drawImage(stopBg,0,0,432,216);g.save();g.scale(-1,1);g.drawImage(stopBg,0,0,123,648,-.5,0,41,216);g.restore()}
  R(293,45,61,34,((t*3)|0)%2?'#123a7a':'#0f3168');R(306,60,26,8,'#c2281f');R(311,56,12,5,'#c2281f');R(309,67,6,3,'#111');R(324,67,6,3,'#111');R(293,72,61,7,'#c2281f');stopText('LIVE',296,48,5,'#ffffff');
  R(106,45,186,34,'rgba(16,18,34,.93)');stopText('HOAGIE FEST',110,49,8,'#ffd27a');stopText('NOW SERVING  '+(41+Math.min(9,RU.n)),110,62,6,'#f6f3e8');stopText('HOAGIES OUT  '+RU.made+' OF 10',110,70,6,'#9be37a');
  /* the three of them behind the counter: Dot calling, Frank building, Moose wrapping */
  var dotTalk=st==='call'||(RU.line&&((st==='deal'&&RUSH_DEAL[RU.line.i][0]==='W')||st==='done'||st==='fired'));
  g.save();g.beginPath();g.rect(128,84,142,47);g.clip();
  stopCast(dotTalk?6:5,150,138,true,.85);stopCast(st==='ruin'?2:st==='play'?0:1,202,169,false,.78);stopCast(st==='wrap'||st==='ruin'?4:3,246,171,false,.78);g.restore();
  g.restore();
  function P(x,y){return [ox+(x+40)*k,oy+y*k]}
  var pd=P(150,90),pf=P(202,86),pm=P(246,84),mc=W<400?16:22;
  /* the rail of bins */
  R(0,G.y0-3,W,H-G.y0+3,OUT);R(0,G.y0-2,W,H-G.y0+2,'#3a3d4c');R(0,G.y0-2,W,2,'#c9cbd8');
  for(i=0;i<8;i++){var x=4+i*G.bw,inPlay=i<p[1],lit=RU.lit===i&&t-RU.litT<(st==='call'?p[2]:.22);
    R(x+1,G.y0,G.bw-2,36,OUT);R(x+2,G.y0+1,G.bw-4,34,lit?'#fff3b0':inPlay?'#dfe3ea':'#55596a');R(x+2,G.y0+1,G.bw-4,3,lit?'#ffffff':'rgba(255,255,255,.5)');
    rushIcon(i,x+G.bw/2,G.y0+15,!inPlay);g.globalAlpha=inPlay?1:.3;stopText(RUSH_ING[i][0],x+G.bw/2,G.y0+28,W<400?4:5,lit?'#c2281f':'#1a1a26','center');g.globalAlpha=1;
    if(lit&&st==='call'){g.strokeStyle='#ffd23a';g.lineWidth=2;g.strokeRect(x+1,G.y0,G.bw-2,36)}}
  /* the hoagie on the board, and where it goes */
  var bx=W/2,by=G.y0-8;
  if(st==='play'||st==='call'){rushHoagie(bx,by,RU.lay,false)}
  else if(st==='wrap'){var u=Math.min(1,tt/.5),u2=Math.max(0,Math.min(1,(tt-.9)/.6));rushHoagie(bx+(pm[0]-bx)*u*.6+u2*u2*(W-bx+80),by-u*6,RU.lay,tt>.5)}
  else if(st==='ruin'){g.save();g.translate(bx-tt*60,by+tt*tt*70);g.rotate(-tt*2.2);rushHoagie(0,0,RU.lay,false);g.restore()}
  /* Dot's call, one ingredient at a time */
  if(st==='call'){if(tt<.7)stopBubble(pd[0],pd[1],RU.retry?'One more time, hon.':'NUMBER '+(41+RU.n)+'!','#1a1a26',mc);
    else if(RU.call>=0&&t-RU.litT<p[2]){var nm=RUSH_ING[RU.seq[RU.call]][0];stopBubble(pd[0],pd[1],nm+(RU.call<RU.seq.length-1?',':'.'),'#c2281f',mc);drvText((RU.call+1)+' / '+RU.seq.length,bx,G.y0-44,6,'#ffd27a')}}
  if(st==='play'){var lim=RU.seq.length*1.9+3,fr=Math.max(0,1-tt/lim);R(bx-51,G.y0-52,102,6,OUT);R(bx-50,G.y0-51,100,4,'#3a1512');R(bx-50,G.y0-51,Math.round(100*fr),4,fr<.3?'#ff5a4a':'#9be37a');
    drvText(RU.pos+' / '+RU.seq.length,bx,G.y0-60,6,'#f6f3e8');if(tt<.8)burst('YOUR TURN',bx,G.y0-76,W<400?10:12,'#ffd27a',RU.t0);
    /* ask Moose */
    R(G.mx-1,G.my-1,G.mw+2,G.mh+2,OUT);R(G.mx,G.my,G.mw,G.mh,RU.life?'#1b2f5a':'#3a3d4c');R(G.mx,G.my,G.mw,2,RU.life?'#9ec3ff':'#6a6d82');drvText('ASK MOOSE',G.mx+G.mw/2,G.my+7,5,RU.life?'#f6f3e8':'#8a8d9a');drvText(RU.life+' LEFT',G.mx+G.mw/2,G.my+15,5,RU.life?'#ffd27a':'#8a8d9a')}
  if(RU.msg&&t-RU.msgT<1.6&&(st==='wrap'||st==='ruin'||st==='call'))stopBubble(pm[0],pm[1],RU.msg,st==='ruin'?'#c2281f':'#1a1a26',mc);
  if(st==='ruin')burst(RU.strikes>=3?'STRIKE THREE':'STRIKE '+RU.strikes,bx,G.y0-70,W<400?12:14,'#ff5a4a',RU.t0);
  /* the kid, getting in the way */
  if(RU.kidOn&&st==='play'){var kx=4+RU.kidA*G.bw,kw=G.bw*3;stopCast(8,kx+kw/2,H+10,false,1.15);R(kx-1,G.y0-13,kw+2,22,OUT);R(kx,G.y0-12,kw,20,'#f6f3e8');stopWrap(RU.kidL,Math.max(8,Math.floor(kw/6.2))).slice(0,2).forEach(function(l,n){stopText(l,kx+4,G.y0-9+n*8,W<400?5:6,'#1a1a26')})}
  /* the deal going in, and how it ends */
  var L=RU.line,lines=st==='deal'?RUSH_DEAL:st==='done'?[['W','Huh. Ten for ten out the door.'],['W',"Deal's a deal. Two on the house. Go."]]:st==='fired'?[['W',"That's three, hon. I'm calling it in."],['F','RUN.']]:null;
  if(lines&&L){var li=st==='deal'?L.i:Math.min(lines.length-1,Math.floor((t-RU.t0)/2.6)),ln=lines[li];
    if(ln[0]==='TV'){R(0,G.y0-30,W,24,OUT);R(0,G.y0-29,W,22,'#123a7a');R(0,G.y0-29,W,8,'#c2281f');stopText('JAWN TV   BREAKING NEWS',6,G.y0-28,5,'#ffffff');stopText(ln[1],6,G.y0-18,W<400?5:6,'#ffffff')}
    else{var pp=ln[0]==='W'?pd:ln[0]==='F'?pf:pm;stopBubble(pp[0],pp[1],ln[1],ln[0]==='F'?'#c2281f':'#1a1a26',mc)}
    if(st==='deal'&&((t*2)|0)%2)drvText('TAP TO SKIP',W/2,G.y0-8,5,'#ffd27a')}
  if(st==='done')burst('RUSH CLEARED',W/2,56,W<400?12:16,'#9be37a',RU.t0)}
