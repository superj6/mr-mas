// MR. MAS — meras: 1993. Kid Mas (8) at a beige no-logo computer, in native 1-BIT, 3:2 pillarbox.
// Night room lit only by the screen, which faces away from us: the computer is a dark box with a glowing
// rim, the kid's face is the brightest thing in frame. The staircase line (the show's curve) climbs out of
// the glow onto the wall. At 3.2 the world greys out (System 7 "disabled") and becomes an alert dialog —
// his name card. Only the kid stays live.
import {Buf, rect, line, ellipse} from '../../shared/pixel/px';
import {bigText, text, textWidth, bigTextWidth, BIG_CAP} from '../../shared/pixel/font';
import {INK, PAPER, LV, PATS, Pat, fillRect, fillPoly, fillEll, pool, paintBits, greyOut, invertRect, inkLine, paperLine, pp} from './bit';
import {drawKidBack, drawKidFront, KidHead, KID_W} from './kid93';
import {T} from './timeline';
import {eraStamp, ERA_STAMP} from '../../shared/pixel/cast/era';

/** 3:2 pillarbox (the 512x342 era), native x range */
export const PB = {x0: 38, x1: 442};
export const KID_AT: [number, number] = [265, 69];
const DESK_FAR = 212, DESK_NEAR = 248, DESK_FRONT = 258;

// ------------------------------------------------------------------ the curve (a staircase in 1-bit)
/** vertices of the staircase line: flats shrink, rises grow (exponential in steps) */
export const STAIR: Array<[number, number]> = [
  [162, 93], [198, 93], [198, 90], [226, 90], [226, 86], [247, 86], [247, 80], [263, 80], [263, 72], [275, 72], [275, 61], [284, 61], [284, 46], [291, 46], [291, 26], [296, 26], [296, 0],
];
/** how many segments are drawn at global frame g (grows on fours) */
const stairSegs = (g: number) => (g < T.y93 ? 0 : Math.min(STAIR.length - 1, 5 + Math.floor((g - T.y93) / 4) * 3));
/** the tip (end of the last drawn segment) */
export const stairTip = (g: number): [number, number] => STAIR[Math.max(1, stairSegs(g))];

const drawStair = (b: Buf, g: number, segs = stairSegs(g)) => {
  // cased line: ink either side, paper core (reads on any of the wall patterns)
  for (let k = 0; k < segs; k++) {
    const [x0, y0] = STAIR[k], [x1, y1] = STAIR[k + 1];
    if (y0 === y1) { rect(Math.min(x0, x1) - 1, y0 - 1, Math.abs(x1 - x0) + 3, 3, b.ink(INK)); }
    else { rect(x0 - 1, Math.min(y0, y1) - 1, 3, Math.abs(y1 - y0) + 3, b.ink(INK)); }
  }
  for (let k = 0; k < segs; k++) {
    const [x0, y0] = STAIR[k], [x1, y1] = STAIR[k + 1];
    paperLine(b, x0, y0, x1, y1);
  }
  // the origin glows out of the rim of the computer
  const [ox, oy] = STAIR[0];
  rect(ox - 1, oy - 1, 2, 3, b.ink(PAPER));
};

// ------------------------------------------------------------------ room
const wall = (b: Buf) => {
  // night wall; the screen's spill lands behind the kid (he sits in it), falling off left and down
  // ONE bounded pattern pool (the spill behind him, hard-edged), the rest of the wall is night ink
  pool(b, PB.x0, 0, PB.x1 - PB.x0, DESK_FAR, 330, 112, 150, 118, (d) => (d < 0.6 ? 3 : d < 1 ? 2 : 0));
  rect(PB.x0, DESK_FAR - 2, PB.x1 - PB.x0, 2, b.ink(INK));
};

const windowBlinds = (b: Buf) => {
  const x = 60, y = 18, w = 70, h = 62;
  rect(x - 3, y - 3, w + 6, h + 6, b.ink(INK));
  fillRect(b, x - 2, y - 2, w + 4, 2, LV[2]);
  fillRect(b, x - 2, y - 2, 2, h + 4, LV[2]);
  rect(x, y, w, h, b.ink(INK));
  for (let i = 0; i < 14; i++) { const sx = x + ((i * 37) % w), sy = y + ((i * 23 + 7) % h); b.set(sx, sy, PAPER); }
  fillEll(b, x + 52, y + 12, 5, 5, LV[8]);
  fillEll(b, x + 55, y + 10, 5, 5, LV[0]);
  // blinds, tilted open: each slat's edge catches the moon, dimly
  for (let sy = y + 2; sy < y + h - 1; sy += 5) {
    fillRect(b, x, sy, w, 1, LV[4]);
    fillRect(b, x, sy + 1, w, 1, LV[2]);
    rect(x, sy + 2, w, 1, b.ink(INK));
  }
  line(x + w - 7, y, x + w - 7, y + h + 10, b.ink(PAPER));
  rect(x + w - 8, y + h + 10, 3, 3, b.ink(PAPER));
  fillRect(b, x - 6, y + h + 2, w + 12, 3, LV[2]);
};

