// MR. MAS - style-range prototype E1-P3 (1.D, BELOW, ABOVE, AROUND): the PIXEL side of the clip, on the shared engine.
// Every pixel here is drawn by the show's own modules, read-only (rooms/bullpen walkout, cast/mas desk sprite,
// cast/tasya-speak portrait + room sprite, cast/swaps-act4 masLookDown, rooms/twoshots drawMadaM), framed with the
// Act Four animatic's MCU helpers (copied into px-kit.ts). What this file adds:
//   - the BOOKKEEPING the medium change needs: which layer of the room owns each native pixel (shell / the bench's
//     back / the back row / the bench's front / Mas's island / the front row) and which shell surface it is;
//   - the crowd's idle life (pass 6): every walkout extra breathes on held drawings (head, shoulders and box drop one
//     native pixel on the out-breath), each on its own period, so the wide is never a frozen plate;
//   - local, palette-true fixes on the shared drawings (pass 6, from the cold review): Tasya's hands and cuffs redrawn so
//     they read as hands, his skin in daylight from the cut in; Mas's desk sprite without the mint (zombie) face; Mas's
//     MCU without the orange edge fringe, his window-side rim cool, breathing, one blink and a brow on "Hello."; the
//     fires in S7.05 lighting what is around them, with embers. Nothing in src/shared is edited.
import {Buf, rect, bayer} from '../../../shared/pixel/px';
import {PAL, stepColor, nearest, toLinear, fromLinear} from '../../../shared/pixel/palette';
import type {Img} from '../../../shared/pixel/figure';
import {drawBullpen, BULLPEN, WALKOUT_CROWD, walkoutExtra, EXTRA_H, CROWD_LOOK_X, packedBox} from '../../../shared/pixel/rooms/bullpen';
import {h01} from '../../../shared/pixel/rooms/kit-b';
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

// ================================================================== the crowd's idle: breathing on held drawings
/**
 * The draw rank of every native room pixel (the room's own order: the room 0, the behind-bench extras 10+k, the desk
 * boxes 60, the credenza box 61, the rest of the crowd 70+k), so a breathing figure only ever moves over what is behind
 * it and never over what is in front of it.
 */
const RANK = (() => {
  const r = new Int16Array(480 * RH);
  CROWD.forEach((e, k) => { if (e.behind) stamp(r, extraImg(e), e.x - 15, e.foot - EXTRA_H + 1, 10 + k, (_x, y) => y < G.bench.back); });
  for (let s = 0; s < 4; s++) { const [bx, by, kind] = deskBoxAt(s); stamp(r, packedBox(kind), bx, by, 60); }
  stamp(r, packedBox(4), G.win.x0 + 30, G.win.y1 + 9 - 25, 61);
  CROWD.forEach((e, k) => { if (!e.behind) stamp(r, extraImg(e), e.x - 15, e.foot - EXTRA_H + 1, 70 + k); });
  return r;
})();
/** each extra's upper body (hair to the box's bottom edge: walkoutExtra rows 0..43 + its height offset) and its breath */
const FIGS = CROWD.map((e, k) => {
  const top = e.foot - EXTRA_H + 1 - 4, dy = Math.floor(h01(e.seed, 29) * 4);
  const per = 2 * (26 + Math.floor(h01(e.seed, 81) * 14)); // 52..78 frames a breath, never in step with a neighbour
  return {k, rank: e.behind ? 10 + k : 70 + k, x0: e.x - 15, x1: e.x + 15, top, waist: e.foot - EXTRA_H + 1 + 44 + dy,
    clipY: e.behind ? G.bench.back : RH, per, ph: Math.floor(h01(e.seed, 82) * per)};
});
/** out-breath: the upper body one native pixel down, held (on 2s, like every held drawing in the room) */
export const exhale = (k: number, p: number) => { const f = FIGS[k]; const q = p - (p % 2); return (q + f.ph) % f.per >= f.per / 2; };
/**
 * Every extra on its out-breath drops its upper body (head, shoulders, arms and box) one native pixel onto its own
 * coat: pixels move only onto what the figure already covers or what lies behind it; the row it uncovers shows what
 * is behind it (`bg`, the crowd-free room). `protect` pixels are never written (Mas's island).
 */
