"""report_v5.py - the Act Four flow diagnostics, v3, v4 and v5 side by side, and the v5 render's own checks.

Writes show/episodes/ep01/production/act4/report-v5.md (and report-v5.json beside the renders). Every number is measured
the SAME way on all three cuts, from their locks and their mixes, so the columns compare like for like. They are spotting
tools, not pass/fail gates (flow-and-continuity.md: "a number that looks off isn't automatically wrong; watch that spot").

  shots      shots-locked-v{3,4,5}.json: count, mean / median / shortest / longest, under 1 / 1.5 / 2 s, over 10 / 20 s,
             the densest 10 s (most cuts in a 240-frame window), a length histogram
  dialogue   the voiced lines (posts are read, not heard): lines, words (tokens with a letter or digit), median words a
             line, lines of three words or fewer, the dialogue share (the union of the line spans over the act), and
             EXCHANGES: consecutive voiced lines with no gap over 3.0 s from one line's end to the next line's start, split
             where a new place or time starts (v3: a scene; v4: a sequence; v5: a stick beat that carries `seq`, its
             sequences and their sub-heads); the stick report's definition (audio/reel/ep01-act4-v5/report.py). v5 uses the
             takes' exact onsets and ends (the lock's on_s / end_s, as the stick report does), v3 and v4 their locks'
             frames. The longest is "the longest conversation"; a 5.0 s gap is shown as a check.
  holes      the mix: 50 ms windows under -42 dBFS for 0.3 s or more
  jumps      the mix: over 15 dB between adjacent 50 ms windows. Both measured two ways, as report_v4.py does: (a) the
             mono downmix with no floor; (b) the louder channel, jumps only where a window is over -60 dBFS. Each jump gets
             a cause by time alone, the same way on all three: D6's edges, speech (inside a voiced line or within 2 f of
             its edges), a sound spot's onset (-2..+4 f), else "other". (report_v4 also attributed music starts and stops
             from each mix's EDL; the stick mix has no EDL, so no cut gets that bucket here.)
             The mixes: v3 act4-mix-v3.wav, v4 act4-mix-v4.wav (the finished temp mixes), v5 the STICK MIX
             audio/reel/ep01-act4-v5/mix.wav (act frame 0 = its frame 72): the pixel v5's temp track, not a pixel mix.
  render     (when the v5 mp4s exist) the streams; the audio in the animatic against mix.wav (cross-correlation lag at 12
             points); the picture's cuts found in the ENCODED picture file against the lock's cuts; the render's own log
             (GLYPH frames spliced, fallbacks)

Nobody watched or listened to anything to make these numbers. Run (repo root; one core: numpy's threads are pinned to 1;
it decodes the picture mp4 at 160 x 90 and the animatic's audio at low priority; put it through ops/heavy.sh):
  ops/heavy.sh audio/.venv-mix/bin/python studio/src/episodes/ep01/act4/animatic/tools/report_v5.py
"""
import json
import os
import re
import statistics
import struct
import subprocess
from collections import Counter, OrderedDict

# one core: numpy's BLAS would otherwise take every core of the laptop (the first run of this report did)
for _v in ("OPENBLAS_NUM_THREADS", "OMP_NUM_THREADS", "MKL_NUM_THREADS", "NUMEXPR_NUM_THREADS"):
    os.environ[_v] = "1"
import numpy as np  # noqa: E402
import soundfile as sf  # noqa: E402

REPO = "/home/jgon/project/art/mrmas"
P = lambda *a: os.path.join(REPO, *a)  # noqa: E731
SR, FPS = 48000, 24
SPF = SR // FPS
W50 = SR // 20
PROD = P("show/episodes/ep01/production/act4")
OUT = P("out/ep01/act4/animatic")
MP4_A = os.path.join(OUT, "act4-animatic-v5.mp4")
MP4_P = os.path.join(OUT, "act4-animatic-v5-picture.mp4")
CMP = os.path.join(OUT, "act4-v5-cancel-compare.mp4")
VERIFY = os.path.join(OUT, "verify-v5.json")  # tools/verify_v5.py (both films and the comparison clip, decoded)
FFDIR = P("studio/node_modules/@remotion/compositor-linux-x64-gnu")
FF, FFP = os.path.join(FFDIR, "ffmpeg"), os.path.join(FFDIR, "ffprobe")
FFENV = dict(os.environ, LD_LIBRARY_PATH=FFDIR)
F5 = open(P("studio/src/episodes/ep01/act4/animatic/frame5.ts")).read()
_mm = F5[F5.index("MIX_MISSING"):]
MIX_MISSING = set(re.findall(r"'(S[^']+ @\d+)'", _mm[:_mm.index("]);")]))


def nwords(text):
    return len([w for w in text.split() if re.search(r"[A-Za-z0-9]", w)])


def todb(x):
    return 20 * np.log10(np.maximum(x, 1e-12))


def lev(x, w=W50):
    n = len(x) // w
    p = (x[: n * w].reshape(n, w, x.shape[1]) ** 2).mean(axis=1)
    return todb(np.sqrt(p.max(axis=1)))


def lev_mono(x, w=W50):
    m = x.mean(axis=1)
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


def at(f):
    s = f / FPS
    return f"{int(s // 60)}:{s % 60:05.2f}"


def f2(x):
    return f"{x:.2f}"


# ================================================================================================ the three cuts
class Cut:
    pass


