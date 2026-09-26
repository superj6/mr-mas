#!/usr/bin/env python3
"""MR. MAS genvideo: PIXELIZE a (model-generated) video into the show's pixel look.

  video (any size / fps) -> fit to 16:9 -> edge-aware k-centroid downscale to the native 480x270 grid
  -> motion-compensated temporal filter (kills model grain / flicker) -> 24 fps conform, held on 2s
  -> clip-level tone (optional match to the keyframe it was conditioned on)
  -> palette mapping with TEMPORAL HYSTERESIS (a pixel keeps its colour unless a new one is clearly better;
     history is carried along the optical flow) and ordered dither ONLY on large smooth gradients (never on skin,
     never on edges; the pattern is anchored to the camera motion so it doesn't swim)
  -> blink suppression (A-B-A flips on static pixels) -> orphan-pixel cleanup -> optional 1px dark outline
  -> optional palette set (TERMINAL, ONEBIT, ... exactly as the engine compiles them)
  -> 4x nearest -> 1920x1080 H.264, and/or native indexed PNG drawings + clip.json for <GenVideo> in Remotion.

Run with the genvideo venv (see README):
  audio/.venv-genvideo/bin/python studio/tools/genvideo/pixelize.py IN.mp4 --out-mp4 OUT.mp4 --out-frames DIR
"""
from __future__ import annotations

import argparse
import json
import sys
import time
from itertools import combinations
from pathlib import Path

import numpy as np
import cv2

sys.path.insert(0, str(Path(__file__).resolve().parent))
import gvlib as gv  # noqa: E402


PRESETS = {
    # the show default for a generated insert: family regions quantised along their ramps (faces get one clean
    # skin ramp), 50% dither seams on big smooth gradients only, heavy temporal stabilisation, on 2s
    'default': dict(mode='ramp', downscale='kcentroid', denoise=0.7, mc=True, hyst=0.02, dither='gradients', on='2', blink=True, orphans=True),
    # background plates / skies / atmospherics: nearest colour with dithers across neighbouring families (a violet
    # night between N and U), 25/50/75% mixes on the big gradients, pan-lock the grid, 1s through camera moves
    'plate': dict(mode='nearest', mixes=(0.25, 0.5, 0.75), downscale='kcentroid', denoise=0.8, mc=True, hyst=0.02, dither='gradients', on='auto', pan_lock=True, blink=True, orphans=True),
    # figures in motion: never dither, stickier colours, a clean dark contour
    'character': dict(mode='ramp', downscale='kcentroid', denoise=0.6, mc=True, hyst=0.025, dither='off', on='2', blink=True, orphans=True, outline='dark'),
    # a source that is already our pixel art (a model that kept the grid, a re-encode of our own render, the
    # round-trip test): nearest colour, no added dither (the source's own dithers survive), every frame
    'pixel': dict(mode='nearest', downscale='kcentroid', denoise=0.5, mc=True, hyst=0.02, dither='off', on='1', blink=True, orphans=False),
    # the baseline everyone starts with (for comparisons only): area downscale + nearest colour, every frame
    'naive': dict(mode='nearest', downscale='area', denoise=0.0, mc=False, hyst=0.0, dither='off', on='1', blink=False, orphans=False),
    # naive + a full-frame ordered dither (the classic "pixel filter" look; boils)
    'naive-dither': dict(mode='nearest', mixes=(0.25, 0.5, 0.75), downscale='area', denoise=0.0, mc=False, hyst=0.0, dither='all', on='1', blink=False, orphans=False),
}


