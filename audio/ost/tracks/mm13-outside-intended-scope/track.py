"""MM-13 "Outside Intended Scope"  --  the GLYPH ladder.  Library suite (P05 GLYPH).  Composer D.  OST-BIBLE s5.D2.
(The GLYPH hits, the Q* bar and THE COPY at every lag are in the sibling kit: tracks/mm13-kit-glyph-hits-and-copy.)

THE MACHINE, POLITELY.  No swing, no humanising (every note lock=True, every track hum 0 / vel_jit 0), no vibrato,
long values; tokens on the 16th grid, only from {F G Ab C Db}, only in F4-Db6 (G6-F7 belongs to the SFX grains).
An F pedal and the Ache (G + Db over F).  Nothing warm: no piano, no brass, no swing, no Mas motif -- except
the knee's own notes, which the machine is learning, one stage per 8 bars (OST-BIBLE s2.5):

  bars  1-8   L1 . GRAINS (Eps 1-3)      2-3 glass / celesta grains a bar (F5, C6, Db6) at irregular 16ths; a sub
                                          breath (two slow swells); THE ACHE (G4 + Db5, glass) only in bars 5-6.
                                          The seamless loop body (the engine's <id>-loop.wav).
  bars  9-16  L2 . SCRAMBLED (Eps 4-6)   the knee's notes shuffled (Ab F C G F F F F) as 16th tokens with 50 %
                                          rests on a 12.5 % chip (+ a detuned double) and glass; bar 13 plays the
                                          knee REVERSED (F C Ab G F F F F); the chord with no third (F C G) in glass.
  bars 17-24  L3 . ALMOST (Eps 7-8)      F F F F G Ab Db ... (the Ache's Db where the C should be; it never reaches
                                          the octave), 30 % rests, a 7-token cycle against the 16-step bar; a high
                                          violin pad on F-C-G, low-passed; the Ache returns in bars 21-22.
  bars 25-32  L4 . THE RUNAWAY (Ep9)     F F F F G Ab C and then PAST the knee's ending (Eb F Ab C ...), rests
                                          thinning 35 % -> 10 %; under it a line climbing Ab C Eb F an octave per
                                          bar-pair (cello -> viola -> violins II -> violins I) whose Fs stay held;
                                          the sub swells once per bar-pair, each a little larger.
  bars 33-34  HOOK                        the tokens stop; a sub-pressure swell into ONE high glass Db6 that cuts
                                          dead on the downbeat of bar 35 (dread before the cut).  -16 LUFS-M.

Loops: L1 = Score.loop (engine files <id>-loop.wav / -loop-tail.wav / -loop-x3-preview.mp3).  Running THIS FILE
(python track.py) also writes L2, L3 and L4 as <id>-loop-L2.wav etc. (+ tails and x3 previews) at the level
each level has in the underscore master, and <id>-loops.json with their seam checks.  (build.py renders L1 only.)
STEMS: the sub pressure sits on the BASS stem on purpose (the editor may drop it when the SFX room_drone (F1 + C2) or
server_hum (F2) plays, OST-BIBLE s2.5).  FIX 1 (2026-09-26): the sub is now a floor, not a layer, so the FULL MIX
passes s6.5 (< 60 Hz <= -18 dB of the total) in every level, which META room_sfx marks; the tokens are shelved and the
strings darker (the 2-6 kHz rule, which the old heavy sub had been passing for them); the HOOK is ridden 2 dB down
(-16 LUFS-M).  VARIANTS (s6.4, s6.7): python track.py also writes render/variants/: 30 / 15 / 5 s cut-downs (level-
matched to the suite's bars) and the reduced and solo (chip) ladders.
"""
import json
import os
import sys

import numpy as np

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))
from engine import *   # noqa: E402,F401,F403
from engine import texture   # noqa: E402
from engine.core import SR   # noqa: E402

