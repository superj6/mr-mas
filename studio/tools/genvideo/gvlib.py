"""MR. MAS genvideo: shared helpers for pixelize.py / glyphize.py / keyframes.py.

- paths to the studio, the bundled ffmpeg (Remotion's; a minimal build: no select/fps/tile filters, so every
  frame operation happens here in numpy), and palettes.json (exported from the engine by export_palettes.ts)
- colour math (sRGB <-> linear <-> OKLab, identical formulas to src/shared/pixel/palette.ts)
- the master palette + palette sets as numpy tables, and a port of the engine's hash() (verified on load)
- video decode (ffmpeg rawvideo pipe with presentation timestamps, or an image-sequence folder) and x264 encode
- pass 1 of the converters: fit/crop -> block-scale -> optional pan-lock -> OKLab -> edge-aware k-centroid
  downscale to the 480x270 grid; then the motion-compensated temporal filter and the 24 fps conform.
"""
from __future__ import annotations

import json
import os
import subprocess
import sys
from dataclasses import dataclass, field
from pathlib import Path

import numpy as np
import cv2

HERE = Path(__file__).resolve().parent
STUDIO = HERE.parents[1]
ROOT = STUDIO.parent
FFD = STUDIO / 'node_modules/@remotion/compositor-linux-x64-gnu'
FFMPEG = FFD / 'ffmpeg'
FFPROBE = FFD / 'ffprobe'
PAL_JSON = HERE / 'palettes.json'
NATIVE_W, NATIVE_H = 480, 270
FPS = 24
UI_Y = 203  # adventure layout: room 480x203 above the verb/inventory band

