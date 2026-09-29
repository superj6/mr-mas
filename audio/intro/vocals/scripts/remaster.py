"""Re-level every delivered WAV to -14 LUFS-I / -1 dBTP (idempotent) and refresh its MP3."""
import os, sys, glob; sys.path.insert(0, os.path.dirname(__file__))
from vlib import *
targets = {'reel': -16.0}
for p in sorted(glob.glob(os.path.join(ROOT, '*', '**', '*.wav'), recursive=True)):
    rel = os.path.relpath(p, ROOT)[:-4]
    if rel.startswith('_work') or '/placed/' in rel or rel.startswith('scripts'):
        continue
    y, _ = sf.read(p); y = y.T
    tgt = targets.get(rel.split('/')[0], -14.0)
    l0, t0 = lufs(y), true_peak_db(y)
    if abs(l0 - tgt) <= 0.1 and t0 <= -1.0 and os.path.exists(p[:-4] + '.mp3'):
        continue
    print('remaster', rel, round(l0, 2), round(t0, 2))
    export(y, rel, target=tgt)
