// MR. MAS — shared room: INT. APEC CEO SUMMIT, SAN FRANCISCO — MAIN STAGE — DAY (Ep1 cold open, sc 1–3). New file
// (v3-art-a, 2026-09-27). A 480 x 203 room plate (the rail band below it is not ours), plus its tighter setups.
//
// The script's PLAN, kept: Mas's armchair at frame left, turned 3/4 to frame right toward the host's chair at frame
// right; the host is never shown above the hand (a cuff at the frame's edge, the hand on the chair's arm, the question
// card). The shared side table between the chairs: two water glasses (the host's nearer the hand, Mas's nearer him),
// the speaker's tent card, his phone face-up and dark. The tall window upstage, behind Mas and a little left of him:
// across the street the banquet hall's gold (a podium, tiny silhouettes rising in two held drawings: no one can be
// identified), and far off across the bay the one dark building with its one lit window and a silhouette's phone
// glow. The open skylight is above the table (the hailstone's way in). The camera stays downstage of the line.
// The stage is corporate blue with no wordmark on it: no real event's branding is drawn (the rail gives the place).
//
// Entry points (every one paints rows 0..202 of `b` and is deterministic on its state):
//   drawApecWide(b, f, st)       [W] the one wide (and its slow push upstage, st.push 0..APEC.pushMax whole pixels)
//   drawApec2S(b, f, st)         [2S] Mas and the Orb (sc 3: the iris steps from the phone to him; the toast is a kit)
//   drawApecMCU(b, f, st)        [MCU] Mas, the window soft behind him (the hailstone arcs across it; the lit window's
//                                phone clicks off); his portrait's near-front head with his eyes on the host
//   drawApecTable(b, f, st)      [ECU] the shared table from above: the plink, the host's slosh, the flat water line,
//                                the phone (dark / lit with the invite / accepted), the tent card legible
//   apecFreeze(b, live)          [W] sc 2's freeze: everything navy and cream except the `live` mask (Mas + his phone)
//   apecScrub(b, k)              sc 3's step down the light ramps to paper white (k 0..4, held steps)
//   APEC / hailAt(t)             the geometry, and the hailstone's whole-pixel arc (t 0..1, wide coords)
// States that move: ovation 0 | 1 (seated / risen, two held drawings), hail (arc t, or 'glass' once it has landed),
// slosh 0..3 (the host's glass), lit window on | off, Mas's pose (cast/mas-seated.ts), the Orb's look.
import {Buf, rect, line, poly, ellipse, hash, bayer, clamp} from '../px';
import {PAL, stepColor, lightness} from '../palette';
import {MatBuf, resolve, defineMat} from '../light';
import {text, textWidth} from '../font';
import {applyPalette, PALETTES} from '../palettes';
import {Mask} from '../mask';
import {blitImg} from '../figure';
import {drawMasSeated, MasSeatedPose, MAS_SEATED_DEFAULT, MAS_SEATED_GLASS} from '../cast/mas-seated';
import {masPortrait, MAS_PORTRAIT_DEFAULT, MasPortraitState} from '../cast/mas';
import {drawOrb} from '../cast/orb-medium';
import {drawCollarsPortrait, drawCollarsMedium} from '../cast/mas-collars';
import {drawMasMedium, MasMediumState, MAS_MEDIUM_DEFAULT, MAS_M_DESK} from '../cast/mas-medium';
import {micro, microWidth} from '../cast/bosses';

const RH = 203;
// ------------------------------------------------------------------ geometry (wide coords)
export const APEC = {
  ceilY: 12,
  /** the stage deck meets the backdrop */
  deckY: 146,
  /** the deck's front lip */
  lipY: 196,
  win: {x0: 30, x1: 196, y0: 24, y1: 138},
  skylight: {x0: 214, x1: 300},
  /** Mas's seat line (the anchor drawMasSeated wants) */
  masSeat: [128, 158] as [number, number],
  chair: {x0: 100, x1: 164},
  orb: [160, 96] as [number, number],
  table: {cx: 258, top: 152, rx: 30, ry: 6, foot: 190},
  masGlass: [240, 141] as [number, number],
  hostGlass: [272, 142] as [number, number],
  phone: [224, 150] as [number, number],
  tent: [250, 147] as [number, number],
  hostChair: {x0: 404},
  hand: [452, 150] as [number, number],
  /** the far building's lit window (the hailstone's source) */
  litWin: [70, 62] as [number, number],
  pushMax: 12,
};
const A = APEC;

