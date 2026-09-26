// MR. MAS — range/p3: the model's points. Everything the model hasn't learned stays points (and glyph), and every
// change of state is a point moving:
//   · the pixel [W] lifted into depth pixel-for-pixel: each pixel becomes a VOXEL in its own colour, a square the size
//     of its own footprint (so the first 3D frame is the pixel frame, exactly, and the camera's move parts it in depth);
//     then, in a wave out of the monitor, the room cools to the model's sparse cyan points
//   · the people at tonight's table come apart into their POV-rim colours and gather at the 2015 seats (ALYI, who
//     isn't at tonight's table, arrives from the frame's edge); the four clusters converge on cyan
//   · each guest ASSEMBLES out of its cluster, one point per pixel of the drawing (the sprite pixel appears as its point lands)
//   · the learned objects condense before they resolve, and come back as they de-resolve
//   · at the end every drawn pixel comes apart into a point of its own colour, and all of it streams into the monitor
// Two THREE.Points draws: the voxels (opaque, depth-written, so the room is solid) and everything else (additive).
import {THREE, Any, TONE_GLSL, h01} from './kit';
import {GLYPHS} from './tex';
import {OBuf, O, WIDE_PEOPLE} from '../plate';
import {SIDE_CAM, unprojectPlane, project, WALL_Z, END_X, RIGHT_Z, TABLE, MONITOR, WINDOW, SEATS, SCONCES, V3, NW, NH, MAS_EYE} from '../layout';
import {T} from '../timeline';
import {PAL} from '../../../../shared/pixel/palette';

/** kinds: 0 voxel · 1 room glyph/point · 2 rim swarm · 3 object cloud · 5 chair · 6 assembly · 7 a drawn pixel coming apart */
export const K = {lift: 0, room: 1, rim: 2, obj: 3, chair: 5, asm: 6, out: 7} as const;
/** groups (for "die at your family's beat" and the de-resolve) */
export const GRP = {none: 0, table: 1, candles: 2, cutlery: 3, glasses: 4, present: 5, masGlass: 6, sprite: 7, mas: 11, window: 12} as const;
export const NGRP = 16;

export interface Pt {
  pos: V3; from: V3; col: number; col0?: number; birth: number; travel: number; kind: number; seed: number; die: number;
  glyph?: number; grp: number;
  /** world footprint of the pixel it came from (m); 0 = a screen-sized point */
  foot?: number;
  /** voxels: the frame it cools to the model's cyan · rims: the frame it appears (as its exact pixel) */
  t3?: number;
}

const hexRGB = (c: number): [number, number, number] => [((c >> 16) & 255) / 255, ((c >> 8) & 255) / 255, (c & 255) / 255];
const CYAN = [PAL.C0, PAL.C1, PAL.C2, PAL.C3, PAL.C4, PAL.C5, PAL.C6, PAL.C7, PAL.C8, PAL.C9].map(hexRGB);
/** the side view's focal length in native px (a pixel's footprint at depth d is d / F_SIDE metres) */
const F_SIDE = NW / (SIDE_CAM.tr - SIDE_CAM.tl);

/** the plane each owner of the [W] lies on (for the lift) */
const ownerPlane = (o: number): [V3, number] | null => {
  switch (o) {
    case O.wall: return [[0, 0, 1], WALL_Z];
    case O.floor: case O.under: return [[0, 1, 0], 0];
    case O.top: return [[0, 1, 0], TABLE.top];
    case O.drape: return [[0, 0, 1], TABLE.z1 + TABLE.drape];
    case O.prop: case O.glow: case O.candle: return [[0, 0, 1], -0.05];
    case O.masGlass: return [[0, 0, 1], 0.22];
    case O.monitor: return [[0, 0, 1], MONITOR.c[2]];
    case O.pendant: case O.chair: return [[0, 0, 1], 0];
    default: return null; // people and the band are never lifted
  }
};
const sideDepth = (p: V3) => SIDE_CAM.pos[2] - p[2];
/** the frame a voxel cools: a wave out of the monitor through the room's own depth, with an ordered-dither spread */
const B4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
export const coolAt = (p: V3, x: number, y: number) =>
  T.glide[0] + 8 + Math.hypot(p[0] - MONITOR.c[0], (p[1] - MONITOR.c[1]) * 1.2, (p[2] - MONITOR.c[2]) * 1.4) * 6.4 + (B4[(y & 3) * 4 + (x & 3)] / 16) * 9;