# ------------------------------------------------------------------------------------------------ quantiser
class Quantizer:
    """Palette mapping with hysteresis. Two modes:
    ramp    the pixel-art way: pick a colour FAMILY per region (hue / material / light, from a blurred,
            spatially-regularised cost, with its own hysteresis), then quantise along that family's hand-ordered
            ramp. Dither pairs are ADJACENT rungs of one ramp only: a band seam, never a hue speckle.
    nearest plain nearest colour in the candidate palette (pairs among the K nearest palette neighbours).
    hybrid  (default) ramp for SKIN regions (faces and hands get one clean skin ramp, never dithered, never a
            stray hue), nearest over the non-skin colours everywhere else (skies and glows can dither across
            neighbouring families, e.g. N/U for a violet night)."""

    def __init__(self, pal: gv.Palette, *, mode='hybrid', mixes=(0.5,), wL=1.1, K=4, pair_max=0.12, bias=0.12, xfam=0.01,
                 margin=0.004, hyst=0.02, fam_hyst=0.015, fam_blur=1.0, fam_smooth=3, fam_detail=0.035, dither='gradients',
                 pattern='bayer4', edge_hi=0.011, grad_lo=0.0006, min_area=500, protect=None, dither_mask=None,
                 orphan_tol=0.03, glint=0.12):
        self.pal = pal
        self.mode = mode
        self.mixes = tuple(mixes)
        self.cand = pal.cand
        self.C = len(self.cand)
        self.w = np.array([wL, 1.0, 1.0], np.float32)
        self.clab = (pal.lab[self.cand] * self.w).astype(np.float32)
        self.cL = pal.lab[self.cand][:, 0]
        self.skin = pal.skin[self.cand]
        lin = pal.lin[self.cand]
        self.K = min(K, self.C)
        M = len(self.mixes)
        self.mixlab = np.zeros((self.C, self.C, M, 3), np.float32)
        self.pen = np.zeros((self.C, self.C, M), np.float32)
        dpair = np.sqrt((((pal.lab[self.cand][:, None] - pal.lab[self.cand][None]) * self.w) ** 2).sum(-1))
        famc = np.array([pal.fam[i] for i in self.cand])
        cross = (famc[:, None] != famc[None, :]).astype(np.float32)
        for k, m in enumerate(self.mixes):
            self.mixlab[:, :, k] = gv.lin_to_oklab(lin[:, None] * (1 - m) + lin[None, :] * m) * self.w
            # dithering far colours, or two hue families, costs extra: a cross-family 25% reads as stray dots
            self.pen[:, :, k] = bias * dpair * 4 * m * (1 - m) + xfam * cross * (1.0 if m == 0.5 else 1.6)
        # families (candidate indices sorted by rung) and each candidate's family id
        fams = sorted({pal.fam[i] for i in self.cand})
        self.fams = fams
        self.fam_of = np.array([fams.index(pal.fam[i]) for i in self.cand])
        self.rungs = [sorted([j for j in range(self.C) if self.fam_of[j] == f], key=lambda j: pal.rung[self.cand[j]]) for f in range(len(fams))]
        self.fam_skin = np.array([self.skin[r[0]] for r in self.rungs])
        # dither pairs: never with a skin colour. Ramp pixels: adjacent rungs of one family (a band seam);
        # nearest pixels: palette neighbours closer than pair_max (far pairs read as noise)
        ramp_ok = np.zeros((self.C, self.C), bool)
        for r in self.rungs:
            for s in range(len(r) - 1):
                ramp_ok[r[s], r[s + 1]] = ramp_ok[r[s + 1], r[s]] = True
        noskin = ~self.skin[:, None] & ~self.skin[None, :]
        self.pair_ramp = ramp_ok & noskin
        self.pair_near = (dpair < pair_max) & (dpair > 1e-6) & noskin
        self.pair_ok = self.pair_ramp | self.pair_near
        # ramp segments for the family cost
        segA, segB, segF = [], [], []
        for f, r in enumerate(self.rungs):
            if len(r) == 1:
                segA.append(self.clab[r[0]]); segB.append(self.clab[r[0]]); segF.append(f)
            for s in range(len(r) - 1):
                segA.append(self.clab[r[s]]); segB.append(self.clab[r[s + 1]]); segF.append(f)
        self.segA, self.segB, self.segF = np.array(segA, np.float32), np.array(segB, np.float32), np.array(segF)
        self.segStart = np.array([int(np.nonzero(self.segF == f)[0][0]) for f in range(len(fams))])
        self.margin, self.hyst, self.fam_hyst = margin, hyst, fam_hyst
        self.fam_blur, self.fam_smooth, self.fam_detail = fam_blur, fam_smooth, fam_detail
        self.dither = dither
        self.thr = pal.threshold(pattern)
        self.edge_hi, self.grad_lo, self.min_area = edge_hi, grad_lo, min_area
        self.protect, self.dither_mask = protect, dither_mask
        self.orphan_tol, self.glint = orphan_tol, glint

    # -------------------------------------------------------------------------------- errors
    def err_single(self, t, a):
        d = t - self.clab[a]
        return np.sqrt((d * d).sum(-1))

    def err_state(self, t, a, b, mk):
        """error of state (a, b, mk) for targets t (flat). mk 0 = single colour a, else mixes[mk-1] of b over a."""
        e = self.err_single(t, a)
        pm = mk > 0
        if pm.any():
            k = mk[pm] - 1
            lab = self.mixlab[a[pm], b[pm], k]
            d = t[pm] - lab
            e[pm] = np.sqrt((d * d).sum(-1)) + self.pen[a[pm], b[pm], k]
            e[pm & ~self.pair_ok[a, b]] = np.inf
        return e

    # -------------------------------------------------------------------------------- families
    def _ramp_cost(self, t):
        """(P, F): distance of each (weighted) target to each family's ramp polyline (all segments in 2 matmuls)."""
        A, AB = self.segA, self.segB - self.segA
        den = np.maximum((AB * AB).sum(1), 1e-12)
        tA = t @ A.T  # (P, S)
        tAB = t @ AB.T
        AAB = (A * AB).sum(1)
        u = np.clip((tAB - AAB) / den, 0, 1)
        u[:, (AB * AB).sum(1) <= 1e-12] = 0
        d2 = (t * t).sum(1)[:, None] - 2 * tA + (A * A).sum(1)[None] - 2 * u * (tAB - AAB) + u * u * den
        return np.sqrt(np.maximum(np.minimum.reduceat(d2, self.segStart, axis=1), 0))

    def family_cost(self, T):
        """Regional family cost (blurred target, box-smoothed so families form regions: materials / light zones,
        not per-pixel hue noise) and the pixel's own cost (unblurred: lets small details keep their family)."""
        h, w = T.shape[:2]
        F = len(self.fams)
        own = self._ramp_cost((T.reshape(-1, 3) * self.w).astype(np.float32))
        Tb = cv2.GaussianBlur(T, (0, 0), self.fam_blur) if self.fam_blur > 0 else T
        reg = self._ramp_cost((Tb.reshape(-1, 3) * self.w).astype(np.float32))
        if self.fam_smooth > 1:
            k = (self.fam_smooth, self.fam_smooth)
            reg = np.stack([cv2.blur(reg[:, f].reshape(h, w), k).ravel() for f in range(F)], 1)
        return reg, own

    # -------------------------------------------------------------------------------- dither eligibility
    def eligibility(self, T, near_skin, prev=None):
        h, w = T.shape[:2]
        if self.dither == 'off':
            return np.zeros((h, w), bool)
        if self.dither == 'all':
            e = np.ones((h, w), bool)
        else:
            Lf = cv2.GaussianBlur(T, (0, 0), 1.0)
            g = np.zeros((h, w), np.float32)
            for c in range(3):
                gx = cv2.Sobel(Lf[..., c], cv2.CV_32F, 1, 0, ksize=3) / 8
                gy = cv2.Sobel(Lf[..., c], cv2.CV_32F, 0, 1, ksize=3) / 8
                g += gx * gx + gy * gy
            g_fine = np.sqrt(g)
            Lc = cv2.GaussianBlur(T[..., 0], (0, 0), 4.0)
            gcx = cv2.Sobel(Lc, cv2.CV_32F, 1, 0, ksize=3) / 8
            gcy = cv2.Sobel(Lc, cv2.CV_32F, 0, 1, ksize=3) / 8
            g_coarse = np.sqrt(gcx * gcx + gcy * gcy)
            smooth = cv2.dilate((g_fine >= self.edge_hi).astype(np.uint8), np.ones((5, 5), np.uint8)) == 0
            e = smooth & (g_coarse > self.grad_lo)
            e = cv2.morphologyEx(e.astype(np.uint8), cv2.MORPH_OPEN, np.ones((3, 3), np.uint8)).astype(bool)
            if self.min_area > 0:
                n, lab, stats, _ = cv2.connectedComponentsWithStats(e.astype(np.uint8), connectivity=4)
                big = np.zeros(n, bool)
                big[1:] = stats[1:, cv2.CC_STAT_AREA] >= self.min_area
                e = big[lab]
        # never on skin (dilated: the rule is "never noisy on faces", so keep a margin round them)
        e &= ~(cv2.dilate(near_skin.astype(np.uint8), np.ones((5, 5), np.uint8)).astype(bool))
        if self.protect is not None:
            e &= self.protect < 0.5
        if self.dither_mask is not None:
            e &= self.dither_mask >= 0.5
        if prev is not None and self.dither != 'all':
            # temporal hysteresis on the region itself: its border doesn't crawl frame to frame
            s = cv2.blur(e.astype(np.float32), (5, 5))
            e = (s > 0.6) | ((s > 0.3) & prev)
        return e

    # -------------------------------------------------------------------------------- one drawing
    def quantize(self, T, prev=None, maps=None, ok=None):
        """T: native OKLab (h, w, 3). prev: the previous drawing's state; `maps` (backward flow) carries it into
        this frame, `ok` marks where the flow is trustworthy. Returns (state, weighted flat targets)."""
        h, w = T.shape[:2]
        P = h * w
        t = (T.reshape(-1, 3) * self.w).astype(np.float32)
        ar = np.arange(P)
        use_prev = prev is not None and ok is not None  # maps None = no motion compensation (identity)
        okf = ok.ravel() if use_prev else None
        # ---- 1. family per pixel (ramp / hybrid)
        if self.mode in ('ramp', 'hybrid'):
            reg, own = self.family_cost(T)
            fam = np.argmin(reg, 1)
            if use_prev and self.fam_hyst > 0:
                pf = self._warp(prev['fam'].reshape(h, w), maps).ravel()
                keepf = okf & (reg[ar, pf] <= reg[ar, fam] + self.fam_hyst)
                fam = np.where(keepf, pf, fam)
            # details (text, eye whites, glints, thin rims) keep their own family when the region's is clearly wrong
            fo = np.argmin(own, 1)
            fam = np.where(own[ar, fam] - own[ar, fo] > self.fam_detail, fo, fam)
            ramp_px = self.fam_skin[fam] if self.mode == 'hybrid' else np.ones(P, bool)
        else:
            fam = np.zeros(P, np.int64)
            ramp_px = np.zeros(P, bool)
        # ---- 2. nearest single colour: along the family ramp (ramp pixels) or over the palette (the rest)
        a = np.zeros(P, np.int64)
        apos = np.zeros(P, np.int64)  # rung position of `a` in its family's ramp
        e1 = np.zeros(P, np.float32)
        for f, r in enumerate(self.rungs):
            sel = np.nonzero((fam == f) & ramp_px)[0]
            if not len(sel):
                continue
            cl = self.clab[r]
            tt = t[sel]
            d2 = (tt * tt).sum(1)[:, None] - 2 * tt @ cl.T + (cl * cl).sum(1)[None]
            j = np.argmin(d2, 1)
            a[sel] = np.array(r)[j]
            apos[sel] = j
            e1[sel] = np.sqrt(np.maximum(d2[np.arange(len(sel)), j], 0))
        topk = None
        near = np.nonzero(~ramp_px)[0]
        if len(near):
            tt = t[near]
            d2 = (tt * tt).sum(1)[:, None] - 2 * tt @ self.clab.T + (self.clab * self.clab).sum(1)[None]
            if self.mode == 'hybrid':
                d2[:, self.skin] = np.inf  # skin colours belong to skin regions only
            K = min(self.K, int(np.isfinite(d2[0]).sum()))
            topk = np.full((P, K), -1, np.int64)
            ai = np.arange(len(near))
            for k in range(K):
                j = np.argmin(d2, 1)
                topk[near, k] = j
                if k == 0:
                    a[near] = j
                    e1[near] = np.sqrt(np.maximum(d2[ai, j], 0))
                d2[ai, j] = np.inf
        fam_of_a = self.fam_of[a]
        near_skin = self.skin[a].reshape(h, w)
        prev_elig = self._warp(prev['elig'].reshape(h, w), maps) if use_prev else None
        elig = self.eligibility(T, near_skin, prev_elig).ravel()
        b, mk, e = a.copy(), np.zeros(P, np.int8), e1.copy()
        # ---- 3. dither pairs where eligible
        if elig.any():
            idx = np.nonzero(elig)[0]
            tt = t[idx]
            best_e = np.full(len(idx), np.inf, np.float32)
            ba = np.zeros(len(idx), np.int64)
            bb = np.zeros(len(idx), np.int64)
            bk = np.zeros(len(idx), np.int8)
            pairs = []
            rp = ramp_px[idx]
            if rp.any():
                # ramp pixels: only the two segments touching the nearest rung can hold the target
                fi, jp = fam[idx], apos[idx]
                lo_a, lo_b, hi_a, hi_b = (np.full(len(idx), -1, np.int64) for _ in range(4))
                for f, r in enumerate(self.rungs):
                    if len(r) < 2:
                        continue
                    m = rp & (fi == f)
                    if not m.any():
                        continue
                    rr = np.array(r)
                    j = jp[m]
                    lo_a[m] = np.where(j > 0, rr[np.maximum(j - 1, 0)], -1)
                    lo_b[m] = np.where(j > 0, rr[j], -1)
                    hi_a[m] = np.where(j < len(r) - 1, rr[j], -1)
                    hi_b[m] = np.where(j < len(r) - 1, rr[np.minimum(j + 1, len(r) - 1)], -1)
                pairs += [(lo_a, lo_b, True), (hi_a, hi_b, True)]
            if topk is not None and (~rp).any():
                tk = topk[idx]
                pairs += [(tk[:, u], tk[:, v], False) for u, v in combinations(range(tk.shape[1]), 2)]
            for pa, pb, is_ramp in pairs:
                valid = (pa >= 0) & (pb >= 0)
                if not valid.any():
                    continue
                pa2, pb2 = np.where(valid, pa, 0), np.where(valid, pb, 0)
                okp = valid & (self.pair_ramp[pa2, pb2] if is_ramp else self.pair_near[pa2, pb2])
                if not okp.any():
                    continue
                for k in range(len(self.mixes)):
                    d = tt - self.mixlab[pa2, pb2, k]
                    ee = np.sqrt((d * d).sum(-1)) + self.pen[pa2, pb2, k]
                    ee = np.where(okp, ee, np.inf)
                    better = ee < best_e
                    best_e = np.where(better, ee, best_e)
                    ba = np.where(better, pa2, ba)
                    bb = np.where(better, pb2, bb)
                    bk = np.where(better, k + 1, bk)
            use = best_e + self.margin < e1[idx]
            a[idx[use]], b[idx[use]], mk[idx[use]], e[idx[use]] = ba[use], bb[use], bk[use], best_e[use]
        a, b, mk = self._canon(a, b, mk)
        # ---- 4. temporal hysteresis: keep the (flow-carried) previous state unless the new one is clearly better
        if use_prev and self.hyst > 0:
            pa = self._warp(prev['a'].reshape(h, w), maps).ravel()
            pb = self._warp(prev['b'].reshape(h, w), maps).ravel()
            pk = self._warp(prev['mk'].reshape(h, w), maps).ravel()
            pk = np.where(elig, pk, 0).astype(np.int8)  # a pixel that left the dither region can't keep a pair
            pb = np.where(pk > 0, pb, pa)
            ep = self.err_state(t, pa, pb, pk)
            keep = (ep <= e + self.hyst) & okf
            # the kept colour must still belong to this pixel's kind of region
            keep &= np.where(ramp_px, self.fam_of[pa] == fam, ~self.skin[pa] if self.mode == 'hybrid' else True)
            a, b, mk = np.where(keep, pa, a), np.where(keep, pb, b), np.where(keep, pk, mk).astype(np.int8)
        st = {'a': a, 'b': b, 'mk': mk, 'elig': elig, 'fam': np.where(ramp_px, fam, self.fam_of[a])}
        return st, t

    def _canon(self, a, b, mk):
        """(a, b, m) == (b, a, 1-m): order pairs dark -> light so equal states compare equal."""
        sw = (mk > 0) & (self.cL[a] > self.cL[b])
        a2, b2 = np.where(sw, b, a), np.where(sw, a, b)
        mk2 = np.where(sw, len(self.mixes) + 1 - mk, mk).astype(np.int8)
        return a2, b2, mk2

    @staticmethod
    def _warp(arr, maps):
        if maps is None:
            return arr
        mx, my = maps
        h, w = arr.shape
        ix = np.clip(np.rint(mx), 0, w - 1).astype(np.int64)
        iy = np.clip(np.rint(my), 0, h - 1).astype(np.int64)
        return arr[iy, ix]

    # -------------------------------------------------------------------------------- cleanup
    def orphans(self, st, t, h, w):
        """Isolated single pixels (no 8-neighbour of the same colour) merge into the most similar neighbour when
        that neighbour explains the target almost as well. High-contrast specks (glints, stars) are kept."""
        a = st['a'].reshape(h, w)
        single = (st['mk'] == 0).reshape(h, w)
        pa = np.pad(a, 1, mode='edge')
        ps = np.pad(single, 1, mode='constant')
        same = np.zeros((h, w), bool)
        nbrs = []
        for dy in (-1, 0, 1):
            for dx in (-1, 0, 1):
                if dx == 0 and dy == 0:
                    continue
                na = pa[1 + dy:1 + dy + h, 1 + dx:1 + dx + w]
                ns = ps[1 + dy:1 + dy + h, 1 + dx:1 + dx + w]
                same |= (na == a) & ns
                nbrs.append((na, ns))
        orphan = single & ~same
        if not orphan.any():
            return st
        idx = np.nonzero(orphan.ravel())[0]
        tt = t[idx]
        own = self.err_single(tt, a.ravel()[idx])
        best_e = np.full(len(idx), np.inf, np.float32)
        best_c = a.ravel()[idx].copy()
        for na, ns in nbrs:
            c = na.ravel()[idx]
            ee = np.where(ns.ravel()[idx], self.err_single(tt, c), np.inf)
            better = ee < best_e
            best_e = np.where(better, ee, best_e)
            best_c = np.where(better, c, best_c)
        # a glint: much brighter than every neighbour -> keep it
        glint = (self.cL[a.ravel()[idx]] - self.cL[best_c]) > self.glint
        merge = (best_e <= own + self.orphan_tol) & ~glint
        st = dict(st)
        aa = st['a'].copy()
        aa[idx[merge]] = best_c[merge]
        st['a'] = aa
        st['b'] = np.where(st['mk'] > 0, st['b'], aa)
        st['fam'] = np.where(st['mk'] > 0, st['fam'], self.fam_of[aa]) if self.mode == 'ramp' else st['fam']
        return st

    # -------------------------------------------------------------------------------- output
    def render(self, st, h, w, off=(0, 0)):
        """state -> master palette indices (h, w). Dither threshold anchored at the accumulated camera offset."""
        ys, xs = np.mgrid[0:h, 0:w]
        thr = self.thr[(ys - off[1]) % self.thr.shape[0], (xs - off[0]) % self.thr.shape[1]].ravel()
        m = np.array((0,) + self.mixes, np.float32)[st['mk']]
        c = np.where(thr < m, st['b'], st['a'])
        return self.cand[c].reshape(h, w)


