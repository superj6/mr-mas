# MR. MAS: CLOD as a clay puppet in Blender 4.5 (look-development test, 2026-09-28).
# The design (show/characters/products-as-characters.md, CLOD): a rounded terracotta clay golem, Misanthropic #B8573A,
# with visible thumbprints, a small bow tie and a clipboard; a tiny potter's wheel spins in its chest (its thinking).
# Enormous, gentle, conscientious; nothing on it is sharp. No logos of any kind.
# The look (show/bible/style-range.md, "Claymation"): 12 fps on 2s, the surface boils on 2s while the texture holds,
# fingerprints and tool drag, miniature depth of field, one soft key, volume-preserving squash.
#
# How the puppet is built (all deterministic: hashed noise, no clocks, no random module):
# - The body is one bean of clay (its head is its top, as in the pixel drawing shared/pixel/cast/clod.ts), a quad
#   sphere mapped onto a lathe profile. The pixel drawing's proportions at 5 mm per native pixel: 0.28 m tall.
# - Thumbprints and the wheel's niche are real geometry (dents with a pushed-up rim). The fine ridges of each print
#   and the loop tool's drag marks are shading (a bump from per-vertex coordinates baked here), so they are pinned
#   to the clay: they never swim.
# - The boil is four replacement surfaces (shape keys of low-frequency lumps). A render picks one per 2-frame step,
#   in a hashed order with no repeats, so the surface shifts and the prints stay.
# - Everything deforms with one three-bone armature (root, body, head) through height-based weights shared by every
#   part, so the bow tie, eyes and clipboard ride the clay the way pressed-on pieces would.
# - Mouths and eyes are replacement pieces (dark clay), switched per step, never morphed.
# Usage (inside Blender): import clod_rig; rig = clod_rig.build(); rig.pose(t) ... see nod_clip.py / turnaround.py.
import math
import bpy
import bmesh
import numpy as np
from mathutils import Vector, Matrix
from mathutils.kdtree import KDTree

H = 0.28                      # puppet height (m); 1 native pixel of the pixel drawing = 5 mm
SY = 0.86                     # front-to-back depth of the body relative to its width
CLAY_HEX = '#B8573A'          # Misanthropic terracotta
# the lathe profile (r, z), top to bottom centre: a gumdrop, belly low and wide, a tucked foot
PROFILE = [(0.0, 0.280), (0.024, 0.2775), (0.044, 0.2705), (0.059, 0.2585), (0.0695, 0.2415), (0.0755, 0.2205),
           (0.0785, 0.1975), (0.0800, 0.170), (0.0815, 0.135), (0.0828, 0.100), (0.0830, 0.070), (0.0812, 0.044),
           (0.0770, 0.022), (0.0708, 0.008), (0.0630, 0.0015), (0.045, 0.0), (0.022, 0.0), (0.0, 0.0)]


# ------------------------------------------------------------------------------------------------ small utilities
def lin(hexstr):
    """sRGB hex -> linear RGBA"""
    h = hexstr.lstrip('#')
    c = [int(h[i:i + 2], 16) / 255.0 for i in (0, 2, 4)]
    return tuple(((x / 12.92) if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4) for x in c) + (1.0,)


def smoothstep(a, b, x):
    t = np.clip((x - a) / (b - a), 0.0, 1.0)
    return t * t * (3 - 2 * t)


def _hash(ix, iy, iz, seed):
    h = (ix * 73856093) ^ (iy * 19349663) ^ (iz * 83492791) ^ (seed * 2654435761 & 0xffffffff)
    h = h & 0xffffffff
    h = ((h ^ (h >> 13)) * 1274126177) & 0xffffffff
    h = h ^ (h >> 16)
    return (h & 0xffffff) / float(0x1000000)


def vnoise(P, seed):
    """smooth value noise in [-1, 1] at points P (N, 3); deterministic"""
    Pf = np.floor(P)
    f = P - Pf
    i = Pf.astype(np.int64)
    u = f * f * (3 - 2 * f)
    n = np.zeros(len(P))
    for dx in (0, 1):
        wx = u[:, 0] if dx else 1 - u[:, 0]
        for dy in (0, 1):
            wy = u[:, 1] if dy else 1 - u[:, 1]
            for dz in (0, 1):
                wz = u[:, 2] if dz else 1 - u[:, 2]
                n += wx * wy * wz * _hash(i[:, 0] + dx, i[:, 1] + dy, i[:, 2] + dz, seed)
    return n * 2 - 1


def fbm(P, seed, octaves=3):
    s, a, tot = np.zeros(len(P)), 1.0, 0.0
    for k in range(octaves):
        s += a * vnoise(P * (2 ** k) + 17.31 * k, seed * 7 + k)
        tot += a
        a *= 0.5
    return s / tot


def hashf(*xs):
    """one deterministic float in [0, 1) from integers"""
    h = 2166136261
    for x in xs:
        h = ((h ^ (int(x) & 0xffffffff)) * 16777619) & 0xffffffff
    h ^= h >> 15
    h = (h * 2246822519) & 0xffffffff
    h ^= h >> 13
    return (h & 0xffffff) / float(0x1000000)


# ------------------------------------------------------------------------------------------------ the body's shape
def _catmull(pts, n):
    P = np.array(pts, float)
    P = np.vstack([P[0] * 2 - P[1], P, P[-1] * 2 - P[-2]])
    out = []
    for i in range(1, len(P) - 2):
        p0, p1, p2, p3 = P[i - 1], P[i], P[i + 1], P[i + 2]
        for t in np.linspace(0, 1, n, endpoint=False):
            t2, t3 = t * t, t * t * t
            out.append(0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3))
    out.append(P[-2])
    return np.array(out)


_PROF = _catmull(PROFILE, 60)
_seg = np.linalg.norm(np.diff(_PROF, axis=0), axis=1)
_ARC = np.concatenate([[0], np.cumsum(_seg)]) / np.sum(_seg)
# the outer side as r(z) (top down to the foot's edge), for placing things on the surface
_side = _PROF[: int(np.argmax(_PROF[:, 1] < 0.0016)) + 1]
_SIDE_Z = _side[::-1, 1]
_SIDE_R = _side[::-1, 0]


def radius_at(z):
    return float(np.interp(z, _SIDE_Z, _SIDE_R))


def surf(phi_deg, z, out=0.0):
    """a point on the (undisplaced) body at azimuth phi (0 = +X, -90 = the front, -Y) and height z, and its normal"""
    ph = math.radians(phi_deg)
    r = radius_at(z)
    p = Vector((r * math.cos(ph), SY * r * math.sin(ph), z))
    e = 0.0015
    ra, rb = radius_at(z - e), radius_at(z + e)
    # normal of the elliptic lathe: gradient of x^2/r^2 + y^2/(SY r)^2
    nx, ny = p.x / (r * r + 1e-12), p.y / (SY * SY * r * r + 1e-12)
    dr = (rb - ra) / (2 * e)
    nz = -(p.x * p.x / (r ** 3 + 1e-12) + p.y * p.y / (SY * SY * r ** 3 + 1e-12)) * dr
    n = Vector((nx, ny, nz)).normalized()
    return p + n * out, n


