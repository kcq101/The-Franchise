/* The chase (level 2-1): a behind-the-car arcade driving level. Frank has taken the wheel of Moose's car. Hold L or R to steer; the car accelerates on its own.
   Hitting traffic and street furniture slows the car and adds to a DAMAGES bill that never resets. Police raise the HEAT meter; a full meter is a bust and a restart from the last checkpoint.
   It ends at a fork: POLICE STATION to the left, HIGHWAY to the right. Frank will not let the player take the left. */
var drvCar=load('drive_car.png'),drvTraf=load('drive_traffic.png'),drvProp=load('drive_props.png'),drvSky=load('drive_sky.webp'),drvBld=load('drive_bld.png'),drvScn=load('drive_scn.png'),drvStn=load('drive_station.png'),drvBld2=load('drive_bld2.png'),drvBld3=load('drive_bld3.png'),drvMart=load('drive_mart2.png');
/* sprite rectangles in each sheet: x, y, width, height */
var DCAR=[[0,0,184,129],[186,0,206,134],[394,0,218,134],[614,0,196,134],[812,0,206,134]];   /* straight, right, hard right, hard left, left */
var DTRAF=[[0,0,158,126],[160,0,156,152],[318,0,144,128],[464,0,156,152],[622,0,177,214],[801,0,148,142]];   /* sedan, taxi, hatchback, pickup, box truck, police */
var DTRAF_W=[800,790,730,820,900,800];
var DTRAF_INFO=[['SEDAN',3800,['He had his blinker on.','That was a family, Frank.']],['TAXI',4500,["Meter's running, Frank.",'He was working.']],['HATCHBACK',3200,['That car was somebody\'s whole car.','She waved at you.']],
  ['PICKUP',5100,['Those were his boxes.','He was moving house.']],['BOX TRUCK',9000,['That truck was not hiding.','It says WIDE on the back.']],['POLICE CRUISER',18000,['That one comes with paperwork.','They have your name, Frank.']]];
/* roadside things: sheet rectangle, width in the world, cost, how much speed is kept after hitting it, and what Moose says */
var DPROP={
  cone:{r:[0,0,74,90],w:260,cost:40,keep:.97,say:['That was a cone.','Cone.','Another cone.']},
  barrel:{r:[76,0,66,107],w:330,cost:120,keep:.9,say:['Barrel.','Those are there for a reason.']},
  barricade:{r:[144,0,114,110],w:640,cost:350,keep:.78,say:['That was holding up the road, Frank.','It said ROAD CLOSED.']},
  mailbox:{r:[260,0,70,102],w:330,cost:900,keep:.85,say:['That was a mailbox.','That was a CHURCH mailbox.','Federal property, Frank.']},
  hotdog:{r:[332,0,136,150],w:760,cost:4200,keep:.68,say:["That was a man's livelihood.",'He was just selling hot dogs.']},
  fruit:{r:[470,0,124,104],w:800,cost:2600,keep:.7,say:['Oranges, Frank. Everywhere.','Why is it always the fruit stand?']},
  trash:{r:[596,0,62,95],w:300,cost:60,keep:.93,say:['Trash can.','It was trash day.']},
  news:{r:[660,0,62,98],w:300,cost:300,keep:.9,say:["You'll be in tomorrow's edition.",'Nobody reads those anyway.']},
  lamp:{r:[724,0,34,164],w:260},palm:{r:[760,0,88,170],w:900},tree:{r:[850,0,118,170],w:1300},billboard:{r:[970,0,148,146],w:1900},
  ramp:{r:[1120,0,125,94],w:1300},forksign:{r:[1247,0,314,130],w:4700},checkpoint:{r:[1563,0,149,136],w:4500,hs:.5}};
/* scenery that only stands beside the road: im says which sheet it is in (b, c, d building fronts, s roadworks and waterfront, p the police station) */
var DSCENE={
  apartment:{im:'b',r:[0,0,160,221],w:3600},diner:{im:'b',r:[162,0,217,130],w:4400},office:{im:'b',r:[381,0,131,248],w:3000},pawn:{im:'b',r:[514,0,155,185],w:3400},theater:{im:'b',r:[671,0,178,244],w:4000},garage:{im:'b',r:[851,0,174,221],w:4000},
  excavator:{im:'s',r:[0,0,195,132],w:2600},mixer:{im:'s',r:[197,0,212,111],w:2900},tower:{im:'s',r:[411,0,97,174],w:1400},pipes:{im:'s',r:[510,0,138,84],w:1800},arrow:{im:'s',r:[650,0,110,102],w:1500},fence:{im:'s',r:[762,0,166,94],w:2300},flood:{im:'s',r:[930,0,88,143],w:1200},
  shack:{im:'s',r:[1020,0,168,146],w:2600},lighthouse:{im:'s',r:[1190,0,92,146],w:1500},boat:{im:'s',r:[1284,0,202,136],w:3400},boxes:{im:'s',r:[1488,0,122,118],w:2400},dock:{im:'s',r:[1612,0,152,159],w:2800},pier:{im:'s',r:[1766,0,168,56],w:2600},seafood:{im:'s',r:[1936,0,173,132],w:3200},
  station:{im:'p',r:[0,0,743,366],w:6400},mart:{im:'m',r:[0,0,947,243],w:9000},
  barber:{im:'c',r:[0,0,148,222],w:3350},bakery:{im:'c',r:[150,0,162,202],w:3650},bar:{im:'c',r:[314,0,176,244],w:3950},laundry:{im:'c',r:[492,0,186,149],w:4200},bank:{im:'c',r:[680,0,194,230],w:4350},hardware:{im:'c',r:[876,0,169,224],w:3800},
  motel:{im:'d',r:[0,0,195,194],w:4400},arcade:{im:'d',r:[197,0,167,144],w:3750},firedept:{im:'d',r:[366,0,170,200],w:3800},tenement:{im:'d',r:[538,0,124,267],w:2800},gas:{im:'d',r:[664,0,254,138],w:5700},records:{im:'d',r:[920,0,130,176],w:2900}};
