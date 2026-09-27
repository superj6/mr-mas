"""OUTRO D -- the lookdev build after the picture and the stills are rendered (see entry.tsx's header):

  1. MUX     silent picture + mix -> out/lookdev/outro/d/outro-d-ep1-1080p.mp4 (h264 copy + AAC 256k), copied to
             out/lookdev/outro/outro-d.mp4 (the top-level comparison file, beside outro-a.mp4 / outro-e.mp4)
  2. DECODE  every frame of the ENCODED mp4, at full size and area-scaled to 480x270
  3. QA      per text element (terms, pointer, the title and its file line, 5 credit plates, slug): frames wholly
             on screen and settled vs its read time (16 chars/s + 0.5 s; the title 2.5 s; the terms 5 s), crops (frames
             on screen but not whole: must be 0), overlaps between any two text boxes and the moth over any text box
             (must be 0), the lowest WCAG contrast of any text ink on its ground over the element's life (native),
             and how far the encoded frame strays from the engine's exact pixels inside its box (full size, 4x4
             area = the 480x270 view)
  4. STILLS  3 key stills from the encoded mp4 (1080p PNG), the numbered keyframes sheet with a to-scale outline,
             the variants sheet (Ep1 reference, Ep7, Ep10 x2) and the extra Ep10 still (from the remotion stills)

Run (repo root):  audio/.venv-theme/bin/python -B studio/src/dev/outro/d/tools/build.py --scratch <scratch>
It expects in <scratch>: outro-d-ep1-silent.mp4, var-ep1-o200.png, var-ep7-o200.png, var-ep10-o100.png,
var-ep10-o200.png (it (re)builds the esbuilt preview od.js itself).
"""
import argparse
import json
import os
import shutil
import subprocess

import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = '/home/jgon/project/art/mrmas'
STUDIO = f'{ROOT}/studio'
OUTD = f'{ROOT}/out/lookdev/outro/d'
FFD = f'{STUDIO}/node_modules/@remotion/compositor-linux-x64-gnu'
FONT = '/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf'
FONT_B = '/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf'
PRE, OUT, TOTAL = 24, 270, 294
KEYS = [(-12, 'stand-in: the last frame (cold open f56)'), (16, 'F: the monitor\'s own curve stretches out to fill the frame'),
        (75, 'F F F: MR. MAS (1-BIT); created by, written on the flat'), (128, 'G Ab: the leap in quarters; the credits climb'),
        (200, 'every credit up; two windows; the moth in the empty box'), (256, 'the out: the caret alone, where it was')]
STILLS = [(16, 'lift'), (128, 'leap'), (200, 'final')]


def ff(*args):
    env = dict(os.environ, LD_LIBRARY_PATH=FFD)
    subprocess.run([f'{FFD}/ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', *args], check=True, env=env)


def probe(path):
    env = dict(os.environ, LD_LIBRARY_PATH=FFD)
    r = subprocess.run([f'{FFD}/ffprobe', '-v', 'error', '-count_frames', '-show_entries',
                        'stream=codec_name,width,height,nb_read_frames,r_frame_rate,sample_rate,channels,pix_fmt:format=duration',
                        '-of', 'json', path], check=True, env=env, capture_output=True, text=True)
    return json.loads(r.stdout)


class Frames:
    """every frame of the ENCODED file, decoded to PNGs on disk (Remotion's ffmpeg has no rawvideo muxer, and
    384 1080p frames held as one array would need ~2.4 GB), loaded one at a time as uint8 RGB"""

    def __init__(self, d, n):
        self.d, self.n = d, n
        self.shape = (n,)

    def __len__(self):
        return self.n

    def __getitem__(self, i):
        return np.asarray(Image.open(f'{self.d}/f{i:04d}.png').convert('RGB'))


def decode_all(mp4, w, h, out_dir):
    """decode every frame of the encoded file to out_dir/f0000.png ... (area-scaled to w x h when smaller)"""
    env = dict(os.environ, LD_LIBRARY_PATH=FFD)
    os.makedirs(out_dir, exist_ok=True)
    for f in os.listdir(out_dir):
        if f.startswith('f') and f.endswith('.png'):
            os.remove(os.path.join(out_dir, f))
    vf = [] if (w, h) == (1920, 1080) else ['-vf', f'scale={w}:{h}:flags=area']
    subprocess.run([f'{FFD}/ffmpeg', '-hide_banner', '-loglevel', 'error', '-i', mp4, *vf, '-fps_mode', 'passthrough',
                    '-pix_fmt', 'rgb24', '-start_number', '0', f'{out_dir}/f%04d.png'], check=True, env=env)
    n = len([f for f in os.listdir(out_dir) if f.startswith('f') and f.endswith('.png')])
    return Frames(out_dir, n)


