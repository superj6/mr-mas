import type {ToneModel, TP, Tone} from './types';
import {ellipse} from '../draw/geom';

/**
 * NOLE: tonal bust, three-quarter view facing screen-right, key light from screen-right (the monitor),
 * secondary cool light from the phone screen at chest height. Same local units as MAS MANALT, but he is
 * bigger: shoulders ~1.25x Mas, head ~1.08x. Crown (skull) y-256, hair top y-322, eye line y-24,
 * chin y216, bust crop y560. Caricature lives in 2 features only: the square, forward chin/jaw and the
 * swept-back hair volume; the prop is the phone. Pivot for head tilt: (10, 200).
 */
export interface NoleToneParams {
  /** Pupil offset -1..1 (x>0 = toward screen-right / the monitor, x<0 = toward camera-left). */
  lookX?: number;
  /** Pupil offset -1..1 (y>0 = down, e.g. at the phone). */
  lookY?: number;
  /** Upper lid 0 open .. 1 closed. Default is slightly hooded (0.22). */
  lid?: number;
  /** Mouth shape. 'smirk' = closed, near corner up; 'grin' = toothy; 'open' = talking. */
  mouth?: 'rest' | 'smirk' | 'grin' | 'open';
  /** Brow lift -1..1 (negative = frown/concentration). */
  brow?: number;
  /** Head tilt degrees (around the neck). */
  tilt?: number;
  /** Show the phone + hand (default true). */
  phone?: boolean;
  /** Raise the phone + hand by this many units (0 = chest height). */
  phoneLift?: number;
  /** Faded red-planet screen print on the tee (default false; reads best in close-ups). */
  print?: boolean;
}

export const NOLE_HUES = {
  skin: '#D9A58C',
  stubble: '#C29482',
  neck: '#CB977F',
  hand: '#D3A088',
  lip: '#B5766B',
  hair: '#30251F',
  brow: '#271E19',
  eye: '#E9E2D8',
  iris: '#5F7A8E',
  pupil: '#0D0F12',
  lash: '#17110F',
  teeth: '#EDE7DB',
  mouth: '#3A1717',
  shirt: '#2C2E35',
  phone: '#1D1F25',
  screen: '#A8F6FF',
  ui: '#5CCFE4',
  print: '#8C4636',
};

// ---------------------------------------------------------------- path helpers
type Pt = readonly [number, number] | readonly [number, number, number];
const f = (v: number) => (Math.round(v * 10) / 10).toString();