var DIMG={b:drvBld,s:drvScn,p:drvStn,c:drvBld2,d:drvBld3,m:drvMart};
Object.keys(DSCENE).forEach(function(k){DPROP[k]=DSCENE[k]});
var DMOOSE=['This is MY car.','I just had it detailed.','Ever heard of a brake?','You are not in a movie, Frank.','I have a clean record. Had.'];
var DSEG=200,DRW=2000,DCAMH=1500,DPZ=1500,DDRAW=150,DHSX=172,DVSY=108,DCY=88,DMAXV=DSEG*62;
/* downtown is a string of towns with open road between them: first and last segment of each */
var DTOWNS=[[50,330],[520,790],[980,1260]];
var DCP=[1300,2700],DBLOCK=3560,DFORK0=3880,DFORK1=4130,DEND=4190,DRAMP=2060;
var DR={on:false,ph:'',t:0,z:0,x:0,v:0,steer:0,heat:0,dmg:0,busts:0,cp:0,segs:[],cars:[],parts:[],say:null,fsay:null,jump:0,shake:0,flash:0,skyX:0,eng:null,copT:0,copN:0,mi:0,near:0,notyet:false,triedLeft:false};

function drvBuild(){var segs=[],i,r=rng(777);
  function add(n,curve,hill){var y0=segs.length?segs[segs.length-1].y2:0;for(var k=0;k<n;k++){var u=(k+1)/n,e=u*u*(3-2*u),a=Math.sin(Math.min(1,Math.min(k,n-k)/Math.max(1,n*.3))*Math.PI/2);
    segs.push({i:segs.length,y1:segs.length?segs[segs.length-1].y2:0,y2:y0+(hill||0)*e,curve:(curve||0)*a,props:[],zone:0,fork:0})}}
  /* stretch 1: downtown */
  add(110,0,0);add(120,1.6,0);add(90,0,500);add(130,-2,0);add(100,0,-500);add(110,2.4,300);add(120,0,0);add(140,-1.4,-300);add(120,1.2,0);add(140,-2.6,400);add(120,0,-400);
  /* stretch 2: roadworks */
  add(100,0,0);add(130,2.2,0);add(110,-2.2,600);add(120,0,0);add(120,0,-200);add(140,-2.8,0);add(120,2,-400);add(130,0,300);add(140,-1.8,0);add(130,2.8,0);add(160,0,0);
  /* stretch 3: the waterfront highway */
  add(140,0,0);add(160,3,0);add(140,-3,500);add(160,2,-500);add(140,-2.4,0);add(180,0,0);add(200,0,0);add(260,0,0);add(260,0,0);add(260,0,0);
  for(i=0;i<segs.length;i++){segs[i].zone=i<DCP[0]?0:i<DCP[1]?1:2;if(i>=DFORK0)segs[i].fork=Math.min(1,(i-DFORK0)/(DFORK1-DFORK0))}
  function put(i,k,x){if(segs[i])segs[i].props.push({k:k,x:x,hit:0})}
  /* scenery on both sides: buildings downtown, plant and fencing through the roadworks, the docks along the waterfront */
  /* each town has its own mix: shops, then landmarks, then a bit of everything */
  var TOWN=[['barber','bakery','bar','laundry','bank','hardware','diner','pawn','apartment'],['motel','arcade','firedept','tenement','gas','records','theater','garage','office'],Object.keys(DSCENE).filter(function(k){return 'bcd'.indexOf(DSCENE[k].im)>=0})];
  function beside(i,k,sd){put(i,k,sd*(1.42+DPROP[k].w/2/DRW+r()*.25))}
  var works=['excavator','mixer','tower','pipes','arrow','fence','flood','fence'],shore=['shack','lighthouse','boat','pier','boat'],docks=['boxes','dock','seafood','boxes','shack'],sd=1;
  for(i=20;i<segs.length;i+=10){var z=segs[i].zone;
    var inTown=z===0&&DTOWNS.some(function(tw){return i>=tw[0]&&i<=tw[1]});
    if(i%20===0&&(z!==0||inTown)){var lw=drvWide(segs[i].fork)+.55;put(i,'lamp',-lw);put(i,'lamp',lw)}
    if(z===0){if(!inTown){if(r()<.55)put(i+3,r()<.75?'tree':'billboard',(r()<.5?-1:1)*(1.9+r()*1.4));if(r()<.3)put(i+7,'tree',(r()<.5?-1:1)*(2.4+r()*2))}}
    else if(z===1){if(i%20===10){sd=-sd;beside(i+4,works[(r()*works.length)|0],sd)}else if(r()<.3)put(i+4,'tree',(r()<.5?-1:1)*(2.4+r()))}
    else if(i<DFORK0-20){if(i%20===0)put(i+5,'palm',(i%40?-1:1)*1.8);if(i%30===10)beside(i+3,shore[(r()*shore.length)|0],-1);if(i%30===20)beside(i+6,docks[(r()*docks.length)|0],1)}}
  DTOWNS.forEach(function(tw,ti){var town=TOWN[ti%TOWN.length];[-1,1].forEach(function(side){var last='',last2='',k;for(var q=tw[0]+(side>0?3:0);q<=tw[1];q+=6){do{k=town[(r()*town.length)|0]}while(k===last||k===last2);last2=last;last=k;put(q,k,side*(1.34+DPROP[k].w/2/DRW))}})});
  /* the convenience store stands on its own out on the open road between towns */
  put(425,'mart',1.5+DPROP.mart.w/2/DRW);put(885,'mart',-(1.5+DPROP.mart.w/2/DRW));
  put(DEND+34,'station',-(drvMed(1)+drvWide(1))/2);
  /* things to hit: on the shoulder downtown, in the road through the roadworks */
  var side=['mailbox','trash','news','hotdog','fruit','trash','mailbox','news'];
  for(i=150;i<DCP[0]-40;i+=26+((r()*30)|0))put(i,side[(r()*side.length)|0],(r()<.5?-1:1)*(1.12+r()*.12));
  for(i=DCP[0]+90;i<DCP[1]-60;i+=95+((r()*40)|0)){if(Math.abs(i-DRAMP)<110)continue;var lane=[-.66,0,.66][(r()*3)|0],n;
    if(r()<.35)put(i,'barricade',lane);else for(n=0;n<5;n++)put(i+n*5,r()<.3?'barrel':'cone',lane+(n-2)*.07)}
  for(i=DCP[0]+120;i<DCP[1];i+=70+((r()*50)|0))put(i,r()<.5?'barrel':'hotdog',(r()<.5?-1:1)*(1.14+r()*.1));
  /* the ramp, with cones leading up to it */
  for(i=1;i<=6;i++){put(DRAMP-i*9,'cone',-.34-i*.05);put(DRAMP-i*9,'cone',.34+i*.05)}
  put(DRAMP,'ramp',0);
  for(i=DCP[1]+200;i<DBLOCK-120;i+=120+((r()*60)|0))put(i,'barrel',(r()<.5?-1:1)*1.15);
  /* the roadblock: two cruisers and a line of cones, one lane left open */
  for(i=1;i<=7;i++)put(DBLOCK-i*10,'cone',.3-i*.02);
  put(DBLOCK,'barricade',-1.05);
  DCP.forEach(function(c){put(c,'checkpoint',0)});
  put(DFORK0+34,'forksign',0);segs[DFORK0+34].props[segs[DFORK0+34].props.length-1].w=2*DRW*drvWide(segs[DFORK0+34].fork)*1.12;
  for(i=DFORK0+60;i<DFORK1+60;i+=14)put(i,'barrel',0);

  DR.segs=segs;
  /* traffic, parked until the player gets near */
  var cars=[];
  for(i=130;i<3260;i+=27+((r()*30)|0)){var k=(r()*5.4)|0;if(k>4)k=0;if(Math.abs(i-DRAMP)<60)continue;cars.push({z:i*DSEG,x:[-.66,0,.66][(r()*3)|0],v:DMAXV*(.24+r()*.14),k:k,hit:0,vx:0,cop:false,still:false})}
  cars.push({z:DBLOCK*DSEG,x:-.62,v:0,k:5,hit:0,vx:0,cop:true,still:true},{z:DBLOCK*DSEG+60,x:.02,v:0,k:5,hit:0,vx:0,cop:true,still:true});
  for(i=0;i<4;i++)cars.push({z:(DEND+8+i*6)*DSEG,x:-1.25-(i%2)*1.1-(i>1?.15:0),v:0,k:5,hit:0,vx:0,cop:true,still:true,deco:true});
  DR.cars=cars}

