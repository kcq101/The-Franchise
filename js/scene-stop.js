/* The stop (level 2-2): Frank and Moose pull into the Jawn for gas and hoagies. A talking level in the style of an old adventure game.
   The woman behind the counter and a kid who wanders in ask Frank questions; L and R are both lies. Lies that agree with the story so far cost nothing;
   a lie that contradicts it cracks the STORY meter, and the later questions crack it whatever he says. When it is empty Moose says his line and they run for it,
   driving off with the pump hose still in the tank. The plain block people are only a fallback for when the cast sheet has not loaded. */
var ST={on:false,ph:'',t0:0,qi:0,story:'',meter:6,queue:[],line:null,ask:null,pick:'',pickT:0,order:1,kid:0,kidIn:false,shake:0,flash:0,news:false,bill:null,snap:0,lied:0,caught:0};
var STOP_ORDER=['ITALIAN','+ EXTRA EVERYTHING','+ MEATBALLS','+ 2ND HOAGIE INSIDE','+ MAKE IT FOUR FEET','+ CALL IT THE FRANCHISE','+ CHIPS'];
var STOP_NAME={F:'FRANK',M:'MOOSE',W:'DOT',K:'KID',TV:'NEWS'},STOP_PITCH={F:300,M:150,W:430,K:640,TV:220};
/* the questions, in order. s is the story a lie belongs to (party or doctor); hit is how much the meter cracks whatever is said; pre is what Frank and Moose bicker about at the screens first */
function stopQuestions(){var dmg=(typeof DR!=='undefined'&&DR.dmg)||187400,doc=ST.story==='doctor';return [
  {who:'W',t:'Hon. Is that a hospital gown?',L:{t:"IT'S A TOGA. COSTUME PARTY.",s:'party'},R:{t:"I'M A DOCTOR. LONG SHIFT.",s:'doctor'},
    pre:[['M','Turkey. Plain. Done.'],['F',"I'M GETTING THE ITALIAN."]]},
  {who:'W',t:'And the bracelets with the chains on?',L:{t:'PART OF THE COSTUME.',s:'party'},R:{t:'MEDICAL ALERT. BOTH WRISTS.',s:'doctor'},
    pre:[['M','You are not putting this on my card.'],['F',"IT'S YOUR CAR. I'M BUYING YOU A HOAGIE."],['M','With what, Frank?']]},
  {who:'K',enter:true,t:"Mister, why don't you have any shoes?",L:{t:'THE THEME IS ANCIENT ROME.',s:'party'},R:{t:'SHOES CARRY GERMS, KID.',s:'doctor'},
    pre:[['M','Meatballs. On an Italian.'],['F','EVER SINCE THAT FUMBLE I EAT WHAT I WANT.']]},
  {who:'K',t:'Is that your car with the front all smashed?',L:{t:"IT'S A RENTAL."},R:{t:'NEVER SEEN IT BEFORE.'},hit:1,after:[['M','It is MY car.'],['W','So whose car is it, hon?']],
    pre:[['M','That is two hoagies.'],['F','ONE IS INSIDE THE OTHER.']]},
  {who:'W',t:"Wait. Weren't you on TV once? The football guy?",L:{t:'THAT WAS MY TWIN.'},R:{t:"I GET THAT A LOT. I'M TALLER."},hit:1,after:[['F','AND THAT FUMBLE WAS NOT HIS FAULT.'],['K','So it WAS you.']],
    pre:[['M','Four feet. You ordered four feet of hoagie.']]},
  doc?{who:'K',t:"If you're a doctor, what's this bone called?",L:{t:'THE ARM BONE.'},R:{t:"THAT'S CLASSIFIED."},hit:2,after:[['K',"He's making it up."]]}
     :{who:'K',t:"If it's a party, where's everybody else?",L:{t:"THEY'RE RUNNING LATE."},R:{t:'I AM THE PARTY.'},hit:2,after:[['K',"He's making it up."]]},
  {who:'W',news:true,t:"Hon. You're on the news.",L:{t:'DIFFERENT RED CAR.'},R:{t:'DIFFERENT GUY IN A GOWN.'},hit:2,
    pre:[['TV','RED SPORTS CAR. $'+dmg.toLocaleString('en-US')+' IN DAMAGES. DRIVER IN A HOSPITAL GOWN.']]}]}

