// MR. MAS — cast: RADNUS at bust scale, a STAND-IN (new file, owned by the `v3-art-b` pass). RADNUS is the `v3-art-a`
// pass's rig (cast/radnus.ts: a room sprite only, no bust), so sc 13's two-shots and pan need this bust: a placeholder on
// the civic kit in art-a's colours (the navy sweater, the pale collar, the brown skin, the dark hair), built to his character file (show/characters/radnus.md: slim, calm, hands folded, a soft sweater or open
// collar, the serene half-smile that never changes, even on fire) so the sc 13 plates compose and read. When art-a's
// module lands, the plates take its drawings instead (rooms/whitehouse.ts `radnus` hooks) and this file retires.
//   radnusBust / RADNUS_BUST_DEFAULT  112 x 136, 3/4 facing camera-left: a sage sweater over an open collar, neat dark
//                                     hair. arm: 'fold' | 'write' (a pen, writing it down) | 'pat' (patting at the
//                                     collar flame) | 'lean' (the head a step forward). look 'up' for the ceiling camera.
//   (his room sprite is art-a's: cast/radnus.ts drawRadnus)
//   RADNUS_COLLAR                     where the small flame sits on his collar (bust local)
import {PAL} from '../palette';
import {FigureDef, Img, LightRig, P, Part, Stamp, Adjust, renderFigure} from '../figure';
import {memo} from './kit';
import {bustHead, suitTorso, plane, SKIN, HAIR, CIV_W, CIV_H, FaceState, FACE_DEFAULT} from './civic-kit';

export type RadnusArm = 'fold' | 'write' | 'pat' | 'lean';
export interface RadnusBustState extends FaceState { arm: RadnusArm; up?: boolean; }
export const RADNUS_BUST_DEFAULT: RadnusBustState = {...FACE_DEFAULT, mouth: 'smile', arm: 'fold'};
/** the flame's base on his collar (bust local): the near collar point */
export const RADNUS_COLLAR: [number, number] = [48, 108];
const SWEATER = [PAL.N0, PAL.N2, PAL.N4, PAL.N5, PAL.N6, PAL.N8]; // art-a's cast/radnus.ts sweater

const bustFig = (s: RadnusBustState): FigureDef => {
  const hd = bustHead({soft: false, dy: s.arm === 'lean' ? 2 : 0, dx: s.arm === 'lean' ? -3 : 0}, {...s, brow: s.up ? 1 : s.brow}, {browCol: PAL.B0});
  const tor = suitTorso({kind: 'blazer', noTie: true});
  const parts: Part[] = [...tor.parts, ...hd.parts,
    {group: 'hair', mat: 'hair', tone: 3, prims: [P.poly(45, 36, 48, 28, 55, 22, 65, 18, 76, 19, 84, 24, 88, 32, 88, 44, 86, 50, 84, 42, 80, 36, 72, 33, 62, 33, 54, 34, 48, 38)].map((p) => (s.arm === 'lean' && p.k === 'poly' ? {...p, pts: p.pts.map((v, i) => v + (i % 2 ? 2 : -3))} : p))},
  ];
  const adjust: Adjust[] = [...tor.adjust, ...hd.adjust,
    plane('hair', 4, P.poly(47, 32, 52, 26, 60, 21, 56, 27, 50, 33)),
    plane('hair', 2, P.line(58, 28, 78, 26), P.line(66, 31, 84, 33)),
    // the sweater's knit: a soft rib (every third column a rung down)
    {prims: [P.map(20, 110, Array.from({length: 30}, () => Array.from({length: 96}, (_, i) => (i % 3 === 0 ? '#' : '.')).join('')))], add: -1, onlyMat: 'suit'},
  ];
  const stamps: Stamp[] = [...tor.stamps, ...hd.stamps];
  if (s.up) stamps.forEach((st) => { if (st.rows.some((r) => r.includes('I'))) st.rows = st.rows.map((r, j) => (j === 1 ? r.replace(/I/g, 'w') : j === 0 ? r.replace(/L/g, 'L') : r)); });
  if (s.arm === 'fold' || s.arm === 'lean') stamps.push({x: 34, y: 120, rows: [
    '....oooooo..oooooo....',
    '...oLLLLLLooLLLLLLo...',
    '..oLlLlLlLlLlLlLlLlo..',
    '.oLlLlLlLlLlLlLlLlLlo.',
    'ollllllllllllllllllllo',
    '.ommmmmmmmmmmmmmmmmmo.',
    '..oooooooooooooooooo..',
  ], pal: {o: PAL.S0, L: PAL.S3, l: PAL.S2, m: PAL.S1}});
  if (s.arm === 'write') stamps.push({x: 30, y: 124, rows: ['..........g.', '.........K..', '..ooooooK...', '.oLLLLLKo...', 'olllllllo...', '.ommmmmo....'], pal: {o: PAL.S0, L: PAL.S4, l: PAL.S3, m: PAL.S2, K: PAL.N0, g: PAL.W6}});
  if (s.arm === 'pat') {
    parts.push({group: 'sleeve', mat: 'suit', tone: 2, prims: [P.poly(12, 136, 18, 116, 30, 104, 40, 106, 34, 120, 28, 136)]});
    stamps.push({x: 38, y: 98, rows: ['.oooooo.', 'oLLLLLlo', 'oLlLlLlo', 'olllllmo', '.ommmmo.'], pal: {o: PAL.S0, L: PAL.S4, l: PAL.S3, m: PAL.S2}});
  }
  return {w: CIV_W, h: CIV_H, parts, adjust, stamps};
};
const RIG: LightRig = {
  key: [-0.95, -0.35], keyBand: 0, shadowBand: 0, rim: true, outline: true, edgesOnTop: true, noEdge: ['shirt', 'throat'],
  back: [1, -0.2], backBand: 1,
  backRamp: {skin: PAL.S3, suit: PAL.N6, hair: PAL.B3},
  ramps: {skin: SKIN.deep, hair: HAIR.dark, suit: SWEATER, shirt: [PAL.N1, PAL.G3, PAL.G4, PAL.G5, PAL.G6, PAL.P2]},
};
export const radnusBust = memo((s: RadnusBustState): Img => renderFigure(bustFig(s), RIG));
