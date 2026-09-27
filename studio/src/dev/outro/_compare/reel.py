#!/usr/bin/env python
"""MR. MAS · outro proposals: the comparison reel and the comparison sheet (lookdev, nothing decided).

    slate A · outro-a.mp4 · 1 s black · slate B · outro-b.mp4 · 1 s black · … · slate E · outro-e.mp4 · 1 s black

Each slate is 2 s: the letter, the name, the outro's length, and a bar drawn to scale against the 30 s intro. Each
clip is the builder's Ep1 mock-up exactly as delivered (1 s of stand-in "last frame of the episode" first, the Ep1 moth
stinger included, the builder's own temp mix). 1920x1080, 24 fps.

The bundled ffmpeg is a minimal build (no drawtext / overlay / fade / setpts), so, as in studio/src/dev/range/tools/
reel.py, the slates and the black are drawn with PIL as short PNG sequences in scratch, and one ffmpeg run joins them
with the five mp4s through the `concat` filter and encodes once (x264 crf 14, slow, 4 threads). Audio is each clip's
own mix, decoded, sample-exact to its frames (2000 samples a frame at 48 kHz), with 5 ms edge ramps against clicks,
and digital silence under the slates and the black. Levels are NOT matched: each clip keeps its builder's mix.

The sheet (out/lookdev/outro/outro-compare-sheet.png): at the top, the five as built, to scale on the 96 BPM grid
against the 30 s intro; then one row per proposal: three key frames cut from the ENCODED reel (at each builder's own
key-still frames) and that proposal's Ep10 variant still (the builders' PNGs; B's is rendered here from its
`outro-b-stills` composition, frame 1 = Ep10 o140, because B's delivered Ep10 file is a two-panel explainer).

    ops/heavy.sh audio/.venv-mix/bin/python studio/src/dev/outro/_compare/reel.py <scratchDir> [--sheet-only] [--slates-only]

(the laptop rule, SHOWRUNNER-NOTES: the encode is a heavy job; start it in the background and poll). If B's Ep10
still isn't in <scratchDir> yet, render it first (also through heavy.sh), from studio/:
    ../ops/heavy.sh npx remotion still src/dev/outro/b/entry.tsx outro-b-stills <scratchDir>/b-ep10-o140.png --frame=1 --bundle-cache=false --log=error

Reads (never writes) out/lookdev/outro/outro-{a..e}.mp4 and the builders' Ep10 stills; writes only
out/lookdev/outro/outro-compare.mp4 and out/lookdev/outro/outro-compare-sheet.png. Scratch: <scratchDir>/work
(about 250 MB of PNGs and WAVs at peak, deleted at the end; the B still is kept in <scratchDir> for re-runs).

History: r1 (2026-09-26) cut the first polish of each proposal; r2 (2026-09-27) re-cut all five after their second
polish passes (A 11.875 s, B 7.5 s / Ep1 10 s, C 8 s, D 11.25 s, E 7.5 s / Ep1 8.17 s). The data below is r2's.
"""
import json
import os
import shutil
import subprocess
import sys

import numpy as np
import soundfile as sf
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
STUDIO = os.path.abspath(os.path.join(HERE, '..', '..', '..', '..'))
ROOT = os.path.dirname(STUDIO)
OUT = os.path.join(ROOT, 'out', 'lookdev', 'outro')
FFD = os.path.join(STUDIO, 'node_modules', '@remotion', 'compositor-linux-x64-gnu')
FF, FFP = os.path.join(FFD, 'ffmpeg'), os.path.join(FFD, 'ffprobe')
ENV = dict(os.environ, LD_LIBRARY_PATH=FFD)

W, H, FPS, SR = 1920, 1080, 24, 48000
SPF = SR // FPS                        # 2000 samples a frame
SLATE_F, BLACK_F, FADE_F = 48, 24, 6   # 2 s slate (6 f in and out of black), 1 s of black
PRE = 24                               # every mock-up opens on 1 s of stand-in: file frame = PRE + o
INTRO_F = 720                          # the intro: 30 s, 12 bars
RAMP = int(0.005 * SR)

DJ = '/usr/share/fonts/truetype/dejavu/'
MONO, MONO_B, SANS, SANS_B = DJ + 'DejaVuSansMono.ttf', DJ + 'DejaVuSansMono-Bold.ttf', DJ + 'DejaVuSans.ttf', DJ + 'DejaVuSans-Bold.ttf'
BG = (14, 14, 16)
INK, DIM, FAINT = (233, 230, 218), (150, 156, 168), (92, 98, 112)
CYAN, GOLD, RED = (63, 230, 255), (201, 162, 74), (214, 86, 86)
NAVY1, NAVY2, TEAL, GRID, BARL = (30, 42, 72), (43, 60, 98), (18, 84, 94), (28, 30, 37), (58, 61, 72)
TERMS = (201, 196, 180)