def front_point(x, z, out=0.0):
    """the body's front surface (y < 0) at horizontal offset x and height z, with its normal"""
    r = radius_at(z)
    x = max(-r * 0.999, min(r * 0.999, x))
    phi = math.degrees(math.atan2(-SY * math.sqrt(max(r * r - x * x, 0.0)) / SY, x))
    return surf(phi, z, out)


def quad_sphere(n):
    a = np.tan(np.linspace(-1, 1, n + 1) * np.pi / 4)
    U, V = np.meshgrid(a, a, indexing='ij')
    pts, quads, base = [], [], 0
    for axis in range(3):
        for sign in (-1.0, 1.0):
            P = np.zeros(((n + 1) * (n + 1), 3))
            P[:, axis] = sign
            P[:, (axis + 1) % 3] = U.ravel()
            P[:, (axis + 2) % 3] = V.ravel()
            pts.append(P)
            idx = np.arange((n + 1) * (n + 1)).reshape(n + 1, n + 1) + base
            q = np.stack([idx[:-1, :-1], idx[1:, :-1], idx[1:, 1:], idx[:-1, 1:]], axis=-1).reshape(-1, 4)
            if sign < 0:
                q = q[:, ::-1]
            quads.append(q)
            base += (n + 1) * (n + 1)
    P = np.vstack(pts)
    P /= np.linalg.norm(P, axis=1)[:, None]
    key = np.round(P * 1e6).astype(np.int64)
    _, first, inv = np.unique(key, axis=0, return_index=True, return_inverse=True)
    Q = inv.ravel()[np.vstack(quads)]
    return P[first], Q


def make_mesh(name, verts, faces, smooth=True):
    me = bpy.data.meshes.new(name)
    verts = np.asarray(verts, np.float32)
    faces = np.asarray(faces, np.int32)
    nf, k = faces.shape
    me.vertices.add(len(verts))
    me.vertices.foreach_set('co', verts.ravel())
    me.loops.add(nf * k)
    me.loops.foreach_set('vertex_index', faces.ravel())
    me.polygons.add(nf)
    me.polygons.foreach_set('loop_start', np.arange(0, nf * k, k, dtype=np.int32))
    me.update(calc_edges=True)
    me.validate()
    bm = bmesh.new()
    bm.from_mesh(me)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(me)
    bm.free()
    if smooth:
        me.shade_smooth()
    ob = bpy.data.objects.new(name, me)
    return ob


def vertex_normals(me):
    nrm = np.zeros(len(me.vertices) * 3, np.float32)
    me.vertex_normals.foreach_get('vector', nrm)
    return nrm.reshape(-1, 3).astype(np.float64)


def set_attr(me, name, arr):
    arr = np.asarray(arr, np.float32)
    if arr.ndim == 1:
        a = me.attributes.new(name, 'FLOAT', 'POINT')
        a.data.foreach_set('value', arr)
    else:
        a = me.attributes.new(name, 'FLOAT_VECTOR', 'POINT')
        a.data.foreach_set('vector', arr.ravel())


# ------------------------------------------------------------------------------------------------ surface marks
class Print:
    """a thumbprint pressed into the clay: centre, normal, an in-plane angle, radii and depth"""
    def __init__(self, c, n, ang, rx=0.0095, ry=0.0072, depth=0.0010, push=(1.0, 0.0)):
        self.c, self.n = np.array(c), np.array(n) / np.linalg.norm(n)
        up = np.array([0, 0, 1.0]) if abs(self.n[2]) < 0.9 else np.array([1.0, 0, 0])
        a = np.cross(up, self.n)
        a /= np.linalg.norm(a)
        b = np.cross(self.n, a)
        ca, sa = math.cos(math.radians(ang)), math.sin(math.radians(ang))
        self.a, self.b = ca * a + sa * b, -sa * a + ca * b
        self.rx, self.ry, self.depth, self.push = rx, ry, depth, push


class Drag:
    """a patch of loop-tool drag: parallel grooves along a direction, pinned in the clay"""
    def __init__(self, c, n, ang, length=0.028, width=0.012, pitch=0.0011):
        self.c, self.n = np.array(c), np.array(n) / np.linalg.norm(n)
        up = np.array([0, 0, 1.0]) if abs(self.n[2]) < 0.9 else np.array([1.0, 0, 0])
        a = np.cross(up, self.n)
        a /= np.linalg.norm(a)
        b = np.cross(self.n, a)
        ca, sa = math.cos(math.radians(ang)), math.sin(math.radians(ang))
        self.a, self.b = ca * a + sa * b, -sa * a + ca * b
        self.length, self.width, self.pitch = length, width, pitch


def apply_marks(V, N, prints, drags, niche=None):
    """displacement (along N) for thumbprint dents and the niche; per-vertex print and drag coordinates for shading"""
    disp = np.zeros(len(V))
    fp = np.zeros((len(V), 3))
    best = np.full(len(V), 9.0)
    for p in prints:
        d = V - p.c
        x, y, h = d @ p.a, d @ p.b, d @ p.n
        rho = np.sqrt((x / p.rx) ** 2 + (y / p.ry) ** 2)
        near = (np.abs(h) < 0.012) & (rho < 1.8) & (N @ p.n > 0.2)
        dent = -p.depth * np.clip(1 - rho ** 2, 0, None) ** 2
        # the clay the thumb pushed aside: a soft rim, higher on the side it was pushed toward
        side = 1.0 + 0.7 * (p.push[0] * x / p.rx + p.push[1] * y / p.ry) / np.maximum(rho, 1e-6)
        rim = 0.28 * p.depth * np.exp(-((rho - 1.12) / 0.2) ** 2) * np.clip(side, 0.2, 1.8)
        disp += np.where(near, dent + rim, 0.0)
        take = near & (rho < best)
        best = np.where(take, rho, best)
        m = np.clip((1.08 - rho) / 0.18, 0, 1)
        fp[take] = np.stack([x / p.rx, y / p.ry, m], axis=1)[take]
    dr = np.zeros((len(V), 3))
    for g in drags:
        d = V - g.c
        x, y, h = d @ g.a, d @ g.b, d @ g.n
        m = np.clip(1 - (x / (g.length / 2)) ** 2 - (y / (g.width / 2)) ** 4, 0, 1)
        m = np.where((np.abs(h) < 0.01) & (N @ g.n > 0.3), np.sqrt(m), 0.0)
        take = m > dr[:, 2]
        dr[take] = np.stack([y / g.pitch, x / (g.length / 2), m], axis=1)[take]
        disp -= 0.00012 * m          # the tool planes the patch a little
    nm = np.zeros(len(V))
    if niche is not None:
        c, n, R, depth = niche
        d = V - c
        h = d @ n
        rr = np.linalg.norm(d - np.outer(h, n), axis=1) / R
        near = (np.abs(h) < 0.02) & (N @ n > 0.3)
        disp += np.where(near, -depth * np.clip(1 - rr ** 2, 0, None) ** 0.75 + 0.0009 * np.exp(-((rr - 1.1) / 0.14) ** 2), 0.0)
        nm = np.where(near, np.clip((1.02 - rr) / 0.12, 0, 1), 0.0)
    return disp, fp, dr, nm


