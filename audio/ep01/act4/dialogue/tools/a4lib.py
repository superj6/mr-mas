"""a4lib.py - MR. MAS Ep1 Act Four dialogue recordist toolkit.

Builds on the casting pass renderer (audio/voices/tools/vcast.py, imported read-only) and adds what a
production dialogue pass needs:

  * token-accurate synthesis: Kokoro-82M word/phoneme timestamps are kept and carried through every edit
    (context-carrier cut, pause edits, trims), so word timings and mouth cues match the delivered WAV;
  * seeded takes (Kokoro's vocoder is stochastic, so a seed makes every take reproducible);
  * dialogue-editor pause control: internal pauses are set to a target length by inserting or removing
    digital silence inside the existing gap, which keeps the whole-line prosody (no re-synthesis per phrase);
  * DRY delivery (no reverb, no slap: rooms go on mix sends), -16 LUFS integrated, <= -1.5 dBTP;
  * measurement: F0 contour (pYIN), final slope, range, pace, ASR (faster-whisper small.en) with word
    timestamps for an independent alignment check;
  * mouth cues on the portrait set A / E / O / M / rest / smile (see mouth_cues()).

Stock Kokoro American-English packs only (lang 'a'); no reference audio of any real person is loaded.
"""
from __future__ import annotations

import os
import re
import sys
import warnings

warnings.filterwarnings("ignore")
sys.path.insert(0, "/home/jgon/project/art/mrmas/audio/voices/tools")

import numpy as np
import soundfile as sf
import torch
from scipy.signal import resample_poly

import vcast as V  # noqa: E402  (casting-pass renderer, used read-only)

SR_TTS = V.SR_TTS
SR = V.SR
FPS = 24
BEAT = 0.625  # 96 BPM
BREAK_RE = re.compile(r"\{(\d*\.?\d+)\}")


# ----------------------------------------------------------------------------- text markup

def parse_say(say: str):
    """'The bylaws allow it.{0.40} Footnote three.' -> ('The bylaws allow it. Footnote three.', [(4, 0.40)])
    A {x} marker sets the pause after the preceding word to x seconds (word count is 1-based here: the
    number of words spoken before the marker)."""
    breaks = []
    clean_parts = []
    pos = 0
    for m in BREAK_RE.finditer(say):
        before = say[pos:m.start()]
        clean_parts.append(before)
        n_words = len(_words_of("".join(clean_parts)))
        breaks.append((n_words, float(m.group(1))))
        pos = m.end()
    clean_parts.append(say[pos:])
    clean = re.sub(r"\s+", " ", "".join(clean_parts)).strip()
    return clean, breaks


def _words_of(text: str):
    """Word tokens as misaki sees them (inline [word](/ph/) overrides count as one word)."""
    p = V.pipeline()
    t = text.strip()
    if not t:
        return []
    _, toks = p.g2p(t)
    return [tk for tk in toks if any(c.isalnum() for c in (tk.text or ""))]


# ----------------------------------------------------------------------------- synthesis

def synth_tokens(text: str, blend: dict, speed: float, seed: int):
    """Mono float32 @24 kHz + tokens [{text, ph, t0, t1, word}] in seconds of the returned audio."""
    torch.manual_seed(seed)
    np.random.seed(seed)
    p = V.pipeline()
    pack = V.voice_pack(blend)
    audio, toks, off = [], [], 0.0
    for r in p(text, voice=pack, speed=speed):
        a = r.audio.numpy().astype(np.float32)
        for tk in (r.tokens or []):
            toks.append({"text": tk.text, "ph": tk.phonemes or "", "t0": (tk.start_ts or 0) + off,
                         "t1": (tk.end_ts or 0) + off, "word": any(c.isalnum() for c in (tk.text or ""))})
        audio.append(a)
        off += len(a) / SR_TTS
    return np.concatenate(audio), toks


def _env(y, sr, win=0.005):
    n = max(1, int(sr * win))
    m = len(y) // n
    fr = y[: m * n].reshape(m, n)
    e = np.sqrt(np.mean(fr ** 2, axis=1) + 1e-12)
    return e, n


def _shift(toks, at, delta):
    """Insert `delta` s of silence at time `at`. A token straddling `at` is split sensibly: if the
    insertion falls in its second half the token ends at `at` (the silence belongs to no word);
    otherwise the whole token moves right (the word starts after the silence)."""
    for t in toks:
        if t["t0"] >= at - 1e-9:
            t["t0"] += delta
            t["t1"] += delta
        elif t["t1"] > at:
            if (at - t["t0"]) >= (t["t1"] - at):
                t["t1"] = at
            else:
                t["t0"] += delta
                t["t1"] += delta


