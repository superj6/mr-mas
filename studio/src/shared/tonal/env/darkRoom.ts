/**
 * COLD-OPEN SET: Mas's room at night, as a TONAL MODEL (flat light/shadow planes, see ../types.ts),
 * so it renders in every tonal style (paint, soft, noir, riso, engrave, glyph, pixel, dither).
 *
 * Frame: 1920x1080 local units, box [0,0,1920,1080]. Mas sits in the LEFT THIRD (bust ~x250-900,
 * y250-1080): that area is background only. Light logic: ONE key light = the monitor screen, which
 * faces left toward Mas (we see the monitor's back, 3/4). Everything else is deep shadow, plus a faint
 * city fill through the blinds and pin-point LEDs on the server rack.
 *
 * Wall art (halo, window) is designed in FRAME coordinates and pushed onto the wall plane; hard-surface
 * props (monitor, desk, keyboard, glass, rack) are built in centimetre world space and projected through
 * a pinhole camera (./geo.ts). So `camX/camY/zoom` give real parallax for camera moves.
 */
import type {ToneModel, TP, Tone} from '../types';
import type {EnvTP} from './geo';
import {Cam, V2, V3, makeCam, project, place, poly, polyline, smooth, circle, roundRectPts, lerp, lerp2, hash01, clamp01} from './geo';

export interface DarkRoomParams {
  /** Camera offset in cm (parallax) and zoom (1 = the lookdev framing). */
  camX?: number;
  camY?: number;
  zoom?: number;
  /** Monitor brightness 0..1: the posterized light pools grow/shrink with it (animate for flicker). */
  glow?: number;
  /** Time in seconds (LED blink pattern). Deterministic. */
  t?: number;
  /** false = screen off beat: no halo, no pools, no rim (only LEDs + city). */
  screenOn?: boolean;
}

export const ROOM_HUES: Record<string, string> = {
  void: '#0B0D13',
  wall: '#232937',
  wallLit: '#2A4755',
  wallLit2: '#3E6A78',
  wallHot: '#2F6070',
  sideWall: '#1C212C',
  print: '#2A2F3B',
  sheen: '#4A5468',
  trim: '#262B38',
  slat: '#2C3140',
  slatLip: '#5A6078',
  city: '#7A6670',
  cityLit: '#5C4C54',
  cityHot: '#6A524D',
  rack: '#1B1F28',
  rackFace: '#2A303D',
  rackMetal: '#5F6979',
  led: '#3FE6FF',
  ledG: '#4DFF9A',
  ledA: '#FFB347',
  desk: '#302C2C',
  deskLit: '#3B606B',
  deskHot: '#7FD0DA',
  plastic: '#2A2D34',
  plasticLit: '#56707C',
  cable: '#131419',
  key: '#363B47',
  keyLit: '#5E8490',
  glass: '#2C3E4A',
  water: '#3F7C8C',
  waterHot: '#8FD6E0',
};

/** Engraving hatch direction per surface (walls horizontal, hard-surface props follow their planes). */
const HATCH: Record<string, number> = {
  void: 90, wall: 90, wallLit: 90, wallLit2: 90, wallHot: 90, sideWall: 62, trim: 0, slat: 0, slatLip: 0, city: 0, cityLit: 0, cityHot: 0, print: 45, sheen: 45,
  rack: 0, rackFace: 0, rackMetal: 90, desk: 3, deskLit: 3, deskHot: 3, plastic: 58, plasticLit: 8, cable: 30, key: -22, keyLit: -22,
  glass: 90, water: 90, waterHot: 90,
};

export const WALL_Z = 280;
const DESK_Y = 34;

/** Where the monitor lives in world space (exported so close-ups/insert shots can match). */
export const MONITOR = {o: [47, 2, 127] as V3, yaw: 140, w: 62, h: 36.5};

type XY = [number, number];

