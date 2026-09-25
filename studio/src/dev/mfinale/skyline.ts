// MR. MAS — mfinale: the dusk skyline (f540-629), also the backdrop of the title (f630-689), the picture on
// Mas's monitor (f690-719) and the true world the Orb's iris shows in GLYPH (f705-706).
// Pixel isometric (2:1). One tower pops per beat with its boss on the roof; at f622 the rooftops ignite into
// ONE cyan line: flat across the incumbents, steeper at the exes, vertical up NopeAI's spire (the show's curve).
import {Buf, W, H, rect, line, hash, clamp, bayer, ellipse, poly} from '../../shared/pixel/px';
import {PAL, stepColor} from '../../shared/pixel/palette';
import {text, textWidth} from '../../shared/pixel/font';
import {ease, hop} from '../../shared/pixel/sprite';
import {drawBoss, BossId, micro, microWidth, DUSK} from '../../shared/pixel/cast/bosses';
import {View, isoBox, isoCyl, IsoMat, U, darken, roofOutline} from './iso';
import {T, POPS} from './timeline';

export const WORLD_W = 552;
export const CAM_END = 58;
const GROUND = 214; // the quay line (front corners of the main row)
const WATER = 219; // waterline (world y)

/** camera X for a global frame (slow truck, eased; whole pixels) */
export const camX = (g: number) => (g < T.sky ? 0 : g >= T.title ? CAM_END : Math.round(CAM_END * ease.inOut(clamp((g - T.sky) / (T.title - 1 - T.sky), 0, 1))));

// ================================================================== the curve
/** the show's curve in world coords: flat for the incumbents, steep at the exes, vertical at NopeAI */
export const CURVE_X0 = 0, SPIRE_X = 297;
export const curveY = (x: number) => 130 - 0.1435 * (Math.exp((x - CURVE_X0) / 45) - 1);
/** iso box height that puts the roof centre of (fx, L, R) on the curve */
const hOnCurve = (fx: number, L: number, R: number, fy = GROUND) => Math.round(fy - (L + R) / 2 - curveY(fx - L + R));

// ================================================================== sky
const SKY = [PAL.N1, PAL.N2, PAL.N3, U.U0, U.U1, U.U2, U.U3, U.U4, U.U5, PAL.W5, PAL.W6];
/** sky colour at screen row y (world y == screen y; the sky does not truck). Returns a per-x colourer. */
export const skyColumn = (y: number) => (x: number) => {
  // the sun went down screen-left: the warm bands sit higher on the left
  const warm = (1 - x / W) * 26;
  const t = clamp((y + warm - 8) / 214, 0, 1);
  const v = Math.pow(t, 1.55) * (SKY.length - 1);
  const i = Math.floor(v), fr = v - i;
  const k = fr > 0.5 && bayer(x, y) < (fr - 0.5) * 2 ? i + 1 : i;
  return SKY[clamp(k, 0, SKY.length - 1)];
};
export const SKY_STARS: Array<{x: number; y: number; col: number; blue?: boolean; at?: number}> = [];
export const setStars = (s: typeof SKY_STARS) => { SKY_STARS.length = 0; SKY_STARS.push(...s); };
/**
 * The first stars of the evening: a seeded field in the high sky (never over the warm band), coming out a few
 * at a time on 2s as the dusk deepens (540-600). The brightest dozen are already out on the cut from the roll
 * call's hand-off, whose sky has none: they arrive with the first tower.
 */
export const duskStars = () => {
  const out: typeof SKY_STARS = [];
  for (let i = 0; out.length < 64 && i < 400; i++) {
    const x = Math.floor(hash(i, 1, 71) * W), y = Math.floor(Math.pow(hash(i, 2, 71), 1.35) * 120);
    if (y > 20 + (x / W) * 100) continue; // the sky warms toward the lower left: no stars in the afterglow
    const r = hash(i, 3, 71);
    const col = r < 0.12 ? PAL.P2 : r < 0.3 ? PAL.W8 : r < 0.55 ? PAL.P1 : r < 0.8 ? PAL.N8 : PAL.C7;
    out.push({x, y, col, at: out.length < 14 ? 540 : 540 + 2 * Math.floor(hash(i, 4, 71) * 30)});
  }
  return out;
};

const drawSky = (b: Buf, g: number) => {
  for (let y = 0; y < H; y++) { const c = skyColumn(y); for (let x = 0; x < W; x++) b.set(x, y, c(x)); }
  // stars: a slow twinkle, on 4s
  const st = Math.floor(g / 4);
  SKY_STARS.forEach((s, i) => {
    if (s.at !== undefined && g < s.at) return;
    if (s.blue) {
      b.set(s.x, s.y, PAL.C8);
      if ((st + i) % 5 < 2) { b.set(s.x - 1, s.y, PAL.C4); b.set(s.x + 1, s.y, PAL.C4); b.set(s.x, s.y - 1, PAL.C4); b.set(s.x, s.y + 1, PAL.C4); }
      return;
    }
    if (hash(i, st, 13) < 0.12) return;
    b.set(s.x, s.y, s.col);
  });
};

// ================================================================== far city (parallax 0.4)
const drawFarCity = (b: Buf, cam: number) => {
  const off = Math.round(cam * 0.4);
  for (let i = 0; i < 44; i++) {
    const wx = i * 15 + Math.floor(hash(i, 1, 5) * 9) - off - 20;
    const w = 7 + Math.floor(hash(i, 2, 5) * 12);
    const h = 14 + Math.floor(Math.pow(hash(i, 3, 5), 1.4) * 52);
    const top = WATER - 3 - h;
    rect(wx, top, w, h + 3, b.ink(U.U1));
    // a setback crown on some, an antenna on others
    const kind = hash(i, 4, 5);
    if (kind < 0.35) { rect(wx + 2, top - 5, w - 4, 5, b.ink(U.U1)); rect(wx + 2, top - 5, 1, 5, b.ink(U.U2)); }
    else if (kind < 0.55) { rect(wx + (w >> 1), top - 9, 1, 9, b.ink(U.U1)); b.set(wx + (w >> 1), top - 10, PAL.R3); }
    // west edges catch the afterglow
    rect(wx, top, 1, h, b.ink(U.U2));
    for (let j = top + 3; j < WATER - 4; j += 4) for (let k = wx + 2; k < wx + w - 1; k += 3) if (hash(k + off, j, 7) < 0.16) b.set(k, j, hash(k, j, 8) < 0.7 ? PAL.W4 : PAL.C3);
  }
};

// ================================================================== materials
const M_STONE: IsoMat = { // NopeAI: mauve stone; the west faces take the afterglow
  left: [PAL.X1, PAL.X1, PAL.X2, PAL.X2, PAL.X3, PAL.X3], right: [PAL.N1, PAL.N2, PAL.N2, U.U0, U.U1], top: [U.U1, U.U2, U.U2], rim: PAL.W5,
};
const M_ELGOOG: IsoMat = {
  left: [PAL.D2, PAL.D3, PAL.S2, PAL.S3, PAL.S3], right: [PAL.N1, PAL.N2, PAL.N3, U.U0], top: [U.U1, U.U2, U.U3], rim: PAL.W6,
  win: {rows: 6, cols: 2, lit: 0.55, on: [PAL.W6, PAL.W7, PAL.W5], off: PAL.N1, h: 2, flicker: 0.04},
};
const M_ATEM: IsoMat = {
  left: [PAL.N3, PAL.N4, PAL.N5, PAL.N5, PAL.N6], right: [PAL.N1, PAL.N2, PAL.N2, PAL.N3], top: [U.U1, U.U2, U.U2], rim: PAL.W5,
  win: {rows: 5, cols: 2, lit: 0.45, on: [PAL.C4, PAL.C5, PAL.W6], off: PAL.N2, h: 2, flicker: 0.05},
};
const M_ZAI: IsoMat = {
  left: [PAL.N0, PAL.N1, PAL.N1, PAL.N2], right: [PAL.N0, PAL.N0, PAL.N1], top: [PAL.N1, PAL.N2, PAL.N3], rim: PAL.W4,
  win: {rows: 8, cols: 3, lit: 0.3, on: [PAL.P2, PAL.G6], off: PAL.N0, h: 1},
};
const M_MACRO: IsoMat = { // glass: the sunset streaks across the west face
  left: [PAL.N3, PAL.N4, PAL.N5, PAL.N6, PAL.W4, PAL.N6, PAL.N7], right: [PAL.N1, PAL.N2, PAL.N3, PAL.N3], top: [U.U1, U.U2, U.U3], rim: PAL.W6,
  win: {rows: 4, cols: 2, lit: 0.35, on: [PAL.C5, PAL.C6, PAL.P1], off: PAL.N2, h: 1, flicker: 0.03},
};
const M_PLINTH: IsoMat = {left: [PAL.D1, PAL.D2, PAL.X1], right: [PAL.N1, PAL.N1, PAL.N2], top: [PAL.X1, PAL.X2, PAL.X2], rim: PAL.W5};
const M_INVIDIA: IsoMat = {left: [PAL.G0, PAL.G1, PAL.G1, PAL.G2], right: [PAL.N0, PAL.N1, PAL.G0], top: [PAL.G2, PAL.G3], rim: PAL.W5};
const M_PEEK: IsoMat = {left: [PAL.N1, PAL.N2, PAL.N2], right: [PAL.N0, PAL.N1], top: [PAL.N2, PAL.N3], rim: PAL.N4,
  win: {rows: 5, cols: 2, lit: 0.0, on: [PAL.N3], off: PAL.N0, h: 1}};

