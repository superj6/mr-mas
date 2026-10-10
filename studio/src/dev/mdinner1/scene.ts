// MR. MAS — mdinner1: the per-frame scene (pure; runs in Remotion via <PixelScene> and in the Node preview).
// Draw order: wall -> cathedral -> vault -> pendants -> diners' BACK layers -> table -> diners' FRONT layers ->
// props on the cloth -> keycaps -> Mas's hand-held things -> god-rays -> the foreground flame wipe.
// Every pixel remembers who painted it (OwnedBuf), so "freeze everything except Mas" is exact, including the
// table cloth that covers his lap.
import {Buf, W, H, TRANSPARENT, bayer, clamp, rect, poly} from '../../shared/pixel/px';
import {PAL, lum, stepColor} from '../../shared/pixel/palette';
import {Mask} from '../../shared/pixel/mask';
import {PALETTES} from '../../shared/pixel/palettes';
import {blitImg} from '../../shared/pixel/figure';
import {blinkAt, holds} from '../../shared/pixel/sprite';
import type {PixelSceneProps, SwitchSpec} from '../../shared/pixel/compose';
import {gergBack, gergFront, gergKeycaps, drawKeycaps, gergTypeAt, GERG_TABLE_EDGE, GergPose} from '../../shared/pixel/cast/gerg';
import {alyiTableBack, alyiTableFront, alyiChairLift, alyiLift, ALYI_TABLE_EDGE, ALYI_LEV_SEAT, ALYI_CHAIR_EYES, AlyiLevPose} from '../../shared/pixel/cast/alyi';
import {marioImg, MARIO_BASE, MARIO_FOOT, MarioPose, drawVault, drawDraft, VaultState} from '../../shared/pixel/cast/mario';
import {camera, toGlobal, worldClock, FREEZE_G, FREEZE_A, CAM, MD1, anchoredX} from './timeline';
import {wallLayer, tableLayer, resolveWindow, setLights, drawPendant, drawCandle, drawCandelabra, drawGlass, drawPlace, drawBasket, drawFarChair, drawNearChair, flameGlow, PENDANTS, CANDLES, TABLE, SEAT} from './set';
import {masDinnerBack, masDinnerFront, MasDinnerPose, MasArm, MASD_TABLE_EDGE, MASD_HAND, MASD_CX} from './masdinner';
import {cathAt, cathLight, drawCathedral, drawCathRays, alyiRim, roseMask} from './cathedral';
import {drawCtrlKey, ctrlFlight, drawNapkin, drawEffigy, drawEffigySign, drawEffigyFire, drawForkStick, drawWipeFlame, drawWaterLine, WIPE_X, EFFIGY, KEY_HAND} from './props';
import {drawGergCard, drawAlyiCard, GERG_CARD, ALYI_CARD} from './cards';
import {FOUNDERS, PAPER, freezePrint, freezeSolid, freezePop} from '../../shared/pixel/freeze';
import {eraStamp} from '../../shared/pixel/cast/era';
import {SIGN_RECT} from './set';

/** A frame buffer that remembers who painted each pixel (so "freeze everything except Mas" is exact). */
export class OwnedBuf extends Buf {
  own: Uint8Array; cur = 0;
  constructor(w = W, h = H, fill = 0) { super(w, h, fill); this.own = new Uint8Array(w * h); }
  set(x: number, y: number, col: number) {
    x |= 0; y |= 0;
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
    const i = y * this.w + x;
    this.c[i] = col; this.own[i] = this.cur;
  }
}
/** world = the room (prints paper / dot / ink); fig + text = other figures and lettering (print as a hard threshold);
 *  star = the featured founder (hard threshold, brighter curve); mas + live = never printed */
export const OWN = {world: 0, mas: 1, star: 2, live: 3, fig: 4, text: 5, cloth: 6} as const;

// ------------------------------------------------------------------ positions (world)
const MAS_X = SEAT.mas - MASD_CX, MAS_Y = TABLE.top - MASD_TABLE_EDGE;
const GERG_X = SEAT.gerg, GERG_Y = TABLE.top - GERG_TABLE_EDGE;
const ALYI_X = SEAT.alyi, ALYI_Y = TABLE.top - ALYI_TABLE_EDGE;
const VAULT = {cx: SEAT.vault, cy: 156};
export const IGNITE = 290; // the effigy ignites on 5.4 + 5 (SCRIPT §3.5b f290; the whoomph sits under the whisper, off "...the...")