export const darkRoom = (p: DarkRoomParams = {}): ToneModel => {
  const {camX = 0, camY = 0, zoom = 1, glow = 1, t = 0, screenOn = true} = p;
  const cam: Cam = makeCam(camX, camY, zoom);
  const P = (v: V3) => project(cam, v);
  const T: TP[] = [];
  const add = (hue: string, tone: Tone, d: string, extra: Partial<EnvTP> = {}) => T.push({hue, tone, d, angle: HATCH[hue], ...extra} as TP);
  const g = screenOn ? clamp01(glow) : 0;
  const lw = (w: number) => w * zoom;

  /** frame-space point (as seen by the reference camera) pushed onto a plane at depth z */
  const F = (x: number, y: number, z = WALL_Z): V2 => P([((x - 960) * z) / 1500, ((y - 520) * z) / 1500, z]);
  const Fpoly = (pts: XY[], z = WALL_Z) => poly(pts.map(([x, y]) => F(x, y, z)));
  const Fsmooth = (pts: XY[], z = WALL_Z) => smooth(pts.map(([x, y]) => F(x, y, z)));
  const Frect = (x0: number, y0: number, x1: number, y1: number, z = WALL_Z) => Fpoly([[x0, y0], [x1, y0], [x1, y1], [x0, y1]], z);
  const grow = (pts: XY[], ax: number, ay: number, s: number): XY[] => pts.map(([x, y]) => [ax + (x - ax) * s, ay + (y - ay) * s]);

  // =============== BACK WALL / CEILING / CORNER ===============
  add('void', 0, 'M -300 -300 H 2220 V 1380 H -300 Z', {bg: true});
  add('void', 0, Frect(-300, -300, 2300, 30));
  const hk = 0.6 + 0.4 * g;
  const ellPts = (cx: number, cy: number, rx: number, ry: number, grow2 = 1) =>
    Array.from({length: 16}, (_, i) => {
      const a = (i / 16) * Math.PI * 2;
      return F(cx + Math.cos(a) * rx * hk * grow2, cy + Math.sin(a) * ry * hk * grow2);
    });
  const wallPts: V2[] = [F(-300, 30), F(1838, 30), F(1838, 760), F(-300, 760)];
  add('wall', 1, poly(wallPts), {bg: true, readTone: 0});
  // side wall beyond the corner (right), unlit
  add('sideWall', 0, Fpoly([[1838, 30], [2300, -80], [2300, 900], [1838, 760]]), {bg: true});
  // crown line under the ceiling
  add('sheen', 1, Frect(-300, 30, 1838, 34), {soft: 2, bg: true});
  // framed print (an exponential curve, framed like art), barely there in the dark
  add('void', 0, Frect(70, 170, 262, 430));
  add('print', 1, Frect(84, 184, 248, 416));
  add('sheen', 1, polyline([F(98, 398), F(150, 394), F(190, 384), F(214, 364), F(228, 330), F(236, 280), F(240, 206)]), {line: lw(2.4)});
  add('sheen', 1, Fpoly([[84, 290], [152, 184], [168, 184], [84, 318]]), {soft: 3, readTone: 2});

  // monitor halo on the wall: simple, low-contrast falloff centred on the (hidden) screen
  if (g > 0.02) {
    const E = (cx: number, cy: number, rx: number, ry: number) => smooth(ellPts(cx, cy, rx, ry));
    add('wallLit', 1, E(1340, 560, 470, 400), {soft: 80, bg: true, readTone: 0});
    add('wallLit', 2, E(1318, 555, 205, 290), {soft: 34, bg: true});
    if (g > 0.35) add('wallHot', 3, E(1312, 540, 96, 262), {soft: 18, bg: true});
  }
  // contact shadow where the desk meets the wall
  add('void', 0, Frect(-300, 686, 2300, 706), {soft: 8, bg: true});

  // =============== WINDOW + BLINDS (faint city light) ===============
  const wx0 = 300;
  const wx1 = 920;
  const wy0 = 120;
  const wy1 = 520;
  add('trim', 1, Frect(wx0 - 9, wy0 - 8, wx1 + 9, wy1 + 8));
  add('city', 1, Frect(wx0, wy0, wx1, wy1), {readTone: 2});
  // a street lamp / lit tower somewhere behind: a vertical column of warmer light (behind Mas's head)
  add('cityLit', 2, Fpoly([[470, wy0], [610, wy0], [640, 260], [668, wy1], [440, wy1], [462, 330]]), {soft: 20, readTone: 3});
  add('cityHot', 2, Fpoly([[540, wy0], [575, wy0], [590, 300], [600, wy1], [528, wy1], [534, 280]]), {soft: 10, readTone: 3});
  const nSl = 16;
  const pitch = (wy1 - wy0) / nSl;
  for (let i = 0; i < nSl; i++) {
    const y = wy0 + i * pitch;
    const gap = pitch * 0.27;
    const bent = i === 7 || i === 8;
    if (bent) {
      // someone peeked: two slats bent down in a V -> a wedge of city light
      const b0 = 318;
      const b1 = 404;
      const dip = i === 7 ? 12 : 7;
      add('slat', 1, Fpoly([[wx0, y + gap], [b0, y + gap], [(b0 + b1) / 2, y + gap + dip], [b1, y + gap], [wx1, y + gap], [wx1, y + pitch], [b1, y + pitch], [(b0 + b1) / 2, y + pitch + dip * 0.55], [b0, y + pitch], [wx0, y + pitch]]));
    } else add('slat', 1, Frect(wx0, y + gap, wx1, y + pitch));
    // lower lip of each slat catches a little city light
    add('slatLip', 1, Frect(wx0, y + pitch - 2.2, wx1, y + pitch));
  }
  [370, 850].forEach((x) => add('void', 0, polyline([F(x, wy0), F(x, wy1)]), {line: lw(2)}));
  add('trim', 1, Frect(wx0 - 14, wy0 - 22, wx1 + 14, wy0 - 4));
  add('trim', 2, Frect(wx0 - 14, wy0 - 8, wx1 + 14, wy0 - 4));
  add('trim', 2, polyline([F(wx1 - 8, wy0 - 6), F(wx1 - 10, 650)]), {line: lw(2)});
  add('trim', 2, Fsmooth([[wx1 - 10, 648], [wx1 - 5, 660], [wx1 - 10, 676], [wx1 - 15, 660]]));
  add('trim', 2, Frect(wx0 - 20, wy1 + 6, wx1 + 20, wy1 + 14));
  add('void', 0, Frect(wx0 - 16, wy1 + 14, wx1 + 16, wy1 + 20));

  // =============== SERVER RACK (back right, mostly behind the monitor) ===============
  const rz = 250;
  const rx0 = 84;
  const rx1 = 142;
  const ry0 = -120;
  const ry1 = 36;
  const R = (X: number, Y: number) => P([X, Y, rz]);
  const Rpoly = (pts: [number, number][]) => poly(pts.map(([X, Y]) => R(X, Y)));
  add('rack', 0, Rpoly([[rx0 - 2, ry0], [rx1 + 2, ry0], [rx1 + 2, ry1], [rx0 - 2, ry1]]));
  add('rackMetal', 1, Rpoly([[rx0 - 2, ry0], [rx0 + 1, ry0], [rx0 + 1, ry1], [rx0 - 2, ry1]]));
  let uy = ry0 + 8;
  let unit = 0;
  const U = 4.45;
  const pattern = [1, 2, 1, 1, 4, 2, 1, 2, 1, 1, 2, 3, 1, 2, 1, 1, 2, 1, 4, 1, 2, 1];
  while (uy < ry1 - 4 && unit < pattern.length) {
    const h = pattern[unit] * U - 0.5;
    const ux0 = rx0 + 3;
    const ux1 = rx1 - 3;
    if (hash01(unit * 31 + 7) > 0.12) {
      add('rackFace', 1, Rpoly([[ux0, uy], [ux1, uy], [ux1, uy + h], [ux0, uy + h]]));
      add('rackFace', 2, Rpoly([[ux0, uy], [ux1, uy], [ux1, uy + 0.45], [ux0, uy + 0.45]]));
      if (pattern[unit] >= 2) {
        const bays = pattern[unit] === 4 ? 12 : 8;
        for (let b = 0; b < bays; b++) {
          const bx = lerp(ux0 + 12, ux1 - 3, b / bays);
          const bw = (ux1 - ux0 - 15) / bays - 0.7;
          add('rack', 0, Rpoly([[bx, uy + 1], [bx + bw, uy + 1], [bx + bw, uy + h - 1], [bx, uy + h - 1]]));
        }
      } else add('rack', 0, Rpoly([[ux0 + 14, uy + h * 0.35], [ux1 - 4, uy + h * 0.35], [ux1 - 4, uy + h * 0.65], [ux0 + 14, uy + h * 0.65]]));
      const nL = pattern[unit] >= 2 ? 4 : 2 + Math.floor(hash01(unit * 13) * 3);
      for (let l = 0; l < nL; l++) {
        const id = unit * 10 + l;
        const rate = 1.5 + hash01(id * 3 + 1) * 9;
        const on = hash01(id * 7 + Math.floor(t * rate) * 101) > (l === 0 ? 0.08 : 0.42);
        const kind = hash01(id * 5 + 2);
        const hue = kind < 0.6 ? 'led' : kind < 0.85 ? 'ledG' : 'ledA';
        const [x, y] = R(ux0 + 2.2 + l * 2.1, uy + (pattern[unit] >= 2 ? 1.6 : h / 2));
        if (on) add(hue, 4, circle(x, y, lw(3.4)), {light: hue === 'led'});
        else add('rack', 1, circle(x, y, lw(2.6)));
      }
      if (pattern[unit] >= 2) {
        const bays = pattern[unit] === 4 ? 12 : 8;
        for (let b = 0; b < bays; b++) {
          const id = unit * 100 + b;
          if (hash01(id * 11 + Math.floor(t * (4 + hash01(id) * 14)) * 7) <= 0.55) continue;
          const bx = lerp(ux0 + 12, ux1 - 3, b / bays) + 0.8;
          const [x, y] = R(bx, uy + h - 2);
          add(b % 3 === 0 ? 'ledA' : 'led', 4, circle(x, y, lw(2.5)), {light: b % 3 !== 0});
        }
      }
    }
    uy += h + 0.5;
    unit++;
  }

  // =============== DESK ===============
  // desk top: back edge at the wall, front edge rising toward Mas (leads the eye left)
  const dz = (X: number) => 118 - (X + 60) * 0.145;
  const D = (X: number, Z: number, Y = DESK_Y) => P([X, Y, Z]);
  const deskPts: V2[] = [D(-400, WALL_Z - 2), D(400, WALL_Z - 2), D(400, dz(400)), D(-400, dz(-400))];
  add('desk', 1, poly(deskPts), {bg: true});
  add('desk', 0, poly([D(-400, WALL_Z - 2), D(400, WALL_Z - 2), D(400, 246), D(-400, 246)]), {soft: 10, bg: true});

  const {o: mo, yaw: myaw, w: mw, h: mh} = MONITOR;
  const M = (x: number, y: number, z: number) => P(place([x, y, z], myaw, mo));
  const MW = (x: number, y: number, z: number) => place([x, y, z], myaw, mo);
  const ya = (myaw * Math.PI) / 180;
  const nrm: V2 = [-Math.sin(ya), -Math.cos(ya)]; // screen normal in XZ
  const tan: V2 = [Math.cos(ya), -Math.sin(ya)]; // monitor local +x in XZ (toward the near end)

  // light pool thrown on the desk in front of the screen: widens and dims with distance
  if (g > 0.02) {
    const c = MW(0, 0, -2);
    const poolPts = (reach: number, near: number, spread: number, back: number, wob: number, grow2 = 1) => {
      const pts: XY[] = [];
      const add2 = (u: number, v: number) => pts.push([c[0] + tan[0] * u + nrm[0] * v, c[2] + tan[1] * u + nrm[1] * v]);
      add2(near, -back);
      add2(near * 1.08 + spread * 0.45, reach * (0.5 + wob));
      add2(near * 0.75 + spread, reach * 0.95);
      add2(near * 0.1 + spread * 0.3, reach * (1.1 - wob));
      add2(-near * 0.6 - spread, reach * 0.96);
      add2(-near * 1.04 - spread * 0.4, reach * (0.45 + wob));
      add2(-near, -back);
      const cxz = pts.reduce((acc, [X, Z]) => [acc[0] + X / pts.length, acc[1] + Z / pts.length], [0, 0]);
      return pts.map(([X, Z]) => D(cxz[0] + (X - cxz[0]) * grow2, cxz[1] + (Z - cxz[1]) * grow2));
    };
    const pool = (reach: number, near: number, spread: number, back: number, wob: number) => smooth(poolPts(reach, near, spread, back, wob));
    const s = 0.65 + 0.35 * g;
    add('deskLit', 1, pool(112 * s, 36, 40, 5, 0.03), {soft: 34, bg: true});
    add('deskLit', 2, pool(64 * s, 33, 20, 4, -0.02), {soft: 20, bg: true});
    add('deskLit', 3, pool(32 * s, 30, 6, 2, 0.03), {soft: 12, bg: true});
    if (g > 0.4) add('deskHot', 4, pool(12 * s, 24, 0, 0, 0), {light: true, soft: 6, bg: true});
  }

  // front edge: dark face + under-desk void + a lip highlight only where the screen reaches
  const edge = (X: number, dy = 0) => P([X, DESK_Y + dy, dz(X)]);
  const xs = [-400, -200, -60, 20, 100, 200, 400];
  add('void', 0, poly([...xs.map((X) => edge(X, 0)), [2400, 1400], [-400, 1400]]));
  add('desk', 1, poly([...xs.map((X) => edge(X, 0)), ...xs.slice().reverse().map((X) => edge(X, 3.2))]));
  if (g > 0.02) {
    add('deskLit', 2, poly([edge(0, 0), edge(44, 0), edge(44, 0.7), edge(0, 0.7)]), {soft: 3});
    add('deskLit', 3, poly([edge(16, 0), edge(34, 0), edge(34, 0.5), edge(16, 0.5)]), {soft: 2});
  }

  // =============== MONITOR FOOT (on the desk; front lit by the screen) ===============
  const hw = mw / 2;
  const hh = mh / 2;
  const footY = DESK_Y - mo[1];
  const plate = (inset: number, z0: number, z1: number, y: number) => roundRectPts(26 - inset * 2, z1 - z0, 5, 4).map(([x, z]) => M(x, y, (z0 + z1) / 2 + z));
  add('plastic', 0, poly(plate(0, -10, 14, footY)), {soft: 1});
  add('plastic', 1, poly(plate(0.3, -9.8, 13.8, footY - 1.1)));
  if (g > 0.02) {
    add('plasticLit', 2, poly(roundRectPts(24.4, 11, 4.5, 4).map(([x, z]) => M(x, footY - 1.12, -4.2 + z))), {soft: 3});
    add('plasticLit', 3, polyline(roundRectPts(25.4, 23.4, 5, 4).filter(([, z]) => z < -9).map(([x, z]) => M(x, footY - 1.1, 2 + z))), {line: lw(1.6)});
  }

  // =============== DISPLAY CABLE (behind the monitor, runs back to the rack) ===============
  add('cable', 0, smooth([M(-2, 11, 6), M(-3, footY - 6, 13), D(74, 150), D(98, 196), D(112, 246), D(118, 268)], false), {line: lw(8)});

  // =============== MONITOR (3/4 back view, screen faces Mas) ===============
  add('plastic', 0, poly(roundRectPts(mw, mh, 1.4, 4).map(([x, y]) => M(x, y, 1.5))));
  add('plastic', 1, poly([M(hw, -hh + 1.2, 0), M(hw, hh - 1.2, 0), M(hw, hh - 1.2, 1.5), M(hw, -hh + 1.2, 1.5)]));
  // bounce from the lit desk creeps up the lower back panel (form, and separates it from the stand)
  if (g > 0.02) add('plastic', 1, poly([...roundRectPts(mw - 1, 7, 1.2, 3).map(([x, y]) => M(x, y + hh - 4, 1.52))]), {soft: 10});
  add('plastic', 1, polyline([M(hw - 1.5, -hh + 0.3, 1.52), M(-hw + 1.5, -hh + 0.3, 1.52)]), {line: lw(1.2)});
  // back housing bulge: one clean shape + a catch-light on its near edge
  add('plastic', 0, poly(roundRectPts(42, 22, 4, 4).map(([x, y]) => M(x, y + 1.5, 3.8))));
  add('plastic', 1, polyline(roundRectPts(42, 22, 4, 4).filter(([x]) => x > 14).map(([x, y]) => M(x, y + 1.5, 3.8))), {line: lw(1.6)});
  for (let i = 0; i < 6; i++) {
    const y = -6.5 + i * 1.1;
    add('plastic', 1, polyline([M(-15, y, 3.85), M(4, y, 3.85)]), {line: lw(1.1)});
  }
  // stand: one column from the housing down to the foot (back face + near side face)
  add('plastic', 1, poly([M(3.8, -3, 3.8), M(3.8, footY - 1.2, 3.8), M(3.8, footY - 1.2, 8.2), M(3.8, -3, 7.2)]));
  add('plastic', 0, poly([M(-3.8, -3, 7.2), M(3.8, -3, 7.2), M(3.8, footY - 1.2, 8.2), M(-3.8, footY - 1.2, 8.2)]));
  add('plastic', 2, polyline([M(3.8, -2.5, 7.2), M(3.8, footY - 1.4, 8.2)]), {line: lw(1.2)});
  add('void', 0, poly(Array.from({length: 16}, (_, i) => {
    const a = (i / 16) * Math.PI * 2;
    return M(Math.cos(a) * 2, 17 + Math.sin(a) * 3.2, 7.95);
  })));
  const [lx, ly] = M(19.5, 9.5, 3.9);
  add('ledA', 4, circle(lx, ly, lw(2.2)));
  // RIM LIGHT: screen glow wrapping the bezel's near + top + bottom edges (on the silhouette)
  if (g > 0.02) {
    add('led', 4, polyline([M(hw + 0.05, -hh + 1.4, 0.4), M(hw + 0.05, hh - 1.4, 0.4)]), {line: lw(3.4), light: true});
    add('led', 4, polyline([M(hw - 1.2, -hh - 0.05, 1.2), M(-hw * 0.2, -hh - 0.05, 1.2)]), {line: lw(2.2), light: true});
    add('led', 4, polyline([M(hw - 1.2, hh + 0.05, 1.2), M(hw * 0.25, hh + 0.05, 1.2)]), {line: lw(1.6), light: true});
  }

  // =============== POWER CABLE (from the foot, over the front edge, droops out of frame) ===============
  const pc0 = M(-8, footY - 0.6, 12);
  const pc1 = D(58, 124);
  const pc2 = edge(56, -0.2);
  const pc3: V2 = [pc2[0] + 14, pc2[1] + 50];
  const pc4: V2 = [pc2[0] + 10, 1140];
  add('cable', 0, smooth([pc0, pc1, pc2, pc3, pc4], false), {line: lw(9)});
  add('plasticLit', 2, smooth([lerp2(pc0, pc1, 0.5), pc1, lerp2(pc1, pc2, 0.9)], false), {line: lw(1.8)});

  // =============== KEYBOARD (on the desk, angled toward the screen) ===============
  const kyaw = 150;
  const ko: V3 = [14, DESK_Y, 122];
  const K = (x: number, y: number, z: number) => P(place([x, y, z], kyaw, ko));
  const kw = 21;
  const kd = 6.8;
  add('desk', 1, poly([K(-kw, 0, -kd), K(kw, 0, -kd), K(kw + 1.4, 0, -kd - 3.6), K(-kw - 1.4, 0, -kd - 3.6)]), {soft: 4});
  add('key', 0, poly([K(-kw, 0, -kd), K(kw, 0, -kd), K(kw, -0.9, -kd), K(-kw, -0.9, -kd)]));
  add('key', 0, poly([K(kw, 0, -kd), K(kw, 0, kd), K(kw, -1.6, kd), K(kw, -0.9, -kd)]));
  add('key', 0, poly([K(-kw, -0.9, -kd), K(kw, -0.9, -kd), K(kw, -1.6, kd), K(-kw, -1.6, kd)]));
  add('keyLit', 3, polyline([K(-kw + 0.4, -1.6, kd), K(kw - 0.4, -1.6, kd)]), {line: lw(1.6)});
  const rows = [
    {n: 14, h: 1.5, z: 5.0},
    {n: 14, h: 1.5, z: 2.95},
    {n: 13, h: 1.5, z: 0.9},
    {n: 12, h: 1.5, z: -1.15},
    {n: 11, h: 1.5, z: -3.2},
  ];
  const kxy = (x: number, z: number) => K(x, lerp(-0.9, -1.6, (z + kd) / (2 * kd)) - 0.45, z);
  rows.forEach((row, ri) => {
    const x0 = -kw + 1.2;
    const x1 = kw - 1.2;
    const kwid = (x1 - x0) / row.n;
    for (let k = 0; k < row.n; k++) {
      const a = x0 + k * kwid + 0.22;
      const b = x0 + (k + 1) * kwid - 0.22;
      const lit: Tone = g > 0.02 ? (ri <= 1 ? 3 : 2) : 1;
      add(lit >= 3 ? 'keyLit' : 'key', lit, poly([kxy(a, row.z - row.h / 2), kxy(b, row.z - row.h / 2), kxy(b, row.z + row.h / 2), kxy(a, row.z + row.h / 2)]));
    }
    if (g > 0.02 && ri === 0) add('keyLit', 4, polyline([kxy(x0, row.z + row.h / 2), kxy(x1, row.z + row.h / 2)]), {line: lw(1.2), light: true});
  });
  const sz = -5.3;
  const spTone: Tone = g > 0.02 ? 2 : 1;
  add('key', spTone, poly([kxy(-7, sz - 0.75), kxy(8, sz - 0.75), kxy(8, sz + 0.75), kxy(-7, sz + 0.75)]));
  [-kw + 1.4, -kw + 4.4, 9, 12, 15, 18].forEach((x) => add('key', spTone, poly([kxy(x, sz - 0.75), kxy(x + 2.6, sz - 0.75), kxy(x + 2.6, sz + 0.75), kxy(x, sz + 0.75)])));

  // =============== GLASS OF WATER (the cup that never ripples) ===============
  glassOfWater(add, P, MW(0, 0, 0), g, zoom);

  return {paths: T, hues: ROOM_HUES, box: [0, 0, 1920, 1080]};
};

