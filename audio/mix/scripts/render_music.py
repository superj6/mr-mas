"""Re-render the theme agent's four variations with bar 9 replaced by the v2.1 roll call.

Uses the theme agent's score + engine read-only (imported from audio/theme); everything this
script writes lands in audio/mix/.  Output per variation:
  mix/music/theme-<V>-rollcall.wav/.mp3   music-only reference master (-14 LUFS / -1 dBTP)
  mix/music/midi/theme-<V>-rollcall.mid

usage: .venv-mix/bin/python scripts/render_music.py V1 [V2 V3 V4]
"""
import importlib
import json
import os
import sys
import time

import numpy as np
import soundfile as sf

THEME = '/home/jgon/project/art/mrmas/audio/theme'
MIX = '/home/jgon/project/art/mrmas/audio/mix'
sys.path.insert(0, THEME)
sys.path.insert(0, os.path.join(MIX, 'scripts'))

import engine.sampler as _sampler           # noqa: E402
_sampler.CACHE = os.path.join(MIX, 'cache')  # never write into the theme agent's cache

from engine.core import SR, N               # noqa: E402
from engine.render import render_score      # noqa: E402
from engine.export import write_midi, mp3   # noqa: E402
from engine.mix import master_gain, lufs, true_peak   # noqa: E402
import rollcall                              # noqa: E402

NAMES = {'V1': 'V1-chipchamber', 'V2': 'V2-orchestralnoir', 'V3': 'V3-pixelswing', 'V4': 'V4-pianopixels'}


def build(v):
    t0 = time.time()
    mod = importlib.import_module(f'score.{v.lower()}')
    mod.slot = rollcall.ROLLCALL[v]          # build() looks slot() up at call time
    sc = mod.build()
    sc.mute_window = None                    # v2.1: no "music fired" mute any more
    sc.macro = rollcall.bar9_macro(sc.macro, rollcall.BAR9_TRIM[v])
    for tr in sc.tracks.values():
        if tr.pedal:
            tr.pedal = rollcall.strip_pedal(tr.pedal)
    print(f'[{v}] {len(sc.notes)} notes', flush=True)
    stems = render_score(sc, verbose=False)
    order = list(sc.stems)
    pre = sum(stems[s] for s in order).astype(np.float32)
    # per-stem RMS inside bar 9 for the QA log
    def rms(x):
        return round(float(20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-12)), 1)
    bars = {s: [rms(stems[s][:, k * 120000:(k + 1) * 120000]) for k in range(12)] for s in order
            if np.abs(stems[s]).max() > 1e-6}
    g = master_gain(pre, target_lufs=-14.0, ceiling_db=-1.0, comp=sc.meta.get('comp') or dict(thresh_db=-20, ratio=1.8))
    m = (pre * g[None]).astype(np.float32)
    tp = true_peak(m)
    if tp > 10 ** (-1 / 20):
        m *= 10 ** (-1 / 20) / tp * 0.995
    os.makedirs(f'{MIX}/music/midi', exist_ok=True)
    wav = f'{MIX}/music/theme-{NAMES[v]}-rollcall.wav'
    sf.write(wav, m.T, SR, subtype='PCM_24')
    mp3(wav, wav.replace('.wav', '.mp3'), kbps=256)
    write_midi(sc.notes, f'{MIX}/music/midi/theme-{NAMES[v]}-rollcall.mid')
    info = dict(variation=v, lufs=round(lufs(m), 2), true_peak_dbtp=round(20 * np.log10(true_peak(m)), 2),
                seconds=round(time.time() - t0, 1), stem_rms_dbfs_per_bar=bars)
    print(f'[{v}] done {info}', flush=True)
    return info


if __name__ == '__main__':
    out = {}
    p = f'{MIX}/qa/music_render.json'
    if os.path.exists(p):
        out = json.load(open(p))
    for v in sys.argv[1:]:
        out[v] = build(v)
        json.dump(out, open(p, 'w'), indent=1)
