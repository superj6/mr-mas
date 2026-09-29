#!/usr/bin/env python
"""Build the reel TEMP BEDS: every show/reel/epNN.json -> audio/reel/epNN.wav (+ qa/epNN.json).

Re-run any time the writers change a reel; a reel is rebuilt only when its JSON, reelbed.py or the V1
theme files it samples have changed since its WAV was made (a content hash kept in qa/<key>.json).

  audio/.venv/bin/python audio/reel/build_all.py                 # every epNN.json that exists, 3 at a time
  audio/.venv/bin/python audio/reel/build_all.py ep04 ep07       # just these
  audio/.venv/bin/python audio/reel/build_all.py --force         # rebuild everything
  audio/.venv/bin/python audio/reel/build_all.py --all           # also other reel JSONs (ep01-full-part1 ...)
  audio/.venv/bin/python audio/reel/build_all.py --mux           # also mux out/season/reels/epNN.mp4 + WAV -> audio/reel/preview/
  audio/.venv/bin/python audio/reel/build_all.py --jobs 1        # one at a time (low memory)
"""
from __future__ import annotations

import argparse
import glob
import hashlib
import json
import os
import re
import subprocess
import sys
import time
from concurrent.futures import ProcessPoolExecutor, as_completed

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
REELS = os.path.join(ROOT, 'show', 'reel')
PICTURE = os.path.join(ROOT, 'out/season/reels')
PREVIEW = os.path.join(HERE, 'preview')
QA = os.path.join(HERE, 'qa')
FFMPEG_CANDIDATES = [os.path.join(ROOT, 'studio', 'node_modules', '@remotion', 'compositor-linux-x64-gnu', 'ffmpeg'),
                     'ffmpeg']
LONG_S = 400.0          # reels longer than this (the 1:1 full-episode animatics) render one at a time
sys.path.insert(0, HERE)


def inputs_hash(json_path):
    """Everything the audio depends on: the reel JSON, the renderer, and the V1 files it samples."""
    import reelbed
    h = hashlib.sha1()
    for p in (json_path, os.path.abspath(reelbed.__file__)):
        with open(p, 'rb') as fh:
            h.update(fh.read())
    for p in (reelbed.V1_MASTER, reelbed.V1_BRASS):
        st = os.stat(p)
        h.update(f'{os.path.basename(p)}:{st.st_size}:{int(st.st_mtime)}'.encode())
    return h.hexdigest()[:16]


def stale(json_path, force):
    key = os.path.splitext(os.path.basename(json_path))[0]
    wav, qp = os.path.join(HERE, f'{key}.wav'), os.path.join(QA, f'{key}.json')
    if force or not (os.path.exists(wav) and os.path.exists(qp)):
        return True
    try:
        return json.load(open(qp)).get('inputs_hash') != inputs_hash(json_path)
    except Exception:
        return True


def job(json_path):
    import reelbed
    key = os.path.splitext(os.path.basename(json_path))[0]
    ih = inputs_hash(json_path)                       # hashed before the render starts
    qp = os.path.join(QA, f'{key}.json')
    q = reelbed.render(json_path, os.path.join(HERE, f'{key}.wav'), qp)
    q['inputs_hash'] = ih
    with open(qp, 'w') as fh:
        json.dump(q, fh, indent=1)
    return q


def ffmpeg():
    for c in FFMPEG_CANDIDATES:
        try:
            subprocess.run([c, '-hide_banner', '-version'], capture_output=True, check=True)
            return c
        except Exception:
            continue
    return None


def mux(key):
    """Preview: the generator's picture (out/season/reels/<key>.mp4) with this bed as its audio."""
    mp4 = os.path.join(PICTURE, f'{key}.mp4')
    wav = os.path.join(HERE, f'{key}.wav')
    if not (os.path.exists(mp4) and os.path.exists(wav)):
        return None
    ff = ffmpeg()
    if not ff:
        print('  mux: no ffmpeg found, skipped')
        return None
    os.makedirs(PREVIEW, exist_ok=True)
    out = os.path.join(PREVIEW, f'{key}.mp4')
    subprocess.run([ff, '-y', '-loglevel', 'error', '-i', mp4, '-i', wav, '-map', '0:v:0', '-map', '1:a:0',
                    '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', out], check=True)
    return out