// ------------------------------------------------------------------ materials: [stage ambient, cool (the window/skylight), warm (the stage spots)]
defineMat('ap.back', ['N1', 'N2', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6'], ['N1', 'N2', 'N3', 'N4', 'N6', 'N7', 'N8', 'G6'], ['N1', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'P1']);
defineMat('ap.panel', ['N0', 'N1', 'N2', 'F1', 'F2', 'F3', 'F4', 'F5'], ['N0', 'N1', 'N3', 'N4', 'N5', 'N6', 'N7', 'N8'], ['N0', 'N2', 'F2', 'F3', 'F4', 'F5', 'F6', 'P1']);
defineMat('ap.deck', ['N0', 'N1', 'N2', 'N3', 'N4', 'N5', 'N6', 'N7'], ['N0', 'N1', 'N2', 'N3', 'N4', 'N6', 'N7', 'N8'], ['N0', 'N2', 'N3', 'N4', 'N5', 'N6', 'N7', 'N8']);
defineMat('ap.lip', ['N0', 'N0', 'N1', 'N1', 'N2', 'N3', 'N4', 'N5'], ['N0', 'N0', 'N1', 'N2', 'N3', 'N4', 'N5', 'N6'], ['N0', 'N1', 'N2', 'N3', 'N4', 'N5', 'N6', 'N7']);
defineMat('ap.frame', ['N0', 'N1', 'N2', 'N3', 'G1', 'G2', 'G3', 'G4'], ['N0', 'N1', 'N2', 'G1', 'G2', 'G3', 'G5', 'G6'], ['N0', 'N1', 'G1', 'G2', 'G3', 'G4', 'P0', 'P1']);
defineMat('ap.chair', ['N1', 'N3', 'G2', 'G3', 'G4', 'G5', 'G6', 'P1'], ['N1', 'N3', 'G2', 'G3', 'G4', 'G5', 'G6', 'P2'], ['N1', 'G2', 'G3', 'G5', 'P0', 'P1', 'P2', 'W9']);
defineMat('ap.table', ['N0', 'N1', 'N2', 'G1', 'G2', 'G3', 'G4', 'G5'], ['N0', 'N1', 'N2', 'G2', 'G3', 'G4', 'G5', 'G6'], ['N0', 'N2', 'G1', 'G2', 'G3', 'G4', 'G6', 'P2']);
defineMat('ap.truss', ['N0', 'N0', 'N1', 'N1', 'N2', 'N3', 'G1', 'G2'], ['N0', 'N0', 'N1', 'N2', 'N3', 'N4', 'G2', 'G3'], ['N0', 'N0', 'N1', 'N2', 'G1', 'G2', 'G3', 'G4']);

// ------------------------------------------------------------------ the view through the window (emissive: its own daylight)
/** the hailstone's arc (wide coords), t 0..1: out of the lit window, over the water and the banquet, up and out of the
 *  window's top toward the skylight. Whole pixels; the caller steps t on held frames (2 f). */
export const hailAt = (t: number): [number, number] => {
  const [x0, y0] = A.litWin;
  const x1 = 208, y1 = 6; // leaves the frame's top edge left of the skylight
  const x = x0 + (x1 - x0) * t;
  const y = y0 + (y1 - y0) * t - Math.sin(Math.PI * t) * 26;
  return [Math.round(x), Math.round(y)];
};
const drawView = (b: Buf, o: {ovation: 0 | 1; litWin: boolean; x0: number; y0: number; x1: number; y1: number; dx?: number; soft?: boolean; roof?: number; archW?: number; archGap?: number}) => {
  const dx = o.dx ?? 0;
  const horizon = 82, bayTop = 84, bayBot = 93;
  for (let y = o.y0; y <= o.y1; y++)
    for (let x = o.x0; x <= o.x1; x++) {
      const X = x - dx;
      let c: number;
      if (y < horizon) {
        // a pale November overcast, brightening toward the bay
        const t = (y - 20) / (horizon - 20) + (bayer(X, y) - 0.5) * 0.18;
        c = t < 0.28 ? PAL.N8 : t < 0.62 ? PAL.G5 : t < 0.9 ? PAL.G6 : PAL.P1;
      } else if (y < bayTop) c = PAL.G5;
      else if (y < bayBot) c = ((X + y * 3) % 9 === 0 && y > bayTop + 1) ? PAL.G6 : (y - bayTop) < 3 ? PAL.N7 : PAL.N6; // the bay, glints
      else c = PAL.G4;
      b.set(x, y, c);
    }
  // far skyline across the bay (haze: low contrast greys); ONE dark building, left, with its one lit window
  for (let k = 0, x = o.x0 - 20; x < o.x1 + 20; k++) {
    const w = 5 + Math.floor(hash(k, 1, 31) * 9), top = horizon - 4 - Math.floor(hash(k, 2, 31) * 16);
    for (let y = top; y < bayTop; y++) for (let i = 0; i < w; i++) { const X = x + i + dx; if (X >= o.x0 && X <= o.x1 && y >= o.y0) b.set(X, y, i === 0 ? PAL.G6 : PAL.G5); }
    x += w + 1 + Math.floor(hash(k, 3, 31) * 3);
  }
  const [lx, ly] = A.litWin;
  for (let y = ly - 7; y < bayTop; y++) for (let x = lx - 3; x <= lx + 4; x++) { const X = x + dx; if (X >= o.x0 && X <= o.x1 && y >= o.y0) b.set(X, y, x === lx - 3 ? PAL.N4 : PAL.N3); }
  if (o.litWin) {
    // the one lit window: a warm square, a silhouette in it, and the phone's cold glow
    rect(lx - 1 + dx, ly - 1, 4, 4, b.ink(PAL.W6));
    b.set(lx + dx, ly, PAL.N1); b.set(lx + dx, ly + 1, PAL.N1); b.set(lx + dx, ly + 2, PAL.N1); b.set(lx + 1 + dx, ly + 2, PAL.N1);
    b.set(lx + 1 + dx, ly + 1, PAL.C8);
  } else rect(lx - 1 + dx, ly - 1, 4, 4, b.ink(PAL.N2));
  // the street's near side: the banquet hall across the road, a pale stone facade in daylight with a row of tall
  // arched ballroom windows glowing gold: chandeliers, the podium (a mirror image), the ovation (two held drawings)
  const roof = o.roof ?? 95;
  for (let y = roof; y <= o.y1; y++)
    for (let x = o.x0; x <= o.x1; x++) {
      const X = x - dx;
      b.set(x, y, y === roof ? PAL.P1 : y < roof + 3 ? PAL.G5 : y === roof + 3 ? PAL.G4 : ((X + 400) % 30 < 1) ? PAL.G4 : bayer(X, y) < 0.2 ? PAL.P0 : PAL.G5);
    }
  const aw = o.archW ?? 18, gap = o.archGap ?? 8, ay0 = roof + 8, ay1 = o.y1 - 3;
  const first = Math.floor((o.x0 - dx) / (aw + gap)) - 1, last = Math.ceil((o.x1 - dx) / (aw + gap)) + 1;
  for (let k = first; k <= last; k++) {
    const ax0 = k * (aw + gap) + 4 + dx, ax1 = ax0 + aw - 1;
    const podium = k === last - 2;
    for (let y = ay0; y <= ay1; y++)
      for (let x = ax0; x <= ax1; x++) {
        if (x < o.x0 || x > o.x1) continue;
        const u = (x - ax0 + 0.5) / aw, arch = ay0 + Math.round((aw / 2) * (1 - Math.sqrt(Math.max(0, 1 - (2 * u - 1) ** 2))));
        if (y < arch) continue;
        const rim = y === arch || x === ax0 || x === ax1;
        const t = (y - ay0) / (ay1 - ay0) + (bayer(x, y) - 0.5) * 0.25;
        b.set(x, y, rim ? PAL.D3 : t < 0.3 ? PAL.W8 : t < 0.62 ? PAL.W7 : PAL.W6);
      }
    const cx = Math.round((ax0 + ax1) / 2);
    if (cx > o.x0 && cx < o.x1) { b.set(cx, ay0 + 4, PAL.W9); b.set(cx - 1, ay0 + 5, PAL.W9); b.set(cx + 1, ay0 + 5, PAL.W9); b.set(cx, ay0 + 6, PAL.W8); }
    // a mullion cross in each window
    for (let y = ay0 + aw / 2; y <= ay1; y++) if (cx >= o.x0 && cx <= o.x1) b.set(cx, y, PAL.D3);
    if (podium) {
      // the podium, a mirror image of one we haven't met yet (the lectern's slope runs to the LEFT)
      const px = ax0 + 3;
      if (px > o.x0 && px + 8 < o.x1) { poly([px, ay1 - 9, px + 7, ay1 - 11, px + 7, ay1, px + 1, ay1], b.ink(PAL.D2)); rect(px - 1, ay1 - 12, 9, 2, b.ink(PAL.W4)); }
      continue;
    }
    // the ovation: tiny heads and shoulders in the window's lower third, no faces; seated / risen
    const up = o.ovation ? 3 : 0;
    for (let i = 0; i < Math.floor(aw / 4); i++) {
      const hx = ax0 + 2 + i * 4, hy = ay1 - 3 - up + (o.ovation && hash(i, k, 7) < 0.25 ? 1 : 0);
      if (hx < o.x0 || hx + 2 > o.x1) continue;
      b.set(hx, hy, PAL.N1); b.set(hx + 1, hy, PAL.N1);
      rect(hx - 1, hy + 1, 4, ay1 - hy, b.ink(PAL.N1));
      if (o.ovation && hash(i, k, 9) < 0.55) { b.set(hx - 1, hy - 2, PAL.N1); b.set(hx + 2, hy - 2, PAL.N1); } // hands up, clapping
    }
  }
  if (o.soft) {
    // the MCU's soft background: step the whole view one rung toward the haze, so it sits behind him
    for (let y = o.y0; y <= o.y1; y++) for (let x = o.x0; x <= o.x1; x++) { const c = b.get(x, y); if (bayer(x, y) < 0.5) b.set(x, y, stepColor(c, lightness(c) > 0.5 ? -1 : 1)); }
  }
};

// ------------------------------------------------------------------ the chairs, the table, the host's hand
const armchair = (mb: MatBuf, x0: number, seatY: number, facing: 1 | -1, part: 'back' | 'front') => {
  // a low stage armchair, seen 3/4: the back rises behind the sitter, the near arm in front of his hip
  const w = 56, M = mb.mat('ap.chair', 0), Mk = mb.mat('ap.chair', -1.2), Ml = mb.mat('ap.chair', 0.8);
  const X = (u: number) => (facing === 1 ? x0 + u : x0 + w - u);
  if (part === 'back') {
    poly([X(4), seatY - 34, X(20), seatY - 38, X(26), seatY - 30, X(26), seatY + 2, X(2), seatY + 4, X(0), seatY - 24], Mk);
    poly([X(6), seatY - 33, X(19), seatY - 36, X(23), seatY - 29, X(23), seatY - 4, X(5), seatY - 3], M);
    for (let y = seatY - 32; y < seatY - 6; y += 6) line(X(7), y, X(21), y - 1, mb.shade(-0.6));
    // the seat cushion and the far arm
    poly([X(0), seatY - 2, X(46), seatY - 4, X(52), seatY + 2, X(50), seatY + 9, X(2), seatY + 11], M);
    rect(Math.min(X(2), X(50)), seatY - 2, 48, 1, mb.shade(1));
    poly([X(20), seatY - 14, X(44), seatY - 16, X(46), seatY - 10, X(22), seatY - 8], Mk);
  } else {
    // the near arm: a low rounded bolster on the camera side of his hip (it never crosses his lap), and the chair's
    // skirt from the seat to the floor
    poly([X(-4), seatY - 6, X(10), seatY - 8, X(14), seatY - 3, X(14), seatY + 8, X(-2), seatY + 10, X(-6), seatY + 2], M);
    line(X(-3), seatY - 6, X(10), seatY - 8, Ml);
    poly([X(0), seatY + 9, X(50), seatY + 7, X(52), seatY + 22, X(-2), seatY + 24], Mk);
    line(X(0), seatY + 9, X(50), seatY + 7, mb.shade(0.8));
    rect(Math.min(X(4), X(46)), seatY + 24, 4, 4, mb.mat('ap.truss', 1)); rect(Math.min(X(42), X(10)), seatY + 23, 4, 4, mb.mat('ap.truss', 1));
  }
};
/** a water glass (direct colour): clear sides, the water, its line. slosh 0 flat .. 3 the splash over the rim */
export const drawStageGlass = (b: Buf, x: number, y: number, slosh: 0 | 1 | 2 | 3 = 0, big = false) => {
  const w = big ? 10 : 5, h = big ? 22 : 11, wl = big ? 6 : 3;
  for (let j = 0; j < h; j++) {
    b.set(x, y + j, PAL.G6); b.set(x + w - 1, y + j, PAL.G4);
    for (let i = 1; i < w - 1; i++) b.set(x + i, y + j, j < wl ? stepColor(b.get(x + i, y + j), 1) : i === 1 ? PAL.C7 : PAL.C6);
  }
  for (let i = 0; i < w; i++) b.set(x + i, y + h, PAL.G3);
  if (slosh === 0) for (let i = 1; i < w - 1; i++) b.set(x + i, y + wl, PAL.C8); // the one flat row
  else {
    // the surface tips, held drawings; 3 = the crown over the rim, drops in the air
    const tilt = slosh === 1 ? 1 : 2;
    for (let i = 1; i < w - 1; i++) { const yy = y + wl + Math.round(((i - w / 2) / (w / 2)) * tilt) * (slosh === 2 ? -1 : 1); b.set(x + i, yy, PAL.C8); }
    if (slosh >= 2) { b.set(x + w, y + wl - 2, PAL.C7); b.set(x + w + 1, y + wl - 1, PAL.C6); }
    if (slosh === 3) { b.set(x - 1, y - 1, PAL.C7); b.set(x + 1, y - 2, PAL.C8); b.set(x + w - 2, y - 3, PAL.C7); b.set(x + w + 1, y + 1, PAL.C6); b.set(x + w + 1, y + h - 2, PAL.C5); }
  }
};
/** the host's hand on the chair's arm with the question card; lift 0 | 1 (the card raised a little on the question) */
const hostHand = (b: Buf, lift: 0 | 1) => {
  const [hx, hy0] = A.hand, hy = hy0 - lift * 3;
  // the cuff at the frame's edge (a dark suit and a white shirt cuff): nothing above the wrist
  rect(470, hy - 1, 10, 8, b.ink(PAL.N1)); rect(468, hy, 3, 6, b.ink(PAL.P1)); rect(468, hy + 5, 3, 1, b.ink(PAL.P0));
  // the hand: back of the hand, knuckles, a thumb over the card
  const H = ['..3444444.', '.34555554.', '3455555543', '3445554433', '.34443332.', '..33322...'];
  H.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = ({'2': PAL.S2, '3': PAL.S3, '4': PAL.S4, '5': PAL.S5} as Record<string, number>)[r[i]]; if (c !== undefined) b.set(hx + 6 + i, hy + j, c); } });
  // the question card, held upright in the fingers: cream, a blue rule, two lines of nothing legible
  rect(hx - 4, hy - 13, 12, 16, b.ink(PAL.P0)); rect(hx - 3, hy - 12, 10, 14, b.ink(PAL.P2));
  rect(hx - 2, hy - 10, 8, 1, b.ink(PAL.F4)); rect(hx - 2, hy - 7, 7, 1, b.ink(PAL.G5)); rect(hx - 2, hy - 5, 5, 1, b.ink(PAL.G5));
  // the fingers over the card's lower edge
  rect(hx + 3, hy - 1, 4, 3, b.ink(PAL.S4)); b.set(hx + 3, hy + 1, PAL.S3); b.set(hx + 6, hy - 1, PAL.S5);
};
/** the speaker's tent card at wide scale (unreadable: the insert reads it) */
const tentWide = (b: Buf) => {
  const [x, y] = A.tent;
  poly([x, y + 6, x + 3, y, x + 15, y, x + 18, y + 6], b.ink(PAL.P1));
  rect(x + 3, y, 12, 1, b.ink(PAL.P2));
  rect(x + 5, y + 3, 8, 1, b.ink(PAL.N3));
};
const phoneWide = (b: Buf, lit: 'dark' | 'invite' | 'accepted') => {
  const [x, y] = A.phone;
  poly([x, y + 3, x + 2, y, x + 10, y, x + 9, y + 3], b.ink(PAL.N0));
  if (lit !== 'dark') { const c = lit === 'invite' ? PAL.P2 : PAL.C7; rect(x + 3, y + 1, 5, 1, b.ink(c)); rect(x + 2, y + 2, 6, 1, b.ink(lit === 'invite' ? PAL.G6 : PAL.C6)); }
};