def add_boil(ob, V, N, seed0, amp=0.00045, face_mask=None):
    """four replacement surfaces: shape keys of low-frequency lumps (the prints are in the basis, so they stay)"""
    ob.shape_key_add(name='Basis', from_mix=False)
    for k in range(4):
        s = seed0 * 31 + k * 101
        d = amp * fbm(V * 55.0 + k * 3.7, s, 3) + 0.35 * amp * vnoise(V * 170.0 + k * 1.3, s + 5)
        if face_mask is not None:
            d *= 1 - 0.6 * face_mask
        sk = ob.shape_key_add(name=f'boil{k}', from_mix=False)
        co = (V + N * d[:, None]).astype(np.float32)
        sk.data.foreach_set('co', co.ravel())
        sk.value = 0.0


# ------------------------------------------------------------------------------------------------ tubes (arms)
def tube(path, radii, ring=48, cap=10):
    """a closed tube along a Catmull-Rom path with a radius profile and rounded caps: verts, quads, axis param"""
    P = _catmull(path, 24)
    R = np.interp(np.linspace(0, 1, len(P)), np.linspace(0, 1, len(radii)), radii)
    T = np.gradient(P, axis=0)
    T /= np.linalg.norm(T, axis=1)[:, None]
    # parallel-transport frames
    ref = np.array([0, 0, 1.0]) if abs(T[0][2]) < 0.9 else np.array([1.0, 0, 0])
    Nf = np.cross(T[0], ref)
    Nf /= np.linalg.norm(Nf)
    frames = []
    for t in T:
        Nf = Nf - t * (Nf @ t)
        Nf /= np.linalg.norm(Nf)
        frames.append((Nf.copy(), np.cross(t, Nf)))
    ang = np.linspace(0, 2 * np.pi, ring, endpoint=False)
    rings, param = [], []
    # start cap
    for i in range(cap, 0, -1):
        a = (i / cap) * np.pi / 2
        c = P[0] - T[0] * R[0] * math.sin(a)
        rr = R[0] * math.cos(a)
        n1, n2 = frames[0]
        rings.append(c + rr * (np.outer(np.cos(ang), n1) + np.outer(np.sin(ang), n2)))
        param.append(-0.001 * i)
    for k in range(len(P)):
        n1, n2 = frames[k]
        rings.append(P[k] + R[k] * (np.outer(np.cos(ang), n1) + np.outer(np.sin(ang), n2)))
        param.append(k / (len(P) - 1))
    for i in range(1, cap + 1):
        a = (i / cap) * np.pi / 2
        c = P[-1] + T[-1] * R[-1] * math.sin(a)
        rr = R[-1] * math.cos(a) + 1e-5
        n1, n2 = frames[-1]
        rings.append(c + rr * (np.outer(np.cos(ang), n1) + np.outer(np.sin(ang), n2)))
        param.append(1 + 0.001 * i)
    V = np.vstack(rings)
    nr = len(rings)
    idx = np.arange(nr * ring).reshape(nr, ring)
    Q = np.stack([idx[:-1, :], idx[1:, :], np.roll(idx[1:, :], -1, axis=1), np.roll(idx[:-1, :], -1, axis=1)], axis=-1).reshape(-1, 4)
    # close the two ends with fans (triangles as degenerate quads are avoided: use tris)
    c0 = len(V)
    V = np.vstack([V, (P[0] - T[0] * R[0])[None], (P[-1] + T[-1] * R[-1])[None]])
    tris = [[c0, idx[0, (j + 1) % ring], idx[0, j]] for j in range(ring)]
    tris += [[c0 + 1, idx[-1, j], idx[-1, (j + 1) % ring]] for j in range(ring)]
    return V, Q, np.array(tris), np.array(param + [-0.1, 1.1])


def make_mixed_mesh(name, V, quads, tris):
    me = bpy.data.meshes.new(name)
    bm = bmesh.new()
    vs = [bm.verts.new(v) for v in V]
    for q in quads:
        try:
            bm.faces.new([vs[i] for i in q])
        except ValueError:
            pass
    for t in tris:
        try:
            bm.faces.new([vs[i] for i in t])
        except ValueError:
            pass
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=2e-6)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(me)
    bm.free()
    me.shade_smooth()
    return bpy.data.objects.new(name, me)


