"""Render the MR. MAS SFX board: WAV masters (48k/24-bit), MP3 previews, manifest.json, QA sheets.

usage: build.py [--only PREFIX,...] [--no-mp3] [--no-qa]
"""
from __future__ import annotations

import argparse
import json
import math
import os
import sys
import time
import zlib
import struct

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import dsp  # noqa: E402
from dsp import SR, ROOT, stereo, highpass, normalize, measure, write_wav, write_mp3, trim_tail, fade  # noqa: E402
from registry import REG  # noqa: E402
import sounds_1, sounds_2, sounds_3  # noqa: E402,F401
import blips  # noqa: E402,F401

ABOUT = {
    "show": "MR. MAS", "board": "SFX board + character voice blips (intro + pixel world)", "made": "2026-09-25",
    "generator": "audio/sfx/scripts/build.py (render all) + layout.py (intro stem/previews/reels)",
    "format": {"master": "WAV 48 kHz / 24-bit stereo", "preview": "MP3 256 kb/s (blip kits 192 kb/s)"},
    "grid": {"fps": 24, "bpm": 96, "framesPerBeat": 15, "introFrames": 720, "key": "F minor"},
    "levels": "Each master is normalized to -14 LUFS (integrated if >= 2 s, else max momentary; voice lines -16) "
              "with a -1 dBTP ceiling, so transient sounds land below -14. 'mixDb' is the suggested gain for the intro mix; "
              "intro/sfx_intro_stem.wav applies it (plus a -2.5 dB stem trim).",
    "flavors": {"hybrid": "default: acoustic/orchestral/jazz body with a quiet 8-bit shadow",
                "chip": "8-bit forward (pulse/triangle/LFSR noise, 60 Hz stepped envelopes)",
                "band": "piano / orchestral / big-band instruments only (VSCO 2 CE, GeneralUser GS)"},
    "anchor": {"start": "file start sits on the cue frame", "end": "file END lands on the cue frame (swells, rolls)",
               "hit": "transient is at syncOffset seconds into the file; place the file at frame - syncOffset*24"},
    "intro": {"stem": "intro/sfx_intro_stem.wav", "preview": "intro/sfx_intro_preview.mp3",
              "previewChip": "intro/sfx_intro_chip_preview.mp3", "previewBand": "intro/sfx_intro_band_preview.mp3",
              "cues": "intro/sfx_intro_cues.json"},
    "reels": "reel/reel_{hybrid,chip,band}.mp3 with reel/reel_index.json start times",
    "manifest": "manifest.json = flat array of every file (sounds, variants, voice lines, blip-kit one-shots); board.json = this block + voiceLines + blipKits index",
    "loops": "Loops (loop=true) are sample-seamless in the WAV masters only; MP3 previews add encoder padding.",
    "qa": "qa/spectro_*.png (log-frequency spectrogram + envelope per sound; index in .txt)",
    "licenses": "LICENSES.md (CC0 VSCO 2 CE samples, GeneralUser GS, procedural originals; no TTS/voice cloning)",
}

WAV_DIR = os.path.join(ROOT, "wav")
MP3_DIR = os.path.join(ROOT, "mp3")
QA_DIR = os.path.join(ROOT, "qa")


def dominant_pitch(x) -> str | None:
    """Strongest spectral peak (for tuning QA on pitched entries)."""
    m = dsp.mono(x)
    k = int(np.argmax(np.abs(m)))
    seg = m[k:k + int(0.5 * SR)]
    if len(seg) < 2048:
        seg = m[:int(0.5 * SR)]
    N = 1 << 18
    X = np.abs(np.fft.rfft(seg * np.hanning(len(seg)), N))
    f = np.fft.rfftfreq(N, 1 / SR)
    msk = (f > 35) & (f < 5000)
    pk = f[msk][np.argmax(X[msk])]
    mm = 69 + 12 * math.log2(pk / 440)
    return f"{dsp.note_name(mm)} {int(round((mm - round(mm)) * 100)):+d}c ({pk:.1f} Hz)"


