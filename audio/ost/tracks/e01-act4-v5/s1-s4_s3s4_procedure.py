"""E01 Act Four v5 · S3 + S4 + the card · THE BOARD'S SIDE: STEPS ONE TO FOUR -> WHAT THEY DIDN'T KNOW
act 1512 -> 6985 (+ the felt F4's ring into S5)

Pass one as ONE performance (edit-plan-v5 §4: PROCEDURE a -> h, then 09x): the procedure never stops, which is the
board's side.  MM-09's material and voices (tracks/mm09-the-boards-side: tracks(), the Step Four chorale, the pulse
cells, the viola whisper, the clockwork, the spinner, the hearts' cascade, the Door and the GPU choir, the Lighthouse,
the Addendum and its landing, the hourglass, Tasya's floor, 09x's REVERSAL), straight, 0 ms of humanisation, no
piano and no chip before the card (the exit rule).  File t = 0 = act frame 1500 (a 0.5 s pre-roll).

Under every line it THINS in the notes: melody and figures leave, the pedal (and a soft clock tick in the
boardroom) holds; the mix ducks it further (s1-s4_duckmap.json).  Figures, chord changes and whisper steps land in
the gaps between lines, never on a word.

  act frame  section · music                                          picture (lock v5)
  1512       a · Bbm(add9) and a harp-harmonic dyad ON the whip;       S3.00a over Neleh's shoulder: 11:59, the
             Neleh's clockwork under the waiting                        empty fifth tile
  1545       the pedal (Bb1 + F2, sul tasto) as his tile connects;     the connect (1545); "Mas. The board has
             it holds under Alyi's words, with the viola whisper        decided..." (1569) ... "That is just him."
             stepping down a semitone in the gaps (Db C B Bb Ab G)      (1953)
  1985       the clockwork creeps back, quietly, under the tinny       S3.01 his tile goes; "super." (2004)
             "super." (the procedure going on)
  2060       STEP FOUR in quarters on the pen's ticks: Bbm(add9),      S3.02 the list: 1 ✓ 2. BLOG POST 3. INTERIM
             Ab(add9), Gbmaj7, and the blank (the F bass alone)         CEO 4. ______
  2105-2476  the blank F holds under "Step two." and the post read     S3.03 the blog post [V] (2186-2403)
             once (pedal only); a clock tick from 2401 under "Any       "Any objections?" and its silence; the
             objections?" and its silence: the Post click is a tick     Post click (2476)
  2476       b · the Bb pedal back (the post is up); one soft pizz     S3.04 the join chime (2494); Rima's
             figure after her join chime; the pedal and the whisper     appointment; S3.04b "Will we?" / "More.
             under the appointment                                      Soon."
  3038       c · the all-hands: the pedal alone (the crowd's hush is   S3.06 "Is this a coup?"; S3.07 Alyi's answer
             the bed; the record plays dry)                             [V] in the doorway
  3390       the pulse returns softly with the keycaps; it breathes    S3.05 the evening: Gerg's post; "Nobody
             to its downbeats under the two lines                       asked him to go..."
  3628       d · NOV 18: the Db bed and the hearts' cascade to the      S4.01 the hearts; the eulogy post; the
             burial; one harp harmonic for the blue heart (3731)        blue heart
  3743       the boardroom: the Bb pedal; a pizz burst on each phone   S4.02 the phones (3750, 3946); Neleh's two
             buzz; under Neleh only the clock tick                      speeches
  4099       THE DOOR's head through the door (Ab4 -> Db5) as the cut  S4.04 Alyi, a reflection in the glass:
             finds his reflection; the GPU choir, ppp, holds under      "Step four will reveal itself."; S4.06
             him until the reflection flickers (4492)                   "That isn't a time."; the clack (4396)
  4395       the tick's last beat is the clack's (one clean beat)
  4499       the sincere beat: a solo viola plays the three steps      S4.07 Neleh at the blank line: "Then we'll
             (F Eb Db) over Step Four in quarters; the Gbmaj7 holds     write step four ourselves."
             under her line
  4580-4623  DESIGNED REST: the four dial tones (room tone only)       the speakerphone dials
  4623       e · the Lighthouse (marimba + harp) on the first ring;    S4.08 the split: Neleh offers Mario the job
             thinned to the marimba's half notes under the talk
  4960       Mario's quartet: the Addendum on "some thoughts", thin,   "...some thoughts on exactly this. Eleven
             gaining a bar; its tail CUT by "no." (5103)                pages..." / "In plain English: no."
  5262       "How much?": the tail finally lands (Gbmaj9, Db5 on top): the Nozama call; "How much?"
             sold, not resolved; it rings into the lobby camera
  5300       f · the clockwork resumes on the lobby camera, thin;      S4.09 the CCTV; the badge post; Neleh and
             the tick under the talk                                    Alyi
  5661       the straight-mute trumpet accent (F4 -> Bb4) on the       S4.10 the spotlight swings to Ttemme;
             spotlight; the pulse (a new CEO, the same procedure)       S4.10b the offer
  6036-6120  it holds under the folder's long beat (a sul tasto chord) the sealed folder; "Okay."
  6127       the hourglass: one pizz grain a beat, falling              S4.11 the flip (6125); "Chat… for how long?"
  6206       g · Tasya's floor: Abmaj9 on the slate, Cmaj9 as the      S4.12 11:53 PM, the door (6225-6240);
             door opens (silent attacks); the Rhodes on the beats as    S4.13 Tasya (the jangle on the offbeat)
             Tasya appears (6276); the held chord under his reading,
             re-voiced once at the sentence break (6518: Emaj9);        the statement [V] (6408-6742)
             home to Abmaj9 on the sign, one Rhodes chord              S4.13e MAS · GERG → (6752)
  6824       h · the clockwork winds down and HANGS on one held C      S4.14 "Step four?" (6848), `?`; S4.15 Mada,
             over the blank's F bass; Mada's spinner turns under it     silent, spinner turning
  6943       09x · REVERSAL on the card's first frame (the C pickup    CARD: WHAT THEY DIDN'T KNOW
             an eighth before): F(add9), no third; one chip F6
  6985       the orchestra cuts; one felt F4 (his room first) rings    S5.02 the home shot (the S5 cue's)
             into S5

Run: OST_WORKERS=2 ops/heavy.sh audio/.venv-theme/bin/python audio/ost/tracks/e01-act4-v5/s1-s4_render.py s3s4
"""
import importlib.util
import os
import sys
from dataclasses import replace

