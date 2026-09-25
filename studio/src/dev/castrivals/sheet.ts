// MR. MAS — castrivals: the cast sheet + the 48-frame motion test as pure functions frame -> 480x270.
// Layout: [MARIO portrait] [MARIO vignette: vault] [NOLE vignette: booster] [NOLE portrait]
//         [ skyline at dusk: the rooftop bosses, one loop each ]
import {Buf, W, H, bayer, rect, clamp} from '../pixeladv/core/px';
import {PAL} from '../pixeladv/core/palette';
import {text, textWidth} from '../pixeladv/core/font';
import {MatBuf, resolve} from '../pixeladv/core/light';
import {blitImg} from '../pixeladv/core/figure';
import {drawMarioPortrait, MARIO_PORTRAIT_REST, marioImg, MARIO_BASE, MARIO_FOOT, MARIO_SCROLL_HAND, MarioPose, drawVault, drawScroll, drawDraft, VaultState} from '../../shared/pixel/cast/mario';
import {micro, microWidth, drawBoss, BOSSES, BossId, CX} from '../../shared/pixel/cast/bosses';
import {extraNole, extraMario, extraBosses, extraFreeze} from './extras';
import {drawNolePortrait, NOLE_PORTRAIT_REST, noleImg, NOLE_BASE, NOLE_FOOT, NolePose, drawBooster, boosterHatch, BoosterState, checkImg, CHECK_W} from '../../shared/pixel/cast/nole';

export const MOTION_FRAMES = 48;

// ---------------------------------------------------------------- the Woodrose set, one panel wide
const PW = 108, PH = 158;
const FLOOR_Y = 104; // wall meets floor
const TABLE_Y = 136; // front edge of the tabletop

interface SetLights { cyanAt?: [number, number, number]; candles: Array<[number, number]>; f: number; }

const paintWall = (mb: MatBuf) => {
  const wall = mb.mat('wall', 0), trim = mb.mat('trim', 1), floor = mb.mat('floor', 0), wood = mb.mat('wood', 0);
  for (let y = 0; y < FLOOR_Y; y++) for (let x = 0; x < PW; x++) {
    // damask-ish wallpaper: faint vertical stripes, one level apart
    wall(x, y);
    if (x % 9 === 0 || (x % 9 === 4 && y % 6 < 3)) mb.shade(-0.6)(x, y);
  }
  for (let x = 0; x < PW; x++) { trim(x, FLOOR_Y - 8); trim(x, FLOOR_Y - 7); for (let y = FLOOR_Y - 6; y < FLOOR_Y; y++) { wood(x, y); mb.shade(-1.5)(x, y); } }
  for (let y = FLOOR_Y; y < PH; y++) for (let x = 0; x < PW; x++) { floor(x, y); mb.shade(-1.6)(x, y); if ((y - FLOOR_Y) % 7 === 0) mb.shade(-0.8)(x, y); }
};

/** white cloth by candlelight: hand-ordered cream ramp by distance to the flames, dithered seams */
const CLOTH = [PAL.N2, PAL.X1, PAL.X2, PAL.X3, PAL.P0, PAL.P1, PAL.P2, PAL.W8];
const drawCloth = (b: Buf, candles: Array<[number, number]>, f: number) => {
  const flick = [0, 1, -1][Math.floor(f / 2) % 3] * 0.6;
  for (let y = TABLE_Y - 10; y < PH; y++)
    for (let x = 0; x < PW; x++) {
      let d = 999;
      for (const [cx, cy] of candles) d = Math.min(d, Math.hypot(x - cx, (y - cy) * 1.6));
      const top = y < TABLE_Y;
      let v = (top ? 7.2 : 4.4) - (d + flick) / (top ? 9 : 10) - (top ? 0 : (y - TABLE_Y) * 0.12);
      if (!top && x % 11 === 5) v -= 0.8; // drape folds
      const q = clamp(Math.floor(v + bayer(x, y) * 0.9), 0, CLOTH.length - 1);
      b.set(x, y, CLOTH[q]);
    }
  rect(0, TABLE_Y, PW, 1, b.ink(PAL.X2));
};