# ------------------------------------------------------------------------------------------------ materials
def _clay_material(name, hexcol, rough=0.52, sss=0.18, mottle=0.07, ridge_bump=True, niche_dark=False, wet=False):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    for n in list(nt.nodes):
        nt.nodes.remove(n)
    L = nt.links
    out = nt.nodes.new('ShaderNodeOutputMaterial')
    bs = nt.nodes.new('ShaderNodeBsdfPrincipled')
    L.new(bs.outputs['BSDF'], out.inputs['Surface'])
    # texture space: each vertex's rest position (an attribute), so grain and mottle stay put while it bends and boils
    tc = nt.nodes.new('ShaderNodeAttribute')
    tc.attribute_name = 'rest'
    # colour: the clay's own mottle (hand-mixed plasticine is never one flat colour)
    nz = nt.nodes.new('ShaderNodeTexNoise')
    nz.inputs['Scale'].default_value = 38.0
    nz.inputs['Detail'].default_value = 4.0
    L.new(tc.outputs['Vector'], nz.inputs['Vector'])
    ramp = nt.nodes.new('ShaderNodeValToRGB')
    base = lin(hexcol)
    lo = tuple(c * (1 - mottle) for c in base[:3]) + (1,)
    hi = tuple(min(1, c * (1 + mottle)) for c in base[:3]) + (1,)
    ramp.color_ramp.elements[0].position, ramp.color_ramp.elements[0].color = 0.3, lo
    ramp.color_ramp.elements[1].position, ramp.color_ramp.elements[1].color = 0.7, hi
    L.new(nz.outputs['Fac'], ramp.inputs['Fac'])
    col = ramp.outputs['Color']
    if niche_dark:
        at = nt.nodes.new('ShaderNodeAttribute')
        at.attribute_name = 'niche'
        mix = nt.nodes.new('ShaderNodeMix')
        mix.data_type = 'RGBA'
        mix.blend_type = 'MULTIPLY'
        L.new(at.outputs['Fac'], mix.inputs['Factor'])
        L.new(col, mix.inputs[6])
        mix.inputs[7].default_value = (0.86, 0.80, 0.78, 1)
        col = mix.outputs[2]
    L.new(col, bs.inputs['Base Color'])
    bs.inputs['Roughness'].default_value = rough
    bs.inputs['Specular IOR Level'].default_value = 0.32 if not wet else 0.8
    bs.inputs['Subsurface Weight'].default_value = sss
    bs.inputs['Subsurface Radius'].default_value = (1.0, 0.42, 0.25)
    bs.inputs['Subsurface Scale'].default_value = 0.0035
    if wet:
        bs.inputs['Roughness'].default_value = 0.16
    # bump: fine grain everywhere + the print ridges + the tool drag (pinned per-vertex coordinates)
    grain = nt.nodes.new('ShaderNodeTexNoise')
    grain.inputs['Scale'].default_value = 520.0
    grain.inputs['Detail'].default_value = 2.0
    L.new(tc.outputs['Vector'], grain.inputs['Vector'])
    h = nt.nodes.new('ShaderNodeMath')
    h.operation = 'MULTIPLY'
    L.new(grain.outputs['Fac'], h.inputs[0])
    h.inputs[1].default_value = 0.35
    height = h.outputs[0]
    if ridge_bump:
        # fingerprint ridges: loops round a warped centre, faded at the print's edge
        fpa = nt.nodes.new('ShaderNodeAttribute')
        fpa.attribute_name = 'fp'
        sep = nt.nodes.new('ShaderNodeSeparateXYZ')
        L.new(fpa.outputs['Vector'], sep.inputs[0])
        cmb = nt.nodes.new('ShaderNodeCombineXYZ')
        L.new(sep.outputs['X'], cmb.inputs['X'])
        yy = nt.nodes.new('ShaderNodeMath')
        yy.operation = 'MULTIPLY'
        L.new(sep.outputs['Y'], yy.inputs[0])
        yy.inputs[1].default_value = 1.25
        yo = nt.nodes.new('ShaderNodeMath')
        yo.operation = 'ADD'
        L.new(yy.outputs[0], yo.inputs[0])
        yo.inputs[1].default_value = 0.18
        L.new(yo.outputs[0], cmb.inputs['Y'])
        ln = nt.nodes.new('ShaderNodeVectorMath')
        ln.operation = 'LENGTH'
        L.new(cmb.outputs[0], ln.inputs[0])
        wn = nt.nodes.new('ShaderNodeTexNoise')
        wn.inputs['Scale'].default_value = 3.0
        L.new(fpa.outputs['Vector'], wn.inputs['Vector'])
        wm = nt.nodes.new('ShaderNodeMath')
        wm.operation = 'MULTIPLY_ADD'
        L.new(wn.outputs['Fac'], wm.inputs[0])
        wm.inputs[1].default_value = 0.12
        L.new(ln.outputs['Value'], wm.inputs[2])
        rid = nt.nodes.new('ShaderNodeMath')
        rid.operation = 'SINE'
        rs = nt.nodes.new('ShaderNodeMath')
        rs.operation = 'MULTIPLY'
        L.new(wm.outputs[0], rs.inputs[0])
        rs.inputs[1].default_value = 2 * math.pi * 7.5
        L.new(rs.outputs[0], rid.inputs[0])
        rm = nt.nodes.new('ShaderNodeMath')
        rm.operation = 'MULTIPLY'
        L.new(rid.outputs[0], rm.inputs[0])
        L.new(sep.outputs['Z'], rm.inputs[1])
        ra = nt.nodes.new('ShaderNodeMath')
        ra.operation = 'MULTIPLY_ADD'
        L.new(rm.outputs[0], ra.inputs[0])
        ra.inputs[1].default_value = 0.9
        L.new(height, ra.inputs[2])
        height = ra.outputs[0]
        # tool drag: grooves across the stroke, fading at its ends
        dra = nt.nodes.new('ShaderNodeAttribute')
        dra.attribute_name = 'drag'
        ds = nt.nodes.new('ShaderNodeSeparateXYZ')
        L.new(dra.outputs['Vector'], ds.inputs[0])
        dph = nt.nodes.new('ShaderNodeMath')
        dph.operation = 'MULTIPLY'
        L.new(ds.outputs['X'], dph.inputs[0])
        dph.inputs[1].default_value = 2 * math.pi
        dsn = nt.nodes.new('ShaderNodeMath')
        dsn.operation = 'SINE'
        L.new(dph.outputs[0], dsn.inputs[0])
        dmask = nt.nodes.new('ShaderNodeMath')
        dmask.operation = 'MULTIPLY'
        L.new(dsn.outputs[0], dmask.inputs[0])
        L.new(ds.outputs['Z'], dmask.inputs[1])
        da = nt.nodes.new('ShaderNodeMath')
        da.operation = 'MULTIPLY_ADD'
        L.new(dmask.outputs[0], da.inputs[0])
        da.inputs[1].default_value = 0.45
        L.new(height, da.inputs[2])
        height = da.outputs[0]
    bump = nt.nodes.new('ShaderNodeBump')
    bump.inputs['Strength'].default_value = 1.0
    bump.inputs['Distance'].default_value = 0.00028
    L.new(height, bump.inputs['Height'])
    L.new(bump.outputs['Normal'], bs.inputs['Normal'])
    return m


def _plain_material(name, hexcol, rough=0.6, metal=0.0, spec=0.5, image=None):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    bs = nt.nodes['Principled BSDF']
    bs.inputs['Base Color'].default_value = lin(hexcol)
    bs.inputs['Roughness'].default_value = rough
    bs.inputs['Metallic'].default_value = metal
    bs.inputs['Specular IOR Level'].default_value = spec
    if image is not None:
        tx = nt.nodes.new('ShaderNodeTexImage')
        tx.image = image
        nt.links.new(tx.outputs['Color'], bs.inputs['Base Color'])
    return m


def paper_image():
    """the clipboard's sheet: cream paper, a heading rule and pencil lines. No text, no marks of any kind."""
    W, Hh = 256, 320
    img = np.ones((Hh, W, 4), np.float32)
    img[..., 0], img[..., 1], img[..., 2] = 0.93, 0.89, 0.80
    yy, xx = np.mgrid[0:Hh, 0:W]
    grain = (np.sin(xx * 0.9 + yy * 0.37) * 0.5 + 0.5) * 0.012
    img[..., :3] -= grain[..., None]

    def line(y, x0, x1, w, dark):
        wob = 1.2 * np.sin(xx * 0.05 + y)
        m = (np.abs(yy - y - wob) < w) & (xx >= x0) & (xx <= x1)
        img[m, :3] = img[m, :3] * (1 - dark) + np.array([0.18, 0.17, 0.2]) * dark
    line(46, 34, 190, 4.0, 0.9)
    for i, (x1, dk) in enumerate([(222, 0.7), (205, 0.7), (214, 0.7), (150, 0.7), (218, 0.7), (196, 0.7), (120, 0.7)]):
        line(92 + i * 30, 34, x1, 2.2, dk)
    im = bpy.data.images.new('clod_paper', W, Hh, alpha=True)
    im.pixels.foreach_set(img[::-1].ravel())
    im.pack()
    return im


# ------------------------------------------------------------------------------------------------ the rig
BONES = [('root', (0, 0, 0.0), (0, 0, 0.04), None), ('body', (0, 0, 0.04), (0, 0, 0.14), 'root'),
         ('head', (0, 0, 0.14), (0, 0, 0.28), 'body')]


