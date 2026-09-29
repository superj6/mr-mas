"""Wordless vocal harmony: title-hit pads, name-card 'doo-BAH' stabs, a scat reading of the hook.

Style variations (the score is meant to sit between piano, orchestral and big band, jazz-leaning,
with the 8-bit hook as the through-line), so every piece comes in several 'colours':
  jazz    - small close-harmony group (1-2 per part), plate, light straight-tone vibrato
  orch    - chamber choir (3 per part), open fifths, hall
  piano   - intimate 'ooh' quartet, soft bloom, short plate (sits beside a felt piano)
  chip    - vowel-vocoded pulse-wave voice; chords as a 24 Hz arpeggio (one note per film frame)
  hybrid  - jazz group with the chip voice tucked underneath (recommended 'in-between')
All singers are Kokoro-82M stock voices re-sung through WORLD (see sing.py). No human recordings.
"""
import os, sys, json
sys.path.insert(0, os.path.dirname(__file__))
import numpy as np
import pedalboard as pb
from sing import *

ROSTER = {  # stock voices by range
    'S': ['af_heart', 'af_bella', 'bf_emma'],
    'A': ['af_nicole', 'af_sarah', 'bf_isabella'],
    'T': ['am_puck', 'am_michael', 'bm_fable'],
    'B': ['am_fenrir', 'bm_george', 'am_liam'],   # baritone
    'X': ['am_onyx', 'am_echo', 'bm_lewis'],      # bass
}

def part_for(m):
    return 'X' if m < n2m('Bb2') else 'B' if m < n2m('F3') else 'T' if m < n2m('C4') else 'A' if m < n2m('F4') else 'S'

def pan_for(i, n, width=0.8):
    return 0.0 if n == 1 else width * (2 * i / (n - 1) - 1)

def ensemble(notes, syl, dur, *, per_part=1, dbl_gain_db=-5, time_spread=0.02, detune=5, width=0.75,
             seed=0, t0=0.0, gains=None, **kw):
    """notes: list of note names, low->high. Returns stereo (2, N) at t0 offset."""
    rng = np.random.default_rng(seed)
    total = t0 + dur + 0.6
    out = np.zeros((2, int(total * SR)))
    n = len(notes)
    for i, nn in enumerate(notes):
        m = n2m(nn) if isinstance(nn, str) else nn
        voices = ROSTER[part_for(m)]
        for k in range(per_part):
            v = voices[(i + k) % len(voices)]
            g = 10 ** ((dbl_gain_db if k else 0) / 20) * (gains[i] if gains else 1.0)
            s = seed * 100 + i * 10 + k
            dt = rng.uniform(-time_spread, time_spread) if (k or time_spread > 0.015) else 0.0
            y, t_on = sing(v, syl, m, dur, seed=s, detune_cents=rng.uniform(-detune, detune) + (6 if k else 0) * (-1) ** k,
                           formant=rng.uniform(0.97, 1.03), **kw)
            p = np.clip(pan_for(i, n, width) + (0.25 * (-1) ** k if k else 0), -1, 1)
            if t0 + dt - t_on < 0:          # never cut a note's start (would click)
                dt = abs(dt) + t_on - t0
            place(out, pan(y * g, p), t0 + dt - t_on)
    return out

def vocal_bus(x, lo_cut=110, air=1.5, warmth=1.0, comp=(-24, 2.0)):
    ch = [pb.HighpassFilter(lo_cut), pb.LowShelfFilter(250, warmth, 0.7), pb.PeakFilter(2800, -1.5, 1.0),
          pb.PeakFilter(4800, -1.0, 1.6), pb.HighShelfFilter(9000, air, 0.7),
          pb.Compressor(threshold_db=comp[0], ratio=comp[1], attack_ms=20, release_ms=200)]
    y = board(ch, x)
    return saturate(y, 3.0, 0.15)

