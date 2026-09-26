// MR. MAS — cast: GERG's CALL TILE at MEDIUM tile scale (Ep1 act 4 draft 3.1; new file, owned by the act-4 medium-tier
// artist). Sc 29 (29.11c): "Gerg's tile fills the frame at medium tile scale. He glances up into his camera, at Mas.
// (His real face.)" The same tile also carries the exchange around it (29.11 "One sec. Compiling.", 29.11b "The
// company. Again. Just in case.") if the board takes them full-bleed, and it is what the monitor shows behind Mas's
// window in 29.12r (typing again).
// We are looking out of his laptop's webcam: GERG from the chest up, three-quarter toward camera-left (his portrait's
// angle), the laptop's GREEN glow under his chin, his forearms running down past the lid's edge to the keys, THE
// WOODROSE's warm dark behind him (a pendant's bokeh). The head is the APPROVED PORTRAIT's geometry (cast/gerg.ts
// portraitFig; copied here verbatim 2026-09-25, not exported there) re-rasterized at half size (medium-kit
// scaleParts), with the face hand-placed at this size.
//   heads (3 drawings)  'type' eyes down on his screen (just under the lens), the working squint (default) ·
//                       'up' THE GLANCE: the head lifts a pixel, the lids open, the pupils come up into the lens ·
//                       'talk' level, half-lidded, answering without looking up
//   mouths              the six visemes (talk.ts) · lids 0 | 1 | 2 · look -1 | 0 | 1
//   typing              gergTypeAt's rhythm: the forearms alternate a whole pixel, the shoulders bob a pixel, and the
//                       keycaps pop off the lid's edge; typing: false holds him still (the glance holds 1 beat)
// drawGergMediumTile(b, x, y, w, h, s, {f, typing}) paints the whole tile into any rect (480x203 = full-bleed).
import {Buf, rect, bayer, hash} from '../px';
import {PAL} from '../palette';
import {Adjust, FigureDef, Img, LightRig, P, Part, Prim, Stamp, renderFigure, blitImg} from '../figure';
import {memo, shiftPrim} from './kit';
import {Viseme} from './talk';
import {gergTypeAt} from './gerg';
import {clipped, tileClip, callLabel, speakRing, tileFrame} from './calltile';
import {scaleParts, scaleAdjust, dartRows, sleeveParts, V2} from './medium-kit';

export const GERG_MW = 100;
export const GERG_MH = 86;
const K = 0.5, OX = 22, OY = 2;

export type GergMHead = 'type' | 'up' | 'talk';
export interface GergMediumState {
  head: GergMHead;
  mouth: Viseme;
  lid: 0 | 1 | 2;
  look: -1 | 0 | 1;
  /** the typing drawing 0 | 1 | 2 (gergTypeAt); ignored when still */
  type: 0 | 1 | 2;
}
export const GERG_MEDIUM_DEFAULT: GergMediumState = {head: 'type', mouth: 'rest', lid: 1, look: 0, type: 0};

const plane = (onlyMat: string, tone: number, ...prims: Prim[]): Adjust => ({prims, tone, onlyMat});
const toMat = (onlyMat: string, mat: string, tone: number, ...prims: Prim[]): Adjust => ({prims, tone, onlyMat, mat});

