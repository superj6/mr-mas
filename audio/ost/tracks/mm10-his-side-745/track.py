"""MM-10 "His Side / 745"  --  E01-S29a (his side, mostly silent) + E01-S29b (THE TILE AVALANCHE, the S3).
Composer D.  OST-BIBLE s5.D1.  Palettes: P01 DARK ROOM (form a) -> P11 SET-PIECE SWING (form b).

TO PICTURE.  Cut against the Ep1 Act Four timing lock v2 (show/episodes/ep01/production/act4/history/timing-v2.md,
shots-locked-v2.json).  File t = 0 is act frame 5925 (episode 16:37:21, shot 29.00, the home shot); the file
runs 2370 frames (98.75 s) to act frame 8295 (18:16:15, the first frame of sc 30).  The lock is 6.42 s longer
than the printed 16:28-18:00 (92 s) the bible quotes: this cue follows the lock.

GRID.  96 BPM (15 f a beat, 60 f a bar).  1 pickup beat (29.00's second beat), so bar 1 = act frame 5940
(an act bar line) and the D5 bar (29.01a, act 6060) is bar 3.  Bar 22 is 5/4: the lock's 29.12 shot is 2 bars
+ 1 beat, which moves the act's bar phase by a beat; the 5/4 bar sits inside the silence (the D8 line, the
door, Tasya, 'leave it open.') so the avalanche's 16 bars are cue bars 24-39 on their own downbeats
(bar 24 = act 7335 = 29.14 f0; bar 38 = act 8175 = the MADA card).

FORM A (bars 0-23, straight, his room: 'mostly silent')
  2        V.O. 'i put the phone down.'  felt: the Water Line bar 1 (F F F G-sw F), pp.  The settle never
           comes: the D5 hard cut takes it.
  3        [MAS'S VERSION]: EMPTY for composer E's MM-02 keynote bar (a hard stop at 6060, tails cut)
  4-6      Rima's real post + 8 hearted Ticks + the clearance bar: DRY
  7        V.O. 'the badge was a joke.'  ONE felt note: C4 -- the Water Line's bar 2 starts, and again the
           settle (F4) never comes.  Out before 'mostly.' (his room line lands dry).
  9.2-10.1 THE LETTER counter 505-650-700-745: the Build's first cell (chip, straight), 12 sixteenths,
           stopping dead on the clunk (act 6480).  STRICT_CARD_CLEAR=True drops it (see README: the lock
           leaves 2 beats, not 4, between the clunk and the quote card).
  10.3-17  the employee-letter card, ALYI (REPORTED), the Orb's chime, the check: NO SCORE (the record)
  17.4     Gerg: 'One sec. Compiling.' -> the Build, compile pass 1 (4 notes, chip + xylo)
  18       Mas: 'what are you building?' -> dry
  19.2     Gerg: 'The company. Again. Just in case.' -> pass 2 (8 notes), then pass 3 cut dead after 4 notes
           by the quiet beat (act 7080).  BUILD_STOP='glance' lets pass 3 finish on Gerg's glance (7110).
  20-23    the quiet beat, the D8 line, the door, Tasya, 'leave it open.': NO MUSIC (4.25 bars of room)

FORM B = THE TILE AVALANCHE (bars 24-39 = avalanche bars A1-A16, swung, featured)
  A1-A4    phrase 1: the Build as a SWUNG chip lead compiling 4 -> 8 -> 12 -> 16 notes (the people swing:
           the employees are the company Gerg keeps rebuilding); timpani on A1; ride from A1, walking bass
           from A2, low strings + piano comping from A3; a brass kick ends the phrase
  A5-A8    phrase 2: STEP FOUR in the low strings (+ bassoon, muted horn), half notes.  A6.3 = ALYI RESISTS:
           the engine stops for one beat and only the board's chord holds (a re-bowed sfz).  A7 = NELEH's
           dialogue window (thinned, no lead).  The second statement is shoved a swung eighth early; its
           blank fourth step is CRUSHED by the Build and two brass hits.
  A9-A12   phrase 3: THE WATER LINE AUGMENTED (violins in octaves + a 50 % chip square).  A9.3 = THE QUIET
           VOTE: the board's bowed F pedal drops out silently, no hit.  A11.3: the settle arrives at last,
           the held high F; A12 thins to the Build + that F.
  A13-A14  phrase 4: THE EPISODE'S ONE FULL BAND (2 bars): trumpets, trombones, saxes on a sustained
           C7(#9b13), strings tremolo + a timpani roll pressing (level held, no ramp into the card); MADA's
           spinner (C5-Db5, celesta + chip).
  A15.1    EVERYTHING STOPS DEAD on the MADA card (act 8175; the SFX freeze_hit_F owns the downbeat).
           A15-A16 = the card and the room.  CARD_BAR moves the stop (alternates: 37, 38, 39).

THE ALBUM EDIT (fix pass 1, 2026-09-26; build_album(), render_all()).  The picture version stays the underscore master
and the stems; the album master (<id>-album.wav) is an edit on its own grid: form a's fragments with 1-bar rests (and
MM-02's keynote bar as "his version"), the avalanche A1-A12 as in picture, a second chorus (A13-A24: the stack, the
board presses, 745 faces -- chorus_two()), the band for 3 bars (the CARD_BAR=39 alternate), the dead stop.  Run
`python track.py` (build.py renders the picture only); `--album-edit-only` re-renders the edit.
"""
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))
from engine import *   # noqa: E402,F401,F403
from engine.motifs import line_pitches   # noqa: E402
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'mm02-his-version')))
from keynote import keynote_track, VOICINGS as KEYNOTE_V   # noqa: E402  (the album edit's D5 bar)

HERE = os.path.dirname(os.path.abspath(__file__))
ID = 'mm10-his-side-745'
ALBUM_EDIT_ID = f'{ID}-album-edit'

# ------------------------------------------------------------------ switches (conform / rulings)
CARD_BAR = 38               # the MADA card's downbeat (cue bar); lock v2 = 38 (A15).  Alternates: 37 (A14), 39 (A16)
BUILD_STOP = 'quiet'        # 'quiet' = dead stop on the cut into the quiet beat (script: no music in it);
                            # 'glance' = pass 3 finishes and stops on Gerg's glance up (act 7110)
STRICT_CARD_CLEAR = False   # True = no Build under the counter (rule 10's full bar clear before the quote card)

AF0 = 5925                  # act frame of file t = 0 (29.00 f0)


def AF(f):
    """Act frame (lock v2) -> cue seconds."""
    return (f - AF0) / 24.0


def A(k):
    """Avalanche bar k (1-16) -> cue bar."""
    return 23 + k


_A_PIC = A                                   # the picture: A1 = cue bar 24


def _A_ALBUM(k):
    """The album edit: A1 = bar 10 (after its 9-bar intro); A13-A24 is its chorus 2; the band is A25-A27."""
    return 9 + k


