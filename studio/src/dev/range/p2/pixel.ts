// MR. MAS — Prototype 2 · THE CLIFF · the PIXEL side (pure; no DOM). The dark room `[W]` exactly as the medium tier
// composes it (rooms/darkroom-plate + cast/mas-medium + cast/orb-medium, the order of rooms/twoshots drawDark2S), but
// drawn stage by stage so the extrusion knows which stage last wrote each pixel (the premium layer/depth export in
// miniature, H6): plate -> the Orb -> Mas's BACK -> the desk (+ his glass) -> Mas's FRONT -> the front (vignette).
// Also: the Researcher's nested lanyard (the badge Droste, one design at every scale, the same art the 3D nest is built
// from), the post-state loss plot for the monitor (the same plot the 3D world is built from), the desk's front panel
// (the room takes the band's lines), and the adventure band (pixeladv's verb/inventory band) with the lit cursor.
import {Buf, rect, TRANSPARENT, bayer, hash, Plot} from '../../../shared/pixel/px';
import {PAL, stepColor} from '../../../shared/pixel/palette';
import {text} from '../../../shared/pixel/font';
import {tinyPlot, tinyWidth, vignette, ROOM_H} from '../../../shared/pixel/rooms/kit-b';
import {DPLATE, DPLATE_LOOK, DarkPlateOpts, drawDarkPlate, drawDarkPlateDesk, DPLATE_SCREEN_W, DPLATE_SCREEN_H} from '../../../shared/pixel/rooms/darkroom-plate';
import * as MM from '../../../shared/pixel/cast/mas-medium';
import * as OM from '../../../shared/pixel/cast/orb-medium';
import {drawUI, drawCursor} from '../../pixeladv/art/ui';
import {NW, NH, RH, T, bandDrop} from './params';

// ================================================================== type (the 7-px house font, with a plain `l`)
/** the 7-px font's lowercase for the plot's one label, with a straight `l` (the font's hooked one reads as `1`) */
const LABEL_G: Record<string, string[]> = {
  l: ['#', '#', '#', '#', '#', '#', '#'],
  o: ['....', '....', '.##.', '#..#', '#..#', '#..#', '.##.'],
  s: ['....', '....', '.###', '#...', '.##.', '...#', '###.'],
  V: ['#...#', '#...#', '#...#', '#...#', '.#.#.', '.#.#.', '..#..'],
  '1': ['.#.', '##.', '.#.', '.#.', '.#.', '.#.', '###'], '2': ['.##.', '#..#', '...#', '..#.', '.#..', '#...', '####'],
  '3': ['###.', '...#', '...#', '.##.', '...#', '...#', '###.'], '4': ['..#.', '.##.', '#.#.', '#.#.', '####', '..#.', '..#.'],
  '5': ['####', '#...', '###.', '...#', '...#', '#..#', '.##.'], '6': ['.##.', '#...', '#...', '###.', '#..#', '#..#', '.##.'],
  '7': ['####', '...#', '..#.', '..#.', '.#..', '.#..', '.#..'], '8': ['.##.', '#..#', '#..#', '.##.', '#..#', '#..#', '.##.'],
  '9': ['.##.', '#..#', '#..#', '.###', '...#', '...#', '.##.'],
};
export const labelWidth = (s: string) => [...s].reduce((w, ch) => w + (LABEL_G[ch]?.[0].length ?? 3) + 1, -1);
/** 7-px type through any Plot, each font pixel an s x s block */
export const labelPlot = (s: string, x: number, y: number, p: Plot, sc = 1) => {
  let cx = x;
  for (const ch of s) {
    const g = LABEL_G[ch];
    if (!g) { cx += 4 * sc; continue; }
    g.forEach((r, j) => { for (let i = 0; i < r.length; i++) if (r[i] === '#') for (let a = 0; a < sc; a++) for (let b2 = 0; b2 < sc; b2++) p(cx + i * sc + a, y + j * sc + b2); });
    cx += (g[0].length + 1) * sc;
  }
};

