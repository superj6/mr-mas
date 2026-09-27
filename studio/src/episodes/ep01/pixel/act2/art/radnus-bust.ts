// MR. MAS — Ep1 Act Two (sc 13): RADNUS AT BUST SCALE, the proper drawing (new file, owned by the `v3-shots-act2-act3`
// pass; additive: it replaces the `v3-art-b` stand-in bust `cast/radnus-standin.ts` in THIS segment's layouts only, and
// edits nothing). Built on the civic cast kit (cast/civic-kit.ts: the shared skull, the six mouths, the three lids) to
// art-a's RADNUS (cast/radnus.ts: the room sprite; show/characters/radnus.md): slim and calm; a soft NAVY sweater (art-a's
// ramp, the room sprite's bright navy, not the stand-in's blazer), a shallow V at the neck with a pale open collar
// lying over it; short, neat dark hair with a side part; the serene closed half-smile that never changes, even when he
// is (very slightly) on fire. Hands folded on the table. Caricature by silhouette and props, never a likeness.
//   radnusBust2 / RADNUS2_DEFAULT   112 x 136, 3/4 facing camera-left (the civic busts' view).
//                                   arm: 'fold' (the forearms on the table, the hands folded) · 'write' (the near hand
//                                   low with a pen; `pen` 0 | 1 = its two held drawings) · 'pat' (the far hand up at the
//                                   near collar point, patting at the flame) · 'lean' (the head a step forward: 13.09)
//                                   · 'none' (no forearms: a bust cut high, the row's pan 13.07)
//                                   up: the eyes and brows to the ceiling camera (13.07). Six mouths, three lids, a dart.
//   RADNUS2_COLLAR                  where the small flame sits on his collar (bust local): the near collar point
//   drawExtinguisherSmall(b, x, footY)  his prop at the two-shot's table scale (12 x 26): ELGOOG's skewed primaries,
//                                   deliberately off-brand (art-a's colours: red body, yellow band, green label, blue
//                                   nozzle), stood on the table in front of him like a water bottle
import {Buf, rect} from '../../../../../shared/pixel/px';
import {PAL} from '../../../../../shared/pixel/palette';
import {FigureDef, Img, LightRig, P, Part, Stamp, Adjust, renderFigure} from '../../../../../shared/pixel/figure';
import {memo} from '../../../../../shared/pixel/cast/kit';
import {bustHead, plane, CIV_W, CIV_H, FaceState, FACE_DEFAULT} from '../../../../../shared/pixel/cast/civic-kit';

export type Radnus2Arm = 'fold' | 'write' | 'pat' | 'lean' | 'none';
export interface Radnus2State extends FaceState { arm: Radnus2Arm; up?: boolean; pen?: 0 | 1; }
export const RADNUS2_DEFAULT: Radnus2State = {...FACE_DEFAULT, mouth: 'smile', arm: 'fold'};
/** the near collar point's tip (bust local): the flame's base */
export const RADNUS2_COLLAR: [number, number] = [50, 106];

// art-a's cast/radnus.ts RLIT ramps, [outline, shadow, mid, light, bright, rim]
const SKIN_R = [PAL.S0, PAL.S1, PAL.S2, PAL.S3, PAL.S4, PAL.S5];
const HAIR_R = [PAL.N0, PAL.B0, PAL.B1, PAL.B2, PAL.B3, PAL.N7];
const SWEATER_R = [PAL.N0, PAL.N2, PAL.N4, PAL.N5, PAL.N6, PAL.N8];
const SHIRT_R = [PAL.N1, PAL.G3, PAL.G4, PAL.G5, PAL.G6, PAL.P2];

