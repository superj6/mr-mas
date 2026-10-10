// MR. MAS — Ep2 v1 · act4 · sc 19's WALLED GARDEN, a COPY of art/sets/garden.ts (the art pass's, imported only and
// never edited) with the picture review's fixes (2026-10-10):
//   19.16 gardenGate   an attendant's gloved hand inside the gate holds the velvet rope's end (it was led by nobody)
//   19.17 gardenBeds   the flowers' heads are phones (a bezel, a lit screen inset, the notch, a home bar); a flower BOWS
//                      (its head tips down and forward over two drawings, then back up); CHATGTP's tiny hand is an arm
//                      out of the bubble's side ending in a clear raised open palm, four fingers and a thumb (it read
//                      as a fork or a cursor floating off the bubble's corner)
//   19.18 outsideTruck / radnusMCU / masGuest   the exchange covered: the 2S established on a truck along the hedge
//                      (Radnus already there, never rising out of the ground), then his MCU (the roll call's bust, its
//                      polite smile, lip-synced) and Mas's dry single for "as a guest."; the smile held on his MCU
//   19.19 gateReverse  the hedge's inside face runs the frame's whole width but the gate: Mas outside only through the
//                      bars; the lock big in the foreground on the latch, turning once
// The original header follows.
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
import {fill, pt, pw, pwrap, bpt, bpw, tiny, tinyWidth, vramp, RH, TR, dith, sp} from '../../art/kit';
import {drawKoocRoom, drawGiantKey} from '../../art/cast/kooc';
import {drawMasStand2} from '../../art/cast/mas2';
import {drawIris} from '../../art/creatures';
import {P as FP, renderFigure as renderFig} from '../../../../../shared/pixel/figure';
import type {Adjust as FAdjust, FigureDef as FDef, LightRig as FRig, Part as FPart, Prim as FPrim, Stamp as FStamp, Img as FImg} from '../../../../../shared/pixel/figure';
import {masNoonImg} from './campus';
import type {MasPortraitState} from '../../../../../shared/pixel/cast/mas';
import {putBustSoft} from './common';

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
/** a phone-shaped flower: a stem, two leaves, a head that IS a small phone (the review pass: they read as lollipops):
 *  a dark bezel with rounded corners, its lit screen inset, the notch at the top, a pale home bar at the foot. `nod`
 *  0..2: the bow, the head tipping forward and down (its rows sheared toward screen-right, lowered 2 px a drawing, the
 *  stem bending under it) */
