"""MR. MAS · range E1-P2 (1.H, WHAT THE QUACK): the scene script for ELGOOG's product film (v3, the ep1r-p2r3 pass).

A near-photoreal product shot, built procedurally (no downloaded assets, no model-made anything):
  - a generic yellow rubber duck (no toy brand): one molded vinyl body from metaballs (a round chest and body, an
    upswept tail, a big round head, a flat, wide two-part bill), meshed, trimmed to a flat foot, then VOXEL-REMESHED,
    relaxed and subdivided, so the silhouette has no facets at macro distance. The bill, the eyes, the moulded wing
    relief, the mould's parting line and the bill's smile groove are all SHADER work in object space (paint masks
    and bump), so every paint line stays clean at any resolution and nothing is a texture file.
  - vinyl, not candy: a satin base (roughness ~0.34 with a slow variation), a thin semi-gloss coat with a faint
    orange-peel bump (reflections break the way moulded vinyl breaks them), a little subsurface (thin vinyl glows
    at its edges), glossy painted eyes.
  - a curved seamless sweep (a cyclorama: a flat floor coving up into a wall) in pale warm grey, satin, so the duck
    sits in a soft contact shadow and a faint, blurred reflection; the wall falls off to a mid grey around a soft
    pool of light behind the duck (a classic product gradient, and it keeps the film inside a stop of the room).
  - softbox lighting: a big key camera-left, a strip kicker behind for the rim, an overhead sheet (the contact
    shadow), a weak fill, and a soft spot pool on the sweep. Real falloff only: nothing is painted.
  - one camera move: a slow macro arc from three-quarter to profile with a slight push-in, 100 mm, f/4, focused on
    the near eye, motion blur on. Frames 0..119 of the arc (the prototype's p0..p119).

Run (Blender 4.5.3 LTS; EEVEE Next on the Intel iGPU, Cycles on the CPU):
  BL=/home/jgon/Downloads/blender-4.5.3-linux-x64/blender
  $BL -b --factory-startup --python duck.py -- --mode eevee  --out <dir> --frames 0-119 --res 1056x592
  $BL -b --factory-startup --python duck.py -- --mode cycles --out <dir> --frames 0,119 --res 1280x720 --samples 256
Frames are written as <dir>/f###.png (8-bit sRGB, Khronos PBR Neutral view, Blender's dither on). --blend <path> also saves the scene.
The two Cycles stills at the arc's ends (f000, f119) are the conditioning inputs for the later outside-layer test.
"""
import argparse
import math
import os
import sys

import bpy
import bmesh
from mathutils import Euler, Matrix, Vector
from mathutils.bvhtree import BVHTree

argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
ap = argparse.ArgumentParser()
ap.add_argument('--mode', default='eevee', choices=['eevee', 'cycles'])
ap.add_argument('--out', required=True)
ap.add_argument('--frames', default='0-119')
ap.add_argument('--res', default='1056x592')
ap.add_argument('--samples', type=int, default=0)
ap.add_argument('--blend', default='')
A = ap.parse_args(argv)

ARC_FRAMES = 120            # the arc spans p0..p119 (A's ramp keeps the same move to p119)


def parse_frames(s):
    out = []
    for part in s.split(','):
        if '-' in part:
            a, b = part.split('-')
            out += list(range(int(a), int(b) + 1))
        elif part:
            out.append(int(part))
    return out


def setp(obj, name, val):
    """set a property if this build has it (EEVEE Next renamed several)"""
    try:
        setattr(obj, name, val)
        return True
    except (AttributeError, TypeError):
        return False


# ------------------------------------------------------------------ a clean scene
for ob in list(bpy.data.objects):
    bpy.data.objects.remove(ob, do_unlink=True)
sc = bpy.context.scene
sc.frame_start, sc.frame_end = 0, ARC_FRAMES - 1
sc.render.fps = 24
sc.unit_settings.system = 'METRIC'


# ------------------------------------------------------------------ the duck: one moulded body (metaballs -> mesh)
mb = bpy.data.metaballs.new('duck_mb')
# Blender clamps a metaball's polygonisation step at 5 mm, too coarse for a 10 cm toy seen at macro distance (it
# leaves 4 mm facets that no smoothing hides). So the balls are built 10x up (K) and meshed at 6 mm = 0.6 mm real,
# then the mesh is scaled back down.
K = 10.0
mb.resolution = 0.006
mb.render_resolution = 0.006
mb.threshold = 0.6

