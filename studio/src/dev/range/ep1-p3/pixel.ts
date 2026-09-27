// MR. MAS - style-range prototype E1-P3 (1.D, BELOW, ABOVE, AROUND): the PIXEL side of the clip, on the shared engine.
// Every pixel here is drawn by the show's own modules, read-only (rooms/bullpen walkout, cast/mas desk sprite,
// cast/tasya-speak portrait + room sprite, cast/swaps-act4 masLookDown, rooms/twoshots drawMadaM), framed with the
// Act Four animatic's MCU helpers (copied into px-kit.ts). What this file adds:
//   - the BOOKKEEPING the medium change needs: which layer of the room owns each native pixel (shell / the bench's
//     back / the back row / the bench's front / Mas's island / the front row) and which shell surface it is;
//   - the crowd's life (pass 7, replacing pass 6's breathing-only buffer shift): every extra is re-stamped per frame in
//     the room's own draw order, in a pose (breath, a box re-grip, a glance), and one of them walks out; a drizzle on
//     the windows (drawCrowdAt, rainOn);
//   - local, palette-true fixes on the shared drawings (passes 6-7, from the cold reviews): Tasya's single framed with
//     his hands below the frame (arms 'none'), his skin in daylight from the cut in, breathing, nods and a lean; Mas's
//     desk sprite without the mint (zombie) face; Mas's MCU without the orange edge fringe or the black hole in his hood,
//     his window-side rim cool, breathing, one blink, a brow and a listening dip on "Hello."; the fires in S7.05
//     lighting what is around them, with embers. Nothing in src/shared is edited.
import {Buf, rect, bayer} from '../../../shared/pixel/px';
import {PAL, stepColor, nearest, toLinear, fromLinear, lightness} from '../../../shared/pixel/palette';
import type {Img} from '../../../shared/pixel/figure';
import {drawBullpen, BULLPEN, WALKOUT_CROWD, walkoutExtra, EXTRA_H, CROWD_LOOK_X, packedBox} from '../../../shared/pixel/rooms/bullpen';
import {h01, put} from '../../../shared/pixel/rooms/kit-b';
import {drawMasDesk, MAS_DESK_DEFAULT, MasDeskPose} from '../../../shared/pixel/cast/mas';
import {drawTasyaRoom, TASYA_ROOM_DEFAULT, tasyaSpeakPortrait, TasyaPortraitState} from '../../../shared/pixel/cast/tasya-speak';
import {masLookDown} from '../../../shared/pixel/cast/swaps-act4';
import {drawMadaM, FIRES_M} from '../../../shared/pixel/rooms/twoshots';
import {BPLATE} from '../../../shared/pixel/rooms/boardroom-plate';
import type {Viseme} from '../../../shared/pixel/cast/talk';
import {soft, drawBust, railBand, RH, MCU_X} from './px-kit';
import {TAKES} from './data';

export const G = BULLPEN;
export const TRANSP = 0x1000000;

// ================================================================== the clock
export const T = {
  wide: 0, tasya: 120, mas: 326, mada: 389, end: 437,
  // the three words (a5-30-06's own word clock): each surface's change [starts, lands]. "below" and "above" spread
  // out from him (the floor from under him, the ceiling from over his head); "around" closes in on Mas's island
  floor: [246, 257], ceiling: [269, 280], iris: [292, 308],
  hello: 354, railAt: 394,
} as const;

// ================================================================== mouths from the recorded cues (held on 2s)
const take = (id: string) => TAKES.find((t) => t.id === id)!;
export const mouthAt = (id: string, p: number): Viseme => {
  const t = take(id);
  const q = p - (p % 2);
  if (q < t.on * 24 - 1 || q > t.end * 24 + 1) return 'rest';
  let m: Viseme = 'rest';
  for (const [f, shape] of t.mouth) { if (q >= f) m = shape as Viseme; else break; }
  return m;
};
/** a blink schedule (lid 1, 2, 1 over 3 frames), placed off the stressed words */
const blinkAt = (p: number, starts: number[]): 0 | 1 | 2 => {
  for (const s of starts) { const k = p - s; if (k === 0 || k === 2) return 1; if (k === 1) return 2; }
  return 0;
};

// ================================================================== owners (which layer each native room pixel belongs to)
export const OWN = {shell: 0, benchBack: 1, back: 2, benchFront: 3, island: 4, front: 5} as const;
/** Mas's end desk (station 3): its chair, laptop, glass, box and bench top stay pixel with him */
const ISLAND_X0 = G.stations[3][0] - 2, ISLAND_X1 = G.stations[3][1] + 2;
const chairRect = (i: number) => { const [a, b] = G.stations[i]; const cx = Math.round((a + b) / 2) + 2; return [cx - 8, G.bench.back - 21, 16, 21] as const; };
const monitorRect = (i: number) => [G.stations[i][0] + 5, G.bench.back - 16, 18, 16] as const;
const inR = (x: number, y: number, r: readonly [number, number, number, number]) => x >= r[0] && x < r[0] + r[2] && y >= r[1] && y < r[1] + r[3];
const flipH = (im: Img): Img => { const o: Img = {w: im.w, h: im.h, c: new Int32Array(im.w * im.h)}; for (let y = 0; y < im.h; y++) for (let x = 0; x < im.w; x++) o.c[y * im.w + x] = im.c[y * im.w + (im.w - 1 - x)]; return o; };
export const extraImg = (e: typeof WALKOUT_CROWD[number]) => { const im = walkoutExtra(e.seed, {coat: e.coat}); return e.x > CROWD_LOOK_X ? flipH(im) : im; };
/** the walkout crowd in the room's own draw order, with the layer each one belongs to */
export const CROWD = WALKOUT_CROWD.map((e) => ({...e, layer: e.behind || e.foot < 170 ? OWN.back : OWN.front}));
const stamp = (own: Uint8Array | Int16Array, img: Img, x: number, y: number, v: number, clip?: (x: number, y: number) => boolean) => {
  for (let j = 0; j < img.h; j++) for (let i = 0; i < img.w; i++) {
    if (img.c[j * img.w + i] < 0) continue;
    const X = x + i, Y = y + j;
    if (X < 0 || Y < 0 || X >= 480 || Y >= RH || (clip && !clip(X, Y))) continue;
    own[Y * 480 + X] = v;
  }
};
const deskBoxAt = (i: number): [number, number, number] => { const [a, b] = G.stations[i]; return [Math.round((a + b) / 2) - 8 + (i === 3 ? 6 : 0), G.bench.back - 24, i === 3 ? 3 : (i * 3 + 1) % 5]; };