HERE = os.path.dirname(os.path.abspath(__file__))
_spec = importlib.util.spec_from_file_location('s1_s4_common', os.path.join(HERE, 's1-s4_common.py'))
if 's1_s4_common' in sys.modules:
    _C = sys.modules['s1_s4_common']
else:
    _C = importlib.util.module_from_spec(_spec)
    sys.modules['s1_s4_common'] = _C
    _spec.loader.exec_module(_C)
globals().update({k: getattr(_C, k) for k in dir(_C) if not k.startswith('__')})

ID = 's1-s4_procedure'
mm09 = load_track('mm09-the-boards-side')
TASTO = mm09.TASTO
CELLS = mm09.CELLS
ACC = mm09.ACC

WHIP = A('S3.00a')                      # 1512
CONNECT = M('S3.00a', 'connect')        # 1545
LIST = M('S3.02', 'tick1')              # 2060
POSTCLICK = M('S3.03', 'post')          # 2476
JOIN_R = M('S3.04', 'join')             # 2494
HANDS = A('S3.06')                      # 3038
EVENING = A('S3.05')                    # 3374
KEYS = M('S3.05', 'keys')               # 3390
S4 = A('S4.01')                         # 3628
BLUE = M('S4.01', 'blue')               # 3731
ROOM = A('S4.02')                       # 3743
BUZZ, BUZZ2 = M('S4.02', 'buzz'), M('S4.02', 'buzz2')      # 3750, 3946
REFL = A('S4.04')                       # 4109
CLACK = M('S4.06', 'clack')             # 4396
FLICKER = M('S4.06', 'flicker')         # 4492
SINCERE = A('S4.07')                    # 4499
TONE1 = M('S4.07', 'tone1')             # 4580
SPLIT = A('S4.08')                      # 4619
RING = M('S4.08', 'ring')               # 4623
SOME = W('a5-27-31', 'some')            # 4960
NO = W('a5-27-32', 'no')                # 5103
HOWMUCH_END = Lend('a5-27-34')          # 5261
LOBBY = A('S4.09')                      # 5292
SPOT = A('S4.10')                       # 5661
FOLDER0 = Lend('a5-27-41')              # 6031
OKAY = Lon('a5-27-42')                  # 6102
FLIP = M('S4.11', 'flip')               # 6125
SLATE = M('S4.12', 'slate')             # 6206
OPEN = M('S4.12', 'open')               # 6240
TASYA = A('S4.13')                      # 6274
BREAK = 6518                            # the statement's sentence break (the take's mid breath, 6518-6522)
SIGN = A('S4.13e')                      # 6752
BOARD = A('S4.14')                      # 6824
STEP4Q = Lon('a5-27-46')                # 6848 "Step four?"
MADA = A('S4.15')                       # 6883
CARD = A('S5.01')                       # 6943
HOME = A('S5.02')                       # 6985
PICK = CARD - 7.5                       # 09x's C pickup, an eighth before the card
assert (WHIP, LIST, POSTCLICK, S4, SPLIT, CARD, HOME) == (1512, 2060, 2476, 3628, 4619, 6943, 6985)
assert all(LN[l]['on'] > BREAK - 330 for l in ['a5-27-45']) and abs(LN['a5-27-45']['breaths'][0][0] - BREAK) < 1.0


def tracks():
    T = mm09.tracks()
    T['rhodes'].gain_db = T['rhodes'].gain_db + 6.0     # v5 render 2: the Rhodes read -32 LUFS under the floor's -18
    T['tick'] = replace(T['snare_taps'], name='tick', gain_db=-7.0, sends={'room': -14}, eq=[('hp', 350), ('lp', 7000)],
                        hum_ms=0.0, vel_jit=0.0)
    # the door back: it read -29.6 LUFS under MM-09's -9 dB ride; the ride is -6.5 now and the note a touch firmer
    # (velocity 0.5), about +5 dB in all, for s4.1's -24 LUFS-S into S5's first bar
    return T


