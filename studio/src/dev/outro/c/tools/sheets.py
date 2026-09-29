"""MR. MAS — outro C: stills, sheets and the readability QA, all taken from the ENCODED mp4 (not from the renderer).

Reads  <SC>/dec/fNNN.png   every frame of out/lookdev/outro/outro-c.mp4, decoded (fNNN = composition frame NNN-1)
       <SC>/native/<f>.png the same frames drawn natively (480x270) by tools/preview.ts: the reference
       <SC>/native/moth.json   the moth's native bounding box per outro frame (tools/preview.ts check)
       <SC>/still-{0,1,2}.png  the variant stills (Remotion, lossless PNG): 0 Ep1 o105, 1 Ep4, 2 Ep10
Writes out/lookdev/outro/c/
       outro-c-key1-o40-wall.png, -key2-o105-36.png, -key3-o170-lightsout.png   (1920x1080, from the mp4)
       outro-c-keyframes.png   six numbered frames from the mp4 + the to-scale bar grid (the small sheet)
       outro-c-variants.png    Ep1 / Ep4 / Ep10 side by side, captioned
       outro-c-ep10.png        the extra still: the Ep10 version (1920x1080)
       qa/outro-c-readability.png  every text line at full size and at 480x270 (1:1 and x3), from the mp4
       qa/qa.json              per-line read time, contrast and decode fidelity; the band's stillness over all frames
Run:   audio/.venv-theme/bin/python studio/src/dev/outro/c/tools/sheets.py <SC>
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
import glob
import json
import os
import shutil
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = REPO
OUT = f'{ROOT}/out/lookdev/outro/c'
PRE = 24
OUT_F = 192          # the outro: 3 bars at 96 BPM + the ring-out = 8.0 s (fourth pass; was 180)
READ_END = 184       # the dip starts (o184-190: the whole frame to black); every line's read ends here
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
# the board (set.ts, fourth pass): a small head row (7-px, y 92), three big rows (14-px, y 104 / 123 / 142), all
# centred on x 240 inside the felt (x 99-380). Lit (P1) o0-o150; dimmed with the room from o151 (the sign is out).
SIGN_OFF = 151
LIT_END = SIGN_OFF - 1
DIR_EP1 = [('head', 'MR. MAS · EP1.0_RESEARCH_PREVIEW.MD', (146, 91, 335, 99)),
           ('big1', 'CREATED BY (CREATOR)', (129, 103, 351, 118)),
           ('big2', 'MADE WITH AI', (175, 122, 305, 137)),
           ('big3', 'AI VOICES · NONE CLONED', (115, 141, 365, 156))]
LINES = (
    [dict(id=f'sign{i}', group='sign', text=t, box=(180, 28 + 10 * i, 244, 35 + 10 * i), ink='dark', frames=(0, LIT_END))
     for i, t in enumerate(['DAYS SINCE', 'SOMEONE', 'TRIED TO', 'FIRE MAS:'])]
    + [dict(id='count35', group='count', text='35', box=(264, 36, 298, 58), ink='red', frames=(0, 104),
            note="last night's count (the hand grips it at o93; its 5 is clear of the slot at o105)"),
       dict(id='count36', group='count', text='36', box=(264, 36, 298, 58), ink='red', frames=(105, LIT_END), ref=140,
            note='tonight\'s count, lit o105-o150; dark (still there, unlit) from o151')]
    + [dict(id=f'dir-{k}', group='directory' if k != 'head' else 'directory-head', text=t, box=bx, ink='light',
            frames=(0, LIT_END)) for k, t, bx in DIR_EP1]
    + [dict(id='terms', group='band', text=TERMS, box=(40, 216, 438, 223), ink='light', frames=(0, READ_END - 1)),
       dict(id='pointer', group='band', text=POINTER, box=(140, 232, 340, 239), ink='light', frames=(0, READ_END - 1)),
       dict(id='slug', group='slug', text='LEGAL TEXT: DRAFT', box=(405, 257, 475, 265), ink='rose', frames=(0, READ_END - 1),
            note='lookdev only (3x5 micro face)')]
)
CPS = 16.0          # OUTRO-PROPOSALS s1.1: ~16 characters a second, the doc's read-time rate


def ink_mask(nat, box, ink):
    x0, y0, x1, y1 = box
    a = nat[y0:y1 + 1, x0:x1 + 1].astype(np.float64)
    L = a.mean(2)
    if ink == 'dark':
        return L < 60
    if ink == 'red':                                     # the digits are R1 (0x6e1624) on the lit face
        return (a[..., 0] > 80) & (a[..., 0] > a[..., 1] + 50)
    if ink == 'rose':                                    # the lookdev slug (band.ts: PAL.U5 on black)
        return (a[..., 0] > 120) & (a[..., 0] > a[..., 1] + 40)
    return L > 150


def main(sc):
    os.makedirs(f'{OUT}/qa', exist_ok=True)
    nframes = len(glob.glob(f'{sc}/dec/f*.png'))
    assert nframes == PRE + OUT_F, nframes

    # ---------------------------------------------------------------- the three key stills (from the mp4)
    keys = [(40, 'key1-o40-wall'), (105, 'key2-o105-36'), (170, 'key3-o170-lightsout')]
    for stale in ['key3-o210-lightsdown', 'key2-o100-hang', 'key3-o170-lightsdown']:   # earlier passes' names
        if os.path.exists(f'{OUT}/outro-c-{stale}.png'):
            os.remove(f'{OUT}/outro-c-{stale}.png')
    for o, name in keys:
        dec(sc, PRE + o).save(f'{OUT}/outro-c-{name}.png')

    # ---------------------------------------------------------------- the keyframes sheet (6 numbered frames + grid)
    picks = [(-12, 'the stand-in: the episode\'s last frame (cold open MEDIUM f56)'),
             (40, 'the quiet read (o0-83): the sign at last night\'s 35; three big credit lines; the band'),
             (95, 'the hand grips last night\'s 5 (tonight\'s 6 hangs behind it)'),
             (105, 'on the knee\'s C the 5 is clear: 36 (NOV 21 -> DEC 27, 2023)'),
             (152, 'the timer\'s second step: the sign goes out; the moth loses its light'),
             (170, 'the moth on the one light left: the terms line\'s final period; the dip o184-190')]
    TW, TH, CAP = 960, 540, 58
    grid_h = 346
    W, H = TW * 3 + 40, 90 + 2 * (TH + CAP) + 20 + grid_h
    S = Image.new('RGB', (W, H), (18, 18, 24))
    d = ImageDraw.Draw(S)
    d.text((20, 18), 'MR. MAS · OUTRO PROPOSAL C · "after hours: DAYS SINCE" · Ep1 mock-up', font=F(30, True), fill=(235, 230, 210))
    d.text((20, 56), f'1 s stand-in + {OUT_F} f outro (3 bars at 96 BPM + the ring-out = {OUT_S:.1f} s) · frames taken from the encoded mp4 · '
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
    segs = [(0, 60, 'bar 1  o0-59', 'felt F F F F (4 registers) · quiet read'),
            (60, 120, 'bar 2  o60-119', 'THE KNEE whole, swung, chip 8va · Db push'),
            (120, 180, 'bar 3  o120-179', 'F-C-G, no third · house down · sign out'),
            (180, OUT_F, 'o180-191', 'ring-out · dip')]
    for b, (s0, s1, lab, what) in enumerate(segs):
        c = [(52, 60, 96), (70, 56, 40), (40, 40, 52), (30, 30, 36)][b]
        d.rectangle([px(PRE + s0), ry['bars'], px(PRE + s1) - 2, ry['bars'] + 50], fill=c)
        d.text((px(PRE + s0) + 6, ry['bars'] + 4), lab, font=F(16 if b < 3 else 13, True), fill=(235, 235, 240))
        if b < 3:
            d.text((px(PRE + s0) + 6, ry['bars'] + 26), what, font=F(15), fill=(210, 210, 220))
    ev_pic = [(0, 'cut'), (84, 'hand'), (93, 'grips 5'), (105, 'clear: 36'), (116, '5 in box'),
              (120, 'house down, flicker'), (130, 'moth at the sign'), (151, 'sign out'), (165, 'moth lands'),
              (184, 'dip'), (191, 'out')]
    ev_snd = [(0, 'hum + air'), (93, 'tap'), (101, 'ticks'), (116, 'thup'), (120, 'ka-chunk, hum dips'),
              (130, 'tap'), (135, 'tap'), (151, 'clunk, hum stops'), (176, 'fade'), (190, '0')]
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
    d.rectangle([px(PRE), y + 4, px(PRE + READ_END), y + 22], fill=(96, 90, 70))
    d.text((px(PRE) + 6, y + 5), f'band: terms line + pointer, o0-o{READ_END - 1} = {READ_END / 24:.2f} s (never moves, never covered), then the dip', font=F(14), fill=(20, 20, 20))
    d.rectangle([px(PRE), y + 28, px(PRE + 84), y + 46], fill=(120, 110, 70))
    d.rectangle([px(PRE + 84), y + 28, px(PRE + SIGN_OFF), y + 46], fill=(70, 66, 56))
    d.rectangle([px(PRE + SIGN_OFF), y + 28, px(PRE + READ_END), y + 46], fill=(44, 44, 50))
    d.text((px(PRE) + 6, y + 29), 'quiet read o0-83 (3.5 s): sign + 3 credit lines', font=F(14), fill=(20, 20, 20))
    d.text((px(PRE + 84) + 6, y + 29), f'lit to o{LIT_END} · 35 until o104, 36 from o105', font=F(14), fill=(230, 230, 230))
    d.text((px(PRE + SIGN_OFF) + 6, y + 29), 'lights out: band only', font=F(14), fill=(200, 200, 205))
    for k, (o, _) in enumerate(picks):
        X = px(PRE + o)
        d.ellipse([X - 11, ry['bars'] - 26, X + 11, ry['bars'] - 4], fill=(255, 214, 90))
        d.text((X - 5, ry['bars'] - 25), str(k + 1), font=F(16, True), fill=(20, 20, 20))
    S.save(f'{OUT}/outro-c-keyframes.png', optimize=True)

    # ---------------------------------------------------------------- variants (Ep1 / Ep4 / Ep10) + the Ep10 still
    caps = [
        ('Ep1 · ep1.0_research_preview.md (o105)', ["35 -> 36: last night's plate comes off, tonight's is behind it",
                                                    '36 = NOV 21 (the reset, sc 30) -> DEC 27, 2023 (Ep1\'s last date)',
                                                    'a maintenance hand turns the count, every night']),
        ('Ep4 · ep1.3_not_for_sale.eml (a reset week)', ['the old plates emptied into the box (backs up, two on the floor)',
                                                        '78 -> 79 = FEB 10 -> APR 30, 2025, from the new reset',
                                                        'still a hand']),
        ('Ep10 · ep1.9_pace.yaml', ['?? : the calendar has lost its grip', 'no hand: the second ? turns on its hooks by itself',
                                    'the egg row slides into its groove on its own (THE INTERN · CORNER OFFICE)']),
    ]
    V = Image.new('RGB', (TW * 3 + 40, 80 + CAP + 60 + TH + 60), (18, 18, 24))
    d = ImageDraw.Draw(V)
    d.text((20, 16), 'Outro C · the ladder: the same wall, a new count every week; the machine takes over the typesetting from Ep10',
           font=F(26, True), fill=(235, 230, 210))
    d.text((20, 52), 'Unchanged all season: the band (terms line + pointer), the three credit lines (exact per episode), the sign. '
           'Per episode: the file on the head row, the count, one egg row. Remotion stills (lossless). Counts checked at lock.',
           font=F(18), fill=(170, 170, 185))
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
    ref_f = PRE + 40                                     # the quiet read: house light on, no hand, no moth
    cache = {}

    def frame_pair(f):
        if f not in cache:
            nat = np.asarray(Image.open(f'{sc}/native/{f}.png').convert('RGB'))
            full = dec(sc, f)
            cache[f] = (nat, full, box4(full), np.asarray(full).astype(np.float64))
        return cache[f]

    for L in LINES:
        x0, y0, x1, y1 = L['box']
        rf = PRE + L.get('ref', 40)
        nat, full, small, fa = frame_pair(rf)
        m = ink_mask(nat, L['box'], L['ink'])
        n = nat[y0:y1 + 1, x0:x1 + 1].astype(np.float64)
        sm = small[y0:y1 + 1, x0:x1 + 1]
        ink_s, bg_s = np.median(sm[m], 0), np.median(sm[~m], 0)
        # full size: the centre 2x2 of each native pixel's 4x4 block (away from chroma edges)
        blk = fa[y0 * 4:(y1 + 1) * 4, x0 * 4:(x1 + 1) * 4].reshape(y1 - y0 + 1, 4, x1 - x0 + 1, 4, 3)[:, 1:3, :, 1:3].mean((1, 3))
        ink_f, bg_f = np.median(blk[m], 0), np.median(blk[~m], 0)
        err = np.abs(sm - n)
        on_f = L['frames'][1] - L['frames'][0] + 1
        chars = len(L['text'])
        need = chars / CPS
        qa['lines'].append(dict(
            id=L['id'], group=L['group'], text=L['text'], native_box=L['box'], ref_outro_frame=rf - PRE, ink_px=int(m.sum()),
            frames=L['frames'], on_screen_s=round(on_f / 24, 2), chars=chars, read_s_at_16cps=round(need, 2),
            read_ok=bool(on_f / 24 >= need),
            contrast_480=round(contrast(ink_s, bg_s), 2), contrast_1080=round(contrast(ink_f, bg_f), 2),
            decode_mae_480=round(float(err.mean()), 2), decode_max_480=round(float(err.max()), 1),
            note=L.get('note', '')))
    nat, full, small, fa = frame_pair(ref_f)
    # the band never moves: every decoded outro frame's band vs o0's, up to the dip, with the moth's own box masked
    # out (native box from tools/preview.ts + 2 px for chroma bleed). tools/preview.ts 'check' proves, on the native
    # frames, that the moth never covers or touches a band letter.
    moth = {int(k): v for k, v in json.load(open(f'{sc}/native/moth.json')).items()}
    b0 = np.asarray(dec(sc, PRE)).astype(np.int16)[203 * 4:, :]
    worst = 0.0
    for f in range(PRE, PRE + READ_END):
        bf = np.asarray(dec(sc, f)).astype(np.int16)[203 * 4:, :]
        diff = np.abs(bf - b0)
        mb = moth.get(f - PRE)
        if mb and mb[3] >= 203 - 2:
            mx0, my0, mx1, my1 = mb
            diff[max(0, my0 - 2 - 203) * 4:max(0, my1 + 3 - 203) * 4, max(0, mx0 - 2) * 4:(mx1 + 3) * 4] = 0
        worst = max(worst, float(np.percentile(diff, 99.99)))
    qa['band_stillness_p9999_absdiff'] = worst
    # the dip: the last frame is black, the frame before the dip is not
    last = np.asarray(dec(sc, PRE + OUT_F - 1)).astype(np.float64)
    qa['dip'] = dict(frames='o184-o190 (25/50/75/100 %), o190-191 black', last_frame_mean=round(float(last.mean()), 2),
                     last_frame_max=round(float(last.max()), 1))
    qa['outro_s'] = OUT_S
    qa['read_end_s'] = round(READ_END / 24, 2)
    # the honest budget (16 cps; the slug is lookdev only, excluded; the count's two states are one read)
    grp = {}
    for l in qa['lines']:
        if l['id'] not in ('slug', 'count35'):
            grp[l['group']] = grp.get(l['group'], 0) + l['chars']
    quiet = 84 / 24
    rs = {g: round(c / CPS, 2) for g, c in grp.items()}
    qa['read_budget'] = dict(
        groups={g: dict(chars=c, read_s=rs[g]) for g, c in grp.items()},
        quiet_read_s=round(quiet, 2),
        credits_fit_quiet=bool(rs['directory'] <= quiet),
        sign_and_credits_fit_quiet=bool(rs['sign'] + rs['count'] + rs['directory'] <= quiet),
        terms_fit=bool(len(TERMS) / CPS <= READ_END / 24),
        terms_and_pointer_fit=bool(rs['band'] <= READ_END / 24),
        everything_s=round(sum(grp.values()) / CPS, 1),
        note=f'the three big credit lines read in {rs["directory"]:.1f} s and fit the {quiet:.1f} s quiet read (o0-o83); '
             f'with the sign ({rs["sign"] + rs["count"]:.1f} s) they need {rs["sign"] + rs["count"] + rs["directory"]:.1f} s: '
             f'the sign is read with the hand (o84-o118), which is where the eye already is. The small head row '
             f'({rs["directory-head"]:.1f} s) is a skim. The band is up {READ_END / 24:.2f} s: the terms line alone '
             f'({len(TERMS) / CPS:.1f} s) fits; terms + pointer need {rs["band"]:.1f} s, {rs["band"] - READ_END / 24:.1f} s '
             'more than the frame holds, and from o151 the band is the only lit text in frame. Everything on the frame '
             f'in one pass needs {sum(grp.values()) / CPS:.1f} s: nobody reads it all in one viewing')
    qa['check_txt'] = open(f'{sc}/native/check.txt').read().strip().splitlines()
    with open(f'{OUT}/qa/qa.json', 'w') as fh:
        json.dump(qa, fh, indent=1)

    # the readability sheet: each group at full size (1:1 from the 1080p decode) and at 480x270 (1:1 and x3 nearest)
    groups = [('sign + count', (174, 18, 308, 78)), ('directory', (94, 79, 386, 177)), ('band', (40, 206, 476, 266))]
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
    sm_img.save(f'{OUT}/qa/outro-c-o40-480x270.png')
    end_small = box4(dec(sc, PRE + 170))
    Image.fromarray(np.clip(end_small + 0.5, 0, 255).astype(np.uint8)).save(f'{OUT}/qa/outro-c-o170-480x270.png')
    old = f'{OUT}/qa/outro-c-o210-480x270.png'                  # the first pass's name
    if os.path.exists(old):
        os.remove(old)
    print(json.dumps(dict(lines=len(qa['lines']), all_read_ok=all(l['read_ok'] for l in qa['lines']),
                          min_contrast_480=min(l['contrast_480'] for l in qa['lines']),
                          min_contrast_1080=min(l['contrast_1080'] for l in qa['lines']),
                          max_decode_mae_480=max(l['decode_mae_480'] for l in qa['lines']),
                          band_stillness=worst, read_budget={k: v for k, v in qa['read_budget'].items() if k != 'note'},
                          dip=qa['dip'])))


if __name__ == '__main__':
    main(sys.argv[1])
