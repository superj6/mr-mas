#!/usr/bin/env python3
"""Ep1 v3 · TAG "december" (sc 32-33) · the music stem on the segment's own clock (0 = the tag's first frame).

Brief: "quiet and wry (the Water Line felt), handing off to the Orb outro, which has its own music."  Script sc 32:
"MM-12 december picks up the vault's F pedal and turns it into the Water Line's felt, continuous through both
scenes; it thins under the cover's real line and stops once, on the THUD."  Sc 33: "the chord with no third, on
the downbeat (MM-12's button), held on his face. Under it ... the Q* vault's F hum carries in and becomes the
chord's root."  (MM-12 isn't built; this is its Ep1 to-picture cut, in P01 DARK ROOM.)

  s (v3.2 lock)     what plays                                                     (every time is read from the lock)
  0.6               the felt's open fifth F3 + C4, ppp: it takes the F over from Act Four's vault hum, which the
                    sound bed carries into the tag
  2.58 (i0)         v3.1: ELGOOG'S PRODUCT FILM (the Runway insert, 233 frames from tag frame 62) plays ITS OWN
                    SOUND, its own layer (demo_film; DEMO=0 drops it): a clean, glossy corporate-demo bed in the
                    show's palette (an E-flat glass pad with no third, a shimmer as the lines draw themselves, a
                    swell into the fill and a soft glow chord as the duck becomes real, the chip's clock at a
                    whisper through the turn), small on the monitor's speaker until the grid dissolves (i22-26);
                    MM-12's fifth ducks to the room as it opens up
  8.29 (i137)       the stutter: the bed chopped in step with the held frames (a buffering stutter, tiny clicks)
  8.88 (i151)       the first still: the sheen cut dead; drier slide-change clicks on i151, 159, 167; then nothing
                    but the room (v3.2: the V.O. "those are stills." is cut; the stutter carries the joke)
  10.88 (i199)      the room returns with the pull-back: MM-12's felt line, THE WATER LINE, plain (F F F G-sw F |
                    C F) over rootless Fm(add9) and Dbmaj7, the chip square on the nudge only; a tiny chip blip as
                    the monitor's still snaps back to the grid (i213); the rack slot's delivery sits inside it
  32.03             one held Bbm9 (felt) under "it looks calmer than me." (the V.O. sits inside it; nothing moves)
  after the V.O.    a C7sus colour (no third), then the felt re-voices to an open F on the cut to the Orb's scan
                    two-shot (32.04), held under its two scans (a designed chord change on the cut: audit-v31
                    21:20.1, confirmed and marked)
  32.04's toasts    THE VERDICT (OST-BIBLE s2.4, Ep1): F5 just after the first toast's blink, and the C6 two beats
                    late, just after the second (never on the blink itself): soft vibes + celesta, let ring
  "that was close." the felt's F held through it; nothing starts under his line; the back wall's chord pre-laps
                    its cut just after it
  the back wall     the Water Line once more, timed so its settle (the last F4) would land on the THUD: the C4
                    sounds, and the THUD cuts the line dead before the F.  The one stop (3 ms, tails cut).
  THUD -> button    no score: the front page, "noted." (the room holds; designed)
  33.04             THE BUTTON: the chord with no third (felt F3 C4 G4 C5), held on his face; the vault's F hum
                    (a timeline sound) is its root.  It rings down into the black and is out by the tag's last frame,
                    so the Orb outro starts on its own music.
  (On the v3 lock, with no demo, the Water Line plays at 3.1 s and the rest follows as before.)

Levels: MM-12 underscore, -21 LUFS-I (quiet: P01, felt alone); the demo's bed laid at -24 LUFS-I over its window
(the monitor's film, before the mix's own balance); dry of dialogue.  Nothing here has been listened to.

  OST_WORKERS=2 bash ops/heavy.sh audio/.venv-theme/bin/python audio/ost/tracks/e01-v3-tag/track.py --render [--el]
  audio/.venv-theme/bin/python audio/ost/tracks/e01-v3-tag/track.py --dry | --assemble [--el]
"""
from __future__ import annotations

