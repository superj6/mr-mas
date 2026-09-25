// MR. MAS — mdinner2: the per-frame scene for intro frames 345-479 (pure; runs in Remotion via <PixelScene>
// and in the Node preview). The room, its light rig and the diners' drawings are mdinner1's (read-only imports),
// and the draw order mirrors mdinner1's drawFrame exactly, so 345-359 here are pixel-identical to mdinner1's.
// The freeze print and the card geometry are the engine's (src/shared/pixel/freeze.ts), shared with mdinner1.
//   360-374    MARIO FREEZE: one beat of stopped world, printed in Mario's ink; the card rises; WORD COUNT races
//   375-389    the room runs again under the card: Mario talks, his essay unrolls down the table; whip left (384)
//   390-404    Mas takes the tail, rolls it into a paper telescope and aims it at the ceiling...
//   405-419    ...which bursts: the SPACEZ booster descends beside Mas, candles lie flat, every glass sloshes
//              except Mas's, his cowlick whips, the neon OPEN AI swings in and lights the room red
//   420-449    NOLE FREEZE at touchdown, printed in Nole's red; 435 SUED OVER IT.
//   450-464    the room runs again: the check flashes LEDGER (450-453), smoke rolls off, Mas sips his water
//   465-479    the founding, full colour: Mas stands, the cards become place cards, he slides the N (clunk 473),
//              AI lights (474): NOPE AI, its red and cyan spilling over the table, Nole and the hull
import {Buf, W, H, bayer, clamp, hash, PAL, Mask, blitImg, blinkAt, holds, lum, stepColor} from '../../shared/pixel';
import type {PixelSceneProps, SwitchSpec} from '../../shared/pixel';
import {FOUNDERS, PAPER, Founder, freezePrint, freezeSolid, freezePop} from '../../shared/pixel/freeze';
import {gergBack, gergFront, gergKeycaps, drawKeycaps, gergTypeAt, GERG_TABLE_EDGE, GergPose} from '../../shared/pixel/cast/gerg';
import {alyiChairLift, alyiLift, ALYI_TABLE_EDGE, ALYI_LEV_SEAT, ALYI_CHAIR_EYES, AlyiLevPose} from '../../shared/pixel/cast/alyi';
import {marioImg, MARIO_BASE, MARIO_FOOT, MARIO_SCROLL_HAND, MarioPose, drawVault, drawDraft, VaultState, MARIO_PORTRAIT_REST} from '../../shared/pixel/cast/mario';
import {NOLE_PORTRAIT_REST} from '../../shared/pixel/cast/nole';
import {CX} from '../../shared/pixel/cast/bosses';
import {camera as md1Camera} from '../mdinner1/timeline';
import {wallLayer, tableLayer, resolveWindow, setLights, drawPendant, drawCandle, drawGlass, drawPlace, drawBasket, drawFarChair, drawNearChair, flameGlow, PENDANTS, CANDLES, TABLE, SEAT, SetLight} from '../mdinner1/set';
import {cathAt, cathLight, drawCathedral, drawCathRays, alyiRim} from '../mdinner1/cathedral';
import {drawNapkin, drawEffigy, drawEffigySign, drawEffigyFire, drawWaterLine, EFFIGY} from '../mdinner1/props';
import {SIGN_RECT} from '../mdinner1/set';
import {masAt as md1MasAt, drawFrame as md1DrawFrame, PRINT_TONES as MD1_PRINT_TONES, IGNITE as MD1_IGNITE} from '../mdinner1/scene';
import {masBack2, masFront2, MasPose2, MASD_CX, MASD_TABLE_EDGE, tableEdge, STAND} from './masmd2';
import {drawSign, SIGN, SignState, SPILL, boxFalloff} from './sign';
import {drawStrip, drawRoll} from './scroll';
import {boostBeat, drawHole, plumeLight, drawDebris, drawBoosterScene, drawSmoke, drawCeilingAbove, drawDust, pendantFall, PENDANT_HIT, BOOST} from './booster';
import {drawGlassSlosh, drawCandleBlown, drawCandleFallen, drawPlaceCard, drawEffigyCrushed} from './props';
import {drawMarioCard, drawNoleCard} from './cards';
import {MD2_FROM, toGlobal, T, T as TL, FREEZE_M, FREEZE_N, worldClock, boostClock, frozenAt} from './timeline';

// ------------------------------------------------------------------ ownership (what the freeze may touch)
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
/**
 * Owners, numbered exactly as mdinner1's (so 345-359 can be drawn by mdinner1's own drawFrame into this buffer):
 * world = the room (prints paper / dot / ink); mas + live = Mas and what he holds (never printed); star = the
 * featured founder; fig = other figures; text = lettering; cloth = the table's linen. Added here: check = the
 * check (lettering in a print; LEDGER at 450), sign = the neon letters (lettering in a print; the light source, so
 * its own spill never tints it).
 */
export const OWN = {world: 0, mas: 1, star: 2, live: 3, fig: 4, text: 5, cloth: 6, check: 7, sign: 8} as const;

