// MR. MAS — cast: MAS's FULL-FRAME CLOSE-UP ([CU], Ep1 act 4 sc 26 + sc 30) and his EYES STRIP ([ECU], sc 26).
// New file, owned by the act-4 insert + expression artist. Nothing here edits cast/mas.ts.
//
//   masCU()          THE drawing: one silent, unchanging face. Three-quarter toward camera-left (his portrait's
//                    angle), the one-pixel smile, no mouths, no lids, no blink. Head ~140 px (crown y 6 -> chin
//                    y 142) filling the 480x203 room area, Mas in the left third. It is a 2x re-raster of the
//                    approved portrait's painted planes (cast/mas.ts masPortraitFig, half-pixel precision), with
//                    every feature (eyes, brows, nose, mouth, ear, hair, strings) hand-placed at CU scale.
//   drawMasCU()      the whole shot: the backdrop that carries the light, then the face. backdrop 'strip' (sc 26:
//                    the suite stepped down to the Strip's neon + the laptop glow) | 'lobby' (sc 30: the lobby's
//                    tungsten, the lit sign's cream box behind him). The face drawing is IDENTICAL in both.
//   CU_FACE_LIGHT    'cyan' (default: the approved key, the laptop/monitor from camera-left). 'tungsten' exists
//                    ONLY for the W0 relight ruling (pov-changes §6: "if Mas's portrait and [CU] are painted as
//                    materials for resolve()"); the figure is built from material ramps, so a relight is a ramp
//                    swap. Default ruling = room only: never pass 'tungsten' unless W0 rules it.
//   drawEyesStrip()  the 480x64 letterboxed eyes strip, 5 pupil positions (-2..2, whole-pixel steps; sc 26 phrase 2:
//                    "his pupils move one pixel toward the dialog. Nothing else on him moves").
//
// Rules held (pov-and-framing §3.6, §4.1, §4.3.10): the smile stays one pixel at every scale (so here it is even
// smaller relative to the face); he never blinks; nothing on the CU changes while it holds. Dither only in the
// backdrops and light falloff, never on skin. All colours are master palette.
import {Buf, rect, bayer, hash, line} from '../px';
import {PAL} from '../palette';
import {Adjust, FigureDef, LightRig, P, Part, Prim, Stamp, renderFigure} from '../figure';
import {memo, blitTo} from './kit';
import type {Img} from '../figure';

export const CU_W = 480, CU_H = 203;
/** where the drawing sits (image space == room space: the image is 300 x 203 at x 0) */
export const CU_IMG_W = 300;
/** anchors in room coords: the eyes (pupil centres), the smile's lifted corner, the head box */
export const CU = {
  nearEye: [111, 73] as [number, number],
  farEye: [80, 73] as [number, number],
  smile: [77, 115] as [number, number],
  head: {x0: 64, y0: 6, x1: 176, y1: 144},
};

// ------------------------------------------------------------------ portrait -> CU mapping (2x, re-rasterized)
// The approved portrait (112x136) draws the head 3 px lower and the body 4 px higher than authored, and compresses
// the lower face toward the eye line (q). The CU takes those FINAL portrait coordinates x2 and offsets them.
const OX = 0, OY = -26;
const q = (y: number) => (y > 56 ? Math.round((56 + (y - 56) * 0.86) * 2) / 2 : y);
/** head/face points (portrait authoring space; J = with the jaw compression) */
const J = (...pts: number[]): Prim => P.poly(...pts.map((v, i) => (i % 2 ? 2 * (q(v) + 3) + OY : 2 * v + OX)));
const Hd = (...pts: number[]): Prim => P.poly(...pts.map((v, i) => (i % 2 ? 2 * (v + 3) + OY : 2 * v + OX)));
const HdL = (x0: number, y0: number, x1: number, y1: number): Prim => P.line(2 * x0 + OX, 2 * (y0 + 3) + OY, 2 * x1 + OX, 2 * (y1 + 3) + OY);
/** body points (the portrait moves them 4 px up) */
const Bd = (...pts: number[]): Prim => P.poly(...pts.map((v, i) => (i % 2 ? 2 * (v - 4) + OY : 2 * v + OX)));
const BdL = (x0: number, y0: number, x1: number, y1: number): Prim => P.line(2 * x0 + OX, 2 * (y0 - 4) + OY, 2 * x1 + OX, 2 * (y1 - 4) + OY);
/** the neck is not moved in the portrait */
const Nk = (...pts: number[]): Prim => P.poly(...pts.map((v, i) => (i % 2 ? 2 * v + OY : 2 * v + OX)));
/** CU-native polygon / line (room coords) */
const C = (...pts: number[]): Prim => P.poly(...pts);
const CL = (x0: number, y0: number, x1: number, y1: number): Prim => P.line(x0, y0, x1, y1);
const CE = (cx: number, cy: number, rx: number, ry: number): Prim => P.ell(cx, cy, rx, ry);

const plane = (onlyMat: string, tone: number, ...prims: Prim[]): Adjust => ({prims, tone, onlyMat});
const toMat = (onlyMat: string, mat: string, tone: number, ...prims: Prim[]): Adjust => ({prims, tone, onlyMat, mat});

// ------------------------------------------------------------------ the eye generator (CU and the eyes strip)
/**
 * An almond eye as a stamp map (chars for EYE_PAL). The inner corner is at t = 0 (toward the nose); `mirror` puts it
 * on the right (the far eye in a 3/4 view facing camera-left has its inner corner on the right).
 *   L upper lid line (2 px, a lash flick at the outer corner)  l the crease above it   v sclera under the lid (shade)
 *   w sclera   W sclera's lit side by the iris   r iris edge   i iris   j the iris's lit crescent (opposite the key)
 *   I pupil   g catchlight (the key side)   k lower lid line   h lower-lid light   t inner corner (caruncle)
 */
