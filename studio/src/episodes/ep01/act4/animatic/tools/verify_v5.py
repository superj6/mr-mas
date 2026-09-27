#!/usr/bin/env python3
"""MR. MAS - Ep1 Act Four v5: the encoded films checked against the lock and the temp track (the a4p5-render pass).

Nobody watches or listens: every number comes from decoding the mp4s. Writes out/ep01/act4/animatic/verify-v5.json
(report_v5.py folds it into report-v5.md section 5).
  films    act4-animatic-v5.mp4 (its picture area, crop 1440 x 810) and act4-animatic-v5-picture.mp4, each decoded once
           at 160 x 90 grey (area scale):
           - every lock cut: where the largest change within +-3 frames lands, and the report's "found" test (on the
             lock frame, over 2 and over 3 times the median change of the 24 frames around it)
           - the two films frame against frame (the same native frame at 3x and at 4x, both area-scaled to 160 x 90:
             a one-frame slip anywhere shows as a large difference)
           - each film's audio against mix.wav (act frame 0 = its frame 72): the rms difference and a lag at every
             voiced line's onset (1 s windows, +-50 ms search)
  compare  act4-v5-cancel-compare.mp4: frame count, the lock cuts inside each pass, pass A against pass B (they may
           differ only where J1 plays), pass A against the picture film at the same act frames, the audio of each
           pass against mix.wav, silence under the slates
Light on the laptop: one decode thread at nice 19, numpy pinned to one thread; about 50 s and 1 GB. Still put it
through ops/heavy.sh (it decodes two 1080p films). Run from the repo root:
  ops/heavy.sh audio/.venv-mix/bin/python studio/src/episodes/ep01/act4/animatic/tools/verify_v5.py
"""
import os

for _v in ("OPENBLAS_NUM_THREADS", "OMP_NUM_THREADS", "MKL_NUM_THREADS", "NUMEXPR_NUM_THREADS"):
    os.environ[_v] = "1"
import json
import re
import struct
import subprocess
import time

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
R = os.path.abspath(os.path.join(HERE, "../../../../../../.."))
FD = f"{R}/studio/node_modules/@remotion/compositor-linux-x64-gnu"
FF = f"{FD}/ffmpeg"
ENV = {**os.environ, "LD_LIBRARY_PATH": FD}
OUT = f"{R}/out/ep01/act4/animatic"
ANIM, PIC, CMP = f"{OUT}/act4-animatic-v5.mp4", f"{OUT}/act4-animatic-v5-picture.mp4", f"{OUT}/act4-v5-cancel-compare.mp4"
MIXW = f"{R}/audio/reel/ep01-act4-v5/mix.wav"
src = open(os.path.join(HERE, "..", "data-v5.ts"), encoding="utf-8").read()


def const(n):
    m = re.search(r"export const " + n + r"\s*(?::[^=]*)?=\s*", src)
    return json.JSONDecoder().raw_decode(src[m.end():])[0]


SHOTS, SUBS, MIX, N, D6 = const("SHOTS"), const("SUBS"), const("MIX"), const("ACT_FRAMES"), const("D6")
W, H, SR, SPF = 160, 90, 48000, 2000
# compare5.ts, restated: each end snaps back to the cut at or before click +- 8 s; 1 s slates
CLICK = D6[0]
cut_at_or_before = lambda f: max(s["s"] for s in SHOTS if s["s"] <= f)
CF, CT, SL = cut_at_or_before(CLICK - 192), cut_at_or_before(CLICK + 192), 24
L = CT - CF


def frames(path, crop=None, ss=None, n=None):
    """grey 160 x 90 frames through an uncompressed AVI pipe (the bundled ffmpeg has no rawvideo muxer)"""
    cmd = ["nice", "-n", "19", FF, "-hide_banner", "-loglevel", "error", "-threads", "1"]
    if ss is not None:
        cmd += ["-ss", f"{ss:.4f}"]
    cmd += ["-i", path, "-an"]
    if n:
        cmd += ["-frames:v", str(n)]
    cmd += ["-vf", (f"crop={crop}," if crop else "") + f"scale={W}:{H}:flags=area", "-c:v", "rawvideo", "-pix_fmt", "gray", "-f", "avi", "pipe:1"]
    p = subprocess.Popen(cmd, stdout=subprocess.PIPE, env=ENV)
    out, k, buf = np.zeros(((n or N) + 8, H, W), np.uint8), 0, b""

    def need(m):
        nonlocal buf
        while len(buf) < m:
            c = p.stdout.read(1 << 20)
            if not c:
                return False
            buf += c
        return True

    need(12)
    buf = buf[12:]
    while need(8):
        cid, sz = buf[:4], struct.unpack("<I", buf[4:8])[0]
        if cid == b"LIST":
            buf = buf[12:]
            continue
        if not need(8 + sz + (sz & 1)):
            break
        if cid in (b"00db", b"00dc") and sz:
            out[k] = np.frombuffer(buf[8:8 + W * H], np.uint8).reshape(H, W)
            k += 1
        elif cid == b"idx1":
            break
        buf = buf[8 + sz + (sz & 1):]
    p.stdout.close()
    p.wait()
    return out[:k]


