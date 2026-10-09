// MR. MAS — Ep2 v1 art: SET-12, THE OPEN FLOOR (sc 14: the episode's one adventure-game scene). Ep1's bullpen
// (shared/pixel/rooms/bullpen.ts, imported) re-dressed as a find-the-man spread: tiled staff at ordinary desks (no
// shiny-product pedestals), glass walls, POLISHED HEATSINKS (the surface where Mas sees his own face: never Alyi's), a
// coffee urn, a spoon standing in a mug, a puddle under a leaking chiller, DOT on her ladder at the back; ALYI'S DOOR on
// a centre pivot with Ep1's yellowed note on its frame (it flutters loose at the `Open` bonk) and his HUMMING CHAIR
// beside it; down the corridor (Ep1's hall, left) the safety team's own door with its SUPERALIGNMENT / SAFETY TEAM
// plate beside Ekiel's empty desk; one domino. The adventure band replaces the rail band (UI LIT).
//   openFloor(b, f, st)        [W] st {note: 'on' | 'falling' | 'gone' (its flutter step), pivot: 0..3 (the door turning
//                              on its centre pin), dot: 'ladder' | 'point' | null, chair: 'empty' | 'bukaj' (drawn by
//                              the cast), domino: null | 'up' | 'falling' | 'down' (Ekiel's post as a domino, toppling to
//                              Mas's shoe at st.dominoTo), hum: bool}
//   adventureBand(b, st)       the band (rows 203..269, `full`): the verbs Look at · Talk to · Pick up · Use · ~~Open~~ ·
//                              Pivot · Raise, the inventory CTRL · ESC · glass · phone (+ note), the dialogue line typed
//                              in his lowercase (st.say, st.k), the hovered verb (st.verb), Open greyed
//   heatsinkMCU(b, f, st)      [MCU] 14.03-14.04: his own face in the polished fins (mirrored, banded, cooled), mouthing
//                              `can we talk?` (st.mouth), the phone's suggestion strip below: `> where are you going?` ·
//                              `> can we talk?` · `> ~~come back~~` (greyed, struck), st.tap = the chip he taps
//   dominoECU(b, f, st)        [HIGH] 14.10: Ekiel's post standing as one domino in its own UI, MAY 17 (st.fall 0..3)
import {Buf, rect, line, ellipse, bayer, hash, clamp, poly} from '../../../../../shared/pixel/px';
import {PAL, stepColor, lightness} from '../../../../../shared/pixel/palette';
import {drawBullpen, BULLPEN} from '../../../../../shared/pixel/rooms/bullpen';
import {masPortrait, MAS_PORTRAIT_DEFAULT, MasPortraitState} from '../../../../../shared/pixel/cast/mas';
import {blitImg} from '../../../../../shared/pixel/figure';
import {fill, pt, pw, pwrap, bpt, bpw, tiny, tinyWidth, vramp, RH, TR, dith} from '../kit';
import {seatedStaff, staffChair} from '../cast/civic2';
import {drawDotLadder} from '../cast/dot';
import type {ArtAsset} from '../asset';