HEADER = 'MR. MAS  ·  OUTRO PROPOSALS  ·  LOOKDEV COMPARISON  ·  Ep1 mock-ups, temp music, legal text DRAFT (review pending)'

# The five as delivered (r2, 2026-09-27, after each builder's second polish pass). Frames are outro frames (o), 60 to
# a bar at 96 BPM. `frames` is the outro as it runs in the Ep1 mock-up (the file is PRE + frames + post); `week` is a
# plain week's outro (no stinger) when that differs. `segs` are the picture's beats, `terms` when the terms line +
# pointer are lit and readable, `knee` the span of the one whole statement of the theme, `moth` Ep1's stinger
# (enters, lands), `f0` the intro's first sound (felt F5 + chip F6 glint) if it closes on it, `post` extra frames after
# the outro in the mock-up file. From each builder's entry.tsx / README / timeline.ts.
PROPOSALS = [
    dict(k='a', name='The closing session', frames=285, week=285, post=0,
         idea="one credits log on his monitor, terms as its last lines; then out to Mas in his dark room",
         segs=[(0, 6, 'open'), (6, 85, 'credits type'), (85, 225, 'terms · pointer · hold'),
               (225, 255, 'the room'), (255, 278, 'cursor'), (278, 285, '')],
         terms=(85, 225), knee=(0, 60), moth=(231, 265), f0=255,
         terms_note=' (on the pane; the room shot is too small to read)',
         keys=[(200, 'o200', 'the log whole: three credit rows, then the terms and pointer, one block, one face'),
               (240, 'o240', 'the pull-back, once: Mas, the Orb, the pane on his monitor; the moth to the light'),
               (273, 'o273', 'the last blink: the moth beside the loop cursor as the room goes down')],
         ep10=('a/outro-a-ep10-still.png', 'the machine types the log itself and adds "reviewed by a human", ticked'),
         stinger='inside (the dark room, beside the cursor)', tail=''),
    dict(k='b', name="The Orb's verdict", frames=240, week=180, post=18,
         idea="the Orb scans the viewer; its toast carries the credits and a verdict on us",
         segs=[(0, 30, 'wake · iris'), (30, 55, 'scan'), (55, 120, 'the toast'), (120, 180, 'verdict · lamp'),
               (180, 240, 'Ep1: moth bar')],
         terms=(0, 240), knee=(60, 120), moth=(130, 195), f0=None,
         terms_note=' in Ep1, 7.5 s in a plain week',
         keys=[(42, 'o42', 'the scan: tokens in the cone, legible type left behind it'),
               (128, 'o128', 'the toast full + "viewer: human ✓"; the verdict lights the lens'),
               (220, 'o220', 'Ep1: the moth at rest beside the final period; the Orb lays its beam on it')],
         ep10=(None, 'o140 · "viewer: —": it returns nothing (rendered here from outro-b-stills)'),
         stinger='adds a bar in Ep1 (plain week 7.5 s)',
         tail=' (Ep1: 10 s) + 0.75 s of black as the chord dies'),
    dict(k='c', name='After hours (DAYS SINCE)', frames=192, week=192, post=0, bars='3 bars + the ring-out',
         idea="NopeAI's lobby at night: the directory carries the credits; a hand turns the count 35 → 36",
         segs=[(0, 84, 'the wall · quiet read'), (84, 120, 'hand: 36'), (120, 151, 'lights down'),
               (151, 184, 'sign off · moth'), (184, 192, '')],
         terms=(0, 184), knee=(60, 120), moth=(118, 165), f0=None, terms_note='',
         keys=[(40, 'o40', 'the wall after hours: the sign at 35, three big credit lines, the band'),
               (105, 'o105', 'the hand lifts yesterday\'s 5 off; tonight\'s 36 is behind it (the knee\'s C)'),
               (170, 'o170', 'the sign off; the moth landed beside the final period, the one light left')],
         ep10=('c/outro-c-ep10.png', 'the count "??", no hand; THE INTERN · CORNER OFFICE slides onto the board'),
         stinger='inside', tail=''),
    dict(k='d', name='The curve', frames=270, week=270, post=0,
         idea="the intro's cyan line run home: the credits ride the knee up to an empty post box",
         segs=[(0, 30, 'lift · push-in'), (30, 105, 'title · flat plates'), (105, 150, 'the leap'),
               (150, 240, 'post box · hold'), (240, 255, 'out'), (255, 270, '')],
         terms=(20, 240), knee=(0, 151), moth=(153, 180), f0=255, terms_note='',
         keys=[(16, 'o16', 'his monitor\'s curve lit, the room dissolving; the push-in on the line alone'),
               (128, 'o128', 'the leap: plates on G, A♭, C; the camera craning up'),
               (200, 'o200', 'every credit up, human first; MR. MAS beside the empty post box; the moth in it')],
         ep10=('d/outro-d-ep10-still.png', '"you are ↑" off the chart; the post box holds the machine\'s own render (placeholder)'),
         stinger='inside', tail=''),
    dict(k='e', name='File closed', frames=180, week=180, post=16,
         idea="the episode's own file, scrolled to its credits; his pointer closes it",
         segs=[(0, 128, 'the file · credits hold'), (128, 150, 'pointer'), (150, 157, ''),
               (157, 180, 'terms only')],
         terms=(0, 196), knee=(0, 60), moth=(150, 165), f0=150,
         terms_note=' in Ep1, 7.5 s in a plain week',
         keys=[(64, 'o64', 'the file at its end: the credits as front matter; the terms outside the window'),
               (145, 'o145', 'his pointer on the close box; the click lands on o150'),
               (195, 'o195', 'Ep1: the file gone; the moth beside the final period, still for 1.29 s')],
         ep10=('e/outro-e-ep10-still.png', 'pace.yaml: the machine types the credits: block itself, values before keys'),
         stinger='after: lands 0.67 s past the outro',
         tail=' + 0.67 s more of Ep1\'s moth, landed and still'),
]
INTRO = [(0, 120, 'cold open'), (120, 180, '1993'), (180, 240, '2008–14'), (240, 465, 'THE WOODROSE'),
         (465, 480, ''), (480, 540, 'roll call'), (540, 630, 'skyline'), (630, 690, 'title'), (690, 720, 'bookend')]


