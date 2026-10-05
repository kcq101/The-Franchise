/* Alley scenery: wall-section layout, fences, lamp poles, the neon sign and code-drawn props. */
var fenceP=(function(){var c=mk(6,6),x=c.getContext('2d');x.fillStyle='rgba(150,158,190,.5)';for(var i=0;i<6;i++){x.fillRect(i,i,1,1);x.fillRect(i,5-i,1,1)}return g.createPattern(c,'repeat')})();
var skyImg=load('sky.webp'),streetImg=load('street.webp');
var SEC=[null,{w:690,h:345},{w:601,h:336},{w:759,h:340},{w:728,h:338},{w:807,h:325}];
for(var si=1;si<6;si++)SEC[si].img=load('sec'+si+'.webp');
var wall=[],props=[],lamps=[],SIGNX=198;
function layout(){var x=-30;
  function sec(n,f){wall.push({s:SEC[n],x:x,f:f});x+=SEC[n].w/2}
  function gap(w){props.push({t:'fence',x:x-2,w:w+4});if(w>75){props.push({t:'pole',x:x+(w>>1)});lamps.push({x:x+(w>>1)+9,y:BASE-56})}x+=w}
  sec(1);sec(2);sec(3);gap(90);sec(4);sec(5,1);gap(70);sec(2);sec(3,1);gap(110);sec(4,1);gap(80);sec(3);
  gap(END-110-x);sec(5);sec(2);sec(4);gap(90);sec(3,1);sec(1);gap(80);sec(4,1);sec(2);gap(100);sec(5,1);sec(3)}


function can(x){R(x-1,BASE-17,16,24,OUT);R(x,BASE-16,14,22,'#6c7284');R(x,BASE-16,4,22,'#8f96aa');R(x+11,BASE-16,3,22,'#474c5c');for(var i=3;i<13;i+=3)R(x+i,BASE-13,1,18,'#4d5263');R(x-2,BASE-19,18,4,OUT);R(x-1,BASE-18,16,2,'#8f96aa');R(x+5,BASE-21,4,2,'#474c5c')}
function bags(x){R(x-1,BASE-9,15,16,OUT);R(x,BASE-8,13,14,'#17181f');R(x+2,BASE-6,3,2,'#3d4050');R(x+5,BASE-12,3,4,'#17181f');R(x+10,BASE-4,13,11,OUT);R(x+11,BASE-3,11,9,'#1e2029');R(x+13,BASE-1,3,1,'#454859');R(x+15,BASE-6,3,3,'#1e2029')}
function crate(x){R(x-1,BASE-17,24,24,OUT);R(x,BASE-16,22,22,'#7a532c');R(x+3,BASE-13,16,16,'#5e3f20');R(x,BASE-16,22,3,'#99703d');R(x,BASE+3,22,3,'#4a3018');R(x,BASE-16,3,22,'#8a6234');R(x+19,BASE-16,3,22,'#4a3018');
  for(var i=0;i<16;i++){R(x+3+i,BASE-13+i,2,1,'#8a6234');R(x+17-i,BASE-13+i,2,1,'#8a6234')}}
function pallets(x){R(x-1,BASE-25,38,32,OUT);for(var i=0;i<5;i++){var y=BASE-24+i*6;R(x,y,36,3,'#8a6234');R(x,y,36,1,'#a67c45');R(x,y+3,36,3,'#241a12');R(x+1,y+3,4,3,'#5e3f20');R(x+16,y+3,4,3,'#5e3f20');R(x+31,y+3,4,3,'#5e3f20')}}
function dumpster(x){R(x-2,BASE-27,62,35,OUT);R(x,BASE-18,58,24,'#2c5a63');R(x,BASE-18,58,2,'#3f7c86');R(x,BASE+2,58,4,'#1c3b42');for(var i=8;i<58;i+=12)R(x+i,BASE-15,2,18,'#224850');
  R(x-1,BASE-26,60,8,'#1e3f46');R(x-1,BASE-26,60,2,'#346670');R(x+28,BASE-26,2,8,OUT);R(x+38,BASE-12,12,9,'#e4e6ea');R(x+40,BASE-10,8,2,'#c2392d');R(x+40,BASE-6,6,1,'#555');
  R(x+4,BASE+6,6,3,OUT);R(x+48,BASE+6,6,3,OUT)}
function barrel(x){R(x-1,BASE-19,16,27,OUT);R(x,BASE-18,14,22,'#e06a1e');R(x,BASE-18,3,22,'#f58c3c');R(x+11,BASE-18,3,22,'#a8480f');R(x,BASE-13,14,4,'#eef0f4');R(x,BASE-4,14,4,'#eef0f4');R(x+11,BASE-13,3,4,'#aab0bd');R(x+11,BASE-4,3,4,'#aab0bd');R(x-2,BASE+4,18,4,'#17171d');R(x+4,BASE-22,6,4,OUT);R(x+5,BASE-21,4,2,'#ffb347')}
function fence(x,w){g.save();g.translate(x,BASE-50);g.fillStyle=fenceP;g.fillRect(0,0,w,50);g.restore();R(x,BASE-51,w,2,'#3a3f55');R(x,BASE-2,w,2,'#252838');
  for(var p=0;p<=w;p+=30){R(x+Math.min(p,w-2),BASE-54,2,56,'#2a2e40');R(x+Math.min(p,w-2),BASE-54,1,56,'#4b5068')}}
