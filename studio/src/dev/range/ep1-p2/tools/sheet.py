#!/usr/bin/env python3
"""range E1-P2: sheets, key stills and measures, all pulled from the ENCODED mp4s (never the renderer's own PNGs).

  ../audio/.venv-theme/bin/python sheet.py sheet   <mp4> <A|B> <out-sheet.png> <out-blind.png>   # labelled contact sheet + uncaptioned blind sheet
  ../audio/.venv-theme/bin/python sheet.py keys    <mp4> <A|B> <outdir>                           # the key stills, full size
  ../audio/.venv-theme/bin/python sheet.py frames  <mp4> <outdir> f1 f2 ...                       # review frames: full size + 480x270
  ../audio/.venv-theme/bin/python sheet.py measure <mp4> <A|B> <out.json>                         # holds, the grade, the room
"""
import json
import os
import subprocess
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFont

FF = '/home/jgon/project/art/mrmas/studio/node_modules/@remotion/compositor-linux-x64-gnu'
ENV = dict(os.environ, LD_LIBRARY_PATH=FF)
# the screen at output resolution (ots.ts SCR x4) and the film under the title strip
SCR = (600, 56, 1056, 592)
TITLE_H = 44

BEATS = {
    'A': [(10, 'the film, on 1s'), (40, 'the super set'), (71, 'last frame on 1s'), (86, 'the ramp: on 2s'),
          (104, 'on 4s'), (116, 'on 8s'), (121, 'the strip of stills'), (125, 'eye-light sliding in'),
          (130, 'eye-light landed'), (142, 'the caption types'), (180, 'the caption holds'), (196, '[2S] iris on the monitor'),
          (212, 'iris back on Mas'), (244, 'the slot whirs; the rail'), (263, 'last frame')],
    'B': [(10, 'the film, on 1s'), (40, 'the super set'), (71, 'last frame of the film'), (72, 'the break: three stills'),
          (77, 'eye-light sliding in'), (82, 'eye-light landed'), (94, 'the caption types'), (130, 'the caption holds'),
          (148, '[2S] iris on the monitor'), (164, 'iris back on Mas'), (196, 'the slot whirs; the rail'), (215, 'last frame')],
}
KEYS = {
    'A': [(40, 'the-film'), (170, 'exposed'), (230, 'two-shot')],
    'B': [(40, 'the-film'), (122, 'exposed'), (182, 'two-shot')],
}


def grab(mp4, f, out):
    subprocess.run([f'{FF}/ffmpeg', '-loglevel', 'error', '-y', '-ss', f'{max(0.0, (f - 0.1) / 24):.4f}', '-i', mp4, '-frames:v', '1', out], check=True, env=ENV)


def font(sz, bold=False):
    try:
        return ImageFont.truetype(f'/usr/share/fonts/truetype/dejavu/DejaVuSans{"-Bold" if bold else ""}.ttf', sz)
    except OSError:
        return ImageFont.load_default()


