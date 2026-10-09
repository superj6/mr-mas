// MR. MAS — Ep2 v1 art: the new-character factory. Every new Ep2 speaker is built on Ep1's civic kit
// (shared/pixel/cast/civic-kit.ts, imported read-only): a new face is its signature features (hair, glasses, a prop, a
// colour), never a new skull, never a likeness. This file adds what the Ep2 cast needs on top of it:
//   EXPRESSIONS  neutral · smile · laugh · worry · proud · squint · focus: each a FaceState plus the eye drawing, the
//                brows and the mouth (a laugh's open grin, a worried brow's raised inner ends), so a face reads its
//                feeling at 1080p (LEARNINGS P5)
//   civicBust    the 112 x 136 bust (MCU / 2S / the name card's portrait): torso + head + hair + the figure's extras,
//                rendered with its own ramps; arms and hands come from the figure (medium-kit's sleeve and hand parts)
//   roomFigure   the ≈ 80 px room sprite: roomBody (legs, torso, jointed arms, hands) + a 16 x 17 head tone map built
//                from a hair template, with open / smile / laugh mouths and a worried brow row
//   seatedStaff  a seated staffer for beanbag rows and audiences (3/4 to screen-right; watch, cheer, type)
//   crowdBacks   the backs of a crowd (heads and shoulders), tiled
import {Buf, rect, bayer, hash} from '../../../../../shared/pixel/px';
import {PAL, stepColor} from '../../../../../shared/pixel/palette';
import {FigureDef, Img, LightRig, P, Part, Stamp, Adjust, Prim, renderFigure, blitImg} from '../../../../../shared/pixel/figure';
import {memo} from '../../../../../shared/pixel/cast/kit';
import type {Viseme} from '../../../../../shared/pixel/cast/talk';
import {bustHead, suitTorso, plane, FaceState, HeadSpec, TorsoSpec, roomBody, headStamp, RoomArm, RoomLegs, ROOM_FW, ROOM_FH, ROOM_FOOT, CIV_W, CIV_H, FACE_INK} from '../../../../../shared/pixel/cast/civic-kit';
import {handParts, sleeveParts, V2} from '../../../../../shared/pixel/cast/medium-kit';

export {CIV_W, CIV_H, ROOM_FW, ROOM_FH, ROOM_FOOT, plane};
export type {Viseme, RoomArm, RoomLegs};
export type Expr = 'neutral' | 'smile' | 'laugh' | 'worry' | 'proud' | 'squint' | 'focus';
export interface BustState { mouth: Viseme; expr: Expr; lid?: 0 | 1 | 2; look?: -1 | 0 | 1 }
export const BUST_DEFAULT: BustState = {mouth: 'rest', expr: 'neutral'};