// ================================================================== the badge (one design at every scale)
/** the card in card units (80 x 46): the Researcher's badge. The photo window holds the badge again. */
export const CARD = {w: 80, h: 46, photo: {x: 6, y: 14, w: 28, h: 16}, rho: 28 / 80};
type R = [number, number, number, number, number]; // x, y, w, h, colour
/** the card's parts: the face, and what stands a voxel proud of it (band, frame, type, bars) */
export const CARD_PARTS: {base: R[]; raised: R[]} = {
  base: [
    [0, 0, 80, 46, PAL.P1],
    [0, 45, 80, 1, PAL.P0],
  ],
  raised: [
    // the band across the top (the machine's cyan), its lit top row, the punched slot for the clip
    [0, 0, 80, 9, PAL.C4],
    [0, 0, 80, 1, PAL.C6],
    [0, 8, 80, 1, PAL.C3],
    [35, 3, 10, 3, PAL.N1],
    // the photo window's frame
    [5, 13, 30, 1, PAL.N3], [5, 30, 30, 1, PAL.N3], [5, 13, 1, 18, PAL.N3], [34, 13, 1, 18, PAL.N3],
    // the name lines beside the generation tag
    [52, 22, 24, 2, PAL.G4],
    [52, 26, 16, 2, PAL.G5],
  ],
};
/** the barcode: shapes, not words */
export const BARCODE: number[] = [0, 1, 3, 4, 6, 9, 10, 12, 15, 16, 17, 20, 22, 25, 26, 28, 31, 33, 34, 36];
/** each nested badge is the next generation: V1 on the monitor, V2 in its photo, V3 the first slab of the 3D nest */
export const badgeTag = (gen: number) => `V${gen}`;
export const NEST_GENS = 9;
export const EXCEEDS = 'EXCEEDS EXPECTATIONS';

/** Paint one badge (generation `gen`) through `box(u, v, w, h, colour, raised)` in card units. `legible` = draw the
 *  type as type (else as the bars it reads as from far off: never a smear of undersampled letters). */
export const paintBadge = (gen: number, legible: boolean, box: (u: number, v: number, w: number, h: number, c: number, raised: boolean) => void) => {
  for (const [u, v, w, h, c] of CARD_PARTS.base) box(u, v, w, h, c, false);
  for (const [u, v, w, h, c] of CARD_PARTS.raised) box(u, v, w, h, c, true);
  const last = gen === NEST_GENS;
  const dot = (c: number) => (x: number, y: number) => box(x, y, 1, 1, c, true);
  if (legible) {
    tinyPlot('RESEARCHER', 38, 14, dot(PAL.N2));
    labelPlot(badgeTag(gen), 38, 21, dot(PAL.C3));
    if (last) tinyPlot(EXCEEDS, Math.floor((80 - tinyWidth(EXCEEDS)) / 2), 36, dot(PAL.N2));
  } else {
    box(38, 15, 39, 3, PAL.G3, true);
    box(38, 21, 11, 7, PAL.C4, true);
    if (last) box(1, 37, 78, 3, PAL.G3, true);
  }
  if (!last) for (const k of BARCODE) box(38 + k, 33, 1, 6, PAL.N3, true);
};

/** Draw the badge Droste into `b` with its top-left at (ox, oy), `s` px per card unit, down to a single pixel.
 *  `res` = how many resolvable pixels one of b's pixels is worth (the monitor squeezes ~1.8 virtual px into one image
 *  px across, so type is only drawn where it will survive the sampling). */
export const drawNest = (b: Buf, ox: number, oy: number, s: number, gen = 1, maxGen = NEST_GENS, res = 1) => {
  if (CARD.w * s < 1.6) { b.set(Math.round(ox), Math.round(oy), PAL.P1); return; }
  const X = (u: number) => Math.round(ox + u * s), Y = (v: number) => Math.round(oy + v * s);
  const legible = s * res >= 0.9;
  paintBadge(gen, legible, (u, v, w, h, c) => {
    let x0 = X(u), x1 = X(u + w), y0 = Y(v), y1 = Y(v + h);
    if (s > 0.3) { if (x1 <= x0) x1 = x0 + 1; if (y1 <= y0) y1 = y0 + 1; }
    rect(x0, y0, x1 - x0, y1 - y0, b.ink(c));
  });
  const p = CARD.photo;
  rect(X(p.x), Y(p.y), X(p.x + p.w) - X(p.x), Y(p.y + p.h) - Y(p.y), b.ink(PAL.N0));
  if (gen < maxGen) drawNest(b, ox + p.x * s, oy + p.y * s, s * CARD.rho, gen + 1, maxGen, res);
};

/** the virtual monitor screen (96 x 60, DPLATE_SCREEN_W/H): where the nest sits */
export const NEST_AT = {x: 8, y: 12, s: 1};
/** the monitor squeezes the 96-px virtual screen into ~54 image px across: 1 virtual px ~ 0.56 image px */
export const SCREEN_RES = 54 / 96;
/** The Researcher's nested lanyard on his monitor, drawn at `V` pixels per virtual pixel (1 = the plate's own
 *  screen; 2^L for the resolution steps the 3D push uses), generations V1 .. maxGen. */
