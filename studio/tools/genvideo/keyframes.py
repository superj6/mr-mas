#!/usr/bin/env python3
"""MR. MAS genvideo: CONDITIONING EXPORTER. Export a shot of ours as inputs for an image-to-video model.

For a composition and a frame range it renders (through Remotion, so it is exactly our frame):
  start.png / end.png                  the frames as they air (1080p) - reference
  start-plate.png / end-plate.png      CLEAN PLATES (1080p): the render with {"genvideoPlate": true}, so every
                                       <PixelScene> shows only what draw() paints (no UI layer, no glyph layers,
                                       no palette switches). THE conditioning images (first / last frame).
  *-plate-soft.png                     the plate with the pixel grid melted (cubic up + a light blur): for models
                                       that fight hard 4x4 pixels (they then wobble the grid). pixelize.py puts
                                       the grid back either way; try both, keep what moves better.
  *-plate-<W>x<H>.png                  the plate at a model's native size (--model-size, repeatable)
  start-native.png                     the 480x270 truth; pixelize.py --match uses it to pin the clip's tone
  mask-*.png / mask-union.png          1080p motion masks, white = animate here (for motion-brush / inpaint models,
                                       and the same regions go to blitGen() when the clip comes back)
  guide.png                            layout guide: plate + native grid, UI band, masks, safe areas, labelled
  sheet.png                            one-glance contact sheet (start | end | masks | guide)
  ref.mp4                              (--ref-video) the shot itself (960x540 plate) as a motion reference for video-to-video
  keyframes.json                       frames, seconds, the colours on screen, the pixelize command, a prompt scaffold

  audio/.venv-genvideo/bin/python studio/tools/genvideo/keyframes.py \\
      --entry src/dev/pixeladv/entry.tsx --comp pixeladv-scene --start 0 --end 47 --shot room-sky \\
      --mask 'colors:N2,N3,N4@22,32,81,75' --layout adventure --ui-band fill

Masks (native 480x270 coordinates): 'rect:x,y,w,h', 'ellipse:cx,cy,rx,ry', 'colors:N2,N3@x,y,w,h' (pixels of those
master colours inside the rect: keys a sky / a window / a KEY colour), 'png:path' (any size, white = on), 'room'
(the adventure room above the verb band).
GUARDRAILS (show bible): prompts never name a real person or company and never ask for a likeness; describe our
designs. Outputs are only ever used after pixelize.py/glyphize.py (never photoreal on screen); audio from a model
is discarded (no generated voices).
"""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import subprocess
import sys
from pathlib import Path

import numpy as np
import cv2

sys.path.insert(0, str(Path(__file__).resolve().parent))
import gvlib as gv  # noqa: E402

BUNDLES = gv.STUDIO / 'out/genvideo-bundles'  # studio/out is gitignored


def sh(cmd, **kw):
    r = subprocess.run(cmd, cwd=str(gv.STUDIO), capture_output=True, text=True, **kw)
    if r.returncode != 0:
        raise SystemExit(f'failed: {" ".join(cmd)}\n{r.stdout[:1500]}\n{r.stderr[:3000]}')
    return r.stdout


def bundle(entry: str, reuse: str | None) -> str:
    if reuse:
        return str(Path(reuse).resolve())
    key = hashlib.sha1(entry.encode()).hexdigest()[:10]
    out = BUNDLES / f'{Path(entry).parent.name}-{key}'
    gv.log(f'bundling {entry} -> {out}')
    sh(['npx', 'remotion', 'bundle', entry, f'--out-dir={out}', '--log=error'])
    return str(out)


def comp_info(bundle_dir: str, comp: str):
    out = sh(['npx', 'remotion', 'compositions', bundle_dir])  # (--log=error would hide the table)
    for line in out.splitlines():
        m = re.match(r'^(\S+)\s+(\d+)\s+(\d+)x(\d+)\s+(\d+)\s', line.strip())
        if m and m.group(1) == comp:
            return {'fps': int(m.group(2)), 'w': int(m.group(3)), 'h': int(m.group(4)), 'frames': int(m.group(5))}
        m = re.match(r'^(\S+)\s+(\d+)x(\d+)\s+Still', line.strip())
        if m and m.group(1) == comp:
            return {'fps': 24, 'w': int(m.group(2)), 'h': int(m.group(3)), 'frames': 1}
    raise SystemExit(f'composition {comp} not found in {bundle_dir}:\n{out}')


