#!/usr/bin/env python3
"""el_intro.py - Mas's intro line in his EL voice (Jeremy) for the EL films (track A4, v3-voices-el; PLAN.md §7 D).

The 30 s intro's only line, "near the singularity; unclear which side.", is the Kokoro am_michael take
(audio/intro/vox/intro-vox_vo.wav). The EL films replace it with the EL Mas, fitted to the same frames so the picture's
typing and dot still land (audio/intro/vox/vo_word_timings.json), treated with the same close-mic chain and room
(audio/intro/vox/scripts/build_vo.py, whose helpers are imported read-only), and mixed into the V1 "chip chamber"
master by the intro mix's own build() (audio/intro/mix/scripts/mix_intro.py, imported) with only the VO swapped.

  render    (.venv-casting)  the reads: whole-line reads and phrase-2 reads with Jeremy, eleven_multilingual_v2
  build     (.venv-vocals)   fit a read to the Kokoro word onsets (Rubber Band, one variable-rate pass per clip),
                             the intro-vox chain, the 30.000 s stem at -16.0 LUFS short-term max
  mix       (.venv-mix)      the V1 master with the EL VO: audio/intro/mix/intro-ep1-mix-V1-chipchamber-el.wav

Outputs: audio/ep01/v3-el/intro/ (takes, the stem intro-vox_vo-el.wav, word timings, QA) and the -el master beside the
original. The Kokoro stem and master are never written. The key stays inside ellib; no voice is cloned.
"""
from __future__ import annotations

import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, "../../../.."))
OUT = os.path.join(REPO, "audio/ep01/v3-el/intro")
TAKES = os.path.join(OUT, "takes")
FPS, SR = 24, 48000
VOICE = "EwzF7Z2UMSib9JaKx0Kg"          # Jeremy - Warm, Trustworthy, Sincere (Mas, candidate C)
MODEL = "eleven_multilingual_v2"
LINE = "Near the singularity; unclear which side."
P2 = "Unclear which side."
# soft, close, steady: Mas's V.O. settings (stability 0.65), style 0
SOFT = dict(stability=0.65, similarity_boost=0.75, style=0.0, use_speaker_boost=True)
READS = [dict(name="w1", text=LINE, speed=0.95, seed=1101), dict(name="w2", text=LINE, speed=0.95, seed=2202),
         dict(name="w3", text=LINE, speed=0.95, seed=3303),
         dict(name="p2a", text=P2, speed=1.15, seed=4404), dict(name="p2b", text=P2, speed=1.15, seed=5505),
         dict(name="p2c", text=P2, speed=1.2, seed=6606), dict(name="p2d", text=P2, speed=1.2, seed=7707),
         # a trailing ellipsis for a hanging final (the intro's "side" hangs: no fall, no rise)
         dict(name="p2e", text="Unclear which side...", speed=1.2, seed=8808),
         dict(name="p2f", text="Unclear which side...", speed=1.2, seed=9909)]
# the Kokoro word onsets on the intro clock (vo_word_timings.json), the targets
TARGET = dict(near=24.10, the=31.33, singularity=35.07, p1_end=57.52, unclear=72.07, which=80.59, side=84.24, p2_end=91.10)


def jdump(o, p):
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p + ".tmp", "w") as f:
        json.dump(o, f, indent=1, ensure_ascii=False)
        f.write("\n")
    os.replace(p + ".tmp", p)


def cmd_render(a):
    sys.path.insert(0, HERE)
    import ellib
    os.makedirs(TAKES, exist_ok=True)
    log = []
    for r in READS:
        if a.only and r["name"] not in a.only:
            continue
        mp3 = os.path.join(TAKES, r["name"] + ".mp3")
        js = os.path.join(TAKES, r["name"] + ".json")
        if os.path.exists(mp3) and os.path.exists(js):
            print("cached", r["name"])
            continue
        st = dict(SOFT, speed=r["speed"])
        audio, al, body = ellib.tts(VOICE, r["text"], model_id=MODEL, settings=st, seed=r["seed"])
        hdr = dict(ellib.LAST)
        open(mp3, "wb").write(audio)
        jdump(dict(read=r, request=body, alignment=al, cost_header=hdr.get("character-cost"),
                   request_id=hdr.get("request-id")), js)
        log.append(dict(name=r["name"], chars=len(r["text"]), cost_header=hdr.get("character-cost")))
        print(f"sent {r['name']}: {len(r['text'])} chars (cost header {hdr.get('character-cost')})")
    p = os.path.join(OUT, "render-log.json")
    old = json.load(open(p)) if os.path.exists(p) else []
    jdump(old + log, p)


