#!/usr/bin/env python3
"""MR. MAS Ep2 v1 cold open: the 2.A leap, AROS's preview on the lobby's wall screen, from the Runway take.

The take (objects only: a woolly mammoth in a snowy meadow, nothing human; its provenance.json sits beside it):
  out/ep02/v1/runway/clips/a1-veo31fast-t2v-mammoth-s215.mp4   (Veo 3.1 Fast, text to video, 8 s, 1280 x 720, 24 fps)

It plays in the bezel at full 1080p (a leap keeps its contrast: no grade, no pixel rim, no down-rez; LEARNINGS P12),
spliced as the pipeline's OVERLAY layers (spec.ts Layout.overlay, render.ts), the way Ep1's 3D CLOD went into 11.04.
The step-out is our own conversion (manifest §4: "the step-out stays our conversion"):

  1.01  k0-71    the master's wall screen (native 344,24 103 x 101 = 1080p 1376,96 412 x 404): take f000-f071, real
  1.02  k0-147   the medium's screen (native 206,12 262 x 148 = 1080p 824,48 1048 x 592): take f018-f165, real
                 (it re-uses f018-f071 across the cut: the wide's tiny mammoth reads the same size as the medium's)
        k148-    the take HOLDS on f165, the frame its foot reaches the bottom edge: the preview stops as the foot
                 breaks the bezel (the pixel foot is the layout's, at AROS_FOOT, under the screen)
  1.03  k0-7     the master's screen on f165: real (k0-1) -> 2 px blocks (k2-3) -> the native grid in true colour
                 (k4-5) -> the master palette on the native grid (k6-7): it becomes ours. From k8 the layout draws
                 the empty meadow in the palette (AROS_MEADOW, below) and the pixel mammoth stepping out

Writes (git-ignored layers; the manifests and this tool's data module are small):
  out/ep02/v1/inserts/aros/<shot>/manifest.json   {shot, shot_len, check, frames: [{k, layers}]} (render.ts reads it)
  out/ep02/v1/inserts/aros/<shot>/l<frame>.png    1920 x 1080 RGBA, straight alpha, opaque inside the screen only
  out/ep02/v1/inserts/aros/sheet.png              every 12th layer, small, for a look
  studio/src/episodes/ep02/pixel/coldopen/aros.ts the native plates (the meadow with nobody in it, in the palette),
                                                  the foot's x under the medium's screen, the take's provenance

Run (heavy-ish: ~230 PNG writes, ~1.5 GB RAM), from the repo root:
  bash ops/heavy.sh audio/.venv-casting/bin/python studio/src/episodes/ep02/pixel/coldopen/tools/aros_insert.py [--plates-only]
"""
from __future__ import annotations

import hashlib
import json
import sys
from pathlib import Path

import av
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[7]
sys.path.insert(0, str(ROOT / "studio/src/dev/genvideo/runway"))
import insert as I  # noqa: E402  (Ep1's palette maths, imported unchanged: quantize, load_palette)

CLIP = ROOT / "out/ep02/v1/runway/clips/a1-veo31fast-t2v-mammoth-s215.mp4"
PROV = CLIP.with_suffix(".provenance.json")
OUT = ROOT / "out/ep02/v1/inserts/aros"
TS = ROOT / "studio/src/episodes/ep02/pixel/coldopen/aros.ts"
LOCK = ROOT / "studio/src/episodes/ep02/pixel/coldopen/data.ts"
W, H = 1920, 1080

# native rects (x, y, w, h); x4 for 1080p
MASTER = (344, 24, 103, 101)        # sets/lobby2.ts LOBBY2.SCREEN (x0 344 .. x1 446, y0 24 .. y1 124)
MEDIUM = (206, 12, 262, 148)        # coldopen/art.ts MED.screen
HOLD = 165                          # the take's frame where the near foot reaches the bottom edge
MED_FROM = 18                       # 1.02's first take frame
BREAK_K = 148                       # 1.02: the foot's step (mammoth_step_pixel @148)


def x4(r):
    return tuple(v * 4 for v in r)


def cover(fr: np.ndarray, w: int, h: int) -> np.ndarray:
    """the take's frame scaled to cover w x h (Lanczos), centre-cropped; uint8"""
    fh, fw = fr.shape[:2]
    s = max(w / fw, h / fh)
    sw, sh = round(fw * s), round(fh * s)
    big = np.asarray(Image.fromarray(fr).resize((sw, sh), Image.LANCZOS))
    ox, oy = (sw - w) // 2, (sh - h) // 2
    return big[oy:oy + h, ox:ox + w]


