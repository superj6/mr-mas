"""OUTRO B · Ep1's final outro (v3): the keyframes sheet, two key stills and the readability QA, all taken from the
ENCODED mp4.

  audio/.venv-theme/bin/python studio/src/dev/outro/b/tools/sheets.py "$SC"

Needs, in $SC (tools/render.sh makes them): dec/%04d.png (every frame of out/ep01/outro/outro-b-v3.mp4, decoded),
native/ (the Node preview's exact 480x270 frames pv-ep1-f010, f050, f080, f128, f212) and check-ep1.json (the
preview's pixel checks).
Writes to out/ep01/outro/: outro-b-v3-keyframes.png, outro-b-v3-key-credits.png (o128), outro-b-v3-key-moth.png
(o212), and qa/ (full-size and 480x270 crops of every toast line, 480x270 frames, qa.json).
"""
import os  # noqa: E402  (phase 1: the project root is found at run time, docs/ORGANIZATION-PLAN.md §4)
import sys  # noqa: E402


def _repo():
    for start in (os.path.dirname(os.path.abspath(__file__)), os.getcwd()):
        d = start
        while True:
            if os.path.exists(os.path.join(d, '.mrmas-root')):
                return d
            if d == os.path.dirname(d):
                break
            d = os.path.dirname(d)
    sys.exit('MR. MAS: no .mrmas-root above this script or the cwd; set MRMAS_ROOT')


REPO = os.environ.get('MRMAS_ROOT') or _repo()
import json
import os
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = REPO
SC = sys.argv[1]
OUT = os.path.join(ROOT, 'out/ep01/outro')
QA = os.path.join(OUT, 'qa')
os.makedirs(QA, exist_ok=True)
FPS = 24
OUT_F = 225          # Ep1's outro (3 bars + the stinger's 3 beats, cut on 4.4); a plain week is 180
TOTAL = OUT_F + 18
FONT = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
FONTB = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
MONO = '/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf'
BG = (22, 24, 30)
INK = (225, 226, 230)
DIM = (150, 155, 168)
ACC = (63, 202, 203)


def font(size, bold=False, mono=False):
    return ImageFont.truetype(MONO if mono else (FONTB if bold else FONT), size)


def dec(f):
    """frame f (0-based; = the outro frame) of the encoded mp4, 1920x1080 RGB"""
    return Image.open(os.path.join(SC, 'dec', f'{f + 1:04d}.png')).convert('RGB')


def small(im):
    """the 480x270 check: a box (area-average) reduction of the encoded frame"""
    return im.resize((480, 270), Image.BOX)


def bb(o):
    b = o // 60 + 1
    beat = (o % 60) // 15 + 1
    k = o % 15
    return f'{b}.{beat}' + (f'+{k}f' if k else '')


def label_for(o):
    return f'o{o} · {o / FPS:.2f} s · {bb(o)}'


n_dec = len([n for n in os.listdir(os.path.join(SC, 'dec')) if n.endswith('.png')])
assert n_dec == TOTAL, (n_dec, TOTAL)
chk = json.load(open(os.path.join(SC, 'check-ep1.json')))

# ================================================================== the two key stills (full size, untouched frames)
dec(128).save(os.path.join(OUT, 'outro-b-v3-key-credits.png'))
dec(212).save(os.path.join(OUT, 'outro-b-v3-key-moth.png'))

