# MR. MAS — Ep2 v1 art: the 2.A leap's PROGRAMMATIC FILLER (LEARNINGS P13, FIRM): AROS's preview inside the lobby's
# wall screen (sc 1): a woolly mammoth plodding toward the camera through a snowy meadow, near-photoreal, silent; a
# fifth leg flickers for two frames late in the walk (the tell). Objects only: the animal, the meadow, the snow (P14:
# nothing human in the plate). The proposal named a three.js PBR walk; this is the same layer built in Blender 4.5.3
# (a PBR material set, real hair on the animal, EEVEE on the iGPU) because Blender is the machine's 3D tool; it holds
# the final's timing (2 s, 48 frames at 24 fps), framing (the lobby wall screen's own rect, 103 x 101, at x4) and meaning, so the video model's version
# (manifest §4 2.A) drops in as a layer swap: same folder layout, same clip.json.
#
# Deterministic: hashed sizes and positions, no random module, no clocks.
# Run (from the repo root, through ops/heavy.sh):
#   ops/heavy.sh ~/Downloads/blender-4.5.3-linux-x64/blender -b --factory-startup \
#     --python studio/src/episodes/ep02/pixel/art/aros/aros_mammoth.py -- --out out/ep02/v1/art/aros [--w 412] [--h 404] \
#     [--frames 48] [--samples 24]
# Writes OUT/frames/aros_0001.png .. and OUT/clip.json (the GenClipManifest shape of shared/pixel/genclip.ts).
import json
import math
import os
import sys
import bpy
from mathutils import Vector


def args():
    a = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
    out = {'out': 'out/ep02/v1/art/aros', 'w': '412', 'h': '404', 'frames': '48', 'samples': '24', 'only': ''}
    for i in range(0, len(a) - 1, 2):
        out[a[i].lstrip('-')] = a[i + 1]
    return out


A = args()
W, H, NF, SAMPLES = int(A['w']), int(A['h']), int(A['frames']), int(A['samples'])
ONLY = [int(x) for x in A['only'].split(',') if x]


def hz(i, k):
    v = math.sin(i * 12.9898 + k * 78.233 + i * k * 0.0173) * 43758.5453
    return v - math.floor(v)


bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
for e in ('BLENDER_EEVEE_NEXT', 'BLENDER_EEVEE'):
    try:
        sc.render.engine = e
        break
    except TypeError:
        continue
r = sc.render
r.resolution_x, r.resolution_y, r.resolution_percentage = W, H, 100
r.image_settings.file_format = 'PNG'
r.image_settings.color_mode = 'RGB'
sc.eevee.taa_render_samples = SAMPLES
for k, v in (('use_shadows', True), ('use_gtao', True), ('gtao_distance', 0.6)):
    if hasattr(sc.eevee, k):
        try:
            setattr(sc.eevee, k, v)
        except Exception:
            pass
sc.view_settings.view_transform = 'AgX'
try:
    sc.view_settings.look = 'AgX - Base Contrast'
except TypeError:
    pass