// ------------------------------------------------------------------ the camera
export {FREEZE_M, FREEZE_N, worldClock};
export const CAM2 = {mario: 606, mas: 340, key: 300, y: 14} as const;
const KICK = [2, -1, 0];
export interface Cam { x: number; y: number; dx: number; }
const camRaw = (g: number): [number, number] => {
  if (g < 360) { const c = md1Camera(g); return [c.x, c.y]; }
  // the Mario framing holds while the essay races off frame-left; 390 is a HARD CUT to the telescope framing
  if (g < T.cut) return [CAM2.mario, CAM2.y];
  if (g < 405) return [CAM2.mas, CAM2.y];
  if (g < 420) return [CAM2.mas, [-6, -18, -26, -26, -24, -18, -10, -3, 3, 7, 10, 12, 13, 14, 14][g - 405]]; // tilt up past the crown, then ride the booster down
  if (g < 465) return [CAM2.mas, CAM2.y];
  // the founding: truck toward the sign (it ends centred) and crane up, whole pixels, easing out
  const t = Math.min(1, (g - 465) / 13), e = 1 - (1 - t) * (1 - t);
  return [Math.round(CAM2.mas + (CAM2.key - CAM2.mas) * e), Math.round(CAM2.y - 6 * e)];
};
export const camera = (g: number): Cam => {
  const [x, y] = camRaw(g);
  const [px] = camRaw(g - 1);
  let ky = 0, kx = 0;
  for (const t0 of [FREEZE_M.t0, FREEZE_N.t0]) if (g >= t0 && g < t0 + KICK.length) ky = KICK[g - t0];
  if (g >= 409 && g < 420) kx = hash(g, 3, 11) < 0.5 ? -1 : 1; // the rumble: seeded, 1 px
  return {x: x + kx, y: y + ky, dx: x - px};
};

// ------------------------------------------------------------------ positions (world) — mdinner1's
const MAS_X = SEAT.mas - MASD_CX, MAS_Y = TABLE.top - MASD_TABLE_EDGE;
const GERG_X = SEAT.gerg, GERG_Y = TABLE.top - GERG_TABLE_EDGE;
const ALYI_X = SEAT.alyi;
const VAULT = {cx: SEAT.vault, cy: 156};
/** the RED-TEAMED plate over the vault door (world rect; drawn by the cast's drawVault) */
const RED_TEAMED_RECT: [number, number, number, number] = [VAULT.cx - 34, VAULT.cy - 54, 66, 13];
const IGNITE = MD1_IGNITE; // one ignition frame for the whole dinner (mdinner1's, f290)
const LEDGER = [T.ledger, T.ledger + T.ledgerLen] as const;
/** the sign's rail at rest (world): centred over Mas, just out of his seated reach, in the arched window */
export const SIGN_AT = {x: SEAT.mas - Math.floor(SIGN.w / 2), y: 121, chainTop: 23} as const;
void ALYI_TABLE_EDGE;

// ------------------------------------------------------------------ MAS (never freezes)
export const masAt2 = (g: number): MasPose2 => {
  const breathe = (Math.floor(g / 20) % 2) as 0 | 1;
  const base: MasPose2 = {arm: 'steeple', lid: 0, look: 0, mouth: 'rest', breathe, hair: 0};
  if (g < 360) { const p = md1MasAt(g).pose; return {...base, lid: p.lid, look: p.look, mouth: p.mouth === 'chew' ? 'rest' : p.mouth, breathe: p.breathe}; }
  if (g < 386) return {...base, look: 1}; // watching Mario (off screen)
  if (g < 390) return {...base, look: 1, lid: blinkAt(g, 387)}; // the roll arrives at his hands
  if (g < 391) return {...base, arm: 'grab', look: 0, breathe: 0};
  if (g < 395) return {...base, arm: 'roll', look: 0, breathe: 0};
  // the telescope goes up to his eye and STAYS there, aimed at the ceiling, straight into the burst
  if (g < 405) return {...base, arm: 'scope', breathe: 0};
  if (g < 420) {
    // the ceiling bursts; the downdraft whips his cowlick flat; his face does not move
    const hair = (g < 410 ? 0 : g % 4 < 2 ? 2 : 1) as 0 | 1 | 2;
    return {...base, arm: g < 407 ? 'scope' : g < 409 ? 'rest' : 'steeple', hair, breathe: 0};
  }
  if (g < T.sip) return {...base, hair: (g < 421 ? 2 : g < 423 ? 1 : 0) as 0 | 1 | 2, look: g >= 428 && g < 436 ? 1 : 0};
  if (g < T.stand) {
    // Mas's gag inside the NOLE freeze: a calm sip under the sign while every other glass is frozen mid-slosh
    const arm = holds<MasPose2['arm']>(g - T.sip, [['lift', 1], ['sip', 3], ['lift', 1]]);
    return {...base, arm, breathe: 0, look: 0};
  }
  // still inside the freeze: he stands (glass in hand), unhooks the N (456) and flicks it along the rail to the front
  // (it clunks home at 464); on 465 time comes back and the sign relights. Key art 465-479: standing, glass in hand.
  const k = g - T.stand;
  const arm = holds<MasPose2['arm']>(k, [['sdown', 1], ['upN', 2], ['flick', T.nClunk - T.stand - 2], ['sdown', 99]]);
  return {...base, stand: true, glass: true, arm, breathe: 0, look: 0, mouth: g >= T.aiOn + 3 ? 'smile' : 'rest', lid: blinkAt(g, 476)};
};

