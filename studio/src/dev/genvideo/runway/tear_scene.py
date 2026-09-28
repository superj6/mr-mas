# MR. MAS: Ep1 Act One 7.02, the tear on the red-hot GPU (style leap 9A, choice 9A of PLAN §8): the Blender scene
# that renders OUR first keyframe for the video model. Objects only: a graphics card's heatsink seen close, its fins
# glowing red-hot, a bead of water just landed on their edges, the shroud in the foreground with INVIDIA (the show's
# parody chip maker: plain raised letters in brushed metal, our own type, no mark of any real company). No person, no
# hand, nothing to read but the one word we set here.
#
# Run (from the repo root, through the heavy guard):
#   bash ops/heavy.sh ~/Downloads/blender-4.5.3-linux-x64/blender -b --factory-startup \
#       --python studio/src/dev/genvideo/runway/tear_scene.py -- --out <png> [--samples 128] [--w 1280 --h 720] [--bead 1]
# Deterministic: no random module; every variation is hashed from indices.
import math
import sys

import bpy
from mathutils import Vector

argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
opt = {'out': '/tmp/tear.png', 'samples': '128', 'w': '1280', 'h': '720', 'bead': '1'}
for i in range(0, len(argv) - 1, 2):
    opt[argv[i].lstrip('-')] = argv[i + 1]
OUT, SAMPLES, W, H, BEAD = opt['out'], int(opt['samples']), int(opt['w']), int(opt['h']), opt['bead'] == '1'
FONT = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
MM = 0.001


def h01(i, j, s=0):
    x = math.sin(i * 127.1 + j * 311.7 + s * 74.7) * 43758.5453
    return x - math.floor(x)


bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene


def mat(name):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    return m, m.node_tree.nodes, m.node_tree.links


# ------------------------------------------------------------------ materials
# the fins: dark aluminium whose glow is a blackbody by height (hotter at the base, in the middle of the block)
fin_m, N, Lk = mat('fin')
bsdf = N['Principled BSDF']
bsdf.inputs['Base Color'].default_value = (0.08, 0.075, 0.07, 1)
bsdf.inputs['Metallic'].default_value = 1.0
bsdf.inputs['Roughness'].default_value = 0.32
geo = N.new('ShaderNodeNewGeometry')
sep = N.new('ShaderNodeSeparateXYZ'); Lk.new(geo.outputs['Position'], sep.inputs[0])
# temperature: 1020 K at the base (z 3 mm) falling to ~790 K at the fin tips (z 13 mm), a little cooler at the ends
mapz = N.new('ShaderNodeMapRange'); mapz.inputs['From Min'].default_value = 3 * MM; mapz.inputs['From Max'].default_value = 13 * MM
mapz.inputs['To Min'].default_value = 1020; mapz.inputs['To Max'].default_value = 790
Lk.new(sep.outputs['Z'], mapz.inputs['Value'])
absx = N.new('ShaderNodeMath'); absx.operation = 'ABSOLUTE'; Lk.new(sep.outputs['X'], absx.inputs[0])
cool = N.new('ShaderNodeMapRange'); cool.inputs['From Min'].default_value = 0.0; cool.inputs['From Max'].default_value = 40 * MM
cool.inputs['To Min'].default_value = 0; cool.inputs['To Max'].default_value = -140
Lk.new(absx.outputs[0], cool.inputs['Value'])
tsum = N.new('ShaderNodeMath'); tsum.operation = 'ADD'; Lk.new(mapz.outputs[0], tsum.inputs[0]); Lk.new(cool.outputs[0], tsum.inputs[1])
bb = N.new('ShaderNodeBlackbody'); Lk.new(tsum.outputs[0], bb.inputs['Temperature'])
# strength also falls with height (the tips barely glow): 1.1 at the base to 0.07 at the tips, times a slow hot-spot noise
stre = N.new('ShaderNodeMapRange'); stre.inputs['From Min'].default_value = 3 * MM; stre.inputs['From Max'].default_value = 13 * MM
stre.inputs['To Min'].default_value = 1.1; stre.inputs['To Max'].default_value = 0.07
Lk.new(sep.outputs['Z'], stre.inputs['Value'])
Lk.new(bb.outputs['Color'], bsdf.inputs['Emission Color'])
hot = N.new('ShaderNodeTexNoise'); hot.inputs['Scale'].default_value = 28.0; hot.inputs['Detail'].default_value = 2.0
hmap = N.new('ShaderNodeMapRange'); hmap.inputs['To Min'].default_value = 0.55; hmap.inputs['To Max'].default_value = 1.35
Lk.new(hot.outputs['Fac'], hmap.inputs['Value'])
mul = N.new('ShaderNodeMath'); mul.operation = 'MULTIPLY'; Lk.new(stre.outputs[0], mul.inputs[0]); Lk.new(hmap.outputs[0], mul.inputs[1])
Lk.new(mul.outputs[0], bsdf.inputs['Emission Strength'])

