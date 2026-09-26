"""Render every Ep1 Act Four v4 to-picture cue (or the named ones) into render/ with stems.

    OST_WORKERS=3 ../../../.venv-theme/bin/python render_all.py            # all five
    OST_WORKERS=3 ../../../.venv-theme/bin/python render_all.py s3s4        # just S3 + S4

Each cue module has its own `python <cue>.py` too (the engine's render_cli).  This driver does not touch
ost-index.json (build.py would); the mix (studio/.../tools/mix_v4.py) reads render/<id>.cue.json and the stems.
"""
import importlib
import os
import sys
import time

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
sys.path.insert(0, os.path.abspath(os.path.join(HERE, '..', '..')))
from engine.export import build   # noqa: E402

CUES = ['s1_plan', 's1s2_falling_tile', 's3s4_boards_side', 's5s6_his_side', 's7s8_the_return']


def main(names):
    todo = [c for c in CUES if not names or any(n in c for n in names)]
    for c in todo:
        t0 = time.time()
        mod = importlib.import_module(c)
        sc = mod.build()
        build(sc, os.path.join(HERE, 'render'), sc.meta['id'], stems=True, loop=False, previews=True,
              workers=int(os.environ.get('OST_WORKERS', '3')))
        print(f'[{c}] {time.time() - t0:.0f} s', flush=True)


if __name__ == '__main__':
    main(sys.argv[1:])