cv2.setNumThreads(max(1, min(8, (os.cpu_count() or 4) // 2)))


def log(*a):
    print('[genvideo]', *a, file=sys.stderr, flush=True)


def ff_env():
    env = dict(os.environ)
    env['LD_LIBRARY_PATH'] = str(FFD) + ((':' + env['LD_LIBRARY_PATH']) if env.get('LD_LIBRARY_PATH') else '')
    return env


# ------------------------------------------------------------------------------------------------ colour math
_M1 = np.array([[0.4122214708, 0.5363325363, 0.0514459929],
                [0.2119034982, 0.6806995451, 0.1073969566],
                [0.0883024619, 0.2817188376, 0.6299787005]], np.float32)
_M2 = np.array([[0.2104542553, 0.793617785, -0.0040720468],
                [1.9779984951, -2.428592205, 0.4505937099],
                [0.0259040371, 0.7827717662, -0.808675766]], np.float32)
_M1i = np.linalg.inv(_M1).astype(np.float32)
_M2i = np.linalg.inv(_M2).astype(np.float32)
_v = np.arange(256, dtype=np.float64) / 255.0
SRGB2LIN = np.where(_v <= 0.04045, _v / 12.92, ((_v + 0.055) / 1.055) ** 2.4).astype(np.float32)


def srgb8_to_lin(u8: np.ndarray) -> np.ndarray:
    return SRGB2LIN[u8]


def lin_to_srgb8(lin: np.ndarray) -> np.ndarray:
    v = np.clip(lin, 0, 1)
    s = np.where(v <= 0.0031308, v * 12.92, 1.055 * np.power(v, 1 / 2.4) - 0.055)
    return np.clip(np.round(s * 255), 0, 255).astype(np.uint8)


def lin_to_oklab(lin: np.ndarray) -> np.ndarray:
    lms = np.cbrt(np.maximum(lin @ _M1.T, 0))
    return (lms @ _M2.T).astype(np.float32)


def oklab_to_lin(lab: np.ndarray) -> np.ndarray:
    lms = lab @ _M2i.T
    return (lms * lms * lms) @ _M1i.T


def srgb8_to_oklab(u8: np.ndarray) -> np.ndarray:
    return lin_to_oklab(srgb8_to_lin(u8))


def oklab_to_srgb8(lab: np.ndarray) -> np.ndarray:
    return lin_to_srgb8(oklab_to_lin(lab))


def hex2rgb(h: str):
    h = h.lstrip('#')
    return [int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)]


def hex2int(h: str) -> int:
    return int(h.lstrip('#'), 16)


# ------------------------------------------------------------------------------------------------ engine hash() port
def js_hash(x, y, s=0):
    """Port of px.ts hash(x, y, s) -> [0, 1). Works on numpy int arrays (exact: JS float math stays < 2^53 here)."""
    x = np.asarray(x, np.int64)
    y = np.asarray(y, np.int64)
    s = np.asarray(s, np.int64)
    h = (x * 374761393 + y * 668265263 + s * 2147483647) & 0xFFFFFFFF  # | 0  (ToInt32 keeps the low 32 bits)
    t = (h ^ (h >> 13)) & 0xFFFFFFFF  # h ^ (h >>> 13)
    p = (t * 1274126177) & 0xFFFFFFFF  # Math.imul keeps the low 32 bits
    p = p ^ (p >> 16)
    return p.astype(np.float64) / 4294967296.0


# ------------------------------------------------------------------------------------------------ palettes
FAMILY_PRESETS = {
    # the whole master palette (the BASE set)
    'all': None,
    # a night room: night, monitor cyan, tungsten, skin ramps, hair, hoodie, wood, dusk
    'night': 'NCWSKXBGDU',
    # exteriors at night: night, dusk, cyan, tungsten windows, fleece blues, greys
    'sky': 'NUCWFG',
    'dusk': 'NUWQRF',
    # cool only (the machine / monitor light)
    'cool': 'NCKFGI',
    # warm only (tungsten hallway, fire, the rocket)
    'warm': 'WDRQUSB',
}


@dataclass
class Palette:
    """The master palette (91 colours, engine order) + a candidate subset for mapping. Indices are MASTER indices."""
    data: dict
    names: list
    hexes: list
    rgb: np.ndarray
    lin: np.ndarray
    lab: np.ndarray
    fam: list
    rung: np.ndarray
    skin: np.ndarray
    cand: np.ndarray  # master indices allowed as output
    sets: dict = field(default_factory=dict)
    patterns: dict = field(default_factory=dict)

    @property
    def n(self):
        return len(self.hexes)

    def step(self, idx: np.ndarray, k: int) -> np.ndarray:
        """stepColor(): walk k rungs along each colour's own family (engine semantics), clamped."""
        out = idx.copy()
        for f in set(self.fam):
            members = [i for i, ff in enumerate(self.fam) if ff == f]
            members.sort(key=lambda i: self.rung[i])
            arr = np.array(members)
            for r, i in enumerate(members):
                out[idx == i] = arr[max(0, min(len(arr) - 1, r + k))]
        return out

    def threshold(self, key: str) -> np.ndarray:
        rows = self.patterns[key]
        return np.array([[float(v) for v in r.split()] for r in rows], np.float32)


def load_palette(families: str | None = None, exclude: str = '') -> Palette:
    if not PAL_JSON.exists():
        raise SystemExit(f'{PAL_JSON} missing: run the exporter (see README "palettes.json")')
    d = json.loads(PAL_JSON.read_text())
    m = d['master']
    hexes = [c['hex'] for c in m]
    rgb = np.array([c['rgb'] for c in m], np.uint8)
    lin = srgb8_to_lin(rgb).astype(np.float32)
    lab = np.array([c['oklab'] for c in m], np.float32)
    fam = [c['family'] for c in m]
    rung = np.array([c['rung'] for c in m])
    skin_hex = set(d['skin'])
    skin = np.array([h in skin_hex for h in hexes])
    if families in FAMILY_PRESETS:
        families = FAMILY_PRESETS[families]
    allowed = [i for i, f in enumerate(fam) if (families is None or f in families) and f not in exclude]
    if not allowed:
        raise SystemExit(f'no palette colours left for families={families!r} exclude={exclude!r}')
    # verify the hash port against the engine's own values (exported with the palette)
    for x, y, s, v in d.get('hashVectors', []):
        got = float(js_hash(x, y, s))
        if abs(got - v) > 1e-12:
            raise SystemExit(f'js_hash port mismatch at {(x, y, s)}: {got} vs {v}')
    return Palette(d, [c['name'] for c in m], hexes, rgb, lin, lab, fam, rung, skin, np.array(allowed), d['sets'], d['patterns'])


# ------------------------------------------------------------------------------------------------ video IO
@dataclass
class VideoInfo:
    path: str
    w: int
    h: int
    fps: float
    n: int
    duration: float


IMAGE_EXT = ('.png', '.jpg', '.jpeg', '.webp')


def probe(path: str) -> VideoInfo:
    p = Path(path)
    if p.is_file() and p.suffix.lower() in IMAGE_EXT:
        # a single still (an image model's plate): a one-frame clip; --duration holds it
        im = cv2.imread(str(p))
        return VideoInfo(str(p), im.shape[1], im.shape[0], 0.0, 1, 0.0)
    if p.is_dir():
        files = sorted([f for f in p.iterdir() if f.suffix.lower() in ('.png', '.jpg', '.jpeg', '.webp')])
        if not files:
            raise SystemExit(f'no frames in {p}')
        im = cv2.imread(str(files[0]))
        return VideoInfo(str(p), im.shape[1], im.shape[0], 0.0, len(files), 0.0)
    out = subprocess.run([str(FFPROBE), '-v', 'error', '-select_streams', 'v:0', '-show_entries',
                          'stream=width,height,avg_frame_rate,r_frame_rate,nb_frames,duration:format=duration',
                          '-of', 'json', str(p)], env=ff_env(), capture_output=True, text=True, check=True)
    j = json.loads(out.stdout)
    s = j['streams'][0]

    def rate(r):
        a, b = r.split('/')
        return float(a) / float(b) if float(b) else 0.0
    fps = rate(s.get('avg_frame_rate', '0/0')) or rate(s.get('r_frame_rate', '0/0'))
    dur = float(s.get('duration') or j.get('format', {}).get('duration') or 0)
    n = int(s.get('nb_frames') or round(dur * fps))
    return VideoInfo(str(p), int(s['width']), int(s['height']), fps, n, dur)


def packet_times(path: str) -> list[float]:
    """Presentation timestamps of every video packet, sorted (handles VFR and non-zero start times)."""
    out = subprocess.run([str(FFPROBE), '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'packet=pts_time',
                          '-of', 'csv=p=0', path], env=ff_env(), capture_output=True, text=True, check=True)
    ts = sorted(float(x) for x in out.stdout.split() if x.strip() and x.strip() != 'N/A')
    return ts


def read_frames(path: str, src_fps: float | None = None):
    """Yield (t_seconds, rgb uint8 HxWx3) for every source frame, in presentation order. Audio is ignored."""
    info = probe(path)
    p = Path(path)
    if p.is_file() and p.suffix.lower() in IMAGE_EXT:
        yield 0.0, cv2.cvtColor(cv2.imread(str(p), cv2.IMREAD_COLOR), cv2.COLOR_BGR2RGB)
        return
    if p.is_dir():
        fps = src_fps or 24.0
        files = sorted([f for f in p.iterdir() if f.suffix.lower() in ('.png', '.jpg', '.jpeg', '.webp')])
        for i, f in enumerate(files):
            im = cv2.imread(str(f), cv2.IMREAD_COLOR)
            yield i / fps, cv2.cvtColor(im, cv2.COLOR_BGR2RGB)
        return
    ts = packet_times(path)
    t0 = ts[0] if ts else 0.0
    fps = src_fps or info.fps or 24.0
    # (the bundled ffmpeg has no rawvideo muxer: raw frames go out through image2pipe with the rawvideo codec)
    cmd = [str(FFMPEG), '-hide_banner', '-loglevel', 'error', '-i', path, '-map', '0:v:0', '-fps_mode', 'passthrough',
           '-f', 'image2pipe', '-c:v', 'rawvideo', '-pix_fmt', 'rgb24', '-']
    proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, env=ff_env())
    fsz = info.w * info.h * 3
    i = 0
    done = False
    try:
        while True:
            buf = proc.stdout.read(fsz)
            if len(buf) < fsz:
                done = True
                break
            t = (ts[i] - t0) if (src_fps is None and i < len(ts)) else i / fps
            yield t, np.frombuffer(buf, np.uint8).reshape(info.h, info.w, 3)
            i += 1
    finally:
        if not done:
            proc.kill()  # the caller stopped early (a t_out, a single frame): no broken-pipe noise
        proc.stdout.close()
        proc.wait()


class Mp4Writer:
    """Frames -> H.264 with the intro master's settings (libx264 slow, yuv420p, bt709, 24 fps).
    The bundled ffmpeg has no rawvideo demuxer, so frames are piped as fast PNGs (image2pipe) at whatever size
    they are (native 480x270 is tiny) and scaled to (w, h) inside ffmpeg with NEAREST neighbour."""

    def __init__(self, path: str, w: int, h: int, fps: int = FPS, crf: int = 16):
        Path(path).parent.mkdir(parents=True, exist_ok=True)
        self.w, self.h = w, h
        cmd = [str(FFMPEG), '-hide_banner', '-loglevel', 'error', '-y', '-f', 'image2pipe', '-c:v', 'png',
               '-framerate', str(fps), '-i', '-',
               '-vf', f'scale={w}:{h}:flags=neighbor:out_color_matrix=bt709:out_range=tv',
               '-c:v', 'libx264', '-preset', 'slow', '-crf', str(crf), '-pix_fmt', 'yuv420p', '-r', str(fps),
               '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-color_range', 'tv',
               '-movflags', '+faststart', path]
        self.proc = subprocess.Popen(cmd, stdin=subprocess.PIPE, env=ff_env())
        self.n = 0

    def write(self, rgb: np.ndarray):
        ok, buf = cv2.imencode('.png', cv2.cvtColor(np.ascontiguousarray(rgb, np.uint8), cv2.COLOR_RGB2BGR), [cv2.IMWRITE_PNG_COMPRESSION, 1])
        self.proc.stdin.write(buf.tobytes())
        self.n += 1

    def close(self):
        self.proc.stdin.close()
        if self.proc.wait() != 0:
            raise SystemExit('ffmpeg encode failed')


def upscale(native_rgb: np.ndarray, k: int = 4) -> np.ndarray:
    return np.repeat(np.repeat(native_rgb, k, 0), k, 1)


def save_png(path, rgb: np.ndarray):
    Path(path).parent.mkdir(parents=True, exist_ok=True)
    cv2.imwrite(str(path), cv2.cvtColor(np.ascontiguousarray(rgb), cv2.COLOR_RGB2BGR), [cv2.IMWRITE_PNG_COMPRESSION, 9])


def load_mask(path: str | None, w=NATIVE_W, h=NATIVE_H) -> np.ndarray | None:
    """A mask PNG (white = on; any size, resampled to the native grid) -> float32 0..1 coverage."""
    if not path:
        return None
    m = cv2.imread(path, cv2.IMREAD_UNCHANGED)
    if m is None:
        raise SystemExit(f'cannot read mask {path}')
    if m.ndim == 3:
        m = m[..., 3] if m.shape[2] == 4 else cv2.cvtColor(m, cv2.COLOR_BGR2GRAY)
    m = cv2.resize(m, (w, h), interpolation=cv2.INTER_AREA)
    return (m.astype(np.float32) / 255.0)


# ------------------------------------------------------------------------------------------------ pass 1: to the grid
def parse_crop(s: str | None, w: int, h: int):
    """'x,y,w,h' in source px, or fractions (all <= 1). None -> whole frame."""
    if not s:
        return 0, 0, w, h
    v = [float(x) for x in s.split(',')]
    if all(x <= 1.0 for x in v):
        v = [v[0] * w, v[1] * h, v[2] * w, v[3] * h]
    x, y, cw, ch = [int(round(x)) for x in v]
    return max(0, x), max(0, y), min(cw, w - x), min(ch, h - y)


def fit_rect(w: int, h: int, tw: int, th: int, mode: str, crop):
    """Source rect (x, y, w, h) to sample so that it maps onto tw x th ('cover' centre-crops, 'stretch' uses it all)."""
    x, y, cw, ch = crop
    if mode == 'stretch':
        return x, y, cw, ch
    ta = tw / th
    if cw / ch > ta:  # too wide: crop sides
        nw = int(round(ch * ta))
        return x + (cw - nw) // 2, y, nw, ch
    nh = int(round(cw / ta))
    return x, y + (ch - nh) // 2, cw, nh


def auto_block(src_h: int, th: int) -> int:
    return int(max(1, min(4, src_h // th)))


def kcentroid(lab_hi: np.ndarray, b: int, lo=0.02, hi=0.07, iters=3) -> np.ndarray:
    """Edge-aware downscale: each b x b block becomes its area mean when flat, and the centroid of its DOMINANT
    2-means cluster when it straddles an edge (no muddy in-between colours on contours). Blend by cluster contrast."""
    H, W = lab_hi.shape[:2]
    h, w = H // b, W // b
    if b == 1:
        return lab_hi[:h, :w].copy()
    bb = b * b
    # channel planes (3, N, bb): reductions over the block axis, not over a tiny colour axis
    x = lab_hi[:h * b, :w * b].reshape(h, b, w, b, 3).transpose(4, 0, 2, 1, 3).reshape(3, h * w, bb)
    x = np.ascontiguousarray(x, np.float32)
    mean = x.mean(2)
    L = x[0]
    ar = np.arange(h * w)
    i0, i1 = L.argmin(1), L.argmax(1)
    c0 = x[:, ar, i0]
    c1 = x[:, ar, i1]
    for _ in range(iters):
        d0 = (x[0] - c0[0][:, None]) ** 2 + (x[1] - c0[1][:, None]) ** 2 + (x[2] - c0[2][:, None]) ** 2
        d1 = (x[0] - c1[0][:, None]) ** 2 + (x[1] - c1[1][:, None]) ** 2 + (x[2] - c1[2][:, None]) ** 2
        m1 = (d1 < d0).astype(np.float32)
        n1 = m1.sum(1)
        n0 = bb - n1
        s1 = np.einsum('cnk,nk->cn', x, m1)
        s0 = x.sum(2) - s1
        c1 = np.where(n1 > 0, s1 / np.maximum(n1, 1), c1)
        c0 = np.where(n0 > 0, s0 / np.maximum(n0, 1), c0)
    # dominant cluster; a tie goes to the darker one (contours keep their ink, like a hand-cleaned downscale)
    dom = np.where(n1 > n0, c1, c0)
    contrast = np.sqrt(((c1 - c0) ** 2).sum(0))
    wgt = np.clip((contrast - lo) / (hi - lo), 0, 1)
    out = mean * (1 - wgt) + dom * wgt
    return np.ascontiguousarray(out.T.reshape(h, w, 3), np.float32)


@dataclass
class Clip:
    """Source frames on the native grid (OKLab float32), with timestamps and per-frame motion."""
    times: np.ndarray
    lab: list  # native OKLab frames (after the temporal filter once `denoise` ran)
    raw: list  # native OKLab frames before the temporal filter (for comparisons)
    preview: list  # source frames resized to 2x native, uint8 RGB (for before/after sheets); may be empty
    info: VideoInfo
    rect: tuple
    block: int
    pan: np.ndarray  # accumulated global content offset per frame (native px, dx dy)
    gmotion: np.ndarray = None  # |global motion| per frame (native px / source frame)


def load_clip(path: str, *, t_in=0.0, t_out=None, speed=1.0, fit='cover', crop=None, block=None, downscale='kcentroid',
              pan_lock=False, presmooth=0.0, src_fps=None, keep_preview=True, tw=NATIVE_W, th=NATIVE_H) -> Clip:
    info = probe(path)
    rect = fit_rect(info.w, info.h, tw, th, fit, parse_crop(crop, info.w, info.h))
    rx, ry, rw, rh = rect
    b = block or auto_block(rh, th)
    log(f'source {info.w}x{info.h} @ {info.fps:.3f} fps, {info.n} frames; sampling rect {rect}; block {b} ({tw * b}x{th * b})')
    times, labs, previews, pans = [], [], [], []
    pan = np.zeros(2)
    prev_small = None
    margin = 1.0 / max(1.0, info.fps or 24)
    win = cv2.createHanningWindow((tw, th), cv2.CV_32F) if pan_lock else None
    for t, rgb in read_frames(path, src_fps):
        if t < t_in - margin:
            continue
        if t_out is not None and t > t_out + margin:
            break
        crop_img = rgb[ry:ry + rh, rx:rx + rw]
        interp = cv2.INTER_AREA if (rw >= tw * b) else cv2.INTER_CUBIC
        hi = cv2.resize(crop_img, (tw * b, th * b), interpolation=interp)
        if presmooth > 0:
            hi = cv2.bilateralFilter(hi, 0, presmooth * 12, presmooth * b)
        if pan_lock:
            small = cv2.cvtColor(cv2.resize(hi, (tw, th), interpolation=cv2.INTER_AREA), cv2.COLOR_RGB2GRAY).astype(np.float32)
            if prev_small is not None:
                (dx, dy), resp = cv2.phaseCorrelate(prev_small, small, win)
                if resp > 0.08 and abs(dx) < tw / 4 and abs(dy) < th / 4:
                    pan = pan + np.array([dx, dy])
            prev_small = small
            # put the content on the integer grid: shift by (round(pan) - pan) native px, at block resolution
            s = (np.round(pan) - pan) * b
            if abs(s[0]) > 1e-3 or abs(s[1]) > 1e-3:
                M = np.float32([[1, 0, s[0]], [0, 1, s[1]]])
                hi = cv2.warpAffine(hi, M, (hi.shape[1], hi.shape[0]), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
        lab_hi = srgb8_to_oklab(hi)
        if downscale == 'area':
            nat = cv2.resize(lab_hi, (tw, th), interpolation=cv2.INTER_AREA)
        elif downscale == 'nearest':
            nat = lab_hi[b // 2::b, b // 2::b][:th, :tw].copy()
        else:
            nat = kcentroid(lab_hi, b)
        times.append((t - t_in) / speed)
        labs.append(nat)
        pans.append(pan.copy())
        if keep_preview:
            previews.append(cv2.resize(crop_img, (tw * 2, th * 2), interpolation=cv2.INTER_AREA))
    if not labs:
        raise SystemExit('no frames decoded in the requested range')
    log(f'decoded {len(labs)} frames ({times[-1]:.2f} s on the output clock)')
    return Clip(np.array(times), labs, [l.copy() for l in labs], previews, info, rect, b, np.array(pans))


# ------------------------------------------------------------------------------------------------ flow + temporal filter
_DIS = None


def dis():
    global _DIS
    if _DIS is None:
        _DIS = cv2.DISOpticalFlow_create(cv2.DISOPTICAL_FLOW_PRESET_MEDIUM)
    return _DIS


def gray8(lab: np.ndarray) -> np.ndarray:
    return np.clip(lab[..., 0] * 255, 0, 255).astype(np.uint8)


def flow_pair(cur_lab: np.ndarray, prev_lab: np.ndarray):
    """Backward flow (cur -> prev) + a reliability mask from forward-backward consistency."""
    gc, gp = gray8(cur_lab), gray8(prev_lab)
    fb = dis().calc(gc, gp, None)  # cur(p) ~ prev(p + fb(p))
    ff = dis().calc(gp, gc, None)
    h, w = gc.shape
    gx, gy = np.meshgrid(np.arange(w, dtype=np.float32), np.arange(h, dtype=np.float32))
    mx, my = gx + fb[..., 0], gy + fb[..., 1]
    ffw = cv2.remap(ff, mx, my, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
    err = np.hypot(fb[..., 0] + ffw[..., 0], fb[..., 1] + ffw[..., 1])
    inside = (mx >= 0) & (my >= 0) & (mx <= w - 1) & (my <= h - 1)
    ok = (err < 0.75) & inside
    return fb, ok, (mx, my)


def warp(img: np.ndarray, maps, nearest=False):
    mx, my = maps
    return cv2.remap(img, mx, my, cv2.INTER_NEAREST if nearest else cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)


def temporal_filter(clip: Clip, strength=0.7, n0=0.018, n1=0.06, mc=True):
    """Motion-compensated recursive filter at native res. Where the (warped) history agrees with the new frame to
    within noise (dE < n0) it averages (alpha -> 1 - strength); where it disagrees (motion, occlusion, a real change)
    it takes the new frame (alpha -> 1). Removes model grain/flicker before quantisation, so pixels don't boil.
    Also records the global motion per frame (median flow) for the conform and the dither anchoring."""
    frames = clip.lab
    gm = np.zeros(len(frames))
    if strength <= 0 and not mc:
        clip.gmotion = gm
        return clip
    acc = frames[0].copy()
    amin = max(0.05, 1.0 - strength)
    out = [acc.copy()]
    for i in range(1, len(frames)):
        cur = frames[i]
        fb, ok, maps = flow_pair(cur, frames[i - 1])
        gm[i] = float(np.hypot(np.median(fb[..., 0]), np.median(fb[..., 1])))
        hist = warp(acc, maps) if mc else acc
        if strength > 0:
            d = np.sqrt(((cur - hist) ** 2).sum(-1))
            a = np.clip((d - n0) / (n1 - n0), 0, 1) * (1 - amin) + amin
            a = np.where(ok | (not mc), a, 1.0)[..., None]
            acc = hist + a * (cur - hist)
        else:
            acc = cur.copy()
        out.append(acc.astype(np.float32))
    clip.lab = out
    clip.gmotion = gm
    return clip


# ------------------------------------------------------------------------------------------------ conform to 24 fps
@dataclass
class Conform:
    timeline: list  # output frame -> drawing index
    drawings: list  # drawing index -> source frame index
    on: list  # output frame -> hold (1, 2, 3)


def conform(clip: Clip, *, duration=None, on='2', motion_on1=0.9, min_seg=6, fps=FPS) -> Conform:
    """Sample the source on the 24 fps grid with held drawings. on='1'|'2'|'3' or 'auto' (2s, but 1s through fast
    camera moves: a pan on 2s judders at 4x). Nearest source frame, never a blend (blends ghost in pixel art)."""
    times = clip.times
    dur = duration if duration is not None else float(times[-1]) + (1.0 / max(1.0, clip.info.fps or fps))
    n_out = max(1, int(round(dur * fps)))
    if on == 'auto':
        # global motion in native px per OUTPUT frame, sampled at each output time
        src_dt = np.diff(times, prepend=times[0] - (1 / max(1.0, clip.info.fps or fps)))
        src_dt = np.where(src_dt <= 0, 1 / fps, src_dt)
        speed = (clip.gmotion if clip.gmotion is not None else np.zeros(len(times))) / src_dt / fps
        fast = np.array([speed[min(len(times) - 1, int(np.searchsorted(times, k / fps)))] > motion_on1 for k in range(n_out)])
        # no flicker between modes: a mode lasts at least min_seg frames (short runs join their neighbours)
        seg = fast.copy()
        k = 0
        while k < n_out:
            j = k
            while j < n_out and fast[j] == fast[k]:
                j += 1
            if j - k < min_seg and k > 0:
                seg[k:j] = seg[k - 1]
            k = j
        holds = np.where(seg, 1, 2)
    else:
        holds = np.full(n_out, int(on))
    timeline, drawings, key_src = [], [], []
    k = 0
    last_src = None
    while k < n_out:
        hold = int(holds[k])
        t = k / fps
        si = int(np.clip(np.searchsorted(times, t - 1e-6), 0, len(times) - 1))
        if si > 0 and abs(times[si - 1] - t) <= abs(times[si] - t):
            si -= 1
        if si != last_src:
            drawings.append(si)
            last_src = si
        for _ in range(hold):
            if k >= n_out:
                break
            timeline.append(len(drawings) - 1)
            k += 1
    return Conform(timeline, drawings, [int(h) for h in holds])


# ------------------------------------------------------------------------------------------------ tone
def lab_stats(frames: list, sample=4):
    L = np.concatenate([f[::sample, ::sample, 0].ravel() for f in frames])
    ab = np.concatenate([f[::sample, ::sample, 1:].reshape(-1, 2) for f in frames])
    return np.percentile(L, [1, 25, 50, 75, 99]), ab.mean(0), np.sqrt((ab ** 2).sum(-1)).mean()


def tone_map(frames: list, *, exposure=0.0, sat=1.0, lift=0.0, match_ref: np.ndarray | None = None, match_amt=1.0,
             match_head: list | None = None, match_chroma=False):
    """Clip-level tone (constant over the clip, so it can't flicker): exposure in stops (linear light), OKLab chroma
    gain, L lift, and optional matching to a reference still (the keyframe the clip was conditioned on):
    L by 5 percentiles + the a/b mean (+ chroma scale with match_chroma). The source statistics come from
    `match_head` (the clip's first ~0.5 s, which an image-to-video model starts from the keyframe itself), so the
    correction captures the model's colour transform, not the content that enters later."""
    out = []
    if match_ref is not None:
        pS, abS, cS = lab_stats(match_head or frames)
        pR, abR, cR = lab_stats([match_ref], 1)
        pS = np.maximum.accumulate(pS + np.arange(5) * 1e-6)
    for f in frames:
        g = f.copy()
        if exposure:
            lin = oklab_to_lin(g) * (2.0 ** exposure)
            g = lin_to_oklab(np.maximum(lin, 0))
        if match_ref is not None:
            Lm = np.interp(g[..., 0], pS, pR, left=None, right=None)
            # outside the matched range: carry the end slopes (no clipping of highlights / deep shadows)
            lo, hi = g[..., 0] < pS[0], g[..., 0] > pS[-1]
            Lm = np.where(lo, pR[0] + (g[..., 0] - pS[0]), np.where(hi, pR[-1] + (g[..., 0] - pS[-1]), Lm))
            g[..., 0] = g[..., 0] * (1 - match_amt) + Lm * match_amt
            k = (cR / max(cS, 1e-4)) ** match_amt if match_chroma else 1.0
            g[..., 1:] = (g[..., 1:] - abS * match_amt) * k + abR * match_amt
        if sat != 1.0:
            g[..., 1:] *= sat
        if lift:
            g[..., 0] = lift + (1 - lift) * g[..., 0]
        out.append(g.astype(np.float32))
    return out