import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', 'e01-v3-act1'))
import numpy as np   # noqa: E402
import v3lib as V   # noqa: E402
from v3lib import palette, place_motif, nm, futz   # noqa: E402

SEG = 'tag'


def tracks():
    T = palette()
    T['felt'].gain_db = -1.0
    T['felt'].sends = {'room': -12, 'hall': -18}
    T['felt_mech'].gain_db = -15.0
    T['lead'].gain_db = -9.0                   # the chip on the nudge: <= -10 dB under the felt (P01)
    T['lead'].sends = {'room': -14, 'snes': -16}
    T['lead'].eq = [('hp', 220), ('lp', 5200)]
    T['vibes'].gain_db = -5.0
    T['vibes'].sends = {'hall': -8}
    T['celesta'].gain_db = -10.0
    T['celesta'].sends = {'hall': -8}
    return T


def water_line(c, t_bar, vel=0.16, nudge=True, stop_at=None):
    """F4 q F4 q F4 q G4 e(sw) F4 e | C4 q F4 h. (OST-BIBLE s2.2), placed with bar A at t_bar; the chip square
    doubles the nudge (G4) only.  stop_at: nothing starts at or after it (the thud)."""
    sw = V.Q * 2.0 / 3.0
    notes = [('F4', 0.0, V.Q), ('F4', V.Q, V.Q), ('F4', 2 * V.Q, V.Q), ('G4', 3 * V.Q, sw), ('F4', 3 * V.Q + sw,
             V.Q - sw), ('C4', 4 * V.Q, V.Q), ('F4', 5 * V.Q, 3 * V.Q)]
    for p, dt, d in notes:
        t = t_bar + dt
        if stop_at is not None and t >= stop_at - 0.02:
            break
        c.n('felt', p, t, d * 0.97, vel * (1.08 if dt == 0 else 1.0))
        if nudge and p == 'G4':
            c.n('lead', 'G4', t, d * 0.9, 0.1, True, duty=0.5, att=0.004, dec=0.25, sus=0.35, rel=0.12)


DEMO = 'v31-32.01d'          # v3.1: ELGOOG's product film (the Runway insert, 233 frames from tag frame 62)


def demo_t(tl, i):
    """insert frame i of the demo (runway.md s4a) on the tag's clock"""
    return tl.B(DEMO) + i / 24.0


