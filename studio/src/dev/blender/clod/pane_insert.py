# MR. MAS: CLOD look-dev, the in-episode insert: clay CLOD rendered for the lighthouse pane of Ep1 shot 11.04 (the
# split-screen duel, "You're absolutely right!"), timed from the LOCK, not by hand, so a new lock re-times it.
# Two passes per drawing, cropped round the plinth: the clay (RGBA) and its shadow (a shadow catcher shaped like the
# pixel plinth and the floor), which composite.py lays into the clean pixel plate.
#   ops/heavy.sh blender -b --factory-startup --python studio/src/dev/blender/clod/pane_insert.py -- \
#       --outdir out/lookdev/clod-3d/tmp/work/pane [--lock show/episodes/ep01/production/full-v3/lock/act1.json]
#       [--shot 11.04] [--samples 64] [--only 20,40]
# The pane's geometry (studio/src/shared/pixel/rooms/duel-split.ts): the right pane shows lighthouse x from 64 at
# frame x 242; CLOD's foot is room (142, 176) -> native frame (320, 177) -> screen (1282, 710) at 4x. The pixel CLOD
# is 56 native px tall at 5 mm a pixel, so the puppet is 0.28 m and one screen pixel is 1.25 mm at the puppet.
import os
import sys
import json
import math
import time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bpy  # noqa: E402
from mathutils import Vector, Matrix  # noqa: E402
from bpy_extras.object_utils import world_to_camera_view  # noqa: E402
import studio as S  # noqa: E402
import clod_rig as R  # noqa: E402
import acting as AC  # noqa: E402

REPO = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '..', '..', '..'))
A = S.args({'outdir': 'pane', 'lock': os.path.join(REPO, 'show/episodes/ep01/production/full-v3/lock/act1.json'),
            'shot': '11.04', 'line': 'e1-a1-11-02', 'samples': 64, 'shadow_samples': 24, 'threads': 10,
            'only': '', 'exposure': 0.0, 'key': 30.0, 'rim': 9.0})
os.makedirs(A['outdir'], exist_ok=True)
FOOT = (1282.0, 710.0)          # screen px of CLOD's foot centre on the plinth
MM_PER_PX = 1.25
CROP = (1080, 388, 1480, 788)   # x0, y0, x1, y1 (screen px, top-left origin; on the 4x4 grid): the insert's region

# ---- the lock's timing
lock = json.load(open(A['lock']))
shot = [s for s in lock['shots'] if s['id'] == A['shot']][0]
line = [l for l in shot['lines'] if l['id'] == A['line']][0]
others = [l for l in shot['lines'] if l['who'] == 'MARIO']
ls, le = line['s'], line['e']
words = {w[0].lower().strip('!.,'): (ls + w[1], ls + w[2]) for w in line['words']}
MOUTH = [(ls + m[0], m[1]) for m in line['mouth']]
k_on = ls - 2                    # the layout's own mark: the launch light slams on 2 frames before the line
add = others[0]['s'] if others else le + 35
cheer = next((sp['k'] for sp in shot.get('spots', []) if 'cheer' in sp['name']), add + 38)
ab = words.get('absolutely', (ls + 4, ls + 20))[0]
rt = words.get('right', (ls + 20, ls + 33))[0]
K_END = shot['e'] - shot['s']

