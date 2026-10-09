# MR. MAS — Ep2 v1 pixel pipeline: a CONTACT SHEET decoded from a rendered picture (the act MP4), one labelled frame
# per shot, and a frame extractor for the full-size look. Act Two's picture pass, 2026-10-09 (Act One's sheet script
# lived only in its session's scratchpad; this is the repo's copy). PyAV + PIL (audio/.venv-casting). Through heavy.sh:
#   bash ops/heavy.sh audio/.venv-casting/bin/python studio/src/episodes/ep02/pixel/tools/sheet.py sheet \
#        out/ep02/v1/picture/act2.mp4 out/ep02/v1/picture/act2-sheet.png "TITLE" "100|8.01|OTS" "264|8.02|POV" ...
#   bash ops/heavy.sh audio/.venv-casting/bin/python studio/src/episodes/ep02/pixel/tools/sheet.py frames \
#        out/ep02/v1/picture/act2.mp4 <outdir> 0:8.01s 100:8.01t ...        (full 1080p PNGs, f<frame>-<label>.png)
import os, sys
import av
from PIL import Image, ImageDraw, ImageFont

def decode(vid, want):
    out, c = {}, av.open(vid)
    top = max(want)
    for i, fr in enumerate(c.decode(c.streams.video[0])):
        if i in want: out[i] = fr.to_image().convert('RGB')
        if i >= top: break
    return out

def font(n):
    try: return ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf', n)
    except Exception: return None

def sheet(vid, out, title, items):
    rows = [(int(f), lab, fr) for f, lab, fr in (a.split('|') for a in items)]
    frames = decode(vid, {f for f, _, _ in rows})
    COLS, TW, TH, LH = 6, 320, 180, 20
    sh = Image.new('RGB', (COLS * TW, 30 + ((len(rows) + COLS - 1) // COLS) * (TH + LH)), (7, 8, 13))
    d = ImageDraw.Draw(sh)
    d.text((6, 8), title, fill=(242, 239, 230), font=font(13))
    for n, (f, lab, fr) in enumerate(rows):
        x, y = (n % COLS) * TW, 30 + (n // COLS) * (TH + LH)
        d.text((x + 4, y + 3), f'{lab} · f{f} · {fr}', fill=(242, 211, 138), font=font(12))
        sh.paste(frames[f].resize((TW, TH), Image.BOX), (x, y + LH))
    sh.save(out)
    print('wrote', out, sh.size)

def frames(vid, outdir, items):
    want = {int(a.split(':')[0]): (a.split(':') + [''])[1] for a in items}
    os.makedirs(outdir, exist_ok=True)
    for f, im in decode(vid, set(want)).items(): im.save(os.path.join(outdir, f'f{f:05d}{"-" + want[f] if want[f] else ""}.png'))
    print('wrote', len(want), 'frames to', outdir)

if __name__ == '__main__':
    mode = sys.argv[1]
    if mode == 'sheet': sheet(sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5:])
    elif mode == 'frames': frames(sys.argv[2], sys.argv[3], sys.argv[4:])
    else: sys.exit('usage: sheet.py sheet <mp4> <out.png> <title> f|label|framing ... | frames <mp4> <outdir> f:label ...')
