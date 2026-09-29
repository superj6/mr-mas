"""WAV multisample player (VSCO 2 CE / VCSL) and SoundFont renderer (tinysoundfont).

OST copy of audio/theme/engine/sampler.py.  Changes: two sample roots (the theme pack and the
SFX agent's extra VSCO 2 CE folders, addressed as 'sfx:<path>'), an OST-local calibration cache
(the theme folder is locked), order-independent round-robin choice (so a loop body renders
exactly like the same bars inside the full cue), and render_sf2 pitch-bend / CC support.

- Sample pitch is auto-calibrated (octave naming differs between folders) and
  fine-tuned from a harmonic-product-spectrum estimate; cached in cache/calib.json.
- Loudness is normalised per sample so velocity -> level is a consistent curve
  while the velocity *layer* only changes timbre.
- Pitch shifting = polyphase resampling (scipy.resample_poly) from 44.1k to 48k.
"""
from __future__ import annotations
import os  # noqa: E402  (phase 1: the project root is found at run time, docs/ORGANIZATION-PLAN.md §4)
import sys  # noqa: E402


def _repo():
    for start in (os.path.dirname(os.path.abspath(__file__)), os.getcwd()):
        d = start
        while True:
            if os.path.exists(os.path.join(d, '.mrmas-root')):
                return d
            if d == os.path.dirname(d):
                break
            d = os.path.dirname(d)
    sys.exit('MR. MAS: no .mrmas-root above this script or the cwd; set MRMAS_ROOT')


REPO = os.environ.get('MRMAS_ROOT') or _repo()

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

SAMPLES = os.path.join(REPO, 'audio/samples')
ROOT = f'{SAMPLES}/theme-pack'
SFX_ROOT = f'{SAMPLES}/vsco2ce-sfx'
GU = f'{SAMPLES}/generaluser-gs/GeneralUser-GS.sf2'
SALAMANDER = f'{ROOT}/SalamanderGrandPiano-SF2-V3+20200602/SalamanderGrandPiano-V3+20200602.sf2'
UPRIGHT_KW = f'{ROOT}/UprightPianoKW-SF2-20220221/UprightPianoKW-20220221.sf2'
CACHE = os.path.join(REPO, 'audio/ost/cache')
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
                 note_re=NOTE_RE, exclude=None, f0_range=(25, 4200), pitched=True, cents_override=None,
                 tuning=None, max_stretch=None):
        """tuning: {sample file name: cents} -- a MEASURED per-sample deviation from its mapped pitch (library.TUNING,
        engine/tuning.py); it replaces the automatic estimate for those files (fix 2).  max_stretch: semitones; if
        the velocity layer's nearest sample is further away than this, the nearest layer that has a sample within
        it plays instead (the level still follows the velocity; only the timbre layer changes)."""
        self.name = name
        self.tuning = dict(tuning or {})
        self.max_stretch = max_stretch
        self.sustained = sustained
        self.dyn_db = dyn_db
        self.gain_db = gain_db
        self.pitched = pitched
        self.pattern = pattern
        files = sorted(glob.glob(resolve(pattern)))
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
        for e in self.entries:
            e['cents_hps'] = e.get('cents', 0.0)
            b = os.path.basename(e['path'])
            if b in self.tuning:
                e['cents'] = float(self.tuning[b])
                e['tuned'] = True
        if cents_override is not None:
            for e in self.entries:
                e['cents'] = cents_override
        self.rr_state = {}

    # --------------------------------------------------------------- calibration
    def _calibrate(self, octave_fix, fine_tune, f0_range):
        cpath = os.path.join(CACHE, 'calib.json')
        try:
            with open(cpath) as fh:
                calib = json.load(fh)
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
            try:                                   # merge with whatever another process wrote meanwhile
                with open(cpath) as fh:
                    calib = {**json.load(fh), **calib}
            except Exception:
                pass
            tmp = f'{cpath}.{os.getpid()}.tmp'
            with open(tmp, 'w') as fh:
                json.dump(calib, fh)
            os.replace(tmp, cpath)                 # atomic: parallel renders never see a half-written file
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
        if self.max_stretch is not None and best > self.max_stretch:
            # a sparse layer (the harp's mp layer is ONE G1 sample): take the nearest layer that covers the pitch
            alt = sorted(self.layers, key=lambda L: abs(self.layers.index(L) - li))
            for L in alt:
                c2 = [e for e in self.entries if e['vel'] == L]
                b2 = min(abs(e['pitch'] - pitch) for e in c2)
                if b2 <= self.max_stretch:
                    cands, best = c2, b2
                    break
        near = [e for e in cands if abs(e['pitch'] - pitch) - best < 1e-6]
        near.sort(key=lambda e: (e['pitch'], e['rr']))
        # all round robins of the nearest pitch: picked by the note's own rng (order independent, so a
        # loop body renders the same whether or not the intro is rendered with it)
        if len(near) > 1:
            return near[int(rng.integers(0, len(near)))]
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