def secs(f):
    s = f / FPS
    exact = (f * 8) % FPS == 0          # a multiple of 1/8 s (every bar and beat subdivision here): print it exactly
    return (f'{s:.3f}' if exact else f'{s:.2f}').rstrip('0').rstrip('.') + ' s'


def bars(f, p=None):
    return (p or {}).get('bars') or f'{f / 60:g} bars'


def ff(*args, **kw):
    return subprocess.run([FF, '-hide_banner', '-loglevel', 'error', *args], env=ENV, check=True, **kw)


def probe_frames(path):
    r = subprocess.run([FFP, '-v', 'error', '-count_frames', '-select_streams', 'v', '-show_entries',
                        'stream=nb_read_frames,width,height,r_frame_rate', '-of', 'json', path],
                       env=ENV, capture_output=True, text=True, check=True)
    s = json.loads(r.stdout)['streams'][0]
    assert (s['width'], s['height'], s['r_frame_rate']) == (W, H, '24/1'), (path, s)
    return int(s['nb_read_frames'])


def loudness(path, ss=None, t=None):
    cut = (['-ss', f'{ss:.4f}', '-t', f'{t:.4f}'] if ss is not None else [])
    r = subprocess.run([FF, '-hide_banner', '-nostats', *cut, '-i', path, '-vn', '-af', 'loudnorm=print_format=json',
                        '-f', 'null', '-'], env=ENV, capture_output=True, text=True, check=True)
    s = r.stderr
    j = json.loads(s[s.rindex('{'):s.rindex('}') + 1])
    return float(j['input_i']), float(j['input_tp'])


def grab(path, frame, dst):
    """One frame of an mp4 as RGB. Accurate input seek to a quarter frame before it, so this frame is the first kept."""
    seek = ['-ss', f'{(frame - 0.25) / FPS:.6f}'] if frame else []
    ff('-y', *seek, '-i', path, '-frames:v', '1', dst)
    return np.asarray(Image.open(dst).convert('RGB'))


