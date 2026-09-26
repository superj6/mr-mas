"""MM-08 "The Falling Tile" -- E01-S26 + E01-S26A (OST-BIBLE s5.B1).  Composer B.

LEVERAGE (low) -> D6 digital silence -> DARK ROOM (a single felt) -> THE REWIND.

One composition, three forms (compose(form=...)):

  'album'    THIS FOLDER'S BUILD (mm08-the-falling-tile): the soundtrack-album edit.  The scene's music exactly
             as scored, with the 14-bar D6 silence cut to 2 bars (on the album the silence is the blow, not
             a 35-second gap).  17 bars = 42.5 s.
  'picture'  tracks/e01-s26-the-falling-tile (the to-picture cue, 29 bars = 72.5 s from 13:21.0): sc 26 is
             bars 1-21 (4 . 4 . 4 . 4 . card 2 . 3), 26A is bars 22-29, and the Rewind lands on bar 30.1 =
             sc 27's downbeat.  Bar numbers are counted against the script's clock (draft 3.1).
  'bed'      render/variants/mm08-leverage-bed: the alternate loopable "call connecting" bed (4-bar loop),
             for conform extensions of phrase 1 and for LEVERAGE reuse (Ep1 sc 9, sc 30).

Picture map (bar: shot -> music), 96 BPM, 1 bar = 60 frames = 2.5 s:
  1   grid connects           LEVERAGE (low): straight pizz eighths locked to the LEDs (varied pitches round an F
                              pedal), the muted-808 thud (k808 low-passed at 150 Hz + a muted bass drum, never a
                              kit), low grand cluster F2 Gb2 C3, a chip noise tick that keeps 1 eighth in 4 (the
                              hotel Wi-Fi's one bar of four; the kept eighth moves, so it is never an even pulse)
  2   NELEH card              beat 1 is the freeze hit's (SFX): every stem rests 1 beat; then Neleh's clockwork
                              pizzicato (F5 C5 Ab4 C5 G5 C5 Ab4 C5 ...) rides the card's bar
  3   [PF] reads the icons    the cluster holds; ONE felt F4 (his calm); no melody
  4   Alyi's mouth, no sound  everything but the pizz eighths drops
  5   the 1993-style dialog   the 1-bit beeper F4 F5 F4, uneven; the bed returns
  6   [ECU] the eyes strip    the cluster shifts up a semitone (Gb2 G2 Db3); violins trem "sul pont" ppp (F5+Gb5);
                              Mada's spinner (C5-Db5, celesta) under his tile
  7   the arrow steps in      STEP FOUR in quarters on muted horns + bassoon: F4/Bbm(add9) - Eb4/Ab(add9) -
                              Db4/Gbmaj7, the Gbmaj7 held through beat 4.  Level stays level: no riser
  8.1 THE CLICK               HARD STOP: every stem and tail to digital zero within 3 ms.  D6.  The bass's F2 --
                              step four -- never comes: the drop-out is the blank
  8-21                        no score (D6, the room's return, "super.", the candor card, F1.2 silent)
  22  26A: carving mark 3     felt open fifth F3+C4 (his hands)
  23  "i don't keep score."   V.O. window: ONE sustained felt note, the nudge G4 (the add9: his smile, one pixel);
                              felt alone, nothing moves under the line
  24  the Orb counts          the score does not count: it holds, the pedal lifts
  25-26 his real post         DRY (digital zero)
  27  the wallet, the moth    the Water Line's C4, one felt note
  28  "the meeting ended      V.O. window: one sustained felt note on the cut, Eb4 (the b7: unresolved, his calm)
      early."
  29  the settle              C4 -> F4 on beats 1-2 (the Water Line's bar 2, "C4 q F4 h.") -- and on beat 3 the
                              Orb takes it back:
  29.3 `rewinding...`         THE REWIND: the last 2 beats (C4, F4) retrograded AS NOTES on the 16-bit sample-chip
                              piano, a semitone lower per beat: E4, Bb3 -> hard cut on 30.1, where MM-09 enters on
                              Bbm(add9).  (Not a reversed file, not a reverse swell: the SFX own those.)
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, '..', '..')))
from engine import *   # noqa: E402,F401,F403
from engine.export import build as _export_build   # noqa: E402

BASE_META = dict(
    mm='MM-08',
    family='P03 LEVERAGE -> D6 -> P01 DARK ROOM',
    usage='BI',
    tags=['leverage', 'd6', 'drop-out', 'dark room', 'rewind', 'ep01', 'act four', 'the call'],
    motifs=['Step Four (muted horns + bassoon, bar 7; the click is the blank step four)',
            'the 1-bit flat line, F F F (beeper, bar 5)', "Neleh's clockwork pizzicato (bar 2)",
            "Mada's spinner (celesta, bars 6-7)", "the Water Line's open fifth, nudge and settle (felt, 26A)",
            'THE REWIND (16-bit sample-chip retrograde)'],
    motif_ids=['STEP_FOUR', 'NELEH_CLOCKWORK', 'MADA_SPINNER'],
    key='F pedal with semitone-shifting clusters; Step Four (Bbm - Ab - Gbmaj7) over F; 26A F open fifth, no third',
    composer='Composer B (OST batch 1; fix 1: composer A)',
    version='1.1 (fix 1, 2026-09-26)',
    description='Fix 1 (2026-09-26): LEVERAGE balance -- the low grand clusters +9 dB and a touch firmer in b5-6, '
                'and the grand doubles Step Four\'s bass in b7; the cello and contrabass pizz notched at ~111 Hz (a sample body '
                'resonance read as A2 under the F pedal); room_sfx windows over 26A; re-rendered on the fixed engine.',
    album_lufs=-16.0,                 # a quiet cue: the album loudness (s6.5 allows down to -16)
    underscore_lufs=-21.5,            # LEVERAGE (low) -22 -> -20 at b7; 26A -22 to -24; V.O. windows -24
)


def _tweak(T):
    """Per-cue instrument settings."""
    # LEVERAGE's "muted 808": a pitched sub-thud, low-passed near 150 Hz (never a kit, never hats or claps)
    T['k808'].eq = [('lp', 150), ('hp', 28)]
    T['k808'].gain_db = -3
    T['bdrum_muted'].gain_db = -4
    # straight eighths locked to the rack LEDs: no humanising on the pedal pizz
    for k in ('vc', 'cb'):
        T[k].hum_ms = 0
    # fix 1 (rule 12, the engine's F-major trace 2026-09-26): the cello-section pizz samples ring a body resonance at
    # ~110-113 Hz (an A2) under every F-pedal eighth -- the same peak under F2, C3 and Gb2, 7-9 dB under the note.
    # A narrow notch on the cello pizz only (Q 10, -12 dB at 111.7 Hz): the nearest written pizz pitches, Gb2 and C3,
    # move 1.0 and 1.3 dB; F2 0.6 dB.
    T['vc'].eq = list(T['vc'].eq) + [('peq', 111.7, -12.0, 10.0)]
    # ... and the solo-contrabass pizz F1 (its Gb1 / E1 samples shifted a semitone) rings the same body mode at
    # ~110-111 Hz on some round robins (the bed's later passes): the same narrow notch there (Q 8, -12 dB at 111 Hz;
    # F1's partials at 87 and 131 Hz move 0.9 and 1.8 dB)
    T['cb'].eq = list(T['cb'].eq) + [('peq', 111.0, -12.0, 8.0)]
    T['cb'].gain_db = -2
    # the violins' "sul pont": no sul-pont samples in VSCO 2 CE, so a thin, glassy EQ on the tremolo
    T['vln2'].eq = [('hp', 1100), ('peq', 3600, 5.0, 1.0), ('lp', 9000)]
    T['vln2'].sends = {'hall': -8}
    T['vln2'].gain_db = -4
    # Step Four's horns are the orchestra's (muted French horns), not the big band: count them as orch
    T['hn'].balance = 'orch'
    T['hn'].latency_ms = 22           # the VSCO sustain samples speak late; the arrow steps are frame hits
    T['bsn'].latency_ms = 18
    T['hn'].gain_db = -10
    T['bsn'].gain_db = -7
    T['vln1'].gain_db = -4
    # the dark room: his felt, close and dry-ish; the mechanics very low
    T['felt'].sends = {'room': -12, 'hall': -19}
    T['felt_mech'].gain_db = -12
    T['grand'].sends = {'hall': -14, 'room': -16}
    # fix 1 (balance): +9 dB on the low clusters.  LEVERAGE (bars 1-7) read 13 . 72 . 0 . 16 against P03's 30 . 50 . 0 . 20:
    # the clusters sat ~10 dB under the pizz, so the harmony that shifts a semitone (who has the leverage) was barely
    # there.  Now they sit ~3 dB under it.
    T['grand'].gain_db = 4
    T['celesta'].gain_db = -7
    T['beeper'].gain_db = -9
    T['noise'].gain_db = -4
    T['lead'].gain_db = -8
    T['snes_piano'].gain_db = -6
    return T


def leverage(a, T, bars=(1, 8), card=True, bed=False):
    """LEVERAGE (low): bars 1-7 of sc 26 (or the 4-bar bed).  Straight, locked to the LEDs."""
    g = a.g
    b0, b1 = bars
    # ---- the pizz eighths: varied pitches round the F pedal (never one pitch at an even rate, never a tune)
    cells = [['F2', 'C3', 'F2', 'F2', 'Gb2', 'F2', 'C3', 'F3'],
             ['F2', 'C3', 'F3', 'F2', 'Gb2', 'C3', 'F2', 'Gb2'],
             ['F2', 'F2', 'C3', 'F2', 'Gb2', 'F2', 'Db3', 'C3'],
             ['F2', 'C3', 'F2', 'Gb2', 'F2', 'C3', 'F3', 'C3']]
    acc = [1.0, 0.78, 0.86, 0.8, 0.94, 0.78, 0.88, 0.82]
    for bar in range(b0, b1):
        cell = cells[(bar - b0) % len(cells)]
        for i, p in enumerate(cell):
            beat = 1 + 0.5 * i
            if card and bar == 2 and beat < 2.0:          # the freeze hit owns beat 1 of the card bar
                continue
            if bar == 6:                                   # the cluster moved: the pizz follows its Gb
                p = {'F3': 'Gb3'}.get(p, p)
            a.n('vc', p, (bar, beat), '1/8', 0.46 * acc[i], lock=True, art='pizz')
        # the contrabass doubles the pedal on 1 (and on 3.5 in alternate bars: uneven, never lub-dub)
        if not (card and bar == 2):
            a.n('cb', 'F1', (bar, 1), '1/4', 0.5, lock=True, art='pizz')
        if (bar - b0) % 2 == 1 and not (card and bar == 4):
            a.n('cb', 'F1', (bar, 3.5), '1/4', 0.4, lock=True, art='pizz')
    # ---- the muted-808 thud: a sparse, uneven pattern on the eighth grid (x.....x. | ..x.....)
    thud = [[1.0, 4.0], [2.5], [1.0, 3.5], [3.0]]
    for bar in range(b0, b1):
        if card and bar in (2, 4):                         # card bar: the freeze hit; bar 4: only the eighths
            continue
        for bt in thud[(bar - b0) % len(thud)]:
            if card and bar == 7 and bt != 1.0:
                continue
            v = 0.62 if bt == 1.0 else 0.5
            a.n('k808', 'F1', (bar, bt), '1/4', v, lock=True, decay=0.26, punch=5.0, click=0.03, drive=1.0)
            a.n('bdrum_muted', 60, (bar, bt), '1/4', v * 0.55, lock=True)
    # ---- the chip tick: keeps one eighth in four, and the kept eighth moves (the Wi-Fi's one bar of four)
    keep = [(1.5, 3.0), (2.0, 4.5), (1.0, 3.5), (2.5, 4.0), (1.5, 4.5), (2.0, 3.5)]
    clocks = [11000.0, 17000.0, 8000.0, 23000.0, 14000.0, 9500.0]
    k = 0
    for bar in range(b0, b1):
        if card and bar in (2, 4):
            continue
        for bt in keep[(bar - b0) % len(keep)]:
            a.n('noise', 60, (bar, bt), '1/16', 0.42 if k % 3 else 0.5, lock=True, clock=clocks[k % len(clocks)],
                short=(k % 4 == 3), dec=0.03, sus=0.0, rel=0.02, hp=2500)
            k += 1
    # ---- the low grand clusters: F2 Gb2 C3, shifting a semitone at a time (who has the leverage now)
    A_ = ['F2', 'Gb2', 'C3']
    B_ = ['Gb2', 'G2', 'Db3']
    ped = []
    if bed:
        a.ch('grand', A_, (b0, 1), '2bar', 0.3, roll=0.004)
        a.ch('grand', B_, (b0 + 2, 1), '2bar', 0.3, roll=0.004)
        ped = [(g.t(b0) + 0.01, True), (g.t(b0 + 2) - 0.02, False), (g.t(b0 + 2) + 0.01, True),
               (g.t(b0 + 4) - 0.03, False)]
    else:
        a.ch('grand', A_, (1, 1), '1bar', 0.3, roll=0.004)                       # b1: the grid connects
        a.ch('grand', A_, (2, 2), '7b', 0.26, roll=0.004)                        # b2.2 after the 1-beat dip, to b4.1
        a.ch('grand', A_, (5, 1), '1bar', 0.34, roll=0.004)                      # b5: the dialog
        a.ch('grand', B_, (6, 1), '1bar', 0.37, roll=0.004)                      # b6: up a semitone
        ped = [(g.t(1) + 0.01, True), (g.t(2) - 0.015, False),                   # the dip: pedal up, no ring
               (g.t(2, 2) + 0.01, True), (g.t(4) - 0.02, False),                 # b4: everything but the eighths
               (g.t(5) + 0.01, True), (g.t(6) - 0.02, False), (g.t(6) + 0.01, True), (g.t(7) - 0.02, False)]
    T['grand'].pedal = ped
    if bed or not card:
        return
    # ---- b2: Neleh's clockwork pizzicato rides the card's bar (straight, precise, 0 ms)
    a.line('vln1', 'F5/16 C5/16 Ab4/16 C5/16 G5/16 C5/16 Ab4/16 C5/16 F5/16 C5/16 Ab4/16 C5/16', (2, 2), vel=0.32,
           lock=True, art='pizz')
    # ---- b3: [PF] his calm: one felt F4, and nothing else new
    a.n('felt', 'F4', (3, 1), '3b', 0.2)
    a.n('felt_mech', 60, (3, 1), 0.1, 0.3)
    # ---- b5: the 1993-style dialog: the 1-bit beeper, F F F (F4 F5 F4), uneven and straight
    for p, bt, d in (('F4', 1.0, '1/8'), ('F5', 2.5, '1/16'), ('F4', 4.0, '1/8d')):
        a.n('beeper', p, (5, bt), d, 0.6, lock=True, rel=0.01, att=0.0, dec=0.0, sus=1.0)
    # ---- b6: the eyes strip: violins trem "sul pont" ppp; Mada's spinner under his tile (to the click)
    art.trem(a, 'vln2', ['F5', 'Gb5'], (6, 1), '1bar', vel=0.3, swell=('ppp', 'pp'), lock=True)
    for i in range(16):
        a.n('celesta', 'C5' if i % 2 == 0 else 'Db5', (6, 1 + 0.5 * i), '1/8', 0.34 if i % 2 == 0 else 0.3, lock=True)
    # ---- b7: STEP FOUR in quarters (muted horns + bassoon), parallel fifths top to bass; the Gbmaj7 holds
    steps = [((7, 1), ['Bb3', 'C4', 'Db4', 'F4'], 'Bb2', '1b'),
             ((7, 2), ['Ab3', 'Bb3', 'C4', 'Eb4'], 'Ab2', '1b'),
             ((7, 3), ['F3', 'Gb3', 'Bb3', 'Db4'], 'Gb2', '2b')]
    for at, ch, bass, d in steps:
        for j, p in enumerate(ch):
            a.n('hn', p, at, d, 0.5 if j == len(ch) - 1 else 0.42, lock=True, art='mute', rel=0.12)
        a.n('bsn', bass, at, d, 0.5, lock=True, rel=0.12)
        # fix 1 (balance): the world's leverage takes the step too -- the low grand doubles Step Four's bass in
        # octaves (Bb, Ab, Gb), soft, dry of the pedal, level (no riser); it stops with everything at the click
        a.ch('grand', [nm(bass) - 12, nm(bass)], at, d, 0.26, lock=True, roll=0.0)


def dark_room(a, T, D):
    """26A: a single felt (the Water Line in extreme augmentation), then the Rewind.  D = 26A's first bar."""
    g = a.g
    felt = []
    # D.1: the carve: an open fifth F3 + C4 (above the room drone: nothing below C3)
    felt += a.ch('felt', ['F3', 'C4'], (D, 1), '2b', 0.33, lock=True, roll=0.006)
    a.n('felt_mech', 60, (D, 1), 0.1, 0.35, lock=True)
    # D+1.1: the nudge, G4 (the add9: his smile, one pixel): the one sustained note under the first V.O. line.
    # Felt alone (no chip double in a V.O. window); it rings through the line and nothing moves under it
    felt.append(a.n('felt', 'G4', (D + 1, 1), '6b', 0.31))
    # D+2: the Orb counts 1, 2, 3 (SFX servo).  The score does not count: hold, then lift the pedal on beat 3
    # D+3..D+4: his real post: DRY
    # D+5.1: the wallet, the moth: the Water Line's C4, one felt note (locked: it enters right after the dry post)
    felt.append(a.n('felt', 'C4', (D + 5, 1), '4b', 0.34, lock=True))
    a.n('felt_mech', 60, (D + 5, 1), 0.1, 0.3, lock=True)
    # D+6.1: [PF] the second V.O. line: one sustained felt note on the cut, Eb4 (the b7: unresolved, his calm)
    felt.append(a.n('felt', 'Eb4', (D + 6, 1), '4b', 0.4))
    # D+7: the Water Line's settle, C4 -> F4 ("C4 q F4 h.") ... and the Orb takes it back after one beat
    felt.append(a.n('felt', 'C4', (D + 7, 1), '1b', 0.24))
    felt.append(a.n('felt', 'F4', (D + 7, 2), '1b', 0.26))
    T['felt'].pedal = (T['felt'].pedal or []) + [
        (g.t(D) + 0.005, True), (g.t(D + 2, 3), False),
        (g.t(D + 5) + 0.01, True), (g.t(D + 6) - 0.02, False), (g.t(D + 6) + 0.01, True),
        (g.t(D + 7) - 0.02, False), (g.t(D + 7) + 0.01, True), (g.t(D + 7, 3) - 0.01, False)]
    # D+7.3: THE REWIND: the last 2 beats (C4 sounding on beat 1, F4 struck on beat 2) retrograded as notes,
    # through the 16-bit sample-chip, a semitone lower per beat -> E4, Bb3; cut on D+8.1 (the exit)
    a.n('snes_piano', 'E4', (D + 7, 3), '1b', 0.26, lock=True)
    a.n('snes_piano', 'Bb3', (D + 7, 4), '1b', 0.26, lock=True)
    return felt


