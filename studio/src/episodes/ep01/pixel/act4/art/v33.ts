// MR. MAS — Ep1 v3.3 · Act Four art (the v3-shots-act4 pass; NEW, additive, opt-in): the v3.3 polish's small drawings
// (PLAN.md §6: S2 / P15, S4 / S5 / P17; script-v33-notes.md §2). Nothing shared is edited; each is a new drawing or a
// state over an existing one, in the shared modules' conventions (whole palette rungs, held drawings, no blends).
//   drawBlankPage(b, cx, cy, st)   S4.10b: the page Ttemme turns over toward us, its back BLANK (the running gag: the
//                                  reason is never shown): 'edge' (the page edge-on, turning) · 'turn' (three-quarters)
//                                  · 'blank' (the full sheet facing us, nothing on it), held in his two hands (the
//                                  folder kit's hand drawing) at the folder's spot in his rig (cx, cy)
//   EMPLOYEE / drawEmployee(b, footX, footY, st)
//                                  S7.02: the employee who asked "Is this a coup?" (S3.06's tile 22: long dark hair, her
//                                  skin, the green top), now in the bullpen with the rest, coat on, a box in her arms:
//                                  rooms/bullpen's own walkout extra (walkoutExtra seed 73, coat 3 the green parka: the
//                                  seed whose hair, hair length and skin are her tile's, found by a search), turned to
//                                  face Mas (flipped); her mouth opens on the take's syllables ('open': the extra's 2 px
//                                  mouth goes dark and her lower lip drops a pixel, as cast/employee-stand does her tile)
//   drawWallTV(b, st)              S7.02 / S7.02b: the bullpen's wall TV, hung on the conference room's glass (over the
//                                  room's own dark screen), 100 x 56: an interview set, TASYA at a podcast mic (his
//                                  medium rig, cast/tasya-medium, lip-synced when he talks), the mic on its boom arm in
//                                  front of him. Drawn only where no one stands in front of it (the crowd mask)
//   WALL_TV                        its rect
//   v3.3b (the newcomer's notes: "I can't find who's speaking"; audit #10 "the podcast mic isn't drawn"):
//   recolourCrowd(b)               S7.02: the two walkout extras in the green parka (rooms/bullpen WALKOUT_CROWD, coat 3)
//                                  re-coated (plum, charcoal) wherever their own pixels show, so she's the one green coat
//   employeeBust(st) / drawEmployeeM(b, st)
//                                  S7.02 [M]: the employee at bust scale on the civic kit (cast/civic-kit bustHead: the
//                                  shared skull, 3/4 camera-left, six mouths), her tile's long dark hair and skin, the
//                                  green parka (the jacket torso, a hood behind the neck), a cream top; the packed box
//                                  in her arms across the frame's foot, her hands over its top edge
//   drawTVInsert(b, st)            S7.02b [INSERT]: the bullpen's wall TV filling the frame: the interview set (acoustic
//                                  foam behind him, two warm practicals, the desk's edge), TASYA's warm portrait lip-synced
//                                  (cast/tasya-phone tasyaRoomPortrait), a foam-covered podcast mic on a boom arm in front
//                                  of him, a `PODCAST` bug in the screen's corner; round it the bullpen's wall, ceiling and
//                                  floor (they step to slate: rooms/bullpen toSlate, column by column, 3 held steps each),
//                                  and in the foreground a staff member's head and a packed box, in silhouette
import {Buf, rect, bayer} from '../../../../../shared/pixel/px';
import {PAL, stepColor} from '../../../../../shared/pixel/palette';
import {blitImg} from '../../../../../shared/pixel/figure';
import type {Img} from '../../../../../shared/pixel/figure';
import {walkoutExtra, EXTRA_H, EXTRA_W, WALKOUT_CROWD, CROWD_LOOK_X, toSlate} from '../../../../../shared/pixel/rooms/bullpen';
import {FigureDef, LightRig, P, Part, Stamp, Adjust, renderFigure} from '../../../../../shared/pixel/figure';
import {memo} from '../../../../../shared/pixel/cast/kit';
import {bustHead, suitTorso, plane, SKIN, HAIR, CIV_W, CIV_H, FACE_DEFAULT, putBustCut} from '../../../../../shared/pixel/cast/civic-kit';
import type {FaceState} from '../../../../../shared/pixel/cast/civic-kit';
import {tasyaRoomPortrait} from '../../../../../shared/pixel/cast/tasya-phone';
import {pt, pw} from '../../../../../shared/pixel/kits/uitype';
import {tasyaMedium, TASYA_MEDIUM_DEFAULT} from '../../../../../shared/pixel/cast/tasya-medium';
import type {Viseme} from '../../../../../shared/pixel/cast/talk';

