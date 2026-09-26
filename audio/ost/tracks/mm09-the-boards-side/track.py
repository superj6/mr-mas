"""MM-09 "The Board's Side" + MM-09x "What They Didn't Know"  (composer C; OST-BIBLE s5.C1)
To picture: Ep1 sc 27 (E01-S27a-h, 14:34-16:25, pass one of THE BLIP, TOLD TWICE) and sc 28 (E01-S28, the
card WHAT THEY DIDN'T KNOW, 1 bar + 1 beat).  Bar 1 = 14:34.0 = sc 27's downbeat (MM-08's Rewind lands here).

THE EXIT RULE (s1.4, s5.C1): PROCEDURE, straight -- no piano, no chip, no swing, 0 ms humanisation (s6.9 item 5).
The orchestra plays the board with dignity; Mas exists only as record, so he gets silence, never a motif.
Dry under every real line (the D6-style mutes below are the "leaves on the first word" stops).  The ONLY chip
and felt in the cue are in 09x, the door back: a chip F6 on the REVERSAL and a single felt F4 on the card's
extra beat, which rings into MM-10 (composer D).

  a  NOON          b1-12   Step Four in half notes at "the call goes on"; its blank step IS the drop-out for
                           "super." (b2.3).  Then a B-flat pedal and a straight-eighth spiccato pulse (3+3+2,
                           never one pitch) under a chromatic viola whisper D-flat -> G; Mada's spinner
                           (harp, C5-Db5 in quarter triplets); Neleh's clockwork pizzicato on her lines
                           (b9, b10); the Door (flute, through the door) over the GPU choir at b12.
  b  NOV 18        b13-16  The hearts: harp-led falling F-minor-pentatonic streams over a D-flat bed (F
                           pentatonic over Db = Dbmaj9(13): the employees' warmth), thinning to one harp
                           harmonic (Db6) for the blue heart; out before his post.
  c  BOARDROOM     b17-26  Step Four three times (clarinet top; muted-horn top + the Door on Alyi's
                           reflected lines; chromatic clarinet whisper), each blank = the F bass alone; a
                           B-flat hold; the sincere beat (b24): a solo viola line plays the three steps in
                           quarters; on `?` (b25) step four gets Neleh's question C6 -> Db6 over the lone F
                           bass (the Db is the Ache's b13: she asks the machine's question without knowing
                           it).  Out before the four dial tones (b26).
  d  LIGHTHOUSE    b27-32  The Lighthouse (marimba + harp, the 3-note cell across 4/4) from the first ring;
                           the quartet's Addendum on "some thoughts" (b29), gaining a bar; the click CUTS the
                           tail (b31.3); the Lighthouse runs on; on "How much?" the tail finally lands (b32.3)
                           -- deceptively, on Gbmaj9 with Db5 on top: sold, not resolved.  (The B-flat cadence
                           stays reserved for Ep12, s2.8.)
  e  NOV 19 camera b33-34  Dry.  The landing's low G-flat is the sustain before; a low Bb/F fifth after (b34.4).
  f  TTEMME        b35-38  A straight-mute trumpet accent on the spotlight (F4 -> Bb4, the knee's fourth);
                           the pulse again (a new CEO, the same procedure); the card dips a beat; the
                           hourglass: pizzicato grains one per beat, falling (b37.2-b38.4).
  g  11:53 PM      b39-42  Tasya's floor, one held step: Abmaj9 -> Cmaj9 (a mediant) on the wall's palette
                           step, silent string attacks; the Rhodes comps on the beats when she appears (the
                           key ring owns the offbeats); out before her post.
  h  STEP FOUR?    b43-44  Step Four's three chords, and the fourth blank again (the F bass alone).
  09x  THE CARD    b45-46  REVERSAL on the downbeat: a C pickup leaps to F (C4 -> F5 in the violins), strings +
                           open horns + timpani + ONE chip F6, F(add9) with no third; on the card's extra beat
                           (b46.1) everything cuts and a single felt F4 answers: his room comes back first.

Run:  ../../../.venv-theme/bin/python track.py [--no-stems --no-loop] [--no-parts]
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, '..', '..')))
sys.path.insert(0, HERE)
from engine import *   # noqa: E402,F401,F403
from engine.core import hp as _hp, lp as _lp   # noqa: E402
from engine.sampler import GU   # noqa: E402
from engine.arrange import CREDIT_GU, CREDIT_VS   # noqa: E402
import numpy as np   # noqa: E402
from dataclasses import replace as _rep   # noqa: E402

TID = 'mm09-the-boards-side'

META = dict(
    id=TID,
    mm='MM-09',
    title="The Board's Side / What They Didn't Know",
    family='P02 PROCEDURE (the table; an exit from his POV) + P08 OUTS KIT (09x: REVERSAL)',
    tone="their side, played straight and with dignity: a procedure that keeps going and a fourth step that "
         "is always blank; then the door back",
    usage='BI',
    tags=['procedure', 'exit', 'told-twice', 'pass one', 'board', 'reversal', 'to picture', 'Ep1 Act Four'],
    scenes=['E01-S27a NOON b1-12 (14:34.0)', 'E01-S27b NOV 18 hearts b13-16', 'E01-S27c boardroom night b17-26',
            'E01-S27d LIGHTHOUSE b27-32', 'E01-S27e NOV 19 camera b33-34', 'E01-S27f TTEMME b35-38',
            'E01-S27g 11:53 PM b39-42', 'E01-S27h Step four? b43-44', 'E01-S28 card b45.1-b46.2 (+ felt ring)'],
    motifs=['STEP_FOUR (a b1-2; c b17, b19, b21; sincere quarters b24; h b43)', 'DOOR (a b12, c b19.3)',
            'GPU_CHOIR (a b12)', 'NELEH_CLOCKWORK (a b9, b10)', 'NELEH_QUESTION (c b25)',
            'MADA_SPINNER (a b3-4)', 'LIGHTHOUSE (d b27-32)', 'ADDENDUM + tail (d b29-31, cut; lands b32.3)',
            'HOURGLASS (f b37.2-38.4)', 'TASYA_FLOOR one step (g b39)', 'REVERSAL C -> F (09x b45)'],
    motif_ids=['STEP_FOUR', 'DOOR', 'LIGHTHOUSE', 'ADDENDUM', 'NELEH_CLOCKWORK'],
    key='B-flat minor centre (Step Four); D-flat lydian (Alyi); B-flat minor (Mario); Abmaj9 -> Cmaj9 (Tasya); '
        'F(add9) no third (09x)',
    composer='OST composer C (fix 1: composer A)',
    version='1.1 (fix 1, 2026-09-26)',
    description='Fix 1 (2026-09-26): rule 12 -- under the viola whisper\'s A3 (b8.3-b9.3) the spiccato pulse leaves '
                'out F (Eb3, E3, Gb3 instead), so no A-natural sounds a third over any F; the clarinet whisper '
                'stops on Bb3 (its A3 rang into the blank\'s F bass); the blank\'s contrabass F1 is notched at '
                '111 Hz (a sample body resonance read as A2); re-rendered on the fixed engine.',
    album_lufs=-16.0,                    # a quiet procedural cue: the album master may sit at -16 (s6.5)
    audition=[],                         # filled in build() with timecodes
)

# ---------------------------------------------------------------------------------------------- tracks
def door_post(buf):
    """'Through the door' (s2.9): low-passed, and the room on ONE side only (short right-side reflections)."""
    y = _lp(_hp(buf, 180, 2), 2300, 2)
    out = y.copy()
    r = np.zeros_like(y[1])
    for ms, gdb in ((19, -8), (37, -11), (61, -14), (97, -18)):
        d = int(ms * 48)
        r[d:] += y[1][:-d] * 10 ** (gdb / 20)
    out[1] += _lp(r, 1800, 1)
    out[0] *= 0.55
    return out.astype(np.float32)


def tracks():
    T = palette()
    for tr in T.values():                # the exit: 0 ms humanisation (s6.9 item 5); velocity jitter kept small
        tr.hum_ms = 0.0
        tr.drift_ms = 0.0
        tr.vel_jit = 0.03
    T['door'] = Track('door', ('art', 'fl'), 'winds', credit=CREDIT_VS, pan=0.5, width=0.35, sends={'hall': -20},
                      hum_ms=0, vel_jit=0.0, rel=0.5, post=door_post)
    T['choir'] = Track('choir', ('sf2', GU, 0, 52, False), 'winds', credit=CREDIT_GU, gain_db=-7, pan=0.45, width=0.5,
                       sends={'hall': -16}, hum_ms=0, vel_jit=0.0, post=door_post)
    T['reed'].post = door_post
    T['reed'].pan = 0.45
    T['reed'].gain_db = -9
    T['svla'] = Track('svla', ('art', 'svln'), 'strings', credit=CREDIT_VS, pan=0.2, width=0.35, sends={'hall': -9},
                      hum_ms=0, vel_jit=0.0, rel=0.6, eq=[('lp', 3000), ('peq', 350, 2.0, 0.9)])  # the solo viola line
    T['harm'] = Track('harm', ('ss', 'harp'), 'strings', credit=CREDIT_VS, pan=-0.25, width=0.6, sends={'hall': -7},
                      hum_ms=0, vel_jit=0.0, rel=2.0, eq=[('hp', 350), ('lp', 3600)])   # harp harmonics
    T['svln'].hum_ms = 0.0
    T['svln'].pan = -0.2
    T['rhodes'].balance = 'fx'           # s5.C1: "the Rhodes counts as colour", not as piano
    T['rhodes'].pan = 0.35
    T['cb'].gain_db = -2
    # fix 1 (rule 12, the engine's F-major trace 2026-09-26): the blank's F1 plays the solo contrabass's Gb1 sample a
    # semitone down, and that sample carries a body resonance which lands at ~111 Hz (an A2) -- 6-10 dB under its
    # strongest partial, in every blank.  The F1 notes (and only they) go to 'cb_f1': the same contrabass with a
    # narrow notch there (Q 8, -10 dB at 111.3 Hz; F1's own partials at 87 and 131 Hz move < 1.5 dB).
    T['cb_f1'] = _rep(T['cb'], name='cb_f1', eq=list(T['cb'].eq) + [('peq', 111.3, -10.0, 8.0)])
    T['marimba'].gain_db = -3
    T['harp'].gain_db = 0
    T['felt'].sends = {'room': -16}      # 09x: the felt F4, close and near-dry (his room)
    return T


# ---------------------------------------------------------------------------------------------- helpers
TASTO = 1600          # sul tasto: a low-passed bowed pad
S4 = [  # Step Four (s2.14): bass, inner (low -> high), top.  Parallel fifths top to bass.
    ('Bb2', ['Db3', 'F3', 'C4'], 'F4'),      # Bbm(add9)
    ('Ab2', ['C3', 'Eb3', 'Bb3'], 'Eb4'),    # Ab(add9)
    ('Gb2', ['Bb2', 'Db3', 'F3'], 'Db4'),    # Gbmaj7
]


def step_four(a, bar, top='hn', inner=('bsn', 'vla', 'vln2'), vel=0.3, blank=True, unit=2.0, top_vel=None,
              blank_len=None):
    """Step Four as a chorale.  unit=2 -> half notes over 2 bars; unit=1 -> quarters in 1 bar.  blank=True:
    step four is the F bass alone (vc F2 + cb F1); blank=False: nothing (the drop-out is the blank)."""
    g = a.g
    q0 = g.bar_q(bar)
    for i, (bass, mids, tp) in enumerate(S4):
        t = g.tq(q0 + i * unit)
        d = g.tq(q0 + (i + 1) * unit) - t
        ov = 0.06 if i < 2 else 0.0
        a.n('vc', bass, t, d + ov, vel, lock=True, art='sus', lp=TASTO, att=0.05 if i else 0.0)
        a.n('cb', nm(bass) - 12, t, d + ov, vel * 0.8, lock=True, art='sus', lp=900, att=0.05 if i else 0.0)
        for inst, p in zip(inner, mids):
            kw = dict(art='sus', lp=TASTO) if inst in ('vla', 'vln2', 'vln1', 'vc') else {}
            a.n(inst, p, t, d + ov, vel * 0.9, lock=True, att=0.05 if i else 0.0, **kw)
        tv = top_vel or vel
        if top == 'hn':
            a.n('hn', tp, t, d + ov, tv, lock=True, art='mute')
            a.n('cl', tp, t, d + ov, tv * 1.35, lock=True, art='sus')          # the clarinet carries the line
        elif top == 'cl':
            a.n('cl', tp, t, d + ov, tv, lock=True, art='sus')
        elif top:
            a.n(top, tp, t, d + ov, tv, lock=True, art='sus', lp=2200)
    if blank:
        t = g.tq(q0 + 3 * unit)
        d = blank_len if blank_len is not None else g.tq(q0 + 4 * unit) - t
        a.n('vc', 'F2', t, d, vel * 0.9, lock=True, art='sus', lp=TASTO)
        a.n('cb_f1', 'F1', t, d, vel * 0.75, lock=True, art='sus', lp=900)


ACC = [1.0, 0.78, 0.8, 0.95, 0.78, 0.8, 0.9, 0.78]       # 3+3+2


def pulse(a, bar, cell, vel=0.34, skip=(), inst='vc'):
    """One bar of the straight-eighth spiccato pulse (varied pitches; accents 3+3+2)."""
    for i, p in enumerate(cell):
        if i in skip or p is None:
            continue
        a.n(inst, p, (bar, 1 + 0.5 * i), '1/8', vel * ACC[i], lock=True, art='spic')


CELLS = {  # B-flat minor pulse cells (never one pitch at an even rate)
    'A': ['Bb2', 'F3', 'Db3', 'Bb2', 'F3', 'Db3', 'C3', 'F3'],
    'B': ['Bb2', 'Gb3', 'Eb3', 'Bb2', 'F3', 'Db3', 'C3', 'Db3'],
    'C': ['Bb2', 'F3', 'Eb3', 'Bb2', 'Gb3', 'Db3', 'Eb3', 'F3'],
    'D': ['Bb2', 'F3', 'Db3', 'Bb2', 'E3', 'Db3', 'C3', 'F3'],
    # fix 1 (rule 12): the two bars under the viola whisper's A3 (b8.3-b9.3) carry no F (see build(), section a)
    'A8': ['Bb2', 'F3', 'Db3', 'Bb2', 'Eb3', 'Db3', 'C3', 'E3'],     # b8 (beats 1-1.5 rest): the F3s -> Eb3, E3
    'B9': ['Bb2', 'Gb3', 'Eb3', 'Bb2', 'Gb3', 'Db3', 'C3', 'Db3'],   # b9 (beats 1-1.5 rest): the F3 on b9.3 -> Gb3
}


def pedal(a, t0, t1, vel=0.22, fifth=False):
    a.n('cb', 'Bb1', t0, a.g.at(t1) - a.g.at(t0), vel, lock=True, art='sus', lp=700, att=0.25)
    if fifth:
        a.n('vc', 'F2', t0, a.g.at(t1) - a.g.at(t0), vel * 0.85, lock=True, art='sus', lp=TASTO, att=0.3)


def spinner(a, t0, n, vel=0.2):
    """Mada's spinner: C5-Db5, a two-note loop (quarter-note triplets against the straight pulse)."""
    g = a.g
    q = g.qt(g.at(t0))
    for i in range(n):
        a.n('harm', 'C5' if i % 2 == 0 else 'Db5', g.tq(q + i * 2 / 3), 0.35, vel * (1.0 if i % 2 == 0 else 0.85),
            lock=True)