// ================================================================== signage
/** the tower wordmark plate (screen-parallel neon box): must-read text; `sub` is egg-size */
const plate = (b: Buf, cx: number, y: number, name: string, col: number, sub?: string, subCol = PAL.N6) => {
  const w = textWidth(name) + 8;
  // a plate never leaves the frame: at the frame edge it slides in and rides the edge (legible, whole)
  if (b instanceof View) cx = clamp(cx - b.camX, w / 2 + 3, W - w / 2 - 3) + b.camX;
  const x = Math.round(cx - w / 2);
  rect(x - 1, y - 1, w + 2, 12, b.ink(PAL.N0));
  rect(x, y, w, 1, b.ink(col));
  text(b, name, x + 4, y + 2, col);
  if (sub) {
    const sw = microWidth(sub) + 4;
    rect(Math.round(cx - sw / 2), y + 11, sw, 7, b.ink(PAL.N0));
    micro(b, sub, Math.round(cx - sw / 2) + 2, y + 12, subCol);
  }
};

/** a two-line plate (a long name stacked), same grammar as `plate` */
const plate2 = (b: Buf, cx: number, y: number, lines: string[], col: number, sub?: string, subCol = PAL.N6) => {
  const w = Math.max(...lines.map(textWidth)) + 8;
  if (b instanceof View) cx = clamp(cx - b.camX, w / 2 + 3, W - w / 2 - 3) + b.camX;
  const x = Math.round(cx - w / 2), h = lines.length * 9 + 3;
  rect(x - 1, y - 1, w + 2, h + 1, b.ink(PAL.N0));
  rect(x, y, w, 1, b.ink(col));
  lines.forEach((ln, i) => text(b, ln, Math.round(cx - textWidth(ln) / 2), y + 2 + i * 9, col));
  if (sub) {
    const sw = microWidth(sub) + 4;
    rect(Math.round(cx - sw / 2), y + h, sw, 7, b.ink(PAL.N0));
    micro(b, sub, Math.round(cx - sw / 2) + 2, y + h + 1, subCol);
  }
};

// ================================================================== towers
export interface Tower {
  id: string;
  pop: number; // global frame it pops
  /** front ground corner y, used for the pop clip */
  ground: number;
  /** x of the dust puff */
  dustX: number;
  draw: (v: View, g: number) => void;
  /** roof outline pixels (world) that ignite with the curve */
  roof?: () => Array<[number, number]>;
  boss?: {id: BossId; x: number; y: number};
  plate: (v: View, g: number) => void;
  /** px it rises out of the ground from */
  rise: number;
}

// ---- ELGOOG (+ MINDDEEP annex): a setback tower, warm stone, many lit floors
const EL = {fx: 46, L: 12, R: 10, h: 0};
EL.h = hOnCurve(EL.fx + 1, EL.L - 3, EL.R - 3) - 12;
const MD = {fx: 98, fy: 217, L: 15, R: 6, h: 38};
const drawElgoog = (v: View, g: number) => {
  isoBox(v, EL.fx, GROUND, EL.L, EL.R, EL.h, M_ELGOOG, g);
  isoBox(v, EL.fx + 1, GROUND - EL.h, EL.L - 3, EL.R - 3, 12, {...M_ELGOOG, win: {...M_ELGOOG.win!, rows: 5}}, g);
  // a cornice line between the two masses
  for (let x = EL.fx - 2 * EL.L; x <= EL.fx + 2 * EL.R; x++) v.set(x, (x <= EL.fx ? GROUND - Math.floor((EL.fx - x) / 2) : GROUND - Math.floor((x - EL.fx) / 2)) - EL.h, x <= EL.fx ? PAL.W5 : PAL.N3);
};
const drawMinddeep = (v: View, g: number) => {
  isoBox(v, MD.fx, MD.fy, MD.L, MD.R, MD.h, {...M_ATEM, win: {...M_ATEM.win!, on: [PAL.C5, PAL.C6], lit: 0.6}}, g);
};

// ---- ATEM: the rooftop billboard (METAVERSE, ghosted; fresh AI painted over, dripping)
const AT = {fx: 130, L: 11, R: 11, h: 0};
AT.h = hOnCurve(AT.fx, AT.L, AT.R);
const drawAtem = (v: View, g: number) => {
  isoBox(v, AT.fx, GROUND, AT.L, AT.R, AT.h, M_ATEM, g);
  const top = GROUND - AT.h;
  // billboard frame on the back of the roof, screen-parallel, on two tall legs (the old word rides above KRAM's head)
  const bx = AT.fx - 23, by = top - 52;
  rect(bx + 5, by + 16, 1, 26, v.ink(PAL.N0)); rect(bx + 40, by + 16, 1, 22, v.ink(PAL.N0));
  rect(bx, by, 46, 17, v.ink(PAL.N0));
  rect(bx + 1, by + 1, 44, 15, v.ink(PAL.N2));
  rect(bx + 1, by + 1, 44, 1, v.ink(PAL.N3));
  micro(v, 'METAVERSE', bx + 4, by + 9, PAL.N4);
  // AI: fresh paint over the old word; the drips lengthen on 3s after the pop
  const k = g - POPS.atem;
  text(v, 'AI', bx + 17, by + 3, PAL.P2);
  const drips: Array<[number, number]> = [[bx + 18, 3], [bx + 21, 5], [bx + 24, 2], [bx + 27, 4]];
  for (const [dx, n] of drips) for (let j = 0; j < Math.min(n + 1, Math.floor(Math.max(0, k) / 3)); j++) v.set(dx, by + 10 + j, j === n ? PAL.P1 : PAL.P2);
};

// ---- zAI: a black monolith; the boss brings the gantry and rocket
const ZA = {fx: 180, L: 9, R: 9, h: 0};
ZA.h = hOnCurve(ZA.fx, ZA.L, ZA.R);
const drawZai = (v: View, g: number) => {
  isoBox(v, ZA.fx, GROUND, ZA.L, ZA.R, ZA.h, M_ZAI, g);
  // (the COMING SOON: TRUTHGTP banner is Ep2's aftermath, cut from Ep1: SCRIPT §5.3 / §8.3)
};

// ---- MISANTHROPIC: a lighthouse of stacked essays
const MI = {cx: 224};
const lighthouseY = () => Math.round(curveY(MI.cx)) + 3;
const drawMisanthropic = (v: View, g: number) => {
  const top = lighthouseY();
  isoBox(v, MI.cx, GROUND + 2, 10, 10, 5, M_PLINTH, g);
  // the shaft: stacked essays. Each 3px layer is its own sheaf, nudged a pixel this way or that
  const PAPER = [PAL.N2, U.U1, PAL.P0, PAL.P1, PAL.P1, PAL.P2];
  for (let y = top + 1; y <= GROUND - 6; y++) {
    const layer = Math.floor((y - top) / 3);
    const sh = Math.round((hash(layer, 1, 91) - 0.5) * 2);
    const r = 7 + (y - top) * 0.07;
    const cx = MI.cx + sh;
    for (let x = Math.round(cx - r); x <= Math.round(cx + r); x++) {
      const u = (x - (cx - r)) / (2 * r);
      let t = (1 - u) * 5.2 + (bayer(x, y) - 0.5) * 0.9;
      if ((y - top) % 3 === 2) t -= 1.6; // the page-edge seam
      let c = PAPER[clamp(Math.floor(t), 0, 5)];
      if (x === Math.round(cx - r)) c = PAL.W6;
      v.set(x, y, c);
    }
    // a stray page sticking out of the stack now and then
    if ((y - top) % 3 === 0 && hash(layer, 2, 91) < 0.18) { v.set(Math.round(cx - r) - 1, y, PAL.P1); v.set(Math.round(cx - r) - 2, y, PAL.P1); }
  }
  // lines of text on the lit side (it IS an essay)
  for (let y = top + 7; y < GROUND - 10; y += 3) for (let x = MI.cx - 6; x < MI.cx - 1; x++) if (hash(x, y, 92) < 0.5) v.set(x, y, PAL.P0);
  // the price tag dangling from the gallery on a string
  const tx = MI.cx + 12, ty = top + 2;
  const sw = [0, 1, 0, -1][Math.floor(g / 5) % 4];
  line(tx, ty, tx + sw, ty + 7, v.ink(PAL.P1));
  rect(tx + sw - 2, ty + 8, 6, 8, v.ink(PAL.W7));
  v.set(tx + sw, ty + 9, PAL.N0); // the string hole; the tag is BLANK in Ep1 [SLOT] (SCRIPT §8.3)
};

