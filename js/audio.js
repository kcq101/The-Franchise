/* Sound: Web Audio effects, city and crowd ambience, sirens, and the two music tracks. */
var ac=null;
var crowdG,master,sfxG,musG,ambG,droneG,noiseBuf,muted=false,M={next:0,step:0,phrase:0},AMB={car:4,siren:22};
function audio(){try{
  if(!ac){ac=new(window.AudioContext||window.webkitAudioContext)();master=ac.createGain();master.gain.value=muted?0:1;master.connect(ac.destination);
    sfxG=ac.createGain();sfxG.connect(master);musG=ac.createGain();musG.gain.value=.55;musG.connect(master);ambG=ac.createGain();ambG.gain.value=1;ambG.connect(master);
    noiseBuf=ac.createBuffer(1,ac.sampleRate*2,ac.sampleRate);var d=noiseBuf.getChannelData(0);for(var i=0;i<d.length;i++)d[i]=Math.random()*2-1;
    /* city bed: low rumble plus a thin layer of air */
    var n1=ac.createBufferSource();n1.buffer=noiseBuf;n1.loop=true;var f1=ac.createBiquadFilter();f1.type='lowpass';f1.frequency.value=190;var g1=ac.createGain();g1.gain.value=.16;n1.connect(f1);f1.connect(g1);g1.connect(ambG);n1.start();
    var n2=ac.createBufferSource();n2.buffer=noiseBuf;n2.loop=true;n2.playbackRate.value=.7;var f2=ac.createBiquadFilter();f2.type='bandpass';f2.frequency.value=1500;f2.Q.value=.4;var g2=ac.createGain();g2.gain.value=.012;n2.connect(f2);f2.connect(g2);g2.connect(ambG);n2.start();
    /* drone under the quiet moments */
    droneG=ac.createGain();droneG.gain.value=0;var df=ac.createBiquadFilter();df.type='lowpass';df.frequency.value=260;df.connect(droneG);droneG.connect(musG);
    [55,55.6,82.4].forEach(function(f){var o=ac.createOscillator();o.type='sawtooth';o.frequency.value=f;o.connect(df);o.start()});
    try{var gsrc=ac.createMediaElementSource(gameMus);gmG=ac.createGain();gmG.gain.value=GLEVEL;gsrc.connect(gmG);gmG.connect(master);gameMus.volume=1}catch(e){gmG=null;gameMus.volume=GLEVEL}
    var n3=ac.createBufferSource();n3.buffer=noiseBuf;n3.loop=true;n3.playbackRate.value=.85;var f3=ac.createBiquadFilter();f3.type='bandpass';f3.frequency.value=560;f3.Q.value=.9;crowdG=ac.createGain();crowdG.gain.value=0;n3.connect(f3);f3.connect(crowdG);crowdG.connect(master);n3.start();
    setInterval(tick,40)}
  if(ac.state==='suspended')ac.resume()}catch(e){}return ac}
function env(node,t,v,d,dest){var a=ac.createGain();a.gain.setValueAtTime(.0001,t);a.gain.exponentialRampToValueAtTime(v,t+.006);a.gain.exponentialRampToValueAtTime(.0001,t+d);node.connect(a);a.connect(dest);return a}
function tone(t,f,d,type,v,cut,dest,f2){var o=ac.createOscillator();o.type=type;o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+d);
  var n=o;if(cut){var fl=ac.createBiquadFilter();fl.type='lowpass';fl.frequency.value=cut;o.connect(fl);n=fl}env(n,t,v,d,dest||sfxG);o.start(t);o.stop(t+d+.05)}