function drvStop(){DR.on=false;DR.ph='';stopChaseMusic();if(DR.eng){try{DR.eng.g.gain.setTargetAtTime(0,ac.currentTime,.05);var e=DR.eng;setTimeout(function(){try{e.o.stop();e.o2.stop();e.n.stop()}catch(x){}},400)}catch(x){}DR.eng=null}}
function drvEngine(){if(DR.eng||!audio())return;try{var o=ac.createOscillator(),o2=ac.createOscillator(),f=ac.createBiquadFilter(),gn=ac.createGain(),n=ac.createBufferSource(),nf=ac.createBiquadFilter(),ng=ac.createGain();
  o.type='sawtooth';o2.type='square';f.type='lowpass';f.frequency.value=500;gn.gain.value=0;o.connect(f);o2.connect(f);f.connect(gn);gn.connect(sfxG);
  n.buffer=noiseBuf;n.loop=true;nf.type='lowpass';nf.frequency.value=600;ng.gain.value=.35;n.connect(nf);nf.connect(ng);ng.connect(gn);o.start();o2.start();n.start();DR.eng={o:o,o2:o2,f:f,g:gn,n:n}}catch(e){}}
function startDrive(){drvStop();drvBuild();S.mode='drive';DR.on=true;DR.ph='intro';DR.t=0;DR.z=0;DR.x=.0;DR.v=0;DR.steer=0;DR.heat=0;DR.dmg=0;DR.busts=0;DR.cp=0;DR.parts=[];DR.say=null;DR.fsay=null;DR.jump=0;DR.shake=0;DR.flash=0;DR.skyX=0;DR.copT=6;DR.copN=0;DR.mi=0;DR.near=0;DR.notyet=false;DR.triedLeft=false;DR.lastSeg=0;DR.forkSaid=false;DR.blockSaid=false;DR.bill=null;DR.burst=null;DR.carTop=0;
  cv.style.filter='';endBox.hidden=true;tug.hidden=true;padsOn(true);padL.classList.remove('next');padR.classList.remove('next');hint.textContent='HOLD L OR R TO STEER';hint.hidden=false;
  lvl.innerHTML='RUSHVILLE<br>LEVEL 2-1';barlab.textContent='HEAT';track.style.width='0%';drvEngine();startChaseMusic()}