def build(tl):
    home = 0.6
    c = V.Cue('tag_december', tl, anchor=home, anchor_bar=1, bars=16, swing=1.0)
    T = tracks()
    demo = tl.has(DEMO)
    # the F taken over from the vault hum: the felt's open fifth (v3.1: it ducks to the room as the demo opens up)
    c.pch('felt', ['F3', 'C4'], home, (demo_t(tl, 22) - home) if demo else 2.4, 0.11, roll=0.03)
    c.n('felt_mech', 60, home, 0.1, 0.25)
    c.mark(home, 'the felt\'s open fifth takes the F over from the vault hum', hit=False)
    if demo:                  # the demo film plays its own sound (its own layer); MM-12 comes back with the room
        c.mark(demo_t(tl, 22), 'the demo opens up: MM-12 ducks to the room (the film plays its own bed)', hit=False)
        c.n('lead', 'C6', demo_t(tl, 213), 0.06, 0.16, True, duty=0.125, att=0.002, dec=0.05, sus=0.1, rel=0.03)
        c.mark(demo_t(tl, 213), 'a tiny chip blip as the monitor\'s still snaps back to the grid (i213)')
    # the Water Line, plain, over rootless Fm(add9) | Dbmaj7 (v3.1: from the room's return, i199)
    wl1 = demo_t(tl, 199) if demo else c.bar(2)
    c.pch('felt', ['G3', 'Ab3', 'C4'], wl1, 2.4, 0.1, roll=0.0)
    water_line(c, wl1)
    c.pch('felt', ['Db3', 'F3', 'Bb3'], wl1 + V.BAR, 2.4, 0.1, roll=0.0)
    c.mark(wl1, 'the Water Line, plain (F F F G-sw F | C F); the chip on the nudge' +
           (' (the room returns with the pull-back, i199)' if demo else ''))
    c.section('the dark room: the felt takes the F; the Water Line, plain', 0.0, wl1 + 2 * V.BAR)
    # the V.O. "it looks calmer than me.": one held Bbm9 (felt), nothing moves
    vos = [l for l in tl.lines if l['kind'] == 'vo' and l['beat'] == '32.03'] or \
        [l for l in tl.lines if l['kind'] == 'vo' and l['beat'] != DEMO]
    vo = vos[0]
    t_vo = (vo['on'] - 0.35) if demo else min(c.bar(4), vo['on'] - 0.35)
    c.pch('felt', ['Db3', 'Ab3', 'C4', 'F4'], t_vo, vo['end'] - t_vo + 0.6, 0.1, roll=0.02)
    c.mark(t_vo, 'one held Bbm9 under the V.O. (nothing moves)', hit=False)
    # after the V.O.: a C7sus colour (no third), then an open F under the Orb's scans
    scan = tl.B('32.04')
    t_c7 = vo['end'] + 0.25
    if scan - t_c7 > 0.8:
        c.pch('felt', ['Bb3', 'Db4', 'F4', 'G4'], t_c7, scan - t_c7 + 0.3, 0.1, roll=0.02)
    wall0 = tl.B('32.07')
    close0 = [l for l in tl.lines if l['kind'] == 'mas' and l['beat'] == '32.05']
    if close0:
        wall0 = max(wall0, close0[0]['end'] + 0.3)
    # held through "close." to the back wall (no attack under his line, and no hole after it).  The re-voicing lands
    # on the cut to the scan two-shot: a designed chord change on the cut (audit-v31 C.2, 21:20.1: confirmed, marked)
    c.pch('felt', ['F3', 'C4', 'G4'], scan + 0.05, max(4.6, wall0 - scan + 0.35), 0.09, roll=0.03)
    c.mark(scan + 0.05, 'the cut to the scan two-shot: the felt re-voices to an open F (a designed change on the cut)')
    c.section('the V.O., then the Orb\'s scans (felt held)', t_vo, scan + 4.0)
    # THE VERDICT: F5 after the first toast's blink, C6 two beats late, after the second
    blinks = sorted(tl.snd_any('glyph_blink', scan, tl.E('32.04')))
    b1 = blinks[0] if blinks else scan + 1.0
    b2 = blinks[1] if len(blinks) > 1 else b1 + 3 * V.Q
    for p, t in (('F5', b1 + 0.12), ('C6', b2 + 0.12)):
        c.n('vibes', p, t, 3.0, 0.3)
        c.n('celesta', p, t, 1.5, 0.22)
        c.mark(t, f'THE VERDICT: {p} (after the toast\'s blink, never on it)')
    # "close.": held (nothing starts under his line); the back wall: the Water Line, cut by the THUD
    thud = tl.snd('33.01', 'synth:thud', default=tl.B('33.01') + 0.5)
    bar_b = thud - V.Q                        # the settle F4 would land on the thud
    bar_a = bar_b - V.BAR
    close_ = [l for l in tl.lines if l['kind'] == 'mas' and l['beat'] == '32.05']
    t_wall = tl.B('32.07')
    if close_:
        t_wall = close_[0]["end"] + 0.3          # the back wall's chord pre-laps its cut (sound leads)
    if bar_a - t_wall > 0.6:
        c.pch('felt', ['Db3', 'Ab3', 'Eb4'], t_wall, bar_a - t_wall + 0.2, 0.09, roll=0.03)
    c.pch('felt', ['G3', 'Ab3', 'C4'], bar_a, V.BAR, 0.1, roll=0.0)
    water_line(c, bar_a, vel=0.15, stop_at=thud)
    c.pch('felt', ['Db3', 'F3', 'Ab3'], bar_b, V.Q * 1.4, 0.09, roll=0.0)
    c.mark(bar_a, 'the back wall: the Water Line once more')
    c.mark(thud, 'THE THUD: the line stops dead before its settle (3 ms, tails cut)', hit=False)
    c.section('the back wall: the Water Line, cut by the thud', t_wall, thud)
    # THE BUTTON: the chord with no third, on the downbeat after "noted."
    noted = [l for l in tl.lines if l['beat'] == '33.04']
    t_btn = tl.snd('33.04', 'synth:button_chord', default=(noted[0]['end'] + 0.3 if noted else tl.B('33.04') + 1.5))
    c.pch('felt', ['F3', 'C4', 'G4', 'C5'], t_btn, tl.length - t_btn, 0.2, roll=0.008)
    c.n('felt_mech', 60, t_btn, 0.1, 0.3)
    c.mark(t_btn, 'THE BUTTON: F3 C4 G4 C5, no third (the vault\'s F hum is its root)')
    c.section('no score: the front page, "noted." (designed)', thud, t_btn)
    c.section('the button: the chord with no third, rings into the black', t_btn, tl.length)
    meta = dict(
        id='tag_december', title='december (Ep1 v3 tag, MM-12 to picture)', mm='MM-12', usage='BI',
        family='P01 DARK ROOM (+ the verdict; the button, no third)',
        tone='quiet, wry: his felt in the dark room, the Orb grading a magazine, a thud, one word',
        scenes=['Ep1 v3 tag (sc 32-33)'], motifs=['the Water Line (plain; cut before its settle by the thud)',
                                                   'the verdict F5 -> C6, two beats late', 'the button (no third)'],
        motif_ids=['WATER_LINE'], key='F minor (rootless), open fifths; the button F-C-G with no third',
        composer='v3-score-a (composer X), 2026-09-27', underscore_lufs=-21.0, album_lufs=-16.0,
        room_sfx=[dict(t0=c.clk(0.0), t1=c.clk(tl.length), sfx='room_drone (the dark room)')],
        no_third_windows=[(c.clk(t_btn + 0.05), c.clk(min(tl.length, t_btn + 2.5)))],
        silence_windows=[(c.clk(thud) + 0.005, c.clk(t_btn) - 0.01, 'the thud -> the button: no score', -90.0)],
        sfx_slots=[dict(t=round(c.clk(thud), 3), sfx='synth:thud (the newspaper)'),
                   dict(t=round(c.clk(b1), 3), sfx='glyph_blink: the first toast'),
                   dict(t=round(c.clk(b2), 3), sfx='glyph_blink: the second toast'),
                   dict(t=round(c.clk(t_btn), 3), sfx='vault_hum_F (the root of the button)')],
        audition=['0-8 s: the felt taking the F from the vault hum, then the Water Line: quiet and wry, not sad',
                  '13-15.5 s: the verdict, F then C two beats late: a small shrug, not a chime',
                  '20-23.2 s: the Water Line cut by the thud before its last F: does the stop land as the thud\'s?',
                  '30.6-33.9 s: the button with no third: open, and gone by the outro'])
    sc = c.finish(T, meta, length_end=tl.length, mutes=[(thud, t_btn - 0.01)],
                  end_fade=(tl.length - 1.1, tl.length - 0.02))
    return c, sc


