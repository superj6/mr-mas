#!/usr/bin/env python3
"""Ep1 v3 · TAG "december" (sc 32-33) · the music stem on the segment's own clock (0 = the tag's first frame).

Brief: "quiet and wry (the Water Line felt), handing off to the Orb outro, which has its own music."  Script sc 32:
"MM-12 december picks up the vault's F pedal and turns it into the Water Line's felt, continuous through both
scenes; it thins under the cover's real line and stops once, on the THUD."  Sc 33: "the chord with no third, on
the downbeat (MM-12's button), held on his face. Under it ... the Q* vault's F hum carries in and becomes the
chord's root."  (MM-12 isn't built; this is its Ep1 to-picture cut, in P01 DARK ROOM.)

  s (Kokoro lock)   what plays                                                     (every time is read from the lock)
  0.6               the felt's open fifth F3 + C4, ppp: it takes the F over from Act Four's vault hum, which the
                    sound bed carries 1.5 s into the tag
  3.1               THE WATER LINE, plain (F F F G-sw F | C F) over rootless Fm(add9) and Dbmaj7; the chip square on
                    the nudge only; the rack slot's delivery (4.5) sits inside it
  8.1               one held Bbm9 (felt) under "it looks calmer than me." (the V.O. sits inside it; nothing moves)
  after the V.O.    a C7sus colour (no third), then the felt holds an open F under the Orb's two scans
  13.04 / 14.89     THE VERDICT (OST-BIBLE s2.4, Ep1): F5 just after the first toast's blink, and the C6 two beats
                    late, just after the second (never on the blink itself): soft vibes + celesta, let ring
  "close."          the felt's F held through it; nothing starts under his line; the back wall's chord pre-laps
                    its cut just after it
  the back wall     the Water Line once more, timed so its settle (the last F4) would land on the THUD: the C4
                    sounds, and the THUD (23.12) cuts the line dead before the F.  The one stop (3 ms, tails cut).
  23.12 -> button   no score: the front page, "noted." (the room holds; designed)
  30.64             THE BUTTON: the chord with no third (felt F3 C4 G4 C5), held on his face; the vault's F hum
                    (a timeline sound) is its root.  It rings down into the black and is out by the tag's last frame,
                    so the Orb outro starts on its own music.

Levels: underscore, -21 LUFS-I (quiet: P01, felt alone); dry of dialogue.  Nothing here has been listened to.

  OST_WORKERS=2 bash ops/heavy.sh audio/.venv-theme/bin/python audio/ost/tracks/e01-v3-tag/track.py --render [--el]
  audio/.venv-theme/bin/python audio/ost/tracks/e01-v3-tag/track.py --dry | --assemble [--el]
"""
from __future__ import annotations

import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', 'e01-v3-act1'))
import v3lib as V   # noqa: E402
from v3lib import palette, place_motif   # noqa: E402

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


def build(tl):
    home = 0.6
    c = V.Cue('tag_december', tl, anchor=home, anchor_bar=1, bars=16, swing=1.0)
    T = tracks()
    # the F taken over from the vault hum: the felt's open fifth
    c.pch('felt', ['F3', 'C4'], home, 2.4, 0.11, roll=0.03)
    c.n('felt_mech', 60, home, 0.1, 0.25)
    c.mark(home, 'the felt\'s open fifth takes the F over from the vault hum', hit=False)
    # the Water Line, plain, over rootless Fm(add9) | Dbmaj7
    wl1 = c.bar(2)
    c.pch('felt', ['G3', 'Ab3', 'C4'], wl1, 2.4, 0.1, roll=0.0)
    water_line(c, wl1)
    c.pch('felt', ['Db3', 'F3', 'Bb3'], c.bar(3), 2.4, 0.1, roll=0.0)
    c.mark(wl1, 'the Water Line, plain (F F F G-sw F | C F); the chip on the nudge')
    c.section('the dark room: the felt takes the F; the Water Line, plain', 0.0, c.bar(4))
    # the V.O. "it looks calmer than me.": one held Bbm9 (felt), nothing moves
    vo = [l for l in tl.lines if l['kind'] == 'vo'][0]
    t_vo = min(c.bar(4), vo['on'] - 0.35)
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
    # held through "close." to the back wall (no attack under his line, and no hole after it)
    c.pch('felt', ['F3', 'C4', 'G4'], scan + 0.05, max(4.6, wall0 - scan + 0.35), 0.09, roll=0.03)
    c.section('the V.O., then the Orb\'s scans (felt held)', c.bar(4), scan + 4.0)
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


