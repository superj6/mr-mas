// MR. MAS — Ep1 v3 · Act Four art (the v3-shots-act4 pass; NEW, additive, opt-in): THE JOIN SCREEN'S FOUR ATTENDEES
// (script-v3-notes §7, S1.02 / S1.06): "the JOIN screen with the invite's four attendee icons under BOARD · VIDEO CALL ·
// JOIN, with none of them green". v3-vo-18 ("gerg's not on it.") reads them, so they must be legible at 1x.
//
// The call app's five-tile preview already sits under its title in both framings (kits/join-corner.ts for S1.02,
// kits/inserts-mas.ts drawClickInsert for S1.06): four board tiles and his own empty, dashed slot. Here the four board
// tiles carry the invite's four attendee circles instead of v5's generic grey silhouettes: a doorway, a glowing page, a
// loading spinner, a black square, drawn exactly as the cold open's invite draws them (kits/phone-invite.ts `attendee`,
// private there, copied here unchanged), so the rewatch egg of the cold open is the thing he notices at noon. None is
// Gerg's green. Neither kit is edited: S1.02 re-composites join-corner's drawNudgeJoin with this corner, and S1.06 is
// drawClickInsert re-drawn with the icons and two opt-in knobs: the laptop's arrow at any point (he checks the
// attendees while he thinks) and his hand's offset on the trackpad (the finger that moves it).
//   attendee(b, cx, cy, kind, f)                 kind 0 door · 1 page · 2 spinner · 3 black square (r 7)
//   drawNudgeJoinInvite(b, step, o)              S1.02: join-corner's drawNudgeJoin, the tiles carrying the four icons
//   drawClickInvite(b, f, o)                     S1.06: drawClickInsert + the icons + {pointer, hand, click, hover}
//   CLICK_TILES                                  the four tiles' centres in the S1.06 framing (for the arrow's path)
import {Buf, rect, line, poly, ellipse, bayer} from '../../../../../shared/pixel/px';
import {PAL, stepColor} from '../../../../../shared/pixel/palette';
import {text, textWidth} from '../../../../../shared/pixel/font';
import {blitImg} from '../../../../../shared/pixel/figure';
import {drawNudgeInsert, NudgeStep, INS_W, INS_H, CLICK25, contactShadow} from '../../../../../shared/pixel/kits/inserts-mas';
import {clickHand} from '../../../../../shared/pixel/kits/inserts-hands';
import {drawJoinCorner, JOIN_CORNER} from '../../../../../shared/pixel/kits/join-corner';

// ------------------------------------------------------------------ the attendee circles (kits/phone-invite.ts, copied)
export const attendee = (b: Buf, cx: number, cy: number, kind: 0 | 1 | 2 | 3, f: number) => {
  ellipse(cx, cy, 7, 7, b.ink(PAL.G4));
  ellipse(cx, cy, 6, 6, b.ink(kind === 3 ? PAL.N0 : PAL.N2));
  if (kind === 0) {
    rect(cx - 3, cy - 4, 6, 9, b.ink(PAL.N0)); rect(cx - 3, cy - 4, 2, 9, b.ink(PAL.W6)); rect(cx - 1, cy - 4, 1, 9, b.ink(PAL.W4));
  } else if (kind === 1) {
    rect(cx - 3, cy - 4, 7, 9, b.ink(PAL.C7)); rect(cx - 2, cy - 3, 5, 7, b.ink(PAL.P2));
    for (const yy of [cy - 2, cy, cy + 2]) rect(cx - 1, yy, 3, 1, b.ink(PAL.G5));
  } else if (kind === 2) {
    const s = Math.floor(f / 3) % 8;
    for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; b.set(Math.round(cx + Math.cos(a) * 4), Math.round(cy + Math.sin(a) * 4), i === s ? PAL.P2 : (i + 1) % 8 === s ? PAL.G5 : PAL.G3); }
  } else {
    rect(cx - 3, cy - 3, 6, 6, b.ink(PAL.N0)); rect(cx - 3, cy - 3, 6, 1, b.ink(PAL.N2));
  }
};