const poster = (b: Buf) => {
  // a kid's rocket poster, pinned slightly crooked (drawn crooked, never rotated): night sky, a few stars, a
  // proper rocket — nose cone, straight body with a porthole, two swept fins, and its flame
  const x = 378, y = 16, w = 50, h = 68;
  fillPoly(b, [x, y + 1, x + w, y, x + w + 1, y + h, x + 1, y + h + 1], LV[1]);
  // the poster's white border (a printed margin), so the sheet reads on the night wall
  paperLine(b, x, y + 1, x + w, y); paperLine(b, x + w, y, x + w + 1, y + h); paperLine(b, x + w + 1, y + h, x + 1, y + h + 1); paperLine(b, x + 1, y + h + 1, x, y + 1);
  paperLine(b, x + 1, y + 2, x + w - 1, y + 1); paperLine(b, x + 2, y + h, x + w, y + h - 1);
  for (const [sx, sy] of [[x + 6, y + 8], [x + 41, y + 14], [x + 9, y + 50], [x + 44, y + 45], [x + 38, y + 60]]) b.set(sx, sy, PAPER);
  const cx = x + 25;
  // body: paper with an ink keyline and a 50% shade side
  fillPoly(b, [cx - 6, y + 22, cx + 6, y + 22, cx + 6, y + 48, cx - 6, y + 48], LV[8]);
  fillRect(b, cx + 3, y + 22, 3, 26, LV[4]);
  // nose cone: a pointed ogive on top of the body
  fillPoly(b, [cx - 6, y + 22, cx, y + 7, cx + 6, y + 22], LV[8]);
  fillPoly(b, [cx + 1, y + 10, cx + 6, y + 22, cx + 3, y + 22], LV[4]);
  inkLine(b, cx - 6, y + 22, cx, y + 7); inkLine(b, cx, y + 7, cx + 6, y + 22);
  inkLine(b, cx - 7, y + 22, cx - 7, y + 48); inkLine(b, cx + 7, y + 22, cx + 7, y + 48);
  inkLine(b, cx - 6, y + 22, cx + 6, y + 22);
  // porthole: an ink ring with a paper glint
  fillEll(b, cx, y + 31, 3.2, 3.2, LV[0]);
  fillEll(b, cx, y + 31, 1.8, 1.8, LV[4]);
  b.set(cx - 1, y + 30, PAPER);
  // fins: swept back, solid ink with a paper edge
  fillPoly(b, [cx - 7, y + 38, cx - 14, y + 50, cx - 14, y + 53, cx - 7, y + 48], LV[8]);
  fillPoly(b, [cx + 7, y + 38, cx + 14, y + 50, cx + 14, y + 53, cx + 7, y + 48], LV[4]);
  paperLine(b, cx - 8, y + 40, cx - 14, y + 50); paperLine(b, cx + 8, y + 40, cx + 14, y + 50);
  // the nozzle and the flame
  fillRect(b, cx - 4, y + 48, 9, 2, LV[3]);
  fillPoly(b, [cx - 4, y + 50, cx + 4, y + 50, cx + 2, y + 58, cx, y + 64, cx - 2, y + 58], LV[8]);
  fillPoly(b, [cx - 2, y + 51, cx + 2, y + 51, cx, y + 57], LV[5]);
  b.set(x + 3, y + 3, PAPER); b.set(x + w - 3, y + 2, PAPER);
};