// ---- NOPEAI: the neo-gothic data-centre cathedral, in scaffolding, on MACROSOFT's plinth
export const NO = {fx: 304, fy: 210, L: 36, R: 30, h: 64, G: 24};
/** a point on the west facade (the left face): u along the facade from the front corner, v up */
const fac = (u: number, vv: number): [number, number] => [NO.fx - 2 * u, NO.fy - u - vv];
/** a point on the south wall (the right face) */
const sth = (u: number, vv: number): [number, number] => [NO.fx + 2 * u, NO.fy - u - vv];
/** the rose: centred on the facade, a circle in the wall seen at the iso angle (ru in iso units, rv in px) */
const ROSE_UV = {u: NO.L / 2, v: NO.h - 14, ru: 10, rv: 19};
export const roseCenter = (): [number, number] => fac(ROSE_UV.u, ROSE_UV.v);
/** the ridge line, and the crossing where the spire stands */
const ridgeA = () => fac(NO.L / 2, NO.h + NO.G);
export const SPIRE = {x: 0, base: 0, tip: 4, balcony: 40};
{
  const A = ridgeA();
  SPIRE.x = A[0] + NO.R; SPIRE.base = A[1] - NO.R / 2 + 2;
}

/** pointed-arch opening on a face: `pt(u, v)` maps face coords to world; w in iso units, h in px */
const lancet = (v: View, pt: (u: number, vv: number) => [number, number], u0: number, v0: number, w: number, hh: number, glass: number[], frame: number, g: number, seed = 0) => {
  for (let du = 0; du < w; du += 0.5)
    for (let dv = 0; dv < hh; dv++) {
      const cu = Math.abs(du - (w - 0.5) / 2);
      const archTop = hh - Math.max(0, (cu * cu) * 2.2);
      if (dv > archTop) continue;
      const [x, y] = pt(u0 + du, v0 + dv);
      const edge = dv > archTop - 1 || du < 0.5 || du >= w - 0.5;
      const lit = (dv + Math.floor(g / 3) + seed) % 13 === 0;
      v.set(x, y, edge ? frame : lit ? glass[glass.length - 1] : glass[Math.min(glass.length - 2, Math.floor((dv / hh) * (glass.length - 1)))]);
    }
};

const drawCoolingTowers = (v: View, g: number) => {
  // two hyperboloid cooling towers far behind the nave: pale concrete in the afterglow, half hidden
  for (const [cx, base, h, ph] of [[336, 124, 40, 0], [362, 132, 44, 11]] as const) {
    isoCyl(v, cx, base - h, base, (y) => { const t = (y - (base - h)) / h; return 7 + 4 * Math.pow(Math.abs(t - 0.62) * 1.6, 1.6); }, [U.U1, U.U2, PAL.X1, PAL.X2, PAL.X3], PAL.W6);
    ellipse(cx, base - h, 7.5, 2, v.ink(U.U0));
    rect(cx - 7, base - h + 1, 15, 1, v.ink(PAL.X3));
    // steam: round puffs that rise off the lip and drift east; solid cores, a dithered fringe only at the rim
    for (let k = 0; k < 6; k++) {
      const age = ((g + ph + k * 7) % 42);
      const py = base - h - 4 - age * 1.2;
      const px = cx + Math.round(age * 0.4) + Math.round(Math.sin((age + k) * 0.3) * 2);
      const r = 5 + age / 5;
      const fade = age / 42;
      for (let y = Math.floor(py - r); y <= py + r; y++)
        for (let x = Math.floor(px - r); x <= px + r; x++) {
          const d = Math.hypot(x - px, (y - py) * 1.2) / r;
          if (d > 1) continue;
          const keep = d < 0.7 - fade * 0.5 ? 1 : (1 - d) / 0.3 - fade;
          if (bayer(x, y) > keep) continue;
          const lit = (x - px) / r - (y - py) / r;
          v.set(x, y, lit < -0.35 ? (fade < 0.4 ? PAL.S4 : PAL.X3) : lit < 0.3 ? PAL.X2 : PAL.X1);
        }
    }
  }
};

/**
 * The ROSE WINDOW, at skyline scale: the same NEURAL ROSE as the dinner's server cathedral (mdinner1: node
 * rings joined by lead came, jewel panes, glowing nodes), so the three cathedrals rhyme. Eight petals of
 * jewel glass (the data centre's cyan leads, with amber, ruby and green) meet a glowing hub; a ring of
 * sixteen nodes runs round the rim. It is a circle in the wall, seen at the iso angle. The title's Orb sits
 * exactly on its hub. blaze: 0 dusk, 1 lit, 2 the title's flash.
 */
const ROSE_GLASS = [
  [PAL.C4, PAL.C6, PAL.C8], [PAL.W4, PAL.W6, PAL.W8], [PAL.C4, PAL.C6, PAL.C8], [PAL.R1, PAL.R2, PAL.R3],
  [PAL.C4, PAL.C6, PAL.C8], [PAL.W4, PAL.W6, PAL.W8], [PAL.C4, PAL.C6, PAL.C8], [PAL.L1, PAL.L2, PAL.L3],
];
export const drawRoseWindow = (v: View, g: number, blaze: number) => {
  const {ru, rv} = ROSE_UV;
  const lit = Math.min(2, blaze);
  const pulse = Math.floor(g / 3);
  for (let du = -ru - 2; du <= ru + 2; du += 0.5)
    for (let dv = -rv - 3; dv <= rv + 3; dv += 0.5) {
      const pu = du / ru, pv = dv / rv;
      const d = Math.hypot(pu, pv);
      if (d > 1.2) continue;
      const [x, y] = fac(ROSE_UV.u + du, ROSE_UV.v + dv);
      // the stone ring: lit on its upper-west curve, a dark reveal inside it
      if (d > 1.08) { v.set(x, y, pv > 0.2 || pu > 0.4 ? PAL.X1 : PAL.X3); continue; }
      if (d > 1.0) { v.set(x, y, PAL.N0); continue; }
      const ang = (Math.atan2(pv, pu) + Math.PI * 2.5) % (Math.PI * 2); // 0 = straight up
      let c: number;
      if (d < 0.2) c = lit ? PAL.C9 : PAL.C8; // the hub
      else if (d < 0.3) c = PAL.N0; // its lead ring
      else if (d > 0.86) {
        // the rim: sixteen nodes on a dark came
        const k = (ang / (Math.PI * 2)) * 16;
        const node = Math.abs(k - Math.round(k)) < 0.22;
        c = node ? ((Math.round(k) + pulse) % 5 === 0 ? PAL.C9 : lit ? PAL.C8 : PAL.C6) : PAL.N1;
      } else {
        // the petals: pointed lancets of glass between radial lead cames, widest at mid radius
        const sec = (ang / (Math.PI * 2)) * 8;
        const i = Math.floor(sec), s2 = sec - i - 0.5;
        const t = (d - 0.3) / 0.56;
        const half = 0.36 * Math.sin(Math.PI * Math.min(1, t * 1.05)) + 0.04;
        if (Math.abs(s2) > half) c = PAL.N1; // tracery between the petals
        else {
          const glass = ROSE_GLASS[i % 8];
          const core = Math.abs(s2) < half * 0.45 && t > 0.15 && t < 0.8;
          c = glass[Math.min(2, lit + (core ? 1 : 0))];
          if (lit === 0 && !core) c = glass[0];
        }
      }
      v.set(x, y, c);
    }
};

/**
 * The west facade, hand-cut: coursed ashlar (a mortar line every 5 px along the course, staggered joints),
 * two buttresses that split it into three bays and rise into pinnacles past the gable, and a gallery of
 * small niches under the rose. Flat planes, lit from the west; the only ordered dither is the afterglow's
 * fall-off down the wall.
 */
const drawFacade = (v: View, g: number) => {
  const {L, h} = NO;
  for (let u = 0; u <= L; u += 0.5)
    for (let vv = 0; vv <= h; vv++) {
      const [x, y] = fac(u, vv);
      const course = vv % 5 === 0;
      const joint = !course && Math.round(u * 2) % 12 === ((Math.floor(vv / 5) % 2) * 6);
      const high = vv / h;
      // the afterglow warms the upper wall; the lower wall sits in the plinth's shadow
      let c = high > 0.55 ? PAL.X2 : high > 0.25 ? (bayer(x, y) < (high - 0.25) / 0.3 ? PAL.X2 : PAL.X1) : PAL.X1;
      if (course || joint) c = high > 0.55 ? PAL.X1 : PAL.X0;
      v.set(x, y, c);
    }
  // the buttresses: a lit west face, a shade edge; each rises into a pinnacle above the eaves
  for (const u0 of [11.5, 24.5]) {
    for (let vv = 0; vv < h + 12; vv++) {
      const [x, y] = fac(u0, vv);
      const top = vv >= h;
      v.set(x, y, top ? PAL.X3 : PAL.X3); v.set(x + 1, y, top ? PAL.X2 : PAL.U1); v.set(x + 2, y, PAL.N1);
      if (vv % 5 === 0 && !top) v.set(x + 1, y, PAL.X1);
    }
    const [px, py] = fac(u0, h + 12);
    v.set(px, py - 1, PAL.X3); v.set(px + 1, py - 1, PAL.X2); v.set(px, py - 2, PAL.X3); v.set(px, py - 3, PAL.W6);
  }
  // the gallery: a row of niches across the three bays under the rose (a king in each, lit from the portal)
  const gv = h - 40;
  for (let u = 3; u < L - 2; u += 2) {
    if (Math.abs(u - 11.5) < 1.2 || Math.abs(u - 24.5) < 1.2) continue;
    for (let dv = 0; dv < 6; dv++) {
      const [x, y] = fac(u, gv + dv);
      v.set(x, y, dv === 5 ? PAL.X3 : PAL.N1);
      if (dv < 4 && dv > 0) v.set(x - 1, y, dv === 3 ? PAL.C2 : PAL.N0);
    }
  }
  for (let u = 0; u <= L; u += 0.5) { const [x, y] = fac(u, gv - 1); v.set(x, y, PAL.X3); const [x2, y2] = fac(u, gv + 7); v.set(x2, y2, PAL.X3); const [x3, y3] = fac(u, gv + 8); v.set(x3, y3, PAL.X0); }
  void g;
};

