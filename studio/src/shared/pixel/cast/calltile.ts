// MR. MAS — cast kit: VIDEO-CALL TILE chrome shared by every board member's tile (Ep1 act 4; new file, owned by
// the act-4 character artist). A generic call UI (no product's trade dress): a flat tile, a black name plate
// bottom-left, a mic glyph, the ballot-card VOTE ICON that flips, and the active-speaker ring.
// Tiles are drawn at the call's standard size (TILE_W x TILE_H, the salvaged five-tile grid) but every tile
// function takes (x, y, w, h): the bust is bottom-anchored and clipped, so any grid can reuse it. The MINI tile
// (the board grid in the corner of Mas's monitor, sc 29) is its own drawing per character, never a downscale.
import {Buf, rect} from '../px';
import {PAL} from '../palette';
import {text, textWidth} from '../font';
import {Img, blitImg} from '../figure';

/** the salvaged grid's tile (studio/src/dev/mfinale/slot.ts TW x TH) */
export const TILE_W = 150;
export const TILE_H = 86;
/** mini tile for the monitor corner / feed thumbnails */
export const MINI_W = 38;
export const MINI_H = 22;

export type Clip = (x: number, y: number) => boolean;
export const tileClip = (x: number, y: number, w: number, h: number): Clip => (px, py) => px >= x && py >= y && px < x + w && py < y + h;
/** a plotter clipped to the tile */
export const clipInk = (b: Buf, clip: Clip, col: number) => (x: number, y: number) => { if (clip(x, y)) b.set(x, y, col); };
/** a Buf proxy whose writes are clipped to the tile (so any rect/line/poly helper stays inside) */
export const clipped = (b0: Buf, clip: Clip): Buf => {
  const b = Object.create(b0) as Buf;
  b.set = (x: number, y: number, c: number) => { if (clip(x, y)) b0.set(x, y, c); };
  b.ink = (c: number) => (x: number, y: number) => { if (clip(x, y)) b0.set(x, y, c); };
  return b;
};

/** Bust into a tile: bottom-anchored at the tile's bottom edge, horizontally at `cx` (tile-local centre). */
export const bustInTile = (b: Buf, img: Img, x: number, y: number, w: number, h: number, cx = 0.5, dy = 0) =>
  blitImg(b, img, x + Math.round(w * cx - img.w / 2), y + h - img.h + dy, {clip: tileClip(x, y, w, h)});

/**
 * Where a webcam bust's top goes in a tile of height h: bottom-anchored in a full tile, and in a short tile (the
 * avalanche, a strip) it rides up so the FACE stays in frame rather than the chest.
 */
export const bustY = (y: number, h: number, bustH: number) => y + h - bustH + Math.max(0, Math.round((bustH - h) * 0.6));

/** The tile's frame: a 1px black keyline and a faint top highlight (the call app's grid gutter is the caller's). */
export const tileFrame = (b: Buf, x: number, y: number, w: number, h: number) => {
  rect(x - 1, y - 1, w + 2, 1, b.ink(PAL.N0)); rect(x - 1, y + h, w + 2, 1, b.ink(PAL.N0));
  rect(x - 1, y, 1, h, b.ink(PAL.N0)); rect(x + w, y, 1, h, b.ink(PAL.N0));
  rect(x - 2, y - 2, w + 4, 1, b.ink(PAL.N2));
};

/** Active speaker: a 1px ring inside the tile edge (held, never pulsing). */
export const speakRing = (b: Buf, x: number, y: number, w: number, h: number, col: number = PAL.C6) => {
  rect(x, y, w, 1, b.ink(col)); rect(x, y + h - 1, w, 1, b.ink(col));
  rect(x, y, 1, h, b.ink(col)); rect(x + w - 1, y, 1, h, b.ink(col));
};

