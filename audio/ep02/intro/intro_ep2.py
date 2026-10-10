#!/usr/bin/env python3
"""intro_ep2.py - the Ep2 intro variant's sound (pipeline.md §8.3 step 4, §8.6; show/episodes/ep02/intro-slot.md item 1).

**The line is Ep1's (the showrunner, 2026-10-10: "the typed quote stays 'near the singularity; unclear which side.' in
every episode").** Ep2's picture types and posts Ep1's line (studio/src/episodes/ep02/intro/slot.ts), so its sound over
the cold open is Ep1's too, and the only Ep2 changes left in the intro (the dot's rest, the ESC keycap, the subtitle)
are silent. The master is therefore Ep1's aired intro master, the EL film's (Jeremy reads the line, as he voices Mas in
Ep2): audio/intro/mix/intro-ep1-mix-V1-chipchamber-el.wav, copied byte for byte.

  mix      (.venv-mix)      Ep1's aired master -> audio/intro/ep02/intro-ep2-mix-V1-chipchamber.wav (the name the
                            manifest plays at -3 dB), its D/M/E stems (Ep1's EL stems) and mix-qa.json

The first build (2026-10-10, 09e604c) swapped Ep1's line for Jeremy's "her" and its 3 key taps; the showrunner turned
it down the same day. Its steps stay for the record (takes/, reads-analysis.json, vo-qa.json and sfx-qa.json are its
QA) and rebuild it only with `mix --line her`:
  render   (.venv-casting)  the reads of "her" (Jeremy, eleven_multilingual_v2, Mas's V.O. settings); the key stays in ellib
  analyze  (.venv-casting)  each read: ASR, the voiced span, its pitch and loudness -> reads-analysis.json
  build    (.venv-vocals)   the chosen read on the intro clock (onset f24.0, fitted to end by f33), Ep1's intro-vox chain
                            verbatim, the -66 dBFS dark-room tone under f22-95 -> intro-vox_vo-ep2.wav + vo-qa.json
  sfx      (.venv)          Ep1's SFX builder imported read-only (its src/ cache redirected to scratch): the main bus
                            rebuilt with "her"'s keystrokes, checked against the delivered Ep1 stem -> intro-sfx_stem-ep2.wav
  mix --line her (.venv-mix) the delivered V1 master + the two swaps (the retired master)

Writes only under audio/ep02/intro/ and audio/intro/ep02/ (never audio/intro/mix/, audio/intro/sfx/ or audio/intro/vox/,
which are Ep1's locked inputs). No voice is cloned; the read is a library voice from text.
  PYTHONDONTWRITEBYTECODE=1 bash ops/heavy.sh audio/.venv-mix/bin/python audio/ep02/intro/intro_ep2.py mix
"""
from __future__ import annotations

import json
import os
import sys

sys.dont_write_bytecode = True
HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, "../../.."))
TAKES = os.path.join(HERE, "takes")
MASTER_DIR = os.path.join(REPO, "audio/intro/ep02")
MASTER = os.path.join(MASTER_DIR, "intro-ep2-mix-V1-chipchamber.wav")
# Ep1's aired intro: the EL film's master (show/reel/ep01-v35-el, Jeremy's read of the line) and its stems
EP1_MASTER = os.path.join(REPO, "audio/intro/mix/intro-ep1-mix-V1-chipchamber-el.wav")
EP1_STEMS = os.path.join(REPO, "audio/ep01/v3-el/intro/stems-V1-el")
EP1_KOKORO = os.path.join(REPO, "audio/intro/mix/intro-ep1-mix-V1-chipchamber.wav")
EL_TOOLS = os.path.join(REPO, "audio/ep02/v1-el/tools")
FPS, SR = 24, 48000