const paintTable = (mb: MatBuf, f: number) => {
  const cloth = mb.mat('paper', -1), wood = mb.mat('wood', 0);
  // tabletop (seen from just above) and the cloth's front drape
  for (let y = TABLE_Y - 10; y < TABLE_Y; y++) for (let x = 0; x < PW; x++) { cloth(x, y); mb.shade(1.6)(x, y); }
  for (let y = TABLE_Y; y < PH; y++) for (let x = 0; x < PW; x++) { cloth(x, y); mb.shade(-1.2 - (y - TABLE_Y) * 0.08)(x, y); if (x % 11 === 5) mb.shade(-0.8)(x, y); }
  void wood; void f;
};

const setLights = (L: SetLights) => ({
  amb: () => 1.2,
  cyan: (x: number, y: number) => {
    if (!L.cyanAt) return 0;
    const [cx, cy, r] = L.cyanAt;
    const d = Math.hypot((x - cx) / 1.3, (y - cy) / 0.8) / r;
    return clamp(0.95 - d * 0.55, 0, 1) * (y > FLOOR_Y ? 1 : 0.8);
  },
  warm: (x: number, y: number) => {
    let v = 0;
    const flick = [1, 0.96, 1.02][Math.floor(L.f / 2) % 3];
    for (const [cx, cy] of L.candles) v = Math.max(v, (1 - Math.hypot(x - cx, (y - cy) * 1.4) / 56) * flick);
    return clamp(v, 0, 1);
  },
  dither: 0.8,
});

const candle = (b: Buf, x: number, y: number, f: number, blown = 0) => {
  // a short taper in a brass stick; 3-drawing flame, held 2
  rect(x - 1, y - 9, 3, 8, b.ink(PAL.P1));
  rect(x - 1, y - 9, 1, 8, b.ink(PAL.P2));
  rect(x + 1, y - 9, 1, 8, b.ink(PAL.P0));
  rect(x - 3, y - 1, 7, 2, b.ink(PAL.W4));
  rect(x - 2, y - 1, 3, 1, b.ink(PAL.W6));
  const k = Math.floor(f / 2) % 3;
  if (blown === 2) { b.set(x, y - 10, PAL.N4); b.set(x - 1, y - 11, PAL.N3); return; } // snuffed: a curl of smoke
  if (blown === 1) { // laid flat by the downdraft
    const fl = ['yYWW..', '.yYWWW'][k % 2];
    for (let i = 0; i < fl.length; i++) { const c = {W: PAL.W7, Y: PAL.W9, y: PAL.W5}[fl[i] as 'W']; if (c) b.set(x - 5 + i, y - 10, c); }
    return;
  }
  const flames = [['.W.', 'WYW', 'YyY', '.y.'], ['.W..', '.WW.', 'WYW.', '.y..'], ['..W.', '.WW.', '.WYW', '..y.']];
  const fp: Record<string, number> = {W: PAL.W7, Y: PAL.W9, y: PAL.W5};
  flames[k].forEach((r, j) => { for (let i = 0; i < r.length; i++) if (fp[r[i]]) b.set(x - 1 + i, y - 13 + j, fp[r[i]]); });
};

const panelBorder = (b: Buf, x: number, y: number, w: number, h: number) => {
  rect(x - 3, y - 3, w + 6, h + 6, b.ink(PAL.N0));
  rect(x - 2, y - 2, w + 4, 1, b.ink(PAL.N5));
  rect(x - 2, y - 2, 1, h + 4, b.ink(PAL.N5));
  rect(x - 2, y + h + 1, w + 4, 1, b.ink(PAL.N3));
  rect(x + w + 1, y - 2, 1, h + 4, b.ink(PAL.N3));
};
const panelLabel = (b: Buf, x: number, y: number, w: number, h: number, label: string, accent: number) => {
  void w;
  const lw = textWidth(label) + 8;
  rect(x + 3, y + h - 12, lw, 11, b.ink(PAL.N0));
  text(b, label, x + 7, y + h - 10, accent);
};