SURF = 0.672   # with stiffness 2 and threshold 0.6 a lone element's surface sits at 0.672 of its radius


def el(co, axes, tilt=0.0, stiff=2.0):
    """one ellipsoid given by its SURFACE semi-axes (metres); tilt = rotation about y (radians, + = nose down)"""
    e = mb.elements.new(type='ELLIPSOID')
    e.co = Vector(co) * K
    m = max(axes)
    e.radius = K * m / SURF
    e.size_x, e.size_y, e.size_z = (a / m for a in axes)
    e.stiffness = stiff
    if tilt:
        e.rotation = Euler((0.0, tilt, 0.0)).to_quaternion()
    return e


# x = forward (the bill), z = up; metres. The classic bath-duck proportions: a body about 10 cm long, a head about
# half the body's length across, sitting forward over a full chest, a bill as wide as it is long, a tail that sweeps up.
el((-0.006, 0.0, 0.027), (0.043, 0.038, 0.026))             # the body
el((0.018, 0.0, 0.030), (0.029, 0.035, 0.028))              # the chest (full, round)
el((-0.028, 0.0, 0.035), (0.022, 0.029, 0.019))             # the back, rising to the tail
el((-0.041, 0.0, 0.043), (0.015, 0.016, 0.011), tilt=-0.55)  # the tail: a short upswept point, blended into the back
el((0.018, 0.0, 0.054), (0.019, 0.021, 0.014))              # the neck
el((0.021, 0.0, 0.075), (0.0262, 0.0262, 0.0252))           # the head
el((0.049, 0.0, 0.0702), (0.0150, 0.0168, 0.0056), tilt=0.12, stiff=2.6)  # the bill (upper): flat, broad, round-tipped
el((0.045, 0.0, 0.0657), (0.0112, 0.0132, 0.0042), tilt=0.02, stiff=2.6)  # the bill (lower)
mbo = bpy.data.objects.new('duck_mb', mb)
sc.collection.objects.link(mbo)
dg = bpy.context.evaluated_depsgraph_get()
me = bpy.data.meshes.new_from_object(mbo.evaluated_get(dg))
bpy.data.objects.remove(mbo, do_unlink=True)
me.transform(Matrix.Scale(1.0 / K, 4))
# trim the bottom flat (the toy sits on a small flat foot) and lift it onto the floor
bm = bmesh.new()
bm.from_mesh(me)
zmin = min(v.co.z for v in bm.verts)
cut = zmin + 0.0048
res = bmesh.ops.bisect_plane(bm, geom=bm.verts[:] + bm.edges[:] + bm.faces[:], plane_co=(0, 0, cut), plane_no=(0, 0, 1), clear_inner=True)
edges = [e for e in res['geom_cut'] if isinstance(e, bmesh.types.BMEdge)]
if edges:
    bmesh.ops.holes_fill(bm, edges=edges, sides=0)
for v in bm.verts:
    v.co.z -= cut
bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
bm.to_mesh(me)
bm.free()
duck = bpy.data.objects.new('duck', me)
sc.collection.objects.link(duck)
# voxel remesh (an even, facet-free skin), relax it, subdivide once: a moulded surface at macro distance
rm = duck.modifiers.new('remesh', 'REMESH')
rm.mode = 'VOXEL'
rm.voxel_size = 0.00045
rm.adaptivity = 0.0
rm.use_smooth_shade = True
sm = duck.modifiers.new('relax', 'SMOOTH')
sm.factor = 0.6
sm.iterations = 4
ss = duck.modifiers.new('subd', 'SUBSURF')
ss.levels = 1
ss.render_levels = 1
# apply the stack, so the shader's object space and the eyes' ray-cast agree exactly with what renders
dg = bpy.context.evaluated_depsgraph_get()
me2 = bpy.data.meshes.new_from_object(duck.evaluated_get(dg))
duck.modifiers.clear()
duck.data = me2
for p in me2.polygons:
    p.use_smooth = True
# rotate the whole toy a touch so the arc doesn't start dead square
duck.rotation_euler = (0.0, 0.0, math.radians(-4.0))
bpy.context.view_layer.update()

