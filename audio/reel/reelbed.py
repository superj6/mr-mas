#!/usr/bin/env python
"""MR. MAS - TEMP BED for the story reels (show/reel/epNN.json -> audio/reel/epNN.wav).

One WAV per episode reel, exactly as long as the picture: the 3 s title card plus every beat, with
the same frame rounding the studio generator uses (studio/src/reel/schema.ts timeEpisode), so
the WAV has TITLE_FRAMES + beat frames samples at 48 kHz, 2000 samples per frame.

Layers (the BED = everything but the accents is levelled to -20 LUFS short-term):
  title sting  V1 "Chip Chamber Jazz" (locked main title) bar 9, the roll call: the knee
               F F F F G Ab C F in eight stabs, over the 3 s title card.             ACCENT -14
  pad          felt upright piano (the theme's UprightPianoKW SF2 + felt_post EQ), rootless
               jazz voicings in F minor, rolled and pedalled, with sparse high "glints";
               a chip pad (two band-limited pulse voices with a slow duty sweep) above it;
               from ACT TWO a triangle bass and a sparse swung chip arpeggio; in the TAG
               the chip plays the knee once, softly.  Chords move on beat changes.     BED -20
  tick         a soft chip tick on every beat change; a double tick on act changes.    BED
  setpiece     V1 brass stem card stab (f240 / f300 / f360; a key set-piece of 6 s or
               more gets the f414 rip into the f420 shout) + a chip doubling.  The pad
               moves to the stab's chord on that beat.  A setpiece that follows another
               setpiece gets a chip-only stab in the current chord.                 ACCENT -14
  card         the same stab through the theme's sample-chip (SNES) filter + chip.   ACCENT -14
  flashback    1-bit beeper arpeggio (16ths at 96 BPM, 22.254 kHz, no dynamics) on the
               current chord, under flashback beats and 1-BIT-style beats.            BED
  GLYPH        glass shimmer on chord tones (engine.synth.shimmer) + hall.            BED
  intro beat   (kind "intro", the stand-in for the 30 s main title) the V1 title section
               f630 on; the bed ducks out under it.                                  ACCENT -14

Levels: accents are each normalised to -14 LUFS momentary max (400 ms, BS.1770 K-weighted);
the bed is ridden by a slow levelling gain so its 3 s short-term loudness sits at -20 LUFS, then
dips 3 dB under accents; the sum is true-peak limited to -1 dBTP.  Deterministic per reel file.

The endgame colour (Eps 10-12): a reel whose JSON sets "extrapolated": true gets the more open,
quartal harmony, the detuned and darker chip pad, the piano's tape wow and denser shimmer.  The old
name "speculative" is still read as a fallback when "extrapolated" is absent, so the field can be
renamed in any reel without breaking it (ARC_FLAGS; "extrapolated" wins when both are present).

Usage:  audio/.venv/bin/python audio/reel/reelbed.py show/reel/ep03.json [-o out.wav] [--qa qa.json]
        audio/.venv/bin/python audio/reel/reelbed.py --check show/reel/ep*.json   (dry run: parse, no render)
        audio/.venv/bin/python audio/reel/reelbed.py --self-test                  (the flag reader's checks)
"""
from __future__ import annotations

import argparse
import json
import math
import os
import re
import sys
import time
import types

import numpy as np
import soundfile as sf
from scipy import signal
from scipy.ndimage import minimum_filter1d, uniform_filter1d

HERE = os.path.dirname(os.path.abspath(__file__))
AUDIO = os.path.dirname(HERE)
ROOT = os.path.dirname(AUDIO)
THEME = os.path.join(AUDIO, 'theme')
if THEME not in sys.path:
    sys.path.insert(0, THEME)

from engine import chip, synth                                        # noqa: E402
from engine.core import lp, hp, bp, peq, shelf, to_stereo, apply_pan, midi_hz, nm, tape  # noqa: E402
from engine.sampler import render_sf2, UPRIGHT_KW                     # noqa: E402

try:                                   # the theme's synthetic IRs; engine.mix imports pyloudnorm only
    from engine.mix import make_ir     # for its own lufs(), which this script does not use
except ImportError:
    sys.modules.setdefault('pyloudnorm', types.ModuleType('pyloudnorm'))
    from engine.mix import make_ir     # noqa: E402

VERSION = 'reelbed 1.0 (2026-09-25)'
SR = 48000
FPS = 24
SPF = SR // FPS                        # 2000 samples per frame
TITLE_FRAMES = 72                      # studio/src/reel/schema.ts TITLE_SEC * FPS
TITLE_S = TITLE_FRAMES / FPS

BED_ST = -20.0                         # LUFS short-term (3 s) target for the bed
ACCENT_M = -14.0                       # LUFS momentary max (400 ms) per accent
TICK_PEAK = -22.0                      # dBFS sample peak of one tick (soft); the act-change double: +1 dB
ACCENT_TP = -3.0                       # dBTP cap per accent (the final limiter is only a safety)
TP_CEIL = -1.0                         # dBTP
INTRO_DUCK = -12.0                     # dB, the bed under the V1 title excerpt on an intro beat
BEAT = 60.0 / 96.0                     # the theme's tempo: 96 BPM, 15 frames per beat
SWING = 10.0 / 24.0                    # swung 2nd eighth = beat + 10 frames

V1_MASTER = os.path.join(THEME, 'theme-V1-chipchamber.wav')
V1_BRASS = os.path.join(THEME, 'stems', 'V1-brass.wav')

# ------------------------------------------------------------------------------------------------
# reel parsing: a Python mirror of studio/src/reel/schema.ts (normalizeEpisode + timeEpisode)
# ------------------------------------------------------------------------------------------------
KINDS = ['scene', 'montage', 'flashback', 'plan', 'setpiece', 'card', 'intro']
KIND_ALIAS = {'setpiece': 'setpiece', 'set': 'setpiece', 'fb': 'flashback', 'flash': 'flashback',
              'memory': 'flashback', 'theplan': 'plan', 'explainer': 'plan', 'titlecard': 'card',
              'chyron': 'card', 'text': 'card', 'maintitle': 'intro'}
FXS = ['freeze', 'flash', 'glyph-dissolve', 'shake', 'pop', 'rain', 'rewind', 'split']
FX_ALIAS = {'freezeframe': 'freeze', 'frozen': 'freeze', 'whiteflash': 'flash', 'glyph': 'glyph-dissolve',
            'dissolve': 'glyph-dissolve', 'glyphdissolve': 'glyph-dissolve', 'quake': 'shake',
            'camerashake': 'shake', 'popin': 'pop', 'tilerain': 'rain', 'tiles': 'rain', 'rewind': 'rewind',
            'vhs': 'rewind', 'splitscreen': 'split'}
ACT_ALIAS = {
    'INTRO': 'INTRO', 'MAINTITLE': 'INTRO', 'TITLES': 'INTRO', 'OPENINGTITLES': 'INTRO',
    'COLDOPEN': 'COLD OPEN', 'OPEN': 'COLD OPEN', 'TEASER': 'COLD OPEN', 'PROLOGUE': 'COLD OPEN',
    'ACTONE': 'ACT ONE', 'ACT1': 'ACT ONE', 'ACTI': 'ACT ONE', 'A1': 'ACT ONE',
    'ACTTWO': 'ACT TWO', 'ACT2': 'ACT TWO', 'ACTII': 'ACT TWO', 'A2': 'ACT TWO',
    'ACTTHREE': 'ACT THREE', 'ACT3': 'ACT THREE', 'ACTIII': 'ACT THREE', 'A3': 'ACT THREE',
    'ACTFOUR': 'ACT FOUR', 'ACT4': 'ACT FOUR', 'ACTIV': 'ACT FOUR', 'A4': 'ACT FOUR',
    'ACTFIVE': 'ACT FIVE', 'ACT5': 'ACT FIVE', 'ACTV': 'ACT FIVE', 'A5': 'ACT FIVE',
    'TAG': 'TAG', 'BUTTON': 'TAG', 'STINGER': 'TAG', 'CODA': 'TAG', 'EPILOGUE': 'TAG', 'CREDITS': 'CREDITS',
    'ENDCREDITS': 'CREDITS',
}