def clockwork(a, at, first='F5', vel=0.3):
    """Neleh (s2.16): a precise 16th pizzicato mechanism on varied pitches."""
    line = 'F5/16 C5/16 Ab4/16 C5/16 G5/16 C5/16 Ab4/16 C5/16' if first == 'F5' else \
        'G5/16 C5/16 Ab4/16 C5/16 F5/16 C5/16 Ab4/16 C5/16'
    ns = a.line('vln1', line, at, vel=vel, lock=True, art='pizz')
    ns[0].vel = min(1.0, vel * 1.3)                    # the mechanism's first tick


def sw_env(dur, a_s=0.9, r_s=0.8):
    """A silent attack (s2.16 Tasya's floor) and a soft release, as a sample envelope."""
    return [(0.0, 0.0), (min(a_s, dur * 0.5), 1.0), (max(dur - r_s, dur * 0.5), 1.0), (dur, 0.0)]


PENT = ['F3', 'Ab3', 'Bb3', 'C4', 'Eb4', 'F4', 'Ab4', 'Bb4', 'C5', 'Eb5', 'F5', 'Ab5', 'Bb5', 'C6']


def cascade(a, b0, b1, seed=27, dens0=2.0, dens1=9.0, vel0=0.26, vel1=0.46):
    """The hearts (s5.C1 b): overlapping FALLING pentatonic streams, harp-led (a texture, not a note per
    heart); the density and level rise to the burial, then stop.  Low violas double the low notes (no tiptoe)."""
    g = a.g
    rng = np.random.default_rng(seed)
    t0, t1 = g.at(b0), g.at(b1)
    t = t0
    k = 0
    while t < t1:
        u = (t - t0) / (t1 - t0)
        dens = dens0 + (dens1 - dens0) * u ** 1.4                  # streams per bar
        n_notes = int(rng.integers(4, 8))
        step = g.beats_s(rng.choice([0.25, 1 / 3, 0.25, 1 / 6]), t)
        top = int(np.clip(len(PENT) - 1 - rng.integers(0, 4) - int(3 * u), 5, len(PENT) - 1))
        vel = vel0 + (vel1 - vel0) * u
        pan = (-0.45 if k % 2 == 0 else 0.35) + rng.uniform(-0.1, 0.1)
        for j in range(n_notes):
            tj = t + j * step
            if tj >= t1:
                break
            p = PENT[max(0, top - j)]
            a.n('harp', p, tj, 0.6, vel * (1.0 - 0.07 * j), lock=True, pan=pan)
            if nm(p) < nm('Eb4') and j % 2 == 0:
                a.n('vla', p, tj, 0.2, vel * 0.55, lock=True, art='pizz')
        k += 1
        t += g.bar_s(1) / dens * rng.uniform(0.6, 1.3)


