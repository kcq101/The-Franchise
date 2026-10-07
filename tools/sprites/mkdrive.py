from PIL import Image
import numpy as np, json
from scipy import ndimage as ndi
U='/root/.claude/uploads/9e25c0a3-3155-5f7d-a37e-57b12351260f/'
OUT='/home/claude/the-franchise/assets/img/'
def key(path,kind):
    a=np.array(Image.open(path).convert('RGB')).astype(int); r,g,b=a[...,0],a[...,1],a[...,2]
    if kind=='g': bg=(g>150)&(r<140)&(b<140)&(g-np.maximum(r,b)>70)
    else: bg=(r>150)&(b>150)&(g<120)&(np.minimum(r,b)-g>70)
    fg=~bg
    fg=ndi.binary_opening(fg,iterations=1)
    lab,n=ndi.label(ndi.binary_dilation(fg,iterations=6)); 
    # despill on the edge pixels
    edge=fg&ndi.binary_dilation(bg,iterations=2)
    if kind=='g':
        gg=np.minimum(g,np.maximum(r,b)+10); a[...,1]=np.where(edge,gg,g)
    else:
        m=np.minimum(np.minimum(r,b),g+25); a[...,0]=np.where(edge&(r>g+40)&(b>g+40),m,r); a[...,2]=np.where(edge&(r>g+40)&(b>g+40),m,b)
    rgba=np.dstack([a.astype(np.uint8),np.where(fg,255,0).astype(np.uint8)])
    boxes=[]
    for sl in ndi.find_objects(lab):
        m=fg[sl]; 
        if m.sum()<800: continue
        ys,xs=np.nonzero(m); boxes.append((sl[1].start+xs.min(),sl[0].start+ys.min(),sl[1].start+xs.max()+1,sl[0].start+ys.max()+1))
    return rgba,boxes
def pack(rgba,boxes,scale,name,pad=2):
    im=Image.fromarray(rgba); cells=[]; x=0; H=0; parts=[]
    for (x0,y0,x1,y1) in boxes:
        c=im.crop((x0,y0,x1,y1)); w,h=max(1,round((x1-x0)*scale)),max(1,round((y1-y0)*scale)); c=c.resize((w,h),Image.LANCZOS)
        p=np.array(c); al=p[...,3]; p[...,3]=np.where(al<90,0,255); c=Image.fromarray(p)
        parts.append(c); cells.append([x,0,w,h]); x+=w+pad; H=max(H,h)
    sheet=Image.new('RGBA',(x,H),(0,0,0,0))
    for c,cl in zip(parts,cells): sheet.paste(c,(cl[0],0))
    sheet.save(OUT+name,optimize=True); print(name,sheet.size,json.dumps(cells)); return cells
# player car
rgba,b=key(U+'5dd86d4d-image.png','g'); b.sort(key=lambda t:t[0]); print(len(b))
# neutral badge / wheel centres: yellow dots
a=rgba[...,:3].astype(int); yl=(a[...,0]>200)&(a[...,1]>150)&(a[...,2]<90); 
print('yellow px',yl.sum())
pack(rgba,b,0.5,'drive_car.png')
rgba,b=key(U+'68cf6ec8-image.png','g'); b.sort(key=lambda t:t[0]); print(len(b)); pack(rgba,b,0.5,'drive_traffic.png')
rgba,b=key(U+'260fa87c-image.png','m'); b.sort(key=lambda t:(t[1]>300,t[0])); print(len(b)); pack(rgba,b,0.5,'drive_props.png')
bg=Image.open(U+'3b551f27-image.png').convert('RGB'); print(bg.size)
bg.crop((0,160,2172,630)).resize((1400,303),Image.LANCZOS).save(OUT+'drive_sky.webp',quality=88)
