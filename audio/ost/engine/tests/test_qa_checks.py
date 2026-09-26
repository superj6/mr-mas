"""Fix 5: the QA checks the music editor asked for.

(a) written_third     any sounding A-natural where F is the lowest sounding pitch, from the notes, at every
                      boundary (MM-09's viola A3 over the cello's off-beat F3 slipped past the per-beat check)
(b) f_major_check     spectral A/F traced to its stem; written A / partial / glide / fixed resonance
(c) knee_completion   F F F F G Ab C F by pitch class, any register, across a phrase boundary (MM-06)
(d) sub_under_room    sub < 60 Hz >= 18 dB under the total wherever the cue sheet marks room_drone / server_hum
"""
import os
import unittest

import numpy as np

from _util import OST
from engine import analysis as A
from engine.core import Note, midi_hz, nm
from engine.grid import Grid

SR = 48000


def N(inst, p, t, d, v=0.6, **x):
    return Note(inst, nm(p), t, d, v, False, dict(x))


class _Tr:
    def __init__(self, stem, pedal=None):
        self.stem, self.pedal = stem, pedal


class WrittenThirdTest(unittest.TestCase):
    def test_mm09_offbeat_f_under_held_a(self):
        # the MM-09 shape: viola A3 held; cello spiccato F3 on beat 4 and on an off-beat; F3 lowest each time
        notes = [N('vla', 'A3', 18.75, 2.55), N('vc', 'F3', 18.75, 0.3125), N('vc', 'Db3', 19.0625, 0.3125),
                 N('vc', 'C3', 19.375, 0.3125), N('vc', 'F3', 19.6875, 0.3125), N('vc', 'F3', 21.25, 0.3125)]
        wt = A.written_third(notes)
        self.assertEqual([e['t0'] for e in wt['events']], [18.75, 19.688, 21.25])
        self.assertEqual(wt['events'][0]['a'], ['vla A3'])
        self.assertEqual(wt['events'][0]['f_bass'], ['vc F3'])
        self.assertFalse(wt['ok'])

    def test_lower_root_makes_it_legal(self):
        # the current MM-09: a contrabass Bb1 under it -> Bb is the bass, not F
        notes = [N('cb', 'Bb1', 13.75, 10.0), N('vla', 'A3', 18.75, 2.55), N('vc', 'F3', 18.75, 0.3125)]
        self.assertTrue(A.written_third(notes)['ok'])

    def test_a_in_any_octave_and_between_beats(self):
        notes = [N('ubass', 'F2', 0.0, 2.0), N('vln1', 'A6', 1.37, 0.1)]
        wt = A.written_third(notes)
        self.assertEqual(wt['count'], 1)
        self.assertAlmostEqual(wt['events'][0]['t0'], 1.37, places=3)

    def test_pedal_keeps_the_f_sounding(self):
        tracks = {'grand': _Tr('piano', pedal=[(0.0, True), (3.0, False)]), 'fl': _Tr('winds')}
        notes = [N('grand', 'F2', 0.0, 0.5), N('fl', 'A5', 1.0, 0.5)]
        self.assertTrue(A.written_third(notes)['ok'])               # gate only: the F has stopped
        self.assertFalse(A.written_third(notes, tracks)['ok'])      # pedal down until 3.0 s: it still sounds

    def test_graze_does_not_fail(self):
        notes = [N('vc', 'A2', 0.0, 1.01), N('vc', 'F2', 1.0, 1.0)]    # a 10 ms legato overlap
        wt = A.written_third(notes)
        self.assertTrue(wt['ok'])
        self.assertEqual(wt['n_grazes'], 1)

    def test_drums_do_not_count_as_bass(self):
        notes = [N('brush', 29, 0.0, 1.0), N('ubass', 'F2', 0.0, 1.0), N('fl', 'A4', 0.0, 1.0)]
        self.assertFalse(A.written_third(notes)['ok'])               # brush 'F1' is a drum, the F2 is the bass


def _sine(freq, t0, t1, amp, n):
    t = np.arange(n) / SR
    m = ((t >= t0) & (t < t1)).astype(float)
    return amp * np.sin(2 * np.pi * freq * t) * m


def _tone(p, t0, t1, amp, n, partials=(1.0, 0.5, 0.33, 0.25)):
    f = midi_hz(nm(p))
    return sum(a * _sine(f * (k + 1), t0, t1, amp, n) for k, a in enumerate(partials))


