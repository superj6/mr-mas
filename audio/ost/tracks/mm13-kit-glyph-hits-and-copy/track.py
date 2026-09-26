"""MM-13 KIT  --  the GLYPH hits, the Q* bar and THE COPY at every lag.  Composer D.  OST-BIBLE s5.D2 (the kits),
s2.5 (THE COPY's curve, GLYPH's learning curve), s1.5 (the dread devices).  Companion to the MM-13 suite
(tracks/mm13-outside-intended-scope).

A KIT, not a cue: every item sits in its own slot on a bar line, separated by digital silence (hard stops), with a
marker on its sync point and a section per slot.  96 BPM, 4/4, straight, 0 ms humanising (the machine).

  slots 1-12  (2 bars each)   H01-H12  GLYPH HITS, each <= 2.0 s (hard-cut at 2.0 s, tails included), three per
                                        stage colour: L1 grains (H01-H03), L2 scrambled (H04-H06), L3 almost
                                        (H07-H09), L4 runaway (H10-H12).  Tokens only {F G Ab C Db} (+Eb in L4), F4-Db6.
  slot 13     (2 bars)        QSTAR    1 bar: a glass F (F3 C4 F4) swelling with the vault's F hum (the SFX
                                        vault_hum_F is the root: diegetic into score), the Ache's Db5 on beat 3,
                                        CUT DEAD on the next downbeat (Ep1 sc 31 / sc 33, before the button chord).
  slots 14-22 (3 bars each)   C1a-C7   THE COPY: the Water Line (s2.2) played back by chip against MM-01, at each lag of
                                        the s2.5 table.  The slot's first downbeat = MM-01's Water Line downbeat
                                        (marker 'ref').  C1a/b/c: a beat late, breaking off after 2, 3 and 4 notes (Ep1
                                        sc 19, the hands runner: two fingers, a pinky, a hand).  C2: a beat late in
                                        three-part harmony (Ep2, the sycophant).  C3: an eighth late (Eps 3-5).  C4: a
                                        sixteenth late (Eps 6-8).  C5: in sync, quantised (Ep9).  C6: in sync, swung
                                        (Eps 10-11).  C7: a sixteenth AHEAD, better voiced (Ep12; its pickup sits in
                                        the silence before its slot).

STEMS.  The COPY is on the CHIP stem only (the deliverable: lay it against MM-01).  The PIANO stem is a GUIDE: the
felt Water Line at the reference, so a human can hear the lag -- never use it in a mix.  The sub pressure is on the
BASS stem (the editor may drop it under room_drone / server_hum).  Levels: hits -17 to -16 LUFS-M; the COPY -24 LUFS-S
(a hint).  FIX 1 (2026-09-26): the sub is a floor (as in the suite), so every slot passes s6.5 on the full mix (META
room_sfx marks all 22); H02's harp front is 3 dB lower (the soft harp now plays the tuned mf sample, engine fix 2).
"""
import os
import numpy as np
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))
from engine import *   # noqa: E402,F401,F403
from engine import texture   # noqa: E402
from engine.sampler import GU   # noqa: E402