function noise(t,d,v,type,freq,q,dest,rate){var n=ac.createBufferSource();n.buffer=noiseBuf;n.loop=true;n.playbackRate.value=rate||1;var fl=ac.createBiquadFilter();fl.type=type;fl.frequency.value=freq;fl.Q.value=q||.7;n.connect(fl);env(fl,t,v,d,dest||sfxG);n.start(t,Math.random());n.stop(t+d+.05);return fl}
function blip(f,d,v){if(!audio())return;try{tone(ac.currentTime,f,d,'square',v||.03,2600)}catch(e){}}
function foot(side){if(!audio())return;try{var t=ac.currentTime,r=.9+Math.random()*.2;noise(t,.07,.16,'bandpass',(side==='L'?1050:1250)*r,1.1);noise(t,.03,.08,'highpass',3500,.7);tone(t,95*r,.09,'sine',.2,0,sfxG,48)}catch(e){}}
function scuff(side){if(!audio())return;try{var t=ac.currentTime,r=.9+Math.random()*.2;noise(t,.2,.12,'bandpass',(side==='L'?520:640)*r,.8,sfxG,.6);tone(t+.02,70*r,.12,'sine',.16,0,sfxG,42)}catch(e){}}
function thump(v,big){if(!audio())return;try{var t=ac.currentTime;noise(t,big?.28:.12,v,'lowpass',big?500:900,.7);tone(t,big?110:150,big?.32:.14,'sine',v*1.4,0,sfxG,38)}catch(e){}}
function stab(){if(!audio())return;try{var t=ac.currentTime;noise(t,.05,.2,'highpass',2800,.7);noise(t+.01,.16,.22,'lowpass',700,.7);tone(t,160,.2,'sine',.3,0,sfxG,40)}catch(e){}}
function engine(){if(!audio())return;try{var t=ac.currentTime;tone(t,46,2,'sawtooth',.2,320,sfxG,150);tone(t,69,2,'square',.07,260,sfxG,225);noise(t,2,.1,'lowpass',420,.7);noise(t+.05,.5,.07,'bandpass',2400,2)}catch(e){}}
/* one siren: two detuned oscillators through a horn-like resonance, sweeping as a slow wail, optionally breaking into a fast yelp */
function wail(t,dur,mult,vol,dest,pan,yelpAt,lp){
  var o1=ac.createOscillator(),o2=ac.createOscillator(),mix=ac.createGain(),horn=ac.createBiquadFilter(),body=ac.createBiquadFilter(),out=ac.createGain(),lo=640*mult,hi=1380*mult,x=t,end=t+dur;
  o1.type='sawtooth';o2.type='square';o2.detune.value=9;mix.gain.value=.5;horn.type='bandpass';horn.frequency.value=1150*mult;horn.Q.value=.9;body.type='lowpass';body.frequency.value=lp||3200;
  [o1,o2].forEach(function(o){o.frequency.setValueAtTime(lo,t)});
  function sweep(a,b,d){[o1,o2].forEach(function(o){o.frequency.setValueAtTime(a,x);o.frequency.exponentialRampToValueAtTime(b,x+d)});x+=d}
  while(x<end){if(yelpAt&&x>=t+yelpAt){sweep(lo*1.05,hi*1.1,.17);sweep(hi*1.1,lo*1.05,.15)}else{sweep(lo,hi,1.7);sweep(hi,lo,2.1)}}
  out.gain.setValueAtTime(.0001,t);out.gain.exponentialRampToValueAtTime(vol,t+.25);out.gain.setValueAtTime(vol,end-.9);out.gain.exponentialRampToValueAtTime(.0001,end);
  o1.connect(mix);o2.connect(mix);mix.connect(horn);horn.connect(body);body.connect(out);
  var last=out;if(pan&&ac.createStereoPanner){var pn=ac.createStereoPanner();pn.pan.value=pan;out.connect(pn);last=pn}
  last.connect(dest);
  /* slap-back echo off the alley walls */
  var dl=ac.createDelay(.5),fb=ac.createGain(),wet=ac.createGain(),damp=ac.createBiquadFilter();dl.delayTime.value=.21;fb.gain.value=.3;wet.gain.value=.45;damp.type='lowpass';damp.frequency.value=1700;
  last.connect(dl);dl.connect(damp);damp.connect(fb);fb.connect(dl);damp.connect(wet);wet.connect(dest);
  o1.start(t);o2.start(t);o1.stop(end+.1);o2.stop(end+.1)}
function siren(){if(!audio())return;try{var t=ac.currentTime;
  wail(t,7.6,1,.075,sfxG,.35,5.2);wail(t+.9,6.6,.93,.055,sfxG,-.45,0);
  /* two short air-horn blasts as the cars pull up */
  [0,.42].forEach(function(d){tone(t+d,196,.3,'sawtooth',.09,900);tone(t+d,247,.3,'sawtooth',.07,900)})}catch(e){}}
/* ---- ambience events and music, scheduled a little ahead of the clock ---- */
var titleMus=new Audio('assets/audio/title2.mp3'),gameMus=new Audio('assets/audio/game.mp3'),TVOL=.6,GVOL=.32,titleOn=false;
titleMus.loop=true;gameMus.loop=true;titleMus.preload='auto';gameMus.preload='auto';titleMus.volume=TVOL;gameMus.volume=GVOL;
/* some phones ignore element volume, so the level they played at was 1; halve whichever level was actually heard */
var GLEVEL=(Math.abs(gameMus.volume-GVOL)<.02?GVOL:1)*.5,gmG=null;
function playTitle(){if(muted)return;var p=titleMus.play();if(p&&p.then)p.then(function(){titleOn=true;titleHint.textContent='TAP TO START'},function(){titleOn=false;titleHint.textContent='TAP FOR SOUND'});else titleOn=true}
function startGameMusic(){try{titleMus.pause();gameMus.currentTime=0;if(!muted){var p=gameMus.play();if(p&&p.catch)p.catch(function(){})}}catch(e){}}
function mstate(){return null;var m=S.mode,p=C.ph;
  if(m==='ready')return{bpm:112,bass:1,hat:1,prog:[0,0,-4,-2]};
  if(m==='run')return{bpm:116,bass:1,kick:1,snare:1,hat:1,lead:1,prog:[0,0,-4,-2]};
  if(m==='cut'){if(p==='skid'||p==='yell')return{bpm:116,bass:1,hat:1,prog:[0,0,0,0]};
    if(p==='close'||p==='grapple')return{bpm:140,bass:1,kick:1,snare:1,hat:2,prog:[0,0,1,1]};
    if(p==='rise')return{bpm:66,heart:1,drone:.5,prog:[0]};
    if(p==='knife')return{drone:0,silent:1};return{drone:1,silent:1}}
  if(m==='run2')return{bpm:84,bass:1,kick:1,lead:1,drone:.35,prog:[0,0,-4,-5]};
  if(m==='done')return{drone:1,silent:1};return null}