const RH = 203;

// ================================================================== S4.10b: the blank page
const HAND = ['.oo.', 'o45o', 'o44o', 'o45o', 'o44o', 'o33o', '.oo.'];
const hand = (b: Buf, x: number, y: number, flip: boolean) => {
  const pal: Record<string, number> = {o: PAL.S0, '3': PAL.S3, '4': PAL.S4, '5': PAL.S5};
  HAND.forEach((r, j) => { for (let i = 0; i < 4; i++) { const c = pal[r[flip ? 3 - i : i]]; if (c !== undefined) b.set(x + i, y + j, c); } });
};
export const drawBlankPage = (b: Buf, cx: number, cy: number, st: 'edge' | 'turn' | 'blank') => {
  const H = 31, y = cy - 16;
  const w = st === 'edge' ? 3 : st === 'turn' ? 13 : 24;
  const x = cx - Math.floor(w / 2);
  if (st === 'turn') { // three-quarters: the near edge taller than the far (a trapezoid), the sheet's face catching the light
    for (let i = 0; i < w; i++) { const inset = Math.round((i / w) * 2); for (let j = inset; j < H - inset; j++) b.set(x + i, y + j, i === 0 ? PAL.G5 : j === inset ? PAL.P1 : PAL.P2); }
  } else if (st === 'edge') {
    rect(x, y, w, H, b.ink(PAL.P1)); rect(x + 1, y, 1, H, b.ink(PAL.P2));
  } else {
    rect(x, y, w, H, b.ink(PAL.P2)); // the back of the page: blank
    rect(x, y, w, 1, b.ink(PAL.P1)); rect(x, y, 1, H, b.ink(PAL.P1)); // its lit top and near edges
    rect(x + 1, y + H, w, 1, b.ink(PAL.G3)); rect(x + w, y + 1, 1, H, b.ink(PAL.G3)); // its shadow on him
    b.set(x + w - 1, y, PAL.P1); b.set(x + w - 2, y + 1, PAL.G6); // a corner's slight curl
  }
  hand(b, x - 3, cy - 4, false); hand(b, x + w - 1, cy - 4, true);
};

// ================================================================== S7.02: the employee, speaking
const EMP_SEED = 73, EMP_COAT = 3;
/** her mouth in the (unflipped) extra: bullpen walkoutExtra draws it at (hx + 8, hy + 10) with hx 9 and this seed's
 *  height offset 3 (measured on the drawing) */
const EMP_MOUTH: [number, number] = [17, 13];
let EMP: Img | null = null;
export const EMPLOYEE = {w: EXTRA_W, h: EXTRA_H, foot: [15, EXTRA_H - 1] as [number, number], head: [8, 2, 22, 16] as [number, number, number, number]};
export const drawEmployee = (b: Buf, footX: number, footY: number, st: {mouth?: 'open' | 'rest'; flip?: boolean} = {}) => {
  const img = (EMP ??= walkoutExtra(EMP_SEED, {coat: EMP_COAT}));
  const x = footX - EMPLOYEE.foot[0], y = footY - EMPLOYEE.foot[1];
  blitImg(b, img, x, y, {flip: st.flip});
  if (st.mouth === 'open') {
    const [mx, my] = EMP_MOUTH, lip = img.c[(my) * img.w + mx];
    const X = (i: number) => (st.flip ? x + EXTRA_W - 1 - i : x + i);
    b.set(X(mx), y + my, PAL.N0); b.set(X(mx + 1), y + my, PAL.N0);
    if (lip >= 0) b.set(X(mx), y + my + 1, lip);
  }
};