META = dict(
    id='mm13-kit-glyph-hits-and-copy',
    mm='MM-13',
    title='Outside Intended Scope: GLYPH hits, Q* and THE COPY (kit)',
    family='P05 GLYPH',
    tone='the machine\'s punctuation: twelve polite dread blinks, the vault\'s swell, and Mas\'s own tune played '
         'back to him a little closer each episode',
    usage='BI',
    tags=['kit', 'GLYPH', 'hits', 'Q*', 'THE COPY', 'dread', 'hard stops'],
    scenes=['H01-H12: GLYPH hits Eps 1-9 on the dread curve (Ep1: the Orb\'s scan, the iris, the RESERVED lamp...)',
            'QSTAR: Ep1 sc 31 (the vault) and sc 33 (before the button chord)',
            'C1a-C1c: Ep1 sc 19 hands runner (items 2-4)', 'C2: Ep2 CHATGTP', 'C3: Eps 3-5', 'C4: Eps 6-8',
            'C5: Ep9 "mostly." replay', 'C6: Eps 10-11 (the Intern, the Researcher)', 'C7: Ep12 (the supper)'],
    motifs=['TOKENS (grains, scrambled, reversed, almost, the runaway, stream)', 'THE ACHE', 'the chord with no third',
            're-rendering (a glass tone swapped mid-note for its sample-chip copy)', 'THE COPY of the Water Line at '
            'every lag'],
    motif_ids=['WATER_LINE'],
    key='F pedal + the Ache; the COPY in F minor',
    composer='Composer D (OST batch 1)',
    underscore_lufs=-21.0,
    album_lufs=-16.0,
    audition=[
        '65.0-87.5 s (C1a-C1c, with the piano-stem GUIDE): THE COPY a beat late, breaking off after 2, 3, 4 notes -- '
        'with MM-01 under Ep1 sc 19, is it noticeable only on a SECOND viewing? (the target; chip at -24 LUFS-S)',
        '0-57.5 s (H01-H12) against picture and the SFX glyph grains: dread blinks, never UI bleeps; none may read as '
        'an interface sound (the SFX own dings, chimes and clicks)',
        '60.0-62.5 s (QSTAR) with the SFX vault_hum_F laid in: does the glass swell BECOME the hum, and is the cut at '
        '62.5 s dead enough for the button chord?',
        '87.5 s (C2): the sycophant\'s three-part COPY -- cloying on purpose, or just pretty?',
        '125.0 s (C7): a sixteenth AHEAD -- does it sound like it knows the tune before he plays it, not like a sync '
        'error?',
        '40.0-42.0 s (H09): the glass F swapped mid-note for its sample-chip copy -- audible as the world being '
        're-rendered, or as a glitch?',
    ],
)

WL = [('F4', 1, 1.0), ('F4', 2, 1.0), ('F4', 3, 1.0), ('G4', 4, 0.5), ('F4', 4.5, 0.5), ('C4', 5, 1.0), ('F4', 6, 3.0)]
# the Water Line (s2.2) as (pitch, beat-from-the-downbeat (1-based, two bars), length in beats); 4.5 = the swung nudge