// ------------------------------------------------------------------ the portrait's geometry (portrait space, 112x136)
// copied from cast/gerg.ts portraitFig (its compose: the head 3 px lower, the shoulders 4 px higher). `lift` raises
// the head (the glance: -2 portrait px = one medium pixel).
const geo = (lift: number) => {
  const parts: Part[] = [
    {group: 'torso', mat: 'tee', tone: 2, prims: [P.poly(2, 144, 4, 118, 14, 106, 30, 99, 46, 96, 70, 97, 88, 102, 102, 112, 110, 144)]},
    {group: 'neck', mat: 'neck', tone: 1, prims: [P.poly(50, 78, 50, 100, 60, 103, 70, 98, 69, 74)]},
    {group: 'collar', mat: 'tee', tone: 1, prims: [P.poly(42, 98, 50, 96, 60, 99, 70, 96, 78, 99, 70, 104, 60, 106, 50, 103)]},
    {group: 'head', mat: 'skin', tone: 3, prims: [
      P.ell(60, 46, 23, 24),
      P.poly(40, 28, 36, 36, 35, 44, 35, 50, 33, 56, 34, 62, 36, 68, 38, 74, 42, 80, 48, 84, 55, 83, 63, 79, 70, 72, 74, 64, 77, 54, 78, 44, 75, 32, 68, 25, 56, 21, 46, 22),
    ]},
    {group: 'hair', mat: 'hair', tone: 1, prims: [
      P.poly(36, 38, 35, 30, 40, 22, 48, 16, 60, 13, 72, 15, 81, 22, 85, 32, 85, 46, 82, 58, 78, 64, 75, 56, 74, 47, 71, 42, 69, 34, 60, 31, 50, 31, 42, 33, 38, 38),
    ]},
    {group: 'ear', mat: 'skinD', tone: 3, prims: [P.poly(71, 48, 75, 45, 79, 47, 80, 55, 77, 62, 72, 63, 70, 57)]},
  ];
  const adjust: Adjust[] = [
    plane('hair', 2, P.poly(40, 24, 50, 17, 62, 14, 72, 16, 64, 18, 52, 20, 44, 26)),
    plane('hair', 3, P.line(46, 18, 58, 14), P.line(62, 14, 70, 15)),
    plane('hair', 0, P.poly(69, 34, 72, 40, 74, 47, 71, 44), P.line(82, 40, 80, 56)),
    toMat('skin', 'skinC', 3, P.poly(40, 79, 44, 82, 50, 84, 56, 83, 62, 80, 62, 82, 56, 85, 48, 86, 42, 83)),
    toMat('skin', 'skinC', 4, P.poly(43, 81, 48, 83, 52, 83, 48, 84)),
    plane('skin', 2, P.poly(36, 64, 38, 70, 42, 77, 46, 80, 42, 80, 38, 74, 36, 68)),
    plane('skin', 4, P.poly(39, 34, 48, 32, 56, 33, 50, 37, 42, 38)),
    plane('skin', 2, P.poly(62, 34, 68, 38, 70, 48, 70, 58, 66, 66, 60, 72, 60, 60, 62, 48)),
    toMat('skin', 'skinD', 2, P.poly(68, 38, 74, 38, 77, 48, 74, 62, 70, 72, 63, 79, 60, 72, 66, 66, 70, 58, 70, 48)),
    plane('skin', 4, P.poly(50, 52, 58, 51, 61, 54, 54, 56)),
    plane('skin', 2, P.poly(56, 59, 61, 58, 62, 62, 58, 66)),
    plane('skin', 2, P.poly(38, 42, 44, 42, 45, 45, 38, 46), P.poly(48, 42, 62, 41, 64, 45, 49, 46)),
    plane('skin', 4, P.poly(44, 44, 46, 44, 42, 56, 40, 57)),
    plane('skin', 2, P.poly(46, 46, 48, 46, 48, 56, 45, 59, 43, 58)),
    plane('skin', 1, P.poly(38, 60, 46, 60, 45, 62, 39, 62)),
    plane('neck', 1, P.poly(50, 82, 56, 84, 64, 79, 70, 74, 69, 84, 60, 89, 50, 88)),
    toMat('skinD', 'skinD', 1, P.poly(73, 50, 76, 49, 77, 55, 75, 59)),
    toMat('tee', 'teeC', 3, P.poly(4, 128, 8, 118, 16, 110, 12, 120, 8, 132)),
    plane('tee', 1, P.line(64, 106, 70, 136), P.poly(88, 104, 102, 112, 110, 136, 98, 136)),
    plane('tee', 3, P.poly(44, 99, 50, 97, 60, 100, 70, 97, 76, 99, 70, 102, 60, 104, 50, 102)),
  ];
  const BODY = new Set(['torso', 'collar']);
  const bodyMat = new Set(['tee', 'teeC']);
  return {
    parts: parts.map((pt) => ({...pt, prims: pt.prims.map((pr) => shiftPrim(pr, 0, BODY.has(pt.group) ? -4 : pt.group === 'neck' ? 0 : 3 + lift))})),
    adjust: adjust.map((a) => ({...a, prims: a.prims.map((pr) => shiftPrim(pr, 0, bodyMat.has(a.onlyMat ?? '') ? -4 : a.onlyMat === 'neck' ? 0 : 3 + lift))})),
  };
};