// ------------------------------------------------------------------ expressions -> face stamps
// civic-kit draws the eyes, brows, nostril and mouth as stamps (near eye at head point (55, 47), far eye (44, 48), near
// brow (54, 43), far brow (43, 44), mouth (43, 72)). An expression replaces them: the brows' slant (the inner ends are
// the near brow's LEFT end and the far brow's RIGHT end: the head faces camera-left), the eyes (a laugh's closed arcs, a
// smile's pushed-up lower lid, worry's wider white), and the mouth at rest (a talking viseme keeps civic-kit's shapes).
const BROWS: Record<'level' | 'up' | 'worry' | 'knit', {near: string[]; far: string[]; dy: number}> = {
  level: {near: ['..bbbbbbbbbb.', 'bbbbbbbbbB...'], far: ['.bbbb', 'bbbb.'], dy: 0},
  up: {near: ['..bbbbbbbbbb.', 'bbbbbbbbbB...'], far: ['.bbbb', 'bbbb.'], dy: -2},
  worry: {near: ['bbb..........', 'BBbbbb.......', '....bbbbbb...', '........bbb..'], far: ['...bb', '.bbB.', 'bb...'], dy: -2},
  knit: {near: ['......bbbbbb.', '..bbbbbbB....', 'bbbB.........'], far: ['bbb..', '..bbb', '....b'], dy: 0},
};
type EyeKind = 'calm' | 'crinkle' | 'happy' | 'wide' | 'half';
const NEAR_EYE: Record<EyeKind, string[]> = {
  calm: ['..LLLLLLL..', '.LwwIIgww..', '..kwIIwk...'],
  crinkle: ['..LLLLLLL..', '.LwwIIgwwL.', '..kkkkkkk..'],
  happy: ['...LLLLL...', '.LL.....LL.', 'L.........k', '..kkkkkkk..'],
  wide: ['..LLLLLLL..', '.LwwIIgwwL.', '.kwwIIwwk..', '...kkkk....'],
  half: ['...........', '.LLLLLLLLL.', '..kwIIgwk..'],
};
const FAR_EYE: Record<EyeKind, string[]> = {
  calm: ['.LL.', 'LIIw', '.kk.'], crinkle: ['.LL.', 'LIIL', '.kk.'], happy: ['.LL.', 'L..L', '.kk.'],
  wide: ['.LL.', 'LIIw', 'kIIk'], half: ['....', 'LLLL', 'kIIk'],
};
const REST_MOUTH: Record<'flat' | 'smile' | 'proud' | 'laugh' | 'worry', {rows: string[]; dx: number; dy: number}> = {
  flat: {rows: ['.........', 'mmmmmmmm.', '.lllll...'], dx: 0, dy: 0},
  smile: {rows: ['r........r', '.mm....mm.', '...mmmm...', '...llll...'], dx: -1, dy: 0},
  proud: {rows: ['.........r', 'mm.....mm.', '.mmmmmmm..', '..lllll...'], dx: -1, dy: 0},
  laugh: {rows: ['r..........r', '.mmmmmmmmmm.', '.mTTTTTTTTm.', '..mddddddm..', '...mdRRdm...', '....mmmm....'], dx: -2, dy: 0},
  worry: {rows: ['.........', '..mmmmm..', '.m.....m.', '..lllll..'], dx: 0, dy: 0},
};
/** the face for an expression: FaceState for civic-kit, then the eyes, brows and resting mouth that replace its stamps */
export const exprFace = (s: BustState): {face: FaceState; eye: EyeKind; brow: keyof typeof BROWS; rest: keyof typeof REST_MOUTH} => {
  const lid = s.lid ?? 0, look = s.look ?? 0;
  const face: FaceState = {mouth: s.mouth, lid, look, brow: 0};
  switch (s.expr) {
    case 'smile': return {face, eye: lid ? 'half' : 'crinkle', brow: 'level', rest: 'smile'};
    case 'proud': return {face, eye: lid ? 'half' : 'calm', brow: 'up', rest: 'proud'};
    case 'laugh': return {face, eye: 'happy', brow: 'up', rest: 'laugh'};
    case 'worry': return {face, eye: lid ? 'half' : 'wide', brow: 'worry', rest: 'worry'};
    case 'squint': return {face, eye: lid === 2 ? 'half' : 'crinkle', brow: 'knit', rest: 'flat'};
    case 'focus': return {face, eye: lid ? 'half' : 'calm', brow: 'knit', rest: 'flat'};
    default: return {face, eye: lid ? 'half' : 'calm', brow: 'level', rest: 'flat'};
  }
};
export interface CivicSpec {
  head: HeadSpec;
  torso?: TorsoSpec;
  /** the hair (and any headwear) as parts + planes, head-local (bust coordinates) */
  hair: (s: BustState) => {parts: Part[]; adjust: Adjust[]; stamps?: Stamp[]};
  /** extras drawn as figure parts after the head (glasses, a headset, a lanyard, arms, props) */
  extras?: (s: BustState & Record<string, unknown>) => {parts?: Part[]; adjust?: Adjust[]; stamps?: Stamp[]; front?: boolean};
  browCol: number;
  /** a heavier upper lid with lashes (calm and wide eyes) */
  lash?: boolean;
  ramps: Record<string, number[]>;
  /** back-light ramp entries (the rim from behind) */
  backRamp?: Record<string, number>;
  key?: [number, number];
  noEdge?: string[];
}
/** assemble a bust FigureDef for a spec and a state (extra state keys pass through to `extras`) */
export const civicFig = (spec: CivicSpec, s: BustState & Record<string, unknown>): FigureDef => {
  const ef = exprFace(s);
  const hd = bustHead(spec.head, ef.face, {eye: 'calm', browCol: spec.browCol, mouthW: 1});
  const st = hd.stamps.map((x) => ({...x}));
  const br = BROWS[ef.brow];
  const bpal = {b: spec.browCol, B: stepColor(spec.browCol, -1)};
  st[2] = {...st[2], rows: br.near, y: st[2].y + br.dy, pal: bpal};
  st[3] = {...st[3], rows: br.far, y: st[3].y + br.dy, pal: bpal};
  if (ef.face.lid !== 2) {
    const dart = (rows: string[]) => rows.map((r) => {
      const lk = ef.face.look;
      if (!lk || !/I/.test(r)) return r;
      const ch = r.split(''), out = ch.map((c) => (c === 'I' || c === 'g' ? 'w' : c));
      ch.forEach((c, i) => { if ((c === 'I' || c === 'g') && out[i + lk] && out[i + lk] !== '.' && out[i + lk] !== 'L') out[i + lk] = c; });
      return out.join('');
    });
    const LASH: Partial<Record<EyeKind, string[]>> = {calm: ['.LLLLLLLLL.', 'LLwwIIgwwL.', '..kwIIwk...'], wide: ['.LLLLLLLLL.', 'LLwwIIgwwL.', '.kwwIIwwk..', '...kkkk....']};
    st[0] = {...st[0], rows: dart((spec.lash && LASH[ef.eye]) || NEAR_EYE[ef.eye])};
    st[1] = {...st[1], rows: dart(FAR_EYE[ef.eye])};
  }
  if (s.mouth === 'rest' || (s.mouth === 'smile' && ef.rest !== 'flat')) {
    const m = REST_MOUTH[s.mouth === 'smile' && ef.rest === 'worry' ? 'smile' : ef.rest];
    st[5] = {...st[5], x: st[5].x + m.dx, y: st[5].y + m.dy, rows: m.rows, pal: {...st[5].pal, R: PAL.R2}};
  }
  const tor = spec.torso ? suitTorso(spec.torso) : {parts: [], adjust: [], stamps: []};
  const hair = spec.hair(s);
  const ex = spec.extras?.(s) ?? {};
  const parts: Part[] = [...tor.parts, ...hd.parts, ...hair.parts, ...(ex.parts ?? [])];
  const adjust: Adjust[] = [...tor.adjust, ...hd.adjust, ...hair.adjust, ...(ex.adjust ?? [])];
  const stamps: Stamp[] = [...tor.stamps, ...st, ...(hair.stamps ?? []), ...(ex.stamps ?? [])];
  return {w: CIV_W, h: CIV_H, parts, adjust, stamps};
};
export const civicRig = (spec: CivicSpec): LightRig => ({
  key: spec.key ?? [-0.95, -0.35], keyBand: 0, shadowBand: 0, rim: true, outline: true, edgesOnTop: true,
  noEdge: spec.noEdge ?? ['shirt', 'tie', 'throat', 'lens', 'badge', 'cord'],
  back: [1, -0.2], backBand: 1, backRamp: spec.backRamp ?? {skin: PAL.S3, hair: PAL.G4},
  ramps: {dark: [PAL.N0, PAL.N0, PAL.N0, PAL.N0, PAL.N0, PAL.N0], ...spec.ramps},
});
/** a memoised bust renderer for a spec */
export const makeBust = <S extends BustState>(spec: CivicSpec) => memo((s: S): Img => renderFigure(civicFig(spec, s as BustState & Record<string, unknown>), civicRig(spec)));

