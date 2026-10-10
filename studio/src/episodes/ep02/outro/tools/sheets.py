"""Ep2's outro: the keyframes sheet, the two key stills and the readability QA, all from the ENCODED mp4 (a shorter copy
of Ep1's outro B sheets.py, studio/src/dev/outro/b/tools/sheets.py, read, never edited).

  audio/.venv-theme/bin/python studio/src/episodes/ep02/outro/tools/sheets.py "$SC"

Needs, in $SC (tools/render.sh makes them): dec/%04d.png (every frame of out/ep02/v1/outro/outro-b-ep2.mp4, decoded),
native/pv-ep2-f*.png (the Node preview's exact 480x270 frames) and check-ep2.json (the preview's text checks).
Writes to out/ep02/v1/outro/: outro-b-ep2-keyframes.png, outro-b-ep2-key-credits.png (o170, page 1),
outro-b-ep2-key-cast.png (o330, page 2), and qa/ (the text crops at 1080p and 480x270, qa.json).
"""
import json
import os
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '../../../../../..'))
SC = sys.argv[1]
OUT = os.path.join(ROOT, 'out/ep02/v1/outro')
QA = os.path.join(OUT, 'qa')
os.makedirs(QA, exist_ok=True)
FPS, OUT_F, TOTAL = 24, 345, 360
FONT = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
FONTB = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
MONO = '/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf'
BG, INK, DIM, ACC = (22, 24, 30), (225, 226, 230), (150, 155, 168), (63, 202, 203)


def font(size, bold=False, mono=False):
    return ImageFont.truetype(MONO if mono else (FONTB if bold else FONT), size)


def dec(f):
    return Image.open(os.path.join(SC, 'dec', f'{f + 1:04d}.png')).convert('RGB')


def small(im):
    return im.resize((480, 270), Image.BOX)


def bb(o):
    b, beat, k = o // 60 + 1, (o % 60) // 15 + 1, o % 15
    return f'{b}.{beat}' + (f'+{k}f' if k else '')


n_dec = len([n for n in os.listdir(os.path.join(SC, 'dec')) if n.endswith('.png')])
assert n_dec == TOTAL, (n_dec, TOTAL)
chk = json.load(open(os.path.join(SC, 'check-ep2.json')))
mix = json.load(open(os.path.join(SC, 'mix-report.json')))

dec(170).save(os.path.join(OUT, 'outro-b-ep2-key-credits.png'))
dec(330).save(os.path.join(OUT, 'outro-b-ep2-key-cast.png'))