const B = BULLPEN;
export const FLOOR = {
  door: B.door, heatsink: {x0: 340, x1: 392, y0: 150, y1: 176}, urn: {x: 70, y: 150}, chiller: {x: 410, y: 150},
  chair: {x: 324, y: 146}, corridor: {x0: B.hall.x0, x1: B.hall.x1}, note: {x: B.door.x0 - 29, y: 86},
};
/** an office chair (room scale, its back to the right of the door), humming: 2 held drawings of tiny hum lines */
const humChair = (b: Buf, x: number, y: number, f: number, hum: boolean) => {
  fill(b, x, y - 34, 18, 20, PAL.N2); fill(b, x, y - 34, 18, 2, PAL.N4); fill(b, x - 2, y - 16, 22, 4, PAL.N2); fill(b, x + 8, y - 12, 2, 8, PAL.G3); fill(b, x + 1, y - 4, 16, 2, PAL.G3);
  for (const wx of [x + 1, x + 9, x + 16]) b.set(wx, y - 1, PAL.N0);
  if (hum) { const p = Math.floor(f / 4) % 2; for (let k = 0; k < 3; k++) { b.set(x - 4 - p, y - 30 + k * 6, PAL.C5); b.set(x - 5 - p, y - 29 + k * 6, PAL.C4); b.set(x + 22 + p, y - 30 + k * 6, PAL.C5); b.set(x + 23 + p, y - 29 + k * 6, PAL.C4); } }
};
/** the yellowed note (Ep1's IOU, at the spread's scale: unreadable on purpose here, never tagged, never held for reading) */
const note = (b: Buf, x: number, y: number, state: 'on' | 'falling' | 'gone', f: number) => {
  if (state === 'gone') return;
  const dy = state === 'falling' ? 20 + (f % 12) * 4 : 0, tilt = state === 'falling' ? (Math.floor(f / 3) % 2 ? 1 : -1) : 0;
  for (let j = 0; j < 9; j++) for (let i = 0; i < 14; i++) b.set(x + i + Math.round((j * tilt) / 4), y + j + dy, j === 0 ? PAL.W7 : (i + j) % 7 === 0 ? PAL.W4 : PAL.W6);
  for (let r = 0; r < 3; r++) fill(b, x + 2 + Math.round(((2 + r * 2) * tilt) / 4), y + 2 + r * 2 + dy, 9 - r * 2, 1, PAL.D3);
};
/** the door turning on a centre pin: 0 shut (face on), 1..2 turning (narrower, the edge showing), 3 edge-on */
const pivotDoor = (b: Buf, step: number) => {
  if (!step) return;
  const {x0, x1, y0} = B.door, cx = (x0 + x1) >> 1, w = [32, 24, 12, 3][step];
  // the opening behind it (Alyi's office, evening light: empty)
  fill(b, x0 + 2, y0, x1 - x0 - 4, B.floorY - y0, PAL.W2); dith(b, x0 + 2, y0, x1 - x0 - 4, B.floorY - y0, 0.3, PAL.W3);
  fill(b, cx - (w >> 1), y0, w, B.floorY - y0, PAL.D3); fill(b, cx - (w >> 1), y0, 1, B.floorY - y0, PAL.D4); fill(b, cx + (w >> 1) - 2, y0, 2, B.floorY - y0, PAL.D1);
  fill(b, cx, B.floorY - 2, 1, 2, PAL.G5); fill(b, cx, y0, 1, 2, PAL.G5);
};
/** polished heatsinks on a low rack: vertical fins, a mirror-bright face (the surface for Look at heatsink) */
const heatsinks = (b: Buf) => {
  const H = FLOOR.heatsink;
  fill(b, H.x0 - 2, H.y0 - 2, H.x1 - H.x0 + 4, H.y1 - H.y0 + 4, PAL.N2);
  for (let x = H.x0; x < H.x1; x++) for (let y = H.y0; y < H.y1; y++) b.set(x, y, (x - H.x0) % 3 === 0 ? PAL.G3 : y < H.y0 + 4 ? PAL.P2 : (x + y) % 9 === 0 ? PAL.P1 : PAL.G6);
  fill(b, H.x0 - 2, H.y1 + 2, H.x1 - H.x0 + 4, 6, PAL.N1);
};
export interface FloorSt { note?: 'on' | 'falling' | 'gone'; pivot?: 0 | 1 | 2 | 3; dot?: 'ladder' | 'point' | null; domino?: null | 'up' | 'falling' | 'down'; dominoTo?: number; hum?: boolean }
export const openFloor = (b: Buf, f: number, st: FloorSt = {}, cast: {back?: (b: Buf) => void; floor?: (b: Buf) => void} = {}) => {
  const s = {note: 'on' as FloorSt['note'], pivot: 0 as FloorSt['pivot'], dot: 'ladder' as FloorSt['dot'], hum: true, domino: null as FloorSt['domino'], dominoTo: 200, ...st};
  drawBullpen(b, f, {variant: 'day', door: 'shut', nameplate: 'ALYI', iou: false, masDesk: false, masGlass: false});
  // the corridor (Ep1's hall, left): the safety team's own door at its far end with its plate, Ekiel's empty desk beside
  const C = B.hall;
  fill(b, C.x0 + 10, C.y0 + 10, 18, 50, PAL.D2); fill(b, C.x0 + 10, C.y0 + 10, 18, 1, PAL.D4); fill(b, C.x0 + 12, C.y0 + 24, 14, 6, PAL.G5); fill(b, C.x0 + 12, C.y0 + 24, 14, 1, PAL.G6);
  fill(b, C.x0 + 2, C.y0 + 60, 12, 2, PAL.D3); fill(b, C.x0 + 3, C.y0 + 62, 1, 14, PAL.N1); fill(b, C.x0 + 12, C.y0 + 62, 1, 14, PAL.N1);
  // the MISC box on Ekiel's empty desk (its label unreadable at this scale; the 14.11 insert reads it)
  fill(b, C.x0 + 3, C.y0 + 53, 9, 7, PAL.D3); fill(b, C.x0 + 3, C.y0 + 53, 9, 1, PAL.D4); fill(b, C.x0 + 5, C.y0 + 55, 5, 2, PAL.P2);
  pivotDoor(b, s.pivot ?? 0);
  if (!s.pivot) note(b, FLOOR.note.x, FLOOR.note.y, s.note ?? 'on', f);
  humChair(b, FLOOR.chair.x, FLOOR.chair.y, f, s.hum);
  // DOT on her ladder at the back (by the window), from behind
  if (s.dot) drawDotLadder(b, 440, 146, s.dot === 'point' ? 'pointL' : 'reach');
  cast.back?.(b);
  // the spread: ordinary desks in rows on the floor, tiled staff at them; the urn; a mug with a spoon; the chiller's
  // puddle; the heatsinks
  // (the domino run lies on the floor between the two rows of desks: drawn after the far row, before the near one)
  const deskRow = (r: number) => { for (let k = 0; k < 6; k++) {
    const x = 70 + k * 64 + r * 30, y = 178 + r * 16;
    if (x > 440) continue;
    const seated = (k + r) % 3 !== 2;
    // the staffer's office chair first (its back behind them, its seat under them, the gas column and the star base)
    if (seated) staffChair(b, x - 14, y - 30);
    fill(b, x, y - 10, 40, 3, PAL.G5); fill(b, x, y - 10, 40, 1, PAL.P1); fill(b, x + 2, y - 7, 2, 10, PAL.G3); fill(b, x + 36, y - 7, 2, 10, PAL.G3);
    fill(b, x + 12, y - 20, 14, 10, PAL.N1); fill(b, x + 13, y - 19, 12, 7, PAL.C4);
    if (seated) blitImg(b, seatedStaff({seed: r * 13 + k * 7 + 2, pose: 'type'}), x - 14, y - 30);
  } };
  deskRow(0);
  // the domino (Ekiel's post) standing on the floor, then its run lying flat along the floor toward Mas's shoe
  if (s.domino) {
    const x0 = 300, y0 = 190;
    if (s.domino === 'up') { fill(b, x0 - 4, y0 - 16, 8, 16, PAL.P2); fill(b, x0 - 4, y0 - 16, 8, 1, PAL.W9); fill(b, x0 + 3, y0 - 16, 1, 16, PAL.P0); fill(b, x0 - 3, y0 - 9, 6, 1, PAL.N2); fill(b, x0 - 5, y0, 10, 1, PAL.G2); }
    else {
      const n = s.domino === 'falling' ? 3 : 7, tx = s.dominoTo ?? 200, ty = 198;
      for (let k = 0; k < n; k++) {
        const t = k / 6, x = Math.round(x0 + (tx - x0) * t), y = Math.round(y0 + (ty - y0) * t);
        // each tile lying flat in perspective (a short wide slab), its shadow, the next one overlapping it
        fill(b, x - 7, y + 1, 15, 2, PAL.G2); fill(b, x - 7, y - 2, 14, 3, PAL.P2); fill(b, x - 7, y - 2, 14, 1, PAL.W9); fill(b, x - 1, y - 2, 1, 3, PAL.P0);
      }
    }
  }
  deskRow(1);
  // the coffee urn (steel, a tap, the drip tray) and a mug with the spoon standing in it
  const U = FLOOR.urn;
  fill(b, U.x, U.y - 26, 14, 24, PAL.G4); fill(b, U.x, U.y - 26, 14, 2, PAL.G6); fill(b, U.x + 1, U.y - 24, 2, 20, PAL.G6); fill(b, U.x + 5, U.y - 4, 4, 2, PAL.N1); fill(b, U.x - 2, U.y - 2, 18, 2, PAL.G2);
  fill(b, U.x + 20, U.y - 7, 6, 6, PAL.P2); fill(b, U.x + 26, U.y - 6, 2, 3, PAL.P1); line(U.x + 23, U.y - 7, U.x + 24, U.y - 14, b.ink(PAL.G6));
  const Ch = FLOOR.chiller;
  fill(b, Ch.x, Ch.y - 30, 26, 30, PAL.G3); fill(b, Ch.x, Ch.y - 30, 26, 2, PAL.G5); for (let k = 0; k < 5; k++) fill(b, Ch.x + 3, Ch.y - 26 + k * 5, 20, 1, PAL.G2);
  for (let i = -10; i < 30; i++) for (let j = 0; j < 4; j++) if (Math.hypot(i - 10, (j - 1.5) * 4) < 18 && bayer(Ch.x + i, Ch.y + j) < 0.7) b.set(Ch.x + i, Ch.y + 1 + j, PAL.C5);
  if (Math.floor(f / 8) % 3 === 0) b.set(Ch.x + 12, Ch.y - 2 + (f % 8) / 2, PAL.C7);
  heatsinks(b);
  cast.floor?.(b);
};
/** [ECU] 14.11 the MISC box (a plain archive box, its lid off) on Ekiel's empty desk: its label MISC · MAY 17 in marker,
 *  the SUPERALIGNMENT / SAFETY TEAM plate dropped in on its back, its four screws beside it */
