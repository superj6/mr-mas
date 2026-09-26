"""MM-07  "How to Fire a CEO Who Owns Nothing."  (THE PLAN)  --  composer A  --  OST-BIBLE s5.A1, P14 BLUEPRINT

THE PLAN is the show's own voice: accurate, cheerful, drawn in whole-pixel strokes, one label per beat, and it
always breaks.  The music is a precise little drafting machine in F dorian (quartal, never an A natural): a chip
music-box lead, celesta, harp, pizzicato and a triangle bass, straight, 0 ms of humanisation.  No piano (except
Mas's two bars before it), no brass, no swing, no Mas motif, no V.O.

This file builds two things:

  build()          the ALBUM / LIBRARY SUITE  mm07-how-to-fire-a-ceo   (40 bars, 100 s)
                     bars  1-20  the Ep1 picture cue (sc 24 + sc 25), exactly as delivered to picture
                     bars 21-32  PLAN-SHORT  (12 bars, 2.5.3.2)   generic Blueprint for Eps 2-12; its DIAGRAM
                                 (bars 23-27) is the seamless loop
                     bars 33-40  PLAN-MICRO  ( 8 bars, 1.3.3.1)   generic Blueprint for Eps 2-12
  build_picture()  the TO-PICTURE CUT  e01-s25-the-plan  (E01-S24 + E01-S25, 12:31:00-13:21:00, 1200 frames)
                     bar numbers match the bible (P1 = bar -1, P2 = bar 0, the blueprint's first frame = bar 1)

  python track.py                  renders both, plus the three tape-stop alternates (s5.A1: "deliver it with
                                   the stop's start on each beat of bar 17") as break inserts
  python ../../build.py mm07-how-to-fire-a-ceo    renders the suite only (build())

Every picture sync point is in CUE below: conform by editing CUE, never by stretching audio.
"""
import os
import sys
from dataclasses import replace

import numpy as np

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))
from engine import *   # noqa: E402,F401,F403
from engine.core import s2n   # noqa: E402
from engine.mix import convolve   # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))

# ============================================================================ the sync map (PLAN bars)
# PLAN bar 1 = the blueprint's first frame (12:36:00).  Sources: OST-BIBLE s5.A1 (the music brief) and the
# animatic kit on its real clock (studio/src/episodes/ep01/act4/kits/plan.ts; production/act4/chunks-v2.md C01).
CUE = dict(
    cut=(1, 1),            # sc 24 -> 25: the felt is cut, tails and all; the grid draws itself (kit f0-f10)
    stamp=(1, 2),          # SFX rubber_stamp_C: HOW TO FIRE A CEO WHO OWNS NOTHING. (kit: beat 2, f15)
    enter=(1, 3),          # the score enters the beat after the stamp
    waltz=(4, 1),          # waltz bar 1 (+0 f): the chairs appear three per beat (kit f180/195/210)
    waltz_stop=(7, 1),     # LEFT EARLIER IN 2023 (SFX stamp): the waltz stops dead, no tail (+180 f)
    resume=(7, 2),         # the 4/4 Blueprint resumes
    four_vote=8,           # THESE FOUR VOTE: Step Four in quarters, beat 4 = the F bass alone (the blank)
    labels=9,              # b9.1-b10.4: one Blueprint note per label, in the animatic's order
    walk_on=(11, 1),       # the four figures walk on
    ticks=[(12, 1), (12, 3), (13, 1)],   # 1 check, 2 check, 3 check: F - G - Ab, each with a pencil tick
    step4=(13, 3),         # the line stops at step 4
    hold=(13, 3),          # one held quartal chord, pp, under "Step four." / "Good question." (b14-15)
    brk=(16, 1),           # BREAK: the line's last 2 beats loop (the chalk is SFX)
    tear=(17, 3),          # the sheet tears: the tape-stop starts (kit 25.07 beat 3)
    join=(18, 3),          # he clicks JOIN (kit 25.08 beat 3): the tape reaches zero exactly here
)
TAPE_CURVE = 1.6           # speed = (1 - u) ** curve over the stop

META = dict(
    id='mm07-how-to-fire-a-ceo',
    mm='MM-07',
    title='How to Fire a CEO Who Owns Nothing.',
    family='P14',
    tone='THE PLAN: a precise, cheerful drafting machine that explains everything accurately and then breaks',
    usage='VI',
    tags=['blueprint', 'the plan', 'music box', 'waltz', 'quartal', 'straight', 'library', 'featured', 'tape-stop'],
    scenes=['E01-S24 the suite (DARK ROOM pickup, 2 bars)', 'E01-S25 THE PLAN (18 bars: 3.7.5.3)',
            'PLAN-SHORT and PLAN-MICRO: every later episode\'s PLAN (re-voice per concept)',
            'labels b9-10 (animatic order): NOPEAI THE NONPROFIT / CONTROLS / THE COMPANY (CAPPED PROFIT) / '
            'THE BOARD\'S DUTY banner / MACROSOFT key ring VOTES: 0 / CEO box / EQUITY: 0 stamp (SFX, rest) / the moth'],
    motifs=['the Water Line bar 1 (felt, sc 24; the settle never comes)', 'the Blueprint (chip music box + celesta)',
            'the knee-cell waltz F F F | F G Ab | C | -- (the last F never comes)', 'Step Four (first statement)',
            'the Blueprint break: a 2-beat stuck loop, then a tape-stop'],
    motif_ids=['BLUEPRINT', 'STEP_FOUR'],
    key='F dorian (quartal; no A natural); sc 24 F minor; the waltz Fm - Dbmaj7 - C7sus - Fm',
    composer='Composer A (OST batch 1)',
    underscore_lufs=-16.0,      # featured (the bible: THE PLAN is featured -16; bars 14-15 sit ~4 dB under)
    album_loops=1,
)


# ============================================================================ small tools
def verb_gate(sends, cut_s):
    """A track insert: its own reverb (so the tails belong to the track), then a hard gate at cut_s: the
    track and every tail to digital zero within 3 ms (the waltz's dead stop)."""
    def f(buf):
        y = buf.astype(np.float32).copy()
        for kind, lvl in sends.items():
            y += convolve(buf, kind).astype(np.float32) * db(lvl)
        i = s2n(cut_s)
        k = int(0.003 * SR)
        if i < y.shape[1]:
            e = min(y.shape[1], i + k)
            y[:, i:e] *= np.linspace(1, 0, e - i, dtype=np.float32)[None]
            y[:, e:] = 0.0
        return y
    return f


