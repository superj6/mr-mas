#!/usr/bin/env python3
"""MR. MAS: Ep1 Act One 7.02, the tear on the red-hot GPU (style leap 9A): the compositor.

The pixel pass (`p-act1`, 2026-09-28) built this for choice 9A of PLAN §8: a 2.5 s near-photoreal macro of objects
only, spliced into 7.02 the way S7.13's hourglass is spliced (the segment's browser frames; runway.md §6, §11.5).

Sources, all objects:
- OUR first keyframe: `tear_scene.py` (Blender 4.5.3, Cycles CPU): the heatsink's fins red-hot, a bead of water on
  their edges, the shroud with INVIDIA in raised brushed metal (our type; the show's parody chip maker).
- The take: veo3.1_fast image-to-video from that keyframe (`gen.py i2v`, 4 s, seed 702, 40 credits):
  `out/ep01/full-v3/runway/clips/t1-veo31fast-i2v-tear-s702.mp4`. The bead dances on its own vapour and boils away;
  the steam rises in two puffs. Its first frames carry a thin falling thread (the model's idea of "a drop falls"),
  so the insert uses f022-f081, after the thread has gone.
- Every letter is ours: the keyframe's INVIDIA is laid back over each frame (aligned per frame, feathered), so no
  type in the insert comes from the model.

The beat (7.02's own k; the lock's INVIDIA on-screen span is 1.2-3.7 s = k29-88):
  k0-10     the pipeline's pixel HIGH: the tear falls down the shaft
  k11-28    the pipeline's pixel GPU (drawGpuTear): it lands on the hiss, the first pixel puff; INVIDIA on the card
  k29-30    the take snapped to the palette on the native grid     (the grid first)
  k31-32    the native grid in true colour (4 x 4 blocks)
  k33-34    2 px blocks
  k35-82    the take, real (f028-f075)
  k83-84    2 px blocks
  k85-86    the native grid in true colour
  k87-88    the palette on the native grid
  k89-      the pipeline's pixel HIGH: the last steam rising, his hand finds the phone
Each spliced PNG is the whole 1920 x 1080 picture: the insert in the room area (rows 0-811), the pipeline's own band
under it (rows 812-1079, taken from the pipeline's picture of the same frame, so the rail and letterbox match).

Run (the pipeline's picture stills of the span first; then this, through the heavy guard):
  node $S/r-act1.cjs picstills $S/tearpics <3460 .. 3519>
  bash ops/heavy.sh audio/.venv-casting/bin/python studio/src/dev/genvideo/runway/tear.py \\
      --pics $S/tearpics --png $S/glyph --start 3460 [--mp4 out/ep01/full-v3/runway/tear-702.mp4] [--sheet ...]
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image

HERE = Path(__file__).resolve().parent
ROOT = Path(__file__).resolve().parents[5]
sys.path.insert(0, str(HERE))
import insert as I  # noqa: E402  (the palette maths, the clip loader, the encoder)

W, H, PIC_H = 1920, 1080, 812
CLIP = ROOT / "out/ep01/full-v3/runway/clips/t1-veo31fast-i2v-tear-s702.mp4"
KEY = ROOT / "out/ep01/full-v3/runway/inputs/tear-702-first-keyframe.png"
F0, N = 22, 60                      # the take's frames used (f022-f081), one per insert frame
CROP_Y = 100                        # the 1080-high cover-fit's first row in the room (keeps the bead and the letters)
LOGO = (470, 515, 900, 610)         # the letters' box in the 1280 x 720 keyframe (x0, y0, x1, y1)


def mode(i: int) -> str:
    if i < 2 or i >= N - 2:
        return "pal"
    if i < 4 or i >= N - 4:
        return "native"
    if i < 6 or i >= N - 6:
        return "2px"
    return "real"


def lay_logo(fr: np.ndarray, key: np.ndarray) -> tuple[np.ndarray, tuple[int, int]]:
    """the keyframe's letters (only the letters: its bright metal inside the box, grown 2 px and softened) over the
    take's frame, aligned by a +-4 px search on the box's luminance; the casing round them stays the take's"""
    from scipy import ndimage
    x0, y0, x1, y1 = LOGO
    kb = key[y0:y1, x0:x1].astype(np.float32)
    ref = kb.mean(-1)
    best, off = 1e9, (0, 0)
    for dy in range(-4, 5):
        for dx in range(-4, 5):
            cand = fr[y0 + dy:y1 + dy, x0 + dx:x1 + dx].astype(np.float32).mean(-1)
            e = np.abs(cand - ref).mean()
            if e < best:
                best, off = e, (dx, dy)
    dx, dy = off
    m = ref > 110
    m = ndimage.binary_dilation(m, iterations=2)
    a = np.clip(ndimage.gaussian_filter(m.astype(np.float32), 1.0) * 1.3, 0, 1)[..., None]
    out = fr.copy().astype(np.float32)
    sl = (slice(y0 + dy, y1 + dy), slice(x0 + dx, x1 + dx))
    out[sl] = out[sl] * (1 - a) + kb * a
    return out.clip(0, 255).astype(np.uint8), off


