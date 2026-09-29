#!/usr/bin/env python3
"""MR. MAS genvideo: the converter test bench. Re-runnable; writes to out/lookdev/genvideo/tests/.

Sources (no video model is wired in yet, so the bench uses our own smooth renders plus two SYNTHETIC stand-ins
for model output; they are labelled as such everywhere):
  satire    out/lookdev/structures/satire/scene.mp4  (smooth 2D shading, faces, glows; 960x540 @ 24)
  puppet    out/lookdev/structures/puppet/scene.mp4  (cut-out puppets, vignette gradients, a walk; 960x540 @ 24)
  stress    SYNTHETIC: satire degraded the way generated video misbehaves: 16 fps, 832x480, film grain,
            exposure flicker, sub-pixel jitter and a slow colour drift (tests the temporal filter + hysteresis)
  sky       SYNTHETIC: a procedural night-sky plate (1280x720 @ 30): gradient, drifting fBm clouds, stars, a slow
            pan, grain (tests the plate preset: pan-lock, on-auto, gradient dither, 30->24 conform)

For each source it renders NAIVE (area downscale + nearest colour, the usual "pixel filter") and the TUNED
preset, with the same holds, and writes: *-cmp.mp4 (before | after, 1920x540), *-1080p.mp4 (tuned only),
*-sheet.png (source | naive | tuned, plus boil heat maps), and results.json (stability metrics).

  audio/.venv-genvideo/bin/python studio/tools/genvideo/test_genvideo.py [--only satire,sky] [--jobs 2]
"""
from __future__ import annotations

import argparse
import json
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

import numpy as np
import cv2

sys.path.insert(0, str(Path(__file__).resolve().parent))
import gvlib as gv  # noqa: E402

OUT = gv.ROOT / 'out/lookdev/genvideo/tests'
SRC = OUT / 'src'
PUBLIC = gv.STUDIO / 'public/genvideo/_test'  # converted demo clips for src/dev/genvideo (gitignored)
PY = sys.executable
PIXELIZE = str(Path(__file__).resolve().parent / 'pixelize.py')


# ------------------------------------------------------------------------------------------------ synthetic sources
def make_stress(path: Path, seed=3):
    """satire -> 16 fps, 832x480, grain, flicker, jitter, colour drift (a stand-in for a 480p open-weights model)."""
    frames = [f for _, f in gv.read_frames(str(gv.ROOT / 'out/lookdev/structures/satire/scene.mp4'))]
    rng = np.random.default_rng(seed)
    n = int(len(frames) / 24 * 16)
    wr = gv.Mp4Writer(str(path), 832, 480, fps=16, crf=18)
    gain = 1.0
    for k in range(n):
        f = frames[min(len(frames) - 1, int(round(k * 24 / 16)))]
        im = cv2.resize(f, (832, 480), interpolation=cv2.INTER_AREA).astype(np.float32)
        jx, jy = rng.normal(0, 0.4, 2)
        im = cv2.warpAffine(im, np.float32([[1, 0, jx], [0, 1, jy]]), (832, 480), borderMode=cv2.BORDER_REFLECT)
        gain = 1.0 + 0.7 * (gain - 1.0) + rng.normal(0, 0.02)
        drift = k / max(1, n - 1)
        im = im * gain * np.array([1.0 + 0.06 * drift, 1.0, 1.0 - 0.06 * drift], np.float32)
        im += rng.normal(0, 4.0, im.shape).astype(np.float32)
        wr.write(np.clip(im, 0, 255).astype(np.uint8))
    wr.close()


def fbm(shape, rng, octaves=5, base=8):
    h, w = shape
    out = np.zeros(shape, np.float32)
    amp, tot = 1.0, 0.0
    for o in range(octaves):
        gh, gw = base * 2 ** o, int(base * 2 ** o * w / h)
        g = rng.random((gh, gw)).astype(np.float32)
        out += amp * cv2.resize(g, (w, h), interpolation=cv2.INTER_CUBIC)
        tot += amp
        amp *= 0.5
    return out / tot