class SpectralAttributionTest(unittest.TestCase):
    def setUp(self):
        self.g = Grid(bpm=96, bars=4)
        self.n = int(10.0 * SR)

    def test_fixed_resonance_is_named_with_its_stem(self):
        # bass F2 throughout; a muted trumpet plays C5, then Eb5, then F5, each with a fixed 1.76 kHz formant
        n = self.n
        bass = _tone('F2', 0.0, 7.5, 0.3, n)
        tpt = sum(_tone(p, a, a + 2.5, 0.08, n) + _sine(1760.0, a, a + 2.5, 0.14, n)
                  for p, a in (('C5', 0.0), ('Eb5', 2.5), ('F5', 5.0)))
        stems = {'bass': np.stack([bass, bass]), 'brass': np.stack([tpt, tpt])}
        notes = [N('ubass', 'F2', 0.0, 7.5), N('tpt', 'C5', 0.0, 2.5), N('tpt', 'Eb5', 2.5, 2.5), N('tpt', 'F5', 5.0, 2.5)]
        tracks = {'ubass': _Tr('bass'), 'tpt': _Tr('brass')}
        fm = A.f_major_check(sum(stems.values()), notes, self.g, stems=stems, tracks=tracks)
        self.assertTrue(fm['ok_written'])
        self.assertFalse(fm['ok_spectral'])
        w = fm['fails'][0]
        self.assertEqual(list(w['a_from'])[0], 'brass')
        self.assertTrue(any(k['kind'].startswith('resonance') and k['stem'] == 'brass' for k in w['a_peaks']))
        self.assertTrue(fm['fixed_resonances'])
        self.assertEqual(fm['fixed_resonances'][0]['stem'], 'brass')
        self.assertAlmostEqual(fm['fixed_resonances'][0]['hz'], 1760.0, delta=10)

    def test_written_a_is_called_written(self):
        n = self.n
        bass = _tone('F2', 0.0, 5.0, 0.3, n)
        vla = _tone('A3', 1.0, 3.0, 0.2, n)
        stems = {'bass': np.stack([bass, bass]), 'strings': np.stack([vla, vla])}
        notes = [N('ubass', 'F2', 0.0, 5.0), N('vla', 'A3', 1.0, 2.0)]
        tracks = {'ubass': _Tr('bass'), 'vla': _Tr('strings')}
        fm = A.f_major_check(sum(stems.values()), notes, self.g, stems=stems, tracks=tracks)
        self.assertFalse(fm['ok_written'])
        kinds = [k for w in fm['fails'] for k in w.get('a_peaks', [])]
        self.assertTrue(any(k['kind'].startswith('written A') and k['stem'] == 'strings' for k in kinds), kinds)

    def test_partial_of_a_written_note(self):
        # D4 over the F bass (an Fm6 colour): its 3rd partial is an A5 -- a partial, not a written third
        n = self.n
        bass = _tone('F2', 0.0, 5.0, 0.3, n, partials=(1.0,))
        pno = _tone('D4', 0.0, 5.0, 0.3, n, partials=(0.2, 0.2, 1.0))     # an odd, bright voice: strong 3rd
        stems = {'bass': np.stack([bass, bass]), 'piano': np.stack([pno, pno])}
        notes = [N('ubass', 'F2', 0.0, 5.0), N('felt', 'D4', 0.0, 5.0)]
        tracks = {'ubass': _Tr('bass'), 'felt': _Tr('piano')}
        fm = A.f_major_check(sum(stems.values()), notes, self.g, stems=stems, tracks=tracks)
        self.assertTrue(fm['ok_written'])
        self.assertTrue(fm['ok_spectral'])                       # over the number, but explained: it passes
        self.assertGreater(fm['a_classes']['explained'], 0)
        kinds = [k['kind'] for w in fm['explained'] for k in w.get('a_peaks', [])]
        self.assertTrue(kinds and all(k.startswith('partial 3 of written D4') for k in kinds), kinds)
        self.assertGreater(max(w['a_over_f_sieved'] for w in fm['explained']), 0.08)

    def test_hard_stop_is_not_measured(self):
        n = self.n
        bass = _tone('F2', 0.0, 5.0, 0.3, n)
        x = np.stack([bass, bass])
        notes = [N('ubass', 'F2', 0.0, 5.0)]
        full = A.f_major_check(x, notes, self.g)['windows']
        cut = A.f_major_check(x, notes, self.g, mutes=[(1.0, 4.0)])['windows']
        self.assertLess(cut, full)


