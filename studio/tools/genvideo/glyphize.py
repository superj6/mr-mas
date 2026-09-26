#!/usr/bin/env python3
"""MR. MAS genvideo: GLYPHIZE a video into the show's GLYPH look (dark foreshadowing only; PIXEL_GUIDE §2).

A port of the engine's glyph renderer (src/shared/pixel/glyph.ts glyphLayer + glyphDraw.ts drawGlyphLayer):
  - the frame is read on the native grid in 2x3-px cells; each cell's density is the OKLab-lightness tone curve
    (mean 62% / max 38%, so 1-px rims register), its colour the lightness-weighted average
  - glyphs are chosen from TOKEN_GLYPHS by density, the ramp MEASURED from the same JetBrains Mono file the
    engine loads (same 44 px probe); strong cell edges become contour glyphs - \\ | /
  - colour = gain * (0.62 + 0.95 v), leaning to the latent machine cyan (C6) in the shadows
  - deterministic shimmer: the engine's hash(), ported exactly (verified against the engine's own values)
  - bloom: the engine's two additive Gaussian passes (sigma 0.9 and 0.3 of the cell height), then the tokens
Video additions: the same 24 fps conform / temporal filter / palette mapping as pixelize.py, and per-cell
hysteresis so tokens don't flicker between neighbouring glyphs (the only intended motion is the shimmer).

In Remotion the canonical path is the engine itself: <GenVideoScene clip=... switch={{type: 'glyph'}}/> on the
pixelized clip. Use this tool for offline previews, whole-frame glyph inserts, and plates.

  audio/.venv-genvideo/bin/python studio/tools/genvideo/glyphize.py IN.mp4 --out-mp4 OUT.mp4
  audio/.venv-genvideo/bin/python studio/tools/genvideo/glyphize.py studio/public/genvideo/<clip> --out-mp4 OUT.mp4
"""
from __future__ import annotations

import argparse
import json
import sys
import time
from pathlib import Path

import numpy as np
import cv2
from PIL import Image, ImageDraw, ImageFont

sys.path.insert(0, str(Path(__file__).resolve().parent))
import gvlib as gv  # noqa: E402

FONT_DIR = gv.STUDIO / 'node_modules/@fontsource/jetbrains-mono/files'
_BAYER4 = np.array([[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]], np.float32)


def font_path(weight: int) -> str:
    p = FONT_DIR / f'jetbrains-mono-latin-{weight}-normal.woff'
    if not p.exists():
        raise SystemExit(f'missing {p} (npm ci in studio/)')
    return str(p)


def measure_ramp(chars: str, weight: int):
    """glyphDraw.ts measure(): ink of each glyph at 44 px in a 36x54 box, sorted, normalised to the densest."""
    f = ImageFont.truetype(font_path(weight), 44)
    out = []
    for ch in chars:
        im = Image.new('L', (36, 54), 0)
        ImageDraw.Draw(im).text((18, 27), ch, font=f, fill=255, anchor='mm')
        out.append((np.asarray(im, np.float64).sum() / (36 * 54 * 255), ch))
    out.sort(key=lambda o: (o[0], o[1]))
    mx = out[-1][0] or 1
    return [o[1] for o in out], np.array([o[0] / mx for o in out])


def pick_glyph(chars, dens, t, pick, spread=0.06):
    lo = int(np.searchsorted(dens, t, side='left'))
    lo = min(lo, len(dens) - 1)
    a = b = lo
    while a > 0 and t - dens[a - 1] < spread:
        a -= 1
    while b < len(dens) - 1 and dens[b + 1] - t < spread:
        b += 1
    return chars[a + min(b - a, int(np.floor(pick * (b - a + 1))))]