const drawNopeAI = (v: View, g: number, o: {blaze?: number} = {}) => {
  const {fx, fy, L, R, h, G} = NO;
  const blaze = o.blaze ?? 0;
  // ---- the nave (walls only; the roof is built below)
  isoBox(v, fx, fy, L, R, h, {...M_STONE, win: undefined}, g, {noTop: true});
  // south wall: 6 bays of tall lancets (the data centre's cold light), buttress piers between them
  for (let bay = 0; bay < 6; bay++) {
    const u0 = 2 + bay * 4.6;
    lancet(v, sth, u0 + 1, 12, 2.5, 34, [PAL.C1, PAL.C3, PAL.C4, PAL.C5, PAL.C8], PAL.X2, g, bay * 3);
    // the pier: a darker strip that rises above the eaves into a pinnacle
    for (let dv = 0; dv < h + 8; dv++) { const [x, y] = sth(u0, dv); v.set(x, y, dv > h ? PAL.X2 : PAL.N1); v.set(x - 1, y, dv > h ? PAL.W5 : U.U0); }
    const [px, py] = sth(u0, h + 8);
    v.set(px, py - 1, PAL.X3); v.set(px, py - 2, PAL.W6);
  }
  // ---- roof: two steep slopes up to a ridge along the nave
  const A = ridgeA();
  const A2: [number, number] = [A[0] + 2 * R, A[1] - R];
  const eR: [number, number] = [fx, fy - h], eR2: [number, number] = [fx + 2 * R, fy - h - R];
  const eL: [number, number] = [fx - 2 * L, fy - L - h], eL2: [number, number] = [fx - 2 * L + 2 * R, fy - L - R - h];
  poly([eL[0], eL[1], A[0], A[1], A2[0], A2[1], eL2[0], eL2[1]], v.ink(U.U2));
  poly([eR[0], eR[1], A[0], A[1], A2[0], A2[1], eR2[0], eR2[1]], v.ink(PAL.N2));
  // slate courses (shade slope), and the sky catching the west slope
  for (let k = 3; k < 44; k += 4) { const t = k / 44; line(Math.round(eR[0] + (A[0] - eR[0]) * t), Math.round(eR[1] + (A[1] - eR[1]) * t), Math.round(eR2[0] + (A2[0] - eR2[0]) * t), Math.round(eR2[1] + (A2[1] - eR2[1]) * t), v.ink(PAL.N1)); }
  for (let k = 4; k < 40; k += 5) { const t = k / 40; line(Math.round(eL[0] + (A[0] - eL[0]) * t), Math.round(eL[1] + (A[1] - eL[1]) * t), Math.round(eL2[0] + (A2[0] - eL2[0]) * t), Math.round(eL2[1] + (A2[1] - eL2[1]) * t), v.ink(U.U3)); }
  line(A[0], A[1], A2[0], A2[1], v.ink(PAL.X3));
  for (let i = 2; i < 2 * R; i += 3) { v.set(A[0] + i, A[1] - Math.floor(i / 2) - 1, PAL.X2); }
  // data-centre exhausts on the shade slope: three grilles, cold light, heat haze
  for (const t of [0.3, 0.55, 0.8]) {
    const gx = Math.round(eR[0] + (eR2[0] - eR[0]) * t + (A[0] - eR[0]) * 0.45), gy = Math.round(eR[1] + (eR2[1] - eR[1]) * t + (A[1] - eR[1]) * 0.45);
    for (let i = 0; i < 6; i++) { v.set(gx + i, gy - (i >> 1), PAL.C4); v.set(gx + i, gy - (i >> 1) + 1, PAL.C2); }
    if (((g >> 2) + Math.round(t * 10)) % 3 === 0) v.set(gx + 2, gy - 4, PAL.N3);
  }
  // ---- the west facade: hand-cut stone, buttresses, the gallery
  drawFacade(v, g);
  // gable with a coping of crockets, and a small niche
  for (let u = 0; u <= L; u += 0.5) {
    const top = h + G * (1 - Math.abs(u - L / 2) / (L / 2));
    for (let vv = h; vv <= top; vv++) {
      const [x, y] = fac(u, vv);
      v.set(x, y, vv > top - 1 ? PAL.W5 : bayer(x, y) < 0.5 ? PAL.X2 : PAL.X1);
    }
    const [cx, cy] = fac(u, top + 1);
    if (Math.round(u * 2) % 6 === 0 && u > 1 && u < L - 1) { v.set(cx, cy, PAL.W6); v.set(cx, cy - 1, PAL.X3); }
  }
  lancet(v, fac, L / 2 - 1.5, h + 4, 3, 10, [PAL.N0, PAL.C1, PAL.C3], PAL.X3, g, 5);

  // the portal: a deep pointed arch, cold light spilling out of the data centre
  lancet(v, fac, L / 2 - 4, 0, 8, 26, [PAL.C0, PAL.C1, PAL.C2, PAL.C3, PAL.C6], PAL.X3, g, 2);
  lancet(v, fac, L / 2 - 2.5, 0, 5, 18, [PAL.C2, PAL.C3, PAL.C5, PAL.C6, PAL.C8], PAL.N1, g, 2);
  // blind arcade of little lancets either side of the portal
  for (const u0 of [5, 8, 26, 29]) lancet(v, fac, u0, 6, 2, 14, [PAL.N1, PAL.C1, PAL.C3], PAL.X3, g, u0);
  drawRoseWindow(v, g, blaze);
  // ---- twin west towers at the facade's ends (belfry lancets, pinnacle clusters)
  const tower = (u: number, th: number, scaff: boolean) => {
    const [tx, ty] = fac(u, 0);
    const TL = 6, TR = 6;
    isoBox(v, tx + 6, ty + 3, TL, TR, th, {...M_STONE, win: undefined}, g);
    const tl = (uu: number, vv: number): [number, number] => [tx + 6 - 2 * uu, ty + 3 - uu - vv];
    const tr = (uu: number, vv: number): [number, number] => [tx + 6 + 2 * uu, ty + 3 - uu - vv];
    lancet(v, tl, 1.5, th - 26, 2, 18, [PAL.N0, PAL.C1, PAL.C3, PAL.C5], PAL.X3, g, u);
    lancet(v, tl, 3.8, th - 26, 2, 18, [PAL.N0, PAL.C1, PAL.C3, PAL.C5], PAL.X3, g, u + 4);
    lancet(v, tr, 2.4, th - 26, 2, 18, [PAL.N0, PAL.N1, PAL.C1, PAL.C2], PAL.N2, g, u + 7);
    lancet(v, tl, 2.6, th / 2 - 12, 2, 14, [PAL.N0, PAL.C1, PAL.C3], PAL.X3, g, u + 2);
    // corner pinnacles + a central spirelet
    const topY = ty + 3 - th;
    const pin = (x: number, y: number, hh: number) => { for (let j = 0; j < hh; j++) { const w = Math.max(0, Math.round((hh - j) / 4)); rect(x - w, y - j, w + 1, 1, v.ink(PAL.X3)); if (w) rect(x + 1, y - j, w, 1, v.ink(PAL.N2)); } v.set(x, y - hh, PAL.W6); };
    pin(tx + 6 - 2 * TL, topY - TL, 7);
    pin(tx + 6 + 2 * TR, topY - TR, 7);
    pin(tx + 6, topY, 6);
    pin(tx + 6, topY - TL - TR + 2, 16);
    if (scaff) {
      // scaffolding: poles every 4px, a ledger every 6px, one brace per lift; lashed around the tower
      const x0 = tx - 9, x1 = tx + 21, yT = topY - 4, yB = ty + 2;
      for (let x = x0; x <= x1; x += 10) for (let y = yT; y < yB; y++) v.set(x, y, x === x0 ? PAL.W4 : PAL.G2);
      for (let y = yT + 3; y < yB; y += 11) { rect(x0, y, x1 - x0 + 1, 1, v.ink(PAL.G3)); rect(x0, y + 1, x1 - x0 + 1, 1, v.ink(PAL.D2)); v.set(x0, y, PAL.W5); }
      for (let y = yT + 3, n = 0; y + 11 < yB; y += 11, n++) { if (n % 2) line(x0, y + 11, x0 + 10, y, v.ink(PAL.G1)); else line(x0 + 10, y + 11, x0 + 20, y, v.ink(PAL.G1)); }
      // a hoist and a work lamp at the top lift
      rect(x1 - 2, yT - 6, 1, 6, v.ink(PAL.G3)); rect(x1 - 6, yT - 6, 5, 1, v.ink(PAL.G3)); v.set(x1 - 6, yT - 4, PAL.G4);
      v.set(x0 + 4, yT + 2, PAL.W8); v.set(x0 + 5, yT + 2, PAL.W7);
    }
  };
  tower(L - 1, h + 50, false);
  tower(2, h + 44, true);
  spire(v, g);
};
const spire = (v: View, g: number) => {
  const {x, base, tip, balcony} = SPIRE;
  // octagonal needle: lit west half, shaded east half, lucarnes lit cyan, a balcony ring near the top
  for (let y = tip; y <= base; y++) {
    const w = Math.max(0, Math.round((y - tip) / 12)) + (y > balcony ? 1 : 0);
    rect(x - w, y, w + 1, 1, v.ink(y < tip + 8 ? PAL.X3 : PAL.X2));
    rect(x + 1, y, w, 1, v.ink(PAL.N2));
    if (w >= 1) v.set(x - w, y, PAL.W5);
    if (y > balcony + 10 && ((y - balcony) % 12) < 4) v.set(x, y, PAL.C6);
    // crockets
    if (w >= 2 && y % 5 === 0) { v.set(x - w - 1, y, PAL.X3); v.set(x + w + 1, y, PAL.N2); }
  }
  // base drum where the needle meets the ridge
  rect(x - 5, base - 4, 11, 5, v.ink(PAL.X2)); rect(x + 1, base - 4, 5, 5, v.ink(PAL.N2)); rect(x - 5, base - 4, 11, 1, v.ink(PAL.X3));
  // balcony: a ring with a railing (tiny Mas stands here for the title)
  rect(x - 7, balcony, 15, 1, v.ink(PAL.X3));
  rect(x - 7, balcony + 1, 15, 1, v.ink(PAL.N1));
  for (let i = -7; i <= 7; i += 2) { v.set(x + i, balcony - 1, PAL.X2); v.set(x + i, balcony - 2, PAL.X2); }
  rect(x - 7, balcony - 3, 15, 1, v.ink(PAL.X3));
  // the tip: THE CURSOR, blinking on the beat (on 8 / off 7, the cold open's phase): the eighth player's rooftop
  // (SCRIPT §3.8, BASE 2x4 px). The f622 line runs up the spire through it.
  if (((g % 15) + 15) % 15 < 8) rect(x, tip - 4, 2, 4, v.ink(PAL.C7));
};

