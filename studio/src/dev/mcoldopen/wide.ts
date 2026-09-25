// MR. MAS — mcoldopen: the WIDE. Mas's room, 1:36 AM, rebuilt as the reverse of the pixeladv room: the camera
// now sits across the desk, so Mas faces 3/4 FRONT (the castmas desk sprite), lit only by his monitor.
// Same geography as the medium: rack far left, shelf + clock over the monitor, the monitor on the desk's
// near-left turned toward him, his glass, the Orb at his far shoulder, the window + city behind him.
// Painted as (material, level) and lit by palette ramps (engine MatBuf/resolve), like the approved room.
import {Buf, rect, line, poly, ellipse, hash, bayer, clamp} from '../../shared/pixel/px';
import {PAL, lum} from '../../shared/pixel/palette';
import {MatBuf, resolve} from '../../shared/pixel/light';
import {drawMasDesk, MasDeskPose, MAS_DESK_EDGE, masDeskBack} from '../../shared/pixel/cast/mas';
import {Mask} from '../../shared/pixel/mask';
import {L1, L2, L1_KEYS, L2_KEYS, EV, typedCount} from './timeline';
import {drawOrb, orbBob} from './orb';
import {vignette} from './paint';

export const WIDE = {
  floorY: 182,
  win: {x0: 272, x1: 452, y0: 24, y1: 166},
  rack: {x0: 40, x1: 80, y0: 72},
  desk: {x0: 196, x1: 360, back: 178, front: 185, panel: 208, legs: 230},
  mas: [288, 178 - MAS_DESK_EDGE] as [number, number],
  mon: {x0: 216, y0: 144, w: 55, h: 34},
  glass: {x: 278, y: 170, w: 4, h: 13},
  orb: [347, 150] as [number, number],
  orbR: 6,
};

