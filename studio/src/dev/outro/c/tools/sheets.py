"""MR. MAS — outro C: stills, sheets and the readability QA, all taken from the ENCODED mp4 (not from the renderer).

Reads  <SC>/dec/fNNN.png   every frame of out/lookdev/outro/outro-c.mp4, decoded (fNNN = composition frame NNN-1)
       <SC>/native/<f>.png the same frames drawn natively (480x270) by tools/preview.ts: the reference
       <SC>/native/moth.json   the moth's native bounding box per outro frame (tools/preview.ts check)
       <SC>/still-{0,1,2}.png  the variant stills (Remotion, lossless PNG): 0 Ep1 o112, 1 Ep4, 2 Ep10
Writes out/lookdev/outro/c/
       outro-c-key1-o40-wall.png, -key2-o100-hang.png, -key3-o170-lightsdown.png   (1920x1080, from the mp4)
       outro-c-keyframes.png   six numbered frames from the mp4 + the to-scale bar grid (the small sheet)
       outro-c-variants.png    Ep1 / Ep4 / Ep10 side by side, captioned
       outro-c-ep10.png        the extra still: the Ep10 version (1920x1080)
       qa/outro-c-readability.png  every text line at full size and at 480x270 (1:1 and x3), from the mp4
       qa/qa.json              per-line read time, contrast and decode fidelity; the band's stillness over all frames
Run:   audio/.venv-theme/bin/python studio/src/dev/outro/c/tools/sheets.py <SC>
"""
import glob
import json
import os
import shutil
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = '/home/jgon/project/art/mrmas'
OUT = f'{ROOT}/out/lookdev/outro/c'
PRE = 24
OUT_F = 180          # the outro: 3 bars at 96 BPM = 7.5 s (second pass; was 240)
OUT_S = OUT_F / 24
FONT = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
FONTB = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
MONO = '/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf'


def F(size, bold=False, mono=False):
    return ImageFont.truetype(MONO if mono else (FONTB if bold else FONT), size)


def bb(o):
    return f'{o // 60 + 1}.{(o % 60) // 15 + 1}'


def dec(sc, f):
    return Image.open(f'{sc}/dec/f{f + 1:03d}.png').convert('RGB')


def box4(im):
    a = np.asarray(im).astype(np.float64)
    h, w = a.shape[0] // 4, a.shape[1] // 4
    return a[: h * 4, : w * 4].reshape(h, 4, w, 4, 3).mean((1, 3))


def lum(rgb):
    c = np.asarray(rgb, dtype=np.float64) / 255
    c = np.where(c <= 0.03928, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)
    return 0.2126 * c[..., 0] + 0.7152 * c[..., 1] + 0.0722 * c[..., 2]


def contrast(a, b):
    la, lb = lum(a), lum(b)
    return (max(la, lb) + 0.05) / (min(la, lb) + 0.05)


# ------------------------------------------------------------------ the text lines (native geometry, set.ts / band.ts)
TERMS = 'A parody. Events dramatized, scenes invented. No one depicted took part or endorsed it.'
POINTER = 'Full notice and sources: in the description.'
# the board (set.ts, second pass): rows at y = 89 + 9 r; text x 67-412; row 2 is an empty groove, row 8 vacant (Ep1)
DIR_EP1 = [(0, 'DIRECTORY'), (1, 'MR. MAS · EP1.0_RESEARCH_PREVIEW.MD ... CLOSED DEC 27, 2023'),
           (3, 'CREATED BY ... (CREATOR)'), (4, 'WRITTEN ... (CREATOR), WITH AI'),
           (5, 'PICTURE · MUSIC ... PIXEL ART AND ORIGINAL SCORE, RENDERED IN CODE'),
           (6, 'VOICES ... SYNTHETIC, DESIGNED FROM TEXT · NONE CLONED'), (7, 'AI TOOLS ... USED THROUGHOUT · LISTED IN THE NOTICE')]