export interface PointsBuild { pts: Pt[]; }
/** the rim colour (master palette) of each seat's POV */
export const rimOf = (c: number) => (c === 0x39ff88 ? PAL.L3 : c === 0xff6a1a ? PAL.W5 : c === 0xe0301e ? PAL.Q2 : PAL.F5);

export const buildPoints = (wide: OBuf, objSamples: Array<{grp: number; pts: V3[]}>): PointsBuild => {
  const pts: Pt[] = [];
  const t0 = T.glide[0];
  // ---- 0: the lifted [W]: every room pixel becomes a voxel on its own plane, exact at the first moving frame
  for (let y = 0; y < NH; y++)
    for (let x = 0; x < NW; x++) {
      const o = wide.own[y * NW + x];
      const pl = ownerPlane(o);
      if (!pl) continue;
      const p = unprojectPlane(SIDE_CAM, x + 0.5, y + 0.5, pl[0], pl[1]);
      if (!p || p[2] > RIGHT_Z - 0.03) continue;
      const s = h01(x, y, 1);
      const cool = coolAt(p, x, y);
      // what survives as the model's room: the drawing's edges (frames, mullions, rails, the sign), some of the cloth
      const L = (c: number) => (((c >> 16) & 255) * 0.3 + ((c >> 8) & 255) * 0.59 + (c & 255) * 0.11) / 255;
      const c0 = L(wide.c[y * NW + x]);
      const g = Math.max(Math.abs(c0 - L(wide.c[y * NW + Math.min(NW - 1, x + 1)])), Math.abs(c0 - L(wide.c[Math.min(NH - 1, y + 1) * NW + x])));
      const edge = g > 0.045;
      const keep = o === O.wall || o === O.floor ? (edge ? 0.55 : o === O.wall ? 0.1 : 0.16) : o === O.top || o === O.drape ? 0.6 : 0.5;
      let die = s < keep ? 1e4 : cool + 4 + h01(x, y, 2) * 14;
      let grp: number = GRP.none;
      if (o === O.top || o === O.drape) { grp = GRP.table; if (s < keep) die = T.resolve.table + 2 + h01(x, y, 5) * 12; }
      if (o === O.prop || o === O.masGlass || o === O.candle || o === O.glow) { grp = GRP.present; die = Math.max(cool + 3, 96) + h01(x, y, 6) * 18; }
      if (o === O.monitor) die = 104 + h01(x, y, 7) * 14;
      if (o === O.pendant) die = cool + 8 + h01(x, y, 7) * 14;
      pts.push({pos: p, from: p, col: wide.c[y * NW + x], birth: t0, travel: 0, kind: K.lift, seed: s, die, grp, foot: sideDepth(p) / F_SIDE, t3: cool});
    }
  // ---- 1: the rest of the room the side view never saw: the far end wall, the near-side wall, window, floor
  const roomPt = (p: V3, col: number, glyphP: number, i: number, birthMin = 72, grp: number = GRP.none) => {
    const s = h01(i, 91, 3);
    pts.push({pos: p, from: [p[0], p[1] - 0.04, p[2]], col, birth: birthMin + s * 34, travel: 12, kind: K.room, seed: s, die: 1e4, glyph: h01(i, 17) < glyphP ? Math.floor(h01(i, 23) * GLYPHS.length) : -1, grp});
  };
  let n = 0;
  // end wall: wainscot below 0.9 m (panels), plaster above, the chair rail at 0.9, a picture rail at 2.3
  for (let i = 0; i < 5200; i++) {
    const z = WALL_Z + h01(i, 1, 7) * (RIGHT_Z - WALL_Z), y = h01(i, 2, 7) * 2.7;
    const inWin = Math.abs(z - WINDOW.c[2]) < WINDOW.w / 2 + 0.06 && Math.abs(y - WINDOW.c[1]) < WINDOW.h / 2 + 0.06;
    if (inWin) continue;
    const rail = Math.abs(y - 0.9) < 0.012 || Math.abs(y - 2.3) < 0.01;
    const panel = y < 0.9 && (Math.abs(((z + 10) % 0.45) - 0.05) < 0.01 || Math.abs(y - 0.12) < 0.01 || Math.abs(y - 0.78) < 0.01);
    if (!rail && !panel && h01(i, 3, 7) > 0.18) continue;
    roomPt([END_X, y, z], rail || panel ? PAL.N7 : PAL.N4, rail || panel ? 0.35 : 0, n++);
  }
  // the near-side wall (+z), sparse
  for (let i = 0; i < 2600; i++) {
    const x = -1.5 + h01(i, 4, 7) * (END_X + 1.5), y = h01(i, 5, 7) * 2.6;
    const rail = Math.abs(y - 0.9) < 0.015;
    if (!rail && h01(i, 6, 7) > 0.2) continue;
    roomPt([x, y, RIGHT_Z], rail ? PAL.N7 : PAL.N4, rail ? 0.35 : 0, n++);
  }
  // the floor: boards along x, a faint seam every 0.14 m
  for (let i = 0; i < 5000; i++) {
    const x = -1.2 + h01(i, 8, 7) * (END_X + 1.2), z = WALL_Z + h01(i, 9, 7) * (RIGHT_Z - WALL_Z);
    const seam = Math.abs(((z + 10) % 0.14) - 0.07) < 0.004;
    if (!seam && h01(i, 10, 7) > 0.35) continue;
    roomPt([x, 0.001, z], seam ? PAL.N6 : PAL.N4, 0.05, n++, 70);
  }
  // the window on the end wall: an arched pane (the WOODROSE's), frame and mullions brighter, a faint lattice of glass
  {
    const wn = WINDOW, hw = wn.w / 2, rise = hw, straight = wn.h - rise;
    const y0 = wn.c[1] - wn.h / 2;
    const inside = (z: number, y: number) => { const dz = z - wn.c[2]; if (Math.abs(dz) > hw || y < y0) return false; if (y < y0 + straight) return true; return dz * dz + (y - y0 - straight) ** 2 <= hw * hw; };
    let wi = 0;
    for (let yy = 0; yy <= 110; yy++)
      for (let zz = 0; zz <= 56; zz++) {
        const z = wn.c[2] - hw + (zz / 56) * wn.w, y = y0 + (yy / 110) * wn.h;
        if (!inside(z, y)) continue;
        const edge = !inside(z - 0.03, y) || !inside(z + 0.03, y) || !inside(z, y + 0.03) || !inside(z, y - 0.03);
        const mull = Math.abs(z - wn.c[2]) < 0.012 || Math.abs(y - (y0 + straight * 0.5)) < 0.012 || Math.abs(y - (y0 + straight)) < 0.012;
        const dg = (y - y0) * 0.55 + (z - wn.c[2]);
        const sheen = Math.abs(dg - 0.52) < 0.035 || Math.abs(dg - 0.66) < 0.015;
        if (!edge && !mull && !sheen && (yy + zz) % 4) continue;
        roomPt([END_X - 0.005, y, z], edge || mull ? PAL.N8 : sheen ? PAL.N6 : PAL.N3, 0, 90000 + wi++, 80, edge || mull ? GRP.none : GRP.window);
      }
  }
  // the sconces themselves (unlearned fixtures: a warm cluster of points on the wall)
  for (const sc of SCONCES)
    for (let k = 0; k < 160; k++) {
      const a = h01(k, 5, 61) * Math.PI * 2, r = Math.sqrt(h01(k, 6, 61)) * 0.05, yy = h01(k, 7, 61) * 0.1 - 0.05;
      const p: V3 = [sc.p[0] + Math.cos(a) * r, sc.p[1] + yy, sc.p[2] + Math.sin(a) * r * 0.3];
      pts.push({pos: p, from: [p[0], p[1] - 0.04, p[2]], col: k % 4 ? PAL.W4 : PAL.W6, birth: 84 + h01(k, 8, 61) * 30, travel: 10, kind: K.room, seed: h01(k, 9, 61), die: 1e4, glyph: -2, grp: GRP.none});
    }
  // ---- 5: chairs at the 2015 seats (bentwood: posts and the bent top rail behind the sitter) — never learned
  let ci = 0, si0 = 0;
  for (const s of SEATS) {
    const sx = s.x, sz = s.z, back = s.z < 0 ? -1 : 1;
    const add = (p: V3) => { const k = h01(ci++, 5, 5); pts.push({pos: p, from: [p[0], p[1] - 0.05, p[2]], col: PAL.N5, birth: 84 + k * 26, travel: 12, kind: K.chair, seed: k, die: 1e4, grp: GRP.none}); };
    for (let k = 0; k < 110; k++) {
      const q = h01(k, si0, 81), t = h01(k, si0, 82), jx = (h01(k, si0, 83) - 0.5) * 0.03, jz = (h01(k, si0, 84) - 0.5) * 0.03;
      if (q < 0.6) add([sx + (q < 0.3 ? -0.2 : 0.2) + jx, 0.45 + t * 0.5, sz + back * 0.2 + jz]);
      else { const a = t * Math.PI; add([sx + Math.cos(a) * 0.2 + jx, 0.95 + Math.sin(a) * 0.045 + jz * 0.5, sz + back * 0.2 + jz]); }
    }
    si0++;
  }
  // ---- 2: the people at tonight's table come apart into their own rim colour and go to their 2015 seats; ALYI, who
  // isn't at tonight's table, arrives from the frame's edge. MAS goes into the lens: we are him.
  const seatCloud = (s: (typeof SEATS)[number], k: number, si: number): V3 => {
    const a = h01(k, si, 11) * Math.PI * 2, rr = Math.sqrt(h01(k, si, 12)), hgt = h01(k, si, 13);
    return [s.x + Math.cos(a) * rr * 0.2, s.eye - 0.42 + hgt * 0.62, s.pz + Math.sin(a) * rr * 0.16];
  };
  const cloudDie = (k: number, si: number) => T.resolve.guests + 2 + h01(k, si, 76) * 12;
  let pk = 0;
  for (let y = 0; y < NH; y++)
    for (let x = 0; x < NW; x++) {
      const o = wide.own[y * NW + x];
      if (o !== O.person && o !== O.mas) continue;
      const isMas = o === O.mas;
      const who = isMas ? null : WIDE_PEOPLE.find((q) => x >= q.x0 && x < q.x1)?.who;
      if (!isMas && !who) continue;
      const f = unprojectPlane(SIDE_CAM, x + 0.5, y + 0.5, [0, 0, 1], isMas ? 0 : -0.75);
      if (!f) continue;
      const k = pk++;
      const s0 = h01(x, y, 71);
      const foot = sideDepth(f) / F_SIDE;
      // they hold as flat pictures for a beat once the camera moves (the model can't lift a person), then go,
      // the ones nearest the monitor first
      const go = t0 + 4 + (1 - (x - 60) / 340) * 8 + s0 * 6;
      if (isMas) {
        const to: V3 = [MAS_EYE[0] + 0.25 + (h01(x, y, 72) - 0.5) * 0.2, MAS_EYE[1] + (h01(x, y, 73) - 0.5) * 0.15, MAS_EYE[2] + (h01(x, y, 74) - 0.5) * 0.25];
        pts.push({pos: to, from: f, col: PAL.C6, col0: wide.c[y * NW + x], t3: t0, birth: go, travel: 30 + s0 * 10, kind: K.rim, seed: s0, die: 1e4, grp: GRP.mas, foot});
        continue;
      }
      const si = SEATS.findIndex((q) => q.who === who);
      const s = SEATS[si];
      pts.push({pos: seatCloud(s, k, si), from: f, col: rimOf(s.rim), col0: wide.c[y * NW + x], t3: t0, birth: go, travel: 28 + h01(x, y, 75) * 10, kind: K.rim, seed: s0, die: cloudDie(k, si), grp: GRP.sprite + si, foot});
    }
  for (let si = 0; si < SEATS.length; si++) {
    const s = SEATS[si];
    const edge: V3 = s.z < 0 ? [s.x - 0.2, s.near ? 1.0 : 1.9, -2.4] : [s.x - 0.2, s.near ? 1.0 : 1.9, 2.4];
    const nEdge = s.who === 'alyi' ? 1300 : 220;
    for (let k = 0; k < nEdge; k++) {
      const p = seatCloud(s, k + 5000, si);
      const f: V3 = [edge[0] + (h01(k, si, 14) - 0.5) * 0.9, edge[1] + (h01(k, si, 15) - 0.5) * 0.9, edge[2] + (h01(k, si, 16) - 0.5) * 0.8];
      const b = T.rimsIn[0] + 2 + h01(k, si, 17) * 16 + si * 2;
      pts.push({pos: p, from: f, col: rimOf(s.rim), t3: b, birth: b, travel: 24 + h01(k, si, 18) * 12, kind: K.rim, seed: h01(k, si, 19), die: cloudDie(k + 5000, si), grp: GRP.sprite + si});
    }
  }
  // ---- 3: the learned objects condense out of scattered points before they resolve
  for (const o of objSamples)
    o.pts.forEach((p, k) => {
      const s = h01(k, o.grp, 31);
      const f: V3 = [p[0] + (h01(k, o.grp, 32) - 0.5) * 0.5, p[1] + h01(k, o.grp, 33) * 0.35, p[2] + (h01(k, o.grp, 34) - 0.5) * 0.5];
      const beat = o.grp === GRP.table ? T.resolve.table : o.grp === GRP.candles ? T.resolve.candles : o.grp === GRP.cutlery ? T.resolve.cutlery : o.grp === GRP.glasses ? T.resolve.glasses : T.resolve.masGlass;
      pts.push({pos: p, from: f, col: PAL.C6, birth: 82 + s * 16, travel: 16 + s * 8, kind: K.obj, seed: s, die: o.grp === GRP.masGlass ? beat + h01(k, o.grp, 35) * 5 : beat + 1 + h01(k, o.grp, 35) * 12, grp: o.grp});
    });
  return {pts};
};

