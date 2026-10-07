/* Hoagie Fest: the inside of the Jawn (level 2-2). Dot has seen the chase on TV; she will not call it in if Frank and Moose work the rush.
   It opens out front, where Dot makes the deal, then cuts to behind the counter, looking over Frank's shoulder with Moose on his right. Moose gives the instructions and the player presses a button when ready.
   A memory game: Dot calls a hoagie one ingredient at a time, then the player taps the same ingredients in the same order on the bins set into the counter.
   A right hoagie goes to Moose, who wraps it and calls the ticket. A wrong one is binned and costs a strike; three strikes and Dot picks up the phone.
   Moose will repeat an order up to three times in the whole rush. Ten hoagies wins. The bins and hoagie are drawn in code until there is art for them. */
var RUSH_ING=[['OIL & VIN','#d8b23a'],['HAM','#e58a9a'],['SALAMI','#b4332c'],['TURKEY','#d9b48a'],['CHEESE','#f2cf4a'],['LETTUCE','#5fb04a'],['TOMATO','#e0452f'],['ONION','#b98ad0']];
var RUSH_NOTE=[262,294,330,349,392,440,494,523];
/* each hoagie: how many ingredients, how many bins are in play, how long each call is shown */
var RUSH_PLAN=[[3,5,.8],[3,5,.8],[4,6,.7],[4,6,.7],[5,6,.62],[5,8,.58],[6,8,.54],[6,8,.5],[7,8,.47],[7,8,.45]];
var RUSH_DEAL=[['TV','...RED SPORTS CAR. DRIVER IN A HOSPITAL GOWN.'],['W',"I knew I recognized you. You're the gown guy off the TV."],['F','DIFFERENT GOWN.'],['W','I really should be calling the cops right now.'],['W',"But it's Hoagie Fest. Forty tickets up and nobody showed for shift."],['W','You and your big friend get me through this rush, I keep my mouth shut.'],['F','WHAT DOES THAT MEAN?'],['M','It means we make hoagies, Frank.'],['W','Scrub up. Get behind the counter. Do exactly what I tell you.']];
var RUSH_PEP=[['M','Frank. This is our chance to walk out of here. No cops.'],['M','So put your game face on and do what Dot says. Word for word.'],['F',"I'VE READ DEFENSES HARDER THAN A HOAGIE."],['M','You have never read a defense.']];
var RUSH_HOW='Dot calls the order. You tap the bins in the SAME order. Three wrong and she calls the cops. Stuck? Hit ASK MOOSE. Three times, tops.';
var RUSH_BAD=["That's a salad, Frank.",'Who starts with onion?',"I'm not wrapping that.",'Dot said HAM.'],RUSH_KID=['MISTER, ARE YOU ON TV?','WHY ARE YOU IN A DRESS?','CAN I HAVE YOUR CHIPS?','MY DAD SAYS YOU FUMBLED.'];
var RU={st:'',t0:0,n:0,seq:[],pos:0,call:0,strikes:0,life:3,retry:false,lit:-1,litT:0,line:null,dl:0,kidT:0,kidA:0,kidL:'',made:0,perfect:0,lay:[],wrapT:0,msg:'',msgT:0};
var padsEl=document.querySelector('.pads');
function rushSt(s){RU.st=s;RU.t0=S.clock}
function rushPads(show){if(padsEl)padsEl.style.visibility=show?'':'hidden'}
function rushStart(){rushPads(false);RU.n=0;RU.strikes=0;RU.life=3;RU.made=0;RU.perfect=0;RU.line=null;RU.dl=0;RU.lit=-1;RU.kidT=0;RU.kidOn=0;RU.lay=[];RU.msg='';ST.won=false;ST.news=true;
  barlab.textContent='STRIKES LEFT';rushMeter();track.style.width='0%';hint.hidden=true;rushSt('deal')}
