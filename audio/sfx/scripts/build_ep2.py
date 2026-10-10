"""Render Ep2 v1's new SFX-board entries (sounds_ep2.py) into audio/sfx/wav/, as NEW files only.

usage: audio/.venv-theme/bin/python audio/sfx/scripts/build_ep2.py [--only PREFIX,...] [--no-qa] [--reel] [--list]
       (heavy: run it through ops/heavy.sh)

  writes  audio/sfx/wav/<id>.wav (48 kHz / 24-bit, git-ignored like the rest of the board's masters), each normalized as
          the board's own build.py does (-14 LUFS, -1 dBTP); audio/sfx/manifest-ep2.json (the Ep2 rows, the board's row
          format); audio/sfx/qa/spectro_ep2_NN.png/.txt (spectrogram sheets); with --reel, audio/sfx/reel/reel_ep2.mp3 and
          reel_ep2_index.json (every new sound back to back, beds trimmed to 6 s, for an ear)
  never   touches the Ep1 board: refuses any id that audio/sfx/manifest.json already lists (those files are Ep1's and
          stay byte-identical), never rewrites manifest.json or board.json, never writes an MP3 preview into mp3/
"""
from __future__ import annotations

import argparse
import json
import math
import os
import subprocess
import sys

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import build as B  # noqa: E402  (imports the Ep1 board's sounds too; only sounds_ep2's are rendered here)
import sounds_ep2  # noqa: E402,F401
from dsp import SR, write_wav  # noqa: E402
from registry import REG  # noqa: E402

ROOT = B.ROOT                                   # audio/sfx
MAN_EP1 = os.path.join(ROOT, 'manifest.json')
MAN_EP2 = os.path.join(ROOT, 'manifest-ep2.json')


def ep2_entries():
    return [e for e in REG if getattr(e['fn'], '__module__', '') == 'sounds_ep2']


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--only', default='')
    ap.add_argument('--no-qa', action='store_true')
    ap.add_argument('--reel', action='store_true')
    ap.add_argument('--list', action='store_true')
    a = ap.parse_args()
    ents = ep2_entries()
    ids = [e['id'] for e in ents]
    dup = {i for i in ids if ids.count(i) > 1}
    if dup:
        raise SystemExit(f'duplicate ids: {sorted(dup)}')
    ep1 = {r['id'] for r in json.load(open(MAN_EP1))}
    clash = sorted(set(ids) & ep1)
    if clash:
        raise SystemExit(f'these ids are on the Ep1 board already (its files stay untouched): {clash}')
    if a.list:
        for e in ents:
            print(f"{e['id']:<28} {'loop' if e['loop'] else '    '} {e['description'][:100]}")
        print(f'{len(ents)} entries')
        return
    only = [s for s in a.only.split(',') if s]
    old = {}
    if os.path.exists(MAN_EP2):
        old = {r['id']: r for r in json.load(open(MAN_EP2))}
    recs, tiles = [], []
    for e in ents:
        if only and not any(e['id'].startswith(p) for p in only):
            if e['id'] in old:
                recs.append(old[e['id']])
            continue
        rec, y = B.render_one(e, mp3=False)
        rec.pop('_render_s', None)
        rec['episode'] = 'ep02-v1'
        rec['builder'] = 'audio/sfx/scripts/build_ep2.py (sounds_ep2.py)'
        recs.append(rec)
        tiles.append((e['id'], y))
        print(f"{rec['id']:<28} {rec['duration']:>6.2f}s  I={rec['levels']['lufsIntegrated']:>6}  Mmax={rec['levels']['lufsMomentaryMax']:>6}  "
              f"TP={rec['levels']['truePeakDb']:>6}  {rec.get('measuredPeak') or ''}", flush=True)
    order = {e['id']: i for i, e in enumerate(ents)}
    recs.sort(key=lambda r: order.get(r['id'], 1e9))
    json.dump(recs, open(MAN_EP2, 'w'), indent=1, ensure_ascii=False)
    print(f'{len(recs)} rows -> {os.path.relpath(MAN_EP2, os.path.dirname(os.path.dirname(ROOT)))}')
    if not a.no_qa and tiles and not only:              # the sheets show the whole set (an --only run keeps them)
        qd = os.path.join(ROOT, 'qa')
        os.makedirs(qd, exist_ok=True)
        cols = 4
        for page in range(0, len(tiles), 24):
            chunk = tiles[page:page + 24]
            rows = math.ceil(len(chunk) / cols)
            th, tw = 140 + 14, 300
            sheet = np.full((rows * th, cols * tw + (cols - 1) * 6, 3), 18, np.uint8)
            for i, (name, y) in enumerate(chunk):
                r_, c_ = divmod(i, cols)
                tile = B.spectro_tile(y)
                sheet[r_ * th + 14:r_ * th + 14 + tile.shape[0], c_ * (tw + 6):c_ * (tw + 6) + tw] = tile
            B.png_write(os.path.join(qd, f'spectro_ep2_{page // 24 + 1:02d}.png'), sheet)
            with open(os.path.join(qd, f'spectro_ep2_{page // 24 + 1:02d}.txt'), 'w') as fh:
                fh.write('\n'.join(f'{i // cols},{i % cols}: {n}' for i, (n, _) in enumerate(chunk)) + '\n')
    if a.reel:
        import soundfile as sf
        parts, index, t = [], [], 0.0
        gap = np.zeros((int(0.5 * SR), 2))
        for r in recs:
            x, sr = sf.read(os.path.join(ROOT, r['file']), always_2d=True)
            if r.get('loop'):
                x = x[: int(6 * SR)].copy()
                k = int(0.3 * SR)
                x[-k:] *= np.linspace(1, 0, k)[:, None]
            index.append({'id': r['id'], 'at': round(t, 2), 'seconds': round(len(x) / SR, 2)})
            parts += [x, gap]
            t += len(x) / SR + 0.5
        reel = np.concatenate(parts) * 10 ** (-3 / 20)
        wav = os.path.join(ROOT, 'reel', '_reel_ep2.wav')
        write_wav(wav, reel)
        mp3 = os.path.join(ROOT, 'reel', 'reel_ep2.mp3')
        subprocess.run([B.dsp.FFMPEG, '-y', '-loglevel', 'error', '-i', wav, '-codec:a', 'libmp3lame', '-b:a', '96k', mp3], check=True)
        os.remove(wav)
        json.dump({'file': 'reel/reel_ep2.mp3', 'note': 'every Ep2 v1 sound back to back (beds: their first 6 s), 0.5 s apart, -3 dB; '
                   'each at its board level (-14 LUFS), not its mix level', 'sounds': index},
                  open(os.path.join(ROOT, 'reel', 'reel_ep2_index.json'), 'w'), indent=1)
        print(f'reel: {os.path.relpath(mp3, ROOT)} ({t / 60:.1f} min)')


if __name__ == '__main__':
    main()