// ------------------------------------------------------------------ MARIO + the vault (345-359: mdinner1's staging)
const vaultAt = (g: number): VaultState => ({open: g < 345 ? 0 : g < 347 ? 1 : g < 349 ? 2 : 3, f: worldClock(g), ticks: g < 348 ? 0 : g < 352 ? 1 : g < 356 ? 2 : 3}); // T.tick1-3
const MARIO_AT: [number, number] = [VAULT.cx + 4, 222];
const marioAt = (g: number): {pose: MarioPose; foot: [number, number]; inside: boolean} | null => {
  const P = (o: Partial<MarioPose>): MarioPose => ({...MARIO_BASE, ...o});
  if (g >= FREEZE_M.t1) {
    // the room runs again: "well, actually—" at last. Finger up, the essay in his back hand, talking on 2s
    const k = g - FREEZE_M.t1;
    const mouth = ([1, 2, 1, 0, 2, 1, 2, 0] as const)[Math.floor(k / 2) % 8];
    return {pose: P({arm: k % 12 < 8 ? 'raise2' : 'raise', mouth, brow: 1, scroll: true, blink: k === 17}), foot: MARIO_AT, inside: false};
  }
  const w = g >= FREEZE_M.t0 ? FREEZE_M.t0 - 1 : g; // frozen on his last drawing
  if (w < 347) return null;
  if (w < 350) return {pose: P({light: 'sil'}), foot: [VAULT.cx - 6, 218], inside: true};
  if (w < 352) return {pose: P({light: 'sil', legs: 'step0'}), foot: [VAULT.cx - 2, 222], inside: false};
  if (w < 354) return {pose: P({light: 'fade', legs: 'step1'}), foot: [VAULT.cx + 2, 222], inside: false};
  if (w < 357) return {pose: P({arm: 'chest', mouth: 1}), foot: MARIO_AT, inside: false};
  if (w < 359) return {pose: P({arm: 'raise', mouth: 1, brow: 1}), foot: MARIO_AT, inside: false}; // finger on 357
  return {pose: P({arm: 'raise2', mouth: 2, brow: 1}), foot: MARIO_AT, inside: false};
};

// ------------------------------------------------------------------ the scroll (the essay, live from 375)
/** world x of the scroll's leading roll: it drops from Mario's back hand at 375 and races down the cloth to Mas */
export const scrollLead = (g: number): number | null => {
  if (g < FREEZE_M.t1) return null;
  const path = [884, 862, 834, 802, 768, 734, 702, 672, 646, 622, 600, 582, 566, 552, 542, 536];
  return g - FREEZE_M.t1 < path.length ? path[g - FREEZE_M.t1] : 534;
};
/** Mario's back hand (world): where the essay hangs from, down to the cloth */
const SCROLL_HAND: [number, number] = [MARIO_AT[0] - MARIO_FOOT[0] + MARIO_SCROLL_HAND[0], MARIO_AT[1] - MARIO_FOOT[1] + MARIO_SCROLL_HAND[1]];
const SCROLL_END = SCROLL_HAND[0] + 2;
const STRIP_Y = TABLE.top + 1;

// ------------------------------------------------------------------ the sign
export const signAt = (g: number): SignState | null => {
  if (g < 409) return null;
  const w = boostClock(g); // it swings in with the booster, stops with the world at touchdown, then settles
  const swing: Array<[number, number]> = [[87, -50], [70, -30], [40, -8], [8, 0], [-18, -2], [-26, -3], [-20, -2], [-8, 0], [6, 0], [12, -1], [10, 0], [6, 0], [3, 0], [3, 0], [1, 0], [0, 0]];
  const [sx, sy] = g >= T.aiOn ? [0, 0] : swing[Math.min(swing.length - 1, w - 409)];
  const open = (w < 411 ? 0 : w === 412 ? 2 : w === 413 ? 0 : 1) as 0 | 1 | 2;
  let nDx = 0, nLift = 0;
  if (g >= T.nLift) {
    // inside the freeze: the N comes off its hook (456), rides the back of the rail to the front slot, and clunks
    // home on 464 (no jolt: the frozen sign does not move; only Mas and what he holds do)
    const k = g - T.nLift;
    nLift = [3, 3, 3, 3, 3, 3, 3, 1, 0][Math.min(8, k)];
    nDx = [0, -6, -16, -28, -40, -49, -54, -56, -56][Math.min(8, k)];
  }
  // 465: the sign relights in one step, in full colour; the rail settles AI into the gap on the thaw
  const ai: 0 | 1 | 2 = g >= T.aiOn ? 1 : 0;
  const aiDx = g >= T.aiOn ? -9 : 0;
  return {nDx, nLift, open: g >= T.aiOn ? 1 : open, ai, aiDx, sx, sy};
};
/** Mas holds the N from the unhook until the thaw: it takes his colour (never printed) */
const nTaken = (g: number) => g >= T.nLift && g < T.aiOn;

