#!/usr/bin/env python
"""MR. MAS · style range · Ep1: the prototype review reel and its key-still sheet (style-range §6.1b).

INTERNAL ONLY: it carries Act Four (sc 30) and the tag (sc 32). The same approach as `reel.py` (the season
prototypes' reel), pointed at the four polished Ep1 outputs, in the pilot's scene order:

    slate 1 · E1-P1 (sc 11) · 1 s black · slate 2 · E1-P3 (sc 30) · 1 s black ·
    slate 3 · E1-P2 A (sc 32) · 1 s black · slate 4 · E1-P2 B (sc 32) · 1 s black

1920x1080, 24 fps, each clip's own sound, kept at its delivered level. The bundled ffmpeg is a minimal build (no
drawtext / overlay / fade, no rawvideo), so the slates and the black are PIL-drawn PNG sequences in scratch, and one
ffmpeg run joins them with the four mp4s through the `concat` filter and encodes once (x264 crf 14, slow). The clips
are decoded straight into the encode. Audio is each clip's mix, sample-exact to its frames (2000 samples a frame at
48 kHz), with 5 ms edge ramps against clicks, and digital silence under the slates and the black. E1-P3's soft
subtitle track (mov_text, English) is stream-copied into the reel, shifted to where the clip starts.

    ../ops/heavy.sh audio/.venv-mix/bin/python studio/src/dev/range/tools/reel_ep1.py [--slates-only] [scratchDir]
    (run from the repo root; the heavy guard is ops/heavy.sh)

Writes out/lookdev/range/ep1/ep1-range-reel.mp4 and out/lookdev/range/ep1/ep1-range-sheet.png (one key still per output, taken
from the encoded reel). Scratch (a few hundred mostly black PNGs, the wavs, check stills) goes in
<scratchDir>/ep1reel-work and is deleted at the end.
"""
import json
import os
import shutil
import subprocess
import sys
import tempfile

import numpy as np
import soundfile as sf
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
STUDIO = os.path.abspath(os.path.join(HERE, '..', '..', '..', '..'))
ROOT = os.path.dirname(STUDIO)
SRC = os.path.join(ROOT, 'out/lookdev/range/ep1')
OUT_MP4 = os.path.join(SRC, 'ep1-range-reel.mp4')
OUT_SHEET = os.path.join(SRC, 'ep1-range-sheet.png')
FFD = os.path.join(STUDIO, 'node_modules', '@remotion', 'compositor-linux-x64-gnu')
FF = os.path.join(FFD, 'ffmpeg')
FFP = os.path.join(FFD, 'ffprobe')
ENV = dict(os.environ, LD_LIBRARY_PATH=FFD)
THREADS = os.environ.get('REEL_THREADS', '6')

W, H, FPS, SR = 1920, 1080, 24, 48000
SPF = SR // FPS                      # 2000 samples a frame
SLATE_F, BLACK_F, FADE_F = 84, 24, 8  # 3.5 s slate (8 f in and out of black), 1 s of black
RAMP = int(0.005 * SR)               # 5 ms edge ramps

MONO = '/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf'
MONO_B = '/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf'
INK, DIM, FAINT, CYAN, AMBER = (232, 228, 218), (150, 156, 168), (92, 98, 112), (95, 211, 208), (226, 170, 92)

HEADER = 'MR. MAS  ·  STYLE RANGE  ·  EP1 PROTOTYPE REEL  ·  INTERNAL, CONTAINS ACT FOUR AND THE TAG  ·  2026-09-27'

DUCK = 'Near-photoreal product film (Blender EEVEE, a procedural duck) in the dark room\'s monitor'
DUCK_MOMENT = ['1.H  sc 32, THE TAG: ELGOOG\'S DEMO (DEC 6, 2023)  →  the pixel [2S]',
               'Ep1 · the tag · owner: BRANDS (ELGOOG\'s film as it wanted to be seen), exposed as staged']