# copper heat pipes, glowing a touch cooler
pipe_m, N2, L2 = mat('pipe')
b2 = N2['Principled BSDF']
b2.inputs['Base Color'].default_value = (0.55, 0.22, 0.12, 1); b2.inputs['Metallic'].default_value = 1.0; b2.inputs['Roughness'].default_value = 0.28
bb2 = N2.new('ShaderNodeBlackbody'); bb2.inputs['Temperature'].default_value = 900
L2.new(bb2.outputs['Color'], b2.inputs['Emission Color']); b2.inputs['Emission Strength'].default_value = 0.45

# the base plate (nickel-plated copper, hot)
base_m, N3, L3 = mat('base')
b3 = N3['Principled BSDF']
b3.inputs['Base Color'].default_value = (0.3, 0.28, 0.26, 1); b3.inputs['Metallic'].default_value = 1.0; b3.inputs['Roughness'].default_value = 0.4
bb3 = N3.new('ShaderNodeBlackbody'); bb3.inputs['Temperature'].default_value = 1150
L3.new(bb3.outputs['Color'], b3.inputs['Emission Color']); b3.inputs['Emission Strength'].default_value = 0.7

# the shroud: satin black, a faint grain
sh_m, N4, L4 = mat('shroud')
b4 = N4['Principled BSDF']
b4.inputs['Base Color'].default_value = (0.012, 0.012, 0.014, 1); b4.inputs['Roughness'].default_value = 0.42
b4.inputs['Metallic'].default_value = 0.2
nz = N4.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = 900.0
bump = N4.new('ShaderNodeBump'); bump.inputs['Strength'].default_value = 0.05
L4.new(nz.outputs['Fac'], bump.inputs['Height']); L4.new(bump.outputs['Normal'], b4.inputs['Normal'])

# the letters: brushed aluminium (anisotropic streaks along x)
lt_m, N5, L5 = mat('letters')
b5 = N5['Principled BSDF']
b5.inputs['Base Color'].default_value = (0.78, 0.78, 0.8, 1); b5.inputs['Metallic'].default_value = 1.0; b5.inputs['Roughness'].default_value = 0.22
if 'Anisotropic' in b5.inputs:
    b5.inputs['Anisotropic'].default_value = 0.8
wave = N5.new('ShaderNodeTexNoise'); wave.inputs['Scale'].default_value = 60.0
mapn = N5.new('ShaderNodeMapping'); mapn.inputs['Scale'].default_value = (0.05, 40.0, 1.0)
tc = N5.new('ShaderNodeTexCoord'); L5.new(tc.outputs['Object'], mapn.inputs['Vector']); L5.new(mapn.outputs['Vector'], wave.inputs['Vector'])
bump5 = N5.new('ShaderNodeBump'); bump5.inputs['Strength'].default_value = 0.08
L5.new(wave.outputs['Fac'], bump5.inputs['Height']); L5.new(bump5.outputs['Normal'], b5.inputs['Normal'])

# water
wt_m, N6, L6 = mat('water')
b6 = N6['Principled BSDF']
b6.inputs['Base Color'].default_value = (1, 1, 1, 1); b6.inputs['Roughness'].default_value = 0.01
b6.inputs['IOR'].default_value = 1.333
b6.inputs['Transmission Weight'].default_value = 1.0

# the floor far below and behind (dark concrete)
fl_m, N7, L7 = mat('floor')
b7 = N7['Principled BSDF']
b7.inputs['Base Color'].default_value = (0.02, 0.02, 0.022, 1); b7.inputs['Roughness'].default_value = 0.9


