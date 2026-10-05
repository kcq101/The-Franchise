/* Game state: S (overall), C (alley confrontation), D (dream football level). */
var S={mode:'title',x:START,v:0,last:null,t:0,clock:0,miss:0,bang:0,score:0,cam:0,ready:false};
var C={ph:'',t0:0,p:0,gp:0,k:0,hp:6,mxo:0,wxo:0,jabs:0,flash:0,shake:0,rot:0,voice:0,ping:false,thud:false};
var tug=document.getElementById('tug'),tugFill=document.getElementById('tugfill'),barlab=document.getElementById('barlab'),endText=document.getElementById('endtext');
var D={ph:'',t0:0,white:0,wait:0,p:1,fx:-70,lx:14,bx:0,by:0,bvx:0,bvy:0,brot:0,lane:0,dx:999,dgo:false,tips:0,frot:0,alive:0,td:false,say:'',sayT:0},lvl=document.getElementById('lvl');
function dphase(n){D.ph=n;D.t0=S.clock}
var RUNHINT='THAT THIEF HAS YOUR RING!\nTAP L, R, L, R TO RUN';
function phase(n){C.ph=n;C.t0=S.clock}
function cutting(){return S.mode==='cut'}