function driveTap(){if(DR.ph==='go')hint.hidden=true}
function drvMoose(txt){DR.say={t:txt,t0:S.clock}}
function drvFrank(txt,d){DR.fsay={t:txt,t0:S.clock,d:d||1.6}}
function drvBill(name,cost,lines){DR.dmg+=cost;DR.bill={t:name+'  $'+cost.toLocaleString('en-US'),t0:S.clock};if(lines&&lines.length){var l=lines[Math.min(lines.length-1,(lines.n=(lines.n||0)+1)-1)];if(lines.n>lines.length&&Math.random()<.5)l=DMOOSE[DR.mi++%DMOOSE.length];drvMoose(l)}}
function drvCrash(v){if(!audio())return;try{var t=ac.currentTime;noise(t,.25,v,'lowpass',900,.7);noise(t,.12,v*.7,'highpass',2500,.7);tone(t,120,.2,'sine',v,0,sfxG,45)}catch(e){}}
function drvBits(x,y,col,n){for(var i=0;i<n;i++)DR.parts.push({x:x,y:y,vx:(Math.random()-.5)*160,vy:-60-Math.random()*120,c:col[(Math.random()*col.length)|0],l:.9+Math.random()*.5})}
function drvWide(u){return 1+1.6*u}
function drvMed(u){return u}
function drvSegAt(z){return DR.segs[Math.max(0,Math.min(DR.segs.length-1,Math.floor(z/DSEG)))]}