VOICE = "EwzF7Z2UMSib9JaKx0Kg"           # Jeremy - Warm, Trustworthy, Sincere (Mas; audio/ep02/cast-el.json)
MODEL = "eleven_multilingual_v2"
# Mas's V.O. settings (cast-el.json: stability 0.6, speed 0.82) and Ep1's intro read (stability 0.65, speed 0.95):
# soft, close, steady, no style. One syllable, lowercase, unhurried (intro-slot.md, "Delivery note for the line").
SOFT = dict(stability=0.62, similarity_boost=0.75, style=0.0, use_speaker_boost=True)
READS = [dict(name="h1", text="her.", speed=0.9, seed=2101), dict(name="h2", text="her.", speed=0.9, seed=2202),
         dict(name="h3", text="her", speed=0.9, seed=2303), dict(name="h4", text="her...", speed=0.9, seed=2404),
         dict(name="h5", text="her...", speed=0.85, seed=2505), dict(name="h6", text="Her.", speed=0.85, seed=2606),
         dict(name="h7", text="her.", speed=0.82, seed=2707), dict(name="h8", text="her", speed=0.95, seed=2808)]
ONSET_F = 24.0          # the VO's first sound (Ep1's "near" sat at f23.92-24.10): typing leads it by 6 frames (f18)
END_MAX_F = 36.5        # intro-slot.md: "about f24-33". The level, unhurried read (h7, Mas's V.O. speed 0.82) runs 14.8 f
                        # to -40 dB; squeezed into 9 f it would be hurried, so it is fitted to end by f36.5 (its decay)
                        # and the typing indicator takes over after it (slot.ts EP2_SLOT.line.indicator)
STRETCH_MAX = 1.18      # at most 18 % shorter (one Rubber Band pass), never longer
TONE = (22, 95)         # the dark-room tone under the VO stem, Ep1's span (el_intro.py)
KEYS = [18, 19, 21]     # studio/src/episodes/ep02/intro/slot.ts EP2_SLOT.line.keys1: "her", 6 frames ahead of the VO


def jdump(o, p):
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p + ".tmp", "w") as f:
        json.dump(o, f, indent=1, ensure_ascii=False)
        f.write("\n")
    os.replace(p + ".tmp", p)


# ------------------------------------------------------------------------------------------------ render, analyze
def cmd_render(a):
    sys.path.insert(0, EL_TOOLS)
    import ellib
    os.makedirs(TAKES, exist_ok=True)
    log = []
    for r in READS:
        if a.only and r["name"] not in a.only:
            continue
        mp3, js = os.path.join(TAKES, r["name"] + ".mp3"), os.path.join(TAKES, r["name"] + ".json")
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
    p = os.path.join(HERE, "render-log.json")
    old = json.load(open(p)) if os.path.exists(p) else []
    jdump(old + log, p)


def load_read(name):
    """-> 48 kHz mono float64 (the wav written by analyze, else the decoded MP3)"""
    import numpy as np
    wav = os.path.join(TAKES, name + ".wav")
    if os.path.exists(wav):
        import soundfile as sf
        return sf.read(wav, dtype="float64")[0]
    sys.path.insert(0, EL_TOOLS)
    import elaudio as E
    y = E.decode(open(os.path.join(TAKES, name + ".mp3"), "rb").read()).astype(np.float64)
    if len(y) == 0:
        raise SystemExit(f"{name}: the MP3 decoded to nothing here; run analyze (.venv-casting) first")
    return y


def voiced_span(y, thr=-40.0, hop=0.005):
    """first and last sound (5 ms RMS, thr dB re the read's loudest 5 ms) -> (t0, t1) seconds"""
    import numpy as np
    n = int(hop * SR)
    m = len(y) // n
    e = 20 * np.log10(np.sqrt(np.mean(y[: m * n].reshape(m, n) ** 2, 1) + 1e-12))
    e -= e.max()
    idx = np.nonzero(e > thr)[0]
    return idx[0] * hop, (idx[-1] + 1) * hop


