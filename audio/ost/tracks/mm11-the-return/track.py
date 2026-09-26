"""MM-11  THE RETURN  --  E01-S30a-e, Ep1 sc 30, TO PICTURE                              composer E (OST-BIBLE s5.E1)

"His POV, and he has stopped narrating: there is no V.O. in the return."  The cue is a relay of other people's
sounds -- Alyi's violin, Tasya's Rhodes, the world's LEVERAGE, Gerg's chip, the band's one stab, the 1993
beeper -- and only at the very end, after "okay.", does HIS felt piano come back: the first felt note in the cue
is the return (s1.4: "the felt piano's first note marks the return").

  a  ALYI         STRAIGHT: the Door (s2.9) on a solo violin, SENZA VIBRATO (senza.py), no portamento, no swell,
                  no chip, under Alyi's spoken post only; an octave below the flute's Door, on the G string, its
                  last note (the open G3, the #4) held until the first heart, where it stops DEAD (tails cut).  The editor's own violin + 4 pre-cut stops: e01-s30a-the-door.
  b  THE FLOOR    dry under Tasya's real line (the palette steps are silent).  On the beat after 'around them.'
                  the floor: Tasya's Rhodes on the beats (the key ring owns the offbeats), low strings, celesta:
                  Abmaj9 -> Cmaj9 -> Emaj9, held (no movement under "hi." / "Hello."), and after "Hello." the
                  cycle comes home to Abmaj9: the landlord gets the last word.  The most beautiful chord in the
                  episode, and it's the landlord's.
  c  THE CALM-OFF LEVERAGE (P03) from the door bang: an F pedal, straight pizz eighths on varied pitches, the
                  "muted 808" as a pitched low-passed thud, low grand clusters shifting a semitone, a soft chip
                  noise tick; it keeps running through the FULL FREEZE card (Mas moves through the freeze) and
                  DROPS OUT on "Terms?" (the stop is the move).  Silence through the long hold.  Under the stamp's
                  C (SFX), a low C pedal -- the dominant, leading on -- that leaves on Gerg's post.
  d  GERG         dry for Gerg's post; the Build (s2.6) restarts on the [PF], joyful (chip, xylophone, wood,
                  pizz); out for Ttemme's post (dry for its read time); the sand holds, and the Build resumes as a
                  pickup into the lobby.
  e  THE LOBBY    VICTORY LAP one size too big: on the sign, ONE brass stab (2 tpt + 2 tbn, open, short) on
                  Abmaj9, timpani, a string chop, the Build at full.  On the 0-plates insert the band CUTS (tails
                  too) to one chip note.  The three greying beats get the 1-bit flat line F F F (uneven), so the
                  bonk (SFX, E3) on beat 4 is the wrong note.  Silence for the [CU] and under "okay.".  After
                  "okay.", the felt: C4 -> F4 (the Water Line's settle, swung), an open fifth, no third.  The F4
                  sounds 5 frames before the cut to sc 31 and its decay L-cuts into the Q* vault's F hum.

TO PICTURE against the Ep1 Act Four TIMING LOCK v2 (show/episodes/ep01/production/act4/timing-v2.md and
shots-locked-v2.json; the JSON wins).  File t = 0 is act frame 8295 (18:16:15, shot 30.01 f0, beat 2 of an act
bar); a 3-beat pickup puts this cue's bar lines on the act's bar lines (bar 1 = act 8340).  The file's musical end
is act 10200 (19:36:00, 31.01 f0).  The lock is +2.50 s on the printed 17:59.9-19:16.8: this cue follows the lock.
Every event is an ACT FRAME in SPOT below; re-conform by editing SPOT, not the music.  96 BPM throughout (L7).

THE ALBUM EDIT (fix pass 1, 2026-09-26; build_album(), render_all()).  The picture version stays the underscore master
and the stems; the album master (<id>-album.wav) is the same section functions written against a second spot, ALBUM
(file frames on its own grid), with the dry windows turned into musical rests: the Door twice, the floor at 2 bars a
chord, 9 bars of LEVERAGE, the C pedal under the Build compiling 8 -> 12 -> 16 -> 4, the sign and 2 bars at full, the
plates, F F F, the felt settle ringing out.  Run `python track.py` (build.py renders the picture only);
`--album-edit-only` re-renders the edit.  The felt's ring is faded over the last second in both (Score.end_fade).
"""
import os
import sys
from dataclasses import replace

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, '..', '..')))
sys.path.insert(0, HERE)
from engine import *   # noqa: E402,F401,F403
from engine.core import FAMILIES   # noqa: E402
from senza import svln_track, prewarm   # noqa: E402

ID = 'mm11-the-return'
ACT0 = 8295                    # act frame at file t = 0 (30.01 f0)

