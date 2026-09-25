// MR. MAS — mdinner2: the SPACEZ booster comes through THE WOODROSE ceiling (world coords in, screen out).
// Uses the cast's drawBooster / noleImg / checkImg (castrivals, read-only). Here: the ragged ceiling hole,
// falling debris, the plume's light, the touchdown smoke, the crushed basket and the knocked-over candle.
import {Buf, bayer, hash, rect, clamp, blitImg, PAL} from '../../shared/pixel';
import {drawBooster, boosterHatch, BoosterState, noleImg, NOLE_BASE, NolePose, checkImg, CHECK_W, CHECK_H} from '../../shared/pixel/cast/nole';
import {TABLE} from '../mdinner1/set';

/** the booster's centre x and landed geometry (world) */
export const BOOST = {cx: 624, legY: TABLE.top + 5, holeX0: 592, holeX1: 662} as const;
export const BOOST_BY = BOOST.legY - 6;

export interface BoostBeat {
  state: BoosterState | null;
  /** Nole in the hatch */
  nole: NolePose | null;
  lean: number;
  /** check drawing: 0 none, 1 held, 2 thrust, 'ledger' */
  check: 0 | 1 | 2 | 'ledger';
  /** ceiling: 0 intact, 1 cracking, 2 open */
  hole: 0 | 1 | 2;
  /** frames since the burst (debris clock), -1 = none */
  debris: number;
  /** touchdown smoke clock, -1 none */
  smoke: number;
  basketCrushed: boolean;
}

/** world clock g -> booster beat. The world freezes at 420 (touchdown) and stays there. */
export const boostBeat = (g: number): BoostBeat => {
  const w = Math.min(g, 420);
  if (w < 405) return {state: null, nole: null, lean: 0, check: 0, hole: 0, debris: -1, smoke: -1, basketCrushed: false};
  // descent: the bell is above the ceiling at 405 (its light pours through the cracks), in the hole at 407,
  // then a decelerating retro-burn onto the cloth at 420. Whole pixels.
  const bellY = w < 408 ? [-50, -30, -10][w - 405] : Math.round(10 + (BOOST_BY - 10) * (1 - Math.pow(1 - clamp((w - 408) / 12, 0, 1), 1.7)));
  const lift = BOOST_BY - bellY;
  const hatch: 0 | 1 | 2 = w < 415 ? 0 : w < 416 ? 1 : 2;
  const state: BoosterState = {lift, squat: w >= 420, hatch, burn: w >= 420 ? -2 : w % 3, f: w};
  let nole: NolePose | null = null, lean = 0, check: BoostBeat['check'] = 0;
  if (w >= 416) {
    lean = w < 417 ? 1 : w < 418 ? 3 : 5;
    const thrust = w >= 419;
    nole = {...NOLE_BASE, noLegs: true, arm: thrust ? 'check2' : 'check', back: w >= 418 ? 'phoneUp' : 'hang', lean: 0, brow: 1, mouth: w >= 419 ? 2 : 1};
    check = thrust ? 2 : 1;
  }
  return {state, nole, lean, check, hole: w < 406 ? 1 : 2, debris: w - 405, smoke: w >= 420 ? 3 : -1, basketCrushed: w >= 420};
};

/** the hole the booster punches: a ragged ellipse through the coffered ceiling (world coords) */
export const HOLE = {cx: 627, cy: 2, rx: 38, ry: 22} as const;
const holeR = (x: number, y: number) => {
  const u = (x + 0.5 - HOLE.cx) / HOLE.rx, v = (y + 0.5 - HOLE.cy) / HOLE.ry;
  const a = Math.atan2(v, u);
  const jag = 1 + (hash(Math.floor((a + Math.PI) * 7), 5, 2) - 0.5) * 0.34 + (hash(Math.floor((a + Math.PI) * 23), 6, 2) - 0.5) * 0.12;
  return Math.hypot(u, v) / jag;
};
/**
 * The ceiling above mdinner1's world (y < 0): the camera tilts up past the crown moulding for the burst, so
 * the coffered ceiling continues here (dark walnut beams every 56 px, cross-beams every 14 rows), with the
 * hole punched through it. Only rows with world y < 0 are painted.
 */
export const drawCeilingAbove = (b: Buf, ox: number, oy: number, bt: BoostBeat, plumeOn: boolean) => {
  for (let sy = 0; sy < b.h; sy++) {
    const wy = sy + oy;
    if (wy >= 0) break;
    for (let sx = 0; sx < b.w; sx++) {
      const wx = sx + ox;
      const beam = ((wx % 56) + 56) % 56 < 6, cross = ((wy % 14) + 14) % 14 === 0;
      let c: number = beam || cross ? PAL.D0 : PAL.N0;
      if ((((wx % 56) + 56) % 56 === 0 || ((wy % 14) + 14) % 14 === 1) && (beam || cross)) c = PAL.D1;
      if (plumeOn) {
        // the engine lights the underside of the ceiling around the hole
        const d = Math.hypot(wx - BOOST.cx, (wy + 4) * 2) / 90;
        if (d < 1 && bayer(wx, wy) < (1 - d) * 0.9) c = beam || cross ? PAL.W3 : PAL.W1;
      }
      b.set(sx, sy, c);
    }
  }
};