def carrier_cut(y, toks, n_carrier_words):
    """Cut a context carrier off the front: quietest 5 ms frame between the carrier's last word and the
    line's first word. Returns (audio, tokens, cut_s)."""
    words = [t for t in toks if t["word"]]
    last_c, first_l = words[n_carrier_words - 1], words[n_carrier_words]
    env, hop = _env(y, SR_TTS)
    a = int(max(0.0, last_c["t1"] - 0.03) * SR_TTS / hop)
    b = max(a + 1, int((first_l["t0"] + 0.02) * SR_TTS / hop))
    k = a + int(np.argmin(env[a:b]))
    cut = k * hop
    out = y[cut:].copy()
    f = int(0.004 * SR_TTS)
    out[:f] *= np.linspace(0, 1, f)
    cut_s = cut / SR_TTS
    kept, i_word = [], 0
    for t in toks:
        if t["word"]:
            i_word += 1
        if i_word > n_carrier_words:  # drops the carrier's words and its trailing punctuation
            kept.append(dict(t, t0=max(0.0, t["t0"] - cut_s), t1=max(0.0, t["t1"] - cut_s)))
    return out, kept, cut_s


def measure_gap(y, toks, k, thresh_db=-40.0):
    """Silence (s) between word k (1-based: after the k-th word) and word k+1, plus the mid-point."""
    words = [t for t in toks if t["word"]]
    w0, w1 = words[k - 1], words[k]
    env, hop = _env(y, SR_TTS)
    ref = env.max()
    db = 20 * np.log10(env / ref)
    a = int(max(0.0, w0["t1"] - 0.06) * SR_TTS / hop)
    b = min(len(env), int((w1["t0"] + 0.03) * SR_TTS / hop) + 1)
    sil = db[a:b] < thresh_db
    best, cur, best_end = 0, 0, a
    for i, s in enumerate(sil):
        cur = cur + 1 if s else 0
        if cur > best:
            best, best_end = cur, a + i + 1
    if best == 0:
        k_min = a + int(np.argmin(env[a:b]))
        return 0.0, k_min * hop, (k_min * hop, k_min * hop)
    s0, s1 = (best_end - best) * hop, best_end * hop
    return best * hop / SR_TTS, (s0 + s1) // 2, (s0, s1)


def set_pause(y, toks, k, target):
    """Make the silence after word k equal `target` seconds by inserting/removing digital silence at the
    middle of the existing gap (3 ms fades). Returns (audio, tokens, measured_before, measured_after)."""
    gap, mid, (s0, s1) = measure_gap(y, toks, k)
    delta = target - gap
    fade = int(0.003 * SR_TTS)
    if abs(delta) < 0.01:
        return y, toks, gap, gap
    y = y.copy()
    if delta > 0:
        ins = np.zeros(int(round(delta * SR_TTS)), np.float32)
        left, right = y[:mid].copy(), y[mid:].copy()
        if gap == 0.0:  # words run together: soften the join
            left[-fade:] *= np.linspace(1, 0, fade)
            right[:fade] *= np.linspace(0, 1, fade)
        y = np.concatenate([left, ins, right])
        _shift(toks, mid / SR_TTS, len(ins) / SR_TTS)
    else:
        rem = min(int(round(-delta * SR_TTS)), max(0, (s1 - s0) - int(0.02 * SR_TTS)))
        a = mid - rem // 2
        b = a + rem
        left, right = y[:a].copy(), y[b:].copy()
        left[-fade:] *= np.linspace(1, 0, fade)
        right[:fade] *= np.linspace(0, 1, fade)
        y = np.concatenate([left, right])
        # tokens after the removed span move left
        for t in toks:
            if t["t0"] >= b / SR_TTS:
                t["t0"] -= rem / SR_TTS
                t["t1"] -= rem / SR_TTS
            elif t["t1"] > a / SR_TTS:
                t["t1"] = max(t["t0"], t["t1"] - rem / SR_TTS)
    after, _, _ = measure_gap(y, toks, k)
    return y, toks, gap, after