// ---------------------------------------------------------------- MARIO vignette: out of the vault
export interface MarioBeat { vault: VaultState; pose: MarioPose; x: number; scroll: number; draft: [number, number, number] | null; }
export const marioBeat = (f: number): MarioBeat => {
  // 0-5 closed (beacons already turning) / 6-11 door swings / 12-19 he steps out as a silhouette /
  // 20-27 into the candle light, finger comes up / 28+ the scroll drops and unrolls
  const open: VaultState['open'] = f < 4 ? 0 : f < 7 ? 1 : f < 10 ? 2 : 3;
  const ticks = f < 30 ? 0 : f < 34 ? 1 : f < 38 ? 2 : 3;
  const vault: VaultState = {open, f, ticks: f >= 44 ? 3 : ticks};
  let pose: MarioPose = {...MARIO_BASE};
  let x = 42;
  if (f < 8) x = -999;
  else if (f < 12) { pose = {...pose, light: 'sil'}; x = 33; }
  else if (f < 16) { pose = {...pose, light: 'sil', legs: 'step0'}; x = 37; }
  else if (f < 20) { pose = {...pose, light: 'fade', legs: 'step1'}; x = 41; }
  else if (f < 23) { pose = {...pose, arm: 'chest', mouth: 1}; }
  else if (f < 26) { pose = {...pose, arm: 'raise', mouth: 1, brow: 1}; }
  else if (f < 29) { pose = {...pose, arm: 'raise2', mouth: 2, brow: 1}; }
  else pose = {...pose, arm: f % 12 < 6 ? 'raise' : 'raise2', mouth: f % 6 < 3 ? 1 : 0, brow: 1};
  pose.scroll = f >= 20;
  pose.blink = f === 33 || f === 34;
  const scroll = f < 26 ? 0 : Math.min(150, (f - 26) * 8);
  const t = f - 6;
  const draft: MarioBeat['draft'] = t >= 0 && t < 24 ? [44 + t * 3, Math.round(60 - t * 2.2 + t * t * 0.16 + Math.sin(t / 1.6) * 1.5), Math.floor(f / 2)] : null;
  return {vault, pose, x, scroll, draft};
};

export const drawMarioPanel = (b: Buf, px: number, py: number, f: number) => {
  const st = marioBeat(f);
  const vcx = 50, vcy = 62;
  const mb = new MatBuf(PW, PH);
  paintWall(mb);
  const L = setLights({cyanAt: st.vault.open ? [vcx, vcy + 20, 42] : undefined, candles: [[99, TABLE_Y - 18], [16, TABLE_Y - 18]], f});
  const tmp = new Buf(PW, PH, PAL.N0);
  resolve(mb, L, tmp);
  drawVault(tmp, vcx, vcy, st.vault);
  // Mario
  const img = marioImg(st.pose);
  const mx = st.x - MARIO_FOOT[0] + 20, my = 128 - MARIO_FOOT[1];
  // still inside the vault: he is clipped by the opening (and stands on its sill)
  const inside = f < 12;
  if (st.x > -100) blitImg(tmp, img, mx, my - (inside ? 4 : 0), inside ? {clip: (x, y) => (x + 0.5 - vcx) ** 2 + (y + 0.5 - vcy) ** 2 < 29 * 29} : {});
  if (st.draft) drawDraft(tmp, st.draft[0], st.draft[1], st.draft[2]);
  // table in front; the scroll drapes over its back edge and unrolls across the cloth
  drawCloth(tmp, [[16, TABLE_Y - 14], [99, TABLE_Y - 14]], f);
  rect(0, TABLE_Y - 11, PW, 1, tmp.ink(PAL.N1));
  if (st.scroll > 0) drawScroll(tmp, mx + MARIO_SCROLL_HAND[0] + 1, my + MARIO_SCROLL_HAND[1] + 2, TABLE_Y - 3, st.scroll, PW - 2);
  candle(tmp, 16, TABLE_Y - 4, f);
  candle(tmp, 99, TABLE_Y - 4, f + 3);
  for (let y = 0; y < PH; y++) for (let x = 0; x < PW; x++) b.set(px + x, py + y, tmp.get(x, y));
};