/** plaster dust bursting out of the ceiling (405-411): clumps that billow out and sink, dithered, whole px */
export const drawDust = (b: Buf, ox: number, oy: number, g: number) => {
  const k = g - 405;
  if (k < 0 || k > 7) return;
  for (let i = 0; i < 9; i++) {
    const a = -0.3 + (i / 8) * (Math.PI + 0.6);
    const d = 14 + k * (4 + (i % 3));
    const cx = HOLE.cx + Math.cos(a) * d * 1.3, cy = HOLE.cy + 12 + Math.sin(a) * d * 0.35 + k * k * 0.5;
    const r = 3 + (i % 3) + Math.floor(k * 0.9);
    const fade = k / 8;
    for (let y = -r; y <= r; y++) for (let x = -r - 2; x <= r + 2; x++) {
      const q = (x / (r + 2)) ** 2 + (y / r) ** 2;
      if (q > 1) continue;
      const X = Math.round(cx) + x, Y = Math.round(cy) + y;
      if (bayer(X, Y) < fade + (q > 0.55 ? 0.35 : 0)) continue;
      b.set(X - ox, Y - oy, y < -r / 3 ? PAL.P0 : q > 0.55 ? PAL.G4 : PAL.G5);
    }
  }
};

/** the brass pendant that hangs in the booster's path is knocked off its cord and falls (406-411) */
export const PENDANT_HIT = 616;
export const pendantFall = (g: number): [number, number] | null => {
  if (g < 406) return [0, 0];
  const k = g - 406;
  if (k > 5) return null;
  return [[3, 6, 9, 12, 15, 18][k], [6, 18, 36, 58, 84, 112][k]];
};

/**
 * The broken ceiling. 405: the panel cracks, the engine glow shows through the seams. 406+: the ragged hole
 * (the void above, lit by the plume), a broken plaster/lath lip, lath strips dangling.
 */
export const drawHole = (b: Buf, ox: number, oy: number, g: number, plumeOn: boolean) => {
  if (g < 405) return;
  if (g === 405) {
    for (let i = 0; i < 7; i++) {
      let x = HOLE.cx + (i - 3) * 2, y = 8;
      const dx = [-1.6, -1.1, -0.5, 0.1, 0.6, 1.2, 1.7][i];
      for (let k = 0; k < 16 + (i % 3) * 5; k++) {
        x += dx + (hash(i, k, 4) - 0.5) * 1.2; y += 0.25 + (hash(k, i, 5) - 0.5) * 0.9;
        b.set(Math.round(x) - ox, Math.round(y) - oy, k < 6 ? PAL.W8 : k < 12 ? PAL.W6 : PAL.W4);
      }
    }
    return;
  }
  for (let y = HOLE.cy - HOLE.ry - 8; y <= HOLE.cy + HOLE.ry + 8; y++)
    for (let x = HOLE.cx - HOLE.rx - 8; x <= HOLE.cx + HOLE.rx + 8; x++) {
      const r = holeR(x, y);
      if (r < 1) {
        let c: number = PAL.N0;
        if (plumeOn) { const d = r; if (bayer(x, y) < (1 - d) * 0.7) c = d < 0.5 ? PAL.W3 : PAL.W1; }
        b.set(x - ox, y - oy, c);
      } else if (r < 1.1) b.set(x - ox, y - oy, hash(x, y, 7) < 0.5 ? PAL.P0 : PAL.D3);
      else if (r < 1.18 && hash(x, y, 8) < 0.5) b.set(x - ox, y - oy, PAL.D1);
    }
  // lath strips hanging off the lip, swinging on 2s
  for (let i = 0; i < 6; i++) {
    const x = HOLE.cx - 30 + i * 12 + (i % 2) * 3;
    let yb = HOLE.cy;
    while (holeR(x, yb) < 1.05 && yb < 40) yb++;
    const len = 3 + (i * 7) % 6, sway = (Math.floor(g / 2) + i) % 2;
    for (let j = 0; j < len; j++) b.set(x + (j > len / 2 ? sway : 0) - ox, yb + j - oy, j === 0 ? PAL.D3 : PAL.D2);
  }
};

/** plume light: extra tungsten pool from the engine (for the room's light field) */
export const plumeLight = (bt: BoostBeat) => {
  if (!bt.state || bt.state.burn === -1) return null;
  const by = BOOST_BY - bt.state.lift;
  const hot = bt.state.burn >= 0 ? 1.1 : 0.55;
  return (x: number, y: number) => {
    const d = Math.hypot((x - BOOST.cx) / 150, (y - by - 10) / 110);
    return d >= 1 ? 0 : (1 - d) * hot;
  };
};

