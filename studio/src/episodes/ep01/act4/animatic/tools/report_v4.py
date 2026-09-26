"""report_v4.py - the Act Four flow diagnostics, v3 and v4 side by side (flow-and-continuity.md section 5).

Writes show/episodes/ep01/production/act4/report-v4.md. Every number is measured the SAME way on both cuts, from their
locks and their final mixes, so the two columns compare like for like. They are spotting tools, not pass/fail gates
(flow-and-continuity.md: "a number that looks off isn't automatically wrong; watch that spot and decide").

  shots      shots-locked-v3.json / shots-locked-v4.json: count, mean / median, very short shots and runs of them, the
             densest 10 s, visual-register switches (room / screen / blueprint / card), runtime by sequence
  music      the music bus rebuilt from each mix's EDL BEFORE the duck (v3: the 33 pieces cut from masters, with the
             dry windows and D6 applied as mix_v3 did; v4: the five to-picture renders at their level points). On =
             the louder channel's 50 ms RMS over -55 dBFS; a gap under 0.2 s is not a stop (mix_v4's definition).
  holes      the final mix: 50 ms windows under -42 dBFS for 0.3 s or more
  jumps      the final mix: over 15 dB between adjacent 50 ms windows
             Both are measured two ways, and both are reported: (a) the MONO DOWNMIX ((L + R) / 2) with no floor on the
             jumps, which reproduces the lead's v3 numbers exactly (78 holes, 70.5 s, 107 jumps); (b) the LOUDER CHANNEL
             with jumps only where a window is over -60 dBFS, which is mix_v4.py's own measure. Each jump is given a
             cause by time alone, the same way on both cuts: D6, a voiced line (inside it or within 2 f of its edges),
             an SFX onset (-2..+4 f), a music start or stop (+-3 f), else "other".
  dialogue   the voiced lines on the lock clock (posts are read, not heard, so they are left out of the gaps)
  encode     (when the mp4 exists) the v4 animatic's streams, the audio against the mix (cross-correlation lag), and
             the picture's cut frames found in the ENCODED video against the lock's cuts

Nobody listened to or watched anything to make these numbers. Run:
  audio/.venv-mix/bin/python studio/src/episodes/ep01/act4/animatic/tools/report_v4.py [--transcripts <dir>]
With --transcripts, also writes <dir>/transcript-v3.txt and <dir>/transcript-v4.txt (every voiced line and post with
its start time and speaker, and every on-screen text), the newcomer read's companion to the frames.
v4.1 (the finishing pass): the v4 transcript names a speaker only once the picture has (a plate, a card, a call tile);
before that it says what the viewer can see ("A WOMAN'S VOICE OVER THE BLUEPRINT"). It keeps every on-screen text,
short ones included (VOTES: 0, GUEST, the ALYI tag, ALYI (REPORTED)), and the quotes that are text, not lines (the
blog post, the letter). The v4 column is lock v4.2 (the closing pass); v4.0's and v4.1's numbers are kept in edit-plan-v4.md
§10.5 and §11, and in production/act4/v4-for-review.md.
"""
import json
import os
import re
import statistics
import subprocess
import sys
from collections import Counter, OrderedDict

import numpy as np
import pyloudnorm as pyln
import soundfile as sf

REPO = "/home/jgon/project/art/mrmas"
P = lambda *a: os.path.join(REPO, *a)  # noqa: E731
SR, FPS = 48000, 24
SPF = SR // FPS
W50 = SR // 20
EP_IN = 12 * 1440 + 31 * 24  # 12:31:00 (mm:ss:ff)
PROD = P("show/episodes/ep01/production/act4")
OUT = P("out/ep01/act4/animatic")
MP4 = os.path.join(OUT, "act4-animatic-v4.mp4")
FFDIR = P("studio/node_modules/@remotion/compositor-linux-x64-gnu")
FFENV = dict(os.environ, LD_LIBRARY_PATH=FFDIR)


def tc(f):
    e = int(round(EP_IN + f))
    return f"{e // 1440}:{(e // 24) % 60:02d}:{e % 24:02d}"


def at(f):
    s = f / FPS
    return f"{int(s // 60)}:{s % 60:05.2f}"


def todb(x):
    return 20 * np.log10(np.maximum(x, 1e-12))


def lev(x, w=W50):
    y = x if x.ndim == 2 else x[:, None]
    n = len(y) // w
    p = (y[: n * w].reshape(n, w, y.shape[1]) ** 2).mean(axis=1)
    return todb(np.sqrt(p.max(axis=1)))


def lev_mono(x, w=W50):
    m = x.mean(axis=1) if x.ndim == 2 else x
    n = len(m) // w
    return todb(np.sqrt((m[: n * w].reshape(n, w) ** 2).mean(axis=1)))


def runs(mask):
    out, st = [], None
    for i, v in enumerate(list(mask) + [False]):
        if v and st is None:
            st = i
        if not v and st is not None:
            out.append((st, i))
            st = None
    return out


_cache = {}


def load(path):
    if path not in _cache:
        x, sr = sf.read(path, dtype="float64", always_2d=True)
        assert sr == SR, (path, sr)
        if x.shape[1] == 1:
            x = np.repeat(x, 2, axis=1)
        _cache[path] = x[:, :2]
    return _cache[path]


def fade(x, fin, fout):
    x = x.copy()
    n = len(x)
    fin, fout = min(fin, n), min(fout, n)
    if fin:
        x[:fin] *= np.linspace(0, 1, fin)[:, None]
    if fout:
        x[n - fout:] *= np.linspace(1, 0, fout)[:, None]
    return x


def add(bus, x, s0):
    s0 = int(s0)
    if s0 < 0:
        x, s0 = x[-s0:], 0
    n = min(len(x), len(bus) - s0)
    if n > 0:
        bus[s0:s0 + n] += x[:n]


# ================================================================================================ the two cuts
class Cut:
    pass


def load_cut(v):
    c = Cut()
    c.v = v
    c.L = json.load(open(os.path.join(PROD, f"shots-locked-{v}.json")))
    c.MX = json.load(open(os.path.join(OUT, f"act4-mix-{v}.cues.json")))
    c.total = c.L["summary"]["act_frames"]
    c.N = c.total * SPF
    c.shots = c.L["shots"]
    c.starts = [r["start_frame"] for r in c.shots]
    c.lens = [r["frames"] / FPS for r in c.shots]
    c.mix, _ = sf.read(os.path.join(OUT, f"act4-mix-{v}.wav"), dtype="float64", always_2d=True)
    return c


V3, V4 = load_cut("v3"), load_cut("v4")


def shot_at(c, f):
    i = max(0, np.searchsorted(c.starts, f, side="right") - 1)
    return c.shots[i]["id"]