def cut_inside_word(y, toks, word_text, n_ph):
    """Hard-stop a line inside `word_text` after its first `n_ph` phonemes (for interrupted lines).
    The stop lands on the quietest 5 ms frame within +-40 ms of the phoneme-weighted estimate."""
    w = next(t for t in toks if t["word"] and t["text"].lower().startswith(word_text.lower()))
    spans = phoneme_spans(w)
    t_est = spans[min(n_ph, len(spans)) - 1][2]
    env, hop = _env(y, SR_TTS)
    a = int((t_est - 0.04) * SR_TTS / hop)
    b = int((t_est + 0.04) * SR_TTS / hop)
    k = a + int(np.argmin(env[a:b]))
    cut = k * hop
    out = y[:cut].copy()
    f = int(0.006 * SR_TTS)
    out[-f:] *= np.linspace(1, 0, f)
    t_cut = cut / SR_TTS
    kept = []
    for t in toks:
        if t["t0"] < t_cut:
            kept.append(dict(t, t1=min(t["t1"], t_cut)))
    return out, kept, t_cut


def trim_track(y, sr, toks, thresh_db=-50.0, head_pad=0.03, tail_pad=0.06, scale_toks=1.0):
    """Energy trim relative to the clip peak; token times move with the head cut."""
    env, hop = V._rms_frames(y, sr)
    ref = env.max()
    idx = np.where(20 * np.log10(env / ref) > thresh_db)[0]
    if len(idx) == 0:
        return y, toks, 0.0
    s = max(0, idx[0] * hop - int(head_pad * sr))
    e = min(len(y), (idx[-1] + 1) * hop + int(tail_pad * sr))
    out = y[s:e].copy()
    fi, fo = int(0.004 * sr), int(0.03 * sr)
    out[:fi] *= np.linspace(0, 1, fi)
    out[-fo:] *= np.linspace(1, 0, fo)
    off = s / sr
    dur = len(out) / sr
    new = []
    for t in toks:
        t0, t1 = max(0.0, t["t0"] - off), min(dur, max(0.0, t["t1"] - off))
        new.append(dict(t, t0=t0, t1=max(t0, t1)))
    return out, new, off


def dry(chain):
    """Strip rooms from a casting chain: production dialogue is delivered dry."""
    return [st for st in chain if st["fx"] not in ("reverb", "slap")]


def tail_cut(y, toks, n_line_words):
    """Cut a tail carrier off the end: the line is read with a continuation after it (so its final keeps a
    non-final, level contour) and cut at the quietest 5 ms frame between its last word and the tail."""
    words = [t for t in toks if t["word"]]
    last, nxt = words[n_line_words - 1], words[n_line_words]
    env, hop = _env(y, SR_TTS)
    a = int(max(0.0, last["t1"] - 0.03) * SR_TTS / hop)
    b = max(a + 1, int((nxt["t0"] + 0.02) * SR_TTS / hop))
    k = a + int(np.argmin(env[a:b]))
    cut = k * hop
    out = y[:cut].copy()
    f = int(0.008 * SR_TTS)
    out[-f:] *= np.linspace(1, 0, f)
    kept, i_word = [], 0
    for t in toks:
        if t["word"]:
            i_word += 1
        if i_word <= n_line_words and t["t0"] < cut / SR_TTS:
            kept.append(dict(t, t1=min(t["t1"], cut / SR_TTS)))
    return out, kept


def _take24(text, breaks, voice, speed, seed, carrier, cut, tail=None):
    info = {"pauses": []}
    body = f"{carrier} {text}" if carrier else text
    if tail:
        body = f"{body.rstrip('.!?')} {tail}"
    y, toks = synth_tokens(body, voice["blend"], speed, seed)
    if carrier:
        y, toks, _ = carrier_cut(y, toks, len(_words_of(carrier)))
    if tail:
        y, toks = tail_cut(y, toks, len(_words_of(text)))
    if cut:
        y, toks, _ = cut_inside_word(y, toks, cut[0], cut[1])
    for k, target in breaks:
        y, toks, before, after = set_pause(y, toks, k, target)
        info["pauses"].append({"after_word": k, "target_s": target, "tts_s": round(before, 3), "final_s": round(after, 3)})
    y, toks, _ = trim_track(y, SR_TTS, toks, thresh_db=-50, head_pad=0.0, tail_pad=0.0)
    words = [t for t in toks if t["word"]]
    span = (words[-1]["t1"] - words[0]["t0"]) if words else 0.0
    info["dry_wpm"] = round(len(words) / span * 60) if len(words) >= 3 and span > 0 else None
    info["n_words"] = len(words)
    return y, toks, info