def tracks_demo():
    T = palette()
    T['pad'].gain_db, T['pad'].sends = -3.0, {'hall': -8}
    T['shimmer'].gain_db = 2.0
    T['celesta'].gain_db, T['celesta'].sends = -6.0, {'hall': -6}
    T['vibes'].gain_db, T['vibes'].sends = -6.0, {'hall': -6}
    T['arp'].gain_db, T['arp'].eq = -10.0, [('lp', 5000)]
    T['sub'].gain_db = -12.0
    return T


def build_demo(tl):
    """ELGOOG'S PRODUCT FILM, its own sound (diegetic, the monitor's): a clean, glossy corporate-demo bed in the show's
    palette, no melody (runway.md s7): a bright E-flat glass pad with no third (the sheen: E-flat, B-flat, F, C), a light shimmer rising as the lines
    draw themselves, a slow swell into the fill and a soft glow chord as the duck becomes real, the chip's clock at a
    whisper through the turn.  The lay-in makes it small on the monitor's speaker until the grid dissolves (i22-26),
    chops it in step on the stutter's holds (i137-150), and cuts it dead on the first still (i151)."""
    if not tl.has(DEMO):
        return None
    d0 = tl.B(DEMO)
    t = lambda i: d0 + i / 24.0                                    # noqa: E731
    c = V.Cue('demo_film', tl, anchor=d0, anchor_bar=1, bars=6, swing=0.0)
    T = tracks_demo()
    V.pad(c, ['Eb3', 'Bb3', 'F4', 'C5', 'F5'], t(0), t(152) - t(0), 0.52, kind='glass', attack=0.6, release=0.3,
          bright=0.95)
    V.pad(c, ['Bb2', 'F3', 'C4'], t(22), t(152) - t(22), 0.44, kind='warm', attack=0.3, release=0.3, bright=0.8)
    c.n('shimmer', 63, t(34), t(106) - t(34), 0.5, True, pitches=[nm('Eb4'), nm('Bb4'), nm('F4'), nm('C5')], density=10)
    c.n('shimmer', 63, t(80), t(151) - t(80), 0.62, True, pitches=[nm('Bb4'), nm('C5'), nm('F4')], density=16)
    c.n('sub', 'Eb1', t(80), t(96) - t(80), 0.34, True, punch=0.0, click=0.0, decay=1.2)
    for k, p in enumerate(('Bb4', 'Eb5', 'F5', 'C6')):              # the glow as the duck becomes real (~i95)
        c.n('vibes', p, t(95) + 0.02 * k, 2.6, 0.3, art='bowed')
        c.n('celesta', p, t(95) + 0.03 * k, 1.4, 0.24)
    ps = [nm(p) for p in ('Eb5', 'Bb5', 'F5', 'C6', 'F5', 'Bb5', 'Eb5', 'C6')]
    tt = t(107)
    i = 0
    while tt < t(137) - 0.01:                                      # the turn: the chip's clock at a whisper
        c.n('arp', ps[i % 8], tt, V.S16 * 0.5, 0.18, True, duty=0.125, att=0.002, dec=0.06, sus=0.25, rel=0.03)
        tt += V.S16
        i += 1
    c.mark(t(0), 'the demo film: its bed, small on the monitor', hit=False)
    c.mark(t(22), 'the sheen opens up (the grid dissolves)', hit=False)
    c.mark(t(95), 'the glow as the duck becomes real')
    c.mark(t(137), 'the stutter: the bed chopped in step with the held frames', hit=False)
    c.mark(t(151), 'the first still: the sheen cuts out dead', hit=False)
    c.section('ELGOOG\'s product film: the glossy demo bed (its own sound)', t(0), t(151))
    macro = [(t(0), -2.0), (t(78), -2.0), (t(92), 1.5), (t(110), 0.0), (t(152), 0.0)]
    meta = dict(id='demo_film', title='ELGOOG\'s product film (Ep1 v3.1 tag, the Runway insert\'s sound)', mm='(diegetic)',
                usage='VI', diegetic=True, family='a diegetic source cue: the demo\'s own bed, in the show\'s palette',
                tone='clean, glossy, airy; no melody', scenes=['Ep1 v3.1 tag v31-32.01d'], motifs=[], motif_ids=[],
                key='E-flat with no third (E-flat, B-flat, F, C): the show\'s palette, glossed; no F bass', composer='v3-score-a (composer X), 2026-09-27',
                underscore_lufs=-20.0, album_lufs=-16.0,
                audition=['a product film\'s bed, glossy and airy, not stock "inspirational corporate"',
                          'the stutter and the dead cut on the first still: the film breaking, not the stem'])
    sc = c.finish(T, meta, length_end=t(152), macro=macro, end_fade=(t(151) - 0.01, t(151) + 0.02))
    return c, sc


