const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--autoplay-policy=no-user-gesture-required']});let errs=0;
for(const [vp,tag] of [[{width:844,height:390},'w'],[{width:390,height:700},'p']]){const names=[];
const p=await b.newPage({viewport:vp});p.on('pageerror',e=>{errs++;console.log('ERR',e.message)});
await p.goto('file:///home/claude/the-franchise/index.html');await p.waitForTimeout(1300);
await p.selectOption('#lvlsel','kumite');await p.click('#title',{position:{x:150,y:80}});await p.waitForTimeout(400);if(await p.evaluate(()=>S.mode==='title'))await p.click('#title',{position:{x:150,y:80}});
const shot=async n=>{await p.locator('#c').screenshot({path:'f_'+tag+n+'.png'});names.push(tag+n)};
const seen={};let last='',t0=Date.now();
for(let i=0;i<1500;i++){await p.waitForTimeout(70);const st=await p.evaluate(()=>({m:S.mode,ph:FT.ph,tt:FT.clk-FT.t0,f:FT.F.hp,mh:FT.M.hp,ms:FT.M.st,fs:FT.F.st,mash:FT.mash,ko:!!FT.ko}));
  if(st.ph!==last){console.log(tag,((Date.now()-t0)/1000).toFixed(1),st.ph,'F',Math.round(st.f),'M',Math.round(st.mh));last=st.ph}
  const want={talk:5,vs:1.2,r1:[.5,1.4,5,9],flash:[.8,4,7.2],oil:[1,5.6],r2:[1.3,5],fin:[.8,1.2,2.7,4.5],after:[2,4,9]}[st.ph]||[];
  for(const w of [].concat(want)){const key=st.ph+w;if(!seen[key]&&st.tt>=w){seen[key]=1;await shot(key.replace('.','_'))}}
  if(st.ko&&!seen.ko){seen.ko=1;await p.waitForTimeout(250);await shot('ko');await p.waitForTimeout(600);await shot('ko2')}
  if(st.ph==='r1'){if(st.ms==='wind')await p.keyboard.press('ArrowRight');else if(st.fs==='idle')await p.keyboard.press('ArrowLeft')}
  if(st.ph==='r2'){if(st.ms==='wind')await p.keyboard.press('ArrowLeft');else if(st.fs==='idle')await p.keyboard.press('ArrowRight')}
  if(st.ph==='flash'&&st.tt>1.5)await p.keyboard.press(i%2?'ArrowLeft':'ArrowRight');
  if(st.m==='over'){console.log(tag,'END',((Date.now()-t0)/1000).toFixed(1),await p.evaluate(()=>stat.innerHTML+' mus='+!fightMus.paused));await p.waitForTimeout(300);await p.screenshot({path:'f_'+tag+'end.png'});break}}
require('child_process').execSync(`python3 -c "
from PIL import Image
n='${names.join(',')}'.split(',')
ims=[Image.open('f_'+x+'.png') for x in n]; w,h=ims[0].size
for k in range(0,len(n),12):
    part=ims[k:k+12]; s=Image.new('RGB',(w*2,h*((len(part)+1)//2))); [s.paste(im,((i%2)*w,(i//2)*h)) for i,im in enumerate(part)]; s.save('f_sheet_${tag}%d.png'%(k//12))"`);console.log(names.length);
await p.close()}
console.log('errors',errs);await b.close()})();
