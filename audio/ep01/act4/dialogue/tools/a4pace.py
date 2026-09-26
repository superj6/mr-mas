"""a4pace.py - the draft 3.2 pace pass on top of a4lib (tighten-changes §3).

What it adds to a4lib's take renderer:
  * span-targeted speed: every take is solved for an audible span (the §2 target, or the line's aim) through Kokoro's
    speed control. Kokoro's duration predictor is deterministic for a given text, voice and speed (the seed only drives
    the vocoder), and its durations scale as 1/speed, so one probe read gives the speed; a take whose own context
    (a carrier) moves it more than 5% off is read once more at its own solved speed;
  * light time-compression only where the speed solver hits its clamp: Rubber Band (R3 engine, via pedalboard's
    time_stretch, formants preserved), at most x1.10, logged per take;
  * hard cut-offs: a line read on into a continuation (so the cut word keeps a mid-sentence contour) and cut at the
    closure before it, or cut inside a word after n phonemes; the delivered file ends on the cut consonant with a 3 ms
    de-click ramp and no tail pad, re-cut after the FX chain so nothing (pitch shifter, compressor) smears it;
  * tight trims: 20 ms head / 40 ms tail of silence (was 30 / 80), 4 ms / 10 ms ramps inside the pads; a flat noise
    tail (breath or vocoder hiss sitting between -52 and -40 dB for more than 0.15 s after the word) is ended 30 ms after
    the last audible frame, plus the pad;
  * measurement helpers: audible span, longest internal gap, words per minute on the audible span.
"""
from __future__ import annotations

import numpy as np
import pedalboard as pb
from scipy.signal import resample_poly

import a4lib as L

SR_TTS, SR = L.SR_TTS, L.SR
HEAD_PAD, TAIL_PAD = 0.020, 0.040
TSM_MAX = 1.10


def audible(y, sr, thresh_db=-40.0, win=0.01):
    """(first, last) audible time (s): 10 ms RMS frames above thresh_db rel. the clip's peak frame."""
    env, hop = L.V._rms_frames(y, sr, win)
    db = 20 * np.log10(env / env.max())
    idx = np.where(db > thresh_db)[0]
    if not len(idx):
        return 0.0, len(y) / sr
    return idx[0] * hop / sr, (idx[-1] + 1) * hop / sr


def span(y, sr):
    a, b = audible(y, sr)
    return b - a


def longest_gap(y, sr, thresh_db=-40.0, win=0.01):
    """Longest run of sub-threshold 10 ms frames strictly inside the audible span (an internal pause)."""
    env, hop = L.V._rms_frames(y, sr, win)
    db = 20 * np.log10(env / env.max())
    idx = np.where(db > thresh_db)[0]
    if len(idx) < 2:
        return 0.0
    quiet = db[idx[0]: idx[-1] + 1] <= thresh_db
    best = cur = 0
    for q in quiet:
        cur = cur + 1 if q else 0
        best = max(best, cur)
    return best * hop / sr


def _trim(y, sr, toks, thresh_db, head_pad, tail_pad, fade_in=0.004, fade_out=0.010):
    env, hop = L.V._rms_frames(y, sr)
    ref = env.max()
    idx = np.where(20 * np.log10(env / ref) > thresh_db)[0]
    if len(idx) == 0:
        return y, toks, 0.0
    s = max(0, idx[0] * hop - int(head_pad * sr))
    e = min(len(y), (idx[-1] + 1) * hop + int(tail_pad * sr))
    out = y[s:e].copy()
    fi, fo = int(fade_in * sr), int(fade_out * sr)
    if fi:
        out[:fi] *= np.linspace(0, 1, fi)
    if fo:
        out[-fo:] *= np.linspace(1, 0, fo)
    off, dur = s / sr, len(out) / sr
    new = []
    for t in toks:
        t0, t1 = max(0.0, t["t0"] - off), min(dur, max(0.0, t["t1"] - off))
        new.append(dict(t, t0=t0, t1=max(t0, t1)))
    return out, new, off


def hard_tail_cut(y, toks, n_line_words, fade=0.003):
    """Cut a continuation off the end at the quietest 5 ms frame between the line's last word and the next word (for a
    cut-off, that is the closure before the continuation's first consonant). A 3 ms de-click ramp, no fade."""
    words = [t for t in toks if t["word"]]
    last, nxt = words[n_line_words - 1], words[n_line_words]
    env, hop = L._env(y, SR_TTS)
    a = int(max(0.0, last["t1"] - 0.04) * SR_TTS / hop)
    b = max(a + 1, int((nxt["t0"] + 0.02) * SR_TTS / hop))
    k = a + int(np.argmin(env[a:b]))
    cut = k * hop
    out = y[:cut].copy()
    f = int(fade * SR_TTS)
    out[-f:] *= np.linspace(1, 0, f)
    kept, i_word = [], 0
    for t in toks:
        if t["word"]:
            i_word += 1
        if i_word <= n_line_words and t["t0"] < cut / SR_TTS:
            kept.append(dict(t, t1=min(t["t1"], cut / SR_TTS)))
    return out, kept