const desk = (b: Buf) => {
  // desk top: wood grain, lit only in front of the screen
  for (let y = DESK_FAR; y < DESK_NEAR; y++)
    for (let x = PB.x0; x < PB.x1; x++) {
      const d = Math.hypot((x - 318) / 120, (y - DESK_FAR - 6) / 34);
      const k = d < 0.55 ? 6 : d < 1.05 ? 3 : 0; // bounded: the lit pool in front of the screen, its rim, then night
      let ink = LV[k](x, y);
      if (k >= 3 && PATS.grain(x, y)) ink = true;
      b.set(x, y, ink ? INK : PAPER);
    }
  for (let x = PB.x0; x < PB.x1; x++) b.set(x, DESK_NEAR, Math.abs(x - 318) < 110 && (x & 1) ? PAPER : INK);
  fillRect(b, PB.x0, DESK_NEAR + 1, PB.x1 - PB.x0, DESK_FRONT - DESK_NEAR - 1, LV[1]);
  rect(PB.x0, DESK_FRONT, PB.x1 - PB.x0, 270 - DESK_FRONT, b.ink(INK));
};

// the compact computer, from behind: no logo. A dark box with a glowing rim where the screen's light wraps.
export const CPU = {back: [138, 104, 246, 98, 248, 240, 140, 244], side: [246, 98, 266, 108, 266, 234, 248, 240]};
const computer = (b: Buf) => {
  const [x0, y0, x1, y1] = CPU.back;
  const topY = (x: number) => (x < x1 ? y0 + ((y1 - y0) * (x - x0)) / (x1 - x0) : y1 + ((108 - y1) * (x - x1)) / 20);
  // a thin corona where the light wraps over the top
  for (let x = x0; x < 266; x++) for (let k = 1; k <= 2; k++) { const yy = Math.round(topY(x)) - k; if (!LV[k === 1 ? 5 : 3](x, yy)) b.set(x, yy, PAPER); }
  // the beige case, from behind: its back panel reads WHITE (1-bit beige) with a keyline; the side face is 50%
  fillPoly(b, CPU.back, LV[7]);
  fillPoly(b, CPU.side, LV[4]);
  // shading on the back panel: one hard band down its far (camera-right) edge, turning away from the moon
  fillPoly(b, [224, 99, 246, 98, 248, 240, 226, 241], LV[5]);
  // keyline around the back
  const [bx0, by0, bx1, by1, bx2, by2, bx3, by3] = CPU.back;
  inkLine(b, bx0, by0, bx1, by1); inkLine(b, bx1, by1, bx2, by2); inkLine(b, bx2, by2, bx3, by3); inkLine(b, bx3, by3, bx0, by0);
  // handle recess: a dark slot with a paper lip under it
  for (let x = 166; x < 222; x++) { const yy = 121 - Math.round(((x - 164) / 58) * 3); b.set(x, yy, INK); b.set(x, yy + 1, INK); b.set(x, yy + 2, PAPER); }
  // vents: ten ink slots across the back
  for (let k = 0; k < 10; k++) {
    const y = 140 + k * 5;
    for (let x = 156; x < 226; x++) { const yy = y - Math.round(((x - 138) / 108) * 4); b.set(x, yy, INK); if ((x & 3) === 0) b.set(x, yy + 1, INK); }
  }
  // port panel and the power switch: ink sockets on the white back
  for (const [px, pw] of [[156, 12], [172, 7], [184, 16], [206, 9]] as const) { rect(px, 216, pw, 4, b.ink(INK)); for (let x = px + 1; x < px + pw - 1; x += 2) b.set(x, 217, PAPER); }
  rect(230, 214, 5, 8, b.ink(INK)); rect(231, 215, 3, 3, b.ink(PAPER));
  // the power cord drops off the back
  inkLine(b, 190, 224, 188, 244);
  // side face edge
  for (let y = 110; y < 234; y += 2) b.set(247, y, PAPER);
  // the far edge: the screen's light spills round it — a hot rim, then a short halo toward the kid
  line(266, 108, 266, 234, b.ink(PAPER));
  line(265, 109, 265, 233, b.ink(PAPER));
  for (let y = 106; y < 236; y++) for (let k = 1; k < 7; k++) { const x = 266 + k; const lv = Math.max(4, 8 - k); if (!LV[lv](x, y)) b.set(x, y, PAPER); }
};

const keyboard = (b: Buf) => {
  // in front of the screen, between it and the kid: lit hard
  const kx = 268, ky = 216;
  fillPoly(b, [kx, ky, kx + 48, ky - 3, kx + 54, ky + 12, kx + 4, ky + 16], LV[6]);
  inkLine(b, kx, ky, kx + 48, ky - 3); inkLine(b, kx + 48, ky - 3, kx + 54, ky + 12); inkLine(b, kx + 54, ky + 12, kx + 4, ky + 16); inkLine(b, kx, ky, kx + 4, ky + 16);
  for (let r = 0; r < 4; r++) for (let c = 0; c < 11; c++) { const x = kx + 3 + c * 4 + r, y = ky + 2 + r * 3 - Math.round(c * 0.25); b.set(x, y + 1, INK); b.set(x + 1, y + 1, INK); }
};