// ---- the GPU pile on NopeAI's roof: red-hot, sagging over the eaves like soft clocks
const GPU_HOT = [PAL.R1, PAL.R2, PAL.R3, PAL.W6, PAL.W7];
const gpuPile = (v: View, g: number) => {
  const k = g - (POPS.invidia + 6);
  if (k < 0) return;
  const n = Math.min(7, 1 + Math.floor(k / 4));
  const [ex, ey] = sth(9, NO.h + 7);
  // glow on the slates around the heap
  for (let j = -10; j < 6; j++) for (let i = -8; i < 34; i++) if (bayer(ex + i, ey + j) < 0.25 * (1 - Math.abs(j + 2) / 10)) v.set(ex + i, ey + j, PAL.R1);
  const cards: Array<[number, number]> = [[0, 0], [9, -2], [4, -4], [15, -3], [11, -6], [20, -5], [7, -8]];
  for (let i = 0; i < n; i++) {
    const [dx, dy] = cards[i];
    const x = ex + dx, y = ey + dy;
    const hot = ((g >> 2) + i) % 3;
    rect(x, y, 9, 4, v.ink(GPU_HOT[1])); rect(x, y, 9, 1, v.ink(GPU_HOT[2 + hot])); rect(x, y + 3, 9, 1, v.ink(GPU_HOT[0]));
    v.set(x + 2, y + 1, PAL.W7); v.set(x + 3, y + 2, PAL.W6); v.set(x + 6, y + 1, PAL.W7); v.set(x + 5, y + 2, PAL.W6); // two fans glowing
  }
  // (the melted ones, draped over the eave like soft clocks, arrive only after Ep4 airs: SCRIPT §3.8 / §8.3. In
  // Ep1 the GPUs pile up red-hot and KEEP THEIR SHAPE: no drape.)
  const drape = (u: number, len: number, ph: number) => {
    const [mx, my] = sth(u, NO.h + 1);
    rect(mx - 1, my - 4, 7, 2, v.ink(GPU_HOT[2]));
    rect(mx + 4, my - 3, 3, len, v.ink(GPU_HOT[1]));
    rect(mx + 4, my - 3, 1, len, v.ink(GPU_HOT[3]));
    rect(mx + 5, my - 3 + len, 1, 1 + ((g + ph) >> 3) % 3, v.ink(GPU_HOT[2]));
  };
  void drape;
  // heat shimmer above the heap (dithered, on 2s)
  for (let j = 0; j < 10; j++) for (let i = 0; i < 30; i++) if (bayer(i + (g >> 1), j + (g >> 2)) < 0.06) v.set(ex + i - 2, ey - 12 - j - n, PAL.W4);
};

// ---- MACROSOFT: a glass tower; its plinth runs under NopeAI
const MA = {fx: 382, L: 8, R: 12, h: 104};
const PL = {fx: 318, fy: 222, L: 46, R: 40, h: 10};
const drawPlinth = (v: View, g: number, slide: number) => {
  // it slides in along its long axis (whole pixels, 2:1) as MACROSOFT pops
  const vv = new View(v.dst, v.camX - slide * 2, v.camY - slide, v.dy, v.clipY);
  isoBox(vv, PL.fx, PL.fy, PL.L, PL.R, PL.h, M_PLINTH, g);
  // (BELOW . ABOVE . AROUND is cut from the Ep1 skyline: SCRIPT §5.3)
};
const drawMacrosoft = (v: View, g: number) => {
  isoBox(v, MA.fx, GROUND, MA.L, MA.R, MA.h, M_MACRO, g);
  // a mullion grid on the glass
  for (let u = 0; u <= MA.L; u += 4) for (let j = 0; j < MA.h; j++) v.set(MA.fx - 2 * u, GROUND - u - j, PAL.N2);
  // the afterglow slides down the west glass
  for (let j = 10; j < MA.h - 6; j++) if ((j + Math.floor(g / 4)) % 23 < 2) for (let u = 1; u < MA.L; u++) v.set(MA.fx - 2 * u + 1, GROUND - u - j, PAL.W5);
};

// ---- INVIDIA: a giant graphics card stood on end (fans on the west face, gold edge, IO bracket on top)
const IV = {fx: 432, L: 14, R: 3, h: 90};
const drawInvidia = (v: View, g: number) => {
  isoBox(v, IV.fx, GROUND, IV.L, IV.R, IV.h, M_INVIDIA, g);
  // the shroud's accent lines and the heat-sink fins on the edge
  for (let u = 0; u <= IV.L; u++) for (const vv of [IV.h - 4, 8]) { v.set(IV.fx - 2 * u, GROUND - u - vv, PAL.L3); v.set(IV.fx - 2 * u - 1, GROUND - u - vv, PAL.L2); }
  for (let j = 6; j < IV.h - 6; j += 3) for (let x = IV.fx + 1; x <= IV.fx + 2 * IV.R; x++) v.set(x, GROUND - Math.floor((x - IV.fx) / 2) - j, PAL.G2);
  // three fans (iso discs), blades turning on 2s
  const fan = (u0: number, v0: number) => {
    const r = 5.4, rot = Math.floor(g / 2) * 0.7;
    for (let du = -r - 0.5; du <= r + 0.5; du += 0.5)
      for (let dv = -r - 0.5; dv <= r + 0.5; dv += 0.5) {
        const d = Math.hypot(du, dv);
        if (d > r + 0.5) continue;
        const x = Math.round(IV.fx - 2 * (u0 + du)), y = Math.round(GROUND - (u0 + du) - (v0 + dv));
        const a = Math.atan2(dv, du) + rot;
        const blade = Math.sin(a * 3 + d * 0.5) > 0.15;
        v.set(x, y, d > r ? PAL.G3 : d > r - 0.7 ? PAL.N0 : d < 1.4 ? PAL.L2 : blade ? PAL.G2 : PAL.N0);
      }
  };
  fan(IV.L / 2, 22); fan(IV.L / 2, 45); fan(IV.L / 2, 68);
  // the gold contact teeth along the base
  for (let u = 1; u < IV.L; u++) for (let j = 0; j < 4; j++) if (u % 2) { v.set(IV.fx - 2 * u, GROUND - u - j, j === 3 ? PAL.W7 : PAL.W6); v.set(IV.fx - 2 * u - 1, GROUND - u - j, PAL.W5); }
  // IO bracket sticking up at the far end of the top
  const bx = IV.fx - 2 * IV.L, bt = GROUND - IV.h - IV.L;
  for (let j = 0; j < 10; j++) { v.set(bx, bt - j, PAL.G5); v.set(bx + 1, bt - j - 1, PAL.G4); }
};

