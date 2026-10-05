/* The game loop and start-up. */
var prev=performance.now();
function frame(now){
  var dt=Math.min(.05,(now-prev)/1000);prev=now;S.clock+=dt;
  if(S.mode==='run'){S.t+=dt;S.v*=Math.exp(-1.5*dt);S.x+=S.v*dt;S.score+=S.v*dt*.6;
    if(S.x>=END)arrive();else scoreEl.textContent=pad6(S.score);
    track.style.width=Math.min(100,(S.x-START)/RUN*100).toFixed(1)+'%'}
  if(S.mode==='cut')cutUpdate(dt);
  if(S.mode==='done'){D.wait+=dt;if(D.wait>3.4){D.white=Math.min(1,D.white+dt*.5);if(D.white>=1)startDream()}}
  else if(S.mode==='dream')dreamUpdate(dt);
  if(S.mode==='run2'){S.t2+=dt;S.v*=Math.exp(-1.8*dt);S.x+=S.v*dt;S.score+=S.v*dt*.6;scoreEl.textContent=pad6(S.score);
    track.style.width=Math.min(100,(S.x-END)/(END2-END)*100).toFixed(1)+'%';if(S.x>=END2)arrive2()}
  var on=S.mode==='cut'?C.hp:(S.mode==='run2'||S.mode==='done')?(((S.clock*3)|0)%2):Math.ceil(Math.min(1,S.v/230)*6);if(S.mode!=='dream'&&S.mode!=='over')for(var i=0;i<6;i++)segs[i].className=i<on?'on':'';
  var follow=Math.max(0,S.x-W*.3),target=follow,ease=false;
  if(S.mode==='cut'){ease=true;target=(C.ph==='flee'||C.ph==='drive')?END+170-W/2:C.ph==='rise'?follow:END+29-W/2}
  else if(S.mode==='done'){ease=true;target=END2-25}
  S.cam=ease?S.cam+(target-S.cam)*Math.min(1,dt*3.5):target;
  if(S.ready)draw();requestAnimationFrame(frame);
}
function boot(){if(S.ready)return;layout();S.ready=true}
if(document.fonts&&document.fonts.load){document.fonts.load('18px "Press Start 2P"').then(boot,boot);setTimeout(boot,1500)}else boot();
requestAnimationFrame(frame);
