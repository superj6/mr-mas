"""Render the S1-S4 cues with the OST engine (underscore + album masters, ten family stems, MIDI, piano roll, cue
sheet), one after another, into render/ (files named s1-s4_<cue>-*).  It does not touch ost-index.json.

    cd <repo>
    OST_WORKERS=2 ops/heavy.sh audio/.venv-theme/bin/python audio/ost/tracks/e01-act4-v5/s1-s4_render.py [s1 s2 s3s4]

A heavy job: run it through ops/heavy.sh (one heavy job machine-wide, low priority), with OST_WORKERS=2.  The three
cues take about 6-10 minutes together on this laptop.  Then run the light pass (no rendering):

    audio/.venv-theme/bin/python audio/ost/tracks/e01-act4-v5/s1-s4_qa.py
"""
import os  # noqa: E402  (phase 1: the project root is found at run time, docs/ORGANIZATION-PLAN.md §4)
import sys  # noqa: E402


def _repo():
    for start in (os.path.dirname(os.path.abspath(__file__)), os.getcwd()):
        d = start
        while True:
            if os.path.exists(os.path.join(d, '.mrmas-root')):
                return d
            if d == os.path.dirname(d):
                break
            d = os.path.dirname(d)
    sys.exit('MR. MAS: no .mrmas-root above this script or the cwd; set MRMAS_ROOT')


REPO = os.environ.get('MRMAS_ROOT') or _repo()
import importlib.util
import os
import sys
import time

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, '..', '..')))
from engine.export import build as ebuild   # noqa: E402

CUES = {'s1': 's1-s4_s1_noon', 's2': 's1-s4_s2_third_mark', 's3s4': 's1-s4_s3s4_procedure'}


def load(name):
    key = name.replace('-', '_')
    if key in sys.modules:
        return sys.modules[key]
    spec = importlib.util.spec_from_file_location(key, os.path.join(HERE, name + '.py'))
    m = importlib.util.module_from_spec(spec)
    sys.modules[key] = m
    spec.loader.exec_module(m)
    return m


def main(args):
    todo = [k for k in CUES if not args or k in args]
    for k in todo:
        t0 = time.time()
        sc, cue = load(CUES[k]).build()
        ebuild(sc, os.path.join(HERE, 'render'), sc.meta['id'], stems=True, loop=False, previews=True,
               workers=int(os.environ.get('OST_WORKERS', '2')))
        print(f'[{k}] {sc.meta["id"]}: {time.time() - t0:.0f} s', flush=True)


if __name__ == '__main__':
    main(sys.argv[1:])
