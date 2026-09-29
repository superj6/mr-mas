"""OUTRO A · "the closing session": the lookdev build after the silent picture render.
LOOKDEV ONLY. Reads the temp music render (scratch), the shared SFX library (read-only) and the silent 1080p render;
writes only to out/lookdev/outro/a/ (and a copy of the mp4 to out/lookdev/outro/outro-a.mp4) and to the scratch.

  0. LAYOUT the timeline, typing schedule, text boxes and the moth's path come from the scene's own modules
           (tools/preview.ts `layout` -> <scratch>/eng1x/layout.json); nothing below restates them by hand
  1. MIX   the temp music (audio/track.py; its first 0.25 s trimmed so the file starts with the 24-frame stand-in)
           + the designed sound (below), 12.875 s = 309 frames. Music stays at its own -16 LUFS master; SFX sit under it.
  2. MUX   silent picture + mix -> outro-a-ep1-1080p.mp4 (Remotion's bundled ffmpeg, h264 copy + AAC 256k)
  3. STILLS the 3 key stills, the 6-frame keyframes sheet (numbered, with a to-scale outline strip that also shows the
           8.75 s cut it replaces and where a first-time reader is), the variants sheet; pixels from the engine
  4. QA    frames decoded from the ENCODED mp4, at 1920x1080 and at 480x270 (area-averaged), compared against the
           engine's native frame inside every text box; per-line read times; the whole card read in one pass (a
           simulated reader at 15/20/25 characters a second and at 4 words a second); audio levels -> outro-a-qa.json

Designed sound (all from audio/sfx/wav, read-only, except the synthesized moth and ticks):
  o0-o224    server_hum as a whisper (-32 dB): we are at his monitor, in his room, before we know it
  o3         dialog_ok_click--chip: the 1-bit pane opens
  o6         key_tap_space: the header prints at once (a return)
  o9-o69     key_tap_soft_01..06 round-robin, one per typing frame (the credits type 2 characters a frame, straight)
  o85        the terms print whole: two quick 1-bit ticks (one per row)
  o145       the pointer prints: one tick, then the prompt's return (key_tap_space)
  o225-226   the pull-back: two very quiet 1-bit ticks (the LCD rows)
  o225-o284  room_drone (F1+C2, the open fifth) and server_hum (-24 dB) come up with the room (3-frame fade in) and
             go down with the lights (o272-o284)
  o252       dialog_ok_click (the plain one, -36 dB): the session window closes
  o231-o264  the moth: band-passed noise, one soft stroke per 2-frame drawing, panned with its flight
  o265       its touch-down (20 ms), a wing fold at o268; o267 the Orb's servo, very low, as its iris opens a touch
  o255       the music's felt F5 + chip F6 glint as the cursor comes on (in the music, not here)

Run (repo root), after the picture render and the music render (see entry.tsx's header):
  audio/.venv-theme/bin/python studio/src/dev/outro/a/tools/build.py --scratch <scratch>
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
import argparse
import json
import math
import os
import shutil
import subprocess
import sys

import numpy as np
import soundfile as sf
from PIL import Image, ImageDraw, ImageFont
from scipy.signal import butter, sosfilt

ROOT = REPO
sys.path.insert(0, f'{ROOT}/audio/ost')
from engine.mix import lufs, true_peak   # noqa: E402

SR, FPS = 48000, 24
TRIM_S = 0.25
SFX = f'{ROOT}/audio/sfx/wav'
OUTD = f'{ROOT}/out/lookdev/outro/a'
FFD = f'{ROOT}/studio/node_modules/@remotion/compositor-linux-x64-gnu'
STUDIO = f'{ROOT}/studio'
FONT = '/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf'
FONT_B = '/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf'
CPS_READ = 15.0   # a conservative subtitle rate (the brief's rule of thumb is about 16 cps)

# the 90-word end-credits text (show/bible/overview.md s8, pending legal review): it moves off screen, into the
# description, the receipts page and the file's metadata; here it is written into the mock-up's MP4 description tag
NOTICE = ('MR. MAS is a work of parody and satire about public figures and public events. Real events are dramatized. '
          'Scenes, dialogue and props marked as invented, reconstructed or reported are fictional or unconfirmed. '
          'Quoted lines are from the public record as of the date shown. No person or company depicted participated '
          'in, sponsored or endorsed this production. All names, logos and products are parodies. Voices are '
          'performed; no real voice was cloned.')

L = {}   # the layout (tools/preview.ts `layout`), loaded in main()


def O(k):
    return L['O'][k]


# ---------------------------------------------------------------- the engine's native frames (tools/preview.ts)
def engine(scratch, outdir, scale, ids):
    js = f'{scratch}/oa.js'
    subprocess.run(['npx', 'esbuild', 'src/dev/outro/a/tools/preview.ts', '--bundle', '--platform=node',
                    f'--outfile={js}', '--log-level=warning'], check=True, cwd=STUDIO)
    os.makedirs(outdir, exist_ok=True)
    subprocess.run(['node', js, outdir, str(scale), *ids], check=True, cwd=STUDIO, capture_output=True)


# ---------------------------------------------------------------- audio helpers
def fr(o):
    """sample index of OUTRO frame o in the mock-up (composition frame PRE + o)"""
    return int(round((o + L['PRE']) / FPS * SR))


def dbl(x):
    return 10 ** (x / 20)


def tp_db(x):
    return float(20 * np.log10(true_peak(x) + 1e-12))


def load(name):
    x, sr = sf.read(f'{SFX}/{name}.wav', always_2d=True, dtype='float64')
    assert sr == SR, (name, sr)
    return x[:, :2] if x.shape[1] >= 2 else np.repeat(x, 2, axis=1)


def place(bus, x, at, gain_db=0.0):
    n = min(len(x), len(bus) - at)
    if n > 0:
        bus[at:at + n] += x[:n] * dbl(gain_db)


def ramp(n, pts):
    """piecewise-linear gain curve over n samples from [(outro_frame, gain_db or None=silence)]"""
    t = np.arange(n)
    xs = [fr(o) for o, _ in pts]
    ys = [0.0 if g is None else dbl(g) for _, g in pts]
    return np.interp(t, xs, ys)[:, None]


def loop_to(x, n):
    reps = int(math.ceil(n / len(x)))
    return np.tile(x, (reps, 1))[:n]


def moth_flutter(rng):
    """band-passed noise, one stroke per 2-frame drawing, panned with the moth's x, from its entry to its landing"""
    path = [(o, x) for o, x, _ in L['moth'] if o < O('mothLand')]
    n0, n1 = fr(O('mothIn')), fr(O('mothLand'))
    n = n1 - n0
    body = sosfilt(butter(2, [280, 2400], btype='band', fs=SR, output='sos'), rng.standard_normal(n))
    t = np.arange(n) / SR
    beat = (0.5 - 0.5 * np.cos(2 * np.pi * 12.0 * t)) ** 3
    jitter = 1.0 + 0.3 * np.interp(t, np.linspace(0, t[-1], 20), rng.uniform(-1, 1, 20))
    env = np.minimum(1.0, t / 0.2) * np.minimum(1.0, (t[-1] - t) / 0.15)
    # quieter while the window is closing and the moth is lost in the dark (o170-o179), then it homes in
    frames = t * FPS + O('mothIn')
    lost = np.interp(frames, [O('close'), O('close') + 2, O('cursorOn'), O('cursorOn') + 2], [1.0, 0.6, 0.6, 1.0])
    x = body * beat * jitter * env * lost
    px = np.interp(frames, [p[0] for p in path], [p[1] for p in path])
    th = (np.clip((px - 240) / 240, -1, 1) + 1) * np.pi / 4           # equal-power pan with the flight
    st = np.stack([x * np.cos(th), x * np.sin(th)], axis=1)
    return st / (np.abs(st).max() + 1e-12), n0


