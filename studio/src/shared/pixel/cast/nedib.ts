// MR. MAS — cast: EOJ NEDIB, the Ep1 president (new file, owned by the `v3-art-b` pass). Character file:
// show/characters/eoj-nedib.md. Silhouette: a dark suit, aviator sunglasses pushed UP on his head (his long-standing
// public accessory), a fountain pen held like a baton; white hair swept back; a warm, confident grin. Staging rule:
// always standing tall, seated at a desk or signing. NEVER stumbling, stairs, falls, mix-ups or any gag that reads as
// age or health (the character file). Prop parity (guardrails §2a rule 4): the pen here and RUMPT's props get equal
// weight; NEDIB's scroll / EO kits live in kits/eo-signing.ts.
//   nedibBust / NEDIB_BUST_DEFAULT   112 x 136 (the MCU / [2S] tier), 3/4 facing camera-left. arm: 'baton' (the pen
//                                    up like a conductor's) | 'down' | 'sign' (the hand low, the pen on the page:
//                                    the desk overpaints below) | 'clap0' / 'clap1'. light: 'day' | 'screen' (seen
//                                    on Mas's monitor: the same drawing, the room light cooler) · `copy`: the
//                                    DEEPFAKE drawing (cut paper: a scissor-cut paper edge, crisper and glossier,
//                                    the tie the wrong colour), 0 = him · 1, 2 = the two copies (their ties differ)
//   drawNedibRoom / nedibRoom        room sprite (≈ 80 px), 3/4 facing screen-right: legs stand | w0..w3 (the stride
//                                    through the door, mid-sentence); arm baton | point | down | write
import {Buf, bayer} from '../px';
import {PAL, stepColor, familyOf} from '../palette';
import {FigureDef, Img, LightRig, P, Part, Stamp, Adjust, renderFigure, blitImg} from '../figure';
import {memo} from './kit';
import {bustHead, suitTorso, plane, recolor, SKIN, SUIT, SHIRT_WHITE, HAIR, CIV_W, CIV_H, FaceState, FACE_DEFAULT, roomBody, headStamp, RoomArm, RoomLegs, ROOM_FW, ROOM_FH, ROOM_FOOT} from './civic-kit';

export type NedibArm = 'baton' | 'down' | 'sign' | 'clap0' | 'clap1';
export interface NedibBustState extends FaceState {
  arm: NedibArm;
  light: 'day' | 'screen';
  /** 0 = NEDIB · 1, 2 = a deepfake copy */
  copy: 0 | 1 | 2;
}
export const NEDIB_BUST_DEFAULT: NedibBustState = {...FACE_DEFAULT, mouth: 'smile', arm: 'baton', light: 'day', copy: 0};
const HEAD = {long: 1, jaw: 2, age: 2 as const};
/** where the pen's nib is in the bust (local), per arm: the insert and the EO kit aim at it */
export const NEDIB_NIB: Record<NedibArm, [number, number]> = {baton: [13, 83], down: [22, 150], sign: [38, 150], clap0: [40, 118], clap1: [40, 118]};