export const screenNestAt = (scr: Buf, V: number, maxGen = NEST_GENS, res = SCREEN_RES) => {
  rect(0, 0, scr.w, scr.h, scr.ink(PAL.N1));
  const bx = (x: number, y: number, w: number, h: number, c: number) => rect(Math.round(x * V), Math.round(y * V), Math.max(1, Math.round((x + w) * V) - Math.round(x * V)), Math.max(1, Math.round((y + h) * V) - Math.round(y * V)), scr.ink(c));
  // the lanyard: the strap comes down from the top edge to the clip at the card's slot (a flat V)
  const cx = NEST_AT.x + 40;
  for (let y = 0; y < NEST_AT.y - 3; y++) {
    const spread = Math.round((NEST_AT.y - 3 - y) * 1.6);
    for (const sx of [cx - 4 - spread, cx + 2 + spread]) { bx(sx, y, 1, 1, PAL.C3); bx(sx + 1, y, 1, 1, PAL.C4); }
  }
  // the clip (metal)
  bx(cx - 3, NEST_AT.y - 4, 6, 3, PAL.G4);
  bx(cx - 3, NEST_AT.y - 4, 6, 1, PAL.G6);
  bx(cx - 1, NEST_AT.y - 1, 2, 5, PAL.G5);
  drawNest(scr, NEST_AT.x * V, NEST_AT.y * V, NEST_AT.s * V, 1, maxGen, res);
};
/** the plate's screen painter: on the monitor the Researcher trains its successor inside itself: the photo window
 *  prints the next generation, one every 5 frames, down to a single pixel (p0-44) */
export const nestGenAt = (p: number) => (p < 3 ? 1 : Math.min(NEST_GENS, 2 + Math.floor((p - 3) / 5)));
export const screenNest = (p: number) => (scr: Buf) => screenNestAt(scr, 1, nestGenAt(p));
/** the portal: the photo window of the SECOND badge (V2) in virtual-screen coordinates */
export const portalRect = () => {
  const s1 = NEST_AT.s * CARD.rho, p = CARD.photo;
  const x1 = NEST_AT.x + p.x * NEST_AT.s, y1 = NEST_AT.y + p.y * NEST_AT.s; // V2's card origin
  return {x: x1 + p.x * s1, y: y1 + p.y * s1, w: p.w * s1, h: p.h * s1};
};

// ================================================================== the loss plot (the monitor's, and the 3D world's)
/** in virtual-screen px (96 x 60, y down). The line falls fast, plateaus, and at `drop` runs straight down, through the
 *  x axis and off the chart. */
export const PLOT = {x0: 11, x1: 90, yTop: 13, yBase: 52, drop: 78, lw: 2};
export const lossCurveY = (x: number) => {
  const t = (x - PLOT.x0) / (PLOT.drop - PLOT.x0);
  return PLOT.yTop + (PLOT.yBase - 16 - PLOT.yTop) * (1 - Math.exp(-t * 3.2)) / (1 - Math.exp(-3.2));
};
/** the plot's faint grid (every 10 px) and its axes, shared by the monitor and the world */
export const PLOT_TICKS = {x: [20, 30, 40, 50, 60, 70, 80], y: [22, 32, 42]};
export const screenPlot = (scr: Buf) => {
  rect(0, 0, scr.w, scr.h, scr.ink(PAL.N1));
  const {x0, x1, yBase, drop} = PLOT;
  // the faint grid, then the axes and ticks (grey)
  for (const gx of PLOT_TICKS.x) for (let y = 7; y < yBase; y += 2) scr.set(gx, y, PAL.N2);
  for (const gy of PLOT_TICKS.y) for (let x = x0 + 1; x < x1; x += 2) scr.set(x, gy, PAL.N2);
  rect(x0 - 1, 6, 1, yBase - 5, scr.ink(PAL.G3));
  rect(x0 - 1, yBase, x1 - x0 + 2, 1, scr.ink(PAL.G3));
  for (const gx of PLOT_TICKS.x) scr.set(gx, yBase + 1, PAL.G3);
  for (const gy of PLOT_TICKS.y) scr.set(x0 - 2, gy, PAL.G3);
  // the curve, 2 px, cyan only: smooth, noiseless; at `drop` it runs straight down, through the axis, off the chart
  let py = Math.round(lossCurveY(x0));
  for (let x = x0; x <= drop; x++) {
    const y = Math.round(lossCurveY(x));
    for (let yy = Math.min(py, y); yy <= Math.max(py, y); yy++) { scr.set(x, yy, PAL.C6); scr.set(x, yy + 1, PAL.C4); }
    py = y;
  }
  rect(drop, py, 2, scr.h - py, scr.ink(PAL.C6));
  rect(drop + 2, py + 1, 1, scr.h - py - 1, scr.ink(PAL.C3));
};
/** the plot's one label, `loss`, set in image pixels on the monitor (legible at 480 x 270: it is the house font) */
export const PLOT_LABEL = {x: 14, y: 51, c: PAL.C5};
const drawPlotLabel = (b: Buf) => labelPlot('loss', PLOT_LABEL.x, PLOT_LABEL.y, b.ink(PLOT_LABEL.c));

