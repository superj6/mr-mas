#!/usr/bin/env python3
"""MR. MAS Ep1 tag: ELGOOG's duck demo, the pilot's one near-photoreal insert, and its three transitions.

The `v31-runway` pass (2026-09-27). Everything here is code except the two generated clips (Runway, Veo 3.1 Fast; their
provenance.json files sit beside them). The pixel room is drawn by the show's own kits (pxframes.ts); the wordmark, the
LIVE chip, the grade, the line reveal, the stutter and the stills are built here.

  insert.py --scratch DIR [--clips DIR] [--out DIR] [--variants abc] [--no-chip] [--stills a:40,b:14]
--clips (default out/ep01/full-v3/runway/clips) holds v2-veo31fast-i2v-sketch-s1206.mp4 and
v3-veo31fast-keyframes-sketch2duck-s1206.mp4; the stroke-order map is rebuilt by sketch.py (into --scratch) when it isn't there.
--out defaults to out/ep01/full-v3/runway. Heavy-ish (~2 min CPU, ~3 GB RAM): run it through ops/heavy.sh. Writes <out>/elgoog-demo-{a,b,c}.mp4 (1920x1080, 24 fps, silent, H.264),
<out>/elgoog-demo-compare.mp4 (the three, time-aligned on the film's first frame), <out>/elgoog-demo-sheet.png, and
<out>/elgoog-demo-timing.json (every frame's source, for the tag shot pass and the sound pass).

The film (ELGOOG's product film, 199 frames at 24 fps, graded once, shared by all three transitions):
  F0-33    the colour field and the ELGOOG wordmark (ours; Jost, off-brand colours), dissolving into the page (F30-33)
  F34-47   the line drawing laid down stroke by stroke, drawn by nothing (our reveal of v3's first frame)
  F48-102  v3 f000-f054: the lines refine, glow and fill into the real duck on its turntable
  F103-106 dissolve v3 f055-f058 -> v2 f062-f065
  F107-136 v2 f066-f095: the turn, smooth, on 1s                               [the LIVE chip is on F34-136]
  F137-150 the stutter: v2 f096 f100 f105 f111 f118 held 2 2 3 3 4: it drops ever more frames    [chip off from F137]
  F151-198 the stills (polish off: no sheen, no vignette, flatter): v2 f124 (8) · f132 (8) · f140 (32, the hold)
"""
from __future__ import annotations

import argparse
import json
import subprocess
import sys
from pathlib import Path

import av
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from scipy import ndimage

ROOT = Path(__file__).resolve().parents[5]
HERE = Path(__file__).resolve().parent
FPS = 24
W, H = 1920, 1080
PIC_H = 812            # the picture area: native rows 0-203 at 4x; the band is rows 812-1080
CROP_Y = 100         # the film's full-frame window: rows 100-912 of 1080 (the duck spans rows ~141-900)
FONT = ROOT / "studio/node_modules/@fontsource/jost/files/jost-latin-500-normal.woff"
V2 = "v2-veo31fast-i2v-sketch-s1206.mp4"
V3 = "v3-veo31fast-keyframes-sketch2duck-s1206.mp4"
OTS = dict(x=110, y=22, w=258, h=138)   # kits/mas-monitor MON_OTS (native)
TWO_S_F0 = 108                           # the 2S's animation frame: continues tag 32.01 (0-108)

# ------------------------------------------------------------------ the film's timeline
CARD, REVEAL, MORPH, DISS, SMOOTH = (0, 34), (34, 48), (48, 103), (103, 107), (107, 137)
STUTTER = [(96, 2), (100, 2), (105, 3), (111, 3), (118, 4)]      # (v2 frame, hold): the frames it drops grow
STILLS = [(124, 8), (132, 8), (140, 32)]
N_FILM = 199
CHIP = (34, 137)
POLISH_OFF = 151                                                  # the stills start: the sheen and vignette drop