def still(bundle_dir, comp, frame, path, plate=False):
    cmd = ['npx', 'remotion', 'still', bundle_dir, comp, str(path), f'--frame={frame}', '--scale=1', '--log=error']
    if plate:
        cmd.append('--props={"genvideoPlate":true}')
    sh(cmd)
    return cv2.cvtColor(cv2.imread(str(path)), cv2.COLOR_BGR2RGB)


def to_native(img: np.ndarray):
    """1080p pixel frame -> 480x270 (block top-left) + the share of 4x4 blocks that are not uniform (QC)."""
    h, w = img.shape[:2]
    k = w // gv.NATIVE_W
    nat = img[::k, ::k][:gv.NATIVE_H, :gv.NATIVE_W]
    up = gv.upscale(nat, k)[:h, :w]
    bad = (np.abs(up.astype(int) - img[:up.shape[0], :up.shape[1]].astype(int)).max(-1) > 2).reshape(h // k, k, w // k, k).any((1, 3)).mean()
    return nat, float(bad)


def parse_mask(spec: str, native_rgb: np.ndarray, pal: gv.Palette) -> np.ndarray:
    H, W = gv.NATIVE_H, gv.NATIVE_W
    m = np.zeros((H, W), np.uint8)
    kind, _, arg = spec.partition(':')
    if kind == 'room':
        m[:gv.UI_Y] = 255
    elif kind == 'rect':
        x, y, w, h = (int(v) for v in arg.split(','))
        m[max(0, y):y + h, max(0, x):x + w] = 255
    elif kind == 'ellipse':
        cx, cy, rx, ry = (float(v) for v in arg.split(','))
        yy, xx = np.mgrid[0:H, 0:W]
        m[(((xx + 0.5 - cx) / rx) ** 2 + ((yy + 0.5 - cy) / ry) ** 2) <= 1] = 255
    elif kind == 'colors':
        names, _, rect = arg.partition('@')
        cols = [pal.rgb[pal.names.index(n)] for n in names.split(',')]
        hit = np.zeros((H, W), bool)
        for c in cols:
            hit |= (native_rgb == c).all(-1)
        if rect:
            x, y, w, h = (int(v) for v in rect.split(','))
            box = np.zeros((H, W), bool)
            box[max(0, y):y + h, max(0, x):x + w] = True
            hit &= box
        m[hit] = 255
    elif kind == 'png':
        m = (gv.load_mask(arg) * 255).astype(np.uint8)
    else:
        raise SystemExit(f'unknown mask spec {spec!r}')
    return m


def soften(plate: np.ndarray) -> np.ndarray:
    nat, _ = to_native(plate)
    up = cv2.resize(nat, (plate.shape[1], plate.shape[0]), interpolation=cv2.INTER_CUBIC)
    return cv2.GaussianBlur(up, (0, 0), 1.6)


def guide(plate: np.ndarray, masks: list, ui_band: bool, title: str) -> np.ndarray:
    g = (plate.astype(np.float32) * 0.55).astype(np.uint8)
    H, W = g.shape[:2]
    k = W // gv.NATIVE_W
    # native grid every 8 art pixels (32 output px), major every 40 (the 480x270 in tenths... 12 x 6.75)
    for x in range(0, W, 8 * k):
        g[:, x] = np.maximum(g[:, x], 40 if x % (40 * k) else 90)
    for y in range(0, H, 8 * k):
        g[y, :] = np.maximum(g[y, :], 40 if y % (40 * k) else 90)
    # title-safe (90%) and action-safe (95%)
    for f, col in ((0.95, (120, 120, 120)), (0.90, (200, 200, 90))):
        mx, my = int(W * (1 - f) / 2), int(H * (1 - f) / 2)
        cv2.rectangle(g, (mx, my), (W - mx, H - my), col, 1)
    if ui_band:
        y0 = gv.UI_Y * k
        band = g[y0:].astype(np.float32)
        hatch = ((np.add.outer(np.arange(H - y0), np.arange(W)) // 12) % 2 == 0)[..., None]
        g[y0:] = np.where(hatch, band * 0.4 + np.array([80, 40, 40]) * 0.6, band * 0.4).astype(np.uint8)
        cv2.putText(g, 'UI BAND (y >= 203 native): the engine draws it; do not generate here', (24, y0 + 40), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (240, 200, 200), 2, cv2.LINE_AA)
    palette = [(80, 255, 255), (255, 120, 255), (255, 220, 80), (120, 255, 120)]
    for i, (spec, m) in enumerate(masks):
        big = gv.upscale(m[..., None], k)[..., 0]
        cnts, _ = cv2.findContours((big > 127).astype(np.uint8), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        cv2.drawContours(g, cnts, -1, palette[i % 4], 3)
        ys, xs = np.nonzero(big > 127)
        if len(xs):
            cv2.putText(g, f'MASK {i}: {spec}', (int(xs.min()) + 6, max(24, int(ys.min()) - 8)), cv2.FONT_HERSHEY_SIMPLEX, 0.8, palette[i % 4], 2, cv2.LINE_AA)
    cv2.putText(g, title, (24, 44), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (255, 255, 255), 2, cv2.LINE_AA)
    return g


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--entry', required=True, help='Remotion entry (relative to studio/), e.g. src/dev/pixeladv/entry.tsx')
    ap.add_argument('--comp', required=True, help='composition id')
    ap.add_argument('--start', type=int, default=0, help='first frame of the shot')
    ap.add_argument('--end', type=int, default=-1, help='last frame of the shot (-1 = the composition\'s last)')
    ap.add_argument('--shot', default=None, help='name (default: <comp>-<start>-<end>)')
    ap.add_argument('--out', default=None, help='default out/lookdev/genvideo/keyframes/<shot>')
    ap.add_argument('--mask', action='append', default=[], help='motion mask spec (repeatable); see the header')
    ap.add_argument('--layout', default='full', choices=['full', 'adventure'], help='adventure: room 480x203 + the verb band (guide marks it)')
    ap.add_argument('--ui-band', default='keep', choices=['keep', 'fill'], help='adventure layout: fill paints the verb band N0 in the plates')
    ap.add_argument('--model-size', action='append', default=[], help='extra plate sizes, e.g. 1280x720 (repeatable)')
    ap.add_argument('--ref-video', action='store_true', help='also render the shot (plate) as ref.mp4 at 960x540 (2x2 px blocks) for video-to-video')
    ap.add_argument('--prompt', default='', help='motion description to put in the prompt scaffold')
    ap.add_argument('--bundle', default=None, help='reuse an existing Remotion bundle folder')
    a = ap.parse_args(argv)

    bdir = bundle(a.entry, a.bundle)
    info = comp_info(bdir, a.comp)
    end = info['frames'] - 1 if a.end < 0 else min(a.end, info['frames'] - 1)
    start = max(0, min(a.start, end))
    shot = a.shot or f'{a.comp}-{start}-{end}'
    out = (Path(a.out) if a.out else gv.ROOT / 'out/lookdev/genvideo/keyframes' / shot).resolve()
    out.mkdir(parents=True, exist_ok=True)
    gv.log(f'{a.comp}: {info}; shot {start}..{end} -> {out}')
    pal = gv.load_palette()

    imgs = {}
    for tag, f in (('start', start), ('end', end)):
        imgs[tag] = still(bdir, a.comp, f, out / f'{tag}.png')
        plate = still(bdir, a.comp, f, out / f'{tag}-plate.png', plate=True)
        if a.layout == 'adventure' and a.ui_band == 'fill':
            plate[gv.UI_Y * (plate.shape[1] // gv.NATIVE_W):] = pal.rgb[pal.names.index('N0')]
            gv.save_png(out / f'{tag}-plate.png', plate)
        imgs[f'{tag}-plate'] = plate
        gv.save_png(out / f'{tag}-plate-soft.png', soften(plate))
        for ms in a.model_size:
            w, h = (int(v) for v in ms.lower().split('x'))
            gv.save_png(out / f'{tag}-plate-{w}x{h}.png', cv2.resize(plate, (w, h), interpolation=cv2.INTER_AREA))
    nat, bad = to_native(imgs['start-plate'])
    gv.save_png(out / 'start-native.png', nat)
    nat_end, _ = to_native(imgs['end-plate'])
    gv.save_png(out / 'end-native.png', nat_end)
    if bad > 0.002:
        gv.log(f'note: {bad:.1%} of 4x4 blocks are not uniform: not a pure 4x pixel frame (native export is approximate)')

    masks = []
    for spec in a.mask:
        m = np.maximum(parse_mask(spec, nat, pal), parse_mask(spec, nat_end, pal)) if spec.startswith('colors:') else parse_mask(spec, nat, pal)
        masks.append((spec, m))
    for i, (spec, m) in enumerate(masks):
        gv.save_png(out / f'mask-{i}-native.png', np.repeat(m[..., None], 3, -1))
        gv.save_png(out / f'mask-{i}.png', np.repeat(gv.upscale(m[..., None], 4), 3, -1))
    if masks:
        u = np.max(np.stack([m for _, m in masks]), 0)
        gv.save_png(out / 'mask-union.png', np.repeat(gv.upscale(u[..., None], 4), 3, -1))
    G = guide(imgs['start-plate'], masks, a.layout == 'adventure', f'{shot}: frames {start}-{end} ({(end - start + 1) / info["fps"]:.2f} s @ {info["fps"]})')
    gv.save_png(out / 'guide.png', G)

    # contact sheet
    sm = lambda im: cv2.resize(im, (640, 360), interpolation=cv2.INTER_AREA)  # noqa: E731
    tiles = [sm(imgs['start-plate']), sm(imgs['end-plate']), sm(G)]
    if masks:
        u = gv.upscale(np.max(np.stack([m for _, m in masks]), 0)[..., None], 4)[..., 0]
        tint = imgs['start-plate'].copy()
        tint[u < 128] = (tint[u < 128] * 0.25).astype(np.uint8)
        tiles.append(sm(tint))
    while len(tiles) % 2:
        tiles.append(np.zeros_like(tiles[0]))
    gv.save_png(out / 'sheet.png', np.vstack([np.hstack(tiles[i:i + 2]) for i in range(0, len(tiles), 2)]))

    if a.ref_video:
        sh(['npx', 'remotion', 'render', bdir, a.comp, str(out / 'ref.mp4'), f'--frames={start}-{end}', '--scale=0.5',
            '--props={"genvideoPlate":true}', '--concurrency=2', '--log=error'])

    # the colours on screen (for the prompt: "limited palette of ...")
    flat = nat.reshape(-1, 3)
    cols, cnt = np.unique(flat, axis=0, return_counts=True)
    order = np.argsort(-cnt)
    lut = {tuple(c): n for c, n in zip(pal.rgb.tolist(), pal.names)}
    on_screen = [{'hex': '#%02x%02x%02x' % tuple(cols[i]), 'name': lut.get(tuple(cols[i].tolist()), None), 'share': round(float(cnt[i]) / len(flat), 4)} for i in order[:24]]
    fams = sorted({pal.fam[pal.names.index(c['name'])] for c in on_screen if c['name']})
    secs = (end - start + 1) / info['fps']
    doc = {
        'shot': shot, 'entry': a.entry, 'composition': a.comp, 'fps': info['fps'], 'start': start, 'end': end,
        'frames': end - start + 1, 'seconds': round(secs, 3),
        'conditioning': {'first_frame': 'start-plate.png', 'last_frame': 'end-plate.png', 'soft_variants': ['start-plate-soft.png', 'end-plate-soft.png'],
                         'model_sizes': a.model_size, 'motion_masks': [f'mask-{i}.png' for i in range(len(masks))], 'ref_video': 'ref.mp4' if a.ref_video else None},
        'masks': [s for s, _ in masks], 'layout': a.layout, 'ui_band': a.ui_band,
        'colours_on_screen': on_screen, 'families_on_screen': ''.join(fams),
        'generate': {'length_s': round(secs + 0.5, 2), 'note': 'ask for ~0.5 s more than the shot: the head and tail get trimmed at conversion (--t-in)',
                     'fps': 'any (24 preferred); pixelize conforms to 24 and holds on 2s'},
        'pixelize': f'audio/.venv-genvideo/bin/python studio/tools/genvideo/pixelize.py <model-output.mp4> --match out/lookdev/genvideo/keyframes/{shot}/start-native.png '
                    f'--families {"".join(fams) or "all"} --duration {secs:.3f} --out-frames studio/public/genvideo/{shot} --out-mp4 out/lookdev/genvideo/{shot}-1080p.mp4',
        'prompt_scaffold': {
            'positive': f'2D pixel-art animation, limited night palette, the same drawing style and colours as the first frame, locked 4x4 pixel grid, '
                        f'hand-animated feel, subtle motion. {a.prompt}'.strip(),
            'negative': 'photorealistic, real person, celebrity likeness, face morphing, text, captions, watermark, logo, brand names, '
                        'camera shake, zoom, blur, film grain, lens flare, extra limbs',
            'rules': ['Never name a real person, company or product in a prompt; describe our design (e.g. "a young man in a grey hoodie with a cowlick").',
                      'Never ask for a likeness. Parody names and logos only, drawn by us, never generated.',
                      'Discard any generated audio. No generated voices.',
                      'The output is raw material: it goes on screen only after pixelize.py / glyphize.py.'],
        },
    }
    (out / 'keyframes.json').write_text(json.dumps(doc, indent=1))
    gv.log(f'wrote {out}')
    print(json.dumps({'out': str(out), 'frames': doc['frames'], 'seconds': doc['seconds'], 'masks': doc['masks']}))


if __name__ == '__main__':
    main()
