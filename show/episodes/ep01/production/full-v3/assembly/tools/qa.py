#!/usr/bin/env python3
"""qa.py - Ep1 v3, the v3-assemble pass: the measurements of a finished episode film (nothing here is heard or watched).

  audio/.venv-casting/bin/python show/episodes/ep01/production/full-v3/assembly/tools/qa.py kokoro|el|kokoro-v31|el-v31|kokoro-v32|el-v32
  (through ops/heavy.sh: it decodes the whole film twice)

  1. DECODE      the whole film through the bundled ffmpeg (-v error): every error line is counted; frames decoded
  2. STREAMS     video frames / duration, audio duration, the chapters (ffprobe)
  3. A/V         per chapter: the film's audio at the chapter's first sample, cross-correlated with the chapter's source
                 (its mix or master) over 8 s: the lag in samples (0 = in sync); the chapter lengths are the pictures'
                 frame counts (assembly.json), the track's length against the picture's
  4. LOUDNESS    of the decoded AAC: per chapter and whole (BS.1770 via pyloudnorm), true peak (4x oversampled), max
                 short-term (3 s); digital-zero runs over 5 ms and holes (under -60 dBFS for 0.3 s or more, 50 ms windows)
  5. SEAMS       each chapter join: RMS of the 200 ms before and after, momentary loudness (400 ms) either side, the step
  6. FLASHES     the whole film, studio/.../coldopen/tools/flashcheck.py's method (imported: WCAG-style general and red
                 flash, 25 % of a 16 x 9 block grid, any 1 s window), on 160 x 90 frames streamed raw
  7. SHEET       one frame every 10 s (320 x 180), labelled with the episode timecode and chapter -> out/ep01/full-v3/
  8. TRANSCRIPT  every line of the six locks at its episode timecode (+ the card, intro and outro) -> assembly/transcript-*.txt
Writes assembly/<variant>-qa.json.
"""
from __future__ import annotations

import importlib.util
import json
import os
import re
import subprocess
import sys
import time

import numpy as np
import soundfile as sf
from scipy import signal

ROOT = "/home/jgon/project/art/mrmas"
FFD = f"{ROOT}/studio/node_modules/@remotion/compositor-linux-x64-gnu"
ENV = {**os.environ, "LD_LIBRARY_PATH": FFD}
FF, FP = f"{FFD}/ffmpeg", f"{FFD}/ffprobe"
ASM = f"{ROOT}/show/episodes/ep01/production/full-v3/assembly"
# the scratch folder for the episode WAV / the decode (ASM_SCRATCH overrides: each pass works in its own scratch)
SCR = os.environ.get("ASM_SCRATCH", "/tmp/claude-1000/-home-jgon-project-art-mrmas/a5e7723c-6ab4-4824-a1ed-8e367fdb82e5/scratchpad/v3-assemble")
SR, FPS = 48000, 24
_spec = importlib.util.spec_from_file_location("flashcheck", f"{ROOT}/studio/src/episodes/ep01/pixel/coldopen/tools/flashcheck.py")
FC = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(FC)


def tc(f):
    s = f / FPS
    return f"{int(s // 60):02d}:{s % 60:05.2f}"


def tcf(f):
    return f"{f // (60 * FPS):02d}:{(f // FPS) % 60:02d}:{f % FPS:02d}"


def decode(film):
    t = time.time()
    prog = f"{SCR}/decode-progress.txt"
    r = subprocess.run([FF, "-v", "error", "-progress", prog, "-i", film, "-map", "0:v", "-map", "0:a", "-c:v", "rawvideo", "-c:a", "pcm_s16le", "-f", "null", "-"], capture_output=True, text=True, env=ENV)
    frames = [int(m) for m in re.findall(r"^frame=(\d+)", open(prog).read(), re.M)]
    os.remove(prog)
    errs = [l for l in r.stderr.splitlines() if l.strip()]
    return {"exit": r.returncode, "error_lines": len(errs), "errors": errs[:20], "frames_decoded": frames[-1] if frames else None, "seconds": round(time.time() - t, 1)}


