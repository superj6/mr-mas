# MR. MAS: CLOD look-dev, the shared studio (render settings, the sweep, the one soft key, the camera).
# Used by turnaround.py, nod_clip.py and pane_insert.py. Blender 4.5.3, headless.
import math
import sys
import json
import time
import bpy
from mathutils import Vector
import numpy as np

import clod_rig as R


def args(defaults):
    """--key value pairs after Blender's '--'"""
    a = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
    out = dict(defaults)
    for i in range(0, len(a) - 1, 2):
        k = a[i].lstrip('-')
        v = a[i + 1]
        t = type(defaults.get(k, ''))
        out[k] = t(v) if t in (int, float) else v
    return out


def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    sc.unit_settings.system = 'METRIC'
    return sc


def engine_id(name):
    if name.upper().startswith('EEVEE'):
        for e in ('BLENDER_EEVEE_NEXT', 'BLENDER_EEVEE'):
            try:
                bpy.context.scene.render.engine = e
                return e
            except TypeError:
                continue
    bpy.context.scene.render.engine = 'CYCLES'
    return 'CYCLES'


def render_settings(sc, engine='EEVEE', w=1920, h=1080, samples=64, threads=10, view='AgX', look='None', exposure=0.0,
                    transparent=False):
    eid = engine_id(engine)
    r = sc.render
    r.resolution_x, r.resolution_y, r.resolution_percentage = w, h, 100
    r.fps = 24
    r.film_transparent = transparent
    r.image_settings.file_format = 'PNG'
    r.image_settings.color_mode = 'RGBA' if transparent else 'RGB'
    r.image_settings.color_depth = '8'
    r.threads_mode = 'FIXED'
    r.threads = threads
    if eid == 'CYCLES':
        cy = sc.cycles
        cy.device = 'CPU'
        cy.samples = samples
        cy.use_adaptive_sampling = True
        cy.adaptive_threshold = 0.02
        cy.use_denoising = True
        cy.denoiser = 'OPENIMAGEDENOISE'
        cy.max_bounces, cy.diffuse_bounces, cy.glossy_bounces, cy.transmission_bounces = 6, 3, 2, 2
        cy.caustics_reflective = cy.caustics_refractive = False
        cy.blur_glossy = 1.0
        cy.seed = 11
    else:
        ee = sc.eevee
        ee.taa_render_samples = samples
        for k, v in (('use_raytracing', True), ('use_shadows', True), ('shadow_ray_count', 2), ('shadow_step_count', 8),
                     ('use_gtao', True), ('gtao_distance', 0.08), ('fast_gi_distance', 0.12), ('use_fast_gi', True)):
            if hasattr(ee, k):
                try:
                    setattr(ee, k, v)
                except Exception:
                    pass
        if hasattr(ee, 'ray_tracing_options'):
            ee.ray_tracing_options.resolution_scale = '1'
            ee.ray_tracing_options.use_denoise = True
    vs = sc.view_settings
    vs.view_transform = view
    try:
        vs.look = look
    except TypeError:
        vs.look = 'None'
    vs.exposure = exposure
    sc.display_settings.display_device = 'sRGB'
    return eid


def world(sc, color=(0.5, 0.5, 0.5), strength=0.12):
    w = bpy.data.worlds.new('clod_world')
    w.use_nodes = True
    bg = w.node_tree.nodes['Background']
    bg.inputs['Color'].default_value = tuple(color) + (1,)
    bg.inputs['Strength'].default_value = strength
    sc.world = w
    return w