function rushMeter(){var on=6-RU.strikes*2;for(var i=0;i<6;i++)segs[i].className=i<on?'on':''}
function rushNew(){var p=RUSH_PLAN[RU.n],seq=[],last=-1;for(var i=0;i<p[0];i++){var k;do{k=(Math.random()*p[1])|0}while(k===last);seq.push(k);last=k}RU.seq=seq;RU.retry=false;RU.kidOn=0;rushCall()}
function rushCall(){RU.pos=0;RU.call=-1;RU.lay=[];RU.clean=true;rushPads(false);rushSt('call')}
function rushNote(i,bad){if(!audio())return;try{var t=ac.currentTime;if(bad){tone(t,110,.35,'sawtooth',.09,700);tone(t,104,.35,'square',.05,600)}else tone(t,RUSH_NOTE[i],.22,'square',.06,2400)}catch(e){}}
function rushPick(i){if(RU.st!=='play')return;var p=RUSH_PLAN[RU.n];if(i>=p[1])return;RU.lit=i;RU.litT=S.clock;
  if(i===RU.seq[RU.pos]){RU.lay.push(i);RU.pos++;rushNote(i);if(RU.pos>=RU.seq.length){RU.made++;if(RU.clean&&!RU.retry)RU.perfect++;S.score+=RU.seq.length*100+(RU.retry?0:200);scoreEl.textContent=pad6(S.score);rushSt('wrap');RU.msg='NUMBER '+(41+RU.n)+'!';RU.msgT=S.clock;setTimeout(function(){blip(660,.08,.04)},260);setTimeout(function(){blip(990,.12,.04)},340)}}
  else{rushNote(i,true);RU.strikes++;rushMeter();ST.shake=.6;RU.msg=RUSH_BAD[(RU.strikes+RU.n)%RUSH_BAD.length];RU.msgT=S.clock;rushSt('ruin')}}
function rushAsk(){if(RU.st!=='play'||RU.life<=0)return;RU.life--;RU.clean=false;RU.msg='Again. Listen this time.';RU.msgT=S.clock;rushCall()}
/* where things are behind the counter: the row of bins, the ask-Moose button, the cutting board and the ready button */
function rushGeom(){var bw=(W-8)/8,bx=Math.round(Math.min(W/2,W-146));return{bw:bw,y0:106,bh:36,mx:W-88,my:150,mw:84,mh:22,bx:bx,by:177,rx:Math.round(W/2-78),ry:58,rw:156,rh:30}}
function rushGo(){if(RU.st!=='ready')return;blip(660,.08,.05);setTimeout(function(){blip(880,.1,.05)},90);RU.line=null;rushNew()}
function rushNext(){if(RU.line&&S.clock-RU.line.t0>.35)RU.dl=-9}
function rushPoint(x,y){var G=rushGeom(),st=RU.st;if(st==='deal'||st==='pep'){rushNext();return}
  if(st==='ready'){if(x>=G.rx-6&&x<=G.rx+G.rw+6&&y>=G.ry-6&&y<=G.ry+G.rh+6)rushGo();return}
  if(y>=G.y0-3&&y<=G.y0+G.bh+4){rushPick(Math.max(0,Math.min(7,Math.floor((x-4)/G.bw))))}else if(x>=G.mx-4&&y>=G.my-4&&y<=G.my+G.mh+6)rushAsk()}
stage.addEventListener('pointerdown',function(e){if(S.mode!=='stop'||ST.ph!=='in')return;if(e.target&&e.target.tagName==='BUTTON')return;var r=cv.getBoundingClientRect();rushPoint((e.clientX-r.left)/r.width*W,(e.clientY-r.top)/r.height*H)});
window.addEventListener('keydown',function(e){if(S.mode!=='stop'||ST.ph!=='in'||e.repeat)return;var st=RU.st;if(st==='deal'||st==='pep'){rushNext();return}if(st==='ready'){if(e.key==='Enter'||e.key===' ')rushGo();return}if(e.key>='1'&&e.key<='8')rushPick(+e.key-1);else if(e.key==='m'||e.key==='M')rushAsk()});
function rushTap(){if(RU.st==='deal'||RU.st==='pep')rushNext()}
/* a line of talk stays up long enough to read; a tap moves on to the next one */
function rushTalk(lines,t){if(!RU.line){RU.line={i:0,t0:t};RU.dl=0;rushBlip(lines[0][0]);return false}
  var L=RU.line,dur=Math.max(3.2,1.4+lines[L.i][1].length*.07);if(RU.dl<0||t-L.t0>dur){RU.dl=0;if(L.i>=lines.length-1){RU.line=null;return true}RU.line={i:L.i+1,t0:t};rushBlip(lines[L.i+1][0])}return false}