def make_sky(path: Path, seed=5, W=1280, H=720, fps=30, secs=5.0):
    """A night-sky plate: violet-to-navy gradient, stars, two fBm cloud layers drifting, a slow pan right."""
    rng = np.random.default_rng(seed)
    WW = W + 400
    clouds_a = fbm((H, WW + 600), rng, 6, 3)
    clouds_b = fbm((H, WW + 600), rng, 5, 4)
    stars = np.zeros((H, WW), np.float32)
    ys, xs = rng.integers(0, int(H * 0.6), 180), rng.integers(0, WW, 180)
    stars[ys, xs] = rng.uniform(0.4, 1.0, 180)
    stars = cv2.GaussianBlur(stars, (0, 0), 0.8) * 6
    y = np.linspace(0, 1, H, dtype=np.float32)[:, None]
    top = np.array([10, 14, 40], np.float32)
    mid = np.array([38, 34, 84], np.float32)
    hor = np.array([150, 70, 90], np.float32)
    grad = np.where(y[..., None] < 0.6, top + (mid - top) * (y[..., None] / 0.6), mid + (hor - mid) * ((y[..., None] - 0.6) / 0.4))
    grad = np.broadcast_to(grad, (H, WW, 3)).astype(np.float32)
    n = int(secs * fps)
    wr = gv.Mp4Writer(str(path), W, H, fps=fps, crf=18)
    for k in range(n):
        t = k / fps
        cam = int(round(t * 60))  # pan: 60 px/s at 1280 = 0.94 native px per output frame
        ca = clouds_a[:, int(t * 12):int(t * 12) + WW]
        cb = clouds_b[:, int(t * 30):int(t * 30) + WW]
        dens = np.clip((0.55 * ca + 0.45 * cb - 0.48) * 3.2, 0, 1) * (1 - 0.6 * y)
        lit = np.array([120, 118, 150], np.float32)
        img = grad * (1 - dens[..., None]) + lit * dens[..., None] * (0.55 + 0.45 * ca[..., None])
        img = img + (stars * (1 - dens))[..., None] * 255
        frame = img[:, cam:cam + W]
        frame = frame + rng.normal(0, 3.0, frame.shape)
        wr.write(np.clip(frame, 0, 255).astype(np.uint8))
    wr.close()


# ------------------------------------------------------------------------------------------------ bench
TESTS = {
    'satire': dict(src='out/lookdev/structures/satire/scene.mp4', tuned=['--preset', 'default'], naive=['--preset', 'naive', '--on', '2'], frame=60, crop=(1000, 150, 1920, 700)),
    'puppet': dict(src='out/lookdev/structures/puppet/scene.mp4', tuned=['--preset', 'default'], naive=['--preset', 'naive', '--on', '2'], frame=90, crop=(700, 100, 1700, 800)),
    'stress': dict(src='out/lookdev/genvideo/tests/src/stress-satire-16fps.mp4', tuned=['--preset', 'default', '--match', 'out/lookdev/genvideo/tests/src/stress-ref.png'],
                   naive=['--preset', 'naive', '--on', '2'], frame=60, crop=(1000, 150, 1920, 700), synthetic=True),
    'sky': dict(src='out/lookdev/genvideo/tests/src/sky-plate-30fps.mp4', tuned=['--preset', 'plate', '--families', 'sky'],
                naive=['--preset', 'naive', '--on', 'auto', '--families', 'sky'], frame=60, crop=(0, 0, 960, 540), synthetic=True),
    # the round trip: our own pixel render (engine -> 960x540 H.264) back onto the grid; scored against the
    # engine's exact native frames (dump_room.ts). Stand-in for a clip conditioned on our frame (the match cut).
    'pixeladv': dict(src='out/lookdev/structures/pixeladv/scene.mp4', tuned=['--preset', 'pixel'], naive=['--preset', 'naive'],
                     frame=74, crop=(0, 0, 960, 540), roundtrip=True),
}


