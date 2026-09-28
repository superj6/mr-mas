"""elaudio.py - decode, trim, dress and measure ElevenLabs takes for the MR. MAS pipeline (48 kHz / 24-bit mono, dry).

The house conventions follow the fastrec recorder (audio/ep01/act4/dialogue/tools/fastrec/house.py), re-implemented here so
nothing Kokoro-related is imported:
  * the take's own onset and decay are kept: the file starts HEAD (0.15 s) before the first sound (-40 dB re the
    loudest 10 ms) and ends TAIL (0.10 s) after the decay reaches -60 dB; then HANDLE (0.35 s) of room tone each side;
  * a room-tone bed (pink noise 60 Hz - 6 kHz at -62 dBFS) under the whole file, so there is no digital black;
  * HPF 60 Hz; no EQ, no compression, no room (rooms and devices are mix sends; an optional device chain copy of
    house.call_filter() is offered for the lines Kokoro printed through a call);
  * integrated loudness to the target (-18 LUFS here), true-peak ceiling -1.5 dBTP.
Measurements: duration, audible in/out, span, words per minute, syllables per second, internal pauses, median F0 and its
5-95 % range (YIN at 16 kHz, the house's f0_fast method), LUFS, true peak, head/tail silence, ASR (faster-whisper small.en)
with character error rate and word recall.
"""
from __future__ import annotations

import difflib
import io
import re

import numpy as np
import soundfile as sf
from scipy.signal import resample_poly, butter, sosfilt, lfilter

SR = 48000
HANDLE, HEAD, TAIL = 0.35, 0.15, 0.10
TONE_DBFS = -62.0
TP_CEIL = -1.5
_METER = None
_ASR = None


