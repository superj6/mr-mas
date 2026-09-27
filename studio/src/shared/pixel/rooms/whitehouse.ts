// MR. MAS — shared room: INT. WHITE HOUSE — MEETING ROOM — DAY (Ep1 sc 13; new file, owned by the `v3-art-b` pass).
// A 480 x 203 room plate and its setups. The script's PLAN, kept: a long table across the frame; the row sits along its
// far side facing us, turned a little toward the head of the table (frame left), screen left to right MAS · RADNUS ·
// MARIO · TASYA; SIRRAH and the A / I blocks stand at the head, frame left, beside Mas's end, so the row faces her like a
// class; the door in the back wall behind the row, centre; the photographer's three tripods on OUR side of the table;
// the ceiling's security camera top right. Mas is at frame left in every shot of the row. Pomp, daylight: a cream
// wallpapered room with gilt frames and a mahogany wainscot, the key from the tall window off frame left (every rig's
// key is camera-left). The portraits are generic painted figures: no real person, no seal, no flag (guardrails).
//
// Entry points (each paints rows 0..202 of `b`; deterministic on its state):
//   drawWHWide(b, f, st)        [W] the one wide (13.01, 13.06, 13.08, 13.11, 13.12, and the photo's frame): the door
//                               (0 shut .. 3 open), NEDIB in it (a stride through, WH.nedibPath), the tripods (0..3 set,
//                               `flash`), the photographer, SIRRAH with her pointer on A or I, the blocks (AI / IA), each
//                               seat's look ('head' toward Sirrah · 'door' turned round · 'cam3' · 'cam2' · 'ceiling' ·
//                               'lens' (Mas only)), Mario's finger and his scroll on the floor, Radnus's flame
//   drawWHWall(b, f, o)         the back wall alone (soft k 0..3), for the 2S / MCU / OTS backgrounds
//   drawWH2S(b, f, st)          [2S] two busts behind the table (13.05 RADNUS + MARIO, 13.09 MAS + RADNUS): any two Imgs
//                               (the bust tier, 112 x 136) at the left / right slots, the table's top and papers in front
//   drawWHOTS(b, f, st)         [OTS] (13.13) from behind Mario's raised finger (big, frame right) onto NEDIB behind the
//                               row, the pen out; the scroll pulled out of the fleece pocket in 3 held steps
//   drawSirrahMCU(b, f, st)     [MCU] (13.02-13.04) SIRRAH right third, the blocks at MCU size left, her pointer landing
//   drawClassRow(b, pan, st)    [MCU] (13.07) the seated row drawn at close-up size on one long plate (WH_ROW.w wide), a
//                               whole-pixel pan R -> L: `pan` 0 (Tasya) .. WH_ROW.panMax (settled on Mas, at the lens)
//   drawClassPhoto(b, f, st)    [ECU] (13.14) CLASS PHOTO #1: the flash frame printed (the wide's own pixels, a print
//                               grade, a white border), Mas's hand holding it
//   drawCollarFlame(b, f, st)   [ECU] (13.10) the small flame on Radnus's collar: size 1 | 2, his hand patting (STAND-IN
//                               collar: art-a owns RADNUS's colours)
// Cast used: SIRRAH, NEDIB (cast/sirrah.ts, cast/nedib.ts), MAS (cast/mas-stand.ts, cast/mas.ts portrait), MARIO
// (cast/mario.ts), TASYA (cast/tasya-speak.ts, re-lit warm), RADNUS at room scale (cast/radnus.ts, the `v3-art-a` pass's
// rig) and at bust scale (cast/radnus-standin.ts: a STAND-IN bust in art-a's colours; art-a built no bust).
import {Buf, rect, line, poly, ellipse, hash, bayer, clamp} from '../px';
import {PAL, stepColor} from '../palette';
import {blitImg, Img} from '../figure';
import {text, textWidth} from '../font';
import {tiny} from './kit-b';
import {drawBlocks, drawTripod, drawCeilingCam, drawBlock, drawBigFlame} from '../kits/wh-props';
import {drawSirrahRoom, drawPointer, sirrahBust, SIRRAH_BUST_DEFAULT, SIRRAH_POINTER_HAND, SirrahBustState} from '../cast/sirrah';
import {drawNedibRoom, nedibBust, NEDIB_BUST_DEFAULT, NedibBustState} from '../cast/nedib';
import {masStand, MAS_STAND_DEFAULT, MAS_STAND_FOOT} from '../cast/mas-stand';
import {masPortrait, MAS_PORTRAIT_DEFAULT, MasPortraitState} from '../cast/mas';
import {marioImg, MARIO_BASE, MARIO_FOOT, marioPortraitImg, MARIO_PORTRAIT_REST, MarioPortrait, drawScroll} from '../cast/mario';
import {tasyaRoom, TASYA_ROOM_DEFAULT, TASYA_FOOT, tasyaSpeakPortrait, TASYA_PORTRAIT_DEFAULT} from '../cast/tasya-speak';
import {radnusBust, RADNUS_BUST_DEFAULT, RadnusBustState, RADNUS_COLLAR} from '../cast/radnus-standin';
import {radnus as radnusRoomA, RADNUS_FOOT} from '../cast/radnus';
import {fire} from '../kits/props';
import {ROOM_FOOT, putBustCut} from '../cast/civic-kit';

const RH = 203;
// ------------------------------------------------------------------ geometry
export const WH = {
  /** the back wall's foot (the carpet starts) */
  wallY: 132,
  wainscot: 96,
  /** the table: its top from y top0 (under the row's chests) to its near edge top1, the apron, the front panel */
  table: {x0: 112, x1: 480, top0: 138, top1: 150, apron: 156, foot: 178},
  door: {x0: 222, x1: 274, y0: 30},
  /** the seats' foot x (the standing sprites cut by the table): screen left to right */
  seats: {mas: 150, radnus: 214, mario: 282, tasya: 350} as Record<'mas' | 'radnus' | 'mario' | 'tasya', number>,
  /** the seated sprites' foot line (their heads' tops land at ≈ 106) */
  seatFoot: 186,
  sirrah: {x: 36, foot: 180},
  blocks: {x: 60, floor: 180, s: 18},
  tripods: [120, 250, 380] as [number, number, number],
  tripodFoot: 202,
  cam: [462, 8] as [number, number],
  /** NEDIB's stride in the doorway: from inside the door (x0) to his mark behind the row (x1), foot on the wall line */
  nedib: {x0: 250, x1: 262, foot: 133},
  portraits: [[36, 18], [116, 18], [318, 18], [398, 18]] as Array<[number, number]>,
};
export type WHSeat = 'mas' | 'radnus' | 'mario' | 'tasya';
export type WHLook = 'head' | 'door' | 'cam3' | 'cam2' | 'ceiling' | 'lens';

