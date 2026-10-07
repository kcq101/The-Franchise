const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--autoplay-policy=no-user-gesture-required']});let errs=0;const names=[];
const p=await b.newPage({viewport:{width:844,height:390}});p.on('pageerror',e=>{errs++;console.log('ERR',e.message)});
await p.goto('file:///home/claude/the-franchise/index.html');await p.waitForTimeout(1300);
await p.selectOption('#lvlsel','stop');await p.click('#title',{position:{x:150,y:80}});await p.waitForTimeout(400);if(await p.evaluate(()=>S.mode==='title'))await p.click('#title',{position:{x:150,y:80}});
const at=async(ph,tt,n)=>{await p.evaluate(([ph,tt])=>{ST.ph=ph;ST.t0=S.clock-tt},[ph,tt]);await p.waitForTimeout(60);await p.locator('#c').screenshot({path:'o_'+n+'.png'});names.push(n)};
await p.waitForTimeout(500);console.log(await p.evaluate(()=>'stop:'+!stopMus.paused+' game:'+!gameMus.paused));
await at('arrive',6.6,'a1');await at('arrive',9,'a2');await at('arrive',20,'a3');await at('arrive',22.3,'a4');await at('arrive',29.5,'a5');await at('arrive',33.5,'a6');
await p.evaluate(()=>{padsOn(false)});await at('out',2.45,'l1');await p.waitForTimeout(260);await p.locator('#c').screenshot({path:'o_l2.png'});names.push('l2');await p.waitForTimeout(120);await p.locator('#c').screenshot({path:'o_l3.png'});names.push('l3');await p.waitForTimeout(900);await p.locator('#c').screenshot({path:'o_l4.png'});names.push('l4');
await p.evaluate(()=>reset());await p.waitForTimeout(200);console.log(await p.evaluate(()=>'after reset stop:'+!stopMus.paused+' game:'+!gameMus.paused));
require('child_process').execSync(`python3 -c "
from PIL import Image
n='${names.join(',')}'.split(',')
ims=[Image.open('o_'+x+'.png') for x in n]; w,h=ims[0].size
s=Image.new('RGB',(w*2,h*((len(n)+1)//2))); [s.paste(im,((i%2)*w,(i//2)*h)) for i,im in enumerate(ims)]; s.save('o_sheet.png')"`);
console.log('errors',errs);await b.close()})();