// ------------------------------------------------------------------ S1.02: the join corner under his hand
const ARROW0 = ['#.......', '##......', '#o#.....', '#oo#....', '#ooo#...', '#oooo#..', '#ooooo#.', '#ooo####', '#o#o#...', '##.#o#..', '#..#o#..', '....##..'];
/** join-corner's tile preview: the four board tiles (40 x 23), in the kit's order */
const CORNER_TILES = (() => { const S = JOIN_CORNER.screen; return [[S.x0 + 10, S.y0 + 18], [S.x0 + 54, S.y0 + 18], [S.x0 + 98, S.y0 + 18], [S.x0 + 32, S.y0 + 44]] as Array<[number, number]>; })();
const cornerGlare = (b: Buf, x0: number, y0: number, w: number, h: number) => { // join-corner's glare band, re-laid on the repainted tiles
  const S = JOIN_CORNER.screen;
  for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) { const u = x - S.x0 + (y - S.y0) * 0.7; if (u > 120 && u < 128 && bayer(x, y) < 0.25) b.set(x, y, PAL.N4); }
};
/** join-corner's tiles (40 x 23 each) and the laptop's arrow at `arrow` (its tip; the kit draws its own only 'beside' or
 *  'on' JOIN), the tile under it lit (`hover`) */
export const CORNER_TILE_BOX = CORNER_TILES.map(([x, y]) => [x, y, 40, 23] as [number, number, number, number]);
export interface CornerInviteOpts { pointer?: 'beside' | 'on' | 'none'; glow?: 0 | 1 | 2; click?: boolean; arrow?: [number, number]; hover?: number }
export const drawJoinCornerInvite = (b: Buf, f: number, o: CornerInviteOpts = {}) => {
  drawJoinCorner(b, {pointer: o.arrow ? 'none' : o.pointer, glow: o.glow, click: o.click});
  CORNER_TILES.forEach(([tx, ty], i) => {
    rect(tx, ty, 40, 23, b.ink(PAL.N3));
    attendee(b, tx + 20, ty + 11, i as 0 | 1 | 2 | 3, f);
    cornerGlare(b, tx, ty, 40, 23);
  });
  if (o.hover !== undefined && o.hover >= 0) {
    const [x, y, w, h] = CORNER_TILE_BOX[o.hover];
    rect(x - 1, y - 1, w + 2, 1, b.ink(PAL.C4)); rect(x - 1, y + h, w + 2, 1, b.ink(PAL.C4)); rect(x - 1, y, 1, h, b.ink(PAL.C4)); rect(x + w, y, 1, h, b.ink(PAL.C4));
  }
  if (o.arrow) { const [ax, ay] = o.arrow; ARROW0.forEach((r, j) => [...r].forEach((ch, i) => { if (ch === '#') b.set(ax + i, ay + j, PAL.N0); else if (ch === 'o') b.set(ax + i, ay + j, PAL.P2); })); }
};
/** S1.02 as one call: join-corner's drawNudgeJoin (the corner composited under his hand and sleeve), with the icons */
export const drawNudgeJoinInvite = (b: Buf, step: NudgeStep, f: number, o: CornerInviteOpts = {}) => {
  const bare = new Buf(INS_W, INS_H, PAL.N0);
  drawNudgeInsert(bare, 'suite', 'gone');
  drawNudgeInsert(b, 'suite', step);
  const lay = new Buf(INS_W, INS_H, PAL.N0);
  lay.c.set(bare.c);
  drawJoinCornerInvite(lay, f, o);
  for (let y = 0; y < INS_H; y++) for (let x = 0; x < INS_W; x++) {
    const i = y * INS_W + x;
    if (b.c[i] === bare.c[i] && lay.c[i] !== bare.c[i]) b.c[i] = lay.c[i];
  }
};
/** the arrow's tips in the corner framing: beside JOIN (the kit's 'beside'), on JOIN ('on'), over each attendee tile */
export const CORNER_ARROW = (() => { const J = JOIN_CORNER.join; return {beside: [J.x + J.w + 7, J.y + 3] as [number, number], on: [J.x + 30, J.y + 6] as [number, number]}; })();
export const cornerTileTip = (i: number): [number, number] => [CORNER_TILES[i][0] + 26, CORNER_TILES[i][1] + 13];