// ------------------------------------------------------------------ the back wall (cached per soft level)
const wallCache = new Map<string, Buf>();
const paintWall = (soft: number): Buf => {
  const key = String(soft);
  let b = wallCache.get(key);
  if (b) return b;
  b = new Buf(480, RH, PAL.N0);
  const {wallY, wainscot, door} = WH;
  // the window's light falls across the wall from the left: brighter near x 0, a step down past the door
  const litAt = (x: number, y: number) => 1 - x / 620 - (y < 10 ? 0.2 : 0) + (bayer(x, y) - 0.5) * 0.12;
  for (let y = 0; y < wallY; y++) for (let x = 0; x < 480; x++) {
    const L = litAt(x, y);
    let c: number;
    if (y < 5) c = y === 0 ? PAL.P0 : y < 3 ? (L > 0.55 ? PAL.P2 : PAL.P1) : y === 3 ? PAL.W5 : PAL.P0; // crown moulding, its gilt bead
    else if (y < wainscot) {
      // the damask: a quiet repeating lozenge in the paper's shadow tone
      const u = ((x + 6) % 24) - 12, v = ((y + (Math.floor((x + 6) / 24) % 2) * 14) % 28) - 14;
      const mot = Math.abs(u) / 12 + Math.abs(v) / 14 < 0.45 && Math.abs(u) / 12 + Math.abs(v) / 14 > 0.3;
      c = L > 0.72 ? PAL.P2 : L > 0.4 ? PAL.P1 : PAL.P0;
      if (mot) c = c === PAL.P2 ? PAL.P1 : c === PAL.P1 ? PAL.P0 : PAL.W3;
      if (y === 5 || y === 6) c = PAL.P0;
    } else if (y < wallY - 2) {
      // the mahogany wainscot: a lit top rail, raised panels, a dark foot
      const top = y < wainscot + 3;
      const px = (x + 8) % 56, py = y - wainscot - 7;
      const panel = px > 4 && px < 52 && py >= 0 && py < wallY - wainscot - 14;
      const edge = panel && (px === 5 || py === 0);
      const edgeD = panel && (px === 51 || py === wallY - wainscot - 15);
      c = top ? (y === wainscot ? PAL.W4 : PAL.D4) : edge ? (L > 0.5 ? PAL.W3 : PAL.D4) : edgeD ? PAL.D1 : panel ? (L > 0.6 ? PAL.D3 : PAL.D2) : PAL.D3;
    } else c = PAL.D1;
    b.set(x, y, c);
  }
  // the window at the far left edge: a sliver of daylight between two heavy gold drapes
  for (let y = 5; y < wallY; y++) for (let x = 0; x < 20; x++) {
    const drape = x < 7 || x > 15;
    const fold = drape && (x % 3 === 0);
    b.set(x, y, drape ? (fold ? PAL.W3 : x < 7 ? PAL.W5 : PAL.W4) : y < 90 ? (bayer(x, y) < 0.6 ? PAL.W9 : PAL.P2) : PAL.P2);
  }
  // the portraits: gilt frames round dark oil paintings of generic sitters (a face-shaped glow, a coat, a collar)
  for (const [px, py] of WH.portraits) {
    const w = 44, h = 60;
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
      const X = px + i, Y = py + j;
      const e = Math.min(i, j, w - 1 - i, h - 1 - j);
      if (e < 4) { b.set(X, Y, e === 0 ? PAL.W2 : e === 1 ? (i < w / 2 || j < h / 2 ? PAL.W7 : PAL.W5) : e === 2 ? PAL.W6 : PAL.W3); continue; }
      const cx = w / 2, fy = 22, d = Math.hypot((i - cx) / 7, (j - fy) / 9);
      let c = bayer(X, Y) < 0.5 ? PAL.D0 : PAL.D1;
      if (d < 1) c = d < 0.55 ? PAL.S3 : bayer(X, Y) < 0.6 ? PAL.S2 : PAL.D2; // the sitter's face, soft (painted, no features)
      if (j > 32 && Math.abs(i - cx) < 6 + (j - 32) * 0.7) c = j < 36 && Math.abs(i - cx) < 3 ? PAL.P0 : bayer(X, Y) < 0.3 ? PAL.N2 : PAL.N1; // the coat, the collar
      if (e === 4) c = PAL.D0;
      b.set(X, Y, c);
    }
    // a small brass plate under each, unreadable
    rect(px + 16, py + h + 2, 12, 4, b.ink(PAL.W5)); rect(px + 16, py + h + 5, 12, 1, b.ink(PAL.W3));
  }
  // the door's surround: a pediment, the architrave (the door leaves are drawn per state)
  const {x0, x1, y0} = door;
  rect(x0 - 8, y0 - 12, x1 - x0 + 16, 5, b.ink(PAL.P2)); rect(x0 - 8, y0 - 8, x1 - x0 + 16, 1, b.ink(PAL.P0));
  poly([x0 - 10, y0 - 12, x1 + 10, y0 - 12, (x0 + x1) / 2, y0 - 22], b.ink(PAL.P1));
  line(x0 - 10, y0 - 12, (x0 + x1) / 2, y0 - 22, b.ink(PAL.P2));
  rect(x0 - 5, y0 - 5, x1 - x0 + 10, wallY - y0 + 5, b.ink(PAL.P1));
  rect(x0 - 5, y0 - 5, 2, wallY - y0 + 5, b.ink(PAL.P2)); rect(x1 + 3, y0 - 5, 2, wallY - y0 + 5, b.ink(PAL.P0));
  // the carpet: navy, a gold border band just off the wall, then the big medallion's ring under the table
  for (let y = wallY; y < RH; y++) for (let x = 0; x < 480; x++) {
    const d = y - wallY;
    let c = d < 2 ? PAL.N2 : bayer(x, y) < 0.5 - d / 200 ? PAL.N4 : PAL.N3;
    if (d >= 5 && d < 8) c = d === 5 ? PAL.W5 : PAL.W3;
    const r = Math.hypot((x - 300) / 2.6, (y - 196) * 1.0);
    if (r > 84 && r < 88) c = PAL.W4;
    if (r > 88 && r < 89.5) c = PAL.W2;
    b.set(x, y, c);
  }
  // soften (for the close backgrounds): whole rungs down, never a blur
  if (soft) for (let i = 0; i < b.c.length; i++) b.c[i] = stepColor(b.c[i], -soft);
  wallCache.set(key, b);
  return b;
};
/** the door's leaves: 0 shut · 1 ajar · 2 half · 3 open (the right leaf swung in, the warm hall beyond) */
const drawDoor = (b: Buf, open: number, soft = 0) => {
  const {x0, x1, y0} = WH.door;
  const y1 = WH.wallY - 1, mx = (x0 + x1) >> 1;
  const S = (c: number) => stepColor(c, -soft);
  // the hall beyond (only where a leaf has swung away)
  const gap = [0, 6, 14, 26][open];
  for (let y = y0; y <= y1; y++) for (let x = mx; x < mx + gap && x <= x1; x++) b.set(x, y, S(y < 70 ? PAL.W3 : bayer(x, y) < 0.5 ? PAL.W3 : PAL.W2));
  const leaf = (lx0: number, lx1: number, lit: boolean) => {
    for (let y = y0; y <= y1; y++) for (let x = lx0; x <= lx1; x++) {
      const i = x - lx0, j = y - y0, w = lx1 - lx0;
      const pan = (j > 6 && j < 42) || (j > 50 && j < y1 - y0 - 8);
      const pe = pan && (i === 4 || i === w - 4) || (i > 4 && i < w - 4 && (j === 7 || j === 51));
      const pd = pan && (i === 5 || i === w - 3) || (i > 4 && i < w - 4 && (j === 41 || j === y1 - y0 - 9));
      b.set(x, y, S(i === 0 ? PAL.P0 : pe ? PAL.P2 : pd ? PAL.P0 : lit ? PAL.P2 : PAL.P1));
    }
  };
  leaf(x0, mx - 1, true);
  if (open === 0) leaf(mx, x1, false);
  else {
    // the right leaf swung in: a narrow foreshortened slab against the frame
    const w = [26, 20, 12, 5][open];
    for (let y = y0; y <= y1; y++) for (let x = x1 - w + 1; x <= x1; x++) b.set(x, y, S(x === x1 - w + 1 ? PAL.P2 : PAL.P0));
  }
  // the knobs (brass)
  b.set(mx - 3, 84, S(PAL.W6)); b.set(mx - 3, 85, S(PAL.W4));
  if (open === 0) { b.set(mx + 2, 84, S(PAL.W6)); b.set(mx + 2, 85, S(PAL.W4)); }
};
export const drawWHWall = (b: Buf, f: number, o: {soft?: 0 | 1 | 2 | 3; door?: 0 | 1 | 2 | 3} = {}) => {
  const w = paintWall(o.soft ?? 0);
  b.c.set(w.c.subarray(0, 480 * RH));
  drawDoor(b, o.door ?? 0, o.soft ?? 0);
  drawCeilingCam(b, WH.cam[0], WH.cam[1], f);
};

