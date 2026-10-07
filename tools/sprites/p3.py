from PIL import Image
import numpy as np
from scipy import ndimage as nd
U='/root/.claude/uploads/9e25c0a3-3155-5f7d-a37e-57b12351260f/'
def scale(sub,s):
    im=Image.fromarray(sub,'RGBA').convert('RGBa'); w,h=im.size
    im=im.resize((round(w*s),round(h*s)),Image.LANCZOS).convert('RGBA'); b=np.array(im); b[...,3]=np.where(b[...,3]>140,255,0); return b
# ---- limp
im=Image.open(U+'45e5680d-image.png').convert('RGBA'); a=np.array(im); m=a[...,3]>128; print('limp',im.size,a[...,3].min())
lab,k=nd.label(m); sizes=nd.sum(m,lab,range(1,k+1)); objs=nd.find_objects(lab)
big=sorted([(objs[i],i+1) for i in range(k) if sizes[i]>8000],key=lambda o:o[0][1].start); print(len(big))
fr=[]
for sl,i in big:
    s=a[sl].copy(); s[...,3]=np.where(lab[sl]==i,255,0); fr.append((s,sl[0].stop))
base=max(b for s,b in fr); cells=[]
for s,b in fr:
    c=scale(s,.255); top=c[:int(c.shape[0]*.25),:,3]>0; ax=np.nonzero(top)[1].mean(); cells.append((c,ax,round((base-b)*.255)))
L=max(int(np.ceil(ax)) for c,ax,l in cells)+2; Rr=max(int(np.ceil(c.shape[1]-ax)) for c,ax,l in cells)+2; ch=max(c.shape[0]+l for c,ax,l in cells)+1; cw=L+Rr
out=np.zeros((ch,cw*len(cells),4),np.uint8)
for i,(c,ax,l) in enumerate(cells):
    x0=i*cw+L-int(round(ax)); y0=ch-l-c.shape[0]; out[y0:y0+c.shape[0],x0:x0+c.shape[1]]=c
Image.fromarray(out).save('limp.png',optimize=True); print('limp cw',cw,'ch',ch,'ax',L,[(c.shape[0],l) for c,ax,l in cells])
# ---- police car
im=Image.open(U+'cea816e2-image.png'); print('cop',im.mode,im.size)
a=np.array(im.convert('RGBA')); print(' alpha',a[...,3].min(),a[...,3].max())
rgb=a[...,:3].astype(np.int32); mx=rgb.max(2); mn=rgb.min(2); sat=(mx-mn)
print(' corner px',rgb[5,5],rgb[5,20],rgb[20,5], 'bg stats',np.percentile(mx[:60],[1,50,99]),np.percentile(sat[:60],[50,99]))