// ------------------------------------------------------------------ paint
const paintRoom = (f: number): MatBuf => {
  const mb = new MatBuf(480, 270);
  const {floorY, win, rack, desk} = WIDE;
  // far wall, crown, wainscot line, baseboard
  rect(0, 0, 480, floorY, mb.mat('wall', 0));
  rect(0, 0, 480, 5, mb.mat('black', 0));
  rect(0, 5, 480, 1, mb.mat('trim', 1));
  rect(0, 6, 480, 2, mb.mat('trim', 0));
  for (let y = 9; y < floorY - 6; y++) for (let x = 0; x < 480; x++) if (hash(x, y, 5) < 0.03) mb.shade(-0.5)(x, y);
  rect(0, floorY - 6, 480, 1, mb.mat('trim', 1));
  rect(0, floorY - 5, 480, 5, mb.mat('trim', 0));
  rect(0, floorY - 1, 480, 1, mb.mat('trim', -1.2));
  // floor: boards converging on the vanishing point, staggered ends, sheen
  rect(0, floorY, 480, 270 - floorY, mb.mat('floor', 0));
  const VP = [250, 10];
  for (let xw = -700; xw < 1300; xw += 22) {
    const x2 = VP[0] + ((xw - VP[0]) * (270 - VP[1])) / (floorY - VP[1]);
    line(xw, floorY, Math.round(x2), 270, mb.shade(-1.3));
  }
  for (let k = 0; k < 46; k++) {
    const y = floorY + 3 + Math.floor(hash(k, 2) * 94);
    rect(Math.floor(hash(k, 9) * 480), y, 6 + Math.floor((y - floorY) / 7), 1, mb.shade(-1));
  }
  for (let y = floorY; y < 270; y++) for (let x = 0; x < 480; x++) if (hash(x >> 2, y, 13) < 0.07) mb.shade(0.4)(x, y);

  // window + the city (emissive)
  rect(win.x0 - 5, win.y0 - 5, win.x1 - win.x0 + 11, win.y1 - win.y0 + 11, mb.mat('trim', 0.4));
  rect(win.x0 - 5, win.y0 - 5, win.x1 - win.x0 + 11, 1, mb.shade(1));
  rect(win.x0 - 1, win.y0 - 1, win.x1 - win.x0 + 3, win.y1 - win.y0 + 3, mb.mat('black', 0));
  for (let y = win.y0; y <= win.y1; y++)
    for (let x = win.x0; x <= win.x1; x++) {
      const t = (y - win.y0) / (win.y1 - win.y0) + (bayer(x, y) - 0.5) * 0.1;
      mb.emit(t < 0.4 ? PAL.N2 : t < 0.68 ? PAL.N3 : t < 0.9 ? PAL.N4 : PAL.N5)(x, y);
    }
  const W0 = win.x0, WH = win.y1 - win.y0;
  const far: Array<[number, number, number]> = [];
  for (let x = W0, k = 0; x < win.x1; k++) { const w = 5 + Math.floor(hash(k, 1) * 8); far.push([x, win.y0 + Math.round(WH * (x > 276 && x < 350 ? 0.62 + hash(k, 2) * 0.12 : 0.4 + hash(k, 2) * 0.28)), w]); x += w + 1 + Math.floor(hash(k, 3) * 3); }
  for (const [bx, top, w] of far) {
    rect(bx, top, Math.min(w, win.x1 - bx + 1), win.y1 - top + 1, mb.emit(PAL.N3));
    for (let j = top + 3; j < win.y1 - 1; j += 3) for (let i = bx + 1; i < Math.min(bx + w - 1, win.x1); i += 2) if (hash(i, j, bx) < 0.07) mb.emit(hash(j, i, 3) < 0.6 ? PAL.W4 : PAL.C4)(i, j);
  }
  // the spire (the future NOPEAI cathedral) — never explained
  const spx = W0 + 118, spy = win.y0 + Math.round(WH * 0.36);
  rect(spx - 4, spy, 9, win.y1 - spy, mb.emit(PAL.N3));
  poly([spx - 4, spy, spx + 5, spy, spx + 1, spy - 14], mb.emit(PAL.N3));
  line(spx, spy - 14, spx, spy - 20, mb.emit(PAL.N3));
  if (Math.floor(f / 12) % 2 === 0) mb.emit(PAL.C5)(spx, spy - 21);
  const near: Array<[number, number, number]> = [];
  for (let x = W0, k = 0; x < win.x1; k++) { const w = 9 + Math.floor(hash(k, 11) * 12); near.push([x, win.y0 + Math.round(WH * (x > 276 && x < 350 ? 0.86 + hash(k, 12) * 0.06 : 0.66 + hash(k, 12) * 0.2)), w]); x += w + Math.floor(hash(k, 13) * 4); }
  for (const [bx, top, w] of near) {
    rect(bx, top, Math.min(w, win.x1 - bx + 1), win.y1 - top + 1, mb.emit(PAL.N1));
    rect(bx, top, 1, win.y1 - top + 1, mb.emit(PAL.N2));
    for (let j = top + 2; j < win.y1 - 1; j += 2) for (let i = bx + 2; i < Math.min(bx + w - 1, win.x1); i += 2) if (hash(i, j, bx + 7) < 0.1) mb.emit(hash(j, i, 5) < 0.55 ? PAL.W5 : PAL.C4)(i, j);
  }
  if (Math.floor((f + 5) / 16) % 2 === 0) mb.emit(PAL.R3)(near[3][0] + 2, near[3][1] - 1);
  // mullions + sill
  rect(364, win.y0, 2, win.y1 - win.y0 + 1, mb.mat('trim', -0.2));
  rect(win.x0, 62, win.x1 - win.x0 + 1, 2, mb.mat('trim', -0.2));
  rect(win.x0 - 8, win.y1 + 5, win.x1 - win.x0 + 17, 2, mb.mat('trim', 1));
  rect(win.x0 - 7, win.y1 + 7, win.x1 - win.x0 + 15, 2, mb.mat('trim', -0.8));

  // the framed print over the rack corner: a log chart with a knee (a quiet rhyme with the screen)
  rect(104, 70, 42, 40, mb.mat('black', 0.4));
  rect(106, 72, 38, 36, mb.mat('paper', -1.3));
  line(109, 100, 130, 98, mb.mat('red', 0.8));
  for (let x = 130; x < 141; x++) mb.mat('red', 0.8)(x, Math.round(98 - Math.pow((x - 130) / 11, 1.8) * 22));
  rect(104, 70, 42, 1, mb.shade(1));

  // server rack on the far wall (left)
  rect(rack.x0, rack.y0, rack.x1 - rack.x0, floorY - rack.y0, mb.mat('black', 0));
  rect(rack.x0, rack.y0, rack.x1 - rack.x0, 1, mb.shade(1.4));
  rect(rack.x1 - 1, rack.y0 + 1, 1, floorY - rack.y0 - 1, mb.shade(1));
  for (let y = rack.y0 + 6; y < floorY - 6; y += 12) {
    rect(rack.x0 + 3, y, rack.x1 - rack.x0 - 6, 10, mb.mat('metal', -1.4));
    rect(rack.x0 + 3, y, rack.x1 - rack.x0 - 6, 1, mb.shade(0.8));
    for (let x = rack.x0 + 6; x < rack.x1 - 14; x += 2) mb.shade(-0.7)(x, y + 4);
  }

  // shelf over the monitor: books, the red clock, a plant
  const SY = 112;
  rect(166, SY, 96, 3, mb.mat('wood', 0.5));
  rect(166, SY, 96, 1, mb.shade(1));
  const books: Array<[number, number, string, number]> = [[172, 11, 'red', 0], [175, 9, 'paper', -1.5], [178, 12, 'wall', 0.8], [181, 10, 'red', -0.5], [184, 11, 'paper', -2], [187, 8, 'wood', 0.5]];
  for (const [bx, bh, bm, bl] of books) rect(bx, SY - bh, 3, bh, mb.mat(bm, bl));
  rect(226, SY - 9, 15, 9, mb.mat('black', 0.5));
  rect(226, SY - 9, 15, 1, mb.shade(1));
  const dig: Record<string, string[]> = {'1': ['.#', '##', '.#', '.#', '.#'], '3': ['##', '.#', '##', '.#', '##'], '6': ['##', '#.', '##', '##', '##']};
  const dd = (d: string, x: number) => dig[d].forEach((r, j) => [...r].forEach((c, i) => c === '#' && mb.emit(PAL.R3)(x + i, SY - 7 + j)));
  dd('1', 228); mb.emit(PAL.R2)(231, SY - 6); mb.emit(PAL.R2)(231, SY - 4); dd('3', 233); dd('6', 237);
  rect(248, SY - 5, 6, 5, mb.mat('red', -1));
  ellipse(251, SY - 7, 4, 2.5, mb.mat('plant', 0.5));

  // the desk: top (seen a little from above), front panel, legs, the dark under it
  rect(desk.x0, desk.back, desk.x1 - desk.x0, desk.front - desk.back + 1, mb.mat('wood', 0.8));
  rect(desk.x0, desk.front, desk.x1 - desk.x0, 1, mb.mat('wood', 1.6));
  rect(desk.x0, desk.front + 1, desk.x1 - desk.x0, desk.panel - desk.front - 1, mb.mat('wood', -1.3));
  rect(desk.x0, desk.front + 1, desk.x1 - desk.x0, 1, mb.shade(-1));
  // a drawer pedestal on his side, a modesty panel on the monitor's
  rect(desk.x1 - 58, desk.front + 3, 50, 9, mb.mat('wood', -1.1));
  rect(desk.x1 - 58, desk.front + 13, 50, 9, mb.mat('wood', -1.1));
  for (const yy of [desk.front + 3, desk.front + 13]) {
    rect(desk.x1 - 58, yy, 50, 1, mb.shade(0.7));
    rect(desk.x1 - 38, yy + 4, 10, 1, mb.mat('metal', -0.4));
  }
  rect(desk.x0 + 10, desk.front + 4, desk.x1 - desk.x0 - 76, 1, mb.shade(-0.6));
  rect(desk.x0 + 2, desk.panel, 5, desk.legs - desk.panel, mb.mat('wood', -1));
  rect(desk.x1 - 7, desk.panel, 5, desk.legs - desk.panel, mb.mat('wood', -1));
  rect(desk.x0 + 8, desk.panel, desk.x1 - desk.x0 - 16, desk.legs - desk.panel, mb.mat('black', -1));
  for (let x = desk.x0 - 6; x < desk.x1 + 10; x++) mb.shade(-1.6)(x, desk.legs + 1);
  rect(desk.x0 - 4, desk.legs, desk.x1 - desk.x0 + 8, 2, mb.shade(-1.2));

  // a pendant lamp over the desk, switched off: the monitor is the only light in the room
  line(252, 0, 252, 44, mb.mat('black', 0.6));
  poly([246, 44, 258, 44, 266, 58, 238, 58], mb.mat('metal', -0.8));
  rect(246, 44, 13, 1, mb.shade(0.8));
  rect(239, 57, 27, 1, mb.shade(1.6)); // its lip catches the screen from below
  rect(247, 58, 11, 1, mb.mat('paper', -1.2)); // the dead bulb

  // foreground: a dark plant at the lower left (depth), barely rim-lit
  const leaves: number[][] = [[0, 270, 8, 214, 30, 196, 26, 232, 12, 270], [10, 270, 44, 206, 70, 200, 52, 236, 26, 270], [0, 236, 0, 186, 18, 172, 20, 204], [30, 270, 62, 232, 90, 230, 66, 256, 44, 270]];
  for (const p of leaves) poly(p, mb.mat('plant', -1.5));
  rect(0, 252, 58, 18, mb.mat('black', -1));
  return mb;
};

