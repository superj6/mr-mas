#!/usr/bin/env python3
"""Ep1 v3 · ACT TWO "the regulate-me tour" (sc 13-17) · the music stem on the segment's own clock.

Brief (v3-score-a): "the White House: pomp (MM-19 family); the Senate: a lighter Under Oath; the tour poster: THE
RUN; the rooftop: Nesnej's upsell (THE JOB), ending on KA-CHING and the bell."  Mood map (v3-plan s6): pomp and
comedy.  Every sync point is read from the timeline (default the Kokoro lock; --el for the ElevenLabs-timed one).

V3.2 (2026-09-28, the final lock, script draft 8.1; the times below are the v3 lock's): the ask comes before the
wallet (15.10 -> 15.15 -> 15.16 -> 15.11): his ask plays on the low-string pedal (a real line), the straight mute's
rising line goes to the senators' delight (15.16); senate_b is MM-20's re-entry after "...no equity", the F7sus(b9)
held on the two of them and cut by the tour's stamp.  README.md has the details.

  s (Kokoro lock)  cue          what plays
  0 - 74.1         wh           THE WHITE HOUSE: a light chamber pomp in B-flat (MM-19 family, P13): a straight
                                processional (dotted strings, pizz march bass, harp, soft timpani and snare taps)
                                from the first frame; the felt under Mas's V.O. (his head in the world's pomp); theme
                                fragments only in the gaps; the pan along the row gets the whole phrase, its held
                                note on his one look at the lens; the two freeze cards hold a chord for their beat.
                                ON THE DOOR (13.11) NEDIB's Fountain Pen takes over: the march yields to a legato
                                quartet and the straight-mute trumpet's flat line (B-flat x 4); the pen hovers under
                                his two lines; its leap and pen-stroke turn sign THE PRINT (13.14), the final B-flat
                                held under "it's a good photo." and rung out by the bridge
  74.1 - 85.1      -            THE BRIDGE: no score (script sc 14; designed)
  85.1 - 130.3     senate_a     THE SENATE, a lighter Under Oath (P02 court, MM-20 family): an F pedal under the
                                clone's real line, then a deadpan pizzicato two-feel in D-flat over the court's F
                                (low strings pizz, brushed snare, bassoon, straight-mute trumpet asides in the gaps);
                                a low-string pedal only under every real line; Sucram's card holds its beat;
                                IT STOPS on the wallet (15.12), 3 ms (the room's air under it)
  130.3 - 142.1    -            the wallet, the gasp, "Health insurance.", the stamps, "...no equity": no score
  142.1 - 155.8    senate_b     back on a new phrase after his line; the ask (PLEASE REGULATE ME) gets the
                                trumpet's one rising line before Sucram's stamp; the back of the sheet leaves the
                                harmony hanging (F7sus-flat9) under his stare; the tour's first stamp cuts it
  155.8 - 163.8    run_roof     THE TOUR POSTER: THE RUN (MM-03 family, P07) in A-flat, in on the stamp's thunk: a
                                straight 16th engine (the Build's chip arpeggio, brushes, bass), one layer and one
                                KNEE STAB per stamp (the title's quartal C F Bb Eb over a moving bass: Ab, Db, Bb, Eb),
                                thin under the quote strip and his post; the engine stops on the cut
  163.8 - 180.2    run_roof     THE ROOFTOP: the last stab rings into a held pad, grand (A-flat maj9, horns) under the
                                statement (the record plays dry), then uneasy at the sheet: Dbmaj9(#11), Bbm9, and
                                C7sus(b9) on "we'll read it." (the knife)
  180.2 - 195.1    upsell       NESNEJ'S UPSELL (MM-05 family, P06 THE JOB, F dorian, double-time swing), in on
                                the register: walking eighths, the chip GPU clock, the Upsell's cells a step higher
                                each time (vibes + straight mute), dry under his real line; THE CLOSE (C G F + the
                                bari/trombone fifth) lands on the cut to his finger and LEAVES THE DOWNBEAT: the
                                KA-CHING (a timeline sound) is the downbeat.  Phrase 3 climbs on, featured; at the
                                crack in the sky (17.11) it DROPS OUT mid-climb (3 ms)
  195.1 - 204.75   -            the act-out: the register's bell alone (a timeline sound), decaying; no score

Levels (the engine's underscore masters, normalised per cue): wh -20, senate -21, run_roof -19 (the RUN about 4 dB
over the pad), upsell -19 (+3.5 dB after the slot).  Dry of dialogue: the mixer ducks it.  Nothing here has been
listened to.

  OST_WORKERS=2 bash ops/heavy.sh audio/.venv-theme/bin/python audio/ost/tracks/e01-v3-act2/track.py --render [cue ...] [--el]
  audio/.venv-theme/bin/python audio/ost/tracks/e01-v3-act2/track.py --dry | --assemble [--el]
"""
from __future__ import annotations

import os
import sys
from dataclasses import replace

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', 'e01-v3-act1'))
import v3lib as V   # noqa: E402
from v3lib import palette, nm, Drums   # noqa: E402

SEG = 'act2'
Q, BAR = V.Q, V.BAR


def dup(T, src, name, **kw):
    T[name] = replace(T[src], name=name, **kw)
    return T[name]


def vo_felt(c, chord_at, t0, t1, vel=0.12):
    """the felt under every V.O. inside [t0, t1): one soft chord held through the line (P01: the V.O. sits in it)"""
    for l in c.tl.lines_in(t0, t1, kinds={'vo'}):
        c.pch('felt', chord_at(l['on']), l['on'] - 0.3, l['end'] - l['on'] + 0.8, vel, roll=0.02)
        c.mark(l['on'] - 0.3, f'the felt under the V.O. ({l["id"]})', hit=False)


# ================================================================== WH · THE WHITE HOUSE (B-flat, straight)
WH = {   # quartet + bass voicings (no A-natural anywhere over an F bass: the dominant is F9sus4)
    'Bb':     dict(cb='Bb1', vc='Bb2', vla='F3', vln2='D4', vln1='F4', felt=['D4', 'F4', 'C5'], fifth='F2'),
    'Ebmaj7': dict(cb='Eb2', vc='Eb3', vla='Bb3', vln2='D4', vln1='G4', felt=['Eb4', 'G4', 'D5'], fifth='Bb2'),
    'Cm7':    dict(cb='C2', vc='C3', vla='G3', vln2='Eb4', vln1='Bb4', felt=['Eb4', 'G4', 'Bb4'], fifth='G2'),
    'F9sus4': dict(cb='F1', vc='F2', vla='Bb3', vln2='Eb4', vln1='G4', felt=['Eb4', 'G4', 'Bb4'], fifth='C3'),
    'Gm7':    dict(cb='G1', vc='G2', vla='D3', vln2='F4', vln1='Bb4', felt=['D4', 'F4', 'Bb4'], fifth='D3'),
}
WH_LOOP = ['Bb', 'Ebmaj7', 'Cm7', 'F9sus4', 'Gm7', 'Ebmaj7', 'Cm7', 'F9sus4']
# the pomp's theme (pentatonic in B-flat: no A, so it sits over any of the loop's chords)
WH_FRAGS = ['F4/4. G4/8 Bb4/4 D5/4', 'D5/4. C5/8 Bb4/4 G4/4', 'Bb4/4. C5/8 D5/4 F5/4']
WH_SHORT = ['D5/8 C5/8 Bb4/4', 'F4/8 G4/8 Bb4/4', 'C5/8 D5/8 F5/4']
WH_PAN = 'F4/4. G4/8 Bb4/4 D5/4 C5/2.'


def tracks_wh():
    T = palette()
    for k in ('vln1', 'vln2', 'vla', 'vc', 'cb'):
        T[k].sends = {'hall': -10, 'chamber': -13}
    for k in ('vla', 'vc'):                              # the ~220 Hz body resonance (an A3) under the print's F9sus4 bass
        T[k].eq = list(T[k].eq) + [('peq', 221.0, -10.0, 4.0)]   # (the EL v3.1 render's F-major trace)
    T['vln1'].pan, T['vln2'].pan, T['vla'].pan, T['vc'].pan, T['cb'].pan = -0.35, -0.15, 0.15, 0.3, 0.45
    dup(T, 'vla', 'vla_d', gain_db=-2.0)          # the dotted processional figure (thinned under talk)
    dup(T, 'vln2', 'vln2_d', gain_db=-2.0)
    dup(T, 'cb', 'cb_m', gain_db=-3.0)            # the march bass (pizz)
    T['cb_m'].eq = list(T['cb_m'].eq) + [V.PIZZ_NOTCH]
    T['harp'].gain_db, T['harp'].pan = -3.0, -0.4
    T['snare_taps'].gain_db = -12.0
    T['timp'].gain_db = -8.0
    T['glock'].gain_db = -14.0
    T['felt'].gain_db, T['felt'].sends = -2.0, {'room': -12, 'hall': -18}
    T['tpt'].gain_db, T['tpt'].sends = -4.0, {'hall': -12, 'room': -14}
    T['tpt'].eq = [('peq', 1760, -7.0, 3.0), ('peq', 3000, -4.0, 0.8)]   # the straight mute's resonances (MM-05)
    T['tri'].gain_db = -8.0
    return T


