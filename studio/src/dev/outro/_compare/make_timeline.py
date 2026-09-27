#!/usr/bin/env python3
"""MR. MAS outro proposals: the comparison strip (a visual outline, not a render of the outros).

Draws the five proposals from show/production/OUTRO-PROPOSALS.md on the 96 BPM grid (15 frames a beat, 60 a bar),
to scale against the 30 s intro: picture beats, the terms line's time on screen, the knee's eight notes, the
no-third chord, and the stinger slot.

    python3 studio/src/dev/outro/_compare/make_timeline.py
    -> out/lookdev/outro/outro-proposals-timeline.png  (1920x1080)

Needs Pillow. Reads nothing; the data below is copied from the proposals file (keep them in step).
"""
import os
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', '..', '..'))
OUT = os.path.join(ROOT, 'out', 'lookdev', 'outro', 'outro-proposals-timeline.png')

W, H = 1920, 1080
BG, GRID, BARL, PAPER, DIM = '#0E0E10', '#1C1E25', '#3A3D48', '#E9E6DA', '#8A8F9C'
CYAN, NAVY1, NAVY2, TEAL, GOLD, BRICK = '#3FE6FF', '#1E2A48', '#2B3C62', '#12545E', '#C9A24A', '#B8573A'
X0, X1 = 330, 1880            # the timeline's x range: 720 frames (the intro) fill it
PXF = (X1 - X0) / 720.0       # px per frame


def font(size, bold=False, mono=False):
    names = (['DejaVuSansMono-Bold.ttf', 'DejaVuSansMono.ttf'] if mono else
             ['DejaVuSans-Bold.ttf', 'DejaVuSans.ttf']) if bold else (
             ['DejaVuSansMono.ttf'] if mono else ['DejaVuSans.ttf'])
    for n in names:
        p = os.path.join('/usr/share/fonts/truetype/dejavu', n)
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()


F_T, F_S, F_L, F_M, F_X = font(34, True), font(18), font(22, True), font(15), font(13, mono=True)
fx = lambda f: X0 + f * PXF