// ---------------------------------------------------------------- NOLE vignette: through the ceiling
export interface NoleBeat { boost: BoosterState; lean: number; pose: NolePose | null; check: 0 | 1 | 2 | 'ledger'; shake: number; candles: number; basket: 0 | 1; smoke: number; debris: number; }
export const noleBeat = (f: number): NoleBeat => {
  // 0-7 descent on the plume / 8 touchdown (squat, shake, smoke) / 12-15 hatch pops /
  // 16-21 he leans out, check first / 22+ the pitch: check thrusts on the beat, phone up (mid-post)
  const TD = 8;
  const lift = f < TD ? Math.round(64 * Math.pow(1 - f / TD, 2)) : 0;
  const boost: BoosterState = {lift, squat: f >= TD && f < TD + 3, hatch: f < 12 ? 0 : f < 14 ? 1 : 2, burn: f < TD ? f % 3 : f < TD + 4 ? -2 : -1, f};
  let pose: NolePose | null = null, lean = 0;
  let check: NoleBeat['check'] = 0;
  if (f >= 15) {
    lean = f < 17 ? 1 : f < 19 ? 3 : 5;
    const beat = (f - 22) % 12;
    const thrust = f >= 22 && beat < 3;
    const back = f >= 20 ? (f % 8 < 4 ? 'phoneUp' : 'phoneUp2') : 'hang';
    pose = {...NOLE_BASE, noLegs: true, arm: thrust ? 'check2' : 'check', back, lean: 0, brow: f >= 22 ? 1 : 0, mouth: f >= 22 ? ([2, 1, 0, 1, 2, 0][Math.floor(f / 2) % 6] as 0 | 1 | 2) : 0};
    check = thrust ? 2 : 1;
    if (f >= 40 && f < 44) check = 'ledger';
  }
  const shake = f === TD ? 2 : f === TD + 1 ? -2 : f === TD + 2 ? 1 : 0;
  return {boost, lean, pose, check, shake, candles: f < 3 ? 0 : f < 14 ? 1 : 2, basket: f >= TD ? 1 : 0, smoke: f >= TD && f < TD + 14 ? f - TD : -1, debris: f < 16 ? f : -1};
};

const BCX = 80; // booster centre in the panel
const drawCeiling = (b: Buf, f: number, hole: boolean) => {
  // coffered plaster ceiling with a ragged hole where the booster came through
  for (let y = 0; y < 9; y++) for (let x = 0; x < PW; x++) b.set(x, y, y === 8 ? PAL.N0 : y < 2 ? PAL.N2 : (x % 18 === 0 ? PAL.N1 : y === 2 ? PAL.N5 : PAL.N4));
  if (!hole) return;
  const edge = [3, 5, 4, 7, 8, 9, 9, 8, 9, 9, 7, 8, 6, 9, 9, 8, 9, 9, 8, 7, 9, 8, 6, 9, 5, 7, 4, 6, 3, 4];
  edge.forEach((d, i) => { const x = BCX - 22 + i + Math.floor(i / 2); for (let y = 0; y < d; y++) b.set(x, y, y === d - 1 ? PAL.N0 : PAL.N1); b.set(x, d, PAL.N5); });
  void f;
};