function stopPhase(n){ST.ph=n;ST.t0=S.clock}
function stopOff(){ST.on=false;ST.ph='';stopStopMusic()}
function startStop(){if(typeof drvStop==='function')drvStop();S.mode='stop';ST.on=true;ST.qi=0;ST.story='';ST.meter=6;ST.queue=[];ST.line=null;ST.ask=null;ST.pick='';ST.order=1;ST.kid=0;ST.kidIn=false;ST.shake=0;ST.flash=0;ST.news=false;ST.bill=null;ST.snap=0;ST.lied=0;ST.caught=0;
  cv.style.filter='';endBox.hidden=true;tug.hidden=true;hint.hidden=true;padsOn(true);padL.classList.remove('next');padR.classList.remove('next');lvl.innerHTML='THE JAWN<br>LEVEL 2-2';barlab.textContent='STORY';track.style.width='0%';stopMeter();stopPhase('arrive');startStopMusic()}
function stopMeter(){for(var i=0;i<6;i++)segs[i].className=i<ST.meter?'on':''}
function stopSay(who,t){ST.queue.push({who:who,t:t})}
/* line up the bickering and then the next question, or the collapse if the story is finished */
function stopNext(){var Q=stopQuestions();
  if(ST.meter<=0||ST.qi>=Q.length){stopSay('W','Hon.');stopSay('K',"He's lying.");stopSay('M','Frank. This is what you always do.');stopSay('F','RUN.');ST.queue.push({fn:function(){stopPhase('out');padsOn(false)}});return}
  var q=Q[ST.qi];(q.pre||[]).forEach(function(l){stopSay(l[0],l[1])});
  if(q.enter)ST.queue.push({fn:function(){ST.kidIn=true;ST.kidT=S.clock;if(audio())try{var t=ac.currentTime;tone(t,880,.25,'sine',.06);tone(t+.22,660,.4,'sine',.06)}catch(e){}}},{wait:1.1});
  if(q.news)ST.news=true;
  ST.queue.push({ask:q})}
function stopAnswer(side){var q=ST.ask,c=q[side],hit=q.hit||0,clash=c.s&&ST.story&&c.s!==ST.story;ST.pick=side;ST.pickT=S.clock;ST.lied++;
  if(c.s){if(clash){hit=2;ST.caught++;stopSay(q.who,ST.story==='doctor'?'You said you were a doctor.':'You said it was a costume party.')}
    else if(!ST.story){stopSay(c.s==='party'?'W':'M',c.s==='party'?'On a Tuesday.':'Doctors get the coat, Frank. Patients get the gown.')}
    else stopSay(q.who,['Mm-hm.','Huh.','Okay...'][ST.qi%3]);
    ST.story=c.s}
  (q.after||[]).forEach(function(l){stopSay(l[0],l[1])});
  if(hit){ST.queue.unshift({fn:function(){ST.meter=Math.max(0,ST.meter-hit);ST.shake=.6;stopMeter();if(audio())try{tone(ac.currentTime,110,.3,'square',.07,900)}catch(e){}}})}
  else{S.score+=500;scoreEl.textContent=pad6(S.score);blip(660,.08,.04);setTimeout(function(){blip(880,.1,.04)},80)}
  ST.order=Math.min(STOP_ORDER.length,ST.order+1);ST.qi++;track.style.width=Math.min(100,ST.qi/7*100)+'%';
  ST.queue.unshift({who:'F',t:c.t});
  ST.ask=null;padL.classList.remove('next');padR.classList.remove('next')}
function stopTap(side){
  /* outside, a tap moves on to the next line of the regulars' chat */
  if(ST.ph==='arrive'){var ta=S.clock-ST.t0,nx=STOP_IN-.5;if(ta<5.6||ta>=nx)return;for(var n=0;n<STOP_CHAT.length;n++)if(STOP_CHAT[n][0]>ta+.05){nx=STOP_CHAT[n][0];break}ST.t0=S.clock-nx;return}
  if(ST.ph!=='in')return;
  if(ST.ask&&!ST.line){if(S.clock-ST.askT>.35)stopAnswer(side);return}
  if(ST.line){var full=ST.line.t.length/38;if(S.clock-ST.line.t0<full)ST.line.t0=S.clock-full;else ST.line.t0=-99}}