const bustFig = (s: NedibBustState): FigureDef => {
  const hd = bustHead(HEAD, s, {eye: 'crinkle', browCol: PAL.G5, mouthW: 2});
  const tor = suitTorso({kind: 'suit'});
  const parts: Part[] = [...tor.parts, ...hd.parts];
  const adjust: Adjust[] = [...tor.adjust, ...hd.adjust];
  const stamps: Stamp[] = [...tor.stamps, ...hd.stamps];
  // ---- the hair: white, thin, swept straight back from a receded front; a short patch over the ear
  parts.push({group: 'hair', mat: 'hair', tone: 3, prims: [P.poly(50, 32, 53, 26, 60, 21, 70, 19, 79, 21, 85, 27, 88, 35, 89, 45, 87, 50, 85, 43, 81, 37, 75, 33, 67, 30, 59, 30, 54, 32)]});
  adjust.push(
    plane('hair', 4, P.poly(55, 28, 62, 23, 72, 21, 66, 25, 58, 29)),
    plane('hair', 2, P.line(60, 26, 76, 24), P.line(62, 29, 80, 28), P.line(74, 31, 86, 36), P.line(80, 36, 88, 44)),
    plane('hair', 1, P.poly(84, 40, 88, 42, 88, 48, 85, 46)),
    // the temples, a little hollow where the hair has gone back
    plane('skin', 2, P.poly(52, 33, 56, 32, 55, 38, 51, 38)),
  );
  // ---- the aviators pushed up on his head (his signature): gold wire, dark teardrop lenses, one glint
  stamps.push({x: 47, y: 21, rows: [
    '.......GGGGGGGGGGGG......',
    '.GGGGgGllllllllllllGGGGGG',
    'GllllGGlLLLLLLLLLlG....GG',
    'GlLLlG.GlLLLLLLLlG......G',
    '.GllG...GllLLLllG........',
    '..GG.....GGGGGGG.........',
  ], pal: {G: PAL.W6, g: PAL.W8, l: PAL.N1, L: PAL.N0}});
  stamps.push({x: 57, y: 23, rows: ['c..', '.c.'], pal: {c: PAL.C8}});
  // ---- arms
  if (s.arm === 'baton') {
    // the forearm rises from the frame's bottom-left to the hand at chest height; the pen tips up and out like a baton
    parts.push(
      {group: 'sleeve', mat: 'suit', tone: 2, prims: [P.poly(4, 150, 12, 124, 22, 112, 34, 114, 30, 126, 22, 150)]},
      {group: 'cuff', mat: 'shirt', tone: 3, prims: [P.poly(22, 111, 26, 108, 34, 112, 32, 116)]},
      {group: 'hand', mat: 'skin', tone: 3, prims: [P.poly(24, 108, 26, 101, 31, 99, 36, 101, 38, 106, 35, 111, 28, 112)]},
    );
    adjust.push(plane('suit', 3, P.poly(6, 146, 13, 125, 22, 113, 25, 114, 16, 128, 10, 150)), plane('skin', 4, P.poly(26, 102, 31, 100, 33, 102, 28, 104)), plane('skin', 1, P.poly(34, 104, 38, 106, 35, 111, 31, 109)));
    // the pen: black resin, a gold band and clip, the gold nib at the tip (up and to camera-left)
    stamps.push({x: 12, y: 82, rows: [
      'Wn..............',
      '.WKk............',
      '..KKk...........',
      '...KKk..........',
      '....KKk.........',
      '.....GGk........',
      '......KKk.......',
      '.......KKk......',
      '........KKk.....',
      '.........KKk....',
      '..........KKk...',
      '...........KK...',
    ], pal: {W: PAL.W8, n: PAL.W6, K: PAL.N0, k: PAL.G3, G: PAL.W6}});
  } else if (s.arm === 'clap0' || s.arm === 'clap1') {
    // both hands up at the chest, clapping: two held drawings (apart / together)
    const o = s.arm === 'clap1' ? 3 : 0;
    parts.push(
      {group: 'sleeve', mat: 'suit', tone: 2, prims: [P.poly(14, 150, 20, 120, 32, 104 + o, 42, 106 + o, 36, 124, 30, 150)]},
      {group: 'sleeveF', mat: 'suit', tone: 1, prims: [P.poly(96, 150, 92, 124, 80, 106, 70, 108, 74, 126, 80, 150)]},
      {group: 'hand', mat: 'skin', tone: 3, prims: [P.poly(36 + o, 98, 44 + o, 94, 50 + o, 96, 50 + o, 104, 42 + o, 106)]},
      {group: 'handF', mat: 'skin', tone: 2, prims: [P.poly(66 - o, 98, 72 - o, 94, 78 - o, 98, 76 - o, 106, 68 - o, 106)]},
    );
  } else if (s.arm === 'sign') {
    parts.push({group: 'sleeve', mat: 'suit', tone: 2, prims: [P.poly(10, 150, 20, 132, 34, 128, 44, 134, 40, 150)]});
  }
  if (s.copy) {
    // the copies' ties are slightly the wrong colour (the character file): recoloured wholesale
    adjust.push(recolor('tie', s.copy === 1 ? 'tieWrong' : 'tieWrong2', 2, P.rect(0, 0, CIV_W, CIV_H)));
    adjust.push(recolor('tie', s.copy === 1 ? 'tieWrong' : 'tieWrong2', 3, P.poly(60, 106, 63, 106, 62, 111, 61, 118, 60, 130)));
  }
  return {w: CIV_W, h: CIV_H, parts, adjust, stamps};
};
const TIE = [PAL.N0, PAL.N5, PAL.N6, PAL.N7, PAL.N8, PAL.G6];
const rigOf = (light: 'day' | 'screen', copy: number): LightRig => ({
  key: [-0.95, -0.35], keyBand: 0, shadowBand: 0, rim: true, outline: true, edgesOnTop: true, noEdge: ['shirt', 'cuff', 'tie', 'tieWrong', 'tieWrong2', 'throat'],
  back: [1, -0.2], backBand: 1,
  backRamp: light === 'screen' ? {skin: PAL.X2, suit: PAL.N5, hair: PAL.G4} : {skin: PAL.S3, suit: PAL.N4, hair: PAL.G5},
  ramps: {
    // a copy is crisper and glossier: every ramp one step brighter at the top
    skin: copy ? [PAL.S0, PAL.S3, PAL.S4, PAL.S5, PAL.S6, PAL.W9] : SKIN.light,
    hair: copy ? [PAL.N1, PAL.G5, PAL.G6, PAL.P2, PAL.W9, PAL.W9] : HAIR.white,
    suit: copy ? [PAL.N0, PAL.N2, PAL.N3, PAL.N5, PAL.N7, PAL.N8] : SUIT.navy,
    shirt: copy ? [PAL.N2, PAL.G5, PAL.P1, PAL.P2, PAL.W9, PAL.W9] : SHIRT_WHITE,
    cuff: SHIRT_WHITE,
    tie: TIE,
    tieWrong: [PAL.N0, PAL.L1, PAL.L2, PAL.L2, PAL.L3, PAL.L3],
    tieWrong2: [PAL.N0, PAL.C1, PAL.C2, PAL.C3, PAL.C4, PAL.C5],
  },
});
/** the cut-paper treatment (post-render): the copy printed flat (its shading posterised to every other rung: a crude
 *  print), a 2-3 px paper margin round the silhouette cut in straight scissor runs with notches, and a laminate sheen */
