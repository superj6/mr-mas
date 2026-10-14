#!/usr/bin/env python3
"""Install Ep3's explicit scene layouts from the master pixel lock.

python3 studio/src/episodes/ep03/pixel/tools/picture.py [segment ...]

The draw functions are authored in art/story.ts. Each scene remains an independent
module and cache unit. This regenerates only this pass's own modules, never another
episode. Unknown visual families fail, rather than drawing a silent fallback.
"""
import json
import pathlib
import re
import sys
import subprocess

ROOT = next(p for p in pathlib.Path(__file__).resolve().parents if (p / '.mrmas-root').exists())
PIX = ROOT / 'studio/src/episodes/ep03/pixel'
PROD = ROOT / 'show/episodes/ep03/production/v1'
VISUALS = set('skyline-yarn corkboard strawberry-post lobby-handover beach stadium-box attention stadium-kick stadium-shutter stadium-fancam stadium-band stadium-kick-old darkroom-clock door-install door-interview door-turbine class-photo woodrose breakout chairs veto-hydra investor-pledge odometer nonprofit tpool-sale nobel-monitor beach-call keycap writing-room paper-bridge paper-exodus election podium amazon-rent lobby-return shipmas launch-pro launch-aros launch-elppa launch-o3 terrace-line terrace-nole reflection check-slot reveal-rumpt frozen-bay'.split())

def build(seg):
    lock = json.loads((PROD / 'lock' / f'{seg}.json').read_text())
    shots = lock['shots']
    pending = []
    for sh in shots:
        m = re.search(r'VISUAL:\s*([a-z0-9-]+)', sh.get('picture', ''), re.I)
        if not m or m[1] not in VISUALS:
            pending.append((sh['id'], m[1] if m else '(missing)'))
    if pending:
        raise ValueError(f'{seg}: unsupported visual families: {pending}')
    out = PIX / seg / 'scenes'
    out.mkdir(parents=True, exist_ok=True)
    for scene in lock['scenes']:
        slug = re.sub(r'[^a-z0-9]+', '-', scene['id'].lower()).strip('-')
        rows = [s for s in shots if s['scene'] == scene['id']]
        lines = [f'// Episode 3 · scene {scene["id"]}: master-lock picture layouts.',
                 "import {defineScene, layouts} from '../../kit';",
                 "import {drawStory} from '../../art/story';", 'const L=layouts();']
        for sh in rows:
            m = re.search(r'VISUAL:\s*([a-z0-9-]+)', sh['picture'], re.I)
            face = {l['who']: 'room' for l in sh['lines'] if l['kind'] == 'dialogue' and not l['os']}
            lines.append(f'L.add({json.dumps(sh["id"])}, {{st: {json.dumps("art/story.ts · " + m[1])}, face: {json.dumps(face)}, draw: drawStory}});')
        lines.append(f'export const SCENE=defineScene({{scene: {json.dumps(scene["id"])},layouts:L.all}});')
        (out / f'sc-{slug}.ts').write_text('\n'.join(lines) + '\n')
    # The initial empty scaffold belongs to this build; retire it once real
    # scenes exist, then refresh the segment's imports along with its layouts.
    pending_scene = out / 'sc-pending.ts'
    if pending_scene.exists() and not any(s['id']=='pending' for s in lock['scenes']):
        pending_scene.unlink()
    subprocess.run([sys.executable,str(PIX/'tools/scenes.py'),seg],check=True)
    print(f'{seg}: {len(lock["scenes"])} scenes / {len(shots)} explicit layouts')

if __name__ == '__main__':
    for segment in sys.argv[1:] or ['coldopen','act1','act2','act3','act4','tag']:
        build(segment)
