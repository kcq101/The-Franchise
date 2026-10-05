/* Sprite sheets and character drawing for the alley scenes, plus code-drawn fallbacks. */
var OUT='#121119';
function seg(x0,y0,x1,y1,w,c){var n=Math.ceil(Math.max(Math.abs(x1-x0),Math.abs(y1-y0)))||1,h=w/2;g.fillStyle=c;for(var i=0;i<=n;i++)g.fillRect(Math.round(x0+(x1-x0)*i/n-h),Math.round(y0+(y1-y0)*i/n-h),w,w)}
function limb(p,w,c,d){seg(p[0],p[1],p[2],p[3],w+2,OUT);seg(p[2],p[3],p[4],p[5],w+2,OUT);seg(p[0],p[1],p[2],p[3],w,d);seg(p[2],p[3],p[4],p[5],w,d);
  seg(p[0]+1,p[1]-1,p[2]+1,p[3]-1,w-2,c);seg(p[2]+1,p[3]-1,p[4]+1,p[5]-1,w-2,c)}
var MARK={top:'#a3a6b0',topD:'#787b87',topL:'#c3c6ce',leg:'#93969f',legD:'#6b6e79',skin:'#b98d5c',skinD:'#946c42',hair:'#15110e',shoe:'#eceef3',sole:'#9ea2ae'};
var WORK={top:'#2f66c2',topD:'#214a92',topL:'#5b8de0',leg:'#2a5db4',legD:'#1d4284',skin:'#d9a57a',skinD:'#b07f58',hair:'#2a1d14',shoe:'#17171d',sole:'#05050a'};
function figure(px,fy,o){
  var a=o.a,amp=o.amp,P=o.pal,L=11,lean=.03+.3*amp,legs=[],arms=[],k,ak;
  for(k=0;k<2;k++){ak=a+k*Math.PI;var th=(k?-.13:.13)*(1-amp)+.95*Math.sin(ak)*amp,be=.03*(1-amp)+(.25+1.25*Math.max(0,Math.cos(ak)))*amp;
    var kx=Math.sin(th)*L,ky=Math.cos(th)*L;legs.push([kx,ky,kx+Math.sin(th-be)*L,ky+Math.cos(th-be)*L])}
  var hy=fy-Math.max(legs[0][3],legs[1][3])-4+(o.breath||0),hx=px,sx=hx+Math.sin(lean)*17,sy=hy-Math.cos(lean)*17;
  for(k=0;k<2;k++){ak=a+(k?0:Math.PI);var ph=(k?-.12:.12)*(1-amp)+1.05*Math.sin(ak)*amp,bd=.2*(1-amp)+1.5*amp,ex=sx+Math.sin(ph)*8,ey=sy+3+Math.cos(ph)*8;
    arms.push([sx,sy+3,ex,ey,ex+Math.sin(ph+bd)*8,ey+Math.cos(ph+bd)*8])}
  function leg(k,c,d){var l=legs[k],ax=hx+l[2],ay=hy+l[3];limb([hx,hy,hx+l[0],hy+l[1],ax,ay],6,c,d);
    R(ax-4,ay-1,11,5,OUT);R(ax-3,ay,9,3,P.shoe);R(ax-3,ay+2,9,1,P.sole);if(o.kind==='mark'){R(ax-1,ay,1,2,'#b9bcc8');R(ax+1,ay,1,2,'#b9bcc8')}}
  var FB=o.kind==='fb';
  function arm(k,c,d){var p=arms[k];limb(p,5,c,d);R(p[4]-3,p[5]-3,6,6,OUT);R(p[4]-2,p[5]-2,4,4,P.skin);R(p[4]-2,p[5]+1,4,1,P.skinD)}
  R(px-9,fy,20,2,'rgba(0,0,0,.5)');
  arm(1,P.topD,OUT);leg(1,P.legD,'#3a3c46');
  /* torso */
  seg(hx,hy-1,sx,sy,14,OUT);seg(hx,hy-1,sx,sy,12,P.topD);seg(hx+2,hy-2,sx+2,sy-1,9,P.top);seg(hx+4,hy-3,sx+4,sy-1,3,P.topL);
  var hdx=sx+Math.sin(lean)*8+1,hdy=sy-Math.cos(lean)*8,x0=Math.round(hdx-5),y0=Math.round(hdy-7);
  if(o.kind==='mark'){R(hx-6,hy-3,13,3,P.topD);R(hx+2,hy-9,6,5,P.topD);R(hx+2,hy-9,6,1,OUT);
    R(sx-9,sy-6,9,9,OUT);R(sx-8,sy-5,7,7,P.topD);R(sx-7,sy-5,5,2,P.top);R(sx+3,sy-2,1,6,'#e3e5ea');R(sx+5,sy-2,1,5,'#e3e5ea')}
  else if(FB){R(hx-6,hy-3,13,2,P.topD);R(sx-9,sy-6,17,9,OUT);R(sx-8,sy-5,15,7,P.top);R(sx-8,sy-5,15,2,P.topL);R(sx-8,sy+1,15,1,P.topD);R(sx-1,sy+4,6,7,'#f4f4f4');R(sx+1,sy+6,2,3,P.topD)}
  else{R(hx-6,hy-3,13,3,'#16305e');R(hx+1,hy-3,3,3,'#b9bdc9');R(sx+1,sy-4,1,14,P.topL);R(sx+3,sy+1,5,3,'#f1f3f7');R(sx-3,sy-7,9,3,P.topD)}
  /* head */
  R(x0-1,y0-1,12,14,OUT);R(x0,y0,10,12,P.skin);R(x0,y0+10,10,2,P.skinD);R(x0,y0,3,12,P.skinD);
  R(x0+10,y0+5,1,3,P.skin);R(x0+10,y0+4,1,1,OUT);R(x0+10,y0+8,1,1,OUT);
  R(x0+6,y0+4,3,1,OUT);R(x0+7,y0+5,2,2,'#f3efe3');R(x0+8,y0+5,1,2,OUT);R(x0+7,y0+9,3,1,P.skinD);R(x0+3,y0+5,2,3,P.skinD);
  if(o.kind==='mark'){var tr=Math.round(amp*3);R(x0-2,y0-3,12,5,P.hair);R(x0+8,y0-2,3,3,P.hair);R(x0-3,y0-1,6,8,P.hair);R(x0-4-tr,y0+3,6,8,P.hair);R(x0-5-tr,y0+8,4,5,P.hair);R(x0-3-tr,y0+12,3,2,P.hair);R(x0+3,y0+2,2,3,P.hair);R(x0,y0-2,6,1,'#3a2e25')}
  else if(FB){R(x0-3,y0-4,15,16,OUT);R(x0-2,y0-3,13,14,P.helm);R(x0-2,y0-3,13,2,P.helmL);R(x0-2,y0+8,13,3,P.helmD);R(x0+2,y0-3,4,3,P.stripe);R(x0+1,y0+3,2,3,P.helmD);
    R(x0+6,y0+2,6,6,P.skin);R(x0+8,y0+4,1,2,OUT);R(x0+6,y0+2,6,1,OUT);R(x0+11,y0+2,3,1,'#e6e8ee');R(x0+11,y0+5,3,1,'#e6e8ee');R(x0+13,y0+2,1,8,'#e6e8ee');R(x0+8,y0+9,6,1,'#e6e8ee')}
  else{R(x0-1,y0+1,3,6,P.hair);R(x0-2,y0-3,13,5,'#1b3f80');R(x0-2,y0-3,13,1,'#3a66b8');R(x0+8,y0+1,6,2,'#16305e');R(x0+6,y0+8,4,1,P.hair)}
  leg(0,P.leg,P.legD);arm(0,P.top,P.topD);
}