const lights = () => {
  const {mon, win, floorY, desk} = WIDE;
  const mcx = mon.x0 + mon.w / 2, mcy = mon.y0 + mon.h / 2;
  return {
    amb: (x: number, y: number) => {
      let a = 2.05;
      // the window's cold spill on the wall around it
      const dw = Math.hypot((x - (win.x0 + win.x1) / 2) / 110, (y - (win.y0 + win.y1) / 2) / 90);
      if (y < floorY && dw < 1) a += (1 - dw) * 1.3;
      // window light on the floor: a mullion-split parallelogram falling toward camera-left
      const onDesk = x >= desk.x0 - 1 && x <= desk.x1 && y <= desk.legs + 1;
      if (!onDesk && y >= floorY + 4 && y < 262) {
        const t = (y - floorY - 4) / 90;
        const u = x - (324 - t * 70);
        const wpx = 120 + t * 30;
        if (u >= 0 && u < wpx) {
          const pane = u % (wpx / 2);
          const onSash = Math.abs(t * 90 - 30) < 2;
          if (pane > 3 && !onSash) a += 1.5 * (1 - t * 0.5);
        }
      }
      // the desk throws its dark on the floor behind it
      if (y > desk.legs - 20 && y < desk.legs + 6 && x > desk.x0 && x < desk.x1) a -= 0.8;
      // the monitor's pool lifts the whole wall around it by one rung (so the dark room and small Mas read)
      if (y < floorY) {
        const dm = Math.hypot((x - mcx - 30) / 175, (y - mcy + 10) / 95);
        if (dm < 1) a += Math.min(1, (1 - dm) * 1.8);
      }
      return a;
    },
    cyan: (x: number, y: number) => {
      const dx = x - mcx, dy = (y - mcy) * 1.2;
      const d = Math.hypot(dx, dy);
      // it faces him (right), so its light reaches further on his side
      const reach = dx > 0 ? 150 : 90;
      let L = Math.pow(clamp(1 - d / reach, 0, 1), 1.5);
      if (y < floorY) {
        // a halo on the far wall behind it
        const halo = clamp(1 - Math.hypot((x - mcx - 20) / 110, (y - mcy + 6) / 46), 0, 1);
        L = L * 0.5 + Math.pow(halo, 0.9) * 0.45;
      }
      // desk top between the screen and Mas: hottest
      if (y >= desk.back && y <= desk.front && x > mon.x0 && x < 360) L += 0.35 * clamp(1 - Math.abs(x - 290) / 90, 0, 1);
      // the desk's front panel faces the camera, away from the screen
      if (y > desk.front && y < desk.legs && x > desk.x0 && x < desk.x1) L *= 0.25;
      // the floor in front of the desk barely sees it
      if (y >= desk.legs) L *= 0.35;
      return L;
    },
    warm: () => 0,
    dither: 0.6,
  };
};

