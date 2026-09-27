// MR. MAS — shared room: NELEH'S DESK (ROOM-NELEH-DESK; Ep1 Act Four v5 art pass; new file, owned by the v5 art pass).
// A set v4 never had: the board's side on Friday plays at her desk (sc 27, "INT. NELEH'S DESK — FRIDAY"). Three
// framings, each its own drawing (never a crop or a scale of another), all painted into the 480 x 203 room area:
//   drawNelehDeskOTS    [OTS] over her right shoulder onto her open laptop (S3.00a, S3.04): the laptop centre-left
//                       with its screen at 1:1 native (NDESK.screen, 284 x 152: draw the call into a Buf that size and
//                       pass it as `screen`), THE PLAN's blueprint on the desk in the left foreground with her pen
//                       resting on `1. NOON · VIDEO CALL` (steps 2-4 still under the fold), the charter, the window
//                       wall beyond. Her shoulder (cast/neleh-ots.ts) is drawn last, with the push's parallax.
//                       `push` 0..NDESK.pushMax: the slow whole-pixel push toward the laptop (the shoulder slides out
//                       right and down, the wall drifts a third as far the other way; nothing is scaled).
//   drawNelehBezel      [SCR] her laptop full frame (S3.01, S3.03, S3.05): the v4 bezel geometry (opening 456 x 177 at
//                       (12, 10), lay.ts bezel) so every v4 screen layout drops in, plus the desk in the bottom rows and
//                       the TIME OF DAY: 'day' (a cool window sheen on the lid) or 'evening' (S3.05: her desk lamp is on,
//                       a warm pool spills onto the bezel's upper left and the desk).
//   drawNelehDeskWall   [MCU] the soft back wall behind her close-up (S3.04b): her shelves (the same wall her webcam
//                       tile shows), a window strip at the left; already stepped down for focus (`soft`, default 2).
// Times: 'day' (Friday noon and afternoon) · 'evening' (Friday evening, the lamp on).
import {Buf, rect, line, poly, hash, bayer} from '../px';
import {PAL, stepColor} from '../palette';
import {MatBuf, resolve, defineMat} from '../light';
import {text, textWidth} from '../font';
import {drawNelehShoulderR, NelehOtsState, NELEH_OTS_DEFAULT} from '../cast/neleh-ots';

const RH = 203;
export type DeskTime = 'day' | 'evening';

defineMat('nd.wall', ['N0', 'N1', 'N2', 'N3', 'N4', 'N5', 'N6', 'N7'], ['N0', 'N1', 'N2', 'C0', 'C1', 'C2', 'C3', 'C4'], ['N0', 'N1', 'W0', 'W1', 'W2', 'W3', 'W4', 'W5']);
defineMat('nd.oak', ['N0', 'D0', 'D1', 'D2', 'D3', 'D4', 'N6', 'N7'], ['N0', 'D0', 'D1', 'C0', 'C1', 'C2', 'C4', 'C6'], ['N0', 'D0', 'D1', 'D2', 'D3', 'D4', 'W4', 'W6']);
defineMat('nd.bp', ['N1', 'F0', 'F1', 'F2', 'F2', 'F3', 'F3', 'F4'], ['N1', 'F1', 'F2', 'F3', 'F3', 'F4', 'F4', 'F5'], ['N1', 'F1', 'F2', 'F3', 'F3', 'F4', 'F4', 'F5']);
defineMat('nd.bpInk', ['N2', 'F3', 'F4', 'C3', 'C4', 'C5', 'C6', 'C7'], ['N2', 'F4', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8'], ['N2', 'F4', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8']);
defineMat('nd.paper', ['N1', 'N3', 'N5', 'P0', 'P0', 'P1', 'P1', 'P2'], ['N1', 'N2', 'C1', 'C2', 'C4', 'C6', 'C8', 'C9'], ['N1', 'W1', 'W2', 'W4', 'W6', 'W7', 'W8', 'W9']);
defineMat('nd.lid', ['N0', 'N1', 'G0', 'G1', 'G2', 'G3', 'G4', 'G5'], ['N0', 'N1', 'C0', 'C1', 'C2', 'C3', 'C4', 'C5'], ['N0', 'G0', 'W0', 'W1', 'W2', 'W3', 'W4', 'W5']);
defineMat('nd.books', ['N0', 'N1', 'D1', 'D2', 'U1', 'U2', 'N5', 'N6'], ['N0', 'N1', 'C0', 'C1', 'C2', 'C3', 'C4', 'C5'], ['N0', 'D0', 'D2', 'W1', 'W2', 'W3', 'W4', 'W5']);