def main():
    args, path, tag = V.cli(SEG)
    tl = V.TL(path)
    work = os.path.join(HERE, 'render', '_work', tag.lstrip('-'))   # render/_work/ (Kokoro), render/_work/el/ (git-ignored)
    c, sc = build(tl)
    if args.dry:
        print(V.note_qa(sc))
        return
    if args.render is not None:
        print(f'[tag] rendered in {V.render_cue(sc, work):.0f} s', flush=True)
    wav = os.path.join(work, f'{sc.name}-underscore.wav')
    out = os.path.join(HERE, 'render', f'music{tag}.wav')
    thud = [t for t, lab, h in c.marks if lab.startswith('THE THUD')][0]
    t_btn = [t for t, lab, h in c.marks if lab.startswith('THE BUTTON')][0]
    layers = [dict(name='tag_december', wav=wav, T0=c.T0, a0=0.0, a1=tl.length, fin=0.0, fout=0.05)]
    designed = [(thud, t_btn, 'the thud -> the button: no score (the front page, "noted.")'),
                (0.0, 0.6, 'the tag\'s head: the vault hum (a timeline sound) until the felt takes its F')]
    mix, laid = V.assemble(tl, layers, out, stops=[(thud, t_btn - 0.01)], designed=designed)
    rows = [(lab, a0, a1) for lab, a0, a1 in c.sections]
    res = V.measure(tl, mix, {'tag_december': (0.0, tl.length)}, rows, designed,
                    stings=[(t_btn, tl.length, 'the button chord')])
    doc = dict(
        schema='mrmas-reel-music/1', id=f'e01-v3-tag{tag}', segment=SEG, file=os.path.relpath(out, V.REPO),
        timeline=os.path.relpath(path, V.REPO), length_s=tl.length, frames=tl.frames, samples=tl.samples,
        sample_rate=V.SR, channels=2, clock='the segment\'s own clock: 0 = its first frame (timeEpisode, head 0)',
        level='underscore (-21 LUFS-I target, the engine\'s master), dry of dialogue; the mixer ducks it',
        cues=[dict(cue='tag_december', start=0.0, end=tl.length, what='MM-12 december (to picture): the felt takes '
                   'the vault\'s F; the Water Line; the verdict two beats late; cut by the thud; the button with no '
                   'third', render=os.path.relpath(wav, V.REPO), laid_at_s=round(c.T0, 4),
                   level=res['cues']['tag_december'], engine_qa=V.engine_qa(work, sc.name), note_qa=V.note_qa(sc),
                   sync=[dict(t=round(t, 3), what=lab, hit=h) for t, lab, h in c.marks])],
        silences_designed=[dict(t0=round(a, 3), t1=round(b, 3), why=w) for a, b, w in designed], measured=res,
        laid=laid, source=os.path.relpath(__file__, V.REPO),
        heard='nothing here has been listened to; every number is measured')
    V.write_json(os.path.join(HERE, f'cues{tag}.json'), doc)
    print(f'wrote {os.path.relpath(out, V.REPO)}: {res["length_s"]} s exact={res["exact"]}; '
          f'{res["cues"]}; silences {res["digital_silence"]}; fragments {res["undesigned_fragments"]}')


if __name__ == '__main__':
    main()