// ------------------------------------------------------------------ the monitor (seen small; content in shapes)
// Turned 3/4 toward him (he sits to its right): we see its near side edge and its face foreshortened to ~half its
// width, the right edge receding (a pixel shorter top and bottom). The post does not need to read in the wide.
const MON3Q = {x0: 224, x1: 250, yTop: 144, yBot: 178, recede: 3};
const drawWideMonitor = (b: Buf, f: number) => {
  const {x0, x1, yTop, yBot, recede} = MON3Q;
  const w = x1 - x0;
  const topAt = (x: number) => yTop + Math.round(((x - x0) / w) * recede);
  const botAt = (x: number) => yBot - Math.round(((x - x0) / w) * recede);
  // the near side of the casing (its depth), receding up-left, and the top surface catching the room
  for (let i = 1; i <= 5; i++) {
    const x = x0 - i;
    for (let y = yTop - Math.floor(i / 2); y <= yBot - 2 - Math.floor(i / 3); y++) b.set(x, y, i === 5 ? PAL.G0 : PAL.N0);
    b.set(x, yTop - Math.floor(i / 2), PAL.G1);
  }
  line(x0 - 5, yTop - 2, x0 - 5, yBot - 3, b.ink(PAL.G1));
  // bezel + screen (emissive), column by column: each column is one sample of the real screen's width
  const sw = 51, sh = 29; // the 'virtual' screen the shapes are authored on (the face-on wide monitor)
  const scr = new Buf(sw, sh, PAL.N1);
  for (let x = 0; x < sw; x += 2) scr.set(x, sh - 5, PAL.N2);
  const kx = 40, ky = sh - 7;
  for (let x = 0; x <= kx; x++) scr.set(x, ky + (x < 20 ? 1 : 0), PAL.C5);
  for (let k = 0; k < 9; k++) scr.set(kx + 1 + Math.floor(k / 2), ky - Math.round(Math.pow(k / 8, 1.7) * (sh - 9)) - 1, PAL.C6);
  scr.set(kx, ky, PAL.C8);
  rect(2, 2, 34, 13, scr.ink(PAL.N3)); rect(3, 3, 32, 11, scr.ink(PAL.N0));
  const n1 = typedCount(L1_KEYS, f), n2 = typedCount(L2_KEYS, f);
  const l1 = Math.round((n1 / L1.length) * 25), l2 = Math.round((n2 / L2.length) * 22);
  for (let i = 0; i < l1; i++) if (i % 5 !== 4 || i === 0) scr.set(5 + i, 5, PAL.P0);
  for (let i = 0; i < l2; i++) if (i % 6 !== 5 || i === 0) scr.set(5 + i, 8, PAL.P0);
  rect(29, 11, 5, 2, scr.ink(PAL.G5));
  for (let x = x0; x <= x1; x++) {
    const t0 = topAt(x), t1 = botAt(x);
    for (let y = t0; y <= t1; y++) b.set(x, y, PAL.N1);
    b.set(x, t0, PAL.G1); // bezel top catches the room
    if (x < x0 + 1 || x > x1 - 1) continue;
    // the screen inside a 1px bezel: sample the brightest source pixel of this column's slice (thin lines survive)
    const u0 = Math.floor(((x - x0 - 1) / (w - 1)) * sw), u1 = Math.max(u0 + 1, Math.floor(((x - x0) / (w - 1)) * sw));
    const s0 = t0 + 1, s1 = t1 - 3;
    for (let y = s0; y <= s1; y++) {
      const v = Math.min(sh - 1, Math.floor(((y - s0) / Math.max(1, s1 - s0)) * sh));
      let best = PAL.N1, bl = -1;
      for (let u = u0; u < Math.min(sw, u1); u++) { const c = scr.c[v * sw + u]; const l = lum(c); if (l > bl) { bl = l; best = c; } }
      b.set(x, y, best);
    }
  }
  // the stand: a short neck and a foot turned with it
  const nx = Math.round((x0 + x1) / 2) - 2;
  rect(nx, yBot - 1, 5, 4, b.ink(PAL.G0)); rect(nx, yBot - 1, 1, 4, b.ink(PAL.C2));
  rect(nx - 7, yBot + 3, 17, 2, b.ink(PAL.G1)); rect(nx - 7, yBot + 3, 17, 1, b.ink(PAL.C3));
};