// ------------------------------------------------------------------ the wide
export interface ApecWideState {
  ovation?: 0 | 1;
  /** the hailstone: arc position 0..1, 'glass' (bobbing in his glass), or null */
  hail?: number | 'glass' | null;
  slosh?: 0 | 1 | 2 | 3;
  litWin?: boolean;
  /** the slow push upstage toward the window (whole pixels; the plate trucks, the people don't scale) */
  push?: number;
  mas?: Partial<MasSeatedPose>;
  orb?: {look?: [number, number]; aperture?: number};
  phone?: 'dark' | 'invite' | 'accepted';
  /** the host's card lifted a little (the question) */
  lift?: 0 | 1;
  /** a coverage mask of what stays in colour in the freeze (Mas + his phone), filled while drawing */
  live?: Mask;
}
const wideMB = (() => { let mb: MatBuf | null = null; return () => {
  if (mb) return mb;
  mb = new MatBuf(480, RH);
  const {ceilY, deckY, lipY, win} = A;
  // ceiling: a dark grid with the truss and the open skylight
  rect(0, 0, 480, ceilY + 2, mb.mat('ap.truss', 0));
  for (let x = 0; x < 480; x += 12) line(x, 0, x + 6, ceilY, mb.shade(-0.5));
  rect(0, ceilY - 2, 480, 3, mb.mat('ap.truss', 1.2)); rect(0, ceilY - 2, 480, 1, mb.shade(1));
  for (let x = 4; x < 480; x += 8) line(x, ceilY - 2, x + 4, ceilY, mb.shade(-1));
  // the backdrop: tall corporate-blue panels with reveals, a soft top wash
  rect(0, ceilY + 1, 480, deckY - ceilY - 1, mb.mat('ap.back', 0));
  for (let x = 0; x < 480; x += 48) { rect(x, ceilY + 1, 1, deckY - ceilY - 1, mb.shade(-1.4)); rect(x + 1, ceilY + 1, 1, deckY - ceilY - 1, mb.shade(0.6)); }
  // a wide horizontal band of darker panels behind the chairs (the "set" wall), with an LED strip on its top edge
  rect(200, 88, 280, deckY - 88, mb.mat('ap.panel', 0)); rect(200, 88, 280, 1, mb.shade(1.6));
  for (let x = 200; x < 480; x += 32) rect(x, 89, 1, deckY - 89, mb.shade(-1));
  // the tall window: a heavy frame and mullions (the view is emissive, drawn after)
  rect(win.x0 - 4, win.y0 - 4, win.x1 - win.x0 + 9, win.y1 - win.y0 + 9, mb.mat('ap.frame', 0.6));
  rect(win.x0 - 4, win.y0 - 4, win.x1 - win.x0 + 9, 1, mb.shade(1));
  rect(win.x0 - 6, win.y1 + 4, win.x1 - win.x0 + 13, 3, mb.mat('ap.frame', 1.2));
  // the deck: blue carpet in depth bands, the lip
  rect(0, deckY, 480, lipY - deckY, mb.mat('ap.deck', 0));
  for (const y of [deckY, deckY + 3, deckY + 8, deckY + 15, deckY + 25, deckY + 38]) rect(0, y, 480, 1, mb.shade(-0.7));
  for (let y = deckY; y < lipY; y++) for (let x = 0; x < 480; x++) if (hash(x >> 1, y, 5) < 0.06) mb.shade(0.4)(x, y);
  rect(0, lipY, 480, RH - lipY, mb.mat('ap.lip', 0)); rect(0, lipY, 480, 1, mb.shade(1.4));
  // the side table (a round top, a pedestal)
  const t = A.table;
  ellipse(t.cx, t.top, t.rx, t.ry, mb.mat('ap.table', 0.6));
  ellipse(t.cx, t.top + 1, t.rx, t.ry, mb.mat('ap.table', -0.4));
  ellipse(t.cx, t.top, t.rx - 1, t.ry - 1, mb.mat('ap.table', 0.8));
  rect(t.cx - 2, t.top + t.ry, 5, t.foot - t.top - t.ry, mb.mat('ap.table', -0.6));
  ellipse(t.cx, t.foot, 12, 2, mb.mat('ap.table', -1));
  // the host's chair at the frame's right edge: its arm and the back of its seat
  poly([A.hostChair.x0, 148, 480, 144, 480, 176, A.hostChair.x0 + 4, 180], mb.mat('ap.chair', -0.6));
  poly([A.hostChair.x0 + 6, 142, 480, 138, 480, 152, A.hostChair.x0 + 8, 156], mb.mat('ap.chair', 0.3));
  line(A.hostChair.x0 + 6, 142, 480, 138, mb.shade(1));
  rect(A.hostChair.x0 + 8, 180, 4, 8, mb.mat('ap.truss', 1));
  // Mas's chair (the back layer; the near arm is drawn in front of him)
  armchair(mb, A.chair.x0, A.masSeat[1], 1, 'back');
  return mb;
}; })();
const wideFrontMB = (() => { let mb: MatBuf | null = null; return () => { if (mb) return mb; mb = new MatBuf(480, RH); armchair(mb, A.chair.x0, A.masSeat[1], 1, 'front'); return mb; }; })();
const wideLights = {
  amb: (x: number, y: number) => {
    let a = 4.2;
    // a soft top wash on the backdrop from the grid; the floor falls off toward the lip
    if (y < A.deckY) a += clamp(1 - (y - A.ceilY) / 140, 0, 1) * 0.8;
    else a -= (y - A.deckY) / 60;
    return a;
  },
  cyan: (x: number, y: number) => {
    // daylight from the window (the frame, the deck under it) and from the skylight onto the table
    const dw = Math.hypot((x - (A.win.x0 + A.win.x1) / 2) / 120, (y - 90) / 90);
    let L = dw < 1 ? (1 - dw) * 0.55 : 0;
    const ds = Math.hypot((x - 258) / 60, (y - 140) / 40);
    if (ds < 1) L = Math.max(L, (1 - ds) * 0.5);
    return L;
  },
  warm: (x: number, y: number) => {
    // the stage spots: two warm pools, on Mas's chair and on the host's side
    let L = 0;
    for (const [cx, cy, r] of [[134, 170, 70], [400, 172, 80]] as Array<[number, number, number]>) {
      const d = Math.hypot((x - cx) / r, (y - cy) / (r * 0.5));
      if (d < 1) L = Math.max(L, (1 - d * d) * 0.52);
    }
    if (y < A.deckY && y > 88 && x > 200) L = Math.max(L, 0.18);
    return L;
  },
  dither: 0.6,
};
const wideCache = (() => { let base: Buf | null = null; return () => {
  if (base) return base;
  base = new Buf(480, RH, PAL.N0);
  resolve(wideMB(), wideLights, base, 0);
  return base;
}; })();
const frontCache = (() => { let front: Buf | null = null; return () => {
  if (front) return front;
  front = new Buf(480, RH, 0x1000000);
  resolve(wideFrontMB(), wideLights, front, 0);
  return front;
}; })();

