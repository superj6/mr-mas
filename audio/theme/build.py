"""Build one or more variations:  python build.py V1 [V2 ...] [--stems piano,chip]"""
import importlib
import json
import os
import sys
import time

import numpy as np
import soundfile as sf

sys.path.insert(0, os.path.dirname(__file__))
from engine.core import SR, N
from engine.render import render_score
from engine.export import master_and_export, write_midi

OUT = os.path.dirname(os.path.abspath(__file__))
FILES = {'V1': 'theme-V1-chipchamber', 'V2': 'theme-V2-orchestralnoir', 'V3': 'theme-V3-pixelswing',
         'V4': 'theme-V4-pianopixels'}


def build(v, only=None):
    t0 = time.time()
    mod = importlib.import_module(f'score.{v.lower()}')
    sc = mod.build()
    print(f'[{v}] {len(sc.notes)} notes', flush=True)
    stems = render_score(sc, only=only)
    base = FILES[v]
    master, g, info = master_and_export(stems, f'{OUT}/{base}.wav', f'{OUT}/stems', v,
                                        comp=sc.meta.get('comp'))
    write_midi(sc.notes, f'{OUT}/midi/{base}.mid')
    info['seconds'] = round(time.time() - t0, 1)
    info['gain_reduction_db_max'] = float(-20 * np.log10(g.min() / np.median(g)))
    print(f'[{v}] done', info, flush=True)
    return info


def build_motif():
    import soundfile as sf
    from engine.mix import master_gain, lufs, true_peak
    from engine.export import mp3
    sc = importlib.import_module('score.motif').build()
    stems = render_score(sc, verbose=False)
    n = int(12.0 * SR)
    mix = sum(stems.values())[:, :n]
    g = master_gain(mix, target_lufs=-14.0, ceiling_db=-1.0)
    y = (mix * g[None]).astype(np.float32)
    wav = f'{OUT}/cache/theme-motif-study.wav'
    sf.write(wav, y.T, SR, subtype='PCM_24')
    mp3(wav, f'{OUT}/theme-motif-study.mp3')
    write_midi(sc.notes, f'{OUT}/midi/theme-motif-study.mid')
    print('[motif] done', dict(lufs=lufs(y), tp=20 * np.log10(true_peak(y))))


if __name__ == '__main__':
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    for v in args:
        if v == 'motif':
            build_motif()
        else:
            build(v)
