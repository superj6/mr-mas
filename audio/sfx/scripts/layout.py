"""Place the SFX board on the 30 s intro grid (720 frames @ 24 fps) and build audition reels.

Outputs (in audio/sfx/):
  intro/sfx_intro_stem.wav       SFX-only stem, every sound at its frame with its manifest mixDb (sits under a -14 LUFS music mix)
  intro/sfx_intro_preview.wav/.mp3  same, normalized to -14 LUFS / -1 dBTP for listening
  intro/sfx_intro_cues.json      the placement list (frame, file, gain) = an edit decision list for Remotion <Audio>
  intro/sfx_intro_{chip,band}_preview.mp3   the same layout using the 8-bit / band variants where they exist
  reel/reel_{hybrid,chip,band}.mp3 + reel_index.json   every sound back to back for quick auditioning
"""
from __future__ import annotations

import json
import os
import sys

import numpy as np
import soundfile as sf

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from dsp import (SR, FPS, ROOT, stereo, n_of, db, fade, normalize, measure, write_wav, write_mp3, lowpass,  # noqa: E402
                 compress, pb, lufs_integrated, true_peak_db)

STEM_TRIM = -2.5  # whole-stem trim so the SFX bus sits ~8-9 LU under a -14 LUFS music mix

INTRO = os.path.join(ROOT, "intro")
REEL = os.path.join(ROOT, "reel")
TOTAL = 720

# (id, frame, extra_gain_db, options)   options: cut=frame (hard stop w/ fade), fin=sec, fout=sec, bus='unmuted'
CUES = [
    ("room_drone", 0, 0, dict(fin=1.2, cut=120, fout=0.25)),
    ("server_hum", 0, 0, dict(fin=0.8, cut=120, fout=0.2)),
    ("typing_soft", 4, -2, dict(cut=64, fout=0.3)),
    ("orb_servo", 97, 0, {}),
    ("orb_scan_sweep", 100, 0, {}),
    ("post_click", 112, 0, {}),
    ("reverse_swell_1beat", 120, 0, dict(anchor="end")),
    ("alert_bonk", 150, 0, {}),
    ("dialog_ok_click", 165, 0, {}),
    ("render_front_sweep", 168, 0, {}),
    ("tape_start", 168, -2, {}),
    ("collar_pop_Ab4", 180, 0, {}),
    ("collar_pop_C5", 187, 0, {}),
    ("collar_pop_F5", 202, 0, {}),
    ("tape_spinup", 225, 0, {}),
    ("keycap_popcorn", 225, 0, {}),
    ("keyboard_roll", 240, 0, dict(anchor="end")),
    ("camera_shutter", 240, 0, {}),
    ("freeze_hit_F", 240, 0, {}),
    ("flame_whoomph", 285, 0, {}),
    ("camera_shutter", 300, 0, {}),
    ("freeze_hit_Db", 300, 0, {}),
    ("klaxon", 345, 0, {}),
    ("steam_hiss", 345, 0, {}),
    ("vault_chime_triple", 347, 0, {}),
    ("paper_flutter", 350, 0, {}),
    ("camera_shutter", 360, 0, {}),
    ("freeze_hit_Bb", 360, 0, {}),
    ("paper_whip", 401, 0, {}),
    ("ceiling_burst", 405, 0, {}),
    ("rocket_roar", 405, 0, {}),
    ("camera_shutter", 420, 0, {}),
    ("freeze_hit_C", 420, 0, {}),
    ("landing_thunk", 420, 0, {}),
    ("rubber_stamp_C", 435, 0, {}),
    ("neon_buzz", 465, 0, dict(fin=0.1, cut=495, fout=0.05, loop=True)),
    ("letter_clunk", 473, 0, dict(anchor="hit")),
    ("neon_ignite", 474, 0, {}),
    ("shockwave_bloom", 480, 0, {}),
    ("odometer_ratchet", 480, 0, {}),
    ("room_tone", 495, 0, dict(cut=512, fout=0.1, bus="unmuted", loop=True)),
    ("piano_fired_F4", 495, 0, dict(bus="unmuted")),
    ("glyph_dissolve", 499, 0, dict(bus="unmuted")),
    ("hourglass_shatter", 518, 0, {}),
    ("heart_gliss", 525, 0, {}),
    ("tower_pluck_1_F4", 540, 0, {}), ("tower_pop", 540, 0, {}),
    ("tower_pluck_2_F4", 555, 0, {}), ("tower_pop", 555, -2, {}),
    ("siren_whoop_F", 555, 0, {}),
    ("tower_pluck_3_F4", 570, 0, {}), ("tower_pop", 570, -2, {}),
    ("drip_clack", 570, 0, {}),
    ("tower_pluck_4_F4", 585, 0, {}), ("tower_pop", 585, -2, {}),
    ("ka_ching", 585, 0, {}),
    ("tower_pluck_5_G4", 600, 0, {}), ("tower_pop", 600, 0, {}), ("tower_pop", 603, -4, {}),
    ("tower_pluck_6_Ab4", 615, 0, {}), ("tower_pop", 615, -3, {}),
    ("plop_water", 615, 0, {}),
    ("tower_pluck_7_C5", 622, 0, {}), ("tower_pop", 622, 0, {}),
    ("reverse_swell_2beat", 630, -4, dict(anchor="end")),
    ("whoosh_pullback", 690, 0, {}),
    ("room_drone", 690, 0, dict(fin=0.3, cut=720, fout=0.5)),
    ("glyph_blink", 705, 0, dict(anchor="hit")),
    ("bell_ding_F6", 705, 0, {}),
]
MUTE = (495, 510)  # 'the music is fired': main bus muted with 10 ms fades