# ---------------------------------------------------------------------------------------------- the cue
SECTIONS = [('a', 1, 13), ('b', 13, 17), ('c', 17, 27), ('d', 27, 33), ('e', 33, 35), ('f', 35, 39),
            ('g', 39, 43), ('h', 43, 45), ('09x', 45, 47)]
SEC_NOTES = {}          # section -> its notes (filled by build(); the parts renderer uses it)
MUTES_BARS = [          # dry windows: the music leaves on the first word / the post's pop (s1.6, s6.9)
    ((2, 3), (3, 1), 'real line: "super." (his voice on their speaker; no music under)'),
    ((5, 3), (6, 3), 'real line: GERG post "...I quit." [V]'),
    ((11, 1), (12, 1), 'real line: ALYI "You can call it this way" [V]'),
    ((15, 4), (17, 1), 'real line: MAS post "...sorta like reading your own eulogy..." [V]'),
    ((26, 1), (27, 1), 'out before the four speakerphone dial tones (SFX)'),
    ((33, 2), (34, 4), 'real line: MAS post "first and last time i ever wear one of these" [V]'),
    ((41, 1), (42, 1), 'real line: TASYA post read aloud "a new advanced AI research team" [V]'),
]


def MACRO(g):
    """The fader ride (every stem): the REVERSAL keeps its forte timbre but sits at -14 LUFS-M over a -20 bed."""
    return [(0.0, 0.0), (g.t(44, 4.4), 0.0), (g.t(44, 4.45), REV_DB), (g.t(47), REV_DB)]