# ================================================================== the keyframes sheet (8 numbered frames + the bars)
SHEET = [
    (10, '1.1 · cut to black; the Orb up; the header posts'),
    (42, '1.3 · the scan: tokens ahead, credits as type behind'),
    (80, '2.2 · the knee: both credit chips landed (2.1, 2.2)'),
    (128, '3.1 · the verdict (chime) lights the lens: the lamp'),
    (158, '3.3 · the moth, drawn to the lamp, loops the lens'),
    (172, '3.4+ · it tumbles off; the iris looks where it fell'),
    (192, '4.1+ · landed ON the Orb; the Orb still looks down-right'),
    (212, '4.3 · the eye, rolled up (4.2), narrows on it; cut 4.4'),
]
COLS = 4
TW, TH = 468, 263
PAD = 16
HEAD = 64
CAP = 44
GRID_H = 150
READ_H = 110
W = PAD + COLS * (TW + PAD)
rows_n = -(-len(SHEET) // COLS)
H = HEAD + rows_n * (TH + CAP + PAD) + GRID_H + READ_H + PAD
sheet = Image.new('RGB', (W, H), BG)
d = ImageDraw.Draw(sheet)
d.text((PAD, 14), 'MR. MAS · Ep1 outro · B, "the Orb\'s verdict" · v3 (the final)', font=font(24, True), fill=INK)
d.text((PAD, 42), f'{OUT_F} f / {OUT_F / FPS} s to the cut (3 bars at 96 BPM + 3 beats: the moth) + 18 f of black while the fifth releases = '
       f'{TOTAL} f / {TOTAL / FPS} s · a plain week (no moth) 180 f / 7.5 s · frames from the encoded mp4 · no terms line, no pointer',
       font=font(14), fill=DIM)
for k, (o, cap) in enumerate(SHEET):
    x = PAD + (k % COLS) * (TW + PAD)
    y = HEAD + (k // COLS) * (TH + CAP + PAD)
    sheet.paste(dec(o).resize((TW, TH), Image.BOX), (x, y))
    d.rectangle([x + TW - 34, y, x + TW, y + 30], fill=(0, 0, 0))
    d.text((x + TW - 26, y + 3), str(k + 1), font=font(20, True), fill=ACC)
    d.text((x, y + TH + 5), label_for(o), font=font(13, mono=True), fill=ACC)
    d.text((x, y + TH + 23), cap, font=font(13), fill=INK)
gy = HEAD + rows_n * (TH + CAP + PAD) + 8
gx0, gx1 = PAD, W - PAD
px = lambda f: gx0 + (gx1 - gx0) * f / TOTAL  # noqa: E731
spans = [(0, 60, 'bar 1 · the Orb wakes, the scan', (18, 60, 70)), (60, 120, 'bar 2 · the knee whole, the chips', (20, 90, 96)),
         (120, 180, 'bar 3 · verdict, lamp, moth at the lens', (24, 110, 112)), (180, 225, 'bar 4 (3 beats) · the moth on the Orb', (122, 81, 57)),
         (225, 243, 'black', (40, 40, 46))]
for a, b, name, col in spans:
    d.rectangle([px(a), gy, px(b) - 2, gy + 34], fill=col)
    d.text((px(a) + 6, gy + 9), name, font=font(13, True), fill=INK)
d.rectangle([px(9), gy + 40, px(225) - 2, gy + 54], fill=(63, 202, 203))
d.text((px(9) + 6, gy + 40), 'the toast (mr. mas + the file, the credits, the verdict): o9 to the cut', font=font(11, True), fill=(10, 20, 24))
d.rectangle([px(130), gy + 40, px(225) - 2, gy + 54], fill=(122, 81, 57))
d.text((px(130) + 4, gy + 40), 'the moth o130-o224 (on the Orb from o183)', font=font(11, True), fill=(240, 232, 207))
ticks = [(0, 'o0 cut · F4 · drone'), (9, 'o9 header posts'), (15, 'o15 servo'), (30, 'o30-54 scan'), (60, 'o60 chip: art · script ...'),
         (75, 'o75 chip: prompt'), (90, 'o90-112 iris narrows'), (120, 'o120 verdict · chime · lamp'), (130, 'o130 moth in'),
         (135, 'o135 F5->C6'), (165, 'o165 bump · flinch'), (171, 'o171 iris after it'), (183, 'o183 lands on the Orb'),
         (195, 'o195 eye rolls up'), (210, 'o210 narrows'), (217, 'o217 twitch'), (225, 'o225 cut')]
for k, (f, t) in enumerate(ticks):
    x = px(f)
    r = k % 4
    d.line([x, gy + 58, x, gy + 68 + r * 13], fill=DIM, width=1)
    d.text((x + 3, gy + 60 + r * 13), t, font=font(11), fill=DIM)
for k, (f, _) in enumerate(SHEET):
    x = px(f)
    d.ellipse([x - 9, gy - 20, x + 9, gy - 2], fill=(0, 0, 0), outline=ACC)
    d.text((x - 4, gy - 19), str(k + 1), font=font(12, True), fill=ACC)
# the read-time lane (from the Node preview's pixel check): each toast row's legible span to the cut, and one reader
# reading the toast in order at 16 chars/s (each row starts when it is legible and the previous one is read)
ry = gy + GRID_H - 30
d.text((PAD, ry), 'READ TIME (measured on the rendered pixels): light bar = the row is legible; dark = one reader reading the toast in order at 16 chars/s',
       font=font(12, True), fill=INK)
fin = next(x for x in chk['toastInOrder'] if x['cps'] == 16)['finishes']
t0 = 0.0
for k, r in enumerate(chk['toast']):
    yy = ry + 20 + k * 17
    a0 = r['legibleFrom']
    d.rectangle([px(a0), yy, px(OUT_F) - 2, yy + 12], fill=(40, 96, 102))
    st = max(t0, r['legibleFrom'])
    d.rectangle([px(st), yy + 3, px(fin[k]), yy + 9], fill=(12, 30, 34))
    t0 = fin[k]
    lab = f"{r['line']}  ({r['chars']} ch · on {r['seconds']} s)"
    d.text((px(OUT_F) - 8 - d.textlength(lab, font=font(11, mono=True)), yy - 1), lab, font=font(11, mono=True), fill=(10, 20, 24))
io = {x['cps']: x for x in chk['toastInOrder']}
d.text((PAD, ry + 20 + 4 * 17 + 2),
       f"the whole toast ({chk['toastChars']} ch) read in order by one reader: 16 cps finishes {io[16]['marginFrames'] / 24:.2f} s before the cut · "
       f"18 cps {io[18]['marginFrames'] / 24:.2f} s · 20 cps {io[20]['marginFrames'] / 24:.2f} s", font=font(11), fill=ACC)
sheet.save(os.path.join(OUT, 'outro-b-v3-keyframes.png'))

# ================================================================== readability QA, from the encoded mp4
boxes = [(t['line'], tuple(t['box']), 128) for t in chk['toast']]
boxes.append((chk['toast'][1]['line'] + '  (o50: resolved scan type, before its chip)', tuple(chk['toast'][1]['box']), 50))
boxes.append((chk['toast'][0]['line'] + '  (o10: the header as it posts)', tuple(chk['toast'][0]['box']), 10))
boxes.append((chk['toast'][2]['line'] + '  (o80: its chip landed)', tuple(chk['toast'][2]['box']), 80))
boxes.append((chk['toast'][1]['line'] + '  (o212: the last beat)', tuple(chk['toast'][1]['box']), 212))
mb = chk['moth']['rest']['box']
boxes.append(('the moth at rest on the Orb, lit by the rolled-up eye (o212)', (mb[0] - 4, mb[1] - 3, mb[2] + 4, mb[3] + 14), 212))
report = dict(source='out/ep01/outro/outro-b-v3.mp4 (decoded)', method=(
    'Each text region of the ENCODED frame, box-reduced to 480x270, is compared with the exact native frame from the '
    'Node preview: mean and max absolute RGB error over the region, and the luminance contrast of ink vs ground '
    'measured in the encode. Full-size and 480x270 crops are saved for eyes.'), regions=[], timing=chk['toast'],
    chips=chk['chips'], moth=chk['moth'], toast_read_in_order=chk['toastInOrder'], per_line_ok=chk['perLineOk'])
strips_full, strips_small = [], []
for name, (x0, y0, x1, y1), f in boxes:
    full = dec(f)
    sm = np.asarray(small(full)).astype(int)
    nat = np.asarray(Image.open(os.path.join(SC, 'native', f'pv-ep1-f{f:03d}.png')).convert('RGB')).astype(int)
    a = sm[y0:y1 + 1, x0:x1 + 1]
    b = nat[y0:y1 + 1, x0:x1 + 1]
    err = np.abs(a - b)
    # ground = the commonest native colour inside the region; ink = the commonest colour that differs from it in
    # luminance by > 30/255 (the type). Their luminance is then measured IN THE ENCODE at the same pixels.
    lumf = lambda v: 0.2126 * v[..., 0] + 0.7152 * v[..., 1] + 0.0722 * v[..., 2]  # noqa: E731
    inner = (slice(2, -2), slice(2, -2))
    bi, ai = b[inner], a[inner]
    keys = bi[..., 0] * 65536 + bi[..., 1] * 256 + bi[..., 2]
    vals, counts = np.unique(keys, return_counts=True)
    order = vals[np.argsort(-counts)]
    ground = order[0]
    gl = lumf(np.array([(ground >> 16) & 255, (ground >> 8) & 255, ground & 255], dtype=float))
    inkc = next((v for v in order[1:] if abs(lumf(np.array([(v >> 16) & 255, (v >> 8) & 255, v & 255], dtype=float)) - gl) > 30), None)

    def rl(v):
        v = v / 255.0
        return np.where(v <= 0.04045, v / 12.92, ((v + 0.055) / 1.055) ** 2.4)
    la = lumf(ai.astype(float))
    Li = float(rl(np.median(la[keys == inkc]))) if inkc is not None else 0.0
    Lg = float(rl(np.median(la[keys == ground])))
    contrast = (max(Li, Lg) + 0.05) / (min(Li, Lg) + 0.05)
    report['regions'].append(dict(text=name, frame=f, box_native=[x0, y0, x1, y1], mean_abs_err=round(float(err.mean()), 2),
                                  max_abs_err=int(err.max()), encoded_contrast=round(float(contrast), 1)))
    strips_full.append((name, full.crop((x0 * 4, y0 * 4, (x1 + 1) * 4, (y1 + 1) * 4))))
    strips_small.append((name, small(full).crop((x0, y0, x1 + 1, y1 + 1))))


def stack(strips, scale, path):
    ims = [(n, s.resize((s.width * scale, s.height * scale), Image.NEAREST)) for n, s in strips]
    w = max(i.width for _, i in ims) + 20
    h = sum(i.height + 26 for _, i in ims) + 10
    out = Image.new('RGB', (w, h), BG)
    dd = ImageDraw.Draw(out)
    y = 6
    for n, i in ims:
        dd.text((10, y), n, font=font(13), fill=DIM)
        out.paste(i, (10, y + 18))
        y += i.height + 26
    out.save(path)


stack(strips_full, 1, os.path.join(QA, 'text-crops-full-1080p.png'))
stack(strips_small, 3, os.path.join(QA, 'text-crops-480x270-x3.png'))
for f in (10, 42, 50, 80, 128, 158, 172, 192, 212):
    small(dec(f)).save(os.path.join(QA, f'frame-480x270-o{f}.png'))
# the text regions only (the moth crop has no type: its contrast is not a text measure)
text_regions = [r for r in report['regions'] if not r['text'].startswith('the moth')]
report['ok'] = bool(chk['ok'] and all(r['max_abs_err'] <= 24 and r['encoded_contrast'] >= 4.5 for r in text_regions) and chk['perLineOk'])
json.dump(report, open(os.path.join(QA, 'qa.json'), 'w'), indent=1)
print(json.dumps(dict(ok=report['ok'], regions=[(r['text'][:40], r['mean_abs_err'], r['max_abs_err'], r['encoded_contrast']) for r in report['regions']]), indent=0))