// ------------------------------------------------------------------ the table
const drawTable = (b: Buf, o: {glasses?: boolean} = {}) => {
  const {x0, x1, top0, top1, apron, foot} = WH.table;
  // the top: mahogany with the window's sheen near the left end, a long reflection band
  for (let y = top0; y < top1; y++) for (let x = x0; x < x1; x++) {
    const sheen = x < 240 && y > top0 + 2 && y < top0 + 6 && bayer(x, y) < 0.7 - (x - x0) / 200;
    b.set(x, y, sheen ? PAL.W4 : y === top0 ? PAL.D2 : (hash(x >> 3, y, 3) < 0.5 ? PAL.D3 : PAL.D4));
  }
  rect(x0, top1, x1 - x0, 1, b.ink(PAL.W4));
  rect(x0, top1 + 1, x1 - x0, apron - top1 - 1, b.ink(PAL.D3));
  rect(x0, apron - 1, x1 - x0, 1, b.ink(PAL.D1));
  // the front panel: vertical panels, the lit edge of each
  for (let y = apron; y < foot; y++) for (let x = x0; x < x1; x++) {
    const px = (x - x0) % 40;
    b.set(x, y, px === 2 ? PAL.D3 : px === 37 ? PAL.D0 : y > foot - 3 ? PAL.D0 : PAL.D2);
  }
  rect(x0, top0, 2, foot - top0, b.ink(PAL.D4)); rect(x0, top0, 1, foot - top0, b.ink(PAL.W4));
  // the shadow under the near edge onto the carpet
  for (let x = x0; x < x1; x++) { b.set(x, foot, PAL.N1); b.set(x, foot + 1, PAL.N2); }
  if (o.glasses !== false) {
    // a water glass and a name tent before each seat (the tents blank at this size), a leather folio
    for (const s of ['mas', 'radnus', 'mario', 'tasya'] as WHSeat[]) {
      const x = WH.seats[s];
      rect(x - 13, top0 + 3, 9, 5, b.ink(PAL.P2)); rect(x - 13, top0 + 7, 9, 1, b.ink(PAL.P0)); line(x - 13, top0 + 3, x - 5, top0 + 3, b.ink(PAL.W9));
      rect(x + 6, top0 + 1, 3, 7, b.ink(PAL.C3)); b.set(x + 6, top0 + 3, PAL.C7); rect(x + 6, top0 + 3, 3, 1, b.ink(PAL.C6));
    }
  }
};

// ------------------------------------------------------------------ the row (room scale)
/** the head's box in a room sprite image (its top 17 opaque rows) */
const headBox = (img: Img): {x0: number; x1: number; y0: number} => {
  let y0 = -1;
  for (let y = 0; y < img.h && y0 < 0; y++) for (let x = 0; x < img.w; x++) if (img.c[y * img.w + x] >= 0) { y0 = y; break; }
  let x0 = img.w, x1 = -1;
  for (let y = y0; y < y0 + 13; y++) for (let x = 0; x < img.w; x++) if (img.c[y * img.w + x] >= 0) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); }
  return {x0, x1, y0};
};
/** the back of a head (turned round to the door): the hair's back, an ear edge, no face */
const BACKS: Record<'radnus' | 'mario' | 'tasya', {rows: string[]; pal: Record<string, number>}> = {
  radnus: {rows: ['....hhhhhhh.....', '..hhHHHHHHHhh...', '.hHHHHHHHHHHHh..', '.hHHHHHHHHHHHh..', 'hHHHHHHHHHHHHHh.', 'hHHHHHHHHHHHHHh.', 'hHHHHHHHHHHHHHh.', 'ohHHHHHHHHHHHho.', 'o1hHHHHHHHHHh1o.', '.o1hhHHHHHhh1o..', '..o11hhhhh11o...', '...o1122211o....', '....o12221o.....', '.....o111o......'],
    pal: {h: PAL.B1, H: PAL.B2, o: PAL.S0, '1': PAL.S2, '2': PAL.S3}},
  mario: {rows: ['...cCcCcCcCc....', '.cCcCCcCCcCcCc..', 'cCcCCcCcCCcCcCc.', 'CcCCcCCcCCcCCcC.', 'cCcCCcCcCcCCcCc.', 'CCcCcCCcCCcCcCC.', 'cCcCCcCcCcCCcCc.', 'CcCcCCcCCcCcCcC.', 'ocCcCcCcCcCcCco.', '.o1cCcCcCcCc1o..', '..o11cCcCc11o...', '...o1122211o....', '....o12221o.....', '.....o111o......'],
    pal: {c: PAL.B1, C: PAL.B3, o: PAL.S0, '1': PAL.S2, '2': PAL.S3}},
  tasya: {rows: ['....sssssss.....', '..sSSSSSSSSSs...', '.sSSSSSSSSSSSs..', '.sSSSSSSSSSSSs..', 'sSSSSSSSSSSSSSs.', 'sSSSSSSSSSSSSSs.', 'gSSSSSSSSSSSSSg.', 'ogSSSSSSSSSSSgo.', 'ogggSSSSSSSgggo.', '.oggggggggggo...', '..o1gggggggo....', '...o1122211o....', '....o12221o.....', '.....o111o......'],
    pal: {s: PAL.S2, S: PAL.S3, g: PAL.G3, o: PAL.S0, '1': PAL.S2, '2': PAL.S3}},
};
/** Mas's room head turned to the lens (the photo): both eyes, the cowlick, level and calm */
const MAS_FRONT = ['.....hHHIJ......', '...hHHHHHIJh....', '..hHHHHHHHHHh...', '.hHHHHHHHHHHHh..', '.hHH2233333HHh..', 'hHH223344432HHh.', 'hH12bb3443bb21h.', 'o112eE3443Ee211o', 'o1123344443321o.', '.o122334433221o.', '..o12233332211o.', '..o122mmmm221o..', '...o12233221o...', '....o112211o....', '.....oo11oo.....'];
const MAS_FRONT_PAL: Record<string, number> = {h: PAL.B1, H: PAL.B2, I: PAL.B3, J: PAL.B4, o: PAL.S0, '1': PAL.S2, '2': PAL.S3, '3': PAL.S4, '4': PAL.S5, b: PAL.B1, e: PAL.N0, E: PAL.P1, m: PAL.S2};
const stampRows = (b: Buf, x: number, y: number, rows: string[], pal: Record<string, number>, clip?: (x: number, y: number) => boolean) => rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = pal[r[i]]; if (c !== undefined && (!clip || clip(x + i, y + j))) b.set(x + i, y + j, c); } });