export const miscBoxECU = (b: Buf, f: number) => {
  vramp(b, 0, 0, 480, RH, [PAL.G3, PAL.G4, PAL.G3]);
  for (let x = 0; x < 480; x += 3) if (hash(x, 1, 5) < 0.3) fill(b, x, 150, 2, 53, PAL.G2);
  // the box from above-front: its inside (darker), its front face with the label
  fill(b, 110, 30, 260, 96, PAL.D2); fill(b, 110, 30, 260, 3, PAL.D4); fill(b, 116, 36, 248, 84, PAL.D1);
  fill(b, 100, 120, 280, 80, PAL.D3); fill(b, 100, 120, 280, 3, PAL.D4); fill(b, 100, 196, 280, 4, PAL.D2);
  fill(b, 200, 132, 140, 52, PAL.P2); fill(b, 200, 132, 140, 1, PAL.W9); fill(b, 339, 132, 1, 52, PAL.P0);
  bpt(b, 'MISC', 270 - Math.round(bpw('MISC') / 2), 140, PAL.N1); bpt(b, 'MAY 17', 270 - Math.round(bpw('MAY 17') / 2), 162, PAL.N1);
  // the plate inside (tilted, its words face down: only its back and its holes), the screws by it
  fill(b, 150, 54, 150, 50, PAL.G5); fill(b, 150, 54, 150, 2, PAL.G6); fill(b, 298, 54, 2, 50, PAL.G3);
  for (const [hx, hy] of [[160, 62], [288, 62], [160, 96], [288, 96]]) { b.set(hx, hy, PAL.N0); b.set(hx + 1, hy, PAL.N0); }
  for (let k = 0; k < 4; k++) { const sx = 318 + (k % 2) * 12, sy = 64 + Math.floor(k / 2) * 14; ellipse(sx, sy, 3, 3, b.ink(PAL.G6)); line(sx - 2, sy, sx + 2, sy, b.ink(PAL.G3)); fill(b, sx + 3, sy - 1, 7, 2, PAL.G4); }
  void f;
};
export const adventureBand = (b: Buf, st: {verb?: string; say?: string; k?: number; note?: boolean; f?: number} = {}) => {
  // UI LIT: the band as a lit wooden-and-glass adventure panel (dark navy, lit edges), verbs left, inventory right
  fill(b, 0, 203, 480, 67, PAL.N1); fill(b, 0, 203, 480, 1, PAL.N5); fill(b, 0, 204, 480, 1, PAL.N3);
  const verbs = ['Look at', 'Talk to', 'Pick up', 'Use', 'Open', 'Pivot', 'Raise'];
  verbs.forEach((v, i) => {
    const x = 8 + (i % 4) * 66, y = 224 + Math.floor(i / 4) * 14;
    const greyed = v === 'Open', on = st.verb === v;
    if (on) fill(b, x - 3, y - 2, pw(v) + 6, 11, PAL.N3);
    pt(b, v, x, y, greyed ? PAL.N4 : on ? PAL.W8 : PAL.C6);
    if (greyed) fill(b, x - 1, y + 3, pw(v) + 2, 1, PAL.N4);
  });
  // the inventory (his pocket): CTRL · ESC · glass · phone (+ the note once it's in there, unlabelled)
  const inv = ['CTRL', 'ESC', 'glass', 'phone', ...(st.note ? ['·'] : [])];
  fill(b, 282, 220, 190, 40, PAL.N0); fill(b, 282, 220, 190, 1, PAL.N4);
  inv.forEach((v, i) => { const x = 288 + i * 36; fill(b, x, 225, 32, 30, PAL.N2); fill(b, x, 225, 32, 1, PAL.N4); if (v === '·') { fill(b, x + 9, 236, 14, 9, PAL.W6); fill(b, x + 9, 236, 14, 1, PAL.W7); } else tiny(b, v.toUpperCase(), x + 16 - Math.round(tinyWidth(v.toUpperCase()) / 2), 247, PAL.P1); });
  // the dialogue line, typed in his lowercase, his colour
  if (st.say) { const s = st.say.slice(0, st.k ?? st.say.length); pt(b, s, 8, 209, PAL.C7); }
};
export const heatsinkMCU = (b: Buf, f: number, st: {mouth?: MasPortraitState['mouth']; tap?: 0 | 1 | 2 | null} = {}) => {
  // the fins fill the frame; in their polish, his own face (mirrored, banded by the fins, cooled one rung)
  vramp(b, 0, 0, 480, RH, [PAL.G4, PAL.G5, PAL.G4]);
  const face = masPortrait({...MAS_PORTRAIT_DEFAULT, light: 'warm', mouth: st.mouth ?? 'rest'});
  for (let y = 0; y < face.h; y++) for (let x = 0; x < face.w; x++) {
    const v = face.c[y * face.w + (face.w - 1 - x)]; if (v < 0) continue;
    for (let sy = 0; sy < 1; sy++) {
      const X = 184 + x, Y = 20 + y;
      if (X % 8 === 0) continue; // the fins' gaps break him into bands
      const L = lightness(v);
      b.set(X, Y, L > 0.5 ? PAL.P2 : L > 0.35 ? PAL.G6 : L > 0.22 ? PAL.G5 : PAL.G3);
    }
  }
  for (let x = 0; x < 480; x += 8) fill(b, x, 0, 1, RH, PAL.G2);
  // the suggestion strip (his phone, low in frame): three chips, the third greyed and struck
  const chips = ['> where are you going?', '> can we talk?', '> come back'];
  fill(b, 60, 158, 360, 40, PAL.N1); fill(b, 60, 158, 360, 1, PAL.N4);
  let x = 70;
  chips.forEach((c, i) => {
    const w = pw(c) + 10, grey = i === 2, on = st.tap === i;
    fill(b, x, 170, w, 16, on ? PAL.C3 : grey ? PAL.N2 : PAL.N3); fill(b, x, 170, w, 1, grey ? PAL.N4 : PAL.C5);
    pt(b, c, x + 5, 174, grey ? PAL.N5 : PAL.P2);
    if (grey) fill(b, x + 12, 177, pw(c) - 8, 1, PAL.N5);
    x += w + 6;
  });
};
export const dominoECU = (b: Buf, f: number, st: {fall?: 0 | 1 | 2 | 3} = {}) => {
  // [HIGH] looking down at the floor: the post standing on its edge as one domino, its UI on its face
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, (x + y * 2) % 37 < 2 ? PAL.G1 : PAL.G2);
  const fall = st.fall ?? 0;
  const H = [120, 96, 56, 24][fall];
  const x0 = 140, y0 = 30 + (120 - H);
  fill(b, x0 + 6, y0 + H, 200, 8 + (120 - H) / 3, PAL.N1);
  fill(b, x0, y0, 200, H, PAL.P2); fill(b, x0, y0, 200, 2, PAL.W9); fill(b, x0 + 198, y0, 2, H, PAL.P0);
  if (fall < 2) {
    fill(b, x0 + 8, y0 + 8, 14, 14, PAL.L2); pt(b, 'Ekiel', x0 + 28, y0 + 10, PAL.N1); pt(b, 'MAY 17', x0 + 150, y0 + 10, PAL.G4);
    const text = 'Yesterday was my last day as head of alignment, superalignment lead, and executive @NOPEAI.';
    pwrap(text, 180).forEach((l, i) => pt(b, l, x0 + 10, y0 + 30 + i * 11, PAL.N1));
  }
};