const flower = (b: Buf, x: number, y: number, nod = 0, seed = 0) => {
  // the head drawn upright in a little layer, then set on the stem's top turned forward by the bow (rotated about the
  // stem's top, so it stays a phone, tipping toward the guest), the stem bending a pixel under it
  const HW = 9, HH = 14;
  const head = new Buf(HW, HH, TR);
  const scr = [PAL.C6, PAL.U4, PAL.W6, PAL.L3][seed % 4];
  for (let j = 0; j < HH; j++) for (let i = 0; i < HW; i++) {
    if ((i === 0 || i === HW - 1) && (j === 0 || j === HH - 1)) continue;
    let c = PAL.N1;
    if (i >= 1 && i <= HW - 2 && j >= 2 && j <= HH - 3) c = j === 2 && i >= 3 && i <= 5 ? PAL.N1 : (i === 1 || j === 3) ? stepColor(scr, 1) : scr;
    if (j === HH - 2 && i >= 3 && i <= 5) c = PAL.G5;
    head.set(i, j, c);
  }
  const top: [number, number] = [x - nod, y - 18 + nod];
  line(x, y, x, y - 9, b.ink(PAL.L2)); line(x, y - 9, top[0], top[1], b.ink(PAL.L2));
  fill(b, x - 4, y - 8, 4, 2, PAL.L3); fill(b, x + 1, y - 11, 4, 2, PAL.L3);
  const a = -nod * 0.3, ca = Math.cos(a), sa = Math.sin(a);
  // the pivot: the head's bottom centre on the stem's top
  for (let yy = -20; yy <= 4; yy++) for (let xx = -14; xx <= 14; xx++) {
    const u = Math.round(ca * xx + sa * yy + (HW - 1) / 2), v = Math.round(-sa * xx + ca * yy + HH);
    if (u < 0 || v < 0 || u >= HW || v >= HH) continue;
    const c = head.c[v * HW + u]; if (c !== TR) b.set(top[0] + xx, top[1] + yy, c);
  }
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
  if (st.hand) {
    // (the review pass: a detached three-pronged shape read as a fork or a cursor) a small arm grows out of the
    // bubble's right side and ends in a raised open palm, four fingers and a thumb, its palm to us, held while it waits
    const ax = x + 31, ay = y + 11;
    for (const [dx, dy] of [[-1, 0], [2, 0], [0, -1], [0, 2], [1, -1], [1, 2], [-1, 1], [2, 1]] as Array<[number, number]>) line(ax + dx, ay + dy, ax + 7 + dx, ay - 10 + dy, b.ink(PAL.N0));
    for (const [dx, dy] of [[0, 0], [1, 0], [0, 1], [1, 1]] as Array<[number, number]>) line(ax + dx, ay + dy, ax + 7 + dx, ay - 10 + dy, b.ink(PAL.P2));
    sp(b, ax + 3, ay - 23, [
      '.k.k.k.k..',
      'kpkpkpkpk.',
      'kpkpkpkpk.',
      'kpkpkpkpk.',
      'kpkpkpkpk.',
      'kpppppppk.',
      'kpppppppkk',
      'kppppppkpk',
      'kpppppppk.',
      '.kpqqqpk..',
      '..kpppk...',
    ], {k: PAL.N0, p: PAL.P2, q: PAL.P1});
  }
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
    // the rope's end in an attendant's gloved hand inside the gate (his dark sleeve from behind the right leaf; the
    // rest of him behind the hedge): somebody is leading the guest in
    const hx = GATE.x0 + 30, hy = cy - 24;
    for (let i = 0; i < 18; i++) { const px = hx + 3 + i, py = hy - 2 - Math.round(i * 0.35); fill(b, px, py - 2, 1, 5, i < 2 ? PAL.P2 : PAL.N1); b.set(px, py - 2, PAL.N3); }
    fill(b, hx - 2, hy - 3, 6, 6, PAL.P2); fill(b, hx - 2, hy - 3, 6, 1, PAL.W9); fill(b, hx - 2, hy + 2, 6, 1, PAL.G5); b.set(hx - 3, hy - 1, PAL.P2);
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
/** the lock at any size (drawGiantLock's drawing with every measure scaled by `s`, so it stays crisp at its foreground
 *  size): x its centre, y the shackle's top, `turn` 0..2 the cylinder's slot */
const drawLockS = (b: Buf, x: number, y: number, s: number, turn = 0) => {
  const S = (v: number) => Math.round(v * s);
  const sw = S(40), sh = S(30);
  for (let j = 0; j < sh; j++) for (let i = 0; i < sw; i++) { const d = Math.hypot((i - (sw - 1) / 2) / ((sw - 1) / 2), (j - sh) / sh); if (d < 1 && d > 0.7) b.set(x + i - S(20), y + j, j < S(6) || i < S(8) ? PAL.G6 : PAL.G4); }
  fill(b, x - S(17), y + S(24), S(6), S(6), PAL.G4); fill(b, x + S(11), y + S(24), S(6), S(6), PAL.G3);
  fill(b, x - S(26), y + S(28), S(52), S(50), PAL.W5); fill(b, x - S(26), y + S(28), S(52), S(3), PAL.W7); fill(b, x - S(26), y + S(28), S(3), S(50), PAL.W6); fill(b, x + S(22), y + S(28), S(4), S(50), PAL.W3); fill(b, x - S(26), y + S(75), S(52), S(3), PAL.W3);
  const kr = 6 * s;
  for (let j = 0; j < S(12); j++) for (let i = 0; i < S(12); i++) { const d = Math.hypot(i - kr + 0.5, j - kr + 0.5); if (d < kr) b.set(x - S(6) + i, y + S(40) + j, d > kr * 0.77 ? PAL.W7 : PAL.W4); }
  const cx = x, cy = y + S(46);
  if (turn === 1) fill(b, cx - S(1), cy - S(6), S(2), S(12), PAL.N0);
  else if (turn === 2) { for (let k = -S(4); k <= S(4); k++) { b.set(cx + k, cy + k, PAL.N0); b.set(cx + k + 1, cy + k, PAL.N0); } }
  else fill(b, cx - S(5), cy - S(1), S(10), S(2), PAL.N0);
};
export const gateReverse = (b: Buf, f: number, st: {gate?: 0 | 1 | 2; lock?: 0 | 1 | 2} = {}) => {
  // the reverse from just inside the gate (the line crossed on purpose; the review pass: the hedge stopped at the gate
  // and Mas stood on open lawn beside it). The hedge's inside face runs the frame's whole width; its one gap is the
  // gate, and only through its bars: outside, the lawn and the treeline, and Mas (screen-right: the one shot where he
  // loses the left third). The gate's leaves swing shut (st.gate 2 open .. 0 shut); CHATGTP inside, on the left; the
  // lock big in the foreground on the latch where the leaves meet, turning once (st.lock)
  const G0 = 168, G1 = 352, LATCH = 260;
  vramp(b, 0, 0, 480, 120, [PAL.C6, PAL.C7, PAL.C8]); vramp(b, 0, 120, 480, RH - 120, [PAL.L2, PAL.L1]);
  for (let x = G0 - 10; x < G1 + 12; x += 11) ellipse(x, 116 - ((x * 7) % 5), 9, 7 + ((x * 3) % 4), b.ink(x % 2 ? PAL.L1 : PAL.L0));
  fill(b, G0, 118, G1 - G0, 4, PAL.L2);
  drawMasStand2(b, 318, 170, {arm: 'phone'}, {flip: true});
  // the hedge's inner face either side of the gate, floor to the frame's top; its cut ends dark at the posts
  hedge(b, 0, G0 - 4, 0, 182); hedge(b, G1 + 4, 480, 0, 182);
  fill(b, G0 - 4, 0, 4, 182, PAL.N0); fill(b, G1, 0, 4, 182, PAL.N0);
  vramp(b, 0, 182, 480, RH - 182, [PAL.L1, PAL.L0]);
  // the gate: the fixed leaf from the left post to the latch; the closing leaf swinging in from the right post
  const bars = (x0: number, x1: number) => { for (let x = x0; x < x1; x += 13) { fill(b, x, 4, 3, 184, PAL.N0); fill(b, x, 4, 1, 184, PAL.G3); } fill(b, x0, 4, x1 - x0, 5, PAL.N0); fill(b, x0, 96, x1 - x0, 4, PAL.N0); fill(b, x0, 182, x1 - x0, 5, PAL.N0); };
  bars(G0, LATCH);
  const shut = st.gate ?? 1, leafW = [G1 - LATCH, Math.round((G1 - LATCH) * 0.55), 10][shut];
  if (leafW > 10) bars(G1 - leafW, G1); else fill(b, G1 - 8, 4, 8, 184, PAL.N0);
  drawChatSmall(b, 62, 160, {band: true});
  // the lock in the foreground: on its hasp at the latch, big (we are close to it), cropped by the frame's foot
  fill(b, LATCH - 34, 128, 68, 8, PAL.G3); fill(b, LATCH - 34, 128, 68, 1, PAL.G5);
  drawLockS(b, LATCH - 6, 92, 1.55, st.lock ?? 0);
};
/** his phone's picture opening outward (0 = a phone in his hand-sized frame .. 3 = full frame), or folding back */
export const phoneUnfold = (b: Buf, scene: (t: Buf) => void, step: 0 | 1 | 2 | 3) => {
  const t = new Buf(480, 270, PAL.N0); scene(t);
  const sizes = [[64, 112], [180, 120], [330, 170], [480, 203]];
  const [w, h] = sizes[step], x0 = Math.round(240 - w / 2), y0 = Math.round(101 - h / 2);
  if (step < 3) { fill(b, 0, 0, 480, RH, PAL.L1); dith(b, 0, 0, 480, RH, 0.3, PAL.L0); fill(b, x0 - 4, y0 - 6, w + 8, h + 12, PAL.N0); }
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) b.set(x0 + i, y0 + j, t.c[Math.floor((j * 203) / h) * 480 + Math.floor((i * 480) / w)]);
};