const cutPaper = (img: Img, seed: number): Img => {
  const {w, h} = img;
  const out: Img = {w, h, c: new Int32Array(img.c)};
  const at = (x: number, y: number) => x >= 0 && y >= 0 && x < w && y < h && img.c[y * w + x] >= 0;
  // the crude print: every colour pushed to an even rung of its own ramp (fewer tones, flatter planes)
  for (let i = 0; i < out.c.length; i++) if (out.c[i] >= 0) { const fam = familyOf(out.c[i]); if (fam && fam[1] % 2 === 1) out.c[i] = stepColor(out.c[i], 1); }
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    if (at(x, y)) continue;
    // the distance to the figure, in a straight-cut metric: the scissors go round in chords, never following the curve
    let near = 99;
    for (let j = -3; j <= 3; j++) for (let i = -3; i <= 3; i++) if (at(x + i, y + j)) near = Math.min(near, Math.max(Math.abs(i), Math.abs(j)));
    if (near > 3) continue;
    const run = Math.floor((x * 2 + y + seed * 17) / 7) % 4;
    const margin = run === 0 ? 1 : run === 3 ? 3 : 2; // straight runs of different widths
    if (near <= margin) out.c[y * w + x] = near === margin ? PAL.P1 : PAL.P2;
    // a notch where two cuts met
    if (near === margin && (x * 7 + y * 3 + seed) % 23 === 0) out.c[y * w + x] = -1;
  }
  // the laminate sheen: one hard diagonal band
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const v = out.c[y * w + x];
    if (v < 0 || !at(x, y)) continue;
    const d = x + y * 0.55 - (70 + seed * 6);
    if (d > 0 && d < 4 && bayer(x, y) < 0.8) out.c[y * w + x] = stepColor(v, 2);
  }
  return out;
};
export const nedibBust = memo((s: NedibBustState): Img => {
  const img = renderFigure(bustFig(s), rigOf(s.light, s.copy));
  return s.copy ? cutPaper(img, s.copy) : img;
});

