// MR. MAS · outro B: the drawings. The Orb's toast chips (the intro bookend's TOAST, stacked), the Orb close, its lamp
// and glint, the Ep1 moth and its perch on the Orb, and the one glyph the shared 7-px face lacks here (the em dash of
// Ep10's `viewer: —`). Everything is whole pixels, master palette only. v3: the band (and its terms line and pointer)
// and the stand-in's lookdev label are gone. The shared font, the Orb rig and the palette are imported read-only.
import {Buf, rect, bayer, TRANSPARENT} from '../../../shared/pixel/px';
import {PAL, stepColor} from '../../../shared/pixel/palette';
import {text, textWidth} from '../../../shared/pixel/font';
import {drawOrb} from '../../../shared/pixel/cast/orb-medium';

// ================================================================== text with the em dash (drawn locally)
const DASH = '—';
/** width of s in the 7-px face, counting a locally drawn em dash as 5 px */
export const tw = (s: string) => {
  let w = 0;
  const parts = s.split(DASH);
  parts.forEach((p, i) => {
    w += textWidth(p);
    if (i < parts.length - 1) w += (p.length ? 1 : 0) + 5 + 1;
  });
  return parts[parts.length - 1].length ? w : w - 1;
};
/** text() plus a 5-px em dash on the x-height middle row (the shared face has none) */
export const tx = (b: Buf, s: string, x: number, y: number, col: number) => {
  const parts = s.split(DASH);
  let cx = x;
  parts.forEach((p, i) => {
    if (p.length) { text(b, p, cx, y, col); cx += textWidth(p) + 1; }
    if (i < parts.length - 1) { rect(cx, y + 3, 5, 1, b.ink(col)); cx += 6; }
  });
};

// ================================================================== the Orb's toast chips
/** The intro bookend's TOAST (mfinale/bookend.ts drawToast), one chip per line, stacked like notifications.
 *  'credit': dark cyan face, pale type (the scan's findings). 'verdict': the intro's own chip (C6 face, N0 type).
 *  k = frames since it popped: frame 0 sits 2 px high, then it drops into place (2 held steps). `flash` lights the
 *  chip's rule for one frame instead: a chip landing IN PLACE around type that is already on screen (no drop). */
export const CHIP_H = 13;
export const chipW = (s: string) => tw(s) + 12;
export const drawChip = (b: Buf, x: number, y: number, s: string, kind: 'credit' | 'verdict', k: number, flash = false) => {
  if (k < 0) return;
  const nw = chipW(s), ny = y + (k === 0 ? -2 : 0);
  const face = kind === 'verdict' ? PAL.C6 : PAL.C1;
  const rule = flash ? PAL.C9 : kind === 'verdict' ? PAL.C8 : PAL.C4;
  const ink = kind === 'verdict' ? PAL.N0 : PAL.C8;
  rect(x - 1, ny - 1, nw + 2, CHIP_H, b.ink(PAL.N0));
  rect(x, ny, nw, 11, b.ink(face));
  rect(x, ny, nw, 1, b.ink(rule));
  // the chip's left tick: the Orb's colour, one pixel wide (it's the Orb talking)
  if (kind === 'credit') rect(x, ny + 1, 1, 10, b.ink(PAL.C5));
  tx(b, s, x + 6, ny + 2, ink);
};

// ================================================================== the Orb, close
/** v3: centred in the whole frame now the band is gone (the mock-up had cy 96 over the band). With the toast beside
 *  it and the perched moth above it, the block spans about y 89-163, a touch above the frame's centre (135). */
export const ORB = {cx: 420, cy: 132, r: 31};
/** look vectors: idle (toward its own toast, screen-left and a touch down), the in-betweens, the lens */
export const LOOK_IDLE: [number, number] = [-0.62, 0.12];
export const LOOKS: Array<[number, number]> = [LOOK_IDLE, [-0.4, 0.07], [-0.18, 0.03], [0, 0]];
/** the chrome's hard specular (drawOrb: nx = -0.56, ny = -0.2 with the monitor side at -1) */
export const specAt = (cy: number): [number, number] => [ORB.cx + Math.round(-0.56 * ORB.r), cy + Math.round(-0.2 * ORB.r)];

/** The Orb (the approved cold-open model, shared/pixel/cast/orb-medium drawOrb) at r 31 on black. `step` < 0 draws
 *  it that many light rungs down (the fade-up is 3 held palette steps, never a blend). `lit` = the lens is lit (the
 *  rig's hot scan palette): during the scan, and from the verdict on (pass 5: the lamp the moth is drawn to). */
