/* Title screen, L and R buttons, keyboard, sound toggle, and what a tap does in each alley scene. */
function reset(){S.mode='ready';S.x=START;S.v=0;S.last=null;S.t=0;S.miss=0;S.bang=0;S.score=0;S.cam=0;endBox.hidden=true;hint.textContent=RUNHINT;hint.hidden=false;tug.hidden=true;barlab.textContent='SPEED';C.ph='';C.k=0;C.hp=6;C.rot=0;C.flash=0;C.shake=0;C.vanx=0;C.vanGone=false;D.ph='';D.white=0;D.wait=0;lvl.innerHTML='RUSHVILLE<br>LEVEL 1-1';
  padL.disabled=padR.disabled=false;padL.classList.add('next');padR.classList.add('next');scoreEl.textContent='000000';track.style.width='0%'}
function begin(){if(S.mode!=='title')return;if(!titleOn&&!muted&&(begin.asked=(begin.asked||0)+1)<=2){playTitle();return}audio();startGameMusic();titleEl.hidden=true;reset();[262,330,392,523].forEach(function(f,i){setTimeout(function(){blip(f,.1,.035)},i*90)});
  try{var el=document.documentElement;if(window.matchMedia('(pointer:coarse)').matches&&el.requestFullscreen)el.requestFullscreen().then(function(){if(screen.orientation&&screen.orientation.lock)screen.orientation.lock('landscape').catch(function(){})}).catch(function(){})}catch(e){}}
var titleHint=document.getElementById('titlehint');titleEl.addEventListener('click',begin);playTitle();
function step(side){
  if(S.mode==='title'){begin();return}
  if(S.mode==='dream'){dreamTap(side);return}
  if(S.mode==='done'||S.mode==='over')return;
  if(S.mode==='cut'){if(C.ph!=='grapple')return;var pe=side==='L'?padL:padR;
    if(S.last===side){pe.classList.add('miss');setTimeout(function(){pe.classList.remove('miss')},120);blip(70,.08,.045);return}
    S.last=side;C.p=Math.min(1,C.p+.08);C.shake=Math.max(C.shake,.3);S.score+=25;scoreEl.textContent=pad6(S.score);
    padL.classList.toggle('next',side==='R');padR.classList.toggle('next',side==='L');thump(.14);return}
  if(S.mode==='run2'){var p2=side==='L'?padL:padR;hint.hidden=true;
    if(S.last===side){S.v*=.7;p2.classList.add('miss');setTimeout(function(){p2.classList.remove('miss')},120);blip(70,.08,.045);return}
    S.last=side;S.v=Math.min(120,S.v+24);padL.classList.toggle('next',side==='R');padR.classList.toggle('next',side==='L');scuff(side);return}
  if(S.mode==='ready'){S.mode='run';hint.hidden=true}
  var el=side==='L'?padL:padR;
  if(S.last===side){S.v*=.8;S.miss++;el.classList.add('miss');setTimeout(function(){el.classList.remove('miss')},120);blip(70,.08,.045);return}
  S.last=side;S.v=Math.min(250,S.v+38);
  padL.classList.toggle('next',side==='R');padR.classList.toggle('next',side==='L');foot(side);
}
function bindPad(el,side){
  el.addEventListener('pointerdown',function(e){e.preventDefault();el.classList.add('down');if(S.mode!=='title')step(side)});
  /* on the title screen the pads act like a tap on the screen; a click is what phones accept for starting sound */
  el.addEventListener('click',function(e){if(S.mode==='title'&&e.detail!==0)begin()});
  ['pointerup','pointercancel','pointerleave'].forEach(function(n){el.addEventListener(n,function(){el.classList.remove('down')})});
  el.addEventListener('contextmenu',function(e){e.preventDefault()});
  el.addEventListener('keydown',function(e){if(e.key===' '||e.key==='Enter'){e.preventDefault();if(!e.repeat)step(side)}});
}
bindPad(padL,'L');bindPad(padR,'R');
window.addEventListener('keydown',function(e){if(e.repeat)return;var k=e.key.toLowerCase();
  if(k==='arrowleft'||k==='a'){e.preventDefault();padL.classList.add('down');step('L')}
  else if(k==='arrowright'||k==='d'){e.preventDefault();padR.classList.add('down');step('R')}});
window.addEventListener('keyup',function(){padL.classList.remove('down');padR.classList.remove('down')});
document.getElementById('again').addEventListener('click',reset);
var sndBtn=document.getElementById('snd');sndBtn.addEventListener('click',function(){muted=!muted;sndBtn.textContent=muted?'SOUND OFF':'SOUND ON';if(!muted)audio();if(master)master.gain.value=muted?0:1;
  if(muted){gameMus.pause();titleMus.pause()}else if(S.mode!=='title'){var p=gameMus.play();if(p&&p.catch)p.catch(function(){})}});
document.addEventListener('visibilitychange',function(){if(document.hidden){gameMus.pause();titleMus.pause()}else if(!muted){var p=(S.mode==='title'?(titleOn?titleMus:null):gameMus);if(p){p=p.play();if(p&&p.catch)p.catch(function(){})}}});
