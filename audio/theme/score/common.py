"""Shared material for all four variations of "The Knee (Main Title)".

Times are in frames (24 fps).  Bar n starts at 60*(n-1).  Swung eighths put the
second eighth 10 frames after the beat.
"""
from __future__ import annotations

import numpy as np

from engine.core import (Note, nm, fr, eighth, f2s, SR, db, lp, hp, peq, shelf, to_stereo, tape, soft_sat,
                         apply_pan, midi_hz)
from engine.render import Track
from engine import chip, synth
from engine.sampler import SALAMANDER, UPRIGHT_KW, GU

# ------------------------------------------------------------------ the theme
KNEE = ['F', 'F', 'F', 'F', 'G', 'Ab', 'C', 'F']          # one bar of eighths, last F an octave up
KNEE_OCT = [0, 0, 0, 0, 0, 0, 0, 1]

# card hits: frame -> (name, root, rootless/upper voicing for piano, big-band stab voicing)
HITS = {
    240: dict(name='Fm11', root='F', piano=['Ab3', 'Bb3', 'Eb4', 'G4'],
              stab=['C5', 'Bb4', 'G4', 'Eb4', 'Ab3', 'F3'], bass='F2'),
    300: dict(name='Dbmaj9#11', root='Db', piano=['F3', 'G3', 'C4', 'Eb4'],
              stab=['Eb5', 'C5', 'G4', 'F4', 'C4', 'Ab3'], bass='Db2'),
    360: dict(name='Bbm9', root='Bb', piano=['Ab3', 'C4', 'Db4', 'F4'],
              stab=['F5', 'C5', 'Ab4', 'Db4', 'F3', 'Db3'], bass='Bb1'),
    420: dict(name='C7#9b13', root='C', piano=['E3', 'Bb3', 'Eb4', 'Ab4'],
              stab=['Ab5', 'Eb5', 'Bb4', 'E4', 'Bb3', 'E3'], bass='C2'),
}

# final title chord: F9sus4 / quartal, NO third (no A, no Ab)
TITLE = dict(bass=['F1', 'F2'], low=['C3', 'F3'], mid=['Bb3', 'Eb4', 'G4'], high=['C5', 'F5', 'G5', 'C6'],
             top='F6')


def knee_notes(octave: int):
    return [nm(f'{p}{octave + o}') for p, o in zip(KNEE, KNEE_OCT)]