def height_weights(z):
    z = np.asarray(z, float)
    wh = smoothstep(0.125, 0.215, z)
    wb = np.clip(smoothstep(0.012, 0.075, z) - wh, 0, 1)
    wr = np.clip(1 - wh - wb, 0, 1)
    return {'root': wr, 'body': wb, 'head': wh}


class Clod:
    def __init__(self):
        self.objects = {}
        self.boiled = []
        self.mouths = {}
        self.eyes = {}
        self.wheel = []
        self.arm = None
        self.coll = None


def _link(coll, ob):
    coll.objects.link(ob)
    return ob


def _skin(ob, arm, V=None, anchor_z=None):
    """vertex groups from height (shared by every part) and an armature modifier"""
    me = ob.data
    if V is None:
        V = np.array([v.co[:] for v in me.vertices])
    if anchor_z is not None:
        W = height_weights(np.full(len(V), anchor_z))
    else:
        W = height_weights(V[:, 2])
    for bname in ('root', 'body', 'head'):
        vg = ob.vertex_groups.new(name=bname)
        w = W[bname]
        # group by weight value for speed
        for val in np.unique(np.round(w, 3)):
            if val <= 0:
                continue
            ids = np.nonzero(np.round(w, 3) == val)[0].tolist()
            vg.add(ids, float(val), 'REPLACE')
    md = ob.modifiers.new('arm', 'ARMATURE')
    md.object = arm
    md.use_deform_preserve_volume = False


def _ellipsoid(name, center, axes, R=None, seg=32, rings=16):
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=seg, v_segments=rings, radius=1.0)
    for v in bm.verts:
        v.co = Vector((v.co.x * axes[0], v.co.y * axes[1], v.co.z * axes[2]))
    if R is not None:
        for v in bm.verts:
            v.co = R @ v.co
    for v in bm.verts:
        v.co += Vector(center)
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    me.shade_smooth()
    return bpy.data.objects.new(name, me)


def _frame_at(x, z, out=0.0):
    """a local frame on the front surface: origin, tangent u (+x), tangent v (up), normal n"""
    p, n = front_point(x, z, out)
    u = Vector((1, 0, 0))
    u = (u - n * u.dot(n)).normalized()
    v = n.cross(u).normalized()
    if v.z < 0:
        v = -v
    return p, u, v, n


def _conform(local_pts, x0, z0, embed=0.0):
    """wrap local (u, v, h) points round the front surface near (x0, z0)"""
    out = []
    for (u, v, h) in local_pts:
        p, n = front_point(x0 + u, z0 + v)
        out.append(p + n * (h - embed))
    return np.array(out)


def _hd(qy, t):
    """height of a pressed-on piece: a dome out of the surface, its edge flush, its back buried"""
    return (qy if qy > 0 else 0.5 * qy) * t


def _conformed_blob(name, x0, z0, shape_fn, seg=40, rings=18, embed=0.0008):
    """a piece of clay pressed onto the front: shape_fn(unit sphere point) -> local (u, v, h)"""
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=seg, v_segments=rings, radius=1.0)
    loc = [shape_fn(v.co) for v in bm.verts]
    W = _conform(loc, x0, z0, embed)
    for v, w in zip(bm.verts, W):
        v.co = Vector(w)
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    me.shade_smooth()
    return bpy.data.objects.new(name, me)


def _arc_tube(name, x0, z0, pts2d, r, embed=0.0012, ring=16):
    """a thin roll of clay laid along a 2D path on the face (u, v offsets from x0, z0)"""
    path = []
    for (u, v) in pts2d:
        p, n = front_point(x0 + u, z0 + v)
        path.append(np.array(p + n * (r * 0.55 - embed)))
    V, Q, T, _ = tube(path, [r * 0.8, r, r, r * 0.8], ring=ring, cap=5)
    return make_mixed_mesh(name, V, Q, T)


def _face_ring(name, x0, z0, R, r, seg=96, ring=18):
    """a closed coil of clay lying on the front surface round (x0, z0)"""
    V = []
    for i in range(seg):
        a = 2 * math.pi * i / seg
        u, v = R * math.cos(a), R * math.sin(a) * 1.0
        p, n = front_point(x0 + u, z0 + v)
        p2, _ = front_point(x0 + u * 1.01, z0 + v * 1.01)
        out = (p2 - p)
        out = (out - n * out.dot(n)).normalized()
        c = p + n * (r * 0.45)
        # a wobble in the roll's thickness: it was rolled by hand
        rr = r * (1 + 0.08 * math.sin(3 * a + 0.7) + 0.05 * math.sin(7 * a))
        for j in range(ring):
            b = 2 * math.pi * j / ring
            V.append(tuple(c + rr * (math.cos(b) * out + math.sin(b) * n)))
    Q = []
    for i in range(seg):
        for j in range(ring):
            a0, a1 = i * ring + j, i * ring + (j + 1) % ring
            b0, b1 = ((i + 1) % seg) * ring + j, ((i + 1) % seg) * ring + (j + 1) % ring
            Q.append([a0, b0, b1, a1])
    return make_mixed_mesh(name, np.array(V), np.array(Q), np.zeros((0, 3), int))