def roundtrip_score(name):
    """% of native pixels identical to the engine's own frame, per output frame (tuned conversion)."""
    import tempfile
    d = Path(tempfile.mkdtemp(prefix='gv-room-'))
    js = d / 'room.js'
    subprocess.run(['npx', 'esbuild', 'tools/genvideo/dump_room.ts', '--bundle', '--platform=node', f'--outfile={js}', '--log-level=warning'],
                   cwd=str(gv.STUDIO), check=True)
    subprocess.run(['node', str(js), str(d / 'room'), '120'], cwd=str(gv.STUDIO), check=True, capture_output=True)
    man = json.loads((PUBLIC / name / 'clip.json').read_text())
    same, close = [], []
    for k, di in enumerate(man['timeline']):
        a = cv2.imread(str(PUBLIC / name / man['drawings'][di]))
        b = cv2.imread(str(d / 'room' / f'r{k:04d}.png'))
        if a is None or b is None:
            continue
        same.append(float((a == b).all(-1).mean()))
        dE = np.sqrt(((gv.srgb8_to_oklab(a[..., ::-1]) - gv.srgb8_to_oklab(b[..., ::-1])) ** 2).sum(-1))
        close.append(float((dE < 0.02).mean()))
    # the master palette has near-twins (N2 #0d1020 / F0 #0b0f1f are dE 0.006 apart): H.264 colour shifts flip
    # between them, so 'visually identical' (OKLab dE < 0.02) is the meaningful score; exact is reported too
    return {'identical_px_pct_mean': round(100 * float(np.mean(same)), 2), 'identical_px_pct_min': round(100 * float(np.min(same)), 2),
            'visually_identical_px_pct_mean': round(100 * float(np.mean(close)), 2), 'visually_identical_px_pct_min': round(100 * float(np.min(close)), 2)}


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True, cwd=str(gv.ROOT))
    if r.returncode != 0:
        raise SystemExit(f'failed: {" ".join(cmd)}\n{r.stderr[-3000:]}')
    return json.loads(r.stdout.strip().splitlines()[-1])


def bench(name, t):
    res = {}
    for kind in ('naive', 'tuned'):
        tag = f'{name}-{kind}'
        cmd = [PY, PIXELIZE, t['src'], *t[kind], '--compare', str(OUT / f'{tag}-cmp.mp4'), '--stills', str(OUT / 'stills'),
               '--still-frames', str(t['frame']), '--tag', f'{tag}-', '--boilmap', str(OUT / 'stills' / f'{tag}-boil.png'), '--crf', '20']
        if kind == 'tuned':
            cmd += ['--out-mp4', str(OUT / f'{tag}-1080p.mp4'), '--out-frames', str(PUBLIC / name)]
        gv.log('run', ' '.join(cmd[2:]))
        res[kind] = run(cmd)
    sheet(name, t)
    return res


def label(img, text):
    img = img.copy()
    cv2.rectangle(img, (0, 0), (min(img.shape[1], 12 + 11 * len(text)), 30), (8, 10, 20), -1)
    cv2.putText(img, text, (8, 21), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (240, 240, 230), 1, cv2.LINE_AA)
    return img


def sheet(name, t):
    """source | naive | tuned (full frame at 960x540) over a 4x crop row and the boil heat maps."""
    st = OUT / 'stills'
    f = t['frame']
    rd = lambda p: cv2.imread(str(p))  # noqa: E731
    before = rd(st / f'{name}-tuned-f{f:03d}-before.png')
    if before.shape[1] != 1920:
        before = cv2.resize(before, (1920, 1080), interpolation=cv2.INTER_LINEAR)
    nv = rd(st / f'{name}-naive-f{f:03d}-after.png')
    tu = rd(st / f'{name}-tuned-f{f:03d}-after.png')
    x0, y0, x1, y1 = t['crop']
    sm = lambda im: cv2.resize(im, (640, 360), interpolation=cv2.INTER_AREA)  # noqa: E731
    cr = lambda im: cv2.resize(im[y0:y1, x0:x1], (640, int(640 * (y1 - y0) / (x1 - x0))), interpolation=cv2.INTER_NEAREST)  # noqa: E731
    syn = ' (SYNTHETIC stand-in)' if t.get('synthetic') else ''
    row1 = np.hstack([label(sm(before), f'{name}{syn}: source'), label(sm(nv), 'naive: area + nearest'), label(sm(tu), 'tuned')])
    row2 = np.hstack([label(cr(before), 'source (crop)'), label(cr(nv), 'naive (crop, 1 px = 4 px)'), label(cr(tu), 'tuned (crop)')])
    bn = rd(st / f'{name}-naive-boil.png')
    bt = rd(st / f'{name}-tuned-boil.png')
    info = np.full((360, 640, 3), 16, np.uint8)
    for i, line in enumerate(['boil heat maps: colour changes on', 'STATIC pixels over the clip', '(black = rock solid, bright = boils)']):
        cv2.putText(info, line, (20, 150 + 32 * i), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (220, 220, 210), 1, cv2.LINE_AA)
    row3 = np.hstack([info, label(sm(bn), 'naive: boil'), label(sm(bt), 'tuned: boil')])
    cv2.imwrite(str(OUT / f'{name}-sheet.png'), np.vstack([row1, row2, row3]), [cv2.IMWRITE_PNG_COMPRESSION, 9])