// ================================================================== 19.18, covered (the review pass, 2026-10-10)
/** the hedge outside the garden at any width (a scene wider than the frame for the truck), the lawn below it */
const outsideWide = (b: Buf, w: number) => {
  vramp(b, 0, 0, w, 40, [PAL.C6, PAL.C7, PAL.C8]); vramp(b, 0, 160, w, RH - 160, [PAL.L2, PAL.L1]);
  hedge(b, 0, w, 30, 160);
};
/** [2S] 19.18's establishing frame on a truck: the hedge outside, Mas screen-left with his phone, RADNUS already standing
 *  a few feet along it, politely outside too (not burning); `cam` 0..1 trucks right along the hedge (held steps are the
 *  caller's), from Mas alone to the two of them (never a figure rising out of the ground) */
export const outsideTruck = (b: Buf, f: number, st: {cam: number; masMouth?: 'rest' | 'open'; radMouth?: 'smile' | 'open'}) => {
  const WIDE = 600, t = new Buf(WIDE, 270, PAL.N0);
  outsideWide(t, WIDE);
  drawMasStand2(t, 215, 196, {arm: 'phone', mouth: st.masMouth ?? 'rest'});
  drawRadnus(t, 505, 196, {...RADNUS_DEFAULT, arm: 'fold', fire: null, mouth: st.radMouth ?? 'smile'}, {});
  // the window slides from [0, 480) (Mas alone, Radnus off frame right) to [105, 585) (the two-shot)
  const off = Math.round(clamp(st.cam, 0, 1) * 105);
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, t.c[y * WIDE + x + off]);
  void f;
};
// ------------------------------------------------------------------ RADNUS at MCU: the roll call's bust (COPIED)
// shared/pixel/cast/rollcall.ts radnusFig and RADNUS_RIG (the intro's roll-call flash: the approved MCU of him; the
// shared file isn't exported or edited), with the mouths the exchange needs: the polite smile (closed, both corners
// up), 'open' (talking: the smile's line parted over a small dark opening), 'O'
const fplane = (onlyMat: string, tone: number, ...prims: FPrim[]): FAdjust => ({prims, tone, onlyMat});
type RadMouth = 'smile' | 'open' | 'O';
const radnusFig = (mouth: RadMouth): FDef => {
  const parts: FPart[] = [
    {group: 'torso', mat: 'sweater', tone: 2, prims: [FP.poly(8, 150, 10, 128, 22, 118, 40, 112, 58, 110, 76, 112, 92, 116, 106, 124, 116, 134, 120, 150)]},
    {group: 'collar', mat: 'shirt', tone: 3, prims: [FP.poly(56, 108, 64, 112, 72, 113, 82, 110, 86, 112, 80, 120, 72, 122, 62, 119, 54, 112)]},
    {group: 'neck', mat: 'skin', tone: 1, prims: [FP.poly(60, 88, 60, 110, 70, 115, 82, 110, 84, 90)]},
    {group: 'head', mat: 'skin', tone: 2, prims: [FP.poly(
      58, 38, 68, 33, 78, 33, 86, 38, 90, 45, 92, 53, 93, 58, 92, 62, 96, 69, 97, 71, 94, 73, 93, 75, 94, 77, 93, 80, 93, 83, 91, 88,
      87, 94, 80, 99, 72, 100, 64, 96, 58, 90, 54, 82, 52, 72, 49, 62, 49, 50, 52, 43)]},
    {group: 'ear', mat: 'skin', tone: 2, prims: [FP.poly(51, 64, 55, 60, 59, 62, 60, 70, 58, 78, 53, 79, 50, 72)]},
    {group: 'hair', mat: 'hair', tone: 2, prims: [FP.poly(
      50, 58, 48, 48, 52, 40, 60, 34, 70, 31, 80, 31, 88, 36, 92, 43, 93, 50, 89, 46, 84, 44, 78, 44, 72, 45, 67, 47, 64, 52, 62, 58, 60, 64, 57, 62, 53, 60)]},
  ];
  const adjust: FAdjust[] = [
    fplane('skin', 3, FP.poly(74, 45, 84, 44, 89, 46, 92, 53, 93, 58, 92, 62, 96, 69, 97, 71, 94, 73, 93, 75, 94, 77, 93, 80, 93, 83, 91, 88, 87, 94, 80, 99, 76, 98, 78, 88, 78, 78, 77, 68, 76, 58, 74, 50)),
    fplane('skin', 4, FP.poly(80, 46, 88, 47, 90, 52, 84, 52), FP.poly(92, 63, 95, 68, 94, 70, 91, 68), FP.poly(84, 72, 88, 71, 88, 75, 84, 76), FP.poly(88, 88, 91, 86, 90, 90, 87, 92)),
    fplane('skin', 5, FP.line(94, 69, 95, 69), FP.line(85, 47, 87, 47)),
    fplane('skin', 4, FP.poly(76, 68, 82, 67, 83, 71, 78, 73)),
    fplane('skin', 2, FP.line(85, 76, 83, 82)),
    fplane('skin', 1, FP.poly(72, 56, 86, 55, 86, 58, 74, 59), FP.poly(89, 56, 92, 57, 91, 60, 89, 59)),
    fplane('skin', 2, FP.poly(88, 60, 91, 62, 91, 68, 88, 70)),
    fplane('skin', 1, FP.poly(90, 73, 95, 73, 94, 75, 90, 75), FP.poly(86, 85, 92, 84, 91, 86, 87, 87)),
    fplane('skin', 1, FP.poly(52, 70, 58, 70, 62, 84, 68, 94, 64, 96, 58, 90, 54, 82)),
    fplane('skin', 1, FP.poly(62, 96, 72, 100, 80, 99, 84, 97, 84, 104, 72, 108, 62, 104)),
    fplane('skin', 0, FP.line(64, 98, 72, 101), FP.line(73, 101, 82, 99)),
    fplane('skin', 3, FP.poly(80, 100, 84, 98, 84, 108, 80, 110)),
    fplane('skin', 1, FP.poly(53, 65, 57, 64, 58, 71, 56, 76, 53, 74)),
    fplane('skin', 0, FP.poly(54, 68, 56, 68, 56, 72, 54, 72)),
    fplane('hair', 3, FP.poly(66, 34, 80, 32, 88, 37, 92, 44, 86, 42, 78, 40, 70, 40)),
    fplane('hair', 4, FP.line(70, 35, 82, 34), FP.line(84, 37, 90, 43)),
    fplane('hair', 0, FP.line(62, 36, 70, 34)),
    fplane('hair', 1, FP.poly(50, 58, 48, 48, 52, 42, 56, 44, 56, 56, 53, 60)),
    fplane('sweater', 3, FP.poly(76, 114, 92, 116, 106, 124, 110, 132, 96, 134, 84, 126)),
    fplane('sweater', 4, FP.line(84, 114, 104, 123)),
    fplane('sweater', 1, FP.poly(8, 150, 10, 128, 22, 118, 36, 114, 30, 130, 26, 150)),
    fplane('sweater', 1, FP.line(52, 124, 56, 150), FP.line(94, 136, 98, 150)),
    fplane('shirt', 4, FP.poly(76, 112, 82, 110, 86, 112, 80, 118)),
    fplane('shirt', 1, FP.poly(54, 112, 58, 110, 64, 116, 60, 118)),
  ];
  const MOUTH: Record<RadMouth, string[]> = {
    smile: ['r..........', '.mmmmmmmmr.', '..llllll...'],
    open: ['r..........', '.mmmmmmmmr.', '..mddddm...', '...llll....'],
    O: ['...........', '...mmmm....', '..mddddm...', '...mmmm....', '....ll.....'],
  };
  const stamps: FStamp[] = [
    {x: 74, y: 59, rows: ['..LLLLLLL.', '.LwgIIwwL.', '..kkkkkk..'], pal: {L: PAL.N0, w: PAL.S4, I: PAL.N0, g: PAL.W8, k: PAL.S2}},
    {x: 89, y: 60, rows: ['LLL', 'wIL', 'kk.'], pal: {L: PAL.N0, w: PAL.S4, I: PAL.N0, k: PAL.S2}},
    {x: 72, y: 54, rows: ['...bbbbbbb.', '.bbbbbbbbbb', 'bb.........'], pal: {b: PAL.B0}},
    {x: 88, y: 55, rows: ['.bbb', 'bb..'], pal: {b: PAL.B0}},
    {x: 92, y: 72, rows: ['o.', '.o'], pal: {o: PAL.S1}},
    {x: 81, y: 78, rows: MOUTH[mouth], pal: {m: PAL.S1, l: PAL.S3, r: PAL.S2, d: PAL.N0}},
  ];
  return {w: 124, h: 150, parts, adjust, stamps};
};
const RADNUS_RIG: FRig = {
  key: [0.95, -0.3], keyBand: 0, shadowBand: 0, rim: true, outline: true, edgesOnTop: true, noEdge: ['shirt', 'collar'],
  back: [-1, -0.2], backBand: 1,
  backRamp: {skin: PAL.S3, hair: PAL.N5, sweater: PAL.N5},
  ramps: {
    skin: [PAL.S0, PAL.S1, PAL.S2, PAL.S3, PAL.S4, PAL.S5],
    hair: [PAL.N0, PAL.B0, PAL.B1, PAL.B2, PAL.B3, PAL.N7],
    sweater: [PAL.N0, PAL.N2, PAL.N4, PAL.N5, PAL.N6, PAL.N8],
    shirt: [PAL.N1, PAL.G3, PAL.G4, PAL.G5, PAL.G6, PAL.P2],
  },
};
const RAD = new Map<RadMouth, FImg>();
const radnusImg = (m: RadMouth) => { let im = RAD.get(m); if (!im) { im = renderFig(radnusFig(m), RADNUS_RIG); RAD.set(m, im); } return im; };
/** the hedge soft and close behind a single (two rungs down, the leaves larger), cached */
let HSOFT: Buf | null = null;
const hedgeSoft = () => {
  if (HSOFT) return HSOFT;
  const b = new Buf(480, 270, PAL.N0);
  vramp(b, 0, 0, 480, 18, [PAL.C6, PAL.C7]);
  for (let y = 18; y < RH; y++) for (let x = 0; x < 480; x++) { const h = hash(x >> 2, y >> 2, 5); b.set(x, y, y < 22 ? PAL.L3 : h < 0.2 ? PAL.L2 : h > 0.85 ? PAL.L0 : PAL.L1); }
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, stepColor(b.get(x, y), -1));
  HSOFT = b;
  return b;
};
/** [MCU] Radnus outside the hedge, turned to Mas (camera-left: the roll call's bust, flipped), the polite smile; lip-
 *  synced ('smile' at rest, 'open' / 'O' on his words) */
