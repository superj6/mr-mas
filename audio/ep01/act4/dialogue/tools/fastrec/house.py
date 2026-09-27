"""house.py - the house per-take method for fastrec: one whole Kokoro read, pauses opened in room tone, own onset and
decay kept, room-tone handles, loudness and true-peak ceiling, device chains, and the file checks.

This is a PORT of the per-take functions of ../v5/record_v5.py (the Act Four v5 recorder, as of 2026-09-26 14:26):
parse(), segments(), speech_multi(), speech_track(), dress(), tone(), pink(), inhale(), peak_rms(), measure_speech(),
trail(), file_qa(), zero_runs(), plain_words(), word_recall(), ref_text(). The DSP and constants are unchanged, so a
fastrec take of a line is the same audio as a v5 take of it at the same speed and seed (checked bit for bit on
2026-09-26; see README "Parity"). What differs is generalisation only:
  * dress() takes any device chain (call / monitor / laptop / pa / tv), not only 'call';
  * the female / V.O. decisions come from the voice preset, not from Act Four's slug lists;
  * nothing is loaded at import (record_v5 loads its plan, the v4 lines and sets 6 torch threads at import).

It imports the shared libraries read-only: a4lib (../a4lib.py), vcast (audio/voices/tools/vcast.py),
record_32.call_filter() and cast_a4.laptop_speaker(). Stock Kokoro-82M American-English packs only; no reference
audio of any real person is ever loaded.
"""
from __future__ import annotations

import difflib
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
TOOLS = os.path.dirname(HERE)                                  # audio/ep01/act4/dialogue/tools
REPO = os.path.abspath(os.path.join(TOOLS, "../../../../.."))
sys.path.insert(0, TOOLS)

import numpy as np
from scipy.signal import resample_poly, butter, sosfilt, lfilter
import pedalboard as pb

import a4lib as L            # read-only

SR, SR_TTS, FPS = L.SR, L.SR_TTS, L.FPS
HANDLE, HEAD, TAIL = 0.35, 0.15, 0.10
TONE_DBFS = -62.0
DLG_LUFS, VO_LUFS, LAPTOP_LUFS = -16.0, -18.0, -22.0
MARK = re.compile(r"\{(s?)(b?)(\d*\.?\d+)\}")
VOW = set("AIOWYQaeiouæɑɐɒɔəɛɜɪʊʌᵻᵊ")
MODEL = "Kokoro-82M v1.0 (hexgrad/Kokoro-82M; misaki G2P; lang 'a' American English)"


# ============================================================================================ device chains
def call_filter():
    """the call / monitor small speaker: record_32.call_filter() (HPF 200, LPF 7k, +1.5 dB @1.8k, 2.5:1)"""
    return [{"fx": "hpf", "hz": 200}, {"fx": "lpf", "hz": 7000}, {"fx": "peak", "hz": 1800, "db": 1.5, "q": 1.0},
            {"fx": "comp", "th": -22, "ratio": 2.5, "att": 5, "rel": 90}]


def laptop_speaker():
    """cast_a4.laptop_speaker(): a small driver in a thin chassis (steep 330 Hz - 5.4 kHz band, box resonance, honk)"""
    return [{"fx": "hpf", "hz": 330}, {"fx": "hpf", "hz": 330}, {"fx": "lpf", "hz": 5400}, {"fx": "lpf", "hz": 5400},
            {"fx": "peak", "hz": 950, "db": 4.0, "q": 1.1}, {"fx": "peak", "hz": 2800, "db": 2.0, "q": 1.4},
            {"fx": "sat", "drive": 1.8, "mix": 0.25}, {"fx": "comp", "th": -24, "ratio": 3.0, "att": 4, "rel": 80}]


def pa_speaker():
    """NEW (fastrec): a hall PA heard from the stage: a wide band (HPF 160 Hz, LPF 8.5 kHz), a horn presence
    (+2 dB @2.4 kHz), a touch of driver saturation (10 %), 3:1 levelling. No room: the hall is a mix send."""
    return [{"fx": "hpf", "hz": 160}, {"fx": "lpf", "hz": 8500}, {"fx": "peak", "hz": 2400, "db": 2.0, "q": 0.9},
            {"fx": "sat", "drive": 1.6, "mix": 0.10}, {"fx": "comp", "th": -22, "ratio": 3.0, "att": 4, "rel": 80}]