# ================================================================== THE SPOT (lock v2 act frames) -- conform here
SPOT = dict(
    # a  ALYI  (30.01 [P2] 8295-8535)
    post_alyi=8310,            # a4-30-01 ALYI reads his post (spoken, 8310-8435): the violin enters with it
    first_heart=8439,          # 30.01 f144, the first heart (the lock's animatic): the violin stops dead
    iou=8515,                  # 30.01 f220, the IOU flutters (after the 2-beat room-tone hold f190-219)
    # b  THE FLOOR  (30.04 [W] 8535; THE LANDLORD S2 30.05-30.08 8580-9060)
    tasya_in=8600, tasya_out=8865,   # a4-30-02 in three parts (8600-8633, 8720-8745, 8840-8865): REAL, dry
    floor=8880,                # the beat after 'around them.' (an act bar line): the room is blue, the floor enters
    floor_c=8910, floor_e=8940,      # 30.08 [PF] cuts in at 8940 on Emaj9
    hi=8960, hello_out=9018,   # MAS 'hi.' 8960-8978 (room line), TASYA 'Hello.' 8996-9018
    floor_home=9030,           # the beat after 'Hello.': the cycle comes home (Abmaj9)
    boardroom=9060,            # 30.09 [M] Mada still: the floor stops on the cut
    # c  THE CALM-OFF
    terb=9105,                 # 30.10 the door bangs (SHAKE_DOOR): LEVERAGE in
    card_terb=9150,            # 30.11 FULL FREEZE card (SFX freeze hit owns the downbeat); Mas moves; 30.12 9240
    terms=9435,                # 30.14 f45 TERB (O.S.) 'Terms?' (9435-9457): LEVERAGE drops out
    stamp=9660,                # 30.17 bar 2: the stamp (SFX rubber_stamp_C): the C pedal enters
    # d  GERG
    gerg_post=9720,            # 30.20 [POV] Gerg's post + keycaps (post 9720-9810): dry; the pedal leaves on the pop
    build=9810,                # 30.20a [PF] Mas reading it: the Build restarts (2 beats)
    ttemme_post=9840,          # 30.21 f15 Ttemme's post (held >= 94 f -> 9934): dry
    sand_falls=9945,           # the first beat after the post's read time: the Build resumes (1 beat pickup)
    # e  THE LOBBY
    sign=9960,                 # 30.22 [W] the sign lights (neon ignite): the stab
    plates=10020,              # 30.23 [ECU] the box of 0 plates: the band cuts to one chip note
    dialog=10065,              # 30.24 [W] the 1993 dialog: Cancel greys on its beats 1-3
    bonk=10110,                # 30.24 beat 4: the arrow clicks Cancel -- *Bonk.* (SFX alert_bonk, E3)
    cu=10125,                  # 30.25 [CU] 2 beats, silent
    okay_in=10159, okay_out=10181,   # 30.26 f4-f26 'okay.' (his room line: dry)
    cadence=10185,             # the first beat after 'okay.': the felt C4 ...
    settle=10195,              # ... F4 on the swung and-of-4 (+10 f): 5 f before the cut
    end=10200,                 # 31.01 f0: the Q* vault (its F hum takes the root); the F4's decay L-cuts in
)

META = dict(
    id=ID,
    mm='MM-11',
    title='The Return',
    family='STRAIGHT -> the floor (s2.16) -> LEVERAGE (P03) -> the Build -> VICTORY LAP (P09)',
    tone='the other side\'s sounds hand him back his company one by one; the win scored straight and one size '
         'too big, then undercut; his felt returns last',
    usage='BI',
    tags=['to picture', 'Ep1', 'act four', 'victory lap', 'straight', 'leverage', 'the build', 'return'],
    scenes=['E01-S30a ALYI (30.01)', 'E01-S30b THE FLOOR (30.04-30.08)', 'E01-S30c FIRES AND THE CALM-OFF '
            '(30.09-30.17)', 'E01-S30d GERG RETURNS (30.20-30.21)', 'E01-S30e THE LOBBY (30.22-30.26)',
            'lock v2: act 8295-10200 (18:16:15-19:36:00)'],
    motifs=['the Door on solo violin, senza vibrato (a)', 'Tasya\'s floor: Abmaj9 Cmaj9 Emaj9 | Abmaj9 (b)',
            'LEVERAGE: F pedal, semitone clusters (c)', 'the Build: restart (8), resume (4), at full (16) (d, e)',
            'the 1-bit flat line F F F (e)', 'the Water Line\'s settle C4 -> F4 on the felt, open fifth (e)'],
    motif_ids=['DOOR', 'BUILD'],
    key='Db (the Door) -> Ab/C/E mediants (the floor) -> F pedal -> C pedal -> F minor (the Build) -> Abmaj9 (the '
        'stab) -> F, open fifth',
    composer='Composer E (OST batch 1)',
    description='TO PICTURE against Ep1 Act Four lock v2: file t=0 = act frame 8295 (30.01 f0); act frame F is at '
                '(F - 8295)/24 s. Bar lines are the act\'s (bar 1 = act 8340). Conform by editing SPOT (act frames). '
                'The STRAIGHT violin\'s stop is at the lock\'s first heart (act 8439); the editor\'s own violin is '
                'tracks/e01-s30a-the-door. Balance and levels are per section (README).'
                ' Fix 2b (2026-09-26): LEVERAGE\'s cello pizz on its own track, notched at 110.5 Hz (-12 dB, Q 16; rule 12), the F pedal (and the album edit\'s C pedal) re-bowed every 2 bars (the held sample ran out), the senza violin retuned (its C4 sample is 23 c sharp).',
    album_lufs=-16.0,
    audition=[],
)


_CUR = dict(spot=SPOT, act0=ACT0)          # the spot the sections are written against (picture, or the album edit)


def S(k):
    """SPOT act frame -> file seconds (the album edit swaps in its own spot: ALBUM, in file frames)."""
    return (_CUR['spot'][k] - _CUR['act0']) / 24.0


def has(k):
    return _CUR['spot'].get(k) is not None


