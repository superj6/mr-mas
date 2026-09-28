#!/usr/bin/env python3
"""MR. MAS Ep1 Act Four S7.13: Ttemme's hourglass on his own stream, the second Runway insert (`v31-runway`, 2026-09-27).

The generated take (h4, Veo 3.1 Fast, first and last keyframes both ours) plays inside our coded stream frame
(streamframes.ts: the player pane, LIVE · TTEMME under it, the LIVE · CHAT column scrolling F, then "we're so back").
The pane's picture goes pixel -> real -> pixel, and the beat lands back on the show's own pixel aftermath (S7.13's last
frame, drawn by the Act Four pipeline).

  hourglass.py --scratch DIR [--clip CLIP.mp4] [--out DIR] [--act4 S7.13_START] [--png DIR]
Frames are S7.13's own k (beat frames). The insert replaces k128-194 of the current lock and runs to k263:
  k128-139  the stream frame, cut in as the post clears; the pane is his cam in pixel (the palette, the native grid)
  k140-143  the grid dissolves: the native grid (4 output px) in true colour, then 2-px blocks
  k144-237  his cam, real (take frames f017-f110): the calm, the crack, THE SHATTER AT k173 (f046, the lock's mark),
            the sand standing on its own k179-207, slumping k208-227, the heap by k233
  k238-241  the grid returns (2-px blocks, then the native grid in true colour)
  k242-251  the pane in pixel again (f115-f124)
  k252-263  the show's own pixel aftermath: S7.13's last frame (k194 of the lock), held; then S8.01
The chat: F until his line ends (k166), then "we're so back", scrolling four times as fast (from k167).
The take's frames f025-f045 are repaired first: the model refilled the upper bulb there; with the camera locked, its
sand (and the thread under it) is replaced by f024's pixels (the cracks, which are white, survive).
"""
from __future__ import annotations

import argparse
import json
import subprocess
import sys
from pathlib import Path

import av
import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = Path(__file__).resolve().parents[5]
HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import insert as I  # noqa: E402  (the encoder, the palette maths)

FPS, W, H, PIC_H = 24, 1920, 1080, 812
CLIP = ROOT / "out/ep01/full-v3/runway/clips/h4-veo31fast-keyframes-shatter-s1121.mp4"
PANE = dict(x=8, y=11, w=328, h=184)
K0, K_END = 128, 264          # the insert's first k and one past its last
S713_LOCK_START = 11326       # S7.13's first frame in act4/data.ts (the v3 lock); k = segment frame - 11326
BACK_AT, FAST_AT = 167, 167
SHATTER_K, SHATTER_F = 173, 46

# the pane's palette: the room's families incl. monitor cyan (his LED strip), under 80% white
def load_pal(families="NCWDRGPSBUF"):
    d = json.loads((ROOT / "studio/tools/genvideo/palettes.json").read_text())["master"]
    lin = lambda v: (v / 255 / 12.92) if v <= 10 else ((v / 255 + 0.055) / 1.055) ** 2.4
    Y = lambda c: 0.2126 * lin(c["rgb"][0]) + 0.7152 * lin(c["rgb"][1]) + 0.0722 * lin(c["rgb"][2])
    d = [c for c in d if c["family"] in families and Y(c) <= 0.60]
    return np.array([c["rgb"] for c in d], np.float32) / 255, np.array([c["oklab"] for c in d], np.float32)


PAL_RGB, PAL_LAB = load_pal()


