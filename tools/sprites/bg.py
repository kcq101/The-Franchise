from PIL import Image
import numpy as np
U='/root/.claude/uploads/9e25c0a3-3155-5f7d-a37e-57b12351260f/'
def runs(v,gap):
    idx=np.nonzero(v)[0]; out=[]; s=idx[0]; p=idx[0]
    for i in idx[1:]:
        if i-p>gap: out.append((s,p+1)); s=i
        p=i
    out.append((s,p+1)); return out
im=Image.open(U+'770ad28d-image.png').convert('RGBA'); a=np.array(im); print('sections',im.size, 'alpha',a[...,3].min(),a[...,3].max())
m=a[...,3]>60; secs=[]
for y0,y1 in runs(m.any(1),12):
    if y1-y0<100: continue
    for x0,x1 in runs(m[y0:y1].any(0),12):
        if x1-x0<200: continue
        secs.append(a[y0:y1,x0:x1]); print(' sec',x0,x1,y0,y1)
SC=1.15; meta=[]
for i,s in enumerate(secs):
    p=Image.fromarray(s).convert('RGBa'); w,h=p.size
    p=p.resize((round(w*SC),round(h*SC)),Image.LANCZOS).convert('RGBA'); p.save('sec%d.png'%(i+1),optimize=True); meta.append(p.size)
print('secs',meta)
sk=Image.open(U+'953834fa-image.png').convert('RGB'); print('sky',sk.size)
s=1240/sk.size[0]; sk=sk.resize((1240,round(sk.size[1]*s)),Image.LANCZOS); print(' scaled',sk.size)
sk=sk.crop((0,sk.size[1]-320-0,1240,sk.size[1])) if sk.size[1]>=320 else sk
sk.save('sky.webp',quality=90,method=6); print(' sky out',sk.size)
st=Image.open(U+'8957b3d1-image.png').convert('RGBA'); b=np.array(st); print('street',st.size,'alpha',b[...,3].min(),b[...,3].max())
full=(b[...,3]>250).mean(1); top=int(np.argmax(full>.995)); print(' first full row',top)
c=b[top:top+252].astype(np.float32); c[...,3]=255
F=60; w=c.shape[1]; t=np.linspace(0,1,F)[None,:,None]
c[:,:F]=c[:,:F]*t+c[:,w-F:]*(1-t); c=c[:,:w-F]
g=Image.fromarray(c.astype(np.uint8)).convert('RGB'); g=g.resize((round(g.size[0]*.45),112),Image.LANCZOS); g.save('street.webp',quality=92,method=6); print(' street out',g.size)