// ------------------------------------------------------------------ the forearms down to the keys (medium-native)
// Seen from the lid: his forearms run from the elbows (at his sides, low) up-and-in toward us to the keyboard, which
// is just under the frame's bottom edge; the typing alternates them a pixel.
const armParts = (type: 0 | 1 | 2): {parts: Part[]; adjust: Adjust[]} => {
  const a = type === 1 ? 1 : 0, c = type === 2 ? 1 : 0;
  const L = sleeveParts('foreL', [24, 74], [40 - a, 88 - a], {w0: 11, w1: 10, mat: 'tee', lit: [-0.6, 0.8], cuff: 0.01});
  const R = sleeveParts('foreR', [80, 72], [66 + c, 88 - c], {w0: 11, w1: 10, mat: 'tee', lit: [-0.6, 0.8], cuff: 0.01});
  return {parts: [L.parts[0], R.parts[0]], adjust: [...L.adjust, ...R.adjust]};
};

// ------------------------------------------------------------------ the face at medium size (local)
const EYES: Record<GergMHead, Record<0 | 1 | 2, {near: string[]; far: string[]}>> = {
  // on his screen: the lids ride low, the irises tucked under them
  type: {
    0: {near: ['.LLLLLL', 'LwiIgw.', '.kkkk..'], far: ['LLL', 'iw.']},
    1: {near: ['.......', 'LLLLLLL', '.wiIw..'], far: ['...', 'LLL']},
    2: {near: ['.......', '.......', 'LLLLLL.'], far: ['...', 'LL.']},
  },
  // THE GLANCE: into the lens; the lids open, the pupils come up and over (a 3/4 face looking at us)
  up: {
    0: {near: ['..LLLL.', '.LLLLLL', 'LwwiIgw', '.kkkkk.'], far: ['.LL', 'LiI', 'wk.']},
    1: {near: ['.......', '.LLLLLL', 'LwwiIgw', '.kkkkk.'], far: ['...', 'LLL', 'iI.']},
    2: {near: ['.......', '.......', 'LLLLLL.', '.kkkkk.'], far: ['...', '...', 'LL.']},
  },
  talk: {
    0: {near: ['.LLLLLL', 'LwiIgw.', '.kkkk..'], far: ['LLL', 'iw.']},
    1: {near: ['.LLLLL.', 'LLLLLLL', 'LwiIgw.', '.kkkk..'], far: ['...', 'LLL', 'iw.']},
    2: {near: ['.......', '.......', 'LLLLLL.'], far: ['...', 'LL.']},
  },
};
const MOUTHS: Record<Viseme, string[]> = {
  rest: ['......', 'mmmmm.', '.lll..'],
  smile: ['....m.', 'mmmm..', '.lll..'],
  A: ['......', 'mmmmm.', 'mTTTm.', '.mdm..', '..l...'],
  E: ['......', 'mmmmmm', 'mTTTm.', '.mmm..'],
  O: ['......', '.mmm..', 'mddm..', '.mm...'],
  M: ['......', 'mmmmm.', '.MMM..', '.lll..'],
};
const faceStamps = (s: GergMediumState, lift: number): Stamp[] => {
  const dy = lift;
  const e = EYES[s.head][s.lid];
  const look = s.head === 'up' ? 1 : s.look;
  const eyePal = {L: PAL.N0, w: PAL.K1, i: PAL.B2, I: PAL.N0, g: PAL.C8, k: PAL.X1};
  const up = s.head === 'up';
  return [
    // level, low brows (concentration); on the glance they lift a pixel with the lids
    {x: 45, y: 22 + dy - (up ? 1 : 0), rows: ['bbbbbbb'], pal: {b: PAL.B0}},
    {x: 39, y: 23 + dy - (up ? 1 : 0), rows: ['bbb'], pal: {b: PAL.B0}},
    {x: 45, y: 23 + dy, rows: dartRows(e.near, look), pal: eyePal},
    {x: 39, y: 24 + dy, rows: dartRows(e.far, up ? 0 : s.look), pal: eyePal},
    {x: 43, y: 31 + dy, rows: ['.o', 'o.'], pal: {o: PAL.S0}},
    {x: 41, y: 36 + dy, rows: MOUTHS[s.mouth], pal: {m: PAL.S0, M: PAL.S1, l: PAL.S3, T: PAL.P1, d: PAL.N0}},
  ];
};