def stem_posts(stops, gates):
    """Stem inserts: the tape-stops (every family) and permanent gates (family -> cut time).
    stops: [(t_start, t_zero, t_resume)] -- the deck loses power at t_start, reaches zero at t_zero, and the
    stem stays at digital zero until t_resume (the next section)."""
    def make(fam):
        def f(buf, ctx):
            if ctx.get('loop'):
                return buf
            x = np.asarray(buf, dtype=np.float32).copy()
            n = x.shape[1]
            for a, z, r in stops:
                ia, ir = s2n(a), min(s2n(r), n)
                if ia >= n:
                    continue
                x[:, ia:ir] = tape_stop(x[:, ia:ir], 0.0, z - a, curve=TAPE_CURVE)
            if fam in gates:
                i = s2n(gates[fam])
                k = int(0.003 * SR)
                e = min(n, i + k)
                x[:, i:e] *= np.linspace(1, 0, e - i, dtype=np.float32)[None]
                x[:, e:] = 0.0
            return x
        return f
    return {fam: make(fam) for fam in FAMILIES}


def tracks(extra_gates=None):
    T = palette()
    for k, tr in T.items():                      # THE PLAN is the record: straight, 0 ms
        if k not in ('felt', 'felt_mech'):
            tr.hum_ms = 0.0
            tr.drift_ms = 0.0
            tr.offset_ms = 0.0
            tr.vel_jit = 0.015
    # the chip music box: the Blueprint's lead
    T['lead'].sends = {'room': -14, 'chamber': -16}
    T['lead'].gain_db = -1.0
    T['lead2'].sends = {'room': -14, 'chamber': -18}
    T['lead2'].gain_db = -6.0
    T['lead2'].pan = -0.3
    T['tri'].gain_db = -8.0
    T['tri2'] = replace(T['tri'], name='tri2', gain_db=-9.0, pan=-0.2)     # the 4ths below: a triangle (few upper partials)
    T['celesta'].gain_db = 10.0
    T['celesta'].sends = {'hall': -12, 'chamber': -12}
    T['harp'].gain_db = -2.0
    T['harp'].pan = -0.35
    T['woodclick'].gain_db = -16.0
    T['woodclick'].eq = [('hp', 900), ('hs', 6000, -4)]
    T['woodclick'].pan = 0.35
    T['glasspad'].gain_db = -16.0
    for s in ('vln1', 'vln2', 'vla', 'vc', 'cb'):
        T[s].sends = {'hall': -12, 'chamber': -14}
    T['vla'].pan = 0.25
    T['vc'].pan = 0.35
    T['cl'].pan = -0.1
    T['fl'].pan = -0.15
    # sc 24: his felt (thin, dry-ish room), his pedal is added per cue
    T['felt'].gain_db = -12.5
    T['felt_mech'].gain_db = -21.0
    T['lead'].eq = [('hp', 200)]
    return T


def waltz_tracks(T, cut_s):
    """The waltz's own players: the same voices, with their own reverb, so its stop kills every tail."""
    for src, name, sends in (('lead', 'wz_box', {'room': -12, 'chamber': -14}),
                             ('celesta', 'wz_cel', {'hall': -11, 'chamber': -12}),
                             ('tri', 'wz_tri', {'room': -16}),
                             ('lead2', 'wz_ch', {'room': -12, 'chamber': -16})):
        T[name] = replace(T[src], name=name, sends={}, post=verb_gate(sends, cut_s))
    T['wz_ch'].gain_db = -9.0
    T['wz_ch'].pan = 0.25
    T['wz_box'].gain_db = -1.0
    T['wz_cel'].gain_db = 11.0
    T['wz_tri'].gain_db = -7.0
    return T


class Writer:
    """Writes notes in quarter positions (straight, lock=True: the record plays straight)."""

    def __init__(self, a, off):
        self.a, self.g, self.off = a, a.g, off

    def q(self, bar, beat=1.0):
        return self.g.q(bar + self.off, beat)

    def t(self, bar, beat=1.0):
        return self.g.tq(self.q(bar, beat))

    def n(self, inst, p, qq, dq, vel, **x):
        g = self.g
        t0 = g.tq(qq)
        return self.a.n(inst, p, t0, g.tq(qq + dq) - t0, vel, lock=True, **x)

    # ---- the voices
    def box(self, p, qq, vel=0.62, dq=0.55, duty=0.25, inst='lead', ring=0.30, **x):
        """chip music box: a plucked pulse, stepped (sound-driver) decay."""
        return self.n(inst, p, qq, dq, vel, duty=duty, att=0.0015, dec=ring, sus=0.0, rel=0.22, steps=15, **x)

    def cel(self, p, qq, vel=0.5, dq=0.9, inst='celesta'):
        return self.n(inst, p, qq, dq, vel)

    def harp(self, p, qq, vel=0.45, dq=1.2):
        """The VSCO harp's mp layer is one mis-pitched G1 sample and its f layer is E1/D7/F7 only (vel < 0.40 or
        >= 0.67 plays notes stretched by up to 3 octaves, ~110 cents flat): stay in the mf layer and set the
        level with gain instead (the set's dyn_db is 18)."""
        v = min(max(vel, 0.42), 0.62)
        return self.n('harp', p, qq, dq, v, gain=18.0 * (vel - v))

    def pizz(self, inst, p, qq, vel=0.5, dq=None):
        if inst == 'vc':                          # the roots: contrabass pizz (the cello pizz F2 is stretched from an
            inst, vel = 'cb', vel * 0.84          # E1 sample whose inharmonic partials read as an A over F)
            dq = 1.9 if dq is None else dq        # a root is the bass until the next one (the pizz decays anyway)
        return self.n(inst, p, qq, 0.4 if dq is None else dq, vel, art='pizz')

    def tri(self, p, qq, dq, vel=0.5, inst='tri', dec=0.45):
        """a plucked triangle bass: it decays to nothing (never a held chip tone)"""
        return self.n(inst, p, qq, dq, vel, att=0.002, dec=dec, sus=0.0, rel=0.12, steps=15)

    def tick(self, qq, vel=0.32):
        return self.n('woodclick', 60, qq, 0.2, vel)

    def pad(self, chord, q0, q1, vel=0.22, insts=('vc', 'vla', 'vln2', 'vln1'), lp=2300.0, att=0.35, rel=0.5):
        """sul tasto quartal pad: low velocity, low-passed, a slow bow; a flat level (no swell)."""
        for inst, p in zip(insts, chord):
            self.n(inst, p, q0, q1 - q0, vel, lp=lp, att=att, rel=rel)

    def line(self, notes, q0, vel=0.62, colour='celesta', colour_oct=12, below=None, below_inst='tri2',
             tick=False, box_duty=0.25, colour_vel=0.44, below_vel=0.40, harp=0.36):
        """The Blueprint: notes = [(pitch, beats)] from q0; pitch None = rest.  The chip box leads; `colour`
        doubles it (colour_oct above); `below` = the diatonic 4ths below (never an A natural)."""
        qq = q0
        for i, (p, d) in enumerate(notes):
            if p is not None:
                self.box(p, qq, vel, dq=min(0.9, d * 0.6), duty=box_duty, ring=0.26 + 0.12 * min(d, 2))
                if colour:
                    c = nm(p) + colour_oct
                    if colour == 'celesta':
                        self.cel(c, qq, colour_vel, dq=max(0.6, d * 0.9))
                    elif colour == 'fl':
                        self.n('fl', c, qq, min(0.45, d * 0.45), colour_vel, art='stac')
                    elif colour == 'cl':             # the cl_stac set is 28-44 c flat on F4/G4: short sustains
                        self.n('cl', c, qq, min(0.32, d * 0.32), colour_vel, rel=0.07)
                if below is not None and below[i] is not None:
                    if below_inst == 'harp':
                        self.harp(below[i], qq, below_vel, dq=d * 1.1)
                    else:
                        self.box(below[i], qq, below_vel, dq=min(0.8, d * 0.5), duty=0.5, inst=below_inst, ring=0.2)
                if harp:
                    self.harp(p, qq, harp, dq=d * 1.1)
                if tick:
                    self.tick(qq)
            qq += d
        return qq

    def pulse(self, q0, q1, cells, vel=0.38, inst='vla', accent=1.12):
        """straight-eighth pizzicato on varied pitches (the drafting machine; never one pitch)."""
        k = 0
        qq = q0
        while qq < q1 - 1e-6:
            p = cells[k % len(cells)]
            on = abs((qq - round(qq))) < 1e-6
            self.pizz(inst, p, qq, vel * (accent if on else 0.9), dq=0.35)
            qq += 0.5
            k += 1