def _str(v):
    if isinstance(v, bool):
        return ''
    if isinstance(v, str):
        return v
    if isinstance(v, (int, float)):
        return str(v)
    return ''


def _num(v):
    if isinstance(v, bool):
        return None
    if isinstance(v, (int, float)) and math.isfinite(v):
        return float(v)
    if isinstance(v, str) and v.strip():
        try:
            f = float(v)
            return f if math.isfinite(f) else None
        except ValueError:
            return None
    return None


def _arr(v):
    if isinstance(v, list):
        return v
    return [] if v is None or v == '' else [v]


def _squash(v):
    return re.sub(r'[^A-Z0-9]', '', _str(v).upper())


def _pick(v, lst, alias, dflt):
    raw = _str(v).lower().strip()
    if raw in lst:
        return raw
    k = re.sub(r'[^a-z0-9]', '', raw)
    if k in alias:
        return alias[k]
    for x in lst:
        if re.sub(r'[^a-z0-9]', '', x) == k:
            return x
    return dflt


def _style(v):
    k = _squash(v)
    if not k:
        return 'BASE'
    if k.startswith('1BIT') or k.startswith('ONEBIT') or k == 'PAPER':
        return '1-BIT'
    if k.startswith('EARLYWEB') or k.startswith('EW16') or k == 'EW' or k.startswith('WEB16'):
        return 'EARLY-WEB16'
    if k.startswith('GLYPH'):
        return 'GLYPH'
    if k.startswith('LEDGER'):
        return 'LEDGER'
    if k.startswith('TERM') or k.startswith('CLI') or k.startswith('CRT'):
        return 'TERMINAL'
    if k.startswith('2TONE') or k.startswith('TWOTONE') or k.startswith('FREEZE'):
        return '2-TONE'
    return 'BASE'


def _act(v, prev):
    k = _squash(v)
    if not k:
        return prev
    return ACT_ALIAS.get(k, _str(v).upper().strip())


def _js_round(x):
    return int(math.floor(x + 0.5))


# The episode-level flag that gives Eps 10-12 their endgame colour, in precedence order: the current
# name first, then the old one (read only when the current name is absent from the reel JSON).
ARC_FLAGS = ('extrapolated', 'speculative')


def _truthy(v):
    """The reel schema's boolean: true, or the string "true" (any case)."""
    return v is True or (isinstance(v, str) and v.strip().lower() == 'true')


def arc_flag(o):
    """-> (extrapolated: bool, source key or None).  The first ARC_FLAGS key present in the reel wins."""
    if isinstance(o, dict):
        for k in ARC_FLAGS:
            if k in o:
                return _truthy(o[k]), k
    return False, None


def load_reel(path):
    """-> dict(key, episode, title, extrapolated, extrapolated_from, beats=[...], frames, samples, error)."""
    key = os.path.splitext(os.path.basename(path))[0]
    err = None
    try:
        with open(path, encoding='utf-8') as f:
            raw = json.load(f)
    except Exception as e:                       # the generator shows an error card; so do we
        raw, err = {}, f'{type(e).__name__}: {e}'
    o = raw if isinstance(raw, dict) else {}
    m = re.search(r'(\d+)', key)
    ep_no = _num(o.get('episode'))
    ep_no = int(ep_no) if ep_no is not None else (int(m.group(1)) if m else None)
    beats, prev_act = [], 'COLD OPEN'
    for i, b in enumerate(_arr(o.get('beats'))):
        b = b if isinstance(b, dict) else {'caption': _str(b)}
        reel = _num(b.get('reelDur', b.get('dur', b.get('duration'))))
        act = _act(b.get('act'), prev_act)
        prev_act = act
        fx = []
        for x in _arr(b.get('fx')):
            p = _pick(x, FXS, FX_ALIAS, '')
            if p in FXS and p not in fx:
                fx.append(p)
        beats.append(dict(idx=i, id=_str(b.get('id')) or f'{ep_no}.{i + 1:02d}', act=act,
                          kind=_pick(b.get('kind'), KINDS, KIND_ALIAS, 'scene'), style=_style(b.get('style')),
                          reelDur=3.0 if reel is None or reel <= 0 else max(0.5, min(120.0, reel)), fx=fx))
    if not beats:
        beats.append(dict(idx=0, id=f'{ep_no}.01', act='COLD OPEN', kind='card', style='BASE', reelDur=4.0, fx=[]))
    # timeEpisode: cumulative rounding, every beat at least one frame
    acc, prev = 0.0, TITLE_FRAMES
    for b in beats:
        acc += b['reelDur']
        end = max(prev + 1, TITLE_FRAMES + _js_round(acc * FPS))
        b['f0'], b['f1'] = prev, end
        b['t0'], b['t1'] = prev / FPS, end / FPS
        prev = end
    extrap, extrap_from = arc_flag(o)
    return dict(key=key, path=path, episode=ep_no, title=_str(o.get('title')) or key,
                extrapolated=extrap, extrapolated_from=extrap_from,
                beats=beats, frames=prev, samples=prev * SPF,
                error=err or (_str(o.get('_error')) or None))


# ------------------------------------------------------------------------------------------------
# loudness (ITU-R BS.1770-4, 48 kHz K-filter from the standard) and peaks
# ------------------------------------------------------------------------------------------------
_K1 = ([1.53512485958697, -2.69169618940638, 1.19839281085285], [1.0, -1.69065929318241, 0.73248077421585])
_K2 = ([1.0, -2.0, 1.0], [1.0, -1.99004745483398, 0.99007225036621])
_KSOS = np.array([_K1[0] + _K1[1], _K2[0] + _K2[1]])


def kpower(x):
    """K-weighted power, summed over channels (L, R weights 1), per sample."""
    k = signal.sosfilt(_KSOS, np.asarray(x, np.float64), axis=-1)
    return (k ** 2).sum(axis=0)


def _cum(p):
    return np.concatenate([[0.0], np.cumsum(p)])


def win_loud(c, a, b):
    """Mean-square loudness (LUFS) of [a, b) samples from a cumulative K-power array."""
    a, b = max(0, int(a)), min(len(c) - 1, int(b))
    if b <= a:
        return -120.0
    return float(-0.691 + 10 * np.log10((c[b] - c[a]) / (b - a) + 1e-20))