def grade(a: np.ndarray) -> np.ndarray:
    """the macro's grade: the metal warmer (red-hot, not the take's salmon pink), exposure x0.95, the soft knee to 194/255"""
    x = a.astype(np.float32) / 255
    x = x * np.array([1.0, 0.78, 0.64], np.float32) * 0.95
    cap, knee = 194 / 255, 0.66
    over = np.clip(x - knee, 0, None)
    x = np.where(x > knee, knee + (cap - knee) * (1 - np.exp(-over / (cap - knee))), x)
    return (np.clip(x, 0, cap) * 255 + 0.5).astype(np.uint8)


def room_of(fr: np.ndarray) -> np.ndarray:
    """1280 x 720 -> the room area, 1920 x 812 (cover-fit to 1080 high, rows CROP_Y.. CROP_Y + 812), float 0..1"""
    big = np.asarray(Image.fromarray(fr).resize((W, H), Image.LANCZOS), np.float32) / 255
    return big[CROP_Y:CROP_Y + PIC_H]


def blocks(room: np.ndarray, s: int) -> np.ndarray:
    h, w = room.shape[:2]
    m = room.reshape(h // s, s, w // s, s, 3).mean((1, 3))
    return np.repeat(np.repeat(m, s, 0), s, 1)


def styled(room: np.ndarray, m: str) -> np.ndarray:
    if m == "real":
        return (room * 255 + 0.5).astype(np.uint8)
    if m == "2px":
        return (blocks(room, 2) * 255 + 0.5).astype(np.uint8)
    nat = room.reshape(PIC_H // 4, 4, W // 4, 4, 3).mean((1, 3))
    if m == "native":
        return (np.repeat(np.repeat(nat, 4, 0), 4, 1) * 255 + 0.5).astype(np.uint8)
    q = I.quantize(nat, dither=0.05, gain=1.0)
    return np.repeat(np.repeat(q, 4, 0), 4, 1)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--pics", required=True, help="the pipeline's picture stills of the span (p<frame>-7.02.png)")
    ap.add_argument("--png", required=True, help="GLYPH_DIR: writes <png>/pic/<frame>.png")
    ap.add_argument("--start", type=int, required=True, help="the segment frame of the insert's first frame (7.02 + 29)")
    ap.add_argument("--mp4", help="also write the insert alone (1920 x 1080, silent)")
    ap.add_argument("--sheet", help="a contact sheet of every 6th frame")
    ap.add_argument("--timing", help="every frame's source, as JSON")
    a = ap.parse_args()
    clip = I.load_clip(CLIP)
    key = np.asarray(Image.open(KEY).convert("RGB"))
    out = Path(a.png) / "pic"
    out.mkdir(parents=True, exist_ok=True)
    pics = {int(p.name[1:6]): p for p in Path(a.pics).glob("p*.png")}
    frames, timing, smalls = [], [], []
    for i in range(N):
        F = a.start + i
        fr, off = lay_logo(clip[F0 + i], key)
        room = room_of(grade(fr))
        m = mode(i)
        full = np.asarray(Image.open(pics[F]).convert("RGB")).copy()
        full[:PIC_H] = styled(room, m)
        Image.fromarray(full).save(out / f"{F:05d}.png")
        frames.append(full)
        timing.append({"frame": F, "k": 29 + i, "take_frame": F0 + i, "mode": m, "logo_offset": off})
        if i % 6 == 0:
            smalls.append(np.asarray(Image.fromarray(full).resize((480, 270), Image.BOX)))
    if a.mp4:
        I.encode(frames, Path(a.mp4))
    if a.sheet:
        cols = 5
        rows = (len(smalls) + cols - 1) // cols
        sheet = np.zeros((rows * 270, cols * 480, 3), np.uint8)
        for j, s in enumerate(smalls):
            sheet[(j // cols) * 270:(j // cols + 1) * 270, (j % cols) * 480:(j % cols + 1) * 480] = s
        Image.fromarray(sheet).save(a.sheet)
    if a.timing:
        Path(a.timing).write_text(json.dumps({"clip": str(CLIP.relative_to(ROOT)), "key": str(KEY.relative_to(ROOT)), "frames": timing}, indent=1))
    print(f"wrote {N} frames to {out} (segment frames {a.start}-{a.start + N - 1})")


if __name__ == "__main__":
    main()