function stopUpdate(dt){var t=S.clock,tt=t-ST.t0,i;ST.shake=Math.max(0,ST.shake-dt*3);ST.flash=Math.max(0,ST.flash-dt*2.5);
  if(ST.ph==='arrive'){if(tt>.3&&!ST.a1){ST.a1=1;engine()}if(tt>STOP_IN){stopPhase('in');ST.a1=0;padsOn(true);padL.classList.remove('next');padR.classList.remove('next');stopNext()}}
  else if(ST.ph==='in'){
    if(ST.kidIn)ST.kid=Math.min(1,ST.kid+dt*.9);
    if(ST.line){var L=ST.line,k=t-L.t0,n=Math.floor(k*38);if(n<L.t.length&&n!==L.n&&n%3===0){L.n=n;blip(STOP_PITCH[L.who]*(.94+Math.random()*.12),.03,.02)}
      if(k>L.t.length/38+Math.max(1.3,L.t.length*.05))ST.line=null}
    if(!ST.line&&!ST.ask){if(ST.wait&&t<ST.wait)return;ST.wait=0;
      if(!ST.queue.length)stopNext();
      var s=ST.queue.shift();if(!s)return;
      if(s.fn)s.fn();else if(s.wait)ST.wait=t+s.wait;else if(s.ask){ST.ask=s.ask;ST.askT=t;ST.pick='';padL.classList.add('next');padR.classList.add('next')}else ST.line={who:s.who,t:s.t,t0:t,n:-1}}}
  else if(ST.ph==='out'){
    if(tt>2.2&&!ST.a1){ST.a1=1;engine();if(audio())try{noise(ac.currentTime,.8,.12,'bandpass',2400,6)}catch(e){}}
    if(tt>2.65&&!ST.snap){ST.snap=t;ST.shake=.6;ST.flash=.4;thump(.25);if(audio())try{noise(ac.currentTime,.3,.25,'highpass',2500,.7)}catch(e){}
      if(typeof DR!=='undefined')DR.dmg=(DR.dmg||0)+2300;ST.bill={t:'+ GAS HOSE  $2,300',t0:t}}
    if(tt>6.2){stopPhase('end');S.mode='over';var dm=(typeof DR!=='undefined'&&DR.dmg)||2300;
      S.stat+='<br>LIES TOLD: '+ST.lied+'  CAUGHT OUT: '+ST.caught+'<br>DAMAGES: $'+dm.toLocaleString('en-US')+'  HOAGIES: UNPAID';
      endText.textContent='Two stories, one kid and one news bulletin later, nobody in the Jawn believes a word. "Frank. This is what you always do." They leave with the hoagies, and with the hose.';
      stat.innerHTML=(S.stat+'<br>TO BE CONTINUED').replace(/^<br>/,'');endBox.hidden=false}}}

/* ---- drawing ---- */
function stopWrap(txt,max){var words=txt.split(' '),lines=[''];words.forEach(function(w){var L=lines.length-1;if((lines[L]+' '+w).trim().length>max)lines.push(w);else lines[L]=(lines[L]+' '+w).trim()});return lines}
function stopText(txt,x,y,size,col,align){g.font=size+'px "Press Start 2P", monospace';g.textAlign=align||'left';g.textBaseline='top';g.fillStyle=col;g.fillText(txt,Math.round(x),Math.round(y))}
/* a speech bubble that wraps, with a tail pointing down at the speaker */
function stopBubble(cx,by,txt,col,max){var lines=stopWrap(txt,max||20),w=Math.max.apply(null,lines.map(function(l){return l.length}))*7+10,h=lines.length*10+7,x=Math.round(Math.max(4,Math.min(W-w-4,cx-w/2))),y=Math.round(by-h-5);
  R(x-1,y-1,w+2,h+2,OUT);R(x,y,w,h,'#f6f3e8');cx=Math.max(x+6,Math.min(x+w-6,Math.round(cx)));R(cx-3,y+h,7,3,OUT);R(cx-2,y+h-1,5,3,'#f6f3e8');R(cx-1,y+h+2,3,2,OUT);R(cx,y+h+1,1,2,'#f6f3e8');
  lines.forEach(function(l,n){stopText(l,x+5,y+5+n*10,7,col||'#1a1a26')})}