def mat(name, color, rough=0.5, sheen=0.0, sss=0.0, emit=None, strength=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    p = m.node_tree.nodes['Principled BSDF']
    p.inputs['Base Color'].default_value = (*color, 1)
    p.inputs['Roughness'].default_value = rough
    for key, val in (('Sheen Weight', sheen), ('Subsurface Weight', sss)):
        if key in p.inputs:
            p.inputs[key].default_value = val
    if emit is not None:
        p.inputs['Emission Color'].default_value = (*emit, 1)
        p.inputs['Emission Strength'].default_value = strength
    return m


def fur_mat(name, base, tip):
    """the mammoth's coat: a dark red-brown root to a paler tip along each strand (the hair's own UV), a sheen rim"""
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    p = nt.nodes['Principled BSDF']
    p.inputs['Roughness'].default_value = 0.78
    if 'Sheen Weight' in p.inputs:
        p.inputs['Sheen Weight'].default_value = 0.5
    info = nt.nodes.new('ShaderNodeHairInfo')
    ramp = nt.nodes.new('ShaderNodeValToRGB')
    ramp.color_ramp.elements[0].color = (*base, 1)
    ramp.color_ramp.elements[1].color = (*tip, 1)
    nt.links.new(info.outputs['Intercept'], ramp.inputs['Fac'])
    noise = nt.nodes.new('ShaderNodeTexNoise')
    noise.inputs['Scale'].default_value = 3.0
    mix = nt.nodes.new('ShaderNodeMix')
    mix.data_type = 'RGBA'
    mix.blend_type = 'MULTIPLY'
    mix.inputs['Factor'].default_value = 0.35
    nt.links.new(ramp.outputs['Color'], mix.inputs['A'])
    nt.links.new(noise.outputs['Color'], mix.inputs['B'])
    nt.links.new(mix.outputs['Result'], p.inputs['Base Color'])
    return m


SNOW = mat('snow', (0.86, 0.89, 0.94), rough=0.5, sheen=0.2, sss=0.15)
SKIN = mat('hide', (0.10, 0.05, 0.03), rough=0.85, sheen=0.4)
FUR = fur_mat('fur', (0.045, 0.022, 0.014), (0.24, 0.13, 0.065))
IVORY = mat('ivory', (0.80, 0.72, 0.56), rough=0.35)
FLAKE = mat('flake', (1, 1, 1), rough=1.0, emit=(1, 1, 1), strength=1.2)
PINE = mat('pine', (0.10, 0.14, 0.12), rough=1.0, emit=(0.70, 0.76, 0.82), strength=0.25)
EYE = mat('eye', (0.02, 0.015, 0.01), rough=0.15)

# ------------------------------------------------------------------ the meadow: drifts of snow, a far treeline in haze
bpy.ops.mesh.primitive_plane_add(size=160, location=(0, 0, 0))
g = bpy.context.object
sub = g.modifiers.new('sub', 'SUBSURF')
sub.subdivision_type = 'SIMPLE'
sub.levels = sub.render_levels = 6
tex = bpy.data.textures.new('drift', 'CLOUDS')
tex.noise_scale = 6.0
dsp = g.modifiers.new('drift', 'DISPLACE')
dsp.texture = tex
dsp.strength = 0.5
g.data.materials.append(SNOW)
for i in range(140):
    ang = math.radians(-70 + 140 * hz(i, 1))
    dist = 48 + 30 * hz(i, 2)
    h = 6 + 9 * hz(i, 3)
    bpy.ops.mesh.primitive_cone_add(vertices=7, radius1=1.6 + hz(i, 4), depth=h, location=(math.sin(ang) * dist, math.cos(ang) * dist, h / 2 - 0.4))
    bpy.context.object.data.materials.append(PINE)
w = bpy.data.worlds.new('snowsky')
w.use_nodes = True
w.node_tree.nodes['Background'].inputs['Color'].default_value = (0.78, 0.82, 0.88, 1)
w.node_tree.nodes['Background'].inputs['Strength'].default_value = 0.9
sc.world = w
bpy.ops.object.light_add(type='SUN', location=(0, 0, 10))
sun = bpy.context.object
sun.data.energy = 2.2
sun.data.angle = math.radians(20)
sun.rotation_euler = (-Vector((-0.5, -0.6, 0.6)).normalized()).to_track_quat('-Z', 'Y').to_euler()

# ------------------------------------------------------------------ the mammoth (facing -Y, toward the camera)
fur_objs = []


def furred(o, count, length):
    """a hair system on a mesh: shaggy, drooping, clumped (seeded: the same coat every frame)"""
    o.modifiers.new('fur', 'PARTICLE_SYSTEM')
    ps = o.particle_systems[-1]
    ps.seed = 11
    st = ps.settings
    st.type = 'HAIR'
    st.count = count
    st.hair_length = length
    st.emit_from = 'FACE'
    st.use_advanced_hair = False
    st.child_type = 'INTERPOLATED'
    for k, v in (('child_percent', 3), ('child_nbr', 3), ('rendered_child_count', 5), ('child_length', 0.9), ('clump_factor', 0.45), ('clump_shape', 0.3), ('roughness_1', 0.04), ('roughness_endpoint', 0.08), ('root_radius', 1.0), ('tip_radius', 0.1), ('radius_scale', 0.0035), ('hair_step', 5), ('render_step', 4), ('display_step', 3)):
        if hasattr(st, k):
            try:
                setattr(st, k, v)
            except Exception:
                pass
    o.data.materials.append(FUR)
    st.material_slot = 'fur'
    fur_objs.append(o)


def blob(name, loc, scale, m=SKIN, segs=24):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=segs, ring_count=segs // 2, radius=1, location=loc)
    o = bpy.context.object
    o.name = name
    o.scale = scale
    bpy.ops.object.transform_apply(scale=True)
    o.data.materials.append(m)
    return o


root = bpy.data.objects.new('mammoth', None)
sc.collection.objects.link(root)
body = blob('body', (0, 0.15, 2.0), (1.15, 1.75, 1.05))
hump = blob('hump', (0, -0.55, 2.7), (0.85, 0.9, 0.75))
head = blob('head', (0, -1.55, 2.55), (0.72, 0.7, 0.85))
rump = blob('rump', (0, 1.25, 1.95), (0.95, 0.75, 0.9))
for o in (body, hump, head, rump):
    o.parent = root
    furred(o, 5200 if o is body else 2400, 0.26 if o is not head else 0.16)
# the eyes (small, dark, wet), the ears (small, furred) on the head's sides
for sx in (-1, 1):
    e = blob('eye%d' % sx, (sx * 0.52, -2.05, 2.75), (0.06, 0.05, 0.05), EYE, 12)
    e.parent = root
    ear = blob('ear%d' % sx, (sx * 0.66, -1.45, 2.85), (0.12, 0.28, 0.32))
    ear.parent = root
    furred(ear, 200, 0.08)
# the tusks: long ivory curves from the upper jaw, sweeping forward, out and up, their tips turning in
for sx in (-1, 1):
    cu = bpy.data.curves.new('tusk%d' % sx, 'CURVE')
    cu.dimensions = '3D'
    cu.bevel_depth = 0.075
    cu.bevel_resolution = 3
    sp = cu.splines.new('BEZIER')
    sp.bezier_points.add(2)
    pts = [(sx * 0.32, -2.05, 2.05), (sx * 0.78, -2.85, 1.55), (sx * 0.45, -3.35, 2.25)]
    for bp, p in zip(sp.bezier_points, pts):
        bp.co = p
        bp.handle_left_type = bp.handle_right_type = 'AUTO'
    sp.bezier_points[0].radius = 1.0
    sp.bezier_points[1].radius = 0.75
    sp.bezier_points[2].radius = 0.3
    t = bpy.data.objects.new('tusk%d' % sx, cu)
    sc.collection.objects.link(t)
    t.data.materials.append(IVORY)
    t.parent = root
# the trunk: a tapered curve hanging from the face, its tip curling; it sways a little each frame
tcu = bpy.data.curves.new('trunk', 'CURVE')
tcu.dimensions = '3D'
tcu.bevel_depth = 0.2
tcu.bevel_resolution = 4
tsp = tcu.splines.new('BEZIER')
tsp.bezier_points.add(3)
trunk = bpy.data.objects.new('trunk', tcu)
sc.collection.objects.link(trunk)
trunk.data.materials.append(SKIN)
trunk.parent = root
for i, rad in enumerate((1.0, 0.8, 0.55, 0.4)):
    tsp.bezier_points[i].radius = rad


def set_trunk(ph):
    sw = math.sin(ph) * 0.12
    pts = [(0, -2.1, 2.3), (sw * 0.5, -2.45, 1.55), (sw, -2.5, 0.85), (sw * 1.6, -2.75, 0.55)]
    for bp, p in zip(tsp.bezier_points, pts):
        bp.co = p
        bp.handle_left_type = bp.handle_right_type = 'AUTO'


# the legs: thick pillars from hip and shoulder pivots, furred to the knee; the fifth (the tell) between the front pair
legs = []
for name, x, y in (('fl', -0.55, -0.85), ('fr', 0.55, -0.85), ('bl', -0.55, 1.05), ('br', 0.55, 1.05), ('five', 0.0, -0.95)):
    piv = bpy.data.objects.new('piv_' + name, None)
    sc.collection.objects.link(piv)
    piv.parent = root
    piv.location = (x, y, 1.7)
    bpy.context.view_layer.update()
    bpy.ops.mesh.primitive_cylinder_add(vertices=16, radius=0.34, depth=1.7, location=(x, y, 0.85))
    lg = bpy.context.object
    lg.name = 'leg_' + name
    lg.data.materials.append(SKIN)
    lg.parent = piv
    lg.matrix_parent_inverse = piv.matrix_world.inverted()
    furred(lg, 900, 0.2)
    bpy.ops.mesh.primitive_cylinder_add(vertices=16, radius=0.38, depth=0.16, location=(x, y, 0.08))
    foot = bpy.context.object
    foot.data.materials.append(SKIN)
    foot.parent = piv
    foot.matrix_parent_inverse = piv.matrix_world.inverted()
    legs.append((name, piv, lg, foot))
# the tail
tail = blob('tail', (0, 1.95, 2.1), (0.12, 0.35, 0.12))
tail.parent = root
furred(tail, 120, 0.2)

# falling snow: flakes on hashed paths, falling and drifting a little each frame
flakes = []
for i in range(500):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=0.018 + 0.02 * hz(i, 9), location=(0, 0, 0))
    fl = bpy.context.object
    fl.data.materials.append(FLAKE)
    flakes.append((fl, -9 + 18 * hz(i, 10), -6 + 16 * hz(i, 11), 6 * hz(i, 12), 0.6 + 0.6 * hz(i, 13)))

