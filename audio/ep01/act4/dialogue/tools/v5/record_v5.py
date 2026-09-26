"""record_v5.py - record Ep1 Act Four for draft 5.1 (edit-plan-v5 §7) with the v5 method (voice-diagnosis-v4 §4).

Run from this folder (audio/ep01/act4/dialogue/tools/v5/):  HF_HUB_OFFLINE=1 ../../../../../.venv-casting/bin/python record_v5.py [line-id ...]
then  ../../../../../.venv-casting/bin/python qa_v5.py   (plan_lines.json comes from parse_plan.py, which reads edit-plan-v5.md §7)

Run:  HF_HUB_OFFLINE=1 audio/.venv-casting/bin/python record_v5.py [line-id ...]

The method, as implemented here:
  * one whole Kokoro read per turn, at the speed the plan chose from intent (in the character's §4.2 band), held in a
    scene; never solved to a picture slot, never time-stretched, no carrier cut, no splice, no word lifted from another
    take (Gerg's two lines are one read, cut apart inside its own opened room-tone pause);
  * sentence and phrase pauses opened to their intended length inside the read, at the quietest 5 ms of Kokoro's own
    stop, with 8 ms crossfades; the gap is room tone (a continuous bed under the whole file), never digital black;
  * every take keeps its own onset (>= 0.15 s before the first sound) and decay (to -60 dB re peak, + 0.10 s), with
    0.35 s room-tone handles each side; an inhale (a synthetic PLACEHOLDER, never taken from or matched to a real
    person) before a new thought where the spec asks for one;
  * the two interrupted lines are read complete; the delivered file trails them (-8 dB, out over 150 ms) where the
    interrupter or the world takes the tail, and the complete read is delivered beside it;
  * call / monitor voices get the light call filter (record_32.call_filter) with the dry read in clean/; the laptop
    "super." is derived from the his-side read through the laptop-speaker chain at -22 LUFS.
Takes: three seeds at the plan's speed (Kokoro's seed moves only the vocoder noise); the yes/no questions also read at
plan +-0.03 (inside the band); a few lines have text-shaping variants (same words). Picks are measured: ASR word
recall, then UTMOS22 (paired with a plain whole read of the same words at speed 1.0), then the line's own criterion
(a question's final lift, a stress's prominence, an echo's contour match). Nobody has listened.
"""
from __future__ import annotations

import json, os, re, sys, time, shutil, difflib, warnings
warnings.filterwarnings("ignore")
os.environ.setdefault("HF_HUB_OFFLINE", "1")
HERE = os.path.dirname(os.path.abspath(__file__))
REPO = "/home/jgon/project/art/mrmas"
TOOLS = os.path.join(REPO, "audio/ep01/act4/dialogue/tools")
sys.path.insert(0, TOOLS); sys.path.insert(0, HERE)
import numpy as np
import soundfile as sf
from scipy.signal import resample_poly, butter, sosfilt, lfilter
import a4lib as L            # read-only
import record_32 as R        # read-only: voices_32(), call_filter()
import cast_a4 as CA         # read-only: laptop_speaker()
import torch
import pedalboard as pb
torch.set_num_threads(6)
SPEECH_ONLY = {}
import lines_v5 as S5
import mos

SR, SR_TTS, FPS = L.SR, L.SR_TTS, L.FPS
DLG = os.path.join(REPO, "audio/ep01/act4/dialogue")
OUT = os.path.join(DLG, os.environ.get("V5_OUT", "v5"))
for sub in ("wav", "mp3", "clean", "nobreath", "complete", "fallback", "takes", "qa"):
    os.makedirs(os.path.join(OUT, sub), exist_ok=True)
import tempfile
TMP = tempfile.mkdtemp(prefix="a4v5-asr-")
LINES_JSON = os.environ.get("V5_LINES", os.path.join(DLG, "lines-v5.json"))
V32 = R.voices_32()
PLAN = json.load(open(os.path.join(HERE, "plan_lines.json")))
LINES = {r["id"]: r for r in PLAN["voiced"]}
ORDER = [r["id"] for r in PLAN["voiced"]]
V4 = {r["id"]: r for r in json.load(open(os.path.join(DLG, "lines.json")))}
MODEL = "Kokoro-82M v1.0 (hexgrad/Kokoro-82M; misaki G2P; lang 'a' American English)"
HANDLE, HEAD, TAIL = 0.35, 0.15, 0.10
TONE_DBFS = -62.0
DLG_LUFS, LAPTOP_LUFS = -16.0, -22.0
MARK = re.compile(r"\{(s?)(b?)(\d*\.?\d+)\}")
VOW = set("AIOWYQaeiouæɑɐɒɔəɛɜɪʊʌᵻᵊ")
NAMES = {"mas", "manalt", "gerg", "mockbran", "alyi", "neleh", "ttemme", "yrral", "nozama", "macrosoft", "macrosofts",
         "nopeai", "nopeais", "rima", "terb", "mada", "mario"}
FEMALE = {"neleh", "rima-tamuri", "adelina", "tiled-employee"}


def log(*a):
    print(*a, flush=True)


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
    """PLACEHOLDER inhale (voice-diagnosis §4.4): band-limited pink noise with a breath envelope (slow rise, quicker
    close), broadly lower or higher register. level_lin is its peak-window RMS. Never a real person's breath."""
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
    """'{sX}' marks a boundary between two separate whole reads (used only where Kokoro runs the words together and a
    stop can't be opened without cutting into the voice). -> [(segment say, gap after, breath after)]"""
    out, pos = [], 0
    for m in MARK.finditer(say):
        if m.group(1) == "s":
            out.append((say[pos:m.start()].strip(), float(m.group(3)), m.group(2) == "b"))
            pos = m.end()
    out.append((say[pos:].strip(), 0.0, False))
    return out


def speech_multi(say, v, speed, seed):
    """one or more whole reads (see segments()), joined so the audible gap is the intended one; overlapping air adds"""
    segs = segments(say)
    if len(segs) == 1:
        text, breaks = parse(say)
        return (text,) + speech_track(text, breaks, v, speed, seed)
    y, toks, opened, mids, texts = np.zeros(0, np.float32), [], [], [], []
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
    """the words as heard, for ASR: print marks out, the interrupted line's dash kept as is"""
    t = line_text.replace("…", " ").replace("“", "").replace("”", "").replace('"', "")
    return re.sub(r"\s+", " ", t).strip()


