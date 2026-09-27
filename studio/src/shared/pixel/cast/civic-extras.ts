// MR. MAS — cast: the CIVIC EXTRAS (Ep1 Acts Two and Three; new file, owned by the `v3-art-b` pass). Unnamed people
// who fill the rooms: never a real person, never a likeness, each one a plain design from the civic kit.
//   drawSenator(b, footX, footY, v, pose)   A SENATOR (sc 15): three variants (v 0..2: grey hair and a navy suit, dark
//                                           hair and a charcoal one, a woman in a teal jacket), seated at the dais (the
//                                           dais overpaints the legs); pose 'sit' | 'lean' (the dais leans in) | 'sign'
//                                           (turning the sheet over to sign it) | 'up' (holding it up)
//   galleryTile(v, gasp) / drawGallery      the hearing's GALLERY: tiled held drawings, identical spectators in rows
//                                           (the script's joke); `gasp` is the one drawing all at once (mouths open, a
//                                           hand up)
//   drawSigner(b, footX, footY, v, pose)    a SIGNER at the rooftop table (sc 17): v 0 (a quiet grey cardigan, a chess
//                                           piece in his hand: the unplated insider egg) · v 1 (a dark suit, dark glasses
//                                           in his top pocket) · v 2 (a scarf); pose 'stand' | 'sign' | 'walk'
//   drawAnchor(b, x, y, st)                 the invented NEWS ANCHOR (sc 14): a woman at a desk, 30 x 34, her mouth on its
//                                           own clock (the lag is the caller's: pass the mouth that is late)
//   drawRumptWindow(b, x, y, st)            RUMPT in the lit window (sc 14, the cold open's flash 7): a SILHOUETTE only
//                                           (guardrails: props and pose, never features): a plain round head, square
//                                           suit shoulders, the over-long tie, a phone's glow on him; `nod` 0 | 1 (on
//                                           the audio's beat), `glow` on | off
//   drawTasyaStage(b, footX, footY, st)     TASYA walking on at DevDay (sc 22, on the monitor): laughing, arms open (a pose
//                                           tasya-speak.ts's room sprite doesn't have; the same design redrawn here)
import {Buf, rect, line, bayer} from '../px';
import {PAL} from '../palette';
import {FigureDef, Img, LightRig, Stamp, renderFigure, blitImg} from '../figure';
import {memo} from './kit';
import {roomBody, headStamp, RoomArm, RoomLegs, ROOM_FW, ROOM_FH, ROOM_FOOT, SKIN, SUIT, SHIRT_WHITE, HAIR} from './civic-kit';

const DARK = [PAL.N0, PAL.N0, PAL.N0, PAL.N0, PAL.N0, PAL.N0];
const SHOE = [PAL.N0, PAL.N0, PAL.N1, PAL.G1, PAL.G3, PAL.G4];
const rig = (ramps: Record<string, number[]>, back: Record<string, number> = {}): LightRig => ({
  key: [-0.55, -0.83], keyBand: 3, shadowBand: 3, rim: true, outline: true,
  back: [1, -0.1], backBand: 1, backRamp: back, ramps,
  groupBands: {torso: {key: 4, shadow: 3}, armN: {key: 2, shadow: 2}, armF: {key: 1, shadow: 2}, legN: {key: 2, shadow: 2}, legF: {key: 1, shadow: 2}},
  keyGain: (_x, y) => (y < 48 ? 1 : Math.max(0.25, 1 - (y - 48) / 34)),
});
const HP = {o: ['skin', 0], '1': ['skin', 1], '2': ['skin', 2], '3': ['skin', 3], '4': ['skin', 4], '5': ['skin', 5], h: ['hair', 1], H: ['hair', 3], b: ['hair', 0], e: ['dark', 0], m: ['skin', 1], M: ['dark', 0], G: ['glass', 4], f: ['dark', 0]} as Record<string, [string, number]>;
const head = (hair: 'short' | 'bob' | 'bald' | 'part') => {
  const top = hair === 'bald'
    ? ['....ooooooo.....', '..o3333333oo....', '.o33334444443o..', '.hh3344444444o..']
    : hair === 'bob'
      ? ['...hhhhhhhh.....', '.hhHHHHHHHHhh...', 'hHHHHHHHHHHHHh..', 'hHHHHHH3444HHh..']
      : hair === 'part'
        ? ['....hhhhhhh.....', '..hhHHHHHHHhh...', '.hHHHHHHHHHHHh..', '.hHHHHHHHH44o...']
        : ['....hhhhhhh.....', '..hhHHHHHHHh....', '.hHHHHHHHHHHh...', '.hHHHHHHH344o...'];
  const mid = hair === 'bob'
    ? ['hHHHH2233444Ho..', 'hHHH2234bb4bo...', 'hHHh22334e44eo..', 'hHHo2233444444o.', 'hHHo22334444445.', 'hHHo2233444444o.', '.hho1223344444o.', '..o12233mm44o...', '...o1223344o....', '....o11223o.....', '.....oo112o.....', '......o112o.....', '......o112o.....']
    : ['hHHHh2233444o...', 'hHHh2234bb4bo...', 'hHh22334e44eo...', 'hHo122334444444.', 'hHo1223344444445', '.ho12233444444o.', '..o1223344444o..', '..o12233mm44o...', '...o1223344o....', '....o11223o.....', '.....oo112o.....', '......o112o.....', '......o112o.....'];
  return [...top, ...mid];
};