/** Smooth closed/open path through points (Catmull-Rom -> cubic). A 3rd value of 1 marks a hard corner. */
const sp = (pts: Pt[], closed = true): string => {
  const n = pts.length;
  const at = (i: number): Pt => (closed ? pts[((i % n) + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  let d = `M ${f(pts[0][0])} ${f(pts[0][1])}`;
  const segs = closed ? n : n - 1;
  for (let i = 0; i < segs; i++) {
    const p0 = at(i - 1);
    const p1 = at(i);
    const p2 = at(i + 1);
    const p3 = at(i + 2);
    const c1 = p1[2] ? [p1[0] + (p2[0] - p1[0]) / 3, p1[1] + (p2[1] - p1[1]) / 3] : [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = p2[2] ? [p2[0] - (p2[0] - p1[0]) / 3, p2[1] - (p2[1] - p1[1]) / 3] : [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C ${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`;
  }
  return closed ? d + ' Z' : d;
};
/** Straight polygon. */
const pl = (pts: Pt[]) => 'M ' + pts.map((p) => `${f(p[0])} ${f(p[1])}`).join(' L ') + ' Z';
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const smooth = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

export const noleTone = (p: NoleToneParams = {}): ToneModel => {
  const {lookX = 0.3, lookY = 0.05, lid = 0.22, mouth = 'rest', brow = 0, tilt = 0, phone = true, phoneLift = 0, print = false} = p;
  const T: TP[] = [];
  const add = (x: TP) => T.push(x);
  const head = `rotate(${tilt} 10 200)`;
  const H = (x: TP) => add({...x, transform: head});
  const S = (hue: string, tone: Tone, pts: Pt[], extra: Partial<TP> = {}) => H({hue, tone, d: sp(pts), ...extra});

  // jaw drop: rotate lower-face points about the hinge (below the ear), weighted by height
  const jd = mouth === 'open' ? 13 : mouth === 'grin' ? 5 : 0;
  const J = (pts: Pt[]): Pt[] =>
    pts.map((q) => {
      const w = smooth(112, 165, q[1]);
      const th = (jd / 235) * w;
      const hx = -70;
      const hy = 10;
      const dx = q[0] - hx;
      const dy = q[1] - hy;
      const x = hx + dx * Math.cos(th) - dy * Math.sin(th);
      const y = hy + dx * Math.sin(th) + dy * Math.cos(th);
      return q[2] ? ([x, y, 1] as const) : ([x, y] as const);
    });

  // ================================================================ TORSO: black tee, broad shoulders, high traps
  add({hue: 'shirt', tone: 2, d: sp([[-344, 600, 1], [-346, 470], [-338, 392], [-322, 334], [-294, 292], [-246, 256], [-200, 222], [-166, 196], [-148, 186], [-100, 200], [-40, 226], [40, 244], [100, 254], [170, 270], [240, 294], [284, 328], [306, 390], [318, 470], [324, 600, 1]])});
  // shadow side (away from the monitor)
  add({hue: 'shirt', tone: 1, angle: 75, d: sp([[-344, 600, 1], [-346, 470], [-338, 392], [-322, 334], [-294, 292], [-246, 256], [-200, 222], [-166, 196], [-148, 186], [-116, 204, 1], [-104, 300], [-96, 400], [-100, 480], [-108, 600, 1]])});
  // cool kicker on the near shoulder so the dark side separates from the room
  add({hue: 'shirt', tone: 2, angle: 60, d: sp([[-346, 480], [-338, 392], [-322, 334], [-294, 292], [-246, 256], [-204, 226], [-206, 234], [-250, 266], [-290, 302], [-314, 342], [-328, 396], [-335, 480]])});
  // near arm vs torso gap + underarm wrinkles
  add({hue: 'shirt', tone: 0, angle: 80, d: sp([[-258, 372], [-238, 420], [-230, 500], [-226, 600, 1], [-250, 600, 1], [-254, 480], [-262, 410]])});
  add({hue: 'shirt', tone: 0, angle: 30, d: sp([[-226, 430], [-180, 452], [-130, 486], [-150, 474], [-196, 452]])});
  add({hue: 'shirt', tone: 0, angle: 30, d: sp([[-222, 488], [-176, 506], [-128, 536], [-150, 526], [-192, 508]])});
  // top of the far pec + shoulder, lit
  add({hue: 'shirt', tone: 3, angle: 100, d: sp([[96, 262], [160, 270], [228, 294], [264, 332], [270, 388], [254, 424], [230, 424], [222, 364], [196, 306], [130, 284]])});
  if (print) {
    // big faded red-planet screen print on the chest, foreshortened with the torso turn, half hidden by the phone
    const pe = (cx: number, cy: number, rx: number, ry: number, a0 = 0, a1 = Math.PI * 2, n = 20): Pt[] =>
      Array.from({length: n}, (_, i) => {
        const t = a0 + ((a1 - a0) * i) / (n - (a1 - a0 >= Math.PI * 2 ? 0 : 1));
        const x = Math.cos(t) * rx;
        const y = Math.sin(t) * ry;
        return [cx + x * 0.985 - y * 0.17, cy + y + x * 0.1] as const;
      });
    add({hue: 'print', tone: 2, angle: 100, d: sp(pe(50, 408, 74, 86))});
    // terminator on the planet: dark side toward camera-left, lit crescent toward the key
    add({hue: 'print', tone: 1, angle: 100, d: sp([...pe(50, 408, 74, 86, Math.PI * 0.55, Math.PI * 1.45, 12), ...pe(34, 408, 44, 78, Math.PI * 1.35, Math.PI * 0.65, 10)])});
    add({hue: 'print', tone: 3, angle: 100, d: sp([...pe(50, 408, 74, 86, -Math.PI * 0.42, Math.PI * 0.12, 8), ...pe(62, 406, 56, 76, Math.PI * 0.1, -Math.PI * 0.38, 8)])});
    // craters
    add({hue: 'print', tone: 1, d: sp(pe(22, 384, 12, 9, 0, Math.PI * 2, 10))});
    add({hue: 'print', tone: 1, d: sp(pe(4, 430, 8, 6, 0, Math.PI * 2, 10))});
  }
  // pec fold
  add({hue: 'shirt', tone: 1, angle: 20, d: sp([[-60, 420], [20, 444], [140, 450], [240, 420], [196, 446], [110, 464], [10, 458]])});
  // far arm, lit, with the gap between arm and torso
  add({hue: 'shirt', tone: 3, angle: 95, d: sp([[240, 294], [284, 328], [306, 390], [318, 470], [324, 600, 1], [276, 600, 1], [268, 470], [262, 392], [246, 340]])});
  add({hue: 'shirt', tone: 1, angle: 85, d: sp([[252, 376], [268, 430], [276, 600, 1], [262, 600, 1], [256, 440]])});
  // rim light on the far shoulder
  add({hue: 'shirt', tone: 4, light: true, d: sp([[170, 271], [240, 295], [284, 329], [306, 390], [297, 392], [276, 340], [238, 306], [172, 280]])});

  // ================================================================ NECK (thick, short, tilted forward)
  // side of the neck (toward camera) in shadow
  add({hue: 'neck', tone: 1, angle: 10, d: sp([[-126, -30], [-40, 90], [40, 172], [84, 196], [90, 236], [98, 294, 1], [-40, 294], [-154, 200, 1], [-150, 60]])});
  // front of the neck, in front of the sternocleidomastoid, faces the key
  add({hue: 'neck', tone: 2, angle: 60, d: sp([[-84, 104], [0, 176], [84, 196], [90, 236], [98, 294, 1], [36, 294, 1], [6, 250], [-40, 180]])});
  // cast shadow of the chin on the throat (lower edge slopes, not parallel to the jaw)
  add({hue: 'neck', tone: 1, angle: 10, d: sp([[-90, 96], [-20, 150], [70, 172], [86, 190], [92, 240], [64, 238], [22, 220], [-20, 192], [-70, 160]])});
  // deep pocket under the jaw angle / ear
  add({hue: 'neck', tone: 0, angle: 10, d: sp([[-118, 30], [-100, 100], [-80, 158], [-40, 178], [-66, 192], [-112, 180], [-146, 140], [-146, 40]])});
  // throat catches the key below the chin shadow
  add({hue: 'neck', tone: 3, angle: 80, d: sp([[88, 244], [94, 260], [98, 294, 1], [80, 294, 1], [78, 262]])});
  // crew-neck collar, tilted ellipse: back high, front low
  add({hue: 'shirt', tone: 0, d: sp([[92, 258], [120, 254], [114, 286], [98, 292]])});
  add({hue: 'shirt', tone: 2, angle: 170, d: sp([[-156, 186], [-110, 226], [-40, 266], [20, 288], [64, 294], [104, 282], [124, 252], [134, 258], [116, 296], [64, 310], [16, 302], [-50, 280], [-120, 240], [-164, 200]])});
  add({hue: 'shirt', tone: 3, angle: 170, d: sp([[10, 285], [64, 295], [104, 283], [124, 253], [134, 258], [116, 296], [64, 310], [14, 300]])});
  add({hue: 'shirt', tone: 1, angle: 170, d: sp([[-164, 200], [-120, 240], [-50, 280], [-4, 296], [-60, 290], [-128, 252]])});

  // ================================================================ HEAD (tilt group)
  // skull + face silhouette, lit skin
  const SIL: Pt[] = J([
    [0, -256], [70, -246], [125, -212], [155, -160], [163, -110], [167, -72], [161, -40], [167, -2], [167, 30], [172, 42], [183, 56], [186, 64], [180, 74], [166, 80, 1],
    [167, 96], [171, 108], [168, 118], [171, 128], [163, 142, 1], [169, 164], [172, 190], [162, 209, 1], [128, 218], [96, 215, 1], [60, 206], [-20, 184], [-78, 160, 1],
    [-94, 112], [-104, 70], [-150, 30], [-178, -50], [-176, -150], [-130, -225], [-60, -254],
  ]);
  // base = the broad side plane in shadow (so the shadow-side silhouette has no lit AA fringe)
  S('skin', 1, SIL, {angle: 80});
  // the lit front of the head, bounded by the terminator (form shadow edge)
  const TERM: Pt[] = [[-10, -258], [-18, -190], [-30, -120], [-28, -60], [-16, 0], [2, 36], [26, 72], [44, 104], [54, 136], [72, 176], [96, 215, 1]];
  const FRONT: Pt[] = [
    [128, 218], [162, 209, 1], [172, 190], [169, 164], [163, 142, 1], [171, 128], [168, 118], [171, 108], [167, 96], [166, 80, 1], [180, 74], [186, 64], [183, 56], [172, 42], [167, 30],
    [167, -2], [161, -40], [167, -72], [163, -110], [155, -160], [125, -212], [70, -246], [0, -256],
  ];
  S('skin', 3, J([...TERM, ...FRONT]), {angle: 68});
  // stubble, lit part only (the shadow hides it)
  S('stubble', 3, J([[30, 80], [44, 90], [80, 104], [98, 90], [116, 88], [140, 92], [166, 84], [168, 100], [170, 112], [168, 132], [164, 150], [170, 178], [162, 207, 1], [128, 216], [96, 215, 1], [72, 176], [54, 136], [44, 104]]), {soft: 3, angle: 68});
  // half-tone band along the terminator (narrow on the skull, wider where the cheek turns slowly)
  S('skin', 2, J([[-10, -258], [-12, -190], [-25, -120], [-18, -60], [2, -4], [30, 30], [60, 68], [74, 104], [72, 136], [84, 176], [104, 215, 1], ...[...TERM].reverse().slice(1)]), {angle: 80});
  S('stubble', 2, J([[36, 84], [62, 96], [74, 104], [72, 136], [84, 176], [104, 215, 1], [96, 215, 1], [72, 176], [54, 136], [44, 104], [30, 86]]), {soft: 3, angle: 80});
  // shadow of the hair volume on the upper forehead
  S('skin', 2, [[30, -178], [70, -188], [120, -180], [160, -156], [161, -144], [124, -164], [78, -170], [40, -168]], {angle: 10});
  // forehead highlight (far brow)
  S('skin', 4, [[144, -136], [154, -128], [160, -100], [157, -84], [150, -104]]);
  // eye sockets + brow cast shadow (deep-set)
  S('skin', 2, [[2, -44], [30, -58], [72, -56], [102, -44], [110, -22], [100, -10], [80, -10], [60, -8], [30, -10], [8, -18]], {angle: 30});
  S('skin', 2, [[120, -50], [150, -56], [166, -46], [164, -20], [152, -12], [128, -12], [116, -26]], {angle: 30});
  S('skin', 1, [[6, -48], [40, -60], [80, -58], [106, -44], [100, -34], [72, -42], [40, -42], [12, -34]], {angle: 20});
  S('skin', 1, [[120, -50], [150, -58], [166, -48], [160, -38], [140, -40], [122, -36]], {angle: 20});
  // eye bag
  S('skin', 2, [[30, -5], [52, -1], [74, -5], [62, 3], [44, 4]], {angle: 10});
  // nose: shadow side plane, wing, cast shadow, underside
  S('skin', 2, [[104, -40], [116, -34], [142, 10], [164, 44], [172, 60], [158, 70], [140, 74], [120, 66], [110, 40], [104, 0], [100, -30]], {angle: 62});
  S('skin', 1, [[102, -8], [110, 24], [118, 56], [112, 70], [100, 70], [96, 40]], {angle: 62});
  S('skin', 2, [[114, 58], [132, 50], [150, 58], [156, 74], [142, 84], [122, 82], [112, 72]], {angle: 30});
  H({hue: 'skin', tone: 1, line: 2.2, d: sp([[116, 72], [119, 60], [131, 53], [143, 55]], false)});
  S('skin', 2, [[132, 84], [152, 86], [172, 80], [178, 76], [174, 86], [158, 93], [140, 94]], {angle: 20});
  H({hue: 'skin', tone: 0, d: sp([[148, 80], [158, 77], [168, 79], [160, 84], [150, 84]])});
  // nose ridge + tip highlight
  S('skin', 4, [[128, -18], [134, -16], [166, 38], [174, 52], [168, 52], [158, 38]]);
  H({hue: 'skin', tone: 4, d: ellipse(176, 60, 4, 3.5)});
  // far cheekbone highlight
  S('skin', 4, [[150, 8], [160, 2], [166, 12], [164, 30], [156, 26]]);
  // nasolabial fold
  S('skin', 2, J([[116, 82], [104, 98], [92, 122], [84, 144], [74, 132], [86, 104], [100, 86]]), {angle: 60});
  H({hue: 'skin', tone: 1, line: 1.6, d: sp(J([[112, 94], [100, 106], [92, 122], [89, 136]]), false)});
  // chin: square front plane, near side plane, bottom plane
  S('stubble', 2, J([[88, 150], [104, 150], [114, 184], [112, 214, 1], [100, 215, 1], [90, 184]]), {soft: 3, angle: 80});
  S('stubble', 4, J([[150, 170], [161, 167], [165, 180], [158, 188]]), {soft: 3});
  S('stubble', 1, J([[96, 215, 1], [128, 218], [162, 209, 1], [152, 203], [126, 209], [100, 207]]), {soft: 3, angle: 12});
  // under-lip shadow
  S('stubble', 2, J([[110, 138], [132, 142], [156, 137], [162, 136], [158, 146], [134, 149], [114, 145]]), {soft: 3, angle: 24});

  // ear (in shadow)
  S('skin', 1, [[-68, -40], [-92, -52], [-112, -40], [-120, -10], [-116, 30], [-108, 60], [-92, 80], [-78, 78], [-70, 56], [-66, 20]]);
  S('skin', 2, [[-76, -42], [-92, -50], [-110, -38], [-116, -14], [-111, -16], [-104, -32], [-92, -42]]);
  S('skin', 0, [[-80, -10], [-94, -18], [-102, 6], [-96, 36], [-86, 44], [-80, 20]]);

  // ================================================================ EYES (parametric: lids clip the iris)
  interface Eye {
    cx: number;
    cy: number;
    rx: number;
    up: number;
    lo: number;
    skew: number;
    tilt: number;
    irx: number;
    iry: number;
    lash: number;
    /** screen side of the eyeball that turns away from the light (-1 = left, 1 = right) */
    dark: -1 | 1;
  }
  const squint = mouth === 'grin' ? 0.35 : mouth === 'smirk' ? 0.12 : 0;
  const eyes: Eye[] = [
    {cx: 42, cy: -24, rx: 28, up: 11.5, lo: 7, skew: 0.28, tilt: 1, irx: 9.6, iry: 11, lash: 3.8, dark: -1},
    {cx: 146, cy: -25, rx: 15.5, up: 9, lo: 6, skew: -0.35, tilt: -1.5, irx: 6.4, iry: 10, lash: 3, dark: -1},
  ];
  eyes.forEach((e) => {
    const yUp = (u: number) => e.cy + e.tilt * u - e.up * Math.pow(Math.max(0, 1 - u * u), 0.8) * (1 + e.skew * u);
    const yLo = (u: number) => e.cy + e.tilt * u + e.lo * (1 - squint) * Math.pow(Math.max(0, 1 - u * u), 0.9) * (1 - e.skew * 0.5 * u);
    const yLid = (u: number) => yUp(u) + clamp01(lid) * (yLo(u) - yUp(u));
    const N = 14;
    const us = Array.from({length: N + 1}, (_, i) => -1 + (2 * i) / N);
    const X = (u: number) => e.cx + u * e.rx;
    const almond: Pt[] = [...us.map((u) => [X(u), yLid(u)] as const), ...[...us].reverse().slice(1, -1).map((u) => [X(u), yLo(u)] as const)];
    H({hue: 'eye', tone: 3, d: pl(almond)});
    // eyeball turning away from the light
    const shadeU = us.filter((u) => (e.dark < 0 ? u <= -0.3 : u >= 0.3));
    H({hue: 'eye', tone: 2, d: pl([...shadeU.map((u) => [X(u), yLid(u)] as const), ...[...shadeU].reverse().map((u) => [X(u), yLo(u)] as const)])});
    // iris + pupil, clipped by the lids
    const px = e.cx + lookX * e.rx * 0.42;
    const py = e.cy + 1 + lookY * e.up * 0.35;
    const clipEll = (rx: number, ry: number): string => {
      const pts: Pt[] = [];
      for (let k = 0; k < 36; k++) {
        const a = (k / 36) * Math.PI * 2;
        let x = px + Math.cos(a) * rx;
        const u = Math.max(-1, Math.min(1, (x - e.cx) / e.rx));
        x = X(u);
        const y = Math.max(yLid(u), Math.min(yLo(u), py + Math.sin(a) * ry));
        pts.push([x, y]);
      }
      return pl(pts);
    };
    if (lid < 0.97) {
      H({hue: 'iris', tone: 1, d: clipEll(e.irx, e.iry)});
      H({hue: 'pupil', tone: 0, d: clipEll(e.irx * 0.44, e.iry * 0.44)});
      // lid shadow on the eyeball
      H({hue: 'skin', tone: 1, d: pl([...us.map((u) => [X(u), yLid(u) - 0.5] as const), ...[...us].reverse().map((u) => [X(u), Math.min(yLo(u), yLid(u) + 3.6 * (1 - u * u))] as const)])});
      const hx = px + e.irx * 0.35;
      const hy = py - e.iry * 0.3;
      const hu = (hx - e.cx) / e.rx;
      if (hy > yLid(hu) + 1.5 && hy < yLo(hu) - 1) H({hue: 'eye', tone: 4, light: true, d: ellipse(hx, hy, e.irx * 0.2, e.irx * 0.2)});
    }
    // upper lid skin (between the crease and the lash line)
    const crease = (u: number) => yUp(u) - 5.5 * Math.pow(Math.max(0, 1 - u * u), 0.7);
    H({hue: 'skin', tone: 2, d: pl([...us.map((u) => [X(u), crease(u)] as const), ...[...us].reverse().map((u) => [X(u), yLid(u)] as const)])});
    // lash line, lower lid
    H({hue: 'lash', tone: 0, line: e.lash, d: sp(us.map((u) => [X(u * 1.03), yLid(u)] as const), false)});
    H({hue: 'skin', tone: 1, line: 1.6, d: sp(us.filter((u) => u > -0.85 && u < 0.9).map((u) => [X(u), yLo(u) + 2] as const), false)});
    H({hue: 'skin', tone: 1, line: 1.8, d: sp(us.filter((u) => u > -0.8 && u < 0.85).map((u) => [X(u), crease(u) - 1] as const), false)});
  });
  if (squint > 0.2) {
    // cheeks push up under the eyes when grinning
    S('skin', 3, [[24, 8], [52, 4], [86, 10], [70, 20], [40, 20]]);
    H({hue: 'skin', tone: 1, line: 1.6, d: sp([[20, 4], [48, 12], [80, 8]], false)});
  }

  // brows: low, fairly straight, thick at the inner end, tapered outer tail
  const b = brow * 8;
  const bi = brow < 0 ? -brow * 5 : 0; // inner ends pull down when frowning
  S('brow', 1, [[88, -54 - b + bi], [60, -59 - b], [30, -57 - b * 0.8], [4, -51 - b * 0.6], [3, -53 - b * 0.6], [30, -65 - b * 0.9], [62, -69 - b], [89, -63 - b + bi]]);
  S('brow', 0, [[85, -56 - b + bi], [62, -61 - b], [38, -61 - b * 0.9], [38, -64 - b * 0.9], [62, -67 - b], [86, -62 - b + bi]]);
  S('brow', 1, [[122, -57 - b + bi], [146, -59 - b], [167, -55 - b * 0.7], [167, -59 - b * 0.7], [146, -67 - b], [122, -65 - b + bi]]);
  S('brow', 0, [[124, -59 - b + bi], [144, -61 - b], [158, -60 - b * 0.8], [144, -65 - b], [124, -63 - b + bi]]);

  // ================================================================ MOUTH (replacement shapes)
  if (mouth === 'rest' || mouth === 'smirk') {
    const s = mouth === 'smirk' ? 1 : 0;
    const nc: [number, number] = [88 - s * 6, 123 - s * 12];
    S('lip', 2, [[nc[0], nc[1]], [104, 116 - s * 4], [126, 110 - s], [144, 108], [152, 110], [160, 107], [170, 113], [171, 117 + s], [160, 118 + s], [140, 120], [116, 122 - s * 3], [96, 124 - s * 9]], {angle: 0});
    S('lip', 3, J([[92 - s * 5, 124 - s * 10], [116, 123 - s * 3], [140, 121], [160, 119 + s], [170, 118 + s], [166, 128], [150, 135], [126, 136], [106, 131 - s * 3], [94 - s * 4, 126 - s * 8]]), {angle: 0});
    S('lip', 4, J([[134, 127], [148, 126], [154, 128], [144, 130]]));
    H({hue: 'lash', tone: 0, line: 2.8, d: sp([[nc[0] - 2, nc[1] - 1], [104, 123.5 - s * 6], [130, 121.5 - s], [156, 119 + s], [171, 116.5 + s]], false)});
    H({hue: 'skin', tone: 1, d: ellipse(nc[0], nc[1] + 1, 4.5, 3)});
    if (s) {
      // corner crease + the cheek pushed up on the smirking side
      H({hue: 'skin', tone: 1, line: 2.2, d: sp([[nc[0] - 6, nc[1] - 14], [nc[0] - 10, nc[1] - 2], [nc[0] - 5, nc[1] + 9]], false)});
      S('skin', 3, [[46, 72], [70, 76], [86, 92], [74, 100], [52, 90]]);
    }
  } else {
    const g = mouth === 'grin';
    const nc: [number, number] = g ? [78, 112] : [86, 118];
    const fc: [number, number] = g ? [174, 108] : [171, 113];
    // interior, lower edge follows the jaw
    const inTop: Pt[] = g ? [[100, 110], [130, 108], [160, 107]] : [[108, 111], [138, 108], [160, 108]];
    const inBot: Pt[] = J(g ? [[170, 120], [152, 134], [122, 138], [96, 130]] : [[168, 128], [150, 146], [120, 150], [96, 138]]);
    S('mouth', 0, [nc, ...inTop, fc, ...inBot]);
    // tongue / lower teeth
    if (g) S('teeth', 2, J([[104, 130], [128, 134], [152, 130], [162, 127], [152, 135], [126, 138], [106, 134]]));
    else S('lip', 1, J([[104, 142], [128, 136], [154, 136], [160, 144], [130, 150]]));
    // upper teeth
    S('teeth', 3, g ? [[86, 112], [100, 110.5], [130, 108.5], [160, 107.5], [172, 109], [168, 118], [152, 124], [124, 126], [100, 121], [88, 115]] : [[100, 115], [130, 110], [160, 110], [168, 114], [156, 120], [130, 120], [106, 119]]);
    if (g) {
      S('teeth', 4, [[136, 109], [160, 108], [168, 111], [160, 121], [140, 124]]);
      [108, 124, 140, 154].forEach((x, i) => H({hue: 'teeth', tone: 2, line: 1.3, d: sp([[x, 110 - i * 0.4], [x + 1, 123 - i * 0.8]], false)}));
    }
    // lips
    S('lip', 2, g
      ? [[nc[0] - 1, nc[1]], [96, 103], [122, 98], [144, 96], [153, 98], [161, 95], [174, 103], [fc[0] + 1, fc[1]], [160, 107], [130, 108], [100, 110]]
      : [[nc[0] - 1, nc[1]], [100, 111], [126, 105], [146, 103], [154, 105], [162, 102], [172, 109], [fc[0] + 1, fc[1]], [160, 109], [138, 109], [108, 112]], {angle: 0});
    S('lip', 3, J(g ? [[96, 130], [122, 138], [152, 134], [170, 120], [173, 126], [160, 142], [130, 148], [104, 140]] : [[96, 138], [120, 150], [150, 146], [168, 128], [171, 134], [160, 152], [130, 158], [104, 150]]), {angle: 0});
    S('lip', 4, J(g ? [[128, 141], [148, 139], [156, 141], [140, 144]] : [[126, 152], [146, 150], [154, 152], [138, 155]]));
    H({hue: 'skin', tone: 1, d: ellipse(nc[0] - 1, nc[1] + 1, 4.5, 3.5)});
    if (g) {
      // deeper nasolabial + cheek bunching
      H({hue: 'skin', tone: 1, line: 2.8, d: sp([[114, 88], [94, 98], [76, 114], [70, 132]], false)});
      S('skin', 3, [[46, 66], [80, 72], [98, 90], [80, 102], [54, 90]]);
    }
  }

  // ================================================================ HAIR: dark, swept back, volume on top, short sides
  const HAIR: Pt[] = [
    [158, -156], [168, -192], [166, -236], [148, -272], [108, -302], [48, -320], [-22, -322], [-92, -308], [-146, -278], [-182, -232], [-196, -166], [-194, -100], [-184, -44], [-166, -8], [-150, 12, 1],
    [-130, 4], [-122, -24], [-112, -48], [-92, -58], [-72, -56], [-62, -40], [-61, -10], [-56, 2, 1], [-50, -10], [-47, -42], [-34, -100], [-22, -146, 1], [18, -176], [70, -188], [122, -180],
  ];
  // base = darkest tone, so the contour never shows a lighter rim in the soft renderer
  S('hair', 0, HAIR, {angle: -50});
  // mid-tone mass: everything except the back/near side turned away from the light
  S('hair', 1, [
    [158, -156], [168, -192], [166, -236], [148, -272], [108, -302], [48, -320], [-22, -322], [-92, -308], [-118, -262], [-142, -204], [-154, -134], [-148, -62], [-134, -14],
    [-130, 4], [-122, -24], [-112, -48], [-92, -58], [-72, -56], [-62, -40], [-61, -10], [-56, 2, 1], [-50, -10], [-47, -42], [-34, -100], [-22, -146, 1], [18, -176], [70, -188], [122, -180],
  ], {angle: -28});
  // flow on the back mass
  S('hair', 1, [[-104, -292], [-142, -256], [-168, -196], [-178, -130], [-172, -70], [-164, -120], [-156, -190], [-132, -250]], {angle: -60});
  S('hair', 1, [[-140, -270], [-170, -234], [-186, -176], [-188, -120], [-180, -140], [-172, -196]], {angle: -65});
  // locks: flowing up from the hairline and back over the crown
  S('hair', 2, [[122, -180], [150, -170], [164, -200], [162, -240], [142, -276], [100, -304], [40, -318], [-30, -318], [-96, -302], [-40, -296], [20, -290], [74, -270], [112, -236], [128, -200]], {angle: -20});
  S('hair', 2, [[40, -186], [70, -196], [96, -222], [96, -250], [60, -272], [0, -282], [-70, -280], [-136, -262], [-80, -268], [-20, -266], [40, -252], [66, -230], [60, -206]], {angle: -22});
  S('hair', 2, [[-18, -150], [4, -170], [10, -196], [-20, -224], [-70, -244], [-126, -244], [-80, -232], [-40, -214], [-22, -190], [-24, -164]], {angle: -30});
  // clump shadows between locks
  S('hair', 0, [[128, -198], [112, -236], [74, -270], [20, -290], [-40, -296], [10, -284], [66, -262], [100, -234], [118, -202]], {angle: -20, base: false});
  S('hair', 0, [[60, -204], [66, -230], [40, -252], [-20, -266], [-60, -266], [-10, -258], [40, -244], [56, -226]], {angle: -22, base: false});
  // sheen: the monitor on the front swoop
  S('hair', 3, [[150, -176], [160, -204], [156, -242], [134, -272], [96, -296], [120, -272], [142, -240], [148, -206]], {angle: -20});
  S('hair', 3, [[80, -206], [88, -232], [72, -258], [40, -272], [66, -250], [76, -228]], {angle: -22});
  S('hair', 4, [[152, -232], [144, -258], [124, -282], [140, -260]], {light: true});

  // ================================================================ PHONE + HAND (not tilted)
  if (phone) {
    const n0 = T.length;
    // screen quad (TL, TR, BR, BL) and a bilinear map for UI placed in screen space
    const Q = [[92, 314], [198, 296], [218, 444], [112, 468]] as const;
    const qm = (u: number, v: number): [number, number] => {
      const top = [Q[0][0] + (Q[1][0] - Q[0][0]) * u, Q[0][1] + (Q[1][1] - Q[0][1]) * u];
      const bot = [Q[3][0] + (Q[2][0] - Q[3][0]) * u, Q[3][1] + (Q[2][1] - Q[3][1]) * u];
      return [top[0] + (bot[0] - top[0]) * v, top[1] + (bot[1] - top[1]) * v];
    };
    const rq = (pts: readonly (readonly [number, number])[], r: number): string => {
      // rounded quad: straight edges, quadratic corners
      const n = pts.length;
      const lerp = (a: readonly number[], b: readonly number[], t: number) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
      let d = '';
      for (let i = 0; i < n; i++) {
        const prev = pts[(i + n - 1) % n];
        const cur = pts[i];
        const next = pts[(i + 1) % n];
        const lp = Math.hypot(cur[0] - prev[0], cur[1] - prev[1]);
        const ln = Math.hypot(next[0] - cur[0], next[1] - cur[1]);
        const a = lerp(cur, prev, r / lp);
        const c = lerp(cur, next, r / ln);
        d += `${i === 0 ? 'M' : 'L'} ${f(a[0])} ${f(a[1])} Q ${f(cur[0])} ${f(cur[1])} ${f(c[0])} ${f(c[1])} `;
      }
      return d + 'Z';
    };
    const grow = (k: number, dx = 0, dy = 0) => Q.map(([x, y]) => [155 + (x - 155) * k + dx, 381 + (y - 381) * k + dy] as const);
    const box = (u0: number, v0: number, u1: number, v1: number) => pl([qm(u0, v0), qm(u1, v0), qm(u1, v1), qm(u0, v1)]);
    // forearm + wrist from the bottom of frame
    add({hue: 'hand', tone: 2, d: sp([[22, 640, 1], [44, 520], [60, 470], [78, 420], [152, 478], [142, 510], [130, 540], [118, 640, 1]])});
    add({hue: 'hand', tone: 1, angle: 70, d: sp([[22, 640, 1], [44, 520], [60, 470], [78, 420], [96, 440], [80, 480], [70, 530], [58, 640, 1]])});
    add({hue: 'hand', tone: 3, angle: 70, d: sp([[128, 486], [152, 478], [142, 510], [130, 540], [118, 640, 1], [106, 640, 1], [116, 520]])});
    // fingers wrapping round the far edge (seen from the side: long ovals)
    [[206, 338], [211, 372], [215, 405]].forEach(([x, y]) => {
      add({hue: 'hand', tone: 2, d: sp([[x - 6, y - 11], [x + 12, y - 12], [x + 20, y - 3], [x + 16, y + 10], [x - 6, y + 12]])});
      add({hue: 'hand', tone: 3, d: sp([[x + 2, y - 11], [x + 12, y - 12], [x + 20, y - 3], [x + 10, y - 5]])});
      add({hue: 'hand', tone: 1, line: 1.4, d: sp([[x - 4, y + 12], [x + 15, y + 10]], false)});
    });
    // phone body: thickness edge, then the slab
    add({hue: 'phone', tone: 0, d: rq(grow(1.09, -7, 5), 13)});
    add({hue: 'phone', tone: 1, d: rq(grow(1.09), 13)});
    add({hue: 'phone', tone: 3, line: 1.6, d: sp([grow(1.09)[0], grow(1.09)[1]].map((q, i) => [q[0] + (i ? -10 : 10), q[1] + (i ? 1.6 : -1.2)] as const), false)});
    // screen: the light plane, with a hint of a feed
    add({hue: 'screen', tone: 4, light: true, d: rq(Q, 8)});
    add({hue: 'ui', tone: 3, d: box(0.08, 0.05, 0.92, 0.075)});
    [0.14, 0.56].forEach((v) => {
      const [cx, cy] = qm(0.14, v + 0.03);
      add({hue: 'ui', tone: 3, d: ellipse(cx, cy, 6, 6)});
      add({hue: 'ui', tone: 3, d: box(0.27, v, 0.8, v + 0.03)});
      add({hue: 'ui', tone: 3, d: box(0.27, v + 0.055, 0.66, v + 0.075)});
    });
    add({hue: 'ui', tone: 3, d: box(0.08, 0.26, 0.92, 0.48)});
    // heel of the hand + thumb over the screen
    add({hue: 'hand', tone: 2, d: sp([[76, 416], [94, 424], [112, 446], [130, 470], [152, 480], [142, 496], [110, 494], [82, 472], [70, 440]])});
    add({hue: 'hand', tone: 2, d: sp([[82, 432], [98, 414], [122, 400], [146, 388], [160, 385], [165, 393], [158, 402], [138, 415], [120, 431], [112, 452], [104, 472], [88, 462]])});
    add({hue: 'hand', tone: 1, angle: 40, d: sp([[82, 432], [88, 462], [104, 472], [110, 480], [96, 482], [76, 462], [72, 440]])});
    // screen glow on the thumb + thumbnail
    add({hue: 'hand', tone: 4, light: true, d: sp([[98, 414], [122, 400], [146, 388], [160, 385], [148, 393], [124, 406], [102, 420]])});
    add({hue: 'hand', tone: 3, d: sp([[146, 389], [158, 386], [163, 392], [154, 397]])});
      if (phoneLift) for (let i = n0; i < T.length; i++) T[i] = {...T[i], transform: `translate(0 ${-phoneLift})`};
  }

  return {paths: T, hues: NOLE_HUES, box: [-360, -345, 720, 905]};
};