export const drawApecWide = (b: Buf, f: number, st: ApecWideState = {}) => {
  const push = clamp(Math.round(st.push ?? 0), 0, A.pushMax);
  // the push: the plate trucks toward the window in whole pixels (camera move, no scaling): x shifts right, y up a little
  const dx = push, dy = Math.round(push / 3);
  const W0 = new Buf(480, RH, PAL.N0);
  W0.c.set(wideCache().c);
  drawView(W0, {ovation: st.ovation ?? 0, litWin: st.litWin ?? true, x0: A.win.x0, y0: A.win.y0, x1: A.win.x1, y1: A.win.y1});
  // mullions over the view
  for (const mx of [86, 142]) { rect(mx, A.win.y0, 3, A.win.y1 - A.win.y0 + 1, W0.ink(PAL.G1)); rect(mx, A.win.y0, 1, A.win.y1 - A.win.y0 + 1, W0.ink(PAL.G3)); }
  rect(A.win.x0, 72, A.win.x1 - A.win.x0 + 1, 2, W0.ink(PAL.G1));
  // the skylight: a pale slot in the ceiling grid, open
  for (let x = A.skylight.x0; x < A.skylight.x1; x++) for (let y = 0; y < A.ceilY - 2; y++) W0.set(x, y, y < 2 ? PAL.G5 : bayer(x, y) < 0.5 ? PAL.P1 : PAL.G6);
  rect(A.skylight.x0 - 1, 0, 1, A.ceilY - 2, W0.ink(PAL.N0)); rect(A.skylight.x1, 0, 1, A.ceilY - 2, W0.ink(PAL.N0));
  // the hailstone in flight (inside the window, or high over the stage on its way to the skylight)
  if (typeof st.hail === 'number') {
    const [hx, hy] = hailAt(st.hail);
    const inWin = hx >= A.win.x0 && hx <= A.win.x1 && hy >= A.win.y0 && hy <= A.win.y1;
    if (inWin || hy < A.ceilY) { W0.set(hx, hy, PAL.C9); W0.set(hx + 1, hy, PAL.C8); W0.set(hx, hy + 1, PAL.C8); }
  }
  // table dressing
  tentWide(W0);
  const holding = st.mas?.arm === 'sip' || st.mas?.arm === 'hold';
  if (!holding) drawStageGlass(W0, A.masGlass[0], A.masGlass[1], 0);
  drawStageGlass(W0, A.hostGlass[0], A.hostGlass[1], st.slosh ?? 0);
  if (st.hail === 'glass' && !holding) { W0.set(A.masGlass[0] + 2, A.masGlass[1] + 3, PAL.C9); W0.set(A.masGlass[0] + 3, A.masGlass[1] + 3, PAL.C9); }
  const liveA = st.live?.a;
  { // the phone (in the live mask: it stays in colour through the freeze)
    const tmp = new Buf(480, RH, 0x1000000);
    phoneWide(tmp, st.phone ?? 'dark');
    for (let i = 0; i < tmp.c.length; i++) if (tmp.c[i] !== 0x1000000) { W0.c[i] = tmp.c[i]; if (liveA) liveA[i] = 255; }
  }
  // Mas in his chair, the chair's near arm in front of him, the Orb at his shoulder
  drawMasSeated(W0, A.masSeat[0], A.masSeat[1], {...MAS_SEATED_DEFAULT, ...st.mas}, {mask: liveA});
  const fr = frontCache();
  for (let i = 0; i < fr.c.length; i++) if (fr.c[i] !== 0x1000000) { W0.c[i] = fr.c[i]; if (liveA) liveA[i] = 0; }
  drawOrb(W0, A.orb[0], A.orb[1] + [0, 0, -1, -1, 0, 0, 1, 1][Math.floor(f / 8) % 8], 6, {look: st.orb?.look ?? [0.6, 0.1], aperture: st.orb?.aperture ?? 0.6, monitor: 1});
  hostHand(W0, st.lift ?? 0);
  // compose with the push offset into b (rows 0..202)
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) {
    const sx = clamp(x + dx, 0, 479), sy = clamp(y + dy - Math.round(push / 3), 0, RH - 1);
    b.c[y * b.w + x] = W0.c[sy * 480 + sx];
  }
  if (liveA && dx) {
    const shifted = new Uint8Array(liveA.length);
    for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) { const sx = clamp(x + dx, 0, 479); shifted[y * 480 + x] = liveA[y * 480 + sx]; }
    liveA.set(shifted);
  }
};

