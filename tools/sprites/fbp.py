from PIL import Image
import numpy as np
from scipy import ndimage as nd
U='/root/.claude/uploads/9e25c0a3-3155-5f7d-a37e-57b12351260f/'
def key(path,lo,hi,satmax):
    a=np.array(Image.open(path).convert('RGBA')); print(path[-18:],'alpha',a[...,3].min(),a[...,3].max())
    rgb=a[...,:3].astype(np.int32); mx=rgb.max(2); sat=mx-rgb.min(2); lum=rgb.mean(2)
    bgc=(sat<=satmax)&(mx>=lo)&(mx<=hi)
    m0=nd.uniform_filter(lum,7); sd0=np.sqrt(np.maximum(0,nd.uniform_filter(lum*lum,7)-m0*m0))
    core=nd.binary_erosion(bgc&(sd0>9),iterations=2)          # only textured grey counts as background seed
    lab0,n0=nd.label(core); sz=nd.sum(core,lab0,range(1,n0+1)); keep=[k+1 for k in range(n0) if sz[k]>30]
    bg=nd.binary_dilation(np.isin(lab0,keep),iterations=5)&bgc
    return a,~bg
def scale(sub,s):
    im=Image.fromarray(sub,'RGBA').convert('RGBa'); w,h=im.size
    im=im.resize((max(1,round(w*s)),max(1,round(h*s))),Image.LANCZOS).convert('RGBA'); b=np.array(im); b[...,3]=np.where(b[...,3]>150,255,0); return b
a,fg=key(U+'8de8c989-image.png',120,222,6)
fg=nd.binary_opening(fg,iterations=2)
# two defender frames touch in the source: cut the thinnest column between them
cols=fg[300:548,960:1100].sum(0); cut=960+int(np.argmin(cols)); fg[300:548,cut-1:cut+2]=False; print('cut at',cut,cols.min())
lab,n=nd.label(fg); sizes=nd.sum(fg,lab,range(1,n+1)); objs=nd.find_objects(lab)
big=[(objs[i],i+1,sizes[i]) for i in range(n) if sizes[i]>4000]
print(len(big),[(o[0][1].start,o[0][1].stop,o[0][0].start,o[0][0].stop,int(o[2])) for o in sorted(big,key=lambda o:(o[0][0].start>280,o[0][1].start))])
FILL=False
def grab(o):
    sl,i,_=o; s=a[sl].copy(); mk=lab[sl]==i
    if FILL: mk=nd.binary_closing(mk,iterations=3)|nd.binary_fill_holes(mk)
    s[...,3]=np.where(mk,255,0); return s,sl
top=sorted([o for o in big if o[0][0].start<270],key=lambda o:o[0][1].start)
bot=sorted([o for o in big if o[0][0].start>=270],key=lambda o:o[0][1].start)
line=[o for o in bot if o[0][1].start<690]; dfd=[o for o in bot if o[0][1].start>=690]
print(len(top),len(line),len(dfd))
def sheet(objs,s,name,center=(),anchor='feet'):
    cells=[]
    for i,o in enumerate(objs):
        sub,sl=grab(o); c=scale(sub,s); h=c.shape[0]
        if i in center: ax=c.shape[1]/2
        else:
            f=c[int(h*.86):,:,3]>0; xs=np.nonzero(f.any(0))[0]; ax=(xs[0]+xs[-1])/2
        cells.append((c,ax))
    L=max(int(np.ceil(ax)) for c,ax in cells)+2; R=max(int(np.ceil(c.shape[1]-ax)) for c,ax in cells)+2; ch=max(c.shape[0] for c,ax in cells)+1; cw=L+R
    out=np.zeros((ch,cw*len(cells),4),np.uint8)
    for i,(c,ax) in enumerate(cells):
        x0=i*cw+L-int(round(ax)); out[ch-c.shape[0]:,x0:x0+c.shape[1]]=c
    Image.fromarray(out).save(name+'.png',optimize=True); print(name,'cw',cw,'ch',ch,'ax',L,'h',[c.shape[0] for c,ax in cells]); return out
S=140/ (top[0][0][0].stop-top[0][0][0].start)
print('scale',S)
o1=sheet(top,S,'qb',center=(6,7)); o2=sheet(line,S,'lineman'); FILL=True; dfd=[dfd[0],dfd[2],dfd[3],dfd[4]]; o3=sheet(dfd,S,'defender')
W=max(o.shape[1] for o in (o1,o2,o3)); H=sum(o.shape[0] for o in (o1,o2,o3))+20
pv=Image.new('RGBA',(W,H),(200,60,160,255)); y=0
for o in (o1,o2,o3): pv.alpha_composite(Image.fromarray(o),(0,y)); y+=o.shape[0]+10
pv.save('fb_prev.png')