def cmd_analyze(a):
    import numpy as np
    import soundfile as sf
    sys.path.insert(0, EL_TOOLS)
    import elaudio as E
    rows = {}
    for r in READS:
        if not os.path.exists(os.path.join(TAKES, r["name"] + ".mp3")):
            continue
        y = load_read(r["name"])
        sf.write(os.path.join(TAKES, r["name"] + ".wav"), y.astype(np.float32), SR, subtype="FLOAT")
        t0, t1 = voiced_span(y)
        m = E.measure(y.astype(np.float32), "her")
        txt, ws = E.asr(y.astype(np.float32))
        # the pitch shape over the vowel: the first and last thirds' median F0 (a statement stays level or settles;
        # a question rises), YIN at 16 kHz on frames within 28 dB of the peak (the house f0_fast frames)
        import librosa
        seg = y[int(t0 * SR): int(t1 * SR)]
        y16 = __import__("scipy.signal", fromlist=["resample_poly"]).resample_poly(seg, 1, 3)
        f0 = librosa.yin(y16, fmin=60, fmax=300, sr=16000, frame_length=1024, hop_length=160)
        rms = librosa.feature.rms(y=y16, frame_length=1024, hop_length=160)[0][: len(f0)]
        f0 = f0[: len(rms)][20 * np.log10(rms / (rms.max() + 1e-12) + 1e-12) > -28]
        thirds = [round(float(np.median(q)), 1) for q in np.array_split(f0, 3)] if len(f0) >= 6 else None
        rows[r["name"]] = dict(text=r["text"], speed=r["speed"], seed=r["seed"], asr=txt,
                               voiced_s=[round(t0, 3), round(t1, 3)], span_s=round(t1 - t0, 3),
                               span_frames=round((t1 - t0) * FPS, 2), median_f0_hz=m["median_f0_hz"],
                               f0_range_st=m["f0_range_st"], f0_thirds_hz=thirds,
                               lufs=round(float(E.lufs(y.astype(np.float32))), 2))
        print(r["name"], json.dumps(rows[r["name"]]))
    jdump(rows, os.path.join(HERE, "reads-analysis.json"))


# ------------------------------------------------------------------------------------------------ build (the VO stem)
def momentary_max(x, t0, t1):
    """the highest 400 ms (100 ms hop) BS.1770 loudness of stereo x (2, N) inside [t0, t1] s"""
    import pyloudnorm as pyln
    m = pyln.Meter(SR)
    w, hop = int(0.4 * SR), int(0.1 * SR)
    a, b = int(t0 * SR), int(t1 * SR)
    best = -120.0
    for j in range(a, max(a + 1, b - w + 1), hop):
        seg = x[:, j:j + w].T
        if seg.shape[0] < w:
            break
        v = m.integrated_loudness(seg)
        best = max(best, v)
    return best


