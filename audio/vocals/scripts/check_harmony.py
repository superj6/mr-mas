"""Objective checks: chroma (which pitch classes sound), level over time, click detector."""
import sys, os, glob; sys.path.insert(0, os.path.dirname(__file__))
from vlib import *
import librosa
PC = ['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B']
def check(p, t0=0.15, t1=2.4):
    y, _ = sf.read(p); m = y.mean(1)
    x = soxr.resample(m, SR, 22050)
    C = np.abs(librosa.cqt(x, sr=22050, hop_length=256, fmin=librosa.note_to_hz('C2'), n_bins=72, bins_per_octave=12))
    t = librosa.times_like(C, sr=22050, hop_length=256)
    sel = (t > t0) & (t < t1)
    pcs = (C[:, sel] ** 2).mean(1).reshape(6, 12).sum(0)
    pcs = 10 * np.log10(pcs / pcs.max() + 1e-12)
    order = np.argsort(-pcs)
    top = ' '.join(f"{PC[i]}:{pcs[i]:.0f}" for i in order[:7])
    env = [20 * np.log10(np.sqrt(np.mean(m[int(a * SR):int((a + 0.25) * SR)] ** 2)) + 1e-9) for a in np.arange(0, len(m) / SR - 0.01, 0.25)]
    hp = np.diff(m, 2); z = np.abs(hp) / (np.median(np.abs(hp)) + 1e-9)
    clicks = int(np.sum(z > 400))
    print(f"{os.path.basename(p):52s} pcs[{top}]\n   env(dB/0.25s): {' '.join(f'{e:.0f}' for e in env)}  clicks:{clicks}")
for p in sys.argv[1:]:
    check(p)