const drawWideGlass = (b: Buf) => {
  const {x, y, w, h} = WIDE.glass;
  for (let j = 0; j < h; j++) {
    b.set(x, y + j, PAL.C5);
    b.set(x + w - 1, y + j, PAL.C2);
    if (j > 3) for (let i = 1; i < w - 1; i++) b.set(x + i, y + j, i === 1 ? PAL.C3 : PAL.C1);
  }
  b.set(x + 1, y + 4, PAL.C7); b.set(x + 2, y + 4, PAL.C5);
  for (let i = 0; i < w; i++) b.set(x + i, y + h, PAL.C4);
  b.set(x + w, y + h, PAL.N0); b.set(x + w + 1, y + h, PAL.N0);
};

// ------------------------------------------------------------------ Mas's acting in the wide
export const masDeskAt = (f: number): MasDeskPose => {
  const typing = [...L1_KEYS, ...L2_KEYS].some((k) => f >= k - 1 && f <= k);
  const head = f >= EV.eyeSnap ? 'camera' : f === EV.eyeSnap - 1 ? 'turn' : 'screen';
  return {
    head, type: typing ? ((1 + (Math.floor(f / 2) % 3)) as 1 | 2 | 3) : 0,
    lid: f === EV.blink + 1 ? 2 : f === EV.blink || f === EV.blink + 2 ? 1 : 0,
    look: head === 'screen' ? -1 : 0,
    mouth: f >= EV.smile ? 'smile' : 'rest', breathe: Math.floor(f / 20) % 2 === 0 ? 0 : 1, light: 'orb',
  };
};

