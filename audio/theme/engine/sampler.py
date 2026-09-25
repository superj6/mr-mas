"""WAV multisample player (VSCO 2 CE / VCSL) and SoundFont renderer (tinysoundfont).

- Sample pitch is auto-calibrated (octave naming differs between folders) and
  fine-tuned from a harmonic-product-spectrum estimate; cached in cache/calib.json.
- Loudness is normalised per sample so velocity -> level is a consistent curve
  while the velocity *layer* only changes timbre.
- Pitch shifting = polyphase resampling (scipy.resample_poly) from 44.1k to 48k.
"""
from __future__ import annotations

import glob
import json
import os
import re
from fractions import Fraction
from functools import lru_cache

import numpy as np
import soundfile as sf
from scipy import signal

from .core import SR, db, to_stereo, midi_hz

ROOT = '/home/jgon/project/art/mrmas/audio/samples/theme-pack'
GU = '/home/jgon/project/art/mrmas/audio/samples/generaluser-gs/GeneralUser-GS.sf2'
SALAMANDER = f'{ROOT}/SalamanderGrandPiano-SF2-V3+20200602/SalamanderGrandPiano-V3+20200602.sf2'
UPRIGHT_KW = f'{ROOT}/UprightPianoKW-SF2-20220221/UprightPianoKW-20220221.sf2'
CACHE = '/home/jgon/project/art/mrmas/audio/theme/cache'
os.makedirs(CACHE, exist_ok=True)

NOTE_RE = r'([A-Ga-g])(#|b)?(-?\d)'
DYN_ORDER = {'pppp': 0, 'ppp': 1, 'pp': 2, 'p': 3, 'mp': 4, 'mf': 5, 'f': 6, 'ff': 7, 'fff': 8}
PCS = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}


def parse_note(letter, acc, octv):
    pc = PCS[letter.upper()] + (1 if acc == '#' else -1 if acc == 'b' else 0)
    return 12 * (int(octv) + 1) + pc


@lru_cache(maxsize=4096)
def load_wav(path: str) -> np.ndarray:
    x, sr = sf.read(path, dtype='float32', always_2d=True)
    x = x.T
    if x.shape[0] == 1:
        x = np.repeat(x, 2, 0)
    x = x[:2]
    if sr != SR:
        f = Fraction(SR, sr).limit_denominator(1000)
        x = signal.resample_poly(x, f.numerator, f.denominator, axis=1).astype(np.float32)
    return x


def trim_lead(x: np.ndarray, thresh_db=-42.0, pre_ms=1.5) -> np.ndarray:
    a = np.abs(x).max(0)
    pk = a.max() + 1e-12
    idx = np.argmax(a > pk * db(thresh_db))
    idx = max(0, idx - int(pre_ms * SR / 1000))
    y = x[:, idx:].copy()
    k = min(48, y.shape[1])
    y[:, :k] *= np.linspace(0, 1, k)[None]
    return y


def detect_f0(x: np.ndarray, lo=25.0, hi=4200.0) -> float:
    m = x.mean(0)
    n = len(m)
    a = int(0.15 * n)
    seg = m[a:a + min(int(0.6 * SR), max(n - a, 2048))]
    if len(seg) < 2048:
        seg = m[:min(n, 16384)]
    seg = seg * np.hanning(len(seg))
    NF = 1 << 18
    S = np.abs(np.fft.rfft(seg, NF))
    fr = np.fft.rfftfreq(NF, 1 / SR)
    h = S.copy()
    for k in (2, 3, 4):
        d = S[::k]
        h[:len(d)] *= d
        h[len(d):] = 0
    i0, i1 = np.searchsorted(fr, lo), np.searchsorted(fr, hi)
    k = i0 + int(np.argmax(h[i0:i1]))
    # parabolic refine on the plain spectrum near the peak
    if 1 < k < len(S) - 1:
        y0, y1, y2 = np.log(S[k - 1] + 1e-9), np.log(S[k] + 1e-9), np.log(S[k + 1] + 1e-9)
        p = 0.5 * (y0 - y2) / (y0 - 2 * y1 + y2 + 1e-12)
        return float(fr[k] + p * (fr[1] - fr[0]))
    return float(fr[k])


def loudness_ref(x: np.ndarray, sustained: bool) -> float:
    """Max windowed RMS of the sample body (robust to slow pp attacks)."""
    m = x.mean(0)
    w = int((0.3 if sustained else 0.08) * SR)
    seg = m[:int((3.0 if sustained else 0.4) * SR)]
    if len(seg) <= w:
        return float(np.sqrt(np.mean(m ** 2)) + 1e-9)
    c = np.concatenate([[0.0], np.cumsum(seg.astype(np.float64) ** 2)])
    e = (c[w:] - c[:-w]) / w
    return float(np.sqrt(max(e.max(), 0.0)) + 1e-9)


