#!/usr/bin/env python3
"""MR. MAS -- style-jump prototype 1 (J1 "CANCELLED"): the vignette's engraved bust, cut line by line.

Why this exists: the shared tonal rig (masTone) hatched every plane with straight parallel lines at one angle, so at
vignette scale his hair was one bowl-shaped mass with a bun-like tuft and the collar read as a wimple ("a woman in a
hood"). This generator engraves Mas from the ANIME rig's on-model geometry (studio/src/shared/anime/Mas.tsx: the
face, ear, neck, hair mass, the six front locks, the cowlick, the hoodie with its hood roll and drawstrings; copied
here, the shared rig is untouched) the way an engraver cuts a portrait:
  - every material has its own line family: the hair strands radiate from the crown and each front lock is cut
    root-to-tip (lines converge at its point); the face is cut in fine lines that follow its contour; the hoodie's
    lines drape from the shoulders; the hood roll is cut along its length
  - tone is line WIDTH (coverage = darkness x local spacing), from a painted value study per material
  - the features (eyes, brows, nose, the tiny closed smile, ear, jaw) are burin contours (tapered strokes)
Deterministic (a seeded PRNG for the strands' clumping). Output: studio/src/dev/jumps/proto1/bustArt.ts (SVG
fragments in bust units, ink/paper as placeholders) and, optionally, a preview PNG at the vignette's print scale.

  ../audio/.venv-mix/bin/python src/dev/jumps/proto1/tools/engrave_bust.py [preview.png] [scale]   (from studio/)
"""
import math
import os
import sys

sys.path.append('/usr/lib/python3/dist-packages')  # pycairo (system) next to the venv's numpy / scipy
import cairo  # noqa: E402
import numpy as np  # noqa: E402
from scipy.ndimage import gaussian_filter, map_coordinates  # noqa: E402
from scipy.spatial import cKDTree  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))
OUT_TS = os.path.join(HERE, '..', 'bustArt.ts')
S_PRINT = 0.54  # px (1080p) per bust unit in the vignette; widths below are chosen for this scale
PX = 1 / S_PRINT  # one 1080p px in units

# ---------------------------------------------------------------- smooth curves (port of shared/anime/ink.ts)
def corner(p):
    return len(p) > 2 and bool(p[2])


def bez(pts, closed=False, k=1.0):
    n = len(pts)
    get = (lambda i: pts[i % n]) if closed else (lambda i: pts[max(0, min(n - 1, i))])
    out = []
    for i in range(n if closed else n - 1):
        p0, p1, p2, p3 = get(i - 1), get(i), get(i + 1), get(i + 2)
        k1 = 0 if corner(p1) else k
        k2 = 0 if corner(p2) else k
        out.append(((p1[0], p1[1]), (p1[0] + (p2[0] - p0[0]) / 6 * k1, p1[1] + (p2[1] - p0[1]) / 6 * k1),
                    (p2[0] - (p3[0] - p1[0]) / 6 * k2, p2[1] - (p3[1] - p1[1]) / 6 * k2), (p2[0], p2[1])))
    return out


def sample(pts, closed=False, per=12):
    out = []
    for i, s in enumerate(bez(pts, closed)):
        for j in range(0 if i == 0 else 1, per + 1):
            t = j / per
            u = 1 - t
            a, b, c, d = u * u * u, 3 * u * u * t, 3 * u * t * t, t * t * t
            out.append((a * s[0][0] + b * s[1][0] + c * s[2][0] + d * s[3][0], a * s[0][1] + b * s[1][1] + c * s[2][1] + d * s[3][1]))
    return np.array(out, float)


def shape(pts):
    return sample(pts, True, 14)


def arclen(P):
    return np.concatenate([[0], np.cumsum(np.linalg.norm(np.diff(P, axis=0), axis=1))])


def resample(P, n):
    L = arclen(P)
    t = np.linspace(0, L[-1], n)
    return np.stack([np.interp(t, L, P[:, 0]), np.interp(t, L, P[:, 1])], 1)


def ease(x):
    return math.sin(max(0.0, min(1.0, x)) * math.pi / 2)


def press_at(press, u):
    if not press:
        return 1.0
    if len(press) == 1:
        return press[0]
    f = u * (len(press) - 1)
    i = min(len(press) - 2, int(f))
    t = f - i
    return press[i] * (1 - t) + press[i + 1] * t


def ink(pts, w, a=0.28, b=0.34, tip=0.08, press=None, closed=False):
    """Tapered burin stroke along the smooth curve through pts (a filled polygon)."""
    S = sample(pts, closed, 12)
    L = arclen(S)
    tot = L[-1] or 1
    n = len(S)
    left, right = [], []
    for i in range(n):
        u = L[i] / tot
        pa, pb = S[max(0, i - 1)], S[min(n - 1, i + 1)]
        tx, ty = pb - pa
        tl = math.hypot(tx, ty) or 1
        tx, ty = tx / tl, ty / tl
        tin = tip + (1 - tip) * ease(u / a) if a > 0 else 1
        tout = tip + (1 - tip) * ease((1 - u) / b) if b > 0 else 1
        hw = w * min(tin, tout) * press_at(press, u) / 2
        left.append((S[i][0] - ty * hw, S[i][1] + tx * hw))
        right.append((S[i][0] + ty * hw, S[i][1] - tx * hw))
    return np.array(left + right[::-1])


