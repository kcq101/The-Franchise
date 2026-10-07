from PIL import Image
import numpy as np
from scipy import ndimage as nd
U='/root/.claude/uploads/9e25c0a3-3155-5f7d-a37e-57b12351260f/'
def comps(path,n):
    im=Image.open(path).convert('RGBA'); a=np.array(im); m=a[...,3]>128
    lab,k=nd.label(m); sizes=nd.sum(m,lab,range(1,k+1)); objs=nd.find_objects(lab)
    big=sorted([(objs[i],i+1) for i in range(k) if sizes[i]>8000],key=lambda o:o[0][1].start)
    print(path[-18:],im.size,len(big)); assert len(big)==n,len(big)
    out=[]
    for sl,i in big:
        s=a[sl].copy(); s[...,3]=np.where(lab[sl]==i,255,0); out.append((s,sl[1].start,sl[0].start))
    return out,im.size[0]/2000.0
def scale(sub,s):
    im=Image.fromarray(sub,'RGBA').convert('RGBa'); w,h=im.size
    im=im.resize((round(w*s),round(h*s)),Image.LANCZOS).convert('RGBA'); b=np.array(im); b[...,3]=np.where(b[...,3]>140,255,0); return b
def sheet(frames,s,name,pts=None,center=()):
    cells=[]
    for i,(sub,x0,y0) in enumerate(frames):
        a=scale(sub,s); h=a.shape[0]
        if i in center: ax=a.shape[1]/2
        else:
            feet=a[int(h*.88):,:,3]>0; xs=np.nonzero(feet.any(0))[0]; ax=(xs[0]+xs[-1])/2
        cells.append((a,ax))
    L=max(int(np.ceil(ax)) for a,ax in cells)+2; Rr=max(int(np.ceil(a.shape[1]-ax)) for a,ax in cells)+2
    ch=max(a.shape[0] for a,ax in cells)+1; cw=L+Rr
    out=np.zeros((ch,cw*len(cells),4),np.uint8); P=[]
    for i,(a,ax) in enumerate(cells):
        x0=i*cw+L-int(round(ax)); y0=ch-a.shape[0]; out[y0:,x0:x0+a.shape[1]]=a
        if pts and pts[i]:
            fx=(pts[i][0]-frames[i][1])*s+x0-i*cw-L; fy=(pts[i][1]-frames[i][2])*s+y0-ch
            P.append((round(fx/2,1),round(fy/2,1)))
            px=int(x0+(pts[i][0]-frames[i][1])*s); py=int(y0+(pts[i][1]-frames[i][2])*s); out[py-2:py+3,px-2:px+3]=(255,0,255,255) if name.endswith('_dbg') else out[py-2:py+3,px-2:px+3]
        else: P.append(None)
    Image.fromarray(out).save(name.replace('_dbg','')+('_dbg.png' if name.endswith('_dbg') else '.png'),optimize=True)
    print(name,'cw',cw,'ch',ch,'ax',L,'heights',[c[0].shape[0] for c in cells],'pts',P)
    return out
m,k=comps(U+'8d1f33c5-image.png',6); sheet(m,.275,'mark2',center=(5,))
w,k=comps(U+'66caba9b-image.png',5)
pts=[None,None,(858*k,408*k),(1128*k,318*k),(1788*k,330*k)]
sheet(w,.258,'worker2',pts); d=sheet(w,.258,'worker2_dbg',pts)
gp,k=comps(U+'9f195391-image.png',4); sheet(gp,.268,'grap')
bg=Image.new('RGBA',(d.shape[1],d.shape[0]),(40,110,60,255)); bg.alpha_composite(Image.fromarray(d)); bg.save('w2prev.png')