// ------------------------------------------------------------------ light: the green laptop from below, a warm rim
const RIG: LightRig = {
  key: [-0.6, 0.8], keyBand: 0, shadowBand: 0, rim: true, outline: true, edgesOnTop: true, noEdge: ['neck'],
  back: [0.9, -0.5], backBand: 1,
  backRamp: {skin: PAL.W6, skinD: PAL.W5, hair: PAL.W4, tee: PAL.W4, teeC: PAL.W4},
  ramps: {
    skin: [PAL.S0, PAL.S1, PAL.S3, PAL.S4, PAL.S5, PAL.L3],
    skinD: [PAL.S0, PAL.S0, PAL.S1, PAL.S2, PAL.S3, PAL.S4],
    skinC: [PAL.S0, PAL.L0, PAL.L1, PAL.L2, PAL.L3, PAL.L3],
    neck: [PAL.S0, PAL.S1, PAL.S2, PAL.S3, PAL.S4, PAL.S5],
    hair: [PAL.N0, PAL.B0, PAL.B1, PAL.B2, PAL.B3, PAL.W4],
    tee: [PAL.N0, PAL.N1, PAL.N3, PAL.N4, PAL.N5, PAL.W5],
    teeC: [PAL.N0, PAL.N1, PAL.L0, PAL.L1, PAL.L2, PAL.L3],
  },
};
// his eyes under the green: the cool whites and the catchlight go green rung for rung (as gerg-speak's gergGlow)
const GREEN: Record<number, number> = {[PAL.K1]: PAL.L2, [PAL.C8]: PAL.L3, [PAL.X1]: PAL.S1};

const fig = (s: GergMediumState): FigureDef => {
  const lift = s.head === 'up' ? -2 : 0;
  const g = geo(lift);
  const arms = armParts(s.type);
  const sp = scaleParts(g.parts, K, OX, OY);
  const torso = sp.filter((p) => p.group === 'torso' || p.group === 'collar');
  const rest = sp.filter((p) => !(p.group === 'torso' || p.group === 'collar'));
  // the chest continues below the portrait crop to the lid's edge
  const chest: Part = {group: 'torso', mat: 'tee', tone: 2, prims: [P.poly(24, 86, 23, 70, 26, 62, 36, 57, 52, 56, 68, 57, 78, 62, 82, 70, 81, 86)]};
  return {
    w: GERG_MW, h: GERG_MH,
    parts: [chest, ...torso, ...rest, ...arms.parts],
    adjust: [...scaleAdjust(g.adjust, K, OX, OY, false), ...arms.adjust,
      // the green pool on the chest from the screen below
      toMat('tee', 'teeC', 2, P.poly(34, 86, 38, 74, 50, 70, 64, 72, 70, 86))],
    stamps: faceStamps(s, lift / 2),
  };
};
export const gergMedium = memo((s: GergMediumState): Img => {
  const img = renderFigure(fig(s), RIG);
  for (let i = 0; i < img.c.length; i++) { const v = img.c[i]; if (v >= 0 && GREEN[v] !== undefined) img.c[i] = GREEN[v]; }
  return img;
});

/** his room behind him, at tile scale: THE WOODROSE's warm dark, three out-of-focus pendants, the green pool */
const tileBg = (b: Buf, x: number, y: number, w: number, h: number) => {
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    const X = x + i, Y = y + j;
    const d = Math.hypot((i - w * 0.78) / (w * 0.5), (j - h * 0.15) / (h * 0.7));
    const bz = bayer(X, Y);
    let c: number = PAL.N1;
    if (d < 1) c = d < 0.45 ? PAL.W1 : d < 0.7 ? (bz < (0.7 - d) / 0.25 ? PAL.W1 : PAL.W0) : bz < (1 - d) / 0.3 ? PAL.W0 : PAL.N1;
    // the green rising off the bottom edge (his screen, just below the lens)
    const g = Math.hypot((i - w / 2) / (w * 0.34), (h - j) / (h * 0.22));
    if (g < 0.7) c = g < 0.45 ? PAL.L0 : bz < (0.7 - g) / 0.25 ? PAL.L0 : c;
    b.set(X, Y, c);
  }
  // bokeh: soft stepped discs, dithered rims (never hard dots)
  const disc = (cx: number, cy: number, r: number, hot: number, col: number) => {
    for (let j = -r - 1; j <= r + 1; j++) for (let i = -r - 1; i <= r + 1; i++) {
      const d = Math.hypot(i, j) / r;
      const X = Math.round(x + cx + i), Y = Math.round(y + cy + j);
      if (X < x || Y < y || X >= x + w || Y >= y + h) continue;
      if (d < 0.7) b.set(X, Y, hot ? PAL.W5 : col);
      else if (d < 1.05 && bayer(X, Y) < 0.5) b.set(X, Y, col);
    }
  };
  disc(w * 0.84, h * 0.18, Math.max(4, Math.round(h * 0.06)), 1, PAL.W3);
  disc(w * 0.66, h * 0.1, Math.max(3, Math.round(h * 0.04)), 0, PAL.W2);
  disc(w * 0.93, h * 0.42, Math.max(3, Math.round(h * 0.035)), 0, PAL.W2);
  disc(w * 0.1, h * 0.22, Math.max(3, Math.round(h * 0.035)), 0, PAL.W1);
};
export interface GergTileOpts {
  /** frame: the typing rhythm and the keycaps */
  f?: number;
  /** false = he holds still (the glance, the answer) */
  typing?: boolean;
  /** where his bust sits across the tile, 0..1 (default 0.52) */
  cx?: number;
}
/**
 * The medium tile: his room, GERG (medium rig) from the chest up with the bottom of the rig on the tile's bottom, the
 * laptop lid's edge across the bottom (we are looking out of it), the keycaps popping off it while he types.
 */