def compose(form='picture'):
    if form == 'bed':
        g = Grid(bpm=96, meter='4/4', bars=4, swing=1.0)
        a = Arr(g)
        T = _tweak(palette())
        leverage(a, T, bars=(1, 5), card=False, bed=True)
        a.section('LEVERAGE bed (loop)', 1, 5)
        a.mark('bed downbeat', (1, 1))
        return g, a, T, dict(loop=g.span(1, 5), mutes=[], D=None)
    D = 22 if form == 'picture' else 10          # 26A's first bar
    g = Grid(bpm=96, meter='4/4', bars=D + 7, swing=1.0)
    a = Arr(g)
    T = _tweak(palette())
    leverage(a, T, bars=(1, 8), card=True)
    dark_room(a, T, D)
    # sections: the picture's phrases (the balance and the piano roll read them)
    a.section('26 P1 call connects (LEVERAGE low)', 1, 5)
    a.section('26 P2 dialog, eyes, arrow (LEVERAGE)', 5, 8)
    a.section('D6: silence' if form == 'picture' else 'D6 (album: 2 bars)', 8, D)
    a.section('26A carve + V.O. 1', D, D + 3)
    a.section('26A his post (DRY)', D + 3, D + 5)
    a.section('26A wallet, V.O. 2, the Rewind', D + 5, D + 8)
    for lab, at in [('b1.1 grid connects', (1, 1)), ('b2.2 Neleh clockwork (after the 1-beat dip)', (2, 2)),
                    ('b3.1 his calm (felt F4)', (3, 1)), ('b5.1 the 1993 dialog (1-bit F)', (5, 1)),
                    ('b6.1 eyes strip (cluster up a semitone)', (6, 1)), ('b7.1 arrow step 1 (Bbm)', (7, 1)),
                    ('b7.2 arrow step 2 (Ab)', (7, 2)), ('b7.3 arrow step 3 (Gbmaj7)', (7, 3)),
                    ('b8.1 THE CLICK = HARD STOP (D6)', (8, 1)),
                    (f'b{D}.1 26A the carve (felt open fifth)', (D, 1)),
                    (f'b{D + 5}.1 the wallet (felt C4)', (D + 5, 1)),
                    (f'b{D + 7}.2 the settle (F4)', (D + 7, 2)),
                    (f'b{D + 7}.3 rewinding... (THE REWIND)', (D + 7, 3)),
                    (f'b{D + 8}.1 EXIT = sc 27 downbeat (hard cut)', (D + 8, 1))]:
        a.mark(lab, at)
    end = g.t(D + 8)
    mutes = [(g.t(8), g.t(D) - 0.012),                 # D6: the click to 26A (tails cut; back 12 ms early)
             (g.t(D + 3), g.t(D + 5) - 0.012),         # his real post: dry
             (end, end + 6.0)]                         # the exit: the Rewind is cut on sc 27's downbeat
    return g, a, T, dict(loop=None, mutes=mutes, D=D)