/** sc 2: the world freezes into navy and cream; `live` (Mas + his phone, from drawApecWide's st.live) stays in colour */
/** the engine's navy/cream freeze, re-curved for a bright day stage (the stock curve is tuned on night rooms, and here
 *  printed most of the frame cream with a busy screen): more of the room goes navy, the screen sits on the mids */
export const APEC_FREEZE = PALETTES['2TONE_FREEZE'].with({tone: {lo: 0.3, hi: 0.62, gamma: 1}});
export const apecFreeze = (b: Buf, live: Mask) => applyPalette(b, APEC_FREEZE, {mask: live, invert: true, rect: [0, 0, 480, RH]});

/** sc 3: the frame steps down its own light ramps to paper white, four held steps (k 1..4); 0 = untouched */
export const apecScrub = (b: Buf, k: number) => {
  if (k <= 0) return;
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) {
    const c = b.get(x, y);
    if (k >= 4) { b.set(x, y, PAL.P2); continue; }
    const L = lightness(c);
    // each step lifts everything a rung and pushes the lightest third to paper
    const up = stepColor(c, k * 2);
    b.set(x, y, L + k * 0.18 > 0.85 ? (k >= 3 || bayer(x, y) < 0.5 ? PAL.P2 : PAL.P1) : up);
  }
};