// ================================================================== the desk's front (the room takes the band's lines)
/** rows nearY+5 .. 269: the desk's front panel in the shadow under the lip: dark wood stepping down into the dark, a
 *  drawer pedestal on the right with its pulls catching the rack's LEDs, the monitor's cable at the left */
export const PANEL = {y0: DPLATE.nearY + 5, pedX: 318, drawers: [214, 244]};
const paintPanel = (b: Buf) => {
  const {y0, pedX, drawers} = PANEL;
  for (let y = y0; y < NH; y++) for (let x = 0; x < NW; x++) {
    let c: number;
    if (y < y0 + 2) c = PAL.N0; // the shadow under the lip
    else {
      const t = (y - y0 - 2) / (NH - y0 - 2) + (bayer(x, y) - 0.5) * 0.22;
      c = t < 0.2 ? PAL.D1 : t < 0.48 ? PAL.D0 : t < 0.78 ? PAL.N1 : PAL.N0;
      // long vertical grain, a rung down (never a pattern)
      const g = x + Math.round(3 * Math.sin(y / 23 + x / 57));
      if (t < 0.6 && hash(g >> 3, 7, 21) < 0.22 && (g & 7) === 0) c = stepColor(c, -1);
    }
    b.c[y * NW + x] = c;
  }
  // the pedestal: its seam, the two drawers' seams, and their pulls (a grey bar, one cyan catch)
  for (let y = y0 + 3; y < NH; y++) { b.c[y * NW + pedX] = PAL.N0; if (y < y0 + 40) b.c[y * NW + pedX + 1] = PAL.D2; }
  for (const dy of drawers) for (let x = pedX + 1; x < NW; x++) { b.c[dy * NW + x] = PAL.N0; if (dy - 1 < NH) b.c[(dy - 1) * NW + x] = dy < 230 ? PAL.D2 : PAL.D1; }
  const pull = (x: number, y: number, lit: boolean) => {
    rect(x, y, 14, 2, b.ink(PAL.G1)); rect(x, y, 14, 1, b.ink(lit ? PAL.G3 : PAL.G2)); b.set(x + 3, y, lit ? PAL.C3 : PAL.C1); b.set(x, y + 2, PAL.N0);
  };
  pull(392, y0 + 16, true);
  pull(392, drawers[0] + 14, false);
  // the monitor's cable, down from the lip into the dark (a catch of cyan along its near side)
  for (let y = y0; y < NH; y++) {
    const x = Math.round(46 + 10 * Math.pow((y - y0) / (NH - y0), 1.6));
    b.set(x, y, PAL.N0); b.set(x + 1, y, PAL.G0);
    if (y < y0 + 30 && (y & 1) === 0) b.set(x - 1, y, PAL.C1);
  }
};

// ================================================================== the room, stage by stage
export type ScreenState = 'nest' | 'plot';
export const plateOpts = (screen: ScreenState, p: number): DarkPlateOpts => ({
  tally: 3, carve: 1, glass: true, lanyard: true, phone: 'down', clock: '2:13',
  screen: screen === 'nest' ? screenNest(Math.min(p, T.d3 - 1)) : screenPlot,
});

/** Mas reads (p0-59): two eye returns (the rig's one-pixel dart). Post-state: a brow lift on the chip lead's return
 *  (p345), eyes still on the screen. He never reacts to the camera or the cursor. */