def score(form, meta):
    g, a, T, o = compose(form)
    D = o['D']
    if D is not None:
        meta['silence_windows'] = [((D + 3, 1), g.t(D + 5) - 0.02, 'his real post (typed; 9:32 PM PT): DRY', -70.0)]
        meta['vo_windows'] = [((D + 1, 1), (D + 2, 1), '"i don\'t keep score." (felt alone)'),
                              ((D + 6, 1), (D + 7, 1), '"the meeting ended early." (felt alone)')]
        meta['sfx_slots'] = [dict(t='2:1', bar=2, beat=1, sfx='freeze_hit (NELEH card; key to confirm, s6.8 req. 2)',
                                  note='every stem rests beat 1'),
                             dict(t='8:1', bar=8, beat=1, sfx='the Cancel click', note='D6 starts on its frame'),
                             dict(t=f'{D + 2}:2', bar=D + 2, beat=2, sfx='orb_servo x3 (the Orb counts the tally)',
                                  note='the score holds; it does not count'),
                             dict(t=f'{D + 7}:3', bar=D + 7, beat=3, sfx="the Orb's toast `rewinding...`",
                                  note='the Rewind is score (a retrograde); reverse swells stay SFX')]
        # fix 1: 26A is the dark room, where the SFX room_drone (F1 + C2) may sit: the engine's sub check (s6.5)
        # runs over the two scored stretches (the felt stays above C3; nothing to mute)
        meta['room_sfx'] = [dict(t0=(D, 1), t1=(D + 3, 1), sfx='room_drone (26A carve + V.O. 1)'),
                            dict(t0=(D + 5, 1), t1=(D + 8, 1), sfx='room_drone (26A wallet, V.O. 2, the Rewind)')]
    return Score(meta['id'], g, T, a.notes, loop=o['loop'], markers=a.markers, sections=a.sections, mutes=o['mutes'],
                 tail_s=3.0, meta=meta, length_s=(g.t(D + 8) if D is not None else None))


