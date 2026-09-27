#!/usr/bin/env python3
"""assemble.py - Ep1 v3, the v3-assemble pass (PLAN.md track F): the full episode film, one per voice variant.

  audio/.venv-casting/bin/python show/episodes/ep01/production/full-v3/assembly/tools/assemble.py kokoro|el [--dry]
  (run it through ops/heavy.sh: the encode is heavy)

The order is the v3 manifest's: cold open -> intro -> the filename card -> Acts One to Four -> tag -> the Orb outro.
  PICTURE  each chapter's own 1080p render, decoded and concatenated frame for frame (the concat filter; nothing is
           trimmed, padded or shifted), re-encoded once: H.264 High, CRF 18, -tune animation, 24 fps, a keyframe on
           every chapter's first frame. Kokoro: out/ep01/full-v3/picture/<seg>.mp4; EL: picture-el/<seg>.mp4 (the card
           is out/ep01/full-v3/picture/card.mp4 in both; the voices don't touch it).
  SOUND    one 48 kHz stereo track built sample-exact in numpy, each chapter exactly its picture's length:
           the story segments and the card play the v3-sound pass's final mixes (out/ep01/full-v3/mix[-el]/<seg>-mix.wav)
           as they are, back to back (that pass built them on one clock, seams included: they stay bit-exact);
           the intro and the outro play their own masters at the manifest's gain (-3 dB, -1 dB).
           Seams (picture never moves): where a join isn't sample-continuous a 3 ms de-click; at intro -> card, where
           the intro's ring-out dies into the card's room tone, the card's room is led in under the intro's last 0.3 s
           (its own first 0.3 s, time-reversed, equal-power fade-in), so the room is there when the ring-out ends.
           AAC-LC 256 kb/s, 48 kHz.
  CHAPTERS the nine chapters, titled, from an ffconcat chapter list (the bundled ffmpeg has no ffmetadata demuxer).
Writes out/ep01/full-v3/ep01-v3[-el].mp4 and assembly/<variant>-assembly.json (every input, its length and md5 of
its head, the seams, the chapter table). The episode WAV is a scratch intermediate and is deleted after the mux.
"""
from __future__ import annotations

import hashlib
import json
import os
import subprocess
import sys
import time

import numpy as np
import soundfile as sf

ROOT = "/home/jgon/project/art/mrmas"
FFD = f"{ROOT}/studio/node_modules/@remotion/compositor-linux-x64-gnu"
ENV = {**os.environ, "LD_LIBRARY_PATH": FFD}
FF, FP = f"{FFD}/ffmpeg", f"{FFD}/ffprobe"
ASM = f"{ROOT}/show/episodes/ep01/production/full-v3/assembly"
SCR = "/tmp/claude-1000/-home-jgon-project-art-mrmas/a5e7723c-6ab4-4824-a1ed-8e367fdb82e5/scratchpad/v3-assemble"
SR, FPS, SPF = 48000, 24, 2000
X264 = ["-c:v", "libx264", "-preset", "medium", "-crf", "18", "-tune", "animation", "-pix_fmt", "yuv420p", "-profile:v", "high",
        "-g", "48", "-threads", "6"]

TITLES = {"coldopen": "Cold open", "intro": "Intro", "card": "ep1.0_research_preview.md", "act1": "Act One · research preview",
          "act2": "Act Two · the regulate-me tour", "act3": "Act Three · verified: human", "act4": "Act Four · the blip, told twice",
          "tag": "Tag · december", "outro": "Outro · credits"}


def probe_frames(path):
    out = subprocess.run([FP, "-v", "error", "-select_streams", "v:0", "-count_packets", "-show_entries",
                          "stream=nb_read_packets,width,height,r_frame_rate,pix_fmt", "-of", "json", path],
                         check=True, capture_output=True, text=True, env=ENV).stdout
    s = json.loads(out)["streams"][0]
    return int(s["nb_read_packets"]), s


def head_md5(path, n=1 << 20):
    h = hashlib.md5()
    with open(path, "rb") as f:
        h.update(f.read(n))
    return h.hexdigest()[:12]


