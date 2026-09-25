"""Verify cold-open takes: pause length, total length, F0 contour of 'side' (harvest)."""
import sys, os, json; sys.path.insert(0, os.path.dirname(__file__))
from vlib import *
import pyworld as pw
info = json.load(open(os.path.join(ROOT, 'vo', 'mas_coldopen_word_timings.json')))
for name, d in info.items():
    y, _ = sf.read(os.path.join(ROOT, f'vo/mas_coldopen_{name}.wav')); y = y.mean(1)
    regs = active_regions(y, thr_db=-38, min_gap=0.12)
    gaps = [round((regs[i+1][0]-regs[i][1])/SR, 3) for i in range(len(regs)-1)]
    side = [w for w in d['words'] if w['word'] == 'side'][0]
    t0, t1 = side['in_s'] - 1.0, side['out_s'] - 1.0
    f0, t = pw.harvest(np.ascontiguousarray(y), SR, f0_floor=50, f0_ceil=400, frame_period=5)
    e = 20*np.log10(rms_env(y, 240)+1e-9); ei = np.minimum((t*SR/240).astype(int), len(e)-1)
    m = (t > t0 + 0.09) & (t < t1) & (f0 > 0) & (e[ei] > e.max() - 26)
    fv = f0[m]; k = max(3, len(fv)//3)
    print(f"{name:9s} speech {regs[0][0]/SR:.3f}-{regs[-1][1]/SR:.3f}s (f{24+regs[0][0]/SR*24:.0f}-f{24+regs[-1][1]/SR*24:.0f})  gaps {gaps}  "
          f"side f0 {np.median(fv[:k]):.0f}->{np.median(fv[-k:]):.0f} Hz ({12*np.log2(np.median(fv[-k:])/np.median(fv[:k])):+.1f} st, range {fv.min():.0f}-{fv.max():.0f})  lufs {d['lufs']} tp {d['true_peak']}")