export const drawGergMediumTile = (b0: Buf, x: number, y: number, w: number, h: number, s: Partial<GergMediumState>, o: GergTileOpts = {}) => {
  const clip = tileClip(x, y, w, h);
  const b = clipped(b0, clip);
  tileBg(b, x, y, w, h);
  const f = o.f ?? 0;
  const typing = o.typing !== false;
  const st: GergMediumState = {...GERG_MEDIUM_DEFAULT, ...s, type: typing ? gergTypeAt(f) : 0};
  const bob = typing && st.type === 1 ? 1 : 0;
  const img = gergMedium(st);
  blitImg(b0, img, x + Math.round(w * (o.cx ?? 0.52) - GERG_MW / 2), y + h - GERG_MH + 6 + bob, {clip});
  // the lid's top edge (the webcam is in it) and its green line
  rect(x, y + h - 5, w, 5, b.ink(PAL.N0)); rect(x, y + h - 6, w, 1, b.ink(PAL.L1));
  if (typing) {
    // keycaps: whole-pixel hops off the lid's edge on the rhythm, two at a time
    for (let k = 0; k < 2; k++) {
      const t = Math.floor(f / 3) + k * 3;
      const ph = t % 6;
      const kx = x + Math.round(w * (0.3 + 0.4 * hash(Math.floor(t / 6), k, 71))), ky = y + h - 9 - [0, 4, 7, 7, 4, 0][ph];
      rect(kx, ky, 4, 3, b.ink(PAL.G4)); rect(kx, ky, 4, 1, b.ink(PAL.G6)); b.set(kx + 3, ky + 2, PAL.G2);
    }
  }
};
/** the rig's face (the eyes) in tile coords, for the board's reference */
export const GERG_M_FACE: V2 = [48, 25];

/**
 * The [POV] (29.11c, full-bleed: we look at his monitor with Mas): the call app's dark field, GERG's tile opened big
 * in the middle of it at medium tile scale (256 x 144: over half the frame, so it logs as a face), his name plate,
 * the speaking ring while he talks. `open` 0..1 opens the tile in 3 held steps (29.11: "a video tile opens").
 */
export const GERG_POV_TILE = {x: 112, y: 22, w: 256, h: 144};
export const drawGergMediumPOV = (b: Buf, x: number, y: number, s: Partial<GergMediumState>, o: GergTileOpts & {speaking?: boolean; open?: number} = {}) => {
  // the app's field: near-black with a faint dot grid (the monitor's own glass, full-bleed: no bezel)
  for (let j = 0; j < 203; j++) for (let i = 0; i < 480; i++) b.set(x + i, y + j, (i % 8 === 0 && j % 8 === 0) ? PAL.N2 : PAL.N0);
  const T = GERG_POV_TILE;
  const open = o.open ?? 1;
  const hh = open >= 1 ? T.h : Math.max(3, Math.round(T.h * (open >= 0.66 ? 0.66 : open >= 0.33 ? 0.33 : 0.1)));
  const ty = T.y + Math.round((T.h - hh) / 2);
  rect(x + T.x - 1, y + ty - 1, T.w + 2, hh + 2, b.ink(PAL.N2));
  if (open < 1) { rect(x + T.x, y + ty, T.w, hh, b.ink(PAL.N1)); return; }
  drawGergMediumTile(b, x + T.x, y + T.y, T.w, T.h, s, {...o, cx: 0.5});
  tileFrame(b, x + T.x, y + T.y, T.w, T.h);
  callLabel(b, x + T.x + 3, y + T.y + T.h - 13, 'GERG MOCKBRAN', {mic: true});
  if (o.speaking) speakRing(b, x + T.x, y + T.y, T.w, T.h, PAL.L3);
};