def load_read(name):
    """-> (48 kHz mono float array, word anchors in the read's own seconds, meta)"""
    sys.path.insert(0, HERE)
    import numpy as np
    import elaudio as E
    wav = os.path.join(TAKES, name + ".wav")
    if os.path.exists(wav):                                   # 48 kHz float, written by analyze (the vocals venv's
        import soundfile as sf                                # libsndfile can't read MP3)
        y = sf.read(wav, dtype="float64")[0]
    else:
        y = E.decode(open(os.path.join(TAKES, name + ".mp3"), "rb").read()).astype(np.float64)
        if len(y) == 0:
            raise SystemExit(f"{name}: the MP3 decoded to nothing here; run analyze (.venv-casting) first")
    meta = json.load(open(os.path.join(TAKES, name + ".json")))
    al = (meta["alignment"] or {}).get("alignment") or {}
    chars, st, en = al.get("characters", []), al.get("character_start_times_seconds", []), al.get("character_end_times_seconds", [])
    text = "".join(chars)
    words = {}
    i = 0
    for w in ("near", "the", "singularity", "unclear", "which", "side"):
        j = text.lower().find(w, i)
        if j < 0:
            continue
        words[w] = (st[j], en[j + len(w) - 1])
        i = j + len(w)
    # acoustic landmarks (5 ms RMS, -40 dB re the read's loudest 10 ms): the first sound, the pause, the last sound
    d = E.rms_db(y.astype(np.float32), 0.005)
    on = d > -40
    idx = np.nonzero(on)[0]
    first, last = idx[0] * 0.005, (idx[-1] + 1) * 0.005
    anchors = {}
    if "near" in words:
        # the pause: the longest run under -40 dB between singularity's start and unclear's alignment start
        a0, a1 = int(words["singularity"][0] / 0.005), int(words["unclear"][0] / 0.005) + 20
        run, best, cur0 = 0, (0, 0, 0), None
        for k in range(a0, min(a1, len(on))):
            if not on[k]:
                cur0 = k if run == 0 else cur0
                run += 1
                if run > best[0]:
                    best = (run, cur0, k)
            else:
                run = 0
        p_on, p_off = best[1] * 0.005, (best[2] + 1) * 0.005
        anchors = dict(near=first, the=words["the"][0], singularity=words["singularity"][0], p1_end=p_on,
                       unclear=p_off, which=words["which"][0], side=words["side"][0], p2_end=last)
    else:
        anchors = dict(unclear=first, which=words["which"][0], side=words["side"][0], p2_end=last)
    return y, anchors, meta


def cmd_analyze(a):
    import numpy as np
    sys.path.insert(0, HERE)
    import elaudio as E
    fr = lambda t: t * FPS
    segs1 = [("near", "the"), ("the", "singularity"), ("singularity", "p1_end")]
    segs2 = [("unclear", "which"), ("which", "side"), ("side", "p2_end")]
    rows = {}
    import soundfile as sf
    for r in READS:
        y, A, meta = load_read(r["name"])
        sf.write(os.path.join(TAKES, r["name"] + ".wav"), y.astype(np.float32), SR, subtype="FLOAT")
        out = dict(anchors_s={k: round(v, 3) for k, v in A.items()})
        for tag, segs in (("p1", segs1), ("p2", segs2)):
            if segs[0][0] not in A:
                continue
            rat = []
            for s0, s1 in segs:
                src = fr(A[s1] - A[s0])
                tgt = TARGET[s1] - TARGET[s0]
                rat.append(round(tgt / src, 3))
            out[tag] = dict(src_frames=[round(fr(A[s1] - A[s0]), 2) for s0, s1 in segs], ratios_out_over_in=rat,
                            worst=round(max(abs(np.log(x)) for x in rat), 3))
        if "p1_end" in A:
            out["pause_frames"] = round(fr(A["unclear"] - A["p1_end"]), 2)
        m = E.measure(y.astype(np.float32), r["text"])
        out.update(f0=m["median_f0_hz"], f0_range=m["f0_range_st"], asr=E.asr(y.astype(np.float32))[0])
        rows[r["name"]] = out
        print(r["name"], json.dumps(out))
    jdump(rows, os.path.join(OUT, "reads-analysis.json"))