def sec(a, label, t0, t1):
    """A section in SECONDS (Arr.section takes bars)."""
    a.sections.append((label, float(t0), float(t1)))


# ================================================================== sections
def sec_a_alyi(a, g):
    """STRAIGHT: the Door on the senza-vibrato solo violin under Alyi's spoken post; flat level, each note its
    own bow; the open G3 (the #4: the Door never cadences) held until the first heart stops it dead.  An octave
    below s2.9's flute Door: under Alyi's SPOKEN post the written octave read -8 dB in 2-6 kHz (limit -15)."""
    sec(a, 'a ALYI (STRAIGHT)', 0.0, S('floor'))
    entries = [(S('door1'), 4)] if has('door1') else []           # album edit: once plain, the G held and let go
    entries.append((S('post_alyi'), 7))                            # (the stop on the first heart is a hard stop)
    for t0, g_beats in entries:
        b = g.beats_s(1, t0)
        for p, k, nb in [('Ab3', 0, 2), ('Db4', 2, 2), ('C4', 4, 1), ('G3', 5, g_beats)]:
            a.n('svln_nv', p, t0 + k * b, nb * b + 0.03, 0.5, rel=0.14 if g_beats == 7 else 0.6)
    a.mark('the regret post (violin in)', S('post_alyi'))


def sec_b_floor(a, g):
    sec(a, 'b THE FLOOR', S('floor'), S('boardroom'))
    a.mark('the floor (the beat after \'around them.\')', S('floor'))
    b = g.beats_s(1, S('floor'))
    AB = (['G3', 'Bb3', 'C4', 'Eb4'], 'Ab1', ['Ab2', 'Eb3'], 'Bb3')
    CM = (['G3', 'B3', 'D4', 'E4'], 'C2', ['C3', 'G3'], 'D4')
    EM = (['G#3', 'B3', 'D#4', 'F#4'], 'E2', ['B2', 'E3'], 'F#4')
    steps = [  # (start, end, chord, rhodes beats)
        (S('floor'), S('floor_c'), AB, 2),
        (S('floor_c'), S('floor_e'), CM, 2),
        (S('floor_e'), S('floor_home'), EM, 1),        # held: nothing moves under "hi." / "Hello."
        (S('floor_home'), S('boardroom'), AB, 1),       # home, after "Hello.": the landlord's last word
    ]
    album = has('floor_album')                          # the album edit: each chord 2 bars
    for i, (t0, t1, (rh, cb, vc, vla), nbeats) in enumerate(steps):
        dur = t1 - t0 + 0.05
        att = 0.35 if i < 2 else 0.6                    # silent attacks: the strings bow in under the Rhodes
        art.sus(a, 'cb', [cb], t0, dur, vel=0.39, att=att, lp=2200, rel=0.25)
        art.sus(a, 'vc', vc, t0, dur, vel=0.37, att=att, lp=2400, rel=0.25)
        art.sus(a, 'vla', [vla], t0, dur, vel=0.32, att=att + 0.2, lp=2600, rel=0.25)
        if album:                                        # on the beats for a bar, then half notes; home: held
            hits = [(0, 0.92), (1, 0.92), (2, 0.92), (3, 0.92), (4, 1.9), (6, 1.9)] if i < 3 else [(0, None)]
            for k, (bt, dl) in enumerate(hits):
                tb = t0 + bt * b
                a.ch('rhodes', rh, tb, (b * dl) if dl else (t1 - tb), 0.46 if bt in (0, 4) else 0.38, roll=0.004)
            continue
        for k in range(nbeats):                          # Tasya's Rhodes, ON the beats
            tb = t0 + k * b
            dd = (b * 0.92) if nbeats > 1 else (t1 - tb)
            a.ch('rhodes', rh, tb, dd, 0.46 if k == 0 else 0.38, roll=0.004)
    for t, p, v in [(S('floor'), 'G5', 0.36), (S('floor_c'), 'B5', 0.3), (S('floor_e'), 'D#6', 0.32),
                    (S('floor_home'), 'G5', 0.3)]:
        a.n('celesta', p, t, 2 * b, v)


def held_pedal(a, g, inst, pitch, t0, t1, vel, att, lp, rel):
    """A held pedal, RE-BOWED every 2 bars (fix 2b, 2026-09-26).  One long note outlasted its sample: LEVERAGE's F
    pedal (13.9 s in picture, 23.3 s in the album edit) plays the contrabass's soft F#1 (6.5 s) or E1 (13.8 s), so
    the F stopped about 6.7 s in -- the last 7 s of the picture's LEVERAGE and 16 s of the album edit's had no F under
    the pizz (and the F-major check read the pizz body's A-range energy against almost no F); the album edit's 11.5 s
    C pedal lost its cello C (a 8.4 s sample) for its last 4 s.  Now a bow change on every 2nd bar line from the
    first full bar (none within 2 s of the end), each stroke overlapping the next by its attack: a legato bow
    change, no gap.  A pedal of 2 bars or less (the picture's C pedal) is one note, as before."""
    b0 = g.pos(t0 + 1e-6)[0]
    first = b0 if abs(g.t(b0) - t0) < 1e-3 else b0 + 1
    rebow = [g.t(b) for b in range(first + 2, g.pos(t1)[0] + 1, 2) if t0 < g.t(b) < t1 - 2.0]
    starts, ends = [t0] + rebow, rebow + [t1]
    for k, (p0, p1) in enumerate(zip(starts, ends)):
        last = k == len(rebow)
        art.sus(a, inst, [pitch], p0, p1 - p0 + (0.0 if last else 0.3), vel=vel, att=att if k == 0 else 0.25, lp=lp,
                rel=rel if last else 0.3)