def tv_speaker():
    """NEW (fastrec): a TV / wall-monitor speaker, a little fuller than the call filter (HPF 150, LPF 6.5k, +2 dB @1.2k)"""
    return [{"fx": "hpf", "hz": 150}, {"fx": "lpf", "hz": 6500}, {"fx": "peak", "hz": 1200, "db": 2.0, "q": 1.0},
            {"fx": "comp", "th": -22, "ratio": 2.5, "att": 5, "rel": 90}]


DEVICES = {"call": call_filter, "monitor": call_filter, "laptop": laptop_speaker, "pa": pa_speaker, "tv": tv_speaker}


def check_parity_of_device_chains():
    """the call and laptop chains above are copies; this returns [] when they still equal the originals"""
    import record_32 as R, cast_a4 as CA     # noqa: heavy imports, only for the check
    bad = []
    if R.call_filter() != call_filter():
        bad.append("call_filter differs from record_32.call_filter()")
    if CA.laptop_speaker() != laptop_speaker():
        bad.append("laptop_speaker differs from cast_a4.laptop_speaker()")
    return bad


# ============================================================================================ small helpers
def rms_db(y, sr, win):
    n = int(sr * win); m = len(y) // n
    e = np.sqrt(np.mean(y[: m * n].reshape(m, n) ** 2, axis=1) + 1e-12)
    return 20 * np.log10(e / e.max())


def pink(n, rng):
    w = rng.standard_normal(n + 4000)
    b = [0.049922035, -0.095993537, 0.050612699, -0.004408786]; a = [1, -2.494956002, 2.017265875, -0.522189400]
    return lfilter(b, a, w)[4000:]


def tone(n, seed, dbfs=TONE_DBFS):
    """Room tone for the handles and every opened pause: pink noise 60 Hz - 6 kHz, a slow +-1 dB drift, 10 ms edges."""
    rng = np.random.default_rng(seed + 991)
    t = sosfilt(butter(2, [60, 6000], "band", fs=SR, output="sos"), pink(n, rng))
    drift = sosfilt(butter(1, 0.5, "low", fs=SR, output="sos"), rng.standard_normal(n)) * 30.0
    t = t * (10 ** (np.clip(drift, -1, 1) / 20))
    t = t / np.sqrt(np.mean(t ** 2)) * 10 ** (dbfs / 20)
    f = int(0.01 * SR); t[:f] *= np.linspace(0, 1, f); t[-f:] *= np.linspace(1, 0, f)
    return t.astype(np.float32)


def inhale(rng, dur, female, level_lin):
    """PLACEHOLDER inhale: band-limited pink noise with a breath envelope. Never a real person's breath."""
    n = int(dur * SR)
    lo, hi, r0, r1 = (420, 3300, 1100, 1700) if female else (320, 2500, 800, 1300)
    x = pink(n, rng)
    x = sosfilt(butter(2, [lo, hi], "band", fs=SR, output="sos"), x)
    x = sosfilt(butter(2, [r0, r1], "band", fs=SR, output="sos"), x) * 0.6 + x * 0.4
    t = np.linspace(0, 1, n)
    env = np.where(t < 0.65, (t / 0.65) ** 1.5, np.cos((t - 0.65) / 0.35 * np.pi / 2) ** 2)
    x = x * env
    return (x / (np.sqrt(np.mean(x[env > 0.5] ** 2)) + 1e-9) * level_lin).astype(np.float32)


def peak_rms(y, win=0.02):
    n = int(win * SR)
    return max(float(np.sqrt(np.mean(y[i:i + n] ** 2))) for i in range(0, max(1, len(y) - n), n))


def parse(say):
    """-> (text for Kokoro, [(after_word_k, total_pause_s, breath)])"""
    text, br = L.parse_say(MARK.sub(lambda m: "{%s}" % m.group(3), say))
    flags = [m.group(2) == "b" for m in MARK.finditer(say)]
    return text, [(k, t, f) for (k, t), f in zip(br, flags)]