def pcm(path, ss=None, dur=None):
    """mono float at 48 kHz through a 16-bit WAV pipe"""
    cmd = ["nice", "-n", "19", FF, "-hide_banner", "-loglevel", "error", "-threads", "1"]
    if ss is not None:
        cmd += ["-ss", f"{ss:.4f}"]
    cmd += ["-i", path, "-vn"]
    if dur is not None:
        cmd += ["-t", f"{dur:.4f}"]
    cmd += ["-ac", "1", "-ar", str(SR), "-c:a", "pcm_s16le", "-f", "wav", "pipe:1"]
    d = subprocess.run(cmd, env=ENV, capture_output=True, check=True).stdout
    k = d.index(b"data") + 8
    return np.frombuffer(d[k:k + ((len(d) - k) // 2) * 2], np.int16).astype(np.float32) / 32768


def changes(fr):
    return np.concatenate([[0.0], np.abs(np.diff(fr.astype(np.int16), axis=0)).mean(axis=(1, 2))])


def cut_rows(d, cuts, off=0):
    rows = []
    for f, sid in cuts:
        p = f + off
        win = d[p - 3:p + 4]
        j = int(np.argmax(win)) - 3
        around = float(np.median(np.delete(d[max(1, p - 12):p + 13], 12)))
        found = j == 0 and d[p] > max(2.0, 3 * around)
        rows.append(dict(shot=sid, act=f, peak_at=j, at_cut=round(float(d[p]), 2), around_median=round(around, 2), found=bool(found)))
    return rows


def cut_summary(rows):
    return dict(lock_cuts=len(rows), found_on_lock_frame=sum(r["found"] for r in rows), peak_on_lock_frame=sum(r["peak_at"] == 0 for r in rows),
                not_found=[r for r in rows if not r["found"]])


def lag(x, ref, i, span=2400, win=SR):
    w0 = ref[i:i + win]
    if i < span or i + win + span > len(x) or np.linalg.norm(w0) < 1e-4:
        return None

    def corr(k):
        y = x[i + k:i + k + win]
        return float(np.dot(y, w0) / (np.linalg.norm(y) * np.linalg.norm(w0) + 1e-12))

    k0 = max(range(-span, span + 1, 16), key=corr)
    k1 = max(range(k0 - 16, k0 + 17), key=corr)
    return k1, corr(k1)


t0 = time.time()
res = dict(tool="studio/src/episodes/ep01/act4/animatic/tools/verify_v5.py", when=time.strftime("%Y-%m-%dT%H:%M:%S%z"))
cuts = [(s["s"], s["id"]) for s in SHOTS[1:]]
# ---- the two films
a = frames(ANIM, "1440:810:0:0")
p = frames(PIC)
res["films"] = dict(anim_frames=len(a), picture_frames=len(p), act_frames=N)
res["films"]["anim_cuts"] = cut_summary(cut_rows(changes(a), cuts))
res["films"]["picture_cuts"] = cut_summary(cut_rows(changes(p), cuts))
n = min(len(a), len(p))
dd = np.array([float(np.abs(a[i].astype(np.int16) - p[i]).mean()) for i in range(n)])
res["films"]["anim_vs_picture"] = dict(frames=n, mean=round(float(dd.mean()), 3), p99=round(float(np.percentile(dd, 99)), 3), max=round(float(dd.max()), 3),
                                       argmax=int(np.argmax(dd)), frames_over_1=int((dd > 1).sum()))
pic_window = p[CF:CT].astype(np.float32).copy()
del a, p
mx = pcm(MIXW, ss=MIX["offsetFrames"] / 24, dur=N / 24)
for name, path in (("anim", ANIM), ("picture", PIC)):
    x = pcm(path)
    m = min(len(x), len(mx))
    lags = [(s["id"], s["s"], *r) for s in SUBS if s["kind"] != "post" for r in [lag(x, mx, s["s"] * SPF)] if r]
    ls, rs = [l[2] for l in lags], [l[3] for l in lags]
    res["films"][f"audio_{name}"] = dict(samples=len(x), mix_act_samples=len(mx), rms_diff=round(float(np.sqrt(np.mean((x[:m] - mx[:m]) ** 2))), 5),
                                         mix_rms=round(float(np.sqrt(np.mean(mx ** 2))), 5), onsets=len(lags), lag_samples_min=min(ls), lag_samples_max=max(ls),
                                         r_min=round(min(rs), 4), worst=sorted(lags, key=lambda l: l[3])[:3])
# ---- the Cancel comparison clip
if os.path.exists(CMP):
    c = frames(CMP, n=2 * (SL + L) + 8).astype(np.float32)
    d = changes(c)
    inside = [(f, sid) for f, sid in cuts if CF < f < CT]
    A, B = c[SL:SL + L], c[2 * SL + L:2 * SL + 2 * L]
    ab = np.abs(A - B).mean(axis=(1, 2))
    diff = [CF + i for i in range(L) if ab[i] > 1.0]
    ap = np.abs(A - pic_window[:len(A)]).mean(axis=(1, 2))
    au = pcm(CMP)
    mxc = mx[CF * SPF:CT * SPF]
    passes = {}
    for nm, s0 in (("A", SL * SPF), ("B", (2 * SL + L) * SPF)):
        best = min(range(-8, 9), key=lambda k: float(np.mean((au[s0 + k:s0 + k + len(mxc) - 16] - mxc[:len(mxc) - 16]) ** 2)))
        r = float(np.sqrt(np.mean((au[s0 + best:s0 + best + len(mxc) - 16] - mxc[:len(mxc) - 16]) ** 2)))
        passes[nm] = dict(lag_samples=best, rms_diff=round(r, 5))
    res["compare"] = dict(
        window=dict(act_from=CF, act_to=CT, click=CLICK, before_s=round((CLICK - CF) / 24, 2), after_s=round((CT - CLICK) / 24, 2), slate_frames=SL),
        frames=len(c), expected=2 * (SL + L),
        cuts_A=cut_summary(cut_rows(d, inside, SL - CF)), cuts_B=cut_summary(cut_rows(d, inside, 2 * SL + L - CF)),
        A_vs_B=dict(frames_differing=len(diff), first=diff[0] if diff else None, last=diff[-1] if diff else None,
                    max_elsewhere=round(float(max([ab[i] for i in range(L) if CF + i not in diff] or [0])), 3)),
        A_vs_picture=dict(frames=len(ap), mean=round(float(ap.mean()), 3), max=round(float(ap.max()), 3)),
        audio=dict(samples=len(au), expected=2 * (SL + L) * SPF, passes=passes,
                   slate_peak=[round(float(np.abs(au[0:SL * SPF]).max()), 5), round(float(np.abs(au[(SL + L) * SPF:(2 * SL + L) * SPF]).max()), 5)]))
res["seconds"] = round(time.time() - t0, 1)
dst = f"{OUT}/verify-v5.json"
json.dump(res, open(dst, "w"), indent=1, default=float)
f = res["films"]
print("wrote", dst, f"in {res['seconds']} s")
print("cuts found on the lock frame: anim", f["anim_cuts"]["found_on_lock_frame"], "picture", f["picture_cuts"]["found_on_lock_frame"], "of", f["anim_cuts"]["lock_cuts"],
      "| peak on the lock frame: anim", f["anim_cuts"]["peak_on_lock_frame"], "picture", f["picture_cuts"]["peak_on_lock_frame"])
print("anim vs picture:", f["anim_vs_picture"])
print("audio lags (samples):", {k: (f[k]["lag_samples_min"], f[k]["lag_samples_max"], f[k]["onsets"], f[k]["r_min"]) for k in ("audio_anim", "audio_picture")})
if "compare" in res:
    print("compare:", json.dumps({k: v for k, v in res["compare"].items() if k not in ("cuts_A", "cuts_B")}, default=float))
    print("compare cuts found: A", res["compare"]["cuts_A"]["found_on_lock_frame"], "B", res["compare"]["cuts_B"]["found_on_lock_frame"], "of", res["compare"]["cuts_A"]["lock_cuts"])