def clock16(a, t0, n, first='F5', vel=0.3, inst='vln1', step=None):
    """Neleh's clockwork: n pizzicato sixteenths on varied pitches (s2.16), from t0 (cue seconds)"""
    pat = ['F5', 'C5', 'Ab4', 'C5', 'G5', 'C5', 'Ab4', 'C5']
    if first == 'G5':
        pat = pat[4:] + pat[:4]
    d = step or (15 / 4) / FPS
    for i in range(n):
        v = vel * (1.25 if i == 0 else (1.0 if i % 4 == 0 else 0.86))
        a.n(inst, pat[i % 8], t0 + i * d, 0.2, min(1.0, v), lock=True, art='pizz')


def cc_ramp(t0, fade_in, t1, fade_out, steps=10):
    """CC11 (expression) points for an SF2 track: 0 -> 127 over fade_in from t0, 127 -> 0 over fade_out to t1"""
    pts = [(0.0, 11, 0)]
    for i in range(steps + 1):
        pts.append((t0 + fade_in * i / steps, 11, int(round(127 * (i / steps) ** 0.5))))
    for i in range(steps + 1):
        pts.append((t1 + fade_out * i / steps, 11, int(round(127 * (1 - i / steps) ** 2))))
    return pts


def build():
    verify()
    cue = Cue(ID, WHIP, HOME + 72, pre=12)
    s = cue.s
    a = cue.a
    T = tracks()
    talk = lambda f: in_talk(f, 2.0)   # noqa: E731
    sup = LN['a5-27-05']                 # the tinny "super." on their laptop: the clockwork creeps back under it

    def talk_x(f):
        return talk(f) and not (sup['on'] - 3 <= f < sup['end'] + 3)

    def tick(frames, vel=0.26):
        for i, fr in enumerate(frames):
            a.n('tick', 60, s(fr), 0.2, vel * (1.12 if i % 4 == 0 else (0.9 if i % 2 else 1.0)), lock=True)

    def pulse(f0, f1, cells, vel=0.26, anchor=None, thin=True):
        """the straight-eighth spiccato pulse from f0 to f1 (act frames; B-flat minor cells, 3+3+2 accents); under a
        word it breathes to its downbeats, softer (the pulse thinned, never gone)"""
        anchor = f0 if anchor is None else anchor
        k = 0
        fr = f0
        while fr < f1 - 1:
            i = int(round((fr - anchor) / 7.5)) % 8
            cell = cells[int((fr - anchor + 1e-6) // 60.0) % len(cells)]
            on_beat = abs(((fr - anchor) / 15.0) - round((fr - anchor) / 15.0)) < 1e-6
            if thin and talk(fr):
                if on_beat:
                    a.n('vc', CELLS[cell][i], s(fr), '1/8', vel * 0.72 * ACC[i], lock=True, art='spic')
            else:
                a.n('vc', CELLS[cell][i], s(fr), '1/8', vel * ACC[i], lock=True, art='spic')
            fr += 7.5
            k += 1

    def pedal(f0, f1, vel=0.2, fifth=True, first_att=0.4, bass='Bb1', top='F2'):
        rebow(a, 'cb', bass, s(f0), s(f1), vel, seg=5.0, xf=1.0, first_att=first_att, art='sus', lp=700)
        if fifth:
            rebow(a, 'vc', top, s(f0), s(f1), vel * 0.85, seg=5.0, xf=1.0, first_att=first_att + 0.2, art='sus', lp=TASTO)

    def whisper(steps, vel=0.19, inst='vla'):
        """the viola whisper: a sul tasto inner voice falling a semitone at a time; each step lands in a gap"""
        for i, (fr, p) in enumerate(steps[:-1]):
            nx = steps[i + 1][0]
            a.n(inst, p, s(fr), s(nx) - s(fr) + 0.35, vel, lock=True, art='sus', lp=TASTO, att=0.45, rel=0.5)

    # ======================================================================= a · NOON, Neleh's desk
    # the whip lands on Bbm(add9) (Step Four's first chord) with a harp-harmonic dyad; the clockwork under the wait
    for inst, p, v in (('vc', 'Bb2', 0.24), ('bsn', 'Db3', 0.2), ('vla', 'F3', 0.22), ('vln2', 'C4', 0.2),
                       ('cl', 'F4', 0.24)):
        kw = dict(art='sus', lp=TASTO) if inst in ('vla', 'vln2', 'vc') else {}
        a.n(inst, p, s(WHIP), s(CONNECT + 6) - s(WHIP), v, lock=True, rel=0.45, **kw)
    a.n('cb', 'Bb1', s(WHIP), s(CONNECT + 6) - s(WHIP), 0.2, lock=True, art='sus', lp=900, rel=0.45)
    a.ch('harm', ['Bb3', 'F4'], s(WHIP), 1.2, 0.3, lock=True)
    clock16(a, s(WHIP + 7.5), 8, 'F5', 0.27)
    clock16(a, s(WHIP + 37.5), 4, 'G5', 0.24)
    cue.mark(WHIP, 'a: the whip: Bbm(add9) + the harp-harmonic dyad')
    cue.mark(WHIP + 7.5, "a: Neleh's clockwork under the wait (11:59)")
    # the connect: the pedal; it holds under Alyi's words, the whisper stepping down in the gaps
    pedal(CONNECT, LIST + 2, 0.2, first_att=0.3)
    whisper([(CONNECT, 'Db4'), (1745, 'C4'), (1830, 'B3'), (1880, 'Bb3'), (1958, 'Ab3'), (2030, 'G3'), (LIST, None)])
    cue.mark(CONNECT, 'a: the connect: the Bb pedal (it holds under "Mas. The board has decided...")', hit=False)
    # the clockwork creeps back, quietly, under the tinny "super." (the procedure going on)
    clock16(a, s(LIST - 75), 8, 'F5', 0.11)             # v5 first render: -18.8 LUFS here; "quietly", under the
    clock16(a, s(LIST - 45), 8, 'G5', 0.13)             # tinny "super." (-22 LUFS on their laptop's speaker)
    clock16(a, s(LIST - 15), 4, 'F5', 0.15)
    cue.mark(LIST - 75, 'a: the clockwork creeps back (under the tinny "super.")')
    # STEP FOUR in quarters on the pen's run; the blank = the F bass alone, held under the post (pedal only)
    L = cue.sec(LIST, bars=3)
    mm09.step_four(L.a, 1, top='cl', inner=('bsn', 'vla', 'vln2'), vel=0.22, top_vel=0.24, blank=False, unit=1.0)
    L.commit()
    rebow(a, 'vc', 'F2', s(LIST + 45), s(POSTCLICK + 4), 0.2, seg=5.0, xf=1.0, first_att=0.05, art='sus', lp=TASTO)
    rebow(a, 'cb_f1', 'F1', s(LIST + 45), s(POSTCLICK + 4), 0.17, seg=5.0, xf=1.0, first_att=0.05, art='sus', lp=900)
    for k, lab in enumerate(['Bbm(add9) (1 ✓)', 'Ab(add9) (2. BLOG POST)', 'Gbmaj7 (3. INTERIM CEO)',
                             'the blank: the F bass alone (4. ____)']):
        cue.mark(LIST + 15 * k, f'a: STEP FOUR on the list: {lab}')
    # "Any objections?" and its silence: the clock tick; the Post click lands on a tick
    tick([POSTCLICK - 15 * k for k in range(5, -1, -1)], 0.26)
    cue.mark(POSTCLICK - 75, 'a: the clock tick (under "Any objections?" and its silence)')
    cue.mark(POSTCLICK, 'a: the Post click is a tick; the Bb pedal back')

    # ======================================================================= b · Rima
    pedal(POSTCLICK, HANDS + 4, 0.2, first_att=0.35)
    a.line('vln1', 'Bb4/16 F5/16 Db5/16 C5/16', s(JOIN_R + 4), vel=0.24, lock=True, art='pizz')
    cue.mark(JOIN_R + 4, 'b: one soft pizz figure after her join chime')
    whisper([(2500, 'Db4'), (2706, 'C4'), (2826, 'B3'), (2908, 'Bb3'), (2978, 'Ab3'), (HANDS + 2, 'G3'),
             (EVENING + 10, None)], vel=0.18)

    # ======================================================================= c · the all-hands, and the evening
    pedal(HANDS, S4 + 8, 0.17, first_att=0.8)
    cue.mark(HANDS, 'c: the all-hands: the pedal alone (the hush is the bed; the record plays dry)', hit=False)
    pulse(KEYS, S4, ['A', 'B', 'A', 'D', 'C'], vel=0.24, anchor=KEYS)
    cue.mark(KEYS, 'c: the pulse returns softly with the keycaps')

    # ======================================================================= d · NOV 18, the hearts; the boardroom
    D = S4
    L_ = s(ROOM + 8) - s(D)
    for inst, p, v in (('vc', 'Db3', 0.22), ('vla', 'Ab3', 0.2), ('vln2', 'F4', 0.16)):
        a.n(inst, p, s(D), L_, v, lock=True, art='sus', lp=TASTO, env=mm09.sw_env(L_, 0.6, 0.8))
    a.n('cb', 'Db2', s(D), L_, 0.2, lock=True, art='sus', lp=700, att=0.4)
    H = cue.sec(D, bars=3)
    mm09.cascade(H.a, H.f(D), H.f(M('S4.01', 'bury') + 4), dens0=5.0, dens1=10.0, vel0=0.22, vel1=0.31)
    H.commit()
    a.n('harm', 'Db6', s(BLUE), 1.0, 0.3, lock=True, env=[(0, 1.0), (0.9, 0.35), (1.6, 0.0)])
    cue.mark(D, 'd: NOV 18: the Db bed; the hearts pour (the cascade, to the burial)')
    cue.mark(BLUE, 'd: the blue heart (one harp harmonic)')
    # the boardroom at night: the Bb pedal; a pizz burst on each phone buzz; the clock tick under Neleh
    pedal(ROOM, SINCERE + 4, 0.19, first_att=0.5)
    pulse(BUZZ, BUZZ + 22.5, ['A'], vel=0.28, anchor=BUZZ, thin=False)
    pulse(BUZZ2 - 1, BUZZ2 + 21, ['D'], vel=0.26, anchor=BUZZ2 - 1, thin=False)
    tick([f for f in range(int(BUZZ + 30), int(CLACK) + 1, 15) if not (BUZZ2 - 8 <= f < BUZZ2 + 22)], 0.24)
    cue.mark(BUZZ, 'd: the phones buzz: the pizz locks to it')
    cue.mark(BUZZ2 - 1, 'd: the second buzz')
    cue.mark(CLACK - 1, 'd: the clack: the tick\'s last, clean beat', hit=False)
    # Alyi in the glass: THE DOOR's head through the door as the cut finds him; the GPU choir, ppp, under him
    dh = 4101
    a.n('door', 'Ab4', s(dh), 0.6, 0.42, lock=True, art='nv')
    a.n('door', 'Db5', s(dh + 15), s(4152) - s(dh + 15), 0.42, lock=True, art='nv', rel=0.6)
    Lc = s(FLICKER) - s(REFL)
    for inst, v in (('choir', 0.26), ('reed', 0.2)):
        for p in chord_of('GPU_CHOIR'):
            a.n(inst, p, s(REFL), Lc + 0.05, v, lock=True)
        T[inst].cc = cc_ramp(s(REFL), 0.7, s(FLICKER) - 0.9, 0.9)       # SF2 voices: CC11 swells in and out
    cue.mark(dh, 'd: THE DOOR (Ab4 -> Db5) through the door: his reflection')
    cue.mark(REFL, 'd: the GPU choir, ppp, under Alyi in the glass (to the flicker)', hit=False)
    # the sincere beat: her real face; the solo viola plays the three steps over Step Four in quarters
    SB = cue.sec(SINCERE, bars=3)
    SB.a.seq('svla', [('F4', (1, 1), '1b', 0.5), ('Eb4', (1, 2), '1b', 0.48)], lock=True, art='sus')
    SB.a.n('svla', 'Db4', (1, 3), SB.f(TONE1 - 6) - SB.g.at((1, 3)), 0.46, lock=True, art='sus', rel=0.55)
    mm09.step_four(SB.a, 1, top=None, inner=('vla', 'vln2', 'vln1'), vel=0.13, unit=1.0, blank=False)
    for n in SB.a.notes:                               # the Gbmaj7 holds under her line, out before the dial tones
        if n.inst != 'svla':
            if n.start >= SB.g.at((1, 3)) - 1e-6:
                n.dur = SB.f(TONE1 - 6) - n.start
            n.x['rel'] = 0.5
    SB.commit()
    cue.mark(SINCERE, "d: the sincere beat: the solo viola plays the three steps (F Eb Db)")
    cue.mark(TONE1, 'd: DESIGNED REST: the four dial tones (room tone)', hit=False)

    # ======================================================================= e · the rival lab (the split)
    E_ = cue.sec(RING, bars=16)
    ea = E_.a
    fl = E_.f
    lh = ['F4', 'Bb4', 'Db5']
    k = 0
    fr = RING
    while fr < LOBBY - 20:
        p = lh[k % 3]
        if not talk(fr):
            full = fr < Lon('a5-27-30') or (NO + 8 <= fr < Lon('a5-27-33'))
            ea.n('marimba', p, fl(fr), 0.6, 0.34 if full else 0.26, lock=True)
            if full:
                ea.n('harp', p, fl(fr), 0.8, 0.26 if fr < Lon('a5-27-30') else 0.2, lock=True)
        elif k % 2 == 0:
            ea.n('marimba', p, fl(fr), 0.6, 0.2, lock=True)          # thinned: the beam in half notes, softer
        fr += 15
        k += 1
    ea.n('celesta', 'F5', fl(RING), 0.6, 0.2, lock=True)
    E_.commit()
    rebow(a, 'vc', 'Bb2', s(RING), s(HOWMUCH_END + 1), 0.2, seg=4.5, xf=0.8, first_att=0.3, art='sus', lp=TASTO)
    rebow(a, 'cb', 'Bb1', s(SPLIT), s(HOWMUCH_END + 1), 0.17, seg=5.0, xf=1.0, first_att=0.6, art='sus', lp=700)
    cue.mark(RING, 'e: the Lighthouse on the first ring')
    # Mario's quartet: the Addendum on "some thoughts" (thin: a dark solo line + two held voices), gaining a bar;
    # its tail climbs and "In plain English: no." cuts it
    Q = cue.sec(SOME, bars=4)
    qa = Q.a
    place_motif(qa, 'svla', 'ADDENDUM', (1, 1), vel=0.42, lock=True, art='sus', rel=0.25)
    qa.line('svla', 'C4/8 Db4/8 Eb4/4', (3, 1), vel=0.42, lock=True, art='sus', gate=1.0, rel=0.03)
    qa.seq('vla', [('F3', (1, 1), '4b'), ('Db3', (2, 1), '2b'), ('Eb3', (2, 3), '2b'), ('Eb3', (3, 1), '2b')],
           vel=0.2, lock=True, art='sus', rel=0.05)
    cut = Q.f(NO)
    for n in qa.notes:
        if n.start >= cut:
            n.vel = 0.0
        n.dur = max(0.02, min(n.dur, cut - n.start))
        n.x['rel'] = 0.03
    qa.notes = [n for n in qa.notes if n.vel > 0.0]
    Q.commit()
    cue.mark(SOME, 'e: the Addendum (Mario\'s quartet, thin), on "some thoughts"')
    cue.mark(NO, 'e: "no." CUTS the tail', hit=False)
    # "How much?": the tail finally lands -- deceptively (Gbmaj9, Db5 on top): sold, not resolved
    t1, t2, t3 = s(HOWMUCH_END + 1), s(HOWMUCH_END + 9), s(HOWMUCH_END + 16)
    a.seq('svla', [('Gb4', t1, t2 - t1, 0.44), ('Ab4', t2, t3 - t2, 0.46), ('Db5', t3, 1.7, 0.48)],
          lock=True, art='sus', rel=0.8)
    a.seq('vla', [('Gb3', t1, t3 - t1), ('F3', t3, 1.7)], vel=0.21, lock=True, art='sus', rel=0.8)
    a.seq('vc', [('Eb2', t1, t3 - t1), ('Gb2', t3, 1.7)], vel=0.21, lock=True, art='sus', rel=0.8)
    a.seq('cb', [('Eb1', t1, t3 - t1), ('Gb1', t3, 1.7)], vel=0.16, lock=True, art='sus', lp=700, rel=0.8)
    cue.mark(HOWMUCH_END + 16, 'e: "How much?": the tail lands (sold); it rings into the lobby camera')

    # ======================================================================= f · Sunday
    pedal(LOBBY + 10, SLATE + 4, 0.18, first_att=1.2)
    clock16(a, s(LOBBY + 8), 8, 'F5', 0.2)
    clock16(a, s(LOBBY + 38), 8, 'G5', 0.18)
    tick([f for f in range(int(LOBBY + 83), int(SPOT) - 10, 15)], 0.22)
    cue.mark(LOBBY + 8, 'f: the clockwork resumes on the lobby camera, thin')
    # the spotlight: the straight-mute accent (the knee's fourth, F -> Bb); the pulse (a new CEO, the same procedure)
    a.n('cb', 'Bb1', s(SPOT), 0.2, 0.34, lock=True, art='pizz')
    a.seq('tpt', [('F4', s(SPOT), s(SPOT + 7.5) - s(SPOT), 0.23), ('Bb4', s(SPOT + 7.5), 0.94, 0.22)],
          lock=True, art='straight', rel=0.3)
    pulse(SPOT, Lon('a5-27-38') - 3, ['A', 'D', 'A', 'B'], vel=0.26, anchor=SPOT, thin=False)
    tick([f for f in range(int(SPOT + 120), int(FOLDER0) + 1, 15)], 0.22)
    cue.mark(SPOT, 'f: the spotlight: the straight-mute accent (F4 -> Bb4); the pulse')
    # the folder's long beat: it holds (a sul tasto chord, pp, over the pedal); "Okay."
    Lf = s(FLIP - 2) - s(FOLDER0 + 5)
    for inst, p, v in (('vla', 'F3', 0.17), ('vln2', 'C4', 0.15), ('vln1', 'Db4', 0.13)):
        a.n(inst, p, s(FOLDER0 + 5), Lf, v, lock=True, art='sus', lp=TASTO, env=mm09.sw_env(Lf, 0.9, 0.7))
    cue.mark(FOLDER0 + 5, 'f: it holds under the folder\'s long beat', hit=False)
    # the hourglass: one pizzicato grain a beat, falling (never one pitch)
    for i, (inst, p) in enumerate([('vln1', 'F5'), ('vln2', 'Db5'), ('vla', 'C5'), ('vln1', 'Bb4'), ('vln2', 'Ab4'),
                                   ('vla', 'Gb4')]):
        a.n(inst, p, s(FLIP + 2 + 15 * i), 0.3, 0.32 - 0.012 * i, lock=True, art='pizz')
    cue.mark(FLIP + 2, 'f: the hourglass: one grain a beat, falling')

    # ======================================================================= g · the door: Tasya's floor
    d1 = s(OPEN + 14) - s(SLATE)
    for inst, p in (('vc', 'Ab2'), ('vla', 'Eb3'), ('vln2', 'G3'), ('vln1', 'C4')):
        a.n(inst, p, s(SLATE), d1, 0.25, lock=True, art='sus', lp=TASTO, env=mm09.sw_env(d1, 0.6, 0.6))
    a.n('cb', 'Ab1', s(SLATE), d1, 0.19, lock=True, art='sus', lp=800, env=mm09.sw_env(d1, 0.6, 0.6))
    # Cmaj9 as the door opens, full while the room is wordless; it settles 4 dB lower before Tasya's first word
    # (v5 renders: -17.6 LUFS under "Good evening..." and -18.4 under the statement [V] at a flat level)
    d2 = s(BREAK + 20) - s(OPEN)
    r0, r1 = s(Lon('a5-27-44') - 30) - s(OPEN), s(Lon('a5-27-44') - 4) - s(OPEN)
    env2 = [(0.0, 0.0), (0.7, 1.0), (r0, 1.0), (r1, 0.63), (d2 - 0.9, 0.63), (d2, 0.0)]
    for inst, p in (('vc', 'C3'), ('vla', 'G3'), ('vln2', 'B3'), ('vln1', 'D4')):
        a.n(inst, p, s(OPEN), d2, 0.22, lock=True, art='sus', lp=TASTO, env=env2)
    a.n('cb', 'C2', s(OPEN), d2, 0.16, lock=True, art='sus', lp=800, env=env2)
    for k in range(4):                                  # Tasya appears: the Rhodes on the beats (the jangle: offbeats)
        a.ch('rhodes', ['E3', 'G3', 'B3', 'D4'], s(TASYA + 2 + 15 * k), 0.5, 0.56 if k else 0.62, lock=True)
    d3 = s(SIGN + 6) - s(BREAK)
    for inst, p in (('vc', 'B2'), ('vla', 'G#3'), ('vln2', 'D#4'), ('vln1', 'F#4')):
        a.n(inst, p, s(BREAK), d3, 0.17, lock=True, art='sus', lp=TASTO, env=mm09.sw_env(d3, 1.0, 0.8))
    a.n('cb', 'E2', s(BREAK), d3, 0.13, lock=True, art='sus', lp=800, env=mm09.sw_env(d3, 1.0, 0.8))
    d4 = s(BOARD + 16) - s(SIGN)
    for inst, p in (('vc', 'Ab2'), ('vla', 'Eb3'), ('vln2', 'G3'), ('vln1', 'C4')):
        a.n(inst, p, s(SIGN), d4, 0.24, lock=True, art='sus', lp=TASTO, env=mm09.sw_env(d4, 0.4, 0.7))
    a.n('cb', 'Ab1', s(SIGN), d4, 0.18, lock=True, art='sus', lp=800, env=mm09.sw_env(d4, 0.4, 0.7))
    a.ch('rhodes', ['C4', 'Eb4', 'G4', 'Bb4'], s(SIGN + 1), 0.9, 0.58, lock=True)
    for fr, lab, hit in [(SLATE, "g: Tasya's floor: Abmaj9 on the slate (silent attack)", False),
                         (OPEN, 'g: Cmaj9 as the door opens', False),
                         (TASYA + 2, 'g: the Rhodes on the beats (Tasya appears; the jangle owns the offbeats)', True),
                         (BREAK, 'g: the held chord re-voiced at the sentence break (Emaj9)', False),
                         (SIGN + 1, 'g: home: Abmaj9 on the sign, one Rhodes chord', True)]:
        cue.mark(fr, lab, hit=hit)

    # ======================================================================= h · "Step four?": the clockwork hangs
    for p, off, v in zip(['F5', 'C5', 'Ab4', 'C5', 'G5'], [0, 3, 6.5, 10.5, 15], [0.3, 0.26, 0.25, 0.24, 0.23]):
        a.n('vln1', p, s(BOARD + off), 0.3, v, lock=True, art='pizz')
    hang = BOARD + 20
    a.n('svln', 'C5', s(hang), s(PICK) - s(hang) + 0.02, 0.32, lock=True, art='sus', att=0.25, lp=2600, rel=0.25)
    a.n('vc', 'F2', s(hang + 2), s(PICK) - s(hang + 2), 0.24, lock=True, art='sus', lp=TASTO, att=0.3, rel=0.3)
    a.n('cb_f1', 'F1', s(hang + 2), s(PICK) - s(hang + 2), 0.2, lock=True, art='sus', lp=900, att=0.3, rel=0.3)
    Sp = cue.sec(MADA + 3, bars=2)
    mm09.spinner(Sp.a, (1, 1), 5, 0.16)
    Sp.commit()
    cue.mark(BOARD, 'h: the clockwork winds down')
    cue.mark(hang, 'h: the hang: one held C over the blank F (a pedal, not silence)', hit=False)
    cue.mark(MADA + 3, "h: Mada's spinner turns under the held C (his silence)", hit=False)

    # ======================================================================= 09x · the card, and the door back
    mm09.build()
    x09 = mm09.SEC_NOTES['09x']
    H45 = 110.0                                        # MM-09's b45.1 (the REVERSAL's downbeat) in its own seconds
    cue.notes.extend(remap(x09, 109.6, 112.49, s(CARD) - (H45 - 109.6), drop={'felt'}))
    a.n('felt', 'F4', s(HOME), 1.875, 0.5, lock=True)
    cue.mark(PICK, '09x: the C pickup')
    cue.mark(CARD, '09x: REVERSAL on the card (F(add9), no third; one chip F6)')
    cue.mark(HOME, '09x: the orchestra cuts; one felt F4 (the door back) rings into S5')

    # ----------------------------------------------------------------------- thin under the words (compose-level)
    melodic = {'vln1', 'vln2', 'harm', 'harp', 'celesta', 'tpt', 'rhodes', 'door', 'svln', 'cl', 'hn', 'marimba'}
    keep = []
    dropped = 0
    for n in cue.notes:
        fa = cue.fr(n.start)
        short = n.dur < 0.9 or n.x.get('art') in ('spic', 'pizz')
        if n.inst in melodic and short and talk_x(fa) and not (CARD - 10 <= fa):
            if not (n.inst == 'marimba' and RING <= fa < LOBBY) and not (n.inst in ('vln1', 'vln2', 'vla')
                                                                          and FLIP <= fa < SLATE):
                dropped += 1
                continue
        keep.append(n)
    cue.notes[:] = keep
    cue.dropped_under_words = dropped

    # the orchestra cuts on the home shot (the felt answers); the REVERSAL rides at MM-09's -9 dB
    FB = s(HOME)
    cutc = [(0.0, 0.0), (FB - 0.004, 0.0), (FB, -120.0), (FB + 30, -120.0)]
    stem_auto = {k: cutc for k in ('strings', 'winds', 'brass', 'perc', 'chip', 'bass', 'synth')}
    pk = s(PICK) - 0.02
    REV_DB = -6.5                                      # MM-09's -9 dB left the out only ~3.5 LU over this bed
    macro = [(0.0, 0.0), (pk - 0.06, 0.0), (pk - 0.03, REV_DB), (FB + 30, REV_DB)]
    for lab, a0, a1 in [('a NOON: the call, the list, the post', WHIP, POSTCLICK), ('b Rima', POSTCLICK, HANDS),
                        ('c the all-hands and the evening', HANDS, S4), ('d NOV 18 hearts', S4, ROOM),
                        ('d the boardroom: the phones, the glass', ROOM, SINCERE),
                        ('d the sincere beat', SINCERE, TONE1), ('rest: the dial tones', TONE1, RING),
                        ('e the rival lab (the split)', RING, LOBBY), ('f Sunday: the lobby camera', LOBBY, SPOT),
                        ('f Ttemme, the folder, the hourglass', SPOT, SLATE), ('g the door: Tasya\'s floor', SLATE, BOARD),
                        ('h Step four? (the hang)', BOARD, PICK), ('09x REVERSAL (the card)', PICK, HOME),
                        ('the felt F4 (into S5)', HOME, HOME + 45)]:
        cue.section(lab, a0, a1)
    end = FB + 2.4
    meta = base_meta(
        ID, "The Board's Side: Steps One to Four / What They Didn't Know (Ep1 Act Four v5, S3 + S4 + card, to picture)",
        mm='MM-09 + MM-09x', family='P02 PROCEDURE + P08 OUTS KIT (09x: REVERSAL)',
        tone="their side as one procedure that never stops and a fourth step that is always blank; then the door back",
        scenes=[f'v5 S3.00a-S5.01 (+ the felt on S5.02), act {WHIP}-{HOME}; file t = 0 = act frame {cue.f0}'],
        motifs=['STEP_FOUR (the list; the sincere beat)', 'NELEH_CLOCKWORK', 'the viola whisper', 'the hearts',
                'DOOR (the head, through the glass) + GPU_CHOIR', 'LIGHTHOUSE', 'ADDENDUM (cut by "no.") + its landing',
                'HOURGLASS', 'TASYA_FLOOR (Abmaj9 -> Cmaj9 -> Emaj9 -> Abmaj9)', 'MADA_SPINNER', 'REVERSAL'],
        motif_ids=['ADDENDUM'],            # (the Lighthouse is thinned to half notes under the talk: never whole)
        key='B-flat minor centre; Db lydian (Alyi); Bb minor (Mario); chromatic mediants (Tasya); F(add9) no third (09x)',
        underscore_lufs=-21.0, album_lufs=-16.0,
        no_third_windows=[(s(CARD) + 0.1, FB - 0.02)],
        sfx_slots=[dict(t=s(CONNECT), sfx='bell_ding_F6: his tile connects'),
                   dict(t=s(M('S3.02', 'tick1')), sfx='key_tap_space: the pen ticks step 1'),
                   dict(t=s(POSTCLICK), sfx='post_click (on a tick)'), dict(t=s(JOIN_R), sfx="bell_ding_F6: Rima's join"),
                   dict(t=s(KEYS), sfx='keycap_popcorn (F5-C7; the pulse stays low)'),
                   dict(t=s(M('S4.01', 'post') + A('S4.01') - A('S4.01')), sfx='heart_gliss (rides on top)'),
                   dict(t=s(BUZZ), sfx='BUZZ: the phones'), dict(t=s(CLACK), sfx='landing_thunk: the clack'),
                   dict(t=s(TONE1), sfx='DTMF x4: the dial tones (the designed rest; tune to F4 Eb4 Db4 C4, OST-BIBLE '
                                        's6.8 request 1)'),
                   dict(t=s(RING), sfx='RING: the lighthouse phone'), dict(t=s(M('S4.08', 'click')), sfx='the click'),
                   dict(t=s(M('S4.08', 'tone')), sfx='DIALTONE (over the Bb pedal)'),
                   dict(t=s(M('S4.10b', 'slide') + 9), sfx='paper_whip: the folder'),
                   dict(t=s(M('S4.12', 'door')), sfx='landing_thunk x3: the door'),
                   dict(t=s(M('S4.13', 'jangle')), sfx='JANGLE (the offbeat)'), dict(t=s(CARD), sfx='the card (the REVERSAL owns it)')],
        audition=[f'the whole file: one procedure, never stopping -- does it ever feel like a loop that nags?',
                  f'{s(CONNECT):.1f}-{s(LIST):.1f} s: the pedal and the whisper under the firing, told from their side: '
                  'dignified, not villainous; the clockwork creeping back under "super."',
                  f'{s(LIST):.1f} s: Step Four on the pen\'s run; the blank F held under the blog post',
                  f'{s(REFL - 10):.1f}-{s(FLICKER):.1f} s: the Door\'s head and the choir in the glass: a cathedral, never a church',
                  f'{s(SINCERE):.1f} s: do we care about Neleh at the sincere beat? then the dial-tone rest',
                  f'{s(SOME):.1f}-{s(NO):.1f} s: the Addendum under Mario, thin; cut by "no."; {s(HOWMUCH_END):.1f} s the '
                  'landing (sold, not a comic button?)',
                  f'{s(SLATE):.1f}-{s(BOARD):.1f} s: Tasya\'s floor under the statement: the Emaj9 at the sentence break -- '
                  'a colour shift, not a swell on the names',
                  f'{s(BOARD):.1f}-{FB:.1f} s: the clockwork winds down and hangs; the spinner; the REVERSAL on the card; '
                  'the felt F4 answers at the home shot'])
    return Score(ID, cue.g, T, cue.notes, markers=cue.markers, sections=cue.sections, stem_auto=stem_auto,
                 macro=macro, mutes=cue.mutes, length_s=end, tail_s=2.0, meta=meta), cue


if __name__ == '__main__':
    sc, cue = build()
    print(sc.name, len(sc.notes), 'notes', round(sc.end_s, 2), 's; dropped under words:', cue.dropped_under_words)
