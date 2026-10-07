from PIL import Image
import numpy as np, json
from scipy import ndimage as ndi
U='/root/.claude/uploads/9e25c0a3-3155-5f7d-a37e-57b12351260f/'; S='/tmp/claude-0/-home-claude/9e25c0a3-3155-5f7d-a37e-57b12351260f/scratchpad/'
def key(path):
    a=np.array(Image.open(path).convert('RGB')).astype(int); r,g,b=a[...,0],a[...,1],a[...,2]
    bg=(g>150)&(r<140)&(b<140)&(g-np.maximum(r,b)>70); fg=ndi.binary_opening(~bg,iterations=1)
    edge=fg&ndi.binary_dilation(~fg,iterations=2); a[...,1]=np.where(edge,np.minimum(g,np.maximum(r,b)+10),g); return a,fg
def sheet(path,name,SC=.58):
    a,fg=key(path); lab,n=ndi.label(fg); objs=ndi.find_objects(lab)
    big=[i+1 for i,sl in enumerate(objs) if (lab[sl]==i+1).sum()>15000]; assert len(big)==12,len(big)
    H=a.shape[0]; rows=[sorted([i for i in big if (objs[i-1][0].start+objs[i-1][0].stop)/2<H/2],key=lambda i:objs[i-1][1].start),sorted([i for i in big if (objs[i-1][0].start+objs[i-1][0].stop)/2>=H/2],key=lambda i:objs[i-1][1].start)]
    print([len(r) for r in rows]); parts=[]; tab=[]
    for row in rows:
        for i in row:
            m=lab==i; o=objs[i-1]
            for j,sl in enumerate(objs):
                c=(lab[sl]==j+1).sum()
                if 30<c<=15000:
                    cy=(sl[0].start+sl[0].stop)/2; cx=(sl[1].start+sl[1].stop)/2
                    if o[0].start-10<cy<o[0].stop+10 and o[1].start-25<cx<o[1].stop+25: m|=lab==j+1
            ys,xs=np.nonzero(m); x0,x1,y0,y1=xs.min(),xs.max()+1,ys.min(),ys.max()+1; h=y1-y0; w=x1-x0
            if w>h*1.5: ax=(x0+x1)/2-x0
            else:
                band=m[y0+int(h*.3):y0+int(h*.6),x0:x1]; cols=np.nonzero(band.any(0))[0]; ax=np.median(np.nonzero(band)[1])
            im=Image.fromarray(np.dstack([a.astype(np.uint8),np.where(m,255,0).astype(np.uint8)])[y0:y1,x0:x1]); W2,H2=round(w*SC),round(h*SC); im=im.resize((W2,H2),Image.LANCZOS); p=np.array(im); p[...,3]=np.where(p[...,3]<90,0,255); parts.append(Image.fromarray(p)); tab.append([W2,H2,round(ax*SC)])
    out=[]; x=0; y=0; rowh=0; Wmax=1100; pos=[]
    for t in tab:
        if x+t[0]>Wmax: x=0; y+=rowh+2; rowh=0
        pos.append((x,y)); out.append([x,y,t[0],t[1],t[2]]); x+=t[0]+2; rowh=max(rowh,t[1])
    sh=Image.new('RGBA',(Wmax,y+rowh),(0,0,0,0))
    for pim,(px,py) in zip(parts,pos): sh.paste(pim,(px,py))
    sh.save('assets/img/'+name,optimize=True); print(name,sh.size,json.dumps(out).replace(' ',''))
    pv=Image.new('RGBA',sh.size,(60,50,40,255)); pv.alpha_composite(sh); pv.save(S+'pv_'+name)
sheet(U+'a7ed0c79-image.png','fight_frank.png'); sheet(U+'4b22d1bd-image.png','fight_moose.png')
bg=Image.open(U+'a422f650-image.png').convert('RGB'); print(bg.size); bg.resize((1296,648),Image.LANCZOS).save('assets/img/fight_bg.webp',quality=84)
a,fg=key(U+'c50bbd29-image.png'); Hh,Ww=a.shape[:2]; pw=Ww/4
r,g,b=a[...,0],a[...,1],a[...,2]; white=(r>225)&(g>225)&(b>225); col=np.arange(Ww)[None,:]%pw; fg&=~(white&((col<9)|(col>pw-9)))
rgba=Image.fromarray(np.dstack([a.astype(np.uint8),np.where(fg,255,0).astype(np.uint8)]))
out=Image.new('RGBA',(250*4,333),(0,0,0,0))
for i in range(4):
    c=rgba.crop((round(i*pw)+5,0,round((i+1)*pw)-5,Hh)).resize((246,333),Image.LANCZOS); p=np.array(c); p[...,3]=np.where(p[...,3]<90,0,255); out.paste(Image.fromarray(p),(i*250+2,0))
out.save('assets/img/fight_faces.png',optimize=True); pv=Image.new('RGBA',out.size,(60,50,40,255)); pv.alpha_composite(out); pv.save(S+'pv_fight_faces.png')