# ------------------------------------------------------------------ the music bus, rebuilt from each EDL (pre-duck)
def music_bus_v3(c):
    bus = np.zeros((c.N, 2))
    for m in c.MX["music"]:
        x = load(P(m["cue_file"]))
        s0 = int(round(m["src"] * SR))
        n = (m["b"] - m["a"]) * SPF
        piece = x[s0:s0 + n]
        if len(piece) < n:
            piece = np.vstack([piece, np.zeros((n - len(piece), 2))])
        piece = fade(piece * 10 ** (m["g"] / 20), max(144, m["fi"] * SPF), max(144, m["fo"] * SPF))
        add(bus, piece, m["a"] * SPF)
    g = np.ones(c.N)
    ramp = 6 * SPF
    for d in c.MX["dry"]:
        s0, s1 = d["a"] * SPF, min(c.N, d["b"] * SPF)
        g[s0:s1] = 0
        r0 = max(0, s0 - ramp)
        g[r0:s0] = np.minimum(g[r0:s0], np.linspace(1, 0, s0 - r0))
        r1 = min(c.N, s1 + ramp)
        g[s1:r1] = np.minimum(g[s1:r1], np.linspace(0, 1, r1 - s1))
    d6 = c.L["summary"]["D6"]
    g[d6["start"] * SPF:d6["end"] * SPF] = 0
    return bus * g[:, None]


def music_bus_v4(c):
    bus = np.zeros((c.N, 2))
    for m in c.MX["music"]:
        x = load(P(m["file"]))
        s0 = m["act_in"] * SPF
        pts = m["level_points_db"]
        fr = np.arange(len(x)) / SPF + m["act_in"]
        g = 10 ** (np.interp(fr, [p[0] for p in pts], [p[1] for p in pts]) / 20)
        add(bus, x * g[:, None], s0)
    return bus


V3.mus = music_bus_v3(V3)
V4.mus = music_bus_v4(V4)


# ================================================================================================ measurements
def shot_stats(c):
    L = c.lens
    s = OrderedDict()
    s["shots"] = len(L)
    s["mean"] = statistics.mean(L)
    s["median"] = statistics.median(L)
    s["min"] = min(L)
    s["max"] = max(L)
    for lim in (1.0, 1.5, 1.6, 2.0):
        s[f"under_{lim}"] = sum(1 for x in L if x < lim)

    def short_runs(lim):
        out, cur = [], []
        for r, x in zip(c.shots, L):
            if x < lim:
                cur.append(r)
            else:
                if len(cur) >= 3:
                    out.append(cur)
                cur = []
        if len(cur) >= 3:
            out.append(cur)
        return out
    s["runs_1.6"] = short_runs(1.6)
    s["runs_2.0"] = short_runs(2.0)
    cuts = np.array(c.starts[1:])
    best, best_at = 0, 0
    for a in range(0, c.total - 240 + 1, 6):
        n = int(((cuts >= a) & (cuts < a + 240)).sum())
        if n > best:
            best, best_at = n, a
    s["max_cuts_10s"], s["max_cuts_10s_at"] = best, best_at
    hist = OrderedDict()
    edges = [(0, 1), (1, 1.5), (1.5, 2), (2, 2.5), (2.5, 3), (3, 4), (4, 5), (5, 6), (6, 99)]
    for a, b in edges:
        hist[f"{a}-{b} s" if b < 99 else f"{a} s +"] = sum(1 for x in L if a <= x < b)
    s["hist"] = hist

    def reg(r):
        k = r["size_class"]
        return "blueprint" if k in ("GS", "GM", "GD") else "card" if k == "GFX" else "screen" if k in ("SW", "SC") else "room"
    regs = [reg(r) for r in c.shots]
    s["register_switches"] = sum(1 for a, b in zip(regs, regs[1:]) if a != b)
    s["register_runs"] = len(runs_of(regs))
    s["register_share"] = Counter()
    for r, x in zip(regs, L):
        s["register_share"][r] += x
    return s


def runs_of(seq):
    out = []
    for x in seq:
        if out and out[-1][0] == x:
            out[-1][1] += 1
        else:
            out.append([x, 1])
    return out


def music_stats(c):
    Lm = lev(c.mus)
    on = Lm > -55.0
    merged = []
    for a, b in runs(on):
        if merged and a - merged[-1][1] < 4:
            merged[-1] = (merged[-1][0], b)
        else:
            merged.append((a, b))
    fw = lambda i: i * W50 / SPF  # noqa: E731
    rl = [dict(a=fw(a), b=fw(b), s=(b - a) / 20) for a, b in merged]
    stops = [dict(a=fw(b0), b=fw(a1), s=(a1 - b0) / 20) for (a0, b0), (a1, b1) in zip(merged, merged[1:])]
    s = OrderedDict()
    s["runs"] = rl
    s["stops"] = stops
    s["audible_pct"] = 100 * on.mean()
    s["Lm"] = Lm
    # the EDL's pieces and the hard splices inside it (a piece that starts where the last one ended, from another
    # place in its cue, with no crossfade)
    if c.v == "v3":
        M = sorted(c.MX["music"], key=lambda m: m["a"])
        s["pieces"] = [dict(a=m["a"], b=m["b"], s=(m["b"] - m["a"]) / FPS, label=m["label"]) for m in M]
        spl = 0
        for m0, m1 in zip(M, M[1:]):
            if m1["a"] == m0["b"] and (m1["cue"] != m0["cue"] or abs(m1["src"] - (m0["src"] + (m0["b"] - m0["a"]) / FPS)) > 0.01):
                spl += 1
        s["splices"] = spl
        s["handoffs"] = 0
    else:
        M = sorted(c.MX["music"], key=lambda m: m["act_in"])
        s["pieces"] = [dict(a=m["act_in"], b=m["act_out"], s=(m["act_out"] - m["act_in"]) / FPS, label=m["label"]) for m in M]
        s["splices"] = 0
        s["handoffs"] = sum(1 for m0, m1 in zip(M, M[1:]) if m1["act_in"] <= m0["act_out"])
    # steps on the music bus itself (over 10 dB between 50 ms windows, one side over -60): the audible "cut-offs"
    d = np.diff(Lm)
    loud = np.maximum(Lm[1:], Lm[:-1]) > -60
    s["bus_steps_10"] = int(((np.abs(d) > 10) & loud).sum())
    s["bus_drops_20"] = int(((d < -20) & loud).sum())
    return s


def hole_stats(c, mono):
    L = lev_mono(c.mix) if mono else lev(c.mix)
    fw = lambda i: i * W50 / SPF  # noqa: E731
    hs = [dict(a=fw(a), s=(b - a) / 20, lv=float(np.median(L[a:b]))) for a, b in runs(L < -42.0) if b - a >= 6]
    d = np.diff(L)
    big = (np.abs(d) > 15) if mono else (np.abs(d) > 15) & (np.maximum(L[1:], L[:-1]) >= -60)
    idx = np.nonzero(big)[0] + 1
    js = [dict(f=fw(i), d=float(L[i] - L[i - 1])) for i in idx]
    return dict(L=L, holes=hs, jumps=js)


def d6_span(c):
    if c.v == "v3":
        d = c.L["summary"]["D6"]
        return d["start"], d["end"]
    d = c.L["summary"]["D6_frames"]
    return d[0], d[-1]


def jump_cause(c, f, mruns):
    a, b = d6_span(c)
    if a - 2 <= f <= b + 3:
        return "D6's edges (designed)"
    for r in c.shots:
        for l in r["lines"]:
            if l["kind"] != "post" and l["abs_in"] - 2 <= f <= l["abs_out"] + 2:
                return "speech (inside a voiced line or at its edges)"
    for x in c.MX["sfx"]:
        if -2 <= f - x["f"] <= 4:
            return "a sound effect's onset"
    for r in mruns:
        if abs(f - r["a"]) <= 3 or abs(f - r["b"]) <= 3:
            return "music starting or stopping"
    return "other (none of the above)"