export interface WHRowState {
  look?: Partial<Record<WHSeat, WHLook>>;
  /** Mario's finger: 0 down · 1 half up · 2 all the way up */
  finger?: 0 | 1 | 2;
  /** Radnus's collar flame: 0 · 1 · 2 (size) */
  flame?: 0 | 1 | 2;
  /** the scroll on the floor from Mario's pocket (px of paper past the pocket; the floor is hidden by the table: it
   *  shows past the table's right end, as a strip on the carpet) */
  scroll?: number;
  mouths?: Partial<Record<WHSeat, 'rest' | 'open' | 'smile'>>;
}
const imgMas = (look: WHLook, mouth: 'rest' | 'open' | 'smile') => masStand({...MAS_STAND_DEFAULT, mouth: mouth === 'smile' ? 'rest' : mouth});
/** draw one seated figure (a standing sprite cut by the table), its head turned per `look` */
const drawSeat = (b: Buf, who: WHSeat, look: WHLook, st: WHRowState, f: number) => {
  const x = WH.seats[who], footY = WH.seatFoot;
  const clip = (_x: number, y: number) => y < WH.table.top0 + 1;
  // the chair's high back behind the shoulders: burgundy leather, brass nails along its edge
  const cy = footY - 80 + 12;
  for (let j = 0; j < WH.table.top0 - cy; j++) for (let i = -14; i <= 14; i++) {
    const X = x + i + 2, Y = cy + j, e = Math.abs(i) === 14 || j === 0;
    if (j < 3 && Math.abs(i) > 11) continue;
    b.set(X, Y, e ? (j === 0 ? PAL.R1 : PAL.R0) : Math.abs(i) === 12 && j % 3 === 0 ? PAL.W5 : i < -4 ? PAL.R1 : PAL.R0);
  }
  let img: Img, fx: number, fy: number;
  const faceLeft = !(look === 'cam3');
  if (who === 'mas') { img = imgMas(look, st.mouths?.mas ?? 'rest'); [fx, fy] = MAS_STAND_FOOT; }
  else if (who === 'tasya') { img = tasyaRoom({...TASYA_ROOM_DEFAULT, arm: 'clasp', mouth: st.mouths?.tasya ?? 'smile'}); [fx, fy] = TASYA_FOOT; }
  else if (who === 'mario') { const fg = st.finger ?? 0; img = marioImg({...MARIO_BASE, arm: fg === 2 ? 'raise2' : fg === 1 ? 'raise' : 'down', mouth: st.mouths?.mario === 'open' ? 1 : 0}); [fx, fy] = MARIO_FOOT; }
  else { img = radnusRoomA({arm: 'fold', fire: null, blink: false, mouth: st.mouths?.radnus === 'open' ? 'open' : 'smile', light: 'room'}); [fx, fy] = RADNUS_FOOT; }
  // every room sprite faces screen-right except art-a's RADNUS (authored facing left)
  const flip = who === 'radnus' ? !faceLeft : faceLeft;
  const ox = x - (flip ? img.w - 1 - fx : fx), oy = footY - fy;
  blitImg(b, img, ox, oy, {flip, clip});
  // turned round to the door: the back of the head replaces the face
  if (look === 'door' && who !== 'mas') {
    const hb = headBox(img);
    const hx0 = ox + (flip ? img.w - 1 - hb.x1 : hb.x0), hw = hb.x1 - hb.x0 + 1;
    const bk = BACKS[who];
    stampRows(b, hx0 + Math.round((hw - 16) / 2), oy + hb.y0, bk.rows, bk.pal, clip);
  }
  if (look === 'lens' && who === 'mas') {
    const hb = headBox(img);
    const hx0 = ox + (flip ? img.w - 1 - hb.x1 : hb.x0), hw = hb.x1 - hb.x0 + 1;
    stampRows(b, hx0 + Math.round((hw - 16) / 2), oy + hb.y0, MAS_FRONT, MAS_FRONT_PAL, clip);
  }
  if (who === 'radnus' && st.flame) fire(b, x + (flip ? -3 : 3), footY - 80 + 19, st.flame === 2 ? 'M' : 'S', f, {seed: 3});
  return {ox, oy, img, flip};
};

// ------------------------------------------------------------------ the wide
export interface WHWideState extends WHRowState {
  door?: 0 | 1 | 2 | 3;
  /** NEDIB in the doorway: t 0..1 along his stride (null = not there) */
  nedib?: {t: number; mouth?: 'rest' | 'open' | 'smile'; arm?: 'baton' | 'point'} | null;
  tripods?: 0 | 1 | 2 | 3;
  flash?: 0 | 1 | 2;
  /** the photographer: 'none' | 'set' (setting a tripod, bent) | 'stand' (behind tripod 3, back to us) */
  photographer?: 'none' | 'set' | 'stand';
  blocks?: 'AI' | 'IA';
  /** Sirrah's pointer: on 'A' | 'I' | 'row' (pointing at the class) | null (down); null sirrah = not in frame */
  sirrah?: {on: 'A' | 'I' | 'row' | null; mouth?: 'rest' | 'open' | 'smile'} | null;
}
export const drawWHWide = (b: Buf, f: number, st: WHWideState = {}) => {
  drawWHWall(b, f, {door: st.door ?? 0});
  // NEDIB comes through the door behind the row (drawn before the row: he is behind it)
  if (st.nedib) {
    const {x0, x1, foot} = WH.nedib;
    const x = Math.round(x0 + (x1 - x0) * clamp(st.nedib.t, 0, 1));
    const legs = st.nedib.t >= 1 ? 'stand' : (['w0', 'w1', 'w2', 'w3'] as const)[Math.floor(f / 3) % 4];
    drawNedibRoom(b, x, foot, {legs, arm: st.nedib.arm ?? 'baton', mouth: st.nedib.mouth ?? 'open', light: 'day'}, {flip: true});
  }
  const look = st.look ?? {};
  for (const s of ['mas', 'radnus', 'mario', 'tasya'] as WHSeat[]) drawSeat(b, s, look[s] ?? 'head', st, f);
  drawTable(b);
  // the scroll: it has slid out of Mario's pocket, down past the table's front and onto the carpet (whole px)
  if (st.scroll) {
    const sx = WH.seats.mario + 6, len = Math.round(st.scroll);
    for (let j = 0; j < Math.min(len, 26); j++) for (let i = 0; i < 7; i++) b.set(sx + i, WH.table.foot + j - 26 + 26, j < 26 ? (i === 0 ? PAL.P0 : PAL.P2) : PAL.P2);
    if (len > 26) for (let i = 0; i < len - 26; i++) for (let j = 0; j < 4; j++) b.set(sx + 7 + i, WH.table.foot + 22 + j, j === 0 ? PAL.P2 : j === 3 ? PAL.P0 : (i % 3 === 1 && j === 2 ? PAL.N4 : PAL.P1));
  }
  // SIRRAH at the head with the blocks
  const bl = drawBlocks(b, WH.blocks.x, WH.blocks.floor, WH.blocks.s, {order: st.blocks ?? 'AI', hit: st.sirrah?.on === 'A' || st.sirrah?.on === 'I' ? st.sirrah.on : null});
  if (st.sirrah !== null) {
    const s = st.sirrah ?? {on: 'A' as const};
    const [hx, hy] = drawSirrahRoom(b, WH.sirrah.x, WH.sirrah.foot, {legs: 'stand', arm: s.on ? 'point' : 'clasp', mouth: s.mouth ?? 'smile'});
    if (s.on === 'A' || s.on === 'I') drawPointer(b, hx, hy, bl[s.on][0], bl[s.on][1] - 4, 1);
    else if (s.on === 'row') drawPointer(b, hx, hy, hx + 24, hy - 10, 1);
  }
  // the tripods on our side of the table, and the photographer
  const n = st.tripods ?? 0;
  for (let i = 0; i < n; i++) drawTripod(b, WH.tripods[i], WH.tripodFoot, (i + 1) as 1 | 2 | 3, {h: 48, flash: st.flash});
  if (st.photographer && st.photographer !== 'none') drawPhotographer(b, st.photographer === 'set' ? WH.tripods[Math.max(0, n - 1)] + 18 : 452, RH + 6, st.photographer === 'set');
  return {blocks: bl};
};