def swing_pos(bar, idx, s=1.0):
    """idx 0..7 eighth index in bar."""
    return eighth(bar, idx // 2 + 1, idx % 2 == 1, s)


class Arr:
    def __init__(self):
        self.notes: list[Note] = []

    def n(self, inst, pitch, start, dur, vel=0.7, lock=False, **x):
        if isinstance(pitch, str):
            pitch = nm(pitch)
        self.notes.append(Note(inst, float(pitch), float(start), float(dur), float(vel), lock, x))
        return self

    def ch(self, inst, pitches, start, dur, vel=0.7, lock=False, roll=0.0, **x):
        for i, p in enumerate(pitches):
            self.n(inst, p, start + i * roll, dur, vel, lock, **x)
        return self

    def legato(self, inst, seq, vel=0.6, overlap=1.6, lock_first=False, last=None, lock=False, **x):
        """seq = [(pitch, start, dur, vel?)...]; pseudo-legato: later notes skip attack & crossfade.
        last: extra kwargs for the final note only (e.g. a short release, a bend/fall)."""
        for i, s in enumerate(seq):
            p, st, du = s[0], s[1], s[2]
            v = s[3] if len(s) > 3 else vel
            kw = dict(x)
            if i > 0:
                kw.setdefault('offset', 0.09)
                kw.setdefault('att', 0.07)
            if i < len(seq) - 1:
                kw.setdefault('rel', 0.12)          # quick release inside the crossfade -> no smear
                ov = overlap
            else:
                kw.update(last or {})
                ov = kw.pop('overlap', overlap)
            self.n(inst, p, st, du + ov, v, lock or (lock_first and i == 0), **kw)
        return self


# ------------------------------------------------------------------ sources
def felt_post(buf):
    buf = hp(buf, 45, 2)
    buf = lp(buf, 3200, 2)
    buf = peq(buf, 220, 2.0, 0.8)
    buf = shelf(buf, 5000, -4, True)
    return buf


def felt_post_bright(buf):
    buf = hp(buf, 45, 2)
    buf = lp(buf, 5200, 2)
    buf = peq(buf, 220, 1.5, 0.8)
    buf = peq(buf, 2500, 1.5, 0.9)
    return shelf(buf, 7000, -2, True)


def tape_post(cents=15, hiss=-62, lp_hz=6500, seed=4):
    def f(buf):
        return tape(buf, drive=1.4, wow_cents=cents, wow_hz=0.9, flutter_cents=3, hiss_db=hiss, seed=seed,
                    lp_hz=lp_hz)
    return f


def snes_post(store=16000, echo_ms=144, fb=0.32, mix=0.22, wobble=0.0):
    def f(buf):
        y = chip.sample_chip(buf, store_rate=store, brr=True, echo_ms=echo_ms, echo_fb=fb, echo_mix=mix)
        if wobble:
            y = tape(y, drive=1.1, wow_cents=wobble, wow_hz=0.8, flutter_cents=2, hiss_db=-66, seed=9, lp_hz=None)
        return y
    return f


def _chip_level(vel, rng):
    return db(-22 * (1 - vel)) * 0.5


def chip_fn(kind):
    """kind: pulse | tri | beeper | noise"""
    def f(n: Note, rng):
        x = n.x
        gate = f2s(n.dur)
        rel = x.get('rel', 0.05)
        dur = gate + rel + 0.01
        if kind == 'pulse':
            y = chip.pulse(n.pitch, dur, duty=x.get('duty', 0.25), max_hz=x.get('max_hz', 9000),
                           duty_to=x.get('duty_to'), tilt=x.get('tilt', -1.5), vib_cents=x.get('vib', 0.0),
                           vib_delay=x.get('vib_delay', 0.16), slide_from=x.get('slide'), bend=x.get('bend'))
        elif kind == 'tri':
            y = chip.triangle(n.pitch, dur, vib_cents=x.get('vib', 0.0), slide_from=x.get('slide'),
                              bend=x.get('bend')) * 1.3
        elif kind == 'beeper':
            y = chip.beeper(n.pitch, dur, bend=x.get('bend'), slide_from=x.get('slide')) * 0.8
        elif kind == 'noise':
            y = chip.noise_hit(dur, clock_hz=x.get('clock', 22000.0), short=x.get('short', False),
                               seed=int(rng.integers(1, 9999)))
            y = hp(y, x.get('hp', 5000), 2)
        else:
            raise ValueError(kind)
        env = chip.stepped_env(len(y), att=x.get('att', 0.002), dec=x.get('dec', 0.18), sus=x.get('sus', 0.55),
                               rel=rel, gate_s=gate, steps=x.get('steps', 15), rate=x.get('rate', 60.0))
        y = y * env * _chip_level(n.vel, rng) * db(x.get('gain', 0.0))
        return to_stereo(y)
    return f


def sub_fn(n: Note, rng):
    x = n.x
    return synth.sub808(n.pitch, f2s(n.dur) + x.get('rel', 0.3), punch_semi=x.get('punch', 9.0),
                        decay_s=x.get('decay', 0.8), drive=x.get('drive', 1.5), click=x.get('click', 0.08),
                        glide_to=x.get('glide_to'), glide_s=x.get('glide_s')) * db(-24 * (1 - n.vel)) * 0.5


def drone_fn(n: Note, rng):
    x = n.x
    ps = x.get('pitches', [n.pitch])
    return synth.drone(ps, f2s(n.dur), fade_in=x.get('fade_in', 1.0), fade_out=x.get('fade_out', 0.5)) * \
        db(-24 * (1 - n.vel)) * 0.5


def swish_fn(n: Note, rng):
    return synth.brush_sweep(f2s(n.dur), level=db(-18 * (1 - n.vel)), seed=int(rng.integers(0, 1 << 30)),
                             circles=n.x.get('circles', 1.0))


def mech_fn(n: Note, rng):
    return synth.felt_mech(level=db(-12 * (1 - n.vel)), seed=int(rng.integers(0, 1 << 30)))


_REV = {}


def revswell_fn(n: Note, rng):
    """Reverse cymbal: the first `dur` of a real crash (VSCO 2 CE), reversed, so it swells into the downbeat."""
    from engine.sampler import load_wav, trim_lead, ROOT
    key = 'crash'
    if key not in _REV:
        _REV[key] = trim_lead(load_wav(f'{ROOT}/vsco2ce/Percussion/cymbal-crash1_mf_rr1.wav'))
    y = _REV[key]
    L = int(f2s(n.dur) * SR)
    seg = y[:, :L][:, ::-1].copy()
    if seg.shape[1] < L:
        seg = np.pad(seg, ((0, 0), (L - seg.shape[1], 0)))
    k = min(int(0.05 * SR), L)
    seg[:, :k] *= np.linspace(0, 1, k)[None]
    seg = lp(seg, n.x.get('hi', 9000), 2)
    return (seg * db(-20 * (1 - n.vel)) * 0.5).astype(np.float32)


def shimmer_fn(n: Note, rng):
    return synth.shimmer(n.x['pitches'], f2s(n.dur), density=n.x.get('density', 16), level=db(-18 * (1 - n.vel)),
                         seed=int(rng.integers(0, 1 << 30)))


def bell_fn(n: Note, rng):
    return synth.bell(n.pitch, n.x.get('len', 1.2), level=db(-18 * (1 - n.vel)), bright=n.x.get('bright', 1.0))


def room_fn(n: Note, rng):
    return to_stereo(synth.room_tone(f2s(n.dur), level_db=n.x.get('db', -60)))


# v2.1: the 'fired' stem is retired (no 'music fired' mute); the Harmon trumpet has its own stem.
STEMS = ['piano', 'strings', 'brass', 'winds', 'harmon', 'bass', 'drums', 'perc', 'chip', 'sub', 'fx']


def std_tracks():
    """The full palette.  Variations tweak gains/sends; unused tracks cost nothing."""
    T = {}

    def add(name, src, stem, **kw):
        T[name] = Track(name=name, src=src, stem=stem, **kw)

    # piano family
    # SCRIPT v2.1 s9.6: swung off-beats are locked -> humanise 3 ms or less on felt / grand / brush / upright
    add('felt', ('sf2', UPRIGHT_KW, 0, 0, False), 'piano', gain_db=-1, pan=-0.05, width=0.8,
        sends={'room': -14, 'hall': -17}, hum_ms=3, post=felt_post, sf2_gain=0, latency_ms=5)
    add('felt_mech', ('fn', mech_fn), 'piano', gain_db=-6, pan=-0.05, hum_ms=3)
    add('grand', ('sf2', SALAMANDER, 0, 0, False), 'piano', gain_db=-2, pan=0.0, width=0.9,
        sends={'hall': -12, 'room': -16}, hum_ms=3, eq=[('hs', 7000, -2)], latency_ms=14)
    # strings (VSCO sections), sends to hall
    for nm_, st, pan in [('vln1', 'vln', -0.45), ('vln2', 'vln', -0.2), ('vla', 'vla', 0.2), ('vc', 'vc', 0.4),
                         ('cb', 'cb', 0.55)]:
        add(nm_, ('ss', st), 'strings', pan=pan, width=0.7, sends={'hall': -9, 'room': -18}, hum_ms=10, rel=0.35)
    for nm_, st, pan in [('vln_trem', 'vln_trem', -0.35), ('vla_trem', 'vla_trem', 0.15), ('vc_trem', 'vc_trem', 0.35)]:
        add(nm_, ('ss', st), 'strings', pan=pan, width=0.7, sends={'hall': -9}, hum_ms=8, rel=0.3)
    for nm_, st, pan in [('vln_pizz', 'vln_pizz', -0.4), ('vla_pizz', 'vla_pizz', 0.15), ('vc_pizz', 'vc_pizz', 0.35),
                         ('vln_spic', 'vln_spic', -0.4), ('vla_spic', 'vla_spic', 0.1), ('vc_spic', 'vc_spic', 0.35),
                         ('cb_spic', 'cb_spic', 0.5)]:
        add(nm_, ('ss', st), 'strings', pan=pan, width=0.6, sends={'hall': -10, 'room': -16}, hum_ms=3, rel=0.2,
            latency_ms=6 if 'pizz' in st else 0)
    add('svln', ('ss', 'svln'), 'strings', pan=-0.25, width=0.5, sends={'hall': -8}, hum_ms=8, rel=0.4)
    add('harp', ('ss', 'harp'), 'strings', pan=-0.3, width=0.8, sends={'hall': -10}, hum_ms=4, rel=1.5)
    # brass / big band (saxes live here too)
    add('tpt_stac', ('ss', 'tpt_stac'), 'brass', pan=0.1, width=0.8, sends={'hall': -12, 'room': -10}, hum_ms=5,
        rel=0.12)
    add('tbn_stac', ('ss', 'tbn_stac'), 'brass', pan=-0.15, width=0.8, sends={'hall': -12, 'room': -10}, hum_ms=5,
        rel=0.14)
    add('tuba_stac', ('ss', 'tuba_stac'), 'brass', pan=0.0, sends={'hall': -14, 'room': -12}, hum_ms=4, rel=0.15)
    add('hn_stac', ('ss', 'hn_stac'), 'brass', pan=-0.3, sends={'hall': -9}, hum_ms=5, rel=0.2, latency_ms=6)
    add('tsax_stac', ('ss', 'tsax_stac'), 'brass', pan=0.3, sends={'hall': -13, 'room': -10}, hum_ms=5, rel=0.1)
    add('hn', ('ss', 'hn'), 'brass', pan=-0.3, width=0.7, sends={'hall': -7}, hum_ms=10, rel=0.5)
    add('tbn', ('ss', 'tbn'), 'brass', pan=0.15, width=0.7, sends={'hall': -9}, hum_ms=8, rel=0.4)
    add('tuba', ('ss', 'tuba'), 'brass', pan=0.1, sends={'hall': -10}, hum_ms=8, rel=0.4)
    add('tpt', ('ss', 'tpt'), 'brass', pan=0.2, sends={'hall': -9}, hum_ms=8, rel=0.4)
    add('bsax', ('sf2', GU, 0, 67, False), 'brass', pan=0.2, gain_db=-4, sends={'room': -10, 'hall': -14}, hum_ms=5)
    add('asax', ('sf2', GU, 0, 65, False), 'brass', pan=0.35, gain_db=-4, sends={'room': -10, 'hall': -14}, hum_ms=5)
    # winds / solo colours
    # the one horn melody (bar 10): its own stem, stem-out Harmon
    add('harmon', ('ss', 'tpt_harmon'), 'harmon', pan=0.15, width=0.4, sends={'hall': -6, 'room': -12}, hum_ms=0,
        rel=0.35, latency_ms=10)
    # reed organ / harmonium (GM 21) for the ALYI D-flat pedal - never a church organ
    add('reed', ('sf2', GU, 0, 20, False), 'winds', gain_db=-4, pan=-0.2, width=0.7, sends={'hall': -9, 'room': -12},
        hum_ms=0, eq=[('hp', 70), ('lp', 5200), ('peq', 1800, -2.0, 0.8)])
    add('cl', ('ss', 'cl'), 'winds', pan=-0.1, width=0.4, sends={'hall': -8, 'room': -14}, hum_ms=10, rel=0.35)
    add('fl', ('ss', 'fl'), 'winds', pan=-0.2, width=0.4, sends={'hall': -8}, hum_ms=10, rel=0.35)
    add('bsn', ('ss', 'bsn'), 'winds', pan=0.1, sends={'hall': -9}, hum_ms=10, rel=0.3)
    add('tsax', ('ss', 'tsax'), 'winds', pan=0.2, width=0.4, sends={'hall': -9, 'room': -10}, hum_ms=10, rel=0.3)
    # bass
    add('ubass', ('sf2', GU, 0, 32, False), 'bass', gain_db=2, pan=0.05, width=0.3, sends={'room': -12, 'hall': -20},
        hum_ms=3, offset_ms=-4, eq=[('hp', 38), ('peq', 90, 2.0, 0.9), ('peq', 700, 1.5, 1.2)])
    add('cb_pizz', ('ss', 'cb_pizz'), 'bass', gain_db=-5, pan=0.05, width=0.3, sends={'room': -12, 'hall': -16},
        hum_ms=3, offset_ms=-4, rel=0.25, eq=[('hp', 35), ('lp', 2500)])
    # kit
    add('brush', ('sf2', GU, 128, 40, True), 'drums', gain_db=14, pan=0.05, width=0.8,
        sends={'room': -9, 'hall': -18}, hum_ms=3)
    add('jazz', ('sf2', GU, 128, 32, True), 'drums', gain_db=9, pan=0.0, width=0.9,
        sends={'room': -10, 'hall': -18}, hum_ms=3)
    add('swish', ('fn', swish_fn), 'drums', gain_db=10, sends={'room': -10}, hum_ms=0)
    add('snare', ('ss', 'snare'), 'drums', pan=0.05, sends={'room': -8, 'hall': -14}, hum_ms=3, rel=0.4)
    add('hat', ('ss', 'hat'), 'drums', pan=0.3, sends={'room': -14}, hum_ms=4, rel=0.2)
    # orchestral percussion + mallets
    add('timp', ('ss', 'timp'), 'perc', pan=-0.1, sends={'hall': -6}, hum_ms=0, rel=1.2)
    add('bdrum', ('ss', 'bdrum'), 'perc', pan=0.0, sends={'hall': -8}, hum_ms=0, rel=1.5)
    add('crash', ('ss', 'crash'), 'perc', pan=0.2, width=0.9, sends={'hall': -9}, hum_ms=0, rel=2.5)
    add('suscym', ('ss', 'suscym'), 'perc', pan=0.25, sends={'hall': -9}, hum_ms=0, rel=2.5)
    add('cym_swell', ('ss', 'cym_swell'), 'perc', pan=0.1, width=0.9, sends={'hall': -10}, hum_ms=0, rel=0.05)
    add('glock', ('ss', 'glock'), 'perc', pan=0.3, sends={'hall': -8}, hum_ms=3, rel=1.5)
    add('celesta', ('sf2', GU, 0, 8, False), 'perc', gain_db=-2, pan=0.25, sends={'hall': -7}, hum_ms=4)
    add('vibes', ('ss', 'vibes'), 'perc', pan=0.25, width=0.8, sends={'hall': -9, 'room': -12}, hum_ms=5, rel=1.4)
    add('chimes', ('ss', 'chimes'), 'perc', pan=0.2, sends={'hall': -7}, hum_ms=0, rel=2.0)
    add('bell', ('fn', bell_fn), 'perc', pan=0.1, sends={'hall': -10}, hum_ms=0)
    # chip
    add('lead', ('fn', chip_fn('pulse')), 'chip', gain_db=0, pan=0.08, sends={'room': -12, 'snes': -14}, hum_ms=0)
    add('lead2', ('fn', chip_fn('pulse')), 'chip', gain_db=-3, pan=-0.25, sends={'room': -12, 'snes': -14}, hum_ms=0)
    add('arp', ('fn', chip_fn('pulse')), 'chip', gain_db=-6, pan=0.3, sends={'snes': -10}, hum_ms=0)
    add('tri', ('fn', chip_fn('tri')), 'chip', gain_db=0, pan=0.0, hum_ms=0)
    add('noise', ('fn', chip_fn('noise')), 'chip', gain_db=-6, pan=0.15, sends={'room': -14}, hum_ms=0)
    add('beeper', ('fn', chip_fn('beeper')), 'chip', gain_db=-2, pan=0.0, sends={'room': -16}, hum_ms=0)
    add('sqbass', ('fn', chip_fn('pulse')), 'chip', gain_db=-2, pan=0.0, hum_ms=0)
    add('snes_piano', ('sf2', UPRIGHT_KW, 0, 0, False), 'chip', gain_db=-1, pan=-0.1, hum_ms=3,
        post=snes_post(store=16000, echo_ms=144, fb=0.3, mix=0.2, wobble=0))
    add('snes_vibes', ('ss', 'vibes'), 'chip', gain_db=-2, pan=0.2, hum_ms=3,
        post=snes_post(store=16000, echo_ms=144, fb=0.3, mix=0.25, wobble=0))
    add('snes_brass', ('ss', 'tpt_stac'), 'chip', gain_db=0, pan=0.1, hum_ms=3,
        post=snes_post(store=12000, echo_ms=144, fb=0.25, mix=0.18, wobble=0))
    add('snes_tbn', ('ss', 'tbn_stac'), 'chip', gain_db=0, pan=-0.1, hum_ms=3,
        post=snes_post(store=12000, echo_ms=144, fb=0.25, mix=0.18, wobble=0))
    add('snes_bass', ('sf2', GU, 0, 32, False), 'chip', gain_db=2, pan=0.0, hum_ms=3,
        post=snes_post(store=16000, echo_ms=0, wobble=0))
    add('snes_kit', ('sf2', GU, 128, 40, True), 'chip', gain_db=1, pan=0.0, hum_ms=3,
        post=snes_post(store=16000, echo_ms=0, wobble=0))
    add('snes_str', ('ss', 'vla'), 'chip', gain_db=-3, pan=0.0, width=0.8, hum_ms=6, rel=0.3,
        post=snes_post(store=16000, echo_ms=144, fb=0.35, mix=0.3, wobble=0))
    add('snes_cup', ('ss', 'tpt_stac'), 'chip', gain_db=1, pan=0.12, hum_ms=0,
        post=lambda b: snes_post(store=12000, echo_ms=144, fb=0.25, mix=0.18)(cup_mute(b)))
    add('snes_hn', ('ss', 'hn_stac'), 'chip', gain_db=0, pan=-0.2, hum_ms=0,
        post=snes_post(store=12000, echo_ms=144, fb=0.25, mix=0.18))
    add('snes_pizz', ('ss', 'vln_pizz'), 'chip', gain_db=0, pan=-0.15, hum_ms=0,
        post=snes_post(store=16000, echo_ms=144, fb=0.3, mix=0.22))
    add('snes_harp', ('ss', 'harp'), 'chip', gain_db=-1, pan=0.2, hum_ms=0,
        post=snes_post(store=16000, echo_ms=144, fb=0.3, mix=0.25))
    add('snes_cbpizz', ('ss', 'cb_pizz'), 'chip', gain_db=2, pan=0.05, hum_ms=0, latency_ms=10,
        post=snes_post(store=16000, echo_ms=0))
    add('snes_sax', ('ss', 'tsax_stac'), 'chip', gain_db=-1, pan=0.3, hum_ms=0,
        post=snes_post(store=12000, echo_ms=144, fb=0.25, mix=0.18))
    add('noisesweep', ('fn', noise_sweep_fn), 'chip', gain_db=-4, pan=0.0, sends={'room': -14}, hum_ms=0)
    # sub + fx
    add('sub', ('fn', sub_fn), 'sub', gain_db=0, hum_ms=0)
    add('drone', ('fn', drone_fn), 'sub', gain_db=-10, hum_ms=0)
    add('revswell', ('fn', revswell_fn), 'fx', gain_db=0, sends={'hall': -8}, hum_ms=0)
    add('shimmer', ('fn', shimmer_fn), 'fx', gain_db=0, sends={'hall': -4}, hum_ms=0)
    return T


# ------------------------------------------------------------------ pattern helpers
def brush_bar(a: Arr, bar, vel=0.6, swing=1.0, fill=False, sweep=True, kick=True, feather=0.28, taps=True):
    """Jazz brushes: L-hand sweep circles (one per 2 beats), R-hand taps on 2 & 4 with a swung 'a' pickup,
    feathered kick, hi-hat foot on 2 & 4."""
    b0 = fr(bar)
    if sweep:
        a.n('swish', 60, b0, 30, vel * 0.9, circles=1.0)
        a.n('swish', 60, b0 + 30, 30, vel * 0.9, circles=1.0)
    if taps:
        for bt in (2, 4):
            a.n('brush', 38, fr(bar, bt), 4, vel)                    # tap
        for bt in (1, 3):
            a.n('brush', 38, eighth(bar, bt, True, swing), 3, vel * 0.55)   # swung 'a' before 2/4 ... (ghost)
    a.n('jazz', 44, fr(bar, 2), 3, vel * 0.55)
    a.n('jazz', 44, fr(bar, 4), 3, vel * 0.55)
    if kick:
        for bt in (1, 2, 3, 4):
            a.n('jazz', 36, fr(bar, bt), 4, feather)
    if fill:
        for k, off in enumerate([0, 5, 10]):
            a.n('brush', 38, fr(bar, 4) + off, 3, vel * (0.55 + 0.12 * k))


def ride_bar(a: Arr, bar, vel=0.55, swing=1.0, hat=True, pattern='std'):
    """Swing ride: 1, 2 &(a), 3, 4 &(a)."""
    for bt in (1, 2, 3, 4):
        a.n('jazz', 51, fr(bar, bt), 6, vel * (1.0 if bt in (2, 4) else 0.85))
    for bt in (2, 4):
        a.n('jazz', 51, eighth(bar, bt, True, swing), 4, vel * 0.7)
    if hat:
        a.n('jazz', 44, fr(bar, 2), 3, vel * 0.8)
        a.n('jazz', 44, fr(bar, 4), 3, vel * 0.8)


def walk(a: Arr, inst, bar, notes, vel=0.7, dur=13.5, swing_ghost=None, body='cb_pizz', body_vel=0.55):
    """Quarter-note walking line. notes: 4 pitch names.  A real contrabass pizz is layered under the
    finger-style upright for wood and weight."""
    rng = np.random.default_rng(bar * 7 + 3)
    for i, p in enumerate(notes):
        if p is None:
            continue
        v = vel * (1.0 if i in (0, 2) else 0.93) * (1 + rng.normal(0, 0.04))
        t = fr(bar, i + 1) + float(np.clip(rng.normal(-0.1, 0.12), -0.3, 0.2))   # bass sits a hair ahead
        a.n(inst, p, t, dur, v, lock=True)
        if body:
            a.n(body, p, t, dur * 0.8, body_vel * v / vel, lock=True, rel=0.18)


def big_band_stab(a: Arr, hit_frame, voicing, vel=0.85, length=5.0, saxes=True, tuba=True, bass_note=None,
                  fall=False):
    """Short section stab: 3 trumpets on top, trombones below, tenor sax doubling the 4th voice.
    Micro-offsets & detune make it a *section*, not a sampler chord."""
    top = voicing[:3]
    low = voicing[3:]
    pans = [0.05, 0.25, 0.45]
    for i, p in enumerate(top):
        a.n('tpt_stac', p, hit_frame + [0.0, 0.12, 0.2][i], length, vel * [1.0, 0.92, 0.9][i], lock=True,
            pan=pans[i], detune=[0, 6, -5][i])
    for i, p in enumerate(low):
        a.n('tbn_stac', p, hit_frame + [0.1, 0.18, 0.05][i % 3], length + 0.5, vel * 0.9, lock=True,
            pan=[-0.15, -0.35, -0.5][i % 3], detune=[-4, 5, 0][i % 3])
    if saxes:
        a.n('tsax_stac', voicing[3], hit_frame + 0.15, length, vel * 0.8, lock=True, pan=0.35)
        a.n('tsax_stac', voicing[2], hit_frame + 0.25, length, vel * 0.7, lock=True, pan=0.55, detune=7)
    if tuba and bass_note:
        a.n('tuba_stac', bass_note, hit_frame, length + 1, vel * 0.85, lock=True)


# ------------------------------------------------------------------ one-shot clips (swells / rolls)
from engine.sampler import load_wav, trim_lead, ROOT as _SROOT
from fractions import Fraction as _Fr
from scipy import signal as _sig

_CLIP_PEAK = {}


def clip_fn(n: Note, rng):
    """Play a whole sample file. x: file (relative to theme-pack), align='start'|'peak', shift (semitones),
    env [(sec,gain)], tail (s).  With align='peak' the note spans [start, start+dur] and the file's loudest
    point lands at start+dur (for swells / risers)."""
    x = n.x
    y = trim_lead(load_wav(f"{_SROOT}/{x['file']}"))
    if x.get('shift'):
        f = _Fr(2 ** (-x['shift'] / 12)).limit_denominator(1200)
        y = _sig.resample_poly(y, f.numerator, f.denominator, axis=1).astype(np.float32)
    dur = f2s(n.dur)
    tail = x.get('tail', 1.5)
    if x.get('align') == 'peak':
        m = np.abs(y).max(0)
        k = int(0.05 * SR)
        e = np.convolve(m, np.ones(k) / k, mode='same')
        pk = int(np.argmax(e[: int(8 * SR)]))
        a = max(0, pk - int(dur * SR))
        y = y[:, a:pk + int(tail * SR)]
        if pk - a < int(dur * SR):          # pad front if the swell is shorter than requested
            y = np.pad(y, ((0, 0), (int(dur * SR) - (pk - a), 0)))
    else:
        y = y[:, :int((dur + tail) * SR)]
    y = y.copy()
    if x.get('env'):
        ts = [p[0] * SR for p in x['env']]
        y *= np.interp(np.arange(y.shape[1]), ts, [p[1] for p in x['env']]).astype(np.float32)[None]
    k = min(int(0.02 * SR), y.shape[1])
    y[:, -k:] *= np.linspace(1, 0, k)[None]
    return y * db(-20 * (1 - n.vel)) * db(x.get('gain', 0.0))


def add_clip_tracks(T):
    T['clip_perc'] = Track(name='clip_perc', src=('fn', clip_fn), stem='perc', sends={'hall': -9}, hum_ms=0)
    T['clip_drums'] = Track(name='clip_drums', src=('fn', clip_fn), stem='drums', sends={'room': -10, 'hall': -14},
                            hum_ms=0)
    return T


CYM_SWELL_25 = 'vcsl/Idiophones/Struck Idiophones/Suspended Cymbal 2/susCymb2_cresc_2.5s2.wav'
CYM_SWELL_4 = 'vcsl/Idiophones/Struck Idiophones/Suspended Cymbal 2/susCymb2_cresc_4s.wav'
CYM1_SHORT = 'vsco2ce/Percussion/susCymb1-cresc-Short_v1.wav'
TIMP_ROLL = {'F2': ('vsco2ce/Percussion/Timpani/Rolls/Timpani1_Roll_v5_rr1_Sum.wav', 41.47),
             'Bb1': ('vsco2ce/Percussion/Timpani/Rolls/Timpani2_Roll_v5_rr1_Sum.wav', 34.38),
             'Db2': ('vsco2ce/Percussion/Timpani/Rolls/Timpani3_Roll_v5_rr1_Sum.wav', 37.39),
             'Eb2': ('vsco2ce/Percussion/Timpani/Rolls/Timpani4_Roll_v5_rr1_Sum.wav', 39.84)}
SNARE_ROLL = 'vsco2ce/Percussion/Snare2-rollSN_v3_rr1_Sum.wav'


def timp_roll(a: Arr, target: str, start, dur, vel=0.8, env=None, drum='F2'):
    f, p = TIMP_ROLL[drum]
    shift = nm(target) - p
    a.n('clip_perc', 60, start, dur, vel, lock=True, file=f, shift=shift, tail=0.25,
        env=env or [(0, 0.15), (f2s(dur) * 0.7, 0.55), (f2s(dur), 1.0), (f2s(dur) + 0.25, 0.0)])


def felt(a: Arr, pitch, start, dur, vel, mech=True, inst='felt', **x):
    a.n(inst, pitch, start, dur, vel, **x)
    if mech and inst == 'felt':
        # the key/hammer thump follows its note's lock (a locked hit must not get a humanised thump ahead of it)
        a.n('felt_mech', 60, start, 2, min(1.0, vel + 0.2), lock=x.get('lock', False))


def air(db_air=1.5, db_pres=0.0, hp_hz=None):
    def f(buf):
        if hp_hz:
            buf = hp(buf, hp_hz, 2)
        if db_pres:
            buf = peq(buf, 3200, db_pres, 0.7)
        return shelf(buf, 9000, db_air, True)
    return f


def tape_peak(ratio=0.8, then=None):
    """Tape-style soft saturation relative to the stem's own peak (≈3 dB off the transients, body untouched)."""
    def f(buf):
        if then:
            buf = then(buf)
        pk = float(np.abs(buf).max()) + 1e-9
        T = pk * ratio
        return (T * np.tanh(buf / T)).astype(np.float32)
    return f


# ================================================================== v2.1 shared material (SCRIPT v2.1)
def cup_mute(buf):
    """Cup-mute colour on an open trumpet sample: darker, softer, a nasal 1 kHz bump."""
    buf = hp(buf, 220, 2)
    buf = lp(buf, 2600, 2)
    return peq(buf, 1000, 3.0, 1.1)


_LFSR = {}


def _lfsr_seq(short=False):
    if short not in _LFSR:
        reg, tap, out = 1, (6 if short else 1), np.empty(32767, dtype=np.float32)
        for i in range(32767):
            b = (reg & 1) ^ ((reg >> tap) & 1)
            reg = (reg >> 1) | (b << 14)
            out[i] = 1.0 if (reg & 1) else -1.0
        _LFSR[short] = out
    return _LFSR[short]


def noise_sweep_fn(n: Note, rng):
    """Chip noise riser: one continuous LFSR voice whose clock register steps up (and whose level
    steps up) at the 60 Hz driver rate - no retriggered attacks, so it never smears a downbeat.
    x: c0/c1 clock Hz, l0 start level (0-1), hp."""
    x = n.x
    dur = f2s(n.dur)
    L = int(dur * SR)
    t = np.arange(L) / SR
    tick = np.floor(t * 60.0) / 60.0
    u = np.clip(tick / max(dur, 1e-3), 0, 1)
    clk = x.get('c0', 3000.0) * (x.get('c1', 28000.0) / x.get('c0', 3000.0)) ** u
    ph = np.cumsum(clk / SR)
    seq = _lfsr_seq(x.get('short', False))
    y = seq[(ph.astype(np.int64) + int(rng.integers(0, 30000))) % len(seq)]
    y = hp(y, x.get('hp', 1500), 2)
    y = lp(y, 14000, 2)
    lev = x.get('l0', 0.15) + (1 - x.get('l0', 0.15)) * u ** 1.6
    lev = np.round(lev * 15) / 15
    k = int(0.004 * SR)
    lev = np.convolve(lev, np.ones(k) / k, mode='same')
    y = y * lev * _chip_level(n.vel, rng) * 0.6
    return to_stereo(y.astype(np.float32))


def vo_duck(stems, gen=-6.0, strings=-9.0, pluck=-3.0, exclude=('sub',)):
    """SCRIPT s3.2 / s9.6: every music stem except the sub -6 dB (strings -9 dB) over f23-91, 2-frame
    attack, 6-frame release, lifted inside the semicolon pause (f58-71) so the D-flat is heard; the f90
    pluck only -3 dB.  Baked into the music stems (the mix must not duck the music again)."""
    out = {}
    for s in stems:
        if s in exclude:
            continue
        g = strings if s == 'strings' else gen
        out[s] = [(0, 0.0), (21, 0.0), (23, g), (57, g), (63, 0.0), (70, 0.0), (72, g), (88, g), (90, pluck),
                  (91, pluck), (97, 0.0)]
    return out


# ---- bar 9: THE PLAYERS roll call (f480-539), SCRIPT s3.7 --------------------------------------------
# straight eighths in the music (+7.5); the picture cuts at floor(480 + 7.5 n) and leads by half a frame
ROLL_E = [480 + 7.5 * i for i in range(8)]
ROLL_CUTS = [480, 487, 495, 502, 510, 517, 525, 532]
ROLL_TOP = ['F5', 'F5', 'F5', 'F5', 'G5', 'Ab5', 'C6', 'F6']          # the knee
ROLL_CAST = ['TASYA', 'RADNUS', 'KRAM', 'NESNEJ', 'RIMA TAMURI', 'THE WHALE', 'RUMPT (silhouette)',
             'the player who does not exist yet (GLYPH cursor)']
# harmony: Fm9 x4 -> Dbmaj7(#11) x2 -> C7(#9b13) -> open fifth on F (no third)
ROLL_CHORD = ['Fm9'] * 4 + ['Dbmaj7(#11)'] * 2 + ['C7(#9b13)', 'F5 (open fifth F-C, no third)']
ROLL_BASS = ['F2', 'F2', 'F2', 'F2', 'Db2', 'Db2', 'C2', 'F1']
# 4-part brass under/with the top line: (tpt1, tpt2, tbn1, tbn2)
ROLL_BRASS = [('F5', 'C5', 'Eb4', 'Ab3')] * 4 + [('G5', 'C5', 'F4', 'Ab3'), ('Ab5', 'C5', 'F4', 'Ab3'),
                                                 ('C6', 'Ab5', 'E4', 'Bb3'), ('F6', 'C6', 'F4', 'C4')]
# the variation's harmony underneath (rootless piano / section inner voices)
ROLL_INNER = [('Ab3', 'C4', 'Eb4', 'G4')] * 4 + [('F3', 'Ab3', 'C4'), ('F3', 'C4', 'G4'),
                                                 ('E3', 'Bb3', 'Eb4', 'Ab4'), ('F2', 'C3', 'F3', 'C4')]
ROLL_VEL = [0.80, 0.70, 0.74, 0.70, 0.80, 0.84, 0.90, 0.94]     # flat four (accent on 1), then the leap climbs
ROLL_LEN = [4.0, 4.0, 4.0, 4.0, 4.0, 4.0, 4.5, 4.5]            # "open and short (about 4 frames)"
ROLL_RING = 539.5 - ROLL_E[7]                                  # stab 8 rings to f539


def roll_chip(a: Arr, octave_up=True, gain=0.0, vel=0.62):
    """The chip lead doubles the top line (25% pulse), an octave up by default; stab 8 rings to f539."""
    for i, f in enumerate(ROLL_E):
        p = nm(ROLL_TOP[i]) + (12 if octave_up else 0)
        d = 3.6 if i < 7 else ROLL_RING - 0.3
        a.n('lead', p, f, d, min(1.0, vel + 0.12 * (ROLL_VEL[i] - 0.7)), lock=True, duty=0.25, rel=0.04,
            sus=0.55 if i < 7 else 0.6, dec=0.08 if i < 7 else 0.2, vib=(10 if i == 7 else 0), vib_delay=0.1,
            gain=gain, tilt=-3.0 if p > 96 else -1.5)


def roll_counterline_end(a: Arr, inst_hi='vla', inst_lo='vc', vel=0.6):
    """The viola/cello counter-line's last note, F4 (and F3), sounds inside stab 1 and releases with it."""
    a.n(inst_hi, 'F4', 480, 3.8, vel, lock=True, offset=0.09, att=0.05, rel=0.07)
    a.n(inst_lo, 'F3', 480, 3.8, vel * 0.97, lock=True, offset=0.09, att=0.05, rel=0.07)


# ---- bar 10: the Harmon-muted trumpet (f540-599), SCRIPT s3.8 --------------------------------------------
HARMON_BAR10 = [('C5', 540, 25), ('Bb4', 565, 5), ('Ab4', 570, 15), ('D5', 585, 14)]


def harmon_bar10(a: Arr, vel=0.62, notes=None, fall=True):
    """Lazy, swung counter-line: C5 over f540-564, Bb4 on the swung 'and' of 10.2 (f565), Ab4 over f570-584,
    then a fall off D5 over f585-599 (the D is the 6th of Fm6 over the D bass)."""
    seq = [(nm(p), s, d, vel * (1.0 if i != 1 else 0.86)) for i, (p, s, d) in enumerate(notes or HARMON_BAR10)]
    ds = f2s(seq[-1][2])                     # the fall: hold ~45 % of the last note, then drop ~5 semitones
    last = dict(bend=[(0.0, 0.0), (0.45 * ds, 0.0), (0.95 * ds, -5.0)], env=[(0, 1.0), (0.45 * ds, 1.0), (ds, 0.0)],
                rel=0.05, overlap=0.0) if fall else None
    # a small scoop into the first note (a player's inflection, still locked to the grid)
    a.legato('harmon', seq[:1], overlap=1.2, lock=True, last=dict(rel=0.12, bend=[(0.0, -0.6), (0.07, 0.0)]))
    a.legato('harmon', seq[1:], overlap=1.2, lock=True, last=last, offset=0.09, att=0.05)


# ---- bar 11 riser + title chip arpeggio (SCRIPT s3.8 / s3.9) --------------------------------------------
BAR11_16THS = [600 + 3.75 * i for i in range(8)]      # straight 16ths: 615 and 622.5 are on the grid
ARP11 = ['Db5', 'F5', 'Ab5', 'C6', 'C5', 'E5', 'G5', 'Bb5']
TITLE_ARP = [('F5', 630.0), ('Bb5', 633.75), ('Eb6', 637.5), ('F6', 641.25)]   # straight 16ths into the F6


def title_chip(a: Arr, vel=0.6, vib=14, sustain_to=686.0, over='C6', tri='F3'):
    for i, (p, f) in enumerate(TITLE_ARP[:3]):
        a.n('lead', p, f, 3.2, vel * (0.85 + 0.05 * i), lock=True, duty=0.25, rel=0.03, sus=0.6, dec=0.1)
    f6 = TITLE_ARP[3][1]
    a.n('lead', 'F6', f6, sustain_to - f6, vel, lock=True, duty=0.25, vib=vib, vib_delay=0.35, rel=0.4, sus=0.6,
        dec=0.8)
    if over:
        a.n('lead2', over, 630, 50, vel * 0.8, lock=True, duty=0.125, rel=0.4, sus=0.5, dec=0.8)
    if tri:
        a.n('tri', tri, 630, 50, vel, lock=True, rel=0.4, sus=0.7)


def title_sub(a: Arr, vel=1.0, decay=2.2):
    """f630 sub drop C2 (65.4 Hz) -> F1 (43.7 Hz) over 1.6 s: never through A1 (F's major third)."""
    a.n('sub', 'C2', 630, 50, vel, lock=True, decay=decay, punch=4, glide_to=nm('F1'), glide_s=1.6)


# ---- 1993 (f120-179), SCRIPT s3.3 --------------------------------------------------------------------------
def era_1993_core(a: Arr, swung=False, piano='felt', piano_vel=0.42, bdrum=True):
    """The drop on Fm(add9) and the beeper's flat line.  The machine plays straight (F f120 / f127.5 / f135);
    V3 swings it (F f120 / f130 / f135).  The SFX owns the f150 bonk."""
    a.n('sub', 'F1', 120, 44, 1.0, lock=True, decay=1.1, punch=11, rel=0.15)     # the sub holds under the dialog
    if bdrum:
        a.n('bdrum', 60, 120, 20, 0.5, lock=True)
    a.n('beeper', 'Ab4', 120, 4, 0.45, lock=True)
    a.n('beeper', 'C5', 120, 4, 0.45, lock=True)
    off = 130.0 if swung else 127.5
    for f, v in [(120, 0.72), (off, 0.62), (135, 0.66)]:
        a.n('beeper', 'F5', f, 4.5, v, lock=True)
    a.n('sqbass', 'F2', 120, 6, 0.62, lock=True, duty=0.5, max_hz=5000, rel=0.03, sus=0.8)
    a.n('sqbass', 'F2', 135, 5, 0.55, lock=True, duty=0.5, max_hz=5000, rel=0.03, sus=0.8)
    for f in (120, off):
        a.n('noise', 60, f, 1, 0.5, lock=True, clock=30000, rel=0.02, dec=0.02, sus=0.0)
    # the piano's left hand: Fm9 (F2 C3 Ab3 G4), pedalled to f164
    if piano:
        for q, p in enumerate(['F2', 'C3', 'Ab3', 'G4']):
            a.n(piano, p, 120 + 0.25 * q, 44, piano_vel * (1.0 if q == 0 else 0.85), lock=True)
    # OK -> beeper C6 + square C3 (f165), then F (f172)
    a.n('beeper', 'C6', 165, 5, 0.66, lock=True)
    a.n('sqbass', 'C3', 165, 5, 0.52, lock=True, duty=0.5, max_hz=5000, rel=0.03, sus=0.8)
    a.n('beeper', 'F6', 172, 6, 0.70, lock=True)
    a.n('noise', 60, 165, 1, 0.45, lock=True, clock=30000, rel=0.02, dec=0.02, sus=0.0)


def era_1993_front(a: Arr, arp=True, tri=True, vel=0.5):
    """f168-179: the chip gains voices as the render front passes - the rising arpeggio F-Ab-C-Eb-F
    (f168/170/172/174/176), a second pulse voice and a triangle bass by f179."""
    if arp:
        for p, f in zip(['F5', 'Ab5', 'C6', 'Eb6', 'F6'], [168, 170, 172, 174, 176]):
            a.n('arp', p, f, 1.8, vel, lock=True, duty=0.25, rel=0.03, sus=0.5, dec=0.06)
        a.n('lead2', 'C5', 174, 2.5, vel * 0.8, lock=True, duty=0.125, rel=0.03, sus=0.5)
        a.n('lead2', 'F5', 176, 3.6, vel * 0.85, lock=True, duty=0.125, rel=0.04, sus=0.6)
    if tri:
        a.n('tri', 'F2', 176, 3.8, 0.6, lock=True, rel=0.03, sus=0.7)


def hook_2008(swing=1.0):
    """Bar 4: the whole knee, swung: F f180 . F f190 . F f195 . F f205 . G f210 . Ab f220 . C f225 . F f235."""
    return [(p, swing_pos(4, i, swing)) for i, p in enumerate(['F5', 'F5', 'F5', 'F5', 'G5', 'Ab5', 'C6', 'F6'])]


DINNER_WALKS = {5: ['F2', 'Ab2', 'C3', 'D3'], 6: ['Db3', 'C3', 'Ab2', 'F2'], 7: ['Bb2', 'Ab2', 'F2', 'Db2'],
                8: ['C2', 'E2', 'G2', 'Gb2']}
COUNTER_LINE = [('C5', 255, 22), ('Bb4', 280, 5), ('Ab4', 285, 15),
                ('G4', 300, 30), ('F4', 330, 10), ('G4', 340, 5), ('Ab4', 345, 15),
                ('C5', 360, 42), ('Db5', 405, 10), ('C5', 415, 5),
                ('Bb4', 420, 15), ('Ab4', 435, 10), ('G4', 445, 5), ('E4', 450, 28.5)]   # -> F4 inside stab 1


def reed_organ(a: Arr, vel=0.55):
    """ALYI: a harmonium swell on a D-flat pedal, f285-299, sounding into the f300 hit and dying away."""
    for p in ['Db3', 'Ab3', 'Db4']:
        a.n('reed', p, 285, 30, vel, lock=True)


REED_AUTO = [(0, 0.0), (285, 0.12), (297, 1.0), (300, 1.0), (312, 0.55), (318, 0.0)]


def trumpet_rip(a: Arr, target='C5', start=414.0, end=419.4, vel=0.8, n=3):
    """Brass accent #5: a trumpet-section rip up to C, f414-419, the pickup into the f420 shout."""
    dur = end - start
    tops = [target, target, nm(target) - 5][:n]
    for k, p in enumerate(tops):
        a.n('tpt', p, start + 0.15 * k, dur, vel * [1.0, 0.9, 0.85][k], lock=True, pan=[0.05, 0.25, 0.45][k],
            detune=[0, 6, -5][k], att=0.02, rel=0.06, bend=[(0.0, -9.0), (f2s(dur) * 0.8, 0.0)],
            env=[(0, 0.35), (f2s(dur) * 0.85, 1.0), (f2s(dur), 1.0)])
