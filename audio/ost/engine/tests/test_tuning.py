"""Fix 2: per-sample tuning of the harp, clarinet and pizzicato sets; fix 2b: the brass and bass shorts, the
tremolo sections and the solo violin.

Every sample of the tuned sets carries a measured correction (library.TUNING); rendered through the sampler at
its own pitch and at the ends of its zone, its fundamental must sit within 5 cents of the written pitch (re-measured
by the set's own method, tuning.METHOD)."""
import os
import unittest

import numpy as np

from _util import OST  # noqa: F401
from engine import library, tuning
from engine.core import midi_hz
from engine.sampler import SampleSet, load_wav, trim_lead


def _render(ss, e, pitch, dur=4.0):
    return tuning._render_entry(ss, e, pitch, np.random.default_rng(0), dur=dur)


def _pitch_of_render(ss, pitch, vel, rng_seed=0):
    rng = np.random.default_rng(rng_seed)
    y = ss.render(pitch, vel, 4.0, rng, rel_s=0.3, detune_cents=0.0)
    e = ss.choose(pitch, vel, np.random.default_rng(rng_seed))
    shift = pitch - e['pitch'] - e['cents'] / 100.0
    short = 'stac' in ss.name
    seg = tuning._window(y, ss.sustained, short, scale=2 ** (-shift / 12.0))
    f0, _ = tuning.harmonic_f0(seg, midi_hz(pitch))
    return tuning.cents(f0, midi_hz(pitch)), seg, e


class TuningTableTest(unittest.TestCase):
    def test_every_sample_of_the_tuned_sets_is_in_the_table(self):
        for name in tuning.TUNED_SETS:
            ss = library.get(name)
            files = {os.path.basename(e['path']) for e in ss.entries}
            self.assertEqual(files - set(library.TUNING[name]), set(), name)
            self.assertTrue(all(e.get('tuned') for e in ss.entries), name)

    def test_renders_within_5_cents(self):
        """The whole check (engine.tuning --verify): 900+ renders, own pitch and zone ends."""
        for name in tuning.TUNED_SETS:
            rows = tuning.verify_set(name)
            bad = [r for r in rows if not r['ok']]
            self.assertFalse(bad, f'{name}: {bad[:5]}')
            own = [abs(r['err_cents']) for r in rows if r['shift'] == 0]
            self.assertLess(max(own), 5.0)