// ------------------------------------------------------------------ MAS (never freezes): the acting, on the grid
interface MasBeat { pose: MasDinnerPose; key: 'none' | 'hand'; fork: {len: number; toast: number} | null; }
export const masAt = (g: number): MasBeat => {
  const blink = Math.max(blinkAt(g, 231), blinkAt(g, 264), blinkAt(g, 296), blinkAt(g, 317), blinkAt(g, 351)) as 0 | 1 | 2;
  const breathe = (Math.floor(g / 20) % 2) as 0 | 1;
  let arm: MasArm = 'steeple', look: -1 | 0 | 1 = 0, mouth: MasDinnerPose['mouth'] = 'rest';
  let key: MasBeat['key'] = 'none';
  let fork: MasBeat['fork'] = null;
  if (g < 234) look = 0;
  else if (g < 240) look = -1; // the napkin just became a website
  else if (g < 244) look = 0; // the world froze: he looks at us
  else if (g < 246) look = -1; // ...then at the key hanging in the air
  else if (g < 259) {
    // one beat of frozen world: he plucks the key, looks at it, looks at us, and pockets it as the room resumes (255)
    [arm, look] = holds<[MasArm, -1 | 0 | 1]>(g - 246, [[['reach1', -1], 2], [['reach2', -1], 2], [['hold', -1], 3], [['hold', 0], 1], [['pocket', 0], 3], [['rest', 0], 2]]);
    if (g >= 248 && g < 254) key = 'hand';
  } else if (g < 262) mouth = 'smile'; // the tiniest smile: one pixel (Gerg is typing again, one key short)
  else if (g < 268) look = 0;
  else if (g < 276) look = -1; // a glance at Gerg, who has not noticed
  else if (g < 285) look = 0;
  else if (g < 300) look = 1; // Alyi rises
  else if (g < 319) look = 0;
  else if (g < 324) look = 1; // the frozen fire
  else if (g < 340) {
    // the telescoping fork comes out (3 held lengths), the marshmallow goes to the frozen flame's edge,
    // toasts in 3 palette steps while the fire does nothing, comes back, and he eats it
    const seq: Array<[[MasArm, number, number, MasDinnerPose['mouth'], -1 | 0 | 1], number]> = [
      [['fork', 6, 0, 'rest', 1], 2], [['fork', 16, 0, 'rest', 1], 1], [['roast', 22, 0, 'rest', 1], 1],
      [['roast', 30, 0, 'rest', 1], 4], [['roast', 30, 1, 'rest', 1], 2], [['roast', 30, 2, 'rest', 1], 1], [['roast', 30, 3, 'rest', 0], 1],
      [['fork', 12, 3, 'rest', 0], 1], [['bite', 0, 3, 'open', 0], 2], [['bite', 0, 3, 'chew', 0], 1],
    ];
    const [a, len, toast, m, lk] = holds(g - 324, seq);
    arm = a; look = lk; mouth = m; fork = a === 'bite' && m === 'chew' ? null : {len, toast};
  } else if (g < 344) { mouth = holds(g - 340, [['chew', 1], ['rest', 1]], true); }
  else look = 1; // the vault
  // a head-hold reads as life, not as a loop: breathe only in the steeple
  return {pose: {arm, lid: blink, look, mouth, breathe: arm === 'steeple' ? breathe : 0}, key, fork};
};

// ------------------------------------------------------------------ ALYI
const liftAt = (g: number) => {
  if (g < 287) return 0;
  if (g < 300) return [2, 2, 5, 5, 9, 9, 13, 13, 17, 17, 20, 20, 22][g - 287];
  if (g < FREEZE_A.t1) return 22;
  return 20 + alyiLift(worldClock(g), 40);
};