# ------------------------------------------------------------------------------------------------ the slates
def draw_slate(p, i, n_total):
    img = Image.new('RGB', (W, H), (0, 0, 0))
    d = ImageDraw.Draw(img)
    f_head, f_small = ImageFont.truetype(MONO, 20), ImageFont.truetype(MONO, 22)
    f_letter, f_name = ImageFont.truetype(MONO_B, 150), ImageFont.truetype(MONO_B, 64)
    f_len, f_idea = ImageFont.truetype(MONO_B, 40), ImageFont.truetype(MONO, 28)
    x = 168
    d.text((x, 140), HEADER, font=f_head, fill=FAINT)
    d.text((W - 168 - d.textlength(f'{i + 1} of {n_total}', font=f_head), 140), f'{i + 1} of {n_total}',
           font=f_head, fill=FAINT)
    d.text((x - 8, 300), p['k'].upper(), font=f_letter, fill=INK)
    lw = d.textlength(p['k'].upper(), font=f_letter)
    d.text((x + lw + 40, 330), p['name'].upper(), font=f_name, fill=INK)
    wk, ep1 = p['week'], p['frames'] + (p['post'] if p['k'] == 'e' else 0)
    head = f"{secs(wk)} outro  ·  {bars(wk, p)} at 96 BPM"
    if ep1 != wk:
        head += f"   (Ep1 with the moth: {secs(ep1)})"
    d.text((x + lw + 42, 418), head, font=f_len, fill=CYAN)
    d.text((x, 520), p['idea'], font=f_idea, fill=DIM)
    # to scale: the outro against the 30 s intro (gold outline: what Ep1's moth adds)
    bx0, bx1, by = x, W - 168, 640
    pxf = (bx1 - bx0) / INTRO_F
    d.rectangle([bx0, by, bx1, by + 34], outline=BARL, width=2)
    for b in range(1, 12):
        d.line([(bx0 + b * 60 * pxf, by + 2), (bx0 + b * 60 * pxf, by + 32)], fill=GRID, width=1)
    if ep1 != wk:
        d.rectangle([bx0 + wk * pxf, by + 4, bx0 + ep1 * pxf, by + 30], outline=GOLD, width=3)
    d.rectangle([bx0 + 2, by + 2, bx0 + wk * pxf, by + 32], fill=CYAN)
    d.text((bx0, by + 46), f"this outro, {secs(wk)}" + (f"  (+ Ep1's moth, gold: {secs(ep1)})" if ep1 != wk else ''),
           font=f_small, fill=CYAN)
    lab = 'the intro, 30 s (12 bars)'
    d.text((bx1 - d.textlength(lab, font=f_small), by + 46), lab, font=f_small, fill=DIM)
    file_f = PRE + p['frames'] + p['post']
    d.text((x, 800), f"the file, {secs(file_f)}: 1 s of stand-in (the episode's last frame) + the outro{p['tail']}",
           font=f_small, fill=FAINT)
    d.text((x, 836), f"Ep1's moth stinger: {p['stinger']}   ·   sound: the builder's temp mix, not level-matched",
           font=f_small, fill=FAINT)
    base = np.asarray(img)
    out = []
    for j in range(SLATE_F):
        t = min(1.0, (j + 1) / FADE_F, (SLATE_F - j) / FADE_F)
        out.append((base.astype(np.float32) * t).astype(np.uint8) if t < 1 else base)
    return out