def chapters(variant):
    man = json.load(open(f"{ROOT}/show/reel/ep01-v3{'-el' if variant == 'el' else ''}/ep01-v3{'-el' if variant == 'el' else ''}.manifest.json"))
    byid = {c["id"]: c for c in man["chapters"]}
    pic = f"{ROOT}/out/ep01/full-v3/{'picture-el' if variant == 'el' else 'picture'}"
    mix = f"{ROOT}/out/ep01/full-v3/{'mix-el' if variant == 'el' else 'mix'}"
    out = []
    for cid in ["coldopen", "intro", "card", "act1", "act2", "act3", "act4", "tag", "outro"]:
        c = byid[cid]
        if c.get("kind") == "video":
            out.append(dict(id=cid, video=f"{ROOT}/{c['src']}", audio=f"{ROOT}/{c['audio']['src']}", gain_db=float(c["audio"].get("gain", 0)), own=True))
        elif cid == "card":
            out.append(dict(id=cid, video=f"{ROOT}/out/ep01/full-v3/picture/card.mp4", audio=f"{mix}/card-mix.wav", gain_db=0.0, own=False))
        else:
            out.append(dict(id=cid, video=f"{pic}/{cid}.mp4", audio=f"{mix}/{cid}-mix.wav", gain_db=0.0, own=False))
    return out


def rms_db(x):
    return float(20 * np.log10(np.sqrt(np.mean(np.square(x))) + 1e-12))