def resolve(pattern: str) -> str:
    """'sfx:Brass/...' -> the SFX agent's VSCO 2 CE folder; anything else is under the theme pack."""
    if pattern.startswith('sfx:'):
        return os.path.join(SFX_ROOT, pattern[4:])
    if os.path.isabs(pattern):
        return pattern
    return os.path.join(ROOT, pattern)


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


def get_synth(path, gain_db=0.0):
    """A loaded, reset tinysoundfont synth (cached per process: the Salamander SF2 is 1.27 GB and takes
    ~3 s to load; the renderer preloads it in the parent so forked workers share it copy-on-write)."""
    import tinysoundfont
    key = (path, round(float(gain_db), 3))
    if key not in _SF_CACHE:
        synth = tinysoundfont.Synth(gain=gain_db, samplerate=SR)
        _SF_CACHE[key] = (synth, synth.sfload(path))
    synth, sfid = _SF_CACHE[key]
    synth.sounds_off(0)
    synth.control_change(0, 121, 0)          # reset all controllers (pedal, expression, ...)
    synth.control_change(0, 64, 0)
    synth.control_change(0, 7, 100)
    synth.control_change(0, 11, 127)
    synth.pitchbend(0, 8192)
    synth.pitchbend_range(0, 2.0)
    synth.generate(64)                       # flush the killed voices' last block
    return synth, sfid


def render_sf2(path, bank, preset, notes, n_out, drums=False, gain_db=0.0, pedal=None, pitch_bend=None,
               chunk=256, cc=None, bend_range=2.0):
    """notes: list of (start_sample, end_sample, key, vel127). pedal: list of (sample, on_bool).
    cc: list of (sample, controller, value 0-127) (e.g. CC11 expression swells on a pad).
    pitch_bend: list of (sample, semitones) within +-bend_range.
    Returns stereo float32 [2, n_out]."""
    synth, sfid = get_synth(path, gain_db)
    synth.program_select(0, sfid, bank, preset, drums)
    # tinysoundfont ignores CC64, so the sustain pedal is emulated: a note released while the pedal is
    # down keeps sounding until the pedal comes up (a re-struck key re-triggers as on a real piano)
    ped = sorted((int(s), bool(on)) for s, on in (pedal or []))

    def held_until(e):
        down = False
        for s, on in ped:                              # pedal state at the note-off
            if s > e:
                break
            down = on
        if not down:
            return e
        for s, on in ped:                              # ...held until the next pedal-up
            if s > e and not on:
                return s
        return e + 10 * SR                             # never released: ring (the tail trim cuts it)

    ev = []
    for s, e, k, v in notes:
        ev.append((int(s), 1, int(k), int(v)))
        ev.append((int(held_until(int(e)) if ped else e), 0, int(k), 0))
    for s, c, v in (cc or []):
        ev.append((int(s), 4, int(c), int(np.clip(v, 0, 127))))
    for s, semi in (pitch_bend or []):
        ev.append((int(s), 5, 0, int(np.clip(8192 + semi / bend_range * 8192, 0, 16383))))
    if pitch_bend:
        synth.pitchbend_range(0, bend_range)
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
            elif typ == 4:
                synth.control_change(0, k, v)
            elif typ == 5:
                synth.pitchbend(0, v)
            i += 1
        if i >= len(ev) and pos < n_out:
            buf = synth.generate(n_out - pos)
            out[pos * 2:] = np.frombuffer(buf, dtype=np.float32)
            pos = n_out
    return out.reshape(-1, 2).T.copy()