/** The glass: tumbler on the desk, lit from the screen side, flat mirror water surface + caustic. */
const glassOfWater = (add: (hue: string, tone: Tone, d: string, extra?: Partial<EnvTP>) => void, P: (v: V3) => V2, screenC: V3, g: number, zoom: number) => {
  const G: V3 = [-1, DESK_Y, 156];
  const gH = 12;
  const gR0 = 3.3;
  const gR1 = 3.9;
  const wl = 7.2;
  const lw = (w: number) => w * zoom;
  const rOf = (yUp: number) => lerp(gR0, gR1, yUp / gH);
  const ring = (yUp: number, r: number, a0 = 0, a1 = Math.PI * 2, n = 28) => Array.from({length: n + 1}, (_, i) => {
    const a = a0 + ((a1 - a0) * i) / n;
    return P([G[0] + Math.cos(a) * r, G[1] - yUp, G[2] + Math.sin(a) * r]);
  });
  const D = (X: number, Z: number) => P([X, DESK_Y, Z]);
  // light direction on the desk plane (screen centre -> glass)
  const dx = G[0] - screenC[0];
  const dzz = G[2] - screenC[2];
  const l = Math.hypot(dx, dzz);
  const ld: V2 = [dx / l, dzz / l];
  const pp: V2 = [-ld[1], ld[0]];
  const at = (u: number, v: number) => D(G[0] + ld[0] * u + pp[0] * v, G[2] + ld[1] * u + pp[1] * v);
  const shLen = 24;
  if (g > 0.02) {
    add('desk', 1, smooth([at(0, gR0), at(shLen * 0.5, gR0 * 1.2), at(shLen, gR0 * 0.9), at(shLen + 3, 0), at(shLen, -gR0 * 0.9), at(shLen * 0.5, -gR0 * 1.2), at(0, -gR0)]), {soft: 3});
    // caustic: water focuses the screen light into a bright crescent inside the shadow
    add('waterHot', 3, smooth([at(shLen * 0.3, 1.8), at(shLen * 0.5, 2.6), at(shLen * 0.68, 1.4), at(shLen * 0.62, 0), at(shLen * 0.68, -1.4), at(shLen * 0.5, -2.6), at(shLen * 0.3, -1.8), at(shLen * 0.4, 0)]), {soft: 3});
    add('waterHot', 4, smooth([at(shLen * 0.42, 1.1), at(shLen * 0.53, 1.6), at(shLen * 0.6, 0.6), at(shLen * 0.56, 0), at(shLen * 0.6, -0.6), at(shLen * 0.53, -1.6), at(shLen * 0.42, -1.1), at(shLen * 0.48, 0)]), {light: true, soft: 2});
  }
  // silhouette = front half of the base ellipse + back half of the rim ellipse
  const body = (y0: number, y1: number, inset = 0) => poly([...ring(y0, rOf(y0) - inset, Math.PI, Math.PI * 2, 16), ...ring(y1, rOf(y1) - inset, 0, Math.PI, 16)]);
  // vertical band on the front surface between angular fractions u0..u1 (0 = left edge, 1 = right edge)
  const band = (y0: number, y1: number, u0: number, u1: number) => {
    const A = (u: number) => Math.PI - u * Math.PI;
    const lo = Array.from({length: 9}, (_, i) => {
      const a = A(lerp(u0, u1, i / 8));
      return P([G[0] + Math.cos(a) * rOf(y0), G[1] - y0, G[2] - Math.sin(a) * rOf(y0)]);
    });
    const hi = Array.from({length: 9}, (_, i) => {
      const a = A(lerp(u1, u0, i / 8));
      return P([G[0] + Math.cos(a) * rOf(y1), G[1] - y1, G[2] - Math.sin(a) * rOf(y1)]);
    });
    return poly([...lo, ...hi]);
  };
  const lit = g > 0.02;
  add('glass', 1, body(0, gH));
  add('water', lit ? 2 : 1, body(0.4, wl, 0.15));
  if (lit) add('water', 3, band(0.9, wl - 0.5, 0.52, 0.96));
  add('glass', 0, band(0.9, wl - 0.5, 0.0, 0.12));
  add('glass', 0, band(wl + 0.3, gH - 0.3, 0.0, 0.08));
  // water surface: perfectly flat, perfectly still (the gag) — a crisp mirror ellipse
  add('water', lit ? 3 : 2, poly(ring(wl, rOf(wl) - 0.12)));
  if (lit) add('waterHot', 4, polyline(ring(wl, rOf(wl) - 0.12, Math.PI + 0.1, Math.PI * 2 - 0.1, 18)), {line: lw(2.2), light: true});
  // thick base + reflections of the screen on the side facing it
  add('glass', lit ? 3 : 2, band(0, 1.0, 0.04, 0.96));
  if (lit) {
    add('waterHot', 4, band(0.7, gH - 0.5, 0.72, 0.8), {light: true});
    add('waterHot', 3, band(1.2, gH - 1.2, 0.9, 0.94));
  }
  // rim: back lip thin, front lip brighter, hot kiss where it faces the screen
  add('glass', 2, polyline(ring(gH, rOf(gH), 0, Math.PI, 14)), {line: lw(1.6)});
  add(lit ? 'waterHot' : 'glass', lit ? 3 : 2, polyline(ring(gH, rOf(gH), Math.PI, Math.PI * 2, 14)), {line: lw(2.2)});
  if (lit) add('waterHot', 4, polyline(ring(gH, rOf(gH), Math.PI * 2 - 1.2, Math.PI * 2 - 0.2, 6)), {line: lw(2.6), light: true});
};

export {monitorScreen} from './monitorScreen';