def sec_c_calmoff(a, g):
    sec(a, 'c1 LEVERAGE (the door bang -> "Terms?")', S('boardroom'), S('terms'))
    sec(a, 'c2 the long hold; the stamp\'s C pedal', S('terms'), S('gerg_post'))
    t_in, t_out = S('terb'), S('terms')
    card = S('card_terb') if has('card_terb') else -1e9       # the album edit has no card
    a.mark('the door bang: LEVERAGE in', t_in)
    e8 = g.beats_s(0.5, t_in)
    held_pedal(a, g, 'cb', 'F2', t_in, t_out + 0.2, vel=0.4, att=0.3, lp=1800, rel=0.2)       # the F pedal
    # straight pizz eighths (locked: the LEDs' eighths), a 3+3+2 grouping on varied pitches (never one pitch)
    cells = [['F2', 'C3', 'Ab2', 'F2', 'C3', 'Ab2', 'Db3', 'C3'], ['F2', 'C3', 'Bb2', 'F2', 'C3', 'Bb2', 'Eb3', 'C3'],
             ['F2', 'Db3', 'Ab2', 'F2', 'Db3', 'Ab2', 'C3', 'Bb2'], ['F2', 'C3', 'Ab2', 'F2', 'C3', 'Ab2', 'Gb2', 'Ab2']]
    n = int(round((t_out - t_in) / e8))
    bar0 = g.pos(t_in)[0]
    for j in range(n):
        t = t_in + j * e8
        bar, beat = g.pos(t + 1e-4)
        i = int((beat - 1) * 2 + 1e-6) % 8                # the eighth inside the act bar
        if abs(t - card) < 0.05:                          # the freeze hit owns the card's downbeat
            continue
        p = cells[(bar - bar0) % 4][i]
        acc = 1.0 if i in (0, 3, 6) else 0.78
        inst = 'vc_lev' if (i in (0, 3) or p in ('F2', 'Gb2', 'Ab2', 'Bb2')) else 'vla'      # (fix 2b: own track)
        art.pizz(a, inst, p, t, vel=0.44 * acc, lock=True)
        if i in (1, 4, 7) and (bar + i) % 3 != 0:         # one chip noise tick on some LED eighths, varied
            a.n('noise', 60, t, 0.03, 0.18 + 0.05 * ((bar + i) % 3), lock=True, clock=18000 + 4000 * (i % 3),
                dec=0.02, sus=0.0, rel=0.02)
    # the "muted 808": a pitched, low-passed thud (k808 through 150 Hz) + a muted bass drum on beat 1 of each act
    # bar, and the and-of-3 every other bar (never two close hits: no heartbeat); a grand cluster on each beat 1
    clusters = [['C3', 'Db3', 'Eb3'], ['B2', 'C3', 'Db3'], ['C3', 'Db3', 'D3'], ['C3', 'Db3', 'Eb3'], ['Bb2', 'C3', 'Db3']]
    thud = lambda t, v=0.62: (a.n('k808', 'F1', t, 0.4, v, lock=True, decay=0.35, punch=6.0, drive=1.2, click=0.05),
                              a.n('bdrum_muted', 60, t, 0.2, v * 0.55, lock=True))       # noqa: E731
    thud(t_in, 0.5)                                       # the entrance, under the bang
    a.ch('grand', clusters[-1], t_in, g.beats_s(1, t_in), 0.26, lock=True)
    k = 0
    for bar in range(bar0 + 1, g.pos(t_out)[0] + 1):
        for bt in ((1.0, 3.5) if (bar - bar0) % 2 == 0 else (1.0,)):
            t = g.t(bar, bt)
            if t >= t_out - 0.05:
                continue
            if abs(t - card) < 0.05:
                t += e8                                   # step off the freeze hit
            thud(t)
            if bt == 1.0:                                 # low grand clusters, a semitone shift per bar
                a.ch('grand', clusters[k % len(clusters)], t, g.beats_s(3, t), 0.3, lock=True)
                k += 1
    # the stamp's C (SFX): a low C pedal enters under it -- the dominant, leading on (it leaves on Gerg's post)
    st = S('stamp')
    dur = S('gerg_post') - st + 0.2
    held_pedal(a, g, 'cb', 'C2', st, st + dur, vel=0.46, att=0.35, lp=1800, rel=0.2)
    held_pedal(a, g, 'vc', 'C3', st, st + dur, vel=0.4, att=0.5, lp=2200, rel=0.2)


# fix 2b (2026-09-26), rule 12: the F-major check read A-range energy at 107-113 Hz over the F pedal -- the plucked
# Ab2 (103.8 Hz) and Bb2 (116.5 Hz) either side of A2 plus the cello-pizz body resonance (~111 Hz, the peak MM-08
# notched).  As composer A did for MM-08, a narrow notch on the offending notes only: LEVERAGE's cello pizz is its
# own track ('vc_lev', the palette's 'vc' otherwise), notched at 110.5 Hz, -12 dB, Q 16 -- narrower than MM-08's
# (111.7 Hz, Q 10), because here the pizz line itself plays Ab2 and Bb2: their fundamentals move -2.7 and -3.4 dB
# (their 2nd partials 0.0), F2 -0.3, Gb2 -0.5, C3 -0.5.  The floor, the C pedal and the sign's cello are untouched.
LEV_NOTCH = [('peq', 110.5, -12.0, 16.0)]
LEV_RIDE_DB = -1.5      # (fix 2b) LEVERAGE's fader ride: see the macro in _score_body