def sub(pts, i0, i1):
    return pts[i0:i1 + 1] if i1 >= i0 else pts[i0:] + pts[:i1 + 1]


def ell(cx, cy, rx, ry, rot=0.0, n=48):
    t = np.linspace(0, 2 * math.pi, n, endpoint=False)
    c, s = math.cos(math.radians(rot)), math.sin(math.radians(rot))
    x, y = rx * np.cos(t), ry * np.sin(t)
    return np.stack([cx + x * c - y * s, cy + x * s + y * c], 1)


def shifted(pts, dx, dy):
    return [((p[0] + dx, p[1] + dy, 1) if corner(p) else (p[0] + dx, p[1] + dy)) for p in pts]


def lerp_pts(A, B, t):
    return [((a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, 1) if corner(a) else (a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t)) for a, b in zip(A, B)]


class Rng:  # mulberry32, as shared/anime/ink.ts prng
    def __init__(self, seed):
        self.s = seed & 0xFFFFFFFF

    def __call__(self):
        self.s = (self.s + 0x6D2B79F5) & 0xFFFFFFFF
        t = self.s
        t = ((t ^ (t >> 15)) * (t | 1)) & 0xFFFFFFFF
        t ^= (t + (((t ^ (t >> 7)) * (t | 61)) & 0xFFFFFFFF)) & 0xFFFFFFFF
        return ((t ^ (t >> 14)) & 0xFFFFFFFF) / 4294967296


# ---------------------------------------------------------------- geometry: the anime rig's Mas (Mas.tsx), verbatim
FACE = [(-184, -40), (-178, -140), (-124, -214), (-24, -238), (78, -224), (138, -176), (158, -112),
        (161, -52), (153, -12, 1), (161, 24), (158, 60), (151, 98), (136, 134), (118, 158), (101, 172),
        (78, 176), (40, 166), (0, 150), (-44, 124), (-68, 102), (-80, 62), (-126, 22), (-172, 20)]
EAR = [(-71, -14), (-93, -22), (-110, -7), (-113, 20), (-105, 48), (-89, 62), (-73, 55)]
NECK = [(-96, 30), (44, 120), (58, 170), (64, 206), (72, 246), (88, 296), (20, 290), (-60, 262), (-132, 236), (-124, 190), (-110, 150)]
MASS = [(-124, 34, 1), (-142, 6), (-168, 30, 1), (-186, 0), (-206, -16, 1), (-220, -62), (-226, -112), (-214, -160), (-188, -204),
        (-164, -228), (-146, -224, 1), (-112, -252), (-62, -270), (-24, -266, 1), (20, -278), (86, -264), (140, -234),
        (178, -192), (198, -150, 1), (176, -138), (120, -132), (40, -124), (-30, -118), (-58, -100),
        (-58, -72), (-62, -14, 1), (-78, -52), (-100, -48), (-116, -16, 1), (-120, 8)]
LOCKS = [  # (points root -> edge -> tip -> edge -> root, tip index), drawn in this order (right -> left)
    ([(112, -214, 1), (158, -202), (192, -170), (210, -128), (216, -90, 1), (194, -116), (164, -142), (112, -160, 1)], 4),
    ([(70, -212, 1), (124, -186), (148, -134), (144, -62, 1), (128, -102), (100, -138), (56, -164, 1)], 3),
    ([(92, -160, 1), (112, -130), (114, -80, 1), (100, -108), (82, -136, 1)], 2),
    ([(14, -212, 1), (64, -184), (92, -128), (84, -38, 1), (66, -90), (40, -132), (-4, -164, 1)], 3),
    ([(-40, -206, 1), (4, -178), (26, -128), (14, -62, 1), (0, -104), (-20, -138), (-50, -160, 1)], 3),
    ([(-94, -196, 1), (-52, -172), (-32, -132), (-42, -84, 1), (-56, -112), (-70, -136), (-96, -150, 1)], 3),
]
COW = [(20, -262), (42, -300), (92, -330), (146, -340), (188, -324), (210, -290, 1), (186, -306), (162, -314), (174, -292, 1), (146, -304), (116, -300), (98, -284), (112, -258)]
SH_HAIR = [(-300, 120), (-300, -360), (-70, -360), (-40, -292), (6, -270, 1), (-22, -254), (-20, -226), (-10, -190), (-16, -150), (-28, -110), (-40, 0), (-60, 120)]
SH_FACE = [(-220, -260), (-26, -260), (-40, -150), (-46, -64), (-42, 10), (-26, 66), (8, 112), (48, 148), (100, 190), (100, 260), (-220, 260)]
SH_NOSE = [(133, 52, 1), (143, 74), (141, 86, 1), (124, 89, 1), (133, 76)]
TORSO = [(-110, 218), (-230, 254), (-330, 292), (-390, 328), (-420, 380), (-436, 450), (-444, 560), (-448, 740, 1),
         (344, 740, 1), (340, 540), (328, 424), (302, 352), (256, 306), (176, 272), (84, 252)]