SHEET = [
    (10, '1.1 · cut to black; the Orb up; the header posts'),
    (42, '1.3 · the scan: tokens ahead, credits as type behind'),
    (80, '2.2 · the knee: the voice\'s flat line; both credit chips'),
    (128, '3.1 · the verdict (chime) lights the lens'),
    (183, '4.1 · the page turns: the toast steps down'),
    (200, '4.1+ · the second scan: the voice cast'),
    (260, '5.2 · the tools chips landed (5.1, 5.2)'),
    (330, '6.2 · the cast page held; the cut on 6.4'),
]
COLS, TW, TH, PAD, HEAD, CAP = 4, 468, 263, 16, 64, 44
W = PAD + COLS * (TW + PAD)
rows_n = -(-len(SHEET) // COLS)
GRID_H = 110
H = HEAD + rows_n * (TH + CAP + PAD) + GRID_H + PAD
sheet = Image.new('RGB', (W, H), BG)
d = ImageDraw.Draw(sheet)
d.text((PAD, 14), 'MR. MAS · Ep2 outro · B, "the Orb\'s verdict" in Ep1\'s format, with Ep2\'s cast and tools · v1', font=font(24, True), fill=INK)
d.text((PAD, 42), f'{OUT_F} f / {OUT_F / FPS} s to the cut (6 bars at 96 BPM, cut on 6.4) + 15 f of black while the fifth releases = '
       f'{TOTAL} f / {TOTAL / FPS} s · frames from the encoded mp4 · no terms line, no pointer, no stinger', font=font(14), fill=DIM)
for k, (o, cap) in enumerate(SHEET):
    x = PAD + (k % COLS) * (TW + PAD)
    y = HEAD + (k // COLS) * (TH + CAP + PAD)
    sheet.paste(dec(o).resize((TW, TH), Image.BOX), (x, y))
    d.rectangle([x + TW - 34, y, x + TW, y + 30], fill=(0, 0, 0))
    d.text((x + TW - 26, y + 3), str(k + 1), font=font(20, True), fill=ACC)
    d.text((x, y + TH + 5), f'o{o} · {o / FPS:.2f} s · {bb(o)}', font=font(13, mono=True), fill=ACC)
    d.text((x, y + TH + 23), cap, font=font(13), fill=INK)
gy = HEAD + rows_n * (TH + CAP + PAD) + 8
px = lambda f: PAD + (W - 2 * PAD) * f / TOTAL  # noqa: E731
spans = [(0, 60, 'bar 1 · the Orb wakes, the scan'), (60, 120, 'bar 2 · the knee: voice, then celesta + chip'),
         (120, 180, 'bar 3 · the verdict, the lamp'), (180, 240, 'bar 4 · the page turns, the second scan'),
         (240, 300, 'bar 5 · the tools chips'), (300, 345, 'bar 6 · held; cut 6.4'), (345, 360, 'black')]
for i, (a, b, name) in enumerate(spans):
    d.rectangle([px(a), gy, px(b) - 2, gy + 34], fill=[(18, 60, 70), (20, 90, 96), (24, 110, 112), (40, 80, 90), (30, 70, 80), (25, 60, 70), (40, 40, 46)][i])
    d.text((px(a) + 6, gy + 9), name, font=font(12, True), fill=INK)
io = {(x['page'], x['cps']): x for x in chk['inOrder']}
bars = mix['bars_mix_lufs']
d.text((PAD, gy + 44), 'page 1 read in order at 16 cps finishes {:.1f} s before the page turns · each row on screen >= 0.25 s + 0.05 s a character: {}'.format(
    io[(1, 16)]['marginFrames'] / 24, 'yes' if chk['perLineOk'] else 'NO'), font=font(12), fill=ACC)
d.text((PAD, gy + 62), 'page 2 ({} characters) holds {:.1f} s from fully resolved: a credits page, read by pausing; read in order it needs {:.0f} s at 16 cps'.format(
    io[(2, 16)]['chars'], (OUT_F - max(r['legibleFrom'] for r in chk['rows'] if r['page'] == 2)) / FPS, io[(2, 16)]['chars'] / 16), font=font(12), fill=DIM)
d.text((PAD, gy + 80), 'mix: page 1 {} LUFS (Ep1 -15.29) · page 2 {} · file {} · true peak {} dBTP · bars (I / M max): {}'.format(
    mix['target']['measured_page1'], mix['page2_o180_345_lufs'], mix['mix_lufs'], mix['mix_true_peak_dbtp'],
    ' · '.join(f"{k[4:]} {v['integrated']}/{v['momentary_max']}" for k, v in bars.items())), font=font(12), fill=DIM)
sheet.save(os.path.join(OUT, 'outro-b-ep2-keyframes.png'))

# ================================================================== readability QA, from the encoded mp4
rep = dict(source='out/ep02/v1/outro/outro-b-ep2.mp4 (decoded)', method=(
    'Each text row of the ENCODED frame (page 1 at o170, page 2 at o330), box-reduced to 480x270, against the exact native '
    'frame from the Node preview: mean and max absolute RGB error over the row, and the luminance contrast of its ink vs its '
    'ground measured in the encode.'), rows=[], checks=chk)
crops_full, crops_small = [], []
lumf = lambda v: 0.2126 * v[..., 0] + 0.7152 * v[..., 1] + 0.0722 * v[..., 2]  # noqa: E731


def rl(v):
    v = v / 255.0
    return np.where(v <= 0.04045, v / 12.92, ((v + 0.055) / 1.055) ** 2.4)


for r in chk['rows']:
    f = 170 if r['page'] == 1 else 330
    x0, y0, x1, y1 = r['box']
    full = dec(f)
    a = np.asarray(small(full)).astype(int)[y0:y1 + 1, x0:x1 + 1]
    nat = np.asarray(Image.open(os.path.join(SC, 'native', f'pv-ep2-f{f:03d}.png')).convert('RGB')).astype(int)[y0:y1 + 1, x0:x1 + 1]
    err = np.abs(a - nat)
    # the contrast inside the row (2 px in from its box: a chip's black keyline and rule are not its type's ground)
    na, aa = nat[2:-2, 2:-2], a[2:-2, 2:-2]
    keys = na[..., 0] * 65536 + na[..., 1] * 256 + na[..., 2]
    vals, counts = np.unique(keys, return_counts=True)
    order = vals[np.argsort(-counts)]
    ground = order[0]
    gl = lumf(np.array([(ground >> 16) & 255, (ground >> 8) & 255, ground & 255], dtype=float))
    ink = next((v for v in order[1:] if abs(lumf(np.array([(v >> 16) & 255, (v >> 8) & 255, v & 255], dtype=float)) - gl) > 30), None)
    la = lumf(aa.astype(float))
    Li = float(rl(np.median(la[keys == ink]))) if ink is not None else 0.0
    Lg = float(rl(np.median(la[keys == ground])))
    contrast = (max(Li, Lg) + 0.05) / (min(Li, Lg) + 0.05)
    rep['rows'].append(dict(line=r['line'], page=r['page'], frame=f, box=r['box'], mean_abs_err=round(float(err.mean()), 2),
                            max_abs_err=int(err.max()), encoded_contrast=round(float(contrast), 1), seconds=r['seconds']))
    crops_full.append((f"p{r['page']} {r['line']}", full.crop((x0 * 4, y0 * 4, (x1 + 1) * 4, (y1 + 1) * 4))))
    crops_small.append((f"p{r['page']} {r['line']}", small(full).crop((x0, y0, x1 + 1, y1 + 1))))


def stack(strips, scale, path):
    ims = [(n, s.resize((s.width * scale, s.height * scale), Image.NEAREST)) for n, s in strips]
    w = max(i.width for _, i in ims) + 20
    h = sum(i.height + 24 for _, i in ims) + 10
    out = Image.new('RGB', (w, h), BG)
    dd = ImageDraw.Draw(out)
    y = 6
    for n, i in ims:
        dd.text((10, y), n, font=font(12), fill=DIM)
        out.paste(i, (10, y + 16))
        y += i.height + 24
    out.save(path)


stack(crops_full, 1, os.path.join(QA, 'text-crops-full-1080p.png'))
stack(crops_small, 3, os.path.join(QA, 'text-crops-480x270-x3.png'))
rep['ok'] = bool(chk['ok'] and all(r['max_abs_err'] <= 24 and r['encoded_contrast'] >= 4.5 for r in rep['rows']))
json.dump(rep, open(os.path.join(QA, 'qa.json'), 'w'), indent=1)
print(json.dumps(dict(ok=rep['ok'], worst_err=max(r['max_abs_err'] for r in rep['rows']),
                      min_contrast=min(r['encoded_contrast'] for r in rep['rows']), rows=len(rep['rows']))))