// ------------------------------------------------------------------ the 2S: Mas and the Orb (sc 3), at medium scale
export interface Apec2SState {
  /** the Orb's look ([x, y], -1..1); sc 3 steps it phone -> between -> Mas in three held drawings (APEC_2S_LOOKS) */
  orbLook?: [number, number];
  mas?: Partial<MasMediumState>;
  ovation?: 0 | 1;
  litWin?: boolean;
  collars?: 0 | 1 | 2 | 3;
}
/** sc 3's three iris drawings: on the phone (down-right, off frame), halfway, on Mas */
export const APEC_2S_LOOKS: Array<[number, number]> = [[0.55, 0.75], [0.05, 0.45], [-0.75, 0.2]];
/** [2S] a medium framing: Mas (waist-up, drawMasMedium, turned toward the host at frame right) in his chair's cream
 *  back, the Orb (r 11: the full iris) near his shoulder, the window soft behind them. */
export const drawApec2S = (b: Buf, f: number, st: Apec2SState = {}) => {
  // the backdrop: the window's view, soft, across the whole frame (the camera looks past him upstage), mullions, the set
  // wall under the sill
  drawView(b, {ovation: st.ovation ?? 0, litWin: st.litWin ?? false, x0: 0, y0: 0, x1: 479, y1: 150, dx: 90, soft: true, roof: 110, archW: 26, archGap: 12});
  for (const mx0 of [168, 344]) { rect(mx0, 0, 4, 150, b.ink(PAL.G2)); rect(mx0, 0, 1, 150, b.ink(PAL.G3)); }
  rect(0, 150, 480, 4, b.ink(PAL.G2)); rect(0, 150, 480, 1, b.ink(PAL.G4));
  for (let y = 154; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, y < 156 ? PAL.F3 : bayer(x, y) < 0.3 ? PAL.F2 : PAL.F1);
  // Mas, chest-up (the medium rig's waist falls below the frame's edge), turned toward the host (flipped: the medium
  // rig is drawn facing camera-left); the top of the chair's cream back just shows behind his far shoulder
  const mx = 96, my = 98;
  for (let y = my + 30; y < RH; y++) for (let x = mx - 6; x < mx + 44; x++) {
    const top = my + 30 + Math.round(((x - mx - 19) / 25) ** 2 * 7);
    if (y >= top) b.set(x, y, y === top ? PAL.P1 : y < top + 2 ? PAL.P0 : bayer(x, y) < 0.3 ? PAL.G4 : PAL.G5);
  }
  const ms: MasMediumState = {...MAS_MEDIUM_DEFAULT, light: 'warm', head: '34', look: 1, arm: 'down', ...st.mas};
  drawMasMedium(b, mx, my, ms, {flip: true});
  drawCollarsMedium(b, mx, my, st.collars ?? 3, {flip: true});
  // the Orb, nearer the lens than he is, at his shoulder (frame right of him, up): its full iris
  drawOrb(b, 236, 96 + [0, 0, -1, -1, 0, 0, 1, 1][Math.floor(f / 8) % 8], 11, {look: st.orbLook ?? APEC_2S_LOOKS[2], aperture: 0.7, monitor: 1});
};