REV_DB = -9.0


def build():
    g = Grid(bpm=96, meter='4/4', bars=46, swing=0.0)
    a = Arr(g)
    T = tracks()
    SEC_NOTES.clear()

    def begin():
        return len(a.notes)

    def end(label, i0):
        SEC_NOTES[label] = SEC_NOTES.get(label, []) + a.notes[i0:]

    # ============================================================ a · NOON (b1-12)
    i0 = begin()
    a.section('a NOON', 1, 13)
    # the call goes on: Step Four in half notes; step four is the drop-out for "super." (b2.3)
    step_four(a, 1, top='hn', vel=0.25, blank=False, top_vel=0.15)
    a.n('cb', 'Bb1', (1, 1), '1/8', 0.42, lock=True, art='pizz')
    a.ch('harm', ['Bb3', 'F4'], (1, 1), 1.2, 0.3, lock=True)            # the call connects: a harp-harmonic dyad
    a.mark('a: Step Four (the Rewind lands; Bbm(add9))', (1, 1))
    # the procedure goes on: Bb pedal, the spiccato pulse, the viola whisper (chromatic, falling)
    pedal(a, (3, 1), (5, 2), 0.2)
    a.n('cb', 'Bb1', (3, 1), '1/8', 0.36, lock=True, art='pizz')
    pulse(a, 3, CELLS['A'], vel=0.3)
    pulse(a, 4, CELLS['B'], vel=0.3)
    pulse(a, 5, CELLS['A'][:4], vel=0.3)
    for (bb, bt), (eb, et), p in [((3, 1), (4, 3), 'Db4'), ((4, 3), (5, 2), 'C4')]:
        a.n('vla', p, (bb, bt), g.at((eb, et)) - g.at((bb, bt)) + 0.05, 0.2, lock=True, art='sus', lp=TASTO,
            att=0.4)
    spinner(a, (3, 1), 12, 0.2)                                             # Mada's spinner keeps turning
    # after Gerg's post: the pulse resumes under the second toast and the keycaps (SFX F5-C7: we stay low)
    pedal(a, (6, 3), (10, 4), 0.2)
    a.n('cb', 'Bb1', (6, 3), '1/8', 0.36, lock=True, art='pizz')
    pulse(a, 6, [None, None, None, None] + CELLS['C'][4:], vel=0.3)
    pulse(a, 7, CELLS['D'], vel=0.3)
    # fix 1 (rule 12): while the whisper passes A3 (b8.3-b9.3) the pulse leaves out F, so no A-natural ever
    # sounds a major third over an F.  The whisper keeps its line cliche (Bbm -> Bbm(maj7) -> Bbm7 -> Bbm6);
    # under the A the pulse takes the 11th (Eb3: a suspended colour) and a chromatic E3 that falls to b9's Eb3;
    # on b9.3, as the whisper reaches Ab3, the pulse takes Gb3 (cell B's own) instead of F3.
    pulse(a, 8, CELLS['A8'], vel=0.3, skip=(0, 1))                                   # RIMA's card: the score dips a beat
    pulse(a, 9, CELLS['B9'], vel=0.27, skip=(0, 1))                 # the pulse yields to Neleh's clockwork
    pulse(a, 10, CELLS['C'], vel=0.27, skip=(7,))
    for (bb, bt), (eb, et), p in [((6, 3), (7, 3), 'B3'), ((7, 3), (8, 3), 'Bb3'), ((8, 3), (9, 3), 'A3'),
                                  ((9, 3), (10, 3), 'Ab3'), ((10, 3), (10, 4.5), 'G3')]:
        a.n('vla', p, (bb, bt), g.at((eb, et)) - g.at((bb, bt)) + 0.05, 0.2, lock=True, art='sus', lp=TASTO,
            att=0.3)
    clockwork(a, (9, 1), 'F5', 0.27)                                         # NELEH: "For how long?"
    clockwork(a, (10, 1), 'G5', 0.23)                                       # ...listening, one brow up
    a.mark('a: Neleh clockwork', (9, 1))
    # the doorway: the Door, through the door, over the GPU choir (ppp)
    place_motif(a, 'door', 'DOOR', (12, 1), vel=0.42, lock=True, art='nv')
    for inst, v in (('choir', 0.32), ('reed', 0.26)):
        for p in chord_of('GPU_CHOIR'):
            a.n(inst, p, (12, 1), g.at((13, 4)) - g.at((12, 1)), v, lock=True)
    end('a', i0)

    # ============================================================ b · NOV 18, the hearts (b13-16)
    i0 = begin()
    a.section('b NOV 18 hearts', 13, 17)
    for inst, p, v in (('vc', 'Db3', 0.22), ('vla', 'Ab3', 0.2), ('vln2', 'F4', 0.16)):
        a.n(inst, p, (13, 3), g.at((15, 3)) - g.at((13, 3)), v, lock=True, art='sus', lp=TASTO,
            env=sw_env(g.at((15, 3)) - g.at((13, 3)), 1.2, 1.4))
    a.n('cb', 'Db2', (13, 3), g.at((15, 3)) - g.at((13, 3)), 0.2, lock=True, art='sus', lp=700, att=0.6)
    cascade(a, (13, 3), (14, 4.5), dens1=7.0, vel0=0.22, vel1=0.36)
    a.mark('b: the hearts begin', (13, 3))
    # the blue heart: one harp harmonic, alone
    a.n('harm', 'Db6', (15, 1), 1.0, 0.36, lock=True, env=[(0, 1.0), (0.9, 0.35), (1.6, 0.0)])
    end('b', i0)

    # ============================================================ c · the boardroom at night (b17-26)
    i0 = begin()
    a.section('c boardroom night', 17, 27)
    step_four(a, 17, top='cl', vel=0.22, top_vel=0.24)
    a.n('cb', 'Bb1', (17, 1), '1/8', 0.34, lock=True, art='pizz')
    step_four(a, 19, top='hn', vel=0.18, top_vel=0.13)
    place_motif(a, 'door', 'DOOR', (19, 3), vel=0.55, lock=True, art='nv')   # on Alyi's reflected lines
    step_four(a, 21, top='vln1', vel=0.2, blank_len=g.at((23, 1)) - g.at((22, 3)))
    # the whisper stops for step four.  fix 1 (rule 12 scan): it used to take one more step, to A3 on b22.2, whose
    # tail (and hall) rang into the blank's lone F bass -- an A falling onto F.  Now it stops a step early: Bb3 holds
    # to the blank, so the whisper's next step is missing too, like the procedure's.
    a.seq('cl', [('Db4', (21, 1), '2b'), ('C4', (21, 3), '1b'), ('B3', (21, 4), '1b'), ('Bb3', (22, 1), '1.9b')],
          vel=0.21, lock=True, art='sus')
    pedal(a, (23, 1), (24, 1), 0.2, fifth=True)                             # hold: the reflection flickers
    # the sincere beat: her real face.  A solo viola line plays the three steps; Step Four in quarters beneath.
    a.seq('svla', [('F4', (24, 1), '1b', 0.52), ('Eb4', (24, 2), '1b', 0.5), ('Db4', (24, 3), '2b', 0.48)],
          lock=True, art='sus')
    step_four(a, 24, top=None, inner=('vla', 'vln2', 'vln1'), vel=0.14, unit=1.0, blank=False)
    a.n('vc', 'F2', (25, 1), '3.3b', 0.15, lock=True, art='sus', lp=TASTO, rel=0.3)
    a.n('cb_f1', 'F1', (25, 1), '3.3b', 0.11, lock=True, art='sus', lp=600, rel=0.3)
    # `?`: step four gets Neleh's question, C6 -> Db6 (one high string, flautando)
    a.n('svln', 'C6', (25, 1), '1.5b', 0.38, lock=True, art='sus', att=0.18, lp=2600)
    a.n('svln', 'Db6', (25, 2.5), g.at((26, 1)) - g.at((25, 2.5)) - 0.08, 0.38, lock=True, art='sus', att=0.1,
        lp=2600, env=[(0, 1.0), (0.6, 0.8), (1.45, 0.0)])
    end('c', i0)

    # ============================================================ d · LIGHTHOUSE (b27-32)
    i0 = begin()
    a.section('d LIGHTHOUSE', 27, 33)
    for rep, vm in ((27, 1.0), (30, 0.72)):                                # the beam dims under the quartet
        ns = place_motif(a, 'marimba', 'LIGHTHOUSE', (rep, 1), vel=0.34 * vm, lock=True)
        ns += place_motif(a, 'harp', 'LIGHTHOUSE', (rep, 1), vel=0.26 * vm, lock=True)
        if rep == 27:
            for n in ns:
                if n.start >= g.t(29) - 1e-6:
                    n.vel *= 0.72
        a.n('celesta', 'F5', (rep, 1), '1b', 0.2, lock=True)
    a.n('vc', 'Bb2', (27, 1), g.at((29, 1)) - g.at((27, 1)), 0.22, lock=True, art='sus', lp=TASTO, att=0.3)
    a.mark('d: the Lighthouse on the ring', (27, 1))
    # the Addendum (quartet: solo violin lead, viola, cello, soft bass), on "some thoughts"
    place_motif(a, 'svln', 'ADDENDUM', (29, 1), vel=0.52, lock=True, art='sus', rel=0.25)
    a.seq('vla', [('F3', (29, 1), '4b'), ('Db3', (30, 1), '2b'), ('Eb3', (30, 3), '2b'), ('Eb3', (31, 1), '2b')],
          vel=0.22, lock=True, art='sus', rel=0.05)
    a.seq('vc', [('Bb2', (29, 1), '4b'), ('Gb2', (30, 1), '2b'), ('F2', (30, 3), '2b'), ('F2', (31, 1), '2b')],
          vel=0.22, lock=True, art='sus', rel=0.05)
    a.seq('cb', [('Bb1', (29, 1), '4b', 0.18), ('Gb1', (30, 1), '1.9b', 0.16)], lock=True, art='sus', lp=500, rel=0.2)
    # (the bass rests on the F7sus4: the F1's partials read as A-natural in the s6.9 check below 80 Hz)
    a.mark('d: the Addendum', (29, 1))
    # the tail (the gained bar) climbs ... and the click cuts it on b31.3
    a.line('svln', MOTIFS['ADDENDUM']['tail'].replace('r/4', '') + ' Eb4/8 F4/8', (31, 1), vel=0.52, lock=True,
           art='sus', gate=1.0, rel=0.03)
    # "How much?": the tail finally lands -- deceptively (Gbmaj9, Db5 on top): sold, not resolved
    a.seq('svln', [('Gb4', (32, 1), '1b', 0.46), ('Ab4', (32, 2), '1b', 0.48), ('Db5', (32, 3), '2.4b', 0.5)],
          lock=True, art='sus', rel=0.45)
    a.seq('vla', [('Gb3', (32, 1), '2b'), ('F3', (32, 3), '2.4b')], vel=0.22, lock=True, art='sus', rel=0.45)
    a.seq('vc', [('Eb2', (32, 1), '2b'), ('Gb2', (32, 3), '2.4b')], vel=0.22, lock=True, art='sus', rel=0.45)
    a.seq('cb', [('Eb1', (32, 1), '2b'), ('Gb1', (32, 3), '2.4b')], vel=0.17, lock=True, art='sus', lp=700, rel=0.45)
    a.mark('d: "How much?" -- the tail lands (sold)', (32, 3))
    end('d', i0)

    # ============================================================ e · NOV 19, the security camera (b33-34)
    i0 = begin()
    a.section('e NOV 19 camera (dry)', 33, 35)
    pedal(a, (34, 4), (39, 1), 0.2, fifth=True)                             # the low sustain after (-> f)
    end('e', i0)

    # ============================================================ f · NOV 19 night, TTEMME (b35-38)
    i0 = begin()
    a.section('f TTEMME', 35, 39)
    a.n('cb', 'Bb1', (35, 1), '1/8', 0.34, lock=True, art='pizz')
    a.seq('tpt', [('F4', (35, 1), '1/8', 0.23), ('Bb4', (35, 1.5), '1.5b', 0.22)], lock=True, art='straight',
          rel=0.3)
    a.mark('f: the spotlight (straight-mute accent)', (35, 1))
    pulse(a, 35, CELLS['A'], vel=0.26)
    pulse(a, 36, CELLS['D'], vel=0.26, skip=(0, 1))                          # TTEMME's card: the dip
    for i, (inst, p) in enumerate([('vln1', 'F5'), ('vln2', 'Db5'), ('vla', 'C5'), ('vln1', 'Bb4'),
                                   ('vln2', 'Ab4'), ('vla', 'Gb4'), ('vln2', 'F4')]):
        a.n(inst, p, g.tq(g.bar_q(37) + 1 + i), 0.3, 0.34 - 0.012 * i, lock=True, art='pizz')
    a.mark('f: the hourglass (one grain per beat, falling)', (37, 2))
    end('f', i0)

    # ============================================================ g · 11:53 PM, Tasya's floor (b39-42)
    i0 = begin()
    a.section('g 11:53 PM (Tasya)', 39, 43)
    d1 = g.at((39, 3)) - g.at((39, 1)) + 0.9
    for inst, p in (('vc', 'Ab2'), ('vla', 'Eb3'), ('vln2', 'G3'), ('vln1', 'C4')):
        a.n(inst, p, (39, 1), d1, 0.26, lock=True, art='sus', lp=TASTO, env=sw_env(d1, 0.8, 0.9))
    a.n('cb', 'Ab1', (39, 1), d1, 0.2, lock=True, art='sus', lp=800, env=sw_env(d1, 0.8, 0.9))
    d2 = g.at((41, 1)) - g.at((39, 3)) - 0.02
    for inst, p in (('vc', 'C3'), ('vla', 'G3'), ('vln2', 'B3'), ('vln1', 'D4')):
        a.n(inst, p, (39, 3), d2, 0.26, lock=True, art='sus', lp=TASTO, env=sw_env(d2, 0.9, 0.35))
    a.n('cb', 'C2', (39, 3), d2, 0.2, lock=True, art='sus', lp=800, env=sw_env(d2, 0.9, 0.35))
    for bt in (3, 4):                                                       # Tasya: the Rhodes on the beats
        a.ch('rhodes', ['E3', 'G3', 'B3', 'D4'], (40, bt), '0.8b', 0.4, lock=True)
    pedal(a, (42, 1), (43, 1), 0.2, fifth=True)
    end('g', i0)

    # ============================================================ h · "Step four?" "Good question." (b43-44)
    i0 = begin()
    a.section('h Step four?', 43, 45)
    a.n('cb', 'Bb1', (43, 1), '1/8', 0.34, lock=True, art='pizz')
    step_four(a, 43, top='hn', vel=0.24, top_vel=0.15, blank_len=g.at((44, 4.5)) - g.at((44, 3)))
    end('h', i0)

    # ============================================================ 09x · WHAT THEY DIDN'T KNOW (b45 + 1 beat)
    i0 = begin()
    a.section('09x REVERSAL (card)', 45, 47)
    pk = (44, 4.5)                                                          # the C pickup (an eighth)
    H = g.t(45)
    for inst, ps, v in (('vln1', ['C4'], 0.62), ('vln2', ['C4'], 0.6), ('vla', ['C4'], 0.58), ('vc', ['C3'], 0.62),
                        ('cb', ['C2'], 0.6)):
        for p in ps:
            a.n(inst, p, pk, '1/8', v, lock=True, art='spic')
    art.stab(a, 'hn', ['C4'], pk, vel=0.62, length=0.26, spread_ms=3)
    # the downbeat: F(add9), no third; one stab, then air
    ring = g.bar_s(45)
    decay = [(0, 1.0), (0.18, 0.62), (1.2, 0.3), (ring, 0.12)]
    for inst, ps, v in (('vln1', ['F5', 'C6'], 0.8), ('vln2', ['C5', 'G5'], 0.76), ('vla', ['F4', 'C5'], 0.74),
                        ('vc', ['F3', 'C4'], 0.76), ('cb', ['F2'], 0.72)):
        art.sus(a, inst, ps, H, ring, vel=v, lock=True, env=decay, rel=0.6)
        art.spic(a, inst, ps[:1], H, vel=v * 0.9, lock=True)                # a bite on the front
    art.stab(a, 'hn', ['C5', 'G4', 'F4'], H, vel=0.72, length=0.35, spread_ms=4)
    art.swell(a, 'hn', ['F4', 'C5'], H + 0.12, ring - 0.2, 'mf', 'p', shape='log', lock=True, rel=0.5)
    a.n('lead', 'F6', H, g.beats_s(3, H), 0.5, lock=True, duty=0.25, vib=10, vib_delay=0.35, rel=0.4, sus=0.5,
        dec=0.9)
    a.ch('harp', ['F2', 'C3', 'F3', 'C4', 'G4', 'C5', 'F5'], H - 0.14, 1.5, 0.5, lock=True, roll=0.02)
    a.n('timp', 'F2', H, 0.6, 0.6, lock=True)
    a.mark('09x: REVERSAL (the card)', (45, 1))
    # the card's extra beat: everything cuts; a single felt F4 -- his room comes back first
    FB = g.t(46)
    a.n('felt', 'F4', FB, g.beats_s(3, FB), 0.42, lock=True)
    a.mark('09x: the felt F4 (the door back)', (46, 1))
    end('09x', i0)

    # ------------------------------------------------------------ windows, cut-offs, meta
    mutes = [(g.at(s), g.at(e)) for s, e, _ in MUTES_BARS]
    cut = [(0.0, 0.0), (FB - 0.004, 0.0), (FB, -120.0), (FB + 30, -120.0)]
    stem_auto = {k: cut for k in ('strings', 'winds', 'brass', 'perc', 'chip', 'bass')}
    # checked from 5 ms after the stop (past the mute's own 3 ms fade) to 20 ms before the re-entry (sample
    # latency pre-roll of the next entrance)
    META['silence_windows'] = [(g.at(s) + 0.005, g.at(e) - 0.02, lab, -70.0) for s, e, lab in MUTES_BARS
                               if lab.startswith('real line')]
    META['no_third_windows'] = [(H + 0.1, FB - 0.02)]
    META['sfx_slots'] = [
        dict(t=(2, 3), sfx='his voice on their laptop speaker: "super." (dialogue)'),
        dict(t=(5, 1), sfx='system toast: GERG MOCKBRAN has left'), dict(t=(6, 3), sfx='toast: BUKAJ has left'),
        dict(t=(7, 1), sfx='keycap_popcorn (F5-C7): the score stays at/below F4 there'),
        dict(t=(8, 1), sfx='RIMA card freeze hit (score dips 1 beat)'),
        dict(t=(17, 1), sfx='every phone buzzes'), dict(t=(22, 1), sfx='phones buzz harder'),
        dict(t=(26, 1), sfx='speakerphone: four dial tones, one per beat (tune to F4 Eb4 Db4 C4: s6.8 request 1)'),
        dict(t=(27, 1), sfx='the throne phone rings (first ring = the cut)'),
        dict(t=(29, 3), sfx='ADELINA card freeze hit'), dict(t=(31, 3), sfx='*Click.* (cuts the Addendum tail)'),
        dict(t=(31, 4), sfx='second phone rings'), dict(t=(36, 1), sfx='TTEMME card freeze hit (score dips 1 beat)'),
        dict(t=(37, 1), sfx='hourglass flip (3 drawings)'), dict(t=(40, 3), sfx='key-ring jangle on the offbeats'),
        dict(t=(45, 1), sfx='card: freeze_hit_F if the card carries one (the REVERSAL is in F)'),
    ]
    META['audition'] = [
        '0:00-0:05 (b1-2): Step Four under the call, and the stop on b2.3 for "super." -- does the blank fourth '
        'step read as the drop-out (a procedure that simply omits him), not as a mistake?',
        '0:05-0:25 (b3-10): the spiccato pulse + Bb pedal + the chromatic viola whisper -- scheming, not villainy; '
        'does anything read as a heartbeat? (it should not: 3+3+2, varied pitches)',
        'FIX 1, 0:18.75-0:21.3 (b8.3-b9.3): under the whisper\'s A3 the pulse now plays Eb3 / E3 / Gb3 where it had '
        'F3 -- does the whisper still read as the minor line cliche (Bbm -> Bbm(maj7) -> Bbm7), with no F-major '
        'colour anywhere? Is the pulse still the same procedure (no new tune)?',
        'FIX 1, the blanks (0:43.75, 0:48.75, 0:53.75, 1:00.0, 1:48.75): the lone F bass now has its contrabass notched at '
        '111 Hz, and the clarinet whisper stops on Bb3 before the b22 blank -- does the F still sound full and '
        'dark, and does anything still sound major?',
        '0:30-0:40 (b13-16): the hearts -- a warm pour that buries the grid, not "pizzicato tiptoe"; is the one '
        'harp harmonic at 0:35 (b15) alone enough to be the blue heart?  FIX 1 (engine): the harp\'s soft notes now '
        'play from its medium layer, and the section reads 1.2 dB louder -- too bright or forward?',
        '0:57-1:02.5 (b24-25): Neleh\'s sincere beat -- do we care about her at the hold? Is the solo line (a '
        'solo violin sample on its low strings, darkened, standing in for a solo viola) sincere, not sad-violin?',
        '1:05-1:17.5 (b27-32): Mario -- does anything sound Nintendo (marimba + harp in quarters)? Does the '
        'click at 1:16.25 (b31.3) cut the tail cleanly, and does the Gbmaj9 landing on "How much?" read as sold?',
        '1:50-1:53 (b45-46): 09x -- a reversal, not a fanfare; then the cut to a single felt F4 at 1:52.5: does '
        'his room come back first? Check it against the MM-10 downbeat at 1:53.125 (b46.2).',
    ]
    sc = Score(TID, g, T, a.notes, markers=a.markers, sections=a.sections, mutes=mutes, stem_auto=stem_auto,
               macro=MACRO(g), length_s=g.t(46, 2), tail_s=4.5, meta=META)
    return sc


