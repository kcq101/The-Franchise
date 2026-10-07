from PIL import Image
import numpy as np, json
from scipy import ndimage as ndi
U='/root/.claude/uploads/9e25c0a3-3155-5f7d-a37e-57b12351260f/'
OUT='/home/claude/the-franchise/assets/img/'
def key(path):
    a=np.array(Image.open(path).convert('RGB')).astype(int); r,g,b=a[...,0],a[...,1],a[...,2]
    bg=(r>150)&(b>150)&(g<120)&(np.minimum(r,b)-g>70)
    lb,nn=ndi.label(bg); sz=ndi.sum(bg,lb,range(1,nn+1)); bg=np.isin(lb,[i+1 for i,v in enumerate(sz) if v>900])
    pink=(r>190)&(b>g+35)&(g<175)&(b>110)          # glow bleeding into the magenta
    pink&=ndi.binary_dilation(bg,iterations=10)
    fg=~(bg|pink); fg=ndi.binary_opening(fg,iterations=1)
    cast=(r>g+35)&(b>g+35)&ndi.binary_dilation(bg|pink,iterations=3)
    a[...,0]=np.where(cast,np.minimum(r,g+18),r); a[...,2]=np.where(cast,np.minimum(b,g+28),b)
    lab,n=ndi.label(ndi.binary_dilation(fg,iterations=2))
    rgba=np.dstack([a.astype(np.uint8),np.where(fg,255,0).astype(np.uint8)]); boxes=[]
    for sl in ndi.find_objects(lab):
        m=fg[sl]
        if m.sum()<1500: continue
        ys,xs=np.nonzero(m); boxes.append((sl[1].start+xs.min(),sl[0].start+ys.min(),sl[1].start+xs.max()+1,sl[0].start+ys.max()+1))
    return rgba,boxes,a.shape
def pack(rgba,boxes,scale,name,pad=2):
    im=Image.fromarray(rgba); cells=[]; x=0; H=0; parts=[]
    for (x0,y0,x1,y1) in boxes:
        c=im.crop((x0,y0,x1,y1)); w,h=max(1,round((x1-x0)*scale)),max(1,round((y1-y0)*scale)); c=c.resize((w,h),Image.LANCZOS)
        p=np.array(c); al=p[...,3]; p[...,3]=np.where(al<90,0,255); c=Image.fromarray(p)
        parts.append(c); cells.append([x,0,w,h]); x+=w+pad; H=max(H,h)
    sheet=Image.new('RGBA',(x,H),(0,0,0,0))
    for c,cl in zip(parts,cells): sheet.paste(c,(cl[0],0))
    sheet.save(OUT+name,optimize=True); print(name,sheet.size,json.dumps(cells))
    pv=Image.new('RGBA',sheet.size,(30,34,60,255)); pv.alpha_composite(sheet); pv.save('/tmp/claude-0/-home-claude/9e25c0a3-3155-5f7d-a37e-57b12351260f/scratchpad/pv_'+name)
for f,n in (('d7dc231f-image.png','drive_bld2.png'),('7551ecc0-image.png','drive_bld3.png')):
    rgba,b,sh=key(U+f); print(sh,len(b)); b.sort(key=lambda t:t[0]); pack(rgba,b,0.5,n)