// ------------------------------------------------------------------ MARIO + the vault (345-359)
const vaultAt = (g: number): VaultState => ({open: g < 345 ? 0 : g < 347 ? 1 : g < 349 ? 2 : 3, f: worldClock(g), ticks: g < 348 ? 0 : g < 351 ? 1 : g < 354 ? 2 : 3}); // ticks on mdinner2's T.tick1-3 (348/351/354)
const marioAt = (g: number): {pose: MarioPose; foot: [number, number]; inside: boolean} | null => {
  if (g < 347) return null;
  const P = (o: Partial<MarioPose>): MarioPose => ({...MARIO_BASE, ...o});
  if (g < 350) return {pose: P({light: 'sil'}), foot: [VAULT.cx - 6, 218], inside: true};
  if (g < 352) return {pose: P({light: 'sil', legs: 'step0'}), foot: [VAULT.cx - 2, 222], inside: false}; // out on 350 (mdinner2 T.marioOut)
  if (g < 354) return {pose: P({light: 'fade', legs: 'step1'}), foot: [VAULT.cx + 2, 222], inside: false};
  if (g < 357) return {pose: P({arm: 'chest', mouth: 1}), foot: [VAULT.cx + 4, 222], inside: false};
  if (g < 359) return {pose: P({arm: 'raise', mouth: 1, brow: 1}), foot: [VAULT.cx + 4, 222], inside: false}; // finger on 357
  return {pose: P({arm: 'raise2', mouth: 2, brow: 1}), foot: [VAULT.cx + 4, 222], inside: false};
};

// ------------------------------------------------------------------ the frame
export interface FrameInfo { cam: ReturnType<typeof camera>; g: number; w: number; }