def main():
    ap = argparse.ArgumentParser(description='Build the reel temp beds.')
    ap.add_argument('only', nargs='*', help='reel keys to build (ep03, ep04 ...); default: all')
    ap.add_argument('--force', action='store_true', help='rebuild even if up to date')
    ap.add_argument('--all', action='store_true', help='also reel JSONs that are not epNN.json')
    ap.add_argument('--mux', action='store_true', help='mux out/season/reels/<key>.mp4 with the bed into audio/reel/preview/')
    ap.add_argument('--jobs', type=int, default=3, help='parallel renders (default 3; each needs ~1.5 GB)')
    a = ap.parse_args()

    files = sorted(glob.glob(os.path.join(REELS, '*.json')))
    strict = [f for f in files if re.fullmatch(r'ep\d\d', os.path.splitext(os.path.basename(f))[0])]
    todo = files if (a.all or a.only) else strict
    if a.only:
        want = {k.replace('.json', '') for k in a.only}
        todo = [f for f in todo if os.path.splitext(os.path.basename(f))[0] in want]
        missing = want - {os.path.splitext(os.path.basename(f))[0] for f in todo}
        if missing:
            print('no such reel JSON:', ', '.join(sorted(missing)))
    build = [f for f in todo if stale(f, a.force)]
    skip = [f for f in todo if f not in build]
    print(f'{len(todo)} reel(s): {len(build)} to build, {len(skip)} up to date')

    def length_s(f):
        import reelbed
        return reelbed.load_reel(f)['samples'] / reelbed.SR
    long_ = [f for f in build if length_s(f) > LONG_S]
    short = [f for f in build if f not in long_]
    t0 = time.time()
    failed = []
    if short:
        with ProcessPoolExecutor(max_workers=max(1, a.jobs)) as ex:
            futs = {ex.submit(job, f): f for f in short}
            for fu in as_completed(futs):
                try:
                    fu.result()
                except Exception as e:           # keep going; report at the end
                    failed.append((futs[fu], repr(e)))
                    print(f'FAILED {os.path.basename(futs[fu])}: {e!r}')
    for f in long_:
        try:
            job(f)
        except Exception as e:
            failed.append((f, repr(e)))
            print(f'FAILED {os.path.basename(f)}: {e!r}')

    # summary table from the QA files of everything in scope (built or up to date)
    rows = []
    for f in todo:
        key = os.path.splitext(os.path.basename(f))[0]
        qp = os.path.join(QA, f'{key}.json')
        if not os.path.exists(qp):
            continue
        q = json.load(open(qp))
        lo = q['loudness']
        rows.append(dict(key=key, seconds=q['seconds'], frames=q['frames'], beats=q['beats'],
                         bed_st_median=lo['bed_short_term_median'], bed_st_p5=lo['bed_short_term_p5'],
                         bed_st_p95=lo['bed_short_term_p95'], accents=len(lo['accent_momentary_max']),
                         accent_m_min=min(lo['accent_momentary_max']), accent_m_max=max(lo['accent_momentary_max']),
                         tp=lo['mix_true_peak_dbtp'], wav=f'audio/reel/{key}.wav'))
        if a.mux:
            out = mux(key)
            if out:
                rows[-1]['preview'] = os.path.relpath(out, ROOT)
    os.makedirs(QA, exist_ok=True)
    with open(os.path.join(QA, 'summary.json'), 'w') as fh:
        json.dump(dict(built=[os.path.basename(f) for f in build], failed=failed, reels=rows), fh, indent=1)
    print(f"\n{'reel':<18}{'length':>9}{'beats':>6}{'bed ST med [p5,p95]':>24}{'accents':>8}{'acc M':>14}{'TP':>7}")
    for r in rows:
        print(f"{r['key']:<18}{r['seconds']:>8.2f}s{r['beats']:>6}{r['bed_st_median']:>9.1f} [{r['bed_st_p5']:.1f}, "
              f"{r['bed_st_p95']:.1f}]{r['accents']:>8}{r['accent_m_min']:>7.1f}..{r['accent_m_max']:<5.1f}{r['tp']:>7.1f}"
              + (f"  {r['preview']}" if r.get('preview') else ''))
    print(f'\n{len(build)} built in {time.time() - t0:.0f} s' + (f', {len(failed)} FAILED' if failed else ''))
    sys.exit(1 if failed else 0)


if __name__ == '__main__':
    main()