def curve(x, win_s, hop_s=0.05, centered=False, c=None):
    """(times, LUFS) of an ungated K-weighted loudness window; trailing (a meter) or centered."""
    c = _cum(kpower(x)) if c is None else c
    n = len(c) - 1
    w = int(win_s * SR)
    ts = np.arange(0.0, n / SR + 1e-9, hop_s)
    e = np.minimum((ts * SR).astype(np.int64) + (w // 2 if centered else 0), n)
    s = np.maximum(e - w, 0)
    ms = (c[e] - c[s]) / w
    return ts, -0.691 + 10 * np.log10(ms + 1e-20)


def momentary_max(x):
    _, m = curve(x, 0.4, hop_s=0.01)
    return float(m.max())


def integrated(x, c=None):
    """Gated integrated loudness (400 ms blocks, 100 ms hop, -70 absolute, -10 relative)."""
    c = _cum(kpower(x)) if c is None else c
    blk, hop = int(0.4 * SR), int(0.1 * SR)
    n = len(c) - 1
    if n < blk:
        return -120.0
    idx = np.arange((n - blk) // hop + 1) * hop
    z = (c[idx + blk] - c[idx]) / blk
    l = -0.691 + 10 * np.log10(z + 1e-20)
    g1 = l > -70
    if not g1.any():
        return -120.0
    lr = -0.691 + 10 * np.log10(z[g1].mean()) - 10
    g2 = g1 & (l > lr)
    return float(-0.691 + 10 * np.log10(z[g2].mean()))


def true_peak_env(x, os_=4):
    y = np.abs(signal.resample_poly(x, os_, 1, axis=-1, window=('kaiser', 10.0))).max(axis=0)
    return y[:x.shape[1] * os_].reshape(-1, os_).max(axis=1)


def db(v):
    return 10.0 ** (v / 20.0)


def todb(v):
    return 20.0 * np.log10(np.maximum(np.abs(v), 1e-12))


def true_peak_env_chunked(x, block=SR * 10, pad=2048):
    out = np.empty(x.shape[1])
    for a in range(0, x.shape[1], block):
        b = min(x.shape[1], a + block)
        a0, b0 = max(0, a - pad), min(x.shape[1], b + pad)
        e = true_peak_env(x[:, a0:b0])
        out[a:b] = e[a - a0:a - a0 + (b - a)]
    return out


def limiter(x, ceil_db=TP_CEIL, look_ms=10.0):
    """Safety true-peak brickwall.  A centred min-filter over 2L+1 samples then a (2L+1) Hann average:
    every sample of the average is a minimum over a window that contains the current sample, so the
    gain never exceeds what the current sample needs; attack and release are L each."""
    env = true_peak_env_chunked(x)
    need = np.minimum(1.0, db(ceil_db) / np.maximum(env, 1e-12))
    if need.min() >= 1.0:
        return x, 0.0
    L = int(look_ms * 1e-3 * SR)
    g = minimum_filter1d(need, size=2 * L + 1, mode='nearest')
    w = np.hanning(2 * L + 3)[1:-1]
    g = np.pad(g, (L, L), mode='edge')                      # edge-extend: no dip at the file ends
    g = np.minimum(np.convolve(g, w / w.sum(), mode='valid'), need)
    return (x * g[None]).astype(np.float32), float(todb(g.min()))


# ------------------------------------------------------------------------------------------------
# helpers
# ------------------------------------------------------------------------------------------------
def s2n(t):
    return int(round(t * SR))


def add_at(buf, x, start):
    x = to_stereo(x)
    if start >= buf.shape[1] or start + x.shape[1] <= 0:
        return
    s0 = max(start, 0)
    x0 = s0 - start
    n = min(x.shape[1] - x0, buf.shape[1] - s0)
    if n > 0:
        buf[:, s0:s0 + n] += x[:, x0:x0 + n]


def raised(n):
    t = np.linspace(0.0, 1.0, max(n, 1))
    return 0.5 - 0.5 * np.cos(np.pi * t)


def env_ar(n, att_s, rel_s, gate_n=None):
    """Raised-cosine attack, hold, raised-cosine release ending at n (gate_n = release start)."""
    e = np.ones(n, np.float32)
    a = min(n, max(1, s2n(att_s)))
    e[:a] = raised(a)
    g = n - max(1, s2n(rel_s)) if gate_n is None else min(gate_n, n)
    r = n - g
    if r > 0:
        e[g:] *= raised(r)[::-1]
    return e


def reverb(x, kind='hall'):
    ir = make_ir(kind)
    x = to_stereo(x)
    out = np.stack([signal.oaconvolve(x[c], ir[c])[:x.shape[1]] for c in range(2)])
    return (out * 0.85 + 0.15 * out[::-1]).astype(np.float32)


def normalise_to(x, target, measure):
    lv = measure(x)
    if lv < -100:
        return x, lv
    return (x * db(target - lv)).astype(np.float32), lv


def pc(name):
    """Pitch class of a note name without octave ('Ab' -> 8)."""
    return nm(name + '4') % 12


def in_range(pcs, lo, hi):
    """All MIDI notes with these pitch classes in [lo, hi)."""
    return [m for m in range(lo, hi) if m % 12 in pcs]


# ------------------------------------------------------------------------------------------------
# harmony: F minor, the theme's jazz world (card-hit voicings from theme/score/common.py HITS)
# ------------------------------------------------------------------------------------------------
CHORDS = {
    'Fm9':       dict(bass='F2',  piano=['Ab3', 'C4', 'Eb4', 'G4'],  tones=['F', 'Ab', 'C', 'Eb', 'G']),
    'Fm11':      dict(bass='F2',  piano=['Ab3', 'Bb3', 'Eb4', 'G4'], tones=['F', 'Ab', 'Bb', 'C', 'Eb', 'G'], stab=240),
    'Dbmaj9#11': dict(bass='Db2', piano=['F3', 'G3', 'C4', 'Eb4'],   tones=['Db', 'F', 'G', 'Ab', 'C', 'Eb'], stab=300),
    'Bbm9':      dict(bass='Bb1', piano=['Ab3', 'C4', 'Db4', 'F4'],  tones=['Bb', 'Db', 'F', 'Ab', 'C'], stab=360),
    'C7#9b13':   dict(bass='C2',  piano=['E3', 'Bb3', 'Eb4', 'Ab4'], tones=['C', 'E', 'Bb', 'Eb', 'Ab'], stab=420),
    'Abmaj9':    dict(bass='Ab1', piano=['G3', 'Bb3', 'C4', 'Eb4'],  tones=['Ab', 'C', 'Eb', 'G', 'Bb']),
    'Eb9sus4':   dict(bass='Eb2', piano=['Ab3', 'Bb3', 'Db4', 'F4'], tones=['Eb', 'Ab', 'Bb', 'Db', 'F']),
    'Gm7b5':     dict(bass='G1',  piano=['F3', 'Bb3', 'C4', 'Db4'],  tones=['G', 'Bb', 'Db', 'F', 'C']),
    'Db69#11':   dict(bass='Db2', piano=['F3', 'Bb3', 'Eb4', 'G4'],  tones=['Db', 'F', 'Bb', 'Eb', 'G']),
    # the title chord: F9sus4, quartal, NO third (theme SCRIPT v2.1)
    'F9sus4':    dict(bass='F2',  piano=['Bb3', 'Eb4', 'G4', 'C5'],  tones=['F', 'G', 'Bb', 'C', 'Eb']),
}
MOVES = {
    'Fm9': ['Dbmaj9#11', 'Bbm9', 'Abmaj9', 'Gm7b5', 'Eb9sus4'],
    'Fm11': ['Bbm9', 'Dbmaj9#11', 'Eb9sus4', 'Abmaj9'],
    'Bbm9': ['Eb9sus4', 'Gm7b5', 'Fm9', 'Dbmaj9#11'],
    'Eb9sus4': ['Abmaj9', 'Dbmaj9#11', 'Fm11', 'Db69#11'],
    'Abmaj9': ['Dbmaj9#11', 'Gm7b5', 'Bbm9', 'Db69#11'],
    'Dbmaj9#11': ['Gm7b5', 'Bbm9', 'Fm9', 'Eb9sus4'],
    'Gm7b5': ['C7#9b13'],
    'C7#9b13': ['Fm9', 'Fm11'],
    'Db69#11': ['C7#9b13', 'Fm9', 'Gm7b5'],
    'F9sus4': ['Dbmaj9#11', 'Db69#11', 'Fm9'],
}
# eps 10-12 (extrapolated): more open, quartal, fewer resolutions
MOVES_EXTRAP = {
    'Fm9': ['F9sus4', 'Db69#11', 'Bbm9', 'Dbmaj9#11'],
    'Fm11': ['F9sus4', 'Db69#11', 'Eb9sus4'],
    'Bbm9': ['Eb9sus4', 'F9sus4', 'Db69#11'],
    'Eb9sus4': ['F9sus4', 'Db69#11', 'Abmaj9'],
    'Abmaj9': ['Db69#11', 'F9sus4', 'Bbm9'],
    'Dbmaj9#11': ['F9sus4', 'Eb9sus4', 'Bbm9', 'Gm7b5'],
    'Gm7b5': ['C7#9b13', 'F9sus4'],
    'C7#9b13': ['F9sus4', 'Fm11'],
    'Db69#11': ['F9sus4', 'Eb9sus4', 'Gm7b5'],
    'F9sus4': ['Db69#11', 'Dbmaj9#11', 'Bbm9', 'Eb9sus4'],
}
ACT_HOME = {'COLD OPEN': 'Fm9', 'ACT ONE': 'Fm11', 'ACT TWO': 'Dbmaj9#11', 'ACT THREE': 'Bbm9',
            'ACT FOUR': 'Fm9', 'ACT FIVE': 'Abmaj9', 'TAG': 'Fm9', 'CREDITS': 'F9sus4'}
ACT_MIN = {'COLD OPEN': 6.0, 'ACT ONE': 5.0, 'ACT TWO': 4.5, 'ACT THREE': 4.0, 'ACT FOUR': 4.0,
           'ACT FIVE': 4.0, 'TAG': 5.0, 'CREDITS': 8.0}
# how busy the pad is per act: (glint gap s, arpeggio probability per eighth, triangle bass on)
ACT_DENS = {'COLD OPEN': (3.4, 0.0, False), 'ACT ONE': (2.8, 0.0, False), 'ACT TWO': (2.4, 0.30, True),
            'ACT THREE': (2.1, 0.40, True), 'ACT FOUR': (2.0, 0.46, True), 'ACT FIVE': (2.0, 0.46, True),
            'TAG': (3.0, 0.0, False), 'CREDITS': (4.0, 0.0, False), 'INTRO': (3.0, 0.0, False)}
# the V1 card-hit stab voicings' top two voices (theme/score/common.py HITS[...]['stab'])
STAB_TOP = {240: ('C5', 'Bb4'), 300: ('Eb5', 'C5'), 360: ('F5', 'C5'), 420: ('Ab5', 'Eb5')}
KNEE = ['F5', 'F5', 'F5', 'F5', 'G5', 'Ab5', 'C6', 'F6']
BIG_SETPIECE_S = 6.0                    # a key set-piece (6-9 s) gets the f414 rip into the f420 shout


def chord_tones(name, lo, hi):
    return in_range({pc(t) for t in CHORDS[name]['tones']}, lo, hi)


def plan(reel, rng):
    """Walk the beats: chord segments and accents.  Returns (segments, accents)."""
    beats = reel['beats']
    moves = MOVES_EXTRAP if reel['extrapolated'] else MOVES
    segs = []                              # dict(t0, t1, chord, act)
    accents = []                           # dict(t, kind, ...)
    cur, last_change, stab_i = None, -1e9, int(rng.integers(0, 3))
    resolve_next = False
    prev_kind, prev_act = None, None

    def change(t, name, act):
        nonlocal cur, last_change
        if segs:
            segs[-1]['t1'] = t
        segs.append(dict(t0=t, t1=None, chord=name, act=act))
        cur, last_change = name, t

    for i, b in enumerate(beats):
        t, act, kind = b['t0'], b['act'], b['kind']
        since = t - last_change
        big = kind == 'setpiece' and b['reelDur'] >= BIG_SETPIECE_S
        run = kind == 'setpiece' and prev_kind == 'setpiece' and not big
        target = None
        if kind in ('setpiece', 'card') and not run and since >= 1.5:
            if big and cur != 'C7#9b13':
                target = 'C7#9b13'
            else:
                opts = ['Fm11', 'Dbmaj9#11', 'Bbm9']
                target = opts[stab_i % 3]
                if target == cur:
                    stab_i += 1
                    target = opts[stab_i % 3]
                stab_i += 1
            change(t, target, act)
            resolve_next = target == 'C7#9b13'
            accents.append(dict(t=t, kind='brass' if kind == 'setpiece' else 'card', chord=target,
                                hit=CHORDS[target]['stab'], beat=b['id']))
        else:
            if kind in ('setpiece', 'card'):
                accents.append(dict(t=t, kind='chip', chord=None, beat=b['id']))   # chord filled below
            if kind == 'intro':
                # the V1 title excerpt sits on the title chord (F9sus4, no third): so does the bed under it
                accents.append(dict(t=t, kind='intro', dur=b['t1'] - b['t0'], beat=b['id']))
                if cur != 'F9sus4':
                    change(t, 'F9sus4', act)
                resolve_next = False
            elif cur is None:
                change(t, ACT_HOME.get(act, 'Fm9'), act)
            elif (act != prev_act and act not in ('INTRO',) and since >= 1.5) or \
                    (prev_kind == 'intro' and kind != 'intro'):
                home = ACT_HOME.get(act, 'Fm9')
                if home == cur:
                    home = moves[cur][int(rng.integers(0, len(moves[cur])))]
                change(t, home, act)
                resolve_next = False
            elif resolve_next and since >= 2.0:
                change(t, 'F9sus4' if reel['extrapolated'] else ('Fm9' if rng.random() < 0.6 else 'Fm11'), act)
                resolve_next = False
            elif since >= ACT_MIN.get(act, 5.0) and kind != 'intro':
                opts = moves[cur]
                nxt = opts[int(rng.integers(0, len(opts)))]
                change(t, nxt, act)
                resolve_next = nxt == 'C7#9b13'
        prev_kind, prev_act = kind, act
    # bookend: the last beat lands on the title chord (no third) unless it carries an accent chord
    lb = beats[-1]
    if segs and cur not in ('F9sus4',) and not any(a['t'] == lb['t0'] and a.get('hit') for a in accents):
        if lb['t0'] - last_change >= 1.5:
            change(lb['t0'], 'F9sus4', lb['act'])
    segs[-1]['t1'] = reel['samples'] / SR
    for a in accents:
        if a.get('chord') is None:
            a['chord'] = chord_at(segs, a['t'])
    return segs, accents


def chord_at(segs, t):
    for s in segs:
        if s['t0'] <= t + 1e-9 < s['t1']:
            return s['chord']
    return segs[-1]['chord'] if t >= segs[-1]['t0'] else segs[0]['chord']


def act_at(beats, t):
    for b in beats:
        if b['t0'] <= t + 1e-9 < b['t1']:
            return b['act']
    return beats[-1]['act']


def regions(beats, pred):
    """Merge consecutive beats matching pred into (t0, t1) regions."""
    out = []
    for b in beats:
        if pred(b):
            if out and abs(out[-1][1] - b['t0']) < 1e-9:
                out[-1][1] = b['t1']
            else:
                out.append([b['t0'], b['t1']])
    return [tuple(r) for r in out]


# ------------------------------------------------------------------------------------------------
# layers
# ------------------------------------------------------------------------------------------------
def squash(x, ratio=3.0, att_ms=12.0, rel_ms=280.0, thr_pct=45.0):
    """Slow RMS compressor (linked stereo): fast rise / slow fall detector, threshold at a percentile of
    the layer's own active level, so pedalled chords read as a sustained pad under the strikes."""
    p = (np.asarray(x, np.float64) ** 2).mean(axis=0)
    aa, ar = math.exp(-1.0 / (att_ms * 1e-3 * SR)), math.exp(-1.0 / (rel_ms * 1e-3 * SR))
    env = np.maximum(signal.lfilter([1 - aa], [1, -aa], p), signal.lfilter([1 - ar], [1, -ar], p))
    lv = 10 * np.log10(env + 1e-20)
    act = lv > lv.max() - 60
    if not act.any():
        return x
    thr = float(np.percentile(lv[act], thr_pct))
    gr = np.where(lv > thr, (thr - lv) * (1.0 - 1.0 / ratio), 0.0)
    gr = uniform_filter1d(gr, size=s2n(0.004), mode='nearest')
    return (x * db(gr)[None]).astype(np.float32)


def felt_post(buf):                     # theme/score/common.py felt_post
    buf = hp(buf, 45, 2)
    buf = lp(buf, 3200, 2)
    buf = peq(buf, 220, 2.0, 0.8)
    return shelf(buf, 5000, -4, True)


def layer_piano(reel, segs, n, rng, mute):
    notes, pedal = [], []
    beats = reel['beats']
    for s in segs:
        t0, t1 = s['t0'], s['t1']
        if t1 - t0 < 0.3 or mute(t0 + 0.05):
            continue
        c = CHORDS[s['chord']]
        off = max(t0 + 0.25, t1 - 0.035)                   # every key up before the pedal lifts,
        pedal += [(s2n(t0 + 0.04), True), (s2n(off + 0.02), False)]   # re-pedal after the old chord
        notes.append((s2n(t0), s2n(off), nm(c['bass']), int(rng.integers(30, 37))))
        roll = float(rng.uniform(0.06, 0.14))
        for j, p in enumerate(c['piano']):
            notes.append((s2n(t0 + 0.03 + j * roll), s2n(off), nm(p), int(rng.integers(26, 36))))
        # evolving: sparse high glints from the chord's colour tones
        gap = ACT_DENS.get(s['act'], (3.0, 0, False))[0]
        hi = chord_tones(s['chord'], 72, 82 if not reel['extrapolated'] else 89)
        t = t0 + float(rng.uniform(1.2, 2.2))
        while t < t1 - 0.7:
            if not mute(t):
                p = int(hi[int(rng.integers(0, len(hi)))])
                notes.append((s2n(t), s2n(min(t + 1.0, off)), p, int(rng.integers(22, 33))))
                if rng.random() < 0.28:            # a two-note answer, a swung eighth later
                    q = int(hi[int(rng.integers(0, len(hi)))])
                    notes.append((s2n(t + SWING), s2n(min(t + SWING + 0.8, off)), q, int(rng.integers(20, 30))))
            t += gap * float(rng.uniform(0.75, 1.3))
    if not notes:
        return np.zeros((2, n), np.float32)
    y = render_sf2(UPRIGHT_KW, 0, 0, notes, n, gain_db=0.0, pedal=pedal)
    y = squash(felt_post(y), ratio=3.0)      # even out strike vs. pedalled decay: it is a pad, not a solo
    if reel['extrapolated']:                 # eps 10-12: the room is not quite in tune any more
        y = tape(y, drive=0.4, wow_cents=7.0, wow_hz=0.23, flutter_cents=1.0, seed=reel['episode'] or 0)
    y = apply_pan(y, -0.05, 0.8)
    return (y + db(-11) * reverb(y, 'hall') + db(-15) * reverb(y, 'room')).astype(np.float32)


def layer_chip_pad(reel, segs, n, rng, mute):
    y = np.zeros((2, n), np.float32)
    lp_hz = 1300 if reel['extrapolated'] else 1800
    for s in segs:
        t0, t1 = s['t0'], s['t1']
        if t1 - t0 < 0.3:
            continue
        c = CHORDS[s['chord']]
        pv = [nm(c['piano'][1]) + 12, nm(c['piano'][3]) + 12]
        pv = [p - 12 if p > 79 else p for p in pv]
        dur = t1 - t0 + 0.9
        for k, p in enumerate(pv):
            det = (4.0 if k else -4.0) + (float(rng.normal(0, 3)) if reel['extrapolated'] else 0.0)
            v = chip.pulse(p + det / 100.0, dur, duty=0.5, duty_to=float(rng.uniform(0.22, 0.34)), max_hz=5200,
                           tilt=-3.0, vib_cents=5.0, vib_hz=4.6, vib_delay=0.9)
            m = len(v)
            tt = np.arange(m) / SR
            breath = 1.0 + 0.16 * np.sin(2 * np.pi * float(rng.uniform(0.06, 0.12)) * tt + float(rng.uniform(0, 6.3)))
            v = v * env_ar(m, 0.6, 0.9) * breath
            add_at(y, apply_pan(v.astype(np.float32), -0.35 if k == 0 else 0.35), s2n(t0))
    y = lp(y, lp_hz, 2)
    return (y + db(-10) * reverb(y, 'hall')).astype(np.float32)


def layer_tri_bass(reel, segs, n, rng, mute):
    y = np.zeros((2, n), np.float32)
    for s in segs:
        if not ACT_DENS.get(s['act'], (0, 0, False))[2] or s['t1'] - s['t0'] < 0.5:
            continue
        p = nm(CHORDS[s['chord']]['bass'])
        p = p + 12 if p < 36 else p
        dur = s['t1'] - s['t0'] + 0.4
        v = chip.triangle(p, dur) * env_ar(int(dur * SR), 0.25, 0.45)
        add_at(y, v[None].repeat(2, 0), s2n(s['t0']))
    return lp(y, 650, 2).astype(np.float32)


def _chip_note(p, dur, duty=0.125, level=1.0, gate=None):
    v = chip.pulse(p, dur, duty=duty, max_hz=9000, tilt=-1.5)
    e = chip.stepped_env(len(v), att=0.002, dec=0.12, sus=0.3, rel=0.06, gate_s=gate if gate else dur * 0.6)
    return (v * e * level).astype(np.float32)


def pad_tail(x, tail_s):
    x = to_stereo(x)
    return np.concatenate([x, np.zeros((2, s2n(tail_s)), np.float32)], axis=1)


def chipfx(x, tail_s=0.8, store_rate=16000, echo_fb=0.3, echo_mix=0.28, brr=False, mono=False):
    """The theme's sample-chip (SNES) treatment with its 144 ms echo; pads first so echoes ring out."""
    return chip.sample_chip(pad_tail(x, tail_s), store_rate=store_rate, brr=brr, echo_ms=144, echo_fb=echo_fb,
                            echo_mix=echo_mix, mono=mono).astype(np.float32)


def span(y, thresh=1e-7):
    """First and last+1 sample where a stereo buffer is non-silent (None if silent)."""
    nz = np.flatnonzero(np.abs(y).max(axis=0) > thresh)
    return (int(nz[0]), int(nz[-1]) + 1) if len(nz) else None


def layer_arp(reel, segs, n, rng, mute):
    """Sparse swung chip arpeggio on the theme's grid (96 BPM), acts TWO onwards."""
    y = np.zeros((2, n), np.float32)
    beats = reel['beats']
    t = TITLE_S
    step = 0
    end = n / SR - 1.0
    while t < end:
        for off in (0.0, SWING):
            tt = t + off
            act = act_at(beats, tt)
            prob = ACT_DENS.get(act, (0, 0.0, False))[1]
            if prob > 0 and not mute(tt) and rng.random() < prob:
                tones = chord_tones(chord_at(segs, tt), 72, 86)
                p = tones[step % len(tones)]
                step += int(rng.integers(1, 3))
                v = _chip_note(p, 0.16, duty=0.125, level=float(rng.uniform(0.55, 0.85)), gate=0.07)
                add_at(y, apply_pan(v, float(rng.uniform(-0.4, 0.4))), s2n(tt))
        t += BEAT
    sp = span(y)
    if sp:
        a, b = sp
        z = lp(chipfx(y[:, a:b], 0.8, echo_mix=0.3), 4200, 2)
        m = min(z.shape[1], n - a)
        y[:, a:] = 0.0
        y[:, a:a + m] = z[:, :m]
    return y


def layer_knee(reel, segs, n, rng, mute, accents):
    """The TAG: the chip plays the knee once, softly (the main title's hook, eighths at 96 BPM)."""
    y = np.zeros((2, n), np.float32)
    tag = [b for b in reel['beats'] if b['act'] == 'TAG']
    if not tag:
        return y
    t0, t1 = tag[0]['t0'], tag[-1]['t1']
    if any(abs(a['t'] - t0) < 0.05 for a in accents):
        t0 += 0.6
    if t1 - t0 < 3.0:
        return y
    t0 += 0.35
    e8 = BEAT / 2
    loc = np.zeros((2, s2n(e8 * 8 + 2.0)), np.float32)
    for i, name in enumerate(KNEE):
        last = i == len(KNEE) - 1
        d = 1.4 if last else e8 * 0.9
        v = _chip_note(nm(name), d + 0.3, duty=0.25, level=0.8, gate=d)
        w = chip.triangle(nm(name) - 12, d + 0.3) * chip.stepped_env(int((d + 0.3) * SR), 0.002, 0.2, 0.4, 0.08,
                                                                    gate_s=d) * 0.5
        add_at(loc, apply_pan(v + w.astype(np.float32), 0.1), s2n(i * e8))
    loc = lp(chipfx(loc, 0.8, echo_mix=0.28), 5000, 2)
    add_at(y, loc.astype(np.float32), s2n(t0))
    return y


def layer_beeper(reel, segs, n, rng, regs):
    """1-bit beeper texture: 16ths at 96 BPM over the current chord, on/off only (no dynamics)."""
    y = np.zeros((2, n), np.float32)
    s16 = BEAT / 4
    pat = [0, 1, 2, 3, 2, 1, 0, 2]
    for a, b in regs:
        buf = np.zeros(s2n(b - a) + s2n(0.4), np.float32)
        k0 = math.ceil((a - TITLE_S) / s16 - 1e-9)
        k = k0
        while TITLE_S + k * s16 < b - 0.02:
            t = TITLE_S + k * s16
            tones = chord_tones(chord_at(segs, t), 72, 86)[:4]
            p = tones[pat[(k - k0) % len(pat)] % len(tones)]
            v = chip.beeper(p, s16 * 0.55)
            kf = min(96, len(v) // 4)
            v[:kf] *= np.linspace(0, 1, kf)
            v[-kf:] *= np.linspace(1, 0, kf)
            add = max(0, s2n(t - a))
            m = max(0, min(len(v), len(buf) - add))
            buf[add:add + m] += v[:m]
            if (k - k0) % 4 == 0:                     # the second 'channel': a root blip per beat
                r = in_range({nm(CHORDS[chord_at(segs, t)]['bass']) % 12}, 48, 60)[0]
                w = chip.beeper(r, 0.05) * 0.6
                w[-48:] *= np.linspace(1, 0, 48)
                m = max(0, min(len(w), len(buf) - add))
                buf[add:add + m] += w[:m]
            k += 1
        buf *= env_ar(len(buf), 0.18, 0.35, gate_n=s2n(b - a))
        v2 = lp(buf, 4200, 2)
        loc = pad_tail(np.stack([v2, np.roll(v2, 180)]).astype(np.float32), 1.0)
        add_at(y, (loc + db(-16) * reverb(loc, 'room')).astype(np.float32), s2n(a))
    return y


def layer_glyph(reel, segs, n, rng, regs):
    """GLYPH beats: glass shimmer on the chord's tones, two octaves up, in the hall."""
    y = np.zeros((2, n), np.float32)
    dens = 16.0 if reel['extrapolated'] else 12.0
    for a, b in regs:
        d = b - a + 0.5
        tones = chord_tones(chord_at(segs, a + 0.05), 62, 74)
        v = synth.shimmer(tones, d, density=dens, seed=int(rng.integers(0, 1 << 30)))
        v = pad_tail(v * env_ar(v.shape[1], 0.3, 0.6)[None], 2.5)
        add_at(y, (v + db(-4) * reverb(v, 'hall')).astype(np.float32), s2n(a))
    return y


def tick(double=False, seed=0):
    """A soft chip 'tk': a short pitched blip with a breath of noise (a page-turn double on act changes)."""
    rng = np.random.default_rng(seed)
    m = s2n(0.06)
    t = np.arange(m) / SR

    def one(f):
        c = bp(rng.standard_normal(m) * np.exp(-t / 0.0015), 1500, 6000, 2) * 0.35
        ping = chip.triangle(69 + 12 * np.log2(f / 440.0), 0.06, steps=16)[:m] * np.exp(-t / 0.014)
        body = np.sin(2 * np.pi * (f / 2) * t) * np.exp(-t / 0.008) * 0.4
        e = np.clip(t / 0.0008, 0, 1)
        return (c + ping + body) * e
    y = one(1568.0)                                     # G6-ish, inside the F minor world (no pitch clash: short)
    if double:
        k = s2n(0.075)
        y = np.concatenate([y, np.zeros(k)])
        y[k:k + m] += one(1047.0) * 0.8                 # C6
    y = pad_tail(y.astype(np.float32), 0.4)
    y = y + db(-12) * reverb(y, 'room')
    return (y / (np.abs(y).max() + 1e-12)).astype(np.float32)     # peak-normalised; placed at TICK_PEAK


# ------------------------------------------------------------------------------------------------
# accents (V1 main title excerpts + chip)
# ------------------------------------------------------------------------------------------------
_WAV = {}


def v1(path):
    if path not in _WAV:
        x, sr = sf.read(path, always_2d=True, dtype='float32')
        assert sr == SR, f'{path}: {sr} Hz'
        _WAV[path] = x.T.copy()
    return _WAV[path]


def excerpt(path, f_from, f_to, fade_in_f=1.0, fade_out_s=0.1):
    x = v1(path)[:, int(round(f_from * SPF)):int(round(f_to * SPF))].copy()
    a = max(1, int(fade_in_f * SPF))
    x[:, :a] *= raised(a)[None]
    b = min(x.shape[1], s2n(fade_out_s))
    x[:, -b:] *= raised(b)[::-1][None]
    return x


def cap(x, ceil_db=ACCENT_TP):
    """Per-accent true-peak cap so the final safety limiter has (almost) nothing to do."""
    y, _ = limiter(x, ceil_db=ceil_db, look_ms=3.0)
    return y


def accent_sting():
    """Title card: V1 bar 9, the roll call (f480-539): the knee in eight stabs, stab 8 rings on an
    open fifth.  Cut before the skyline (f540); a little extra hall carries the ring past the cut."""
    x = pad_tail(excerpt(V1_MASTER, 478, 540.5, fade_in_f=2.0, fade_out_s=0.07), 2.2)
    return (x + db(-9) * reverb(x, 'hall')).astype(np.float32), 2 * SPF      # (audio, samples before f480)


def intro_len(dur):
    """(length, fade-out) of the intro-beat excerpt: the beat + 0.25 s, at most f630-720 (3.75 s)."""
    L = min(dur + 0.25, 90 / FPS)
    return L, min(0.45, L * 0.3)


def accent_intro(dur):
    """Kind 'intro' (the 30 s main title stand-in): the V1 title section from f630 (horn swell, chip
    arpeggio F-Bb-Eb-F into F6, the celesta at f660), cut to the beat."""
    L, fo = intro_len(dur)
    x = excerpt(V1_MASTER, 630, 630 + L * FPS, fade_in_f=0.5, fade_out_s=fo)
    return x, 0


def accent_stab(hit, chord, style, rng):
    """setpiece ('brass'): the V1 brass-stem stab with a chip doubling of its top two voices an
    octave up, 6 LU under the brass.  card: the same stab through the sample-chip filter (like the
    theme's accent #1), thinner, with the chip 4 LU under.  A key set-piece's f420 shout brings its
    f414-419 rip, which leads the cut by 6 frames."""
    pre = 6.0 if hit == 420 else 0.2                   # frames before the hit
    off = s2n(pre / FPS)
    x = excerpt(V1_BRASS, hit - pre, hit + 38, fade_in_f=0.2, fade_out_s=0.6)
    x = x * np.exp(-np.maximum(np.arange(x.shape[1]) - (off + s2n(0.35)), 0) / (0.5 * SR))[None]
    x = pad_tail(x, 0.8)
    c = CHORDS[chord]
    top, second = (nm(p) + 12 for p in STAB_TOP[hit])
    ch = np.zeros((2, s2n(0.5)), np.float32)
    ch += apply_pan(_chip_note(top, 0.5, duty=0.25, level=1.0, gate=0.22), 0.2)
    ch += apply_pan(_chip_note(second, 0.5, duty=0.25, level=0.6, gate=0.22), -0.2)
    tri = chip.triangle(nm(c['bass']) + 12, 0.35) * chip.stepped_env(s2n(0.35), 0.002, 0.12, 0.3, 0.05, gate_s=0.2)
    add_at(ch, (tri * 0.7).astype(np.float32), 0)
    ch = chipfx(ch, 0.8, echo_fb=0.28, echo_mix=0.25)
    if style == 'card':
        body = chip.sample_chip(hp(x, 280, 2), store_rate=12000, brr=True, echo_ms=144, echo_fb=0.25, echo_mix=0.18)
        rel = -4.0
    else:
        body, rel = x, -6.0
    body, _ = normalise_to(body, ACCENT_M, momentary_max)
    ch, _ = normalise_to(ch, ACCENT_M + rel, momentary_max)
    out = np.zeros((2, max(body.shape[1], off + ch.shape[1])), np.float32)
    out[:, :body.shape[1]] += body
    add_at(out, ch, off)
    return out, off


def accent_chip(chord, rng):
    """A setpiece that follows a setpiece: a chip-only stab in the current chord (pulse pair, a
    triangle root and a breath of LFSR noise)."""
    tones = chord_tones(chord, 74, 88)
    a, b = tones[-1], tones[-3] if len(tones) > 2 else tones[0]
    v = _chip_note(a, 0.45, duty=0.25, level=1.0, gate=0.16) + _chip_note(b, 0.45, duty=0.5, level=0.6, gate=0.16)
    nz = lp(chip.noise_hit(0.12, clock_hz=24000, seed=5), 6000, 2) * np.exp(-np.arange(s2n(0.12)) / (0.015 * SR))
    v[:len(nz)] += nz.astype(np.float32) * 0.12
    tri = chip.triangle(nm(CHORDS[chord]['bass']) + 12, 0.3) * chip.stepped_env(s2n(0.3), 0.002, 0.1, 0.3, 0.05,
                                                                                gate_s=0.15)
    v[:len(tri)] += tri.astype(np.float32) * 0.8
    return chipfx(apply_pan(v, 0.05), 0.9, echo_fb=0.3, echo_mix=0.3), 0


# ------------------------------------------------------------------------------------------------
# the render
# ------------------------------------------------------------------------------------------------
LAYER_LUFS = {                  # relative balance inside the bed (integrated over each layer's active parts)
    'piano': -23.5, 'chip_pad': -25.5, 'tri': -33.5, 'arp': -31.0, 'knee': -26.0, 'beeper': -24.5,
    'glyph': -26.5,
}


def render(reel_path, out_wav=None, qa_path=None, verbose=True):
    t_start = time.time()
    reel = load_reel(reel_path)
    n = reel['samples']
    seed = 7919 * (reel['episode'] or 0) + sum(map(ord, reel['key']))
    rng = np.random.default_rng(seed)
    beats = reel['beats']
    segs, accents = plan(reel, rng)
    intro_regs = regions(beats, lambda b: b['kind'] == 'intro')
    # the bed is out while the V1 title excerpt plays; it comes back as the excerpt fades, so a
    # beat longer than the excerpt (3.75 s max) has no hole in it
    intro_duck = []
    for a in accents:
        if a['kind'] == 'intro':
            L, fo = intro_len(a['dur'])
            intro_duck.append((a['t'], a['t'] + L - fo))

    def mute(t):                                            # the sting owns the title card
        return t < TITLE_S - 0.2

    def mute_intro(t):                                      # no arpeggio under the title excerpt
        return mute(t) or any(a - 0.2 <= t < b for a, b in intro_duck)

    fb_regs = regions(beats, lambda b: b['kind'] == 'flashback' or b['style'] == '1-BIT')
    gl_regs = regions(beats, lambda b: b['style'] == 'GLYPH' or 'glyph-dissolve' in b['fx'])

    L = {}
    L['piano'] = layer_piano(reel, segs, n, np.random.default_rng(seed + 1), mute)
    L['chip_pad'] = layer_chip_pad(reel, segs, n, np.random.default_rng(seed + 2), mute)
    L['tri'] = layer_tri_bass(reel, segs, n, np.random.default_rng(seed + 3), mute)
    L['arp'] = layer_arp(reel, segs, n, np.random.default_rng(seed + 4),
                         lambda t: mute_intro(t) or any(a <= t < b for a, b in fb_regs))
    L['knee'] = layer_knee(reel, segs, n, np.random.default_rng(seed + 5), mute, accents)
    L['beeper'] = layer_beeper(reel, segs, n, np.random.default_rng(seed + 6), fb_regs)
    L['glyph'] = layer_glyph(reel, segs, n, np.random.default_rng(seed + 7), gl_regs)

    bed = np.zeros((2, n), np.float32)
    layer_gain = {}
    for k, y in L.items():
        y = y[:, :n]
        sp = span(y)
        lv = integrated(y[:, sp[0]:sp[1]]) if sp else -120.0
        if lv < -90:
            layer_gain[k] = None
            continue
        g = LAYER_LUFS[k] - lv
        layer_gain[k] = round(g, 2)
        bed += y * db(g)

    # ---- bed automation: head (the sting owns the title card), the intro-beat duck, fade at the end
    tt = np.arange(n) / SR
    head = np.clip((tt - (TITLE_S - 0.35)) / 0.5, 0, 1)
    auto = (0.5 - 0.5 * np.cos(np.pi * head))
    for a, b in intro_duck:
        d = np.interp(tt, [a - 0.2, a, b, b + 0.5], [0.0, 1.0, 1.0, 0.0], left=0.0, right=0.0)
        auto *= 1.0 - (1.0 - db(INTRO_DUCK)) * d
    fo = min(2.0, max(0.5, beats[-1]['t1'] - beats[-1]['t0']))
    tail = np.clip((n / SR - tt) / fo, 0, 1)
    auto *= np.sqrt(tail)
    bed *= auto[None].astype(np.float32)

    # ---- leveller: centred 3 s short-term -> slow gain so the bed's short-term sits at BED_ST.  The
    # window only averages the steady parts (not the head, the intro-beat duck or the fade-out), so a
    # duck never makes the leveller push the music next to it.
    steady = auto > 0.97
    cm = _cum(steady.astype(np.float64))
    w = int(3.0 * SR)
    ts = np.arange(0.0, n / SR, 0.05)
    ctr = np.minimum((ts * SR).astype(np.int64), n - 1)
    e = np.minimum(ctr + w // 2, n)
    s_ = np.maximum(e - w, 0)
    cnt = cm[e] - cm[s_]
    ok = steady[ctr] & (cnt > 0.5 * SR)
    if ok.any():
        for _ in range(3):
            cp = _cum(kpower(bed) * steady)
            st = -0.691 + 10 * np.log10((cp[e] - cp[s_]) / np.maximum(cnt, 1.0) + 1e-20)
            gd = np.clip(BED_ST - st, -12.0, 12.0)
            gd = np.interp(ts, ts[ok], gd[ok])              # hold across the excluded parts
            gd = uniform_filter1d(gd, size=int(1.5 / 0.05), mode='nearest')
            bed *= db(np.interp(tt, ts, gd))[None].astype(np.float32)

    # ---- ticks (part of the bed, fixed level)
    tk1 = tick(False, seed) * db(TICK_PEAK)
    tk2 = tick(True, seed + 1) * db(TICK_PEAK + 1.0)
    ticks = np.zeros((2, n), np.float32)
    for i, b in enumerate(beats):
        new_act = i > 0 and b['act'] != beats[i - 1]['act']
        add_at(ticks, tk2 if new_act else tk1, b['f0'] * SPF)

    # ---- accents, each normalised on its own to ACCENT_M (momentary max)
    acc = np.zeros((2, n), np.float32)
    acc_log = []
    sting, pre = accent_sting()
    sting, lv = normalise_to(sting, ACCENT_M, momentary_max)
    sting = cap(sting)
    add_at(acc, sting, s2n(0.125) - pre)
    acc_m = [momentary_max(sting)]
    acc_log.append(dict(t=0.0, kind='title-sting', src='V1 master f478-540 (bar 9 roll call)', raw_lufs_m=round(lv, 1),
                        lufs_m=round(acc_m[-1], 2)))
    dip = np.zeros(n)
    for a in accents:
        if a['kind'] == 'intro':
            y, off = accent_intro(a['dur'])
            src = 'V1 master f630+ (title)'
        elif a['kind'] in ('brass', 'card'):
            y, off = accent_stab(a['hit'], a['chord'], a['kind'], rng)
            src = f"V1 brass f{a['hit']}" + (' via sample-chip' if a['kind'] == 'card' else '') + ' + chip'
        else:
            y, off = accent_chip(a['chord'], rng)
            src = 'chip'
        y, lv = normalise_to(y, ACCENT_M, momentary_max)
        y = cap(y)
        acc_m.append(momentary_max(y))
        s0 = s2n(a['t']) - off
        add_at(acc, y, s0)
        if a['kind'] != 'intro':
            d = np.interp(tt, [a['t'] - 0.03, a['t'], a['t'] + 0.45, a['t'] + 1.3], [0, 1, 1, 0], left=0, right=0)
            dip = np.maximum(dip, d)
        acc_log.append(dict(t=round(a['t'], 3), kind=a['kind'], beat=a['beat'], chord=a['chord'], src=src,
                            raw_lufs_m=round(lv, 1), lufs_m=round(acc_m[-1], 2)))
    bed_pre_dip = bed.copy()
    bed *= db(-3.0 * dip)[None].astype(np.float32)

    mix = bed + ticks + acc
    k = s2n(0.03)                                           # the very end: 30 ms de-click to zero
    mix[:, -k:] *= raised(k)[::-1][None]
    pre_env = true_peak_env_chunked(mix)
    hot = np.flatnonzero(pre_env > db(TP_CEIL))
    lim_events = []                                         # where the safety limiter had to act
    if len(hot):
        br = np.flatnonzero(np.diff(hot) > SR // 10)
        for s0, s1 in zip(np.r_[hot[0], hot[br + 1]], np.r_[hot[br], hot[-1]]):
            pk = float(todb(pre_env[s0:s1 + 1].max()))
            lim_events.append(dict(t=round(s0 / SR, 3), dur_ms=round((s1 - s0) / SR * 1000, 1),
                                   gr_db=round(TP_CEIL - pk, 2)))
    mix, gr = limiter(mix)
    assert mix.shape == (2, n)

    # ---- QA
    cb = _cum(kpower(bed_pre_dip))
    ts, st = curve(None, 3.0, hop_s=0.1, c=cb)              # trailing 3 s, as a meter reads
    sel = np.array([(t >= TITLE_S + 3.2) and (t <= n / SR - 2.2) and
                    not any(a - 0.3 <= t <= b + 3.5 for a, b in intro_duck) for t in ts])
    stv = st[sel] if sel.any() else st
    tp = float(todb(true_peak_env_chunked(mix).max()))
    qa = dict(
        version=VERSION, reel=os.path.relpath(reel_path, ROOT), key=reel['key'], episode=reel['episode'],
        title=reel['title'], extrapolated=reel['extrapolated'], extrapolated_from=reel['extrapolated_from'],
        error=reel['error'],
        frames=reel['frames'], samples=n, seconds=round(n / SR, 3), fps=FPS, sr=SR,
        sum_reelDur_plus_title_s=round(TITLE_S + sum(b['reelDur'] for b in beats), 4),
        title_card_s=TITLE_S, beats=len(beats),
        loudness=dict(
            bed_short_term_target=BED_ST,
            bed_short_term_median=round(float(np.median(stv)), 2),
            bed_short_term_p5=round(float(np.percentile(stv, 5)), 2),
            bed_short_term_p95=round(float(np.percentile(stv, 95)), 2),
            accent_momentary_target=ACCENT_M,
            accent_momentary_max=[round(v, 2) for v in acc_m],
            mix_integrated=round(integrated(mix), 2),
            mix_true_peak_dbtp=round(tp, 2),
            limiter_max_gr_db=round(gr, 2),
            limiter_events=lim_events[:50],
        ),
        layer_gain_db=layer_gain,
        chords=[dict(t=round(s['t0'], 3), chord=s['chord'], act=s['act']) for s in segs],
        accents=acc_log,
        flashback_regions=[[round(a, 3), round(b, 3)] for a, b in fb_regs],
        glyph_regions=[[round(a, 3), round(b, 3)] for a, b in gl_regs],
        intro_regions=[[round(a, 3), round(b, 3)] for a, b in intro_regs],
        render_s=None,
    )
    if out_wav:
        os.makedirs(os.path.dirname(os.path.abspath(out_wav)), exist_ok=True)
        sf.write(out_wav, np.clip(mix.T, -1.0, 1.0 - 2 ** -23), SR, subtype='PCM_24')
        chk = sf.info(out_wav)
        assert chk.frames == n, (chk.frames, n)
    qa['render_s'] = round(time.time() - t_start, 1)
    if qa_path:
        os.makedirs(os.path.dirname(os.path.abspath(qa_path)), exist_ok=True)
        with open(qa_path, 'w') as f:
            json.dump(qa, f, indent=1)
    if verbose:
        lo = qa['loudness']
        print(f"{reel['key']}: {n / SR:7.2f} s ({reel['frames']} fr) | bed ST median {lo['bed_short_term_median']:.1f} "
              f"[p5 {lo['bed_short_term_p5']:.1f}, p95 {lo['bed_short_term_p95']:.1f}] | accents {len(acc_log)} "
              f"(M max {min(acc_m):.1f}..{max(acc_m):.1f}) | TP {tp:.1f} dBTP | {qa['render_s']} s"
              + (f" | reel error: {reel['error']}" if reel['error'] else ''))
    return qa


def check(paths):
    """Dry run: parse each reel as render() would and print what the bed would use.  Writes nothing."""
    bad = 0
    for p in paths:
        r = load_reel(p)
        src = r['extrapolated_from'] or 'absent'
        print(f"{r['key']:>16}: episode {r['episode']} | extrapolated {str(r['extrapolated']).lower():5} "
              f"(from '{src}') | {len(r['beats'])} beats | {r['frames']} fr = {r['samples'] / SR:.2f} s"
              + (f" | ERROR {r['error']}" if r['error'] else ''))
        bad += bool(r['error'])
    return 1 if bad else 0


def self_test():
    """The flag reader's checks: the new name, the old name as a fallback, precedence, and the shape."""
    cases = [
        ({'extrapolated': True}, (True, 'extrapolated')),
        ({'extrapolated': 'true'}, (True, 'extrapolated')),
        ({'extrapolated': 'TRUE '}, (True, 'extrapolated')),
        ({'extrapolated': False}, (False, 'extrapolated')),
        ({'extrapolated': 1}, (False, 'extrapolated')),          # the schema's boolean is true or "true" only
        ({'speculative': True}, (True, 'speculative')),          # an old reel still gets its colour
        ({'speculative': 'true'}, (True, 'speculative')),
        ({'extrapolated': False, 'speculative': True}, (False, 'extrapolated')),   # the new name wins
        ({'extrapolated': True, 'speculative': False}, (True, 'extrapolated')),
        ({}, (False, None)),
        ([], (False, None)),
    ]
    fails = [(o, want, arc_flag(o)) for o, want in cases if arc_flag(o) != want]
    for o, want, got in fails:
        print(f'FAIL arc_flag({o!r}) = {got!r}, want {want!r}')
    # the renderer reads only reel['extrapolated'] (plan() and the layers), so load_reel must always carry it
    import tempfile
    with tempfile.TemporaryDirectory() as d:
        beats = [dict(act=a, kind='scene', reelDur=6.0) for a in ('COLD OPEN', 'ACT ONE', 'ACT TWO', 'TAG')]
        for flag, want in (('extrapolated', True), ('speculative', True), (None, False)):
            p = os.path.join(d, 'ep10.json')
            o = dict(episode=10, title='t', beats=beats)
            if flag:
                o[flag] = True
            with open(p, 'w') as f:
                json.dump(o, f)
            r = load_reel(p)
            if r['extrapolated'] is not want or 'speculative' in r:
                fails.append((flag, want, r['extrapolated']))
                print(f'FAIL load_reel with {flag!r}: extrapolated={r["extrapolated"]!r}, want {want!r}')
    print(f"self-test: {len(cases) + 3 - len(fails)}/{len(cases) + 3} passed")
    return 1 if fails else 0


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__.split('\n\n')[0])
    ap.add_argument('reel', nargs='*', help='show/reel/epNN.json (one to render; any number with --check)')
    ap.add_argument('-o', '--out', help='output WAV (default audio/reel/<key>.wav)')
    ap.add_argument('--qa', help='QA JSON (default audio/reel/qa/<key>.json)')
    ap.add_argument('--check', action='store_true', help='dry run: parse the reels and print the flags; no render')
    ap.add_argument('--self-test', action='store_true', help="run the flag reader's checks and exit")
    a = ap.parse_args(argv)
    if a.self_test:
        sys.exit(self_test())
    if a.check:
        if not a.reel:
            ap.error('--check needs at least one reel JSON')
        sys.exit(check(a.reel))
    if len(a.reel) != 1:
        ap.error('render takes exactly one reel JSON (use build_all.py for many)')
    key = os.path.splitext(os.path.basename(a.reel[0]))[0]
    render(a.reel[0], a.out or os.path.join(HERE, f'{key}.wav'), a.qa or os.path.join(HERE, 'qa', f'{key}.json'))


if __name__ == '__main__':
    main()
