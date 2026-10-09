# MR. MAS — Ep2 v1 art: SET-23, ISS: THE WHITE CUBE ON AN EMPTY LOT (sc 22), the second Tier 2 leap (2.H, real 3D).
# Blender 4.5.3, headless, EEVEE (the iGPU). Builds the scene from nothing (deterministic: no random module, no clocks)
# and renders the shot list's plates at the room area's size (1920 x 812 = 480 x 203 at x4; the band sits under them,
# as in every other scene). The pixel Mas, the pixel flyer and the pixel Alyi are composited on top afterwards
# (art/tools/iss-comp.ts), keeping the contrast: no grade match, no pixel rim, no down-rez of either side.
#
# What is here (manifest SET-23, §3 the ISS props): a white cube with one door, handleless, sealed by design (no lock,
# no handle, no keyhole); a brass plate engraved ISS beside it; a mail slot with a sprung flap hinged at its top edge
# (it swings in when the flyer pushes it, and shuts on its spring; there is no return mechanism); a warm lit interior
# behind the slot's gap (the 'insert' plate keys the gap green for the pixel room); an empty lot under an overcast sky.
# No doormat, no sign, no lock.
#
# Run (from the repo root, through ops/heavy.sh):
#   ops/heavy.sh ~/Downloads/blender-4.5.3-linux-x64/blender -b --factory-startup \
#     --python studio/src/episodes/ep02/pixel/art/iss/iss_scene.py -- --out out/ep02/v1/art/iss/plates [--shots a,b] \
#     [--w 1920] [--h 812] [--samples 32]
# Shots (sc 22's list): wide (22.01-22.03, the lot) · ots (22.04, over his shoulder at the slot, the flap lifting) ·
# insert (22.05, the gap fills the frame; keyed green) · ecu (22.06, the flap shut) · mcu (22.07, Mas at the shut flap:
# the door face on the right) · knock (22.08, the door and his raised hand) · away (22.09, the lot, a little wider).
import math
import os
import sys
import bpy
from mathutils import Vector


def args():
    a = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
    out = {'out': 'out/ep02/v1/art/iss/plates', 'shots': 'wide,ots,insert,ecu,mcu,knock,away', 'w': '1920', 'h': '812',
           'samples': '32'}
    for i in range(0, len(a) - 1, 2):
        out[a[i].lstrip('-')] = a[i + 1]
    return out


A = args()
W, H, SAMPLES = int(A['w']), int(A['h']), int(A['samples'])

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
r.image_settings.color_depth = '8'
ee = sc.eevee
ee.taa_render_samples = SAMPLES
for k, v in (('use_shadows', True), ('use_gtao', True), ('gtao_distance', 0.4), ('use_raytracing', False),
             ('shadow_ray_count', 2), ('shadow_step_count', 8)):
    if hasattr(ee, k):
        try:
            setattr(ee, k, v)
        except Exception:
            pass
sc.view_settings.view_transform = 'AgX'
try:
    sc.view_settings.look = 'AgX - Punchy'
except TypeError:
    sc.view_settings.look = 'None'
sc.view_settings.exposure = 0.15


