#!/usr/bin/env python3
"""assemble.py - Ep1 v3, the v3-assemble pass (PLAN.md track F): the full episode film, one per voice variant.

  audio/.venv-casting/bin/python show/episodes/ep01/production/full-v3/assembly/tools/assemble.py kokoro|el|kokoro-v31|el-v31|kokoro-v32|el-v32|kokoro-v33|el-v33|kokoro-v34|el-v34 [--dry]
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
           AAC-LC 256 kb/s (libfdk_aac), 48 kHz.
  CHAPTERS the nine chapters, titled, from an ffconcat chapter list (the bundled ffmpeg has no ffmetadata demuxer).
Writes out/ep01/full-v3/<VARIANTS[v].film>.mp4 (ep01-v3, ep01-v3-el, ep01-v31, ep01-v31-el) and assembly/<variant>-assembly.json (every input, its length and md5 of
its head, the seams, the chapter table). The episode WAV is a scratch intermediate and is deleted after the mux.
"""
from __future__ import annotations
import os  # noqa: E402  (phase 1: the project root is found at run time, docs/ORGANIZATION-PLAN.md §4)
import sys  # noqa: E402


def _repo():
    for start in (os.path.dirname(os.path.abspath(__file__)), os.getcwd()):
        d = start
        while True:
            if os.path.exists(os.path.join(d, '.mrmas-root')):
                return d
            if d == os.path.dirname(d):
                break
            d = os.path.dirname(d)
    sys.exit('MR. MAS: no .mrmas-root above this script or the cwd; set MRMAS_ROOT')


REPO = os.environ.get('MRMAS_ROOT') or _repo()

import hashlib
import json
import os
import subprocess
import sys
import time

import numpy as np
import soundfile as sf

ROOT = REPO
FFD = f"{ROOT}/studio/node_modules/@remotion/compositor-linux-x64-gnu"
ENV = {**os.environ, "LD_LIBRARY_PATH": FFD}
FF, FP = f"{FFD}/ffmpeg", f"{FFD}/ffprobe"
ASM = f"{ROOT}/show/episodes/ep01/production/full-v3/assembly"
# the scratch folder for the episode WAV / the decode (ASM_SCRATCH overrides: each pass works in its own scratch)
SCR = os.environ.get("ASM_SCRATCH", "/tmp/claude-1000/-home-jgon-project-art-mrmas/a5e7723c-6ab4-4824-a1ed-8e367fdb82e5/scratchpad/v3-assemble")
SR, FPS, SPF = 48000, 24, 2000
# the AAC-LC encoder: libfdk_aac. The bundled ffmpeg's native `aac` encoder was found (v3.4, 2026-09-28) to write short
# bursts of garbage on hot transients (4-7 ms, one channel, up to 0.45 of full scale off the source; one clipped to 0 dBFS
# in Act Two); libfdk_aac on the same input stays within 0.063. qa.py measures it on every film (decoded vs source).
AAC = "libfdk_aac"
X264 = ["-c:v", "libx264", "-preset", "medium", "-crf", "18", "-tune", "animation", "-pix_fmt", "yuv420p", "-profile:v", "high",
        "-g", "48", "-threads", "6"]

TITLES = {"coldopen": "Cold open", "intro": "Intro", "card": "ep1.0_research_preview.md", "act1": "Act One · research preview",
          "act2": "Act Two · the regulate-me tour", "act3": "Act Three · verified: human", "act4": "Act Four · the blip, told twice",
          "tag": "Tag · december", "outro": "Outro · credits"}