HOOD_BACK = [(-228, 250), (-206, 200), (-150, 168), (-86, 166), (-24, 192), (30, 230), (-40, 254), (-140, 252)]
HOOD_FRONT_OUT = [(-164, 240), (-112, 280), (-40, 318), (40, 342), (112, 340), (180, 310), (224, 278)]
HOOD_FRONT_IN = [(204, 268), (150, 278), (90, 280), (40, 272), (-20, 256), (-80, 234), (-132, 218)]
BODY_DY = -28  # the hoodie sits higher than the anime rig's: a shorter neck reads older and male at vignette size


def up(pts, dy=BODY_DY):
    return [((p[0], p[1] + dy, 1) if corner(p) else (p[0], p[1] + dy)) for p in pts]


TORSO, HOOD_BACK, HOOD_FRONT_OUT, HOOD_FRONT_IN = up(TORSO), up([(-228, 250), (-214, 176), (-156, 132), (-86, 136), (-30, 176), (30, 230), (-40, 254), (-140, 252)]), up(HOOD_FRONT_OUT), up(HOOD_FRONT_IN)
SH_BODY = [(-480, 230), (-296, 258), (-316, 322), (-334, 408), (-346, 500), (-350, 600), (-346, 760), (-480, 760)]
SH_BODY = up(SH_BODY)
SH_HOODBACK = up([(-260, 120), (-100, 120), (-96, 170), (-60, 200), (-20, 240), (-260, 278)])
EYE_NEAR = dict(upper=[(-18, -2), (-8, -17), (10, -27), (32, -28), (47, -19), (54, -5)],
                lower=[(-14, 3), (2, 11), (24, 14), (42, 10), (53, 0)],
                iris=dict(cx=21, cy=-7, rx=12.5, ry=15.5, rangeX=13, rangeY=5), lash=5.6,
                press=[1.25, 1.1, 0.95, 0.75, 0.55], lowerSpan=(0, 3),
                crease=[(-6, -29), (12, -39), (34, -39), (50, -27)], flick=[(-17, -2), (-25, 1), (-30, 6)])
EYE_FAR = dict(upper=[(154, -8), (148, -18), (134, -24), (120, -18), (112, -5)],
               lower=[(152, 0), (142, 8), (126, 8), (114, 0)],
               iris=dict(cx=134, cy=-8, rx=7.5, ry=14, rangeX=7, rangeY=4), lash=5,
               press=[1.2, 1.05, 0.9, 0.6], lowerSpan=(0, 2),
               crease=[(118, -30), (134, -36), (150, -28)], flick=[(154, -7), (160, -4), (163, 1)])
SMILE = [(72, 115), (90, 124), (112, 124), (131, 111)]
BROW_NEAR = [(58, -41), (36, -51), (10, -53), (-16, -43)]
BROW_FAR = [(110, -45), (128, -53), (148, -51), (161, -41)]
LID = 0.14
LOOK_A = (0.45, 0.05)  # toward the cartouche
LOOK_B = (0.9, 0.95)  # beat 3: one line toward the holes (down and right)
HAIR_WHORL = (48, -252)  # the strands grow from the cowlick's root

# ---------------------------------------------------------------- value study raster (1 px = 1 unit)
GX0, GY0, GW, GH = -500, -380, 900, 1160


def _path(ctx, P):
    ctx.move_to(*P[0])
    for q in P[1:]:
        ctx.line_to(*q)
    ctx.close_path()


def raster(polys):
    surf = cairo.ImageSurface(cairo.FORMAT_A8, GW, GH)
    ctx = cairo.Context(surf)
    ctx.translate(-GX0, -GY0)
    for P in polys:
        _path(ctx, P)
    ctx.set_source_rgba(0, 0, 0, 1)
    ctx.fill()
    surf.flush()
    a = np.frombuffer(surf.get_data(), np.uint8).reshape(GH, surf.get_stride())[:, :GW]
    return a.astype(np.float32) / 255


def value(base, layers):
    """darkness map: base, then each (polys, darkness, blur sigma) painted over it."""
    D = np.full((GH, GW), base, np.float32)
    for polys, v, sig in layers:
        m = raster(polys)
        if sig > 0:
            m = gaussian_filter(m, sig)
        D = D * (1 - m) + v * m
    return D


def gradient(fn):
    ys, xs = np.mgrid[GY0:GY0 + GH, GX0:GX0 + GW].astype(np.float32)
    return fn(xs, ys).astype(np.float32)


def at(D, P):
    return map_coordinates(D, [P[:, 1] - GY0, P[:, 0] - GX0], order=1, mode='nearest')


