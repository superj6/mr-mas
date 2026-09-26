#!/usr/bin/env python
"""MR. MAS · style range: the prototype review reel and its key-still sheet.

INTERNAL ONLY. P1 carries J4, P2 is Ep11's cliff and P3 is Ep12's reconstruction: the reel never leaves the room.

    slate 1 · p1 · 1 s black · slate 2 · p2 · 1 s black · slate 3 · p3 · 1 s black · slate 4 · p4 · 1 s black

1920x1080, 24 fps, each clip's own sound. The bundled ffmpeg is a minimal build: no drawtext / overlay / fade / setpts,
no rawvideo demuxer or muxer, and no pcm_f32le encoder. So the slates (and the black) are drawn with PIL as short PNG
sequences in scratch, and one ffmpeg run joins them with the four mp4s through the `concat` filter and encodes once
(x264 crf 14, slow). The clips are decoded straight into the encode, with no frames of them written to disk; the PNGs
go through swscale's default RGB→YUV path, the same one that made the untagged Remotion sources. Audio is each clip's
mix, sample-exact to its frames (2000 samples a frame at 48 kHz), with 5 ms edge ramps against clicks, and digital
silence under the slates and the black.

    audio/.venv-mix/bin/python studio/src/dev/range/tools/reel.py [--slates-only] [scratchDir]

Writes out/range/range-reel.mp4 and out/range/range-sheet.png (one key still per prototype, taken from the encoded
mp4s). Scratch peaks at about 60 MB (432 mostly black PNGs, the wavs, a few check stills) in <scratchDir>/rangereel-work, deleted at the end.
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
OUT = os.path.join(ROOT, 'out', 'range')
FFD = os.path.join(STUDIO, 'node_modules', '@remotion', 'compositor-linux-x64-gnu')
FF = os.path.join(FFD, 'ffmpeg')
ENV = dict(os.environ, LD_LIBRARY_PATH=FFD)

W, H, FPS, SR = 1920, 1080, 24, 48000
SPF = SR // FPS                      # 2000 samples a frame
SLATE_F, BLACK_F, FADE_F = 84, 24, 8  # 3.5 s slate (8 f in and out of black), 1 s of black
RAMP = int(0.005 * SR)               # 5 ms edge ramps

MONO = '/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf'
MONO_B = '/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf'
INK, DIM, FAINT, CYAN, AMBER = (232, 228, 218), (150, 156, 168), (92, 98, 112), (95, 211, 208), (226, 170, 92)

HEADER = 'MR. MAS  ·  STYLE RANGE  ·  PROTOTYPE REEL  ·  INTERNAL, CONTAINS EP10–12 SPOILERS  ·  2026-09-26'

# id, tier, medium, season moment (lines), notes; `sheet` = (frame, caption) for the key still.
CLIPS = [
    dict(name='p1', n=480,
         id='PROTOTYPE 1', tier='TIER 2 · LEAP', tier_note='then J4, a Tier 1 pass at leap weight',
         medium=['HD cel anime (one hard key, a painted key drawing, one multiplane push)',
                 'then J4: the dealer\'s full-frame GLYPH (placeholder for the jump-fix pass)'],
         moment=['10.C THE READ  →  10.D J4 THE DEALER\'S VIEW', 'Ep10 #19 · ep1.9_pace.yaml · NO-LIMIT PACE'],
         notes='owner: HIM (his self-image)  ·  20 s  ·  pixel → cel → glyph → pixel  ·  temp sound, all code filler',
         sheet=[(238, None)]),
    dict(name='p2', n=360,
         id='PROTOTYPE 2', tier='TIER 2 · LEAP', tier_note=None,
         medium=['Real 3D: our own pixel frame extruded into voxels, and the first perspective camera',
                 'native 480×270 ×4 variant (p2-alt.mp4, the 1080 variant, is not in this reel)'],
         moment=['11.A THE NESTED LANYARD  →  THE CLIFF', 'Ep11 #3 · ep1.10_assist_clause.txt'],
         notes='owner: THE MACHINE (the successor adds a dimension)  ·  15 s  ·  pixel → voxel 3D → pixel  ·  temp sound',
         sheet=[(147, None)]),
    dict(name='p3', n=360,
         id='PROTOTYPE 3', tier='TIER 2 · LEAP', tier_note=None,
         medium=['Near-photoreal objects out of a point cloud, pixel people seated in full contact',
                 '(the clay still, p3-clod-turnaround.png, is a separate frame)'],
         moment=['12.A THE RECONSTRUCTION\'s table (the 2015 WOODROSE)', 'Ep12 #6 · ep1.11_unclear_which_side.md'],
         notes='owner: THE MACHINE, in its own flashback  ·  15 s  ·  pixel → points → learned objects → pixel  ·  temp sound',
         sheet=[(200, None)]),
    dict(name='p4', n=720,
         id='PROTOTYPE 4', tier='TIER 1 · PASSES', tier_note='the band stays on screen throughout',
         medium=['Four device passes, each entered and left inside its pixel room'],
         moment=['4a  P4 SPORTS      5.A Draft Night · Ep5 #10',
                 '4b  P5 STREAM      5.I the chart crime · Ep5 #24',
                 '4c  P3 BROADCAST   9.E the Security Council webcast · Ep9 #30',
                 '4d  P21 IRIS       11.E the Orb checkpoint · Ep11 #17'],
         notes='owners: THE DEVICE, THE MACHINE  ·  30 s under one continuous temp cue  ·  all code, final route CODE',
         sheet=[(130, '4a'), (290, '4b'), (430, '4c'), (650, '4d')]),
]
SHEET_CAP = {
    'p1': ('P1 · TIER 2 · HD cel anime', '10.C THE READ, Ep10 #19 · p238: the push, the tells lit as objects and bars'),
    'p2': ('P2 · TIER 2 · real 3D (voxels)', '11.A THE CLIFF, Ep11 #3 · p147: the room in perspective, Mas a flat card'),
    'p3': ('P3 · TIER 2 · near-photoreal objects, pixel people', '12.A THE RECONSTRUCTION, Ep12 #6 · p200: contact at the table'),
    'p4': ('P4 · TIER 1 · four device passes', '4a P4 SPORTS p130 · 4b P5 STREAM p290 · 4c P3 BROADCAST p430 · 4d P21 IRIS p650'),
}


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
    d.text((x + idw + 18, y + 26), f'of {total}', font=f_head, fill=FAINT)
    y += 92
    d.text((x, y), c['tier'], font=f_tier, fill=CYAN if c['tier'].startswith('TIER 2') else AMBER)
    if c['tier_note']:
        tw = d.textlength(c['tier'], font=f_tier)
        d.text((x + tw + 22, y + 8), c['tier_note'], font=f_note, fill=DIM)
    y += 58
    for line in c['medium']:
        d.text((x, y), line, font=f_med, fill=INK if line == c['medium'][0] else DIM)
        y += 40
    y += 22
    d.line([(x, y), (x + 64, y)], fill=FAINT, width=2)
    y += 22
    for line in c['moment']:
        d.text((x, y), line, font=f_mom, fill=INK if line == c['moment'][0] or c['name'] == 'p4' else DIM)
        y += 38
    y += 30
    d.text((x, y), c['notes'], font=f_note, fill=FAINT)
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
    d.text((pad, 20), 'MR. MAS · STYLE RANGE · THE FOUR PROTOTYPES · one key still each, from the encoded mp4s',
           font=ImageFont.truetype(MONO_B, 26), fill=INK)
    d.text((pad, 60), 'range-reel.mp4 = slate · p1 · black · slate · p2 · black · slate · p3 · black · slate · p4 · black'
           '   ·   internal, contains Ep10–12 spoilers   ·   2026-09-26', font=ImageFont.truetype(MONO, 18), fill=DIM)
    f1, f2 = ImageFont.truetype(MONO_B, 20), ImageFont.truetype(MONO, 17)
    for i, c in enumerate(CLIPS):
        cx, cy = pad + (i % 2) * (tw + pad), head + (i // 2) * (th + cap)
        shots = stills[c['name']]
        if len(shots) == 1:
            tile = Image.fromarray(shots[0][1]).resize((tw, th), Image.LANCZOS)
        else:  # P4: its four passes at 480x270, which is the pixel base's native size
            tile = Image.new('RGB', (tw, th))
            for j, (_, rgb, tag) in enumerate(shots):
                q = Image.fromarray(rgb).resize((tw // 2, th // 2), Image.BOX)
                tile.paste(q, ((j % 2) * tw // 2, (j // 2) * th // 2))
                ImageDraw.Draw(tile).text(((j % 2) * tw // 2 + 8, (j // 2) * th // 2 + 6), tag,
                                          font=f1, fill=INK, stroke_width=3, stroke_fill=(0, 0, 0))
            ImageDraw.Draw(tile).line([(tw // 2, 0), (tw // 2, th)], fill=(7, 8, 11), width=2)
            ImageDraw.Draw(tile).line([(0, th // 2), (tw, th // 2)], fill=(7, 8, 11), width=2)
        sheet.paste(tile, (cx, cy))
        a, b = SHEET_CAP[c['name']]
        d.text((cx, cy + th + 10), a, font=f1, fill=CYAN if 'TIER 2' in a else AMBER)
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
    tmp = os.path.join(args[0], 'rangereel-work') if args else tempfile.mkdtemp(prefix='rangereel-')
    os.makedirs(tmp, exist_ok=True)
    try:
        slates = [draw_slate(c, 0, len(CLIPS)) for c in CLIPS]
        if slates_only:
            for c, s in zip(CLIPS, slates):
                Image.fromarray(s[SLATE_F // 2]).save(os.path.join(os.path.dirname(tmp), f'slate-{c["name"]}.png'))
            print('slates in', os.path.dirname(tmp))
            return

        # --- audio first: the encoder takes the finished wav
        aud, marks, k = [], [], 0
        for c in CLIPS:
            aud.append(np.zeros((SLATE_F * SPF, 2), np.float32))
            marks.append((f'slate {c["name"][1]}', k, SLATE_F)); k += SLATE_F
            wav = os.path.join(tmp, c['name'] + '.wav')
            ff('-y', '-i', os.path.join(OUT, c['name'] + '.mp4'), '-vn', '-ac', '2', '-ar', str(SR), '-c:a', 'pcm_s16le', wav)
            x, sr = sf.read(wav, dtype='float32', always_2d=True)
            assert sr == SR, sr
            n = c['n'] * SPF
            print(f'{c["name"]}: {len(x)} samples decoded, {n} kept ({(len(x) - n) / SR * 1000:+.1f} ms of codec tail dropped); '
                  f'edge peaks {np.abs(x[:RAMP]).max():.3f} / {np.abs(x[n - RAMP:n]).max():.3f}')
            x = x[:n] if len(x) >= n else np.vstack([x, np.zeros((n - len(x), 2), np.float32)])
            ramp = np.linspace(0, 1, RAMP, dtype=np.float32)[:, None]
            x[:RAMP] *= ramp
            x[-RAMP:] *= ramp[::-1]
            aud.append(x)
            marks.append((c['name'], k, c['n'])); k += c['n']
            aud.append(np.zeros((BLACK_F * SPF, 2), np.float32))
            marks.append(('black', k, BLACK_F)); k += BLACK_F
            os.remove(wav)
        reel_wav = os.path.join(tmp, 'reel.wav')
        sf.write(reel_wav, np.vstack(aud), SR, subtype='PCM_24')
        total = k

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

        # --- one encode: pre1 p1 pre2 p2 pre3 p3 pre4 p4 tail, through concat
        out_mp4 = os.path.join(OUT, 'range-reel.mp4')
        cmd, n_in = [FF, '-hide_banner', '-loglevel', 'error', '-y'], 0
        for (d, _), c in zip(seqs, CLIPS):
            cmd += ['-framerate', str(FPS), '-i', os.path.join(d, 'f%03d.png'), '-i', os.path.join(OUT, c['name'] + '.mp4')]
            n_in += 2
        cmd += ['-framerate', str(FPS), '-i', os.path.join(tail[0], 'f%03d.png'), '-i', reel_wav]
        n_in += 1
        fc = ''.join(f'[{j}:v]format=yuv420p[v{j}];' for j in range(n_in))
        fc += ''.join(f'[v{j}]' for j in range(n_in)) + f'concat=n={n_in}:v=1:a=0[v]'
        cmd += ['-filter_complex', fc, '-map', '[v]', '-map', f'{n_in}:a',
                '-c:v', 'libx264', '-preset', 'slow', '-crf', '14', '-threads', '4', '-pix_fmt', 'yuv420p',
                '-c:a', 'aac', '-b:a', '256k', '-ar', str(SR), '-movflags', '+faststart', out_mp4]
        subprocess.run(cmd, env=ENV, check=True)
        for d, _ in seqs + [tail]:
            shutil.rmtree(d)

        # --- check the encode, and pull the sheet's stills from the encoded reel
        r = subprocess.run([os.path.join(FFD, 'ffprobe'), '-v', 'error', '-count_frames', '-select_streams', 'v',
                            '-show_entries', 'stream=nb_read_frames,width,height,r_frame_rate', '-of', 'compact', out_mp4],
                           env=ENV, capture_output=True, text=True, check=True)
        print(f'reel: {r.stdout.strip()}; wanted {total} frames ({total / FPS:.2f} s)')
        start = {m[0]: m[1] for m in marks}
        stills = {}
        for c in CLIPS:
            src = os.path.join(OUT, c['name'] + '.mp4')
            for f in sorted({0, c['n'] // 2, c['n'] - 1} | {f for f, _ in c['sheet']}):
                a = grab(src, f, os.path.join(tmp, 'src.png')).astype(np.int16)
                b = grab(out_mp4, start[c['name']] + f, os.path.join(tmp, 'reel.png'))
                dv = np.abs(b.astype(np.int16) - a)
                print(f'  {c["name"]} p{f:03d} (reel f{start[c["name"]] + f:04d}): vs source mean {dv.mean():.2f}, '
                      f'99.9th pct {int(np.percentile(dv, 99.9))} levels')
                tag = dict(c['sheet']).get(f, 'x')
                if f in dict(c['sheet']):
                    stills.setdefault(c['name'], []).append((f, b, tag))
        make_sheet(stills).save(os.path.join(OUT, 'range-sheet.png'), optimize=True)
        for c in CLIPS:
            i, tp = loudness(os.path.join(OUT, c['name'] + '.mp4'))
            print(f'  {c["name"]}.mp4: {i:.1f} LUFS, {tp:.1f} dBTP')
        i, tp = loudness(out_mp4)
        print(f'  range-reel.mp4: {i:.1f} LUFS, {tp:.1f} dBTP')
        print('segments:')
        for name, s0, n in marks:
            print(f'  {name:8s} f{s0:04d}–{s0 + n - 1:04d}  {s0 / FPS:6.2f}–{(s0 + n) / FPS:6.2f} s')
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


if __name__ == '__main__':
    main()