/** geometry of the OTS setup (frame coords at push 0) */
export const NDESK = {
  /** the laptop's screen opening: draw the call at exactly this size (1:1 native) */
  screen: {x: 134, y: 14, w: 268, h: 150},
  lid: {x: 126, y: 7, w: 284, h: 164},
  deskY: 150,
  /** the blueprint's step 1 line (the pen rests on its tick position) */
  step1: {x: 6, y: 177},
  pushMax: 12,
};

// ------------------------------------------------------------------ the window wall (the OTS looks at the wall she faces)
const wallOTS = (mb: MatBuf, dx: number) => {
  rect(0, 0, 480, NDESK.deskY + 4, mb.mat('nd.wall', 0.4));
  // the window at the left: tall panes, blinds half down (their slats catch the day)
  const wx = 6 + dx, ww = 78;
  rect(wx - 3, 0, ww + 6, NDESK.deskY - 8, mb.mat('nd.wall', -1.2));
  rect(wx, 0, ww, NDESK.deskY - 12, mb.emit(PAL.G5));
  for (let y = 0; y < NDESK.deskY - 12; y++) for (let x = 0; x < ww; x++) {
    const X = wx + x;
    if (y < 64 && y % 4 < 2) mb.emit(y % 4 === 0 ? PAL.P1 : PAL.G6)(X, y); // the blinds
    else if (y >= 64) mb.emit(bayer(X, y) < 0.18 ? PAL.G6 : (y > 110 && bayer(X, y) < 0.5 ? PAL.G4 : PAL.G5))(X, y);
  }
  rect(wx + Math.floor(ww / 2), 0, 2, NDESK.deskY - 12, mb.emit(PAL.G3)); // the mullion
  rect(wx - 3, NDESK.deskY - 12, ww + 6, 3, mb.mat('nd.wall', 1.6)); // the sill
  // a framed print on the wall, right of the window (a plain diagram: nothing readable)
  rect(400 + dx, 22, 50, 38, mb.mat('nd.wall', -1.6)); rect(403 + dx, 25, 44, 32, mb.mat('nd.paper', 1));
  for (let j = 0; j < 4; j++) rect(408 + dx, 30 + j * 6, 30 - j * 5, 1, mb.mat('nd.paper', -0.6));
  // the wall's own light: the window washes the left, the right side falls off
  for (let y = 0; y < NDESK.deskY; y++) for (let x = 0; x < 480; x++) {
    const d = Math.abs(x - (45 + dx)) / 420;
    mb.shade(1.6 - d * 3.2 + (bayer(x, y) - 0.5) * 0.4)(x, y);
  }
};
// ------------------------------------------------------------------ the desk top, the blueprint, the charter
const deskTop = (mb: MatBuf) => {
  rect(0, NDESK.deskY, 480, RH - NDESK.deskY, mb.mat('nd.oak', 1.2));
  rect(0, NDESK.deskY, 480, 1, mb.mat('nd.oak', 2.4));
  for (let k = 0; k < 40; k++) { const y = NDESK.deskY + 3 + Math.floor(hash(k, 1, 77) * (RH - NDESK.deskY - 3)), x = Math.floor(hash(k, 2, 77) * 480); rect(x, y, 20 + Math.floor(hash(k, 3, 77) * 60), 1, mb.shade(-0.6)); }
  // the charter: a stapled stack behind the blueprint, near the window (its cover: CHARTER)
  const cx = 22, cy = NDESK.deskY + 3;
  rect(cx + 2, cy + 2, 60, 12, mb.shade(-1.4));
  rect(cx, cy, 60, 12, mb.mat('nd.paper', 3.2)); rect(cx + 1, cy + 11, 60, 1, mb.mat('nd.paper', 1.4));
  rect(cx + 3, cy + 1, 4, 1, mb.mat('nd.lid', 5));
  // the blueprint, unfolded, its near edge off frame; steps 2-4 still under the fold (a doubled paper edge)
  const q = [0, 168, 122, 164, 132, RH + 2, 0, RH + 2];
  poly(q.map((v, i) => v + (i % 2 ? 2 : 2)), mb.shade(-1.6));
  poly(q, mb.mat('nd.bp', 0.8));
  for (let y = 172; y < RH; y += 6) for (let x = 0; x < 124 + (y - 164) * 0.25; x++) if (x % 2 === 0) mb.mat('nd.bp', 2)(x, y);
  for (let x = 4; x < 130; x += 6) for (let y = 168; y < RH; y++) if (y % 2 === 0 && x < 122 + (y - 164) * 0.25) mb.mat('nd.bp', 2)(x, y);
  line(0, 170, 120, 166, mb.mat('nd.bpInk', 0.6));
  // the fold: the sheet doubles back under itself below step 1
  poly([0, 190, 128, 187, 130, 193, 0, 196], mb.mat('nd.bp', -0.4));
  line(0, 190, 128, 187, mb.mat('nd.bpInk', -0.2));
};
const textPx = (mb: MatBuf, s: string, x: number, y: number, mat: string, lvl: number) => {
  const t = new Buf(textWidth(s) + 2, 9, 0);
  text(t, s, 0, 0, 1);
  for (let j = 0; j < 9; j++) for (let i = 0; i < t.w; i++) if (t.c[j * t.w + i] === 1) mb.mat(mat, lvl)(x + i, y + j);
};