META = dict(
    id='mm10-his-side-745',
    mm='MM-10',
    title='His Side / 745',
    family='P01 DARK ROOM -> P11 SET-PIECE SWING',
    tone='his version of the five days: almost nothing, then the company falls into his lap as a swung avalanche '
         'that stops dead on the one man who will not move',
    usage='VI',
    tags=['to picture', 'E01-S29a', 'E01-S29b', 'S3 set-piece', 'the one full band of Ep1', 'swing', 'dark room'],
    scenes=['E01-S29a his side (lock v2 act 5925-7335, 16:37:21-17:36:15)',
            'E01-S29b the tile avalanche (act 7335-8295, 17:36:15-18:16:15)'],
    motifs=['the Water Line bar 1 (felt, bar 2), its bar-2 C4 alone (felt, bar 7)',
            'the Build: straight chip cell under the counter (9.2) and Gerg\'s compile passes 4 / 8 / (12) (17-19)',
            'the Build as the SWUNG chip lead, compiling 4-8-12-16 (A1-A4), crushing step four (A8)',
            'Step Four (low strings, bassoon, muted horn), twice; Alyi\'s held beat A6.3; the blank crushed A8',
            'the Water Line AUGMENTED (violins 8ves + chip square), the settle held high (A9-A12)',
            'Mada\'s spinner C5-Db5 (celesta + chip, A13-A14)',
            'the full band on C7(#9b13) (A13-A14), then the dead stop on the card (A15.1)'],
    motif_ids=['WATER_LINE', 'BUILD', 'STEP_FOUR', 'MADA_SPINNER'],
    key='F minor -> Bb minor (Step Four) -> F minor -> C7(#9b13) pedal, unresolved (the card\'s freeze hit is on F)',
    composer='Composer D (OST batch 1)',
    underscore_lufs=-16.0,     # featured: the avalanche is a wordless S3 (form a is composed down to -24 V.O. windows)
    audition=[
        '58.75 s (A1.1, act 7335, 17:36:15) after 4.25 bars of room: does the avalanche ERUPT out of the door beat\'s '
        'silence (timpani F + the chip compile, 4 notes), or whimper?',
        '93.75 s (the MADA card, act 8175) with freeze_hit_F laid in: the dead stop -- a stop that gets the laugh '
        '(the stat is the joke), never a playback glitch',
        '88.75-93.75 s: the episode\'s ONE full band on C7(#9b13) -- earned after three chip-led phrases? It must '
        'press at a held level (no ramp that telegraphs the card)',
        '58.75-68.75 s: the Build as a chip lead in 16ths swung 0.7 over the swung-eighth ride -- a double-time '
        'shuffle, or two swings fighting? Any Nintendo overworld feel is a fail',
        '78.75-88.75 s: the Water Line augmented (violins in octaves + chip triangle, the square on the nudge at 82.5 s) '
        '-- does his calm line read inside the avalanche; is the held high F at 85.0 s the settle at last?',
        '2.5-5.6 s with a4-29-vo1 laid in: the felt Water Line bar 1 under "i put the phone down." (V.O. window -22.7 '
        'LUFS); then the cut to composer E\'s keynote bar at 5.625 s (act 6060)',
        '72.5 s (A6.3): Alyi\'s held beat -- the engine stops for a beat and only the board\'s chord holds: '
        'resistance, or a dropout?',
    ],
)


BUILD = line_pitches(MOTIFS['BUILD']['line'])      # the Build's 16 notes (OST-BIBLE s2.6)
SW16 = 0.7                                         # the avalanche's chip lead: its 16ths swung (double-time shuffle)
CHIP = dict(duty=0.25, rel=0.035, dec=0.09, sus=0.45, att=0.002)