# the eyes: where a ray from the head's centre meets the surface (object space); on the sides of the head, a little
# forward and above the bill, the way the classic toy has them
bvh = BVHTree.FromObject(duck, bpy.context.evaluated_depsgraph_get())
HEAD_C = Vector((0.021, 0.0, 0.075 - cut))
EYES = []
for sy in (1, -1):
    d = Vector((0.50, 0.70 * sy, 0.47)).normalized()
    hit = bvh.ray_cast(HEAD_C, d)
    EYES.append(hit[0] if hit[0] is not None else HEAD_C + d * 0.026)
BEAK_C = Vector((0.0510, 0.0, 0.0682 - cut))
BEAK_R = Vector((0.0200, 0.0205, 0.0120))
MOUTH_Z = 0.0676 - cut


# ------------------------------------------------------------------ materials
def node_mat(name):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    return m, m.node_tree.nodes, m.node_tree.links


def principled(nodes):
    return next(n for n in nodes if n.type == 'BSDF_PRINCIPLED')


def pin(n, *names):
    for nm in names:
        if nm in n.inputs:
            return n.inputs[nm]
    raise KeyError(names)


mv, N, L = node_mat('vinyl')
bs = principled(N)
tc = N.new('ShaderNodeTexCoord')
sep = N.new('ShaderNodeSeparateXYZ')
L.new(tc.outputs['Object'], sep.inputs[0])
PX, PY, PZ = sep.outputs['X'], sep.outputs['Y'], sep.outputs['Z']


def link_or_set(sock, v):
    if isinstance(v, (int, float)):
        sock.default_value = float(v)
    elif isinstance(v, (tuple, Vector)):
        sock.default_value = tuple(v)
    else:
        L.new(v, sock)


def vmath(op, a=None, b=None):
    n = N.new('ShaderNodeVectorMath')
    n.operation = op
    if a is not None:
        link_or_set(n.inputs[0], a)
    if b is not None:
        link_or_set(n.inputs[1], b)
    return n


def fmath(op, a, b=None, c=None):
    n = N.new('ShaderNodeMath')
    n.operation = op
    link_or_set(n.inputs[0], a)
    if b is not None:
        link_or_set(n.inputs[1], b)
    if c is not None:
        link_or_set(n.inputs[2], c)
    return n.outputs[0]


def ramp01(src, lo, hi, invert=True):
    """smoothstep: 1 below lo -> 0 above hi (invert), or 0 -> 1"""
    n = N.new('ShaderNodeMapRange')
    n.interpolation_type = 'SMOOTHSTEP'
    link_or_set(n.inputs['Value'], src)
    n.inputs['From Min'].default_value = lo
    n.inputs['From Max'].default_value = hi
    n.inputs['To Min'].default_value = 1.0 if invert else 0.0
    n.inputs['To Max'].default_value = 0.0 if invert else 1.0
    return n.outputs['Result']


pos = tc.outputs['Object']
# the bill: an ellipsoid of paint
b1 = vmath('DIVIDE', vmath('SUBTRACT', pos, tuple(BEAK_C)).outputs[0], tuple(BEAK_R))
beak = ramp01(vmath('LENGTH', b1.outputs[0]).outputs['Value'], 0.972, 1.0)
# the eyes: two painted ovals, a little taller than wide
eye_masks = []
for e in EYES:
    q = vmath('DIVIDE', vmath('SUBTRACT', pos, tuple(e)).outputs[0], (0.0043, 0.0043, 0.0056))
    eye_masks.append(ramp01(vmath('LENGTH', q.outputs[0]).outputs['Value'], 0.94, 1.0))
eye = fmath('MAXIMUM', eye_masks[0], eye_masks[1])
# each eye is moulded as a low bead (a smooth dome, 0.9 mm over its 4.3 mm radius): its tighter curvature shrinks a
# softbox's reflection to a small window (a catchlight on black) instead of a grey disc over the whole eye
domes = []
for e in EYES:
    q = vmath('DIVIDE', vmath('SUBTRACT', pos, tuple(e)).outputs[0], (0.0047, 0.0047, 0.0060))
    d2 = fmath('MINIMUM', fmath('POWER', vmath('LENGTH', q.outputs[0]).outputs['Value'], 2.0), 1.0)
    domes.append(fmath('POWER', fmath('SUBTRACT', 1.0, d2), 2.0))
eye_dome = fmath('MULTIPLY', fmath('MAXIMUM', domes[0], domes[1]), 0.0009)