// ================================================================== S7.02 / S7.02b: the bullpen's wall TV
export const WALL_TV = {x: 140, y: 42, w: 100, h: 56};
export interface WallTVState { f: number; mouth?: Viseme; lid?: 0 | 1 | 2; }
/** the TV into `b` wherever `free(x, y)` (nobody in front of it) */
export const drawWallTV = (b: Buf, st: WallTVState, free: (x: number, y: number) => boolean = () => true) => {
  const T = WALL_TV;
  const t = new Buf(T.w, T.h + 4, PAL.N0);
  // the panel: a thin black bezel, its lower lip catching the window light
  rect(0, 0, T.w, T.h, t.ink(PAL.N0)); rect(1, T.h - 2, T.w - 2, 1, t.ink(PAL.G2));
  const sx = 3, sy = 3, sw = T.w - 6, sh = T.h - 7;
  // the interview set: a warm dark studio, two soft practical lights behind him, the desk's edge
  for (let y = 0; y < sh; y++) for (let x = 0; x < sw; x++) t.set(sx + x, sy + y, y > sh - 8 ? (y === sh - 8 ? PAL.D3 : PAL.D1) : (x + y) % 11 === 0 ? PAL.D2 : PAL.N1);
  for (const [lx, ly] of [[12, 8], [80, 11]]) for (let j = -3; j <= 3; j++) for (let i = -3; i <= 3; i++) if (i * i + j * j <= 9) t.set(sx + lx + i, sy + ly + j, i * i + j * j <= 2 ? PAL.W6 : PAL.W3);
  // TASYA, his medium rig, head and shoulders in the frame (the rig's top 46 rows), 3/4 toward the host off-screen left
  const img = tasyaMedium({...TASYA_MEDIUM_DEFAULT, mouth: st.mouth ?? 'smile', lid: st.lid ?? 0, brow: 'warm', arm: 'clasp'});
  blitImg(t, img, sx + 18, sy + 2, {clip: (x, y) => x >= sx && x < sx + sw && y >= sy && y < sy + sh - 7});
  // the podcast mic on its boom arm: the arm in from the frame's left edge (clear of his face), the mic at his mouth's
  // height a little in front of him, tilted up toward it (a black cylinder, its grille's rim lit, the windscreen's top)
  const mx = sx + 44, my = sy + 32;
  for (let i = 0; i <= mx - 2 - sx; i++) { const x = sx + i, y = sy + 26 + Math.round((i * 8) / (mx - 2 - sx)); t.set(x, y, PAL.G3); t.set(x, y + 1, PAL.N0); }
  for (let j = 0; j < 12; j++) for (let i = 0; i < 6; i++) {
    const x = mx + i - Math.floor(j / 4), y = my + j;
    t.set(x, y, j < 5 ? (i === 0 || i === 5 ? PAL.N0 : (i + j) % 2 ? PAL.G2 : PAL.N2) : i === 4 ? PAL.G3 : i === 0 ? PAL.N0 : PAL.N1);
  }
  for (let i = 0; i < 6; i++) t.set(mx + i, my - 1, PAL.G4);
  // the TV's cool light on the glass round it (one rung, 2 px)
  for (let y = -2; y < T.h + 2; y++) for (let x = -2; x < T.w + 2; x++) {
    const X = T.x + x, Y = T.y + y;
    if (X < 0 || X >= 480 || Y < 0 || Y >= RH || !free(X, Y)) continue;
    if (x >= 0 && x < T.w && y >= 0 && y < T.h) b.set(X, Y, t.get(x, y));
    else b.set(X, Y, stepColor(b.get(X, Y), 1));
  }
};

