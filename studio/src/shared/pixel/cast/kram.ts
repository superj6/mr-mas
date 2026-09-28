// MR. MAS — cast: KRAM, the Atem founder, mute (Ep1 v3.1 v31-18.00b; new file, owned by the `v3-art-b` pass). The v3.1
// notes: "a mute founder in a hoodie printed OPEN SOURCE, the paint dry, plate KRAM" (guardrails §6: his family never;
// the soup and the checks are later episodes' jokes). Caricature by silhouette and one prop: the roll call's short curly
// crop (cast/rollcall.ts drawKram, bosses.ts HEAD_KRAM), a plain grey hoodie with the words hand-painted across the
// chest, a level, unreadable face with the mouth shut. Never a likeness.
//   kramBust / KRAM_BUST_DEFAULT   112 x 136, 3/4 facing camera-left (the civic busts' view). light 'slate' (the
//                                  landlord's lobby: a cool key) | 'room'. step: 0 in place | 1 half a step behind (he
//                                  steps into the lobby: the caller shifts him)
import {PAL} from '../palette';
import {FigureDef, Img, LightRig, P, Part, Stamp, Adjust, renderFigure} from '../figure';
import {memo} from './kit';
import {text, textWidth} from '../font';
import {Buf} from '../px';
import {bustHead, suitTorso, plane, SKIN, SKIN_CYAN, CIV_W, CIV_H, FaceState, FACE_DEFAULT} from './civic-kit';

export interface KramBustState extends FaceState { light: 'slate' | 'room'; }
export const KRAM_BUST_DEFAULT: KramBustState = {...FACE_DEFAULT, mouth: 'rest', light: 'slate'};
const HEAD = {jaw: 1, dy: 2};
const bustFig = (s: KramBustState): FigureDef => {
  const hd = bustHead(HEAD, {...s, mouth: s.mouth === 'smile' ? 'rest' : s.mouth}, {browCol: PAL.B1, mouthW: 0});
  const tor = suitTorso({kind: 'jacket'});
  const parts: Part[] = [
    // the hood bunched behind his neck (drawn first: the head sits in front of it)
    {group: 'hood', mat: 'hoodie', tone: 2, prims: [P.poly(40, 106, 44, 94, 58, 90, 76, 92, 90, 100, 92, 110, 70, 104, 54, 104)]},
    ...tor.parts.map((pt) => ({...pt, mat: pt.mat === 'suit' ? 'hoodie' : pt.mat === 'shirt' ? 'hoodie' : pt.mat})),
    ...hd.parts,
    // the short curly crop: tight curls close to the head
    {group: 'hair', mat: 'hair', tone: 3, prims: [P.poly(46, 36, 49, 28, 56, 22, 66, 19, 76, 20, 84, 25, 88, 33, 88, 44, 86, 49, 84, 42, 80, 36, 72, 33, 62, 33, 54, 34, 48, 39)]},
  ];
  // (the jacket's open front edges, its tone-0 lines, are left out: a hoodie has no lapels, and they crossed the words)
  const adjust: Adjust[] = [...tor.adjust.filter((a) => !(a.onlyMat === 'suit' && a.tone === 0)).map((a) => ({...a, onlyMat: a.onlyMat === 'suit' || a.onlyMat === 'shirt' ? 'hoodie' : a.onlyMat})), ...hd.adjust,
    // the curls: a grid of lit crescents and dark cores (never a flat cap)
    {prims: [P.map(46, 20, Array.from({length: 18}, (_, j) => Array.from({length: 44}, (_, i) => ((i + (j % 2) * 2) % 4 === 0 ? '#' : '.')).join('')))], tone: 4, onlyMat: 'hair'},
    {prims: [P.map(46, 21, Array.from({length: 18}, (_, j) => Array.from({length: 44}, (_, i) => ((i + 2 + (j % 2) * 2) % 4 === 0 ? '#' : '.')).join('')))], tone: 1, onlyMat: 'hair'},
    // the hoodie's drawstrings and its front seam
    plane('hoodie', 4, P.line(56, 104, 55, 109), P.line(66, 104, 67, 109)), // the drawstrings stop above the words (a string through the P read as an R)
    plane('hoodie', 1, P.poly(50, 100, 72, 100, 70, 104, 52, 104)),
  ];
  const stamps: Stamp[] = [...tor.stamps, ...hd.stamps];
  return {w: CIV_W, h: CIV_H, parts, adjust, stamps};
};
const rigOf = (light: 'slate' | 'room'): LightRig => ({
  key: [-0.95, -0.35], keyBand: 0, shadowBand: 0, rim: true, outline: true, edgesOnTop: true,
  back: [1, -0.2], backBand: 1,
  backRamp: light === 'slate' ? {skin: PAL.N7, hoodie: PAL.N6, hair: PAL.N6} : {skin: PAL.S3, hoodie: PAL.G4, hair: PAL.B3},
  ramps: {
    skin: light === 'slate' ? SKIN_CYAN.light : SKIN.light,
    hair: [PAL.B0, PAL.B0, PAL.B1, PAL.B2, PAL.B3, PAL.B4],
    hoodie: [PAL.N0, PAL.G0, PAL.G1, PAL.G2, PAL.G3, PAL.G5],
  },
});
/** the words painted across the chest, the paint dry now: cream letters set a letter at a time, their gaps uneven by a
 *  pixel (hand-painted), the paint's two tones; the baseline kept level (a pixel's drop reads as a lowercase p at this
 *  size, and OPEN has to read), no drips */
const paintWords = (img: Img) => {
  const put = (s: string, y: number) => {
    const b = new Buf(img.w, 12, 0);
    const x0 = 58 - Math.round((textWidth(s) + Math.floor(s.length / 3)) / 2);
    let x = x0;
    [...s].forEach((ch, i) => {
      const t = new Buf(12, 12, 0); text(t, ch, 0, 2, 1);
      const off = 0;
      for (let j = 0; j < 12; j++) for (let q = 0; q < 12; q++) if (t.get(q, j) && j + off >= 0 && j + off < 12) b.set(x + q, j + off, 1);
      x += textWidth(ch) + 1 + (i % 3 === 1 ? 1 : 0);
    });
    for (let j = 0; j < 12; j++) for (let q = 0; q < img.w; q++) {
      const Y = y - 2 + j;
      if (!b.get(q, j) || Y >= img.h || img.c[Y * img.w + q] < 0) continue;
      img.c[Y * img.w + q] = (q + Y) % 5 === 0 ? PAL.P1 : PAL.P2;
    }
  };
  put('OPEN', 112); put('SOURCE', 122);
};
export const kramBust = memo((s: KramBustState): Img => { const img = renderFigure(bustFig(s), rigOf(s.light)); paintWords(img); return img; });