def table(results: dict) -> str:
    """results.json -> the README's Markdown table."""
    rows = ['| Source | Naive boil/s | Tuned boil/s | Naive flips | Tuned flips | Naive mc-boil % | Tuned mc-boil % | Notes |',
            '|---|---|---|---|---|---|---|---|']
    for name, r in results.items():
        n, t = r['naive'], r['tuned']
        note = 'SYNTHETIC stand-in' if r.get('synthetic') else ''
        if r.get('roundtrip_vs_engine'):
            rt = r['roundtrip_vs_engine']
            note = f"round trip vs engine: {rt['identical_px_pct_mean']}% exact, {rt.get('visually_identical_px_pct_mean', '?')}% visually identical (dE < 0.02)"
        gain = n['boil_per_s'] / max(t['boil_per_s'], 1e-9)
        rows.append(f"| `{name}` ({' '.join(r['tuned_args'][:2])}) | {n['boil_per_s']:.3f} | **{t['boil_per_s']:.3f}** ({gain:.0f}x less) | {n['flips_per_1k']:.1f} | "
                    f"**{t['flips_per_1k']:.2f}** | {n.get('mc_boil_pct', float('nan')):.2f} | **{t.get('mc_boil_pct', float('nan')):.2f}** | {note} |")
    return '\n'.join(rows)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--only', default=None)
    ap.add_argument('--jobs', type=int, default=2)
    ap.add_argument('--table', action='store_true', help='print results.json as the README table and exit')
    a = ap.parse_args()
    if a.table:
        print(table(json.loads((OUT / 'results.json').read_text())))
        return
    SRC.mkdir(parents=True, exist_ok=True)
    (OUT / 'stills').mkdir(parents=True, exist_ok=True)
    names = a.only.split(',') if a.only else list(TESTS)
    if 'stress' in names and not (SRC / 'stress-satire-16fps.mp4').exists():
        gv.log('making the synthetic stress clip')
        make_stress(SRC / 'stress-satire-16fps.mp4')
    if 'stress' in names and not (SRC / 'stress-ref.png').exists():
        # the "conditioning keyframe" for --match: the clean first frame of the original render
        _, f0 = next(gv.read_frames(str(gv.ROOT / 'out/lookdev/structures/satire/scene.mp4')))
        gv.save_png(SRC / 'stress-ref.png', f0)
    if 'sky' in names and not (SRC / 'sky-plate-30fps.mp4').exists():
        gv.log('making the synthetic sky plate')
        make_sky(SRC / 'sky-plate-30fps.mp4')
    resf = OUT / 'results.json'
    results = json.loads(resf.read_text()) if resf.exists() else {}
    with ThreadPoolExecutor(a.jobs) as ex:
        for name, r in zip(names, ex.map(lambda n: bench(n, TESTS[n]), names)):
            results[name] = {'source': TESTS[name]['src'], 'synthetic': bool(TESTS[name].get('synthetic')),
                             'naive_args': TESTS[name]['naive'], 'tuned_args': TESTS[name]['tuned'], **r}
            if TESTS[name].get('roundtrip'):
                results[name]['roundtrip_vs_engine'] = roundtrip_score(name)
                gv.log(f'{name} round trip: {results[name]["roundtrip_vs_engine"]}')
    resf.write_text(json.dumps(results, indent=1))
    for n in names:
        r = results[n]
        gv.log(f"{n:7s} naive boil {r['naive']['boil_per_s']:.4f}/s flips {r['naive']['flips_per_1k']:.2f}  |  tuned boil {r['tuned']['boil_per_s']:.4f}/s flips {r['tuned']['flips_per_1k']:.2f}")


if __name__ == '__main__':
    main()
