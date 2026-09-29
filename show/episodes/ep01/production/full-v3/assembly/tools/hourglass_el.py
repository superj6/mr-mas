#!/usr/bin/env python3
"""hourglass_el.py - the v3-assemble pass: Act Four's Runway hourglass insert (S7.13 k128-263) as splice PNGs for the
ELEVENLABS picture. It runs the runway pass's own hourglass.py (imported, never edited) with one thing swapped: the
Act Four frames it borrows (the band and the pixel aftermath: S7.13 k0, k127, k194; the in-context k0-127) come from
the Act Four renderer built on the EL lock (build_el.mjs, ELDIR), not the Kokoro one, so they are the EL picture's
own frames at the EL lock's frame numbers.
  ELDIR=<assembly/el-v31> audio/.venv-casting/bin/python .../assembly/tools/hourglass_el.py --scratch DIR --out DIR \
      --png GLYPH_DIR --s713 <S7.13's first frame on the EL lock> --back-at <Ttemme's line end + 1 on the EL lock>
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
import subprocess
import sys
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(REPO)
_spec = importlib.util.spec_from_file_location("hourglass", ROOT / "studio/src/dev/genvideo/runway/hourglass.py")
H = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(H)
ELDIR = os.environ["ELDIR"]


def act4_native_el(frames, scratch):
    cjs = Path(scratch) / "r-act4-el.cjs"
    subprocess.run(["node", str(ROOT / "show/episodes/ep01/production/full-v3/assembly/tools/build_el.mjs"), "act4", str(cjs)],
                   cwd=ROOT / "studio", check=True, env={**os.environ, "ELDIR": ELDIR})
    d = Path(scratch) / "a4n-el"
    subprocess.run(["node", str(cjs), "native", str(d), *map(str, frames)], cwd=ROOT / "studio", check=True, stdout=subprocess.DEVNULL)
    out = {}
    for f in frames:
        p = next(d.glob(f"n{f}-*.png"))
        out[f] = np.asarray(Image.open(p).convert("RGB"))[::2, ::2].copy()
    return out


H.act4_native = act4_native_el
sys.argv = ["hourglass.py", *sys.argv[1:]]
H.main()