LAST = OUT_F - 1
LINES = (
    [dict(id=f'sign{i}', group='sign', text=t, box=(180, 28 + 10 * i, 244, 35 + 10 * i), ink='dark', frames=(0, LAST))
     for i, t in enumerate(['DAYS SINCE', 'SOMEONE', 'TRIED TO', 'FIRE MAS:'])]
    + [dict(id='count', group='sign', text='36', box=(246, 36, 298, 58), ink='red', frames=(105, LAST),
            note='the new count; the old 0 is up o0-63')]
    + [dict(id=f'dir{r}', group='directory', text=t, box=(66, 89 + 9 * r, 413, 96 + 9 * r), ink='light', frames=(0, LAST))
       for r, t in DIR_EP1]
    + [dict(id='terms', group='band', text=TERMS, box=(40, 216, 434, 223), ink='light', frames=(0, LAST)),
       dict(id='pointer', group='band', text=POINTER, box=(100, 232, 380, 239), ink='light', frames=(0, LAST)),
       dict(id='slug', group='band', text='LEGAL TEXT: DRAFT', box=(376, 252, 470, 262), ink='rose', frames=(0, LAST),
            note='lookdev only')]
)
CPS = 16.0          # OUTRO-PROPOSALS s1.1: ~16 characters a second, the doc's read-time rate


def ink_mask(nat, box, ink):
    x0, y0, x1, y1 = box
    a = nat[y0:y1 + 1, x0:x1 + 1].astype(np.float64)
    L = a.mean(2)
    if ink == 'dark':
        return L < 60
    if ink == 'red':
        return (a[..., 0] > 120) & (a[..., 1] < 90)
    if ink == 'rose':                                    # the lookdev slug (band.ts: PAL.U5 on black)
        return (a[..., 0] > 120) & (a[..., 0] > a[..., 1] + 40)
    return L > 150


