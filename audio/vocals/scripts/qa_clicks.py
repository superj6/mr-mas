import sys; import os; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from vlib import *
from scipy.ndimage import uniform_filter1d
for p in sys.argv[1:]:
    y,_=sf.read(p); m=y.mean(1)
    d=np.diff(m,2)
    loc=np.sqrt(uniform_filter1d(d**2, int(0.01*SR)))+1e-9
    z=np.abs(d)/loc
    idx=np.where((z>9)&(np.abs(d)>1e-3))[0]
    # group
    groups=[]
    for i in idx:
        if groups and i-groups[-1][-1]<200: groups[-1].append(i)
        else: groups.append([i])
    print(p.split('/')[-1], len(groups), [round(g[0]/SR,3) for g in groups[:12]])
