"""Click / DC / clip detector over stems and masters."""
import sys, os, numpy as np, soundfile as sf
from scipy import signal
sys.path.insert(0, os.path.dirname(__file__))
SR = 48000
def clicks(x, thr=10.0):
    m = x.mean(1) if x.ndim > 1 else x
    h = signal.sosfilt(signal.butter(4, 9000, 'high', fs=SR, output='sos'), m)
    d = np.abs(h)
    loc = np.sqrt(signal.sosfiltfilt(signal.butter(1, 30, 'low', fs=SR, output='sos'), d ** 2).clip(0)) + 1e-6
    ratio = d / loc
    glob = np.sqrt(np.mean(m ** 2)) + 1e-9
    idx = np.where((ratio > thr) & (d > glob * 0.05))[0]
    ev = []
    last = -10**9
    for i in idx:
        if i - last > SR * 0.02:
            ev.append(i)
        last = i
    return ev
for v in sys.argv[1:]:
    files = [f'stems/{f}' for f in sorted(os.listdir('stems')) if f.startswith(v + '-')] + \
            [f for f in os.listdir('.') if f.startswith(f'theme-{v}-') and f.endswith('.wav')]
    for f in files:
        x, _ = sf.read(f, always_2d=True)
        ev = clicks(x)
        dc = float(np.abs(x.mean(0)).max())
        pk = float(np.abs(x).max())
        print(f'{f:40s} peak {20*np.log10(pk+1e-12):6.1f} dBFS  dc {dc:.5f}  clicks {len(ev):3d} ' +
              ' '.join(f'{i/SR*24:.1f}' for i in ev[:12]))