// ------------------------------------------------------------------ bust arms: an arm from the shoulder to a hand
/** an arm into the bust frame: upper arm from the shoulder, the elbow, the forearm, a cuff and a hand (figure parts) */
export const bustArm = (g: string, sh: V2, el: V2, wr: V2, hand: {dir: V2; thumb: 1 | -1; curl?: number; len?: number; width?: number; noThumb?: boolean; thumbOut?: number}, o: {mat?: string; w?: number; skin?: string} = {}): {parts: Part[]; adjust: Adjust[]} => {
  const mat = o.mat ?? 'suit', w = o.w ?? 13;
  const upper = sleeveParts(g + 'u', sh, el, {w0: w + 1, w1: w - 1, mat, cuff: 0});
  const fore = sleeveParts(g + 'f', el, wr, {w0: w - 1, w1: w - 3, mat, cuff: 2});
  const h = handParts(g + 'h', {at: wr, dir: hand.dir, thumb: hand.thumb, curl: hand.curl, len: hand.len ?? 13, width: hand.width ?? 10, noThumb: hand.noThumb, thumbOut: hand.thumbOut}, o.skin ?? 'skin');
  return {parts: [...upper.parts, ...fore.parts, ...h.parts], adjust: [...upper.adjust, ...fore.adjust, ...h.adjust]};
};

// ------------------------------------------------------------------ the room tier
/** hair templates for the 16 x 17 room head (3/4 to screen-right, like every room sprite: the face on the right, the
 *  back of the head on the left). The face rows are Ep1's room head (cast/lahtnemulb.ts RHEAD), the hair varies. */