def sheet(mp4, ver, out, blind):
    tmp = out + '.tmp.png'
    beats = BEATS[ver]
    w, h, cols = 480, 270, 4
    rows = (len(beats) + cols - 1) // cols
    S = Image.new('RGB', (cols * w + (cols + 1) * 8, rows * (h + 26) + 8 + 40), (16, 17, 22))
    Bl = Image.new('RGB', (cols * w + (cols + 1) * 8, rows * (h + 8) + 8), (16, 17, 22))
    d = ImageDraw.Draw(S)
    name = 'A (the ramp)' if ver == 'A' else 'B (the break)'
    d.text((10, 10), f'MR. MAS · range E1-P2 · 1.H WHAT THE QUACK · {name} · frames from the encoded mp4, shown at 480x270', fill=(220, 222, 230), font=font(18, True))
    for i, (f, label) in enumerate(beats):
        grab(mp4, f, tmp)
        im = Image.open(tmp).convert('RGB').resize((w, h), Image.LANCZOS)
        x, y = 8 + (i % cols) * (w + 8), 40 + (i // cols) * (h + 26)
        S.paste(im, (x, y))
        d.text((x + 2, y + h + 5), f'p{f:03d}  {label}', fill=(200, 202, 210), font=font(14))
        Bl.paste(im, (8 + (i % cols) * (w + 8), 8 + (i // cols) * (h + 8)))
    os.remove(tmp)
    S.save(out)
    Bl.save(blind)
    print('wrote', out, blind)


def keys(mp4, ver, outdir):
    os.makedirs(outdir, exist_ok=True)
    stem = 'ep1-p2' if ver == 'A' else 'ep1-p2-b'
    for k, (f, label) in enumerate(KEYS[ver], 1):
        p = os.path.join(outdir, f'{stem}-key-{k}-{label}-p{f:03d}.png')
        grab(mp4, f, p)
        print('wrote', p)


def frames(mp4, outdir, fs):
    os.makedirs(outdir, exist_ok=True)
    for f in fs:
        p = os.path.join(outdir, f'enc{f:03d}.png')
        grab(mp4, f, p)
        Image.open(p).convert('RGB').resize((480, 270), Image.LANCZOS).save(os.path.join(outdir, f'enc{f:03d}-small.png'))
    print('wrote', len(fs), 'frames to', outdir)


def s2l(v):
    v = v / 255.0
    return np.where(v <= 0.04045, v / 12.92, ((v + 0.055) / 1.055) ** 2.4)


def all_frames(mp4, w=1920, h=1080):
    raw = subprocess.run([f'{FF}/ffmpeg', '-loglevel', 'error', '-i', mp4, '-f', 'image2pipe', '-c:v', 'rawvideo', '-pix_fmt', 'rgb24', '-'],
                         check=True, env=ENV, capture_output=True).stdout
    return np.frombuffer(raw, np.uint8).reshape(-1, h, w, 3)


def measure(mp4, ver, out):
    fr = all_frames(mp4)
    x, y, w, h = SCR
    film = fr[:, y + TITLE_H:y + h, x:x + w].astype(np.int16)
    # 1) the holds: does picture change inside the film, frame to frame? (1 = a new drawing on that frame)
    # (the share of film pixels that moved by more than 6 levels: a new drawing moves >= 0.2 %, a hold ~0 %)
    diff = [0.0] + [float(np.mean(np.abs(film[i] - film[i - 1]) > 6)) for i in range(1, len(fr))]
    new = [1 if d > 0.001 else 0 for d in diff]
    film_end = 120 if ver == 'A' else 72
    runs, cur, n = [], new[1], 0
    for i in range(1, film_end):
        if new[i] == cur:
            n += 1
        else:
            runs.append((cur, n)); cur, n = new[i], 1
    runs.append((cur, n))
    holds = {}
    for a, b, lab in ([(1, 72, 'p1-71 (1s)'), (72, 96, 'p72-95 (2s)'), (96, 112, 'p96-111 (4s)'), (112, 120, 'p112-119 (8s)')] if ver == 'A' else [(1, 72, 'p1-71 (1s)')]):
        holds[lab] = int(sum(new[a:b]))
    # 2) the grade: the film inside the screen vs the room around it (OTS frames only)
    ots_end = 192 if ver == 'A' else 144
    Y = lambda im: 0.2126 * s2l(im[..., 0]) + 0.7152 * s2l(im[..., 1]) + 0.0722 * s2l(im[..., 2])
    fl = fr[:film_end:6, y + TITLE_H:y + h, x:x + w]
    lum_film = Y(fl.astype(np.float64))
    mask = np.ones((1080, 1920), bool)
    mask[y - 28:y + h + 44, x - 28:x + w + 28] = False     # the screen and bezel
    mask[812:, :] = False                                   # the band
    room = fr[:ots_end:12][:, mask].astype(np.float64)
    lum_room = Y(room)
    two = fr[ots_end::12][:, :812].astype(np.float64)
    lum_two = Y(two)
    enc = lambda l: float(np.where(l <= 0.0031308, l * 12.92, 1.055 * np.power(np.maximum(l, 0), 1 / 2.4) - 0.055))
    m = {
        'version': ver, 'frames': int(len(fr)),
        'new_drawings_in_the_film': holds,
        'film_rgb_max_8bit': int(fl.max()), 'film_rgb_p999_8bit': float(np.percentile(fl, 99.9)),
        'film_luma_max_display': round(enc(float(lum_film.max())), 3),
        'film_luma_mean_display': round(enc(float(lum_film.mean())), 3),
        'room_luma_mean_display_ots': round(enc(float(lum_room.mean())), 3),
        'two_shot_luma_mean_display': round(enc(float(lum_two.mean())), 3),
        'film_vs_room_stops': round(float(np.log2(lum_film.mean() / max(1e-6, lum_room.mean()))), 2),
        # the room as the monitor lights it: its brightest 1 % (the lit desk edge, the rims), i.e. the light the screen
        # throws, as the pixel room draws it. The film's mean within a stop of this = it doesn't out-glow its own light
        'room_lit_p99_display_ots': round(enc(float(np.percentile(lum_room, 99))), 3),
        'film_mean_vs_room_lit_stops': round(float(np.log2(lum_film.mean() / max(1e-6, np.percentile(lum_room, 99)))), 2),
        'film_share_of_pixels_over_75pct': round(float(np.mean(fl.max(axis=-1) > 191)), 4),
        'film_vs_two_shot_stops': round(float(np.log2(lum_film.mean() / max(1e-6, lum_two.mean()))), 2),
    }
    json.dump(m, open(out, 'w'), indent=1)
    print(json.dumps(m, indent=1))


if __name__ == '__main__':
    cmd = sys.argv[1]
    if cmd == 'sheet':
        sheet(sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5])
    elif cmd == 'keys':
        keys(sys.argv[2], sys.argv[3], sys.argv[4])
    elif cmd == 'frames':
        frames(sys.argv[2], sys.argv[3], [int(v) for v in sys.argv[4:]])
    elif cmd == 'measure':
        measure(sys.argv[2], sys.argv[3], sys.argv[4])