// ================================================================== the crowd's life (pass 7): poses on held drawings
/**
 * Which extras a shot's room has. The wide has them all. The MCUs have the BACK row only (the behind-bench four and the
 * pair by the window): the front row stands at Tasya's own depth (feet on rows 188-197, his on 197), so in a closer
 * camera they would be his size, off to the sides of the lens, never small figures in the room behind him (pass 6).
 */
export type CrowdSet = 'all' | 'back' | 'none';
const inSet = (e: typeof CROWD[number], set: CrowdSet) => set === 'all' || (set === 'back' && e.layer === OWN.back);
/** each extra's breath: 52..78 frames, never in step with a neighbour (vector.ts breathAt uses the same clock) */
const breathClock = (seed: number) => { const per = 2 * (26 + Math.floor(h01(seed, 81) * 14)); return {per, ph: Math.floor(h01(seed, 82) * per)}; };
/** out-breath: the upper body one native pixel down, held (on 2s, like every held drawing in the room) */
export const exhale = (seed: number, p: number) => { const {per, ph} = breathClock(seed); const q = p - (p % 2); return (q + ph) % per >= per / 2; };
/**
 * The pass-6 crowd only breathed (one native pixel, 0.2% of the frame changing: the cold read called the wide a frozen
 * plate). Pass 7 gives the walkout its life, every beat with a reason in the scene, all on held drawings:
 *  - WALKER (the wide only): seed 40, front row left, has had enough. She turns and walks out past the hall mouth and
 *    off frame left as the wide opens (gone by p75, before Mas's question lands).
 *  - LOOK (a glance: the head turned the other way, then back): seed 8 looks back after her (p22-57); on Mas's
 *    question the woman by the window (seed 5) turns to her neighbour (p70-99), "did he just ask that?"; in Tasya's
 *    single she does it again on "all the IP rights" (p184-209), and seed 3, at the left end, glances toward the hall
 *    where people are leaving (p146-175).
 *  - HITCH (a box re-gripped: the box, the arms and the hands up one pixel for 4 frames): arms get tired.
 * Nothing moves between p284 and p312: the ring hands the room to the landlord there and the staff take over the
 * pixel poses as they stand (vector.ts draws no glances).
 */
const WALK = {seed: 40, x0: 150, speed: 2.2, hold: 4, stride: 5};
const LOOK: Record<number, Array<[number, number]>> = {8: [[22, 58]], 5: [[70, 100], [184, 210]], 3: [[146, 176]]};
const HITCH: Record<number, number[]> = {26: [36], 14: [92, 236], 30: [124, 168], 3: [214], 21: [256], 18: [102]};
const inAny = (p: number, spans?: Array<[number, number]>) => !!spans && spans.some(([a, b]) => p >= a && p < b);
export interface Pose { breath: boolean; hitch: boolean; look: boolean; walk: number }
export const poseAt = (seed: number, p: number): Pose => ({
  breath: exhale(seed, p),
  hitch: (HITCH[seed] ?? []).some((a) => p >= a && p < a + 4),
  look: inAny(p, LOOK[seed]),
  walk: seed === WALK.seed ? Math.floor(p / WALK.hold) % 4 : -1,
});
/** the walker's x (native, the sprite's centre) at clip frame p; she is gone once it is under -15 */
const walkerX = (p: number) => Math.round(WALK.x0 - WALK.speed * p);
const poseMemo = new Map<string, Img>();
/**
 * A walkout extra's drawing in a pose, stepped k soft rungs (the MCU's rack). Built on the shared walkoutExtra drawing
 * (rows: head 0..12+dy, the box 32..43+dy, the coat's hem at legTop), moved in whole native pixels, never redrawn.
 */