def render(say, voice, seed=1, carrier=None, cut=None, speed_scale=1.0, wpm_band=None, head_pad=0.03, tail_pad=0.08, tail=None):
    """Full take. voice = {blend, speed, chain}. For lines of 5+ words the Kokoro speed is nudged (at most
    +-15%, the casting-pass rule) until words-per-minute over the spoken span, pauses included, sits in
    the character's band; 3-4 word lines get the band's upper edge x1.15 and up to +-20%; 1-2 word lines
    are left to the take's own speed. A voice with short_boost=False (MAS V.O.) holds 3-4 word lines to the
    band itself (still up to +-20%). voice['lufs'] (default -16) sets the delivered integrated loudness.
    Returns (audio48k, tokens, info)."""
    text, breaks = parse_say(say)
    sp0 = voice["speed"] * speed_scale
    sp = sp0
    for _ in range(4):
        y, toks, info = _take24(text, breaks, voice, sp, seed, carrier, cut, tail)
        wpm = info["dry_wpm"]
        if not wpm_band or wpm is None:
            break
        short = info["n_words"] < 5  # 3-4 word lines run hotter: upper bound x1.15, nudge up to +-20%
        boost = 1.15 if (short and voice.get("short_boost", True)) else 1.0
        band = (wpm_band[0], wpm_band[1] * boost)
        lim = 0.20 if short else 0.15
        if band[0] <= wpm <= band[1]:
            break
        new_sp = float(np.clip(sp * (0.5 * (band[0] + band[1])) / wpm, sp0 * (1 - lim), sp0 * (1 + lim)))
        if abs(new_sp - sp) < 1e-3:
            break
        sp = new_sp
    info.update({"text_spoken": text, "seed": seed, "speed": round(sp, 3), "carrier": carrier, "tail": tail})
    # 24k -> 48k, pad, FX (dry), final trim, loudness
    y = np.concatenate([np.zeros(int(0.02 * SR_TTS), np.float32), y, np.zeros(int(0.15 * SR_TTS), np.float32)])
    for t in toks:
        t["t0"] += 0.02
        t["t1"] += 0.02
    y = resample_poly(y, 2, 1).astype(np.float32)
    y = V.apply_chain(y, SR, voice["chain"])
    y, toks, _ = trim_track(y, SR, toks, thresh_db=-52, head_pad=head_pad, tail_pad=tail_pad)
    y = V.normalise(y, target=voice.get("lufs", V.TARGET_LUFS))
    toks = clip_words(y, toks)
    return y, toks, info


def clip_words(y, toks, sr=SR, floor_db=-40.0):
    """Kokoro's word end includes the pause/punctuation time after it (the last word runs ~0.1-0.3 s past
    the sound). End each word at its last audible 10 ms frame (+20 ms), never before t0 + 30 ms."""
    env, hop = V._rms_frames(y, sr, 0.01)
    db = 20 * np.log10(env / env.max())
    for t in toks:
        if not t["word"]:
            continue
        a, b = int(t["t0"] * sr / hop), min(len(db), int(np.ceil(t["t1"] * sr / hop)))
        loud = np.where(db[a:b] > floor_db)[0]
        if len(loud):
            end = (a + loud[-1] + 1) * hop / sr + 0.02
            t["t1"] = max(t["t0"] + 0.03, min(t["t1"], end))
    return toks


# ----------------------------------------------------------------------------- analysis