/** `legend`: the pocketed keycap's legend (the couch gag, SCRIPT §8 item 4); Ep1's CTRL when omitted */
export const drawFrame = (b: OwnedBuf, g: number, legend?: string[]): FrameInfo => {
  const cam = camera(g);
  const w = worldClock(g);
  const ox = cam.x, oy = cam.y;
  const fireAge = g >= IGNITE ? worldClock(g) - worldClock(IGNITE) : -1;
  const cathG = g < FREEZE_A.t0 ? g : g < FREEZE_A.t1 ? FREEZE_A.t0 : g;
  const L = setLights({w, cath: cathLight(cathG), fire: fireAge < 0 ? 0 : fireAge === 0 ? 0.4 : fireAge === 1 ? 1.15 : 1});
  b.cur = OWN.world;

  // ---- the wall, the cathedral in Alyi's bay, the vault
  resolveWindow(wallLayer(), L, b, ox, oy);
  drawCathedral(b, ox, oy, cathAt(cathG, w));
  if (VAULT.cx - ox > -60 && VAULT.cx - ox < W + 60) drawVault(b, VAULT.cx - ox, VAULT.cy - oy, vaultAt(g));
  for (const px of PENDANTS) drawPendant(b, px - ox, 92 - oy);
  drawCandelabra(b, 84 - ox, 158 - oy, w);
  flameGlow(b, 84 - ox, 132 - oy, 12, ox, oy);

  // ---- BACK layers: Gerg (faces Mas: flipped), Mas, Alyi (at the table, then floating), Mario, the empty chairs
  const gp: GergPose = {type: gergTypeAt(w), lid: 0, look: 0, mouth: 'rest', flick: (Math.floor(w / 3) % 2) as 0 | 1};
  const star = g < FREEZE_G.card ? 'gerg' : 'alyi';
  // his dining chair (the sprite's own chair is only a rim line at this light): a bentwood back behind him
  drawFarChair(b, GERG_X + 13 - ox, GERG_Y + 12 - oy);
  b.cur = star === 'gerg' ? OWN.star : OWN.fig;
  blitImg(b, gergBack(gp), GERG_X - ox, GERG_Y - oy, {flip: true, map: (c) => (c === PAL.W4 ? PAL.D3 : c)});
  b.cur = OWN.world;
  const mas = masAt(g);
  b.cur = OWN.mas;
  blitImg(b, masDinnerBack(mas.pose), MAS_X - ox, MAS_Y - oy);
  b.cur = OWN.world;
  const lift = liftAt(g);
  const alyiLev = g >= 287;
  b.cur = star === 'alyi' ? OWN.star : OWN.fig;
  if (!alyiLev) blitImg(b, alyiTableBack({lid: 2, mouth: 'rest', light: g >= 285 ? 'agi' : 'dinner'}), ALYI_X - ox, ALYI_Y - oy);
  else {
    // he rises STILL SEATED: his dinner chair lifts with him, napkin in lap (SCRIPT §3.5b), never cross-legged
    const lp: AlyiLevPose = {lid: g >= 298 ? 0 : 2, mouth: g >= 297 && g < 342 ? 'open' : 'rest', hands: 'knees'};
    const seatY = TABLE.top + 6;
    b.cur = OWN.star;
    const ay = seatY - ALYI_LEV_SEAT - lift - oy;
    blitImg(b, alyiChairLift(lp), ALYI_X - ox, ay);
    // his eye glints never print (in the freeze the deep sockets alone would read as a black bar: sunglasses)
    if (lp.lid === 0) { b.cur = OWN.live; for (const [ex, ey] of ALYI_CHAIR_EYES) b.set(ALYI_X - ox + ex, ay + ey, PAL.K3); }
  }
  b.cur = OWN.world;
  // the empty seats (MARIO joins in 2016; NOLE arrives through the ceiling)
  drawFarChair(b, 812 - ox, 176 - oy);
  drawFarChair(b, 962 - ox, 176 - oy);
  const mario = marioAt(g);
  if (mario) {
    const img = marioImg(mario.pose);
    const mx = mario.foot[0] - MARIO_FOOT[0] - ox, my = mario.foot[1] - MARIO_FOOT[1] - oy;
    const vx = VAULT.cx - ox, vy = VAULT.cy - oy;
    blitImg(b, img, mx, my, mario.inside ? {clip: (x, y) => (x + 0.5 - vx) ** 2 + (y + 0.5 - vy) ** 2 < 29 * 29} : {});
  }
  if (g >= 348 && g < 360) { const t = g - 348; drawDraft(b, VAULT.cx + 10 + t * 3 - ox, Math.round(VAULT.cy - 10 - t * 2 + t * t * 0.18) - oy, Math.floor(g / 2)); }

  // ---- the TABLE (the linen prints as one clean paper field with ink folds: a hard threshold, no dot band)
  b.cur = OWN.cloth;
  resolveWindow(tableLayer(), L, b, ox, oy);
  b.cur = OWN.world;

  // ---- FRONT layers
  b.cur = star === 'gerg' ? OWN.star : OWN.fig;
  blitImg(b, gergFront(gp), GERG_X - ox, GERG_Y - oy, {flip: true});
  b.cur = OWN.mas;
  blitImg(b, masDinnerFront(mas.pose), MAS_X - ox, MAS_Y - oy);
  b.cur = star === 'alyi' ? OWN.star : OWN.fig;
  if (!alyiLev) blitImg(b, alyiTableFront({lid: 2, mouth: 'rest', light: g >= 285 ? 'agi' : 'dinner'}), ALYI_X - ox, ALYI_Y - oy);

  // ---- on the cloth
  const T = TABLE.top - oy;
  drawPlace(b, SEAT.mas - ox, T + 3);
  drawPlace(b, SEAT.alyi + 24 - ox, T + 3);
  drawPlace(b, 800 - ox, T + 3);
  drawGlass(b, 446 - ox, T + 5, true, w % 24 < 2 ? 1 : 0);
  drawGlass(b, 548 - ox, T + 5, false); // Mas's water: it never ripples (the Nole beat pays it off)
  drawWaterLine(b, 548 - ox, T + 5);
  drawGlass(b, 662 - ox, T + 5, true);
  drawGlass(b, 736 - ox, T + 5, true);
  drawGlass(b, 872 - ox, T + 5, true);
  drawBasket(b, 820 - ox, T + 5);
  b.cur = OWN.text;
  drawNapkin(b, 352 - ox, T - 7, w >= 232);
  b.cur = OWN.world;
  for (const cx of CANDLES) {
    drawCandle(b, cx - ox, T + 4, w + cx);
    flameGlow(b, cx - ox, T - 10, 8, ox, oy);
  }
  // the effigy (on the table from the start: a centrepiece nobody mentions) and its fire
  const effArms: 0 | 1 | 2 = g < 289 ? 0 : g < 291 ? 1 : 2; // it raises its own sign as the cathedral wakes
  b.cur = OWN.fig;
  drawEffigy(b, ox, oy, fireAge >= 1 ? 1 : 0, effArms);
  b.cur = OWN.world;
  drawEffigyFire(b, ox, oy, fireAge, w);
  b.cur = OWN.text;
  drawEffigySign(b, ox, oy, effArms);
  b.cur = OWN.world;
  if (fireAge >= 0) flameGlow(b, EFFIGY.x - ox, EFFIGY.base - 16 - oy, 22, ox, oy);

  // ---- keycaps: popcorn (Gerg types on 1s), resting caps pile on the cloth
  b.cur = star === 'gerg' ? OWN.star : OWN.fig;
  drawKeycaps(b, GERG_X - ox, GERG_Y - oy, gergKeycaps(w, {from: 214, rate: 2, max: 48}), true);
  b.cur = OWN.world;
  // the CTRL key: pops at w226, hangs at its apex in the frozen world, then Mas takes it (248)
  if (g < 248) {
    const k = ctrlFlight(w);
    if (k) { b.cur = g >= FREEZE_G.t0 ? OWN.mas : OWN.world; drawCtrlKey(b, k.x - ox, k.y - oy, k.d, legend); b.cur = OWN.world; }
  } else if (mas.key === 'hand') {
    const [hx, hy] = MASD_HAND[mas.pose.arm];
    b.cur = OWN.mas;
    drawCtrlKey(b, MAS_X + hx - KEY_HAND[0] - ox, MAS_Y + hy - KEY_HAND[1] - oy, mas.pose.arm === 'hold' ? 0 : 1, legend);
    b.cur = OWN.world;
  }
  // Mas's telescoping marshmallow fork
  if (mas.fork) {
    const [hx, hy] = MASD_HAND[mas.pose.arm];
    b.cur = OWN.mas;
    if (mas.pose.arm === 'bite') drawForkStick(b, ox, oy, MAS_X + hx - 2, MAS_Y + hy, 0, mas.fork.toast);
    else drawForkStick(b, ox, oy, MAS_X + hx, MAS_Y + hy, mas.fork.len, mas.fork.toast, mas.pose.arm === 'roast' ? [0.992, 0.124] : [1, 0]);
    b.cur = OWN.world;
  }
  // god-rays fall over everything in the bay's air — except the levitating Alyi, who is lit in flat planes (no
  // dither on a figure): the rays skip his pixels and give him a cyan rim from the rose window instead
  const alyiPx = (X: number, Y: number) => alyiLev && X >= 0 && Y >= 0 && X < W && Y < H && b.own[Y * W + X] === (star === 'alyi' ? OWN.star : OWN.fig);
  drawCathRays(b, ox, oy, cathAt(cathG, w), alyiPx);
  if (alyiLev) { b.cur = star === 'alyi' ? OWN.star : OWN.fig; alyiRim(b, alyiPx, cathAt(cathG, w).rays); b.cur = OWN.world; }

  // ---- the near side: empty chairs almost on the lens, trucked at 1.35x (depth), never over the table top
  b.cur = OWN.fig;
  for (const nx of [262, 468, 700, 940, 1180]) drawNearChair(b, Math.round(nx - ox * 1.35 + 60), TABLE.front + 14 - oy);
  b.cur = OWN.world;

  // (the 340-344 lens-side candle wipe is cut: 345 is a hard cut to the vault)
  return {cam, g, w};
};