# ---- pitch sets (F dorian: F G Ab Bb C D Eb)
Q_F = ['F3', 'Bb3', 'Eb4', 'Ab4']        # quartal on F (Fm11)
Q_G = ['G3', 'C4', 'F4', 'Bb4']         # quartal on G
Q_C = ['C3', 'F3', 'Bb3', 'Eb4']        # the title's own stack (C F Bb Eb)
Q_D = ['D3', 'G3', 'C4', 'F4']          # dorian brightness (D natural, never an A)
Q_BB = ['Bb2', 'Eb3', 'Ab3', 'Db4']     # quartal on Bb (three notes used: Bb Eb Ab)
PULSE_F = ['F3', 'C4', 'Bb3', 'C4', 'Eb4', 'C4', 'Bb3', 'C4']
PULSE_G = ['G3', 'C4', 'Bb3', 'D4', 'F4', 'D4', 'C4', 'Bb3']
PULSE_C = ['C3', 'F3', 'Bb3', 'F3', 'Eb4', 'Bb3', 'F3', 'Bb3']
PULSE_D = ['D3', 'G3', 'C4', 'G3', 'F4', 'C4', 'G3', 'C4']
FOURTH_BELOW = {'F4': 'C4', 'G4': 'D4', 'Ab4': 'Eb4', 'Bb4': 'F4', 'C5': 'G4', 'D5': 'G4', 'Eb5': 'Bb4', 'F5': 'C5'}


def below(ps):
    return [FOURTH_BELOW.get(p) if p else None for p in ps]


# ============================================================================ sc 24 (P1-P2): the suite
def sc24(w, T, p1):
    """His two bars: the Water Line's first bar on the felt, swung; on P2.1 the C4, and the settle never
    comes (the blueprint cuts it at b1.1).  Nothing below C3 (the crane truck and the glassware are SFX)."""
    a, g = w.a, w.g
    a.line('felt', 'F4/4 F4/4 F4/4 G4/8 F4/8 | C4/4', (p1, 1), vel=0.40, swing=1.0)
    a.ch('felt', ['Ab3', 'C4', 'Eb4'], (p1, 1), '3.8b', 0.26, roll=0.012)
    a.ch('felt', ['Db3', 'F3', 'Ab3'], (p1 + 1, 1), '3.9b', 0.25, roll=0.014)
    a.n('felt_mech', 60, (p1, 1), 0.1, 0.35)
    a.n('felt_mech', 60, (p1 + 1, 1), 0.1, 0.3)
    # the chip's signature: the 50 % square doubles the nudge only (G4), well under the felt
    place_motif(a, 'lead', 'WATER_LINE', (p1, 1), part='nudge_double', vel=0.2, swing=1.0, duty=0.5,
                att=0.004, dec=0.25, sus=0.35, rel=0.12)
    t1, t2 = g.t(p1), g.t(p1 + 1)
    T['felt'].pedal = [(t1 - 0.05, True), (t2 + 0.01, False), (t2 + 0.05, True), (w.t(*CUE['cut']) - 0.02, False)]
    a.section('E01-S24 the suite (DARK ROOM)', p1, p1 + 2)
    a.mark('P1 sc 24 [W] the suite', (p1, 1))
    a.mark('P2.1 C4: the settle never comes', (p1 + 1, 1))