def build(collection_name='CLOD', body_res=150, seed=1):
    """build CLOD at the world origin, standing on z = 0, facing -Y. Returns a Clod handle."""
    c = Clod()
    coll = bpy.data.collections.new(collection_name)
    bpy.context.scene.collection.children.link(coll)
    c.coll = coll
    MAT = {
        'clay': _clay_material('clod_clay', CLAY_HEX, niche_dark=True),
        'dark': _clay_material('clod_dark', '#2A1C18', rough=0.42, sss=0.05, mottle=0.04, ridge_bump=False),
        'tie': _clay_material('clod_tie', '#34507F', rough=0.48, sss=0.08, mottle=0.05),
        'wet': _clay_material('clod_wet', '#C0663F', rough=0.16, sss=0.2, mottle=0.05, ridge_bump=False, wet=True),
        'paper': _plain_material('clod_paper', '#EEE4CB', rough=0.85, spec=0.3, image=paper_image()),
        'board': _clay_material('clod_board', '#7C5B3E', rough=0.66, sss=0.0, mottle=0.1, ridge_bump=False),
        'clip': _plain_material('clod_clip', '#3B3C42', rough=0.34, metal=0.75),
        'wheel': _plain_material('clod_wheelhead', '#D8CFBD', rough=0.55, metal=0.0, spec=0.3),   # a plaster bat on the head
        'wheeldark': _plain_material('clod_wheeldark', '#2A2A2E', rough=0.4, metal=0.2),
    }
    c.materials = MAT

    # the armature
    arm_data = bpy.data.armatures.new('clod_arm')
    arm = bpy.data.objects.new('clod_rig', arm_data)
    coll.objects.link(arm)
    bpy.context.view_layer.objects.active = arm
    bpy.ops.object.mode_set(mode='EDIT')
    for name, hd, tl, par in BONES:
        eb = arm_data.edit_bones.new(name)
        eb.head, eb.tail = Vector(hd), Vector(tl)
        eb.roll = 0.0
        if par:
            eb.parent = arm_data.edit_bones[par]
            eb.use_connect = True
    bpy.ops.object.mode_set(mode='OBJECT')
    for pb in arm.pose.bones:
        pb.rotation_mode = 'XYZ'
    c.arm = arm

    # ---- the body
    S, Q = quad_sphere(body_res)
    t = np.arccos(np.clip(S[:, 2], -1, 1)) / np.pi
    phi = np.arctan2(S[:, 1], S[:, 0])
    r = np.interp(t, _ARC, _PROF[:, 0])
    z = np.interp(t, _ARC, _PROF[:, 1])
    V = np.stack([r * np.cos(phi), SY * r * np.sin(phi), z], axis=1)
    body = make_mesh('clod_body', V, Q)
    N = vertex_normals(body.data)
    # the face zone stays smoother (the features sit on it)
    fz = np.exp(-(((V[:, 0]) / 0.045) ** 2 + ((V[:, 2] - 0.215) / 0.04) ** 2)) * (V[:, 1] < 0)
    # the hand-sculpted form: broad, slow lumps (permanent)
    form = 0.00055 * fbm(V * 28.0, seed * 11, 3) * (1 - 0.8 * fz)
    # thumbprints (azimuth: -90 is the front), each pushed a little in its own direction
    prints = []
    for (ph, zz, ang, sc, dp, push) in [
            (-150, 0.235, 25, 1.0, 0.0011, (1, 0)), (-35, 0.245, -30, 0.95, 0.0010, (-1, 0)),
            (-178, 0.150, 80, 1.1, 0.0012, (0, 1)), (-5, 0.160, 95, 1.05, 0.0012, (0, -1)),
            (-128, 0.055, 10, 1.1, 0.0012, (1, 0.3)), (-58, 0.040, -15, 1.0, 0.0011, (-1, 0.2)),
            (150, 0.200, 40, 1.05, 0.0011, (0.5, 1)), (100, 0.120, -60, 1.15, 0.0012, (1, 0)),
            (60, 0.210, 10, 1.0, 0.0010, (0, 1)), (35, 0.070, 70, 1.1, 0.0012, (-1, 0)),
            (-110, 0.262, -40, 0.9, 0.0009, (0, -1)), (170, 0.070, 20, 1.1, 0.0012, (0, 1)),
            (-128, 0.178, 15, 0.85, 0.0009, (1, 0))]:
        p, n = surf(ph, zz)
        prints.append(Print(p, n, ang, 0.0098 * sc, 0.0075 * sc, dp * 1.45, push))
    # a thumbprint on the crown, as if it was set down by the top of its head
    p, n = surf(-90, 0.2785)
    prints.append(Print(p, n, 30, 0.010, 0.0078, 0.0013, (0, 1)))
    drags = []
    for (ph, zz, ang, ln, wd) in [(-165, 0.10, 72, 0.050, 0.013), (-15, 0.105, 108, 0.048, 0.012), (120, 0.16, 80, 0.055, 0.014),
                                   (70, 0.10, 95, 0.05, 0.013), (-120, 0.21, 40, 0.03, 0.01), (178, 0.24, 20, 0.034, 0.012),
                                   (-70, 0.02, 5, 0.04, 0.008)]:
        p, n = surf(ph, zz)
        drags.append(Drag(p, n, ang, ln, wd))
    npt, nn = surf(-90, 0.145)
    c.niche = (npt, nn)
    disp, fp, dr, nm = apply_marks(V, N, prints, drags, niche=(np.array(npt), np.array(nn), 0.0200, 0.0070))
    V2 = V + N * (form + disp)[:, None]
    body.data.vertices.foreach_set('co', V2.astype(np.float32).ravel())
    body.data.update()
    set_attr(body.data, 'fp', fp)
    set_attr(body.data, 'drag', dr)
    set_attr(body.data, 'niche', nm)
    body.data.materials.append(MAT['clay'])
    _link(coll, body)
    N2 = vertex_normals(body.data)
    add_boil(body, V2, N2, seed * 3 + 1, face_mask=fz)
    _skin(body, arm, V2)
    c.objects['body'] = body
    c.boiled.append(body)

    # ---- the feet: two nubs pressed under the front of the base
    for side, sx in (('L', -1), ('R', 1)):
        f = _ellipsoid(f'clod_foot{side}', (sx * 0.034, -0.050, 0.009), (0.026, 0.036, 0.0145), seg=48, rings=24)
        Vf = np.array([v.co[:] for v in f.data.vertices])
        Vf[:, 2] = np.maximum(Vf[:, 2], 0.0004)      # flat soles on the plinth
        f.data.vertices.foreach_set('co', Vf.astype(np.float32).ravel())
        f.data.update()
        Nf = vertex_normals(f.data)
        p0 = np.array([sx * 0.037, -0.080, 0.012])
        pr = Print(p0, np.array([0.1 * sx, -0.8, 0.6]), 20, 0.0085, 0.0065, 0.0008, (0, 1))
        d, fpf, drf, _ = apply_marks(Vf, Nf, [pr], [])
        Vf = Vf + Nf * (d + 0.0003 * fbm(Vf * 40, 70 + sx, 2))[:, None]
        f.data.vertices.foreach_set('co', Vf.astype(np.float32).ravel())
        f.data.update()
        set_attr(f.data, 'fp', fpf)
        set_attr(f.data, 'drag', drf)
        set_attr(f.data, 'niche', np.zeros(len(Vf)))
        f.data.materials.append(MAT['clay'])
        _link(coll, f)
        add_boil(f, Vf, vertex_normals(f.data), 90 + sx)
        _skin(f, arm, Vf)
        c.objects[f'foot{side}'] = f
        c.boiled.append(f)

    # ---- the clipboard, held in front of the belly (tilted back, turned a touch)
    cb_c = Vector((-0.006, -0.093, 0.077))
    Rcb = Matrix.Rotation(math.radians(-14), 3, 'X') @ Matrix.Rotation(math.radians(4), 3, 'Y') @ Matrix.Rotation(math.radians(-6), 3, 'Z')
    board = _rounded_slab('clod_board', 0.062, 0.080, 0.0032, 0.004)
    paper = _rounded_slab('clod_sheet', 0.055, 0.068, 0.0006, 0.0015, uv=True)
    clip = _rounded_slab('clod_clip', 0.026, 0.011, 0.0055, 0.002)
    for ob, off in ((board, Vector((0, 0, 0))), (paper, Vector((0, -0.0019, -0.004))), (clip, Vector((0, -0.003, 0.0355)))):
        M = Matrix.Translation(cb_c) @ Rcb.to_4x4() @ Matrix.Translation(off)
        ob.data.transform(M)
        ob.data.update()
        _link(coll, ob)
        _skin(ob, arm, anchor_z=cb_c.z)
    board.data.materials.append(MAT['board'])
    paper.data.materials.append(MAT['paper'])
    clip.data.materials.append(MAT['clip'])
    c.objects.update(board=board, sheet=paper, clip=clip)
    c.clipboard = (cb_c, Rcb)

    # ---- the arms: two rolls of clay from the shoulders to mitten hands on the board's edges
    ex = Rcb @ Vector((1, 0, 0))
    ez = Rcb @ Vector((0, 0, 1))
    for side, sx in (('L', -1), ('R', 1)):
        hand = cb_c + ex * (sx * 0.034) + ez * (-0.004) + Vector((0, 0.004, 0))
        sh_p, sh_n = surf(-165 if sx < 0 else -15, 0.158)
        start = np.array(sh_p) - np.array(sh_n) * 0.013
        elbow = np.array([sx * 0.091, -0.040, 0.111])
        mid = np.array([sx * 0.071, -0.079, 0.087])
        path = [start, np.array(sh_p) + np.array(sh_n) * 0.006 + np.array([0, -0.006, -0.010]), elbow, mid, np.array(hand)]
        Va, Qa, Ta, par = tube(path, [0.0150, 0.0162, 0.0158, 0.0148, 0.0142, 0.0152, 0.0168], ring=56, cap=12)
        ob = make_mixed_mesh(f'clod_arm{side}', Va, Qa, Ta)
        Vb = np.array([v.co[:] for v in ob.data.vertices])
        Nb = vertex_normals(ob.data)
        pr = [Print(np.array(elbow) + np.array([sx * 0.0145, -0.004, 0.0]), np.array([sx * 1.0, -0.35, 0.1]), 60, 0.0088, 0.0068, 0.0013, (0, 1)),
              Print(np.array(hand) + np.array([sx * 0.006, -0.0115, 0.005]), np.array([0.3 * sx, -1.0, 0.25]), 10, 0.0078, 0.0062, 0.0010, (1, 0))]
        dg = [Drag(np.array(mid) + np.array([sx * 0.013, 0, 0]), np.array([sx * 1.0, -0.4, 0]), 85, 0.03, 0.01)]
        d, fpa, dra, _ = apply_marks(Vb, Nb, pr, dg)
        Vb = Vb + Nb * (d + 0.0004 * fbm(Vb * 36, 40 + sx, 3))[:, None]
        ob.data.vertices.foreach_set('co', Vb.astype(np.float32).ravel())
        ob.data.update()
        set_attr(ob.data, 'fp', fpa)
        set_attr(ob.data, 'drag', dra)
        set_attr(ob.data, 'niche', np.zeros(len(Vb)))
        ob.data.materials.append(MAT['clay'])
        _link(coll, ob)
        add_boil(ob, Vb, vertex_normals(ob.data), 50 + sx)
        _skin(ob, arm, Vb)
        c.objects[f'arm{side}'] = ob
        c.boiled.append(ob)

    # ---- the face: eyes (open dots / happy arcs) and three replacement mouths, all dark clay
    ez_ = 0.236
    for side, sx in (('L', -1), ('R', 1)):
        e = _conformed_blob(f'clod_eye{side}', sx * 0.0225, ez_, lambda q: (q.x * 0.0052, q.z * 0.0060, _hd(q.y, 0.0032)), embed=0.0003)
        e.data.materials.append(MAT['dark'])
        _link(coll, e)
        _skin(e, arm, anchor_z=ez_)
        c.eyes.setdefault('open', []).append(e)
        pts = [(sx * 0.0225 + u, 0.0005 + 0.0042 * (1 - (u / 0.0065) ** 2)) for u in np.linspace(-0.0065, 0.0065, 7)]
        a = _arc_tube(f'clod_eyeHappy{side}', 0, ez_ - 0.002, pts, 0.0019)
        a.data.materials.append(MAT['dark'])
        _link(coll, a)
        _skin(a, arm, anchor_z=ez_)
        c.eyes.setdefault('happy', []).append(a)
    mz = 0.2105
    sm = _arc_tube('clod_mouthSmile', 0, mz, [(u, 0.0052 * (u / 0.0135) ** 2 - 0.0004) for u in np.linspace(-0.0135, 0.0135, 9)], 0.0021)
    mo = _conformed_blob('clod_mouthO', 0, mz - 0.0012, lambda q: (q.x * 0.0058, q.z * 0.0074, _hd(q.y, 0.0016)), embed=0.0003)

    def dshape(q):
        # an open smile: flat-ish top lip, round bottom
        u = q.x * 0.0125
        v = q.z * 0.0078
        v = np.where(v > 0, v * 0.35, v) + 0.0012 * (u / 0.0125) ** 2
        return (u, float(v), _hd(q.y, 0.0016))
    md = _conformed_blob('clod_mouthOpen', 0, mz + 0.001, dshape, embed=0.0003)
    for nm_, ob in (('smile', sm), ('O', mo), ('open', md)):
        ob.data.materials.append(MAT['dark'])
        _link(coll, ob)
        _skin(ob, arm, anchor_z=mz)
        c.mouths[nm_] = ob

    # ---- the bow tie under its chin: two pinched wings and a knot, blue clay
    tz = 0.183

    def wing(sx):
        def f(q):
            u = sx * (0.0035 + (q.x * 0.5 + 0.5) * 0.0145)
            grow = 0.45 + 0.55 * (q.x * 0.5 + 0.5)
            v = q.z * 0.0082 * grow
            return (u, v, _hd(q.y, 0.0060 * (0.7 + 0.3 * grow)))
        return f
    for side, sx in (('L', -1), ('R', 1)):
        w = _conformed_blob(f'clod_tie{side}', 0, tz, wing(sx), seg=48, rings=20, embed=0.0003)
        w.data.materials.append(MAT['tie'])
        _link(coll, w)
        _skin(w, arm, anchor_z=tz)
        c.objects[f'tie{side}'] = w
    kn = _conformed_blob('clod_tieKnot', 0, tz, lambda q: (q.x * 0.0042, q.z * 0.0052, _hd(q.y, 0.0070)), embed=0.0003)
    kn.data.materials.append(MAT['tie'])
    _link(coll, kn)
    _skin(kn, arm, anchor_z=tz)
    c.objects['tieKnot'] = kn

    # ---- the porthole: a coil of clay pressed round the niche, so it reads as a window, not a hole
    co = _face_ring('clod_porthole', 0.0, 0.145, 0.0216, 0.0024)
    co.data.materials.append(MAT['clay'])
    _link(coll, co)
    Vc = np.array([v.co[:] for v in co.data.vertices])
    set_attr(co.data, 'fp', np.zeros((len(Vc), 3)))
    set_attr(co.data, 'drag', np.zeros((len(Vc), 3)))
    set_attr(co.data, 'niche', np.zeros(len(Vc)))
    add_boil(co, Vc, vertex_normals(co.data), 33, amp=0.00018)
    _skin(co, arm, anchor_z=0.145)
    c.objects['porthole'] = co
    c.boiled.append(co)

    # ---- the potter's wheel in its chest niche: a wheel head tipped toward us, a tiny wet pot, a spindle
    npt, nn = Vector(c.niche[0]), Vector(c.niche[1])
    wc = npt - nn * 0.0020 + Vector((0, 0, -0.0012))
    tilt = Matrix.Rotation(math.radians(58), 4, 'X')      # tipped toward the lens: a turntable with a pot standing on it
    wheel_parts = []
    head = _lathe('clod_wheelHead', [(0.0, 0.0012), (0.0084, 0.0012), (0.0090, 0.0006), (0.0090, -0.0008), (0.0082, -0.0014), (0.0, -0.0014)], 72)
    spindle = _lathe('clod_wheelSpindle', [(0.0, -0.0014), (0.0024, -0.0014), (0.0024, -0.012), (0.0, -0.012)], 24)
    pot = _lathe('clod_wheelPot', [(0.0, 0.0012), (0.0046, 0.0012), (0.0052, 0.0024), (0.0047, 0.0042), (0.0035, 0.0054), (0.0037, 0.0062),
                                   (0.0030, 0.0064), (0.0028, 0.0055), (0.0, 0.0049)], 48)
    # the marks that make the turn readable: a dark lug on the rim and a thumb-slip on the pot
    lug = _ellipsoid('clod_wheelLug', (0.0074, 0, 0.0011), (0.0021, 0.0015, 0.0008), seg=16, rings=8)
    slip = _ellipsoid('clod_wheelSlip', (0.0042, 0, 0.0036), (0.0012, 0.0016, 0.0016), seg=16, rings=8)
    for ob, mat in ((head, MAT['wheel']), (spindle, MAT['wheeldark']), (pot, MAT['wet']), (lug, MAT['wheeldark']), (slip, MAT['wet'])):
        ob.data.materials.append(mat)
        _link(coll, ob)
        wheel_parts.append(ob)
    # a pivot empty carries the spin; its parts are its children, and the armature deforms them after the spin
    piv = bpy.data.objects.new('clod_wheelPivot', None)
    piv.empty_display_size = 0.01
    coll.objects.link(piv)
    piv.matrix_world = Matrix.Translation(wc) @ tilt
    for ob in wheel_parts:
        ob.parent = piv
        _skin(ob, arm, V=np.zeros((len(ob.data.vertices), 3)), anchor_z=wc.z)
    c.wheel_pivot = piv
    c.wheel_base = piv.matrix_world.copy()
    c.wheel = wheel_parts
    # every mesh keeps its rest position as its texture space
    for ob in coll.objects:
        if ob.type == 'MESH' and 'rest' not in ob.data.attributes:
            Vr = np.zeros(len(ob.data.vertices) * 3, np.float32)
            ob.data.vertices.foreach_get('co', Vr)
            set_attr(ob.data, 'rest', Vr.reshape(-1, 3))
    return c