export interface EyeSpec {
  w: number; h: number;
  /** opening half-heights: upper / lower (px) */
  up: number; low: number;
  /** iris centre (0..w, 0..h in the map) and radius; pupil radius */
  ix: number; iy: number; ir: number; pr: number;
  /** outer-corner lift in px (a calm, slightly lifted outer corner) */
  tilt?: number;
  /** lid line thickness at the middle */
  lid?: number;
  crease?: number;
  mirror?: boolean;
  /** catchlight size (1 or 2) */
  glint?: number;
}
export const eyeMap = (e: EyeSpec): string[] => {
  const {w, h} = e;
  const rows = Array.from({length: h}, () => Array<string>(w).fill('.'));
  const set = (x: number, y: number, c: string) => { if (x >= 0 && y >= 0 && x < w && y < h) rows[y][x] = c; };
  const get = (x: number, y: number) => (x >= 0 && y >= 0 && x < w && y < h ? rows[y][x] : '.');
  const x0 = 1, x1 = w - 2, cy = e.iy;
  /** 0 at the inner corner .. 1 at the outer corner */
  const T = (x: number) => { const t = (x + 0.5 - x0) / (x1 + 1 - x0); return e.mirror ? 1 - t : t; };
  // an almond: two asymmetric humps, the upper peaking toward the inner third, the lower toward the outer third
  const hump = (t: number, pk: number) => { const s = t < pk ? t / pk : (1 - t) / (1 - pk); return s * (2 - s); };
  const yU = (x: number) => { const t = T(x); return cy - (e.tilt ?? 0) * t - e.up * hump(t, 0.42); };
  const yL = (x: number) => { const t = T(x); return cy - (e.tilt ?? 0) * t + e.low * hump(t, 0.6); };
  const lid = e.lid ?? 2, cr = e.crease ?? 3;
  for (let x = x0; x <= x1; x++) {
    const t = T(x);
    const top = Math.round(yU(x)), bot = Math.round(yL(x));
    // the opening
    for (let y = top + 1; y < bot; y++) {
      const dx = x + 0.5 - e.ix, dy = y + 0.5 - e.iy, d = Math.hypot(dx, dy);
      let c = y === top + 1 ? 'v' : 'w';
      if (d < e.ir) {
        c = d > e.ir - 1.1 ? 'r' : 'i';
        if (c === 'i' && dx > 0.5 && dy > 0.5 && d > e.ir * 0.5) c = 'j';
        if (d < e.pr) c = 'I';
        if (y === top + 1 && c !== 'I') c = 'r';
      } else if (c === 'w') {
        // the eyeball's lit side is toward the key (camera-left); it shades into the far corner
        if (dx < 0 && dx > -e.ir - 3) c = 'W';
        if (t > 0.86 || t < 0.08) c = 'v';
      }
      set(x, y, c);
    }
    // the lid line (thicker across the middle), the lower lid, its light, the crease
    const th = t > 0.1 && t < 0.94 ? lid : 1;
    for (let k = 0; k < th; k++) set(x, top - k, 'L');
    if (t > 0.14 && t < 0.92 && bot > top + 1) set(x, bot, 'k');
    if (t > 0.3 && t < 0.82) set(x, bot + 1, 'h');
    if (t > 0.16 && t < 0.84) set(x, Math.round(yU(x) - th - cr + 0.4), 'l');
  }
  // the corners: the caruncle (inner), the lash flick (outer), both whole pixels
  const inner = e.mirror ? x1 : x0, outer = e.mirror ? x0 : x1;
  const iy = Math.round(yU(inner));
  set(inner, iy + 1, 't');
  const oy = Math.round(yU(outer));
  const out = e.mirror ? -1 : 1;
  set(outer + out, oy, 'L'); set(outer + 2 * out, oy - 1, 'L');
  // the catchlight: up and toward the key (camera-left), on the pupil's edge
  const gx = Math.round(e.ix - e.pr * 0.75 - 0.5), gy = Math.round(e.iy - e.pr * 0.7 - 0.5);
  const gs = e.glint ?? 2;
  for (let j = 0; j < gs; j++) for (let i = 0; i < gs; i++) if (!'.Llkh'.includes(get(gx + i, gy + j))) set(gx + i, gy + j, 'g');
  return rows.map((r) => r.join(''));
};