# ---------------------------------------------------------------- line families -> variable-width strips
def strips(lines, D, spacing, *, gain=1.0, gamma=1.0, lo=0.0, wmin=0.42 * PX, wmax=0.86, wfloor=0.0):
    """Each line becomes filled strips whose width is the darkness there times the local spacing (tone = coverage).
    lo: darkness below which the family is absent (a cross-hatch only enters the shadows). Runs thinner than wmin
    break, so highlights are bare paper."""
    out = []
    for i, L in enumerate(lines):
        sp = spacing[i] if isinstance(spacing, list) else spacing
        sp = np.broadcast_to(np.asarray(sp, float), (len(L),))
        d = np.clip((at(D, L) - lo) / (1 - lo), 0, 1) ** gamma
        w = np.minimum(np.maximum(d * sp * gain, np.where(d > 0.02, wfloor, 0)), sp * wmax)
        T = np.gradient(L, axis=0)
        T /= np.maximum(np.linalg.norm(T, axis=1, keepdims=True), 1e-6)
        N = np.stack([-T[:, 1], T[:, 0]], 1)
        on = w >= wmin
        j = 0
        n = len(L)
        while j < n:
            if not on[j]:
                j += 1
                continue
            k = j
            while k < n and on[k]:
                k += 1
            if k - j >= 2:
                seg, ww = L[j:k], w[j:k] / 2
                # soft ends: taper the last sample of a run so a broken line ends in a point, as a burin lifts
                ww = ww.copy()
                ww[0] *= 0.35 if j > 0 else 1
                ww[-1] *= 0.35 if k < n else 1
                a = seg + N[j:k] * ww[:, None]
                b = seg - N[j:k] * ww[:, None]
                out.append(np.concatenate([a, b[::-1]]))
            j = k
    return out


def loft(A, B, n, step=3.0, f0=0.5):
    """n lines between guide curves A and B (both open, same direction). Returns (lines, per-line spacing arrays)."""
    m = int(max(arclen(A)[-1], arclen(B)[-1]) / step) + 2
    A, B = resample(A, m), resample(B, m)
    sp = np.linalg.norm(B - A, axis=1) / n
    lines = [A * (1 - (i + f0) / n) + B * ((i + f0) / n) for i in range(n)]
    return lines, [sp] * n


def offset_family(C, n, pitch, dirv, step=3.0, bow=0.0):
    """n copies of curve C shifted by pitch along dirv (a unit vector), optionally bowed."""
    C = resample(C, int(arclen(C)[-1] / step) + 2)
    t = np.linspace(-1, 1, len(C))
    lines = []
    for i in range(n):
        off = np.array(dirv) * pitch * i
        lines.append(C + off + np.stack([np.zeros_like(t), bow * (1 - t * t) * (i / max(1, n - 1))], 1))
    return lines, [np.full(len(C), pitch)] * n


def fan(W, targets, spacing_at_target, step=3.0, r0=6.0, swirl=0.0, rng=None, jitter=0.0, overshoot=10.0):
    """Strands from the whorl W out to each target (a quadratic curve, bent by swirl). Spacing grows with the
    distance from W, so the lines never pile up into a blot at the crown."""
    W = np.asarray(W, float)
    lines, sps = [], []
    for P in targets:
        v = P - W
        L = np.linalg.norm(v)
        u = v / L
        P2 = P + u * overshoot
        s0 = W + u * r0
        perp = np.array([-u[1], u[0]])
        sw = swirl + (rng() - 0.5) * jitter if rng else swirl
        ctrl = (s0 + P2) / 2 + perp * L * sw
        m = int(L / step) + 3
        t = np.linspace(0, 1, m)[:, None]
        pts = (1 - t) ** 2 * s0 + 2 * (1 - t) * t * ctrl + t ** 2 * P2
        dist = np.linalg.norm(pts - W, axis=1)
        lines.append(pts)
        sps.append(spacing_at_target * dist / L)
    return lines, sps


def true_spacing(lines, cap):
    """The real local spacing of a family whose lines are not evenly spread (a fan hitting its outline at a
    slant): the mean distance to the neighbouring lines, capped (where a neighbour peels away, e.g. at a lock)."""
    trees = [cKDTree(L) for L in lines]
    out = []
    for i, L in enumerate(lines):
        ds = [trees[j].query(L)[0] for j in (i - 1, i + 1) if 0 <= j < len(lines)]
        d = np.mean(ds, axis=0) if ds else np.full(len(L), cap)
        out.append(np.minimum(d, cap))
    return out


def outline_targets(P, pitch):
    L = arclen(P)
    n = int(L[-1] / pitch)
    return resample(P, n)


# ---------------------------------------------------------------- the document: ops recorded once, drawn twice
class Doc:
    def __init__(self):
        self.clips = {}
        self.ops = {'body': [], 'irisA': [], 'irisB': [], 'over': []}
        self.layer = 'body'

    def clip(self, name, polys):
        self.clips[name] = polys if isinstance(polys, list) else [polys]
        return name

    def fill(self, polys, color='i', clip=None):
        if not isinstance(polys, list):
            polys = [polys]
        polys = [p for p in polys if len(p) >= 3]
        if polys:
            self.ops[self.layer].append((clip, color, polys))


def _n(v):
    t = f'{v:.1f}'
    if t.endswith('.0'):
        t = t[:-2]
    if t.startswith('0.'):
        t = t[1:]
    elif t.startswith('-0.'):
        t = '-' + t[2:]
    return '0' if t in ('-0', '') else t


