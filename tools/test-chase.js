const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});let errs=0;
const vp=process.argv[2]==='p'?{width:390,height:700}:{width:844,height:390};
const p=await b.newPage({viewport:vp});p.on('pageerror',e=>{errs++;console.log('ERR',e.message)});p.on('console',m=>{if(m.type()==='error')console.log('console',m.text().slice(0,200))});
await p.goto('file:///home/claude/the-franchise/index.html');await p.waitForTimeout(1300);
await p.selectOption('#lvlsel','chase');await p.click('#title',{position:{x:150,y:80}});await p.waitForTimeout(400);await p.click('#title',{position:{x:150,y:80}});
const shots=[];const shot=async n=>{await p.locator('#c').screenshot({path:'d_'+n+'.png'});shots.push(n)};
await p.waitForTimeout(1200);await shot('intro');
// simple bot: steer toward the freest lane
const bot=`(function(){var best=0,bs=-1e9;[-.66,0,.66].forEach(function(l){var s=-Math.abs(l-DR.x)*.3;DR.cars.forEach(function(c){var dz=c.z-DR.z-DPZ;if(dz>-200&&dz<5000&&Math.abs(c.x-l)<.5)s-=3-dz/2500});
 var si=Math.floor((DR.z+DPZ)/DSEG);for(var i=si;i<si+26;i++){var sg=DR.segs[i];if(sg)sg.props.forEach(function(pp){if(!pp.hit&&DPROP[pp.k].cost&&Math.abs(pp.x-l)<.45)s-=2})}
 if(s>bs){bs=s;best=l}});var d=best-DR.x;padL.classList.toggle('down',d<-.06);padR.classList.toggle('down',d>.06)})()`;
const marks={3:'a',9:'b',16:'c',24:'d',33:'ramp',40:'e',52:'f',60:'g'};let tsec=0,last='';
for(let i=0;i<1400;i++){await p.evaluate(bot);await p.waitForTimeout(100);tsec+=.1;const st=await p.evaluate(()=>({m:S.mode,ph:DR.ph,si:Math.floor((DR.z+DPZ)/DSEG),h:+DR.heat.toFixed(2),dmg:DR.dmg,b:DR.busts,j:DR.jump>0,fs:DR.fsay&&DR.fsay.t,v:Math.round(DR.v/DMAXV*100)}));
 const k=Math.round(tsec);if(marks[k]){await shot(marks[k]);delete marks[k];console.log(k,JSON.stringify(st))}
 if(st.j&&!shots.includes('jump')){await p.waitForTimeout(350);await shot('jump')}
 if(st.si>3560-40&&!shots.includes('block'))await shot('block');
 if(st.si>3900&&!shots.includes('fork1'))await shot('fork1');if(st.si>4010&&!shots.includes('fork2'))await shot('fork2');if(st.si>4120&&!shots.includes('fork3'))await shot('fork3');
 if(st.ph==='bust'&&!shots.includes('bust')){await p.waitForTimeout(500);await shot('bust')}
 if(st.m==='over'){console.log('END',tsec.toFixed(1),JSON.stringify(st));break}}
await p.waitForTimeout(400);await p.screenshot({path:'d_end.png'});console.log('errors',errs,shots.join(','));
require('fs').writeFileSync('d_shots.txt',shots.join(','));await b.close()})();