def segments(say):
    """'{sX}' marks a boundary between two separate whole reads. -> [(segment say, gap after, breath after)]"""
    out, pos = [], 0
    for m in MARK.finditer(say):
        if m.group(1) == "s":
            out.append((say[pos:m.start()].strip(), float(m.group(3)), m.group(2) == "b"))
            pos = m.end()
    out.append((say[pos:].strip(), 0.0, False))
    return out


NUM = {"0": "zero", "1": "one", "2": "two", "3": "three", "4": "four", "5": "five", "6": "six", "7": "seven", "8": "eight",
       "9": "nine", "10": "ten", "11": "eleven", "12": "twelve", "ok": "okay"}


def plain_words(s):
    s = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", s)
    s = s.lower().replace("’", "'").replace("—", " ").replace("…", " ")
    s = re.sub(r"(?<=[a-z])-(?=[a-z])", "", s)
    return [NUM.get(w, w) for w in re.findall(r"[a-z0-9']+", s)]


def syllables(text):
    p = L.V.pipeline()
    _, toks = p.g2p(re.sub(r"[\"“”]", "", text))
    return sum(sum(1 for ch in (tk.phonemes or "") if ch in VOW) for tk in toks)


def ref_text(line_text):
    """the words as heard, for ASR: print marks and pronunciation markup out"""
    t = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", MARK.sub("", line_text))
    t = t.replace("…", " ").replace("“", "").replace("”", "").replace('"', "")
    return re.sub(r"\s+", " ", t).strip()


def word_recall(ref, hyp, names=()):
    """share of the reference's non-name words that ASR returns, in order"""
    r = [w for w in plain_words(ref) if w.replace("'s", "") not in names]
    h = plain_words(hyp)
    if not r:
        return 1.0
    sm = difflib.SequenceMatcher(a=r, b=h, autojunk=False)
    return round(sum(b.size for b in sm.get_matching_blocks()) / len(r), 3)


def zero_runs(y, min_s=0.01):
    z = (y == 0.0).astype(np.int8)
    if not z.any():
        return 0
    dz = np.diff(np.concatenate([[0], z, [0]]))
    starts, ends = np.where(dz == 1)[0], np.where(dz == -1)[0]
    return int(np.sum((ends - starts) >= int(min_s * SR)))


def file_qa(y, target):
    return dict(lufs_i=round(L.V.lufs(y), 2), target_lufs=target, true_peak_dbtp=round(L.V.true_peak_db(y), 2),
                clipped_samples=int(np.sum(np.abs(y) >= 0.999)), digital_black_runs=zero_runs(y))