def cmd_build(a):
    import numpy as np
    import soundfile as sf
    import pedalboard as pb
    sys.path.insert(0, os.path.join(REPO, "audio/intro/vox/scripts"))
    import ivlib as V                                             # the intro-vox helpers (read-only)
    y = load_read(a.read)
    t0, t1 = voiced_span(y)
    pre, post = 0.05, 0.12
    x = y[max(0, int((t0 - pre) * SR)): int(min(len(y) / SR, t1 + post) * SR)].astype(np.float32)
    span_f = (t1 - t0) * FPS
    room = END_MAX_F - ONSET_F
    ratio = 1.0
    if span_f > room:                                             # one variable-rate pass, the word only
        ratio = min(STRETCH_MAX, span_f / room)
        x = pb.time_stretch(x[None, :], SR, stretch_factor=ratio, high_quality=True, transient_mode="crisp",
                            preserve_formants=True)[0].astype(np.float32)
    x = x.astype(np.float64)
    start = ONSET_F / FPS - pre / ratio                           # the first sound on f24.0
    dry = np.zeros(int(4.4 * SR))
    i = int(round(start * SR))
    dry[i:i + len(x)] += V.fade(x, 0.002, 0.05)[: len(dry) - i]
    # the close-mic softness: build_vo.py's chain, verbatim (as el_intro.py)
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
    vo = V.timeline([(yv, 0.0, 1.0)])
    # the level: Ep1's EL stem is set to a short-term (3 s) max of -16 LUFS over a 2.8 s line; one word in a 3 s
    # window would be pushed ~8 dB hotter that way. So the word is matched to the line's own opening words instead:
    # its momentary (400 ms) max = the momentary max of Ep1's EL stem over "near the" (f23-35)
    el1, _ = sf.read(os.path.join(REPO, "audio/ep01/v3-el/intro/intro-vox_vo-el.wav"), always_2d=True)
    el1 = el1.T
    ref = momentary_max(el1, 23 / FPS, 35 / FPS)
    cur = momentary_max(vo, (ONSET_F - 1) / FPS, (ONSET_F + 12) / FPS)
    vo *= 10 ** ((ref - cur) / 20)
    rt = V.room_tone(V.fs(TONE[1]) - V.fs(TONE[0]), -66.0)
    rt = V.fade(rt, 2 / FPS, 3 / FPS)
    tone = V.timeline([(rt, V.fs(TONE[0]), 1.0)])
    stem = vo + tone
    os.makedirs(HERE, exist_ok=True)
    wav = os.path.join(HERE, "intro-vox_vo-ep2.wav")
    sf.write(wav, stem.T.astype(np.float32), SR, subtype="PCM_24")
    # where the voice sits on the intro clock (5 ms RMS, -40 dB re its own peak, on the dry voice)
    vd = vo.mean(0)
    v0, v1 = voiced_span(vd)
    spanf = V.audible_span(stem, -60)
    qa = dict(read=a.read, text=next(r["text"] for r in READS if r["name"] == a.read), stretch_ratio=round(ratio, 3),
              voiced_frames=[round(v0 * FPS, 2), round(v1 * FPS, 2)], target=dict(onset_f=ONSET_F, end_max_f=END_MAX_F),
              level=dict(method="momentary max (400 ms) of the word = Ep1 EL stem's over 'near the' (f23-35)",
                         ref_lufs_m=round(ref, 2), word_lufs_m=round(momentary_max(vo, 0, 3.0), 2),
                         gain_db=round(ref - cur, 2)),
              stem=V.stats(stem, "ep2"), stem_ep1_el=V.stats(el1, "ep1-el"), audible_span_frames=spanf,
              deess_max_gr_db=round(float(de_gr), 2),
              chain="build_vo.py's, verbatim (el_intro.py): WORLD breath layer -24 dB, HPF 90, +1.5 dB shelf @170, "
                    "-2 dB @3.2k, -1.5 dB @6.5k, -2.5 dB shelf @8k, 2:1 comp, tanh (5 dB, 22 %), split-band de-esser "
                    "4.8-10k, dark-room IR 14 % wet, -66 dBFS dark-room tone f22-95")
    jdump(qa, os.path.join(HERE, "vo-qa.json"))
    print(json.dumps(qa, indent=1))


