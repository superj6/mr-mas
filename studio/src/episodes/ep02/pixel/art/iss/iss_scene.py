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
import mathutils
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
for k, v in (('use_shadows', True), ('use_gtao', True), ('gtao_distance', 0.9), ('use_raytracing', False),
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
    """the lot: pale gravel (a Voronoi speckle of stones over a dusty base), patches of dry grass, darkened where it meets
    the cube (contact occlusion, from the distance to the cube's footprint), all procedural with fixed seeds"""
    m = bpy.data.materials.new('lot')
    m.use_nodes = True
    nt = m.node_tree
    N, L = nt.nodes, nt.links
    p = N['Principled BSDF']
    p.inputs['Roughness'].default_value = 0.95
    co = N.new('ShaderNodeTexCoord')
    # big patches: gravel vs dry grass
    n1 = N.new('ShaderNodeTexNoise'); n1.inputs['Scale'].default_value = 0.12; n1.inputs['Detail'].default_value = 3.0
    L.new(co.outputs['Object'], n1.inputs['Vector'])
    ramp = N.new('ShaderNodeValToRGB')
    n1.inputs['Scale'].default_value = 0.35
    ramp.color_ramp.elements[0].position = 0.36; ramp.color_ramp.elements[0].color = (0.30, 0.29, 0.24, 1)
    ramp.color_ramp.elements[1].position = 0.66; ramp.color_ramp.elements[1].color = (0.52, 0.49, 0.40, 1)
    L.new(n1.outputs['Fac'], ramp.inputs['Fac'])
    # the stones: a Voronoi cell per stone, each its own grey-beige, dark in the cracks between
    vo = N.new('ShaderNodeTexVoronoi'); vo.inputs['Scale'].default_value = 26.0
    L.new(co.outputs['Object'], vo.inputs['Vector'])
    vo2 = N.new('ShaderNodeTexVoronoi'); vo2.feature = 'DISTANCE_TO_EDGE'; vo2.inputs['Scale'].default_value = 26.0
    L.new(co.outputs['Object'], vo2.inputs['Vector'])
    st = N.new('ShaderNodeValToRGB')
    st.color_ramp.elements[0].position = 0.0; st.color_ramp.elements[0].color = (0.62, 0.60, 0.55, 1)
    st.color_ramp.elements[1].position = 1.0; st.color_ramp.elements[1].color = (0.80, 0.77, 0.70, 1)
    L.new(vo.outputs['Color'], st.inputs['Fac'])
    crack = N.new('ShaderNodeMapRange'); crack.inputs['From Min'].default_value = 0.0; crack.inputs['From Max'].default_value = 0.08
    crack.inputs['To Min'].default_value = 0.55; crack.inputs['To Max'].default_value = 1.0
    L.new(vo2.outputs['Distance'], crack.inputs['Value'])
    m1 = N.new('ShaderNodeMix'); m1.data_type = 'RGBA'; m1.blend_type = 'MULTIPLY'; m1.inputs['Factor'].default_value = 0.85
    L.new(ramp.outputs['Color'], m1.inputs['A']); L.new(st.outputs['Color'], m1.inputs['B'])
    m2 = N.new('ShaderNodeMix'); m2.data_type = 'RGBA'; m2.blend_type = 'MULTIPLY'; m2.inputs['Factor'].default_value = 1.0
    L.new(m1.outputs['Result'], m2.inputs['A'])
    cc = N.new('ShaderNodeCombineColor')
    for k in ('Red', 'Green', 'Blue'):
        L.new(crack.outputs['Result'], cc.inputs[k])
    L.new(cc.outputs['Color'], m2.inputs['B'])
    # contact occlusion: darker within ~0.7 m of the cube's footprint (the cube sits on the lot, it doesn't float)
    sep = N.new('ShaderNodeSeparateXYZ'); L.new(co.outputs['Object'], sep.inputs['Vector'])
    ax = N.new('ShaderNodeMath'); ax.operation = 'ABSOLUTE'; L.new(sep.outputs['X'], ax.inputs[0])
    ay = N.new('ShaderNodeMath'); ay.operation = 'ABSOLUTE'; L.new(sep.outputs['Y'], ay.inputs[0])
    mx = N.new('ShaderNodeMath'); mx.operation = 'MAXIMUM'; L.new(ax.outputs[0], mx.inputs[0]); L.new(ay.outputs[0], mx.inputs[1])
    ao = N.new('ShaderNodeMapRange'); ao.inputs['From Min'].default_value = S / 2; ao.inputs['From Max'].default_value = S / 2 + 0.7
    ao.inputs['To Min'].default_value = 0.35; ao.inputs['To Max'].default_value = 1.0
    L.new(mx.outputs[0], ao.inputs['Value'])
    cao = N.new('ShaderNodeCombineColor')
    for k in ('Red', 'Green', 'Blue'):
        L.new(ao.outputs['Result'], cao.inputs[k])
    m3 = N.new('ShaderNodeMix'); m3.data_type = 'RGBA'; m3.blend_type = 'MULTIPLY'; m3.inputs['Factor'].default_value = 1.0
    L.new(m2.outputs['Result'], m3.inputs['A']); L.new(cao.outputs['Color'], m3.inputs['B'])
    L.new(m3.outputs['Result'], p.inputs['Base Color'])
    bump = N.new('ShaderNodeBump'); bump.inputs['Strength'].default_value = 0.6; bump.inputs['Distance'].default_value = 0.02
    L.new(vo2.outputs['Distance'], bump.inputs['Height'])
    L.new(bump.outputs['Normal'], p.inputs['Normal'])
    return m


S = 3.2                      # the cube's side (m)
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


FY = -S / 2                  # its front face (the door's face), facing -Y (toward the lot's road)
DOOR_X, DOOR_W, DOOR_H = 0.35, 1.0, 2.25
SLOT_Z, SLOT_W, SLOT_H = 1.02, 0.30, 0.042
PLATE = (-0.55, 1.52)        # the brass plate's centre (x, z), left of the door

bpy.ops.mesh.primitive_plane_add(size=400, location=(0, 0, 0))
g = bpy.context.object
g.data.materials.append(ground_mat())

box('cube', (S, S, S), (0, 0, S / 2), WHITE, bevel=0.045)
bpy.data.objects['cube'].modifiers['bevel'].segments = 5
bpy.data.objects['cube'].modifiers['bevel'].harden_normals = True
# far beyond the lot: a treeline in haze: tall narrow poplars and pines (vertical silhouettes) with a few rounder
# trees between them, their sizes hashed (no random module, so every render is the same); the haze lifts them toward
# the sky's grey, the farthest most
def hz(i, k):
    v = math.sin(i * 12.9898 + k * 78.233 + i * k * 0.0173) * 43758.5453
    return v - math.floor(v)
for i in range(260):
    ang = math.radians(-130 + 260 * hz(i, 1))
    dist = 140 + 90 * hz(i, 2)
    haze = (dist - 140) / 90
    tone = 0.16 + 0.10 * haze
    FARi = mat('far_%d' % i, (tone * 0.9, tone * 1.15, tone * 0.85), rough=1.0, emit=(0.62, 0.64, 0.64), strength=0.12 + 0.42 * haze)
    kind = hz(i, 3)
    x, y = math.sin(ang) * dist, math.cos(ang) * dist
    if kind < 0.38:      # a poplar: a tall narrow spindle on a short trunk
        h = 8 + 10 * hz(i, 4)
        bpy.ops.mesh.primitive_uv_sphere_add(segments=10, ring_count=8, radius=1, location=(x, y, 1.2 + h / 2))
        o = bpy.context.object; o.scale = (1.3 + 0.8 * hz(i, 5), 1.3 + 0.8 * hz(i, 5), h / 2)
    elif kind < 0.62:    # a pine: a narrow cone
        h = 7 + 9 * hz(i, 6)
        bpy.ops.mesh.primitive_cone_add(vertices=8, radius1=1.8 + 1.2 * hz(i, 7), depth=h, location=(x, y, 0.6 + h / 2))
        o = bpy.context.object
    else:                # a broad round tree, its crown overlapping the next
        h = 5 + 5 * hz(i, 8)
        bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=3, radius=1, location=(x, y, 1.0 + h / 2))
        o = bpy.context.object; o.scale = (3.4 + 2.0 * hz(i, 9), 3.4 + 2.0 * hz(i, 9), h / 2)
    o.data.materials.append(FARi)
    for poly in o.data.polygons:
        poly.use_smooth = True