const mouse = (b: Buf) => {
  const mx = 398, my = 218;
  fillPoly(b, [mx, my + 2, mx + 13, my, mx + 17, my + 12, mx + 2, my + 14], LV[6]);
  inkLine(b, mx, my + 2, mx + 13, my); inkLine(b, mx + 13, my, mx + 17, my + 12); inkLine(b, mx + 17, my + 12, mx + 2, my + 14); inkLine(b, mx + 2, my + 14, mx, my + 2);
  inkLine(b, mx + 1, my + 5, mx + 14, my + 3);
  // the cord runs back to the computer behind the keyboard
  const cab: Array<[number, number]> = [[mx + 6, my], [mx - 4, my - 4], [360, 214], [326, 213]];
  for (let i = 0; i + 1 < cab.length; i++) inkLine(b, cab[i][0], cab[i][1], cab[i + 1][0], cab[i + 1][1]);
};

const floppies = (b: Buf) => {
  // a small stack of 3.5" disks at the far left, barely lit
  for (let k = 0; k < 3; k++) {
    const x = 70 + k, y = 232 - k * 3;
    fillRect(b, x, y, 32, 3, LV[k === 2 ? 3 : 2]);
    rect(x, y, 32, 1, b.ink(INK));
  }
  fillRect(b, 80, 226, 12, 2, LV[4]);
};

// ------------------------------------------------------------------ year slate
/** the shared era stamp (same face, size and corner as 2014 and 2015), rendered 1-bit: it sits on the bar */
const slate93 = (b: Buf, g: number) => eraStamp(b, '1993', g - T.y93, {text: PAPER, plate: INK, rule: PAPER});

// ------------------------------------------------------------------ the alert (his name card)
export const DLG = {x: 50, y: 70, w: 244, h: 96};
const BTN = {w: 56, h: 18};
export const btnRect = (which: 'ok' | 'cancel'): [number, number, number, number] => {
  const bx = DLG.x + DLG.w - 18 - BTN.w - (which === 'cancel' ? BTN.w + 16 : 0);
  return [bx, DLG.y + DLG.h - 12 - BTN.h, BTN.w, BTN.h];
};

const roundRect = (b: Buf, x: number, y: number, w: number, h: number, r: number, col: number) => {
  // 1px rounded outline (r = 2 or 3), classic Mac button
  for (let i = r; i < w - r; i++) { b.set(x + i, y, col); b.set(x + i, y + h - 1, col); }
  for (let j = r; j < h - r; j++) { b.set(x, y + j, col); b.set(x + w - 1, y + j, col); }
  const c = r === 3 ? [[1, 2], [2, 1]] : [[1, 1]];
  for (const [dx, dy] of c) { b.set(x + dx, y + dy, col); b.set(x + w - 1 - dx, y + dy, col); b.set(x + dx, y + h - 1 - dy, col); b.set(x + w - 1 - dx, y + h - 1 - dy, col); }
};

/** 32x32 1-bit Orb icon: a chrome sphere with an iris — the machine, already in 1993. */
const orbIcon = (b: Buf, x: number, y: number) => {
  const cx = x + 16, cy = y + 16, r = 13.5;
  for (let j = 0; j < 32; j++)
    for (let i = 0; i < 32; i++) {
      const dx = (i + 0.5 - 16) / r, dy = (j + 0.5 - 16) / r;
      const d2 = dx * dx + dy * dy;
      if (d2 > 1) continue;
      const nz = Math.sqrt(1 - d2);
      const v = Math.max(0, -0.55 * dx - 0.6 * dy + 0.58 * nz);
      const k = v > 0.8 ? 8 : v > 0.62 ? 6 : v > 0.45 ? 5 : v > 0.3 ? 4 : v > 0.15 ? 3 : 2;
      b.set(x + i, y + j, LV[k](x + i, y + j) ? INK : PAPER);
    }
  // contour
  for (let a = 0; a < 360; a += 2) { const t = (a * Math.PI) / 180; b.set(Math.round(cx - 0.5 + Math.cos(t) * r), Math.round(cy - 0.5 + Math.sin(t) * r), INK); }
  // the iris looks at us
  ellipse(cx + 1, cy + 1, 6.5, 6.5, b.ink(INK));
  ellipse(cx + 1, cy + 1, 5, 5, pp(b, LV[4]));
  ellipse(cx + 1, cy + 1, 3, 3, b.ink(INK));
  rect(cx - 2, cy - 2, 2, 2, b.ink(PAPER));
  b.set(cx + 3, cy + 3, PAPER);
};