def film_plan() -> list[dict]:
    plan = []
    for F in range(N_FILM):
        if F < CARD[1]:
            plan.append({"F": F, "src": "card", "k": F})
        elif F < REVEAL[1]:
            plan.append({"F": F, "src": "reveal", "t": (F - REVEAL[0] + 1) / (REVEAL[1] - REVEAL[0])})
        elif F < MORPH[1]:
            plan.append({"F": F, "src": "v3", "f": F - MORPH[0]})
        elif F < DISS[1]:
            j = F - DISS[0]
            plan.append({"F": F, "src": "diss", "f3": 55 + j, "f2": 62 + j, "a": (j + 1) / 5})
        elif F < SMOOTH[1]:
            plan.append({"F": F, "src": "v2", "f": 66 + F - SMOOTH[0]})
        else:
            plan.append(None)
    F = SMOOTH[1]
    for f, n in STUTTER:
        for _ in range(n):
            plan[F] = {"F": F, "src": "v2", "f": f, "hold": "stutter"}
            F += 1
    for f, n in STILLS:
        for _ in range(n):
            plan[F] = {"F": F, "src": "v2", "f": f, "hold": "still"}
            F += 1
    assert F == N_FILM and all(plan), F
    for p in plan:
        p["chip"] = CHIP[0] <= p["F"] < CHIP[1]
        p["polish"] = p["F"] < POLISH_OFF
    return plan


# ------------------------------------------------------------------ palette (the master palette, OKLab)
FILM_FAMILIES = "NWSGPRDLFUQ"   # the film's pixel picture: no monitor cyan or cool skin (C, K, X), so its paper stays paper


def load_palette(families: str = FILM_FAMILIES):
    lin = lambda v: (v / 255 / 12.92) if v <= 10 else ((v / 255 + 0.055) / 1.055) ** 2.4
    Y = lambda c: 0.2126 * lin(c["rgb"][0]) + 0.7152 * lin(c["rgb"][1]) + 0.0722 * lin(c["rgb"][2])
    # no palette colour brighter than 80% white (linear Y 0.60: GENAI §1.10, pops at 80% or less)
    d = [c for c in json.loads((ROOT / "studio/tools/genvideo/palettes.json").read_text())["master"] if c["family"] in families and Y(c) <= 0.60]
    rgb = np.array([c["rgb"] for c in d], np.float32) / 255
    lab = np.array([c["oklab"] for c in d], np.float32)
    return rgb, lab


def srgb_to_oklab(rgb: np.ndarray) -> np.ndarray:
    c = np.where(rgb <= 0.04045, rgb / 12.92, ((rgb + 0.055) / 1.055) ** 2.4)
    M1 = np.array([[0.4122214708, 0.5363325363, 0.0514459929], [0.2119034982, 0.6806995451, 0.1073969566], [0.0883024619, 0.2817188376, 0.6299787005]], np.float32)
    lms = np.cbrt(np.clip(c @ M1.T, 0, None))
    M2 = np.array([[0.2104542553, 0.7936177850, -0.0040720468], [1.9779984951, -2.4285922050, 0.4505937099], [0.0259040371, 0.7827717662, -0.8086757660]], np.float32)
    return lms @ M2.T


BAYER4 = (np.array([[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]], np.float32) + 0.5) / 16 - 0.5
PAL_RGB, PAL_LAB = load_palette()


