// MR. MAS — cast: GERG MOCKBRAN, speaking set (Ep1 act 4; new file, owned by the act-4 character artist).
// cast/gerg.ts (not edited) gives his portrait rest / open / smile. This module adds:
//   gergSpeakPortrait   the full six-mouth set, patched into gerg.ts's portrait (lids, eye dart kept)
//   gergGlow            the same portrait under his laptop's GREEN glow (sc 27 post, sc 29 tile, sc 30): the
//                       laptop's cool kiss in gerg.ts (the K / C rungs on the planes that face down) is remapped to
//                       the L greens rung for rung. A palette remap, never a blend.
//   drawGergTile        "a video tile pops open on the monitor: GERG, laptop open, typing, the green glow under
//                       his chin" (sc 29): a dark room, the green pool from below, the laptop lid's edge, a 1px
//                       shoulder bob on the typing rhythm (gerg.ts gergTypeAt), keycaps popping in the corner
//   drawGergMini        38x22
import {Buf, rect, bayer} from '../px';
import {PAL} from '../palette';
import {Img, blitImg} from '../figure';
import {memo} from './kit';
import {gergPortrait, gergTypeAt, GERG_PW, GERG_PH, GergPortraitState} from './gerg';
import {Viseme, patchMouth} from './talk';
import {clipped, tileClip} from './calltile';

export interface GergSpeakState { mouth: Viseme; lid: GergPortraitState['lid']; look: GergPortraitState['look']; }
export const GERG_SPEAK_DEFAULT: GergSpeakState = {mouth: 'rest', lid: 1, look: 0};

// his portrait's mouth: gerg.ts stamp at (38, 68) + the 3px head drop = rows 71.. (row 71 blank, 72 line, 73 lip)
const MOUTHS: Record<Exclude<Viseme, 'rest' | 'smile'>, string[]> = {
  A: ['.............', 'mmmmmmmmmmm..', 'mtTTTTTTTm...', 'mddddddddm...', '.mdddddm.....', '..lllll......'],
  E: ['.............', 'mmmmmmmmmmmm.', 'mtTTTTTTTTm..', '.mddddddm....', '..llllll.....'],
  O: ['.............', '...mmmmmm....', '..mddddddm...', '..mddddddm...', '...mmmmmm....', '....llll.....'],
  M: ['.............', 'mmmmmmmmmmm..', '.MMMMMMMMM...', '..lllllll....'],
};
export const gergSpeakPortrait = memo((s: GergSpeakState): Img => {
  if (s.mouth === 'rest' || s.mouth === 'smile') return gergPortrait({mouth: s.mouth, lid: s.lid, look: s.look});
  const base = gergPortrait({mouth: 'rest', lid: s.lid, look: s.look});
  return patchMouth(base, {x: 38, y: 72, w: 12, h: 6, fillFromRow: 70}, 38, 71, MOUTHS[s.mouth], {m: PAL.S0, l: PAL.S3, t: PAL.S4, T: PAL.P1, d: PAL.N0, M: PAL.S1});
});

// the laptop's light, cyan -> green, rung for rung (gerg.ts skinC / teeC / the skin ramp's K3 rim)
const GREEN: Record<number, number> = {
  [PAL.K2]: PAL.L2, [PAL.K3]: PAL.L3, [PAL.K4]: PAL.L3,
  [PAL.C1]: PAL.L0, [PAL.C2]: PAL.L1, [PAL.C3]: PAL.L1, [PAL.C5]: PAL.L2, [PAL.C8]: PAL.L3,
};
export const gergGlow = memo((s: GergSpeakState): Img => {
  const src = gergSpeakPortrait(s);
  const out: Img = {w: src.w, h: src.h, c: new Int32Array(src.c)};
  for (let i = 0; i < out.c.length; i++) { const v = out.c[i]; if (v >= 0 && GREEN[v] !== undefined) out.c[i] = GREEN[v]; }
  // the glow UNDER his chin: the planes that face down (the jaw's underside, the neck in its shadow) take the
  // green's dark rungs. Rows below the lower lip only.
  const UNDER: Record<number, number> = {[PAL.S0]: PAL.L1, [PAL.S1]: PAL.L2, [PAL.S2]: PAL.L2, [PAL.X0]: PAL.L1, [PAL.X2]: PAL.L2};
  for (let y = 80; y < Math.min(out.h, 96); y++) for (let x = 36; x < 76; x++) { const i = y * out.w + x; const v = out.c[i]; if (v >= 0 && UNDER[v] !== undefined) out.c[i] = y < 87 || ((x + y) & 1) ? UNDER[v] : PAL.L1; }
  return out;
});

/**
 * His video tile: the portrait (green-lit) cropped from the chest up, in a dark room; the laptop lid's top edge
 * across the bottom with its green spill; typing = a 1px shoulder bob on gerg.ts's typing rhythm.
 * f = frame (typing); set typing false to hold still (he stops to answer).
 */
export const drawGergTile = (b0: Buf, x: number, y: number, w: number, h: number, s: GergSpeakState, o: {f?: number; typing?: boolean} = {}) => {
  const clip = tileClip(x, y, w, h);
  const b = clipped(b0, clip);
  rect(x, y, w, h, b.ink(PAL.N1));
  // the green pool rising off the bottom edge (his screen, just below the webcam)
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    const d = Math.hypot((i - w / 2) / (w * 0.55), (h - j) / (h * 0.9));
    const bz = bayer(x + i, y + j);
    if (d < 0.55) b.set(x + i, y + j, d < 0.38 ? PAL.L0 : bz < (0.55 - d) / 0.17 ? PAL.L0 : PAL.N1);
  }
  const f = o.f ?? 0;
  const bob = o.typing === false ? 0 : gergTypeAt(f) === 1 ? 1 : 0;
  const img = gergGlow(s);
  blitImg(b0, img, x + Math.round(w / 2 - GERG_PW / 2) + 6, y + h - GERG_PH + 40 + bob, {clip});
  // the laptop lid's top edge (the webcam is in it; we are looking out of it) and its glow line
  rect(x, y + h - 4, w, 4, b.ink(PAL.N0)); rect(x, y + h - 5, w, 1, b.ink(PAL.L1));
  // keycaps: a couple of whole-pixel pops at the bottom corners on the rhythm
  if (o.typing !== false) {
    const k = Math.floor(f / 3) % 6;
    const kx = x + 14 + ((f * 7) % 30), ky = y + h - 8 - [0, 3, 5, 5, 3, 0][k];
    rect(kx, ky, 3, 2, b.ink(PAL.G4)); b.set(kx, ky, PAL.G6);
  }
};
export const drawGergMini = (b0: Buf, x: number, y: number, w = 38, h = 22) => {
  const clip = tileClip(x, y, w, h);
  const b = clipped(b0, clip);
  rect(x, y, w, h, b.ink(PAL.N1));
  const cx = x + Math.floor(w / 2);
  rect(cx - 10, y + h - 6, 20, 6, b.ink(PAL.N3));
  rect(cx - 4, y + 5, 8, 10, b.ink(PAL.S3));
  rect(cx - 4, y + 12, 8, 3, b.ink(PAL.L2));
  rect(cx - 4, y + 4, 8, 2, b.ink(PAL.B1));
  b.set(cx - 2, y + 9, PAL.N0); b.set(cx + 1, y + 9, PAL.N0);
  rect(x, y + h - 2, w, 2, b.ink(PAL.N0)); rect(x, y + h - 3, w, 1, b.ink(PAL.L1));
};
void GERG_PH;