// ---- PEEKDEEP, across the water: small, unlit; a whale-shaped water tower; a fin circling the moat
const PK = {fx: 514, fy: 226, L: 9, R: 8, h: 16};
const WHALE = [
  '......oooooo.........',
  '....ooWWWWWWoo.......',
  '..ooWWWWWWWWWWoo.....',
  '.oWWkWWWWWWWWWWWo..oo',
  'oWWWWWWWWWWWWWWWWooWo',
  'oBBBBBBWWWWWWWWWWWWo.',
  '.oBBBBBBBBBWWWWWWoo..',
  '..ooBBBBBBBBBBWoo....',
  '....oooooooooo.......',
];
const drawPeekdeep = (v: View, g: number) => {
  isoBox(v, PK.fx, PK.fy + 4, PK.L + 3, PK.R + 3, 3, {left: [PAL.D1, PAL.D2], right: [PAL.N1], top: [PAL.L0, PAL.L1], rim: PAL.W4}, g);
  isoBox(v, PK.fx, PK.fy, PK.L, PK.R, PK.h, M_PEEK, g);
  const tx = PK.fx - 10, ty = PK.fy - PK.h - PK.L - 26;
  for (const sx of [2, 7, 12, 16]) line(tx + sx, ty + 8, tx + sx + (sx < 9 ? -1 : 1), ty + 24, v.ink(PAL.N0));
  WHALE.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = r[i]; if (c === '.') continue; v.set(tx - 1 + i, ty + j, c === 'o' ? PAL.N0 : c === 'W' ? (i < 6 ? PAL.N5 : PAL.N4) : c === 'B' ? PAL.N6 : PAL.P2); } });
  // one lit window: somebody is still working
  v.set(PK.fx - 6, PK.fy - 8, PAL.W6); v.set(PK.fx - 7, PK.fy - 8, PAL.W6);
};
const drawFin = (v: View, g: number) => {
  const a = (g - POPS.peekdeep) * 0.16;
  const cx = PK.fx - 1, cy = PK.fy + 12;
  const x = Math.round(cx + Math.cos(a) * 32), y = Math.round(cy + Math.sin(a) * 8);
  const face = Math.sin(a) > 0 ? 1 : -1;
  const F = ['..o', '.oo', 'ooo', 'ooo'];
  F.forEach((r, j) => { for (let i = 0; i < 3; i++) if (r[i] === 'o') v.set(x + (face > 0 ? i : 2 - i), y - 4 + j, j === 0 || (face > 0 ? i === 2 : i === 0) ? PAL.N5 : PAL.N1); });
  for (let k = 1; k < 7; k++) if (k % 2) v.set(x - face * (k + 1), y, U.U3);
};

// ---- MACHINES THINKING: the newest lab, a slim pale tower on the quay; RIMA steps into a spotlight on its roof
export const MT = {fx: 468, L: 6, R: 7, h: 54};
const M_MT: IsoMat = {
  left: [PAL.G2, PAL.G3, PAL.G4, PAL.G5, PAL.G5, PAL.G6], right: [PAL.N2, PAL.N3, U.U1, U.U1], top: [U.U2, U.U3, PAL.X3], rim: PAL.W6,
  win: {rows: 6, cols: 2, lit: 0.34, on: [PAL.P1, PAL.W7], off: PAL.N2, h: 2, flicker: 0.03},
};
const MT_ROOF = GROUND - MT.h;
/** the spotlight: off on the pop, it SNAPS on two frames later (the roll call's beat, at rooftop scale) */
const mtSpot = (g: number) => g >= POPS.peekdeep + 2;
/** Ep1: RIMA TAMURI on NopeAI's roof deck (the eave of the south wall, east of the GPU pile), from the cut (f540). Her
 *  light drifts: a 4-drawing loop on 8s — it swings onto her, holds, and drifts off again (her device, SCRIPT §3.8). */
export const RIMA_DECK = (() => { const [x, y] = [NO.fx + 2 * 24, NO.fy - 24 - NO.h]; return {x, y: y - 1}; })();
const RIMA_DRIFT = [-9, -3, 0, -5]; // it drifts off over the open nave roof (never behind MACROSOFT)
export const rimaSpotDx = (g: number) => RIMA_DRIFT[Math.floor(Math.max(0, g - T.sky) / 8) % RIMA_DRIFT.length];
const drawMachines = (v: View, g: number) => {
  isoBox(v, MT.fx, GROUND, MT.L, MT.R, MT.h, M_MT, g);
  // a crisp vertical fin down the lit corner: the one flourish on a plain new building
  for (let j = 4; j < MT.h - 2; j++) v.set(MT.fx - 1, GROUND - j, j % 9 === 0 ? PAL.P2 : PAL.G6);
  // the light rig: a mast at the roof's back corner, a lamp arm leaning over the centre
  const rx = MT.fx - 2 * MT.L + 2 * MT.R - 1, ry = MT_ROOF - MT.R - 1;
  for (let j = 0; j < 18; j++) v.set(rx, ry - j, j % 4 === 0 ? PAL.G4 : PAL.G2);
  for (let i = 0; i < 7; i++) v.set(rx - i, ry - 17 + (i >> 2), PAL.G3);
  const lx = rx - 7, ly = ry - 15;
  v.set(lx, ly, PAL.G5); v.set(lx - 1, ly, PAL.G4); v.set(lx, ly + 1, mtSpot(g) ? PAL.W9 : PAL.N3); v.set(lx - 1, ly + 1, mtSpot(g) ? PAL.W8 : PAL.N2);
};
/** the cone of light onto the roof: a pale warm haze with a crisp edge (drawn behind her, over the sky) */
const drawSpotCone = (v: View, g: number, x: number, footY: number, on = mtSpot(g)) => {
  if (!on) return;
  const top = footY - 32;
  for (let y = top; y <= footY; y++) {
    const t = (y - top) / (footY - top), half = 1.5 + t * 7;
    for (let dx = -Math.ceil(half); dx <= Math.ceil(half); dx++) {
      const d = Math.abs(dx) / half;
      if (d > 1) continue;
      const X = x + dx;
      // a beam of warm light in the air: brighter toward her, a crisp edge, the top fading into the dusk
      const c = t < 0.25 ? (bayer(X, y) < t * 3 ? PAL.X2 : PAL.X1) : d > 0.82 ? PAL.X2 : bayer(X, y) < 0.3 + t * 0.4 ? PAL.P0 : PAL.X3;
      v.set(X, y, c);
    }
  }
  // the pool on the roof
  for (let dx = -8; dx <= 8; dx++) { v.set(x + dx, footY + 1, Math.abs(dx) < 6 ? PAL.P1 : PAL.X3); if (Math.abs(dx) < 5) v.set(x + dx, footY, PAL.X3); }
};
/** RIMA TAMURI at rooftop scale: shoulder-length brown hair with a side part, a warm-white top, dark trousers;
 *  lit from straight above (the crown and the shoulders catch it). Dark and 2 px off her mark until the light
 *  comes on, then on it. */
const RIMA_MINI = [
  '....oooo....',
  '...oHWHho...',
  '..oHHhhhho..',
  '..oHsSshho..',
  '..ohsSsshho.',
  '..ohssssho..',
  '..ohhmshhho.',
  '..ohho.ohho.',
  '.oPWWWWWWpo.',
  '.oPPPPPPPpo.',
  '.oPpPPPPppo.',
  '.osoPPPPoso.',
  '..ooPPPpoo..',
  '..onnnnnno..',
  '..onnoonno..',
  '..onno.ono..',
  '..onno.ono..',
  '..onno.ono..',
  '..okko.oko..',
  '..oooo.ooo..',
];
const drawRimaMini = (v: View, x: number, footY: number, g: number, on = mtSpot(g)) => {
  const L: Record<string, number> = on
    ? {o: PAL.N0, H: PAL.B3, W: PAL.P1, h: PAL.B1, s: PAL.S3, S: PAL.S5, m: PAL.S2, P: PAL.P1, p: PAL.G4, n: PAL.N2, k: PAL.N0}
    : {o: PAL.N0, H: PAL.N2, W: PAL.N2, h: PAL.N1, s: PAL.N2, S: PAL.N2, m: PAL.N1, P: PAL.N3, p: PAL.N2, n: PAL.N1, k: PAL.N0};
  const dx = on ? 0 : -2;
  const top = footY - RIMA_MINI.length + 1;
  RIMA_MINI.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = L[r[i]]; if (c !== undefined) v.set(x - 6 + i + dx, top + j, c); } });
};

/**
 * KRAM on ATEM's roof holds out the soup thermos (his roll-call flash), not a poster. The cast's KRAM is drawn
 * through a view that drops everything camera-left of his body (his poster and its grip); the thermos and his
 * hands are drawn here. (Suggested to the cast: a native thermos pose in bosses.ts would replace this.)
 */