/** falling ceiling: coffer panels (two held drawings: face-on / edge-on) + lath + plaster crumbs */
export const drawDebris = (b: Buf, ox: number, oy: number, k: number) => {
  if (k < 0 || k > 18) return;
  const panels = [['ddddd', 'dDDDd', 'kkkkk'], ['.dd', 'dDk', 'dDk', '.kk']];
  const pal: Record<string, number> = {d: PAL.D2, D: PAL.D4, k: PAL.N1};
  for (let i = 0; i < 34; i++) {
    const t0 = i < 8 ? 1 : Math.floor(hash(i, 1, 9) * 3);
    const t = k - t0;
    if (t < 0) continue;
    const a = hash(i, 2, 9) * Math.PI;
    const x0 = HOLE.cx + Math.cos(a) * HOLE.rx * 0.8, y0 = HOLE.cy + 6;
    const vx = Math.cos(a) * (2 + hash(i, 3, 9) * 3.5), vy = 0.5 + hash(i, 4, 9) * 2.5;
    const x = Math.round(x0 + vx * t), y = Math.round(y0 + vy * t + 1.2 * t * t);
    if (y > TABLE.top + 4) continue;
    if (i < 8) {
      const d = panels[(Math.floor(t / 2) + i) % 2];
      d.forEach((r, j) => { for (let q = 0; q < r.length; q++) { const c = pal[r[q]]; if (c !== undefined) b.set(x + q - ox, y + j - oy, c); } });
    } else {
      const c = i % 3 === 0 ? PAL.P0 : i % 3 === 1 ? PAL.D3 : PAL.G5;
      b.set(x - ox, y - oy, c);
      if (i % 4 === 0) b.set(x + 1 - ox, y - oy, PAL.N2);
    }
  }
};

export interface BoostDrawOut {
  /** screen rect of the check (for the LEDGER flash mask) */
  check: [number, number, number, number] | null;
}

/** booster + Nole + check (screen space via the camera offset) */
export const drawBoosterScene = (b: Buf, ox: number, oy: number, bt: BoostBeat, g: number, ledger = false, tag?: (part: 'hull' | 'nole' | 'check') => void): BoostDrawOut => {
  if (!bt.state) return {check: null};
  const cx = BOOST.cx - ox, by = BOOST_BY - oy, legY = BOOST.legY - oy;
  tag?.('hull');
  drawBooster(b, cx, by, bt.state, legY);
  let rectOut: BoostDrawOut['check'] = null;
  if (bt.nole) {
    const h = boosterHatch(cx, by, bt.state);
    const img = noleImg({...bt.nole, lean: bt.lean});
    const nx = h.x0 + 12 - 52, ny = h.y1 - 48;
    tag?.('nole');
    blitImg(b, img, nx, ny, {clip: (x, y) => x <= h.x1 && y <= h.y1});
    if (bt.check) {
      const ck = checkImg(ledger);
      tag?.('check');
      const hx = nx + 17 - bt.lean + (bt.check === 2 ? -3 : 0), hy = ny + 33 + (bt.check === 2 ? -1 : 0);
      const ccx = hx - Math.round(CHECK_W * 0.42), ccy = hy - 8;
      blitImg(b, ck, ccx, ccy);
      for (const [ix, iy, c] of [[0, -1, PAL.N0], [1, -1, PAL.N0], [2, -1, PAL.N0], [0, 0, PAL.K3], [1, 0, PAL.K4], [2, 0, PAL.K2], [0, 1, PAL.K2], [1, 1, PAL.K3], [2, 1, PAL.X2], [3, 0, PAL.N0], [3, 1, PAL.N0], [-1, 0, PAL.N0], [-1, 1, PAL.N0]] as const) b.set(hx - 1 + ix, ccy + iy, c);
      rectOut = [ccx, ccy, CHECK_W, CHECK_H];
    }
  }
  void g;
  return {check: rectOut};
};

/**
 * touchdown smoke rolling out along the cloth (frozen at its 3rd drawing in the freeze). `thin` 0..1 thins it
 * away once the room runs again (an ordered threshold eats the clumps from their edges in).
 */
export const drawSmoke = (b: Buf, ox: number, oy: number, k: number, thin = 0) => {
  if (k < 0 || thin >= 1) return;
  const legY = BOOST.legY - oy;
  for (let i = 0; i < 9; i++) for (const side of [-1, 1]) {
    const cx2 = BOOST.cx - ox + side * (10 + k * 3 + i * 3), cy2 = legY - 3 - (i % 3) - Math.floor(k / 4);
    const r = 2 + (i % 2) + Math.floor(k / 3);
    for (let y = -r; y <= r; y++) for (let x = -r - 1; x <= r + 1; x++) {
      const q = (x / (r + 1)) ** 2 + (y / r) ** 2;
      if (q > 1) continue;
      if (q > 0.5 && bayer(cx2 + x + ox, cy2 + y + oy) < 0.35) continue;
      if (thin > 0 && bayer(cx2 + x + ox, cy2 + y + oy) < thin * (0.6 + q * 0.8)) continue;
      b.set(cx2 + x, cy2 + y, y < -r / 3 ? PAL.G6 : q > 0.5 ? PAL.G4 : PAL.G5);
    }
  }
};
void rect;