export const drawNolePanel = (b: Buf, px: number, py: number, f: number, opts: {noLedger?: boolean} = {}) => {
  const st = noleBeat(f);
  const mb = new MatBuf(PW, PH);
  paintWall(mb);
  const L = setLights({cyanAt: [-30, 70, 60], candles: st.candles === 2 ? [[96, TABLE_Y - 18]] : [[10, TABLE_Y - 18], [96, TABLE_Y - 18]], f});
  const tmp = new Buf(PW, PH, PAL.N0);
  resolve(mb, L, tmp);
  // engine glow on the wall while it burns
  if (st.boost.burn >= 0 || st.boost.burn === -2)
    for (let y = 60; y < TABLE_Y; y++) for (let x = 30; x < PW; x++) {
      const d = Math.hypot(x - BCX, (y - (TABLE_Y - 8)) * 1.4) / (st.boost.burn >= 0 ? 44 : 30);
      if (d < 1 && bayer(x, y) > d * 0.9 + 0.15) tmp.set(x, y, d < 0.45 ? PAL.W3 : PAL.W2);
    }
  drawCeiling(tmp, f, true);
  const legY = TABLE_Y - 4;
  const by = legY - 6;
  drawBooster(tmp, BCX, by, st.boost, legY);
  // debris from the ceiling
  if (st.debris >= 0) for (let k = 0; k < 7; k++) {
    const dx = BCX - 24 + k * 8 + (k % 2) * 3, dy = 4 + st.debris * (3 + (k % 3)) - k * 3;
    if (dy > 4 && dy < TABLE_Y - 10) { tmp.set(dx, dy, PAL.N5); tmp.set(dx + 1, dy, PAL.N4); if (k % 2) tmp.set(dx, dy + 1, PAL.N3); }
  }
  // Nole leaning out of the hatch: clipped to the hatch opening and the air to its left
  if (st.pose) {
    const h = boosterHatch(BCX, by, st.boost);
    const img = noleImg({...st.pose, lean: st.lean});
    // his back stays inside the hatch; the rest of him is out in the room
    const nx = h.x0 + 12 - 52, ny = h.y1 - 48;
    blitImg(tmp, img, nx, ny, {clip: (x, y) => x <= h.x1 && y <= h.y1});
    // the check, presented in front of his chest by his near hand (thrusts on the beat)
    if (st.check) {
      const ck = checkImg(st.check === 'ledger' && !opts.noLedger);
      const hx = nx + 17 - st.lean + (st.check === 2 ? -3 : 0), hy = ny + 33 + (st.check === 2 ? -1 : 0);
      const cx = hx - Math.round(CHECK_W * 0.42), cy = hy - 8;
      blitImg(tmp, {w: ck.w, h: ck.h, c: ck.c}, cx, cy);
      // fingers over the check's edge
      // his fingers over the top edge, thumb in front
      for (const [ix, iy, c] of [[0, -1, PAL.N0], [1, -1, PAL.N0], [2, -1, PAL.N0], [0, 0, PAL.K3], [1, 0, PAL.K4], [2, 0, PAL.K2], [0, 1, PAL.K2], [1, 1, PAL.K3], [2, 1, PAL.X2], [3, 0, PAL.N0], [3, 1, PAL.N0], [-1, 0, PAL.N0], [-1, 1, PAL.N0]] as const) tmp.set(hx - 1 + ix, cy + iy, c);
    }
  }
  // table, basket, candles
  drawCloth(tmp, st.candles === 2 ? [[96, TABLE_Y - 14]] : [[10, TABLE_Y - 14], [96, TABLE_Y - 14]], f);
  rect(0, TABLE_Y - 11, PW, 1, tmp.ink(PAL.N1));
  // redraw the booster's feet on the cloth (the pads sit on it) + the crushed bread basket under the right foot
  const bx0 = BCX + 22;
  if (!st.basket) {
    rect(bx0, TABLE_Y - 9, 12, 5, tmp.ink(PAL.D2)); rect(bx0, TABLE_Y - 9, 12, 1, tmp.ink(PAL.D4));
    for (const [i, j] of [[1, -3], [5, -4], [8, -3]]) { rect(bx0 + i, TABLE_Y - 9 + j, 4, 3, tmp.ink(PAL.W5)); tmp.set(bx0 + i + 1, TABLE_Y - 9 + j, PAL.W7); }
  } else {
    rect(bx0 - 2, TABLE_Y - 6, 16, 2, tmp.ink(PAL.D2)); rect(bx0 - 1, TABLE_Y - 7, 14, 1, tmp.ink(PAL.W4));
    for (const i of [0, 4, 9, 13]) tmp.set(bx0 + i, TABLE_Y - 3, PAL.W5);
  }
  if (!st.boost.lift) for (const fx of [BCX - 34, BCX + 32]) { rect(fx - 3, legY, 7, 2, tmp.ink(PAL.N0)); rect(fx - 2, legY, 5, 1, tmp.ink(fx < BCX ? PAL.C3 : PAL.W4)); }
  // touchdown smoke rolling out along the cloth
  if (st.smoke >= 0) {
    const k = st.smoke;
    for (let i = 0; i < 9; i++) for (const side of [-1, 1]) {
      const cx2 = BCX + side * (8 + k * 3 + i * 2), cy2 = legY - 2 - (i % 3) - Math.floor(k / 4);
      const r = 2 + (i % 2) + Math.floor(k / 5);
      for (let y = -r; y <= r; y++) for (let x = -r - 1; x <= r + 1; x++) {
        const q = (x / (r + 1)) ** 2 + (y / r) ** 2;
        if (q > 1) continue;
        if (q > 0.5 && bayer(cx2 + x, cy2 + y) < 0.3 + k / 20) continue;
        if (k > 9 && bayer(cx2 + x, cy2 + y) < (k - 9) / 5) continue;
        tmp.set(cx2 + x, cy2 + y, y < -r / 3 ? PAL.G6 : q > 0.5 ? PAL.G4 : PAL.G5);
      }
    }
  }
  candle(tmp, 10, TABLE_Y - 4, f, st.candles);
  candle(tmp, 96, TABLE_Y - 4, f + 3, st.candles === 2 ? 0 : st.candles);
  const sh = st.shake;
  for (let y = 0; y < PH; y++) for (let x = 0; x < PW; x++) b.set(px + x, py + y, tmp.get(clamp(x - sh, 0, PW - 1), clamp(y + (sh ? 1 : 0), 0, PH - 1)));
};

