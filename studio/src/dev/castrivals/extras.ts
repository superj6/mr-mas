// MR. MAS — castrivals: extra model sheets (NOLE, MARIO, BOSSES, FREEZE). Pure functions -> 480x270.
import {Buf, W, H, rect, bayer} from '../pixeladv/core/px';
import {PAL, lum} from '../pixeladv/core/palette';
import {text, textWidth} from '../pixeladv/core/font';
import {Img, blitImg} from '../pixeladv/core/figure';
import {masStandImg, MAS_STAND_H} from '../pixeladv/art/mas';
import {noleImg as noleV1} from '../pixeladv/art/nole';
import {noleImg, NOLE_BASE, NOLE_FOOT, NolePose, nolePortraitImg, NOLE_PORTRAIT_REST, NolePortrait, drawNolePortrait, checkImg} from '../../shared/pixel/cast/nole';
import {marioImg, MARIO_BASE, MARIO_FOOT, MarioPose, marioPortraitImg, MARIO_PORTRAIT_REST, MarioPortrait, drawMarioPortrait, drawVault, drawScroll, drawDraft, VaultState} from '../../shared/pixel/cast/mario';
import {BOSSES, BOSS_LOOP, CX, DUSK, drawBoss, micro, microWidth, BossId} from '../../shared/pixel/cast/bosses';

