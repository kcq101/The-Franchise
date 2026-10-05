/* Draws one frame of the alley scenes. */
function draw(){
  if(S.mode==='dream'||S.mode==='over'){drawDream();return}
  var cam=Math.round(S.cam),t=S.clock,i,sx,b,p,z=1,tx=0,ty=0;
  if(cutting()){var kk=C.k*C.k*(3-2*C.k),fx=END+29-cam,fy=FEET-34;z=1+.55*kk;tx=fx+(W/2-fx)*kk-fx*z;ty=fy+(H*.6-fy)*kk-fy*z;
    if(C.shake>0){tx+=(Math.random()-.5)*5*C.shake;ty+=(Math.random()-.5)*4*C.shake}}
  g.setTransform(2,0,0,2,0,0);R(0,0,W,H,'#0b1242');g.setTransform(2*z,0,0,2*z,2*tx,2*ty);
  R(0,0,W,H,'#0b1242');
  if(ok(skyImg))g.drawImage(skyImg,-Math.round(Math.min(Math.max(0,620-W),cam*.03)),BASE-160,620,160);
  for(i=0;i<wall.length;i++){b=wall[i];var bw=b.s.w/2,bh=b.s.h/2;sx=b.x-cam;if(sx<W&&sx+bw>0&&ok(b.s.img)){
    if(b.f){g.save();g.translate(sx+bw,0);g.scale(-1,1);g.drawImage(b.s.img,0,BASE-bh,bw,bh);g.restore()}else g.drawImage(b.s.img,sx,BASE-bh,bw,bh)}}
  if(SIGNX-cam>-120)sign(SIGNX-cam,t);
  for(i=0;i<props.length;i++){p=props[i];sx=p.x-cam;if(sx<W+10&&sx+propW(p)>-10)drawProp(p,sx)}
  if(ok(streetImg)){for(sx=-(cam%475);sx<W;sx+=475)g.drawImage(streetImg,sx,BASE,475,56)}else R(0,BASE,W,H-BASE,'#14162a');
  sx=END-cam;if(sx<W+80){if(!spr(dumpImg,0,181,111,sx+84,CURB+2))drawBigDumpster(sx+88)}
  /* the meeting */
  sx=END-cam;var tt=t-C.t0,cut=cutting(),ph=cut?C.ph:'',art=ok(m2Img)&&ok(w2Img)&&ok(grImg),jit=Math.round(Math.sin(t*46));
  if(!C.vanGone){var vx=sx+182+(C.vanx||0)+(ph==='flee'&&tt>.9?Math.round(Math.sin(t*60)):0);
    if(ph==='drive')for(i=0;i<4;i++){var pa=(tt*3+i*.25)%1;g.globalAlpha=.35*(1-pa);R(vx-6-pa*26,ROAD+2-pa*10+i%2*3,5+pa*8,4+pa*5,'#c9cdd8')}g.globalAlpha=1;
    if(vx<W+40&&!spr(vanImg,0,377,174,vx,ROAD+12)){g.save();g.translate(vx-22,ROAD+11);g.scale(1.25,1.25);drawVan(0,0);g.restore()}}
  [0,2,1].forEach(function(n){var cx=END2+[50,168,286][n]-cam;if(cx<W+160&&cx>-330)cop(cx,ROAD+[8,26,8][n],t,n)});
  if(!art||ph===''||ph==='skid'){
    if(sx<W+40&&!C.vanGone){R(sx+45,FEET-2,28,2,'rgba(0,0,0,.5)');
      if(!spr(workImg,(((t*2.5)|0)%4)*52,52,139,sx+45,FEET-1)){g.save();g.translate(sx+58,FEET-2);g.scale(-1.18,1.18);figure(0,0,{a:0,amp:0,pal:WORK,kind:'work'});g.restore()}
      if(ph==='skid'){var by=FEET-88-Math.round(Math.abs(Math.sin(tt*9))*4);R(sx+53,by-1,6,18,OUT);R(sx+54,by,4,10,'#ffd27a');R(sx+54,by+12,4,4,'#ffd27a')}}
    if(S.mode==='run2'||S.mode==='done')drawMark2(S.x-cam,t);else drawMark(S.x-cam,FEET,t)}
  else if(ph==='yell'){var hop=tt<.25?Math.round(Math.sin(tt/.25*Math.PI)*5):0;
    g.save();g.translate(0,-hop);w2(0,sx+62);g.restore();m2([0,1,2,1][((tt*6)|0)%4],sx+jit);
    bubble(sx+2,FEET-93,gibber(t),true);if(tt>.15)bubble(sx+52,FEET-99-hop,'!?',false)}
  else if(ph==='close'){var u=Math.min(1,tt/.5);w2(0,sx+62-4*u);m2(2,sx+12*u)}
  else if(ph==='grapple'){var gx=sx+34+C.p*12+jit,gf=C.p<-.35?(((t*6)|0)%2?3:0):C.p>.3?(((t*8)|0)%2?1:2):(((t*8)|0)%2?0:2);
    R(gx-34,FEET,68,2,'rgba(0,0,0,.5)');cell(grImg,gf,157,128,78,gx,FEET);
    for(i=0;i<3;i++){var a=t*7+i*2.1,rx=gx+Math.cos(a)*22,ry=FEET-70+Math.sin(a*1.3)*8;if(Math.sin(a*3)>0){R(rx,ry,3,1,'#ffffff');R(rx+1,ry-1,1,3,'#ffffff')}}}
  else{var bx=sx+34+C.gp,wxa=bx+26,wf=2,mf=5,mx=bx-34,showW=true,flip=false;
    if(ph==='knife'){wf=tt<.45?1:2;mx=bx-22-C.jabs*3;mf=C.jabs?3:0;
      if(C.jabs)wf=4;for(i=0;i<3;i++){var d=tt-JAB[i];if(d>0&&d<.2){wf=3;wxa-=4}}}
    else if(ph==='fall'){if(tt<.45){mf=3;mx=bx-31}else if(tt<1){mf=4;mx=bx-33}}
    else if(ph==='flee'){var fu=Math.min(1,tt/.9);fu=fu*fu*(3-2*fu);wxa=bx+26+(sx+272-bx-26)*fu;wf=4;flip=true;showW=tt<.9}
    else if(ph==='drive')showW=false;
    else if(ph==='rise'){showW=false;if(tt>2.3){mf=3;mx=bx-34}else if(tt>1.1){mf=4;mx=bx-34}}
    if(showW){if(flip){g.save();g.translate(Math.round(wxa),-Math.round(Math.abs(Math.sin(tt*18))*2));g.scale(-1,1);w2(wf,0);g.restore()}else w2(wf,wxa)}
    if(showW&&!flip&&FIST[wf]&&(ph!=='knife'||tt>.45)){var kx=wxa+FIST[wf][0],ky=FEET+FIST[wf][1];knife(kx,ky);
      if(ph==='knife'&&tt<.9){var gs=Math.round(2+5*Math.abs(Math.sin((tt-.45)*9)));R(kx-13-gs,ky,gs*2+1,1,'#ffffff');R(kx-13,ky-gs,1,gs*2+1,'#ffffff')}}
    m2(mf,mx);
    if(ph==='knife'){if(tt>.45&&!C.jabs)bubble(mx+2,FEET-93,'!',false);
      if(C.flash>.35){var hx=mx+8,hy=FEET-38;R(hx-7,hy,15,2,'#fff3b0');R(hx,hy-7,2,15,'#fff3b0');R(hx-4,hy-4,3,3,'#ffffff');R(hx+3,hy+2,3,3,'#ffffff');R(hx+3,hy-5,2,2,'#ffb347');R(hx-5,hy+3,2,2,'#ffb347')}}}
  /* lamp light */
  g.save();g.globalCompositeOperation='lighter';
  for(i=0;i<lamps.length;i++){var l=lamps[i];sx=l.x-cam;if(sx<-70||sx>W+70)continue;
    var gl=g.createRadialGradient(sx,l.y+8,2,sx,l.y+8,58);gl.addColorStop(0,'rgba(255,196,110,.5)');gl.addColorStop(.4,'rgba(255,170,80,.16)');gl.addColorStop(1,'rgba(255,170,80,0)');g.fillStyle=gl;g.fillRect(sx-58,l.y-50,116,116);
    g.globalAlpha=.07;g.fillStyle='#ffc878';g.beginPath();g.moveTo(sx-4,l.y);g.lineTo(sx+4,l.y);g.lineTo(sx+46,ROAD);g.lineTo(sx-46,ROAD);g.closePath();g.fill();g.globalAlpha=1}
  g.restore();
  g.setTransform(2,0,0,2,0,0);
  if(S.mode==='run2'){var vg=g.createRadialGradient(W/2,H/2,H*.45,W/2,H/2,W*.62);vg.addColorStop(0,'rgba(160,0,0,0)');vg.addColorStop(1,'rgba(160,0,0,'+(.3+.14*Math.sin(t*4)).toFixed(2)+')');g.fillStyle=vg;g.fillRect(0,0,W,H)}
  if(D.white>0&&S.mode==='done')R(0,0,W,H,'rgba(255,255,255,'+D.white.toFixed(2)+')');
  if(cut&&C.flash>0)R(0,0,W,H,'rgba(255,50,40,'+(C.flash*.38).toFixed(2)+')');
}