def voiced(c):
    ls = [l for r in c.shots for l in r["lines"] if l["kind"] != "post"]
    return sorted(ls, key=lambda l: l["abs_in"])


def dialogue_stats(c, Lm):
    V = voiced(c)
    gaps = []
    for a, b in zip(V, V[1:]):
        g = (b["abs_in"] - a["abs_out"]) / FPS
        chained = b.get("chained_to") == a["id"]
        w0, w1 = int(a["abs_out"] * SPF / W50), int(b["abs_in"] * SPF / W50)
        mon = float((Lm[w0:w1] > -55).mean() * 100) if w1 > w0 else 100.0
        gaps.append(dict(a=a, b=b, g=g, chained=chained, music_on=mon))
    rep = [x["g"] for x in gaps if x["chained"]]
    edges = [("overlap", -99, 0), ("0-0.3 s", 0, 0.3), ("0.3-0.6 s", 0.3, 0.6), ("0.6-1.2 s", 0.6, 1.2), ("1.2-3 s", 1.2, 3),
             ("3-6 s", 3, 6), ("6-12 s", 6, 12), ("12 s +", 12, 999)]
    hist = OrderedDict((k, sum(1 for x in gaps if lo <= x["g"] < hi)) for k, lo, hi in edges)
    near = [x["g"] for x in gaps if x["g"] < 2.0]
    return dict(lines=len(V), gaps=gaps, reply=rep, hist=hist, near=near,
                long=[x for x in gaps if x["g"] >= 6.0])


SH3, SH4 = shot_stats(V3), shot_stats(V4)
MU3, MU4 = music_stats(V3), music_stats(V4)
HO3, HO4 = hole_stats(V3, True), hole_stats(V4, True)        # the lead's measure (mono downmix, no floor)
HL3, HL4 = hole_stats(V3, False), hole_stats(V4, False)       # mix_v4's measure (louder channel, -60 floor)
JC = {}
for key, c, H, mu in (("m3", V3, HO3, MU3), ("m4", V4, HO4, MU4), ("l3", V3, HL3, MU3), ("l4", V4, HL4, MU4)):
    JC[key] = Counter(jump_cause(c, j["f"], mu["runs"]) for j in H["jumps"])
DG3, DG4 = dialogue_stats(V3, MU3["Lm"]), dialogue_stats(V4, MU4["Lm"])
meter = pyln.Meter(SR)
LU3, LU4 = meter.integrated_loudness(V3.mix), meter.integrated_loudness(V4.mix)
PK3, PK4 = float(todb(np.abs(V3.mix).max())), float(todb(np.abs(V4.mix).max()))


# ------------------------------------------------------------------ v4's designed stops and the sound pass's jump causes
def v4_stop_cause(a, b):
    best = None
    for d in V4.MX.get("designed_stops_and_rests", []):
        if a < d["b"] + 6 and b > d["a"] - 6:
            best = d["label"]
            break
    if not best:
        for s in V4.MX["measurements"]["music"].get("stops", []):
            if abs(s["start_frame"] - a) <= 3:
                best = s["cause"]
                break
    return best or "not in the sound pass's list: watch it"


def jump_bucket(cause):
    c = (cause or "").lower()
    if "speech inside" in c:
        return "a word against the room floor inside a line"
    if "dialogue onset" in c or "dialogue end" in c:
        return "a line's start or end"
    if "d6" in c:
        return "D6's edges (designed)"
    if c.startswith("sfx"):
        return "a sound effect"
    if c.startswith("music"):
        return "a music entry or hit"
    return "other / unexplained"


V4_JUMPS = {round(j["frame"], 1): j for j in V4.MX["measurements"]["jumps_over_15db"]["list"]}
jb = Counter()
for j in HL4["jumps"]:
    k = min(V4_JUMPS, key=lambda f: abs(f - j["f"])) if V4_JUMPS else None
    cause = V4_JUMPS[k]["cause"] if k is not None and abs(k - j["f"]) < 1.5 else None
    jb[jump_bucket(cause)] += 1


# ------------------------------------------------------------------ runtime by sequence (v4's sequences; v3's same stretch)
def parse_v3_span(s):
    m = re.search(r"(\d+):(\d+(?:\.\d+)?)-(\d+):(\d+(?:\.\d+)?)\s*\((\d+) shots\)", s or "")
    if not m:
        return None
    a = int(m.group(1)) * 60 + float(m.group(2))
    b = int(m.group(3)) * 60 + float(m.group(4))
    return a, b, int(m.group(5))


SEQROWS = []
for q in V4.L["sequences"]:
    sh4 = [r for r in V4.shots if r["seq"] == q["id"]]
    span = parse_v3_span(q.get("v3", ""))
    row = OrderedDict(id=q["id"], title=q["title"], chapter=q["chapter"], v4_s=q["frames"] / FPS, v4_shots=len(sh4),
                      v4_mean=statistics.mean(r["frames"] / FPS for r in sh4))
    if span:
        a, b, n = span
        sh3 = [r for r in V3.shots if a * FPS - 1 <= r["start_frame"] < b * FPS - 1]
        row.update(v3_s=b - a, v3_shots=n, v3_shots_measured=len(sh3), v3_mean=(b - a) / n)
    SEQROWS.append(row)


# ------------------------------------------------------------------ the encoded v4 animatic
def ffprobe(path):
    out = subprocess.run([os.path.join(FFDIR, "ffprobe"), "-v", "error", "-show_entries",
                          "stream=codec_type,codec_name,width,height,r_frame_rate,nb_frames,duration,sample_rate,channels",
                          "-of", "json", path], env=FFENV, capture_output=True, text=True, check=True)
    return json.loads(out.stdout)["streams"]