// ---------------------------------------------------------------- portrait windows (adventure-game style)
const portraitFrame = (b: Buf, x: number, y: number, w: number, h: number) => {
  rect(x - 3, y - 3, w + 6, h + 6, b.ink(PAL.N0));
  rect(x - 2, y - 2, w + 4, 1, b.ink(PAL.N6));
  rect(x - 2, y - 2, 1, h + 4, b.ink(PAL.N6));
  rect(x - 2, y + h + 1, w + 4, 1, b.ink(PAL.N3));
  rect(x + w + 1, y - 2, 1, h + 4, b.ink(PAL.N3));
};
const nameTab = (b: Buf, x: number, y: number, name: string, sub: string, accent: number, right = false, stamp?: string) => {
  const nw = textWidth(name) + 10;
  const nx = right ? x - nw : x;
  rect(nx - 1, y, nw + 2, 12, b.ink(PAL.N0));
  rect(nx, y, nw, 11, b.ink(PAL.N2));
  rect(nx, y + 10, nw, 1, b.ink(accent));
  text(b, name, nx + 5, y + 2, accent, {shadow: PAL.N0});
  const sw = microWidth(sub);
  const sx = right ? nx + nw - sw : nx;
  micro(b, sub, sx, y + 15, PAL.N7, PAL.N0);
  if (stamp) {
    // a rubber stamp beside the subtitle (it lands on its own beat in the card; here it just sits)
    const tw = microWidth(stamp) + 6, tx = right ? sx - tw - 6 : sx + sw + 6, ty = y + 13;
    rect(tx, ty, tw, 9, b.ink(CX.Q2)); rect(tx + 1, ty + 1, tw - 2, 7, b.ink(PAL.N1));
    micro(b, stamp, tx + 3, ty + 2, CX.Q2);
  }
};