def f0_contour(y, sr=SR):
    """F0 per 10 ms, in two passes.
    1. pYIN with switch_prob 0.1 (the 0.01 default is sticky on these stock voices: a take that opens on a
       quiet carrier-cut frame can come back all-unvoiced).
    2. Gap fill: loud (> -22 dB rel. peak), vowel-like (zero-crossing rate < 0.12) frames that pYIN left
       unvoiced take YIN's estimate when it sits within 7 st of the line median. am_michael / am_adam are
       less periodic than the other packs (vowel harmonicity ~0.75 vs ~0.95), and pYIN drops whole vowels
       on them (e.g. every frame of 'question'); YIN still tracks them. If pYIN voices < 25% of the loud
       frames, YIN is used on all loud frames instead.
    Returns (times, f0 with NaN for unvoiced, rms dB rel. peak)."""
    import librosa
    y16 = resample_poly(y.astype(np.float64), 1, 3)
    f0, _, _ = librosa.pyin(y16, fmin=55, fmax=520, sr=16000, frame_length=1024, hop_length=160, switch_prob=0.1)
    rms = librosa.feature.rms(y=y16, frame_length=1024, hop_length=160)[0][: len(f0)]
    f0 = f0[: len(rms)]
    rms_db = 20 * np.log10(rms / (rms.max() + 1e-12) + 1e-12)
    zcr = librosa.feature.zero_crossing_rate(y16, frame_length=1024, hop_length=160)[0][: len(rms)]
    fy = librosa.yin(y16, fmin=55, fmax=400, sr=16000, frame_length=1024, hop_length=160)[: len(rms)]
    loud = rms_db > -28.0
    ok = ~np.isnan(f0)
    if loud.sum() and (ok & loud).sum() < 0.25 * loud.sum():
        med = np.median(fy[loud])
        keep = loud & (np.abs(12 * np.log2(fy / med)) <= 7.0)
        f0 = np.where(keep, fy, np.nan)
    else:
        med = np.nanmedian(f0[ok]) if ok.any() else np.median(fy[loud])
        fill = (~ok) & (rms_db > -22.0) & (zcr < 0.12) & (np.abs(12 * np.log2(fy / med)) <= 7.0)
        f0 = np.where(fill, fy, f0)
    times = np.arange(len(f0)) * 160 / 16000
    return times, f0, rms_db