/* a stand-in person made of blocks: o has height, width, colours and a few switches */
function stopPerson(x,fy,o){var h=o.h,w=o.w,hd=Math.round(h*.2),tl=Math.round(h*.38),ll=h-hd-tl,top=fy-h,bx=Math.round(x-w/2),d=o.face||1;
  function B(a,b,c,e,col){R(a-1,b-1,c+2,e+2,OUT);R(a,b,c,e,col)}
  if(!o.half){B(bx+2,fy-ll,Math.round(w*.4),ll,o.leg);B(bx+w-2-Math.round(w*.4),fy-ll,Math.round(w*.4),ll,o.leg);R(bx+1,fy-3,Math.round(w*.45),3,o.shoe||'#17171d');R(bx+w-1-Math.round(w*.45),fy-3,Math.round(w*.45),3,o.shoe||'#17171d')}
  B(bx,top+hd,w,tl,o.top);if(o.stripe)for(var i=3;i<tl-2;i+=5)R(bx,top+hd+i,w,2,o.stripe);
  var ax=d>0?bx+w-3:bx-3;B(ax,top+hd+3,6,Math.round(tl*.7),o.top);R(ax,top+hd+3+Math.round(tl*.7)-4,6,4,o.skin);
  var hx=Math.round(x-hd/2+d*2);B(hx,top,hd,hd,o.skin);
  if(o.hair){R(hx-1,top-1,hd+2,Math.round(hd*.4),o.hair);R(d>0?hx-1:hx+hd-2,top,3,Math.round(hd*.8),o.hair)}
  if(o.cap){R(hx-1,top-1,hd+2,Math.round(hd*.38),o.cap);R(d>0?hx+hd-1:hx-4,top+Math.round(hd*.3),5,2,o.cap)}
  if(o.bun)B(d>0?hx-4:hx+hd,top+2,4,4,o.hair);
  R(d>0?hx+hd-4:hx+2,top+Math.round(hd*.45),2,2,'#1a1a26')}
var STOP_PAL={M:{h:100,w:34,top:'#2b3350',leg:'#23263a',skin:'#c98f62',face:-1},W:{h:80,w:24,top:'#b4231c',leg:'#23263a',skin:'#e0aa82',hair:'#5a3622',bun:true,half:true},K:{h:58,w:17,top:'#3fa35a',stripe:'#f6f3e8',leg:'#2b4a8a',skin:'#e0b08a',cap:'#c2281f',shoe:'#f6f3e8'}};
/* Moose's car from the side, with or without the two of them in it */
function stopCar(x,by,sc,rot,full){if(!ok(carImg))return;var w=CARW/2.6,h=CARH/2.6;g.save();g.translate(Math.round(x),by);g.rotate(rot||0);g.scale(sc,sc);g.translate(0,-h);
  R(6,h-2,w-12,4,'rgba(0,0,0,.45)');g.drawImage(carImg,0,0,CARW,CARH,0,0,w,h);
  if(full){g.beginPath();g.rect(74.5,4.2,32,15.4);g.clip();gownAt(0,SEATX,SEATY,0,SEATS);g.translate(82,21);g.scale(1.2,1.2);g.translate(-88,-19.4);g.drawImage(carImg,0,3*CARH,252,CARH,0,0,252/2.6,h)}
  g.restore()}
/* what gets said at the doors on the way in: start, end, who (a and b are the regulars, f is Frank) and the line */
var STOP_CHAT=[[5.9,7.6,'a','YOU SEE THE ROCKETS GAME?'],[7.7,9.8,'b','I saw the first half. Then I saw my ceiling.'],[9.9,11.9,'a',"NEW QUARTERBACK'S THE REAL DEAL THOUGH."],[12,13.5,'b','You say that every year.'],
  [13.6,15.6,'a',"AIN'T BEEN RIGHT SINCE THAT FUMBLE."],[15.7,17.1,'b','Twenty years, man.'],[17.2,18.3,'f','...'],[18.4,19.6,'a','YO. GOWN GUY.'],[19.7,22.1,'a','DOT CATCHES EVERYTHING. PICK ONE STORY AND STICK TO IT.'],[22.2,23.4,'f',"I DON'T NEED A STORY."],[23.5,24.7,'b','He needs a story.']];
