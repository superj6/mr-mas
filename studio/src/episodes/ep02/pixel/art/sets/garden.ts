// MR. MAS — Ep2 v1 art: SET-21, THE WALLED GARDEN (sc 19), with IRIS (§2.3), MIT KOOC's key (cast/kooc.ts) and the
// garden's props: a perfectly square-cut hedge wall with exactly one gate; a lock as tall as MIT KOOC; beds of
// PHONE-SHAPED FLOWERS; a bench with IRIS (a progress bar with a face, stuck at 99%); CHATGTP walked through on a velvet
// rope, a GUEST wristband on its tail; at each flower it raises one tiny hand and waits, the flower nods, and only then
// a speech bubble pops over it (text only: a soft chip blip, no voice). Outside the hedge: Mas and Radnus (polite,
// outside too, not burning). Never rings, altars or vows.
//   gardenGate(b, f, st)      [W] 19.16 from outside: the hedge, the gate (st.gate 0 shut .. 2 open), MIT KOOC turning
//                             the key in the lock (st.kooc), CHATGTP on the velvet rope through the gate (st.chat x | null)
//   gardenBeds(b, f, st)      [M] -> [W] 19.17 inside: the beds, CHATGTP at a flower (st.at index), its hand up
//                             (st.hand), the flower nodding (st.nod), the bubble (st.bubble); IRIS on her bench
//   outsideHedge(b, f, st)    [2S] 19.18: Mas screen-left outside the hedge, phone in hand; Radnus's head rising along
//                             the hedge screen-right (st.radnus 0..3: the rise), his polite smile
//   gateReverse(b, f, st)     [W] 19.19 the reverse from inside (the line crossed on purpose): the gate swinging shut
//                             behind CHATGTP (st.gate), the lock in the foreground turning once (st.lock), Mas outside
//                             screen-right (the one shot where he loses the left third)
//   phoneUnfold(b, scene, step)  19.16 / 19.20: his phone's picture opening outward in three held steps (0 phone .. 3
//                             full frame), or folding back
//   drawChatSmall(b, x, y, st)  CHATGTP at room scale with its Ep2 face, hand, wristband, a text bubble
import {Buf, rect, line, ellipse, bayer, hash, clamp, poly} from '../../../../../shared/pixel/px';
import {PAL, stepColor} from '../../../../../shared/pixel/palette';
import {drawChatBubble, CHAT_BUBBLE} from '../../../../../shared/pixel/cast/chatgtp';
import {drawRadnus, RADNUS_DEFAULT} from '../../../../../shared/pixel/cast/radnus';
import {fill, pt, pw, pwrap, bpt, bpw, tiny, tinyWidth, vramp, RH, TR, dith, sp} from '../kit';
import {drawKoocRoom, drawGiantKey} from '../cast/kooc';
import {drawMasStand2} from '../cast/mas2';
import {drawIris} from '../creatures';
import type {ArtAsset} from '../asset';

const HEDGE_TOP = 40, HEDGE_BOT = 150, GATE = {x0: 214, x1: 266};
/** the hedge: a perfectly square-cut wall of leaves (a fine leaf texture, lit top face), from x0 to x1 */
const hedge = (b: Buf, x0: number, x1: number, top = HEDGE_TOP, bot = HEDGE_BOT) => {
  for (let y = top; y < bot; y++) for (let x = x0; x < x1; x++) { const h = hash(x >> 1, y >> 1, 3); b.set(x, y, y < top + 4 ? (h < 0.5 ? PAL.L3 : PAL.L2) : h < 0.18 ? PAL.L2 : h > 0.85 ? PAL.L0 : PAL.L1); }
  fill(b, x0, top, x1 - x0, 1, PAL.L3);
};
/** the gate: wrought iron bars in a frame; open = its leaves swung back (narrower) */
/** the ONE gate design (the front, 19.16, and the reverse, 19.19, share it): two leaves of wrought-iron bars with a top,
 *  a middle and a bottom rail, in a frame; the lock hangs on a hasp at the post on its latch side. Open = the leaves
 *  swung back against the posts (foreshortened), the garden showing through */