def _js(x):
    """numpy scalars (bool_, int64, float32) -> plain JSON"""
    return x.item() if hasattr(x, 'item') else str(x)


def font(sz, bold=False):
    return ImageFont.truetype(FONT_B if bold else FONT, sz)


def bar_beat(o):
    """the script's bar.beat+frames notation (o22 = 1.2+7)"""
    b, beat, fr = o // 60 + 1, (o % 60) // 15 + 1, o % 15
    return f'{b}.{beat}' + (f'+{fr}' if fr else '')


def lum(c):
    def ch(v):
        v = v / 255
        return v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4
    return 0.2126 * ch(c[0]) + 0.7152 * ch(c[1]) + 0.0722 * ch(c[2])


def contrast(a, b):
    la, lb = sorted([lum(a), lum(b)], reverse=True)
    return (la + 0.05) / (lb + 0.05)


def text_contrast(px):
    """(lowest contrast, ground, ink) over the box's text inks: the ground is the most common colour; the inks are
    the other common colours that stand >= 3:1 off it (type), so the faint grid and the bevels are left out"""
    cols, counts = np.unique(px.reshape(-1, 3), axis=0, return_counts=True)
    order = np.argsort(-counts)
    ground = cols[order[0]]
    cands = [(contrast(cols[i], ground), cols[i]) for i in order[1:10] if counts[i] >= 6]
    cands = [c for c in cands if c[0] >= 3.0]
    if not cands:
        return None
    c, ink = min(cands, key=lambda q: q[0])
    return round(c, 2), '#%02x%02x%02x' % tuple(int(v) for v in ground), '#%02x%02x%02x' % tuple(int(v) for v in ink)