// ------------------------------------------------------------------ senators
export type SenatorPose = 'sit' | 'lean' | 'sign' | 'up';
const SEN = [
  {kind: 'suit' as const, suit: SUIT.navy, hair: HAIR.silver, skin: SKIN.light, style: 'part' as const, tie: [PAL.N0, PAL.R0, PAL.R1, PAL.R2, PAL.R3, PAL.S6]},
  {kind: 'suit' as const, suit: SUIT.charcoal, hair: HAIR.dark, skin: SKIN.deep, style: 'short' as const, tie: [PAL.N0, PAL.N5, PAL.N6, PAL.N7, PAL.N8, PAL.G6]},
  {kind: 'pantsuit' as const, suit: SUIT.teal, hair: HAIR.brown, skin: SKIN.medium, style: 'bob' as const, tie: [PAL.N0, PAL.N5, PAL.N6, PAL.N7, PAL.N8, PAL.G6]},
];
const senatorImg = memo((p: {v: 0 | 1 | 2; pose: SenatorPose; mouth: 'rest' | 'open'}): Img => {
  const s = SEN[p.v];
  const arm: RoomArm = p.pose === 'sign' ? 'write' : p.pose === 'up' ? 'up' : p.pose === 'lean' ? 'reach' : 'down';
  const body = roomBody({kind: s.kind}, arm, 'stand', {armF: p.pose === 'up' ? 'spread' : undefined});
  const rows = head(s.style).slice();
  if (p.mouth === 'open') rows[11] = rows[11].replace('mm', 'mM');
  const stamps: Stamp[] = [...body.stamps, headStamp(rows, body.bob, HP, p.pose === 'lean' ? 2 : 0)];
  const fig: FigureDef = {w: ROOM_FW, h: ROOM_FH, parts: body.parts, adjust: body.adjust, stamps};
  return renderFigure(fig, rig({skin: s.skin, hair: s.hair, suit: s.suit, shirt: SHIRT_WHITE, tie: s.tie, shoe: SHOE, dark: DARK, glass: [PAL.N0, PAL.G3, PAL.G4, PAL.G5, PAL.C4, PAL.C6]}, {skin: PAL.S3, suit: PAL.N4}));
});
export const drawSenator = (b: Buf, footX: number, footY: number, v: 0 | 1 | 2, pose: SenatorPose = 'sit', o: {flip?: boolean; mouth?: 'rest' | 'open'; clip?: (x: number, y: number) => boolean} = {}) => {
  const img = senatorImg({v, pose, mouth: o.mouth ?? 'rest'});
  const fx = o.flip ? ROOM_FW - 1 - ROOM_FOOT[0] : ROOM_FOOT[0];
  blitImg(b, img, footX - fx, footY - ROOM_FOOT[1], {flip: o.flip, clip: o.clip});
};