// ------------------------------------------------------------------ small helpers
/** the knocked-off pendant shade, cord snapped, tumbling (its rim still glowing) */
const drawPendantLoose = (b: Buf, x: number, y: number) => {
  const rows = ['....ooo....', '..oBbbdo...', '.oBbbbbbdo.', 'oWWWWWWWWWo', '.oyYYYYYyo.'];
  const pal: Record<string, number> = {o: PAL.N0, B: PAL.W4, b: PAL.W2, d: PAL.W1, W: PAL.W5, Y: PAL.W7, y: PAL.W5};
  rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = pal[r[i]]; if (c !== undefined) b.set(x - 5 + i, y + j, c); } });
  for (let j = 1; j < 6; j++) b.set(x - 1 + (j >> 1), y - j, PAL.N1); // the snapped cord trailing
};
/**
 * The whip smear (same recipe as mdinner1's): only highlights streak back along the move, in whole pixels,
 * one rung dimmer per 6 px; everything else keeps its shape so the frame stays legible.
 */
const whipSmear = (fb: Buf, dx: number, wx: number) => {
  const run = clamp(Math.round(Math.abs(dx) * 0.45), 0, 26);
  if (run < 2) return;
  const dir = dx < 0 ? -1 : 1;
  const src = fb.c.slice();
  for (let y = 0; y < fb.h; y++)
    for (let x = 0; x < fb.w; x++) {
      const c = src[y * fb.w + x];
      if (lum(c) < 0.62) continue;
      const n = run - ((bayer(x + wx, y) * 5) | 0);
      for (let k = 1; k <= n; k++) {
        const xx = x - dir * k;
        if (xx < 0 || xx >= fb.w) break;
        const cur = fb.c[y * fb.w + xx];
        const col = stepColor(c, -Math.floor(k / 6));
        if (lum(col) > lum(cur)) fb.c[y * fb.w + xx] = col;
      }
    }
};

/** a hanging length of the scroll: 2 px paper from (x0, y0) sagging down to the strip at (x1, y1) */
const drawTail = (b: Buf, x0: number, y0: number, x1: number, y1: number) => {
  const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
  for (let k = 0; k <= n; k++) {
    const t = k / n;
    const x = Math.round(x0 + (x1 - x0) * t), y = Math.round(y0 + (y1 - y0) * t + Math.sin(t * Math.PI) * 3);
    b.set(x, y, PAL.P2); b.set(x, y + 1, k % 5 === 2 ? CX.INK : PAL.P1); b.set(x + 1, y + 1, PAL.P0);
  }
};

// ------------------------------------------------------------------ the frame
export interface FrameInfo { cam: Cam; g: number; w: number; check: [number, number, number, number] | null; }

