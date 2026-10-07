const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});let errs=0;
const p=await b.newPage({viewport:{width:844,height:390}});p.on('pageerror',e=>{errs++;console.log('ERR',e.message)});
await p.goto('file:///home/claude/the-franchise/index.html');await p.waitForTimeout(1300);
await p.selectOption('#lvlsel','escape');await p.click('#title',{position:{x:300,y:150}});await p.waitForTimeout(400);await p.click('#title',{position:{x:300,y:150}});await p.waitForTimeout(900);
const st=()=>p.evaluate(()=>S.mode+'/'+HL.ph+' x='+Math.round(HL.x)+' dodged='+HL.dodged+' hits='+HL.hits+' obs='+HL.obs.length);
console.log(await st());await p.screenshot({path:'m_start.png'});
let shots={jump:false,slide:false};
const bot=async(until,miss)=>{for(;;){const r=await p.evaluate((miss)=>{if(HL.ph!=='run')return 'stop';const o=HL.obs.find(o=>!o.done);let act='';
  if(o&&!miss){const d=o.x-HL.x;if(!o.high&&d<o.w/2+52&&HL.jy<=0){hallTap('R');act='jump'}else if(o.high&&d<o.w/2+30&&HL.slide<=0){hallTap('L');act='slide'}}
  if(HL.x>HALL_LEN-180)hallTap('R');return act+'|'+HL.x},miss);
  if(r==='stop')break;const [act,x]=r.split('|');
  if(act==='jump'&&!shots.jump){await p.waitForTimeout(260);await p.screenshot({path:'m_jump.png'});shots.jump=true}
  if(act==='slide'&&!shots.slide){await p.waitForTimeout(200);await p.screenshot({path:'m_slide.png'});shots.slide=true}
  if(+x>until)break;await p.waitForTimeout(25)}};
await bot(1500,false);console.log(await st());
await bot(2050,true);await p.screenshot({path:'m_hit.png'});console.log(await st());
await bot(2760,false);await p.screenshot({path:'m_window.png'});console.log(await st());
await bot(99999,false);await p.waitForTimeout(250);await p.screenshot({path:'m_leap.png'});
await p.waitForTimeout(450);await p.screenshot({path:'m_smash.png'});console.log(await st());
await p.waitForTimeout(1300);await p.screenshot({path:'m_out.png'});
await p.waitForTimeout(2600);await p.screenshot({path:'m_end.png'});console.log(await st(),await p.evaluate(()=>stat.innerHTML),'errors',errs);
await b.close()})();