function rushBlip(w){blip(w==='W'?430:w==='M'?150:w==='TV'?520:300,.05,.03)}
function rushUpdate(dt){var t=S.clock,tt=t-RU.t0,p=RUSH_PLAN[Math.min(9,RU.n)];
  if(RU.st==='deal'){if(rushTalk(RUSH_DEAL,t)){rushSt('cut');whoosh&&whoosh()}}
  else if(RU.st==='cut'){if(tt>2){rushSt('pep');RU.line=null}}
  else if(RU.st==='pep'){if(rushTalk(RUSH_PEP,t)){rushSt('ready');blip(150,.05,.03)}}
  else if(RU.st==='ready'){}
  else if(RU.st==='call'){var step=p[2]+.16,k=Math.floor((tt-.9)/step);if(tt>.9&&k!==RU.call&&k<RU.seq.length){RU.call=k;RU.lit=RU.seq[k];RU.litT=t;rushNote(RU.seq[k])}
    if(tt>.9+RU.seq.length*step+.25){rushSt('play');RU.lit=-1;RU.kidT=RU.n>=2&&Math.random()<.7?t+.6+Math.random()*1.2:0}}
  else if(RU.st==='play'){var lim=RU.seq.length*1.9+3;
    if(RU.kidT&&t>RU.kidT&&!RU.kidOn){RU.kidOn=t;RU.kidA=(Math.random()*(p[1]-2))|0;RU.kidL=RUSH_KID[(RU.n+RU.strikes)%RUSH_KID.length];blip(640,.06,.03)}
    if(RU.kidOn&&t-RU.kidOn>1.5){RU.kidOn=0;RU.kidT=0}
    if(tt>lim){rushNote(0,true);RU.strikes++;rushMeter();RU.msg='Too slow. Number '+(41+RU.n)+' walked.';RU.msgT=t;rushSt('ruin')}}
  else if(RU.st==='wrap'){RU.kidOn=0;if(tt>1.7){RU.n++;track.style.width=RU.n*10+'%';if(RU.n>=10){rushSt('done');RU.line={i:0,t0:t}}else rushNew()}}
  else if(RU.st==='ruin'){RU.kidOn=0;if(tt>1.6){if(RU.strikes>=3){rushSt('fired');RU.line={i:0,t0:t}}else if(!RU.retry){RU.retry=true;rushCall()}else{RU.n++;track.style.width=RU.n*10+'%';if(RU.n>=10){rushSt('done');RU.line={i:0,t0:t}}else rushNew()}}}
  else if(RU.st==='done'||RU.st==='fired'){if(tt>5.6){ST.won=RU.st==='done';rushPads(true);padsOn(false);stopPhase('out')}}}

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
  for(i=0;i<lay.length;i++){var y=by-9-i*3;R(cx-w/2+3,y-1,w-6,5,OUT);R(cx-w/2+4,y,w-8,3,RUSH_ING[lay[i]][1])}
  if(lay.length){var ty=by-10-lay.length*3;R(cx-w/2-1,ty-6,w+2,8,OUT);R(cx-w/2,ty-5,w,6,'#d9a35a');R(cx-w/2,ty-5,w,2,'#f2cc8c')}}