// ------------------------------------------------------------------ the freeze print (shared card system)
// LEGACY navy/cream sets: mdinner1 no longer uses them. They stay exported, unchanged, because mdinner2 imports
// DINNER_FREEZE / DINNER_POP if an older build still reads them (the print is now src/shared/pixel/freeze.ts).
export let DINNER_FREEZE = PALETTES['2TONE_FREEZE'].with({tone: {lo: 0.26, hi: 0.7, gamma: 1.1}});
export let DINNER_STAR = PALETTES['2TONE_FREEZE'].with({tone: {lo: 0.04, hi: 0.3, gamma: 0.7}});
export const _tuneFreeze = (tone: {lo: number; hi: number; gamma: number}, star?: {lo: number; hi: number; gamma: number}) => {
  DINNER_FREEZE = PALETTES['2TONE_FREEZE'].with({tone});
  if (star) DINNER_STAR = PALETTES['2TONE_FREEZE'].with({tone: star});
};
export const DINNER_POP = PALETTES['2TONE_FREEZE'].with({tone: {lo: 0.12, hi: 0.5, gamma: 0.85}});

/** the world is printed only on these frames (one beat per hit); the cards hold on over the live room */
export const printAt = (g: number): 'gerg' | 'alyi' | null =>
  g >= FREEZE_G.t0 && g < FREEZE_G.t1 ? 'gerg' : g >= FREEZE_A.t0 && g < FREEZE_A.t1 ? 'alyi' : null;

interface Owners { g: number; own: Uint8Array; info: FrameInfo }
let LAST: Owners | null = null;