export const drawFrame = (b: OwnedBuf, g: number): FrameInfo => {
  // 345-359 ARE mdinner1's frames: its own drawFrame paints them (the overlap stays pixel-identical by construction)
  if (g < FREEZE_M.t0) { const i = md1DrawFrame(b, g); return {cam: i.cam, g, w: i.w, check: null}; }
  const cam = camera(g);
  const w = worldClock(g);
  const ox = cam.x, oy = cam.y;
  const bc = boostClock(g);
  const bt = boostBeat(bc);
  const burning = !!(bt.state && bt.state.burn >= 0);
  const fireAge = w - worldClock(IGNITE);
  const fireOut = g >= 410; // the downdraft snuffs the effigy fire
  const base = setLights({w, cath: cathLight(g), fire: fireOut ? 0 : fireAge === 0 ? 0.4 : fireAge === 1 ? 1.15 : 1});
  const plume = plumeLight(bt);
  const L: SetLight = plume ? {...base, warm: (x, y) => Math.max(base.warm(x, y), plume(x, y))} : base;
  b.cur = OWN.world;

  // ---- the wall, the cathedral in Alyi's bay, the vault, the broken ceiling
  resolveWindow(wallLayer(), L, b, ox, oy);
  if (oy < 0) drawCeilingAbove(b, ox, oy, bt, burning);
  drawCathedral(b, ox, oy, cathAt(g, w));
  if (VAULT.cx - ox > -60 && VAULT.cx - ox < W + 60) drawVault(b, VAULT.cx - ox, VAULT.cy - oy, vaultAt(Math.min(g, FREEZE_M.t0)));
  drawHole(b, ox, oy, g, burning || (bt.state?.burn === -2));
  for (const px of PENDANTS) {
    if (px !== PENDANT_HIT) { drawPendant(b, px - ox, 92 - oy); continue; }
    const fall = pendantFall(g);
    if (!fall) continue;
    if (fall[1] === 0) drawPendant(b, px - ox, 92 - oy);
    else drawPendantLoose(b, px + fall[0] - ox, 92 + fall[1] - oy);
  }

  // ---- the neon sign (in front of the arched window, behind the diners' heads)
  const sign = signAt(g);
  if (sign) {
    b.cur = OWN.sign; // the light source: world in a freeze, never tinted by its own spill
    drawSign(b, SIGN_AT.x - ox, SIGN_AT.y - oy, SIGN_AT.chainTop - oy, sign, undefined, (start) => { b.cur = start && nTaken(g) ? OWN.live : OWN.sign; });
    b.cur = OWN.world;
  }

  // ---- BACK layers
  const gp: GergPose = {type: gergTypeAt(w), lid: 0, look: 0, mouth: 'rest', flick: (Math.floor(w / 3) % 2) as 0 | 1};
  const star: 'mario' | 'nole' = g < FREEZE_N.t0 ? 'mario' : 'nole';
  drawFarChair(b, GERG_X + 13 - ox, GERG_Y + 12 - oy);
  b.cur = OWN.fig;
  blitImg(b, gergBack(gp), GERG_X - ox, GERG_Y - oy, {flip: true, map: (c) => (c === PAL.W4 ? PAL.D3 : c)});
  b.cur = OWN.world;
  const mp = masAt2(g);
  const standY = mp.stand ? TABLE.top - tableEdge(mp) + (g === TL.stand ? Math.floor(STAND / 2) : 0) : MAS_Y;
  b.cur = OWN.mas;
  blitImg(b, masBack2(mp), MAS_X - ox, standY - oy);
  b.cur = OWN.world;
  const lift = 20 + alyiLift(w, 40);
  // still seated in his rising dinner chair (mdinner1's drawing), napkin in lap
  const lp: AlyiLevPose = {lid: 0, mouth: 'rest', hands: 'knees'};
  b.cur = OWN.fig; // (lit in flat planes + a cyan rim below: the god-rays skip him, as in mdinner1)
  const ay = TABLE.top + 6 - ALYI_LEV_SEAT - lift - oy;
  blitImg(b, alyiChairLift(lp), ALYI_X - ox, ay);
  b.cur = OWN.live; for (const [ex, ey] of ALYI_CHAIR_EYES) b.set(ALYI_X - ox + ex, ay + ey, PAL.K3); // eye glints never print
  b.cur = OWN.world;
  drawFarChair(b, 812 - ox, 176 - oy);
  drawFarChair(b, 962 - ox, 176 - oy);
  const mario = marioAt(g);
  if (mario) {
    b.cur = star === 'mario' ? OWN.star : OWN.fig;
    const img = marioImg(mario.pose);
    const mx = mario.foot[0] - MARIO_FOOT[0] - ox, my = mario.foot[1] - MARIO_FOOT[1] - oy;
    const vx = VAULT.cx - ox, vy = VAULT.cy - oy;
    blitImg(b, img, mx, my, mario.inside ? {clip: (x, y) => (x + 0.5 - vx) ** 2 + (y + 0.5 - vy) ** 2 < 29 * 29} : {});
    b.cur = OWN.world;
  }
  const dt = (g < FREEZE_M.t0 ? g : g < FREEZE_M.t1 ? FREEZE_M.t0 - 1 : g - (FREEZE_M.t1 - FREEZE_M.t0) - 1) - 348;
  if (dt >= 0 && dt < 24) drawDraft(b, VAULT.cx + 10 + dt * 3 - ox, Math.round(VAULT.cy - 10 - dt * 2 + dt * dt * 0.18) - oy, Math.floor((dt + 348) / 2));

  // ---- the TABLE (the linen: in a print, one clean paper field with ink folds)
  b.cur = OWN.cloth;
  resolveWindow(tableLayer(), L, b, ox, oy);
  b.cur = OWN.world;
  const T = TABLE.top - oy;

  // ---- the essay (live from 375): hangs from Mario's back hand to the cloth and runs down it to Mas
  const lead = scrollLead(g);
  if (lead !== null) {
    b.cur = OWN.world;
    const holding = g >= 391 && g < 407; // Mas has the tail: rolled, then the telescope
    const x0 = (holding ? 548 : lead) - ox;
    drawStrip(b, x0, SCROLL_END - ox, STRIP_Y - oy, 542 - ox);
    drawTail(b, SCROLL_HAND[0] - ox, SCROLL_HAND[1] - oy, SCROLL_END - ox, STRIP_Y - oy);
    if (!holding) drawRoll(b, lead - 6 - ox, T + 7, Math.floor(g / 2));
    // while Mas holds the tail (roll / telescope), the paper runs from his hands back down to the cloth
    if (holding) {
      const [hx, hy] = g < 395 ? [MAS_X + 39, MAS_Y + 37] : [MAS_X + 37, MAS_Y + 20];
      b.cur = OWN.live;
      drawTail(b, hx - ox, hy - oy, 548 - ox, STRIP_Y + 1 - oy);
      b.cur = OWN.world;
    }
  }

  // ---- FRONT layers
  b.cur = OWN.fig;
  blitImg(b, gergFront(gp), GERG_X - ox, GERG_Y - oy, {flip: true});
  b.cur = OWN.mas;
  blitImg(b, masFront2(mp), MAS_X - ox, standY - oy);
  b.cur = OWN.world;

  // ---- on the cloth (mdinner1's places, glasses, basket, napkin, candles, effigy)
  drawPlace(b, SEAT.mas - ox, T + 3);
  drawPlace(b, SEAT.alyi + 24 - ox, T + 3);
  drawPlace(b, 800 - ox, T + 3);
  // every glass sloshes on the descent, splashes at touchdown (held through the freeze), then settles
  const slosh = (seed: number) => (g < 412 ? 0 : g < FREEZE_N.t0 ? (1 + ((g + seed) >> 1) % 2) : g < FREEZE_N.t1 ? 3 : g < FREEZE_N.t1 + 3 ? (1 + ((g + seed) >> 1) % 2) : g < FREEZE_N.t1 + 5 ? 1 + seed % 2 : 0);
  const glassAt = (x: number, seed: number, glint = false) => (g < 412 || slosh(seed) === 0 ? drawGlass(b, x - ox, T + 5, true, glint && w % 24 < 2 ? 1 : 0) : drawGlassSlosh(b, x - ox, T + 5, slosh(seed)));
  glassAt(446, 0, true);
  // Mas's water: it never ripples. (In his hand while he sips.)
  const sipping = mp.arm === 'lift' || mp.arm === 'sip' || !!mp.glass;
  if (!sipping) { b.cur = OWN.live; drawGlass(b, 548 - ox, T + 5, false); drawWaterLine(b, 548 - ox, T + 5); b.cur = OWN.world; } // mdinner1's water line
  glassAt(662, 1);
  glassAt(736, 0);
  glassAt(872, 1);
  drawBasket(b, 820 - ox, T + 5);
  b.cur = OWN.text;
  drawNapkin(b, 352 - ox, T - 7, w >= 232);
  b.cur = OWN.world;
  for (const cx of CANDLES) {
    if (g >= 410 && Math.abs(cx - BOOST.cx) < 30) { drawCandleFallen(b, cx - 18 - ox, T + 4); continue; }
    const blown = g < 410 ? 0 : g < 416 ? 1 : 2;
    if (!blown) { drawCandle(b, cx - ox, T + 4, w + cx); flameGlow(b, cx - ox, T - 10, 8, ox, oy); }
    else drawCandleBlown(b, cx - ox, T + 4, w + cx, blown as 1 | 2, cx < BOOST.cx ? -1 : 1);
  }
  if (g < 420) {
    b.cur = OWN.fig;
    drawEffigy(b, ox, oy, !fireOut && fireAge >= 1 ? 1 : 0, 2); // arms up: it holds its own UNALIGNED sign
    b.cur = OWN.world;
    if (!fireOut) drawEffigyFire(b, ox, oy, fireAge, w);
    b.cur = OWN.text;
    drawEffigySign(b, ox, oy, 2);
    b.cur = OWN.world;
    if (!fireOut && fireAge >= 0) flameGlow(b, EFFIGY.x - ox, EFFIGY.base - 16 - oy, 22, ox, oy);
  } else { b.cur = OWN.fig; drawEffigyCrushed(b, EFFIGY.x - ox, EFFIGY.base - oy); b.cur = OWN.world; }

  // ---- keycaps (Gerg's popcorn, resting on the cloth)
  b.cur = OWN.fig;
  drawKeycaps(b, GERG_X - ox, GERG_Y - oy, gergKeycaps(w, {from: 214, rate: 2, max: 48}), true);
  b.cur = OWN.world;

  // ---- the booster, Nole in the hatch, the check; smoke and debris
  b.cur = OWN.world;
  const ledger = g >= LEDGER[0] && g < LEDGER[1];
  if (bt.nole && g >= FREEZE_N.t1) {
    // the room runs again: Nole pitches from the hatch, check out, talking on 2s
    const k = g - FREEZE_N.t1;
    bt.nole = {...bt.nole, mouth: ([2, 1, 2, 0, 1, 2, 1, 0] as const)[Math.floor(k / 2) % 8], back: k % 10 < 6 ? 'phoneUp' : 'phoneUp2'};
  }
  const bo = drawBoosterScene(b, ox, oy, bt, g, ledger, (part) => { b.cur = part === 'hull' ? OWN.world : part === 'check' ? OWN.check : star === 'nole' ? OWN.star : OWN.fig; });
  b.cur = OWN.world;
  const smokeK = g < FREEZE_N.t1 ? bt.smoke : 3 + Math.floor((g - FREEZE_N.t1) / 2);
  drawSmoke(b, ox, oy, smokeK, g < FREEZE_N.t1 ? 0 : (g - FREEZE_N.t1) / 20);
  drawDebris(b, ox, oy, bt.debris);
  drawDust(b, ox, oy, g);

  // ---- place cards: the name cards, shrunk (465: Nole's card closes into them on the thaw)
  if (g >= TL.touch) {
    const hop = g === TL.touch ? 2 : g === TL.touch + 1 ? 1 : 0;
    b.cur = OWN.live;
    drawPlaceCard(b, 402 - ox, T + 7, ['GERG'], FOUNDERS.gerg.accent, hop);
    drawPlaceCard(b, 700 - ox, T + 7, ['ALYI'], FOUNDERS.alyi.accent, hop);
    drawPlaceCard(b, 582 - ox, T + 7, ['NOLE'], FOUNDERS.nole.accent, hop);
    drawPlaceCard(b, 742 - ox, T + 7, ['MARIO', '(JOINS 2016)'], FOUNDERS.mario.accent, hop);
    b.cur = OWN.world;
  }

  // god-rays fall over the bay's air, except the levitating Alyi, who is lit in flat planes with a cyan rim from the
  // rose window (mdinner1's rule: no dither on a figure); then the near side's empty chairs (1.35x parallax)
  const alyiPx = (X: number, Y: number) => X >= 0 && Y >= 0 && X < W && Y < H && b.own[Y * W + X] === OWN.fig && X >= ALYI_X - ox - 4 && X < ALYI_X - ox + 64;
  drawCathRays(b, ox, oy, cathAt(g, w), alyiPx);
  b.cur = OWN.fig; alyiRim(b, alyiPx, cathAt(g, w).rays); b.cur = OWN.world;
  b.cur = OWN.fig;
  for (const nx of [262, 468, 700, 940, 1180]) drawNearChair(b, Math.round(nx - ox * 1.35 + 60), TABLE.front + 14 - oy);
  b.cur = OWN.world;
  // THE WOODROSE sign and the vault's RED-TEAMED plate are lettering: in a print they take the hard threshold
  for (const [sx, sy, sw, sh] of [SIGN_RECT, RED_TEAMED_RECT])
    for (let y = Math.max(0, sy - oy); y < Math.min(H, sy + sh - oy); y++)
      for (let x = Math.max(0, sx - ox); x < Math.min(W, sx + sw - ox); x++) if (b.own[y * W + x] === OWN.world) b.own[y * W + x] = OWN.text;
  return {cam, g, w, check: ledger ? bo.check : null};
};