def sweep(name='sweep', width=3.0, depth=1.2, height=1.2, radius=0.45, y0=-0.9, hexcol='#9A9893', texture=False):
    """a seamless paper sweep: a floor running back into a curve and up into a wall (a puppet stage's cyclorama)"""
    prof = []
    ny = 30
    for i in range(ny + 1):
        prof.append((y0 + (depth - radius) * i / ny, 0.0))
    for i in range(1, 25):
        a = (i / 24) * math.pi / 2
        prof.append((y0 + depth - radius + radius * math.sin(a), radius - radius * math.cos(a)))
    for i in range(1, 12):
        prof.append((y0 + depth, radius + (height - radius) * i / 11))
    xs = np.linspace(-width / 2, width / 2, 40)
    V, Q = [], []
    for x in xs:
        for (y, z) in prof:
            V.append((x, y, z))
    n = len(prof)
    for i in range(len(xs) - 1):
        for j in range(n - 1):
            a = i * n + j
            Q.append([a, a + 1, a + n + 1, a + n])
    ob = R.make_mesh(name, np.array(V), np.array(Q))
    m = bpy.data.materials.new(name + '_mat')
    m.use_nodes = True
    bs = m.node_tree.nodes['Principled BSDF']
    bs.inputs['Base Color'].default_value = R.lin(hexcol)
    bs.inputs['Roughness'].default_value = 0.92
    bs.inputs['Specular IOR Level'].default_value = 0.2
    if texture:
        # a painted board's faint mottle, so the miniature depth of field has something to soften
        nt = m.node_tree
        tc = nt.nodes.new('ShaderNodeTexCoord')
        nz = nt.nodes.new('ShaderNodeTexNoise')
        nz.inputs['Scale'].default_value = 90.0
        nz.inputs['Detail'].default_value = 6.0
        nt.links.new(tc.outputs['Object'], nz.inputs['Vector'])
        rp = nt.nodes.new('ShaderNodeValToRGB')
        base = R.lin(hexcol)
        rp.color_ramp.elements[0].color = tuple(c * 0.9 for c in base[:3]) + (1,)
        rp.color_ramp.elements[1].color = tuple(min(1, c * 1.08) for c in base[:3]) + (1,)
        rp.color_ramp.elements[0].position, rp.color_ramp.elements[1].position = 0.35, 0.65
        nt.links.new(nz.outputs['Fac'], rp.inputs['Fac'])
        nt.links.new(rp.outputs['Color'], bs.inputs['Base Color'])
    ob.data.materials.append(m)
    bpy.context.scene.collection.objects.link(ob)
    return ob


def key_light(loc, target, power=90.0, size=0.55, color=(1.0, 0.93, 0.84), shape='DISK', name='key'):
    ld = bpy.data.lights.new(name, 'AREA')
    ld.shape = shape
    ld.size = size
    ld.energy = power
    ld.color = color
    if hasattr(ld, 'use_soft_falloff'):
        ld.use_soft_falloff = True
    ob = bpy.data.objects.new(name, ld)
    bpy.context.scene.collection.objects.link(ob)
    ob.location = Vector(loc)
    aim(ob, target)
    return ob


def aim(ob, target):
    d = Vector(target) - ob.location
    ob.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()


def camera(loc, target, lens=85.0, fstop=4.0, focus=None, sensor=36.0, name='cam'):
    cd = bpy.data.cameras.new(name)
    cd.lens = lens
    cd.sensor_width = sensor
    cd.sensor_fit = 'HORIZONTAL'
    cd.clip_start, cd.clip_end = 0.02, 50
    ob = bpy.data.objects.new(name, cd)
    bpy.context.scene.collection.objects.link(ob)
    ob.location = Vector(loc)
    aim(ob, target)
    if fstop:
        cd.dof.use_dof = True
        cd.dof.aperture_fstop = fstop
        cd.dof.aperture_blades = 7
        cd.dof.focus_distance = focus if focus else (Vector(target) - Vector(loc)).length
    bpy.context.scene.camera = ob
    return ob


def instance(coll, loc=(0, 0, 0), rot_z=0.0, name='inst'):
    e = bpy.data.objects.new(name, None)
    e.instance_type = 'COLLECTION'
    e.instance_collection = coll
    e.location = Vector(loc)
    e.rotation_euler = (0, 0, math.radians(rot_z))
    bpy.context.scene.collection.objects.link(e)
    return e


def exclude(coll):
    lc = bpy.context.view_layer.layer_collection.children[coll.name]
    lc.exclude = True


class Timer:
    def __init__(self):
        self.t0 = time.time()
        self.marks = {}

    def mark(self, k):
        self.marks[k] = round(time.time() - self.t0, 2)
        print(f'[clod] {k}: {self.marks[k]} s', flush=True)
        return self.marks[k]


def write_log(path, data):
    with open(path, 'w') as f:
        json.dump(data, f, indent=1)