META = dict(
    id='mm13-outside-intended-scope',
    mm='MM-13',
    title='Outside Intended Scope',
    family='P05 GLYPH',
    tone='the machine learning the show\'s tune, politely: grains, then the knee scrambled, then almost, then running '
         'past its own ending -- dread without a single evil sound',
    usage='BI',
    tags=['library', 'GLYPH', 'dread', 'the machine', 'tokens', 'loops L1-L4', 'hook', 'no swing', 'straight'],
    scenes=['Eps 1-3: L1 (Ep1 the Orb\'s scan, the tile dissolve is SFX-only inside D6, Q* hum -> see the kit)',
            'Eps 4-6: L2 (Ep6 the RESERVED desk)', 'Eps 7-8: L3', 'Ep9: L4 under the sandbox breakout (MM-31 bed)',
            'the HOOK: a dread-before-the-cut out, any episode on the dread curve'],
    motifs=['TOKENS stage grains (L1), scrambled + reversed (L2), almost (L3), the runaway (L4)',
            'THE ACHE (G4 + Db5 over the F pedal; L1 bars 5-6, L3 bars 21-22)',
            'the knee REVERSED (bar 13)', 'the chord with no third F-C-G (L2, L3 violins)',
            'the runaway climb Ab C Eb F, an octave per bar-pair (L4)', 'the hook: one glass Db6, cut dead (bar 35.1)'],
    motif_ids=[],
    key='F pedal + the Ache (G, Db); tokens {F G Ab C Db} (+ Eb in the runaway), F4-Db6',
    composer='Composer D (OST batch 1)',
    underscore_lufs=-20.8,     # so the levels land where the bible puts them: L1-L2 ~-22, L3-L4 ~-20, hook -16 LUFS-M
    album_lufs=-16.0,          # a quiet bed on the album (the bible allows -16 for quiet tracks)
    audition=[
        '0-20 s (L1) and render/<id>-loop-x3-preview.mp3: DREAD or a screensaver?  The grains must feel watched, '
        'not pretty; the seams at 20 s and 40 s of the preview must be invisible',
        '60-80 s (L4): thrilling or just loud?  The climb (cello -> violins, an octave a bar-pair) against rests '
        'thinning 35 % -> 10 % should accelerate without getting louder (L4 measures -20.4, L3 -19.7)',
        '82.5-85.0 s (HOOK): the glass Db6 over the sub swell, cut dead at 85.0 s -- dread before the cut, and no '
        'riser cliche',
        '30.0-32.5 s (bar 13): the knee REVERSED in tokens -- a second-time listener may hear the knee backwards; a '
        'first-time one must not hear a tune',
        'render/<id>-loop-L4-x3-preview.mp3 at 20.0 s and 40.0 s: the seam detector says CHECK; measured, the seam is '
        'an ordinary token onset (HF 2.8e-6 vs 3.1e-6 for the loudest grid onset) -- confirm by ear',
        '40-60 s (L3) under a voice: the violins\' F-C-G pad (low-passed) must read as glass, not romance',
    ],
)

LEVELS = dict(L1=(1, 9), L2=(9, 17), L3=(17, 25), L4=(25, 33))
SUB_GAIN_DB, SUB_SHELF_HZ, SUB_SHELF_DB = -12.0, 90.0, -11.0     # fix1: was gain -3, no shelf (see build())
TOKEN_SHELF_HZ, TOKEN_SHELF_DB = 1600.0, -6.0                    # fix1: the tokens' high shelf (was none)
STRINGS_LP_HZ = 1900.0                                           # fix1: was 2400 (the 2-6 kHz share, see build())
HOOK_RIDE_DB = -2.0                                              # fix1: the hook's fader (was none)