// ------------------------------------------------------------------ the MCU (sc 1, sc 2)
export interface ApecMcuState {
  mas?: Partial<MasPortraitState>;
  /** the hailstone crossing the soft window behind him (t 0..1), or null */
  hail?: number | null;
  litWin?: boolean;
  ovation?: 0 | 1;
  /** sc 2: the phone's light on his jaw from below frame: none · invite (white) · accepted (pale blue) */
  phoneLight?: 'none' | 'invite' | 'accepted';
  collars?: 0 | 1 | 2 | 3;
}
/** the MCU's backdrop: the window's view, soft (one rung toward haze), wide across the frame behind him */
const drawMcuBack = (b: Buf, st: ApecMcuState) => {
  // the backdrop panels left and right of a window that fills the upper two thirds behind him
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, bayer(x, y) < 0.5 ? PAL.F2 : PAL.F3);
  drawView(b, {ovation: st.ovation ?? 0, litWin: st.litWin ?? true, x0: 150, y0: 0, x1: 470, y1: 150, dx: 150, soft: true, roof: 110, archW: 26, archGap: 12});
  // the window's frame edges and one mullion (soft: one rung down of the frame colour)
  rect(146, 0, 4, 150, b.ink(PAL.G2)); rect(470, 0, 4, 150, b.ink(PAL.G2)); rect(318, 0, 3, 150, b.ink(PAL.G2));
  rect(146, 150, 328, 4, b.ink(PAL.G2));
  // below the window: the dark set wall
  for (let y = 154; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, y < 156 ? PAL.F3 : bayer(x, y) < 0.3 ? PAL.F2 : PAL.F1);
};
/** where the hailstone is in the MCU (it crosses the soft window left to right, rising, and leaves the top) */
export const mcuHailAt = (t: number): [number, number] => [Math.round(180 + 250 * t), Math.round(96 - 88 * t - Math.sin(Math.PI * t) * 20)];
export const drawApecMCU = (b: Buf, f: number, st: ApecMcuState = {}) => {
  drawMcuBack(b, st);
  if (typeof st.hail === 'number') {
    const [hx, hy] = mcuHailAt(st.hail);
    if (hy >= 0 && hy < 150) { rect(hx, hy, 2, 2, b.ink(PAL.C9)); b.set(hx - 1, hy + 1, PAL.C7); }
  }
  // Mas: the portrait's near-front head (to the lens, ~10 degrees short of square), eyes on the host at frame right
  const s: MasPortraitState = {...MAS_PORTRAIT_DEFAULT, light: 'warm', head: 'front', look: 1, ...st.mas};
  const img = masPortrait(s);
  const X = 70, Y = 30;
  blitImg(b, img, X, Y);
  // his body continues below the portrait's bottom edge: extend the hoodie to the frame's bottom
  for (let x = 0; x < img.w; x++) {
    const c = img.c[(img.h - 1) * img.w + x];
    if (c < 0) continue;
    for (let y = Y + img.h; y < RH; y++) b.set(X + x, y, c);
  }
  drawCollarsPortrait(b, X, Y, st.collars ?? 3, {head: 'front'});
  // sc 2: the phone lighting his jaw from below frame: a clean rim on the undersides of his chin and jaw (no dither on
  // skin), white while the invite shows, the calendar's pale blue once accepted
  if (st.phoneLight && st.phoneLight !== 'none') {
    const col = st.phoneLight === 'invite' ? PAL.S6 : PAL.K4, col2 = st.phoneLight === 'invite' ? PAL.S5 : PAL.K3;
    const skin = (c: number) => c === PAL.S3 || c === PAL.S4 || c === PAL.S5 || c === PAL.S2 || c === PAL.S6;
    const hits: Array<[number, number]> = [];
    for (let y = Y + 64; y < Y + 90; y++) for (let x = X + 30; x < X + 90; x++) if (skin(b.get(x, y)) && !skin(b.get(x, y + 1))) hits.push([x, y]);
    for (const [x, y] of hits) { b.set(x, y, col); if (skin(b.get(x, y - 1))) b.set(x, y - 1, col2); }
  }
};

// ------------------------------------------------------------------ the table insert (sc 1 ECU, sc 2)
export interface ApecTableState {
  /** the hailstone in his glass: k frames since the plink (the bob, then settled), or null (not yet) */
  plink?: number | null;
  slosh?: 0 | 1 | 2 | 3;
  phone?: 'dark' | 'invite' | 'accepted';
}
/** [ECU] the shared table from a high three-quarter angle: his glass (left), the host's (right), his phone face-up
 *  beside his glass, the tent card standing across the front, legible: MAS MANALT · CEO, NOPEAI. */