# file, tag, frames, slate text; `sheet` = (frame, caption head, caption line) for the key still.
CLIPS = [
    dict(file='ep1-p1', tag='E1-P1', n=660,
         id='E1-P1 · CLOD UNDER ITS LAUNCH LIGHT', tier='TIER 2 · IN THE PANE',
         tier_note='a leap inside a frame the story already shows',
         medium=['Claymation: CLOD alone, a stop-motion puppet on 2s (three.js on the iGPU)',
                 'everything else pixel, band on screen · no switch: the light stays on to the cut'],
         moment=['1.A  sc 11, THE SPLIT-SCREEN DUEL (MAR 14, 2023)  →  the cut to sc 12',
                 'Ep1 · Act One · owner: BRANDS (MISANTHROPIC\'s launch, CLOD\'s first appearance)'],
         notes='27.5 s  ·  pixel → clay under the can-light → pixel sc 12  ·  temp sound, stock voices, all code  ·  '
               'final: R22, open',
         sheet=(268, 'E1-P1 · TIER 2 · claymation in the pane',
                '1.A sc 11, the duel · p268: CLOD in clay, up out of its bow; CLOD 1 · SAME DAY')),
    dict(file='ep1-p3', tag='E1-P3', n=437, subs=True,
         id='E1-P3 · BELOW, ABOVE, AROUND', tier='TIER 2 · FULL ROOM',
         tier_note='the one leap with no frame: the landlord is the frame',
         medium=['Flat corporate vector illustration: MACROSOFT\'s house style takes the bullpen',
                 'Mas, his desk and Tasya stay pixel · on Act Four\'s recorded v5 takes'],
         moment=['1.D  sc 30, THE RETURN, the landlord beat (NOV 20, 2023)  →  hard cut to S7.05',
                 'Ep1 · Act Four · owner: BRANDS (the landlord\'s own self-presentation)'],
         notes='18.2 s  ·  pixel → vector on three words, around the one pixel man → pixel boardroom  ·  '
               'v5 mix + temp  ·  final: CODE',
         sheet=(318, 'E1-P3 · TIER 2 · flat vector, the full room',
                '1.D sc 30, the landlord beat · p318: his house style; Tasya and Mas stay pixel')),
    dict(file='ep1-p2', tag='E1-P2 A', n=264,
         id='E1-P2 · WHAT THE QUACK · CUT A', tier='TIER 2 · IN A BEZEL',
         tier_note='the pilot\'s only near-photoreal image (R20)',
         medium=[DUCK, 'cut A, THE RAMP: the film drops to 2s, 4s and 8s, then its contact sheet of stills'],
         moment=DUCK_MOMENT,
         notes='11.0 s  ·  pixel bezel → film on 1s → the ramp → pixel [2S]  ·  temp sound  ·  '
               'final: VIDEO, the first outside-layer test (R23)',
         sheet=(40, 'E1-P2 A · TIER 2 · near-photoreal film in a bezel',
                '1.H sc 32, the tag · p040: the film on 1s (the same in both cuts to p71)')),
    dict(file='ep1-p2-b', tag='E1-P2 B', n=216,
         id='E1-P2 · WHAT THE QUACK · CUT B', tier='TIER 2 · IN A BEZEL',
         tier_note='the same film; A and B compete',
         medium=[DUCK, 'cut B, THE BREAK: at p72 the film snaps straight to its contact sheet of stills'],
         moment=DUCK_MOMENT,
         notes='9.0 s  ·  whichever cut the blind readers call "faked" sooner wins; a tie goes to B (shorter)  ·  '
               'temp sound',
         sheet=(122, 'E1-P2 B · the break',
                '1.H sc 32 · p122: the break held, the six stills and the caption')),
]


def ff(*args, **kw):
    return subprocess.run([FF, '-hide_banner', '-loglevel', 'error', *args], env=ENV, check=True, **kw)