var workImg=load('worker.png'),vanImg=load('van.png'),dumpImg=load('dumpster.png');
function spr(img,fx,fw,fh,x,base){if(!(img.complete&&img.naturalWidth))return false;g.drawImage(img,fx,0,fw,fh,Math.round(x),base-fh/2,fw/2,fh/2);return true}
var markImg=load('mark.png');var CW=134,CH=142,AX=70;
function drawMark(sx,fy,t){var f,rot=0,tt=S.clock-C.t0;
  if(cutting())f=C.ph==='skid'?(tt<.22?12:tt<.75?13:8):8+(((t*2.5)|0)%4);
  else if(S.v>14)f=((S.x/104*8)|0)%8;
  else f=8+(((t*2.5)|0)%4);
  if(!rot)R(sx-13,fy,28,2,'rgba(0,0,0,.5)');
  if(markImg.complete&&markImg.naturalWidth){g.save();g.translate(Math.round(sx*2)/2,fy);if(rot){g.translate(-10,0);g.rotate(rot);g.translate(10,0)}g.drawImage(markImg,f*CW,0,CW,CH,-AX/2,1.5-CH/2,CW/2,CH/2);g.restore()}
  else figure(sx,fy,{a:S.x/72*TAU,amp:Math.min(1,S.v/110),pal:MARK,kind:'mark'});
  return sx}