def fmt(P):
    R = np.round(np.asarray(P) * 10).astype(int)
    out = [f'M{_n(R[0][0] / 10)} {_n(R[0][1] / 10)}l']
    parts = []
    for (x0, y0), (x1, y1) in zip(R[:-1], R[1:]):
        dx, dy = (x1 - x0) / 10, (y1 - y0) / 10
        if dx == 0 and dy == 0:
            continue
        a, b = _n(dx), _n(dy)
        parts.append(a + ('' if b.startswith('-') else ' ') + b)
    s = ''.join(out) + ''.join((p if p.startswith('-') or i == 0 else ' ' + p) for i, p in enumerate(parts)) + 'z'
    return s


def to_svg(doc, layer):
    parts = []
    for clip, color, polys in doc.ops[layer]:
        fill = '__INK__' if color == 'i' else '__PAPER__' if color == 'p' else color
        cp = f' clip-path="url(#j1b-{clip})"' if clip else ''
        parts.append(f'<path{cp} fill="{fill}" d="{"".join(fmt(P) for P in polys)}"/>')
    return ''.join(parts)


def clips_svg(doc):
    return ''.join(f'<clipPath id="j1b-{k}"><path d="{"".join(fmt(P) for P in v)}"/></clipPath>' for k, v in doc.clips.items())


def draw_cairo(doc, ctx, layers, ink_rgb, paper_rgb):
    for layer in layers:
        for clip, color, polys in doc.ops[layer]:
            ctx.save()
            if clip:
                for P in doc.clips[clip]:
                    _path(ctx, P)
                ctx.clip()
            for P in polys:
                _path(ctx, P)
            ctx.set_source_rgb(*(ink_rgb if color == 'i' else paper_rgb))
            ctx.fill()
            ctx.restore()