// ================================================================== v3.3b · S7.02: the one green coat
/** the other green parkas' new coats (rooms/bullpen COATS: 4 plum, 2 charcoal), away from their neighbours' */
const RECOAT: Record<number, number> = {180: 4, 438: 2};
export const recolourCrowd = (b: Buf) => {
  for (const e of WALKOUT_CROWD) {
    if (e.coat !== 3 || RECOAT[e.x] === undefined) continue;
    const flip = e.x > CROWD_LOOK_X;
    const A = walkoutExtra(e.seed, {coat: 3}), B = walkoutExtra(e.seed, {coat: RECOAT[e.x]});
    const x0 = e.x - 15, y0 = e.foot - EXTRA_H + 1;
    for (let y = 0; y < A.h; y++) for (let x = 0; x < A.w; x++) {
      const sx = flip ? A.w - 1 - x : x, a = A.c[y * A.w + sx];
      if (a < 0) continue;
      const X = x0 + x, Y = y0 + y;
      if (X < 0 || X >= 480 || Y < 0 || Y >= RH || b.get(X, Y) !== a) continue; // only where the extra itself shows
      b.set(X, Y, B.c[y * B.w + sx]);
    }
  }
};

// ================================================================== v3.3b · S7.02 [M]: the employee, close
export type EmployeeBustState = FaceState;
const EHEAD = {soft: true, dy: 2};
const empFig = (s: EmployeeBustState): FigureDef => {
  const hd = bustHead(EHEAD, s, {eye: 'lash', browCol: PAL.B0, lipCol: PAL.S2});
  const tor = suitTorso({kind: 'jacket'});
  const parts: Part[] = [
    // her long dark hair behind: straight, past the shoulders on the far side, behind the neck
    {group: 'hairB', mat: 'hair', tone: 2, prims: [P.poly(44, 38, 48, 27, 56, 19, 66, 15, 78, 16, 88, 23, 94, 34, 96, 50, 97, 70, 98, 92, 99, 116, 96, 124, 86, 124, 82, 112, 78, 96, 74, 80, 72, 66)]},
    // the parka's hood bunched behind her neck
    {group: 'hood', mat: 'parka', tone: 2, prims: [P.poly(38, 108, 42, 96, 56, 92, 76, 93, 92, 101, 96, 112, 72, 106, 52, 106)]},
    ...tor.parts.map((pt2) => ({...pt2, mat: pt2.mat === 'suit' ? 'parka' : pt2.mat === 'shirt' ? 'top' : pt2.mat})),
    ...hd.parts,
    // the front: a centre part, the hair framing her forehead and falling straight down the far side over the shoulder
    {group: 'hairF', mat: 'hair', tone: 3, prims: [P.poly(43, 42, 45, 32, 51, 24, 60, 19, 70, 17, 80, 19, 86, 26, 89, 37, 90, 52, 90, 70, 91, 92, 92, 114, 88, 118, 84, 108, 80, 90, 78, 72, 77, 54, 73, 40, 66, 30, 62, 25, 56, 30, 50, 36, 46, 43)]},
  ];
  const adjust: Adjust[] = [...tor.adjust.map((a) => ({...a, onlyMat: a.onlyMat === 'suit' ? 'parka' : a.onlyMat === 'shirt' ? 'top' : a.onlyMat})), ...hd.adjust,
    plane('hair', 4, P.poly(50, 30, 56, 24, 62, 21, 58, 26, 52, 32)), // the lit crown by the part
    plane('hair', 1, P.line(66, 24, 82, 34), P.line(82, 40, 86, 70), P.line(86, 76, 88, 110)), // strand partings
    plane('hair', 1, P.poly(90, 54, 97, 62, 98, 110, 95, 120, 90, 118, 90, 80)),
    // the parka's quilting: two stitched channels across the chest, the zip down the front
    plane('parka', 1, P.line(24, 128, 50, 124), P.line(76, 124, 110, 130), P.line(22, 140, 52, 136), P.line(74, 136, 112, 142)),
    plane('parka', 4, P.line(34, 108, 46, 103)),
    plane('parka', 0, P.line(62, 108, 62, 136)),
  ];
  const stamps: Stamp[] = [...tor.stamps, ...hd.stamps];
  return {w: CIV_W, h: CIV_H, parts, adjust, stamps};
};
const EMP_RIG: LightRig = {
  key: [-0.95, -0.35], keyBand: 0, shadowBand: 0, rim: true, outline: true, edgesOnTop: true, noEdge: ['top'],
  back: [1, -0.2], backBand: 1,
  backRamp: {skin: PAL.S3, parka: PAL.L2, hair: PAL.B3},
  ramps: {skin: SKIN.medium, hair: HAIR.dark, parka: [PAL.N0, PAL.L0, PAL.L1, PAL.L2, PAL.L3, PAL.L3], top: [PAL.N2, PAL.P0, PAL.P1, PAL.P1, PAL.P2, PAL.P2]},
};
export const employeeBust = memo((s: EmployeeBustState): Img => renderFigure(empFig(s), EMP_RIG));
export const EMP_BUST_AT: [number, number] = [262, 22]; // framing MCU_X.R, the bust's top
/** the bust at the right third (she looks across the frame, camera-left, to Mas), cut at the frame's foot, and the
 *  packed box in her arms over it: its lit top edge, the front face, tape, a desk plant sticking out, her hands */