# ---- the performance in the pane, on the lock's marks. turn +: toward Mario (frame right); -: toward the split
TR = AC.Track([
    (k_on, {'bow': 0.0, 'head': -2.0, 'turn': 18.0, 'tilt': 0.0, 'squash': 1.03}),
    (ab - 2, {'bow': -2.0, 'head': -5.0, 'squash': 1.045}),
    (ab + 3, {'bow': 9.0, 'head': 15.0, 'squash': 0.93}),
    (ab + 8, {'bow': 4.0, 'head': 6.0, 'squash': 1.0}),
    (rt - 2, {'bow': 1.0, 'head': -1.0, 'squash': 1.02}),
    (rt + 3, {'bow': 7.0, 'head': 12.0, 'squash': 0.95}),
    (rt + 9, {'bow': 3.0, 'head': 5.0, 'squash': 0.99}),
    (le + 4, {'bow': 0.0, 'head': 0.0, 'turn': 2.0, 'squash': 1.025}),       # it rises and faces us (the pixel 'up')
    (le + 12, {'squash': 1.0, 'tilt': 3.0}),
    (le + 16, {'turn': -7.0, 'head': -3.0, 'tilt': -3.0}),                   # Mario looks up at the split; so does CLOD
    (add - 6, {'turn': -7.0}),
    (add - 2, {'turn': 14.0, 'head': 2.0, 'tilt': 4.0}),                     # to Mario for "Addendum."
    (add + 12, {'bow': 3.0, 'head': 8.0, 'squash': 0.97}),                   # ...and agrees with that too
    (add + 18, {'bow': 0.5, 'head': 1.0, 'squash': 1.0}),
    (add + 28, {'turn': 5.0, 'tilt': 2.0}),
    (cheer + 2, {'turn': 5.0}),
    (cheer + 6, {'turn': -13.0, 'head': -2.0, 'tilt': -4.0}),                # the rival's room cheers across the split
    (cheer + 44, {'turn': -13.0}),
    (cheer + 52, {'turn': 4.0, 'head': 1.0, 'tilt': 3.0}),
    (K_END, {'turn': 4.0}),
])
HAPPY = [(ab + 1, ab + 7), (rt + 2, rt + 8), (add + 12, add + 16), (cheer + 64, cheer + 66)]
steps = list(range(k_on, K_END, 2))
BOIL = R.boil_order(len(steps), seed=13)
WHEEL, a = [], 0.0
for k in steps:
    a += 36.0 if k < le + 10 else 20.0
    WHEEL.append(a)


def pose_at(i, k):
    d = TR.at(k)
    eyes = 'happy' if any(x <= k < y for x, y in HAPPY) else 'open'
    return R.Pose(bow=d['bow'], head=d['head'], turn=d['turn'], tilt=d['tilt'], squash=d['squash'],
                  mouth=R.mouth_of(AC.mouth_at(MOUTH, k)), eyes=eyes, boil=BOIL[i], wheel=WHEEL[i],
                  jitter=tuple(x * 0.001 for x in AC.jitter(AC.PUPPET_JITTER, i)))


# ---- the scene
T = S.Timer()
sc = S.reset()
eid = S.render_settings(sc, 'CYCLES', 1920, 1080, A['samples'], A['threads'], 'Standard', 'None', A['exposure'], transparent=True)
sc.render.use_persistent_data = True
r = sc.render
r.use_border, r.use_crop_to_border = True, True
r.border_min_x, r.border_max_x = CROP[0] / 1920, CROP[2] / 1920
r.border_min_y, r.border_max_y = 1 - CROP[3] / 1080, 1 - CROP[1] / 1080
c = R.build()
T.mark('build')
clay_objs = [o for o in c.coll.objects if o.type == 'MESH']

# the shadow catchers: the plinth (41 x 17 native px: 0.205 m wide, 0.085 m tall; deep enough for the puppet's
# footprint) and the lighthouse floor below it
def box(name, x0, x1, y0, y1, z0, z1):
    import bmesh
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts:
        v.co = Vector(((x0 + x1) / 2 + v.co.x * (x1 - x0), (y0 + y1) / 2 + v.co.y * (y1 - y0), (z0 + z1) / 2 + v.co.z * (z1 - z0)))
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    ob = bpy.data.objects.new(name, me)
    sc.collection.objects.link(ob)
    return ob


plinth = box('plinth_catch', -0.1025, 0.1025, -0.105, 0.105, -0.085, 0.0)
floor = box('floor_catch', -1.5, 1.5, -1.0, 2.0, -0.095, -0.085)
catchers = [plinth, floor]
for ob in catchers:
    ob.is_shadow_catcher = True