# ------------------------------------------------------------------ materials
def mat(name, color, rough=0.5, metal=0.0, emit=None, strength=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    p = m.node_tree.nodes['Principled BSDF']
    p.inputs['Base Color'].default_value = (*color, 1)
    p.inputs['Roughness'].default_value = rough
    p.inputs['Metallic'].default_value = metal
    if emit is not None:
        p.inputs['Emission Color'].default_value = (*emit, 1)
        p.inputs['Emission Strength'].default_value = strength
    return m


def ground_mat():
    """the lot: dusty pale gravel with patches of dry grass, a few tyre-flattened bands (all procedural, fixed seeds)"""
    m = bpy.data.materials.new('lot')
    m.use_nodes = True
    nt = m.node_tree
    p = nt.nodes['Principled BSDF']
    p.inputs['Roughness'].default_value = 0.95
    co = nt.nodes.new('ShaderNodeTexCoord')
    n1 = nt.nodes.new('ShaderNodeTexNoise')
    n1.inputs['Scale'].default_value = 0.12
    n1.inputs['Detail'].default_value = 3.0
    n2 = nt.nodes.new('ShaderNodeTexNoise')
    n2.inputs['Scale'].default_value = 90.0
    n2.inputs['Detail'].default_value = 2.0
    nt.links.new(co.outputs['Object'], n1.inputs['Vector'])
    nt.links.new(co.outputs['Object'], n2.inputs['Vector'])
    ramp = nt.nodes.new('ShaderNodeValToRGB')
    ramp.color_ramp.elements[0].position = 0.42
    ramp.color_ramp.elements[0].color = (0.40, 0.37, 0.30, 1)
    ramp.color_ramp.elements[1].position = 0.62
    ramp.color_ramp.elements[1].color = (0.35, 0.36, 0.26, 1)
    nt.links.new(n1.outputs['Fac'], ramp.inputs['Fac'])
    mix = nt.nodes.new('ShaderNodeMix')
    mix.data_type = 'RGBA'
    mix.blend_type = 'MULTIPLY'
    mix.inputs['Factor'].default_value = 0.55
    nt.links.new(ramp.outputs['Color'], mix.inputs['A'])
    nt.links.new(n2.outputs['Color'], mix.inputs['B'])
    nt.links.new(mix.outputs['Result'], p.inputs['Base Color'])
    bump = nt.nodes.new('ShaderNodeBump')
    bump.inputs['Strength'].default_value = 0.25
    nt.links.new(n2.outputs['Fac'], bump.inputs['Height'])
    nt.links.new(bump.outputs['Normal'], p.inputs['Normal'])
    return m


WHITE = mat('cube_white', (0.86, 0.86, 0.84), rough=0.55)
DOOR = mat('door_white', (0.84, 0.84, 0.82), rough=0.42)
SEAM = mat('seam', (0.08, 0.08, 0.08), rough=0.8)
BRASS = mat('brass', (0.72, 0.46, 0.13), rough=0.24, metal=1.0)
ENGRAVE = mat('engrave', (0.18, 0.12, 0.05), rough=0.6, metal=0.6)
INSIDE = mat('inside', (0.0, 0.0, 0.0), rough=1.0, emit=(1.0, 0.42, 0.12), strength=1.4)
KEY = mat('key', (0.0, 0.0, 0.0), rough=1.0, emit=(0.0, 1.0, 0.0), strength=1.0)


# ------------------------------------------------------------------ geometry
def box(name, size, loc, m, bevel=0.0):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    o = bpy.context.object
    o.name = name
    o.scale = size
    bpy.ops.object.transform_apply(scale=True)
    o.data.materials.append(m)
    if bevel:
        bv = o.modifiers.new('bevel', 'BEVEL')
        bv.width = bevel
        bv.segments = 3
    return o


S = 3.2                      # the cube's side (m)
FY = -S / 2                  # its front face (the door's face), facing -Y (toward the lot's road)
DOOR_X, DOOR_W, DOOR_H = 0.35, 1.0, 2.25
SLOT_Z, SLOT_W, SLOT_H = 1.02, 0.30, 0.042
PLATE = (-0.55, 1.52)        # the brass plate's centre (x, z), left of the door

bpy.ops.mesh.primitive_plane_add(size=400, location=(0, 0, 0))
g = bpy.context.object
g.data.materials.append(ground_mat())

box('cube', (S, S, S), (0, 0, S / 2), WHITE, bevel=0.012)
# far beyond the lot: a ragged line of trees, hazed pale with distance (clusters of faceted blobs of hashed sizes; no
# random module, so every render is the same)
FAR = mat('far_trees', (0.36, 0.40, 0.34), rough=1.0, emit=(0.60, 0.62, 0.60), strength=0.45)   # the haze lifts it
for i in range(150):
    h = ((i * 2654435761) % 1000) / 1000.0
    h2 = ((i * 40503 + 17) % 997) / 997.0
    ang = math.radians(-125 + i * 1.3 + 0.6 * h2)
    dist = 170 + 30 * h
    for k in range(2):
        hk = ((i * 7 + k * 13) % 11) / 11.0
        bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2, radius=1, location=(math.sin(ang) * dist + (k - 0.5) * 3.0, math.cos(ang) * dist + hk * 3, 1.5 + 1.5 * hk))
        tr = bpy.context.object
        tr.scale = (2.6 + 2.0 * hk, 2.6 + 1.5 * h2, 2.2 + 3.0 * h * (0.5 + hk))
        tr.data.materials.append(FAR)
# the door: a slab flush with the face, a hairline seam around it (sealed: no handle, no lock, no keyhole)
box('door', (DOOR_W, 0.02, DOOR_H), (DOOR_X, FY - 0.004, DOOR_H / 2), DOOR, bevel=0.003)
for nm, sz, lc in (('seamL', (0.008, 0.012, DOOR_H), (DOOR_X - DOOR_W / 2 - 0.004, FY - 0.002, DOOR_H / 2)),
                   ('seamR', (0.008, 0.012, DOOR_H), (DOOR_X + DOOR_W / 2 + 0.004, FY - 0.002, DOOR_H / 2)),
                   ('seamT', (DOOR_W + 0.016, 0.012, 0.008), (DOOR_X, FY - 0.002, DOOR_H + 0.004))):
    box(nm, sz, lc, SEAM)