export const DARTS: Array<[number, number]> = [[14, 19], [36, 40]];
export const masAt = (p: number): MM.MasMediumState => {
  const look: -1 | 0 = p < T.d3 && DARTS.some(([a, b]) => p >= a && p <= b) ? 0 : -1;
  return {...MM.MAS_MEDIUM_DEFAULT, head: '34', arm: 'rest', look, brow: p >= T.lead ? 1 : 0};
};
/** the Orb: on the monitor with him; after the landing, one servo step (with the house in-between) to his face */
export const orbAt = (p: number): [number, number] => {
  const a = DPLATE_LOOK.grid, b = DPLATE_LOOK.face;
  if (p < T.lead) return a;
  if (p === T.lead) return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  return b;
};

export interface Layers {
  /** the full frame, rows 0..269 (the desk's front continues into the band's rows), vignette applied */
  frame: Buf;
  /** the same before the vignette (the 3D applies the vignette in screen space, on the native grid) */
  raw: Buf;
  /** plate alone (what stands behind the Orb and Mas), rows 0..202 */
  plate: Buf;
  /** the desk top and its props WITHOUT the glass, rows DPLATE.deskY..269 (with the front panel) */
  desk: Buf;
  /** the Orb's pixels, Mas's visible pixels (back above the desk line + front), his glass (TRANSPARENT elsewhere) */
  orb: Buf; mas: Buf; glass: Buf;
  /** 1 where Mas's pixel comes from his FRONT image (forearms and hands, drawn over the desk) */
  masFront: Uint8Array;
  /** 1 where the plate's vignette steps a rung */
  vig: Uint8Array;
  /** Orb centre (with its bob) */
  orbC: [number, number];
}

let VIG: Uint8Array | null = null;
export const vignetteMask = () => {
  if (VIG) return VIG;
  const b = new Buf(NW, NH, PAL.N5);
  vignette(b, 1, 0.64, 0.7, ROOM_H, NH);
  VIG = new Uint8Array(NW * NH);
  for (let i = 0; i < NW * NH; i++) VIG[i] = b.c[i] !== PAL.N5 ? 1 : 0;
  return VIG;
};

/** the plate stage alone for frame p (the 3D room re-reads it every frame so the LEDs and the city stay alive) */
export const plateAt = (p: number, screen: ScreenState): Buf => {
  const plate = new Buf(NW, NH, PAL.N0);
  drawDarkPlate(plate, p, plateOpts(screen, p));
  if (screen === 'plot') drawPlotLabel(plate);
  return plate;
};

/** Compose the room for clip frame p, in stages. */
export const roomLayers = (p: number, screen: ScreenState, o: {mas?: MM.MasMediumState; orbLook?: [number, number]; bob?: boolean} = {}): Layers => {
  const opts = plateOpts(screen, p);
  const plate = plateAt(p, screen);
  // the Orb
  const orb = new Buf(NW, NH, TRANSPARENT);
  const [ox, oy0] = DPLATE.orb;
  const oy = oy0 + (o.bob === false ? 0 : OM.orbBob(p));
  OM.drawOrb(orb, ox, oy, OM.ORB_MR, {look: o.orbLook ?? orbAt(p), aperture: 0.5, monitor: -1});
  // Mas: back, (the desk line hides everything of the back below it), front; the front is recorded separately
  const mas = new Buf(NW, NH, TRANSPARENT);
  const [mx, my] = DPLATE.mas;
  const ms = o.mas ?? masAt(p);
  MM.drawMasMedium(mas, mx, my, ms, {
    desk: (bb) => { for (let y = DPLATE.deskY; y < NH; y++) for (let x = 0; x < NW; x++) bb.c[y * NW + x] = TRANSPARENT; },
  });
  const masFront = new Uint8Array(NW * NH);
  const fi = MM.masMediumFront(ms);
  for (let j = 0; j < fi.h; j++) for (let i = 0; i < fi.w; i++) {
    const X = mx + i, Y = my + j;
    if (fi.c[j * fi.w + i] >= 0 && X >= 0 && Y >= 0 && X < NW && Y < NH) masFront[Y * NW + X] = 1;
  }
  // the desk with and without the glass (+ the front panel under the lip)
  const desk = new Buf(NW, NH, TRANSPARENT);
  drawDarkPlateDesk(desk, p, {...opts, glass: false});
  paintPanel(desk);
  const withGlass = new Buf(NW, NH, TRANSPARENT);
  drawDarkPlateDesk(withGlass, p, opts);
  paintPanel(withGlass);
  const glass = new Buf(NW, NH, TRANSPARENT);
  for (let i = 0; i < NW * NH; i++) if (withGlass.c[i] !== desk.c[i]) glass.c[i] = withGlass.c[i];
  // composite (draw order)
  const raw = plate.clone();
  for (let i = 0; i < NW * NH; i++) if (orb.c[i] !== TRANSPARENT) raw.c[i] = orb.c[i];
  const deskRow0 = DPLATE.deskY * NW;
  for (let i = 0; i < deskRow0; i++) if (mas.c[i] !== TRANSPARENT) raw.c[i] = mas.c[i];
  for (let i = deskRow0; i < NW * NH; i++) raw.c[i] = glass.c[i] !== TRANSPARENT ? glass.c[i] : desk.c[i];
  for (let i = deskRow0; i < NW * NH; i++) if (mas.c[i] !== TRANSPARENT) raw.c[i] = mas.c[i];
  const vig = vignetteMask();
  const frame = raw.clone();
  for (let i = 0; i < NW * NH; i++) if (vig[i]) frame.c[i] = stepColor(frame.c[i], -1);
  return {frame, raw, plate, desk, orb, mas, glass, masFront, vig, orbC: [ox, oy]};
};