const whipSmear = (fb: Buf, dx: number, wx: number) => {
  // a hand-made pixel smear (no blur): only the highlights (flames, glints, the lit cloth) streak back along the
  // move, in whole pixels, one rung dimmer per 6 px; everything else holds its shape so the frame stays legible.
  const run = clamp(Math.round(Math.abs(dx) * 0.45), 0, 26);
  if (run < 2) return;
  const src = fb.c.slice();
  for (let y = 0; y < fb.h; y++)
    for (let x = 0; x < fb.w; x++) {
      const c = src[y * fb.w + x];
      if (lum(c) < 0.62) continue;
      const n = run - ((bayer(x + wx, y) * 5) | 0);
      for (let k = 1; k <= n; k++) {
        const xx = x + k;
        if (xx >= fb.w) break;
        const cur = fb.c[y * fb.w + xx];
        const col = stepColor(c, -Math.floor(k / 6));
        if (lum(col) > lum(cur)) fb.c[y * fb.w + xx] = col;
      }
    }
};

/**
 * The print: paper / one 50% dot / ink for the room; figures, faces and lettering on a hard threshold; the
 * featured founder on his own brighter threshold; Mas untouched. On the first 2 frames of the hit the whole
 * print flashes toward paper (the flash-print), then settles.
 */
/**
 * Tone curves for THE WOODROSE's front room (warm; most of the frame at OKLab L 0.12-0.40), on the engine's freeze
 * sets (src/shared/pixel/freeze.ts — one print system for all four founders). `room`: paper / the one 50% screen /
 * ink. `figure`: other diners, the effigy, the chairs: a hard threshold. `star`: the featured founder, a hard
 * threshold on a brighter curve (he reads first). `linen`: the tablecloth, a low hard threshold (one clean paper
 * field with ink pleats — the bottom third is a printed tablecloth, never a dead band). `type`: lettering (the
 * brass sign, UNALIGNED): a mid threshold so light-on-dark and dark-on-light both survive. `pop`: the flash-print.
 */
export const PRINT_TONES = {
  room: {lo: 0.13, hi: 0.29, gamma: 1},
  figure: {lo: 0.1, hi: 0.3, gamma: 1},
  star: {lo: 0.1, hi: 0.46, gamma: 1},
  linen: {lo: 0.07, hi: 0.27, gamma: 1},
  type: {lo: 0.3, hi: 0.6, gamma: 1},
  pop: {lo: 0.03, hi: 0.2, gamma: 1},
};
let TONE_OVERRIDE: Partial<typeof PRINT_TONES> = {};
/** dev hook (tuning grids only) */
export const _tunePrint = (t: Partial<typeof PRINT_TONES>) => { TONE_OVERRIDE = t; };
const printFrame = (fb: Buf, own: Uint8Array, who: 'gerg' | 'alyi', g: number) => {
  const T = {...PRINT_TONES, ...TONE_OVERRIDE};
  const sets = {
    room: freezePrint(who, T.room), figure: freezeSolid(who, T.figure), star: freezeSolid(who, T.star),
    linen: freezeSolid(who, T.linen), type: freezeSolid(who, T.type), pop: freezePop(who, T.pop),
  };
  const t0 = who === 'gerg' ? FREEZE_G.t0 : FREEZE_A.t0;
  const pop = g - t0 < 2;
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const i = y * W + x;
      const o = own[i];
      if (o === OWN.mas || o === OWN.live) continue;
      const set = pop ? sets.pop : o === OWN.star ? sets.star : o === OWN.cloth ? sets.linen : o === OWN.text ? sets.type : o === OWN.fig ? sets.figure : sets.room;
      fb.c[i] = set.map(fb.c[i], x, y);
    }
  if (pop) return;
  // the featured founder is cut out of the halftone: a 2px paper knock-out around him (so he reads first)
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      if (own[y * W + x] !== OWN.world) continue;
      let near = false;
      for (let dy = -2; dy <= 2 && !near; dy++) for (let dx = -2; dx <= 2 && !near; dx++) {
        const xx = x + dx, yy = y + dy;
        if (xx >= 0 && yy >= 0 && xx < W && yy < H && own[yy * W + xx] === OWN.star && Math.abs(dx) + Math.abs(dy) <= 3) near = true;
      }
      if (near) fb.c[y * W + x] = PAPER;
    }
  // the stencil contour: every printed figure keeps a 1px ink outline (so a paper-lit face never dissolves into a
  // paper-lit wall), and the linen keeps its top edge and hem as ink rules
  const ink = FOUNDERS[who].ink;
  const at = (x: number, y: number) => (x < 0 || y < 0 || x >= W || y >= H ? -1 : own[y * W + x]);
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const o = own[y * W + x];
      if (o === OWN.star || o === OWN.fig) {
        if (at(x - 1, y) !== o || at(x + 1, y) !== o || at(x, y - 1) !== o || at(x, y + 1) !== o) fb.c[y * W + x] = ink;
      } else if (o === OWN.cloth && (at(x, y - 1) !== o || at(x, y + 1) !== o)) fb.c[y * W + x] = ink;
    }
};