def streams(film):
    j = json.loads(subprocess.run([FP, "-v", "error", "-count_packets", "-show_entries",
                                   "stream=codec_type,codec_name,profile,width,height,r_frame_rate,nb_read_packets,duration,sample_rate,channels,bit_rate:format=duration,size,bit_rate:format_tags=title",
                                   "-show_chapters", "-of", "json", film], check=True, capture_output=True, text=True, env=ENV).stdout)
    return j


def lufs_i(x, meter):
    try:
        return round(float(meter.integrated_loudness(x)), 2)
    except Exception:  # noqa: BLE001
        return None


def true_peak(x, block=30 * SR, pad=256):
    """4x-oversampled peak, in 30 s blocks (with a little overlap) so a whole film fits the 8 GB heavy scope"""
    best = 0.0
    for a in range(0, len(x), block):
        seg = x[max(0, a - pad): a + block + pad]
        best = max(best, float(np.abs(signal.resample_poly(seg, 4, 1, axis=0)).max()))
    return round(float(20 * np.log10(best + 1e-12)), 2)


def momentary(x, meter):
    try:
        return round(float(meter.integrated_loudness(x)), 1) if len(x) >= int(0.4 * SR) else None
    except Exception:  # noqa: BLE001
        return None


def rms_db(x):
    return round(float(20 * np.log10(np.sqrt(np.mean(np.square(x))) + 1e-12)), 1)