// ------------------------------------------------------------------ the photographer (back to us)
const PHOTOG_HEAD = ['....hhhhhhh.....', '..hhHHHHHHHhh...', '.hHHHHHHHHHHHh..', 'hHHHHHHHHHHHHHh.', 'hHHHHHHHHHHHHHh.', 'hHHHHHHHHHHHHHh.', 'ohHHHHHHHHHHHho.', 'o1hHHHHHHHHHh1o.', '.o1hhhhhhhhh1o..', '..o112222211o...', '...o1122211o....', '....o12221o.....'];
const drawPhotographer = (b: Buf, x: number, footY: number, bent: boolean) => {
  // a dark jacket seen from behind, a camera strap across the back, square and plain (an unnamed staffer)
  const top = footY - 84 + (bent ? 8 : 0);
  const J = PAL.N1, Jl = PAL.N3, Jd = PAL.N0;
  for (let j = 0; j < 44; j++) for (let i = -12; i <= 12; i++) {
    const w = j < 4 ? 8 + j : 12;
    if (Math.abs(i) > w) continue;
    b.set(x + i, top + 16 + j, Math.abs(i) === w ? Jd : i < -7 ? Jl : J);
  }
  line(x - 9, top + 18, x + 8, top + 42, b.ink(PAL.G2)); // the camera strap
  for (let j = 0; j < 24; j++) { b.set(x - 6 + (j > 20 ? 1 : 0), top + 60 + j, PAL.N2); b.set(x + 5, top + 60 + j, PAL.N1); rect(x - 7, top + 60 + j, 5, 1, b.ink(PAL.N2)); rect(x + 2, top + 60 + j, 5, 1, b.ink(PAL.N1)); }
  stampRows(b, x - 8, top + 3, PHOTOG_HEAD, {h: PAL.B0, H: PAL.B1, o: PAL.S0, '1': PAL.S2, '2': PAL.S3});
};

/** TASYA's speaking portrait is painted for his slate room (skin under cyan); in the White House's daylight the same
 *  drawing is re-lit warm by a ramp swap (never a redraw): the cyan-lit skin to the warm skin ramp, the cyan rims to gold */
const WARM_OF = new Map<number, number>([
  [PAL.K0, PAL.S1], [PAL.K1, PAL.S2], [PAL.K2, PAL.S3], [PAL.K3, PAL.S4], [PAL.K4, PAL.S5], [PAL.K5, PAL.S6],
  [PAL.X0, PAL.S1], [PAL.X1, PAL.S2], [PAL.X2, PAL.S3], [PAL.X3, PAL.S3], [PAL.C2, PAL.W3], [PAL.C4, PAL.W4], [PAL.C7, PAL.W7], [PAL.C8, PAL.W8],
]);
export const warmRelit = (im: Img): Img => ({w: im.w, h: im.h, c: im.c.map((v) => (v < 0 ? v : WARM_OF.get(v) ?? v))});

// ------------------------------------------------------------------ the two-shot (13.05, 13.09)
export interface WH2SState {
  /** the busts (112 x 136) and whether each is flipped; L sits at x 70, R at x 272 by default */
  L: {img: Img; flip?: boolean; dx?: number};
  R: {img: Img; flip?: boolean; dx?: number};
  /** the scroll hanging past the table's edge under the right-hand bust (Mario's), px */
  scroll?: number;
  /** the pen writing (Radnus writes it down): the notepad on the table under the left bust */
  pad?: boolean;
  /** the small flame on Radnus's collar (13.09): which slot he is in, and its size */
  flame?: {slot: 'L' | 'R'; size: 1 | 2} | null;
}
export const WH2S = {L: 70, R: 272, y: 24, table: 150};
export const drawWH2S = (b: Buf, f: number, st: WH2SState) => {
  // the back wall, soft 1, a step closer (the portraits and the door behind them)
  drawWHWall(b, f, {soft: 1});
  const put = (im: Img, x: number, flip?: boolean) => putBustCut(b, im, x, WH2S.y, WH2S.table, flip);
  put(st.L.img, WH2S.L + (st.L.dx ?? 0), st.L.flip);
  put(st.R.img, WH2S.R + (st.R.dx ?? 0), st.R.flip);
  if (st.flame) {
    const sl = st.flame.slot === 'L' ? st.L : st.R, x0 = (st.flame.slot === 'L' ? WH2S.L : WH2S.R) + (sl.dx ?? 0);
    const cx = sl.flip ? x0 + sl.img.w - 1 - RADNUS_COLLAR[0] : x0 + RADNUS_COLLAR[0];
    drawBigFlame(b, cx, WH2S.y + RADNUS_COLLAR[1], st.flame.size === 2 ? 14 : 9, f);
  }
  // the table top at this size: mahogany, the window's sheen, papers, a glass
  for (let y = WH2S.table; y < RH; y++) for (let x = 0; x < 480; x++) {
    const d = y - WH2S.table;
    const sheen = x < 200 && d > 4 && d < 10 && bayer(x, y) < 0.6 - x / 400;
    b.set(x, y, d === 0 ? PAL.W4 : sheen ? PAL.W4 : hash(x >> 4, d >> 1, 8) < 0.5 ? PAL.D3 : PAL.D4);
  }
  // his glass (a water glass, the flat line) and folios
  rect(40, WH2S.table + 18, 60, 30, b.ink(PAL.D1)); rect(41, WH2S.table + 19, 58, 28, b.ink(PAL.R0)); rect(41, WH2S.table + 19, 58, 1, b.ink(PAL.R1));
  rect(380, WH2S.table + 10, 70, 40, b.ink(PAL.P1)); rect(380, WH2S.table + 10, 70, 1, b.ink(PAL.P2)); for (let k = 0; k < 5; k++) rect(386, WH2S.table + 18 + k * 6, 50 - k * 4, 1, b.ink(PAL.P0));
  if (st.pad) { rect(150, WH2S.table + 20, 46, 28, b.ink(PAL.P2)); rect(150, WH2S.table + 20, 46, 3, b.ink(PAL.W7)); for (let k = 0; k < 3; k++) for (let i = 0; i < 30 - k * 6; i++) if ((i + k) % 5 !== 4) b.set(154 + i, WH2S.table + 28 + k * 5, PAL.N4); }
  if (st.scroll) {
    // the scroll's free end dropping past the table's front edge (the floor is below frame)
    const x = WH2S.R + 80, len = Math.min(Math.round(st.scroll), RH - WH2S.table);
    for (let j = 0; j < len; j++) for (let i = 0; i < 9; i++) b.set(x + i + Math.round(Math.sin(j / 7)), WH2S.table + j, i === 0 ? PAL.P0 : i === 8 ? PAL.P2 : j % 4 === 2 && i > 1 && i < 7 ? PAL.N4 : PAL.P1);
  }
};