# ---------------------------------------------------------------------------------------------- parts
def hold_bars(g):
    """One hold bar per section (s5.C1 'Loops'), written for the conform: {name: (notes, bar, ref_part)}."""
    out = {}

    def arr():
        return Arr(g)
    # a / f: the Bb pedal + pulse (1 bar, bar 7's harmony)
    h = arr()
    h.n('cb', 'Bb1', (7, 1), g.bar_s(7) + 1.4, 0.22, lock=True, art='sus', lp=700, env=sw_env(g.bar_s(7) + 1.4, 0.7, 0.7))
    pulse(h, 7, CELLS['D'])
    out['e01-s27a-hold'] = (h.notes, 7, 'e01-s27a')
    h = arr()
    h.n('cb', 'Bb1', (35, 1), g.bar_s(35) + 1.4, 0.2, lock=True, art='sus', lp=700,
        env=sw_env(g.bar_s(35) + 1.4, 0.7, 0.7))
    h.n('vc', 'F2', (35, 1), g.bar_s(35) + 1.4, 0.17, lock=True, art='sus', lp=TASTO,
        env=sw_env(g.bar_s(35) + 1.4, 0.7, 0.7))
    pulse(h, 35, CELLS['A'], vel=0.3)
    out['e01-s27f-hold'] = (h.notes, 35, 'e01-s27f')
    # b: the hearts' texture at mid density over the Db bed
    h = arr()
    L = g.bar_s(14) + 1.4
    for inst, p, v in (('vc', 'Db3', 0.22), ('vla', 'Ab3', 0.2), ('vln2', 'F4', 0.16)):
        h.n(inst, p, (14, 1), L, v, lock=True, art='sus', lp=TASTO, env=sw_env(L, 0.7, 0.7))
    cascade(h, (14, 1), (15, 1), seed=41, dens0=4.0, dens1=4.0, vel0=0.32, vel1=0.32)
    out['e01-s27b-hold'] = (h.notes, 14, 'e01-s27b')
    # c / h: the blank -- the F bass alone (and c's Bb hold)
    h = arr()
    L = g.bar_s(23) + 1.4
    h.n('cb', 'Bb1', (23, 1), L, 0.2, lock=True, art='sus', lp=700, env=sw_env(L, 0.7, 0.7))
    h.n('vc', 'F2', (23, 1), L, 0.17, lock=True, art='sus', lp=TASTO, env=sw_env(L, 0.7, 0.7))
    out['e01-s27c-hold'] = (h.notes, 23, 'e01-s27c')
    h = arr()
    L = g.bar_s(44) + 1.4
    h.n('vc', 'F2', (44, 1), L, 0.27, lock=True, art='sus', lp=TASTO, env=sw_env(L, 0.7, 0.7))
    h.n('cb_f1', 'F1', (44, 1), L, 0.22, lock=True, art='sus', lp=900, env=sw_env(L, 0.7, 0.7))
    out['e01-s27h-hold'] = (h.notes, 44, 'e01-s27h')
    # d: the Lighthouse's own 3-bar cycle (it realigns every 3 bars) + the cello pedal
    h = arr()
    place_motif(h, 'marimba', 'LIGHTHOUSE', (27, 1), vel=0.34, lock=True)
    place_motif(h, 'harp', 'LIGHTHOUSE', (27, 1), vel=0.26, lock=True)
    h.n('celesta', 'F5', (27, 1), '1b', 0.2, lock=True)
    L = g.bar_s(27) * 3 + 1.4
    h.n('vc', 'Bb2', (27, 1), L, 0.22, lock=True, art='sus', lp=TASTO, env=sw_env(L, 0.8, 0.8))
    out['e01-s27d-hold3'] = (h.notes, 27, 'e01-s27d')
    # g: the floor's held step (Cmaj9), crossfaded over the seam
    h = arr()
    L = g.bar_s(40) + 1.4
    for inst, p in (('vc', 'C3'), ('vla', 'G3'), ('vln2', 'B3'), ('vln1', 'D4')):
        h.n(inst, p, (40, 1), L, 0.26, lock=True, art='sus', lp=TASTO, env=sw_env(L, 0.7, 0.7))
    h.n('cb', 'C2', (40, 1), L, 0.2, lock=True, art='sus', lp=800, env=sw_env(L, 0.7, 0.7))
    out['e01-s27g-hold'] = (h.notes, 40, 'e01-s27g')
    return out