// 5x7 mic glyph; the muted version carries a slash
const MIC = ['.ooo.', '.ooo.', '.ooo.', 'o.o.o', '.ooo.', '..o..', '.ooo.'];
const MIC_OFF = ['.ooox', '.ooo.', '.oxo.', 'oxo.o', 'xooo.', '..o..', '.ooo.'];
export const micIcon = (b: Buf, x: number, y: number, muted = false, col: number = PAL.P1) => {
  (muted ? MIC_OFF : MIC).forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = r[i]; if (c === 'o') b.set(x + i, y + j, col); else if (c === 'x') b.set(x + i, y + j, PAL.R3); } });
};

/**
 * The name plate, bottom-left (black, cream type), with an optional mic glyph. Returns the plate width.
 * (x, y) = the plate's top-left; standard placement is (tileX + 2, tileY + tileH - 13).
 */
export const callLabel = (b: Buf, x: number, y: number, name: string, o: {muted?: boolean; mic?: boolean; col?: number} = {}) => {
  const mic = o.mic ?? o.muted ?? false;
  const w = textWidth(name) + 8 + (mic ? 8 : 0);
  rect(x, y, w, 11, b.ink(PAL.N0));
  let tx = x + 4;
  if (mic) { micIcon(b, x + 3, y + 2, o.muted ?? false, o.muted ? PAL.G4 : PAL.P1); tx += 8; }
  text(b, name, tx, y + 2, o.col ?? PAL.P1);
  return w;
};
/** standard label placement for a tile */
export const tileLabel = (b: Buf, x: number, y: number, h: number, name: string, o: {muted?: boolean; mic?: boolean; col?: number} = {}) => callLabel(b, x + 2, y + h - 13, name, o);

// ------------------------------------------------------------------ the VOTE ICON (a ballot card that flips)
// 'back'  grey card back (not yet voted)   'edge' the card edge-on, mid-flip (1 frame)   'flip' red face (voted)
// Flip = 3 held drawings: back -> edge -> flip. Top-right of the tile, 3px in from the corner.
export type VoteState = 'back' | 'edge' | 'flip';
const CARD_BACK = ['ooooooo', 'oBbBbBo', 'obBbBbo', 'oBbBbBo', 'obBbBbo', 'oBbBbBo', 'obBbBbo', 'oBbBbBo', 'ooooooo'];
const CARD_EDGE = ['...o...', '...h...', '...h...', '...h...', '...h...', '...h...', '...h...', '...h...', '...o...'];
const CARD_FACE = ['ooooooo', 'ohhhhho', 'orrrrro', 'orrrrro', 'orrrrro', 'orrrrro', 'orrrrro', 'oRRRRRo', 'ooooooo'];
export const VOTE_W = 7, VOTE_H = 9;
export const voteIcon = (b: Buf, x: number, y: number, s: VoteState) => {
  const rows = s === 'back' ? CARD_BACK : s === 'edge' ? CARD_EDGE : CARD_FACE;
  const pal: Record<string, number> = {o: PAL.N0, B: PAL.N5, b: PAL.N4, h: s === 'edge' ? PAL.P1 : PAL.R3, r: PAL.R2, R: PAL.R1};
  rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = pal[r[i]]; if (c !== undefined) b.set(x + i, y + j, c); } });
};
/** standard vote-icon placement for a tile */
export const tileVote = (b: Buf, x: number, y: number, w: number, s: VoteState) => voteIcon(b, x + w - VOTE_W - 3, y + 3, s);
/** the three held drawings of a flip starting at t0 (1 frame edge-on) */
export const voteFlipAt = (f: number, t0: number): VoteState => (f < t0 ? 'back' : f === t0 ? 'edge' : 'flip');

/** Mini-tile chrome: a dark 1px frame and an initial-less 2px name tick (the name never reads at this size). */
export const miniFrame = (b: Buf, x: number, y: number, w: number, h: number) => {
  rect(x - 1, y - 1, w + 2, 1, b.ink(PAL.N0)); rect(x - 1, y + h, w + 2, 1, b.ink(PAL.N0));
  rect(x - 1, y, 1, h, b.ink(PAL.N0)); rect(x + w, y, 1, h, b.ink(PAL.N0));
  rect(x + 1, y + h - 3, 7, 2, b.ink(PAL.N0));
};