export type RoomHair = 'short' | 'crop' | 'swoop' | 'long' | 'bun' | 'bald' | 'cap' | 'curly' | 'silver';
const BASE_HEAD = [
  '....hhhhhhh.....',
  '..hhHHHHHHHhh...',
  '.hHHHHHHHHHHHh..',
  '.hHHHHHHHHHHHo..',
  'hHHHHh2233444o..',
  'hHHHh2234bb4bo..',
  'hHHh22334e44eo..',
  'hHo12233444444o.',
  'hHo122334444445.',
  '.ho1223344444o5.',
  '..o1223344444o..',
  '..o12233444o....',
  '..o1223mmm4o....',
  '...o22334o......',
  '....o2233o......',
  '.....o223o......',
  '.....o223o......',
];
const TOPS4: Record<RoomHair, string[]> = {
  short: BASE_HEAD.slice(0, 4),
  silver: BASE_HEAD.slice(0, 4),
  crop: ['................', '...hhhhhhhh.....', '.hhHHHHHHHHHh...', '.hHHHHHHHHHHHo..'],
  swoop: ['...hhhhhhhh.....', '.hhHHHHHHHHHhh..', 'hHHHHHHHHHHHHHh.', 'hHHHHHHHHHHHHHHh'],
  long: ['....hhhhhhh.....', '..hhHHHHHHHhh...', '.hHHHHHHHHHHHh..', 'hHHHHHHHHHHHHo..'],
  bun: ['.hhh............', 'hHHHhHHHHHHhh...', '.hHHHHHHHHHHHh..', '.hHHHHHHHHHHHo..'],
  bald: ['................', '....ooooooo.....', '..o2233344444o..', '.o22233344444o..'],
  cap: ['...ccccccc......', '.cCCCCCCCCCc....', '.cCCCCCCCCCCkkkk', '.hHHHHHHHHHHHo..'],
  curly: ['...hHhHhHhH.....', '.hHhHhHhHhHhH...', 'hHhHHHHHHHHhHh..', 'hHHHHHHHHHHHHo..'],
};
export interface RoomHeadOpts { hair: RoomHair; mouth?: 'rest' | 'open' | 'smile' | 'laugh'; glasses?: boolean; squint?: boolean; blink?: boolean; beard?: boolean; frown?: boolean }
/** a 16 x 17 room head tone map: a hair template over Ep1's room face, with its mouth and eyes */
export const roomHead = (o: RoomHeadOpts): string[] => {
  const rows = BASE_HEAD.map((r) => r);
  TOPS4[o.hair].forEach((r, j) => (rows[j] = r));
  const setc = (j: number, i: number, ch: string) => { const r = rows[j].split(''); r[i] = ch; rows[j] = r.join(''); };
  if (o.hair === 'swoop') { rows[4] = 'hHHHHHHHh3444o..'; }
  if (o.hair === 'crop') { rows[4] = 'hHHH122233444o..'; rows[5] = 'hHH22234bb4bo...'.padEnd(16, '.'); rows[5] = 'hHH12234bb4bo...'; }
  if (o.hair === 'bald') { rows[4] = 'o222233334444o..'; rows[5] = 'o1222234bb4bo...'; rows[6] = 'o1222334e44eo...'; rows[7] = 'oo12233444444o..'; rows[8] = '.o122334444445..'; }
  if (o.hair === 'long') { for (const j of [7, 8, 9, 10, 11, 12]) { setc(j, 0, 'h'); setc(j, 1, 'H'); setc(j, 2, j < 10 ? 'h' : 'o'); } setc(13, 1, 'h'); setc(13, 2, 'h'); }
  if (o.hair === 'curly') { setc(7, 0, 'h'); setc(8, 0, 'h'); }
  if (o.hair === 'cap') { rows[4] = 'hHHHHo2233444o..'; }
  if (o.blink) { rows[6] = rows[6].replace(/e/g, '3'); setc(6, 9, 'b'); setc(6, 12, 'b'); }
  else if (o.squint) { setc(6, 8, 'e'); setc(6, 11, 'e'); }
  if (o.glasses) { rows[6] = rows[6].slice(0, 7) + 'gLegLegg' + rows[6].slice(15); rows[5] = rows[5].slice(0, 8) + 'gggggg' + rows[5].slice(14); }
  const M: Record<string, [string, string]> = {
    rest: ['..o12233444o....', '..o1223mmm4o....'],
    open: ['..o12233444o....', '..o1223mMm4o....'],
    smile: ['..o1223m444m....', '..o12233mmm4o...'],
    laugh: ['..o1223m444m....', '..o1223mMMm4o...'],
  };
  const [r11, r12] = M[o.mouth ?? 'rest'];
  rows[11] = r11; rows[12] = r12;
  if (o.frown) rows[12] = '..o1223m3m4o....';
  if (o.beard) { rows[10] = '..oB223344444o..'; rows[11] = '..oBB2B4BBBo....'; rows[12] = rows[12].replace(/[2-4]/g, 'B'); rows[13] = '...oBBBBBo......'; }
  return rows.map((r) => r.padEnd(16, '.').slice(0, 16));
};
export const ROOM_HEAD_PAL: Record<string, [string, number] | number> = {
  o: ['skin', 0], '1': ['skin', 1], '2': ['skin', 2], '3': ['skin', 3], '4': ['skin', 4], '5': ['skin', 5],
  h: ['hair', 2], H: ['hair', 3], b: ['hair', 1], e: ['dark', 0], m: ['skin', 1], M: ['dark', 0],
  c: ['cap', 2], C: ['cap', 3], k: ['cap', 1], g: ['lens', 1], L: ['lens', 4], B: ['hair', 1],
};
export interface RoomFigSpec {
  kind: 'suit' | 'pantsuit' | 'blazer' | 'jacket';
  broad?: number;
  /** trousers material (default 'suit': the jacket's own) */
  legMat?: string;
  ramps: Record<string, number[]>;
  backRamp?: Record<string, number>;
  /** extra parts / stamps (props, lanyards) for a pose */
  extras?: (p: RoomPose, bob: number) => {parts?: Part[]; stamps?: Stamp[]; adjust?: Adjust[]};
}
export interface RoomPose { arm: RoomArm; armF?: RoomArm; legs?: RoomLegs; head: RoomHeadOpts; tie?: boolean; nod?: 0 | 1; lean?: 0 | 1 | 2; seat?: boolean | 'cross'; [k: string]: unknown }
/** seated legs (room scale, facing screen-right): the thighs forward from the hip to the knee, the shins down to the
 *  feet; the seat line is y 48 (the chair is the set's) */