// ------------------------------------------------------------------ the neon's light (a light, not a style switch)
/**
 * The lit tubes light the RUNNING room around them (412-419 as the sign swings in; 450-479 after touchdown):
 * the table, the founders, Nole and the hull take the tube's hue near the letters (sign.ts SPILL: a per-colour
 * LUT, two strengths). Applied in draw, before any freeze, so a frozen frame prints the lit room. The tubes
 * themselves are the source and are skipped. Mas takes the far strength only: he stays Mas.
 */
const spillAt = (b: OwnedBuf, g: number, cam: Cam) => {
  const s = signAt(g);
  if (!s || s.open !== 1 || frozenAt(g)) return;
  const X = SIGN_AT.x + s.sx - cam.x, Y = SIGN_AT.y + s.sy - cam.y + SIGN.letterY;
  const zones: Array<{set: typeof SPILL.red; near: Mask; far: Mask}> = [];
  const big = g >= T.founding ? 1.25 : 1;
  const nx0 = X + SIGN.slotX(g >= T.founding ? 0 : 1), nx1 = X + SIGN.slotX(4) + 9;
  zones.push({set: SPILL.red, near: boxFalloff(nx0, Y, nx1, Y + 15, 16 * big, 12 * big, 1.15), far: boxFalloff(nx0, Y, nx1, Y + 15, 64 * big, 72 * big, 1.1)});
  if (s.ai) {
    const ax0 = X + SIGN.aX + (s.aiDx ?? 0), ax1 = X + SIGN.iX + (s.aiDx ?? 0) + 5;
    const r = s.ai === 2 ? 0.5 : 1;
    zones.push({set: SPILL.cyan, near: boxFalloff(ax0, Y, ax1, Y + 15, 12 * r, 12 * r, 1.15), far: boxFalloff(ax0, Y, ax1, Y + 15, 56 * r, 66 * r, 1.1)});
  }
  // the cloth right under the letters catches a soft wash of the tube (its lit top, not only its shadows)
  const ty = TABLE.top - cam.y;
  zones.push({set: SPILL.red, near: boxFalloff(nx0 + 8, ty - 1, nx1 - 8, ty + 4, 34 * big, 7, 0.75), far: new Mask()});
  const src = b.c.slice();
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const i = y * W + x;
      const o = b.own[i];
      if (o === OWN.sign) continue;
      for (const z of zones) {
        const near = o !== OWN.mas && z.near.on(x, y);
        if (!near && !z.far.on(x, y)) continue;
        b.c[i] = (near ? z.set.near : z.set.far).map(src[i], x, y);
        break;
      }
    }
};

