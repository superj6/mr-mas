"""Fix 3a: analysis._fund_chroma no longer crashes on a NaN frequency.

The fmin mask turns the falling skirt of a strong low partial into a 'peak' at the mask edge; the parabolic
refinement then divided by a near-zero curvature, the frequency went negative, log2 gave NaN and
int(round(nan)) raised ValueError (MM-05's limbo build crashed in the F-major check this way)."""
import unittest

import numpy as np

from _util import OST  # noqa: F401
from engine import analysis as A

SR = 48000


def edge_skirt_case(fmin=80.0):
    N = 1 << 14
    f = np.fft.rfftfreq(N, 1 / SR)
    i0 = int(np.nonzero(f > fmin)[0][0])
    lm = np.full(len(f), -20.0)
    lm[i0 - 1], lm[i0], lm[i0 + 1] = 10.0, 5.0, -1e-6        # a falling skirt, curvature ~ -1e-6
    return f, np.sqrt(np.exp(lm))


class FundChromaTest(unittest.TestCase):
    def test_edge_skirt_does_not_crash(self):
        f, S = edge_skirt_case()
        c = A._fund_chroma(f, S, 80.0, 2000.0)
        self.assertTrue(np.all(np.isfinite(c)))

    def test_nan_and_silence(self):
        x = np.zeros((2, SR))
        x[0, 1000:1010] = np.nan
        for sieve in (False, True):
            c = A.chroma(x, 0.0, 1.0, sieve=sieve)
            self.assertTrue(all(np.isfinite(v) for v in c.values()), c)
            c = A.chroma(np.zeros((2, SR)), 0.0, 1.0, sieve=sieve)
            self.assertEqual(max(c.values()), 0.0)
        self.assertEqual(max(A.chroma(np.ones((2, 10)), 0.0, 1.0).values()), 0.0)   # too short: empty

    def test_sieve_still_credits_the_fifth_partial(self):
        # a low F with a strong 5th partial (an A): the sieve credits it to F; no real A appears
        t = np.arange(2 * SR) / SR
        f = 87.307
        x = sum(a * np.sin(2 * np.pi * k * f * t) for k, a in ((1, 1.0), (2, 0.6), (3, 0.5), (4, 0.3), (5, 0.7)))
        raw = A.chroma(x, 0.0, 2.0, fmin=80)
        sv = A.chroma(x, 0.0, 2.0, fmin=80, sieve=True)
        self.assertGreater(raw['A'], 0.2)
        self.assertLess(sv['A'], 0.01)
        self.assertEqual(max(sv, key=sv.get), 'F')

    def test_random_spectra_never_raise(self):
        rng = np.random.default_rng(7)
        for _ in range(60):
            x = rng.standard_normal(SR // 2) * np.exp(-np.linspace(0, rng.uniform(0, 30), SR // 2))
            x += rng.uniform(0, 5) * np.sin(2 * np.pi * rng.uniform(30, 90) * np.arange(SR // 2) / SR)
            A.chroma(x, 0.0, 0.5, fmin=80, sieve=True)


if __name__ == '__main__':
    unittest.main()