TOL = 0.4          # frames: every word onset lands within this of the Kokoro onset (the picture types on them)
END1_MAX = 57.9    # clip 1's voice ends inside f57 (the pause f58-71 is room tone only)
END2_MAX = 91.5    # the voice ends by f91 (the /d/ closure under the f90 pluck; the room tail runs on)


def plan_fit(A, keys):
    """greedy targets on the intro clock: the first anchor exactly on Kokoro's; each next one where the read puts it,
    clamped to within TOL of Kokoro's (the end anchor: no later than its max). -> (targets, ratios out/in)"""
    tg = {keys[0]: TARGET[keys[0]]}
    for k0, k1 in zip(keys, keys[1:]):
        nat = tg[k0] + (A[k1] - A[k0]) * FPS
        if k1.endswith("_end"):
            hi = END1_MAX if k1 == "p1_end" else END2_MAX
            tg[k1] = min(max(nat, TARGET[k1] - 2.0), hi)
        else:
            tg[k1] = min(max(nat, TARGET[k1] - TOL), TARGET[k1] + TOL)
    rat = [round((tg[k1] - tg[k0]) / ((A[k1] - A[k0]) * FPS), 3) for k0, k1 in zip(keys, keys[1:])]
    return tg, rat


def fit_clip(y, A, keys, pre=0.05, post=0.12):
    """cut the clip [first anchor - pre, end anchor + post], one variable-rate Rubber Band pass so each source anchor
    lands on its target. -> (clip, source-to-clip map, targets, ratios, clip start on the intro clock)"""
    import numpy as np
    import pedalboard as pb
    tg, rat = plan_fit(A, keys)
    a, e = max(0.0, A[keys[0]] - pre), min(len(y) / SR, A[keys[-1]] + post)    # the read may start within the pre-roll
    x = y[int(a * SR): int(e * SR)].astype(np.float32)
    f = np.ones(len(x))
    for (k0, k1), r in zip(zip(keys, keys[1:]), rat):
        i0, i1 = int((A[k0] - a) * SR), int((A[k1] - a) * SR)
        f[i0:i1] = 1.0 / r                                     # stretch_factor > 1 shortens
    f[int((A[keys[-1]] - a) * SR):] = 1.0 / rat[-1]           # the decay follows the last word
    out = pb.time_stretch(x[None, :], SR, stretch_factor=f, high_quality=True, transient_mode="crisp",
                          preserve_formants=True)[0].astype(np.float64)
    cum = np.concatenate([[0.0], np.cumsum(1.0 / f)]) / SR     # source sample -> output seconds (the theory)

    def smap(t):                                               # source seconds -> clip seconds
        return float(np.interp((t - a) * SR, np.arange(len(cum)), cum))
    start = tg[keys[0]] / FPS - smap(A[keys[0]])               # where the clip goes on the intro clock
    return out, smap, tg, rat, start, a


def env(y, hop=0.005):
    import numpy as np
    n = int(hop * SR)
    m = len(y) // n
    return np.sqrt(np.mean(y[: m * n].reshape(m, n) ** 2, 1) + 1e-12)


def verify(src, a, smap, clip, keys, A, win=0.08):
    """the anchors as they really land in the stretched clip: the source's envelope around each anchor, warped by
    the map, cross-correlated with the clip's envelope (+-win). -> {anchor: correction s}"""
    import numpy as np
    hop = 0.005
    es, ec = np.log(env(src) + 1e-9), np.log(env(clip) + 1e-9)
    corr = {}
    for k in keys:
        t_src = A[k]
        t_out = smap(t_src)
        span = np.arange(-0.10, 0.10, hop)
        # the source envelope near the anchor, laid on the output clock by the map
        src_on_out = np.interp(t_out + span, [smap(t) for t in (t_src + span)], np.interp((t_src + span) / hop, np.arange(len(es)), es))
        best, bd = -1e9, 0.0
        for d in np.arange(-win, win + 1e-9, 0.0025):
            c = np.interp((t_out + span + d) / hop, np.arange(len(ec)), ec)
            v = float(np.corrcoef(src_on_out, c)[0, 1])
            if v > best:
                best, bd = v, float(d)
        corr[k] = round(bd, 4)
    return corr