function rushLab(txt){var w=txt.length*6+12;R(W/2-w/2,83,w,11,'rgba(16,18,34,.9)');stopText(txt,W/2,86,6,'#ffd27a','center')}
/* a plain box of wrapped text with its top at a given height, for places a bubble would end up under the score panel */
function rushBox(cx,top,txt,col,max){var lines=stopWrap(txt,max||22),w=Math.max.apply(null,lines.map(function(l){return l.length}))*7+10,h=lines.length*10+7,x=Math.round(Math.max(4,Math.min(W-w-4,cx-w/2)));top=Math.round(top);
  R(x-1,top-1,w+2,h+2,OUT);R(x,top,w,h,'#f6f3e8');lines.forEach(function(l,n){stopText(l,x+5,top+5+n*10,7,col)});return h}
/* out front: Dot in the pick-up window, Moose and Frank on the shop floor, the chase on the television */
function drawRushFront(t){var k=Math.max(W/472,Math.min(1,W/380)),ox=Math.max(W-472*k,-8*k),oy=H-216*k,F=206,mx=6,fx=308,wx=178,L=RU.line,ln=L&&RU.st==='deal'?RUSH_DEAL[L.i]:null,who=ln?ln[0]:'';
  R(-8,-8,W+16,H+16,'#2a1c14');
  g.save();g.translate(ox,oy);g.scale(k,k);g.translate(40,0);
  if(ok(stopBg)){g.drawImage(stopBg,0,0,432,216);g.save();g.scale(-1,1);g.drawImage(stopBg,0,0,123,648,-.5,0,41,216);g.restore()}
  R(293,45,61,34,((t*3)|0)%2?'#123a7a':'#0f3168');R(306,60,26,8,'#c2281f');R(311,56,12,5,'#c2281f');R(309,67,6,3,'#111');R(324,67,6,3,'#111');R(293,72,61,7,'#c2281f');stopText('LIVE',296,48,5,'#ffffff');
  R(106,45,186,34,'rgba(16,18,34,.93)');stopText('HOAGIE FEST',110,49,8,'#ffd27a');stopText('NOW SERVING  41',110,62,6,'#f6f3e8');stopText('40 TICKETS WAITING',110,70,6,'#ff8a7a');
  g.save();g.beginPath();g.rect(128,90,142,41);g.clip();stopCast(who==='W'?6:5,wx,138,who!=='M',.85);g.restore();
  R(mx-20,F,40,3,'rgba(0,0,0,.35)');stopCast(who==='M'?4:3,mx,F+2,true,1);
  R(fx-20,F+1,40,3,'rgba(0,0,0,.35)');stopCast(who==='F'?1:who==='W'?2:0,fx,F+3,true,1);
  g.restore();
  function P(x,y){return [ox+(x+40)*k,oy+y*k]}
  if(ln){var mc=W<400?17:24;
    if(who==='TV'){R(0,H-38,W,26,OUT);R(0,H-37,W,24,'#123a7a');R(0,H-37,W,9,'#c2281f');stopText('JAWN TV   BREAKING NEWS',6,H-35,5,'#ffffff');stopText(ln[1],6,H-24,W<400?5:6,'#ffffff')}
    else{var pp=who==='W'?P(wx,94):who==='F'?P(fx-2,F-106):P(mx+8,F-112);stopBubble(pp[0],Math.max(pp[1],92),ln[1],who==='F'?'#c2281f':'#1a1a26',mc)}
    if(((t*2)|0)%2&&t-L.t0>1)drvText('TAP FOR NEXT',W/2,H-6,5,'#ffd27a')}}