// ------------------------------------------------------------------ the gallery (identical spectators, tiled)
export const GALLERY_TILE = {w: 18, h: 24};
/** one spectator: head and shoulders, facing right (toward the dais), a plain jacket; `gasp` = mouth open, a hand up */
export const galleryTile = memo((p: {gasp: boolean}): Img => {
  const {w, h} = GALLERY_TILE;
  const img: Img = {w, h, c: new Int32Array(w * h).fill(-1)};
  const rows = p.gasp ? [
    '.....hhhhh........',
    '....hHHHHHh.......',
    '...hHHH3444o......',
    '...hHH33e4e4o.....',
    '...hH3344444o.....',
    '....o3344M44o...s.',
    '....o334MM4o...ss.',
    '.....o33344o...s..',
    '......o334o...ss..',
    '...jjjjjjjjjjjjs..',
    '..jJJJJJwwJJJjj...',
    '.jJJJJJJwwJJJJJj..',
    'jJJJJJJJJJJJJJJJj.',
    'jJJJJJJJJJJJJJJJj.',
  ] : [
    '.....hhhhh........',
    '....hHHHHHh.......',
    '...hHHH3444o......',
    '...hHH33e4e4o.....',
    '...hH3344444o.....',
    '....o334444445....',
    '....o3344mm4o.....',
    '.....o33344o......',
    '......o334o.......',
    '...jjjjjjjjjj.....',
    '..jJJJJJwwJJJj....',
    '.jJJJJJJwwJJJJj...',
    'jJJJJJJJJJJJJJJj..',
    'jJJJJJJJJJJJJJJJj.',
  ];
  const pal: Record<string, number> = {h: PAL.B1, H: PAL.B2, '3': PAL.S3, '4': PAL.S4, '5': PAL.S5, o: PAL.S1, e: PAL.N0, m: PAL.S2, M: PAL.N0, j: PAL.N1, J: PAL.N3, w: PAL.P1, s: PAL.S4};
  rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = pal[r[i]]; if (c !== undefined) img.c[(j + 6) * w + i] = c; } });
  return img;
});
/** rows of the same drawing behind a rail: x0..x1, the rows' feet from y0 down by GALLERY_TILE.h - 8 each */
export const drawGallery = (b: Buf, x0: number, x1: number, y0: number, rowsN: number, o: {gasp?: boolean; clip?: (x: number, y: number) => boolean} = {}) => {
  const t = galleryTile({gasp: !!o.gasp});
  for (let r = 0; r < rowsN; r++) {
    const y = y0 + r * (GALLERY_TILE.h - 10);
    const off = r % 2 ? GALLERY_TILE.w / 2 : 0;
    for (let x = x0 - off; x < x1; x += GALLERY_TILE.w) blitImg(b, t, Math.round(x), y, {clip: o.clip});
    // the bench rail in front of each row (dark wood, a lit edge)
    rect(x0, y + GALLERY_TILE.h - 4, x1 - x0, 3, b.ink(PAL.D2)); rect(x0, y + GALLERY_TILE.h - 4, x1 - x0, 1, b.ink(PAL.D4));
  }
};

// ------------------------------------------------------------------ signers (the rooftop)
export type SignerPose = 'stand' | 'sign' | 'walk';
const SIG = [
  {kind: 'blazer' as const, suit: SUIT.charcoal, hair: HAIR.grey, skin: SKIN.light, style: 'short' as const},
  {kind: 'suit' as const, suit: SUIT.black, hair: HAIR.dark, skin: SKIN.medium, style: 'part' as const},
  {kind: 'blazer' as const, suit: SUIT.slate, hair: HAIR.silver, skin: SKIN.light, style: 'bald' as const},
];
const signerImg = memo((p: {v: 0 | 1 | 2; pose: SignerPose; legs: RoomLegs}): Img => {
  const s = SIG[p.v];
  const body = roomBody({kind: s.kind}, p.pose === 'sign' ? 'write' : 'down', p.legs);
  const stamps: Stamp[] = [...body.stamps, headStamp(head(s.style), body.bob, HP)];
  // v 0: the chess piece in his hand (the insider egg): a tiny white knight's head
  if (p.v === 0 && p.pose !== 'sign') stamps.push({x: 26, y: 38 + body.bob, rows: ['.P.', 'PP.', '.P.', 'PPP'], pal: {P: ['piece', 4]}});
  const fig: FigureDef = {w: ROOM_FW, h: ROOM_FH, parts: body.parts, adjust: body.adjust, stamps};
  return renderFigure(fig, rig({skin: s.skin, hair: s.hair, suit: s.suit, shirt: SHIRT_WHITE, tie: [PAL.N0, PAL.N3, PAL.N4, PAL.N5, PAL.N6, PAL.N7], shoe: SHOE, dark: DARK, glass: DARK, piece: [PAL.P0, PAL.P1, PAL.P2, PAL.P2, PAL.W9, PAL.W9]}, {skin: PAL.F6, suit: PAL.F4, hair: PAL.G6}));
});
export const drawSigner = (b: Buf, footX: number, footY: number, v: 0 | 1 | 2, pose: SignerPose = 'stand', o: {flip?: boolean; f?: number; clip?: (x: number, y: number) => boolean} = {}) => {
  const legs: RoomLegs = pose === 'walk' ? (['w0', 'w1', 'w2', 'w3'] as const)[Math.floor((o.f ?? 0) / 3) % 4] : 'stand';
  const img = signerImg({v, pose, legs});
  const fx = o.flip ? ROOM_FW - 1 - ROOM_FOOT[0] : ROOM_FOOT[0];
  blitImg(b, img, footX - fx, footY - ROOM_FOOT[1], {flip: o.flip, clip: o.clip});
};

