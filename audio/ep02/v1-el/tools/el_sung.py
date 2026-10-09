#!/usr/bin/env python3
"""el_sung.py - Ep2 v1: CHATGTP's "one wo-o-ord." (e2-a2-0030, 11.05), three-part harmony through the intro's sung-vocal
pipeline, not TTS (cast.md §2, §4; the beat plan's take slot). The voice is still Maya's (CHATGTP, Ep1's approved voice
and settings, unchanged): one short ElevenLabs read of the two words spoken, "One. Word.", is the singer's source, and the
intro's singer (audio/intro/vocals/scripts/sing.py + vlib.py, imported read-only, no bytecode written) re-sings it with
the WORLD vocoder: the onset consonant as spoken, the vowel sustained by a slow random walk through its own steady frames,
a new F0 line (a scoop into each note, glides between the notes of the melisma, delayed vibrato on the held note, 1/f
jitter and drift), the coda as spoken. No recording of anyone is used; nothing is cloned.

THE SETTING [J]: the show's knee motif's rise (F F F F G Ab C F; the intro's scat hook) on the four sung syllables, in
parallel fourths, so the three mouths stack quartal chords with no third (LEARNINGS S1, "the colours with no third"):
      one      wo-     -o-     -ord (held)
  top F4       G4      Ab4     C5
  mid C4       D4      Eb4     G4
  low G3       A3      Bb3     D4
on the 96 BPM swing grid (a long swung eighth 0.417 s, a short 0.208 s, a long 0.417 s, then two beats held, 1.25 s): about
2.3 s of the plan's 2.5. The parts are top 0 dB, mid -2, low -3, each its own seed, a formant offset (0, -1.5 %, -3 %),
a detune (0, +4, -5 cents) and a timing spread (0, +8, -6 ms). The score's chip echo goes under it (the cue's, not here).

Steps (render_v1.sh runs all three; the middle one needs pyworld, which is in audio/.venv-vocals):
  audio/.venv-casting/bin/python audio/ep02/v1-el/tools/el_sung.py      # source -> sing (vocals venv) -> the take + row
Writes audio/ep02/v1-el/ep02-v1/act2/sung/ (the source read, its manifest, the three part stems) and
act2/wav/e2-a2-0030__chatgtp-A.wav (dressed as every take: 0.35 s handles, -16 LUFS, -1.5 dBTP, room tone, dry), and adds
the row (special 'sung', with each note's time and pitches for the three mouths) to act2/lines-A.json.
"""
from __future__ import annotations

import json
import os
import subprocess
import sys
import types

sys.dont_write_bytecode = True
HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, "../../../.."))
LID, SEG, BEAT = "e2-a2-0030", "act2", "11.05"
OUT = os.path.join(REPO, "audio/ep02/v1-el/ep02-v1", SEG)
SUNG = os.path.join(OUT, "sung")
BP = os.path.join(REPO, "show/episodes/ep02/production/v1/beat-plan")
VOCALS_PY = os.path.join(REPO, "audio/.venv-vocals/bin/python")
SRC_TEXT = "One. Word."
BEAT_S = 60.0 / 96
SWING_L, SWING_S = BEAT_S * 2 / 3, BEAT_S / 3
NOTES = [  # syllable, source word, start (s, from the first vowel), length (s), midi per part (top, mid, low)
    ("one", 0, 0.0, SWING_L, [65, 60, 55]),
    ("wo-", 1, SWING_L, SWING_S, [67, 62, 57]),
    ("-o-", 1, SWING_L + SWING_S, SWING_L, [68, 63, 58]),
    ("-ord", 1, 2 * SWING_L + SWING_S, 2 * BEAT_S, [72, 67, 62]),
]
PARTS = [dict(name="top", gain_db=0.0, formant=1.0, detune=0.0, shift=0.0, seed=11),
         dict(name="mid", gain_db=-2.0, formant=0.985, detune=4.0, shift=0.008, seed=23),
         dict(name="low", gain_db=-3.0, formant=0.97, detune=-5.0, shift=-0.006, seed=37)]
NOTE_NAMES = {55: "G3", 57: "A3", 58: "Bb3", 60: "C4", 62: "D4", 63: "Eb4", 65: "F4", 67: "G4", 68: "Ab4", 72: "C5"}