var m2Img=load('mark2.png'),w2Img=load('worker2.png'),grImg=load('grap.png');
function cell(img,f,cw,ch,ax,x,base){if(!ok(img))return false;g.drawImage(img,f*cw,0,cw,ch,Math.round(x*2-ax)/2,base+1-ch/2,cw/2,ch/2);return true}
function m2(f,x){R(x-16,FEET,f===5?60:32,2,'rgba(0,0,0,.5)');return cell(m2Img,f,136,131,67,x,FEET)}
function w2(f,x){R(x-16,FEET-1,32,2,'rgba(0,0,0,.5)');return cell(w2Img,f,130,144,77,x,FEET-1)}
var limpImg=load('limp.png'),copImg=load('cop.png');
function drawMark2(sx,t){
  if(S.mode==='done'){m2(4,sx);return}
  if(S.v>10&&ok(limpImg)){R(sx-13,FEET,28,2,'rgba(0,0,0,.5)');cell(limpImg,((S.x/50*6)|0)%6,93,133,61,sx,FEET);return}
  if(S.v>10&&ok(markImg)){var f=((S.x/64*8)|0)%8,rot=.06+.09*Math.sin(S.x/19),dip=Math.round(Math.abs(Math.sin(S.x/38))*2);
    R(sx-13,FEET,28,2,'rgba(0,0,0,.5)');g.save();g.translate(Math.round(sx*2)/2,FEET+dip);g.rotate(rot);g.drawImage(markImg,f*CW,0,CW,CH,-AX/2,1.5-CH/2,CW/2,CH/2);g.restore()}
  else m2(3,sx)}
