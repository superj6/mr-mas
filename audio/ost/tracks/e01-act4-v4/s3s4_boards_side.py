"""E01 Act Four v4 · S3 + S4 · THE BOARD'S SIDE -> WHAT THEY DIDN'T KNOW (MM-09 + 09x re-laid) · act 1298-3302

v4.1 (lock v4.1): the literal frames below and in the code are v4.0 lock frames; w() carries each one onto the new
lock (common.py), and each pulse group moves with its shot as one piece. S4.05 is cut, so the third Step Four's blank
is the drop-out into Neleh's sincere beat when it has no room of its own. v4.2: S3.08 is cut, and the Door over the
GPU choir went with it (the doorway it played over is gone; the cut lands in the 9:32 post's thin window).

Pass one as ONE performance: the procedure never stops, which is the board's side.  Its sections change on the
rails and rooms (a NOON -> a's night bars -> b NOV 18 -> c the boardroom -> d LIGHTHOUSE -> e the lobby camera ->
f TTEMME -> g 11:53 PM -> h "Step four?"), and under every real line, post and card it THINS instead of stopping:
the pulse, the spinner and every melody leave, the B-flat pedal (or the section's own held chord) stays, and the
mix ducks it.  Two designed rests: the four dial tones at the split's opening, and h's hang (the clockwork
pizzicato slows and hangs on one held note: a pedal, not silence).  09x REVERSAL re-enters on the card.

Material and voices are MM-09's (tracks/mm09-the-boards-side: tracks(), step_four(), the pulse cells, the viola
whisper, spinner(), clockwork(), cascade(), the Door, the GPU choir, the Lighthouse, the Addendum and its landing,
Tasya's floor), straight and 0 ms, re-laid by section on grids anchored to the v4 picture.  09x is MM-09's own
notes, moved (k = 1) so the C pickup and the downbeat land on the card.

  act        section  what                                                  v4 picture
  1298-1418  a        Step Four in half notes; the blank = the F bass alone  S3.01 the call goes on ("super.")
  1418-1478           the pulse, the Bb pedal, the viola whisper, the spinner S3.02 the list
  1472-1566           THIN: the pedal + the whisper                          S3.03 the blog post [V]
  1568-1680           the pulse; Neleh's clockwork on "Share what?"          S3.04 Rima
  1680-1748           THIN                                                   S3.05 Gerg's post [V]
  1748-1814           the pulse (no F under the whisper's A3)                S3.06 the all-hands
  1814-1873           THIN                                                   S3.07 "You can call it this way" [V]
  1873-1935           the Door through the door over the GPU choir, ppp      S3.08 the empty doorway
  1921-2053  a night  THIN: the Bb/F pedal and the whisper's G               S3.09 the 9:32 post [V]
  2053-2167  b        the hearts pour over the Db bed; the blue heart        S4.01 the eulogy post [V]
  2167-2531  c        Step Four three times (cl / hn + the Door / vln1)      S4.02-S4.06 the boardroom
  2531-2567           the sincere beat: the solo viola line                  S4.07 Neleh at the blank line
  2567-2591           DESIGNED REST: the four dial tones                     S4.08 the split opens
  2591-2785  d        the Lighthouse on the ring; the Addendum on "some      S4.08 Mario
                      thoughts", CUT by the click; it lands on "How much?"
  2785-2875  e        the landing rings; the low Bb/F fifth                  S4.09 the lobby camera [V]
  2875-2989  f        the straight-mute accent on the spotlight; the pulse;  S4.10-S4.11 Ttemme
                      the hourglass grains
  2991-3153  g        Tasya's floor Abmaj9 -> Cmaj9; the Rhodes on the beats  S4.12-S4.13 11:53 PM, the door,
                      when he appears; THIN under his line                   Tasya's line [V]
  3154-3254  h        the clockwork slows and HANGS on one held C over the    S4.14-S4.15 "Step four?", Mada
                      blank's F bass
  3246-3302  09x      REVERSAL (C pickup -> F, no third) on the card; the    S5.01 WHAT THEY DIDN'T KNOW
                      orchestra cuts at 3302 and one felt F4 answers         S5.02 the home shot
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import *   # noqa: E402,F401,F403

ID = 'e01-act4-v4-s3s4-the-boards-side'
F0, F1 = A('S3.01'), A('S5.02')                    # 1254 -> 3159 (lock v4.1; v4.0 1298 -> 3302)
REV = A('S5.01')                                   # 3254
mm09 = load_track('mm09-the-boards-side')
TASTO = mm09.TASTO
CELLS = dict(mm09.CELLS)
CELLS['NOF'] = ['Bb2', 'Gb3', 'Db3', 'Bb2', 'Eb3', 'Db3', 'C3', 'Eb3']      # no F (under the whisper's A3; rule 12)
ACC = mm09.ACC

# the real lines, posts and cards of pass one: the cue thins inside these (no melodic onsets)
THIN0 = [(1472, 1566, 'the blog post'), (1680, 1748, "Gerg's post"), (1814, 1873, 'ALYI "You can call it this way"'),
         (1924, 2056, 'the 9:32 post'), (2084, 2168, 'the eulogy post'), (2800, 2876, 'the lobby post'),
         (3101, 3154, "TASYA's post read aloud")]
THIN = [(w(a0), w(a1), lab) for a0, a1, lab in THIN0]          # v4.1: the v4.0 windows, carried onto the new lock


def pulse8(a, bar, cell, idx=range(8), vel=0.3, inst='vc', t0=None):
    """one bar of the pulse; t0 (seconds on a's grid) places the group's first eighth there (v4.1: a group moves with
    its shot as one piece, its own eighths unchanged)"""
    first = min(idx)
    for i in idx:
        p = CELLS[cell][i]
        pos = (bar, 1 + 0.5 * i) if t0 is None else t0 + (a.g.at((bar, 1 + 0.5 * i)) - a.g.at((bar, 1 + 0.5 * first)))
        a.n(inst, p, pos, '1/8', vel * ACC[i], lock=True, art='spic')


def build():
    cue = Cue(ID, F0, F1)
    s = cue.s
    T = mm09.tracks()
    fr = lambda sec, f: sec.g.t(1) + (f - sec.anchor) / 24.0   # noqa: E731

    def section(anchor, bars=16, label=None):
        sec = cue.sec(anchor, bars=bars, label=label)
        sec.anchor = anchor
        return sec

    # ================================================================ a NOON (bar 1 = 1298) and a's night bars
    A_ = section(F0, 14, 'a')
    a, g = A_.a, A_.g
    f = lambda x: fr(A_, x)   # noqa: E731
    mm09.step_four(a, 1, top='hn', vel=0.25, blank=True, top_vel=0.15)        # the call goes on (Bbm(add9) ...)
    a.n('cb', 'Bb1', (1, 1), '1/8', 0.42, lock=True, art='pizz')
    a.ch('harm', ['Bb3', 'F4'], (1, 1), 1.2, 0.3, lock=True)
    rebow(a, 'cb', 'Bb1', f(w(1418)), f(w(2066)), 0.2, seg=5.0, xf=1.0, first_att=0.4, art='sus', lp=700)   # the Bb pedal
    a.n('cb', 'Bb1', f(w(1418)), '1/8', 0.36, lock=True, art='pizz')
    for f0_, f1_, p in [(1418, 1508, 'Db4'), (1508, 1568, 'C4'), (1568, 1628, 'B3'), (1628, 1718, 'Bb3'),
                        (1718, 1808, 'A3'), (1808, 1898, 'Ab3')]:                # the viola whisper, falling
        a.n('vla', p, f(w(f0_)), f(w(f1_)) - f(w(f0_)) + 0.05, 0.2, lock=True, art='sus', lp=TASTO, att=0.35)
    rebow(a, 'vla', 'G3', f(w(1898)), f(w(2060)), 0.19, seg=6.0, xf=1.0, first_att=0.35, art='sus', lp=TASTO)
    # v4.1: each pulse group, the spinner and the clockwork keep their v4.0 place in their shot (warped by the group's
    # first note), so they still sit where they were written against the picture
    bf = lambda bar, beat=1.0: 1298 + (bar - 1) * 60 + (beat - 1) * 15   # noqa: E731  (a v4.0 bar -> its v4.0 frame)
    pw_ = lambda bar, beat=1.0: f(w(bf(bar, beat)))                      # noqa: E731
    pulse8(a, 3, 'A', t0=pw_(3))
    pulse8(a, 5, 'A', idx=range(4, 8), t0=pw_(5, 3))
    pulse8(a, 6, 'B9', idx=range(2, 8), vel=0.27, t0=pw_(6, 2))                  # yields to Neleh's clockwork
    pulse8(a, 7, 'C', idx=range(0, 3), vel=0.27, t0=pw_(7))
    pulse8(a, 8, 'NOF', idx=range(4, 8), t0=pw_(8, 3))
    pulse8(a, 9, 'NOF', idx=range(0, 5), t0=pw_(9))
    mm09.spinner(a, pw_(3), 5, 0.2)                                              # Mada's spinner, out for the post
    mm09.clockwork(a, f(L_in('a4-27-23') + 2), 'F5', 0.27)                   # NELEH (O.S.) "Share what?"
    a.mark('a: Step Four (the Rewind lands)', (1, 1))
    a.mark('a: Neleh clockwork on "Share what?"', (6, 1))
    # the doorway: the Door through the door over the GPU choir, ppp, after his real line
    # v4.2: S3.08 (the empty doorway) is cut, so the cut goes from Alyi's line straight to the 9:32 post (a thin
    # window): no Door melody and no 0.7 s choir blip there; the Bb pedal and the whisper carry the cut
    if 'S3.08' in SH:
        d0 = f(w(1873))
        b = g.beats_s(1, d0)
        a.n('door', 'Ab4', d0, 2 * b, 0.42, lock=True, art='nv')
        a.n('door', 'Db5', d0 + 2 * b, 1.7 * b, 0.42, lock=True, art='nv')
        for inst, v in (('choir', 0.3), ('reed', 0.24)):
            for p in chord_of('GPU_CHOIR'):
                a.n(inst, p, d0, f(w(1938)) - d0, v, lock=True, env=[(0, 0.0), (0.4, 1.0), (f(w(1938)) - d0 - 0.5, 1.0),
                                                                  (f(w(1938)) - d0, 0.0)])
        a.mark('a: the Door (the empty doorway)', d0)
    # a's night bars: the Bb pedal gains its fifth; the whisper holds its G (the 9:32 post is read over it)
    rebow(a, 'vc', 'F2', f(w(1921)), f(w(2066)), 0.17, seg=6.0, xf=1.0, first_att=0.8, art='sus', lp=TASTO)
    A_.commit()

    # ================================================================ b NOV 18, the hearts (bar 1 = 2053)
    B = section(A('S4.01'), 6, 'b')
    a, g = B.a, B.g
    f = lambda x: fr(B, x)   # noqa: E731
    L = f(w(2178)) - f(w(2053))
    for inst, p, v in (('vc', 'Db3', 0.22), ('vla', 'Ab3', 0.2), ('vln2', 'F4', 0.16)):
        a.n(inst, p, f(w(2053)), L, v, lock=True, art='sus', lp=TASTO, env=mm09.sw_env(L, 0.7, 1.0))
    a.n('cb', 'Db2', f(w(2053)), L, 0.2, lock=True, art='sus', lp=700, att=0.5)
    mm09.cascade(a, f(w(2053)), f(w(2085)), dens0=5.0, dens1=10.0, vel0=0.28, vel1=0.4)
    a.n('harm', 'Db6', f(M('S4.01', 'blue')), 1.0, 0.3, lock=True, env=[(0, 1.0), (0.9, 0.35), (1.6, 0.0)])
    a.mark('b: the hearts pour', f(w(2053)))
    a.mark('b: the blue heart', f(M('S4.01', 'blue')))
    B.commit()

    # ================================================================ c the boardroom at night (bar 1 = 2167)
    C = section(A('S4.02'), 10, 'c')
    a, g = C.a, C.g
    f = lambda x: fr(C, x)   # noqa: E731
    mm09.step_four(a, 1, top='cl', vel=0.22, top_vel=0.24)
    a.n('cb', 'Bb1', (1, 1), '1/8', 0.34, lock=True, art='pizz')
    mm09.step_four(a, 3, top='hn', vel=0.18, top_vel=0.13)
    place_motif(a, 'door', 'DOOR', (3, 3), vel=0.5, lock=True, art='nv')           # on Alyi's reflected lines
    bl = f(A('S4.07')) - g.at((6, 3))                      # v4.1: S4.05 is cut, so the third blank may have no room;
    mm09.step_four(a, 5, top='vln1', vel=0.2, blank=bl > 0.3, blank_len=bl if bl > 0.3 else None)   # then the drop-out IS the blank
    a.seq('cl', [('Db4', (5, 1), '2b'), ('C4', (5, 3), '1b'), ('B3', (5, 4), '1b'), ('Bb3', (6, 1), '1.9b')],
          vel=0.21, lock=True, art='sus')
    a.mark('c: Step Four x3', (1, 1))
    C.commit()
    SB = section(A('S4.07') + 0, 3, 'c: the sincere beat')                       # bar 1 = 2531
    a = SB.a
    a.seq('svla', [('F4', (1, 1), '1b', 0.5), ('Eb4', (1, 2), '1b', 0.48)], lock=True, art='sus')
    a.n('svla', 'Db4', (1, 3), '0.6b', 0.46, lock=True, art='sus', rel=0.55)     # it decays into the dial-tone rest
    mm09.step_four(a, 1, top=None, inner=('vla', 'vln2', 'vln1'), vel=0.13, unit=1.0, blank=False)
    for n in a.notes:                                                            # out before the dial tones
        if n.inst in ('vla', 'vln2', 'vln1'):
            n.dur = min(n.dur, SB.g.t(1) + (A('S4.08') - A('S4.07')) / 24.0 - n.start)
            n.x['rel'] = 0.45
    a.mark('c: the sincere beat (the solo viola)', (1, 1))
    SB.commit()

    # ================================================================ d LIGHTHOUSE (bar 1 = 2591, the ring)
    D = section(M('S4.08', 'ring'), 6, 'd')
    a, g = D.a, D.g
    f = lambda x: fr(D, x)   # noqa: E731
    click = f(M('S4.08', 'click'))
    ns = place_motif(a, 'marimba', 'LIGHTHOUSE', (1, 1), vel=0.34, lock=True)   # one 3-bar cycle, ring to the cut
    ns += place_motif(a, 'harp', 'LIGHTHOUSE', (1, 1), vel=0.26, lock=True)
    for n in ns:
        if n.start >= click - 1e-6:
            n.vel *= 0.72                                                       # the beam dims after the click
    a.n('celesta', 'F5', (1, 1), '1b', 0.2, lock=True)
    rebow(a, 'vc', 'Bb2', g.t(1), f(w(2745)), 0.22, seg=4.5, xf=0.8, first_att=0.3, art='sus', lp=TASTO)
    a.mark('d: the Lighthouse on the ring', (1, 1))
    add0 = f(W('a4-27-14', 'thoughts'))                                         # the Addendum on "some thoughts"
    qa0 = len(a.notes)
    place_motif(a, 'svln', 'ADDENDUM', add0, vel=0.52, lock=True, art='sus', rel=0.25)
    a.seq('vla', [('F3', add0, '4b')], vel=0.22, lock=True, art='sus', rel=0.05)
    a.seq('cb', [('Bb1', add0, '4b', 0.18)], lock=True, art='sus', lp=500, rel=0.2)
    for n in a.notes[qa0:]:                                                     # the click CUTS it
        if n.start >= click:
            n.vel = 0.0
        n.dur = max(0.02, min(n.dur, click - n.start))
        n.x['rel'] = 0.03
    a.notes = [n for n in a.notes if n.vel > 0.0]
    a.mark('d: the Addendum (cut by the click)', add0)
    # "How much?": the tail finally lands -- deceptively (Gbmaj9, Db5 on top): sold, not resolved
    t1, t2, t3 = f(w(2741)), f(w(2756)), f(w(2763.5))
    a.seq('svln', [('Gb4', t1, t2 - t1, 0.46), ('Ab4', t2, t3 - t2, 0.48), ('Db5', t3, '2.6b', 0.5)],
          lock=True, art='sus', rel=0.6)
    a.seq('vla', [('Gb3', t1, t3 - t1), ('F3', t3, '2.6b')], vel=0.22, lock=True, art='sus', rel=0.6)
    a.seq('vc', [('Eb2', t1, t3 - t1), ('Gb2', t3, '2.6b')], vel=0.22, lock=True, art='sus', rel=0.6)
    a.seq('cb', [('Eb1', t1, t3 - t1), ('Gb1', t3, '2.6b')], vel=0.17, lock=True, art='sus', lp=700, rel=0.6)
    a.mark('d: "How much?" -- the tail lands (sold)', t3)
    D.commit()

    # ================================================================ e the lobby camera (the post: thin)
    Ex = section(A('S4.09'), 3, 'e')
    a = Ex.a
    f = lambda x: fr(Ex, x)   # noqa: E731
    rebow(a, 'cb', 'Bb1', f(w(2790)), f(w(2885)), 0.2, seg=5.0, first_att=1.0, art='sus', lp=700)
    rebow(a, 'vc', 'F2', f(w(2790)), f(w(2885)), 0.16, seg=5.0, first_att=1.2, art='sus', lp=TASTO)
    Ex.commit()

    # ================================================================ f TTEMME (bar 1 = 2875, the spotlight)
    Fs = section(A('S4.10'), 4, 'f')
    a, g = Fs.a, Fs.g
    f = lambda x: fr(Fs, x)   # noqa: E731
    a.n('cb', 'Bb1', (1, 1), '1/8', 0.34, lock=True, art='pizz')
    a.seq('tpt', [('F4', (1, 1), '1/8', 0.23), ('Bb4', (1, 1.5), '1.5b', 0.22)], lock=True, art='straight', rel=0.3)
    pulse8(a, 1, 'A', vel=0.26)
    pulse8(a, 2, 'D', idx=range(0, 7), vel=0.24)
    rebow(a, 'cb', 'Bb1', f(w(2890)), f(w(2999)), 0.18, seg=5.0, first_att=0.5, art='sus', lp=700)
    for i, (inst, p) in enumerate([('vln1', 'F5'), ('vln2', 'Db5'), ('vla', 'C5'), ('vln1', 'Bb4')]):
        a.n(inst, p, f(w(2944)) + i * g.beats_s(1, 0.0), 0.3, 0.33 - 0.012 * i, lock=True, art='pizz')   # the grains
    a.mark('f: the spotlight (straight-mute accent)', (1, 1))
    a.mark('f: the hourglass (one grain a beat, falling)', f(w(2944)))
    Fs.commit()

    # ================================================================ g 11:53 PM, Tasya's floor
    G = section(M('S4.12', 'slate'), 5, 'g')
    a, g = G.a, G.g
    f = lambda x: fr(G, x)   # noqa: E731
    t_ab, t_c, t_end = f(w(2991)), f(M('S4.12', 'open')), f(w(3154))
    d1 = t_c - t_ab + 0.6
    for inst, p in (('vc', 'Ab2'), ('vla', 'Eb3'), ('vln2', 'G3'), ('vln1', 'C4')):
        a.n(inst, p, t_ab, d1, 0.26, lock=True, art='sus', lp=TASTO, env=mm09.sw_env(d1, 0.6, 0.6))
    a.n('cb', 'Ab1', t_ab, d1, 0.2, lock=True, art='sus', lp=800, env=mm09.sw_env(d1, 0.6, 0.6))
    d2 = t_end - t_c
    for inst, p in (('vc', 'C3'), ('vla', 'G3'), ('vln2', 'B3'), ('vln1', 'D4')):
        a.n(inst, p, t_c, d2, 0.26, lock=True, art='sus', lp=TASTO, env=mm09.sw_env(d2, 0.7, 0.45), rel=0.4)
    a.n('cb', 'C2', t_c, d2, 0.2, lock=True, art='sus', lp=800, env=mm09.sw_env(d2, 0.7, 0.45), rel=0.4)
    for k in range(4):                                                          # Tasya: the Rhodes on the beats
        a.ch('rhodes', ['E3', 'G3', 'B3', 'D4'], f(w(3049)) + k * g.beats_s(1, 0.0), '0.8b', 0.4 if k else 0.44, lock=True)
    a.mark('g: Tasya\'s floor (Abmaj9 on the slate)', t_ab)
    a.mark('g: Cmaj9 (the door opens)', t_c)
    a.mark('g: the Rhodes (Tasya appears)', f(w(3049)))
    G.commit()

    # ================================================================ h "Step four?": the clockwork slows and hangs
    H = section(A('S4.14'), 4, 'h')
    a, g = H.a, H.g
    f = lambda x: fr(H, x)   # noqa: E731
    q = M('S4.14', 'q')                                                          # 3172 = "Step four?"
    for p, fr_ in zip(['F5', 'C5', 'Ab4', 'C5', 'G5', 'C5'], [3154, 3157, 3160.5, 3164.5, 3169, 3174]):
        a.n('vln1', p, f(w(fr_)), 0.3, 0.3 if fr_ == 3154 else 0.26, lock=True, art='pizz')
    pk_f = REV - 7.5                                                             # 09x's C pickup (an eighth before)
    a.n('svln', 'C5', f(w(3172)), f(pk_f) - f(w(3172)) + 0.02, 0.32, lock=True, art='sus', att=0.25, lp=2600, rel=0.25)
    a.n('vc', 'F2', f(w(3170)), f(pk_f) - f(w(3170)), 0.24, lock=True, art='sus', lp=TASTO, att=0.3, rel=0.3)
    a.n('cb_f1', 'F1', f(w(3170)), f(pk_f) - f(w(3170)), 0.2, lock=True, art='sus', lp=900, att=0.3, rel=0.3)
    a.mark('h: the clockwork winds down', f(w(3154)))
    a.mark('h: the hang (one held C over the blank F)', f(q))
    H.commit()

    # ================================================================ 09x: MM-09's own notes, on the card
    src = mm09.build()
    x09 = mm09.SEC_NOTES['09x']
    H45 = 110.0                                                                  # source b45.1
    cue.notes.extend(remap(x09, 109.6, 112.49, s(REV) - (H45 - 109.6), drop={'felt'}))
    cue.a.n('felt', 'F4', s(F1), g.beats_s(3, 0.0), 0.42, lock=True)             # the door back: his room first
    cue.mark(REV, '09x: REVERSAL (the card)')
    cue.mark(F1, '09x: the felt F4 (the door back)')

    # ---------------------------------------------------------------- thin under the real lines (compose-level)
    melodic = {'vc', 'vln1', 'vln2', 'harm', 'harp', 'marimba', 'celesta', 'tpt', 'rhodes', 'door', 'svln', 'cl', 'hn'}
    keep = []
    for n in cue.notes:
        fa = F0 + n.start * 24
        inside = any(w0 <= fa < w1 for w0, w1, _ in THIN)
        short = n.dur < 0.9 or n.x.get('art') in ('spic', 'pizz')
        if inside and n.inst in melodic and short:
            continue
        keep.append(n)
    cue.notes[:] = keep
    # the orchestra cuts on the card's extra beat (the felt answers); the REVERSAL rides at -9 dB (MM-09's macro)
    FB = s(F1)
    cut = [(0.0, 0.0), (FB - 0.004, 0.0), (FB, -120.0), (FB + 30, -120.0)]
    stem_auto = {k: cut for k in ('strings', 'winds', 'brass', 'perc', 'chip', 'bass')}
    pk = s(REV) - 0.3125
    macro = [(0.0, 0.0), (pk - 0.06, 0.0), (pk - 0.03, mm09.REV_DB), (FB + 30, mm09.REV_DB)]
    for lab, a0, a1 in [('a NOON', 1298, 1921), ("a's night bars", 1921, 2053), ('b NOV 18 hearts', 2053, 2167),
                        ('c the boardroom', 2167, 2567), ('rest: the dial tones', 2567, 2591), ('d LIGHTHOUSE', 2591, 2785),
                        ('e the lobby camera', 2785, 2875), ('f TTEMME', 2875, 2989), ('g 11:53 PM', 2989, 3154),
                        ('h Step four? (the hang)', 3154, None), ('09x REVERSAL', None, None)]:
        a0 = REV if a0 is None else w(a0)
        a1 = (REV if lab.startswith('h') else F1) if a1 is None else w(a1)
        cue.section(lab, a0, a1)
    for w0, w1, lab in THIN:
        cue.mark(w0, f'thin: {lab}')
    meta = base_meta(
        ID, "The Board's Side / What They Didn't Know (Ep1 Act Four v4, S3 + S4, to picture)", mm='MM-09',
        family='P02 PROCEDURE + P08 OUTS KIT (09x: REVERSAL)',
        tone="their side as one procedure that never stops and a fourth step that is always blank; then the door back",
        scenes=[f'v4 S3.01-S5.01 (+ the felt on S5.02), act {F0}-{F1}; file t=0 = act frame {F0}'],
        motifs=['STEP_FOUR', 'NELEH_CLOCKWORK', 'MADA_SPINNER', 'DOOR', 'GPU_CHOIR', 'LIGHTHOUSE', 'ADDENDUM + landing',
                'HOURGLASS', 'TASYA_FLOOR', 'REVERSAL'],
        motif_ids=['STEP_FOUR', 'DOOR', 'LIGHTHOUSE', 'NELEH_CLOCKWORK'],
        key='B-flat minor centre; Db lydian (Alyi); Abmaj9 -> Cmaj9 (Tasya); F(add9) no third (09x)',
        underscore_lufs=-20.0, album_lufs=-16.0,
        no_third_windows=[(s(REV) + 0.1, FB - 0.02)],
        sfx_slots=[dict(t=s(M('S4.08', 'tones')), sfx='four dial tones (the designed rest)'),
                   dict(t=s(M('S4.08', 'click')), sfx='*Click.* (cuts the Addendum)'),
                   dict(t=s(REV), sfx='the card (the REVERSAL owns it)')],
        audition=[f'the whole file: one procedure, never stopping -- does it ever feel like a loop that nags?',
                  f'{s(w(1472)):.1f}, {s(w(1680)):.1f}, {s(w(1814)):.1f}, {s(w(1924)):.1f} s: the pulse leaves for each real post '
                  'and line and the pedal holds: thin, not a hole?',
                  f'{s(w(2567)):.1f}-{s(w(2591)):.1f} s: the dial-tone rest, then the Lighthouse on the ring',
                  f'{s(M("S4.08", "click")):.1f} s: the click cuts the Addendum; {s(w(2763.5)):.1f} s: the landing on '
                  '"How much?" (sold)',
                  f'{s(w(3154)):.1f}-{s(REV):.1f} s: the clockwork winds down and hangs on one held C: an ending, not a stall?',
                  f'{s(REV):.1f} s: the REVERSAL on the card; {FB:.1f} s the cut to one felt F4'])
    return Score(ID, cue.g, T, cue.notes, markers=cue.markers, sections=cue.sections, stem_auto=stem_auto,
                 macro=macro, mutes=cue.mutes, length_s=FB + 2.6, tail_s=2.0, meta=meta)


if __name__ == '__main__':
    render_cli(build, __file__)