// ------------------------------------------------------------------ the figure
const cuFig = (): FigureDef => {
  const parts: Part[] = [
    // hood bunched behind the neck (his back is camera-right), then the hoodie shoulders
    {group: 'hood', mat: 'hood', tone: 1, prims: [Bd(58, 96, 62, 86, 74, 80, 90, 83, 100, 92, 106, 106, 110, 120, 90, 118, 74, 108)]},
    {group: 'torso', mat: 'hood', tone: 2, prims: [Bd(2, 150, 5, 118, 14, 104, 28, 97, 42, 94, 70, 94, 88, 98, 102, 108, 112, 124, 118, 150)]},
    // slender neck
    {group: 'neck', mat: 'neck', tone: 1, prims: [Nk(52, 76, 52, 97, 60, 100, 69, 96, 68, 70)]},
    // the hood's rolled edge around the neck; dark inside only behind the neck
    {group: 'collar', mat: 'hoodIn', tone: 2, prims: [Bd(60, 93, 66, 90, 76, 91, 80, 95, 72, 97, 64, 96)]},
    {group: 'roll', mat: 'hood', tone: 2, prims: [Bd(33, 100, 42, 93, 50, 95, 58, 97, 66, 96, 74, 94, 81, 95, 79, 100.5, 68, 103.5, 56, 104.5, 44, 103.5)]},
    // head: cranium + face (3/4, facing camera-left)
    {group: 'head', mat: 'skin', tone: 3, prims: [
      P.ell(2 * 60 + OX, 2 * (47 + 3) + OY, 48, 50),
      J(42, 26, 37, 33, 35, 40, 35, 47, 34, 52, 34.5, 58, 36, 64, 38, 71, 40, 77, 43, 82, 48, 85, 55, 84, 63, 80, 70, 74, 74, 66, 76, 56, 78, 46, 76, 34, 70, 26, 58, 22, 48, 22),
    ]},
    // hair: short sides, a little length on top pushed forward; the COWLICK springs off the front hairline
    {group: 'hair', mat: 'hair', tone: 2, prims: [
      Hd(36, 41, 34, 32, 37, 24, 45, 17, 57, 13, 70, 15, 80, 22, 85, 32, 86, 46, 84.5, 60, 80.5, 70, 76, 62, 75, 52, 72, 46, 70, 38, 66, 34, 63, 32, 60, 34, 57, 31, 53, 33, 49, 31, 45, 34, 41, 33, 38, 37),
      // the cowlick: a lifted forward tuft (drawn a little fuller than the portrait's, it has room here)
      Hd(55, 29, 53.5, 21, 49.5, 15.5, 44, 12, 38, 12.5, 33.5, 15.5, 32.5, 18.5, 35.5, 17, 39.5, 17.5, 43, 20, 45.5, 24, 46.5, 29),
    ]},
    // ear sits over the hair at the side
    {group: 'ear', mat: 'skinD', tone: 3, prims: [J(71.5, 50, 75.5, 46.5, 80, 48.5, 81.5, 55, 80, 62, 77.5, 66.5, 73, 66.5, 71, 60)]},
  ];

  const adjust: Adjust[] = [
    // ======== hair: forward-swept masses (tone 1 valleys, tone 3 lit clumps), 1px strands, the cyan catch
    plane('hair', 1, Hd(71, 17, 80, 23, 84, 32, 85, 44, 83.5, 56, 80, 64, 77, 58, 76, 48, 73, 40, 70, 32, 66, 26, 64, 20)),
    plane('hair', 3, Hd(36, 33, 38, 26, 43, 20.5, 49, 17, 45.5, 21.5, 41, 27, 38.5, 33.5, 37, 38)),
    plane('hair', 3, Hd(47, 16, 53, 14, 60, 13.5, 56, 15.5, 51, 18, 47.5, 20)),
    plane('hair', 4, Hd(36, 31, 38, 26.5, 41.5, 22.5, 39.5, 27, 37.5, 32)),
    plane('hair', 4, Hd(49, 15, 54, 13.8, 52, 15.2)),
    // the cowlick's own light: the lifted front edge catches the key; its underside is dark
    plane('hair', 3, Hd(34, 16, 38, 13, 43, 12.5, 47, 14.5, 43, 14.5, 39, 15)),
    plane('hair', 4, Hd(34.5, 15.5, 37.5, 13.3, 41, 12.8, 38, 14.2)),
    plane('hair', 0, Hd(35.5, 17.2, 39.5, 17.7, 43, 20, 44.5, 23, 41.5, 20.5, 38, 18.5)),
    // strands (whole-pixel lines, crown -> fringe), dark valleys between the clumps
    plane('hair', 1,
      CL(144, 20, 124, 40), CL(128, 18, 108, 38), CL(156, 30, 136, 50), CL(164, 44, 150, 70), CL(112, 18, 96, 36), CL(166, 64, 160, 100),
      CL(138, 26, 122, 44), CL(150, 36, 140, 56), CL(120, 22, 104, 40), CL(160, 56, 154, 80),
    ),
    plane('hair', 0, Hd(70, 38, 72, 46, 75, 52, 72, 48), CL(90, 16, 98, 30), CL(160, 104, 160, 118), CL(76, 18, 84, 20), CL(168, 80, 166, 100)),
    plane('hair', 2, CL(146, 22, 130, 38), CL(134, 20, 116, 38), CL(158, 34, 146, 52)),
    // the sideburn under the ear front: short, soft
    plane('hair', 1, CL(142, 100, 142, 110), CL(143, 100, 143, 108)),

    // ======== face: the portrait's painted planes x2 (tone 3 base under the monitor key)
    // the terminator (mauve, 2) with a 3px bridge (X3) on its lit side; the far cheek (skinD 2) with an X1 band
    // CU-native terminator: an S down the face (the temple, the cheekbone catching the key further round, the hollow
    // under it, the jaw), with a 3px bridge (X3) on its lit side
    plane('skin', 2, C(124, 46, 136, 52, 140, 68, 140, 92, 140, 115, 132, 130, 120, 137, 112, 139, 110, 136, 116, 128, 118, 120, 119, 110, 125, 100, 128, 90, 127, 82, 123, 70, 121, 58)),
    toMat('skin', 'skinB', 2, C(121, 46, 124, 46, 121, 58, 123, 70, 127, 82, 128, 90, 125, 100, 119, 110, 118, 120, 116, 128, 110, 136, 107, 136, 113, 128, 115, 120, 116, 110, 122, 100, 125, 90, 124, 82, 120, 70, 118, 58)),
    toMat('skin', 'skinD', 2, J(68, 36, 74, 38, 77, 46, 76, 56, 74, 66, 70, 74, 63, 80, 57, 83, 56, 80, 60, 79, 66, 74, 70, 66, 70, 56, 70, 44)),
    toMat('skinD', 'skinD', 3, J(68, 36, 69.5, 36.5, 71.5, 44, 71.5, 56, 71.5, 66, 67.5, 75, 61, 80.5, 57, 81.5, 56, 80, 60, 79, 66, 74, 70, 66, 70, 56, 70, 44)),
    // highlights: lit forehead, the far cheekbone (by the contour), the near cheekbone, the chin
    plane('skin', 4, Hd(40, 35, 46, 34, 54, 35, 50, 38, 44, 39, 38, 40.5), C(72, 86, 76, 83, 79, 88, 78, 97, 75, 100, 72, 95), J(42, 78, 47, 77, 49, 81, 44, 82)),
    plane('skin', 5, Hd(41, 36, 45, 35.2, 48, 35.5, 44, 36.3)),
    // brow ridge under the lit forehead: one bridge row, then the sockets
    toMat('skin', 'skinB', 3, Hd(38, 41, 44, 40, 50, 40.5, 62, 40, 64, 42, 50, 42.5, 44, 42, 38, 42.5)),
    plane('skin', 2, Hd(38, 43.5, 44, 43.5, 45, 46, 38, 47), Hd(49, 43.5, 62, 43, 64, 46, 50, 47)),
    // the socket's inner corner by the nose: the deepest point of the eye area
    toMat('skin', 'skinD', 3, C(93, 69, 97, 69, 97, 75, 94, 76)),

    // ======== THE NOSE (CU-native): the ridge catches the key, the side plane turns away, the ala, the nostril
    // the side plane (camera-right) turns off the key: the bridge tone (X3), 2-4 px, deepening (X2) by the ala
    toMat('skin', 'skinB', 2, C(94, 75, 96, 76, 97, 84, 97, 91, 98, 96, 93, 96, 91, 92, 92, 85, 93, 79)),
    plane('skin', 2, C(95, 88, 97, 90, 99, 96, 97, 98, 93, 97, 94, 93)),
    // the ridge highlight, the tip ball and its spec
    plane('skin', 4, C(91, 74, 93, 74, 92, 79, 90, 87, 88, 93, 86, 93, 88, 86, 90, 79)),
    plane('skin', 4, CE(85, 97, 3.2, 2.6)),
    plane('skin', 5, C(84, 95, 85, 95, 85, 96, 84, 96)),
    // the ala (the wing): no separate colour, only its crease (X2, 1 px) curving round the nostril
    plane('skin', 2, CL(90, 96, 94, 96), CL(94, 96, 96, 97), CL(96, 97, 97, 99), CL(97, 99, 97, 101), CL(97, 101, 95, 102)),
    toMat('skin', 'skinB', 2, CL(91, 97, 94, 97), CL(95, 98, 96, 99)),
    // the cast shadow of the nose onto the near cheek (right-below), soft: X3 then X2 at its core
    toMat('skin', 'skinB', 2, C(98, 97, 103, 99, 104, 104, 100, 106, 97, 103)),
    plane('skin', 2, C(98, 100, 100, 101, 100, 104, 98, 103)),
    // the plane under the tip faces down: one cool rung (K1) and a short X2 lip right under the nostril
    toMat('skin', 'skinB', 3, C(80, 101, 86, 102, 93, 103, 97, 104, 94, 105, 84, 105, 80, 103)),
    plane('skin', 2, C(84, 103, 90, 103, 90, 104, 84, 104)),
    // ======== THE MOUTH (CU-native). The line and the lifted corner are stamps; these are the lips around them
    // philtrum (a shallow groove: one bridge-tone column), the upper lip turned down (X2) with a soft bow
    toMat('skin', 'skinB', 2, C(81, 113, 85, 112, 87, 113, 89, 112, 94, 112, 97, 113, 97, 114, 80, 114)),
    // the lower lip: shadow right under the line, then its lit round (K3), the under-lip shadow, the chin ball
    toMat('skin', 'skinB', 3, C(80, 116, 96, 116, 94, 117, 82, 117)),
    plane('skin', 4, C(83, 117, 92, 117, 91, 118, 84, 118)),
    toMat('skin', 'skinB', 2, C(82, 121, 86, 120, 91, 120, 94, 121, 91, 122, 85, 122)),
    plane('skin', 2, C(84, 121, 91, 121, 90, 121, 85, 121)),
    // the near cheek's lower plane and the jaw turning under (chin to ear)
    toMat('skin', 'skinB', 3, J(35, 60, 37, 60, 39, 70, 41, 76, 38, 74, 36, 66)),
    toMat('skin', 'skinB', 2, J(50, 80, 56, 80.5, 60, 79, 55, 82.5, 49, 83)),
    // under the jaw on the neck: deepest shadow; the neck's front catches a little
    plane('neck', 0, J(52, 83, 56, 84, 64, 80, 70, 76, 69, 84, 60, 88, 52, 87)),
    plane('neck', 2, Nk(52, 88, 54, 88, 54, 97, 52, 96)),
    plane('neck', 3, Nk(52.5, 90, 53.5, 90, 53.5, 95, 52.5, 95)),
    // the tendon running from behind the ear to the collarbone (one rung)
    plane('neck', 2, Nk(63, 78, 65, 78, 60, 97, 58, 97)),
    // ear: the rim (helix) lit on its top, the bowl deep, the antihelix one rung up, the lobe
    toMat('skinD', 'skinD', 1, J(74, 52, 77.5, 51, 78.5, 57, 76, 62)),
    toMat('skinD', 'skinD', 4, J(72, 51, 74, 49, 73.5, 60, 72.5, 58)),
    toMat('skinD', 'skinD', 2, J(76, 49.5, 79.5, 50, 80.5, 55, 79.5, 55)),
    toMat('skinD', 'skinD', 2, J(74.5, 55.5, 76.5, 54, 76.5, 59.5, 75, 60)),
    toMat('skinD', 'skinD', 3, J(74, 63, 77, 62.5, 77, 66, 74, 66)),

    // ======== hoodie: the rolled hood edge, the lit chest toward the monitor, folds (x2 of the portrait)
    plane('hood', 3, Bd(34, 99.5, 42, 94, 50, 96, 44, 98.5, 38, 101)),
    plane('hood', 4, Bd(36, 99.5, 42, 95, 46, 96, 41, 97.5)),
    plane('hood', 1, Bd(44, 102, 56, 103, 68, 102, 78, 99, 76, 101, 66, 104, 54, 105)),
    plane('hood', 3, Bd(6, 118, 14, 106, 26, 99, 36, 97, 30, 103, 20, 110, 12, 122)),
    plane('hood', 4, Bd(6, 115, 14, 105, 24, 99, 16, 107, 9, 118)),
    plane('hood', 3, Bd(22, 116, 32, 106, 40, 104, 30, 116, 24, 128)),
    plane('hood', 1, BdL(62, 106, 71, 150), Bd(88, 106, 102, 112, 110, 150, 97, 150)),
    plane('hood', 0, Bd(100, 110, 108, 118, 114, 140, 108, 124)),
    // the hood's bunch behind the neck: a lit lip, the dark fold into it
    plane('hood', 2, Bd(62, 88, 72, 82, 86, 84, 76, 85, 66, 90)),
    plane('hood', 0, Bd(66, 91, 76, 87, 88, 88, 96, 94, 86, 92, 76, 90)),
  ];

  // ======== hand-placed features at CU scale (room coords). Skin chars reference the ramps ([mat, tone]) so the
  // W0-only tungsten option re-ramps them too; lid lines / pupils / catchlights are fixed colours.
  const T = {S0: ['skin', 0], X0: ['skin', 1], X1: ['skinB', 1], X2: ['skin', 2], X3: ['skinB', 2], K1: ['skinB', 3], K2: ['skin', 3], K3: ['skin', 4], K4: ['skin', 5]} as const;
  const EYE_PAL: Stamp['pal'] = {L: PAL.N0, l: [...T.X1], v: [...T.K1], w: [...T.K2], W: [...T.K3], r: PAL.B2, i: PAL.B3, j: PAL.B4, I: PAL.N0, g: PAL.C8, k: [...T.X1], h: [...T.K3], t: [...T.X3]};
  // the near eye: big, calm; the upper lid sits a touch low over the iris (serene). Iris 11 px, pupil 5, the
  // catchlight on the monitor side, the iris's lower-right crescent lit through the cornea (j).
  const NEAR = eyeMap({w: 30, h: 14, up: 4.1, low: 3.3, ix: 14, iy: 8.5, ir: 6.6, pr: 3.1, tilt: 1, lid: 2, crease: 3});
  const FAR = eyeMap({w: 17, h: 13, up: 3.5, low: 2.9, ix: 6.5, iy: 8, ir: 4.6, pr: 2.3, tilt: 1, lid: 2, crease: 2, mirror: true, glint: 1});
  // brows: dense, level, calm; the near brow's head sits over the socket's inner corner, its tail thins and drops
  const BROW_NEAR = [
    '............xxxbbbbbb.......',
    '.......bbbbbbBBBBBBBBBbbb...',
    '...bbbbBBBBBBBBBBBBBBBBBBbb.',
    '.bbBBBBBBBBBBBBBBbbbbb...bbb',
    'bBBBBBBBBbbbbb..........',
    'bbbb....................',
  ];
  const BROW_FAR = [
    '....bbbbbbb.....',
    '.bbbBBBBBBBbb...',
    'bbBBBBBBBBBBBbb.',
    '........bbbbbbb.',
  ];
  // the nostril (a dark comma under the ala) and the ala's lower rim
  const NOSTRIL = [
    '..sss....',
    '.s###s...',
    '.####ss..',
    '..sssss..',
  ];
  // THE SMILE: the mouth line (23 px), the near corner (camera-right, like the portrait) lifted ONE pixel.
  const MOUTH = [
    '.......................#',
    '#######################.',
    '...ooo.............o....',
  ];
  const stamps: Stamp[] = [
    {x: 95, y: 55, rows: BROW_NEAR, pal: {b: PAL.B1, B: PAL.B0, x: PAL.B2}},
    {x: 70, y: 59, rows: BROW_FAR, pal: {b: PAL.B1, B: PAL.B0}},
    {x: 95, y: 62, rows: NEAR, pal: EYE_PAL},
    {x: 71, y: 63, rows: FAR, pal: EYE_PAL},
    {x: 85, y: 100, rows: NOSTRIL, pal: {'#': [...T.S0], s: [...T.X0]}},
    {x: 77, y: 114, rows: MOUTH, pal: {'#': [...T.S0], o: [...T.X0]}},
  ];
  return {w: CU_IMG_W, h: CU_H, parts, adjust, stamps};
};