/** A drawn picture's pixels, each a point at its world position (assembly targets / what comes apart at the end) */
export interface PixelCloud { img: {w: number; h: number; c: Int32Array}; x0: number; y0: number; world: (x: number, y: number) => V3; foot: number; rim: number; grp: number; }
/** Assembly: the cluster's points fly to the drawing's pixels; each pixel appears as its point lands (land(i, j)) */
export const assemblyPoints = (pc: PixelCloud, cloud: (k: number) => V3, land: (i: number, j: number) => number, keep: (i: number, j: number) => boolean = () => true): Pt[] => {
  const out: Pt[] = [];
  const {img} = pc;
  for (let j = 0; j < img.h; j++)
    for (let i = 0; i < img.w; i++) {
      if (img.c[j * img.w + i] < 0 || !keep(i, j)) continue;
      const L = land(i, j), s = h01(i, j, 301 + pc.grp);
      const tr = 9 + s * 5;
      out.push({pos: pc.world(pc.x0 + i + 0.5, pc.y0 + j + 0.5), from: cloud(j * img.w + i), col: PAL.C7, birth: L - tr, travel: tr, kind: K.asm, seed: s, die: L, grp: pc.grp, foot: pc.foot});
    }
  return out;
};
/** Coming apart: each pixel becomes a point of its own colour at out(i, j), cools to the rim colour, then streams */
export const dissolvePoints = (pc: PixelCloud, outAt: (i: number, j: number) => number, keep: (i: number, j: number) => boolean = () => true, dieAt?: (i: number, j: number) => number): Pt[] => {
  const out: Pt[] = [];
  const {img} = pc;
  for (let j = 0; j < img.h; j++)
    for (let i = 0; i < img.w; i++) {
      const c = img.c[j * img.w + i];
      if (c < 0 || !keep(i, j)) continue;
      const s = h01(i, j, 401 + pc.grp);
      const p = pc.world(pc.x0 + i + 0.5, pc.y0 + j + 0.5);
      out.push({pos: p, from: p, col: pc.rim, col0: c, birth: outAt(i, j), travel: 0, kind: K.out, seed: s, die: dieAt ? dieAt(i, j) : 1e4, grp: pc.grp, foot: pc.foot});
    }
  return out;
};