# ------------------------------------------------------------------------------------------------ sfx
def cmd_sfx(a):
    """Ep1's SFX builder, imported read-only. Its synthesized one-shots are cached into src/ by get_src(): that folder
    is redirected to scratch, so nothing under audio/intro/sfx/ is written. Step 1 rebuilds Ep1's main bus from the
    builder's own picture profile and checks it against the delivered stem (it must match to the 24-bit LSB); step 2
    swaps the typed line's taps for Ep2's and writes the Ep2 stem."""
    import numpy as np
    import soundfile as sf
    scratch = a.scratch or os.path.join(HERE, "_work")
    os.makedirs(scratch, exist_ok=True)
    sys.path.insert(0, os.path.join(REPO, "audio/intro/sfx"))
    import build_intro_sfx as B
    B.SRC = os.path.join(scratch, "sfx-src")                        # get_src() caches here, never in audio/intro/sfx/src
    if a.events:
        B.EVENTS_JSON = os.path.abspath(a.events)
    delivered = sf.read(os.path.join(REPO, "audio/intro/sfx/intro-sfx_stem.wav"), always_2d=True)[0]
    # 1. Ep1, as the builder makes it (the picture profile, Ep1's events and keystrokes)
    B._cache.clear()
    B.set_profile("picture")
    sync1 = B.apply_picture_F()
    E1 = B.build_spot()
    bus1, rows1 = B.render(E1)
    resid1 = float(20 * np.log10(np.max(np.abs(bus1["main"] - delivered)) + 1e-12))
    keys1 = [r for r in rows1 if r["id"].startswith("co.key.")]
    # 2. Ep2: the same spot with the typed line swapped ("her", 3 keystrokes, no second line, no shift+enter)
    B._cache.clear()
    B.set_profile("picture")
    sync2 = B.apply_picture_F()
    B.L1, B.L2 = "her", ""
    B.VO_WORDS = [(24, 33)]
    B.PROFILE.update(keys1=list(KEYS), keys2=[], brk=None, keysrc="studio/src/episodes/ep02/intro/slot.ts EP2_SLOT")
    E2 = B.build_spot()
    bus2, rows2 = B.render(E2)
    keys2 = [r for r in rows2 if r["id"].startswith("co.key.")]
    # everything but the taps is Ep1's, sample for sample
    other1 = {r["id"]: r for r in rows1 if not r["id"].startswith("co.key.")}
    other2 = {r["id"]: r for r in rows2 if not r["id"].startswith("co.key.")}
    same_other = all(other1[k]["startSample"] == other2[k]["startSample"] and other1[k]["gain"] == other2[k]["gain"]
                     for k in other1) and set(other1) == set(other2)
    ep2 = delivered + (bus2["main"] - bus1["main"])                  # the delivered stem with only the taps swapped
    out = os.path.join(HERE, "intro-sfx_stem-ep2.wav")
    sf.write(out, np.clip(ep2, -1, 1).astype(np.float32), SR, subtype="PCM_24")
    diff = ep2 - delivered
    n = lambda f: int(f * SR / FPS)                                      # noqa: E731
    outside = float(20 * np.log10(np.max(np.abs(np.concatenate([diff[:n(17)], diff[n(90):]]))) + 1e-12))
    qa = dict(builder="audio/intro/sfx/build_intro_sfx.py (imported read-only; src/ redirected to scratch)",
              events=os.path.relpath(B.EVENTS_JSON, REPO), ep1_rebuild_vs_delivered_peak_dbfs=round(resid1, 1),
              ep1_key_taps=len(keys1), ep2_key_taps=[dict(id=r["id"], frame=r["frame"], peak_dbfs=r["peakDbfs"],
                                                          file=r["file"]) for r in keys2],
              every_other_event_unchanged=bool(same_other), events_other=len(other2),
              difference_outside_f17_90_dbfs=round(outside, 1),
              typing_check_ep1=sync1.get("typingCheck"), typing_check_ep2=sync2.get("typingCheck"),
              method="the delivered Ep1 stem + (Ep2's main bus - Ep1's main bus), both rendered by the builder from the same "
                     "events; the two differ only in the typed line's key-tap events")
    jdump(qa, os.path.join(HERE, "sfx-qa.json"))
    print(json.dumps(qa, indent=1))
    if resid1 > -100:
        raise SystemExit(f"the builder does not reproduce the delivered Ep1 stem ({resid1:.1f} dBFS): not trusted")


# ------------------------------------------------------------------------------------------------ mix
def sha1(p):
    import hashlib
    h = hashlib.sha1()
    with open(p, "rb") as f:
        for b in iter(lambda: f.read(1 << 20), b""):
            h.update(b)
    return h.hexdigest()