class SampleSet:
    """A folder of samples named <...><Note><...><velocity><...>."""

    def __init__(self, name, pattern, vel_re=r'_v(\d+)', rr_re=r'rr(\d+)', dyn_names=False,
                 sustained=True, octave_fix=None, fine_tune=True, dyn_db=24.0, gain_db=0.0,
                 note_re=NOTE_RE, exclude=None, f0_range=(25, 4200), pitched=True, cents_override=None):
        self.name = name
        self.sustained = sustained
        self.dyn_db = dyn_db
        self.gain_db = gain_db
        self.pitched = pitched
        files = sorted(glob.glob(os.path.join(ROOT, pattern)))
        if exclude:
            files = [f for f in files if not re.search(exclude, os.path.basename(f))]
        self.entries = []
        for f in files:
            b = os.path.basename(f)
            if pitched:
                mm = list(re.finditer(NOTE_RE, b))
                # pick the note token that is followed by '_' (instrument names contain letters too)
                cand = [m for m in mm if re.match(r'[A-G]', m.group(1)) and (m.end() == len(b) - 4 or b[m.end()] in '_.-')]
                if not cand:
                    continue
                m = cand[0]
                note = parse_note(m.group(1), m.group(2), m.group(3))
            else:
                note = 60
            vel = 1
            if dyn_names:
                d = re.search(r'_(pppp|ppp|pp|p|mp|mf|f|ff|fff)(?=[_.\d])', b)
                vel = DYN_ORDER[d.group(1)] if d else 5
            elif vel_re:
                v = re.search(vel_re, b)
                vel = int(v.group(1)) if v else 1
            rr = re.search(rr_re, b, re.I) if rr_re else None
            self.entries.append(dict(path=f, nominal=note, vel=vel, rr=int(rr.group(1)) if rr else 1))
        if not self.entries:
            raise RuntimeError(f'no samples for {name}: {pattern}')
        self.layers = sorted({e['vel'] for e in self.entries})
        self._calibrate(octave_fix, fine_tune, f0_range)
        if cents_override is not None:
            for e in self.entries:
                e['cents'] = cents_override
        self.rr_state = {}

    # --------------------------------------------------------------- calibration
    def _calibrate(self, octave_fix, fine_tune, f0_range):
        cpath = os.path.join(CACHE, 'calib.json')
        try:
            calib = json.load(open(cpath))
        except Exception:
            calib = {}
        changed = False
        for e in self.entries:
            key = e['path'].replace(ROOT, '')
            if key not in calib or 'loud2' not in calib[key]:
                x = trim_lead(load_wav(e['path']))
                f0 = calib.get(key, {}).get('f0') if key in calib else (detect_f0(x, *f0_range) if self.pitched else 0.0)
                calib[key] = dict(f0=f0, loud2=loudness_ref(x, self.sustained))
                changed = True
            e.update(calib[key])
        if changed:
            json.dump(calib, open(cpath, 'w'))
        if not self.pitched:
            for e in self.entries:
                e['pitch'] = 60.0
                e['cents'] = 0.0
            return
        if octave_fix is None:
            diffs = []
            for e in self.entries:
                if e['f0'] > 0:
                    dm = 69 + 12 * np.log2(e['f0'] / 440.0) - e['nominal']
                    diffs.append(12 * round(dm / 12))
            octave_fix = int(np.median(diffs)) if diffs else 0
        self.octave_fix = octave_fix
        for e in self.entries:
            p = e['nominal'] + octave_fix
            if fine_tune and e['f0'] > 0:
                det = 69 + 12 * np.log2(e['f0'] / 440.0)
                if abs(det - p) < 0.45:
                    p = p + 0.0  # sample is (close to) in tune; store deviation separately
                    e['cents'] = (det - p) * 100.0
                else:
                    e['cents'] = 0.0
            else:
                e['cents'] = 0.0
            e['pitch'] = float(p)

    # --------------------------------------------------------------- selection
    def choose(self, pitch: float, vel: float, rng: np.random.Generator):
        L = len(self.layers)
        pos = np.clip(vel, 0, 0.999) * L
        li = int(pos)
        # soft boundaries so repeated notes don't lock onto one layer
        if rng.random() < 0.25 and 0 < pos - li < 0.2 and li > 0:
            li -= 1
        layer = self.layers[li]
        cands = [e for e in self.entries if e['vel'] == layer]
        best = min(abs(e['pitch'] - pitch) for e in cands)
        near = [e for e in cands if abs(e['pitch'] - pitch) - best < 1e-6]
        near.sort(key=lambda e: (e['pitch'], e['rr']))
        # all round robins of the nearest pitch
        if len(near) > 1:
            k = (near[0]['pitch'], layer)
            i = self.rr_state.get(k, int(rng.integers(0, len(near))))
            self.rr_state[k] = (i + 1) % len(near)
            return near[i % len(near)]
        return near[0]

    # --------------------------------------------------------------- render
    def render(self, pitch, vel, dur_s, rng, rel_s=0.25, att_s=0.0, offset_s=0.0,
               detune_cents=0.0, tail_s=None, gain_db=0.0, lp_hz=None, env=None, bend=None):
        e = self.choose(pitch, vel, rng)
        x = trim_lead(load_wav(e['path']))
        shift = pitch - e['pitch'] - e['cents'] / 100.0 + detune_cents / 100.0
        if abs(shift) > 1e-4:
            ratio = 2 ** (shift / 12.0)
            f = Fraction(1.0 / ratio).limit_denominator(1200)
            x = signal.resample_poly(x, f.numerator, f.denominator, axis=1).astype(np.float32)
        if bend:
            x = pitch_bend(x, bend)
        if offset_s > 0:
            x = x[:, int(offset_s * SR):]
        total = dur_s + rel_s if tail_s is None else dur_s + tail_s
        n = min(x.shape[1], int(total * SR))
        x = x[:, :n].copy()
        # release
        a = int(dur_s * SR)
        if a < n:
            r = n - a
            t = np.arange(r) / max(rel_s * SR, 1)
            x[:, a:] *= np.exp(-4.6 * t)[None].astype(np.float32)  # -40 dB at rel_s
        kf = min(240, x.shape[1])                        # 5 ms de-click where the sample is cut
        x[:, -kf:] *= np.linspace(1, 0, kf, dtype=np.float32)[None]
        if att_s > 0:
            k = min(int(att_s * SR), n)
            x[:, :k] *= (np.linspace(0, 1, k) ** 1.5)[None]
        if env is not None:
            # env: list of (seconds_from_start, gain)
            ts = [p[0] * SR for p in env]
            g = np.interp(np.arange(n), ts, [p[1] for p in env]).astype(np.float32)
            x *= g[None]
        if lp_hz:
            x = signal.sosfilt(signal.butter(2, min(lp_hz, 20000), 'low', fs=SR, output='sos'), x, axis=1)
        target = db(-self.dyn_db * (1.0 - vel)) * 0.1   # vel 1 -> -20 dBFS RMS body
        g = target / e['loud2'] * db(self.gain_db + gain_db)
        return (x * g).astype(np.float32)


