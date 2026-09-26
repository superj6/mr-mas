"""MR. MAS · style range · prototype 4 · THE TEMP CUE: one continuous tension cue under the Tier 1 reel.

12 bars at 96 BPM (720 frames, 30.0 s), straight (the device, the record and the machine play straight; OST-BIBLE
s0 rule 6), F minor / phrygian colour, built from THE CLOCK (P04: a pizzicato rail-tick cell on varied pitches that
subdivides as the reel goes) over LEVERAGE's low grand-piano clusters that shift a semitone at a time (P03) and its
muted sub-thud. It never drops into a hole: where the picture's device takes the air (the webcast's PA, the Orb's
long beat) it THINS to a pedal and a pad, and comes back on the next phrase. The phrase resolves on the reel's last
beat to the open fifth F-C (no third: s0 rule 12), the Orb's own verdict interval (s2.4).

  bars 1-3   4a SPORTS     quarter-note ticks, pedal, clusters, the thud on each downbeat
  bars 4-6   4b STREAM     the tick doubles to eighths; a chip noise tick on the offbeats
  bars 7-8   4c BROADCAST  thins under the chamber PA: pedal + a sul tasto pad, one tick a bar
  bar  9     4c, close     the eighths return with the pixel room (p480)
  bar 10     4d IRIS       sixteenths into the iris; glass enters as the lens opens (bar 10 beat 3)
  bar 11     4d            the long beat: the pedal and the glass hold, nothing else
  bar 12     4d, out       a suspended cadence, resolving on beat 4 to the open fifth

Run (the engine is audio/ost/engine, read-only here; output goes wherever --out says):
  ../../../../../../audio/.venv-theme/bin/python cue.py --out <scratch>/cue
"""
import os
import sys
import argparse

HERE = os.path.dirname(os.path.abspath(__file__))
OST = os.path.abspath(os.path.join(HERE, '..', '..', '..', '..', '..', '..', 'audio', 'ost'))
sys.path.insert(0, OST)
from engine import *  # noqa: E402,F401,F403
from engine.export import build as export_build  # noqa: E402

META = dict(
    id='range-p4-temp-cue', mm='', title='Tier 1 Reel (temp)', family='P04',
    tone='one continuous straight tension cue under four device passes; thins, never stops',
    usage='BI', tags=['temp', 'prototype', 'style-range'], scenes=['range p4'], motifs=[], motif_ids=[],
    key='F minor (phrygian colour)', composer='range p4 builder', album_loops=1,
    audition=['00:00 the tick cell against the stadium bed', '00:17 the thinning under the webcast PA',
              '00:25 the long beat: pedal + glass only', '00:29.4 the open-fifth resolution'],
)

# the tick cell: varied pitches, never one pitch at an even rate (X3)
CELL = [['C5', 'Ab4', 'F4', 'G4'], ['C5', 'Bb4', 'Ab4', 'G4'], ['Db5', 'C5', 'Ab4', 'F4'], ['C5', 'G4', 'Ab4', 'Bb4']]
CELL8 = [['C5', 'F4', 'Ab4', 'C5', 'Db5', 'C5', 'Ab4', 'G4'], ['C5', 'F4', 'Bb4', 'Ab4', 'G4', 'Ab4', 'F4', 'G4'],
         ['Db5', 'Ab4', 'C5', 'F4', 'Gb4', 'Ab4', 'C5', 'Bb4'], ['C5', 'F4', 'Ab4', 'G4', 'C5', 'Db5', 'C5', 'G4']]
# the leverage clusters (low grand, close, a semitone shift per bar): who has the leverage now
CLUSTERS = {1: ['F2', 'C3', 'Ab3'], 2: ['F2', 'Db3', 'Ab3'], 3: ['F2', 'C3', 'G3'], 4: ['Gb2', 'Db3', 'Ab3'],
            5: ['F2', 'Db3', 'Ab3'], 6: ['E2', 'C3', 'G3'], 7: ['F2', 'C3', 'Ab3'], 8: ['F2', 'Db3', 'Ab3'],
            9: ['Gb2', 'Db3', 'Bb3'], 10: ['F2', 'C3', 'Ab3'], 11: ['F2', 'C3', 'Gb3']}


