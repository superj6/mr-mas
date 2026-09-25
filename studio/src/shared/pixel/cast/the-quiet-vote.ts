// MR. MAS — cast: THE QUIET VOTE (Ep1 act 4; new file, owned by the act-4 character artist).
// The fourth vote. She is the `camera off` tile and nothing else: we never see a face, a silhouette, a room or a
// family. The design is a generic call app's no-video state, drawn with care so an empty tile can hold a beat:
// black, a dim placeholder disc with a generic figure glyph, a muted mic, the name plate, and one line of type.
// The tile never moves, never flickers and never speaks. The only thing about it that ever changes is the
// ballot icon (calltile.voteIcon, the caller's), and whether it is on screen at all.
//   drawQuietVoteTile    any size >= 48x27 (the call grid, the board's four-tile grid, the avalanche)
//   drawQuietVoteMini    38x22 (Mas's monitor corner)
//   drawQuietVotePortrait 112x136 portrait-window / name-card version (card: THE QUIET VOTE / (CAMERA OFF))
//   drawQuietVoteLaptop  room prop: a laptop on a boardroom chair showing the tile (sc 27 boardroom night)
//   QUIET_VOTE_NAME / QUIET_VOTE_CARD  the on-screen strings
import {Buf, rect, ellipse, poly} from '../px';
import {PAL} from '../palette';
import {text, textWidth} from '../font';
import {callLabel, clipped, micIcon, tileClip} from './calltile';

export const QUIET_VOTE_NAME = 'THE QUIET VOTE';
export const QUIET_VOTE_SUB = 'camera off';
export const QUIET_VOTE_CARD = {name: 'THE QUIET VOTE', line: '(CAMERA OFF)'};

/** The generic placeholder: a disc and a head-and-shoulders glyph cut from it (no face, no hair, no features). */
const placeholder = (b: Buf, cx: number, cy: number, r: number, disc: number, glyph: number) => {
  ellipse(cx, cy, r, r, b.ink(disc));
  const hr = Math.max(2, Math.round(r * 0.34));
  ellipse(cx, cy - r * 0.22, hr, hr, b.ink(glyph));
  const sw = r * 0.62, top = cy + r * 0.2;
  // shoulders: a rounded trapezoid clipped by the disc
  const tmp = new Buf(b.w, b.h, 0xff00ff);
  poly([cx - sw, cy + r, cx - sw * 0.9, top + 2, cx - sw * 0.5, top, cx + sw * 0.5, top, cx + sw * 0.9, top + 2, cx + sw, cy + r], tmp.ink(glyph));
  for (let y = Math.floor(top); y <= cy + r; y++) for (let x = Math.floor(cx - sw - 1); x <= cx + sw + 1; x++) {
    if (tmp.get(x, y) !== glyph) continue;
    const dx = (x + 0.5 - cx) / r, dy = (y + 0.5 - cy) / r;
    if (dx * dx + dy * dy <= 1) b.set(x, y, glyph);
  }
};

/**
 * The tile content at (x, y, w, h): black, the placeholder, 'camera off', the name plate with a muted mic.
 * Chrome such as the tile frame and the vote icon is the caller's (calltile.tileFrame / tileVote).
 * `label` false leaves the name plate off (when the caller draws its own).
 */
export const drawQuietVoteTile = (b0: Buf, x: number, y: number, w: number, h: number, o: {label?: boolean; sub?: boolean} = {}) => {
  const clip = tileClip(x, y, w, h);
  const b = clipped(b0, clip);
  rect(x, y, w, h, b.ink(PAL.N0));
  // a 1px inner edge (the app's tile bevel), so a black tile still reads as a tile on a black grid
  rect(x, y, w, 1, b.ink(PAL.N2)); rect(x, y + h - 1, w, 1, b.ink(PAL.N1)); rect(x, y, 1, h, b.ink(PAL.N2)); rect(x + w - 1, y, 1, h, b.ink(PAL.N1));
  const r = Math.max(5, Math.min(14, Math.round(h * 0.17)));
  const cx = x + Math.round(w / 2), cy = y + Math.round(h * 0.42);
  placeholder(b, cx, cy, r, PAL.N2, PAL.N4);
  if (o.sub !== false && h >= 50) {
    const sw = textWidth(QUIET_VOTE_SUB);
    text(b, QUIET_VOTE_SUB, cx - Math.round(sw / 2), cy + r + 5, PAL.N5);
  }
  // small tiles keep only the muted mic on its plate (the name never truncates)
  if (o.label !== false) {
    if (w >= 100) callLabel(b, x + 2, y + h - 13, QUIET_VOTE_NAME, {muted: true});
    else { rect(x + 2, y + h - 11, 11, 9, b.ink(PAL.N1)); micIcon(b, x + 5, y + h - 10, true, PAL.G4); }
  }
};