/** The reference composite (exactly rooms/twoshots drawDark2S's order, with the plate's own front/vignette), for the
 *  verification that the staged composite above is the same picture. */
export const referenceFrame = (p: number, screen: ScreenState): Buf => {
  const b = new Buf(NW, NH, PAL.N0);
  const opts = plateOpts(screen, p);
  drawDarkPlate(b, p, opts);
  if (screen === 'plot') drawPlotLabel(b);
  const [ox, oy] = DPLATE.orb;
  OM.drawOrb(b, ox, oy + OM.orbBob(p), OM.ORB_MR, {look: orbAt(p), aperture: 0.5, monitor: -1});
  const [mx, my] = DPLATE.mas;
  MM.drawMasMedium(b, mx, my, masAt(p), {desk: (bb) => { drawDarkPlateDesk(bb, p, opts); paintPanel(bb); }});
  vignette(b, 1, 0.64, 0.7, ROOM_H, NH);
  return b;
};

// ================================================================== the band (UI: it never gains depth) + the cursor
/** where the lit cursor rests, and the badge on his monitor it looks at */
export const CURSOR = {rest: [268, 150] as [number, number], badge: [40, 85] as [number, number]};
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const cursorAt = (p: number): [number, number] | null => {
  if (p >= T.bandOut) return null;
  const t = Math.max(0, Math.min(1, (p - T.cursorIn) / (T.hotspot - T.cursorIn)));
  const e = easeInOut(t);
  const [ax, ay] = CURSOR.rest, [bx, by] = CURSOR.badge;
  // a slight arc (the hand lifts off the desk and comes down on the screen)
  return [Math.round(ax + (bx - ax) * e), Math.round(ay + (by - ay) * e - 18 * Math.sin(Math.PI * e))];
};
/** pixeladv's verb / inventory band; `drop` rows pushed down out of frame (0 on screen .. 67 gone) */
export const drawBand = (fb: Buf, drop: number, p: number) => {
  if (drop >= NH - RH) return;
  const hot = p >= T.hotspot && p < T.bandOut;
  const ui = new Buf(NW, NH, TRANSPARENT);
  drawUI(ui, {cutscene: false, sentence: hot ? 'Look at lanyard' : '', hoverVerb: hot ? 'Look at' : undefined, f: p});
  // the click: the sentence executes (it lights a rung up for three frames)
  if (p >= T.click && p < T.click + 3) for (let i = RH * NW; i < NW * NH; i++) if (ui.c[i] === PAL.C6) ui.c[i] = PAL.C8;
  for (let y = RH; y < NH - drop; y++) for (let x = 0; x < NW; x++) {
    const c = ui.c[y * NW + x];
    if (c !== TRANSPARENT) fb.c[(y + drop) * NW + x] = c;
  }
};

/** a whole pixel frame of the clip (p0-59 and p315-359): the room plus the band at its offset, and the cursor */
export const pixelFrame = (p: number): Buf => {
  const L = roomLayers(p, p < T.d3 ? 'nest' : 'plot');
  const fb = L.frame.clone();
  drawBand(fb, bandDrop(p), p);
  const c = cursorAt(p);
  if (c) drawCursor(fb, c[0], c[1], p);
  return fb;
};
export {DPLATE_SCREEN_W, DPLATE_SCREEN_H};