LEVEL_STRENGTH, SETTLE_ST, FP = 0.92, -0.25, 5.0     # build_vo.py's own: 'side' hangs, neither falling nor rising


def level_side(clip, t_unc, t_side, t_end):
    """build_vo.py's 'side' levelling on the fitted clip 2 (clip seconds): WORLD, the vowel's F0 pulled 92 % of the way
    to the phrase's own median with a -0.25 st settle, the /s/ forced unvoiced; the resynthesis replaces the clip
    from inside the /s/ on, with a 15 ms equal-power crossfade. -> (clip, pitch report)"""
    import numpy as np
    import pyworld as pw
    from scipy.signal import butter, sosfiltfilt
    x = np.ascontiguousarray(clip, dtype=np.float64)
    f0, tf = pw.harvest(x, SR, f0_floor=55, f0_ceil=450, frame_period=FP)
    sp = pw.cheaptrick(x, f0, tf, SR)
    ap = pw.d4c(x, f0, tf, SR)
    hop = int(FP / 1000 * SR)
    e = 20 * np.log10(np.array([np.sqrt(np.mean(x[i * hop:(i + 1) * hop] ** 2)) for i in range(len(tf))]) + 1e-12)
    e -= e.max()
    lo = sosfiltfilt(butter(4, 1000, "low", fs=SR, output="sos"), x)
    el = 20 * np.log10(np.array([np.sqrt(np.mean(lo[i * hop:(i + 1) * hop] ** 2)) for i in range(len(tf))]) + 1e-12)
    ref = (tf >= t_unc + 0.02) & (tf < t_side - 0.03) & (f0 > 0) & (e > -30)
    level = float(np.median(f0[ref]))
    reg = (tf >= t_side) & (tf <= t_end)
    elmax = el[reg].max()
    t_vow = float(tf[np.nonzero(reg & (el > elmax - 18))[0][0]])       # the vowel: the low band comes up
    vm = (tf >= t_vow) & (tf <= t_end) & (f0 > 0)
    tv, fv = tf[vm], f0[vm]
    frac = (tv - tv[0]) / max(tv[-1] - tv[0], 1e-3)
    want = level * 2 ** (SETTLE_ST * frac / 12)
    st = np.clip(LEVEL_STRENGTH * 12 * np.log2(want / fv), -7, 9)
    st = np.convolve(np.pad(st, 2, mode="edge"), np.ones(5) / 5, mode="valid")
    f1 = f0.copy()
    f1[vm] = fv * 2 ** (st / 12)
    f1[(tf >= t_side) & (tf < t_vow - 0.004)] = 0.0                    # the /s/ is unvoiced
    y = pw.synthesize(np.ascontiguousarray(f1), sp, ap, SR, FP)
    y = y[:len(x)] if len(y) >= len(x) else np.pad(y, (0, len(x) - len(y)))
    # splice inside the /s/: 15 ms equal-power, centred between the /s/ onset and the vowel
    c = int(((t_side + t_vow) / 2) * SR)
    n = int(0.015 * SR)
    g = np.sin(np.linspace(0, np.pi / 2, n)) ** 2
    out = x.copy()
    out[c - n // 2: c - n // 2 + n] = x[c - n // 2: c - n // 2 + n] * np.sqrt(1 - g) + y[c - n // 2: c - n // 2 + n] * np.sqrt(g)
    out[c - n // 2 + n:] = y[c - n // 2 + n:]
    thirds = lambda v: [round(float(np.median(q)), 1) for q in np.array_split(v, 3)]
    rep = dict(level_hz=round(level, 1), vowel_onset_s=round(t_vow, 3), raw_side_thirds_hz=thirds(fv),
               out_side_thirds_hz=thirds(f1[vm]), splice_s=round(c / SR, 3),
               method="build_vo.py's: WORLD, 92 % toward the phrase median, -0.25 st settle, /s/ unvoiced, 15 ms crossfade in the /s/")
    return out, rep


def cmd_build(a):
    import numpy as np
    import soundfile as sf
    sys.path.insert(0, os.path.join(REPO, "audio/intro/vox/scripts"))
    import ivlib as V                                          # the intro-vox helpers (read-only)
    import pedalboard as pb
    y1, A1, _ = load_read(a.p1)
    y2, A2, _ = load_read(a.p2)
    k1 = ["near", "the", "singularity", "p1_end"]
    k2 = ["unclear", "which", "side", "p2_end"]
    c1, m1, t1, r1, s1, a1 = fit_clip(y1, A1, k1)
    c2, m2, t2, r2, s2, a2 = fit_clip(y2, A2, k2)
    side_pitch = None
    if a.level_side:
        c2, side_pitch = level_side(c2, m2(A2["unclear"]), m2(A2["side"]), m2(A2["p2_end"]))
    # the verification works on source-clip time
    v1 = verify(y1[int(a1 * SR):].astype(np.float64), 0, lambda t: m1(t + a1), c1, k1, {k: A1[k] - a1 for k in k1})
    v2 = verify(y2[int(a2 * SR):].astype(np.float64), 0, lambda t: m2(t + a2), c2, k2, {k: A2[k] - a2 for k in k2})
    words = {}
    for k in k1:
        words[k] = (s1 + m1(A1[k]) + v1[k]) * FPS
    for k in k2:
        words[k] = (s2 + m2(A2[k]) + v2[k]) * FPS
    # the dry line on the intro clock (0 - 4.4 s), as build_vo lays it
    dry = np.zeros(int(4.4 * SR))

    def lay(dst, src, t):
        i = int(round(t * SR))
        n = min(len(src), len(dst) - i)
        dst[i:i + n] += src[:n]
    lay(dry, V.fade(c1, 0.002, 0.05), s1)
    lay(dry, V.fade(c2, 0.002, 0.05), s2)
    # the close-mic softness: build_vo.py's chain, verbatim
    br = V.whisperize(dry)
    br = V.board_mono([pb.HighpassFilter(1400), pb.LowpassFilter(9000)], br)
    yv = dry + br * 10 ** (-24 / 20) * (np.max(np.abs(dry)) / (np.max(np.abs(br)) + 1e-9))
    chain = [pb.HighpassFilter(90), pb.LowShelfFilter(170, 1.5, 0.7), pb.PeakFilter(3200, -2.0, 1.1),
             pb.PeakFilter(6500, -1.5, 1.5), pb.HighShelfFilter(8000, -2.5, 0.7),
             pb.Compressor(threshold_db=-22, ratio=2.0, attack_ms=8, release_ms=140)]
    yv = V.board_mono(chain, yv)
    yv = V.saturate(yv, 5.0, 0.22)
    yv, de_gr = V.deess(yv)
    yv = V.convolve(yv, V.ir("dark_room"), wet=0.14, dry=1.0)
    yv = yv[:, :int(4.4 * SR)]
    yv = V.fade(yv, 0.0, 0.2)
    # the 30.000 s stem: VO + the -66 dBFS dark-room tone under f22-95; short-term (3 s) max -16.0 LUFS
    rt = V.room_tone(V.fs(95) - V.fs(22), -66.0)
    rt = V.fade(rt, 2 / FPS, 3 / FPS)
    vo = V.timeline([(yv, 0.0, 1.0)])
    tone = V.timeline([(rt, V.fs(22), 1.0)])
    ts_, S = V.loud_curve(vo, 3.0, 0.05)
    vo *= 10 ** ((-16.0 - S.max()) / 20)
    stem = vo + tone
    ts_, S = V.loud_curve(stem, 3.0, 0.05)
    stem *= 10 ** ((-16.0 - S.max()) / 20)
    os.makedirs(OUT, exist_ok=True)
    wav = os.path.join(OUT, "intro-vox_vo-el.wav")
    sf.write(wav, stem.T.astype(np.float32), SR, subtype="PCM_24")
    # measurements, the Kokoro stem beside it
    kok, _ = sf.read(os.path.join(REPO, "audio/intro/vox/intro-vox_vo.wav"), always_2d=True)
    st_el, st_k = V.stats(stem, "el"), V.stats(kok.T, "kokoro")
    line_el = V.lufs_window(stem, V.fs(24), V.fs(92))
    line_k = V.lufs_window(kok.T, V.fs(24), V.fs(92))
    pause = stem[:, int(V.fs(58) * SR): int(V.fs(72) * SR)]
    pause_v = float(20 * np.log10(np.sqrt(np.mean((pause - tone[:, int(V.fs(58) * SR): int(V.fs(72) * SR)]) ** 2)) + 1e-12))
    kt = json.load(open(os.path.join(REPO, "audio/intro/vox/vo_word_timings.json")))
    kon = {w["word"]: w["in_f"] for w in kt["words"]}
    names = dict(near="near", the="the", singularity="singularity", unclear="unclear", which="which", side="side")
    onsets = {w: dict(el=round(words[k], 2), kokoro=kon[w], diff_frames=round(words[k] - kon[w], 2)) for k, w in names.items()}
    ends = dict(clip1_end_f=round(words["p1_end"], 2), voice_end_f=round(words["p2_end"], 2))
    wt = dict(clock=kt["clock"], source="audio/ep01/v3-el/intro/intro-vox_vo-el.wav (Jeremy, ElevenLabs "
              "eleven_multilingual_v2; fitted to the Kokoro onsets)",
              clips=[dict(clip=1, text="near the singularity;", start_frame=24, end_frame=int(words["p1_end"])),
                     dict(clip=2, text="unclear which side.", start_frame=72, end_frame=int(words["p2_end"]))],
              words=[])
    order = ["near", "the", "singularity", "unclear", "which", "side"]
    nxt = dict(near="the", the="singularity", singularity="p1_end", unclear="which", which="side", side="p2_end")
    for w in order:
        i, o = words[w], words[nxt[w]]
        wt["words"].append(dict(word=w, in_s=round(i / FPS, 3), out_s=round(o / FPS, 3), in_f=round(i, 2), out_f=round(o, 2),
                                in_frame=int(np.floor(i)), out_frame=int(np.floor(o - 1e-6))))
    json.dump(wt, open(os.path.join(OUT, "vo_word_timings-el.json"), "w"), indent=1)
    # ASR on the voice
    sys.path.insert(0, HERE)
    qa = dict(reads=dict(p1=a.p1, p2=a.p2), side_levelled=side_pitch, ratios_out_over_in=dict(p1=r1, p2=r2), targets_f=dict(p1=t1, p2=t2),
              verify_corrections_s=dict(p1=v1, p2=v2), onsets_frames=onsets, ends=ends,
              loudness=dict(el=st_el, kokoro=st_k, line_lufs_i_f24_92=dict(el=round(line_el, 2), kokoro=round(line_k, 2))),
              pause_f58_71_voice_dbfs=round(pause_v, 1), deess_max_gr_db=round(float(de_gr), 2),
              audible_span_frames=dict(el=V.audible_span(stem, -60), kokoro=V.audible_span(kok.T, -60)),
              chain="build_vo.py's, verbatim: WORLD breath layer -24 dB, HPF 90, +1.5 dB shelf @170, -2 dB @3.2k, -1.5 dB @6.5k, "
                    "-2.5 dB shelf @8k, 2:1 comp, tanh (5 dB, 22 %), split-band de-esser 4.8-10k, dark-room IR 14 % wet, "
                    "-66 dBFS dark-room tone f22-95; short-term max -16.0 LUFS")
    jdump(qa, os.path.join(OUT, "intro-el-qa.json"))
    print(json.dumps(dict(onsets=onsets, ends=ends, ratios=qa["ratios_out_over_in"], corrections=qa["verify_corrections_s"],
                          el=st_el, kokoro=st_k, line=qa["loudness"]["line_lufs_i_f24_92"], pause=qa["pause_f58_71_voice_dbfs"],
                          span=qa["audible_span_frames"]), indent=1))


def cmd_mix(a):
    """the V1 master with only the VO swapped, by the intro mix's own build(): first a reproduction check of the
    delivered V1 master from its own inputs, then the build with the EL stem. Writes the -el master beside the
    original, its D/M/E stems and QA in audio/ep01/v3-el/intro/ (the Kokoro master and mix_build.json untouched)."""
    import numpy as np
    sys.path.insert(0, os.path.join(REPO, "audio/intro/mix/scripts"))
    import mix_intro as M
    b = M.bus_inputs()
    orig = M.read(os.path.join(REPO, "audio/intro/mix/intro-ep1-mix-V1-chipchamber.wav"))
    out0, _, info0, _ = M.build("V1", b)
    resid = M.sample_peak_db(out0 - orig)
    print(f"reproduction of the delivered V1 master from its inputs: residual {resid:.1f} dBFS, master gain {info0['master_gain_db']}")
    vo_el = M.read(os.path.join(OUT, "intro-vox_vo-el.wav"))
    b_el = dict(b, vo=vo_el)
    out_b, stems_b, info, gc_b = M.build("V1", b_el)          # the full rebuild: a cross-check (its master gain re-iterates)
    # the master itself: the delivered V1 with only the VO swapped, through the delivered build's own gain curve
    # (its master gain and limiter), so everything outside the line is the delivered master sample for sample
    _, stems0, _, gc0 = M.build("V1", b)
    tr0, _ = M.vo_centre(b["vo"])
    tr1, lr1 = M.vo_centre(vo_el)
    dvo = (vo_el * tr1 - b["vo"] * tr0) * M.db(M.VO_DB) * gc0
    out = orig + dvo
    lim_line = float(np.min(gc0[:, int(M.SR * 20 / 24): int(M.SR * 100 / 24)]) / M.db(info0["master_gain_db"]))
    dst = os.path.join(REPO, "audio/intro/mix/intro-ep1-mix-V1-chipchamber-el.wav")
    M.write(dst, out)
    stems = dict(stems0, dialogue=stems0["dialogue"] + dvo)
    for k, x in stems.items():
        M.write(os.path.join(OUT, "stems-V1-el", f"intro-ep1-V1-el-stem-{k}.wav"), x)
    stem_resid = M.sample_peak_db(sum(stems.values()) - out)
    rebuild_vs_master = M.sample_peak_db(out_b - out)
    # the difference is the VO alone: outside the line the two masters are the same
    diff = out - orig
    n24, n96 = int(M.SR * 23 / 24), int(M.SR * 96 / 24)
    outside = M.sample_peak_db(np.concatenate([diff[:, :n24], diff[:, n96:]], axis=1))
    qa = dict(built_by="audio/ep01/v3-el/tools/el_intro.py mix (audio/intro/mix/scripts/mix_intro.py build('V1'), imported; "
                       "only the vo input swapped)",
              reproduction_residual_dbfs=round(resid, 1), master=os.path.relpath(dst, REPO),
              vo=os.path.relpath(os.path.join(OUT, "intro-vox_vo-el.wav"), REPO),
              difference_outside_f23_96_dbfs=round(outside, 1),
              method="the delivered V1 master + (EL VO - Kokoro VO), each through mix_intro's VO fader (-4 dB) and centring, "
                     "times the delivered build's gain curve (master gain + limiter). The limiter is idle over the line "
                     f"(f20-100: {20 * np.log10(max(lim_line, 1e-9)):.2f} dB), so this equals the full rebuild at the delivered "
                     "master gain; everything outside f23-96 is the delivered master sample for sample.",
              full_rebuild_crosscheck=dict(master_gain_db=info["master_gain_db"], peak_difference_dbfs=round(rebuild_vs_master, 1),
                                           note="build('V1') re-iterates the master gain with the new VO: 1.40 dB against 1.41"),
              stems_sum_residual_dbfs=round(stem_resid, 1), vo_centre_lr_diff_lu_el=lr1,
              kokoro=dict(master_gain_db=info0["master_gain_db"], lufs_i=round(M.lufs(orig), 2), dbtp=round(M.true_peak_db(orig), 2)),
              el=dict(master_gain_db=info0["master_gain_db"], lufs_i=round(M.lufs(out), 3), dbtp=round(M.true_peak_db(out), 2),
                      line_f24_92_lufs=round(float(M.lufs(out[:, int(M.SR * 24 / 24): int(M.SR * 92 / 24)])), 2),
                      line_f24_92_lufs_kokoro=round(float(M.lufs(orig[:, int(M.SR * 24 / 24): int(M.SR * 92 / 24)])), 2)),
              checks_el=info.get("checks"))
    jdump(qa, os.path.join(OUT, "mix-V1-el.json"))
    print(json.dumps({k: v for k, v in qa.items() if k != "checks_el"}, indent=1))


def main():
    import argparse
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sp = ap.add_subparsers(dest="cmd", required=True)
    x = sp.add_parser("render")
    x.add_argument("--only", nargs="*", default=[])
    sp.add_parser("analyze")
    x = sp.add_parser("build")
    x.add_argument("--p1", default="w2")
    x.add_argument("--p2", default="p2e")
    x.add_argument("--level-side", action="store_true", help="build_vo.py's WORLD levelling of 'side' (hanging, no rise)")
    sp.add_parser("mix")
    a = ap.parse_args()
    dict(render=cmd_render, analyze=cmd_analyze, build=cmd_build, mix=cmd_mix)[a.cmd](a)


if __name__ == "__main__":
    main()