const gate = (b: Buf, open: number) => {
  const w = GATE.x1 - GATE.x0, leaf = [w / 2, w / 4, 6][clamp(open, 0, 2)];
  fill(b, GATE.x0, 50, w, 100, PAL.L1);
  vramp(b, GATE.x0 + 2, 54, w - 4, 96, [PAL.C7, PAL.L3, PAL.L2]);
  for (const [sx, dir] of [[GATE.x0, 1], [GATE.x1, -1]] as Array<[number, number]>) {
    const pitch = Math.max(2, Math.round((leaf / (w / 2)) * 10));
    for (let i = 0; i < leaf; i += pitch) { fill(b, sx + dir * i - (dir < 0 ? 2 : 0), 52, 2, 98, PAL.N0); b.set(sx + dir * i - (dir < 0 ? 2 : 0), 52, PAL.G3); }
    for (const ry of [54, 98, 144]) fill(b, dir > 0 ? sx : sx - leaf, ry, Math.round(leaf), 3, PAL.N0);
  }
  fill(b, GATE.x0 - 4, 44, 4, 106, PAL.N0); fill(b, GATE.x1, 44, 4, 106, PAL.N0); fill(b, GATE.x0 - 4, 44, w + 8, 4, PAL.N0);
};
/** the lock: a brass padlock as tall as MIT KOOC (about 78 px with its shackle), on a hasp; x = its centre, y = the
 *  shackle's top; the keyhole's centre is at (x, y + 46) (where the key's tip goes); `turn` 0..2 (the cylinder's slot) */
export const drawGiantLock = (b: Buf, x: number, y: number, turn = 0) => {
  for (let j = 0; j < 30; j++) for (let i = 0; i < 40; i++) { const d = Math.hypot((i - 19.5) / 19.5, (j - 30) / 30); if (d < 1 && d > 0.7) b.set(x + i - 20, y + j, j < 6 || i < 8 ? PAL.G6 : PAL.G4); }
  fill(b, x - 17, y + 24, 6, 6, PAL.G4); fill(b, x + 11, y + 24, 6, 6, PAL.G3);
  fill(b, x - 26, y + 28, 52, 50, PAL.W5); fill(b, x - 26, y + 28, 52, 3, PAL.W7); fill(b, x - 26, y + 28, 3, 50, PAL.W6); fill(b, x + 22, y + 28, 4, 50, PAL.W3); fill(b, x - 26, y + 75, 52, 3, PAL.W3);
  for (let j = 0; j < 12; j++) for (let i = 0; i < 12; i++) if (Math.hypot(i - 5.5, j - 5.5) < 6) b.set(x - 6 + i, y + 40 + j, Math.hypot(i - 5.5, j - 5.5) > 4.6 ? PAL.W7 : PAL.W4);
  if (turn === 1) fill(b, x - 1, y + 40, 2, 12, PAL.N0); else if (turn === 2) { for (let k = -4; k <= 4; k++) b.set(x + k, y + 46 + k, PAL.N0); } else fill(b, x - 5, y + 45, 10, 2, PAL.N0);
};
/** a phone-shaped flower: a stem, two leaves, a head that is a small phone (its screen lit); nod 0..2 */
const flower = (b: Buf, x: number, y: number, nod = 0, seed = 0) => {
  line(x, y, x, y - 18, b.ink(PAL.L2)); fill(b, x - 4, y - 8, 4, 2, PAL.L3); fill(b, x + 1, y - 11, 4, 2, PAL.L3);
  const hx = x - 3 + nod, hy = y - 28 + nod * 2;
  fill(b, hx, hy, 7, 11, PAL.N1); fill(b, hx + 1, hy + 1, 5, 8, [PAL.C6, PAL.U4, PAL.W6, PAL.L3][seed % 4]); b.set(hx + 3, hy + 10, PAL.G5);
};
/** CHATGTP at room scale with its Ep2 face (sc 10's ears, eyes and mouth, here 34 px across), a tiny raised hand, the
 *  GUEST band on its tail (a tag big enough to read), an optional text bubble over it (text only: no voice) */