BUILD = MOTIFS['BUILD']['line'].split()


def build_cell(a, g, t_start, n=16, vel=0.5, full=False, first=0):
    """The Build (s2.6): straight 16ths from sixteenth `first` of the cell (the cell's 16th grid starts `first`
    sixteenths before t_start); 25 % chip lead doubled by xylophone; pizz on the eighths, wood on the beats."""
    q0 = g.qt(t_start) - 0.25 * first
    for i in range(first, first + n):
        tt = g.tq(q0 + 0.25 * i)
        p = nm(BUILD[i % 16].split('/')[0])
        d = g.tq(q0 + 0.25 * (i + 1)) - tt
        a.n('lead', p, tt, d * 0.8, vel, lock=True, duty=0.25, rel=0.03, dec=0.08, sus=0.45)
        a.n('xylo', p, tt, d * 0.8, vel * (0.9 if full else 0.75), lock=True)
        if i % 2 == 0:
            art.pizz(a, 'vln1', p - 12, tt, vel=0.46 if i % 4 == 0 else 0.36, lock=True)
        if i % 4 == 0:
            a.n('woodclick', 60, tt, 0.1, 0.5 if i == 0 else 0.4, lock=True)


def sec_d_gerg(a, g):
    sec(a, 'd GERG RETURNS', S('gerg_post'), S('sign'))
    a.mark('the Build restarts (the [PF])', S('build'))
    build_cell(a, g, S('build'), 8, vel=0.6)                    # the second compile pass: 8 sixteenths
    # (no F2 under it: a low pizz F's 5th partial reads as an A over the F bass in the s6.9 chroma check)
    if has('build12'):                                          # the album edit: the next compile passes (12, 16)
        build_cell(a, g, S('build12'), 12, vel=0.56)
        build_cell(a, g, S('build16'), 16, vel=0.58)
    a.mark('the sand falls: the Build resumes', S('sand_falls'))
    build_cell(a, g, S('sand_falls'), 4, vel=0.52)              # the first pass (4): a pickup into the sign
    a.n('cb_pizz', 'Eb3', S('sand_falls'), g.beats_s(1, S('sand_falls')), 0.5, lock=True)


def sec_e_lobby(a, g):
    sec(a, 'e1 the sign (VICTORY LAP)', S('sign'), S('plates'))
    sec(a, 'e2 one chip note; 1993; [CU]; "okay."', S('plates'), S('cadence'))
    sec(a, 'e3 the felt settle', S('cadence'), S('end') + 1.5)
    s = S('sign')
    a.mark('the sign: the stab', s)
    # ONE brass stab: 2 trumpets + 2 trombones, open and short, Abmaj9 (7 5 3 9, top down)
    art.stab(a, 'tpt', ['G5', 'Eb5'], s, vel=0.76, length=0.2)
    art.stab(a, 'tbn', ['C5', 'Bb4'], s, vel=0.74, length=0.22)
    a.n('lead2', 'G5', s, 0.2, 0.56, lock=True, duty=0.25, rel=0.05)         # the chip on the top line
    a.n('timp', 'Ab2', s, 0.6, 0.74, lock=True)
    art.pizz(a, 'cb', 'Ab1', s, vel=0.7, lock=True)
    art.spic(a, 'vln1', ['Eb5', 'G5'], s, vel=0.62, lock=True)
    art.spic(a, 'vla', ['C4', 'Eb4'], s, vel=0.6, lock=True)
    art.spic(a, 'vc', ['Ab2', 'Eb3'], s, vel=0.62, lock=True)
    # the Build at full through the sign's bar, the whole cell from the stab, over Ab (one bar before the plates)
    build_cell(a, g, s, 16, vel=0.56, full=True)
    a.n('cb_pizz', 'Eb3', s + g.beats_s(2, s), g.beats_s(1, s), 0.56, lock=True)
    if has('lap2'):                                             # the album edit: one more bar at full, no stab
        l2 = S('lap2')
        build_cell(a, g, l2, 16, vel=0.56, full=True)
        art.pizz(a, 'cb', 'Ab1', l2, vel=0.62, lock=True)
        a.n('cb_pizz', 'Eb3', l2 + g.beats_s(2, l2), g.beats_s(1, l2), 0.52, lock=True)
    # the 0-plates insert: the band CUTS (stem rides, tails included) to one chip note: the stab's top, alone
    a.mark('the 0 plates: one chip note', S('plates'))
    a.n('lead', 'G5', S('plates'), g.beats_s(1.5, S('plates')), 0.4, lock=True, duty=0.125, rel=0.2, dec=0.3,
        sus=0.35)
    # the 1993 dialog: Cancel greys out over three beats -> the 1-bit flat line F F F, uneven (register, length and
    # placement all vary: never even beeps); the bonk (SFX, E3) on beat 4 is the wrong note
    d = S('dialog')
    b = g.beats_s(1, d)
    a.mark('1993 dialog: the flat line (1-bit)', d)
    for (k, off, p, ln) in [(0, 0.0, 'F5', 0.22), (1, 0.018, 'F4', 0.32), (2, -0.012, 'F5', 0.13)]:
        a.n('beeper', p, d + k * b + off, ln, 0.5, lock=True, rel=0.01)
    # after "okay.": the felt, alone -- C4 then F4 on the swung and-of-4 (the first felt notes of the cue); the
    # F4's decay L-cuts across into 31.01 (the Q* vault's F hum takes the root)
    c, st = S('cadence'), S('settle')
    a.mark('after "okay.": the felt returns (C4)', c)
    a.n('felt', 'C4', c, st - c, 0.33)
    a.n('felt_mech', 60, c, 0.1, 0.36)
    a.n('felt', 'F4', st, 1.6, 0.35)
    a.ch('felt', ['F3', 'C4'], st, 1.6, 0.25, roll=0.012)
    a.n('felt_mech', 60, st, 0.1, 0.32)