export interface WideOut { masMask?: Mask; orbMask?: Mask; scanning?: boolean }

let roomCache: {f: number; buf: Buf} | null = null;
export const drawWide = (b: Buf, f: number, o: WideOut = {}) => {
  // the room only changes with the city/blinks: cache per frame
  if (!roomCache || roomCache.f !== f) {
    const rb = new Buf(480, 270, PAL.N0);
    resolve(paintRoom(f), lights(), rb, 0);
    roomCache = {f, buf: rb};
  }
  b.c.set(roomCache.buf.c);
  // rack LEDs (emissive, on eighth notes)
  const {rack} = WIDE;
  const eighth = Math.floor((f * 2) / 15);
  for (let k = 0, y = rack.y0 + 8; y < WIDE.floorY - 8; y += 12, k++) {
    b.set(rack.x1 - 10, y + 2, PAL.C4);
    b.set(rack.x1 - 7, y + 2, k % 2 ? PAL.C3 : PAL.L2);
    if (k === 1 || k === 4 || k === 6) b.set(rack.x1 - 10, y + 6, (eighth + k) % 3 !== 0 ? PAL.R3 : PAL.R0);
  }
  // Mas (back layer, the desk top between, then his forearms + keyboard)
  const pose = masDeskAt(f);
  const [mx, my] = WIDE.mas;
  drawMasDesk(b, mx, my, pose);
  if (o.masMask) o.masMask.addImg(masDeskBack(pose), mx, my);
  // the Orb at his far shoulder
  const [ox, oy] = WIDE.orb;
  const look: [number, number] = f >= EV.irisTurn + 1 ? [0, 0] : [-0.62, 0.12];
  drawOrb(b, ox, oy + orbBob(f), WIDE.orbR, {look, aperture: o.scanning ? 1 : 0.5, scanning: o.scanning, monitor: -1}, o.orbMask?.a);
  drawWideGlass(b);
  drawWideMonitor(b, f);
  vignette(b);
  return b;
};