def two_colours(px):
    """the ground (most common) and the ink (the colour that contrasts most with it among the common ones)"""
    cols, counts = np.unique(px.reshape(-1, 3), axis=0, return_counts=True)
    order = np.argsort(-counts)
    ground = cols[order[0]]
    cands = [cols[i] for i in order[1:8] if counts[i] >= 6]
    if not cands:
        return ground, ground
    ink = max(cands, key=lambda c: contrast(c, ground))
    return ground, ink


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--scratch', required=True)
    S = ap.parse_args().scratch
    os.makedirs(OUTD, exist_ok=True)
    # ------------------------------------------------------------ 1. mux
    silent = f'{S}/outro-d-ep1-silent.mp4'
    mp4 = f'{OUTD}/outro-d-ep1-1080p.mp4'
    ff('-i', silent, '-i', f'{OUTD}/outro-d-ep1-mix.wav', '-map', '0:v', '-map', '1:a', '-c:v', 'copy',
       '-c:a', 'libfdk_aac', '-profile:a', 'aac_low', '-b:a', '256k', '-ar', '48000', '-ac', '2',
       '-metadata', 'title=MR. MAS outro proposal D (the curve), Ep1 lookdev mock-up',
       '-metadata', 'comment=LOOKDEV. Legal text is a draft pending review. Temp music.',
       '-shortest', '-movflags', '+faststart', mp4)
    shutil.copy(mp4, f'{ROOT}/out/lookdev/outro/outro-d.mp4')
    pr = probe(mp4)
    # ------------------------------------------------------------ 2. decode (encoded file) + the engine's exact frames
    full = decode_all(mp4, 1920, 1080, f'{S}/dec1080')
    small = decode_all(mp4, 480, 270, f'{S}/dec480')
    assert full.shape[0] == TOTAL and small.shape[0] == TOTAL, (full.shape, small.shape)
    js = f'{S}/od.js'
    subprocess.run(['npx', 'esbuild', 'src/dev/outro/d/tools/preview.ts', '--bundle', '--platform=node',
                    f'--outfile={js}', '--log-level=warning'], cwd=STUDIO, check=True)
    nat_dir = f'{S}/native'
    os.makedirs(nat_dir, exist_ok=True)
    subprocess.run(['node', js, nat_dir, '1', '1', 'all'], check=True, capture_output=True)
    subprocess.run(['node', js, '--boxes', f'{S}/boxes.json', '1'], check=True, capture_output=True)
    boxes = json.load(open(f'{S}/boxes.json'))
    nat = lambda o: np.asarray(Image.open(f"{nat_dir}/ep1-o{('m%02d' % -o) if o < 0 else '%03d' % o}.png").convert('RGB'))  # noqa: E731
    # ------------------------------------------------------------ 3. QA per text element
    need = {a['n']: a for a in boxes['audit']}
    el = {}
    for fr in boxes['frames']:
        o = fr['o']
        N = nat(o).astype(np.int16)
        F = full[PRE + o].astype(np.int16)
        Sm = small[PRE + o].astype(np.int16)
        for b in fr['boxes']:
            x, y, w, h = b['rect']
            e = el.setdefault(b['id'], dict(text=b['text'], frames_full=0, first=o, last=o, err_full=0.0, err_480=0.0,
                                            contrast=None, contrast_at=None))
            e['last'] = o
            if b['full']:
                e['frames_full'] += 1
            nb = N[y:y + h, x:x + w]
            fb = F[4 * y:4 * (y + h), 4 * x:4 * (x + w)]
            # full size: every 1080p pixel against its native pixel (nearest-neighbour 4x = what should be there)
            up = np.repeat(np.repeat(nb, 4, 0), 4, 1)
            ef = float(np.abs(fb - up).mean())
            es = float(np.abs(Sm[y:y + h, x:x + w] - nb).mean())
            e['err_full'] = max(e['err_full'], round(ef, 2))
            e['err_480'] = max(e['err_480'], round(es, 2))
            # contrast: every 6th frame of its life (the title and the plates change rung), the LOWEST text ink
            if b['full'] and o % 6 == 0:
                c = text_contrast(nb.astype(np.uint8))
                if c is not None and (e['contrast'] is None or c[0] < e['contrast']):
                    e['contrast'], e['contrast_at'], e['ground'], e['ink'] = c[0], o, c[1], c[2]
    for k, e in el.items():
        e['seconds_full'] = round(e['frames_full'] / 24, 2)
        chars = len(e['text'].replace(' / ', ' '))
        if k.startswith('plate'):
            e['need_frames'] = need[int(k[5:])]['need']
            e['crop_frames'] = need[int(k[5:])]['crop']
        elif k == 'title':
            e['need_frames'] = 60
        else:
            e['need_frames'] = 120 if k == 'terms' else int(np.ceil(24 * (chars / 16 + 0.5)))
        e['read_ok'] = e['frames_full'] >= e['need_frames']
        e['contrast_ok'] = (e['contrast'] or 0) >= 4.5
    # ------------------------------------------------------------ 4. stills from the ENCODED file
    for o, name in STILLS:
        Image.fromarray(full[PRE + o]).save(f'{OUTD}/outro-d-still-{STILLS.index((o, name)) + 1}-{name}-o{o}.png')
    shutil.copy(f'{S}/var-ep10-o200.png', f'{OUTD}/outro-d-ep10-still.png')
    keyframes_sheet(full, f'{OUTD}/outro-d-keyframes.png')
    variants_sheet(S, f'{OUTD}/outro-d-variants.png')
    # the QA crops at 480x270 and full size, for a human look (scratch only)
    qa_crops(full, small, boxes, f'{S}/qa-crops.png')
    rep = dict(file=os.path.relpath(mp4, ROOT), probe=pr, text=el,
               all_read_ok=all(e['read_ok'] for e in el.values()),
               all_contrast_ok=all(e['contrast_ok'] for e in el.values()),
               crops=sum(a['crop'] for a in boxes['audit']), overlaps=len(boxes['overlaps']),
               moth_over_text=len(boxes['mothHits']),
               notes=['frames_full: frames the element is wholly on screen and settled (plates: above the band, not '
                      'popping; nothing moves after o153 but the caret and the moth; no plate folds in d5)',
                      'need_frames: 16 chars/s + 0.5 s (the doc estimate); the title 2.5 s; the terms line 5 s',
                      'crops: frames any plate is on screen but not whole; overlaps: frames two text boxes touch; '
                      'moth_over_text: frames the moth\'s box touches a text box. All three must be 0',
                      'contrast: the lowest WCAG ratio of any text ink (>= 3:1 candidates, so the faint grid and bevels '
                      'are not taken for type) on its ground, sampled every 6th frame of the element\'s life',
                      'err_full / err_480: worst per-frame mean abs difference (0-255 per channel) between the encoded '
                      'mp4 and the engine\'s exact pixels inside the element\'s box, at 1920x1080 and area-scaled to 480x270'])
    json.dump(rep, open(f'{OUTD}/outro-d-qa.json', 'w'), indent=1, default=_js)
    print(json.dumps({k: {kk: v.get(kk) for kk in ('seconds_full', 'need_frames', 'frames_full', 'crop_frames', 'contrast', 'contrast_at', 'err_full', 'err_480', 'read_ok')}
                      for k, v in el.items()}, indent=1, default=_js))
    print('crops', rep['crops'], 'overlaps', rep['overlaps'], 'moth_over_text', rep['moth_over_text'])
    print('probe', json.dumps(pr))