def stage(img: np.ndarray, mode: str) -> np.ndarray:
    """real | 2px | native | pal: the step-down to our grid (tear.py's order, Ep1 7.02)"""
    if mode == "real":
        return img
    h, w = img.shape[:2]
    f = img.astype(np.float32) / 255
    if mode == "2px":
        m = f.reshape(h // 2, 2, w // 2, 2, 3).mean((1, 3))
        return (np.repeat(np.repeat(m, 2, 0), 2, 1) * 255 + 0.5).astype(np.uint8)
    nat = f.reshape(h // 4, 4, w // 4, 4, 3).mean((1, 3))
    if mode == "native":
        return (np.repeat(np.repeat(nat, 4, 0), 4, 1) * 255 + 0.5).astype(np.uint8)
    q = I.quantize(nat, dither=0.05, gain=1.0)
    return np.repeat(np.repeat(q, 4, 0), 4, 1)


def layer(img: np.ndarray, r) -> Image.Image:
    x, y, w, h = r
    a = np.zeros((H, W, 4), np.uint8)
    a[y:y + h, x:x + w, :3] = img
    a[y:y + h, x:x + w, 3] = 255
    return Image.fromarray(a, "RGBA")


def sha(p: Path) -> str:
    h = hashlib.sha256()
    h.update(p.read_bytes())
    return h.hexdigest()


def main() -> None:
    with av.open(str(CLIP)) as c:
        fr = [f.to_ndarray(format="rgb24") for f in c.decode(video=0)]
    assert len(fr) == 192, len(fr)
    t = LOCK.read_text()
    lock = json.loads(t[t.index("= {") + 2:t.rindex("}") + 1])   # the pixel lock (data.ts), the renderer's own
    shots = {s["id"]: s for s in lock["shots"]}
    lens = {sid: shots[sid]["e"] - shots[sid]["s"] for sid in ("1.01", "1.02", "1.03")}
    OUT.mkdir(parents=True, exist_ok=True)
    smalls = []

    def write(shot: str, plan: list[tuple[int, int, str]], r, check=None):
        d = OUT / shot
        d.mkdir(parents=True, exist_ok=True)
        done: dict[tuple[int, str], str] = {}
        frames = []
        for k, t, mode in plan:
            key = (t, mode)
            if key not in done:
                img = stage(cover(fr[t], r[2], r[3]), mode)
                name = f"l{t:03d}{'' if mode == 'real' else '-' + mode}.png"
                layer(img, r).save(d / name, compress_level=3)
                done[key] = name
                if len(smalls) < 64 and (k % 12 == 0 or mode != "real"):
                    smalls.append((f"{shot} k{k} f{t} {mode}", Image.fromarray(img).resize((r[2] // 4, r[3] // 4), Image.BOX)))
            frames.append({"k": k, "take_frame": t, "mode": mode, "layers": [done[key]]})
        m = {"seg": "coldopen", "shot": shot, "shot_len": lens[shot], "rect_1080": list(r), "clip": str(CLIP.relative_to(ROOT)),
             "clip_sha256": sha(CLIP), "provenance": str(PROV.relative_to(ROOT)), "frames": frames}
        if check:
            m["check"] = check
        (d / "manifest.json").write_text(json.dumps(m, indent=1) + "\n")
        print(f"{shot}: {len(frames)} frames, {len(done)} layers")

    if "--plates-only" in sys.argv:
        write = lambda *a, **k: None  # noqa: E731  (the layers are already there)
    # 1.01: the wide, f000-f071
    write("1.01", [(k, k, "real") for k in range(lens["1.01"])], x4(MASTER))
    # 1.02: the medium, f018 -> f165, then the hold
    plan02 = [(k, min(MED_FROM + k, HOLD) if k < BREAK_K else HOLD, "real") for k in range(lens["1.02"])]
    chk = None
    for s in lock["shots"]:
        if s["id"] == "1.02":
            for l in s.get("lines", []):
                if l.get("id") == "e2-co-0001":
                    chk = {"line": "e2-co-0001", "s": l["s"]}
    write("1.02", plan02, x4(MEDIUM), chk)
    # 1.03: the step-down on the master's screen, k0-7
    modes = ["real", "real", "2px", "2px", "native", "native", "pal", "pal"]
    write("1.03", [(k, HOLD, m) for k, m in enumerate(modes)], x4(MASTER))

    # ---- the native plates for the layout (aros.ts)
    names = {tuple(c["rgb"]): c["name"] for c in json.loads((ROOT / "studio/tools/genvideo/palettes.json").read_text())["master"]}
    # the empty meadow: f000 with the mammoth's columns replaced by the meadow beside them (the camera is locked off;
    # at the native grid the seam is gone), cropped and converted for the master's screen
    f0 = fr[0].copy()
    # (the tusks reach x 340-880 at f000: fill 330-615 from the clean left edge, 615-900 from the clean right edge)
    f0[:, 330:615] = fr[0][:, 45:330]
    f0[:, 615:900] = fr[0][:, 900:1185]
    plate = cover(f0, MASTER[2] * 4, MASTER[3] * 4).astype(np.float32) / 255
    nat = plate.reshape(MASTER[3], 4, MASTER[2], 4, 3).mean((1, 3))
    q = I.quantize(nat, dither=0.05, gain=1.0)
    used = sorted({tuple(int(v) for v in px) for px in q.reshape(-1, 3)})
    idx = {c: i for i, c in enumerate(used)}
    pal = [names[c] for c in used]
    s = "".join(f"{idx[tuple(int(v) for v in px)]:02x}" for px in q.reshape(-1, 3))
    # the near foot under the medium's screen: the dark run across the take's bottom rows on the held frame, in the
    # medium's native x
    med = cover(fr[HOLD], MEDIUM[2] * 4, MEDIUM[3] * 4).astype(np.float32).mean(-1)
    bottom = med[-24:].mean(0)
    dark = bottom < 70
    # the trunk hangs at the middle and the near foot plants beside it, right of it: the rightmost dark run, widened by
    # its hair (6 native px a side)
    runs, x = [], 0
    while x < len(dark):
        if dark[x]:
            x0 = x
            while x < len(dark) and dark[x]:
                x += 1
            runs.append((x0, x))
        x += 1
    runs = [r for r in runs if r[1] - r[0] >= 40]
    print("dark runs on the medium's bottom rows (1080p x):", runs)
    foot = runs[-1] if runs else (600, 720)
    fx0, fx1 = MEDIUM[0] + foot[0] // 4 - 6, MEDIUM[0] + foot[1] // 4 + 6
    prov = json.loads(PROV.read_text())
    ts = [
        "// MR. MAS — Ep2 v1 cold open: the 2.A leap's native plates. GENERATED by coldopen/tools/aros_insert.py from the",
        f"// Runway take {CLIP.relative_to(ROOT)} (sha256 {sha(CLIP)[:16]}...). Do not hand-edit: re-run the tool.",
        "// AROS_MEADOW: the master's wall screen (103 x 101) after the step-out: the take's meadow with nobody in it, on our",
        "// grid in the master palette (2 hex digits a pixel, indices into its `pal`). AROS_FOOT: where the take's near",
        "// foot meets the bottom of the medium's screen at the hold (native x), so the pixel foot continues it.",
        "import {PAL} from '../../../../shared/pixel/palette';",
        "",
        f"export const AROS_MEADOW = {{w: {MASTER[2]}, h: {MASTER[3]}, pal: [{', '.join('PAL.' + n for n in pal)}], px: '{s}'}};",
        f"export const AROS_FOOT = {{x0: {fx0}, x1: {fx1}, holdFrame: {HOLD}, breakK: {BREAK_K}}};",
        f"export const AROS_TAKE = {{file: '{CLIP.relative_to(ROOT)}', model: '{prov.get('model')}', seed: {prov.get('seed')}, task: '{prov.get('task_id')}', credits: {prov.get('credits_spent')}}};",
        "",
    ]
    TS.write_text("\n".join(ts))
    print(f"wrote {TS.relative_to(ROOT)}: meadow {len(pal)} colours, foot x {fx0}-{fx1}")
    # a sheet to look at
    if smalls:
        cw, ch = max(im.width for _, im in smalls), max(im.height for _, im in smalls)
        cols = 8
        rows = (len(smalls) + cols - 1) // cols
        sheet = Image.new("RGB", (cols * (cw + 4), rows * (ch + 4)), (10, 10, 20))
        for i, (_, im) in enumerate(smalls):
            sheet.paste(im, ((i % cols) * (cw + 4), (i // cols) * (ch + 4)))
        sheet.save(OUT / "sheet.png")


if __name__ == "__main__":
    main()