def state_key(st):
    return st['a'].astype(np.int64) * 100000 + st['b'].astype(np.int64) * 10 + st['mk'].astype(np.int64)


def outline(idx, pal: gv.Palette, dither_px, thr=0.16, k=2):
    """1-px dark outline cleanup: on a strong lightness step, the DARK side's pixel walks k rungs down its own
    family (a palette operation, like the engine's family step). Only single-colour pixels; one pixel wide."""
    L = pal.lab[idx][..., 0]
    h, w = idx.shape
    P = np.pad(L, 1, mode='edge')
    edge = np.zeros((h, w), bool)
    for dy, dx in ((-1, 0), (1, 0), (0, -1), (0, 1)):
        edge |= (P[1 + dy:1 + dy + h, 1 + dx:1 + dx + w] - L) > thr
    edge &= ~dither_px
    out = idx.copy()
    out[edge] = pal.step(idx[edge], -k)
    return out


def apply_set(idx, pal: gv.Palette, set_id: str):
    """Apply an engine palette set (exported entries + threshold) to master indices -> RGB (screen-anchored)."""
    s = pal.sets[set_id]
    thr = pal.threshold(s['pattern'])
    ent = s['entries']
    A = np.array([gv.hex2rgb(e[0]) for e in ent], np.uint8)
    B = np.array([gv.hex2rgb(e[1]) for e in ent], np.uint8)
    T = np.array([e[2] for e in ent], np.float32)
    h, w = idx.shape
    ys, xs = np.mgrid[0:h, 0:w]
    th = thr[ys % thr.shape[0], xs % thr.shape[1]]
    return np.where((th < T[idx])[..., None], B[idx], A[idx])


