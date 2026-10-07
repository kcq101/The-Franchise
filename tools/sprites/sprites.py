from PIL import Image
import numpy as np
from scipy import ndimage as nd
U='/root/.claude/uploads/9e25c0a3-3155-5f7d-a37e-57b12351260f'
def frames(path):
    im=Image.open(path); print(path[-18:],im.mode,im.size)
    im=im.convert('RGBA'); a=np.array(im); al=a[...,3]
    print(' alpha min/max',al.min(),al.max(),' frac opaque',(al>128).mean())
    m=al>128
    lab,n=nd.label(m); sizes=nd.sum(m,lab,range(1,n+1))
    objs=nd.find_objects(lab); big=[(objs[i],i+1) for i in range(n) if sizes[i]>5000]
    big.sort(key=lambda o:o[0][1].start)
    out=[]
    for sl,i in big:
        keep=(lab[sl]==i)
        sub=a[sl].copy(); sub[...,3]=np.where(keep,255,0)
        out.append((sub,sl[1].start,sl[0].start))
        print('  frame x',sl[1].start,sl[1].stop,'y',sl[0].start,sl[0].stop,'size',int(sizes[i-1]))
    return out
def scale(sub,s):
    im=Image.fromarray(sub,'RGBA').convert('RGBa')
    w,h=im.size; im=im.resize((max(1,round(w*s)),max(1,round(h*s))),Image.LANCZOS).convert('RGBA')
    a=np.array(im); a[...,3]=np.where(a[...,3]>140,255,0); return a
def anchor(a):
    h=a.shape[0]; top=a[:int(h*.25),:,3]>0; xs=np.nonzero(top)[1]; return xs.mean()
run=frames(U+'/8daf505f-image.png'); idle=frames(U+'/178ab3b0-image.png')
SR,SI=0.30,0.24
cells=[]
base=max(y+s.shape[0] for s,x,y in run)
for s,x,y in run:
    a=scale(s,SR); cells.append((a,anchor(a),round((base-(y+s.shape[0]))*SR)))
for s,x,y in idle:
    a=scale(s,SI); cells.append((a,anchor(a),0))
# torso-ish anchor for skid frames: use bbox centre instead of head
for k in (12,13):
    a=cells[k][0]; cells[k]=(a,a.shape[1]*0.42,0)
L=max(int(np.ceil(ax)) for a,ax,l in cells)+2; Rr=max(int(np.ceil(a.shape[1]-ax)) for a,ax,l in cells)+2
ch=max(a.shape[0]+l for a,ax,l in cells)+2; cw=L+Rr
sheet=np.zeros((ch,cw*len(cells),4),np.uint8)
for i,(a,ax,l) in enumerate(cells):
    x0=i*cw+L-int(round(ax)); y0=ch-1-l-a.shape[0]
    sheet[y0:y0+a.shape[0],x0:x0+a.shape[1]]=a
    print(i,'h',a.shape[0],'lift',l)
Image.fromarray(sheet,'RGBA').save('mark.png',optimize=True)
print('cell',cw,ch,'anchorx',L,'n',len(cells))
bg=Image.new('RGBA',(sheet.shape[1],ch),(60,90,60,255)); bg.alpha_composite(Image.fromarray(sheet,'RGBA')); bg.resize((sheet.shape[1]*1,ch*1)).save('mark_preview.png')