def load(v):
    c = Cut()
    c.v = v
    c.L = json.load(open(os.path.join(PROD, f"shots-locked-{v}.json")))
    S = c.L["summary"]
    c.total = S["act_frames"]
    if v == "v5":
        # a new place or time starts where the stick timeline's beat carries `seq` (its sequences AND their sub-heads:
        # THE PLAN, the call, the all-hands...), as the stick report splits its exchanges; the lock's 9 are coarser
        st = json.load(open(P("show/reel/ep01-act4-v5.json")))
        bseg, k = {}, -1
        for b in st["beats"]:
            if b.get("seq"):
                k += 1
            bseg[b["id"]] = k
        c.shots = [dict(id=r["id"], s=r["s"], e=r["e"], seg=bseg[r["beats"][0]]) for r in sorted(c.L["shots"], key=lambda r: r["s"])]
        c.lines = [dict(id=l["id"], who=l["who"], text=l["text"], a=l["abs_in"], b=l["abs_out"], on=l["on_s"], end=l["end_s"], kind=l["kind"], seg=bseg[l["beat"]]) for l in c.L["lines"]]
        c.posts = len(c.L["posts"])
        c.d6 = tuple(S["D6_frames"])
        c.sfx = []
        for r in c.L["shots"]:
            for x in r.get("sounds", []):
                m = re.match(r"^(.*) @(-?\d+)$", x.strip())
                if m and f"{r['id']} {m.group(1)} @{m.group(2)}" not in MIX_MISSING:
                    c.sfx.append(r["s"] + int(m.group(2)))
        x, sr = sf.read(P("audio/reel/ep01-act4-v5/mix.wav"), dtype="float64", always_2d=True)
        off = c.L["summary"]["mix"]["offset_frames"] * SPF
        c.mix = x[off: off + c.total * SPF, :2]
        c.mix_name = "the stick mix (audio/reel/ep01-act4-v5/mix.wav, act portion)"
    else:
        key = "scene" if v == "v3" else "seq"
        c.shots = [dict(id=r["id"], s=r["start_frame"], e=r["end_frame"], seg=r[key]) for r in c.L["shots"]]
        seen, c.lines, c.posts = set(), [], 0
        for r in c.L["shots"]:
            for l in r["lines"]:
                if l["id"] in seen:
                    continue
                seen.add(l["id"])
                if l["kind"] == "post":
                    c.posts += 1
                    continue
                c.lines.append(dict(id=l["id"], who=l["speaker"], text=l["text"], a=l["abs_in"], b=l["abs_out"], on=l["abs_in"] / FPS, end=l["abs_out"] / FPS, kind=l["kind"], seg=r[key]))
        d = S["D6"] if v == "v3" else None
        c.d6 = (d["start"], d["end"]) if d else (S["D6_frames"][0], S["D6_frames"][-1])
        cues = json.load(open(os.path.join(OUT, f"act4-mix-{v}.cues.json")))
        c.sfx = [x["f"] for x in cues["sfx"]]
        x, sr = sf.read(os.path.join(OUT, f"act4-mix-{v}.wav"), dtype="float64", always_2d=True)
        c.mix = x[: c.total * SPF, :2]
        c.mix_name = f"out/ep01/act4/animatic/act4-mix-{v}.wav (the {v} temp mix)"
    assert sr == SR
    c.lines.sort(key=lambda l: l["a"])
    c.lens = [(r["e"] - r["s"]) / FPS for r in c.shots]
    return c


CUTS = [load(v) for v in ("v3", "v4", "v5")]


# ================================================================================================ measurements
def shot_stats(c):
    L = c.lens
    s = OrderedDict(shots=len(L), mean=statistics.mean(L), median=statistics.median(L), min=min(L), max=max(L))
    for lim in (1.0, 1.5, 2.0):
        s[f"under_{lim}"] = sum(1 for x in L if x < lim)
    for lim in (10, 20):
        s[f"over_{lim}"] = sum(1 for x in L if x > lim)
    cuts = np.array([r["s"] for r in c.shots[1:]])
    best, best_at = 0, 0
    for a in range(0, max(1, c.total - 240 + 1), 6):
        n = int(((cuts >= a) & (cuts < a + 240)).sum())
        if n > best:
            best, best_at = n, a
    s["max_cuts_10s"], s["max_cuts_10s_at"] = best, best_at
    edges = [(0, 1), (1, 2), (2, 3), (3, 4), (4, 6), (6, 10), (10, 20), (20, 999)]
    s["hist"] = OrderedDict((f"{a}-{b} s" if b < 999 else f"{a} s +", sum(1 for x in L if a <= x < b)) for a, b in edges)
    top = sorted(zip(L, [r["id"] for r in c.shots]), reverse=True)[:3]
    s["longest"] = [f"{i} {x:.2f} s" for x, i in top]
    return s


def exchanges(c, maxgap):
    ex = []
    for l in c.lines:
        if ex and l["on"] - ex[-1]["end"] <= maxgap and l["seg"] == ex[-1]["lines"][-1]["seg"]:
            ex[-1]["lines"].append(l)
            ex[-1]["end"] = max(ex[-1]["end"], l["end"])
        else:
            ex.append(dict(a=l["a"], on=l["on"], end=l["end"], lines=[l]))
    for e in ex:
        e["s"] = e["end"] - e["on"]
        e["speakers"] = sorted({x["who"] for x in e["lines"]})
        e["words"] = sum(nwords(x["text"]) for x in e["lines"])
    return ex


def dialogue_stats(c):
    wc = [nwords(l["text"]) for l in c.lines]
    spans = sorted((l["a"], l["b"]) for l in c.lines)
    union, cur = 0, None
    for a, b in spans:
        if cur and a <= cur[1]:
            cur[1] = max(cur[1], b)
        else:
            if cur:
                union += cur[1] - cur[0]
            cur = [a, b]
    union += cur[1] - cur[0]
    ex3, ex5 = exchanges(c, 3.0), exchanges(c, 5.0)
    return OrderedDict(lines=len(c.lines), posts=c.posts, words=sum(wc), median_words=statistics.median(wc), le3=sum(1 for w in wc if w <= 3),
                       share=union / c.total, words_per_min=sum(wc) / (c.total / FPS / 60), ex3=ex3, ex5=ex5,
                       multi=sum(1 for e in ex3 if len(e["speakers"]) >= 2), longest=max(ex3, key=lambda e: e["s"]), longest5=max(ex5, key=lambda e: e["s"]),
                       over30=sum(1 for e in ex3 if e["s"] >= 30))