const segP = (x0: number, y0: number, w0: number, x1: number, y1: number, w1: number) => {
  const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
  return P.poly(x0 + (nx * w0) / 2, y0 + (ny * w0) / 2, x1 + (nx * w1) / 2, y1 + (ny * w1) / 2, x1 - (nx * w1) / 2, y1 - (ny * w1) / 2, x0 - (nx * w0) / 2, y0 - (ny * w0) / 2);
};
export const seatedLegs = (lm: string, cross = false): Part[] => {
  const leg = (g: string, hip: number, kx: number, ax: number, ay: number): Part[] => [
    {group: g, mat: lm, prims: [segP(hip, 46, 7.6, kx, 47, 6.4), segP(kx, 47, 6, ax, ay, 5.2), P.ell(kx, 47, 3, 3)]},
    {group: g + 's', mat: 'shoe', prims: [P.poly(ax - 2.6, ay, ax + 2.6, ay, ax + 6.4, ay + 3, ax + 6.4, ay + 5, ax - 3, ay + 5)]},
  ];
  return cross ? [...leg('legF', 17, 31, 32, 62), {group: 'legN', mat: lm, prims: [segP(22, 45, 7.6, 33, 44, 6.4), segP(33, 44, 6, 38, 54, 5)]}, {group: 'legNs', mat: 'shoe', prims: [P.poly(36, 54, 41, 54, 44, 57, 44, 59, 36, 59)]}]
    : [...leg('legF', 17, 30, 30, 62), ...leg('legN', 23, 34, 34, 62)];
};
export const roomFig = (spec: RoomFigSpec, p: RoomPose): FigureDef => {
  const body = roomBody({kind: spec.kind, broad: spec.broad, legMat: spec.legMat}, p.arm, p.legs ?? 'stand', {armF: p.armF, tie: p.tie});
  if (p.seat) {
    const lm = spec.legMat ?? 'suit';
    const keep = body.parts.filter((q) => !/^leg/.test(q.group));
    const legs = seatedLegs(lm, p.seat === 'cross');
    body.parts.length = 0;
    // the far leg behind the torso, the near leg in front of it
    body.parts.push(...legs.filter((q) => q.group.startsWith('legF')), ...keep.filter((q) => q.group === 'armF'), ...keep.filter((q) => q.group !== 'armF'), ...legs.filter((q) => q.group.startsWith('legN')));
    // shift everything above the hips down: a seated figure's head is lower (the hip stays at the seat line)
    body.adjust.length = 0;
  }
  const ex = spec.extras?.(p, body.bob) ?? {};
  const stamps: Stamp[] = [...body.stamps, headStamp(roomHead(p.head), body.bob + (p.nod ?? 0), ROOM_HEAD_PAL, p.lean ?? 0), ...(ex.stamps ?? [])];
  return {w: ROOM_FW, h: ROOM_FH, parts: [...body.parts, ...(ex.parts ?? [])], adjust: [...body.adjust, ...(ex.adjust ?? [])], stamps};
};
export const roomRig = (spec: RoomFigSpec): LightRig => ({
  key: [-0.55, -0.83], keyBand: 3, shadowBand: 3, rim: true, outline: true,
  back: [1, -0.1], backBand: 1, backRamp: spec.backRamp ?? {skin: PAL.S3},
  ramps: {dark: [PAL.N0, PAL.N0, PAL.N0, PAL.N0, PAL.N0, PAL.N0], shoe: [PAL.N0, PAL.N0, PAL.N1, PAL.G1, PAL.G3, PAL.G4], lens: [PAL.N0, PAL.N1, PAL.G3, PAL.G5, PAL.C7, PAL.C9], cap: [PAL.N0, PAL.N1, PAL.N2, PAL.N4, PAL.N6, PAL.N7], ...spec.ramps},
  groupBands: {torso: {key: 4, shadow: 3}, armN: {key: 2, shadow: 2}, armF: {key: 1, shadow: 2}, legN: {key: 2, shadow: 2}, legF: {key: 1, shadow: 2}},
  keyGain: (_x, y) => (y < 48 ? 1 : Math.max(0.25, 1 - (y - 48) / 34)),
});
export const makeRoom = (spec: RoomFigSpec) => {
  const m = memo((p: RoomPose): Img => renderFigure(roomFig(spec, p), roomRig(spec)));
  const draw = (b: Buf, footX: number, footY: number, p: RoomPose, o: {flip?: boolean; clip?: (x: number, y: number) => boolean; map?: (c: number) => number} = {}) => {
    const fx = o.flip ? ROOM_FW - 1 - ROOM_FOOT[0] : ROOM_FOOT[0];
    blitImg(b, m(p), footX - fx, footY - ROOM_FOOT[1], {flip: o.flip, clip: o.clip, map: o.map});
  };
  return {img: m, draw};
};

// ------------------------------------------------------------------ seated staff and crowd backs (room scale)
export type SeatPose = 'watch' | 'cheer' | 'type' | 'turn' | 'hold';
const TOPS: number[][] = [[PAL.G1, PAL.G2, PAL.G3], [PAL.F2, PAL.F3, PAL.F4], [PAL.L0, PAL.L1, PAL.L2], [PAL.U1, PAL.U2, PAL.U3], [PAL.D2, PAL.D3, PAL.D4], [PAL.N4, PAL.N5, PAL.N6], [PAL.G3, PAL.G4, PAL.G5], [PAL.R0, PAL.R1, PAL.R2], [PAL.C1, PAL.C2, PAL.C3]];
const HAIRS: number[][] = [[PAL.B0, PAL.B1], [PAL.B1, PAL.B2], [PAL.B2, PAL.B3], [PAL.B3, PAL.B4], [PAL.G3, PAL.G5], [PAL.N0, PAL.N1]];
const SKINS: number[][] = [[PAL.S2, PAL.S3, PAL.S4], [PAL.S3, PAL.S4, PAL.S5], [PAL.S4, PAL.S5, PAL.S6], [PAL.S1, PAL.S2, PAL.S3], [PAL.D1, PAL.D2, PAL.B3]];
/** a seated staffer, 3/4 to screen-right, about 34 px tall (head 10): `seed` picks top, hair and skin; the seat is the
 *  caller's (a beanbag, a theatre seat, the floor). Arms: watch (hands in the lap), cheer (both forearms up), type
 *  (a laptop on the knees, its glow on the face), turn (head toward camera), hold (a hand on the next one's hand) */