# the mail slot: a brass frame round a dark-warm gap (the lit room behind it), the flap hinged at the gap's top
fz = SLOT_Z
box('slotT', (SLOT_W + 0.06, 0.012, 0.016), (DOOR_X, FY - 0.016, fz + SLOT_H / 2 + 0.008), BRASS, bevel=0.002)
box('slotB', (SLOT_W + 0.06, 0.012, 0.016), (DOOR_X, FY - 0.016, fz - SLOT_H / 2 - 0.008), BRASS, bevel=0.002)
box('slotL', (0.03, 0.012, SLOT_H + 0.032), (DOOR_X - SLOT_W / 2 - 0.015, FY - 0.016, fz), BRASS, bevel=0.002)
box('slotR', (0.03, 0.012, SLOT_H + 0.032), (DOOR_X + SLOT_W / 2 + 0.015, FY - 0.016, fz), BRASS, bevel=0.002)
# the gap itself: a hole through the door slab (a boolean), and behind it the interior's light plane
cut = box('slotcut', (SLOT_W, 0.15, SLOT_H), (DOOR_X, FY - 0.025, fz), SEAM)
for nm in ('door', 'cube'):
    bo = bpy.data.objects[nm].modifiers.new('slot', 'BOOLEAN')
    bo.object = cut
    bo.operation = 'DIFFERENCE'
    try:
        bo.material_mode = 'TRANSFER'   # the cut's own faces take its dark material: the gap reads as a hole
    except Exception:
        pass
cut.hide_render = True
cut.hide_viewport = True
inside = box('inside', (SLOT_W * 2, 0.01, SLOT_H * 7), (DOOR_X, FY + 0.045, fz), INSIDE)  # in the 'insert' plate: the key
# the flap: a brass leaf on a hinge empty at the gap's top edge (rotation about X; + swings it in, bottom edge first)
bpy.ops.object.empty_add(location=(DOOR_X, FY - 0.022, fz + SLOT_H / 2))
hinge = bpy.context.object
hinge.name = 'hinge'
flap = box('flap', (SLOT_W + 0.02, 0.006, SLOT_H + 0.012), (DOOR_X, FY - 0.022, fz), BRASS, bevel=0.002)
flap.parent = hinge
flap.matrix_parent_inverse = hinge.matrix_world.inverted()
# the plate: brass, engraved ISS (the letters cut into it: a dark extruded text a hair proud, so they read at x4)
box('plate', (0.34, 0.012, 0.13), (PLATE[0], FY - 0.006, PLATE[1]), BRASS, bevel=0.003)
bpy.ops.object.text_add(location=(PLATE[0], FY - 0.0125, PLATE[1]))
t = bpy.context.object
t.data.body = 'ISS'
t.data.align_x = 'CENTER'
t.data.align_y = 'CENTER'
t.data.size = 0.085
t.data.extrude = 0.0008
t.rotation_euler = (math.radians(90), 0, 0)
t.data.materials.append(ENGRAVE)

# ------------------------------------------------------------------ light: an overcast day
w = bpy.data.worlds.new('overcast')
w.use_nodes = True
bg = w.node_tree.nodes['Background']
sky = w.node_tree.nodes.new('ShaderNodeTexGradient')
sky.gradient_type = 'LINEAR'
co = w.node_tree.nodes.new('ShaderNodeTexCoord')
sep = w.node_tree.nodes.new('ShaderNodeSeparateXYZ')
w.node_tree.links.new(co.outputs['Generated'], sep.inputs['Vector'])
ramp = w.node_tree.nodes.new('ShaderNodeValToRGB')
ramp.color_ramp.elements[0].position = 0.0
ramp.color_ramp.elements[0].color = (0.93, 0.93, 0.93, 1)
ramp.color_ramp.elements[1].position = 0.45
ramp.color_ramp.elements[1].color = (0.74, 0.76, 0.79, 1)
w.node_tree.links.new(sep.outputs['Z'], ramp.inputs['Fac'])
w.node_tree.links.new(ramp.outputs['Color'], bg.inputs['Color'])
bg.inputs['Strength'].default_value = 0.95
sc.world = w
bpy.ops.object.light_add(type='SUN', location=(0, 0, 10))
sun = bpy.context.object
sun.data.energy = 2.6
sun.data.angle = math.radians(35)       # an overcast sun: a big soft disc, soft-edged shadows
sun.data.color = (1.0, 0.98, 0.95)
sun.rotation_euler = (math.radians(38), math.radians(-24), math.radians(-30))