def quantize(img: np.ndarray, dither: float = 0.05, gain: float = 1.05) -> np.ndarray:
    """float RGB (h, w, 3) -> the nearest master-palette colour per pixel in OKLab, ordered dither on L. uint8 out."""
    h, w = img.shape[:2]
    lab = srgb_to_oklab(np.clip(img * gain, 0, 1).reshape(-1, 3)).reshape(h, w, 3)
    lab[..., 0] += dither * np.tile(BAYER4, (h // 4 + 1, w // 4 + 1))[:h, :w]
    d = ((lab[:, :, None, :] - PAL_LAB[None, None]) ** 2 * np.array([1.0, 1.6, 1.6], np.float32)).sum(-1)
    return (PAL_RGB[d.argmin(-1)] * 255 + 0.5).astype(np.uint8)


# ------------------------------------------------------------------ the film's own pieces
def load_clip(p: Path) -> list[np.ndarray]:
    with av.open(str(p)) as c:
        return [f.to_ndarray(format="rgb24") for f in c.decode(video=0)]


def up(a: np.ndarray) -> np.ndarray:
    """a 1280x720 uint8 frame -> 1920x1080 float"""
    return np.asarray(Image.fromarray(a).resize((W, H), Image.LANCZOS), np.float32) / 255


def wordmark_card(k: int) -> np.ndarray:
    """the clean colour field and the parody wordmark (ours): ELGOOG in Jost 500, each letter in ELGOOG's skewed,
    deliberately off-brand primaries (rotated order, muted hues: not any real mark's colours)"""
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    r2 = ((xx - W / 2) / (W * 0.7)) ** 2 + ((yy - H / 2) / (H * 0.7)) ** 2
    field = np.stack([0.935 - 0.05 * r2, 0.928 - 0.05 * r2, 0.912 - 0.052 * r2], -1)
    font = ImageFont.truetype(str(FONT), 196)
    letters = "ELGOOG"
    cols = ["#2b9c8c", "#c2415e", "#5a5fc4", "#de8f2a", "#2b9c8c", "#c2415e"]   # teal, raspberry, indigo, ochre
    track = 14
    widths = [font.getbbox(ch)[2] - font.getbbox(ch)[0] for ch in letters]
    total = sum(widths) + track * (len(letters) - 1)
    x = (W - total) / 2
    bb = font.getbbox("ELGOOG")
    y = CROP_Y + PIC_H / 2 - (bb[1] + bb[3]) / 2          # centred in the full-frame window
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    for ch, wd, c in zip(letters, widths, cols):
        d.text((x - font.getbbox(ch)[0], y), ch, font=font, fill=c)
        x += wd + track
    a = min(1.0, (k + 1) / 5)                                   # fades up over F0-4
    lay = np.asarray(layer, np.float32) / 255
    # a slow settle: the wordmark drifts up 6 px over the card (the film's first move)
    lay = np.roll(lay, -int(round(6 * min(1, k / 20))), axis=0)
    al = lay[..., 3:4] * a
    return field * (1 - al) + lay[..., :3] * al


def paper_of(frame: np.ndarray) -> np.ndarray:
    """v3's first frame with its pencil lines lifted off (a grey closing): the blank page the lines are laid on"""
    return np.stack([ndimage.grey_closing(frame[..., c], size=(27, 27)) for c in range(3)], -1)


LIVE_FONT = None


def chip(img: np.ndarray) -> np.ndarray:
    """the film's own LIVE-style chip (generic type, no real UI): top left, inside the 2.36:1 picture-area crop"""
    global LIVE_FONT
    LIVE_FONT = LIVE_FONT or ImageFont.truetype(str(FONT), 30)
    x0, y0, w, h = 84, CROP_Y + 52, 128, 48
    ov = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(ov)
    d.rounded_rectangle([0, 0, w - 1, h - 1], radius=10, fill=(14, 16, 22, 120))
    d.ellipse([18, h / 2 - 8, 34, h / 2 + 8], fill=(214, 64, 58, 255))
    d.text((46, h / 2 - 1), "LIVE", font=LIVE_FONT, fill=(194, 194, 196, 255), anchor="lm")
    o = np.asarray(ov, np.float32) / 255
    out = img.copy()
    reg = out[y0:y0 + h, x0:x0 + w]
    out[y0:y0 + h, x0:x0 + w] = reg * (1 - o[..., 3:4]) + o[..., :3] * o[..., 3:4]
    return out


def grade(img: np.ndarray, polish: bool) -> np.ndarray:
    """the product film's look inside a dark room. polish (the smooth film): a soft highlight bloom and the lens
    vignette, the studio-demo sheen. Without it (the stills): flatter, a little less saturated, no bloom, no vignette.
    Both: exposure x0.9 and a soft knee to a hard cap 10 levels under 80% white (GENAI §1.10: pops <= 80%)."""
    x = img * 0.94
    if polish:
        small = x[::4, ::4]
        hi = np.clip(small - 0.55, 0, None)
        bl = np.stack([ndimage.gaussian_filter(hi[..., c], 9) for c in range(3)], -1)
        bl = np.asarray(Image.fromarray((np.clip(bl, 0, 1) * 255).astype(np.uint8)).resize((W, H), Image.BILINEAR), np.float32) / 255
        x = x + 0.35 * bl
        yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
        x = x * (1 - 0.16 * (((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2))[..., None]
        x = (x - 0.5) * 1.04 + 0.5
    else:
        lum = x @ np.array([0.2126, 0.7152, 0.0722], np.float32)
        x = lum[..., None] + (x - lum[..., None]) * 0.82
        x = (x - 0.5) * 0.93 + 0.5 + 0.01
    cap = 194 / 255
    knee = 0.66
    over = np.clip(x - knee, 0, None)
    x = np.where(x > knee, knee + (cap - knee) * (1 - np.exp(-over / (cap - knee))), x)
    return np.clip(x, 0, cap)


def build_film(clips: Path, use_chip: bool, scratch: Path) -> tuple[list[np.ndarray], list[dict]]:
    plan = film_plan()
    if not use_chip:
        for q in plan:
            q["chip"] = False
    v2, v3 = load_clip(clips / V2), load_clip(clips / V3)
    order_npy = clips / "sketch-v2f048-order.npy"
    if not order_npy.exists():
        order_npy = scratch / "sketch-v2f048-order.npy"
    if not order_npy.exists():   # sketch.py is deterministic: the tracing of v2 f048 (v3's first frame) and its stroke order
        tmp = order_npy.with_suffix(".png")
        subprocess.run([sys.executable, str(HERE / "sketch.py"), str(tmp), "--order", str(order_npy), "--src", str(clips / V2),
                        "--frame", "48", "--keep-pos", "--facing", "right"], check=True)
        tmp.unlink()
    order = np.load(order_npy)
    order = np.where(order > 1.5, 1.0, order)                      # anything v3 drew that the tracing didn't: last
    f0 = v3[0].astype(np.float32) / 255
    paper = paper_of(f0)
    out = []
    for p in plan:
        s = p["src"]
        if s == "card":
            img = wordmark_card(p["k"])
            if p["k"] >= CARD[1] - 4:                               # F24-27: the field becomes the page
                a = (p["k"] - (CARD[1] - 5)) / 5
                img = img * (1 - a) + up((paper * 255).astype(np.uint8)) * a
        elif s == "reveal":
            soft = 0.04
            m = np.clip((p["t"] * (1 + soft) - order) / soft, 0, 1)[..., None]
            img = up(((paper + (f0 - paper) * m) * 255 + 0.5).astype(np.uint8))
        elif s == "v3":
            img = up(v3[p["f"]])
        elif s == "diss":
            img = up(v3[p["f3"]]) * (1 - p["a"]) + up(v2[p["f2"]]) * p["a"]
        else:
            img = up(v2[p["f"]])
        img = grade(img, p["polish"])
        if use_chip and p["chip"]:
            img = chip(img)
        out.append((img * 255 + 0.5).astype(np.uint8))
    return out, plan


# ------------------------------------------------------------------ the pixel room (pxframes.ts)
def rgb_file(a: np.ndarray, path: Path) -> str:
    path.write_bytes(np.ascontiguousarray(a, np.uint8).tobytes())
    return str(path)


def screen_img(film_frame: np.ndarray, w: int, h: int, crop_pic: bool = True) -> np.ndarray:
    """a film frame, cover-fitted into a w x h screen, snapped to the master palette (the monitor's pixel picture)"""
    a = film_frame
    if crop_pic:
        pass
    sc = max(w / a.shape[1], h / a.shape[0])
    rw, rh = int(round(a.shape[1] * sc)), int(round(a.shape[0] * sc))
    im = np.asarray(Image.fromarray(a).resize((rw, rh), Image.BOX), np.float32) / 255
    y0, x0 = (rh - h) // 2, (rw - w) // 2
    return quantize(im[y0:y0 + h, x0:x0 + w])


def render_rooms(jobs: list[dict], scratch: Path) -> dict[str, np.ndarray]:
    cjs = scratch / "pxframes.cjs"
    if not cjs.exists():
        subprocess.run(["node", "src/episodes/ep01/pixel/tools/build.mjs", "--entry", str(HERE / "pxframes.ts"), str(cjs)], cwd=ROOT / "studio", check=True)
    spec = scratch / "jobs.json"
    outdir = scratch / "px"
    spec.write_text(json.dumps({"out": str(outdir), "frames": jobs}))
    subprocess.run(["node", str(cjs), str(spec)], check=True)
    return {j["name"]: np.frombuffer((outdir / f"{j['name']}.rgb").read_bytes(), np.uint8).reshape(270, 480, 3) for j in jobs}


def x4(native: np.ndarray) -> np.ndarray:
    return np.repeat(np.repeat(native, 4, 0), 4, 1)


# ------------------------------------------------------------------ geometry helpers
def zoom_view(p: int, s: float) -> tuple[int, int]:
    """the camera's native origin at pixel size p, s = 0 (the OTS as framed) .. 1 (the screen fills the frame)"""
    vw, vh = W / p, PIC_H / p
    cx = 240 + (OTS["x"] + OTS["w"] / 2 - 240) * s
    cy = 101.5 + (OTS["y"] + OTS["h"] / 2 - 101.5) * s
    ox = int(round(min(max(cx - vw / 2, 0), 480 - vw)))
    oy = int(round(min(max(cy - vh / 2, 0), 203 - vh)))
    return ox, oy


def zoomed(native: np.ndarray, p: int, ox: int, oy: int) -> np.ndarray:
    """the picture area of a native frame, pushed in: native pixels as whole p x p blocks (grid-true), 1920 x 812"""
    vw, vh = -(-W // p) + 1, -(-PIC_H // p) + 1
    crop = native[oy:oy + vh, ox:ox + vw]
    big = np.repeat(np.repeat(crop, p, 0), p, 1)
    out = np.zeros((PIC_H, W, 3), np.uint8)
    out[:min(PIC_H, big.shape[0]), :min(W, big.shape[1])] = big[:PIC_H, :W]
    return out


def screen_rect(p: int, ox: int, oy: int) -> tuple[int, int, int, int]:
    return (OTS["x"] - ox) * p, (OTS["y"] - oy) * p, OTS["w"] * p, OTS["h"] * p


def paste_cover(dst: np.ndarray, img: np.ndarray, rect: tuple[int, int, int, int], block: int = 1, pal: bool = False) -> None:
    """cover-fit img into rect (x, y, w, h) of dst, clipped to dst; block > 1 = the picture at 1/block resolution
    (whole blocks), pal = snapped to the master palette"""
    x, y, w, h = rect
    sc = max(w / img.shape[1], h / img.shape[0])
    rw, rh = int(round(img.shape[1] * sc)), int(round(img.shape[0] * sc))
    ix0, iy0 = (rw - w) // 2, (rh - h) // 2
    if block > 1:
        sw, sh = -(-rw // block), -(-rh // block)
        small = np.asarray(Image.fromarray(img).resize((sw, sh), Image.BOX))
        if pal:
            small = quantize(small.astype(np.float32) / 255)
        im = np.repeat(np.repeat(small, block, 0), block, 1)[:rh, :rw]
    else:
        im = np.asarray(Image.fromarray(img).resize((rw, rh), Image.LANCZOS))
    im = im[iy0:iy0 + h, ix0:ix0 + w]
    X0, Y0 = max(0, x), max(0, y)
    X1, Y1 = min(dst.shape[1], x + w), min(dst.shape[0], y + h)
    if X1 > X0 and Y1 > Y0:
        dst[Y0:Y1, X0:X1] = im[Y0 - y:Y1 - y, X0 - x:X1 - x]


def cover_rect(rect: tuple[int, int, int, int], iw: int = W, ih: int = H) -> tuple[float, float, float, float]:
    """where an iw x ih image lands when cover-fitted (centred) into rect"""
    x, y, w, h = rect
    sc = max(w / iw, h / ih)
    return x + (w - iw * sc) / 2, y + (h - ih * sc) / 2, iw * sc, ih * sc


def paste_at(dst: np.ndarray, img: np.ndarray, r: tuple[float, float, float, float], clip: tuple[int, int, int, int] | None = None) -> None:
    """img resized to r = (x, y, w, h) (floats) and pasted into dst, clipped to clip (default: all of dst)"""
    x, y, w, h = (int(round(v)) for v in r)
    im = np.asarray(Image.fromarray(img).resize((w, h), Image.LANCZOS))
    cx0, cy0, cx1, cy1 = clip or (0, 0, dst.shape[1], dst.shape[0])
    X0, Y0, X1, Y1 = max(cx0, x), max(cy0, y), min(cx1, x + w), min(cy1, y + h)
    if X1 > X0 and Y1 > Y0:
        dst[Y0:Y1, X0:X1] = im[Y0 - y:Y1 - y, X0 - x:X1 - x]


def full_frame(img: np.ndarray, band: np.ndarray) -> np.ndarray:
    """the film full frame in the picture area (its 2.36:1 centre) over the show's band"""
    out = np.empty((H, W, 3), np.uint8)
    out[:PIC_H] = img[CROP_Y:CROP_Y + PIC_H]
    out[PIC_H:] = band
    return out


def pixel_still(img: np.ndarray, band: np.ndarray, pal: bool) -> np.ndarray:
    """the full-frame still on the native grid (4 px blocks), optionally snapped to the master palette"""
    pic = img[CROP_Y:CROP_Y + PIC_H]
    small = np.asarray(Image.fromarray(pic).resize((480, 203), Image.BOX))
    if pal:
        small = quantize(small.astype(np.float32) / 255)
    out = np.empty((H, W, 3), np.uint8)
    out[:PIC_H] = x4(small)
    out[PIC_H:] = band
    return out


# ------------------------------------------------------------------ the three transitions
def plan_variants(film: list[np.ndarray]) -> dict[str, list[dict]]:
    """per variant, the list of insert frames: what each one shows (for the room jobs, the composite and the log)"""
    last = N_FILM - 1
    V: dict[str, list[dict]] = {}
    # (a) push-in: the OTS, then the camera pushes into the screen in whole-pixel steps (4 -> 8 px a native pixel),
    #     the grid dissolves into the real film (8 -> 4 -> 2 -> 1), the film full frame, its stutter and stills;
    #     out: the pixel monitor pulls back round the held still (8 -> 4), holds, and the two-shot, Mas lit by it.
    a = []
    for i in range(10):
        a.append({"kind": "ots", "F": i, "p": 4, "s": 0.0, "screen": "pixel"})
    for n, p in enumerate((5, 6, 7, 8)):
        for j in range(3):
            a.append({"kind": "ots", "F": 10 + n * 3 + j, "p": p, "s": (p - 4) / 4, "screen": "pixel"})
    for n, (blk, pal) in enumerate(((4, True), (2, False))):
        for j in range(2):
            a.append({"kind": "ots", "F": 22 + n * 2 + j, "p": 8, "s": 1.0, "screen": "block", "block": blk, "pal": pal})
    for F in range(26, N_FILM):   # real from F26; over F26-33 it settles from the screen's framing to the full-frame window
        a.append({"kind": "ots", "F": F, "p": 8, "s": 1.0, "screen": "real", "settle": min(1.0, (F - 25) / 8)})
    for p in (7, 6, 5, 4):
        for j in range(3):
            a.append({"kind": "ots", "F": last, "p": p, "s": (p - 4) / 4, "screen": "real"})
    for j in range(6):   # the hold: the still on the monitor snaps back to the grid (the painter) — the room is whole again
        a.append({"kind": "ots", "F": last, "p": 4, "s": 0.0, "screen": "real" if j < 2 else "pixel"})
    for j in range(16):
        a.append({"kind": "2s", "F": last, "screen": "pixel"})
    V["a"] = a
    # (b) hard cut: the two-shot (the demo starting, small, in pixel on his monitor), a hard cut on the beat to the
    #     film full frame; out: the stills come back onto the grid (real -> 4 px blocks -> the master palette), then
    #     the two-shot.
    b = []
    for i in range(14):
        b.append({"kind": "2s", "F": i, "screen": "pixel"})
    s1, s2 = POLISH_OFF, POLISH_OFF + STILLS[0][1]
    s3 = s2 + STILLS[1][1]
    for F in range(14, N_FILM):
        st = "full"
        if s2 <= F < s3:
            st = "grid"
        elif F >= s3:
            st = "grid" if F < s3 + 2 else "pixel"
        b.append({"kind": "full", "F": F, "screen": st})
    for j in range(16):
        b.append({"kind": "2s", "F": last, "screen": "pixel", "still": "pixel"})
    V["b"] = b
    # (c) inset: the whole film inside the monitor's bezel in the OTS, its stutter and stills visible there; then the
    #     two-shot.
    c = [{"kind": "ots", "F": F, "p": 4, "s": 0.0, "screen": "real"} for F in range(N_FILM)]
    for j in range(16):
        c.append({"kind": "2s", "F": last, "screen": "pixel"})
    V["c"] = c
    return V


def room_jobs(variants: dict[str, list[dict]], film: list[np.ndarray], scratch: Path) -> dict[str, np.ndarray]:
    """one native room frame per non-full insert frame (pixel screens are the film snapped to the master palette)"""
    scr_dir = scratch / "screens"
    scr_dir.mkdir(parents=True, exist_ok=True)
    jobs, cache = [], {}
    for v, frames in variants.items():
        for i, fr in enumerate(frames):
            if fr["kind"] == "full":
                continue
            name = f"{v}-{i:04d}"
            fr["room"] = name
            if fr["kind"] == "2s":
                key = ("2s", fr["F"], fr.get("still", ""))
                if key not in cache:
                    img = film[fr["F"]]
                    if fr.get("still") == "pixel":
                        img = pixel_still(img, np.zeros((H - PIC_H, W, 3), np.uint8), True)[:PIC_H]
                    cache[key] = rgb_file(screen_img(img, 96, 60), scr_dir / f"2s-{fr['F']}{fr.get('still', '')}.rgb")
                jobs.append({"name": name, "kind": "2s", "f": TWO_S_F0 + i, "screen": cache[key], "sw": 96, "sh": 60, "orb": "grid"})
            else:
                scr = None
                if fr["screen"] == "pixel":
                    key = ("ots", fr["F"])
                    if key not in cache:
                        cache[key] = rgb_file(screen_img(film[fr["F"]], OTS["w"], OTS["h"]), scr_dir / f"ots-{fr['F']}.rgb")
                    scr = cache[key]
                jobs.append({"name": name, "kind": "ots", "f": TWO_S_F0 + i, "screen": scr, "sw": OTS["w"], "sh": OTS["h"]})
    return render_rooms(jobs, scratch)


def compose(frames: list[dict], film: list[np.ndarray], rooms: dict[str, np.ndarray], band: np.ndarray):
    """yields the variant's 1920 x 1080 frames"""
    for fr in frames:
        img = film[fr["F"]]
        if fr["kind"] == "full":
            yield full_frame(img, band) if fr["screen"] == "full" else pixel_still(img, band, pal=fr["screen"] == "pixel")
            continue
        native = rooms[fr["room"]]
        if fr["kind"] == "2s":
            yield x4(native)
            continue
        p = fr["p"]
        ox, oy = zoom_view(p, fr["s"])
        o = np.empty((H, W, 3), np.uint8)
        o[:PIC_H] = zoomed(native, p, ox, oy)
        o[PIC_H:] = band
        rect = screen_rect(p, ox, oy)
        if fr["screen"] == "real" and "settle" in fr:
            u = fr["settle"]
            u = u * u * (3 - 2 * u)
            a0, a1 = cover_rect(rect), (0.0, -float(CROP_Y), float(W), float(H))
            paste_at(o[:PIC_H], img, tuple(p0 + (p1 - p0) * u for p0, p1 in zip(a0, a1)))
        elif fr["screen"] == "real":
            paste_cover(o[:PIC_H], img, rect)
        elif fr["screen"] == "block":
            paste_cover(o[:PIC_H], img, rect, block=fr["block"], pal=fr["pal"])
        yield o


# ------------------------------------------------------------------ output
def encode(frames, path: Path, crf: int = 16, keep=None) -> int:
    """frames: any iterable of HxWx3 uint8. keep(i, frame) is called on each (for the comparison and review stills)"""
    path.parent.mkdir(parents=True, exist_ok=True)
    n = 0
    with av.open(str(path), "w") as c:
        s = c.add_stream("libx264", rate=FPS)
        s.width, s.height, s.pix_fmt = W, H, "yuv420p"
        s.options = {"crf": str(crf), "preset": "medium", "threads": "2"}
        for a in frames:
            if keep:
                keep(n, a)
            n += 1
            for pkt in s.encode(av.VideoFrame.from_ndarray(np.ascontiguousarray(a), format="rgb24")):
                c.mux(pkt)
        for pkt in s.encode():
            c.mux(pkt)
    return n


def compare(seqs: dict[str, list[np.ndarray]], labels: dict[str, str]):
    """seqs: the variants' frames already at 952 x 536"""
    n = max(len(s) for s in seqs.values())
    font = ImageFont.truetype(str(FONT), 28)
    small = ImageFont.truetype(str(FONT), 22)
    keys = list(seqs)
    out = []
    for i in range(n):
        can = Image.new("RGB", (W, H), (10, 11, 16))
        d = ImageDraw.Draw(can)
        for k, v in enumerate(keys):
            s = seqs[v]
            fr = Image.fromarray(s[min(i, len(s) - 1)])
            x, y = (k % 2) * 964 + 2, (k // 2) * 540 + 2
            can.paste(fr, (x, y))
            d.text((x + 12, y + 8), labels[v], font=font, fill=(236, 236, 236), stroke_width=3, stroke_fill=(0, 0, 0))
        x, y = 966, 542
        lines = ["ELGOOG demo · the three transitions", f"frame {i:03d} · {i / FPS:5.2f} s (aligned on the film's first frame)",
                 "", "film: card F0-33 · lines F34-47 · morph F48-106", "turn F107-136 · stutter F137-150 · stills F151-198",
                 "", "near-photoreal: Runway Veo 3.1 Fast (v2, v3)", "everything else: code (the show's kits)"]
        for j, t in enumerate(lines):
            d.text((x + 24, y + 30 + j * 40), t, font=small if j else font, fill=(200, 200, 205))
        yield np.asarray(can)


SHEET_AT = {"a": [4, 16, 22, 24, 30, 40, 66, 100, 130, 140, 152, 176, 202, 214, 224],
            "b": [4, 13, 14, 24, 40, 66, 100, 130, 140, 152, 160, 170, 190, 205],
            "c": [4, 40, 66, 100, 130, 140, 152, 160, 176, 190, 205]}


def contact(smalls: dict[str, list[np.ndarray]], V: dict[str, list[dict]], labels: dict[str, str], path: Path) -> None:
    """one row per variant: key frames at 1/6 size, each labelled with its insert frame and the film frame it shows"""
    tw, th = 320, 180
    cols = max(len(v) for v in SHEET_AT.values())
    font = ImageFont.truetype(str(FONT), 18)
    can = Image.new("RGB", (cols * tw, len(smalls) * (th + 44) + 8), (12, 13, 18))
    d = ImageDraw.Draw(can)
    for r, (v, seq) in enumerate(smalls.items()):
        y = r * (th + 44) + 8
        d.text((6, y), labels[v], font=font, fill=(236, 236, 236))
        for c, i in enumerate(x for x in SHEET_AT[v] if x < len(seq)):
            can.paste(Image.fromarray(seq[i]).resize((tw, th), Image.BILINEAR), (c * tw, y + 22))
            fr = V[v][i]
            d.text((c * tw + 4, y + 22 + th + 1), f"i{i} {i / FPS:.2f}s · F{fr['F']} {fr['kind']}/{fr['screen']}", font=font, fill=(190, 190, 196))
    can.save(path)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--clips", default=str(ROOT / "out/ep01/full-v3/runway/clips"))
    ap.add_argument("--out", default=str(ROOT / "out/ep01/full-v3/runway"))
    ap.add_argument("--scratch", required=True)
    ap.add_argument("--variants", default="abc")
    ap.add_argument("--no-chip", action="store_true")
    ap.add_argument("--stills", default="", help="comma list of variant:frame to dump as PNG (review)")
    ap.add_argument("--png", default="", help="also write the first --variants variant's frames as DIR/pic/NNNNN.png (the tag "
                    "renderer's browser-splice layout: GLYPH_DIR=DIR), numbered from --png-offset (the insert's first segment frame)")
    ap.add_argument("--png-offset", type=int, default=0)
    a = ap.parse_args()
    clips, out, scratch = Path(a.clips), Path(a.out), Path(a.scratch)
    scratch.mkdir(parents=True, exist_ok=True)
    film, fplan = build_film(clips, not a.no_chip, scratch)
    print(f"film: {len(film)} frames", file=sys.stderr)
    V = {k: v for k, v in plan_variants(film).items() if k in a.variants}
    rooms = room_jobs(V, film, scratch)
    band = x4(next(iter(rooms.values())))[PIC_H:]
    labels = {"a": "(a) push-in", "b": "(b) hard cut", "c": "(c) inset"}
    want = {}
    for spec in filter(None, a.stills.split(",")):
        v, i = spec.split(":")
        want.setdefault(v, set()).add(int(i))
    smalls: dict[str, list[np.ndarray]] = {}
    for v, frames in V.items():
        smalls[v] = []
        def keep(i, fr, v=v):
            smalls[v].append(np.asarray(Image.fromarray(fr).resize((952, 536), Image.BILINEAR)))
            if i in want.get(v, ()):
                Image.fromarray(fr).save(scratch / f"still-{v}-{i:03d}.png")
            if a.png and v == a.variants[0]:
                (Path(a.png) / "pic").mkdir(parents=True, exist_ok=True)
                Image.fromarray(fr).save(Path(a.png) / "pic" / f"{a.png_offset + i:05d}.png", compress_level=3)
        n = encode(compose(frames, film, rooms, band), out / f"elgoog-demo-{v}.mp4", keep=keep)
        print(f"{v}: {n} frames, {n / FPS:.2f} s", file=sys.stderr)
    if len(smalls) > 1:
        encode(compare(smalls, labels), out / "elgoog-demo-compare.mp4", crf=20)
    contact(smalls, V, labels, out / "elgoog-demo-sheet.png")
    timing = {"fps": FPS, "film": fplan, "variants": {v: [{k: fr[k] for k in fr if k != "room"} for fr in fs] for v, fs in V.items()}}
    (out / "elgoog-demo-timing.json").write_text(json.dumps(timing, indent=0))


if __name__ == "__main__":
    main()