export type CUFaceLight = 'cyan' | 'tungsten';
const RAMPS: Record<CUFaceLight, LightRig['ramps']> = {
  cyan: {
    skin: [PAL.S0, PAL.X0, PAL.X2, PAL.K2, PAL.K3, PAL.K4],
    skinB: [PAL.S0, PAL.X1, PAL.X3, PAL.K1, PAL.K2, PAL.K3],
    neck: [PAL.S0, PAL.X0, PAL.X1, PAL.X2, PAL.K2, PAL.K3],
    skinD: [PAL.S0, PAL.S0, PAL.X0, PAL.X1, PAL.X2, PAL.K2],
    hair: [PAL.B0, PAL.B0, PAL.B1, PAL.B2, PAL.K1, PAL.C6],
    hood: [PAL.N1, PAL.G0, PAL.G1, PAL.C2, PAL.C3, PAL.C6],
    hoodIn: [PAL.N0, PAL.N0, PAL.N0, PAL.N1, PAL.N1, PAL.N2],
  },
  // W0-ONLY: the same planes under tungsten (the portrait's 'warm' ramps). Not the default; see the header.
  tungsten: {
    skin: [PAL.S0, PAL.S1, PAL.S3, PAL.S4, PAL.S5, PAL.S6],
    skinB: [PAL.S0, PAL.S2, PAL.S3, PAL.S3, PAL.S4, PAL.S5],
    neck: [PAL.S0, PAL.S1, PAL.S2, PAL.S3, PAL.S4, PAL.S5],
    skinD: [PAL.S0, PAL.S0, PAL.S1, PAL.S2, PAL.S3, PAL.S4],
    hair: [PAL.B0, PAL.B1, PAL.B2, PAL.B3, PAL.B4, PAL.W5],
    hood: [PAL.N1, PAL.G0, PAL.G2, PAL.G3, PAL.G4, PAL.W6],
    hoodIn: [PAL.N0, PAL.N0, PAL.N0, PAL.N1, PAL.N1, PAL.N2],
  },
};
const cuRig = (light: CUFaceLight): LightRig => ({
  key: [-0.9, -0.35], keyBand: 0, shadowBand: 0, rim: true, outline: true, edgesOnTop: true, noEdge: ['hoodIn', 'neck'],
  back: null,
  ramps: RAMPS[light],
});