def demo_post(tl, T0):
    """the monitor's small speaker to i22 (crossfaded clean by i26), the stutter's chops (i137, 139, 141, 144, 147:
    each hold loops the grain at its start, with a tiny digital click), the dead cut at i151, and the drier
    slide-change clicks on the stills (i151, 159, 167)"""
    d0 = tl.B(DEMO)
    sr = V.SR

    def f(x):
        x = np.asarray(x, dtype=np.float64)
        n = x.shape[1]
        idx = lambda i: int(round((d0 + i / 24.0 - T0) * sr))      # noqa: E731
        small = np.asarray(futz(x, 'laptop'), dtype=np.float64) * V.db(-6.0)
        w = np.zeros(n)
        a, b = idx(22), idx(26)
        w[:a] = 1.0
        w[a:b] = np.linspace(1.0, 0.0, max(1, b - a))
        y = small * w[None] + x * (1 - w)[None]
        holds = [137, 139, 141, 144, 147, 151]
        rng = np.random.default_rng(3201)
        for h0, h1 in zip(holds[:-1], holds[1:]):
            i0, i1 = idx(h0), idx(h1)
            g = y[:, i0:i0 + int(0.03 * sr)].copy()
            k = int(0.002 * sr)
            g[:, :k] *= np.linspace(0, 1, k)[None]
            g[:, -k:] *= np.linspace(1, 0, k)[None]
            reps = int(np.ceil((i1 - i0) / g.shape[1]))
            y[:, i0:i1] = np.tile(g, (1, reps))[:, : i1 - i0]
            click = rng.standard_normal(int(0.004 * sr)) * np.exp(-np.arange(int(0.004 * sr)) / (0.0008 * sr)) * 0.08
            y[:, i0:i0 + len(click)] += click[None]
        y[:, idx(151):] = 0.0                                       # the first still: dead
        for s_ in (151, 159, 167):                                  # the slide-change clicks (drier, harder)
            j = idx(s_)
            m = int(0.006 * sr)
            click = rng.standard_normal(m) * np.exp(-np.arange(m) / (0.0012 * sr)) * 0.14
            if 0 <= j < n - m:
                y[:, j:j + m] += click[None]
        return y
    return f