export const ART: ArtAsset[] = [{
  id: 'set12-openfloor', manifest: 'SET-12 · the open floor (the reach-for-him spread) · UI LIT', kind: 'set', name: 'The open floor: a find-the-man spread with the adventure band',
  file: 'sets/floor.ts', exports: 'openFloor, FLOOR, adventureBand, heatsinkMCU, dominoECU, miscBoxECU', scenes: '14',
  note: 'ordinary desks (no pedestals); polished heatsinks show only Mas\'s face; Alyi\'s door on a centre pin with the note on its frame; the humming chair; the safety team\'s own door down the corridor',
  stills: [
    {label: '[W] 14.01-14.06: the spread with the band lit (Open greyed), the note on Alyi\'s door frame, the humming chair, DOT pointing a screwdriver at his door', ownBand: true, draw: (b) => { openFloor(b, 0, {dot: 'point'}); adventureBand(b, {verb: 'Look at', say: 'i can see my face in it.'}); }},
    {label: '[W] 14.12: Pivot door: it turns on its centre pin; the note gone into his pocket; the domino run lying along the floor to his shoe', ownBand: true, draw: (b) => { openFloor(b, 6, {pivot: 2, note: 'gone', domino: 'down', dominoTo: 120}); adventureBand(b, {verb: 'Pivot', note: true}); }},
    {label: '[ECU] 14.11: the MISC box on Ekiel\'s empty desk, its label MAY 17, the team\'s plate and its four screws dropped in', draw: (b) => miscBoxECU(b, 0)},
    {label: '[MCU] 14.03-14.04: his own face in the polished fins mouthing "can we talk?"; the strip with "come back" greyed', draw: (b) => heatsinkMCU(b, 0, {mouth: 'O', tap: 1})},
    {label: '[HIGH] 14.10 the domino: Ekiel\'s post, MAY 17', draw: (b) => dominoECU(b, 0, {fall: 0})},
  ],
}];
void rect; void ellipse; void clamp; void poly; void stepColor; void bpt; void bpw; void TR; void hash;