# ---------------------------------------------------------------- the engraving
def build():
    doc = Doc()
    rng = Rng(1117)
    face, ear, neck, mass, cow = shape(FACE), shape(EAR), shape(NECK), shape(MASS), shape(COW)
    torso, hoodb = shape(TORSO), shape(HOOD_BACK)
    hoodf = shape(HOOD_FRONT_OUT + HOOD_FRONT_IN)
    locks = [shape(p) for p, _ in LOCKS]
    dy = BODY_DY

    # ======================= HOODIE (heather grey: the mid value; the far side in shadow) =======================
    D_t = value(0.30, [
        ([shape(SH_BODY)], 0.58, 12),
        ([ink(up([(-318, 430), (-266, 470), (-206, 536)]), 34)], 0.56, 7),
        ([ink(up([(-300, 560), (-262, 600), (-232, 660)]), 26)], 0.54, 7),
        ([ink(up([(244, 380), (266, 450), (276, 540)]), 26)], 0.46, 7),
        ([hoodf + np.array([-14, 30])], 0.58, 7),  # the hood roll's cast shadow on the chest
        ([ink(up([(170, 274), (262, 310), (306, 378), (318, 448)]), 44)], 0.12, 14),  # the monitor on the far shoulder
    ])
    doc.fill(torso, 'p')
    ct = doc.clip('torso', torso)
    # cross-contour drape: parallel to the shoulder line, bowing round the chest toward the crop
    A = sample(up([(-470, 760), (-452, 560), (-440, 450), (-420, 372), (-380, 318), (-300, 280), (-200, 248), (-110, 222), (-10, 232), (90, 250), (180, 270), (262, 306), (312, 360), (336, 430), (346, 560), (352, 760)]))
    B = sample(up([(-470, 820), (-300, 890), (-100, 920), (100, 920), (352, 830)]))
    lines, sp = loft(A, B, 104, step=4.0)
    doc.fill(strips(lines, D_t, sp, gain=1.0, wfloor=0.45 * PX), 'i', ct)
    # the shadow side's cross-hatch runs down the body, following the arm
    A2 = sample(up([(-500, 240), (-470, 520), (-470, 800)]))
    B2 = sample(up([(120, 200), (200, 520), (220, 800)]))
    lines, sp = loft(A2, B2, 80)
    doc.fill(strips(lines, D_t, sp, gain=0.9, lo=0.42, gamma=1.1), 'i', ct)
    doc.fill([ink(sub(TORSO, 0, 7), 4.4, a=0.1, b=0.02, press=[0.8, 1, 1.15, 1.2]),
              ink(sub(TORSO, 8, 14), 3.0, a=0.02, b=0.25, press=[1, 0.9, 0.7, 0.6]),
              ink(up([(-304, 444), (-240, 484), (-200, 534)]), 2.2, a=0.3, b=0.5),
              ink(up([(250, 396), (270, 462), (276, 524)]), 2.0, a=0.3, b=0.5)], 'i')

    # hood, bunched behind the neck (in the shade)
    D_hb = value(0.46, [([shape(SH_HOODBACK)], 0.66, 8)])
    doc.fill(hoodb, 'p')
    chb = doc.clip('hoodb', hoodb)
    A = sample(up([(-236, 256), (-218, 170), (-156, 124), (-80, 128), (-24, 172), (40, 232)]))
    B = sample(up([(-236, 262), (-160, 262), (-80, 262), (-20, 250), (40, 236)]))
    lines, sp = loft(A, B, 14)
    doc.fill(strips(lines, D_hb, sp, gain=1.0, wfloor=0.5 * PX), 'i', chb)
    doc.fill(ink(sub(HOOD_BACK, 0, 4), 3.4, a=0.2, b=0.4), 'i')

    # ======================= NECK (skin; the jaw's shadow falls across its top) =======================
    D_n = value(0.12, [
        ([sample([(-160, 0), (26, 0), (32, 170), (40, 226), (50, 270), (60, 330), (-160, 330)], True)], 0.26, 6),
        ([face + np.array([-10, 34])], 0.5, 4),
    ])
    doc.fill(neck, 'p')
    cn = doc.clip('neck', neck)
    A = sample([(-150, 20), (-160, 130), (-150, 250)])
    B = sample([(110, 90), (100, 200), (110, 320)])
    lines, sp = loft(A, B, 50)
    doc.fill(strips(lines, D_n, sp, gain=1.0), 'i', cn)
    doc.fill([ink([(56, 176), (62, 210), (68, 246)], 2.4, a=0.3, b=0.3),
              ink([(-108, 120), (-116, 170), (-124, 214)], 3.0, a=0.3, b=0.4)], 'i')

    # ======================= HOOD ROLL (the front edge of the hood lying round the neck) + DRAWSTRINGS
    D_hf = value(0.3, [
        ([sample(up([(-200, 198), (-40, 228), (20, 278), (40, 358), (-200, 358)]), True)], 0.56, 8),
        ([sample(up([(120, 278), (200, 274), (226, 278), (180, 302), (110, 314)]), True)], 0.1, 8),
    ])
    doc.fill(hoodf, 'p')
    chf = doc.clip('hoodf', hoodf)
    A = sample(HOOD_FRONT_OUT)
    B = sample(HOOD_FRONT_IN[::-1])
    lines, sp = loft(A, B, 11)
    doc.fill(strips(lines, D_hf, sp, gain=1.0, wfloor=0.5 * PX), 'i', chf)
    doc.fill([ink(HOOD_FRONT_OUT, 4.2, a=0.15, b=0.3, press=[1.2, 1.1, 1, 0.85, 0.7]),
              ink(HOOD_FRONT_IN[1:], 2.8, a=0.3, b=0.3),
              ink(up([(-70, 278), (-6, 304), (60, 318)]), 1.8, a=0.4, b=0.4)], 'i')
    for i, pts in enumerate([up([(26, 322), (22, 370), (18, 418), (16, 462)]), up([(104, 324), (108, 370), (112, 410), (114, 446)])]):
        end = pts[-1]
        ag = [end, (end[0] - 0.5, end[1] + 30)]
        doc.fill(ink(pts, 13, a=0.02, b=0.02, tip=0.6), 'i')  # the cord's contour
        doc.fill(ink(pts, 7.4, a=0.02, b=0.06, tip=0.7), 'p')  # the cord itself: paper, the lightest thing on him
        doc.fill(ink([(p[0] - 2.2, p[1]) for p in pts], 1.4, a=0.1, b=0.3), 'i')
        doc.fill(ink(ag, 15, a=0.01, b=0.01, tip=0.9), 'i')  # the aglet, solid
        doc.fill(ink([(end[0] + 2, end[1] + 4), (end[0] + 1.5, end[1] + 24)], 2.2, a=0.2, b=0.2), 'p')  # its glint
        doc.fill(ell(pts[0][0], pts[0][1] - 3, 7.5, 6), 'i')  # the eyelet
        doc.fill(ell(pts[0][0], pts[0][1] - 3, 3.6, 2.8), 'p')

    # ======================= FACE =======================
    socket = sample([(80, -28, 1), (92, -18), (96, -2, 1), (88, -12)], True)
    bang_cast = [L + np.array([-8, 14]) for L in locks]
    D_f = value(0.07, [
        ([sample(SH_FACE, True)], 0.30, 3.5),
        ([sample(SH_NOSE, True)], 0.36, 1.5),
        ([socket], 0.2, 2),
        (bang_cast, 0.30, 2.5),
        ([ell(152, 20, 10, 40)], 0.0, 6),
        ([ell(140, 22, 12, 24, 12)], 0.02, 5),
        ([ell(104, 162, 12, 6)], 0.02, 3),
    ])
    doc.fill(face, 'p')
    cf = doc.clip('face', face)
    A = sample([(-190, -250), (-200, -120), (-180, 10), (-120, 70), (-60, 130), (0, 170), (60, 200), (110, 200)])
    B = sample([(40, -260), (140, -200), (166, -110), (166, -50), (164, 20), (164, 70), (150, 120), (126, 160), (110, 190)])
    lines, sp = loft(A, B, 44)
    doc.fill(strips(lines, D_f, sp, gain=1.0, wmin=0.34 * PX, wfloor=0.36 * PX), 'i', cf)
    A = sample([(-220, -200), (40, -250)])
    B = sample([(-220, 200), (110, 200)])
    lines, sp = loft(A, B, 70)
    doc.fill(strips(lines, D_f, sp, gain=0.9, lo=0.2, gamma=1.3), 'i', cf)

    D_e = value(0.3, [([sample([(-84, -4), (-100, -4), (-105, 16), (-98, 38), (-86, 44), (-92, 20)], True)], 0.58, 2)])
    doc.fill(ear, 'p')
    ce = doc.clip('ear', ear)
    A = sample([(-68, -22), (-96, -30), (-118, -8), (-120, 24), (-108, 56), (-86, 70)])
    B = sample([(-70, -8), (-84, -12), (-92, 2), (-92, 24), (-86, 40), (-76, 48)])
    lines, sp = loft(A, B, 8)
    doc.fill(strips(lines, D_e, sp, gain=1.0, wfloor=0.5 * PX), 'i', ce)
    doc.fill([ink(sub(EAR, 0, 6), 3.4, a=0.25, b=0.25),
              ink([(-80, -4), (-98, -6), (-103, 14), (-97, 34), (-87, 40)], 2.0, a=0.3, b=0.3)], 'i')
    doc.fill([ink(sub(FACE, 6, 14), 2.4, a=0.25, b=0.05, press=[0.8, 0.7, 0.8, 1]),
              ink(sub(FACE, 14, 20), 3.8, a=0.05, b=0.3, press=[1, 1.25, 1.15, 0.9])], 'i')

    eyes = [EYE_NEAR, EYE_FAR]
    whites = []
    for e in eyes:
        up_, lo = e['upper'], e['lower']
        white = sample([(up_[0][0], up_[0][1], 1)] + up_[1:-1] + [(up_[-1][0], up_[-1][1], 1)] + lo[::-1][1:-1], True)
        whites.append(white)
        doc.fill(white, 'p')
    for layer, (lx, ly) in (('irisA', LOOK_A), ('irisB', LOOK_B)):
        doc.layer = layer
        for k, e in enumerate(eyes):
            ir = e['iris']
            cid = doc.clip(f'white{k}', whites[k])
            ix = ir['cx'] + lx * ir['rangeX']
            iy = ir['cy'] + ly * ir['rangeY'] + LID * ir['ry'] * 0.35
            rx, ry = ir['rx'], ir['ry']
            spokes = []
            nsp = 22 if k == 0 else 14
            for j in range(nsp):
                a = 2 * math.pi * j / nsp
                c, s = math.cos(a), math.sin(a)
                spokes.append(ink([(ix + c * rx * 0.42, iy + s * ry * 0.42), (ix + c * rx * 0.98, iy + s * ry * 0.98)], 2.3 if k == 0 else 2.0, a=0.1, b=0.5, tip=0.3))
            doc.fill(spokes, 'i', cid)
            ring = np.concatenate([ell(ix, iy, rx, ry, n=64), ell(ix, iy, rx * 0.8, ry * 0.8, n=64)[::-1]])
            doc.fill(ring, 'i', cid)
            doc.fill(ell(ix, iy + ry * 0.04, rx * 0.46, ry * 0.5), 'i', cid)
            up_ = e['upper']
            lid_sh = sample(up_ + [(p[0], p[1] + ry * 0.5) for p in up_[::-1]], True)
            cl = doc.clip(f'lid{k}', lid_sh)
            cuts = [ink([(ir['cx'] - 60, yy), (ir['cx'] + 60, yy)], 1.1, a=0.01, b=0.01, tip=1) for yy in np.arange(-40, 30, 2.6)]
            doc.fill(cuts, 'i', cl)
            doc.fill(ell(ix + rx * 0.38, iy - ry * 0.36, max(1.8, rx * 0.26), max(1.8, ry * 0.2), -20), 'p', cid)
    doc.layer = 'over'
    for e in eyes:
        up_, lo = e['upper'], e['lower']
        doc.fill(ink(e['crease'], 1.9, a=0.3, b=0.4), 'i')
        span = lo[e['lowerSpan'][0]:e['lowerSpan'][1] + 1]
        doc.fill(ink(span, 1.9, a=0.35, b=0.45), 'i')
        doc.fill(ink(up_, e['lash'] * 1.05, a=0.04, b=0.3, tip=0.2, press=e['press']), 'i')
        doc.fill(ink(e['flick'], e['lash'] * 0.55, a=0.05, b=0.8), 'i')
    doc.fill([ink(BROW_NEAR, 7.8, a=0.04, b=0.65, tip=0.1, press=[1.1, 1, 0.8, 0.6]),
              ink(BROW_FAR, 6.4, a=0.04, b=0.55, tip=0.1, press=[1.1, 1, 0.8])], 'i')
    doc.fill([ink([(134, 40), (149, 70), (143, 82)], 2.8, a=0.4, b=0.25),
              ink([(126, 87), (137, 89)], 2.6, a=0.3, b=0.3),
              ink(SMILE, 3.2, a=0.3, b=0.3, press=[0.9, 1, 1, 0.8]),
              ink([(70, 113), (73, 121)], 1.6, a=0.4, b=0.4),
              ink([(90, 140), (104, 143), (116, 139)], 1.5, a=0.4, b=0.4)], 'i')

    # ======================= HAIR (dark; strands radiate from the cowlick's root, the locks are cut root to tip) ===
    D_h = value(0.78, [
        ([sample(SH_HAIR, True)], 0.9, 8),
        ([ink([(36, -258), (100, -240), (158, -196)], 28, a=0.3, b=0.3)], 0.34, 6),  # the monitor's sheen on the crown
        ([ink([(-84, -250), (-40, -262), (10, -264)], 20, a=0.4, b=0.4)], 0.62, 6),
    ])
    doc.fill(cow, 'p')
    doc.fill(mass, 'p')
    cm = doc.clip('mass', [mass, cow])
    W = np.array(HAIR_WHORL, float)
    tg = outline_targets(mass, 5.4)
    lines, sps = fan(W, tg, 5.4, r0=0, swirl=-0.12, rng=rng, jitter=0.1)
    # stagger the strands' starts (no bare spot at the whorl) and floor their spacing (it goes dark there instead)
    lines2 = []
    for L in lines:
        k0 = int(rng() * min(len(L) // 3, 8))
        lines2.append(L[k0:])
    sps2 = [np.maximum(s, 2.6) for s in true_spacing(lines2, 14.0)]
    doc.fill(strips(lines2, D_h, sps2, gain=1.0, wmax=0.9, wfloor=0.5 * PX), 'i', cm)
    e1 = sample(COW[0:6])
    e2 = sample([COW[0], COW[12], COW[11], COW[10], COW[9], COW[8]])
    lines, sp = loft(e1, e2, 7)
    doc.fill(strips(lines, D_h, sp, gain=1.0, wfloor=0.5 * PX), 'i', cm)
    doc.fill([ink(sub(MASS, 0, 9), 3.0, a=0.3, b=0.3, tip=0.05), ink(sub(MASS, 9, 13), 3.0, a=0.3, b=0.3, tip=0.05),
              ink(sub(MASS, 13, 18), 3.0, a=0.3, b=0.3, tip=0.05), ink(sub(MASS, 23, 25), 2.6, a=0.3, b=0.3),
              ink(sub(MASS, 25, 29) + [MASS[0]], 2.8, a=0.3, b=0.3),
              ink([(-58, -112), (-58, -72), (-62, -14)], 2.6, a=0.4, b=0.1),
              ink(COW[0:6], 2.8, a=0.4, b=0.2, tip=0.05), ink(COW[5:9], 2.2, a=0.2, b=0.2, tip=0.05),
              ink(COW[8:13], 2.8, a=0.2, b=0.5, tip=0.05)], 'i')
    for li, ((pts, tip), L) in enumerate(zip(LOCKS, locks)):
        doc.fill(L, 'p')
        cl = doc.clip(f'lock{li}', L)
        e1 = sample(pts[0:tip + 1])
        e2 = sample(pts[tip:] + [pts[0]])[::-1]
        n = max(5, int(np.linalg.norm(np.array(pts[0][:2]) - np.array(pts[-1][:2])) / 5.4))
        lines, sp = loft(e1, e2, n)
        doc.fill(strips(lines, D_h, sp, gain=1.0, wfloor=0.5 * PX), 'i', cl)
        doc.fill([ink(pts[0:tip + 1], 2.8, a=0.5, b=0.12, tip=0.04), ink(pts[tip:], 2.4, a=0.12, b=0.5, tip=0.04)], 'i')
    return doc


def write_ts(doc):
    body = to_svg(doc, 'body')
    over = to_svg(doc, 'over')
    a = to_svg(doc, 'irisA')
    b = to_svg(doc, 'irisB')
    defs = clips_svg(doc)
    esc = lambda s: s.replace('\\', '\\\\').replace('`', '\\`')
    ts = (
        '// GENERATED by tools/engrave_bust.py -- do not edit by hand. The vignette\'s engraved Mas, in the anime rig\'s\n'
        '// bust units (crown ~y-340, chin y176, eye line y-8); __INK__ / __PAPER__ are filled in by the host.\n'
        f'export const BUST_SCALE = {S_PRINT};\n'
        f'export const BUST_DEFS = `{esc(defs)}`;\n'
        f'export const BUST_BODY = `{esc(body)}`;\n'
        f'export const BUST_IRIS_A = `{esc(a)}`;\n'
        f'export const BUST_IRIS_B = `{esc(b)}`;\n'
        f'export const BUST_OVER = `{esc(over)}`;\n'
    )
    with open(OUT_TS, 'w') as f:
        f.write(ts)
    return len(ts)


def preview(doc, path, scale=S_PRINT, pupil='A'):
    W, H = int(900 * scale), int(1100 * scale)
    surf = cairo.ImageSurface(cairo.FORMAT_RGB24, W, H)
    ctx = cairo.Context(surf)
    paper = (0xF4 / 255, 0xEE / 255, 0xDF / 255)
    inkc = (0x16 / 255, 0x30 / 255, 0x2A / 255)
    ctx.set_source_rgb(*paper)
    ctx.paint()
    ctx.scale(scale, scale)
    ctx.translate(480, 360)
    draw_cairo(doc, ctx, ['body', 'irisA' if pupil == 'A' else 'irisB', 'over'], inkc, paper)
    surf.write_to_png(path)


if __name__ == '__main__':
    d = build()
    n = write_ts(d)
    print('bustArt.ts', n, 'bytes')
    if len(sys.argv) > 1:
        sc = float(sys.argv[2]) if len(sys.argv) > 2 else S_PRINT
        preview(d, sys.argv[1], sc)
        print('preview', sys.argv[1])