export const drawOrbClose = (fb: Buf, cy: number, look: [number, number], aperture: number, lit: boolean, step: number, mask?: Uint8Array) => {
  if (step === 0) { drawOrb(fb, ORB.cx, cy, ORB.r, {look, aperture, scanning: lit, monitor: -1}, mask); return; }
  const tmp = new Buf(fb.w, fb.h, TRANSPARENT);
  drawOrb(tmp, ORB.cx, cy, ORB.r, {look, aperture, scanning: lit, monitor: -1}, mask);
  for (let i = 0; i < tmp.c.length; i++) if (tmp.c[i] !== TRANSPARENT) fb.c[i] = stepColor(tmp.c[i], step);
};

/** the lens centre on screen for a look (the rig's face direction D, projected: the lens sits where the sphere's
 *  normal equals D) */
export const lensAt = (cy: number, look: [number, number]): [number, number] => {
  const yaw = look[0] * 0.95, pitch = look[1] * 0.8;
  const D = [Math.sin(yaw), Math.sin(pitch), Math.cos(yaw) * Math.cos(pitch)];
  const l = Math.hypot(D[0], D[1], D[2]);
  return [ORB.cx + (D[0] / l) * ORB.r, cy + (D[1] / l) * ORB.r]; // continuous coords (pixel x spans [x, x + 1))
};

/** The lamp: light from the lit lens scattering in the black glass around it (pass 5). Within 15 px of the lens,
 *  the dark glass and blades step up the cyan ramp on an ordered dither that thins with distance. Only the Orb's own
 *  pixels (its mask) are touched, and never the lens itself or the chrome. */
const GLOW_OF = new Map<number, [number, number]>([[PAL.N0, [PAL.C0, PAL.C1]], [PAL.G0, [PAL.C1, PAL.C2]], [PAL.G1, [PAL.C1, PAL.C2]], [PAL.G2, [PAL.C2, PAL.C3]]]);
export const drawLensGlow = (fb: Buf, cy: number, look: [number, number], mask: Uint8Array, strength = 1) => {
  const [lx, ly] = lensAt(cy, look);
  const R = 15;
  for (let y = Math.floor(ly - R); y <= Math.ceil(ly + R); y++)
    for (let x = Math.floor(lx - R); x <= Math.ceil(lx + R); x++) {
      if (x < 0 || y < 0 || x >= fb.w || y >= fb.h || !mask[y * fb.w + x]) continue;
      const g = GLOW_OF.get(fb.c[y * fb.w + x]);
      if (!g) continue;
      const s = strength * (1 - Math.hypot(x + 0.5 - lx, y + 0.5 - ly) / R);
      const t = bayer(x, y);
      if (s > t + 0.45) fb.c[y * fb.w + x] = g[1];
      else if (s > t) fb.c[y * fb.w + x] = g[0];
    }
};

/** The catch-light glint (the title's four-point sparkle), on the chrome's specular. L = arm length. */
export const drawGlint = (b: Buf, cy: number, L: number) => {
  const [sx, sy] = specAt(cy);
  for (let i = -L; i <= L; i++) {
    b.set(sx + i, sy, Math.abs(i) < 1 ? PAL.P2 : PAL.C8);
    b.set(sx, sy + i, Math.abs(i) < 1 ? PAL.P2 : PAL.C8);
  }
  b.set(sx, sy, PAL.C9);
};