const label = (b: Buf, s: string, x: number, y: number, c: number = PAL.N6) => text(b, s, x, y, c, {shadow: PAL.N0});
const box = (b: Buf, x: number, y: number, w: number, h: number) => {
  rect(x - 1, y - 1, w + 2, h + 2, b.ink(PAL.N0));
  rect(x - 2, y - 2, w + 4, 1, b.ink(PAL.N4));
  rect(x - 2, y + h + 1, w + 4, 1, b.ink(PAL.N3));
};
const blit2x = (b: Buf, img: Img, sx: number, sy: number, w: number, h: number, dx: number, dy: number, bg: number = PAL.N1) => {
  for (let y = 0; y < h * 2; y++)
    for (let x = 0; x < w * 2; x++) {
      const v = img.c[(sy + (y >> 1)) * img.w + sx + (x >> 1)];
      b.set(dx + x, dy + y, v >= 0 ? v : bg);
    }
};
/** opaque bounds of an image (for honest height labels) */
const bounds = (img: Img) => {
  let y0 = img.h, y1 = -1;
  for (let y = 0; y < img.h; y++) for (let x = 0; x < img.w; x++) if (img.c[y * img.w + x] >= 0) { y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
  return {y0, y1, h: y1 - y0 + 1};
};
const bufToImg = (src: Buf, x0: number, y0: number, w: number, h: number): Img => {
  const c = new Int32Array(w * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) c[y * w + x] = src.get(x0 + x, y0 + y);
  return {w, h, c};
};

// ================================================================== NOLE
export const extraNole = (): Buf => {
  const b = new Buf(W, H, PAL.N1);
  // lineup: Mas / Mario / Nole on a model-sheet grid
  const fy = 180;
  for (let y = fy; y > 20; y -= 10) rect(6, y, 146, 1, b.ink(y === fy ? PAL.N5 : PAL.N2));
  const mas = masStandImg(), mar = marioImg(MARIO_BASE), nol = noleImg(NOLE_BASE);
  blitImg(b, mas, 8, fy - MAS_STAND_H + 1);
  blitImg(b, mar, 42 - 10, fy - MARIO_FOOT[1] - 1);
  blitImg(b, nol, 78, fy - NOLE_FOOT[1] - 1);
  const hts = [bounds(mas).h, bounds(mar).h, bounds(nol).h];
  [['MAS', PAL.C7, 14], ['MARIO', PAL.C6, 44], ['NOLE', PAL.W7, 110]].forEach(([n, c, x], i) => {
    label(b, n as string, x as number, fy + 5, c as number);
    label(b, hts[i] + 'px', x as number, fy + 16, PAL.N5);
  });
  label(b, 'LINEUP', 8, 6, PAL.N7);
  rect(156, 0, 1, 270, b.ink(PAL.N3));
  // v1 -> v2
  label(b, 'NOLE v2  walk on 2s / doorway', 162, 6, PAL.W6);
  const np: NolePose = {...NOLE_BASE, arm: 'phone'};
  const row1: NolePose[] = [{...np, legs: 'w0'}, {...np, legs: 'w1'}, {...np, legs: 'w2'}, {...np, legs: 'w3'}, {...NOLE_BASE, legs: 'wide', light: 'sil'}];
  row1.forEach((p, i) => blitImg(b, noleImg(p), 150 + i * 62, 12));
  label(b, 'jab / jab2 / lean / raise / out of the hatch', 162, 110, PAL.W6);
  const row2: NolePose[] = [
    {...NOLE_BASE, arm: 'jab', lean: 3, mouth: 2, brow: 1}, {...NOLE_BASE, arm: 'jab2', lean: 3, mouth: 1, brow: 1},
    {...NOLE_BASE, arm: 'phone', lean: 4}, {...NOLE_BASE, arm: 'raise', lean: 1},
  ];
  row2.forEach((p, i) => blitImg(b, noleImg(p), 150 + i * 56, 116));
  // the hatch pose (no legs, check + phone up), shown with the check presented at chest height
  const hp: NolePose = {...NOLE_BASE, noLegs: true, arm: 'check', back: 'phoneUp', brow: 1, mouth: 1, lean: 5};
  const hx0 = 412;
  blitImg(b, noleImg(hp), hx0, 116);
  const ck = checkImg();
  const hh = hx0 + 17 - 5;
  blitImg(b, ck, hh - 25, 116 + 33 - 8);
  rect(156, 212, 324, 1, b.ink(PAL.N3)); rect(0, 210, 156, 1, b.ink(PAL.N3));
  // portrait parts
  label(b, 'PORTRAIT  mouths (4 = the smirk) / phone: post, check', 162, 216, PAL.W6);
  ([0, 1, 2, 3, 4] as const).forEach((m, i) => {
    const img = nolePortraitImg({...NOLE_PORTRAIT_REST, mouth: m, brow: 1});
    const x = 164 + i * 50, y = 230;
    box(b, x, y, 46, 30);
    blit2x(b, img, 30, 62, 23, 15, x, y);
  });
  (['post', 'check'] as const).forEach((sc, i) => {
    const img = nolePortraitImg({...NOLE_PORTRAIT_REST, screen: sc});
    const x = 420 + i * 28, y = 230;
    box(b, x, y, 24, 30);
    for (let yy = 0; yy < 30; yy++) for (let xx = 0; xx < 24; xx++) { const v = img.c[(56 + yy) * img.w + 4 + xx]; b.set(x + xx, y + yy, v >= 0 ? v : PAL.N1); }
  });
  // v1 -> v2, head + torso crops side by side
  const v1 = noleV1({legs: 'stand', arm: 'down', mouth: 0, lean: 0, light: 'lit', brow: 0});
  const v2 = noleImg(NOLE_BASE);
  for (let y = 0; y < 44; y++) for (let x = 0; x < 36; x++) {
    const a = v1.c[(y + 1) * v1.w + x + 18], c = v2.c[(y + 0) * v2.w + x + 22];
    b.set(8 + x, 222 + y, a >= 0 ? a : PAL.N1);
    b.set(48 + x, 222 + y, c >= 0 ? c : PAL.N1);
  }
  micro(b, 'V1', 8, 216, PAL.N5); micro(b, 'V2', 48, 216, PAL.W6);
  micro(b, 'V-TAPER, DELTOIDS', 90, 226, PAL.N6);
  micro(b, 'SLEEVES, ARMS', 90, 233, PAL.N6);
  micro(b, 'HAND-PIXELLED', 90, 240, PAL.N6);
  micro(b, 'HEAD, SQUARE JAW', 90, 247, PAL.N6);
  micro(b, 'PHONE GLOWS', 90, 254, PAL.N6);
  return b;
};

// ================================================================== MARIO
export const extraMario = (): Buf => {
  const b = new Buf(W, H, PAL.N1);
  // portrait + replacement parts
  const px = 8, py = 8;
  rect(px - 3, py - 3, 118, 142, b.ink(PAL.N0));
  drawMarioPortrait(b, px, py, {...MARIO_PORTRAIT_REST, mouth: 1, brow: 1});
  label(b, 'MOUTHS', 8, 150, PAL.C6);
  ([0, 1, 2, 3] as const).forEach((m, i) => {
    const img = marioPortraitImg({...MARIO_PORTRAIT_REST, mouth: m});
    const x = 8 + (i % 2) * 58, y = 162 + Math.floor(i / 2) * 26;
    box(b, x, y, 52, 22);
    blit2x(b, img, 67, 59, 26, 11, x, y);
  });
  label(b, 'LIDS / BROWS', 8, 216, PAL.C6);
  const lids: MarioPortrait[] = [{...MARIO_PORTRAIT_REST}, {...MARIO_PORTRAIT_REST, blink: 1}, {...MARIO_PORTRAIT_REST, blink: 2}, {...MARIO_PORTRAIT_REST, brow: 1}];
  lids.forEach((s, i) => {
    const img = marioPortraitImg(s);
    const x = 8 + i * 30, y = 228;
    box(b, x, y, 26, 34);
    for (let yy = 0; yy < 34; yy++) for (let xx = 0; xx < 26; xx++) { const v = img.c[(34 + (yy >> 1)) * img.w + 58 + (xx >> 1)]; b.set(x + xx, y + yy, v >= 0 ? v : PAL.N1); }
  });
  rect(128, 0, 1, 270, b.ink(PAL.N3));
  // sprites
  label(b, 'MARIO  stand / step / finger / + scroll / silhouette / fade', 134, 4, PAL.C6);
  const sp: MarioPose[] = [MARIO_BASE, {...MARIO_BASE, legs: 'step0'}, {...MARIO_BASE, legs: 'step1'}, {...MARIO_BASE, arm: 'chest', mouth: 1},
    {...MARIO_BASE, arm: 'raise', mouth: 1, brow: 1}, {...MARIO_BASE, arm: 'raise2', mouth: 2, brow: 1, scroll: true}, {...MARIO_BASE, light: 'sil'}, {...MARIO_BASE, light: 'fade', legs: 'step1'}];
  sp.forEach((p, i) => blitImg(b, marioImg(p), 120 + i * 44, 10));
  rect(128, 98, 352, 1, b.ink(PAL.N3));
  // vault drawings
  label(b, 'THE VAULT  4 held drawings, beacons on 3s, HUD ticks', 134, 102, PAL.C6);
  ([0, 1, 2, 3] as const).forEach((o, i) => {
    const t = new Buf(88, 96, PAL.N1);
    for (let y = 0; y < 96; y++) for (let x = 0; x < 88; x++) t.set(x, y, (x % 9 === 0) ? PAL.N1 : PAL.N2);
    const vs: VaultState = {open: o, f: i * 3, ticks: i};
    drawVault(t, 44, 54, vs);
    for (let y = 0; y < 96; y++) for (let x = 0; x < 88; x++) b.set(134 + i * 87 + x, 112 + y, t.get(x, y));
  });
  rect(128, 210, 352, 1, b.ink(PAL.N3));
  // scroll stages + DRAFT flutter
  label(b, 'THE SCROLL  unrolls in whole pixels / DRAFT sheet: 3 drawings', 134, 214, PAL.C6);
  [12, 40, 90, 150].forEach((len, i) => {
    const t = new Buf(80, 42, PAL.N1);
    rect(0, 34, 80, 8, t.ink(PAL.P0));
    drawScroll(t, 8, 2, 38, len, 78);
    for (let y = 0; y < 42; y++) for (let x = 0; x < 80; x++) b.set(134 + i * 72 + x - (i === 3 ? 0 : 0), 226 + y, t.get(x, y));
  });
  for (let k = 0; k < 3; k++) drawDraft(b, 430 + k * 12 - 70 + 70, 230 + k * 10, k);
  return b;
};

/** luminance -> ink / paper with ordered-dither mids: the two-tone world while a card holds */
export const freezeAt = (ink: number, paper: number) => (c: number, x: number, y: number) => {
  const l = lum(c);
  const t = l < 0.17 ? 0 : l < 0.3 ? 0.25 : l < 0.44 ? 0.5 : l < 0.6 ? 0.75 : 1;
  return t > bayer(x, y) ? paper : ink;
};
// ================================================================== BOSSES (2x hero + 1x loop steps)
const rampsCell = (b: Buf, x0: number, y0: number) => {
  label(b, 'DUSK RAMPS', x0 + 4, y0 + 3, PAL.W7);
  micro(b, 'TONES 0-5', x0 + 116 - microWidth('TONES 0-5'), y0 + 5, PAL.N6);
  const names = ['skin', 'hair', 'grey', 'navy', 'sweater', 'charcoal', 'tee', 'leather', 'fleece', 'blazer', 'gold', 'red', 'green', 'white'];
  names.forEach((n, i) => {
    const y = y0 + 16 + i * 8;
    micro(b, n.toUpperCase(), x0 + 4, y + 1, PAL.N6);
    DUSK[n].forEach((c, k) => rect(x0 + 52 + k * 10, y, 9, 7, b.ink(c)));
  });
};

const DUSK_STOPS = [PAL.N2, CX.U0, CX.U1, CX.U2, CX.U3, CX.U4, CX.U5, PAL.W5];
const duskBg = (t: Buf) => {
  for (let y = 0; y < t.h; y++) for (let x = 0; x < t.w; x++) {
    const v = (y / t.h) * (DUSK_STOPS.length - 1);
    const i = Math.floor(v), fr = v - i;
    t.set(x, y, DUSK_STOPS[Math.min(DUSK_STOPS.length - 1, fr > bayer(x, y) ? i + 1 : i)]);
  }
};
const bossCell = (id: BossId, f: number, w = 60, h = 52, map?: (c: number, x: number, y: number) => number) => {
  const t = new Buf(w, h, PAL.N1);
  duskBg(t);
  rect(0, h - 5, w, 5, t.ink(PAL.N2));
  rect(0, h - 5, w, 1, t.ink(PAL.W4));
  const foot: Record<BossId, number> = {tasya: 38, radnus: 30, simed: 46, kram: 36, nesnej: 34, misanthropic: 32, zai: 30};
  drawBoss(t, id, foot[id], h - 6, f);
  if (map) for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) t.c[y * w + x] = map(t.c[y * w + x], x, y);
  return t;
};
export const extraBosses = (): Buf => {
  const b = new Buf(W, H, PAL.N1);
  const cw = 120, ch = 135;
  const cells: Array<BossId | 'freeze'> = ['tasya', 'radnus', 'simed', 'kram', 'nesnej', 'misanthropic', 'zai', 'freeze'];
  cells.forEach((id, k) => {
    const x0 = (k % 4) * cw, y0 = Math.floor(k / 4) * ch;
    rect(x0, y0, cw, ch, b.ink(PAL.N1));
    rect(x0 + cw - 1, y0, 1, ch, b.ink(PAL.N3));
    rect(x0, y0 + ch - 1, cw, 1, b.ink(PAL.N3));
    if (id === 'freeze') { rampsCell(b, x0, y0); return; }
    const isF = false;
    const bid: BossId = id;
    const map = isF ? freezeAt(PAL.N2, PAL.P2) : undefined;
    const hero = bossCell(bid, isF ? 6 : ({tasya: 3, radnus: 8, simed: 6, kram: 4, nesnej: 6, misanthropic: 6, zai: 4} as Record<BossId, number>)[bid], 56, 46, map);
    for (let y = 0; y < 92; y++) for (let x = 0; x < 112; x++) b.set(x0 + 4 + x, y0 + 14 + y, hero.get(x >> 1, y >> 1));
    const bo = BOSSES.find((q) => q.id === bid)!;
    if (textWidth(bo.name) + microWidth(bo.roof) + 14 > cw) micro(b, bo.name, x0 + 4, y0 + 5, PAL.W7, PAL.N0);
    else label(b, bo.name, x0 + 4, y0 + 3, PAL.W7);
    micro(b, isF ? 'TWO-TONE CARD HOLD' : bo.roof, x0 + cw - 5 - microWidth(isF ? 'TWO-TONE CARD HOLD' : bo.roof), y0 + 5, PAL.N6);
    // the loop: 4 steps at 1x
    const loop = BOSS_LOOP[bid];
    for (let s = 0; s < 4; s++) {
      const c = bossCell(bid, isF ? s * 3 : Math.floor((s * loop) / 4), 56, 46, map);
      for (let y = 0; y < 26; y++) for (let x = 0; x < 27; x++) b.set(x0 + 4 + s * 28 + x, y0 + 108 + y, c.get(x + 14, y + 18));
    }
  });
  return b;
};