# ------------------------------------------------------------------------------------------------ the sheet
def draw_timeline(d, x0, y0, w):
    """The five as built, to scale against the intro. Returns the height used."""
    f_l, f_m, f_x = ImageFont.truetype(SANS_B, 26), ImageFont.truetype(SANS, 19), ImageFont.truetype(MONO, 16)
    lab_w = 470
    X0, X1 = x0 + lab_w, x0 + w - 40
    pxf = (X1 - X0) / INTRO_F
    fx = lambda f: X0 + f * pxf
    top, rowh = y0 + 30, 96
    n_rows = 1 + len(PROPOSALS)
    for f in range(0, INTRO_F + 1, 15):
        d.line([(fx(f), top - 4), (fx(f), top + n_rows * rowh - 20)], fill=BARL if f % 60 == 0 else GRID, width=1)
    for b in range(12):
        d.text((fx(b * 60) + 5, top - 28), f'bar {b + 1}' if b == 0 else str(b + 1), font=f_x, fill=DIM)
    for f in range(0, INTRO_F + 1, 120):
        d.text((fx(f) + 5, top + n_rows * rowh - 16), f'{f // 24} s', font=f_x, fill=FAINT)
    # the intro
    y = top
    d.text((x0, y + 4), 'INTRO', font=f_l, fill=INK)
    d.text((x0, y + 40), '30 s · 12 bars · locked', font=f_m, fill=DIM)
    for i, (a, b, lab) in enumerate(INTRO):
        d.rectangle([fx(a) + 1, y + 8, fx(b) - 1, y + 56], fill=NAVY1 if i % 2 else NAVY2)
        if lab:
            d.text((fx(a) + 8, y + 20), lab, font=f_m, fill=INK)
    for n, p in enumerate(PROPOSALS):
        y = top + (n + 1) * rowh
        L = p['frames']
        d.text((x0, y + 2), f"{p['k'].upper()} · {p['name']}", font=f_l, fill=INK)
        ep1 = f" · Ep1 {secs(L + (p['post'] if p['k'] == 'e' else 0))}" if L != p['week'] or p['k'] == 'e' else ''
        d.text((x0, y + 38), f"{secs(p['week'])} · {bars(p['week'], p)}{ep1} · file {secs(PRE + L + p['post'])}",
               font=f_m, fill=CYAN)
        py = y + 8
        for i, (a, b, lab) in enumerate(p['segs']):
            last = i == len(p['segs']) - 1
            d.rectangle([fx(a) + 1, py, fx(b) - 1, py + 34], fill=TEAL if last else (NAVY2 if i % 2 else NAVY1))
            if d.textlength(lab, font=f_x) < (b - a) * pxf - 10:
                d.text((fx(a) + 6, py + 8), lab, font=f_x, fill=INK)
        if p['post']:  # the mock-up's tail after the outro (B: black; E: the moth, Ep1 only)
            a, b = L, L + p['post']
            d.rectangle([fx(a) + 1, py + 6, fx(b) - 1, py + 28], outline=GOLD if p['k'] == 'e' else BARL, width=2)
        d.line([(fx(L), y + 2), (fx(L), y + 78)], fill=INK, width=3)
        if p['week'] != L:  # a plain week ends here (B: the moth's bar is Ep1's only)
            d.line([(fx(p['week']), y + 2), (fx(p['week']), y + 46)], fill=GOLD, width=3)
            d.text((fx(p['week']) + 6, y - 14), 'plain week ends', font=f_x, fill=GOLD)
        # the terms lane, the knee, the moth, the f0 glint
        ta, tb = p['terms']
        d.rectangle([fx(ta) + 1, y + 50, fx(tb) - 1, y + 56], fill=TERMS)
        ka, kb = p['knee']
        d.rectangle([fx(ka) + 1, y + 64, fx(kb) - 1, y + 70], fill=CYAN)
        ma, mb = p['moth']
        d.line([(fx(ma), y + 82), (fx(mb), y + 82)], fill=GOLD, width=3)
        d.ellipse([fx(mb) - 5, y + 77, fx(mb) + 5, y + 87], fill=GOLD)
        if p['f0'] is not None:
            g = fx(p['f0'])
            d.line([(g - 7, y + 67), (g + 7, y + 67)], fill=INK, width=2)
            d.line([(g, y + 60), (g, y + 74)], fill=INK, width=2)
        right = fx(max(L + p['post'], tb)) + 16
        d.text((right, y + 8), f"terms + pointer lit {secs(tb - ta)}{p['terms_note']}", font=f_x, fill=TERMS)
        d.text((right, y + 30), p['idea'], font=f_x, fill=DIM)
    # legend
    ly = top + n_rows * rowh + 16
    x = x0
    d.rectangle([x, ly, x + 28, ly + 18], fill=NAVY2); d.rectangle([x + 32, ly, x + 60, ly + 18], fill=TEAL)
    d.text((x + 70, ly - 1), 'picture beats (the last is the ending)', font=f_m, fill=INK); x += 450
    d.rectangle([x, ly + 6, x + 40, ly + 12], fill=TERMS)
    d.text((x + 50, ly - 1), 'terms line + pointer lit', font=f_m, fill=INK); x += 300
    d.rectangle([x, ly + 6, x + 40, ly + 12], fill=CYAN)
    d.text((x + 50, ly - 1), 'the knee, whole, once', font=f_m, fill=INK); x += 290
    d.line([(x, ly + 9), (x + 34, ly + 9)], fill=GOLD, width=3); d.ellipse([x + 30, ly + 4, x + 40, ly + 14], fill=GOLD)
    d.text((x + 50, ly - 1), "Ep1's moth: enters → lands", font=f_m, fill=INK); x += 330
    d.line([(x, ly + 9), (x + 14, ly + 9)], fill=INK, width=2); d.line([(x + 7, ly + 2), (x + 7, ly + 16)], fill=INK, width=2)
    d.text((x + 24, ly - 1), "the intro's f0 sound (the loop)", font=f_m, fill=INK); x += 360
    d.rectangle([x, ly + 2, x + 34, ly + 16], outline=GOLD, width=2)
    d.text((x + 44, ly - 1), 'mock-up tail after the outro (E: the moth; B: black)', font=f_m, fill=INK); x += 560
    d.line([(x + 7, ly - 2), (x + 7, ly + 20)], fill=GOLD, width=3)
    d.text((x + 20, ly - 1), "B: a plain week's cut (Ep1's moth adds a bar)", font=f_m, fill=INK)
    return ly + 40 - y0