const poseImg = (e: typeof CROWD[number], pose: Pose, k: number): Img => {
  const key = `${e.seed}:${+pose.breath}${+pose.hitch}${+pose.look}:${pose.walk}:${k}`;
  let im = poseMemo.get(key);
  if (im) return im;
  const src = walkoutExtra(e.seed, {coat: e.coat});
  const W = src.w, H = src.h, dy = Math.floor(h01(e.seed, 29) * 4);
  let c = src.c.slice();
  const row = (a: Int32Array, y: number) => a.subarray(y * W, (y + 1) * W);
  if (pose.walk >= 0) {
    // four drawings: contact (near leg forward), passing, contact (far leg forward), passing; the legs lean from the
    // hem as whole-pixel shears (rows further down shift further), the body down a pixel on the contacts
    const legTop = (h01(e.seed, 25) < 0.55 ? 58 : 48) + dy;
    const pants = src.c[(legTop + 3) * W + 11];
    for (let y = legTop; y < H; y++) row(c, y).fill(-1);
    const s = pose.walk === 0 ? WALK.stride : pose.walk === 2 ? -WALK.stride : 0;
    const shear = (y: number, k2: number) => Math.round((k2 * (y - legTop)) / (H - 1 - legTop));
    const leg = (x0: number, x1: number, k2: number, lit: boolean) => {
      for (let y = legTop; y < 75; y++) for (let x = x0; x <= x1; x++) {
        const X = x + shear(y, k2);
        if (X >= 0 && X < W) c[y * W + X] = x === x0 && !lit ? PAL.N0 : x === x1 && lit ? stepColor(pants, 1) : pants;
      }
      for (let y = 75; y < 78; y++) for (let x = x0 - (lit ? 0 : 1); x <= x1 + (lit ? 2 : 0); x++) {
        const X = x + shear(y, k2);
        if (X >= 0 && X < W) c[y * W + X] = y === 75 && lit ? PAL.N1 : PAL.N0;
      }
    };
    leg(9, 13, -s, false); // the far leg (screen-left in the unflipped drawing)
    leg(16, 20, s, true); // the near leg, toward the light
    if (pose.walk === 1 || pose.walk === 3) { // passing: the trailing foot clears the floor by a pixel
      const [a, b2] = pose.walk === 1 ? [8, 13] : [16, 22];
      for (let x = a; x <= b2; x++) { for (let y = 74; y < 77; y++) c[y * W + x] = c[(y + 1) * W + x]; c[77 * W + x] = -1; }
    }
    if (pose.walk === 0 || pose.walk === 2) { // the body settles a pixel on the contacts
      const d = c.slice();
      for (let y = legTop; y >= 1; y--) row(c, y).set(row(d, y - 1));
      row(c, 0).fill(-1);
    }
  }
  if (pose.look) {
    // the head (rows up to the chin) mirrored about the head's own centre column (15)
    const d = c.slice();
    for (let y = 0; y <= 12 + dy; y++) for (let x = 0; x < W; x++) { const sx = 30 - x; c[y * W + x] = sx >= 0 && sx < W ? d[y * W + sx] : -1; }
  }
  if (pose.hitch) {
    // the box, the thing in it, the arms and the hands up one pixel (columns 4..25, rows 21..43 + dy)
    const d = c.slice();
    for (let y = 21 + dy; y <= 43 + dy; y++) for (let x = 4; x <= 25; x++) c[y * W + x] = d[(y + 1) * W + x];
  }
  if (pose.breath && pose.walk < 0) {
    // the out-breath: head, shoulders, arms and box down one pixel onto the coat
    const d = c.slice();
    const waist = 44 + dy;
    for (let y = waist + 1; y >= 1; y--) row(c, y).set(row(d, y - 1));
    row(c, 0).fill(-1);
  }
  const flip = seedFaces(e) < 0;
  if (flip) { const d = c.slice(); for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) c[y * W + x] = d[y * W + (W - 1 - x)]; }
  if (k) for (let i = 0; i < c.length; i++) if (c[i] >= 0) c[i] = stepColor(c[i], -k);
  im = {w: W, h: H, c};
  poseMemo.set(key, im);
  if (poseMemo.size > 400) poseMemo.delete(poseMemo.keys().next().value as string);
  return im;
};
/** which way an extra faces: +1 screen-right (toward Tasya from the left), -1 screen-left; the walker faces her exit */
const seedFaces = (e: typeof CROWD[number]) => (e.seed === WALK.seed ? -1 : e.x > CROWD_LOOK_X ? -1 : 1);
const softMemo = new Map<string, Img>();
const softImg = (key: string, im: Img, k: number): Img => {
  if (!k) return im;
  let o = softMemo.get(`${key}:${k}`);
  if (!o) { o = {w: im.w, h: im.h, c: im.c.map((v) => (v >= 0 ? stepColor(v, -k) : v))}; softMemo.set(`${key}:${k}`, o); }
  return o;
};
/**
 * The crowd (set) at clip frame p, in the room's own draw order, onto a room drawn WITHOUT its crowd: the behind-bench
 * extras (cut by the desk top), the desk boxes and the credenza box over them, then the rest front to back.
 */
export const drawCrowdAt = (b: Buf, p: number, set: CrowdSet, k = 0) => {
  const at = (e: typeof CROWD[number]) => (e.seed === WALK.seed ? walkerX(p) : e.x);
  for (const e of CROWD.filter((q) => q.behind && inSet(q, set))) put(b, poseImg(e, poseAt(e.seed, p), k), e.x - 15, e.foot - EXTRA_H + 1, {clip: (_x, y) => y < G.bench.back});
  for (let s = 0; s < 4; s++) { const [bx, by, kind] = deskBoxAt(s); put(b, softImg(`box${kind}`, packedBox(kind), k), bx, by); }
  put(b, softImg('box4', packedBox(4), k), G.win.x0 + 30, G.win.y1 + 9 - 25);
  for (const e of CROWD.filter((q) => !q.behind && inSet(q, set))) {
    const x = at(e);
    if (x < -16) continue;
    put(b, poseImg(e, poseAt(e.seed, p), k), x - 15, e.foot - EXTRA_H + 1, {clip: (_x, y) => y < RH});
  }
};