def jload(p):
    with open(p) as f:
        return json.load(f)


# ============================================================================================ 1. the source read (casting venv)
def source():
    sys.path.insert(0, HERE)
    import el_render as R
    cast = R.Cast()
    c, rdef = cast.voice("chatgtp", "A")
    row = dict(id=f"{LID}-src", who="chatgtp", text=SRC_TEXT, tag="", beat=BEAT, delivery="the singer's source: the two words spoken")
    for sub in ("wav", "wav-device", "log"):
        os.makedirs(os.path.join(SUNG, sub), exist_ok=True)
    man = R.load_manifest(SUNG)
    args = types.SimpleNamespace(dry_run=False, redress=False, budget_left=40, reuse=[], target_lufs=-16.0, vo_lufs=None)
    rec, n = R.render_take(row, "chatgtp", c, rdef, cast, SUNG, man, args, print)
    R.save_manifest(SUNG, man)
    if len(rec["words"]) != 2:
        raise SystemExit(f"the source read aligned {len(rec['words'])} words, want 2")
    print(f"source {rec['file']}: sent {n} chars, asr {rec['qa']['asr']!r}")
    return rec


# ============================================================================================ 2. the singing (vocals venv)
def sing(src_wav, words_json, out_dir):
    sys.path.insert(0, os.path.join(REPO, "audio/intro/vocals/scripts"))
    import numpy as np
    import soundfile as sf
    import vlib as V
    import sing as SG
    FP, FS_F = SG.FP, SG.FS_F
    y, sr = sf.read(src_wav, dtype="float64")
    W = jload(words_json)

    def analyse(w):
        a, b = max(0.0, w["t0"] - 0.06), min(len(y) / sr, w["t1"] + 0.10)
        x = y[int(a * sr): int(b * sr)]
        f0, sp, ap = V.world(x, frame_period=FP, f0_floor=110, f0_ceil=600)
        n = len(f0)
        e = 20 * np.log10(V.rms_env(x, int(sr * FP / 1000)) + 1e-9)
        e = np.pad(e, (0, max(0, n - len(e))), constant_values=-120)[:n]
        voiced = f0 > 0
        steady = voiced & (e > e.max() - 9)
        best, cur = (0, 0), None
        for i in range(n + 1):
            if i < n and steady[i]:
                cur = i if cur is None else cur
            else:
                if cur is not None and i - cur > best[1] - best[0]:
                    best = (cur, i)
                cur = None
        v0, v1 = best
        if v1 - v0 < 10:
            v0, v1 = int(n * 0.3), int(n * 0.7)
        live = np.where(e > e.max() - 35)[0]
        return dict(f0=f0, sp=sp, ap=ap, e=e, v0=v0, v1=v1, on=int(live[0]), off=int(live[-1]) + 1)

    srcs = [analyse(w) for w in W]

    def syllable(src, notes, part, seed):
        """one sung syllable over one or more notes: onset as spoken, the vowel walked, the coda as spoken"""
        rng = np.random.default_rng(seed)
        on, v0, v1, off = src["on"], src["v0"], src["v1"], src["off"]
        k_on = np.arange(on, min(v0 + 3, v1)).astype(float)
        k_co = np.arange(max(v1 - 2, v0 + 4), min(off, v1 + 30)).astype(float)
        total = sum(d for _, d, _ in notes)
        n = max(12, int(round(total * FS_F)))
        n_sus = max(8, n - len(k_co))
        lo, hi = v0 + 3, max(v0 + 4, v1 - 3)
        mid, span = (lo + hi) / 2, (hi - lo) / 2
        ph = SG.pink(n_sus, rng, 60)
        walk = mid + span * 0.6 * np.tanh(ph)
        ramp = np.clip(np.arange(n_sus) / 30.0, 0, 1)
        walk = (1 - ramp) * min(max(v0 + 4.0, lo), hi) + ramp * walk
        idx = np.concatenate([k_on, walk, k_co])
        sp_ = SG._interp_frames(src["sp"], idx)
        ap_ = np.clip(SG._interp_frames(src["ap"], idx), 0, 1)
        if part["formant"] != 1.0:
            sp_ = V.warp_env(sp_, part["formant"])
        N = len(idx)
        t = (np.arange(N) - len(k_on)) / FS_F           # 0 at the vowel's start (the note's time)
        midi = np.zeros(N)
        starts = np.cumsum([0.0] + [d for _, d, _ in notes])
        for j, (m, d, _) in enumerate(notes):
            midi[t >= starts[j]] = m
        midi[t < 0] = notes[0][0]
        glide = int(0.04 * FS_F)                          # 40 ms raised-cosine glides inside the melisma
        for j in range(1, len(notes)):
            i0 = int(np.searchsorted(t, starts[j]))
            a_, b_ = max(0, i0 - glide // 2), min(N, i0 + glide // 2)
            if b_ > a_:
                w_ = 0.5 - 0.5 * np.cos(np.linspace(0, np.pi, b_ - a_))
                midi[a_:b_] = notes[j - 1][0] + (notes[j][0] - notes[j - 1][0]) * w_
        cents = -40 * np.exp(-np.clip(t, 0, None) / (0.07 / 2.5)) * (t >= 0)          # the scoop into the syllable
        last0, lastd = starts[-2], notes[-1][1]
        if lastd >= 0.5:                                  # delayed vibrato on a held note
            tl = t - last0
            depth = 18 * np.clip((tl - 0.35) / 0.4, 0, 1)
            cents += depth * np.sin(2 * np.pi * 5.3 * np.clip(tl, 0, None) + rng.uniform(0, 6.28))
            k = int(0.12 * FS_F)
            tail = (t > starts[-1] - 0.12) & (t <= starts[-1])
            cents[tail] += -35 * np.linspace(0, 1, tail.sum()) ** 2                   # a small fall at the release
        cents += 5 * SG.pink(N, rng, 3) * 0.5 + 6 * SG.pink(N, rng, 120) + part["detune"]
        f0 = 440.0 * 2 ** ((midi - 69) / 12) * 2 ** (cents / 1200)
        src_f0 = np.concatenate([src["f0"][k_on.astype(int)], np.ones(n_sus), src["f0"][k_co.astype(int)]])
        f0 = np.where(src_f0 > 0, f0, 0.0)                # the consonants keep their own voicing
        x = V.world_synth(f0, sp_, ap_, frame_period=FP)
        x = x[: int(N * FP / 1000 * sr)]
        env = np.ones(len(x))
        a_ = int(len(k_on) * FP / 1000 * sr)
        r_ = int(0.10 * sr)
        env[: max(1, a_)] = np.minimum(1.0, np.arange(max(1, a_)) / (0.004 * sr))
        env[-r_:] *= np.linspace(1, 0, r_) ** 1.5
        return x * env, len(k_on) / FS_F

    groups = [[NOTES[0]], NOTES[1:]]
    head = 0.25
    total = NOTES[-1][2] + NOTES[-1][3] + 0.6
    stems = {}
    for part in PARTS:
        pi = PARTS.index(part)
        buf = np.zeros(int((head + total) * sr))
        for g, notes in enumerate(groups):
            src = srcs[notes[0][1]]
            nn = [(n_[4][pi], n_[3], n_[0]) for n_ in notes]
            x, t_on = syllable(src, nn, part, part["seed"] + 101 * g)
            t0 = head + notes[0][2] + part["shift"] - t_on
            i0 = int(round(t0 * sr))
            buf[i0: i0 + len(x)] += x[: len(buf) - i0]
        buf /= (np.sqrt(np.mean(buf[buf != 0] ** 2)) + 1e-9)
        stems[part["name"]] = buf * 10 ** (part["gain_db"] / 20) * 0.08
    mix = sum(stems.values())
    os.makedirs(out_dir, exist_ok=True)
    for k, v in stems.items():
        sf.write(os.path.join(out_dir, f"part-{k}.wav"), v.astype(np.float32), sr, subtype="FLOAT")
    sf.write(os.path.join(out_dir, "mix.wav"), mix.astype(np.float32), sr, subtype="FLOAT")
    notes_out = [dict(syl=n_[0], t0=round(head + n_[2], 3), t1=round(head + n_[2] + n_[3], 3),
                      midi=n_[4], names=[NOTE_NAMES[m] for m in n_[4]]) for n_ in NOTES]
    with open(os.path.join(out_dir, "notes.json"), "w") as f:
        json.dump(dict(head_s=head, notes=notes_out, parts=PARTS), f, indent=1)
    print(f"sung: {len(stems)} parts, {len(mix) / sr:.2f} s -> {out_dir}")


# ============================================================================================ 3. the take and its row (casting venv)
def take(src_rec):
    sys.path.insert(0, HERE)
    import numpy as np
    import soundfile as sf
    import ellib
    import elaudio as E
    import el_render as R
    cast = R.Cast()
    c, rdef = cast.voice("chatgtp", "A")
    meta = jload(os.path.join(SUNG, "notes.json"))
    mix, sr = sf.read(os.path.join(SUNG, "mix.wav"), dtype="float32")
    d5 = E.rms_db(mix, 0.005)
    live = np.where(d5 > -40)[0]
    first, last = live[0] * 0.005, (live[-1] + 1) * 0.005
    a = max(0.0, first - E.HEAD)
    b = min(len(mix) / sr, last + E.TAIL)
    seg = mix[int(a * sr): int(b * sr)]
    h = np.zeros(int(E.HANDLE * sr), np.float32)
    y = np.concatenate([h, seg, h])
    gain_y = E.normalise(y, -16.0)
    g = float(np.sqrt(np.mean(gain_y ** 2)) / (np.sqrt(np.mean(y ** 2)) + 1e-12))
    y = gain_y + E.tone(len(gain_y), 30)
    off = E.HANDLE - a
    outp = os.path.join(OUT, "wav", f"{LID}__chatgtp-{c['cand']}.wav")
    E.write24(outp, y)
    for k in ("top", "mid", "low"):                      # the stems at the take's gain and timing, for the mix
        s, _ = sf.read(os.path.join(SUNG, f"part-{k}.wav"), dtype="float32")
        s = np.concatenate([h, s[int(a * sr): int(b * sr)] * g, h])
        E.write24(os.path.join(SUNG, f"{LID}__chatgtp-{c['cand']}.{k}.wav"), s)
    notes = [dict(n, t0=round(n["t0"] + off, 3), t1=round(n["t1"] + off, 3)) for n in meta["notes"]]
    # each note's pitch, measured on each part (YIN inside the note's middle half), in cents off its target
    import librosa
    errs = []
    for pi, k in enumerate(("top", "mid", "low")):
        s, _ = sf.read(os.path.join(SUNG, f"{LID}__chatgtp-{c['cand']}.{k}.wav"), dtype="float32")
        for n in notes:
            t0, t1 = n["t0"], n["t1"]
            q0, q1 = t0 + 0.25 * (t1 - t0), t0 + 0.75 * (t1 - t0)
            x = s[int(q0 * sr): int(q1 * sr)].astype(np.float64)
            if len(x) < 2048:
                continue
            tgt = 440.0 * 2 ** ((n["midi"][pi] - 69) / 12)
            f = librosa.yin(x, fmin=tgt / 1.5, fmax=tgt * 1.5, sr=sr, frame_length=2048, hop_length=480)
            med = float(np.median(f))
            errs.append(dict(part=k, syl=n["syl"], target=n["names"][pi], hz=round(med, 1),
                             cents=round(1200 * np.log2(med / tgt), 1)))
    m = E.measure(y, "one wo-o-ord.")
    asr_txt, _ = E.asr(y)
    words = [dict(w="one", t0=notes[0]["t0"], t1=notes[0]["t1"]), dict(w="wo-o-ord", t0=notes[1]["t0"], t1=notes[-1]["t1"])]
    row = next(r for r in R.read_rows(os.path.join(BP, f"{SEG}.json")) if r["id"] == LID)
    names = set(cast.d.get("names", []))
    new = {
        "id": LID, "kind": "dialogue", "scene": BEAT, "speaker": "CHATGTP", "speaker_slug": "chatgtp", "text": row["text"],
        "spoken_as": "(sung) one wo-o-ord", "tag": row["tag"], "delivery": row.get("delivery"), "on_camera": "on",
        "mode": "on-mic", "device": None, "file": os.path.relpath(outp, REPO), "file_device": None, "mp3": None,
        "duration_s": round(len(y) / sr, 3), "frames_24": int(round(len(y) / sr * 24)), "voiced_span_s": m["span_s"],
        "pace": {"audible_in_s": m["audible_in_s"], "audible_out_s": m["audible_out_s"],
                 "measured": {k: m[k] for k in ("span_s", "wpm", "syllables", "articulation_sps", "pauses_s")},
                 "longest_internal_gap_s": m["longest_internal_gap_s"], "words": m["words"], "wpm": m["wpm"],
                 "speed": None, "tsm": 1.0},
        "words": words, "notes": notes,
        "parts": {k: os.path.relpath(os.path.join(SUNG, f"{LID}__chatgtp-{c['cand']}.{k}.wav"), REPO) for k in ("top", "mid", "low")},
        "qa": dict(asr=asr_txt, cer=E.cer("one word", asr_txt), word_recall_nonames=E.word_recall("one word", asr_txt, names),
                   lufs_i=round(E.lufs(y), 2), target_lufs=-16.0, true_peak_dbtp=round(E.true_peak_db(y), 2),
                   clipped_samples=int((np.abs(y) >= 0.999).sum()), digital_black_runs=E.zero_runs(y),
                   median_f0_hz=m["median_f0_hz"], f0_range_st=m["f0_range_st"], speech_head_s=m["speech_head_s"],
                   speech_tail_s=m["speech_tail_s"], raw_tail_cut=False, pitch_cents=errs,
                   pitch_max_abs_cents=max(abs(e["cents"]) for e in errs) if errs else None),
        "voice": f"ElevenLabs library voice '{c['voice_name']}' (CHATGTP, Ep1's settings) spoken, re-sung in three parts "
                 f"through the intro's WORLD singer (audio/intro/vocals/scripts/sing.py)",
        "voiceId": c["voice_id"], "model": "eleven_multilingual_v2 (the source read) + WORLD (pyworld) re-synthesis",
        "el": {"cand": c["cand"], "role": "chatgtp", "voice_id": c["voice_id"], "voice_name": c["voice_name"],
               "source_take": src_rec["file"], "source_text": SRC_TEXT, "settings": src_rec["settings"],
               "seed": src_rec["seed"], "request_key": src_rec["key"], "chars_sent": len(src_rec["sent"])},
        "status": "el", "take": "sung", "special": "sung",
        "processing": ["the source: Maya's spoken 'One. Word.' (one EL read, dressed as every take)",
                       "WORLD analysis (harvest, CheapTrick, D4C, 5 ms) of each word; re-sung by the intro singer's method",
                       "three parts in parallel fourths (top 0 dB, mid -2, low -3), each its own seed, formant, detune and timing",
                       "0.35 s handles, -16 LUFS, true peak <= -1.5 dBTP, room tone -62 dBFS; DRY (the room is the mix's)"],
        "kokoro_ref": {},
    }
    p = os.path.join(OUT, "lines-A.json")
    order = [ln["id"] for b_ in jload(os.path.join(BP, f"{SEG}.json"))["beats"] for ln in b_.get("lines") or []]
    L = [x for x in jload(p) if x["id"] != LID] + [new]
    L.sort(key=lambda x: order.index(x["id"]) if x["id"] in order else 10 ** 6)
    ellib.jdump(L, p)
    print(f"{LID} sung: {new['duration_s']:.2f} s (span {m['span_s']:.2f}), lufs {new['qa']['lufs_i']}, pitch max "
          f"{new['qa']['pitch_max_abs_cents']} cents, asr {asr_txt!r}")


def main():
    if len(sys.argv) > 1 and sys.argv[1] == "_sing":
        sing(sys.argv[2], sys.argv[3], sys.argv[4])
        return
    rec = source()
    wj = os.path.join(SUNG, "source-words.json")
    with open(wj, "w") as f:
        json.dump(rec["words"], f, indent=1)
    env = dict(os.environ, PYTHONDONTWRITEBYTECODE="1")
    subprocess.run([VOCALS_PY, os.path.abspath(__file__), "_sing", os.path.join(REPO, rec["file"]), wj, SUNG],
                   check=True, env=env)
    take(rec)


if __name__ == "__main__":
    main()