def build():
    g = Grid(bpm=96, meter='4/4', bars=34, swing=0.0)
    a = Arr(g)
    T = palette()
    # the machine: no humanising anywhere
    for k in T:
        T[k].hum_ms = 0.0
        T[k].vel_jit = 0.0
        T[k].drift_ms = 0.0
    # the sub pressure on its own (BASS) stem, so the editor can drop it under room_drone / server_hum
    # fix1 (2026-09-26): the sub pressure sat -4 to -8 dB of the total power below 60 Hz; s6.5 wants <= -18 dB under
    # room_drone / server_hum, which may lie under any level of this bed.  The pressure is now a floor, not a
    # layer: -9 dB overall (its dark air, whose noise read as A-range energy over the F pedal, comes down with it)
    # and a low shelf that takes the F1 itself down a further ~10 dB.  The room SFX supply the low F.
    T['subp'] = Track('subp', ('fn', texture.tex_fn), 'bass', credit='engine synthesis (no samples)', hum_ms=0.0,
                      vel_jit=0.0, gain_db=SUB_GAIN_DB, eq=[('ls', SUB_SHELF_HZ, SUB_SHELF_DB)])
    # a glass pad re-rendered through the sample-chip at a low store rate (s1.5 mechanism 4, used in L4's climb)
    T['lead2'].gain_db = -2
    T['lead2'].sends = {'room': -16, 'hall': -14}
    T['arp'].gain_db = -13
    T['arp'].pan = 0.35
    # fix1: with the sub down, the 2-6 kHz share of the whole cue rose to -13.8 dB (limit -15 under dialogue).  The
    # tokens carried ~40 % of that band (their 12.5 % pulse's 5th-7th partials) and the high violins ~30 % (their
    # F6 / Eb6 2nd partials through the old 2.4 kHz low-pass): a high shelf on the tokens, the strings' low-pass
    # down to 1.9 kHz
    for k in ('lead2', 'arp'):
        T[k].eq = list(T[k].eq) + [('hs', TOKEN_SHELF_HZ, TOKEN_SHELF_DB)]
    T['arp'].sends = {'hall': -12}
    T['celesta'].gain_db = -2
    T['celesta'].sends = {'hall': -6}
    T['celesta'].eq = [('lp', 5000)]
    T['bell'].gain_db = -3
    T['bell'].sends = {'hall': -8}
    T['glasspad'].gain_db = -6
    T['tex'].gain_db = -2
    for k in ('vln1', 'vln2', 'vla', 'vc'):
        T[k].eq = [('lp', STRINGS_LP_HZ), ('hp', 120)]   # high strings, low-passed: glass, not romance
        T[k].sends = {'hall': -6}
        T[k].gain_db = -11
    CH = dict(duty=0.125, rel=0.04, dec=0.12, sus=0.35, att=0.002, vib=0.0, max_hz=2600)

    # ------------------------------------------------------------ the F pedal: sub breath (all four levels)
    def sub_breath(b0, nbars, peak, intensity=0.25, root='F1', air=False):
        t0 = g.t(b0)
        d = g.bar_s(b0) * nbars + 1.6                   # 1.6 s longer: it crossfades over a loop seam
        a.n('subp', root, t0, d, peak, lock=True, kind='dread', voicing='none', air=air,
            intensity=intensity, fade_in=d * 0.45, fade_out=d * 0.45)

    # ------------------------------------------------------------ L1: GRAINS (bars 1-8)
    a.section('L1 grains (Eps 1-3)', 1, 9)
    for b0 in (1, 5):
        sub_breath(b0, 4, 0.74, air=True)
    grains = [  # (bar, beat, pitch, voice, vel): 2-3 a bar, never periodic
        (1, 1.0, 'F5', 'celesta', 0.46), (1, 3.25, 'C6', 'bell', 0.42),
        (2, 2.5, 'Db6', 'celesta', 0.4), (2, 4.0, 'F5', 'bell', 0.38), (2, 4.75, 'C6', 'celesta', 0.32),
        (3, 1.75, 'C6', 'bell', 0.42), (3, 3.5, 'F5', 'celesta', 0.44),
        (4, 1.25, 'Db6', 'bell', 0.4), (4, 2.75, 'F5', 'celesta', 0.36), (4, 4.5, 'C6', 'celesta', 0.34),
        (5, 1.0, 'F5', 'celesta', 0.46), (5, 3.75, 'Db6', 'bell', 0.38),
        (6, 2.25, 'C6', 'celesta', 0.4), (6, 3.5, 'F5', 'bell', 0.4),
        (7, 1.5, 'Db6', 'celesta', 0.38), (7, 3.0, 'C6', 'bell', 0.4), (7, 4.25, 'F5', 'celesta', 0.36),
        (8, 2.0, 'F5', 'bell', 0.4), (8, 4.5, 'Db6', 'celesta', 0.34),
    ]
    for bar, beat, p, v, vel in grains:
        if v == 'bell':
            a.n('bell', p, (bar, beat), 0.2, vel + 0.1, lock=True, len=2.2, bright=0.45)
        else:
            a.n('celesta', p, (bar, beat), '1b', vel + 0.08, lock=True)
    # the Ache: bars 5-6 only, glass + pure beating tones, then it leaves
    a.ch('glasspad', ['G4', 'Db5'], (5, 1), g.bar_s(5) * 2 - 0.3, 0.42, lock=True)
    a.n('tex', 'F2', (5, 1), g.bar_s(5) * 2, 0.5, lock=True, kind='dread', voicing='ache', air=False,
        intensity=0.25, fade_in=1.2, fade_out=1.6)
    a.mark('THE ACHE (L1 bar 5)', (5, 1))

    # ------------------------------------------------------------ L2: SCRAMBLED (bars 9-16)
    a.section('L2 scrambled (Eps 4-6)', 9, 17)
    for b0 in (9, 13):
        sub_breath(b0, 4, 0.72, air=True)
    for bars, stage, seed in [((9, 13), 'scrambled', 21), ((13, 14), 'reversed', 22), ((14, 17), 'scrambled', 23)]:
        tk = tokens(a, 'lead2', bars=bars, stage=stage, rest=0.5, seed=seed, vel=0.5, duty=0.125, rel=0.04, dec=0.12,
                    sus=0.35, max_hz=2600)
        for j, n in enumerate(tk):                   # a detuned 12.5 % double on every other token, and glass on some
            if j % 2 == 0:
                a.n('arp', n.pitch + 0.1, n.start, n.dur, n.vel * 0.8, lock=True, **CH)
            if j % 3 == 0:
                a.n('celesta', n.pitch, n.start, 0.4, n.vel * 0.7, lock=True)
    a.mark('the knee REVERSED (bar 13)', (13, 1))
    for b0 in (9, 13):                                # the chord with no third, in glass
        a.ch('glasspad', ['F3', 'C4', 'G4'], (b0, 1), g.bar_s(b0) * 4 - 0.2, 0.36, lock=True)

    # ------------------------------------------------------------ L3: ALMOST (bars 17-24)
    a.section('L3 almost (Eps 7-8)', 17, 25)
    for b0 in (17, 21):
        sub_breath(b0, 4, 0.68, intensity=0.3)
    tk = tokens(a, 'lead2', bars=(17, 25), stage='almost', rest=0.3, seed=31, vel=0.52, duty=0.125, rel=0.04,
                dec=0.12, sus=0.35, max_hz=2600)
    for j, n in enumerate(tk):
        if j % 2 == 1:
            a.n('arp', n.pitch + 0.1, n.start, n.dur, n.vel * 0.8, lock=True, **CH)
        if j % 4 == 0:
            a.n('celesta', n.pitch + 12 if n.pitch < 72 else n.pitch, n.start, 0.4, n.vel * 0.6, lock=True)
    for b0 in (17, 21):                               # the high-violin pad F-C-G (low-passed), a breath each 4 bars
        art.swell(a, 'vln2', ['F4', 'C5'], (b0, 1), g.bar_s(b0) * 4 - 0.1, 'pp', 'p', shape='s', lock=True)
        art.swell(a, 'vln1', ['G5'], (b0, 1), g.bar_s(b0) * 4 - 0.1, 'pp', 'p', shape='s', lock=True)
    a.ch('glasspad', ['G4', 'Db5'], (21, 1), g.bar_s(21) * 2 - 0.3, 0.4, lock=True)
    a.n('tex', 'F2', (21, 1), g.bar_s(21) * 2, 0.52, lock=True, kind='dread', voicing='ache', air=False,
        intensity=0.35, fade_in=1.0, fade_out=1.6)
    a.mark('the Ache returns (L3 bar 21)', (21, 1))

    # ------------------------------------------------------------ L4: THE RUNAWAY (bars 25-32)
    a.section('L4 the runaway (Ep9)', 25, 33)
    RUN = ['F4', 'F4', 'F4', 'F4', 'G4', 'Ab4', 'C5', 'Eb5', 'F5', 'Ab5', 'C6']   # past the knee's ending: C -> Eb
    j = 0
    rng = np.random.default_rng(41)
    q0 = g.bar_q(25)
    for i in range(8 * 16):
        bar = 25 + i // 16
        rest_p = 0.35 - 0.25 * (i / (8 * 16))            # the rests thin: 35 % -> 10 %
        p = RUN[j % len(RUN)]
        j += 1
        if p != 'Eb5' and rng.random() < rest_p:          # the Eb after the C is never dropped: the knee never closes
            continue
        t = g.tq(q0 + 0.25 * i)
        acc = (1.0, 0.78, 0.88, 0.78)[i % 4]
        a.n('lead2', p, t, g.beats_s(0.25, t) * 0.55, 0.5 * acc, lock=True, duty=0.125, rel=0.04, dec=0.12,
            sus=0.35, max_hz=2600)
        if i % 2 == 0:
            a.n('arp', nm(p) + 0.1, t, g.beats_s(0.25, t) * 0.5, 0.42 * acc, lock=True, **CH)
        if p in ('C6', 'Ab5') and i % 3 == 0:
            a.n('celesta', p, t, 0.4, 0.34, lock=True)
    climb = [('vc', ['Ab2', 'C3', 'Eb3', 'F3']), ('vla', ['Ab3', 'C4', 'Eb4', 'F4']),
             ('vln2', ['Ab4', 'C5', 'Eb5', 'F5']), ('vln1', ['Ab5', 'C6', 'Eb6', 'F6'])]
    for k, (inst, ps) in enumerate(climb):          # one octave per bar-pair; each pair's F is held to the end
        b0 = 25 + 2 * k
        for m, p in enumerate(ps):
            at = g.t(b0 + m // 2, 1 + 2 * (m % 2))
            d = g.beats_s(2, at) if m < 3 else g.t(33) - at
            a.n(inst, p, at, d - 0.04, 0.4 + 0.03 * k, lock=True, art='sus',
                env=[(0, 0.7), (0.4, 1.0), (d, 1.0)])
        sub_breath(b0, 2, 0.6 + 0.05 * k, intensity=0.3 + 0.08 * k)
    a.mark('the runaway: past the ending (L4)', (25, 2.75))

    # ------------------------------------------------------------ HOOK (bars 33-34): the swell, one glass Db6, the cut
    a.section('HOOK (dread before the cut)', 33, 35)
    hk0 = g.t(33)
    cut = g.t(35)
    a.n('subp', 'F1', hk0 - 0.3, cut - hk0 + 0.8, 0.8, lock=True, kind='dread', voicing='none', air=False,
        intensity=0.55, fade_in=(cut - hk0) * 0.85, fade_out=0.2)
    a.n('tex', 'F2', hk0, cut - hk0 + 0.5, 0.62, lock=True, kind='dread', voicing='ache', air=True,
        intensity=0.45, fade_in=(cut - hk0) * 0.9, fade_out=0.2)
    a.n('bell', 'Db6', (34, 1), 0.3, 0.56, lock=True, len=3.0, bright=0.5)
    a.n('celesta', 'Db6', (34, 1), '4b', 0.5, lock=True)
    a.n('glasspad', 'Db6', (34, 1), g.bar_s(34) + 0.3, 0.5, lock=True)
    a.n('lead2', 'Db6', (34, 1), g.bar_s(34) + 0.2, 0.4, lock=True, duty=0.125, rel=0.3, dec=0.8, sus=0.7,
        max_hz=2600)
    a.mark('HOOK: the glass Db6', (34, 1))
    a.mark('HOOK: cut dead (downbeat)', cut)

    META['no_third_windows'] = []
    # s6.5: the room SFX (room_drone F1 + C2, server_hum F2) may lie under ANY level of this library bed (the Orb's
    # scan in his room, the Q* vault, the sandbox): every level is checked as a room window, on the full mix
    META['room_sfx'] = [dict(t0=g.t(b0), t1=g.t(b1), sfx=f'room_drone / server_hum ({lab})')
                        for lab, (b0, b1) in list(LEVELS.items()) + [('HOOK', (33, 35))]]
    # fix1: the hook is ridden down HOOK_RIDE_DB dB (a fader, Score.macro): with the sub down, the make-up gain rose
    # and the hook read -14.0 LUFS-M on the corrected meter (s5.D2: hooks -16 LUFS-M)
    macro = [(0.0, 0.0), (hk0 - 0.05, 0.0), (hk0 + 0.05, HOOK_RIDE_DB), (cut + 3.0, HOOK_RIDE_DB)]
    return Score(META['id'], g, T, a.notes, loop=g.span(*LEVELS['L1']), markers=a.markers, sections=a.sections,
                 mutes=[(cut, cut + 3.0)], length_s=cut, tail_s=0.5, meta=META, macro=macro)


# ====================================================================== library variants (OST-BIBLE s6.4, s6.7)
# Cut-downs are windows of the suite on bar lines, each ending on the HOOK's dead cut; reduced and solo are the whole
# ladder with fewer voices.  All five are written by `python track.py` to render/variants/ (album + underscore
# masters at the suite's loudness, MIDI, piano roll and cue sheet; no stems: the suite's stems carry every voice).
STRINGS_GLASS = ('vln1', 'vln2', 'vla', 'vc', 'glasspad')
VARIANTS = {
    '30s': dict(bars=(23, 35), title='30 s cut-down',
                desc='30 s cut-down (bars 23-34): the end of L3 (almost), the whole of L4 (the runaway) and the HOOK, '
                     'cut dead at 30.0 s. The F pedal and the violins\' F-C-G glass re-enter on its first bar.'),
    '15s': dict(bars=(29, 35), title='15 s cut-down',
                desc='15 s cut-down (bars 29-34): the runaway at its densest (the climb in violins II then I) into '
                     'the HOOK, cut dead at 15.0 s.'),
    '05s': dict(bars=(33, 35), title='5 s cut-down',
                desc='5 s cut-down (bars 33-34): the HOOK alone -- the sub-pressure swell into one glass Db6, cut dead '
                     'on the downbeat at 5.0 s. A dread-before-the-cut out.'),
    'reduced': dict(title='reduced',
                    desc='REDUCED: the whole ladder (L1-L4 + HOOK, 85 s) without strings or the glass pad: the chip '
                         'tokens and their detuned double, the celesta and bell grains, the Ache as pure beating tones '
                         '(tex), the sub floor. Lighter under dialogue; the L4 climb is gone, so L4 rises by density '
                         'alone.'),
    'solo': dict(title='solo (chip)',
                 desc='SOLO: the machine\'s own voice alone -- the 12.5 % chip (lead2) plays the L1 grains (F5 C6 Db6, '
                      'soft plucked envelope), the L2-L4 tokens exactly as the suite, and the HOOK\'s Db6. No glass, '
                      'no strings, no sub, no double. For a GLYPH beat that must sit under a line.'),
}


def _window(sc, b0, b1, pre=0.35):
    """Notes starting in bars [b0, b1) shifted to t = 0 (a texture swell starting < `pre` s before the bar line is
    started on it, its fade-in shortened); markers, sections and mutes likewise."""
    g = sc.grid
    T0, T1 = g.t(b0), g.t(b1)
    out = []
    for n in sc.notes:
        if T0 - pre <= n.start < T0 and 'fade_in' in n.x:       # a swell that leans into the bar (the HOOK's sub)
            clip = T0 - n.start
            m = n.copy(start=0.0, dur=n.dur - clip)
            if 'fade_in' in m.x:
                m.x['fade_in'] = max(0.05, m.x['fade_in'] - clip)
            out.append(m)
        elif T0 <= n.start < T1:
            out.append(n.copy(start=n.start - T0))
    mk = [(t - T0, lab) for t, lab in sc.markers if T0 - 1e-6 <= t <= T1 + 1e-6]
    se = [(lab, max(a, T0) - T0, min(b, T1) - T0) for lab, a, b in sc.sections if b > T0 and a < T1]
    mu = [(max(a, T0) - T0, b - T0) for a, b in sc.mutes if b > T0 and a <= T1]
    ma = None
    if sc.macro:                            # the fader, sampled on the window (it holds its value past either end)
        xs = [p[0] for p in sc.macro]
        ys = [p[1] for p in sc.macro]
        ts = sorted({T0, T1 + 3.0} | {x for x in xs if T0 < x < T1 + 3.0})
        ma = [(t - T0, float(np.interp(t, xs, ys))) for t in ts]
    return out, mk, se, mu, T1 - T0, ma


def _suite_level(t0, t1):
    """(album, underscore) LUFS-I of the suite's own masters over [t0, t1): a cut-down is mastered to the level its
    bars have in the suite, so it intercuts with the suite and its loops.  None before the suite is rendered."""
    import soundfile as sf
    from engine.mix import lufs
    rd = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'render')
    out = []
    for kind in ('album', 'underscore'):
        p = os.path.join(rd, f"{META['id']}-{kind}.wav")
        if not os.path.exists(p):
            return None
        x, sr = sf.read(p, always_2d=True, start=int(t0 * SR), stop=int(t1 * SR))
        out.append(round(float(lufs(x.T.astype(np.float32))), 2))
    return tuple(out)