// ---------------------------------------------------------------- skyline strip (dusk)
const SKY_Y = 172, SKY_H = 98;
const SKY = [PAL.N2, CX.U0, CX.U1, CX.U2, CX.U3, CX.U4, CX.U5, PAL.W5, PAL.W6];
const SLOTS: Array<{id: BossId; cx: number; roof: number; foot: number; w: number; kind: string; ofs?: number}> = [
  {id: 'tasya', cx: 34, roof: 238, foot: 40, w: 62, kind: 'plinth'},
  {id: 'radnus', cx: 102, roof: 234, foot: 104, w: 58, kind: 'flat'},
  {id: 'simed', cx: 172, roof: 240, foot: 190, w: 72, kind: 'flat'},
  {id: 'kram', cx: 246, roof: 236, foot: 254, w: 56, kind: 'drip'},
  {id: 'nesnej', cx: 312, roof: 238, foot: 316, w: 58, kind: 'card'},
  {id: 'misanthropic', cx: 382, roof: 244, foot: 386, w: 62, kind: 'lighthouse'},
  {id: 'zai', cx: 446, roof: 236, foot: 446, w: 52, kind: 'gantry'},
];
const drawSkyline = (b: Buf, f: number, hero = false) => {
  const HERO: Record<BossId, number> = {tasya: 3, radnus: 8, simed: 6, kram: 4, nesnej: 6, misanthropic: 6, zai: 4};
  // sky: a banded dusk gradient with dithered seams (bands are palette steps, not blends)
  for (let y = 0; y < SKY_H; y++)
    for (let x = 0; x < W; x++) {
      const t = Math.pow(y / (SKY_H - 18), 1.25) * (SKY.length - 1);
      const i = Math.floor(t), fr = t - i;
      b.set(x, SKY_Y + y, SKY[Math.min(SKY.length - 1, fr > bayer(x, y) ? i + 1 : i)]);
    }
  // a thin cloud shelf catching the last light
  for (let x = 0; x < W; x++) { const cy = SKY_Y + 20 + Math.round(Math.sin(x / 37) * 2 + Math.sin(x / 11) * 1); if ((x % 97) < 70) { b.set(x, cy, CX.U3); if ((x % 97) < 50) b.set(x, cy - 1, CX.U4); } }
  // the far city: flat violet blocks with a few lit windows
  for (let x = 0; x < W; x++) {
    const hgt = 18 + Math.round(((x * 7919) % 97) / 97 * 0) + [0, 6, 2, 10, 4, 8, 1, 12][Math.floor(x / 23) % 8];
    for (let y = SKY_Y + SKY_H - hgt; y < SKY_Y + SKY_H; y++) {
      const win = ((Math.floor(x / 3) * 31 + Math.floor(y / 4) * 17) % 23 === 0) && x % 3 === 1 && y % 4 === 1;
      b.set(x, y, win ? PAL.W4 : CX.U1);
    }
  }
  // the bosses' buildings
  for (const s of SLOTS) {
    const x0 = s.cx - Math.floor(s.w / 2), x1 = x0 + s.w;
    const top = s.roof;
    for (let y = top; y < SKY_Y + SKY_H; y++)
      for (let x = x0; x < x1; x++) {
        const edgeL = x === x0, edgeR = x === x1 - 1;
        let c: number = y === top ? (x < x0 + s.w * 0.6 ? PAL.W5 : PAL.W3) : y === top + 1 ? PAL.N4 : x < x0 + 3 ? PAL.N4 : PAL.N2;
        if (edgeL && y > top) c = PAL.W3;
        if (edgeR) c = PAL.N0;
        // window grid, a few still lit
        const wx = (x - x0 - 4) % 6, wy = (y - top - 18) % 7;
        if (y > top + 17 && x > x0 + 3 && x < x1 - 4 && wx < 3 && wy < 3) c = ((x * 13 + y * 7 + s.cx) % 11) < 2 ? PAL.W6 : PAL.N1;
        b.set(x, y, c);
      }
    // parapet
    rect(x0, top - 2, s.w, 2, b.ink(PAL.N3));
    rect(x0, top - 2, Math.floor(s.w * 0.6), 1, b.ink(PAL.W4));
    if (s.kind === 'card') rect(x0 + 2, top + 2, s.w - 4, 1, b.ink(PAL.L2)); // INVIDIA: PCB-green trim
    let standY = top - 2;
    if (s.kind === 'lighthouse') {
      // a lighthouse of stacked essays rising off the roof: paper courses, each one a little wider
      const tt = top - 18;
      for (let y = tt; y < top - 2; y++) {
        const hw = 11 + Math.floor((y - tt) / 5);
        for (let x = s.foot - 1 - hw; x < s.foot - 1 + hw; x++) {
          const u = (x - (s.foot - 1 - hw)) / (hw * 2);
          const course = Math.floor((y - tt) / 3) % 2;
          b.set(x, y, u < 0.08 ? PAL.W6 : u < 0.2 ? PAL.P2 : u < 0.7 ? (course ? PAL.P1 : PAL.P0) : u < 0.95 ? PAL.X2 : PAL.N1);
          if ((y - tt) % 3 === 0) b.set(x, y, u < 0.2 ? PAL.P0 : PAL.X1);
        }
      }
      standY = tt - 1;
    }
    const bo = BOSSES.find((q) => q.id === s.id)!;
    drawBoss(b, s.id, s.foot, standY, hero ? HERO[s.id] : f + (s.ofs ?? 0));
    // plates: person name (egg-size) + tower
    const nm = bo.name === 'MARIO+ADELINA' ? 'MARIO+ADELINA' : bo.name;
    micro(b, nm, s.cx - Math.round(microWidth(nm) / 2), top + 6, PAL.W7, PAL.N0);
    micro(b, bo.roof, s.cx - Math.round(microWidth(bo.roof) / 2), top + 13, PAL.N7, PAL.N0);
  }
  void f;
};

