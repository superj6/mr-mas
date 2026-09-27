#!/usr/bin/env python3
"""Ep1 full stick reel v2: measure the ENCODED file (run with audio/.venv-casting/bin/python).

  measure.py <reel.mp4> <plan.json> <out_dir> [--no-video]
  audio (decoded from the file's AAC):
    - integrated loudness (BS.1770, pyloudnorm) and sample peak, whole file and per chapter
    - holes: runs of 0.3 s or more where the 50 ms RMS (the louder channel, 10 ms hop) is under -42 dBFS, each placed on
      its chapter, beat, bed segment and the lines either side, so each can be explained
    - digital silence: runs of 0.5 s or more under -90 dBFS
    - level jumps: (a) steps: the 3 s short-term loudness after a moment against the 3 s before it, |delta| >= 10 LU
      (runs merged), (b) startles: momentary (400 ms) loudness up by 20 LU or more inside 0.4 s and landing at -16 LUFS
      or louder, (c) every chapter seam: short-term 3 s before/after and momentary 1 s before/after
  video (one sequential decode of every frame): frame count and decode errors, a contact sheet (a frame every 15 s)
  and a seam sheet (the last frame of each chapter, its first frame and its frame +12), both PNG.
"""
import json, math, sys
from pathlib import Path
import av, numpy as np, pyloudnorm as pyln
from scipy.signal import lfilter
from PIL import Image, ImageDraw

mp4, planf, out = sys.argv[1], sys.argv[2], Path(sys.argv[3])
out.mkdir(parents=True, exist_ok=True)
NOVIDEO = '--no-video' in sys.argv
plan = json.load(open(planf))
FPS = plan['fps']
R = 48000
chs = plan['chapters']
clock = lambda s: f"{int(s // 60)}:{s % 60:05.2f}"

def starts_of(ep):
    o, acc, prev = [], 0.0, 0
    for b in ep['beats']:
        acc += b['reelDur']; end = max(prev + 1, round(acc * FPS)); o.append(prev); prev = end
    return o

beats = []  # (t0, t1, chapter, beat id, caption)
lines = []  # (on, end, chapter, id, text)
for c in chs:
    c0 = c['from']
    if not c.get('ep'):
        beats.append((c0 / FPS, (c0 + c['dur']) / FPS, c['id'], c['id'], c['label'])); continue
    st = starts_of(c['ep'])
    for i, b in enumerate(c['ep']['beats']):
        t0 = (c0 + st[i]) / FPS
        t1 = (c0 + (st[i + 1] if i + 1 < len(st) else c['dur'])) / FPS
        beats.append((t0, t1, c['id'], b['id'], b.get('caption', '')))
        for l in ((b.get('dlg') or {}).get('lines') or []):
            lines.append((t0 + l['t'], t0 + l['t'] + l['dur'], c['id'], l['id'], l['text']))
lines.sort()
where = lambda t: next((b for b in beats if b[0] <= t < b[1]), beats[-1])
ch_at = lambda t: next((c for c in chs if c['from'] / FPS <= t < (c['from'] + c['dur']) / FPS), chs[-1])
def bed_at(t):  # the bed that sounds at t (none under a chapter that brings its own sound: the mixer gates it off)
    c = ch_at(t)
    if c.get('bed') is False: return f"(no bed: {c['id']} plays its own sound)"
    return next((b['label'] for b in plan['beds'] if b['from'] <= t < b['to']), None)

# ------------------------------------------------------------------ audio
with av.open(mp4) as C:
    a = C.streams.audio[0]
    rs = av.AudioResampler(format='fltp', layout='stereo', rate=R)
    parts = []
    for fr in C.decode(a):
        for o in rs.resample(fr):
            parts.append(o.to_ndarray())
    for o in rs.resample(None):
        parts.append(o.to_ndarray())
x = np.concatenate(parts, axis=1).astype(np.float32)  # (2, n)
del parts
n = x.shape[1]
dur_a = n / R
M = {'file': mp4, 'audio_s': round(dur_a, 3)}
meter = pyln.Meter(R)
M['integrated_lufs'] = round(meter.integrated_loudness(x.T.astype(np.float64)), 2)
M['sample_peak_dbfs'] = round(20 * math.log10(float(np.abs(x).max()) + 1e-12), 2)
per = []
for c in chs:
    s0, s1 = int(c['from'] / FPS * R), int((c['from'] + c['dur']) / FPS * R)
    seg = x[:, s0:s1].T.astype(np.float64)
    L = meter.integrated_loudness(seg) if seg.shape[0] > R * 0.5 else float('-inf')
    per.append(dict(chapter=c['id'], start=clock(c['from'] / FPS), dur_s=round(c['dur'] / FPS, 3),
                    lufs=None if not np.isfinite(L) else round(L, 1), peak_dbfs=round(20 * math.log10(float(np.abs(seg).max()) + 1e-12), 1)))