# near the camera: the lot's own texture in 3D (the art review: the "procedural gravel" didn't show): loose pebbles,
# dry grass tufts, and two tyre tracks across the lot; built as two meshes with bmesh (fast), hashed positions
import bmesh
PEB = mat('pebble', (0.44, 0.42, 0.38), rough=0.95)
PEB2 = mat('pebble_dark', (0.24, 0.23, 0.21), rough=0.95)
GRASS = mat('grass', (0.46, 0.40, 0.20), rough=0.95)
TRACK = mat('track', (0.20, 0.19, 0.16), rough=1.0)
bm = bmesh.new()
for i in range(7000):
    x = -22 + 36 * hz(i, 11)
    y = FY - 0.15 - 22 * (hz(i, 12) ** 1.15)
    if abs(x) < S / 2 + 0.05 and y > FY - 0.05:
        continue
    if hz(i, 15) > max(0.0, 1.0 - max(0.0, (FY - y) - 9) / 10.0):   # thinning out beyond ~9 m, gone by ~19 m
        continue
    pr = 0.015 + 0.05 * hz(i, 13) ** 2
    m4 = mathutils.Matrix.Translation((x, y, pr * 0.35)) @ mathutils.Matrix.Diagonal((pr * (1 + hz(i, 14)), pr, pr * 0.6, 1))
    bmesh.ops.create_icosphere(bm, subdivisions=1, radius=1.0, matrix=m4)