# ------------------------------------------------------------------------------------------------ pipeline
def run(args):
    t0 = time.time()
    p = dict(PRESETS[args.preset])
    for k in ('mode', 'downscale', 'denoise', 'hyst', 'dither', 'on', 'outline'):
        v = getattr(args, k)
        if v is not None:
            p[k] = v
    if args.pan_lock:
        p['pan_lock'] = True
    if args.mixes:
        p['mixes'] = tuple(float(x) for x in args.mixes.split(','))
    if args.no_mc:
        p['mc'] = False
    pal = gv.load_palette(args.families, args.exclude or '')
    gv.log(f'preset {args.preset}: {p}; palette {len(pal.cand)} colours ({args.families or "all"})')
    clip = gv.load_clip(args.input, t_in=args.t_in, t_out=args.t_out, speed=args.speed, fit=args.fit, crop=args.crop,
                        block=args.block, downscale=p['downscale'], pan_lock=p.get('pan_lock', False),
                        presmooth=args.presmooth, src_fps=args.src_fps, keep_preview=bool(args.compare or args.stills))
    gv.temporal_filter(clip, strength=p['denoise'], mc=p['mc'])
    cf = gv.conform(clip, duration=args.duration, on=p['on'])
    gv.log(f'conform: {len(cf.timeline)} output frames @24, {len(cf.drawings)} drawings (on {p["on"]})')
    T = [clip.lab[si] for si in cf.drawings]
    ref = None
    if args.match:
        im = cv2.cvtColor(cv2.imread(args.match), cv2.COLOR_BGR2RGB)
        ref = gv.srgb8_to_oklab(cv2.resize(im, (gv.NATIVE_W, gv.NATIVE_H), interpolation=cv2.INTER_AREA))
    head = [clip.lab[i] for i in range(len(clip.times)) if clip.times[i] <= clip.times[0] + args.match_window] if ref is not None else None
    T = gv.tone_map(T, exposure=args.exposure, sat=args.sat, lift=args.lift, match_ref=ref, match_amt=args.match_amt,
                    match_head=head, match_chroma=args.match_chroma)

    h, w = T[0].shape[:2]
    q = Quantizer(pal, mode=p.get('mode', 'hybrid'), mixes=p.get('mixes', (0.5,)), hyst=p['hyst'], fam_hyst=args.fam_hyst, bias=args.bias, xfam=args.xfam,
                  fam_smooth=args.fam_smooth, fam_detail=args.fam_detail, dither=p['dither'], pattern=args.pattern, wL=args.wl,
                  edge_hi=args.edge_hi, grad_lo=args.grad_lo, min_area=args.min_area,
                  protect=gv.load_mask(args.protect, w, h), dither_mask=gv.load_mask(args.dither_mask, w, h))
    states, targets, statics, offs, flows = [], [], [], [], []
    prev, off = None, np.zeros(2)
    for di, Td in enumerate(T):
        maps = ok = None
        static = np.zeros((h, w), bool)
        if di > 0:
            # flow on the RAW (unfiltered) drawings for the metrics, so naive and tuned are measured alike
            rfb, rok, rmaps = gv.flow_pair(clip.raw[cf.drawings[di]], clip.raw[cf.drawings[di - 1]])
            flows.append((rmaps, rok))
            fb, ok, maps = gv.flow_pair(Td, T[di - 1])
            mag = np.hypot(rfb[..., 0], rfb[..., 1])
            static = rok & (mag < 0.3)
            if args.dither_anchor == 'camera':
                # the threshold map rides the camera: for plates whose gradients scroll WITH the pan (a painted
                # street, a skyline). Default 'screen' keeps camera-invariant gradients (skies, glows) rock-solid.
                if p.get('pan_lock'):
                    off = np.round(clip.pan[cf.drawings[di]])
                else:
                    reg = prev['elig'].reshape(h, w) if prev['elig'].any() else np.ones((h, w), bool)
                    d = -np.array([np.median(fb[..., 0][reg]), np.median(fb[..., 1][reg])])
                    d[np.abs(d) < 0.25] = 0
                    off = off + d
            if not p['mc']:
                maps, ok = None, np.ones((h, w), bool)
        st, t = q.quantize(Td, prev if (p['hyst'] > 0 and di > 0) else None, maps, ok)
        if p['orphans']:
            st = q.orphans(st, t, h, w)
        states.append(st)
        targets.append(t)
        statics.append(static.ravel())
        offs.append(np.round(off).astype(int))
        prev = st
    # ---- blink suppression: on static pixels, A-B-A across three drawings becomes A-A-A when A is good enough
    if p['blink'] and len(states) >= 3:
        fixed = 0
        for i in range(1, len(states) - 1):
            ka, kb, kc = state_key(states[i - 1]), state_key(states[i]), state_key(states[i + 1])
            cand = statics[i] & statics[i + 1] & (ka == kc) & (kb != ka)
            if not cand.any():
                continue
            s0, s1 = states[i - 1], states[i]
            mk0 = np.where(s1['elig'], s0['mk'], 0).astype(np.int8)
            b0 = np.where(mk0 > 0, s0['b'], s0['a'])
            e_prev = q.err_state(targets[i], s0['a'], b0, mk0)
            e_cur = q.err_state(targets[i], s1['a'], s1['b'], s1['mk'])
            fix = cand & (e_prev <= e_cur + 2 * max(p['hyst'], 0.01))
            if fix.any():
                states[i]['a'] = np.where(fix, s0['a'], s1['a'])
                states[i]['b'] = np.where(fix, b0, s1['b'])
                states[i]['mk'] = np.where(fix, mk0, s1['mk']).astype(np.int8)
                fixed += int(fix.sum())
        gv.log(f'blink suppression: {fixed} pixel-drawings held')

    # ---- render drawings
    out_idx, out_rgb = [], []
    for di, st in enumerate(states):
        idx = q.render(st, h, w, tuple(offs[di]))
        if p.get('outline') and p['outline'] != 'off':
            idx = outline(idx, pal, (st['mk'] > 0).reshape(h, w), thr=args.outline_thr, k=args.outline_k)
        out_idx.append(idx)
        out_rgb.append(apply_set(idx, pal, args.set) if args.set and args.set != 'BASE' else pal.rgb[idx])

    stats = boil_stats(out_idx, statics, cf, args.boilmap, flows)
    gv.log(f'boil: {stats}')
    write_outputs(args, clip, cf, out_idx, out_rgb, pal, p, stats)
    gv.log(f'done in {time.time() - t0:.1f} s')
    return stats


