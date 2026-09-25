import {rng} from './common';

/**
 * THE AI SKYLINE — "data-center cathedral at dusk".
 * One procedural set that every title style re-renders: a gothic nave + twin spire towers that are
 * really a server campus (antenna-mast spires, rooftop chillers, long server halls with clerestory
 * light strips), cooling towers with steam, and transmission pylons feeding it power.
 * All output is plain SVG path data in screen px (so canvas styles can use Path2D on the same data).
 */
export interface Win {
  x: number;
  y: number;
  w: number;
  h: number;
  /** pointed gothic arch top */
  arch: boolean;
  /** 0..1 brightness */
  lit: number;
  cool: boolean;
  /** window path (arch windows are polygons) */
  d: string;
}
export interface SkylineGeo {
  /** distant hazy layer (halls, cooling towers, monolith GPU towers) */
  far: string;
  /** main silhouette incl. the cathedral */
  mid: string;
  /** thin structures to STROKE (pylons, masts), width ~1.2*u*2 */
  lines: string;
  /** power cables to stroke thinly */
  cables: string;
  windows: Win[];
  rose: {cx: number; cy: number; r: number};
  beacons: {x: number; y: number}[];
  /** cooling tower mouths (for steam plumes) */
  stacks: {x: number; y: number; w: number; far: boolean}[];
  ground: number;
  cx: number;
  u: number;
  /** top of the tallest spire tip (px) */
  top: number;
}

type P = [number, number];
const fmt = (n: number) => (Math.round(n * 10) / 10).toString();
export const polyPath = (pts: P[]): string => {
  let a = 0;
  for (let i = 0; i < pts.length; i++) {
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[(i + 1) % pts.length];
    a += x1 * y2 - x2 * y1;
  }
  const q = a < 0 ? [...pts].reverse() : pts;
  return 'M ' + q.map(([x, y]) => `${fmt(x)} ${fmt(y)}`).join(' L ') + ' Z';
};
const rectPts = (x: number, y: number, w: number, h: number): P[] => [
  [x, y],
  [x + w, y],
  [x + w, y + h],
  [x, y + h],
];
/** Pointed (equilateral) gothic arch window, top-left x,y, width w, total height h. */
export const lancetPts = (x: number, y: number, w: number, h: number, seg = 7): P[] => {
  const ah = w * 0.866;
  const pts: P[] = [[x, y + h]];
  // left arc: centre at right springing point, radius w, from 180deg to 120deg
  for (let i = 0; i <= seg; i++) {
    const a = Math.PI - (i / seg) * (Math.PI / 3);
    pts.push([x + w + Math.cos(a) * w, y + ah - Math.sin(a) * w]);
  }
  for (let i = 1; i <= seg; i++) {
    // right arc: centre at left springing point, from 60deg down to 0deg
    const b = Math.PI / 3 - (i / seg) * (Math.PI / 3);
    pts.push([x + Math.cos(b) * w, y + ah - Math.sin(b) * w]);
  }
  pts.push([x + w, y + h]);
  return pts;
};
const hyperTower = (x: number, gy: number, h: number, bw: number, tw: number, waist: number): P[] => {
  // hyperboloid cooling tower profile: flared base, waist at 76% height, slight flare at the lip
  const n = 16;
  const L: P[] = [];
  const Rr: P[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const hw = t < 0.78 ? waist + (bw / 2 - waist) * (1 - t / 0.78) ** 2.2 : waist + (tw / 2 - waist) * ((t - 0.78) / 0.22) ** 1.6;
    L.push([x - hw, gy - t * h]);
    Rr.push([x + hw, gy - t * h]);
  }
  return [...L, ...Rr.reverse()];
};

export interface SkylineOpts {
  seed?: number;
  width?: number;
  /** ground line in px */
  ground?: number;
  /** cathedral centre x */
  cx?: number;
  /** scale: 1 unit -> u px */
  u?: number;
  /** horizontal extent to fill (defaults to [0,width]) */
  x0?: number;
  x1?: number;
}