class KnownFaultsTest(unittest.TestCase):
    """The faults the batch-1 composers hit, before and after."""

    def test_clarinet_sharp_sample_is_really_an_f(self):
        # 'DCClar_susLong_F#5' is an F: the old calibration left it untuned, so every F#6 sounded as F6
        ss = library.get('cl')
        e = [e for e in ss.entries if 'F#5_v2' in e['path']][0]
        self.assertLess(e['cents'], -95)
        err, seg, used = _pitch_of_render(ss, 90, 0.5)
        self.assertIn('F#5', used['path'])
        self.assertLess(abs(err), 5.0)
        y = tuning.yin_f0(seg, midi_hz(90))                   # an independent, time-domain estimate agrees
        self.assertLess(abs(tuning.cents(y, midi_hz(90))), 5.0)
        old = SampleSet('cl_old', **{**library.SETS['cl'], 'tuning': {}})
        err_old, _, _ = _pitch_of_render(old, 90, 0.5)
        self.assertLess(err_old, -90)                          # the regression this table fixes

    def test_clarinet_staccato_f4_in_tune(self):
        # MM-07: cl_stac F4 came from an F3 sample 28-44 cents flat
        ss = library.get('cl_stac')
        for vel in (0.2, 0.5, 0.9):
            err, _, _ = _pitch_of_render(ss, 65, vel)
            self.assertLess(abs(err), 5.0, vel)
        old = SampleSet('cl_stac_old', **{**library.SETS['cl_stac'], 'tuning': {}})
        errs = [_pitch_of_render(old, 65, v)[0] for v in (0.2, 0.5, 0.9)]
        self.assertLess(min(errs), -20)

    def test_harp_soft_layer_not_stretched_or_mistuned(self):
        # MM-07: any harp note below vel 0.40 was stretched from the one G1 mp sample, up to 44 semitones
        ss = library.get('harp')
        for p in (53, 65, 72, 77):
            e = ss.choose(p, 0.2, np.random.default_rng(1))
            self.assertNotIn('G1_mp', e['path'], p)
            self.assertLessEqual(abs(e['pitch'] - p), 4)
            err, _, _ = _pitch_of_render(ss, p, 0.2)
            self.assertLess(abs(err), 5.0, p)
        e = ss.choose(31, 0.2, np.random.default_rng(1))      # near G1 the soft sample still plays, in tune
        self.assertIn('G1_mp', e['path'])
        self.assertLess(abs(_pitch_of_render(ss, 31, 0.2)[0]), 5.0)
        for p in (60, 72):                                     # the f layer (E1, D7, F7) is no longer stretched
            self.assertLessEqual(abs(ss.choose(p, 0.9, np.random.default_rng(1))['pitch'] - p), 4)

    def test_pizz_sets_are_corrected(self):
        for name in ('vln_pizz', 'vla_pizz', 'vc_pizz', 'cb_pizz'):
            ss = library.get(name)
            worst = max(ss.entries, key=lambda e: abs(e['cents']))
            self.assertTrue(worst.get('tuned'))
            err, _, _ = _pitch_of_render(ss, worst['pitch'], 0.3 if worst['vel'] == ss.layers[0] else 0.9)
            self.assertLess(abs(err), 5.0, (name, worst['path']))

    def test_measurement_does_not_jump_octaves(self):
        # the old harmonic-product estimate read the clarinet's twelfth and the harp's octave
        sr = 48000
        t = np.arange(int(0.8 * sr)) / sr
        f = midi_hz(50) * 2 ** (-23 / 1200)                                # D3, 23 cents flat
        tone = sum((1.0 if k % 2 else 0.05) / k * np.sin(2 * np.pi * k * f * t) for k in range(1, 12))  # odd
        f0, _ = tuning.harmonic_f0(tone * np.exp(-t), midi_hz(50))
        self.assertAlmostEqual(tuning.cents(f0, midi_hz(50)), -23.0, delta=1.0)