def draw_slate(c, k, total):
    img = Image.new('RGB', (W, H), (0, 0, 0))
    d = ImageDraw.Draw(img)
    f_head, f_id, f_tier = ImageFont.truetype(MONO, 20), ImageFont.truetype(MONO_B, 56), ImageFont.truetype(MONO_B, 30)
    f_med, f_mom, f_note = ImageFont.truetype(MONO, 28), ImageFont.truetype(MONO, 26), ImageFont.truetype(MONO, 20)
    x = 168
    d.text((x, 150), HEADER, font=f_head, fill=FAINT)
    y = 380
    d.text((x, y), c['id'], font=f_id, fill=INK)
    idw = d.textlength(c['id'], font=f_id)
    d.text((x + idw + 18, y + 26), f'{k + 1} of {total}', font=f_head, fill=FAINT)
    y += 92
    d.text((x, y), c['tier'], font=f_tier, fill=CYAN if c['tier'].startswith('TIER 2') else AMBER)
    if c['tier_note']:
        tw = d.textlength(c['tier'], font=f_tier)
        d.text((x + tw + 22, y + 8), c['tier_note'], font=f_note, fill=DIM)
    y += 58
    for i, line in enumerate(c['medium']):
        d.text((x, y), line, font=f_med, fill=INK if i == 0 else DIM)
        y += 40
    y += 22
    d.line([(x, y), (x + 64, y)], fill=FAINT, width=2)
    y += 22
    for i, line in enumerate(c['moment']):
        d.text((x, y), line, font=f_mom, fill=INK if i == 0 else DIM)
        y += 38
    y += 30
    d.text((x, y), c['notes'], font=f_note, fill=FAINT)
    # every line must sit inside the 168 px side margins
    for s, f in [(HEADER, f_head), (c['notes'], f_note)] + [(m, f_med) for m in c['medium']] + [(m, f_mom) for m in c['moment']]:
        assert d.textlength(s, font=f) <= W - 2 * x, (c['tag'], s, d.textlength(s, font=f))
    base = np.asarray(img)
    frames = []
    for i in range(SLATE_F):
        t = min(1.0, (i + 1) / FADE_F, (SLATE_F - i) / FADE_F)
        frames.append((base.astype(np.float32) * t).astype(np.uint8) if t < 1 else base)
    return frames