# ---- relief (one height field, metres): the moulded wings, the parting line, the bill's smile groove
# the wings: a raised, soft-edged plateau on each flank, an ellipse in x-z tilted up toward the tail
WX, WZ, WA, WB, WT = -0.012, 0.030 - cut + 0.0048, 0.024, 0.0115, math.radians(-17.0)
dx = fmath('SUBTRACT', PX, WX)
dz = fmath('SUBTRACT', PZ, WZ)
ux = fmath('ADD', fmath('MULTIPLY', dx, math.cos(WT)), fmath('MULTIPLY', dz, -math.sin(WT)))
uz = fmath('ADD', fmath('MULTIPLY', dx, math.sin(WT)), fmath('MULTIPLY', dz, math.cos(WT)))
wd = fmath('SQRT', fmath('ADD', fmath('POWER', fmath('DIVIDE', ux, WA), 2.0), fmath('POWER', fmath('DIVIDE', uz, WB), 2.0)))
wing = fmath('MULTIPLY', ramp01(wd, 0.80, 1.0), ramp01(fmath('ABSOLUTE', PY), 0.016, 0.024, invert=False))
# the wing's feather tips: three shallow scallops along its trailing edge (the plateau's back third steps down)
feath = fmath('MULTIPLY', ramp01(ux, -0.012, -0.020, invert=False),
              fmath('MULTIPLY', 0.45, fmath('ABSOLUTE', fmath('SINE', fmath('MULTIPLY', uz, 1.0 / 0.0042)))))
wing_h = fmath('MULTIPLY', fmath('SUBTRACT', wing, fmath('MULTIPLY', wing, feath)), 0.00075)
# the mould's parting line: a hair-thin ridge on the y = 0 plane, off the bill
seam = fmath('MULTIPLY', fmath('MULTIPLY', ramp01(fmath('ABSOLUTE', PY), 0.00012, 0.00035), fmath('SUBTRACT', 1.0, beak)), 0.00005)
# the bill's smile: a shallow groove where the upper bill meets the lower, curving up at the corners
mz = fmath('ADD', MOUTH_Z, fmath('MULTIPLY', fmath('MULTIPLY', PY, PY), 9.0))
groove = fmath('MULTIPLY', fmath('MULTIPLY', ramp01(fmath('ABSOLUTE', fmath('SUBTRACT', PZ, mz)), 0.00025, 0.0007),
                                 ramp01(PX, BEAK_C.x - 0.004, BEAK_C.x + 0.004, invert=False)), -0.00035)
height = fmath('ADD', fmath('ADD', fmath('ADD', wing_h, seam), groove), eye_dome)
bump = N.new('ShaderNodeBump')
bump.inputs['Strength'].default_value = 1.0
bump.inputs['Distance'].default_value = 1.0
L.new(height, bump.inputs['Height'])
# orange-peel: a very fine, very shallow bump on the coat only
nz = N.new('ShaderNodeTexNoise')
L.new(pos, nz.inputs['Vector'])
nz.inputs['Scale'].default_value = 3000.0
nz.inputs['Detail'].default_value = 2.0
peel = N.new('ShaderNodeBump')
peel.inputs['Strength'].default_value = 0.010
peel.inputs['Distance'].default_value = 0.00015
L.new(nz.outputs['Fac'], peel.inputs['Height'])
L.new(bump.outputs['Normal'], peel.inputs['Normal'])
L.new(bump.outputs['Normal'], pin(bs, 'Normal'))
L.new(peel.outputs['Normal'], pin(bs, 'Coat Normal'))
# a slow roughness drift (a moulded part is never perfectly even)
nr = N.new('ShaderNodeTexNoise')
L.new(pos, nr.inputs['Vector'])
nr.inputs['Scale'].default_value = 60.0
nr.inputs['Detail'].default_value = 3.0


def mixc(fac, c1, c2):
    n = N.new('ShaderNodeMix')
    n.data_type = 'RGBA'
    L.new(fac, n.inputs['Factor'])
    for sock, c in ((n.inputs[6], c1), (n.inputs[7], c2)):
        link_or_set(sock, c)
    return n.outputs[2]


def mixf(fac, a, b):
    n = N.new('ShaderNodeMix')
    n.data_type = 'FLOAT'
    L.new(fac, n.inputs['Factor'])
    for sock, c in ((n.inputs[2], a), (n.inputs[3], b)):
        link_or_set(sock, c)
    return n.outputs[0]


