// MR. MAS — Ep1 Act Four v5, EXTRA pixel assets: two small polish items for kept v4 shots (art-needs-v5 P4
// POLISH-STANDINS). New file, owned by the v5 extra art pass (a4fin-pixelextra).
//
//   drawChapterCard(b, words)   S5.01 `WHAT THEY DIDN'T KNOW` (script: "Black, with cream type, centred"; pov-and-framing:
//                               an act-out card and "the door back"). v4 set it in the plate face as a marked stand-in
//                               (lay.ts actCard). Here: the 14 px display face (font.ts bigText), cream on black, optically
//                               centred (a hair above the frame's middle), with one extra px of tracking so the long line
//                               breathes; a single 1 px paper rule under it, the width of the shortest word, as the only
//                               ornament. It fills 480 x 270 (no rail: the card is the full stop). No motion: it cuts in
//                               on the downbeat and cuts out.
//   drawLobbyStoneNudge(b, step)  S8.05 [ECU] "His hand sets the glass down on the reception desk's pale stone top,
//                               brass-edged under the tungsten, and nudges it one pixel true." v4 recoloured the ECU's
//                               dark desk band to grey and ran a brass line through the middle of it (a stand-in). Here the
//                               whole top is the lobby's pale limestone: a honed surface lit by the tungsten from above,
//                               soft grey veins, the far edge a thin brass inlay against the dark lobby, the near edge a
//                               brass nosing along the frame's foot with the desk-front neon's cyan kissing its underside,
//                               the tea-lights' warm reflections and the glass's own reflection standing in the polish.
//                               `step` is drawNudgeInsert's ('held' | 'set' | 'nudge' ...); the hand, sleeve and glass are
//                               the insert's own drawings, untouched.
import {Buf, rect, bayer, hash} from '../../../../../shared/pixel/px';
import {PAL} from '../../../../../shared/pixel/palette';
import {bigText, bigTextWidth} from '../../../../../shared/pixel/font';
import {drawNudgeInsert, GLASS_AT} from '../../../../../shared/pixel/kits/inserts-mas';

// ================================================================== S5.01 the chapter card
const trackedWidth = (s: string, extra: number) => bigTextWidth(s) + Math.max(0, s.length - 1) * extra;
/** the display face with `extra` px more tracking per glyph (drawn glyph by glyph) */
const bigTracked = (b: Buf, s: string, x: number, y: number, col: number, extra: number) => {
  let cx = x;
  for (const ch of s) { bigText(b, ch, cx, y, col); cx += bigTextWidth(ch) + (ch === ' ' ? 0 : 0) + extra + (bigTextWidth(ch + ch) - 2 * bigTextWidth(ch)); }
};
export const drawChapterCard = (b: Buf, words = "WHAT THEY DIDN'T KNOW") => {
  rect(0, 0, b.w, b.h, b.ink(PAL.N0));
  const extra = 1;
  const w = trackedWidth(words, extra);
  const x = Math.round((b.w - w) / 2), y = 124; // optical centre: the cap line a little above 135
  bigTracked(b, words, x, y, PAL.P2, extra);
  const shortest = words.split(' ').reduce((m, s) => Math.min(m, bigTextWidth(s)), 999);
  rect(Math.round((b.w - shortest) / 2), y + 24, shortest, 1, b.ink(PAL.P0));
};

// ================================================================== S8.05 the stone top
const DESK_Y = 128; // inserts-mas glassPlate: the desk top's far edge in the ECU
const NOSING_Y = 195; // the near edge (brass nosing) along the frame's foot
let PLATE: Buf | null = null;
/** the insert with no hand ('gone'): a pixel of the frame that matches it is desk, not hand / sleeve / glass */
const plate = () => (PLATE ??= (() => { const p = new Buf(480, 270, PAL.N0); drawNudgeInsert(p, 'lobby', 'gone'); return p; })());
/** the limestone's tone at (x, y): lit from above, brighter far (under the lamps), soft veins, honed speckle */
const stone = (x: number, y: number) => {
  const t = (y - DESK_Y) / (NOSING_Y - DESK_Y); // 0 far .. 1 near
  // two soft veins wandering across the slab (hash-free sines: deterministic, whole-pixel)
  const v1 = Math.abs(y - (DESK_Y + 22 + Math.sin(x * 0.021) * 9 + Math.sin(x * 0.067 + 1.3) * 3));
  const v2 = Math.abs(y - (DESK_Y + 48 + Math.sin(x * 0.015 + 2.1) * 12 + Math.sin(x * 0.052) * 4));
  const vein = v1 < 0.8 || (v2 < 0.8 && (x % 7) !== 0);
  let lvl = t < 0.12 ? 3 : t < 0.45 ? 2 : t < 0.8 ? 1 : 0;
  if (bayer(x, y) < 0.18 && t > 0.1 && t < 0.9) lvl += (x + y) % 2 ? 1 : -1; // the honed speckle, sparse
  if (vein) lvl -= 1;
  const R = [PAL.G4, PAL.G5, PAL.P0, PAL.P1, PAL.P2]; // limestone under tungsten: cream where the lamps fall, grey toward us
  return R[Math.max(0, Math.min(R.length - 1, lvl))];
};
export const drawLobbyStoneNudge = (b: Buf, step: Parameters<typeof drawNudgeInsert>[2]) => {
  drawNudgeInsert(b, 'lobby', step);
  const P = plate();
  const isDesk = (x: number, y: number) => b.get(x, y) === P.get(x, y);
  // the slab
  for (let y = DESK_Y; y < NOSING_Y; y++) for (let x = 0; x < 480; x++) if (isDesk(x, y)) b.set(x, y, stone(x, y));
  // reflections in the polish: the far tea-lights (warm, short vertical smears) and the glass (a pale column under it)
  for (let k = 0; k < 9; k++) {
    const x = 18 + k * 52 + Math.floor(hash(k, 1, 7) * 14);
    for (let y = DESK_Y + 2; y < DESK_Y + 12; y++) if (isDesk(x, y) && bayer(x, y) < 0.7 - (y - DESK_Y) * 0.06) b.set(x, y, y < DESK_Y + 5 ? PAL.W7 : PAL.W5);
  }
  const [gx, gy] = GLASS_AT;
  for (let y = gy + 1; y < NOSING_Y; y++) for (let x = gx - 10; x <= gx + 10; x++) {
    if (!isDesk(x, y)) continue;
    const e = Math.abs(x - gx) / 10;
    if (bayer(x, y) < 0.5 * (1 - e) * (1 - (y - gy) / 12)) b.set(x, y, PAL.P1);
  }
  // the far edge: a thin brass inlay against the dark lobby
  for (let x = 0; x < 480; x++) { if (isDesk(x, DESK_Y)) b.set(x, DESK_Y, PAL.W6); if (isDesk(x, DESK_Y + 1)) b.set(x, DESK_Y + 1, PAL.W4); }
  // the near edge: the brass nosing (a lit round-over, its face, its shadowed underside) and the neon's cyan under it
  const NOSE = [PAL.W8, PAL.W6, PAL.W5, PAL.W4, PAL.W3, PAL.W1];
  for (let j = 0; j < NOSE.length; j++) for (let x = 0; x < 480; x++) if (isDesk(x, NOSING_Y + j)) b.set(x, NOSING_Y + j, j === 0 && bayer(x, 0) < 0.3 ? PAL.W9 : NOSE[j]);
  for (let y = NOSING_Y + NOSE.length; y < 203; y++) for (let x = 0; x < 480; x++) if (isDesk(x, y)) b.set(x, y, bayer(x, y) < 0.45 ? PAL.C3 : PAL.C1);
};