function driveUpdate(dt){var d=DR,i,c,sp,t=S.clock;d.t+=dt;d.shake=Math.max(0,d.shake-dt*3);d.flash=Math.max(0,d.flash-dt*2.5);
  for(i=d.parts.length-1;i>=0;i--){var p=d.parts[i];p.l-=dt;p.vy+=420*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;if(p.l<=0)d.parts.splice(i,1)}
  if(d.ph==='intro'){if(d.t>2.4){d.ph='go';drvFrank('RELAX. I DROVE IN COLLEGE.',2)}}
  if(d.ph==='bust'){d.v*=Math.exp(-4*dt);d.z+=d.v*dt;if(t-d.bt>2.8){d.ph='go';d.z=d.cp*DSEG;d.x=0;d.v=0;d.heat=.2;d.busts++;d.cars=d.cars.filter(function(c){return !c.cop||c.still});d.copT=7;d.jump=0;drvMoose(d.busts>1?'Every. Time. Frank.':'They let you go? They let you GO?')}}
  var hold=d.ph==='go'?((padR.classList.contains('down')?1:0)-(padL.classList.contains('down')?1:0)):0;
  if(hold||d.t>7||d.say)hint.hidden=true;
  var seg=drvSegAt(d.z+DPZ),u=seg.fork;
  if(d.ph==='go'){
    /* the fork: Frank will not take the left */
    if(u>0){if(!d.forkSaid){d.forkSaid=true;drvMoose('Police station. Left lane, Frank.')}
      if(hold<0)d.triedLeft=true;
      if(u>.22){if(!d.notyet&&(d.triedLeft||u>.34)){d.notyet=true;drvFrank('NOT YET.',2.4);d.shake=.5;if(audio())try{noise(ac.currentTime,.4,.1,'bandpass',2500,7)}catch(e){}}
        var tx=(drvMed(u)+drvWide(u))/2;d.x+=(tx-d.x)*Math.min(1,dt*(1.5+u*3));hold=d.notyet&&t-d.fsay.t0<.5?1:0}}
    sp=d.v/DMAXV;d.steer+=(hold-d.steer)*Math.min(1,dt*9);
    if(d.jump<=0){d.x+=d.steer*dt*1.84*Math.min(1,sp*1.6+.1);d.x-=dt*2*sp*sp*seg.curve*.2}
    var lim=drvWide(u),off=Math.abs(d.x)>lim+.02,top=off?DMAXV*.38:DMAXV;
    d.v+=(d.v<top?DMAXV/4.2:-DMAXV*1.1)*dt;if(d.v>top&&!off)d.v=top;d.v=Math.max(0,d.v);
    d.x=Math.max(-lim-.42,Math.min(lim+.42,d.x));
    if(off&&sp>.3&&Math.random()<dt*14)d.shake=Math.max(d.shake,.15);
    d.z+=d.v*dt;S.score+=d.v*dt*.004;d.skyX+=seg.curve*sp*dt*18;
    /* the jump */
    if(d.jump>0){d.jump-=dt;if(d.jump<=0){d.shake=.9;thump(.35,true);drvMoose('My suspension, Frank.')}}
    /* things on this stretch of road */
    var si=seg.i;for(i=d.lastSeg+1;i<=si;i++){var s=d.segs[i];if(!s)break;for(var j=0;j<s.props.length;j++){var pr=s.props[j],inf=DPROP[pr.k];if(pr.hit)continue;
      if(pr.k==='checkpoint'){d.cp=i;d.heat=Math.max(0,d.heat-.3);d.burst={t:'CHECKPOINT',t0:t,c:'#ffd27a'};[392,523,659].forEach(function(f,n){setTimeout(function(){blip(f,.1,.04)},n*80)});continue}
      if(pr.k==='ramp'){if(Math.abs(pr.x-d.x)<.36&&d.jump<=0){d.jump=1.05;S.score+=1000;drvFrank('STILL GOT IT.',2);d.burst={t:'+1000 AIR',t0:t,c:'#ffd27a'};if(audio())try{tone(ac.currentTime,200,.5,'square',.05,1800,sfxG,700)}catch(e){}}continue}
      if(!inf.cost||d.jump>0||s.fork>0)continue;
      if(Math.abs(pr.x-d.x)<(inf.w/2+330)/DRW){pr.hit=t;pr.dir=pr.x>=d.x?1:-1;d.v*=inf.keep;d.shake=Math.max(d.shake,(1-inf.keep)*2+.2);drvBill(pr.k==='hotdog'?'HOT DOG CART':pr.k==='fruit'?'FRUIT STAND':pr.k==='news'?'NEWS BOX':pr.k==='trash'?'TRASH CAN':pr.k.toUpperCase(),inf.cost,inf.say);drvCrash(.1+(1-inf.keep)*.5);
        drvBits(W/2+(pr.x-d.x)*200,DCY+96,pr.k==='fruit'?['#ff9a1f','#ffb347','#e8781a']:pr.k==='hotdog'?['#e03a2e','#ffd23a','#c9cdd8']:pr.k==='cone'||pr.k==='barrel'||pr.k==='barricade'?['#ff7a1f','#ffffff']:['#9aa0b0','#5f6578','#e8e3d0'],pr.k==='fruit'?26:10)}}}
    d.lastSeg=Math.max(d.lastSeg,si);
    if(si>DBLOCK-260&&!d.blockSaid){d.blockSaid=true;drvMoose('Roadblock. Stop the car, Frank.');drvFrank('I SEE A GAP.',1.8)}
    /* police: sent after Frank at set points, and whenever the heat is high */
    d.copT-=dt;var live=0;for(i=0;i<d.cars.length;i++)if(d.cars[i].cop&&!d.cars[i].still)live++;
    var marks=[420,1500,2300,2950,3300];
    if(si<DBLOCK-300&&live<2&&((d.copN<marks.length&&si>marks[d.copN])||(d.heat>.5&&d.copT<=0))){if(d.copN<marks.length&&si>marks[d.copN])d.copN++;d.copT=9;
      var sd=d.x>.2?-1:d.x<-.2?1:(Math.random()<.5?-1:1);d.cars.push({z:d.z+DPZ-720,x:d.x+sd*.6,side:sd*.6,v:d.v+2600,k:5,hit:0,vx:0,cop:true,still:false,life:0});
      if(audio())try{wail(ac.currentTime,6.5,1,.05,sfxG,0,2.5)}catch(e){}if(live===0&&d.copN===1)drvMoose('Those lights are for you.')}
    /* heat */
    if(sp<.45&&live>0)d.heat+=dt*.1;else if(sp>.8)d.heat-=dt*.03;
    d.heat=Math.max(0,Math.min(1,d.heat));
    if(d.heat>=1){d.ph='bust';d.bt=t;d.flash=1;drvFrank('EVER SINCE THAT FUMBLE...',2.6);d.burst={t:'BUSTED',t0:t,c:'#ff5a4a'};if(audio())try{siren()}catch(e){}}
    if(d.z+DPZ>=DEND*DSEG){d.ph='end';hint.hidden=true;if(d.busts)S.stat+='<br>BUSTED: '+d.busts;
      /* on down the highway to the next level; the bill goes with them */
      startStop()}}
  /* traffic and police */
  var pz=d.z+DPZ,px=d.x;
  for(i=d.cars.length-1;i>=0;i--){c=d.cars[i];var dz=c.z-pz;
    if(c.cop&&!c.still){c.life+=dt;var want=dz<350?d.v+2200:d.v-500;if(c.life>11)want=DMAXV*.25;c.v+=(want-c.v)*Math.min(1,dt*2.5);if(c.life<=11)c.x+=(Math.max(-.95,Math.min(.95,px+(dz<300?c.side:0)))-c.x)*Math.min(1,dt*1.1);if(dz<-1400&&c.life>3){d.cars.splice(i,1);continue}
      if(Math.abs(dz)<1200&&c.life<=11)d.heat+=dt*.035}
    else if(!c.still){if(dz<-1500){d.cars.splice(i,1);continue}if(dz>DSEG*420)continue;var cs=drvSegAt(c.z);if(cs.fork>0)c.x+=((drvMed(cs.fork)+drvWide(cs.fork))/2-c.x)*Math.min(1,dt*2)}
    if(c.hit){c.x+=c.vx*dt;c.vx*=Math.exp(-1.5*dt);c.v*=Math.exp(-.8*dt)}
    c.z+=c.v*dt;
    if(d.ph!=='go'||c.deco)continue;
    var hw=(DTRAF_W[c.k]+740)/2/DRW*.92;
    if(d.jump<=0&&Math.abs(dz)<260&&Math.abs(c.x-px)<hw&&(!c.hit||t-c.hit>.7)){var first=!c.hit;c.hit=t;c.vx=(c.x>=px?1:-1)*(1.1+Math.random()*.5);d.shake=.8;drvCrash(.3);
      if(dz>=0){d.v=Math.min(d.v,Math.max(c.v*.75,DMAXV*.12));c.v=Math.max(c.v,d.v)+2200}else{c.v=Math.max(0,c.v-1500);d.x+=(px>c.x?1:-1)*.12}
      d.heat+=c.cop?.2:.05;if(first){var inf2=DTRAF_INFO[c.k];drvBill(inf2[0],inf2[1],inf2[2])}drvBits(W/2+(c.x-px)*200,DCY+90,c.cop?['#ffffff','#22232f','#4aa3ff','#ff4a3a']:['#c9cdd8','#ffd27a','#e03a2e'],12)}
    if(!c.passed&&dz<-300){c.passed=true;if(!c.hit&&!c.still&&!c.cop&&Math.abs(c.x-px)<hw+.22&&sp>.7){S.score+=100;d.near=t}}}
  scoreEl.textContent=pad6(S.score);track.style.width=Math.min(100,pz/(DEND*DSEG)*100).toFixed(1)+'%';
  var on=Math.ceil(d.heat*6-.001);for(i=0;i<6;i++)segs[i].className=i<on?'on':'';
  if(d.eng)try{var sp2=d.v/DMAXV,gear=(sp2*4)%1,now=ac.currentTime,f0=58+sp2*70+gear*46+(d.jump>0?40:0);d.eng.o.frequency.setTargetAtTime(f0,now,.04);d.eng.o2.frequency.setTargetAtTime(f0*1.5,now,.04);d.eng.f.frequency.setTargetAtTime(380+sp2*900,now,.08);d.eng.g.gain.setTargetAtTime(S.mode==='drive'?.03+sp2*.022:0,now,.1)}catch(e){}}