class FixTwoBTest(unittest.TestCase):
    """Fix 2b: the sets the fix-1 engine owner measured but did not correct."""

    def _entry(self, name, pat):
        ss = library.get(name)
        return ss, [e for e in ss.entries if pat in e['path']][0]

    def test_new_sets_are_tuned_by_their_method(self):
        for name in ('tuba_stac', 'tpt_stac', 'hn_stac', 'cb_spic', 'vla_trem', 'vc_trem', 'svln'):
            self.assertIn(name, tuning.TUNED_SETS)
            self.assertIn(tuning.METHOD[name], ('short', 'held'))
        for name in ('harp', 'cl', 'cl_stac', 'vln_pizz', 'vla_pizz', 'vc_pizz', 'cb_pizz'):
            self.assertNotIn(name, tuning.METHOD)             # the fix-2 sets keep harmonic_f0 on their windows

    def test_attack_faults_are_not_the_pitch(self):
        # a horn crack (+2 semitones for 80 ms) and a spiccato's bow noise (100 ms) fooled the fixed window
        for name, pat in (('hn_stac', 'C1_v1_rr2'), ('cb_spic', 'E0_v3_rr1'), ('cb_spic', 'D1_v3_rr1')):
            ss, e = self._entry(name, pat)
            x = trim_lead(load_wav(e['path']))
            f_nom = midi_hz(e['pitch'])
            old, _ = tuning.harmonic_f0(tuning._window(x, False, True), f_nom)
            self.assertGreater(abs(tuning.cents(old, f_nom)), 100, pat)
            f0, _ = tuning.short_f0(x, f_nom)
            self.assertLess(abs(tuning.cents(f0, f_nom)), 15, pat)
            self.assertLess(abs(e['cents']), 15, pat)

    def test_stray_partial_does_not_outvote_the_series(self):
        # vc_trem E1_v1: its strongest 'second harmonic' sits 60 cents flat of the rest; synthetic stand-in
        sr = 48000
        t = np.arange(int(3.2 * sr)) / sr
        f = 110.0 * 2 ** (4 / 1200)
        x = sum(np.sin(2 * np.pi * k * f * t) / k for k in (1, 3, 4, 5, 6, 7, 8))
        x = x + 3.0 * np.sin(2 * np.pi * 2 * f * 2 ** (-60 / 1200) * t)
        f0, _ = tuning.held_f0(x, 110.0)
        # the stray partial (3x the fundamental's amplitude, 64 c off the series) still pulls the continuous
        # M-estimate a little (2.5 c here); what matters is that it no longer decides the pitch
        self.assertAlmostEqual(tuning.cents(f0, 110.0), 4.0, delta=3.0)
        old, _ = tuning.harmonic_f0(x[int(0.25 * sr):int(1.25 * sr)], 110.0)
        self.assertLess(tuning.cents(old, 110.0), -20)          # the regression: the stray partial won

    def test_a_glide_reads_its_plateau(self):
        # a brass scoop: 60 ms from +90 cents, then the note, decaying; the plateau is the pitch
        sr = 48000
        n = int(0.35 * sr)
        t = np.arange(n) / sr
        c = np.where(t < 0.06, 90 * (1 - t / 0.06), 0.0)
        f = 220.0 * 2 ** (c / 1200)
        ph = 2 * np.pi * np.cumsum(f) / sr
        x = sum(np.sin(k * ph) / k for k in range(1, 8)) * np.exp(-t / 0.12)
        f0, info = tuning.short_f0(np.stack([x, x]), 220.0)
        self.assertLess(abs(tuning.cents(f0, 220.0)), 5.0, info)

    def test_estimate_is_transposition_invariant(self):
        # the render re-measure must not flip between readings when the input moves a few cents
        for name, pat in (('vc_trem', 'E1_v1'), ('tuba_stac', 'A#0_v2_rr3')):
            ss, e = self._entry(name, pat)
            method = tuning.METHOD[name]
            x = trim_lead(load_wav(e['path']))
            f_nom = midi_hz(e['pitch'])
            f0, info = tuning.note_f0(x, f_nom, method)
            c_s = tuning.cents(f0, f_nom)
            c0 = e['cents']
            try:
                for c in (c_s - 6.0, c_s + 6.0):
                    e['cents'] = c
                    y = _render(ss, e, e['pitch'])
                    f1, _ = tuning.note_f0(y, f_nom, method, scale=2 ** ((c / 100) / 12), K=info['K'])
                    self.assertAlmostEqual(tuning.cents(f1, f_nom) + c, c_s, delta=1.5, msg=(pat, c))
            finally:
                e['cents'] = c0

    def test_known_mistunings_are_corrected(self):
        # tuba_stac A#0_v2_rr3 is played ~90 cents flat (MM-19's march); the solo violin C4_p is 23 cents sharp
        # (MM-11's Door); vc_trem B1_v1 was 'corrected' by +44.9 c by the HPS estimate (it is within 5 c)
        for name, pat, lo, hi in (('tuba_stac', 'A#0_v2_rr3', -100, -80), ('svln', 'C4_p', 18, 28),
                                  ('vc_trem', 'B1_v1', -8, 8)):
            ss, e = self._entry(name, pat)
            self.assertTrue(e.get('tuned'), pat)
            self.assertTrue(lo < e['cents'] < hi, (pat, e['cents']))
            y = _render(ss, e, e['pitch'], dur=4.0 if tuning.METHOD[name] == 'short' else 4.5)
            f0, _ = tuning.note_f0(y, midi_hz(e['pitch']), tuning.METHOD[name],
                                   scale=2 ** ((e['cents'] / 100) / 12))
            self.assertLess(abs(tuning.cents(f0, midi_hz(e['pitch']))), 5.0, pat)


if __name__ == '__main__':
    unittest.main()