class GlyphRenderer:
    def __init__(self, style: dict, pal_json: dict, scale=4):
        g = pal_json['glyph']
        d = dict(g['defaults'])
        d.update({'cell': g['cell'], 'tone': g['tone'], 'chars': g['chars']})
        d.update({k: v for k, v in style.items() if v is not None})
        self.s = d
        self.edge_glyphs = g['edgeGlyphs']
        self.scale = scale
        self.cw, self.ch = d['cell']
        self.chars, self.dens = measure_ramp(d['chars'], d['weight'])
        self.tint = np.array(gv.hex2rgb(d['tint']) if isinstance(d['tint'], str) else [(d['tint'] >> 16) & 255, (d['tint'] >> 8) & 255, d['tint'] & 255], np.float64)
        self.bg = np.array(gv.hex2rgb(d['bg']) if isinstance(d['bg'], str) else [(d['bg'] >> 16) & 255, (d['bg'] >> 8) & 255, d['bg'] & 255], np.float64)
        cellH = self.ch * scale
        s0, s1 = d['size']
        self.sizes = [max(6, int(np.floor(cellH * (s0 + (s1 - s0) * (q / 3)) + 0.5))) for q in range(4)]
        self.fonts = [ImageFont.truetype(font_path(d['weight']), sz) for sz in self.sizes]
        self.patch = (cellH * 2, self.cw * scale * 2)  # (h, w) glyph stamp, centred on the cell centre
        self._stamps = {}
        self.prev = None

    def stamp(self, ch, q):
        key = (ch, q)
        st = self._stamps.get(key)
        if st is None:
            ph, pw = self.patch
            im = Image.new('L', (pw, ph), 0)
            # canvas: textAlign centre, textBaseline middle, at the cell centre + 0.25 * scale down
            ImageDraw.Draw(im).text((pw / 2, ph / 2 + self.scale * 0.25), ch, font=self.fonts[q], fill=255, anchor='mm')
            st = np.asarray(im, np.float32) / 255.0
            self._stamps[key] = st
        return st

    # ---------------------------------------------------------------------------- glyph.ts glyphLayer
    def cells(self, rgb: np.ndarray, mask: np.ndarray | None, frame: int, hyst=0.0):
        s = self.s
        h, w = rgb.shape[:2]
        cw, ch = self.cw, self.ch
        cols, rows = -(-w // cw), -(-h // ch)
        lab = gv.srgb8_to_oklab(rgb)
        L = lab[..., 0].astype(np.float64)
        lo, hi, gam = s['tone']['lo'], s['tone']['hi'], s['tone']['gamma']
        t = np.power(np.clip((L - lo) / (hi - lo), 0, 1), gam)
        wgt = 0.04 + L * L
        pad = lambda a: np.pad(a, [(0, rows * ch - h), (0, cols * cw - w)] + [(0, 0)] * (a.ndim - 2), mode='constant')  # noqa: E731
        valid = pad(np.ones((h, w))).reshape(rows, ch, cols, cw)
        tt = pad(t).reshape(rows, ch, cols, cw)
        n = valid.sum((1, 3))
        v = (tt.sum((1, 3)) / np.maximum(n, 1)) * 0.62 + tt.max((1, 3)) * 0.38
        ww = pad(wgt).reshape(rows, ch, cols, cw)
        rgbp = pad(rgb.astype(np.float64)).reshape(rows, ch, cols, cw, 3)
        col = np.round((rgbp * ww[..., None]).sum((1, 3)) / np.maximum(ww.sum((1, 3)), 1e-9)[..., None])
        inside = np.ones((rows, cols), bool)
        if mask is not None:
            cov = pad(mask).reshape(rows, ch, cols, cw).mean((1, 3))
            by = (_BAYER4[np.arange(rows)[:, None] & 3, np.arange(cols)[None, :] & 3] + 0.5) / 16
            inside = (cov >= 0.999) | ((cov > 0) & (cov > by))
        v = np.where(inside, v, 0.0)
        # video: a cell keeps its previous density (so its glyph) and colour unless they really changed
        if hyst > 0 and self.prev is not None:
            pv, pc = self.prev
            keep = np.abs(v - pv) < hyst
            v = np.where(keep, pv, v)
            keepc = np.abs(col - pc).max(-1) < 14
            col = np.where(keepc[..., None], pc, col)
        self.prev = (v.copy(), col.copy())
        # contour glyphs from a Sobel on the cell densities (0 outside the grid and outside the region)
        P = np.pad(v, 1)
        gx = P[:-2, 2:] + 2 * P[1:-1, 2:] + P[2:, 2:] - P[:-2, :-2] - 2 * P[1:-1, :-2] - P[2:, :-2]
        gy = P[2:, :-2] + 2 * P[2:, 1:-1] + P[2:, 2:] - P[:-2, :-2] - 2 * P[:-2, 1:-1] - P[:-2, 2:]
        edge = np.full((rows, cols), -1)
        if s.get('edges', True):
            strong = np.hypot(gx, gy) > s['edgeAt']
            ang = np.degrees(np.arctan2(gx, -gy)) % 180
            e = np.where((ang < 22.5) | (ang >= 157.5), 0, np.where(ang < 67.5, 1, np.where(ang < 112.5, 2, 3)))
            edge = np.where(strong, e, -1)
        # pickFor(): deterministic shimmer (the engine's hash)
        cy, cx = np.mgrid[0:rows, 0:cols]
        seed = s['seed']
        step = frame // max(1, s['shimmerStep'])
        pick = gv.js_hash(cx, cy, seed)
        if s['shimmer'] > 0:
            roll = gv.js_hash(cx, cy, seed * 7 + step * 31 + 1) < s['shimmer']
            pick = np.where(roll, gv.js_hash(cx, cy, seed + step * 13 + 5), pick)
        # tokenColour()
        gain = s['gain'] * (0.62 + 0.95 * v)
        sc = np.minimum(255, np.round(col * gain[..., None]))
        tm = (s['tintAmt'] * (1 - v) * 0.8)[..., None]
        tcol = np.round(sc * (1 - tm) + self.tint * tm)
        return dict(v=v, col=tcol, edge=edge, pick=pick, inside=inside, rows=rows, cols=cols, cx=cx, cy=cy)

    # ---------------------------------------------------------------------------- glyphDraw.ts drawGlyphLayer
    def render(self, native_rgb: np.ndarray, cells: dict) -> np.ndarray:
        s = self.s
        k = self.scale
        cw, ch = self.cw, self.ch
        H, W = native_rgb.shape[0] * k, native_rgb.shape[1] * k
        base = gv.upscale(native_rgb, k).astype(np.float32) / 255.0
        ins = cells['inside']
        # 1) the glyph region's ground (cells filled with bg)
        fill = np.repeat(np.repeat(ins, ch * k, 0), cw * k, 1)[:H, :W]
        base[fill] = self.bg / 255.0
        # 2) tokens into a transparent layer (premultiplied), stamped by (glyph, size) with non-overlapping groups
        ph, pw = self.patch
        GP = np.zeros((H + 2 * ph, W + 2 * pw, 3), np.float32)
        GA = np.zeros((H + 2 * ph, W + 2 * pw), np.float32)
        v, edge, pick, col = cells['v'], cells['edge'], cells['pick'], cells['col']
        floor = s['floor']
        tok = ins & (v >= floor)
        groups = {}
        for (r, c) in zip(*np.nonzero(tok)):
            vv = min(1.0, v[r, c])
            g = self.edge_glyphs[edge[r, c]] if edge[r, c] >= 0 else pick_glyph(self.chars, self.dens, min(1.0, vv * 0.98), pick[r, c])
            if g == ' ':
                continue
            q = int(np.floor(vv * 3 + 0.5))
            groups.setdefault((g, q, r & 1, c & 1), []).append((r, c))
        noise = s.get('noise', 0) or 0
        if noise > 0:
            cy, cx = cells['cy'], cells['cx']
            nz = ins & (v < floor) & (gv.js_hash(cx, cy, s['seed'] + 99) < noise * 0.35)
            for (r, c) in zip(*np.nonzero(nz)):
                vv = 0.12 + float(gv.js_hash(r, c, 3)) * 0.2
                g = pick_glyph(self.chars, self.dens, vv * 0.98, pick[r, c])
                if g != ' ':
                    groups.setdefault((g, int(np.floor(vv * 3 + 0.5)), r & 1, c & 1, 'n'), []).append((r, c))
        for key, rc in groups.items():
            st = self.stamp(key[0], key[1])
            rc = np.array(rc)
            y0 = rc[:, 0] * ch * k + (ch * k) // 2 - ph // 2 + ph
            x0 = rc[:, 1] * cw * k + (cw * k) // 2 - pw // 2 + pw
            yy = y0[:, None, None] + np.arange(ph)[None, :, None]
            xx = x0[:, None, None] + np.arange(pw)[None, None, :]
            a = st[None].repeat(len(rc), 0)
            if len(key) == 5:  # noise tokens: tint colour, faint alpha
                cc = np.broadcast_to(self.tint / 255.0, (len(rc), 3)).astype(np.float32)
                a = a * (0.1 + gv.js_hash(rc[:, 1], rc[:, 0], 5).astype(np.float32) * 0.18)[:, None, None]
            else:
                cc = (col[rc[:, 0], rc[:, 1]] / 255.0).astype(np.float32)
            GP[yy, xx] = GP[yy, xx] * (1 - a[..., None]) + cc[:, None, None, :] * a[..., None]
            GA[yy, xx] = GA[yy, xx] * (1 - a) + a
        GP = GP[ph:ph + H, pw:pw + W]
        GA = GA[ph:ph + H, pw:pw + W]
        # 3) bloom: two additive blurred passes ('lighter'), then the tokens source-over
        out = base
        bloom = s['bloom']
        if bloom > 0:
            cellH = ch * k
            for sig, amt in ((max(2.0, cellH * 0.9), bloom * 0.85), (max(1.0, cellH * 0.3), bloom * 0.55)):
                out = np.minimum(1.0, out + cv2.GaussianBlur(GP, (0, 0), sig) * amt)
        out = GP + out * (1 - GA[..., None])
        return np.clip(np.round(out * 255), 0, 255).astype(np.uint8)


def load_clip_folder(folder: Path):
    man = json.loads((folder / 'clip.json').read_text())
    draws = [cv2.cvtColor(cv2.imread(str(folder / n)), cv2.COLOR_BGR2RGB) for n in man['drawings']]
    return man['timeline'], draws


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('input', help='a video, or a converted clip folder (clip.json + drawings from pixelize.py)')
    g = ap.add_argument_group('source (video input; same meaning as pixelize.py)')
    g.add_argument('--t-in', type=float, default=0.0)
    g.add_argument('--t-out', type=float, default=None)
    g.add_argument('--speed', type=float, default=1.0)
    g.add_argument('--on', default='2', choices=['1', '2', '3', 'auto'])
    g.add_argument('--denoise', type=float, default=0.7)
    g.add_argument('--families', default=None, help='palette families for the pre-mapping (default: all)')
    g.add_argument('--no-quantize', action='store_true', help='read the smooth native colours instead of palette colours')
    g.add_argument('--crop', default=None)
    g = ap.add_argument_group('glyph style (engine GlyphStyle; defaults from palettes.json)')
    g.add_argument('--tone', default=None, help='lo,hi,gamma (engine default 0.12,0.62,0.8)')
    g.add_argument('--cell', default=None, help='w,h native px (default 2,3)')
    g.add_argument('--bloom', type=float, default=None)
    g.add_argument('--tint', default=None, help='hex, default C6 #3fcacb')
    g.add_argument('--tint-amt', type=float, default=None)
    g.add_argument('--shimmer', type=float, default=None)
    g.add_argument('--noise', type=float, default=None)
    g.add_argument('--edge-at', type=float, default=None)
    g.add_argument('--floor', type=float, default=None)
    g.add_argument('--glyph-hyst', type=float, default=0.05, help='per-cell density hysteresis (0 = off)')
    g.add_argument('--mask', default=None, help='mask PNG: glyph only inside (the rest stays pixel)')
    g = ap.add_argument_group('output')
    g.add_argument('--out-mp4', default=None)
    g.add_argument('--stills', default=None)
    g.add_argument('--still-frames', default=None)
    g.add_argument('--tag', default='')
    g.add_argument('--crf', type=int, default=16)
    a = ap.parse_args(argv)
    t0 = time.time()
    pal_json = json.loads(gv.PAL_JSON.read_text())
    inp = Path(a.input)
    if inp.is_dir() and (inp / 'clip.json').exists():
        timeline, draws = load_clip_folder(inp)
    else:
        import pixelize as px
        clip = gv.load_clip(a.input, t_in=a.t_in, t_out=a.t_out, speed=a.speed, crop=a.crop, keep_preview=False)
        gv.temporal_filter(clip, strength=a.denoise)
        cf = gv.conform(clip, on=a.on)
        T = [clip.lab[si] for si in cf.drawings]
        if a.no_quantize:
            draws = [gv.oklab_to_srgb8(x) for x in T]
        else:
            # the engine's glyph reads a palette-constrained frame: map first (no dither), with hysteresis
            pal = gv.load_palette(a.families)
            q = px.Quantizer(pal, mode='ramp', dither='off', hyst=0.02)
            draws, prev = [], None
            h, w = T[0].shape[:2]
            for i, Td in enumerate(T):
                maps = ok = None
                if i > 0:
                    _, ok, maps = gv.flow_pair(Td, T[i - 1])
                st, _ = q.quantize(Td, prev, maps, ok)
                prev = st
                draws.append(pal.rgb[q.render(st, h, w)])
        timeline = cf.timeline
    style = {'tone': None, 'cell': None}
    if a.tone:
        lo, hi, gm = (float(x) for x in a.tone.split(','))
        style['tone'] = {'lo': lo, 'hi': hi, 'gamma': gm}
    if a.cell:
        style['cell'] = [int(x) for x in a.cell.split(',')]
    for k, attr in (('bloom', 'bloom'), ('tint', 'tint'), ('tintAmt', 'tint_amt'), ('shimmer', 'shimmer'), ('noise', 'noise'), ('edgeAt', 'edge_at'), ('floor', 'floor')):
        style[k] = getattr(a, attr)
    R = GlyphRenderer(style, pal_json)
    h, w = draws[0].shape[:2]
    mask = gv.load_mask(a.mask, w, h)
    wr = gv.Mp4Writer(a.out_mp4, w * 4, h * 4, crf=a.crf) if a.out_mp4 else None
    stills = set(int(x) for x in a.still_frames.split(',')) if a.still_frames else {0, len(timeline) // 2}
    for k, di in enumerate(timeline):
        # tokens are recomputed every frame (the shimmer steps every shimmerStep frames); cells hold with the drawing
        cells = R.cells(draws[di], mask, k, a.glyph_hyst)
        frame = R.render(draws[di], cells)
        if wr:
            wr.write(frame)
        if a.stills and k in stills:
            gv.save_png(Path(a.stills) / f'{a.tag}glyph-f{k:03d}.png', frame)
    if wr:
        wr.close()
        gv.log(f'wrote {a.out_mp4}')
    gv.log(f'glyphized {len(timeline)} frames in {time.time() - t0:.1f} s')


if __name__ == '__main__':
    main()