def hole_stats(c, mono):
    L = lev_mono(c.mix) if mono else lev(c.mix)
    fw = lambda i: i * W50 / SPF  # noqa: E731
    hs = [dict(a=fw(a), s=(b - a) / 20, lv=float(np.median(L[a:b]))) for a, b in runs(L < -42.0) if b - a >= 6]
    d = np.diff(L)
    big = (np.abs(d) > 15) if mono else (np.abs(d) > 15) & (np.maximum(L[1:], L[:-1]) >= -60)
    js = [dict(f=fw(i), d=float(L[i] - L[i - 1])) for i in np.nonzero(big)[0] + 1]
    return dict(holes=hs, jumps=js)


def jump_cause(c, f):
    a, b = c.d6
    if a - 2 <= f <= b + 3:
        return "D6's edges (designed)"
    for l in c.lines:
        if l["a"] - 2 <= f <= l["b"] + 2:
            return "speech (inside a voiced line or at its edges)"
    for x in c.sfx:
        if -2 <= f - x <= 4:
            return "a sound spot's onset"
    return "other"


SH = {c.v: shot_stats(c) for c in CUTS}
DG = {c.v: dialogue_stats(c) for c in CUTS}
HM = {c.v: hole_stats(c, True) for c in CUTS}
HL = {c.v: hole_stats(c, False) for c in CUTS}
JC = {(c.v, k): Counter(jump_cause(c, j["f"]) for j in H[c.v]["jumps"]) for c in CUTS for k, H in (("m", HM), ("l", HL))}
V5 = CUTS[2]


# ================================================================================================ the v5 render
def probe(path):
    r = subprocess.run([FFP, "-v", "error", "-show_entries", "stream=codec_type,codec_name,width,height,r_frame_rate,nb_frames,duration,sample_rate,channels:format=duration,size",
                        "-of", "json", path], capture_output=True, text=True, env=FFENV)
    return json.loads(r.stdout)


def frame_changes(path, w=160, h=90):
    """the video scaled to w x h (area) and grey: the mean absolute change from each frame to the next (frame 0: 0), read
    frame by frame from an uncompressed AVI stream (one frame in memory at a time)"""
    cmd = ["nice", "-n", "19", FF, "-hide_banner", "-loglevel", "error", "-threads", "2", "-i", path, "-an", "-vf", f"scale={w}:{h}:flags=area",
           "-c:v", "rawvideo", "-pix_fmt", "gray", "-f", "avi", "pipe:1"]
    p = subprocess.Popen(cmd, stdout=subprocess.PIPE, env=FFENV)
    buf, out, prev = b"", [], None
    def need(n):
        nonlocal buf
        while len(buf) < n:
            c = p.stdout.read(1 << 20)
            if not c:
                return False
            buf += c
        return True
    need(12)
    buf = buf[12:]  # RIFF size AVI
    while need(8):
        cid, sz = buf[:4], struct.unpack("<I", buf[4:8])[0]
        if cid in (b"LIST",):
            buf = buf[12:]  # descend into the list (its type follows)
            continue
        if not need(8 + sz + (sz & 1)):
            break
        if cid in (b"00db", b"00dc") and sz:
            a = np.frombuffer(buf[8:8 + sz], dtype=np.uint8)[: w * h].astype(np.int16)
            out.append(0.0 if prev is None else float(np.abs(a - prev).mean()))
            prev = a
        elif cid == b"idx1":
            break
        buf = buf[8 + sz + (sz & 1):]
    p.stdout.close()
    p.wait()
    return np.array(out)


def decode_audio(path):
    cmd = ["nice", "-n", "19", FF, "-hide_banner", "-loglevel", "error", "-i", path, "-vn", "-ac", "2", "-ar", str(SR), "-c:a", "pcm_s16le", "-f", "wav", "pipe:1"]
    d = subprocess.run(cmd, capture_output=True, env=FFENV, check=True).stdout
    import io
    x, sr = sf.read(io.BytesIO(d), dtype="float64", always_2d=True)
    return x