def echo(x, delay_s, fb=0.35, n=6, lp=5000, wet=0.3):
    """ping-pong echo with a darkening feedback path (no wrap-around)."""
    d = int(delay_s * SR)
    out = np.pad(x, ((0, 0), (0, d * n)))
    tap = x.copy()
    g = wet
    for i in range(n):
        tap = board([pb.LowpassFilter(lp)], tap)[::-1]      # swap L/R each repeat
        out[:, d * (i + 1):d * (i + 1) + tap.shape[1]] += g * tap
        g *= fb
    return out

def fit(x, length):
    n = int(length * SR)
    return x[:, :n] if x.shape[1] >= n else np.pad(x, ((0, 0), (0, n - x.shape[1])))

# =========================================================================== title pads
TITLE_LEN = 4.0          # file length; tail is faded out by 3.95 s (the intro ends f719 = +3.75 s)
SOWHAT_F = ['F2', 'C3', 'F3', 'Bb3', 'Eb4', 'G4']       # 'So What' stack (4-4-4-3) from C over F: F9sus4, no third
OPEN_F = ['F2', 'C3', 'F3', 'C4', 'F4', 'C5']           # open fifths/octaves: exactly the f630 chord
PIANO_F = ['F3', 'C4', 'G4', 'Bb4']                     # soft F sus/add9, no third

def pad_jazz(seed=1):
    x = ensemble(SOWHAT_F, 'ah', 2.75, per_part=2, time_spread=0.012, detune=4, width=0.8, seed=seed,
                 gains=[0.9, 0.8, 0.75, 0.8, 0.85, 0.9],
                 att=0.035, rel=0.9, consonant=False, accent=0.55, swell=0.35, breath=0.08,
                 morph=('oh', 0.0, 0.55), vib_cents=11, vib_rate=5.5, vib_delay=0.55, vib_rise=0.6,
                 scoop_cents=-25, jitter_cents=4)
    x = vocal_bus(x, lo_cut=75, air=2.0)
    x = convolve(x, ir('plate'), wet=0.32)
    return fade(fit(x, TITLE_LEN), 0.0, 0.6)

def pad_orch(seed=2):
    x = ensemble(OPEN_F, 'ah', 2.8, per_part=3, dbl_gain_db=-3, time_spread=0.035, detune=7, width=0.9,
                 seed=seed, gains=[1.0, 0.85, 0.8, 0.8, 0.8, 0.75],
                 att=0.06, rel=1.0, consonant=False, accent=0.35, swell=0.2, breath=0.05,
                 morph=('oh', 0.1, 0.45), vib_cents=20, vib_rate=5.2, vib_delay=0.4, vib_rise=0.5,
                 scoop_cents=-20, jitter_cents=5)
    x = vocal_bus(x, lo_cut=70, air=1.0, warmth=1.5)
    x = convolve(x, ir('hall'), wet=0.5, dry=0.85)
    return fade(fit(x, TITLE_LEN), 0.0, 0.6)

def pad_piano(seed=3):
    x = ensemble(PIANO_F, 'ooh', 2.7, per_part=1, time_spread=0.02, detune=3, width=0.6, seed=seed,
                 gains=[0.9, 0.85, 0.9, 0.8],
                 att=0.28, rel=1.1, consonant=False, swell=0.15, breath=0.22,
                 morph=('mm', 0.0, 0.35), vib_cents=8, vib_rate=5.0, vib_delay=0.7, vib_rise=0.8,
                 scoop_cents=-15, jitter_cents=3)
    x = vocal_bus(x, lo_cut=120, air=1.0, warmth=0.5)
    x = convolve(x, ir('plate'), wet=0.22)
    return fade(fit(x, TITLE_LEN), 0.0, 0.6)

