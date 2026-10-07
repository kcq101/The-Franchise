from PIL import Image
import numpy as np
from scipy import ndimage as nd
U='/root/.claude/uploads/9e25c0a3-3155-5f7d-a37e-57b12351260f/'
a=np.array(Image.open(U+'cea816e2-image.png').convert('RGBA')); k=a.shape[1]/2000
rgb=a[...,:3].astype(np.int32); mx=rgb.max(2); sat=mx-rgb.min(2)
bgc=(sat<=16)&(mx>=105)&(mx<=218)
lab,n=nd.label(bgc); border=set(np.unique(np.concatenate([lab[0],lab[-1],lab[:,0],lab[:,-1]])))-{0}
bg=np.isin(lab,list(border))
fg=~bg
# strip the light halos: above the roof keep only the light bars
roof=int(214*k); bars=[(int(522*k),int(704*k)),(int(1474*k),int(1656*k))]; top=int(180*k)
keep=np.zeros_like(fg); 
for x0,x1 in bars: keep[top:roof,x0:x1]=True
fg[:roof]&=keep[:roof]
fg=nd.binary_opening(fg,iterations=2)
lab,n=nd.label(fg); sizes=nd.sum(fg,lab,range(1,n+1)); objs=nd.find_objects(lab)
big=sorted([(objs[i],i+1) for i in range(n) if sizes[i]>60000],key=lambda o:o[0][1].start); print(len(big),[ (o[0][1].start,o[0][1].stop,o[0][0].start,o[0][0].stop) for o in big])
cells=[]
for sl,i in big:
    s=a[sl].copy(); mk=nd.binary_fill_holes(lab[sl]==i); s[...,3]=np.where(mk,255,0)
    im=Image.fromarray(s).convert('RGBa'); w,h=im.size; sc=356/w
    im=im.resize((356,round(h*sc)),Image.LANCZOS).convert('RGBA'); b=np.array(im); b[...,3]=np.where(b[...,3]>150,255,0); cells.append(b)
ch=max(c.shape[0] for c in cells); out=np.zeros((ch,712,4),np.uint8)
for i,c in enumerate(cells): out[ch-c.shape[0]:,i*356:i*356+356]=c
Image.fromarray(out).save('cop.png',optimize=True); print('cop cell 356',ch)
bgim=Image.new('RGBA',(712,ch),(30,120,60,255)); bgim.alpha_composite(Image.fromarray(out)); bgim.save('cop_prev.png')