export const buildSkyline = (o: SkylineOpts = {}): SkylineGeo => {
  const {seed = 11, width = 1920, ground = 1080, cx = width / 2, u = 0.6} = o;
  const x0 = o.x0 ?? -40;
  const x1 = o.x1 ?? width + 40;
  const r = rng(seed);
  const X = (x: number) => cx + x * u;
  const Y = (y: number) => ground + y * u;
  const mid: string[] = [];
  const far: string[] = [];
  const lines: string[] = [];
  const cables: string[] = [];
  const windows: Win[] = [];
  const beacons: {x: number; y: number}[] = [];
  const stacks: SkylineGeo['stacks'] = [];
  const R = (x: number, y: number, w: number, h: number, into = mid) => into.push(polyPath(rectPts(X(x), Y(y), w * u, h * u)));
  const Poly = (pts: P[], into = mid) => into.push(polyPath(pts.map(([x, y]) => [X(x), Y(y)] as P)));
  const win = (x: number, y: number, w: number, h: number, arch: boolean, lit: number, cool: boolean) => {
    const pts = arch ? lancetPts(X(x), Y(y), w * u, h * u) : rectPts(X(x), Y(y), w * u, h * u);
    windows.push({x: X(x), y: Y(y), w: w * u, h: h * u, arch, lit, cool, d: polyPath(pts)});
  };

  // ---------------- FAR layer: server campus haze ----------------
  {
    let x = (x0 - cx) / u;
    const end = (x1 - cx) / u;
    while (x < end) {
      const w = 90 + r() * 170;
      const h = 60 + r() * 70;
      R(x, -h, w + 2, h, far);
      // rooftop units
      for (let k = 8; k < w - 20; k += 22 + r() * 18) if (r() < 0.55) R(x + k, -h - 10, 14, 10, far);
      x += w;
    }
    // monolith GPU towers (tall slabs, far)
    for (const [mx, mh, mw] of [
      [-980, 330, 70],
      [-900, 260, 46],
      [760, 300, 60],
      [860, 380, 78],
      [-560, 210, 40],
    ] as const) {
      R(mx, -mh, mw, mh, far);
      R(mx + mw / 2 - 2, -mh - 60, 4, 60, far);
      beacons.push({x: X(mx + mw / 2), y: Y(-mh - 60)});
    }
    // cooling towers (far)
    for (const [tx, th] of [
      [-720, 360],
      [-570, 300],
      [650, 340],
    ] as const) {
      Poly(hyperTower(tx, 0, th, 200, 104, 38), far);
      stacks.push({x: X(tx), y: Y(-th), w: 104 * u, far: true});
    }
  }

  // ---------------- MID layer: long server halls ----------------
  const hallSpan = (from: number, to: number, dir: 1 | -1) => {
    let x = from;
    while ((dir > 0 && x < to) || (dir < 0 && x > to)) {
      const w = 140 + r() * 180;
      const h = 110 + r() * 70;
      const left = dir > 0 ? x : x - w;
      R(left - 1, -h, w + 2, h);
      // parapet step
      if (r() < 0.5) R(left + w * 0.2, -h - 14, w * 0.5, 14);
      // rooftop chillers & dishes
      for (let k = 10; k < w - 24; k += 26 + r() * 10) {
        if (r() < 0.7) R(left + k, -h - 16, 18, 16);
        else {
          // satellite dish on a stalk
          R(left + k + 7, -h - 22, 4, 22);
          Poly([
            [left + k - 2, -h - 34],
            [left + k + 22, -h - 22],
            [left + k + 16, -h - 16],
            [left + k - 6, -h - 26],
          ]);
        }
      }
      // exhaust stack
      if (r() < 0.35) {
        const sx = left + 20 + r() * (w - 40);
        const sh = 90 + r() * 90;
        R(sx, -h - sh, 12, sh);
        beacons.push({x: X(sx + 6), y: Y(-h - sh)});
      }
      // clerestory light strip (server racks glowing through slots)
      const wy = -h * (0.42 + r() * 0.12);
      for (let k = 12; k < w - 12; k += 11) if (r() < 0.42) win(left + k, wy, 6, 4, false, 0.35 + r() * 0.5, r() < 0.7);
      if (r() < 0.6) for (let k = 14; k < w - 14; k += 11) if (r() < 0.25) win(left + k, wy + 22, 6, 4, false, 0.25 + r() * 0.4, r() < 0.6);
      x += dir * w;
    }
  };
  hallSpan(330, (x1 - cx) / u + 40, 1);
  hallSpan(-330, (x0 - cx) / u - 40, -1);

  // ---------------- THE CATHEDRAL ----------------
  // aisles with lean-to roofs
  Poly([
    [-335, 0],
    [-335, -200],
    [-215, -262],
    [-215, 0],
  ]);
  Poly([
    [335, 0],
    [335, -200],
    [215, -262],
    [215, 0],
  ]);
  // buttress piers with pinnacles
  for (const s of [-1, 1]) {
    for (const bx of [335, 275]) {
      const x = s * bx;
      R(x - 11, -250 - (bx === 335 ? 20 : 60), 22, 250 + (bx === 335 ? 20 : 60));
      Poly([
        [x - 11, -250 - (bx === 335 ? 20 : 60)],
        [x, -300 - (bx === 335 ? 30 : 75)],
        [x + 11, -250 - (bx === 335 ? 20 : 60)],
      ]);
    }
    // flying buttress arcs (as thin strokes)
    const a0 = X(s * 335);
    const b0 = Y(-240);
    const a1 = X(s * 140);
    const b1 = Y(-330);
    lines.push(`M ${fmt(a0)} ${fmt(b0)} Q ${fmt(X(s * 240))} ${fmt(Y(-320))} ${fmt(a1)} ${fmt(b1)}`);
  }
  // nave + gable
  R(-132, -310, 264, 310);
  Poly([
    [-140, -306],
    [0, -448],
    [140, -306],
  ]);
  // central finial: tapered mast
  Poly([
    [-5, -444],
    [-1.5, -560],
    [1.5, -560],
    [5, -444],
  ]);
  beacons.push({x: X(0), y: Y(-560)});
  // twin towers + spires (antenna-mast spires)
  for (const s of [-1, 1]) {
    const tx = s * 175;
    R(tx - 42, -500, 84, 500);
    // belfry cornice
    R(tx - 48, -506, 96, 14);
    // corner pinnacles
    for (const px of [-42, 42]) Poly([
      [tx + px - 7, -506],
      [tx + px, -560],
      [tx + px + 7, -506],
    ]);
    // spire
    Poly([
      [tx - 36, -506],
      [tx, -800],
      [tx + 36, -506],
    ]);
    // tapered lattice mast on the spire (reads as a mast, never as a cross)
    Poly([
      [tx - 5, -796],
      [tx - 1.5, -900],
      [tx + 1.5, -900],
      [tx + 5, -796],
    ]);
    beacons.push({x: X(tx), y: Y(-900)});
    // tower lancets
    win(tx - 13, -470, 26, 110, true, 0.8, true);
    win(tx - 11, -320, 22, 90, true, 0.6, true);
    win(tx - 9, -180, 18, 70, true, 0.45, false);
  }
  // nave: rose window, lancets, door
  const rose = {cx: X(0), cy: Y(-238), r: 50 * u};
  win(-98, -250, 26, 190, true, 0.9, true);
  win(72, -250, 26, 190, true, 0.9, true);
  win(-34, -128, 68, 128, true, 1, false); // door: warm
  for (const s of [-1, 1]) {
    win(s * 300 - 9, -170, 18, 80, true, 0.5, true);
    win(s * 245 - 9, -190, 18, 95, true, 0.6, true);
  }

  // ---------------- pylons + cables ----------------
  const pylon = (px: number, ph: number) => {
    const b = 26;
    const t = 7;
    const L = (a: P, c: P) => lines.push(`M ${fmt(X(a[0]))} ${fmt(Y(a[1]))} L ${fmt(X(c[0]))} ${fmt(Y(c[1]))}`);
    L([px - b, 0], [px - t, -ph]);
    L([px + b, 0], [px + t, -ph]);
    // lattice
    for (let k = 0; k < 5; k++) {
      const y0 = -(k / 5) * ph;
      const y1 = -((k + 1) / 5) * ph;
      const w0 = b - (b - t) * (k / 5);
      const w1 = b - (b - t) * ((k + 1) / 5);
      L([px - w0, y0], [px + w1, y1]);
      L([px + w0, y0], [px - w1, y1]);
    }
    // crossarms
    L([px - 34, -ph * 0.86], [px + 34, -ph * 0.86]);
    L([px - 26, -ph * 0.97], [px + 26, -ph * 0.97]);
    L([px - t, -ph], [px, -ph - 16]);
    L([px + t, -ph], [px, -ph - 16]);
    return [
      [px - 34, -ph * 0.86],
      [px + 34, -ph * 0.86],
      [px - 26, -ph * 0.97],
      [px + 26, -ph * 0.97],
    ] as P[];
  };
  const pyl: {x: number; arms: P[]}[] = [];
  for (const [px, ph] of [
    [-1400, 230],
    [-1010, 250],
    [-620, 270],
    [620, 270],
    [1010, 250],
    [1400, 230],
  ] as const) {
    if (X(px) < x0 - 200 || X(px) > x1 + 200) continue;
    pyl.push({x: px, arms: pylon(px, ph)});
  }
  const cable = (a: P, b: P, sag: number) => cables.push(`M ${fmt(X(a[0]))} ${fmt(Y(a[1]))} Q ${fmt(X((a[0] + b[0]) / 2))} ${fmt(Y((a[1] + b[1]) / 2 + sag))} ${fmt(X(b[0]))} ${fmt(Y(b[1]))}`);
  for (let i = 0; i < pyl.length - 1; i++) {
    const A = pyl[i];
    const B = pyl[i + 1];
    if (Math.sign(A.x) !== Math.sign(B.x)) continue;
    for (let k = 0; k < 4; k++) cable(A.arms[k], B.arms[k], 38);
  }
  // cables feeding the cathedral towers
  for (const A of pyl) {
    if (Math.abs(A.x) !== 620) continue;
    const s = Math.sign(A.x);
    for (let k = 0; k < 4; k++) cable(A.arms[k], [s * (217 + k * 2), -440 + k * 16], 40);
  }

  return {far: far.join(' '), mid: mid.join(' '), lines: lines.join(' '), cables: cables.join(' '), windows, rose, beacons, stacks, ground, cx, u, top: Y(-900)};
};