# ============================================================================================ one read
def speech_track(text, breaks, v, speed, seed):
    """One whole Kokoro read -> the voice chain -> its own onset/decay -> pauses opened (zeros here; the room-tone bed
    goes under the whole file later). Returns (y48 speech only, toks, opened[], mid_breaths[(t_end_s, max_dur_s)])."""
    y24, toks = L.synth_tokens(text, v["blend"], speed, seed)
    pre, post = 0.2, 0.6
    y = np.concatenate([np.zeros(int(pre * SR_TTS), np.float32), y24, np.zeros(int(post * SR_TTS), np.float32)])
    y = resample_poly(y, 2, 1).astype(np.float32)
    toks = [dict(t, t0=t["t0"] + pre, t1=t["t1"] + pre) for t in toks]
    y = L.V.apply_chain(y, SR, v["chain"]).astype(np.float32)
    d = rms_db(y, SR, 0.005); h = int(0.005 * SR)
    on = np.where(d > -52)[0][0] * h; off = (np.where(d > -60)[0][-1] + 1) * h
    s = max(0, on - int(0.03 * SR)); e = min(len(y), off + int(TAIL * SR))
    y = y[s:e].copy()
    f = int(0.004 * SR); y[:f] *= np.linspace(0, 1, f)
    f = int(0.02 * SR); y[-f:] *= np.linspace(1, 0, f)
    toks = [dict(t, t0=max(0.0, t["t0"] - s / SR), t1=max(0.0, t["t1"] - s / SR)) for t in toks]
    opened, mids = [], []
    for k, target, br in breaks:
        words = [t for t in toks if t["word"]]
        if k < 1 or k >= len(words):
            continue                                   # a marker before the first or after the last word
        w0, w1 = words[k - 1], words[k]
        d = rms_db(y, SR, 0.005)
        a = int(max(w0["t0"] + 0.6 * (w0["t1"] - w0["t0"]), w0["t1"] - 0.25) * SR / h)   # after the word's vowel
        b = min(len(d) - 1, int((w1["t0"] + 0.05) * SR / h))
        if b <= a:
            b = a + 1
        quiet = d[a:b] < -40
        best = cur = 0; best_end = a
        for i, q in enumerate(quiet):
            cur = cur + 1 if q else 0
            if cur > best:
                best, best_end = cur, a + i + 1
        if best:
            r0, r1 = best_end - best, best_end
            pt = (r0 + int(np.argmin(d[r0:r1]))) * h
        else:
            pt = (a + int(np.argmin(d[a:b]))) * h
        gap = best * h / SR
        extra = round(target - gap, 3)
        dip = float(d[int(pt / h)]) if int(pt / h) < len(d) else -90.0
        rec = dict(after_word=k, word=w0["text"], tts_s=round(gap, 3), target_s=target, point_s=round(pt / SR, 3),
                   joined_speech=best == 0, dip_db=round(dip, 1), breath=br)
        if extra > 0.01:
            fo, fi = (0.008, 0.008) if best else (0.060, 0.025)
            rec["crossfade_ms"] = [int(fo * 1000), int(fi * 1000)]
            left, right = y[:pt].copy(), y[pt:].copy()
            a_, b_ = min(int(fo * SR), len(left) // 2), min(int(fi * SR), len(right) // 2)
            left[-a_:] *= np.cos(np.linspace(0, np.pi / 2, a_)) ** 2; right[:b_] *= np.sin(np.linspace(0, np.pi / 2, b_)) ** 2
            y = np.concatenate([left, np.zeros(int(round(extra * SR)), np.float32), right])
            L._shift(toks, pt / SR, int(round(extra * SR)) / SR)
        d = rms_db(y, SR, 0.005)
        seg = d[max(0, int(pt / h) - 40): int(pt / h) + int((max(extra, 0) + 0.3) * SR / h)] < -40
        best = cur = 0
        for q in seg:
            cur = cur + 1 if q else 0
            best = max(best, cur)
        rec["final_s"] = round(best * h / SR, 3)
        rec["opened_s"] = round(max(0.0, extra), 3)
        opened.append(rec)
        if br:
            nxt_on = pt / SR + max(0.0, extra)
            dd = rms_db(y, SR, 0.005)
            j = int(nxt_on * SR / h)
            while j < len(dd) and dd[j] <= -40:
                j += 1
            mids.append((j * h / SR - 0.08, rec["final_s"] - 0.15))
    return y, toks, opened, mids


def speech_multi(say, v, speed, seed):
    """one or more whole reads (see segments()), joined so the audible gap is the intended one"""
    segs = segments(say)
    if len(segs) == 1:
        text, breaks = parse(say)
        return (text,) + speech_track(text, breaks, v, speed, seed)
    y, toks, opened, mids, texts = np.zeros(0, np.float32), [], [], [], []
    prev_gap = prev_br = prev_last = None
    for j, (sg, gap, br) in enumerate(segs):
        text, breaks = parse(sg)
        texts.append(text)
        z, tk, op, md = speech_track(text, breaks, v, speed, seed + 31 * j)
        if not len(y):
            y, toks, opened, mids = z, tk, op, md
        else:
            d0, d1 = rms_db(y, SR, 0.005), rms_db(z, SR, 0.005)
            h = int(0.005 * SR)
            a_out = (np.where(d0 > -40)[0][-1] + 1) * h
            b_in = np.where(d1 > -40)[0][0] * h
            start = a_out + int(prev_gap * SR) - b_in
            n = max(len(y), start + len(z))
            out = np.zeros(n, np.float32); out[:len(y)] += y; out[start:start + len(z)] += z
            off = start / SR
            toks += [dict(t, t0=t["t0"] + off, t1=t["t1"] + off) for t in tk]
            opened.append(dict(after_word=None, word=prev_last, tts_s=None, target_s=prev_gap, final_s=prev_gap,
                               opened_s=0.0, joined_speech=False, dip_db=None, breath=prev_br, split=True,
                               point_s=round(a_out / SR, 3), crossfade_ms=[0, 0]))
            if prev_br:
                mids.append((off + b_in / SR - 0.08, prev_gap - 0.15))
            opened += [dict(o, point_s=round(o["point_s"] + off, 3)) for o in op]
            mids += [(a + off, r) for a, r in md]
            y = out
        prev_gap, prev_br = gap, br
        prev_last = [t for t in tk if t["word"]][-1]["text"]
    return (" ".join(texts), y, toks, opened, mids)


def dress(y, toks, mids, bh, seed, female, vo, lufs, dev):
    """speech track -> loudness -> head/tail pads and handles -> inhales -> device -> + room-tone bed.
    Returns (dict of aligned arrays, toks on the file clock, layout)."""
    rng = np.random.default_rng(seed * 7 + 3)
    y = L.V.normalise(y, target=lufs)
    pk = peak_rms(y)
    lvl_head = pk * 10 ** ((-33.0 if vo else -31.0) / 20)
    lvl_mid = pk * 10 ** ((-34.0 if vo else -33.0) / 20)
    bdur = float(rng.uniform(0.30, 0.40)) if bh else 0.0
    pre = HANDLE + (0.05 + bdur + 0.10 if bh else HEAD) - 0.03
    n = int(pre * SR) + len(y) + int(HANDLE * SR)
    sp = np.zeros(n, np.float32); sp[int(pre * SR): int(pre * SR) + len(y)] = y
    br = np.zeros(n, np.float32)
    lay = {"pre_s": round(pre, 3), "breaths": []}
    onset = pre + 0.03
    if bh:
        b = inhale(rng, bdur, female, lvl_head)
        e = int((onset - 0.10) * SR); br[e - len(b): e] += b
        lay["breaths"].append({"where": "head", "t0": round((e - len(b)) / SR, 3), "t1": round(e / SR, 3)})
    for t_end, room in mids:
        dur = float(min(rng.uniform(0.24, 0.32), room))
        if dur < 0.16:
            lay["breaths"].append({"where": "mid", "skipped": f"pause too short ({room + 0.15:.2f} s)"})
            continue
        b = inhale(rng, dur, female, lvl_mid)
        e = int((t_end + pre) * SR); br[e - len(b): e] += b
        lay["breaths"].append({"where": "mid", "t0": round((e - len(b)) / SR, 3), "t1": round(e / SR, 3)})
    toks = [dict(t, t0=t["t0"] + pre, t1=t["t1"] + pre) for t in toks]
    bed = tone(n, seed)
    target = LAPTOP_LUFS if dev == "laptop" else lufs
    for _ in range(4):                            # one static gain on the voice, measured on the finished file with its bed
        g = 10 ** ((lufs - L.V.lufs(sp + bed)) / 20)
        sp, br = (sp * g).astype(np.float32), (br * g).astype(np.float32)
        if L.V.true_peak_db(sp) > -1.6:           # a peaky read: the pipeline's limiter on the peaks only
            sp = np.asarray(pb.Limiter(threshold_db=-2.6, release_ms=60)(sp.reshape(1, -1), SR), dtype=np.float32).reshape(-1)
        if abs(L.V.lufs(sp + bed) - lufs) < 0.03 and L.V.true_peak_db(sp) <= -1.55:
            break
    dry = sp + br
    out = {"speech": sp, "breath": br, "bed": bed, "dry": dry + bed, "dry_nobreath": sp + bed, "target_lufs": target}
    if dev in DEVICES:
        ch = DEVICES[dev]()
        wet = L.V.apply_chain(dry, SR, ch).astype(np.float32)
        wet_nb = L.V.apply_chain(sp, SR, ch).astype(np.float32)
        if dev == "laptop":                       # record_v5's derived laptop line: a quieter bed, gain measured with it
            bed_d = tone(n, 26, dbfs=TONE_DBFS - 6.0)
            for k, w in (("deliv", wet), ("deliv_nobreath", wet_nb)):
                z = L.V.normalise(w, target=target)
                for _ in range(3):
                    z = z * 10 ** ((target - L.V.lufs(z + bed_d)) / 20)
                out[k] = (z + bed_d).astype(np.float32)
        else:                                     # record_v5's call branch, unchanged
            out["deliv"] = L.V.normalise(wet, target=target) + bed
            out["deliv_nobreath"] = L.V.normalise(wet_nb, target=target) + bed
        out["device_chain"] = ch
    else:
        out["deliv"] = out["dry"]; out["deliv_nobreath"] = out["dry_nobreath"]
        out["device_chain"] = None
    return out, toks, lay


# ============================================================================================ measures
def measure_speech(sp, toks, text):
    d = rms_db(sp, SR, 0.01)
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
    nw = len([t for t in toks if t["word"]])
    syl = syllables(re.sub(r"\[([^\]]*)\]\(/[^)]*/\)", r"\1", text))
    art = span - sum(p for p in pauses if p >= 0.10)
    d5 = rms_db(sp, SR, 0.005)
    i40 = np.where(d5 > -40)[0]; i10 = np.where(d5 > -10)[0]; i60 = np.where(d5 > -60)[0]
    return dict(audible_in_s=round(a_in, 3), audible_out_s=round(a_out, 3), span_s=round(span, 3), words=nw,
                wpm=round(nw / span * 60, 1), syllables=syl, articulation_sps=round(syl / art, 2) if art > 0 else None,
                pauses_s=pauses, longest_internal_gap_s=max(pauses) if pauses else 0.0,
                rise_ms=float((i10[0] - i40[0]) * 5), decay_ms=float((i40[-1] - i10[-1]) * 5),
                head_s=round(a_in, 3), tail_s=round(len(sp) / SR - (i60[-1] + 1) * 0.005, 3),
                decay_to_60_s=round((i60[-1] - i40[-1]) * 0.005, 3))


def f0_fast(y):
    """cheap pitch numbers for the row (not the v5 pYIN pass): YIN at 16 kHz on frames within 28 dB of the peak,
    octave outliers (> 9 st from the median) dropped. -> (median Hz, 5-95 % range st) or (None, None)"""
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


def hard(o):
    """a pause opened where Kokoro ran the words together with the voice still sounding"""
    return bool(o.get("joined_speech")) and (o.get("dip_db") if o.get("dip_db") is not None else -99) > -20


def trail(arr, toks, word, n_ph, t_in, drop_db, fade_s):
    """interrupted delivery: from t_in the voice drops drop_db (40 ms ramp); from t_fade it goes out over fade_s.
    Returns (trimmed array without the bed, t_in, t_fade)."""
    w = next(t for t in toks if t["word"] and t["text"].lower().startswith(word))
    if n_ph:
        spans = L.phoneme_spans(w)
        est = spans[min(n_ph, len(spans)) - 1][2]
        d = rms_db(arr, SR, 0.005); h = int(0.005 * SR)
        a, b = int((est - 0.03) * SR / h), int((est + 0.03) * SR / h)
        t_fade = (a + int(np.argmin(d[a:b]))) * h / SR
        t_in = t_fade
    else:
        t_fade = w["t1"]
    n = len(arr)
    g = np.ones(n, np.float32)
    i0 = int(t_in * SR); r = int(0.04 * SR)
    g[i0:i0 + r] = np.linspace(1, 10 ** (drop_db / 20), r); g[i0 + r:] = 10 ** (drop_db / 20)
    j0 = int(t_fade * SR); fl = int(fade_s * SR)
    g[j0:j0 + fl] *= np.cos(np.linspace(0, np.pi / 2, fl)) ** 2
    g[j0 + fl:] = 0.0
    end = j0 + fl + int(HANDLE * SR)
    return (arr * g)[:end], t_in, t_fade