YELLOW = (0.88, 0.50, 0.020, 1.0)     # linear: a warm cadmium yellow, not lemon
ORANGE = (0.80, 0.15, 0.010, 1.0)
EYEC = (0.006, 0.006, 0.008, 1.0)
col = mixc(eye, mixc(beak, YELLOW, ORANGE), EYEC)
L.new(col, pin(bs, 'Base Color'))
rough_v = fmath('ADD', 0.30, fmath('MULTIPLY', nr.outputs['Fac'], 0.09))
L.new(mixf(eye, mixf(beak, rough_v, 0.40), 0.60), pin(bs, 'Roughness'))
# the eyes: matte black paint (almost no base specular) under a clear, glassy coat, so only the lights make a crisp
# catchlight on black and the big dim fill leaves a faint sheen, never a grey disc
L.new(mixf(eye, 0.45, 0.08), pin(bs, 'Specular IOR Level'))
L.new(mixf(eye, 0.24, 0.85), pin(bs, 'Coat Weight'))
L.new(mixf(eye, 0.11, 0.012), pin(bs, 'Coat Roughness'))
pin(bs, 'Coat IOR').default_value = 1.46
# thin vinyl carries light: the shadow side warms toward orange instead of greying to ochre
L.new(mixf(eye, 0.24, 0.0), pin(bs, 'Subsurface Weight'))
pin(bs, 'Subsurface Radius').default_value = (1.0, 0.42, 0.08)
pin(bs, 'Subsurface Scale').default_value = 0.005
duck.data.materials.append(mv)

# the sweep: pale warm grey, satin (a faint, blurred reflection)
msw, N2, L2 = node_mat('sweep')
bs2 = principled(N2)
# a graduated backdrop (the classic product sweep): pale on the desk, darkening up the wall
tc2 = N2.new('ShaderNodeTexCoord')
sz2 = N2.new('ShaderNodeSeparateXYZ')
L2.new(tc2.outputs['Object'], sz2.inputs[0])
gr2 = N2.new('ShaderNodeMapRange')
gr2.interpolation_type = 'SMOOTHSTEP'
L2.new(sz2.outputs['Z'], gr2.inputs['Value'])
# (the 100 mm lens sees the backdrop only up to z ~ 0.10-0.12, so the fall happens across the cove)
gr2.inputs['From Min'].default_value = 0.012
gr2.inputs['From Max'].default_value = 0.15
mx2 = N2.new('ShaderNodeMix')
mx2.data_type = 'RGBA'
L2.new(gr2.outputs['Result'], mx2.inputs['Factor'])
mx2.inputs[6].default_value = (0.50, 0.49, 0.47, 1.0)
mx2.inputs[7].default_value = (0.23, 0.225, 0.218, 1.0)
L2.new(mx2.outputs[2], pin(bs2, 'Base Color'))
pin(bs2, 'Specular IOR Level').default_value = 0.34
nz2 = N2.new('ShaderNodeTexNoise')
nz2.inputs['Scale'].default_value = 140.0
mr2 = N2.new('ShaderNodeMapRange')
mr2.inputs['To Min'].default_value = 0.22
mr2.inputs['To Max'].default_value = 0.29
L2.new(nz2.outputs['Fac'], mr2.inputs['Value'])
L2.new(mr2.outputs['Result'], pin(bs2, 'Roughness'))


# ------------------------------------------------------------------ the sweep (a cove revolved behind the duck)
def cyc(r_floor=0.34, r_cove=0.16, h_wall=0.55, a0=100.0, a1=350.0, seg=96, prof=40):
    bm = bmesh.new()
    prof_pts = []
    for i in range(prof + 1):          # the profile: the floor's edge -> the cove -> up the wall
        t = i / prof
        if t < 0.45:                   # (the flat floor is the disk below; the cove starts where it ends)
            continue
        elif t < 0.8:
            u = (t - 0.45) / 0.35
            a = u * math.pi / 2
            prof_pts.append((r_floor + r_cove * math.sin(a), r_cove * (1 - math.cos(a))))
        else:
            u = (t - 0.8) / 0.2
            prof_pts.append((r_floor + r_cove, r_cove + (h_wall - r_cove) * u))
    rows = []
    for j in range(seg + 1):
        a = math.radians(a0 + (a1 - a0) * j / seg)
        rows.append([bm.verts.new((r * math.cos(a), r * math.sin(a), z)) for r, z in prof_pts])
    for j in range(seg):
        for i in range(len(prof_pts) - 1):
            f = bm.faces.new((rows[j][i], rows[j][i + 1], rows[j + 1][i + 1], rows[j + 1][i]))
            f.smooth = True
    bmesh.ops.remove_doubles(bm, verts=bm.verts[:], dist=1e-6)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
    m = bpy.data.meshes.new('sweep')
    bm.to_mesh(m)
    bm.free()
    o = bpy.data.objects.new('sweep', m)
    sc.collection.objects.link(o)
    o.data.materials.append(msw)
    return o


