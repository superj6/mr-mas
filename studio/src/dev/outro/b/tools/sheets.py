"""OUTRO B · stills, sheets and the readability QA, all taken from the ENCODED mp4 (lookdev).

  audio/.venv-theme/bin/python studio/src/dev/outro/b/tools/sheets.py "$SC"

Needs, in $SC: dec/%04d.png (every frame of out/lookdev/outro/b/outro-b-ep1-1080p.mp4, decoded by render.sh),
stills/ (the outro-b-stills composition as PNGs: 0 = Ep10 o40, 1 = Ep10 o140, 2 = Ep6 o140, 3 = Ep6 o172), native/
(the Node preview's exact 480x270 frames for the QA frames: f12, o50, o134, o176) and check-ep1.json (the preview's
text checks).
Writes to out/lookdev/outro/b/: the three key stills, the keyframes sheet, the Ep10 still, the variants sheet, and
qa/ (full-size and 480x270 crops of every text line, and qa.json).
"""
import json
import os
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = '/home/jgon/project/art/mrmas'
SC = sys.argv[1]
OUT = os.path.join(ROOT, 'out/lookdev/outro/b')
QA = os.path.join(OUT, 'qa')
os.makedirs(QA, exist_ok=True)
PRE = 24
FPS = 24
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
    """file frame f (0-based) of the encoded mp4, 1920x1080 RGB"""
    return Image.open(os.path.join(SC, 'dec', f'{f + 1:04d}.png')).convert('RGB')


def small(im):
    """the 480x270 check: a box (area-average) reduction of the encoded frame"""
    return im.resize((480, 270), Image.BOX)


def bb(f):
    """bar.beat of an outro frame"""
    o = f - PRE
    if o < 0:
        return 'stand-in'
    b = o // 60 + 1
    beat = (o % 60) // 15 + 1
    k = o % 15
    return f'{b}.{beat}' + (f'+{k}f' if k else '')


def label_for(f):
    o = f - PRE
    return f'f{f} · o{o} · {f / FPS:.2f} s · {bb(f)}' if o >= 0 else f'f{f} · {f / FPS:.2f} s · stand-in'


# ================================================================== the three key stills (full size, from the mp4)
# The frame is untouched (1920x1080 from the encode); a 48 px caption bar under it carries the lookdev flags, which no
# longer sit on the outro's own frames (pass 4).
KEYS = [
    (PRE + 42, 'key1-scan', 'the scan: tokens in the cone, legible type behind it'),
    (PRE + 134, 'key2-verdict', 'the toast, full: the credits, the AI disclosure, the verdict on the viewer'),
    (PRE + 176, 'key3-moth', 'Ep1: the moth settled beside the final period; the Orb looks down at it (the last beat)'),
]
FLAGS = 'LOOKDEV · on-screen legal text: DRAFT, legal review pending · (creator) = the credit line, TBD'
for f, name, cap in KEYS:
    k = Image.new('RGB', (1920, 1080 + 48), BG)
    k.paste(dec(f), (0, 0))
    dk = ImageDraw.Draw(k)
    dk.text((16, 1080 + 13), f'Outro B · Ep1 · {label_for(f)} · {cap}', font=font(17), fill=INK)
    dk.text((1904 - dk.textlength(FLAGS, font=font(15)), 1080 + 15), FLAGS, font=font(15), fill=(207, 102, 39))
    k.save(os.path.join(OUT, f'outro-b-{name}.png'))

# ================================================================== the keyframes sheet (6 numbered frames + the bars)
SHEET = [
    (12, 'STAND-IN · the episode\'s last frame (cold-open MEDIUM, 1 s)'),
    (PRE + 10, '1.1 · cut to black; the band lights; the Orb is up, posts its scan target'),
    (PRE + 42, '1.3 · the scan: tokens in the cone; behind it the credits stay as type'),
    (PRE + 134, '3.1+ · chips landed on 2.1, 2.2; the verdict (chime at 3.1); F5 at 3.2'),
    (PRE + 148, 'Ep1 · the moth drops in, bumbles across the lit lens (stinger, inside)'),
    (PRE + 176, 'Ep1 · it settles beside the final period; the Orb looks down at it. Cut.'),
]
TW, TH = 624, 351
PAD = 16
HEAD = 64
CAP = 44
GRID_H = 150
W = PAD + 3 * (TW + PAD)
READ_H = 128
H = HEAD + 2 * (TH + CAP + PAD) + GRID_H + READ_H + PAD
sheet = Image.new('RGB', (W, H), BG)
d = ImageDraw.Draw(sheet)
d.text((PAD, 14), 'MR. MAS · OUTRO PROPOSAL B · "the Orb\'s verdict" · Ep1 mock-up', font=font(24, True), fill=INK)
d.text((PAD, 42), '180 f / 7.5 s (3 bars at 96), Ep1\'s moth stinger inside bar 3 · file 222 f: 1 s stand-in + outro + 0.75 s black · frames from the encoded mp4 · '
       'a visual outline, not a final · LEGAL TEXT: DRAFT, review pending', font=font(14), fill=DIM)
