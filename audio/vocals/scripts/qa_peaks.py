import sys; import os; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from vlib import *
from scipy.signal import find_peaks
PC = ['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B']
for p in sys.argv[1:]:
    y,_=sf.read(p); m=y.mean(1)[int(0.6*SR):int(2.2*SR)]
    X=np.abs(np.fft.rfft(m*np.hanning(len(m)), 8*len(m))); f=np.fft.rfftfreq(8*len(m),1/SR)
    sel=(f>60)&(f<1400); Xs=20*np.log10(X[sel]/X[sel].max()); fs=f[sel]
    pk,_=find_peaks(Xs, height=-30, distance=int(3/(f[1]-f[0])))
    pk = pk[np.argsort(-Xs[pk])][:16]
    out=[]
    for i in sorted(pk, key=lambda i: fs[i]):
        mm=69+12*np.log2(fs[i]/440); n=int(round(mm))
        out.append(f"{PC[n%12]}{n//12-1}{(mm-n)*100:+.0f}c({Xs[i]:.0f})")
    print(p.split('/')[-1][:45], ' '.join(out))