def chip_voice_chord(notes, syl, dur, *, arp=True, bass=None, duty=0.25, seed=0, **kw):
    """One arpeggiating chip 'voice' (24 Hz = one chord tone per film frame) + held chip bass."""
    out = np.zeros((2, int((dur + 0.6) * SR)))
    if arp:
        y = chip_sing('af_heart', syl, n2m(notes[-1]), dur, duty=duty, arp=[n2m(n) for n in notes], seed=seed, **kw)
        place(out, pan(y, -0.15), 0)
        y2 = chip_sing('af_bella', syl, n2m(notes[-1]), dur, duty=0.125, arp=[n2m(n) for n in notes[::-1]], seed=seed + 1, **kw)
        place(out, pan(y2 * 0.6, 0.35), 1 / FPS / 2)
    if bass:
        yb = chip_sing('am_onyx', syl, n2m(bass), dur, duty=0.5, seed=seed + 2, **kw)
        place(out, pan(yb * 0.8, 0.0), 0)
    return out

def pad_chip(seed=4):
    x = chip_voice_chord(['C4', 'F4', 'Bb4', 'Eb5', 'G5'], 'ah', 2.4, bass='F2', seed=seed, rel=0.5,
                         vib_cents=0)
    x = board([pb.HighpassFilter(60), pb.LowShelfFilter(200, 1.0, 0.7), pb.HighShelfFilter(7000, -3.0, 0.7)], x)
    x = echo(x, 3 / FPS, fb=0.45, n=7, lp=4500, wet=0.35)      # 3-frame ping-pong echo, era-true
    x = convolve(x, ir('plate'), wet=0.12)
    return fade(fit(x, TITLE_LEN), 0.0, 0.6)

def mixdown(parts):
    L = max(p.shape[1] for p, _ in parts)
    out = np.zeros((2, L))
    for p, g in parts:
        out[:, :p.shape[1]] += p * 10 ** (g / 20)
    return out

# =========================================================================== name-card stabs
SWING_PICKUP = 5 / FPS    # swung eighth before the downbeat = 1/3 beat = 5 frames
STAB_LEAD = 10 / FPS      # stab files start 10 frames before the hit: 'doo' vowel at +5 f, 'BAH' at +10 f (= hit)
PRE = 0.1                 # internal consonant pre-roll
CARD = {  # root, chord (bass first), card, hit frame
    'F':  (['F2', 'Ab3', 'C4', 'Eb4', 'G4'], 'GERG Fm9', 240),
    'Db': (['Db2', 'F3', 'Ab3', 'C4', 'Eb4'], 'ALYI Dbmaj9', 300),
    'Bb': (['Bb2', 'Ab3', 'C4', 'Db4', 'F4'], 'MARIO Bbm9', 360),
    'C':  (['C3', 'G3', 'C4', 'E4', 'G4'], 'NOLE C major (E natural), no 7th: safe over Cmaj7 / C7 / C7#9 themes', 420),
    'C7': (['C3', 'Bb3', 'E4', 'G4', 'C5'], 'NOLE C7 alt (bluesier; clashes with a Cmaj7 theme)', 420),
}

def shift_notes(notes, semis):
    return [n2m(n) + semis for n in notes]

def stab_group(key, seed=10):
    notes = CARD[key][0]
    # 'doo': short swung pickup on the chromatic approach chord a half step below
    doo = ensemble(shift_notes(notes, -1), 'doo', 0.13, per_part=1, time_spread=0.006, detune=4, width=0.8,
                   seed=seed, t0=PRE, att=0.012, rel=0.06, consonant=True, shape='stab', vib_cents=0,
                   scoop_cents=-30, scoop_ms=40, jitter_cents=3, gains=[0.8, 0.7, 0.7, 0.75, 0.8])
    bah = ensemble([n2m(n) for n in notes], 'bah', 0.42, per_part=2, time_spread=0.008, detune=4, width=0.8,
                   seed=seed + 1, t0=PRE, att=0.01, rel=0.14, consonant=True, shape='stab', accent=0.5,
                   vib_cents=0, scoop_cents=-35, scoop_ms=45, jitter_cents=3, fall_cents=-70, fall_ms=110,
                   gains=[0.95, 0.8, 0.8, 0.85, 0.95], morph=('ah', 0.2, 0.5))
    x = np.zeros((2, int(2.6 * SR)))
    place(x, doo * 0.72, STAB_LEAD - SWING_PICKUP - PRE)
    place(x, bah, STAB_LEAD - PRE)
    x = vocal_bus(x, lo_cut=80, air=2.0, comp=(-26, 2.5))
    x = convolve(x, ir('plate'), wet=0.26)
    return fade(fit(x, 2.6), 0.0, 0.5)