def build():
    g = Grid(bpm=96, meter='4/4', bars=12, swing=0.0)
    a = Arr(g)
    T = palette()
    T['vln_pizz'].gain_db = -3
    T['vla_pizz'].gain_db = -5
    T['grand'].gain_db = -6
    T['k808'].gain_db = -9
    T['noise'].gain_db = -20
    T['glasspad'].gain_db = -12
    T['vc'].gain_db = -4
    T['cb'].gain_db = -6
    T['vla'].gain_db = -10
    T['vln2'].gain_db = -12

    # --- the pedal: cello F2 under everything, cb F1 pizz on the downbeats of the outer sections
    for b0, dur in [(1, '2bar'), (3, '2bar'), (5, '2bar'), (7, '2bar'), (9, '2bar'), (11, '1bar')]:
        a.n('vc', 'F2', (b0, 1), dur, 0.42, art='sus')
    a.n('vc', 'C3', (12, 1), '3b', 0.4, art='sus')
    for b in [1, 2, 3, 4, 5, 6, 9, 10]:
        a.n('cb', 'F1', (b, 1), '1b', 0.5, art='pizz')

    # --- the ticks: quarters (4a), eighths (4b), one a bar (4c, thinned), eighths (bar 9), sixteenths (bar 10)
    for b in [1, 2, 3]:
        for k, p in enumerate(CELL[(b - 1) % 4]):
            a.n('vln_pizz', p, (b, 1 + k), '1/8', 0.5 if k == 0 else 0.4, lock=True)
    for b in [4, 5, 6, 9]:
        for k, p in enumerate(CELL8[(b - 1) % 4]):
            a.n('vln_pizz', p, (b, 1 + k * 0.5), '1/16', 0.46 if k % 2 == 0 else 0.34, lock=True)
            if k % 2 == 1:
                a.n('noise', 'C6', (b, 1 + k * 0.5), '1/32', 0.18 + 0.05 * (k % 3), lock=True)
    # bar 7: the eighths carry into the chamber, then thin on beat 3 as the webcast's PA takes the air (p390)
    for k, p in enumerate(CELL8[2][:4]):
        a.n('vln_pizz', p, (7, 1 + k * 0.5), '1/16', 0.4 if k % 2 == 0 else 0.3, lock=True)
    a.n('vla_pizz', 'Ab3', (7, 3), '1/8', 0.3, lock=True)
    a.n('vla_pizz', 'C4', (8, 1), '1/8', 0.34, lock=True)
    a.n('vla_pizz', 'Ab3', (8, 3), '1/8', 0.3, lock=True)
    seq16 = ['C5', 'F4', 'Ab4', 'C5', 'Db5', 'C5', 'Ab4', 'G4', 'C5', 'F4', 'Bb4', 'Ab4', 'G4', 'F4', 'Gb4', 'G4']
    for k, p in enumerate(seq16[:8]):  # bar 10 beats 1-2: sixteenths into the iris, then they stop as it opens
        a.n('vln_pizz', p, (10, 1 + k * 0.25), '1/32', 0.42 if k % 4 == 0 else 0.3, lock=True)
    for k, p in enumerate(['C5', 'Ab4', 'F4', 'G4']):
        a.n('vla_pizz', p, (10, 3 + k * 0.5), '1/16', 0.3, lock=True)

    # --- the clusters and the thud
    for b, notes in CLUSTERS.items():
        a.ch('grand', notes, (b, 1), '1bar' if b not in (7, 8, 11) else '2b', 0.32 if b not in (7, 8, 11) else 0.24, roll=0.012)
    for b in [1, 2, 3, 4, 5, 6, 9, 10]:
        a.n('k808', 'F1', (b, 1), '1/4', 0.55, lock=True, lp=150)

    # --- the pads: sul tasto under the webcast (bars 7-8) and the long beat (bar 11)
    a.ch('vla', ['F3', 'C4'], (7, 1), '2bar', 0.34, art='sus')
    a.ch('vln2', ['Ab4'], (7, 3), '6b', 0.26, art='sus')
    a.ch('vla', ['F3', 'C4'], (11, 1), '1bar', 0.3, art='sus')

    # --- the lens: glass enters as the iris opens (bar 10 beat 3) and holds through the long beat
    a.ch('glasspad', ['F4', 'C5', 'G5'], (10, 3), '6b', 0.34)
    a.ch('glasspad', ['F4', 'C5', 'Gb5'], (12, 1), '3b', 0.28)

    # --- bar 12: the suspended cadence, then the open fifth on beat 4 (the reel's last beat)
    a.ch('grand', ['C2', 'G2', 'Bb2', 'F3'], (12, 1), '3b', 0.34, roll=0.01)
    a.ch('vla', ['Bb3', 'F4'], (12, 1), '3b', 0.3, art='sus')
    a.n('vln_pizz', 'C5', (12, 1), '1/8', 0.4, lock=True)
    a.n('vln_pizz', 'Ab4', (12, 2), '1/8', 0.34, lock=True)
    a.n('vln_pizz', 'G4', (12, 3), '1/8', 0.3, lock=True)
    a.ch('grand', ['F1', 'C2', 'F2', 'C3'], (12, 4), '1b', 0.4, roll=0.006)
    a.ch('vc', ['F2', 'C3'], (12, 4), '1b', 0.4, art='sus')
    a.n('cb', 'F1', (12, 4), '1b', 0.5, art='pizz')
    a.n('k808', 'F1', (12, 4), '1/4', 0.5, lock=True, lp=150)

    a.section('4a', 1, 4); a.section('4b', 4, 7); a.section('4c', 7, 10); a.section('4d', 10, 13)
    a.mark('resolve', (12, 4))
    META['no_third_windows'] = [(g.t(12, 4), g.t(13))]
    return Score(META['id'], g, T, a.notes, markers=a.markers, sections=a.sections, meta=META, tail_s=2.0)


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('--out', required=True)
    args = ap.parse_args()
    sc = build()
    export_build(sc, args.out, META['id'], stems=True, loop=False, previews=False)