export interface DialogState {
  /** frames since the dialog fully opened */
  okDown: boolean;
}
export const drawDialog = (b: Buf, s: DialogState) => {
  const {x, y, w, h} = DLG;
  // hard shadow, frame: outer ink, paper gap, 2px ink (the modal double border)
  rect(x + 3, y + 3, w, h, b.ink(INK));
  rect(x, y, w, h, b.ink(INK));
  rect(x + 1, y + 1, w - 2, h - 2, b.ink(PAPER));
  // title bar: a generic 50% dither band with the title in a knock-out box (an original dialog: no pinstripes,
  // nothing that hand-matches a real OS, guardrails §5)
  const tb = 12;
  for (let j = 2; j < tb - 1; j++) for (let i = 3; i < w - 3; i++) if ((x + i + y + 1 + j) & 1) b.set(x + i, y + 1 + j, INK);
  const title = 'age 8';
  const tw = textWidth(title) + 10;
  rect(x + Math.round((w - tw) / 2), y + 2, tw, tb - 2, b.ink(PAPER));
  text(b, title, x + Math.round((w - tw) / 2) + 5, y + 3, INK);
  rect(x, y + tb + 1, w, 1, b.ink(INK));
  // content
  orbIcon(b, x + 14, y + tb + 12);
  bigText(b, 'MAS MANALT', x + 58, y + tb + 12, INK);
  rect(x + 58, y + tb + 12 + BIG_CAP + 3, bigTextWidth('MAS MANALT'), 1, b.ink(INK));
  text(b, 'no equity.', x + 58, y + tb + 12 + BIG_CAP + 9, INK);
  // buttons: Cancel greyed out (System 7: 50% text and frame), OK default (thick ring)
  const [cx, cy, cw, ch] = btnRect('cancel');
  roundRect(b, cx, cy, cw, ch, 3, INK);
  for (let i = 0; i < cw; i++) for (const j of [0, ch - 1]) if ((cx + i + cy + j) & 1) b.set(cx + i, cy + j, PAPER);
  for (let j = 0; j < ch; j++) for (const i of [0, cw - 1]) if ((cx + i + cy + j) & 1) b.set(cx + i, cy + j, PAPER);
  const lab = 'Cancel';
  const tmp = new Buf(cw, 10, PAPER);
  text(tmp, lab, Math.round((cw - textWidth(lab)) / 2), 0, INK);
  for (let j = 0; j < 10; j++) for (let i = 0; i < cw; i++) if (tmp.c[j * cw + i] === INK && !((i & 1) && (j & 1))) b.set(cx + i, cy + 5 + j, INK);
  const [ox, oy, ow, oh] = btnRect('ok');
  roundRect(b, ox, oy, ow, oh, 3, INK);
  // default ring: 3px, 1px gap
  for (let t = 2; t <= 4; t++) roundRect(b, ox - t, oy - t, ow + t * 2, oh + t * 2, 3, INK);
  text(b, 'OK', ox + Math.round((ow - textWidth('OK')) / 2), oy + 5, INK);
  if (s.okDown) invertRect(b, ox + 1, oy + 1, ow - 2, oh - 2);
};

/** classic arrow pointer: ink fill, paper keyline. (x, y) = hot spot. */
const ARROW = [
  'o.........', 'oo........', 'o#o.......', 'o##o......', 'o###o.....', 'o####o....', 'o#####o...', 'o######o..', 'o#######o.', 'o########o',
  'o#####oooo', 'o##o##o...', 'o#o.o##o..', 'oo..o##o..', 'o....o##o.', '.....o##o.', '......oo..',
];
export const drawPointer = (b: Buf, x: number, y: number) => {
  ARROW.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = r[i]; if (c === '#') b.set(x + i, y + j, INK); else if (c === 'o') b.set(x + i, y + j, PAPER); } });
};

