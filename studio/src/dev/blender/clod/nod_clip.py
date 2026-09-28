# MR. MAS: CLOD look-dev, the 4 s nod: "You're absolutely right!", an eager, polite nod with a small squash on the
# accent. 24 fps, shot ON 2s (48 drawings, each held two frames), the camera stepping on 2s with hand-placed jitter,
# the surface boiling through its four replacement surfaces, the chest wheel turning, three replacement mouths from
# the Kokoro take's own mouth track (audio/ep01/act1/dialogue/lines-fast-v1.json, e1-a1-11-02).
#   ops/heavy.sh blender -b --factory-startup --python studio/src/dev/blender/clod/nod_clip.py -- \
#       --outdir out/lookdev/clod-3d/tmp/work/clip [--samples 48] [--w 1920 --h 1080] [--only 16,32]
# Frames come out as f000.png ... f047.png (drawing n is shown on frames 2n and 2n+1). encode.sh muxes them.
import os
import sys
import json
import time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bpy  # noqa: E402
import math  # noqa: E402
from mathutils import Vector, Matrix  # noqa: E402
import studio as S  # noqa: E402
import clod_rig as R  # noqa: E402
import acting as AC  # noqa: E402

REPO = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '..', '..', '..'))
A = S.args({'outdir': 'clip', 'engine': 'CYCLES', 'w': 1920, 'h': 1080, 'samples': 48, 'threads': 10, 'view': 'AgX',
            'exposure': 0.0, 'key': 75.0, 'fstop': 2.8, 'only': '', 'audio_delay_f': 14})
os.makedirs(A['outdir'], exist_ok=True)
FRAMES = 96                                   # 4 s at 24 fps
AUD = A['audio_delay_f']                      # the take's file starts on this frame (its first sound ~12 frames later)

# the take's own mouth track and words (file-relative seconds), from the episode's line record
take = [x for x in json.load(open(os.path.join(REPO, 'audio/ep01/act1/dialogue/lines-fast-v1.json'))) if x['id'] == 'e1-a1-11-02'][0]
MOUTH = [(AUD + round(m['t'] * 24), m['shape']) for m in take['mouth']]
W = {w['w']: (AUD + w['t0'] * 24, AUD + w['t1'] * 24) for w in take['words']}
ab, rt = W['absolutely'][0], W['right'][0]     # the two accents: "AB-solutely", "RIGHT"

# the performance (degrees; squash is volume-preserving, z * s): it listens, draws itself up, nods deep on "AB-",
# a second, smaller nod on "RIGHT", overshoots proud, settles pleased
TR = AC.Track([
    (0, {'bow': 0.0, 'head': 3.0, 'turn': 7.0, 'tilt': -4.0, 'squash': 1.0}),
    (10, {'head': 4.0, 'tilt': -6.0}),
    (ab - 12, {'bow': -2.0, 'head': -4.0, 'tilt': -2.0, 'squash': 1.035}),
    (ab - 5, {'bow': -3.0, 'head': -7.0, 'tilt': 0.0, 'squash': 1.05}),
    (ab + 1, {'bow': 7.0, 'head': 11.0, 'squash': 0.965}),
    (ab + 5, {'bow': 10.0, 'head': 17.0, 'squash': 0.93}),
    (ab + 10, {'bow': 4.0, 'head': 7.0, 'squash': 1.0}),
    (rt - 3, {'bow': 0.5, 'head': -2.0, 'squash': 1.02}),
    (rt + 3, {'bow': 7.0, 'head': 12.0, 'squash': 0.95}),
    (rt + 8, {'bow': 3.5, 'head': 6.0, 'squash': 0.985}),
    (rt + 15, {'bow': -1.5, 'head': -3.0, 'squash': 1.025, 'tilt': 3.0}),
    (rt + 22, {'bow': 0.5, 'head': 1.5, 'squash': 1.0, 'tilt': 5.0}),
    (FRAMES, {'bow': 0.5, 'head': 1.0, 'tilt': 5.5}),
])
HAPPY = [(ab + 3, ab + 9), (rt + 1, rt + 7), (82, 84)]    # happy-shut eyes at the nods' bottoms, and one blink