// ================================================================== rain on the windows (pass 7)
/**
 * The pixel bullpen's day is grey and wet: a drizzle falls past the windows (thin streaks, one rung off the exterior
 * behind them: darker on the pale sky, lighter on the towers), on 2s, and a few beads run down the glass. It moves
 * under every held shot of the room (the cold read took the glass sheen for rain that never moved), and it is what
 * the landlord's brochure swaps for a blue sky. Only on the exterior's own pixels (masks.window), drawn before the crowd.
 */
const RAIN = Array.from({length: 58}, (_, n) => ({x: Math.floor(h01(n, 91) * 160) - 12, ph: Math.floor(h01(n, 92) * 997), len: 3 + Math.floor(h01(n, 93) * 4), sp: 8 + Math.floor(h01(n, 94) * 4)}));
const BEADS = Array.from({length: 7}, (_, n) => ({x: Math.floor(h01(n, 95) * 134) + 1, ph: Math.floor(h01(n, 96) * 60), life: 30 + Math.floor(h01(n, 97) * 20), y0: Math.floor(h01(n, 98) * 50)}));
export const rainOn = (b: Buf, p: number, win: Uint8Array) => {
  const {x0, y0, y1} = G.win;
  const H = y1 - y0 + 14, t = Math.floor(p / 2);
  const hit = (x: number, y: number, k: number) => {
    if (x < 0 || x >= 480 || y < 0 || y >= RH || !win[y * 480 + x]) return;
    const c = b.c[y * 480 + x];
    b.c[y * 480 + x] = stepColor(c, lightness(c) > 0.62 ? -k : k);
  };
  for (const d of RAIN) {
    const u = (d.ph + t * d.sp) % H;
    const hy = y0 - 7 + u, hx = x0 + d.x + Math.floor(u * 0.18);
    for (let j = 0; j < d.len; j++) hit(hx - Math.floor(j * 0.18), hy - j, 1);
  }
  for (const d of BEADS) {
    const age = (t + d.ph) % d.life;
    const y = y0 + d.y0 + Math.floor(age * 0.8), x = x0 + d.x;
    if (y > y1) continue;
    hit(x, y, 2);
    if (age > 2) hit(x, y - 1, 1);
  }
};

// ================================================================== Mas at his end desk (the wide, and the island)
export const MAS_AT = (): [number, number] => [G.stations[3][0] + 6, G.bench.back - 37];
/** the two badges side by side on the desk before him: the GUEST lanyard (white card, cyan cord) and the MACROSOFT
 *  badge (slate card): tiny at room scale, as the stick reel's onscreen note has them */
const badges = (b: Buf) => {
  const y = G.bench.back + 1;
  const x0 = G.stations[3][0] + 20;
  for (const [dx, dy] of [[-3, 0], [-2, -1], [-1, -1], [0, -1], [1, 0], [5, 0], [6, -1], [7, -1]]) b.set(x0 + dx, y + dy, PAL.C4);
  rect(x0 + 1, y, 5, 3, b.ink(PAL.P2)); rect(x0 + 1, y + 2, 5, 1, b.ink(PAL.G5)); b.set(x0 + 2, y + 1, PAL.C5);
  rect(x0 + 8, y, 5, 3, b.ink(PAL.N7)); rect(x0 + 8, y + 2, 5, 1, b.ink(PAL.N6)); b.set(x0 + 9, y + 1, PAL.P2);
};
/**
 * His face in the bullpen by day (pass 6): the desk sprite's monitor ramp puts skin-under-cyan on the whole lit face,
 * which the cold read took for a zombie or a mask. The skin walks to the mixed-light and warm skin rungs (his monitor's
 * cyan stays on the hood's edge and the hair's rim: his light is still his), a master-palette remap, never a blend.
 */
const MAS_DAY_SKIN = new Map<number, number>([[PAL.K1, PAL.X1], [PAL.K2, PAL.X3], [PAL.K3, PAL.S4], [PAL.K4, PAL.S5], [PAL.K5, PAL.S6]]);
export const masDesk = (b: Buf, pose: Partial<MasDeskPose>, own?: Uint8Array, softK = 0) => {
  const [mx, my] = MAS_AT();
  const t = new Buf(480, 270, TRANSP);
  drawMasDesk(t, mx, my, {...MAS_DESK_DEFAULT, head: 'screen', light: 'monitor', ...pose});
  badges(t);
  for (let i = 0; i < 480 * RH; i++) {
    const v = t.c[i];
    if (v === TRANSP) continue;
    const d = MAS_DAY_SKIN.get(v) ?? v;
    b.c[i] = softK ? stepColor(d, -softK) : d;
    if (own) own[i] = OWN.island;
  }
};

// ================================================================== the plates (Tasya's MCU)
export interface Plate { buf: Buf; own: Uint8Array; reg: Uint8Array; win: Uint8Array }
export const REG = {none: 0, floor: 1, ceiling: 2, walls: 3} as const;
const cache = new Map<string, Plate>();
/**
 * The bullpen walkout as the MCU sees it (Tasya's bust is drawn later): the room plate, Mas at his end desk, the
 * crowd set, soft `k`. `own` is the layer of every pixel, `reg` the shell surface of every shell pixel.
 */