def boil_stats(out_idx, statics, cf, boilmap=None, flows=None):
    """Temporal-stability metrics on pixels whose content is static (flow < 0.3 px, fwd/bwd consistent):
    boil_pct   % of static pixels that change colour from one drawing to the next
    boil_per_s colour changes per static pixel per second (fair across on-1s / on-2s)
    flips_per_1k  A-B-A reversals (flicker) per 1000 static pixel-drawings."""
    ch, n, flips, nf = 0, 0, 0, 0
    acc = np.zeros(out_idx[0].shape, np.float32)
    for i in range(1, len(out_idx)):
        s = statics[i].reshape(out_idx[i].shape)
        c = (out_idx[i] != out_idx[i - 1]) & s
        acc += c
        ch += int(c.sum())
        n += int(s.sum())
        if i + 1 < len(out_idx):
            s2 = s & statics[i + 1].reshape(s.shape)
            flips += int(((out_idx[i - 1] == out_idx[i + 1]) & (out_idx[i] != out_idx[i - 1]) & s2).sum())
            nf += int(s2.sum())
    # motion-compensated boil: colour changes against the flow-carried previous drawing, on every pixel whose
    # flow is reliable (moving content included: a pan that stays rigid scores ~0, a crawling edge does not)
    mch, mn = 0, 0
    if flows:
        for i in range(1, len(out_idx)):
            maps, ok = flows[i - 1]
            warped = Quantizer._warp(out_idx[i - 1], maps)
            mch += int(((out_idx[i] != warped) & ok).sum())
            mn += int(ok.sum())
    secs = len(cf.timeline) / gv.FPS
    dps = len(out_idx) / max(secs, 1e-6)
    if boilmap:
        # heat map of colour changes on static pixels (black = rock solid, white = boils every drawing)
        v = np.clip(acc / max(1, len(out_idx) - 1) * 4, 0, 1)
        heat = cv2.applyColorMap((v * 255).astype(np.uint8), cv2.COLORMAP_INFERNO)
        gv.save_png(boilmap, gv.upscale(cv2.cvtColor(heat, cv2.COLOR_BGR2RGB), 2))
    return {'drawings': len(out_idx), 'frames': len(cf.timeline), 'static_px_share': round(n / max(1, (len(out_idx) - 1) * out_idx[0].size), 3),
            'boil_pct': round(100 * ch / max(1, n), 3), 'boil_per_s': round(ch / max(1, n) * dps, 4),
            'mc_boil_pct': round(100 * mch / max(1, mn), 3),
            'flips_per_1k': round(1000 * flips / max(1, nf), 3)}