export const drawApecTable = (b: Buf, f: number, st: ApecTableState = {}) => {
  // the stage carpet beyond the table's edge, then the round top (grey laminate) seen from above at ~50 degrees
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, bayer(x, y) < 0.35 ? PAL.N2 : PAL.N3);
  const TX = 240, TY = 116, TRX = 300, TRY = 120;
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) {
    const d = Math.hypot((x - TX) / TRX, (y - TY) / TRY);
    if (d > 1) continue;
    b.set(x, y, d > 0.985 ? PAL.G5 : d > 0.96 ? PAL.G2 : bayer(x, y) < 0.1 ? PAL.G4 : PAL.G3);
  }
  // the skylight's daylight across the top (held, stepped)
  for (let y = 0; y < 150; y++) for (let x = 60; x < 440; x++) { const d = Math.hypot((x - 250) / 170, (y - 60) / 70); if (d < 1 && bayer(x, y) < (1 - d) * 0.7 && b.get(x, y) !== PAL.N2 && b.get(x, y) !== PAL.N3) b.set(x, y, stepColor(b.get(x, y), 1)); }
  // a glass: its shadow, the body (clear walls, the water inside), the rim ellipse, the water's surface ellipse
  const glass = (cx: number, top: number, slosh: number, hail: number | null) => {
    const rx = 26, ry = 10, h = 58;
    for (let y = top; y < top + h + 14; y++) for (let x = cx - rx + 10; x < cx + rx + 30; x++) { const d = Math.hypot((x - cx - 20) / (rx + 4), (y - top - h - 2) / (ry + 3)); if (d < 1 && bayer(x, y) < 0.7) b.set(x, y, PAL.G2); }
    for (let y = top; y <= top + h; y++) {
      const w = rx - Math.round((y - top) * 0.06);
      for (let x = cx - w; x <= cx + w; x++) {
        const edge = x === cx - w || x === cx + w;
        const inWater = y > top + 14;
        b.set(x, y, edge ? (x < cx ? PAL.G6 : PAL.G4) : inWater ? (x < cx - w + 5 ? PAL.C7 : x > cx + w - 4 ? PAL.C4 : PAL.C5) : stepColor(b.get(x, y), 1));
      }
    }
    // the base ellipse
    for (let x = cx - rx + 4; x <= cx + rx - 4; x++) { const yy = top + h + Math.round(ry * 0.8 * Math.sqrt(Math.max(0, 1 - ((x - cx) / (rx - 4)) ** 2))); b.set(x, yy, PAL.G5); b.set(x, yy + 1, PAL.G2); }
    // the rim (top ellipse), clear
    for (let k = 0; k < 120; k++) { const a = (k / 120) * Math.PI * 2; b.set(Math.round(cx + Math.cos(a) * rx), Math.round(top + Math.sin(a) * ry), Math.sin(a) < 0 ? PAL.G6 : PAL.P1); }
    // the water's surface, 14 px down: calm = a flat disc with ONE flat highlight row
    const wy = top + 14, wrx = rx - 2, wry = ry - 2;
    for (let y = wy - wry; y <= wy + wry; y++) for (let x = cx - wrx; x <= cx + wrx; x++) if (Math.hypot((x - cx) / wrx, (y - wy) / wry) <= 1) b.set(x, y, PAL.C6);
    if (!slosh) for (let x = cx - wrx + 4; x <= cx + wrx - 4; x++) b.set(x, wy - 2, PAL.C8);
    else {
      // the surface tips and breaks; over the rim and onto the table (held drawings)
      for (let x = cx - wrx; x <= cx + wrx; x++) { const yy = wy + Math.round(((x - cx) / wrx) * (slosh * 3)); for (let y = yy - 1; y <= yy + 1; y++) b.set(x, y, PAL.C7); b.set(x, yy - 2, PAL.C8); }
      if (slosh >= 2) for (const [dx, dy] of [[rx + 2, -4], [rx + 5, 2], [rx - 2, -8]]) { rect(cx + dx, top + dy, 2, 2, b.ink(PAL.C7)); }
      if (slosh === 3) {
        for (const [dx, dy] of [[rx + 10, -10], [rx + 14, -2], [rx - 6, -16], [rx + 8, 8]]) rect(cx + dx, top + dy, 2, 3, b.ink(PAL.C6));
        // the spill on the table
        for (let y = top + h + 4; y < top + h + 12; y++) for (let x = cx + 18; x < cx + 52; x++) if (Math.hypot((x - cx - 35) / 17, (y - top - h - 8) / 4) < 1) b.set(x, y, bayer(x, y) < 0.5 ? PAL.C3 : PAL.G4);
      }
    }
    if (hail !== null) {
      // the hailstone bobbing on the water: a white stone, its surface illegible glyph noise (no letters); the bob is
      // three held drawings, then it settles; the plink's ring spreads for the first frames
      const bob = hail < 12 ? [0, -3, 1, -2, 0, 1][Math.floor(hail / 2) % 6] : 0;
      const hx = cx - 4, hy = wy - 5 + bob;
      ellipse(hx + 4, hy + 4, 6, 5, b.ink(PAL.C8)); ellipse(hx + 4, hy + 3, 5, 4, b.ink(PAL.C9));
      for (let j = 0; j < 8; j++) for (let i = 0; i < 9; i++) if (hash(i, j, 90 + (Math.floor(f / 6) % 2)) < 0.32 && Math.hypot((i - 4) / 5, (j - 3.5) / 4) < 1) b.set(hx + i, hy + j, PAL.C6);
      if (hail < 8) for (let k = 0; k < 40; k++) { const a = (k / 40) * Math.PI * 2, r = 9 + hail * 1.5; const X = Math.round(cx + Math.cos(a) * r), Y = Math.round(wy + Math.sin(a) * r * 0.4); if (Math.hypot((X - cx) / wrx, (Y - wy) / wry) < 1) b.set(X, Y, PAL.C8); }
    }
  };
  // his phone first (it lies flat, left of his glass): a foreshortened slab, dark or lit
  const P = [52, 108, 132, 100, 150, 150, 66, 160];
  poly([P[0], P[1] + 3, P[2], P[3] + 3, P[4], P[5] + 3, P[6], P[7] + 3], b.ink(PAL.G2));
  poly(P, b.ink(PAL.N0));
  const scr = st.phone === 'invite' ? PAL.P2 : st.phone === 'accepted' ? PAL.C7 : PAL.N1;
  poly([P[0] + 6, P[1] + 3, P[2] - 5, P[3] + 3, P[4] - 6, P[5] - 3, P[6] + 5, P[7] - 3], b.ink(scr));
  if (!st.phone || st.phone === 'dark') for (let k = 0; k < 20; k++) b.set(70 + k, 112 + Math.round(k * 0.35), PAL.N2); // the dark glass's one sheen
  glass(196, 34, 0, st.plink ?? null);
  glass(330, 26, st.slosh ?? 0, null);
  // the tent card standing across the front edge: its front face slanted toward us, legible
  const tx = 150, ty = 166, tw = 200, th = 30;
  poly([tx + 6, ty - 8, tx + tw - 6, ty - 8, tx + tw, ty, tx, ty], b.ink(PAL.P0)); // its top ridge, seen from above
  rect(tx + 3, ty + th, tw, 3, b.ink(PAL.G2));
  rect(tx, ty, tw, th, b.ink(PAL.P1)); rect(tx, ty, tw, 1, b.ink(PAL.P2)); rect(tx, ty + th - 1, tw, 1, b.ink(PAL.P0));
  const s = 'MAS MANALT · CEO, NOPEAI';
  text(b, s, tx + Math.round((tw - textWidth(s)) / 2), ty + 11, PAL.N2);
};

export {micro, microWidth};