# the variants: the manifest (chapter order, the intro and outro and their gains), the story pictures, the final mixes,
# the film's name, the locks the transcript reads, and chapter titles that differ from TITLES
VARIANTS = {
    "kokoro": dict(man="show/reel/ep01-v3/ep01-v3.manifest.json", pic="picture", mix="mix", film="ep01-v3", label="v3",
                   locks="show/episodes/ep01/production/full-v3/lock/{seg}.json", transcript="transcript.txt", titles={}),
    "el": dict(man="show/reel/ep01-v3-el/ep01-v3-el.manifest.json", pic="picture-el", mix="mix-el", film="ep01-v3-el", label="v3, ElevenLabs voices",
               locks="show/episodes/ep01/production/full-v3/assembly/el/lock-{seg}.json", transcript="transcript-el.txt", titles={}),
    "kokoro-v31": dict(man="show/reel/ep01-v31/ep01-v31.manifest.json", pic="picture", mix="mix-v31", film="ep01-v31", label="v3.1",
                       locks="show/episodes/ep01/production/full-v3/lock/{seg}.json", transcript="transcript-v31.txt",
                       titles={"act4": "Act Four · five days, told twice"}),
    "el-v31": dict(man="show/reel/ep01-v31-el/ep01-v31-el.manifest.json", pic="picture-el", mix="mix-v31-el", film="ep01-v31-el",
                   label="v3.1, ElevenLabs voices", locks="show/episodes/ep01/production/full-v3/assembly/el-v31/lock-{seg}.json",
                   transcript="transcript-v31-el.txt", titles={"act4": "Act Four · five days, told twice"}),
    # v3.2: the outro plays the sound pass's outro-mix.wav (the outro's own audio with the tag's hum held under its head
    # and its first hit down; laid for the manifest's -1 dB) in place of outro-b-v3.wav (sound.md V.3)
    "kokoro-v32": dict(man="show/reel/ep01-v32/ep01-v32.manifest.json", pic="picture", mix="mix-v32", film="ep01-v32", label="v3.2",
                       locks="show/episodes/ep01/production/full-v3/lock/{seg}.json", transcript="transcript-v32.txt",
                       titles={"act4": "Act Four · five days, told twice"}, outro_audio="outro-mix.wav",
                       hum_gap=dict(frames=18, tail="audio/reel/ep01-v3/v32/tag-tail.wav", out="out/ep01/full-v3/assembly-v32")),
    "el-v32": dict(man="show/reel/ep01-v32-el/ep01-v32-el.manifest.json", pic="picture-el", mix="mix-v32-el", film="ep01-v32-el",
                   label="v3.2, ElevenLabs voices", locks="show/episodes/ep01/production/full-v3/assembly/el-v32/lock-{seg}.json",
                   transcript="transcript-v32-el.txt", titles={"act4": "Act Four · five days, told twice"}, outro_audio="outro-mix.wav",
                   hum_gap=dict(frames=18, tail="audio/reel/ep01-v3/v32/el/tag-tail.flac", out="out/ep01/full-v3/assembly-v32-el")),
    # v3.3, the polish round: as v3.2 (the outro-mix.wav outro, the hum gap), on the v3.3 locks, pictures and mixes
    "kokoro-v33": dict(man="show/reel/ep01-v33/ep01-v33.manifest.json", pic="picture", mix="mix-v33", film="ep01-v33", label="v3.3",
                       locks="show/episodes/ep01/production/full-v3/lock/{seg}.json", transcript="transcript-v33.txt",
                       titles={"act4": "Act Four · five days, told twice"}, outro_audio="outro-mix.wav",
                       hum_gap=dict(frames=18, tail="audio/reel/ep01-v3/v33/tag-tail.wav", out="out/ep01/full-v3/assembly-v33")),
    "el-v33": dict(man="show/reel/ep01-v33-el/ep01-v33-el.manifest.json", pic="picture-el", mix="mix-v33-el", film="ep01-v33-el",
                   label="v3.3, ElevenLabs voices", locks="show/episodes/ep01/production/full-v3/assembly/el-v33/lock-{seg}.json",
                   transcript="transcript-v33-el.txt", titles={"act4": "Act Four · five days, told twice"}, outro_audio="outro-mix.wav",
                   hum_gap=dict(frames=18, tail="audio/reel/ep01-v3/v33/el/tag-tail.flac", out="out/ep01/full-v3/assembly-v33-el")),
    # v3.4: as v3.3; the EL manifest's intro audio is the EL master (Jeremy's line, audio/ep01/v3-el/intro/intro-el.json)
    "kokoro-v34": dict(man="show/reel/ep01-v34/ep01-v34.manifest.json", pic="picture", mix="mix-v34", film="ep01-v34", label="v3.4",
                       locks="show/episodes/ep01/production/full-v3/lock/{seg}.json", transcript="transcript-v34.txt",
                       titles={"act4": "Act Four · five days, told twice"}, outro_audio="outro-mix.wav",
                       hum_gap=dict(frames=18, tail="audio/reel/ep01-v3/v34/tag-tail.wav", out="out/ep01/full-v3/assembly-v34")),
    "el-v34": dict(man="show/reel/ep01-v34-el/ep01-v34-el.manifest.json", pic="picture-el", mix="mix-v34-el", film="ep01-v34-el",
                   label="v3.4, ElevenLabs voices", locks="show/episodes/ep01/production/full-v3/assembly/el-v34/lock-{seg}.json",
                   transcript="transcript-v34-el.txt", titles={"act4": "Act Four · five days, told twice"}, outro_audio="outro-mix.wav",
                   hum_gap=dict(frames=18, tail="audio/reel/ep01-v3/v34/el/tag-tail.flac", out="out/ep01/full-v3/assembly-v34-el")),
    # v3.5, the final version (PLAN §8, 11A): ONE film, ep01-v35.mp4: the ElevenLabs cast with MARIO on Kokoro, on the
    # EL-timed lock (show/reel/ep01-v35-el/); the EL intro master at -3 dB, the 2 s card, outro B with the hum hold
    "el-v35": dict(man="show/reel/ep01-v35-el/ep01-v35-el.manifest.json", pic="picture-el", mix="mix-v35-el", film="ep01-v35",
                   label="v3.5", locks="show/episodes/ep01/production/full-v3/assembly/el-v35/lock-{seg}.json",
                   transcript="transcript-v35.txt", titles={"act4": "Act Four · five days, told twice"}, outro_audio="outro-mix.wav",
                   hum_gap=dict(frames=18, tail="audio/reel/ep01-v3/v35/el/tag-tail.flac", out="out/ep01/full-v3/assembly-v35")),
}


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
    V = VARIANTS[variant]
    man = json.load(open(f"{ROOT}/{V['man']}"))
    byid = {c["id"]: c for c in man["chapters"]}
    pic = f"{ROOT}/out/ep01/full-v3/{V['pic']}"
    mix = f"{ROOT}/out/ep01/full-v3/{V['mix']}"
    out = []
    for cid in ["coldopen", "intro", "card", "act1", "act2", "act3", "act4", "tag", "outro"]:
        c = byid[cid]
        if c.get("kind") == "video":
            au = f"{mix}/{V['outro_audio']}" if cid == "outro" and V.get("outro_audio") else f"{ROOT}/{c['audio']['src']}"
            out.append(dict(id=cid, video=f"{ROOT}/{c['src']}", audio=au, gain_db=float(c["audio"].get("gain", 0)), own=True))
        elif cid == "card":
            out.append(dict(id=cid, video=f"{ROOT}/out/ep01/full-v3/picture/card.mp4", audio=f"{mix}/card-mix.wav", gain_db=0.0, own=False))
        else:
            out.append(dict(id=cid, video=f"{pic}/{cid}.mp4", audio=f"{mix}/{cid}-mix.wav", gain_db=0.0, own=False))
    return out


