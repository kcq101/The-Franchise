/* Alley story beats: arriving at the van, the confrontation timeline, and reaching the police. */
function arrive(){S.mode='cut';S.x=END;S.v=0;S.bang=S.clock;padL.disabled=padR.disabled=true;padL.classList.remove('next');padR.classList.remove('next');
  var bonus=Math.max(0,Math.round((45-S.t)*100));S.score+=bonus;scoreEl.textContent=pad6(S.score);
  S.stat='RUN '+S.t.toFixed(1)+'s<br>TIME BONUS '+bonus;
  C.p=0;C.gp=0;C.k=0;C.hp=6;C.mxo=0;C.wxo=0;C.jabs=0;C.flash=0;C.shake=0;C.rot=0;C.voice=0;C.ping=false;C.thud=false;barlab.textContent='HEALTH';phase('skid');
  [330,440,660].forEach(function(f,i){setTimeout(function(){blip(f,.12,.04)},i*110)})}
var JAB=[.9,1.45,2];
function cutUpdate(dt){var tt=S.clock-C.t0,u;
  if(C.ph==='flee'||C.ph==='drive'||C.ph==='rise')C.k=Math.max(0,C.k-dt*1.1);else if(C.ph!=='skid')C.k=Math.min(1,C.k+dt*1.3);
  C.flash=Math.max(0,C.flash-dt*4);C.shake=Math.max(0,C.shake-dt*5);
  if(C.ph==='skid'){if(tt>.9)phase('yell')}
  else if(C.ph==='yell'){C.voice-=dt;if(C.voice<=0){C.voice=.085;blip(180+Math.random()*420,.07,.03)}if(tt>3)phase('close')}
  else if(C.ph==='close'){u=Math.min(1,tt/.5);C.mxo=20*u;C.wxo=-16*u;
    if(tt>.7){phase('grapple');S.last=null;padL.disabled=padR.disabled=false;padL.classList.add('next');padR.classList.add('next');
      hint.textContent='MASH L, R! PUSH HIM BACK';hint.hidden=false;tug.hidden=false;barlab.textContent='HEALTH';thump(.25,true)}}
  else if(C.ph==='grapple'){C.p=Math.max(-1,C.p-(.3+.07*tt)*dt);tugFill.style.width=(50+C.p*50).toFixed(1)+'%';
    if(tt>.5&&(C.p<=-1||C.p>=1||tt>9)){C.gp=C.p*12;phase('knife');padL.disabled=padR.disabled=true;padL.classList.remove('next');padR.classList.remove('next');hint.hidden=true;tug.hidden=true}}
  else if(C.ph==='knife'){
    if(!C.ping&&tt>.45){C.ping=true;blip(1400,.25,.04);blip(2100,.3,.025)}
    if(C.jabs<3&&tt>=JAB[C.jabs]+.07){C.jabs++;C.hp-=2;C.flash=1;C.shake=1;stab()}
    if(tt>2.8)phase('fall')}
  else if(C.ph==='fall'){
    if(!C.thud&&tt>1){C.thud=true;C.shake=1;thump(.3,true)}
    if(tt>2.1){phase('flee');blip(300,.08,.03)}}
  else if(C.ph==='flee'){C.voice-=dt;if(C.voice<=0){C.voice=.13;foot(C.jf=C.jf==='L'?'R':'L')}if(tt>1.05){phase('drive');C.shake=.7;engine()}}
  else if(C.ph==='drive'){C.vanx=300*tt*tt;
    if(tt>1.5){C.vanGone=true;S.x=END+C.gp;phase('rise')}}
  else if(C.ph==='rise'){if(tt>3.3){S.mode='run2';S.last=null;S.v=0;S.t2=0;C.k=0;padL.disabled=padR.disabled=false;padL.classList.add('next');padR.classList.add('next');
    hint.textContent='TAP L, R TO STUMBLE ON';hint.hidden=false;track.style.width='0%'}}}
function arrive2(){S.mode='done';S.x=END2;S.v=0;padL.disabled=padR.disabled=true;padL.classList.remove('next');padR.classList.remove('next');
  siren();
  S.stat+='<br>STUMBLE '+S.t2.toFixed(1)+'s';D.wait=0;D.white=0}