function cop(x,base,t,n){var on=((t*5+n)|0)%2;
  if(ok(copImg)){x=Math.round(x);R(x+6,base-1,168,3,'rgba(0,0,0,.55)');g.drawImage(copImg,on?356:0,0,356,123,x,base+1-61.5,178,61.5);
    g.save();g.globalCompositeOperation='lighter';var lx=x+(on?114:100),ly=base-56,lg=g.createRadialGradient(lx,ly,2,lx,ly,130);
    lg.addColorStop(0,on?'rgba(60,120,255,.55)':'rgba(255,50,40,.55)');lg.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=lg;g.fillRect(lx-130,ly-130,260,260);g.restore();return}
  function P(a,b,c,d,col){g.fillStyle=col;g.fillRect(a,b,c,d)}
  g.save();g.translate(Math.round(x),base);g.scale(.75,.75);
  P(-6,-4,232,8,'rgba(0,0,0,.55)');
  g.fillStyle='#101116';g.beginPath();g.moveTo(54,-48);g.lineTo(78,-76);g.lineTo(150,-76);g.lineTo(176,-48);g.closePath();g.fill();
  g.fillStyle='#2b3c62';g.beginPath();g.moveTo(62,-48);g.lineTo(82,-71);g.lineTo(108,-71);g.lineTo(108,-48);g.closePath();g.fill();
  g.beginPath();g.moveTo(114,-48);g.lineTo(114,-71);g.lineTo(147,-71);g.lineTo(167,-48);g.closePath();g.fill();P(84,-68,14,3,'#5f79b0');
  P(4,-48,214,32,'#14151b');P(0,-42,6,22,'#14151b');P(216,-44,6,24,'#14151b');P(4,-48,214,2,'#3a3d4a');
  P(62,-48,100,32,'#e8ebf1');P(110,-48,2,32,'#9aa0ae');P(62,-18,100,2,'#9aa0ae');P(0,-30,222,4,'#2f66c2');
  P(88,-40,10,3,'#14151b');P(138,-40,10,3,'#14151b');P(0,-40,5,7,'#ffe7ab');P(217,-42,5,8,'#e2362c');P(-3,-22,10,6,'#6b7080');P(215,-22,10,6,'#6b7080');
  g.font='10px "Press Start 2P", monospace';g.textAlign='center';g.textBaseline='top';g.fillStyle='#14151b';g.fillText('POLICE',112,-27+12-12);
  P(92,-86,40,3,'#2a2c36');P(94,-84,18,9,on?'#ff3b30':'#6a1512');P(112,-84,18,9,on?'#122a6e':'#3d7bff');
  g.fillStyle='#07070c';[42,180].forEach(function(wx){g.beginPath();g.arc(wx,-15,15,0,TAU);g.fill()});
  [42,180].forEach(function(wx){P(wx-6,-21,12,12,'#8a8f9c');P(wx-3,-18,6,6,'#2c2f3a')});
  g.restore();
  g.save();g.globalCompositeOperation='lighter';var gx=x+84,gy=base-62,gl=g.createRadialGradient(gx,gy,2,gx,gy,150);
  gl.addColorStop(0,on?'rgba(255,50,40,.5)':'rgba(50,110,255,.5)');gl.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gl;g.fillRect(gx-150,gy-150,300,300);g.restore()}
var FIST=[null,null,[-11.6,-29.2],[-33.6,-41.9],[-2.1,-40.5]];
function knife(x,y){x=Math.round(x);y=Math.round(y);R(x-13,y-2,14,4,OUT);R(x-12,y-1,12,2,'#eef1f8');R(x-12,y,12,1,'#9aa2b8');R(x-14,y-1,2,1,'#eef1f8');R(x-1,y-2,2,4,'#6b4526')}
function bubble(cx,y,text,jit){var w=text.length*8+9,x=Math.round(cx-w/2+(jit?Math.sin(S.clock*50)*1.5:0));y=Math.round(y+(jit?Math.cos(S.clock*43)*1.5:0));
  R(x-1,y-1,w+2,17,OUT);R(x,y,w,15,'#f6f3e8');R(Math.round(cx)-3,y+15,7,3,OUT);R(Math.round(cx)-2,y+14,5,3,'#f6f3e8');R(Math.round(cx)-1,y+17,3,2,OUT);R(Math.round(cx),y+16,1,2,'#f6f3e8');
  g.font='8px "Press Start 2P", monospace';g.textBaseline='top';g.textAlign='left';g.fillStyle='#c2281f';g.fillText(text,x+5,y+4)}
var GLY='#@$%&!?*';
function gibber(t){var o='',n=(t*14)|0;for(var i=0;i<6;i++)o+=GLY.charAt((n*7+i*13+((n*(i+3))%5))%GLY.length);return o}
