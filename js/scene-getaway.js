/* The getaway: after the landing Moose's red sports car slides up, the door swings open and he yells. Frank runs over, tells Moose to move over, takes the wheel, shuts the door and speeds off. A cutscene; it plays inside the landing shot from the hallway file. */
var carImg=load('car3.png'),CARW=485,CARH=141,CARK=1.3;   /* four rows: door shut, cabin with the door off, the door on its own, Moose on his own */
var CAR_T={car:1.5,door:1.9,board:.85,talk:4,enter:.45,shut:.7,away:2.3};   /* how long each beat lasts */
var CAR_BASE=18;   /* wheels sit this far below the curb line */
function carSound(k){if(!audio())return;try{var t=ac.currentTime,i;
  if(k==='in'){tone(t,150,1.5,'sawtooth',.13,500,sfxG,46);tone(t,225,1.5,'square',.04,420,sfxG,69);noise(t,1.5,.07,'lowpass',420,.7)}
  else if(k==='screech'){noise(t,.55,.11,'bandpass',2500,7);noise(t,.55,.05,'bandpass',3400,9)}
  else if(k==='latch'){tone(t,900,.04,'square',.05);noise(t,.06,.1,'highpass',2000,.7)}
  else if(k==='frank'){for(i=0;i<4;i++)tone(t+i*.08,330+Math.random()*150,.06,'square',.05,1800)}
  else if(k==='yell'){for(i=0;i<5;i++)tone(t+i*.075,230+Math.random()*130,.06,'square',.05,1500)}
  else if(k==='go'){noise(t,.9,.12,'bandpass',2300,6);tone(t+.1,60,1.9,'sawtooth',.2,700,sfxG,260);tone(t+.1,90,1.9,'square',.06,600,sfxG,390);noise(t+.1,1.8,.1,'lowpass',500,.7)}}catch(e){}}
function getawayUpdate(tt,t){var ph=HL.ph;
  if(ph==='car'){if(tt>.7&&hlOnce(1))carSound('screech');if(tt>CAR_T.car){hlphase('door');carSound('latch')}}
  else if(ph==='door'){if(tt>.4&&hlOnce(1))carSound('yell');if(tt>1.15&&hlOnce(2))carSound('yell');if(tt>CAR_T.door){hlphase('board');HL.step=-1}}
  else if(ph==='board'){var n=(tt/.15)|0;if(n!==HL.step){HL.step=n;foot(n%2?'L':'R')}if(tt>CAR_T.board)hlphase('talk')}
  else if(ph==='talk'){if(tt>.15&&hlOnce(1))carSound('frank');if(tt>1.4&&hlOnce(2))carSound('frank');if(tt>2.4&&hlOnce(3))carSound('yell');if(tt>3.5&&hlOnce(4))scuff('L');if(tt>CAR_T.talk)hlphase('enter')}
  else if(ph==='enter'){if(tt>CAR_T.enter)hlphase('shut')}
  else if(ph==='shut'){if(tt>.2&&hlOnce(1)){thump(.35);HL.shake=.35}if(tt>CAR_T.shut){hlphase('away');carSound('go')}}
  else if(ph==='away'&&tt>CAR_T.away){hlphase('end');S.mode='over';if(HL.dodged+HL.hits)S.stat+='<br>ESCAPE: '+HL.dodged+' CLEARED  '+HL.hits+' HITS';
    endText.textContent='Frank drops four floors and lands on his feet. A red sports car slides up and the door swings open: Moose, his old lineman. "Hurry up, get on in!" Frank has a better idea. "Move over, Moose. I\'m driving."';stat.innerHTML=(S.stat+'<br>TO BE CONTINUED').replace(/^<br>/,'');endBox.hidden=false}}
/* where everything is at a given moment: car position, how far the door is open, what Frank is doing, how far the camera has panned */
function carPose(ph,tt,fx){var X0=fx+34,P=Math.max(0,fx+34+Math.round(97*CARK)-Math.round(W*.6)),o={show:false,x:X0,door:0,rot:0,pan:0,fr:'stand',fxx:fx,fu:0,dy:0,X0:X0,mo:0,seat:false},DX=X0+82*CARK;
  if(ph==='land')return o;
  o.show=true;o.pan=P;
  if(ph==='car'){var u=Math.min(1,tt/CAR_T.car),e=1-Math.pow(1-u,3);o.x=X0-(W+310)*(1-e);o.pan=P*u*u*(3-2*u);o.rot=u>.45?.03*Math.sin(Math.min(1,(u-.45)/.55)*Math.PI):0}
  else if(ph==='door')o.door=Math.min(1,tt/.35);
  else if(ph==='board'){o.door=1;o.fr='run';o.fxx=fx+(DX-32-fx)*Math.min(1,tt/CAR_T.board)}
  else if(ph==='talk'){o.door=1;o.fr='wait';o.fxx=DX-32;o.mo=Math.max(0,Math.min(1,(tt-3.5)/.45))}
  else if(ph==='enter'){o.door=1;o.fr='in';o.fxx=DX-6;o.fu=Math.min(1,tt/CAR_T.enter);o.mo=1}
  else if(ph==='shut'){o.door=Math.max(0,1-tt/.2);o.fr='gone';o.seat=true;o.mo=1;o.dy=tt>.2&&tt<.32?1:0}
  else if(ph==='away'){o.fr='gone';o.seat=true;o.mo=1;var k=Math.max(0,tt-.3);o.x=X0+950*k*k;o.rot=-.035*Math.min(1,tt/.3)}
  else{o.fr='gone';o.x=X0+9999}
  return o}