def cmd_mix(a):
    """Ep1's line: the master is Ep1's aired intro master, byte for byte (its stems with it), measured against Ep1's
    two masters and the retired "her" master it replaces."""
    if a.line == "her":
        return cmd_mix_her(a)
    import shutil
    sys.path.insert(0, os.path.join(REPO, "audio/intro/mix/scripts"))
    import mix_intro as M
    prev = M.read(MASTER) if os.path.exists(MASTER) else None
    os.makedirs(MASTER_DIR, exist_ok=True)
    shutil.copyfile(EP1_MASTER, MASTER + ".tmp")
    os.replace(MASTER + ".tmp", MASTER)
    stems = {}
    for k in ("music", "sfx", "dialogue"):
        dst = os.path.join(HERE, "stems-V1", f"intro-ep2-V1-stem-{k}.wav")
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        shutil.copyfile(os.path.join(EP1_STEMS, f"intro-ep1-V1-el-stem-{k}.wav"), dst)
        stems[k] = M.read(dst)
    out, ep1, kok = M.read(MASTER), M.read(EP1_MASTER), M.read(EP1_KOKORO)
    seg = lambda x, f0, f1: x[:, int(M.SR * f0 / 24): int(M.SR * f1 / 24)]      # noqa: E731
    spans = dict(f0_18=(0, 18), f18_120=(18, 120), f120_720=(120, 720))
    pk = lambda x, y: {k: round(M.sample_peak_db(seg(x - y, *v)), 1) for k, v in spans.items()}    # noqa: E731
    qa = dict(built_by="audio/ep02/intro/intro_ep2.py mix (the line is Ep1's: the master is Ep1's aired intro master, "
                       "copied byte for byte)",
              decision="the showrunner, 2026-10-10: the typed quote stays 'near the singularity; unclear which side.' in "
                       "every episode; the first build's \"her\" and its key taps are dropped",
              master=os.path.relpath(MASTER, REPO), source=os.path.relpath(EP1_MASTER, REPO),
              sha1=dict(master=sha1(MASTER), source=sha1(EP1_MASTER)), byte_identical=sha1(MASTER) == sha1(EP1_MASTER),
              stems=os.path.relpath(os.path.join(HERE, "stems-V1"), REPO) + " (Ep1's EL stems: "
                    + os.path.relpath(EP1_STEMS, REPO) + ")",
              stems_sum_residual_dbfs=round(M.sample_peak_db(sum(stems.values()) - out), 1),
              difference_dbfs=dict(vs_ep1_aired_el=pk(out, ep1), vs_ep1_kokoro_v1=pk(out, kok),
                                   vs_retired_her_master=pk(out, prev) if prev is not None else None),
              ep2=dict(lufs_i=round(M.lufs(out), 3), dbtp=round(M.true_peak_db(out), 2),
                       coldopen_f0_120_lufs=round(float(M.lufs(seg(out, 0, 120))), 2)),
              note="the picture's only Ep2 changes (the dot's rest at 0.55, the ESC keycap, the subtitle) make no "
                   "sound, so nothing else is swapped; the manifest plays this file at -3 dB as Ep1's film did")
    if not qa["byte_identical"]:
        raise SystemExit("the copy is not byte-identical to Ep1's aired master")
    jdump(qa, os.path.join(HERE, "mix-qa.json"))
    print(json.dumps(qa, indent=1))


