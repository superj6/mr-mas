"""E01-S26 + E01-S26A "The Falling Tile" -- the TO-PICTURE cut of MM-08 (OST-BIBLE s5.B1, s6.3).  Composer B.

The composition lives in ../mm08-the-falling-tile/track.py (compose(form='picture')); this folder renders the
picture version at the cue's exact length and start: 29 bars = 72.5 s, bar 1.1 = 13:21.0 (the grid connects),
the D6 hard stop on 8.1 (the Cancel click), 26A from bar 22, the Rewind cut on 30.1 = sc 27's downbeat.
Stems here are the ones the editor lays against picture.
"""
import importlib.util
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, '..', '..')))
from engine import render_cli   # noqa: E402

_spec = importlib.util.spec_from_file_location('mm08_track', os.path.join(HERE, '..', 'mm08-the-falling-tile',
                                                                          'track.py'))
mm08 = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(mm08)

META = dict(
    mm08.BASE_META,
    id='e01-s26-the-falling-tile',
    title='The Falling Tile (E01-S26 + S26A, to picture)',
    usage='BI',
    tone='a trap closing without a tune, a click that takes every sound away, then one felt piano in the dark -- '
         'and the Orb rewinding his settle',
    scenes=['Ep1 sc 26 THE FALLING TILE, 13:21.0-14:13.5 (bars 1-21: music bars 1-7, D6 from 8.1)',
            'Ep1 sc 26A dark room, 14:13.5-14:33.5 (bars 22-29), the Rewind into sc 27 at bar 30.1',
            'script clocks are printed rounded (14:14, 14:34); conform to the slate animatic by whole bars'],
    audition=[
        '0:17.5 (bar 8.1, the Cancel click): the HARD STOP -- does it land as a blow, not a playback glitch? '
        'Check it with picture (bible s7 item 1)',
        '0:00-0:17.5 (bars 1-7): LEVERAGE -- a trap closing without a tune; the uneven thud never a heartbeat; '
        'Step Four at 0:15.0 level, no riser; the arrow steps at 15.0 / 15.625 / 16.25 s',
        'FIX 1, 0:00-0:17.5: the low grand clusters are 9 dB up and double Step Four\'s bass in bar 7 -- audible '
        'leverage, still no tune, not murky? The cello pizz is notched at 111.7 Hz: still woody, nothing major?',
        '0:02.5-0:03.1 (bar 2.1): the 1-beat dip for the NELEH freeze hit, then the clockwork pizz -- lay the '
        'freeze hit in and check the key',
        '0:52.5-1:00.0 (bars 22-24): the felt fifth (the carve), then the G4 nudge alone under "i don\'t keep '
        'score." at 0:55.0 -- nothing moves under the V.O.; lay a stock voice at about -16.5 LUFS-S to check it sits',
        '1:10.0-1:12.5 (bar 29): C4 -> F4 (the settle), then THE REWIND at 1:11.25 (E4, Bb3 on the 16-bit sample-chip) landing on '
        'sc 27 at 1:12.5 -- the Orb rewinding, not a tape effect; hand-off to MM-09\'s Bbm(add9)',
        '1:00.0-1:05.0 (bars 25-26): his real post plays DRY; the wallet\'s C4 enters after it at 1:05.0',
    ],
)


def build():
    return mm08.score('picture', dict(META))


if __name__ == '__main__':
    render_cli(build, __file__)