def render_checks():
    R = OrderedDict()
    for name, path in (("animatic", MP4_A), ("picture", MP4_P), ("cancel_compare", CMP)):
        if os.path.exists(path):
            R[name] = probe(path)
    if not os.path.exists(MP4_P):
        return R
    # the picture's cuts, found in the encoded file: the mean absolute change between frames (grey, 160 x 90)
    diff = frame_changes(MP4_P)
    R["picture_frames_decoded"] = int(len(diff))
    lock = [r["s"] for r in V5.shots[1:]]
    rows = []
    for c in lock:
        lo, hi = max(1, c - 3), min(len(diff), c + 4)
        w = diff[lo:hi]
        peak = lo + int(np.argmax(w))
        rows.append(dict(cut=c, peak=peak, off=peak - c, at_cut=float(diff[c]) if c < len(diff) else None,
                         around=float(np.median(np.delete(diff[max(1, c - 12):c + 13], 12))) if c + 13 <= len(diff) else None))
    exact = [r for r in rows if r["off"] == 0 and r["at_cut"] and r["at_cut"] > max(2.0, 3 * (r["around"] or 0))]
    R["cuts"] = dict(lock_cuts=len(lock), found_on_the_lock_frame=len(exact),
                     not_found=[dict(cut=r["cut"], tc=at(r["cut"]), shot=next(s["id"] for s in V5.shots if s["s"] == r["cut"]), peak_offset=r["off"], change_at_cut=round(r["at_cut"] or 0, 2), change_around=round(r["around"] or 0, 2)) for r in rows if r not in exact])
    # the animatic's audio against mix.wav: cross-correlation lag at 12 points (2 s windows, +-200 ms search)
    if os.path.exists(MP4_A):
        A = decode_audio(MP4_A).mean(axis=1)
        M = V5.mix.mean(axis=1)
        R["audio_samples"] = dict(animatic=int(len(A)), mix_act=int(len(M)))
        lags = []
        pts = [l["a"] for l in V5.lines][:: max(1, len(V5.lines) // 12)][:12]
        for f in pts:
            a0 = f * SPF
            ref = M[a0: a0 + 2 * SR]
            seg = A[max(0, a0 - SR // 5): a0 + 2 * SR + SR // 5]
            if len(ref) < SR or len(seg) < len(ref):
                continue
            n = len(seg) + len(ref)
            nf = 1 << (n - 1).bit_length()
            cc = np.fft.irfft(np.fft.rfft(seg, nf) * np.conj(np.fft.rfft(ref, nf)), nf)[: len(seg) - len(ref) + 1]  # = correlate(seg, ref, 'valid')
            k = int(np.argmax(cc)) - (a0 - max(0, a0 - SR // 5))
            nrm = float(cc.max() / (np.linalg.norm(ref) * np.linalg.norm(seg[k + (a0 - max(0, a0 - SR // 5)):][:len(ref)]) + 1e-12))
            lags.append(dict(act_frame=f, tc=at(f), lag_ms=round(k / SR * 1000, 2), corr=round(nrm, 3)))
        R["audio_sync"] = lags
    # the renderer's own log
    rj = MP4_A + ".render.json"
    if os.path.exists(rj):
        R["render_log"] = json.load(open(rj))
    return R


RC = render_checks()

# ================================================================================================ write
out = []
w = out.append
w("# Ep1 · Act Four · Report v5: the pixel preview on the approved stick timing, v3 · v4 · v5 side by side\n")
w("| | |\n|---|---|")
w("| **What this is** | The flow numbers of Act Four's three pixel cuts measured the same way (shots, shot lengths, dialogue words and lines, the longest conversation, holes and jumps in the mix), and the v5 render's own checks (streams, the audio against the temp track, the cuts found in the encoded picture). Generated by `studio/src/episodes/ep01/act4/animatic/tools/report_v5.py`. |")
w("| **The v5 cut** | `out/ep01/act4/animatic/act4-animatic-v5.mp4` (the review frame: picture at 3x, margin, transcript) and `act4-animatic-v5-picture.mp4` (the picture only, 4x), both on the stick mix. The Cancel click both ways: `act4-v5-cancel-compare.mp4`. The transcript: [transcript-v5.txt](transcript-v5.txt) (`tools/transcript_v5.py`). Shot list: [shotlist-v5](shotlist-v5.md); the lock and the layouts: [timing-v5](timing-v5.md). |")
w("| **Honesty** | Every number here is measured from files: nobody watched or listened. The v5 mix column is the STICK mix (the pixel v5 plays on it as its temp track, unchanged), so v5's holes and jumps are the stick mix's; v3 and v4 are their own finished temp mixes. Numbers point at spots to watch, they don't pass or fail anything. |\n")
w("## 1. Side by side\n")
w("| | v3 | v4 | v5 |\n|---|---|---|---|")
row = lambda label, fn: w(f"| {label} | " + " | ".join(fn(c) for c in CUTS) + " |")  # noqa: E731
row("Runtime", lambda c: f"{at(c.total)} ({c.total} f)")
row("Shots", lambda c: str(SH[c.v]["shots"]))
row("Mean / median shot", lambda c: f"{f2(SH[c.v]['mean'])} / {f2(SH[c.v]['median'])} s")
row("Shortest / longest shot", lambda c: f"{f2(SH[c.v]['min'])} / {f2(SH[c.v]['max'])} s")
row("Shots under 1 / 1.5 / 2 s", lambda c: f"{SH[c.v]['under_1.0']} / {SH[c.v]['under_1.5']} / {SH[c.v]['under_2.0']}")
row("Shots over 10 / 20 s", lambda c: f"{SH[c.v]['over_10']} / {SH[c.v]['over_20']}")
row("Most cuts in any 10 s", lambda c: f"{SH[c.v]['max_cuts_10s']} (at {at(SH[c.v]['max_cuts_10s_at'])})")
row("Voiced lines (+ silent posts)", lambda c: f"{DG[c.v]['lines']} (+ {DG[c.v]['posts']})")
row("Words of dialogue", lambda c: str(DG[c.v]["words"]))
row("Median words a line", lambda c: f"{DG[c.v]['median_words']:g}")
row("Lines of three words or fewer", lambda c: f"{DG[c.v]['le3']} ({100 * DG[c.v]['le3'] / DG[c.v]['lines']:.0f}%)")
row("Words a minute", lambda c: f"{DG[c.v]['words_per_min']:.0f}")
row("Dialogue share of the act", lambda c: f"{100 * DG[c.v]['share']:.0f}%")
row("Exchanges (3 s gap) · with 2+ speakers", lambda c: f"{len(DG[c.v]['ex3'])} · {DG[c.v]['multi']}")
row("**Longest conversation** (3 s gap)", lambda c: f"**{DG[c.v]['longest']['s']:.1f} s**, {len(DG[c.v]['longest']['lines'])} lines, {DG[c.v]['longest']['words']} words ({', '.join(DG[c.v]['longest']['speakers'])}) at {at(DG[c.v]['longest']['a'])}")
row("Longest with a 5 s gap", lambda c: f"{DG[c.v]['longest5']['s']:.1f} s")
row("Conversations of 30 s or more", lambda c: str(DG[c.v]["over30"]))
row("Mix measured", lambda c: c.mix_name)
row("Holes (mono downmix): count, total", lambda c: f"{len(HM[c.v]['holes'])}, {sum(h['s'] for h in HM[c.v]['holes']):.1f} s")
row("Holes (louder channel): count, total", lambda c: f"{len(HL[c.v]['holes'])}, {sum(h['s'] for h in HL[c.v]['holes']):.1f} s")
row("Jumps over 15 dB (mono, no floor)", lambda c: str(len(HM[c.v]["jumps"])))
row("Jumps over 15 dB (louder channel, -60 floor)", lambda c: str(len(HL[c.v]["jumps"])))
w("")
w(f"Cross-checks against earlier measurements: v3's mono holes and jumps here are {len(HM['v3']['holes'])} holes, {sum(h['s'] for h in HM['v3']['holes']):.1f} s and {len(HM['v3']['jumps'])} jumps (report-v4.md: 78, 70.5 s, 107). v4's dialogue here is {DG['v4']['lines']} lines, {DG['v4']['words']} words, a longest conversation of {DG['v4']['longest']['s']:.1f} s (the showrunner's note: 45, 176, 10 s). v5's is {DG['v5']['lines']} lines, {DG['v5']['words']} words, longest {DG['v5']['longest']['s']:.1f} s, {DG['v5']['longest5']['s']:.1f} s with a 5 s gap (the stick report, measure.json: 101, 836, 61.0 s, 75.1 s).\n")
w("## 2. Shot lengths\n")
w("| Length | v3 | v4 | v5 |\n|---|---|---|---|")
for k in SH["v5"]["hist"]:
    w(f"| {k} | " + " | ".join(str(SH[c.v]["hist"][k]) for c in CUTS) + " |")
w("")
w("Longest shots in v5: " + "; ".join(SH["v5"]["longest"]) + ".\n")
w("## 3. The conversations in v5 (exchanges of 10 s or more, by length)\n")
w("| Act time | Length | Lines | Words | Speakers | First → last line |\n|---|---|---|---|---|---|")
for e in sorted([e for e in DG["v5"]["ex3"] if e["s"] >= 10], key=lambda e: -e["s"]):
    w(f"| {at(e['a'])} | {e['s']:.1f} s | {len(e['lines'])} | {e['words']} | {', '.join(e['speakers'])} | `{e['lines'][0]['id']}` → `{e['lines'][-1]['id']}` |")
w("")
w("## 4. Holes and jumps, by cause\n")
w("| Cause (louder channel, -60 floor) | v3 | v4 | v5 |\n|---|---|---|---|")
causes = sorted({k for c in CUTS for k in JC[(c.v, 'l')]})
for k in causes:
    w(f"| {k} | " + " | ".join(str(JC[(c.v, 'l')].get(k, 0)) for c in CUTS) + " |")
w("")
w("| Cause (mono, no floor) | v3 | v4 | v5 |\n|---|---|---|---|")
causes = sorted({k for c in CUTS for k in JC[(c.v, 'm')]})
for k in causes:
    w(f"| {k} | " + " | ".join(str(JC[(c.v, 'm')].get(k, 0)) for c in CUTS) + " |")
w("")
lh = sorted(HL["v5"]["holes"], key=lambda h: -h["s"])[:8]
w("The longest holes in the v5 temp track (the stick mix, louder channel): " + ("; ".join(f"{at(h['a'])} {h['s']:.2f} s ({h['lv']:.0f} dBFS)" for h in lh) or "none") + ". D6, the Cancel click's designed silence, is " + f"{at(V5.d6[0])}–{at(V5.d6[1])}.")
oth = [j for j in HL["v5"]["jumps"] if jump_cause(V5, j["f"]) == "other"]
w("Jumps in v5 with no cause by time (louder channel): " + (", ".join(f"{at(j['f'])} ({j['d']:+.0f} dB)" for j in oth[:20]) or "none") + ".\n")
w("## 5. The v5 render\n")
if "animatic" in RC or "picture" in RC:
    w("| File | Video | Audio | Duration | Size |\n|---|---|---|---|---|")
    for name in ("animatic", "picture", "cancel_compare"):
        if name not in RC:
            continue
        pr = RC[name]
        vs = next((s for s in pr["streams"] if s["codec_type"] == "video"), {})
        au = next((s for s in pr["streams"] if s["codec_type"] == "audio"), {})
        w(f"| {name} | {vs.get('codec_name')} {vs.get('width')}x{vs.get('height')} @ {vs.get('r_frame_rate')}, {vs.get('nb_frames')} frames | {au.get('codec_name', 'none')} {au.get('sample_rate', '')} Hz {au.get('channels', '')} ch | {float(pr['format']['duration']):.3f} s | {int(pr['format']['size']) / 1e6:.1f} MB |")
    w("")
    if "cuts" in RC:
        cu = RC["cuts"]
        w(f"**The cuts, found in the encoded picture file** (`act4-animatic-v5-picture.mp4`, decoded at 160 x 90 grey, {RC['picture_frames_decoded']} frames): of the lock's {cu['lock_cuts']} cuts, **{cu['found_on_the_lock_frame']}** show their largest picture change on the lock's own frame (and at least 3 times the change around it). The rest:\n")
        if cu["not_found"]:
            w("| Cut | Act time | Shot | Largest change within ±3 f at | Change at the cut / around |\n|---|---|---|---|---|")
            for r in cu["not_found"]:
                w(f"| {r['cut']} | {r['tc']} | {r['shot']} | {r['peak_offset']:+d} f | {r['change_at_cut']} / {r['change_around']} |")
            w("\nA cut can be \"not found\" without being late: a cut between two dark frames, or into a frame that matches the last one closely (a continuation on the same setup), changes little. Each row is a spot to look at, not a fault.\n")
    if "audio_sync" in RC:
        lg = RC["audio_sync"]
        w(f"**The audio in the animatic against the temp track** (`mix.wav` from its frame {V5.L['summary']['mix']['offset_frames']}, cross-correlated in 2 s windows at {len(lg)} line onsets): lag " + ", ".join(f"{x['tc']} {x['lag_ms']:+.2f} ms (r {x['corr']})" for x in lg) + f". Samples: animatic {RC['audio_samples']['animatic']}, mix act portion {RC['audio_samples']['mix_act']}.\n")
    if os.path.exists(VERIFY):
        VF = json.load(open(VERIFY))
        f5 = VF["films"]
        ac, pc, av = f5["anim_cuts"], f5["picture_cuts"], f5["anim_vs_picture"]
        w(f"**Both films decoded frame by frame** (`tools/verify_v5.py`, {VF['when'][:16].replace('T', ' ')}; `verify-v5.json`): the review animatic's picture area (1440 x 810) and the picture film, {f5['anim_frames']} and {f5['picture_frames']} frames (the lock: {f5['act_frames']}). The same cut test as above finds **{ac['found_on_lock_frame']}** of {ac['lock_cuts']} cuts on the lock frame in the animatic and **{pc['found_on_lock_frame']}** in the picture film; the largest change within ±3 f lands on the lock frame for {ac['peak_on_lock_frame']} and {pc['peak_on_lock_frame']}. Not found in the animatic: " + ", ".join(f"{r['shot']} ({r['peak_at']:+d} f, {r['at_cut']} / {r['around_median']})" for r in ac["not_found"]) + ". The two films against each other at every frame (160 x 90 grey): mean difference " + f"{av['mean']}, 99th percentile {av['p99']}, max {av['max']}, frames over 1.0: {av['frames_over_1']} (a one-frame slip would show tens at every cut), so both carry the same picture on the same frame.\n")
        la, lp = f5["audio_anim"], f5["audio_picture"]
        w(f"**Both films' audio against `mix.wav`** at every voiced line's onset ({la['onsets']} onsets, 1 s windows, ±50 ms search): the lag is {la['lag_samples_min']} to {la['lag_samples_max']} samples in the animatic and {lp['lag_samples_min']} to {lp['lag_samples_max']} in the picture film (48 kHz), lowest correlation {la['r_min']} / {lp['r_min']}; rms difference over the whole act {la['rms_diff']} / {lp['rms_diff']} against the mix's {la['mix_rms']} (AAC's own error).\n")
        if "compare" in VF:
            cp = VF["compare"]; wn = cp["window"]
            w(f"**The comparison clip** (`act4-v5-cancel-compare.mp4`): {cp['frames']} frames (expected {cp['expected']}): a 1 s slate, pass A (GLYPH, as cut), a 1 s slate, pass B (J1). Each pass is act {at(wn['act_from'])}–{at(wn['act_to'])} (S1.07 to the end of S1.12): {wn['before_s']} s before the click (act frame {wn['click']}) and {wn['after_s']} s after, each end on a cut. Its {cp['cuts_A']['lock_cuts']} cuts: found on the lock frame {cp['cuts_A']['found_on_lock_frame']} in A and {cp['cuts_B']['found_on_lock_frame']} in B (B's S1.10 cut lands 2 f late because J1 still owns S1.10's first 2 frames). Pass A against pass B: {cp['A_vs_B']['frames_differing']} frames differ, act {cp['A_vs_B']['first']}–{cp['A_vs_B']['last']} (J1's t 1–59), and nothing elsewhere (max {cp['A_vs_B']['max_elsewhere']}). Pass A against the picture film at the same act frames: mean {cp['A_vs_picture']['mean']}, max {cp['A_vs_picture']['max']} (the same picture, GLYPH frames included). Audio: pass A {cp['audio']['passes']['A']['lag_samples']} and pass B {cp['audio']['passes']['B']['lag_samples']} samples off the mix at 48 kHz (rms {cp['audio']['passes']['A']['rms_diff']} / {cp['audio']['passes']['B']['rms_diff']}); slate peaks {cp['audio']['slate_peak'][0]} / {cp['audio']['slate_peak'][1]} (silent).\n")
    if "render_log" in RC:
        rl = RC["render_log"]
        sm = rl.get("summary", {})
        w(f"**The renderer's log** (`act4-animatic-v5.mp4.render.json`): {rl['frames']} frames in {rl['seconds']} s on {rl['jobs']} workers; GLYPH frames spliced from the Remotion host: picture {sm.get('pic')}, animatic {sm.get('anim')} (mismatches outside the room area: {len(sm.get('off', [])) or 'none'}); frames that fell back to stand-in marks: {len(sm.get('marked', [])) or 'none'}; layouts that threw: {len(sm.get('failed', {})) or 'none'}.\n")
else:
    w("The v5 mp4s were not found when this report ran.\n")
w("## 6. The pass's handoff (INF-FRAME5 and INF-RENDER5, the a4p5-render pass, 2026-09-27)\n")
w("**What was built** (all under `studio/src/episodes/ep01/act4/animatic/`; nothing committed, the lead commits):\n")
w("| File | What it is |\n|---|---|")
w("| `frame5.ts` | The v5 frame composer, pure, shared by Node and Remotion: `native5` (the 480 x 270 show frame: `shots5.ts drawShot5`, the blueprint print, the whips, the V.O. line, the rail band and side badge; it returns S1.09's GLYPH layers without drawing them), `picture5` (1920 x 1080, 4x nearest), `anim5` (1920 x 1080: the picture at 3x, the editor's margin, the review transcript and the act timeline), `glyphFrames5`, `MIX_MISSING` (the sound spots the temp mix lacks, flagged in the margin) |")
w("| `Animatic5.tsx` | The Remotion host: paints frame5's buffer, then the TRUE GLYPH tokens with the shared drawer (`shared/pixel/glyphDraw.ts drawGlyphLayer`, fonts via `ensureGlyphFonts`) at the output scale, clipped to the room area. Compositions (in `frames.ts`, entry `entry.tsx`): `ep01-act4-animatic-v5`, `ep01-act4-animatic-v5-picture`, `ep01-act4-animatic-v5-still` |")
w("| `Cancel5.tsx`, `compare5.ts` | `ep01-act4-v5-cancel-compare`: the Cancel click both ways for the showrunner (slate, GLYPH as cut, slate, J1 dropped in at the click via `art-v5/j1/J1Cancelled`). Never both in one cut; the main render keeps GLYPH |")
w("| `tools/render5.ts` | The Node renderer (see its header for every mode): raw frames piped to the bundled ffmpeg in an AVI stream (no PNG deflate), parallel chunks cut on shot starts, both outputs in one pass, the Remotion host's GLYPH frames spliced in (checked against Node outside the room area), muxed onto `mix.wav` at its 72-frame offset. Also `check`, `glyphs`, `compare`, `contact`, `stills`, `ledger` |")
w("| `tools/shotlist_v5.py`, `tools/report_v5.py` | `shotlist-v5.md` from the lock + the ledger; this report |")
w("| `tools/verify_v5.py`, `tools/transcript_v5.py` | Both films and the comparison clip decoded against the lock and the mix (`verify-v5.json`, §5); the plain-text transcript (lines with start times, speakers as the picture has named them, on-screen text over 3 words) |")
w("")
w("**How to re-run** (from `studio/`, `S` = a scratch folder of your own; every heavy step through `ops/heavy.sh`, one at a time):\n")
w("```sh")
w("npx esbuild src/episodes/ep01/act4/animatic/tools/render5.ts --bundle --platform=node --outfile=$S/r5.cjs")
w("node $S/r5.cjs check                                          # layouts, tiling, fallbacks, the temp track, MIX_MISSING (exit 1 on a problem)")
w("../ops/heavy.sh node $S/r5.cjs bundle $S/bundle                 # one Remotion bundle (about 1 min)")
w("BUNDLE=$S/bundle ../ops/heavy.sh node $S/r5.cjs glyphs $S/glyph 2   # the 28 GLYPH frames x 2 compositions + the Node = Remotion check")
w("SEGDIR=$S BUNDLE=$S/bundle ../ops/heavy.sh node $S/r5.cjs compare ../out/ep01/act4/animatic/act4-v5-cancel-compare.mp4 2")
w("GLYPH_DIR=$S/glyph SEGDIR=$S X264_THREADS=1 ../ops/heavy.sh node $S/r5.cjs both \\")
w("  ../out/ep01/act4/animatic/act4-animatic-v5.mp4 ../out/ep01/act4/animatic/act4-animatic-v5-picture.mp4 2")
w("node $S/r5.cjs contact ../out/ep01/act4/animatic/act4-v5-contact.png; node $S/r5.cjs contact ../out/ep01/act4/animatic/act4-v5-contact-native.png native")
w("node $S/r5.cjs ledger ../out/ep01/act4/animatic/layout-v5.json && python3 src/episodes/ep01/act4/animatic/tools/shotlist_v5.py")
w("python3 src/episodes/ep01/act4/animatic/tools/transcript_v5.py ../show/episodes/ep01/production/act4/transcript-v5.txt   # light: reads data-v5.ts only")
w("cd .. && ops/heavy.sh audio/.venv-mix/bin/python studio/src/episodes/ep01/act4/animatic/tools/verify_v5.py   # about 50 s, one decode thread")
w("ops/heavy.sh audio/.venv-mix/bin/python studio/src/episodes/ep01/act4/animatic/tools/report_v5.py")
w("ops/heavy.sh audio/.venv-mix/bin/python studio/src/episodes/ep01/act4/animatic/tools/mix_v5_final.py --mux-only   # the final mix onto the new picture: act4-animatic-v5-finalmix.mp4")
w("```\n")
w("Re-render after any change to `shots5.ts` (the lip-sync pass's mouth wiring), `data-v5.ts` (lock_v5.py) or the art. Re-run `glyphs` too if S1.09 or the margin changed (the render reports any spliced frame that no longer matches Node outside the room area). When `bed.py` rebuilds `mix.wav` on the approved timeline, empty `MIX_MISSING` in frame5.ts (`check` says when it is stale), re-mux (re-run `both`), and re-run this report.\n")
w("**Open issues** (this pass's; the lock's are in timing-v5 §8):\n")
w("1. **The temp track still lacks six beats' sound spots** (timing-v5 §2). The margin marks each one \"NOT IN THE TEMP MIX\" when it passes. A sound pass re-runs `bed.py`.")
_cmp = f"{float(RC['cancel_compare']['format']['duration']):.1f} s" if "cancel_compare" in RC else "not rendered"
w(f"2. **J1 is unruled.** The comparison clip is `act4-v5-cancel-compare.mp4` ({_cmp}: 1 s slate, GLYPH as cut, 1 s slate, J1; each pass S1.07 to the end of S1.12, about 8 s either side of the click, cut to cut; the window is `compare5.ts`). J1 owns t 0-59 after the click (it replaces t 1-59; t 0 is the click frame itself), so its last two frames cover the first two of S1.10 (S1.09 ends 58 f after the click). J1's own punch sound is not in the temp mix; D6's silence plays under it. An earlier, shorter cut of the clip (`act4-v5-cancel-glyph-vs-j1.mp4`, 20.2 s, 1.5 s slates, 3.4 s before the click) is superseded; the lead can delete it.")
w("3. **The GLYPH frames need a browser.** Node can't rasterise the glyph font, so a Node-only render without `GLYPH_DIR` draws v4's 2-pixel marks for those 28 frames (and says so). Stills and contact sheets from Node draw the marks too.")
src = (RC.get("render_log") or {}).get("sources") or {}
w("4. **The render is of these sources** (md5, from the render log; the lip-sync pass and then the finishing pass edited `shots5.ts` after the first render): " + (", ".join(f"`{k}` {v[:8]}" for k, v in src.items() if v) or "not recorded") + ". Current on disk: " + ", ".join(f"`{k}` {__import__('hashlib').md5(open(P('studio/src/episodes/ep01/act4/animatic', k), 'rb').read()).hexdigest()[:8]}" for k in src) + ". " + ("They match: the films carry the sources on disk." if all(v and __import__('hashlib').md5(open(P('studio/src/episodes/ep01/act4/animatic', k), 'rb').read()).hexdigest() == v for k, v in src.items()) else "THEY DIFFER: re-render (`both`)."))
w("5. **The margin's music line is the sequence's cue list**, not the cue under the frame: `data-v5.ts` carries no per-shot cues (the lock JSON does), so in S1, for example, it reads MM-07 first while MM-08 or D6's silence plays. The designed stops (D6, the dead stops, the ring-out) are exact to the frame. A `cues` field in lock_v5.py's data-v5 output would fix it (the lock pass's file).")
w("6. **Four cuts don't show as a picture change on their frame** (§5): S2.02, S2.03 and S2.04 are one setup (the desk, the marks, the F1.2 front starting as a thin line at the top), so the cut barely changes the picture, and S5.08's largest change lands 2 frames in (its slot action). The other 78 land on the lock frame.")
w("")
w("### 6a. The finishing pass (a4p5 finish, 2026-09-27)\n")
w("The picture audit's findings (audit-v5-pixel.md), the newcomer and insider reads of the picture film, the facts check's text fixes and the extra art's hand-off went into `shots5.ts` and the v5 art modules, and both films, the comparison clip, the contact sheets, the ledger, the shot list, the transcript and this report were rebuilt. Every layout change, shot by shot, is in [timing-v5 §9](timing-v5.md#9-the-finishing-pass-a4p5-finish-2026-09-27-about-0335-0500-what-changed-in-the-layouts); every art-module change in [art-built-v5 §5b](art-built-v5.md#5b-the-finishing-pass-a4p5-finish-art-changes). The lock, the cuts, the lines, the marks and the temp track are unchanged; v4 is byte-identical (812 / 812 frames, `v4check.mjs` pinned to commit 76ea5ba). The plain-text transcript is [transcript-v5.txt](transcript-v5.txt): the lock's lines and on-screen text, with the picture's words where the facts check changed them. The final-mix film (`act4-animatic-v5-finalmix.mp4`) is re-muxed by the mixer's `mix_v5_final.py --mux-only` onto the new picture.\n")
w("")
w("## 7. Measured versus needs a person\n")
w("| Measured here | Needs a person |\n|---|---|")
w("| The shot, line and word counts, the conversation lengths, the holes and jumps (from the locks and the mixes) | Whether the conversations play: watch the long ones in §3 at speed |")
w("| The cuts in both encoded films and the comparison clip against the lock, the two films against each other at every frame, the audio against the temp track at every line onset (§5) | Lip-sync in motion, the held-step rhythms, the GLYPH dissolve and J1 in motion (the comparison clip) |")
w("| The render's own log: every frame drawn by a layout, the GLYPH frames spliced | A newcomer and an insider read of the v5 picture |")
w("")
dst = os.path.join(PROD, "report-v5.md")
open(dst, "w").write("\n".join(out) + "\n")


def jsonable(x):
    if isinstance(x, dict):
        return {k: jsonable(v) for k, v in x.items() if k not in ("lines",)}
    if isinstance(x, list):
        return [jsonable(v) for v in x]
    if isinstance(x, (np.floating, np.integer)):
        return x.item()
    return x


json.dump(jsonable(dict(shots=SH, dialogue={k: {kk: vv for kk, vv in v.items() if kk not in ("ex3", "ex5")} for k, v in DG.items()},
                        holes_mono={k: dict(n=len(v["holes"]), s=sum(h["s"] for h in v["holes"]), jumps=len(v["jumps"])) for k, v in HM.items()},
                        holes_louder={k: dict(n=len(v["holes"]), s=sum(h["s"] for h in v["holes"]), jumps=len(v["jumps"])) for k, v in HL.items()},
                        render=RC)), open(os.path.join(OUT, "report-v5.json"), "w"), indent=1, default=str)
print("wrote", dst)
for c in CUTS:
    d = DG[c.v]
    print(c.v, f"shots {SH[c.v]['shots']} median {SH[c.v]['median']:.2f}", f"lines {d['lines']} words {d['words']} longest {d['longest']['s']:.1f}s",
          f"holes(mono) {len(HM[c.v]['holes'])} jumps(mono) {len(HM[c.v]['jumps'])} jumps(louder) {len(HL[c.v]['jumps'])}")
if "cuts" in RC:
    print("cuts found on the lock frame:", RC["cuts"]["found_on_the_lock_frame"], "/", RC["cuts"]["lock_cuts"])
if "audio_sync" in RC:
    print("audio lags ms:", [x["lag_ms"] for x in RC["audio_sync"]])