/** 38 x 22 mini tile: black, a dim disc, the muted plate tick. */
export const drawQuietVoteMini = (b0: Buf, x: number, y: number, w = 38, h = 22) => {
  const clip = tileClip(x, y, w, h);
  const b = clipped(b0, clip);
  rect(x, y, w, h, b.ink(PAL.N0));
  rect(x, y, w, 1, b.ink(PAL.N2)); rect(x, y, 1, h, b.ink(PAL.N2));
  placeholder(b, x + Math.round(w / 2), y + 9, 5, PAL.N2, PAL.N4);
  rect(x + 2, y + h - 4, 9, 2, b.ink(PAL.N2));
  b.set(x + 11, y + h - 4, PAL.R2);
};

/** Portrait window / name-card portrait (112 x 136 by default): the tile, drawn for the window's proportions. */
export const drawQuietVotePortrait = (b0: Buf, x: number, y: number, w = 112, h = 136) => {
  const clip = tileClip(x, y, w, h);
  const b = clipped(b0, clip);
  rect(x, y, w, h, b.ink(PAL.N0));
  const cx = x + Math.round(w / 2), cy = y + Math.round(h * 0.4);
  placeholder(b, cx, cy, 24, PAL.N1, PAL.N3);
  // the ring the app would light when she speaks: drawn, never lit
  for (let a = 0; a < 360; a += 3) {
    const t = (a * Math.PI) / 180;
    b.set(Math.round(cx + Math.cos(t) * 27), Math.round(cy + Math.sin(t) * 27), PAL.N2);
  }
  const sw = textWidth(QUIET_VOTE_SUB);
  text(b, QUIET_VOTE_SUB, cx - Math.round(sw / 2), cy + 36, PAL.N5);
  micIcon(b, cx - 3, cy + 50, true, PAL.N5);
};

// ------------------------------------------------------------------ room prop: the laptop on a chair
// A boardroom chair (a plain one: it is not Mada's bolted chair) with a laptop open on the seat, its screen the
// tile at room scale: black, a 3px dim disc, a 1px label tick. The screen's own glow is one step of N on the
// chair back. (x, floorY) = the chair's floor centre. Facing: the screen faces screen-left unless flip.
export const QV_LAPTOP_W = 30;
export const QV_LAPTOP_H = 40;
export const drawQuietVoteLaptop = (b: Buf, x: number, floorY: number, o: {flip?: boolean; chair?: boolean} = {}) => {
  const s = o.flip ? -1 : 1;
  const X = (i: number) => x + s * i;
  const put = (i: number, j: number, c: number) => b.set(X(i), floorY + j, c);
  const R = (i0: number, j0: number, w: number, h: number, c: number) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) put(i0 + i, j0 + j, c); };
  if (o.chair !== false) {
    // chair: back (behind, to the right), seat, column, a 4-spoke base with casters
    R(7, -36, 5, 22, PAL.N2); R(7, -36, 5, 1, PAL.N4); R(11, -35, 1, 21, PAL.N1);
    R(-8, -15, 20, 4, PAL.N3); R(-8, -15, 20, 1, PAL.N5); R(-8, -12, 20, 1, PAL.N1);
    R(0, -11, 3, 7, PAL.G2); R(1, -11, 1, 7, PAL.G4);
    R(-9, -4, 21, 2, PAL.G1); R(-9, -4, 21, 1, PAL.G3);
    for (const i of [-9, -2, 5, 11]) { R(i, -2, 2, 2, PAL.N0); put(i, -2, PAL.G2); }
  }
  // the laptop: base on the seat, the screen tilted back (a parallelogram), facing the room
  R(-7, -17, 15, 2, PAL.G2); R(-7, -17, 15, 1, PAL.G4);
  for (let j = 0; j < 13; j++) for (let i = 0; i < 13; i++) {
    const ii = -6 + i + Math.floor(j / 5);
    const edge = i === 0 || i === 12 || j === 0 || j === 12;
    put(ii, -30 + j, edge ? PAL.G1 : PAL.N0);
  }
  // the tile on the screen: the placeholder disc, the label tick; nothing else, ever
  const px = -1, py = -26;
  for (const [i, j] of [[0, 0], [1, 0], [-1, 1], [0, 1], [1, 1], [2, 1], [0, 2], [1, 2]]) put(px + i + 1, py + j, PAL.N3);
  put(px + 1, py - 1, PAL.N4);
  R(-4, -21, 4, 1, PAL.N3); put(0, -21, PAL.R1);
  // the screen's faint spill on the chair back
  for (let j = -30; j < -18; j += 2) put(7, j, PAL.N3);
};
