from PIL import Image, ImageDraw
import numpy as np
from scipy import ndimage as ndi
S='/tmp/claude-0/-home-claude/9e25c0a3-3155-5f7d-a37e-57b12351260f/scratchpad/'
src=Image.open(S+'car5_warp.png').convert('RGB'); a=np.array(src).astype(int)
alpha=np.where(np.array(Image.open(S+'car5_mask.png'))>128,255,0).astype(np.uint8)
yy,xx=np.indices(alpha.shape); r_,g_,b_=a[...,0],a[...,1],a[...,2]
# plain wheel centres
m=(yy>536)&(yy<574)&(((xx>395)&(xx<437))|((xx>1444)&(xx<1485)))&(r_>170)&(g_>90)&(b_<100); a[m]=(150,154,162)
GREY=(61,66,72)
# --- lift Moose out of the cabin
g0=Image.new('L',src.size,0); ImageDraw.Draw(g0).polygon([(808,186),(1020,186),(1186,343),(808,343)],fill=255); reg=(np.array(g0)>0)&(xx<1100)&((xx>=842)|(yy>=292))
d=np.abs(a-np.array(GREY)).sum(2); skin=(r_>150)&(g_>80)&(g_<180)&(b_<120)&(r_>g_+40); mm=reg&(d>34)&((yy>=205)|skin)
seat=(r_>g_+30)&(b_<70)&(r_<185)&(xx<845); mm&=~seat
mm=ndi.binary_closing(mm,iterations=2); lb,nn=ndi.label(mm); sz=ndi.sum(mm,lb,range(1,nn+1)); mm=lb==(1+int(np.argmax(sz))); mm=ndi.binary_fill_holes(mm)
moose=np.dstack([a.astype(np.uint8),np.where(mm,255,0).astype(np.uint8)])
dm=ndi.binary_dilation(mm,iterations=3)&reg; a[dm&(yy>=203)]=GREY; a[dm&(yy<203)]=(18,18,24)
rgba=np.dstack([a.astype(np.uint8),alpha])
ys,xs=np.nonzero(alpha); x0,x1,y0,y1=xs.min(),xs.max()+1,ys.min(),ys.max()+1; print('bbox',x0,x1,y0,y1)
closed=Image.fromarray(rgba)
doorpoly=[(800,195),(1052,195),(1256,362),(1262,598),(800,598)]
glass=[(806,203),(1044,203),(1196,345),(806,345)]
mk=Image.new('L',src.size,0); ImageDraw.Draw(mk).polygon(doorpoly,fill=255)
door=np.array(closed).copy(); door[...,3]=np.minimum(door[...,3],np.array(mk))
gm=Image.new('L',src.size,0); gd=ImageDraw.Draw(gm); gd.polygon(glass,fill=255); gd.rectangle((1136,300,1204,345),fill=0); gm=np.array(gm)>0
door[gm]=(120,160,190,60); door=Image.fromarray(door)
body=closed.copy(); dr=ImageDraw.Draw(body); INT=(22,22,30,255)
dr.polygon([(802,349),(1256,364),(1260,596),(802,596)],fill=INT)
dr.rectangle((1136,300,1204,349),fill=GREY+(255,))
dr.polygon([(1150,366),(1256,366),(1260,470),(1190,470)],fill=(38,40,52,255))
dr.rectangle((802,576,1260,596),fill=(52,54,66,255)); dr.rectangle((802,572,1260,576),fill=(96,98,112,255))
dr.polygon([(812,352),(900,356),(905,470),(1010,470),(1010,505),(812,505)],fill=(120,74,42,255))
dr.polygon([(812,352),(900,356),(905,470),(1010,470),(1010,480),(895,480),(890,366),(812,362)],fill=(160,104,60,255))
dr.rectangle((1050,520,1110,540),fill=(16,16,22,255))
body.putalpha(Image.fromarray(alpha))
SC=0.26
def shrink(im):
    c=im.crop((x0,y0,x1,y1)); w,h=485,141
    c=c.resize((w,h),Image.LANCZOS); p=np.array(c); al=p[...,3]; p[...,3]=np.where(al<50,0,np.where(al>190,255,al)); return Image.fromarray(p)
rows=[shrink(closed),shrink(body),shrink(door),shrink(Image.fromarray(moose))]
sheet=Image.new('RGBA',(485,141*4),(0,0,0,0))
for i,r in enumerate(rows): sheet.paste(r,(0,i*141))
sheet.save('/home/claude/the-franchise/assets/img/car4.png',optimize=True)
pv=Image.new('RGBA',(970,141*8),(200,90,200,255)); pv.alpha_composite(sheet.resize((970,141*8),Image.NEAREST)); pv.save(S+'car_prev.png')