def _score(album=False):
    A = _A_ALBUM if album else _A_PIC                   # avalanche bar k -> cue bar (the album edit's own grid)
    if album:
        g = Grid(bpm=96, meter='4/4', bars=A(28), swing=1.0, pickup=1)
    else:
        g = Grid(bpm=96, meter='4/4', bars=39, swing=1.0, pickup=1, meters=[(22, '5/4'), (23, '4/4')])
    a = Arr(g)
    T = palette()
    mutes, sil, vo, slots = [], [], [], []

    # ------------------------------------------------------------ track settings (levels set by analysis)
    T['felt'].gain_db = -1
    T['felt'].sends = {'room': -12, 'hall': -18}
    T['lead'].gain_db = -2
    T['lead'].sends = {'room': -14, 'snes': -16}
    T['lead2'].gain_db = -2
    T['tri'].gain_db = -6
    T['arp'].gain_db = 1
    T['xylo'].gain_db = -8
    T['celesta'].gain_db = -6
    T['grand'].gain_db = 6
    T['grand'].sends = {'room': -12, 'hall': -16}
    T['ubass'].gain_db = 0
    T['jazz'].gain_db = 4
    T['timp'].gain_db = -4
    T['bsn'].gain_db = -4
    for k in ('tpt', 'tbn'):
        T[k].gain_db = -6
    for k in ('asax', 'bsax'):
        T[k].gain_db = -9
    T['tsax'].gain_db = -6
    for k in ('vln1', 'vln2', 'vla', 'vc', 'cb'):
        T[k].gain_db = -1
    T['hn'].gain_db = -3

    def build16(inst, bar, idx, vel, transpose=0, swing=0.0, lock=True, beat0=1.0, accents=(1.0, 0.72, 0.84, 0.72),
                **x):
        """Build notes by 16th index (0-15), from `beat0` of `bar`; swung at the 16th if `swing`."""
        out = []
        q0 = g.bar_q(bar) + (beat0 - 1.0)
        for i in idx:
            qa, qb = q0 + 0.25 * i, q0 + 0.25 * (i + 1)
            ta = g.tq(g.swing_q(qa, swing, 0.25)) if swing else g.tq(qa)
            tb = g.tq(g.swing_q(qb, swing, 0.25)) if swing else g.tq(qb)
            v = min(1.0, vel * accents[i % 4])
            out.append(a.n(inst, BUILD[i % 16] + transpose, ta, (tb - ta) * 0.62, v, lock, **x))
        return out

    def with_wood(notes, vel=0.22, every=4):
        """Gerg's doubling: xylophone (in unison with the chip) on each group's first note."""
        for j, n in enumerate(notes):
            if j % every == 0:
                a.n('xylo', n.pitch, n.start, 0.1, vel, lock=True)

    # ============================================================ FORM A: his side (mostly silent)
    if not album:
        a.sections.append(('a: home shot + V.O.', 0.0, g.t(3)))
        # 29.01 -- V.O. D5 'i put the phone down.' (act 5985-6037): the felt alone, the Water Line bar 1, pp
        vo.append((AF(5985), AF(6060), 'V.O. a4-29-vo1 (felt only)'))
        wl1 = a.line('felt', 'F4/4 F4/4 F4/4 G4/8 F4/8', (2, 1), vel=0.19, swing=True)
        for i, n in enumerate(wl1):
            n.vel *= (1.0, 0.9, 0.94, 1.04, 0.86)[i]
            a.n('felt_mech', n.pitch, n.start, 0.05, 0.2)
        T['felt'].pedal = [(g.t(2) - 0.05, True), (g.t(3) - 0.04, False)]
        # 29.01a -- [MAS'S VERSION]: composer E's keynote bar.  D leaves it EMPTY: the felt stops dead on the cut,
        # and nothing of D's rings back through the real post (digital silence to the C4 at bar 7)
        a.section('a: D5 bar (EMPTY: MM-02) + real post (DRY)', 3, 7)
        a.mark('D5 hard cut (MAS\'S VERSION: E\'s bar)', (3, 1))
        mutes.append((AF(6060), AF(6300) - 0.06))
        sil.append((AF(6120), AF(6300) - 0.06, 'real post a4-29-01 (Rima) + the 8 Ticks + the clearance bar', -70.0))
        slots.append(dict(t=round(AF(6120), 4), sfx='heart Tick x8 (one per beat, act 6120-6225)'))
        # 29.10 -- V.O. D3 'the badge was a joke.' (6300-6359): ONE felt note, the Water Line's bar-2 C4 (no settle)
        a.section('a: V.O. + mostly.', 7, 9)
        vo.append((AF(6300), AF(6359), 'V.O. a4-29-vo2 (one felt note)'))
        c4 = a.n('felt', 'C4', (7, 1), '2.2b', 0.42, lock=True)
        a.n('felt_mech', 'C4', c4.start, 0.05, 0.2, lock=True)
        sil.append((AF(6381), AF(6404), "room line 'mostly.' (lands dry)", -60.0))
        # 29.05 -- THE LETTER: the counter 505 . 650 . 700 . 745 (one stop a beat); the clunk at 745 (act 6480)
        a.section('a: the counter (745)', 9, 10)
        if not STRICT_CARD_CLEAR:
            build16('lead', 9, range(0, 12), 0.56, beat0=2.0, **CHIP)        # bar 9 beat 2 = act 6435 (the cut)
            a.mark('the clunk (745): the Build stops dead', AF(6480))
            mutes.append((AF(6480), AF(6510)))
        slots.append(dict(t=round(AF(6480), 4), sfx="the counter's clunk at 745 (sc 6 drill clunk, REUSE)"))
        # 29.06-29.08 -- the quote card (3 bars), ALYI (REPORTED), the Orb's chime, the check: the record, dry
        a.section('a: letter card + REPORTED + check (DRY)', 10, 17)
        sil.append((AF(6480) + 0.004, AF(6750), 'quote card 29.06 (the employee letter) + clearance (2 beats before: the '
                    "lock's clunk-to-card gap; 1 bar after)", -70.0))
        sil.append((AF(6750), AF(6900), "ALYI (REPORTED) + the Orb's chime + the check (pure record)", -70.0))
        slots += [dict(t=round(AF(6750) + 1.5, 4), sfx="the Orb's two-note chip chime on F (29.07a)"),
                  dict(t=round(AF(6855), 4), sfx='rubber_stamp_C: VOID IF CEO MISSING (29.08 f45)')]
        # 29.11 -- Gerg: 'One sec. Compiling.' (6908-6938) -> compile pass 1: 4 notes (chip + xylo), then dead
        a.section('a: Gerg compiling', 17, 20)
        with_wood(build16('lead', 17, range(0, 4), 0.56, beat0=4.0, **CHIP), 0.2, 1)
        a.mark('compile pass 1 (after "Compiling.")', (17, 4))
        mutes.append((AF(6960), AF(7034)))          # the pass stops dead: Mas's line lands dry
        sil.append((AF(6964), AF(7012), "room line 'what are you building?' (lands dry)", -60.0))
        # 29.11b -- Gerg: 'The company. Again. Just in case.' (7023-7071) -> pass 2 (8 notes), pass 3 cut by the quiet beat
        with_wood(build16('lead', 19, range(0, 8), 0.56, beat0=2.0, **CHIP), 0.2, 1)
        a.mark('compile pass 2', (19, 2))
        p3 = range(0, 12) if BUILD_STOP == 'glance' else range(0, 4)
        with_wood(build16('lead', 19, p3, 0.58, beat0=4.0, **CHIP), 0.2, 1)
        stop_build = AF(7110) if BUILD_STOP == 'glance' else AF(7080)
        a.mark('the Build stops dead (%s)' % ('Gerg glances up' if BUILD_STOP == 'glance' else 'the quiet beat'),
               stop_build)
        mutes.append((stop_build, AF(7140)))
        slots.append(dict(t=round(AF(7080), 4), sfx='typing_soft through the monitor (the quiet beat)'))
        # the quiet beat, the D8 line, the door's three steps, Tasya, 'leave it open.': no music
        a.section('a: quiet beat, D8, the door (NO MUSIC)', 20, 24)
        sil.append((stop_build + 0.004, AF(7335) - 0.02, "the quiet beat + D8 V.O. + the door + Tasya + "
                    "'leave it open.' (no music)", -70.0))
        slots.append(dict(t=round(AF(7186), 4), sfx="the door's held steps (act 7186, 7201, 7216)"))

    else:
        # the album edit's intro: form a's fragments in order, the dry windows turned into musical rests
        a.sections.append(('a: his side (album edit)', 0.0, g.t(A(1))))
        wl1 = a.line('felt', 'F4/4 F4/4 F4/4 G4/8 F4/8', (1, 1), vel=0.19, swing=True)   # the Water Line bar 1, pp
        for i, n in enumerate(wl1):
            n.vel *= (1.0, 0.9, 0.94, 1.04, 0.86)[i]
            a.n('felt_mech', n.pitch, n.start, 0.05, 0.2)
        T['felt'].pedal = [(g.t(1) - 0.05, True), (g.t(2) - 0.04, False)]
        # bar 2: HIS VERSION -- the KEYNOTE bar (MM-02's D5 insert, the same notes), cut dead mid-note on b3.1
        keynote_track(T)
        a.ch('keynote_ch', KEYNOTE_V[1][0], (2, 1), g.dur('6b', g.t(2)), 0.26, lock=True)
        a.line('keynote', 'Db5/4 Db5/4 Db5/4 Eb5/8', (2, 1), vel=0.33, lock=True, gate=1.0)
        a.n('keynote', 'Db5', (2, 4.5), g.dur('2.5b', g.t(2, 4.5)), 0.33, lock=True)
        T['keynote'].pedal = [(0.0, False), (g.t(2) + 0.012, True), (g.t(3) + 2.0, False)]
        T['keynote_ch'].pedal = T['keynote'].pedal
        a.mark('his version (the KEYNOTE bar), cut mid-note', (2, 1))
        mutes.append((g.t(3), g.t(4) - 0.06))                     # a bar of silence: the real post
        c4 = a.n('felt', 'C4', (4, 1), '2.2b', 0.42, lock=True)  # one felt note: the settle never comes
        a.n('felt_mech', 'C4', c4.start, 0.05, 0.2, lock=True)
        build16('lead', 5, range(0, 12), 0.56, beat0=2.0, **CHIP)     # the counter: 505 . 650 . 700 . 745
        a.mark('the clunk (745): the Build stops dead', (6, 1))
        mutes.append((g.t(6), g.t(7, 4) - 0.03))                  # the letter card, REPORTED, the check
        with_wood(build16('lead', 7, range(0, 4), 0.56, beat0=4.0, **CHIP), 0.2, 1)
        a.mark('compile pass 1', (7, 4))
        mutes.append((g.t(8), g.t(8, 2) - 0.03))
        with_wood(build16('lead', 8, range(0, 8), 0.56, beat0=2.0, **CHIP), 0.2, 1)
        with_wood(build16('lead', 8, range(0, 4), 0.58, beat0=4.0, **CHIP), 0.2, 1)
        a.mark('the Build stops dead (the quiet beat)', (9, 1))
        mutes.append((g.t(9), g.t(A(1)) - 0.02))                  # the quiet beat and the door: one bar

    # ============================================================ FORM B: THE TILE AVALANCHE (swung)
    ch3 = [(A(1), 'Fm(add9)'), (A(2), 'Fm9'), (A(3), 'Dbmaj7#11'), (A(4), 'C7sus(b9)'),
           (A(5), 'Bbm(add9)'), ((A(5), 3), 'Ab(add9)'), (A(6), 'Gbmaj7'), ((A(6), 4), 'F5'),
           (A(7), 'Bbm(add9)'), ((A(7), 3), 'Ab(add9)'), (A(8), 'Gbmaj7'), ((A(8), 3), 'Fm11'),
           (A(9), 'Fm(add9)'), (A(10), 'Dbmaj7'), (A(11), 'Bbm9'), ((A(11), 3), 'C7sus(b9)'), (A(12), 'F5')]
    if album:                                   # chorus 2: the stack (phrase 1's changes), the board presses
        ch3 += [(A(13), 'Fm(add9)'), (A(14), 'Fm9'), (A(15), 'Dbmaj7#11'), (A(16), 'C7sus(b9)'),       # (phrase 2's),
                (A(17), 'Bbm(add9)'), ((A(17), 3), 'Ab(add9)'), (A(18), 'Gbmaj7'), ((A(18), 4), 'F5'),  # 745 faces
                (A(19), 'Bbm(add9)'), ((A(19), 3), 'Ab(add9)'), (A(20), 'Gbmaj7'), ((A(20), 3), 'Fm11'),  # (phrase 3's)
                (A(21), 'Fm(add9)'), (A(22), 'Dbmaj7'), (A(23), 'Bbm9'), ((A(23), 3), 'C7sus(b9)'), (A(24), 'F5')]
    P4 = A(25) if album else A(13)              # the full band's first bar
    prog = progression(g, ch3 + [(P4, 'C7#9b13'), (P4 + (3 if album else 2), 'F5')])

    def walk(bar, notes, vel=0.7, skip=()):
        """A hand-written walking bar (quarters): upright + the contrabass pizz layer.  skip: beats left out."""
        for b, p in enumerate(notes, start=1):
            if p is None or b in skip:
                continue
            t = g.t(bar, b)
            d = g.beats_s(0.92, t)
            v = vel * (1.0 if b in (1, 3) else 0.94)
            a.n('ubass', p, t, d, v)
            a.n('cb_pizz', p, t, d, v * 0.78)

    # ---------------- phrase 1 (A1-A4): the compile
    a.section('b1: the compile (phrase 1)', A(1), A(5))
    a.mark('AVALANCHE A1.1 (29.14 f0)', (A(1), 1))
    a.n('timp', 'F2', (A(1), 1), '2b', 0.6, lock=True)
    a.n('ubass', 'F2', (A(1), 1), '2b', 0.72, lock=True)           # the timpani's own partials need an F under them
    a.n('cb_pizz', 'F2', (A(1), 1), '1b', 0.6, lock=True)
    a.n('timp', 'C3', (A(3), 1), '1b', 0.4, lock=True)
    for k, n_notes in zip(range(1, 5), (4, 8, 12, 16)):
        with_wood(build16('lead', A(k), range(n_notes), 0.64, transpose=12, swing=SW16, **CHIP), 0.2)
    swing_ride(a, (A(1), A(5)), vel=0.44, hat=True, feathered_kick=0.22)
    walk(A(2), ['F2', 'Ab2', 'Bb2', 'B2'])
    walk(A(3), ['Db3', 'C3', 'Ab2', 'G2'])
    walk(A(4), ['C3', 'Bb2', 'G2', 'Db3'])
    comp(a, 'grand', prog, style='charleston', kind='rootless_a', around='A3', vel=0.4, bars=(A(3), A(5)))
    art.swell(a, 'vc', ['Db3', 'Ab3'], (A(3), 1), '4b', 'pp', 'p', shape='s')          # low strings from A3
    art.swell(a, 'vla', ['C4', 'F4'], (A(3), 1), '4b', 'pp', 'p', shape='s')
    art.swell(a, 'vc', ['C3', 'G3'], (A(4), 1), '4b', 'p', 'mp', shape='s')
    art.swell(a, 'vla', ['Bb3', 'Db4', 'F4'], (A(4), 1), '4b', 'p', 'mp', shape='s')
    kick1 = (A(4), 4)                                                                   # the phrase-1 brass hit
    art.stab(a, 'tpt', ['F5', 'C5'], kick1, vel=0.66, length=0.2, spread_ms=2.0, offset=0.006)
    art.stab(a, 'tbn', ['Db4', 'Bb3'], kick1, vel=0.64, length=0.22, spread_ms=2.0, offset=0.006)
    a.mark('brass hit (end of phrase 1)', kick1)

    # ---------------- phrase 2 (A5-A8): Step Four, Alyi resists, Neleh's window, the blank crushed
    a.section('b2: step four (phrase 2)', A(5), A(9))
    CH = {  # (vc, vla, bsn, hn-mute); the viola's top line is Step Four's F4 Eb4 Db4, the cello's bass Bb2 Ab2 Gb2 (F2)
        'Bbm': (['Bb2', 'F3'], ['C4', 'F4'], ['Db3'], ['F3']),
        'Ab': (['Ab2', 'Eb3'], ['Bb3', 'Eb4'], ['C3'], ['Eb3']),
        'Gb': (['Gb2', 'Db3'], ['F3', 'Db4'], ['Bb2'], ['F3']),
    }

    def chorale(name, at, dur, vel, v1=None):
        vc, vla, bsn, hn = CH[name]
        v1 = v1 or vel
        art.swell(a, 'vc', vc, at, dur, vel, v1, shape='s')
        art.swell(a, 'vla', vla, at, dur, vel, v1, shape='s')
        art.swell(a, 'bsn', bsn, at, dur, vel, v1, shape='s')
        art.swell(a, 'hn', hn, at, dur, vel * 0.9, v1 * 0.9, shape='s', art='mute')

    a.mark('phrase 2 (29.15 f0): Step Four', (A(5), 1))
    chorale('Bbm', (A(5), 1), '2b', 0.56)
    chorale('Ab', (A(5), 3), '2b', 0.56)
    # G-flat holds a beat longer: ALYI RESISTS (A6.3) -- the chord gives for an instant, then pushes back on the beat
    tg = g.t(A(6))
    d3 = g.beats_s(3, tg)
    b2 = g.beats_s(2, tg)
    shud = [(0.0, 0.8), (b2 - 0.16, 0.95), (b2 - 0.03, 0.45), (b2 + 0.015, 1.0), (d3, 0.9)]
    vc_, vla_, bsn_, hn_ = CH['Gb']
    for inst, ps, v, kw in [('vc', vc_, 0.6, {}), ('vla', vla_, 0.6, {}), ('bsn', bsn_, 0.6, {}),
                            ('hn', hn_, 0.54, dict(art='mute'))]:
        for p in ps:
            a.n(inst, p, tg, d3, v, env=shud, **({'art': 'sus'} | kw))
    alyi = (A(6), 3)
    a.mark('ALYI RESISTS: one beat, the chorale holds (conform to 29.15)', alyi)
    a.n('timp', 'Gb2', alyi, '1b', 0.66, lock=True)
    a.n('cb_pizz', 'Gb2', alyi, '1b', 0.66, lock=True)
    a.n('ubass', 'Gb2', alyi, '1b', 0.6, lock=True)
    art.pizz(a, 'vla', ['Gb3', 'Db4'], alyi, vel=0.72, lock=True)          # the board's strings: a plucked 'no'
    art.pizz(a, 'vc', ['Db3'], alyi, vel=0.7, lock=True)
    art.spic(a, 'vln1', ['F5'], alyi, vel=0.6, lock=True)                   # the board pushes back: a bowed accent
    art.spic(a, 'vln2', ['Db5', 'Bb4'], alyi, vel=0.58, lock=True)
    art.sus(a, 'vc', ['F2'], (A(6), 4), '1b', vel=0.46)                                 # step four: the bass alone
    build16('lead', A(5), range(16), 0.64, transpose=12, swing=SW16, **CHIP)
    with_wood(build16('lead', A(6), range(0, 4), 0.62, transpose=12, swing=SW16, beat0=4.0, **CHIP), 0.2)
    swing_ride(a, (A(5), A(9)), vel=0.44, hat=True, feathered_kick=0.2)
    walk(A(5), ['Bb2', 'C3', 'Ab2', 'Eb2'])
    walk(A(6), ['Gb2', 'Db2', None, 'F2'])            # beat 3 is Alyi's (timpani + pizz, locked)
    walk(A(7), ['Bb2', 'Db3', 'Ab2', 'C3'], vel=0.52)
    walk(A(8), ['Gb2', 'Bb2', 'F2', 'E2'])
    comp(a, 'grand', prog, style='charleston', kind='rootless_a', around='A3', vel=0.38, bars=(A(5), A(7)))
    t_h0, t_h1 = g.s(A(6), 2.5) - 0.03, g.t(A(6), 4) - 0.03                          # the hold: the engine stops
    a.notes = [n for n in a.notes if not (n.inst in ('jazz', 'grand', 'lead', 'xylo') and t_h0 <= n.start < t_h1)]
    # A7 -- NELEH's 1-bar dialogue window ('Has anyone read the char--', act 7715-7755): thinned, no lead; the
    # second chorale statement pp, shoved a swung eighth early
    chorale('Bbm', (A(6), 4.5, 'sw'), '2b', 0.32)
    chorale('Ab', (A(7), 2.5, 'sw'), '2b', 0.34)
    chorale('Gb', (A(7), 4.5, 'sw'), '2b', 0.4)
    a.scale_vel(0.72, insts=['jazz'], t0=g.t(A(7)), t1=g.t(A(8)))
    slots.append(dict(t=round(g.t(A(7), 2.33), 4), sfx="dialogue: NELEH 'Has anyone read the char--' (act 7715-7755)"))
    # A8 -- step four = the bass alone ... crushed: the Build returns and two brass hits end the phrase
    fl = g.t(A(9), 3) - g.s(A(8), 2.5)
    a.n('cb', 'F2', (A(8), 2.5, 'sw'), fl, 0.42, art='sus', env=[(0, 0.7), (1.0, 1.0)])
    art.swell(a, 'vc', ['F2'], (A(8), 2.5, 'sw'), fl, 'p', 'mp', shape='s')
    art.swell(a, 'hn', ['F3', 'C4'], (A(8), 2.5, 'sw'), fl, 'p', 'mp', art='mute')
    build16('lead', A(8), range(8, 16), 0.68, transpose=12, swing=SW16, **CHIP)
    hit_a, hit_b = (A(8), 3), (A(8), 4.5, 'sw')
    art.stab(a, 'tpt', ['C5', 'Ab4'], hit_a, vel=0.68, length=0.18, spread_ms=2.0)
    art.stab(a, 'tbn', ['Eb4', 'Bb3'], hit_a, vel=0.66, length=0.2, spread_ms=2.0)
    art.stab(a, 'tpt', ['Eb5', 'C5'], hit_b, vel=0.72, length=0.24, spread_ms=2.0)
    art.stab(a, 'tbn', ['Ab4', 'Eb4', 'Bb3'], hit_b, vel=0.68, length=0.26, spread_ms=2.0)
    a.mark('step four crushed: brass hits (end of phrase 2)', hit_a)
    a.n('timp', 'F2', hit_a, '1b', 0.5, lock=True)
    comp(a, 'grand', prog, style='charleston', kind='rootless_a', around='A3', vel=0.38, bars=(A(8), A(9)))

    # ---------------- phrase 3 (A9-A12): the Water Line augmented; the QUIET VOTE; the settle held high
    a.section('b3: the Water Line augmented (phrase 3)', A(9), A(13))
    a.mark('phrase 3 (29.17 f0): the Water Line augmented', (A(9), 1))
    wl = [('F', (A(9), 1), '2b'), ('F', (A(9), 3), '2b'), ('F', (A(10), 1), '2b'), ('G', (A(10), 3), '1b'),
          ('F', (A(10), 4), '1b'), ('C', (A(11), 1), '2b'), ('F', (A(11), 3), '6b')]
    for pc, at, d in wl:
        t = g.at(at)
        dd = g.dur(d, t)
        last = at == (A(11), 3)
        env = [(0, 0.85), (0.25, 1.0), (dd, 1.0)] if not last else [(0, 0.8), (1.0, 1.0), (dd - 0.4, 0.9), (dd, 0.7)]
        a.n('vln1', f'{pc}5', t, dd - 0.06, 0.5, True, art='sus', env=env, rel=0.5 if last else 0.25)
        a.n('vln2', f'{pc}4', t, dd - 0.06, 0.45, True, art='sus', env=env, rel=0.5 if last else 0.25)
        a.n('tri', f'{pc}4', t, dd - 0.08, 0.48, lock=True, rel=0.12, dec=0.4, sus=0.8)         # chip 8vb
        if pc == 'G':                                                                            # Mas's signature:
            a.n('lead2', 'G5', t, dd - 0.08, 0.5, lock=True, duty=0.5, rel=0.1, dec=0.2, sus=0.6)  # square on the nudge
    a.mark('the settle: the held high F (A11.3)', (A(11), 3))
    # the QUIET VOTE (A9.3): the board's bowed F pedal (from A8) ends there silently -- no hit, no marker onset
    for k in (9, 10, 11):
        build16('lead', A(k), range(16), 0.32, swing=SW16, **CHIP)
    build16('lead', A(12), range(16), 0.42, swing=SW16, **CHIP)
    swing_ride(a, (A(9), A(12)), vel=0.42, hat=True, feathered_kick=0.2)
    walk(A(9), ['F2', 'G2', 'Ab2', 'C3'], vel=0.66)
    walk(A(10), ['Db3', 'C3', 'Bb2', 'Ab2'], vel=0.66)
    walk(A(11), ['Bb2', 'Db3', 'C3', 'G2'], vel=0.66)
    comp(a, 'grand', prog, style='charleston', kind='rootless_a', around='A3', vel=0.32, bars=(A(9), A(12)))
    a.n('timp', 'F2', (A(9), 1), '1b', 0.42, lock=True)
    art.swell(a, 'vla', ['Ab3', 'C4'], (A(9), 1), '4b', 'pp', 'p', lock=True)
    art.swell(a, 'vla', ['Ab3', 'C4'], (A(10), 1), '4b', 'pp', 'p', lock=True)
    art.swell(a, 'vc', ['Db3', 'Ab3'], (A(10), 1), '4b', 'pp', 'p', lock=True)
    art.swell(a, 'vla', ['Db4', 'Ab3'], (A(11), 1), '2b', 'pp', 'p', lock=True)
    art.swell(a, 'vc', ['Bb2', 'F3'], (A(11), 1), '2b', 'pp', 'p', lock=True)
    art.swell(a, 'vla', ['Bb3', 'Db4'], (A(11), 3), '2b', 'p', 'pp', lock=True)
    art.swell(a, 'vc', ['C3', 'G3'], (A(11), 3), '2b', 'p', 'pp', lock=True)

    if album:
        chorus_two(a, g, A, T, build16, with_wood, walk, chorale, prog)

    # ---------------- phrase 4 (A13-A14): the one full band; Mada's spinner; the dead stop on the card
    a.section('b4: the full band -> the card (phrase 4)', P4, P4 + 4)
    card = g.t(CARD_BAR) if not album else g.t(P4 + 3)          # the album: the 3-bar alternate (CARD_BAR=39)
    band0 = g.t(P4)
    L = card - band0
    a.mark('THE FULL BAND (29.18 f0): C7(#9b13)', (P4, 1))
    held = [(0.0, 0.3), (0.05, 0.9), (0.45, 0.54), (2.5, 0.8), (max(L - 2.5, 2.6), 0.85), (L, 0.85)]
    band = [('tpt', ['Ab5', 'Eb5', 'Bb4'], 0.7, 'tpt'), ('tbn', ['E4', 'Bb3', 'E3'], 0.68, 'tbn'),
            ('tsax', ['E4'], 0.64, 'tsax'), ('asax', ['Ab4'], 0.62, None), ('bsax', ['C3'], 0.64, None)]
    for inst, ps, v, stab_inst in band:
        if stab_inst:                                         # stab fronts: the sustain samples speak ~30 ms late
            art.stab(a, stab_inst, ps, (P4, 1), vel=v * 0.9, length=0.09, spread_ms=1.5)
        for i, p in enumerate(ps):
            kw = dict(art='sus', offset=0.06, att=0.035) if inst in ('tpt', 'tbn', 'tsax') else {}
            a.n(inst, p, band0 + 0.002 * i, L + 0.3, v, lock=True, env=held, **kw)
    for inst, ps in [('vln1', ['Ab5']), ('vln2', ['Eb5']), ('vla', ['Bb4', 'E4']), ('vc', ['E3', 'Bb3'])]:
        art.trem(a, inst, ps, (P4, 1), L + 0.3, vel=0.54, swell=('p', 'mp'), shape='log', lock=True)
    a.n('cb', 'C2', band0, L + 0.3, 0.5, True, art='sus', env=held)
    a.n('ubass', 'C2', band0, L + 0.3, 0.66, lock=True)
    a.n('cb_pizz', 'C2', band0, 0.5, 0.6, lock=True)
    a.ch('grand', ['E3', 'Bb3', 'Eb4', 'Ab4'], band0, 1.2, 0.34, lock=True)
    t = band0 + g.beats_s(0.125, band0)          # timpani roll on C (32nds) from the first 32nd: pressing, level
    k = 1
    while t < card - 0.02:
        v = 0.24 + 0.1 * min(1.0, (t - band0) / 2.5) + 0.03 * ((k % 2) - 0.5)
        a.n('timp', 'C3', t, 0.06, v, lock=True)
        t += g.beats_s(0.125, t)
        k += 1
    a.n('timp', 'C3', band0, 0.2, 0.5, lock=True)
    swing_ride(a, (P4, P4 + (3 if album else 2)), vel=0.48, hat=True, feathered_kick=0.24)
    q = g.bar_q(P4)                              # MADA's spinner: C5-Db5 swung eighths, celesta + chip
    j = 0
    while True:
        ta = g.tq(g.swing_q(q, 1.0))
        if ta >= card - 0.01:
            break
        tb = g.tq(g.swing_q(q + 0.5, 1.0))
        p = 'C5' if j % 2 == 0 else 'Db5'
        a.n('celesta', p, ta, (tb - ta) * 0.8, 0.5 if j % 2 == 0 else 0.44, lock=True)
        a.n('arp', p, ta, (tb - ta) * 0.6, 0.5, lock=True, duty=0.125, rel=0.03, dec=0.08, sus=0.5)
        q += 0.5
        j += 1
    a.mark('THE CARD: everything stops dead (freeze_hit_F owns the downbeat)', card)
    mutes.append((card, g.t(40) if not album else card + 3.0))
    slots.append(dict(t=round(card, 4), sfx='freeze_hit_F (the MADA card: LAST FIRER STANDING / ANSWERS GIVEN: 0)'))
    slots.append(dict(t=round(g.t(A(1)), 4), sfx='tile_clack (layered, density rising; never a roar) A1-A12; '
                                                  'tile_scrape A5-A6; tile_press creaks A13-A14'))

    # phrase downbeats are picture cuts: keep their carriers on the frame (no humanising on those attacks)
    downs = [g.t(A(k)) for k in ((1, 5, 9, 13, 17, 21, 25) if album else (1, 5, 9, 13))]
    for n in a.notes:
        if any(abs(n.start - d) < 0.002 for d in downs):
            n.lock = True

    # ------------------------------------------------------------ bookkeeping
    if album:
        return _album_score(g, T, a, mutes, card)
    META['silence_windows'] = [(round(x0, 4), round(x1, 4), lab, lim) for x0, x1, lab, lim in sil]
    META['vo_windows'] = [(round(x0, 4), round(x1, 4)) for x0, x1, _ in vo]
    META['sfx_slots'] = slots
    META['description'] = (
        'TO PICTURE against Ep1 Act Four lock v2 (show/episodes/ep01/production/act4/history/shots-locked-v2.json): file '
        f't=0 = act frame {AF0} (episode 16:37:21, shot 29.00 f0); act frame = {AF0} + 24 * t.  Cue points with no '
        'onset of their own (not markers): NELEH window = A7 (bar 30, 73.75-76.25 s); THE QUIET VOTE = A9.3 (80.00 s, '
        'the board\'s bowed F pedal ends, no hit).  Switches: '
        f'CARD_BAR={CARD_BAR}, BUILD_STOP={BUILD_STOP}, STRICT_CARD_CLEAR={STRICT_CARD_CLEAR}.')
    return Score(META['id'], g, T, a.notes, markers=a.markers, sections=a.sections, mutes=mutes, tail_s=3.0,
                 length_s=g.t(40), meta=META)