# ------------------------------------------------------------------ the cameras (one per shot)
SLOT = Vector((DOOR_X, FY, fz))
# Mas's marks (the pixel figure stands on them; their screen points are written to anchors.json for the composite):
# WALK the line he walks in on (y), DOORMARK where he stands at the door, AWAY0/AWAY1 the walk away's ends
WALK_Y = FY - 0.7
DOORMARK = (DOOR_X - 0.55, FY - 0.6)
SHOTS = {
    # name: (location, look-at, lens mm, flap angle in degrees). The room figure (80 px for his 1.75 m) sets the wides'
    # distance: 4.67 m of frame height at his mark; the medium figure (about 147 px a metre) sets the MCU's.
    'wide': ((DOOR_X - 3.2, WALK_Y - 8.6, 1.50), (DOOR_X - 3.2, WALK_Y, 1.30), 28, 0),
    'ots': ((DOOR_X - 0.75, FY - 1.05, 1.45), (DOOR_X + 0.05, FY, fz + 0.05), 30, 55),
    'insert': ((DOOR_X, FY - 0.16, fz - 0.002), (DOOR_X, FY + 1.0, fz - 0.002), 50, 86),
    'ecu': ((DOOR_X - 0.14, FY - 0.78, fz + 0.10), (DOOR_X, FY, fz), 50, 0),
    'mcu': ((DOOR_X + 1.6, FY - 0.6, 1.45), (DOOR_X - 2.2, FY + 0.44, 1.56), 24, 0),
    'knock': ((DOOR_X - 4.0, DOORMARK[1] - 15.0, 1.45), (DOOR_X - 0.9, DOORMARK[1], 1.15), 50, 0),
    'away': ((DOOR_X + 7.5, FY - 2.2, 1.55), (DOOR_X - 10.0, FY - 3.6, 1.20), 28, 0),
}
# named world points whose screen positions (in native 480 x 203 pixels) the composite needs
POINTS = {
    'slot': (DOOR_X, FY, fz), 'doorL0': (DOOR_X - DOOR_W / 2, FY, 0), 'doorR0': (DOOR_X + DOOR_W / 2, FY, 0),
    'doormark': (DOORMARK[0], DOORMARK[1], 0), 'doormarkHead': (DOORMARK[0], DOORMARK[1], 1.75),
    'walk0': (DOOR_X - 9.0, WALK_Y, 0), 'walkMid': (DOOR_X - 4.0, WALK_Y, 0), 'walk0Head': (DOOR_X - 9.0, WALK_Y, 1.75),
    'mcuMas': (DOOR_X - 0.6, FY - 0.55, 1.0), 'mcuMasHead': (DOOR_X - 0.6, FY - 0.55, 1.68),
    'away0': (DOOR_X - 0.9, FY - 0.8, 0), 'away0Head': (DOOR_X - 0.9, FY - 0.8, 1.75),
    'away1': (DOOR_X - 12.0, FY - 2.2, 0), 'away1Head': (DOOR_X - 12.0, FY - 2.2, 1.75),
}
from bpy_extras.object_utils import world_to_camera_view
import json
os.makedirs(A['out'], exist_ok=True)
anchors = {}
_prev = os.path.join(A['out'], 'anchors.json')
if os.path.exists(_prev):
    with open(_prev) as fh:
        anchors = json.load(fh)   # keep the shots not rendered this time
for name in A['shots'].split(','):
    loc, at, lens, flap_deg = SHOTS[name]
    cam_data = bpy.data.cameras.new(name)
    cam_data.lens = lens
    cam_data.clip_start = 0.02
    cam = bpy.data.objects.new(name, cam_data)
    sc.collection.objects.link(cam)
    cam.location = loc
    d = Vector(at) - Vector(loc)
    cam.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()
    sc.camera = cam
    hinge.rotation_euler = (math.radians(flap_deg), 0, 0)
    inside.data.materials[0] = KEY if name == 'insert' else INSIDE
    bpy.context.view_layer.update()
    anchors[name] = {}
    for k, v in POINTS.items():
        q = world_to_camera_view(sc, cam, Vector(v))
        if q.z > 0:
            anchors[name][k] = [round(q.x * 480, 1), round((1 - q.y) * 203, 1)]
    r.filepath = os.path.join(os.path.abspath(A['out']), name + '.png')
    bpy.ops.render.render(write_still=True)
    print('ISS plate', name, '->', r.filepath, flush=True)
with open(os.path.join(A['out'], 'anchors.json'), 'w') as fh:
    json.dump(anchors, fh, indent=1)
print('ISS anchors', json.dumps(anchors), flush=True)