me = bpy.data.meshes.new('pebbles'); bm.to_mesh(me); bm.free()
po = bpy.data.objects.new('pebbles', me); sc.collection.objects.link(po); me.materials.append(PEB); me.materials.append(PEB2)
for k, poly in enumerate(me.polygons):
    poly.material_index = 1 if hz(k // 80, 77) < 0.35 else 0
bm = bmesh.new()
for i in range(2000):
    x = -24 + 40 * hz(i, 21)
    y = FY - 0.3 - 22 * (hz(i, 22) ** 1.1)
    if abs(x) < S / 2 + 0.3 and y > FY - 0.5:
        continue
    if hz(i, 27) > max(0.0, 1.0 - max(0.0, (FY - y) - 9) / 10.0):
        continue
    if hz(i, 23) < 0.3:
        continue
    for k in range(9):       # a tuft: nine thin blades leaning out from one root
        a = 6.283 * hz(i * 7 + k, 24)
        hgt = 0.08 + 0.18 * hz(i * 7 + k, 25)
        lean = 0.25 + 0.35 * hz(i * 7 + k, 26)
        v0 = bm.verts.new((x - 0.011 * math.sin(a), y + 0.011 * math.cos(a), 0))
        v1 = bm.verts.new((x + 0.011 * math.sin(a), y - 0.011 * math.cos(a), 0))
        v2 = bm.verts.new((x + math.cos(a) * hgt * lean, y + math.sin(a) * hgt * lean, hgt))
        bm.faces.new((v0, v1, v2))
me = bpy.data.meshes.new('grass'); bm.to_mesh(me); bm.free()
go = bpy.data.objects.new('grass', me); sc.collection.objects.link(go); me.materials.append(GRASS)
# two tyre tracks across the lot, curving a little toward the road, flattened darker bands with ragged edges
bm = bmesh.new()
for side in (-0.85, 0.85):
    prev = None
    for k in range(60):
        t = k / 59.0
        x = -22 + 40 * t
        y = FY - 6.5 + 2.6 * math.sin(t * 2.4 + 0.4) + side
        wdt = 0.09 + 0.06 * hz(k, int(side * 10) + 30)
        if hz(k, int(side * 10) + 40) < 0.12:
            prev = None
            continue
        a = bm.verts.new((x, y - wdt, 0.004)); b2 = bm.verts.new((x, y + wdt, 0.004))
        if prev:
            bm.faces.new((prev[0], prev[1], b2, a))
        prev = (a, b2)
me = bpy.data.meshes.new('tracks'); bm.to_mesh(me); bm.free()
to = bpy.data.objects.new('tracks', me); sc.collection.objects.link(to); me.materials.append(TRACK)

# the door: a slab flush with the face, a hairline seam around it (sealed: no handle, no lock, no keyhole)
box('door', (DOOR_W, 0.02, DOOR_H), (DOOR_X, FY - 0.004, DOOR_H / 2), DOOR, bevel=0.003)
for nm, sz, lc in (('seamL', (0.008, 0.012, DOOR_H), (DOOR_X - DOOR_W / 2 - 0.004, FY - 0.002, DOOR_H / 2)),
                   ('seamR', (0.008, 0.012, DOOR_H), (DOOR_X + DOOR_W / 2 + 0.004, FY - 0.002, DOOR_H / 2)),
                   ('seamT', (DOOR_W + 0.016, 0.012, 0.008), (DOOR_X, FY - 0.002, DOOR_H + 0.004))):
    box(nm, sz, lc, SEAM)
# the mail slot: a raised brass bezel round a dark-warm gap (the lit room behind it); the flap inset INSIDE the bezel
# with a dark 2 mm gap all round it (so it reads as a flap, not a plaque), its hinge knuckles along the top edge and a
# rolled pull lip along the bottom
fz = SLOT_Z
BZ = 0.024     # the bezel's border
box('slotT', (SLOT_W + 2 * BZ, 0.016, BZ), (DOOR_X, FY - 0.016, fz + SLOT_H / 2 + BZ / 2), BRASS, bevel=0.004)
box('slotB', (SLOT_W + 2 * BZ, 0.016, BZ), (DOOR_X, FY - 0.016, fz - SLOT_H / 2 - BZ / 2), BRASS, bevel=0.004)
box('slotL', (BZ, 0.016, SLOT_H + 2 * BZ), (DOOR_X - SLOT_W / 2 - BZ / 2, FY - 0.016, fz), BRASS, bevel=0.004)
box('slotR', (BZ, 0.016, SLOT_H + 2 * BZ), (DOOR_X + SLOT_W / 2 + BZ / 2, FY - 0.016, fz), BRASS, bevel=0.004)
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
# the flap: a brass leaf on a hinge empty at the gap's top edge (rotation about X; + swings it in, bottom edge first),
# 2 mm smaller than the opening on every side, set back a little inside the bezel
bpy.ops.object.empty_add(location=(DOOR_X, FY - 0.012, fz + SLOT_H / 2))
hinge = bpy.context.object
hinge.name = 'hinge'
flap = box('flap', (SLOT_W - 0.004, 0.005, SLOT_H - 0.004), (DOOR_X, FY - 0.012, fz), BRASS, bevel=0.0015)
flap.parent = hinge
flap.matrix_parent_inverse = hinge.matrix_world.inverted()
# its pull lip (a rolled edge along the bottom, on the flap) and the hinge's knuckles (on the bezel's top, fixed)
bpy.ops.mesh.primitive_cylinder_add(vertices=12, radius=0.0045, depth=SLOT_W - 0.03, location=(DOOR_X, FY - 0.017, fz - SLOT_H / 2 + 0.005), rotation=(0, math.radians(90), 0))
lip = bpy.context.object
lip.data.materials.append(BRASS)
lip.parent = hinge
lip.matrix_parent_inverse = hinge.matrix_world.inverted()
for kx in (-0.11, 0.0, 0.11):
    bpy.ops.mesh.primitive_cylinder_add(vertices=12, radius=0.006, depth=0.034, location=(DOOR_X + kx, FY - 0.022, fz + SLOT_H / 2 + 0.002), rotation=(0, math.radians(90), 0))
    bpy.context.object.data.materials.append(BRASS)
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
sc.world = w
bg.inputs['Strength'].default_value = 0.7
bpy.ops.object.light_add(type='SUN', location=(0, 0, 10))
sun = bpy.context.object
sun.data.energy = 3.6
sun.data.angle = math.radians(14)       # overcast, but a direction: the door's face lit, the side face a step down
sun.data.color = (1.0, 0.98, 0.95)
to_light = Vector((0.45, -0.9, 0.75)).normalized()
sun.rotation_euler = (-to_light).to_track_quat('-Z', 'Y').to_euler()
# a cool fill from the left (the sky's bounce), weak, so the shadowed face keeps detail without matching the lit one
bpy.ops.object.light_add(type='SUN', location=(0, 0, 10))
fill_l = bpy.context.object
fill_l.data.energy = 0.55
fill_l.data.angle = math.radians(60)
fill_l.data.color = (0.86, 0.9, 1.0)
fill_l.rotation_euler = (-Vector((-1.0, -0.25, 0.4)).normalized()).to_track_quat('-Z', 'Y').to_euler()

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