def stab_chip(key, seed=20):
    notes = CARD[key][0]
    upper = notes[1:]
    x = np.zeros((2, int(2.6 * SR)))
    doo = np.zeros((2, int(0.8 * SR)))
    y = chip_sing('af_heart', 'doo', 0, 0.13, arp=shift_notes(upper, -1), seed=seed, rel=0.04)
    place(doo, pan(y, -0.1), 0)
    bah = chip_voice_chord(upper, 'bah', 0.4, bass=notes[0], seed=seed + 3, rel=0.12, fall_cents=-100)
    place(x, doo * 0.75, STAB_LEAD - SWING_PICKUP)
    place(x, bah, STAB_LEAD)
    x = board([pb.HighpassFilter(60), pb.HighShelfFilter(7000, -3.0, 0.7)], x)
    x = echo(x, 3 / FPS, fb=0.4, n=5, lp=4500, wet=0.28)
    x = convolve(x, ir('plate'), wet=0.1)
    return fade(fit(x, 2.6), 0.0, 0.5)

# =========================================================================== scat hook (the knee)
EIGHTH_ON = [0, 10, 15, 25, 30, 40, 45, 55]    # swung eighths in frames (long-short 2:1 = 10+5 frames)
HOOK = {  # lead / parallel fourth below / line cliche / bass
    'lead':  ['F4', 'F4', 'F4', 'F4', 'G4', 'Ab4', 'C5', 'F5'],
    'fourth': ['C4', 'C4', 'C4', 'C4', 'D4', 'Eb4', 'G4', 'C5'],
    'cliche': ['F3', 'F3', 'E3', 'E3', 'Eb3', 'Eb3', 'D3', 'C3'],   # minor line cliche, lands on the open fifth
    'bass':  ['F2', None, None, None, 'Eb2', None, 'D2', 'F2'],
}
SCAT = ['doo', 'dn', 'doo', 'dn', 'dee', 'dah', 'bee', 'dah']
SCAT_LEAD = 6 / FPS       # scat files start 6 frames (0.25 s) before the bar's downbeat

def scat_hook(seed=30):
    out = np.zeros((2, int(3.7 * SR)))
    rng = np.random.default_rng(seed)
    lines = [('lead', 0.0, 1.0), ('fourth', 0.35, 0.72), ('cliche', -0.35, 0.62), ('bass', 0.0, 0.7)]
    for li, (name, p, g) in enumerate(lines):
        notes = HOOK[name]
        for j, nn in enumerate(notes):
            if nn is None:
                continue
            nxt = next((EIGHTH_ON[k] for k in range(j + 1, 8) if notes[k] is not None), 60 + 0)
            last = j == 7
            dur = 0.55 if last else max(0.1, (nxt - EIGHTH_ON[j]) / FPS * 0.82)
            if name == 'bass':
                dur = (nxt - EIGHTH_ON[j]) / FPS * 0.9 if not last else 0.55
            m = n2m(nn)
            v = ROSTER[part_for(m)][li % 3]
            syl = SCAT[j] if name != 'bass' else 'doo'
            accent = 0.35 if j in (0, 4, 7) else 0.1
            y, t_on = sing(v, syl, m, dur, seed=seed * 100 + li * 10 + j, att=0.01, rel=0.07 if not last else 0.25,
                           consonant=True, shape='stab', accent=accent, vib_cents=0 if not last else 12,
                           vib_delay=0.18, scoop_cents=-25, scoop_ms=35, jitter_cents=3,
                           fall_cents=-80 if last else 0, detune_cents=rng.uniform(-3, 3))
            place(out, pan(y * g * (1.1 if j % 2 == 0 else 0.85), p), SCAT_LEAD + EIGHTH_ON[j] / FPS + rng.uniform(-0.004, 0.004) - t_on)
    x = vocal_bus(out, lo_cut=70, air=2.0, comp=(-26, 2.5))
    x = convolve(x, ir('plate'), wet=0.22)
    return fade(fit(x, 3.7), 0.0, 0.4)