def make_sheet(stills, ep10s):
    pad, tw, th, cap = 28, 960, 540, 64
    lab_w = 470
    sw = pad + lab_w + 4 * (tw + pad)
    tl_h = 30 + (1 + len(PROPOSALS)) * 96 + 56   # what draw_timeline uses
    head = 150
    sh = head + tl_h + 30 + 34 + len(PROPOSALS) * (th + cap + pad) + 60
    sheet = Image.new('RGB', (sw, sh), BG)
    d = ImageDraw.Draw(sheet)
    d.text((pad, 26), 'MR. MAS · OUTRO PROPOSALS · the five mock-ups, side by side', font=ImageFont.truetype(SANS_B, 44), fill=INK)
    d.text((pad, 88), 'Each outro is shorter than the 30 s intro. Key frames cut from the encoded outro-compare.mp4 '
                      '(o = outro frame, 96 BPM, 60 frames a bar); the right column is each proposal\'s Ep10 variant '
                      '(a still, not in the reel). Ep1 mock-ups after two polish passes each: temp music, (creator) is a '
                      'placeholder, all legal text is DRAFT and legal review is pending. 2026-09-27 (r2).',
           font=ImageFont.truetype(SANS, 21), fill=DIM)
    used = draw_timeline(d, pad, head, sw - 2 * pad)
    assert used == tl_h, (used, tl_h)
    y = head + used + 30
    d.line([(pad, y - 14), (sw - pad, y - 14)], fill=BARL, width=2)
    f_k, f_n, f_m, f_c, f_cb = (ImageFont.truetype(MONO_B, 110), ImageFont.truetype(SANS_B, 32),
                                ImageFont.truetype(SANS, 22), ImageFont.truetype(SANS, 19), ImageFont.truetype(SANS_B, 19))
    cols = ['key frame 1', 'key frame 2', 'key frame 3', 'Ep10 variant (still)']
    for j, c in enumerate(cols):
        d.text((pad + lab_w + j * (tw + pad), y), c.upper(), font=f_cb, fill=FAINT)
    y += 34
    for p in PROPOSALS:
        k = p['k']
        d.text((pad, y - 12), k.upper(), font=f_k, fill=INK)
        d.text((pad, y + 118), p['name'], font=f_n, fill=INK)
        wk, ep1 = p['week'], p['frames'] + (p['post'] if k == 'e' else 0)
        d.text((pad, y + 162), f"{secs(wk)} · {bars(wk, p)}" + (f" · Ep1 {secs(ep1)}" if ep1 != wk else ''),
               font=f_m, fill=CYAN)
        d.text((pad, y + 194), f"file {secs(PRE + p['frames'] + p['post'])} (with 1 s stand-in)", font=f_m, fill=DIM)
        ta, tb = p['terms']
        d.text((pad, y + 226), f"terms + pointer lit {secs(tb - ta)}" + (' · plain 7.5 s' if k in 'be' else ''),
               font=f_m, fill=TERMS)
        st = p['stinger']
        d.text((pad, y + 258), f"moth: {st if len(st) < 34 else st.split(' (')[0]}", font=f_m, fill=GOLD)
        # a small to-scale bar against the intro (gold outline: what Ep1's moth adds)
        bx, by, bw = pad, y + 306, lab_w - 50
        d.rectangle([bx, by, bx + bw, by + 18], outline=BARL, width=2)
        if ep1 != wk:
            d.rectangle([bx + wk / INTRO_F * bw, by + 3, bx + ep1 / INTRO_F * bw, by + 15], outline=GOLD, width=2)
        d.rectangle([bx + 2, by + 2, bx + wk / INTRO_F * bw, by + 16], fill=CYAN)
        d.text((bx, by + 26), 'vs the 30 s intro', font=f_c, fill=FAINT)
        tiles = [(Image.fromarray(rgb), f'{tag} · {secs(o)} into the outro', txt) for o, tag, txt, rgb in stills[k]]
        e_img, e_cap = ep10s[k]
        tiles.append((e_img, 'Ep10 variant', e_cap))
        for j, (im, a, b) in enumerate(tiles):
            x = pad + lab_w + j * (tw + pad)
            t = im.convert('RGB')
            if t.size != (tw, th):
                t = t.resize((tw, th), Image.BOX)
            sheet.paste(t, (x, y))
            if j == 3:
                d.rectangle([x - 1, y - 1, x + tw, y + th], outline=GOLD, width=2)
            d.text((x, y + th + 8), a, font=f_cb, fill=GOLD if j == 3 else CYAN)
            d.text((x, y + th + 34), b, font=f_c, fill=DIM)
        y += th + cap + pad
    d.text((pad, sh - 50), 'Made by studio/src/dev/outro/_compare/reel.py from out/lookdev/outro/outro-{a..e}.mp4 and '
                           'the builders\' Ep10 stills. Brief and results: show/production/OUTRO-PROPOSALS.md.',
           font=ImageFont.truetype(SANS, 19), fill=FAINT)
    return sheet