def build():
    """The picture version (the underscore master and the stems): lock v2 timing, exactly as delivered."""
    if os.path.basename(sys.argv[0]) == 'build.py':
        print(f'[{ID}] NOTE: build.py renders the PICTURE score only, and its album master is picture-timed. The '
              f'album master is the album edit: run `python tracks/{ID}/track.py` to rebuild both.', flush=True)
    return _score(album=False)


def build_album():
    """The album edit (fix1, 2026-09-26): its album master becomes <ID>-album.wav (see render_all)."""
    return _score(album=True)


def chorus_two(a, g, A, T, build16, with_wood, walk, chorale, prog):
    """The album edit's second chorus (A13-A24, 12 bars), built only from the avalanche's own material: the
    compile at full with Step Four pressing down over it (its blank kept), phrase 2's chorale with nobody resisting
    and the blank crushed harder, then the Water Line in its own time, twice, before the band."""
    # ---- the stack (A13-A16): phrase 1's changes, the Build at full from the first bar
    a.section('c2-1: the stack (the compile at full; Step Four pressing)', A(13), A(17))
    a.mark('chorus 2: the stack', (A(13), 1))
    a.n('timp', 'F2', (A(13), 1), '2b', 0.56, lock=True)
    for k in range(13, 17):
        with_wood(build16('lead', A(k), range(16), 0.6, transpose=12, swing=SW16, **CHIP), 0.2)
    swing_ride(a, (A(13), A(17)), vel=0.44, hat=True, feathered_kick=0.22)
    walk(A(13), ['F2', 'G2', 'Ab2', 'C3'])
    walk(A(14), ['F2', 'Ab2', 'Bb2', 'B2'])
    walk(A(15), ['Db3', 'C3', 'Ab2', 'G2'])
    walk(A(16), ['C3', 'Bb2', 'G2', 'Db3'])
    comp(a, 'grand', prog, style='charleston', kind='rootless_a', around='A3', vel=0.38, bars=(A(13), A(17)))
    for k, vc, vla in [(13, ['C3', 'G3'], ['Ab3', 'C4']), (14, ['Ab2', 'Eb3'], ['C4', 'G4']),   # (the walk owns F2)
                       (15, ['Db3', 'Ab3'], ['C4', 'F4']), (16, ['C3', 'G3'], ['Bb3', 'Db4', 'F4'])]:
        art.swell(a, 'vc', vc, (A(k), 1), '4b', 'p', 'mp', shape='s')
        art.swell(a, 'vla', vla, (A(k), 1), '4b', 'p', 'mp', shape='s')
    for k, p in zip((13, 14, 15), ('F4', 'Eb4', 'Db4')):          # Step Four over the compile; A16 is its blank
        art.swell(a, 'hn', [p], (A(k), 1), '4b', 'p', 'mp', shape='s', art='mute')
        art.swell(a, 'bsn', [nm(p) - 12], (A(k), 1), '4b', 'p', 'mp', shape='s')
    kick = (A(16), 4)
    art.stab(a, 'tpt', ['F5', 'C5'], kick, vel=0.68, length=0.2, spread_ms=2.0, offset=0.006)
    art.stab(a, 'tbn', ['Db4', 'Bb3'], kick, vel=0.66, length=0.22, spread_ms=2.0, offset=0.006)
    a.mark('brass hit (end of the stack)', kick)
    # ---- the board presses (A17-A20): phrase 2's chorale, nobody resists; the blank crushed harder
    a.section('c2-2: the board presses (Step Four; the blank crushed)', A(17), A(21))
    chorale('Bbm', (A(17), 1), '2b', 0.48)                      # (the arc: under the band, which is the peak)
    chorale('Ab', (A(17), 3), '2b', 0.48)
    chorale('Gb', (A(18), 1), '3b', 0.5)
    art.sus(a, 'vc', ['F2'], (A(18), 4), '1b', vel=0.44)                                # step four: the bass alone
    chorale('Bbm', (A(19), 1), '2b', 0.52)
    chorale('Ab', (A(19), 3), '2b', 0.52)
    chorale('Gb', (A(20), 1), '2b', 0.54)
    for k in range(17, 21):
        nts = build16('lead', A(k), range(16), 0.58, transpose=12, swing=SW16, **CHIP)
        if k % 2:
            with_wood(nts, 0.2)
    swing_ride(a, (A(17), A(21)), vel=0.42, hat=True, feathered_kick=0.2)
    walk(A(17), ['Bb2', 'C3', 'Ab2', 'Eb2'])
    walk(A(18), ['Gb2', 'Db2', 'Ab2', 'F2'])
    walk(A(19), ['Bb2', 'Db3', 'Ab2', 'C3'])
    walk(A(20), ['Gb2', 'Bb2', 'F2', 'E2'])
    comp(a, 'grand', prog, style='charleston', kind='rootless_a', around='A3', vel=0.36, bars=(A(17), A(21)))
    hit_a, hit_b = (A(20), 3), (A(20), 4.5, 'sw')
    art.stab(a, 'tpt', ['C5', 'Ab4'], hit_a, vel=0.7, length=0.18, spread_ms=2.0)
    art.stab(a, 'tbn', ['Eb4', 'Bb3'], hit_a, vel=0.68, length=0.2, spread_ms=2.0)
    art.stab(a, 'tpt', ['Eb5', 'C5'], hit_b, vel=0.72, length=0.24, spread_ms=2.0)
    art.stab(a, 'tbn', ['Ab4', 'Eb4', 'Bb3'], hit_b, vel=0.68, length=0.26, spread_ms=2.0)
    a.n('timp', 'F2', hit_a, '1b', 0.56, lock=True)
    a.mark('chorus 2: step four crushed again', hit_a)
    # ---- 745 faces (A21-A24): the Water Line in its own time, twice (violins in octaves, the chip triangle, the
    # square on the nudge); the second settle is held into the band
    a.section('c2-3: 745 faces (the Water Line, twice)', A(21), A(25))
    a.mark('chorus 2: the Water Line in its own time', (A(21), 1))
    for b0 in (A(21), A(23)):
        v1 = a.line('vln1', 'F5/4 F5/4 F5/4 G5/8 F5/8 | C5/4 F5/2.', (b0, 1), vel=0.5, swing=True, art='sus', rel=0.25)
        a.line('vln2', 'F4/4 F4/4 F4/4 G4/8 F4/8 | C4/4 F4/2.', (b0, 1), vel=0.45, swing=True, art='sus', rel=0.25)
        a.line('tri', 'F4/4 F4/4 F4/4 G4/8 F4/8 | C4/4 F4/2.', (b0, 1), vel=0.46, swing=True, lock=True, rel=0.12,
               dec=0.4, sus=0.8)
        nudge = [n for n in v1 if nm('G5') == int(round(n.pitch))][0]
        a.n('lead2', 'G5', nudge.start, nudge.dur, 0.5, lock=True, duty=0.5, rel=0.1, dec=0.2, sus=0.6)
    for k in range(21, 25):
        build16('lead', A(k), range(16), 0.34, swing=SW16, **CHIP)
    swing_ride(a, (A(21), A(25)), vel=0.44, hat=True, feathered_kick=0.2)
    walk(A(21), ['F2', 'G2', 'Ab2', 'C3'], vel=0.66)
    walk(A(22), ['Db3', 'C3', 'Bb2', 'Ab2'], vel=0.66)
    walk(A(23), ['Bb2', 'Db3', 'C3', 'G2'], vel=0.66)
    walk(A(24), ['F2', 'Ab2', 'Bb2', 'B2'], vel=0.66)
    comp(a, 'grand', prog, style='charleston', kind='rootless_a', around='A3', vel=0.34, bars=(A(21), A(25)))
    a.n('timp', 'F2', (A(21), 1), '1b', 0.44, lock=True)
    art.swell(a, 'vla', ['Ab3', 'C4'], (A(21), 1), '4b', 'pp', 'p', lock=True)
    art.swell(a, 'vc', ['Db3', 'Ab3'], (A(22), 1), '4b', 'pp', 'p', lock=True)
    art.swell(a, 'vla', ['Db4', 'Ab3'], (A(23), 1), '2b', 'pp', 'p', lock=True)
    art.swell(a, 'vc', ['Bb2', 'F3'], (A(23), 1), '2b', 'pp', 'p', lock=True)
    art.swell(a, 'vla', ['Bb3', 'Db4'], (A(23), 3), '2b', 'p', 'mp', lock=True)
    art.swell(a, 'vc', ['C3', 'G3'], (A(23), 3), '2b', 'p', 'mp', lock=True)