// ------------------------------------------------------------------ the laptop (lid, bezel, the deck toward us)
const laptopOTS = (mb: MatBuf) => {
  const L = NDESK.lid, S = NDESK.screen;
  rect(L.x + 3, L.y + 3, L.w, L.h, mb.shade(-1.6)); // its shadow on the wall
  rect(L.x, L.y, L.w, L.h, mb.mat('nd.lid', 2.2));
  rect(L.x, L.y, L.w, 1, mb.mat('nd.lid', 3.4));
  rect(L.x, L.y, 1, L.h, mb.mat('nd.lid', 2.8));
  rect(L.x + L.w - 1, L.y, 1, L.h, mb.mat('nd.lid', 1.2));
  rect(S.x - 1, S.y - 1, S.w + 2, S.h + 2, mb.mat('nd.lid', 0.4));
  rect(L.x + Math.floor(L.w / 2) - 2, L.y + 2, 4, 3, mb.emit(PAL.N0)); mb.emit(PAL.C3)(L.x + Math.floor(L.w / 2) - 1, L.y + 3);
  // the hinge and the deck coming toward us (a trapezoid, wider at the near edge), the keys as held rows
  const hy = L.y + L.h;
  rect(L.x + 6, hy, L.w - 12, 2, mb.mat('nd.lid', 0.6));
  poly([L.x + 4, hy + 2, L.x + L.w - 4, hy + 2, L.x + L.w + 8, RH + 1, L.x - 8, RH + 1], mb.mat('nd.lid', 2.6));
  line(L.x - 8, RH - 1, L.x + L.w + 8, RH - 1, mb.mat('nd.lid', 3.6));
  for (let r = 0; r < 3; r++) {
    const y = hy + 5 + r * 5, ind = 10 - r * 4;
    for (let x = L.x + ind; x < L.x + L.w - ind; x += 9) rect(x, y, 7, 3, mb.mat('nd.lid', 1.2));
  }
};

// ------------------------------------------------------------------ her pen, resting on step 1 (drawn in palette)
const penAt = (b: Buf, tx: number, ty: number) => {
  // a slim marker lying on the sheet: tip at (tx, ty), barrel running up-right, cap end
  for (let q = 0; q < 30; q++) {
    const x = tx + 2 + q, y = ty - Math.floor(q * 0.28);
    b.set(x + 1, y + 2, stepColor(b.get(x + 1, y + 2), -2)); // its shadow on the paper
  }
  for (let q = 0; q < 30; q++) {
    const x = tx + 2 + q, y = ty - Math.floor(q * 0.28);
    const band = q > 22 && q < 25;
    b.set(x, y, band ? PAL.P1 : PAL.W4); b.set(x, y + 1, band ? PAL.P0 : PAL.W3);
  }
  b.set(tx, ty + 1, PAL.N0); b.set(tx + 1, ty, PAL.G4); b.set(tx + 1, ty + 1, PAL.N1);
};