sweep = cyc()
# the floor: one disk, tangent to the cove's foot (no seam between the floor and the sweep)
bpy.ops.mesh.primitive_circle_add(vertices=192, radius=0.343, fill_type='NGON', location=(0, 0, -0.0002))
floor = bpy.context.active_object
floor.data.materials.append(msw)


# ------------------------------------------------------------------ light (softboxes; physical falloff only)
def aim(o, target):
    d = Vector(target) - o.location
    o.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()


def area(name, loc, target, size, power, shape='RECTANGLE', size_y=None, color=(1.0, 0.97, 0.93)):
    ld = bpy.data.lights.new(name, 'AREA')
    ld.shape = shape
    ld.size = size
    if size_y is not None:
        ld.size_y = size_y
    ld.energy = power
    ld.color = color
    setp(ld, 'use_shadow_jitter', True)
    setp(ld, 'shadow_jitter_overblur', 20.0)
    setp(ld, 'shadow_filter_radius', 3.0)
    o = bpy.data.objects.new(name, ld)
    sc.collection.objects.link(o)
    o.location = Vector(loc)
    aim(o, target)
    return o


T0 = (0.005, 0.0, 0.045)
area('key', (0.25, -0.03, 0.29), T0, 0.30, 6.8, size_y=0.22)                        # big key, front-left-top
area('kicker', (-0.19, -0.17, 0.19), (0.0, 0.0, 0.06), 0.36, 5.2, size_y=0.05, color=(0.95, 0.97, 1.0))   # strip rim
area('top', (0.0, 0.03, 0.36), (0.0, 0.0, 0.0), 0.26, 2.6, size_y=0.20)             # overhead sheet: the contact shadow
area('fill', (-0.08, 0.46, 0.09), T0, 0.62, 1.7, shape='ELLIPSE', size_y=0.40, color=(1.0, 0.96, 0.9))  # the fill: camera side, big and dim (a dim reflection in the eyes)
# the soft pool on the sweep behind the duck: a spot with a wide, fully blended edge (a product gradient)
pd = bpy.data.lights.new('pool', 'SPOT')
pd.energy = 16.0
pd.spot_size = math.radians(40.0)
pd.spot_blend = 1.0
pd.shadow_soft_size = 0.06
pd.color = (1.0, 0.975, 0.95)
pool = bpy.data.objects.new('pool', pd)
sc.collection.objects.link(pool)
pool.location = Vector((0.12, 0.16, 0.30))
aim(pool, (-0.30, -0.42, 0.13))
w = bpy.data.worlds.new('w')
sc.world = w
w.use_nodes = True
w.node_tree.nodes['Background'].inputs['Color'].default_value = (0.012, 0.012, 0.014, 1.0)
w.node_tree.nodes['Background'].inputs['Strength'].default_value = 1.0


# ------------------------------------------------------------------ the camera: one macro arc (three-quarter -> profile)
cam_d = bpy.data.cameras.new('cam')
cam_d.lens = 100.0
cam_d.sensor_width = 36.0
cam_d.dof.use_dof = True
cam_d.dof.aperture_fstop = 4.0
cam_d.dof.aperture_blades = 9
cam_d.clip_start = 0.01
cam = bpy.data.objects.new('cam', cam_d)
sc.collection.objects.link(cam)
sc.camera = cam
focus = bpy.data.objects.new('focus', None)
sc.collection.objects.link(focus)
cam_d.dof.focus_object = focus
eye_w = duck.matrix_world @ EYES[0]