def ep10_stills(scratch):
    """The Ep10 variant of each proposal, at 1920x1080. B's is rendered from its own stills composition."""
    out = {}
    for p in PROPOSALS:
        rel, cap = p['ep10']
        if rel is None:
            dst = os.path.join(scratch, 'b-ep10-o140.png')
            if not os.path.exists(dst):  # a Remotion still: a heavy job (ops/heavy.sh, the laptop rule)
                subprocess.run([os.path.join(ROOT, 'ops', 'heavy.sh'), 'npx', 'remotion', 'still',
                                'src/dev/outro/b/entry.tsx', 'outro-b-stills', dst,
                                '--frame=1', '--bundle-cache=false', '--log=error'], cwd=STUDIO, check=True)
            path = dst
        else:
            path = os.path.join(OUT, rel)
        im = Image.open(path).convert('RGB')
        assert im.size == (W, H), (path, im.size)
        out[p['k']] = (im.resize((960, 540), Image.BOX), cap)
    return out


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    if not args:
        sys.exit('usage: reel.py <scratchDir> [--sheet-only] [--slates-only]')
    scratch = os.path.abspath(args[0])
    tmp = os.path.join(scratch, 'work')
    os.makedirs(tmp, exist_ok=True)
    out_mp4 = os.path.join(OUT, 'outro-compare.mp4')
    clips = [dict(p, src=os.path.join(OUT, f"outro-{p['k']}.mp4")) for p in PROPOSALS]
    for c in clips:
        c['n'] = probe_frames(c['src'])
        want = PRE + c['frames'] + c['post']
        assert c['n'] == want, (c['k'], c['n'], want)
    try:
        slates = [draw_slate(c, i, len(clips)) for i, c in enumerate(clips)]
        if '--slates-only' in sys.argv:
            for c, s in zip(clips, slates):
                Image.fromarray(s[SLATE_F // 2]).save(os.path.join(scratch, f"slate-{c['k']}.png"))
            print('slates in', scratch)
            return
        # the reel's layout: slate, clip, black for each
        marks, k = [], 0
        for c in clips:
            marks.append((f"slate {c['k']}", k, SLATE_F)); k += SLATE_F
            c['start'] = k
            marks.append((c['k'], k, c['n'])); k += c['n']
            marks.append(('black', k, BLACK_F)); k += BLACK_F
        total = k

        if '--sheet-only' not in sys.argv:
            # --- audio: each clip's own mix, sample-exact to its frames; silence under the slates and the black
            aud = []
            for c in clips:
                aud.append(np.zeros((SLATE_F * SPF, 2), np.float32))
                wav = os.path.join(tmp, c['k'] + '.wav')
                ff('-y', '-i', c['src'], '-vn', '-ac', '2', '-ar', str(SR), '-c:a', 'pcm_s16le', wav)
                x, sr = sf.read(wav, dtype='float32', always_2d=True)
                assert sr == SR, sr
                n = c['n'] * SPF
                print(f"{c['k']}: {c['n']} frames; audio {len(x)} samples decoded, {n} kept "
                      f"({(len(x) - n) / SR * 1000:+.1f} ms of codec tail dropped); "
                      f"edge peaks {np.abs(x[:RAMP]).max():.3f} / {np.abs(x[n - RAMP:n]).max():.3f}")
                x = x[:n] if len(x) >= n else np.vstack([x, np.zeros((n - len(x), 2), np.float32)])
                ramp = np.linspace(0, 1, RAMP, dtype=np.float32)[:, None]
                x[:RAMP] *= ramp
                x[-RAMP:] *= ramp[::-1]
                aud.append(x)
                aud.append(np.zeros((BLACK_F * SPF, 2), np.float32))
                os.remove(wav)
            reel_wav = os.path.join(tmp, 'reel.wav')
            sf.write(reel_wav, np.vstack(aud), SR, subtype='PCM_24')

            # --- the PNG sequences: pre_i = (1 s black, unless first) + slate_i; tail = 1 s black
            black = Image.new('RGB', (W, H), (0, 0, 0))
            seqs = []
            for i, s in enumerate(slates):
                sd = os.path.join(tmp, f'pre{i + 1}'); os.makedirs(sd, exist_ok=True)
                frames = ([None] * BLACK_F if i else []) + s
                for j, fr in enumerate(frames):
                    (black if fr is None else Image.fromarray(fr)).save(os.path.join(sd, f'f{j:03d}.png'), compress_level=1)
                seqs.append(sd)
            td = os.path.join(tmp, 'tail'); os.makedirs(td, exist_ok=True)
            for j in range(BLACK_F):
                black.save(os.path.join(td, f'f{j:03d}.png'), compress_level=1)

            # --- one encode through concat
            cmd, n_in = [FF, '-hide_banner', '-loglevel', 'error', '-y'], 0
            for sd, c in zip(seqs, clips):
                cmd += ['-framerate', str(FPS), '-i', os.path.join(sd, 'f%03d.png'), '-i', c['src']]
                n_in += 2
            cmd += ['-framerate', str(FPS), '-i', os.path.join(td, 'f%03d.png'), '-i', reel_wav]
            n_in += 1
            fc = ''.join(f'[{j}:v]format=yuv420p[v{j}];' for j in range(n_in))
            fc += ''.join(f'[v{j}]' for j in range(n_in)) + f'concat=n={n_in}:v=1:a=0[v]'
            cmd += ['-filter_complex', fc, '-map', '[v]', '-map', f'{n_in}:a',
                    '-c:v', 'libx264', '-preset', 'slow', '-crf', '14', '-threads', '4', '-pix_fmt', 'yuv420p',
                    '-r', str(FPS), '-c:a', 'aac', '-b:a', '256k', '-ar', str(SR),
                    '-metadata', 'title=MR. MAS outro proposals: lookdev comparison (A-E)',
                    '-metadata', 'comment=Internal lookdev. Temp music. All on-screen legal text is DRAFT; legal review pending. (creator) is a placeholder.',
                    '-movflags', '+faststart', out_mp4]
            subprocess.run(cmd, env=ENV, check=True)
            for sd in seqs + [td]:
                shutil.rmtree(sd)
            os.remove(reel_wav)

        # --- check the encode; the sheet's stills come from the encoded reel
        got = probe_frames(out_mp4)
        print(f'reel: {got} frames ({got / FPS:.2f} s); wanted {total} ({total / FPS:.2f} s)')
        assert got == total
        stills = {}
        for c in clips:
            checks = sorted({0, PRE, c['n'] - 1} | {PRE + o for o, _, _ in c['keys']})
            for f in checks:
                a = grab(c['src'], f, os.path.join(tmp, 'src.png')).astype(np.int16)
                b = grab(out_mp4, c['start'] + f, os.path.join(tmp, 'reel.png'))
                dv = np.abs(b.astype(np.int16) - a)
                print(f"  {c['k']} f{f:03d} (reel f{c['start'] + f:04d}): vs source mean {dv.mean():.2f}, "
                      f"99.9th pct {int(np.percentile(dv, 99.9))} levels")
            stills[c['k']] = []
            for o, tag, txt in c['keys']:
                rgb = grab(out_mp4, c['start'] + PRE + o, os.path.join(tmp, 'k.png'))
                small = np.asarray(Image.fromarray(rgb).resize((960, 540), Image.BOX))
                stills[c['k']].append((o, tag, txt, small))
        make_sheet(stills, ep10_stills(scratch)).save(os.path.join(OUT, 'outro-compare-sheet.png'), optimize=True)
        print('levels (integrated over each clip as delivered, and over the same span in the reel):')
        for c in clips:
            i0, tp0 = loudness(c['src'])
            i1, tp1 = loudness(out_mp4, c['start'] / FPS, c['n'] / FPS)
            print(f"  {c['k']}: source {i0:.1f} LUFS {tp0:.1f} dBTP · in the reel {i1:.1f} LUFS {tp1:.1f} dBTP")
        i, tp = loudness(out_mp4)
        print(f'  outro-compare.mp4: {i:.1f} LUFS, {tp:.1f} dBTP')
        print('segments:')
        for name, s0, n in marks:
            print(f'  {name:8s} f{s0:04d}–{s0 + n - 1:04d}  {s0 / FPS:6.2f}–{(s0 + n) / FPS:6.2f} s')
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


if __name__ == '__main__':
    main()