def png_write(path, img):
    """img: uint8 HxWx3."""
    h, w, _ = img.shape
    raw = b"".join(b"\x00" + img[y].tobytes() for y in range(h))
    def chunk(t, d):
        c = struct.pack(">I", len(d)) + t + d
        return c + struct.pack(">I", zlib.crc32(t + d) & 0xFFFFFFFF)
    data = b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, 2, 0, 0, 0)) + \
        chunk(b"IDAT", zlib.compress(raw, 6)) + chunk(b"IEND", b"")
    with open(path, "wb") as fh:
        fh.write(data)


def spectro_tile(x, W=300, H=110, max_dur=3.0):
    m = dsp.mono(x)[:int(max_dur * SR)]
    nfft, hop = 1024, max(64, len(m) // W)
    frames = []
    win = np.hanning(nfft)
    for i in range(W):
        s = i * hop
        seg = m[s:s + nfft]
        if len(seg) < nfft:
            seg = np.pad(seg, (0, nfft - len(seg)))
        frames.append(np.abs(np.fft.rfft(seg * win)))
    S = np.array(frames).T  # bins x W
    # log-frequency rows 40 Hz..20 kHz
    f = np.fft.rfftfreq(nfft, 1 / SR)
    rows = np.geomspace(40, 20000, H)[::-1]
    idx = np.clip(np.searchsorted(f, rows), 1, len(f) - 1)
    S = S[idx]
    Sdb = 20 * np.log10(S / (S.max() + 1e-12) + 1e-9)
    v = np.clip((Sdb + 80) / 80, 0, 1)
    img = np.zeros((H + 30, W, 3), np.uint8)
    img[:H, :, 0] = (255 * np.clip(v * 1.6 - 0.3, 0, 1)).astype(np.uint8)
    img[:H, :, 1] = (255 * np.clip(v * 1.4 - 0.6, 0, 1)).astype(np.uint8)
    img[:H, :, 2] = (255 * np.clip(v * 0.9, 0, 1) ** 1.5).astype(np.uint8)
    # waveform strip
    env = np.array([np.abs(m[i * hop:i * hop + hop]).max() if i * hop < len(m) else 0 for i in range(W)])
    env = env / (np.abs(m).max() + 1e-12)
    for i, e in enumerate(env):
        k = int(e * 13)
        img[H + 15 - k:H + 15 + k + 1, i, :] = (90, 200, 220)
    # 1-second ticks
    for s in range(1, int(max_dur) + 1):
        c = int(s * SR / hop)
        if c < W:
            img[H:H + 30, c, :] = (255, 255, 255)
    return img


def render_one(e, mp3=True):
    t0 = time.time()
    x = e["fn"]()
    x = stereo(np.asarray(x, dtype=np.float64))
    if not np.all(np.isfinite(x)):
        raise ValueError(f"{e['id']}: non-finite samples")
    if e["loop"]:
        x = dsp.circular(lambda z: highpass(z, 18, 2), x)  # keep loops sample-seamless
    else:
        x = highpass(x, 18, 2)  # DC / infrasonic
    if not e["loop"]:
        x = trim_tail(x, -72, 0.03)
    y, info = normalize(x, e["target"], -1.0, e["norm"])
    wav = os.path.join(WAV_DIR, e["id"] + ".wav")
    write_wav(wav, y)
    rec = {k: e[k] for k in ("id", "description", "pitch", "useAt", "category", "flavor", "variantOf",
                             "loop", "frames", "anchor")}
    rec["file"] = os.path.relpath(wav, ROOT)
    if mp3:
        mp3p = os.path.join(MP3_DIR, e["id"] + ".mp3")
        write_mp3(wav, mp3p, 256)
        rec["preview"] = os.path.relpath(mp3p, ROOT)
    rec["duration"] = round(len(y) / SR, 3)
    rec["durationFrames"] = round(len(y) / SR * 24, 1)
    rec["levels"] = measure(y)
    rec["normGainDb"] = info["gainDb"]
    rec["normMode"] = info["mode"]
    rec["mixDb"] = e["mixDb"]
    if e["sync"] is not None:
        rec["syncOffset"] = e["sync"]
    if e["pitch"]:
        rec["measuredPeak"] = dominant_pitch(y)
    rec["_render_s"] = round(time.time() - t0, 2)
    return rec, y


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", default="")
    ap.add_argument("--no-mp3", action="store_true")
    ap.add_argument("--no-qa", action="store_true")
    a = ap.parse_args()
    only = [s for s in a.only.split(",") if s]
    man_path = os.path.join(ROOT, "manifest.json")      # top-level array: [{id, file, description, pitch, duration, useAt, ...}]
    board_path = os.path.join(ROOT, "board.json")        # board metadata: about, voice lines, blip-kit index
    old = {}
    if os.path.exists(man_path) and only:
        with open(man_path) as fh:
            prev = json.load(fh)
            for r in (prev["sounds"] if isinstance(prev, dict) else prev):
                old[r["id"]] = r
    recs, tiles = [], []
    ids = [e["id"] for e in REG]
    dup = {i for i in ids if ids.count(i) > 1}
    if dup:
        raise SystemExit(f"duplicate ids: {dup}")
    for e in REG:
        if only and not any(e["id"].startswith(p) for p in only):
            if e["id"] in old:
                recs.append(old[e["id"]])
            continue
        rec, y = render_one(e, not a.no_mp3)
        recs.append(rec)
        tiles.append((e["id"], y))
        print(f"{rec['id']:<34} {rec['duration']:>6.2f}s  I={rec['levels']['lufsIntegrated']:>6}  "
              f"Mmax={rec['levels']['lufsMomentaryMax']:>6}  TP={rec['levels']['truePeakDb']:>6}  "
              f"{rec.get('measuredPeak') or ''}  [{rec['_render_s']}s]", flush=True)
    for r in recs:
        r.pop("_render_s", None)
    if any(r["id"].startswith("voice_") for r in recs if r["id"] in {t[0] for t in tiles}):
        blips.write_timings()
    kit_recs = None
    if not only or any(p.startswith(("blip", "voice")) for p in only):
        kit_recs = blips.render_kits(not a.no_mp3)
    order = {e["id"]: i for i, e in enumerate(REG)}
    recs.sort(key=lambda r: order.get(r["id"], 1e9))
    if kit_recs is None:
        kit_recs = [r for r in old.values() if r.get("category") == "voice-kit"]
    board = {}
    if os.path.exists(board_path):
        with open(board_path) as fh:
            board = json.load(fh)
    board.update(blips.MANIFEST_EXTRA)
    board["about"] = ABOUT
    with open(man_path, "w") as fh:
        json.dump(recs + kit_recs, fh, indent=1, ensure_ascii=False)
    with open(board_path, "w") as fh:
        json.dump(board, fh, indent=1, ensure_ascii=False)
    if not a.no_qa and tiles:
        os.makedirs(QA_DIR, exist_ok=True)
        cols = 4
        for page in range(0, len(tiles), 24):
            chunk = tiles[page:page + 24]
            rows = math.ceil(len(chunk) / cols)
            th, tw = 140 + 14, 300
            sheet = np.full((rows * th, cols * tw + (cols - 1) * 6, 3), 18, np.uint8)
            for i, (name, y) in enumerate(chunk):
                r_, c_ = divmod(i, cols)
                tile = spectro_tile(y)
                sheet[r_ * th + 14:r_ * th + 14 + tile.shape[0], c_ * (tw + 6):c_ * (tw + 6) + tw] = tile
            png_write(os.path.join(QA_DIR, f"spectro_{page // 24 + 1:02d}.png"), sheet)
            with open(os.path.join(QA_DIR, f"spectro_{page // 24 + 1:02d}.txt"), "w") as fh:
                fh.write("\n".join(f"{i // cols},{i % cols}: {n}" for i, (n, _) in enumerate(chunk)))


if __name__ == "__main__":
    main()