/**
 * The hair's locks: the mass sweeps forward from a whorl at the back of the crown, so strands are drawn along rays
 * from it. Each lock = a dark parting (B0) and, on the side that faces the key, a lit ridge one rung up. Whole-pixel,
 * hashed spacing (never a regular comb), and only on hair pixels that are not already an edge (rim / outline).
 */
const WHORL: [number, number] = [158, 26];
const hairLocks = (img: Img, R: LightRig['ramps']) => {
  const H = R.hair;
  const body = new Set([H[1], H[2], H[3]]);
  const src = new Int32Array(img.c);
  const N = 30; // locks around the full circle (only ~12 are visible on the head)
  for (let y = 0; y < 150; y++) for (let x = 60; x < 190; x++) {
    const i = y * img.w + x;
    const v = src[i];
    if (!body.has(v)) continue;
    const dx = x + 0.5 - WHORL[0], dy = y + 0.5 - WHORL[1];
    const r = Math.hypot(dx, dy);
    if (r < 6) continue;
    const th = (Math.atan2(dy, dx) / (Math.PI * 2) + 1) % 1;
    // wobble the lock boundaries a little along the radius so strands curve (whole px after rounding)
    const u = th * N + 0.35 * Math.sin(r / 9 + th * 17) + hash(Math.floor(th * N), 3, 7) * 0.3;
    const k = Math.floor(u), f = u - k;
    // strands thin out toward the tips (the fringe) and near the whorl
    const lit = x < 150 && y < 60; // the half of the head that faces the key
    if (f < 0.07 * Math.min(1.6, r / 30)) img.c[i] = H[0];
    else if (lit && f > 0.8 && f < 0.93) img.c[i] = v === H[3] ? H[4] : H[3];
    else if (!lit && f > 0.84 && f < 0.92 && hash(k, 9, 2) < 0.6) img.c[i] = H[2];
  }
};