def wh_ring_end(tl):
    """where the White House's last B-flat is gone: the end of 13.14, or (v3.1, where the print MATCH CUTs to his phone
    at the bay's window) about a second across the cut, a sound bridge, clear of the bridge's first line"""
    end = tl.E('13.14')
    caps = ' '.join((tl.beats[tl.bi[b]]['b'].get('caption') or '') for b in ('13.14', '14.01') if tl.has(b))
    if 'MATCH CUT' not in caps or not tl.has('14.01'):
        return end
    first = [l['on'] for l in tl.lines_in(end, tl.E('14.01'))]
    return min(end + 1.1, (min(first) - 0.8) if first else end + 1.1)


def cue_wh(tl):
    c = V.Cue('wh_pomp', tl, anchor=0.0, anchor_bar=1, bars=34, swing=0.0)
    T = tracks_wh()
    door = tl.B('13.11')
    end = tl.E('13.14')
    ring_end = wh_ring_end(tl)                          # v3.1: the print MATCH CUTs to his phone; the B-flat bridges it
    freezes = [tl.B(b) for b in ('13.03', '13.12') if tl.has(b)]
    nb = int((door - c.bar1) / BAR) + 1                 # bars up to the door

    def chord_at(t):
        b = int((t - c.bar1) // BAR)
        return WH[WH_LOOP[b % len(WH_LOOP)]]['felt']

    # ---- the march (to the door)
    for b in range(1, nb + 1):
        t = c.bar(b)
        if t >= door - 0.05:
            break
        name = WH_LOOP[(b - 1) % len(WH_LOOP)]
        v = WH[name]
        d = min(BAR, door - t)
        c.n('vc', v['vc'], t, d * 0.98, 0.26, art='sus', att=0.12, rel=0.4)
        c.n('cb', v['cb'], t, d * 0.98, 0.16, art='sus', att=0.2, rel=0.4)
        c.n('cb_m', v['cb'], t, 0.4, 0.46, art='pizz')
        if t + 2 * Q < door:
            c.n('cb_m', v['fifth'], t + 2 * Q, 0.4, 0.4, art='pizz')
        for k, (off, dur) in enumerate(((0.0, 1.5), (1.5, 0.5), (2.0, 1.5), (3.5, 0.5))):   # q. e q. e
            tt = t + off * Q
            if tt < door - 0.05:
                vv = 0.27 if off in (0.0, 2.0) else 0.22
                c.n('vla_d', v['vla'], tt, dur * Q * 0.8, vv, art='sus', att=0.02, rel=0.15)
                c.n('vln2_d', v['vln2'], tt, dur * Q * 0.8, vv * 0.95, art='sus', att=0.02, rel=0.15)
        if (b - 1) % 2 == 0:                                        # the harp on each pair of bars
            ps = [v['vc'], v['vla'], v['vln2'], v['vln1']]
            for i, p in enumerate(ps):
                c.n('harp', p, t + 0.03 * i, 1.6, 0.44)
        if (b - 1) % 4 == 0:                                        # soft timpani + taps on each phrase
            c.n('timp', v['vc'] if nm(v['vc']) >= nm('F2') else v['fifth'], t, 1.0, 0.3)
        for k in (1, 3):
            tt = t + k * Q
            if tt < door - 0.05:
                c.n('snare_taps', 38, tt, 0.1, 0.22)
    c.section('the pomp: a straight processional in B-flat', 0.0, door)
    # ---- the theme: fragments in the gaps; the whole phrase on the pan, its held note on his look
    pan0 = tl.B('13.07') if tl.has('13.07') else None
    used = []
    fr = 0
    for g0, g1 in tl.gaps(0.3, door - 0.3, min_len=1.45, pad_before=0.2, pad_after=0.35):
        on_pan = pan0 is not None and g0 - 0.5 <= pan0 + 1.0 <= g1
        text = WH_PAN if on_pan else WH_FRAGS[fr % len(WH_FRAGS)]
        if not on_pan and c.next_beat(g0) + V.line_len(text) > g1 + 0.05:
            text = WH_SHORT[fr % len(WH_SHORT)]
        L = V.line_len(text) * (0.6 if on_pan else 1.0)
        t = c.next_beat(max(g0, pan0 - 0.1) if on_pan else g0)
        for f in freezes:
            if f - 0.1 < t < f + Q:
                t = c.next_beat(f + Q)
        if on_pan and t + V.line_len(text) > g1:                  # the held note may be cut short by the next line
            pass
        if t + (L if on_pan else V.line_len(text)) > g1 + 0.05:
            continue
        if any(t < u1 and t + L > u0 for u0, u1 in used) or any(f - 0.1 < t < f + Q for f in freezes):
            continue
        notes = V.phrase(c, 'vln1', t, text, 0.4 if on_pan else 0.34, art='sus', att=0.04, rel=0.35,
                         stop_at=g1 - 0.05)
        c.n('glock', notes[0][1], notes[0][0], 0.5, 0.3)
        used.append((t, t + L))
        c.mark(t, 'the pomp\'s theme on the pan (the held note on his look)' if on_pan else 'a theme fragment (a gap)')
        if on_pan:
            c.n('glock', notes[-1][1], notes[-1][0], 1.0, 0.3)
        fr += 0 if on_pan else 1
    # ---- the freezes: every attack in the frozen beat goes; the held chord carries it
    for f in freezes:
        if f < door:
            V.drop_window(c, f, f + Q, keep=('vc', 'cb'))
            c.mark(f, 'a freeze card: the pomp holds its chord for the beat', hit=False)
    vo_felt(c, chord_at, 0.0, door - 0.1)
    # ---- ON THE DOOR: the Fountain Pen (NEDIB): the march yields; legato quartet; the muted trumpet's flat line
    V.clip_before(c, door, insts={'vc', 'cb', 'vla_d', 'vln2_d', 'harp', 'vln1'}, rel=0.5)
    vo13 = [l for l in tl.lines_in(door, end, kinds={'vo'})]
    ned = [l for l in tl.lines_in(door, end) if l['who'] == 'nedib']
    mas_ph = [l for l in tl.lines_in(tl.B('13.14'), end) if l['who'] == 'mas']
    flash = tl.B('13.12') if tl.has('13.12') else door + 5.7
    t_gm = (vo13[0]['end'] + 0.1) if vo13 else door + 3.0
    w0 = (ned[-1]['end'] + 0.05) if ned else tl.B('13.14') - 0.6
    w1 = (mas_ph[0]['on'] - 0.12) if mas_ph else w0 + 2.6
    st = max(0.36, min(Q, (w1 - w0) / 4.0))
    lp_ = [('C4', 'Cm7'), ('D4', 'Bb/D'), ('F4', 'F9sus4'), ('Bb4', 'Bb')]
    pads = [(door, 'Bb'), (t_gm, 'Gm7'), (flash, 'Ebmaj7')] + [(w0 + i * st, nmc) for i, (_, nmc) in enumerate(lp_)]
    PAD = {'Bb': ['Bb2', 'F3', 'D4', 'C5'], 'Gm7': ['G2', 'D3', 'Bb3', 'F4'], 'Ebmaj7': ['Eb3', 'Bb3', 'D4', 'G4'],
           'Cm7': ['C3', 'G3', 'Eb4', 'Bb4'], 'Bb/D': ['D3', 'F3', 'Bb3', 'F4'], 'F9sus4': ['F2', 'Eb3', 'Bb3', 'G4']}
    fin = w0 + 4 * st
    pads.append((fin, 'Bb'))
    for i, (t, name) in enumerate(pads):
        t1 = pads[i + 1][0] if i + 1 < len(pads) else ring_end - 0.3
        for inst, p in zip(('vc', 'vla', 'vln2', 'vln1'), PAD[name]):
            fbass = name == 'F9sus4'                        # the F bass lets go before the B-flat chord (and its D)
            c.n(inst, p, t, t1 - t + (0.25 if (i + 1 < len(pads) and not fbass) else 0.0), 0.24 if inst != 'vln1' else 0.2,
                art='sus', att=0.35 if i else 0.12, rel=(0.08 if fbass else 0.6) if i + 1 < len(pads) else 1.6)
        if name in ('Bb',) or i == 0:
            for k, p in enumerate(PAD[name]):
                c.n('harp', p, t + 0.035 * k, 2.0, 0.46)
    for k in range(4):                                              # the flat line, B-flat x 4, from the door
        c.n('tpt', 'Bb4', door + k * Q, Q * 0.9, 0.34 if k == 0 else 0.28, art='straight', rel=0.12)
    c.n('tri', 'Bb2', door, 0.9, 0.4, att=0.004, dec=0.4, sus=0.0, rel=0.1)
    c.mark(door, 'ON THE DOOR: the Fountain Pen (the flat line on the straight mute); the march yields')
    for i, (p, _) in enumerate(lp_):                                # the leap C D F Bb + the pen-stroke turn
        t = w0 + i * st
        c.n('tpt', p.replace('4', '5') if p != 'Bb4' else 'Bb4', t, st * 0.92, 0.34, art='straight', rel=0.12)
    tt = w0 + 3 * st
    for k, p in enumerate(['C5', 'Bb4', 'A4']):
        c.n('tpt', p, tt + (k + 1) * st / 4.0, st / 4.0 * 0.95, 0.3, art='straight', rel=0.08)
    c.n('tpt', 'Bb4', fin, ring_end - fin - 0.4, 0.3, art='straight', rel=1.0)
    c.n('tri', 'Bb2', fin, 0.9, 0.4, att=0.004, dec=0.4, sus=0.0, rel=0.1)
    c.mark(w0, 'the Fountain Pen\'s leap and pen-stroke turn: it signs the print')
    c.mark(fin, 'the final B-flat, held under "it\'s a good photo."; it bridges the match cut (v3.1)', hit=False)
    for f in freezes:
        if f >= door:
            V.drop_window(c, f, f + Q, insts={'harp', 'tpt'})
    c.section('ON THE DOOR: the Fountain Pen (NEDIB) takes over', door, w0)
    c.section('the print: the leap and the turn; the final B-flat rings out', w0, end)
    V.thin(c, {'vo': dict(drop={'harp', 'snare_taps', 'timp', 'glock', 'vln1', 'vla_d', 'vln2_d'},
                          soften={'cb_m': 0.7}),
               'talk': dict(drop={'glock'}, soften={'vla_d': 0.72, 'vln2_d': 0.72, 'snare_taps': 0.6, 'harp': 0.8}),
               'mas': dict(drop={'glock', 'harp', 'timp'}, soften={'vla_d': 0.65, 'vln2_d': 0.65, 'snare_taps': 0.5}),
               'real': dict(drop={'glock', 'harp', 'vln1', 'vla_d', 'vln2_d', 'snare_taps', 'timp'})},
           t1=door - 0.05)
    meta = dict(
        id='wh_pomp', title='The White House (Ep1 v3, Act Two sc 13)', mm='MM-19 (family)', usage='BI',
        family='P13 THE PODIUM (NEDIB\'s chamber colours)', tone='light chamber pomp, then the Fountain Pen signs it',
        scenes=['Ep1 v3 Act Two sc 13'], motifs=['a pomp theme (B-flat pentatonic)', 'the Fountain Pen (NEDIB): the '
                                                  'flat line on the door, the leap and turn on the print'],
        motif_ids=[], key='B-flat major (the dominant is F9sus4: no third over F)',
        composer='v3-score-a (composer X), 2026-09-27', underscore_lufs=-20.0, album_lufs=-16.0,
        sfx_slots=[dict(t=round(c.clk(f), 3), sfx='a freeze hit (the card)') for f in freezes]
        + [dict(t=round(c.clk(t), 3), sfx='landing_thunk (a tripod)') for t in tl.snd_any('landing_thunk', 0, door)],
        audition=['0-30 s: the pomp: light and straight, never Sousa or an anthem; thin enough under the talk',
                  'the pan (13.07): the theme\'s held note on his look at the lens: wry, not a button',
                  'the door (13.11): the flat line on the straight mute under his V.O.: the president arriving, '
                  'Mas not turning',
                  'the print (13.14): the leap and the turn sign the photo; the B-flat rings out into the bridge'])
    sc = c.finish(T, meta, length_end=ring_end,
                  end_fade=((end - 1.8, end - 0.02) if ring_end <= end else (end - 0.4, ring_end - 0.02)))
    return c, sc


# ================================================================== SENATE (a lighter Under Oath: D-flat over the court's F)
SEN_LOOP = ['Dbmaj9', 'Gbmaj7#11', 'Ebm9', 'F7susb9']
SEN = {
    'Dbmaj9':    dict(root='Db2', fifth='Ab2', pad=['Ab2', 'F3', 'C4', 'Eb4'], ped=['Db2', 'Ab2'],
                      asides=['Eb5/8 Ab4/8 C5/4', 'F4/8 Ab4/8 Eb5/4', 'C5/8 Eb5/8 Ab4/4']),
    'Gbmaj7#11': dict(root='Gb1', fifth='Db2', pad=['Db3', 'F3', 'Bb3', 'C4'], ped=['Gb1', 'Db2'],
                      asides=['C5/8 F4/8 Bb4/4', 'Db5/8 F4/8 C5/4', 'Bb4/8 C5/8 F5/4']),
    'Ebm9':      dict(root='Eb2', fifth='Bb2', pad=['Gb3', 'Db4', 'F4'], ped=['Eb2', 'Bb2'],
                      asides=['F4/8 Bb4/8 Eb5/4', 'Db5/8 Bb4/8 F5/4', 'Gb4/8 Bb4/8 Db5/4']),
    'F7susb9':   dict(root='F1', fifth='C2', pad=['Bb3', 'Eb4', 'Gb4'], ped=['F1', 'C2'],
                      asides=['Gb4/8 Bb4/8 Eb5/4', 'C5/8 Gb4/8 Bb4/4', 'Eb5/8 C5/8 Gb4/4']),
}


def tracks_sen():
    T = palette()
    for k in ('vc', 'cb', 'vla'):
        T[k].sends = {'hall': -11, 'room': -14}
    dup(T, 'vc', 'vc_p', gain_db=-1.0)                     # the pizz two-feel
    dup(T, 'cb', 'cb_p', gain_db=-3.0)
    T['cb_p'].eq = list(T['cb_p'].eq) + [V.PIZZ_NOTCH]
    dup(T, 'vc', 'vc_ped', gain_db=-2.0)                   # the low-string pedal (the real lines)
    dup(T, 'cb', 'cb_ped', gain_db=-4.0)
    T['bsn'].gain_db, T['bsn'].sends = -4.0, {'room': -12}
    T['tpt'].gain_db, T['tpt'].sends = -6.0, {'room': -10, 'hall': -14}
    T['tpt'].eq = [('peq', 1760, -7.0, 3.0), ('peq', 3000, -6.0, 0.8), ('hs', 4500, -4.0)]   # out of the voices' band
    T['brush'].gain_db = 7.0
    T['swish'].gain_db = 1.0
    T['jazz'].gain_db = 2.0
    T['vla'].gain_db = -4.0
    return T


def senate_groove(c, t_from, t_to, first_chord=0, asides=True, freeze=None, reserve=()):
    """the two-feel: pizz root on 1 (with the bassoon, dry), the fifth on 3, a pickup on the and-of-4; brushes;
    a viola pad; straight-mute asides in the gaps (one per gap, never on a line)"""
    tl = c.tl
    b0 = int(round((t_from - c.bar1) / BAR)) + 1
    b = b0
    k = first_chord
    while c.bar(b) < t_to - 0.3:
        t = c.bar(b)
        name = SEN_LOOP[k % len(SEN_LOOP)]
        v = SEN[name]
        nxt = SEN[SEN_LOOP[(k + 1) % len(SEN_LOOP)]]
        d = min(BAR, t_to - t)
        c.n('vc_p', v['root'].replace('1', '2') if v['root'].endswith('1') else v['root'], t, 0.5, 0.5, art='pizz')
        c.n('cb_p', v['root'], t, 0.5, 0.42, art='pizz')
        if k % 2 == 0:
            c.n('bsn', v['root'].replace('1', '2') if v['root'].endswith('1') else v['root'], t, 0.22, 0.36)
        if t + 2 * Q < t_to:
            c.n('vc_p', v['fifth'], t + 2 * Q, 0.45, 0.42, art='pizz')
        if t + 3.5 * Q < t_to:                                  # the pickup into the next root (a semitone above)
            r = nm(nxt['root']) + 12 if nxt['root'].endswith('1') else nm(nxt['root'])
            c.n('vc_p', r + 1, t + 3.5 * Q, 0.25, 0.34, art='pizz')
        c.n('vla', v['pad'][-1], t, d * 0.96, 0.16, art='sus', att=0.4, rel=0.5, lp=2600.0)
        Drums(c.a, 'brushes').play('sweep: ~~~~~~~~\ntap: ..o...o.', bars=(b, b + 1), vel=0.5)
        b += 1
        k += 1
    if asides:
        n = 0
        for g0, g1 in tl.gaps(t_from + 0.3, t_to - 0.2, min_len=1.3, pad_before=0.25, pad_after=0.3):
            t = c.next8(g0)
            name = SEN_LOOP[(first_chord + int((t - t_from) // BAR)) % len(SEN_LOOP)]
            text = SEN[name]['asides'][n % 3]
            if t + V.line_len(text) > g1 or (freeze and freeze - 0.1 < t < freeze + Q):
                continue
            if any(t < r1 and t + V.line_len(text) > r0 for r0, r1 in reserve):
                continue
            V.phrase(c, 'tpt', t, text, 0.32, art='straight', rel=0.1)
            c.mark(t, 'a straight-mute aside (a gap)')
            n += 1


def real_pedals(c, t_from, t_to, first_chord, bar_first):
    """a low-string pedal under every real line: the chord of the moment's root and fifth, bowed, silent attack"""
    for l in c.tl.lines_in(t_from, t_to, kinds={'real'}):
        a0, a1 = max(t_from, l['on'] - 0.35), min(t_to, l['end'] + 0.25)
        k = first_chord + int((l['on'] - bar_first) // BAR) if l['on'] >= bar_first else first_chord - 1
        v = SEN[SEN_LOOP[k % len(SEN_LOOP)]]
        c.rebow('vc_ped', v['ped'][1], a0, a1, 0.2, first_att=0.35, last_rel=0.6, art='sus', lp=1200)
        c.rebow('cb_ped', v['ped'][0], a0, a1, 0.16, first_att=0.35, last_rel=0.6, art='sus', lp=900)
        c.mark(a0, f'a low-string pedal only under the real line ({l["id"]})', hit=False)
        c.mark(a1, f'the pedal lets go after the real line ({l["id"]}); the groove, if any, goes on', hit=False)


SEN_THIN = {'real': dict(drop={'vc_p', 'cb_p', 'bsn', 'tpt', 'vla', 'jazz', 'brush', 'swish'}),
            'talk': dict(drop={'tpt'}, soften={'bsn': 0.7, 'vc_p': 0.85, 'jazz': 0.8, 'brush': 0.8}),
            'mas': dict(drop={'tpt', 'bsn'}, soften={'vc_p': 0.75, 'cb_p': 0.8, 'jazz': 0.7, 'brush': 0.7})}


def cue_senate_a(tl):
    start = tl.B('15.01')
    groove0 = tl.B('15.02')
    stop = tl.B('15.12')
    c = V.Cue('senate_a', tl, anchor=groove0, anchor_bar=3, bars=30, swing=0.0)
    T = tracks_sen()
    freeze = tl.B('15.04') if tl.has('15.04') else None
    # v3.2: the ask comes before the wallet (15.10 -> 15.15 -> 15.16 -> 15.11): the pedal only under his real line
    # (MM-20 thins to its low strings, as under every real line); the straight mute's one rising line goes to the
    # senators' delight (15.16), in the gap after his line
    ask = None
    if ask_before_wallet(tl):
        sheet_end = max([l['end'] for l in tl.lines_in(tl.B('15.15'), tl.E('15.15'))] + [tl.B('15.15')])
        nxt = [l['on'] for l in tl.lines_in(sheet_end + 0.05, stop)]
        a0 = c.next8(max(sheet_end + 0.3, tl.B('15.16') if tl.has('15.16') else sheet_end + 0.3))
        a1 = (min(nxt) - 0.25) if nxt else stop - 0.3
        if a1 - a0 > 1.3:
            ask = (a0, a1)
    # the court's F under the clone's real line (the voice finds a mouth): a bowed pedal
    c.rebow('vc_ped', 'C3', start, groove0 + 0.3, 0.18, first_att=0.6, last_rel=0.5, art='sus', lp=1200)
    c.rebow('cb_ped', 'F1', start, groove0 + 0.3, 0.16, first_att=0.6, last_rel=0.5, art='sus', lp=900)
    c.mark(start, 'the court\'s F: a bowed pedal under the clone\'s real line', hit=False)
    senate_groove(c, groove0, stop, 0, freeze=freeze, reserve=[ask] if ask else [])
    real_pedals(c, groove0, stop, 0, groove0)
    V.thin(c, SEN_THIN, t0=groove0 - 0.01)
    if ask:
        V.phrase(c, 'tpt', ask[0], 'Ab4/8 Db5/8 Eb5/8 Ab5/4.', 0.36, art='straight', rel=0.14, stop_at=ask[1])
        c.mark(ask[0], 'PLEASE REGULATE ME, handed over: the straight mute\'s one rising line as the senators lean in')
    if freeze is not None:
        V.drop_window(c, freeze, freeze + Q, keep=('vc_ped', 'cb_ped', 'vla'))
        c.n('vla', 'C4', freeze - 0.02, Q + 0.2, 0.18, art='sus', att=0.02, rel=0.3)
        c.mark(freeze, 'Sucram\'s card: the groove holds its beat', hit=False)
    V.clip_before(c, stop, rel=0.05)
    c.mark(stop, 'THE WALLET: the music stops (3 ms; the room\'s air under it)', hit=False)
    c.section('the court\'s F under the real line', start, groove0)
    c.section('a lighter Under Oath: the pizz two-feel, brushes, the mute\'s asides' + (' (v3.2: the ask, his real '
              'line on the pedal; the senators\' delight on the mute)' if ask else ''), groove0, stop)
    meta = dict(
        id='senate_a', title='The Senate, to the wallet (Ep1 v3, Act Two sc 15)', mm='MM-20 (family)', usage='BI',
        family='P02 PROCEDURE (the court), lighter', tone='procedural comedy: deadpan pizzicato, brushes, a muted aside',
        scenes=['Ep1 v3 Act Two sc 15 (15.01-15.11)'], motifs=[], motif_ids=[],
        key='D-flat major over the court\'s F (F phrygian colour); no A anywhere',
        composer='v3-score-a (composer X), 2026-09-27', underscore_lufs=-21.0, album_lufs=-16.0,
        sfx_slots=([dict(t=round(c.clk(t), 3), sfx='rubber_stamp_C (Sucram, mid-slide: CALLED IT)') for t in
                    tl.snd_any('rubber_stamp_C', tl.B('15.15'), tl.E('15.15'))] if ask_before_wallet(tl) else []),
        silence_windows=[(c.clk(stop) + 0.005, c.clk(stop) + 0.5, 'the wallet: the stop', -90.0)],
        audition=['the two-feel under the hearing: light and deadpan, never Law & Order or a Perry Mason swell',
                  'the pedal under each real line: dry enough (no motion on the record)',
                  'the stop on the wallet: punctuation, with the room under it'])
    sc = c.finish(T, meta, length_end=stop + 0.02, mutes=[(stop, stop + 3.0)])
    return c, sc


def ask_before_wallet(tl):
    """v3.2 (draft 8.1): the committee asks for his ask (15.10), he gives it (15.15), the senators want to sign (15.16),
    and only then "Would you come and run it?" and the wallet; in v3 and v3.1 the ask came after the wallet"""
    return tl.has('15.15') and tl.has('15.12') and tl.B('15.15') < tl.B('15.12')


def senate_b_in(tl):
    """MM-20's re-entry: 0.3 s after his last word in 15.14 ("...i have no equity in nopeai.")"""
    mas_eq = [l for l in tl.lines if l['beat'] == '15.14' and l['who'] == 'mas']
    return (mas_eq[-1]['end'] + 0.3) if mas_eq else tl.B('15.14') + 5.0


def cue_senate_b(tl):
    t_re = senate_b_in(tl)
    end = tl.B('16.01')                                     # the tour's first stamp cuts it (v3, v3.1, v3.2)
    v32 = ask_before_wallet(tl)
    # (v3.2: about a second of score, so the file starts two bars early, silent: the engine's meters need 3 s)
    c = V.Cue('senate_b', tl, anchor=t_re, anchor_bar=3 if v32 else 1, bars=10, swing=0.0)
    T = tracks_sen()
    stamp = None
    if v32:
        # v3.2 (15.14): "MM-20 back on a new phrase; a held beat on the two of them; the tour's stamp thunks in
        # under it": after "...no equity" the groove comes back on a downbeat (a bar of it when there is room), then
        # the F7sus(b9) hangs until the tour's stamp
        back = t_re + BAR if end - t_re >= BAR + 0.8 else t_re
        if back > t_re:
            senate_groove(c, t_re, back, 0, asides=False)
            real_pedals(c, t_re, back, 0, t_re)
    else:
        # the back of the sheet (15.17) and the stare (15.18) are cut in v3.1: the hang goes under the dais (15.16)
        back = tl.B('15.17') if tl.has('15.17') else (tl.B('15.16') if tl.has('15.16') else end - 3.0)
        stamp = tl.snd('15.15', 'rubber_stamp_C', default=tl.B('15.15') + 1.4)
        senate_groove(c, t_re, back, 0, asides=False)
        real_pedals(c, t_re, back, 0, t_re)
        # the ask: one rising line on the straight mute before Sucram's stamp
        sheet = tl.B('15.15')
        ask0 = c.next8(max(sheet, max([l['end'] for l in tl.lines_in(t_re, sheet + 0.5)] + [sheet]) + 0.1))
        if stamp - ask0 > 1.0:
            V.phrase(c, 'tpt', ask0, 'Ab4/8 Db5/8 Eb5/8 Ab5/4.', 0.36, art='straight', rel=0.14, stop_at=stamp - 0.08)
            c.mark(ask0, 'PLEASE REGULATE ME: the straight mute\'s one rising line, before the stamp')
    # the hang (F7sus-flat9) under the stare / the two of them; the tour's stamp cuts it
    V.clip_before(c, back, rel=0.4)
    V.drop_window(c, back, end + 1.0)
    if v32:                        # the new phrase's downbeat: the pizz F and the bassoon, dry
        c.n('vc_p', 'F2', back, 0.5, 0.5, art='pizz')
        c.n('cb_p', 'F1', back, 0.5, 0.42, art='pizz')
        c.n('bsn', 'F2', back, 0.22, 0.36)
    for inst, p, v in (('vc_ped', 'C3', 0.2), ('cb_ped', 'F1', 0.16), ('vla', 'Gb4', 0.16), ('vla', 'Eb4', 0.15),
                       ('vla', 'Bb3', 0.15)):
        c.n(inst, p, back, end - back + 0.3, v, art='sus', att=0.3 if not v32 else 0.12, rel=0.2, lp=2400)
    c.n('tpt', 'Gb4', back + 0.05, min(1.2, end - back), 0.26, art='straight', rel=0.3)
    if v32:
        c.mark(back, 'MM-20 back on a new phrase after "...no equity": F7sus(b9) held on the two of them; the tour\'s '
               'stamp cuts it')
    else:
        c.mark(back, 'F7sus(b9) hangs (under the back of the sheet; v3.1: under the dais); the tour\'s stamp cuts it',
               hit=False)
    V.thin(c, SEN_THIN, t0=t_re, t1=back)
    if v32:
        if back > t_re:
            c.section('back on a new phrase after "...no equity"', t_re, back)
        c.section('F7sus(b9) held on the two of them, cut by the tour\'s stamp (v3.2)', back, end)
    else:
        c.section('back on a new phrase after "...no equity"; the ask; the stamp', t_re, back)
        c.section('F7sus(b9) held (the back of the sheet; v3.1: the dais), cut by the tour\'s stamp', back, end)
    meta = dict(
        id='senate_b', title='The Senate, after the wallet (Ep1 v3, Act Two sc 15)', mm='MM-20 (family)', usage='BI',
        family='P02 PROCEDURE (the court), lighter',
        tone=('the re-entry after his last word, a suspension held, the tour\'s stamp' if v32 else
              'the ask, the stamp, a suspension left hanging'),
        scenes=['Ep1 v3 Act Two sc 15 (' + ('15.14' if v32 else '15.14-15.18') + ')'], motifs=[], motif_ids=[],
        key='D-flat major over the court\'s F; F7sus(b9) left hanging',
        composer='v3-score-a (composer X), 2026-09-28', underscore_lufs=-21.0, album_lufs=-16.0,
        sfx_slots=[dict(t=round(c.clk(stamp), 3), sfx='rubber_stamp_C (Sucram, mid-slide)')] if stamp else [],
        audition=['the re-entry after "...no equity": a new phrase, not a restart glitch',
                  'the F7sus(b9) held, cut by the tour\'s stamp: a hang, not a mistake'])
    sc = c.finish(T, meta, length_end=end)
    return c, sc


# ================================================================== RUN_ROOF · the tour poster, then the rooftop pad
RUN = {   # the knee stab: the title's quartal C F Bb Eb (brass) over a moving bass, one per stamp
    'Ab69':    dict(bass='Ab1', b2='Ab2', shift=0, pad=['Ab2', 'Eb3', 'C4', 'G4']),
    'Dbmaj9':  dict(bass='Db2', b2='Db3', shift=5, pad=['Db3', 'Ab3', 'C4', 'F4']),
    'Bbm11':   dict(bass='Bb1', b2='Bb2', shift=2, pad=['Bb2', 'F3', 'Db4', 'Eb4']),
    'Eb69sus': dict(bass='Eb2', b2='Eb3', shift=-5, pad=['Eb3', 'Bb3', 'C4', 'F4']),
}
RUN_ORDER = ['Ab69', 'Dbmaj9', 'Bbm11', 'Eb69sus']
BUILD_AB = ['Ab4', 'Ab4', 'Bb4', 'C5', 'Eb5', 'C5', 'Bb4', 'Ab4', 'Ab4', 'Ab4', 'Bb4', 'C5', 'Eb5', 'G5', 'Eb5', 'C5']
ROOF = {   # the rooftop pad: grand, then uneasy (strings; horns on the first)
    'Abmaj9':    ['Ab2', 'Eb3', 'C4', 'G4', 'Bb4'],
    'Dbmaj9#11': ['Db3', 'Ab3', 'C4', 'Eb4', 'G4'],
    'Bbm9':      ['Bb2', 'F3', 'Db4', 'C5'],
    'C7susb9':   ['C3', 'F3', 'Bb3', 'Db4', 'Eb4'],
}


def tracks_run():
    T = palette()
    T['lead'].gain_db, T['lead'].sends = -3.0, {'room': -14, 'snes': -16}
    T['lead'].eq = [('hp', 220), ('lp', 5500), ('hs', 2400, -4.0)]
    T['lead2'].gain_db, T['lead2'].eq = -6.0, [('lp', 5000)]
    T['xylo'].gain_db = -12.0
    T['ubass'].gain_db = -1.0
    T['ubass'].eq = list(T['ubass'].eq) + [V.PIZZ_NOTCH]
    T['brush'].gain_db = 9.0
    T['jazz'].gain_db = 4.0
    for k in ('tpt', 'tbn'):
        T[k].gain_db = -6.0
    T['timp'].gain_db = -5.0
    for k in ('vln1', 'vln2', 'vla', 'vc', 'cb'):
        T[k].sends = {'hall': -9, 'room': -16}
        T[k].gain_db = -2.0
    dup(T, 'vln2', 'vln2_pz', gain_db=-4.0)
    T['hn'].gain_db, T['hn'].sends = -7.0, {'hall': -8}
    T['harp'].gain_db, T['harp'].pan = -4.0, -0.35
    return T


def cue_run_roof(tl):
    stamps = sorted(tl.snd_any('rubber_stamp_C', tl.B('16.01') - 0.01, tl.E('16.01')))
    s1 = stamps[0] if stamps else tl.B('16.01')
    stamps = (stamps + [s1 + 1.2, s1 + 5.2, s1 + 6.1])[:4] if len(stamps) < 4 else stamps[:4]
    run_end = tl.E('16.01')
    reg = tl.B('17.03')
    c = V.Cue('run_roof', tl, anchor=s1, anchor_bar=1, bars=12, swing=0.0)
    T = tracks_run()
    edges = stamps + [run_end]

    def chord_at(t):
        k = max(i for i in range(4) if stamps[i] <= t + 1e-6)
        return RUN[RUN_ORDER[k]]

    # the 16th engine: the Build's chip arpeggio (following the stamp chords), brushes, bass; layers per stamp
    t = s1
    i = 0
    while t < run_end - 1e-3:
        ch = chord_at(t)
        k = sum(1 for s in stamps if s <= t + 1e-6)             # layers so far
        p = nm(BUILD_AB[i % 16]) + ch['shift']
        acc = (1.0, 0.72, 0.84, 0.72)[i % 4]
        c.n('lead', p, t, V.S16 * 0.62, 0.32 * acc, True, duty=0.25, att=0.002, dec=0.09, sus=0.45, rel=0.035)
        if k >= 2 and i % 4 == 0:
            c.n('xylo', p, t, 0.2, 0.34)
        if k >= 2 and i % 2 == 0:
            c.n('vln2_pz', p - 12, t, 0.2, 0.3, art='pizz')
        if i % 4 == 0:
            beat = (i // 4) % 4
            c.n('ubass', ch['b2'] if beat in (0, 2) else nm(ch['b2']) + 7, t, Q * 0.85, 0.5 if beat in (0, 2) else 0.42)
        t += V.S16
        i += 1
    nb = int((run_end - s1) / BAR) + 1
    Drums(c.a, 'brushes').play('tap: xgoXgoxgXgoxgoXg\nkick[vel=0.45]: x.......x.......', bars=(1, nb + 1), vel=0.62)
    # layer 3: strings on the third stamp; layer 4: the whole band on the last
    if len(stamps) > 2:
        for inst, p in zip(('vln1', 'vla', 'vc'), ('Db5', 'F4', 'Bb2')):
            c.n(inst, p, stamps[2], stamps[3] - stamps[2] + 0.05, 0.3, art='sus', att=0.05, rel=0.2)
    # the knee stabs, one per stamp (the title's quartal C F Bb Eb; bass moves)
    for k, st in enumerate(stamps):
        ch = RUN[RUN_ORDER[k]]
        vv = (0.55, 0.6, 0.64, 0.74)[k]
        V.stab(c, 'tpt', ['Eb5', 'Bb4'], st, vel=vv, length=0.22 + 0.06 * k)
        V.stab(c, 'tbn', ['F4', 'C4'], st, vel=vv * 0.95, length=0.24 + 0.06 * k)
        c.n('lead2', 'Eb5', st, 0.18, 0.3 + 0.03 * k, True, duty=0.125, att=0.002, dec=0.12, sus=0.2, rel=0.06)
        c.n('cb', ch['bass'], st, 0.5, 0.5, art='pizz')
        c.mark(st, f'the knee stab on stamp {k + 1} (C F Bb Eb over {ch["bass"][:-1]})')
    c.n('timp', 'Eb2', stamps[3], 1.2, 0.5)
    # thin under the quote strip and his post (the record plays dry: the layer holds, the stab waits)
    strip = [o['t'] for o in tl.onscreen if o['beat'] == '16.01' and V.is_real(o['text'])]
    for t0 in strip:
        for nt in c.a.notes:
            s = c.clk.x(nt.start)
            if t0 - 0.05 <= s < t0 + 1.4 and nt.inst in ('lead', 'xylo', 'vln2_pz'):
                nt.vel *= 0.6
    # the engine stops on the cut (the last stab's chord rings on in the pad)
    V.clip_before(c, run_end, insts={'lead', 'xylo', 'vln2_pz', 'ubass', 'jazz', 'brush', 'swish', 'vln1', 'vla',
                                     'vc'}, rel=0.05)
    V.drop_window(c, run_end, run_end + 60, insts={'lead', 'xylo', 'vln2_pz', 'ubass', 'jazz', 'brush', 'swish'})
    c.section('THE RUN: the poster, a knee stab per stamp', s1, run_end)
    # ---- the rooftop: the last stab rings into a held pad, grand, then uneasy
    mario = [l for l in tl.lines_in(tl.B('17.02'), reg) if l['who'] == 'mario']
    masl = [l for l in tl.lines_in(tl.B('17.02'), reg) if l['who'] == 'mas']
    ch_t = [(stamps[3], 'Eb69sus')]
    ch_t.append((run_end, 'Abmaj9'))
    ch_t.append(((mario[0]['end'] + 0.2) if mario else run_end + 7.0, 'Dbmaj9#11'))
    ch_t.append(((mario[1]['end'] + 0.2) if len(mario) > 1 else run_end + 10.0, 'Bbm9'))
    ch_t.append(((masl[0]['end'] + 0.15) if masl else run_end + 13.0, 'C7susb9'))
    xf_end = reg + 0.7
    PADS = dict(ROOF, Eb69sus=['Eb3', 'Bb3', 'C4', 'F4'])
    for j, (t0, name) in enumerate(ch_t):
        t1 = ch_t[j + 1][0] if j + 1 < len(ch_t) else xf_end
        for inst, p in zip(('vc', 'vla', 'vln2', 'vln1', 'vln1'), PADS[name]):
            c.n(inst, p, t0, t1 - t0 + 0.6, 0.2 if name != 'Abmaj9' else 0.24, art='sus',
                att=(0.05 if j == 0 else 0.7), rel=0.6 if j + 1 < len(ch_t) else 0.4, lp=4000)
        c.mark(t0, f'the rooftop pad: {name}', hit=False)
    c.n('cb', 'Ab1', run_end, (ch_t[2][0] - run_end) + 0.4, 0.18, art='sus', att=0.3, rel=0.6)
    for k, p in enumerate(['Ab2', 'Eb3', 'Ab3', 'C4', 'Eb4', 'G4']):
        c.n('harp', p, run_end + 0.03 * k, 2.2, 0.46)
    c.n('hn', 'Eb3', run_end, 6.0, 0.3, art='sus', att=0.4, rel=1.5)
    c.n('hn', 'C4', run_end, 6.0, 0.28, art='sus', att=0.4, rel=1.5)
    c.section('the rooftop: the pad, grand (the statement plays dry)', run_end, ch_t[2][0])
    c.section('the sheet: uneasy (Dbmaj9#11, Bbm9, C7sus-flat9 on the knife)', ch_t[2][0], xf_end)
    run_gain = 4.0
    macro = [(s1 - 0.5, run_gain), (run_end - 0.02, run_gain), (run_end + 0.8, 0.0), (xf_end + 1.0, 0.0)]
    meta = dict(
        id='run_roof', title='The Regulate-Me Tour / the rooftop pad (Ep1 v3, Act Two sc 16-17)', mm='MM-03 (family)',
        usage='BI', family='P07 THE RUN -> a held pad', tone='the run, then grand, then uneasy',
        scenes=['Ep1 v3 Act Two sc 16-17 (to the register)'],
        motifs=['the Build\'s chip arpeggio (A-flat)', 'the knee stab (the title\'s quartal C F Bb Eb)'],
        motif_ids=[], key='A-flat major; the pad Abmaj9 -> Dbmaj9#11 -> Bbm9 -> C7sus(b9)',
        composer='v3-score-a (composer X), 2026-09-27', underscore_lufs=-19.0, album_lufs=-16.0,
        sfx_slots=[dict(t=round(c.clk(st), 3), sfx='rubber_stamp_C (+ the timeline\'s synth:stab: the score owns '
                        'the stab; see README)') for st in stamps],
        audition=['the run: momentum without "upbeat corporate"; one stab per stamp, never a rimshot',
                  'the stop on the cut and the ring into the pad: a breath, not a hole',
                  'the pad: grand under the statement, then uneasy on "we\'ll read it."'])
    sc = c.finish(T, meta, length_end=xf_end, macro=macro, end_fade=(reg - 0.1, xf_end - 0.02))
    return c, sc


# ================================================================== UPSELL · Nesnej (F dorian, double-time swing)
UP_CH = {   # comping voicings (grand), walk roots and scales; no A-natural (F minor takes Db in the walk, MM-05)
    'Fm11':     dict(root='F2', comp=['Ab3', 'C4', 'Eb4', 'Bb4'], sc=['F2', 'G2', 'Ab2', 'Bb2', 'C3', 'Db3', 'Eb3']),
    'Bb13':     dict(root='Bb1', comp=['Ab3', 'D4', 'G4'], sc=['Bb1', 'C2', 'D2', 'Eb2', 'F2', 'G2', 'Ab2']),
    'C7#9b13':  dict(root='C2', comp=['E3', 'Bb3', 'Eb4', 'Ab4'], sc=['C2', 'Db2', 'Eb2', 'E2', 'G2', 'Ab2', 'Bb2']),
    'Dbmaj9#11': dict(root='Db2', comp=['F3', 'C4', 'Eb4', 'G4'], sc=['Db2', 'Eb2', 'F2', 'G2', 'Ab2', 'Bb2', 'C3']),
    'Bbm9':     dict(root='Bb1', comp=['Db4', 'F4', 'Ab4', 'C5'], sc=['Bb1', 'C2', 'Db2', 'Eb2', 'F2', 'Gb2', 'Ab2']),
}
UP_BARS = ['Fm11', 'Bb13', 'Fm11', 'C7#9b13', 'Fm11', 'Dbmaj9#11', 'Bbm9', 'Bbm9']
SW16 = 0.66 * V.S16 / 3.0          # MM-05's swung 16th: the off-16th lands late (grid swing 0.66 on 16ths)


def tracks_up():
    T = palette()
    T['ubass'].gain_db = -2.0
    T['cb_pizz'].gain_db = -10.0
    T['cb_pizz'].eq = list(T['cb_pizz'].eq) + [('peq', 112.0, -10.0, 5.0)]
    T['grand'].gain_db, T['grand'].sends = 0.5, {'room': -12, 'hall': -18}
    T['vibes'].gain_db, T['vibes'].sends = -3.0, {'room': -12, 'hall': -14}
    T['tpt'].gain_db, T['tpt'].sends = -3.0, {'room': -10, 'hall': -14}
    T['tpt'].latency_ms = 12
    T['tpt'].eq = [('peq', 1760, -7.0, 3.0), ('peq', 3000, -4.0, 0.8)]
    T['tbn'].gain_db = -1.0
    T['bsax'].gain_db = -1.0
    T['arp'].gain_db, T['arp'].sends = 6.0, {'snes': -16, 'room': -16}
    T['arp'].eq = [('lp', 5000), ('hs', 2200, -7.0)]      # the GPU clock: nothing above Eb6 (the KA-CHING's F6+C7)
    T['lead'].gain_db, T['lead'].eq = -2.0, [('lp', 5500), ('hs', 2400, -5.0)]
    T['jazz'].gain_db, T['jazz'].eq = 13.0, [('peq', 3800, -4.0, 0.7)]
    T['brush'].gain_db = 13.0
    T['swish'].gain_db = 6.0
    return T


def cue_upsell(tl):
    slot = tl.snd('17.07', 'ka_ching', default=tl.B('17.07') + 0.6)
    reg = tl.B('17.03')
    stop = tl.B('17.11')
    c = V.Cue('upsell', tl, anchor=slot, anchor_bar=5, bars=10, swing=0.0)
    T = tracks_up()
    freeze = tl.B('17.04') if tl.has('17.04') else None
    nes = [l for l in tl.lines_in(reg, slot) if l['kind'] == 'real']
    t_in = c.next8(reg - 0.02)

    def when(b, beat):             # 16th positions with MM-05's swing on the off-16ths
        f = (beat - 1.0) * 4.0
        t = c.bt(b, beat)
        return t + (SW16 if abs(f - round(f)) < 1e-6 and int(round(f)) % 2 == 1 else 0.0)

    # the walk: eighths (the 192 feel's quarters) from the register's roll; the chord's scale, then an approach
    import numpy as _np
    rng = _np.random.default_rng(1705)
    prev = nm('F2')
    for b in range(1, 8):
        name = UP_BARS[b - 1]
        nxt = UP_BARS[b] if b < len(UP_BARS) else 'Fm11'
        scl = [nm(p) for p in UP_CH[name]['sc']]
        root = nm(UP_CH[name]['root'])
        seq = [root]
        idx = 0
        for k in range(1, 7):
            idx = max(0, min(len(scl) - 1, idx + int(rng.choice([1, 1, 2, -1]))))
            seq.append(scl[idx] + (12 if scl[idx] < nm('E1') else 0))
        tgt = nm(UP_CH[nxt]['root'])
        seq.append(tgt + 1 if seq[-1] > tgt else tgt - 1)
        for k, p in enumerate(seq):
            t = c.bt(b, 1.0 + 0.5 * k)
            if t < t_in - 1e-3 or t >= stop - 0.01:
                continue
            if abs(t - slot) < 0.05:
                continue                                        # the slot: the KA-CHING's downbeat
            c.n('ubass', p, t, Q * 0.46, 0.7 if k % 2 == 0 else 0.62)
            c.n('cb_pizz', p, t, Q * 0.36, 0.48, rel=0.16)
        prev = seq[-1]
    # drums: brushes before the slot, sticks after (featured)
    Drums(c.a, 'brushes').play('sweep: ~~~~~~~~~~~~~~~~\ntap[vel=0.8]: x.Xgx.Xgx.Xgx.Xg\nhatf: ....x.......x...',
                               bars=(1, 5), vel=0.8)
    Drums(c.a, 'jazz').play('ride[vel=0.6]: x.Xox.Xox.Xox.Xo\nhatf[vel=0.7]: ..x...x...x...x.\n'
                            'kick[vel=0.3]: o...o...o...o...\nsnare[vel=0.45]: .......g.....x..', bars=(5, 8), vel=0.9)
    V.drop_window(c, c.bar1 - 1.0, t_in - 0.001)                  # nothing before the register rolls in
    # the comp (grand): a rootless chord on swung-16th anticipations
    for b in range(1, 8):
        v = UP_CH[UP_BARS[b - 1]]['comp']
        for beat, d in ((1.0, 0.35), (2.75, 0.25), (4.25, 0.4)):
            t = when(b, beat)
            if t_in <= t < stop - 0.05:
                c.ch('grand', v, t, d * Q, 0.4, roll=0.005)
    # the GPU clock (chip, 12.5 %): 16th arpeggios; it stops one beat before the slot
    for b in range(1, 8):
        v = UP_CH[UP_BARS[b - 1]]['comp']
        ps = [nm(p) + 12 for p in v] + [nm(p) + 24 for p in v[:1]]
        for k in range(16):
            t = when(b, 1.0 + 0.25 * k)
            if t < t_in or t >= stop - 0.01 or (slot - Q - 0.01 <= t < slot + Q):
                continue
            p = ps[(k if (k // 4) % 2 == 0 else -k) % len(ps)]
            while p > nm('Eb6'):
                p -= 12
            c.n('arp', p, t, V.S16 * 0.6, 0.24, True, duty=0.125, att=0.002, dec=0.08, sus=0.3, rel=0.03)
    # THE UPSELL: each cell a step higher (vibes + straight mute in unison); none on the real line
    cells = [('C4', 'Eb4', 'F4', 'G4'), ('Eb4', 'F4', 'G4', 'Ab4'), ('F4', 'G4', 'Ab4', 'Bb4'), ('G4', 'Ab4', 'Bb4', 'C5'),
             ('Ab4', 'Bb4', 'C5', 'Db5'), ('Bb4', 'C5', 'Db5', 'Eb5')]
    starts = []
    t0 = c.next8((freeze + Q) if freeze else t_in + Q)
    starts.append(t0)
    b3 = c.bar(3)
    starts.append(b3 if b3 > t0 + 2.0 else t0 + 2.5)
    post = [c.bt(5, 2.0), c.bar(6), c.bar(7)]
    ci = 0
    for s in starts + post:
        if ci >= len(cells):
            break
        cell = cells[ci]
        ts = [s, s + 0.5 * Q, s + Q, s + 1.5 * Q]
        if any(c.tl.talking(t, t + 0.3, kinds={'real'}) for t in ts):
            continue
        feat = s >= slot
        vv = 0.5 if feat else 0.36
        for j, (p, t) in enumerate(zip(cell, ts)):
            d = (2.0 * Q if j == 3 else 0.45 * Q)
            if t >= stop - 0.01:
                break
            d = min(d, stop - t - 0.01)
            c.n('vibes', p, t, d, vv * (1.1 if j == 3 else 1.0), rel=0.6)
            c.n('tpt', p, t, d, vv * 1.05, art='straight', rel=0.12)
            if feat:
                c.n('lead', nm(p) + 12, t, min(d, 0.3), 0.26, True, duty=0.25, att=0.002, dec=0.1, sus=0.3,
                    rel=0.05)
        if feat and ts[3] < stop - 0.02:
            V.stab(c, 'bsax', ['F2'], ts[3], vel=0.56, length=0.3)
            V.stab(c, 'tbn', ['C3'], ts[3], vel=0.52, length=0.3)
        c.mark(s, f'the Upsell: cell {ci + 1} ({cell[0]} ... {cell[3]}), a step higher')
        ci += 1
    # THE CLOSE: C5 G4 F4 after his line, the bari/trombone fifth on the cut to his finger; the downbeat is the bell's
    line_end = max([l['end'] for l in nes] + [c.bt(4, 3.0)])
    tc = max(line_end + 0.03, c.bt(4, 3.0))
    tg = max(tc + 0.2, c.sw(4, 3.5) if tc < c.sw(4, 3.5) - 0.15 else tc + 0.28)
    tf = c.bt(4, 4.0)
    if tg >= tf - 0.12:
        tg = (tc + tf) / 2
    for p, t, d in (('C5', tc, tg - tc), ('G4', tg, tf - tg), ('F4', tf, slot - tf - 0.05)):
        c.n('vibes', p, t, d * 0.95, 0.5, rel=0.12)
        c.n('tpt', 'C5' if p == 'F4' else p, t, d * 0.95, 0.5, art='straight', rel=0.1)
    V.stab(c, 'bsax', ['F2'], tf, vel=0.66, length=0.36)
    V.stab(c, 'tbn', ['C3'], tf, vel=0.62, length=0.36)
    c.mark(tc, 'THE CLOSE: C5 G4 F4 (after his real line)')
    c.mark(tf, 'the close\'s fifth (bari F2 + trombone C3) on the cut to his finger')
    # the slot: nothing starts in the KA-CHING's beat, and nothing held rings into it
    V.drop_window(c, slot - 0.004, slot + Q - 0.004)
    V.clip_before(c, slot - 0.03, rel=0.1)
    c.mark(slot, 'THE SLOT: the KA-CHING (a timeline sound) is the downbeat; the band rests', hit=False)
    # the freeze card: the band holds its beat (no attacks)
    if freeze is not None:
        V.drop_window(c, freeze, freeze + Q, insts={'ubass', 'cb_pizz', 'grand', 'arp', 'vibes', 'tpt', 'jazz',
                                                    'brush', 'swish'})
        c.ch('grand', UP_CH['Fm11']['comp'], freeze - 0.03, Q + 0.1, 0.34, roll=0.004)
        c.mark(freeze, 'Nesnej\'s card: one held chord for its beat', hit=False)
    # thin: dry under the real line; softer under Mario
    V.thin(c, {'real': dict(drop={'vibes', 'tpt', 'lead', 'grand', 'bsax', 'tbn'}, soften={'arp': 0.7, 'jazz': 0.8}),
               'talk': dict(soften={'vibes': 0.8, 'tpt': 0.8, 'grand': 0.85, 'arp': 0.85}),
               'mas': dict(drop={'vibes', 'tpt'})}, t0=t_in, t1=slot - 0.01)
    c.mark(stop, 'THE CRACK: the score drops out mid-climb (3 ms); the bell decays alone', hit=False)
    c.section('the register rolls in: the walk, the GPU clock, the Upsell\'s cells (dry under his line)', t_in, tc)
    c.section('the close; the slot (the KA-CHING)', tc, slot + Q)
    c.section('phrase 3: the climb, featured; cut at the crack', slot + Q, stop)
    macro = [(t_in - 0.5, -1.0), (slot - 0.05, -1.0), (slot + 0.2, 2.5), (stop + 1.0, 2.5)]
    meta = dict(
        id='upsell', title='The More You Buy, to picture (Ep1 v3, Act Two sc 17)', mm='MM-05', usage='BI',
        family='P06 THE JOB', tone='a caper with a salesman\'s grin, played straight; the sale closes on the bell',
        scenes=['Ep1 v3 Act Two sc 17 (17.03-17.11)'],
        motifs=['THE UPSELL (cells a step higher each time; vibes + straight mute)', 'the close C G F + the F-C fifth',
                'the GPU clock (chip 12.5 %)'],
        motif_ids=[], key='F dorian / F minor blues; C7#9b13; no A-natural',
        composer='v3-score-a (composer X), 2026-09-27', underscore_lufs=-19.0, album_lufs=-16.0,
        sfx_slots=[dict(t=round(c.clk(slot), 3), sfx='ka_ching (F6 + C7): the downbeat; the band rests'),
                   dict(t=round(c.clk(slot + 0.02), 3), sfx='synth:bell: the register\'s bell, decaying to the black')],
        silence_windows=[(c.clk(stop) + 0.005, c.clk(stop) + 0.5, 'the crack: the drop-out', -90.0)],
        audition=['the register rolling in: THE JOB swing, charming, not LEVERAGE',
                  'the close into the KA-CHING: does the sale close on the bell?',
                  'phrase 3 cut at the crack: the climb that never lands, and the bell alone'])
    sc = c.finish(T, meta, length_end=stop + 0.02, mutes=[(stop, stop + 3.0)], macro=macro)
    return c, sc


CUES = {'wh': cue_wh, 'senate_a': cue_senate_a, 'senate_b': cue_senate_b, 'run_roof': cue_run_roof,
        'upsell': cue_upsell}


def lay(tl, built, work):
    """the lay-in: windows, fades and the hard stops (segment s)"""
    wav = lambda k: os.path.join(work, f'{built[k][1].name}-underscore.wav')   # noqa: E731
    T0 = lambda k: built[k][0].T0                                              # noqa: E731
    stop_wallet = tl.B('15.12')
    t_re = senate_b_in(tl)
    run_end = tl.E('16.01')
    reg = tl.B('17.03')
    crack = tl.B('17.11')
    up = built['upsell'][0]
    layers = [
        dict(name='wh_pomp', wav=wav('wh'), T0=T0('wh'), a0=0.0, a1=wh_ring_end(tl), fin=0.0, fout=0.3),
        dict(name='senate_a', wav=wav('senate_a'), T0=T0('senate_a'), a0=tl.B('15.01'), a1=stop_wallet, fin=0.4,
             fout=0.003),
        dict(name='senate_b', wav=wav('senate_b'), T0=T0('senate_b'), a0=t_re - 0.02, a1=tl.B('16.01'), fin=0.05,
             fout=0.06),
        dict(name='run_roof', wav=wav('run_roof'), T0=T0('run_roof'), a0=tl.B('16.01') - 0.004, a1=reg + 0.7,
             fin=0.004, fout=0.7),
        dict(name='upsell', wav=wav('upsell'), T0=T0('upsell'), a0=up.next8(reg - 0.02) - 0.05, a1=crack, fin=0.05,
             fout=0.003),
    ]
    stops = [(stop_wallet, t_re - 0.03), (crack, tl.length)]
    designed = [(wh_ring_end(tl), tl.B('15.01'), 'THE BRIDGE: no score (sc 14: the phone, the water, the plink)'),
                (stop_wallet, t_re, 'the wallet: the Senate\'s one stop (the room\'s air under it)'),
                (crack, tl.length, 'the act-out: the register\'s bell alone (a timeline sound), decaying')]
    return layers, stops, designed


def main():
    args, path, tag = V.cli(SEG)
    tl = V.TL(path)
    work = os.path.join(HERE, 'render', '_work', tag.lstrip('-'))   # render/_work/ (Kokoro), render/_work/el/ (git-ignored)
    built = {k: fn(tl) for k, fn in CUES.items()}
    if args.dry:
        for k, (c, sc) in built.items():
            print(k, V.note_qa(sc), f'file T0 {c.T0:.3f}')
        return
    if args.render is not None:
        for k in (args.render or list(CUES)):
            print(f'[{k}] rendered in {V.render_cue(built[k][1], work):.0f} s', flush=True)
    out = os.path.join(HERE, 'render', f'music{tag}.wav')
    layers, stops, designed = lay(tl, built, work)
    mix, laid = V.assemble(tl, layers, out, stops=stops, designed=designed)
    windows = {L['name']: (L['a0'], L['a1']) for L in layers}
    rows = []
    for k, (c, sc) in built.items():
        rows += [(f'{k}: {lab}', a0, a1) for lab, a0, a1 in c.sections]
    res = V.measure(tl, mix, windows, rows, designed)
    cues = []
    for L in layers:
        k = [kk for kk, (c, sc) in built.items() if sc.name == L['name']][0]
        c, sc = built[k]
        cues.append(dict(cue=L['name'], start=round(L['a0'], 3), end=round(L['a1'], 3), what=sc.meta.get('tone'),
                         family=sc.meta.get('family'), render=os.path.relpath(L['wav'], V.REPO),
                         laid_at_s=round(c.T0, 4), level=res['cues'][L['name']],
                         target_lufs=sc.meta.get('underscore_lufs'), engine_qa=V.engine_qa(work, sc.name),
                         note_qa=V.note_qa(sc), sync=[dict(t=round(t, 3), what=lab, hit=h) for t, lab, h in c.marks]))
    doc = dict(
        schema='mrmas-reel-music/1', id=f'e01-v3-act2{tag}', segment=SEG, file=os.path.relpath(out, V.REPO),
        timeline=os.path.relpath(path, V.REPO), length_s=tl.length, frames=tl.frames, samples=tl.samples,
        sample_rate=V.SR, channels=2, clock='the segment\'s own clock: 0 = its first frame (timeEpisode, head 0)',
        level='underscore (per-cue engine masters: wh -20, senate -21, run_roof -19, upsell -19), dry of dialogue; '
              'the mixer ducks it', cues=cues,
        silences_designed=[dict(t0=round(a, 3), t1=round(b, 3), why=w) for a, b, w in designed],
        hard_stops=[dict(t=round(a, 3), what=w) for a, _, w in designed[1:]],
        measured=res, laid=laid, source=os.path.relpath(__file__, V.REPO),
        heard='nothing here has been listened to; every number is measured')
    V.write_json(os.path.join(HERE, f'cues{tag}.json'), doc)
    print(f'wrote {os.path.relpath(out, V.REPO)}: {res["length_s"]} s exact={res["exact"]}')
    for k, v in res['cues'].items():
        print(f'  {k}: {v}')
    print('unmarked digital silence:', res['unmarked_digital_silence'])
    print('undesigned fragments:', res['undesigned_fragments'])


if __name__ == '__main__':
    main()