# ------------------------------------------------------------------ the camera: the wall screen's framing (near square), low, 3/4 front
cam_data = bpy.data.cameras.new('cam')
cam_data.lens = 50
cam = bpy.data.objects.new('cam', cam_data)
sc.collection.objects.link(cam)
cam.location = (-4.4, -12.0, 1.25)
cam.rotation_euler = (Vector((0.2, -0.9, 1.75)) - cam.location).to_track_quat('-Z', 'Y').to_euler()
sc.camera = cam

out = os.path.abspath(A['out'])
os.makedirs(os.path.join(out, 'frames'), exist_ok=True)
names = []
for fi in range(NF):
    t = fi / 24.0
    ph = t * 2 * math.pi * 0.85                      # the stride: a slow plod
    root.location = (0.15 * math.sin(ph * 0.5), -0.8 * t, 0.05 * math.sin(ph * 2))
    root.rotation_euler = (0, 0, math.radians(-52 + 2 * math.sin(ph * 0.5)))
    for name, piv, lg, foot in legs:
        off = {'fl': 0.0, 'br': 0.0, 'fr': math.pi, 'bl': math.pi, 'five': math.pi * 0.5}[name]
        piv.rotation_euler = (math.radians(16 * math.sin(ph + off)), 0, 0)
        show = name != 'five' or fi in (39, 40)       # the tell: a fifth leg for two frames, late in the walk
        lg.hide_render = foot.hide_render = not show
    set_trunk(ph * 0.7)
    for fl, x, y, z0, sp in flakes:
        fl.location = (x + 0.3 * math.sin(t * 2 + x), y, (z0 - sp * t) % 6.0)
    bpy.context.view_layer.update()
    nm = 'aros_%04d.png' % (fi + 1)
    names.append('frames/' + nm)
    if ONLY and (fi + 1) not in ONLY:
        continue
    r.filepath = os.path.join(out, 'frames', nm)
    bpy.ops.render.render(write_still=True)
    print('AROS frame', fi + 1, flush=True)
manifest = {
    'version': 1, 'id': 'aros-mammoth-filler', 'native': [W, H], 'fps': 24, 'durationInFrames': NF, 'palette': 'PHOTO',
    'drawings': names, 'timeline': list(range(NF)),
    'source': {'kind': 'programmatic filler (Blender 4.5.3 EEVEE)', 'script': 'studio/src/episodes/ep02/pixel/art/aros/aros_mammoth.py', 'tell': 'a fifth leg on frames 40-41'},
    'params': {'layer': 'near-photoreal, inside the bezel; the step-out is pixelized (tools/genvideo/pixelize.py)'},
}
with open(os.path.join(out, 'clip.json'), 'w') as fh:
    json.dump(manifest, fh, indent=1)
print('AROS done', out, flush=True)