def dry_take(text, breaks, blend, speed, seed, carrier=None, tail=None, cutoff=None, cont=None):
    """One dry read at 24 kHz. cutoff = ('tail', ...) with cont = the continuation read after the line, or
    ('inside', word, n_phonemes). tail = a tail carrier that keeps a final level (not a cut-off: its final is kept).
    Returns (audio, tokens, info)."""
    info = {"pauses": []}
    body = f"{carrier} {text}" if carrier else text
    follow = cont if (cutoff and cutoff[0] == "tail") else tail
    if follow:
        body = f"{body.rstrip('.!?')} {follow}"
    y, toks = L.synth_tokens(body, blend, speed, seed)
    if carrier:
        y, toks, _ = L.carrier_cut(y, toks, len(L._words_of(carrier)))
    n_line = len(L._words_of(text))
    if follow:
        y, toks = hard_tail_cut(y, toks, n_line, fade=0.003 if cutoff else 0.008)
    if cutoff and cutoff[0] == "inside":
        y, toks, _ = L.cut_inside_word(y, toks, cutoff[1], cutoff[2])
    for k, target in breaks:
        y, toks, before, after = L.set_pause(y, toks, k, target)
        info["pauses"].append({"after_word": k, "target_s": target, "tts_s": round(before, 3), "final_s": round(after, 3)})
    y, toks, _ = _trim(y, SR_TTS, toks, -50, 0.0, 0.0, fade_in=0.004, fade_out=0.003 if cutoff else 0.010)
    info["n_words"] = len([t for t in toks if t["word"]])
    info["pause_total"] = sum(p["final_s"] for p in info["pauses"])
    return y, toks, info


def solve_speed(sp, got, aim, fixed=0.0):
    """Kokoro durations scale as 1/speed; set pauses (digital silence) don't."""
    return sp * max(0.05, got - fixed) / max(0.05, aim - fixed)


def compress(y, toks, factor):
    """Rubber Band time-compression (R3 'finer' engine), pitch and formants kept. factor > 1 shortens."""
    if factor <= 1.0005:
        return y, toks
    z = pb.time_stretch(y.astype(np.float32), SR_TTS, stretch_factor=float(factor), high_quality=True,
                        transient_mode="mixed", preserve_formants=True)
    z = np.asarray(z, dtype=np.float32).reshape(-1)
    k = len(z) / len(y)
    return z, [dict(t, t0=t["t0"] * k, t1=t["t1"] * k) for t in toks]


def finish(y24, toks, voice, cutoff=False, lufs=None):
    """24 kHz dry read -> delivered 48 kHz: pad, upsample, the character's (dry) chain, a hard re-cut for cut-offs,
    20 ms / 40 ms trims, loudness. Returns (audio, tokens)."""
    head = 0.02
    y = np.concatenate([np.zeros(int(head * SR_TTS), np.float32), y24, np.zeros(int(0.15 * SR_TTS), np.float32)])
    toks = [dict(t, t0=t["t0"] + head, t1=t["t1"] + head) for t in toks]
    y = resample_poly(y, 2, 1).astype(np.float32)
    y = L.V.apply_chain(y, SR, voice["chain"])
    if cutoff:
        t_end = head + len(y24) / SR_TTS
        y = y[: int(t_end * SR) + int(0.001 * SR)].copy()
    y, toks, _ = _trim(y, SR, toks, -52, HEAD_PAD, 0.0 if cutoff else TAIL_PAD, fade_in=0.004,
                       fade_out=0.003 if cutoff else 0.010)
    if not cutoff:  # a flat noise tail (breath / vocoder hiss between -52 and -40 dB) is not a decay: end it
        _, b40 = audible(y, SR, -40.0)
        if len(y) / SR - b40 > 0.15:
            e = int((b40 + 0.03 + TAIL_PAD) * SR)
            y = y[:e].copy()
            f = int(0.02 * SR)
            y[-f:] *= np.linspace(1, 0, f)
            toks = [dict(t, t0=min(t["t0"], e / SR), t1=min(t["t1"], e / SR)) for t in toks]
    y = L.V.normalise(y, target=lufs if lufs is not None else voice.get("lufs", L.V.TARGET_LUFS))
    toks = L.clip_words(y, toks)
    return y, toks


def wpm(n_words, span_s):
    return round(n_words / span_s * 60) if span_s > 0 else None