function pole(x){R(x-1,BASE-60,4,68,OUT);R(x,BASE-59,2,66,'#2c3040');R(x-2,BASE+2,6,5,'#1a1c26');R(x,BASE-61,12,2,'#2c3040');R(x+5,BASE-60,9,4,OUT);R(x+6,BASE-59,7,2,'#1c1e28');R(x+7,BASE-57,5,2,'#fff0c0')}
function drawProp(p,sx){switch(p.t){case 'can':can(sx);break;case 'bags':bags(sx);break;case 'canbags':can(sx);bags(sx+17);break;case 'crate':crate(sx);break;case 'pallets':pallets(sx);break;
  case 'dumpster':dumpster(sx);bags(sx+62);break;case 'barrels':barrel(sx);barrel(sx+46);R(sx+13,BASE-16,34,7,OUT);for(var i=0;i<32;i+=8){R(sx+14+i,BASE-15,4,5,'#e06a1e');R(sx+18+i,BASE-15,4,5,'#eef0f4')}barrel(sx+86);break;
  case 'fence':fence(sx,p.w);break;case 'pole':pole(sx);break}}
function propW(p){return p.t==='fence'?p.w:p.t==='barrels'?110:p.t==='dumpster'?90:60}

function drawVan(x,b){
  R(x-4,b,162,3,'rgba(0,0,0,.55)');
  R(x-1,b-67,122,60,OUT);R(x+119,b-52,34,45,OUT);R(x+112,b-63,14,14,OUT);
  R(x,b-66,120,58,'#d3d7e0');R(x,b-66,120,3,'#f2f4f8');R(x,b-30,120,22,'#b4b9c6');
  R(x+120,b-51,32,43,'#d3d7e0');R(x+113,b-62,12,12,'#d3d7e0');R(x+120,b-30,32,22,'#b4b9c6');
  R(x+124,b-50,4,2,'#d3d7e0');R(x+122,b-58,18,20,'#1d2742');R(x+138,b-52,8,14,'#1d2742');R(x+124,b-56,6,3,'#4d609a');R(x+140,b-58,6,6,'#d3d7e0');
  R(x,b-34,152,5,'#2f66c2');R(x,b-29,152,1,'#1d4284');
  R(x+60,b-60,34,50,'#090a12');R(x+58,b-62,2,54,'#8d93a3');R(x+94,b-62,2,54,'#8d93a3');R(x+64,b-26,14,16,'#4a3824');R(x+64,b-26,14,2,'#6b5236');R(x+80,b-20,10,10,'#3a3f4f');
  R(x+10,b-58,36,1,'#9aa0b0');R(x+10,b-12,36,1,'#9aa0b0');
  R(x,b-48,3,10,'#e2362c');R(x,b-36,3,3,'#f6b93a');R(x+150,b-24,3,6,'#ffe7ab');R(x+146,b-12,8,4,'#5d6272');R(x-2,b-12,6,4,'#5d6272');
  /* roof rack and ladder */
  R(x+8,b-71,100,1,OUT);R(x+12,b-71,2,5,OUT);R(x+100,b-71,2,5,OUT);R(x+16,b-75,84,2,'#e0a02a');R(x+16,b-72,84,1,'#b27a18');for(var i=20;i<98;i+=8)R(x+i,b-75,1,4,'#b27a18');
  g.fillStyle='#07070c';[x+26,x+128].forEach(function(wx){g.beginPath();g.arc(wx,b-7,10,0,TAU);g.fill()});
  [x+26,x+128].forEach(function(wx){R(wx-4,b-11,8,8,'#767c8c');R(wx-2,b-9,4,4,'#30333e')});
}
function drawBigDumpster(x){dumpster(x);bags(x-22)}

function sign(cx,t){var fl=(Math.sin(t*37)>.96||Math.sin(t*5.3)>.985)?.35:1;
  g.save();g.globalAlpha=fl;g.font='8px "Press Start 2P", monospace';g.textBaseline='top';g.textAlign='center';
  g.fillStyle='#ff5a3c';g.fillText('RUSHVILLE',cx,BASE-107);g.fillText('PRIME',cx,BASE-95);g.fillStyle='#ffd27a';g.fillText('STEAKHOUSE',cx,BASE-82);
  g.globalCompositeOperation='lighter';var gl=g.createRadialGradient(cx,BASE-90,8,cx,BASE-90,90);gl.addColorStop(0,'rgba(255,80,50,'+(.22*fl)+')');gl.addColorStop(1,'rgba(255,80,50,0)');g.fillStyle=gl;g.fillRect(cx-90,BASE-180,180,180);g.restore()}