def _album_score(g, T, a, mutes, card):
    meta = dict(META)
    t = lambda b, bt=1: round(g.t(b, bt), 2)          # noqa: E731
    A = _A_ALBUM
    meta.update(
        id=ALBUM_EDIT_ID, title='His Side / 745 (album edit)', version='1', tags=META['tags'] + ['album edit'],
        scenes=['the soundtrack album: the picture cue (mm10-his-side-745, E01-S29a-b) as a listening piece'],
        description='ALBUM EDIT of mm10-his-side-745 (fix1, 2026-09-26). Its album master is delivered as '
                    'render/mm10-his-side-745-album.wav; the picture version stays the underscore master and the '
                    'stems. Form: his side (b1-9: the felt Water Line bar 1, HIS VERSION -- the keynote bar of '
                    'MM-02\'s D5 insert -- cut mid-note, one felt C4, the counter, the compile passes, each dry window '
                    'a 1-bar rest) | the avalanche as in picture (A1-A12) | chorus 2 (A13-A24: the stack, the board '
                    'presses, 745 faces) | the full band, 3 bars (the cue\'s CARD_BAR=39 alternate) | the dead stop.',
        silence_windows=[], vo_windows=[], sfx_slots=[], no_third_windows=[],
        hit_tol_ms=15.0,                 # the album edit is not laid to picture: its markers are musical, not sync
        audition=[f'0-{t(A(1))} s: his side on an album: the fragments and their 1-bar rests -- a listening intro, '
                  f'or just gaps? The keynote bar at {t(2)} s cut mid-note at {t(3)} s',
                  f'{t(A(1))} s: does the avalanche still ERUPT out of a 1-bar rest?',
                  f'{t(A(13))}-{t(A(25))} s: chorus 2 -- the stack (Step Four pressing over the compile, its blank '
                  f'at {t(A(16))} s), the board presses, the Water Line in its own time: momentum, not a repeat',
                  f'{t(A(25))}-{round(card, 2)} s: THREE bars of the one full band (the picture has two), level, no '
                  f'ramp; the dead stop at {round(card, 2)} s ends the track',
                  f'{t(A(21))}-{t(A(25))} s: the Water Line twice in the violins over the swung Build: his calm line '
                  f'inside the avalanche, not a victory lap'])
    return Score(meta['id'], g, T, a.notes, markers=a.markers, sections=a.sections, mutes=mutes, tail_s=1.0,
                 length_s=card + 1.25, meta=meta)