export const seatedStaff = memo((p: {seed: number; pose: SeatPose; long?: boolean}): Img => {
  const W = 26, H = 36;
  const img: Img = {w: W, h: H, c: new Int32Array(W * H).fill(-1)};
  const s = (x: number, y: number, c: number) => { if (x >= 0 && y >= 0 && x < W && y < H) img.c[y * W + x] = c; };
  const r = (x: number, y: number, w: number, h: number, c: number) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) s(x + i, y + j, c); };
  const top = TOPS[p.seed % TOPS.length], hair = HAIRS[(p.seed * 7 + 3) % HAIRS.length], sk = SKINS[(p.seed * 5 + 1) % SKINS.length];
  const long = p.long ?? (p.seed % 3 === 1);
  // legs folded forward (knees up toward screen-right), shoes
  r(8, 27, 13, 4, PAL.N2); r(9, 27, 11, 1, PAL.N3); r(18, 24, 5, 4, PAL.N2); r(19, 24, 3, 1, PAL.N3); r(21, 29, 4, 2, PAL.N0);
  // torso
  for (let j = 0; j < 14; j++) for (let i = 0; i < 12; i++) { if ((j < 2 && (i < 1 || i > 10))) continue; s(6 + i, 13 + j, i < 3 ? top[0] : i > 8 ? top[2] : top[1]); }
  r(6, 13, 12, 1, top[2]);
  // head (10 px), hair, face toward screen-right (or the camera on 'turn')
  const hx = 8, hy = 2;
  for (let j = 0; j < 10; j++) for (let i = 0; i < 9; i++) { const d = Math.hypot((i - 4) / 4.6, (j - 4.8) / 5.2); if (d < 1) s(hx + i, hy + j, i > 5 ? sk[2] : i > 2 ? sk[1] : sk[0]); }
  for (let j = 0; j < 4; j++) for (let i = 0; i < 9; i++) { const d = Math.hypot((i - 4) / 4.8, (j - 3) / 3.4); if (d < 1) s(hx + i, hy + j - 1, j < 1 ? hair[1] : hair[0]); }
  r(hx - 1, hy + 1, 3, 5, hair[0]);
  if (long) r(hx - 1, hy + 4, 3, 8, hair[0]);
  if (p.pose === 'turn') { s(hx + 3, hy + 5, PAL.N0); s(hx + 6, hy + 5, PAL.N0); s(hx + 4, hy + 8, sk[0]); s(hx + 5, hy + 8, sk[0]); }
  else { s(hx + 7, hy + 5, PAL.N0); s(hx + 8, hy + 7, sk[2]); s(hx + 7, hy + 8, sk[0]); }
  r(hx + 3, hy + 10, 3, 2, sk[0]);
  // arms
  if (p.pose === 'cheer') {
    r(15, 7, 3, 8, top[1]); r(15, 3, 3, 4, sk[1]); r(4, 8, 3, 7, top[0]); r(4, 4, 3, 4, sk[0]);
  } else if (p.pose === 'type') {
    r(11, 20, 9, 2, top[1]); r(17, 22, 8, 1, PAL.G3); r(17, 17, 1, 5, PAL.G4); s(18, 21, sk[2]);
    for (let j = 0; j < 3; j++) s(hx + 8, hy + 5 + j, PAL.C5);
  } else if (p.pose === 'hold') {
    r(15, 16, 3, 7, top[1]); r(17, 22, 6, 2, top[1]); r(23, 22, 3, 2, sk[1]);
  } else {
    r(13, 18, 3, 6, top[1]); r(13, 23, 6, 2, top[1]); r(18, 23, 3, 2, sk[1]);
  }
  // the outline on the shadow side (a 1 px dark edge left), the rim on the lit side (right)
  const src = new Int32Array(img.c);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (src[y * W + x] < 0) continue;
    if (x === 0 || src[y * W + x - 1] < 0) img.c[y * W + x] = stepColor(src[y * W + x], -2);
    else if (x === W - 1 || src[y * W + x + 1] < 0) img.c[y * W + x] = stepColor(src[y * W + x], 1);
  }
  return img;
});
/** a beanbag under a seated staffer (its colour from the seed), drawn before the staffer */
export const beanbag = (b: Buf, x: number, y: number, seed: number) => {
  const cols = [[PAL.R0, PAL.R1, PAL.R2], [PAL.C1, PAL.C2, PAL.C3], [PAL.W3, PAL.W4, PAL.W5], [PAL.F2, PAL.F3, PAL.F4], [PAL.L0, PAL.L1, PAL.L2], [PAL.U2, PAL.U3, PAL.U4]][seed % 6];
  for (let j = 0; j < 14; j++) for (let i = 0; i < 30; i++) {
    const d = Math.hypot((i - 15) / 15, (j - 8) / 8);
    if (d >= 1) continue;
    const c = j < 4 && i > 8 ? cols[2] : d > 0.82 ? cols[0] : i < 10 ? cols[0] : cols[1];
    b.set(x + i, y + j, c);
  }
  for (let i = 4; i < 26; i++) if (bayer(x + i, y + 14) < 0.6) b.set(x + i, y + 14, PAL.N0);
};
/** the backs of a crowd (heads and shoulders from behind), tiled across [x0, x1) from row y, `rows` deep; heads bob on
 *  `f` (a held 2-step stir, per head), lit from `light` above (the screen they face) */