// ------------------------------------------------------------------ S1.06: the click insert (kits/inserts-mas.ts drawClickInsert)
const CS = 7.4, CE = 50; // inserts-mas's own hand size and eye distance for this framing (private there)
const ARROW = ['#.......', '##......', '#o#.....', '#oo#....', '#ooo#...', '#oooo#..', '#ooooo#.', '#ooo####', '#o#o#...', '##.#o#..', '#..#o#..', '....##..'];
/** the four board tiles' boxes (x, y, w, h) in the S1.06 framing, and their centres */
export const CLICK_TILE_BOX = (() => {
  const S = CLICK25.screen, cx = (S.x0 + S.x1) >> 1;
  return [0, 1, 2, 3].map((k) => [k < 3 ? cx - 64 + k * 44 : cx - 42, k < 3 ? S.y0 + 21 : S.y0 + 45, 40, 21] as [number, number, number, number]);
})();
export const CLICK_TILES = CLICK_TILE_BOX.map(([x, y, w, h]) => [x + (w >> 1), y + (h >> 1)] as [number, number]);
/** where drawClickInsert rests the arrow's tip (on JOIN) */
export const CLICK_ARROW_REST: [number, number] = [CLICK25.join.x + 36, CLICK25.join.y + 7];
const HANDS = new Map<string, ReturnType<typeof clickHand>>();
const handOf = (click: boolean) => { const k = click ? 'c' : 'r'; let h = HANDS.get(k); if (!h) { h = clickHand({s: CS, E: CE, click}); HANDS.set(k, h); } return h; };
/**
 * drawClickInsert, re-drawn: the suite behind the lid, the laptop, `BOARD · VIDEO CALL`, the tile preview (the four
 * attendee icons on the board's tiles, his dashed slot empty), JOIN, the glare, the laptop's arrow at `pointer` (its tip;
 * default: on JOIN, as the kit), the deck, the keys, the trackpad, and his hand on it offset by `hand` px (default 0, 0).
 */