def main():
    args, path, tag = V.cli(SEG)
    tl = V.TL(path)
    work = os.path.join(HERE, 'render', '_work', tag.lstrip('-'))   # render/_work/ (Kokoro), render/_work/el/ (git-ignored)
    c, sc = build(tl)
    dm = build_demo(tl)
    if args.dry:
        print(V.note_qa(sc))
        if dm:
            print('demo_film', V.note_qa(dm[1]))
        return
    if args.render is not None:
        print(f'[tag] rendered in {V.render_cue(sc, work):.0f} s', flush=True)
        if dm:
            print(f'[demo_film] rendered in {V.render_cue(dm[1], work):.0f} s', flush=True)
    wav = os.path.join(work, f'{sc.name}-underscore.wav')
    out = os.path.join(HERE, 'render', f'music{tag}.wav')
    thud = [t for t, lab, h in c.marks if lab.startswith('THE THUD')][0]
    t_btn = [t for t, lab, h in c.marks if lab.startswith('THE BUTTON')][0]
    layers = [dict(name='tag_december', wav=wav, T0=c.T0, a0=0.0, a1=tl.length, fin=0.0, fout=0.05)]
    designed = [(thud, t_btn, 'the thud -> the button: no score (the front page, "noted.")'),
                (0.0, 0.6, 'the tag\'s head: the vault hum (a timeline sound) until the felt takes its F')]
    if dm and os.environ.get('DEMO', '1') != '0':
        cd, scd = dm
        layers.append(dict(name='demo_film', wav=os.path.join(work, f'{scd.name}-underscore.wav'), T0=cd.T0,
                           a0=demo_t(tl, 0), a1=demo_t(tl, 168), fin=0.1, fout=0.003,
                           post=demo_post(tl, cd.T0), post_name='the monitor speaker to i22; the stutter\'s chops; '
                           'dead on the first still (DEMO=0 drops the layer)', level=-24.0))
        vo_st = [l for l in tl.lines_in(demo_t(tl, 151), demo_t(tl, 199), kinds={'vo'})]
        designed.append((demo_t(tl, 151), demo_t(tl, 199), 'the stills: the demo\'s sheen cut dead (i151); nothing '
                         'but the room' + (' and the V.O.' if vo_st else '') + ' until MM-12 returns with the '
                         'pull-back (i199)'))
    mix, laid = V.assemble(tl, layers, out, stops=[(thud, t_btn - 0.01)], designed=designed)
    rows = [(lab, a0, a1) for lab, a0, a1 in c.sections]
    if dm:
        rows += [(f'demo_film: {lab}', a0, a1) for lab, a0, a1 in dm[0].sections]
    wins = {'tag_december': (0.0, tl.length)}
    if dm:
        wins['demo_film'] = (demo_t(tl, 0), demo_t(tl, 151))
    res = V.measure(tl, mix, wins, rows, designed,
                    stings=[(t_btn, tl.length, 'the button chord')] + ([(demo_t(tl, 151), demo_t(tl, 168),
                                                                        'the slide-change clicks')] if dm else []))
    doc = dict(
        schema='mrmas-reel-music/1', id=f'e01-v3-tag{tag}', segment=SEG, file=os.path.relpath(out, V.REPO),
        timeline=os.path.relpath(path, V.REPO), length_s=tl.length, frames=tl.frames, samples=tl.samples,
        sample_rate=V.SR, channels=2, clock='the segment\'s own clock: 0 = its first frame (timeEpisode, head 0)',
        level='underscore (-21 LUFS-I target, the engine\'s master), dry of dialogue; the mixer ducks it',
        cues=[dict(cue='tag_december', start=0.0, end=tl.length, what='MM-12 december (to picture): the felt takes '
                   'the vault\'s F; the Water Line; the verdict two beats late; cut by the thud; the button with no '
                   'third', render=os.path.relpath(wav, V.REPO), laid_at_s=round(c.T0, 4),
                   level=res['cues']['tag_december'], engine_qa=V.engine_qa(work, sc.name), note_qa=V.note_qa(sc),
                   sync=[dict(t=round(t, 3), what=lab, hit=h) for t, lab, h in c.marks])]
        + ([dict(cue='demo_film', start=round(demo_t(tl, 0), 3), end=round(demo_t(tl, 151), 3),
                 what='ELGOOG\'s product film, its own (diegetic) bed: glossy, airy, no melody; small on the monitor to '
                      'i22; chopped on the stutter; dead on the first still', render=os.path.relpath(
                     os.path.join(work, f'{dm[1].name}-underscore.wav'), V.REPO), laid_at_s=round(dm[0].T0, 4),
                 level=res['cues'].get('demo_film'), engine_qa=V.engine_qa(work, dm[1].name), note_qa=V.note_qa(dm[1]),
                 sync=[dict(t=round(t, 3), what=lab, hit=h) for t, lab, h in dm[0].marks])] if dm else []),
        silences_designed=[dict(t0=round(a, 3), t1=round(b, 3), why=w) for a, b, w in designed], measured=res,
        laid=laid, source=os.path.relpath(__file__, V.REPO),
        heard='nothing here has been listened to; every number is measured')
    V.write_json(os.path.join(HERE, f'cues{tag}.json'), doc)
    print(f'wrote {os.path.relpath(out, V.REPO)}: {res["length_s"]} s exact={res["exact"]}; '
          f'{res["cues"]}; silences {res["digital_silence"]}; fragments {res["undesigned_fragments"]}')


if __name__ == '__main__':
    main()