var STOP_IN=25.2;   /* seconds of arrival before the scene cuts inside */
function stopChat(tt){for(var i=0;i<STOP_CHAT.length;i++)if(tt>=STOP_CHAT[i][0]&&tt<STOP_CHAT[i][1])return STOP_CHAT[i];return null}
/* the two regulars eating at the double bin by the doors (the blocks below are only a fallback for when the picture has not loaded) */
var guysImg=load('stop_guys.png'),GUYS=[[0,158,75],[160,158,75],[320,180,75]];   /* both chewing, the first one talking, the second one talking: x, width, and where the middle of the bin is */
function stopGuys(bx,by,t,talk){var i;
  if(ok(guysImg)){var c=GUYS[talk===0?1:talk===1?2:0],k=.21;g.drawImage(guysImg,c[0],0,c[1],150,bx+9-c[2]*k,by+1-150*k,c[1]*k,150*k);return}R(bx-1,by-12,20,13,OUT);R(bx,by-11,9,11,'#2d4a3a');R(bx+9,by-11,9,11,'#3a4a66');R(bx,by-11,18,2,'#55607a');R(bx+3,by-7,3,1,'#0c0c12');R(bx+12,by-7,3,1,'#0c0c12');
  for(i=0;i<2;i++){var x=bx+4+i*9,bob=talk===i?Math.round(Math.abs(Math.sin(t*9))):0,y=by-11-bob;
    R(x-2,y+1,2,6,i?'#3b3f55':'#5a4a36');R(x+1,y+1,2,6,i?'#3b3f55':'#5a4a36');R(x-2,y+7,2,1,'#f6f3e8');R(x+1,y+7,2,1,'#f6f3e8');
    R(x-3,y-7,6,8,OUT);R(x-2.5,y-6.5,5,7,i?'#c9a227':'#2f7d4f');R(x-2,y-11,4,4,OUT);R(x-1.5,y-10.5,3,3,i?'#8d5a3b':'#e0aa82');R(x-2,y-12,4,2,i?'#1a1a26':'#b4231c');
    var chew=((t*3+i)|0)%2;R(x+(i?-5:2),y-5-(talk===i?0:chew),3,2,'#e8c98a');R(x+(i?-5:2),y-4-(talk===i?0:chew),3,1,'#c2281f')}}