export const drawChatSmall = (b: Buf, x: number, y: number, st: {hand?: boolean; band?: boolean; bubble?: boolean | null; talk?: boolean} = {}) => {
  for (const ex of [x + 7, x + 26]) { ellipse(ex, y + 1, 5, 4, b.ink(PAL.N0)); ellipse(ex, y + 1, 4, 3, b.ink(PAL.C6)); fill(b, ex - 1, y, 3, 2, PAL.P1); }
  drawChatBubble(b, x, y, {size: 'screen', state: 'lit'});
  for (let j = 3; j < 19; j++) for (let i = 3; i < 31; i++) { const c = b.get(x + i, y + j); if (c === PAL.N0 || c === PAL.C8 || c === PAL.G4 || c === PAL.G3 || c === PAL.C4) b.set(x + i, y + j, PAL.P2); }
  for (const ex of [x + 11, x + 21]) { fill(b, ex, y + 7, 3, 4, PAL.N0); b.set(ex, y + 7, PAL.C8); }
  for (let i = -4; i <= 4; i++) b.set(x + 17 + i, y + 14 + (Math.abs(i) < 3 ? 1 : 0), PAL.N0);
  if (st.talk) fill(b, x + 15, y + 15, 5, 2, PAL.R1);
  if (st.hand) sp(b, x + 32, y - 9, ['.k.k.k.', 'kpkpkpk', 'kpkpkpk', 'kpppppk', 'kpppppk', '.kpppk.', '..kpk..', '..kpk..', '..kpk..'], {k: PAL.N0, p: PAL.P2});
  if (st.band !== false) {
    const [tx, ty] = CHAT_BUBBLE.screen.tail;
    fill(b, x + tx - 2, y + ty - 3, 6, 2, PAL.W7);
    line(x + tx, y + ty - 1, x + tx - 2, y + ty + 3, b.ink(PAL.W5));
    const w = tinyWidth('GUEST') + 4; fill(b, x + tx - 2 - w, y + ty + 3, w, 8, PAL.W7); fill(b, x + tx - 2 - w, y + ty + 10, w, 1, PAL.W4); tiny(b, 'GUEST', x + tx - w, y + ty + 4, PAL.N1);
  }
  if (st.bubble) { const w = 40, bx = x - 26; fill(b, bx, y - 26, w, 15, PAL.P2); fill(b, bx, y - 26, w, 1, PAL.W9); poly([bx + w - 12, y - 11, bx + w - 6, y - 11, bx + w - 4, y - 5], b.ink(PAL.P2)); fill(b, bx + 4, y - 22, 30, 2, PAL.G4); fill(b, bx + 4, y - 17, 20, 2, PAL.G4); }
};
/** a velvet rope on brass stanchions along a path (screen points) */
const velvetRope = (b: Buf, pts: Array<[number, number]>) => {
  for (let i = 0; i < pts.length; i++) { const [x, y] = pts[i]; fill(b, x - 1, y - 22, 3, 22, PAL.W5); ellipse(x, y - 23, 2, 2, b.ink(PAL.W7)); ellipse(x, y, 4, 1.5, b.ink(PAL.W3)); if (i + 1 < pts.length) { const [x2, y2] = pts[i + 1]; for (let t = 0; t <= 20; t++) { const u = t / 20; b.set(Math.round(x + (x2 - x) * u), Math.round(y - 20 + (y2 - y) * u + Math.sin(u * Math.PI) * 5), PAL.R2); } } }
};
const skyLawn = (b: Buf) => { vramp(b, 0, 0, 480, HEDGE_TOP + 10, [PAL.C6, PAL.C7, PAL.C8]); vramp(b, 0, HEDGE_BOT, 480, RH - HEDGE_BOT, [PAL.L2, PAL.L1]); };
export const gardenGate = (b: Buf, f: number, st: {gate?: 0 | 1 | 2; kooc?: 'carry' | 'turn0' | 'turn1' | 'turn2' | null; chat?: number | null} = {}) => {
  skyLawn(b);
  hedge(b, 0, GATE.x0 - 4); hedge(b, GATE.x1 + 4, 480);
  gate(b, st.gate ?? 0);
  // the lock on its hasp on the hedge right of the gate; MIT KOOC (flipped, facing it) turning the key in it
  const lx = GATE.x1 + 44, ly = 100;
  fill(b, GATE.x1 + 4, ly + 40, lx - GATE.x1 - 20, 6, PAL.G3); fill(b, GATE.x1 + 4, ly + 40, lx - GATE.x1 - 20, 1, PAL.G5);
  drawGiantLock(b, lx, ly, st.kooc === 'turn1' ? 1 : st.kooc === 'turn2' ? 2 : 0);
  if (st.kooc) drawKoocRoom(b, lx + 70, ly + 46 + 44, {key: st.kooc}, {flip: true});
  // the velvet rope: CHATGTP led through the open gate on it (the far end goes in through the gate, out of sight)
  if (st.chat !== null && st.chat !== undefined) {
    const cx = st.chat, cy = 158;
    for (let t = 0; t <= 40; t++) { const u = t / 40, px = Math.round(cx + 30 + (GATE.x0 + 30 - cx - 30) * u), py = Math.round(cy + 6 - 30 * u + Math.sin(u * Math.PI) * 6); b.set(px, py, PAL.R2); b.set(px, py + 1, PAL.R1); }
    drawChatSmall(b, cx, cy, {band: true});
  }
};
export const gardenBeds = (b: Buf, f: number, st: {at?: number; hand?: boolean; nod?: number; bubble?: boolean | null; iris?: boolean} = {}) => {
  // inside the hedge: the hedge behind, beds of phone-flowers in rows, a gravel path, IRIS on her bench
  vramp(b, 0, 0, 480, 40, [PAL.C6, PAL.C7]); hedge(b, 0, 480, 20, 90);
  fill(b, 0, 90, 480, RH - 90, PAL.L1); fill(b, 0, 140, 480, 14, PAL.P0); for (let x = 0; x < 480; x += 3) if (hash(x, 4, 4) < 0.4) b.set(x, 141 + (x % 12), PAL.P1);
  for (let row = 0; row < 2; row++) for (let k = 0; k < 9; k++) { const x = 30 + k * 48 + row * 20, y = row ? 190 : 134; fill(b, x - 16, y, 34, 4, PAL.D2); flower(b, x, y, st.at === k + row * 9 ? st.nod ?? 0 : 0, k + row); }
  if (st.iris !== false) {
    // a park bench (slatted back and seat, iron legs) at the bed's end, IRIS sitting on it, patient
    for (let k = 0; k < 3; k++) fill(b, 372, 100 + k * 5, 74, 3, k === 0 ? PAL.D4 : PAL.D3);
    fill(b, 368, 118, 82, 4, PAL.D4); fill(b, 368, 122, 82, 2, PAL.D2);
    for (const lx of [372, 442]) { fill(b, lx, 100, 3, 36, PAL.N1); fill(b, lx - 2, 134, 7, 2, PAL.N1); }
    drawIris(b, 389, 106, {labelAbove: true});
  }
  const at = st.at ?? 2, fx = 30 + (at % 9) * 48 + (at >= 9 ? 20 : 0);
  // CHATGTP stopped on the path beside the flower, its hand up to it, waiting; the bubble only after the nod
  drawChatSmall(b, fx - 44, 124, {hand: st.hand, band: true, bubble: st.bubble ?? null});
};
export const outsideHedge = (b: Buf, f: number, st: {radnus?: 0 | 1 | 2 | 3} = {}) => {
  skyLawn(b); hedge(b, 0, 480, 30, 160);
  drawMasStand2(b, 110, 196, {arm: 'phone', mouth: 'rest'});
  // Radnus rising into frame along the hedge, screen-right, polite, outside too, not burning
  const rise = [60, 40, 20, 0][st.radnus ?? 3];
  drawRadnus(b, 380, 196 + rise, {...RADNUS_DEFAULT, arm: 'fold', fire: null, mouth: 'smile'}, {});
};
export const gateReverse = (b: Buf, f: number, st: {gate?: 0 | 1 | 2; lock?: 0 | 1 | 2} = {}) => {
  // from just inside the gate: the hedge's inner face close on the left, the gate filling the right, its leaves swinging
  // shut (st.gate 2 open .. 0 shut); through its bars, outside, Mas (screen-right: the one shot he loses the left third);
  // CHATGTP inside, on the left; the lock on the gate's latch in the foreground, turning once (st.lock)
  vramp(b, 0, 0, 480, 120, [PAL.C6, PAL.C7, PAL.C8]); vramp(b, 0, 120, 480, RH - 120, [PAL.L2, PAL.L1]);
  for (let x = 196; x < 490; x += 11) ellipse(x, 116 - ((x * 7) % 5), 9, 7 + ((x * 3) % 4), b.ink(x % 2 ? PAL.L1 : PAL.L0));
  fill(b, 196, 118, 284, 4, PAL.L2);
  drawMasStand2(b, 404, 170, {arm: 'phone'}, {flip: true});
  hedge(b, 0, 196, 0, 176); fill(b, 196, 0, 4, 176, PAL.L0);
  // the gate: a fixed leaf (left) and the closing leaf (right); bars 3 px every 14 px, rails top and bottom
  const shut = st.gate ?? 1, leafX = [200, 272, 360][shut];
  const bars = (x0: number, x1: number) => { for (let x = x0; x < x1; x += 14) { fill(b, x, 6, 3, 186, PAL.N0); fill(b, x, 6, 1, 186, PAL.G3); } fill(b, x0, 6, x1 - x0, 5, PAL.N0); fill(b, x0, 98, x1 - x0, 4, PAL.N0); fill(b, x0, 186, x1 - x0, 5, PAL.N0); };
  bars(200, 272);
  if (shut < 2) bars(leafX, leafX + 72);
  drawChatSmall(b, 70, 160, {band: true});
  // the lock on its hasp at the gate's latch-side post (the same hasp as the front view's, seen from inside: on the
  // left here), in the foreground, turning once
  fill(b, 160, 112, 46, 6, PAL.G3); fill(b, 160, 112, 46, 1, PAL.G5);
  drawGiantLock(b, 176, 64, st.lock ?? 0);
};
/** his phone's picture opening outward (0 = a phone in his hand-sized frame .. 3 = full frame), or folding back */
export const phoneUnfold = (b: Buf, scene: (t: Buf) => void, step: 0 | 1 | 2 | 3) => {
  const t = new Buf(480, 270, PAL.N0); scene(t);
  const sizes = [[64, 112], [180, 120], [330, 170], [480, 203]];
  const [w, h] = sizes[step], x0 = Math.round(240 - w / 2), y0 = Math.round(101 - h / 2);
  if (step < 3) { fill(b, 0, 0, 480, RH, PAL.L1); dith(b, 0, 0, 480, RH, 0.3, PAL.L0); fill(b, x0 - 4, y0 - 6, w + 8, h + 12, PAL.N0); }
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) b.set(x0 + i, y0 + j, t.c[Math.floor((j * 203) / h) * 480 + Math.floor((i * 480) / w)]);
};