def build_variant(name):
    v = VARIANTS[name]
    full = build()
    meta = {k: val for k, val in META.items() if k not in ('room_sfx', 'no_third_windows')}
    meta.update(id=f"{META['id']}-{name}", title=f"Outside Intended Scope ({v['title']})", description=v['desc'],
                tags=META['tags'] + ['variant', name], version='1')
    T = full.tracks
    if 'bars' in v:
        b0, b1 = v['bars']
        notes, mk, se, mu, L, ma = _window(full, b0, b1)
        nb = b1 - b0
        g = Grid(bpm=96, meter='4/4', bars=nb, swing=0.0)
        a = Arr(g)
        a.notes = notes
        if b0 == 23:                       # L3's F pedal and its F-C-G glass began at bar 21: re-enter them on bar 1
            d = g.bar_s(1) * 2
            a.n('subp', 'F1', 0.0, d + 1.6, 0.68, lock=True, kind='dread', voicing='none', air=False, intensity=0.3,
                fade_in=1.0, fade_out=(d + 1.6) * 0.45)
            art.swell(a, 'vln2', ['F4', 'C5'], 0.0, d - 0.1, 'pp', 'p', shape='s', lock=True)
            art.swell(a, 'vln1', ['G5'], 0.0, d - 0.1, 'pp', 'p', shape='s', lock=True)
        lv = _suite_level(full.grid.t(b0), full.grid.t(b1))
        if lv:
            meta['album_lufs'], meta['underscore_lufs'] = lv
        meta['room_sfx'] = [dict(t0=0.0, t1=L, sfx='room_drone / server_hum (library cut-down)')]
        meta['audition'] = [f'0-{L:.1f} s: starts clean on its bar line; the cut at {L:.1f} s is dead (no tail)',
                            'against the suite at the same bars: the same music, nothing re-voiced']
        return Score(meta['id'], g, T, a.notes, markers=mk, sections=se, mutes=mu, length_s=L, tail_s=0.5, meta=meta,
                     macro=ma)
    if name == 'reduced':
        notes = [n for n in full.notes if n.inst not in STRINGS_GLASS]
    else:                                   # solo: the chip lead alone; L1's glass grains move onto it
        from dataclasses import replace as _rp
        T = dict(T)                         # alone under a line, the tokens take a further -3 dB above 1.6 kHz
        T['lead2'] = _rp(T['lead2'], eq=list(T['lead2'].eq) + [('hs', TOKEN_SHELF_HZ, -3.0)])
        notes = []
        l1_end = full.grid.t(9)
        for n in full.notes:
            if n.inst == 'lead2':
                notes.append(n.copy())
            elif n.inst in ('celesta', 'bell') and n.start < l1_end:
                notes.append(Note('lead2', n.pitch, n.start, 0.5, min(0.62, n.vel), True,
                                  dict(duty=0.125, att=0.004, dec=0.55, sus=0.0, rel=0.35, max_hz=2600)))
    meta['room_sfx'] = [dict(t0=full.grid.t(b0), t1=full.grid.t(b1), sfx=f'room_drone / server_hum ({lab})')
                        for lab, (b0, b1) in list(LEVELS.items()) + [('HOOK', (33, 35))]]
    meta['audition'] = {'reduced': ['60-80 s (L4): without the climb, does the runaway still accelerate by density?',
                                    '0-20 s (L1): grains + the sub floor, no glass pad: dread, or empty?'],
                        'solo': ['0-20 s: the L1 grains on the chip -- glints, never notification bleeps',
                                 '20-80 s: the tokens alone under a voice: the machine, politely']}[name]
    return Score(meta['id'], full.grid, T, notes, markers=full.markers, sections=full.sections, mutes=full.mutes,
                 length_s=full.end_s, tail_s=0.5, meta=meta, macro=full.macro)