// ------------------------------------------------------------------ the OTS from behind Mario's finger (13.13)
export interface WHOTSState {
  nedib: Partial<NedibBustState>;
  /** Mario's finger in the foreground: 1 half · 2 all the way up */
  finger: 1 | 2;
  /** the scroll pulled out of his pocket: 0 in · 1 · 2 · 3 out (held steps) · 4 the WHOLE scroll out, held up in his
   *  other hand, its long tail falling away out of frame (the script's draft 6, 13.13) */
  scroll: 0 | 1 | 2 | 3 | 4;
}
/** Mario's raised index finger seen from behind (the back of the right hand): finger on the thumb side, the thumb, the
 *  knuckle ridge stepping down away from it, the fleece cuff. Lit from the left, outlined on the shadow side. */
export const drawIndexUp = (b: Buf, x: number, y: number, F: number[]) => {
  const W = 40, H = 100;
  const m = new Uint8Array(W * H);
  const cap = (x0: number, y0: number, x1: number, y1: number, r: number) => {
    for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
      const t = clamp(((i - x0) * (x1 - x0) + (j - y0) * (y1 - y0)) / ((x1 - x0) ** 2 + (y1 - y0) ** 2 || 1), 0, 1);
      if (Math.hypot(i - (x0 + (x1 - x0) * t), j - (y0 + (y1 - y0) * t)) <= r) m[j * W + i] = 1;
    }
  };
  cap(14, 40, 5, 8, 4.4);            // the index finger, up and leaning toward NEDIB (a raised point, never a gesture)
  cap(21, 48, 23, 60, 12);           // the fist (the back of the hand)
  cap(19, 40, 20, 42, 4.4); cap(26, 42, 27, 44, 4.4); cap(32, 45, 33, 47, 4.1); // the knuckles, stepping down away
  cap(5, 42, 3, 52, 4.2);            // the thumb standing off the thumb side
  const inM = (i: number, j: number) => i >= 0 && j >= 0 && i < W && j < H && m[j * W + i] === 1;
  for (let j = 0; j < 72; j++) for (let i = 0; i < W; i++) {
    if (!inM(i, j)) continue;
    const edgeL = !inM(i - 1, j) || !inM(i, j - 1), edgeR = !inM(i + 1, j) || !inM(i, j + 1);
    const inThumb = Math.hypot(i - 7, j - 51) < 9 && i < 10;
    let c = i < 9 ? PAL.S5 : i < 16 ? PAL.S4 : i < 26 ? PAL.S4 : PAL.S3;
    if (inThumb) c = i < 6 ? PAL.S5 : PAL.S4;
    if (j > 50 && i > 24) c = PAL.S3;
    if (edgeL) c = PAL.S6;
    if (edgeR) c = PAL.S1;
    b.set(x + i, y + j, c);
  }
  // the creases: the finger's two joints, the thumb's line against the fist, the knuckle valleys
  // the finger's two joint creases, across the finger's axis (it leans 15 degrees)
  for (const k of [18, 28]) { const cx = 5 + ((k - 8) / 32) * 9; for (let i = -2; i <= 2; i++) b.set(x + Math.round(cx + i), y + k + (i > 0 ? 1 : 0), PAL.S3); }
  for (let j = 44; j < 56; j++) b.set(x + 9, y + j, PAL.S2); // the thumb's line against the fist
  b.set(x + 23, y + 40, PAL.S2); b.set(x + 30, y + 43, PAL.S2);
  rect(x + 3, y + 5, 5, 2, b.ink(PAL.P1)); // the nail's edge at the tip
  // the fleece cuff under the fist, down out of frame
  for (let j = 64; y + j < RH; j++) for (let i = 2; i < 38; i++) b.set(x + i, y + j, i < 8 ? F[4] : i > 34 ? F[1] : F[2]);
};
export const drawWHOTS = (b: Buf, f: number, st: WHOTSState) => {
  drawWHWall(b, f, {soft: 1, door: 3});
  // NEDIB behind the row: his bust at the door, soft focus is not needed (he is the subject)
  const img = nedibBust({...NEDIB_BUST_DEFAULT, ...st.nedib});
  putBustCut(b, img, 170, 30, RH);
  // the row between: a soft chair back and Tasya's shoulder, a rung down (out of focus, in the middle ground)
  for (let y = 150; y < RH; y++) for (let x = 40; x < 150; x++) if (Math.hypot((x - 95) / 55, (y - 210) / 60) < 1) b.set(x, y, bayer(x, y) < 0.5 ? PAL.R0 : PAL.D1);
  // MARIO in the foreground, frame right: the back of his fleece shoulder and his raised hand, big (never mirrored)
  const F = [PAL.F0, PAL.F1, PAL.F2, PAL.F3, PAL.F4];
  for (let y = 108; y < RH; y++) for (let x = 330; x < 480; x++) {
    const d = Math.hypot((x - 470) / 150, (y - 230) / 120);
    if (d > 1) continue;
    b.set(x, y, d > 0.96 ? F[3] : x < 360 ? F[2] : F[1]);
  }
  // his curls at the frame's top-right edge, soft
  for (let y = 60; y < 120; y++) for (let x = 410; x < 480; x++) {
    const d = Math.hypot((x - 470) / 58, (y - 118) / 52);
    if (d > 1) continue;
    const curl = (Math.floor((x + y) / 5) + Math.floor((x - y) / 5)) % 2 === 0;
    b.set(x, y, d > 0.95 ? PAL.B2 : curl ? PAL.B1 : PAL.B0);
  }
  // the hand and the finger (lit from the left): up past his shoulder into the frame. The INDEX finger, read from
  // behind: it rises from the fist's thumb side, the thumb along that side, the three curled fingers' knuckles
  // stepping down on the other side only (never a lone finger centred on a fist)
  const fy = st.finger === 2 ? 44 : 64;
  drawIndexUp(b, 368, fy, F);
  // the scroll coming out of his pocket (the other hand), bottom right, in held steps
  if (st.scroll && st.scroll < 4) {
    const L = [0, 16, 34, 56][st.scroll];
    for (let j = 0; j < 10; j++) for (let i = 0; i < L; i++) b.set(476 - L + i, 188 - j, j === 0 || j === 9 ? PAL.P0 : i === 0 ? PAL.P2 : (i + j) % 4 === 0 ? PAL.N4 : PAL.P1);
  }
  if (st.scroll === 4) {
    // the whole scroll: its roll up in his other hand at the frame's right edge, the paper falling from it past his
    // shoulder and out of frame, ruled with his sub-concerns (unreadable at this size), curling as it goes
    const rx = 442, ry = 118;
    for (let y = ry + 6; y < RH; y++) { const wob = Math.round(Math.sin((y - ry) / 11) * 3); for (let i = 0; i < 16; i++) { const x = rx - 2 + i + wob; b.set(x, y, i === 0 ? PAL.P0 : i === 15 ? PAL.P2 : (y % 4 === 1 && i > 2 && i < 13 && (i * 5 + y) % 9 !== 0) ? PAL.N4 : PAL.P1); } }
    rect(rx - 4, ry, 20, 8, b.ink(PAL.N0)); rect(rx - 3, ry + 1, 18, 6, b.ink(PAL.P1)); rect(rx - 3, ry + 1, 18, 1, b.ink(PAL.P2));
    for (let j = 0; j < 12; j++) for (let i = 0; i < 16; i++) if (Math.hypot((i - 8) / 8, (j - 6) / 6) < 1) b.set(rx - 2 + i, ry - 6 + j, i < 6 ? PAL.S5 : PAL.S4); // his hand round the roll
  }
};

