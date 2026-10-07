from PIL import Image
import numpy as np
from scipy import ndimage as nd
im=Image.open('/root/.claude/uploads/9e25c0a3-3155-5f7d-a37e-57b12351260f/313af642-image.png'); print(im.mode,im.size)
a=np.array(im.convert('RGBA')); m=a[...,3]>128
lab,n=nd.label(m); sizes=nd.sum(m,lab,range(1,n+1)); objs=nd.find_objects(lab)
big=sorted([(objs[i],i+1) for i in range(n) if sizes[i]>5000],key=lambda o:o[0][1].start)
subs=[]
for sl,i in big:
    s=a[sl].copy(); s[...,3]=np.where(lab[sl]==i,255,0); subs.append(s); print(sl[1].start,sl[1].stop,sl[0].start,sl[0].stop)
def scale(sub,s):
    im=Image.fromarray(sub,'RGBA').convert('RGBa'); w,h=im.size
    im=im.resize((round(w*s),round(h*s)),Image.LANCZOS).convert('RGBA'); b=np.array(im); b[...,3]=np.where(b[...,3]>140,255,0); return b
assert len(subs)==6,len(subs)
ws=[scale(s,138/subs[0].shape[0]) for s in subs[:4]]
cw=max(w.shape[1] for w in ws)+2; ch=max(w.shape[0] for w in ws)
sheet=np.zeros((ch,cw*4,4),np.uint8)
for i,w in enumerate(ws):
    x0=i*cw+(cw-w.shape[1])//2; sheet[ch-w.shape[0]:,x0:x0+w.shape[1]]=w
Image.fromarray(sheet).save('worker.png',optimize=True); print('worker cell',cw,ch)
v=scale(subs[4],0.41); Image.fromarray(v).save('van.png',optimize=True); print('van',v.shape[1],v.shape[0])
d=scale(subs[5],0.40); Image.fromarray(d).save('dumpster.png',optimize=True); print('dumpster',d.shape[1],d.shape[0])