def box(name, x0, x1, y0, y1, z0, z1, m, bevel=0.0):
    bpy.ops.mesh.primitive_cube_add(size=1, location=((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2))
    o = bpy.context.object
    o.name = name
    o.scale = (x1 - x0, y1 - y0, z1 - z0)
    bpy.ops.object.transform_apply(scale=True)
    if bevel > 0:
        md = o.modifiers.new('bev', 'BEVEL'); md.width = bevel; md.segments = 2
    o.data.materials.append(m)
    return o


# ------------------------------------------------------------------ the heatsink (mm units via MM)
NF, PITCH, FT = 34, 2.2, 0.55
x_first = -(NF - 1) * PITCH / 2
for i in range(NF):
    x = (x_first + i * PITCH) * MM
    top = 13.0 + (0.25 if i % 2 else 0) + h01(i, 1) * 0.15
    box(f'fin{i}', x - FT / 2 * MM, x + FT / 2 * MM, -22 * MM, 22 * MM, 3 * MM, top * MM, fin_m, bevel=0.1 * MM)
box('base', -40 * MM, 40 * MM, -24 * MM, 24 * MM, 0, 3 * MM, base_m, bevel=0.4 * MM)
for yp in (-11, 0, 11):
    bpy.ops.mesh.primitive_cylinder_add(radius=2.6 * MM, depth=74 * MM, location=(0, yp * MM, 7.0 * MM), rotation=(0, math.pi / 2, 0), vertices=32)
    p = bpy.context.object; p.data.materials.append(pipe_m)
    bpy.ops.object.shade_smooth()

# the shroud in the foreground, its top face carrying the letters
box('shroud', -48 * MM, 48 * MM, -46 * MM, -24 * MM, 0, 15 * MM, sh_m, bevel=1.2 * MM)
box('shroud_far', -48 * MM, 48 * MM, 24 * MM, 34 * MM, 0, 15 * MM, sh_m, bevel=1.2 * MM)
fnt = bpy.data.fonts.load(FONT)
cu = bpy.data.curves.new('INVIDIA', 'FONT')
cu.body = 'INVIDIA'
cu.font = fnt
cu.size = 7.5 * MM
cu.extrude = 0.35 * MM
cu.bevel_depth = 0.12 * MM
cu.align_x = 'CENTER'
cu.align_y = 'CENTER'
cu.space_character = 1.12
txt = bpy.data.objects.new('INVIDIA', cu)
sc.collection.objects.link(txt)
txt.location = (2 * MM, -35 * MM, 15.0 * MM + 0.35 * MM)
txt.data.materials.append(lt_m)

# the floor (the basement, far below the card's edges)
box('floor', -400 * MM, 400 * MM, -400 * MM, 400 * MM, -30 * MM, -28 * MM, fl_m)

# the bead: a drop just landed on the fin edges, flattened, left of centre
if BEAD:
    bpy.ops.mesh.primitive_uv_sphere_add(radius=2.8 * MM, location=(-7.5 * MM, 1.5 * MM, 13.2 * MM + 1.9 * MM), segments=48, ring_count=24)
    d = bpy.context.object
    d.scale = (1.08, 1.0, 0.72)
    bpy.ops.object.shade_smooth()
    d.data.materials.append(wt_m)

# ------------------------------------------------------------------ light and camera
world = bpy.data.worlds.new('w'); sc.world = world
world.use_nodes = True
world.node_tree.nodes['Background'].inputs['Color'].default_value = (0.0015, 0.002, 0.003, 1)
# the shaft's cool light far above (the bullpen's night through the hole): a soft area light, low
bpy.ops.object.light_add(type='AREA', location=(-10 * MM, -30 * MM, 260 * MM))
al = bpy.context.object; al.data.energy = 0.9; al.data.size = 0.12; al.data.color = (0.55, 0.8, 1.0)
# a rim kick from behind for the letters' edges and the bead's highlight
bpy.ops.object.light_add(type='AREA', location=(40 * MM, 140 * MM, 90 * MM))
rk = bpy.context.object; rk.data.energy = 0.35; rk.data.size = 0.08; rk.data.color = (1.0, 0.75, 0.55)
rk.rotation_euler = (math.radians(-60), 0, math.radians(15))
al.rotation_euler = (0, 0, 0)

cam_d = bpy.data.cameras.new('cam')
cam_d.lens = 70
cam_d.sensor_width = 36
cam_d.dof.use_dof = True
cam_d.dof.aperture_fstop = 11
cam = bpy.data.objects.new('cam', cam_d)
sc.collection.objects.link(cam)
cam.location = (-4 * MM, -132 * MM, 138 * MM)
target = Vector((0 * MM, -12 * MM, 10 * MM))
dirv = target - cam.location
cam.rotation_euler = dirv.to_track_quat('-Z', 'Y').to_euler()
cam_d.dof.focus_distance = (Vector((-4 * MM, -14 * MM, 14 * MM)) - cam.location).length
sc.camera = cam

# ------------------------------------------------------------------ render
sc.render.engine = 'CYCLES'
sc.cycles.device = 'CPU'
sc.cycles.samples = SAMPLES
sc.cycles.use_denoising = True
sc.cycles.max_bounces = 8
sc.cycles.transmission_bounces = 8
sc.render.resolution_x, sc.render.resolution_y = W, H
sc.render.resolution_percentage = 100
sc.render.threads_mode = 'FIXED'
sc.render.threads = 8
sc.view_settings.view_transform = 'AgX'
sc.view_settings.look = 'AgX - Medium High Contrast'
sc.render.image_settings.file_format = 'PNG'
sc.render.filepath = OUT
bpy.ops.render.render(write_still=True)
print('wrote', OUT)