META = dict(
    BASE_META,
    id='mm08-the-falling-tile',
    title='The Falling Tile (album edit)',
    tone='a trap closing without a tune, a click that takes every sound away, then one felt piano in the dark -- '
         'and the Orb rewinding his settle',
    scenes=['Ep1 sc 26 (13:21) + 26A (14:14): album edit, the D6 silence cut to 2 bars (to picture: '
            'tracks/e01-s26-the-falling-tile)'],
    audition=[
        '0:00-0:17.5 (bars 1-7): LEVERAGE -- a trap closing, not a tune; the thud must never read as a heartbeat '
        '(it is uneven on purpose) and the pizz must not read as a melody',
        '0:15.0-0:17.5 (bar 7): Step Four on muted horns -- level, no riser; then 0:17.5 the stop: a blow, not a '
        'glitch',
        'FIX 1, 0:00-0:17.5: the low grand clusters are 9 dB up and double Step Four\'s bass in bar 7 -- the leverage '
        'shifting a semitone now audible, but still no tune, not murky against the pizz and the thud? The cello pizz '
        'is notched at 111.7 Hz: does the pedal still sound woody, and does anything sound major?',
        '0:22.5-0:30 (26A): the felt open fifth, then the G4 nudge alone under the first V.O. line -- '
        'still, not sad',
        '0:40.0-0:42.5: the settle F4, then the Rewind (E4, Bb3 on the 16-bit sample-chip) -- the Orb taking it '
        'back, not a tape effect; the cut at 0:42.5 should feel like the exit, not an error',
    ],
)