def tick(rng, ms, hp=1800, lfsr=True):
    n = int(SR * ms / 1000)
    if lfsr:   # a 1-bit noise tick (LFSR-ish: sign of noise, sample-held at ~11 kHz)
        hold = max(1, SR // 11025)
        x = np.repeat(np.sign(rng.standard_normal(n // hold + 1)), hold)[:n]
    else:
        x = rng.standard_normal(n)
    x = sosfilt(butter(2, hp, btype='high', fs=SR, output='sos'), x)
    x *= np.exp(-np.arange(n) / (n / 4))
    x /= np.abs(x).max() + 1e-12
    return np.stack([x, x], axis=1)


def mix(scratch):
    rng = np.random.default_rng(1227)
    PRE, OUT = L['PRE'], L['OUT']
    n = int(round((PRE + OUT) / FPS * SR))
    m, sr = sf.read(f'{scratch}/music/lookdev-outro-a-ep1-album.wav', always_2d=True, dtype='float64')
    assert sr == SR
    m = m[int(TRIM_S * SR):][:n]
    if len(m) < n:
        m = np.vstack([m, np.zeros((n - len(m), 2))])
    sfx = np.zeros((n, 2))
    cues = []
    pull, end = O('pull'), O('end')

    fade0 = O('fade')
    hum = loop_to(load('server_hum'), n) * ramp(n, [(-PRE, None), (0, None), (3, -32), (pull - 1, -32), (pull + 2, -24),
                                                    (fade0, -25), (end, None), (OUT, None)])
    sfx += hum
    cues.append(('server_hum', f'o0-o{pull - 1} at -32 dB (a whisper under the insert), -24 dB in the room', -24))
    drone = loop_to(load('room_drone'), n) * ramp(n, [(-PRE, None), (pull - 1, None), (pull + 2, -12), (fade0, -13),
                                                      (end, None), (OUT, None)])
    sfx += drone
    cues.append(('room_drone', f'o{pull}-o{end} (3-frame fade in on the pull-back; down with the lights o{fade0}-o{end})', -12))
    place(sfx, load('dialog_ok_click--chip'), fr(O('paneUp')), -30)
    cues.append(('dialog_ok_click--chip', f"o{O('paneUp')} the pane opens", -30))
    place(sfx, load('key_tap_space'), fr(O('header')), -31)
    cues.append(('key_tap_space', f"o{O('header')} the header's return", -31))
    taps = [load(f'key_tap_soft_0{i}') for i in range(1, 7)]
    k = 0
    for s, d in L['typing']:
        for o in range(s, d + 1):
            place(sfx, taps[k % 6], fr(o), -32.5 + rng.uniform(-1.5, 0.0))
            k += 1
    cues.append(('key_tap_soft_01..06', f"{k} taps, one per typing frame o{L['typing'][0][0]}-o{L['typing'][-1][1]} "
                 '(peaks <= -30 dBFS)', -32.5))
    lg, pt = O('legal'), O('pointer')
    for j in range(2):   # the terms print whole: one 1-bit tick per row, 25 ms apart
        place(sfx, tick(rng, 7), fr(lg) + int(0.025 * SR * j), -37 - 1.5 * j)
    place(sfx, tick(rng, 7), fr(pt), -37.5)   # the pointer's row, then the prompt's return
    place(sfx, load('key_tap_space'), fr(pt) + int(0.05 * SR), -34)
    cues.append(('print ticks (synth)', f'o{lg} the terms print whole (2 row ticks)', -37))
    cues.append(('print tick (synth) + key_tap_space', f'o{pt} the pointer prints, then the prompt (the return)', -34))
    for j, o in enumerate((pull, pull + 1)):
        place(sfx, tick(rng, 6), fr(o), -40 - 3 * j)
    cues.append(('lcd ticks (synth)', f'o{pull}-o{pull + 1} the pull-back', -40))
    place(sfx, load('dialog_ok_click'), fr(O('close')), -36)
    cues.append(('dialog_ok_click', f"o{O('close')} the session window closes", -36))
    fl, n0 = moth_flutter(rng)
    place(sfx, fl, n0, -41)
    place(sfx, tick(rng, 20, hp=900, lfsr=False), fr(O('mothLand')), -47)
    place(sfx, tick(rng, 30, hp=1500, lfsr=False) * 0.7, fr(O('mothLand') + 3), -49)
    cues.append(('moth (synth)', f"o{O('mothIn')}-o{O('mothLand') - 1} flutter (panned), o{O('mothLand')} touch, "
                 f"o{O('mothLand') + 3} fold", -41))
    servo = load('orb_servo')[:int(0.25 * SR)] * np.linspace(1, 0, int(0.25 * SR))[:, None] ** 2
    place(sfx, servo, fr(O('mothLand') + 2), -44)
    cues.append(('orb_servo (first 0.25 s, faded)', f"o{O('mothLand') + 2} the Orb's iris opens a touch", -44))

    mixb = m + sfx
    e = np.ones(n)                      # the file's edges: 4 ms in, 10 ms out
    e[:192] = np.linspace(0, 1, 192)
    e[-480:] = np.linspace(1, 0, 480)
    mixb *= e[:, None]
    lv = dict(music_lufs=round(float(lufs(m)), 2), sfx_lufs=round(float(lufs(sfx)), 2),
              mix_lufs=round(float(lufs(mixb)), 2), mix_true_peak_dbtp=round(tp_db(mixb), 2),
              music_true_peak_dbtp=round(tp_db(m), 2))
    if lv['mix_true_peak_dbtp'] > -1.0:
        g = -1.0 - lv['mix_true_peak_dbtp'] - 0.1
        mixb *= dbl(g)
        lv['trim_db'] = round(g, 2)
        lv['mix_true_peak_dbtp'] = round(tp_db(mixb), 2)
        lv['mix_lufs'] = round(float(lufs(mixb)), 2)
    # where the music is still sounding: short-term level of the music alone at key picture moments
    def st_db(o0, o1):
        seg = m[fr(o0):fr(o1)]
        return round(float(10 * np.log10(np.mean(seg ** 2) + 1e-12)), 1)
    lv['music_rms_db_at'] = {'o0-59 (the knee; the credits type)': st_db(0, 60),
                             'o60-119 (the answer; the terms print)': st_db(60, 120),
                             'o120-179 (the chord; the log holds)': st_db(120, 180),
                             "o180-224 (the title's stack; the log holds)": st_db(180, 225),
                             'o225-254 (home; the pull-back, the room)': st_db(225, 255),
                             'o255-284 (the cursor, the moth, black)': st_db(255, 285)}
    os.makedirs(OUTD, exist_ok=True)
    sf.write(f'{OUTD}/outro-a-ep1-mix.wav', mixb, SR, subtype='PCM_24')
    sf.write(f'{OUTD}/outro-a-ep1-temp-music.wav', m, SR, subtype='PCM_24')
    sf.write(f'{scratch}/sfx-only.wav', sfx, SR, subtype='PCM_24')
    for f in ('lookdev-outro-a-ep1-pianoroll.png', 'lookdev-outro-a-ep1.cue.json'):
        shutil.copy(f'{scratch}/music/{f}', f'{OUTD}/outro-a-ep1-temp-music-{f.split("-")[-1]}')
    return lv, cues


# ---------------------------------------------------------------- ffmpeg
def ff(*args):
    env = dict(os.environ, LD_LIBRARY_PATH=FFD)
    subprocess.run([f'{FFD}/ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', *args], check=True, env=env)


def probe(path):
    env = dict(os.environ, LD_LIBRARY_PATH=FFD)
    r = subprocess.run([f'{FFD}/ffprobe', '-v', 'error', '-show_entries',
                        'stream=codec_name,width,height,nb_frames,r_frame_rate,sample_rate,channels,pix_fmt:format=duration',
                        '-of', 'json', path], check=True, env=env, capture_output=True, text=True)
    return json.loads(r.stdout)


def mux(scratch):
    silent = f'{scratch}/outro-a-ep1-silent.mp4'
    dst = f'{OUTD}/outro-a-ep1-1080p.mp4'
    ff('-i', silent, '-i', f'{OUTD}/outro-a-ep1-mix.wav', '-map', '0:v', '-map', '1:a', '-c:v', 'copy',
       '-c:a', 'libfdk_aac', '-profile:a', 'aac_low', '-b:a', '256k', '-ar', '48000', '-ac', '2',
       '-metadata', 'title=MR. MAS · outro proposal A (lookdev mock-up, Ep1)',
       '-metadata', f'description=DRAFT, legal review pending. {NOTICE}',
       '-metadata', 'comment=LOOKDEV MOCK-UP, not a final. The full notice rides in the file metadata as one of the '
                    'places the on-screen pointer can rely on (OUTRO-PROPOSALS s1.1).',
       '-shortest', '-movflags', '+faststart', dst)
    shutil.copy(dst, f'{ROOT}/out/lookdev/outro/outro-a.mp4')
    return probe(dst)


def decode_frame(mp4, f, out_png, size=None):
    vf = f'trim=start_frame={f}:end_frame={f + 1}' + (f',scale={size[0]}:{size[1]}:flags=area' if size else '')
    ff('-i', mp4, '-vf', vf, '-vsync', '0', '-frames:v', '1', out_png)
    return Image.open(out_png).convert('RGB')


# ---------------------------------------------------------------- read times
def read_times():
    """per-line read time at 15 cps (from the frame a line is complete to the frame it leaves)"""
    rows = []
    for b in L['boxes']:
        on_s = (b['o1'] + 1 - b['o0']) / FPS
        need = len(b['text']) / CPS_READ
        rows.append(dict(line=b['name'], kind=b['kind'], chars=len(b['text']), words=len(b['text'].split()),
                         from_o=b['from'], complete_o=b['o0'], on_screen_s=round(on_s, 2),
                         read_s_at_15cps=round(need, 2), ok=on_s >= need, margin_s=round(on_s - need, 2)))
    return rows


def one_pass(cps=None, wps=None, glance=True):
    """A first-time reader reads the card top to bottom, once. They can start a line from its first visible
    character (the typing is faster than reading, so they never catch the typing head) and read at `cps`
    characters a second (or `wps` words a second). glance=True: the title bar and the header are skimmed in 0.4 s
    each; glance=False: they are read in full too. Returns where the reader is when the card leaves."""
    t = None
    path = []
    for b in L['boxes']:
        start = b['from'] if t is None else max(t, b['from'])
        if b['kind'] == 'glance' and glance:
            dur = 0.4 * FPS
        elif cps:
            dur = len(b['text']) / cps * FPS
        else:
            dur = len(b['text'].split()) / wps * FPS
        t = start + dur
        path.append((b['name'], round(start, 1), round(t, 1)))
    # the pull-back's first two drawings (LCD rows, the bezel coming in 9 and 20 px) leave the pane's text intact:
    # the card is readable until the room's first frame
    leave = L['O']['room']
    return dict(rate=f'{cps} cps' if cps else f'{wps} words/s', glance_title_header=glance,
                reader_done_o=round(t, 1), card_readable_until_o=leave - 1, margin_s=round((leave - t) / FPS, 2),
                one_pass_ok=t <= leave, path=path)


def whole_text():
    words = sum(len(b['text'].split()) for b in L['boxes'])
    chars = sum(len(b['text']) for b in L['boxes'])
    must = [b for b in L['boxes'] if b['kind'] == 'read']
    return dict(total_words=words, total_chars=chars, must_read_words=sum(len(b['text'].split()) for b in must),
                must_read_chars=sum(len(b['text']) for b in must), text_blocks_on_screen=1,
                card_up_s=round((L['O']['pull'] - L['O']['paneFull']) / FPS, 2),
                terms_up_s=round((L['TERMS_ON'][1] + 1 - L['TERMS_ON'][0]) / FPS, 2),
                pointer_up_s=round((L['TERMS_ON'][1] + 1 - L['O']['pointer']) / FPS, 2),
                typing_done_o=L['typing'][-1][1],
                one_pass=[one_pass(cps=25), one_pass(cps=20), one_pass(cps=15), one_pass(wps=4.0),
                          one_pass(cps=25, glance=False)])


# ---------------------------------------------------------------- sheets
def font(sz, bold=False):
    return ImageFont.truetype(FONT_B if bold else FONT, sz)


def bar_beat(o):
    b, beat, k = o // 60 + 1, (o % 60) // 15 + 1, o % 15
    return f'{b}.{beat}' + (f' +{k}f' if k else '')


def keyframes_sheet(frames, eng_dir, dst, reader):
    """6 frames (numbered, 3 x 2) and under them a to-scale outline of the 270 frames: picture, typing, the legal
    block, where a first-time reader is (25 cps), the moth, the cursor, the music; and the 8.75 s cut it replaces,
    drawn underneath at the same scale for comparison"""
    OUT = L['OUT']
    tw, th = 640, 360
    pad, cap = 24, 58
    W = 3 * tw + 4 * pad
    strip_h = 360
    H = 90 + 2 * (th + cap) + pad * 2 + strip_h
    im = Image.new('RGB', (W, H), (14, 15, 20))
    d = ImageDraw.Draw(im)
    d.text((pad, 22), f'OUTRO A · the closing session · Ep1 · {OUT} frames, {OUT / FPS:.3g} s ({OUT / 60:g} bars at 96 BPM) · '
           'LOOKDEV MOCK-UP', font=font(26, True), fill=(233, 230, 218))
    d.text((pad, 58), 'Frames are outro frames (o0 = first frame after the episode). One block of text in one face, read '
           'top to bottom once; one move outward. Legal text: DRAFT, review pending.', font=font(18), fill=(150, 156, 170))
    for k, (o, what) in enumerate(frames):
        x = pad + (k % 3) * (tw + pad)
        y = 90 + (k // 3) * (th + cap)
        f = Image.open(f'{eng_dir}/o{o}.png').convert('RGB').resize((tw, th), Image.NEAREST)
        im.paste(f, (x, y))
        d.rectangle([x, y, x + 40, y + 36], fill=(236, 74, 74))
        d.text((x + 10, y + 4), str(k + 1), font=font(26, True), fill=(10, 10, 12))
        d.text((x, y + th + 6), f'o{o} · {o / FPS:5.2f} s · bar {bar_beat(o)}', font=font(18, True), fill=(127, 230, 222))
        d.text((x, y + th + 30), what, font=font(18), fill=(233, 230, 218))
    # the outline strip (to scale): 300 frames wide
    y0 = 90 + 2 * (th + cap) + pad
    x0, x1 = pad + 190, W - pad
    sx = lambda o: x0 + (x1 - x0) * o / 300  # noqa: E731
    pull, close, curs, land = O('pull'), O('close'), O('cursorOn'), O('mothLand')
    rd = [(a, b) for name, a, b in reader['path'] if name not in ('title bar', 'header')]
    lanes = [
        ('picture', [(0, 3, '', (90, 96, 120)), (3, pull, 'INSERT · the session log (1-bit pane, one block)', (200, 196, 180)),
                     (pull, O('room') + 2, '', (90, 96, 120)), (O('room') + 2, close, 'ROOM', (54, 66, 110)),
                     (close, close + 3, '', (40, 40, 44)), (close + 3, O('fade'), 'dark', (34, 40, 70)),
                     (O('fade'), O('black'), '', (24, 28, 50)), (O('black'), OUT, '', (0, 0, 0))]),
        ('typing', [(O('header'), O('header') + 1, '', (127, 230, 222))] + [(s_, e + 1, '', (127, 230, 222)) for s_, e in L['typing']]),
        ('terms', [(L['TERMS_ON'][0], L['TERMS_ON'][1] + 1,
                    f"the terms print whole o{L['TERMS_ON'][0]}, held to o{L['TERMS_ON'][1]} = "
                    f"{(L['TERMS_ON'][1] + 1 - L['TERMS_ON'][0]) / FPS:.2f} s", (233, 230, 218))]),
        ('pointer', [(O('pointer'), L['TERMS_ON'][1] + 1, f"o{O('pointer')}-o{L['TERMS_ON'][1]} = "
                      f"{(L['TERMS_ON'][1] + 1 - O('pointer')) / FPS:.2f} s", (200, 196, 180))]),
        ('reader 25 cps', [(a_, b_, '', (236, 147, 56) if i % 2 == 0 else (190, 110, 40)) for i, (a_, b_) in enumerate(rd)]
         + [(rd[-1][1], rd[-1][1] + 1, '', (236, 74, 74))]),
        ('moth', [(O('mothIn'), land, 'flies in', (143, 138, 122)), (land, O('black'), 'settled', (106, 84, 96))]),
        ('cursor', [(o, o + 8, '', (127, 230, 222)) for o in range(curs, O('lastBlink') + 1, 15)]),
        ('music', [(0, 60, 'THE KNEE, whole, swung', (236, 147, 56)), (60, 120, 'answer · F on 2.4', (150, 110, 70)),
                   (120, 180, 'F-C-G, no third', (110, 90, 70)), (180, 225, "title's stack", (90, 80, 90)),
                   (225, 255, 'home', (80, 80, 110)), (255, OUT, 'f0 glint', (70, 90, 150))]),
        ('before (8.75 s)', [(0, 3, '', (90, 96, 120)), (3, 150, 'INSERT · log + a 2nd block in the band', (120, 116, 104)),
                             (150, 210, 'ROOM', (54, 66, 110))]),
    ]
    lh = 36
    for i, (name, spans) in enumerate(lanes):
        yy = y0 + 20 + i * lh
        d.text((pad, yy + 6), name, font=font(17, True), fill=(180, 186, 200) if 'before' not in name else (120, 124, 136))
        d.rectangle([x0, yy, x1, yy + lh - 8], fill=(24, 26, 34))
        for a, b, label, col in spans:
            d.rectangle([sx(a), yy, max(sx(b) - 1, sx(a) + 2), yy + lh - 8], fill=col)
            if label:
                lum = sum(col) / 3
                d.text((sx(a) + 6, yy + 5), label, font=font(15), fill=(10, 10, 12) if lum > 120 else (233, 230, 218))
    yy = y0 + 20 + len(lanes) * lh
    for o in range(0, 301, 15):
        big = o % 60 == 0
        d.line([sx(o), yy - 4, sx(o), yy + (10 if big else 4)], fill=(150, 156, 170) if big else (80, 84, 96))
        if big:
            d.text((sx(o) + 3, yy + 6), f'o{o} · bar {o // 60 + 1}' if o < 300 else 'o300', font=font(14), fill=(150, 156, 170))
    d.line([sx(OUT), y0 + 14, sx(OUT), yy - 6], fill=(236, 74, 74), width=2)
    lab = f'out o{OUT - 1} ({OUT / FPS:.3g} s)'
    lw = d.textlength(lab, font=font(15, True))
    d.text((sx(OUT) + 6 if sx(OUT) + 6 + lw < W - 4 else sx(OUT) - 6 - lw, y0 - 2), lab, font=font(15, True), fill=(236, 74, 74))
    for k, (o, _) in enumerate(frames):
        d.text((sx(o) - 5, y0 - 2), str(k + 1), font=font(16, True), fill=(236, 74, 74))
    im.save(dst, optimize=True)


def variants_sheet(eng_dir, dst):
    items = [
        ('var-ep1.png', 'Ep1 · 1-BIT terminal (the mock-up)', 'paper on black, fixed-width, block cursor; the legal block last'),
        ('var-ep6.png', 'Ep6 · BASE UI skin (ep1.5_backstop.xlsx)', "the Orb's toast family, proportional face"),
        ('var-ep10.png', 'Ep10 · the machine types (ep1.9_pace.yaml)', 'it adds a "reviewed by  a human" line and ticks it itself'),
        ('var-ep10-keys.png', 'Ep10 · INSERT: the keys go down, no hands', 'H down, U 2/3, M 1/3: ahead of any typist'),
    ]
    tw, th, pad, cap = 800, 450, 24, 64
    W = 2 * tw + 3 * pad
    H = 80 + 2 * (th + cap) + pad
    im = Image.new('RGB', (W, H), (14, 15, 20))
    d = ImageDraw.Draw(im)
    d.text((pad, 22), "OUTRO A · the pane matures across the season (the legal block's words never change)",
           font=font(26, True), fill=(233, 230, 218))
    for k, (f, t1, t2) in enumerate(items):
        x = pad + (k % 2) * (tw + pad)
        y = 70 + (k // 2) * (th + cap)
        im.paste(Image.open(f'{eng_dir}/{f}').convert('RGB').resize((tw, th), Image.NEAREST), (x, y))
        d.text((x, y + th + 8), t1, font=font(19, True), fill=(127, 230, 222))
        d.text((x, y + th + 34), t2, font=font(17), fill=(200, 200, 205))
    im.save(dst, optimize=True)


# ---------------------------------------------------------------- QA on the encoded mp4
PROBE_OS = [30, 60, 100, 150, 219]


def qa_frames(scratch, mp4, eng_dir):
    qd = f'{scratch}/qa'
    os.makedirs(qd, exist_ok=True)
    checks = []
    for o in PROBE_OS:
        f = L['PRE'] + o
        full = decode_frame(mp4, f, f'{qd}/mp4-o{o}-1080.png')
        small = decode_frame(mp4, f, f'{qd}/mp4-o{o}-480.png', (480, 270))
        ref = Image.open(f'{eng_dir}/o{o}.png').convert('RGB')          # native 480x270, exact engine pixels
        assert ref.size == (480, 270)
        a_ref = np.asarray(ref).astype(np.int16)
        a_s = np.asarray(small).astype(np.int16)
        a_f = np.asarray(full.resize((480, 270), Image.NEAREST)).astype(np.int16)
        for b in L['boxes']:
            if not (b['o0'] <= o <= b['o1']):
                continue
            x0, y0, x1, y1 = b['box']
            r = a_ref[y0:y1, x0:x1]
            es = np.abs(a_s[y0:y1, x0:x1] - r).max(axis=2)
            ef = np.abs(a_f[y0:y1, x0:x1] - r).max(axis=2)
            lum = (0.2126 * a_s[y0:y1, x0:x1, 0] + 0.7152 * a_s[y0:y1, x0:x1, 1] + 0.0722 * a_s[y0:y1, x0:x1, 2])
            lo, hi = np.percentile(lum, 5), np.percentile(lum, 95)
            checks.append(dict(o=o, line=b['name'], max_err_1080=int(ef.max()), max_err_480=int(es.max()),
                               px_off_by_gt_24_480=int((es > 24).sum()), text_contrast_480=round(float(hi - lo), 1)))
    # QA crops for eyes: the pane at 1080p, the whole frame at 480x270 shown at 2x, the room frames at 480x270
    Image.open(f'{qd}/mp4-o150-1080.png').crop((360, 200, 1560, 900)).save(f'{qd}/crop-o150-pane-1080.png')
    Image.open(f'{qd}/mp4-o150-480.png').resize((960, 540), Image.NEAREST).save(f'{qd}/view-o150-480-at2x.png')
    for o in [k['o'] for k in L['KEY_STILLS'][1:]]:
        decode_frame(mp4, L['PRE'] + o, f'{qd}/mp4-o{o}-480.png', (480, 270)).resize((960, 540), Image.NEAREST) \
            .save(f'{qd}/view-o{o}-480-at2x.png')
    return checks


def main():
    global L
    ap = argparse.ArgumentParser()
    ap.add_argument('--scratch', required=True)
    ap.add_argument('--skip-mix', action='store_true')
    a = ap.parse_args()
    S = a.scratch
    os.makedirs(OUTD, exist_ok=True)
    eng1, eng4 = f'{S}/eng1x', f'{S}/eng4x'
    engine(S, eng1, 1, ['layout'])
    L = json.load(open(f'{eng1}/layout.json'))
    report = {'length': dict(frames=L['OUT'], seconds=L['OUT'] / FPS, mockup_frames=L['PRE'] + L['OUT'],
                             mockup_seconds=(L['PRE'] + L['OUT']) / FPS, was_seconds=[12.5, 8.75])}
    if not a.skip_mix:
        lv, cues = mix(S)
        report['audio'] = lv
        report['sfx_cues'] = [dict(sfx=c, where=w, gain_db=g) for c, w, g in cues]
    report['mp4'] = mux(S)
    mp4 = f'{OUTD}/outro-a-ep1-1080p.mp4'

    strip = [s['o'] for s in L['STRIP']]
    keys = [(s['name'], s['o']) for s in L['KEY_STILLS']]
    engine(S, eng1, 1, [f'o:{o}' for o in sorted(set(strip + PROBE_OS))] +
           [f'var:{v}' for v in ('ep1', 'ep6', 'ep10', 'ep10-keys')])
    engine(S, eng4, 4, [f'o:{o}' for _, o in keys] + ['var:ep10', 'var:ep10-keys', 'var:ep6'])
    for i, (name, o) in enumerate(keys):
        shutil.copy(f'{eng4}/o{o}.png', f'{OUTD}/outro-a-still-{i + 1}-{name}-o{o}.png')
    shutil.copy(f'{eng4}/var-ep10.png', f'{OUTD}/outro-a-ep10-still.png')
    shutil.copy(f'{eng4}/var-ep10-keys.png', f'{OUTD}/outro-a-ep10-keys-still.png')
    shutil.copy(f'{eng4}/var-ep6.png', f'{OUTD}/outro-a-ep6-still.png')
    keyframes_sheet([(s['o'], s['what']) for s in L['STRIP']], eng1, f'{OUTD}/outro-a-keyframes.png', one_pass(cps=25))
    variants_sheet(eng1, f'{OUTD}/outro-a-variants.png')

    report['text_qa'] = qa_frames(S, mp4, eng1)
    rows = read_times()
    report['read_times'] = rows
    whole = whole_text()
    report['whole_text'] = whole
    so = L['KEY_STILLS'][0]['o']
    decode_frame(mp4, L['PRE'] + so, f'{S}/qa/mp4-o{so}-1080.png')
    e4 = np.asarray(Image.open(f'{eng4}/o{so}.png').convert('RGB')).astype(np.int16)
    d4 = np.asarray(Image.open(f'{S}/qa/mp4-o{so}-1080.png').convert('RGB')).astype(np.int16)
    report['still_vs_mp4'] = dict(o=so, mean_abs=round(float(np.abs(e4 - d4).mean()), 3),
                                  p99=float(np.percentile(np.abs(e4 - d4).max(axis=2), 99)))
    with open(f'{OUTD}/outro-a-qa.json', 'w') as fh:
        json.dump(report, fh, indent=1, ensure_ascii=False)
    worst = max(report['text_qa'], key=lambda c: c['max_err_480'])
    print(json.dumps(dict(length=report['length'], audio=report.get('audio'), mp4=report['mp4'], worst_text=worst,
                          read_ok=all(r['ok'] for r in rows), thinnest=min(rows, key=lambda r: r['margin_s']),
                          whole={k: v for k, v in whole.items() if k != 'one_pass'},
                          one_pass=[{k: v for k, v in p.items() if k != 'path'} for p in whole['one_pass']],
                          still_vs_mp4=report['still_vs_mp4']), indent=1, ensure_ascii=False))


if __name__ == '__main__':
    main()