class LeftClip extends View {
  minX = -Infinity;
  set(x: number, y: number, col: number) { if ((x | 0) < this.minX) return; super.set(x, y, col); }
}
const drawKramThermos = (v: View, x: number, y: number, g: number) => {
  const cv = new LeftClip(v.dst, v.camX, v.camY, v.dy, v.clipY);
  cv.minX = x - 8 + 1;
  drawBoss(cv, 'kram', x, y, g);
  const ox = x - 8, oy = y - 26;
  const tx = ox - 4, ty = oy + 11 + (Math.floor(g / 8) % 2 ? 0 : 1); // offered: it bobs a pixel on 8s
  const T_ROWS = ['.ooo.', 'orrro', 'oRRRo', 'ooooo', 'oGgso', 'oGgso', 'oGgso', 'oGgso', 'oGgso', '.ooo.'];
  const pal: Record<string, number> = {o: PAL.N0, r: PAL.R3, R: PAL.R2, G: PAL.G6, g: PAL.G5, s: PAL.G3};
  T_ROWS.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = pal[r[i]]; if (c !== undefined) v.set(tx + i, ty + j, c); } });
  // his hands round it (the near hand on top), and the steam (two drawings on 4s)
  for (const [hx, hy] of [[tx + 4, ty + 5], [tx + 4, ty + 7]] as const) { v.set(hx, hy, PAL.S4); v.set(hx + 1, hy, PAL.S3); }
  const st = Math.floor(g / 4) % 2;
  v.set(tx + 2 + st, ty - 2, PAL.P1); v.set(tx + 1 + st, ty - 3, PAL.P0); v.set(tx + 2 - st, ty - 4, PAL.P0);
};

// ================================================================== the cast of towers
export const TOWERS: Tower[] = [
  {
    id: 'elgoog', pop: POPS.elgoog, ground: GROUND, dustX: EL.fx, rise: 90, draw: drawElgoog,
    roof: () => roofOutline(EL.fx + 1, GROUND - EL.h - 12, EL.L - 3, EL.R - 3),
    boss: {id: 'radnus', x: EL.fx + 2, y: GROUND - EL.h - 12 - 7},
    plate: (v) => plate(v, EL.fx - 2, GROUND - 38, 'ELGOOG', PAL.W7, 'RADNUS'), // low, clear of SIMED's roof: at the truck's end it rides the frame edge
  },
  {
    id: 'minddeep', pop: POPS.elgoog + 1, ground: MD.fy, dustX: MD.fx, rise: 50, draw: drawMinddeep,
    boss: {id: 'simed', x: MD.fx + 2, y: MD.fy - MD.h - 9},
    plate: (v) => plate(v, MD.fx - 12, MD.fy - 18, 'MINDDEEP', PAL.C6, 'SIMED'),
  },
  {
    id: 'atem', pop: POPS.atem, ground: GROUND, dustX: AT.fx, rise: 90, draw: drawAtem,
    roof: () => roofOutline(AT.fx, GROUND - AT.h, AT.L, AT.R),
    boss: {id: 'kram', x: AT.fx + 9, y: GROUND - AT.h - 7},
    plate: (v) => plate(v, AT.fx - 8, GROUND - AT.h + 18, 'ATEM', PAL.C7, 'KRAM'),
  },
  {
    id: 'zai', pop: POPS.zai, ground: GROUND, dustX: ZA.fx, rise: 96, draw: drawZai,
    roof: () => roofOutline(ZA.fx, GROUND - ZA.h, ZA.L, ZA.R),
    boss: {id: 'zai', x: ZA.fx - 2, y: GROUND - ZA.h - 7},
    plate: (v) => plate(v, ZA.fx - 1, GROUND - ZA.h + 6, 'zAI', PAL.P2, 'NOLE'),
  },
  {
    id: 'misanthropic', pop: POPS.misanthropic, ground: GROUND, dustX: MI.cx, rise: 120, draw: drawMisanthropic,
    boss: {id: 'misanthropic', x: MI.cx + 4, y: 0},
    plate: (v) => plate(v, MI.cx + 8, GROUND - 40, 'MISANTHROPIC', PAL.W7, 'MARIO+ADELINA'),
  },
  {
    id: 'macrosoft', pop: POPS.macrosoft, ground: GROUND, dustX: MA.fx, rise: 120, draw: drawMacrosoft,
    boss: {id: 'tasya', x: MA.fx + 3, y: GROUND - MA.h - 10},
    plate: (v) => plate(v, MA.fx - 6, GROUND - MA.h + 18, 'MACROSOFT', PAL.C7, 'TASYA'),
  },
  {
    id: 'invidia', pop: POPS.invidia, ground: GROUND, dustX: IV.fx, rise: 110, draw: drawInvidia,
    boss: {id: 'nesnej', x: IV.fx - 12, y: GROUND - IV.h - 8},
    plate: (v) => plate(v, IV.fx - 12, GROUND - 26, 'INVIDIA', PAL.L3, 'NESNEJ'),
  },
  // (MACHINES THINKING's tower is not in the Ep1 skyline: it appears only from Ep5, after Ep4 airs its founding,
  // SCRIPT §8.2 / §8.3. drawMachines / plate2 stay for that episode's skyline. RIMA is on NopeAI's roof deck.)
  {
    id: 'peekdeep', pop: POPS.peekdeep, ground: PK.fy + 4, dustX: PK.fx, rise: 40, draw: drawPeekdeep,
    plate: (v) => plate(v, PK.fx - 2, PK.fy + 10, 'PEEKDEEP', PAL.N7, '(NOT YET)', PAL.N5),
  },
];

/** GPUs in flight from NESNEJ over MACROSOFT to NopeAI's roof (whole-pixel parabolas) */
const gpuArcs = (v: View, g: number) => {
  const k0 = POPS.invidia + 2;
  for (let n = 0; n < 8; n++) {
    const t0 = k0 + n * 5;
    const t = (g - t0) / 10;
    if (t < 0 || t > 1) continue;
    const x0 = IV.fx - 26, y0 = GROUND - IV.h - 24;
    const [x1, y1] = sth(10 + (n % 3) * 2, NO.h + 8);
    const x = Math.round(x0 + (x1 - x0) * t), y = Math.round(y0 + (y1 - y0) * t - 34 * Math.sin(t * Math.PI));
    rect(x, y, 5, 3, v.ink(PAL.L1)); rect(x, y, 5, 1, v.ink(PAL.L2)); v.set(x + 1, y + 1, PAL.L3); v.set(x + 3, y + 1, PAL.L3);
  }
};

/** pop offset k frames after the beat: up out of the ground, a 2-frame overshoot, settle */
const popDy = (k: number, rise: number) => (k < 0 ? 999 : k === 0 ? Math.round(rise * 0.45) : k === 1 ? -3 : k === 2 ? 1 : 0);
/** dust at the base (dithered, 6 frames, rolling outward) */
const dust = (v: View, x: number, y: number, k: number, w: number) => {
  if (k < 1 || k > 7) return;
  const r = 2 + k;
  for (let i = -w / 2 - r; i <= w / 2 + r; i++)
    for (let j = -r; j <= 1; j++) {
      const d = Math.abs(j) / r + Math.max(0, Math.abs(i) - w / 2) / (r * 2);
      if (d > 1 || bayer(x + i, y + j) > (1 - d) * (1 - k / 8) * 1.6) continue;
      v.set(x + i, y + j, j < -r / 2 ? PAL.X3 : PAL.X2);
    }
};

// ================================================================== the ignition
/** the curve's pixels in world coords (x ascending), then vertical up the spire and out of the frame */
const CURVE_PTS: Array<[number, number]> = (() => {
  const pts: Array<[number, number]> = [];
  const push = (a: number, b: number) => { const l = pts[pts.length - 1]; if (!l || l[0] !== a || l[1] !== b) pts.push([a, b]); };
  let px = CAM_END - 4, py = Math.round(curveY(CAM_END - 4));
  for (let x = CAM_END - 4; x < SPIRE.x - 1; x += 0.25) {
    const y = Math.round(curveY(x));
    const X = Math.round(x);
    if (X === px && y === py) continue;
    line(px, py, X, y, push);
    px = X; py = y;
    if (y < SPIRE.balcony + 6) break;
  }
  line(px, py, SPIRE.x, py - 2, push);
  // then straight up the spire and out of the frame (tiny Mas, at the title, stands in front of it)
  for (let y = py - 3; y >= -6; y--) push(SPIRE.x, y);
  return pts;
})();

export const drawIgnition = (v: View, g: number, stopY = -99) => {
  if (g < T.line) return;
  const k = g - T.line;
  const n = CURVE_PTS.length;
  // the fuse: across the incumbents fast, up the spire in the last two frames (all lit by f628)
  const p = g >= T.line + 6 ? 1 : ease.in(clamp((k + 1) / 7, 0, 1)) * 0.25 + clamp((k + 1) / 7, 0, 1) * 0.75;
  const lit = Math.round(n * p);
  // roof edges ignite as the fuse passes over them
  for (const t of TOWERS) {
    if (!t.roof) continue;
    const pts = t.roof();
    const idx = CURVE_PTS.findIndex((q) => q[0] >= pts[0][0]);
    if (idx < 0 || idx > lit) continue;
    for (const [x, y] of pts) v.set(x, y, PAL.C6);
  }
  // glow (ordered dither, 2px), the line, the hot head
  for (let i = 0; i < lit; i++) {
    const [x, y] = CURVE_PTS[i];
    if (y < stopY) continue;
    for (const [dx, dy] of [[0, -2], [0, 2], [-1, -1], [1, 1], [0, 3], [-2, 0], [2, 0]] as const) if (bayer(x + dx, y + dy) < 0.35) v.set(x + dx, y + dy, PAL.C3);
  }
  for (let i = 0; i < lit; i++) { const [x, y] = CURVE_PTS[i]; if (y < stopY) continue; v.set(x, y, PAL.C7); v.set(x, y + 1, PAL.C5); v.set(x + 1, y, PAL.C5); }
  if (lit < n) for (let i = Math.max(0, lit - 6); i < lit; i++) { const [x, y] = CURVE_PTS[i]; v.set(x, y, i === lit - 1 ? PAL.C9 : PAL.C8); }
};