// ================================================================== FREEZE (name-card hold remap)
export const extraFreeze = (draw: {mario: (b: Buf, x: number, y: number, f: number) => void; nole: (b: Buf, x: number, y: number, f: number, o?: {noLedger?: boolean}) => void}): Buf => {
  const b = new Buf(W, H, PAL.N1);
  const PW = 108, PH = 158;
  const panels: Array<[string, number, (t: Buf) => void, ((c: number, x: number, y: number) => number) | null, number]> = [
    ['BASE', 0, (t) => draw.mario(t, 0, 0, 46), null, PAL.C7],
    ['FREEZE', 1, (t) => draw.mario(t, 0, 0, 46), freezeAt(CX.INK, 0xe9dcc0), 0xe9dcc0],
    ['BASE', 2, (t) => draw.nole(t, 0, 0, 31, {noLedger: true}), null, PAL.W7],
    ['FREEZE', 3, (t) => draw.nole(t, 0, 0, 31, {noLedger: true}), freezeAt(PAL.N2, PAL.P2), PAL.P2],
  ];
  label(b, 'NAME-CARD HOLD: the world drops to two tones on the downbeat. The cast art survives the remap.', 6, 4, PAL.N7);
  for (const [name, k, fn, map, acc] of panels) {
    const t = new Buf(PW, PH, PAL.N0);
    fn(t);
    const x0 = 8 + k * 118, y0 = 22;
    rect(x0 - 2, y0 - 2, PW + 4, PH + 4, b.ink(PAL.N0));
    for (let y = 0; y < PH; y++) for (let x = 0; x < PW; x++) { const c = t.get(x, y); b.set(x0 + x, y0 + y, map ? map(c, x, y) : c); }
    label(b, name, x0 + 3, y0 + PH + 5, acc);
  }
  // the card text itself (typeset by the title builder; shown here for scale against the art)
  const card = (x: number, y: number, name: string, sub: string, ink: number, paper: number, stamp?: string) => {
    rect(x, y, 108, 34, b.ink(paper));
    rect(x + 2, y + 2, 104, 30, b.ink(paper));
    text(b, name, x + 6, y + 5, ink);
    micro(b, sub, x + 6, y + 16, ink);
    if (stamp) { rect(x + 6, y + 23, microWidth(stamp) + 6, 9, b.ink(CX.Q2)); rect(x + 7, y + 24, microWidth(stamp) + 4, 7, b.ink(paper)); micro(b, stamp, x + 9, y + 25, CX.Q2); }
  };
  card(126, 206, 'MARIO', 'HAS CONCERNS. HAS GPUS.', CX.INK, 0xe9dcc0);
  card(362, 206, 'NOLE', 'NAMED IT.', PAL.N2, PAL.P2, 'SUED OVER IT.');
  micro(b, 'MARIO: PARCHMENT + INK BLUE (NEVER RED)', 8, 246, PAL.N6);
  micro(b, 'NOLE: NAVY + CREAM, ROCKET-RED STAMP', 244, 246, PAL.N6);
  void textWidth;
  return b;
};