def main(variant, dry=False):
    t0 = time.time()
    CH = chapters(variant)
    rep = {"variant": variant, "built": time.strftime("%Y-%m-%d %H:%M:%S"), "chapters": [], "seams": []}
    tracks = []
    f_at = 0
    for c in CH:
        nf, s = probe_frames(c["video"])
        assert (s["width"], s["height"], s["r_frame_rate"]) == (1920, 1080, "24/1"), (c["id"], s)
        a, sr = sf.read(c["audio"], dtype="float64", always_2d=True)
        assert sr == SR and a.shape[1] == 2, (c["id"], sr, a.shape)
        want = nf * SPF
        if len(a) != want:
            raise SystemExit(f"{c['id']}: the audio is {len(a)} samples, the picture {nf} frames = {want} samples: refusing to pad or trim")
        a = a * 10 ** (c["gain_db"] / 20)
        tracks.append(a)
        rep["chapters"].append(dict(id=c["id"], title=TITLES[c["id"]], video=os.path.relpath(c["video"], ROOT), audio=os.path.relpath(c["audio"], ROOT),
                                    gain_db=c["gain_db"], frames=nf, start_frame=f_at, start_s=round(f_at / FPS, 4), seconds=round(nf / FPS, 4),
                                    video_head_md5=head_md5(c["video"]), audio_head_md5=head_md5(c["audio"]),
                                    audio_mtime=time.strftime("%H:%M:%S", time.localtime(os.path.getmtime(c["audio"])))))
        f_at += nf
    total_f = f_at
    # --- the seams (outgoing tail, incoming head), before any treatment
    fade = int(0.003 * SR)
    for i in range(len(CH) - 1):
        A, B = tracks[i], tracks[i + 1]
        jump = float(np.abs(B[0] - A[-1]).max())
        seam = dict(join=f"{CH[i]['id']} -> {CH[i + 1]['id']}", at_frame=rep["chapters"][i + 1]["start_frame"],
                    sample_jump=round(jump, 5), tail200_dbfs=round(rms_db(A[-int(0.2 * SR):]), 1), head200_dbfs=round(rms_db(B[:int(0.2 * SR)]), 1))
        seam["step_db"] = round(seam["head200_dbfs"] - seam["tail200_dbfs"], 1)
        own_edge = CH[i]["own"] or CH[i + 1]["own"]
        if own_edge and jump > 0.01:
            r = np.linspace(0, 1, fade)[:, None]
            A[-fade:] *= r[::-1]
            B[:fade] *= r
            seam["treatment"] = "3 ms de-click (fade out / fade in)"
        else:
            seam["treatment"] = "none (sample-continuous" + (")" if not own_edge else ", jump under 0.01)")
        if CH[i]["id"] == "intro" and CH[i + 1]["id"] == "card":
            n = int(0.3 * SR)
            lead = B[:n][::-1].copy()                      # the card's own room tone, time-reversed: it ends on B[0]
            g = np.sin(np.linspace(0, np.pi / 2, n))[:, None]  # equal-power in
            A[-n:] += lead * g
            seam["treatment"] = "the card's room led in under the intro's last 0.3 s (its first 0.3 s reversed, equal-power in); " + seam["treatment"]
            seam["tail200_after_dbfs"] = round(rms_db(A[-int(0.2 * SR):]), 1)
        rep["seams"].append(seam)
    ep = np.concatenate(tracks)
    assert len(ep) == total_f * SPF
    peak = float(np.abs(ep).max())
    rep["total_frames"], rep["total_s"], rep["sample_peak_dbfs"] = total_f, round(total_f / FPS, 4), round(20 * np.log10(peak), 2)
    zero = np.abs(ep).max(axis=1) == 0
    runs, cur, best = [], 0, 0
    for z in zero:
        cur = cur + 1 if z else 0
        best = max(best, cur)
    rep["longest_digital_zero_run_ms"] = round(best / SR * 1000, 2)
    out = f"{ROOT}/out/ep01/full-v3/ep01-v3{'-el' if variant == 'el' else ''}.mp4"
    rep["film"] = os.path.relpath(out, ROOT)
    json.dump(rep, open(f"{ASM}/{variant}-assembly.json", "w"), indent=1, ensure_ascii=False)
    print(json.dumps({k: rep[k] for k in ("total_frames", "total_s", "sample_peak_dbfs", "longest_digital_zero_run_ms")}), flush=True)
    for s in rep["seams"]:
        print("  seam", s, flush=True)
    if dry:
        return
    os.makedirs(SCR, exist_ok=True)
    wav = f"{SCR}/episode-{variant}.wav"
    sf.write(wav, ep, SR, subtype="PCM_24")
    del ep, tracks
    lst = f"{SCR}/episode-{variant}.ffconcat"
    with open(lst, "w") as f:
        f.write("ffconcat version 1.0\n")
        for i, c in enumerate(rep["chapters"]):
            f.write(f"chapter {i} {c['start_frame'] / FPS:.6f} {(c['start_frame'] + c['frames']) / FPS:.6f}\n")
        f.write(f"file '{wav}'\n")
    cmd = [FF, "-hide_banner", "-y", "-v", "error", "-stats"]
    for c in CH:
        cmd += ["-i", c["video"]]
    cmd += ["-f", "concat", "-safe", "0", "-i", lst]
    fc = "".join(f"[{i}:v]format=yuv420p[v{i}];" for i in range(len(CH))) + "".join(f"[v{i}]" for i in range(len(CH))) + f"concat=n={len(CH)}:v=1:a=0[v]"
    keys = ",".join(f"{c['start_frame'] / FPS:.6f}" for c in rep["chapters"])
    meta = []
    for i, c in enumerate(rep["chapters"]):
        meta += [f"-metadata:c:{i}", f"title={c['title']}"]
    cmd += ["-filter_complex", fc, "-map", "[v]", "-map", f"{len(CH)}:a", "-map_chapters", str(len(CH)), *meta,
            "-map_metadata", "-1", "-metadata", f"title=MR. MAS · ep1.0_research_preview.md (v3{', ElevenLabs voices' if variant == 'el' else ''})",
            "-r", "24", *X264, "-force_key_frames", keys,
            "-c:a", "aac", "-b:a", "256k", "-ar", "48000", "-ac", "2", "-movflags", "+faststart", out + ".part.mp4"]
    try:
        subprocess.run(cmd, check=True, env=ENV)
        os.replace(out + ".part.mp4", out)
    finally:
        os.remove(wav)
        if os.path.exists(out + ".part.mp4"):
            os.remove(out + ".part.mp4")
    rep["encode_s"] = round(time.time() - t0, 1)
    rep["bytes"] = os.path.getsize(out)
    json.dump(rep, open(f"{ASM}/{variant}-assembly.json", "w"), indent=1, ensure_ascii=False)
    print("wrote", out, rep["bytes"], "bytes in", rep["encode_s"], "s")


if __name__ == "__main__":
    main(sys.argv[1], dry="--dry" in sys.argv)