def pose_at(f):
    d = TR.at(f)
    step = f // 2
    eyes = 'happy' if any(a <= f < b for a, b in HAPPY) else 'open'
    shape = AC.mouth_at(MOUTH, f)
    # the wheel: turning while it listens, faster while it agrees (its thinking), easing after
    spd = 16.0 if f < ab - 12 else 44.0 if f < rt + 16 else 24.0
    return R.Pose(bow=d['bow'], head=d['head'], turn=d['turn'], tilt=d['tilt'], squash=d['squash'], lift=d['lift'],
                  mouth=R.mouth_of(shape), eyes=eyes, boil=BOIL[step], wheel=WHEEL[step],
                  jitter=tuple(x * 0.001 for x in AC.jitter(AC.PUPPET_JITTER, step)))


BOIL = R.boil_order(FRAMES // 2 + 1, seed=5)
WHEEL, a = [], 20.0
for s in range(FRAMES // 2 + 1):
    f = s * 2
    a += 16.0 if f < ab - 12 else 44.0 if f < rt + 16 else 24.0
    WHEEL.append(a)

T = S.Timer()
sc = S.reset()
eid = S.render_settings(sc, A['engine'], A['w'], A['h'], A['samples'], A['threads'], A['view'], 'None', A['exposure'])
sc.render.use_persistent_data = True
c = R.build()
T.mark('build')
S.sweep(y0=-2.6, depth=3.05, radius=0.5, height=1.4, texture=True)
S.world(sc, (0.52, 0.53, 0.56), 0.22)
S.key_light((-0.95, -1.05, 1.05), (0.0, 0.0, 0.13), power=A['key'], size=0.7)
# the camera: a little right of front, at the puppet's chest height; a slow push stepped on 2s, hand-placed jitter
cam = S.camera((0.30, -2.05, 0.13), (0.0, 0.0, 0.148), lens=100, fstop=A['fstop'])
bpy.context.view_layer.update()               # matrix_world is stale until the layer updates (else it is identity)
base_loc, base_M = cam.location.copy(), cam.matrix_world.copy()
push_dir = (Vector((0.0, 0.0, 0.148)) - base_loc).normalized()
eye = Vector((0.0, -0.065, 0.236))
only = [int(x) for x in A['only'].split(',') if x] if A['only'] else None
log = {'engine': eid, 'w': A['w'], 'h': A['h'], 'samples': A['samples'], 'frames': []}
for step in range(FRAMES // 2):
    f = step * 2
    if only and f not in only:
        continue
    R.apply_pose(c, pose_at(f))
    jx, jz, jr = AC.jitter(AC.CAM_JITTER, step)
    off = push_dir * (0.09 * AC.ease(f / (FRAMES - 2))) + Vector((jx * 0.001, 0.0, jz * 0.001))
    cam.matrix_world = Matrix.Translation(off) @ base_M @ Matrix.Rotation(math.radians(jr), 4, 'Z')
    cam.data.dof.focus_distance = (eye - cam.location).length
    sc.frame_set(f)
    sc.render.filepath = os.path.abspath(os.path.join(A['outdir'], f'f{step:03d}.png'))
    t0 = time.time()
    bpy.ops.render.render(write_still=True)
    log['frames'].append({'step': step, 'frame': f, 's': round(time.time() - t0, 2)})
    print(f'[clod] drawing {step} (frame {f}) {log["frames"][-1]["s"]} s', flush=True)
T.mark('render')
log['times_s'] = T.marks
log['mouth'] = MOUTH
log['audio_delay_frames'] = AUD
S.write_log(os.path.join(A['outdir'], 'clip-log.json'), log)