# ------------------------------------------------------------------ data (from OUTRO-PROPOSALS.md)
KNEE_SW = lambda b0: [b0 + (i // 2) * 15 + (10 if i % 2 else 0) for i in range(8)]
KNEE_ST = lambda b0: [b0 + (i // 2) * 15 + (7 if i % 2 else 0) for i in range(8)]
PROPOSALS = [
    dict(k='E', name='File closed', frames=150,
         segs=[(0, 120, "the file, at its credits"), (120, 128, 'close'), (128, 150, 'cursor')],
         terms=(0, 150), knee=KNEE_SW(0), chord=60, glint=120, sting=('after', 150, 270),
         note='the file type changes every episode (md, wav, jpg, eml, docx, xlsx, pdf, log, yaml, txt)'),
    dict(k='B', name="The Orb's verdict", frames=180,
         segs=[(0, 15, 'wake'), (15, 30, 'iris'), (30, 60, 'scan cone'), (60, 120, 'toast fills'), (120, 180, 'verdict')],
         terms=(0, 180), knee=KNEE_ST(60), chord=135, chime=120, sting=('after', 180, 300),
         note='the verdict on the viewer drifts with the season; the knee plays straight'),
    dict(k='C', name='After hours', frames=240,
         segs=[(0, 60, 'the lobby wall'), (60, 120, 'hangs 36'), (120, 180, 'hold'), (180, 240, 'lights down')],
         terms=(0, 240), knee=KNEE_SW(60), chord=180, sting=('inside', 124, 180),
         note='the count is real arithmetic: days since the sign last reset'),
    dict(k='A', name='The closing session', frames=300,
         segs=[(0, 30, 'pull-back'), (30, 45, 'pane'), (45, 135, 'the log types'), (135, 240, 'hold'), (240, 300, 'log out')],
         terms=(33, 240), knee=KNEE_SW(60), chord=180, glint=285, sting=('inside', 195, 240),
         note="the lead's idea at half length; the pane's skin matures across the season"),
    dict(k='D', name='The curve', frames=360,
         segs=[(0, 60, 'thread lifts'), (60, 180, 'the flat line: 4 plates'), (180, 300, 'the leap: 4 plates'), (300, 360, 'intro f0')],
         terms=(30, 300), knee=[60 + 30 * i for i in range(8)], chord=270, glint=300, sting=('rides', 90, 150),
         note='the knee augmented (half notes); cuts to the intro’s own first frame'),
]
INTRO = [(0, 120, 'cold open'), (120, 180, '1993'), (180, 240, '2008–14'), (240, 465, 'THE WOODROSE'),
         (465, 480, ''), (480, 540, 'roll call'), (540, 630, 'skyline'), (630, 690, 'title'), (690, 720, 'bookend')]


def hatch(d, x0, y0, x1, y1, col, step=7):
    d.rectangle([x0, y0, x1, y1], outline=col, width=2)
    for x in range(int(x0) - int(y1 - y0), int(x1), step):
        a, b = max(x, x0), min(x + (y1 - y0), x1)
        if b > a:
            d.line([(a, y1 - (a - x)), (b, y1 - (b - x))], fill=col, width=1)


def main():
    im = Image.new('RGB', (W, H), BG)
    d = ImageDraw.Draw(im)
    # header
    d.text((40, 30), 'MR. MAS · outro proposals, to scale', font=F_T, fill=PAPER)
    d.text((40, 76), '96 BPM · 1 beat = 15 frames · 1 bar = 60 frames = 2.5 s · every row drawn on the same scale as the 30 s intro',
           font=F_S, fill=DIM)
    top = 130
    # grid: beats and bars across the whole timeline, full height
    for f in range(0, 721, 15):
        x = fx(f)
        d.line([(x, top), (x, H - 110)], fill=BARL if f % 60 == 0 else GRID, width=1)
    for b in range(12):
        d.text((fx(b * 60) + 4, top - 22), str(b + 1), font=F_M, fill=DIM)
    d.text((40, top - 22), 'bar', font=F_M, fill=DIM)
    # the intro row
    y = top + 10
    d.text((40, y + 4), 'INTRO', font=F_L, fill=PAPER)
    d.text((40, y + 32), '30 s · 12 bars · locked', font=F_M, fill=DIM)
    for i, (a, b, lab) in enumerate(INTRO):
        d.rectangle([fx(a) + 1, y, fx(b) - 1, y + 50], fill=NAVY1 if i % 2 else NAVY2)
        if lab:
            d.text((fx(a) + 6, y + 16), lab, font=F_M, fill=PAPER)
    rowh = 150
    y0 = top + 90
    for n, p in enumerate(PROPOSALS):
        y = y0 + n * rowh
        L = p['frames']
        secs = L / 24.0
        d.text((40, y + 2), f"{p['k']} · {p['name']}", font=F_L, fill=PAPER)
        d.text((40, y + 32), f"{secs:g} s · {L // 60 if L % 60 == 0 else L / 60:g} bars · {L} frames", font=F_M, fill=CYAN)
        # picture lane
        py = y + 16  # the picture lane: py .. py+40
        above_x = -1e9
        for i, (a, b, lab) in enumerate(p['segs']):
            last = i == len(p['segs']) - 1
            d.rectangle([fx(a) + 1, py, fx(b) - 1, py + 40], fill=TEAL if last else (NAVY2 if i % 2 else NAVY1))
            if not lab:
                continue
            if d.textlength(lab, font=F_M) < (b - a) * PXF - 10:
                d.text((fx(a) + 6, py + 11), lab, font=F_M, fill=PAPER)
            else:  # too narrow: label it above the lane, in small type, never overlapping the previous one
                lx = max(fx(a) + 2, above_x + 8)
                d.line([(fx(a) + 3, py - 2), (fx(a) + 3, py - 5)], fill=DIM, width=1)
                d.text((lx, py - 17), lab, font=F_X, fill=DIM)
                above_x = lx + d.textlength(lab, font=F_X)
        d.line([(fx(L), y + 8), (fx(L), y + 116)], fill=PAPER, width=2)
        # stinger slot
        kind, sa, sb = p['sting']
        if kind == 'after':
            hatch(d, fx(sa) + 3, py + 4, fx(sb) - 1, py + 36, GOLD)
            d.text((fx(sb) + 10, py + 12), 'stinger slot, after (≤ 2 bars)', font=F_X, fill=GOLD)
        else:
            hatch(d, fx(sa) + 1, py + 28, fx(sb) - 1, py + 39, GOLD, 5)
            d.text((fx(L) + 10, py + 12), 'stinger inside' if kind == 'inside' else 'stinger rides the line', font=F_X, fill=GOLD)
        # terms lane
        ta, tb = p['terms']
        v = (tb - ta) / 24
        vs = (f'{v:.2f}' if abs(v * 4 - round(v * 4)) < 1e-9 else f'{v:.1f}').rstrip('0').rstrip('.')
        d.rectangle([fx(ta) + 1, y + 70, fx(tb) - 1, y + 78], fill='#C9C4B4')
        d.text((fx(max(tb, L)) + 10, y + 66), f'terms on screen {vs} s', font=F_X, fill='#C9C4B4')
        # music lane: the knee's eight notes, the no-third chord, the f0 glint
        my = y + 104
        d.line([(fx(0), my), (fx(L), my)], fill=BARL, width=1)
        pitch = [0, 0, 0, 0, 3, 5, 8, 12]  # F F F F G Ab C F', as a rising height
        for i, f in enumerate(p['knee']):
            r = 5
            yy = my - pitch[i] * 1.3
            d.ellipse([fx(f) - r, yy - r, fx(f) + r, yy + r], fill=CYAN)
        c = p['chord']
        d.polygon([(fx(c), my - 9), (fx(c) + 8, my), (fx(c), my + 9), (fx(c) - 8, my)], outline=PAPER, fill=BG)
        if 'glint' in p:
            g = fx(p['glint'])
            d.line([(g - 6, my), (g + 6, my)], fill=CYAN, width=2)
            d.line([(g, my - 6), (g, my + 6)], fill=CYAN, width=2)
        if 'chime' in p:
            d.text((fx(p['chime']) - 4, my + 8), 'chime', font=F_X, fill=DIM)
        d.text((fx(L) + 10, my - 8), p['note'], font=F_X, fill=DIM)
    # legend
    ly = H - 92
    d.line([(40, ly - 14), (W - 40, ly - 14)], fill=BARL, width=1)
    x = 40
    d.rectangle([x, ly, x + 30, ly + 18], fill=NAVY2); d.rectangle([x + 34, ly, x + 64, ly + 18], fill=TEAL)
    d.text((x + 72, ly), 'picture beats (the last one is the ending)', font=F_M, fill=PAPER); x += 430
    d.rectangle([x, ly + 5, x + 40, ly + 13], fill='#C9C4B4')
    d.text((x + 48, ly), 'the terms line on screen (≥ 5 s, never moves)', font=F_M, fill=PAPER); x += 410
    for i in range(4):
        d.ellipse([x + i * 14, ly + 4, x + i * 14 + 10, ly + 14], fill=CYAN)
    d.text((x + 62, ly), 'the knee, F F F F G A♭ C F, whole, once', font=F_M, fill=PAPER); x += 390
    d.polygon([(x + 8, ly), (x + 16, ly + 9), (x + 8, ly + 18), (x, ly + 9)], outline=PAPER, fill=BG)
    d.text((x + 24, ly), 'chord with no third', font=F_M, fill=PAPER); x += 200
    d.line([(x, ly + 9), (x + 12, ly + 9)], fill=CYAN, width=2); d.line([(x + 6, ly + 3), (x + 6, ly + 15)], fill=CYAN, width=2)
    d.text((x + 20, ly), "the intro's f0 sound", font=F_M, fill=PAPER)
    x = 40; ly += 30
    hatch(d, x, ly, x + 64, ly + 18, GOLD)
    d.text((x + 72, ly), 'stinger slot (≤ 5 s, a callback, never plot)', font=F_M, fill=PAPER)
    d.text((620, ly), 'Outline only: frames and lengths from show/production/OUTRO-PROPOSALS.md. The moving mock-ups are in out/lookdev/outro/<id>/.',
           font=F_M, fill=DIM)
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    im.save(OUT)
    print(OUT)


if __name__ == '__main__':
    main()