export const plate = (crowd: CrowdSet, k = TASYA_SOFT): Plate => {
  const key = `${crowd}:${k}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const buf = new Buf(480, 270, PAL.N0);
  const room = drawBullpen(buf, 0, {variant: 'walkout', crowd: crowd === 'all', masGlass: false});
  if (crowd === 'back') {
    // the room's own order, replayed with the back row only: behind-bench extras (cut by the desk top), the desk boxes
    // and the credenza box over them, then the pair by the window
    for (const e of CROWD.filter((q) => q.behind)) put(buf, extraImg(e), e.x - 15, e.foot - EXTRA_H + 1, {clip: (_x, y) => y < G.bench.back});
    for (let s = 0; s < 4; s++) { const [bx, by, kind] = deskBoxAt(s); put(buf, packedBox(kind), bx, by); }
    put(buf, packedBox(4), G.win.x0 + 30, G.win.y1 + 9 - 25);
    for (const e of CROWD.filter((q) => !q.behind && q.layer === OWN.back)) put(buf, extraImg(e), e.x - 15, e.foot - EXTRA_H + 1);
  }
  const own = new Uint8Array(480 * RH);
  const reg = new Uint8Array(480 * RH);
  const m = room.masks;
  for (let i = 0; i < 480 * RH; i++) {
    const x = i % 480, y = (i / 480) | 0;
    reg[i] = m.floor.a[i] ? REG.floor : m.ceiling.a[i] ? REG.ceiling : REG.walls;
    if (m.bench.a[i]) own[i] = x >= ISLAND_X0 && x < ISLAND_X1 ? OWN.island : y < G.bench.back && [0, 1, 2].some((s) => inR(x, y, monitorRect(s))) ? OWN.benchBack : OWN.benchFront;
    else if (m.furniture.a[i] && [0, 1, 2, 3].some((s) => inR(x, y, chairRect(s)))) own[i] = inR(x, y, chairRect(3)) ? OWN.island : OWN.benchBack;
    else if (m.dressing.a[i]) own[i] = OWN.back; // re-owned below by the replay
  }
  // replay the room's own draw order for the dressing: behind-crowd, desk boxes, the credenza box, then the rest
  for (const e of CROWD.filter((q) => q.behind && inSet(q, crowd))) stamp(own, extraImg(e), e.x - 15, e.foot - EXTRA_H + 1, OWN.back, (_x, y) => y < G.bench.back);
  for (let s = 0; s < 4; s++) { const [bx, by, kind] = deskBoxAt(s); stamp(own, packedBox(kind), bx, by, s === 3 ? OWN.island : OWN.benchFront); }
  stamp(own, packedBox(4), G.win.x0 + 30, G.win.y1 + 9 - 25, OWN.back);
  for (const e of CROWD.filter((q) => !q.behind && inSet(q, crowd))) stamp(own, extraImg(e), e.x - 15, e.foot - EXTRA_H + 1, e.layer);
  for (let i = 0; i < 480 * RH; i++) if (own[i] !== OWN.shell) reg[i] = REG.none;
  // Mas is the subject in the depth: the rack is held on him, so his island (him, his chair, his end desk, its box) keeps
  // its full value while the room around him sits k soft rungs back (pass 6: one rung back, his island printed as a
  // murky dark block against the landlord's pale room)
  const sharp = buf.c.slice(0, 480 * RH);
  soft(buf, k);
  for (let i = 0; i < 480 * RH; i++) if (own[i] === OWN.island) buf.c[i] = sharp[i];
  masDesk(buf, {}, own, 0);
  const win = Uint8Array.from(m.window.a, (v) => (v ? 1 : 0));
  const out = {buf, own, reg, win};
  cache.set(key, out);
  return out;
};
let islandPx: Int32Array | null = null;
/**
 * Tasya's MCU plate at clip frame p: the crowd-free room (soft, the island sharp), the rain on the windows, then the
 * back row in its poses (pre-stepped to the same soft rungs); the island is re-stamped on top (it never moves).
 */
export const plateAt = (p: number): Buf => {
  const base = plate('none');
  if (!islandPx) { const l: number[] = []; for (let i = 0; i < 480 * RH; i++) if (base.own[i] === OWN.island) l.push(i); islandPx = Int32Array.from(l); }
  const b = base.buf.clone();
  rainOn(b, p, base.win);
  drawCrowdAt(b, p, 'back', TASYA_SOFT);
  for (const i of islandPx) b.c[i] = base.buf.c[i];
  return b;
};

// ================================================================== the shots
/**
 * Tasya's MCU (pass 6): on the LEFT third, the portrait mirrored so he faces screen-right, toward Mas (who is screen-
 * right of him in the wide: the animatic's MCU had him facing away from the man he answers). Mas, small at his end
 * desk, sits in his eyeline behind him. The mirror also puts the portrait's key light on the window side.
 */
export const TASYA_DX = -10;
export const TASYA_SOFT = 2;
/**
 * His hands (pass 7). The portrait's clasp stamp read as a bread roll or a bow tie (cold read, pass 5), and pass 6's
 * redrawn laced fingers still read as a loaf at phone size. The single now frames him with his hands clasped at his
 * waist, below the frame (the portrait's own arms 'none': the blazer front, the shirt, the lapels): the wide shows the
 * clasp, the single shows his face, and nothing at chest height has to be read as hands.
 */
export const tasyaState = (p: number): TasyaPortraitState => ({
  mouth: mouthAt('a5-30-06', p) === 'rest' && p >= 310 ? 'smile' : mouthAt('a5-30-06', p) === 'rest' && p < 126 ? 'smile' : mouthAt('a5-30-06', p),
  lid: blinkAt(p, TASYA_BLINKS), brow: 'warm', arms: 'none', jangle: 0,
});
/**
 * His life in the single (pass 7; the cold read saw "only mouth flaps and blinks: no breathing, no head movement"), all
 * in whole native pixels on held drawings, the drawing itself never changed:
 *  - breath: an in-breath lifts the whole bust a pixel before each phrase (p118-126, p158-166, p232-240), and after
 *    "around them" he settles a pixel on a satisfied out-breath (p312 on);
 *  - his head (above the collar) dips a pixel on the stressed syllables of the first two phrases ("fine", "IP",
 *    "ca-PA-bility") and follows his own words in the third: down on "below", up on "above", level again on "around";
 *  - from "We are" (p241) he leans a pixel toward Mas, and stays there;
 *  - blinks every 1.5-3 s (never on "below" / "above" / "around").
 */
const TASYA_BLINKS = [141, 186, 230, 262, 318];
const TASYA_NECK = 95; // the portrait row between his chin and his collar: the head above it moves on its own
export const tasyaMotion = (p: number) => {
  const inhale = [[118, 126], [158, 166], [232, 240]].some(([a, b]) => p >= a && p < b);
  const q = p - (p % 2);
  const nod = [[142, 146], [182, 186], [210, 214]].some(([a, b]) => q >= a && q < b);
  const head = nod || (q >= 247 && q < 262) ? 1 : q >= 270 && q < 286 ? -1 : 0;
  return {body: inhale ? -1 : p >= 312 ? 1 : 0, head, lean: p >= 241 ? 1 : 0};
};
/** Tasya's skin in the bullpen's daylight (the whole shot): skin-under-cyan walks to the warm skin ramp */
const TASYA_SKIN = new Map<number, number>([[PAL.K0, PAL.S1], [PAL.K1, PAL.S2], [PAL.K2, PAL.S4], [PAL.K3, PAL.S5], [PAL.K4, PAL.S6], [PAL.K5, PAL.P2]]);
const tasyaImgs = new Map<string, Img>();
const tasyaImg = (s: TasyaPortraitState): Img => {
  const key = JSON.stringify(s);
  let im = tasyaImgs.get(key);
  if (im) return im;
  const src = tasyaSpeakPortrait(s);
  im = {w: src.w, h: src.h, c: src.c.slice()};
  for (let i = 0; i < im.c.length; i++) { const v = im.c[i]; if (v >= 0) im.c[i] = TASYA_SKIN.get(v) ?? v; }
  const W = im.w, fl = im.c.slice();
  for (let y = 0; y < im.h; y++) for (let x = 0; x < W; x++) im.c[y * W + x] = fl[y * W + (W - 1 - x)];
  tasyaImgs.set(key, im);
  if (tasyaImgs.size > 64) tasyaImgs.delete(tasyaImgs.keys().next().value as string);
  return im;
};
/**
 * The Tasya bust alone, on a transparent buffer (it never changes medium). `lit` = the landlord's room has reached him
 * (the closing ring passed him): the blazer's cyan glints go to slate and the body's falloff lifts (he stands in the lit
 * room, not on a black slab). His skin is in daylight from the cut in and his key is the window, so nothing else moves.
 */
export const tasyaLayer = (p: number, lit: boolean): Buf => {
  const b = new Buf(480, 270, TRANSP);
  const m = tasyaMotion(p);
  drawBust(b, tasyaImg(tasyaState(p)), 'L', TASYA_DX + m.lean, 22 + m.body, undefined, lit ? BUST_CAP.tasyaLit : 5, 1 / 6, {split: TASYA_NECK, dx: 0, dy: m.head});
  if (lit) {
    for (let i = 0; i < 480 * RH; i++) { const v = b.c[i]; if (v !== TRANSP) b.c[i] = BLAZER_DAY.get(v) ?? v; }
    bodyRim(b, 108);
  }
  return b;
};
/**
 * The window's daylight wraps his window side (screen right) once the room is lit: one native pixel on every right-
 * facing silhouette edge below his chin (the shoulder a pale cool rung, the body one rung up its own ramp). His face,
 * which is his profile on that side, keeps its drawing.
 */
const bodyRim = (b: Buf, y0: number) => {
  const src = b.c.slice(0, 480 * RH);
  const on = (x: number, y: number) => x >= 0 && x < 480 && y >= 0 && y < RH && src[y * 480 + x] !== TRANSP;
  for (let y = y0; y < RH; y++) for (let x = 0; x < 480; x++) {
    if (!on(x, y) || on(x + 1, y)) continue;
    b.c[y * 480 + x] = y < 150 ? PAL.N8 : stepColor(src[y * 480 + x], 1);
  }
};
/** the bust's centre (native), where "below" and "above" start and what the ring must pass to reach him */
export const TASYA_C: [number, number] = [MCU_X.L + TASYA_DX + 56, 118];
/** the blazer's cyan glints in the landlord's daylight go to slate (a remap, never a blend) */
const BLAZER_DAY = new Map<number, number>([[PAL.C2, PAL.N5], [PAL.C3, PAL.N6], [PAL.C4, PAL.N7], [PAL.C5, PAL.N8]]);
/** the deepest falloff rung of each bust in the vector room (6 = the animatic's negative fill) */
export const BUST_CAP = {tasyaLit: 3, mas: 4};

/**
 * Mas's MCU (S7.03): eyes down at the floor, on the RIGHT third facing screen-left (the reverse of Tasya's single: the
 * two singles now face each other across the cut). Pass 6, from the cold read:
 *  - the warm key's edge pixels (W5/W6 on the hair's top and left edge, the temple, the hood's rim) printed as an orange
 *    fringe against the pale room: each takes the colour of the drawing next to it (inside the figure);
 *  - the cool back rim (C2, screen right) becomes the room's own daylight on his window side (hair and ear G4, the
 *    hood N7), so the light that lights the landlord's room visibly touches him;
 *  - he breathes (the bust one native pixel down on the out-breath), blinks once before the line, and on "Hello." his
 *    brow goes up (masLookDown's brow 1) and stays up: he heard the floor.
 */
export const MAS_MCU_DX = 0;
const MAS_NECK = 86; // the look-down portrait's row between his chin and the hood
const masImgs = new Map<string, Img>();
const masImg = (brow: 0 | 1, blink: boolean): Img => {
  const key = `${brow}:${blink}`;
  let im = masImgs.get(key);
  if (im) return im;
  const src = masLookDown({mouth: 'rest', brow, light: 'warm'});
  im = {w: src.w, h: src.h, c: src.c.slice()};
  const W = im.w, H = im.h, at = (x: number, y: number) => (x < 0 || y < 0 || x >= W || y >= H ? -1 : src.c[y * W + x]);
  const warm = (v: number) => v === PAL.W5 || v === PAL.W6;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const v = at(x, y);
    if (warm(v)) {
      // the neighbour inside the figure (right, below, left, above: the key comes from camera-left and above)
      let rep = -1;
      for (const [dx, dy] of [[1, 0], [0, 1], [2, 0], [0, 2], [-1, 0], [0, -1]]) { const n = at(x + dx, y + dy); if (n >= 0 && !warm(n)) { rep = n; break; } }
      im.c[y * W + x] = rep >= 0 ? rep : PAL.B2;
    } else if (v === PAL.C2) im.c[y * W + x] = y < 80 ? PAL.G4 : PAL.N7;
  }
  // pass 7: the hood's opening beside his neck was pure black (N0), a hole in the hoodie at every size (cold read); it
  // takes the hood's own deepest rung, so it reads as the inside of the hood
  for (let y = 84; y <= 92; y++) for (let x = 58; x <= 80; x++) if (src.c[y * W + x] === PAL.N0) im.c[y * W + x] = PAL.G0;
  if (blink) {
    // lids closed over the lowered eyes: the iris row takes the lid's skin (the lash line above stays)
    const sN = src.c[46 * W + 51], sF = src.c[46 * W + 38];
    for (let x = 50; x <= 60; x++) im.c[50 * W + x] = sN;
    for (let x = 38; x <= 41; x++) im.c[50 * W + x] = sF;
  }
  masImgs.set(key, im);
  return im;
};
export const masLayer = (p: number): Buf => {
  const b = new Buf(480, 270, TRANSP);
  const k = p - T.mas;
  const down = (k >= 16 && k < 28) || (k >= 44 && k < 56); // two held out-breaths; the in-breath lands on "Hello."
  const blink = k === 7 || k === 8;
  const brow: 0 | 1 = p >= T.hello + 4 ? 1 : 0;
  // pass 7: on "Hello." his head (above the hood) dips a pixel toward the floor it came from, and stays: he listens
  const lean = p >= T.hello + 3 ? 1 : 0;
  drawBust(b, masImg(brow, blink), 'R', MAS_MCU_DX, down ? 23 : 22, undefined, BUST_CAP.mas, 1 / 6, {split: MAS_NECK, dx: 0, dy: lean});
  return b;
};

/** S7.02, the wide (all pixel): Mas asks, Tasya mid-floor, delighted; the crowd in coats with boxes in arms, breathing */
let wideBg: {buf: Buf; win: Uint8Array; tasya: [number, number]} | null = null;
export const wideFrame = (p: number): Buf => {
  if (!wideBg) {
    const buf = new Buf(480, 270, PAL.N0);
    const room = drawBullpen(buf, 0, {variant: 'walkout', masGlass: false, crowd: false});
    wideBg = {buf, win: Uint8Array.from(room.masks.window.a, (v) => (v ? 1 : 0)), tasya: room.anchors.tasyaFloor as [number, number]};
  }
  const b = wideBg.buf.clone();
  rainOn(b, p, wideBg.win);
  drawCrowdAt(b, p, 'all', 0);
  // Tasya stands in the middle of the floor IN FRONT of the bench (his feet on row 197, the bench's feet on 174), so
  // he is drawn over the desk and its box (pass 6: the room's `front` pass re-painted the bench over him, which put
  // the desk box over his chest and his legs through the desk front)
  const [tx, ty] = wideBg.tasya;
  drawTasyaRoom(b, tx, ty, {...TASYA_ROOM_DEFAULT, arm: 'clasp', mouth: 'smile', blink: blinkAt(p, [30, 101]) > 0});
  const v = mouthAt('a5-30-05', p);
  masDesk(b, {head: 'turn', mouth: v === 'rest' || v === 'M' || v === 'smile' ? 'rest' : 'open'});
  railBand(b, null, 0);
  return b;
};

// ================================================================== S7.05: the fires light the room
/**
 * The fires' light on what is around them (pass 6: the chair's fire lit nothing and read as a flat icon). Each fire
 * throws a flickering tungsten pool (its flicker is the fire drawing's own 3-drawing cycle on 2s): the pixels in reach
 * walk toward the lamp colour by one or two lit steps, snapped to the master palette's warm families and ordered-
 * dithered at the pool's edge (the engine's light: palette choices, never a blend). The table's own pools (drawn by
 * the plate) stay; these add the chair back, the glass and the wall above the table. Then a few embers rise from each
 * fire on 2s and cool as they climb.
 */
const WARM_POOL = [PAL.N0, PAL.N1, PAL.N2, PAL.N3, PAL.U0, PAL.U1, PAL.U2, PAL.U3, PAL.U4, PAL.U5, PAL.W0, PAL.W1, PAL.W2, PAL.W3, PAL.W4, PAL.W5, PAL.W6, PAL.D0, PAL.D1, PAL.D2, PAL.D3, PAL.D4, PAL.X0, PAL.X1, PAL.X2, PAL.S1, PAL.S2, PAL.S3, PAL.R0, PAL.R1];
const FIRE_PX = new Set([PAL.W5, PAL.W6, PAL.W7, PAL.W8, PAL.R3]);
const litMemo = new Map<string, number>();
/** the lamp's light on colour c at level 1..3 (small, medium, strong), snapped to the warm families */
const lampLit = (c: number, k: number) => {
  if (k <= 0) return c;
  const key = `${c}:${k}`;
  let v = litMemo.get(key);
  if (v !== undefined) return v;
  const [r, g, b] = toLinear(c);
  const add = [[0.012, 0.004, 0.0008], [0.035, 0.012, 0.002], [0.085, 0.03, 0.005]][k - 1];
  const m = 1 + 0.12 * k;
  v = nearest(fromLinear(Math.min(1, r * m + add[0]), Math.min(1, g * (1 + 0.05 * k) + add[1]), Math.min(1, b * (1 - 0.05 * k) + add[2])), WARM_POOL);
  litMemo.set(key, v);
  return v;
};
/** fire centres and reach (native): the chair's fire lights the chair back it burns on and the wall behind it; the
 *  table's and the plate's light the glass above the table (the table top already carries their pools) */
const FIRE_LIGHT = FIRES_M!.map((fr) => fr.at === 'chair'
  ? {x: fr.x, y: BPLATE.tableY - 60, rx: 38, ry: 34, s: 1, phase: fr.phase ?? 0, yMax: BPLATE.tableY + 4, base: BPLATE.tableY - 50, h: 30}
  : fr.at === 'plate'
    ? {x: fr.x, y: BPLATE.tableY - 2, rx: 24, ry: 20, s: 0.55, phase: fr.phase ?? 0, yMax: BPLATE.tableY, base: BPLATE.tableY + 5, h: 16}
    : {x: fr.x, y: BPLATE.tableY + 6, rx: 36, ry: 30, s: 0.55, phase: fr.phase ?? 0, yMax: BPLATE.tableY, base: BPLATE.tableY + 30, h: 26});
export const fireLight = (b: Buf, f: number) => {
  const src = b.c.slice(0, 480 * RH);
  for (const L of FIRE_LIGHT) {
    const fl = [1, 0.84, 0.94][Math.floor((f + L.phase * 2) / 2) % 3];
    for (let y = Math.max(0, L.y - L.ry); y < Math.min(L.yMax, L.y + L.ry); y++) for (let x = Math.max(0, L.x - L.rx); x < Math.min(480, L.x + L.rx); x++) {
      const i = y * 480 + x, c = src[i];
      if (FIRE_PX.has(c)) continue;
      const d = Math.hypot((x - L.x) / L.rx, (y - L.y) / L.ry);
      if (d >= 1) continue;
      // three light levels, each dithered only against its neighbour (close colours), so the pool reads as light
      // falling off, not as sparks
      const lv = 3 * (1 - d) * (1 - d * 0.5) * L.s * fl;
      const n = Math.floor(lv), fr = lv - n;
      const k = Math.min(3, n + (bayer(x, y) < fr ? 1 : 0));
      if (k > 0) b.c[i] = lampLit(c, k);
    }
  }
  // embers: 1-px sparks lifting off each fire on 2s, cooling as they climb, drifting with the draught
  for (const [n, L] of FIRE_LIGHT.entries()) for (let e = 0; e < 4; e++) {
    const life = 16, seed = n * 13 + e * 5;
    const age = (Math.floor(f / 2) + Math.floor(h01(seed, 3) * life)) % life;
    const x = Math.round(L.x + (h01(seed, 4) - 0.5) * L.h * 0.6 + Math.sin((age + seed) * 0.7) * 1.5 + age * 0.25);
    const y = Math.round(L.base - L.h * (0.55 + h01(seed, 5) * 0.3) - age * 1.6);
    if (y < 1 || y >= RH || x < 0 || x >= 480) continue;
    if (age > 12 && h01(seed + age, 6) < 0.5) continue; // the last ones wink out
    b.set(x, y, age < 4 ? PAL.W8 : age < 8 ? PAL.W7 : age < 12 ? PAL.W6 : PAL.W4);
  }
};
/** S7.05, the exit: Mada among the fires, pixel, and the rail */
export const madaFrame = (p: number): Buf => {
  const b = new Buf(480, 270, PAL.N0);
  drawMadaM(b, p - T.mada, {});
  fireLight(b, p - T.mada);
  railBand(b, 'NOV 21, 2023 · ~10 PM PT', p >= T.railAt ? (p - T.railAt) * 2 : 0);
  return b;
};
/** the band under the MCUs (no rail) */
export const band = (b: Buf) => railBand(b, null, 0);
export {stepColor, MCU_X};