def write_outputs(args, clip, cf, out_idx, out_rgb, pal, p, stats):
    h, w = out_idx[0].shape
    if args.out_mp4:
        wr = gv.Mp4Writer(args.out_mp4, w * 4, h * 4, crf=args.crf)
        for di in cf.timeline:
            wr.write(out_rgb[di])  # native; ffmpeg scales 4x nearest
        wr.close()
        gv.log(f'wrote {args.out_mp4}')
    if args.out_frames:
        from PIL import Image
        d = Path(args.out_frames)
        d.mkdir(parents=True, exist_ok=True)
        for f in d.glob('d*.png'):
            f.unlink()
        names = []
        flat = pal.rgb.reshape(-1).tolist()
        for di, rgb in enumerate(out_rgb):
            name = f'd{di:04d}.png'
            if args.set and args.set != 'BASE':
                Image.fromarray(rgb).save(d / name, optimize=True)
            else:
                im = Image.fromarray(out_idx[di].astype(np.uint8), 'P')
                im.putpalette(flat)
                im.save(d / name, optimize=True)
            names.append(name)
        man = {
            'version': 1, 'id': d.name, 'native': [w, h], 'fps': gv.FPS, 'durationInFrames': len(cf.timeline),
            'palette': args.set or 'BASE', 'families': args.families or 'all', 'drawings': names, 'timeline': cf.timeline,
            'source': {'path': str(Path(args.input)), 'size': [clip.info.w, clip.info.h], 'fps': clip.info.fps, 'rect': list(clip.rect),
                       't_in': args.t_in, 'speed': args.speed, 'source_frame_of_drawing': cf.drawings},
            'params': {'preset': args.preset, **{k: v for k, v in p.items()}}, 'stats': stats,
            'generated': 'studio/tools/genvideo/pixelize.py',
        }
        (d / 'clip.json').write_text(json.dumps(man, indent=1))
        gv.log(f'wrote {len(names)} drawings + clip.json to {d}')
    if args.compare:
        # before | after at 2x native (1920x540): the source as sampled, and the pixelized result
        wr = gv.Mp4Writer(args.compare, w * 4, h * 2, crf=args.crf + 2)
        for k, di in enumerate(cf.timeline):
            src = clip.preview[cf.drawings[di]] if clip.preview else np.zeros((h * 2, w * 2, 3), np.uint8)
            wr.write(np.hstack([src, gv.upscale(out_rgb[di], 2)]))
        wr.close()
        gv.log(f'wrote {args.compare}')
    if args.stills:
        d = Path(args.stills)
        frames = [int(x) for x in args.still_frames.split(',')] if args.still_frames else [0, len(cf.timeline) // 2, len(cf.timeline) - 1]
        for k in frames:
            k = min(max(0, k), len(cf.timeline) - 1)
            di = cf.timeline[k]
            src = clip.preview[cf.drawings[di]] if clip.preview else None
            after = gv.upscale(out_rgb[di], 4)
            gv.save_png(d / f'{args.tag}f{k:03d}-after.png', after)
            if src is not None:
                gv.save_png(d / f'{args.tag}f{k:03d}-before.png', src)  # the source as sampled (2x native, 960x540)
                gv.save_png(d / f'{args.tag}f{k:03d}-pair.png', np.hstack([src, gv.upscale(out_rgb[di], 2)]))
        gv.log(f'wrote stills for frames {frames} to {d}')


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('input', help='video file (mp4/webm/mov...), a folder of numbered PNG/JPG frames, or ONE image (a plate)')
    ap.add_argument('--preset', default='default', choices=sorted(PRESETS))
    g = ap.add_argument_group('source')
    g.add_argument('--t-in', type=float, default=0.0, help='start (s)')
    g.add_argument('--t-out', type=float, default=None, help='end (s)')
    g.add_argument('--speed', type=float, default=1.0, help='retime: 0.5 = half speed (holds longer), 2 = double')
    g.add_argument('--duration', type=float, default=None, help='output length (s); default: the source range')
    g.add_argument('--src-fps', type=float, default=None, help='frame rate for an image-sequence folder (or to override)')
    g.add_argument('--fit', default='cover', choices=['cover', 'stretch'], help='16:9 fit (cover = centre crop)')
    g.add_argument('--crop', default=None, help='x,y,w,h in source px (or fractions) before the fit')
    g.add_argument('--block', type=int, default=None, help='k-centroid block (1-4); default from the source height')
    g.add_argument('--downscale', default=None, choices=['kcentroid', 'area', 'nearest'])
    g.add_argument('--presmooth', type=float, default=0.0, help='edge-preserving pre-smooth strength (0 = off, 1 = medium)')
    g = ap.add_argument_group('temporal')
    g.add_argument('--denoise', type=float, default=None, help='temporal filter strength 0..0.95 (preset: 0.7)')
    g.add_argument('--no-mc', action='store_true', help='disable motion compensation (flow) in filter/hysteresis')
    g.add_argument('--hyst', type=float, default=None, help='palette hysteresis in OKLab dE (preset: 0.02; 0 = off)')
    g.add_argument('--on', default=None, choices=['1', '2', '3', 'auto'], help='hold drawings on 1s/2s/3s, or auto')
    g.add_argument('--pan-lock', action='store_true', help='lock camera pans to whole native pixels (plates)')
    g = ap.add_argument_group('palette')
    g.add_argument('--mode', default=None, choices=['hybrid', 'ramp', 'nearest'],
                   help='ramp (default preset: every region on one family ramp), nearest (plate preset), hybrid (skin on its ramp, the rest nearest)')
    g.add_argument('--fam-hyst', type=float, default=0.015, help='family hysteresis (ramp mode)')
    g.add_argument('--fam-smooth', type=int, default=3, help='family region smoothing box (native px)')
    g.add_argument('--fam-detail', type=float, default=0.035, help='a pixel leaves its region\'s family when its own is better by this')
    g.add_argument('--families', default=None, help=f'family letters (e.g. NCWSKX) or a preset: {", ".join(gv.FAMILY_PRESETS)}')
    g.add_argument('--exclude', default=None, help='family letters to exclude (e.g. Q = never rocket red)')
    g.add_argument('--set', default=None, help='engine palette set applied after mapping (TERMINAL, ONEBIT, EARLYWEB16, LEDGER, 2TONE_FREEZE, FREEZE_*)')
    g.add_argument('--wl', type=float, default=1.1, help='lightness weight in the colour match')
    g.add_argument('--exposure', type=float, default=0.0, help='stops (linear light)')
    g.add_argument('--sat', type=float, default=1.0, help='chroma gain')
    g.add_argument('--lift', type=float, default=0.0, help='raise blacks (OKLab L)')
    g.add_argument('--match', default=None, help='reference still to match tone to (the conditioning keyframe)')
    g.add_argument('--match-amt', type=float, default=1.0)
    g.add_argument('--match-window', type=float, default=0.5, help='seconds at the clip head the match statistics come from')
    g.add_argument('--match-chroma', action='store_true', help='also scale chroma to the reference')
    g = ap.add_argument_group('dither')
    g.add_argument('--dither', default=None, choices=['off', 'gradients', 'all'])
    g.add_argument('--bias', type=float, default=0.12, help='penalty on dithering (higher = fewer, narrower dither seams)')
    g.add_argument('--xfam', type=float, default=0.01, help='extra penalty on dithering two different colour families')
    g.add_argument('--mixes', default=None, help='dither mix ratios, e.g. 0.5 (band seams, default) or 0.25,0.5,0.75 (skies)')
    g.add_argument('--dither-anchor', default='screen', choices=['screen', 'camera'],
                   help='screen (default): pattern fixed to the frame, like the engine; camera: pattern rides the pan')
    g.add_argument('--pattern', default='bayer4', help='threshold tile from palettes.json (bayer4, cluster4)')
    g.add_argument('--edge-hi', type=float, default=0.011, help='no dither where the local gradient exceeds this (dL/px)')
    g.add_argument('--grad-lo', type=float, default=0.0006, help='dither only where a broad gradient exceeds this (dL/px)')
    g.add_argument('--min-area', type=int, default=500, help='smallest dither region (native px)')
    g.add_argument('--protect', default=None, help='mask PNG: never dither here (faces, figures)')
    g.add_argument('--dither-mask', default=None, help='mask PNG: dither ONLY here (e.g. the sky)')
    g = ap.add_argument_group('cleanup')
    g.add_argument('--outline', default=None, choices=['off', 'dark'])
    g.add_argument('--outline-thr', type=float, default=0.16)
    g.add_argument('--outline-k', type=int, default=2)
    g = ap.add_argument_group('output')
    g.add_argument('--out-mp4', default=None, help='1920x1080 H.264 (4x nearest)')
    g.add_argument('--out-frames', default=None, help='folder for native indexed PNG drawings + clip.json (Remotion)')
    g.add_argument('--compare', default=None, help='side-by-side before|after MP4 (1920x540)')
    g.add_argument('--stills', default=None, help='folder for before/after stills')
    g.add_argument('--still-frames', default=None, help='comma list of output frames for --stills')
    g.add_argument('--tag', default='', help='prefix for still names')
    g.add_argument('--stats', default=None, help='write the stability stats JSON here')
    g.add_argument('--boilmap', default=None, help='PNG heat map of colour changes on static pixels (960x540)')
    g.add_argument('--crf', type=int, default=16)
    args = ap.parse_args(argv)
    stats = run(args)
    if args.stats:
        Path(args.stats).parent.mkdir(parents=True, exist_ok=True)
        Path(args.stats).write_text(json.dumps(stats, indent=1))
    print(json.dumps(stats))


if __name__ == '__main__':
    main()