/** THE close-up drawing (300 x 203, placed at x 0 of the room area). One drawing; memoised. */
export const masCU = memo((light: CUFaceLight) => {
  const img = renderFigure(cuFig(), cuRig(light));
  hairLocks(img, RAMPS[light]);
  // the rig lights every lit-side edge of the hair group, including where the hair meets the face and ear; at CU
  // that reads as a wire. Keep the key's rim on the hair's OUTER silhouette only: a rim pixel whose neighbour toward
  // the light is face/ear becomes a lit strand (hair tone 2) instead.
  const R = RAMPS[light];
  const hair = new Set(R.hair), rim = R.hair[5];
  const at = (x: number, y: number) => (x < 0 || y < 0 || x >= img.w || y >= img.h ? -1 : img.c[y * img.w + x]);
  const src = new Int32Array(img.c);
  for (let y = 0; y < img.h; y++) for (let x = 0; x < img.w; x++) {
    if (src[y * img.w + x] !== rim || y > 150) continue;
    const l = src[y * img.w + x - 1], d = at(x - 1, y + 1);
    const face = (v: number) => v >= 0 && !hair.has(v);
    if (face(l) || (l < 0 && face(d)) || y > 96) img.c[y * img.w + x] = R.hair[2];
  }
  return img;
});