# the lighthouse at night: a dark blue room, the can light's warm key from the upper left (the stand is nearer
# than the plinth), and a weak warm kick from the lamp and desk behind-right
S.world(sc, (0.018, 0.022, 0.048), 1.0)
ld = bpy.data.lights.new('can', 'SPOT')
ld.energy = A['key']
ld.color = (1.0, 0.70, 0.40)
ld.spot_size = math.radians(58)
ld.spot_blend = 0.45
ld.shadow_soft_size = 0.035
can = bpy.data.objects.new('can', ld)
sc.collection.objects.link(can)
can.location = Vector((-0.30, -0.16, 0.52))
S.aim(can, (0.0, 0.0, 0.13))
S.key_light((0.34, 0.50, 0.40), (0.0, 0.0, 0.16), power=A['rim'], size=0.25, color=(1.0, 0.78, 0.45), shape='DISK', name='lamp_kick')

# the camera: a long lens from 6.7 m, pitched 8.6 degrees down (the plinth top's 3:41 ellipse), shifted so the foot
# lands on the pixel plinth
D = 1920 * MM_PER_PX / 1000 * 100 / 36
pitch = math.radians(8.6)
tgt = Vector((0, 0, 0.14))
cam = S.camera(tgt + Vector((0, -D * math.cos(pitch), D * math.sin(pitch))), tgt, lens=100, fstop=0)
cam.data.dof.use_dof = True
cam.data.dof.aperture_fstop = 1.2          # at this lens and distance, a whisper of depth: the far arm softens a hair
cam.data.dof.focus_distance = (Vector((0, -0.07, 0.2)) - cam.location).length
for _ in range(3):
    bpy.context.view_layer.update()
    p = world_to_camera_view(sc, cam, Vector((0, 0, 0)))
    px, py = p.x * 1920, (1 - p.y) * 1080
    cam.data.shift_x += (px - FOOT[0]) / 1920
    cam.data.shift_y += (FOOT[1] - py) / 1920
bpy.context.view_layer.update()
p0 = world_to_camera_view(sc, cam, Vector((0, 0, 0)))
p1 = world_to_camera_view(sc, cam, Vector((0, 0, R.H)))
meta = {'crop': CROP, 'foot_px': [p0.x * 1920, (1 - p0.y) * 1080], 'top_px': [p1.x * 1920, (1 - p1.y) * 1080],
        'shot': A['shot'], 'shot_start': shot['s'], 'k_on': k_on, 'k_end': K_END, 'marks': {'ls': ls, 'le': le, 'ab': ab, 'rt': rt, 'add': add, 'cheer': cheer},
        'mouth': MOUTH, 'engine': eid, 'samples': A['samples'], 'drawings': []}
print('[clod] foot at', meta['foot_px'], 'top at', meta['top_px'], flush=True)
T.mark('scene')

only = [int(x) for x in A['only'].split(',') if x] if A['only'] else None
for i, k in enumerate(steps):
    if only and k not in only:
        continue
    R.apply_pose(c, pose_at(i, k))
    fabs = shot['s'] + k
    t0 = time.time()
    # pass 1: the clay alone
    for ob in catchers:
        ob.visible_camera = False
    for ob in clay_objs:
        ob.visible_camera = True
    sc.cycles.samples = A['samples']
    r.filepath = os.path.abspath(os.path.join(A['outdir'], f'clay-{fabs}.png'))
    bpy.ops.render.render(write_still=True)
    t1 = time.time()
    # pass 2: its shadow on the plinth and floor (the clay invisible to the lens, still casting)
    for ob in catchers:
        ob.visible_camera = True
    for ob in clay_objs:
        ob.visible_camera = False
    sc.cycles.samples = A['shadow_samples']
    r.filepath = os.path.abspath(os.path.join(A['outdir'], f'shadow-{fabs}.png'))
    bpy.ops.render.render(write_still=True)
    t2 = time.time()
    meta['drawings'].append({'k': k, 'frame': fabs, 'clay_s': round(t1 - t0, 2), 'shadow_s': round(t2 - t1, 2)})
    print(f'[clod] k {k} (frame {fabs}) clay {t1 - t0:.1f} s shadow {t2 - t1:.1f} s', flush=True)
T.mark('render')
meta['times_s'] = T.marks
S.write_log(os.path.join(A['outdir'], 'pane-log.json'), meta)