// ------------------------------------------------------------------ the news anchor (an invented face)
/**
 * 30 x 34: an anchor at a desk, framed chest-up, a blazer, a bob; `mouth` 0 shut · 1 open (the caller runs it a
 * beat late against the voice). `px` 1 = native; 2 = drawn with 2 x 2 cells (the phone's screen in the OTS).
 */
export const drawAnchor = (b: Buf, x: number, y: number, st: {mouth: 0 | 1; px?: 1 | 2; blink?: boolean}) => {
  const rows = [
    '..........hhhhhhh.............',
    '........hhHHHHHHHhh...........',
    '.......hHHHHHHHHHHHh..........',
    '......hHHHH4444444HHh.........',
    '......hHH444444444HHh.........',
    '......hH4444444444HHh.........',
    '......hH44ee4444ee44Hh........',
    '......hH44444444444HHh........',
    '......hH444443344444Hh........',
    '......hHH44444444444Hh........',
    '......hHH444mmmm444HHh........',
    '......hHHH444444444HHh........',
    '.......hHH34444443HHh.........',
    '........hH33444433Hh..........',
    '..........33444433............',
    '..........33333333............',
    '.....BBBBBBwwwwwwBBBBBB.......',
    '...BBBBBBBBBwwwwBBBBBBBBB.....',
    '..BBBBBBBBBBBwwBBBBBBBBBBB....',
    '.BBbBBBBBBBBBBBBBBBBBBBbBBB...',
    '.BBbBBBBBBBBBBBBBBBBBBBbBBB...',
    'BBBbBBBBBBBBBBBBBBBBBBBbBBBB..',
  ];
  if (st.mouth) { rows[10] = '......hHH444mMMm444HHh........'; rows[11] = '......hHHH444MM4444HHh........'; }
  if (st.blink) rows[6] = '......hH44444444444HHh........';
  const pal: Record<string, number> = {h: PAL.W4, H: PAL.W6, '4': PAL.S5, '3': PAL.S4, e: PAL.N1, m: PAL.R1, M: PAL.N0, B: PAL.C3, b: PAL.C2, w: PAL.P2};
  const s = st.px ?? 1;
  rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = pal[r[i]]; if (c !== undefined) rect(x + i * s, y + j * s, s, s, b.ink(c)); } });
  // the desk's edge, a glossy news desk
  rect(x, y + 22 * s, 30 * s, 3 * s, b.ink(PAL.N3)); rect(x, y + 22 * s, 30 * s, s, b.ink(PAL.G5));
};

// ------------------------------------------------------------------ RUMPT, in the lit window (a silhouette)
/**
 * The lit window's silhouette at the window's scale (≈ 26 px tall, waist up): black against the window's warm light,
 * a plain rounded head with no hair shape and no features, square suit shoulders, the over-long tie as a darker shape
 * falling past the sill; one arm up holding the phone, whose cool glow lights his shape's edge. nod 1 = the head one
 * pixel down (on the audio's beat). glow false = the phone off (the glow gone, only the window's light).
 */