# ------------------------------------------------------------------------------------------------ io
def decode(mp3_bytes):
    y, sr = sf.read(io.BytesIO(mp3_bytes), dtype="float32", always_2d=True)
    y = y.mean(axis=1)
    if sr == 44100:
        y = resample_poly(y.astype(np.float64), 160, 147).astype(np.float32)
    elif sr != SR:
        from math import gcd
        g = gcd(SR, sr)
        y = resample_poly(y.astype(np.float64), SR // g, sr // g).astype(np.float32)
    return y


def write24(path, y):
    sf.write(path, np.clip(y, -1.0, 1.0).astype(np.float32), SR, subtype="PCM_24")


# ------------------------------------------------------------------------------------------------ helpers
def rms_db(y, win=0.01):
    n = int(SR * win)
    m = max(1, len(y) // n)
    yy = np.pad(y, (0, max(0, m * n - len(y))))[: m * n]
    e = np.sqrt(np.mean(yy.reshape(m, n) ** 2, axis=1) + 1e-12)
    return 20 * np.log10(e / (e.max() + 1e-12))


def pink(n, rng):
    w = rng.standard_normal(n + 4000)
    b = [0.049922035, -0.095993537, 0.050612699, -0.004408786]
    a = [1, -2.494956002, 2.017265875, -0.522189400]
    return lfilter(b, a, w)[4000:]


def tone(n, seed, dbfs=TONE_DBFS):
    rng = np.random.default_rng(seed + 991)
    t = sosfilt(butter(2, [60, 6000], "band", fs=SR, output="sos"), pink(n, rng))
    drift = sosfilt(butter(1, 0.5, "low", fs=SR, output="sos"), rng.standard_normal(n)) * 30.0
    t = t * (10 ** (np.clip(drift, -1, 1) / 20))
    t = t / np.sqrt(np.mean(t ** 2) + 1e-20) * 10 ** (dbfs / 20)
    f = int(0.01 * SR)
    t[:f] *= np.linspace(0, 1, f)
    t[-f:] *= np.linspace(1, 0, f)
    return t.astype(np.float32)


def lufs(y):
    global _METER
    import pyloudnorm as pyln
    if _METER is None:
        _METER = pyln.Meter(SR)
    yy = y
    if len(yy) < int(1.2 * SR):
        yy = np.tile(yy, int(np.ceil(1.2 * SR / max(1, len(yy)))) + 1)
    return float(_METER.integrated_loudness(yy.astype(np.float64)))


def true_peak_db(y):
    up = resample_poly(y.astype(np.float64), 4, 1)
    return float(20 * np.log10(np.max(np.abs(up)) + 1e-12))


def normalise(y, target):
    import pedalboard as pb
    x = y.astype(np.float32)
    for _ in range(4):
        x = x * (10 ** ((target - lufs(x)) / 20))
        if true_peak_db(x) <= TP_CEIL:
            break
        x = np.asarray(pb.Limiter(threshold_db=TP_CEIL - 1.0, release_ms=60)(x, SR), dtype=np.float32).reshape(-1)
    tp = true_peak_db(x)
    if tp > TP_CEIL:
        x = x * (10 ** ((TP_CEIL - tp) / 20))
    return x


def zero_runs(y, min_s=0.01):
    z = (y == 0.0).astype(np.int8)
    if not z.any():
        return 0
    dz = np.diff(np.concatenate([[0], z, [0]]))
    s, e = np.where(dz == 1)[0], np.where(dz == -1)[0]
    return int(np.sum((e - s) >= int(min_s * SR)))


def device_chain(y, dev):
    """the call / monitor small speaker, a copy of house.call_filter(): HPF 200, LPF 7k, +1.5 dB @1.8k, 2.5:1;
    'pa', a copy of house.pa_speaker() (fastrec; the v3.2 stage): HPF 160, LPF 8.5k, +2 dB @2.4k (Q 0.9), 10 % driver
    saturation (vcast's _sat, drive 1.6), 3:1 at -22 dB (4/80 ms). No room: the hall is a mix send."""
    import pedalboard as pb
    if dev == "pa":
        x = y.astype(np.float32)
        x = np.asarray(pb.Pedalboard([pb.HighpassFilter(160), pb.LowpassFilter(8500), pb.PeakFilter(2400, 2.0, 0.9)])(x, SR),
                       dtype=np.float32).reshape(-1)
        pk = float(np.max(np.abs(x))) + 1e-9
        u = x / pk
        x = ((1 - 0.10) * u + 0.10 * (np.tanh(1.6 * u) / np.tanh(1.6))) * pk          # vcast._sat(drive 1.6, mix 0.10)
        x = np.asarray(pb.Pedalboard([pb.Compressor(threshold_db=-22, ratio=3.0, attack_ms=4, release_ms=80)])(
            x.astype(np.float32), SR), dtype=np.float32).reshape(-1)
        return x
    if dev == "tv":                                     # a copy of house.tv_speaker() (fastrec; the v3.3 bullpen TV)
        board = pb.Pedalboard([pb.HighpassFilter(150), pb.LowpassFilter(6500), pb.PeakFilter(1200, 2.0, 1.0),
                               pb.Compressor(threshold_db=-22, ratio=2.5, attack_ms=5, release_ms=90)])
        return np.asarray(board(y.astype(np.float32), SR), dtype=np.float32).reshape(-1)
    if dev not in ("call", "monitor"):
        return y
    board = pb.Pedalboard([pb.HighpassFilter(200), pb.LowpassFilter(7000), pb.PeakFilter(1800, 1.5, 1.0),
                           pb.Compressor(threshold_db=-22, ratio=2.5, attack_ms=5, release_ms=90)])
    return np.asarray(board(y.astype(np.float32), SR), dtype=np.float32).reshape(-1)


# ------------------------------------------------------------------------------------------------ the take
def dress(y, seed, target_lufs, dev=None):
    """raw 48 kHz speech -> (file array, offset_s added at the head, info). Keeps the take's own onset and decay."""
    import pedalboard as pb
    y = np.asarray(pb.Pedalboard([pb.HighpassFilter(60)])(y.astype(np.float32), SR), dtype=np.float32).reshape(-1)
    d5 = rms_db(y, 0.005)
    i40 = np.where(d5 > -40)[0]
    i60 = np.where(d5 > -60)[0]
    if len(i40) == 0:
        raise RuntimeError("silent take")
    first = i40[0] * 0.005
    last60 = (i60[-1] + 1) * 0.005
    a = max(0.0, first - HEAD)
    b = min(len(y) / SR, last60 + TAIL)
    seg = y[int(a * SR): int(b * SR)].copy()
    f = int(0.004 * SR)                                             # 4 ms edge fades on the cut (below -40 dB anyway)
    seg[:f] *= np.linspace(0, 1, f)
    seg[-f:] *= np.linspace(1, 0, f)
    if dev:
        seg = device_chain(seg, dev)
    h = np.zeros(int(HANDLE * SR), np.float32)
    out = np.concatenate([h, seg, h])
    out = normalise(out, target_lufs)
    out = out + tone(len(out), seed)
    offset = HANDLE - a                                             # file time = raw time + offset
    tail_short = bool(d5[-4:].max() > -45.0)                        # the raw audio stops while still sounding (> -45 dB re peak)
    return out.astype(np.float32), offset, dict(raw_first_sound_s=round(first, 3), raw_len_s=round(len(y) / SR, 3),
                                                raw_tail_cut=bool(tail_short))


# ------------------------------------------------------------------------------------------------ measures
VOW = re.compile(r"[aeiouy]+")


def syllables_word(w):
    w = w.lower().strip("'")
    if not w:
        return 0
    if w.isdigit():
        return len(w)
    n = len(VOW.findall(w))
    if w.endswith("e") and not w.endswith(("le", "ee", "ye")) and n > 1:
        n -= 1
    if w.endswith("es") and not w.endswith(("ses", "zes", "ces", "ges", "xes")) and n > 1:
        n -= 1
    if w.endswith("ed") and not w.endswith(("ted", "ded")) and n > 1:
        n -= 1
    return max(1, n)


ONES = "zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen " \
       "seventeen eighteen nineteen".split()
TENS = "_ _ twenty thirty forty fifty sixty seventy eighty ninety".split()


def num_words(n):
    """0-9999 -> words (ASR writes numbers as digits; the script spells them)"""
    if n < 20:
        return ONES[n]
    if n < 100:
        return TENS[n // 10] + ("" if n % 10 == 0 else " " + ONES[n % 10])
    if n < 1000:
        return ONES[n // 100] + " hundred" + ("" if n % 100 == 0 else " and " + num_words(n % 100))
    return num_words(n // 1000) + " thousand" + ("" if n % 1000 == 0 else " " + num_words(n % 1000))


NUM = {"ok": "okay", "v2": "vee two", "vee-two": "vee two", "ai": "a i"}


def plain_words(s):
    s = s.lower().replace("’", "'").replace("—", " ").replace("…", " ")
    s = re.sub(r"(?<=[a-z0-9])-(?=[a-z0-9])", " ", s)
    out = []
    s = re.sub(r"(?<=\d),(?=\d{3})", "", s)
    for w in re.findall(r"[a-z0-9']+", s):
        if w.isdigit() and len(w) <= 4:
            w = num_words(int(w))
        out.extend(NUM.get(w, w).split())
    return out


def cer(ref, hyp):
    import jiwer
    r = " ".join(plain_words(ref))
    h = " ".join(plain_words(hyp))
    return round(float(jiwer.cer(r, h)), 3) if r else 0.0


def word_recall(ref, hyp, names=()):
    r = [w for w in plain_words(ref) if w.replace("'s", "") not in names]
    h = plain_words(hyp)
    if not r:
        return 1.0
    sm = difflib.SequenceMatcher(a=r, b=h, autojunk=False)
    return round(sum(b.size for b in sm.get_matching_blocks()) / len(r), 3)


def f0_fast(y):
    """the house f0_fast: YIN at 16 kHz on frames within 28 dB of the peak, octave outliers (> 9 st) dropped"""
    import librosa
    y16 = resample_poly(y.astype(np.float64), 1, 3)
    f0 = librosa.yin(y16, fmin=55, fmax=420, sr=16000, frame_length=1024, hop_length=160)
    rms = librosa.feature.rms(y=y16, frame_length=1024, hop_length=160)[0][: len(f0)]
    f0 = f0[: len(rms)]
    loud = 20 * np.log10(rms / (rms.max() + 1e-12) + 1e-12) > -28
    if loud.sum() < 5:
        return None, None
    fv = f0[loud]
    med = np.median(fv)
    st = 12 * np.log2(fv / med)
    fv, st = fv[np.abs(st) <= 9], st[np.abs(st) <= 9]
    if len(fv) < 5:
        return None, None
    return round(float(np.median(fv)), 1), round(float(np.percentile(st, 95) - np.percentile(st, 5)), 1)


def asr(y):
    """faster-whisper small.en (beam 5) with word timestamps -> (text, [(word, t0, t1)])"""
    global _ASR
    if _ASR is None:
        from faster_whisper import WhisperModel
        _ASR = WhisperModel("small.en", device="cpu", compute_type="int8", cpu_threads=4)
    y16 = resample_poly(y.astype(np.float64), 1, 3).astype(np.float32)
    segs, _ = _ASR.transcribe(y16, language="en", beam_size=5, word_timestamps=True, vad_filter=False,
                              condition_on_previous_text=False)
    ws = [(w.word.strip(), float(w.start), float(w.end)) for s in segs for w in (s.words or [])]
    return " ".join(w for w, _, _ in ws).strip(), ws


def measure(y, text):
    d = rms_db(y, 0.01)
    idx = np.where(d > -40)[0]
    a_in, a_out = idx[0] * 0.01, (idx[-1] + 1) * 0.01
    q = d[idx[0]: idx[-1] + 1] <= -40
    pauses, cur = [], 0
    for v in list(q) + [False]:
        if v:
            cur += 1
        else:
            if cur >= 6:
                pauses.append(round(cur * 0.01, 2))
            cur = 0
    span = a_out - a_in
    words = plain_words(text)
    nw = len([w for w in text.split() if re.search(r"[A-Za-z0-9]", w)])      # words as written (the house count)
    syl = sum(syllables_word(w) for w in words)
    art = span - sum(p for p in pauses if p >= 0.10)
    d5 = rms_db(y, 0.005)
    i60 = np.where(d5 > -60)[0]
    med, rng = f0_fast(y[int(a_in * SR): int(a_out * SR)])
    return dict(audible_in_s=round(a_in, 3), audible_out_s=round(a_out, 3), span_s=round(span, 3), words=nw,
                wpm=round(nw / span * 60, 1) if span > 0 else None, syllables=syl,
                articulation_sps=round(syl / art, 2) if art > 0 else None, pauses_s=pauses,
                longest_internal_gap_s=max(pauses) if pauses else 0.0,
                speech_head_s=round(a_in, 3), speech_tail_s=round(len(y) / SR - a_out, 3),
                tail_to_60_s=round(len(y) / SR - (i60[-1] + 1) * 0.005, 3) if len(i60) else None,
                median_f0_hz=med, f0_range_st=rng)


def gloss(y):
    """the house 'gloss' (cast.json chain_add of the derived voices): -1.5 dB @350 Hz, +2.5 dB shelf @7 kHz, a chorus
    (0.6 Hz, depth 0.1, 8 ms, 18 % mix), 4:1 compression at -26 dB. 'The same cadence, a shade too smooth.' A process on a generic voice, never a clone."""
    import pedalboard as pb
    board = pb.Pedalboard([pb.PeakFilter(350, -1.5, 1.0), pb.HighShelfFilter(7000, 2.5),
                           pb.Chorus(rate_hz=0.6, depth=0.1, centre_delay_ms=8.0, feedback=0.0, mix=0.18),
                           pb.Compressor(threshold_db=-26, ratio=4.0, attack_ms=2, release_ms=60)])
    return np.asarray(board(y.astype(np.float32), SR), dtype=np.float32).reshape(-1)


def pitch(y, st):
    import pedalboard as pb
    return np.asarray(pb.Pedalboard([pb.PitchShift(semitones=st)])(y.astype(np.float32), SR), dtype=np.float32).reshape(-1)