// ------------------------------------------------------------------ the GPU side
const VS = TONE_GLSL + /* glsl */ `
attribute vec3 aFrom; attribute vec3 aCol; attribute vec4 aT; attribute vec4 aT2; attribute vec3 aCol0; attribute vec2 aT3;
uniform float uF; uniform float uExp; uniform vec3 uCyan[10]; uniform vec3 uMon; uniform float uStream0; uniform float uRimCyan;
uniform float uHiRes; uniform float uFocal; uniform float uWinDots;
uniform float uDeres[${NGRP}]; uniform mat4 uVP; uniform mat4 uV;
varying vec3 vCol; varying float vA; varying float vGlyph;
vec3 toCyan(vec3 c, float lift) {
  float l = dot(c, vec3(0.3, 0.59, 0.11));
  float k = clamp(floor(l * 11.0 + lift), 0.0, 9.0);
  vec3 o = uCyan[0];
  for (int i = 0; i < 10; i++) if (float(i) == k) o = uCyan[i];
  return o;
}
float e3(float t){ t = clamp(t, 0.0, 1.0); return t * t * (3.0 - 2.0 * t); }
void main(){
  float birth = aT.x, travel = aT.y, kind = aT.z, seed = aT.w;
  float die = aT2.x, glyph = aT2.y, foot = aT2.z, grp = aT2.w;
  float t3 = aT3.x;
  float age = uF - birth;
  vec3 p = position; vec3 col = aCol; float a = 1.0; float size = 2.0; bool footSize = false;
  if (kind < 0.5) {
    // a voxel: its own colour and footprint until the cooling wave reaches it, then a cyan point, a little risen
    a = age < 0.0 ? 0.0 : 1.0;
    float c = uF - t3;
    if (c < 0.0) { col = aCol; footSize = true; }
    else { col = toCyan(aCol, 2.0); size = c < 2.0 ? -1.0 : 2.0; p.y += e3(c / 20.0) * (0.01 + seed * 0.025); }
  } else if (kind < 1.5) {
    float t = e3(age / max(travel, 1.0));
    p = mix(aFrom, position, t); a *= age < 0.0 ? 0.0 : t;
    col = glyph < -1.5 ? aCol : toCyan(aCol, 1.5);
    size = glyph >= 0.0 ? 11.0 : 2.0;
    if (grp > 11.5 && grp < 12.5) a *= uWinDots;
  } else if (kind < 2.5) {
    // the rims: a person's pixels (exact, in their memory colour) held as a flat picture, then off to the 2015 seat,
    // or a swarm in from the frame's edge; converging on cyan on the beat
    float since = uF - t3;
    a = since < 0.0 ? 0.0 : 1.0;
    float t = age < 0.0 ? 0.0 : e3(age / max(travel, 1.0));
    p = mix(aFrom, position, t);
    p += vec3(sin(uF * 0.13 + seed * 40.0), sin(uF * 0.11 + seed * 23.0), cos(uF * 0.12 + seed * 31.0)) * 0.006 * t;
    vec3 rc = uRimCyan >= 1.0 ? uCyan[6] : uRimCyan > 0.0 ? mix(aCol, uCyan[6], 0.5) : aCol;
    if (age < 0.0 && foot > 0.0) { col = aCol0; footSize = true; }
    else { col = age < 3.0 && foot > 0.0 ? mix(aCol0, rc, 0.5) : rc; size = age < 3.0 && foot > 0.0 ? 3.0 : 2.0; }
    if (grp > 10.5 && grp < 11.5) { a *= 1.0 - t; col = age < 0.0 ? aCol0 : uCyan[6]; }
  } else if (kind < 3.5) {
    float t = e3(age / max(travel, 1.0));
    p = mix(aFrom, position, t); a *= age < 0.0 ? 0.0 : 0.45 + 0.55 * t;
    col = t < 0.98 ? uCyan[6] : uCyan[7];
    size = 1.8;
  } else if (kind < 5.5) {
    float t = e3(age / max(travel, 1.0));
    p = mix(aFrom, position, t); a *= age < 0.0 ? 0.0 : t; col = uCyan[4]; size = 1.6;
  } else if (kind < 6.5) {
    // assembly: leave the cluster, land on the pixel (the pixel takes over as it lands)
    float t = e3(age / max(travel, 1.0));
    a = age < 0.0 ? 0.0 : 1.0;
    p = mix(aFrom, position, t);
    col = t < 0.85 ? uCyan[4] : uCyan[6];
    size = 2.0; a *= 0.7;
  } else {
    // a drawn pixel coming apart: exact for a beat, then a point that cools to its rim colour and drifts
    a = age < 0.0 ? 0.0 : 1.0;
    if (age < 2.0) { col = aCol0; footSize = true; }
    else {
      float t = e3((age - 2.0) / 10.0);
      col = age < 5.0 ? aCol0 : age < 9.0 ? aCol : mix(aCol, uCyan[6], 0.5);
      size = age < 5.0 ? 3.0 : 2.0;
      p += vec3(seed - 0.5, 0.6 + seed, fract(seed * 7.3) - 0.5) * 0.05 * t;
    }
  }
  // death (fade in held steps over 4 frames)
  float d = uF - die;
  if (d > 0.0) a *= d < 2.0 ? 0.66 : d < 4.0 ? 0.33 : 0.0;
  if (kind < 0.5 && d > 0.0) { a = d < 2.0 ? 1.0 : 0.0; size = 1.0; footSize = false; }
  // the de-resolve (objects fall back to points, eased by each point's own seed): the group's cloud comes back
  int gi = int(grp + 0.5);
  if (kind > 2.5 && kind < 3.5 && gi < ${NGRP}) { float r0 = uDeres[gi]; if (r0 > 0.0 && uF >= r0 + seed * 9.0) { a = 1.0; col = uCyan[7]; size = 1.8; p = position; } }
  // the collapse: everything streams into the monitor's glow (the nearest first), accelerating
  if (uStream0 > 0.0) {
    float dl = distance(p, uMon);
    float t0 = uStream0 + dl * 1.7 + seed * 2.0;
    float st = clamp((uF - t0) / 5.0, 0.0, 1.0);
    st = st * st;
    p = mix(p, uMon, st * 0.985);
    if (st > 0.0) { footSize = false; size = 2.0; col = mix(col, uCyan[8], st); }
    a *= 1.0 - st * 0.5;
    if (st >= 1.0) a = 0.0;
  }
  vec4 mv = uV * vec4(p, 1.0);
  gl_Position = uVP * vec4(p, 1.0);
  float depth = max(-mv.z, 0.05);
  if (footSize) size = min(foot * uFocal / depth, 26.0);
  else if (size < 0.0) size = 3.0 * uHiRes;
  else if (kind > 0.5 && glyph < 0.0 || kind < 0.5) size = clamp(size * (2.4 / max(depth, 0.4)), 1.0, 3.2) * uHiRes;
  else size *= uHiRes;
  gl_PointSize = size;
  vGlyph = kind < 1.5 && kind > 0.5 ? glyph : -1.0;
  vCol = p3_fromDisplay(col) / uExp;
  vA = a;
  if (a <= 0.0) gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
}`;
const FS = /* glsl */ `
uniform sampler2D tGlyph; uniform float uGCols; uniform float uGRows; uniform float uOpaque;
varying vec3 vCol; varying float vA; varying float vGlyph;
void main(){
  float a = vA;
  if (vGlyph >= 0.0) {
    float gx = mod(vGlyph, uGCols), gy = floor(vGlyph / uGCols);
    vec2 uv = (vec2(gx, gy) + vec2(gl_PointCoord.x, gl_PointCoord.y)) / vec2(uGCols, uGRows);
    float m = texture2D(tGlyph, vec2(uv.x, 1.0 - uv.y)).a;
    a *= m * 0.9;
  }
  if (uOpaque > 0.5) { if (a < 0.5) discard; gl_FragColor = vec4(vCol, 1.0); return; }
  if (a <= 0.003) discard;
  gl_FragColor = vec4(vCol * a, 1.0);
}`;