def hum_gap(variant, CH):
    """v3.2's tag -> outro seam (sound.md §V): 2 s of the vault's hum alone before the outro. The tag's own black (33.05)
    is 1.25 s, so HG frames of black (the tag's last frame, held) are added after it, with the hum stem `tag-tail` under
    them at the tag's level, and the outro's audio is re-laid so the hum under its head CONTINUES the stem (tag-tail from
    HG frames in) instead of restarting it. The sound pass's outro-mix.wav = the outro master with its first hit -6 dB and a
    150 ms fade-in (O), plus tag-tail[0:2 s] x the tag's gain x a hold-then-fade envelope (hold 0.9 s, out by 2.0 s). O is
    re-made here with mix_episode.py's own formula and checked against outro-mix.wav (the residual must be < 1e-5, or this
    stops); the hum's gain is fitted from the difference. The new outro audio is O + tag-tail[HG:2 s] under the same
    envelope in hum time (so the hum still ends 2.0 s after the tag's last frame). Writes <out>/tag-hum.wav (the gap's
    audio, at 0 dB), <out>/outro.wav (for the manifest's gain) and <out>/tag-last.png (the gap's picture)."""
    V = VARIANTS[variant]
    G = V["hum_gap"]
    n_gap = G["frames"] * SPF
    outd = f"{ROOT}/{G['out']}"
    os.makedirs(outd, exist_ok=True)
    tag = next(c for c in CH if c["id"] == "tag")
    outro = next(c for c in CH if c["id"] == "outro")
    man = json.load(open(f"{ROOT}/{V['man']}"))
    src = f"{ROOT}/" + next(c for c in man["chapters"] if c["id"] == "outro")["audio"]["src"]
    om, _ = sf.read(outro["audio"], dtype="float64", always_2d=True)
    o, _ = sf.read(src, dtype="float64", always_2d=True)
    tail, _ = sf.read(f"{ROOT}/{G['tail']}", dtype="float64", always_2d=True)
    # O, as mix_episode.outro_mix makes it
    w = o[: 2 * SR]
    hop = int(0.01 * SR)
    env10 = 20 * np.log10(np.sqrt(np.mean(np.square(w[: len(w) // hop * hop].reshape(-1, hop, 2)), axis=(1, 2))) + 1e-12)
    hit = float(np.argmax(env10 >= env10.max() - 6.0) * 0.01)
    t = np.arange(len(o)) / SR
    O = o * 10 ** (np.interp(t, [0, hit + 0.35, hit + 0.85, t[-1]], [-6.0, -6.0, 0.0, 0.0]) / 20)[:, None]
    k = int(0.15 * SR)
    O[:k] *= (np.sin(np.linspace(0, np.pi / 2, k)) ** 2)[:, None]
    m = min(len(tail), 2 * SR)
    hum_env = lambda th: np.interp(th, [0, 0.9, 2.0], [1.0, 1.0, 0.0])[:, None] ** 0.5  # noqa: E731
    H = tail[:m] * hum_env(np.arange(m) / SR)
    D = om - O
    sc = float((D[:m] * H).sum() / (H * H).sum())
    res = D.copy()
    res[:m] -= sc * H
    resid = float(np.abs(res).max())
    if resid > 1e-5:
        raise SystemExit(f"hum_gap: outro-mix.wav isn't the outro + the hum as mix_episode.py lays them (residual {resid:.2e}); not re-laying it")
    og = outro["gain_db"]
    gap = tail[:n_gap] * sc * 10 ** (og / 20)                                 # the hum at the tag's level (0 dB in the film)
    new = O.copy()
    rest = tail[n_gap:m]
    new[: len(rest)] += sc * rest * hum_env(np.arange(n_gap, m) / SR)
    if np.abs(new).max() > 10 ** (-1.0 / 20):
        new *= 10 ** (-1.0 / 20) / np.abs(new).max()
    sf.write(f"{outd}/tag-hum.wav", gap, SR, subtype="PCM_24")
    sf.write(f"{outd}/outro.wav", new, SR, subtype="PCM_24")
    png = f"{outd}/tag-last.png"
    # the tag's last frame (its black, 33.05): decode the last half second, keep the last frame written
    subprocess.run([FF, "-v", "error", "-y", "-sseof", "-0.5", "-i", tag["video"], "-update", "1", png], check=True, env=ENV)
    tg, _ = sf.read(tag["audio"], dtype="float64", always_2d=True)
    info = dict(frames=G["frames"], seconds=round(G["frames"] / FPS, 4), tail=G["tail"], hum_gain_db_fitted=round(20 * np.log10(sc) + og, 2),
                outro_mix_residual=resid, first_hit_s=hit, tag_last200_dbfs=round(rms_db(tg[-int(0.2 * SR):]), 1),
                gap_first200_dbfs=round(rms_db(gap[: int(0.2 * SR)]), 1), gap_last200_dbfs=round(rms_db(gap[-int(0.2 * SR):]), 1),
                tag_to_gap_sample_jump=round(float(np.abs(gap[0] - tg[-1]).max()), 5),
                hum_alone_s=round(1.25 + G["frames"] / FPS, 2), files=[os.path.relpath(f"{outd}/{x}", ROOT) for x in ("tag-hum.wav", "outro.wav", "tag-last.png")])
    return dict(id="tag-hum", video=png, still=G["frames"], audio=f"{outd}/tag-hum.wav", gain_db=0.0, own=False, chapter=False), f"{outd}/outro.wav", info


def rms_db(x):
    return float(20 * np.log10(np.sqrt(np.mean(np.square(x))) + 1e-12))


def main(variant, dry=False):
    t0 = time.time()
    CH = chapters(variant)
    rep = {"variant": variant, "built": time.strftime("%Y-%m-%d %H:%M:%S"), "chapters": [], "seams": []}
    if VARIANTS[variant].get("hum_gap"):
        gap, outro_wav, info = hum_gap(variant, CH)
        CH.insert([c["id"] for c in CH].index("outro"), gap)
        next(c for c in CH if c["id"] == "outro")["audio"] = outro_wav
        rep["hum_gap"] = info
    tracks = []
    f_at = 0
    for c in CH:
        if c.get("still"):
            nf = c["still"]
        else:
            nf, s = probe_frames(c["video"])
            assert (s["width"], s["height"], s["r_frame_rate"]) == (1920, 1080, "24/1"), (c["id"], s)
        a, sr = sf.read(c["audio"], dtype="float32", always_2d=True)   # float32 (2026-09-28): half the memory of float64
        assert sr == SR and a.shape[1] == 2, (c["id"], sr, a.shape)
        want = nf * SPF
        if len(a) != want:
            raise SystemExit(f"{c['id']}: the audio is {len(a)} samples, the picture {nf} frames = {want} samples: refusing to pad or trim")
        a = a * np.float32(10 ** (c["gain_db"] / 20))
        tracks.append(a)
        rep["chapters"].append(dict(id=c["id"], title=VARIANTS[variant]["titles"].get(c["id"], TITLES.get(c["id"])), chapter=c.get("chapter", True), video=os.path.relpath(c["video"], ROOT), audio=os.path.relpath(c["audio"], ROOT),
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
    out = f"{ROOT}/out/ep01/full-v3/{VARIANTS[variant]['film']}.mp4"
    rep["film"] = os.path.relpath(out, ROOT)
    rep["locks"], rep["transcript"], rep["label"] = VARIANTS[variant]["locks"], VARIANTS[variant]["transcript"], VARIANTS[variant]["label"]
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
        titled = [c for c in rep["chapters"] if c["chapter"]]
        for i, c in enumerate(titled):
            end = titled[i + 1]["start_frame"] if i + 1 < len(titled) else total_f     # an untitled piece (the hum gap) joins the chapter before it
            f.write(f"chapter {i} {c['start_frame'] / FPS:.6f} {end / FPS:.6f}\n")
        f.write(f"file '{wav}'\n")
    cmd = [FF, "-hide_banner", "-y", "-v", "error", "-stats"]
    for c in CH:
        cmd += (["-loop", "1", "-framerate", "24", "-t", f"{c['still'] / FPS:.6f}", "-i", c["video"]] if c.get("still") else ["-i", c["video"]])
    cmd += ["-f", "concat", "-safe", "0", "-i", lst]
    fc = "".join(f"[{i}:v]{'trim=end_frame=%d,' % c['still'] if c.get('still') else ''}format=yuv420p[v{i}];" for i, c in enumerate(CH)) + "".join(f"[v{i}]" for i in range(len(CH))) + f"concat=n={len(CH)}:v=1:a=0[v]"
    keys = ",".join(f"{c['start_frame'] / FPS:.6f}" for c in rep["chapters"])
    meta = []
    for i, c in enumerate([c for c in rep["chapters"] if c["chapter"]]):
        meta += [f"-metadata:c:{i}", f"title={c['title']}"]
    cmd += ["-filter_complex", fc, "-map", "[v]", "-map", f"{len(CH)}:a", "-map_chapters", str(len(CH)), *meta,
            "-map_metadata", "-1", "-metadata", f"title=MR. MAS · ep1.0_research_preview.md ({VARIANTS[variant]['label']})",
            "-r", "24", *X264, "-force_key_frames", keys,
            "-c:a", AAC, "-b:a", "256k", "-ar", "48000", "-ac", "2", "-movflags", "+faststart", out + ".part.mp4"]
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