export const ART: ArtAsset[] = [
  {
    id: 'set21-garden', manifest: 'SET-21 · the walled garden · §2.3 IRIS · §3 the gate, the key, the lock, the rope, the wristband, the phone flowers', kind: 'set', name: 'The walled garden: the square-cut hedge, one gate, the lock, the phone flowers, IRIS',
    file: 'sets/garden.ts (+ cast/kooc.ts, creatures.ts drawIris)', exports: 'gardenGate, gardenBeds, outsideHedge, gateReverse, phoneUnfold, drawChatSmall, drawGiantLock', scenes: '19',
    note: 'CHATGTP walked through on a velvet rope, GUEST band on its tail; a raised hand, a nod, then a text-only bubble; IRIS stuck at 99%; Radnus polite outside the hedge, not burning; never rings, altars or vows',
    stills: [
      {label: '[W] 19.16: the hedge, its one gate open; MIT KOOC turns the key in the lock; CHATGTP led in on a velvet rope, GUEST', draw: (b) => gardenGate(b, 0, {gate: 2, kooc: 'turn1', chat: 150})},
      {label: '19.16 / 19.20: his phone\'s picture opening outward (three held steps; this is the second), or folding back', draw: (b) => phoneUnfold(b, (t) => gardenGate(t, 0, {gate: 0, kooc: 'carry', chat: null}), 1)},
      {label: '[W] 19.17: the beds of phone-shaped flowers; CHATGTP raises a tiny hand, the flower nods, a text bubble pops; IRIS on her bench at 99%', draw: (b) => gardenBeds(b, 0, {at: 3, hand: true, nod: 2, bubble: true})},
      {label: '[2S] 19.18 outside the hedge: Mas, phone in hand, watching; Radnus along it, rising into frame, politely outside too', draw: (b) => outsideHedge(b, 0, {radnus: 3})},
      {label: '[W] 19.19 the reverse, from inside: the gate swinging shut behind CHATGTP, the lock turning once; Mas outside, screen-right', draw: (b) => gateReverse(b, 0, {gate: 1, lock: 1})},
    ],
  },
];
void velvetRope; void rect; void stepColor; void pwrap; void bpt; void bpw; void tinyWidth; void TR; void drawGiantKey;
