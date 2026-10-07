const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});let errs=0;
const p=await b.newPage({viewport:{width:844,height:390}});p.on('pageerror',e=>{errs++;console.log('ERR',e.message)});
await p.goto('file:///home/claude/the-franchise/index.html');await p.waitForTimeout(1300);
await p.selectOption('#lvlsel','getaway');for(let k=0;k<3;k++){if(await p.evaluate(()=>S.mode!=='title'))break;await p.evaluate(()=>document.getElementById('title').click());await p.waitForTimeout(400)}
for(let i=0;i<500;i++){await p.waitForTimeout(100);if(await p.evaluate(()=>S.mode==='drive'))break}
await p.waitForTimeout(3500);console.log(await p.evaluate(()=>S.mode+' '+DR.ph+' v='+Math.round(DR.v)+' end='+endBox.hidden+' lvl='+lvl.textContent));await p.locator('#c').screenshot({path:'d_chain.png'});
// alley still fine
await p.evaluate(()=>toTitle());await p.selectOption('#lvlsel','alley');for(let k=0;k<3;k++){if(await p.evaluate(()=>S.mode!=='title'))break;await p.evaluate(()=>document.getElementById('title').click());await p.waitForTimeout(400)}await p.waitForTimeout(600);
for(let i=0;i<10;i++){await p.keyboard.press(i%2?'ArrowLeft':'ArrowRight');await p.waitForTimeout(70)}
console.log(await p.evaluate(()=>S.mode+' x='+Math.round(S.x)+' on='+DR.on),'errors',errs);await b.close()})();
