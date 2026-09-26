"""Fix 1: the short-term meter, _k_power and balance_energy K-weight ALONG TIME (they filtered across the two
channels and read 2.5-4 dB hot).  Checked against known levels, against pyloudnorm, and on V1's title."""
import os
import unittest

import numpy as np
import pyloudnorm as pyln
import soundfile as sf

from _util import THEME_V1
from engine.analysis import _k_power, balance, short_term_stats
from engine.mix import lra, short_term_lufs

SR = 48000


def tone(freq, dbfs, secs=10.0, stereo=True):
    t = np.arange(int(secs * SR)) / SR
    x = 10 ** (dbfs / 20) * np.sin(2 * np.pi * freq * t)
    return np.stack([x, x]) if stereo else np.stack([x, np.zeros_like(x)])


def pyln_window(x, a, secs=3.0):
    """pyloudnorm on exactly one 3 s block: the short-term loudness of that window."""
    seg = x[:, a:a + int(secs * SR)]
    return pyln.Meter(SR, block_size=secs).integrated_loudness(seg.T)


class ShortTermTest(unittest.TestCase):
    def test_known_levels(self):
        # EBU Tech 3341 test 1/2: a 1 kHz sine at -23 / -33 dBFS on both channels reads -23 / -33 LUFS (+-0.1)
        for lvl in (-23.0, -33.0):
            st = short_term_lufs(tone(1000, lvl))
            self.assertLess(np.abs(st - lvl).max(), 0.1, (lvl, st[:3]))

    def test_channel_symmetry(self):
        # the old code filtered across [L, R]: a signal read differently in the left and the right channel
        x = tone(100, -20, 6)[0]
        z = np.zeros_like(x)
        a = short_term_lufs(np.stack([x, z]))
        b = short_term_lufs(np.stack([z, x]))
        self.assertLess(np.abs(a - b).max(), 1e-9)

    def test_matches_pyloudnorm_on_noise(self):
        rng = np.random.default_rng(3)
        x = rng.standard_normal((2, 12 * SR)) * 0.05
        x[1] *= 0.5
        st = short_term_lufs(x, 3.0, 0.5)
        ref = np.array([pyln_window(x, i * SR // 2) for i in range(len(st))])
        self.assertLess(np.abs(st - ref).max(), 0.02)

    @unittest.skipUnless(os.path.exists(THEME_V1), 'V1 title not on disk')
    def test_v1_title(self):
        x, sr = sf.read(THEME_V1, always_2d=True)          # read-only
        self.assertEqual(sr, SR)
        x = x.T
        st = short_term_lufs(x, 3.0, 0.5)
        ref = np.array([pyln_window(x, i * SR // 2) for i in range(len(st))])
        self.assertLess(np.abs(st - ref).max(), 0.01)       # measured 0.0024 LU
        s = short_term_stats(x)
        self.assertAlmostEqual(s['median'], -13.8, delta=0.05)   # the bible's reference (s6.5); the old meter: -10.7
        self.assertLess(s['p95'], -11.9)                          # the old meter: -9.0
        # the ungated K-power agrees with a per-channel, along-time reference
        y = np.stack([pyln.Meter(SR)._filters['high_pass'].apply_filter(
            pyln.Meter(SR)._filters['high_shelf'].apply_filter(x[c])) for c in range(2)])
        self.assertAlmostEqual(_k_power(x), float((y ** 2).sum(0).mean()), delta=1e-9 * _k_power(x))

    def test_lra_of_a_steady_tone_is_zero(self):
        self.assertLess(lra(tone(1000, -23, 20)), 0.05)


class BalanceEnergyTest(unittest.TestCase):
    def test_k_power_is_loudness_power(self):
        x = tone(1000, -23)
        self.assertAlmostEqual(-0.691 + 10 * np.log10(_k_power(x)), -23.0, delta=0.1)

    def test_balance_energy_shares(self):
        # two groups 10 dB apart in K-weighted power -> shares 91 / 9, whatever the channel layout
        a = tone(1000, -20, 6)
        b = tone(1000, -30, 6, stereo=False)                     # left only
        b = b * np.sqrt(2)                                        # same power as a -30 dBFS stereo tone
        out = balance({'piano': a, 'orch': b}, [('all', 0.0, 6.0)])
        self.assertEqual(out['balance_energy']['piano'], 91)
        self.assertEqual(out['balance_energy']['orch'], 9)

    def test_k_weight_filters_along_time(self):
        from engine.mix import k_weight
        x = tone(20, -20, 2)                                       # far below the 38 Hz high-pass
        y = k_weight(x)
        self.assertLess(np.sqrt(np.mean(y[:, SR:] ** 2)) / np.sqrt(np.mean(x ** 2)), 0.5)


if __name__ == '__main__':
    unittest.main()