/* one line of text with a dark outline, in the game's pixel font */
function drvText(txt,x,y,size,col,align){g.font=size+'px "Press Start 2P", monospace';g.textAlign=align||'center';g.textBaseline='middle';g.lineJoin='round';g.lineWidth=3;g.strokeStyle='#0b0c18';g.strokeText(txt,x,y);g.fillStyle=col;g.fillText(txt,x,y)}
function drawDrive(){var d=DR,t=S.clock,i,n,segs=d.segs,sh=d.shake;
  g.setTransform(2,0,0,2,sh?(Math.random()-.5)*8*sh:0,sh?(Math.random()-.5)*6*sh:0);
  var camZ=d.z,baseI=Math.floor(camZ/DSEG),pct=(camZ%DSEG)/DSEG,pseg=drvSegAt(camZ+DPZ),ppct=((camZ+DPZ)%DSEG)/DSEG,camY=DCAMH+pseg.y1+(pseg.y2-pseg.y1)*ppct,camX=d.x*DRW,zone=pseg.zone;
  /* sky and skyline */
  R(-8,-8,W+16,H+16,'#0a1030');
  if(ok(drvSky)){var sw=484,shh=105,ox=-(((d.skyX%sw)+sw)%sw);for(var bx=ox;bx<W+8;bx+=sw)g.drawImage(drvSky,0,0,1400,303,Math.round(bx),DCY-101,sw+1,shh)}
  R(-8,DCY,W+16,H,zone===2?'#0b1638':'#15172a');
  /* the road, near to far */
  var base=segs[Math.min(segs.length-1,baseI)],x=0,dx=-(base.curve*pct),maxy=H+8,list=[];
  var COL=[{g1:'#3a3b4c',g2:'#333445',r1:'#8d8fa3',r2:'#4f5166'},{g1:'#4a3f36',g2:'#42382f',r1:'#e0702a',r2:'#e8e3d0'},{g1:'#10204a',g2:'#0d1b40',r1:'#c9cbd8',r2:'#6a6d82'}];
  function quad(x1,y1,w1,x2,y2,w2,c){g.fillStyle=c;g.beginPath();g.moveTo(x1-w1,y1);g.lineTo(x2-w2,y2);g.lineTo(x2+w2,y2);g.lineTo(x1+w1,y1);g.closePath();g.fill()}
  for(n=0;n<DDRAW;n++){var s=segs[baseI+n];if(!s)break;var z1=Math.max(60,(baseI+n)*DSEG-camZ),z2=(baseI+n+1)*DSEG-camZ;if(z2<=z1+1){s.px=x;s.pdx=dx;s.clip=maxy;x+=dx;dx+=s.curve;continue}
    var s1=1/z1,s2=1/z2,X1=W/2+s1*(-camX-x)*DHSX,X2=W/2+s2*(-camX-x-dx)*DHSX,Y1=DCY-s1*(s.y1-camY)*DVSY,Y2=DCY-s2*(s.y2-camY)*DVSY,wm=drvWide(s.fork),w1=s1*DRW*DHSX,w2=s2*DRW*DHSX;
    s.px=x;s.pdx=dx;s.clip=maxy;x+=dx;dx+=s.curve;
    if(Y2>=maxy||Y2>=Y1)continue;
    var c=COL[s.zone],alt=((s.i/3)|0)%2,yb=Math.min(Y1,maxy)+.7;
    g.fillStyle=alt?c.g1:c.g2;g.fillRect(-8,Y2,W+16,yb-Y2);
    quad(X1,yb,w1*wm*1.09,X2,Y2,w2*wm*1.09,alt?c.r1:c.r2);
    quad(X1,yb,w1*wm,X2,Y2,w2*wm,alt?'#2c2e3b':'#282a36');
    if(s.fork>0){var m1=drvMed(s.fork);quad(X1,yb,w1*(m1+.06),X2,Y2,w2*(m1+.06),alt?'#e8e3d0':'#e0702a');quad(X1,yb,w1*m1,X2,Y2,w2*m1,alt?'#1d2a1f':'#182319');
      var b1=(m1+wm)/2;if(alt){quad(X1-w1*b1,yb,w1*.022,X2-w2*b1,Y2,w2*.022,'#d8c56a');quad(X1+w1*b1,yb,w1*.022,X2+w2*b1,Y2,w2*.022,'#d8c56a')}}
    else if(alt){quad(X1-w1/3,yb,w1*.022,X2-w2/3,Y2,w2*.022,'#d8c56a');quad(X1+w1/3,yb,w1*.022,X2+w2/3,Y2,w2*.022,'#d8c56a')}
    quad(X1-w1*wm*.95,yb,w1*.018,X2-w2*wm*.95,Y2,w2*.018,'#c9cbd8');quad(X1+w1*wm*.95,yb,w1*.018,X2+w2*wm*.95,Y2,w2*.018,'#c9cbd8');
    var fog=n/DDRAW;if(fog>.35){g.fillStyle='rgba(10,16,48,'+(Math.min(.9,(fog-.35)*1.5)).toFixed(2)+')';g.fillRect(-8,Y2,W+16,yb-Y2)}
    maxy=Y2;
    for(i=0;i<s.props.length;i++)list.push({z:z1,s:s,p:s.props[i]})}
  /* everything standing on the road, far to near, with Frank's car slotted in at its own distance */
  for(i=0;i<d.cars.length;i++){var cz=d.cars[i].z-camZ;if(cz>620&&cz<DDRAW*DSEG)list.push({z:cz,c:d.cars[i]})}
  list.push({z:DPZ,me:true});list.sort(function(a,b){return b.z-a.z});
  function place(z,wx,segm,pc){var sc=1/z,xo=segm.px+segm.pdx*pc,wy=segm.y1+(segm.y2-segm.y1)*pc;return{s:sc,x:W/2+sc*(wx*DRW-camX-xo)*DHSX,y:DCY-sc*(wy-camY)*DVSY}}
  function sprite(img,r,ww,P,clip,rot,hs){var w=P.s*ww*DHSX,h=w*r[3]/r[2]*(hs||1);if(w<1.5||P.x+w<-20||P.x-w>W+20)return;
    g.save();if(clip<P.y){g.beginPath();g.rect(-8,-8,W+16,clip+8);g.clip()}
    if(rot){g.translate(P.x,P.y-h/2);g.rotate(rot);g.drawImage(img,r[0],r[1],r[2],r[3],-w/2,-h/2,w,h)}else g.drawImage(img,r[0],r[1],r[2],r[3],P.x-w/2,P.y-h,w,h);
    g.restore();return h}
  for(i=0;i<list.length;i++){var o=list[i];
    if(o.p){var inf=DPROP[o.p.k],pim=DIMG[inf.im]||drvProp;if(!ok(pim))continue;var P=place(o.z,o.p.x,o.s,0),fog2=Math.min(1,o.z/(DDRAW*DSEG));
      if(o.p.k==='forksign'||o.p.k==='checkpoint'){P=place(o.z,0,o.s,0)}
      if(o.p.hit){var k=t-o.p.hit;if(k>1.1)continue;P.x+=o.p.dir*k*260*P.s*900;P.y-=(k*300-k*k*420)*P.s*1500;g.globalAlpha=Math.max(0,1-k/1.1);sprite(drvProp,inf.r,inf.w,P,H+9,k*9*o.p.dir);g.globalAlpha=1;continue}
      g.globalAlpha=fog2>.55?Math.max(.15,1-(fog2-.55)*2):1;sprite(pim,inf.r,o.p.w||inf.w,P,o.s.clip,0,inf.hs);g.globalAlpha=1}
    else if(o.c){if(!ok(drvTraf))continue;var cc=o.c,cs2=drvSegAt(cc.z);if(cs2.px===undefined)continue;var Pc=place(o.z,cc.x,cs2,(cc.z%DSEG)/DSEG),fg=Math.min(1,o.z/(DDRAW*DSEG));
      g.globalAlpha=fg>.55?Math.max(.15,1-(fg-.55)*2):1;
      var spin=cc.hit&&t-cc.hit<1.2?(t-cc.hit)*5*(cc.vx>0?1:-1):0,hh=sprite(drvTraf,DTRAF[cc.k],DTRAF_W[cc.k],Pc,o.z<DPZ?H+9:cs2.clip,spin);
      if(cc.cop&&hh&&!spin){var fl=((t*6)|0)%2,ww2=Pc.s*DTRAF_W[5]*DHSX;g.globalCompositeOperation='lighter';g.fillStyle=fl?'rgba(255,60,50,.55)':'rgba(70,140,255,.55)';g.beginPath();g.arc(Pc.x+(fl?-1:1)*ww2*.18,Pc.y-hh*.93,ww2*.22,0,TAU);g.fill();g.globalCompositeOperation='source-over'}
      g.globalAlpha=1}
    else if(o.me){var cw=760/DPZ*DHSX,jy=d.jump>0?Math.sin((1-d.jump/1.05)*Math.PI)*46:0,by=DCY+DVSY-jy+(d.v>200?Math.round(Math.sin(t*38)*.6):0),st=d.steer,fr=st<-.6?3:st<-.2?4:st>.6?2:st>.2?1:0,rc=DCAR[fr],w=cw*rc[2]/184,h=w*rc[3]/rc[2];
      g.fillStyle='rgba(0,0,0,.45)';g.beginPath();g.ellipse(W/2,DCY+DVSY-1,cw*.5*(1-jy/140),5*(1-jy/140),0,0,TAU);g.fill();
      if(ok(drvCar)){g.save();g.translate(W/2,by);g.rotate(st*.04+(d.jump>0?-.04:0));g.drawImage(drvCar,rc[0],rc[1],rc[2],rc[3],-w/2,-h,w,h);g.restore()}else R(W/2-40,by-40,80,40,'#c2281f');
      if(Math.abs(d.x)>drvWide(pseg.fork)&&d.v>2000&&d.jump<=0)for(n=0;n<4;n++){g.fillStyle='rgba(200,200,215,'+(.25+Math.random()*.2).toFixed(2)+')';g.beginPath();g.arc(W/2+(n%2?1:-1)*cw*.4+(Math.random()-.5)*8,by-2-Math.random()*8,3+Math.random()*5,0,TAU);g.fill()}
      d.carTop=by-h}}
  g.setTransform(2,0,0,2,0,0);
  for(i=0;i<d.parts.length;i++){var pa=d.parts[i];g.globalAlpha=Math.min(1,pa.l*2);R(pa.x,pa.y,3,3,pa.c)}g.globalAlpha=1;
  /* police lights washing over the screen when they are close */
  var near=0;for(i=0;i<d.cars.length;i++){var q=d.cars[i];if(q.cop&&!q.deco&&Math.abs(q.z-camZ-DPZ)<2600)near=1}
  if(near||d.ph==='bust'){var f2=((t*5)|0)%2,gl=g.createLinearGradient(0,0,W,0),a1=d.ph==='bust'?.4:.16;gl.addColorStop(0,f2?'rgba(255,50,40,'+a1+')':'rgba(60,120,255,'+a1+')');gl.addColorStop(.35,'rgba(0,0,0,0)');gl.addColorStop(.65,'rgba(0,0,0,0)');gl.addColorStop(1,f2?'rgba(60,120,255,'+a1+')':'rgba(255,50,40,'+a1+')');g.fillStyle=gl;g.fillRect(0,0,W,H)}
  if(d.flash>0)R(0,0,W,H,'rgba(255,255,255,'+(d.flash*.5).toFixed(2)+')');
  /* the running bill, the speed, and whatever was just hit */
  var wide=W>=420,hy=wide?9:60;
  drvText('DAMAGES $'+d.dmg.toLocaleString('en-US'),W/2,hy,8,'#ff6a5e');
  drvText(Math.round(d.v/DMAXV*168)+' MPH',W/2,hy+12,6,'#c9cbd8');
  if(d.bill&&t-d.bill.t0<1.6){var kb=t-d.bill.t0;g.globalAlpha=Math.min(1,(1.6-kb)*3);drvText('+ '+d.bill.t,W/2,hy+26-Math.min(6,kb*30),6,'#ffd27a');g.globalAlpha=1}
  if(d.near&&t-d.near<.8)drvText('NEAR MISS +100',W/2,DCY+30,6,'#9be37a');
  if(d.burst&&t-d.burst.t0<1.6)burst(d.burst.t,W/2,DCY-6,d.burst.t==='BUSTED'?20:12,d.burst.c,d.burst.t0);
  if(d.fsay&&t-d.fsay.t0<d.fsay.d&&d.carTop)bubble(W/2,Math.max(40,d.carTop-24),d.fsay.t,d.ph==='bust');
  /* Moose, from the passenger seat */
  if(d.say&&t-d.say.t0<3.2){var words=d.say.t.split(' '),lines=[''],mxc=W<400?18:24;words.forEach(function(wd){var L=lines.length-1;if((lines[L]+' '+wd).trim().length>mxc)lines.push(wd);else lines[L]=(lines[L]+' '+wd).trim()});
    var bwid=Math.max.apply(null,lines.map(function(l){return l.length}))*7+36,bh=Math.max(22,lines.length*10+8),bxx=Math.round(W/2-bwid/2),byy=H-bh-4;
    R(bxx-1,byy-1,bwid+2,bh+2,'#0b0c18');R(bxx,byy,bwid,bh,'rgba(20,22,40,.92)');R(bxx,byy,bwid,1,'#ffd27a');
    if(typeof carImg!=='undefined'&&ok(carImg))g.drawImage(carImg,208,3*CARH+10,36,36,bxx+2,byy+2,18,18);
    drvText('MOOSE',bxx+11,byy+bh-1,4,'#ffd27a');
    lines.forEach(function(l,n){drvText(l,bxx+28,byy+9+n*10,7,'#f6f3e8','left')})}
  if(d.ph==='intro'){var a=d.t<2?1:Math.max(0,1-(d.t-2)/.4);g.globalAlpha=a;R(0,0,W,H,'rgba(5,6,16,.72)');drvText('LEVEL 2-1',W/2,H/2-22,8,'#ffd27a');drvText('THE CHASE',W/2,H/2-2,16,'#f6f3e8');drvText('INSTINCT: RUN',W/2,H/2+20,6,'#ff6a5e');g.globalAlpha=1}
}