export const drawRumptWindow = (b: Buf, x: number, y: number, st: {nod: 0 | 1; glow: boolean; size?: number}) => {
  // the shapes are geometry at `size` (1 = 26 px tall, waist up), re-rasterised at each size: never a scaled sprite
  const k = st.size ?? 1;
  const S = PAL.N0;
  const put = (i: number, j: number, c = S) => b.set(x + i, y + j, c);
  const H = Math.round(30 * k), W = Math.round(26 * k), cx = 13 * k;
  // shoulders + chest (square suit shoulders), the neck
  for (let j = Math.round(14 * k); j < H; j++) for (let i = 0; i < W; i++) {
    const jj = j / k, w = jj < 17 ? 9 + (jj - 14) * 3 : 12;
    if (Math.abs(i / k - 13) <= w) put(i, j);
  }
  for (let j = Math.round(10 * k); j < Math.round(15 * k); j++) for (let i = Math.round(10 * k); i < Math.round(16 * k); i++) put(i, j);
  const hy = st.nod * Math.max(1, Math.round(k));
  // the head: a plain oval (no hair shape, no features), an ear's bump
  for (let j = 0; j < Math.round(12 * k); j++) for (let i = 0; i < W; i++) if (Math.hypot((i - 12.5 * k) / (5.6 * k), (j - 5.5 * k) / (6.2 * k)) <= 1) put(i, j + hy);
  for (let j = Math.round(4 * k); j < Math.round(8 * k); j++) put(Math.round(18.4 * k), j + hy);
  // the over-long tie: a slightly lighter black, down past the chest's bottom edge (his allowed prop)
  for (let j = Math.round(15 * k); j < H + Math.round(4 * k); j++) for (let i = Math.round(12 * k); i < Math.round(15 * k); i++) put(i, j, PAL.N1);
  // the arm up holding the phone in front of his face (camera-left side)
  for (let j = Math.round(12 * k); j < Math.round(24 * k); j++) for (let i = Math.round(3 * k); i < Math.round(6 * k); i++) put(i, j);
  for (let i = Math.round(3 * k); i < Math.round(9 * k); i++) for (let j = Math.round(11 * k); j < Math.round(13 * k) + 1; j++) put(i, j);
  const px = Math.round(6 * k), py = Math.round(5 * k) + hy, pw = Math.max(3, Math.round(3 * k)), ph = Math.max(5, Math.round(6 * k));
  if (st.glow) {
    rect(x + px, y + py, pw, ph, b.ink(PAL.C6)); rect(x + px, y + py, pw, 1, b.ink(PAL.C8));
    if (k >= 2) { rect(x + px + 1, y + py + ph - 3, pw - 2, 2, b.ink(PAL.G3)); } // the clip's grey tag strip at its foot
    // the phone's cool light on the edge of his face and his shoulder (a 1-px rim toward it)
    for (let j = Math.round(1 * k); j < Math.round(11 * k); j++) { const i0 = Math.round(12.5 * k - 5.6 * k * Math.sqrt(Math.max(0, 1 - ((j - 5.5 * k) / (6.2 * k)) ** 2))); b.set(x + i0, y + j + hy, PAL.C2); }
    for (let j = Math.round(15 * k); j < Math.round(22 * k); j++) b.set(x + Math.round(2 * k), y + j, PAL.C1);
  } else rect(x + px, y + py, pw, ph, b.ink(PAL.N1));
  void cx;
};

// ------------------------------------------------------------------ TASYA at DevDay: walking on, arms open, laughing
const TASYA_HEAD = [
  '....ooooooo.....',
  '..o3344444oo....',
  '.o33444444443o..',
  '.o3344444444ho..',
  'gg33ffffGfff4o..',
  'gg3f44f4f44fo...',
  'g33f4e4ffe4fo...',
  'go122334444444o.',
  'go1223344444445.',
  '.oo222333444ww..',
  '..ooTTTTTTTwo...',
  '..owwTTTTTww4o..',
  '...owwwwwwwo....',
  '....owwwwwo.....',
  '.....oo112o.....',
  '......o112o.....',
  '......o112o.....',
];
const tasyaStageImg = memo((p: {legs: RoomLegs; laugh: boolean}): Img => {
  const body = roomBody({kind: 'suit'}, 'spread', p.legs, {tie: false});
  const rows = TASYA_HEAD.slice();
  if (!p.laugh) { rows[10] = '..oo2223mmm4wo..'; rows[11] = '..owww22333ww4o.'; }
  const stamps: Stamp[] = [...body.stamps, headStamp(rows, body.bob, {...HP, g: ['grey', 3], w: ['beard', 3], T: ['teeth', 4], f: ['dark', 0], G: ['glass', 4]})];
  const fig: FigureDef = {w: ROOM_FW, h: ROOM_FH, parts: body.parts, adjust: body.adjust, stamps};
  return renderFigure(fig, rig({skin: SKIN.light, hair: HAIR.grey, grey: HAIR.grey, beard: HAIR.grey, suit: SUIT.navy, shirt: SHIRT_WHITE, tie: SUIT.navy, shoe: SHOE, dark: DARK, teeth: [PAL.P0, PAL.P0, PAL.P1, PAL.P1, PAL.P2, PAL.P2], glass: [PAL.N0, PAL.G3, PAL.G4, PAL.G5, PAL.C4, PAL.C6]}, {skin: PAL.C3, suit: PAL.C2}));
});
export const drawTasyaStage = (b: Buf, footX: number, footY: number, st: {f: number; walk: boolean; laugh?: boolean; flip?: boolean}) => {
  const legs: RoomLegs = st.walk ? (['w0', 'w1', 'w2', 'w3'] as const)[Math.floor(st.f / 3) % 4] : 'stand';
  const img = tasyaStageImg({legs, laugh: st.laugh ?? true});
  const fx = st.flip ? ROOM_FW - 1 - ROOM_FOOT[0] : ROOM_FOOT[0];
  blitImg(b, img, footX - fx, footY - ROOM_FOOT[1], {flip: st.flip});
};
void line; void bayer;