function drawGetaway(o,ph,tt,G,fx,t){var by=G+CAR_BASE,K=CARK,w=CARW/2.6,h=CARH/2.6,i;
  if(!ok(carImg))return;
  /* tyre smoke: a little under braking, a lot on the way out */
  if(ph==='car'&&tt>.6)for(i=0;i<5;i++){var b=tt-.6-i*.05;if(b>0&&b<.8){g.fillStyle='rgba(215,218,230,'+(.35*(1-b/.8)).toFixed(2)+')';g.beginPath();g.arc(o.x+(35+(i%2)*106)*K-b*20,by-3-b*10,3+b*10,0,TAU);g.fill()}}
  if(ph==='away')for(i=0;i<12;i++){var c=tt-.25-i*.045;if(c>0&&c<1.3){g.fillStyle='rgba(215,218,230,'+(.5*(1-c/1.3)).toFixed(2)+')';g.beginPath();g.arc(o.X0+30*K-c*46+i*7,by-4-c*16-(i%3)*3,5+c*17,0,TAU);g.fill()}}
  g.save();g.translate(Math.round(o.x+w*K/2),by+o.dy);g.rotate(o.rot);g.scale(K,K);g.translate(-w/2,-h);
  R(6,h-2,w-12,4,'rgba(0,0,0,.45)');
  g.drawImage(carImg,0,o.door>0?CARH:0,CARW,CARH,0,0,w,h);
  /* inside the cabin: Moose, who slides across to the far seat, and Frank once he is behind the wheel */
  g.save();g.beginPath();g.rect(74.5,4.2,32,o.door>0?39:15.4);g.clip();
  g.globalAlpha=1-.5*o.mo;g.drawImage(carImg,0,3*CARH,CARW,CARH,-8*o.mo,-.6*o.mo,w,h);g.globalAlpha=1;
  if(o.seat)gownAt(0,SEATX,SEATY,0,SEATS);
  g.restore();
  /* Frank: running to the door, standing at it while he argues, then ducking in through it */
  var lx=(o.fxx-o.x)/K;
  if(o.fr==='wait')landAt(4,lx,h+(14-CAR_BASE)/K,0,1/K);
  if(o.fr==='run'||o.fr==='in'){var sc=1.3/K,al=1,yy=h+(14-CAR_BASE-45)/K;
    g.save();
    if(o.fr==='in'){g.beginPath();g.rect(74,2,48,h-11);g.clip();sc=(1.3-.22*o.fu)/K;lx+=16*o.fu;yy+=7*o.fu;al=o.fu<.55?1:Math.max(0,1-(o.fu-.55)/.45)}
    g.globalAlpha=al;gownAt(o.fr==='in'?9:((tt*15)|0)%8,lx,yy,o.fr==='in'?.12:0,sc);g.restore()}
  /* the door swings toward the camera on its front hinge, so it narrows as it opens */
  if(o.door>0){var cw=Math.cos(o.door*1.08),dw=47*cw,dx=121-dw;
    g.drawImage(carImg,192,2*CARH+8,122,109,dx,3,dw,42);
    R(dx,3+42*.44,dw,42*.56,'rgba(0,0,0,'+(.3*o.door).toFixed(2)+')');R(dx-2,4,2,39,'#2a0709');R(dx,4,1,39,'#ff6a5e')}
  g.restore();
  var mx=o.x+92*K,my=by-h*K-24,fbx=o.fxx+6,fby=by-108;
  if(ph==='door'&&tt>.4||ph==='board')bubble(mx,my,ph==='door'&&tt<1.15?'HURRY UP!':'GET ON IN!',true);
  if(ph==='talk'){if(tt>.15&&tt<1.3)bubble(fbx,fby,'MOVE OVER, MOOSE.');else if(tt>1.4&&tt<2.3)bubble(fbx,fby,"I'M DRIVING.");else if(tt>2.4&&tt<3.5)bubble(mx+30,my,"IT'S MY CAR, FRANK.");else if(tt>=3.5)bubble(mx+30,my,'...')}}
var SEATX=84,SEATY=22,SEATS=.62;