export const crowdBacks = (b: Buf, x0: number, x1: number, y: number, rows: number, f: number, o: {seed?: number; light?: number; gap?: number; phones?: number[]; cheer?: boolean; dim?: number} = {}) => {
  const seed = o.seed ?? 3, gap = o.gap ?? 13;
  for (let r = rows - 1; r >= 0; r--) {
    const yy = y + r * 9, off = r % 2 ? Math.floor(gap / 2) : 0;
    for (let x = x0 - off, k = 0; x < x1; x += gap, k++) {
      const id = r * 97 + k * 13 + seed;
      const top = TOPS[id % TOPS.length], hair = HAIRS[(id * 7) % HAIRS.length];
      const bob = (Math.floor(f / 8) + id) % 5 === 0 ? -1 : 0;
      const dim = (c: number) => stepColor(c, -(o.dim ?? 0) - (rows - 1 - r));
      // shoulders
      for (let j = 0; j < 9; j++) for (let i = 0; i < 14; i++) { const d = Math.hypot((i - 7) / 7.5, (j - 8) / 7); if (d < 1) b.set(x + i - 2, yy + 6 + j + bob, dim(i < 4 ? top[0] : i > 10 ? top[2] : top[1])); }
      // head from behind
      for (let j = 0; j < 9; j++) for (let i = 0; i < 8; i++) { const d = Math.hypot((i - 3.5) / 4, (j - 4) / 4.6); if (d < 1) b.set(x + i + 1, yy + j - 2 + bob, dim(j < 3 ? hair[1] : hair[0])); }
      if (o.light !== undefined && (id % 4 === 0)) b.set(x + 4, yy - 2 + bob, o.light);
      if (o.cheer && id % 3 === 0) { rect(x + 9, yy - 8 + bob, 2, 8, b.ink(dim(top[1]))); rect(x + 9, yy - 10 + bob, 2, 2, b.ink(dim(PAL.S4))); }
      if (o.phones && o.phones.includes(id % 7)) { rect(x + 8, yy - 9 + bob, 4, 6, b.ink(PAL.N0)); rect(x + 9, yy - 8 + bob, 2, 4, b.ink(PAL.C6)); rect(x + 9, yy - 3 + bob, 2, 4, b.ink(dim(PAL.S3))); }
    }
  }
};
void hash; void FACE_INK; void P;
export type {Prim, Part, Adjust, Stamp, FigureDef, Img, HeadSpec, TorsoSpec, V2};