def decode_audio(path):
    # the bundled ffmpeg muxes only wav / image2pipe / null: a 16-bit wav to the pipe, the header skipped by hand
    out = subprocess.run([os.path.join(FFDIR, "ffmpeg"), "-v", "error", "-i", path, "-map", "0:a:0", "-ac", "1", "-ar", str(SR),
                          "-c:a", "pcm_s16le", "-f", "wav", "pipe:1"], env=FFENV, capture_output=True, check=True)
    b = out.stdout
    k = b.find(b"data") + 8
    return np.frombuffer(b[k: k + ((len(b) - k) // 2) * 2], dtype="<i2").astype(np.float64) / 32768.0


def decode_small_gray(path, w=96, h=54, crop=None):
    vf = (f"crop={crop}," if crop else "") + f"scale={w}:{h}:flags=area,format=gray"
    out = subprocess.run([os.path.join(FFDIR, "ffmpeg"), "-v", "error", "-i", path, "-map", "0:v:0", "-vf", vf,
                          "-f", "image2pipe", "-c:v", "rawvideo", "-pix_fmt", "gray", "pipe:1"], env=FFENV, capture_output=True, check=True)
    a = np.frombuffer(out.stdout, dtype=np.uint8)
    return a.reshape(-1, h, w).astype(np.float64)


# what the render pass found when it pulled the encoded frames either side of a cut the detector flagged
CUT_NOTES = {
    "S1.06": "Designed, not a sync fault: S1.05 ends on the blueprint's tear, which has fully revealed S1.06's frame (the hand, the JOIN button) a frame "
             "before the cut; the cut adds only the side badge.",
    "S2.02": "Designed: S2.01 ends on the brush's last step and S2.02 holds the same desk, so the cut is the Orb's light arriving, not a change of frame.",
    "S2.04": "Designed: S2.03's front sweeps back onto the same marks insert S2.04 holds.",
    "S5.08": "Designed: the check slides down into frame over S5.08's first 8 frames in 4 held steps, so a later step changes more of the frame than the cut itself.",
}

ENC = None
if os.path.exists(MP4):
    ENC = OrderedDict()
    st = ffprobe(MP4)
    ENC["streams"] = st
    vid = next(s for s in st if s["codec_type"] == "video")
    ENC["video"] = vid
    ENC["audio"] = next((s for s in st if s["codec_type"] == "audio"), None)
    # audio vs the mix: the lag of the best match over +-0.25 s, on 4 excerpts
    try:
        dec = decode_audio(MP4)
        ref = V4.mix.mean(axis=1)
        lags = []
        for t0 in (20.0, 90.0, 160.0, 240.0):
            a0 = int(t0 * SR)
            seg = ref[a0:a0 + SR * 4]
            lo = SR // 4
            # FFT cross-correlation (exact lag in samples; positive = the mp4's audio is late)
            n = len(seg)
            win = dec[a0 - lo:a0 + n + lo]
            if len(win) == n + 2 * lo:
                cc = np.fft.irfft(np.fft.rfft(win, 2 * len(win)) * np.conj(np.fft.rfft(seg, 2 * len(win))))
                cc = cc[: 2 * lo + 1]
                bl = int(np.argmax(cc)) - lo
                lags.append(bl)
        ENC["audio_lag_samples"] = lags
        ENC["audio_seconds"] = len(dec) / SR
        # v4.1: measured onsets on the decoded AAC (replaces v4.0's hand-pulled note): 0.2 s before vs after the lock's in-frame
        def _rms_db(x):
            return float(20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-12))
        ons = []
        L4 = {l["id"]: l for r in V4.shots for l in r["lines"]}
        for lid in ("a4-30-07", "a4-30-12"):
            if lid in L4:
                i0 = L4[lid]["abs_in"] * SPF
                ons.append((lid, L4[lid]["text"], _rms_db(dec[i0 - SR // 5:i0]), _rms_db(dec[i0:i0 + SR // 5])))
        ENC["onsets"] = ons
        d6 = V4.L["summary"].get("D6_frames")
        if d6:
            a6, b6 = d6[0] * SPF + SR // 4, d6[1] * SPF - SR // 20
            ENC["d6_decoded_db"] = _rms_db(dec[a6:b6])
        # AAC pre-roll trims aside, the decoded audio should line up with the mix
    except Exception as e:  # noqa: BLE001
        ENC["audio_error"] = str(e)
    # the picture's cuts in the ENCODED file: the frame-to-frame change in the picture area (the show frame at 3x,
    # the top-left 1440 x 810 of the 1920 x 1080 frame) peaks on the lock's cut frames
    try:
        W, H = int(vid["width"]), int(vid["height"])
        pw, ph = (1440, 810) if (W, H) == (1920, 1080) else (960, 540) if (W, H) == (1280, 720) else (W, H)
        g = decode_small_gray(MP4, crop=f"{pw}:{ph}:0:0")
        ENC["frames_decoded"] = len(g)
        diff = np.abs(np.diff(g, axis=0)).mean(axis=(1, 2))  # diff[i] = change from frame i to i+1
        on_cut, off_cut, still_cut = 0, [], 0
        for r in V4.shots[1:]:
            f = r["start_frame"]
            lo_, hi_ = max(0, f - 4), min(len(diff), f + 3)
            k = lo_ + int(np.argmax(diff[lo_:hi_])) + 1  # the first frame after the biggest change
            if diff[f - 1] < 1.0:
                still_cut += 1  # a cut between near-identical frames (e.g. a match cut or a hard black): not testable
            elif k == f:
                on_cut += 1
            else:
                off_cut.append((r["id"], f, k - f, round(float(diff[f - 1]), 1), round(float(diff[k - 1]), 1), r.get("move", "")))
        ENC["cuts_on_frame"] = on_cut
        ENC["cuts_elsewhere"] = off_cut
        ENC["cuts_untestable"] = still_cut
        ENC["cuts_total"] = len(V4.shots) - 1
    except Exception as e:  # noqa: BLE001
        ENC["picture_error"] = str(e)


# ================================================================================================ write the report
def f2(x):
    return f"{x:.2f}"


def esc_md(t):
    return str(t).replace("|", "/").replace("\n", " ")


lines = []
w = lines.append
S4 = V4.L["summary"]
w("# Ep1 · Act Four · Flow report, v3 against v4 (lock v4.2)")
w("")
w("Generated by `studio/src/episodes/ep01/act4/animatic/tools/report_v4.py` from the two locks (`shots-locked-v3.json`, "
  "`shots-locked-v4.json`) and the two final mixes (`act4-mix-v3.wav`, `act4-mix-v4.wav`, with their `.cues.json` EDLs). "
  "Re-run it after any change; don't hand-edit this file.")
w("")
w("**What this is.** The measurements from [flow-and-continuity §5](../../../../bible/flow-and-continuity.md#5-coherence-is-checked-not-assumed), "
  "taken the same way on both cuts. They show where to go and watch; they aren't pass/fail.")
w("")
w("**What it isn't.** Nothing here was watched in real time or listened to. None of it says v4 flows, reads or sounds right. "
  "That takes the human watch in §8, plus the newcomer and insider reads (§5a).")
w("")
w("**The file under review:** `out/ep01/act4/animatic/act4-animatic-v4.mp4`.")
if ENC and "video" in ENC:
    v = ENC["video"]
    a = ENC["audio"] or {}
    w(f"- {v['width']} × {v['height']} H.264 at {v['r_frame_rate'].split('/')[0]} fps, {v.get('nb_frames')} frames, {float(v['duration']):.3f} s.")
    w(f"- AAC {a.get('sample_rate')} Hz, {a.get('channels')} channels: the v4 mix, muxed.")
    w("- The picture is the 480 × 270 show frame at 3×. The editor's margin (now with the v4 sound pass's cue and SFX labels) and the transcript band are scaled to 1080p.")
w("")
w("## 1. Side by side")
w("")
w("| Measure | v3 | v4 (v4.2) | Where to look |")
w("|---|---|---|---|")
w(f"| Runtime | {at(V3.total)} ({V3.total} f) | {at(V4.total)} ({V4.total} f) | §7 by sequence |")
w(f"| Shots | {SH3['shots']} | {SH4['shots']} | |")
w(f"| Mean / median shot | {f2(SH3['mean'])} / {f2(SH3['median'])} s | {f2(SH4['mean'])} / {f2(SH4['median'])} s | |")
w(f"| Shortest / longest shot | {f2(SH3['min'])} / {f2(SH3['max'])} s | {f2(SH4['min'])} / {f2(SH4['max'])} s | |")
w(f"| Shots under 1 s / 1.5 s / 2 s | {SH3['under_1.0']} / {SH3['under_1.5']} / {SH3['under_2.0']} | {SH4['under_1.0']} / {SH4['under_1.5']} / {SH4['under_2.0']} | §2 |")
w(f"| Runs of 3+ shots under 1.6 s | {len(SH3['runs_1.6'])} | {len(SH4['runs_1.6'])} | §2 |")
w(f"| Runs of 3+ shots under 2 s | {len(SH3['runs_2.0'])} | {len(SH4['runs_2.0'])} | §2 |")
w(f"| Most cuts in any 10 s | {SH3['max_cuts_10s']} (at {tc(SH3['max_cuts_10s_at'])}) | {SH4['max_cuts_10s']} (at {tc(SH4['max_cuts_10s_at'])}) | |")
w(f"| Visual-register switches (room / screen / blueprint / card) | {SH3['register_switches']} across {SH3['shots'] - 1} cuts | {SH4['register_switches']} across {SH4['shots'] - 1} cuts | §2 |")
w(f"| Music: pieces in the EDL | {len(MU3['pieces'])} cut from masters | {len(MU4['pieces'])} continuous to-picture renders | §3 |")
w(f"| Music: hard splices (a jump to another place in a cue, no crossfade) | {MU3['splices']} | {MU4['splices']} (cue hand-offs: {MU4['handoffs']} overlapping) | §3 |")
w(f"| Music: audible runs (starts) | {len(MU3['runs'])} | {len(MU4['runs'])} | §3 |")
w(f"| Music: stops of 0.2 s or more | {len(MU3['stops'])} | {len(MU4['stops'])} | §3 |")
sr3 = min(MU3["runs"], key=lambda r: r["s"])
sr4 = min(MU4["runs"], key=lambda r: r["s"])
sp3 = min(MU3["pieces"], key=lambda r: r["s"])
sp4 = min(MU4["pieces"], key=lambda r: r["s"])
w(f"| Music: shortest EDL piece | {f2(sp3['s'])} s ({tc(sp3['a'])}) | {f2(sp4['s'])} s ({tc(sp4['a'])}) | |")
w(f"| Music: shortest audible run | {f2(sr3['s'])} s ({tc(sr3['a'])}) | {f2(sr4['s'])} s ({tc(sr4['a'])}) | §3 |")
w(f"| Music: runs under 2.5 s | {sum(1 for r in MU3['runs'] if r['s'] < 2.5)} | {sum(1 for r in MU4['runs'] if r['s'] < 2.5)} | |")
w(f"| Music: median / longest run | {f2(statistics.median(r['s'] for r in MU3['runs']))} / {f2(max(r['s'] for r in MU3['runs']))} s | "
  f"{f2(statistics.median(r['s'] for r in MU4['runs']))} / {f2(max(r['s'] for r in MU4['runs']))} s | |")
w(f"| Music audible (pre-duck bus over −55 dBFS) | {MU3['audible_pct']:.1f}% | {MU4['audible_pct']:.1f}% | |")
w(f"| Music-bus steps over 10 dB (drops over 20 dB) | {MU3['bus_steps_10']} ({MU3['bus_drops_20']}) | {MU4['bus_steps_10']} ({MU4['bus_drops_20']}) | §3 |")
th3 = sum(h["s"] for h in HO3["holes"])
th4 = sum(h["s"] for h in HO4["holes"])
tl3 = sum(h["s"] for h in HL3["holes"])
tl4 = sum(h["s"] for h in HL4["holes"])
w(f"| Holes (under −42 dBFS for 0.3 s+), mono downmix (the lead's measure) | {len(HO3['holes'])}, {th3:.1f} s ({100 * th3 / (V3.total / FPS):.0f}% of the act) | "
  f"{len(HO4['holes'])}, {th4:.2f} s ({100 * th4 / (V4.total / FPS):.1f}%) | §4 |")
w(f"| Holes, louder channel (mix_v4's measure) | {len(HL3['holes'])}, {tl3:.1f} s ({100 * tl3 / (V3.total / FPS):.0f}%) | "
  f"{len(HL4['holes'])}, {tl4:.2f} s ({100 * tl4 / (V4.total / FPS):.1f}%) | §4 |")
w(f"| Abrupt level jumps (over 15 dB between 50 ms windows), mono downmix | {len(HO3['jumps'])} | {len(HO4['jumps'])} | §5 |")
w(f"| … not speech, D6, an SFX onset or a music start or stop | {JC['m3']['other (none of the above)']} | {JC['m4']['other (none of the above)']} | §5 |")
w(f"| Abrupt level jumps, louder channel, over −60 dBFS (mix_v4's measure) | {len(HL3['jumps'])} | {len(HL4['jumps'])} | §5 |")
w(f"| Voiced lines | {DG3['lines']} | {DG4['lines']} | |")
w(f"| Reply gaps (a line answering the one before): median, range | {f2(statistics.median(DG3['reply']))} s, {f2(min(DG3['reply']))} to {f2(max(DG3['reply']))} s ({len(DG3['reply'])}) | "
  f"{f2(statistics.median(DG4['reply']))} s, {f2(min(DG4['reply']))} to {f2(max(DG4['reply']))} s ({len(DG4['reply'])}) | §6 |")
w(f"| Gaps between consecutive lines under 2 s: median | {f2(statistics.median(DG3['near']))} s ({len(DG3['near'])}) | {f2(statistics.median(DG4['near']))} s ({len(DG4['near'])}) | §6 |")
w(f"| Wordless stretches of 6 s or more | {len(DG3['long'])}, longest {f2(max(x['g'] for x in DG3['long']))} s | {len(DG4['long'])}, longest {f2(max(x['g'] for x in DG4['long']))} s | §6 |")
w(f"| … of those, with music under less than half of it | {sum(1 for x in DG3['long'] if x['music_on'] < 50)} | {sum(1 for x in DG4['long'] if x['music_on'] < 50)} | §6 |")
w(f"| Integrated loudness / sample peak | {LU3:.1f} LUFS / {PK3:.1f} dBFS | {LU4:.1f} LUFS / {PK4:.1f} dBFS | |")
w("")
w("**Cross-checks.**")
w(f"- **v3, against the lead's measurements** (78 holes totalling 70 s, 107 jumps, 33 fragments). On the mono downmix with no floor on the jumps, this script gets "
  f"{len(HO3['holes'])} holes, {th3:.1f} s, {len(HO3['jumps'])} jumps and {len(MU3['pieces'])} pieces. That's the lead's definition, so v4 is shown on it too.")
w(f"- **v4, against the sound pass's own measurements** (`act4-mix-v4.cues.json`: "
  f"{V4.MX['measurements']['holes_0_3s_under_42dbfs']['count']} hole, {V4.MX['measurements']['jumps_over_15db']['count']} jumps, "
  f"{V4.MX['measurements']['music']['runs']} music runs). On the louder channel with a −60 dBFS floor, this script gets {len(HL4['holes'])}, {len(HL4['jumps'])} and {len(MU4['runs'])}.")
w("- **Why the two measures differ.** The mono downmix reads decorrelated stereo beds a few dB lower than either channel. "
  "It also counts jumps down into and out of true silence. So it finds more holes and more jumps on both cuts.")
w("- The music runs here are measured on the bus before the duck and the thinning, so they can differ from the sound pass's post-duck count by a run or two.")
w("")
w("## 2. Shot lengths")
w("")
w("| Length | v3 | v4 |")
w("|---|---|---|")
for k in SH3["hist"]:
    w(f"| {k} | {SH3['hist'][k]} | {SH4['hist'][k]} |")
w("")
w("**Runs of 3+ shots under 2 s.** Outside a montage, these are the usual sign of over-cutting (§2).")
w("")
for name, S, c in (("v3", SH3, V3), ("v4", SH4, V4)):
    rr = S["runs_2.0"]
    if not rr:
        w(f"- **{name}:** none.")
        continue
    w(f"- **{name}:** {len(rr)} run{'s' if len(rr) != 1 else ''}.")
    for run in rr[:12]:
        w(f"  - {tc(run[0]['start_frame'])}: " + ", ".join(f"{r['id']} ({r['frames'] / FPS:.2f} s)" for r in run))
    if len(rr) > 12:
        w(f"  - … and {len(rr) - 12} more.")
w("")
w("The only v4 run is the avalanche montage (S6), which the guide expects to be fast: 1–2.5 s shots under continuous music, one idea each. "
  "It still needs a real-time watch to confirm it plays as a montage rather than a strobe.")
w("")
rs3, rs4 = SH3["register_share"], SH4["register_share"]
w("**Visual register** (share of screen time; a switch is a cut from one register to another):")
w("")
w("| Register | v3 | v4 |")
w("|---|---|---|")
for k in ("room", "screen", "blueprint", "card"):
    w(f"| {k} | {100 * rs3[k] / (V3.total / FPS):.0f}% | {100 * rs4[k] / (V4.total / FPS):.0f}% |")
w(f"| switches per cut | {SH3['register_switches'] / (SH3['shots'] - 1):.2f} | {SH4['register_switches'] / (SH4['shots'] - 1):.2f} |")
w("")
w("The register comes from each shot's size class: GS, GM and GD are blueprint; GFX is a card; SW and SC are screens; everything else is the room. "
  "A post on a phone counts as a screen, which is a coarse call.")
w("")
w("## 3. Music: starts, stops and fragments")
w("")
w("**v4: every stop of 0.2 s or more**, on the bus rebuilt from the five renders, with the cause the sound pass gave it:")
w("")
w("| TC | Shot | Off for | Cause |")
w("|---|---|---|---|")
for s in MU4["stops"]:
    w(f"| {tc(s['a'])} | {shot_at(V4, s['a'])} | {f2(s['s'])} s | {v4_stop_cause(s['a'], s['b'])} |")
w("")
w("**v4: the audible runs:**")
w("")
w("| In | Out | Length | Shots |")
w("|---|---|---|---|")
for r in MU4["runs"]:
    w(f"| {tc(r['a'])} | {tc(r['b'])} | {f2(r['s'])} s | {shot_at(V4, r['a'])} → {shot_at(V4, max(r['a'], r['b'] - 1))} |")
w("")
short3 = sorted(MU3["pieces"], key=lambda r: r["s"])[:8]
w(f"**v3, for comparison:** {len(MU3['pieces'])} pieces and {MU3['splices']} hard splices. The shortest pieces:")
w("")
for p in short3:
    w(f"- {tc(p['a'])}: {f2(p['s'])} s, {p['label']}")
w("")
w(f"v3's {len(MU3['stops'])} stops came from its dry windows and the gaps between pieces. "
  f"{sum(1 for s in MU3['stops'] if s['s'] < 2.0)} of them were shorter than 2 s.")
w("")
w("## 4. Holes (the final mix under −42 dBFS for 0.3 s or more)")
w("")
def hole_why(h):
    a, b = d6_span(V4)
    if a - 3 <= h["a"] <= b + 3:
        return "D6, the designed digital silence after the Cancel click"
    for d in V4.MX.get("designed_stops_and_rests", []):
        if d["a"] - 3 <= h["a"] <= d["b"] + 3:
            return (f"inside a designed music rest ({d['label']}), with only the room bed playing. "
                    "Listen for whether the quiet reads as a hush or a drop-out")
    return "not designed: listen"


if HO4["holes"]:
    w("**v4, mono downmix:**")
    w("")
    for h in HO4["holes"]:
        i0, i1 = int(h["a"] * SPF / W50), int(h["a"] * SPF / W50 + h["s"] * 20)
        lc = float(np.median(HL4["L"][i0:i1]))
        w(f"- {tc(h['a'])} ({shot_at(V4, h['a'])}): {f2(h['s'])} s, median {h['lv']:.0f} dBFS in mono and {lc:.0f} dBFS on the louder channel. {hole_why(h)}.")
    w(f"- On the louder channel: {len(HL4['holes'])} hole(s), " + ", ".join(f"{tc(h['a'])} {f2(h['s'])} s" for h in HL4["holes"]) + ".")
else:
    w("**v4:** none.")
w("")
top3 = sorted(HO3["holes"], key=lambda h: -h["s"])[:8]
w(f"**v3, mono downmix:** {len(HO3['holes'])} holes, {th3:.1f} s in total. The longest:")
w("")
for h in top3:
    w(f"- {tc(h['a'])} ({shot_at(V3, h['a'])}): {f2(h['s'])} s")
w("")
# ---- 4b (v4.1): the level across the silent posts and the wordless stretches by sequence (the flow audit's #1 and #2)
def post_rows(c):
    Lc = lev(c.mix)
    fw = lambda f: int(f * SPF / W50)   # noqa: E731
    med = lambda a, b: float(np.median(Lc[fw(a):max(fw(a) + 1, fw(b))]))   # noqa: E731
    rows = []
    shots = c.shots
    items = [(i, l["abs_in"], l["abs_out"], l["text"][:34]) for i, r in enumerate(shots) for l in r["lines"] if l["kind"] == "post"]
    for i, r in enumerate(shots):
        for t in r.get("texts") or []:
            if t["kind"] == "post" and not any(abs(t["abs_in"] - a) < 8 for _, a, _, _ in items):
                items.append((i, t["abs_in"], t["abs_out"], t["text"][:34]))
    for i, a, b, lab in sorted(items, key=lambda x: x[1]):
        pr, nx = shots[max(0, i - 1)], shots[min(len(shots) - 1, i + 1)]
        bef, dur, aft = med(pr["start_frame"], pr["end_frame"]), med(a, b), med(nx["start_frame"], nx["end_frame"])
        rows.append((shots[i]["id"], lab, bef, dur, aft, dur - max(bef, aft)))
    voiced = np.zeros(len(Lc), bool)
    for r in shots:
        for l in r["lines"]:
            if l["kind"] != "post":
                voiced[fw(l["abs_in"]):fw(l["abs_out"]) + 1] = True
    seqm = []
    for q in c.L.get("sequences", []):
        a0, b0 = fw(q["start_frame"]), fw(q["end_frame"])
        m = ~voiced[a0:b0]
        seqm.append((q["id"], float(np.median(Lc[a0:b0][m])) if m.any() else float("nan")))
    return rows, seqm


PR4, SQ4 = post_rows(V4)
w("## 4b. The level across silent posts, and in each sequence's wordless stretches")
w("")
w("The flow audit of v4.0 found the whole mix dropping 7–14 dB under every silent post and swelling back between them, and S5 (the reveals) "
  "sitting about 8 dB under its neighbours. Louder channel, median of the 50 ms windows; the shot before and after for comparison.")
w("")
w("| Shot | Post | Shot before | Under the post | Shot after | Change |")
w("|---|---|---|---|---|---|")
for sid, lab, bef, dur, aft, dip in PR4:
    w(f"| {sid} | {esc_md(lab)} | {bef:.1f} | {dur:.1f} | {aft:.1f} | {dip:+.1f} dB |")
w("")
w("Wordless stretches, median dBFS by sequence: " + " · ".join(f"{k} {v:.1f}" for k, v in SQ4) + ".")
w("")
w("## 5. Abrupt level jumps (over 15 dB between adjacent 50 ms windows)")
w("")
w("**By cause.** Causes are assigned by time, the same way on both cuts (see the script's header). Each cell is mono downmix / louder channel.")
w("")
w("| Cause | v3 | v4 |")
w("|---|---|---|")
for k in ("speech (inside a voiced line or at its edges)", "D6's edges (designed)", "a sound effect's onset", "music starting or stopping", "other (none of the above)"):
    w(f"| {k} | {JC['m3'][k]} / {JC['l3'][k]} | {JC['m4'][k]} / {JC['l4'][k]} |")
w(f"| **all** | **{len(HO3['jumps'])} / {len(HL3['jumps'])}** | **{len(HO4['jumps'])} / {len(HL4['jumps'])}** |")
w("")
oth = [j for j in HO4["jumps"] if jump_cause(V4, j["f"], MU4["runs"]).startswith("other")]
if oth:
    w("**v4's \"other\" jumps (mono downmix), to hear:** " + ", ".join(f"{tc(j['f'])} {shot_at(V4, j['f'])} ({j['d']:+.0f} dB)" for j in oth) + ".")
    w("")
w("v4's louder-channel jumps, with the sound pass's own cause for each (`act4-mix-v4.cues.json`):")
w("")
w("| Cause | Jumps |")
w("|---|---|")
for k, n in jb.most_common():
    w(f"| {k} | {n} |")
w("")
w("Most of these are speech against a room floor about 20 dB down, which is how words sound. "
  "The ones worth hearing are the \"other\" jumps and the music entries.")
w("")
w("## 6. Dialogue rhythm")
w("")
w("| Gap between consecutive voiced lines | v3 | v4 |")
w("|---|---|---|")
for k in DG3["hist"]:
    w(f"| {k} | {DG3['hist'][k]} | {DG4['hist'][k]} |")
w("")
w(f"- **Reply gaps** (a line chained to the one it answers): v3 median {f2(statistics.median(DG3['reply']))} s across {len(DG3['reply'])} replies, "
  f"v4 median {f2(statistics.median(DG4['reply']))} s across {len(DG4['reply'])}.")
w(f"- **v4's reply gaps:** " + ", ".join(f"{x['g']:+.2f}" for x in DG4["gaps"] if x["chained"]) + " s.")
w("")
w("**v4's wordless stretches of 6 s or more**, with how much of each has music under it (the rebuilt bus):")
w("")
w("| After | Before | Length | Music under it | Shots |")
w("|---|---|---|---|---|")
for x in DG4["long"]:
    w(f"| `{x['a']['id']}` {x['a']['speaker']} | `{x['b']['id']}` {x['b']['speaker']} | {f2(x['g'])} s | {x['music_on']:.0f}% | "
      f"{shot_at(V4, x['a']['abs_out'])} → {shot_at(V4, x['b']['abs_in'])} |")
w("")
w(f"For comparison, v3 had {len(DG3['long'])} such stretches. "
  f"{sum(1 for x in DG3['long'] if x['music_on'] < 50)} of them had music under less than half their length.")
w("")
w("A long stretch is fine when the picture tells the story under music (a montage, THE PLAN, the record items). "
  "The ones to check by watching are those with little music under them.")
w("")
w("## 7. Runtime by sequence")
w("")
w("The sequences are v4's. The v3 column is the same stretch of story in v3, as `shots-locked-v4.json` maps it.")
w("")
w("| Seq | Chapter | Title | v3 | v4 | v3 shots (mean) | v4 shots (mean) |")
w("|---|---|---|---|---|---|---|")
for r in SEQROWS:
    v3s = f"{r['v3_s']:.1f} s" if "v3_s" in r else "—"
    v3n = f"{r['v3_shots']} ({r['v3_mean']:.2f} s)" if "v3_s" in r else "—"
    w(f"| {r['id']} | {r['chapter']} | {r['title']} | {v3s} | {r['v4_s']:.1f} s | {v3n} | {r['v4_shots']} ({r['v4_mean']:.2f} s) |")
w(f"| | | **Act** | **{V3.total / FPS:.1f} s** | **{V4.total / FPS:.1f} s** | **{SH3['shots']} ({SH3['mean']:.2f} s)** | **{SH4['shots']} ({SH4['mean']:.2f} s)** |")
w("")
w(f"v4 runs {(V4.total - V3.total) / FPS:+.1f} s against v3 (v4.0 ran +20.0 s, v4.1 +3.9 s). Per [flow-and-continuity §6](../../../../bible/flow-and-continuity.md#6-runtime), "
  "runtime is an outcome, not a target. v4.1 took out the insider read's drags and repeats and put back held reads where the newcomer read needed them; "
  "v4.2 cut two more beats the fresh insider read marked as air (S3.08, S5.10) and gave the Q* rail and the last image their reads. "
  "Whether any of it drags or rushes is for the watch to decide, not this table.")
w("")
w("## 8. The encoded file, and what a human still has to check")
w("")
if ENC:
    for k in ("audio_error", "picture_error"):
        if k in ENC:
            w(f"- **{k.replace('_', ' ')}:** {ENC[k][:300]}")
    if "audio_lag_samples" in ENC:
        w(f"- **Audio against the mix:** the decoded AAC runs {ENC['audio_seconds']:.3f} s. "
          f"Cross-correlated with `act4-mix-v4.wav` at 0:20, 1:30, 2:40 and 4:00, the lags are {ENC['audio_lag_samples']} samples (48 kHz).")
    if "cuts_on_frame" in ENC:
        w(f"- **Picture cuts in the encoded video:** {ENC['frames_decoded']} frames decoded. At {ENC['cuts_on_frame']} of the {ENC['cuts_total']} cuts, "
          f"the biggest frame-to-frame change in the picture area falls exactly on the lock's cut frame. "
          f"{ENC['cuts_untestable']} cuts join near-identical frames and can't be tested this way.")
        if ENC["cuts_elsewhere"]:
            w("  - Cuts where the biggest change is elsewhere. Each line gives the shot, the cut frame, the offset in frames, the change at the cut against the biggest change, and the move:")
            for x in ENC["cuts_elsewhere"]:
                note = CUT_NOTES.get(x[0], "not yet looked at: pull the frames either side")
                w(f"    - {x[0]} at f{x[1]}: {x[2]:+d} f, {x[3]} vs {x[4]}, {x[5]}. {note}")
    if ENC.get("onsets"):
        w("- **Onsets on the decoded audio** (0.2 s before against 0.2 s after the lock's in-frame): "
          + "; ".join(f"\"{t}\" {a:.0f} → {b:.0f} dBFS" for _, t, a, b in ENC["onsets"]) + ".")
    if "d6_decoded_db" in ENC:
        w(f"- **D6 decodes at {ENC['d6_decoded_db']:.0f} dBFS**" + (" (digital zero: the encoder added no noise)." if ENC['d6_decoded_db'] < -120 else " (AAC noise over digital silence)."))
    w("")
w("**Picture notes** (stills pulled by the finishing and closing passes; motion is unchecked):")
w("")
w("- **S3.04:** v4.0's flat black box in front of Rima is now a drawn laptop lid (a rim light, a logo). Still a simple shape: for the picture owner.")
w("- **S6.05 + S6.06** are one shot now, so the cut that didn't show is gone.")
w("- **v4.2:** the noon arrow lands on Cancel (not beside OK) and Cancel lights in Alyi's colour under it; its tag reads ALYI / CO-FOUNDER. Tasya's sign is taped to the slate door in S5.11 and S5.12. The lobby's arrow wears the noon tag's size, empty, and steps in on grey 2; the greyed Cancel no longer goes down when it is clicked.")
try:
    _lay = json.load(open(os.path.join(OUT, "layout-v4.json")))
    _rows = _lay if isinstance(_lay, list) else _lay.get("shots", [])
    _sti = [r.get("id") for r in _rows if r.get("standin")]
    if _sti:
        w(f"- **{len(_sti)} shots** still carry drawn stand-ins (pink on `act4-v4-contact.png`): {', '.join(_sti)}. None prints a stand-in label in the picture (the post cards' `post-ui` tag is gone).")
except Exception:  # noqa: BLE001
    pass
w("")
w("**For a human, in real time, with sound** (nobody has done this yet):")
w("")
w("1. Watch the whole act once with no notes. Does it feel fluid and coherent, like a thriller? Can you follow where, when and who in each sequence (§7)?")
w("2. The spots the numbers point at:")
for s in MU4["stops"]:
    if s["s"] >= 1.0:
        w(f"   - {tc(s['a'])}: the music is off for {s['s']:.1f} s ({v4_stop_cause(s['a'], s['b'])}). Does it land as punctuation, and is the re-entry clean?")
for x in DG4["long"]:
    if x["music_on"] < 50:
        w(f"   - {tc(x['a']['abs_out'])}: {x['g']:.1f} s with no voice and little music. Is it a designed quiet beat, or a hole?")
for run in SH4["runs_2.0"]:
    w(f"   - {tc(run[0]['start_frame'])}: {len(run)} shots under 2 s in a row ({run[0]['id']}–{run[-1]['id']}). Montage or strobe?")
w("   - The spots the finishing pass changed and couldn't hear: the level under each silent post (it should ride, not dip); the S5 pulse under the letter and the check (a heartbeat, not a groove?); "
  "the glance as a ring-out (does the Build's stop still land?); Tasya's pad pre-lapping under the violin; the eight seconds after the Cancel click; whether the synthetic room beds sound like air or hiss.")
w("3. The newcomer read and the insider read (flow-and-continuity §5a), with the picture-only file "
  "(`act4-animatic-v4-picture.mp4`, the picture at 960 x 540 with the v4 mix) and the timed transcript.")
w("")
open(os.path.join(PROD, "report-v4.md"), "w").write("\n".join(lines) + "\n")
print("wrote", os.path.join(PROD, "report-v4.md"), len(lines), "lines")


# ================================================================================================ transcripts
def words(s):
    return len([t for t in re.split(r"\s+", s.strip()) if re.search(r"[A-Za-z0-9]", t)])


def who(l):
    sp = l["speaker"]
    if l["kind"] == "vo":
        return f"{sp} (V.O.)"
    if l["kind"] == "post":
        return f"{sp} (POST, ON SCREEN)"
    if l["mode"] == "speaker" or l.get("via") == "speaker":
        return f"{sp} (THROUGH A LAPTOP SPEAKER)"
    if l.get("via") == "call":
        return f"{sp} (ON THE CALL)"
    if l["mode"] == "read-aloud-post":
        return f"{sp} (READING A POST ALOUD)"
    if l["mode"] == "memo-read":
        return f"{sp} (READING THE MEMO)"
    if l.get("os"):
        return f"{sp} (O.S.)"
    return sp


# v4.1: who the picture has named by the time a line plays (a plate, a card, a call tile's name); before that, what a
# viewer can see or hear. The newcomer read must not learn names from the transcript.
UNNAMED_V4 = {
    "a4-25-10b": "A WOMAN'S VOICE OVER THE BLUEPRINT", "a4-25-11": "THE SAME VOICE", "a4-25-12": "THE SAME VOICE",
    "a4-25-13": "THE SAME VOICE", "a4-25-02": "A MAN'S VOICE, CUTTING IN", "a4-27-05": "AN EMPLOYEE (HAND UP)",
    "a4-27-15": "A WOMAN IN MARIO'S OFFICE (SHE TAKES THE PHONE)",
}


def transcript(c):
    ev = []
    posts = set()
    for r in c.shots:
        for l in r["lines"]:
            wl = who(l)
            if c.v == "v4" and l["id"] in UNNAMED_V4:
                wl = UNNAMED_V4[l["id"]] + (" (POST, ON SCREEN)" if l["kind"] == "post" else "")
            ev.append((l["abs_in"], 0, r["id"], f"{wl}: {l['text']}"))
            if l["kind"] == "post":
                posts.add(re.sub(r"\W+", "", l["text"].lower())[:40])
    for r in c.shots:
        tx = r.get("texts") if c.v == "v4" else r.get("text")
        for t in tx or []:
            if words(t["text"]) < (1 if c.v == "v4" else 4):
                continue
            key = re.sub(r"\W+", "", t["text"].lower())[:40]
            if any(key and (key in p or p in key) for p in posts):
                continue
            f = t["abs_in"] if "abs_in" in t else r["start_frame"] + (t.get("at") or 0)
            ev.append((f, 1, r["id"], f"[ON SCREEN · {t['kind']}] {t['text']}"))
    ev.sort(key=lambda e: (e[0], e[1]))
    head = []
    if c.v == "v4":
        seqs = [(q["start_frame"], f"== {q['id']} ==") for q in c.L["sequences"]]   # v4.1: no production titles (they tell)
    else:
        seqs = []
        for s in c.L["scenes"]:
            first = next((r for r in c.shots if str(r["scene"]) == str(s["scene"])), None)
            if first:
                seqs.append((first["start_frame"], f"== sc {s['scene']} =="))
    out = [f"MR. MAS · Ep1 · Act Four · animatic {c.v}{'.2' if c.v == 'v4' else ''} · timed transcript",
           f"From shots-locked-{c.v}.json ({len(c.shots)} shots, {at(c.total)}). Every voiced line and post with its start time and speaker,",
           ("and every on-screen text. A speaker is named only once the picture has named them (a plate, a card, a call tile)."
            if c.v == "v4" else "and every on-screen text of more than 3 words.") + " ACT = act time (m:ss.ss); TC = episode timecode (mm:ss:ff, 24 fps).",
           "Generated by studio/src/episodes/ep01/act4/animatic/tools/report_v4.py --transcripts.", ""]
    si = 0
    for f, _, sid, txt in ev:
        while si < len(seqs) and seqs[si][0] <= f:
            out += ["", seqs[si][1]]
            si += 1
        out.append(f"{at(f):>8}  {tc(f)}  {sid:<7} {txt}")
    return "\n".join(head + out) + "\n"


if "--transcripts" in sys.argv:
    d = sys.argv[sys.argv.index("--transcripts") + 1]
    os.makedirs(d, exist_ok=True)
    for c in (V3, V4):
        p = os.path.join(d, f"transcript-{c.v}.txt")
        open(p, "w").write(transcript(c))
        print("wrote", p)