export const drawEmployeeM = (b: Buf, s: Partial<EmployeeBustState> = {}) => {
  const [x, y] = EMP_BUST_AT;
  putBustCut(b, employeeBust({...FACE_DEFAULT, ...s}), x, y, RH);
  const bx = x + 8, by = 168, bw = 92;
  for (let j = by; j < RH; j++) for (let i = bx; i < bx + bw; i++) {
    const side = i >= bx + bw - 16, top = j < by + 3;
    b.set(i, j, top ? (j === by ? PAL.W5 : PAL.W4) : side ? (j === by + 3 ? PAL.W5 : PAL.W4) : j === by + 3 ? PAL.W4 : PAL.D4);
  }
  for (let j = by + 3; j < RH; j++) { b.set(bx + 30, j, PAL.P0); b.set(bx + 31, j, PAL.P1); } // the tape
  for (let j = by + 5; j < RH; j++) b.set(bx, j, PAL.D2);
  // her hands over the box's top edge: the back of each hand above the edge (lit along its top), the four fingers down
  // its front face, a shadow line between them
  const HANDM = [
    '..oooooooooo....',
    '.oLLLLLLLLLLo...',
    'oLlllllllllllo..',
    'olllllllllllllo.',
    'ommmmmmmmmmmmmmo',
    'omfmmfmmfmmfmmmo',
    'olfllflfllfllf.o',
    'olfllflfllfllfo.',
    'olfllflfllfllfo.',
    '.ofoofoofoofoo..',
  ];
  const HP: Record<string, number> = {o: PAL.S1, L: PAL.S5, l: PAL.S4, m: PAL.S3, f: PAL.S2};
  for (const [hx, flip] of [[bx + 4, false], [bx + bw - 22, true]] as Array<[number, boolean]>) HANDM.forEach((r, j) => { for (let i = 0; i < 16; i++) { const c = HP[r[flip ? 15 - i : i]]; if (c !== undefined) b.set(hx + i, by - 3 + j, c); } });
};