M['chapters'] = per

# 50 ms RMS, 10 ms hop, louder channel
hop, win = R // 100, R // 20
sq = x.astype(np.float64) ** 2
cs = np.concatenate([np.zeros((2, 1)), np.cumsum(sq, axis=1)], axis=1)
idx = np.arange(0, n - win, hop)
ms = (cs[:, idx + win] - cs[:, idx]) / win
rms_db = 10 * np.log10(ms.max(axis=0) + 1e-20)
tt = (idx + win / 2) / R

def runs(mask, min_s):
    out_, i = [], 0
    m = np.concatenate([[False], mask, [False]])
    d = np.diff(m.astype(int))
    for s, e in zip(np.where(d == 1)[0], np.where(d == -1)[0]):
        t0, t1 = idx[s] / R, (idx[e - 1] + win) / R
        if t1 - t0 >= min_s: out_.append((t0, t1, s, e))
    return out_

def ctx(t0, t1):
    b = where((t0 + t1) / 2)
    prev = [l for l in lines if l[1] <= t0 + 0.05]
    nxt = [l for l in lines if l[0] >= t1 - 0.05]
    return dict(chapter=b[2], beat=b[3], caption=b[4][:140], bed=bed_at((t0 + t1) / 2),
                prev_line=f"{prev[-1][3]} ends {clock(prev[-1][1])}" if prev else None,
                next_line=f"{nxt[0][3]} at {clock(nxt[0][0])}" if nxt else None)

holes = []
for t0, t1, s, e in runs(rms_db < -42, 0.3):
    holes.append(dict(start=clock(t0), end=clock(t1), dur_s=round(t1 - t0, 2), min_dbfs=round(float(rms_db[s:e].min()), 1),
                      mean_dbfs=round(float(rms_db[s:e].mean()), 1), **ctx(t0, t1)))
M['holes_under_-42dBFS_0.3s'] = holes
M['digital_silence_0.5s'] = [dict(start=clock(t0), end=clock(t1), dur_s=round(t1 - t0, 2), **ctx(t0, t1)) for t0, t1, s, e in runs(rms_db < -90, 0.5)]

# K-weighted momentary (400 ms) and short-term (3 s) loudness, 100 ms hop
b1, a1 = [1.53512485958697, -2.69169618940638, 1.19839281085285], [1.0, -1.69065929318241, 0.73248077421585]
b2, a2 = [1.0, -2.0, 1.0], [1.0, -1.99004745483398, 0.99007225036621]
k = lfilter(b2, a2, lfilter(b1, a1, x.astype(np.float64), axis=1), axis=1)
kc = np.concatenate([np.zeros((2, 1)), np.cumsum(k ** 2, axis=1)], axis=1).sum(axis=0)
del k
H = R // 10
def loud(w):
    i = np.arange(0, n - w, H)
    return (i + w) / R, -0.691 + 10 * np.log10((kc[i + w] - kc[i]) / w + 1e-20)  # time = window END
tm_, Mo = loud(int(0.4 * R))
ts_, St = loud(3 * R)
stst = lambda t: float(np.interp(t, ts_, St))
mom = lambda t: float(np.interp(t, tm_, Mo))
steps = []
for t in np.arange(3.0, dur_a - 3.0, 0.5):
    d = stst(t + 3.0) - stst(t)  # the 3 s after t against the 3 s before t
    if abs(d) >= 10 and max(stst(t + 3.0), stst(t)) > -45:
        if steps and t - steps[-1]['_t'] <= 1.0 and np.sign(d) == np.sign(steps[-1]['delta_lu']):
            if abs(d) > abs(steps[-1]['delta_lu']): steps[-1].update(_at=t, delta_lu=round(d, 1), at=clock(t), before=round(stst(t), 1), after=round(stst(t + 3), 1), **ctx(t - 0.2, t + 0.2))
            steps[-1]['_t'] = t
        else:
            steps.append(dict(_t=t, _at=t, at=clock(t), delta_lu=round(d, 1), before=round(stst(t), 1), after=round(stst(t + 3), 1), **ctx(t - 0.2, t + 0.2)))