// ---------------------------------------------------------------- the sheet (still = motion frame)
/** still = each element at its own hero frame; motion = everything on the same clock */
export const renderSheet = (f: number, still = false): Buf => {
  const fm = still ? 34 : f, fp = still ? 46 : f, fn = still ? 31 : f, fq = still ? 38 : f;
  const b = new Buf(W, H, PAL.N1);
  // top band
  for (let y = 0; y < SKY_Y; y++) for (let x = 0; x < W; x++) b.set(x, y, (x + y) % 2 === 0 && y % 4 === 0 ? PAL.N2 : PAL.N1);
  // MARIO portrait (acting: finger comes up, talks, blinks)
  const mpF = fm < 6 ? 0 : fm < 9 ? 1 : fm % 16 < 3 ? 2 : 1;
  const mpMouth = ([0, 1, 2, 1, 3, 1, 0, 0] as const)[Math.floor(fm / 2) % 8];
  portraitFrame(b, 8, 10, 112, 136);
  drawMarioPortrait(b, 8, 10, {mouth: fm < 8 ? 0 : mpMouth, blink: fm === 20 || fm === 22 ? 1 : fm === 21 ? 2 : 0, brow: fm >= 8 ? 1 : 0, finger: mpF as 0 | 1 | 2, nod: mpF === 2 ? 1 : 0});
  nameTab(b, 12, 149, 'MARIO', 'HAS CONCERNS. HAS GPUS.', PAL.C7);
  // the two vignettes
  panelBorder(b, 128, 6, PW, PH);
  drawMarioPanel(b, 128, 6, fp);
  panelBorder(b, 244, 6, PW, PH);
  drawNolePanel(b, 244, 6, fn);
  // NOLE portrait (acting: the jab + the smirk)
  const nj = fq % 24 < 3 ? 1 : fq % 24 < 6 ? 2 : 0;
  const nm = ([2, 1, 0, 1, 2, 3, 1, 0] as const)[Math.floor(fq / 2) % 8];
  portraitFrame(b, 360, 10, 112, 136);
  drawNolePortrait(b, 360, 10, {mouth: fq >= 36 ? 4 : nm, jab: nj as 0 | 1 | 2, blink: fq === 30 || fq === 32 ? 1 : fq === 31 ? 2 : 0, brow: fq < 36 ? 1 : 0, dip: nj === 1 ? 2 : nj === 2 ? 1 : 0, screen: fq >= 36 ? 'check' : 'post'});
  nameTab(b, 468, 149, 'NOLE', 'NAMED IT.', PAL.W7, true, 'SUED OVER IT.');
  // skyline
  drawSkyline(b, f, still);
  rect(0, SKY_Y - 1, W, 1, b.ink(PAL.N0));
  micro(b, 'SKYLINE BOSSES  /  ONE LOOP EACH', 6, SKY_Y + 4, PAL.N6, PAL.N0);
  micro(b, 'MR. MAS  /  CAST: RIVALS', W - 6 - microWidth('MR. MAS  /  CAST: RIVALS'), SKY_Y + 4, PAL.N6, PAL.N0);
  return b;
};

// ---------------------------------------------------------------- views
export const renderView = (id: string, f: number): Buf => {
  const b = new Buf(W, H, PAL.N1);
  if (id === 'mariopanel') {
    panelBorder(b, 10, 10, PW, PH);
    drawMarioPanel(b, 10, 10, f);
    panelLabel(b, 10, 10, PW, PH, 'MARIO', PAL.C7);
    micro(b, 'f' + f, 130, 10, PAL.N5);
  }
  if (id === 'sheet') return renderSheet(f);
  if (id === 'still') return renderSheet(0, true);
  if (id === 'extra-nole') return extraNole();
  if (id === 'extra-mario') return extraMario();
  if (id === 'extra-bosses') return extraBosses();
  if (id === 'extra-freeze') return extraFreeze({mario: drawMarioPanel, nole: drawNolePanel});
  if (id === 'portraits') {
    drawMarioPortrait(b, 10, 10, {...MARIO_PORTRAIT_REST, mouth: 1, brow: 1});
    drawNolePortrait(b, 140, 10, {...NOLE_PORTRAIT_REST, mouth: 4, screen: 'check'});
  }
  if (id === 'nolepanel') {
    panelBorder(b, 10, 10, PW, PH);
    drawNolePanel(b, 10, 10, f);
    panelLabel(b, 10, 10, PW, PH, 'NOLE', PAL.W7);
    micro(b, 'f' + f, 130, 10, PAL.N5);
  }
  return b;
};