class KneeCompletionTest(unittest.TestCase):
    def test_mm06_late_completion_across_a_phrase(self):
        # MM-06 b5-7: F4 F4 F5 F3 | G4 Ab4 C5 (rest) | F5 ... -- C5 at 13.125 s, F5 2.19 s later, new phrase
        g = Grid(bpm=96, bars=8)
        t = lambda b, bt: g.t(b, bt)                                     # noqa: E731
        seq = [('F4', (5, 1)), ('F4', (5, 1.5)), ('F5', (5, 2)), ('F3', (5, 3)), ('G4', (6, 1)), ('Ab4', (6, 1.5)),
               ('C5', (6, 2)), ('F5', (7, 1.5)), ('F4', (7, 2))]
        notes = [N('bline', p, t(*pos), 0.25) for p, pos in seq]
        kc = A.knee_completion(notes)
        self.assertEqual(kc['count'], 1)
        h = kc['hits'][0]
        self.assertEqual(h['notes'], ['F4', 'F4', 'F5', 'F3', 'G4', 'Ab4', 'C5', 'F5'])
        self.assertTrue(h['new_phrase'])
        self.assertAlmostEqual(h['last_gap_s'], 2.188, places=2)
        from engine.motifs import knee_whole_count
        self.assertEqual(knee_whole_count(notes), 0)                    # the old matcher missed it

    def test_gap_too_long_is_not_a_knee(self):
        ps = ['F4', 'F4', 'F4', 'F4', 'G4', 'Ab4', 'C5']
        notes = [N('lead', p, 0.3 * i, 0.25) for i, p in enumerate(ps)] + [N('lead', 'F5', 0.3 * 6 + 3.0, 0.3)]
        self.assertEqual(A.knee_completion(notes)['count'], 0)

    def test_any_key_and_bottom_line(self):
        # C C C C D Eb G C in the left hand of a chordal part (the top line is something else)
        ps = ['C3', 'C3', 'C3', 'C3', 'D3', 'Eb3', 'G3', 'C4']
        notes = []
        for i, p in enumerate(ps):
            notes += [N('felt', p, 0.4 * i, 0.3), N('felt', 'Bb5', 0.4 * i, 0.3)]
        kc = A.knee_completion(notes)
        self.assertEqual(kc['count'], 1)
        self.assertEqual((kc['hits'][0]['key'], kc['hits'][0]['line']), ('C', 'bottom'))

    def test_fragments_alone_pass(self):
        ps = ['F4', 'F4', 'F4', 'F4', 'r', 'G4', 'Ab4', 'C5', 'r', 'r', 'r', 'r', 'r', 'Db5']
        notes = [N('lead', p, 0.3 * i, 0.25) for i, p in enumerate(ps) if p != 'r']
        self.assertEqual(A.knee_completion(notes)['count'], 0)


class SubUnderRoomTest(unittest.TestCase):
    def test_windows_from_the_cue_sheet(self):
        g = Grid(bpm=96, bars=8)
        meta = dict(room_sfx=[dict(t0=(2, 1), t1=(4, 1), sfx='server_hum')],
                    sfx_slots=[dict(t=(5, 1), sfx='room_drone (F1 + C2) fades in'), dict(t=(6, 1), sfx='ka_ching'),
                               dict(t=(1, 1), t1=(1, 3), sfx='room_drone')])
        w = A.room_sfx_windows(meta, g, 20.0)
        self.assertEqual([(round(a, 3), round(b, 3)) for a, b, _ in w], [(0.0, 1.25), (2.5, 7.5), (10.0, 20.0)])
        self.assertIn('no end marked', w[2][2])

    def test_sub_limit_and_the_stem_that_carries_it(self):
        n = 6 * SR
        sub = _sine(43.65, 0.0, 6.0, 0.3, n)                    # an F1 sub
        pno = _tone('F4', 0.0, 6.0, 0.1, n)
        stems = {'bass': np.stack([sub, sub]), 'piano': np.stack([pno, pno])}
        x = sum(stems.values())
        r = A.sub_under_room(x, [(1.0, 5.0, 'room_drone')], stems=stems)[0]
        self.assertFalse(r['ok'])
        self.assertGreater(r['sub_db'], -18.0)
        self.assertEqual(list(r['sub_from'])[0], 'bass')
        r2 = A.sub_under_room(x, [(1.0, 5.0, 'room_drone')], stems=stems, drop=['bass'])[0]
        self.assertTrue(r2['ok'])                                 # the cue's plan: drop the bass stem there
        self.assertLess(r2['sub_db_without']['sub_db'], -18.0)
        quiet = A.sub_under_room(np.stack([pno, pno]), [(1.0, 5.0, 'server_hum')])[0]
        self.assertTrue(quiet['ok'])


if __name__ == '__main__':
    unittest.main()