seam_t = [c['from'] / FPS for c in chs[1:]]
def cause(t, kind):
    if any(abs(t - q) <= 1.0 for q in seam_t): return 'chapter seam'
    if kind == 'startle':
        if any(t - 0.3 <= l[0] <= t + 0.5 for l in lines): return 'line onset'
        if any(l[0] - 0.3 <= t <= l[1] + 0.3 for l in lines): return 'a word after a pause inside a line'
    else:
        if any(t - 1.5 <= l[0] <= t + 1.5 for l in lines): return 'speech starts'
        if any(t - 1.5 <= l[1] <= t + 1.5 for l in lines): return 'speech stops'
    b0, b1 = bed_at(t - 1.0), bed_at(t + 1.0)
    return 'bed change' if b0 != b1 else 'inside one bed (SFX, music or a take)'
for s_ in steps: s_.pop('_t'); s_['cause'] = cause(s_.pop('_at'), 'step')
M['level_steps_3s_10LU'] = steps
startles = []
for i in range(4, len(Mo)):
    rise = Mo[i] - Mo[i - 4:i].min()
    if rise >= 20 and Mo[i] >= -16:
        t = tm_[i] - 0.2
        if startles and t - startles[-1]['_t'] < 1.0: continue
        startles.append(dict(_t=t, at=clock(t), rise_lu=round(float(rise), 1), to_lufs_m=round(float(Mo[i]), 1), **ctx(t - 0.2, t + 0.2)))
for s_ in startles: s_['cause'] = cause(s_.pop('_t'), 'startle')
M['startles_20LU_in_0.4s'] = startles
seams = []
for a_, b_ in zip(chs, chs[1:]):
    t = b_['from'] / FPS
    seams.append(dict(seam=f"{a_['id']} -> {b_['id']}", at=clock(t), st3_before=round(stst(t), 1), st3_after=round(stst(t + 3), 1),
                      m1_before=round(mom(t - 0.6), 1), m1_after=round(mom(t + 1.0), 1), delta_st_lu=round(stst(t + 3) - stst(t), 1)))
M['seams_audio'] = seams
del kc, cs, sq

# ------------------------------------------------------------------ video
if not NOVIDEO:
    total = plan['total']
    sheet_at = list(range(0, total, 15 * FPS))
    seam_at = []
    for c in chs[1:]:
        f = c['from']; seam_at += [f - 1, f, f + 12]
    want = set(sheet_at) | set(seam_at)
    grabs, nfr, errs = {}, 0, 0
    with av.open(mp4) as C:
        v = C.streams.video[0]
        v.thread_type = 'AUTO'; v.codec_context.thread_count = 2
        W, Hh = v.codec_context.width, v.codec_context.height
        try:
            for fr in C.decode(v):
                if nfr in want:
                    grabs[nfr] = fr.to_image().resize((320, 180), Image.BILINEAR)
                nfr += 1
        except av.AVError as e:
            errs += 1; M['decode_error'] = str(e)
    M['video'] = dict(frames=nfr, planned=total, decode_errors=errs, size=f'{W}x{Hh}', video_s=round(nfr / FPS, 3))
    def sheet(frames, cols, path, lab):
        if not frames: return
        rows = math.ceil(len(frames) / cols)
        im = Image.new('RGB', (cols * 324, rows * 200), (16, 16, 16)); d = ImageDraw.Draw(im)
        for j, f in enumerate(frames):
            x0, y0 = (j % cols) * 324 + 2, (j // cols) * 200 + 2
            if f in grabs: im.paste(grabs[f], (x0, y0))
            d.text((x0 + 2, y0 + 182), lab(f), fill=(255, 200, 80))
        im.save(path)
    sheet(sheet_at, 8, out / 'sheet.png', lambda f: f"{clock(f / FPS)} {ch_at(f / FPS)['id']}")
    sheet(seam_at, 3, out / 'seams.png', lambda f: f"f{f} {clock(f / FPS)} {ch_at(f / FPS)['id']}")
json.dump(M, open(out / 'measure-audio-video.json', 'w'), indent=1, ensure_ascii=False)
print(json.dumps({k: v for k, v in M.items() if k in ('audio_s', 'integrated_lufs', 'sample_peak_dbfs', 'video')}, indent=0))
from collections import Counter
print('step causes', Counter(s_['cause'] for s_ in steps), 'startle causes', Counter(s_['cause'] for s_ in startles))
print('holes', len(holes), 'silence', len(M['digital_silence_0.5s']), 'steps', len(steps), 'startles', len(startles))