def load_manifest():
    with open(os.path.join(ROOT, "manifest.json")) as fh:
        man = json.load(fh)
    return {r["id"]: r for r in man if r.get("category") != "voice-kit"}


def read(path):
    x, sr = sf.read(os.path.join(ROOT, path), always_2d=True)
    assert sr == SR
    return x.astype(np.float64)


def build_intro(flavor="hybrid"):
    man = load_manifest()
    N = n_of(TOTAL / FPS)
    main = np.zeros((N, 2))
    unm = np.zeros((N, 2))
    cues = []
    for sid, fr, g, opt in CUES:
        use_id = sid
        if flavor != "hybrid" and f"{sid}--{flavor}" in man:
            use_id = f"{sid}--{flavor}"
        r = man[use_id]
        x = read(r["file"])
        if opt.get("loop"):
            span = (opt.get("cut", TOTAL) - fr) / FPS + 0.2
            reps = int(np.ceil(span * SR / len(x))) + 1
            x = np.tile(x, (reps, 1))
        anchor = opt.get("anchor", "start")
        t = fr / FPS
        if anchor == "end":
            t -= len(x) / SR
        elif anchor == "hit":
            t -= float(r.get("syncOffset", 0))
        if "cut" in opt:
            keep = max(0, n_of(opt["cut"] / FPS - t))
            x = x[:keep]
        x = fade(x, opt.get("fin", 0.0), opt.get("fout", 0.0) if "cut" in opt or opt.get("fout") else 0.0)
        gain = r["mixDb"] + g + STEM_TRIM
        bus = unm if opt.get("bus") == "unmuted" else main
        o = n_of(t)
        if o < 0:
            x, o = x[-o:], 0
        m = min(len(x), N - o)
        bus[o:o + m] += x[:m] * db(gain)
        cues.append(dict(id=use_id, frame=fr, startFrame=round(t * FPS, 2), startSec=round(t, 4), file=r["file"],
                         gainDb=round(gain, 1), anchor=anchor, bus=opt.get("bus", "main"),
                         cutFrame=opt.get("cut"), durationSec=round(len(x) / SR, 3)))
    # fire the main bus
    a, b = n_of(MUTE[0] / FPS), n_of(MUTE[1] / FPS)
    k = n_of(0.01)
    env = np.ones(N)
    env[a:b] = 0
    env[a - k:a] = np.linspace(1, 0, k)
    env[b:b + k] = np.linspace(0, 1, k)
    stem = main * env[:, None] + unm
    stem[-n_of(0.02):] *= np.linspace(1, 0, n_of(0.02))[:, None]
    return stem, cues