// ------------------------------------------------------------------ Sirrah at the blocks (13.02-13.04)
export interface SirrahMCUState { sirrah?: Partial<SirrahBustState>; on: 'A' | 'I' | null; order?: 'AI' | 'IA'; }
export const drawSirrahMCU = (b: Buf, f: number, st: SirrahMCUState) => {
  drawWHWall(b, f, {soft: 1});
  // the carpet close: the blocks stand on it at MCU size
  for (let y = 150; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, stepColor(bayer(x, y) < 0.5 ? PAL.N4 : PAL.N3, y > 180 ? -1 : 0));
  const bl = drawBlocks(b, 80, 196, 48, {order: st.order ?? 'AI', hit: st.on});
  const img = sirrahBust({...SIRRAH_BUST_DEFAULT, ...st.sirrah, arm: st.on ? 'point' : 'down'});
  const X = 272, Y = 26;
  putBustCut(b, img, X, Y, RH);
  if (st.on) drawPointer(b, X + SIRRAH_POINTER_HAND[0], Y + SIRRAH_POINTER_HAND[1], bl[st.on][0] + 4, bl[st.on][1] - 6, 2);
  return {blocks: bl};
};

// ------------------------------------------------------------------ the row at close-up size (13.07)
export const WH_ROW = {w: 700, panMax: 700 - 480, slots: {mas: 30, radnus: 190, mario: 360, tasya: 540} as Record<WHSeat, number>};
export interface ClassRowState { mas?: Partial<MasPortraitState>; }
/** the long plate: the four at MCU size, each on their own eyeline (Tasya cam 3, Mario cam 2, Radnus the ceiling, Mas the lens) */
const rowPlate = (): Buf => {
  const P = new Buf(WH_ROW.w, RH, PAL.N0);
  // the wall behind them, a step soft, tiled across the long plate
  const w = paintWall(1);
  for (let y = 0; y < RH; y++) for (let x = 0; x < WH_ROW.w; x++) P.set(x, y, w.get(x % 480, y)); // the wall runs on (more portraits), never stretched
  const put = (im: Img, x: number, y: number, flip = false) => putBustCut(P, im, x, y, RH, flip);
  put(warmRelit(tasyaSpeakPortrait({...TASYA_PORTRAIT_DEFAULT, arms: 'clasp', mouth: 'smile'})), WH_ROW.slots.tasya, 30, true); // turned right: camera 3
  put(marioPortraitImg({...MARIO_PORTRAIT_REST, finger: 0}), WH_ROW.slots.mario, 30); // his natural facing: camera 2
  put(radnusBust({...RADNUS_BUST_DEFAULT, up: true, arm: 'fold'}), WH_ROW.slots.radnus, 34); // the ceiling camera
  return P;
};
let ROW: Buf | null = null;
export const drawClassRow = (b: Buf, pan: number, st: ClassRowState = {}) => {
  const P = (ROW ??= rowPlate());
  const px = Math.round(clamp(WH_ROW.panMax - pan, 0, WH_ROW.panMax));
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, P.get(px + x, y));
  // Mas at the row's end, drawn live (his look is the shot's point): the near-front head, pupils centred
  const im = masPortrait({...MAS_PORTRAIT_DEFAULT, head: 'front', look: 0, light: 'warm', ...st.mas});
  const X = WH_ROW.slots.mas - px, Y = 30;
  putBustCut(b, im, X, Y, RH);
  // the table's edge along the bottom, the length of the plate
  for (let y = 186; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, y === 186 ? PAL.W4 : hash((x + px) >> 4, y, 2) < 0.5 ? PAL.D3 : PAL.D4);
};

// ------------------------------------------------------------------ CLASS PHOTO #1 (13.14)
/** the flash frame's state, as printed: three twisted to the door, Nedib half in frame mid-stride, blocks I A, Mas at the lens */
export const CLASS_PHOTO_STATE: WHWideState = {
  door: 3, nedib: {t: 0.45, mouth: 'open', arm: 'baton'}, tripods: 0, blocks: 'IA', sirrah: {on: 'I', mouth: 'smile'},
  look: {mas: 'lens', radnus: 'door', mario: 'door', tasya: 'door'}, finger: 2, flame: 1,
};
export const drawClassPhoto = (b: Buf, f: number, st: {caption?: boolean; hand?: boolean} = {}) => {
  // the desk under it: the meeting table close, a step dark (the print is the lit thing)
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, hash(x >> 5, y >> 1, 4) < 0.5 ? PAL.D2 : PAL.D3);
  // the print: the wide's own pixels (the flash frame), cropped round the row and the door, with a print grade
  const src = new Buf(480, 270, PAL.N0);
  drawWHWide(src, 0, CLASS_PHOTO_STATE);
  const cx0 = 24, cy0 = 44, cw = 332, ch = 124; // the crop (the head of the table to Tasya, the door above)
  const X = 70, Y = 24, B = 6;
  rect(X - B + 3, Y - B + 3, cw + 2 * B, ch + 2 * B + 10, b.ink(PAL.N0)); // its shadow
  rect(X - B, Y - B, cw + 2 * B, ch + 2 * B + 10, b.ink(PAL.P2));
  rect(X - B, Y - B, cw + 2 * B, 1, b.ink(PAL.W9));
  for (let j = 0; j < ch; j++) for (let i = 0; i < cw; i++) {
    let c = src.get(cx0 + i, cy0 + j);
    // the flash: faces and the near side a rung hot, the far wall a rung down (flash falloff)
    c = stepColor(c, j < 60 ? 0 : 1);
    b.set(X + i, Y + j, c);
  }
  // the print's slight sheen (a diagonal band) and the border's handwriting space
  for (let j = 0; j < ch; j++) for (let i = 0; i < cw; i++) { const d = i - j * 1.2 - 120; if (d > 0 && d < 3 && bayer(i, j) < 0.5) b.set(X + i, Y + j, stepColor(b.get(X + i, Y + j), 1)); }
  if (st.caption) text(b, 'CLASS PHOTO #1', X + 4, Y + ch + 3, PAL.N4);
  // Mas's hand holding its right edge: the thumb over the border, the fingers behind (hand-pixelled)
  if (st.hand !== false) {
    const hx = X + cw + B - 12, hy = Y + 60;
    for (let j = 0; j < 60; j++) for (let i = 0; i < 40; i++) { const inH = Math.hypot((i - 22) / 20, (j - 28) / 30) < 1 && i > 6; if (inH) b.set(hx + i, hy + j, i < 12 ? PAL.S5 : i < 26 ? PAL.S4 : PAL.S3); }
    for (let j = 0; j < 14; j++) for (let i = 0; i < 22; i++) if (Math.hypot((i - 11) / 11, (j - 7) / 7) < 1) b.set(hx - 6 + i, hy + 10 + j, i < 8 ? PAL.S5 : PAL.S4); // the thumb on the border
    line(hx - 2, hy + 11, hx + 12, hy + 11, b.ink(PAL.S6));
    for (let j = 40; j < RH - hy; j++) for (let i = 8; i < 44; i++) b.set(hx + i, hy + j, i < 14 ? PAL.G3 : PAL.G2); // his hoodie cuff
  }
};