var ARP=[0,null,7,null,12,null,7,3,null,null,15,null,12,null,7,null];
function sched(i,t,st,d){var bar=i>>4,q=i&15,root=st.prog[bar%st.prog.length],bf=55*Math.pow(2,root/12);
  if(st.bass&&q%2===0)tone(t,bf*((q===6||q===14)?2:1),d*1.7,'sawtooth',.11,360,musG);
  if(st.kick&&(q===0||q===8||(st.snare&&q===10)))tone(t,130,.16,'sine',.3,0,musG,42);
  if(st.heart&&(q===0||q===3))tone(t,90,.2,'sine',q?.2:.3,0,musG,40);
  if(st.snare&&(q===4||q===12)){noise(t,.11,.07,'bandpass',1900,.8,musG);tone(t,190,.07,'triangle',.05,0,musG)}
  if(st.hat&&(st.hat===2||q%2===1))noise(t,.03,q%4===3?.03:.018,'highpass',7000,.7,musG);
  if(st.lead&&M.phrase%2===1&&ARP[q]!==null&&(bar%2===0||q<8))tone(t,bf*4*Math.pow(2,ARP[q]/12),d*1.5,'square',.028,1700,musG)}
function tick(){if(!ac||ac.state!=='running')return;var now=ac.currentTime,st=mstate();
  var inHosp=S.mode==='hosp'||(S.mode==='over'&&HS.ph),inDream=(S.mode==='dream'||S.mode==='over')&&!inHosp;ambG.gain.setTargetAtTime(S.mode==='title'?0:inDream?.15:inHosp?.07:1,now,.5);
  if(crowdG)crowdG.gain.setTargetAtTime(inDream?(D.ph==='scoop'?.07:.032+.012*Math.sin(now*.9)):0,now,.6);
  droneG.gain.setTargetAtTime(0,now,.3);
  var duck=S.mode==='cut'&&(C.ph==='knife'||C.ph==='fall')?.3:(S.mode==='hosp'&&HS.ph==='wake')?.3:1,gv=GLEVEL*duck;if(gmG)gmG.gain.setTargetAtTime(gv,now,.25);else if(Math.abs(gameMus.volume-gv)>.01)gameMus.volume+=(gv-gameMus.volume)*.08;
  if(!st||st.silent||!st.bpm){M.next=now+.08;M.step=0}
  else{var d=60/st.bpm/4;if(M.next<now)M.next=now+.03;while(M.next<now+.14){try{sched(M.step,M.next,st,d)}catch(e){}M.next+=d;M.step=(M.step+1)%64;if(!M.step)M.phrase++}}
  if(S.mode==='title')return;
  AMB.car-=.04;AMB.siren-=.04;
  if(AMB.car<=0){AMB.car=7+Math.random()*9;try{var n=ac.createBufferSource();n.buffer=noiseBuf;n.loop=true;var fl=ac.createBiquadFilter();fl.type='bandpass';fl.Q.value=.9;
    fl.frequency.setValueAtTime(260,now);fl.frequency.linearRampToValueAtTime(620,now+1.6);fl.frequency.linearRampToValueAtTime(220,now+3.6);
    var a=ac.createGain();a.gain.setValueAtTime(.0001,now);a.gain.exponentialRampToValueAtTime(.09,now+1.6);a.gain.exponentialRampToValueAtTime(.0001,now+3.8);n.connect(fl);fl.connect(a);
    if(ac.createStereoPanner){var pn=ac.createStereoPanner(),dir=Math.random()<.5?-1:1;pn.pan.setValueAtTime(-dir*.8,now);pn.pan.linearRampToValueAtTime(dir*.8,now+3.6);a.connect(pn);pn.connect(ambG)}else a.connect(ambG);
    n.start(now,Math.random());n.stop(now+4)}catch(e){}}
  if(AMB.siren<=0){AMB.siren=26+Math.random()*24;try{if(Math.random()<.5){wail(now,7.6,.9,.016,ambG,Math.random()<.5?-.6:.6,0,650)}
    else{tone(now,311,.35,'sawtooth',.02,700,ambG);tone(now,392,.35,'sawtooth',.016,700,ambG);tone(now+.5,311,.6,'sawtooth',.02,700,ambG);tone(now+.5,392,.6,'sawtooth',.016,700,ambG)}}catch(e){}}}