def word_recall(ref, hyp):
    """share of the reference's non-name words that ASR returns, in order"""
    r = [w for w in plain_words(ref) if w.replace("'s", "") not in NAMES]
    h = plain_words(hyp)
    if not r:
        return 1.0
    sm = difflib.SequenceMatcher(a=r, b=h, autojunk=False)
    return round(sum(b.size for b in sm.get_matching_blocks()) / len(r), 3)


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
            # at a real stop: 8 ms crossfades. Where Kokoro ran the words together (no frame under -40 dB), shape the
            # cut as the word's own decay and a fresh onset instead (60 ms out, 25 ms in), and flag it for the ear
            fo, fi = (0.008, 0.008) if best else (0.060, 0.025)
            rec["crossfade_ms"] = [int(fo * 1000), int(fi * 1000)]
            left, right = y[:pt].copy(), y[pt:].copy()
            a_, b_ = min(int(fo * SR), len(left) // 2), min(int(fi * SR), len(right) // 2)
            left[-a_:] *= np.cos(np.linspace(0, np.pi / 2, a_)) ** 2; right[:b_] *= np.sin(np.linspace(0, np.pi / 2, b_)) ** 2
            y = np.concatenate([left, np.zeros(int(round(extra * SR)), np.float32), right])
            L._shift(toks, pt / SR, int(round(extra * SR)) / SR)
        # measure the pause as delivered
        d = rms_db(y, SR, 0.005)
        seg = d[int(pt / h) - 40: int(pt / h) + int((max(extra, 0) + 0.3) * SR / h)] < -40
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
            onset = j * h / SR
            mids.append((onset - 0.08, rec["final_s"] - 0.15))
    return y, toks, opened, mids


def dress(y, toks, mids, bh, seed, female, vo, lufs, dev):
    """speech track -> loudness -> head/tail pads and handles -> inhales -> device -> + room-tone bed.
    Returns dict of aligned arrays and the layout."""
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
    # loudness on the finished, padded file (the 400 ms gating blocks see the handles): one static gain on the voice
    for _ in range(4):                            # static gain on the voice, measured on the finished file with its bed
        g = 10 ** ((lufs - L.V.lufs(sp + bed)) / 20)
        sp, br = (sp * g).astype(np.float32), (br * g).astype(np.float32)
        if L.V.true_peak_db(sp) > -1.6:           # a peaky read: the pipeline's limiter on the peaks only
            sp = np.asarray(pb.Limiter(threshold_db=-2.6, release_ms=60)(sp.reshape(1, -1), SR), dtype=np.float32).reshape(-1)
        if abs(L.V.lufs(sp + bed) - lufs) < 0.03 and L.V.true_peak_db(sp) <= -1.55:
            break
    dry = sp + br
    out = {"speech": sp, "breath": br, "bed": bed, "dry": dry + bed, "dry_nobreath": sp + bed}
    if dev == "call":
        ch = R.call_filter()
        wet = L.V.apply_chain(dry, SR, ch).astype(np.float32)
        wet_nb = L.V.apply_chain(sp, SR, ch).astype(np.float32)
        out["deliv"] = L.V.normalise(wet, target=lufs) + bed           # loudness and the -1.5 dBTP ceiling
        out["deliv_nobreath"] = L.V.normalise(wet_nb, target=lufs) + bed
    else:
        out["deliv"] = out["dry"]; out["deliv_nobreath"] = out["dry_nobreath"]
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


def zero_runs(y, min_s=0.01):
    z = (y == 0.0).astype(np.int8)
    if not z.any():
        return 0
    dz = np.diff(np.concatenate([[0], z, [0]]))
    starts, ends = np.where(dz == 1)[0], np.where(dz == -1)[0]
    return int(np.sum((ends - starts) >= int(min_s * SR)))


def f0_track(y):
    t, f0, _ = L.f0_contour(y)
    return t, f0


def seg_lift(y, toks, word):
    """final move (st) of the question's last word: median F0 of its last 35 % of voiced frames against its first 65 %
    and the word before it"""
    words = [w for w in toks if w["word"]]
    idx = [i for i, w in enumerate(words) if w["text"].lower().strip(".,?!").startswith(word)] if word else [len(words) - 1]
    if not idx:
        idx = [len(words) - 1]
    i = idx[-1] if not word else idx[0]
    w = words[i]; wp = words[i - 1] if i > 0 else w
    t, f0 = f0_track(y)
    ok = np.isfinite(f0)
    sel = ok & (t >= w["t0"]) & (t <= w["t1"] + 0.05)
    prev = ok & (t >= wp["t0"]) & (t < w["t0"])
    fv = f0[sel]
    if len(fv) < 4:
        return None
    k = max(1, int(round(len(fv) * 0.35)))
    ref = np.concatenate([fv[:-k], f0[prev]]) if prev.any() else fv[:-k]
    return round(float(12 * np.log2(np.median(fv[-k:]) / np.median(ref))), 2)


def word_prom(y, toks, word):
    """(peak F0 st re the line median, RMS dB re the line's loudest word) of a word"""
    t, f0 = f0_track(y)
    ok = np.isfinite(f0)
    med = np.median(f0[ok])
    w = next(w for w in toks if w["word"] and w["text"].lower().startswith(word))
    sel = ok & (t >= w["t0"]) & (t <= w["t1"])
    pk = float(12 * np.log2(np.max(f0[sel]) / med)) if sel.any() else None
    def wdb(ww):
        s0, s1 = int(ww["t0"] * SR), int(ww["t1"] * SR)
        return 20 * np.log10(np.sqrt(np.mean(y[s0:s1] ** 2)) + 1e-9)
    loud = max(wdb(ww) for ww in toks if ww["word"])
    return pk, wdb(w) - loud


def seg_contour(y, toks, first_word, n=50):
    words = [w for w in toks if w["word"]]
    i = next(k for k, w in enumerate(words) if w["text"].lower().startswith(first_word))
    t0, t1 = words[i]["t0"], words[-1]["t1"]
    t, f0 = f0_track(y)
    ok = np.isfinite(f0) & (t >= t0) & (t <= t1)
    if ok.sum() < 5:
        return None, t1 - t0
    tv, fv = t[ok], f0[ok]
    st = 12 * np.log2(fv / np.median(fv))
    return np.interp(np.linspace(tv[0], tv[-1], n), tv, st), t1 - t0


# ============================================================================================ takes
_plain_cache = {}


def plain_read(text, v, key):
    """the same words, one read, speed 1.0, seed 1, the same chain, no pauses opened (the §4.7 pairing reference)"""
    if key in _plain_cache:
        return _plain_cache[key]
    y, toks, _, _ = speech_track(text, [], v, 1.0, 1)
    y = L.V.normalise(y, target=-16.0)
    y = np.concatenate([np.zeros(int(0.3 * SR), np.float32), y, np.zeros(int(0.3 * SR), np.float32)])
    s = mos.utmos(y + tone(len(y), 1), SR)      # the same room-tone bed as the takes, so the pairing is like for like
    _plain_cache[key] = s
    return s


def one_take(lid, spec, v, say, speed, seed, lufs, dev, tag):
    text, y, toks, opened, mids = speech_multi(say, v, speed, seed)
    slug = v["_slug"]
    out, toks, lay = dress(y, toks, mids, spec.get("bh", 0), seed, slug in FEMALE, slug.endswith("-vo"), lufs, dev)
    toks = L.clip_words(out["speech"] + 1e-7, toks)
    m = measure_speech(out["speech"], toks, text)
    score = mos.utmos(out["dry_nobreath"], SR)
    return dict(tag=tag, say=say, text=text, speed=speed, seed=seed, opened=opened, layout=lay, toks=toks, arrays=out,
                m=m, utmos=round(score, 3))


def add_asr(tk, ref):
    p = os.path.join(TMP, "asr.wav")
    sf.write(p, tk["arrays"]["dry_nobreath"], SR, subtype="PCM_24")
    hyp, lp, ws = L.asr_words(p)
    tk["asr"] = hyp; tk["logprob"] = round(lp, 3)
    tk["cer"] = round(L.cer(ref, hyp), 3)
    tk["recall"] = word_recall(ref, hyp)
    tk["align"] = L.align_check(tk["toks"], ws)


def candidates(lid, spec, v):
    base = LINES[lid]["speed"]
    lo, hi = S5.BANDS[v["_slug"]][0]
    c = [(spec["say"], base, s, f"s{s}") for s in (1, 2, 3)]
    if lid in S5.YESNO:
        for dv in (-0.03, 0.03):
            sp = round(base + dv, 3)
            if min(base, lo) - 1e-9 <= sp <= max(base, hi) + 1e-9:
                c += [(spec["say"], sp, s, f"sp{sp:.2f}-s{s}") for s in (1, 2)]
    for j, var in enumerate(spec.get("var", [])):
        c += [(var["say"], base, s, f"v{j + 1}-s{s}") for s in (1, 2, 3)]
    if spec.get("echo"):
        for sp in (1.00, 1.05):
            for j, say in enumerate([spec["say"]] + [x["say"] for x in spec.get("var", [])]):
                c += [(say, sp, s, f"e{j}-sp{sp:.2f}-s{s}") for s in (1, 2)]
    return c


ECHO_REF = {}


def hard(o):
    """a pause opened where Kokoro ran the words together with the voice still sounding (the cut point > -30 dB re peak)"""
    return bool(o.get("joined_speech")) and (o.get("dip_db") if o.get("dip_db") is not None else -99) > -20


def pick(lid, spec, takes, ref):
    """ASR recall first, then no pause cut inside the voice, then UTMOS, then the line's own criterion."""
    takes.sort(key=lambda t: -t["utmos"])
    any_hard = any(hard(o) for t in takes for o in t["opened"])
    for t in takes:                            # ASR in UTMOS order until one passes (all for the criterion lines)
        if "asr" not in t:
            add_asr(t, ref)
        if t["recall"] >= 1.0 and not any_hard and not (lid in S5.YESNO or spec.get("stress") or spec.get("echo")):
            break
    heard = [t for t in takes if "recall" in t]
    maxr = max(t["recall"] for t in heard)
    ok = [t for t in heard if t["recall"] >= maxr - 1e-9]
    soft = [t for t in heard if t["recall"] >= maxr - 0.1 and not any(hard(o) for o in t["opened"])]
    hard_note = ""
    if soft and any(any(hard(o) for o in t["opened"]) for t in ok):
        n_want = {float(m.group(3)) for m in MARK.finditer(spec.get("say", ""))} if spec.get("say") else set()
        def drops_long(t):      # leaves an intended stop of 0.3 s or more unopened (Kokoro's run-on kept)
            have = [float(m.group(3)) for m in MARK.finditer(t["say"])]
            want = [float(m.group(3)) for m in MARK.finditer(spec.get("say", ""))]
            for w in have:
                if w in want: want.remove(w)
            return any(w >= 0.3 for w in want)
        full = [t for t in soft if not drops_long(t)]
        ok = full or soft
        hard_note = (" (takes with a pause cut inside the voice set aside; a stop of 0.3 s or more is kept as a real stop, "
                     "by separate whole reads, rather than run on)") if full else " (takes with a pause cut inside the voice set aside: a clean take exists)"
    top = max(t["utmos"] for t in ok)
    near = [t for t in ok if t["utmos"] >= top - 0.2]
    why = ""
    if lid in S5.YESNO:
        for t in near:
            t["q_lift_st"] = seg_lift(t["arrays"]["speech"], t["toks"], S5.Q_WORD.get(lid))
        lifted = [t for t in near if (t["q_lift_st"] or -9) >= 1.0]
        if lifted:
            best = max(lifted, key=lambda t: t["utmos"])
            why = f"a yes/no question: the best UTMOS among {len(lifted)} takes with a final lift of 1 st or more (within 0.2 of the top)"
        else:
            best = max(near, key=lambda t: (t["q_lift_st"] or -9))
            why = f"a yes/no question: no take lifts 1 st; the most lift among the {len(near)} takes within 0.2 UTMOS of the top"
    elif spec.get("stress"):
        tw, ow = spec["stress"]
        for t in near:
            a, b = word_prom(t["arrays"]["speech"], t["toks"], tw), word_prom(t["arrays"]["speech"], t["toks"], ow)
            t["stress"] = {tw: [round(float(a[0] or 0), 2), round(float(a[1]), 2)], ow: [round(float(b[0] or 0), 2), round(float(b[1]), 2)],
                           "diff_st": round(float((a[0] or 0) - (b[0] or 0)), 2), "diff_db": round(float(a[1] - b[1]), 2)}
        best = max(near, key=lambda t: t["stress"]["diff_st"] + 0.3 * t["stress"]["diff_db"])
        why = f"stress on '{tw}': the most prominence against '{ow}' (F0 peak + 0.3 x level) among takes within 0.2 UTMOS of the top"
    elif spec.get("echo"):
        rc = ECHO_REF.get(spec["echo"])
        for t in near:
            c, dur = seg_contour(t["arrays"]["speech"], t["toks"], "for")
            t["echo"] = {"contour_r": round(float(np.corrcoef(c, rc[0])[0, 1]), 3) if (c is not None and rc and rc[0] is not None) else None,
                         "dur_ratio": round(dur / rc[1], 3) if rc else None}
        best = max(near, key=lambda t: (t["echo"]["contour_r"] or -1) - abs(1 - (t["echo"]["dur_ratio"] or 1)))
        why = f"the echo of {spec['echo']}: the closest 'for how long' contour and length among takes within 0.2 UTMOS of the top"
    else:
        best = max(ok, key=lambda t: t["utmos"])
        why = "the best UTMOS among the takes ASR hears whole" if maxr >= 1.0 else f"the best UTMOS among the takes with the best ASR word recall ({maxr})"
    return best, why + hard_note


# ============================================================================================ trails, joins, derived
def trail(arr, toks, word, n_ph, t_in, drop_db, fade_s):
    """interrupted delivery: from t_in the voice drops drop_db (40 ms ramp); from t_fade it goes out over fade_s.
    Returns (trimmed array without the bed, t_in, t_fade)."""
    w = next(t for t in toks if t["word"] and t["text"].lower().startswith(word))
    if n_ph:                         # the world takes it inside the word: after n phonemes, at the nearest dip
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


def write(y, rel_wav, mp3=True):
    wav = os.path.join(OUT, rel_wav)
    os.makedirs(os.path.dirname(wav), exist_ok=True)
    m = os.path.join(OUT, "mp3", os.path.basename(rel_wav).replace(".wav", ".mp3")) if mp3 else None
    L.write(y.astype(np.float32), wav, m)
    return os.path.relpath(wav, REPO), (os.path.relpath(m, REPO) if m else None)


def file_qa(y, target):
    return dict(lufs_i=round(L.V.lufs(y), 2), target_lufs=target, true_peak_dbtp=round(L.V.true_peak_db(y), 2),
                clipped_samples=int(np.sum(np.abs(y) >= 0.999)), digital_black_runs=zero_runs(y))


# ============================================================================================ main
def speaker_of(label):
    base = label.split("(")[0].strip()
    return base, ("(V.O.)" in label)


def camera_of(label, dev):
    l = label.lower()
    if "v.o." in l: return "vo"
    if "through their laptop" in l: return "speaker"
    if "o.s." in l: return "os"
    if "reflection" in l: return "reflection"
    if "blueprint" in l or "spinner" in l: return "blueprint"
    if dev == "call" or "monitor" in l or "tile" in l or "on the call" in l: return "monitor"
    return "on"


def room_of(lid, shot, dev):
    s = shot.split("→")[0]
    if s.startswith("S1"): return "the suite (THE PLAN over the blueprint)" if lid.startswith("a5-25") else "the suite"
    if s.startswith("S2"): return "the dark room (V.O.)"
    if s in ("S3.06", "S3.07"): return "the all-hands"
    if s.startswith("S3"): return "Neleh's office, day" if s != "S3.05" else "Neleh's office, evening"
    if s == "S4.08": return "the split: the boardroom (Neleh) / the lighthouse (Mario, Adelina)"
    if s.startswith("S4"): return "the boardroom"
    if s in ("S5.11", "S5.12"): return "the dark room; Tasya through the slate door"
    if s.startswith("S5"): return "the dark room; Gerg on the monitor" if dev == "call" else "the dark room"
    if s.startswith("S6"): return "the avalanche (Neleh's tile)"
    if s.startswith("S7.01"): return "the two boxes (P2)"
    if s.startswith("S7.02") or s.startswith("S7.03"): return "the bullpen, day"
    if s.startswith("S7"): return "the boardroom, night, fires"
    if s == "S8.05": return "the lobby, night"
    if s == "S8.07": return "the vault corridor"
    if s.startswith("S8"): return "the bullpen (the memo)"
    return ""


def main(ids):
    t_start = time.time()
    qa_all, rows = {}, {}
    prev = {}
    if os.path.exists(os.path.join(OUT, "qa", "takes-v5.json")) and ids:
        qa_all = json.load(open(os.path.join(OUT, "qa", "takes-v5.json")))
    if os.path.exists(LINES_JSON) and ids:
        prev = {r["id"]: r for r in json.load(open(LINES_JSON))}
    todo = ids or ORDER
    # the echo reference first (Rima's "For how long?")
    order = sorted(todo, key=lambda i: 0 if i == "a5-27-10" else 1)
    if "a5-27-43" in order and "a5-27-10" not in order:
        order = ["a5-27-10"] + order
    for lid in order:
        ln, spec = LINES[lid], S5.S[lid]
        if spec.get("derive") or spec.get("reuse") or spec.get("joined_part"):
            continue
        spk, vo = speaker_of(ln["speaker"])
        slug = S5.VOICE_OF[spk] + ("-vo" if vo else "")
        v = dict(V32[slug]); v["_slug"] = slug
        lufs = -18.0 if vo else DLG_LUFS
        dev = spec.get("dev")
        ref = ref_text(ln["text"]) if not spec.get("trail") else ref_text(re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", MARK.sub("", spec["say"])))
        if spec.get("joined"):
            ref = "Scroll to the bottom. Alyi signed it."
        log(f"== {lid} {spk}{' V.O.' if vo else ''} @ {ln['speed']} :: {spec['say'][:70]}")
        cands = candidates(lid, spec, v)
        takes = [one_take(lid, spec, v, say, sp, seed, lufs, dev, tag) for say, sp, seed, tag in cands]
        # a pause that has to be opened where Kokoro ran the words together: read it again with a longer print stop
        # ('...' in place of the stop, same words) and prefer takes that don't need the cut
        for t in list(takes):
            if t["seed"] == 1 and any(o["joined_speech"] for o in t["opened"]):
                marks = list(MARK.finditer(t["say"]))
                say2 = t["say"]
                for o, mk in sorted(zip(t["opened"], marks), key=lambda z: -z[1].start()):
                    head = say2[: mk.start()].rstrip()
                    if o["joined_speech"] and re.search(r"[.,:;]$", head):   # never a '?' or '!': those carry the tune
                        say2 = re.sub(r"[.,:;]$", "", head) + "..." + say2[mk.start():]
                if say2 != t["say"]:
                    log(f"   joined speech at a pause: also reading '{say2[:60]}'")
                    takes += [one_take(lid, spec, v, say2, t["speed"], s_, lufs, dev, f"{t['tag']}-dots-s{s_}") for s_ in (1, 2, 3)]
                say3 = t["say"]
                for o, mk in sorted(zip(t["opened"], marks), key=lambda z: -z[1].start()):
                    if hard(o):
                        say3 = say3[: mk.start()] + "{s" + mk.group(2) + mk.group(3) + "}" + say3[mk.end():]
                if say3 != t["say"]:
                    log(f"   a pause inside the voice: also reading it as separate whole reads '{say3[:60]}'")
                    takes += [one_take(lid, spec, v, say3, t["speed"], s_, lufs, dev, f"{t['tag']}-split-s{s_}") for s_ in (1, 2, 3)]
                    say4 = t["say"]
                    for o, mk in sorted(zip(t["opened"], marks), key=lambda z: -z[1].start()):
                        if hard(o):
                            say4 = say4[: mk.start()] + say4[mk.end():]
                    log(f"   ... and with Kokoro's own junction left unopened '{say4[:60]}'")
                    takes += [one_take(lid, spec, v, say4, t["speed"], s_, lufs, dev, f"{t['tag']}-keep-s{s_}") for s_ in (1, 2, 3)]
        text0 = parse(MARK.sub("", spec["say"]))[0]
        plain = plain_read(text0, v, (slug, text0))
        best, why = pick(lid, spec, takes, ref)
        if spec.get("split_alt") and best.get("recall", 1) < 1.0:
            log("  whole read fails ASR: the split read would go here (not needed unless flagged)")
        SPEECH_ONLY[lid] = (best["arrays"]["speech"], best["seed"])
        if lid == "a5-27-10":
            ECHO_REF[lid] = seg_contour(best["arrays"]["speech"], best["toks"], "for")
        # the v4 take on the same words, for the kept-line comparison
        v4_id = {"a5-25-06": "a4-25-02", "a5-26-01": "a4-26-01", "a5-27-15": "a4-27-04", "a5-27-28": "a4-27-13",
                 "a5-29-16": "a4-29-05", "a5-29-23": "a4-29-08", "a5-30-07": "a4-30-04", "a5-31-02": "a4-31-02",
                 "a5-27-24": "a4-27-09", "a5-27-25": "a4-27-10", "a5-27-32": "a4-27-15", "a5-27-34": "a4-27-16",
                 "a5-27-43": "a4-27-19", "a5-27-46": "a4-27-21", "a5-29-01": "a4-29-vo2", "a5-29-02": "a4-29-03",
                 "a5-29-17": "a4-29-06", "a5-30-08": "a4-30-05", "a5-30-09": "a4-30-06", "a5-30-17": "a4-30-09",
                 "a5-30-19": "a4-30-12", "a5-26a-01": "a4-26a-vo1", "a5-27-17": "a4-27-24"}.get(lid)
        u4 = None
        if v4_id:
            y4, _ = sf.read(os.path.join(REPO, V4[v4_id]["file"]), dtype="float32")
            u4 = round(mos.utmos(y4, SR), 3)
        arr = best["arrays"]
        # ---------------------------------------------------------------- files
        files = {}
        target = LAPTOP_LUFS if dev == "laptop" else lufs
        extra = {}
        if spec.get("joined"):
            a_id, b_id = spec["joined"]
            op = best["opened"][0]
            words = [t for t in best["toks"] if t["word"]]
            w_last = [w for w in words if w["text"].lower().startswith("bottom")][0]
            sp = arr["speech"]; d = rms_db(sp, SR, 0.005)
            j = int(w_last["t1"] * SR / int(0.005 * SR))
            while j < len(d) and d[j] > -60:
                j += 1
            decay_end = j * 0.005
            br0 = next(b["t0"] for b in best["layout"]["breaths"] if b.get("where") == "mid")
            cut = int(((decay_end + TAIL) + br0) / 2 * SR)
            joined_rel, _ = write(arr["deliv"], f"takes/{a_id}+{b_id}/joined.wav", mp3=False)
            parts = {a_id: slice(0, cut), b_id: slice(cut, len(sp))}
            for pid, slc in parts.items():
                off = slc.start / SR
                y_p = arr["deliv"][slc]
                f_rel, m_rel = write(y_p, f"wav/{pid}.wav")
                c_rel, _ = write(arr["dry"][slc], f"clean/{pid}.wav", mp3=False)
                toks_p = [dict(t, t0=t["t0"] - off, t1=t["t1"] - off) for t in best["toks"]
                          if t["t0"] >= off - 1e-6 and t["t0"] < off + len(y_p) / SR]
                mp = measure_speech(arr["speech"][slc], toks_p, re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", " ".join(t["text"] for t in toks_p if t["word"])))
                rows[pid] = build_row(pid, LINES[pid], spec if pid == a_id else S5.S[pid], v, best, why, takes, plain, u4 if pid == a_id else None,
                                      f_rel, m_rel, y_p, mp, toks_p, dev, target, extra={
                                          "clean": {"file": c_rel, "note": "the dry read (no call filter)"},
                                          "joined": {"with": b_id if pid == a_id else a_id, "file": joined_rel,
                                                     "offset_in_joined_s": round(off, 3),
                                                     "note": "one read for both lines; the files are cut from it inside its own room-tone pause, so they butt-join back into the read"},
                                          "breaths": [dict(b, t0=round(b["t0"] - off, 3), t1=round(b["t1"] - off, 3)) for b in best["layout"]["breaths"]
                                                      if "t0" in b and off <= b["t0"] < off + len(y_p) / SR],
                                          "opened_pauses": best["opened"] if pid == a_id else []}, sp=arr["speech"][slc])
            rows[b_id]["placement"]["gap_before_s_measured_in_read"] = round(rows[b_id]["pace"]["audible_in_s"] + (cut / SR) - (rows[a_id]["pace"]["audible_out_s"]), 3)
        else:
            if spec.get("trail"):
                tr = spec["trail"]
                c_rel, cm_rel = write(arr["deliv"], f"complete/{lid}.wav", mp3=False)
                w = next(t for t in best["toks"] if t["word"] and t["text"].lower().startswith(tr["word"]))
                t_in = (w["t1"] - tr["overlap_s"]) if not tr.get("n_ph") else None
                sp_t, t_in, t_fade = trail(arr["deliv"] - arr["bed"], best["toks"], tr["word"], tr.get("n_ph"), t_in, tr["drop_db"], tr["fade_s"])
                y_d = sp_t + arr["bed"][: len(sp_t)]
                f = int(0.01 * SR); y_d[-f:] *= np.linspace(1, 0, f)
                f_rel, m_rel = write(y_d, f"wav/{lid}.wav")
                extra["complete"] = {"file": c_rel, "note": "the whole sentence as read (the delivered file is this, trailed)"}
                extra["interrupt"] = {"by": tr["by"], "voice_drops_at_s": round(t_in, 3), "fade_from_s": round(t_fade, 3),
                                      "fade_s": tr["fade_s"], "drop_db": tr["drop_db"],
                                      "note": ("the interrupter's audible onset goes at voice_drops_at_s on this file's clock (a tail overlap of "
                                               f"{tr['overlap_s']} s into '{tr['word']}')") if not tr.get("n_ph") else
                                              f"the world (the tile's exit) lands at voice_drops_at_s, after '{w['text'][:4]}'; the voice drops {tr['drop_db']} dB and goes out over {tr['fade_s']} s"}
                y_out = y_d
            else:
                f_rel, m_rel = write(arr["deliv"], f"wav/{lid}.wav")
                y_out = arr["deliv"]
            if dev == "call":
                c_rel, _ = write(arr["dry"], f"clean/{lid}.wav", mp3=False)
                extra["clean"] = {"file": c_rel, "note": "the dry read (no call filter), -16 LUFS"}
            if best["layout"]["breaths"]:
                nb_rel, _ = write(arr["deliv_nobreath"], f"nobreath/{lid}.wav", mp3=False)
                extra["nobreath"] = {"file": nb_rel, "note": "the same take without the placeholder inhale(s)"}
            extra["breaths"] = best["layout"]["breaths"]
            extra["opened_pauses"] = best["opened"]
            rows[lid] = build_row(lid, ln, spec, v, best, why, takes, plain, u4, f_rel, m_rel, y_out, best["m"], best["toks"], dev, target, extra)
        # alternates for the criterion lines and the key ones
        keep = any(re.search(r"-(dots|split|keep)-", t["tag"]) for t in takes) or lid in S5.YESNO or spec.get("stress") or spec.get("echo") or spec.get("var") or spec.get("trail") or len(ln["text"]) > 90
        alts = []
        for t in sorted(takes, key=lambda t: -t["utmos"]):
            row = {k: t.get(k) for k in ("tag", "say", "speed", "seed", "utmos", "asr", "cer", "recall", "q_lift_st", "stress", "echo")}
            row["span_s"] = t["m"]["span_s"]; row["wpm"] = t["m"]["wpm"]; row["articulation_sps"] = t["m"]["articulation_sps"]
            if keep and t is not best:
                p_rel, _ = write(t["arrays"]["deliv"], f"takes/{lid}/{t['tag']}.wav", mp3=False)
                row["file"] = p_rel
            alts.append(row)
        qa_all[lid] = {"plain_utmos": round(plain, 3), "v4_utmos": u4, "picked": best["tag"], "takes": alts}
        rows[lid]["alt_takes"] = [a for a in alts if a.get("file")]
        # the fallback reading of the [K] line
        if spec.get("fallback"):
            fb = spec["fallback"]
            ft = [one_take(lid, spec, v, fb["say"], ln["speed"], s, lufs, dev, f"fb-s{s}") for s in (1, 2, 3)]
            fbest, fwhy = pick(lid + "-fb", {}, ft, fb["say"])
            ffile, fmp3 = write(fbest["arrays"]["deliv"], f"fallback/{lid}.wav")
            rows[lid]["fallback"] = {"text": fb["say"], "note": fb["note"], "file": ffile, "mp3": fmp3, "take": fbest["tag"],
                                     "span_s": fbest["m"]["span_s"], "wpm": fbest["m"]["wpm"], "utmos": fbest["utmos"],
                                     "asr": fbest["asr"], "recall": fbest["recall"],
                                     "qa": file_qa(fbest["arrays"]["deliv"], lufs)}
        json.dump([dict(prev, **rows).get(i) for i in ORDER if i in dict(prev, **rows)], open(os.path.join(TMP, "lines-v5.partial.json"), "w"), ensure_ascii=False, default=float)
        json.dump(qa_all, open(os.path.join(TMP, "takes-v5.partial.json"), "w"), ensure_ascii=False, default=float)
        log(f"   -> {best['tag']} UTMOS {best['utmos']} (plain {plain:.2f}{', v4 %.2f' % u4 if u4 else ''}) span {best['m']['span_s']} s "
            f"{best['m']['wpm']} wpm art {best['m']['articulation_sps']} | ASR '{best.get('asr')}' | {time.time() - t_start:.0f}s")
    # ---------------------------------------------------------------- derived and reused lines
    for lid in (ids or ORDER):
        spec = S5.S[lid]
        if spec.get("reuse") or spec.get("derive"):
            src_id = spec.get("reuse") or spec.get("derive")
            src = rows.get(src_id) or prev.get(src_id)
            ln = LINES[lid]
            if spec.get("reuse"):
                shutil.copyfile(os.path.join(REPO, src["file"]), os.path.join(OUT, "wav", lid + ".wav"))
                shutil.copyfile(os.path.join(REPO, src["mp3"]), os.path.join(OUT, "mp3", lid + ".mp3"))
                r = json.loads(json.dumps(src))
                r.update(id=lid, scene=ln["scene"], text=ln["text"], delivery=ln["delivery"], tag=ln["tag"], shot_id=ln["shot"],
                         file=os.path.relpath(os.path.join(OUT, "wav", lid + ".wav"), REPO),
                         mp3=os.path.relpath(os.path.join(OUT, "mp3", lid + ".mp3"), REPO), reused_from=src_id,
                         pick_reason=f"the same canned read as {src_id} (by design: 'The same canned, pleasant read as THE PLAN's.')",
                         takes_tried=0, alt_takes=[], status="kept-reused")
                r["placement"] = placement(lid)
                r["room"] = room_of(lid, ln["shot"], None)
                r["shot"] = ln["shot"]; r["cue"] = cue_of(ln)
                rows[lid] = r
            else:  # the laptop line: the his-side read (no inhale), through the laptop speaker
                if src_id in SPEECH_ONLY:           # the bare voice of the same take (no inhale, no room tone)
                    y = SPEECH_ONLY[src_id][0]
                else:
                    y, sr = sf.read(os.path.join(REPO, src["nobreath"]["file"] if src.get("nobreath") else src["file"]), dtype="float32")
                bed = tone(len(y), 26, dbfs=TONE_DBFS - 6.0)
                chain = CA.laptop_speaker()
                z = L.V.apply_chain(np.concatenate([y, np.zeros(int(0.05 * SR), np.float32)]), SR, chain)[: len(y)]
                z = L.V.normalise(z.astype(np.float32), target=LAPTOP_LUFS)
                for _ in range(3):                  # measured on the finished file, with its bed
                    z = z * 10 ** ((LAPTOP_LUFS - L.V.lufs(z + bed)) / 20)
                z = (z + bed).astype(np.float32)
                f_rel, m_rel = write(z, f"wav/{lid}.wav")
                r = json.loads(json.dumps(src))
                r.update(id=lid, scene=ln["scene"], speaker="MAS MANALT", text=ln["text"], delivery=ln["delivery"], tag=ln["tag"],
                         shot=ln["shot"], shot_id=ln["shot"], cue=cue_of(ln), on_camera="speaker", mode="speaker", lip_sync=False,
                         mouth=[], file=f_rel, mp3=m_rel, derived_from=src_id, pov="board", device="laptop",
                         room="Neleh's office, day (the audio chip on her laptop)",
                         pick_reason=f"no new read: the delivered {src_id} take (without its inhale), through the board's laptop speaker",
                         takes_tried=0, alt_takes=[], status="derived",
                         processing=[f"source: {src_id} (the same read, unchanged in time; its inhale left out)"] + L.V.describe_chain(chain)
                                    + [f"48 kHz / 24-bit; {LAPTOP_LUFS:g} LUFS integrated; true-peak ceiling -1.5 dBTP; room-tone bed {TONE_DBFS:g} dBFS"])
                r.pop("nobreath", None); r.pop("breaths", None)
                r["breaths"] = []
                q = file_qa(z, LAPTOP_LUFS)
                r["qa"].update({k: q[k] for k in ("lufs_i", "target_lufs", "true_peak_dbtp", "clipped_samples", "digital_black_runs")})
                r["qa"]["f0_note"] = "pitch numbers are the source take's: the 330 Hz high-pass removes the fundamental"
                r["placement"] = placement(lid)
                rows[lid] = r
    # ---------------------------------------------------------------- write
    merged = dict(prev); merged.update(rows)
    out = [merged[i] for i in ORDER if i in merged]
    json.dump(out, open(LINES_JSON, "w"), indent=1, ensure_ascii=False, default=float)
    json.dump(qa_all, open(os.path.join(OUT, "qa", "takes-v5.json"), "w"), indent=1, ensure_ascii=False, default=float)
    log(f"wrote {len(out)} rows; {time.time() - t_start:.0f} s")


def cue_of(ln):
    g = ln["gap"]
    return f"{ln['shot']}, " + ("after the picture's lead-in (see the shot plan)" if g.startswith("—") else f"{g} s after the previous voice")


def placement(lid):
    ln = LINES[lid]
    g = ln["gap"]
    p = {"gap_before_s": None, "follows": "picture"}
    m = re.match(r"^(-?\d*\.?\d+)", g)
    if m:
        p = {"gap_before_s": float(m.group(1)), "follows": "voice"}
        if float(m.group(1)) < 0:
            p["overlap_prev_s"] = -float(m.group(1))
    return p


def build_row(lid, ln, spec, v, best, why, takes, plain, u4, f_rel, m_rel, y, m, toks, dev, target, extra, sp=None):
    spk, vo = speaker_of(ln["speaker"])
    slug = v["_slug"]
    band = S5.BANDS[slug]
    cam = camera_of(ln["speaker"], dev)
    words = [{"w": t["text"], "t0": round(t["t0"], 3), "t1": round(t["t1"], 3), "f0": int(round(t["t0"] * FPS)),
              "f1": int(round(t["t1"] * FPS)), "ph": t.get("ph", "")} for t in toks if t["word"]]
    mouth = L.mouth_cues(y, toks) if cam in ("on", "reflection", "monitor", "blueprint") else []
    an = L.analyse(best["arrays"]["speech"] if sp is None else sp, best["toks"] if sp is None else toks)
    q = file_qa(y, target)
    d = rms_db(y, SR, 0.01)
    q["first_sound_s"] = round(np.where(d > -40)[0][0] * 0.01, 3) if len(np.where(d > -40)[0]) else None
    q.update({"median_f0_hz": an.get("median_f0_hz"), "f0_range_st": an.get("f0_range_st"), "final_move_st": an.get("final_move_st"),
              "asr": best.get("asr"), "cer": best.get("cer"), "word_recall_nonames": best.get("recall"), "logprob": best.get("logprob"),
              "align_median_s": best.get("align"), "utmos_dry": best["utmos"], "utmos_plain_read": round(plain, 3),
              "utmos_vs_plain": round(best["utmos"] - plain, 3), "utmos_v4_same_words": u4,
              "utmos_delivered_as_is": round(mos.utmos(y, SR), 3) if len(y) > SR * 0.3 else None,
              "speech_head_s": m["head_s"], "speech_tail_s": m["tail_s"], "rise_ms": m["rise_ms"], "decay_ms": m["decay_ms"],
              "decay_to_60_s": m["decay_to_60_s"]})
    if best.get("q_lift_st") is not None or lid in S5.Q_LINES:
        q["q_lift_st"] = best.get("q_lift_st") if best.get("q_lift_st") is not None else seg_lift(best["arrays"]["speech"], best["toks"], S5.Q_WORD.get(lid))
    if best.get("stress"): q["stress"] = best["stress"]
    if best.get("echo"): q["echo_vs_a5-27-10"] = best["echo"]
    status = "new"
    if u4 is not None:
        status = "kept-rerecorded"
    proc = L.V.describe_chain(v["chain"])
    if dev == "call":
        proc += ["then the call / monitor filter: " + "; ".join(L.V.describe_chain(R.call_filter())) + f"; {target:g} LUFS"]
    proc += [f"Kokoro speed {best['speed']:.3f}, chosen from intent in the {slug} band {band[0][0]:.2f}-{band[0][1]:.2f} (the plan's {ln['speed']:.2f}); {('one whole read' if not any(o.get('split') for o in best['opened']) else str(1 + sum(1 for o in best['opened'] if o.get('split'))) + ' whole reads, joined in room tone')}; no time-stretch, no carrier, no splice",
             ] + [f"pause after '{o['word']}' (word {o['after_word']}): Kokoro {o['tts_s']:.2f} s -> {o['final_s']:.2f} s (intended {o['target_s']:.2f}; +{o['opened_s']:.2f} s of room tone at the quietest 5 ms, {'/'.join(str(x) for x in o.get('crossfade_ms', [8, 8]))} ms crossfades"
                  + (f"; Kokoro ran the words together here (dip {o['dip_db']} dB): the cut is shaped as a decay and an onset, ear check" if o["joined_speech"] else "") + (", with an inhale" if o["breath"] else "") + ")"
                  if not o.get("split") else
                  f"a separate whole read after '{o['word']}', {o['target_s']:.2f} s of room tone between the reads (Kokoro ran these words together, so no stop could be opened inside one read without cutting the voice; ear check)"
                  for o in best["opened"]] + [
             f"own onset and decay kept: >= {HEAD:.2f} s before the first sound, decay to -60 dB re peak + {TAIL:.2f} s; {HANDLE:.2f} s room-tone handles each side; room-tone bed {TONE_DBFS:g} dBFS under the whole file",
             ("placeholder inhale(s): synthetic band-limited noise with a breath envelope (NOT a licensed breath library; never from a real person)" if best["layout"]["breaths"] else "no inhale"),
             f"48 kHz / 24-bit mono; {target:g} LUFS integrated; true-peak ceiling -1.5 dBTP; DRY (the room's early reflection is a mix send)"]
    pace_int = {"speed": ln["speed"], "speed_band": list(band[0]), "articulation_guide_sps": list(band[1]), "turn_wpm_guide": list(band[2]),
                "intent": ln["delivery"]}
    row = {
        "id": lid, "scene": ln["scene"], "speaker": v["name"], "speaker_slug": S5.VOICE_OF[spk], "text": ln["text"],
        "spoken_as": best["say"], "delivery": ln["delivery"], "tag": ln["tag"], "mode": "call" if dev == "call" else "on-mic",
        "voiced_in_cut": True, "on_camera": cam, "kind": "vo" if vo else "dialogue", "side": "none",
        "pov": "board" if ln["scene"] == "27" else "his", "shot": ln["shot"], "shot_id": ln["shot"], "cue": cue_of(ln),
        "lip_sync": cam in ("on", "reflection", "monitor"), "status": status, "device": dev, "room": room_of(lid, ln["shot"], dev),
        "est_s": float(ln["est"]) if re.match(r"^\d", ln["est"]) else None,
        "file": f_rel, "mp3": m_rel, "duration_s": round(len(y) / SR, 3), "frames_24": int(np.ceil(len(y) / SR * FPS)),
        "voiced_span_s": m["span_s"],
        "pace": {"words": m["words"], "wpm": m["wpm"], "speed": best["speed"], "tsm": 1.0,
                 "intended": pace_int,
                 "measured": {"wpm": m["wpm"], "articulation_sps": m["articulation_sps"], "syllables": m["syllables"],
                              "span_s": m["span_s"], "pauses_s": m["pauses_s"]},
                 "longest_internal_gap_s": m["longest_internal_gap_s"], "audible_in_s": m["audible_in_s"], "audible_out_s": m["audible_out_s"]},
        "placement": placement(lid),
        "take": best["tag"], "takes_tried": len(takes), "pick_reason": why,
        "voice": f"{L.V.voice_id(v['blend'])} (Kokoro-82M stock) · {v['cand']} · speed {best['speed']:.3f}",
        "voiceId": L.V.voice_id(v["blend"]), "model": MODEL, "processing": proc, "mouth": mouth, "words": words, "qa": q,
    }
    # intended pauses the delivered take does not open (Kokoro's junction kept, because opening it cuts the voice)
    want = [(m.group(3), m.start()) for m in MARK.finditer(spec.get("say", ""))] if spec.get("say") else []
    got = len(list(MARK.finditer(best["say"])))
    if spec.get("say") and got < len(want):
        wt = [w for w in re.findall(r"(\S+?)[.,?!:;]*\{s?b?(\d*\.?\d+)\}", spec["say"])]
        gt = [w for w in re.findall(r"(\S+?)[.,?!:;]*\{s?b?(\d*\.?\d+)\}", best["say"])]
        row["pauses_not_opened"] = [{"after": re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", a), "intended_s": float(b)} for a, b in wt if (a, b) not in gt]
    row.update(extra)
    return row


if __name__ == "__main__":
    main(sys.argv[1:])