export const makePoints = (list: Pt[], glyph: {tex: Any; cols: number; rows: number}, exposure: number, opaque: boolean) => {
  const n = list.length;
  const pos = new Float32Array(n * 3), from = new Float32Array(n * 3), col = new Float32Array(n * 3), col0 = new Float32Array(n * 3), t = new Float32Array(n * 4), t2 = new Float32Array(n * 4), t3 = new Float32Array(n * 2);
  list.forEach((p, i) => {
    pos.set(p.pos, i * 3); from.set(p.from, i * 3);
    col.set(hexRGB(p.col), i * 3); col0.set(hexRGB(p.col0 ?? p.col), i * 3);
    t.set([p.birth, p.travel, p.kind, p.seed], i * 4); t2.set([p.die, p.glyph ?? -1, p.foot ?? 0, p.grp], i * 4); t3.set([p.t3 ?? p.birth, 0], i * 2);
  });
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('aFrom', new THREE.BufferAttribute(from, 3));
  g.setAttribute('aCol', new THREE.BufferAttribute(col, 3));
  g.setAttribute('aT', new THREE.BufferAttribute(t, 4));
  g.setAttribute('aT2', new THREE.BufferAttribute(t2, 4));
  g.setAttribute('aCol0', new THREE.BufferAttribute(col0, 3));
  g.setAttribute('aT3', new THREE.BufferAttribute(t3, 2));
  const m = new THREE.ShaderMaterial({
    uniforms: {
      uF: {value: 0}, uExp: {value: exposure}, uCyan: {value: CYAN.map((c) => new THREE.Vector3(...c))}, uMon: {value: new THREE.Vector3(MONITOR.c[0] - 0.02, MONITOR.c[1], MONITOR.c[2])},
      uStream0: {value: 0}, uRimCyan: {value: 0}, uVP: {value: new THREE.Matrix4()}, uV: {value: new THREE.Matrix4()}, uHiRes: {value: 1}, uFocal: {value: 1000}, uWinDots: {value: 1},
      uDeres: {value: new Array(NGRP).fill(0)}, uOpaque: {value: opaque ? 1 : 0},
      tGlyph: {value: glyph.tex}, uGCols: {value: glyph.cols}, uGRows: {value: glyph.rows},
    },
    vertexShader: VS, fragmentShader: FS,
    ...(opaque ? {transparent: false, depthWrite: true, depthTest: true, blending: THREE.NoBlending} : {transparent: true, depthWrite: false, depthTest: true, blending: THREE.AdditiveBlending}),
  });
  const pts = new THREE.Points(g, m);
  pts.frustumCulled = false;
  pts.layers.set(6);
  pts.renderOrder = opaque ? -1 : 5;
  return pts;
};
void TABLE; void project; void END_X;