for k, (f, cap) in enumerate(SHEET):
    x = PAD + (k % 3) * (TW + PAD)
    y = HEAD + (k // 3) * (TH + CAP + PAD)
    sheet.paste(dec(f).resize((TW, TH), Image.BOX), (x, y))
    d.rectangle([x + TW - 34, y, x + TW, y + 30], fill=(0, 0, 0))
    d.text((x + TW - 26, y + 3), str(k + 1), font=font(20, True), fill=ACC)
    d.text((x, y + TH + 5), label_for(f), font=font(13, mono=True), fill=ACC)
    d.text((x, y + TH + 23), cap, font=font(14), fill=INK)
# the bar grid: stand-in | bar 1 | bar 2 | bar 3 | stinger (1.5 bars), with the events
gy = HEAD + 2 * (TH + CAP + PAD) + 8
gx0, gx1 = PAD, W - PAD
total = 222
px = lambda f: gx0 + (gx1 - gx0) * f / total  # noqa: E731
spans = [(0, 24, 'stand-in', (60, 64, 76)), (24, 84, 'bar 1 · the Orb wakes, the scan', (18, 60, 70)),
         (84, 144, 'bar 2 · the knee whole, the toast', (20, 90, 96)), (144, 204, 'bar 3 · the verdict · Ep1: the moth', (24, 110, 112)),
         (204, 222, 'black', (40, 40, 46))]
for a, b, name, col in spans:
    d.rectangle([px(a), gy, px(b) - 2, gy + 34], fill=col)
    d.text((px(a) + 6, gy + 9), name, font=font(13, True), fill=INK)
d.rectangle([px(24), gy + 40, px(204) - 2, gy + 54], fill=(207, 198, 168))
d.text((px(24) + 6, gy + 40), 'the band: terms line + pointer, never moves, never covered · o0-o179 = 7.5 s', font=font(11, True), fill=(20, 20, 20))
d.rectangle([px(33), gy + 60, px(204) - 2, gy + 74], fill=(63, 202, 203))
d.text((px(33) + 6, gy + 60), 'the toast (credits + AI disclosure + verdict): o9-o179', font=font(11, True), fill=(10, 20, 24))
d.rectangle([px(162), gy + 60, px(204) - 2, gy + 74], fill=(122, 81, 57))
d.text((px(162) + 4, gy + 60), 'Ep1 moth o138-179', font=font(11, True), fill=(240, 232, 207))
ticks = [(24, 'o0 cut · F4 · drone'), (33, 'o9 header posts'), (39, 'o15 servo'), (54, 'o30-54 scan'), (84, 'o60 chip 1'),
         (99, 'o75 chip 2'), (114, 'o90-112 iris narrows'), (144, 'o120 verdict + chime C7'), (159, 'o135 F5->C6'),
         (162, 'o138 moth in'), (174, 'o150 iris after it'), (184, 'o160 lands'), (189, 'o165 squint'), (204, 'o180 cut')]
for k, (f, t) in enumerate(ticks):
    x = px(f)
    r = k % 4
    d.line([x, gy + 78, x, gy + 88 + r * 13], fill=DIM, width=1)
    d.text((x + 3, gy + 80 + r * 13), t, font=font(11), fill=DIM)
for k, (f, _) in enumerate(SHEET):
    x = px(f)
    d.ellipse([x - 9, gy - 20, x + 9, gy - 2], fill=(0, 0, 0), outline=ACC)
    d.text((x - 4, gy - 19), str(k + 1), font=font(12, True), fill=ACC)
# the read-time lane (from the Node preview's pixel check): each toast row's legible span to the cut, and one reader
# reading the toast in order at 18 chars/s (each row starts when it is legible and the previous one is read)
chk1 = json.load(open(os.path.join(SC, 'check-ep1.json')))
ry = gy + GRID_H - 4
d.text((PAD, ry), 'READ TIME (measured on the rendered pixels): light bar = the row is legible; dark = one reader reading the toast in order at 18 chars/s',
       font=font(12, True), fill=INK)
fin = next(x for x in chk1['toastInOrder'] if x['cps'] == 18)['finishes']
t0 = 0.0
for k, r in enumerate(chk1['toast']):
    yy = ry + 20 + k * 17
    a0 = PRE + r['legibleFrom']
    d.rectangle([px(a0), yy, px(PRE + 180) - 2, yy + 12], fill=(40, 96, 102))
    st = max(t0, r['legibleFrom'])
    d.rectangle([px(PRE + st), yy + 3, px(PRE + fin[k]), yy + 9], fill=(12, 30, 34))
    t0 = fin[k]
    lab = r['line']
    d.text((px(a0) - 8 - d.textlength(lab, font=font(11, mono=True)), yy - 1), lab, font=font(11, mono=True), fill=DIM)
    d.text((px(PRE + 180) + 6, yy - 1), f"{r['chars']} ch · {r['seconds']} s", font=font(11, mono=True), fill=DIM)
io = {x['cps']: x for x in chk1['toastInOrder']}
wf = chk1['wholeFrame']
d.text((PAD, ry + 20 + 4 * 17 + 2),
       f"toast read in order: 16 cps {'fits' if io[16]['ok'] else 'runs %.2f s past the cut' % (-io[16]['marginFrames'] / 24)} · "
       f"18 cps fits with {io[18]['marginFrames'] / 24:.2f} s · 20 cps fits with {io[20]['marginFrames'] / 24:.2f} s  |  "
       f"band (terms + pointer, {wf['bandChars']} ch) on {wf['bandOnSeconds']} s, {wf['bandUncontestedAt18']} s of it free of the toast  |  "
       f"all {wf['totalChars']} ch once, one reader: {wf['secondsNeeded']['18']} s at 18 cps", font=font(11), fill=ACC)
sheet.save(os.path.join(OUT, 'outro-b-keyframes.png'))

# ================================================================== the Ep10 still and the variants sheet
st = [Image.open(os.path.join(SC, 'stills', n)).convert('RGB') for n in sorted(os.listdir(os.path.join(SC, 'stills'))) if n.endswith('.png')]
assert len(st) == 4, os.listdir(os.path.join(SC, 'stills'))
ep10_scan, ep10_verdict, ep6_verdict, ep6_end = st
ep1_verdict = dec(PRE + 134)
ep1_end = dec(PRE + 176)
ep1_scan = dec(PRE + 40)
# the extra still (1920x1080): how Ep10 differs, two half-size frames of the Ep10 state + the differences
e = Image.new('RGB', (1920, 1080), BG)
de = ImageDraw.Draw(e)
de.text((24, 18), 'Outro B · how an Ep10 version differs (ep1.9_pace.yaml)', font=font(30, True), fill=INK)
de.text((24, 58), 'Everything else is the Ep1 outro: the same band, the same terms line, the same two credit lines (only the filename changes). No moth (Ep1 only).',
        font=font(17), fill=DIM)
e.paste(ep10_scan.resize((936, 527), Image.BOX), (16, 100))
e.paste(ep10_verdict.resize((936, 527), Image.BOX), (968, 100))
de.text((16, 636), 'Ep10 · o40 (1.3): the toast is already posted while the scan is still running', font=font(19, True), fill=ACC)
de.text((968, 636), 'Ep10 · o140 (3.2): viewer: —  (it returns nothing)', font=font(19, True), fill=ACC)
diffs = [
    ('It already knew.', 'Both credit chips land at o31-32, as the cone opens, before it has swept them (Ep1: the scan resolves them, the chips land on 2.1, 2.2).'),
    ('The verdict.', 'viewer: —  The Orb returns nothing on the viewer. The chime still sounds at o120 (1-5 human ✓, 6 and 8 human (probably), 10 —).'),
    ('The score.', 'The verdict is F alone, no C (OST-BIBLE §2.4). Straight chip leads the knee; the felt answers a beat late (the Ep10 colour, §1.2).'),
    ('The tokens.', 'The GLYPH cell inside the cone is finer (1x2 native px, Ep1 2x3): the capability ladder (MM-13), coarse to fine.'),
    ('Never changes.', 'The band, the terms line and the pointer: the one thing on screen that is the same in all twelve episodes.'),
]
y = 690
for h, t in diffs:
    de.text((24, y), h, font=font(19, True), fill=INK)
    de.text((230, y), t, font=font(18), fill=INK)
    y += 40
de.text((24, 1040), 'Ep10 frames rendered by the outro-b-stills composition (Remotion, 1080p). Not in the mp4. LEGAL TEXT: DRAFT.',
        font=font(14), fill=DIM)
e.save(os.path.join(OUT, 'outro-b-ep10.png'))

# the variants sheet: the verdict drifting across the season (Ep1 / Ep6 / Ep10), Ep10's early fill, and the two endings
VW, VH = 624, 351
ROWH = VH + 56
V = Image.new('RGB', (PAD + 3 * (VW + PAD), 64 + 2 * ROWH + 166), BG)
dv = ImageDraw.Draw(V)
dv.text((PAD, 14), 'Outro B · the ladder: the verdict on the viewer drifts; the terms line never does', font=font(24, True), fill=INK)
dv.text((PAD, 42), 'Ep1 from the encoded mp4; Ep6 and Ep10 from the outro-b-stills composition (1080p renders).', font=font(14), fill=DIM)
cells = [
    (ep1_verdict, 'Ep1 · o134', 'viewer: human ✓ · score F5 -> C6 (Eps 1-5)'),
    (ep6_verdict, 'Ep6 · o140', 'viewer: human (probably) · F -> C with a Db grace (Eps 6, 8)'),
    (ep10_verdict, 'Ep10 · o140', 'viewer: — (returns nothing) · F alone'),
    (ep10_scan, 'Ep10 · o40', 'the chips are posted before the scan reaches them: it already knew'),
    (ep6_end, 'a plain week · o172', 'no stinger: the iris relaxes back to its toast (3.3), glint (3.4), cut'),
    (ep1_end, 'Ep1 · o176', 'the moth stinger, inside: the iris went down after it (3.3) and narrows (3.4)'),
]
for k, (im, h, t) in enumerate(cells):
    x = PAD + (k % 3) * (VW + PAD)
    y = 64 + (k // 3) * ROWH
    V.paste(im.resize((VW, VH), Image.BOX), (x, y))
    dv.text((x, y + VH + 6), h, font=font(15, True), fill=ACC)
    dv.text((x, y + VH + 28), t, font=font(14), fill=INK)
y = 64 + 2 * ROWH + 4
ladder = ['The rest of the season (OUTRO-PROPOSALS §3, B\'s Ep1 wording updated in pass 4):',
          'Ep1-5 viewer: human ✓   ·   Ep6, 8 viewer: human (probably)   ·   Ep7 no chime, no verdict: the toast stays open, the cursor blinking (THE HUG)',
          'Ep9 human (probably), and the toast replays its lines unprompted; verdict C -> F   ·   Ep10 viewer: —   ·   Ep11 human… probably?  F -> C, late',
          'Ep12 HUMAN: VERIFIED. SIDE: UNCLEAR.  the fifth held, no third; then the Orb reads the long credits over the song',
          'Ep1\'s stinger (the moth) sits INSIDE bar 3, the Orb still on screen, and replaces the plain week\'s glance. Ep4, 5, 12 stingers: not placed yet.']
for k, line in enumerate(ladder):
    dv.text((PAD, y + k * 30), line, font=font(16, bold=(k == 0), mono=(k > 0)), fill=INK if k else ACC)
V.save(os.path.join(OUT, 'outro-b-variants.png'))

# ================================================================== readability QA, from the encoded mp4
chk = json.load(open(os.path.join(SC, 'check-ep1.json')))
# native text boxes (x0, y0, x1, y1), from the scene layout (scene.ts TOAST, art.ts band)
boxes = [(t['line'], tuple(t['box']), PRE + 134) for t in chk['toast']]
boxes.append((chk['toast'][1]['line'] + '  (o50: resolved scan type, before its chip)', tuple(chk['toast'][1]['box']), PRE + 50))
boxes.append(('TERMS', (43, 218, 436, 229), PRE + 134))
boxes.append(('POINTER', (146, 235, 334, 246), PRE + 134))
mb = chk['mothBox']['box']
boxes.append(('TERMS end + the moth at rest (o176)', (300, min(214, mb[1] - 2), min(479, mb[2] + 3), max(229, mb[3] + 2)), PRE + 176))
boxes.append(('stand-in label (lookdev)', (2, 2, 368, 27), 12))
report = dict(source='out/lookdev/outro/b/outro-b-ep1-1080p.mp4 (decoded)', method=(
    'Each text region of the ENCODED frame, box-reduced to 480x270, is compared with the exact native frame from the '
    'Node preview: mean and max absolute RGB error over the region, and the luminance contrast of ink vs ground '
    'measured in the encode. Full-size and 480x270 crops are saved for eyes.'), regions=[], timing=chk['toast'],
    band=chk['band'], covered_frames=chk['covered'], moth=chk['mothBox'], moth_path=chk.get('mothPath'), toast_read_in_order=chk['toastInOrder'],
    whole_frame=chk['wholeFrame'], terms=chk['terms'], per_line_ok=chk['perLineOk'])
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
for f in (PRE + 10, PRE + 42, PRE + 50, PRE + 100, PRE + 134, PRE + 148, PRE + 176):
    small(dec(f)).save(os.path.join(QA, f'frame-480x270-o{f - PRE}.png'))
report['ok'] = bool(chk['ok'] and all(r['max_abs_err'] <= 24 and r['encoded_contrast'] >= 4.5 for r in report['regions'])
                    and chk['perLineOk'] and next(x for x in chk['toastInOrder'] if x['cps'] == 18)['ok'])
json.dump(report, open(os.path.join(QA, 'qa.json'), 'w'), indent=1)
print(json.dumps(dict(ok=report['ok'], regions=[(r['text'][:28], r['mean_abs_err'], r['max_abs_err'], r['encoded_contrast']) for r in report['regions']]), indent=0))