def render_all(stems=True, previews=True, workers=None, edit_only=False):
    """The picture version (underscore master + stems, and a picture-timed album master that is then replaced),
    then the album edit: its album master becomes <ID>-album.wav/.mp3 and both cue sheets say so.
    edit_only: re-render the album edit alone and re-adopt it onto the picture's cue sheet on disk."""
    from engine.export import build as ebuild
    rd = os.path.join(HERE, 'render')
    if edit_only:
        import json
        with open(os.path.join(rd, f'{ID}.cue.json')) as fh:
            pic = json.load(fh)
    else:
        pic = ebuild(build(), rd, ID, stems=stems, loop=False, previews=previews, workers=workers)
    ed = ebuild(build_album(), rd, ALBUM_EDIT_ID, stems=False, loop=False, previews=previews, workers=workers)
    return adopt_album_edit(rd, ID, ALBUM_EDIT_ID, pic, ed)


def adopt_album_edit(rd, tid, eid, pic, ed):
    """Make the album edit THE album master: move its album WAV/MP3 onto <tid>-album.*, drop its (unused)
    underscore master, and point both cue sheets at the files as they now are."""
    import json
    for ext in ('wav', 'mp3'):
        src = os.path.join(rd, f'{eid}-album.{ext}')
        if os.path.exists(src):
            os.replace(src, os.path.join(rd, f'{tid}-album.{ext}'))
        u = os.path.join(rd, f'{eid}-underscore.{ext}')
        if os.path.exists(u):
            os.remove(u)
    note = (f'The album master render/{tid}-album.wav is the ALBUM EDIT ({eid}.cue.json); the underscore master and '
            f'the stems are the PICTURE version (lock v2 timing).')
    ed['files'].update(album_wav=f'render/{tid}-album.wav', album_mp3=f'render/{tid}-album.mp3', underscore_wav=None,
                       underscore_mp3=None)
    ed['album_edit_of'] = tid
    ed['note'] = note + ' This sheet\'s underscore numbers describe the edit\'s own (not delivered) underscore render.'
    # (idempotent: re-adopting a new edit onto an already adopted picture sheet keeps the picture's own numbers)
    pic_measured = (pic.get('album_edit') or {}).get('picture_album_render_measured') or pic['masters']['album']['measured']
    pic['masters']['album'] = dict(ed['masters']['album'], source=f'album edit ({eid}.cue.json)')
    pic['timing'].setdefault('picture_duration_s', pic['timing']['album_duration_s'])
    pic['timing']['album_duration_s'] = ed['timing']['album_duration_s']
    pic['album_edit'] = dict(id=eid, cue_sheet=f'render/{eid}.cue.json', midi=ed['files'].get('midi'),
                             pianoroll=ed['files'].get('pianoroll'), duration_s=ed['timing']['album_duration_s'],
                             picture_album_render_measured=pic_measured, note=note)
    pic['warnings'] = [w for w in pic['warnings'] if not w.startswith(('album master', '(album edit)'))] + \
                      [f'(album edit) {w}' for w in ed['warnings'] if w.startswith('album master')]
    for c in (pic, ed):
        with open(os.path.join(rd, f"{c['id']}.cue.json"), 'w') as fh:
            json.dump(c, fh, indent=1, default=float)
    print(f'[{tid}] album master = the album edit ({ed["timing"]["album_duration_s"]} s); underscore + stems = picture '
          f'({pic["timing"]["picture_duration_s"]} s)', flush=True)
    return pic, ed


if __name__ == '__main__':
    import argparse
    ap = argparse.ArgumentParser()
    ap.add_argument('--no-stems', action='store_true')
    ap.add_argument('--no-loop', action='store_true')          # (no loop in this cue; accepted for the house flags)
    ap.add_argument('--no-mp3', action='store_true')
    ap.add_argument('--verify-loop', action='store_true')
    ap.add_argument('--workers', type=int, default=None)
    ap.add_argument('--album-edit-only', action='store_true')
    args = ap.parse_args()
    render_all(stems=not args.no_stems, previews=not args.no_mp3, workers=args.workers, edit_only=args.album_edit_only)
