/* Smoke test: starts every level from the level menu, lets it run a few seconds while pressing both controls, and reports any script error.
   Run from the repo root: node tools/smoke.js   (needs Playwright; set CHROMIUM to a browser path if it is not found) */
const {chromium}=require('playwright'),path=require('path');
const LEVELS=['alley','scuffle','stumble','fumble','wake','escape','getaway','chase','stop','kumite'];
(async()=>{const b=await chromium.launch(process.env.CHROMIUM?{executablePath:process.env.CHROMIUM}:{});let bad=0;const out=[];
for(const lv of LEVELS){const errs=[];const p=await b.newPage({viewport:{width:844,height:390},hasTouch:true});p.on('pageerror',e=>errs.push(e.message));
  await p.goto('file://'+path.resolve(__dirname,'..','index.html'));await p.waitForTimeout(700);
  await p.selectOption('#lvlsel',lv);
  for(let i=0;i<3;i++){if(await p.evaluate(()=>S.mode!=='title'))break;await p.evaluate(()=>document.getElementById('title').click());await p.waitForTimeout(300)}
  const m0=await p.evaluate(()=>S.mode);
  for(let i=0;i<14;i++){await p.keyboard.press(i%2?'ArrowLeft':'ArrowRight');await p.mouse.click(300+i*10,200);await p.waitForTimeout(250)}
  const m1=await p.evaluate(()=>S.mode),moved=await p.evaluate(()=>S.clock>1);
  const ok=!errs.length&&m0!=='title'&&moved;if(!ok)bad++;out.push(lv+':'+(ok?'ok':'FAIL '+m0+'>'+m1+' '+errs.join(' | ')));await p.close()}
console.log('smoke '+(bad?'FAILED':'passed')+' '+out.join('  '));await b.close();process.exit(bad?1:0)})();