// ------------------------------------------------------------------ Radnus's collar, close (13.10)
/** STAND-IN colours (RADNUS is art-a's): his jaw and neck, an open shirt collar lying on a sage sweater, the small
 *  flame on the collar's point (a warm glow on the cloth round it), and his hand patting at it in two held drawings */
export const drawCollarFlame = (b: Buf, f: number, st: {size: 1 | 2; pat?: 0 | 1 | 2}) => {
  const wall = paintWall(1);
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, stepColor(wall.get(x, y), -1));
  const inP = (pts: number[], x: number, y: number) => {
    let c = false;
    for (let i = 0, j = pts.length - 2; i < pts.length; j = i, i += 2) {
      const xi = pts[i], yi = pts[i + 1], xj = pts[j], yj = pts[j + 1];
      if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
    }
    return c;
  };
  const JAW = [0, 0, 236, 0, 214, 30, 170, 58, 110, 78, 0, 92];
  const NECK = [20, 70, 222, 20, 262, 118, 40, 150];
  const BAND = [30, 128, 250, 104, 266, 122, 40, 150];
  const POINT = [150, 116, 262, 112, 330, 162, 312, 170, 176, 150];
  const SWEATER = [0, 142, 250, 118, 480, 110, 480, 203, 0, 203];
  const fx = 314, fy = 160; // the flame's base on the collar's tip
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) {
    const bz = bayer(x, y);
    let c = -1;
    if (inP(SWEATER, x, y)) {
      const rib = x % 3 === 0;
      const lit = x < 140 ? 3 : x < 330 ? 2 : 1;
      c = [PAL.N2, PAL.N2, PAL.N4, PAL.N5][lit - (rib ? 1 : 0)] ?? PAL.N2;
      if ((y - 118 + (x >> 3)) % 7 === 0 && bz < 0.5) c = stepColor(c, -1); // the knit's rows
    }
    if (inP(NECK, x, y)) c = x < 90 ? PAL.S4 : x < 180 ? PAL.S3 : x < 230 ? PAL.S2 : PAL.S1;
    if (inP(BAND, x, y)) c = x < 120 ? PAL.P2 : x < 220 ? PAL.P1 : PAL.P0;
    if (inP(POINT, x, y)) c = y > 160 ? PAL.P0 : x < 210 ? PAL.P2 : PAL.P1;
    if (inP(JAW, x, y)) c = y > 70 || x > 190 ? PAL.S2 : x < 120 ? PAL.S4 : PAL.S3;
    if (c >= 0) b.set(x, y, c);
  }
  // the edges: the jaw's shadow line, the collar's lit edge and its stitch, the shadow it casts on the sweater
  for (let x = 0; x < 480; x++) for (let y = 1; y < RH; y++) {
    const up = b.get(x, y - 1), here = b.get(x, y);
    const isP = (c: number) => c === PAL.P0 || c === PAL.P1 || c === PAL.P2;
    const isL = (c: number) => c === PAL.N2 || c === PAL.N4 || c === PAL.N5;
    if (isP(up) && isL(here)) { b.set(x, y, PAL.N0); if (y + 1 < RH && isL(b.get(x, y + 1))) b.set(x, y + 1, PAL.N1); }
    if (isL(up) && isP(here)) b.set(x, y, PAL.W9);
  }
  for (let t = 0; t <= 1; t += 0.004) { const x = Math.round(160 + t * 150), y = Math.round(121 + t * 43); if (inP(POINT, x, y)) b.set(x, y, PAL.P0); }
  // the warm glow of the flame on the cloth round it (stepped rings, dithered seams)
  const R = st.size === 2 ? 34 : 24;
  for (let y = fy - R; y < fy + R; y++) for (let x = fx - R; x < fx + R; x++) {
    const d = Math.hypot(x - fx, (y - fy) * 1.3) / R;
    if (d > 1 || bayer(x, y) < d) continue;
    const c = b.get(x, y);
    b.set(x, y, c === PAL.P2 || c === PAL.P1 ? PAL.W8 : c === PAL.P0 ? PAL.W6 : c === PAL.N5 || c === PAL.N4 ? PAL.W4 : c === PAL.N2 ? PAL.W3 : c);
  }
  drawBigFlame(b, fx, fy, st.size === 2 ? 40 : 26, f);
  // his hand patting at it (two held drawings): the palm and four fingers, in from the right, lit from the left
  if (st.pat) {
    const hx = st.pat === 1 ? 356 : 334, hy = st.pat === 1 ? 64 : 96;
    const m = (x: number, y: number) => {
      const palm = Math.hypot((x - 90) / 44, (y - 40) / 34) < 1;
      let fing = false;
      for (let k = 0; k < 4; k++) { const ax = 58 - k * 3, ay = 12 + k * 14; const t = clamp((ax - x) / 42, 0, 1); if (Math.hypot(x - (ax - t * 42), y - (ay + t * 8)) < 6.2 && x < ax + 2) fing = true; }
      return palm || fing;
    };
    for (let y = 0; y < 90; y++) for (let x = 0; x < 140; x++) {
      if (!m(x, y)) continue;
      const eL = !m(x - 1, y) || !m(x, y - 1), eR = !m(x + 1, y) || !m(x, y + 1);
      b.set(hx + x - 40, hy + y, eL ? PAL.S5 : eR ? PAL.S0 : x < 50 ? PAL.S4 : x < 96 ? PAL.S3 : PAL.S2);
    }
  }
};
void ellipse; void textWidth; void tiny; void drawBlock; void imgMas;