def make_sheet(stills):
    pad, tw, th, head, cap = 24, 960, 540, 104, 70
    sw, sh = pad * 3 + tw * 2, head + 2 * (th + cap) + pad
    sheet = Image.new('RGB', (sw, sh), (7, 8, 11))
    d = ImageDraw.Draw(sheet)
    d.text((pad, 20), 'MR. MAS · STYLE RANGE · EP1 · THE FOUR POLISHED OUTPUTS · one key still each, from the encoded reel',
           font=ImageFont.truetype(MONO_B, 26), fill=INK)
    d.text((pad, 60), 'ep1-range-reel.mp4 = slate · E1-P1 · black · slate · E1-P3 · black · slate · E1-P2 A · black · '
           'slate · E1-P2 B · black   ·   internal   ·   2026-09-27', font=ImageFont.truetype(MONO, 18), fill=DIM)
    f1, f2 = ImageFont.truetype(MONO_B, 20), ImageFont.truetype(MONO, 17)
    for i, c in enumerate(CLIPS):
        cx, cy = pad + (i % 2) * (tw + pad), head + (i // 2) * (th + cap)
        sheet.paste(Image.fromarray(stills[c['tag']]).resize((tw, th), Image.LANCZOS), (cx, cy))
        _, a, b = c['sheet']
        assert d.textlength(b, font=f2) <= tw, (c['tag'], b)
        d.text((cx, cy + th + 10), a, font=f1, fill=CYAN)
        d.text((cx, cy + th + 38), b, font=f2, fill=DIM)
    return sheet


def loudness(path):
    r = subprocess.run([FF, '-hide_banner', '-nostats', '-i', path, '-vn', '-af', 'loudnorm=print_format=json',
                        '-f', 'null', '-'], env=ENV, capture_output=True, text=True, check=True)
    s = r.stderr
    j = json.loads(s[s.rindex('{'):s.rindex('}') + 1])
    return float(j['input_i']), float(j['input_tp'])


def grab(path, frame, dst):
    """One frame of an mp4 as RGB, decoded by the same ffmpeg. Accurate input seek to a quarter frame before it,
    so the frame before is dropped and this one is the first kept."""
    seek = ['-ss', f'{(frame - 0.25) / FPS:.6f}'] if frame else []
    ff('-y', *seek, '-i', path, '-frames:v', '1', dst)
    return np.asarray(Image.open(dst).convert('RGB'))


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    slates_only = '--slates-only' in sys.argv
    tmp = os.path.join(args[0], 'ep1reel-work') if args else tempfile.mkdtemp(prefix='ep1reel-')
    os.makedirs(tmp, exist_ok=True)
    try:
        slates = [draw_slate(c, i, len(CLIPS)) for i, c in enumerate(CLIPS)]
        if slates_only:
            for c, s in zip(CLIPS, slates):
                Image.fromarray(s[SLATE_F // 2]).save(os.path.join(os.path.dirname(tmp), f'slate-{c["file"]}.png'))
            print('slates in', os.path.dirname(tmp))
            return

        # --- audio first: the encoder takes the finished wav
        aud, marks, k = [], [], 0
        for i, c in enumerate(CLIPS):
            aud.append(np.zeros((SLATE_F * SPF, 2), np.float32))
            marks.append((f'slate {i + 1}', k, SLATE_F)); k += SLATE_F
            wav = os.path.join(tmp, c['file'] + '.wav')
            ff('-y', '-i', os.path.join(SRC, c['file'] + '.mp4'), '-vn', '-ac', '2', '-ar', str(SR), '-c:a', 'pcm_s16le', wav)
            x, sr = sf.read(wav, dtype='float32', always_2d=True)
            assert sr == SR, sr
            n = c['n'] * SPF
            print(f'{c["tag"]}: {len(x)} samples decoded, {n} kept ({(len(x) - n) / SR * 1000:+.1f} ms of codec tail dropped); '
                  f'edge peaks {np.abs(x[:RAMP]).max():.3f} / {np.abs(x[n - RAMP:n]).max():.3f}')
            x = x[:n] if len(x) >= n else np.vstack([x, np.zeros((n - len(x), 2), np.float32)])
            ramp = np.linspace(0, 1, RAMP, dtype=np.float32)[:, None]
            x[:RAMP] *= ramp
            x[-RAMP:] *= ramp[::-1]
            aud.append(x)
            marks.append((c['tag'], k, c['n'])); k += c['n']
            aud.append(np.zeros((BLACK_F * SPF, 2), np.float32))
            marks.append(('black', k, BLACK_F)); k += BLACK_F
            os.remove(wav)
        reel_wav = os.path.join(tmp, 'reel.wav')
        sf.write(reel_wav, np.vstack(aud), SR, subtype='PCM_24')
        total = k
        start = {m[0]: m[1] for m in marks}

        # --- the PNG sequences: pre_i = (1 s black, unless first) + slate_i; tail = 1 s black
        black = Image.new('RGB', (W, H), (0, 0, 0))
        seqs = []
        for i, s in enumerate(slates):
            d = os.path.join(tmp, f'pre{i + 1}'); os.makedirs(d, exist_ok=True)
            frames = ([None] * BLACK_F if i else []) + s
            for j, fr in enumerate(frames):
                (black if fr is None else Image.fromarray(fr)).save(os.path.join(d, f'f{j:03d}.png'), compress_level=1)
            seqs.append((d, len(frames)))
        d = os.path.join(tmp, 'tail'); os.makedirs(d, exist_ok=True)
        for j in range(BLACK_F):
            black.save(os.path.join(d, f'f{j:03d}.png'), compress_level=1)
        tail = (d, BLACK_F)

        # --- one encode: pre1 c1 pre2 c2 pre3 c3 pre4 c4 tail, through concat; E1-P3's subtitles copied, shifted
        cmd, n_in = [FF, '-hide_banner', '-loglevel', 'error', '-y'], 0
        for (d, _), c in zip(seqs, CLIPS):
            cmd += ['-framerate', str(FPS), '-i', os.path.join(d, 'f%03d.png'), '-i', os.path.join(SRC, c['file'] + '.mp4')]
            n_in += 2
        cmd += ['-framerate', str(FPS), '-i', os.path.join(tail[0], 'f%03d.png'), '-i', reel_wav]
        n_in += 1
        wav_in, sub_maps = n_in, []
        for c in CLIPS:
            if c.get('subs'):
                cmd += ['-itsoffset', f'{start[c["tag"]] / FPS:.6f}', '-i', os.path.join(SRC, c['file'] + '.mp4')]
                sub_maps += ['-map', f'{wav_in + 1 + len(sub_maps) // 2}:s:0']
        fc = ''.join(f'[{j}:v]format=yuv420p[v{j}];' for j in range(n_in))
        fc += ''.join(f'[v{j}]' for j in range(n_in)) + f'concat=n={n_in}:v=1:a=0[v]'
        cmd += ['-filter_complex', fc, '-map', '[v]', '-map', f'{wav_in}:a', *sub_maps,
                '-c:v', 'libx264', '-preset', 'slow', '-crf', '14', '-threads', THREADS, '-pix_fmt', 'yuv420p',
                '-c:a', 'aac', '-b:a', '256k', '-ar', str(SR)]
        if sub_maps:
            cmd += ['-c:s', 'copy', '-metadata:s:s:0', 'language=eng', '-metadata:s:s:0', 'title=E1-P3 dialogue']
        cmd += ['-movflags', '+faststart', OUT_MP4]
        subprocess.run(cmd, env=ENV, check=True)
        for d, _ in seqs + [tail]:
            shutil.rmtree(d)

        # --- check the encode, and pull the sheet's stills from the encoded reel
        r = subprocess.run([FFP, '-v', 'error', '-count_frames', '-show_entries',
                            'stream=codec_type,codec_name,nb_read_frames,width,height,r_frame_rate,duration', '-of', 'compact',
                            OUT_MP4], env=ENV, capture_output=True, text=True, check=True)
        print(f'reel streams:\n{r.stdout.strip()}\nwanted {total} frames ({total / FPS:.3f} s)')
        if sub_maps:
            r = subprocess.run([FFP, '-v', 'error', '-select_streams', 's', '-show_entries', 'packet=pts_time', '-of', 'csv=p=0',
                                OUT_MP4], env=ENV, capture_output=True, text=True, check=True)
            pts = [float(v) for v in r.stdout.split()]
            print(f'subtitle packets: {len(pts)}, first {pts[0]:.3f} s, last {pts[-1]:.3f} s '
                  f'(E1-P3 starts {start["E1-P3"] / FPS:.3f} s)')
        stills = {}
        for c in CLIPS:
            src = os.path.join(SRC, c['file'] + '.mp4')
            key = c['sheet'][0]
            for f in sorted({0, c['n'] // 2, c['n'] - 1, key}):
                a = grab(src, f, os.path.join(tmp, 'src.png')).astype(np.int16)
                b = grab(OUT_MP4, start[c['tag']] + f, os.path.join(tmp, 'reel.png'))
                dv = np.abs(b.astype(np.int16) - a)
                print(f'  {c["tag"]:8s} p{f:03d} (reel f{start[c["tag"]] + f:04d}): vs source mean {dv.mean():.2f}, '
                      f'99.9th pct {int(np.percentile(dv, 99.9))} levels')
                if f == key:
                    stills[c['tag']] = b
        for name, s0, n in marks:
            if name == 'black':
                b = grab(OUT_MP4, s0 + n // 2, os.path.join(tmp, 'reel.png'))
                print(f'  black f{s0 + n // 2:04d}: max level {int(b.max())}')
        make_sheet(stills).save(OUT_SHEET, optimize=True)
        for c in CLIPS:
            i, tp = loudness(os.path.join(SRC, c['file'] + '.mp4'))
            print(f'  {c["file"]}.mp4: {i:.1f} LUFS, {tp:.1f} dBTP')
        i, tp = loudness(OUT_MP4)
        print(f'  ep1-range-reel.mp4: {i:.1f} LUFS, {tp:.1f} dBTP, {os.path.getsize(OUT_MP4) / 1e6:.1f} MB')
        print('segments:')
        for name, s0, n in marks:
            print(f'  {name:8s} f{s0:04d}–{s0 + n - 1:04d}  {s0 / FPS:6.2f}–{(s0 + n) / FPS:6.2f} s')
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


if __name__ == '__main__':
    main()
