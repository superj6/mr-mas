#!/usr/bin/env python3
"""scenes.py - the Ep2 v1 pixel pipeline's scene scaffolder (new for Ep2; light, standard library only).

A segment's layouts live one module per scene, <seg>/scenes/sc-<slug>.ts (spec.ts defineScene), so the per-scene render
(tools/render.ts `scenes`) can hash each scene's own code and re-render only what changed. After a (re-)lock this tool:
  * writes a stub module for every scene of the lock that has none (its shots listed in a comment, no layouts: they
    render as the host's STAND-IN until the shot pass fills them), and never touches an existing module;
  * rewrites the block between `// <scenes>` and `// </scenes>` in <seg>/shots.ts: one import per scene module, in the
    lock's order (a module whose scene left the lock stays imported, flagged, so no drawing is lost);
  * --new-segment also writes <seg>/shots.ts itself (only when it doesn't exist).

  python3 studio/src/episodes/ep02/pixel/tools/scenes.py <seg> [--new-segment] [--dry]
      reads  studio/src/episodes/ep02/pixel/<seg>/data.ts (the lock tools/lock.py wrote)
      writes studio/src/episodes/ep02/pixel/<seg>/scenes/sc-<slug>.ts (new stubs) and <seg>/shots.ts (the import block)
The scene id's file name: lowercase, every run of other characters -> '-' (spec.ts sceneSlug: '4A' -> sc-4a.ts).
"""
from __future__ import annotations

import json
import os
import re
import sys

PIXEL = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))


def slug(scene: str) -> str:
    """spec.ts sceneSlug"""
    s = re.sub(r'[^a-z0-9]+', '-', str(scene).lower()).strip('-')
    return s or 'x'


def ident(scene: str) -> str:
    return 'sc_' + slug(scene).replace('-', '_')


def read_lock(seg: str) -> dict:
    p = os.path.join(PIXEL, seg, 'data.ts')
    txt = open(p).read()
    m = re.search(r'export const LOCK: SegLock = (\{.*\});\s*$', txt, re.M)
    if not m:
        raise SystemExit(f'{p}: no LOCK (run tools/lock.py --seg {seg} first)')
    return json.loads(m.group(1))


SHOTS_TS = """// MR. MAS — Ep2 v1 · {seg}: the segment's layouts, ONE MODULE PER SCENE (scenes/sc-<scene>.ts, spec.ts defineScene).
// The import block between the markers is written by tools/scenes.py {seg} (run it after every re-lock: it adds a stub
// for each new scene); draw in the scene modules, not here, so the per-scene cache re-renders only what changed.
import {{defineSegment, fromScenes}} from '../spec';
import type {{SceneSpec}} from '../spec';
import {{LOCK}} from './data';
// <scenes>
const SCENES: SceneSpec[] = [];
// </scenes>
export const SEGMENT = defineSegment({{seg: '{seg}', lock: LOCK, layouts: fromScenes(...SCENES)}});
"""

STUB = """// MR. MAS — Ep2 v1 · {seg} · scene {scene}: {n} shot(s), {frames} f at the lock of {when}:
//   {shots}
// A stub written by tools/scenes.py: no layouts yet, so every shot renders as the host's STAND-IN (render.ts `check`
// fails on stand-ins). Fill it with L.add(<shot id>, {{st, draw: (fb, k, sh, f) => ...}}) per shot (README.md); `f` is
// the frame inside this scene. Name every file a layout reads at run time in defineScene({{assets}}).
import {{defineScene, layouts}} from '../../kit';

const L = layouts();

export const SCENE = defineScene({{scene: {scene_js}, layouts: L.all}});
"""


def main(argv: list[str]) -> int:
    args = [a for a in argv if not a.startswith('--')]
    if len(args) != 1:
        print(__doc__)
        return 2
    seg, dry = args[0], '--dry' in argv
    lock = read_lock(seg)
    scenes = lock.get('scenes') or []
    shots = {s['id']: s for s in lock['shots']}
    d = os.path.join(PIXEL, seg, 'scenes')
    made = []
    for sc in scenes:
        f = os.path.join(d, f'sc-{slug(sc["id"])}.ts')
        if os.path.exists(f):
            continue
        ids = sc['shots']
        desc = ' · '.join(f"{i} ({shots[i]['e'] - shots[i]['s']} f, {shots[i]['framing'][:40]})" for i in ids)
        body = STUB.format(seg=seg, scene=sc['id'], n=len(ids), frames=sc['e'] - sc['s'], when=lock['source']['timeline'],
                           shots=re.sub(r'(.{1,112})(?: |$)', '\\1\n//   ', desc).rstrip('/ \n'), scene_js=json.dumps(sc['id']))
        made.append(os.path.relpath(f, PIXEL))
        if not dry:
            os.makedirs(d, exist_ok=True)
            open(f, 'w').write(body)
    # the modules on disk: the lock's order first, then any whose scene left the lock (kept, flagged)
    on_disk = sorted(x[3:-3] for x in os.listdir(d) if x.startswith('sc-') and x.endswith('.ts')) if os.path.isdir(d) else []
    order = [slug(sc['id']) for sc in scenes if slug(sc['id']) in on_disk or not dry]
    order += [x for x in on_disk if x not in order]
    gone = [x for x in on_disk if x not in {slug(sc['id']) for sc in scenes}]
    lines = ['// <scenes> (tools/scenes.py: one import per scene module, in the lock\'s order)']
    for x in order:
        lines.append(f"import {{SCENE as {ident(x)}}} from './scenes/sc-{x}';" + ('   // NOT IN THE LOCK: its scene left it' if x in gone else ''))
    lines.append(f"const SCENES: SceneSpec[] = [{', '.join(ident(x) for x in order)}];")
    lines.append('// </scenes>')
    sp = os.path.join(PIXEL, seg, 'shots.ts')
    if not os.path.exists(sp):
        if '--new-segment' not in argv:
            raise SystemExit(f'no {sp} (pass --new-segment to write it)')
        txt = SHOTS_TS.format(seg=seg)
    else:
        txt = open(sp).read()
    if '// <scenes>' not in txt or '// </scenes>' not in txt:
        raise SystemExit(f'{sp}: no // <scenes> ... // </scenes> block to rewrite')
    new = re.sub(r'// <scenes>.*?// </scenes>', lambda _m: '\n'.join(lines), txt, flags=re.S)
    if not dry:
        os.makedirs(os.path.dirname(sp), exist_ok=True)
        open(sp, 'w').write(new)
    print(f'{seg}: {len(scenes)} scenes in the lock; new stubs {made or "none"}; shots.ts imports {len(order)}'
          + (f'; NOT IN THE LOCK (kept): {gone}' if gone else '') + (' (dry run: nothing written)' if dry else ''))
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
