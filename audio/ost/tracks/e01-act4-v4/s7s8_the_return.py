"""E01 Act Four v4 · S7 + S8 · THE RETURN -> THE LOBBY, AND AFTER (MM-11 + the STRAIGHT violin, re-laid) · act 4690-6453 (v4.0), 4398-6066 (v4.1)

v4.1 (lock v4.1): S7.02 is an establishing wide and Tasya's line moves to his own MCU (S7.02b), so the violin's decay is
longer; Tasya's pad now PRE-LAPS under the decay from the wide (the audit measured a 0.35 s drop-out at the hand-off),
takes a chord on each of "below / above / around", blooms, and holds under "hi." / "Hello." (one MCU now). S7.12 is
cut, so the 8-note Build "while he reads" is gone (it would have sat under a post); the Build's 4-note pickup still
leads into the sign. Every frame is a lock anchor now (v4.0's literal frames are gone).

One relay, as MM-11 is: other people's sounds hand him back his company, and his felt returns last.  v4 keeps one dead
stop in the span ("Terms?", stop 4) and makes every other join a decay, a crossfade or a pre-lap:

  act        what                                                              v4 picture
  4698       the STRAIGHT violin (senza vibrato), the Door an octave down,     S7.01 Alyi's post [V] (the violin
             under Alyi's post                                                 IS the thinned colour)
  4793       on the first heart it HOLDS its G and decays (~2.5 s) under the   the three hearts, the IOU
             three hearts
  4865-4905  Tasya's floor as a soft PAD with silent attacks, one chord on     S7.02 "below / above / around them"
             each word: Abmaj9 (below) -> Cmaj9 (above) -> Emaj9 (around)      [V/K]: no melody, no hit on the line
  4930       the floor blooms: the Rhodes on the beats (the key ring owns      after the line
             the offbeats), celesta
  4975-5030  Emaj9 held: nothing moves under "hi." / "Hello."                  S7.03-S7.04
  5030       home to Abmaj9 (the landlord's last word), ringing under the rail  S7.05 NOV 21
  5050-5092  c1 LEVERAGE fades in under Mada among the fires (crossfading from   S7.05
             the floor) so the door bang (5097) lands INSIDE it
  5097-5275  LEVERAGE through the held wide: the bang, the FULL FREEZE card     S7.06
             (its downbeat left to the freeze hit), the pull, the look-around
  5275       STOP 4: "Terms?" -- the long hold plays in the room               S7.07-S7.09
  5412       c2: the stamp's low C pedal (the dominant, leading on); it carries  S7.09 stamp, S7.10 the term sheet,
             the term sheet and holds (thinned) under Gerg's and Ttemme's posts  S7.11 / S7.13 posts [V]
  5580       the Build: 8 notes while he reads                                 S7.12
  5712-5728  THE BUILD'S ONE REST: the sand's held beat                        S7.13 the shatter
  5728       the Build's 4-note pickup into the sign                           the fall
  5748       VICTORY LAP: one brass stab (Abmaj9), timpani, the Build at full    S8.01 the sign
  5808       the band cuts to one chip note (tails too)                        S8.02 the box of zeros
  5815-5890  a chip F pedal; the 1-bit flat line F F F as ONE TENUTO phrase     S8.03 the dialog greys out
             under the greying; out on the bonk (SFX)
  5890-5995  THE QUIET (designed): the lobby's neon buzz under the CU          S8.04
  5995/6005  after "okay.": the felt C4 -> F4, an open fifth (his felt, last)   S8.05
  6000-6453  the vault's F: a soft drone pedal (TEMP for MM-12) with the        S8.06-S8.10 the coda
             server_hum SFX, thinned to the hum alone under the memo
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import *   # noqa: E402,F401,F403
from engine.core import FAMILIES   # noqa: E402

ID = 'e01-act4-v4-s7s8-the-return'
F0, F1 = A('S7.01'), ACT_FRAMES                 # 4690 -> 6453
mm11 = load_track('mm11-the-return')
sys.path.insert(0, os.path.join(OST, 'tracks', 'mm11-the-return'))
from senza import prewarm   # noqa: E402

SP = dict(
    post=L_in('a4-30-01'), heart1=M('S7.01', 'heart1'),
    below=W('a4-30-02', 'below'), above=W('a4-30-02', 'above'), around=W('a4-30-02', 'around'),
    line_out=L_out('a4-30-02'), bloom=L_out('a4-30-02') + 6, hi=L_in('a4-30-03'), hello_out=L_out('a4-30-04'), home=A('S7.05') - 6,
    pad0=A('S7.02') + 8,
    c1=M('S7.06', 'freeze') - 75, bang=M('S7.06', 'bang'), card=M('S7.06', 'freeze'), terms=L_in('a4-30-07'), stamp=M('S7.09', 'stamp'),
    sand=M('S7.13', 'shatter'), fall=M('S7.13', 'fall'), sign=M('S8.01', 'ignite'),
    plates=A('S8.02'), dialog=M('S8.03', 'dialog'), grey1=M('S8.03', 'grey1'), grey2=M('S8.03', 'grey2'),
    bonk=M('S8.03', 'click'), okay_out=L_out('a4-30-12'), vault=A('S8.06'),
)


def build():
    cue = Cue(ID, F0, F1, swing=1.0)
    s = cue.s
    a, g = cue.a, cue.g
    T = mm11.tracks()
    prewarm(['Ab3', 'Db4', 'C4', 'G3'], vels=(0.5,))
    S = lambda k: s(SP[k])   # noqa: E731
    b = g.beats_s(1, 0.0)
    # ---------------------------------------------------------------- a: the STRAIGHT violin, then its decay
    t0 = S('post')
    for p, k, nb in [('Ab3', 0, 2), ('Db4', 2, 2), ('C4', 4, 1)]:
        a.n('svln_nv', p, t0 + k * b, nb * b + 0.03, 0.5, rel=0.14)
    tg = t0 + 5 * b
    h1 = S('heart1') - tg                                                        # held; on the first heart it decays
    dec = S('below') - S('heart1') - 0.05                                        # ... into Tasya's pad on "below"
    a.n('svln_nv', 'G3', tg, h1 + dec, 0.5, rel=0.5)
    hh = S('heart1')                                                             # (a track ride: the senza voice is a
    T['svln_nv'].auto = [(0.0, 1.0), (hh, 1.0), (hh + 0.35 * dec, 0.55), (hh + 0.7 * dec, 0.28),   # 'fn' source)
                         (hh + dec, 0.12), (hh + dec + 0.6, 0.0), (1e4, 0.0)]
    cue.mark(SP['post'], 'a: the violin (the Door, STRAIGHT)')
    cue.mark(SP['heart1'], 'a: the first heart: the G held, decaying')
    # ---------------------------------------------------------------- b: Tasya's floor (pad on the words, then the bloom)
    AB = (['G3', 'Bb3', 'C4', 'Eb4'], 'Ab1', ['Ab2', 'Eb3'], 'Bb3')
    CM = (['G3', 'B3', 'D4', 'E4'], 'C2', ['C3', 'G3'], 'D4')
    EM = (['G#3', 'B3', 'D#4', 'F#4'], 'E2', ['B2', 'E3'], 'F#4')
    steps = [(S('pad0'), S('above'), AB, 1.6), (S('above'), S('around'), CM, 0.7), (S('around'), S('home'), EM, 0.7),
             (S('home'), s(A('S7.05') + 38), AB, 0.6)]                        # v4.1: the first chord pre-laps from the wide
    for i, (a0, a1, (rh, cb, vc, vla), att) in enumerate(steps):
        dur = a1 - a0 + (0.35 if i < 3 else 0.0)
        rel = 0.35 if i < 3 else 1.1
        v = 0.36 if i < 3 else 0.33
        art.sus(a, 'cb', [cb], a0, dur, vel=v + 0.02, att=att, lp=2000, rel=rel)
        art.sus(a, 'vc', vc, a0, dur, vel=v, att=att, lp=2200, rel=rel)
        art.sus(a, 'vla', [vla], a0, dur, vel=v - 0.05, att=att + 0.2, lp=2400, rel=rel)
    # the bloom after the line: the Rhodes on the beats (Emaj9), then held under "hi." / "Hello."
    nb = 0
    for k in range(3):
        if S('bloom') + (k + 1) * b > S('home') + 0.02:
            break
        a.ch('rhodes', EM[0], S('bloom') + k * b, b * 0.92, 0.44 if k == 0 else 0.36, roll=0.004)
        nb = k + 1
    if S('home') - (S('bloom') + nb * b) > 0.15:
        a.ch('rhodes', EM[0], S('bloom') + nb * b, S('home') - (S('bloom') + nb * b), 0.34, roll=0.004)
    a.n('celesta', 'D#6', S('bloom'), 2 * b, 0.3)
    a.ch('rhodes', AB[0], S('home'), s(A('S7.05') + 34) - S('home'), 0.38, roll=0.004)   # home: the landlord's last word
    a.n('celesta', 'G5', S('home'), 2 * b, 0.28)
    T['rhodes'].pedal = [(0.0, False)]
    cue.mark(SP['pad0'], 'b: the floor pre-laps as a pad (Abmaj9) under the violin\'s decay')
    cue.mark(SP['below'], 'b: "below" (inside the Abmaj9)')
    cue.mark(SP['bloom'], 'b: the bloom (the Rhodes on the beats)')
    cue.mark(SP['home'], 'b: home (Abmaj9)')
    # ---------------------------------------------------------------- c1: LEVERAGE, fading in under Mada among the fires
    c1, t_out, card = S('c1'), S('terms'), S('card')
    e8 = g.beats_s(0.5, c1)
    fade_end = s(A('S7.06') + 2)
    fade = lambda t: min(1.0, 0.35 + 0.65 * max(0.0, (t - c1) / (fade_end - c1)))   # noqa: E731
    # v4.2 (the MM-11 fix 2b handoff, SHOWRUNNER-NOTES): the F pedal re-bowed every 2 bars (one held note outlasted its
    # 6.5 s sample, leaving the pizz over no F), and the cello pizz on its own notched track below
    mm11.held_pedal(a, g, 'cb', 'F2', c1, t_out + 0.2, vel=0.4, att=1.4, lp=1800, rel=0.2)    # the F pedal
    cells = [['F2', 'C3', 'Ab2', 'F2', 'C3', 'Ab2', 'Db3', 'C3'], ['F2', 'C3', 'Bb2', 'F2', 'C3', 'Bb2', 'Eb3', 'C3'],
             ['F2', 'Db3', 'Ab2', 'F2', 'Db3', 'Ab2', 'C3', 'Bb2'], ['F2', 'C3', 'Ab2', 'F2', 'C3', 'Ab2', 'Gb2', 'Ab2']]
    n8 = int(round((t_out - c1) / e8))
    for j in range(n8):
        t = c1 + j * e8
        if t >= t_out - 0.02:
            break
        if abs(t - card) < 0.05:                              # the freeze hit owns the card's downbeat
            continue
        i = j % 8
        p = cells[(j // 8) % 4][i]
        acc = 1.0 if i in (0, 3, 6) else 0.78
        inst = 'vc_lev' if (i in (0, 3) or p in ('F2', 'Gb2', 'Ab2', 'Bb2')) else 'vla'   # v4.2: MM-11's notched LEVERAGE pizz track
        art.pizz(a, inst, p, t, vel=0.44 * acc * fade(t), lock=True)
        if i in (1, 4, 7) and ((j // 8) + i) % 3 != 0 and t > fade_end:
            a.n('noise', 60, t, 0.03, 0.18 + 0.05 * (((j // 8) + i) % 3), lock=True, clock=18000 + 4000 * (i % 3),
                dec=0.02, sus=0.0, rel=0.02)
    clusters = [['C3', 'Db3', 'Eb3'], ['B2', 'C3', 'Db3'], ['C3', 'Db3', 'D3'], ['C3', 'Db3', 'Eb3'], ['Bb2', 'C3', 'Db3']]

    def thud(t, v=0.62):
        a.n('k808', 'F1', t, 0.4, v, lock=True, decay=0.35, punch=6.0, drive=1.2, click=0.05)
        a.n('bdrum_muted', 60, t, 0.2, v * 0.55, lock=True)
    bang = S('bang')
    thud(bang, 0.55)                                          # under the bang
    a.ch('grand', clusters[-1], bang, b, 0.26, lock=True)
    k = 0
    tb = card                                                  # then bars of 4 beats from the card, uneven hits
    bar = 0
    while tb < t_out - 0.1:
        for bt in ((0.0, 2.5) if bar % 2 == 0 else (0.0,)):
            t = tb + bt * b
            if t >= t_out - 0.05:
                continue
            if abs(t - card) < 0.05:
                t += e8                                        # step off the freeze hit
            thud(t)
            if bt == 0.0:
                a.ch('grand', clusters[k % len(clusters)], t, 3 * b, 0.3, lock=True)
                k += 1
        tb += 4 * b
        bar += 1
    cue.mute(SP['terms'], SP['stamp'])                          # STOP 4: "Terms?" -- the long hold plays in the room
    cue.mark(SP['c1'], 'c1: LEVERAGE fades in')
    cue.mark(SP['bang'], 'c1: the door bang (inside the cue)')
    cue.mark(SP['terms'], 'STOP 4: "Terms?"')
    # ---------------------------------------------------------------- c2: the stamp's C pedal (it holds under the posts)
    st, sand = S('stamp'), S('sand')
    rebow(a, 'cb', 'C2', st, sand, 0.44, seg=5.0, xf=1.0, first_att=0.35, last_rel=0.25, art='sus', lp=1800)
    rebow(a, 'vc', 'C3', st, sand, 0.38, seg=5.0, xf=1.0, first_att=0.5, last_rel=0.25, art='sus', lp=2200)
    rebow(a, 'vla', 'G3', st + 1.0, sand, 0.2, seg=5.0, xf=1.0, first_att=1.2, last_rel=0.25, art='sus', lp=1800)
    cue.mark(SP['stamp'], 'c2: the stamp: the low C pedal')
    # ---------------------------------------------------------------- d: the Build's pickup (v4.1: the 8 notes "while
    # he reads" went with S7.12; under the posts the C pedal holds alone)
    pick = S('sign') - b                                       # the pickup lands on the sign
    mm11.build_cell(a, g, pick, 4, vel=0.52)
    a.n('cb_pizz', 'Eb3', pick, b, 0.5, lock=True)
    cue.mark(SP['sand'], "d: the Build's one rest (the sand)")
    cue.mark(SP['sign'] - 15, 'd: the pickup into the sign (4)')
    # ---------------------------------------------------------------- e: VICTORY LAP, the chip note, the flat line
    sg = S('sign')
    art.stab(a, 'tpt', ['G5', 'Eb5'], sg, vel=0.76, length=0.2)
    art.stab(a, 'tbn', ['C5', 'Bb4'], sg, vel=0.74, length=0.22)
    a.n('lead2', 'G5', sg, 0.2, 0.56, lock=True, duty=0.25, rel=0.05)
    a.n('timp', 'Ab2', sg, 0.6, 0.74, lock=True)
    art.pizz(a, 'cb', 'Ab1', sg, vel=0.7, lock=True)
    art.spic(a, 'vln1', ['Eb5', 'G5'], sg, vel=0.62, lock=True)
    art.spic(a, 'vla', ['C4', 'Eb4'], sg, vel=0.6, lock=True)
    art.spic(a, 'vc', ['Ab2', 'Eb3'], sg, vel=0.62, lock=True)
    mm11.build_cell(a, g, sg, 16, vel=0.56, full=True)
    a.n('cb_pizz', 'Eb3', sg + 2 * b, b, 0.56, lock=True)
    pl = S('plates')
    a.n('lead', 'G5', pl, 1.5 * b, 0.4, lock=True, duty=0.125, rel=0.2, dec=0.3, sus=0.35)   # one chip note
    bonk = S('bonk')
    a.n('tri', 'F3', s(A('S8.02') + 7), s(A('S8.04')) - s(A('S8.02') + 7), 0.36, lock=True, att=0.25, dec=0.0, sus=1.0, rel=1.0)   # chip F pedal,
    # rung out over the CU
    for p, f_a, f_b in (('F5', 'dialog', 'grey1'), ('F4', 'grey1', 'grey2'), ('F5', 'grey2', 'bonk')):
        a.n('beeper', p, S(f_a), S(f_b) - S(f_a) - 0.01, 0.42, lock=True, rel=0.03)   # the flat line, tenuto
    cue.mark(SP['sign'], 'e: the sign: the stab + the Build at full')
    cue.mark(SP['plates'], 'e: one chip note')
    cue.mark(SP['dialog'], 'e: F F F (one tenuto phrase)')
    cue.mark(SP['bonk'], 'e: the bonk (SFX): out')
    # after "okay.": the felt, alone -- C4, then F4 on the swung and-of-4 with an open fifth
    c = s(SP['okay_out'] + 1)
    stl = c + 10 / 24.0
    a.n('felt', 'C4', c, stl - c, 0.33)
    a.n('felt_mech', 60, c, 0.1, 0.36)
    a.n('felt', 'F4', stl, 2.4, 0.35)
    a.ch('felt', ['F3', 'C4'], stl, 2.4, 0.25, roll=0.012)
    a.n('felt_mech', 60, stl, 0.1, 0.32)
    T['felt'].pedal = [(0.0, False), (c - 0.02, True), (stl - 0.03, False), (stl + 0.02, True), (s(F1) + 1.0, False)]
    cue.mark(SP['okay_out'] + 1, 'e: after "okay.": the felt C4')
    cue.mark(SP['okay_out'] + 11, 'e: F4 + the open fifth (settling onto the vault\'s F)')
    # the coda: the vault's F as a soft drone pedal (TEMP until MM-12), with the server_hum SFX
    d0 = stl + 0.2
    a.n('drone', 'F2', d0, s(F1) - d0, 0.34, lock=True, pitches=['F2', 'C3'], fade_in=2.5, fade_out=1.2)
    cue.mark(int(SP['okay_out'] + 16), 'coda: the vault\'s F (drone, TEMP for MM-12)')
    # the band cuts to one chip note on the plates: every stem but the chip rides to zero (tails too); the piano and
    # the synth re-open for the felt and the vault's pedal
    rides = {}
    for fam in FAMILIES:
        if fam == 'chip':
            continue
        pts = [(0.0, 0.0), (pl - 0.002, 0.0), (pl + 0.002, -120.0)]
        if fam in ('piano', 'synth'):
            pts += [(c - 0.05, -120.0), (c - 0.04, 0.0)]
        rides[fam] = pts
    macro = [(0.0, 0.0), (sg - 0.01, 0.0), (sg, -1.8), (pl, -1.8), (pl + 0.01, 0.0)]
    for lab, a0, a1 in [('a the STRAIGHT violin (+ its decay)', F0, SP['pad0']),
                        ('b the floor (pad -> bloom -> home)', SP['pad0'], SP['c1']),
                        ('c1 LEVERAGE (fade-in -> "Terms?")', SP['c1'], SP['terms']),
                        ('stop 4: the long hold', SP['terms'], SP['stamp']),
                        ('c2 the C pedal (under the posts)', SP['stamp'], SP['sign']),
                        ('e1 VICTORY LAP', SP['sign'], SP['plates']),
                        ('e2 one chip note; F F F', SP['plates'], SP['bonk']),
                        ('e3 the quiet (the CU)', SP['bonk'], SP['okay_out'] + 1),
                        ('e4 the felt settle -> the vault\'s F', SP['okay_out'] + 1, F1)]:
        cue.section(lab, a0, a1)
    meta = base_meta(
        ID, 'The Return (Ep1 Act Four v4, S7 + S8, to picture)', mm='MM-11',
        family='STRAIGHT -> the floor -> LEVERAGE (P03) -> the Build -> VICTORY LAP (P09) -> (the vault: TEMP)',
        tone='other people\'s sounds hand him back his company one by one; one size too big, then undercut; his felt last',
        scenes=[f'v4.1 S7.01-S8.10, act {F0}-{F1}; file t=0 = act frame {F0}'],
        motifs=['the Door on solo violin, senza vibrato, held and decaying', "Tasya's floor as a pad, then the bloom",
                'LEVERAGE (the fade-in, the bang inside it)', "the stamp's C pedal", 'the Build (pickup 4, 16)',
                'the 1-bit flat line F F F (tenuto)', "the Water Line's settle C4 -> F4 (felt)"],
        motif_ids=['DOOR', 'BUILD'], key='Db (the Door) -> Ab/C/E mediants -> F pedal -> C pedal -> Abmaj9 -> F, open fifth',
        underscore_lufs=-20.0, album_lufs=-16.0,
        no_third_windows=[(stl + 0.05, stl + 2.0)],
        silence_windows=[(S('terms') + 0.005, S('stamp') - 0.02, 'stop 4: "Terms?" -> the stamp (the room plays)', -90.0)],
        sfx_slots=[dict(t=S('card'), sfx='freeze_hit_F (the TERB card)'), dict(t=S('stamp'), sfx='rubber_stamp_C'),
                   dict(t=S('sign'), sfx='neon_ignite'), dict(t=S('bonk'), sfx='alert_bonk (E3)'),
                   dict(t=s(SP['vault']), sfx='server_hum: the vault\'s F (TEMP for MM-12)')],
        audition=[f'{S("post"):.1f}-{S("below"):.1f} s: the violin, plain; on the first heart ({S("heart1"):.1f} s) '
                  'it holds and decays under the hearts -- sincere, not "world\'s smallest violin"',
                  f'{S("pad0"):.1f}-{S("home"):.1f} s: the pad pre-laps under the decay, a chord on each of the three '
                  'words, then the bloom: does the decay-into-pad-into-LEVERAGE play as one run?',
                  f'{S("c1"):.1f}-{S("terms"):.1f} s: LEVERAGE fades in under Mada and the bang lands inside it; STOP 4 '
                  f'at {S("terms"):.1f} s',
                  f'{S("stamp"):.1f}-{S("sand"):.1f} s: the C pedal holds under both posts; it rests on the sand '
                  f'at {S("sand"):.1f} s',
                  f'{S("sign"):.1f}-{S("bonk"):.1f} s: the stab, one chip note, F F F as one tenuto phrase; then the quiet',
                  f'{c:.1f} s to the end: the felt settle onto the vault\'s F (a TEMP drone): a pedal, not a new cue'])
    return Score(ID, cue.g, T, cue.notes, markers=cue.markers, sections=cue.sections, mutes=cue.mutes,
                 stem_auto=rides, macro=macro, length_s=s(F1), tail_s=0.5, end_fade=(s(F1) - 1.0, s(F1)), meta=meta)


if __name__ == '__main__':
    render_cli(build, __file__)