// ================================================================== the scene
export interface SkyOpts {
  cam?: number;
  shake?: [number, number];
  /** rose-window blaze (title) */
  blaze?: number;
  /** frames since the title slam: the bosses flinch */
  flinch?: number;
  /** tiny Mas on the spire balcony */
  tinyMas?: boolean;
  /** skip the plates (the title) */
  noPlates?: boolean;
  /** sky, far city and water only (the heart avalanche's background) */
  bgOnly?: boolean;
  /** the ignited curve stops at this height (the title: at Mas's feet) */
  lineStop?: number;
}

export const drawSkyline = (fb: Buf, g: number, o: SkyOpts = {}) => {
  const cam = (o.cam ?? camX(g)) + (o.shake?.[0] ?? 0);
  const cy = o.shake?.[1] ?? 0;
  drawSky(fb, g);
  drawFarCity(fb, cam);
  const v = new View(fb, cam, cy);
  if (o.bgOnly) { reflect(fb, g, cy, cam); return; }
  // the plinth slides under NopeAI as MACROSOFT pops; NopeAI rides up onto it
  // NopeAI pops on the cut (f540) out of the ground; a frame later MACROSOFT's plinth slides in under it
  const km = g - POPS.macrosoft;
  const slide = km < 1 ? 60 : km === 1 ? 16 : km === 2 ? 3 : km === 3 ? -1 : 0;
  const lift = km < 0 ? 999 : km === 0 ? 70 : km === 1 ? PL.h - 3 : km === 2 ? 2 : km === 3 ? -1 : 0;
  const fl = o.flinch !== undefined ? hop(o.flinch, 2) : 0;
  const drawT = (t: Tower) => {
    const k = g - t.pop;
    if (k < 0) return;
    const dy = popDy(k, t.rise);
    const tv = v.with(dy, t.ground + 1);
    t.draw(tv, g);
    if (t.boss && t.boss.id === 'kram') drawKramThermos(tv, t.boss.x, t.boss.y + fl, g);
    else if (t.boss) drawBoss(tv, t.boss.id, t.boss.x, (t.id === 'misanthropic' ? lighthouseY() : t.boss.y) + fl, g);
    dust(v, t.dustX, t.ground, k, 30);
  };
  const byId = (id: string) => TOWERS.find((t) => t.id === id)!;
  drawT(byId('elgoog'));
  drawT(byId('minddeep'));
  drawT(byId('atem'));
  drawT(byId('zai'));
  drawT(byId('misanthropic'));
  const nv = v.with(lift, km <= 1 ? NO.fy + 1 : 999);
  drawCoolingTowers(nv, g);
  if (km >= 1) drawPlinth(v, g, slide);
  drawNopeAI(nv, g, {blaze: o.blaze});
  gpuPile(nv, g);
  // RIMA's drifting spotlight on NopeAI's roof deck (Ep1), from the cut; she is lit when it is on her mark
  {
    const dx = rimaSpotDx(g);
    drawSpotCone(nv, g, RIMA_DECK.x + dx, RIMA_DECK.y, true);
    drawRimaMini(nv, RIMA_DECK.x, RIMA_DECK.y + fl, g, Math.abs(dx) <= 3);
  }
  if (o.tinyMas) tinyMas(nv, SPIRE.x - 2, SPIRE.balcony, g);
  drawT(byId('macrosoft'));
  drawT(byId('invidia'));
  gpuArcs(v, g);
  const peek = byId('peekdeep');
  drawIgnition(v, g, o.lineStop);
  reflect(fb, g, cy, cam);
  const wl = WATER - cy;
  // the quay edge (lamps every 12px) where the city meets the water
  for (let x = 0; x < W; x++) { const wx = x + cam; if (wx < 470) { fb.set(x, wl - 1, PAL.N0); fb.set(x, wl, PAL.N0); if (wx % 12 === 0) { fb.set(x, wl - 2, PAL.W6); fb.set(x, wl + 1, PAL.W4); } } }
  // PEEKDEEP sits out in the water: drawn after the reflections, with its own short reflection
  if (g >= peek.pop) {
    const pv = new Buf(W, H, 0x1000000);
    const vv = new View(pv, cam, cy);
    const k = g - peek.pop;
    peek.draw(vv.with(popDy(k, peek.rise), peek.ground + 1), g);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const c = pv.c[y * W + x]; if (c < 0x1000000) fb.set(x, y, c); }
    const base = peek.ground - cy;
    for (let d = 1; d < 14; d++) { const wob = Math.round(Math.sin((base + d) * 0.9 + g * 0.35)); for (let x = 0; x < W; x++) { const c = pv.c[(base - d) * W + clamp(x + wob, 0, W - 1)]; if (c < 0x1000000 && (d + x) % 3) fb.set(x, base + d, darken(c, 2)); } }
    dust(v, peek.dustX, peek.ground, k, 30);
    drawFin(v, g);
  }
  if (!o.noPlates) for (const t of TOWERS) if (g >= t.pop + 1) t.plate(v.with(t.id === 'misanthropic' ? 0 : 0, 999), g);
};

/** The tower wordmark plates alone (the title keeps them, one light step down: SCRIPT §3.9, T25 PEEKDEEP to f650).
 *  Drawn into a transparent layer, stepped `dim` family rungs, then laid over fb. */
export const drawTowerPlates = (fb: Buf, g: number, dim = 0, o: {cam?: number; shake?: [number, number]; ids?: string[]} = {}) => {
  const cam = (o.cam ?? camX(g)) + (o.shake?.[0] ?? 0);
  const layer = new Buf(W, H, 0x1000000);
  const v = new View(layer, cam, o.shake?.[1] ?? 0);
  for (const t of TOWERS) if (g >= t.pop + 1 && (!o.ids || o.ids.includes(t.id))) t.plate(v.with(0, 999), g);
  for (let i = 0; i < layer.c.length; i++) { const c = layer.c[i]; if (c < 0x1000000) fb.c[i] = dim ? stepColor(c, -dim) : c; }
};

/** water: a wobbling, darkened reflection of everything above the waterline */
const reflect = (fb: Buf, g: number, cy: number, cam: number) => {
  const wl = WATER - cy;
  const src = new Uint32Array(fb.c);
  for (let y = wl; y < H; y++) {
    const d = y - wl;
    const wob = Math.round(Math.sin(y * 0.9 + g * 0.35) * (1 + d / 18));
    const sy = Math.round(wl - 1 - d * 1.15);
    if (sy < 0) continue;
    for (let x = 0; x < W; x++) {
      let c = src[sy * W + clamp(x + wob, 0, W - 1)];
      c = darken(c, d < 5 ? 1 : 2);
      if (((y + Math.floor(g / 3)) % 4 === 0) && bayer(x, y) < 0.3) c = U.U1;
      fb.set(x, y, c);
    }
  }
  void cam;
};

// ================================================================== tiny Mas (spire balcony, boss scale, dusk-lit)
const MINI_MAS = [
  '..o.ooooo......',
  '.oKoJIHHHo.....',
  '..oJIHHHhho....',
  '..oIHHhhhhho...',
  '..o54Hhhhhho...',
  '..o4k43k2hho...',
  '.o44433321o....',
  '..o43mm21o.....',
  '...o4321o......',
  '....o11oo......',
  '..oodccbbbo....',
  '.oedoddcbbbo...',
  '.oedoddcbbbao..',
  '.oedoydcbbbao..',
  '.oedoydcbbbao..',
  '.o54odcbbbbo1o.',
  '.o43oqqqpppo1o.',
  '...oQqqpppo....',
  '...oQqo.opo....',
  '...oQqo.opo....',
  '...oQqo.opo....',
  '..ozZzo.ozzo...',
  '..ooooo.oooo...',
];
export const tinyMas = (v: View, x: number, footY: number, g: number) => {
  const L: Record<string, number> = {
    o: PAL.N0, '1': DUSK.skin[1], '2': DUSK.skin[2], '3': DUSK.skin[3], '4': DUSK.skin[4], '5': DUSK.skin[5],
    h: DUSK.hair[1], H: DUSK.hair[2], I: DUSK.hair[3], J: DUSK.hair[4], K: DUSK.hair[5],
    a: DUSK.grey[1], b: DUSK.grey[2], c: DUSK.grey[3], d: DUSK.grey[4], e: DUSK.grey[5], y: PAL.G6,
    p: DUSK.low[1], q: DUSK.low[2], Q: DUSK.low[3], z: DUSK.shoe[1], Z: DUSK.shoe[3], k: PAL.N0, m: DUSK.skin[1],
  };
  const top = footY - MINI_MAS.length;
  MINI_MAS.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = L[r[i]]; if (c !== undefined && r[i] !== '.') v.set(x - 7 + i, top + j, c); } });
  void g;
};