/** the span for an episode's keycap legend (the couch gag); Ep1's is SCENE */
export const makeScene = (legend?: string[]): PixelSceneProps => ({
  bg: PAL.N0,
  draw: (fb, f) => {
    const g = toGlobal(f);
    const b = new OwnedBuf(W, H, PAL.N0);
    const info = drawFrame(b, g, legend);
    void whipSmear; // (no whip after the 225 match cut: the camera holds the flame 225-229, hard cut at 230)
    // THE WOODROSE sign is lettering: it prints on the hard threshold, never as dot noise
    const [sx, sy, sw, sh] = SIGN_RECT;
    for (let y = Math.max(0, sy - info.cam.y); y < Math.min(H, sy + sh - info.cam.y); y++)
      for (let x = Math.max(0, sx - info.cam.x); x < Math.min(W, sx + sw - info.cam.x); x++) if (b.own[y * W + x] === OWN.world) b.own[y * W + x] = OWN.text;
    fb.c.set(b.c);
    LAST = {g, own: b.own, info};
    // 2014 -> 2015 is a hard switch on the cut (f225): meras ends its whip in the early-web palette on f224, and this
    // span is in the show's full palette from its first frame — the whip streak carries the change, no second front
    const who = printAt(g);
    if (who) printFrame(fb, b.own, who, g);
  },
  switch: (f): SwitchSpec[] | null => {
    const g = toGlobal(f);
    // (the 292-293 GLYPH boot of the rose window is cut: outside the 15-frame GLYPH budget, SCRIPT §7)
    void g; void roseMask;
    return null;
  },
  after: (ui, f) => {
    const g = toGlobal(f);
    // era stamp (the shared slate: same face, size and corner as 1993 and 2014)
    // SCRIPT §3.4: ON SCREEN "2015" f230-247 (the freeze does not touch UI, so it holds over the Gerg print)
    if (g >= 230 && g < 248) eraStamp(ui, '2015', g - 230);
    // GERG card: lands on the hit, holds over the live room, and the 285 truck carries it off as a near plane
    if (g >= FREEZE_G.t0 && g < 300) {
      const k = g - FREEZE_G.t0;
      const EXIT = [0, -14, -44, -96, -170, -266];
      const x = GERG_CARD.x + (g < FREEZE_G.card ? 0 : EXIT[Math.min(EXIT.length - 1, g - FREEZE_G.card)] - 40 * Math.max(0, g - FREEZE_G.card - 5));
      if (x > -330) drawGergCard(ui, k, x, GERG_CARD.y, g);
    }
    // ALYI card: the lancet drops in on the hit; eyes closed, then (6.2) token streams; it closes in 2 steps at the
    // thaw (340-341): back up the way it came, the plate first
    if (g >= FREEZE_A.t0 && g < FREEZE_A.card + 2) {
      const k = g - FREEZE_A.t0;
      const eyes = g < 315 ? 'closed' : 'tokens';
      if (g < FREEZE_A.card) drawAlyiCard(ui, k, ALYI_CARD.x, ALYI_CARD.y, eyes, g);
      else drawAlyiCard(ui, k, ALYI_CARD.x, ALYI_CARD.y, eyes, g, g - FREEZE_A.card + 1);
    }
    void TRANSPARENT; void WIPE_X;
    void anchoredX;
  },
});
export const SCENE: PixelSceneProps = makeScene();

/** Dev: a region of the world at world clock g (no camera, no cast). */
export const debugWorld = (x: number, y: number, w: number, h: number, g: number) => {
  const b = new Buf(w, h, PAL.N0);
  const L = setLights({w: g, cath: 0, fire: 0});
  resolveWindow(wallLayer(), L, b, x, y);
  resolveWindow(tableLayer(), L, b, x, y);
  return b;
};