def scat_hook_chip(seed=40):
    out = np.zeros((2, int(3.7 * SR)))
    for li, (name, duty, p, g, v) in enumerate([('lead', 0.25, -0.2, 1.0, 'af_heart'), ('fourth', 0.125, 0.3, 0.6, 'af_bella'),
                                                ('bass', 0.5, 0.0, 0.8, 'am_onyx')]):
        notes = HOOK[name]
        for j, nn in enumerate(notes):
            if nn is None:
                continue
            nxt = next((EIGHTH_ON[k] for k in range(j + 1, 8) if notes[k] is not None), 60)
            last = j == 7
            dur = 0.5 if last else (nxt - EIGHTH_ON[j]) / FPS * 0.8
            y = chip_sing(v, SCAT[j] if name != 'bass' else 'doo', n2m(nn), dur, duty=duty, seed=seed + j,
                          rel=0.04 if not last else 0.2, vib_cents=25 if last else 0, vib_delay=0.15)
            place(out, pan(y * g, p), SCAT_LEAD + EIGHTH_ON[j] / FPS)
    x = board([pb.HighpassFilter(60), pb.HighShelfFilter(7000, -3.0, 0.7)], out)
    x = echo(x, 3 / FPS, fb=0.35, n=5, lp=4500, wet=0.25)
    x = convolve(x, ir('plate'), wet=0.1)
    return fade(fit(x, 3.7), 0.0, 0.4)

if __name__ == '__main__':
    what = sys.argv[1:] or ['pads', 'stabs', 'scat']
    stats = []
    if 'pads' in what:
        j = pad_jazz(); o = pad_orch(); p = pad_piano(); c = pad_chip()
        stats.append(export(j, 'harmony/title-pad_jazz-quartal_aah_F9sus'))
        stats.append(export(o, 'harmony/title-pad_orchestral-choir_open-fifth_F'))
        stats.append(export(p, 'harmony/title-pad_piano-intimate_ooh_Fsus'))
        stats.append(export(c, 'harmony/title-pad_8bit-chip-voice_arp_F9sus'))
        # 'in-between' blends
        stats.append(export(mixdown([(j, 0), (c, -13)]), 'harmony/title-pad_HYBRID_jazz+chip_F9sus'))
        stats.append(export(mixdown([(o, 0), (j, -6), (c, -16)]), 'harmony/title-pad_HYBRID_orch+jazz+chip_F'))
    keys = [w.split(':', 1)[1].split(',') for w in what if w.startswith('stabs:')]
    if keys:
        what = what + ['stabs']
    if 'stabs' in what:
        for k in (keys[0] if keys else CARD):
            g = stab_group(k); c = stab_chip(k)
            stats.append(export(g, f'harmony/stab_doo-bah_jazz-group_{k}'))
            stats.append(export(c, f'harmony/stab_doo-bah_8bit-chip_{k}'))
            stats.append(export(mixdown([(g, 0), (c, -12)]), f'harmony/stab_doo-bah_HYBRID_{k}'))
    if 'scat' in what:
        s = scat_hook(); c = scat_hook_chip()
        stats.append(export(s, 'harmony/scat_knee-hook_jazz-group_Fm'))
        stats.append(export(c, 'harmony/scat_knee-hook_8bit-chip_Fm'))
        stats.append(export(mixdown([(s, 0), (c, -11)]), 'harmony/scat_knee-hook_HYBRID_Fm'))
    p = os.path.join(ROOT, 'harmony', '_stats.json')
    old = json.load(open(p)) if os.path.exists(p) else []
    old = [o for o in old if o['file'] not in {s['file'] for s in stats}] + stats
    json.dump(old, open(p, 'w'), indent=1, default=float)
