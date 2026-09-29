#!/usr/bin/env python3
"""Season contact sheet (3 stills per episode: cold open, midpoint, button) + out/season/reels/index.md.
Stills are pulled from the rendered out/season/reels/epNN.mp4 at the generator's per-beat mark frame
(beat start + 62% of its length), so the sheet shows exactly what the files contain."""
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
import json, glob, os, re, subprocess, tempfile, textwrap
from PIL import Image, ImageDraw, ImageFont

ROOT = REPO
OUT = f'{ROOT}/out/season/reels'
FFD = f'{ROOT}/studio/node_modules/@remotion/compositor-linux-x64-gnu'
FPS, TITLE = 24, 72
env = dict(os.environ, LD_LIBRARY_PATH=FFD)

def clock(s):
    m = re.fullmatch(r'(\d+):(\d{1,2})', str(s).strip()); return int(m[1]) * 60 + int(m[2]) if m else None

def timing(beats):
    starts, lens, acc, prev = [], [], 0.0, TITLE
    for b in beats:
        acc += b['reelDur']; end = max(prev + 1, TITLE + round(acc * FPS)); starts.append(prev); lens.append(end - prev); prev = end
    return starts, lens, prev

def picks(o):
    B = o['beats']
    co = next((i for i, b in enumerate(B) if b['act'] == 'COLD OPEN' and b['kind'] != 'card'), 0)
    mid = next((i for i, b in enumerate(B) if re.search(r'\bMIDPOINT\b', b['caption'], re.I)), None)
    if mid is None:  # else: the act-out of the act that holds the episode's half-way point
        half = o.get('runtimeMin', 22) * 30
        hit = next((i for i, b in enumerate(B) if clock(b['realStart']) is not None and clock(b['realStart']) <= half < clock(b['realStart']) + b['realDur']), len(B) // 2)
        act = B[hit]['act']; mid = hit
        while mid + 1 < len(B) and B[mid + 1]['act'] == act: mid += 1
    btn = next((i for i, b in enumerate(B) if re.match(r'\s*(the\s+)?button\b', b['caption'], re.I)), None)
    if btn is None:
        tags = [i for i, b in enumerate(B) if b['act'] == 'TAG' and not re.search(r'stinger|hook', b['caption'], re.I)]
        btn = tags[-1] if tags else len(B) - 1
    return [('COLD OPEN', co), ('MIDPOINT', mid), ('BUTTON', btn)]

def grab(mp4, frame, out):
    t = (frame + 0.5) / FPS
    subprocess.run([f'{FFD}/ffmpeg', '-v', 'error', '-y', '-ss', f'{t:.4f}', '-i', mp4, '-frames:v', '1', out], check=True, env=env)

def dur(mp4):
    r = subprocess.run([f'{FFD}/ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', mp4], capture_output=True, text=True, env=env)
    return float(r.stdout.strip())

F = lambda n, sz: ImageFont.truetype(f'/usr/share/fonts/truetype/dejavu/{n}.ttf', sz)
fT, fB, fS, fM = F('DejaVuSans-Bold', 40), F('DejaVuSans-Bold', 22), F('DejaVuSans', 17), F('DejaVuSansMono', 16)
TW, TH, LW, PAD, HEAD = 544, 306, 330, 12, 110
eps = sorted(glob.glob(f'{ROOT}/show/reel/ep[0-9][0-9].json'))
rows, index = [], []
tmp = tempfile.mkdtemp(prefix='season-', dir=OUT)
try:
    for f in eps:
        o = json.load(open(f)); key = os.path.basename(f)[:-5]; mp4 = f'{OUT}/{key}.mp4'
        starts, lens, total = timing(o['beats'])
        d = dur(mp4) if os.path.exists(mp4) else None
        shots = []
        for lab, i in picks(o):
            fr = starts[i] + int(lens[i] * 0.62); png = f'{tmp}/{key}-{lab[0]}.png'
            if d: grab(mp4, fr, png)
            shots.append((lab, o['beats'][i], png if d else None))
        rows.append((o, key, total, d, shots))
        index.append((o, key, total, d, shots))
    W = LW + 3 * (TW + PAD) + PAD
    H = HEAD + len(rows) * (TH + 38 + PAD) + PAD
    S = Image.new('RGB', (W, H), (6, 9, 19)); D = ImageDraw.Draw(S)
    tot = sum(r[3] or 0 for r in rows)
    D.text((PAD + 8, 18), 'MR. MAS — season outline reel · contact sheet', font=fT, fill=(63, 230, 255))
    D.text((PAD + 8, 70), f'12 episodes · {int(tot // 60)}:{tot % 60:04.1f} of reel · per episode: cold open, midpoint, button (frames pulled from out/season/reels/epNN.mp4)', font=fS, fill=(147, 174, 224))
    y = HEAD
    for o, key, total, d, shots in rows:
        spec = o.get('speculative')
        D.rectangle([PAD, y, LW - 8, y + TH + 30], fill=(14, 20, 38))
        D.text((PAD + 12, y + 10), f"EP {o['episode']:02d}", font=F('DejaVuSans-Bold', 34), fill=(255, 200, 87))
        yy = y + 56
        for line in textwrap.wrap(o['title'], 24, break_on_hyphens=False):
            D.text((PAD + 12, yy), line, font=F('DejaVuSansMono-Bold', 19), fill=(228, 236, 255)); yy += 25
        for line in textwrap.wrap(o['dateSpan'], 32)[:2]:
            D.text((PAD + 12, yy + 4), line, font=fS, fill=(147, 174, 224)); yy += 22
        yy += 6
        if d: D.text((PAD + 12, yy), f"reel {int(d // 60)}:{d % 60:04.1f} · {len(o['beats'])} beats", font=fS, fill=(141, 151, 173)); yy += 26
        if spec: D.text((PAD + 12, yy), 'SPECULATIVE', font=fB, fill=(255, 74, 74)); yy += 30
        ll = textwrap.wrap(o['logline'], 36)
        room = max(1, (y + TH + 24 - yy) // 17)
        if len(ll) > room: ll = ll[:room]; ll[-1] = ll[-1].rstrip(' ,.;') + '…'
        for line in ll:
            D.text((PAD + 12, yy), line, font=F('DejaVuSans-Oblique', 13), fill=(200, 208, 225)); yy += 17
        for j, (lab, b, png) in enumerate(shots):
            x = LW + PAD + j * (TW + PAD)
            if png:
                im = Image.open(png).convert('RGB').resize((TW, TH), Image.LANCZOS); S.paste(im, (x, y))
            else:
                D.rectangle([x, y, x + TW, y + TH], outline=(80, 80, 90))
            D.text((x, y + TH + 6), f"{lab} · {b['id']} · {b['act']}", font=fM, fill=(255, 154, 92))
        y += TH + 38 + PAD
    S.save(f'{OUT}/season-contact.png', optimize=True)
    # index.md
    L = ['# MR. MAS: season outline reel', '',
         'Rough stick-figure animatic of the whole season, about 2:50 per episode, generated from `show/reel/epNN.json`.',
         'Each reel is a 3 s title card followed by the beats. Temp bed: `audio/reel/epNN.wav` (unauditioned).', '',
         f'**Season total:** {int(tot // 60)}:{tot % 60:04.1f} across 12 reels · `season.mp4` (all 12 back to back) · contact sheet `season-contact.png` · per-episode sheets in `sheets/`', '',
         '| Ep | File | Title | Dates | Reel | Beats | Logline |', '|---|---|---|---|---|---|---|']
    for o, key, total, d, shots in index:
        ln = o['logline'].replace('|', '/')
        sp = ' **(speculative)**' if o.get('speculative') else ''
        L.append(f"| {o['episode']} | [{key}.mp4]({key}.mp4) | `{o['title']}`{sp} | {o['dateSpan']} | {int(d // 60)}:{d % 60:04.1f} | {len(o['beats'])} | {ln} |")
    L += ['', '## Contact-sheet picks', '', '| Ep | Cold open | Midpoint | Button |', '|---|---|---|---|']
    for o, key, total, d, shots in index:
        L.append(f"| {o['episode']} | " + ' | '.join(f"{b['id']}: {b['caption'][:70].replace('|', '/')}{'…' if len(b['caption']) > 70 else ''}" for _, b, _ in shots) + ' |')
    L += ['', 'Regenerate: `bash studio/src/dev/reel/render_all.sh` (reels, season.mp4, sheets), then `python3 studio/src/dev/reel/season_sheet.py` for this index and the contact sheet (render_all.sh runs it too).', '']
    open(f'{OUT}/index.md', 'w').write('\n'.join(L))
    print('wrote', f'{OUT}/season-contact.png', S.size, 'and', f'{OUT}/index.md', f'total {tot:.1f}s')
finally:
    for p in glob.glob(f'{tmp}/*'): os.remove(p)
    os.rmdir(tmp)