def _rounded_slab(name, w, h, t, rad, uv=False):
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts:
        v.co = Vector((v.co.x * w, v.co.y * t, v.co.z * h))
    bev = bmesh.ops.bevel(bm, geom=[e for e in bm.edges if abs(e.verts[0].co.y - e.verts[1].co.y) > 1e-9],
                          offset=rad, segments=4, affect='EDGES', profile=0.5)
    if uv:
        uvl = bm.loops.layers.uv.new('UVMap')
        for f in bm.faces:
            for lp in f.loops:
                lp[uvl].uv = ((lp.vert.co.x / w) + 0.5, (lp.vert.co.z / h) + 0.5)
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    ob = bpy.data.objects.new(name, me)
    for p in me.polygons:
        p.use_smooth = False
    return ob


def _lathe(name, prof, seg):
    """a surface of revolution about local Z from (r, z) points"""
    ang = np.linspace(0, 2 * np.pi, seg, endpoint=False)
    V, rows = [], []
    for (r, z) in prof:
        row = []
        for a in ang:
            row.append(len(V))
            V.append((r * math.cos(a), r * math.sin(a), z))
        rows.append(row)
    Q = []
    for i in range(len(rows) - 1):
        for j in range(seg):
            Q.append([rows[i][j], rows[i][(j + 1) % seg], rows[i + 1][(j + 1) % seg], rows[i + 1][j]])
    return make_mixed_mesh(name, np.array(V), np.array(Q), np.zeros((0, 3), int))


