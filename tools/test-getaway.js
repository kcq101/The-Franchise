const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});let errs=0;
const p=await b.newPage({viewport:{width:844,height:390}});p.on('pageerror',e=>{errs++;console.log('ERR',e.message)});
await p.goto('file:///home/claude/the-franchise/index.html');await p.waitForTimeout(1300);
await p.selectOption('#lvlsel','getaway');await p.click('#title',{position:{x:300,y:150}});await p.waitForTimeout(400);await p.click('#title',{position:{x:300,y:150}});
const ph=()=>p.evaluate(()=>S.mode+'/'+HL.ph);
const waitFor=async n=>{for(let i=0;i<600&&!(await ph()).endsWith('/'+n);i++)await p.waitForTimeout(20)};
const names=[];const shot=async(n,ms)=>{await p.waitForTimeout(ms);await p.locator('#c').screenshot({path:'g_'+n+'.png'});names.push(n)};
await waitFor('board');await shot('run1',350);await shot('run2',450);
await waitFor('talk');await shot('talk1',600);await shot('talk2',1100);await shot('talk3',1000);await shot('talk4',1300);
await waitFor('enter');await shot('enter',300);
await waitFor('shut');await shot('shut',450);
await waitFor('away');await shot('away',420);
await p.waitForTimeout(300);console.log(await ph(),'errors',errs);
const {execSync}=require('child_process');execSync(`python3 -c "
from PIL import Image
n='${names.join(',')}'.split(',')
ims=[Image.open('g_'+x+'.png') for x in n]; w,h=ims[0].size
s=Image.new('RGB',(w*2,h*4)); [s.paste(im,((i%2)*w,(i//2)*h)) for i,im in enumerate(ims)]; s.save('g_sheet0.png')"`);
await b.close()})();