// ------------------------------------------------------------------ the backdrops (the light lives here)
export type CUBackdrop = 'strip' | 'lobby';

/**
 * Out-of-focus light, pixel style: a disc whose body is an ordered 50% screen over what's behind (it reads as a
 * translucent blur), a solid 1px rim one rung up, an optional solid core. Backgrounds only (never on skin).
 */
const bokeh = (b: Buf, cx: number, cy: number, r: number, body: number, rimC: number, core?: number, cov = 0.5) => {
  for (let j = -r - 1; j <= r + 1; j++) for (let i = -r - 1; i <= r + 1; i++) {
    const d = Math.hypot(i + 0.5 - 0.5, j + 0.5 - 0.5);
    if (d > r + 0.3) continue;
    const X = cx + i, Y = cy + j;
    if (X < 0 || Y < 0 || X >= b.w || Y >= CU_H) continue;
    if (d > r - 0.7) { if (bayer(X, Y) < 0.8) b.set(X, Y, rimC); }
    else if (core !== undefined && d < r * 0.45) b.set(X, Y, core);
    else if (bayer(X, Y) < cov) b.set(X, Y, body);
  }
};
/** a soft glow: stepped rings of `cols` (inner -> outer), each seam an ordered dither */
const glow = (b: Buf, cx: number, cy: number, rx: number, ry: number, cols: number[], x0 = 0, y0 = 0, x1 = CU_W, y1 = CU_H) => {
  const n = cols.length;
  for (let y = Math.max(y0, Math.floor(cy - ry)); y < Math.min(y1, Math.ceil(cy + ry)); y++)
    for (let x = Math.max(x0, Math.floor(cx - rx)); x < Math.min(x1, Math.ceil(cx + rx)); x++) {
      const d = Math.hypot((x + 0.5 - cx) / rx, (y + 0.5 - cy) / ry);
      if (d >= 1) continue;
      const k = d * n + (bayer(x, y) - 0.5) * 0.9;
      const idx = Math.floor(k);
      if (idx >= 0 && idx < n) b.set(x, y, cols[idx]);
    }
};

/**
 * sc 26: the suite, stepped down behind him until only the Strip's neon and the laptop's glow are left. Out of
 * focus: the blue-glass tower's cyan neon becomes a tall soft glow right behind the back of his head (so his dark
 * side still separates), its lit windows cyan bokeh; the red marquee a soft red pool with rows of warm bulb bokeh
 * (held: the drop-out is silence; `live` lets them chase on 3s); one dark mullion; the laptop's cyan rising off the
 * bottom-left behind his shoulder.
 */
const stripBackdrop = (b: Buf, f: number, live: boolean) => {
  for (let y = 0; y < CU_H; y++) for (let x = 0; x < CU_W; x++) {
    const t = y / CU_H + (bayer(x, y) - 0.5) * 0.1;
    b.set(x, y, t < 0.4 ? PAL.N1 : t < 0.75 ? PAL.N2 : PAL.N3);
  }
  // the blue-glass tower behind his head, out of focus: a tall face of cyan glass (C0/C1), its lit floors as soft
  // dotted rows, and the neon tube on its edge defocused to a soft C2 line with a C1 halo (so the dark back of his
  // head separates against it)
  for (let y = 0; y < CU_H; y++) for (let x = 168; x < 262; x++) {
    const d = Math.abs(x + 0.5 - 215) / 47 + (bayer(x, y) - 0.5) * 0.18;
    if (d > 1) continue;
    let c = d < 0.62 ? PAL.C1 : PAL.C0;
    if (y % 9 < 2 && d < 0.8 && bayer(x, y) < 0.5) c = d < 0.5 ? PAL.C2 : PAL.C1;
    b.set(x, y, c);
  }
  for (let y = 0; y < CU_H; y++) for (let x = 250; x < 266; x++) {
    const d = Math.abs(x + 0.5 - 258) + (bayer(x, y) - 0.5) * 2;
    b.set(x, y, d < 1.2 ? PAL.C3 : d < 3 ? PAL.C2 : d < 6 ? PAL.C1 : b.get(x, y));
  }
  // the tower's lit floors far off: cyan bokeh up the right half, a few smaller and fainter
  const cyanB: Array<[number, number, number]> = [[282, 26, 7], [306, 58, 5], [262, 84, 4], [338, 20, 9], [372, 48, 6], [410, 16, 5], [446, 40, 8], [398, 76, 4], [468, 70, 5], [320, 104, 3]];
  for (const [x, y, r] of cyanB) bokeh(b, x, y, r, PAL.C1, PAL.C2, r > 6 ? PAL.C1 : undefined, 0.45);
  // the marquee: a red pool, then its bulbs as warm bokeh in three soft rows (held unless live)
  glow(b, 404, 150, 96, 62, [PAL.R1, PAL.R0, PAL.W1, PAL.W0]);
  for (let row = 0; row < 3; row++) for (let k = 0; k < 7; k++) {
    const X = 336 + k * 22 + (row % 2) * 11, Y = 122 + row * 24;
    const on = live ? (k + row + Math.floor(f / 3)) % 3 !== 0 : (k + row) % 3 !== 0;
    bokeh(b, X, Y, 6, on ? PAL.W4 : PAL.R1, on ? PAL.W6 : PAL.R2, on ? PAL.W5 : undefined, 0.5);
  }
  // one mullion of the suite window (dark; the laptop's cyan catching its left face)
  rect(292, 0, 5, CU_H, b.ink(PAL.N0)); rect(292, 0, 1, CU_H, b.ink(PAL.C0));
  // the laptop's glow: a cyan pool rising off the bottom-left behind his shoulder
  glow(b, 0, CU_H + 10, 170, 120, [PAL.C2, PAL.C1, PAL.C0], 0, 0, 200, CU_H);
};