/* behind the counter, over Frank's shoulder: customers across the counter, Dot at the far end calling, the bins set into the steel, Moose on the right */
var RUSH_SHIRT=['#c2281f','#2f6fb0','#3d8a4a','#d9a12a','#7a4aa0','#d8d2c4','#1f7a78'],RUSH_SKIN=['#e7b48c','#c98a5e','#f0c8a4','#8a5a3a'];
function drawRushBack(t){var st=RU.st,tt=t-RU.t0,p=RUSH_PLAN[Math.min(9,RU.n)],G=rushGeom(),i,bx=G.bx,by=G.by,dx=34,fxb=Math.max(34,bx-78),mxb=W-46,talk=st==='pep'||st==='ready',L=RU.line;
  /* the shop beyond the counter */
  R(-8,-8,W+16,H+16,'#2a1c14');R(0,0,W,100,'#c9a468');for(i=0;i<8;i++)R(0,10+i*12,W,1,'rgba(90,60,30,.25)');
  R(0,22,W,34,'#14203a');for(i=0;i<W;i+=58){R(i,22,3,34,'#5a4630')}R(0,20,W,3,'#5a4630');R(0,55,W,3,'#5a4630');R(0,58,W,42,'#b08a56');
  for(i=0;i<W/40+1;i++){var sx=i*40+((i*17)%9);R(sx,62,30,22,'#6a4a2e');R(sx+2,64,26,5,RUSH_SHIRT[i%7]);R(sx+2,71,26,5,RUSH_SHIRT[(i+3)%7]);R(sx+2,78,26,5,RUSH_SHIRT[(i+5)%7])}
  /* the ticket board */
  R(W/2-67,5,134,30,OUT);R(W/2-66,6,132,28,'#10121f');stopText('HOAGIE FEST',W/2,9,7,'#ffd27a','center');stopText('NOW SERVING '+(41+Math.min(9,RU.n))+'   OUT '+RU.made+' OF 10',W/2,22,5,'#9be37a','center');
  /* the line of customers */
  var nc=Math.floor((W-94)/40);for(i=0;i<nc;i++){var cx=98+i*40+((i*13)%7),bob=Math.round(Math.sin(t*2+i*1.7)*1.2),sh=RUSH_SHIRT[(i*3+1)%7],sk=RUSH_SKIN[i%4];
    R(cx-13,78+bob,26,24,OUT);R(cx-12,79+bob,24,23,sh);R(cx-12,79+bob,24,3,'rgba(255,255,255,.2)');g.fillStyle=OUT;g.beginPath();g.arc(cx,69+bob,9,0,TAU);g.fill();g.fillStyle=sk;g.beginPath();g.arc(cx,69+bob,8,0,TAU);g.fill();R(cx-8,61+bob,16,5,i%3?'#2a1a12':'#8a8d9a');R(cx-4,68+bob,2,2,OUT);R(cx+2,68+bob,2,2,OUT)}
  /* the kid leans over from the customer side */
  if(RU.kidOn&&st==='play')stopCast(8,4+RU.kidA*G.bw+G.bw*1.5,78,false,.75);
  /* Dot, at the end of the counter */
  var dotTalk=st==='call'||((st==='done'||st==='fired')&&L);stopCast(dotTalk?6:5,dx+6,91,true,1.1);
  /* the counter */
  R(0,97,W,4,OUT);R(0,98,W,2,'#f2f4f8');R(0,100,W,82,'#aeb2c0');R(0,100,W,2,'#d6d9e2');for(i=0;i<W;i+=22)R(i,146,12,1,'rgba(255,255,255,.18)');R(0,180,W,3,OUT);R(0,183,W,H-183,'#3a2a20');
  for(i=0;i<8;i++){var x=4+i*G.bw,inPlay=i<p[1]||talk,lit=RU.lit===i&&t-RU.litT<(st==='call'?p[2]:.22)&&!talk;
    R(x+1,G.y0,G.bw-2,G.bh,OUT);R(x+2,G.y0+1,G.bw-4,G.bh-2,lit?'#fff3b0':inPlay?'#e6e9ef':'#6a6e7e');R(x+2,G.y0+1,G.bw-4,4,'rgba(0,0,0,.22)');R(x+2,G.y0+1,2,G.bh-2,'rgba(0,0,0,.14)');
    rushIcon(i,x+G.bw/2,G.y0+16,!inPlay);g.globalAlpha=inPlay?1:.3;stopText(RUSH_ING[i][0],x+G.bw/2,G.y0+28,W<400?4:5,lit?'#c2281f':'#1a1a26','center');g.globalAlpha=1;
    if(lit&&st==='call'){g.strokeStyle='#ffd23a';g.lineWidth=2;g.strokeRect(x+1,G.y0,G.bw-2,G.bh)}}
  /* the cutting board and the hoagie on it */
  R(bx-57,by-27,114,30,OUT);R(bx-56,by-26,112,28,'#d8b98a');R(bx-56,by-26,112,2,'#ecd4ac');
  if(st==='play'||st==='call'){rushHoagie(bx,by-3,RU.lay,false)}
  else if(st==='wrap'){var u=Math.min(1,tt/.5),u2=Math.max(0,Math.min(1,(tt-.9)/.6));rushHoagie(bx+(W-74-bx)*u+u2*u2*150,by-3-u2*74,RU.lay,tt>.5)}
  else if(st==='ruin'){g.save();g.translate(bx-tt*70,by-3+tt*tt*60);g.rotate(-tt*2.2);rushHoagie(0,0,RU.lay,false);g.restore()}
  /* Frank's back and Moose's, nearest the camera */
  R(fxb-34,201,68,20,OUT);R(fxb-33,202,66,18,'#a9d3e6');R(fxb-2,202,4,18,'#7fb2c8');R(fxb-7,206,5,2,'#f6f3e8');R(fxb+2,206,5,2,'#f6f3e8');R(fxb-7,196,14,8,'#d9a37c');
  g.fillStyle=OUT;g.beginPath();g.arc(fxb,186,16,0,TAU);g.fill();g.fillStyle='#2a1a12';g.beginPath();g.arc(fxb,186,15,0,TAU);g.fill();R(fxb-13,188,26,12,'#2a1a12');R(fxb-9,176,8,2,'#4a3222');R(fxb-17,184,3,6,'#d9a37c');R(fxb+14,184,3,6,'#d9a37c');
  R(mxb-45,198,90,22,OUT);R(mxb-44,199,88,20,'#27406e');R(mxb-44,199,88,3,'#3a5a94');R(mxb-10,192,20,9,'#c98f68');R(mxb-9,196,18,1,'#a87250');
  g.fillStyle=OUT;g.beginPath();g.arc(mxb,180,18,0,TAU);g.fill();g.fillStyle='#d9a37c';g.beginPath();g.arc(mxb,180,17,0,TAU);g.fill();R(mxb-8,168,10,2,'#efc4a0');R(mxb-20,178,4,7,'#c98f68');R(mxb+16,178,4,7,'#c98f68');R(mxb-10,190,20,1,'#a87250');
  var mc=W<400?17:22,wide=Math.max(20,Math.min(46,Math.floor((W-24)/7)));
  /* Dot calling the order, one ingredient at a time, in the middle of the screen */
  if(st==='call'){rushLab(RU.retry?"ONE MORE TIME - LISTEN":"DOT'S CALLING - LISTEN");
    if(tt<.9)rushBox(W/2,44,RU.retry?'One more time, hon.':'Number '+(41+RU.n)+'!','#1a1a26',wide);
    else if(RU.call>=0&&t-RU.litT<p[2]){var c=RU.seq[RU.call],nm=RUSH_ING[c][0],bwid=Math.max(96,nm.length*10+34);R(W/2-bwid/2-1,41,bwid+2,28,OUT);R(W/2-bwid/2,42,bwid,26,'#f6f3e8');R(W/2-bwid/2,42,6,26,RUSH_ING[c][1]);R(W/2+bwid/2-6,42,6,26,RUSH_ING[c][1]);stopText(nm,W/2,51,10,'#c2281f','center');drvText((RU.call+1)+' OF '+RU.seq.length,W/2,76,5,'#f6f3e8')}}
  if(st==='play'){var lim=RU.seq.length*1.9+3,fr=Math.max(0,1-tt/lim);R(0,96,W,6,OUT);R(0,97,W,4,'#3a1512');R(0,97,Math.round(W*fr),4,fr<.3?'#ff5a4a':'#9be37a');
    rushLab('YOUR TURN - TAP THE BINS   '+RU.pos+' OF '+RU.seq.length);if(tt<.8)burst('YOUR TURN',W/2,60,W<400?12:14,'#ffd27a',RU.t0);
    R(G.mx-1,G.my-1,G.mw+2,G.mh+2,OUT);R(G.mx,G.my,G.mw,G.mh,RU.life?'#1b2f5a':'#3a3d4c');R(G.mx,G.my,G.mw,2,RU.life?'#9ec3ff':'#6a6d82');drvText('ASK MOOSE',G.mx+G.mw/2,G.my+8,5,RU.life?'#f6f3e8':'#8a8d9a');drvText(RU.life+' LEFT',G.mx+G.mw/2,G.my+16,5,RU.life?'#ffd27a':'#8a8d9a')}
  if(RU.msg&&t-RU.msgT<1.6&&(st==='wrap'||st==='ruin'||st==='call'))stopBubble(mxb,164,RU.msg,st==='ruin'?'#c2281f':'#1a1a26',mc);
  if(st==='ruin')burst(RU.strikes>=3?'STRIKE THREE':'STRIKE '+RU.strikes,W/2,62,W<400?12:14,'#ff5a4a',RU.t0);
  if(RU.kidOn&&st==='play'){var kx=4+RU.kidA*G.bw,kw=G.bw*3;R(kx-1,G.y0-1,kw+2,26,OUT);R(kx,G.y0,kw,24,'#f6f3e8');stopWrap(RU.kidL,Math.max(8,Math.floor(kw/6.2))).slice(0,2).forEach(function(l,n){stopText(l,kx+4,G.y0+4+n*9,W<400?5:6,'#1a1a26')})}
  /* Moose's pep talk; his instructions stay up until the player says go */
  if(st==='pep'&&L){var pl=RUSH_PEP[L.i];stopBubble(pl[0]==='F'?fxb:mxb,pl[0]==='F'?168:162,pl[1],pl[0]==='F'?'#c2281f':'#1a1a26',wide>30?30:wide);if(((t*2)|0)%2&&t-L.t0>1)drvText('TAP FOR NEXT',W/2,50,5,'#ffd27a')}
  if(st==='ready'){stopBubble(mxb,162,RUSH_HOW,'#1a1a26',wide);var pu=((t*2.4)|0)%2;R(G.rx-2,G.ry-2,G.rw+4,G.rh+4,OUT);R(G.rx,G.ry,G.rw,G.rh,pu?'#c2281f':'#a31f18');R(G.rx,G.ry,G.rw,3,'#ff8a7a');R(G.rx,G.ry+G.rh-3,G.rw,3,'#6e120e');drvText('PRESS WHEN READY',W/2,G.ry+11,W<400?7:8,'#ffffff');drvText('TO START MAKING HOAGIES',W/2,G.ry+22,5,'#ffd27a')}
  /* how it ends */
  var lines=st==='done'?[['W','Huh. Ten for ten out the door.'],['W',"Deal's a deal. Two on the house. Go."]]:st==='fired'?[['W',"That's three, hon. I'm calling it in."],['F','RUN.']]:null;
  if(lines&&L){var ln=lines[Math.min(lines.length-1,Math.floor(tt/2.8))];if(ln[0]==='W')rushBox(Math.max(dx+70,W/2-40),44,ln[1],'#1a1a26',mc);else stopBubble(fxb,168,ln[1],'#c2281f',mc)}
  if(st==='done')burst('RUSH CLEARED',W/2,128,W<400?12:16,'#9be37a',RU.t0)}
function drawRush(t){var st=RU.st,tt=t-RU.t0;
  if(st==='deal'){drawRushFront(t);return}
  if(st==='cut'){if(tt<.5){drawRushFront(t);R(0,0,W,H,'rgba(8,8,16,'+Math.min(1,tt/.45).toFixed(2)+')')}
    else if(tt<1.55){R(-8,-8,W+16,H+16,'#080810');drvText('BEHIND THE COUNTER',W/2,H/2-8,W<400?8:10,'#ffd27a');drvText('APRONS ON. HANDS WASHED.',W/2,H/2+10,5,'#f6f3e8')}
    else{drawRushBack(t);R(0,0,W,H,'rgba(8,8,16,'+Math.max(0,1-(tt-1.55)/.45).toFixed(2)+')')}
    return}
  drawRushBack(t)}