/* the run back to the car: six frames each, Frank on the top row and Moose on the bottom, in cells of 190 by 220 */
var runImg=load('stop_run.png');
function stopRun(row,f,x,fy,sc){g.drawImage(runImg,f*190,row*220,190,220,Math.round(x-47.5*sc),Math.round(fy-110*sc),95*sc,110*sc)}
function drawStopOutside(t,tt,leaving){var x0=Math.min(W/2-250,W-455),MW=440,MH=MW*243/947,G=174,sc=.8,cw=CARW/2.6*sc,cx=x0+288,px=x0+329,py=G-22,carX=cx,rot=0,i;
  var door=[x0+113,G+1],bin=[x0+52,G+1],seat=[cx+cw*.5,G+12],SD=.27,SN=.6;
  /* the camera pushes in on the doors while the regulars talk, and starts there on the way out */
  var zu=leaving?Math.max(0,1-tt/.9):Math.max(0,Math.min(1,(tt-5.9)/1.3));zu=zu*zu*(3-2*zu);var Z=1+1.5*zu,fcx=W/2+(door[0]-22-W/2)*zu,fcy=H*.55+(door[1]-22-H*.55)*zu;
  function T(x,y){return [W/2+(x-fcx)*Z,H*.55+(y-fcy)*Z]}
  R(-8,-8,W+16,H+16,'#0a1030');
  g.save();g.translate(W/2,H*.55);g.scale(Z,Z);g.translate(-fcx,-fcy);
  if(ok(drvSky))g.drawImage(drvSky,0,0,1400,303,-8,G-104,484,105);
  R(-200,G-3,W+400,H,'#23242f');R(-200,G-3,W+400,1,'#3c3d4e');for(i=-40;i<W+40;i+=46)R(i,G+14,22,2,'#3a3b4c');
  if(ok(drvMart))g.drawImage(drvMart,0,0,947,243,x0,G-MH+2,MW,MH);
  var chat=leaving?null:stopChat(tt),talk=chat?(chat[2]==='a'?0:chat[2]==='b'?1:-1):-1;if(leaving&&tt>.25&&tt<1.5)talk=0;
  stopGuys(bin[0],bin[1],t,talk);
  if(!leaving){var u=Math.min(1,tt/1.9),e=1-Math.pow(1-u,3);carX=cx-(cx+cw+30)*(1-e);rot=u>.5&&u<1?.02*Math.sin((u-.5)/.5*Math.PI):0}
  else if(tt>2.2){var k=tt-2.2;carX=cx+280*k*k;rot=-.03*Math.min(1,k/.3)}
  var fill=[carX+34*sc,G+12-34*sc];
  /* the hose: hanging while it pumps, pulled tight as the car goes, then whipping free */
  if((!leaving&&tt>3)||(leaving&&!ST.snap)){g.strokeStyle='#050508';g.lineWidth=3.2;g.lineCap='round';g.beginPath();g.moveTo(px,py);var sag=Math.max(0,22-Math.max(0,fill[0]-px-30)*.25);g.quadraticCurveTo((px+fill[0])/2,Math.max(py,fill[1])+sag,fill[0],fill[1]);g.stroke();R(fill[0]-2,fill[1]-2,5,4,'#c2281f')}
  else if(leaving&&ST.snap){var q=t-ST.snap;g.strokeStyle='#050508';g.lineWidth=3.2;g.lineCap='round';g.beginPath();g.moveTo(fill[0],fill[1]);for(i=1;i<=7;i++)g.lineTo(fill[0]-i*9,fill[1]+5+Math.sin(t*22+i*1.3)*(3+i)+i*1.5);g.stroke();R(fill[0]-66,fill[1]+14+Math.sin(t*22+9.1)*10,5,4,'#c9cbd8');
    /* the torn stub left swinging on the dispenser, and a few sparks where it let go */
    g.beginPath();g.moveTo(px,py);g.quadraticCurveTo(px+3+Math.sin(t*9)*4*Math.max(0,1-q/2),py+8,px+2+Math.sin(t*9)*7*Math.max(0,1-q/2),py+15);g.stroke();
    if(q<.5)for(i=0;i<10;i++){var a=i*1.9,r=q*70*(.4+(i%5)*.15);R(px+Math.cos(a)*r,py+4+Math.sin(a)*r*.6+q*q*80,2,2,i%2?'#ffd23a':'#ffffff')}}
  /* Frank and Moose on foot: small at the doors, bigger as they come toward the camera and the car */
  var walk=-1,fp=null;
  if(!leaving&&tt>5.5)walk=1-Math.min(1,(tt-5.5)/1.7);else if(leaving&&tt<1.6)walk=Math.min(1,tt/1.5);
  var inCar=leaving?tt>1.5:tt<=5.5;
  if(leaving)stopCar(carX,G+12,sc,rot,inCar);
  if(walk>=0&&walk<.98){var w2=walk*walk*(3-2*walk),s2=SD+(SN-SD)*w2,bob=Math.abs(Math.sin(tt*(leaving?14:9)))*3*s2,stand=!leaving&&walk<=0;if(stand)bob=0;
    var fxw=door[0]-2+(seat[0]-door[0])*w2,fyw=door[1]+(seat[1]-door[1])*w2,mxw=fxw+(leaving?-52:24)*s2*(leaving?Math.min(1,walk*4):1);
    if(leaving&&ok(runImg)){var rf=((tt*13)|0)%6;stopRun(1,(rf+3)%6,mxw,fyw+2*s2,s2);stopRun(0,rf,fxw,fyw+2*s2,s2)}
    else{stopCast(leaving?4:3,mxw,fyw-bob,leaving,s2);if(leaving)gownAt(((tt*15)|0)%8,fxw,fyw-34*s2*1.6-bob*.6,0,s2*1.6)}
    if(!leaving)stopCast(chat&&chat[2]==='f'?(chat[3]==='...'?2:1):0,fxw,fyw-(stand?0:Math.abs(Math.sin(tt*9+1))*3*s2),true,s2);
    fp=[fxw,fyw-102*s2]}
  if(!leaving)stopCar(carX,G+12,sc,rot,inCar);
  if(leaving&&tt>2.2&&tt<3.6)for(i=0;i<8;i++){var c=tt-2.2-i*.05;if(c>0&&c<1){g.fillStyle='rgba(215,218,230,'+(.45*(1-c)).toFixed(2)+')';g.beginPath();g.arc(cx+20-c*40+i*6,G+8-c*14,4+c*14,0,TAU);g.fill()}}
  g.restore();
  var cb=T(carX+cw*.5,G+12-CARH/2.6*sc-4),bx=cb[0],by=cb[1],ga=T(bin[0]-1,bin[1]-30),gb=T(bin[0]+19,bin[1]-30);
  if(!leaving){if(tt>2.1&&tt<3.2)stopBubble(bx,by,'WE NEED GAS.');else if(tt>3.3&&tt<4.3)stopBubble(bx,by,'I NEED A HOAGIE.','#c2281f');else if(tt>4.4&&tt<5.5)stopBubble(bx,by,'YOU NEED PANTS.');
    else if(chat){var cp=chat[2]==='a'?ga:chat[2]==='b'?gb:fp?T(fp[0],fp[1]):null;if(cp)stopBubble(cp[0],cp[1],chat[3],chat[2]==='f'?'#c2281f':null,W<400?18:24)}}
  else{if(tt>.25&&tt<1.5)stopBubble(ga[0],ga[1],'TOLD YOU, BRO.');else if(tt>1.6&&tt<2.5)stopBubble(bx,by,'THE HOSE, FRANK.');else if(tt>2.5&&tt<3.2)stopBubble(Math.min(W-40,bx),by,'NO TIME.','#c2281f');else if(ST.snap&&t-ST.snap>.9&&t-ST.snap<2.6)stopBubble(W-70,G-60,'...That was the hose.')}
  if(ST.snap&&t-ST.snap<1.1)burst('SNAP!',px,py-34,14,'#ffd27a',ST.snap);
  if(ST.bill&&t-ST.bill.t0<2.6){g.textAlign='center';stopText(ST.bill.t,W/2,30,8,'#ff6a5e','center');stopText('+ 2 HOAGIES  UNPAID',W/2,44,6,'#ffd27a','center')}}