/**
 * sc 30: the lobby at night, behind him. THE SIGN's cream lightbox sits right behind the back of his head (its letter
 * rows defocused to soft bars, never legible here), its tungsten halo stepping out through W7..W3; the reception
 * tea-lights as warm bokeh low; the rack pillar's cyan LEDs far left, faint (so his key still has a source). The face
 * is the same drawing as sc 26: the light change is ALL here.
 */
const lobbyBackdrop = (b: Buf, f: number) => {
  void f;
  for (let y = 0; y < CU_H; y++) for (let x = 0; x < CU_W; x++) {
    const t = y / CU_H + (bayer(x, y) - 0.5) * 0.1;
    b.set(x, y, t < 0.55 ? PAL.N1 : PAL.N2);
  }
  // the sign's tungsten halo spreading over the wall, then the lightbox itself: behind the back of his head, its top
  // cropped by the frame (it is a big sign, close), its edges defocused into the halo
  const sx = 146, sy = -14, sw = 272, sh = 142;
  glow(b, sx + sw / 2, sy + sh / 2, sw * 0.74, sh * 0.92, [PAL.W6, PAL.W5, PAL.W4, PAL.W3, PAL.W2, PAL.W1]);
  for (let j = -3; j < sh + 3; j++) for (let i = -3; i < sw + 3; i++) {
    const X = sx + i, Y = sy + j;
    if (Y < 0 || Y >= CU_H) continue;
    const inset = Math.min(i, j, sw - 1 - i, sh - 1 - j);
    const bz = bayer(X, Y);
    let c: number;
    if (inset < 0) { if (bz > (inset + 3.5) / 3.5) continue; c = PAL.W7; }
    else if (inset < 3) c = bz < 0.5 ? PAL.W8 : PAL.P2;
    else c = PAL.P2;
    b.set(X, Y, c);
  }
  // the letter rows: soft low-contrast bars (P1 with a P0 core), dithered ends: unreadable at this focus
  const rowsW = [168, 132, 150, 176];
  rowsW.forEach((rw, r) => {
    for (let i = -4; i < rw + 4; i++) for (let j = -2; j < 13; j++) {
      const X = sx + 20 + i, Y = sy + 26 + r * 27 + j;
      if (Y < 0) continue;
      const e = Math.max(-i, i - rw + 1, -j, j - 10, 0);
      const bz = bayer(X, Y);
      if (e > 0 && bz > 0.5 - e * 0.12) continue;
      b.set(X, Y, e > 0 ? PAL.P1 : j > 2 && j < 8 && i > 2 && i < rw - 3 ? (bz < 0.5 ? PAL.P0 : PAL.P1) : PAL.P1);
    }
  });
  for (let j = -2; j < 48; j++) for (let i = -2; i < 34; i++) {
    const X = sx + sw - 58 + i, Y = sy + 44 + j;
    const e = Math.max(-i, i - 31, -j, j - 45, 0);
    const edge = i < 3 || i > 28 || j < 3 || j > 42;
    if (e > 0 && bayer(X, Y) > 0.4) continue;
    b.set(X, Y, e > 0 ? PAL.P1 : edge ? (bayer(X, Y) < 0.5 ? PAL.R1 : PAL.S4) : PAL.P1);
  }
  // the reception tea-lights: a low row of warm bokeh
  for (let k = 0; k < 9; k++) bokeh(b, 196 + k * 34, 178 + (k % 2) * 3, 7, PAL.W3, PAL.W5, PAL.W4, 0.5);
  // the rack pillar's cyan LEDs far left: faint small bokeh
  for (let k = 0; k < 7; k++) bokeh(b, 10 + (k % 2) * 6, 14 + k * 26, 3, PAL.C1, PAL.C3, undefined, 0.5);
};

export const drawCUBackdrop = (b: Buf, backdrop: CUBackdrop, f = 0, o: {live?: boolean} = {}) => {
  if (backdrop === 'strip') stripBackdrop(b, f, !!o.live);
  else lobbyBackdrop(b, f);
};

/**
 * The [CU] shot: the backdrop, then THE drawing. Paint into the room area (y 0..202); the rail band below is the
 * rail builder's (sc 26: `RAIL: +1 FIRING` types on the shot's third beat; sc 30: nothing lands on the face, "okay."
 * plays over the next shot's hands). f only matters with `live` (the marquee bulbs); the face never changes.
 */
export const drawMasCU = (b: Buf, o: {backdrop: CUBackdrop; f?: number; live?: boolean; face?: CUFaceLight}) => {
  drawCUBackdrop(b, o.backdrop, o.f ?? 0, {live: o.live});
  blitTo(b, masCU(o.face ?? 'cyan'), 0, 0, {clip: (_x, y) => y < CU_H});
};

// ------------------------------------------------------------------ the EYES STRIP (480 x 64, 5 pupil positions)
export const EYES_W = 480, EYES_H = 64;
export type EyesPos = -2 | -1 | 0 | 1 | 2;
void line;
export const drawEyesStrip = (_b: Buf, _y0: number, _pos: EyesPos) => { /* built below */ };