# ================================================================== the build
def tracks():
    T = palette()
    T['vc_lev'] = replace(T['vc'], name='vc_lev', eq=list(T['vc'].eq) + LEV_NOTCH)   # LEVERAGE's cello pizz
    # fix 2b: +2 dB (was -1).  Retuned (its C4 sample is 23 c sharp, its G3 3 c flat), the near-pure senza tone
    # meets the hall and room sends at another point of their frequency response: the dry level is the same, the
    # dry + wet sum measured 2.0-2.2 dB lower in both masters; this restores the phrase's fix-1 level
    T['svln_nv'] = svln_track(gain_db=1.0)
    T['rhodes'].gain_db = -6.0
    T['rhodes'].sends = {'room': -12, 'plate': -12}
    T['celesta'].gain_db = -6
    T['grand'].gain_db = -3
    T['grand'].eq = [('lp', 3500), ('hs', 2500, -3)]
    T['k808'].eq = [('lp', 150)]
    T['k808'].gain_db = -10
    T['bdrum_muted'].gain_db = -10
    T['noise'].gain_db = -12
    T['lead'].gain_db = -1
    T['lead2'].gain_db = 0
    T['xylo'].gain_db = -10
    T['woodclick'].gain_db = -8
    T['beeper'].gain_db = -1
    T['timp'].gain_db = -2
    T['felt'].gain_db = -5.0                      # the settle sits at the ending's -22, under the Q* hum
    return T


def build():
    """The picture version (the underscore master and the stems): lock v2 timing, exactly as delivered."""
    if os.path.basename(sys.argv[0]) == 'build.py':
        print(f'[{ID}] NOTE: build.py renders the PICTURE score only, and its album master is picture-timed. The '
              f'album master is the album edit: run `python tracks/{ID}/track.py` to rebuild both.', flush=True)
    return _score(album=False)


# ================================================================== the album edit (fix1, 2026-09-26)
# The picture version is half silence (the record plays dry: Tasya's real line, the posts, the long hold, "okay.").
# The album edit keeps every section's material and its order, and turns the dry windows into musical rests, on
# bar lines of its own 96 grid: the Door twice (plain, then stopped on the "heart"), the floor at its full cycle
# (2 bars a chord), LEVERAGE for 10 bars, the stamp's C pedal, the Build compiling 8 -> 12 -> 4 into the sign, the
# victory lap for 2 bars, then the plates, the 1-bit flat line, the bonk's rest and the felt settle.
def _af(bar, beat=1.0):
    """Album-edit bar:beat -> file frame (a 1-beat pickup: bar 1 = frame 15)."""
    return 15 + 60 * (bar - 1) + 15 * (beat - 1)


ALBUM = dict(
    door1=_af(1), post_alyi=_af(4), first_heart=_af(4) + (SPOT['first_heart'] - SPOT['post_alyi']),
    floor=_af(7), floor_c=_af(9), floor_e=_af(11), floor_home=_af(13), boardroom=_af(15), floor_album=1,
    terb=_af(15, 4), card_terb=None, terms=_af(25),            # LEVERAGE 9.25 bars; the drop-out on a downbeat
    stamp=_af(26), gerg_post=_af(30, 3),                       # a 1-bar hold; the C pedal runs under the Build
    build=_af(27, 3), build12=_af(28, 2), build16=_af(29), sand_falls=_af(30, 4),
    sign=_af(31), lap2=_af(32), plates=_af(33),
    dialog=_af(33, 4), bonk=_af(34, 3), cadence=_af(35), settle=_af(35) + (SPOT['settle'] - SPOT['cadence']),
    end=_af(36),
)
ALBUM_EDIT_ID = f'{ID}-album-edit'


def build_album():
    """The album edit as its own Score (its album master becomes <ID>-album.wav; see render_all)."""
    return _score(album=True)


def _score(album=False):
    _CUR.update(spot=ALBUM if album else SPOT, act0=0 if album else ACT0)
    try:
        return _score_body(album)
    finally:
        _CUR.update(spot=SPOT, act0=ACT0)