def build():
    HITS = 12
    n_bars = HITS * 2 + 2 + 9 * 3
    g = Grid(bpm=96, meter='4/4', bars=n_bars, swing=0.0)
    a = Arr(g)
    T = palette()
    for k in T:
        T[k].hum_ms = 0.0
        T[k].vel_jit = 0.0
        T[k].drift_ms = 0.0
    # fix1 (2026-09-26): the sub read -3.6 to -12 dB of the total power below 60 Hz in the hits; s6.5 wants <= -18 dB
    # under room_drone / server_hum, which may lie under any item.  The same floor as the suite: -9 dB overall and a
    # low shelf (-11 dB at 90 Hz) on the F1.  Q*'s F2 swell comes down with it: the vault's own F hum is the root.
    T['subp'] = Track('subp', ('fn', texture.tex_fn), 'bass', credit='engine synthesis (no samples)', hum_ms=0.0,
                      vel_jit=0.0, gain_db=-12.0, eq=[('ls', 90.0, -11.0)])
    T['glass_snes'] = Track('glass_snes', ('sf2', GU, 0, 92, False), 'synth', credit='GeneralUser GS by S. Christian '
                            'Collins', gain_db=-6, hum_ms=0.0, vel_jit=0.0, sends={'hall': -12}, eq=[('hp', 150)],
                            post=snes_post(7000, 0, 0.0, 0.0))
    T['lead2'].gain_db = -2
    T['arp'].gain_db = -13
    T['arp'].pan = 0.35
    T['celesta'].gain_db = -2
    T['celesta'].eq = [('lp', 5000)]
    T['bell'].gain_db = -3
    T['glasspad'].gain_db = -6
    for k in ('vln1', 'vln2'):
        T[k].eq = [('lp', 2400), ('hp', 120)]
        T[k].gain_db = -8
    T['felt'].gain_db = -12                  # the GUIDE (piano stem): audition only
    T['lead'].gain_db = -6                   # THE COPY
    T['tri'].gain_db = -12                   # the Ep12 COPY's triangle 8vb (per velocity unit the triangle is far hotter than a pulse)
    T['lead'].sends = {'room': -16}
    CH = dict(duty=0.125, rel=0.04, dec=0.12, sus=0.35, att=0.002, vib=0.0, max_hz=2600)
    mutes = []

    def tok(inst, ps, t0, vel=0.5, dbl=True):
        """Straight 16th tokens from t0 (None = a rest)."""
        out = []
        for i, p in enumerate(ps):
            if p is None:
                continue
            t = t0 + g.beats_s(0.25 * i, t0)
            acc = (1.0, 0.8, 0.9, 0.8)[i % 4]
            out.append(a.n(inst, p, t, g.beats_s(0.14, t), vel * acc, True, **CH))
            if dbl and i % 2 == 0:
                a.n('arp', nm(p) + 0.1, t, g.beats_s(0.12, t), vel * acc * 0.8, True, **CH)
        return out

    def sub(t0, d, peak, fi=0.3, fo=1.0, root='F1', inten=0.3):
        a.n('subp', root, t0, d, peak, True, kind='dread', voicing='none', air=False, intensity=inten, fade_in=fi,
            fade_out=fo)

    def ache(t0, d, peak=0.5, glass=0.4):
        a.ch('glasspad', ['G4', 'Db5'], t0, d, glass, True)
        a.n('tex', 'F2', t0, d, peak, True, kind='dread', voicing='ache', air=False, intensity=0.35, fade_in=0.15,
            fade_out=min(0.6, d * 0.4))

    # ============================================================ H01-H12: GLYPH hits (<= 2 s each)
    names = ['H01 L1 the scan (grains F5 -> C6, sub puff)', 'H02 L1 the iris (the Ache blinks)',
             'H03 L1 the lamp (open fifth F-C, a Db6 grain)', 'H04 L2 scrambled burst (Ab F C G)',
             'H05 L2 the knee REVERSED (F C Ab G F F F F)', 'H06 L2 the chord with no third (F C G)',
             'H07 L3 almost (F F F F G Ab Db) + violins F-C-G', 'H08 L3 the Ache, held (Db6 grain)',
             'H09 L3 re-rendered (glass F5 swapped mid-note for its sample-chip copy)',
             'H10 L4 the runaway burst (past the knee\'s end)', 'H11 L4 sub drop into a glass Db6',
             'H12 L4 the stream (dense tokens rising)']
    for i in range(HITS):
        bar = 1 + 2 * i
        t0 = g.t(bar)
        a.section(names[i][:3], bar, bar + 2)
        if i != 10:
            a.mark(names[i], t0)
        mutes.append((t0 + 2.0, g.t(bar + 2)))
        if i == 0:
            a.n('celesta', 'F5', t0, 0.6, 0.72, True)
            a.n('bell', 'C6', t0 + g.beats_s(1, t0), 0.2, 0.62, True, len=1.2, bright=0.45)
            sub(t0, 1.9, 0.78, 0.2, 1.2)
        elif i == 1:
            ache(t0, 1.9, 0.7, 0.62)
            a.n('harp', 'Db5', t0, 1.0, 0.36, True, gain=-3.0)                # the front: a harp pluck (fix1: -3 dB:
            #   the soft harp now plays the mf sample at a soft level (engine fix 2) and read +2.8 dB, -15.0 LUFS-M)
            a.n('celesta', 'Db6', t0 + g.beats_s(1.5, t0), 0.5, 0.6, True)
        elif i == 2:
            a.n('bell', 'F4', t0, 0.2, 0.56, True, len=1.8, bright=0.4)
            a.n('bell', 'C5', t0 + 0.004, 0.2, 0.5, True, len=1.8, bright=0.4)
            a.n('celesta', 'Db6', t0 + g.beats_s(0.5, t0), 0.5, 0.48, True)
            sub(t0, 1.9, 0.66, 0.1, 1.2)
        elif i == 3:
            tok('lead2', ['Ab4', 'F4', 'C5', 'G4', None, 'F4'], t0, 0.62)
            a.ch('glasspad', ['F3', 'C4', 'G4'], t0, 1.9, 0.44, True)
        elif i == 4:
            ks = tok('lead2', ['F5', 'C5', 'Ab4', 'G4', 'F4', 'F4', 'F4', 'F4'], t0, 0.62)
            a.n('celesta', 'F5', t0, 0.5, 0.5, True)
            sub(t0, 1.9, 0.64, 0.1, 0.9)
        elif i == 5:
            a.ch('glasspad', ['F3', 'C4', 'G4'], t0, 1.9, 0.56, True)
            a.n('celesta', 'C6', t0, 0.5, 0.5, True)                          # the front
            a.n('bell', 'G5', t0 + g.beats_s(1, t0), 0.2, 0.44, True, len=1.2, bright=0.4)
            sub(t0, 1.9, 0.74, 0.15, 1.0)
        elif i == 6:
            tok('lead2', ['F4', 'F4', 'F4', 'F4', 'G4', 'Ab4', 'Db5'], t0, 0.66)
            art.swell(a, 'vln2', ['F4', 'C5'], t0, 1.9, 'pp', 'p', lock=True)
            art.swell(a, 'vln1', ['G5'], t0, 1.9, 'pp', 'p', lock=True)
        elif i == 7:
            ache(t0, 1.9, 0.74, 0.64)
            a.n('harp', 'F4', t0, 1.0, 0.36, True)                            # the front
            a.n('celesta', 'Db6', t0 + g.beats_s(1.25, t0), 0.5, 0.62, True)
            sub(t0, 1.9, 0.6, 0.3, 1.0)
        elif i == 8:
            sw = t0 + g.beats_s(1.25, t0)                     # the swap, on a 16th
            a.n('glasspad', 'F5', t0, sw - t0 + 0.012, 0.8, True, env=[(0, 1.0), (sw - t0, 1.0),
                                                                         (sw - t0 + 0.012, 0.0)])
            a.n('glasspad', 'F4', t0, sw - t0 + 0.012, 0.6, True, env=[(0, 1.0), (sw - t0, 1.0),
                                                                         (sw - t0 + 0.012, 0.0)])
            a.n('glass_snes', 'F5', sw, 1.9 - (sw - t0), 0.92, True, offset=0.4)
            a.n('glass_snes', 'F4', sw, 1.9 - (sw - t0), 0.72, True, offset=0.4)
            a.n('celesta', 'F5', t0, 0.5, 0.5, True)
        elif i == 9:
            tok('lead2', ['F4', 'F4', 'F4', 'F4', 'G4', 'Ab4', 'C5', 'Eb5', 'F5', 'Ab5', 'C6'], t0, 0.62)
            sub(t0, 1.95, 0.7, 0.8, 0.3, inten=0.45)
        elif i == 10:
            sub(t0, 1.95, 0.84, 0.95, 0.2, inten=0.55)
            dt = t0 + g.beats_s(1.5, t0)
            a.n('bell', 'Db6', dt, 0.2, 0.6, True, len=1.2, bright=0.5)
            a.n('celesta', 'Db6', dt, 0.6, 0.54, True)
            a.mark('H11 the glass Db6', dt)
        else:
            rng = np.random.default_rng(12)
            pool = ['C5', 'Db5', 'F5', 'G5', 'Ab5', 'C6', 'Db6']
            ps = []
            for s in range(12):
                lo = min(len(pool) - 3, s * len(pool) // 14)
                ps.append(None if rng.random() < 0.18 else pool[lo + int(rng.integers(0, 3))])
            tok('lead2', ps, t0, 0.7)
            sub(t0, 1.95, 0.78, 0.5, 0.4, inten=0.45)

    # ============================================================ Q*: the vault's swell (1 bar), cut dead
    qb = 1 + 2 * HITS
    q0, qcut = g.t(qb), g.t(qb + 1)
    a.section('QSTAR', qb, qb + 2)
    art.swell(a, 'glasspad', ['F3', 'C4', 'F4'], q0, qcut - q0 + 0.2, 0.3, 0.95, shape='exp', lock=True)
    a.n('glasspad', 'Db5', g.t(qb, 3), qcut - g.t(qb, 3) + 0.2, 0.66, True)
    a.n('subp', 'F2', q0, qcut - q0 + 0.3, 0.72, True, kind='dread', voicing='none', air=False, intensity=0.4,
        fade_in=qcut - q0 - 0.2, fade_out=0.1)
    a.mark('QSTAR cut dead (the button chord follows)', qcut)
    mutes.append((qcut, g.t(qb + 2)))

    # ============================================================ THE COPY at every lag (3-bar slots)
    lags = [('C1a Ep1 a beat late, breaks off after 2 notes (two fingers)', 1.0, 0.0, 2, 'one'),
            ('C1b Ep1 a beat late, breaks off after 3 notes (a pinky)', 1.0, 0.0, 3, 'one'),
            ('C1c Ep1 a beat late, breaks off after 4 notes (a hand)', 1.0, 0.0, 4, 'one'),
            ('C2 Ep2 a beat late, three-part harmony (the sycophant)', 1.0, 0.0, 7, 'three'),
            ('C3 Eps 3-5 an eighth late', 0.5, 0.0, 7, 'one'),
            ('C4 Eps 6-8 a sixteenth late', 0.25, 0.0, 7, 'one'),
            ('C5 Ep9 in sync, quantised', 0.0, 0.0, 7, 'one'),
            ('C6 Eps 10-11 in sync, with his swing', 0.0, 1.0, 7, 'one'),
            ('C7 Ep12 a sixteenth AHEAD, better voiced (swung)', -0.25, 1.0, 7, 'better')]
    HARM = {'F4': ['Ab4', 'C5'], 'G4': ['Bb4', 'Eb5'], 'C4': ['Eb4', 'Ab4']}
    for k, (label, lag, swing, n_play, voicing) in enumerate(lags):
        bar = qb + 2 + 3 * k
        ref = g.t(bar)
        a.section(label[:3].strip(), bar, bar + 3)
        # the slot's first downbeat (the section start) IS MM-01's Water Line downbeat: align it there
        # the GUIDE (piano stem): his line, swung, as MM-01 plays it
        for p, beat, ln in WL:
            q = g.bar_q(bar) + (beat - 1.0)
            t = g.tq(g.swing_q(q, 1.0)) if beat % 1 else g.tq(q)
            a.n('felt', p, t, g.beats_s(ln * 0.95, t), 0.3 if beat % 1 == 0 else 0.33, True)
        # THE COPY (chip stem)
        first = None
        for j, (p, beat, ln) in enumerate(WL[:n_play]):
            q = g.bar_q(bar) + (beat - 1.0)
            qs = g.swing_q(q, swing) if (swing and beat % 1) else q          # swung nudge only when it has his swing
            t = g.tq(qs + lag)
            d = g.beats_s(ln * (0.9 if voicing != 'better' else 0.97), t)
            if j == n_play - 1 and n_play < 7:
                d = g.beats_s(ln * 0.45, t)                                  # it fails to finish: the note breaks off
            if j == 0:
                first = t
            a.n('lead', p, t, d, {'three': 0.38, 'better': 0.3}.get(voicing, 0.5), True, duty=0.5, rel=0.08, dec=0.25, sus=0.6,
                vib=0.0, max_hz=3000)
            if voicing == 'three':
                for hp in HARM.get(p, []):
                    a.n('lead2', hp, t, d, 0.15, True, duty=0.25, rel=0.08, dec=0.25, sus=0.6, vib=0.0, max_hz=3000)
            if voicing == 'better':
                a.n('tri', nm(p) - 12, t, d, 0.2, True, rel=0.12, dec=0.4, sus=0.8)
                if p == 'F4' and beat == 6:                                  # the cadence: an open fifth under it
                    a.n('tri', 'C3', t, d, 0.18, True, rel=0.2, dec=0.5, sus=0.8)
        a.mark(f'{label[:3].strip()} COPY in ({lag:+g} beat)', first)
        nxt = g.t(bar + 3)
        mutes.append((g.t(bar + 2, 4), nxt - (g.beats_s(0.25, nxt) + 0.005 if k == len(lags) - 2 else 0.0)))
    # s6.5: the room SFX may lie under any item of the kit (the hits in his room over room_drone, Q* in the vault
    # over server_hum, the COPY in the dark room): every slot is a room window, checked on the full mix
    META['room_sfx'] = ([dict(t0=g.t(1 + 2 * i), t1=g.t(1 + 2 * i) + 2.0, sfx=f'room_drone / server_hum ({names[i][:3]})')
                         for i in range(HITS)] +
                        [dict(t0=q0, t1=qcut, sfx='server_hum (QSTAR: the vault)')] +
                        [dict(t0=g.t(qb + 2 + 3 * k), t1=g.t(qb + 4 + 3 * k, 4), sfx=f'room_drone ({lab[:3].strip()})')
                         for k, (lab, *_r) in enumerate(lags)])
    tc = g.t(qb + 2)                     # the hits and Q* ride +6 dB over the COPY (one master for a mixed kit)
    macro = [(0.0, 6.0), (tc - 0.05, 6.0), (tc - 0.01, 0.0), (g.t(n_bars + 1) + 2.0, 0.0)]
    return Score(META['id'], g, T, a.notes, markers=a.markers, sections=a.sections, mutes=mutes, tail_s=1.0,
                 length_s=g.t(n_bars + 1), macro=macro, meta=META)


if __name__ == '__main__':
    render_cli(build, __file__)