var stopBg=load('stop_inside.webp'),castImg=load('stop_cast.png');
/* the cast sheet: x, width, height and where the feet are, for Frank (idle, talking, caught out), Moose (arms folded, talking), Dot (listening, talking) and the kid (looking up, pointing) */
var CAST=[[0,91,205,37],[93,98,204,37],[193,99,204,37],[294,102,216,53],[398,144,215,86],[544,89,110,44],[635,108,110,62],[745,57,132,30],[804,79,132,28]];
function stopCast(i,x,fy,flip,sc){if(!ok(castImg))return false;var c=CAST[i];g.save();g.translate(Math.round(x),Math.round(fy));g.scale((flip?-1:1)*sc,sc);g.drawImage(castImg,c[0],0,c[1],c[2],-c[3]/2,-c[2]/2,c[1]/2,c[2]/2);g.restore();return true}
/* the shop interior is a 432 by 216 picture; everything in it is placed in those units and the whole thing is scaled up on wider screens and slid left on narrow ones */
function drawStopInside(t){var k=Math.max(1,W/432),ox=W>=432*k?0:-(432*k-W)*.09,oy=H-216*k,F=206,mx=92,fx=242,wx=170,kx=150,i;
  R(-8,-8,W+16,H+16,'#2a1c14');
  g.save();g.translate(ox,oy);g.scale(k,k);
  if(ok(stopBg))g.drawImage(stopBg,0,0,432,216);else{R(0,0,432,216,'#d8c9a4');R(0,144,432,58,'#8a6a44');R(0,202,432,14,'#4a4038')}
  /* the menu board doubles as the order read-out, and later as the news */
  R(106,45,122,34,'rgba(16,18,34,.93)');stopText("FRANK'S HOAGIE",109,48,5,'#ffd27a');var o0=Math.max(0,ST.order-3);for(i=o0;i<ST.order;i++)stopText(STOP_ORDER[i],109,56+(i-o0)*7,5,'#f6f3e8');
  R(230,45,62,34,'rgba(16,18,34,.93)');stopText("MOOSE'S",233,48,5,'#ffd27a');stopText('TURKEY.',233,56,5,'#f6f3e8');stopText('PLAIN.',233,63,5,'#f6f3e8');
  if(ST.news){R(293,45,61,34,((t*3)|0)%2?'#123a7a':'#0f3168');R(306,60,26,8,'#c2281f');R(311,56,12,5,'#c2281f');R(309,67,6,3,'#111');R(324,67,6,3,'#111');R(293,72,61,7,'#c2281f');stopText('LIVE',296,48,5,'#ffffff')}
  /* Dot, behind the pick-up window */
  var L0=ST.line,q0=ST.ask&&!L0?ST.ask:null,says=function(w){return (L0&&L0.who===w)||(q0&&q0.who===w)};
  g.save();g.beginPath();g.rect(128,90,142,41);g.clip();if(!stopCast(says('W')?6:5,wx,138,true,.85))stopPerson(wx,178,STOP_PAL.W);g.restore();
  /* the kid, once the door has chimed, walks in from the left */
  if(ST.kidIn){var kxx=-14+(kx+14)*ST.kid,hop=ST.kid<1?Math.abs(Math.sin(t*12))*2:0;R(kxx-9,F,18,2,'rgba(0,0,0,.3)');if(!stopCast(says('K')&&ST.kid>=1?8:7,kxx,F+2-hop,false,1))stopPerson(kxx,F+1-hop,STOP_PAL.K)}
  /* Moose at the left screen and Frank at the right one, back to back */
  R(mx-20,F,40,3,'rgba(0,0,0,.35)');if(!stopCast(says('M')?4:3,mx,F+2,says('M'),1))stopPerson(mx,F+1,STOP_PAL.M);
  var fturn=(L0&&L0.who==='F')||q0||ST.shake>.1,ff=L0&&L0.who==='F'?1:(ST.shake>.1||(q0&&ST.meter<=3))?2:0;R(fx-20,F+1,40,3,'rgba(0,0,0,.35)');if(!stopCast(ff,fx,F+3,fturn,1)){if(ok(landImg))landAt(4,fx,F+3,0,1.05)}
  g.restore();
  function P(x,y){return [ox+x*k,oy+y*k]}
  var pos={F:P(fx,F-106),M:P(mx,F-112),W:P(wx+4,94),K:P(kx+4,F-68)},L=ST.line,q=ST.ask,mc=W<400?17:22;
  if(L&&L.who==='TV'){var nn=Math.min(L.t.length,Math.floor((t-L.t0)*38)),tx=W>=400?62:8,tl=stopWrap(L.t.slice(0,Math.max(1,nn)),Math.floor((W-tx*2)/7));R(0,H-45,W,45,OUT);R(0,H-44,W,44,'#123a7a');R(0,H-44,W,11,'#c2281f');stopText('JAWN TV   BREAKING NEWS',tx,H-41,6,'#ffffff');tl.forEach(function(l,n2){stopText(l,tx,H-29+n2*9,7,'#ffffff')})}
  else if(L){var n=Math.min(L.t.length,Math.floor((t-L.t0)*38)),p=pos[L.who];stopBubble(p[0],p[1],L.t.slice(0,Math.max(1,n)),L.who==='F'?'#c2281f':'#1a1a26',mc)}
  else if(q){var pq=pos[q.who];stopBubble(pq[0],pq[1],q.t,'#1a1a26',mc)}
  /* the two lies to pick from */
  if(q&&!L){var pm=W>=400?58:4,gw=(W-pm*2-6)/2,by0=H-38,cc=Math.max(8,Math.floor((gw-24)/7));['L','R'].forEach(function(sd,n3){var x=pm+n3*(gw+6),on=ST.pick===sd,lines=stopWrap(q[sd].t,cc);
      R(x-1,by0-1,gw+2,36,OUT);R(x,by0,gw,34,on?'#3a2a12':'rgba(20,22,40,.94)');R(x,by0,gw,2,'#ffd27a');
      R(x+4,by0+6,13,13,'#ffd27a');stopText(sd,x+7,by0+9,7,'#1a1a26');lines.slice(0,3).forEach(function(l,k2){stopText(l,x+22,by0+6+k2*9,7,'#f6f3e8')})});
    if(ST.qi===0&&((t*2)|0)%2)drvText('PICK A LIE',W/2,by0-8,7,'#ffd27a')}}