def render_parts(sc, workers=None):
    from parts import Parts
    g = sc.grid
    P = Parts(sc, HERE, TID, workers=workers)
    names = {'a': 'e01-s27a-noon', 'b': 'e01-s27b-nov18-hearts', 'c': 'e01-s27c-boardroom-night',
             'd': 'e01-s27d-lighthouse', 'e': 'e01-s27e-nov19-camera', 'f': 'e01-s27f-ttemme',
             'g': 'e01-s27g-1153pm', 'h': 'e01-s27h-step-four', '09x': 'e01-s28-what-they-didnt-know'}
    for lab, b0, b1 in SECTIONS:
        notes = SEC_NOTES.get(lab, [])
        if lab == 'e':
            continue                                    # e is dry; its low sustain after lives in f's lead-in
        if lab == '09x':
            P.linear(names[lab], notes, (44, 4.5), (46, 2), tail_s=4.5, fit_window=(0.2, 3.0),
                     note='the card alone (from the C pickup, an eighth before b45.1): REVERSAL + the felt F4 on '
                          'the extra beat, ringing on; measure it alone at -14 LUFS-M (s6.5)')
            P.k['e01-s28'] = P.k[names[lab]]
            continue
        tail = 2.5 if lab != 'a' else 3.0
        if lab == 'f':                                   # f carries e's low sustain (it enters on b34.4)
            notes = SEC_NOTES.get('e', []) + notes
        P.linear(names[lab], notes, b0, b1, tail_s=tail,
                 note=f'section {lab}: bars {b0}-{b1 - 1}, with its own ring-out as the 1-bar overlapping tail')
        P.k[f'e01-s27{lab}'] = P.k[names[lab]]
    for name, (notes, bar, ref) in hold_bars(g).items():
        nb = 3 if name.endswith('hold3') else 1
        P.loop(name, notes, bar, bar + nb, gain_from=ref,
               note=f'hold {"3 bars" if nb == 3 else "bar"} for the conform (repeat <= 2 passes, s6.6)')
    P.save(extra=dict(bar1='14:34.0 = E01 sc 27 downbeat (MM-08 Rewind lands here)',
                      handoff_out='b46.1 felt F4 rings into MM-10 (composer D) from b46.2'))


if __name__ == '__main__':
    # --no-parts: the engine build only.  --parts-only: the parts only (needs the underscore master on disk).
    # Parts render with the engine's own workers (fix 3, 2026-09-26: each track renders in its own forked child,
    # with a timeout guard), so the old workers=1 workaround for the pool hang is gone.
    do_parts = '--no-parts' not in sys.argv
    only = '--parts-only' in sys.argv
    sys.argv = [x for x in sys.argv if x not in ('--no-parts', '--parts-only')]
    os.environ.setdefault('OST_WORKERS', '3')
    if not only:
        cue = render_cli(build, __file__)
    if do_parts or only:
        print('[parts]', flush=True)
        render_parts(build())
