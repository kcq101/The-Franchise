const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});let errs=0;
for(const [vp,mode,tag] of [[{width:844,height:390},'win','w'],[{width:844,height:390},'lose','l'],[{width:390,height:700},'win','p']]){const names=[];
const p=await b.newPage({viewport:vp,hasTouch:true});p.on('pageerror',e=>{errs++;console.log('ERR',e.message)});
await p.goto('file:///home/claude/the-franchise/index.html');await p.waitForTimeout(1300);
await p.selectOption('#lvlsel','stop');await p.click('#title',{position:{x:150,y:80}});await p.waitForTimeout(400);if(await p.evaluate(()=>S.mode==='title'))await p.click('#title',{position:{x:150,y:80}});await p.waitForTimeout(500);
await p.evaluate(()=>{ST.t0=S.clock-STOP_IN-.1});await p.waitForTimeout(600);
const shot=async n=>{await p.locator('#c').screenshot({path:'h_'+tag+n+'.png'});names.push(tag+n)};
const tapBin=async i=>{const r=await p.evaluate(i=>{const G=rushGeom(),b=cv.getBoundingClientRect();return {x:b.left+(4+(i+.5)*G.bw)/W*b.width,y:b.top+(G.y0+18)/H*b.height}},i);await p.mouse.click(r.x,r.y)};
const seen={};let last='';
for(let i=0;i<4000;i++){await p.waitForTimeout(60);const st=await p.evaluate(()=>({ph:ST.ph,m:S.mode,st:RU.st,n:RU.n,pos:RU.pos,seq:RU.seq,strikes:RU.strikes,call:RU.call,kid:!!RU.kidOn,tt:S.clock-RU.t0}));
  if(st.ph!=='in'){console.log(tag,'left inside: won='+await p.evaluate(()=>ST.won),'made',await p.evaluate(()=>RU.made),'strikes',st.strikes);break}
  if(st.st==='deal'||st.st==='pep'){const li=await p.evaluate(()=>RU.line?RU.line.i:-1);const k=st.st+li;if(!seen[k]&&await p.evaluate(()=>RU.line&&S.clock-RU.line.t0>.6)){seen[k]=1;if(st.st==='pep'||[0,1,5,8].includes(li))await shot(k);await p.mouse.click(200,120)}}
  if(st.st==='cut'&&!seen.cut&&st.tt>.9){seen.cut=1;await shot('cut')}
  if(st.st==='ready'&&st.tt>.6){if(!seen.rdy){seen.rdy=1;await shot('ready');await p.mouse.click(20,200);await p.waitForTimeout(200);console.log(tag,'still ready after stray tap:',await p.evaluate(()=>RU.st))}const r=await p.evaluate(()=>{const G=rushGeom(),b=cv.getBoundingClientRect();return {x:b.left+(G.rx+G.rw/2)/W*b.width,y:b.top+(G.ry+G.rh/2)/H*b.height}});await p.mouse.click(r.x,r.y)}
  const key=st.st+(st.st==='call'||st.st==='play'?st.n:'');
  if(st.st==='call'&&st.call>=1&&!seen['c'+st.n]&&(st.n===0||st.n===8)){seen['c'+st.n]=1;await shot('call'+st.n)}
  if(st.kid&&!seen.kid){seen.kid=1;await shot('kid')}
  if(st.st==='play'&&st.tt>.3){const wrong=mode==='lose'&&st.n>=1&&st.pos===1;const want=st.seq[st.pos];
    if(st.pos===Math.min(2,st.seq.length-1)&&!seen['p'+st.n]&&(st.n===0||st.n===6)){seen['p'+st.n]=1;await shot('play'+st.n)}
    if(mode==='win'&&st.n===3&&st.pos===0&&!seen.ask){seen.ask=1;const r=await p.evaluate(()=>{const G=rushGeom(),b=cv.getBoundingClientRect();return {x:b.left+(G.mx+G.mw/2)/W*b.width,y:b.top+(G.my+G.mh/2)/H*b.height}});await p.mouse.click(r.x,r.y);await p.waitForTimeout(150);console.log(tag,'asked moose: life',await p.evaluate(()=>RU.life+' st '+RU.st));continue}
    await tapBin(wrong?(want+1)%5:want);await p.waitForTimeout(120)}
  if(st.st==='wrap'&&!seen['w'+st.n]&&st.n===0){if(st.tt>.7){seen['w'+st.n]=1;await shot('wrap')}}
  if(st.st==='ruin'&&!seen.ruin&&st.tt>.4){seen.ruin=1;await shot('ruin')}
  if((st.st==='done'||st.st==='fired')&&!seen.fin&&st.tt>3){seen.fin=1;await shot('fin')}}
await p.waitForTimeout(1700);await shot('out1');await p.waitForTimeout(1500);await shot('out2');
for(let i=0;i<200;i++){await p.waitForTimeout(100);if(await p.evaluate(()=>S.mode==='fight'))break}
console.log(tag,await p.evaluate(()=>S.mode+' pads='+padsEl.style.visibility+' stat='+S.stat));
require('child_process').execSync(`python3 -c "
from PIL import Image
n='${names.join(',')}'.split(',')
ims=[Image.open('h_'+x+'.png') for x in n]; w,h=ims[0].size
s=Image.new('RGB',(w*2,h*((len(n)+1)//2))); [s.paste(im,((i%2)*w,(i//2)*h)) for i,im in enumerate(ims)]; s.save('h_sheet_${tag}.png')"`);
await p.close()}
console.log('errors',errs);await b.close()})();