// ------------------------------------------------------------------ the freeze print (the shared founder prints)
/**
 * One beat of stopped world per hit, printed on cream paper in the founder's ink with the SAME engine sets
 * (src/shared/pixel/freeze.ts: freezePrint / freezeSolid / freezePop), the SAME tone curves (mdinner1's exported
 * PRINT_TONES) and the same procedure as mdinner1's GERG and ALYI (a mirror of mdinner1 scene.ts printFrame):
 * the room paper / one 50% dot / ink; figures, faces and lettering on a hard threshold; the featured founder on his
 * own brighter threshold with a 2px paper knock-out; every printed figure keeps a 1px ink contour; the linen keeps
 * its edge and hem as ink rules. Mas and what he holds are never printed. On the first 2 frames of the hit the
 * whole print flashes toward paper. (If mdinner1's printFrame changes, re-sync this mirror.)
 */
let TONE_OVERRIDE: Partial<typeof MD1_PRINT_TONES> = {};
/** the neon's dithered glow rings (sign.ts RED / CYAN glow1, glow2) */
const NEON_GLOW = new Set([PAL.R2, PAL.R1, PAL.C4, PAL.C2]);
/** dev hook (tuning grids only) */
export const _tunePrint = (t: Partial<typeof MD1_PRINT_TONES>) => { TONE_OVERRIDE = t; };
const printFrame = (fb: Buf, own: Uint8Array, who: Founder, g: number) => {
  const T = {...MD1_PRINT_TONES, ...TONE_OVERRIDE};
  const sets = {
    room: freezePrint(who, T.room), figure: freezeSolid(who, T.figure), star: freezeSolid(who, T.star),
    linen: freezeSolid(who, T.linen), type: freezeSolid(who, T.type), pop: freezePop(who, T.pop),
  };
  const t0 = who === 'mario' ? FREEZE_M.t0 : FREEZE_N.t0;
  const pop = g - t0 < 2;
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const i = y * W + x;
      const o = own[i];
      if (o === OWN.mas || o === OWN.live) continue;
      // the neon prints as solid INK letters on the pale window (a lit tube is the brightest thing in the room, so
      // on paper it is lettering, not light); its glow rings drop out
      if (o === OWN.sign && !pop) { fb.c[i] = NEON_GLOW.has(fb.c[i]) ? PAPER : FOUNDERS[who].ink; continue; }
      const set = pop ? sets.pop : o === OWN.star ? sets.star : o === OWN.cloth ? sets.linen : o === OWN.text || o === OWN.check ? sets.type : o === OWN.fig ? sets.figure : sets.room;
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
  // the stencil contour: every printed figure keeps a 1px ink outline; the linen keeps its top edge and hem
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

// ------------------------------------------------------------------ switches (palette) and the UI layer
let LAST: {g: number; check: Mask; info: FrameInfo} | null = null;
const founderAt = (g: number): Founder => (g < FREEZE_N.t0 ? 'mario' : 'nole');

export const runFrame = (fb: Buf, g: number) => {
  const b = new OwnedBuf(W, H, PAL.N0);
  const info = drawFrame(b, g);
  spillAt(b, g, info.cam);
  void whipSmear; // (the 384-389 whip is cut: hard cut at 390)
  fb.c.set(b.c);
  if (frozenAt(g)) printFrame(fb, b.own, founderAt(g), g);
  const check = new Mask();
  for (let i = 0; i < b.own.length; i++) if (b.own[i] === OWN.check) check.a[i] = 255;
  LAST = {g, check, info};
  return info;
};

export const switchesAt = (g: number): SwitchSpec[] | null => {
  const out: SwitchSpec[] = [];
  if (!LAST || LAST.g !== g) return null;
  // 405-406: the burst lights the room one rung brighter for two frames (a flash, not a switch of look)
  if (g === 405 || g === 406) out.push({type: 'step', k: g === 405 ? 2 : 1});
  // 450-453: money. The check flashes LEDGER and shows what was received
  if (LAST.info.check) out.push({type: 'palette', to: 'LEDGER', mask: LAST.check});
  return out.length ? out : null;
};

export const drawUI = (ui: Buf, g: number) => {
  const cam = camera(g);
  // MARIO card: rises on the hit, holds over the running room and over the 390 cut (UI layer: it does not ride the
  // camera), closes in 2 steps at 403-404 (T12 reads f363-402)
  if (g >= FREEZE_M.t0 && g < T.marioClose + 2) {
    const k = g - FREEZE_M.t0;
    const ox = 0;
    void cam;
    const words = Math.min(15000, Math.round(15000 * Math.pow(clamp((g - T.wordCount) / 8, 0, 1), 1.6)));
    const mp = {...MARIO_PORTRAIT_REST, brow: 1 as const, finger: (g >= 374 && g < 377 ? 2 : 1) as 0 | 1 | 2, nod: g >= 374 && g < 377 ? 1 : 0,
      mouth: (k < 5 ? 0 : ([1, 2, 1, 0, 3, 1, 0, 0] as const)[Math.floor((k - 5) / 2) % 8]) as 0 | 1 | 2 | 3, blink: blinkAt(g, 370)};
    drawMarioCard(ui, k, ox, mp, words, g >= T.marioClose ? g - T.marioClose + 1 : 0);
  }
  // NOLE card: slams in on the touchdown; the stamp at 435; holds over the running room; at Mas's touch (466)
  // it closes into its place card on the cloth
  if (g >= FREEZE_N.t0 && g < T.touch) {
    const k = g - FREEZE_N.t0;
    const np = {...NOLE_PORTRAIT_REST, screen: 'check' as const, mouth: (k < 4 ? 2 : k < 30 ? ([2, 1, 0, 1, 2, 0][Math.floor(k / 3) % 6]) : 4) as 0 | 1 | 2 | 3 | 4, brow: (k < 30 ? 1 : 0) as 0 | 1, jab: (k % 20 < 3 && k > 6 ? 1 : 0) as 0 | 1 | 2, dip: 0, blink: blinkAt(g, 441)};
    drawNoleCard(ui, k, np, g < T.touch ? 0 : 2); // on his touch it is gone: it hops onto the cloth as a place card
  }
};

export const SCENE: PixelSceneProps = {
  bg: PAL.N0,
  draw: (fb, f) => { runFrame(fb, toGlobal(f)); },
  switch: (f) => switchesAt(toGlobal(f)),
  after: (ui, f) => drawUI(ui, toGlobal(f)),
};
export {MD2_FROM};