def render_variants(names=None, out_dir=None, workers=None, previews=True):
    from engine.export import build as ebuild
    out_dir = out_dir or os.path.join(os.path.dirname(os.path.abspath(__file__)), 'render', 'variants')
    for name in (names or VARIANTS):
        sc = build_variant(name)
        ebuild(sc, out_dir, sc.meta['id'], stems=False, loop=False, previews=previews, workers=workers)


# ====================================================================== L2-L4 loop files (python track.py)
def extra_loops(sc, out_dir, tid):
    """Render L2-L4 as seamless loops (render_loop), pocket-EQ'd like the underscore, each normalised to the
    level its bars have in the underscore master (so a loop and the linear cue intercut); x3 previews; seams."""
    import soundfile as sf
    from engine.render import render_loop
    from engine.export import pocket, write_audio, mp3_from_array, MASTERS, end_fade, trim_len
    from engine.mix import lufs, true_peak, master_gain_periodic
    from engine import analysis as an
    g = sc.grid
    under, _ = sf.read(os.path.join(out_dir, f'{tid}-underscore.wav'))
    under = under.T.astype(np.float32)
    pk = MASTERS['underscore']['pocket']
    comp = MASTERS['underscore']['comp']
    report = {}
    for name in ('L2', 'L3', 'L4'):
        b0, b1 = LEVELS[name]
        sc.loop = g.span(b0, b1)
        loops, rings, info = render_loop(sc, verbose=False)
        lu = {}
        for k, v in loops.items():
            t3 = pocket(np.concatenate([v, v, v], 1), pk)
            lu[k] = t3[:, v.shape[1]:2 * v.shape[1]]
        ru = {k: pocket(v, pk) for k, v in rings.items()}
        mix = sum(lu.values())
        ring = sum(ru.values())
        # the target: the level of these bars in the linear underscore (skipping the first bar's hand-over)
        ref = lufs(under[:, int(g.t(b0 + 1) * SR):int(g.t(b1) * SR)])
        body = lufs(np.concatenate([mix, mix], 1)[:, int((g.t(b0 + 1) - g.t(b0)) * SR):mix.shape[1]])
        mk = float(10 ** ((ref - body) / 20.0))
        gl = master_gain_periodic(mix, mk, MASTERS['underscore']['ceiling'], comp)
        loop_m = (mix * gl[None]).astype(np.float32)
        ring_m = (ring * gl[0]).astype(np.float32)
        nr = trim_len(np.concatenate([loop_m[:, -1:], ring_m], 1), 1, floor_db=-60) if ring_m.shape[1] > 1 else 1
        ring_m = end_fade(ring_m[:, :nr], 50)
        p = os.path.join(out_dir, f'{tid}-loop-{name}.wav')
        write_audio(p, loop_m)
        write_audio(p.replace('.wav', '-tail.wav'), ring_m)
        mp3_from_array(np.concatenate([loop_m, loop_m, loop_m, ring_m], 1),
                       os.path.join(out_dir, f'{tid}-loop-{name}-x3-preview.mp3'), out_dir)
        seam = an.loop_seam(loop_m)
        report[name] = dict(bars=[b0, b1], file=os.path.basename(p), samples=int(loop_m.shape[1]),
                            seconds=round(loop_m.shape[1] / SR, 6), frames=round(loop_m.shape[1] / SR * 24, 3),
                            frame_aligned=bool(info['frame_aligned']), seam=seam,
                            lufs_x2=round(lufs(np.concatenate([loop_m, loop_m], 1)), 2),
                            linear_ref_lufs=round(ref, 2), true_peak_db=round(20 * np.log10(true_peak(loop_m) + 1e-12), 2))
        print(f'[{tid}] loop {name}: {report[name]["seconds"]} s  {report[name]["lufs_x2"]} LUFS (linear {ref:.2f})  '
              f'seam {seam["verdict"]}', flush=True)
    with open(os.path.join(out_dir, f'{tid}-loops.json'), 'w') as fh:
        json.dump(report, fh, indent=1, default=float)
    return report


if __name__ == '__main__':
    only_var = '--variants-only' in sys.argv
    no_var = '--no-variants' in sys.argv
    for f in ('--variants-only', '--no-variants'):
        if f in sys.argv:
            sys.argv.remove(f)
    here = os.path.dirname(os.path.abspath(__file__))
    if not only_var:
        cue = render_cli(build, __file__)
        if '--no-loop' not in sys.argv:
            extra_loops(build(), os.path.join(here, 'render'), META['id'])
    if not no_var:
        render_variants(previews='--no-mp3' not in sys.argv)