// ------------------------------------------------------------------ room sprite
export type NedibRoomArm = 'baton' | 'point' | 'down' | 'write' | 'clap0' | 'clap1';
export interface NedibRoomPose { legs: RoomLegs; arm: NedibRoomArm; mouth: 'rest' | 'open' | 'smile'; light: 'day' | 'sil'; copy?: 0 | 1 | 2; }
export const NEDIB_ROOM_DEFAULT: NedibRoomPose = {legs: 'stand', arm: 'baton', mouth: 'smile', light: 'day'};
// the head, 3/4 facing screen-right: white hair swept back, the aviators a gold line on top, a grin
const RHEAD = [
  '.....wWWWWw.....',
  '...wWWWWWWWw....',
  '..wWGGGGgGGGw...',
  '.wWWwKKGKKKGo...',
  '.wWWW2233444o...',
  'wWWWh2234ww4wo..',
  'wWWh22334e44eo..',
  'wWo1223344444445',
  'wWo12233444444o5',
  '.wo122334444444.',
  '..o12233444444o.',
  '..o1223mmmmm4o..',
  '...o12233444o...',
  '....o112233o....',
  '.....oo1122o....',
  '......o112o.....',
  '......o112o.....',
];
const roomFig = (p: NedibRoomPose): FigureDef => {
  const arm: RoomArm = p.arm === 'baton' ? 'baton' : p.arm === 'point' ? 'point' : p.arm === 'write' ? 'write' : p.arm === 'clap0' ? 'clap0' : p.arm === 'clap1' ? 'clap1' : 'down';
  const body = roomBody({kind: 'suit'}, arm, p.legs);
  const rows = RHEAD.slice();
  if (p.mouth === 'open') { rows[11] = '..o1223mMMMm4o..'; rows[12] = '...o122MMM44o...'; }
  if (p.mouth === 'rest') rows[11] = '..o12233mmm44o..';
  const stamps = [...body.stamps, headStamp(rows, body.bob, {
    o: ['skin', 0], '1': ['skin', 1], '2': ['skin', 2], '3': ['skin', 3], '4': ['skin', 4], '5': ['skin', 5],
    w: ['hair', 1], W: ['hair', 3], h: ['hair', 2], e: ['dark', 0], m: ['skin', 1], M: ['dark', 0],
    G: ['gold', 3], g: ['gold', 5], K: ['dark', 0],
  })];
  // the pen in the raised hand (baton / point / write): a 1-px black stroke with a gold tip
  if (p.arm === 'baton' || p.arm === 'point' || p.arm === 'write') {
    const [hx, hy] = p.arm === 'baton' ? [33, 23 + body.bob] : p.arm === 'point' ? [39, 26 + body.bob] : [31, 41 + body.bob];
    stamps.push(p.arm === 'write'
      ? {x: hx, y: hy - 4, rows: ['..g', '.K.', 'K..'], pal: {K: ['dark', 0], g: ['gold', 4]}}
      : {x: hx - 3, y: hy - 5, rows: ['g...', '.K..', '..K.', '...K'], pal: {K: ['dark', 0], g: ['gold', 5]}});
  }
  return {w: ROOM_FW, h: ROOM_FH, parts: body.parts, adjust: body.adjust, stamps};
};
const RLIT: Record<string, number[]> = {
  skin: SKIN.light, hair: HAIR.white, suit: SUIT.navy, shirt: SHIRT_WHITE, tie: TIE,
  shoe: [PAL.N0, PAL.N0, PAL.N1, PAL.G1, PAL.G3, PAL.G4], gold: [PAL.W2, PAL.W3, PAL.W4, PAL.W5, PAL.W6, PAL.W8], dark: [PAL.N0, PAL.N0, PAL.N0, PAL.N0, PAL.N0, PAL.N0],
};
const RSIL: Record<string, number[]> = Object.fromEntries(Object.keys(RLIT).map((k) => [k, [PAL.N0, PAL.N0, PAL.N0, PAL.N0, PAL.N1, PAL.N1]]));
const roomRig = (light: 'day' | 'sil'): LightRig => ({
  key: [-0.55, -0.83], keyBand: 3, shadowBand: 3, rim: true, outline: true,
  back: [1, -0.1], backBand: 1, backRamp: light === 'sil' ? {} : {skin: PAL.S3, hair: PAL.G5, suit: PAL.N4},
  ramps: light === 'day' ? RLIT : RSIL,
  groupBands: {torso: {key: 4, shadow: 3}, armN: {key: 2, shadow: 2}, armF: {key: 1, shadow: 2}, legN: {key: 2, shadow: 2}, legF: {key: 1, shadow: 2}},
  keyGain: light === 'sil' ? () => 0 : (_x, y) => (y < 48 ? 1 : Math.max(0.25, 1 - (y - 48) / 34)),
});
export const nedibRoom = memo((p: NedibRoomPose): Img => {
  const img = renderFigure(roomFig(p), roomRig(p.light));
  return p.copy ? cutPaper(img, p.copy) : img;
});
export const drawNedibRoom = (b: Buf, footX: number, footY: number, p: NedibRoomPose, o: {flip?: boolean; map?: (c: number) => number; clip?: (x: number, y: number) => boolean} = {}) => {
  const fx = o.flip ? ROOM_FW - 1 - ROOM_FOOT[0] : ROOM_FOOT[0];
  blitImg(b, nedibRoom(p), footX - fx, footY - ROOM_FOOT[1], {flip: o.flip, map: o.map, clip: o.clip});
};