def arc(f):
    t = f / (ARC_FRAMES - 1)
    te = t + 0.06 * math.sin(math.pi * t) * (1 - t)     # a nearly even move, a hair of ease-out
    th = math.radians(34.0 + 52.0 * te)                 # three-quarter front -> profile
    dist = 0.60 - 0.065 * te                            # a slow push
    h = 0.098 + 0.006 * te
    tgt = Vector((0.000, 0.0, 0.041 + 0.002 * te))
    loc = Vector((dist * math.cos(th), dist * math.sin(th), h))
    # compose the duck right of centre (the film's super sits lower left): shift the aim toward screen-left
    fwd = (tgt - loc).normalized()
    left = Vector((0, 0, 1)).cross(fwd).normalized()
    tgt = tgt + left * 0.028
    return loc, tgt


for f in range(ARC_FRAMES):
    loc, tgt = arc(f)
    cam.location = loc
    cam.rotation_euler = (tgt - loc).to_track_quat('-Z', 'Y').to_euler()
    cam.keyframe_insert('location', frame=f)
    cam.keyframe_insert('rotation_euler', frame=f)
    focus.location = eye_w.lerp(Vector(tgt), 0.25)
    focus.keyframe_insert('location', frame=f)
for ob in (cam, focus):
    if ob.animation_data and ob.animation_data.action:
        act = ob.animation_data.action
        fcs = getattr(act, 'fcurves', None)
        if fcs is None:
            try:
                fcs = act.layers[0].strips[0].channelbags[0].fcurves
            except Exception:
                fcs = []
        for fc in fcs:
            for kp in fc.keyframe_points:
                kp.interpolation = 'LINEAR'


# ------------------------------------------------------------------ render settings
rx, ry = (int(v) for v in A.res.split('x'))
R = sc.render
R.resolution_x, R.resolution_y, R.resolution_percentage = rx, ry, 100
R.image_settings.file_format = 'PNG'
R.image_settings.color_mode = 'RGB'
R.image_settings.color_depth = '8'
R.image_settings.compression = 15
R.dither_intensity = 1.0
R.film_transparent = False
R.use_motion_blur = True
R.motion_blur_shutter = 0.5
vs = sc.view_settings
setp(vs, 'view_transform', 'Khronos PBR Neutral') or setp(vs, 'view_transform', 'AgX')   # keeps the vinyl's hue
setp(vs, 'look', 'None')
vs.exposure = -2.1
if A.mode == 'eevee':
    R.engine = 'BLENDER_EEVEE_NEXT'
    E = sc.eevee
    E.taa_render_samples = A.samples or 64
    setp(E, 'use_raytracing', True)
    setp(E, 'ray_tracing_method', 'SCREEN')
    try:
        E.ray_tracing_options.resolution_scale = '1'
        E.ray_tracing_options.trace_max_roughness = 0.6
        E.ray_tracing_options.use_denoise = True
    except Exception:
        pass
    setp(E, 'use_fast_gi', True)
    setp(E, 'fast_gi_method', 'GLOBAL_ILLUMINATION')
    setp(E, 'fast_gi_distance', 0.25)
    setp(E, 'horizon_quality', 1.0)
    setp(E, 'shadow_ray_count', 4)
    setp(E, 'shadow_step_count', 16)
    setp(E, 'shadow_resolution_scale', 1.0)
    setp(E, 'use_shadows', True)
    setp(E, 'motion_blur_steps', 1)
    setp(E, 'use_bokeh_jittered', True)
    setp(E, 'bokeh_overblur', 0.0)
else:
    R.engine = 'CYCLES'
    C = sc.cycles
    C.device = 'CPU'
    C.samples = A.samples or 256
    C.use_denoising = True
    setp(C, 'denoiser', 'OPENIMAGEDENOISE')
    C.max_bounces = 8
    R.use_motion_blur = False          # conditioning stills: sharp
    R.threads_mode = 'AUTO'

os.makedirs(A.out, exist_ok=True)
if A.blend:
    bpy.ops.wm.save_as_mainfile(filepath=os.path.abspath(A.blend))
print('EYES', [tuple(round(c, 4) for c in e) for e in EYES], 'cut', round(cut, 4), 'faces', len(duck.data.polygons), flush=True)
for f in parse_frames(A.frames):
    sc.frame_set(f)
    R.filepath = os.path.join(os.path.abspath(A.out), f'f{f:03d}.png')
    bpy.ops.render.render(write_still=True)
    print('WROTE', R.filepath, flush=True)