def quantize(img: np.ndarray, dither: float = 0.04) -> np.ndarray:
    h, w = img.shape[:2]
    lab = I.srgb_to_oklab(np.clip(img, 0, 1).reshape(-1, 3)).reshape(h, w, 3)
    lab[..., 0] += dither * np.tile(I.BAYER4, (h // 4 + 1, w // 4 + 1))[:h, :w]
    d = ((lab[:, :, None, :] - PAL_LAB[None, None]) ** 2 * np.array([1.0, 1.6, 1.6], np.float32)).sum(-1)
    return (PAL_RGB[d.argmin(-1)] * 255 + 0.5).astype(np.uint8)


def repair(frames: list[np.ndarray]) -> None:
    """f025-f045: the model refilled the upper bulb. The camera is locked, so the upper bulb takes f024's pixels
    everywhere except the new crack lines (bright, colourless, changed), and the thread of sand under the neck takes
    f024's pixels where it is orange. In place."""
    ref = frames[24].astype(np.float32) / 255
    prof_y = [146, 150, 185, 250, 295, 340, 355, 370, 410, 470, 480]
    prof_w = [0, 55, 89, 83, 51, 15, 9, 15, 73, 88, 0]
    ys = np.arange(720)
    hw = np.interp(ys, prof_y, prof_w, left=0, right=0)
    region = (np.abs(np.arange(1280)[None, :] - 645) <= hw[:, None] + 4) & (hw[:, None] > 0)
    upper = region.copy()
    upper[358:] = False
    thread_box = np.zeros_like(region)
    thread_box[358:478, 626:666] = True
    for i in range(25, 46):
        a = frames[i].astype(np.float32) / 255
        r, b = a[..., 0], a[..., 2]
        mx = a.max(-1)
        sat = (mx - a.min(-1)) / (mx + 1e-6)
        crack = (mx > 0.62) & (sat < 0.3) & (np.abs(a - ref).max(-1) > 0.12)
        m = upper & ~ndimage.binary_dilation(crack, iterations=1)
        thread = thread_box & (r > 0.35) & (r - b > 0.2) & (sat > 0.4)
        m |= ndimage.binary_dilation(thread, iterations=2) & thread_box
        soft = ndimage.gaussian_filter(m.astype(np.float32), 1.0)[..., None]
        frames[i] = ((a * (1 - soft) + ref * soft) * 255 + 0.5).astype(np.uint8)


def grade(a: np.ndarray) -> np.ndarray:
    """a webcam, not a product film: no bloom, no vignette; exposure x0.95 and the soft knee to 194/255 (<= 80% white)"""
    x = a.astype(np.float32) / 255 * 0.95
    cap, knee = 194 / 255, 0.66
    over = np.clip(x - knee, 0, None)
    x = np.where(x > knee, knee + (cap - knee) * (1 - np.exp(-over / (cap - knee))), x)
    return (np.clip(x, 0, cap) * 255 + 0.5).astype(np.uint8)


def plan(shift: int = 0) -> list[dict]:
    """shift: move the whole insert (and its shatter) this many frames later in the beat"""
    out = []
    for k in range(K0 + shift, K_END + shift):
        kk = k - shift
        f = kk - (SHATTER_K - SHATTER_F)          # f046 lands on k173 (+ shift)
        if kk < 140:
            p = {"pane": "pixel"}
        elif kk < 142:
            p = {"pane": "block", "block": 4}
        elif kk < 144:
            p = {"pane": "block", "block": 2}
        elif kk < 238:
            p = {"pane": "real"}
        elif kk < 240:
            p = {"pane": "block", "block": 2}
        elif kk < 242:
            p = {"pane": "block", "block": 4}
        elif kk < 252:
            p = {"pane": "pixel"}
        else:
            p = {"pane": "room"}                  # the show's own aftermath (S7.13 k194)
        p.update(k=k, f=min(f, 124) if p["pane"] != "room" else None)
        out.append(p)
    return out


def render_ui(ks: list[int], scratch: Path, back_at: int = BACK_AT) -> dict[int, np.ndarray]:
    cjs = scratch / "streamframes.cjs"
    subprocess.run(["node", "src/episodes/ep01/pixel/tools/build.mjs", "--entry", str(HERE / "streamframes.ts"), str(cjs)], cwd=ROOT / "studio", check=True)
    spec = scratch / "sf-jobs.json"
    spec.write_text(json.dumps({"out": str(scratch / "sf"), "frames": [{"name": f"k{k}", "k": k, "backAt": back_at, "fast": back_at} for k in ks]}))
    subprocess.run(["node", str(cjs), str(spec)], check=True)
    return {k: np.frombuffer((scratch / "sf" / f"k{k}.rgb").read_bytes(), np.uint8).reshape(270, 480, 3) for k in ks}


def act4_native(frames: list[int], scratch: Path) -> dict[int, np.ndarray]:
    """the Act Four pipeline's own native frames (its `native` command: 480 x 270 at 2x PNG)"""
    cjs = scratch / "r-act4.cjs"
    subprocess.run(["node", "src/episodes/ep01/pixel/tools/build.mjs", "act4", str(cjs)], cwd=ROOT / "studio", check=True)
    d = scratch / "a4n"
    subprocess.run(["node", str(cjs), "native", str(d), *map(str, frames)], cwd=ROOT / "studio", check=True)
    out = {}
    for f in frames:
        p = next(d.glob(f"n{f}-*.png"))
        out[f] = np.asarray(Image.open(p).convert("RGB"))[::2, ::2].copy()
    return out


def x4(a: np.ndarray) -> np.ndarray:
    return np.repeat(np.repeat(a, 4, 0), 4, 1)


def compose(p: dict, clip: list[np.ndarray], ui: dict[int, np.ndarray], room: np.ndarray) -> np.ndarray:
    if p["pane"] == "room":
        return x4(room)
    o = x4(ui[p["k"]]).copy()
    o[PIC_H:] = x4(room)[PIC_H:]                  # the band: the Act Four frame's own (constant through S7.13)
    img = clip[p["f"]]
    px, py, pw_, ph = PANE["x"] * 4, PANE["y"] * 4, PANE["w"] * 4, PANE["h"] * 4
    if p["pane"] == "pixel":
        small = np.asarray(Image.fromarray(img).resize((PANE["w"], PANE["h"]), Image.BOX), np.float32) / 255
        o[py:py + ph, px:px + pw_] = x4(quantize(small))
    else:
        I.paste_cover(o, img, (px, py, pw_, ph), block=p.get("block", 1), pal=False)
        np.minimum(o[py:py + ph, px:px + pw_], 194, out=o[py:py + ph, px:px + pw_])   # the resize's ringing stays under the cap
    return o


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--scratch", required=True)
    ap.add_argument("--clip", default=str(CLIP))
    ap.add_argument("--out", default=str(ROOT / "out/ep01/full-v3/runway"))
    ap.add_argument("--png", default="", help="also write the insert's frames as DIR/pic/NNNNN.png, numbered by Act Four "
                    "segment frame (S7.13's start + k), for the renderer's browser splice")
    ap.add_argument("--s713", type=int, default=S713_LOCK_START, help="S7.13's first segment frame on the lock in use "
                    "(act4/data.ts; 11326 on the v3 lock). The insert assumes S7.13's own marks: post clears k127, the line "
                    "k134-166, the shatter k173")
    ap.add_argument("--stills", default="")
    ap.add_argument("--shift", type=int, default=0, help="move the insert and its shatter this many frames later in S7.13 "
                    "(if the v3.1 lock moves the post's end and the shatter together)")
    ap.add_argument("--back-at", type=int, default=BACK_AT, help="the k the chat turns to \"we're so back\" (his line's end + 1)")
    a = ap.parse_args()
    scratch, out = Path(a.scratch), Path(a.out)
    scratch.mkdir(parents=True, exist_ok=True)
    with av.open(a.clip) as c:
        clip = [f.to_ndarray(format="rgb24") for f in c.decode(video=0)]
    repair(clip)
    clip = [grade(f) for f in clip]
    P = plan(a.shift)
    ui = render_ui([p["k"] for p in P if p["pane"] != "room"], scratch, a.back_at)
    lock_last = a.s713 + 194                          # the lock's own last frame of S7.13: the pixel aftermath
    a4 = act4_native([a.s713, a.s713 + 127, lock_last], scratch)
    room = a4[lock_last]
    want = {int(x) for x in a.stills.split(",") if x}
    frames = []
    def gen():
        for p in P:
            fr = compose(p, clip, ui, room)
            if p["k"] in want:
                Image.fromarray(fr).save(scratch / f"hg-still-k{p['k']}.png")
            if a.png:
                (Path(a.png) / "pic").mkdir(parents=True, exist_ok=True)
                Image.fromarray(fr).save(Path(a.png) / "pic" / f"{a.s713 + p['k']:05d}.png", compress_level=3)
            frames.append(np.asarray(Image.fromarray(fr).resize((960, 540), Image.BILINEAR)))
            yield fr
    n = I.encode(gen(), out / "hourglass-s713.mp4")
    print(f"insert: {n} frames ({n / FPS:.2f} s), k{K0 + a.shift}-{K_END - 1 + a.shift}", file=sys.stderr)
    # in context: S7.13 k0-127 from the Act Four pipeline (the lock's own picture), then the insert
    k_in = K0 + a.shift
    ctx = act4_native([a.s713 + k for k in range(0, k_in)], scratch)
    def ctx_gen():
        for k in range(0, k_in):
            yield x4(ctx[a.s713 + k])
        with av.open(str(out / "hourglass-s713.mp4")) as c:
            for f in c.decode(video=0):
                yield f.to_ndarray(format="rgb24")
    m = I.encode(ctx_gen(), out / "hourglass-s713-in-context.mp4")
    print(f"in context: {m} frames ({m / FPS:.2f} s), S7.13 k0-{K_END - 1 + a.shift}", file=sys.stderr)
    (out / "hourglass-s713-timing.json").write_text(json.dumps({"fps": FPS, "beat": "S7.13", "k_is": "frames from S7.13's first frame",
        "lock_s713": [a.s713, a.s713 + 195], "insert_k": [K0 + a.shift, K_END + a.shift], "shatter_k": SHATTER_K + a.shift,
        "take_frame_at_shatter": SHATTER_F, "chat_back_from_k": a.back_at, "frames": P}, indent=0))


if __name__ == "__main__":
    main()