// ------------------------------------------------------------------ bust hair styles (head-local, the civic head)
export type BustHair = 'side' | 'crop' | 'curly' | 'tousled' | 'bob' | 'long' | 'silver' | 'bun';
/** a bust hairstyle as parts + planes (material 'hair'); the hairline leaves the brow its forehead */
export const bustHair = (style: BustHair): {parts: Part[]; adjust: Adjust[]} => {
  const H = (...pts: number[]): Part => ({group: 'hair', mat: 'hair', tone: 3, prims: [P.poly(...pts)]});
  switch (style) {
    case 'crop': return {parts: [H(46, 35, 48, 26, 55, 20, 65, 17, 76, 18, 84, 23, 88, 32, 88, 44, 86, 51, 84, 51, 83, 42, 79, 36, 71, 32, 62, 31, 54, 31, 49, 33)],
      adjust: [plane('hair', 4, P.poly(48, 30, 52, 23, 59, 19, 66, 18, 60, 22, 53, 27)), plane('hair', 2, P.line(56, 24, 78, 22), P.line(58, 28, 84, 29)), plane('hair', 1, P.poly(84, 40, 88, 42, 86, 51, 84, 51))]};
    case 'curly': {
      const pts: number[] = [];
      const ring: Array<[number, number]> = [[44, 34], [44, 26], [48, 20], [53, 15], [59, 12], [66, 11], [73, 12], [80, 15], [86, 20], [90, 27], [92, 35], [91, 44], [89, 52], [86, 53], [85, 44], [81, 37], [74, 33], [66, 31], [58, 31], [51, 32]];
      ring.forEach(([x, y], i) => { pts.push(x, y); if (i < 14 && i > 0) { const [nx, ny] = ring[i + 1]; pts.push((x + nx) / 2 + (y < 30 ? 0 : 1.5), (y + ny) / 2 - 2); } });
      return {parts: [H(...pts)], adjust: [
        plane('hair', 4, P.ell(52, 22, 4, 3), P.ell(60, 16, 4, 3), P.ell(69, 14, 4, 2.5)),
        plane('hair', 2, P.ell(72, 22, 3, 2), P.ell(80, 26, 3, 2), P.ell(64, 25, 3, 2), P.ell(84, 36, 2, 3), P.ell(76, 31, 3, 2)),
        plane('hair', 1, P.poly(85, 42, 90, 42, 89, 52, 86, 52)),
      ]};
    }
    case 'tousled': return {parts: [H(44, 37, 44, 29, 49, 21, 55, 16, 62, 13, 68, 15, 74, 12, 80, 16, 86, 19, 88, 26, 91, 33, 90, 44, 88, 52, 85, 52, 84, 43, 80, 37, 73, 33, 67, 34, 61, 32, 55, 34, 50, 33, 47, 38)],
      adjust: [plane('hair', 4, P.poly(46, 32, 49, 24, 55, 18, 61, 15, 57, 21, 51, 28)), plane('hair', 2, P.line(58, 22, 70, 18), P.line(70, 18, 84, 24), P.line(56, 28, 66, 25), P.line(68, 26, 86, 31)), plane('hair', 1, P.poly(84, 41, 89, 43, 88, 52, 85, 52))]};
    case 'bob': return {parts: [H(43, 41, 44, 29, 51, 20, 62, 15, 75, 15, 85, 20, 91, 30, 93, 46, 94, 66, 92, 82, 86, 88, 79, 86, 80, 74, 83, 62, 84, 48, 80, 39, 72, 34, 62, 33, 55, 33, 49, 36, 46, 40)],
      adjust: [plane('hair', 4, P.poly(45, 36, 47, 27, 54, 20, 63, 17, 57, 23, 50, 30)), plane('hair', 2, P.line(60, 22, 84, 26), P.line(86, 34, 90, 64), P.line(84, 66, 86, 84)), plane('hair', 1, P.poly(80, 44, 85, 44, 86, 70, 82, 84, 79, 84, 82, 66)), plane('hair', 5, P.line(48, 28, 54, 21))]};
    case 'long': return {parts: [H(43, 41, 44, 29, 51, 20, 62, 15, 75, 15, 85, 20, 91, 30, 93, 48, 95, 72, 98, 96, 100, 112, 86, 114, 80, 100, 82, 80, 84, 62, 84, 48, 80, 39, 72, 34, 62, 33, 55, 33, 49, 36, 46, 40)],
      adjust: [plane('hair', 4, P.poly(45, 36, 47, 27, 54, 20, 63, 17, 57, 23, 50, 30)), plane('hair', 2, P.line(60, 22, 84, 26), P.line(87, 34, 92, 70), P.line(92, 72, 96, 104), P.line(85, 68, 88, 100)), plane('hair', 1, P.poly(80, 44, 85, 44, 85, 72, 84, 96, 82, 100, 80, 90, 82, 66))]};
    case 'silver': return {parts: [H(46, 36, 48, 27, 55, 21, 65, 18, 76, 18, 84, 23, 88, 32, 88, 45, 86, 52, 84, 52, 83, 42, 79, 36, 71, 32, 62, 31, 54, 31, 49, 34)],
      adjust: [plane('hair', 4, P.poly(48, 31, 52, 24, 59, 20, 66, 19, 60, 23, 53, 28)), plane('hair', 2, P.line(57, 24, 80, 23), P.line(56, 29, 85, 30)), plane('hair', 1, P.poly(84, 40, 88, 43, 86, 52, 84, 52))]};
    case 'bun': return {parts: [H(44, 40, 45, 29, 52, 20, 63, 15, 75, 15, 85, 20, 90, 30, 90, 46, 88, 54, 85, 54, 84, 46, 80, 38, 72, 33, 62, 32, 55, 33, 49, 36), {group: 'bun', mat: 'hair', tone: 3, prims: [P.ell(88, 24, 8, 7)]}],
      adjust: [plane('hair', 4, P.poly(46, 35, 48, 27, 55, 20, 63, 17, 57, 23, 51, 30)), plane('hair', 2, P.line(60, 22, 86, 28), P.line(84, 21, 92, 27)), plane('hair', 1, P.poly(84, 42, 89, 44, 88, 54, 85, 54))]};
    default: return {parts: [H(44, 37, 46, 29, 53, 22, 63, 17, 75, 17, 84, 22, 89, 31, 90, 42, 89, 52, 86, 51, 85, 42, 81, 37, 73, 33, 64, 33, 56, 34, 50, 37, 46, 41)],
      adjust: [plane('hair', 4, P.poly(46, 34, 50, 27, 58, 22, 66, 20, 60, 25, 52, 31)), plane('hair', 2, P.line(60, 28, 80, 26), P.line(70, 31, 86, 34), P.line(64, 20, 82, 22)), plane('hair', 1, P.line(66, 19, 84, 25)), plane('hair', 1, P.poly(85, 42, 89, 44, 89, 52, 86, 51))]};
  }
};
/** glasses on the bust (stamps over the eyes): thin frames, a glint on the near lens */
export const bustGlasses = (h: HeadSpec, col: number, glint = PAL.C8): Stamp[] => {
  const dy = h.dy ?? 0, dx = h.dx ?? 0;
  return [
    {x: 51 + dx, y: 43 + dy, rows: ['gggggggggggggg', 'g............g', 'g............g', 'g............g', 'g.........G..g', '.gggggggggggg.'], pal: {g: col, G: glint}},
    {x: 40 + dx, y: 44 + dy, rows: ['gggggg', 'g....g', 'g....g', 'g....g', '.gggg.'], pal: {g: col}},
    {x: 46 + dx, y: 45 + dy, rows: ['ggggg'], pal: {g: col}},
    {x: 65 + dx, y: 44 + dy, rows: ['ggggg.........', '.....gggggg...', '...........ggg'], pal: {g: col}},
  ];
};
/** a lanyard: two cords from behind the collar down to a badge with a word on it (bust coordinates) */
export const bustLanyard = (cord: string, badge: string, sy = 104): {parts: Part[]; adjust: Adjust[]} => ({
  parts: [
    {group: 'cordL', mat: cord, tone: 3, prims: [P.poly(52, sy, 54, sy, 59, sy + 24, 57, sy + 24)]},
    {group: 'cordR', mat: cord, tone: 2, prims: [P.poly(72, sy - 1, 74, sy - 1, 64, sy + 24, 62, sy + 24)]},
    {group: 'badge', mat: badge, tone: 4, prims: [P.rect(54, sy + 23, 13, 9)]},
  ],
  adjust: [plane(badge, 2, P.rect(56, sy + 25, 9, 2)), plane(badge, 1, P.rect(56, sy + 28, 6, 1))],
});
