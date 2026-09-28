# MR. MAS: the final CLOD insert (Ep1 11.04), its delivery for the episode's own renderer: pane_insert.py's cropped
# clay and shadow drawings -> 1920 x 1080 RGBA layers per drawing, plus the manifest the renderer's overlay stage reads
# (studio/src/episodes/ep01/pixel/tools/render.ts; a layout declares it with `overlay: {manifest}`, spec.ts).
# The look is the test's, unchanged (composite.py): the clay graded (0.88, 0.78, 0.74) and laid in at output resolution;
# its shadow averaged on the native 4 x 4 grid, stepped into two rungs and pulled toward the night palette (PAL.N2).
# Here each is its own straight-alpha layer, bottom first (shadow, clay), so the renderer composites them over its own
# picture: the same arithmetic as composite.py's mock-up.
# Blender's bundled Python (numpy + OpenImageIO):
#   $PY insert_layers.py --pane <pane_insert outdir> --out out/ep01/full-v3/inserts/clod-v35-el --seg act1 \
#       --key ep01-v35-el-stick --timeline show/reel/ep01-v35-el/ep01-v35-el-act1.json
import os
import sys
import json
import hashlib
import numpy as np
from composite import read, write, grid_step

REPO = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '..', '..', '..'))
a = sys.argv[1:]
A = {'pane': '', 'out': '', 'seg': 'act1', 'key': '', 'timeline': '', 'gain': '0.88,0.78,0.74', 'shadow': '0.62'}
A.update({a[i].lstrip('-'): a[i + 1] for i in range(0, len(a) - 1, 2)})
meta = json.load(open(os.path.join(A['pane'], 'pane-log.json')))
x0, y0, x1, y1 = meta['crop']
s0, k_on, k_end = meta['shot_start'], meta['k_on'], meta['k_end']
gain = np.array([float(x) for x in A['gain'].split(',')], np.float32)
strength = float(A['shadow'])
night = np.array([0x0d, 0x10, 0x20], np.float32) / 255.0 * 0.6       # composite.py: base (1 - q) + N2 0.6 q
os.makedirs(os.path.join(A['out'], 'clay'), exist_ok=True)
os.makedirs(os.path.join(A['out'], 'shadow'), exist_ok=True)

drawn = sorted(d['k'] for d in meta['drawings'])
for kd in drawn:
    f = s0 + kd
    clay = read(os.path.join(A['pane'], f'clay-{f}.png'))
    shad = read(os.path.join(A['pane'], f'shadow-{f}.png'))
    # the shadow layer: its alpha over the frame, stepped on the native grid (two rungs), coloured toward the night
    sa = np.zeros((1080, 1920), np.float32)
    sa[y0:y1, x0:x1] = shad[..., 3]
    q = grid_step(sa, [(0.10, 0.34), (0.32, 0.62)]) * strength
    L = np.zeros((1080, 1920, 4), np.float32)
    L[..., :3] = np.where(q[..., None] > 0, night, 0)
    L[..., 3] = q
    write(os.path.join(A['out'], 'shadow', f's{f}.png'), L)
    # the clay layer: graded as the test, straight alpha, nothing outside the clay
    C = np.zeros((1080, 1920, 4), np.float32)
    al = clay[..., 3:4]
    C[y0:y1, x0:x1, :3] = np.where(al > 0, np.clip(clay[..., :3] * gain, 0, 1), 0)
    C[y0:y1, x0:x1, 3:4] = al
    write(os.path.join(A['out'], 'clay', f'c{f}.png'), C)

frames = []
for k in range(k_on, k_end):
    kd = k_on + ((k - k_on) // 2) * 2                        # on 2s from the launch light
    if kd not in drawn:
        raise SystemExit(f'no drawing for k {k} (drawing k {kd})')
    frames.append({'k': k, 'f': s0 + k, 'layers': [f'shadow/s{s0 + kd}.png', f'clay/c{s0 + kd}.png']})
tl = A['timeline']
man = {
    'kind': 'pixel-overlay',
    'what': "Ep1 11.04, the 3D claymation CLOD in the lighthouse pane, from the launch light to the cut (\"You're absolutely right!\", then \"Addendum.\")",
    'seg': A['seg'], 'shot': meta['shot'], 'beat': meta['shot'],
    'lock': {'key': A['key'], 'timeline': tl, 'timeline_sha1': hashlib.sha1(open(os.path.join(REPO, tl), 'rb').read()).hexdigest() if tl else None,
             'lock_json': 'studio/src/episodes/ep01/pixel/tools/lock.py --timeline ' + tl},
    'shot_s': s0, 'shot_e': s0 + meta['shot_len'], 'shot_len': meta['shot_len'],
    'check': {'line': meta['line'], 's': meta['line_se'][0], 'e': meta['line_se'][1]},
    'k_from': k_on, 'k_to': k_end, 'f_from': s0 + k_on, 'f_to': s0 + k_end, 'frame_count': len(frames), 'drawings': len(drawn),
    'marks': meta['marks'], 'take': meta['take'], 'mouth_src': meta['mouth_src'],
    'size': [1920, 1080], 'alpha': 'straight', 'layers': 'bottom first: the shadow, then the clay', 'area': 'the room (above the band)',
    'look': {'engine': meta['engine'], 'samples': meta['samples'], 'shadow_samples': meta['shadow_samples'], 'can_light_w': meta['key_w'],
             'grade': [float(x) for x in gain], 'shadow_rungs': [[0.10, 0.34], [0.32, 0.62]], 'shadow_strength': strength, 'crop': meta['crop']},
    'frames': frames,
}
json.dump(man, open(os.path.join(A['out'], 'manifest.json'), 'w'), indent=1)
print(f"wrote {len(drawn)} drawings x 2 layers and a manifest of {len(frames)} frames ({s0 + k_on}-{s0 + k_end - 1}) to {A['out']}")