def main(sc):
    os.makedirs(f'{OUT}/qa', exist_ok=True)
    nframes = len(glob.glob(f'{sc}/dec/f*.png'))
    assert nframes == PRE + OUT_F, nframes

    # ---------------------------------------------------------------- the three key stills (from the mp4)
    keys = [(40, 'key1-o40-wall'), (100, 'key2-o100-hang'), (170, 'key3-o170-lightsdown')]
    stale = f'{OUT}/outro-c-key3-o210-lightsdown.png'          # the first pass's name (its o210 no longer exists)
    if os.path.exists(stale):
        os.remove(stale)
    for o, name in keys:
        dec(sc, PRE + o).save(f'{OUT}/outro-c-{name}.png')

    # ---------------------------------------------------------------- the keyframes sheet (6 numbered frames + grid)
    picks = [(-12, 'the stand-in: the episode\'s last frame (cold open MEDIUM f56)'),
             (40, 'the wall after hours: the sign still at 0; the directory; the band'),
             (72, 'the 0 drops into the box of spare zeros'),
             (105, 'the 6 hangs: 36 (NOV 21 -> DEC 27, 2023, the date on the CLOSED row)'),
             (130, 'the hand gone: house light down; the moth bumps the light box'),
             (170, 'the moth on the final period; out at o179')]
    TW, TH, CAP = 960, 540, 58
    grid_h = 346
    W, H = TW * 3 + 40, 90 + 2 * (TH + CAP) + 20 + grid_h
    S = Image.new('RGB', (W, H), (18, 18, 24))
    d = ImageDraw.Draw(S)
    d.text((20, 18), 'MR. MAS · OUTRO PROPOSAL C · "after hours: DAYS SINCE" · Ep1 mock-up', font=F(30, True), fill=(235, 230, 210))
    d.text((20, 56), f'1 s stand-in + {OUT_F} f outro (3 bars at 96 BPM = {OUT_S:.1f} s) · frames taken from the encoded mp4 · '
           'legal text DRAFT, review pending · temp score', font=F(19), fill=(170, 170, 185))
    for k, (o, cap) in enumerate(picks):
        f = PRE + o
        x = 10 + (k % 3) * (TW + 10)
        y = 90 + (k // 3) * (TH + CAP)
        im = dec(sc, f).resize((TW, TH), Image.NEAREST)
        S.paste(im, (x, y + CAP))
        lab = f'{k + 1}  f{f}' + (f'  o{o}  bar {bb(o)}' if o >= 0 else '  (before o0)')
        d.text((x, y + 4), lab, font=F(24, True), fill=(255, 214, 90))
        d.text((x, y + 32), cap, font=F(18), fill=(215, 215, 225))
    # the to-scale grid
    gy = 90 + 2 * (TH + CAP) + 20
    x0, x1 = 80, W - 30
    px = lambda f: x0 + (x1 - x0) * f / (PRE + OUT_F)
    d.text((20, gy), f'to scale (composition frames 0-{PRE + OUT_F - 1}; outro o0 = f24)', font=F(18, True), fill=(200, 200, 210))
    rows = [('bars', None), ('picture', None), ('sound', None), ('text', None)]
    ry = {n: gy + 50 + i * 70 for i, (n, _) in enumerate(rows)}
    for n in ry:
        d.text((20, ry[n] + 18), n, font=F(17, True), fill=(160, 160, 175))
    # bars
    d.rectangle([px(0), ry['bars'], px(PRE), ry['bars'] + 50], fill=(40, 44, 60))
    d.text((px(0) + 6, ry['bars'] + 14), 'stand-in', font=F(16), fill=(200, 200, 210))
    for b in range(OUT_F // 60):
        c = [(52, 60, 96), (70, 56, 40), (40, 40, 52)][b]
        d.rectangle([px(PRE + 60 * b), ry['bars'], px(PRE + 60 * b + 60) - 2, ry['bars'] + 50], fill=c)
        d.text((px(PRE + 60 * b) + 6, ry['bars'] + 4), f'bar {b + 1}  o{60 * b}-{60 * b + 59}', font=F(16, True), fill=(235, 235, 240))
        d.text((px(PRE + 60 * b) + 6, ry['bars'] + 26),
               ['felt F F F F (4 registers)', 'THE KNEE whole, swung, chip 8va · Db push', 'F-C-G, no third · lights down · out'][b],
               font=F(15), fill=(210, 210, 220))
    ev_pic = [(0, 'cut'), (60, 'hand'), (64, 'unhook 0'), (75, '0 in box'), (90, '3'), (105, '6 = 36'),
              (120, 'hand gone: lights down, flicker'), (130, 'moth at the light'), (150, 'moth lands'), (179, 'out')]
    ev_snd = [(0, 'hum + air'), (64, 'tick'), (75, 'thup'), (90, 'clack'), (105, 'clack'), (120, 'ka-chunk, hum dips'),
              (130, 'tap'), (135, 'tap'), (168, 'fade'), (179, '0')]
    for name, evs, col in [('picture', ev_pic, (255, 214, 90)), ('sound', ev_snd, (120, 220, 235))]:
        y = ry[name]
        d.line([px(PRE), y + 25, px(PRE + OUT_F), y + 25], fill=(80, 80, 95), width=2)
        for j, (o, lab) in enumerate(evs):
            X = px(PRE + o)
            d.line([X, y + 14, X, y + 36], fill=col, width=3)
            t = f'o{o} {lab}'
            tw = d.textlength(t, font=F(14))
            tx = X + 3 if X + 3 + tw < W - 8 else X - 3 - tw        # labels at the end sit left of their tick
            d.text((tx, y + (0 if j % 2 == 0 else 38)), t, font=F(14), fill=col)
    y = ry['text']
    d.rectangle([px(PRE), y + 4, px(PRE + OUT_F), y + 22], fill=(96, 90, 70))
    d.text((px(PRE) + 6, y + 5), f'band: terms line + pointer, o0-o{LAST} = {OUT_S:.1f} s (never moves, never covered)', font=F(14), fill=(20, 20, 20))
    d.rectangle([px(PRE), y + 28, px(PRE + OUT_F), y + 46], fill=(70, 66, 56))
    d.text((px(PRE) + 6, y + 29), f'sign + directory (the credits), o0-o{LAST} = {OUT_S:.1f} s · count 0 until o63, 36 from o105', font=F(14), fill=(230, 230, 230))
    for k, (o, _) in enumerate(picks):
        X = px(PRE + o)
        d.ellipse([X - 11, ry['bars'] - 26, X + 11, ry['bars'] - 4], fill=(255, 214, 90))
        d.text((X - 5, ry['bars'] - 25), str(k + 1), font=F(16, True), fill=(20, 20, 20))
    S.save(f'{OUT}/outro-c-keyframes.png', optimize=True)

    # ---------------------------------------------------------------- variants (Ep1 / Ep4 / Ep10) + the Ep10 still
    caps = [
        ('Ep1 · ep1.0_research_preview.md (o112)', ['36 = NOV 21 -> DEC 27, 2023 (CLOSED DEC 27, 2023 on the board)',
                                                    'a maintenance hand hangs the plates',
                                                    'letters pushed in by hand (one sits 1 px high)']),
        ('Ep4 · ep1.3_not_for_sale.eml (a reset week)', ['the old plates emptied into the box (backs up, two on the floor)',
                                                        '79 = FEB 10 -> APR 30, 2025, from the new reset',
                                                        'still a hand; the letters straighter']),
        ('Ep10 · ep1.9_pace.yaml', ['?? and CLOSED 2027?? : the calendar has lost its grip', 'no hand: the second ? turns on its hooks by itself',
                                    'letters slide into their grooves on their own (THE INTERN · CORNER OFFICE)']),
    ]
    V = Image.new('RGB', (TW * 3 + 40, 80 + CAP + 60 + TH + 60), (18, 18, 24))
    d = ImageDraw.Draw(V)
    d.text((20, 16), 'Outro C · the ladder: the same wall, a new count every week; the machine takes over the typesetting from Ep10',
           font=F(26, True), fill=(235, 230, 210))
    d.text((20, 52), 'Unchanged all season: the band (terms line + pointer), the directory\'s credit rows (per-episode values), '
           'the sign. Remotion stills (lossless). Counts checked at lock.', font=F(18), fill=(170, 170, 185))
    for k in range(3):
        x = 10 + k * (TW + 10)
        im = Image.open(f'{sc}/still-{k}.png').convert('RGB').resize((TW, TH), Image.NEAREST)
        V.paste(im, (x, 80 + CAP + 60))
        d.text((x, 88), caps[k][0], font=F(22, True), fill=(255, 214, 90))
        for j, l in enumerate(caps[k][1]):
            d.text((x, 118 + j * 22), '· ' + l, font=F(17), fill=(215, 215, 225))
    V.save(f'{OUT}/outro-c-variants.png', optimize=True)
    shutil.copyfile(f'{sc}/still-2.png', f'{OUT}/outro-c-ep10.png')

    # ---------------------------------------------------------------- readability QA (from the mp4)
    qa = dict(source='out/lookdev/outro/outro-c.mp4 (decoded)', cps=CPS, frames=nframes, lines=[])
    ref_f = PRE + 170
    nat = np.asarray(Image.open(f'{sc}/native/{ref_f}.png').convert('RGB'))
    full = dec(sc, ref_f)
    small = box4(full)                                   # the 480x270 view: 4x4 area average of the 1080p decode
    fa = np.asarray(full).astype(np.float64)
    total_chars = 0
    for L in LINES:
        x0, y0, x1, y1 = L['box']
        m = ink_mask(nat, L['box'], L['ink'])
        n = nat[y0:y1 + 1, x0:x1 + 1].astype(np.float64)
        s = small[y0:y1 + 1, x0:x1 + 1]
        ink_s, bg_s = np.median(s[m], 0), np.median(s[~m], 0)
        # full size: the centre 2x2 of each native pixel's 4x4 block (away from chroma edges)
        blk = fa[y0 * 4:(y1 + 1) * 4, x0 * 4:(x1 + 1) * 4].reshape(y1 - y0 + 1, 4, x1 - x0 + 1, 4, 3)[:, 1:3, :, 1:3].mean((1, 3))
        ink_f, bg_f = np.median(blk[m], 0), np.median(blk[~m], 0)
        err = np.abs(s - n)
        on_f = L['frames'][1] - L['frames'][0] + 1
        chars = len(L['text'].replace(' ... ', ' '))
        total_chars += chars if L['id'] != 'slug' else 0
        need = chars / CPS
        qa['lines'].append(dict(
            id=L['id'], group=L['group'], text=L['text'], native_box=L['box'], ink_px=int(m.sum()),
            on_screen_frames=on_f, on_screen_s=round(on_f / 24, 2), chars=chars, read_s_at_16cps=round(need, 2),
            read_ok=bool(on_f / 24 >= need),
            contrast_480=round(contrast(ink_s, bg_s), 2), contrast_1080=round(contrast(ink_f, bg_f), 2),
            decode_mae_480=round(float(err.mean()), 2), decode_max_480=round(float(err.max()), 1),
            note=L.get('note', '')))
    # the band never moves: every decoded outro frame's band vs o0's, with the moth's own box masked out (native box
    # from tools/preview.ts + 2 px for chroma bleed). tools/preview.ts 'check' proves, on the native frames, that the
    # moth never covers or touches a band letter.
    moth = {int(k): v for k, v in json.load(open(f'{sc}/native/moth.json')).items()}
    b0 = np.asarray(dec(sc, PRE)).astype(np.int16)[203 * 4:, :]
    worst = 0.0
    for f in range(PRE, PRE + OUT_F):
        bf = np.asarray(dec(sc, f)).astype(np.int16)[203 * 4:, :]
        diff = np.abs(bf - b0)
        mb = moth.get(f - PRE)
        if mb and mb[3] >= 203 - 2:
            mx0, my0, mx1, my1 = mb
            diff[max(0, my0 - 2 - 203) * 4:max(0, my1 + 3 - 203) * 4, max(0, mx0 - 2) * 4:(mx1 + 3) * 4] = 0
        worst = max(worst, float(np.percentile(diff, 99.99)))
    qa['band_stillness_p9999_absdiff'] = worst
    qa['total_chars_on_screen'] = total_chars
    qa['total_read_s_at_16cps'] = round(total_chars / CPS, 1)
    qa['outro_s'] = OUT_S
    # the honest budget: every line is up long enough on its own, but not all of them can be read in one pass.
    # Per group, the read time at 16 cps against the 7.5 s the frame holds (the slug is lookdev only, excluded).
    grp = {}
    for l in qa['lines']:
        if l['id'] != 'slug':
            grp[l['group']] = grp.get(l['group'], 0) + l['chars']
    qa['read_budget'] = dict(
        groups={g: dict(chars=c, read_s=round(c / CPS, 1)) for g, c in grp.items()},
        on_screen_s=OUT_S,
        terms_fit=bool(len(TERMS) / CPS <= OUT_S),
        terms_and_pointer_fit=bool(grp.get('band', 0) / CPS <= OUT_S),
        credits_fit=bool(grp.get('directory', 0) / CPS <= OUT_S),
        all_fit=bool(total_chars / CPS <= OUT_S),
        note=f'each line is up long enough on its own ({OUT_S:.1f} s); the terms line alone reads in '
             f'{len(TERMS) / CPS:.1f} s and fits (rule: up >= 5 s); terms + pointer need {grp.get("band", 0) / CPS:.1f} s; '
             f'the directory needs {grp.get("directory", 0) / CPS:.1f} s, so in one viewing a reader gets the terms, '
             'the count and its date, and a skim of the credits')
    qa['check_txt'] = open(f'{sc}/native/check.txt').read().strip().splitlines()
    with open(f'{OUT}/qa/qa.json', 'w') as fh:
        json.dump(qa, fh, indent=1)

    # the readability sheet: each group at full size (1:1 from the 1080p decode) and at 480x270 (1:1 and x3 nearest)
    groups = [('sign + count', (174, 18, 308, 78)), ('directory', (56, 80, 424, 177)), ('band', (40, 206, 476, 266))]
    sm_img = Image.fromarray(np.clip(small + 0.5, 0, 255).astype(np.uint8))
    blocks = []
    for name, (x0, y0, x1, y1) in groups:
        fcrop = full.crop((x0 * 4, y0 * 4, x1 * 4, y1 * 4))
        s1 = sm_img.crop((x0, y0, x1, y1))
        s3 = s1.resize((s1.width * 3, s1.height * 3), Image.NEAREST)
        blocks.append((name, fcrop, s1, s3))
    Wq = max(b[1].width for b in blocks) + 40
    Hq = 60 + sum(b[1].height + b[2].height + b[3].height + 110 for b in blocks)
    Q = Image.new('RGB', (Wq, Hq), (30, 30, 36))
    d = ImageDraw.Draw(Q)
    d.text((16, 14), f'Outro C readability · frame f{ref_f} (o{ref_f - PRE}) from the ENCODED mp4 · each group: 1080p 1:1, then 480x270 1:1, then 480x270 x3',
           font=F(22, True), fill=(235, 230, 210))
    y = 60
    for name, fc, s1, s3 in blocks:
        d.text((16, y), name + ' · 1080p (1:1)', font=F(18, True), fill=(255, 214, 90)); y += 26
        Q.paste(fc, (16, y)); y += fc.height + 8
        d.text((16, y), '480x270 (1:1)', font=F(16), fill=(200, 200, 210)); y += 22
        Q.paste(s1, (16, y)); y += s1.height + 8
        d.text((16, y), '480x270 (x3, nearest)', font=F(16), fill=(200, 200, 210)); y += 22
        Q.paste(s3, (16, y)); y += s3.height + 24
    Q.save(f'{OUT}/qa/outro-c-readability.png', optimize=True)
    small_full = sm_img
    small_full.save(f'{OUT}/qa/outro-c-o170-480x270.png')
    old = f'{OUT}/qa/outro-c-o210-480x270.png'                  # the first pass's name
    if os.path.exists(old):
        os.remove(old)
    print(json.dumps(dict(lines=len(qa['lines']), all_read_ok=all(l['read_ok'] for l in qa['lines']),
                          min_contrast_480=min(l['contrast_480'] for l in qa['lines']),
                          min_contrast_1080=min(l['contrast_1080'] for l in qa['lines']),
                          max_decode_mae_480=max(l['decode_mae_480'] for l in qa['lines']),
                          band_stillness=worst, total_read_s=qa['total_read_s_at_16cps'])))


if __name__ == '__main__':
    main(sys.argv[1])