def analyse(y, toks, sr=SR):
    times, f0, rms_db = f0_contour(y, sr)
    ok = ~np.isnan(f0)
    words = [t for t in toks if t["word"]]
    dur = len(y) / sr
    out = {"duration_s": round(dur, 3), "frames_24": int(np.ceil(dur * FPS)), "lufs_i": round(V.lufs(y), 2),
           "true_peak_dbtp": round(V.true_peak_db(y), 2), "clipped_samples": int(np.sum(np.abs(y) >= 0.999))}
    if ok.sum() > 3:
        fv, tv = f0[ok], times[ok]
        med0 = float(np.median(fv))
        dev = 12 * np.log2(fv / med0)
        # creak / fry at the line end: of the last ~200 ms of voiced frames, the share that is both audible
        # (> -30 dB rel. peak) and more than 9 st under the line's median (tracking noise in a silent
        # decay is excluded by the energy floor)
        tail, tail_db = dev[-20:], rms_db[ok][-20:]
        out["creak_tail"] = round(float(np.mean((tail < -9.0) & (tail_db > -30.0))), 2)
        keep = np.abs(dev) <= 9.0  # octave / subharmonic outliers out of every other metric
        if keep.sum() > 3:
            fv, tv = fv[keep], tv[keep]
        med = float(np.median(fv))
        st = 12 * np.log2(fv / med)
        out["median_f0_hz"] = round(med, 1)
        out["f0_range_st"] = round(float(np.percentile(st, 95) - np.percentile(st, 5)), 1)
        # final contour: slope (st/s) over the last 30% of voiced time (>= 5 frames)
        n_tail = max(5, int(0.3 * len(tv)))
        tt, ss = tv[-n_tail:], st[-n_tail:]
        slope = float(np.polyfit(tt - tt[0], ss, 1)[0]) if tt[-1] > tt[0] else 0.0
        out["final_slope_st_per_s"] = round(slope, 1)
        third = max(2, n_tail // 3)
        out["final_move_st"] = round(float(np.median(ss[-third:]) - np.median(ss[:third])), 1)
        # normalised contour for shape comparison (50 points, st rel. median)
        grid = np.linspace(tv[0], tv[-1], 50)
        out["_contour"] = np.interp(grid, tv, st).round(2).tolist()
    else:
        out.update({"median_f0_hz": None, "f0_range_st": None, "final_slope_st_per_s": None, "_contour": None})
    if words:
        span = max(1e-3, words[-1]["t1"] - words[0]["t0"])
        out["speech_span_s"] = round(span, 3)
        out["wpm"] = round(len(words) / span * 60) if len(words) >= 3 else None
    return out


_asr = None


def asr_words(wav_path):
    global _asr
    if _asr is None:
        from faster_whisper import WhisperModel
        _asr = WhisperModel("small.en", device="cpu", compute_type="int8", cpu_threads=6)
    segs, _ = _asr.transcribe(wav_path, language="en", beam_size=5, condition_on_previous_text=False,
                              vad_filter=False, word_timestamps=True)
    segs = list(segs)
    text = " ".join(s.text.strip() for s in segs).strip()
    lp = float(np.mean([s.avg_logprob for s in segs])) if segs else -9.0
    words = [{"w": w.word.strip(), "t0": round(w.start, 3), "t1": round(w.end, 3)} for s in segs for w in (s.words or [])]
    return text, lp, words


def cer(ref, hyp):
    ref = re.sub(r"\[([^\]]+)\]\(/[^)]*/\)", r"\1", ref)
    return V.cer(ref, hyp)


def align_check(toks, asr_ws):
    """Median |onset difference| (s) between Kokoro word starts and ASR word starts, matched in order."""
    words = [t for t in toks if t["word"]]
    n = min(len(words), len(asr_ws))
    if n == 0:
        return None
    d = [abs(words[i]["t0"] - asr_ws[i]["t0"]) for i in range(n)]
    return round(float(np.median(d)), 3)


def contour_corr(a, b):
    if a is None or b is None:
        return None
    a, b = np.array(a), np.array(b)
    if a.std() < 1e-6 or b.std() < 1e-6:
        return 0.0
    return round(float(np.corrcoef(a, b)[0, 1]), 3)


# ----------------------------------------------------------------------------- mouth cues

# misaki American phoneme inventory -> portrait mouths. Upper-case letters are misaki diphthongs:
# A = eI, I = aI, O = oU, W = aU, Y = OI; T = flap; ᵊ/ᵻ reduced vowels.
MOUTH_OF = {}
for ch in "ɑæʌaɐɛIWA":
    MOUTH_OF[ch] = "A"      # open / mid-open vowels and the diphthongs that start open (aI aU eI)
for ch in "iɪeəᵊᵻ":
    MOUTH_OF[ch] = "E"      # close-front and reduced vowels: spread, teeth
for ch in "uʊoɔOYɒɜɚ":
    MOUTH_OF[ch] = "O"      # rounded vowels (incl. the r-coloured 'er')
for ch in "pbm":
    MOUTH_OF[ch] = "M"      # lips pressed
MOUTH_OF["w"] = "O"         # rounded glide
VOWELS = set("ɑæʌaɐIWiɪeɛAəᵊᵻɚɜuʊoɔOYɒ")
DIPH = set("AIOWY")
SONOR = set("lɹwjnŋm")


def phoneme_spans(tok):
    """[(phoneme, t0, t1, stressed)] inside one word token, time split by phoneme weight
    (vowel 2.0, diphthong 2.4, sonorant 1.0, other consonant 0.8, h 0.6)."""
    ph = tok["ph"]
    units, stress_next = [], False
    for ch in ph:
        if ch in "ˈˌ":
            stress_next = ch == "ˈ"
            continue
        if ch in " -":
            continue
        w = 2.4 if ch in DIPH else 2.0 if ch in VOWELS else 1.0 if ch in SONOR else 0.6 if ch == "h" else 0.8
        units.append((ch, w, stress_next and ch in VOWELS))
        if ch in VOWELS:
            stress_next = False
    if not units:
        return [("", tok["t0"], tok["t1"], False)]
    tot = sum(u[1] for u in units)
    t, out = tok["t0"], []
    span = tok["t1"] - tok["t0"]
    for ch, w, s in units:
        d = span * w / tot
        out.append((ch, t, t + d, s))
        t += d
    return out


def mouth_cues(y, toks, sr=SR, end_shape="rest", hold=2, closed_db=-38.0, soft_db=-22.0):
    """Frame-accurate mouth track at 24 fps on the portrait set (A open, E wide, O round, M closed, rest,
    smile). Method:
      1. word spans = Kokoro duration-predictor timestamps carried through every edit; inside a word the
         time is split across its misaki phonemes by weight (phoneme_spans);
      2. each phoneme maps to a mouth (MOUTH_OF, a Rhubarb-style reduction): open/mid-open vowels and
         aI/aU/eI -> A; close-front and reduced vowels -> E; rounded vowels, 'er' and w -> O; p/b/m -> M;
         every other consonant -> E (teeth/spread); 'h' takes the shape of the vowel after it; a loud
         stressed close vowel opens to A;
      3. the audio envelope (10 ms RMS, dB rel. the line's peak) gates it: an open A on a soft frame
         (< soft_db) drops to E; any non-bilabial frame below closed_db inside a word keeps its shape but
         never opens past E; frames outside words are 'rest' (gaps >= 3 frames) or hold the last drawing;
      4. drawings are held on 2s (>= `hold` frames, the talk.ts standard); 1-frame blips merge into a
         neighbour, except M / O / A, which steal a frame from a longer neighbour so a closure, a rounding
         or an open vowel always reads;
      5. after the last spoken frame the mouth goes to `end_shape` ('smile' only for warm deliveries;
         never used during speech).
    Returns [{t, f, shape}] (t = f / 24 s from the start of the WAV)."""
    dur = len(y) / sr
    n = int(np.ceil(dur * FPS))
    env, hop = V._rms_frames(y, sr, 0.01)
    ref = env.max()
    db_env = 20 * np.log10(env / ref)
    spans = []
    for t in toks:
        if t["word"]:
            spans += phoneme_spans(t)
    shapes = []
    last_word_end = max([t["t1"] for t in toks if t["word"]] or [0.0])
    for f in range(n):
        tc = (f + 0.5) / FPS
        i_env = min(len(db_env) - 1, int(tc * sr / hop))
        e = db_env[max(0, i_env - 1): i_env + 2].max()
        ph = next((s for s in spans if s[1] <= tc < s[2]), None)
        if ph is None:
            shapes.append(None)
            continue
        ch = ph[0]
        if e < -42.0 and ch not in "pbm":
            shapes.append(None)  # inaudible inside a word (a closure or the decay): treat as a gap
            continue
        if ch == "h":  # h takes the next vowel's shape
            j = spans.index(ph)
            nxt = next((s[0] for s in spans[j + 1:] if s[0] in VOWELS), "ə")
            ch = nxt
        m = MOUTH_OF.get(ch, "E")
        if m == "E" and ch in VOWELS and ph[3] and e > -8.0:
            m = "A"   # a loud stressed close vowel still drops the jaw
        if m == "A" and e < soft_db and not ph[3]:
            m = "E"
        if m == "A" and e < closed_db:
            m = "E"
        shapes.append(m)
    # gaps between words: rest if >= 3 frames, else hold the previous drawing
    i = 0
    while i < n:
        if shapes[i] is None:
            j = i
            while j < n and shapes[j] is None:
                j += 1
            after_speech = (i + 0.5) / FPS >= last_word_end
            fill = "rest" if (j - i >= 3 or i == 0 or after_speech) else shapes[i - 1]
            if after_speech:
                fill = end_shape
            for k in range(i, j):
                shapes[k] = fill
            i = j
        else:
            i += 1
    # enforce holds (on 2s)
    changed = True
    while changed:
        changed = False
        runs = []
        for f, s in enumerate(shapes):
            if runs and runs[-1][0] == s:
                runs[-1][2] = f + 1
            else:
                runs.append([s, f, f + 1])
        for r_i, (s, a, b) in enumerate(runs):
            if b - a >= hold or b == n:
                continue
            if s in ("M", "O", "A") and r_i + 1 < len(runs) and runs[r_i + 1][2] - runs[r_i + 1][1] > hold:
                shapes[b] = s  # steal a frame so a closure / rounding / open vowel still reads
            elif s in ("M", "O", "A") and r_i > 0 and runs[r_i - 1][2] - runs[r_i - 1][1] > hold:
                shapes[a - 1] = s
            elif r_i > 0:
                for k in range(a, b):
                    shapes[k] = runs[r_i - 1][0]
            elif r_i + 1 < len(runs):
                for k in range(a, b):
                    shapes[k] = runs[r_i + 1][0]
            changed = True
            break
    cues = []
    for f, s in enumerate(shapes):
        if not cues or cues[-1]["shape"] != s:
            cues.append({"t": round(f / FPS, 3), "f": f, "shape": s})
    if not cues or cues[-1]["shape"] not in ("rest", "smile"):
        cues.append({"t": round(n / FPS, 3), "f": n, "shape": end_shape})
    return cues


def word_track(toks):
    return [{"w": t["text"], "t0": round(t["t0"], 3), "t1": round(t["t1"], 3),
             "f0": int(round(t["t0"] * FPS)), "f1": int(round(t["t1"] * FPS))} for t in toks if t["word"]]


def write(y, wav, mp3):
    V.write_wav_mp3(y, wav, mp3)