// ------------------------------------------------------------------ lights
const lightsFor = (time: DeskTime, lampX = 20, lampY = 120) => ({
  amb: (x: number, y: number) => (time === 'day' ? 3.4 : 1.6) - (y > NDESK.deskY ? 0 : 0) + (x < 100 && time === 'day' ? 0.6 : 0),
  // the screen's cool fill on the desk and the deck in front of it (strongest near the lid)
  cyan: (x: number, y: number) => {
    if (y < NDESK.deskY) return 0;
    const d = Math.hypot((x - 268) / 170, (y - 178) / 30);
    return Math.max(0, 0.6 - d * 0.6) * (time === 'day' ? 0.5 : 0.9);
  },
  warm: (x: number, y: number) => {
    if (time !== 'evening') return 0;
    const d = Math.hypot((x - lampX) / 260, (y - lampY) / 160);
    return Math.max(0, 0.95 - d);
  },
  dither: 0.8,
});

export interface NelehDeskOTSOpts {
  time?: DeskTime;
  /** the whole-pixel push, 0..NDESK.pushMax */
  push?: number;
  /** the laptop's screen content, NDESK.screen.w x NDESK.screen.h (1:1 native); null = a dark screen */
  screen?: Buf | null;
  /** her shoulder (cast/neleh-ots.ts); null = leave it out (the caller draws it) */
  neleh?: Partial<NelehOtsState> | null;
  /** the pen: 'step1' resting on the step (S3.00a), 'gone' (in her hand, off frame) */
  pen?: 'step1' | 'gone';
}
const plateCache = new Map<string, Buf>();
export const drawNelehDeskOTS = (b: Buf, f: number, o: NelehDeskOTSOpts = {}) => {
  const time = o.time ?? 'day', push = Math.max(0, Math.min(NDESK.pushMax, Math.round(o.push ?? 0)));
  const wallDx = -Math.floor(push / 3);
  const key = `${time}:${wallDx}`;
  let plate = plateCache.get(key);
  if (!plate) {
    const mb = new MatBuf(480, RH);
    wallOTS(mb, wallDx);
    deskTop(mb);
    textPx(mb, '1. NOON · VIDEO CALL', 6, 177, 'nd.bpInk', 1.6);
    textPx(mb, 'CHARTER', 28, NDESK.deskY + 4, 'nd.lid', 1.2);
    laptopOTS(mb);
    plate = new Buf(480, RH, PAL.N0);
    resolve(mb, lightsFor(time), plate);
    plateCache.set(key, plate);
    if (plateCache.size > 32) plateCache.delete(plateCache.keys().next().value as string);
  }
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.c[y * b.w + x] = plate.c[y * 480 + x];
  const S = NDESK.screen;
  if (o.screen) for (let y = 0; y < S.h; y++) for (let x = 0; x < S.w; x++) b.set(S.x + x, S.y + y, o.screen.get(x, y));
  else rect(S.x, S.y, S.w, S.h, b.ink(PAL.N0));
  if ((o.pen ?? 'step1') === 'step1') penAt(b, 6 + textWidth('1. NOON · VIDEO CALL') + 3, 181);
  if (o.neleh !== null) drawNelehShoulderR(b, 492 + Math.floor(push * 0.75), RH + Math.floor(push / 2), {...NELEH_OTS_DEFAULT, light: time === 'day' ? 'screen' : 'lamp', ...o.neleh}, f);
};

// ------------------------------------------------------------------ [SCR]: her laptop full frame
/**
 * The [SCR] bezel of HER laptop around a 456 x 177 screen (the v4 geometry: opening at (12, 10)), with the desk in
 * the bottom rows and the time of day. Draw the screen first with the v4 `putSCR` geometry or pass it here.
 */
