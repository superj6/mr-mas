# MR. MAS: CLOD look-dev, the turnaround still: front, three-quarter, profile and back on a neutral sweep, one soft key.
#   ops/heavy.sh blender -b --factory-startup --python studio/src/dev/blender/clod/turnaround.py -- \
#       --out out/lookdev/clod-3d/clod-turnaround.png [--engine CYCLES|EEVEE] [--w 1920 --h 1080] [--samples 128]
# The look check (2026-09-28, 960 x 540) picked Cycles over EEVEE (EEVEE's soft shadows came out grainy on the sweep)
# and a key of 75 W at the check's distance; here the key sits 1.68x further out at the same angle, with its size and
# power scaled to match, so the four figures get the same light within a third of a stop.
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bpy  # noqa: E402
import studio as S  # noqa: E402
import clod_rig as R  # noqa: E402

A = S.args({'out': 'clod-turnaround.png', 'engine': 'CYCLES', 'w': 1920, 'h': 1080, 'samples': 128, 'threads': 10,
            'view': 'AgX', 'look': 'None', 'exposure': 0.0, 'key': 75.0, 'fstop': 4.0, 'log': '', 'alt': ''})
T = S.Timer()
sc = S.reset()
eid = S.render_settings(sc, A['engine'], A['w'], A['h'], A['samples'], A['threads'], A['view'], A['look'], A['exposure'])
c = R.build()
T.mark('build')
R.apply_pose(c, R.Pose(mouth='smile', eyes='open', boil=0, wheel=25.0))
S.exclude(c.coll)
# the classic order, turning the same way: front, three-quarter, profile, back (it faces -Y; -rot turns it to frame left)
for x, rz, nm in ((-0.36, 0.0, 'front'), (-0.12, -45.0, 'threequarter'), (0.12, -90.0, 'profile'), (0.36, 180.0, 'back')):
    S.instance(c.coll, (x, 0.0, 0.0), rz, nm)
S.sweep(y0=-2.0, depth=2.45, radius=0.5, height=1.4)
S.world(sc, (0.52, 0.53, 0.56), 0.16)
# the one soft key: high front-left, a large disc (a softbox); the look check's angle, pulled back 1.68x
k = 1.68
S.key_light((-0.95 * k, -1.05 * k, 1.05 * k), (0.0, 0.0, 0.13), power=A['key'] * k * k, size=0.7 * k)
S.camera((0.0, -2.5, 0.125), (0.0, 0.0, 0.145), lens=85, fstop=A['fstop'])
T.mark('scene')
sc.render.filepath = os.path.abspath(A['out'])
bpy.ops.render.render(write_still=True)
T.mark('render')
# look comparisons from the same render: other view transforms / exposures, e.g. --alt Standard:-0.5,AgX:0
for spec in [x for x in A['alt'].split(',') if x]:
    vt, ex = spec.split(':')
    sc.view_settings.view_transform = vt
    sc.view_settings.exposure = float(ex)
    bpy.data.images['Render Result'].save_render(os.path.abspath(A['out']).replace('.png', f'-{vt}{ex}.png'), scene=sc)
if A['log']:
    S.write_log(A['log'], {'engine': eid, 'w': A['w'], 'h': A['h'], 'samples': A['samples'], 'times_s': T.marks})