def audio_qa(film, asm):
    import pyloudnorm
    wav = f"{SCR}/qa-audio.wav"
    subprocess.run([FF, "-v", "error", "-y", "-i", film, "-map", "0:a", "-c:a", "pcm_s24le", wav], check=True, env=ENV)
    a, sr = sf.read(wav, dtype="float32", always_2d=True)
    os.remove(wav)
    assert sr == SR
    meter = pyloudnorm.Meter(SR)
    mm = pyloudnorm.Meter(SR, block_size=0.4)
    out = {"samples": len(a), "seconds": round(len(a) / SR, 4), "picture_seconds": asm["total_s"],
           "length_diff_ms": round((len(a) / SR - asm["total_s"]) * 1000, 2)}
    out["integrated_lufs"] = lufs_i(a, meter)
    out["true_peak_dbtp"] = true_peak(a)
    out["sample_peak_dbfs"] = round(float(20 * np.log10(np.abs(a).max())), 2)
    chap = []
    for c in asm["chapters"]:
        s0, n = c["start_frame"] * 2000, c["frames"] * 2000
        x = a[s0:s0 + n]
        src, _ = sf.read(f"{ROOT}/{c['audio']}", dtype="float64", always_2d=True)
        src = src * 10 ** (c["gain_db"] / 20)
        # sync: the film's audio against its source, 8 s from 1 s in (or the whole chapter if shorter)
        w0, wn = (SR, 8 * SR) if n > 10 * SR else (0, n)
        ref = src[w0:w0 + wn].mean(axis=1)
        seg = a[max(0, s0 + w0 - 2400): s0 + w0 + wn + 2400].mean(axis=1)
        if np.abs(ref).max() > 1e-4:
            cc = signal.correlate(seg, ref, mode="valid", method="fft")
            lag = int(np.argmax(cc)) - (min(2400, s0 + w0))
            corr = float(cc.max() / (np.linalg.norm(ref) * np.linalg.norm(seg[np.argmax(cc):np.argmax(cc) + len(ref)]) + 1e-12))
        else:
            lag, corr = None, None
        st = []
        for i in range(0, max(1, len(x) - 3 * SR), SR):
            v = momentary(x[i:i + 3 * SR], meter)
            if v is not None and np.isfinite(v):
                st.append(v)
        # the codec's fidelity: the decoded chapter against its source, sample for sample (the sync above is 0 when it holds);
        # a burst = a run of samples more than 0.2 of full scale off the source (an encoder glitch, not coding noise)
        m = min(len(x), len(src))
        dif = np.abs(x[:m].astype(np.float32) - src[:m].astype(np.float32)).max(axis=1)
        badi = np.nonzero(dif > 0.2)[0]
        bursts = []
        if len(badi) and lag == 0:
            for g in np.split(badi, np.nonzero(np.diff(badi) > 480)[0] + 1):
                bursts.append(dict(at=tc(c["start_frame"] + g[0] / 2000), ms=round((g[-1] - g[0] + 1) / SR * 1000, 1), max=round(float(dif[g].max()), 3)))
        chap.append(dict(id=c["id"], start=tc(c["start_frame"]), seconds=c["seconds"], lufs_i=lufs_i(x, meter), true_peak_dbtp=true_peak(x),
                         max_short_term_lufs=max(st) if st else None, sync_lag_samples=lag, sync_corr=round(corr, 4) if corr else None,
                         codec_max_diff=round(float(dif.max()), 4) if lag == 0 else None, codec_bursts=bursts if lag == 0 else None))
    out["chapters"] = chap
    # seams
    seams = []
    for i in range(1, len(asm["chapters"])):
        c = asm["chapters"][i]
        s = c["start_frame"] * 2000
        pre, post = a[s - int(0.2 * SR): s], a[s: s + int(0.2 * SR)]
        seams.append(dict(join=f"{asm['chapters'][i - 1]['id']} -> {c['id']}", at=tc(c["start_frame"]), rms_before_db=rms_db(pre), rms_after_db=rms_db(post),
                          step_db=round(rms_db(post) - rms_db(pre), 1),
                          momentary_before_lufs=momentary(a[s - int(0.4 * SR): s], mm), momentary_after_lufs=momentary(a[s: s + int(0.4 * SR)], mm),
                          sample_jump=round(float(np.abs(a[s] - a[s - 1]).max()), 4)))
    out["seams"] = seams
    # digital zero and holes
    z = (np.abs(a).max(axis=1) == 0).astype(np.int8)
    d = np.diff(np.concatenate([[0], z, [0]]))
    st_, en_ = np.nonzero(d == 1)[0], np.nonzero(d == -1)[0]
    out["digital_zero_runs_over_5ms"] = [dict(at=tc(int(s0 / 2000)), ms=round((e - s0) / SR * 1000, 1)) for s0, e in zip(st_, en_) if e - s0 > 0.005 * SR]
    hop = int(0.05 * SR)
    lv = 20 * np.log10(np.sqrt(np.mean(np.square(a[: len(a) // hop * hop].reshape(-1, hop, 2)), axis=1)).max(axis=1) + 1e-12)
    low = lv < -60
    holes, run = [], 0
    for k, q in enumerate(np.append(low, False)):
        if q:
            run += 1
        else:
            if run * 0.05 >= 0.3:
                holes.append(dict(at=tc(int((k - run) * hop / 2000)), seconds=round(run * 0.05, 2)))
            run = 0
    out["holes_under_-60dBFS_0.3s"] = holes
    return out


def raw_frames(film, W, H):
    fsz = W * H * 3
    p = subprocess.Popen([FF, "-v", "error", "-i", film, "-map", "0:v", "-vf", f"scale={W}:{H}:flags=area", "-f", "image2pipe", "-c:v", "rawvideo", "-pix_fmt", "rgb24", "-"],
                         stdout=subprocess.PIPE, env=ENV)
    while True:
        buf = p.stdout.read(fsz)
        if not buf or len(buf) < fsz:
            break
        yield np.frombuffer(buf, np.uint8).reshape(H, W, 3)
    p.wait()


def picture_qa(film, asm, sheet_out):
    """the flash measure on a 160 x 90 area decode, exactly flashcheck.py's frames (streamed, not held in memory);
    then the contact sheet from a 320 x 180 decode (every 240th frame)"""
    from PIL import Image, ImageDraw
    W, H = 320, 180
    Lb, Rb, mean, thumbs = [], [], [], []
    f = 0
    for img in raw_frames(film, 160, 90):
        rgb = img.astype(np.float64) / 255.0
        L = FC.lin(rgb) @ np.array([0.2126, 0.7152, 0.0722])
        Lb.append(FC.blocks(L[None])[0])
        s = rgb.sum(axis=2) + 1e-6
        red = np.where(rgb[..., 0] / s >= 0.8, (rgb[..., 0] - rgb[..., 1] - rgb[..., 2]) * 320, 0.0)
        Rb.append(FC.blocks(red[None])[0])
        mean.append(L.mean())
        f += 1
    for i, img in enumerate(raw_frames(film, W, H)):
        if i % 240 == 0:
            thumbs.append((i, img.copy()))
    B, R = np.array(Lb), np.array(Rb)
    ev = FC.frame_events(B, 0.10, 0.80)
    evr = FC.frame_events(R, 20.0, None)
    fl, at = FC.max_flashes(ev)
    flr, atr = FC.max_flashes(evr)
    # every 1 s window's count, to list the busiest ones
    busiest = []
    for i, (f0, _) in enumerate(ev):
        inside = [e for e in ev[i:] if e[0] < f0 + 24]
        flips = sum(1 for x, y in zip(inside, inside[1:]) if x[1] != y[1])
        if (flips + 1) // 2 >= 2:
            busiest.append(dict(at=tc(f0), frame=f0, flashes=(flips + 1) // 2))
    dm = np.abs(np.diff(np.array(mean)))
    chapter_of = lambda fr: next(c["id"] for c in reversed(asm["chapters"]) if fr >= c["start_frame"])  # noqa: E731
    per_chapter = {}
    for c in asm["chapters"]:
        a0, a1 = c["start_frame"], c["start_frame"] + c["frames"]
        n, w = FC.max_flashes([e for e in ev if a0 <= e[0] < a1])
        per_chapter[c["id"]] = {"max_flashes_in_1s": n, "at": tc(w) if w >= 0 else None}
    flash = {"frames": f, "general": {"max_flashes_in_1s": fl, "at": tc(at) if at >= 0 else None, "chapter": chapter_of(at) if at >= 0 else None,
                                      "transitions": len(ev), "per_chapter": per_chapter, "windows_with_2_or_more": busiest[:40]},
             "red": {"max_flashes_in_1s": flr, "at": tc(atr) if atr >= 0 else None, "transitions": len(evr)},
             "largest_mean_luminance_step": {"delta": round(float(dm.max()), 3), "at": tc(int(dm.argmax()) + 1), "chapter": chapter_of(int(dm.argmax()) + 1)},
             "limit": 3, "pass": fl <= 3 and flr <= 3, "method": "coldopen/tools/flashcheck.py (imported), on a 160 x 90 area decode of the whole film"}
    # the sheet: 10 columns
    cols, tw, th, pad = 10, W, H, 22
    rows = (len(thumbs) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * (tw + 4) + 4, rows * (th + pad) + 40), (14, 15, 20))
    dr = ImageDraw.Draw(sheet)
    dr.text((6, 8), f"MR. MAS · ep1.0_research_preview.md · {os.path.basename(film)} · one frame every 10 s ({len(thumbs)}) · episode timecode · chapter", fill=(242, 211, 138))
    for i, (fr, img) in enumerate(thumbs):
        x, y = 4 + (i % cols) * (tw + 4), 36 + (i // cols) * (th + pad)
        sheet.paste(Image.fromarray(img), (x, y))
        dr.text((x + 2, y + th + 4), f"{tcf(fr)}  {chapter_of(fr)}", fill=(200, 203, 214))
    sheet.save(sheet_out)
    return flash, {"file": os.path.relpath(sheet_out, ROOT), "frames": len(thumbs)}


def transcript(variant, asm, out_txt):
    lock = lambda s: f"{ROOT}/" + asm.get("locks", "show/episodes/ep01/production/full-v3/lock/{seg}.json").format(seg=s)  # noqa: E731
    rows = []
    for c in asm["chapters"]:
        f0 = c["start_frame"]
        if c["id"] == "intro":
            rows.append((f0, c["title"], "", "[the main title, 30 s: its own mix]"))
        elif c["id"] == "card":
            rows.append((f0, c["title"], "", "ep1.0_research_preview.md  [typed on black, 2 s]"))
        elif c["id"] == "outro":
            rows.append((f0, c["title"], "", "[the Orb's scan; credits: art · script · music · voices · edit: opus 5.5 / prompt: jgon]"))
        elif c["id"] not in ("coldopen", "act1", "act2", "act3", "act4", "tag"):
            rows.append((f0, rows[-1][1] if rows else "", "", "[the vault's hum under black, %.2f s]" % c["seconds"]) if c["id"] == "tag-hum" else (f0, c["id"], "", ""))
        else:
            L = json.load(open(lock(c["id"])))
            lines = L["lines"].values() if isinstance(L["lines"], dict) else L["lines"]
            for l in lines:
                if l.get("kind") == "post":
                    continue
                who = "mas (v.o.)" if l.get("kind") == "vo" else (l.get("who") or "").lower()
                txt = l["text"].lower() if l.get("kind") == "vo" else l["text"]
                os_ = " (o.s.)" if l.get("os") and l.get("kind") != "vo" else ""
                rows.append((f0 + int(l["abs_in"]), c["title"], f"{who}{os_}", txt))
    rows.sort(key=lambda r: r[0])  # stable: a chapter's rows stay together
    with open(out_txt, "w") as fh:
        fh.write(f"MR. MAS · ep1.0_research_preview.md · the full episode ({asm.get('label', variant)}{'' if 'el' in variant else ', Kokoro voices'})\n")
        fh.write(f"Film: {asm['film']} · {tc(asm['total_frames'])} · {len([r for r in rows if r[2]])} lines. Episode timecode MM:SS:FF (24 fps) at each line's first sound, from the locks.\n")
        fh.write("Generated by show/episodes/ep01/production/full-v3/assembly/tools/qa.py. Nothing here was heard.\n\n")
        cur = None
        for f, ch, who, txt in rows:
            if ch != cur:
                fh.write(f"\n== {ch} ==\n")
                cur = ch
            fh.write(f"{tcf(f)}  {who + ': ' if who else ''}{txt}\n")
    return {"file": os.path.relpath(out_txt, ROOT), "lines": len([r for r in rows if r[2]])}


def main(variant):
    t0 = time.time()
    asm = json.load(open(f"{ASM}/{variant}-assembly.json"))
    film = f"{ROOT}/{asm['film']}"
    q = {"variant": variant, "film": asm["film"], "measured": time.strftime("%Y-%m-%d %H:%M:%S"), "heard": "nothing here was heard or watched; every number is measured"}
    q["transcript"] = transcript(variant, asm, f"{ASM}/{asm.get('transcript', 'transcript.txt')}")
    q["decode"] = decode(film)
    print("decode", q["decode"], flush=True)
    j = streams(film)
    q["streams"] = j["streams"]
    q["format"] = j["format"]
    q["chapters"] = [dict(id=i, start=round(float(c["start_time"]), 3), end=round(float(c["end_time"]), 3), title=c.get("tags", {}).get("title")) for i, c in enumerate(j.get("chapters", []))]
    titled = [a for a in asm["chapters"] if a.get("chapter", True)]          # an untitled piece (v3.2's hum gap) joins the chapter before it
    ends = [t["start_s"] for t in titled[1:]] + [asm["total_s"]]
    q["chapters_match_assembly"] = len(q["chapters"]) == len(titled) and all(abs(c["start"] - a["start_s"]) < 0.002 and abs(c["end"] - e) < 0.002 for c, a, e in zip(q["chapters"], titled, ends))
    q["audio"] = audio_qa(film, asm)
    print("audio", json.dumps({k: q["audio"][k] for k in ("seconds", "length_diff_ms", "integrated_lufs", "true_peak_dbtp")}), flush=True)
    q["flash"], q["sheet"] = picture_qa(film, asm, film[:-4] + "-sheet.png")
    print("flash", json.dumps({k: q["flash"][k] for k in ("frames", "pass")}), q["flash"]["general"]["max_flashes_in_1s"], flush=True)
    q["seconds"] = round(time.time() - t0, 1)
    json.dump(q, open(f"{ASM}/{variant}-qa.json", "w"), indent=1, ensure_ascii=False)
    print("wrote", f"{ASM}/{variant}-qa.json", q["seconds"], "s")


if __name__ == "__main__":
    main(sys.argv[1])