def build(form='album'):
    meta = dict(META)
    return score(form, meta)


def build_variants(argv):
    """The LEVERAGE bed (loopable) into render/variants/."""
    vdir = os.path.join(HERE, 'render', 'variants')
    meta = dict(BASE_META, id='mm08-leverage-bed', title='The Falling Tile: LEVERAGE bed (call connecting, loop)',
                tone='the call connecting: LEVERAGE (low) as a seamless 4-bar loop, no card, no felt',
                scenes=['Ep1 sc 26 phrase 1 (conform extensions)', 'Ep1 sc 9 (the check)',
                        'Ep1 sc 30 (up to the calm-off)', 'Ep2 sc 18-19 (LEVERAGE)'],
                motifs=['none: LEVERAGE has no melody'], motif_ids=[], album_loops=3, album_lufs=-18.0,
                underscore_lufs=-22.0,
                audition=['loop-x3-preview seams at 10.0 s and 20.0 s: no click, no level dip; the cluster '
                          'returns to F2 Gb2 C3 on the downbeat'])
    sc = score('bed', meta)
    _export_build(sc, vdir, meta['id'], stems='--no-stems' not in argv, loop=True, previews=True,
                  check_loop='--verify-loop' in argv)


if __name__ == '__main__':
    if '--variants' in sys.argv:
        sys.argv.remove('--variants')
        build_variants(sys.argv)
        sys.exit(0)
    render_cli(build, __file__)