def peak_limit(x, ceiling_db=-1.5, hold=0.02, smooth=0.01):
    """Look-ahead brickwall (numpy): gain = moving-average of a centred min-filter of the required gain."""
    from scipy.ndimage import minimum_filter1d, uniform_filter1d
    c = db(ceiling_db)
    pk = np.abs(x).max(axis=1)
    g = np.minimum(1.0, c / np.maximum(pk, 1e-12))
    g = minimum_filter1d(g, size=2 * n_of(hold) + 1)
    g = uniform_filter1d(g, size=n_of(smooth) | 1)
    return x * g[:, None]


def master(x, target=-14.0):
    """Listening-preview bus: gentle glue compression, then gain + look-ahead limiter to target LUFS / -1 dBTP."""
    y0 = compress(x, thresh=-26, ratio=2.0, attack=12, release=160)
    pre = target - lufs_integrated(y0)
    for _ in range(4):
        y = peak_limit(y0 * db(pre), -1.5)
        tp = true_peak_db(y)
        if tp > -1.0:
            y = y * db(-1.0 - tp)
        err = target - lufs_integrated(y)
        if abs(err) < 0.15:
            break
        pre += err
    return y


def main():
    os.makedirs(INTRO, exist_ok=True)
    report = {}
    for flavor in ("hybrid", "chip", "band"):
        stem, cues = build_intro(flavor)
        peak = np.abs(stem).max()
        if flavor == "hybrid":
            safe = stem * (db(-1.0) / peak if peak > db(-1.0) else 1.0)
            write_wav(os.path.join(INTRO, "sfx_intro_stem.wav"), safe)
            with open(os.path.join(INTRO, "sfx_intro_cues.json"), "w") as fh:
                json.dump(dict(fps=FPS, frames=TOTAL, bpm=96, muteMainBus=MUTE, cues=cues), fh, indent=1)
            report["stem"] = measure(safe)
        prev = master(stem)
        name = "sfx_intro_preview" if flavor == "hybrid" else f"sfx_intro_{flavor}_preview"
        p = os.path.join(INTRO, name + ".wav")
        write_wav(p, prev)
        write_mp3(p, p[:-4] + ".mp3", 256)
        if flavor != "hybrid":
            os.remove(p)
        report[name] = measure(prev)
    build_reels()
    print(json.dumps(report, indent=1))


def build_reels():
    man = load_manifest()
    os.makedirs(REEL, exist_ok=True)
    index = {}
    for flavor in ("hybrid", "chip", "band"):
        parts, t, idx = [], 0.0, []
        for sid, r in man.items():
            if r["category"] == "voice" and flavor != "hybrid" and r["flavor"] != flavor:
                continue
            if flavor == "hybrid" and r["flavor"] not in ("hybrid",):
                continue
            if flavor != "hybrid":
                if r["flavor"] != flavor:
                    continue
            x = read(r["file"])
            if r["loop"]:
                x = fade(x[:n_of(4.0)], 0.05, 0.5)
            parts.append(x)
            idx.append(dict(id=sid, startSec=round(t, 2)))
            gap = np.zeros((n_of(0.6), 2))
            parts.append(gap)
            t += len(x) / SR + 0.6
        if not parts:
            continue
        reel = np.concatenate(parts)
        reel, _ = normalize(reel, -14.0, -1.0, "integrated")
        p = os.path.join(REEL, f"reel_{flavor}.wav")
        write_wav(p, reel)
        write_mp3(p, p[:-4] + ".mp3", 192)
        os.remove(p)
        index[flavor] = idx
    with open(os.path.join(REEL, "reel_index.json"), "w") as fh:
        json.dump(index, fh, indent=1)


if __name__ == "__main__":
    main()