export const breathe = (b: Buf, bg: Buf, p: number, protect?: Uint8Array) => {
  const src = b.c.slice(0, 480 * RH);
  for (const f of FIGS) {
    if (!exhale(f.k, p)) continue;
    for (let y = Math.min(f.waist, f.clipY - 1); y >= Math.max(0, f.top); y--) for (let x = Math.max(0, f.x0); x <= Math.min(479, f.x1); x++) {
      const i = y * 480 + x;
      if (protect && protect[i]) continue;
      const up = y - 1 >= Math.max(0, f.top) ? RANK[i - 480] : -1;
      if (up === f.rank && RANK[i] <= f.rank) b.c[i] = src[i - 480];
      else if (RANK[i] === f.rank) b.c[i] = bg.c[i];
    }
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
export interface Plate { buf: Buf; own: Uint8Array; reg: Uint8Array }
export const REG = {none: 0, floor: 1, ceiling: 2, walls: 3} as const;
const cache = new Map<string, Plate>();
/**
 * The bullpen walkout as the MCU sees it (Tasya's bust is drawn later): the room plate, Mas at his end desk, the
 * crowd (or not), soft `k`. `own` is the layer of every pixel, `reg` the shell surface of every shell pixel.
 */
export const plate = (crowd: boolean, k = TASYA_SOFT): Plate => {
  const key = `${crowd}:${k}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const buf = new Buf(480, 270, PAL.N0);
  const room = drawBullpen(buf, 0, {variant: 'walkout', crowd, masGlass: false});
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
  if (crowd) for (const e of CROWD.filter((q) => q.behind)) stamp(own, extraImg(e), e.x - 15, e.foot - EXTRA_H + 1, OWN.back, (_x, y) => y < G.bench.back);
  for (let s = 0; s < 4; s++) { const [bx, by, kind] = deskBoxAt(s); stamp(own, packedBox(kind), bx, by, s === 3 ? OWN.island : OWN.benchFront); }
  stamp(own, packedBox(4), G.win.x0 + 30, G.win.y1 + 9 - 25, OWN.back);
  if (crowd) for (const e of CROWD.filter((q) => !q.behind)) stamp(own, extraImg(e), e.x - 15, e.foot - EXTRA_H + 1, e.layer);
  for (let i = 0; i < 480 * RH; i++) if (own[i] !== OWN.shell) reg[i] = REG.none;
  // Mas is the subject in the depth: the rack is held on him, so his island (him, his chair, his end desk, its box) keeps
  // its full value while the room around him sits k soft rungs back (pass 6: one rung back, his island printed as a
  // murky dark block against the landlord's pale room)
  const sharp = buf.c.slice(0, 480 * RH);
  soft(buf, k);
  for (let i = 0; i < 480 * RH; i++) if (own[i] === OWN.island) buf.c[i] = sharp[i];
  masDesk(buf, {}, own, 0);
  const out = {buf, own, reg};
  cache.set(key, out);
  return out;
};
let islandMask: Uint8Array | null = null;
/** Tasya's MCU plate at clip frame p: the crowd breathing (the island never moves) */
export const plateAt = (p: number): Buf => {
  const a = plate(true), bg = plate(false);
  if (!islandMask) { islandMask = new Uint8Array(480 * RH); for (let i = 0; i < 480 * RH; i++) islandMask[i] = a.own[i] === OWN.island ? 1 : 0; }
  const b = a.buf.clone();
  breathe(b, bg.buf, p, islandMask);
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
export const tasyaState = (p: number): TasyaPortraitState => ({
  mouth: mouthAt('a5-30-06', p) === 'rest' && p >= 310 ? 'smile' : mouthAt('a5-30-06', p) === 'rest' && p < 126 ? 'smile' : mouthAt('a5-30-06', p),
  lid: blinkAt(p, [141, 214, 318]), brow: 'warm', arms: 'clasp', jangle: 0,
});
/**
 * His hands (pass 6). The portrait's clasp stamp (22 x 10, a checker of two cool rungs inside one oval, with no wrists)
 * read as a bread roll or a bow tie at every size. Redrawn in the same place: two hands with their fingers laced (one
 * knuckle bump per finger along the top, the seam between the hands), the two thumbs resting on top, the heels of the
 * hands underneath, lit from camera-left like his face; the shirt cuffs brought up a rung so each wrist reads going into
 * its sleeve. Warm skin rungs (his daylight skin, below).
 */
const HANDS = {x: 44, y: 110, rows: [
  '...........oooo...........',
  '..........ohLlmo..........',
  '.....oooo.oLLlmo.oooo.....',
  '....ohLLlooLlmmoolllmo....',
  '...ohLLlLdLlLlmdlmlmmmo...',
  '..oohLLdLLdLldmmdlmdmmoo..',
  '..oLhLLdLLdLllmmdmmdmmdo..',
  '..oLLLLdLLdlllmmdmmdmmdo..',
  '..olLLldLldllmmmdmmdmddo..',
  '...olllllllmmmmmmmmmddo...',
  '....ooolllmmmmmmmmdooo....',
  '.......oooooooooooo.......',
], pal: {o: PAL.S1, h: PAL.S6, L: PAL.S5, l: PAL.S4, m: PAL.S3, d: PAL.S2} as Record<string, number>};
/** the cuffs (the portrait's shirt-mat polys around the wrists, G4 on G3/G4 shirt): lifted to read as white cuffs */
const CUFFS: Array<[number, number, number]> = [];
{
  const inPoly = (pts: number[], x: number, y: number) => { let c = false; for (let i = 0, j = pts.length - 2; i < pts.length; j = i, i += 2) { const xi = pts[i], yi = pts[i + 1], xj = pts[j], yj = pts[j + 1]; if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c; } return c; };
  const L = [46, 120, 52, 118, 56, 124, 51, 128], R = [68, 118, 74, 120, 71, 128, 65, 124];
  for (let y = 116; y < 130; y++) for (let x = 40; x < 80; x++) {
    if (inPoly(L, x + 0.5, y + 0.5)) CUFFS.push([x, y, PAL.G5]);
    else if (inPoly(R, x + 0.5, y + 0.5)) CUFFS.push([x, y, PAL.G4]);
  }
}
/** Tasya's skin in the bullpen's daylight (the whole shot): skin-under-cyan walks to the warm skin ramp */
const TASYA_SKIN = new Map<number, number>([[PAL.K0, PAL.S1], [PAL.K1, PAL.S2], [PAL.K2, PAL.S4], [PAL.K3, PAL.S5], [PAL.K4, PAL.S6], [PAL.K5, PAL.P2]]);
const tasyaImgs = new Map<string, Img>();
const tasyaImg = (s: TasyaPortraitState): Img => {
  const key = JSON.stringify(s);
  let im = tasyaImgs.get(key);
  if (im) return im;
  const src = tasyaSpeakPortrait(s);
  im = {w: src.w, h: src.h, c: src.c.slice()};
  for (const [x, y, c] of CUFFS) if (im.c[y * im.w + x] >= 0) im.c[y * im.w + x] = c;
  HANDS.rows.forEach((row, j) => [...row].forEach((ch, i) => { if (ch !== '.') im!.c[(HANDS.y + j) * im!.w + HANDS.x + i] = HANDS.pal[ch]; }));
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
  drawBust(b, tasyaImg(tasyaState(p)), 'L', TASYA_DX, 22, undefined, lit ? BUST_CAP.tasyaLit : 5, 1 / 6);
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
  drawBust(b, masImg(brow, blink), 'R', MAS_MCU_DX, down ? 23 : 22, undefined, BUST_CAP.mas, 1 / 6);
  return b;
};

/** S7.02, the wide (all pixel): Mas asks, Tasya mid-floor, delighted; the crowd in coats with boxes in arms, breathing */
let wideBg: Buf | null = null;
export const wideFrame = (p: number): Buf => {
  const b = new Buf(480, 270, PAL.N0);
  const room = drawBullpen(b, 0, {variant: 'walkout', masGlass: false});
  if (!wideBg) { wideBg = new Buf(480, 270, PAL.N0); drawBullpen(wideBg, 0, {variant: 'walkout', masGlass: false, crowd: false}); }
  breathe(b, wideBg, p);
  // Tasya stands in the middle of the floor IN FRONT of the bench (his feet on row 197, the bench's feet on 174), so
  // he is drawn over the desk and its box (pass 6: the room's `front` pass re-painted the bench over him, which put
  // the desk box over his chest and his legs through the desk front)
  const [tx, ty] = room.anchors.tasyaFloor;
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