/** Mac zoom rects: `n` dotted outlines interpolated from rect A to rect B (XOR), t in 0..1 for the leading one. */
export const zoomRects = (b: Buf, a: [number, number, number, number], z: [number, number, number, number], t0: number, t1: number, n = 4) => {
  for (let k = 0; k < n; k++) {
    const t = t0 + ((t1 - t0) * k) / Math.max(1, n - 1);
    const e = t * t * (3 - 2 * t);
    const x = Math.round(a[0] + (z[0] - a[0]) * e), y = Math.round(a[1] + (z[1] - a[1]) * e);
    const w = Math.round(a[2] + (z[2] - a[2]) * e), h = Math.round(a[3] + (z[3] - a[3]) * e);
    const xor = (px: number, py: number) => { if ((px + py) & 1) return; b.set(px, py, b.get(px, py) === PAPER ? INK : PAPER); };
    for (let i = 0; i < w; i++) { xor(x + i, y); xor(x + i, y + h - 1); }
    for (let j = 0; j < h; j++) { xor(x, y + j); xor(x + w - 1, y + j); }
  }
};

// ------------------------------------------------------------------ the whole 1993 frame
const pointerPath = (g: number): [number, number] | null => {
  if (g < T.ptrIn) return null;
  const [cx, cy, cw, ch] = btnRect('cancel');
  const tx = cx + Math.round(cw * 0.6), ty = cy + Math.round(ch * 0.55);
  // from the frame-right edge of the pillarbox (a pointer with no hand and no owner), eased out on ones,
  // arriving on the button for the f150 click
  const sx = PB.x1 - 4, sy = 196;
  const t = Math.min(1, (g - T.ptrIn + 1) / Math.max(1, T.cancel - T.ptrIn));
  const e = 1 - (1 - t) * (1 - t);
  let x = Math.round(sx + (tx - sx) * e), y = Math.round(sy + (ty - sy) * e);
  if (g >= T.cancel && g < T.cancel + 2) y += 1; // the press
  if (g >= T.cancel + 8) { x -= 3; y += 2; } // ...and the little retreat
  return [x, y];
};

export const headAt = (g: number): KidHead => (g < T.eyes ? 'A' : g < T.turn ? 'A2' : 'C');

/**
 * Paint the 1993 frame for global frame g (full 480x270, pillarboxed). Returns the kid mask (live pixels).
 * opts.noDialog: skip the dialog/pointer layer (used as the render front's "A" side).
 */
export const draw1993 = (b: Buf, g: number, opts: {noDialog?: boolean; stair?: boolean} = {}) => {
  rect(0, 0, b.w, b.h, b.ink(INK));
  wall(b);
  windowBlinds(b);
  poster(b);
  if (opts.stair !== false) drawStair(b, g);
  desk(b);
  floppies(b);
  computer(b);
  keyboard(b);
  mouse(b);
  const live = new Uint8Array(b.w * b.h);
  const head = headAt(g);
  drawKidBack(b, KID_AT[0], KID_AT[1], head, live);
  drawKidFront(b, KID_AT[0], KID_AT[1], g >= T.ok && g < T.ok + 2, live);
  // pillarbox
  rect(0, 0, PB.x0, b.h, b.ink(INK));
  rect(PB.x1, 0, b.w - PB.x1, b.h, b.ink(INK));
  slate93(b, g);
  if (opts.noDialog) return live;
  const frozen = g >= T.freeze && g < T.collapse;
  if (frozen) greyOut(b, PB.x0, 0, PB.x1 - PB.x0, b.h, (x, y) => live[y * b.w + x] === 255 || (y > ERA_STAMP.y - 6 && x < ERA_STAMP.x + 60));
  const eye: [number, number, number, number] = [KID_AT[0] + 56, KID_AT[1] + 41, 30, 6];
  const dlg: [number, number, number, number] = [DLG.x, DLG.y, DLG.w, DLG.h];
  if (g === T.freeze) zoomRects(b, eye, dlg, 0.05, 0.4);
  else if (g === T.freeze + 1) zoomRects(b, eye, dlg, 0.45, 0.85);
  else if (g >= T.dialog && g < T.collapse) drawDialog(b, {okDown: g >= T.ok});
  const tip = stairTip(g);
  const tipR: [number, number, number, number] = [tip[0] - 2, tip[1] - 2, 5, 5];
  if (g === T.collapse) zoomRects(b, dlg, tipR, 0.15, 0.5);
  else if (g === T.collapse + 1) zoomRects(b, dlg, tipR, 0.55, 0.95);
  const p = pointerPath(g);
  if (p && g < T.collapse) drawPointer(b, p[0], p[1]);
  return live;
};

export type {Pat};
