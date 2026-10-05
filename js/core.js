/* Canvas setup, constants and small helpers shared by every other file. */
var cv=document.getElementById('c'),g=cv.getContext('2d'),stage=document.getElementById('stage');
var W=468,H=216,BASE=160,CURB=168,ROAD=172,FEET=190,TAU=Math.PI*2;
var START=110,RUN=3600,END=START+RUN,END2=END+1800;
var padL=document.getElementById('padL'),padR=document.getElementById('padR');
var hint=document.getElementById('hint'),endBox=document.getElementById('end'),titleEl=document.getElementById('title');
var scoreEl=document.getElementById('score'),track=document.getElementById('track'),stat=document.getElementById('stat');
var segs=document.getElementById('meter').children;

function rng(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;var t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function mk(w,h){var c=document.createElement('canvas');c.width=w;c.height=h;return c}
function R(x,y,w,h,c){g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),w,h)}
function fit(){var r=stage.getBoundingClientRect();if(!r.height)return;W=Math.max(288,Math.min(620,Math.round(H*r.width/r.height)));cv.width=W*2;cv.height=H*2;g.imageSmoothingEnabled=false}
if(window.ResizeObserver)new ResizeObserver(fit).observe(stage);window.addEventListener('resize',fit);fit();

/* shared helpers */
function load(src){var i=new Image();i.src='assets/img/'+src;return i}
function ok(i){return i.complete&&i.naturalWidth}
function pad6(n){n=String(Math.round(n));while(n.length<6)n='0'+n;return n}