def keyframes_sheet(full, dst):
    tw, th, pad, cap = 640, 360, 24, 56
    W = 3 * tw + 4 * pad
    strip_h = 390
    H = 96 + 2 * (th + cap) + pad * 3 + strip_h
    im = Image.new('RGB', (W, H), (14, 16, 24))
    d = ImageDraw.Draw(im)
    d.text((pad, 22), 'MR. MAS · OUTRO D · "the curve" · Ep1 lookdev mock-up (from the encoded mp4)', font=font(26, True), fill=(230, 226, 214))
    d.text((pad, 58), '11.25 s = 4.5 bars at 96 BPM (270 f) after a 1 s stand-in · the intro is 30 s · d5 polish · LEGAL TEXT: DRAFT, review pending · temp music',
           font=font(17), fill=(150, 158, 176))
    for i, (o, label) in enumerate(KEYS):
        cx, cy = pad + (i % 3) * (tw + pad), 96 + (i // 3) * (th + cap)
        fr = Image.fromarray(full[PRE + o]).resize((tw, th), Image.LANCZOS)
        im.paste(fr, (cx, cy))
        tag = f'o{o}' if o >= 0 else f'stand-in f{PRE + o}'
        bb = f'  bar {bar_beat(o)}' if o >= 0 else ''
        d.text((cx, cy + th + 6), f'{i + 1}  {tag}{bb}  ({(PRE + o) / 24:.2f} s in file)', font=font(17, True), fill=(127, 230, 222))
        d.text((cx, cy + th + 29), label, font=font(16), fill=(200, 196, 184))
    # the to-scale outline: 270 outro frames against the 720-frame intro
    y0 = 96 + 2 * (th + cap) + pad
    x0, x1 = pad + 150, W - pad - 30
    s = (x1 - x0) / 720.0
    rows = [('intro 30 s', [(0, 720, 'the intro (12 bars)', (70, 80, 110))]),
            ('D 11.25 s', [(0, 24, 'lift', (40, 90, 100)), (24, 105, 'title + flat (F F F)', (30, 70, 90)),
                           (105, 150, 'leap', (50, 110, 120)), (150, 240, 'final frame', (44, 84, 104)), (240, 270, '', (20, 30, 40))]),
            ('terms + pointer', [(18, 240, 'up o18-239, 9.2 s lit, never moves; out with the frame', (140, 132, 108))]),
            ('MR. MAS + file', [(30, 150, '1-BIT plate', (150, 120, 60)), (150, 240, 'the show\'s window', (120, 96, 50))]),
            ('human credits', [(60, 240, 'created by (o60), written (o90): held to the out', (90, 96, 130))]),
            ('craft + AI', [(105, 240, 'picture · music, voices, AI tools', (70, 76, 120))]),
            ('knee (whole, once)', [(0, 105, 'F  F  F  F (halves)', (34, 167, 173)), (105, 165, 'G Ab C F', (24, 140, 150))]),
            ('moth (Ep1 stinger)', [(153, 180, 'in', (60, 70, 90)), (180, 240, 'in the post box', (60, 70, 90))])]
    # the bar grid first (2.5 s a bar), so the segment labels sit on top of it
    for bar in range(0, 13):
        xx = x0 + bar * 60 * s
        d.line([xx, y0 - 6, xx, y0 + len(rows) * 40 - 8], fill=(60, 66, 90), width=1)
        d.text((xx + 3, y0 + len(rows) * 40 - 4), f'{bar * 2.5:g}s', font=font(12), fill=(120, 128, 150))
    for r, (name, segs) in enumerate(rows):
        yy = y0 + r * 40
        d.text((pad, yy + 8), name, font=font(15, True), fill=(200, 196, 184))
        for a, b, lab, col in segs:
            d.rectangle([x0 + a * s, yy, x0 + b * s - 2, yy + 30], fill=col)
            d.text((x0 + a * s + 6, yy + 7), lab, font=font(14), fill=(236, 232, 220))
    im.save(dst)


def variants_sheet(S, dst):
    tw, th, pad, cap = 900, 506, 24, 64
    W = 2 * tw + 3 * pad
    H = 96 + 2 * (th + cap) + pad
    im = Image.new('RGB', (W, H), (14, 16, 24))
    d = ImageDraw.Draw(im)
    d.text((pad, 22), 'OUTRO D · per-episode states (remotion stills, 1080p, scaled)', font=font(26, True), fill=(230, 226, 214))
    d.text((pad, 58), 'The terms line never changes. What changes: the file, the dot, the palette floor, the post box, who leads.',
           font=font(17), fill=(150, 158, 176))
    cells = [('var-ep1-o200.png', 'Ep1 o200 (reference, the final frame)', 'title 1-BIT > the show\'s window (o150); human credits 1-BIT (held), leap EARLY-WEB16; dot 0.55; the moth'),
             ('var-ep7-o200.png', 'Ep7 o200', 'floor BASE; the post box holds the month\'s machine render (1080p SVG filler: the Orb); dot at 0.85'),
             ('var-ep10-o100.png', 'Ep10 o100 (mid-flat)', 'the machine leads: the thread is drawn to the top from the start; everything a beat early'),
             ('var-ep10-o200.png', 'Ep10 o200', '`you are ^` off the top of the chart; the post box: the machine\'s own smooth render of the curve')]
    for i, (f, t, sub) in enumerate(cells):
        cx, cy = pad + (i % 2) * (tw + pad), 96 + (i // 2) * (th + cap)
        im.paste(Image.open(f'{S}/{f}').convert('RGB').resize((tw, th), Image.LANCZOS), (cx, cy))
        d.text((cx, cy + th + 6), t, font=font(18, True), fill=(127, 230, 222))
        d.text((cx, cy + th + 32), sub, font=font(14), fill=(200, 196, 184))
    im.save(dst)


def qa_crops(full, small, boxes, dst):
    """for a human look: each text element's box at a representative frame, at full size and at 480x270 (x2 nearest)"""
    picks = {}
    for fr in boxes['frames']:
        for b in fr['boxes']:
            if b['full'] and b['id'] not in picks:
                picks[b['id']] = (fr['o'] + 4 if b['id'].startswith('plate') else fr['o'], b['rect'])
    rows = []
    for k, (o, (x, y, w, h)) in picks.items():
        x0, y0 = max(0, x - 3), max(0, y - 3)
        x1, y1 = min(480, x + w + 3), min(270, y + h + 3)
        F = Image.fromarray(full[PRE + o][4 * y0:4 * y1, 4 * x0:4 * x1])
        Sm = Image.fromarray(small[PRE + o][y0:y1, x0:x1]).resize(((x1 - x0) * 2, (y1 - y0) * 2), Image.NEAREST)
        rows.append((k, o, F, Sm))
    W = max(r[2].width + r[3].width for r in rows) + 60
    H = sum(max(r[2].height, r[3].height) + 30 for r in rows) + 10
    im = Image.new('RGB', (W, H), (40, 40, 48))
    d = ImageDraw.Draw(im)
    yy = 5
    for k, o, F, Sm in rows:
        d.text((8, yy), f'{k} @ o{o}: full size | 480x270 (shown x2)', font=font(14), fill=(230, 230, 230))
        im.paste(F, (8, yy + 20))
        im.paste(Sm, (8 + F.width + 30, yy + 20))
        yy += max(F.height, Sm.height) + 30
    im.save(dst)


if __name__ == '__main__':
    main()