// ================================================================== the moth (Ep1's stinger)
// The Senate moth (Ep1 script: the moth from the empty wallet and the empty equity box). v3: with no words left to
// settle beside, it lands on the Orb, the lamp it came to. Pass 5 redraw, after a cold view of pass 4 ("dull brown on navy... it looks like a speck"; "it arrives
// after the eye's glow has faded, so 'moth drawn to the light' isn't clear"):
//   * bigger: 25 px wide at rest (pass 4: 19; pass 3: 11), 14 rows with the antennae (100 x 56 px at 1080p);
//   * paler: a dusty grey-beige moth (P0 wings, warm S6 leading edges, a peach thorax, brown marks and trailing edge),
//     never the terms line's paper (P1), so it can't read as one of its glyphs;
//   * LIT BY THE ORB: near the lit lens the whole moth walks onto the skin-under-cyan ramp (K), and whenever the lens
//     is lit, every edge pixel that faces it takes a cyan rim (C8 close, C7, C6 far). At rest it is rim-lit from above.
// The drawings are symmetric: each row is written as its left half + the centre column and mirrored. In flight it
// alternates 'open' (downstroke, spread) and 'up' (upstroke, a V) on 2s; 'up' drawn upside down is the tumble after it
// bumps the lens. a antenna, h head, t thorax, b body, w wing, e leading edge, d wing mark, v trailing shade.
const mirror = (half: string[]) => half.map((r) => r + [...r.slice(0, r.length - 1)].reverse().join(''));
const MOTH: Record<'open' | 'up' | 'rest', {rows: string[]; ax: number; ay: number}> = {
  rest: {rows: mirror([
    '.....a.......',
    '......a......',
    '........a....',
    '..........a..',
    '...........hh',
    '..........ett',
    '........eewtt',
    '......eewwwwb',
    '....eewwwdwwb',
    '..eewwwwddwwb',
    'eewwwwwwwwwwb',
    '.vwwwwwwwwwvb',
    '..vvvwwwwvv.b',
    '.....vvvv....',
  ]), ax: 12, ay: 9},
  open: {rows: mirror([
    '.........a...',
    '..........a.h',
    'eee........tt',
    'wweeee....ett',
    '.wwwwwweeewtb',
    '..wwwwdwwwwwb',
    '...vwwwwwwwwb',
    '....vvwwwwwvb',
    '......vvvwwvb',
    '.........vv.b',
    '............b',
  ]), ax: 12, ay: 5},
  up: {rows: mirror([
    '...e.........',
    '...ee....a...',
    '....we....a.h',
    '....wwe...ett',
    '.....wwe.eetb',
    '.....vwwdwwtb',
    '......vwwwwwb',
    '.......vvwwwb',
    '..........vvb',
    '............b',
  ]), ax: 12, ay: 5},
};
const MOTH_PAL: Record<string, number> = {w: PAL.P0, e: PAL.S6, t: PAL.S5, b: PAL.B4, h: PAL.B3, a: PAL.P0, d: PAL.B3, v: PAL.B4};
/** the same moth close to the lit lens: warm surfaces under cyan light (the K ramp) */
const MOTH_LIT: Record<string, number> = {w: PAL.K3, e: PAL.K5, t: PAL.K4, b: PAL.K2, h: PAL.K1, a: PAL.K3, d: PAL.K1, v: PAL.K2};
export type MothPose = keyof typeof MOTH;
/** the lamp the moth is lit by: the lens centre (native px); null = the lens is dark */
export type MothLight = {x: number; y: number} | null;
const rowsOf = (pose: MothPose, flip: boolean) => {
  const d = MOTH[pose];
  return flip ? {rows: [...d.rows].reverse(), ax: d.ax, ay: d.rows.length - 1 - d.ay} : d;
};
/** the moth's anchor (its centre column, middle row) goes at (x, y). `light` rim-lights the edges that face the lens
 *  and, within 46 px of it, puts the whole moth on the lit ramp. `flip` draws it upside down (the tumble). */
export const drawMoth = (b: Buf, pose: MothPose, x: number, y: number, light: MothLight = null, flip = false) => {
  const d = rowsOf(pose, flip);
  const inked = (i: number, j: number) => j >= 0 && j < d.rows.length && i >= 0 && i < d.rows[j].length && d.rows[j][i] !== '.';
  let ux = 0, uy = 0, dist = 1e9;
  if (light) {
    const dx = light.x - x, dy = light.y - y;
    dist = Math.hypot(dx, dy);
    ux = Math.round(dx / (dist || 1)); uy = Math.round(dy / (dist || 1));
  }
  const pal = dist < 46 ? MOTH_LIT : MOTH_PAL;
  const rim = dist < 60 ? PAL.C8 : dist < 110 ? PAL.C7 : PAL.C6;
  d.rows.forEach((row, j) => {
    for (let i = 0; i < row.length; i++) {
      const c = pal[row[i]];
      if (c === undefined) continue;
      const edge = light && (ux || uy) && !inked(i + ux, j + uy);
      b.set(x - d.ax + i, y - d.ay + j, edge ? rim : c);
    }
  });
};
/** a pose's inked box relative to its anchor: [x0, y0, x1, y1] */
export const mothBox = (pose: MothPose, x: number, y: number, flip = false): [number, number, number, number] => {
  const d = rowsOf(pose, flip);
  let x0 = 99, y0 = 99, x1 = -99, y1 = -99;
  d.rows.forEach((row, j) => { for (let i = 0; i < row.length; i++) if (row[i] !== '.') { x0 = Math.min(x0, i); x1 = Math.max(x1, i); y0 = Math.min(y0, j); y1 = Math.max(y1, j); } });
  return [x - d.ax + x0, y - d.ay + y0, x - d.ax + x1, y - d.ay + y1];
};
/** v3: where the resting moth sits: ON the Orb, on top of it, riding its bob. The anchor is PERCH px from the Orb's
 *  centre (whole pixels); its abdomen and trailing wing edges (rows 12-13) overlap the sphere's top rows by 1-2 px so
 *  it reads as sitting on the chrome, the head and antennae above the silhouette. */
export const PERCH: [number, number] = [2, -34];
export const perchAt = (cy: number): [number, number] => [ORB.cx + PERCH[0], cy + PERCH[1]];
/** the resting moth's bounding box on an Orb at cy: [x0, y0, x1, y1] */
export const mothRestBox = (cy = ORB.cy): [number, number, number, number] => { const [x, y] = perchAt(cy); return mothBox('rest', x, y); };