function drawStop(){var t=S.clock,tt=t-ST.t0,sh=ST.shake,ph=ST.ph;
  g.setTransform(2,0,0,2,sh?(Math.random()-.5)*8*sh:0,sh?(Math.random()-.5)*6*sh:0);
  if(ph==='arrive'){drawStopOutside(t,tt,false);g.setTransform(2,0,0,2,0,0);
    if(tt<2.2){g.globalAlpha=tt<1.8?1:Math.max(0,1-(tt-1.8)/.4);R(0,0,W,H,'rgba(5,6,16,.72)');g.textAlign='center';stopText('LEVEL 2-2',W/2,H/2-30,8,'#ffd27a','center');stopText('THE STOP',W/2,H/2-12,16,'#f6f3e8','center');stopText('INSTINCT: LIE',W/2,H/2+14,6,'#ff6a5e','center');g.globalAlpha=1}
    if(tt>STOP_IN-.5)R(0,0,W,H,'rgba(0,0,0,'+Math.min(1,(tt-STOP_IN+.5)/.45).toFixed(2)+')')}
  else if(ph==='in'){drawStopInside(t);g.setTransform(2,0,0,2,0,0);if(tt<.5)R(0,0,W,H,'rgba(0,0,0,'+(1-tt/.5).toFixed(2)+')')}
  else{drawStopOutside(t,ph==='end'?99:tt,true);g.setTransform(2,0,0,2,0,0);if(ph==='out'&&tt<.4)R(0,0,W,H,'rgba(0,0,0,'+(1-tt/.4).toFixed(2)+')')}
  if(ST.flash>0)R(0,0,W,H,'rgba(255,255,255,'+(ST.flash*.6).toFixed(2)+')')}