const bustFig = (s: Radnus2State): FigureDef => {
  const lean = s.arm === 'lean';
  const hdx = lean ? -3 : 0, hdy = lean ? 2 : s.up ? -2 : 0;
  const face: FaceState = {...s, brow: s.up ? 1 : s.brow};
  const hd = bustHead({soft: true, jaw: 1, dx: hdx, dy: hdy}, face, {eye: 'calm', browCol: PAL.N0});
  const H = (...pts: number[]) => P.poly(...pts.map((v, i) => v + (i % 2 ? hdy : hdx)));
  const HLn = (x0: number, y0: number, x1: number, y1: number) => P.line(x0 + hdx, y0 + hdy, x1 + hdx, y1 + hdy);
  const parts: Part[] = [
    // the sweater: slim, soft rounded shoulders (no lapels, no seams: a knit), the hem out of frame
    {group: 'torso', mat: 'sweater', tone: 3, prims: [P.poly(22, 150, 23, 124, 30, 111, 42, 104, 54, 101, 70, 101, 84, 104, 96, 110, 105, 119, 110, 132, 112, 150)]},
    // the open shirt under the V, and its collar band round the neck
    {group: 'shirt', mat: 'shirt', tone: 3, prims: [P.poly(51, 100, 57, 104, 64, 105, 72, 101, 68, 114, 62, 121, 56, 113), P.poly(51, 96, 56, 99, 63, 100, 72, 97, 74, 101, 71, 104, 63, 106, 57, 104, 51, 100)]},
    {group: 'throat', mat: 'skin', tone: 2, prims: [P.poly(57, 100, 65, 101, 63, 109, 60, 109)]},
    ...hd.parts,
    // the hair: short and neat, a clean hairline across the forehead, trimmed over the ear, full on top
    {group: 'hair', mat: 'hair', tone: 2, prims: [H(44, 39, 45, 31, 50, 24, 58, 19, 68, 16, 78, 17, 85, 22, 89, 30, 90, 40, 89, 49, 86, 49, 84, 41, 80, 36, 73, 33, 65, 32, 57, 33, 51, 35, 47, 40), H(79, 44, 83, 44, 82, 51, 79, 51)]},
  ];
  const adjust: Adjust[] = [...hd.adjust,
    // the near shoulder in the key, the far side of the chest falling off (a knit: soft planes, no lapels)
    plane('sweater', 4, P.poly(30, 111, 42, 104, 52, 102, 50, 110, 42, 121, 33, 119)),
    plane('sweater', 5, P.line(31, 111, 41, 105)),
    plane('sweater', 2, P.poly(80, 104, 96, 110, 105, 119, 109, 131, 111, 150, 92, 150, 84, 122, 76, 108)),
    plane('sweater', 1, P.poly(98, 118, 105, 121, 110, 134, 111, 150, 104, 150, 101, 130)),
    // the V's ribbed edge: the near side lit, the far side in shade, the point of the V
    plane('sweater', 5, P.line(49, 103, 61, 123), P.line(50, 103, 62, 123)),
    plane('sweater', 2, P.line(74, 102, 63, 123), P.line(75, 103, 64, 124)),
    // the sweater's soft fold under the near arm, and the knit's faint rows across the chest (every 4th row a rung
    // down, held: a knit, not a pinstripe)
    plane('sweater', 3, P.line(36, 126, 46, 134)),
    {prims: [P.map(26, 112, Array.from({length: 38}, (_, j) => Array.from({length: 84}, (_, i) => (j % 4 === 0 && (i + (j >> 2)) % 2 === 0 ? '#' : '.')).join('')))], add: -1, onlyMat: 'sweater'},
    // the collar: the near point lies over the V's edge (lit), the far point tucked under the jaw's shade, the band
    plane('shirt', 5, P.poly(49, 99, 56, 104, 55, 110, 48, 105), P.line(51, 96, 56, 99)),
    plane('shirt', 4, P.poly(50, 100, 55, 104, 54, 108, 49, 105)),
    plane('shirt', 1, P.poly(67, 101, 74, 98, 76, 105, 70, 107)),
    plane('shirt', 2, P.poly(64, 106, 71, 103, 69, 112, 65, 112)),
    plane('skin', 3, P.poly(58, 101, 63, 102, 61, 107, 59, 106)),
    // the hair: the lit crown and the swept front, the side part (a dark line from the front toward the crown), the
    // strands' partings, the neat trimmed edge over the ear in shadow
    plane('hair', 3, H(47, 36, 50, 28, 56, 22, 63, 19, 60, 24, 55, 30, 51, 35)),
    plane('hair', 4, HLn(50, 28, 57, 21)),
    plane('hair', 0, HLn(58, 32, 69, 19)),
    plane('hair', 3, HLn(60, 31, 70, 21), HLn(47, 38, 52, 33)),
    plane('hair', 1, HLn(72, 21, 84, 28), HLn(74, 26, 86, 34), HLn(80, 33, 87, 42)),
    plane('hair', 1, H(84, 40, 89, 42, 89, 49, 86, 48)),
    plane('hair', 3, HLn(46, 39, 49, 35)),
  ];
  const stamps: Stamp[] = [...hd.stamps];
  if (s.up && s.lid === 0) {
    // the eyes rolled up to the ceiling camera: the irises on the lid line, the whites under them (over the kit's eyes)
    stamps.push({x: 55 + hdx, y: 47 + hdy, rows: ['..LLIILLL..', '.LwIIgwww..', '..kwwwwk...'], pal: {L: PAL.N0, w: PAL.P1, I: PAL.N0, g: PAL.W8, k: PAL.S2}});
    stamps.push({x: 44 + hdx, y: 48 + hdy, rows: ['.LI.', 'LIIw', '.ww.'], pal: {L: PAL.N0, w: PAL.P1, I: PAL.N0}});
  }
  // the arms
  const HAND = {o: PAL.S0, h: PAL.S5, L: PAL.S4, l: PAL.S3, m: PAL.S2};
  if (s.arm === 'fold' || s.arm === 'lean') {
    // the forearms lying on the table toward the middle, the hands folded one over the other (the table cuts at ~126)
    parts.push({group: 'foreN', mat: 'sweater', tone: 3, prims: [P.poly(16, 136, 20, 126, 30, 121, 48, 122, 50, 130, 30, 132, 22, 136)]});
    parts.push({group: 'foreF', mat: 'sweater', tone: 2, prims: [P.poly(108, 136, 104, 126, 92, 121, 72, 122, 70, 130, 92, 132, 104, 136)]});
    adjust.push(plane('sweater', 4, P.poly(20, 126, 30, 121, 46, 121, 45, 123, 30, 123, 22, 127)), plane('sweater', 1, P.poly(72, 129, 92, 131, 104, 136, 94, 132)));
    stamps.push({x: 46, y: 119, rows: [
      '...oooooooo.......',
      '..oLLLLLLLLoo.....',
      '.oLhLLLLLLLLlo....',
      'oLLLLllLLLLLllooo.',
      'oLlLlLlLlLlLlmmllo',
      'olllllllllllllmmmo',
      '.ommmmmmmmmmmmmmo.',
      '..oooooooooooooo..',
    ], pal: HAND});
  }
  if (s.arm === 'write') {
    // the far forearm flat on the table, the near hand low on the pad with the pen (two held drawings: the pen moves)
    parts.push({group: 'foreF', mat: 'sweater', tone: 2, prims: [P.poly(108, 136, 104, 126, 90, 121, 74, 123, 72, 131, 92, 132, 104, 136)]});
    parts.push({group: 'foreN', mat: 'sweater', tone: 3, prims: [P.poly(14, 136, 18, 125, 28, 120, 40, 122, 40, 131, 26, 132, 18, 136)]});
    adjust.push(plane('sweater', 4, P.poly(18, 125, 28, 120, 38, 121, 37, 123, 28, 123, 20, 127)));
    stamps.push({x: 70, y: 121, rows: ['..oooooo...', '.oLLLLLLoo.', 'oLlLlLlLllo', 'olllllllmmo', '.ommmmmmmo.'], pal: HAND});
    const px = s.pen ? 2 : 0;
    stamps.push({x: 34 + px, y: 117, rows: [
      '..........g.',
      '.........K..',
      '........K...',
      '..ooooooK...',
      '.oLLLLLKLo..',
      'oLhLlLlLllo.',
      'olllllllmmo.',
      '.ommmmmmmo..',
    ], pal: {...HAND, K: PAL.N0, g: PAL.W6}});
  }
  if (s.arm === 'pat') {
    // the far arm comes across the chest and the hand pats at the near collar point (the flame's spot); the near
    // forearm stays on the table
    parts.push({group: 'foreN', mat: 'sweater', tone: 3, prims: [P.poly(16, 136, 20, 126, 30, 121, 48, 122, 50, 130, 30, 132, 22, 136)]});
    parts.push({group: 'sleeve', mat: 'sweater', tone: 2, prims: [P.poly(100, 136, 94, 124, 80, 114, 64, 108, 58, 112, 66, 120, 80, 128, 88, 136)]});
    adjust.push(plane('sweater', 3, P.poly(64, 108, 80, 114, 78, 116, 63, 111)));
    stamps.push({x: 50, y: 121, rows: ['..oooooo...', '.oLLLLLLoo.', 'oLlLlLlLllo', 'olllllllmmo', '.ommmmmmmo.'], pal: HAND});
    stamps.push({x: 50, y: 101, rows: [
      '...oooooo..',
      '..oLhLLLLo.',
      '.oLLLLLLLLo',
      'oLlLlLlLlLo',
      'olllllllllo',
      '.olmlmlmmo.',
      '..ooooooo..',
    ], pal: HAND});
  }
  return {w: CIV_W, h: CIV_H, parts, adjust, stamps};
};
const RIG: LightRig = {
  key: [-0.95, -0.35], keyBand: 0, shadowBand: 0, rim: true, outline: true, edgesOnTop: true, noEdge: ['shirt', 'throat'],
  back: [1, -0.2], backBand: 1,
  backRamp: {skin: PAL.S3, sweater: PAL.N7, hair: PAL.N5},
  ramps: {skin: SKIN_R, hair: HAIR_R, sweater: SWEATER_R, shirt: SHIRT_R},
};
export const radnusBust2 = memo((s: Radnus2State): Img => renderFigure(bustFig(s), RIG));