// ================================================================== v3.3b · S7.02b [INSERT]: the TV, filling the frame
export const TV_INSERT = {x: 24, y: 8, w: 432, h: 164, sx: 30, sy: 14, sw: 420, sh: 152};
export interface TVInsertState { f: number; mouth?: Viseme; lid?: 0 | 1 | 2; slate?: {floor: number; ceiling: number; walls: number} }
export const drawTVInsert = (b: Buf, st: TVInsertState) => {
  const T = TV_INSERT, L = st.slate ?? {floor: 0, ceiling: 0, walls: 0};
  // the bullpen round the TV: the ceiling's tiles, the wall (the conference room's frame and glass), the carpet
  const floorY = 180, ceilY = 6;
  const region = (y: number) => (y < ceilY ? 'ceiling' : y >= floorY ? 'floor' : 'walls') as 'ceiling' | 'floor' | 'walls';
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) {
    let c: number;
    if (y < ceilY) c = x % 40 === 0 || y === ceilY - 1 ? PAL.G4 : PAL.G5;
    else if (y >= floorY) c = bayer(x, y) < 0.35 ? PAL.G2 : PAL.G1;
    else c = x < 10 || x > 470 ? PAL.G3 : bayer(x, y) < 0.2 ? PAL.G4 : PAL.G3;
    const k = L[region(y)];
    if (k >= 3 || (k > 0 && x < (k * 480) / 3)) c = toSlate(c); // the landlord's room: 3 held steps, left to right
    b.set(x, y, c);
  }
  // the panel, a thin black bezel; its lower lip catches the window light
  rect(T.x, T.y, T.w, T.h, b.ink(PAL.N0)); rect(T.x + 2, T.y + T.h - 2, T.w - 4, 1, b.ink(PAL.G2));
  const scr = new Buf(T.sw, T.sh, PAL.N1);
  // the interview set: acoustic foam on the back wall (wedge tiles, their ridges alternating), two warm practicals
  for (let y = 0; y < T.sh; y++) for (let x = 0; x < T.sw; x++) {
    const tx = Math.floor(x / 20), ty = Math.floor(y / 20), u = x % 20, v = y % 20, horiz = (tx + ty) % 2 === 0;
    const r = horiz ? v % 5 : u % 5;
    scr.set(x, y, u === 0 || v === 0 ? PAL.N0 : r === 0 ? PAL.N2 : r === 1 ? PAL.G1 : PAL.N1);
  }
  for (const [lx, ly, r] of [[60, 40, 9], [380, 30, 7]] as Array<[number, number, number]>) for (let j = -r * 2; j <= r * 2; j++) for (let i = -r * 2; i <= r * 2; i++) {
    const d = Math.hypot(i, j) / r;
    if (d <= 1) scr.set(lx + i, ly + j, d < 0.45 ? PAL.W7 : PAL.W5); else if (d <= 2 && bayer(lx + i, ly + j) < 0.5 * (2 - d)) scr.set(lx + i, ly + j, PAL.D2);
  }
  // TASYA, warm-lit, cut at the desk's edge (his portrait: 3/4 camera-left, toward the host off screen)
  const TX = 230, TY = 6;
  putBustCut(scr, tasyaRoomPortrait({mouth: st.mouth ?? 'smile', lid: st.lid ?? 0, brow: 'warm', arms: 'none', jangle: 0}), TX, TY, T.sh - 12);
  rect(0, T.sh - 12, T.sw, 12, scr.ink(PAL.D1)); rect(0, T.sh - 12, T.sw, 1, scr.ink(PAL.D3)); // the desk's edge
  // the podcast mic, big enough to read: a broadcast dynamic on a boom arm, angled up at his mouth from camera-left
  // and below (his mouth stays clear): the foam windscreen (a rounded black cap, its texture mottled, the key's rim along
  // its lit side), the long body, the yoke and its knob, the arm in two segments with its spring, the desk clamp
  const cx = TX + 18, cy = TY + 88; // the windscreen's centre, below-left of his mouth (portrait mouth: (43..55, 69..75))
  const ang = -0.5, ux = Math.cos(ang), uy = Math.sin(ang); // the mic's axis, pointing up-right toward his mouth
  const put = (x: number, y: number, c: number) => { if (x >= 0 && y >= 0 && x < T.sw && y < T.sh) scr.set(x, y, c); };
  for (let t = -34; t <= 12; t += 0.5) for (let w = -12; w <= 12; w += 0.5) { // along the axis (t) and across it (w)
    const foam = t > -6, half = foam ? 12 * Math.sqrt(Math.max(0, 1 - ((t - 3) / 9.5) ** 2)) : t > -30 ? 8 - (t < -26 ? (-26 - t) : 0) : 0;
    if (Math.abs(w) > half) continue;
    const x = Math.round(cx + ux * t - uy * w), y = Math.round(cy + uy * t + ux * w);
    const edge = Math.abs(w) > half - 1.2, lit = w < -half + 4;
    put(x, y, edge ? PAL.N0 : foam ? (lit ? PAL.G4 : bayer(x, y) < 0.45 ? PAL.G2 : PAL.N2) : lit ? PAL.G3 : Math.abs(w) < 1.5 ? PAL.G2 : PAL.N1);
  }
  for (let q = -9; q <= 9; q++) put(Math.round(cx + ux * -6 - uy * q), Math.round(cy + uy * -6 + ux * q), PAL.G3); // the cap's rim ring
  // the yoke round the body and its knob, then the arm: down-left to the elbow, then to the clamp on the desk
  const yx = Math.round(cx + ux * -18), yy = Math.round(cy + uy * -18);
  for (let j = -1; j <= 12; j++) { put(yx - 10, yy + j, PAL.G3); put(yx + 10, yy + j, PAL.G2); }
  for (let i = -10; i <= 10; i++) put(yx + i, yy + 12, PAL.G3);
  rect(yx + 9, yy + 2, 4, 4, scr.ink(PAL.G4));
  const seg = (x0: number, y0: number, x1: number, y1: number) => {
    const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
    for (let q = 0; q <= n; q++) { const x = Math.round(x0 + ((x1 - x0) * q) / n), y = Math.round(y0 + ((y1 - y0) * q) / n); put(x, y, PAL.G4); put(x, y + 1, PAL.G2); put(x, y + 2, PAL.N0); if (q % 3 === 0) put(x + 1, y + 4, PAL.G3); }
  };
  seg(yx, yy + 12, yx - 60, yy - 6); seg(yx - 60, yy - 6, yx - 84, T.sh - 14);
  rect(yx - 90, T.sh - 18, 12, 6, scr.ink(PAL.G2)); rect(yx - 90, T.sh - 18, 12, 1, scr.ink(PAL.G4)); // the clamp
  // the bug: a small chip in the screen's top-left corner
  const bug = 'PODCAST', bw2 = pw(bug) + 14;
  rect(6, 6, bw2, 11, scr.ink(PAL.N0)); rect(6, 16, bw2, 1, scr.ink(PAL.R2));
  rect(9, 9, 3, 3, scr.ink(PAL.R3)); pt(scr, bug, 15, 8, PAL.P2);
  for (let y = 0; y < T.sh; y++) for (let x = 0; x < T.sw; x++) b.set(T.sx + x, T.sy + y, scr.get(x, y));
  // the foreground: a colleague's head and shoulders (bottom-left) and a packed box (bottom-right), in silhouette,
  // rimmed by the TV's light
  const fg = new Uint8Array(480 * RH);
  for (let y = 120; y < RH; y++) for (let x = 0; x < 160; x++) {
    const head = Math.hypot((x - 70) / 23, (y - 150) / 27) <= 1;
    const sh = y > 172 && Math.abs(x - 72) < 30 + (y - 172) * 2.2;
    if (head || sh) fg[y * 480 + x] = 1;
  }
  for (let y = 160; y < RH; y++) for (let x = 352; x < 480; x++) fg[y * 480 + x] = 1;
  for (let y = 140; y < 160; y++) if (y > 146) { fg[y * 480 + 410] = 1; fg[y * 480 + 411] = 1; } // a lamp's arm sticking out of the box
  for (let x = 404; x < 418; x++) { fg[146 * 480 + x] = 1; fg[147 * 480 + x] = 1; }
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) {
    if (!fg[y * 480 + x]) continue;
    const top = y > 0 && !fg[(y - 1) * 480 + x], right = x < 479 && !fg[y * 480 + x + 1];
    b.set(x, y, top || right ? (x > 352 && y === 160 ? PAL.D3 : PAL.C3) : PAL.N0);
  }
};