export const drawClickInvite = (b: Buf, f: number, o: {click?: boolean; pointer?: [number, number]; hand?: [number, number]; hover?: number} = {}) => {
  for (let y = 0; y < INS_H; y++) for (let x = 0; x < INS_W; x++) {
    let c: number;
    if (x < 340) { const u = (x + y) % 16, v = (x - y + 1600) % 16; c = u === 0 || v === 0 ? PAL.X0 : u === 8 && v === 8 ? PAL.X2 : PAL.X1; }
    else c = y < 70 ? (bayer(x, y) < 0.6 ? PAL.G6 : PAL.N8) : y < 120 ? PAL.P1 : PAL.G4;
    b.set(x, y, c);
  }
  for (let y = 0; y < INS_H; y++) { b.set(340, y, PAL.R1); b.set(341, y, PAL.R1); }
  for (let y = 116; y < INS_H; y++) for (let x = 0; x < INS_W; x++) {
    const u = (x * 0.3 + (y - 116) * 1.6) % 64;
    b.set(x, y, u < 10 && bayer(x, y) < 0.55 - u / 24 ? PAL.N3 : PAL.N1);
  }
  const S = CLICK25.screen;
  poly([S.x0 - 10, S.y0 - 8, S.x1 + 10, S.y0 - 9, S.x1 + 12, S.y1 + 10, S.x0 - 12, S.y1 + 11], (x, y) => b.set(x, y, PAL.G1));
  line(S.x0 - 10, S.y0 - 8, S.x1 + 10, S.y0 - 9, (x, y) => b.set(x, y, PAL.G4));
  poly([S.x0 - 4, S.y0 - 3, S.x1 + 4, S.y0 - 4, S.x1 + 5, S.y1 + 4, S.x0 - 5, S.y1 + 5], (x, y) => b.set(x, y, PAL.N0));
  for (let y = S.y0; y <= S.y1; y++) for (let x = S.x0; x <= S.x1; x++) b.set(x, y, y < S.y0 + 13 ? PAL.N3 : PAL.N1);
  text(b, 'BOARD · VIDEO CALL', S.x0 + 8, S.y0 + 3, PAL.G5);
  const cx = (S.x0 + S.x1) >> 1;
  rect(cx - 70, S.y0 + 18, 140, 50, b.ink(PAL.N2));
  // the four board tiles, each with its attendee circle (the invite's icons); his own slot dark, waiting
  CLICK_TILE_BOX.forEach(([gx, gy, w, h], k) => {
    rect(gx, gy, w, h, b.ink(PAL.N3)); rect(gx, gy + h, w, 1, b.ink(PAL.N2));
    attendee(b, gx + (w >> 1), gy + (h >> 1), k as 0 | 1 | 2 | 3, f);
  });
  rect(cx - 42 + 44, S.y0 + 45, 40, 21, b.ink(PAL.N0));
  const J = CLICK25.join, dn = o.click ? 1 : 0;
  rect(J.x, J.y + dn, J.w, J.h, b.ink(o.click ? PAL.C3 : PAL.C5));
  rect(J.x, J.y + dn, J.w, 1, b.ink(o.click ? PAL.C2 : PAL.C7));
  text(b, 'JOIN', J.x + ((J.w - textWidth('JOIN')) >> 1), J.y + 5 + dn, o.click ? PAL.C8 : PAL.N0);
  for (let y = S.y0 - 3; y < S.y1 + 4; y++) for (let x = S.x0 - 4; x < S.x1 + 4; x++) { const u = x + y * 0.7; if (u > 250 && u < 262 && bayer(x, y) < 0.3) b.set(x, y, stepColor(b.get(x, y), 1)); }
  if (o.hover !== undefined && o.hover >= 0) { // the app's hover: the tile under the arrow lit in a 1 px ring
    const [x, y, w, h] = CLICK_TILE_BOX[o.hover];
    rect(x - 1, y - 1, w + 2, 1, b.ink(PAL.C4)); rect(x - 1, y + h, w + 2, 1, b.ink(PAL.C4)); rect(x - 1, y, 1, h, b.ink(PAL.C4)); rect(x + w, y, 1, h, b.ink(PAL.C4));
  }
  const [ax, ay] = o.pointer ?? CLICK_ARROW_REST;
  ARROW.forEach((r, j) => [...r].forEach((ch, i) => { if (ch === '#') b.set(ax + i, ay + j, PAL.N0); else if (ch === 'o') b.set(ax + i, ay + j, PAL.P2); }));
  rect(S.x0 - 12, S.y1 + 11, S.x1 - S.x0 + 24, 3, b.ink(PAL.N0));
  poly([S.x0 - 14, S.y1 + 14, S.x1 + 14, S.y1 + 14, S.x1 + 44, INS_H + 4, S.x0 - 44, INS_H + 4], (x, y) => b.set(x, y, PAL.G2));
  line(S.x0 - 14, S.y1 + 14, S.x1 + 14, S.y1 + 14, (x, y) => b.set(x, y, PAL.G4));
  for (let r = 0; r < 4; r++) {
    const y = S.y1 + 18 + r * 7 + Math.floor(r * r * 0.3);
    const ww = (S.x1 - S.x0 + 20) + r * 7, x0 = cx - ww / 2;
    for (let k = 0; k < 14; k++) { const kw = Math.floor(ww / 14) - 2; rect(Math.round(x0 + k * (ww / 14)), y, kw, 4 + (r > 1 ? 1 : 0), b.ink(PAL.G1)); rect(Math.round(x0 + k * (ww / 14)), y, kw, 1, b.ink(PAL.G3)); }
  }
  const T = CLICK25.pad;
  for (let y = T.y0; y <= T.y1; y++) for (let x = T.x0 - (y - T.y0) * 0.1; x <= T.x1 + (y - T.y0) * 0.1; x++) b.set(Math.round(x), y, y === T.y0 ? PAL.G4 : PAL.G3);
  const H = handOf(!!o.click);
  const [hx, hy] = o.hand ?? [0, 0];
  const [px, py] = CLICK25.contact;
  const ox = px + hx - H.anchors.tip[0], oy = py + hy - H.anchors.tip[1];
  contactShadow(b, H.img, ox, oy, 3, 3, 2);
  blitImg(b, H.img, ox, oy);
};