def pitch_bend(x: np.ndarray, bend) -> np.ndarray:
    """Time-varying pitch bend by variable-rate reading (a player's rip / fall / scoop).
    bend = [(seconds_from_start, semitones), ...], linear between points, held after the last."""
    ts = np.array([b[0] for b in bend], dtype=np.float64)
    ss = np.array([b[1] for b in bend], dtype=np.float64)
    n_in = x.shape[1]
    # output length: enough to read the whole input at the slowest rate
    n_out = int(n_in / min(1.0, 2 ** (ss.min() / 12.0))) + 1
    t = np.arange(n_out) / SR
    ratio = 2 ** (np.interp(t, ts, ss) / 12.0)
    pos = np.concatenate([[0.0], np.cumsum(ratio)[:-1]])
    k = int(np.searchsorted(pos, n_in - 1))
    pos = pos[:k]
    idx = np.arange(n_in)
    return np.stack([np.interp(pos, idx, ch) for ch in x]).astype(np.float32)


# ------------------------------------------------------------------ SoundFonts
_SF_CACHE = {}


def render_sf2(path, bank, preset, notes, n_out, drums=False, gain_db=0.0, pedal=None, pitch_bend=None,
               chunk=256):
    """notes: list of (start_sample, end_sample, key, vel127). pedal: list of (sample, on_bool).
    Returns stereo float32 [2, n_out]."""
    import tinysoundfont
    synth = tinysoundfont.Synth(gain=gain_db, samplerate=SR)
    sfid = synth.sfload(path)
    synth.program_select(0, sfid, bank, preset, drums)
    ev = []
    for s, e, k, v in notes:
        ev.append((int(s), 1, int(k), int(v)))
        ev.append((int(e), 0, int(k), 0))
    for s, on in (pedal or []):
        ev.append((int(s), 2 if on else 3, 0, 0))
    ev.sort(key=lambda t: (t[0], t[1]))
    out = np.zeros(n_out * 2, dtype=np.float32)
    pos = 0
    i = 0
    active = {}
    while pos < n_out:
        nxt = ev[i][0] if i < len(ev) else n_out
        nxt = min(max(nxt, pos), n_out)
        if nxt > pos:
            buf = synth.generate(nxt - pos)
            out[pos * 2:nxt * 2] = np.frombuffer(buf, dtype=np.float32)
            pos = nxt
        while i < len(ev) and ev[i][0] <= pos:
            t, typ, k, v = ev[i]
            if typ == 1:
                if active.get(k, 0) > 0:
                    synth.noteoff(0, k)
                synth.noteon(0, k, max(1, min(127, v)))
                active[k] = active.get(k, 0) + 1
            elif typ == 0:
                active[k] = max(0, active.get(k, 0) - 1)
                if active[k] == 0:
                    synth.noteoff(0, k)
            elif typ == 2:
                synth.control_change(0, 64, 127)
            elif typ == 3:
                synth.control_change(0, 64, 0)
            i += 1
        if i >= len(ev) and pos < n_out:
            buf = synth.generate(n_out - pos)
            out[pos * 2:] = np.frombuffer(buf, dtype=np.float32)
            pos = n_out
    return out.reshape(-1, 2).T.copy()