/** his extinguisher at the two-shot's table scale, stood on the table (foot on footY): 12 x 26 */
export const drawExtinguisherSmall = (b: Buf, x: number, footY: number) => {
  const R = [
    '....nnnn....',
    '...n....n...',
    '..nn.....n..',
    '...kkkk...n.',
    '..kWWRRk..n.',
    '.kWRRRRRk.n.',
    '.kRRRRRRk...',
    '.kyyyyyyk...',
    '.kYYYYYYk...',
    '.kRRRRRRk...',
    '.kWRRRRrk...',
    '.kRggggrk...',
    '.kRgGGgrk...',
    '.kRgGGgrk...',
    '.kRggggrk...',
    '.kWRRRRrk...',
    '.kRRRRRrk...',
    '.kRRRRRrk...',
    '.kRRRRRrk...',
    '.kRRRRRrk...',
    '.kWRRRrrk...',
    '.kRRRRrrk...',
    '.kRRRRrrk...',
    '.krrrrrrk...',
    '..kkkkkk....',
    '.oooooooo...',
  ];
  const pal: Record<string, number> = {n: PAL.N6, k: PAL.N0, W: PAL.W6, R: PAL.R3, r: PAL.R2, y: PAL.W7, Y: PAL.W6, g: PAL.L2, G: PAL.L3, o: PAL.D1};
  const y0 = footY - R.length;
  R.forEach((row, j) => { for (let i = 0; i < row.length; i++) { const c = pal[row[i]]; if (c !== undefined) b.set(x + i, y0 + j, c); } });
  rect(x + 7, y0 - 1, 2, 1, b.ink(PAL.N7)); // the nozzle's blue tip
};
