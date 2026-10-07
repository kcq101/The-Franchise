from PIL import Image, ImageDraw
import numpy as np
from scipy import ndimage as ndi
src=Image.open('/root/.claude/uploads/9e25c0a3-3155-5f7d-a37e-57b12351260f/9e90e709-image.png').convert('RGB')
a=np.array(src).astype(int)
fg=a.max(2)>=14
lab,n=ndi.label(fg); sizes=ndi.sum(fg,lab,range(1,n+1)); fg=np.isin(lab,[i+1 for i,s in enumerate(sizes) if s>1500])
P=50
fg=ndi.binary_closing(np.pad(fg,P),iterations=16)[P:-P,P:-P]
fg=ndi.binary_fill_holes(fg)
fg=ndi.binary_dilation(fg,iterations=4)
alpha=np.where(fg,255,0).astype(np.uint8)
for cx,cy in ((400,560),(1455,560)):
    sub=a[cy-40:cy+40,cx-40:cx+40]
    m=(sub[...,0]>170)&(sub[...,1]>110)&(sub[...,2]<110)
    sub[m]=(150,154,162)
# --- lift the driver out of the cabin so he can be moved separately
gl=Image.new('L',src.size,0); ImageDraw.Draw(gl).polygon([(798,203),(1048,203),(1212,353),(798,353)],fill=255)
gl=np.array(gl)>0; reg=np.zeros_like(gl); reg[196:372,852:1114]=True; reg&=gl|(np.indices(gl.shape)[0]>=353)
r_,g_,b_=a[...,0],a[...,1],a[...,2]
mm=reg&((a.max(2)>62)|((b_-r_>10)&(a.max(2)>44)))
mm[353:,:]&=(np.indices(gl.shape)[1][353:,:]<1112)
mm=ndi.binary_closing(mm,iterations=3); mm=ndi.binary_fill_holes(mm)
lb,nn=ndi.label(mm); sz=ndi.sum(mm,lb,range(1,nn+1)); mm=np.isin(lb,[i+1 for i,v in enumerate(sz) if v>600])
g2=Image.new('L',src.size,0); ImageDraw.Draw(g2).polygon([(800,207),(1038,207),(1190,349),(800,349)],fill=255); mm=ndi.binary_dilation(mm,iterations=2)&reg&(np.array(g2)>0)
moose=np.dstack([a.astype(np.uint8),np.where(mm,255,0).astype(np.uint8)])
a[(reg&gl)|(ndi.binary_dilation(mm,iterations=6)&(np.indices(gl.shape)[0]<362))]=(27,31,41)
rgba=np.dstack([a.astype(np.uint8),alpha])
ys,xs=np.nonzero(alpha); x0,x1,y0,y1=xs.min(),xs.max()+1,ys.min(),ys.max()+1
print('bbox',x0,x1,y0,y1)
_t=Image.fromarray(rgba); _d=ImageDraw.Draw(_t); _d.line([(1088,350),(1108,296)],fill=(70,72,84,255),width=9); closed=_t
doorpoly=[(792,195),(1055,195),(1250,362),(1256,596),(792,596)]
glass=[(798,203),(1048,203),(1212,353),(798,353)]
mk=Image.new('L',src.size,0); ImageDraw.Draw(mk).polygon(doorpoly,fill=255)
door=np.array(closed).copy(); door[...,3]=np.minimum(door[...,3],np.array(mk))
gm=Image.new('L',src.size,0); gd=ImageDraw.Draw(gm); gd.polygon(glass,fill=255); gd.rectangle((1118,296,1200,353),fill=0)
gm=np.array(gm)>0
door[gm]=(120,160,190,60)
door=Image.fromarray(door)
body=closed.copy(); d=ImageDraw.Draw(body)
INT=(22,22,30,255)
d.polygon([(794,356),(1250,366),(1254,594),(794,594)],fill=INT)
d.rectangle((1118,296,1200,356),fill=(27,31,41,255))
d.polygon([(1150,366),(1250,366),(1254,470),(1190,470)],fill=(38,40,52,255))
d.rectangle((794,574,1254,594),fill=(52,54,66,255))
d.rectangle((794,570,1254,574),fill=(96,98,112,255))
d.polygon([(806,356),(900,356),(905,470),(1010,470),(1010,505),(806,505)],fill=(120,74,42,255))
d.polygon([(806,356),(900,356),(905,470),(1010,470),(1010,480),(895,480),(890,366),(806,366)],fill=(160,104,60,255))
d.rectangle((1050,520,1110,540),fill=(16,16,22,255))
body.putalpha(Image.fromarray(alpha))
S=0.26
def shrink(im):
    c=im.crop((x0,y0,x1,y1)); w,h=round((x1-x0)*S),round((y1-y0)*S)
    c=c.resize((w,h),Image.LANCZOS); p=np.array(c); al=p[...,3]
    p[...,3]=np.where(al<50,0,np.where(al>190,255,al)); return Image.fromarray(p)
rows=[shrink(closed),shrink(body),shrink(door),shrink(Image.fromarray(moose))]
w,h=rows[0].size; print('cell',w,h)
sheet=Image.new('RGBA',(w,h*4),(0,0,0,0))
for i,r in enumerate(rows): sheet.paste(r,(0,i*h))
sheet.save('assets/img/car3.png',optimize=True)
f=lambda x,y:(round(float((x-x0)*S),1),round(float((y-y0)*S),1))
print('door',f(792,195),f(1256,596),'head',f(915,200),'rearwheel',f(400,695),'frontwheel',f(1455,695))
prev=Image.new('RGBA',(w*2,h*8),(200,90,200,255)); big=sheet.resize((w*2,h*8),Image.NEAREST); prev.alpha_composite(big); prev.save('/tmp/claude-0/-home-claude/9e25c0a3-3155-5f7d-a37e-57b12351260f/scratchpad/car_prev.png')