export const drawNelehBezel = (b: Buf, screen: Buf | null, o: {time?: DeskTime} = {}) => {
  const time = o.time ?? 'day';
  if (screen) for (let y = 0; y < 177; y++) for (let x = 0; x < 456; x++) b.set(12 + x, 10 + y, screen.get(x, y));
  const c = PAL.G1, e = PAL.G2;
  rect(0, 0, 480, 10, b.ink(c)); rect(0, 0, 12, 188, b.ink(c)); rect(468, 0, 12, 188, b.ink(c)); rect(0, 187, 480, 9, b.ink(c));
  rect(12, 10, 456, 1, b.ink(e)); rect(12, 187, 456, 1, b.ink(e));
  rect(238, 3, 4, 4, b.ink(PAL.N0)); b.set(239, 4, PAL.C3);
  // the hinge, then her desk (oak) in the last rows under the deck's edge
  rect(0, 196, 480, 1, b.ink(PAL.G0));
  for (let y = 197; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, y === 197 ? PAL.D3 : bayer(x, y) < 0.2 ? PAL.D3 : PAL.D2);
  if (time === 'day') {
    // the window's sheen along the lid's top edge and a pale diagonal glint in its upper left corner
    for (let x = 0; x < 480; x++) if (bayer(x, 1) < 0.5) b.set(x, 1, PAL.G3);
    for (let k = 0; k < 9; k++) { b.set(2 + k, 8 - Math.floor(k * 0.7), PAL.G4); }
  } else {
    // evening: the lamp off frame at the upper left; its warm pool steps across the bezel and the desk
    for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) {
      const onBezel = y < 10 || x < 12 || x >= 468 || (y >= 187 && y < 197);
      const onDesk = y >= 197;
      if (!onBezel && !onDesk) continue;
      const d = Math.hypot(x / 300, (y + 40) / 190);
      const t = 1 - d + (bayer(x, y) - 0.5) * 0.18;
      if (t > 0.55) b.set(x, y, onDesk ? PAL.W4 : PAL.W2);
      else if (t > 0.35) b.set(x, y, onDesk ? PAL.W3 : PAL.W1);
      else if (t > 0.2) b.set(x, y, onDesk ? PAL.D3 : stepColor(b.get(x, y), 0) === PAL.G1 ? PAL.W0 : b.get(x, y));
    }
    rect(238, 3, 4, 4, b.ink(PAL.N0)); b.set(239, 4, PAL.C3);
  }
};

// ------------------------------------------------------------------ [MCU]: the soft back wall behind her
/** Her shelves (the wall her webcam shows), a window strip at the far left; stepped down `soft` rungs for focus. */
export const drawNelehDeskWall = (b: Buf, o: {time?: DeskTime; soft?: number} = {}) => {
  const time = o.time ?? 'day';
  const mb = new MatBuf(480, RH);
  rect(0, 0, 480, RH, mb.mat('nd.wall', 0.2));
  // the window strip at the left edge (day: bright; evening: dark blue)
  rect(0, 0, 38, RH, time === 'day' ? mb.emit(PAL.G5) : mb.mat('nd.wall', -1));
  if (time === 'day') for (let y = 0; y < RH; y++) for (let x = 0; x < 38; x++) if (y % 4 < 1 && y < 90) mb.emit(PAL.G6)(x, y);
  rect(38, 0, 5, RH, mb.mat('nd.wall', -1.4));
  // shelves: dark wood boards and rows of spines (hashed widths and heights), the way her tile shows them
  for (let r = 0; r < 4; r++) {
    const sy = 14 + r * 48;
    rect(46, sy + 38, 434, 4, mb.mat('nd.oak', 0.8));
    let x = 50;
    for (let k = 0; x < 476; k++) {
      const w = 4 + Math.floor(hash(k, r, 91) * 6), h = 24 + Math.floor(hash(k, r, 92) * 14);
      const lv = hash(k, r, 93) * 1.2 - 0.9;
      rect(x, sy + 38 - h, w, h, mb.mat(hash(k, r, 94) < 0.86 ? 'nd.books' : 'nd.paper', hash(k, r, 94) < 0.86 ? lv : lv - 1.2));
      if (hash(k, r, 95) < 0.3) rect(x, sy + 38 - h + 4, w, 1, mb.shade(1.2));
      x += w + (hash(k, r, 96) < 0.15 ? 6 : 1);
    }
  }
  const out = new Buf(480, RH, PAL.N0);
  resolve(mb, {
    amb: (x) => (time === 'day' ? 2.6 : 1.2) + Math.max(0, 1.2 - x / 160),
    cyan: () => 0,
    warm: (x, y) => (time === 'evening' ? Math.max(0, 0.8 - Math.hypot((x - 120) / 300, (y - 40) / 200)) : 0),
    dither: 0.8,
  }, out);
  const k = o.soft ?? 2;
  for (let i = 0; i < out.c.length; i++) out.c[i] = stepColor(out.c[i], -k);
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.c[y * b.w + x] = out.c[y * 480 + x];
};