def _score_body(album):
    g = Grid(bpm=96, meter='4/4', bars=37 if album else 32, pickup=1 if album else 3, swing=1.0)   # (album: 36 + ring)
    a = Arr(g)
    T = tracks()
    prewarm(['Ab3', 'Db4', 'C4', 'G3'], vels=(0.5,))
    sec_a_alyi(a, g)
    sec_b_floor(a, g)
    sec_c_calmoff(a, g)
    sec_d_gerg(a, g)
    sec_e_lobby(a, g)
    if album:                                                   # the album's own section map (its bar lines)
        a.sections = [('a the Door, twice (STRAIGHT)', 0.0, S('floor')),
                      ('b THE FLOOR (2 bars a chord)', S('floor'), S('boardroom')),
                      ('c1 LEVERAGE (the door bang -> the drop-out)', S('terb'), S('terms')),
                      ('c2 the hold; the stamp\'s C pedal', S('terms'), S('build')),
                      ('d the Build compiling over the C pedal', S('build'), S('sign')),
                      ('e1 the sign + the victory lap (2 bars)', S('sign'), S('plates')),
                      ('e2 one chip note; 1993; the rest', S('plates'), S('cadence')),
                      ('e3 the felt settle, ringing out', S('cadence'), S('end') + 3.0)]
    c = S('cadence')
    ring = 4.5 if album else 3.0                               # the album lets the felt ring out; picture: L-cut
    T['felt'].pedal = [(0.0, False), (c - 0.02, True), (S('settle') - 0.03, False), (S('settle') + 0.02, True),
                       (S('end') + ring, False)]
    if album:
        # hard stops: the violin on the "heart", the floor on its cut, LEVERAGE on "Terms?", the bonk's rest.
        # The C pedal and the Build's passes end by their own release (the album has no posts to keep dry).
        mutes = [(S('first_heart'), S('floor')), (S('boardroom'), S('terb')), (S('terms'), S('stamp')),
                 (S('bonk'), S('cadence'))]
    else:
        # the hard stops (s6.6 rule 4): every stem and its tails to digital zero within 3 ms
        mutes = [(S('first_heart'), S('floor')),             # the violin, dead on the first heart; dry for Tasya's line
                 (S('boardroom'), S('terb')),                # the floor stops on the cut to the boardroom
                 (S('terms'), S('stamp')),                   # LEVERAGE drops out on "Terms?"; the long hold is silent
                 (S('gerg_post'), S('build')),               # dry for Gerg's post (the C pedal leaves on its pop)
                 (S('ttemme_post'), S('sand_falls')),        # out for Ttemme's post (its read time) and the sand's hold
                 (S('bonk'), S('cadence'))]                  # the bonk slot, the silent [CU], "okay."
    # the band cuts to one chip note on the plates insert: every stem but the chip rides to zero (tails too); the
    # piano stem re-opens for the felt
    cut = S('plates')
    rides = {}
    for fam in FAMILIES:
        if fam == 'chip':
            continue
        pts = [(0.0, 0.0), (cut - 0.002, 0.0), (cut + 0.002, -120.0)]
        if fam == 'piano':
            pts += [(c - 0.05, -120.0), (c - 0.04, 0.0)]
        rides[fam] = pts
    meta = dict(META)
    if album:
        meta.update(id=ALBUM_EDIT_ID, title='The Return (album edit)', version='1',
                    tags=META['tags'] + ['album edit'],
                    scenes=['the soundtrack album: the picture cue (mm11-the-return, E01-S30a-e) with its dry '
                            'windows turned into musical rests'],
                    description='ALBUM EDIT of mm11-the-return (fix1, 2026-09-26). Its album master is delivered '
                                'as render/mm11-the-return-album.wav; the picture version stays the underscore '
                                'master and the stems. Every section in picture order, on its own 96 grid: the Door '
                                'twice (plain, then stopped on the heart), the floor at 2 bars a chord, LEVERAGE 9 '
                                'bars, a 1-bar hold, the C pedal under the Build compiling 8 -> 12 -> 16 -> 4, the '
                                'sign and 2 bars at full, the plates, the 1-bit flat line, the bonk rest, the felt '
                                'settle ringing out.'
                                ' Fix 2b (2026-09-26): LEVERAGE\'s cello pizz on its own track, notched at 110.5 Hz (-12 dB, Q 16; rule 12), the F pedal (and the album edit\'s C pedal) re-bowed every 2 bars (the held sample ran out), the senza violin retuned (its C4 sample is 23 c sharp).')
        meta['silence_windows'] = []
        meta['sfx_slots'] = []
        meta['no_third_windows'] = [(S('settle') + 0.05, S('end') + 1.2)]
        tt = lambda k: round(S(k), 2)                         # noqa: E731
        meta['audition'] = [
            f'0-{tt("floor")} s: the Door twice -- plain, then stopped dead at {tt("first_heart")} s: does the second '
            f'stop still land without the heart on screen?',
            f'{tt("floor")}-{tt("boardroom")} s: the floor at its full cycle (2 bars a chord): ironic beauty, not a '
            f'warm resolution; the cut at {tt("boardroom")} s',
            f'{tt("terb")}-{tt("terms")} s: 9 bars of LEVERAGE: a trap closing, never a loop that nags; the drop-out '
            f'at {tt("terms")} s. Fix 2b: the F pedal is re-bowed every 2 bars (at {tt("terb") + 5.625:.2f} s and '
            f'every 5 s): is the bow change inaudible? The cello pizz is notched at 110.5 Hz: still woody, and minor?',
            f'{tt("stamp")}-{tt("sign")} s: the C pedal (the dominant) under the Build compiling 8 -> 12 -> 16 -> 4 '
            f'into the sign: joy, and the sign lands on A-flat, one size too big',
            f'{tt("sign")}-{tt("plates")} s: the stab and TWO bars at full -- one size too big, then cut to one chip '
            f'note',
            f'{tt("dialog")} s to the end: F F F, the rest, the felt settle -- the right last word on an album?',
        ]
    else:
        e, f = 0.02, 0.005   # dry windows close 20 ms before the next entry and open 5 ms into a hard stop's 3 ms fade
        meta['silence_windows'] = [
            (S('tasya_in'), S('tasya_out'), 'TASYA\'s real line (a4-30-02, three parts; the palette steps are silent)', -70.0),
            (S('gerg_post') + f, S('build') - e, 'Gerg\'s post (dry)', -70.0),
            (S('ttemme_post') + f, S('sand_falls') - e, 'Ttemme\'s post, its read time (dry) + the sand\'s held beat',
             -70.0),
            (S('okay_in'), S('okay_out'), '"okay." (his room line lands dry)', -70.0),
            (S('bonk') + f, S('cadence') - e, 'the bonk slot + the silent [CU]', -70.0),
        ]
        meta['sfx_slots'] = [dict(t=round(S(k), 4), act=SPOT[k], sfx=v) for k, v in [
            ('iou', 'the IOU note flutters'), ('terb', 'the door bang (SHAKE_DOOR)'),
            ('card_terb', 'freeze_hit (TERB card; key F requested)'), ('stamp', 'rubber_stamp_C'),
            ('gerg_post', 'keycap_popcorn + the phone lights'), ('sign', 'neon ignite (3 held steps)'),
            ('bonk', 'alert_bonk (E3): the wrong 4th note'), ('end', 'the Q* vault hum (F): takes the felt\'s root')]]
        meta['no_third_windows'] = [(S('settle') + 0.05, S('end') + 1.2)]
        tt = lambda k: round(S(k), 2)                         # noqa: E731
        meta['audition'] = [
            f'album {tt("post_alyi")}-{tt("first_heart")} s (with a4-30-01 under it): the STRAIGHT violin, senza '
            f'vibrato -- sincere, plain, never "world\'s smallest violin"; the dead stop at {tt("first_heart")} s (the '
            f'lock\'s first heart) should get the laugh',
            f'album {tt("floor")}-{tt("boardroom")} s: Tasya\'s floor -- ironic beauty (the landlord\'s chord); the '
            f'Rhodes on the beats only; nothing moves under "hi." / "Hello."; the home chord at {tt("floor_home")} s '
            f'is the landlord\'s last word, cut on the boardroom',
            f'album {tt("terb")}-{tt("terms")} s: LEVERAGE low under Terb, running through the freeze card; the thud '
            f'is a pitched thud, never an 808 kit or a heartbeat; the drop-out on "Terms?" ({tt("terms")} s) IS the move. '
            f'Fix 2b: the cello pizz notched at 110.5 Hz and the F pedal re-bowed at 39.38 and 44.38 s: does it sound minor, '
            f'still woody, and is the bow change inaudible?',
            f'album {tt("build")} s and {tt("sand_falls")} s: the Build restarting reads as joy (Gerg is back), and '
            f'the pickup lands with the sand into the sign',
            f'album {tt("sign")} s: the ONE stab -- earned, one size too big for a lobby sign -- then the cut to one '
            f'chip note at {tt("plates")} s undercuts it',
            f'album {tt("dialog")}-{tt("end") + 1.5:.2f} s: F F F (1-bit, uneven), the bonk slot, silence, then the '
            f'felt C4 -> F4 after "okay." ringing into the Q* hum -- the right last word, or one too many?',
        ]
    # fader rides (every stem): the floor -0.8 dB (s5.E1: b at -20), the sign's bar -1.8 dB (the stab at -14 LUFS-M)
    lap_end = S('plates')
    # fix 2b: LEVERAGE -1.5 dB (inside its hard stops).  The re-bowed F pedal now sounds through the whole section
    # (it used to run out after ~6.7 s), which put LEVERAGE 1.5 dB over its fix-1 level and pulled the rest of the
    # cue 0.7 dB down through the master's loudness target; this puts both back
    macro = [(0.0, 0.0), (S('floor') - 0.01, 0.0), (S('floor'), -0.8), (S('boardroom'), -0.8),
             (S('boardroom') + 0.01, 0.0), (S('terb') - 0.01, 0.0), (S('terb'), LEV_RIDE_DB), (S('terms'), LEV_RIDE_DB),
             (S('terms') + 0.01, 0.0), (S('sign') - 0.01, 0.0), (S('sign'), -1.8), (lap_end, -1.8),
             (lap_end + 0.01, 0.0)]
    # the felt's ring: the file used to end while the F4 still rang (-30 dBFS), chopped by the 30 ms end fade (the
    # editor faded it by hand); the fade is now written into the render -- a 1.0 s fade over the last second
    end_fade = (S('end') + 3.5, S('end') + 5.0) if album else (S('end') + 2.0, S('end') + 3.0)
    return Score(meta['id'], g, T, a.notes, markers=a.markers, sections=a.sections, meta=meta, mutes=mutes,
                 stem_auto=rides, macro=macro, length_s=S('end') + (3.0 if album else 1.0), tail_s=2.0,
                 end_fade=end_fade)


def render_all(stems=True, previews=True, workers=None, edit_only=False):
    """The picture version (underscore master + stems, and a picture-timed album master that is then replaced),
    then the album edit: its album master becomes <ID>-album.wav/.mp3 and both cue sheets say so.
    edit_only: re-render the album edit alone and re-adopt it onto the picture's cue sheet on disk."""
    import json
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