# ------------------------------------------------------------------------------------------------ posing
class Pose:
    """one held pose of the puppet (a 2-frame step)"""
    def __init__(self, bow=0.0, head=0.0, turn=0.0, tilt=0.0, squash=1.0, lift=0.0, mouth='smile', eyes='open',
                 boil=0, wheel=0.0, jitter=(0.0, 0.0, 0.0)):
        self.bow, self.head, self.turn, self.tilt, self.squash, self.lift = bow, head, turn, tilt, squash, lift
        self.mouth, self.eyes, self.boil, self.wheel, self.jitter = mouth, eyes, boil, wheel, jitter


def apply_pose(c, p):
    """bow/head: degrees forward (toward -Y); turn: degrees of yaw toward +X (frame right);
    tilt: head cock (degrees); squash: volume-preserving (z * s, x/y / sqrt(s)); boil: which replacement surface"""
    pb = c.arm.pose.bones
    s = max(0.5, p.squash)
    # bone space for these vertical bones: x = world X, y = world up, z = world -Y (the front)
    pb['root'].scale = (1 / math.sqrt(s), s, 1 / math.sqrt(s))
    pb['root'].rotation_euler = (0, math.radians(p.turn * 0.35), 0)
    pb['body'].rotation_euler = (math.radians(p.bow), math.radians(p.turn * 0.35), math.radians(p.tilt * 0.3))
    pb['head'].rotation_euler = (math.radians(p.head), math.radians(p.turn * 0.3), math.radians(p.tilt * 0.7))
    pb['root'].location = (p.jitter[0], p.lift + p.jitter[2], -p.jitter[1])
    for ob in c.boiled:
        kb = ob.data.shape_keys.key_blocks
        for k in range(4):
            kb[f'boil{k}'].value = 1.0 if (p.boil % 4) == k else 0.0
    for nm, ob in c.mouths.items():
        ob.hide_render = ob.hide_viewport = (nm != p.mouth)
    for nm, obs in c.eyes.items():
        for ob in obs:
            ob.hide_render = ob.hide_viewport = (nm != p.eyes)
    c.wheel_pivot.matrix_world = c.wheel_base @ Matrix.Rotation(math.radians(p.wheel), 4, 'Z')


def boil_order(n, seed=7):
    """a hashed order through the 4 surfaces with no immediate repeat"""
    out, prev = [], -1
    for i in range(n):
        k = int(hashf(seed, i) * 4)
        if k == prev:
            k = (k + 1 + int(hashf(seed, i, 9) * 3)) % 4
        out.append(k)
        prev = k
    return out


def mouth_of(shape):
    """the take's mouth shapes to three replacement mouths"""
    return {'rest': 'smile', 'M': 'smile', 'O': 'O', 'E': 'open', 'A': 'open'}.get(shape, 'smile')