# ============================================================================ sc 25: THE PLAN (18 bars)
def plan18(w, T):
    a = w.a
    q = w.q
    # ---------------------------------------------------------------- WORD (b1-3)
    a.section('WORD', 1 + w.off, 4 + w.off)
    q0, q4 = q(*CUE['enter']), q(*CUE['waltz'])
    L = ['F4', 'G4', 'Ab4', 'Bb4', 'C5', 'Bb4', 'Ab4', 'G4', 'F4']
    D = [1, 1, 1, 1, 2, 1, 1, 1, 1]
    D[-1] += (q4 - q0) - sum(D)                       # the last F fills whatever the stamp leaves
    w.line(list(zip(L, D)), q0, vel=0.62, below=below(L))
    w.pulse(q0, q4, PULSE_F, vel=0.35)
    # the roots: pizz cello + triangle bass (half notes)
    roots = [(q0, 'F2'), (q(2, 3), 'G2'), (q(3, 1), 'Bb2'), (q(3, 3), 'C2')]
    for i, (qq, p) in enumerate(roots):
        nxt = roots[i + 1][0] if i + 1 < len(roots) else q4
        w.pizz('vc', p, qq, 0.55)
        w.tri(nm(p) + 12, qq, (nxt - qq) * 0.8, 0.5)
    for c, a0, a1 in ((Q_F, q0, q(2, 3)), (Q_G, q(2, 3), q(3, 1)), (Q_BB, q(3, 1), q(3, 3)), (Q_C, q(3, 3), q4)):
        w.pad(c[:3], a0, a1, vel=0.28)
    a.mark('b1.1 cut to blueprint (score silent: the grid draws)', (CUE['cut'][0] + w.off, 1))
    a.mark('b1.3 score enters: the Blueprint', (CUE['enter'][0] + w.off, CUE['enter'][1]))

    # ---------------------------------------------------------------- WALTZ (b4.1-b7.1), 3/4 on the 96 beat
    a.section('DIAGRAM: the chip waltz (3/4 on the 96 beat)', 4 + w.off, 7 + w.off)
    qw = q4
    mel = [('F5', 0, 1), ('F5', 1, 1), ('F5', 2, 1),           # waltz bar 1: the chairs appear
           ('F5', 3, 1), ('G5', 4, 1), ('Ab5', 5, 1),          # waltz bar 2: DIRE (G), NOVIHS (Ab) stand
           ('C6', 6, 3)]                                       # waltz bar 3: DRUH stands; bar 4: the empty chair
    duties = [0.25, 0.125, 0.25, 0.5, 0.25, 0.25, 0.125]       # the flat line: a different duty on every F
    vels = [0.62, 0.52, 0.55, 0.60, 0.56, 0.58, 0.64]
    for (p, b, d), du, v in zip(mel, duties, vels):
        w.box(p, qw + b, v, dq=0.5 if d == 1 else 1.4, duty=du, inst='wz_box', ring=0.28 if d == 1 else 0.9)
        w.cel(p, qw + b, 0.40 + 0.08 * (b % 3 == 0), dq=0.9 if d == 1 else 2.6, inst='wz_cel')
    bass = ['F3', 'Db3', 'C3', 'F3']                           # Fm | Dbmaj7 | C7sus | Fm (the melody's F never comes)
    chords = [['Ab4', 'C5'], ['F4', 'C5'], ['F4', 'Bb4'], ['Ab4', 'C5']]
    for k in range(4):
        wb = qw + 3 * k
        w.tri(bass[k], wb, 2.9, 0.55, inst='wz_tri', dec=0.6)
        for bt in (1, 2):
            for p in chords[k]:
                w.n('wz_ch', p, wb + bt, 0.3, 0.46 if bt == 1 else 0.40, duty=0.5, att=0.002, dec=0.12, sus=0.0,
                    rel=0.08, steps=15)
    for k, lab in enumerate(['waltz bar 1 (+0 f): F F F', 'waltz bar 2 (+45 f): F G Ab (DIRE, NOVIHS stand)',
                             'waltz bar 3 (+90 f): C (DRUH stands)', 'waltz bar 4 (+135 f): the empty chair']):
        a.mark(lab, a.g.tq(qw + 3 * k))
    a.mark('b7.1 WALTZ STOPS DEAD: LEFT EARLIER IN 2023 (SFX stamp)', (CUE['waltz_stop'][0] + w.off, 1))

    # ---------------------------------------------------------------- b7.2-7.4: the 4/4 Blueprint resumes
    a.section('DIAGRAM: the remaining six; THESE FOUR VOTE; the structure', 7 + w.off, 11 + w.off)
    qr, q8 = q(*CUE['resume']), q(CUE['four_vote'])
    w.pulse(qr, q8, PULSE_F[1:] + PULSE_F[:1], vel=0.35)
    w.pad(Q_F[:3], qr, q8, vel=0.24)
    w.tri('F2', q(7, 3), 1.2, 0.42)
    # ---------------------------------------------------------------- b8: THESE FOUR VOTE (Step Four, quarters)
    fv = CUE['four_vote']
    tops, basses = ['F4', 'Eb4', 'Db4', None], ['Bb2', 'Ab2', 'Gb2', 'F2']
    inner = [['F3', 'C4'], ['Eb3', 'Bb3'], ['Db3', 'F3'], []]  # parallel fifths top to bass; Bbm(add9) Ab(add9) Gbmaj7
    for i in range(4):
        qq = q(fv, 1 + i)
        w.pizz('vc', basses[i], qq, 0.62 if i < 3 else 0.7, dq=0.6)
        w.tri(basses[i], qq, 0.7, 0.44)
        for p in inner[i]:
            w.pizz('vla', p, qq, 0.46)
        if tops[i]:
            w.n('cl', tops[i], qq, 0.82, 0.55, rel=0.12)
    a.mark('b8.1 THESE FOUR VOTE: Step Four (Bbm)', (fv + w.off, 1))
    a.mark('b8.4 step four = the F bass alone (the blank)', (fv + w.off, 4))
    # ---------------------------------------------------------------- b9-10: the labels, one note per label
    lb = CUE['labels']
    L = ['F4', 'G4', 'Ab4', 'Bb4', 'C5', 'Bb4', None, None]  # ... CEO box, [EQUITY: 0 = the SFX stamp], the moth
    names = ['NOPEAI THE NONPROFIT', 'CONTROLS', 'THE COMPANY (CAPPED PROFIT)', "THE BOARD'S DUTY banner",
             'MACROSOFT key ring, VOTES: 0', 'CEO box', 'EQUITY: 0 stamp (SFX: rest)', 'the moth (celesta flutter)']
    w.line([(p, 1) for p in L], q(lb), vel=0.60, below=below(L), tick=True)
    for i, nmx in enumerate(names):
        a.mark(f'b{lb + i // 4}.{i % 4 + 1} {nmx}', (lb + i // 4 + w.off, i % 4 + 1))
    qm = q(lb + 1, 4)                                         # the moth: one celesta flutter, pp
    for k in range(6):
        w.cel('G5' if k % 2 == 0 else 'Ab5', qm + k / 6.0, 0.22 - 0.015 * k, dq=0.3)
    w.pulse(q(lb), q(lb + 2), PULSE_F + PULSE_C, vel=0.35)
    for qq, p in ((q(lb), 'F2'), (q(lb, 3), 'Bb2'), (q(lb + 1), 'C2'), (q(lb + 1, 3), 'F2')):
        w.pizz('vc', p, qq, 0.52)
        w.tri(nm(p) + 12, qq, 1.6, 0.46)
    w.pad(Q_F[:3], q(lb), q(lb + 1), vel=0.27)
    w.pad(Q_C[:3], q(lb + 1), q(lb + 2), vel=0.27)

    # ---------------------------------------------------------------- PLAN (b11-13): the path, ticked in stride
    a.section('PLAN: the path; three ticks; stop at step 4', 11 + w.off, 14 + w.off)
    q11, qs4 = q(*CUE['walk_on']), q(*CUE['step4'])
    w.pulse(q11, q(12), PULSE_G, vel=0.36)
    w.pulse(q(12), q(13), PULSE_F, vel=0.36)
    w.pulse(q(13), qs4, PULSE_C, vel=0.36)
    harp8 = ['F3', 'Bb3', 'Eb4', 'Ab4', 'G4', 'Eb4', 'Bb3', 'G3']
    k = 0
    qq = q11
    while qq < qs4 - 1e-6:                                     # the harp draws the path (quartal eighths)
        w.harp(harp8[k % 8], qq, 0.30 + 0.06 * (k % 4 == 0), dq=0.8)
        qq += 0.5
        k += 1
    for qq, p in ((q11, 'G2'), (q(11, 3), 'C2'), (q(12), 'F2'), (q(12, 3), 'G2'), (q(13), 'C2')):
        w.pizz('vc', p, qq, 0.5)
        w.tri(nm(p) + 12, qq, 1.5, 0.44)
    w.pad(Q_G[:3], q11, q(12), vel=0.26)
    w.pad(Q_F[:3], q(12), q(13), vel=0.26)
    w.pad(Q_C[:3], q(13), qs4, vel=0.26)
    for (bb, bt), p in zip(CUE['ticks'], ['F4', 'G4', 'Ab4']):
        qq = q(bb, bt)
        w.box(p, qq, 0.66, dq=1.1, ring=0.55)
        w.cel(nm(p) + 12, qq, 0.46, dq=1.6)
        w.box(FOURTH_BELOW[p], qq, 0.40, dq=0.9, duty=0.5, inst='tri2', ring=0.4)
        w.tick(qq, 0.40)
        a.mark(f'b{bb}.{bt} tick {["1", "2", "3"][CUE["ticks"].index((bb, bt))]}', (bb + w.off, bt))

    # ---------------------------------------------------------------- b13.3-16.1: one held quartal chord, pp
    a.section('"Step four." / "Good question." (one held chord, pp)', 14 + w.off, 16 + w.off)
    qh, qb = q(*CUE['hold']), q(*CUE['brk'])
    for inst, p in zip(('vc', 'vla', 'vln2', 'vln1'), ['F3', 'Bb3', 'Eb4', 'Ab4']):
        w.n(inst, p, qh, qb - qh, 0.13, lp=1800.0, att=0.18, rel=0.25)
    w.n('glasspad', 'Eb5', qh, qb - qh, 0.30, rel=0.2)
    w.n('glasspad', 'Ab5', qh, qb - qh, 0.26, rel=0.2)

    # ---------------------------------------------------------------- BREAK (b16-18): stuck, then the tape stops
    a.section('BREAK: the stuck loop; the tape-stop into the JOIN click', 16 + w.off, 19 + w.off)
    stuck(w, qb, q(*CUE['join']))
    a.mark('b16.1 BREAK: the line\'s last 2 beats loop (chalk = SFX)', (CUE['brk'][0] + w.off, 1))


def stuck(w, q0, q_end, vel=0.62, colour='celesta', root='F2'):
    """The line's last 2 beats (G Ab: steps 2 and 3), looping like a jammed mechanism: identical, straight."""
    qq = q0
    while qq < q_end - 1e-6:
        w.box('G4', qq, vel, dq=0.55, ring=0.3)
        w.box('Ab4', qq + 1, vel, dq=0.55, ring=0.3)
        if colour == 'celesta':
            w.cel('G5', qq, 0.44, dq=0.9)
            w.cel('Ab5', qq + 1, 0.44, dq=0.9)
        elif colour == 'fl':
            w.n('fl', 'G5', qq, 0.4, 0.44, art='stac')
            w.n('fl', 'Ab5', qq + 1, 0.4, 0.44, art='stac')
        else:
            w.n('cl', 'G4', qq, 0.3, 0.44, rel=0.07)
            w.n('cl', 'Ab4', qq + 1, 0.3, 0.44, rel=0.07)
        w.box('D4', qq, 0.40, dq=0.45, duty=0.5, inst='tri2', ring=0.25)
        w.box('Eb4', qq + 1, 0.40, dq=0.45, duty=0.5, inst='tri2', ring=0.25)
        for k, p in enumerate(['F3', 'C4', 'Bb3', 'C4']):
            w.pizz('vla', p, qq + 0.5 * k, 0.46 if k % 2 == 0 else 0.40, dq=0.35)
        w.tri(root, qq, 1.4, 0.5)
        w.pizz('vc', root, qq, 0.52)
        qq += 2.0


# ============================================================================ PLAN-SHORT (12 bars: 2.5.3.2)
def plan_short(w, T, b1):
    """Generic Blueprint for Eps 2-12 (no waltz).  Flute staccato colours the line; the DIAGRAM loops."""
    a, q = w.a, w.q
    o = b1 - 1                                 # local bar n -> w bar n + o
    Q = lambda bar, beat=1.0: q(bar + o, beat)   # noqa: E731
    a.section('PLAN-SHORT: WORD', b1 + w.off, b1 + 2 + w.off)
    a.mark('PLAN-SHORT b1.1 stamp slot (SFX)', (b1 + w.off, 1))
    L = ['F4', 'G4', 'Ab4', 'Bb4', 'C5']
    w.line(list(zip(L, [1, 1, 1, 1, 3])), Q(1, 2), vel=0.62, colour='fl', below=below(L), colour_vel=0.40)
    w.pulse(Q(1, 2), Q(3), PULSE_F, vel=0.35)
    for qq, p in ((Q(1, 2), 'F2'), (Q(2), 'F2'), (Q(2, 3), 'C2')):
        w.pizz('vc', p, qq, 0.52)
        w.tri(nm(p) + 12, qq, 1.5, 0.46)
    w.pad(Q_F[:3], Q(1, 2), Q(2, 3), vel=0.26)
    w.pad(Q_C[:3], Q(2, 3), Q(3), vel=0.26)
    # DIAGRAM (bars 3-7): 20 labels, one per beat; the loop body (G4 at the end leads back to F4)
    a.section('PLAN-SHORT: DIAGRAM (the seamless loop)', b1 + 2 + w.off, b1 + 7 + w.off)
    D = ['F4', 'G4', 'Ab4', 'Bb4',  'C5', 'Bb4', 'Ab4', 'G4',  'Ab4', 'Bb4', 'C5', 'Eb5',
         'D5', 'C5', 'Bb4', 'C5',   'Bb4', 'Ab4', 'G4', None]
    w.line([(p, 1) for p in D], Q(3), vel=0.58, colour='fl', below=below(D), colour_vel=0.38, tick=False)
    for i in range(0, 20, 2):
        if D[i]:
            w.tick(Q(3) + i, 0.22)
    harm = [(Q_F, PULSE_F, 'F2'), (Q_G, PULSE_G, 'G2'), (Q_C, PULSE_C, 'C2'), (Q_D, PULSE_D, 'D2'),
            (Q_G, PULSE_G, 'G2')]
    for k, (c, pl, r) in enumerate(harm):
        b = 3 + k
        w.pulse(Q(b), Q(b + 1), pl, vel=0.35)
        w.pad(c[:3], Q(b), Q(b + 1), vel=0.25)
        w.pizz('vc', r, Q(b), 0.52)
        w.pizz('vc', nm(r) + 7, Q(b, 3), 0.44)
        w.tri(nm(r) + 12, Q(b), 1.6, 0.46)
        w.tri(nm(r) + 19, Q(b, 3), 1.4, 0.40)
    # PLAN (bars 8-10): the path; ticks F G Ab; stop at step 4; hold
    a.section('PLAN-SHORT: PLAN', b1 + 7 + w.off, b1 + 10 + w.off)
    w.pulse(Q(8), Q(10, 3), PULSE_G + PULSE_F, vel=0.38)
    for qq, p in ((Q(8), 'G2'), (Q(8, 3), 'C2'), (Q(9), 'F2'), (Q(9, 3), 'G2'), (Q(10), 'C2')):
        w.pizz('vc', p, qq, 0.5)
        w.tri(nm(p) + 12, qq, 1.5, 0.42)
    w.pad(Q_G[:3], Q(8), Q(9), vel=0.25)
    w.pad(Q_F[:3], Q(9), Q(10), vel=0.25)
    w.pad(Q_C[:3], Q(10), Q(10, 3), vel=0.25)
    for (bb, bt), p in zip([(9, 1), (9, 3), (10, 1)], ['F4', 'G4', 'Ab4']):
        w.box(p, Q(bb, bt), 0.66, dq=1.1, ring=0.55)
        w.n('fl', nm(p) + 12, Q(bb, bt), 0.45, 0.42, art='stac')
        w.box(FOURTH_BELOW[p], Q(bb, bt), 0.40, dq=0.9, duty=0.5, inst='tri2', ring=0.4)
        w.tick(Q(bb, bt), 0.40)
        a.mark(f'PLAN-SHORT tick {p}', a.g.tq(Q(bb, bt)))
    for inst, p in zip(('vc', 'vla', 'vln2', 'vln1'), Q_C):     # step 4?: the title's own stack, held pp
        w.n(inst, p, Q(10, 3), 2.0, 0.16, lp=1800.0, att=0.15, rel=0.2)
    # BREAK (bars 11-12): stuck, tape-stop from b11.3 to b12.3
    a.section('PLAN-SHORT: BREAK', b1 + 10 + w.off, b1 + 12 + w.off)
    stuck(w, Q(11), Q(11, 3) + 2.0, colour='fl', root='C2')         # SHORT jams over C
    a.mark('PLAN-SHORT BREAK: stuck loop', a.g.tq(Q(11)))
    return (w.t(11 + o, 3), w.t(12 + o, 3))


# ============================================================================ PLAN-MICRO (8 bars: 1.3.3.1)
def plan_micro(w, T, b1):
    """The shortest Blueprint (20 s).  Clarinet staccato colours the line; celesta for the ticks."""
    a, q = w.a, w.q
    o = b1 - 1
    Q = lambda bar, beat=1.0: q(bar + o, beat)   # noqa: E731
    a.section('PLAN-MICRO: WORD', b1 + w.off, b1 + 1 + w.off)
    a.mark('PLAN-MICRO b1.1 stamp slot (SFX)', (b1 + w.off, 1))
    L = ['F4', 'G4', 'Ab4']
    w.line(list(zip(L, [1, 1, 1])), Q(1, 2), vel=0.62, colour='cl', colour_oct=0, below=below(L), colour_vel=0.40)
    w.pulse(Q(1, 2), Q(2), PULSE_F, vel=0.35)
    w.pizz('vc', 'F2', Q(1, 2), 0.52)
    w.tri('F3', Q(1, 2), 2.5, 0.46)
    w.pad(Q_F[:3], Q(1, 2), Q(2), vel=0.25)
    a.section('PLAN-MICRO: DIAGRAM', b1 + 1 + w.off, b1 + 4 + w.off)
    D = ['Bb4', 'C5', 'Bb4', 'Ab4', 'G4', 'Ab4', 'Bb4', 'C5', 'Eb5', 'D5', 'C5', None]
    w.line([(p, 1) for p in D], Q(2), vel=0.58, colour='cl', colour_oct=0, below=below(D), colour_vel=0.38)
    for k, (c, pl, r) in enumerate([(Q_F, PULSE_F, 'F2'), (Q_G, PULSE_G, 'G2'), (Q_D, PULSE_D, 'D2')]):
        b = 2 + k
        w.pulse(Q(b), Q(b + 1), pl, vel=0.35)
        w.pad(c[:3], Q(b), Q(b + 1), vel=0.25)
        w.pizz('vc', r, Q(b), 0.52)
        w.tri(nm(r) + 12, Q(b), 1.6, 0.46)
        w.tri(nm(r) + 19, Q(b, 3), 1.4, 0.40)
    a.section('PLAN-MICRO: PLAN', b1 + 4 + w.off, b1 + 7 + w.off)
    w.pulse(Q(5), Q(7, 3), PULSE_G + PULSE_F, vel=0.38)
    for qq, p in ((Q(5), 'G2'), (Q(5, 3), 'C2'), (Q(6), 'F2'), (Q(6, 3), 'G2'), (Q(7), 'C2')):
        w.pizz('vc', p, qq, 0.5)
        w.tri(nm(p) + 12, qq, 1.5, 0.42)
    w.pad(Q_G[:3], Q(5), Q(6), vel=0.25)
    w.pad(Q_F[:3], Q(6), Q(7), vel=0.25)
    w.pad(Q_C[:3], Q(7), Q(7, 3), vel=0.25)
    for (bb, bt), p in zip([(6, 1), (6, 3), (7, 1)], ['F4', 'G4', 'Ab4']):
        w.box(p, Q(bb, bt), 0.66, dq=1.1, ring=0.55)
        w.cel(nm(p) + 12, Q(bb, bt), 0.42, dq=1.4)
        w.box(FOURTH_BELOW[p], Q(bb, bt), 0.40, dq=0.9, duty=0.5, inst='tri2', ring=0.4)
        w.tick(Q(bb, bt), 0.40)
        a.mark(f'PLAN-MICRO tick {p}', a.g.tq(Q(bb, bt)))
    for inst, p in zip(('vc', 'vla', 'vln2', 'vln1'), Q_C):
        w.n(inst, p, Q(7, 3), 2.0, 0.16, lp=1800.0, att=0.15, rel=0.2)
    a.section('PLAN-MICRO: BREAK', b1 + 7 + w.off, b1 + 8 + w.off)
    stuck(w, Q(8), Q(8, 3) + 1.5, colour='cl', root='Bb2')         # MICRO jams over Bb
    a.mark('PLAN-MICRO BREAK: stuck loop', a.g.tq(Q(8)))
    return (w.t(8 + o, 3), w.t(9 + o))


# ============================================================================ the two Scores
def build_picture(stop_beat=None, id_=None):
    """E01-S24 + E01-S25 to picture: 20 bars, 50.000 s, 1200 frames, starting 12:31:00 (sc 24's first frame)."""
    meta = dict(META)
    meta.update(id=id_ or 'e01-s25-the-plan', title='How to Fire a CEO Who Owns Nothing. (E01-S24 + S25, to picture)',
                usage='VI', scenes=['E01-S24 (12:31:00-12:36:00)', 'E01-S25 (12:36:00-13:21:00)'],
                tags=META['tags'] + ['to picture'])
    g = Grid(bpm=96, bars=18, pickup=8)          # P1 = bar -1, P2 = bar 0, the blueprint = bars 1-18
    a = Arr(g)
    T = tracks()
    w = Writer(a, 0)
    tear = (CUE['tear'][0], stop_beat or CUE['tear'][1])
    t_cut, t_stop = w.t(*CUE['waltz_stop']), w.t(*tear)
    T = waltz_tracks(T, t_cut)
    sc24(w, T, -1)
    plan18(w, T)
    t_join, t_end = w.t(*CUE['join']), g.t(19)
    meta['silence_windows'] = [(t_join + 0.01, t_end, 'after the JOIN click: B enters at 13:21:00', -90)]
    meta['sfx_slots'] = [dict(t=CUE['stamp'], sfx='rubber_stamp_C (HOW TO FIRE A CEO WHO OWNS NOTHING.)'),
                         dict(t=CUE['waltz_stop'], sfx='stamp: LEFT EARLIER IN 2023'),
                         dict(t=(CUE['labels'] + 1, 3), sfx='stamp: EQUITY: 0 (HIS TESTIMONY)'),
                         dict(t=(16, 1), sfx='chalk stroke, squeak, snap (25.06)'),
                         dict(t=CUE['join'], sfx='JOIN click (the tape reaches zero here)')]
    meta['audition'] = AUDITION_PICTURE
    a.mark('b17.%g TEAR: tape-stop starts' % tear[1], tear)
    mutes = [(w.t(*CUE['cut']), w.t(*CUE['enter'])),             # the cut + the stamp's beat: digital silence
             (t_cut, w.t(*CUE['resume']))]                       # the waltz's dead stop: the stamp's beat
    posts = stem_posts([(t_stop, t_join, t_end + 10.0)], {'piano': w.t(*CUE['cut'])})
    return Score(meta['id'], g, T, a.notes, markers=a.markers, sections=a.sections, stem_post=posts, mutes=mutes,
                 length_s=t_end, tail_s=0.5, meta=meta)


def build():
    """The album / library suite: the picture cue, PLAN-SHORT, PLAN-MICRO (40 bars, 100 s)."""
    meta = dict(META)
    g = Grid(bpm=96, bars=40)
    a = Arr(g)
    T = tracks()
    w = Writer(a, 2)                             # PLAN bar n = grid bar n + 2 (sc 24 = grid bars 1-2)
    t_cut = w.t(*CUE['waltz_stop'])
    T = waltz_tracks(T, t_cut)
    sc24(w, T, 1)
    plan18(w, T)
    stop1 = (w.t(*CUE['tear']), w.t(*CUE['join']), g.t(21))
    ws = Writer(a, 0)
    s_short = plan_short(ws, T, 21)
    s_micro = plan_micro(ws, T, 33)
    stops = [stop1, (s_short[0], s_short[1], g.t(33)), (s_micro[0], s_micro[1], g.t(41) + 10.0)]
    meta['silence_windows'] = [(stop1[1] + 0.01, g.t(21), 'after the JOIN click', -90),
                               (s_short[1] + 0.01, g.t(33), 'after PLAN-SHORT\'s tape-stop', -90),
                               (s_micro[1] + 0.01, g.t(41), 'after PLAN-MICRO\'s tape-stop', -90)]
    meta['audition'] = AUDITION_SUITE
    meta['sfx_slots'] = [dict(t=w.t(*CUE['stamp']), sfx='rubber_stamp_C'), dict(t=t_cut, sfx='LEFT EARLIER stamp'),
                         dict(t=g.t(21), sfx='PLAN-SHORT stamp slot'), dict(t=g.t(33), sfx='PLAN-MICRO stamp slot')]
    for t0, z, _ in stops:
        a.mark('tape-stop start', t0)
    mutes = [(w.t(*CUE['cut']), w.t(*CUE['enter'])), (t_cut, w.t(*CUE['resume'])),
             (g.t(21), g.t(21, 2)), (g.t(33), g.t(33, 2))]      # the stamp slots
    posts = stem_posts(stops, {'piano': w.t(*CUE['cut'])})
    return Score(meta['id'], g, T, a.notes, loop=g.span(23, 28), markers=a.markers, sections=a.sections,
                 stem_post=posts, mutes=mutes, length_s=g.t(41), tail_s=0.5, meta=meta)


def build_template(which):
    """PLAN-SHORT (12 bars) or PLAN-MICRO (8 bars) as its OWN cue (fix1, 2026-09-26): the generic Blueprints for
    Eps 2-12, written by the same functions as the suite's bars 21-32 / 33-40, with their own masters, stems, MIDI
    and cue sheet (PLAN-SHORT keeps its DIAGRAM loop).  Mastered to the suite's targets (featured -16, album -14)."""
    short = which == 'short'
    nb = 12 if short else 8
    meta = dict(META)
    meta.update(id=f"{META['id']}-plan-{which}", version='1',
                title='How to Fire a CEO Who Owns Nothing. (PLAN-%s)' % which.upper(),
                scenes=['THE PLAN, Eps 2-12: the generic %s Blueprint (%s); re-voice per concept'
                        % ('12-bar' if short else '8-bar', '2.5.3.2, flute' if short else '1.3.3.1, clarinet')],
                motifs=['the Blueprint (%s)' % ('chip music box + flute staccato' if short else
                                                'chip music box + short clarinet'),
                        'three ticks F - G - Ab, the stop at step 4', 'the break: the stuck 2-beat loop over %s, then '
                        'the tape-stop' % ('C' if short else 'Bb')],
                motif_ids=['BLUEPRINT'], tags=META['tags'] + ['template', 'PLAN-%s' % which.upper()])
    g = Grid(bpm=96, bars=nb)
    a = Arr(g)
    T = tracks()
    w = Writer(a, 0)
    t_stop, t_zero = (plan_short if short else plan_micro)(w, T, 1)
    end = g.t(nb + 1)
    a.mark('tape-stop start', t_stop)
    meta['silence_windows'] = ([(t_zero + 0.01, end, 'after the tape-stop (digital silence)', -90)]
                               if end - t_zero > 0.05 else [])
    meta['sfx_slots'] = [dict(t=g.t(1), sfx='the stamp slot (the episode\'s title stamp, SFX)'),
                         dict(t=t_zero, sfx='the tape reaches zero (the episode\'s JOIN / click, if any)')]
    t = lambda b, bt=1: round(g.t(b, bt), 2)          # noqa: E731
    if short:
        meta['audition'] = [f'0-{t(3)} s: the WORD after the stamp slot (b1.1 is left to the SFX)',
                            f'{t(3)}-{t(8)} s: the DIAGRAM (the loop): cheerful for 2 passes without nagging; the '
                            f'x3 preview seams at 12.5 s and 25.0 s',
                            f'{t(9)}-{t(10, 3)} s: three ticks, then the stop at step 4 and the held stack, pp',
                            f'{t(11, 3)}-{t_zero:.2f} s: stuck over C, the tape-stop -- the plan failing, not a '
                            f'playback fault']
    else:
        meta['audition'] = [f'0-{t(2)} s: the WORD (three notes) after the stamp slot',
                            f'{t(6)}-{t(7, 3)} s: three ticks (celesta), the stop, the held stack',
                            f'{t(8)}-{t_zero:.2f} s: stuck over Bb, the tape-stop reaches zero on the last frame']
    mutes = [(g.t(1), g.t(1, 2))]                      # the stamp slot
    posts = stem_posts([(t_stop, t_zero, end + 10.0)], {})
    return Score(meta['id'], g, T, a.notes, loop=g.span(3, 8) if short else None, markers=a.markers,
                 sections=a.sections, stem_post=posts, mutes=mutes, length_s=end, tail_s=0.5, meta=meta)


AUDITION_PICTURE = [
    '0.00-5.00 s (sc 24): the felt Water Line is his, calm and small; the C4 at 2.50 s hangs and the settle never '
    'comes; the cut at 5.00 s is clean (no ring-on), and the chip nudge (1.88 s) is a glint, not a beep',
    '12.50-20.00 s: the waltz is a music box, small and sweet, never a circus; the three risers (G at 15.00, Ab at '
    '15.63, C at 16.25 s) land as DIRE, NOVIHS and DRUH stand; waltz bar 4 (18.13 s) reads as the empty chair',
    '20.00 s: the waltz stops dead under the LEFT EARLIER stamp: a laugh, not a glitch? (the Blueprint resumes 20.63 s)',
    '22.50-25.00 s: Step Four\'s first statement (clarinet + pizz) plants the blank on beat 4 (24.38 s) without menace',
    '37.50-42.50 s: the held chord under "Step four." / "Good question." -- no movement, no swell, dialogue on top',
    '42.50-48.75 s: the stuck G-Ab loop (42.50), then the tape-stop from the tear (46.25) into the JOIN click '
    '(48.75): the plan failing, '
    'not a playback fault; digital silence after it',
]
AUDITION_SUITE = [
    '0-50 s = the Ep1 picture cue (see e01-s25-the-plan.cue.json for its own list)',
    '55.0-67.5 s: PLAN-SHORT\'s DIAGRAM loop (bars 23-27) -- does it stay cheerful for 2 passes without nagging? '
    'check the x3 preview seams at 12.5 s and 25.0 s',
    '50.0-80.0 s vs 80.0-100.0 s: PLAN-SHORT (flute) and PLAN-MICRO (clarinet) sound like the same show voice, '
    'but not the same cue',
    'every tape-stop (48.75, 78.75, 100.0 s): the stop reads as the plan breaking; do three in one album track tire?',
]


# ============================================================================ the tape-stop alternates
def render_alternates(out_dir):
    """s5.A1: the tape-stop with its start on each beat of bar 17, as BREAK INSERTS: the picture cue's underscore
    and album masters from b16.1 (42.5 s into the cue, frame 1020) to the end, to butt onto the main render at b16.1.
    Built through the engine's own masters so the levels match the main render."""
    import shutil
    import soundfile as sf
    from engine.export import build as ebuild, mp3
    tmp = os.path.join(out_dir, '_alt_tmp')
    alt_dir = os.path.join(out_dir, 'alt')
    os.makedirs(alt_dir, exist_ok=True)
    main = {}
    for kind in ('underscore', 'album'):
        x, sr = sf.read(os.path.join(out_dir, f'e01-s25-the-plan-{kind}.wav'), always_2d=True)
        main[kind] = x
    report = []
    for bt in (1, 2, 4):
        sid = f'e01-s25-the-plan-tapestop-b17-{bt}'
        sc = build_picture(stop_beat=bt, id_=sid)
        ebuild(sc, tmp, sid, stems=False, loop=False, previews=False, verbose=False)
        g = sc.grid
        i0 = s2n(g.t(16))
        for kind in ('underscore', 'album'):
            x, sr = sf.read(os.path.join(tmp, f'{sid}-{kind}.wav'), always_2d=True)
            pre = x[:i0]
            ref = main[kind][:i0]
            n = min(len(pre), len(ref))
            r = pre[:n] - ref[:n]
            res = 10 * np.log10((np.mean(r ** 2) + 1e-30) / (np.mean(ref[:n] ** 2) + 1e-30))
            report.append(f'{sid} {kind}: bars -1..15 differ from the main render by {res:.1f} dB')
            wp = os.path.join(alt_dir, f'{sid}-{kind}-from-b16.wav')
            sf.write(wp, x[i0:], sr, subtype='PCM_24')
            mp3(wp, wp.replace('.wav', '.mp3'))                 # fix1: an MP3 of every alternate (for auditioning)
    shutil.rmtree(tmp, ignore_errors=True)
    with open(os.path.join(alt_dir, 'README.txt'), 'w') as fh:
        fh.write('Tape-stop alternates for E01-S25 (OST-BIBLE s5.A1): the stop starts on b17.1, b17.2 or b17.4 '
                 '(the main render starts it on b17.3, where the kit tears the sheet) and always reaches zero on the '
                 'JOIN click, b18.3 = 48.750 s.\nEach file starts at b16.1 = 42.500 s of the cue (12:36:00 + 37.5 s '
                 '= 13:13:12 in the episode); butt it onto the main render at that frame (1020 of the cue).\n'
                 'Each WAV has an MP3 beside it for auditioning (deliver the WAV).\n\n'
                 + '\n'.join(report) + '\n')
    print('\n'.join(report))


if __name__ == '__main__':
    import argparse
    ap = argparse.ArgumentParser()
    ap.add_argument('--no-stems', action='store_true')
    ap.add_argument('--no-loop', action='store_true')
    ap.add_argument('--no-mp3', action='store_true')
    ap.add_argument('--verify-loop', action='store_true')
    ap.add_argument('--only', choices=['suite', 'picture', 'alts', 'templates'], default=None)
    ap.add_argument('--workers', type=int, default=None)
    args = ap.parse_args()
    out = os.path.join(HERE, 'render')
    if args.only in (None, 'picture'):
        build_ = __import__('engine.export', fromlist=['build']).build
        build_(build_picture(), out, 'e01-s25-the-plan', stems=not args.no_stems, loop=False,
               previews=not args.no_mp3, workers=args.workers)
    if args.only in (None, 'suite'):
        build_ = __import__('engine.export', fromlist=['build']).build
        build_(build(), out, META['id'], stems=not args.no_stems, loop=not args.no_loop, previews=not args.no_mp3,
               workers=args.workers, check_loop=args.verify_loop)
    if args.only in (None, 'templates'):
        build_ = __import__('engine.export', fromlist=['build']).build
        for which in ('short', 'micro'):
            sc = build_template(which)
            build_(sc, out, sc.meta['id'], stems=not args.no_stems, loop=not args.no_loop and which == 'short',
                   previews=not args.no_mp3, workers=args.workers, check_loop=args.verify_loop)
    if args.only in (None, 'alts'):
        render_alternates(out)