export const radnusMCU = (b: Buf, f: number, st: {mouth?: RadMouth}) => {
  b.c.set(hedgeSoft().c.subarray(0, 480 * RH));
  const im = radnusImg(st.mouth ?? 'smile');
  const X = 200, Y = 50;
  for (let j = 0; j < im.h && Y + j < RH; j++) for (let i = 0; i < im.w; i++) { const v = im.c[j * im.w + (im.w - 1 - i)]; if (v >= 0) b.set(X + i, Y + j, v); }
  // the bust's foot carried down to the frame's edge (his sweater)
  for (let x = X; x < X + im.w; x++) { const v = im.c[(im.h - 1) * im.w + (im.w - 1 - (x - X))]; if (v >= 0) for (let y = Y + im.h; y < RH; y++) b.set(x, y, v); }
  void f;
};
/** [MCU] Mas outside the hedge for "as a guest." (his approved portrait, MIRRORED to face Radnus at camera-right, the
 *  noon key on his face's front), dry, lip-synced; the hedge soft behind; his phone low in his hand, out of frame */
export const masGuest = (b: Buf, f: number, st: {mouth?: MasPortraitState['mouth']}) => {
  b.c.set(hedgeSoft().c.subarray(0, 480 * RH));
  putBustSoft(b, masNoonImg({mouth: st.mouth ?? 'rest', look: -1}), 150, 40, RH);
  void f;
};