def cmd_mix_her(a):
    """RETIRED (the first build, turned down 2026-10-10): the delivered V1 master with the VO and the SFX swapped, through the delivered build's own gain curve (its master
    gain and limiter): everything outside the cold open's line is the delivered master sample for sample."""
    import numpy as np
    sys.path.insert(0, os.path.join(REPO, "audio/intro/mix/scripts"))
    import mix_intro as M
    b = M.bus_inputs()
    orig = M.read(os.path.join(REPO, "audio/intro/mix/intro-ep1-mix-V1-chipchamber.wav"))
    out0, stems0, info0, gc0 = M.build("V1", b)
    resid = M.sample_peak_db(out0 - orig)
    vo2 = M.read(os.path.join(HERE, "intro-vox_vo-ep2.wav"))
    sfx2 = M.read(os.path.join(HERE, "intro-sfx_stem-ep2.wav"))
    tr0, _ = M.vo_centre(b["vo"])
    tr2, lr2 = M.vo_centre(vo2)
    dvo = (vo2 * tr2 - b["vo"] * tr0) * M.db(M.VO_DB) * gc0
    dsfx = (sfx2 - b["sfx"]) * gc0
    out = orig + dvo + dsfx
    # the limiter over the line (f0-120) must be idle for the swap to equal a rebuild at the delivered master gain
    lim = gc0 / M.db(info0["master_gain_db"])
    lim_line_db = float(20 * np.log10(np.min(lim[:, : int(M.SR * 120 / 24)]) + 1e-12))
    b2 = dict(b, vo=vo2, sfx=sfx2)
    out_b, stems_b, info_b, _ = M.build("V1", b2)                   # the full rebuild: a cross-check
    os.makedirs(MASTER_DIR, exist_ok=True)
    M.write(MASTER, out)
    stems = dict(stems0, dialogue=stems0["dialogue"] + dvo, sfx=stems0["sfx"] + dsfx)
    for k, x in stems.items():
        M.write(os.path.join(HERE, "stems-V1", f"intro-ep2-V1-stem-{k}.wav"), x)
    diff = out - orig
    n120 = int(M.SR * 120 / 24)
    outside = M.sample_peak_db(diff[:, n120:])
    seg = lambda x, f0, f1: x[:, int(M.SR * f0 / 24): int(M.SR * f1 / 24)]      # noqa: E731
    qa = dict(built_by="audio/ep02/intro/intro_ep2.py mix (audio/intro/mix/scripts/mix_intro.py build('V1'), imported; "
                       "only the vo and sfx inputs swapped)",
              reproduction_residual_dbfs=round(resid, 1), master=os.path.relpath(MASTER, REPO),
              vo=os.path.relpath(os.path.join(HERE, "intro-vox_vo-ep2.wav"), REPO),
              sfx=os.path.relpath(os.path.join(HERE, "intro-sfx_stem-ep2.wav"), REPO),
              limiter_over_f0_120_db=round(lim_line_db, 3),
              difference_after_f120_dbfs=round(outside, 1),
              method="the delivered V1 master + (Ep2 VO - Kokoro VO) through mix_intro's VO fader (-4 dB) and centring + "
                     "(Ep2 SFX - Ep1 SFX), each times the delivered build's gain curve (master gain + limiter). The "
                     "limiter is idle over the cold open, so this equals the full rebuild at the delivered master gain, "
                     "and everything from f120 on is the delivered master sample for sample.",
              full_rebuild_crosscheck=dict(master_gain_db=info_b["master_gain_db"],
                                           peak_difference_dbfs=round(M.sample_peak_db(out_b - out), 1)),
              stems_sum_residual_dbfs=round(M.sample_peak_db(sum(stems.values()) - out), 1), vo_centre_lr_diff_lu=lr2,
              ep1=dict(lufs_i=round(M.lufs(orig), 2), dbtp=round(M.true_peak_db(orig), 2)),
              ep2=dict(lufs_i=round(M.lufs(out), 3), dbtp=round(M.true_peak_db(out), 2),
                       coldopen_f0_120_lufs=round(float(M.lufs(seg(out, 0, 120))), 2),
                       coldopen_f0_120_lufs_ep1=round(float(M.lufs(seg(orig, 0, 120))), 2),
                       word_f22_36_lufs=round(float(M.lufs(seg(out, 22, 36))), 2),
                       silence_f36_90_lufs=round(float(M.lufs(seg(out, 36, 90))), 2)),
              checks=info_b.get("checks"))
    jdump(qa, os.path.join(HERE, "mix-qa.json"))
    print(json.dumps({k: v for k, v in qa.items() if k != "checks"}, indent=1))


def main():
    import argparse
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sp = ap.add_subparsers(dest="cmd", required=True)
    x = sp.add_parser("render")
    x.add_argument("--only", nargs="*", default=[])
    sp.add_parser("analyze")
    x = sp.add_parser("build")
    x.add_argument("--read", default="h7")
    x = sp.add_parser("sfx")
    x.add_argument("--scratch", default=None, help="where the builder's synthesized one-shots are cached")
    x.add_argument("--events", default=None, help="the picture events (default: Ep1's intro-events.json)")
    x = sp.add_parser("mix")
    x.add_argument("--line", choices=["ep1", "her"], default="ep1",
                   help="ep1 (the default, the showrunner's call): Ep1's aired master; her: the retired first build")
    a = ap.parse_args()
    dict(render=cmd_render, analyze=cmd_analyze, build=cmd_build, sfx=cmd_sfx, mix=cmd_mix)[a.cmd](a)


if __name__ == "__main__":
    main()
