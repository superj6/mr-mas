"""PAD stem: the wordless close-harmony vocal pad under the title hit (SCRIPT v2.1 §3.9-3.10, §4 D11).

  enters f630 (26.250 s, the final hit)   four voices on "oo": F3 - Bb3 - C4 - Eb4 (no A, no Ab: no third)
  holds f630-685                           straight tone, a little late vibrato
  releases f686-704                        voices reach silence at f700, the plate tail is gone by f704
None of the vocal pass's six title-pad candidates is this voicing (they are "aah" F9sus stacks, an open
fifth, an F sus/add9 "ooh" and chip hybrids, all 4.0 s with the release at +1.6-1.9 s), so it is rebuilt
with the same singer (audio/intro/vocals/scripts/sing.py): Kokoro-82M stock voices re-sung through WORLD.
Each of the four parts is double-tracked (the double at -6 dB, +/-4 cents) for blend; no chip layer
(the score's F6 pulse already carries the chip there).
"""
import os, sys, json
sys.path.insert(0, os.path.dirname(__file__))
from ivlib import *
import pedalboard as pb
from scipy import signal as ss
import harmony as hm              # the vocal pass's ensemble + vocal bus (read-only import)
import sing
use_cache(hm, sing)

NOTES = ['F3', 'Bb3', 'C4', 'Eb4']
T_IN = fs(630)
T_REL = fs(686)
T_ZERO = fs(700)                  # voices silent
T_OUT = fs(704)                   # bus silent (plate tail included)


def build(seed=5):
    dur = T_ZERO - T_IN
    x = hm.ensemble(NOTES, 'ooh', dur, per_part=2, dbl_gain_db=-6, time_spread=0.012, detune=3.5, width=0.7,
                    seed=seed, gains=[1.1, 0.9, 0.85, 0.8],
                    att=0.10, rel=T_ZERO - T_REL, consonant=False, swell=0.12, breath=0.10,
                    vib_cents=8, vib_rate=5.2, vib_delay=0.9, vib_rise=0.8,
                    scoop_cents=-12, scoop_ms=60, jitter_cents=3, drift_cents=4)
    # "oo" has its second formant right on F3's 5th harmonic (A5, 880 Hz): trim that one partial a little
    # so no major third reads out of the physics (a narrow -3 dB dip; the "oo" colour is unchanged)
    x = board([pb.PeakFilter(880, -3.0, 6.0)], x)
    x = hm.vocal_bus(x, lo_cut=100, air=1.0, warmth=0.5, comp=(-24, 1.8))
    x = convolve(x, ir('plate'), wet=0.20)
    out = np.zeros((2, N30))
    place(out, x, T_IN)
    # bus release: the tail fades f696 -> f704, hard silence after
    g = np.ones(N30)
    a, b = int(fs(696) * SR), int(T_OUT * SR)
    g[a:b] = np.cos(np.linspace(0, np.pi / 2, b - a)) ** 2
    g[b:] = 0.0
    out *= g
    out[:, :int((T_IN - 0.02) * SR)] = 0.0
    return out


if __name__ == '__main__':
    y = build()
    save_build(y, 'pad_raw')
    print(stats(y, 'pad'), audible_span(y, -60))
